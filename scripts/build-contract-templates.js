#!/usr/bin/env node
/* eslint-disable */
/**
 * 5 个模板 → 生成 5 个 utils/tpl_<key>.json（Uint8Array 字节快照）
 * 同时生成 utils/contract-templates.js：
 *   1) 引入 5 个快照 JSON
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
  // 2026-08-15 改为 base64 存储：数字数组 JSON 在打包后膨胀约 3.5 倍（6 模板共 2.2MB），
  // base64 仅 1.33 倍，主包体积从 2.67MB 降到 ~1.3MB，规避微信 2MB 主包上限。
  const b64 = Buffer.from(u8arr).toString('base64');
  fs.writeFileSync(p, JSON.stringify(b64));
  console.log(`  ✅ 写快照 ${snapshotNameFor(key)}  (${u8arr.length} bytes -> ${Math.round(fs.statSync(p).size/1024)}KB base64 JSON)`);
  return { key, bytes: u8arr, path: p };
}

const registry = [];
function addTemplate(entry) {
  registry.push(entry);
  writeSnapshot(entry.key, entry.bytes);
}

// ================ 5 个模板配置（按识别顺序，找不到就用候选匹配） ================
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
        // 与 contract-xlsx-builder.js 的 FAMILY_CFG.cn_simple6 对齐（运行时以 FAMILY_CFG 为准，此处仅兜底）
        PRODUCT_ROW_FIRST: 12,
        PRODUCT_ROW_LAST_TPL: 12,
        TAX_ROW: 13,
        TOTAL_ROW: 14,
        CELL_PRETAX_MERGE: 'A13',
        CELL_TAX_TEXT_MERGE: 'O13',
        CELL_TAX_NUM: 'V13',
        CELL_RATE_MERGE: 'AC13',
        CELL_TOTAL_CN_MERGE: 'A14',
        CELL_TOTAL_NUM_MERGE: 'AC14',
        TAX_RATE: 0.13,
        _WRITE_STRATEGY: 'simple6_merge',
        COL_A: 'A', COL_SPEC: 'H', COL_DESC: 'P', COL_QTY: 'AG',
        COL_UNIT_PRICE: 'AJ', COL_TOTAL_PRICE: 'AK', COL_NOTE: 'AQ'
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
        // 与 contract-xlsx-builder.js 的 FAMILY_CFG.cn_simple6 对齐（运行时以 FAMILY_CFG 为准，此处仅兜底）
        PRODUCT_ROW_FIRST: 12,
        PRODUCT_ROW_LAST_TPL: 12,
        TAX_ROW: 13,
        TOTAL_ROW: 14,
        CELL_PRETAX_MERGE: 'A13',
        CELL_TAX_TEXT_MERGE: 'O13',
        CELL_TAX_NUM: 'V13',
        CELL_RATE_MERGE: 'AC13',
        CELL_TOTAL_CN_MERGE: 'A14',
        CELL_TOTAL_NUM_MERGE: 'AC14',
        TAX_RATE: 0.13,
        _WRITE_STRATEGY: 'simple6_merge',
        COL_A: 'A', COL_SPEC: 'H', COL_DESC: 'P', COL_QTY: 'AG',
        COL_UNIT_PRICE: 'AJ', COL_TOTAL_PRICE: 'AK', COL_NOTE: 'AQ'
      }
    });
  }
}

// 模板 4：Changqi 模板（英文 PI 格式家族）
{
  const p = findByAny([['Changqi模板'], ['Changqi'], ['常启']]);
  if (!p) { console.warn('  ⚠️  找不到 Changqi 模板（期望文件：document/Changqi模板.xlsx）'); }
  else {
    console.log(`\n[pi_changqi] 使用源文件: ${p}`);
    addTemplate({
      key: 'pi_changqi',
      family: 'en_pi',
      bytes: bytesOf(p),
      displayName: { 'zh-CN': 'Changqi 英文购销合同 (PI)', 'en-US': 'Changqi Proforma Invoice' },
      meta: {
        // 生成后以 FAMILY_CFG.pi_changqi 为准，此处仅做兜底占位；build 完会用 dump-template-rows 脚本重新核对
        PRODUCT_ROW_FIRST: 5,
        PRODUCT_ROW_LAST_TPL: 7,
        TOTAL_ROW: 8,
        CELL_TOTAL_AMOUNT: 'L8'
      }
    });
  }
}

// 模板 5：ChisunIMPORT 农行 人民币/美元/欧元 多币种
{
  const p = findByAny([
    ['ChisunIMPORT', '农行', '美元'],       // 最新文件名：ChisunIMPORT 模板-农行人民币美元欧元付款.xlsx（含空格）
    ['ChisunIMPORT', '人民币美元欧元'],
    ['ChisunIMPORT+', '农行'],              // 旧文件名兼容
    ['ChisunIMPORT', '多币种']
  ]);
  if (!p) { console.warn('  ⚠️  找不到 ChisunIMPORT 多币种模板（期望文件：document/ChisunIMPORT 模板-农行人民币美元欧元付款.xlsx）'); }
  else {
    console.log(`\n[pi_chisun_multi] 使用源文件: ${p}`);
    addTemplate({
      key: 'pi_chisun_multi',
      family: 'en_pi',
      bytes: bytesOf(p),
      displayName: { 'zh-CN': 'Chisun 英文购销合同 (农行 RMB/USD/EUR)', 'en-US': 'Chisun PI (Multi-Currency ABC)' },
      meta: {
        PRODUCT_ROW_FIRST: 5,
        PRODUCT_ROW_LAST_TPL: 7,
        TOTAL_ROW: 8,
        CELL_TOTAL_AMOUNT: 'L8'
      }
    });
  }
}

// 模板 6：ChisunIMPORT VTB 俄罗斯专用
{
  const p = findByAny([
    ['ChisunIMPORT', 'VTB', '俄罗斯'],      // 最新文件名：ChisunIMPORT模板-VTB人民币付款（俄罗斯专用).xlsx
    ['ChisunIMPORT', 'VTB'],
    ['ChisunIMPORT', '卢布'],
    ['ChisunIMPORT', 'VTB', '人民币']
  ]);
  if (!p) { console.warn('  ⚠️  找不到 ChisunIMPORT VTB 模板（期望文件：document/ChisunIMPORT模板-VTB人民币付款（俄罗斯专用).xlsx）'); }
  else {
    console.log(`\n[pi_chisun_vtb] 使用源文件: ${p}`);
    addTemplate({
      key: 'pi_chisun_vtb',
      family: 'en_pi',
      bytes: bytesOf(p),
      displayName: { 'zh-CN': 'Chisun 英文购销合同 (VTB 俄罗斯专用)', 'en-US': 'Chisun PI (VTB Russia RMB)' },
      meta: {
        PRODUCT_ROW_FIRST: 5,
        PRODUCT_ROW_LAST_TPL: 7,
        TOTAL_ROW: 8,
        CELL_TOTAL_AMOUNT: 'L8'
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
out.push(`// ——— 手写 base64 解码（tpl_*.json 为 base64 字符串，主包瘦身用）———`);
out.push(`//   兼容小程序运行时（不依赖 Node Buffer）；与 Buffer.from(b64,'base64') 结果一致（含 padding 修正）`);
out.push(`const _B64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';`);
out.push(`const _B64_LOOKUP = (function () {`);
out.push(`  const m = {};`);
out.push(`  for (let i = 0; i < _B64_CHARS.length; i++) m[_B64_CHARS.charAt(i)] = i;`);
out.push(`  return m;`);
out.push(`})();`);
out.push(`function _b64ToUint8(b64) {`);
out.push(`  if (typeof b64 !== 'string') return b64; // 兼容旧版数字数组快照`);
out.push(`  const pad = b64.endsWith('==') ? 2 : (b64.endsWith('=') ? 1 : 0);`);
out.push(`  const byteLength = Math.floor((b64.length * 3) / 4) - pad;`);
out.push(`  const out = new Uint8Array(byteLength);`);
out.push(`  let p = 0, buffer = 0, bits = 0;`);
out.push(`  for (let i = 0; i < b64.length; i++) {`);
out.push(`    const c = b64.charAt(i);`);
out.push(`    if (c === '=') break;`);
out.push(`    const v = _B64_LOOKUP[c];`);
out.push(`    if (v === undefined) continue;`);
out.push(`    buffer = (buffer << 6) | v;`);
out.push(`    bits += 6;`);
out.push(`    if (bits >= 8) { bits -= 8; out[p++] = (buffer >> bits) & 0xff; }`);
out.push(`  }`);
out.push(`  return out;`);
out.push(`}`);
out.push(``);
out.push(`export const TEMPLATE_REGISTRY = [`);
for (const r of registry) {
  const metaJson = JSON.stringify(r.meta, null, 2).replace(/\n/g, '\n    ');
  const displayJson = JSON.stringify(r.displayName, null, 2).replace(/\n/g, '\n    ');
  out.push(`  {`);
  out.push(`    key: '${r.key}',`);
  out.push(`    family: '${r.family}',`);
  out.push(`    displayName: ${displayJson},`);
  out.push(`    bytes: (function(){ try { return _b64ToUint8(_SNAP_${r.key}); } catch(e) { return _SNAP_${r.key}; } })(),`);
  out.push(`    meta: ${metaJson}`);
  out.push(`  },`);
}
out.push(`];`);
out.push(``);
out.push(`export function getTemplateByKey(key) {`);
out.push(`  return TEMPLATE_REGISTRY.find(t => t.key === key) || TEMPLATE_REGISTRY[0];`);
out.push(`}`);
out.push(``);
out.push(`// ================ 两条链路性能隔离（避免 setData 14MB 告警） ================`);
out.push(`// TEMPLATE_META_DISPLAY：仅 key/family/displayName（约 0.8KB），供模板列表渲染，绝不能含 bytes/meta`);
out.push(`export const TEMPLATE_META_DISPLAY = TEMPLATE_REGISTRY.map(function (t) {`);
out.push(`  return { key: t.key, family: t.family, displayName: t.displayName };`);
out.push(`});`);
out.push(``);
out.push(`// getTemplateRegistryForBuild()：生成时懒调用，返回含 bytes+meta 的完整注册表。`);
out.push(`//   返回值只存在调用处的局部变量，不进入 Vue data/computed/template，因此不会触发 setData 序列化`);
out.push(`let _buildCache = null;`);
out.push(`export function getTemplateRegistryForBuild() {`);
out.push(`  if (!_buildCache) {`);
out.push(`    _buildCache = TEMPLATE_REGISTRY.map(function (t) {`);
out.push(`      return { key: t.key, family: t.family, displayName: t.displayName, bytes: t.bytes, meta: t.meta };`);
out.push(`    });`);
out.push(`  }`);
out.push(`  return _buildCache;`);
out.push(`}`);
out.push(``);
out.push(`export default TEMPLATE_REGISTRY;`);
fs.writeFileSync(path.join(UTILS, 'contract-templates.js'), out.join('\n'));
console.log(`\n✅ 生成 utils/contract-templates.js  (共 ${registry.length} 个模板)`);
console.log('  列表:');
for (const r of registry) console.log(`    - ${r.key}  family=${r.family}  "${r.displayName['zh-CN']}"`);
