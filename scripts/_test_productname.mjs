#!/usr/bin/env node
/* 复现用户截图场景：
 * items[0]: productType="双向自密封刀闸阀" (中文产品名),  valveName/productName="", spec="QWFZ573NM-10P-DN100"
 *           → A列应该是"双向自密封刀闸阀"，B列应该是"QWFZ573NM-10P-DN100"
 * items[1]: productType="双向自密封刀闸阀", valveName/productName="", spec="QWFZ573NM-10P-DN125"
 *           quantity=36, unitPrice=1700, totalPrice=61200
 * 检查产品名称列（A）是否为空、型号规格列（B）是否正确。
 */
import fs from 'node:fs';
import path from 'node:path';
import JSZip from 'jszip';
import _SNAP_zs from '../utils/tpl_zs_changsheng.json' with { type: 'json' };
import builderCJS from '../utils/contract-xlsx-builder.js';
const { buildContract } = builderCJS;

const _B64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const _B64_LOOKUP = Object.fromEntries([..._B64_CHARS].map((c, i) => [c, i]));
function _b64ToUint8(b64) {
  if (typeof b64 !== 'string') return b64;
  const pad = b64.endsWith('==') ? 2 : (b64.endsWith('=') ? 1 : 0);
  const byteLength = Math.floor((b64.length * 3) / 4) - pad;
  const out = new Uint8Array(byteLength);
  let p = 0, buffer = 0, bits = 0;
  for (let i = 0; i < b64.length; i++) {
    const c = b64.charAt(i); if (c === '=') break;
    const v = _B64_LOOKUP[c]; if (v === undefined) continue;
    buffer = (buffer << 6) | v; bits += 6;
    if (bits >= 8) { bits -= 8; out[p++] = (buffer >> bits) & 0xff; }
  }
  return out;
}
const TEMPLATES_ARR = [{
  key: 'zs_changsheng', family: 'cn_contract',
  displayName: { 'zh-CN': '长胜合同（农行付款）' },
  bytes: _b64ToUint8(_SNAP_zs), meta: {}
}];

// ⚠️ 模拟用户真实字段：valveName/productName 空！中文产品名填在 productType；完整型号在 spec
const items = [
  {
    productType: '双向自密封刀闸阀',
    productName: '',        // ← 空（用户截图里 valveName 没填）
    spec: 'QWFZ573NM-10P-DN100',
    model: 'QWFZ573NM-10P-DN100',
    gatePlateThickness: '', maxPressure: '', unitWeight: '50KG', laps: 15, torque: '15N.M',
    quantity: 10, unitPrice: 2850, totalPrice: 28500,
    sealMaterial: '', bodyMaterial: '', trademark: 'CHSUN', unit: '台', productNote: ''
  },
  {
    productType: '双向自密封刀闸阀',
    productName: '',        // ← 空
    spec: 'QWFZ573NM-10P-DN125',
    model: 'QWFZ573NM-10P-DN125',
    gatePlateThickness: '', maxPressure: '', unitWeight: '51KG', laps: 16, torque: '16N.M',
    quantity: 36, unitPrice: 1700, totalPrice: 61200,
    sealMaterial: '', bodyMaterial: '', trademark: 'CHSUN', unit: '台', productNote: ''
  }
];

(async () => {
  const finalPrice = 89700;
  const out = await buildContract(JSZip, TEMPLATES_ARR, 'zs_changsheng', items, { finalPrice, note: '' });
  const outDir = path.join(process.cwd(), 'static-hosting');
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'zs_changsheng_N=2_USERCASE.xlsx');
  fs.writeFileSync(outPath, Buffer.from(out.buffer.slice(out.byteOffset, out.byteOffset + out.byteLength)));
  console.log('📁 ' + outPath);

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
    if (/t="s"/.test(rest)) { const idx = Number(ci.match(/<v>(\d+)<\/v>/)?.[1]); return `SST "${SST[idx]}"`; }
    if (/<is>/.test(ci)) return `inline "${ci.match(/<t[^>]*>([\s\S]*?)<\/t>/)?.[1]}"`;
    if (/<v>/.test(ci)) return 'v=' + ci.match(/<v>([\s\S]*?)<\/v>/)?.[1];
    if (/<f>/.test(ci)) return '=' + ci.match(/<f>([\s\S]*?)<\/f>/)?.[1];
    return '(空)';
  }
  console.log('\n—— 产品行 1（R12）——');
  console.log('  A12 产品名称:   ' + show('A12') + '  ✅应该是 双向自密封刀闸阀');
  console.log('  B12 型号规格:   ' + show('B12') + '  ✅应该是 QWFZ573NM-10P-DN100');
  console.log('  H12 数量:       ' + show('H12'));
  console.log('  I12 单价:       ' + show('I12'));
  console.log('  J12 金额:       ' + show('J12'));
  console.log('\n—— 产品行 2（R13）——');
  console.log('  A13 产品名称:   ' + show('A13') + '  ✅应该是 双向自密封刀闸阀');
  console.log('  B13 型号规格:   ' + show('B13') + '  ✅应该是 QWFZ573NM-10P-DN125');
  console.log('\n—— 汇总行（R14，因为 N=2 缩容）——');
  console.log('  B14 不含税:     ' + show('B14'));
  console.log('  D14 税额:       ' + show('D14'));
  console.log('  F14 税率:       ' + show('F14'));
  console.log('  H14 总数量:     ' + show('H14'));
  console.log('  J14 价税合计:   ' + show('J14'));
  console.log('  K14 人民币大写: ' + show('K14') + '  ✅应该是 捌万玖仟柒佰元整');

  // 断言
  const passList = [];
  passList.push(['A12 产品名显示', show('A12').includes('双向自密封刀闸阀')]);
  passList.push(['A13 产品名显示', show('A13').includes('双向自密封刀闸阀')]);
  passList.push(['B12 型号显示', show('B12').includes('QWFZ573NM-10P-DN100')]);
  passList.push(['B13 型号显示', show('B13').includes('QWFZ573NM-10P-DN125')]);
  passList.push(['K14 大写正确', show('K14').includes('捌万玖仟柒佰')]);
  passList.push(['J14 公式SUM', show('J14') === '=SUM(J12:J13)']);
  console.log('\n========== 断言 ==========');
  let allOk = true;
  for (const [name, ok] of passList) { console.log(`  ${ok ? '✅' : '❌'}  ${name}`); if (!ok) allOk = false; }
  console.log(allOk ? '\n🎉 全部通过！产品名称不再缺失' : '\n❌ 存在失败项');
})();
