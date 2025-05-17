# IT工具箱

## 项目介绍

IT工具箱是一个基于Vue3+TypeScript的Web应用，提供多种实用的IT开发工具，包括：

- Base64编码/解码
- 在线时间戳转换
- URL编码/解码
- JSON格式化
- AI工具导航
- 更多工具持续添加中...

## 目录结构

```
it-web/
├── doc/                    # 项目文档
│   ├── README.md           # 项目说明文档
│   └── development.md      # 开发进度文档
├── public/                 # 静态资源
├── src/
│   ├── assets/             # 资源文件(图片、字体等)
│   ├── components/         # 组件
│   │   ├── common/         # 通用组件
│   │   └── tools/          # 工具组件
│   ├── router/             # 路由配置
│   ├── store/              # 状态管理
│   ├── utils/              # 工具函数
│   ├── views/              # 页面视图
│   ├── App.vue             # 根组件
│   └── main.ts             # 入口文件
├── index.html              # HTML模板
├── package.json            # 项目依赖
├── tsconfig.json           # TypeScript配置
└── vite.config.ts          # Vite配置
```

## 技术选型

- **前端框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **UI框架**: Element Plus
- **状态管理**: Pinia
- **路由管理**: Vue Router
- **图标**: @element-plus/icons-vue

## 功能模块

1. **编码转换**
   - Base64编码/解码
   - URL编码/解码
   - JSON格式化（支持格式化和压缩）

2. **文本工具**
   - 英文字母大小写转换

3. **时间工具**
   - 时间戳转换
   - 日期计算

3. **AI工具导航**
   - 常用AI工具链接和介绍

## 启动命令

```bash
# 安装依赖
npm install

# 开发环境启动
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 浏览器兼容性

- 推荐使用Chrome、Firefox、Edge等现代浏览器
- 支持ES6+特性的浏览器