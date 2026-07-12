/**
 * 将 quotation_export.xlsx 按系列拆分为多个小文件
 */
const XLSX = require('xlsx');

const inputFile = 'quotation_export.xlsx';
const wb = XLSX.readFile(inputFile);
const ws = wb.Sheets['价格库导入'];
const allData = XLSX.utils.sheet_to_json(ws, { header: 1 });

const headers = allData[0];
const rows = allData.slice(1).filter(r => r.length > 0 && r[0]);

// 按系列分组
const groups = {};
for (const row of rows) {
  const series = row[0]; // 第一列是产品系列
  if (!groups[series]) groups[series] = [];
  groups[series].push(row);
}

// 计算每个系列的行数
const seriesInfo = Object.entries(groups)
  .map(([name, data]) => ({ name, count: data.length }))
  .sort((a, b) => b.count - a.count);
console.log('系列分布:');
seriesInfo.forEach(s => console.log('  ' + s.name + ': ' + s.count + ' 行'));

// 贪心算法：将系列分配到 N 个分组中，使每个分组的行数尽量接近
const NUM_FILES = 4;
const buckets = Array.from({ length: NUM_FILES }, () => ({ series: [], rows: [], total: 0 }));

// 按行数降序分配
const sortedSeries = Object.entries(groups).sort((a, b) => b[1].length - a[1].length);

for (const [name, data] of sortedSeries) {
  // 找当前总行数最少的分组
  buckets.sort((a, b) => a.total - b.total);
  buckets[0].series.push(name);
  buckets[0].rows.push(...data);
  buckets[0].total += data.length;
}

// 写入文件
for (let i = 0; i < NUM_FILES; i++) {
  if (buckets[i].rows.length === 0) continue;

  const newWb = XLSX.utils.book_new();
  const wsData = [headers, ...buckets[i].rows];
  const newWs = XLSX.utils.aoa_to_sheet(wsData);

  // 设置列宽
  newWs['!cols'] = [
    { wch: 12 }, { wch: 22 }, { wch: 10 }, { wch: 12 }, { wch: 12 },
    { wch: 12 }, { wch: 12 }, { wch: 14 }, { wch: 14 }, { wch: 14 },
    { wch: 14 }, { wch: 10 }, { wch: 10 }, { wch: 8 }, { wch: 20 },
  ];

  XLSX.utils.book_append_sheet(newWb, newWs, '价格库导入');

  const filename = `quotation_export_part${i + 1}.xlsx`;
  XLSX.writeFile(newWb, filename);
  console.log(`\n✅ ${filename}: ${buckets[i].rows.length} 行`);
  console.log('   包含系列: ' + buckets[i].series.join(', '));
}

// 也生成型号库导入文件（如果模板有的话）
if (wb.SheetNames.includes('型号库导入')) {
  const modelWs = wb.Sheets['型号库导入'];
  const modelData = XLSX.utils.sheet_to_json(modelWs, { header: 1 });
  const modelWb = XLSX.utils.book_new();
  const modelNewWs = XLSX.utils.aoa_to_sheet(modelData);
  modelNewWs['!cols'] = [{ wch: 14 }, { wch: 26 }, { wch: 14 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(modelWb, modelNewWs, '型号库导入');
  XLSX.writeFile(modelWb, 'model_export.xlsx');
  console.log(`\n✅ model_export.xlsx: ${modelData.length - 1} 行型号数据`);
}

console.log('\n全部完成!');
