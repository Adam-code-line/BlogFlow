# BlogFlow 项目结构指导

## 项目概览
BlogFlow 是基于 Nuxt 4.1.1 的现代化博客系统，采用 TypeScript + Pinia + @nuxt/ui 构建。

## 技术栈
- **框架**: Nuxt 4.1.1 + TypeScript
- **状态管理**: Pinia
- **UI库**: @nuxt/ui + TailwindCSS
- **内容**: @nuxt/content v3

## 核心功能
- 🎨 **UI组件系统** - Button, Card, Modal 等封装组件
- 📝 **内容管理** - Markdown 博客文章系统
- 🌙 **主题切换** - 亮色/暗色模式
- 📱 **响应式设计** - 移动端适配
- 🔄 **状态管理** - 统一的 Pinia 状态管理

## 项目结构

```
BlogFlow/
├── 📁 app/                             # 应用核心目录
│   ├── 📁 components/                  # Vue 组件
│   │   ├── 📁 blog/                    # 博客相关组件
│   │   ├── 📁 common/                  # 通用组件
│   │   ├── 📁 layout/                  # 布局组件
│   │   └── 📁 ui/                      # UI 基础组件
│   ├── 📁 composables/                 # 组合式函数
│   ├── 📁 pages/                       # 页面路由
│   │   ├── index.vue                   # 首页
│   │   ├── 📁 blog/                    # 博客页面
│   │   ├── 📁 users/                   # 用户页面
│   │   └── about.vue, contact.vue      # 其他页面
│   ├── 📁 stores/                      # Pinia 状态管理
│   │   ├── user.ts                     # 用户状态
│   │   ├── blog.ts                     # 博客状态
│   │   └── ui.ts                       # UI 状态
│   ├── 📁 types/                       # TypeScript 类型
│   └── 📁 utils/                       # 工具函数
├── 📁 content/                         # 内容目录
│   └── 📁 blog/                        # 博客文章
├── 📁 public/                          # 静态资源
└── 📁 server/                          # 服务端代码
```

## 开发规范

### 组件使用
```vue
<!-- 使用封装的UI组件 -->
<UiButton variant="solid" color="primary">按钮</UiButton>
<UiCard variant="shadow">卡片内容</UiCard>
<UiModal :show="showModal">模态框</UiModal>
```

### 状态管理
```typescript
// 使用 Pinia stores
const userStore = useUserStore()
const blogStore = useBlogStore()
const uiStore = useUIStore()
```

### 内容管理
```markdown
---
title: "文章标题"
category: "分类"
tags: ["标签1", "标签2"]
publishedAt: "2024-01-15"
---

# 文章内容
```

## 核心模块

### 1. 状态管理 (Pinia)
- **userStore**: 用户数据、搜索、分页、关注功能
- **blogStore**: 博客文章、分类、搜索、筛选
- **uiStore**: 主题、通知、加载状态、移动端适配

### 2. UI组件系统
- **基础组件**: Button, Card, Modal, Loading, ErrorMessage
- **布局组件**: Header, Footer, Sidebar
- **博客组件**: PostCard, PostList, CategoryList

### 3. 页面系统
- **首页**: 精美设计、数据展示
- **博客**: 文章列表、详情、分类
- **用户**: 社区功能、用户管理

## 快速开始

### 启动开发
```bash
npm run dev
```

### 添加新页面
1. 在 `pages/` 创建 `.vue` 文件
2. 使用 Pinia stores 管理状态
3. 使用封装的 UI 组件

### 添加博客文章
1. 在 `content/blog/` 创建 `.md` 文件
2. 添加 Front Matter 元数据
3. 使用 Markdown 语法编写内容

---

> 基于 Nuxt 4 + Pinia + TypeScript 的现代化博客系统