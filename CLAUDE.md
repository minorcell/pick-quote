# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

**拾句（Pick Quote）** 是一款轻量级浏览器插件，用于在浏览网页时快速收藏灵感片段。用户可以保存文本、图片、链接和页面快照，并自动保留上下文信息。所有数据仅存储在本地 IndexedDB 中，不上传服务器。

技术栈：Plasmo 框架、React、TypeScript、Material-UI、html2canvas

## 开发命令

```bash
# 安装依赖（使用 pnpm）
pnpm install

# 开发模式（支持热重载）
pnpm dev

# 生产构建
pnpm build

# 打包扩展用于分发
pnpm package
```

## 架构概览

### 浏览器扩展结构

这是一个基于 Plasmo 框架的浏览器扩展，包含三个主要执行上下文：

1. **后台脚本**（`src/background.ts`）：Service Worker，负责创建右键菜单和处理条目捕获
2. **内容脚本**（`src/contents/capture.ts`）：注入到网页中，用于捕获选中内容的上下文，处理快捷键（Ctrl+Shift+S）
3. **选项页面**（`src/options.tsx`）：完整的 React 应用，用于管理已保存的条目（点击扩展图标或通过 options_ui 打开）

### 数据流

```
用户操作（右键菜单/快捷键）
  → 内容脚本捕获上下文
  → 后台脚本接收消息
  → 条目保存到 IndexedDB（src/lib/db.ts）
  → 选项页面显示条目
```

### 核心数据模型

所有捕获的条目遵循 `src/lib/types.ts` 中定义的 `Item` 接口：

- **type**：条目类型 "text" | "image" | "link" | "snapshot"
- **content**：捕获的内容（文本字符串、图片 URL 或快照的 data URL）
- **context**：可选的前后文本和段落上下文（用于文本选择）
- **source**：元数据，包括页面标题、URL、主机名、CSS 选择器和锚点
- **hash**：自动生成的内容哈希，用于去重（相同 URL 的相同内容会被拒绝）

### 数据库层

`src/lib/db.ts` 中的 IndexedDB 封装：

- 数据库名：`pickquote-db`（当前版本 2）
- 主存储：`items`，包含 type、createdAt、sourceSite、categoryId、hash 索引
- 分类支持存在但在 UI 中实现较少
- 迁移逻辑处理从 v1 版本移除已弃用的 "tags" 索引

**重要**：所有数据库操作使用 `withStore` 辅助函数，该函数正确管理事务和连接。

### 导出系统

两种导出机制：

1. **ZIP 导出**（`src/lib/export.ts`）：将所有条目导出为 Markdown，并嵌入图片

   - 图片从 data URL 提取并保存到 `images/` 文件夹
   - Markdown 文件使用相对路径引用图片

2. **图片卡片导出**（`src/lib/imageExport.ts`）：使用 html2canvas 将单个条目导出为可分享的 PNG 卡片
   - 由 ShareCard 组件使用，用于社交媒体分享
   - 渲染带有引文和来源署名的样式化卡片

### UI 主题

`src/lib/theme.ts` 中的自定义 Material-UI 主题，采用"文艺风格"：

- 仅浅色模式，温暖的米白色背景（#faf9f7）
- 衬线字体（Noto Serif SC、Songti SC）营造文艺感
- 柔和配色：蓝灰色主色（#6b7785）、棕灰色辅色（#9c8b7a）
- 圆角边框（12px）和柔和阴影
- 高行高（1.8）提升可读性

### 右键菜单集成

扩展在安装时注册四个右键菜单项：

- 选中文本 → "拾句 → 存入灵感库"
- 图片 → "拾句 → 保存带来源图片"
- 链接 → "拾句 → 仅存链接"
- 页面 → "拾句 → 页面截图（可视区域）"

## 关键实现细节

### 上下文捕获

当文本被选中时，`src/contents/capture.ts` 提取：

- 选中内容前后各 10 个字符
- 包含选中内容的完整段落
- CSS 选择器路径（最多 5 层深度，使用 nth-of-type）

这为未来的"跳转到原始上下文"功能提供支持。

### 去重策略

条目通过内容哈希 + 源 URL 去重（见 `src/lib/db.ts:60-78`）。哈希在 `src/lib/utils.ts` 中使用简单的字符串哈希算法计算。来自同一页面的相同内容会被静默拒绝。

### 瀑布流布局

选项页面使用 CSS column-count 实现瀑布流布局（`src/options.tsx:187`）：

- 移动端（xs）：1 列
- 平板（sm）：2 列
- 桌面（md）：3 列

使用 `break-inside: avoid` 防止条目跨列分割。

### 粘性标题与紧凑模式

选项页面标题（`src/options.tsx:56-69`）根据滚动位置在展开和紧凑模式之间切换：

- 滚动位置 >= 120px 时进入紧凑模式
- 滚动位置 <= 60px 时展开
- 使用 cubic-bezier 缓动函数实现平滑过渡

## 浏览器权限

在 `package.json` 的 manifest 部分声明：

- `contextMenus`：右键菜单集成
- `activeTab`、`tabs`：访问当前页面信息
- `scripting`：内容脚本注入
- `storage`：Chrome storage API（虽然项目使用 IndexedDB）
- `host_permissions`：所有 HTTP/HTTPS 站点

## 重要提示

- 数据仅存储在本地，没有后端服务器
- 图片以 data URL 形式存储在 IndexedDB 中（可能增加存储使用量）
- 长截图功能已移除（见代码注释）
- 分类/标签系统在数据模型中存在，但 UI 中未完全实现
- 点击扩展图标会打开选项页面（完整的标签页管理界面）
