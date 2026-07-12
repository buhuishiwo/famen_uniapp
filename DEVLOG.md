# 微信小程序本地文件选择功能 — 开发日志

## 概述

为「阀门报价系统」微信小程序实现**从手机本地文件系统直接选择 Excel 文件**的功能，替代原有的仅支持从微信聊天记录选择文件的方式。

## 技术方案

### 核心问题

微信小程序没有直接访问手机本地文件系统的 API。`uni.chooseMessageFile` 只能从聊天记录中选择文件。

### 方案选型

采用 **WebView + HTML `<input type="file">`** 方案：

```
用户点击选择文件
  → 小程序打开 WebView 页面
  → WebView 加载 HTML（含 <input type="file">）
  → 触发系统原生文件选择器
  → FileReader 读取文件为 ArrayBuffer
  → 分块编码为 base64
  → wx.miniProgram.postMessage 传回小程序
  → 写入临时文件
  → 走原有云函数导入流程
```

HTML 页面托管在**微信 CloudBase 静态网站托管**（`tcloudbaseapp.com`），无需外部服务器。

### 数据流

```
file-picker.html              file-picker.vue           upload-price.vue
(WebView HTML)                (小程序 WebView 包装页)    (上传页)
      │                             │                        │
      │ <input type="file">         │                        │
      │ FileReader → base64         │                        │
      │ postMessage ──────────────→ │ @message 事件           │
      │                             │ writeFileSync          │
      │                             │ globalData.pickedFile  │
      │ navigateBack ────────────→  │                        │
      │                             │ onUnload ────────────→ │ onShow
      │                             │                        │ checkPickedFile
      │                             │                        │ parseFile → 云函数
```

## 文件清单

### 新建文件

| 文件 | 用途 |
|------|------|
| `static-hosting/file-picker.html` | WebView 加载的 HTML 页面，包含系统文件选择器和文件读取逻辑 |
| `pages/file-picker/file-picker.vue` | 小程序 WebView 包装页面，处理消息接收和数据写入 |

### 修改文件

| 文件 | 变更内容 |
|------|----------|
| `pages/upload-price/upload-price.vue` | 添加双模式文件选择（本地/聊天）、提取公共校验方法 |
| `pages.json` | 注册 file-picker 页面 |

## 部署配置

### 微信后台配置

1. 登录 [mp.weixin.qq.com](https://mp.weixin.qq.com) → 开发 → 开发管理 → 开发设置
2. 业务域名 → 添加：`https://cloud1-d2g6k45v21dd52696-1441744670.tcloudbaseapp.com`
3. 下载校验文件并上传到 CloudBase 静态托管根目录

### CloudBase 静态托管

1. 微信开发者工具 → 云开发 → 静态网站托管
2. 上传 `static-hosting/file-picker.html` 到根目录

> **注意**：静态托管域名需 ICP 备案才能避免微信中间安全拦截页。长期方案建议绑定已备案的自定义域名。

## 功能详情

### upload-price.vue — 双模式文件选择

点击"选择文件"后弹出 ActionSheet：

- **「从手机本地文件选择」**：跳转 file-picker 页面 → WebView 加载 HTML → 系统原生文件选择器
- **「从微信聊天记录选择」**：保留原有 `uni.chooseMessageFile` 方式

公共方法 `handleSelectedFile(file)` 统一处理文件校验和解析，消除重复代码。

### file-picker.html — HTML 文件选择器

**核心实现**：

- `<input type="file" accept=".xlsx,.xls,.csv">` 触发系统文件选择器
- `FileReader.readAsArrayBuffer()` 读取文件
- 分块 `arrayBufferToBase64()` 编码（8KB 分块，避免 `String.fromCharCode.apply` 栈溢出）
- `wx.miniProgram.postMessage()` 传递文件数据
- `wx.miniProgram.navigateBack()` 返回小程序

**UI 特性**：

- 固定顶栏（深色渐变，含「← 返回」按钮和标题）
- 文件选择区域（点击触发系统选择器）
- 文件信息卡片（文件名、大小）
- 进度条反馈（读取进度 + 编码进度）
- 刘海屏安全区域适配（`env(safe-area-inset-top)`）

**加载 JSSDK**：
同步加载 `jweixin-1.6.0.js`，确保 `wx.miniProgram` 桥接就绪。

### file-picker.vue — WebView 包装页

**消息处理**：

- `handleMessage` 处理 WebView 发来的消息
- 优先处理 `go-back` 类型（返回请求）
- 处理 `file-selected` 类型（文件数据）
- `saveReceivedFile` 将 base64 写入临时文件，存入 `globalData`

**错误处理**：

- 仅「域名不在白名单」(`not in domain list`) 错误时自动返回
- 其他错误（如中间拦截页）不自动返回，允许用户继续操作

**文件名处理**：
添加 `Date.now()` 前缀防止重名冲突。

## Bug 修复记录

### Bug #1：域名不在白名单

- **现象**：WebView 加载失败，错误 `web-view load failed due to not in domain list`
- **根因**：最初使用了 `wzyaoyao.com`（第三方域名），后又用了 `tcb.qcloud.la`（未加白名单）
- **修复**：使用 CloudBase 静态托管域名 `tcloudbaseapp.com`，并在微信后台添加业务域名白名单

### Bug #2：打开页面后立即自动返回

- **现象**：跳转到 file-picker 页面后 1.5 秒自动返回，控制台输出"文件选择器已关闭（未选择文件）"
- **根因**：未备案域名的中间安全拦截页触发了 WebView `error` 事件，而 `handleError` 对所有 error 都自动 `navigateBack`
- **修复**：`handleError` 仅对 `not in domain list` 错误自动返回，其他 error 不处理

### Bug #3：导航栏显示为黑色

- **现象**：file-picker 页面顶部全黑，看不到返回按钮
- **根因**：项目使用 Skyline 渲染引擎，`web-view` 作为原生组件**强制覆盖全屏**，无论 `navigationStyle` 设 `default` 还是 `custom`，小程序导航栏都会被 web-view 遮挡
- **修复**：在 HTML 页面内部实现固定顶栏，替代小程序导航栏。深色渐变背景 + 「← 返回」按钮 + 居中标题

### Bug #4：HTML 中返回按钮无效

- **现象**：点击 HTML 中的返回按钮无反应，在 H5 环境正常但在小程序中无效
- **根因**（多个）：
  1. 代码包在 IIFE 中但 `onclick="goBack()"` 在全局作用域查找函数 → 找不到
  2. 异步加载 JSSDK 导致 `wx.miniProgram` 桥接未就绪
  3. 仅用 `wx.miniProgram.navigateBack` 单一方案，无兜底
- **修复**：
  1. 去掉 inline `onclick`，改用 `addEventListener` 绑定事件
  2. JSSDK 改回同步加载（`<script src="...">` 而非动态注入）
  3. 双重保障：`navigateBack` API + `postMessage({type: 'go-back'})` 兜底
  4. `file-picker.vue` 处理 `go-back` 消息类型，调用 `uni.navigateBack()`

## 性能优化

### HTML 端

| 优化项 | 优化前 | 优化后 |
|--------|--------|--------|
| 文件读取 | `readAsDataURL` → 产生 data URL 前缀 → `split` 截取 | `readAsArrayBuffer` → 直接分块编码 |
| base64 编码 | 单次 `String.fromCharCode.apply`（大文件栈溢出风险） | 8KB 分块处理 |
| 进度反馈 | 无 | 进度条（读取 + 编码双阶段） |
| DOM 查询 | 多次 `getElementById` | 启动时缓存引用（`$` 函数） |

### Vue 端

| 优化项 | 优化前 | 优化后 |
|--------|--------|--------|
| 校验逻辑 | `chooseFromChat` 和 `checkPickedFile` 各自复制粘贴 | 提取 `handleSelectedFile` 公共方法 |
| 文件名 | 直接使用原始文件名 | `Date.now()` 前缀防冲突 |
| 代码结构 | 冗余 `async`/`await`（实际无异步操作） | 清理误导性的 async 声明 |
| 错误退出 | 嵌套 if 判断 | 提前 return 扁平化 |

## 文件关键代码索引

| 文件 | 关键行 | 功能 |
|------|--------|------|
| [static-hosting/file-picker.html](static-hosting/file-picker.html#L148-L152) | 148-152 | 导航栏和返回按钮 |
| [static-hosting/file-picker.html](static-hosting/file-picker.html#L166-L167) | 166-167 | 分块 base64 编码函数 |
| [static-hosting/file-picker.html](static-hosting/file-picker.html#L205-L225) | 205-225 | 文件确认和读取逻辑 |
| [static-hosting/file-picker.html](static-hosting/file-picker.html#L272-L284) | 272-284 | goBack 双重保障 |
| [pages/file-picker/file-picker.vue](pages/file-picker/file-picker.vue#L34-L54) | 34-54 | handleMessage 消息路由 |
| [pages/file-picker/file-picker.vue](pages/file-picker/file-picker.vue#L60-L85) | 60-85 | saveReceivedFile 文件写入 |
| [pages/file-picker/file-picker.vue](pages/file-picker/file-picker.vue#L106-L121) | 106-121 | handleError 错误分级处理 |
| [pages/upload-price/upload-price.vue](pages/upload-price/upload-price.vue#L204-L216) | 204-216 | 双模式文件选择入口 |
| [pages/upload-price/upload-price.vue](pages/upload-price/upload-price.vue#L243-L252) | 243-252 | handleSelectedFile 公共校验 |
| [pages/upload-price/upload-price.vue](pages/upload-price/upload-price.vue#L275-L284) | 275-284 | checkPickedFile 全局数据读取 |

## 已知限制

1. **ICP 备案**：CloudBase 静态托管默认域名未备案，首次加载会显示微信安全提示页，用户需点击「继续访问」。绑定已备案自定义域名可消除此问题。

2. **文件大小**：当前限制 10MB。通过 postMessage 传递 base64 数据（增大约 33%），大文件传输耗时会增加。

3. **Skyline 渲染器**：web-view 强制覆盖全屏，无法使用小程序原生导航栏，HTML 内部自行实现顶栏。

4. **仅微信小程序**：WebView 方案仅在微信小程序环境下测试。H5/App 端可直接使用 `uni.chooseFile` API。

---

**开发日期**：2026-07-05  
**关联分支**：main  
**关联提交**：待提交
