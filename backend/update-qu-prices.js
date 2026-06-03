const mysql = require('mysql2/promise');

const config = {
  host: 'localhost',
  user: 'root',
  password: 'CXH&cw9999',
  database: 'quotation_system'
};

// QU系列价格数据 - 手动型号 QUZ73X (Rising Stem)
const quManualRisingPrices = [
  { valveName: 'QUZ73X-10G', size: 50, manualPrice: 250 },
  { valveName: 'QUZ73X-10G', size: 65, manualPrice: 260 },
  { valveName: 'QUZ73X-10G', size: 80, manualPrice: 280 },
  { valveName: 'QUZ73X-10G', size: 100, manualPrice: 345 },
  { valveName: 'QUZ73X-10G', size: 125, manualPrice: 385 },
  { valveName: 'QUZ73X-10G', size: 150, manualPrice: 475 },
  { valveName: 'QUZ73X-10G', size: 200, manualPrice: 625 },
  { valveName: 'QUZ73X-10G', size: 250, manualPrice: 940 },
  { valveName: 'QUZ73X-10G', size: 300, manualPrice: 1200 },
  { valveName: 'QUZ73X-10G', size: 350, manualPrice: 1515 },
  { valveName: 'QUZ73X-10G', size: 400, manualPrice: 2020 },
  { valveName: 'QUZ73X-10G', size: 450, manualPrice: 2300 },
  { valveName: 'QUZ73X-10G', size: 500, manualPrice: 2600 },
  { valveName: 'QUZ73X-10G', size: 600, manualPrice: 3200 },
  { valveName: 'QUZ73X-10G', size: 700, manualPrice: 5000 },
  { valveName: 'QUZ73X-10G', size: 800, manualPrice: 6120 },
  { valveName: 'QUZ73X-10G', size: 900, manualPrice: 10000 },
  { valveName: 'QUZ73X-10G', size: 1000, manualPrice: 12000 }
];

// QU系列价格数据 - 手动型号 QUZ73X-NR (Non-Rising Stem)
const quManualNonRisingPrices = [
  { valveName: 'QUZ73X-10G-NR', size: 50, manualPrice: 190 },
  { valveName: 'QUZ73X-10G-NR', size: 65, manualPrice: 210 },
  { valveName: 'QUZ73X-10G-NR', size: 80, manualPrice: 240 },
  { valveName: 'QUZ73X-10G-NR', size: 100, manualPrice: 295 },
  { valveName: 'QUZ73X-10G-NR', size: 125, manualPrice: 345 },
  { valveName: 'QUZ73X-10G-NR', size: 150, manualPrice: 455 },
  { valveName: 'QUZ73X-10G-NR', size: 200, manualPrice: 595 },
  { valveName: 'QUZ73X-10G-NR', size: 250, manualPrice: 890 },
  { valveName: 'QUZ73X-10G-NR', size: 300, manualPrice: 1195 },
  { valveName: 'QUZ73X-10G-NR', size: 350, manualPrice: 1510 },
  { valveName: 'QUZ73X-10G-NR', size: 400, manualPrice: 2020 }
];

// QU系列价格数据 - 气动型号 QUZ673X
const quPneumaticPrices = [
  { valveName: 'QUZ673X-10G', size: 50, pneumaticPrice: 320 },
  { valveName: 'QUZ673X-10G', size: 65, pneumaticPrice: 340 },
  { valveName: 'QUZ673X-10G', size: 80, pneumaticPrice: 360 },
  { valveName: 'QUZ673X-10G', size: 100, pneumaticPrice: 425 },
  { valveName: 'QUZ673X-10G', size: 125, pneumaticPrice: 465 },
  { valveName: 'QUZ673X-10G', size: 150, pneumaticPrice: 655 },
  { valveName: 'QUZ673X-10G', size: 200, pneumaticPrice: 1015 },
  { valveName: 'QUZ673X-10G', size: 250, pneumaticPrice: 1340 },
  { valveName: 'QUZ673X-10G', size: 300, pneumaticPrice: 1895 },
  { valveName: 'QUZ673X-10G', size: 350, pneumaticPrice: 2210 },
  { valveName: 'QUZ673X-10G', size: 400, pneumaticPrice: 3420 },
  { valveName: 'QUZ673X-10G', size: 450, pneumaticPrice: 3800 },
  { valveName: 'QUZ673X-10G', size: 500, pneumaticPrice: 7050 },
  { valveName: 'QUZ673X-10G', size: 600, pneumaticPrice: 8700 }
];

// QU系列价格数据 - 伞齿轮型号 QUZ573X
const quGearPrices = [
  { valveName: 'QUZ573X-10G', size: 50, gearPrice: 700 },
  { valveName: 'QUZ573X-10G', size: 65, gearPrice: 720 },
  { valveName: 'QUZ573X-10G', size: 80, gearPrice: 740 },
  { valveName: 'QUZ573X-10G', size: 100, gearPrice: 790 },
  { valveName: 'QUZ573X-10G', size: 125, gearPrice: 830 },
  { valveName: 'QUZ573X-10G', size: 150, gearPrice: 980 },
  { valveName: 'QUZ573X-10G', size: 200, gearPrice: 1120 },
  { valveName: 'QUZ573X-10G', size: 250, gearPrice: 1410 },
  { valveName: 'QUZ573X-10G', size: 300, gearPrice: 1750 },
  { valveName: 'QUZ573X-10G', size: 350, gearPrice: 2150 },
  { valveName: 'QUZ573X-10G', size: 400, gearPrice: 2600 },
  { valveName: 'QUZ573X-10G', size: 450, gearPrice: 3120 },
  { valveName: 'QUZ573X-10G', size: 500, gearPrice: 4450 },
  { valveName: 'QUZ573X-10G', size: 600, gearPrice: 6400 },
  { valveName: 'QUZ573X-10G', size: 700, gearPrice: 8500 },
  { valveName: 'QUZ573X-10G', size: 800, gearPrice: 11400 },
  { valveName: 'QUZ573X-10G', size: 900, gearPrice: 14800 },
  { valveName: 'QUZ573X-10G', size: 1000, gearPrice: 19500 },
  { valveName: 'QUZ573X-10G', size: 1200, gearPrice: 68000 },
  { valveName: 'QUZ573X-10G', size: 1400, gearPrice: 140000 }
];

// QU系列价格数据 - 电动型号 QUZ973X (Non-electrically actuated)
const quElectricNonActuatedPrices = [
  { valveName: 'QUZ973X-10G-NE', size: 50, electricPrice: 300 },
  { valveName: 'QUZ973X-10G-NE', size: 65, electricPrice: 310 },
  { valveName: 'QUZ973X-10G-NE', size: 80, electricPrice: 330 },
  { valveName: 'QUZ973X-10G-NE', size: 100, electricPrice: 395 },
  { valveName: 'QUZ973X-10G-NE', size: 125, electricPrice: 465 },
  { valveName: 'QUZ973X-10G-NE', size: 150, electricPrice: 755 },
  { valveName: 'QUZ973X-10G-NE', size: 200, electricPrice: 1040 },
  { valveName: 'QUZ973X-10G-NE', size: 250, electricPrice: 1320 },
  { valveName: 'QUZ973X-10G-NE', size: 300, electricPrice: 1665 },
  { valveName: 'QUZ973X-10G-NE', size: 350, electricPrice: 2180 },
  { valveName: 'QUZ973X-10G-NE', size: 400, electricPrice: 2450 },
  { valveName: 'QUZ973X-10G-NE', size: 450, electricPrice: 3210 },
  { valveName: 'QUZ973X-10G-NE', size: 500, electricPrice: 4570 },
  { valveName: 'QUZ973X-10G-NE', size: 600, electricPrice: 6790 },
  { valveName: 'QUZ973X-10G-NE', size: 700, electricPrice: 8230 },
  { valveName: 'QUZ973X-10G-NE', size: 800, electricPrice: 11200 },
  { valveName: 'QUZ973X-10G-NE', size: 900, electricPrice: 14580 },
  { valveName: 'QUZ973X-10G-NE', size: 1000, electricPrice: 19820 }
];

// QU系列价格数据 - 电动型号 QUZ973X (electrically actuated)
const quElectricActuatedPrices = [
  { valveName: 'QUZ973X-10G-EA', size: 50, electricPrice: 1950 },
  { valveName: 'QUZ973X-10G-EA', size: 65, electricPrice: 1960 },
  { valveName: 'QUZ973X-10G-EA', size: 80, electricPrice: 1980 },
  { valveName: 'QUZ973X-10G-EA', size: 100, electricPrice: 2045 },
  { valveName: 'QUZ973X-10G-EA', size: 125, electricPrice: 2120 },
  { valveName: 'QUZ973X-10G-EA', size: 150, electricPrice: 2210 },
  { valveName: 'QUZ973X-10G-EA', size: 200, electricPrice: 2380 },
  { valveName: 'QUZ973X-10G-EA', size: 250, electricPrice: 2700 },
  { valveName: 'QUZ973X-10G-EA', size: 300, electricPrice: 3090 },
  { valveName: 'QUZ973X-10G-EA', size: 350, electricPrice: 3450 },
  { valveName: 'QUZ973X-10G-EA', size: 400, electricPrice: 3980 },
  { valveName: 'QUZ973X-10G-EA', size: 450, electricPrice: 5660 },
  { valveName: 'QUZ973X-10G-EA', size: 500, electricPrice: 6990 },
  { valveName: 'QUZ973X-10G-EA', size: 600, electricPrice: 8975 },
  { valveName: 'QUZ973X-10G-EA', size: 700, electricPrice: 10980 },
  { valveName: 'QUZ973X-10G-EA', size: 800, electricPrice: 13750 },
  { valveName: 'QUZ973X-10G-EA', size: 900, electricPrice: 17150 },
  { valveName: 'QUZ973X-10G-EA', size: 1000, electricPrice: 23100 }
];

const allPrices = [
  ...quManualRisingPrices,
  ...quManualNonRisingPrices,
  ...quPneumaticPrices,
  ...quGearPrices,
  ...quElectricNonActuatedPrices,
  ...quElectricActuatedPrices
];

// 需要添加的型号列表
const quModels = [
  { name: 'QUZ73X-10G', type_code: '手动' },
  { name: 'QUZ73X-10G-NR', type_code: '手动' },
  { name: 'QUZ673X-10G', type_code: '气动' },
  { name: 'QUZ573X-10G', type_code: '伞齿轮' },
  { name: 'QUZ973X-10G-NE', type_code: '电动' },
  { name: 'QUZ973X-10G-EA', type_code: '电动' }
];

async function updatePrices() {
  const connection = await mysql.createConnection(config);
  
  try {
    console.log('开始更新QU系列价格数据...\n');
    
    // 1. 检查并添加QU系列
    let [seriesRows] = await connection.execute(
      'SELECT id FROM product_series WHERE name = ?',
      ['QU']
    );
    
    let seriesId;
    if (seriesRows.length === 0) {
      const [result] = await connection.execute(
        'INSERT INTO product_series (name) VALUES (?)',
        ['QU']
      );
      seriesId = result.insertId;
      console.log(`+ 新增系列: QU (ID: ${seriesId})`);
    } else {
      seriesId = seriesRows[0].id;
      console.log(`✓ 系列已存在: QU (ID: ${seriesId})`);
    }
    
    // 2. 添加型号
    const modelIdMap = {};
    for (const model of quModels) {
      const [rows] = await connection.execute(
        'SELECT id FROM valve_models WHERE name = ?',
        [model.name]
      );
      
      if (rows.length === 0) {
        const [result] = await connection.execute(
          'INSERT INTO valve_models (series_id, name, type_code) VALUES (?, ?, ?)',
          [seriesId, model.name, model.type_code]
        );
        modelIdMap[model.name] = result.insertId;
        console.log(`+ 新增型号: ${model.name}`);
      } else {
        modelIdMap[model.name] = rows[0].id;
        console.log(`✓ 型号已存在: ${model.name}`);
      }
    }
    
    console.log('\n--- 更新价格数据 ---\n');
    
    let updateCount = 0;
    let insertCount = 0;
    let failCount = 0;
    
    for (const price of allPrices) {
      const { valveName, size, manualPrice, pneumaticPrice, electricPrice, gearPrice } = price;
      
      const modelId = modelIdMap[valveName];
      if (!modelId) {
        console.log(`✗ 未找到型号ID: ${valveName}`);
        failCount++;
        continue;
      }
      
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
          console.log(`✓ 更新成功: ${valveName} DN${size}`);
          updateCount++;
        } else {
          console.log(`✗ 更新失败: ${valveName} DN${size}`);
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
          console.log(`+ 新增成功: ${valveName} DN${size}`);
          insertCount++;
        } else {
          console.log(`✗ 新增失败: ${valveName} DN${size}`);
          failCount++;
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