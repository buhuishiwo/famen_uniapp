#!/usr/bin/env node
/* eslint-disable */
/**
 * 迷你诊断：针对 en_pi 家族 Changqi 模板，对比 Node 端输出是否真有内容（而不是 Sheet1 全空）
 *   - 用 Node 版 jszip 跑 buildContract
 *   - 然后重新打开输出的 xlsx，检查 sheet1.xml 的 sheetData 行数、是否含 "QBZ673X" 产品名
 *   - 输出 /tmp/diag_pi_changqi.xlsx，本地 Excel 打开肉眼确认
 */
const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');
const { buildContract } = require(path.join(__dirname, '..', 'utils', 'contract-xlsx-builder.js'));

// 手动拼 TEMPLATE_REGISTRY（与 E2E standalone 一致）
const UTILS_DIR = path.join(__dirname, '..', 'utils');
const TPL_META = [
  { key: 'pi_changqi', family: 'en_pi', displayName: 'Changqi 英文 PI', jsonName: 'tpl_pi_changqi.json',
    meta: { PRODUCT_ROW_FIRST:5,PRODUCT_ROW_LAST_TPL:5,TOTAL_ROW:6,CELL_TOTAL_AMOUNT:'C6',
      COL_A:'A',COL_MODEL:'B',COL_DESC1:'C',COL_DESC2:'D',COL_QTY:'E',COL_UNIT_PRICE:'H',COL_TOTAL_PRICE:'I' } }
];
const TEMPLATE_REGISTRY = TPL_META.map(m => {
  const jsonPath = path.join(UTILS_DIR, m.jsonName);
  const arr = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  return Object.assign({}, m, { bytes: new Uint8Array(arr) });
});

const items = [
  { productType:'D71X', productName:'Wafer Type Butterfly Valve', model:100, spec:'D71X-10P DN100',
    bodyMaterial:'CF8M', unitWeight:'12kg', unit:'PC', quantity:20, unitPrice:1280, totalPrice:25600 },
  { productType:'Z45X', productName:'Resilient Seated Gate Valve', model:150, spec:'Z45X-10Q DN150',
    bodyMaterial:'QT450', unitWeight:'28kg', unit:'PC', quantity:15, unitPrice:3860, totalPrice:57900 },
  { productType:'H44H', productName:'Swing Check Valve', model:80, spec:'H44H-16C DN80',
    bodyMaterial:'WCB', unitWeight:'18kg', unit:'PC', quantity:30, unitPrice:960, totalPrice:28800 }
];
const finalPrice = 25600 + 57900 + 28800;

(async () => {
  console.log('===== PI_changqi 诊断 =====');
  console.log('items=', items.length, '  finalPrice=', finalPrice);
  const template = TEMPLATE_REGISTRY[0];
  console.log('template.bytes.length=', template.bytes.length, '  hex4=',
    [template.bytes[0],template.bytes[1],template.bytes[2],template.bytes[3]].map(b=>b.toString(16).padStart(2,'0')).join(' '));

  const outU8 = await buildContract(JSZip, TEMPLATE_REGISTRY, 'pi_changqi', items, { finalPrice, note:'', items });
  console.log('outU8.length=', outU8.length, '  hex4=',
    [outU8[0],outU8[1],outU8[2],outU8[3]].map(b=>b.toString(16).padStart(2,'0')).join(' '));

  const outPath = '/tmp/diag_pi_changqi.xlsx';
  const rawBin = Buffer.from(outU8.buffer.slice(outU8.byteOffset, outU8.byteOffset+outU8.byteLength));
  fs.writeFileSync(outPath, rawBin);
  console.log('保存到:', outPath);

  // 重新打开 ZIP 检查 sheet1.xml 内容
  console.log('\n--- 重新打开 ZIP，探查 sheet1.xml ---');
  const z2 = await JSZip.loadAsync(outU8);
  const sheetStr = await z2.file('xl/worksheets/sheet1.xml').async('string');
  console.log('sheet1.xml 字节长度 =', sheetStr.length);
  console.log('sheet1.xml 包含 <sheetData>?', sheetStr.includes('<sheetData'));

  // 统计 <row 数量
  const rowCount = (sheetStr.match(/<row\s+r="/g) || []).length;
  console.log('<row r="..."> 数量 =', rowCount, '（至少需要 6 行：4行表头+1产品+1合计，产品多的话更多）');

  // 检查产品关键字
  const keywords = ['D71X', 'Z45X', 'H44H', '25600', '57900', '28800', '112300']; // 112300 = 合计
  keywords.forEach(kw => {
    const found = sheetStr.includes(kw);
    console.log('  sheet1.xml 包含 "' + kw + '"?', found ? '✅ YES' : '❌ NO');
  });

  // 抽取 sheetData 里前 3 行 <row>...</row> 片段预览
  const sdStart = sheetStr.indexOf('<sheetData');
  const sdEnd = sheetStr.indexOf('</sheetData>') + 13;
  const sd = sheetStr.slice(sdStart, sdEnd);
  console.log('\n--- sheetData 前 1500 字符预览 ---');
  console.log(sd.slice(0, 1500));
  console.log('\n...\n--- sheetData 后 800 字符预览 ---');
  console.log(sd.slice(-800));
})();
