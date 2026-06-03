# 阀门报价系统后端 - 快速启动指南

## 📋 项目概述

这是一个完整的阀门报价系统后端API，支持Excel价格库导入、自动价格计算、报价单管理等功能。

## 🚀 5分钟快速启动

### 步骤1: 安装依赖

```bash
cd backend
npm install
```

### 步骤2: 配置数据库

```bash
cp .env.example .env
```

编辑`.env`文件，修改数据库配置：
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=quotation_system
NODE_ENV=development
PORT=3000
```

### 步骤3: 初始化数据库

```bash
mysql -u root -p < database/init.sql
```

或手动执行SQL：
```sql
CREATE DATABASE quotation_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE quotation_system;
-- 然后执行 database/init.sql 中的其他SQL语句
```

### 步骤4: 启动服务

```bash
npm run start:dev
```

看到以下输出表示启动成功：
```
🚀 Application is running on: http://localhost:3000
📚 API Documentation: http://localhost:3000/api-docs
```

## 📚 API接口文档

启动服务后访问：http://localhost:3000/api-docs

### 核心接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/quotations/import` | POST | 导入价格库Excel |
| `/api/quotations/import/confirm` | POST | 确认导入 |
| `/api/quotations` | POST | 创建报价单 |
| `/api/quotations` | GET | 获取报价单列表 |
| `/api/quotations/:id` | GET | 获取报价单详情 |
| `/api/quotations/:id` | PUT | 更新报价单 |
| `/api/quotations/:id` | DELETE | 删除报价单 |

## 🧪 测试API

运行测试脚本：
```bash
node test-api.js
```

## 📁 项目结构

```
backend/
├── src/
│   ├── controllers/      # 控制器
│   ├── services/         # 服务
│   ├── entities/         # 数据库实体
│   ├── dto/              # 数据传输对象
│   ├── modules/          # 模块
│   ├── app.module.ts     # 根模块
│   └── main.ts           # 入口
├── database/
│   └── init.sql          # 数据库初始化
├── .env.example          # 环境变量示例
├── package.json
├── README.md
└── test-api.js           # 测试脚本
```

## 🔧 常用命令

```bash
# 开发模式（热重载）
npm run start:dev

# 生产模式
npm run build
npm start

# 运行测试
npm test

# 代码检查
npm run lint
```

## 📝 Excel模板格式

价格库导入Excel需包含以下列：

| 列名 | 说明 | 示例 |
|------|------|------|
| 产品系列 | QB系列/QC系列等 | QB系列 |
| 阀门型号 | 完整型号名称 | QBZ73X-10C |
| 规格DN | 50-2000 | 100 |
| 手动价格 | 手动操作价格 | 320 |
| 气动价格 | 气动操作价格 | 850 |
| 电装价格 | 电装操作价格 | 1200 |
| 伞齿轮价格 | 伞齿轮操作价格 | 680 |
| 304闸板差价 | 304材质差价 | 0 |
| 316闸板差价 | 316材质差价 | 20 |
| 304阀杆差价 | 304阀杆差价 | 100 |
| 316阀杆差价 | 316阀杆差价 | 180 |
| 磨标费 | 磨标费用 | 25 |
| 状态 | 启用/禁用 | 启用 |
| 备注 | 备注信息 | 标准产品 |

## 💡 价格计算规则

```
单价 = 基础价格 + 闸板差价 + 阀杆差价
单项总价 = (单价 + 磨标费) × 数量
```

- **基础价格选择**：
  - 含"气动" → 气动价格
  - 含"电装" → 电装价格
  - 含"伞齿轮" → 伞齿轮价格
  - 其他 → 手动价格

- **材质差价**：
  - 闸板304：加 gate_304_diff
  - 闸板316：加 gate_316_diff
  - 阀杆304：加 rod_304_diff
  - 阀杆316：加 rod_316_diff
  - 阀杆2Cr13：不加价

## 🐛 常见问题

### 1. 数据库连接失败
检查`.env`文件中的数据库配置是否正确，确保MySQL服务已启动。

### 2. 端口被占用
修改`.env`文件中的`PORT`配置。

### 3. Excel导入失败
确保Excel文件格式正确，包含所有必需的列。

### 4. 价格计算错误
检查阀门型号和规格是否存在于价格表中。

## 📞 技术支持

- 查看详细文档：[README.md](./README.md)
- 查看项目结构：[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)

## ✨ 功能特性

- ✅ Excel价格库导入与解析
- ✅ 自动价格计算（含材质差价、磨标费）
- ✅ 报价单CRUD管理
- ✅ Swagger API文档
- ✅ 数据验证与错误处理
- ✅ 支持分页查询
- ✅ 支持状态筛选

## 🎯 下一步

1. 根据实际需求调整数据库表结构
2. 添加用户认证和权限管理
3. 实现报价单导出功能
4. 添加邮件通知功能
5. 部署到生产环境