/**
 * 从 quotation.sql 导出数据为 Excel 文件
 * 按照 报价更新正式生产版模板.xlsx 的格式生成
 */
const fs = require('fs');
const XLSX = require('xlsx');

// ========== 1. 解析 SQL INSERT 语句 ==========

function parseInsertSQL(sql) {
  // 提取 VALUES 后面的部分 - 找到 VALUES 关键字位置
  const valuesIdx = sql.toUpperCase().indexOf('VALUES');
  if (valuesIdx === -1) {
    console.error('无法找到 VALUES 关键字');
    return [];
  }

  const valuesPart = sql.substring(valuesIdx + 6).trim(); // 跳过 "VALUES "

  // 解析每个括号组: (...),(...),...
  const rows = [];
  let depth = 0;
  let current = '';
  let inString = false;
  let stringChar = '';

  for (let i = 0; i < valuesPart.length; i++) {
    const ch = valuesPart[i];

    if (inString) {
      current += ch;
      if (ch === '\\' && i + 1 < valuesPart.length) {
        current += valuesPart[++i];
        continue;
      }
      if (ch === stringChar) {
        inString = false;
      }
      continue;
    }

    if (ch === "'" || ch === '"') {
      inString = true;
      stringChar = ch;
      current += ch;
      continue;
    }

    if (ch === '(') {
      depth++;
      if (depth === 1) {
        current = '';
        continue;
      }
      current += ch;
      continue;
    }

    if (ch === ')') {
      depth--;
      if (depth === 0) {
        rows.push(parseRowValues(current));
        current = '';
        continue;
      }
      current += ch;
      continue;
    }

    if (depth >= 1) {
      current += ch;
    }
  }

  // Handle last row if still pending (shouldn't happen with well-formed SQL)
  if (current.trim() && depth === 0) {
    // could be trailing comma or spaces after the last closing paren
  }

  return rows;
}

function parseRowValues(rowStr) {
  const values = [];
  let current = '';
  let inString = false;
  let stringChar = '';

  for (let i = 0; i < rowStr.length; i++) {
    const ch = rowStr[i];

    if (inString) {
      current += ch;
      if (ch === '\\' && i + 1 < rowStr.length) {
        current += rowStr[++i];
        continue;
      }
      if (ch === stringChar) {
        inString = false;
      }
      continue;
    }

    if (ch === "'" || ch === '"') {
      inString = true;
      stringChar = ch;
      current += ch;
      continue;
    }

    if (ch === ',') {
      values.push(current.trim());
      current = '';
      continue;
    }

    current += ch;
  }

  if (current.trim()) {
    values.push(current.trim());
  }

  // 清理值
  return values.map(v => {
    v = v.trim();
    if ((v.startsWith("'") && v.endsWith("'")) || (v.startsWith('"') && v.endsWith('"'))) {
      v = v.slice(1, -1);
      // 处理转义
      v = v.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    }
    if (v === 'NULL' || v === 'null') return null;
    return v;
  });
}

// 从大文件中提取 INSERT 语句（每行读取以处理大文件）
function extractInsertStatements(filename) {
  const content = fs.readFileSync(filename, 'utf-8');
  const lines = content.split('\n');
  const statements = {};

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('INSERT INTO')) {
      // 提取表名
      const match = trimmed.match(/INSERT INTO `(\w+)`/);
      if (match) {
        const tableName = match[1];
        if (!statements[tableName]) {
          statements[tableName] = [];
        }
        statements[tableName].push(trimmed);
      }
    }
  }

  return statements;
}

// ========== 2. 主处理逻辑 ==========

console.log('正在解析 quotation.sql ...');
const statements = extractInsertStatements('quotation.sql');
console.log('找到的表:', Object.keys(statements));

// 解析各表数据
const productSeries = [];
if (statements['product_series']) {
  for (const stmt of statements['product_series']) {
    productSeries.push(...parseInsertSQL(stmt));
  }
}
console.log(`product_series: ${productSeries.length} rows`);

const valveModels = [];
if (statements['valve_models']) {
  for (const stmt of statements['valve_models']) {
    valveModels.push(...parseInsertSQL(stmt));
  }
}
console.log(`valve_models: ${valveModels.length} rows`);

const priceTable = [];
if (statements['price_table']) {
  for (const stmt of statements['price_table']) {
    priceTable.push(...parseInsertSQL(stmt));
  }
}
console.log(`price_table: ${priceTable.length} rows`);

// 构建查找映射
// valve_models: id(索引0) → { name(索引2), series_id(索引1) }
const modelMap = {};
for (const row of valveModels) {
  const id = parseInt(row[0]);
  modelMap[id] = {
    name: row[2],       // name
    series_id: parseInt(row[1])  // series_id
  };
}

// product_series: id(索引0) → name(索引1)
const seriesMap = {};
for (const row of productSeries) {
  const id = parseInt(row[0]);
  seriesMap[id] = row[1]; // name
}

console.log(`modelMap: ${Object.keys(modelMap).length} items`);
console.log(`seriesMap: ${Object.keys(seriesMap).length} items`);

// Debug: print sample model and series
console.log('Sample modelMap entries:', JSON.stringify(Object.entries(modelMap).slice(0, 3)));
console.log('Sample seriesMap entries:', JSON.stringify(Object.entries(seriesMap).slice(0, 3)));

// ========== 3. 生成导出数据 ==========

const exportRows = [];
const skippedRows = [];

for (const row of priceTable) {
  // price_table 列顺序: id(0), model_id(1), size(2), manual_price(3), pneumatic_price(4),
  //                      electric_price(5), gear_price(6), gate_304_diff(7), gate_316_diff(8),
  //                      rod_304_diff(9), rod_316_diff(10), branding_fee(11), min_order_qty(12),
  //                      status(13), remark(14), created_at(15)
  const modelId = parseInt(row[1]);
  const model = modelMap[modelId];

  if (!model) {
    skippedRows.push({ reason: 'model not found', modelId, priceId: row[0] });
    continue;
  }

  const seriesId = model.series_id;
  const seriesName = seriesMap[seriesId];

  if (!seriesName) {
    skippedRows.push({ reason: 'series not found', seriesId, modelId, priceId: row[0] });
    continue;
  }

  // 状态转换: 'enabled' → '启用', 'disabled' → '禁用'
  const status = row[13];
  const statusText = status === 'enabled' ? '启用' : (status === 'disabled' ? '禁用' : status);

  // 价格字段：NULL → ''
  const toNum = (val) => {
    if (val === null || val === undefined || val === '') return '';
    const n = parseFloat(val);
    return isNaN(n) ? '' : n;
  };

  exportRows.push({
    '产品系列': seriesName,
    '阀门型号': model.name,
    '规格DN': parseInt(row[2]),
    '手动价格': toNum(row[3]),
    '气动价格': toNum(row[4]),
    '电装价格': toNum(row[5]),
    '伞齿轮价格': toNum(row[6]),
    '304闸板差价': toNum(row[7]) || 0,
    '316闸板差价': toNum(row[8]) || 0,
    '304阀杆差价': toNum(row[9]) || 0,
    '316阀杆差价': toNum(row[10]) || 0,
    '磨标费': toNum(row[11]) || 0,
    '起订量': parseInt(row[12]) || 1,
    '状态': statusText,
    '备注': row[14] || ''
  });
}

console.log(`\n成功映射: ${exportRows.length} 行`);
console.log(`跳过: ${skippedRows.length} 行`);
if (skippedRows.length > 0) {
  console.log('跳过样例:', JSON.stringify(skippedRows.slice(0, 5)));
}

if (exportRows.length === 0) {
  console.error('ERROR: 没有成功映射任何数据行！正在退出。');
  process.exit(1);
}

// ========== 4. 写入 Excel ==========

// 按系列 → 型号 → 规格排序
exportRows.sort((a, b) => {
  if (a['产品系列'] !== b['产品系列']) return a['产品系列'].localeCompare(b['产品系列']);
  if (a['阀门型号'] !== b['阀门型号']) return a['阀门型号'].localeCompare(b['阀门型号']);
  return a['规格DN'] - b['规格DN'];
});

// 创建工作簿
const wb = XLSX.utils.book_new();

// Sheet 1: 价格库导入
const headers = [
  '产品系列', '阀门型号', '规格DN', '手动价格', '气动价格', '电装价格',
  '伞齿轮价格', '304闸板差价', '316闸板差价', '304阀杆差价', '316阀杆差价',
  '磨标费', '起订量', '状态', '备注'
];

const wsData = [headers];
for (const row of exportRows) {
  wsData.push(headers.map(h => row[h] !== undefined && row[h] !== null ? row[h] : ''));
}

const ws = XLSX.utils.aoa_to_sheet(wsData);

const colWidths = [
  { wch: 12 }, { wch: 22 }, { wch: 10 }, { wch: 12 }, { wch: 12 },
  { wch: 12 }, { wch: 12 }, { wch: 14 }, { wch: 14 }, { wch: 14 },
  { wch: 14 }, { wch: 10 }, { wch: 10 }, { wch: 8 }, { wch: 20 },
];
ws['!cols'] = colWidths;

XLSX.utils.book_append_sheet(wb, ws, '价格库导入');

// Sheet 2: 型号库导入
const modelHeaders = ['产品系列', '阀门型号', '型号代码(可选)', '备注'];
const modelWsData = [modelHeaders];
for (const row of valveModels) {
  const seriesName = seriesMap[parseInt(row[1])] || '';
  modelWsData.push([
    seriesName,
    row[2],  // name
    row[3],  // type_code
    ''
  ]);
}
const modelWs = XLSX.utils.aoa_to_sheet(modelWsData);
modelWs['!cols'] = [{ wch: 14 }, { wch: 26 }, { wch: 14 }, { wch: 20 }];
XLSX.utils.book_append_sheet(wb, modelWs, '型号库导入');

// Sheet 3: 导入说明
const instructionData = [
  ['报价数据导入说明'],
  [''],
  ['1. 价格库导入 sheet — 用于导入阀门产品的价格数据'],
  ['   - 产品系列：必须与型号库中的系列名称完全一致'],
  ['   - 阀门型号：必须与型号库中的阀门型号名称完全一致'],
  ['   - 规格DN：50-2000之间的整数'],
  ['   - 价格字段：至少填写一种执行方式的价格（手动/气动/电装/伞齿轮）'],
  ['   - 起订量：必须为大于0的整数'],
  ['   - 状态：填写"启用"或"禁用"'],
  [''],
  ['2. 型号库导入 sheet — 用于导入阀门型号和产品系列'],
  ['   - 产品系列：如果系列不存在，将自动创建新的产品系列'],
  ['   - 阀门型号：阀门型号的名称'],
  ['   - 型号代码：可选，用于价格计算时的类型匹配'],
  [''],
  ['3. 价格字段中，空的表示该执行方式不适用或暂无报价'],
  [''],
  [`生成日期：${new Date().toLocaleString('zh-CN')}`],
  [`数据来源：quotation.sql`],
  [`总记录数：${exportRows.length} 条价格记录，${valveModels.length} 个阀门型号，${productSeries.length} 个产品系列`],
];
const instructionWs = XLSX.utils.aoa_to_sheet(instructionData);
instructionWs['!cols'] = [{ wch: 70 }];
XLSX.utils.book_append_sheet(wb, instructionWs, '导入说明');

// 写入文件
const outputFilename = 'quotation_export.xlsx';
XLSX.writeFile(wb, outputFilename);
console.log(`\n✅ 导出完成: ${outputFilename}`);
console.log(`   价格数据: ${exportRows.length} 行`);
console.log(`   阀门型号: ${valveModels.length} 个`);
console.log(`   产品系列: ${productSeries.length} 个`);
