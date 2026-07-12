CREATE TABLE IF NOT EXISTS salespersons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL COMMENT '营销员姓名',
  phone VARCHAR(20) COMMENT '联系电话',
  email VARCHAR(100) COMMENT '邮箱',
  department VARCHAR(50) COMMENT '部门',
  status TINYINT DEFAULT 1 COMMENT '状态：1启用，0禁用',
  remark TEXT COMMENT '备注',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_name (name),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='营销员表';

CREATE TABLE IF NOT EXISTS customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL COMMENT '客户姓名/公司名称',
  salesperson_id INT COMMENT '所属营销员ID',
  salesperson_name VARCHAR(50) COMMENT '所属营销员姓名（冗余字段，便于查询）',
  phone VARCHAR(20) COMMENT '联系电话',
  email VARCHAR(100) COMMENT '邮箱',
  company VARCHAR(200) COMMENT '公司名称',
  address VARCHAR(500) COMMENT '地址',
  status TINYINT DEFAULT 1 COMMENT '状态：1启用，0禁用',
  remark TEXT COMMENT '备注',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_name (name),
  INDEX idx_salesperson (salesperson_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='客户表';

INSERT INTO salespersons (name, phone, department) VALUES
('张三', '13800138001', '销售一部'),
('李四', '13800138002', '销售二部'),
('王五', '13800138003', '销售一部');

INSERT INTO customers (name, salesperson_id, salesperson_name, phone, company, address) VALUES
('赵六', 1, '张三', '13900139001', 'XX科技有限公司', '北京市朝阳区XX路XX号'),
('钱七', 1, '张三', '13900139002', 'YY贸易公司', '上海市浦东新区XX路XX号'),
('孙八', 2, '李四', '13900139003', 'ZZ制造有限公司', '广州市天河区XX路XX号');
