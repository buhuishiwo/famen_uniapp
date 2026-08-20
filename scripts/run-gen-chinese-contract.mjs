#!/usr/bin/env node
/* 生成中文购销合同 chisun_nsh + zs_changsheng 测试 xlsx
 * 使用： node scripts/run-gen-chinese-contract.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import JSZip from 'jszip';
import _SNAP_chisun_nsh from '../utils/tpl_chisun_nsh.json' with { type: 'json' };
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
    const c = b64.charAt(i);
    if (c === '=') break;
    const v = _B64_LOOKUP[c];
    if (v === undefined) continue;
    buffer = (buffer << 6) | v;
    bits += 6;
    if (bits >= 8) { bits -= 8; out[p++] = (buffer >> bits) & 0xff; }
  }
  return out;
}

const items = [
  {
    productName: 'QYA73X-TERL',
    productType: '单向暗杆手动刀闸阀',
    model: 'DN125',
    spec: 'QBZ73X-TERL-DN125',
    gatePlateThickness: '8mm',
    maxPressure: '10',
    unitWeight: '18KG',
    laps: 34,
    torque: '35N.M',
    quantity: 5,
    unitPrice: 1110,
    totalPrice: 5550,
    sealMaterial: 'NR',
    bodyMaterial: 'QT450',
    trademark: 'CHISUN',
    unit: '台',
    productNote: ''
  },
  {
    productName: 'QYA73X-TERL',
    productType: '单向暗杆手动刀闸阀',
    model: 'DN150',
    spec: 'QBZ73X-TERL-DN150',
    gatePlateThickness: '8mm',
    maxPressure: '10',
    unitWeight: '19.8KG',
    laps: 33,
    torque: '45N.M',
    quantity: 4,
    unitPrice: 1350,
    totalPrice: 5400,
    sealMaterial: 'NR',
    bodyMaterial: 'QT450',
    trademark: 'CHISUN',
    unit: '台',
    productNote: ''
  },
  {
    productName: 'QYA73X-TERL',
    productType: '单向暗杆手动刀闸阀',
    model: 'DN200',
    spec: 'QBZ73X-TERL-DN200',
    gatePlateThickness: '8mm',
    maxPressure: '10',
    unitWeight: '30.8KG',
    laps: 43,
    torque: '45N.M',
    quantity: 3,
    unitPrice: 2120,
    totalPrice: 6360,
    sealMaterial: 'NR',
    bodyMaterial: 'QT450',
    trademark: 'CHISUN',
    unit: '台',
    productNote: ''
  },
  {
    productName: 'QYA73X-TERL',
    productType: '单向暗杆手动刀闸阀',
    model: 'DN250',
    spec: 'QBZ73X-TERL-DN250',
    gatePlateThickness: '8mm',
    maxPressure: '7',
    unitWeight: '40KG',
    laps: 53,
    torque: '60N.M',
    quantity: 2,
    unitPrice: 2655,
    totalPrice: 5310,
    sealMaterial: 'NR',
    bodyMaterial: 'QT450',
    trademark: 'CHISUN',
    unit: '台',
    productNote: ''
  }
];
const finalPrice = items.reduce((s, it) => s + (Number(it.totalPrice) || 0), 0); // 22620

function pickCell(xml, ref) {
  const re = new RegExp(`<c\\s+[^>]*r="${ref}"([^>]*)>([\\s\\S]*?)<\\/c>|<c\\s+[^>]*r="${ref}"([^>]*)\\/>`);
  const m = re.exec(xml);
  if (!m) return '(缺失)';
  const attrs = (m[1] || '') + ' ' + (m[3] || '');
  const inner = m[2] || '';
  const ism = /<is><t[^>]*>([\s\S]*?)<\/t><\/is>/.exec(inner);
  if (ism) return 'txt="' + ism[1] + '"';
  const vm = /<v>([\s\S]*?)<\/v>/.exec(inner);
  if (vm) {
    if (/\bt="s"/.test(attrs)) return 'SST[' + vm[1] + ']';
    return 'n=' + vm[1];
  }
  const fm = /<f>([\s\S]*?)<\/f>/.exec(inner);
  if (fm) return '=' + fm[1];
  return '(空占位)';
}

async function genOne({ tplKey, family, displayName, snap, outFileName }) {
  const TEMPLATES_ARR = [{
    key: tplKey,
    family,
    displayName,
    bytes: (() => { try { return _b64ToUint8(snap); } catch (e) { return snap; } })(),
    meta: {}
  }];
  console.log(`\n🧪 生成中文合同 ${tplKey} 测试文件...`);
  console.log('  items.length =', items.length, '  finalPrice(不含税) =', finalPrice);
  console.log('  FAMILY_CFG strategy =', FAMILY_CFG[tplKey]._WRITE_STRATEGY);
  console.log('  COL_MAP:', FAMILY_CFG[tplKey].COL_MAP.map(x => x.col).join(','));

  const out = await buildContract(JSZip, TEMPLATES_ARR, tplKey, items, { finalPrice, note: '' });

  const hex4 = Array.from(out.slice(0, 4)).map(b => b.toString(16).padStart(2, '0')).join(' ');
  if (hex4 !== '50 4b 03 04') { console.error('❌ ZIP 头错误:', hex4); process.exit(1); }
  console.log('  ✅ ZIP 头正确  字节数 =', out.length, '(' + Math.round(out.length/1024) + 'KB)');

  const z2 = await JSZip.loadAsync(out);
  const sheet = await z2.file('xl/worksheets/sheet1.xml').async('string');
  console.log('  ✅ ZIP 可重新打开  sheet1.xml 长度 =', sheet.length);

  const N = items.length;
  const cfg = FAMILY_CFG[tplKey];
  const capacity = cfg.PRODUCT_ROW_LAST_TPL - cfg.PRODUCT_ROW_FIRST + 1;
  const offset = Math.max(0, N - capacity);
  console.log('  模板产品容量=', capacity, '  需扩容 offset=', offset);
  const PRODUCT_START = cfg.PRODUCT_ROW_FIRST;
  const PRODUCT_END = PRODUCT_START + N - 1;
  const SUMMARY_ROW = (cfg.TAX_ROW || cfg.TOTAL_ROW) + offset;
  console.log('  产品行: R' + PRODUCT_START + '~R' + PRODUCT_END);
  console.log('  汇总行: R' + SUMMARY_ROW);

  for (let r = PRODUCT_START; r <= PRODUCT_END; r++) {
    console.log('\n  —— 产品行 R' + r + '（A..K）——');
    'ABCDEFGHIJK'.split('').forEach(c => console.log('    ' + c + r + '  ' + pickCell(sheet, c + r)));
  }
  console.log('\n  —— ✨ 汇总行 R' + SUMMARY_ROW + '（A..T）✨——');
  'ABCDEFGHIJKLMNOPQRST'.split('').forEach(c => console.log('    ' + c + SUMMARY_ROW + '  ' + pickCell(sheet, c + SUMMARY_ROW)));

  const outDir2 = path.join(process.cwd(), 'static-hosting');
  fs.mkdirSync(outDir2, { recursive: true });
  const outPath = path.join(outDir2, outFileName);
  fs.writeFileSync(outPath, Buffer.from(out.buffer.slice(out.byteOffset, out.byteOffset + out.byteLength)));
  console.log('\n📁 已保存到: ' + outPath);
  return outPath;
}

(async () => {
  await genOne({
    tplKey: 'chisun_nsh',
    family: 'cn_contract',
    displayName: { 'zh-CN': '奇胜合同（农商行付款）', 'en-US': 'Chisun - Rural Bank' },
    snap: _SNAP_chisun_nsh,
    outFileName: 'chisun_nsh_split11_onerow.xlsx'
  });
  await genOne({
    tplKey: 'zs_changsheng',
    family: 'cn_contract',
    displayName: { 'zh-CN': '长胜合同（农行付款）', 'en-US': 'Changsheng - ABC Bank' },
    snap: _SNAP_zs_changsheng,
    outFileName: 'zs_changsheng_split11_onerow.xlsx'
  });
})();
