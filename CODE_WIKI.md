# 阀门报价系统 Code Wiki

> 本文档为「奇胜阀门报价系统」的完整代码 Wiki，涵盖项目整体架构、各模块职责、关键类与函数说明、依赖关系及项目运行方式。

---

## 目录

- [1. 项目概述](#1-项目概述)
- [2. 技术栈与依赖](#2-技术栈与依赖)
- [3. 整体架构](#3-整体架构)
- [4. 目录结构](#4-目录结构)
- [5. 小程序前端模块](#5-小程序前端模块)
  - [5.1 应用入口与配置](#51-应用入口与配置)
  - [5.2 API 调用层](#52-api-调用层)
  - [5.3 页面详解](#53-页面详解)
  - [5.4 公共组件](#54-公共组件)
- [6. Admin 后台管理模块](#6-admin-后台管理模块)
  - [6.1 应用入口与路由](#61-应用入口与路由)
  - [6.2 API 调用层](#62-api-调用层)
  - [6.3 视图页面详解](#63-视图页面详解)
- [7. 云函数模块](#7-云函数模块)
  - [7.1 price — 核心数据中枢](#71-price--核心数据中枢)
  - [7.2 quotation — 报价单引擎](#72-quotation--报价单引擎)
  - [7.3 import — Excel 导入](#73-import--excel-导入)
  - [7.4 template — 模板生成](#74-template--模板生成)
  - [7.5 images — 图片获取](#75-images--图片获取)
  - [7.6 user — 用户管理](#76-user--用户管理)
  - [7.7 migration — 数据迁移](#77-migration--数据迁移)
  - [7.8 admin — 已废弃](#78-admin--已废弃)
- [8. 数据库设计](#8-数据库设计)
- [9. 核心业务流程](#9-核心业务流程)
- [10. 项目运行方式](#10-项目运行方式)
- [11. 部署与配置](#11-部署与配置)
- [12. 辅助脚本与工具](#12-辅助脚本与工具)

---

## 1. 项目概述

本项目是一套面向阀门制造企业的**产品报价管理系统**，包含三个端：

1. **微信小程序端**（uni-app 构建）：面向业务人员，提供产品分类浏览、价格配置与实时计算、报价单生成（Canvas 绘图存相册）、价格库 Excel 导入等功能。
2. **Admin 后台管理端**（Vue 3 + Ant Design Vue）：面向管理员，提供产品系列、阀门型号、价格、材质、报价系数、材质价差、材质库、营销员、客户共 9 大模块的 CRUD 管理。
3. **云函数后端**（腾讯云 CloudBase Node.js）：提供数据存储、价格计算、Excel 导入解析、模板生成、用户认证等服务。

**云开发环境 ID**：`cloud1-d2g6k45v21dd52696`

**核心定价模型**：`单价 = 基准价 × 报价系数 + 四类材质价差`，再 `× 产品类型倍率 + 磨标费`，最后 `× 数量 = 总价`。

---

## 2. 技术栈与依赖

### 2.1 小程序端

| 技术 | 版本/说明 |
|------|----------|
| uni-app | Vue 2 模式，跨端框架，主要编译目标为微信小程序 |
| 微信云开发 | `wx.cloud` 原生能力，云函数 + 云存储 |
| Skyline 渲染引擎 | pages.json 中配置，提升渲染性能 |
| zp-mixins | 全局 mixin，提供 setData 等 小程序 兼容能力 |
| mp-html | 富文本渲染组件（uni_modules） |

### 2.2 Admin 后台

| 技术 | 版本 |
|------|------|
| Vue | ^3.5.13 |
| Vite | ^6.3.5 |
| Ant Design Vue | ^4.2.6 |
| Vue Router | ^4.6.4 |
| @cloudbase/js-sdk | ^3.6.2 |

### 2.3 云函数端

| 依赖包 | 用途 | 使用云函数 |
|--------|------|-----------|
| @cloudbase/node-sdk | CloudBase 服务端 SDK（数据库/存储） | 全部 8 个 |
| bcryptjs | 密码加密 | user、migration |
| xlsx | Excel 解析与生成 | import、template |
| ws | WebSocket 依赖（price 云函数运行所需） | price |

### 2.4 运行时配置

| 云函数 | 超时时间 | 说明 |
|--------|---------|------|
| price | 30s | 核心 CRUD |
| quotation | 30s | 报价单 |
| import | 120s | Excel 导入耗时最长 |
| user | 20s | 用户认证 |
| admin | 30s | 已废弃 |
| migration | 30s | 数据迁移 |
| images | 10s | 图片 URL 获取 |
| template | 10s | 模板生成 |

所有云函数运行时为 `Nodejs16.13`。

---

## 3. 整体架构

```
┌─────────────────────────────────────────────────────────────────┐
│                         客户端层                                  │
│  ┌──────────────────────┐    ┌──────────────────────────────┐  │
│  │  微信小程序 (uni-app)  │    │  Admin 后台 (Vue3+Antd)       │  │
│  │  - 产品分类浏览        │    │  - 9 大模块 CRUD 管理         │  │
│  │  - 价格配置与计算      │    │  - 图片上传                   │  │
│  │  - 报价单生成(Canvas)  │    │  - 级联删除                   │  │
│  │  - Excel 导入         │    │                              │  │
│  └──────────┬───────────┘    └──────────────┬───────────────┘  │
└─────────────┼────────────────────────────────┼──────────────────┘
              │ wx.cloud.callFunction          │ @cloudbase/js-sdk
              │ wx.cloud.uploadFile            │ (匿名登录 + 云函数调用)
              ▼                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      云函数层 (CloudBase)                         │
│  ┌────────┐ ┌───────────┐ ┌────────┐ ┌────────┐ ┌───────────┐  │
│  │ price  │ │ quotation │ │ import │ │template│ │ user      │  │
│  │ 34个   │ │ 5个action │ │2个     │ │2个     │ │ 7个action │  │
│  │ action │ │           │ │action  │ │action  │ │           │  │
│  └───┬────┘ └─────┬─────┘ └───┬────┘ └───┬────┘ └─────┬─────┘  │
│      │      ┌─────┴─────┐     │          │            │        │
│      │      │ images    │     │          │            │        │
│      │      │ (图片URL) │     │          │            │        │
│      │      └───────────┘     │          │            │        │
│  ┌───┴────────────────────────┴──────────┴────────────┴─────┐  │
│  │              migration (初始化/测试)                        │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    数据与存储层 (CloudBase)                       │
│  ┌─────────────── 数据库 (12 张表) ──────────────────────────┐  │
│  │ product_series │ valve_models │ price_table                │  │
│  │ valve_model_materials │ pricing_rules │ material_price_diffs│  │
│  │ materials │ salespersons │ customers                       │  │
│  │ quotations │ quotation_items │ users                       │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌─────────────── 云存储 ─────────────────────────────────────┐  │
│  │ series_images/ (系列图片)  imports/ (导入文件)              │  │
│  │ templates/ (模板文件)      images/ (产品图片)               │  │
│  └────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

**核心设计特点**：
- **无独立后端服务器**，全部依托腾讯云 CloudBase 云开发。
- **price 云函数为业务核心**，承载 9 张表共 34 个 action，是整个系统的数据中枢。
- 小程序端通过 `wx.cloud` 原生能力调用云函数；Admin 端通过 `@cloudbase/js-sdk` 匿名登录后调用云函数。
- admin 云函数已废弃，所有 CRUD 操作统一收敛到 price 云函数。

---

## 4. 目录结构

```
famen_minip_uni_new/
├── App.vue                      # 小程序根组件（云开发初始化）
├── main.js                      # 小程序入口（注册 zp-mixins）
├── manifest.json                # uni-app 配置（appid、云函数根目录）
├── pages.json                   # 小程序页面路由配置
├── package.json                 # 小程序根依赖（xlsx）
├── project.config.json          # 微信开发者工具配置
│
├── pages/                       # 小程序页面
│   ├── product-category/        # 产品分类页（入口）
│   ├── index/                   # 价格配置与计算页（核心业务）
│   ├── quotation/               # 报价单生成页
│   ├── upload-price/            # 价格库管理/Excel 导入页
│   ├── login/                   # 登录页
│   └── file-picker/             # WebView 文件选择页
│
├── components/
│   └── navigation-bar/          # 自定义导航栏组件
│
├── utils/
│   ├── api.js                   # HTTP API 层（遗留/备用）
│   └── cloud-api.js             # 云函数 API 层（当前主用）
│
├── uni_modules/                 # uni-app 插件
│   ├── mp-html/                 # 富文本渲染
│   └── zp-mixins/               # setData 等兼容 mixin
│
├── admin/                       # Admin 后台管理（独立子项目）
│   ├── src/
│   │   ├── api/index.js         # CloudBase API 封装
│   │   ├── router/index.js      # 路由配置与守卫
│   │   ├── views/               # 10 个视图页面
│   │   ├── App.vue              # 根组件（布局+菜单）
│   │   └── main.js              # 入口
│   ├── vite.config.js
│   ├── cloudbaserc.json
│   └── package.json
│
├── cloudfunctions/              # 云函数
│   ├── price/                   # 核心数据中枢（34 个 action）
│   ├── quotation/               # 报价单引擎
│   ├── import/                  # Excel 导入解析
│   ├── template/                # 模板生成
│   ├── images/                  # 图片 URL 获取
│   ├── user/                    # 用户认证
│   ├── migration/               # 数据迁移/初始化
│   └── admin/                   # 已废弃
│
├── static-hosting/              # CloudBase 静态托管资源
│   ├── file-picker.html         # WebView 文件选择器 HTML
│   ├── template.xlsx            # 产品数据导入模板
│   └── min_order_coefficient_template.xlsx
│
├── backend/
│   └── database/
│       └── salespersons_customers.sql  # 营销员/客户建表 SQL
│
├── cloudfunctions/db/           # 数据库导出 CSV 备份
│
└── unpackage/dist/              # uni-app 编译输出
    ├── dev/mp-weixin/           # 开发环境编译产物
    └── build/mp-weixin/         # 生产环境编译产物
```

---

## 5. 小程序前端模块

### 5.1 应用入口与配置

#### [App.vue](file:///d:/Code/famen_minip_uni_new/App.vue)

根组件，负责云开发环境初始化。

- **`onLaunch()`**：调用 `wx.cloud.init({ env: 'cloud1-d2g6k45v21dd52696', traceUser: true })` 初始化云开发。
- 全局样式设置 `page` 背景色与字体。

#### [main.js](file:///d:/Code/famen_minip_uni_new/main.js)

应用入口，注册全局 mixin。

- 引入 `zp-mixins`（提供 `setData` 等小程序兼容能力），通过 `Vue.use(zpMixins)` 全局注册。
- 支持 Vue 2 和 Vue 3 两种模式编译。

#### [manifest.json](file:///d:/Code/famen_minip_uni_new/manifest.json)

uni-app 配置文件，关键配置：
- `appid: "__UNI__41290F1"` — uni-app 应用 ID
- `mp-weixin.appid: "wx33dfe11aacee6513"` — 微信小程序 appid
- `mp-weixin.cloudfunctionRoot: "cloudfunctions/"` — 云函数根目录
- `vueVersion: "2"` — 使用 Vue 2

#### [pages.json](file:///d:/Code/famen_minip_uni_new/pages.json)

页面路由配置，注册 6 个页面，使用 Skyline 渲染引擎（`renderer: "skyline"`）和 glass-easel 组件框架。

---

### 5.2 API 调用层

#### [utils/cloud-api.js](file:///d:/Code/famen_minip_uni_new/utils/cloud-api.js)

**当前主用的 API 层**，基于 `wx.cloud.callFunction` 封装，是所有业务页面唯一引入的 API 层。

**核心函数**：
- `callCloudFunction(name, data)` — 调用云函数，校验 `result.success`，成功返回 `data`，失败抛错
- `callCloudFunctionRaw(name, data)` — 同上但返回完整 `result`（保留 message 等字段）

**导出的 API 模块**：

| 模块 | 云函数 | 主要方法 |
|------|--------|---------|
| `priceApi` | price/import/template/images | getPrices, getSeries, getModels, getModelsBySeries, getPricingRules, getMaterials, getMaterialDiffs, getMaterialByModel, getAllMaterials, getMaterialDiff, importFile, confirmImport, getTemplateUrl, getMaterialLibraryTemplateUrl, getImages, getSalespersons, getCustomers |
| `quotationApi` | quotation | create, getList, getDetail, update, delete |
| `userApi` | user | login, register, getProfile, getAllUsers, update, changePassword, delete |
| `storage` | - | saveUser, getUser, removeUser, isLoggedIn（基于 `uni.setStorageSync`） |

**关键方法 `importFile`**：先 `wx.cloud.uploadFile` 上传到云存储 `imports/时间戳_文件名`，再调用 `import` 云函数 `action: 'parseFile'` 解析。

#### [utils/api.js](file:///d:/Code/famen_minip_uni_new/utils/api.js)

**遗留的 HTTP API 层**（基地址 `https://wzyaoyao.com/api/v2`），已被 cloud-api.js 取代，保留备用。提供 `quotationApi`、`priceApi`、`userApi`、`storage` 四个模块，结构类似但基于 `uni.request`。

---

### 5.3 页面详解

#### [pages/product-category/product-category.vue](file:///d:/Code/famen_minip_uni_new/pages/product-category/product-category.vue) — 产品分类页

**职责**：小程序入口页，展示所有阀门产品系列（双列网格卡片），提供搜索过滤。

| 关键内容 | 说明 |
|---------|------|
| `loadData()` | 调用 `priceApi.getSeries()` 加载系列列表，映射为 `{name, image}` |
| `onProductClick(product)` | 缓存系列名到 storage，跳转 `/pages/index/index` |
| `onManageClick()` | 跳转价格库管理页 |
| `filteredProducts` | computed，按搜索关键词模糊过滤 |

#### [pages/index/index.vue](file:///d:/Code/famen_minip_uni_new/pages/index/index.vue) — 价格配置与计算页（核心）

**职责**：项目最复杂的页面。根据产品系列，让用户选择阀门型号、DN 规格、四类材质、产品类型、数量、是否磨标，实时计算单价与总价。

**核心 data**：
- `currentProductSeries` — 当前系列（从 storage 读取）
- `valveTypes` / `priceData` — 型号列表与价格数据
- `materialData` / `materialDiffs` / `pricingRules` — 材质基准、价差、系数规则
- 四类材质选择：`SelectValveBody`(阀体)、`selectedGatePlate`(闸板)、`selectedRodMaterial`(阀杆)、`selectedYokeMaterial`(支架)
- `quoteItems` — 报价明细列表（持久化到 storage）

**核心方法**：

| 方法 | 职责 |
|------|------|
| `loadDataFromBackend()` | `Promise.all` 并行加载 series、models、pricingRules、materials、materialDiffs |
| `getPricingCoefficient(series, valve, spec, qty, branding)` | **核心系数计算**：按系列+产品名+DN范围匹配规则，根据「是否满足起订量」×「是否磨标」四象限返回对应系数 |
| `getMaterialPriceDiff(series, part, base, target, dn)` | 查询材质价差（DN 范围匹配） |
| `updateCurrentPrice()` | **实时预览**：`基准价 × 系数 + 四类材质价差) × 类型倍率 + 磨标费` |
| `calculatePrice()` | 生成完整报价项对象 |
| `getPriceByType(priceItem, type)` | 按阀门名关键词（气动/电装/伞齿轮/手动）选择对应价格字段 |
| `getMinOrderQuantity(specSize)` | 起订量查询：pricingRules → priceData → 兜底 50 |
| `onAddToQuote()` | 添加到报价明细并持久化 |
| `onGenerateQuotation()` | 将 quoteItems 通过 URL 参数传给报价单页 |

**定价公式**：
```
单价 = (基准价 × 报价系数 + 阀体价差 + 闸板价差 + 阀杆价差 + 支架价差) × 产品类型倍率 + 磨标费
总价 = 单价 × 数量
```

#### [pages/quotation/quotation.vue](file:///d:/Code/famen_minip_uni_new/pages/quotation/quotation.vue) — 报价单生成页

**职责**：接收报价明细，补充客户/报价员/备注等元信息，保存数据库并用 Canvas 绘制报价单图片存相册。

| 关键方法 | 说明 |
|---------|------|
| `onLoad(options)` | 解码 URL 参数为 quoteData，加载报价员/客户列表 |
| `loadSalespersons()` / `loadCustomers()` | 调用 `priceApi.getSalespersons()` / `getCustomers()` |
| `saveQuotationToDatabase()` | 调用 `quotationApi.create()` 保存报价单 |
| `generateQuotation()` | **核心**：先存库（失败也继续），再用 `uni.createCanvasContext` 绘制完整报价单（Logo、公司信息、表格明细、备注、签章区），最后 `canvasToTempFilePath` + `saveImageToPhotosAlbum` 存到相册 |
| `drawText(ctx, text, x, y, maxWidth, lineHeight, fontSize)` | Canvas 自动换行绘制 |

#### [pages/upload-price/upload-price.vue](file:///d:/Code/famen_minip_uni_new/pages/upload-price/upload-price.vue) — 价格库管理页

**职责**：管理员专用页，支持从手机本地或微信聊天记录选择 Excel/CSV 文件，上传到云存储解析预览，确认导入。

| 关键方法 | 说明 |
|---------|------|
| `checkLogin()` | 登录态校验，未登录跳转登录页 |
| `chooseFile()` | ActionSheet 选择「手机本地」或「微信聊天记录」 |
| `chooseLocalFile()` | 跳转 file-picker 页（WebView 方案） |
| `chooseFromChat()` | `uni.chooseMessageFile` 选择 xlsx/xls/csv |
| `parseFile(file)` | 调用 `priceApi.importFile()` 解析 |
| `handleParseResult(result)` | 区分 integrated 与普通类型填充预览；处理多工作表 |
| `confirmImport()` | 调用 `priceApi.confirmImport()` 执行导入 |
| `downloadTemplate()` | 下载导入模板 |

支持 4 种导入类型：`integrated`（整合模板）、`price`（价格库）、`material`（材质配置）、`material_lib`（材质库）。

#### [pages/login/login.vue](file:///d:/Code/famen_minip_uni_new/pages/login/login.vue) — 登录页

**职责**：用户名密码登录，成功后保存用户信息跳转价格库管理页。

- `handleLogin()` — 调用 `userApi.login()`，成功后 `storage.saveUser()` 并跳转 `/pages/upload-price/upload-price`
- `canSubmit` — computed，用户名密码非空且非加载中

#### [pages/file-picker/file-picker.vue](file:///d:/Code/famen_minip_uni_new/pages/file-picker/file-picker.vue) — WebView 文件选择页

**职责**：通过 WebView 加载 CloudBase 静态托管的 HTML 页面，借助 `<input type="file">` 调起系统原生文件选择器，选中后 base64 回传给小程序。

| 关键方法 | 说明 |
|---------|------|
| `handleMessage(e)` | 处理 WebView postMessage，`file-selected` 类型触发文件保存 |
| `saveReceivedFile(fileMsg)` | base64 → `wx.base64ToArrayBuffer` → `writeFileSync` 写入临时文件 → 存 `globalData.pickedFile` |
| `handleError(e)` | 仅 `not in domain list` 错误自动返回 |

**数据流**：file-picker.html → postMessage base64 → file-picker.vue 写临时文件 → globalData.pickedFile → upload-price.vue onShow 消费。

---

### 5.4 公共组件

#### [components/navigation-bar/navigation-bar.vue](file:///d:/Code/famen_minip_uni_new/components/navigation-bar/navigation-bar.vue)

自定义导航栏组件，被所有业务页面引入。

| 特性 | 说明 |
|------|------|
| 胶囊按钮适配 | `uni.getMenuButtonBoundingClientRect` 计算右侧 padding |
| 安全区适配 | `uni.getWindowInfo` 获取安全区，Android/devtools 额外 padding-top |
| Props | `title`、`background`、`color`、`back`、`loading`、`homeButton`、`show`、`animated`、`delta` |
| Slots | left / center / right（`multipleSlots: true`） |
| `handleBack()` | 默认 `uni.navigateBack({delta})`，并 `$emit('back')` 供页面自定义 |

---

## 6. Admin 后台管理模块

### 6.1 应用入口与路由

#### [admin/src/main.js](file:///d:/Code/famen_minip_uni_new/admin/src/main.js)

入口文件，`createApp(App)` → `app.use(Antd)` → `app.use(router)` → `app.mount('#app')`。

#### [admin/src/App.vue](file:///d:/Code/famen_minip_uni_new/admin/src/App.vue)

根组件，定义侧边栏 + 头部 + 内容布局。

**菜单结构（9 项，分两组）**：

| 分组 | key | 图标 | 文字 |
|------|-----|------|------|
| 产品配置 | series | AppstoreOutlined | 产品系列 |
| | model | TagsOutlined | 阀门型号 |
| | price | DollarOutlined | 价格管理 |
| | material | BgColorsOutlined | 材质配置 |
| | coefficient | PercentageOutlined | 报价系数 |
| | material-diff | SwapOutlined | 材质价差 |
| | material-lib | DatabaseOutlined | 材质库 |
| 人员管理 | salesperson | UserOutlined | 营销员管理 |
| | customer | TeamOutlined | 客户管理 |

- `handleLogout()` — 清除 `admin_token` 并跳转 `/login`
- `isLoginPage` — computed，登录页仅渲染 `<router-view>` 不显示布局

#### [admin/src/router/index.js](file:///d:/Code/famen_minip_uni_new/admin/src/router/index.js)

**路由表（11 条）**，全部采用动态 `import()` 懒加载。

**全局守卫 `router.beforeEach`**：
- 访问 `/login`：有 `admin_token` → 重定向 `/series`；无 → 放行
- 访问其他页：无 `admin_token` → 重定向 `/login`

---

### 6.2 API 调用层

#### [admin/src/api/index.js](file:///d:/Code/famen_minip_uni_new/admin/src/api/index.js)

**核心 API 封装层**，所有业务调用最终汇聚到 `price` 云函数（登录用 `user` 云函数）。

**初始化与鉴权**：
- `cloudbase.init({ env: 'cloud1-d2g6k45v21dd52696' })`
- `ensureAuth()` — 懒加载匿名登录，`persistence: 'local'`，结果缓存到 `authReady` Promise

**内部方法**：
- `callCloudFunction(data)` — 调用 `price` 云函数，校验 `result.success`
- `uploadFile(file)` — FileReader 读取 base64 → 调用 `price` 云函数 `action: 'uploadImage'`
- `getFileUrl(fileID)` — `app.getTempFileURL` 获取临时 URL

**导出的 API 对象**（除 `userApi` 调用 `user` 云函数外，其余均调用 `price` 云函数）：

| API 对象 | 模块 | 方法 |
|---------|------|------|
| `seriesApi` | 产品系列 | getAll, create, update, delete, **deleteCascade**(级联删除) |
| `modelApi` | 阀门型号 | getAll, getBySeries, create, update, delete |
| `priceApi` | 价格管理 | getAll, getBySeries, create, update, delete |
| `materialApi` | 材质配置 | getAll, getBySeries, create, update, delete |
| `coefficientApi` | 报价系数 | getAll, create, update, delete |
| `materialDiffApi` | 材质价差 | getAll, create, update, delete |
| `materialLibApi` | 材质库 | getAll, create, update, delete |
| `salespersonApi` | 营销员 | getAll, create, update, delete |
| `customerApi` | 客户 | getAll(支持 salespersonId 筛选), create, update, delete |
| `userApi` | 用户登录 | login（调用 `user` 云函数） |

---

### 6.3 视图页面详解

所有视图页面统一采用 Vue 3 `<script setup>` + Ant Design Vue（a-card + a-table + a-modal + a-form）+ CloudBase 云函数调用模式。

#### [admin/src/views/Login/index.vue](file:///d:/Code/famen_minip_uni_new/admin/src/views/Login/index.vue) — 登录页

- `handleLogin()` — 调用 `userApi.login()`，校验 `result.role === 'admin'`，成功存 `admin_token` 到 localStorage

#### [admin/src/views/Series/index.vue](file:///d:/Code/famen_minip_uni_new/admin/src/views/Series/index.vue) — 产品系列管理

**唯一支持图片上传和级联删除的页面**。

| 方法 | 说明 |
|------|------|
| `handleImageUpload(e)` | 校验 ≤2MB、jpeg/png/gif/webp，调 `uploadFile` 上传 |
| `delCascade(record)` | 级联删除（带 a-popconfirm 二次确认），调 `seriesApi.deleteCascade`，删除系列及所有型号/价格/材质/系数/价差 |
| `edit(record)` | 编辑时若 image 为 `cloud://` 开头，调 `getFileUrl` 获取临时 URL 预览 |

#### [admin/src/views/Model/index.vue](file:///d:/Code/famen_minip_uni_new/admin/src/views/Model/index.vue) — 阀门型号管理

- 支持按系列筛选；`getAll()` 返回按系列分组对象，需前端 `flatMap` 展平
- 编辑时字段名映射 `type ↔ typeCode`

#### [admin/src/views/Price/index.vue](file:///d:/Code/famen_minip_uni_new/admin/src/views/Price/index.vue) — 价格管理

- 表格横向滚动（`scroll: { x: 1200 }`）
- 每条记录含多档价格（手动/气动/电装/伞齿轮）+ 磨标费 + 起订量 + 状态
- 价格列前缀 `¥`；状态列用 a-tag（green 启用/red 禁用）

#### [admin/src/views/Material/index.vue](file:///d:/Code/famen_minip_uni_new/admin/src/views/Material/index.vue) — 材质配置管理

- 配置某系列某型号阀门各部件的默认材质（阀体/闸板/阀杆/支架）
- 四类材质用不同颜色 a-tag（cyan/geekblue/purple/orange）

#### [admin/src/views/Coefficient/index.vue](file:///d:/Code/famen_minip_uni_new/admin/src/views/Coefficient/index.vue) — 报价系数管理

- 管理报价系数规则，按系列/DN范围/MOQ 定义「达到MOQ」和「未达MOQ」两套系数（磨标OEM / 原装）
- 系数列用 a-tag 显示 `×{value}`，颜色按值分级（>1.5 红、>1.2 橙、其他绿）
- 表单用 a-divider 分「达到 MOQ」和「未达 MOQ」两组

**字段含义**：
| 字段 | 含义 |
|------|------|
| moqMetOemCoeff | 达到起订量 × 磨标(OEM) 系数 |
| moqMetOriginalCoeff | 达到起订量 × 原装 系数 |
| moqUnmetOemCoeff | 未达起订量 × 磨标(OEM) 系数 |
| moqUnmetOriginalCoeff | 未达起订量 × 原装 系数 |

#### [admin/src/views/MaterialDiff/index.vue](file:///d:/Code/famen_minip_uni_new/admin/src/views/MaterialDiff/index.vue) — 材质价差管理

- 管理材质升级/替换的价差规则，按部位、基础材质→目标材质、DN 规格范围定义
- `partMap`: `{ body: '阀体', gate_plate: '闸板', stem: '阀杆', yoke: '支架' }`
- 价差列：正数红色 `+¥`，非正数绿色 `¥`

#### [admin/src/views/MaterialLib/index.vue](file:///d:/Code/famen_minip_uni_new/admin/src/views/MaterialLib/index.vue) — 材质库管理

- 全局材质字典库管理（材质代码、名称、分类、适用部位）
- **唯一不依赖系列的业务页面**

#### [admin/src/views/Salesperson/index.vue](file:///d:/Code/famen_minip_uni_new/admin/src/views/Salesperson/index.vue) — 营销员管理

- 最简单的 CRUD 页面，无外键关联

#### [admin/src/views/Customer/index.vue](file:///d:/Code/famen_minip_uni_new/admin/src/views/Customer/index.vue) — 客户管理

- 支持按营销员筛选（后端筛选）、按姓名/电话搜索（前端过滤）
- 客户归属于营销员（多对一），提交前从 salespersonList 反查 salespersonName

---

## 7. 云函数模块

所有云函数基于 `@cloudbase/node-sdk`，环境 ID `cloud1-d2g6k45v21dd52696`，通过 `event.action` 路由分发。

### 7.1 price — 核心数据中枢

- **文件**：[cloudfunctions/price/index.js](file:///d:/Code/famen_minip_uni_new/cloudfunctions/price/index.js)（991 行，体量最大）
- **依赖**：`@cloudbase/node-sdk`、`ws`
- **超时**：30 秒
- **职责**：价格查询 + 后台全量 CRUD + 营销员/客户管理 + 图片上传，承载 9 张表共 34 个 action

**内置辅助函数**：
- `selectAll(db, collection)` — 分页循环绕过 RDB 1000 行限制，实现全量查询
- `mapPriceRow(row)` — 数据库下划线命名转前端驼峰命名
- `now()` — 生成 `YYYY-MM-DD HH:mm:ss` 格式时间戳（替代 `new Date()`）

**Action 分类**：

| 分类 | Action 列表 | 涉及表 |
|------|------------|--------|
| 查询类(10) | getPrices, getAllSeries, getAllModels, getModelsBySeries, getPricingRules, getMaterials, getMaterialByModel, getMaterialDiffs, getMaterialDiff, getAllMaterials | product_series, valve_models, price_table, valve_model_materials, pricing_rules, material_price_diffs |
| 系列CRUD(4) | createSeries, updateSeries, deleteSeries, **deleteSeriesCascade** | product_series, valve_models, price_table, valve_model_materials, pricing_rules, material_price_diffs |
| 型号CRUD(3) | createModel, updateModel, deleteModel | valve_models, price_table, valve_model_materials |
| 价格CRUD(3) | createPrice, updatePrice, deletePrice | price_table, valve_models |
| 材质配置CRUD(3) | createMaterial, updateMaterial, deleteMaterial | valve_model_materials |
| 报价系数CRUD(3) | createCoefficient, updateCoefficient, deleteCoefficient | pricing_rules |
| 材质价差CRUD(3) | createMaterialDiff, updateMaterialDiff, deleteMaterialDiff | material_price_diffs |
| 材质库CRUD(4) | getMaterialLib, createMaterialLib, updateMaterialLib, deleteMaterialLib | materials |
| 营销员CRUD(4) | getSalespersons, createSalesperson, updateSalesperson, deleteSalesperson | salespersons |
| 客户CRUD(4) | getCustomers, createCustomer, updateCustomer, deleteCustomer | customers |
| 图片上传(1) | uploadImage | 云存储 series_images/ |

**关键 action 详解**：

**`deleteSeriesCascade`**（级联删除，最重要）：
- 支持通过 `id` 或 `name` 入参
- 完整级联：查系列下所有型号 → 逐型号删除 price_table 和 valve_model_materials → 删除所有 valve_models → 删除 pricing_rules 和 material_price_diffs（按 series_name）→ 删除 product_series
- 涉及 5 张表，返回删除统计

**`getPrices`**：
- 有 series 时：查 product_series → valve_models → 全量查 price_table 内存过滤 `status === 'enabled'`
- 无 series 时：全量查 price_table，并行查 valve_models 和 product_series 构建映射

**`uploadImage`**：base64 → Buffer → 上传到 `series_images/` → 获取临时 URL 返回

---

### 7.2 quotation — 报价单引擎

- **文件**：[cloudfunctions/quotation/index.js](file:///d:/Code/famen_minip_uni_new/cloudfunctions/quotation/index.js)（228 行）
- **依赖**：`@cloudbase/node-sdk`
- **超时**：30 秒
- **职责**：报价单 CRUD + 价格计算引擎

**价格计算逻辑**：

| 函数 | 职责 |
|------|------|
| `calcItemPrice(item)` | 查 valve_models → price_table → 校验状态与起订量 → calcUnitPrice → 加磨标费 |
| `calcUnitPrice(item, p)` | getBasePrice（按型号名关键词匹配）+ 闸板价差 + 阀杆价差 |
| `getBasePrice(item, p)` | 含"气动"→pneumatic_price、含"电装"→electric_price、含"伞齿轮"→gear_price、默认 manual_price |
| `calcBatch(items)` | 批量计算，逐项 try-catch，汇总总价和错误列表 |

**Action 列表（5 个）**：

| Action | 职责 | 涉及表 |
|--------|------|--------|
| createQuotation | calcBatch 计算价格 → 生成 qid → insert quotations → 逐条 insert quotation_items | valve_models, price_table, quotations, quotation_items |
| getQuotationList | 分页查询（select + count + range），按 created_at 降序 | quotations |
| getQuotationDetail | 查 quotations → 查 quotation_items by quotation_id | quotations, quotation_items |
| updateQuotation | 更新报价单头信息（不重算明细） | quotations |
| deleteQuotation | 先删 quotation_items 再删 quotations（级联删除） | quotation_items, quotations |

---

### 7.3 import — Excel 导入

- **文件**：[cloudfunctions/import/index.js](file:///d:/Code/famen_minip_uni_new/cloudfunctions/import/index.js)（1131 行，第二大）
- **依赖**：`@cloudbase/node-sdk`、`xlsx`
- **超时**：120 秒（最长，因导入耗时）
- **职责**：Excel 文件解析与数据导入，支持 7 种工作表类型自动识别

**工作表类型识别**（`detectSheetType`，按优先级）：

| 类型 | 表头特征 |
|------|---------|
| series | 系列名称, 系列图片 |
| model | 所属系列, 型号名称, 类型编码 |
| price | 阀门型号, 规格DN, 手动价格, 气动价格... |
| material | 阀门型号, 阀体材质, 闸板材质, 阀杆材质, 支架材质 |
| coeff | 9 列报价系数表头 |
| material_diff | 8 列材质价差表头 |
| material_lib | 5 列材质库表头 |

**Action 列表（2 个）**：

| Action | 职责 |
|--------|------|
| parseFile | 下载文件 → XLSX.read → 自动识别工作表类型 → 逐行解析校验 → 返回预览数据 + 失败行 + 系数规则 |
| confirmImport | 按 importType 分发：integrated → confirmIntegratedImport；material → confirmMaterialImport；material_lib → confirmMaterialLibImport；其他 → confirmPriceImport |

**导入子流程**：

- **`confirmIntegratedImport`**（整合导入，6 阶段）：
  1. 导入产品系列（upsert by name）
  2. 导入阀门型号（upsert by name）
  3. 导入价格数据（upsert by model_id + size）
  4. 导入材质数据（upsert by model_id）
  5. 导入报价系数（upsert by series_name + dn_min + dn_max）
  6. 导入材质价差（upsert by series_name + part_name + base_material + target_material + dn_min + dn_max）

- **`confirmPriceImport`**：价格 upsert + 报价系数 upsert
- **`confirmMaterialImport`**：材质配置 upsert by model_id
- **`confirmMaterialLibImport`**：材质库 upsert by material_code

**部位映射 `PART_MAP`**：`{ 阀体: 'body', 阀杆: 'stem', 闸板: 'gate_plate', 支架: 'yoke' }`

---

### 7.4 template — 模板生成

- **文件**：[cloudfunctions/template/index.js](file:///d:/Code/famen_minip_uni_new/cloudfunctions/template/index.js)（357 行）
- **依赖**：`@cloudbase/node-sdk`、`xlsx`
- **超时**：10 秒
- **职责**：生成 Excel 导入模板并上传云存储，返回临时下载 URL

**Action 路由**：
- `action === 'materialLibrary'` → `generateMaterialLibraryTemplate()`（材质库模板，2 个工作表）
- 其他 → 完整产品数据导入模板（7 个工作表：产品系列、阀门型号、价格数据、材质配置、报价系数、材质价差、导入说明）

**生成流程**：`book_new()` → `aoa_to_sheet()` → `book_append_sheet()` → `XLSX.write(buffer)` → `uploadFile` → `getTempFileURL`

---

### 7.5 images — 图片获取

- **文件**：[cloudfunctions/images/index.js](file:///d:/Code/famen_minip_uni_new/cloudfunctions/images/index.js)（47 行，最简）
- **依赖**：`@cloudbase/node-sdk`
- **超时**：10 秒
- **职责**：批量获取产品系列图片的临时访问 URL

**特点**：
- 无 action 路由，单一入口
- 内置 25 个硬编码系列名列表
- 云存储路径前缀：`cloud://cloud1-d2g6k45v21dd52696.636c-cloud1-d2g6k45v21dd52696-1441744670/images/`
- 文件名规则：系列名去掉"系列"后缀 + `.png`
- 一次性 `app.getTempFileURL({ fileList })` 批量获取

---

### 7.6 user — 用户管理

- **文件**：[cloudfunctions/user/index.js](file:///d:/Code/famen_minip_uni_new/cloudfunctions/user/index.js)（143 行）
- **依赖**：`@cloudbase/node-sdk`、`bcryptjs`
- **超时**：20 秒
- **职责**：用户认证与管理

**Action 列表（7 个）**：

| Action | 职责 |
|--------|------|
| login | 查 users by username → 校验 status='active' → bcrypt.compare 校验密码 → 返回安全用户对象 |
| register | 检查用户名唯一 → bcrypt.hash(password, 6) → insert users（role='user', status='active'） |
| getProfile | 查 users by id，返回时剔除 password 和 _openid |
| getAllUsers | 全量查询，仅返回安全字段 |
| updateUser | 更新 nickname/email/phone/role/status |
| changePassword | 校验原密码 → bcrypt 加密新密码 → update |
| deleteUser | 物理删除 |

**安全特性**：密码 bcrypt 加密（salt rounds=6）；返回用户对象统一剔除 `password` 和 `_openid`。

---

### 7.7 migration — 数据迁移

- **文件**：[cloudfunctions/migration/index.js](file:///d:/Code/famen_minip_uni_new/cloudfunctions/migration/index.js)（83 行）
- **依赖**：`@cloudbase/node-sdk`、`bcryptjs`
- **超时**：30 秒
- **职责**：系统初始化与数据库连接测试

**Action 列表（3 个）**：

| Action | 职责 |
|--------|------|
| createDefaultUser | 创建/重置默认管理员（admin/admin123），已存在则重置密码 |
| test | 静态返回部署成功信息 |
| testDb | 查 users limit 1，验证数据库连通性 |

---

### 7.8 admin — 已废弃

- **文件**：[cloudfunctions/admin/index.js](file:///d:/Code/famen_minip_uni_new/cloudfunctions/admin/index.js)（498 行）
- **状态**：**已废弃**，功能已被 price 云函数完全覆盖替代

**废弃依据**：
1. 所有 20 个 action 在 price 中存在且实现更完整
2. admin 使用 `new Date()`，price 使用 `now()` 格式化字符串（符合项目规范）
3. admin 缺少查询接口（仅有 CUD 部分）
4. admin `_openid` 统一用 `'admin'`，price 不设置

**建议**：可安全删除，所有 CRUD 操作使用 price 云函数。

---

## 8. 数据库设计

系统共 12 张表，全部存储在 CloudBase 云数据库中。

### 8.1 表关系总览

```
product_series (产品系列)
  └── valve_models (阀门型号)  [series_id 关联]
        ├── price_table (价格表)  [model_id 关联]
        ├── valve_model_materials (材质配置)  [model_id 关联]
        └── quotation_items (报价单明细)  [model_id 关联]

pricing_rules (报价系数)  [series_name 关联]
material_price_diffs (材质价差)  [series_name 关联]
materials (材质库)  [独立字典]

salespersons (营销员)
  └── customers (客户)  [salesperson_id 关联]

quotations (报价单主表)
  └── quotation_items (报价单明细)  [quotation_id 关联]

users (用户)  [独立]
```

### 8.2 表结构说明

#### product_series — 产品系列
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT PK | 主键 |
| name | VARCHAR | 系列名称 |
| image | VARCHAR | 系列图片（cloud:// fileID 或 URL） |
| created_at / updated_at | DATETIME | 时间戳 |

#### valve_models — 阀门型号
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT PK | 主键 |
| series_id | INT | 所属系列 ID |
| name | VARCHAR | 型号名称（如 QH6Q3H-10C） |
| type / type_code | VARCHAR | 类型编码（57/67/97 等） |
| created_at / updated_at | DATETIME | 时间戳 |

#### price_table — 价格表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT PK | 主键 |
| model_id | INT | 关联 valve_models.id |
| valve_name | VARCHAR | 阀门型号名 |
| size | INT | DN 规格 |
| manual_price | DECIMAL | 手动价格 |
| pneumatic_price | DECIMAL | 气动价格 |
| electric_price | DECIMAL | 电装价格 |
| gear_price | DECIMAL | 伞齿轮价格 |
| branding_fee | DECIMAL | 磨标费 |
| min_order_qty | INT | 起订量（默认 50） |
| status | VARCHAR | 状态（enabled/disabled） |
| remark | TEXT | 备注 |

#### valve_model_materials — 材质配置
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT PK | 主键 |
| model_id | INT | 关联 valve_models.id |
| body_material | VARCHAR | 阀体材质 |
| gate_plate_material | VARCHAR | 闸板材质 |
| stem_material | VARCHAR | 阀杆材质 |
| yoke_material | VARCHAR | 支架材质 |
| remark | TEXT | 备注 |

#### pricing_rules — 报价系数规则
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT PK | 主键 |
| series_name | VARCHAR | 系列名称 |
| product_name | VARCHAR | 产品名（空表示通用规则） |
| dn_min / dn_max | INT | DN 范围 |
| min_order_qty | INT | 起订量 |
| moq_met_oem_coeff | DECIMAL | 达到MOQ×磨标 系数 |
| moq_met_original_coeff | DECIMAL | 达到MOQ×原装 系数 |
| moq_unmet_oem_coeff | DECIMAL | 未达MOQ×磨标 系数 |
| moq_unmet_original_coeff | DECIMAL | 未达MOQ×原装 系数 |

#### material_price_diffs — 材质价差
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT PK | 主键 |
| series_name | VARCHAR | 系列名称 |
| part_name | VARCHAR | 部位（body/gate_plate/stem/yoke） |
| base_material | VARCHAR | 基础材质 |
| target_material | VARCHAR | 目标材质 |
| dn_min / dn_max | INT | DN 范围 |
| price_diff | DECIMAL | 价差（可为负） |
| remark | TEXT | 备注 |

#### materials — 材质库
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT PK | 主键 |
| material_code | VARCHAR | 材质代码（如 WCB、SS304） |
| material_name | VARCHAR | 材质名称 |
| category | VARCHAR | 分类 |
| applicable_parts | VARCHAR | 适用部位 |
| remark | TEXT | 备注 |

#### salespersons — 营销员
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT PK | 主键 |
| name | VARCHAR | 姓名 |
| phone | VARCHAR | 电话 |
| email | VARCHAR | 邮箱 |
| department | VARCHAR | 部门 |
| status | TINYINT | 状态（1启用/0禁用） |
| remark | TEXT | 备注 |

#### customers — 客户
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT PK | 主键 |
| name | VARCHAR | 姓名/公司名称 |
| salesperson_id | INT | 所属营销员 ID |
| salesperson_name | VARCHAR | 营销员姓名（冗余字段） |
| phone / email / company / address | VARCHAR | 联系信息 |
| status | TINYINT | 状态 |
| remark | TEXT | 备注 |

#### quotations — 报价单主表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | VARCHAR PK | 报价单 ID（genId 生成） |
| customer_name | VARCHAR | 客户名 |
| customer_id | INT | 客户 ID |
| salesperson_name / salesperson_id | - | 营销员信息 |
| note | TEXT | 备注 |
| payment_method | VARCHAR | 付款方式 |
| packaging | VARCHAR | 包装方式 |
| quoter / quoter_phone | VARCHAR | 报价员/电话 |
| validity | VARCHAR | 有效期 |
| status | VARCHAR | 状态（draft 等） |
| created_at | DATETIME | 创建时间 |

#### quotation_items — 报价单明细
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT PK | 主键 |
| quotation_id | VARCHAR | 关联 quotations.id |
| model_id | INT | 关联 valve_models.id |
| 各业务字段 | - | 型号、规格、材质、数量、单价、总价等 |

#### users — 用户表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT PK | 主键 |
| username | VARCHAR | 用户名 |
| password | VARCHAR | 密码（bcrypt 加密） |
| nickname | VARCHAR | 昵称 |
| email / phone | VARCHAR | 联系方式 |
| role | VARCHAR | 角色（admin/user） |
| status | VARCHAR | 状态（active） |
| _openid | VARCHAR | 微信 openid |

---

## 9. 核心业务流程

### 9.1 报价配置与生成流程

```
用户打开小程序
  │
  ▼
product-category 页：选择产品系列
  │ (缓存系列名到 storage)
  ▼
index 页：价格配置与计算
  │ 1. loadDataFromBackend() 并行加载 series/models/pricingRules/materials/materialDiffs
  │ 2. 用户选择阀门型号 → 自动更新可用规格与标准材质
  │ 3. 用户选择 DN 规格 → 自动填入起订量
  │ 4. 实时 updateCurrentPrice():
  │    单价 = (基准价 × 报价系数 + 四类材质价差) × 类型倍率 + 磨标费
  │ 5. onAddToQuote() → 追加到 quoteItems（持久化 storage）
  │ 6. onGenerateQuotation() → URL 参数传给报价单页
  ▼
quotation 页：生成报价单
  │ 1. 选择报价员/客户，填写备注/付款方式
  │ 2. saveQuotationToDatabase() → quotationApi.create() 存库
  │ 3. generateQuotation() → Canvas 绘制报价单图片
  │ 4. saveImageToPhotosAlbum() → 保存到手机相册
  ▼
完成
```

### 9.2 价格库导入流程

```
upload-price 页（需登录）
  │
  ├─ 选择文件来源
  │   ├─ 手机本地 → file-picker 页（WebView）→ globalData.pickedFile
  │   └─ 微信聊天记录 → uni.chooseMessageFile
  │
  ▼
handleSelectedFile() → 校验大小(≤10MB)
  │
  ▼
parseFile() → priceApi.importFile()
  │ 1. wx.cloud.uploadFile 上传到云存储 imports/
  │ 2. 调用 import 云函数 action: 'parseFile'
  │ 3. 云函数：downloadFile → XLSX.read → 自动识别工作表类型 → 逐行解析校验
  │ 4. 返回预览数据 + 失败行 + 统计
  ▼
预览（含失败行与统计）→ 可能需要选工作表
  │
  ▼
confirmImport() → priceApi.confirmImport()
  │ 1. 调用 import 云函数 action: 'confirmImport'
  │ 2. 按 importType 分发（integrated/price/material/material_lib）
  │ 3. 逐条 upsert 到对应数据库表
  │ 4. 返回 created/updated/failed 统计
  ▼
完成
```

### 9.3 Admin 后台管理流程

```
Login 页 → userApi.login() → 校验 role==='admin' → 存 admin_token
  │
  ▼
路由守卫校验 admin_token
  │
  ▼
App.vue 布局 → 9 个菜单项
  │
  ├─ 产品配置组（Series 为基础数据）：
  │   Series → Model → Price / Material / Coefficient / MaterialDiff
  │   MaterialLib（独立字典）
  │
  └─ 人员管理组：
      Salesperson → Customer

所有 CRUD → callCloudFunction() → price 云函数对应 action
```

---

## 10. 项目运行方式

### 10.1 小程序端

**环境要求**：HBuilderX 或 微信开发者工具

**运行步骤**：
1. 用 HBuilderX 打开项目根目录 `d:\Code\famen_minip_uni_new`
2. 安装依赖（如需）：在根目录执行 `npm install`
3. 在 HBuilderX 中点击「运行」→「运行到小程序模拟器」→「微信开发者工具」
4. 首次运行需在微信开发者工具中配置 AppID（`wx33dfe11aacee6513`）

**编译产物**：`unpackage/dist/dev/mp-weixin/`（开发）或 `unpackage/dist/build/mp-weixin/`（生产）

**云函数同步**：运行 [copy-cloudfunctions.bat](file:///d:/Code/famen_minip_uni_new/copy-cloudfunctions.bat) 将 `cloudfunctions/` 复制到编译产物目录

### 10.2 Admin 后台

**环境要求**：Node.js + npm

**运行步骤**：
```bash
cd admin
npm install
npm run dev      # 开发服务器，端口 3000
npm run build    # 生产构建，输出到 admin/dist
npm run preview  # 预览构建产物
```

**配置文件**：
- [admin/vite.config.js](file:///d:/Code/famen_minip_uni_new/admin/vite.config.js) — `base: './'`、`port: 3000`、`outDir: 'dist'`

### 10.3 云函数部署

**方式一：微信开发者工具**
1. 打开编译产物目录 `unpackage/dist/dev/mp-weixin/`
2. 右键 `cloudfunctions/` 下各云函数文件夹 → 「上传并部署：云端安装依赖」

**方式二：CloudBase CLI**
```bash
# 安装 CLI
npm install -g @cloudbase/cli

# 登录并部署
tcb login
tcb fn deploy price --envId cloud1-d2g6k45v21dd52696
```

**依赖安装**：price 云函数需在 `cloudfunctions/price/` 目录执行 `npm install`（含 `ws` 依赖）

---

## 11. 部署与配置

### 11.1 云开发环境配置

**环境 ID**：`cloud1-d2g6k45v21dd52696`

**必须配置项**：

1. **匿名登录**：云开发控制台 → 环境 → 登录授权 → 登录方式 → 启用匿名登录（Admin 端必需）
2. **Web 安全域名**：安全设置 → Web 安全域名 → 添加 `https://cloud1-d2g6k45v21dd52696.tcloudbaseapp.com`（解决 CORS）
3. **数据库表**：创建 12 张表（见第 8 节）
4. **云存储目录**：`series_images/`、`imports/`、`templates/`、`images/`

### 11.2 静态托管配置

**Admin 后台部署**：
1. `cd admin && npm run build` 生成 `dist/`
2. 上传 `dist/` 到 CloudBase 静态网站托管

**file-picker.html 部署**：
1. 上传 [static-hosting/file-picker.html](file:///d:/Code/famen_minip_uni_new/static-hosting/file-picker.html) 到 CloudBase 静态托管根目录
2. 微信后台 → 开发管理 → 业务域名 → 添加 `https://cloud1-d2g6k45v21dd52696-1441744670.tcloudbaseapp.com`
3. 下载校验文件上传到静态托管根目录

### 11.3 数据库初始化

1. 执行 [backend/database/salespersons_customers.sql](file:///d:/Code/famen_minip_uni_new/backend/database/salespersons_customers.sql) 创建营销员/客户表
2. 调用 migration 云函数 `action: 'createDefaultUser'` 创建默认管理员（admin/admin123）
3. 通过 Admin 后台或 Excel 导入添加产品系列、型号、价格、材质等数据

---

## 12. 辅助脚本与工具

### 12.1 根目录脚本

| 文件 | 用途 |
|------|------|
| [copy-cloudfunctions.bat](file:///d:/Code/famen_minip_uni_new/copy-cloudfunctions.bat) | 复制 cloudfunctions 到 uni-app 编译输出目录 |
| [parse_excel.js](file:///d:/Code/famen_minip_uni_new/parse_excel.js) | Excel 解析脚本（本地工具） |
| [parse_excel_v2.js](file:///d:/Code/famen_minip_uni_new/parse_excel_v2.js) | Excel 解析脚本 v2 |
| [export-sql-to-excel.js](file:///d:/Code/famen_minip_uni_new/export-sql-to-excel.js) | SQL 导出为 Excel |
| [split-excel.js](file:///d:/Code/famen_minip_uni_new/split-excel.js) | Excel 文件拆分 |

### 12.2 模板文件

| 文件 | 用途 |
|------|------|
| [template.xlsx](file:///d:/Code/famen_minip_uni_new/template.xlsx) | 产品数据导入模板 |
| [material_import_template.xlsx](file:///d:/Code/famen_minip_uni_new/material_import_template.xlsx) | 材质导入模板 |
| [static-hosting/min_order_coefficient_template.xlsx](file:///d:/Code/famen_minip_uni_new/static-hosting/min_order_coefficient_template.xlsx) | 起订量系数模板 |

### 12.3 数据库备份

[cloudfunctions/db/](file:///d:/Code/famen_minip_uni_new/cloudfunctions/db) 目录下有 6 个 CSV 文件，为数据库按表导出的备份。

---

## 附录：关键约定与规范

基于项目开发经验，以下是必须遵守的约定：

1. **云函数返回格式**：统一 `{ success: true, data: [...] }` 格式，前端兼容
2. **日期格式**：数据库操作必须使用 `YYYY-MM-DD HH:MM:SS` 格式（云函数用 `now()` 函数，不用 `new Date()`）
3. **云函数 SDK**：Node.js 云函数必须用 `@cloudbase/node-sdk`，不能用 `@cloudbase/js-sdk`
4. **排序方法**：CloudBase Node SDK 用 `.order()`，不是 `.orderby()`
5. **材质匹配**：使用 `modelId` 作为主匹配键，不用 `valveName`（不可靠）
6. **图片上传**：必须通过云函数处理，不能前端直调云存储 API（CORS 问题）
7. **Admin 鉴权**：前端调用必须先 `ensureAuth()` 匿名登录，登录态 `persistence: 'local'`
8. **CRUD 云函数**：统一使用 price 云函数，admin 云函数已废弃
9. **Excel 导入**：必须显式指定 sheet 类型（price/material），避免表头校验错误
10. **价格数据**：API 响应必须同时包含 `id`（价格表主键）和 `modelId`（型号 ID），用于材质关联

---

> 文档生成日期：2026-07-11
> 项目版本：1.0.0
> 云环境：cloud1-d2g6k45v21dd52696
