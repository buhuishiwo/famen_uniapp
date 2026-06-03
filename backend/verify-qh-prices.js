const mysql = require('mysql2/promise');

const config = {
  host: 'localhost',
  user: 'root',
  password: 'CXH&cw9999',
  database: 'quotation_system'
};

async function verifyPrices() {
  const connection = await mysql.createConnection(config);
  
  try {
    console.log('=== QH系列价格数据验证 ===\n');
    
    // 查询QH系列的价格数据
    const [prices] = await connection.execute(`
      SELECT vm.name as valveName, pt.size, pt.manual_price, pt.pneumatic_price, pt.gear_price
      FROM price_table pt
      JOIN valve_models vm ON pt.model_id = vm.id
      JOIN product_series ps ON vm.series_id = ps.id
      WHERE ps.name = 'QH系列'
      ORDER BY vm.name, pt.size
    `);
    
    console.log('QH系列价格数据：');
    console.log('型号'.padEnd(20) + '规格'.padEnd(6) + '手动价'.padEnd(10) + '气动价'.padEnd(10) + '伞齿轮价');
    console.log('----------------------------------------------------------------');
    
    for (const price of prices) {
      const name = price.valveName.padEnd(20);
      const size = `DN${price.size}`.padEnd(6);
      const manual = (price.manual_price || '-').toString().padEnd(10);
      const pneumatic = (price.pneumatic_price || '-').toString().padEnd(10);
      const gear = (price.gear_price || '-').toString();
      console.log(`${name} ${size} ${manual} ${pneumatic} ${gear}`);
    }
    
    console.log(`\n共 ${prices.length} 条记录`);
    
  } catch (error) {
    console.error('查询失败:', error);
  } finally {
    await connection.end();
  }
}

verifyPrices();