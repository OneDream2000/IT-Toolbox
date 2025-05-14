# IT工具箱

基于Vue 3和TypeScript的前端工具集合

## 技术栈

- **前端框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **UI框架**: Element Plus
- **状态管理**: Pinia
- **路由管理**: Vue Router
- **图标**: @element-plus/icons-vue

## 开发指南

### 安装依赖

```bash
pnpm install
```

### 本地开发

```bash
pnpm run dev
```

### 构建项目

```bash
pnpm run build
```

### 预览构建结果

```bash
pnpm run preview
```

## 部署说明

本项目使用GitHub Actions自动部署到GitHub Pages。

### 自动部署

1. 推送代码到main分支后，GitHub Actions会自动构建并部署到gh-pages分支
2. 部署完成后，网站将在 `https://[username].github.io/it-web` 上可用

### 手动部署

如果需要手动部署，可以运行：

```bash
pnpm run deploy
```

### 注意事项

- 项目中已添加`.nojekyll`文件，以禁用GitHub Pages的Jekyll处理
- 使用gh-pages分支而非docs目录进行部署，避免Jekyll构建错误
- 如果遇到资源加载问题，请检查`vite.config.ts`中的base配置是否正确
