# BlogFlow

基于 Nuxt 4 和 TypeScript 的现代化博客系统，集成 Nuxt UI 和 Tailwind CSS。

## ✨ 功能特点

- 🚀 **Nuxt 4.1.1** - 最新的 Nuxt 框架
- 📝 **内容管理** - 基于 @nuxt/content 的 Markdown 博客系统
- 🎨 **现代 UI** - Nuxt UI 组件库 + Tailwind CSS
- 📱 **响应式设计** - 完美适配各种设备
- 🔍 **搜索功能** - 实时博客文章搜索
- 🏷️ **分类筛选** - 按分类浏览文章
- 📖 **文章导航** - 上一篇/下一篇文章导航
- 🔗 **社交分享** - 内置分享功能
- 🌙 **深色模式** - 优雅的暗色主题支持
- ⚡ **TypeScript** - 完整的类型安全

## 🏗️ 项目结构

```
BlogFlow/
├── app/                    # 应用源码
│   ├── pages/             # 页面组件
│   │   ├── index.vue      # 首页（已完成）
│   │   └── blog/          # 博客页面
│   │       ├── index.vue  # 博客列表（已完成）
│   │       └── [slug].vue # 文章详情（已完成）
│   ├── layouts/           # 布局组件
│   │   └── blog.vue       # 博客布局（已完成）
│   ├── components/        # 可复用组件
│   ├── composables/       # 组合式函数
│   └── assets/            # 静态资源
├── content/               # 内容文件
│   └── blog/             # 博客文章（5篇示例文章）
├── types/                 # TypeScript 类型定义
│   └── blog.ts           # 博客相关类型（已完成）
└── server/               # 服务端代码
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
- `tags`: 标签数组（可选）
- `category`: 分类（可选）
- `author`: 作者信息（可选）
- `image`: 封面图片（可选）

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
- **内容**: @nuxt/content (Markdown)
- **构建**: Vite
- **部署**: 支持多种部署方式

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Pull Request 或创建 Issue！

---

> 这是一个现代化的博客系统，专注于性能、用户体验和开发者友好性。
