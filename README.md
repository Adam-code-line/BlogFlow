# BlogFlow

基于 Nuxt 4 和 TypeScript 的现代化博客系统，集成 Nuxt UI 和 Tailwind CSS。

## ✨ 功能特点

- 🚀 **Nuxt 4.1.1** - 最新的 Nuxt 框架
- 📝 **内容管理** - 基于 @nuxt/content v3 的 Markdown 博客系统
- 🎨 **现代 UI** - Nuxt UI 组件库 + Tailwind CSS
- 📱 **响应式设计** - 完美适配各种设备
- 🔍 **搜索功能** - 实时博客文章搜索和分类筛选
- 🏷️ **分类系统** - 完整的文章分类和标签管理
- 📖 **文章导航** - 上一篇/下一篇文章导航
- 🔗 **SEO 优化** - 完整的 SEO 配置和社交分享
- 🌙 **深色模式** - 优雅的暗色主题支持
- ⚡ **TypeScript** - 完整的类型安全和开发体验
- 🛠️ **模块化架构** - 清晰的组件化和可复用架构

## 🏗️ 项目结构

```
BlogFlow/
├── app/                    # 应用源码
│   ├── pages/             # 页面组件
│   │   ├── index.vue      # 首页（已完成）
│   │   ├── about.vue      # 关于页面（基础架构）
│   │   ├── contact.vue    # 联系页面（基础架构）
│   │   └── blog/          # 博客页面
│   │       ├── index.vue  # 博客列表（已完成）
│   │       ├── [slug].vue # 文章详情（已完成）
│   │       └── category/  # 分类页面
│   │           └── [name].vue # 分类文章列表（已完成）
│   ├── layouts/           # 布局组件
│   │   ├── default.vue    # 默认布局（已完成）
│   │   ├── blog.vue       # 博客布局（已完成）
│   │   └── admin.vue      # 管理后台布局（已完成）
│   ├── components/        # 可复用组件
│   │   ├── blog/         # 博客相关组件（4个组件）
│   │   ├── common/       # 通用组件（2个组件）
│   │   ├── layout/       # 布局组件（3个组件）
│   │   └── ui/           # UI基础组件（3个组件）
│   ├── composables/       # 组合式函数
│   │   ├── index.ts      # 统一导出
│   │   ├── useAuth.ts    # 认证逻辑
│   │   ├── useBlog.ts    # 博客相关逻辑
│   │   ├── useContent.ts # 内容管理逻辑
│   │   └── useUtils.ts   # 工具函数
│   ├── types/            # TypeScript 类型定义
│   │   ├── blog.ts       # 博客相关类型（已完成）
│   │   ├── user.ts       # 用户相关类型（已完成）
│   │   ├── content.d.ts  # 内容类型声明
│   │   ├── global.d.ts   # 全局类型声明
│   │   └── index.ts      # 类型汇总（已完成）
│   ├── utils/            # 工具函数
│   │   ├── constants.ts  # 常量定义
│   │   ├── format.ts     # 格式化函数
│   │   └── validate.ts   # 验证函数
│   ├── middleware/       # 路由中间件
│   │   ├── auth.ts       # 认证中间件
│   │   └── redirect.ts   # 重定向中间件
│   ├── plugins/          # 插件
│   │   ├── analytics.client.ts # 分析工具
│   │   └── highlight.client.ts # 代码高亮
│   └── assets/           # 静态资源
│       ├── css/          # 样式文件
│       ├── fonts/        # 字体文件
│       └── images/       # 图片资源
├── content/               # 内容文件
│   ├── blog/             # 博客文章（5篇示例文章）
│   └── pages/            # 静态页面内容
├── server/               # 服务端代码
│   └── api/              # API 路由
├── public/               # 公共静态资源
├── content.config.ts     # Content v3 配置文件
├── nuxt.config.ts        # Nuxt 配置文件
└── tsconfig.json         # TypeScript 配置
```

## 🚀 快速开始

### 安装依赖

```bash
npm install
# 或
pnpm install
# 或
yarn install
```

### 开发模式

```bash
npm run dev
# 或
pnpm dev
# 或
yarn dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看结果。

### 构建

```bash
npm run build
# 或
pnpm build
# 或
yarn build
```

## 📝 内容管理

### Content v3 API

项目使用最新的 Nuxt Content v3 API，配置文件为 `content.config.ts`：

```typescript
import { defineContentConfig, defineCollection } from '@nuxt/content'

export default defineContentConfig({
    collections: {
        content: defineCollection({
            type: 'page',
            source: '**/*.md'
        }),
        blog: defineCollection({
            type: 'page',
            source: 'blog/**/*.md'
        }),
        pages: defineCollection({
            type: 'page', 
            source: 'pages/**/*.md'
        })
    }
})
```

### 添加博客文章

在 `content/blog/` 目录下创建 Markdown 文件：

```markdown
---
title: "文章标题"
description: "文章描述"
publishedAt: "2024-01-15"
tags: ["标签1", "标签2"]
category: "分类名称"
author:
  name: "作者姓名"
  avatar: "/images/avatar.jpg"
  bio: "作者简介"
image: "/images/article-cover.jpg"
---

# 文章内容

这里是文章的正文内容...
```

### 文章属性说明

- `title`: 文章标题（必需）
- `description`: 文章描述，用于 SEO（必需）
- `publishedAt`: 发布日期（必需）
- `category`: 分类（可选）
- `tags`: 标签数组（可选）
- `author`: 作者信息（可选）
- `cover`: 封面图片（可选）
- `featured`: 是否为精选文章（可选）
- `readingTime`: 预计阅读时间（可选）

## 🏛️ 架构特点

### 模块化设计
- **组件化**: 完整的组件库和可复用组件
- **类型安全**: 完整的 TypeScript 类型定义系统
- **状态管理**: 基于 Composables 的响应式状态管理
- **路由系统**: 基于文件系统的自动路由生成

### 内容管理
- **Markdown 支持**: 完整的 Markdown 渲染和语法高亮
- **元数据管理**: Front Matter 元数据支持
- **SEO 优化**: 自动生成 SEO 元标签和 OpenGraph
- **图片优化**: 集成 @nuxt/image 图片优化

## 🎨 主题配置

项目使用 Nuxt UI 和 Tailwind CSS，支持深色模式和自定义主题。

### 自定义颜色

在 `tailwind.config.js` 中修改主题颜色：

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        // 自定义颜色
      }
    }
  }
}
```

## 📱 页面说明

### 首页 (`/`)
- 展示最新博客文章
- 特色文章轮播
- 快速导航菜单

### 博客列表 (`/blog`)
- 所有文章列表
- 实时搜索功能
- 分类筛选
- 分页显示

### 文章详情 (`/blog/[slug]`)
- 完整文章内容
- 作者信息
- 相关文章推荐
- 上一篇/下一篇导航
- 社交分享

## 🔧 技术栈

- **框架**: Nuxt 4.1.1
- **语言**: TypeScript
- **样式**: Tailwind CSS + Nuxt UI
- **内容**: @nuxt/content v3 (Markdown)
- **图片**: @nuxt/image (优化处理)
- **构建**: Vite
- **部署**: 支持静态生成和服务端渲染

## 🚀 开发状态

### ✅ 已完成功能
- **核心页面**: 首页、博客列表、文章详情页
- **内容系统**: Content v3 集成，5篇示例文章
- **类型系统**: 完整的 TypeScript 类型定义
- **组件架构**: 模块化组件库
- **布局系统**: 响应式布局和深色模式
- **SEO 优化**: 完整的 SEO 配置

### 🚧 开发中功能
- **页面内容**: about.vue, contact.vue 页面内容
- **组件逻辑**: 组件具体功能实现
- **业务逻辑**: Composables 具体业务逻辑

### ⏳ 计划功能
- **管理后台**: 内容管理界面
- **用户系统**: 认证和权限管理
- **API 接口**: 服务端接口开发

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Pull Request 或创建 Issue！

---

> 这是一个现代化的博客系统，专注于性能、用户体验和开发者友好性。
