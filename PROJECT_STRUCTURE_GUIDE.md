# BlogFlow 项目结构指导文档

## 项目概览
BlogFlow 是一个基于 Nuxt 4.1.1 的现代化个人博客前端项目，采用 TypeScript 开发，集成内容管理、图片优化和现代化 UI 组件。

## 技术栈
- **框架**: Nuxt 4.1.1
- **语言**: TypeScript
- **UI 库**: @nuxt/ui
- **内容管理**: @nuxt/content
- **图片处理**: @nuxt/image
- **样式**: CSS/SCSS + TailwindCSS（通过 @nuxt/ui）

## 项目结构

```
BlogFlow/
├── 📁 app/                          # 应用核心目录
│   ├── app.vue                      # 根组件
│   ├── router.options.ts            # 路由配置
│   ├── 📁 assets/                   # 静态资源
│   │   └── 📁 css/                  # 样式文件
│   │       ├── main.css             # 主样式文件
│   │       └── components.css       # 组件样式
│   ├── 📁 components/               # Vue 组件
│   │   ├── 📁 blog/                 # 博客相关组件
│   │   │   ├── CategoryList.vue     # 分类列表
│   │   │   ├── PostCard.vue         # 文章卡片
│   │   │   ├── PostDetail.vue       # 文章详情
│   │   │   └── PostList.vue         # 文章列表
│   │   ├── 📁 common/               # 通用组件
│   │   │   ├── ErrorMessage.vue     # 错误信息
│   │   │   └── Loading.vue          # 加载状态
│   │   ├── 📁 layout/               # 布局组件
│   │   │   ├── Footer.vue           # 页脚
│   │   │   ├── Header.vue           # 页头
│   │   │   └── Sidebar.vue          # 侧边栏
│   │   └── 📁 ui/                   # UI 基础组件
│   │       ├── Button.vue           # 按钮组件
│   │       ├── Card.vue             # 卡片组件
│   │       └── Modal.vue            # 模态框组件
│   ├── 📁 composables/              # 组合式函数
│   │   ├── useAuth.ts               # 认证逻辑
│   │   ├── useBlog.ts               # 博客相关逻辑
│   │   └── useUtils.ts              # 工具函数
│   ├── 📁 layouts/                  # 页面布局
│   │   ├── admin.vue                # 管理后台布局
│   │   ├── blog.vue                 # 博客页面布局
│   │   └── default.vue              # 默认布局
│   ├── 📁 middleware/               # 中间件
│   │   ├── auth.ts                  # 认证中间件
│   │   └── redirect.ts              # 重定向中间件
│   ├── 📁 pages/                    # 页面路由
│   │   ├── index.vue                # 首页
│   │   ├── about.vue                # 关于页面
│   │   ├── contact.vue              # 联系页面
│   │   ├── 📁 admin/                # 管理后台页面
│   │   │   ├── index.vue            # 管理首页
│   │   │   └── 📁 posts/            # 文章管理
│   │   │       ├── index.vue        # 文章列表
│   │   │       └── [id].vue         # 文章编辑
│   │   └── 📁 blog/                 # 博客页面
│   │       ├── index.vue            # 博客首页
│   │       ├── [slug].vue           # 文章详情页
│   │       └── 📁 category/         # 分类页面
│   │           └── [name].vue       # 分类文章列表
│   ├── 📁 plugins/                  # 插件
│   │   ├── analytics.client.ts      # 分析工具
│   │   └── highlight.client.ts      # 代码高亮
│   └── 📁 utils/                    # 工具函数
│       ├── constants.ts             # 常量定义
│       ├── format.ts                # 格式化函数
│       └── validate.ts              # 验证函数
├── 📁 content/                      # 内容目录
│   ├── _dir.yml                     # 目录配置
│   ├── 📁 blog/                     # 博客文章
│   │   └── index.md                 # 博客索引
│   └── 📁 pages/                    # 静态页面内容
│       ├── about.md                 # 关于页面内容
│       └── contact.md               # 联系页面内容
├── 📁 public/                       # 公共静态资源
│   ├── favicon.ico                  # 网站图标
│   ├── robots.txt                   # 搜索引擎配置
│   └── sitemap.xml                  # 站点地图
├── 📁 server/                       # 服务端代码
│   └── 📁 api/                      # API 路由
│       ├── 📁 auth/                 # 认证相关 API
│       └── 📁 posts/                # 文章相关 API
├── 📁 types/                        # TypeScript 类型定义
│   ├── blog.ts                      # 博客相关类型
│   ├── user.ts                      # 用户相关类型
│   └── index.ts                     # 类型汇总
├── 📁 .nuxt/                        # Nuxt 构建目录（自动生成）
├── 📁 node_modules/                 # 依赖包（自动生成）
├── nuxt.config.ts                   # Nuxt 配置文件
├── package.json                     # 项目依赖配置
├── package-lock.json                # 锁定依赖版本
├── tsconfig.json                    # TypeScript 配置
├── .gitignore                       # Git 忽略文件
└── README.md                        # 项目说明文档
```

## 核心功能模块

### 1. 内容管理 (`content/`)
- 使用 Markdown 格式编写博客文章
- 支持 Front Matter 元数据
- 自动生成路由和导航

### 2. 组件系统 (`app/components/`)
- **blog/**: 博客功能组件（文章列表、详情、分类等）
- **common/**: 通用组件（加载、错误处理等）
- **layout/**: 布局组件（头部、尾部、侧边栏）
- **ui/**: 基础 UI 组件（按钮、卡片、模态框）

### 3. 页面路由 (`app/pages/`)
- 基于文件系统的自动路由
- 支持动态路由参数
- 嵌套路由支持

### 4. 状态管理 (`app/composables/`)
- 使用 Composables 模式管理状态
- 响应式数据和方法
- 跨组件状态共享

### 5. 类型系统 (`types/`)
- 完整的 TypeScript 类型定义
- 博客、用户等核心实体类型
- 提升开发体验和代码质量

## 开发规范

### 组件命名
- 文件名：PascalCase（如 `PostCard.vue`）
- 组件名：PascalCase
- 变量名：camelCase

### 文件组织
- 按功能模块组织组件
- 相关文件放在同一目录
- 保持目录结构清晰

### 样式约定
- 使用 TailwindCSS 工具类
- 组件样式使用 scoped
- 响应式设计优先

### 类型定义
- 所有数据接口定义类型
- 使用严格的 TypeScript 配置
- 导出可复用的类型

## 待补充内容

### 高优先级：
1. 环境配置文件（`.env`, `.env.example`）
2. 类型定义实现（`types/` 目录下的文件）
3. 示例博客文章内容
4. 完善 README.md 文档

### 中优先级：
5. 代码格式化配置（Prettier, ESLint）
6. 更多静态资源（图片、图标等）
7. SEO 和分析工具配置

### 低优先级：
8. PWA 配置
9. 性能优化配置
10. 国际化支持

## 下一步开发建议

1. **配置 `nuxt.config.ts`**：添加 SEO、站点地图、代码高亮等配置
2. **创建类型定义**：完善 `types/` 目录下的 TypeScript 类型
3. **添加示例内容**：在 `content/blog/` 下创建示例文章
4. **完善组件**：实现 `components/` 目录下的组件逻辑
5. **环境配置**：创建 `.env` 文件配置环境变量

---

*文档更新时间: 2025年9月9日*