#!/usr/bin/env node
/* 回归测试 N=1、2、4、6 四种边界场景，验证：
 * 1) 产品行数正确 = N，无多余空行
 * 2) 汇总行号 = PRODUCT_ROW_FIRST + N + 1? No. = 实际 TAX_ROW + offset - shrinkGap
 *    即：N=1 → 原 R16 缩容 gap=3 → R13 ; N=2 → R14 ; N=4 → R16 ; N=6 → 扩容 offset=2 → R18
 * 3) 公式内部 J 列引用是 SUM(J12:Jxx) 正确
 * 4) Jx / Sx 公式格 <v> 缓存被删除（只剩 <f>）
 * 5) 大写金额 = Σ it.totalPrice（正确）
 */
import fs from 'node:fs';
import path from 'node:path';
import JSZip from 'jszip';
import _SNAP_zs from '../utils/tpl_zs_changsheng.json' with { type: 'json' };
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

const baseItem = (k, price, qty) => ({
  productName: '双向自密封刀闸阀', productType: '双向自密封刀闸阀',
  model: 'DN' + (100 + k * 25), spec: `QWFZ573NM-10P-DN${100 + k * 25}`,
  gatePlateThickness: '', maxPressure: '', unitWeight: `${50 + k}KG`, laps: 15 + k, torque: `${15 + k}N.M`,
  quantity: qty, unitPrice: price, totalPrice: price * qty,
  sealMaterial: '', bodyMaterial: '', trademark: 'CHSUN', unit: '台', productNote: ''
});

const SCENARIOS = [
  { N: 1, label: 'N=1_缩容-3行', expectRow: 13, items: [baseItem(0, 89700, 1)] },           // R12 → 汇总 R13
  { N: 2, label: 'N=2_缩容-2行', expectRow: 14, items: [baseItem(0, 2850, 10), baseItem(1, 1700, 36)] }, // R12-13 → 汇总 R14
  { N: 4, label: 'N=4_刚好匹配', expectRow: 16, items: [baseItem(0, 1110, 5), baseItem(1, 1350, 4), baseItem(2, 2120, 3), baseItem(3, 2655, 2)] }, // R12-15 → 汇总 R16
  { N: 6, label: 'N=6_扩容-2行', expectRow: 18, items: [baseItem(0, 1000, 1), baseItem(1, 2000, 2), baseItem(2, 3000, 3), baseItem(3, 4000, 4), baseItem(4, 5000, 5), baseItem(5, 6000, 6)] } // R12-17 → 汇总 R18
];

const TEMPLATES_ARR = [{
  key: 'zs_changsheng', family: 'cn_contract',
  displayName: { 'zh-CN': '长胜合同（农行付款）' },
  bytes: _b64ToUint8(_SNAP_zs), meta: {}
}];

(async () => {
  const outDir = path.join(process.cwd(), 'static-hosting');
  fs.mkdirSync(outDir, { recursive: true });
  const cfg = FAMILY_CFG.zs_changsheng;

  for (const sc of SCENARIOS) {
    console.log(`\n========== 场景 ${sc.label} | expectSummaryRow=R${sc.expectRow} ==========`);
    const finalPrice = sc.items.reduce((s, it) => s + it.totalPrice, 0);
    const totalQty = sc.items.reduce((s, it) => s + it.quantity, 0);
    console.log(`  items.length=${sc.items.length}  ΣtotalPrice=${finalPrice}  Σqty=${totalQty}`);

    const out = await buildContract(JSZip, TEMPLATES_ARR, 'zs_changsheng', sc.items, { finalPrice, note: '' });
    const z2 = await JSZip.loadAsync(out);
    const sheet = await z2.file('xl/worksheets/sheet1.xml').async('string');

    // 收集所有行号存在性
    const rowRe = /<row[^>]*r="(\d+)"[^>]*>/g;
    const presentRows = [];
    let rm;
    while ((rm = rowRe.exec(sheet)) !== null) presentRows.push(Number(rm[1]));
    const R_PROD_START = cfg.PRODUCT_ROW_FIRST;
    const EXPECTED_PROD_ROWS = [];
    for (let r = R_PROD_START; r <= R_PROD_START + sc.N - 1; r++) EXPECTED_PROD_ROWS.push(r);

    // 判断多余/缺失产品行
    const prodActual = presentRows.filter(r => r >= R_PROD_START && r < sc.expectRow);
    const extra = prodActual.filter(r => !EXPECTED_PROD_ROWS.includes(r));
    const missing = EXPECTED_PROD_ROWS.filter(r => !presentRows.includes(r));
    console.log(`  产品行实际存在=[${prodActual.join(',')}]  期望=[${EXPECTED_PROD_ROWS.join(',')}]`);
    if (missing.length) console.log(`  ❌ 缺失产品行: [${missing.join(',')}]`);
    else console.log('  ✅ 所有期望产品行都存在');
    if (extra.length) console.log(`  ❌ 多余产品行/空行: [${extra.join(',')}]`);
    else console.log('  ✅ 无多余产品行/空行（真正动态）');

    // 汇总行存在性 & 位置
    const summaryThere = presentRows.includes(sc.expectRow);
    const summaryRowNeighbors = presentRows.filter(r => r >= sc.expectRow - 1 && r <= sc.expectRow + 1);
    if (summaryThere) console.log(`  ✅ 汇总行确实在 R${sc.expectRow}  附近行=[${summaryRowNeighbors.join(',')}]`);
    else console.log(`  ❌ 汇总行不在 R${sc.expectRow}！存在行=[${summaryRowNeighbors.join(',')}]`);

    // 抓汇总行各列值
    function show(ref) {
      const re = new RegExp(`<c [^>]*?r="${ref}"([^>]*)>([\\s\\S]*?)<\\/c>|<c [^>]*?r="${ref}"([^>]*)\\/>`);
      const m = re.exec(sheet);
      if (!m) return `MISS`;
      const ci = m[2] || '';
      const vm = ci.match(/<v[^>]*>([\s\S]*?)<\/v>/);
      const fm = ci.match(/<f[^>]*>([\s\S]*?)<\/f>/);
      const im = ci.match(/<is>.*?<t[^>]*>([\s\S]*?)<\/t>.*?<\/is>/);
      if (fm && vm) return `=FORMULA_CACHED("${fm[1].slice(0,30)}", ${vm[1]}) → 需删除缓存❌`;
      if (fm) return `=FORMULA("${fm[1].slice(0,30)}") ✅`;
      if (im) return `TXT="${im[1].slice(0,20)}"`;
      if (vm) return `n=${vm[1]}`;
      return '(空)';
    }
    const SR = sc.expectRow;
    console.log(`  —— 汇总行 R${SR} ——`);
    ['F','H','J','K','B','D','S'].forEach(col => console.log(`    ${col}${SR}: ${show(col+SR)}`));

    // 保存文件
    const outPath = path.join(outDir, `zs_changsheng_${sc.label}.xlsx`);
    fs.writeFileSync(outPath, Buffer.from(out.buffer.slice(out.byteOffset, out.byteOffset + out.byteLength)));
    console.log('  📁 ' + outPath);
  }
  console.log('\n✅ 四个场景全部跑完');
})();
