const mysql = require('mysql2/promise');

const config = {
  host: 'localhost',
  user: 'root',
  password: 'CXH&cw9999',
  database: 'quotation_system'
};

// QWF系列价格数据 - 手动型号 QWFZ73NM
const qwfManualPrices = [
  { valveName: 'QWFZ73NM-10C', size: 50, manualPrice: 1180 },
  { valveName: 'QWFZ73NM-10C', size: 65, manualPrice: 1280 },
  { valveName: 'QWFZ73NM-10C', size: 80, manualPrice: 1280 },
  { valveName: 'QWFZ73NM-10C', size: 100, manualPrice: 1530 },
  { valveName: 'QWFZ73NM-10C', size: 125, manualPrice: 1845 },
  { valveName: 'QWFZ73NM-10C', size: 150, manualPrice: 2050 },
  { valveName: 'QWFZ73NM-10C', size: 200, manualPrice: 2550 },
  { valveName: 'QWFZ73NM-10C', size: 250, manualPrice: 2550 },
  { valveName: 'QWFZ73NM-10C', size: 300, manualPrice: 3810 },
  { valveName: 'QWFZ73NM-10C', size: 350, manualPrice: 4550 },
  { valveName: 'QWFZ73NM-10C', size: 400, manualPrice: 5380 },
  
  { valveName: 'QWFZ73NM-10P', size: 50, manualPrice: 1450 },
  { valveName: 'QWFZ73NM-10P', size: 65, manualPrice: 1600 },
  { valveName: 'QWFZ73NM-10P', size: 80, manualPrice: 1600 },
  { valveName: 'QWFZ73NM-10P', size: 100, manualPrice: 2000 },
  { valveName: 'QWFZ73NM-10P', size: 125, manualPrice: 2400 },
  { valveName: 'QWFZ73NM-10P', size: 150, manualPrice: 2955 },
  { valveName: 'QWFZ73NM-10P', size: 200, manualPrice: 2955 },
  { valveName: 'QWFZ73NM-10P', size: 250, manualPrice: 4100 },
  { valveName: 'QWFZ73NM-10P', size: 300, manualPrice: 5355 },
  { valveName: 'QWFZ73NM-10P', size: 350, manualPrice: 6800 },
  { valveName: 'QWFZ73NM-10P', size: 400, manualPrice: 7800 },
  
  { valveName: 'QWFZ73NM-10RL', size: 50, manualPrice: 1700 },
  { valveName: 'QWFZ73NM-10RL', size: 65, manualPrice: 1920 },
  { valveName: 'QWFZ73NM-10RL', size: 80, manualPrice: 1920 },
  { valveName: 'QWFZ73NM-10RL', size: 100, manualPrice: 2650 },
  { valveName: 'QWFZ73NM-10RL', size: 125, manualPrice: 2980 },
  { valveName: 'QWFZ73NM-10RL', size: 150, manualPrice: 3950 },
  { valveName: 'QWFZ73NM-10RL', size: 200, manualPrice: 3950 },
  { valveName: 'QWFZ73NM-10RL', size: 250, manualPrice: 5260 },
  { valveName: 'QWFZ73NM-10RL', size: 300, manualPrice: 7200 },
  { valveName: 'QWFZ73NM-10RL', size: 350, manualPrice: 8160 },
  { valveName: 'QWFZ73NM-10RL', size: 400, manualPrice: 9800 }
];

// QWF系列价格数据 - 电动型号 QWFZ973NM
const qwfElectricPrices = [
  { valveName: 'QWFZ973NM-10C', size: 50, electricPrice: 2830 },
  { valveName: 'QWFZ973NM-10C', size: 65, electricPrice: 2930 },
  { valveName: 'QWFZ973NM-10C', size: 80, electricPrice: 3180 },
  { valveName: 'QWFZ973NM-10C', size: 100, electricPrice: 3495 },
  { valveName: 'QWFZ973NM-10C', size: 125, electricPrice: 3700 },
  { valveName: 'QWFZ973NM-10C', size: 150, electricPrice: 4325 },
  { valveName: 'QWFZ973NM-10C', size: 200, electricPrice: 5585 },
  { valveName: 'QWFZ973NM-10C', size: 250, electricPrice: 6330 },
  { valveName: 'QWFZ973NM-10C', size: 300, electricPrice: 7155 },
  { valveName: 'QWFZ973NM-10C', size: 350, electricPrice: 7830 },
  { valveName: 'QWFZ973NM-10C', size: 400, electricPrice: 9275 },
  { valveName: 'QWFZ973NM-10C', size: 450, electricPrice: 9275 },
  { valveName: 'QWFZ973NM-10C', size: 500, electricPrice: 9275 },
  { valveName: 'QWFZ973NM-10C', size: 600, electricPrice: 13675 },
  
  { valveName: 'QWFZ973NM-10P', size: 50, electricPrice: 3100 },
  { valveName: 'QWFZ973NM-10P', size: 65, electricPrice: 3250 },
  { valveName: 'QWFZ973NM-10P', size: 80, electricPrice: 3650 },
  { valveName: 'QWFZ973NM-10P', size: 100, electricPrice: 4050 },
  { valveName: 'QWFZ973NM-10P', size: 125, electricPrice: 4605 },
  { valveName: 'QWFZ973NM-10P', size: 150, electricPrice: 5875 },
  { valveName: 'QWFZ973NM-10P', size: 200, electricPrice: 7130 },
  { valveName: 'QWFZ973NM-10P', size: 250, electricPrice: 8575 },
  { valveName: 'QWFZ973NM-10P', size: 300, electricPrice: 9575 },
  { valveName: 'QWFZ973NM-10P', size: 350, electricPrice: 10875 },
  { valveName: 'QWFZ973NM-10P', size: 400, electricPrice: 13675 },
  { valveName: 'QWFZ973NM-10P', size: 450, electricPrice: 13675 },
  { valveName: 'QWFZ973NM-10P', size: 500, electricPrice: 13675 },
  { valveName: 'QWFZ973NM-10P', size: 600, electricPrice: 17475 },
  
  { valveName: 'QWFZ973NM-10RL', size: 50, electricPrice: 3350 },
  { valveName: 'QWFZ973NM-10RL', size: 65, electricPrice: 3570 },
  { valveName: 'QWFZ973NM-10RL', size: 80, electricPrice: 4300 },
  { valveName: 'QWFZ973NM-10RL', size: 100, electricPrice: 4630 },
  { valveName: 'QWFZ973NM-10RL', size: 125, electricPrice: 5600 },
  { valveName: 'QWFZ973NM-10RL', size: 150, electricPrice: 7035 },
  { valveName: 'QWFZ973NM-10RL', size: 200, electricPrice: 8975 },
  { valveName: 'QWFZ973NM-10RL', size: 250, electricPrice: 9935 },
  { valveName: 'QWFZ973NM-10RL', size: 300, electricPrice: 10775 },
  { valveName: 'QWFZ973NM-10RL', size: 350, electricPrice: 13475 },
  { valveName: 'QWFZ973NM-10RL', size: 400, electricPrice: 17475 },
  { valveName: 'QWFZ973NM-10RL', size: 450, electricPrice: 17475 },
  { valveName: 'QWFZ973NM-10RL', size: 500, electricPrice: 17475 },
  { valveName: 'QWFZ973NM-10RL', size: 600, electricPrice: 17475 }
];

// QWF系列价格数据 - 气动型号 QWFZ673NM
const qwfPneumaticPrices = [
  { valveName: 'QWFZ673NM-10C', size: 50, pneumaticPrice: 1350 },
  { valveName: 'QWFZ673NM-10C', size: 65, pneumaticPrice: 1560 },
  { valveName: 'QWFZ673NM-10C', size: 80, pneumaticPrice: 1830 },
  { valveName: 'QWFZ673NM-10C', size: 100, pneumaticPrice: 2345 },
  { valveName: 'QWFZ673NM-10C', size: 125, pneumaticPrice: 2570 },
  { valveName: 'QWFZ673NM-10C', size: 150, pneumaticPrice: 3330 },
  { valveName: 'QWFZ673NM-10C', size: 200, pneumaticPrice: 4650 },
  { valveName: 'QWFZ673NM-10C', size: 250, pneumaticPrice: 5850 },
  { valveName: 'QWFZ673NM-10C', size: 300, pneumaticPrice: 6700 },
  { valveName: 'QWFZ673NM-10C', size: 350, pneumaticPrice: 7990 },
  { valveName: 'QWFZ673NM-10C', size: 400, pneumaticPrice: 7990 },
  { valveName: 'QWFZ673NM-10C', size: 450, pneumaticPrice: 11260 },
  { valveName: 'QWFZ673NM-10C', size: 500, pneumaticPrice: 11260 },
  { valveName: 'QWFZ673NM-10C', size: 600, pneumaticPrice: 14000 },
  
  { valveName: 'QWFZ673NM-10P', size: 50, pneumaticPrice: 1620 },
  { valveName: 'QWFZ673NM-10P', size: 65, pneumaticPrice: 1860 },
  { valveName: 'QWFZ673NM-10P', size: 80, pneumaticPrice: 2300 },
  { valveName: 'QWFZ673NM-10P', size: 100, pneumaticPrice: 2900 },
  { valveName: 'QWFZ673NM-10P', size: 125, pneumaticPrice: 3475 },
  { valveName: 'QWFZ673NM-10P', size: 150, pneumaticPrice: 4470 },
  { valveName: 'QWFZ673NM-10P', size: 200, pneumaticPrice: 6195 },
  { valveName: 'QWFZ673NM-10P', size: 250, pneumaticPrice: 8100 },
  { valveName: 'QWFZ673NM-10P', size: 300, pneumaticPrice: 9120 },
  { valveName: 'QWFZ673NM-10P', size: 350, pneumaticPrice: 10540 },
  { valveName: 'QWFZ673NM-10P', size: 400, pneumaticPrice: 10540 },
  { valveName: 'QWFZ673NM-10P', size: 450, pneumaticPrice: 15560 },
  { valveName: 'QWFZ673NM-10P', size: 500, pneumaticPrice: 15560 },
  { valveName: 'QWFZ673NM-10P', size: 600, pneumaticPrice: 18000 },
  
  { valveName: 'QWFZ673NM-10RL', size: 50, pneumaticPrice: 1870 },
  { valveName: 'QWFZ673NM-10RL', size: 65, pneumaticPrice: 2200 },
  { valveName: 'QWFZ673NM-10RL', size: 80, pneumaticPrice: 2950 },
  { valveName: 'QWFZ673NM-10RL', size: 100, pneumaticPrice: 3480 },
  { valveName: 'QWFZ673NM-10RL', size: 125, pneumaticPrice: 4470 },
  { valveName: 'QWFZ673NM-10RL', size: 150, pneumaticPrice: 6040 },
  { valveName: 'QWFZ673NM-10RL', size: 200, pneumaticPrice: 8040 },
  { valveName: 'QWFZ673NM-10RL', size: 250, pneumaticPrice: 9460 },
  { valveName: 'QWFZ673NM-10RL', size: 300, pneumaticPrice: 11100 },
  { valveName: 'QWFZ673NM-10RL', size: 350, pneumaticPrice: 13140 },
  { valveName: 'QWFZ673NM-10RL', size: 400, pneumaticPrice: 13140 },
  { valveName: 'QWFZ673NM-10RL', size: 450, pneumaticPrice: 19460 },
  { valveName: 'QWFZ673NM-10RL', size: 500, pneumaticPrice: 19460 },
  { valveName: 'QWFZ673NM-10RL', size: 600, pneumaticPrice: 22000 }
];

// QWF系列价格数据 - 伞齿轮型号 QWFZ573NM
const qwfGearPrices = [
  { valveName: 'QWFZ573NM-10C', size: 50, gearPrice: 1630 },
  { valveName: 'QWFZ573NM-10C', size: 65, gearPrice: 1730 },
  { valveName: 'QWFZ573NM-10C', size: 80, gearPrice: 1980 },
  { valveName: 'QWFZ573NM-10C', size: 100, gearPrice: 2300 },
  { valveName: 'QWFZ573NM-10C', size: 125, gearPrice: 2500 },
  { valveName: 'QWFZ573NM-10C', size: 150, gearPrice: 3000 },
  { valveName: 'QWFZ573NM-10C', size: 200, gearPrice: 4260 },
  { valveName: 'QWFZ573NM-10C', size: 250, gearPrice: 5000 },
  { valveName: 'QWFZ573NM-10C', size: 300, gearPrice: 5880 },
  { valveName: 'QWFZ573NM-10C', size: 350, gearPrice: 6700 },
  { valveName: 'QWFZ573NM-10C', size: 400, gearPrice: 7990 },
  { valveName: 'QWFZ573NM-10C', size: 450, gearPrice: 7050 },
  { valveName: 'QWFZ573NM-10C', size: 500, gearPrice: 8100 },
  { valveName: 'QWFZ573NM-10C', size: 600, gearPrice: 11260 },
  { valveName: 'QWFZ573NM-10C', size: 700, gearPrice: 14000 },
  { valveName: 'QWFZ573NM-10C', size: 800, gearPrice: 18000 },
  
  { valveName: 'QWFZ573NM-10P', size: 50, gearPrice: 1900 },
  { valveName: 'QWFZ573NM-10P', size: 65, gearPrice: 2050 },
  { valveName: 'QWFZ573NM-10P', size: 80, gearPrice: 2450 },
  { valveName: 'QWFZ573NM-10P', size: 100, gearPrice: 2850 },
  { valveName: 'QWFZ573NM-10P', size: 125, gearPrice: 3400 },
  { valveName: 'QWFZ573NM-10P', size: 150, gearPrice: 4450 },
  { valveName: 'QWFZ573NM-10P', size: 200, gearPrice: 5805 },
  { valveName: 'QWFZ573NM-10P', size: 250, gearPrice: 7250 },
  { valveName: 'QWFZ573NM-10P', size: 300, gearPrice: 8300 },
  { valveName: 'QWFZ573NM-10P', size: 350, gearPrice: 9120 },
  { valveName: 'QWFZ573NM-10P', size: 400, gearPrice: 10540 },
  { valveName: 'QWFZ573NM-10P', size: 450, gearPrice: 9650 },
  { valveName: 'QWFZ573NM-10P', size: 500, gearPrice: 12500 },
  { valveName: 'QWFZ573NM-10P', size: 600, gearPrice: 15560 },
  { valveName: 'QWFZ573NM-10P', size: 700, gearPrice: 18000 },
  { valveName: 'QWFZ573NM-10P', size: 800, gearPrice: 22000 },
  
  { valveName: 'QWFZ573NM-10RL', size: 50, gearPrice: 2150 },
  { valveName: 'QWFZ573NM-10RL', size: 65, gearPrice: 2370 },
  { valveName: 'QWFZ573NM-10RL', size: 80, gearPrice: 3100 },
  { valveName: 'QWFZ573NM-10RL', size: 100, gearPrice: 3430 },
  { valveName: 'QWFZ573NM-10RL', size: 125, gearPrice: 4400 },
  { valveName: 'QWFZ573NM-10RL', size: 150, gearPrice: 5710 },
  { valveName: 'QWFZ573NM-10RL', size: 200, gearPrice: 7650 },
  { valveName: 'QWFZ573NM-10RL', size: 250, gearPrice: 8610 },
  { valveName: 'QWFZ573NM-10RL', size: 300, gearPrice: 10300 },
  { valveName: 'QWFZ573NM-10RL', size: 350, gearPrice: 11100 },
  { valveName: 'QWFZ573NM-10RL', size: 400, gearPrice: 13140 },
  { valveName: 'QWFZ573NM-10RL', size: 450, gearPrice: 12200 },
  { valveName: 'QWFZ573NM-10RL', size: 500, gearPrice: 16300 },
  { valveName: 'QWFZ573NM-10RL', size: 600, gearPrice: 19460 },
  { valveName: 'QWFZ573NM-10RL', size: 700, gearPrice: 22000 },
  { valveName: 'QWFZ573NM-10RL', size: 800, gearPrice: 26000 }
];

// QWF系列价格数据 - 另一个手动型号 QWFZ273NM
const qwfManual2Prices = [
  { valveName: 'QWFZ273NM-10C', size: 50, manualPrice: 1600 },
  { valveName: 'QWFZ273NM-10C', size: 65, manualPrice: 1700 },
  { valveName: 'QWFZ273NM-10C', size: 80, manualPrice: 1950 },
  { valveName: 'QWFZ273NM-10C', size: 100, manualPrice: 2330 },
  { valveName: 'QWFZ273NM-10C', size: 125, manualPrice: 2550 },
  { valveName: 'QWFZ273NM-10C', size: 150, manualPrice: 3100 },
  { valveName: 'QWFZ273NM-10C', size: 200, manualPrice: 3910 },
  { valveName: 'QWFZ273NM-10C', size: 250, manualPrice: 5600 },
  { valveName: 'QWFZ273NM-10C', size: 300, manualPrice: 6580 },
  { valveName: 'QWFZ273NM-10C', size: 350, manualPrice: 7450 },
  { valveName: 'QWFZ273NM-10C', size: 400, manualPrice: 8600 },
  { valveName: 'QWFZ273NM-10C', size: 450, manualPrice: 8600 },
  { valveName: 'QWFZ273NM-10C', size: 500, manualPrice: 8600 },
  { valveName: 'QWFZ273NM-10C', size: 600, manualPrice: 13000 },
  
  { valveName: 'QWFZ273NM-10P', size: 50, manualPrice: 1870 },
  { valveName: 'QWFZ273NM-10P', size: 65, manualPrice: 1870 },
  { valveName: 'QWFZ273NM-10P', size: 80, manualPrice: 2420 },
  { valveName: 'QWFZ273NM-10P', size: 100, manualPrice: 2880 },
  { valveName: 'QWFZ273NM-10P', size: 125, manualPrice: 3450 },
  { valveName: 'QWFZ273NM-10P', size: 150, manualPrice: 4450 },
  { valveName: 'QWFZ273NM-10P', size: 200, manualPrice: 5455 },
  { valveName: 'QWFZ273NM-10P', size: 250, manualPrice: 7850 },
  { valveName: 'QWFZ273NM-10P', size: 300, manualPrice: 9000 },
  { valveName: 'QWFZ273NM-10P', size: 350, manualPrice: 10050 },
  { valveName: 'QWFZ273NM-10P', size: 400, manualPrice: 13000 },
  { valveName: 'QWFZ273NM-10P', size: 450, manualPrice: 13000 },
  { valveName: 'QWFZ273NM-10P', size: 500, manualPrice: 13000 },
  { valveName: 'QWFZ273NM-10P', size: 600, manualPrice: 16800 },
  
  { valveName: 'QWFZ273NM-10RL', size: 50, manualPrice: 2120 },
  { valveName: 'QWFZ273NM-10RL', size: 65, manualPrice: 2190 },
  { valveName: 'QWFZ273NM-10RL', size: 80, manualPrice: 3070 },
  { valveName: 'QWFZ273NM-10RL', size: 100, manualPrice: 3460 },
  { valveName: 'QWFZ273NM-10RL', size: 125, manualPrice: 4450 },
  { valveName: 'QWFZ273NM-10RL', size: 150, manualPrice: 5810 },
  { valveName: 'QWFZ273NM-10RL', size: 200, manualPrice: 7300 },
  { valveName: 'QWFZ273NM-10RL', size: 250, manualPrice: 9210 },
  { valveName: 'QWFZ273NM-10RL', size: 300, manualPrice: 11000 },
  { valveName: 'QWFZ273NM-10RL', size: 350, manualPrice: 12600 },
  { valveName: 'QWFZ273NM-10RL', size: 400, manualPrice: 16800 },
  { valveName: 'QWFZ273NM-10RL', size: 450, manualPrice: 16800 },
  { valveName: 'QWFZ273NM-10RL', size: 500, manualPrice: 16800 },
  { valveName: 'QWFZ273NM-10RL', size: 600, manualPrice: 16800 }
];

const allPrices = [
  ...qwfManualPrices,
  ...qwfElectricPrices,
  ...qwfPneumaticPrices,
  ...qwfGearPrices,
  ...qwfManual2Prices
];

// 需要添加的型号列表
const qwfModels = [
  { name: 'QWFZ73NM-10C', type_code: '手动' },
  { name: 'QWFZ73NM-10P', type_code: '手动' },
  { name: 'QWFZ73NM-10RL', type_code: '手动' },
  { name: 'QWFZ973NM-10C', type_code: '电动' },
  { name: 'QWFZ973NM-10P', type_code: '电动' },
  { name: 'QWFZ973NM-10RL', type_code: '电动' },
  { name: 'QWFZ673NM-10C', type_code: '气动' },
  { name: 'QWFZ673NM-10P', type_code: '气动' },
  { name: 'QWFZ673NM-10RL', type_code: '气动' },
  { name: 'QWFZ573NM-10C', type_code: '伞齿轮' },
  { name: 'QWFZ573NM-10P', type_code: '伞齿轮' },
  { name: 'QWFZ573NM-10RL', type_code: '伞齿轮' },
  { name: 'QWFZ273NM-10C', type_code: '手动' },
  { name: 'QWFZ273NM-10P', type_code: '手动' },
  { name: 'QWFZ273NM-10RL', type_code: '手动' }
];

async function updatePrices() {
  const connection = await mysql.createConnection(config);
  
  try {
    console.log('开始更新QWF系列价格数据...\n');
    
    // 1. 检查并添加QWF系列
    let [seriesRows] = await connection.execute(
      'SELECT id FROM product_series WHERE name = ?',
      ['QWF']
    );
    
    let seriesId;
    if (seriesRows.length === 0) {
      const [result] = await connection.execute(
        'INSERT INTO product_series (name) VALUES (?)',
        ['QWF']
      );
      seriesId = result.insertId;
      console.log(`+ 新增系列: QWF (ID: ${seriesId})`);
    } else {
      seriesId = seriesRows[0].id;
      console.log(`✓ 系列已存在: QWF (ID: ${seriesId})`);
    }
    
    // 2. 添加型号
    const modelIdMap = {};
    for (const model of qwfModels) {
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