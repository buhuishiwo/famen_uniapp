const mysql = require('mysql2/promise');
const fs = require('fs');

// 从前端代码中提取的数据
const seriesValveTypes = {
    'QB系列': [
        { id: 1, name: 'QBZ73X-10C', type: 'qb73X10C' },
        { id: 2, name: 'QBZ73X-10G', type: 'qb73X10G' },
        { id: 3, name: 'QBZ73X-10P', type: 'qb73X10P' },
        { id: 4, name: 'QBZ73X-10RL', type: 'qb73X10RL' },
        { id: 5, name: 'QBZ573X-10C', type: 'qb573X10C' },
        { id: 6, name: 'QBZ573X-10G', type: 'qb573X10G' },
        { id: 7, name: 'QBZ573X-10P', type: 'qb573X10P' },
        { id: 8, name: 'QBZ573X-10RL', type: 'qb573X10RL' },
        { id: 9, name: 'QBZ673X-10C', type: 'qb673X10C' },
        { id: 10, name: 'QBZ673X-10G', type: 'qb673X10G' },
        { id: 11, name: 'QBZ673X-10P', type: 'qb673X10P' }
    ],
    'QC系列': [
        { id: 1, name: 'QCZ673X-10C (手动)', type: 'qcManual' },
        { id: 4, name: 'QCZ673X-10C (气动)', type: 'qcPneumatic' },
        { id: 5, name: 'QCZ573X-10C (伞齿轮)', type: 'qcGear' }
    ],
    'QD系列': [
        { id: 1, name: 'QDZ73NM-10Q (手动)', type: 'manual' },
        { id: 2, name: 'QDZ973NM-10Q (无电装)', type: 'noElectric' },
        { id: 3, name: 'QDZ973NM-10Q (电装)', type: 'electric' },
        { id: 4, name: 'QDZ673NM-10Q (含双作用气缸)', type: 'pneumatic' },
        { id: 5, name: 'QDZ573NM-10Q (伞齿轮)', type: 'gear' }
    ],
    'QH系列': [
        { id: 1, name: 'QHQ673X-10C (手动)', type: 'qhManual' },
        { id: 4, name: 'QHQ673X-10C (气动)', type: 'qhPneumatic' },
        { id: 5, name: 'QHQ573X-10C (伞齿轮)', type: 'qhGear' }
    ],
    'QJ系列': [
        { id: 1, name: 'QJZ73X-10G (手动)', type: 'qjManual' },
        { id: 2, name: 'QJZ973X-10Q (无电装)', type: 'qjNoElectric' },
        { id: 3, name: 'QJZ973X-10Q (电装)', type: 'qjElectric' },
        { id: 4, name: 'QJZ673X-10Q (气动)', type: 'qjPneumatic' },
        { id: 5, name: 'QJZ573X-10Q (伞齿轮)', type: 'qjGear' }
    ],
    'QP系列': [
        { id: 1, name: 'QPZ73NM-10Q (手动)', type: 'manual' },
        { id: 2, name: 'QPZ973NM-10Q (无电装)', type: 'noElectric' },
        { id: 3, name: 'QPZ973NM-10Q (电装)', type: 'electric' },
        { id: 4, name: 'QPZ673NM-10Q (含双作用气缸)', type: 'pneumatic' },
        { id: 5, name: 'QPZ573NM-10Q (伞齿轮)', type: 'gear' }
    ],
    'QS系列': [
        { id: 1, name: 'QSZ73NM-10Q (手动)', type: 'manual' },
        { id: 2, name: 'QSZ973NM-10Q (无电装)', type: 'noElectric' },
        { id: 3, name: 'QSZ973NM-10Q (电装)', type: 'electric' },
        { id: 4, name: 'QSZ673NM-10Q (含双作用气缸)', type: 'pneumatic' },
        { id: 5, name: 'QSZ573NM-10Q (伞齿轮)', type: 'gear' }
    ],
    'QU系列': [
        { id: 1, name: 'QUZ73X-10G (手动)', type: 'quManual' },
        { id: 2, name: 'QUZ973X-10G (无电装)', type: 'quNoElectric' },
        { id: 3, name: 'QUZ973X-10G (电装)', type: 'quElectric' },
        { id: 4, name: 'QUZ673X-10G (气动)', type: 'quPneumatic' },
        { id: 5, name: 'QUZ573X-10G (伞齿轮)', type: 'quGear' }
    ],
    'QV系列': [
        { id: 1, name: 'QVZ73X-10C (手动)', type: 'qvManual' },
        { id: 4, name: 'QVZ673X-10C (气动)', type: 'qvPneumatic' },
        { id: 5, name: 'QVZ573X-10C (伞齿轮)', type: 'qvGear' }
    ],
    'QY系列': [
        { id: 1, name: 'QYZ73X-10C (手动)', type: 'qyManual' },
        { id: 4, name: 'QYZ673X-10C (气动)', type: 'qyPneumatic' },
        { id: 5, name: 'QYZ573X-10C (伞齿轮)', type: 'qyGear' }
    ],
    'QCA系列': [
        { id: 1, name: 'QCAZ74X-10C', type: 'qca10C' },
        { id: 2, name: 'QCAZ74X-10P', type: 'qca10P' },
        { id: 3, name: 'QCAZ74X-10RL', type: 'qca10RL' }
    ],
    'QCB系列': [
        { id: 1, name: 'QCBZ673X-10C (手动)', type: 'qcManual' },
        { id: 4, name: 'QCBZ673X-10C (气动)', type: 'qcPneumatic' },
        { id: 5, name: 'QCBZ573X-10C (伞齿轮)', type: 'qcGear' }
    ],
    'QCG系列': [
        { id: 1, name: 'QCGZ673X-10C (手动)', type: 'qcManual' },
        { id: 4, name: 'QCGZ673X-10C (气动)', type: 'qcPneumatic' },
        { id: 5, name: 'QCGZ573X-10C (伞齿轮)', type: 'qcGear' }
    ],
    'QMB系列': [
        { id: 1, name: 'QMBZ73NM-10Q (手动)', type: 'manual' },
        { id: 2, name: 'QMBZ973NM-10Q (无电装)', type: 'noElectric' },
        { id: 3, name: 'QMBZ973NM-10Q (电装)', type: 'electric' },
        { id: 4, name: 'QMBZ673NM-10Q (含双作用气缸)', type: 'pneumatic' },
        { id: 5, name: 'QMBZ573NM-10Q (伞齿轮)', type: 'gear' }
    ],
    'QMG系列': [
        { id: 1, name: 'QMGZ73X-10Q', type: 'qmg10Q' },
        { id: 2, name: 'QMGZ73X-10RQ', type: 'qmg10RQ' },
        { id: 3, name: 'QMGZ73X-10P', type: 'qmg10P' },
        { id: 4, name: 'QMGZ73X-10R', type: 'qmg10R' },
        { id: 5, name: 'QMGZ73X-10RL', type: 'qmg10RL' }
    ],
    'QMC系列': [
        { id: 1, name: 'QMCZ73X-10C', type: 'qmc10C' },
        { id: 2, name: 'QMCZ73X-10P', type: 'qmc10P' },
        { id: 3, name: 'QMCZ73X-10R', type: 'qmc10R' },
        { id: 4, name: 'QMCZ73X-10RL', type: 'qmc10RL' }
    ],
    'QVY系列': [
        { id: 1, name: 'QVYZ73NM-10Q (手动)', type: 'manual' },
        { id: 2, name: 'QVYZ973NM-10Q (无电装)', type: 'noElectric' },
        { id: 3, name: 'QVYZ973NM-10Q (电装)', type: 'electric' },
        { id: 4, name: 'QVYZ673NM-10Q (含双作用气缸)', type: 'pneumatic' },
        { id: 5, name: 'QVYZ573NM-10Q (伞齿轮)', type: 'gear' }
    ],
    'QW系列': [
        { id: 1, name: 'QWZ73NR-10G (手动)', type: 'manual' },
        { id: 2, name: 'QWZ73NR-10G (无电装)', type: 'noElectric' },
        { id: 3, name: 'QWZ973NR-10G (电装)', type: 'electric' },
        { id: 4, name: 'QWZ673NR-10G (气动)', type: 'pneumatic' },
        { id: 5, name: 'QWZ573NR-10G (伞齿轮)', type: 'gear' }
    ],
    'QWL系列': [
        { id: 1, name: 'QWLZ73NM-10Q (手动)', type: 'manual' },
        { id: 2, name: 'QWLZ973NM-10Q (无电装)', type: 'noElectric' },
        { id: 3, name: 'QWLZ973NM-10Q (电装)', type: 'electric' },
        { id: 4, name: 'QWLZ673NM-10Q (含双作用气缸)', type: 'pneumatic' },
        { id: 5, name: 'QWLZ573NM-10Q (伞齿轮)', type: 'gear' }
    ],
    'QWY系列': [
        { id: 1, name: 'QWYZ73NM-10Q (手动)', type: 'manual' },
        { id: 2, name: 'QWYZ73NM-10Q (无电装)', type: 'noElectric' },
        { id: 3, name: 'QWYZ973NM-10Q (电装)', type: 'electric' },
        { id: 4, name: 'QWYZ673NM-10Q (含双作用气缸)', type: 'pneumatic' },
        { id: 5, name: 'QWYZ573NM-10Q (伞齿轮)', type: 'gear' }
    ],
    'QYA系列': [
        { id: 1, name: 'QYAZ73NM-10Q (手动)', type: 'manual' },
        { id: 2, name: 'QYAZ973NM-10Q (无电装)', type: 'noElectric' },
        { id: 3, name: 'QYAZ973NM-10Q (电装)', type: 'electric' },
        { id: 4, name: 'QYAZ673NM-10Q (含双作用气缸)', type: 'pneumatic' },
        { id: 5, name: 'QYAZ573NM-10Q (伞齿轮)', type: 'gear' }
    ],
    'QMDY系列': [
        { id: 1, name: 'QMDYZ73NM-10Q (手动)', type: 'manual' },
        { id: 2, name: 'QMDYZ973NM-10Q (无电装)', type: 'noElectric' },
        { id: 3, name: 'QMDYZ973NM-10Q (电装)', type: 'electric' },
        { id: 4, name: 'QMDYZ673NM-10Q (含双作用气缸)', type: 'pneumatic' },
        { id: 5, name: 'QMDYZ573NM-10Q (伞齿轮)', type: 'gear' }
    ],
    'QUP系列': [
        { id: 1, name: 'QUPZ73X-10G (手动)', type: 'quManual' },
        { id: 2, name: 'QUPZ973X-10G (无电装)', type: 'quNoElectric' },
        { id: 3, name: 'QUPZ973X-10G (电装)', type: 'quElectric' },
        { id: 4, name: 'QUPZ673X-10G (气动)', type: 'quPneumatic' },
        { id: 5, name: 'QUPZ573X-10G (伞齿轮)', type: 'quGear' }
    ],
    'QWF系列': [
        { id: 1, name: 'QWFZ73NM-10C', type: 'qwf10C' },
        { id: 2, name: 'QWFZ73NM-10Q', type: 'qwf10Q' },
        { id: 3, name: 'QWFZ73NM-10P', type: 'qwf10P' },
        { id: 4, name: 'QWFZ73NM-10RL', type: 'qwf10RL' }
    ],
    'QWLY系列': [
        { id: 1, name: 'QWLYZ73NM-10Q (手动)', type: 'manual' },
        { id: 2, name: 'QWLYZ973NM-10Q (无电装)', type: 'noElectric' },
        { id: 3, name: 'QWLYZ973NM-10Q (电装)', type: 'electric' },
        { id: 4, name: 'QWLYZ673NM-10Q (含双作用气缸)', type: 'pneumatic' },
        { id: 5, name: 'QWLYZ573NM-10Q (伞齿轮)', type: 'gear' }
    ]
};

async function importData() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'CXH&cw9999',
        database: 'quotation_system'
    });

    console.log('=== 开始导入数据 ===\n');

    // 1. 导入阀门型号
    console.log('1. 导入阀门型号数据...');
    let modelCount = 0;
    
    for (const [seriesName, models] of Object.entries(seriesValveTypes)) {
        // 获取系列ID
        const [seriesRows] = await connection.execute(
            'SELECT id FROM product_series WHERE name = ?',
            [seriesName]
        );
        
        if (seriesRows.length === 0) {
            console.log(`  警告: 系列 ${seriesName} 不存在，跳过`);
            continue;
        }
        
        const seriesId = seriesRows[0].id;
        
        for (const model of models) {
            await connection.execute(
                `INSERT INTO valve_models (series_id, name, type_code) 
                 VALUES (?, ?, ?) 
                 ON DUPLICATE KEY UPDATE name = VALUES(name)`,
                [seriesId, model.name, model.type]
            );
            modelCount++;
        }
        
        console.log(`  ✓ ${seriesName}: ${models.length} 个型号`);
    }
    
    console.log(`  总计导入 ${modelCount} 个阀门型号\n`);

    // 2. 导入价格数据
    console.log('2. 导入价格数据...');
    console.log('  注意: 价格数据需要从Excel文件导入，请使用后端API导入功能');
    console.log('  API地址: POST http://localhost:3000/api/quotations/import\n');

    // 查询验证
    const [models] = await connection.execute('SELECT COUNT(*) as count FROM valve_models');
    const [series] = await connection.execute('SELECT COUNT(*) as count FROM product_series');
    
    console.log('=== 导入完成 ===');
    console.log(`产品系列: ${series[0].count} 个`);
    console.log(`阀门型号: ${models[0].count} 个`);
    
    await connection.end();
}

importData().catch(err => {
    console.error('导入失败:', err);
    process.exit(1);
});
