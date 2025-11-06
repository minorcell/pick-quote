# GitHub Pages 部署设置指南

本指南将帮助您将 `www` 目录中的静态页面部署到 GitHub Pages。

## 🚀 快速开始

### 1. 启用 GitHub Pages

1. 访问您的 GitHub 仓库页面
2. 点击 **Settings** 标签页
3. 向下滚动到 **Pages** 部分
4. 在 **Source** 下拉菜单中选择 **GitHub Actions**
5. 点击 **Save**

### 2. 推送更改

```bash
# 添加所有文件
git add .github/workflows/deploy-pages.yml
git add .nojekyll
git add www/README.md

# 提交更改
git commit -m "Add GitHub Pages deployment workflow"

# 推送到远程仓库
git push origin main
```

### 3. 查看部署状态

1. 进入仓库的 **Actions** 标签页
2. 查看 "Deploy to GitHub Pages" 工作流的运行状态
3. 等待部署完成（通常需要 1-2 分钟）

### 4. 访问您的网站

部署完成后，您的网站将在以下地址可用：
```
https://[your-username].github.io/[repository-name]
```

## 📋 工作流详情

### 触发条件

工作流会在以下情况下自动触发：
- 推送到 `main` 分支且 `www` 目录有更改
- 手动触发（通过 Actions 页面的 "Run workflow" 按钮）

### 部署过程

1. **检出代码**：获取最新的仓库代码
2. **配置 Pages**：设置 GitHub Pages 环境
3. **复制文件**：将 `www` 目录内容复制到部署目录
4. **上传制品**：准备部署文件
5. **部署**：将文件发布到 GitHub Pages

## 🔧 配置选项

### 修改部署分支

如果您希望从其他分支部署，请编辑 `.github/workflows/deploy-pages.yml`：

```yaml
on:
  push:
    branches: [ develop ]  # 改为您的目标分支
```

### 添加构建步骤

如果您的静态页面需要构建过程，可以在工作流中添加构建步骤：

```yaml
- name: Build static site
  run: |
    cd www
    npm install
    npm run build
```

### 自定义域名

要使用自定义域名：

1. 在 `www` 目录中创建 `CNAME` 文件
2. 在文件中添加您的域名：
   ```
   your-domain.com
   ```
3. 确保您的域名 DNS 设置正确指向 GitHub Pages

## 🐛 常见问题

### 部署失败

1. 检查 **Actions** 标签页中的错误日志
2. 确保所有文件路径正确
3. 验证工作流语法是否正确

### 页面不更新

1. 清除浏览器缓存
2. 等待几分钟让 CDN 更新
3. 检查工作流是否成功完成

### 404 错误

1. 确认 GitHub Pages 已启用
2. 检查仓库是否为公开仓库（私有仓库需要 GitHub Pro）
3. 验证文件是否存在于正确的路径

## 📁 文件结构

```
.github/
└── workflows/
    └── deploy-pages.yml    # GitHub Actions 工作流配置
www/
├── index.html              # 主页文件
├── css/
│   └── style.css          # 样式文件
├── js/
│   └── main.js            # JavaScript 文件
├── assets/
│   └── icon.png           # 图标文件
├── 404.html               # 404 页面
├── robots.txt             # SEO 文件
├── sitemap.xml            # 站点地图
└── README.md              # 文档
.nojekyll                   # 禁用 Jekyll 处理
GITHUB_PAGES_SETUP.md       # 本设置指南
```

## 🎨 自定义您的页面

### 修改内容

编辑 `www/index.html` 文件来更新页面内容。

### 更改样式

修改 `www/css/style.css` 文件来自定义外观。

### 添加功能

在 `www/js/main.js` 文件中添加 JavaScript 功能。

## 📞 获取帮助

如果遇到问题：

1. 查看 [GitHub Pages 文档](https://docs.github.com/en/pages)
2. 检查工作流日志获取详细错误信息
3. 在项目的 Issues 中寻求帮助

## ✅ 检查清单

部署前请确认：
- [ ] GitHub Pages 已在仓库设置中启用
- [ ] 工作流文件已正确配置
- [ ] 所有静态文件位于 `www` 目录
- [ ] 仓库为公开仓库（或使用 GitHub Pro）
- [ ] 已推送所有更改到远程仓库

---

**祝您部署顺利！** 🎉