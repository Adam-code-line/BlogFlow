# BlogFlow

基于 Nuxt 4 和 TypeScript 的现代化博客系统。

## ✨ 功能特点

- 🚀 **Nuxt 4.1.1** + **@nuxt/content v3** - 最新技术栈
- 🎨 **Nuxt UI + Tailwind CSS** - 现代化UI组件库
- � **Markdown 博客** - 支持代码高亮和元数据管理
- 🏷️ **分类标签** - 完整的内容组织系统
- 📱 **响应式设计** - 支持深色模式
- ⚡ **TypeScript** - 完整类型安全
- 🛠️ **组件化架构** - 可复用模块化设计

## 🏗️ 项目结构

```
BlogFlow/
├── app/                    # 应用源码
│   ├── pages/             # 页面路由
│   │   ├── index.vue      # 首页
│   │   ├── about.vue      # 关于页面  
│   │   ├── contact.vue    # 联系页面
│   │   └── blog/          # 博客页面
│   │       ├── index.vue      # 博客列表
│   │       ├── [slug].vue     # 文章详情
│   │       └── category/[name].vue # 分类页面
│   ├── components/        # 可复用组件
│   │   ├── ui/           # UI基础组件 (Button, Card, Modal)
│   │   ├── blog/         # 博客组件 (PostCard, PostList)
│   │   ├── layout/       # 布局组件 (Header, Footer, Sidebar)
│   │   └── common/       # 通用组件 (Loading, ErrorMessage)
│   ├── composables/       # 组合式函数
│   ├── types/            # TypeScript 类型定义
│   ├── layouts/          # 页面布局 (default, blog, admin)
│   └── assets/           # 静态资源
├── content/               # 内容文件
│   ├── blog/             # 博客文章 (Markdown)
│   └── pages/            # 静态页面内容
├── public/               # 公共静态资源
└── server/               # 服务端代码
```

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看结果。

### 构建

```bash
npm run build
```

## 📝 内容管理

### 添加博客文章

在 `content/blog/` 目录下创建 Markdown 文件：

```markdown
---
title: "文章标题"
description: "文章描述"
publishedAt: "2024-01-15"
category: "分类名称"
tags: ["标签1", "标签2"]
author:
  name: "作者姓名"
  avatar: "/images/avatar.jpg"
---

# 文章内容

这里是文章的正文内容...
```

## 🛠️ 技术栈

- **框架**: Nuxt 4.1.1
- **语言**: TypeScript  
- **UI**: @nuxt/ui + Tailwind CSS
- **内容**: @nuxt/content v3
- **图片**: @nuxt/image

## 📄 许可证

MIT License

---

> 一个现代化的博客系统，专注于性能和开发体验。
