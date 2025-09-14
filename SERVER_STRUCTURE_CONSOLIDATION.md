# Server 目录结构整理完成

## 更改说明

已成功将 server 目录统一到项目根目录，符合 Nuxt 4 官方规范。

### 整理前结构
```
BlogFlow/
├── app/
│   └── server/          # 错误位置
│       └── api/
│           ├── statistics.get.ts
│           └── posts/index.post.ts
└── server/              # 正确位置（已存在）
    └── api/
        ├── analytics/
        ├── auth/
        ├── posts/
        ├── api.ts
        └── contact.post.ts
```

### 整理后结构
```
BlogFlow/
├── app/                 # ✅ 只包含前端代码
└── server/              # ✅ 统一的 API 服务端点
    └── api/
        ├── analytics/
        │   ├── event.post.ts
        │   └── pageview.post.ts
        ├── auth/
        │   └── login.post.ts
        ├── posts/
        │   ├── index.get.ts      # 获取文章列表
        │   ├── index.post.ts     # 创建文章
        │   └── [id].get.ts       # 获取单篇文章
        ├── api.ts               # API 服务定义
        ├── contact.post.ts      # 联系表单
        └── statistics.get.ts    # 统计数据接口 ✅ 新增
```

## 迁移的文件

1. **statistics.get.ts** - 统计数据 API，提供统一的数据接口
2. **posts/index.post.ts** - 文章创建 API，支持前端测试

## 验证结果

- ✅ 应用启动成功，无错误
- ✅ API 端点正常工作 (`/api/statistics`)
- ✅ TypeScript 编译通过
- ✅ 符合 Nuxt 4 官方目录结构规范

## API 端点

| 端点 | 方法 | 描述 |
|------|------|------|
| `/api/statistics` | GET | 获取网站统计数据 |
| `/api/posts` | GET | 获取文章列表 |
| `/api/posts` | POST | 创建新文章 |
| `/api/posts/[id]` | GET | 获取特定文章 |
| `/api/contact` | POST | 提交联系表单 |
| `/api/auth/login` | POST | 用户登录 |
| `/api/analytics/pageview` | POST | 记录页面访问 |
| `/api/analytics/event` | POST | 记录用户事件 |

服务端目录现在完全符合 Nuxt 4 最佳实践！