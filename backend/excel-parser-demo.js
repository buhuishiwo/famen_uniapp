const ExcelParser = require('./excel-parser');
const path = require('path');

/**
 * Excel解析器使用示例
 * 演示空列检测和智能更新逻辑
 */

async function main() {
  // 示例文件路径
  const filePath = path.join(__dirname, '../报价更新正式生产版模板.xlsx');
  
  console.log('=== Excel解析器演示 ===\n');
  
  // 1. 解析Excel文件
  console.log('【步骤1】解析Excel文件（自动检测空列）');
  const parseResult = ExcelParser.parse(filePath, {
    ignoreEmptyCols: true,      // 忽略空列
    returnEmptyCols: false      // 不返回空列数据
  });
  
  if (!parseResult.success) {
    console.error('❌ 解析失败:', parseResult.message);
    return;
  }
  
  console.log(ExcelParser.formatResult(parseResult));
  
  // 2. 获取第一个工作表数据
  const sheet = parseResult.sheets[0];
  if (!sheet) {
    console.error('❌ 没有找到工作表');
    return;
  }
  
  // 3. 生成更新数据（只包含有数据的列）
  console.log('\n【步骤2】生成更新数据');
  const updateData = ExcelParser.generateUpdateData(sheet, ['型号', '尺寸']);
  
  console.log(`📝 有效数据行数: ${updateData.rows.length}`);
  console.log(`⏭️  跳过的行数: ${updateData.skippedRows.length}`);
  console.log(`📌 更新的列: ${updateData.updatedColumns.join(', ')}`);
  console.log(`⬜ 跳过的空列: ${updateData.skippedColumns.join(', ') || '无'}`);
  
  // 显示错误信息
  if (updateData.errors.length > 0) {
    console.log('\n❌ 数据错误:');
    updateData.errors.forEach((err) => {
      console.log(`  第${err.rowIndex}行: ${err.errors.join(', ')}`);
    });
  }
  
  // 4. 显示示例数据行
  console.log('\n【步骤3】示例数据行（仅包含非空列）');
  const sampleRows = updateData.rows.slice(0, 3);
  sampleRows.forEach((item) => {
    console.log(`\n📋 第${item.rowIndex}行:`);
    Object.keys(item.data).forEach((key) => {
      const value = item.data[key];
      console.log(`  ${key}: ${value !== null ? value : '(空)'}`);
    });
  });
  
  // 5. 演示数据对比功能（模拟增量更新）
  console.log('\n【步骤4】数据对比演示（模拟增量更新）');
  
  // 模拟数据库中的现有数据
  const existingData = [
    { 型号: 'QPAZ73X-10C', 尺寸: 50, 手动价格: 600, 气动价格: 800 },
    { 型号: 'QPAZ73X-10C', 尺寸: 65, 手动价格: 680, 气动价格: 900 },
    { 型号: 'QPAZ673X-10C', 尺寸: 50, 手动价格: 0, 气动价格: 950 }
  ];
  
  // 模拟Excel中的新数据（部分列为空）
  const excelData = [
    { 型号: 'QPAZ73X-10C', 尺寸: 50, 手动价格: 620, 气动价格: null },  // 气动价格为空，不更新
    { 型号: 'QPAZ73X-10C', 尺寸: 65, 手动价格: null, 气动价格: 950 },  // 手动价格为空，不更新
    { 型号: 'QPAZ673X-10C', 尺寸: 50, 手动价格: 780, 气动价格: 1050 }, // 都有数据，都更新
    { 型号: 'QPAZ943X-10C', 尺寸: 50, 手动价格: 1200, 气动价格: 0 }   // 新增记录
  ];
  
  // 对比数据
  const changes = ExcelParser.compareData(excelData, existingData, '型号');
  
  console.log(`\n🆕 新增记录: ${changes.added.length} 条`);
  changes.added.forEach(item => {
    console.log(`  + ${item.key}`);
  });
  
  console.log(`\n🔄 更新记录: ${changes.updated.length} 条`);
  changes.updated.forEach(item => {
    console.log(`  ~ ${item.key}:`);
    item.changes.forEach(change => {
      console.log(`    ${change.field}: ${change.oldValue} → ${change.newValue}`);
    });
  });
  
  console.log(`\n🗑️ 删除记录: ${changes.deleted.length} 条`);
  changes.deleted.forEach(item => {
    console.log(`  - ${item.key}`);
  });
  
  console.log(`\n✅ 无变化: ${changes.unchanged.length} 条`);
  
  // 6. 生成最终更新SQL（演示）
  console.log('\n【步骤5】生成更新SQL语句（演示）');
  changes.updated.forEach(item => {
    const setClause = item.changes.map(c => `${c.field} = '${c.newValue}'`).join(', ');
    console.log(`UPDATE price_table SET ${setClause} WHERE 型号 = '${item.key}';`);
  });
  
  // 7. 总结
  console.log('\n=== 总结 ===');
  console.log('✅ 空列自动检测：解析器会自动识别所有数据行为空的列');
  console.log('✅ 智能更新：空列的数据不会被纳入更新范围');
  console.log('✅ 增量更新：对比现有数据，只更新有变化的字段');
  console.log('✅ 错误处理：必填字段为空时会被标记并跳过');
}

// 运行示例
main().catch(console.error);
