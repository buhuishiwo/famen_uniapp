const mysql = require('mysql2/promise');

const config = {
  host: 'localhost',
  user: 'root',
  password: 'CXH&cw9999',
  database: 'quotation_system'
};

const qjPrices = [
  // QJZ73X-10G (手动)
  { valveName: 'QJZ73X-10G', size: 50, manualPrice: 355 },
  { valveName: 'QJZ73X-10G', size: 65, manualPrice: 380 },
  { valveName: 'QJZ73X-10G', size: 80, manualPrice: 435 },
  { valveName: 'QJZ73X-10G', size: 90, manualPrice: 485 },
  { valveName: 'QJZ73X-10G', size: 100, manualPrice: 600 },
  { valveName: 'QJZ73X-10G', size: 125, manualPrice: 750 },
  { valveName: 'QJZ73X-10G', size: 150, manualPrice: 1035 },
  { valveName: 'QJZ73X-10G', size: 175, manualPrice: 1450 },
  { valveName: 'QJZ73X-10G', size: 200, manualPrice: 1830 },
  { valveName: 'QJZ73X-10G', size: 225, manualPrice: 2345 },
  { valveName: 'QJZ73X-10G', size: 250, manualPrice: 3770 },
  
  // QJZ673X-10Q (气动)
  { valveName: 'QJZ673X-10Q', size: 50, pneumaticPrice: 490 },
  { valveName: 'QJZ673X-10Q', size: 65, pneumaticPrice: 525 },
  { valveName: 'QJZ673X-10Q', size: 80, pneumaticPrice: 710 },
  { valveName: 'QJZ673X-10Q', size: 90, pneumaticPrice: 785 },
  { valveName: 'QJZ673X-10Q', size: 100, pneumaticPrice: 860 },
  { valveName: 'QJZ673X-10Q', size: 125, pneumaticPrice: 1250 },
  { valveName: 'QJZ673X-10Q', size: 150, pneumaticPrice: 1550 },
  { valveName: 'QJZ673X-10Q', size: 175, pneumaticPrice: 2450 },
  { valveName: 'QJZ673X-10Q', size: 200, pneumaticPrice: 2920 },
  { valveName: 'QJZ673X-10Q', size: 225, pneumaticPrice: 3435 },
  { valveName: 'QJZ673X-10Q', size: 250, pneumaticPrice: 7415 },
  
  // QJZ573X-10Q (伞齿轮)
  { valveName: 'QJZ573X-10Q', size: 50, gearPrice: 880 },
  { valveName: 'QJZ573X-10Q', size: 65, gearPrice: 905 },
  { valveName: 'QJZ573X-10Q', size: 80, gearPrice: 950 },
  { valveName: 'QJZ573X-10Q', size: 90, gearPrice: 1010 },
  { valveName: 'QJZ573X-10Q', size: 100, gearPrice: 1010 },
  { valveName: 'QJZ573X-10Q', size: 125, gearPrice: 1110 },
  { valveName: 'QJZ573X-10Q', size: 150, gearPrice: 1280 },
  { valveName: 'QJZ573X-10Q', size: 200, gearPrice: 1590 },
  { valveName: 'QJZ573X-10Q', size: 250, gearPrice: 1995 },
  { valveName: 'QJZ573X-10Q', size: 300, gearPrice: 2325 },
  { valveName: 'QJZ573X-10Q', size: 350, gearPrice: 2960 },
  { valveName: 'QJZ573X-10Q', size: 400, gearPrice: 4465 },
  
  // QJZ973X-10Q (电动)
  { valveName: 'QJZ973X-10Q', size: 50, electricPrice: 430 },
  { valveName: 'QJZ973X-10Q', size: 65, electricPrice: 460 },
  { valveName: 'QJZ973X-10Q', size: 80, electricPrice: 505 },
  { valveName: 'QJZ973X-10Q', size: 100, electricPrice: 570 },
  { valveName: 'QJZ973X-10Q', size: 125, electricPrice: 670 },
  { valveName: 'QJZ973X-10Q', size: 150, electricPrice: 840 },
  { valveName: 'QJZ973X-10Q', size: 200, electricPrice: 1125 },
  { valveName: 'QJZ973X-10Q', size: 250, electricPrice: 1630 },
  { valveName: 'QJZ973X-10Q', size: 300, electricPrice: 2035 },
  { valveName: 'QJZ973X-10Q', size: 350, electricPrice: 2625 },
  { valveName: 'QJZ973X-10Q', size: 400, electricPrice: 3865 }
];

async function updatePrices() {
  const connection = await mysql.createConnection(config);
  
  try {
    console.log('开始更新QJ系列价格数据...\n');
    
    let updateCount = 0;
    let insertCount = 0;
    let failCount = 0;
    
    for (const price of qjPrices) {
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