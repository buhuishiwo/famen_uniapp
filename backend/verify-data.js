const mysql = require('mysql2/promise');

async function verifyData() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'CXH&cw9999',
        database: 'quotation_system'
    });

    console.log('=== 数据导入验证报告 ===\n');

    // 1. 产品系列统计
    const [series] = await connection.execute('SELECT COUNT(*) as count FROM product_series');
    console.log(`1. 产品系列: ${series[0].count} 个`);

    // 2. 阀门型号统计
    const [models] = await connection.execute(`
        SELECT 
            ps.name as series_name,
            COUNT(vm.id) as model_count
        FROM product_series ps
        LEFT JOIN valve_models vm ON ps.id = vm.series_id
        GROUP BY ps.id
        ORDER BY model_count DESC
        LIMIT 10
    `);
    
    console.log('\n2. 阀门型号统计 (前10个系列):');
    let totalModels = 0;
    for (const row of models) {
        console.log(`   ${row.series_name}: ${row.model_count} 个型号`);
        totalModels += row.model_count;
    }

    // 3. 价格数据统计
    const [prices] = await connection.execute('SELECT COUNT(*) as count FROM price_table');
    console.log(`\n3. 价格数据: ${prices[0].count} 条记录`);

    // 4. 价格数据详情示例
    const [priceDetails] = await connection.execute(`
        SELECT 
            vm.name as model_name,
            pt.size,
            pt.manual_price,
            pt.pneumatic_price,
            pt.electric_price,
            pt.gear_price,
            pt.branding_fee,
            pt.min_order_qty
        FROM price_table pt
        JOIN valve_models vm ON pt.model_id = vm.id
        WHERE pt.manual_price IS NOT NULL
        ORDER BY pt.size
        LIMIT 5
    `);

    console.log('\n4. 价格数据示例 (前5条):');
    for (const row of priceDetails) {
        console.log(`   ${row.model_name} DN${row.size}:`);
        console.log(`      手动价: ¥${row.manual_price || '-'}`);
        console.log(`      气动价: ¥${row.pneumatic_price || '-'}`);
        console.log(`      电装价: ¥${row.electric_price || '-'}`);
        console.log(`      齿轮价: ¥${row.gear_price || '-'}`);
        console.log(`      磨标费: ¥${row.branding_fee}, 起订量: ${row.min_order_qty}`);
    }

    // 5. 数据完整性检查
    const [orphanPrices] = await connection.execute(`
        SELECT COUNT(*) as count 
        FROM price_table pt
        LEFT JOIN valve_models vm ON pt.model_id = vm.id
        WHERE vm.id IS NULL
    `);
    
    console.log('\n5. 数据完整性检查:');
    console.log(`   孤立价格记录: ${orphanPrices[0].count} 条`);

    // 6. 尺寸范围统计
    const [sizeRange] = await connection.execute(`
        SELECT 
            MIN(size) as min_size,
            MAX(size) as max_size,
            COUNT(DISTINCT size) as size_count
        FROM price_table
    `);
    
    console.log('\n6. 尺寸范围:');
    console.log(`   最小尺寸: DN${sizeRange[0].min_size}`);
    console.log(`   最大尺寸: DN${sizeRange[0].max_size}`);
    console.log(`   尺寸种类: ${sizeRange[0].size_count} 种`);

    await connection.end();
    
    console.log('\n=== 验证完成 ===');
}

verifyData().catch(err => {
    console.error('验证失败:', err);
    process.exit(1);
});
