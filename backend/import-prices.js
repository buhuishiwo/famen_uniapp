const mysql = require('mysql2/promise');

// 价格数据映射关系
const priceFieldMapping = {
    // 通用字段
    'manual': 'manual_price',
    'pneumatic': 'pneumatic_price',
    'electric': 'electric_price',
    'gear': 'gear_price',
    'brandingFee': 'branding_fee',
    
    // QU系列
    'quManual': 'manual_price',
    'quPneumatic': 'pneumatic_price',
    'quElectric': 'electric_price',
    'quGear': 'gear_price',
    
    // QV系列
    'qvManual': 'manual_price',
    'qvPneumatic': 'pneumatic_price',
    'qvGear': 'gear_price',
    
    // QZ系列
    'qzManual': 'manual_price',
    'qzPneumatic': 'pneumatic_price',
    'qzGear': 'gear_price',
    
    // QB系列
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
    
    // QC系列
    'qcManual': 'manual_price',
    'qcPneumatic': 'pneumatic_price',
    'qcGear': 'gear_price',
    
    // QH系列
    'qhManual': 'manual_price',
    'qhPneumatic': 'pneumatic_price',
    'qhGear': 'gear_price',
    
    // QY系列
    'qyManual': 'manual_price',
    'qyPneumatic': 'pneumatic_price',
    'qyGear': 'gear_price',
    
    // QCA系列
    'qca10C': 'manual_price',
    'qca10P': 'manual_price',
    'qca10RL': 'manual_price',
    
    // QJ系列
    'qjManual': 'manual_price',
    'qjPneumatic': 'pneumatic_price',
    'qjElectric': 'electric_price',
    'qjGear': 'gear_price',
    
    // QMG系列
    'qmg10Q': 'manual_price',
    'qmg10RQ': 'manual_price',
    'qmg10P': 'manual_price',
    'qmg10R': 'manual_price',
    'qmg10RL': 'manual_price',
    
    // QMC系列
    'qmc10C': 'manual_price',
    'qmc10P': 'manual_price',
    'qmc10R': 'manual_price',
    'qmc10RL': 'manual_price',
    
    // QWF系列
    'qwf10C': 'manual_price',
    'qwf10Q': 'manual_price',
    'qwf10P': 'manual_price',
    'qwf10RL': 'manual_price',
    
    // QWL系列
    'qwl10C': 'manual_price',
    'qwl10P': 'manual_price',
    'qwl10R': 'manual_price',
    'qwl10RL': 'manual_price'
};

// 型号到type_code的映射
const modelTypeMapping = {
    'QB系列': {
        'QBZ73X-10C': 'qb73X10C',
        'QBZ73X-10G': 'qb73X10G',
        'QBZ73X-10P': 'qb73X10P',
        'QBZ73X-10RL': 'qb73X10RL',
        'QBZ573X-10C': 'qb573X10C',
        'QBZ573X-10G': 'qb573X10G',
        'QBZ573X-10P': 'qb573X10P',
        'QBZ573X-10RL': 'qb573X10RL',
        'QBZ673X-10C': 'qb673X10C',
        'QBZ673X-10G': 'qb673X10G',
        'QBZ673X-10P': 'qb673X10P'
    }
};

async function importPriceData() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'CXH&cw9999',
        database: 'quotation_system'
    });

    console.log('=== 开始导入价格数据 ===\n');

    // 读取价格数据JSON文件
    const priceData = require('./price-data.json');
    
    let importCount = 0;
    let skipCount = 0;

    for (const priceItem of priceData.sizes) {
        const size = priceItem.size;
        const brandingFee = priceItem.brandingFee || 0;
        
        // 获取所有型号的价格
        for (const [field, value] of Object.entries(priceItem)) {
            if (field === 'size' || field === 'brandingFee' || value === null) {
                continue;
            }
            
            // 查找对应的型号
            const [models] = await connection.execute(
                'SELECT id, name, series_id FROM valve_models WHERE type_code = ?',
                [field]
            );
            
            if (models.length === 0) {
                skipCount++;
                continue;
            }
            
            const model = models[0];
            const priceField = priceFieldMapping[field] || 'manual_price';
            
            // 计算起订量
            let minOrderQty = 1;
            if (size >= 50 && size <= 200) minOrderQty = 50;
            else if (size >= 250 && size <= 400) minOrderQty = 30;
            else if (size >= 450 && size <= 600) minOrderQty = 6;
            else if (size >= 700) minOrderQty = 2;
            
            // 插入价格数据
            try {
                await connection.execute(
                    `INSERT INTO price_table (model_id, size, ${priceField}, branding_fee, min_order_qty, status) 
                     VALUES (?, ?, ?, ?, ?, 'enabled')
                     ON DUPLICATE KEY UPDATE ${priceField} = VALUES(${priceField}), branding_fee = VALUES(branding_fee)`,
                    [model.id, size, value, brandingFee, minOrderQty]
                );
                importCount++;
            } catch (err) {
                console.error(`导入失败: ${model.name} DN${size} - ${err.message}`);
            }
        }
    }

    console.log(`导入完成: ${importCount} 条价格数据`);
    console.log(`跳过: ${skipCount} 条未匹配的数据`);
    
    // 验证
    const [result] = await connection.execute('SELECT COUNT(*) as count FROM price_table');
    console.log(`\n数据库中共有 ${result[0].count} 条价格记录`);
    
    await connection.end();
}

importPriceData().catch(err => {
    console.error('导入失败:', err);
    process.exit(1);
});
