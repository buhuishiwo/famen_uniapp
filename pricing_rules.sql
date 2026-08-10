-- 报价规则引擎数据库表结构
-- 用于替代原有的固定报价规则，支持管理员自定义报价规则
--
-- 注意：CloudBase TDSQL 控制台一次只能执行一条 SQL 语句
-- 请逐条执行下面的每一条 CREATE TABLE / INSERT 语句

-- ============================================
-- 表1: 规则分组表（请单独执行）
-- ============================================
CREATE TABLE IF NOT EXISTS pricing_rule_groups (
  id INT AUTO_INCREMENT PRIMARY KEY,
  group_name VARCHAR(100) NOT NULL COMMENT '规则组名称',
  description TEXT COMMENT '规则组描述',
  priority INT DEFAULT 100 COMMENT '优先级，数字越小越先执行',
  is_enabled TINYINT DEFAULT 1 COMMENT '是否启用',
  is_system TINYINT DEFAULT 0 COMMENT '是否系统内置（不可删除）',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_enabled (is_enabled),
  INDEX idx_priority (priority)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='报价规则分组表';

-- ============================================
-- 表2: 规则条件表（请单独执行）
-- ============================================
CREATE TABLE IF NOT EXISTS pricing_rule_conditions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  group_id INT NOT NULL COMMENT '所属规则组ID',
  condition_type VARCHAR(50) NOT NULL COMMENT '条件类型: series/product_name/dn_range/quantity_range/product_type/material/custom',
  condition_value TEXT NOT NULL COMMENT '条件值(JSON格式字符串)',
  logic_operator VARCHAR(10) DEFAULT 'AND' COMMENT '与/或(AND/OR)',
  sort_order INT DEFAULT 0 COMMENT '排序顺序',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  INDEX idx_group_id (group_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='报价规则条件表';

-- ============================================
-- 表3: 规则动作表（请单独执行）
-- ============================================
CREATE TABLE IF NOT EXISTS pricing_rule_actions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  group_id INT NOT NULL COMMENT '所属规则组ID',
  action_type VARCHAR(50) NOT NULL COMMENT '动作类型: multiply_coefficient/add_markup/set_base_price/apply_discount/material_diff/branding_fee/custom_formula',
  action_params TEXT NOT NULL COMMENT '动作参数(JSON格式字符串)',
  calc_order INT DEFAULT 0 COMMENT '执行顺序',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  INDEX idx_group_id (group_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='报价规则动作表';

-- ============================================
-- 初始化默认规则数据（与现有固定规则一致）
-- 每条 INSERT 语句请单独执行
-- ============================================

-- 规则组1: 常规产品MOQ规则
INSERT INTO pricing_rule_groups (group_name, description, priority, is_enabled, is_system) VALUES ('常规产品MOQ规则', '从报价系数表自动查询MOQ系数（达到/未达MOQ × 原装/磨标）', 10, 1, 1);

-- 规则组2: 材质差价规则（自动从 material_price_diffs 表查询差价）
INSERT INTO pricing_rule_groups (group_name, description, priority, is_enabled, is_system) VALUES ('材质差价规则', '对比默认材质，自动查询材质差价表加价（支持闸板/阀杆/阀体/支架）', 20, 1, 1);

-- 规则组3: 磨标费用规则
INSERT INTO pricing_rule_groups (group_name, description, priority, is_enabled, is_system) VALUES ('磨标费用规则', 'OEM/磨标产品的加价规则', 30, 1, 1);

-- ============================================
-- 规则1: 常规产品MOQ规则 - 动作
-- 从报价系数表（pricing_rules）自动查询匹配的系数
-- 根据 MOQ 达标状态和磨标状态自动选择对应系数
-- 注意：group_id=1 对应"常规产品MOQ规则"，请根据实际插入的ID调整
-- ============================================
INSERT INTO pricing_rule_actions (group_id, action_type, action_params, calc_order) VALUES (1, 'apply_coefficient', '{}', 1);

-- ============================================
-- 规则2: 材质差价规则 - 动作（4个部位的差价查询）
-- 无条件：自动检测材质变化，从 material_price_diffs 表查询差价
-- ============================================
INSERT INTO pricing_rule_actions (group_id, action_type, action_params, calc_order) VALUES (2, 'material_diff', '{"part": "gate_plate"}', 1);

INSERT INTO pricing_rule_actions (group_id, action_type, action_params, calc_order) VALUES (2, 'material_diff', '{"part": "stem"}', 2);

INSERT INTO pricing_rule_actions (group_id, action_type, action_params, calc_order) VALUES (2, 'material_diff', '{"part": "body"}', 3);

INSERT INTO pricing_rule_actions (group_id, action_type, action_params, calc_order) VALUES (2, 'material_diff', '{"part": "yoke"}', 4);

-- ============================================
-- 规则3: 磨标费用规则 - 条件和动作
-- ============================================
INSERT INTO pricing_rule_conditions (group_id, condition_type, condition_value, logic_operator, sort_order) VALUES (3, 'product_type', '{"value": "oem"}', 'AND', 1);

INSERT INTO pricing_rule_actions (group_id, action_type, action_params, calc_order) VALUES (3, 'branding_fee', '{"price_field": "branding_fee"}', 1);


-- ============================================
-- 系统设置表（请单独执行）
-- ============================================
CREATE TABLE IF NOT EXISTS system_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) NOT NULL UNIQUE COMMENT '设置键名',
  setting_value VARCHAR(500) COMMENT '设置值',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
);

-- 默认设置：允许修订单价（请单独执行）
INSERT INTO system_settings (setting_key, setting_value) VALUES ('allow_price_modification', 'true')
ON DUPLICATE KEY UPDATE setting_value = setting_value;

-- ============================================
-- 系统设置：报价单显示配置（请单独执行）
-- 小程序端报价单图片的列表列和规格参数可见性控制
-- 列表字段：productType/modelSpec/gateMaterial/stemMaterial/quantity/brandingFee/unitPrice/totalPrice
-- 规格参数：maxPressure/unitWeight/laps/torque
-- modelSpec/quantity/unitPrice/totalPrice 被标记为必选，前端会强制不可取消
-- ============================================
INSERT INTO system_settings (setting_key, setting_value)
VALUES (
  'quotation_display_config',
  '{"tableFields":[{"key":"productType","visible":true},{"key":"modelSpec","visible":true},{"key":"gateMaterial","visible":true},{"key":"stemMaterial","visible":true},{"key":"quantity","visible":true},{"key":"brandingFee","visible":true},{"key":"unitPrice","visible":true},{"key":"totalPrice","visible":true}],"specFields":[{"key":"maxPressure","visible":true},{"key":"unitWeight","visible":true},{"key":"laps","visible":true},{"key":"torque","visible":true}]}'
)
ON DUPLICATE KEY UPDATE setting_value = setting_value;
