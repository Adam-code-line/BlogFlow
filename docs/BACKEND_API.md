# BlogFlow 后端 API 开发文档

## 📋 项目概述

BlogFlow 是一个现代化的博客管理系统前端项目，已完成所有前端功能开发。本文档为后端开发者提供API接口规范和数据结构定义，帮助快速实现后端服务。

## 🎯 核心功能需求

### 已实现的前端功能
- ✅ **用户认证系统** - 登录、注册、权限管理
- ✅ **文章管理系统** - CRUD操作、草稿发布
- ✅ **分类标签系统** - 内容组织和筛选
- ✅ **搜索功能** - 全文搜索和分类筛选
- ✅ **统计分析** - 访问统计和数据分析
- ✅ **图片管理** - 文件上传和管理
- ✅ **响应式界面** - 移动端适配完成

### 需要后端支持的功能
- 🔗 **API接口** - RESTful API 服务
- 🗄️ **数据库** - 数据持久化存储
- 🔐 **身份验证** - JWT Token 管理
- 📁 **文件存储** - 图片和媒体文件
- 📊 **统计分析** - 数据聚合和分析

## 📊 数据模型设计

### 1. 用户模型 (User)

```typescript
interface User {
  id: string                    // 用户唯一标识
  email: string                 // 邮箱（登录凭证）
  password: string              // 密码（加密存储）
  username: string              // 用户名
  name: string                  // 用户姓名
  avatar?: string               // 头像URL
  role: 'admin' | 'author' | 'editor' | 'subscriber' | 'guest'  // 用户角色
  bio?: string                  // 个人简介
  location?: string             // 所在地
  website?: string              // 个人网站
  socialLinks?: {               // 社交媒体链接
    github?: string
    twitter?: string
    linkedin?: string
    website?: string
    email?: string
  }
  permissions: string[]         // 权限列表
  createdAt: Date              // 创建时间
  updatedAt: Date              // 更新时间
  lastLoginAt?: Date           // 最后登录时间
  isActive: boolean            // 账户状态
  ipAddress?: string           // 最后登录IP
}
```

### 2. 文章模型 (Post)

```typescript
interface Post {
  id: string                    // 文章唯一标识
  title: string                 // 文章标题
  content: {                    // 文章内容
    markdown: string            // Markdown原文
    html?: string              // 渲染后的HTML
    excerpt?: string           // 摘要
    tableOfContents?: {        // 目录结构
      id: string
      title: string
      level: number
      anchor: string
      children?: any[]
    }[]
  }
  description?: string          // 文章描述/摘要
  slug: string                  // URL友好的标识符
  coverImage?: string           // 封面图片URL
  images?: string[]             // 文章图片列表
  status: 'draft' | 'published' | 'archived'  // 发布状态
  priority: 'low' | 'normal' | 'high' | 'featured'  // 优先级
  category?: string             // 文章分类
  tags: string[]                // 标签数组
  authorId: string              // 作者ID（关联用户）
  meta: {                       // 文章元数据
    views: number               // 浏览量
    likes: number               // 点赞数
    comments: number            // 评论数
    shares: number              // 分享数
    readingTime: number         // 预估阅读时间（分钟）
    wordCount: number           // 字数统计
  }
  seo: {                        // SEO数据
    title?: string
    description?: string
    keywords?: string[]
    ogTitle?: string
    ogDescription?: string
    ogImage?: string
    twitterCard?: 'summary' | 'summary_large_image'
    canonical?: string
  }
  publishedAt?: Date            // 发布时间
  createdAt: Date              // 创建时间
  updatedAt: Date              // 更新时间
  scheduledAt?: Date           // 定时发布时间
  featured: boolean             // 是否推荐
  allowComments: boolean        // 是否允许评论
  isTop: boolean               // 是否置顶
}
```

### 3. 分类模型 (Category)

```typescript
interface Category {
  id: string                    // 分类唯一标识
  name: string                  // 分类名称
  description?: string          // 分类描述
  slug: string                  // URL标识符
  color?: string                // 分类颜色
  createdAt: Date              // 创建时间
  postCount: number            // 文章数量
}
```

### 4. 标签模型 (Tag)

```typescript
interface Tag {
  id: string                    // 标签唯一标识
  name: string                  // 标签名称
  slug: string                  // URL标识符
  color?: string                // 标签颜色
  createdAt: Date              // 创建时间
  postCount: number            // 使用次数
}
```

### 5. 统计模型 (Analytics)

```typescript
interface Analytics {
  id: string                    // 统计记录ID
  type: 'page_view' | 'post_view' | 'user_action'  // 统计类型
  resourceId?: string           // 关联资源ID
  userId?: string               // 用户ID（可选）
  metadata: {                   // 元数据
    userAgent?: string
    ip?: string
    referrer?: string
    [key: string]: any
  }
  createdAt: Date              // 记录时间
}
```

## 🔌 API 接口规范

### 基础信息
- **Base URL**: `https://api.blogflow.com/v1`
- **认证方式**: Bearer Token (JWT)
- **数据格式**: JSON
- **字符编码**: UTF-8

### 通用响应格式

```typescript
// 成功响应
interface SuccessResponse<T> {
  success: true
  data: T
  message?: string
  meta?: {
    pagination?: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
    [key: string]: any
  }
}

// 错误响应
interface ErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details?: any
  }
  timestamp: string
}
```

### 分页参数

```typescript
interface PaginationParams {
  page?: number      // 页码，默认 1
  limit?: number     // 每页数量，默认 10
  sort?: string      // 排序字段
  order?: 'asc' | 'desc'  // 排序方向
}
```

## 🔐 认证接口

### 1. 用户注册
```http
POST /auth/register
Content-Type: application/json

{
  "username": "用户名",
  "name": "用户姓名",
  "email": "user@example.com",
  "password": "密码"
}
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "username": "用户名",
      "name": "用户姓名",
      "email": "user@example.com",
      "role": "subscriber",
      "permissions": ["read"]
    },
    "token": "jwt_token_here",
    "refreshToken": "refresh_token_here"
  }
}
```

### 2. 用户登录
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "密码"
}
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "username": "用户名",
      "name": "用户姓名",
      "email": "user@example.com",
      "role": "admin",
      "permissions": ["read", "write", "delete", "admin"]
    },
    "token": "jwt_token_here",
    "refreshToken": "refresh_token_here"
  }
}
```

### 3. 管理员登录（二次认证）
```http
POST /auth/admin-login
Content-Type: application/json

{
  "username": "admin",
  "password": "密码",
  "confirmCode": "1234"
}
```

### 3. 刷新Token
```http
POST /auth/refresh
Authorization: Bearer {refresh_token}
```

### 4. 登出
```http
POST /auth/logout
Authorization: Bearer {access_token}
```

### 5. 获取当前用户信息
```http
GET /auth/me
Authorization: Bearer {access_token}
```

## 📝 文章接口

### 1. 获取文章列表
```http
GET /posts?page=1&limit=10&category=tech&tag=vue&status=published
```

**查询参数:**
- `page`: 页码
- `limit`: 每页数量
- `category`: 分类筛选
- `tag`: 标签筛选
- `status`: 状态筛选
- `search`: 搜索关键词
- `author`: 作者筛选

### 2. 获取文章详情
```http
GET /posts/{id}
```

### 3. 创建文章
```http
POST /posts
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "title": "文章标题",
  "content": {
    "markdown": "# Markdown内容",
    "excerpt": "文章摘要"
  },
  "description": "文章描述",
  "category": "技术",
  "tags": ["Vue", "TypeScript"],
  "status": "draft",
  "priority": "normal",
  "coverImage": "https://example.com/image.jpg",
  "featured": false,
  "allowComments": true,
  "isTop": false,
  "seo": {
    "title": "SEO标题",
    "description": "SEO描述",
    "keywords": ["关键词1", "关键词2"]
  }
}
```

### 4. 更新文章
```http
PUT /posts/{id}
Authorization: Bearer {access_token}
```

### 5. 删除文章
```http
DELETE /posts/{id}
Authorization: Bearer {access_token}
```

### 6. 发布文章
```http
POST /posts/{id}/publish
Authorization: Bearer {access_token}
```

### 7. 文章搜索
```http
GET /posts/search?q=搜索关键词&category=技术&tags=vue,typescript
```

## 🏷️ 分类标签接口

### 1. 获取分类列表
```http
GET /categories
```

### 2. 获取标签列表
```http
GET /tags
```

### 3. 创建分类
```http
POST /categories
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "name": "分类名称",
  "description": "分类描述",
  "color": "#3b82f6"
}
```

### 4. 创建标签
```http
POST /tags
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "name": "标签名称",
  "color": "#10b981"
}
```

## 👥 用户管理接口

### 1. 获取用户列表（管理员）
```http
GET /users?page=1&limit=10&role=author
Authorization: Bearer {admin_token}
```

### 2. 获取用户详情
```http
GET /users/{id}
Authorization: Bearer {access_token}
```

### 3. 更新用户信息
```http
PUT /users/{id}
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "name": "新姓名",
  "bio": "个人简介",
  "location": "北京",
  "website": "https://example.com"
}
```

### 4. 更新用户角色（管理员）
```http
PUT /users/{id}/role
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "role": "author"
}
```

### 5. 删除用户（管理员）
```http
DELETE /users/{id}
Authorization: Bearer {admin_token}
```

## 📁 文件上传接口

### 1. 上传图片
```http
POST /upload/image
Authorization: Bearer {access_token}
Content-Type: multipart/form-data

{
  "file": "图片文件",
  "type": "cover" | "content"
}
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "url": "https://cdn.example.com/images/uuid.jpg",
    "filename": "uuid.jpg",
    "size": 1024000,
    "mimetype": "image/jpeg"
  }
}
```

### 2. 上传多个文件
```http
POST /upload/multiple
Authorization: Bearer {access_token}
Content-Type: multipart/form-data
```

### 3. 删除文件
```http
DELETE /upload/{filename}
Authorization: Bearer {access_token}
```

## 📊 统计分析接口

### 1. 获取网站统计
```http
GET /analytics/stats
Authorization: Bearer {access_token}
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "totalPosts": 125,
    "totalUsers": 1250,
    "totalViews": 25000,
    "totalComments": 520,
    "todayViews": 156,
    "weeklyViews": 1200,
    "monthlyViews": 5400
  }
}
```

### 2. 获取文章统计
```http
GET /analytics/posts/{id}/stats
Authorization: Bearer {access_token}
```

### 3. 记录访问
```http
POST /analytics/track
Content-Type: application/json

{
  "type": "page_view",
  "resourceId": "post_id",
  "metadata": {
    "userAgent": "Mozilla/5.0...",
    "referrer": "https://google.com"
  }
}
```

### 4. 获取热门文章
```http
GET /analytics/popular?period=7d&limit=10
```

### 5. 获取用户活动统计
```http
GET /analytics/users/activity?period=30d
Authorization: Bearer {admin_token}
```

## 🔍 搜索接口

### 1. 全文搜索
```http
GET /search?q=关键词&type=posts&page=1&limit=10
```

**查询参数:**
- `q`: 搜索关键词
- `type`: 搜索类型 (posts, users, categories)
- `filters`: 过滤条件

### 2. 搜索建议
```http
GET /search/suggestions?q=vue
```

### 3. 高级搜索
```http
POST /search/advanced
Content-Type: application/json

{
  "keywords": "Vue TypeScript",
  "category": "技术",
  "tags": ["Vue", "TypeScript"],
  "author": "作者ID",
  "dateRange": {
    "start": "2024-01-01",
    "end": "2024-12-31"
  }
}
```

## 🛡️ 权限与安全

### 角色权限矩阵

| 功能 | 管理员 | 作者 | 编辑 | 订阅者 | 访客 |
|------|--------|------|------|--------|------|
| 查看公开文章 | ✅ | ✅ | ✅ | ✅ | ✅ |
| 创建文章 | ✅ | ✅ | ✅ | ❌ | ❌ |
| 编辑自己的文章 | ✅ | ✅ | ✅ | ❌ | ❌ |
| 编辑所有文章 | ✅ | ❌ | ✅ | ❌ | ❌ |
| 删除文章 | ✅ | ✅* | ✅* | ❌ | ❌ |
| 发布文章 | ✅ | ✅ | ✅ | ❌ | ❌ |
| 管理用户 | ✅ | ❌ | ❌ | ❌ | ❌ |
| 管理分类标签 | ✅ | ❌ | ❌ | ❌ | ❌ |
| 查看统计 | ✅ | ✅* | ✅* | ❌ | ❌ |
| 文件上传 | ✅ | ✅ | ✅ | ❌ | ❌ |
| 评论管理 | ✅ | ❌ | ✅ | ❌ | ❌ |

*仅限自己的内容

### 安全要求

1. **密码安全**
   - 最少8位，包含大小写字母、数字
   - 使用bcrypt加密存储
   - 实现密码重置功能

2. **Token管理**
   - JWT Token，有效期2小时
   - Refresh Token，有效期7天
   - 实现Token黑名单机制

3. **数据验证**
   - 所有输入数据必须验证
   - 防止SQL注入和XSS攻击
   - 文件上传安全检查

4. **访问控制**
   - API端点权限验证
   - 资源所有权检查
   - 速率限制和防爬虫

## 📈 性能要求

### 响应时间要求
- **API响应**: < 200ms (P95)
- **数据库查询**: < 100ms
- **文件上传**: < 2s (10MB以内)
- **搜索功能**: < 500ms

### 并发处理
- **同时在线用户**: 1000+
- **文章列表**: 支持高频访问
- **搜索功能**: 支持并发搜索

### 缓存策略
- **文章内容**: Redis缓存，24小时
- **用户信息**: 内存缓存，1小时
- **统计数据**: 定时更新，缓存30分钟
- **搜索结果**: 缓存热门搜索，1小时

## 🗄️ 数据库设计建议

### 推荐技术栈
- **关系型数据库**: PostgreSQL 或 MySQL
- **缓存**: Redis
- **搜索引擎**: Elasticsearch (可选)
- **文件存储**: 云存储服务 (AWS S3, 阿里云OSS等)

### 索引建议
```sql
-- 用户表
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- 文章表
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_posts_published ON posts(published_at);
CREATE INDEX idx_posts_search ON posts USING gin(title, content);

-- 统计表
CREATE INDEX idx_analytics_type_date ON analytics(type, created_at);
CREATE INDEX idx_analytics_resource ON analytics(resource_id);
```

## 🚀 部署建议

### 环境配置
```bash
# 环境变量
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
UPLOAD_PATH=/uploads
CDN_URL=https://cdn.example.com
```

### API版本管理
- 使用URL版本控制: `/v1/`, `/v2/`
- 向后兼容性保证
- 废弃API的渐进式迁移

### 监控和日志
- API性能监控
- 错误日志记录
- 用户行为分析
- 安全事件监控

## 🔧 开发工具建议

### 后端框架推荐
- **Node.js**: Express.js, Fastify, NestJS
- **Python**: FastAPI, Django REST
- **Java**: Spring Boot
- **Go**: Gin, Echo
- **PHP**: Laravel

### 开发工具
- **API文档**: Swagger/OpenAPI
- **数据库工具**: Prisma, TypeORM, Sequelize
- **测试工具**: Jest, Mocha, pytest
- **部署工具**: Docker, Docker Compose

## 📞 联系支持

如果在实现过程中遇到问题：

1. **前端接口对接**: 检查请求格式和响应结构
2. **数据模型疑问**: 参考TypeScript接口定义
3. **权限实现**: 参考权限矩阵和安全要求
4. **性能优化**: 参考缓存策略和性能要求

---

**文档版本**: v1.0  
**最后更新**: 2025年9月15日  
**维护状态**: ✅ 活跃维护

📝 **备注**: 本文档基于已完成的前端项目编写，所有接口规范都经过前端验证，可直接用于后端开发。