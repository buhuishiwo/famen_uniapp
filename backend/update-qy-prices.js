const mysql = require('mysql2/promise');

const config = {
  host: 'localhost',
  user: 'root',
  password: 'CXH&cw9999',
  database: 'quotation_system'
};

const qyPrices = [
  // QYZ73X-10C (手动)
  { valveName: 'QYZ73X-10C (手动)', size: 80, manualPrice: 380 },
  { valveName: 'QYZ73X-10C (手动)', size: 100, manualPrice: 440 },
  { valveName: 'QYZ73X-10C (手动)', size: 125, manualPrice: 530 },
  { valveName: 'QYZ73X-10C (手动)', size: 150, manualPrice: 680 },
  { valveName: 'QYZ73X-10C (手动)', size: 200, manualPrice: 940 },
  { valveName: 'QYZ73X-10C (手动)', size: 250, manualPrice: 1350 },
  { valveName: 'QYZ73X-10C (手动)', size: 300, manualPrice: 1850 },
  { valveName: 'QYZ73X-10C (手动)', size: 350, manualPrice: 2500 },
  { valveName: 'QYZ73X-10C (手动)', size: 400, manualPrice: 3150 },
  
  // QYZ673X-10C (气动)
  { valveName: 'QYZ673X-10C (气动)', size: 50, pneumaticPrice: 480 },
  { valveName: 'QYZ673X-10C (气动)', size: 65, pneumaticPrice: 480 },
  { valveName: 'QYZ673X-10C (气动)', size: 80, pneumaticPrice: 480 },
  { valveName: 'QYZ673X-10C (气动)', size: 100, pneumaticPrice: 545 },
  { valveName: 'QYZ673X-10C (气动)', size: 125, pneumaticPrice: 640 },
  { valveName: 'QYZ673X-10C (气动)', size: 150, pneumaticPrice: 820 },
  { valveName: 'QYZ673X-10C (气动)', size: 200, pneumaticPrice: 1100 },
  { valveName: 'QYZ673X-10C (气动)', size: 250, pneumaticPrice: 1550 },
  { valveName: 'QYZ673X-10C (气动)', size: 300, pneumaticPrice: 2150 },
  { valveName: 'QYZ673X-10C (气动)', size: 350, pneumaticPrice: 2850 },
  { valveName: 'QYZ673X-10C (气动)', size: 400, pneumaticPrice: 3600 },
  { valveName: 'QYZ673X-10C (气动)', size: 450, pneumaticPrice: 4700 },
  { valveName: 'QYZ673X-10C (气动)', size: 500, pneumaticPrice: 7500 },
  { valveName: 'QYZ673X-10C (气动)', size: 600, pneumaticPrice: 13580 },
  { valveName: 'QYZ673X-10C (气动)', size: 700, pneumaticPrice: 20000 },
  { valveName: 'QYZ673X-10C (气动)', size: 800, pneumaticPrice: 23300 },
  { valveName: 'QYZ673X-10C (气动)', size: 900, pneumaticPrice: 30000 },
  { valveName: 'QYZ673X-10C (气动)', size: 1000, pneumaticPrice: 42400 },
  
  // QYZ573X-10C (伞齿轮)
  { valveName: 'QYZ573X-10C (伞齿轮)', size: 80, gearPrice: 830 },
  { valveName: 'QYZ573X-10C (伞齿轮)', size: 100, gearPrice: 890 },
  { valveName: 'QYZ573X-10C (伞齿轮)', size: 125, gearPrice: 980 },
  { valveName: 'QYZ573X-10C (伞齿轮)', size: 150, gearPrice: 1130 },
  { valveName: 'QYZ573X-10C (伞齿轮)', size: 200, gearPrice: 1390 },
  { valveName: 'QYZ573X-10C (伞齿轮)', size: 250, gearPrice: 1800 },
  { valveName: 'QYZ573X-10C (伞齿轮)', size: 300, gearPrice: 2350 },
  { valveName: 'QYZ573X-10C (伞齿轮)', size: 350, gearPrice: 3000 },
  { valveName: 'QYZ573X-10C (伞齿轮)', size: 400, gearPrice: 3650 },
  { valveName: 'QYZ573X-10C (伞齿轮)', size: 450, gearPrice: 3900 },
  { valveName: 'QYZ573X-10C (伞齿轮)', size: 500, gearPrice: 6355 },
  { valveName: 'QYZ573X-10C (伞齿轮)', size: 600, gearPrice: 10550 },
  { valveName: 'QYZ573X-10C (伞齿轮)', size: 700, gearPrice: 15000 },
  { valveName: 'QYZ573X-10C (伞齿轮)', size: 800, gearPrice: 19400 },
  { valveName: 'QYZ573X-10C (伞齿轮)', size: 900, gearPrice: 24380 },
  { valveName: 'QYZ573X-10C (伞齿轮)', size: 1000, gearPrice: 32880 }
];

async function updatePrices() {
  const connection = await mysql.createConnection(config);
  
  try {
    console.log('开始更新QY系列价格数据...\n');
    
    let successCount = 0;
    let failCount = 0;
    
    for (const price of qyPrices) {
      const { valveName, size, manualPrice, pneumaticPrice, gearPrice } = price;
      
      // 先查询型号ID
      const [models] = await connection.execute(
        'SELECT id FROM valve_models WHERE name = ?',
        [valveName]
      );
      
      if (models.length === 0) {
        console.log(`✗ 未找到型号: ${valveName}`);
        failCount++;
        continue;
      }
      
      const modelId = models[0].id;
      
      let updateFields = [];
      let values = [];
      
      if (manualPrice) {
        updateFields.push('manual_price = ?');
        values.push(manualPrice);
      }
      if (pneumaticPrice) {
        updateFields.push('pneumatic_price = ?');
        values.push(pneumaticPrice);
      }
      if (gearPrice) {
        updateFields.push('gear_price = ?');
        values.push(gearPrice);
      }
      
      if (updateFields.length === 0) {
        failCount++;
        continue;
      }
      
      values.push(modelId);
      values.push(size);
      
      const sql = `UPDATE price_table SET ${updateFields.join(', ')} WHERE model_id = ? AND size = ?`;
      
      const [result] = await connection.execute(sql, values);
      
      if (result.affectedRows > 0) {
        console.log(`✓ 更新成功: ${valveName} DN${size}`);
        successCount++;
      } else {
        console.log(`✗ 未找到价格记录: ${valveName} DN${size}`);
        failCount++;
      }
    }
    
    console.log(`\n更新完成!`);
    console.log(`  ✓ 成功: ${successCount} 条`);
    console.log(`  ✗ 失败: ${failCount} 条`);
    
  } catch (error) {
    console.error('更新失败:', error);
  } finally {
    await connection.end();
  }
}

updatePrices();