#!/usr/bin/env node
/* 复现用户实际小程序场景：N=2 条产品 + finalPrice 真实合计
 * 双向自密封刀闸阀 10 台 × 2850 = 28500
 * 双向自密封刀闸阀 36 台 × 1700 = 61200
 * 总数量 46，总金额 89700
 */
import fs from 'node:fs';
import path from 'node:path';
import JSZip from 'jszip';
import _SNAP_zs_changsheng from '../utils/tpl_zs_changsheng.json' with { type: 'json' };
import builderCJS from '../utils/contract-xlsx-builder.js';
const { buildContract, FAMILY_CFG } = builderCJS;

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

const items = [
  {
    productName: '双向自密封刀闸阀', productType: '双向自密封刀闸阀',
    model: 'DN100', spec: 'QWFZ573NM-10P-DN100',
    gatePlateThickness: '', maxPressure: '', unitWeight: '68KG', laps: 15, torque: '15N.M',
    quantity: 10, unitPrice: 2850, totalPrice: 28500,
    sealMaterial: '', bodyMaterial: '', trademark: 'CHSUN', unit: '台', productNote: ''
  },
  {
    productName: '双向自密封刀闸阀', productType: '双向自密封刀闸阀',
    model: 'DN100', spec: 'QWFZ273NM-10C-DN100',
    gatePlateThickness: '', maxPressure: '', unitWeight: '0KG', laps: 0, torque: '0N.M',
    quantity: 36, unitPrice: 1700, totalPrice: 61200,
    sealMaterial: '', bodyMaterial: '', trademark: 'CHSUN', unit: '台', productNote: ''
  }
];
const finalPrice = items.reduce((s, it) => s + (Number(it.totalPrice) || 0), 0); // 89700

(async () => {
  const TEMPLATES_ARR = [{
    key: 'zs_changsheng', family: 'cn_contract',
    displayName: { 'zh-CN': '长胜合同（农行付款）' },
    bytes: _b64ToUint8(_SNAP_zs_changsheng),
    meta: {}
  }];
  console.log('复现 N=2：items[0].totalPrice=28500, items[1].totalPrice=61200  合计=' + finalPrice);
  console.log('cfg:', {
    PRODUCT_ROW_FIRST: FAMILY_CFG.zs_changsheng.PRODUCT_ROW_FIRST,
    PRODUCT_ROW_LAST_TPL: FAMILY_CFG.zs_changsheng.PRODUCT_ROW_LAST_TPL,
    TAX_ROW: FAMILY_CFG.zs_changsheng.TAX_ROW,
    strategy: FAMILY_CFG.zs_changsheng._WRITE_STRATEGY
  });

  const out = await buildContract(JSZip, TEMPLATES_ARR, 'zs_changsheng', items, { finalPrice, note: '' });
  const z2 = await JSZip.loadAsync(out);
  const sheet = await z2.file('xl/worksheets/sheet1.xml').async('string');
  const ssXml = z2.file('xl/sharedStrings.xml') ? await z2.file('xl/sharedStrings.xml').async('string') : null;
  const sst = [];
  if (ssXml) {
    const re = /<si>([\s\S]*?)<\/si>/g; let m;
    while ((m = re.exec(ssXml)) !== null) sst.push(m[1].replace(/<[^>]+>/g, ''));
  }

  // 列出 row r=12 到 r=20，看看哪些行存在
  const rowRe = /<row[^>]*r="(\d+)"[^>]*>([\s\S]*?)<\/row>/g;
  let rm;
  console.log('\n—— 行号存在性（R11~R18）——');
  const rowsPresent = new Map();
  while ((rm = rowRe.exec(sheet)) !== null) {
    rowsPresent.set(Number(rm[1]), rm[2]);
  }
  for (let r = 11; r <= 18; r++) {
    const exists = rowsPresent.has(r);
    if (!exists) { console.log(`  R${r}  不存在（被删除？）`); continue; }
    const inner = rowsPresent.get(r);
    const cellRe = /<c [^>]*?r="([A-Z]+\d+)"[^>]*>([\s\S]*?)<\/c>|<c [^>]*?r="([A-Z]+\d+)"[^>]*?\/>/g;
    let cm;
    const parts = [];
    while ((cm = cellRe.exec(inner)) !== null) {
      const ref = cm[1] || cm[3];
      const ci = cm[2] || '';
      const col = ref.replace(/\d+$/, '');
      if (col > 'T') continue;
      const vm = ci.match(/<v[^>]*>([\s\S]*?)<\/v>/);
      const fm = ci.match(/<f[^>]*>([\s\S]*?)<\/f>/);
      const im = ci.match(/<is>.*?<t[^>]*>([\s\S]*?)<\/t>.*?<\/is>/);
      if (ref === 'A' + r || col === 'A') parts.push(`A=${(vm&&vm[1])||(im&&im[1].slice(0,8))||(fm&&'=')||'空'}`);
      if (col === 'J') parts.push(`J=${(vm&&vm[1])||(fm&&'='+fm[1].slice(0,20))||'空'}`);
      if (col === 'K') parts.push(`K=${(im&&'"'+im[1].slice(0,15)+'"')||(vm&&vm[1])||(fm&&'=')||'空'}`);
      if (col === 'H' && r === 12) parts.push(`H=${vm&&vm[1]}`);
    }
    console.log(`  R${r}  存在  ${parts.join('  ')}`);
  }

  // 抓汇总行 TAX_ROW (16) 后整体
  console.log('\n—— 逐列输出：产品行 R12~R15 每列 J（金额）+ 汇总行各列 ——');
  function show(ref) {
    const re = new RegExp(`<c [^>]*?r="${ref}"([^>]*)>([\\s\\S]*?)<\\/c>|<c [^>]*?r="${ref}"([^>]*)\\/>`);
    const m = re.exec(sheet);
    if (!m) return `${ref} MISSING`;
    const attrs = (m[1]||'') + ' ' + (m[3]||'');
    const ci = m[2] || '';
    const tm = /\bt="([^"]+)"/.exec(attrs);
    const t = tm ? tm[1] : '-';
    const vm = ci.match(/<v[^>]*>([\s\S]*?)<\/v>/);
    const fm = ci.match(/<f[^>]*>([\s\S]*?)<\/f>/);
    const im = ci.match(/<is>.*?<t[^>]*>([\s\S]*?)<\/t>.*?<\/is>/);
    if (im) return `${ref} t=${t} TXT="${im[1].slice(0,30)}"`;
    if (vm && t === 's') return `${ref} t=${t} SST[${vm[1]}] = ${sst[Number(vm[1])]?.slice(0,20)||'?'}`;
    if (fm) return `${ref} t=${t} =${fm[1].slice(0,30)} cache=${vm&&vm[1]}`;
    if (vm) return `${ref} t=${t} n=${vm[1]}`;
    return `${ref} t=${t} EMPTY`;
  }
  ['J12','J13','J14','J15'].forEach(r => console.log('  '+show(r)));
  ['A16','B16','C16','D16','E16','F16','G16','H16','I16','J16','K16','R16','S16'].forEach(r => console.log('  '+show(r)));

  // 保存
  const outPath = path.join(process.cwd(), 'static-hosting', 'zs_changsheng_N2_real.xlsx');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, Buffer.from(out.buffer.slice(out.byteOffset, out.byteOffset + out.byteLength)));
  console.log('\nSaved: ' + outPath);
})();
