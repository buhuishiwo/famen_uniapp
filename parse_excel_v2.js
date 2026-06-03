const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, '报价更新正式生产版模板.xlsx');

try {
  const workbook = XLSX.readFile(filePath);
  
  console.log('=== Excel文件解析结果 ===\n');
  console.log('工作表列表:', workbook.SheetNames);
  
  workbook.SheetNames.forEach((sheetName, index) => {
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    
    console.log(`\n--- 工作表 ${index + 1}: ${sheetName} ---`);
    console.log('总行数:', data.length);
    
    if (data.length > 0) {
      console.log('\n表头:', JSON.stringify(data[0]));
      
      console.log('\n前3行数据:');
      data.slice(0, Math.min(4, data.length)).forEach((row, i) => {
        console.log(`第${i + 1}行: ${JSON.stringify(row)}`);
      });
    }
  });
} catch (error) {
  console.error('解析Excel文件失败:', error.message);
  console.error('错误详情:', error);
}