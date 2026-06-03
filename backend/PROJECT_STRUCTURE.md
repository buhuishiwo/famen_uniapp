# 后端项目结构说明

```
backend/
├── src/
│   ├── controllers/              # 控制器层
│   │   └── quotation.controller.ts    # 报价单控制器
│   │
│   ├── services/                 # 业务逻辑层
│   │   ├── quotation.service.ts        # 报价单服务
│   │   ├── price-import.service.ts     # 价格导入服务
│   │   └── price-calculation.service.ts # 价格计算服务
│   │
│   ├── entities/                 # 数据库实体
│   │   ├── product-series.entity.ts    # 产品系列实体
│   │   ├── valve-model.entity.ts       # 阀门型号实体
│   │   ├── price-table.entity.ts       # 价格表实体
│   │   ├── quotation.entity.ts         # 报价单实体
│   │   ├── quotation-item.entity.ts    # 报价明细实体
│   │   └── index.ts                    # 实体导出
│   │
│   ├── dto/                      # 数据传输对象
│   │   └── quotation.dto.ts            # 报价单DTO
│   │
│   ├── modules/                  # 模块
│   │   └── quotation.module.ts         # 报价单模块
│   │
│   ├── app.module.ts             # 根模块
│   └── main.ts                   # 应用入口
│
├── database/                     # 数据库相关
│   └── init.sql                  # 数据库初始化脚本
│
├── uploads/                      # 文件上传目录（自动创建）
│
├── .env.example                  # 环境变量示例
├── .gitignore                    # Git忽略文件
├── package.json                  # 项目依赖
├── tsconfig.json                 # TypeScript配置
├── README.md                     # 项目说明文档
├── start.sh                      # 快速启动脚本
└── test-api.js                   # API测试脚本
```

## 核心文件说明

### 1. 控制器层 (controllers/)

**quotation.controller.ts**
- 处理HTTP请求路由
- 文件上传处理
- 参数验证
- 调用服务层处理业务逻辑

主要接口：
- `POST /api/quotations` - 创建报价单
- `GET /api/quotations` - 获取报价单列表
- `GET /api/quotations/:id` - 获取报价单详情
- `PUT /api/quotations/:id` - 更新报价单
- `DELETE /api/quotations/:id` - 删除报价单
- `POST /api/quotations/import` - 导入价格库Excel
- `POST /api/quotations/import/confirm` - 确认导入

### 2. 服务层 (services/)

**quotation.service.ts**
- 报价单CRUD操作
- 调用价格计算服务
- 数据持久化

**price-import.service.ts**
- Excel文件解析
- 数据验证
- 价格数据保存

**price-calculation.service.ts**
- 价格计算核心逻辑
- 材质差价计算
- 磨标费计算
- 批量价格计算

### 3. 实体层 (entities/)

**product-series.entity.ts**
- 产品系列数据模型

**valve-model.entity.ts**
- 阀门型号数据模型

**price-table.entity.ts**
- 价格数据模型
- 包含各种操作类型价格
- 包含材质差价

**quotation.entity.ts**
- 报价单主表数据模型

**quotation-item.entity.ts**
- 报价明细数据模型

### 4. DTO层 (dto/)

**quotation.dto.ts**
- CreateQuotationDto - 创建报价单DTO
- QuotationItemDto - 报价明细项DTO
- UpdateQuotationDto - 更新报价单DTO

### 5. 模块层 (modules/)

**quotation.module.ts**
- 报价单功能模块
- 配置依赖注入
- 配置文件上传

### 6. 数据库脚本 (database/)

**init.sql**
- 创建数据库
- 创建所有表结构
- 插入示例数据

## 数据流程

### 价格导入流程
```
Excel文件 → Multer中间件 → PriceImportService解析 → 验证数据 → 保存到数据库
```

### 报价单创建流程
```
前端请求 → QuotationController → QuotationService → PriceCalculationService计算价格
→ 保存报价单主表 → 保存报价明细表 → 返回结果
```

### 价格计算流程
```
输入参数 → 查询阀门型号 → 查询价格表 → 选择基础价格 → 加材质差价 → 加磨标费
→ 计算总价 → 返回结果
```

## 启动步骤

1. 安装依赖：`npm install`
2. 配置环境变量：复制`.env.example`为`.env`并修改
3. 初始化数据库：执行`database/init.sql`
4. 启动服务：`npm run start:dev`
5. 访问API文档：http://localhost:3000/api-docs

## 测试

运行测试脚本：
```bash
node test-api.js
```

测试内容包括：
1. 导入价格库Excel文件
2. 确认导入价格数据
3. 创建报价单
4. 查询报价单详情
5. 查询报价单列表
6. 更新报价单状态
7. 删除报价单