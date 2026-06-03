const mysql = require('mysql2/promise');

async function queryModels() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'CXH&cw9999',
    database: 'quotation_system'
  });
  
  try {
    const [rows] = await connection.execute(
      'SELECT vm.name FROM valve_models vm JOIN product_series ps ON vm.series_id = ps.id WHERE ps.name LIKE ?',
      ['%QJ%']
    );
    console.log('QJ系列型号:', rows.map(r => r.name));
  } catch (error) {
    console.error('查询失败:', error);
  } finally {
    await connection.end();
  }
}

queryModels();