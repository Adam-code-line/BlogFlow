# BlogFlow

基于 Nuxt 4 和 TypeScript 的现代化博客系统，提供完整的内容管理和用户体验。

## ✨ 功能特点

- 🚀 **Nuxt 4.1.1** + **@nuxt/content v3** - 最新技术栈
- 🎨 **完整UI组件系统** - 自研UI组件库（Button, Card, Modal等）
- 📝 **Markdown 博客** - 支持代码高亮和元数据管理
- 🏷️ **分类标签** - 完整的内容组织系统
- 📱 **响应式设计** - 支持深色模式，移动端友好
- ⚡ **TypeScript** - 完整类型安全保障
- 🛠️ **组件化架构** - 高度模块化，易于维护和扩展
- 🔍 **搜索功能** - 文章搜索和智能筛选
- 📊 **分析工具** - 访问统计和用户行为追踪
- 🌙 **主题切换** - 亮色/暗色模式 + 多种代码主题

## 🚀 在线预览

访问 [BlogFlow Demo](http://localhost:3000) 查看完整效果。

## 🏗️ 项目架构

```
BlogFlow/
├── app/                    # 应用源码
│   ├── pages/             # 页面路由
│   │   ├── index.vue      # 首页（精美设计，完整功能）
│   │   ├── about.vue      # 关于页面（个人信息，技能展示）
│   │   ├── contact.vue    # 联系页面（表单验证，多种联系方式）
│   │   └── blog/          # 博客页面
│   │       ├── index.vue      # 博客列表（搜索，筛选，分页）
│   │       ├── [slug].vue     # 文章详情（完整展示，相关推荐）
│   │       └── category/[name].vue # 分类页面
│   ├── components/        # 可复用组件
│   │   ├── ui/           # UI基础组件 (Button, Card, Modal)
│   │   ├── blog/         # 博客组件 (PostCard, PostList)
│   │   ├── layout/       # 布局组件 (Header, Footer, Sidebar)
│   │   └── common/       # 通用组件 (Loading, ErrorMessage, ThemeToggle)
│   ├── composables/       # 组合式函数（完整业务逻辑）
│   ├── types/            # TypeScript 类型定义（完整类型系统）
│   ├── layouts/          # 页面布局 (default, blog, admin)
│   ├── utils/            # 工具函数（格式化，验证，常量）
│   ├── services/         # API服务层
│   └── assets/           # 静态资源
├── content/               # 内容文件
│   ├── blog/             # 博客文章 (5篇示例文章)
│   └── pages/            # 静态页面内容
├── public/               # 公共静态资源
└── server/               # 服务端代码
```

## 🚀 快速开始

### 环境要求

- Node.js 18+ 
- npm 或 yarn 或 pnpm

### 安装依赖

```bash
npm install
```

### 启动开发

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看结果。

### 构建生产

```bash
npm run build
```

### 预览构建

```bash
npm run preview
```

## 📝 内容管理

### 添加博客文章

在 `content/blog/` 目录下创建 Markdown 文件：

```markdown
---
title: "文章标题"
description: "文章描述"
publishedAt: "2024-01-15"
category: "技术分享"
tags: ["Vue.js", "Nuxt", "TypeScript"]
author:
  name: "作者姓名"
  avatar: "/images/avatar.jpg"
cover: "https://example.com/cover.jpg"
---

# 文章内容

这里是文章的正文内容，支持所有Markdown语法...

## 代码示例

\`\`\`typescript
// TypeScript代码示例
interface BlogPost {
  title: string
  content: string
  publishedAt: Date
}
\`\`\`
```

### 文章元数据字段

- `title`: 文章标题（必需）
- `description`: 文章描述，用于SEO和摘要
- `publishedAt`: 发布日期
- `category`: 文章分类
- `tags`: 文章标签数组
- `author`: 作者信息（姓名、头像）
- `cover`: 封面图片URL
- `draft`: 是否为草稿（可选）

## 🛠️ 技术栈

### 核心框架
- **Nuxt 4.1.1** - Vue.js元框架
- **Vue 3.5.21** - 渐进式JavaScript框架
- **TypeScript 5.9.2** - 类型安全的JavaScript

### UI和样式
- **@nuxt/ui 3.3.3** - Nuxt UI组件库
- **TailwindCSS** - 原子化CSS框架
- **自研UI组件** - 基于@nuxt/ui的封装组件

### 内容和数据
- **@nuxt/content 3.6.3** - 基于文件的内容管理
- **@nuxt/image 1.11.0** - 图片优化和处理
- **@vueuse/core 13.9.0** - Vue组合式工具集

### 开发工具
- **axios 1.11.0** - HTTP客户端
- **vue-tsc 3.0.6** - Vue TypeScript编译器

## 🎨 UI组件系统

BlogFlow 提供了完整的UI组件系统，基于@nuxt/ui进行封装，提供更好的开发体验：

### 基础组件
```vue
<!-- 按钮组件 -->
<UiButton variant="solid" color="primary" size="lg">
  点击按钮
</UiButton>

<!-- 卡片组件 -->
<UiCard variant="shadow" hoverable>
  <template #header>卡片头部</template>
  卡片内容
  <template #footer>卡片底部</template>
</UiCard>

<!-- 模态框组件 -->
<UiModal v-model="showModal" title="模态框标题">
  模态框内容
</UiModal>
```

### 通用组件
```vue
<!-- 加载组件 -->
<Loading type="spinner" size="lg" overlay />

<!-- 错误消息 -->
<ErrorMessage 
  type="error" 
  message="错误信息" 
  closable 
  @retry="handleRetry" 
/>

<!-- 主题切换 -->
<ThemeToggle />
```

## 🌟 核心特性

### 响应式设计
- 移动端优先的设计理念
- 流畅的用户体验
- 完整的触摸支持

### 主题系统
- 亮色/暗色模式自动切换
- 多种代码高亮主题
- 用户偏好记忆

### 性能优化
- 图片懒加载和优化
- 代码分割和异步加载
- 服务端渲染(SSR)支持

### SEO优化
- 完整的meta标签管理
- 结构化数据支持
- 自动sitemap生成

## � 项目统计

- ✅ **15+** 完整组件
- ✅ **5** 核心页面
- ✅ **100%** TypeScript覆盖
- ✅ **完整** 响应式设计
- ✅ **SEO** 优化就绪

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 开发规范
1. 使用 TypeScript 进行开发
2. 遵循组件命名规范（PascalCase）
3. 使用封装的UI组件（UiButton, UiCard等）
4. 编写清晰的组件文档

### 提交规范
- feat: 新功能
- fix: 修复问题
- docs: 文档更新
- style: 代码格式
- refactor: 重构代码
- test: 测试相关
- chore: 构建相关

## �📄 许可证

MIT License

---

> 一个现代化的博客系统，专注于性能、用户体验和开发体验。
