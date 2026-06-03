const mysql = require('mysql2/promise');

const config = {
  host: 'localhost',
  user: 'root',
  password: 'CXH&cw9999',
  database: 'quotation_system'
};

const qhPrices = [
  // QHQ673X-10C (手动)
  { valveName: 'QHQ673X-10C (手动)', size: 100, manualPrice: 1600 },
  { valveName: 'QHQ673X-10C (手动)', size: 125, manualPrice: 1700 },
  { valveName: 'QHQ673X-10C (手动)', size: 150, manualPrice: 1850 },
  { valveName: 'QHQ673X-10C (手动)', size: 200, manualPrice: 2180 },
  { valveName: 'QHQ673X-10C (手动)', size: 250, manualPrice: 2430 },
  { valveName: 'QHQ673X-10C (手动)', size: 300, manualPrice: 2660 },
  { valveName: 'QHQ673X-10C (手动)', size: 350, manualPrice: 3120 },
  { valveName: 'QHQ673X-10C (手动)', size: 400, manualPrice: 3350 },
  { valveName: 'QHQ673X-10C (手动)', size: 450, manualPrice: 3560 },
  { valveName: 'QHQ673X-10C (手动)', size: 500, manualPrice: 6430 },
  { valveName: 'QHQ673X-10C (手动)', size: 600, manualPrice: 7150 },
  { valveName: 'QHQ673X-10C (手动)', size: 700, manualPrice: 13200 },
  { valveName: 'QHQ673X-10C (手动)', size: 800, manualPrice: 13900 },
  { valveName: 'QHQ673X-10C (手动)', size: 900, manualPrice: 15000 },
  { valveName: 'QHQ673X-10C (手动)', size: 1000, manualPrice: 15000 },
  
  // QHQ673X-10C (气动)
  { valveName: 'QHQ673X-10C (气动)', size: 100, pneumaticPrice: 2130 },
  { valveName: 'QHQ673X-10C (气动)', size: 125, pneumaticPrice: 2290 },
  { valveName: 'QHQ673X-10C (气动)', size: 150, pneumaticPrice: 2510 },
  { valveName: 'QHQ673X-10C (气动)', size: 200, pneumaticPrice: 3010 },
  { valveName: 'QHQ673X-10C (气动)', size: 250, pneumaticPrice: 3470 },
  { valveName: 'QHQ673X-10C (气动)', size: 300, pneumaticPrice: 3720 },
  { valveName: 'QHQ673X-10C (气动)', size: 350, pneumaticPrice: 4960 },
  { valveName: 'QHQ673X-10C (气动)', size: 400, pneumaticPrice: 5320 },
  { valveName: 'QHQ673X-10C (气动)', size: 450, pneumaticPrice: 5600 },
  { valveName: 'QHQ673X-10C (气动)', size: 500, pneumaticPrice: 8520 },
  { valveName: 'QHQ673X-10C (气动)', size: 600, pneumaticPrice: 13820 },
  { valveName: 'QHQ673X-10C (气动)', size: 700, pneumaticPrice: 22560 },
  { valveName: 'QHQ673X-10C (气动)', size: 800, pneumaticPrice: 23880 },
  { valveName: 'QHQ673X-10C (气动)', size: 900, pneumaticPrice: 24790 },
  { valveName: 'QHQ673X-10C (气动)', size: 1000, pneumaticPrice: 17900 },
  
  // QHQ573X-10C (伞齿轮)
  { valveName: 'QHQ573X-10C (伞齿轮)', size: 100, gearPrice: 2565 },
  { valveName: 'QHQ573X-10C (伞齿轮)', size: 125, gearPrice: 2825 },
  { valveName: 'QHQ573X-10C (伞齿轮)', size: 150, gearPrice: 3140 },
  { valveName: 'QHQ573X-10C (伞齿轮)', size: 200, gearPrice: 3840 },
  { valveName: 'QHQ573X-10C (伞齿轮)', size: 250, gearPrice: 4530 },
  { valveName: 'QHQ573X-10C (伞齿轮)', size: 300, gearPrice: 4890 },
  { valveName: 'QHQ573X-10C (伞齿轮)', size: 350, gearPrice: 6890 },
  { valveName: 'QHQ573X-10C (伞齿轮)', size: 400, gearPrice: 7410 },
  { valveName: 'QHQ573X-10C (伞齿轮)', size: 450, gearPrice: 7910 },
  { valveName: 'QHQ573X-10C (伞齿轮)', size: 500, gearPrice: 11025 },
  { valveName: 'QHQ573X-10C (伞齿轮)', size: 600, gearPrice: 15170 },
  { valveName: 'QHQ573X-10C (伞齿轮)', size: 700, gearPrice: 33130 },
  { valveName: 'QHQ573X-10C (伞齿轮)', size: 800, gearPrice: 35180 },
  { valveName: 'QHQ573X-10C (伞齿轮)', size: 900, gearPrice: 36500 },
  { valveName: 'QHQ573X-10C (伞齿轮)', size: 1000, gearPrice: 26650 }
];

async function updatePrices() {
  const connection = await mysql.createConnection(config);
  
  try {
    console.log('开始更新QH系列价格数据...\n');
    
    let successCount = 0;
    let failCount = 0;
    
    for (const price of qhPrices) {
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