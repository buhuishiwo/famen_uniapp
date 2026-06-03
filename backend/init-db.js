const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function initDatabase() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'CXH&cw9999',
    multipleStatements: true
  });

  console.log('连接数据库成功...');

  const sqlFile = path.join(__dirname, 'database', 'init.sql');
  const sql = fs.readFileSync(sqlFile, 'utf8');

  console.log('执行初始化脚本...');
  await connection.query(sql);
  
  console.log('数据库初始化完成！');
  await connection.end();
}

initDatabase().catch(err => {
  console.error('初始化失败:', err);
  process.exit(1);
});
