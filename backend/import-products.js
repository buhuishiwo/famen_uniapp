const mysql = require('mysql2/promise');

async function importProductSeries() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'CXH&cw9999',
    database: 'quotation_system'
  });

  console.log('连接数据库成功...');

  const products = [
    { name: 'QB系列', image: 'https://picui.ogmua.cn/s1/2026/05/29/6a186da26271b.webp' },
    { name: 'QC系列', image: 'https://picui.ogmua.cn/s1/2026/05/29/6a186d9f109a1.webp' },
    { name: 'QCA系列', image: 'https://picui.ogmua.cn/s1/2026/05/29/6a186da04e311.webp' },
    { name: 'QCB系列', image: 'https://picui.ogmua.cn/s1/2026/05/29/6a186da17ea99.webp' },
    { name: 'QCG系列', image: 'https://picui.ogmua.cn/s1/2026/05/29/6a186da08e694.webp' },
    { name: 'QD系列', image: 'https://picui.ogmua.cn/s1/2026/05/29/6a186dc060b51.webp' },
    { name: 'QH系列', image: 'https://picui.ogmua.cn/s1/2026/05/29/6a186dc172172.webp' },
    { name: 'QJ系列', image: 'https://picui.ogmua.cn/s1/2026/05/29/6a186dc05cd8b.webp' },
    { name: 'QMB系列', image: 'https://picui.ogmua.cn/s1/2026/05/29/6a186dc33af6f.webp' },
    { name: 'QMC系列', image: 'https://picui.ogmua.cn/s1/2026/05/29/6a186dc30996a.webp' },
    { name: 'QMDY系列', image: 'https://picui.ogmua.cn/s1/2026/05/29/6a186de3398d7.webp' },
    { name: 'QMG系列', image: 'https://picui.ogmua.cn/s1/2026/05/29/6a186de305045.webp' },
    { name: 'QP系列', image: 'https://picui.ogmua.cn/s1/2026/05/29/6a186de3556f8.webp' },
    { name: 'QS系列', image: 'https://picui.ogmua.cn/s1/2026/05/29/6a186de50918b.webp' },
    { name: 'QU系列', image: 'https://picui.ogmua.cn/s1/2026/05/29/6a186de572bef.webp' },
    { name: 'QUP系列', image: 'https://picui.ogmua.cn/s1/2026/05/29/6a186e0153854.webp' },
    { name: 'QV系列', image: 'https://picui.ogmua.cn/s1/2026/05/29/6a186e01a528f.webp' },
    { name: 'QVY系列', image: 'https://picui.ogmua.cn/s1/2026/05/29/6a186e01d2e47.webp' },
    { name: 'QW系列', image: 'https://picui.ogmua.cn/s1/2026/05/29/6a186e027164e.webp' },
    { name: 'QWF系列', image: 'https://picui.ogmua.cn/s1/2026/05/29/6a186e02ef6bb.webp' },
    { name: 'QWL系列', image: 'https://picui.ogmua.cn/s1/2026/05/29/6a186e1c4f4e4.webp' },
    { name: 'QWLY系列', image: 'https://picui.ogmua.cn/s1/2026/05/29/6a186e1ba340d.webp' },
    { name: 'QWY系列', image: 'https://picui.ogmua.cn/s1/2026/05/29/6a186e1d85d30.webp' },
    { name: 'QY系列', image: 'https://picui.ogmua.cn/s1/2026/05/29/6a186e1d27628.webp' },
    { name: 'QYA系列', image: 'https://picui.ogmua.cn/s1/2026/05/29/6a186e1d4cf8b.webp' }
  ];

  console.log('开始导入产品系列数据...');

  for (const product of products) {
    await connection.execute(
      'INSERT INTO product_series (name, image) VALUES (?, ?) ON DUPLICATE KEY UPDATE image = ?',
      [product.name, product.image, product.image]
    );
    console.log(`导入: ${product.name}`);
  }

  console.log('产品系列数据导入完成！');
  
  // 查询验证
  const [rows] = await connection.execute('SELECT * FROM product_series');
  console.log(`数据库中共有 ${rows.length} 个产品系列`);
  
  await connection.end();
}

importProductSeries().catch(err => {
  console.error('导入失败:', err);
  process.exit(1);
});
