const mysql = require('mysql2/promise');

const config = {
  host: 'localhost',
  user: 'root',
  password: 'CXH&cw9999',
  database: 'quotation_system'
};

const qmcPrices = [
  // QMCZ73X-10C (手动)
  { valveName: 'QMCZ73X-10C', size: 50, manualPrice: 480 },
  { valveName: 'QMCZ73X-10C', size: 65, manualPrice: 570 },
  { valveName: 'QMCZ73X-10C', size: 80, manualPrice: 570 },
  { valveName: 'QMCZ73X-10C', size: 100, manualPrice: 680 },
  { valveName: 'QMCZ73X-10C', size: 125, manualPrice: 885 },
  { valveName: 'QMCZ73X-10C', size: 150, manualPrice: 1270 },
  { valveName: 'QMCZ73X-10C', size: 200, manualPrice: 2100 },
  { valveName: 'QMCZ73X-10C', size: 250, manualPrice: 2100 },
  { valveName: 'QMCZ73X-10C', size: 300, manualPrice: 3200 },
  { valveName: 'QMCZ73X-10C', size: 350, manualPrice: 4095 },
  { valveName: 'QMCZ73X-10C', size: 400, manualPrice: 4095 },
  
  // QMCZ73X-10P (不锈钢)
  { valveName: 'QMCZ73X-10P', size: 50, manualPrice: 865 },
  { valveName: 'QMCZ73X-10P', size: 65, manualPrice: 1110 },
  { valveName: 'QMCZ73X-10P', size: 80, manualPrice: 1110 },
  { valveName: 'QMCZ73X-10P', size: 100, manualPrice: 1440 },
  { valveName: 'QMCZ73X-10P', size: 125, manualPrice: 1890 },
  { valveName: 'QMCZ73X-10P', size: 150, manualPrice: 2720 },
  { valveName: 'QMCZ73X-10P', size: 200, manualPrice: 4450 },
  { valveName: 'QMCZ73X-10P', size: 250, manualPrice: 4450 },
  { valveName: 'QMCZ73X-10P', size: 300, manualPrice: 5565 },
  { valveName: 'QMCZ73X-10P', size: 350, manualPrice: 7575 },
  { valveName: 'QMCZ73X-10P', size: 400, manualPrice: 7575 },
  
  // QMCZ73X-10R (耐磨)
  { valveName: 'QMCZ73X-10R', size: 50, manualPrice: 735 },
  { valveName: 'QMCZ73X-10R', size: 65, manualPrice: 1050 },
  { valveName: 'QMCZ73X-10R', size: 80, manualPrice: 1050 },
  { valveName: 'QMCZ73X-10R', size: 100, manualPrice: 1430 },
  { valveName: 'QMCZ73X-10R', size: 125, manualPrice: 1920 },
  { valveName: 'QMCZ73X-10R', size: 150, manualPrice: 2900 },
  { valveName: 'QMCZ73X-10R', size: 200, manualPrice: 4300 },
  { valveName: 'QMCZ73X-10R', size: 250, manualPrice: 4350 },
  { valveName: 'QMCZ73X-10R', size: 300, manualPrice: 5880 },
  { valveName: 'QMCZ73X-10R', size: 350, manualPrice: 7655 },
  { valveName: 'QMCZ73X-10R', size: 400, manualPrice: 7655 },
  
  // QMCZ73X-10RL (耐磨+不锈钢)
  { valveName: 'QMCZ73X-10RL', size: 50, manualPrice: 755 },
  { valveName: 'QMCZ73X-10RL', size: 65, manualPrice: 1075 },
  { valveName: 'QMCZ73X-10RL', size: 80, manualPrice: 1075 },
  { valveName: 'QMCZ73X-10RL', size: 100, manualPrice: 1430 },
  { valveName: 'QMCZ73X-10RL', size: 125, manualPrice: 1920 },
  { valveName: 'QMCZ73X-10RL', size: 150, manualPrice: 2300 },
  { valveName: 'QMCZ73X-10RL', size: 200, manualPrice: 4300 },
  { valveName: 'QMCZ73X-10RL', size: 250, manualPrice: 4510 },
  { valveName: 'QMCZ73X-10RL', size: 300, manualPrice: 5950 },
  { valveName: 'QMCZ73X-10RL', size: 350, manualPrice: 7655 },
  { valveName: 'QMCZ73X-10RL', size: 400, manualPrice: 7655 }
];

async function updatePrices() {
  const connection = await mysql.createConnection(config);
  
  try {
    console.log('开始更新QMC系列价格数据...\n');
    
    let updateCount = 0;
    let insertCount = 0;
    let failCount = 0;
    
    for (const price of qmcPrices) {
      const { valveName, size, manualPrice, pneumaticPrice, electricPrice, gearPrice } = price;
      
      const [models] = await connection.execute(
        'SELECT id, name FROM valve_models WHERE name LIKE ?',
        [`%${valveName}%`]
      );
      
      if (models.length === 0) {
        console.log(`✗ 未找到型号: ${valveName}`);
        failCount++;
        continue;
      }
      
      for (const model of models) {
        const modelId = model.id;
        
        // 先检查是否存在该型号和尺寸的记录
        const [existing] = await connection.execute(
          'SELECT id FROM price_table WHERE model_id = ? AND size = ?',
          [modelId, size]
        );
        
        if (existing.length > 0) {
          // 更新现有记录
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
          if (electricPrice) {
            updateFields.push('electric_price = ?');
            values.push(electricPrice);
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
            console.log(`✓ 更新成功: ${model.name} DN${size}`);
            updateCount++;
          } else {
            console.log(`✗ 更新失败: ${model.name} DN${size}`);
            failCount++;
          }
        } else {
          // 新增记录
          const sql = `INSERT INTO price_table (model_id, size, manual_price, pneumatic_price, electric_price, gear_price, status) 
                      VALUES (?, ?, ?, ?, ?, ?, 'enabled')`;
          
          const [result] = await connection.execute(sql, [
            modelId,
            size,
            manualPrice || 0,
            pneumaticPrice || 0,
            electricPrice || 0,
            gearPrice || 0
          ]);
          
          if (result.affectedRows > 0) {
            console.log(`+ 新增成功: ${model.name} DN${size}`);
            insertCount++;
          } else {
            console.log(`✗ 新增失败: ${model.name} DN${size}`);
            failCount++;
          }
        }
      }
    }
    
    console.log(`\n更新完成!`);
    console.log(`  ✓ 更新: ${updateCount} 条`);
    console.log(`  + 新增: ${insertCount} 条`);
    console.log(`  ✗ 失败: ${failCount} 条`);
    
  } catch (error) {
    console.error('更新失败:', error);
  } finally {
    await connection.end();
  }
}

updatePrices();