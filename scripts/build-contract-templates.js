#!/usr/bin/env node
/* eslint-disable */
/**
 * 6 个模板 → 生成 6 个 utils/tpl_<key>.json（Uint8Array 字节快照）
 * 同时生成 utils/contract-templates.js：
 *   1) 引入 6 个快照 JSON
 *   2) 导出 TEMPLATE_REGISTRY（含 displayName / 字节 / CFG 结构）
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DOC = path.join(ROOT, 'document');
const UTILS = path.join(ROOT, 'utils');

// 先搜索 document 下所有 xlsx
const candidates = [];
try {
  for (const f of fs.readdirSync(DOC)) {
    if (f.endsWith('.xlsx') || f.endsWith('.xlsm')) candidates.push(path.join(DOC, f));
  }
} catch (e) { /* noop */ }
// 以及根目录下的合同模板（QCAZ543X...）
try {
  for (const f of fs.readdirSync(ROOT)) {
    if (f.endsWith('.xlsx') && /QCAZ|合同|模板|CHISUN|奇胜/i.test(f)) candidates.push(path.join(ROOT, f));
  }
} catch (e) { /* noop */ }

console.log('候选模板文件:');
candidates.forEach(p => console.log('  -', p));

// 原 contract_template.json 作为 fallback（当根目录 xlsx 不在时）
function bytesOf(p) {
  return new Uint8Array(fs.readFileSync(p));
}
function snapshotNameFor(key) { return `tpl_${key}.json`; }
function writeSnapshot(key, u8arr) {
  const p = path.join(UTILS, snapshotNameFor(key));
  fs.writeFileSync(p, JSON.stringify(Array.from(u8arr)));
  console.log(`  ✅ 写快照 ${snapshotNameFor(key)}  (${u8arr.length} bytes -> ${Math.round(fs.statSync(p).size/1024)}KB JSON)`);
  return { key, bytes: u8arr, path: p };
}

const registry = [];
function addTemplate(entry) {
  registry.push(entry);
  writeSnapshot(entry.key, entry.bytes);
}

// ================ 6 个模板配置（按识别顺序，找不到就用候选匹配） ================
function findByKeywords(kws) {
  return candidates.find(p => {
    const name = path.basename(p);
    return kws.every(kw => name.indexOf(kw) !== -1);
  });
}
function findByAny(kwGroups) {
  for (const g of kwGroups) {
    const f = findByKeywords(g);
    if (f) return f;
  }
  return null;
}

// 模板 1：QCAZ543X 原版合同（根目录找不到就用原来的 contract_template.json 兜底）
{
  const p = findByAny([['QCAZ543X']]);
  let u8;
  if (p) {
    u8 = bytesOf(p);
    console.log(`\n[chisun_v1] 使用源文件: ${p}`);
  } else {
    const legacy = JSON.parse(fs.readFileSync(path.join(UTILS, 'contract_template.json'), 'utf8'));
    u8 = new Uint8Array(legacy);
    console.log(`\n[chisun_v1] 使用 contract_template.json 兜底 (${u8.length} bytes)`);
  }
  addTemplate({
    key: 'chisun_v1',
    family: 'cn_contract',
    bytes: u8,
    displayName: { 'zh-CN': '奇胜标准合同（奇胜商标版）', 'en-US': 'Chisun Standard (Logo Ver.)' },
    meta: {
      // 原模板 CFG（沿用 contract-xlsx-builder 当前常量）
      PRODUCT_ROW_FIRST: 13,
      PRODUCT_ROW_LAST_TPL: 25,
      TAX_ROW: 26,
      TOTAL_CN_ROW: 27,
      PRETAX_ROW: 26,                 // 与 TAX_ROW 同属一行
      CELL_PRETAX: 'H26',
      CELL_TAX: 'O26',
      CELL_TOTAL_CN: 'A27',
      NOTE_CELL: 'F40',
      TAX_RATE: 0.13,
      // 产品列映射（A1 坐标，来自原模板）：
      COL_MODEL: 'A',
      COL_SPEC: 'H',
      COL_MATERIAL: 'P',
      COL_PRESSURE: 'S',
      COL_SEAL: 'V',
      COL_TRADEMARK: 'Y',
      COL_UNIT: 'Z',
      COL_QTY: 'AA',
      COL_UNIT_PRICE: 'AC',
      COL_TOTAL_PRICE: 'AD'
    }
  });
}

// 模板 2：奇胜阀门模板-农商行.xlsx
{
  const p = findByAny([['奇胜', '农商行']]);
  if (!p) { console.warn('  ⚠️  找不到奇胜农商行模板'); }
  else {
    console.log(`\n[chisun_nsh] 使用源文件: ${p}`);
    addTemplate({
      key: 'chisun_nsh',
      family: 'cn_contract',
      bytes: bytesOf(p),
      displayName: { 'zh-CN': '奇胜合同（农商行付款）', 'en-US': 'Chisun - Rural Bank' },
      meta: {
        // 按探查结果：表头 R11，样例 R12，税额 R13，价税合计 R14，然后 R15-R21 是空白行（7 行产品容量？）
        // 但为了安全，把产品区域定义为 R12-R12 一行样例+下面 9 行空白共 10 条；超过 10 条扩容，税金行 TAX_ROW 从 R13 起偏移
        // 等等：R11=标题、R12=样例、R13=税额、R14=价税合计；样例只有一行！说明产品区容量是 1 行，超过就要扩容
        PRODUCT_ROW_FIRST: 12,
        PRODUCT_ROW_LAST_TPL: 12,
        TAX_ROW: 13,
        TOTAL_CN_ROW: 14,
        PRETAX_ROW: 14,
        CELL_PRETAX: '',  // A14 里是"价税合计（小写）：62,400元"，没有单独的不含税，需要用写入模式 2（直接写入 税额 到 O13）
        CELL_TAX: 'O13',
        CELL_TOTAL_CN: 'B14',
        NOTE_CELL: 'AL12', // AL11 的下一行（R12 备注列，来自 模板1 探查中 R12 AL12=备注内容）
        TAX_RATE: 0.13,
        // 探查：R11 B=型号规格 I=产品描述 Q=数量 AH=单价 AK=总价 AL=备注（R12 写着 甲乙双方...）
        // 产品描述列是 H-O(合)；这里为了简化先把 型号→B，描述→I，数量→Q，单价→AH，总价→AK
        COL_MODEL: 'B',
        COL_DESC: 'I',
        COL_QTY: 'Q',
        COL_UNIT_PRICE: 'AH',
        COL_TOTAL_PRICE: 'AK',
        // 其余列缺失，留空
        // NOTE: 因为这个模板没有 P/S/V/Y/Z 材质/压力/密封面/商标/单位 的独立列，就把这些拼到 COL_DESC 单元格里（原模板 R12 I列="材质压力密封面商标单位"）
      }
    });
  }
}

// 模板 3：浙江长胜阀门模板-农行支付
{
  const p = findByAny([['浙江长胜', '农行']]);
  if (!p) { console.warn('  ⚠️  找不到浙江长胜-农行模板'); }
  else {
    console.log(`\n[zs_changsheng] 使用源文件: ${p}`);
    addTemplate({
      key: 'zs_changsheng',
      family: 'cn_contract',
      bytes: bytesOf(p),
      displayName: { 'zh-CN': '长胜合同（农行付款）', 'en-US': 'ChangSheng - ABC Bank' },
      meta: {
        PRODUCT_ROW_FIRST: 12,
        PRODUCT_ROW_LAST_TPL: 12,
        TAX_ROW: 13,
        TOTAL_CN_ROW: 14,
        CELL_TAX: 'O13',
        CELL_TOTAL_CN: 'B14',
        NOTE_CELL: 'AL12',
        TAX_RATE: 0.13,
        COL_MODEL: 'B',
        COL_DESC: 'I',
        COL_QTY: 'Q',
        COL_UNIT_PRICE: 'AH',
        COL_TOTAL_PRICE: 'AK',
      }
    });
  }
}

// 模板 4：Changqi 模板（英文 PI 格式家族）
{
  const p = findByAny([['Changqi']]);
  if (!p) { console.warn('  ⚠️  找不到 Changqi 模板'); }
  else {
    console.log(`\n[pi_changqi] 使用源文件: ${p}`);
    addTemplate({
      key: 'pi_changqi',
      family: 'en_pi',
      bytes: bytesOf(p),
      displayName: { 'zh-CN': 'Changqi 英文 PI', 'en-US': 'Changqi Proforma Invoice' },
      meta: {
        // 探查：R4 = 标题行（A/B/C/D/E(数量QTY)/.../H(单价)/I(总价)）
        // R5 = 样例行（1条）
        // R6 = Total 合计行
        PRODUCT_ROW_FIRST: 5,
        PRODUCT_ROW_LAST_TPL: 5,
        TOTAL_ROW: 6,
        CELL_TOTAL_AMOUNT: 'C6',
        // 没有税金，直接合计
        COL_A: 'A',        // Item No.
        COL_MODEL: 'B',    // 型号
        COL_DESC1: 'C',
        COL_DESC2: 'D',
        COL_QTY: 'E',      // E4=QTY
        COL_UNIT_PRICE: 'H',
        COL_TOTAL_PRICE: 'I',
      }
    });
  }
}

// 模板 5：ChisunIMPORT+农行人民币美元欧元付款
{
  const p = findByAny([['ChisunIMPORT+', '农行']]);
  if (!p) { console.warn('  ⚠️  找不到 ChisunIMPORT+农行 模板'); }
  else {
    console.log(`\n[pi_chisun_multi] 使用源文件: ${p}`);
    addTemplate({
      key: 'pi_chisun_multi',
      family: 'en_pi',
      bytes: bytesOf(p),
      displayName: { 'zh-CN': 'Chisun PI（农行RMB/USD/EUR）', 'en-US': 'Chisun PI (Multi-Currency ABC)' },
      meta: {
        PRODUCT_ROW_FIRST: 5,
        PRODUCT_ROW_LAST_TPL: 5,
        TOTAL_ROW: 6,
        CELL_TOTAL_AMOUNT: 'C6',
        COL_A: 'A',
        COL_MODEL: 'B',
        COL_DESC1: 'C',
        COL_DESC2: 'D',
        COL_QTY: 'E',
        COL_UNIT_PRICE: 'H',
        COL_TOTAL_PRICE: 'I',
      }
    });
  }
}

// 模板 6：ChisunIMPORT VTB RUB 俄罗斯专用
{
  const p = findByAny([['ChisunIMPORT', 'VTB']]);
  if (!p) { console.warn('  ⚠️  找不到 ChisunIMPORT VTB 模板'); }
  else {
    console.log(`\n[pi_chisun_vtb] 使用源文件: ${p}`);
    addTemplate({
      key: 'pi_chisun_vtb',
      family: 'en_pi',
      bytes: bytesOf(p),
      displayName: { 'zh-CN': 'Chisun PI（VTB 俄罗斯卢布）', 'en-US': 'Chisun PI (VTB Russia RUB)' },
      meta: {
        PRODUCT_ROW_FIRST: 5,
        PRODUCT_ROW_LAST_TPL: 5,
        TOTAL_ROW: 6,
        CELL_TOTAL_AMOUNT: 'C6',
        COL_A: 'A',
        COL_MODEL: 'B',
        COL_DESC1: 'C',
        COL_DESC2: 'D',
        COL_QTY: 'E',
        COL_UNIT_PRICE: 'H',
        COL_TOTAL_PRICE: 'I',
      }
    });
  }
}

// ================ 生成 utils/contract-templates.js ================
const out = [];
out.push(`/* eslint-disable */`);
out.push(`// Auto-generated by scripts/build-contract-templates.js —— 请不要手动修改，模板更新后重新运行脚本`);
out.push(``);
for (const r of registry) {
  out.push(`import _SNAP_${r.key} from './${snapshotNameFor(r.key)}';`);
}
out.push(``);

out.push(`export const TEMPLATE_REGISTRY = [`);
for (const r of registry) {
  const metaJson = JSON.stringify(r.meta, null, 2).replace(/\n/g, '\n    ');
  const displayJson = JSON.stringify(r.displayName, null, 2).replace(/\n/g, '\n    ');
  out.push(`  {`);
  out.push(`    key: '${r.key}',`);
  out.push(`    family: '${r.family}',`);
  out.push(`    displayName: ${displayJson},`);
  out.push(`    bytes: (function(){ try { return new Uint8Array(_SNAP_${r.key}); } catch(e) { return _SNAP_${r.key}; } })(),`);
  out.push(`    meta: ${metaJson}`);
  out.push(`  },`);
}
out.push(`];`);
out.push(``);
out.push(`export function getTemplateByKey(key) {`);
out.push(`  return TEMPLATE_REGISTRY.find(t => t.key === key) || TEMPLATE_REGISTRY[0];`);
out.push(`}`);
out.push(``);
out.push(`export default TEMPLATE_REGISTRY;`);
fs.writeFileSync(path.join(UTILS, 'contract-templates.js'), out.join('\n'));
console.log(`\n✅ 生成 utils/contract-templates.js  (共 ${registry.length} 个模板)`);
console.log('  列表:');
for (const r of registry) console.log(`    - ${r.key}  family=${r.family}  "${r.displayName['zh-CN']}"`);
