#!/usr/bin/env node
/* 验证：
 * 1) 型号规格列正确拼接（用户场景：valveName=型号前缀、spec=口径数字/DNxx）
 * 2) 5 种模板文件名正确
 */
import fs from 'node:fs';
import path from 'node:path';
import JSZip from 'jszip';
import _SNAP_chisun from '../utils/tpl_chisun_nsh.json' with { type: 'json' };
import _SNAP_zs     from '../utils/tpl_zs_changsheng.json' with { type: 'json' };
import _SNAP_chg    from '../utils/tpl_pi_changqi.json' with { type: 'json' };
import _SNAP_multi  from '../utils/tpl_pi_chisun_multi.json' with { type: 'json' };
import _SNAP_vtb    from '../utils/tpl_pi_chisun_vtb.json' with { type: 'json' };
import builderCJS from '../utils/contract-xlsx-builder.js';
const { buildContract } = builderCJS;

const _B64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const _B64_LOOKUP = Object.fromEntries([..._B64_CHARS].map((c, i) => [c, i]));
function b64u(b64) {
  const pad = b64.endsWith('==') ? 2 : (b64.endsWith('=') ? 1 : 0);
  const out = new Uint8Array(Math.floor((b64.length * 3) / 4) - pad);
  let p = 0, buffer = 0, bits = 0;
  for (let i = 0; i < b64.length; i++) {
    const c = b64.charAt(i); if (c === '=') break;
    const v = _B64_LOOKUP[c]; if (v === undefined) continue;
    buffer = (buffer << 6) | v; bits += 6;
    if (bits >= 8) { bits -= 8; out[p++] = (buffer >> bits) & 0xff; }
  }
  return out;
}
const TEMPLATES_ARR = [
  { key: 'chisun_nsh',      family: 'cn_contract', displayName: {}, bytes: b64u(_SNAP_chisun), meta: {} },
  { key: 'zs_changsheng',   family: 'cn_contract', displayName: {}, bytes: b64u(_SNAP_zs),     meta: {} },
  { key: 'pi_changqi',      family: 'en_pi',       displayName: {}, bytes: b64u(_SNAP_chg),    meta: {} },
  { key: 'pi_chisun_multi', family: 'en_pi',       displayName: {}, bytes: b64u(_SNAP_multi),  meta: {} },
  { key: 'pi_chisun_vtb',   family: 'en_pi',       displayName: {}, bytes: b64u(_SNAP_vtb),    meta: {} }
];
const FILE_NAME_PREFIX = {
  chisun_nsh:       '奇胜',
  zs_changsheng:    '长胜',
  pi_changqi:       'Changqi',
  pi_chisun_multi:  'ChisunMulti',
  pi_chisun_vtb:    'ChisunVTB'
};
const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, '0');
const dd = String(today.getDate()).padStart(2, '0');

// ⚠️ 用户真实字段场景（与小程序 quoteItems → items 适配一致）：
//   valveName = QBZ73X-10C（型号前缀）
//   spec = 80（口径数字 / DN80）
//   productName = valveName
//   model = valveName（型号前缀）
//   productType = 中文产品名（'单向薄阀座可更换型刀闸阀' 等）
const RAW_ITEMS = [
  { valveName: 'QBZ73X-10C', spec: '80',  productType: '单向薄阀座可更换型刀闸阀',
    qty: 36, unit: 780, gatePlateThickness: 16, maxPressure: 10, unitWeight: 21.2, laps: 68, torque: 15 },
  { valveName: 'QWV973X',    spec: 'DN100', productType: '单向厚阀座可更换型刀闸阀',
    qty: 36, unit: 460, gatePlateThickness: '',  maxPressure: '',   unitWeight: 15.6, laps: '',  torque: '' }
];
const items = RAW_ITEMS.map(r => ({
  productType: r.productType,
  productName: r.valveName,
  valveName: r.valveName,
  spec: r.spec,
  model: r.valveName,
  quantity: r.qty,
  unitPrice: r.unit,
  totalPrice: r.qty * r.unit,
  gatePlateThickness: r.gatePlateThickness,
  maxPressure: r.maxPressure,
  unitWeight: r.unitWeight,
  laps: r.laps,
  torque: r.torque,
  sealMaterial: r.qty === 36 ? 'NR' : 'EPDM',
  bodyMaterial: 'WCB',
  gateMaterial: 'SS304',
  stemMaterial: '2Cr13',
  trademark: 'CHSUN',
  unit: '台',
  productNote: ''
}));

(async () => {
  const outDir = path.join(process.cwd(), 'static-hosting');
  fs.mkdirSync(outDir, { recursive: true });
  const finalPrice = items.reduce((s,it)=>s+it.totalPrice,0);

  for (const tpl of TEMPLATES_ARR) {
    const out = await buildContract(JSZip, TEMPLATES_ARR, tpl.key, items, { finalPrice, note: '', items });
    const fname = `${FILE_NAME_PREFIX[tpl.key]}-${yyyy}${mm}${dd}.xlsx`;
    const outPath = path.join(outDir, fname);
    fs.writeFileSync(outPath, Buffer.from(out.buffer.slice(out.byteOffset, out.byteOffset + out.byteLength)));
    console.log(`\n✅ ${tpl.key} → ${fname}`);

    // 验证型号规格列
    const z2 = await JSZip.loadAsync(out);
    const sheet = await z2.file('xl/worksheets/sheet1.xml').async('string');
    const sst = await (z2.file('xl/sharedStrings.xml')?.async('string') || Promise.resolve(null));
    const SST = sst ? [...sst.matchAll(/<si>[\s\S]*?<t[^>]*>([\s\S]*?)<\/t>[\s\S]*?<\/si>/g)].map(m=>m[1]) : [];
    function show(ref) {
      const re = new RegExp(`<c [^>]*?r="${ref}"([^>]*)>([\\s\\S]*?)<\\/c>|<c [^>]*?r="${ref}"([^>]*)\\/>`);
      const m = re.exec(sheet);
      if (!m) return `MISS`;
      const rest = m[1] || m[3] || '';
      const ci = m[2] || '';
      if (/t="s"/.test(rest)) { const idx = Number(ci.match(/<v>(\d+)<\/v>/)?.[1]); return SST[idx] || ''; }
      if (/<is>/.test(ci)) return ci.match(/<t[^>]*>([\s\S]*?)<\/t>/)?.[1] || '';
      if (/<v>/.test(ci)) return ci.match(/<v>([\s\S]*?)<\/v>/)?.[1];
      return '';
    }
    const isEn = (tpl.family === 'en_pi');
    // 中文：R12=产品首行，B=型号规格
    // 英文：R5=产品首行，C=Model no.
    const P1 = isEn ? 5 : 12;
    const modelCol = isEn ? 'C' : 'B';
    const v1 = show(`${modelCol}${P1}`);
    const v2 = show(`${modelCol}${P1 + 1}`);
    console.log(`   产品1 ${modelCol}${P1} 型号规格: "${v1}"   ✅期望包含 QBZ73X-10C-DN80`);
    console.log(`   产品2 ${modelCol}${P1+1} 型号规格: "${v2}"   ✅期望包含 QWV973X-DN100`);
    const ok1 = /QBZ73X[\-\w]*DN80/i.test(v1) || /QBZ73X[\-\w]*80/.test(v1);
    const ok2 = /QWV973X[\-\w]*DN100/i.test(v2);
    console.log(`   → ${ok1 ? '✅' : '❌'} 型号1 ${ok1?'正确':'缺失型号前缀'}`);
    console.log(`   → ${ok2 ? '✅' : '❌'} 型号2 ${ok2?'正确':'缺失型号前缀'}`);
  }
  console.log('\n🎉 所有 5 模板跑完，文件已在 static-hosting/ 下');
})();
