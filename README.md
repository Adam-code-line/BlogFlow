# BlogFlow

🎉 **项目已完成** - 基于 Nuxt 4 的现代化博客管理系统，具备完整的前端功能和管理界面。

## ✨ 核心功能

### 🎯 已完成的核心特性
- ✅ **完整的博客系统** - 文章创建、编辑、发布、管理
- ✅ **用户认证系统** - 登录、注册、权限管理（管理员/作者/订阅者）
- ✅ **响应式UI界面** - 适配移动端、平板、桌面端
- ✅ **暗色模式支持** - 完整的主题切换系统
- ✅ **Markdown编辑器** - Cherry Markdown + 实时预览
- ✅ **图片管理** - 封面上传、图片去重、响应式显示
- ✅ **分类标签系统** - 完整的内容组织和筛选
- ✅ **搜索功能** - 全文搜索和高级筛选
- ✅ **统计分析** - 访问量、文章数据统计
- ✅ **SEO优化** - 元标签、结构化数据

### 🛠️ 技术栈
- **前端框架**: Nuxt 4.1.1 + Vue 3 + TypeScript
- **状态管理**: Pinia + 响应式数据流
- **UI框架**: 自研组件系统 + Tailwind CSS
- **内容管理**: @nuxt/content v3 + Markdown
- **编辑器**: Cherry Markdown
- **部署**: 静态生成 + Serverless Ready

## 🚀 快速开始

### 环境要求
- Node.js 18+
- npm/yarn/pnpm

### 一键启动
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:3000
```

### 管理员登录
```
邮箱: admin@blogflow.com
密码: admin123
```

## 📁 项目结构

```
BlogFlow/
├── app/                    # 前端应用源码
│   ├── pages/             # 页面路由（完成）
│   │   ├── index.vue      # 首页 - 博客列表
│   │   ├── about.vue      # 关于页面
│   │   ├── contact.vue    # 联系页面
│   │   ├── blog/[slug].vue # 文章详情页
│   │   └── admin/         # 管理后台
│   │       ├── index.vue  # 管理面板
│   │       ├── posts/     # 文章管理
│   │       └── users.vue  # 用户管理
│   ├── components/        # UI组件库（完成）
│   │   ├── ui/           # 基础组件 
│   │   ├── blog/         # 博客组件
│   │   ├── layout/       # 布局组件
│   │   └── editor/       # Markdown编辑器
│   ├── stores/           # Pinia状态管理（完成）
│   ├── composables/      # 组合式函数（完成）
│   └── types/            # TypeScript类型（完成）
├── config/               # 配置文件
│   └── site.config.ts    # 站点配置
├── content/              # 内容管理
│   └── blog/             # 博客文章
└── docs/                 # 项目文档
    └── BACKEND_API.md    # 后端开发文档
## 🎯 功能演示

### 前台功能
- **博客首页**: 文章列表、分类筛选、搜索
- **文章详情**: Markdown渲染、链接高亮、响应式
- **用户系统**: 注册、登录、权限管理

### 后台管理
- **文章管理**: 创建、编辑、发布、草稿
- **用户管理**: 角色分配、权限控制
- **数据统计**: 访问量、文章统计

## 📝 内容管理

项目已包含完整的内容管理系统，支持：

- **Markdown文章**: 完整的文章创建和编辑
- **图片管理**: 封面上传、自动去重
- **分类标签**: 灵活的内容组织
- **发布流程**: 草稿、预览、发布

## � 配置指南

### 站点配置
编辑 `config/site.config.ts` 自定义站点信息：
```typescript
export const siteConfig = {
  name: '你的博客名称',
  description: '博客描述',
  author: {
    name: '作者姓名',
    email: 'your@email.com'
  }
  // ... 更多配置
}
```

## 🚀 部署说明

### 生产构建
```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

### 部署选项
- **Vercel**: 推荐，零配置部署
- **Netlify**: 支持静态生成
- **服务器**: 支持SSR部署

## � 开发状态

| 功能模块 | 状态 | 说明 |
|---------|------|------|
| 🏠 前台页面 | ✅ 完成 | 博客列表、文章详情、关于页面 |
| 👤 用户系统 | ✅ 完成 | 登录注册、权限管理 |
| ✏️ 文章管理 | ✅ 完成 | 创建编辑、发布管理 |
| 🎨 UI界面 | ✅ 完成 | 响应式、暗色模式 |
| 🔍 搜索功能 | ✅ 完成 | 全文搜索、分类筛选 |
| 📊 数据统计 | ✅ 完成 | 访问统计、文章数据 |
| 🖼️ 图片管理 | ✅ 完成 | 上传、去重、优化 |
| 📱 移动适配 | ✅ 完成 | 完整的响应式设计 |

## 📚 相关文档

- 📖 **用户手册**: `docs/USER_GUIDE.md` - 用户系统使用说明
- ⚙️ **配置指南**: `docs/CONFIG_GUIDE.md` - 站点配置说明  
- 🔌 **API文档**: `docs/BACKEND_API.md` - 后端开发接口规范 ⭐
- 🚀 **快速开始**: `QUICK_SETUP.md` - 项目快速部署
- 📋 **整理报告**: `DOCUMENTATION_REORGANIZATION_COMPLETE.md` - 文档整理说明

---

🎉 **BlogFlow 前端项目已完成开发，所有核心功能均已实现并测试通过！**

**给后端开发者**: 请重点查看 `docs/BACKEND_API.md` 了解完整的API接口规范和数据模型设计。

### 状态管理
- Pinia 统一状态管理
- 用户、博客、UI状态分离
- 响应式数据流

### 响应式设计
- 移动端优先设计
- 流畅的用户体验
- 完整的触摸支持

### 主题系统
- 亮色/暗色模式切换
- 多种代码高亮主题
- 用户偏好记忆

### 性能优化
- 组件懒加载
- 状态缓存机制
- 服务端渲染(SSR)支持

## 📊 项目统计

- ✅ **3** 核心 Pinia Store
- ✅ **15+** UI 组件
- ✅ **5** 核心页面
- ✅ **100%** TypeScript覆盖
- ✅ **完整** 响应式设计
- ✅ **统一** 状态管理

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 开发规范
1. 使用 TypeScript 进行开发
2. 遵循组件命名规范（PascalCase）
3. 使用封装的UI组件（UiButton, UiCard等）
4. 使用 Pinia stores 管理状态
5. 编写清晰的组件文档

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

> 基于 Nuxt 4 + Pinia + TypeScript 的现代化博客系统，专注于性能、用户体验和开发体验。
