const mysql = require('mysql2/promise');

const config = {
  host: 'localhost',
  user: 'root',
  password: 'CXH&cw9999',
  database: 'quotation_system'
};

// QWL系列价格数据 - QWLZ43NM (手动)
const qwlManualPrices = [
  { valveName: 'QWLZ43NM-10C', size: 100, manualPrice: 1380 },
  { valveName: 'QWLZ43NM-10C', size: 125, manualPrice: 1530 },
  { valveName: 'QWLZ43NM-10C', size: 150, manualPrice: 1850 },
  { valveName: 'QWLZ43NM-10C', size: 200, manualPrice: 2520 },
  { valveName: 'QWLZ43NM-10C', size: 250, manualPrice: 3200 },
  { valveName: 'QWLZ43NM-10C', size: 300, manualPrice: 7300 },
  { valveName: 'QWLZ43NM-10C', size: 350, manualPrice: 8280 },
  { valveName: 'QWLZ43NM-10C', size: 400, manualPrice: 12750 },
  { valveName: 'QWLZ43NM-10C', size: 450, manualPrice: 13275 },
  { valveName: 'QWLZ43NM-10C', size: 500, manualPrice: 29500 },
  { valveName: 'QWLZ43NM-10C', size: 600, manualPrice: 29800 },
  { valveName: 'QWLZ43NM-10C', size: 700, manualPrice: 33720 },
  { valveName: 'QWLZ43NM-10C', size: 800, manualPrice: 47000 },
  { valveName: 'QWLZ43NM-10C', size: 900, manualPrice: 57600 },
  { valveName: 'QWLZ43NM-10C', size: 1000, manualPrice: 73800 },
  { valveName: 'QWLZ43NM-10C', size: 1200, manualPrice: 117600 },
  { valveName: 'QWLZ43NM-10C', size: 1400, manualPrice: 161000 },
  
  { valveName: 'QWLZ43NM-10P', size: 100, manualPrice: 2180 },
  { valveName: 'QWLZ43NM-10P', size: 125, manualPrice: 2490 },
  { valveName: 'QWLZ43NM-10P', size: 150, manualPrice: 3020 },
  { valveName: 'QWLZ43NM-10P', size: 200, manualPrice: 4230 },
  { valveName: 'QWLZ43NM-10P', size: 250, manualPrice: 5555 },
  { valveName: 'QWLZ43NM-10P', size: 300, manualPrice: 11355 },
  { valveName: 'QWLZ43NM-10P', size: 350, manualPrice: 12670 },
  { valveName: 'QWLZ43NM-10P', size: 400, manualPrice: 18500 },
  { valveName: 'QWLZ43NM-10P', size: 450, manualPrice: 19560 },
  { valveName: 'QWLZ43NM-10P', size: 500, manualPrice: 44225 },
  { valveName: 'QWLZ43NM-10P', size: 600, manualPrice: 44225 },
  { valveName: 'QWLZ43NM-10P', size: 700, manualPrice: 51420 },
  { valveName: 'QWLZ43NM-10P', size: 800, manualPrice: 72500 },
  { valveName: 'QWLZ43NM-10P', size: 900, manualPrice: 90940 },
  { valveName: 'QWLZ43NM-10P', size: 1000, manualPrice: 107360 },
  { valveName: 'QWLZ43NM-10P', size: 1200, manualPrice: 183600 },
  { valveName: 'QWLZ43NM-10P', size: 1400, manualPrice: 245000 },
  
  { valveName: 'QWLZ43NM-10R', size: 100, manualPrice: 2500 },
  { valveName: 'QWLZ43NM-10R', size: 125, manualPrice: 2800 },
  { valveName: 'QWLZ43NM-10R', size: 150, manualPrice: 3510 },
  { valveName: 'QWLZ43NM-10R', size: 200, manualPrice: 4945 },
  { valveName: 'QWLZ43NM-10R', size: 250, manualPrice: 6630 },
  { valveName: 'QWLZ43NM-10R', size: 300, manualPrice: 13555 },
  { valveName: 'QWLZ43NM-10R', size: 350, manualPrice: 15230 },
  { valveName: 'QWLZ43NM-10R', size: 400, manualPrice: 22660 },
  { valveName: 'QWLZ43NM-10R', size: 450, manualPrice: 23430 },
  { valveName: 'QWLZ43NM-10R', size: 500, manualPrice: 52600 },
  { valveName: 'QWLZ43NM-10R', size: 600, manualPrice: 52900 },
  { valveName: 'QWLZ43NM-10R', size: 700, manualPrice: 62480 },
  { valveName: 'QWLZ43NM-10R', size: 800, manualPrice: 81000 },
  { valveName: 'QWLZ43NM-10R', size: 900, manualPrice: 107800 },
  { valveName: 'QWLZ43NM-10R', size: 1000, manualPrice: 119725 },
  { valveName: 'QWLZ43NM-10R', size: 1200, manualPrice: 216000 },
  { valveName: 'QWLZ43NM-10R', size: 1400, manualPrice: 286000 },
  
  { valveName: 'QWLZ43NM-10RL', size: 100, manualPrice: 2630 },
  { valveName: 'QWLZ43NM-10RL', size: 125, manualPrice: 2890 },
  { valveName: 'QWLZ43NM-10RL', size: 150, manualPrice: 3690 },
  { valveName: 'QWLZ43NM-10RL', size: 200, manualPrice: 5195 },
  { valveName: 'QWLZ43NM-10RL', size: 250, manualPrice: 7050 },
  { valveName: 'QWLZ43NM-10RL', size: 300, manualPrice: 14145 },
  { valveName: 'QWLZ43NM-10RL', size: 350, manualPrice: 15880 },
  { valveName: 'QWLZ43NM-10RL', size: 400, manualPrice: 23750 },
  { valveName: 'QWLZ43NM-10RL', size: 450, manualPrice: 24410 },
  { valveName: 'QWLZ43NM-10RL', size: 500, manualPrice: 53770 },
  { valveName: 'QWLZ43NM-10RL', size: 600, manualPrice: 54070 },
  { valveName: 'QWLZ43NM-10RL', size: 700, manualPrice: 65200 },
  { valveName: 'QWLZ43NM-10RL', size: 800, manualPrice: 81600 },
  { valveName: 'QWLZ43NM-10RL', size: 900, manualPrice: 110300 },
  { valveName: 'QWLZ43NM-10RL', size: 1000, manualPrice: 121025 },
  { valveName: 'QWLZ43NM-10RL', size: 1200, manualPrice: 221000 },
  { valveName: 'QWLZ43NM-10RL', size: 1400, manualPrice: 292000 }
];

// QWL系列价格数据 - QWLZ543NM (伞齿轮)
const qwlGearPrices = [
  { valveName: 'QWLZ543NM-10C', size: 100, gearPrice: 1490 },
  { valveName: 'QWLZ543NM-10C', size: 125, gearPrice: 1635 },
  { valveName: 'QWLZ543NM-10C', size: 150, gearPrice: 1905 },
  { valveName: 'QWLZ543NM-10C', size: 200, gearPrice: 2515 },
  { valveName: 'QWLZ543NM-10C', size: 250, gearPrice: 3180 },
  { valveName: 'QWLZ543NM-10C', size: 300, gearPrice: 7185 },
  { valveName: 'QWLZ543NM-10C', size: 350, gearPrice: 8080 },
  { valveName: 'QWLZ543NM-10C', size: 400, gearPrice: 11950 },
  { valveName: 'QWLZ543NM-10C', size: 450, gearPrice: 12275 },
  { valveName: 'QWLZ543NM-10C', size: 500, gearPrice: 23850 },
  { valveName: 'QWLZ543NM-10C', size: 600, gearPrice: 28500 },
  { valveName: 'QWLZ543NM-10C', size: 700, gearPrice: 32320 },
  { valveName: 'QWLZ543NM-10C', size: 800, gearPrice: 69500 },
  { valveName: 'QWLZ543NM-10C', size: 900, gearPrice: 54100 },
  { valveName: 'QWLZ543NM-10C', size: 1000, gearPrice: 73800 },
  { valveName: 'QWLZ543NM-10C', size: 1200, gearPrice: 116100 },
  { valveName: 'QWLZ543NM-10C', size: 1400, gearPrice: 161000 },
  
  { valveName: 'QWLZ543NM-10P', size: 100, gearPrice: 2290 },
  { valveName: 'QWLZ543NM-10P', size: 125, gearPrice: 2635 },
  { valveName: 'QWLZ543NM-10P', size: 150, gearPrice: 3075 },
  { valveName: 'QWLZ543NM-10P', size: 200, gearPrice: 4220 },
  { valveName: 'QWLZ543NM-10P', size: 250, gearPrice: 5535 },
  { valveName: 'QWLZ543NM-10P', size: 300, gearPrice: 11200 },
  { valveName: 'QWLZ543NM-10P', size: 350, gearPrice: 12470 },
  { valveName: 'QWLZ543NM-10P', size: 400, gearPrice: 17700 },
  { valveName: 'QWLZ543NM-10P', size: 450, gearPrice: 18560 },
  { valveName: 'QWLZ543NM-10P', size: 500, gearPrice: 34950 },
  { valveName: 'QWLZ543NM-10P', size: 600, gearPrice: 43225 },
  { valveName: 'QWLZ543NM-10P', size: 700, gearPrice: 50020 },
  { valveName: 'QWLZ543NM-10P', size: 800, gearPrice: 78000 },
  { valveName: 'QWLZ543NM-10P', size: 900, gearPrice: 87440 },
  { valveName: 'QWLZ543NM-10P', size: 1000, gearPrice: 107360 },
  { valveName: 'QWLZ543NM-10P', size: 1200, gearPrice: 183600 },
  { valveName: 'QWLZ543NM-10P', size: 1400, gearPrice: 245000 },
  
  { valveName: 'QWLZ543NM-10R', size: 100, gearPrice: 2605 },
  { valveName: 'QWLZ543NM-10R', size: 125, gearPrice: 2985 },
  { valveName: 'QWLZ543NM-10R', size: 150, gearPrice: 3560 },
  { valveName: 'QWLZ543NM-10R', size: 200, gearPrice: 4935 },
  { valveName: 'QWLZ543NM-10R', size: 250, gearPrice: 6615 },
  { valveName: 'QWLZ543NM-10R', size: 300, gearPrice: 13400 },
  { valveName: 'QWLZ543NM-10R', size: 350, gearPrice: 15030 },
  { valveName: 'QWLZ543NM-10R', size: 400, gearPrice: 21860 },
  { valveName: 'QWLZ543NM-10R', size: 450, gearPrice: 22430 },
  { valveName: 'QWLZ543NM-10R', size: 500, gearPrice: 41900 },
  { valveName: 'QWLZ543NM-10R', size: 600, gearPrice: 51600 },
  { valveName: 'QWLZ543NM-10R', size: 700, gearPrice: 61080 },
  { valveName: 'QWLZ543NM-10R', size: 800, gearPrice: 78600 },
  { valveName: 'QWLZ543NM-10R', size: 900, gearPrice: 104300 },
  { valveName: 'QWLZ543NM-10R', size: 1000, gearPrice: 119725 },
  { valveName: 'QWLZ543NM-10R', size: 1200, gearPrice: 216000 },
  { valveName: 'QWLZ543NM-10R', size: 1400, gearPrice: 286000 },
  
  { valveName: 'QWLZ543NM-10RL', size: 100, gearPrice: 2735 },
  { valveName: 'QWLZ543NM-10RL', size: 125, gearPrice: 2985 },
  { valveName: 'QWLZ543NM-10RL', size: 150, gearPrice: 3740 },
  { valveName: 'QWLZ543NM-10RL', size: 200, gearPrice: 5185 },
  { valveName: 'QWLZ543NM-10RL', size: 250, gearPrice: 7035 },
  { valveName: 'QWLZ543NM-10RL', size: 300, gearPrice: 14000 },
  { valveName: 'QWLZ543NM-10RL', size: 350, gearPrice: 15680 },
  { valveName: 'QWLZ543NM-10RL', size: 400, gearPrice: 22950 },
  { valveName: 'QWLZ543NM-10RL', size: 450, gearPrice: 23410 },
  { valveName: 'QWLZ543NM-10RL', size: 500, gearPrice: 43600 },
  { valveName: 'QWLZ543NM-10RL', size: 600, gearPrice: 53600 },
  { valveName: 'QWLZ543NM-10RL', size: 700, gearPrice: 63880 },
  { valveName: 'QWLZ543NM-10RL', size: 800, gearPrice: 83600 },
  { valveName: 'QWLZ543NM-10RL', size: 900, gearPrice: 107000 },
  { valveName: 'QWLZ543NM-10RL', size: 1000, gearPrice: 121025 },
  { valveName: 'QWLZ543NM-10RL', size: 1200, gearPrice: 221000 },
  { valveName: 'QWLZ543NM-10RL', size: 1400, gearPrice: 292000 }
];

// QWL系列价格数据 - QWLZ643NM (气动)
const qwlPneumaticPrices = [
  { valveName: 'QWLZ643NM-10C', size: 100, pneumaticPrice: 1540 },
  { valveName: 'QWLZ643NM-10C', size: 125, pneumaticPrice: 1685 },
  { valveName: 'QWLZ643NM-10C', size: 150, pneumaticPrice: 1955 },
  { valveName: 'QWLZ643NM-10C', size: 200, pneumaticPrice: 2770 },
  { valveName: 'QWLZ643NM-10C', size: 250, pneumaticPrice: 4125 },
  { valveName: 'QWLZ643NM-10C', size: 300, pneumaticPrice: 8425 },
  { valveName: 'QWLZ643NM-10C', size: 350, pneumaticPrice: 11080 },
  { valveName: 'QWLZ643NM-10C', size: 400, pneumaticPrice: 15095 },
  { valveName: 'QWLZ643NM-10C', size: 450, pneumaticPrice: 15475 },
  { valveName: 'QWLZ643NM-10C', size: 500, pneumaticPrice: 27100 },
  { valveName: 'QWLZ643NM-10C', size: 600, pneumaticPrice: 35200 },
  { valveName: 'QWLZ643NM-10C', size: 700, pneumaticPrice: 39520 },
  { valveName: 'QWLZ643NM-10C', size: 800, pneumaticPrice: 52950 },
  { valveName: 'QWLZ643NM-10C', size: 900, pneumaticPrice: 66500 },
  { valveName: 'QWLZ643NM-10C', size: 1000, pneumaticPrice: 85150 },
  { valveName: 'QWLZ643NM-10C', size: 1200, pneumaticPrice: 130650 },
  { valveName: 'QWLZ643NM-10C', size: 1400, pneumaticPrice: 185650 },
  
  { valveName: 'QWLZ643NM-10P', size: 100, pneumaticPrice: 2335 },
  { valveName: 'QWLZ643NM-10P', size: 125, pneumaticPrice: 2605 },
  { valveName: 'QWLZ643NM-10P', size: 150, pneumaticPrice: 3120 },
  { valveName: 'QWLZ643NM-10P', size: 200, pneumaticPrice: 4645 },
  { valveName: 'QWLZ643NM-10P', size: 250, pneumaticPrice: 6450 },
  { valveName: 'QWLZ643NM-10P', size: 300, pneumaticPrice: 12400 },
  { valveName: 'QWLZ643NM-10P', size: 350, pneumaticPrice: 15470 },
  { valveName: 'QWLZ643NM-10P', size: 400, pneumaticPrice: 20700 },
  { valveName: 'QWLZ643NM-10P', size: 450, pneumaticPrice: 21760 },
  { valveName: 'QWLZ643NM-10P', size: 500, pneumaticPrice: 38200 },
  { valveName: 'QWLZ643NM-10P', size: 600, pneumaticPrice: 46575 },
  { valveName: 'QWLZ643NM-10P', size: 700, pneumaticPrice: 57220 },
  { valveName: 'QWLZ643NM-10P', size: 800, pneumaticPrice: 77550 },
  { valveName: 'QWLZ643NM-10P', size: 900, pneumaticPrice: 95200 },
  { valveName: 'QWLZ643NM-10P', size: 1000, pneumaticPrice: 119445 },
  { valveName: 'QWLZ643NM-10P', size: 1200, pneumaticPrice: 192900 },
  { valveName: 'QWLZ643NM-10P', size: 1400, pneumaticPrice: 269650 },
  
  { valveName: 'QWLZ643NM-10R', size: 100, pneumaticPrice: 2655 },
  { valveName: 'QWLZ643NM-10R', size: 125, pneumaticPrice: 2945 },
  { valveName: 'QWLZ643NM-10R', size: 150, pneumaticPrice: 3610 },
  { valveName: 'QWLZ643NM-10R', size: 200, pneumaticPrice: 5480 },
  { valveName: 'QWLZ643NM-10R', size: 250, pneumaticPrice: 7550 },
  { valveName: 'QWLZ643NM-10R', size: 300, pneumaticPrice: 14640 },
  { valveName: 'QWLZ643NM-10R', size: 350, pneumaticPrice: 18030 },
  { valveName: 'QWLZ643NM-10R', size: 400, pneumaticPrice: 24860 },
  { valveName: 'QWLZ643NM-10R', size: 450, pneumaticPrice: 25630 },
  { valveName: 'QWLZ643NM-10R', size: 500, pneumaticPrice: 45150 },
  { valveName: 'QWLZ643NM-10R', size: 600, pneumaticPrice: 54950 },
  { valveName: 'QWLZ643NM-10R', size: 700, pneumaticPrice: 68280 },
  { valveName: 'QWLZ643NM-10R', size: 800, pneumaticPrice: 87600 },
  { valveName: 'QWLZ643NM-10R', size: 900, pneumaticPrice: 115100 },
  { valveName: 'QWLZ643NM-10R', size: 1000, pneumaticPrice: 134050 },
  { valveName: 'QWLZ643NM-10R', size: 1200, pneumaticPrice: 227700 },
  { valveName: 'QWLZ643NM-10R', size: 1400, pneumaticPrice: 312650 },
  
  { valveName: 'QWLZ643NM-10RL', size: 100, pneumaticPrice: 2785 },
  { valveName: 'QWLZ643NM-10RL', size: 125, pneumaticPrice: 3035 },
  { valveName: 'QWLZ643NM-10RL', size: 150, pneumaticPrice: 4000 },
  { valveName: 'QWLZ643NM-10RL', size: 200, pneumaticPrice: 5830 },
  { valveName: 'QWLZ643NM-10RL', size: 250, pneumaticPrice: 8320 },
  { valveName: 'QWLZ643NM-10RL', size: 300, pneumaticPrice: 15230 },
  { valveName: 'QWLZ643NM-10RL', size: 350, pneumaticPrice: 18680 },
  { valveName: 'QWLZ643NM-10RL', size: 400, pneumaticPrice: 25950 },
  { valveName: 'QWLZ643NM-10RL', size: 450, pneumaticPrice: 26810 },
  { valveName: 'QWLZ643NM-10RL', size: 500, pneumaticPrice: 46850 },
  { valveName: 'QWLZ643NM-10RL', size: 600, pneumaticPrice: 56120 },
  { valveName: 'QWLZ643NM-10RL', size: 700, pneumaticPrice: 71080 },
  { valveName: 'QWLZ643NM-10RL', size: 800, pneumaticPrice: 92600 },
  { valveName: 'QWLZ643NM-10RL', size: 900, pneumaticPrice: 119400 },
  { valveName: 'QWLZ643NM-10RL', size: 1000, pneumaticPrice: 137050 },
  { valveName: 'QWLZ643NM-10RL', size: 1200, pneumaticPrice: 237700 },
  { valveName: 'QWLZ643NM-10RL', size: 1400, pneumaticPrice: 322650 }
];

const allPrices = [
  ...qwlManualPrices,
  ...qwlGearPrices,
  ...qwlPneumaticPrices
];

// 需要添加的型号列表
const qwlModels = [
  { name: 'QWLZ43NM-10C', type_code: '手动' },
  { name: 'QWLZ43NM-10P', type_code: '手动' },
  { name: 'QWLZ43NM-10R', type_code: '手动' },
  { name: 'QWLZ43NM-10RL', type_code: '手动' },
  { name: 'QWLZ543NM-10C', type_code: '伞齿轮' },
  { name: 'QWLZ543NM-10P', type_code: '伞齿轮' },
  { name: 'QWLZ543NM-10R', type_code: '伞齿轮' },
  { name: 'QWLZ543NM-10RL', type_code: '伞齿轮' },
  { name: 'QWLZ643NM-10C', type_code: '气动' },
  { name: 'QWLZ643NM-10P', type_code: '气动' },
  { name: 'QWLZ643NM-10R', type_code: '气动' },
  { name: 'QWLZ643NM-10RL', type_code: '气动' }
];

async function updatePrices() {
  const connection = await mysql.createConnection(config);
  
  try {
    console.log('开始更新QWL系列价格数据...\n');
    
    // 1. 检查并添加QWL系列
    let [seriesRows] = await connection.execute(
      'SELECT id FROM product_series WHERE name = ?',
      ['QWL']
    );
    
    let seriesId;
    if (seriesRows.length === 0) {
      const [result] = await connection.execute(
        'INSERT INTO product_series (name) VALUES (?)',
        ['QWL']
      );
      seriesId = result.insertId;
      console.log(`+ 新增系列: QWL (ID: ${seriesId})`);
    } else {
      seriesId = seriesRows[0].id;
      console.log(`✓ 系列已存在: QWL (ID: ${seriesId})`);
    }
    
    // 2. 添加型号
    const modelIdMap = {};
    for (const model of qwlModels) {
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