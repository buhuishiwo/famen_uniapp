const mysql = require('mysql2/promise');

const config = {
  host: 'localhost',
  user: 'root',
  password: 'CXH&cw9999',
  database: 'quotation_system'
};

// QPA系列价格数据 - 手动型号 QPAZ73X
const qpaManualPrices = [
  { valveName: 'QPAZ73X-10C', size: 50, manualPrice: 620 },
  { valveName: 'QPAZ73X-10C', size: 65, manualPrice: 680 },
  { valveName: 'QPAZ73X-10C', size: 80, manualPrice: 760 },
  { valveName: 'QPAZ73X-10C', size: 100, manualPrice: 930 },
  { valveName: 'QPAZ73X-10C', size: 125, manualPrice: 1080 },
  { valveName: 'QPAZ73X-10C', size: 150, manualPrice: 1320 },
  { valveName: 'QPAZ73X-10C', size: 200, manualPrice: 1790 },
  { valveName: 'QPAZ73X-10C', size: 250, manualPrice: 2450 },
  { valveName: 'QPAZ73X-10C', size: 300, manualPrice: 3250 },
  
  { valveName: 'QPAZ73X-10G', size: 50, manualPrice: 580 },
  { valveName: 'QPAZ73X-10G', size: 65, manualPrice: 650 },
  { valveName: 'QPAZ73X-10G', size: 80, manualPrice: 680 },
  { valveName: 'QPAZ73X-10G', size: 100, manualPrice: 820 },
  { valveName: 'QPAZ73X-10G', size: 125, manualPrice: 950 },
  { valveName: 'QPAZ73X-10G', size: 150, manualPrice: 1170 },
  { valveName: 'QPAZ73X-10G', size: 200, manualPrice: 1540 },
  { valveName: 'QPAZ73X-10G', size: 250, manualPrice: 2100 },
  { valveName: 'QPAZ73X-10G', size: 300, manualPrice: 2750 },
  
  { valveName: 'QPAZ73X-10P', size: 50, manualPrice: 850 },
  { valveName: 'QPAZ73X-10P', size: 65, manualPrice: 950 },
  { valveName: 'QPAZ73X-10P', size: 80, manualPrice: 1000 },
  { valveName: 'QPAZ73X-10P', size: 100, manualPrice: 1200 },
  { valveName: 'QPAZ73X-10P', size: 125, manualPrice: 1500 },
  { valveName: 'QPAZ73X-10P', size: 150, manualPrice: 1760 },
  { valveName: 'QPAZ73X-10P', size: 200, manualPrice: 2520 },
  { valveName: 'QPAZ73X-10P', size: 250, manualPrice: 4350 },
  { valveName: 'QPAZ73X-10P', size: 300, manualPrice: 4350 },
  
  { valveName: 'QPAZ73X-10RL', size: 50, manualPrice: 995 },
  { valveName: 'QPAZ73X-10RL', size: 65, manualPrice: 1080 },
  { valveName: 'QPAZ73X-10RL', size: 80, manualPrice: 1200 },
  { valveName: 'QPAZ73X-10RL', size: 100, manualPrice: 1440 },
  { valveName: 'QPAZ73X-10RL', size: 125, manualPrice: 1900 },
  { valveName: 'QPAZ73X-10RL', size: 150, manualPrice: 2200 },
  { valveName: 'QPAZ73X-10RL', size: 200, manualPrice: 3200 },
  { valveName: 'QPAZ73X-10RL', size: 250, manualPrice: 4165 },
  { valveName: 'QPAZ73X-10RL', size: 300, manualPrice: 5780 }
];

// QPA系列价格数据 - 气动型号 QPAZ673X
const qpaPneumaticPrices = [
  { valveName: 'QPAZ673X-10C', size: 50, pneumaticPrice: 760 },
  { valveName: 'QPAZ673X-10C', size: 65, pneumaticPrice: 820 },
  { valveName: 'QPAZ673X-10C', size: 80, pneumaticPrice: 990 },
  { valveName: 'QPAZ673X-10C', size: 100, pneumaticPrice: 1330 },
  { valveName: 'QPAZ673X-10C', size: 125, pneumaticPrice: 1500 },
  { valveName: 'QPAZ673X-10C', size: 150, pneumaticPrice: 1870 },
  { valveName: 'QPAZ673X-10C', size: 200, pneumaticPrice: 3200 },
  { valveName: 'QPAZ673X-10C', size: 250, pneumaticPrice: 3800 },
  { valveName: 'QPAZ673X-10C', size: 300, pneumaticPrice: 4650 },
  { valveName: 'QPAZ673X-10C', size: 350, pneumaticPrice: 6400 },
  { valveName: 'QPAZ673X-10C', size: 400, pneumaticPrice: 9340 },
  { valveName: 'QPAZ673X-10C', size: 450, pneumaticPrice: 8150 },
  { valveName: 'QPAZ673X-10C', size: 500, pneumaticPrice: 12080 },
  { valveName: 'QPAZ673X-10C', size: 600, pneumaticPrice: 17810 },
  
  { valveName: 'QPAZ673X-10G', size: 50, pneumaticPrice: 720 },
  { valveName: 'QPAZ673X-10G', size: 65, pneumaticPrice: 790 },
  { valveName: 'QPAZ673X-10G', size: 80, pneumaticPrice: 910 },
  { valveName: 'QPAZ673X-10G', size: 100, pneumaticPrice: 1220 },
  { valveName: 'QPAZ673X-10G', size: 125, pneumaticPrice: 1380 },
  { valveName: 'QPAZ673X-10G', size: 150, pneumaticPrice: 1720 },
  { valveName: 'QPAZ673X-10G', size: 200, pneumaticPrice: 2900 },
  { valveName: 'QPAZ673X-10G', size: 250, pneumaticPrice: 3450 },
  { valveName: 'QPAZ673X-10G', size: 300, pneumaticPrice: 4150 },
  { valveName: 'QPAZ673X-10G', size: 350, pneumaticPrice: 5850 },
  { valveName: 'QPAZ673X-10G', size: 400, pneumaticPrice: 8550 },
  { valveName: 'QPAZ673X-10G', size: 450, pneumaticPrice: 7750 },
  { valveName: 'QPAZ673X-10G', size: 500, pneumaticPrice: 11450 },
  { valveName: 'QPAZ673X-10G', size: 600, pneumaticPrice: 16650 },
  
  { valveName: 'QPAZ673X-10P', size: 50, pneumaticPrice: 990 },
  { valveName: 'QPAZ673X-10P', size: 65, pneumaticPrice: 1090 },
  { valveName: 'QPAZ673X-10P', size: 80, pneumaticPrice: 1230 },
  { valveName: 'QPAZ673X-10P', size: 100, pneumaticPrice: 1600 },
  { valveName: 'QPAZ673X-10P', size: 125, pneumaticPrice: 1900 },
  { valveName: 'QPAZ673X-10P', size: 150, pneumaticPrice: 2310 },
  { valveName: 'QPAZ673X-10P', size: 200, pneumaticPrice: 3900 },
  { valveName: 'QPAZ673X-10P', size: 250, pneumaticPrice: 4550 },
  { valveName: 'QPAZ673X-10P', size: 300, pneumaticPrice: 5750 },
  { valveName: 'QPAZ673X-10P', size: 350, pneumaticPrice: 10400 },
  { valveName: 'QPAZ673X-10P', size: 400, pneumaticPrice: 10400 },
  { valveName: 'QPAZ673X-10P', size: 450, pneumaticPrice: 14400 },
  { valveName: 'QPAZ673X-10P', size: 500, pneumaticPrice: 20400 },
  { valveName: 'QPAZ673X-10P', size: 600, pneumaticPrice: 27300 },
  
  { valveName: 'QPAZ673X-10RL', size: 50, pneumaticPrice: 1135 },
  { valveName: 'QPAZ673X-10RL', size: 65, pneumaticPrice: 1220 },
  { valveName: 'QPAZ673X-10RL', size: 80, pneumaticPrice: 1380 },
  { valveName: 'QPAZ673X-10RL', size: 100, pneumaticPrice: 1840 },
  { valveName: 'QPAZ673X-10RL', size: 125, pneumaticPrice: 2300 },
  { valveName: 'QPAZ673X-10RL', size: 150, pneumaticPrice: 2750 },
  { valveName: 'QPAZ673X-10RL', size: 200, pneumaticPrice: 4550 },
  { valveName: 'QPAZ673X-10RL', size: 250, pneumaticPrice: 5500 },
  { valveName: 'QPAZ673X-10RL', size: 300, pneumaticPrice: 6180 },
  { valveName: 'QPAZ673X-10RL', size: 350, pneumaticPrice: 11050 },
  { valveName: 'QPAZ673X-10RL', size: 400, pneumaticPrice: 11050 },
  { valveName: 'QPAZ673X-10RL', size: 450, pneumaticPrice: 15500 },
  { valveName: 'QPAZ673X-10RL', size: 500, pneumaticPrice: 21950 },
  { valveName: 'QPAZ673X-10RL', size: 600, pneumaticPrice: 29180 }
];

// QPA系列价格数据 - 伞齿轮型号 QPAZ573X
const qpaGearPrices = [
  { valveName: 'QPAZ573X-10C', size: 50, gearPrice: 1070 },
  { valveName: 'QPAZ573X-10C', size: 65, gearPrice: 1130 },
  { valveName: 'QPAZ573X-10C', size: 80, gearPrice: 1210 },
  { valveName: 'QPAZ573X-10C', size: 100, gearPrice: 1380 },
  { valveName: 'QPAZ573X-10C', size: 125, gearPrice: 1530 },
  { valveName: 'QPAZ573X-10C', size: 150, gearPrice: 1770 },
  { valveName: 'QPAZ573X-10C', size: 200, gearPrice: 2240 },
  { valveName: 'QPAZ573X-10C', size: 250, gearPrice: 2900 },
  { valveName: 'QPAZ573X-10C', size: 300, gearPrice: 3900 },
  { valveName: 'QPAZ573X-10C', size: 350, gearPrice: 4695 },
  { valveName: 'QPAZ573X-10C', size: 400, gearPrice: 6485 },
  { valveName: 'QPAZ573X-10C', size: 450, gearPrice: 7100 },
  { valveName: 'QPAZ573X-10C', size: 500, gearPrice: 10920 },
  { valveName: 'QPAZ573X-10C', size: 600, gearPrice: 16560 },
  { valveName: 'QPAZ573X-10C', size: 600, gearPrice: 16560 },
  { valveName: 'QPAZ573X-10C', size: 700, gearPrice: 17650 },
  { valveName: 'QPAZ573X-10C', size: 800, gearPrice: 21015 },
  { valveName: 'QPAZ573X-10C', size: 900, gearPrice: 27030 },
  { valveName: 'QPAZ573X-10C', size: 1000, gearPrice: 32015 },
  
  { valveName: 'QPAZ573X-10G', size: 50, gearPrice: 1030 },
  { valveName: 'QPAZ573X-10G', size: 65, gearPrice: 1100 },
  { valveName: 'QPAZ573X-10G', size: 80, gearPrice: 1180 },
  { valveName: 'QPAZ573X-10G', size: 100, gearPrice: 1350 },
  { valveName: 'QPAZ573X-10G', size: 125, gearPrice: 1490 },
  { valveName: 'QPAZ573X-10G', size: 150, gearPrice: 1720 },
  { valveName: 'QPAZ573X-10G', size: 200, gearPrice: 2190 },
  { valveName: 'QPAZ573X-10G', size: 250, gearPrice: 2850 },
  { valveName: 'QPAZ573X-10G', size: 300, gearPrice: 3600 },
  { valveName: 'QPAZ573X-10G', size: 350, gearPrice: 4695 },
  { valveName: 'QPAZ573X-10G', size: 400, gearPrice: 5780 },
  { valveName: 'QPAZ573X-10G', size: 450, gearPrice: 6700 },
  { valveName: 'QPAZ573X-10G', size: 500, gearPrice: 10400 },
  { valveName: 'QPAZ573X-10G', size: 600, gearPrice: 15400 },
  { valveName: 'QPAZ573X-10G', size: 600, gearPrice: 15400 },
  { valveName: 'QPAZ573X-10G', size: 700, gearPrice: 16450 },
  { valveName: 'QPAZ573X-10G', size: 800, gearPrice: 19605 },
  { valveName: 'QPAZ573X-10G', size: 900, gearPrice: 25410 },
  { valveName: 'QPAZ573X-10G', size: 1000, gearPrice: 30210 },
  
  { valveName: 'QPAZ573X-10P', size: 50, gearPrice: 1300 },
  { valveName: 'QPAZ573X-10P', size: 65, gearPrice: 1400 },
  { valveName: 'QPAZ573X-10P', size: 80, gearPrice: 1450 },
  { valveName: 'QPAZ573X-10P', size: 100, gearPrice: 1650 },
  { valveName: 'QPAZ573X-10P', size: 125, gearPrice: 1950 },
  { valveName: 'QPAZ573X-10P', size: 150, gearPrice: 2210 },
  { valveName: 'QPAZ573X-10P', size: 200, gearPrice: 2970 },
  { valveName: 'QPAZ573X-10P', size: 250, gearPrice: 3650 },
  { valveName: 'QPAZ573X-10P', size: 300, gearPrice: 5040 },
  { valveName: 'QPAZ573X-10P', size: 350, gearPrice: 6495 },
  { valveName: 'QPAZ573X-10P', size: 400, gearPrice: 7550 },
  { valveName: 'QPAZ573X-10P', size: 450, gearPrice: 10400 },
  { valveName: 'QPAZ573X-10P', size: 500, gearPrice: 15500 },
  { valveName: 'QPAZ573X-10P', size: 600, gearPrice: 26350 },
  { valveName: 'QPAZ573X-10P', size: 600, gearPrice: 26350 },
  { valveName: 'QPAZ573X-10P', size: 700, gearPrice: 27550 },
  { valveName: 'QPAZ573X-10P', size: 800, gearPrice: 31545 },
  { valveName: 'QPAZ573X-10P', size: 900, gearPrice: 40545 },
  { valveName: 'QPAZ573X-10P', size: 1000, gearPrice: 48025 },
  
  { valveName: 'QPAZ573X-10RL', size: 50, gearPrice: 1445 },
  { valveName: 'QPAZ573X-10RL', size: 65, gearPrice: 1530 },
  { valveName: 'QPAZ573X-10RL', size: 80, gearPrice: 1650 },
  { valveName: 'QPAZ573X-10RL', size: 100, gearPrice: 1890 },
  { valveName: 'QPAZ573X-10RL', size: 125, gearPrice: 2350 },
  { valveName: 'QPAZ573X-10RL', size: 150, gearPrice: 2650 },
  { valveName: 'QPAZ573X-10RL', size: 200, gearPrice: 3650 },
  { valveName: 'QPAZ573X-10RL', size: 250, gearPrice: 4620 },
  { valveName: 'QPAZ573X-10RL', size: 300, gearPrice: 6450 },
  { valveName: 'QPAZ573X-10RL', size: 350, gearPrice: 8330 },
  { valveName: 'QPAZ573X-10RL', size: 400, gearPrice: 10215 },
  { valveName: 'QPAZ573X-10RL', size: 450, gearPrice: 13550 },
  { valveName: 'QPAZ573X-10RL', size: 500, gearPrice: 20400 },
  { valveName: 'QPAZ573X-10RL', size: 600, gearPrice: 32080 },
  { valveName: 'QPAZ573X-10RL', size: 600, gearPrice: 32080 },
  { valveName: 'QPAZ573X-10RL', size: 700, gearPrice: 34180 },
  { valveName: 'QPAZ573X-10RL', size: 800, gearPrice: 39435 },
  { valveName: 'QPAZ573X-10RL', size: 900, gearPrice: 50455 },
  { valveName: 'QPAZ573X-10RL', size: 1000, gearPrice: 60035 }
];

// QPA系列价格数据 - 型号 QPAZ243X
const qpa243Prices = [
  { valveName: 'QPAZ243X-10C', size: 50, manualPrice: 1000 },
  { valveName: 'QPAZ243X-10C', size: 65, manualPrice: 1080 },
  { valveName: 'QPAZ243X-10C', size: 80, manualPrice: 1160 },
  { valveName: 'QPAZ243X-10C', size: 100, manualPrice: 1330 },
  { valveName: 'QPAZ243X-10C', size: 125, manualPrice: 1490 },
  { valveName: 'QPAZ243X-10C', size: 150, manualPrice: 1730 },
  { valveName: 'QPAZ243X-10C', size: 200, manualPrice: 2200 },
  { valveName: 'QPAZ243X-10C', size: 250, manualPrice: 2950 },
  { valveName: 'QPAZ243X-10C', size: 300, manualPrice: 3750 },
  { valveName: 'QPAZ243X-10C', size: 350, manualPrice: 4350 },
  { valveName: 'QPAZ243X-10C', size: 400, manualPrice: 4550 },
  { valveName: 'QPAZ243X-10C', size: 450, manualPrice: 8150 },
  { valveName: 'QPAZ243X-10C', size: 500, manualPrice: 12080 },
  { valveName: 'QPAZ243X-10C', size: 600, manualPrice: 17810 },
  
  { valveName: 'QPAZ243X-10G', size: 50, manualPrice: 960 },
  { valveName: 'QPAZ243X-10G', size: 65, manualPrice: 1050 },
  { valveName: 'QPAZ243X-10G', size: 80, manualPrice: 1080 },
  { valveName: 'QPAZ243X-10G', size: 100, manualPrice: 1220 },
  { valveName: 'QPAZ243X-10G', size: 125, manualPrice: 1360 },
  { valveName: 'QPAZ243X-10G', size: 150, manualPrice: 1580 },
  { valveName: 'QPAZ243X-10G', size: 200, manualPrice: 1950 },
  { valveName: 'QPAZ243X-10G', size: 250, manualPrice: 2570 },
  { valveName: 'QPAZ243X-10G', size: 300, manualPrice: 3250 },
  { valveName: 'QPAZ243X-10G', size: 350, manualPrice: 3850 },
  { valveName: 'QPAZ243X-10G', size: 400, manualPrice: 4050 },
  { valveName: 'QPAZ243X-10G', size: 450, manualPrice: 7750 },
  { valveName: 'QPAZ243X-10G', size: 500, manualPrice: 11450 },
  { valveName: 'QPAZ243X-10G', size: 600, manualPrice: 16650 },
  
  { valveName: 'QPAZ243X-10P', size: 50, manualPrice: 1230 },
  { valveName: 'QPAZ243X-10P', size: 65, manualPrice: 1350 },
  { valveName: 'QPAZ243X-10P', size: 80, manualPrice: 1400 },
  { valveName: 'QPAZ243X-10P', size: 100, manualPrice: 1600 },
  { valveName: 'QPAZ243X-10P', size: 125, manualPrice: 1910 },
  { valveName: 'QPAZ243X-10P', size: 150, manualPrice: 2170 },
  { valveName: 'QPAZ243X-10P', size: 200, manualPrice: 2930 },
  { valveName: 'QPAZ243X-10P', size: 250, manualPrice: 3610 },
  { valveName: 'QPAZ243X-10P', size: 300, manualPrice: 4850 },
  { valveName: 'QPAZ243X-10P', size: 350, manualPrice: 5450 },
  { valveName: 'QPAZ243X-10P', size: 400, manualPrice: 5650 },
  { valveName: 'QPAZ243X-10P', size: 450, manualPrice: 11450 },
  { valveName: 'QPAZ243X-10P', size: 500, manualPrice: 16650 },
  { valveName: 'QPAZ243X-10P', size: 600, manualPrice: 27600 },
  
  { valveName: 'QPAZ243X-10RL', size: 50, manualPrice: 1380 },
  { valveName: 'QPAZ243X-10RL', size: 65, manualPrice: 1480 },
  { valveName: 'QPAZ243X-10RL', size: 80, manualPrice: 1600 },
  { valveName: 'QPAZ243X-10RL', size: 100, manualPrice: 1840 },
  { valveName: 'QPAZ243X-10RL', size: 125, manualPrice: 2310 },
  { valveName: 'QPAZ243X-10RL', size: 150, manualPrice: 2610 },
  { valveName: 'QPAZ243X-10RL', size: 200, manualPrice: 3610 },
  { valveName: 'QPAZ243X-10RL', size: 250, manualPrice: 4665 },
  { valveName: 'QPAZ243X-10RL', size: 300, manualPrice: 6280 },
  { valveName: 'QPAZ243X-10RL', size: 350, manualPrice: 6880 },
  { valveName: 'QPAZ243X-10RL', size: 400, manualPrice: 7080 },
  { valveName: 'QPAZ243X-10RL', size: 450, manualPrice: 14600 },
  { valveName: 'QPAZ243X-10RL', size: 500, manualPrice: 21950 },
  { valveName: 'QPAZ243X-10RL', size: 600, manualPrice: 33280 }
];

// QPA系列价格数据 - 电动型号 QPAZ943X
const qpaElectricPrices = [
  { valveName: 'QPAZ943X-10C', size: 50, electricPrice: 720 },
  { valveName: 'QPAZ943X-10C', size: 65, electricPrice: 780 },
  { valveName: 'QPAZ943X-10C', size: 80, electricPrice: 860 },
  { valveName: 'QPAZ943X-10C', size: 100, electricPrice: 1030 },
  { valveName: 'QPAZ943X-10C', size: 125, electricPrice: 1180 },
  { valveName: 'QPAZ943X-10C', size: 150, electricPrice: 1420 },
  { valveName: 'QPAZ943X-10C', size: 200, electricPrice: 1890 },
  { valveName: 'QPAZ943X-10C', size: 250, electricPrice: 2550 },
  { valveName: 'QPAZ943X-10C', size: 300, electricPrice: 3350 },
  { valveName: 'QPAZ943X-10C', size: 350, electricPrice: 4650 },
  { valveName: 'QPAZ943X-10C', size: 400, electricPrice: 6040 },
  { valveName: 'QPAZ943X-10C', size: 450, electricPrice: 6650 },
  { valveName: 'QPAZ943X-10C', size: 500, electricPrice: 11610 },
  
  { valveName: 'QPAZ943X-10G', size: 50, electricPrice: 680 },
  { valveName: 'QPAZ943X-10G', size: 65, electricPrice: 750 },
  { valveName: 'QPAZ943X-10G', size: 80, electricPrice: 780 },
  { valveName: 'QPAZ943X-10G', size: 100, electricPrice: 920 },
  { valveName: 'QPAZ943X-10G', size: 125, electricPrice: 1050 },
  { valveName: 'QPAZ943X-10G', size: 150, electricPrice: 1270 },
  { valveName: 'QPAZ943X-10G', size: 200, electricPrice: 1640 },
  { valveName: 'QPAZ943X-10G', size: 250, electricPrice: 2200 },
  { valveName: 'QPAZ943X-10G', size: 300, electricPrice: 2850 },
  { valveName: 'QPAZ943X-10G', size: 350, electricPrice: 4245 },
  { valveName: 'QPAZ943X-10G', size: 400, electricPrice: 5530 },
  { valveName: 'QPAZ943X-10G', size: 450, electricPrice: 6250 },
  { valveName: 'QPAZ943X-10G', size: 500, electricPrice: 10980 },
  
  { valveName: 'QPAZ943X-10P', size: 50, electricPrice: 950 },
  { valveName: 'QPAZ943X-10P', size: 65, electricPrice: 1050 },
  { valveName: 'QPAZ943X-10P', size: 80, electricPrice: 1100 },
  { valveName: 'QPAZ943X-10P', size: 100, electricPrice: 1300 },
  { valveName: 'QPAZ943X-10P', size: 125, electricPrice: 1600 },
  { valveName: 'QPAZ943X-10P', size: 150, electricPrice: 1860 },
  { valveName: 'QPAZ943X-10P', size: 200, electricPrice: 2620 },
  { valveName: 'QPAZ943X-10P', size: 250, electricPrice: 3445 },
  { valveName: 'QPAZ943X-10P', size: 300, electricPrice: 4450 },
  { valveName: 'QPAZ943X-10P', size: 350, electricPrice: 5880 },
  { valveName: 'QPAZ943X-10P', size: 400, electricPrice: 7100 },
  { valveName: 'QPAZ943X-10P', size: 450, electricPrice: 9950 },
  { valveName: 'QPAZ943X-10P', size: 500, electricPrice: 15050 },
  
  { valveName: 'QPAZ943X-10RL', size: 50, electricPrice: 1095 },
  { valveName: 'QPAZ943X-10RL', size: 65, electricPrice: 1180 },
  { valveName: 'QPAZ943X-10RL', size: 80, electricPrice: 1300 },
  { valveName: 'QPAZ943X-10RL', size: 100, electricPrice: 1540 },
  { valveName: 'QPAZ943X-10RL', size: 125, electricPrice: 2000 },
  { valveName: 'QPAZ943X-10RL', size: 150, electricPrice: 2300 },
  { valveName: 'QPAZ943X-10RL', size: 200, electricPrice: 3300 },
  { valveName: 'QPAZ943X-10RL', size: 250, electricPrice: 4265 },
  { valveName: 'QPAZ943X-10RL', size: 300, electricPrice: 5880 },
  { valveName: 'QPAZ943X-10RL', size: 350, electricPrice: 7900 },
  { valveName: 'QPAZ943X-10RL', size: 400, electricPrice: 9790 },
  { valveName: 'QPAZ943X-10RL', size: 450, electricPrice: 13100 },
  { valveName: 'QPAZ943X-10RL', size: 500, electricPrice: 20350 },
  { valveName: 'QPAZ943X-10RL', size: 600, electricPrice: 31580 }
];

const allPrices = [
  ...qpaManualPrices,
  ...qpaPneumaticPrices,
  ...qpaGearPrices,
  ...qpa243Prices,
  ...qpaElectricPrices
];

// 需要添加的型号列表
const qpaModels = [
  { name: 'QPAZ73X-10C', type: '手动' },
  { name: 'QPAZ73X-10G', type: '手动' },
  { name: 'QPAZ73X-10P', type: '手动' },
  { name: 'QPAZ73X-10RL', type: '手动' },
  { name: 'QPAZ673X-10C', type: '气动' },
  { name: 'QPAZ673X-10G', type: '气动' },
  { name: 'QPAZ673X-10P', type: '气动' },
  { name: 'QPAZ673X-10RL', type: '气动' },
  { name: 'QPAZ573X-10C', type: '伞齿轮' },
  { name: 'QPAZ573X-10G', type: '伞齿轮' },
  { name: 'QPAZ573X-10P', type: '伞齿轮' },
  { name: 'QPAZ573X-10RL', type: '伞齿轮' },
  { name: 'QPAZ243X-10C', type: '手动' },
  { name: 'QPAZ243X-10G', type: '手动' },
  { name: 'QPAZ243X-10P', type: '手动' },
  { name: 'QPAZ243X-10RL', type: '手动' },
  { name: 'QPAZ943X-10C', type: '电动' },
  { name: 'QPAZ943X-10G', type: '电动' },
  { name: 'QPAZ943X-10P', type: '电动' },
  { name: 'QPAZ943X-10RL', type: '电动' }
];

async function updatePrices() {
  const connection = await mysql.createConnection(config);
  
  try {
    console.log('开始更新QPA系列价格数据...\n');
    
    // 1. 检查并添加QPA系列
    let [seriesRows] = await connection.execute(
      'SELECT id FROM product_series WHERE name = ?',
      ['QPA']
    );
    
    let seriesId;
    if (seriesRows.length === 0) {
      const [result] = await connection.execute(
        'INSERT INTO product_series (name) VALUES (?)',
        ['QPA']
      );
      seriesId = result.insertId;
      console.log(`+ 新增系列: QPA (ID: ${seriesId})`);
    } else {
      seriesId = seriesRows[0].id;
      console.log(`✓ 系列已存在: QPA (ID: ${seriesId})`);
    }
    
    // 2. 添加型号
    const modelIdMap = {};
    for (const model of qpaModels) {
      const [rows] = await connection.execute(
        'SELECT id FROM valve_models WHERE name = ?',
        [model.name]
      );
      
      if (rows.length === 0) {
        const [result] = await connection.execute(
          'INSERT INTO valve_models (series_id, name, type_code) VALUES (?, ?, ?)',
          [seriesId, model.name, model.type]
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