const mysql = require('mysql2/promise');

const config = {
  host: 'localhost',
  user: 'root',
  password: 'CXH&cw9999',
  database: 'quotation_system'
};

const qmgPrices = [
  // QMGZ73X-10Q (手动)
  { valveName: 'QMGZ73X-10Q', size: 50, manualPrice: 325 },
  { valveName: 'QMGZ73X-10Q', size: 65, manualPrice: 395 },
  { valveName: 'QMGZ73X-10Q', size: 80, manualPrice: 420 },
  { valveName: 'QMGZ73X-10Q', size: 100, manualPrice: 480 },
  { valveName: 'QMGZ73X-10Q', size: 125, manualPrice: 560 },
  { valveName: 'QMGZ73X-10Q', size: 150, manualPrice: 810 },
  { valveName: 'QMGZ73X-10Q', size: 200, manualPrice: 1005 },
  { valveName: 'QMGZ73X-10Q', size: 250, manualPrice: 1350 },
  { valveName: 'QMGZ73X-10Q', size: 300, manualPrice: 1900 },
  { valveName: 'QMGZ73X-10Q', size: 350, manualPrice: 2580 },
  { valveName: 'QMGZ73X-10Q', size: 400, manualPrice: 2860 },
  
  // QMGZ73X-10RQ (耐磨Q)
  { valveName: 'QMGZ73X-10RQ', size: 50, manualPrice: 530 },
  { valveName: 'QMGZ73X-10RQ', size: 65, manualPrice: 665 },
  { valveName: 'QMGZ73X-10RQ', size: 80, manualPrice: 700 },
  { valveName: 'QMGZ73X-10RQ', size: 100, manualPrice: 770 },
  { valveName: 'QMGZ73X-10RQ', size: 125, manualPrice: 1015 },
  { valveName: 'QMGZ73X-10RQ', size: 150, manualPrice: 1415 },
  { valveName: 'QMGZ73X-10RQ', size: 200, manualPrice: 1950 },
  { valveName: 'QMGZ73X-10RQ', size: 250, manualPrice: 2675 },
  { valveName: 'QMGZ73X-10RQ', size: 300, manualPrice: 3850 },
  { valveName: 'QMGZ73X-10RQ', size: 350, manualPrice: 5090 },
  { valveName: 'QMGZ73X-10RQ', size: 400, manualPrice: 6175 },
  
  // QMGZ73X-10P (不锈钢)
  { valveName: 'QMGZ73X-10P', size: 50, manualPrice: 580 },
  { valveName: 'QMGZ73X-10P', size: 65, manualPrice: 725 },
  { valveName: 'QMGZ73X-10P', size: 80, manualPrice: 775 },
  { valveName: 'QMGZ73X-10P', size: 100, manualPrice: 860 },
  { valveName: 'QMGZ73X-10P', size: 125, manualPrice: 1150 },
  { valveName: 'QMGZ73X-10P', size: 150, manualPrice: 1630 },
  { valveName: 'QMGZ73X-10P', size: 200, manualPrice: 2270 },
  { valveName: 'QMGZ73X-10P', size: 250, manualPrice: 3165 },
  { valveName: 'QMGZ73X-10P', size: 300, manualPrice: 4545 },
  { valveName: 'QMGZ73X-10P', size: 350, manualPrice: 6585 },
  { valveName: 'QMGZ73X-10P', size: 400, manualPrice: 7580 },
  
  // QMGZ73X-10R (耐磨)
  { valveName: 'QMGZ73X-10R', size: 50, manualPrice: 585 },
  { valveName: 'QMGZ73X-10R', size: 65, manualPrice: 745 },
  { valveName: 'QMGZ73X-10R', size: 80, manualPrice: 775 },
  { valveName: 'QMGZ73X-10R', size: 100, manualPrice: 885 },
  { valveName: 'QMGZ73X-10R', size: 125, manualPrice: 1190 },
  { valveName: 'QMGZ73X-10R', size: 150, manualPrice: 1685 },
  { valveName: 'QMGZ73X-10R', size: 200, manualPrice: 2350 },
  { valveName: 'QMGZ73X-10R', size: 250, manualPrice: 3400 },
  { valveName: 'QMGZ73X-10R', size: 300, manualPrice: 4660 },
  { valveName: 'QMGZ73X-10R', size: 350, manualPrice: 6825 },
  { valveName: 'QMGZ73X-10R', size: 400, manualPrice: 8000 },
  
  // QMGZ73X-10RL (耐磨+不锈钢)
  { valveName: 'QMGZ73X-10RL', size: 50, manualPrice: 595 },
  { valveName: 'QMGZ73X-10RL', size: 65, manualPrice: 745 },
  { valveName: 'QMGZ73X-10RL', size: 80, manualPrice: 800 },
  { valveName: 'QMGZ73X-10RL', size: 100, manualPrice: 885 },
  { valveName: 'QMGZ73X-10RL', size: 125, manualPrice: 1190 },
  { valveName: 'QMGZ73X-10RL', size: 150, manualPrice: 1685 },
  { valveName: 'QMGZ73X-10RL', size: 200, manualPrice: 2350 },
  { valveName: 'QMGZ73X-10RL', size: 250, manualPrice: 3400 },
  { valveName: 'QMGZ73X-10RL', size: 300, manualPrice: 4660 },
  { valveName: 'QMGZ73X-10RL', size: 350, manualPrice: 6825 },
  { valveName: 'QMGZ73X-10RL', size: 400, manualPrice: 8000 }
];

async function updatePrices() {
  const connection = await mysql.createConnection(config);
  
  try {
    console.log('开始更新QMG系列价格数据...\n');
    
    let updateCount = 0;
    let insertCount = 0;
    let failCount = 0;
    
    for (const price of qmgPrices) {
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