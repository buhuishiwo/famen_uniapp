-- ==============================================================
-- 价格表结构迁移脚本
-- 功能：将四个细分价格字段（手动、气动、电装、伞齿轮）合并为一个统一价格字段
-- 创建日期：2026-07-13
-- 操作步骤：
--   1. 备份原表结构和数据
--   2. 添加新字段 `price`
--   3. 执行数据迁移
--   4. 验证数据一致性
--   5. 可选：删除旧字段
-- ==============================================================

USE quotation_system;

-- ==============================================================
-- 第一部分：备份数据
-- ==============================================================

-- 1.1 备份原表结构
DROP TABLE IF EXISTS price_table_backup_20260713;
CREATE TABLE price_table_backup_20260713 AS SELECT * FROM price_table;

-- 1.2 验证备份数据
SELECT COUNT(*) AS original_count FROM price_table;
SELECT COUNT(*) AS backup_count FROM price_table_backup_20260713;

-- ==============================================================
-- 第二部分：添加新字段
-- ==============================================================

-- 2.1 添加统一价格字段
ALTER TABLE price_table 
ADD COLUMN `price` decimal(12,2) DEFAULT NULL COMMENT '统一价格' AFTER `size`;

-- ==============================================================
-- 第三部分：数据迁移
-- ==============================================================

-- 3.1 执行数据迁移
-- 优先级：手动价格 > 气动价格 > 电装价格 > 伞齿轮价格
-- 取第一个非零值作为统一价格
UPDATE price_table 
SET price = COALESCE(
    NULLIF(manual_price, 0),
    NULLIF(pneumatic_price, 0),
    NULLIF(electric_price, 0),
    NULLIF(gear_price, 0)
);

-- 3.2 验证迁移结果
SELECT 
    COUNT(*) AS total_records,
    SUM(CASE WHEN price IS NOT NULL THEN 1 ELSE 0 END) AS migrated_records,
    SUM(CASE WHEN price IS NULL THEN 1 ELSE 0 END) AS no_price_records
FROM price_table;

-- 3.3 查看迁移详情（随机抽样10条）
SELECT 
    id,
    model_id,
    size,
    price AS new_price,
    manual_price,
    pneumatic_price,
    electric_price,
    gear_price
FROM price_table 
ORDER BY RAND() 
LIMIT 10;

-- ==============================================================
-- 第四部分：删除旧字段（可选，建议在验证通过后执行）
-- ==============================================================

-- 4.1 删除四个细分价格字段
-- ALTER TABLE price_table
-- DROP COLUMN manual_price,
-- DROP COLUMN pneumatic_price,
-- DROP COLUMN electric_price,
-- DROP COLUMN gear_price;

-- ==============================================================
-- 第五部分：恢复方案（如果迁移失败，执行以下脚本回滚）
-- ==============================================================

-- 5.1 删除新字段（如果已添加）
-- ALTER TABLE price_table DROP COLUMN price;

-- 5.2 从备份恢复数据
-- TRUNCATE TABLE price_table;
-- INSERT INTO price_table SELECT * FROM price_table_backup_20260713;

-- ==============================================================
-- 第六部分：数据完整性检查
-- ==============================================================

-- 6.1 检查是否有数据丢失
SELECT 
    '原表记录数' AS check_item, 
    COUNT(*) AS value 
FROM price_table
UNION ALL
SELECT 
    '备份表记录数' AS check_item, 
    COUNT(*) AS value 
FROM price_table_backup_20260713
UNION ALL
SELECT 
    '迁移后有价格记录数' AS check_item, 
    SUM(CASE WHEN price > 0 THEN 1 ELSE 0 END) AS value 
FROM price_table;

-- 6.2 检查迁移前后数据一致性
SELECT 
    p.id,
    p.price AS migrated_price,
    COALESCE(
        NULLIF(b.manual_price, 0),
        NULLIF(b.pneumatic_price, 0),
        NULLIF(b.electric_price, 0),
        NULLIF(b.gear_price, 0)
    ) AS expected_price,
    CASE 
        WHEN p.price = COALESCE(
            NULLIF(b.manual_price, 0),
            NULLIF(b.pneumatic_price, 0),
            NULLIF(b.electric_price, 0),
            NULLIF(b.gear_price, 0)
        ) THEN '一致'
        ELSE '不一致'
    END AS check_result
FROM price_table p
JOIN price_table_backup_20260713 b ON p.id = b.id
WHERE p.price != COALESCE(
    NULLIF(b.manual_price, 0),
    NULLIF(b.pneumatic_price, 0),
    NULLIF(b.electric_price, 0),
    NULLIF(b.gear_price, 0)
)
LIMIT 20;

-- ==============================================================
-- 执行完毕
-- ==============================================================
-- 注意事项：
-- 1. 执行前请确保已备份数据库
-- 2. 建议先在测试环境验证迁移结果
-- 3. 删除旧字段前请确认所有应用已更新
-- 4. 备份表保留7天后可删除
-- ==============================================================
