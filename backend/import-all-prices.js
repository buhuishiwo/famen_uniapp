const mysql = require('mysql2/promise');

// 价格数据（从前端代码提取）
const priceData = {
    sizes: [
        { size: 40, manual: 375, noElectric: 420, electric: 2005, pneumatic: 455, gear: 820, brandingFee: 25 },
        { size: 50, manual: 375, noElectric: 420, electric: 2005, pneumatic: 455, gear: 820, brandingFee: 25, quManual: 190, quNoElectric: 300, quElectric: 320, quPneumatic: 210, quGear: 700, qzManual: 150, qzPneumatic: 220, qzGear: 310, qb73X10C: 220, qb73X10G: 190, qb73X10P: 310, qb73X10RL: 400, qb573X10C: 730, qb573X10G: 700, qb573X10P: 830, qb573X10RL: 900, qb673X10C: 360, qb673X10G: 320, qb673X10P: 440, qcManual: 750, qcPneumatic: 720, qcGear: 830, qyManual: 380, qyPneumatic: 630, qyGear: 810, qjManual: 355, qjNoElectric: 430, qjElectric: 790, qjPneumatic: 460, qmg10Q: 325, qmg10RQ: 530, qmg10P: 580, qmg10R: 585, qmg10RL: 595, qmc10C: 480, qmc10P: 600, qmc10R: 735, qmc10RL: 755 },
        { size: 65, manual: 400, noElectric: 450, electric: 2065, pneumatic: 485, gear: 850, brandingFee: 25, quManual: 260, quNoElectric: 330, quElectric: 340, quPneumatic: 270, quGear: 720, qzManual: 240, qzPneumatic: 310, qzGear: 450, qb73X10C: 240, qb73X10G: 210, qb73X10P: 360, qb73X10RL: 460, qb573X10C: 750, qb573X10G: 720, qb573X10P: 870, qb573X10RL: 950, qb673X10C: 380, qb673X10G: 350, qb673X10P: 480, qcManual: 870, qcPneumatic: 790, qcGear: 910, qyManual: 440, qyPneumatic: 730, qyGear: 950, qjManual: 380, qjNoElectric: 480, qjElectric: 860, qjPneumatic: 520, qmg10Q: 395, qmg10RQ: 665, qmg10P: 725, qmg10R: 745, qmg10RL: 745, qmc10C: 700, qmc10P: 820, qmc10R: 955, qmc10RL: 975 },
        { size: 80, manual: 430, noElectric: 480, electric: 2100, pneumatic: 540, gear: 885, brandingFee: 25, quManual: 280, quNoElectric: 310, quElectric: 360, quPneumatic: 290, quGear: 740, qvManual: 380, qvPneumatic: 630, qvGear: 810, qzManual: 280, qzPneumatic: 340, qzGear: 540, qb73X10C: 280, qb73X10G: 240, qb73X10P: 430, qb73X10RL: 540, qb573X10C: 780, qb573X10G: 740, qb573X10P: 910, qb573X10RL: 1020, qb673X10C: 410, qb673X10G: 370, qb673X10P: 530, qcManual: 780, qcPneumatic: 740, qcGear: 910, qyManual: 530, qyPneumatic: 890, qyGear: 1180, qjManual: 435, qjNoElectric: 520, qjElectric: 920, qjPneumatic: 550, qmg10Q: 420, qmg10RQ: 700, qmg10P: 775, qmg10R: 780, qmg10RL: 800, qwf10C: 1180, qwf10Q: 1450, qwf10P: 1450, qwf10RL: 1700, qmc10C: 530, qmc10P: 650, qmc10R: 785, qmc10RL: 805 },
        { size: 100, manual: 480, noElectric: 530, electric: 2165, pneumatic: 675, gear: 940, brandingFee: 25, quManual: 345, quNoElectric: 395, quElectric: 425, quPneumatic: 345, quGear: 790, qvManual: 440, qvPneumatic: 890, qvGear: 1180, qzManual: 370, qzPneumatic: 420, qzGear: 640, qb73X10C: 320, qb73X10G: 280, qb73X10P: 510, qb73X10RL: 640, qb573X10C: 820, qb573X10G: 780, qb573X10P: 990, qb573X10RL: 1130, qb673X10C: 460, qb673X10G: 410, qb673X10P: 610, qcManual: 880, qcPneumatic: 830, qcGear: 1130, qhManual: 1600, qhPneumatic: 2130, qhGear: 2365, qyManual: 680, qyPneumatic: 1160, qyGear: 1550, qca10C: 900, qca10P: 1680, qca10RL: 2050, qjManual: 485, qjNoElectric: 550, qjElectric: 600, qjPneumatic: 550, qmg10Q: 480, qmg10RQ: 1015, qmg10P: 1150, qmg10R: 1150, qmg10RL: 1190, qwf10C: 1280, qwf10Q: 1600, qwf10P: 1600, qwf10RL: 1920, qwl10C: 1380, qwl10P: 2180, qwl10R: 2500, qwl10RL: 2630, qmc10C: 800, qmc10P: 1095, qmc10R: 1280, qmc10RL: 1300 },
        { size: 125, manual: 600, noElectric: 650, electric: 2300, pneumatic: 815, gear: 1060, brandingFee: 25, quManual: 385, quNoElectric: 465, quElectric: 465, quPneumatic: 345, quGear: 830, qvManual: 530, qvPneumatic: 890, qvGear: 1180, qzManual: 430, qzPneumatic: 480, qzGear: 720, qb73X10C: 380, qb73X10G: 330, qb73X10P: 620, qb73X10RL: 770, qb573X10C: 880, qb573X10G: 830, qb573X10P: 1090, qb573X10RL: 1270, qb673X10C: 520, qb673X10G: 470, qb673X10P: 710, qcManual: 980, qcPneumatic: 920, qcGear: 1260, qhManual: 1700, qhPneumatic: 2290, qhGear: 2825, qyManual: 940, qyPneumatic: 1460, qyGear: 2270, qca10C: 1200, qca10P: 1680, qca10RL: 2400, qjManual: 750, qjNoElectric: 780, qjElectric: 800, qjPneumatic: 780, qjGear: 1120, qmg10Q: 560, qmg10RQ: 1015, qmg10P: 1150, qmg10R: 1150, qmg10RL: 1190, qwf10C: 1530, qwf10Q: 2000, qwf10P: 2000, qwf10RL: 2650, qwl10C: 1530, qwl10P: 2490, qwl10R: 2800, qwl10RL: 2890, qmc10C: 1080, qmc10P: 1510, qmc10R: 1890, qmc10RL: 1910 },
        { size: 150, manual: 765, noElectric: 815, electric: 2465, pneumatic: 1165, gear: 1210, brandingFee: 25, quManual: 425, quNoElectric: 555, quElectric: 655, quPneumatic: 595, quGear: 980, qvManual: 680, qvPneumatic: 1160, qvGear: 1550, qzManual: 590, qzPneumatic: 650, qzGear: 890, qb73X10C: 500, qb73X10G: 460, qb73X10P: 800, qb73X10RL: 940, qb573X10C: 980, qb573X10G: 920, qb573X10P: 1260, qb573X10RL: 1490, qb673X10C: 730, qb673X10G: 680, qb673X10P: 970, qcManual: 1160, qcPneumatic: 1080, qcGear: 1490, qhManual: 1850, qhPneumatic: 2510, qhGear: 3140, qyManual: 1350, qyPneumatic: 2400, qyGear: 3300, qca10C: 1560, qca10P: 2600, qca10RL: 3240, qjManual: 1035, qjNoElectric: 1100, qjElectric: 1500, qjPneumatic: 1200, qjGear: 1450, qmg10Q: 950, qmg10RQ: 1550, qmg10P: 1650, qmg10R: 1680, qmg10RL: 1750, qwf10C: 1845, qwf10Q: 2400, qwf10P: 2400, qwf10RL: 2980, qwl10C: 1850, qwl10P: 3020, qwl10R: 3510, qwl10RL: 3690, qmc10C: 1400, qmc10P: 1960, qmc10R: 2410, qmc10RL: 2440 },
        { size: 200, manual: 965, noElectric: 1060, electric: 2615, pneumatic: 1425, gear: 1425, brandingFee: 30, quManual: 645, quNoElectric: 1040, quElectric: 1015, quPneumatic: 745, quGear: 1120, qvManual: 940, qvPneumatic: 1460, qvGear: 2270, qzManual: 690, qzPneumatic: 760, qzGear: 1180, qb73X10C: 690, qb73X10G: 690, qb73X10P: 1140, qb73X10RL: 1480, qb573X10C: 1160, qb573X10G: 1080, qb573X10P: 1620, qb573X10RL: 1980, qb673X10C: 930, qb673X10G: 850, qb673X10P: 1300, qcManual: 1450, qcPneumatic: 1350, qcGear: 1850, qhManual: 2180, qhPneumatic: 2800, qhGear: 3840, qyManual: 1850, qyPneumatic: 3350, qyGear: 4700, qca10C: 2400, qca10P: 4200, qca10RL: 5350, qjManual: 1830, qjNoElectric: 1450, qjElectric: 1450, qjPneumatic: 1450, qjGear: 2345, qmg10Q: 1450, qmg10RQ: 2300, qmg10P: 2500, qmg10R: 2600, qmg10RL: 2800, qwf10C: 2050, qwf10Q: 2955, qwf10P: 2955, qwf10RL: 3980, qwl10C: 2520, qwl10P: 4230, qwl10R: 4945, qwl10RL: 5195, qmc10C: 1900, qmc10P: 2460, qmc10R: 2710, qmc10RL: 2750 },
        { size: 250, manual: 1365, noElectric: 1425, electric: 3165, pneumatic: 2045, gear: 1865, brandingFee: 50, quManual: 940, quNoElectric: 1225, quElectric: 1340, quPneumatic: 980, quGear: 1410, qvManual: 1350, qvPneumatic: 2400, qvGear: 3300, qzManual: 850, qzPneumatic: 950, qzGear: 1380, qcManual: 1850, qcPneumatic: 1750, qcGear: 2400, qhManual: 2660, qhPneumatic: 3720, qhGear: 4890, qyManual: 2850, qyPneumatic: 4900, qyGear: 6700, qca10C: 3600, qca10P: 6600, qca10RL: 9050, qjManual: 2200, qjNoElectric: 1950, qjElectric: 2600, qjPneumatic: 1950, qjGear: 2950, qmg10Q: 2050, qmg10RQ: 3500, qmg10P: 3800, qmg10R: 4000, qmg10RL: 4100, qwf10C: 2550, qwf10Q: 3550, qwf10P: 3550, qwf10RL: 4720, qwl10C: 3200, qwl10P: 5555, qwl10R: 6630, qwl10RL: 7050, qmc10C: 2800, qmc10P: 3750, qmc10R: 4610, qmc10RL: 4670 },
        { size: 300, manual: 2165, noElectric: 2240, electric: 3635, pneumatic: 2585, gear: 2350, brandingFee: 60, quManual: 1195, quNoElectric: 1400, quElectric: 1895, quPneumatic: 1195, quGear: 1750, qvManual: 1850, qvPneumatic: 3350, qvGear: 4700, qzManual: 1350, qzPneumatic: 1400, qzGear: 2200, qcManual: 2350, qcPneumatic: 2200, qcGear: 3100, qhManual: 3120, qhPneumatic: 4340, qhGear: 4890, qyManual: 2850, qyPneumatic: 4900, qyGear: 6700, qca10C: 4400, qca10P: 8800, qca10RL: 11500, qjManual: 2900, qjNoElectric: 2650, qjElectric: 3600, qjPneumatic: 2650, qjGear: 3770, qwf10C: 3050, qwf10Q: 4200, qwf10P: 4200, qwf10RL: 5300, qwl10C: 7300, qwl10P: 11355, qwl10R: 13555, qwl10RL: 14145 },
        { size: 350, manual: 2685, noElectric: 2685, electric: 4020, pneumatic: 3615, gear: 2670, brandingFee: 70, quManual: 1515, quNoElectric: 1230, quElectric: 2210, quPneumatic: 1510, quGear: 2150, qvManual: 2850, qvPneumatic: 4900, qvGear: 6700, qzManual: 1800, qzPneumatic: 1900, qzGear: 2900, qcManual: 2850, qcPneumatic: 2650, qcGear: 3700, qhManual: 3120, qhPneumatic: 4960, qhGear: 6890, qyManual: 2500, qyPneumatic: 4550, qyGear: 6350, qca10C: 5760, qca10P: 11300, qca10RL: 16200, qjManual: 3550, qjNoElectric: 3250, qjElectric: 4500, qjPneumatic: 3250, qjGear: 4720, qwf10C: 4350, qwf10Q: 5000, qwf10P: 5000, qwf10RL: 6300, qwl10C: 8280, qwl10P: 12670, qwl10R: 15230, qwl10RL: 15880 },
        { size: 400, manual: 2845, noElectric: 2920, electric: 4695, pneumatic: 4375, gear: 3350, brandingFee: 80, quManual: 2020, quNoElectric: 1880, quElectric: 3420, quPneumatic: 2020, quGear: 2600, qvManual: 3150, qvPneumatic: 5900, qvGear: 8250, qzManual: 2400, qzPneumatic: 2600, qzGear: 3800, qcManual: 3450, qcPneumatic: 3200, qcGear: 4500, qhManual: 3350, qhPneumatic: 5360, qhGear: 7710, qyManual: 3150, qyPneumatic: 5900, qyGear: 8250, qca10C: 7500, qca10P: 15300, qca10RL: 21300, qjManual: 3770, qjNoElectric: 4300, qjElectric: 5550, qjPneumatic: 4300, qjGear: 5620, qwf10C: 5080, qwf10Q: 6000, qwf10P: 6000, qwf10RL: 7550 },
        { size: 450, manual: 3995, noElectric: 3620, electric: 5145, pneumatic: 5145, gear: 4065, brandingFee: 100, quManual: 2020, quNoElectric: 1400, quElectric: 3800, quPneumatic: 2020, quGear: 3200, qvManual: 3150, qvPneumatic: 6300, qvGear: 8200, qzManual: 2400, qzPneumatic: 2600, qzGear: 3800, qcManual: 4050, qcPneumatic: 3750, qcGear: 5300, qhManual: 3560, qhPneumatic: 5640, qhGear: 7910, qyManual: 3150, qyPneumatic: 6300, qyGear: 8200 },
        { size: 500, manual: 5145, noElectric: 5145, electric: 7945, pneumatic: 8315, gear: 5515, brandingFee: 150, quManual: 2020, quNoElectric: 2140, quElectric: 7050, quPneumatic: 2320, quGear: 4450, qvManual: 3900, qvPneumatic: 6350, qvGear: 8200, qzManual: 2400, qzPneumatic: 2700, qzGear: 4100, qcManual: 5250, qcPneumatic: 4900, qcGear: 6800, qhManual: 4630, qhPneumatic: 6520, qhGear: 10025, qyManual: 3900, qyPneumatic: 6350, qyGear: 8200 },
        { size: 600, manual: 7940, noElectric: 7940, electric: 10740, pneumatic: 12600, gear: 8399, brandingFee: 250, quManual: 2020, quNoElectric: 1450, quElectric: 8700, quPneumatic: 3220, quGear: 6400, qvManual: 7500, qvPneumatic: 11000, qvGear: 16850, qzManual: 3900, qzPneumatic: 4000, qzGear: 5700, qcManual: 7250, qcPneumatic: 6750, qcGear: 9500, qhManual: 7150, qhPneumatic: 9380, qhGear: 15170, qyManual: 7500, qyPneumatic: 11000, qyGear: 16850 },
        { size: 700, manual: 10740, noElectric: 10740, electric: 13275, pneumatic: 15630, gear: 10865, brandingFee: 450, quManual: 500, quNoElectric: 30, quElectric: 8700, quPneumatic: 500, quGear: 8500, qvManual: 13500, qvPneumatic: 19050, qvGear: 29650, qzManual: 6400, qzPneumatic: 6500, qzGear: 8900, qcManual: 10250, qcPneumatic: 9550, qcGear: 13500, qhManual: 12000, qhPneumatic: 14500, qhGear: 21000, qyManual: 13500, qyPneumatic: 19050, qyGear: 29650 },
        { size: 800, manual: 13275, noElectric: 13275, electric: 17265, pneumatic: 19300, gear: 15195, brandingFee: 650, quManual: 612, quNoElectric: 1820, quElectric: 8700, quPneumatic: 612, quGear: 11400, qvManual: 20000, qvPneumatic: 30000, qvGear: 43000, qzManual: 9500, qzPneumatic: 9600, qzGear: 13100, qcManual: 13250, qcPneumatic: 12350, qcGear: 17400, qhManual: 13200, qhPneumatic: 15800, qhGear: 23130, qyManual: 20000, qyPneumatic: 30000, qyGear: 43000 },
        { size: 900, manual: 17265, noElectric: 17265, brandingFee: 900, quManual: 612, quNoElectric: 14580, quPneumatic: 612, quGear: 14800, qvManual: 23000, qvPneumatic: 33000, qvGear: 47000, qzManual: 13500, qzPneumatic: 13600, qzGear: 18700, qcManual: 16250, qcPneumatic: 15150, qcGear: 21400, qhManual: 13900, qhPneumatic: 16600, qhGear: 24460, qyManual: 23000, qyPneumatic: 33000, qyGear: 47000 },
        { size: 1000, manual: 21165, noElectric: 14100, brandingFee: 1000, quManual: 612, quNoElectric: 19820, quPneumatic: 612, quGear: 19500, qvManual: 24200, qvPneumatic: 37500, qvGear: 56100, qzManual: 18000, qzPneumatic: 18100, qzGear: 25000, qcManual: 19250, qcPneumatic: 17950, qcGear: 25400, qhManual: 15000, qhPneumatic: 17900, qhGear: 26650, qyManual: 24200, qyPneumatic: 37500, qyGear: 56100 }
    ]
};

async function importPrices() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'CXH&cw9999',
        database: 'quotation_system'
    });

    console.log('=== 开始导入价格数据 ===\n');

    let importCount = 0;
    let skipCount = 0;

    // 价格字段映射
    const priceFields = {
        'manual': 'manual_price',
        'noElectric': 'manual_price',
        'electric': 'electric_price',
        'pneumatic': 'pneumatic_price',
        'gear': 'gear_price',
        'quManual': 'manual_price',
        'quNoElectric': 'manual_price',
        'quElectric': 'electric_price',
        'quPneumatic': 'pneumatic_price',
        'quGear': 'gear_price',
        'qvManual': 'manual_price',
        'qvPneumatic': 'pneumatic_price',
        'qvGear': 'gear_price',
        'qzManual': 'manual_price',
        'qzPneumatic': 'pneumatic_price',
        'qzGear': 'gear_price',
        'qb73X10C': 'manual_price',
        'qb73X10G': 'manual_price',
        'qb73X10P': 'manual_price',
        'qb73X10RL': 'manual_price',
        'qb573X10C': 'gear_price',
        'qb573X10G': 'gear_price',
        'qb573X10P': 'gear_price',
        'qb573X10RL': 'gear_price',
        'qb673X10C': 'pneumatic_price',
        'qb673X10G': 'pneumatic_price',
        'qb673X10P': 'pneumatic_price',
        'qcManual': 'manual_price',
        'qcPneumatic': 'pneumatic_price',
        'qcGear': 'gear_price',
        'qhManual': 'manual_price',
        'qhPneumatic': 'pneumatic_price',
        'qhGear': 'gear_price',
        'qyManual': 'manual_price',
        'qyPneumatic': 'pneumatic_price',
        'qyGear': 'gear_price',
        'qca10C': 'manual_price',
        'qca10P': 'manual_price',
        'qca10RL': 'manual_price',
        'qjManual': 'manual_price',
        'qjNoElectric': 'manual_price',
        'qjElectric': 'electric_price',
        'qjPneumatic': 'pneumatic_price',
        'qjGear': 'gear_price',
        'qmg10Q': 'manual_price',
        'qmg10RQ': 'manual_price',
        'qmg10P': 'manual_price',
        'qmg10R': 'manual_price',
        'qmg10RL': 'manual_price',
        'qmc10C': 'manual_price',
        'qmc10P': 'manual_price',
        'qmc10R': 'manual_price',
        'qmc10RL': 'manual_price',
        'qwf10C': 'manual_price',
        'qwf10Q': 'manual_price',
        'qwf10P': 'manual_price',
        'qwf10RL': 'manual_price',
        'qwl10C': 'manual_price',
        'qwl10P': 'manual_price',
        'qwl10R': 'manual_price',
        'qwl10RL': 'manual_price'
    };

    for (const priceItem of priceData.sizes) {
        const size = priceItem.size;
        const brandingFee = priceItem.brandingFee || 0;
        
        // 计算起订量
        let minOrderQty = 1;
        if (size >= 50 && size <= 200) minOrderQty = 50;
        else if (size >= 250 && size <= 400) minOrderQty = 30;
        else if (size >= 450 && size <= 600) minOrderQty = 6;
        else if (size >= 700) minOrderQty = 2;

        // 处理每个价格字段
        for (const [field, value] of Object.entries(priceItem)) {
            if (field === 'size' || field === 'brandingFee' || value === null || value === undefined) {
                continue;
            }

            // 查找对应的型号
            const [models] = await connection.execute(
                'SELECT id, name FROM valve_models WHERE type_code = ?',
                [field]
            );

            if (models.length === 0) {
                skipCount++;
                continue;
            }

            const model = models[0];
            const priceField = priceFields[field] || 'manual_price';

            try {
                await connection.execute(
                    `INSERT INTO price_table (model_id, size, ${priceField}, branding_fee, min_order_qty, status) 
                     VALUES (?, ?, ?, ?, ?, 'enabled')
                     ON DUPLICATE KEY UPDATE ${priceField} = VALUES(${priceField}), branding_fee = VALUES(branding_fee)`,
                    [model.id, size, value, brandingFee, minOrderQty]
                );
                importCount++;
            } catch (err) {
                console.error(`  ✗ ${model.name} DN${size}: ${err.message}`);
            }
        }
    }

    console.log(`\n导入完成:`);
    console.log(`  ✓ 成功: ${importCount} 条`);
    console.log(`  - 跳过: ${skipCount} 条`);

    // 验证
    const [result] = await connection.execute('SELECT COUNT(*) as count FROM price_table');
    console.log(`\n数据库中共有 ${result[0].count} 条价格记录`);

    await connection.end();
}

importPrices().catch(err => {
    console.error('导入失败:', err);
    process.exit(1);
});
