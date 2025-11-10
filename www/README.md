# 拾句 - 官方网站

这是拾句（Pick Quote）浏览器扩展的官方落地静态页面，采用响应式设计，支持亮/暗主题切换。

## 技术栈

- HTML5
- CSS3（使用 CSS 变量实现自动主题切换）
- **Three.js** - 3D 粒子背景和交互效果
- **GSAP (GreenSock Animation Platform)** - 高性能动画和滚动触发效果
- Vanilla JavaScript（核心逻辑）
- 响应式设计
- 文艺风格设计

## 文件结构

```
www/
├── index.html          # 主页（已集成 Three.js 和 GSAP）
├── css/
│   └── style.css      # 样式文件（包含增强动画样式）
├── js/
│   ├── enhanced.js    # 增强版 JS（Three.js + GSAP）✨ 新增
│   └── main.js        # 基础版 JS（备用/降级方案）
├── assets/
│   └── icon.png       # Logo 图标
├── robots.txt         # SEO 机器人配置
├── sitemap.xml        # 站点地图
└── README.md          # 本文件
```

### 关键文件说明

- **enhanced.js**：包含 Three.js 3D 场景和 GSAP 动画的增强版本
  - Three.js 粒子系统
  - GSAP 滚动触发动画
  - 自定义光标效果
  - 高级交互动画

- **main.js**：基础版本，作为降级方案
  - 基础滚动动画
  - 主题切换
  - 简单交互效果

## 功能特点

### ✨ 设计特色

- **文艺风格**：采用衬线字体（Noto Serif SC）和温暖的配色方案
- **双主题**：支持亮色和暗色主题，自动跟随系统设置
- **响应式**：完美适配桌面、平板和移动设备
- **流畅动画**：使用 CSS3 动画和过渡效果

### 🎨 主题配置

- **亮色主题**：
  - 背景色：#faf9f7（温暖的米白色）
  - 主色调：#6b7785（蓝灰色）
  - 辅色调：#9c8b7a（棕灰色）

- **暗色主题**：
  - 背景色：#1a1a1a（深色）
  - 文本色：#e8e6e3（浅色）
  - 保持相同的柔和配色

### 🚀 交互功能

#### 基础功能
- 自动主题切换（跟随系统设置）
- 平滑滚动导航（GSAP 驱动）
- 响应式导航栏
- GitHub 链接（右上角）

#### Three.js 3D 效果
- **粒子系统背景**：800+ 动态粒子构成的 3D 场景
- **鼠标交互**：粒子跟随鼠标移动，产生沉浸式交互
- **波浪动画**：粒子产生动态波浪效果
- **主题适配**：根据亮/暗主题自动调整粒子透明度和颜色

#### GSAP 高级动画
- **Hero 区域**：入场动画序列，包含弹跳、淡入、缩放效果
- **滚动触发动画**：元素进入视口时自动播放动画
- **视差滚动**：背景元素随滚动产生视差效果
- **悬停增强**：卡片、按钮等元素的高级悬停动画
- **浮动卡片**：使用 GSAP 实现更流畅的浮动和旋转效果
- **鼠标视差**：浮动卡片跟随鼠标产生 3D 视差效果

#### 交互细节
- **自定义光标**（桌面端）：跟随鼠标的双层光标效果
- **涟漪效果**：按钮点击时的水波纹动画
- **弹性动画**：按钮和卡片使用弹性缓动函数
- **平滑过渡**：所有页面跳转使用 GSAP 平滑滚动

#### 性能优化
- 低性能设备自动降低粒子不透明度
- 移动端减少 3D 效果复杂度
- 使用 `will-change` 优化动画性能
- 硬件加速的 CSS 变换

## 部署到 GitHub Pages

### 方法一：使用 GitHub UI（推荐）

1. 登录到 [GitHub](https://github.com)

2. 进入您的项目仓库

3. 进入 `www` 文件夹

4. 点击 "Add file" → "Upload files"

5. 将本地 `www` 目录下的所有文件上传

6. 在仓库根目录添加 `.nojekyll` 文件（可选，用于禁用 Jekyll 处理）

7. 进入仓库的 **Settings** 标签页

8. 滚动到 **Pages** 部分

9. 在 **Source** 下拉菜单中选择 **Deploy from a branch**

10. 选择 **main** 分支和 **/ (root)** 目录（或选择 `/www` 目录）

11. 点击 **Save**

12. 等待几分钟，您的网站将在 `https://yourusername.github.io/repository-name` 激活

### 方法二：使用 Git 命令行

```bash
# 1. 克隆仓库
git clone https://github.com/yourusername/your-repo.git
cd your-repo

# 2. 创建并切换到 gh-pages 分支
git checkout --orphan gh-pages

# 3. 删除所有文件（保留 .git 目录）
git rm -rf .
rm -rf *

# 4. 将 www 目录内容复制到根目录
cp -r www/* .

# 5. 提交并推送
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages

# 6. 在 GitHub Pages 设置中选择 gh-pages 分支作为源
```

### 方法三：使用 GitHub Actions（自动化部署）✨ 推荐

本项目已配置自动化部署工作流，位于 `.github/workflows/deploy-pages.yml`。当 `www` 目录有更新时，会自动部署到 GitHub Pages。

#### 自动部署配置

工作流已配置完成，包含以下特性：
- 🚀 自动检测 `www` 目录的更改
- 📦 自动打包和部署静态文件
- 🔧 支持手动触发部署
- 🌐 使用 GitHub 官方 Pages 部署操作

#### 启用步骤

1. **启用 GitHub Pages**：
   - 进入仓库的 **Settings** → **Pages**
   - 在 **Source** 中选择 **GitHub Actions**

2. **推送更改**：
   ```bash
   git add www/
   git commit -m "Update website content"
   git push origin main
   ```

3. **查看部署状态**：
   - 进入仓库的 **Actions** 标签页
   - 查看部署进度和状态

4. **访问网站**：
   - 部署完成后，访问 `https://yourusername.github.io/repository-name`

#### 手动触发部署

在 GitHub 仓库页面：
1. 进入 **Actions** 标签页
2. 选择 **Deploy to GitHub Pages** 工作流
3. 点击 **Run workflow** 按钮

## 本地开发

### 使用简单 HTTP 服务器

由于静态页面可能使用 ES6 模块和其他现代特性，建议使用 HTTP 服务器而非直接打开 `index.html`。

#### 使用 Python

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

访问 http://localhost:8000

#### 使用 Node.js

```bash
# 安装 http-server
npm install -g http-server

# 启动服务器
http-server -p 8000

# 或使用 npx（无需全局安装）
npx http-server -p 8000
```

访问 http://localhost:8000

#### 使用 Live Server（VS Code 扩展）

1. 在 VS Code 中安装 "Live Server" 扩展
2. 右键 `index.html`
3. 选择 "Open with Live Server"

### 预览不同设备

使用浏览器开发者工具（F12）切换到移动设备视图，或使用：

- Chrome DevTools 的设备模拟器
- Firefox 的响应式设计模式

## 自定义配置

### 修改主题色彩

编辑 `css/style.css` 中的 CSS 变量：

```css
:root {
  --primary-color: #6b7785;    /* 主色调 */
  --secondary-color: #9c8b7a;  /* 辅色调 */
  --bg-primary: #faf9f7;       /* 主背景色 */
}
```

### 修改字体

在 `css/style.css` 中修改：

```css
:root {
  --font-family: 'Noto Serif SC', 'Songti SC', 'STSong', Georgia, serif;
}
```

### 添加新页面

1. 在 `www` 目录创建新的 HTML 文件
2. 引用现有的 CSS 和 JS 文件
3. 在导航栏添加链接

## 性能优化建议

1. **图片优化**：
   - 使用 WebP 格式（现代浏览器支持）
   - 适当压缩图片
   - 使用响应式图片（`srcset` 属性）

2. **字体优化**：
   - 考虑使用 font-display: swap
   - 预加载关键字体

3. **代码分割**：
   - 虽然当前是单页应用，但可以按需加载非关键 JS

4. **缓存策略**：
   - 为 GitHub Pages 设置适当的缓存头
   - 使用文件指纹（如 hash）更新资源

## SEO 优化

当前页面已包含：

- 语义化 HTML 结构
- Meta 描述和关键词
- 适当的标题层级

建议添加：

- Open Graph 标签（社交媒体分享）
- 结构化数据（Schema.org）
- 站点地图（sitemap.xml）

## 浏览器兼容性

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ⚠️ IE 不支持（现代特性）

## 许可证

本项目继承自主项目的许可证。

## 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 GitHub Issue
- 发送邮件到 [your-email@example.com]

## 更新日志

### v2.0.0 (2025-11-10) ✨ 重大更新
- 🎨 **集成 Three.js**：添加 3D 粒子系统背景
  - 800+ 动态粒子
  - 鼠标交互和波浪动画
  - 主题自适应颜色
- ⚡ **集成 GSAP**：高性能动画引擎
  - 滚动触发动画（ScrollTrigger）
  - 视差滚动效果
  - 弹性和缓动动画
- 🖱️ **自定义光标**：桌面端双层光标效果
- 💫 **增强交互**：
  - 涟漪点击效果
  - 卡片鼠标视差
  - 高级悬停动画
- 📊 **性能优化**：
  - 低性能设备自动降级
  - 移动端优化
  - 硬件加速
- 🔄 **降级方案**：保留基础版本作为后备

### v1.0.0 (2024-11-06)
- ✨ 初始版本发布
- 🎨 实现文艺风格主题
- 🌙 支持亮/暗主题切换
- 📱 响应式设计
- ⚡ 流畅的动画效果
- 🔧 平滑滚动和交互功能
