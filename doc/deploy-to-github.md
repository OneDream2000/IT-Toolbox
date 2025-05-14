# 部署到GitHub Pages指南

## 准备工作

1. 确保项目已成功构建，运行 `npm run build` 命令生成 `dist` 目录
2. 确保你有一个GitHub账号

## 部署步骤

### 1. 创建GitHub仓库

1. 登录GitHub账号
2. 点击右上角的 "+" 按钮，选择 "New repository"
3. 填写仓库名称（例如：it-web）
4. 添加描述（可选）：IT工具箱 - 基于Vue 3和Element Plus的前端工具集合
5. 选择公开（Public）或私有（Private）
6. 点击 "Create repository" 按钮

### 2. 初始化本地Git仓库并推送到GitHub

```bash
# 如果尚未初始化Git仓库，请运行
git init

# 添加所有文件到暂存区
git add .

# 提交更改
git commit -m "初始提交"

# 添加远程仓库（替换YOUR_USERNAME为你的GitHub用户名）
git remote add origin https://github.com/YOUR_USERNAME/it-web.git

# 推送到GitHub
git push -u origin main
```

### 3. 部署到GitHub Pages

#### 方法一：使用gh-pages分支

1. 安装gh-pages包
```bash
npm install --save-dev gh-pages
```

2. 在package.json中添加部署脚本
```json
"scripts": {
  "deploy": "gh-pages -d dist"
}
```

3. 运行部署命令
```bash
npm run deploy
```

#### 方法二：手动部署

1. 将dist目录的内容推送到GitHub仓库的gh-pages分支
```bash
# 创建gh-pages分支
git checkout --orphan gh-pages

# 删除工作区文件
git rm -rf .

# 复制dist目录内容到当前目录
cp -r dist/* .

# 添加所有文件
git add .

# 提交更改
git commit -m "部署到GitHub Pages"

# 推送到GitHub
git push origin gh-pages
```

### 4. 配置GitHub Pages

1. 在GitHub仓库页面，点击 "Settings"
2. 在左侧菜单中找到 "Pages"
3. 在 "Source" 部分，选择 "gh-pages" 分支
4. 点击 "Save"
5. 等待几分钟，你的网站将在 `https://YOUR_USERNAME.github.io/it-web` 上可用

## 注意事项

- 确保vite.config.ts中已设置正确的base配置（已完成）
- 如果你的项目使用了路由，确保使用hash模式或正确配置history模式
- 部署后，如果发现资源加载问题，检查路径是否正确