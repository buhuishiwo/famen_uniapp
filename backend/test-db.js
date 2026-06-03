const mysql = require('mysql2/promise');

async function testDatabase() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'CXH&cw9999',
    database: 'quotation_system'
  });

  console.log('=== 数据库连接测试 ===\n');

  // 查询产品系列
  const [series] = await connection.execute('SELECT * FROM product_series');
  console.log(`产品系列数量: ${series.length}`);
  console.log('示例:', series.slice(0, 3).map(s => s.name).join(', '));
  console.log();

  // 查询阀门型号
  const [models] = await connection.execute('SELECT * FROM valve_models LIMIT 5');
  console.log(`阀门型号数量: ${models.length} (示例)`);
  console.log();

  // 查询价格表
  const [prices] = await connection.execute('SELECT * FROM price_table LIMIT 5');
  console.log(`价格数据数量: ${prices.length} (示例)`);
  console.log();

  // 查询报价单
  const [quotations] = await connection.execute('SELECT * FROM quotations');
  console.log(`报价单数量: ${quotations.length}`);
  if (quotations.length > 0) {
    console.log('最新报价单:', {
      id: quotations[0].id,
      customer: quotations[0].customer_name,
      total: quotations[0].total_amount,
      status: quotations[0].status,
      created: quotations[0].created_at
    });
  }

  await connection.end();
  console.log('\n=== 测试完成 ===');
}

testDatabase().catch(err => {
  console.error('测试失败:', err);
  process.exit(1);
});
