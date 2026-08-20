#!/usr/bin/env node
/* 生成 3 份英文 PI，各用 N=1、3、5 条数据，验证：
 * 1) 产品列全部写对：A=序号、B=Project Name（英文）、C=Model no.（型号无中文）、D~I=规格、J=QTY、K=Unit price、L=Total、M=备注
 * 2) 动态行数：VTB 容量 3 条，N=1 → 缩容（删除 R6、R7，汇总从 R8→R6）；N=5 → 扩容
 * 3) Total 行：A=总数量 Σqty，C=总金额 ΣtotalPrice（跟缩容/扩容后行号匹配）
 */
import fs from 'node:fs';
import path from 'node:path';
import JSZip from 'jszip';
import _SNAP_changqi from '../utils/tpl_pi_changqi.json' with { type: 'json' };
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
  { key: 'pi_changqi',       family: 'en_pi', displayName: { 'zh-CN': 'Changqi PI' },       bytes: b64u(_SNAP_changqi), meta: {} },
  { key: 'pi_chisun_multi',  family: 'en_pi', displayName: { 'zh-CN': 'Chisun Multi' },    bytes: b64u(_SNAP_multi),  meta: {} },
  { key: 'pi_chisun_vtb',    family: 'en_pi', displayName: { 'zh-CN': 'Chisun VTB' },      bytes: b64u(_SNAP_vtb),    meta: {} }
];

const PREFIXES = ['QWLY','QWL','QWF','QCAZ','QMDY','QBZ','QMCZ','QYA'];
function buildItems(N, startPrice) {
  const arr = [];
  for (let i = 0; i < N; i++) {
    const price = startPrice * (i + 1);
    const qty = i + 2;
    const pref = PREFIXES[i % PREFIXES.length];
    const dn = 50 + i * 50;
    arr.push({
      productName: `${pref}-10G-DN${dn}`,   // 型号前缀，给 lookupSeries 匹配
      productType: '常规品',
      valveName: `${pref}-10G-DN${dn}`,
      spec: `${pref}573NM-10P-DN${dn}`,
      model: `${pref}573NM-10P-DN${dn}`,
      sealMaterial: i % 2 === 0 ? 'NR' : 'EPDM',
      bodyMaterial: 'GGG40',
      gateMaterial: i % 2 ? 'CF8M' : '304',
      stemMaterial: '2Cr13',
      gatePlateThickness: 8 + i * 2,
      maxPressure: 10,
      unitWeight: 30 + i * 10,
      laps: 15 + i,
      torque: `${40 + i * 10}N.M`,
      trademark: 'CHSUN',
      unit: 'PCS',
      productNote: '',
      quantity: qty,
      unitPrice: price,
      totalPrice: price * qty
    });
  }
  return arr;
}

const SCENARIOS = [
  { tpl: 'pi_changqi',       items: buildItems(2, 1000), label: 'N=2' },  // 容量=1 → 扩容
  { tpl: 'pi_chisun_multi',  items: buildItems(3,  800), label: 'N=3' },  // 容量=1 → 扩容+2
  { tpl: 'pi_chisun_vtb',    items: buildItems(1, 1200), label: 'N=1' },  // 容量=3 → 缩容 gap=2，汇总从 R8→R6
  { tpl: 'pi_chisun_vtb',    items: buildItems(5,  500), label: 'N=5' }   // 容量=3 → 扩容 gap=2，汇总 R8→R10
];

(async () => {
  const outDir = path.join(process.cwd(), 'static-hosting');
  fs.mkdirSync(outDir, { recursive: true });
  for (const sc of SCENARIOS) {
    const finalPrice = sc.items.reduce((s,it) => s + it.totalPrice, 0);
    const totalQty = sc.items.reduce((s,it) => s + it.quantity, 0);
    console.log(`\n========== ${sc.tpl} ${sc.label} (Σqty=${totalQty}, Σprice=${finalPrice}) ==========`);
    const out = await buildContract(JSZip, TEMPLATES_ARR, sc.tpl, sc.items, { finalPrice, note: '', items: sc.items });
    const outPath = path.join(outDir, `${sc.tpl}_${sc.label}.xlsx`);
    fs.writeFileSync(outPath, Buffer.from(out.buffer.slice(out.byteOffset, out.byteOffset + out.byteLength)));
    console.log('📁 ' + outPath);

    // 校验
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
      if (/t="s"/.test(rest)) { const idx = Number(ci.match(/<v>(\d+)<\/v>/)?.[1]); return `SST[${idx}] "${SST[idx]}"`; }
      if (/<is>/.test(ci)) return `inline "${ci.match(/<t[^>]*>([\s\S]*?)<\/t>/)?.[1]}"`;
      if (/<v>/.test(ci)) return 'v=' + ci.match(/<v>([\s\S]*?)<\/v>/)?.[1];
      if (/<f>/.test(ci)) return '=' + ci.match(/<f>([\s\S]*?)<\/f>/)?.[1];
      return '(空)';
    }
    const N = sc.items.length;
    const FIRST = 5;
    const CAPACITY = (sc.tpl === 'pi_chisun_vtb' ? 3 : 1);
    const TOTAL_BASE = (sc.tpl === 'pi_chisun_vtb' ? 8 : 6);
    const offset = Math.max(0, N - CAPACITY);
    const shrinkGap = Math.max(0, CAPACITY - N);
    const TOTAL_ROW = TOTAL_BASE + offset - shrinkGap;
    console.log(`  cap=${CAPACITY}  offset=${offset}  shrink=${shrinkGap}  Expect Total at R${TOTAL_ROW}`);
    // 检查产品行
    const expectedProd = [];
    for (let r = FIRST; r <= FIRST + N - 1; r++) expectedProd.push(r);
    const rows = [...sheet.matchAll(/<row[^>]*r="(\d+)"/g)].map(m => Number(m[1]));
    const actualProd = rows.filter(r => r >= FIRST && r < TOTAL_ROW);
    const extra = actualProd.filter(r => !expectedProd.includes(r));
    const missing = expectedProd.filter(r => !rows.includes(r));
    if (missing.length) console.log(`  ❌ 缺失产品行: [${missing.join(',')}]`);
    else console.log(`  ✅ 产品行全部存在: [${actualProd.join(',')}]`);
    if (extra.length) console.log(`  ❌ 多余空行: [${extra.join(',')}]`);
    else console.log(`  ✅ 无多余空行（真正动态）`);
    if (!rows.includes(TOTAL_ROW)) console.log(`  ❌ Total 行 R${TOTAL_ROW} 不存在！`);
    else {
      console.log(`  ✅ Total 行在 R${TOTAL_ROW}`);
      console.log(`     A${TOTAL_ROW} (QTY):    ${show('A'+TOTAL_ROW)}  expect=Σqty=${totalQty}`);
      console.log(`     C${TOTAL_ROW} (Amount): ${show('C'+TOTAL_ROW)}  expect=ΣtotalPrice=${finalPrice}`);
    }
    // 抽样第 1 行（R5）
    console.log(`  抽样 R5（第 1 条）：`);
    console.log(`     A5 No.:      ${show('A5')}    expect=1`);
    console.log(`     B5 Project:  ${show('B5')}`);
    console.log(`     C5 Model:    ${show('C5')}`);
    console.log(`     J5 QTY:      ${show('J5')}    expect=${sc.items[0].quantity}`);
    console.log(`     K5 Unit:     ${show('K5')}    expect=${sc.items[0].unitPrice}`);
    console.log(`     L5 Total:    ${show('L5')}    expect=${sc.items[0].totalPrice}`);
  }
  console.log('\n🎉 4 场景验证完成');
})();
