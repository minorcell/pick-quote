# 拾句 - 架构设计文档

## 技术栈

- Plasmo（浏览器扩展框架）
- React 18 + TypeScript
- MUI（UI 组件库）
- IndexedDB（浏览器本地数据存储）

## 整体架构概览

- 扩展组成：Popup、Content Script、Background Service Worker、Options/管理页
- 数据流：Content 捕获 → Background 归一化 → IndexedDB 持久化 → UI 列表/搜索/导出
- 通信：Plasmo/Chrome runtime 消息 + storage 事件，用于跨上下文交互

## 模块划分

- `content/capture`：注入页面，监听选区/右键，提取文本、图片、链接及上下文
- `background/index`：接收捕获数据，补充元信息（标题、URL、时间戳），写入 IndexedDB
- `ui/popup`：轻量入口，最近收藏、快捷搜索、打开管理页
- `ui/options`（管理页）：搜索、分类、标签、编辑、导出
- `db/indexeddb`：数据模型、CRUD、索引、迁移（Dexie 或原生 IDB）
- `utils`：URL 解析、上下文抓取、截图/快照（可选）、去重

## 权限与清单（manifest）

- `permissions`: ["contextMenus", "activeTab", "scripting", "storage"]
- `host_permissions`: ["https://*/*", "http://*/*"]（用于跨站标题/链接获取）
- `background`: service_worker（Plasmo 默认）
- `options_ui`: 管理页入口
- `action`: popup 入口

## 数据模型（IndexedDB）

- 数据库：`pickquote-db`，版本递增管理
- 表：`items`（灵感碎片）、`categories`（分类）、`tags`（标签）、`sources`（来源统计）
- `items` 字段：
  - `id`（主键，uuid）
  - `type`（text|image|link|snapshot）
  - `content`（文本内容/图片数据URL/链接/快照）
  - `context`（选区上下文：前10/后10字、所在段落）
  - `source`：{ title, url, site, selector?, anchor? }
  - `createdAt`（时间戳）
  - `categoryId?`
  - `tags?: string[]`
  - `note?: string`
  - `hash`（内容去重用）
- 索引：`type`, `createdAt`, `source.site`, `categoryId`, `tags`

## 关键流程

1. 文本/图片/链接捕获

- Content 监听：选区（mouseup/selectionchange）、右键菜单（contextMenus）、链接/图片元素
- 提取：内容 + alt 文本 + CSS selector/DOM path + 页面标题/URL
- 发送：`runtime.sendMessage({ kind: "capture", payload })`

2. 后台归一化与存储

- Background 收到消息后：
  - 生成 `id`、`createdAt`、计算 `hash`
  - 去重：若 `hash` + `url` 已存在则提示已保存
  - 写入 IndexedDB：`db.items.add(item)`
  - 可选：创建/更新 `sources` 计数

3. UI 展示与检索

- Popup：近期条目（limit 10）、快速搜索框、打开管理页按钮
- 管理页：列表 + 过滤（关键词、来源、时间）+ 分类/标签编辑 + 导出（Markdown/CSV/卡片）
- 搜索实现：IndexedDB 索引 + 简单全文（对 `content` 做前缀/包含匹配），后续可加轻量全文库

## 组件与页面结构（React + MUI）

- 共用主题：浅色为主，强调可读性；卡片风格（呼吸感）
- `components/ItemCard`：显示内容、来源、时间、操作（编辑/复制/跳转）
- `components/SearchBar`：关键词 + 过滤项
- `pages/Popup`：近期 + 快搜 + 设置入口
- `pages/Options`：主管理页（F 型动线：左上搜索、右侧列表）

## IndexedDB 抽象

- 封装 `db` 单例，暴露：`addItem`, `getRecent`, `searchItems`, `updateItem`, `deleteItem`, `exportItems`
- 采用 Dexie（推荐）或原生 `indexedDB.open`；若无网络安装限制，可用 Dexie 简化索引与查询

## 锚点定位与来源跳转

- 保存时记录 DOM 选择器或自定义 anchor；跳转时尝试滚动至元素位置（content script 注入）
- 失败回退：打开页面并提示在原页面搜索关键词

## 快捷键与反馈

- 快捷键：`Ctrl+Shift+S` 触发保存选区（commands + background 监听）
- 反馈：保存成功弹 Toast（Popup/页面内悬浮），粒子动画由 content script 注入 Canvas/DOM 实现

## 导出

- Markdown：遍历 items 输出 `- [quote] (source)`
- CSV：`content, type, url, createdAt, tags, category`
- 分享卡片：HTML/Canvas 渲染，带水印

## 安全与隐私

- 所有数据仅本地 IndexedDB，不上传
- 不请求不必要权限，透明说明
- 可选：数据备份/导入（用户手动选择文件）

## 版本规划

- v0.1：文本/图片/链接捕获；近期列表；搜索；导出 Markdown/CSV
- v0.2：分类/标签；卡片分享；锚点定位优化
- v0.3：快照&去重优化；UI 打磨；备份/导入

> 注：实现时应保持与 Plasmo 目录规范一致：`contents/`, `background.ts`, `popup.tsx`, `options.tsx`, `components/`, `lib/db.ts`.
