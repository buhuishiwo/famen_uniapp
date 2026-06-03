-- 阀门报价系统数据库初始化脚本

-- 创建数据库
CREATE DATABASE IF NOT EXISTS quotation_system 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE quotation_system;

-- 产品系列表
CREATE TABLE IF NOT EXISTS product_series (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE COMMENT '系列名称',
  image VARCHAR(255) NULL COMMENT '系列图片URL',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='产品系列表';

-- 阀门型号表
CREATE TABLE IF NOT EXISTS valve_models (
  id INT AUTO_INCREMENT PRIMARY KEY,
  series_id INT NOT NULL COMMENT '所属系列ID',
  name VARCHAR(100) NOT NULL COMMENT '型号名称',
  type_code VARCHAR(50) NOT NULL COMMENT '型号代码',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  FOREIGN KEY (series_id) REFERENCES product_series(id) ON DELETE CASCADE,
  INDEX idx_name (name),
  INDEX idx_type_code (type_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='阀门型号表';

-- 价格表
CREATE TABLE IF NOT EXISTS price_table (
  id INT AUTO_INCREMENT PRIMARY KEY,
  model_id INT NOT NULL COMMENT '关联型号ID',
  size INT NOT NULL COMMENT '规格尺寸DN',
  manual_price DECIMAL(12,2) NULL COMMENT '手动价格',
  pneumatic_price DECIMAL(12,2) NULL COMMENT '气动价格',
  electric_price DECIMAL(12,2) NULL COMMENT '电装价格',
  gear_price DECIMAL(12,2) NULL COMMENT '伞齿轮价格',
  gate_304_diff DECIMAL(10,2) DEFAULT 0 COMMENT '304闸板差价',
  gate_316_diff DECIMAL(10,2) DEFAULT 0 COMMENT '316闸板差价',
  rod_304_diff DECIMAL(10,2) DEFAULT 0 COMMENT '304阀杆差价',
  rod_316_diff DECIMAL(10,2) DEFAULT 0 COMMENT '316阀杆差价',
  branding_fee DECIMAL(10,2) DEFAULT 0 COMMENT '磨标费',
  min_order_qty INT DEFAULT 1 COMMENT '起订量',
  status VARCHAR(20) DEFAULT 'enabled' COMMENT '状态',
  remark TEXT NULL COMMENT '备注',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  FOREIGN KEY (model_id) REFERENCES valve_models(id) ON DELETE CASCADE,
  UNIQUE KEY uk_model_size (model_id, size),
  INDEX idx_size (size),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='价格表';

-- 报价单表
CREATE TABLE IF NOT EXISTS quotations (
  id VARCHAR(36) PRIMARY KEY COMMENT 'UUID主键',
  customer_name VARCHAR(100) NULL COMMENT '客户名称',
  note TEXT NULL COMMENT '备注信息',
  payment_method VARCHAR(200) NULL COMMENT '付款方式',
  packaging VARCHAR(200) NULL COMMENT '包装方式',
  quoter VARCHAR(50) NULL COMMENT '报价人',
  quoter_phone VARCHAR(20) NULL COMMENT '联系电话',
  validity VARCHAR(50) NULL COMMENT '有效期',
  total_amount DECIMAL(15,2) DEFAULT 0 COMMENT '总金额',
  status VARCHAR(20) DEFAULT 'draft' COMMENT '状态',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_customer (customer_name),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='报价单表';

-- 报价明细表
CREATE TABLE IF NOT EXISTS quotation_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  quotation_id VARCHAR(36) NOT NULL COMMENT '关联报价单ID',
  model_id INT NOT NULL COMMENT '关联型号ID',
  valve_name VARCHAR(100) NOT NULL COMMENT '阀门型号',
  size INT NOT NULL COMMENT '规格尺寸',
  gate_plate VARCHAR(20) NOT NULL COMMENT '闸板材质',
  rod_material VARCHAR(20) NOT NULL COMMENT '阀杆材质',
  product_type VARCHAR(20) DEFAULT 'regular' COMMENT '产品类型',
  quantity INT NOT NULL COMMENT '数量',
  min_order_qty INT DEFAULT 1 COMMENT '起订量',
  branding BOOLEAN DEFAULT FALSE COMMENT '是否磨标',
  branding_fee DECIMAL(10,2) DEFAULT 0 COMMENT '磨标费',
  unit_price DECIMAL(12,2) NOT NULL COMMENT '单价',
  total_price DECIMAL(15,2) NOT NULL COMMENT '单项总价',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  FOREIGN KEY (quotation_id) REFERENCES quotations(id) ON DELETE CASCADE,
  FOREIGN KEY (model_id) REFERENCES valve_models(id) ON DELETE CASCADE,
  INDEX idx_quotation_id (quotation_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='报价明细表';

-- 插入示例产品系列
INSERT INTO product_series (name, image) VALUES
('QB系列', 'https://picui.ogmua.cn/s1/2026/05/29/6a186da26271b.webp'),
('QC系列', 'https://picui.ogmua.cn/s1/2026/05/29/6a186d9f109a1.webp'),
('QD系列', 'https://picui.ogmua.cn/s1/2026/05/29/6a186dc060b51.webp')
ON DUPLICATE KEY UPDATE image=VALUES(image);