const mysql = require('mysql2/promise');

const config = {
  host: 'localhost',
  user: 'root',
  password: 'CXH&cw9999',
  database: 'quotation_system'
};

const qcaPrices = [
  // QCAZ74X-10C (手动)
  { valveName: 'QCAZ74X-10C', size: 100, manualPrice: 900 },
  { valveName: 'QCAZ74X-10C', size: 125, manualPrice: 1200 },
  { valveName: 'QCAZ74X-10C', size: 150, manualPrice: 1560 },
  { valveName: 'QCAZ74X-10C', size: 200, manualPrice: 2400 },
  { valveName: 'QCAZ74X-10C', size: 250, manualPrice: 3600 },
  { valveName: 'QCAZ74X-10C', size: 300, manualPrice: 4400 },
  { valveName: 'QCAZ74X-10C', size: 350, manualPrice: 5760 },
  { valveName: 'QCAZ74X-10C', size: 400, manualPrice: 7500 },
  
  // QCAZ74X-10P (不锈钢)
  { valveName: 'QCAZ74X-10P', size: 100, manualPrice: 1680 },
  { valveName: 'QCAZ74X-10P', size: 125, manualPrice: 1860 },
  { valveName: 'QCAZ74X-10P', size: 150, manualPrice: 2600 },
  { valveName: 'QCAZ74X-10P', size: 200, manualPrice: 4200 },
  { valveName: 'QCAZ74X-10P', size: 250, manualPrice: 6600 },
  { valveName: 'QCAZ74X-10P', size: 300, manualPrice: 8800 },
  { valveName: 'QCAZ74X-10P', size: 350, manualPrice: 11300 },
  { valveName: 'QCAZ74X-10P', size: 400, manualPrice: 15300 },
  
  // QCAZ74X-10RL (耐磨)
  { valveName: 'QCAZ74X-10RL', size: 100, manualPrice: 2050 },
  { valveName: 'QCAZ74X-10RL', size: 125, manualPrice: 2400 },
  { valveName: 'QCAZ74X-10RL', size: 150, manualPrice: 3240 },
  { valveName: 'QCAZ74X-10RL', size: 200, manualPrice: 5350 },
  { valveName: 'QCAZ74X-10RL', size: 250, manualPrice: 9050 },
  { valveName: 'QCAZ74X-10RL', size: 300, manualPrice: 11500 },
  { valveName: 'QCAZ74X-10RL', size: 350, manualPrice: 16200 },
  { valveName: 'QCAZ74X-10RL', size: 400, manualPrice: 21300 }
];

async function updatePrices() {
  const connection = await mysql.createConnection(config);
  
  try {
    console.log('开始更新QCA系列价格数据...\n');
    
    let successCount = 0;
    let failCount = 0;
    
    for (const price of qcaPrices) {
      const { valveName, size, manualPrice, pneumaticPrice, gearPrice } = price;
      
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