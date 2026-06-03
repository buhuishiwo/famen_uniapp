# 阀门报价系统后端API

基于 NestJS + TypeORM + MySQL 构建的阀门产品报价管理系统。

## 功能特性

- ✅ Excel价格库导入与解析
- ✅ 自动价格计算（含材质差价、磨标费）
- ✅ 报价单CRUD管理
- ✅ Swagger API文档
- ✅ 数据验证与错误处理

## 技术栈

- **框架**: NestJS 10.x
- **语言**: TypeScript
- **数据库**: MySQL 8.0+
- **ORM**: TypeORM 0.3.x
- **文档**: Swagger
- **文件处理**: Multer + xlsx

## 项目结构

```
backend/
├── src/
│   ├── controllers/       # 控制器
│   ├── services/          # 业务逻辑服务
│   ├── entities/          # 数据库实体
│   ├── dto/               # 数据传输对象
│   ├── modules/           # 模块
│   ├── app.module.ts      # 根模块
│   └── main.ts            # 入口文件
├── uploads/               # 上传文件目录
├── .env.example           # 环境变量示例
├── package.json
└── tsconfig.json
```

## 快速开始

### 1. 安装依赖

```bash
cd backend
npm install
```

### 2. 配置数据库

复制 `.env.example` 为 `.env` 并修改数据库配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=quotation_system
NODE_ENV=development
PORT=3000
```

### 3. 创建数据库

```sql
CREATE DATABASE quotation_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. 启动服务

开发模式（热重载）：
```bash
npm run start:dev
```

生产模式：
```bash
npm run build
npm start
```

服务启动后访问：
- API: http://localhost:3000/api
- Swagger文档: http://localhost:3000/api-docs

## API接口文档

### 1. 价格库导入

#### POST /api/quotations/import
上传Excel文件并解析价格数据

**请求参数**：
- `file`: Excel文件（xlsx/xls/csv），最大10MB

**响应示例**：
```json
{
  "success": true,
  "message": "文件解析成功",
  "data": {
    "rowsCount": 10,
    "successCount": 8,
    "failedRows": [
      {
        "rowIndex": 3,
        "error": "规格DN必须为50-2000之间的整数"
      }
    ],
    "previewData": [...]
  }
}
```

#### POST /api/quotations/import/confirm
确认导入价格数据到数据库

**请求体**：
```json
{
  "data": [...]
}
```

### 2. 报价单管理

#### POST /api/quotations
创建报价单

**请求体**：
```json
{
  "customerName": "XX阀门有限公司",
  "note": "阀体WCB，闸板304",
  "paymentMethod": "定金30%，余款付清发货",
  "packaging": "木箱包装",
  "quoter": "童惠业",
  "quoterPhone": "13957713583",
  "validity": "15天",
  "items": [
    {
      "valveName": "QBZ73X-10C",
      "spec": 100,
      "gatePlate": "304",
      "rodMaterial": "2Cr13",
      "quantity": 5,
      "branding": true,
      "productType": "常规品"
    }
  ]
}
```

**响应示例**：
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "customerName": "XX阀门有限公司",
    "totalAmount": 2525,
    "itemCount": 1,
    "status": "draft",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### GET /api/quotations
获取报价单列表

**查询参数**：
- `page`: 页码（默认1）
- `limit`: 每页数量（默认10）
- `status`: 状态筛选（draft/approved/sent）

#### GET /api/quotations/:id
获取单个报价单详情

#### PUT /api/quotations/:id
更新报价单

#### DELETE /api/quotations/:id
删除报价单

## Excel模板格式

价格库导入Excel模板需包含以下列：

| 列名 | 说明 | 必填 | 示例 |
|------|------|------|------|
| 产品系列 | QB系列/QC系列等 | 是 | QB系列 |
| 阀门型号 | 完整型号名称 | 是 | QBZ73X-10C |
| 规格DN | 数字，范围50-2000 | 是 | 100 |
| 手动价格 | 手动操作价格 | 否 | 320 |
| 气动价格 | 气动操作价格 | 否 | 850 |
| 电装价格 | 电装操作价格 | 否 | 1200 |
| 伞齿轮价格 | 伞齿轮操作价格 | 否 | 680 |
| 304闸板差价 | 304材质差价 | 否 | 0 |
| 316闸板差价 | 316材质差价 | 否 | 20 |
| 304阀杆差价 | 304阀杆差价 | 否 | 100 |
| 316阀杆差价 | 316阀杆差价 | 否 | 180 |
| 磨标费 | 磨标费用 | 否 | 25 |
| 状态 | 启用/禁用 | 否 | 启用 |
| 备注 | 备注信息 | 否 | 标准产品 |

## 价格计算规则

1. **基础价格**：根据阀门型号中的操作类型选择对应价格
   - 含"气动"：使用气动价格
   - 含"电装"：使用电装价格
   - 含"伞齿轮"：使用伞齿轮价格
   - 其他：使用手动价格

2. **材质差价**：
   - 闸板304：加 gate_304_diff
   - 闸板316：加 gate_316_diff
   - 阀杆304：加 rod_304_diff
   - 阀杆316：加 rod_316_diff
   - 阀杆2Cr13：不加价

3. **磨标费**：
   - 选择磨标：加 branding_fee
   - 不磨标：不加价

4. **总价计算**：
   ```
   单价 = 基础价格 + 闸板差价 + 阀杆差价
   单项总价 = (单价 + 磨标费) × 数量
   ```

## 数据库表结构

### product_series（产品系列表）
- id: 主键
- name: 系列名称
- image: 系列图片
- created_at: 创建时间
- updated_at: 更新时间

### valve_models（阀门型号表）
- id: 主键
- series_id: 所属系列ID
- name: 型号名称
- type_code: 型号代码
- created_at: 创建时间

### price_table（价格表）
- id: 主键
- model_id: 关联型号ID
- size: 规格尺寸
- manual_price: 手动价格
- pneumatic_price: 气动价格
- electric_price: 电装价格
- gear_price: 伞齿轮价格
- gate_304_diff: 304闸板差价
- gate_316_diff: 316闸板差价
- rod_304_diff: 304阀杆差价
- rod_316_diff: 316阀杆差价
- branding_fee: 磨标费
- status: 状态
- remark: 备注
- created_at: 创建时间

### quotations（报价单表）
- id: UUID主键
- customer_name: 客户名称
- note: 备注信息
- payment_method: 付款方式
- packaging: 包装方式
- quoter: 报价人
- quoter_phone: 联系电话
- validity: 有效期
- total_amount: 总金额
- status: 状态
- created_at: 创建时间
- updated_at: 更新时间

### quotation_items（报价明细表）
- id: 主键
- quotation_id: 关联报价单ID
- model_id: 关联型号ID
- valve_name: 阀门型号
- size: 规格尺寸
- gate_plate: 闸板材质
- rod_material: 阀杆材质
- product_type: 产品类型
- quantity: 数量
- branding: 是否磨标
- branding_fee: 磨标费
- unit_price: 单价
- total_price: 单项总价
- created_at: 创建时间

## 错误处理

API返回统一的错误格式：

```json
{
  "statusCode": 400,
  "message": "错误描述",
  "error": "Bad Request"
}
```

常见错误码：
- 400: 请求参数错误
- 404: 资源不存在
- 500: 服务器内部错误

## 开发说明

### 代码规范
- 使用TypeScript类型注解
- 遵循NestJS最佳实践
- 使用Swagger注解生成API文档

### 测试
```bash
npm test
npm run test:cov
```

### 构建
```bash
npm run build
```

## 许可证

ISC