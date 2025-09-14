# BlogFlow 全局配置使用指南

## 概述

BlogFlow 采用了符合 Nuxt 官方规范的全局配置系统，让你可以轻松自定义站点信息、个人资料、社交链接等设置。所有配置都集中在一个文件中，方便管理和维护。

## 配置文件位置

```
app/
├── config/
│   └── site.config.ts     # 主配置文件
├── types/
│   └── site.ts           # TypeScript 类型定义
└── composables/
    └── useSiteConfig.ts  # 配置访问工具
```

## 快速开始

### 1. 编辑基本信息

打开 `app/config/site.config.ts` 文件，修改以下配置：

```typescript
export const siteConfig: SiteConfig = {
  // 站点基本信息
  site: {
    name: '你的站点名称',
    title: '你的站点标题',
    description: '你的站点描述',
    url: 'https://yourdomain.com',
    logo: '/your-logo.png',
    favicon: '/your-favicon.ico'
  },
  
  // 作者信息
  author: {
    name: '你的姓名',
    avatar: '你的头像URL',
    bio: '你的个人简介',
    location: '你的所在地',
    website: '你的个人网站',
    email: 'your.email@example.com',
    profession: '你的职业',
    company: '你的公司'
  },
  
  // 社交媒体链接
  social: {
    github: 'https://github.com/yourusername',
    twitter: 'https://twitter.com/yourusername',
    linkedin: 'https://linkedin.com/in/yourusername',
    email: 'mailto:your.email@example.com',
    // 中文社交媒体（可选）
    wechat: 'your-wechat-id',
    weibo: 'https://weibo.com/yourusername',
    zhihu: 'https://zhihu.com/people/yourusername',
    juejin: 'https://juejin.cn/user/yourusername'
  }
}
```

### 2. 自定义页面内容

#### 首页配置

```typescript
pages: {
  home: {
    hero: {
      title: '你的首页标题',
      subtitle: '你的副标题',
      description: '你的首页描述',
      backgroundImage: '你的背景图片URL',
      ctaText: '行动按钮文本',
      ctaLink: '行动按钮链接'
    },
    features: [
      {
        title: '特性1标题',
        description: '特性1描述',
        icon: 'heroicons:icon-name'
      }
      // 添加更多特性...
    ]
  }
}
```

#### 关于页配置

```typescript
about: {
  timeline: [
    {
      year: '2024',
      title: '你的职位',
      description: '工作描述',
      company: '公司名称',
      location: '工作地点'
    }
    // 添加更多时间线项目...
  ],
  skills: {
    frontend: ['Vue.js', 'React', 'TypeScript'],
    backend: ['Node.js', 'Python', 'PostgreSQL'],
    tools: ['Git', 'Docker', 'VS Code']
  },
  interests: [
    '📚 你的兴趣1',
    '🎵 你的兴趣2',
    '🎨 你的兴趣3'
  ]
}
```

#### 联系页配置

```typescript
contact: {
  title: '联系我',
  description: '联系页面描述',
  formEndpoint: '/api/contact', // 可选
  responseTime: '24小时内'
}
```

### 3. 在组件中使用配置

BlogFlow 提供了多个 composable 函数来访问配置：

```vue
<script setup>
import {
  useSiteConfig,        // 获取完整配置
  useAuthorInfo,        // 获取作者信息
  useSocialLinks,       // 获取社交链接
  useFormattedSocialLinks, // 获取格式化的社交链接
  usePageConfig,        // 获取页面配置
  usePageSEO           // 生成SEO数据
} from '~/composables/useSiteConfig'

// 使用示例
const author = useAuthorInfo()
const socialLinks = useFormattedSocialLinks()

// 在模板中使用
</script>

<template>
  <div>
    <h1>{{ author.name }}</h1>
    <img :src="author.avatar" :alt="author.name" />
    <p>{{ author.bio }}</p>
    
    <!-- 社交链接 -->
    <div>
      <a v-for="social in socialLinks" 
         :key="social.name"
         :href="social.href"
         :class="social.color">
        {{ social.name }}
      </a>
    </div>
  </div>
</template>
```

## 高级配置

### 1. 导航菜单

```typescript
navigation: {
  header: [
    { name: '首页', href: '/' },
    { name: '博客', href: '/blog' },
    { name: '关于', href: '/about' },
    { name: '联系', href: '/contact' },
    { 
      name: '外部链接', 
      href: 'https://external.com',
      external: true,
      icon: 'heroicons:external-link'
    }
  ],
  footer: [
    {
      title: '导航组标题',
      links: [
        { name: '链接1', href: '/link1' },
        { name: '链接2', href: '/link2' }
      ]
    }
  ]
}
```

### 2. SEO 配置

```typescript
seo: {
  defaultTitle: '默认页面标题',
  titleTemplate: '%s - 你的站点名', // %s 会被页面标题替换
  defaultDescription: '默认描述',
  defaultImage: '默认社交分享图片',
  twitterCard: 'summary_large_image',
  locale: 'zh-CN'
}
```

### 3. 功能开关

```typescript
features: {
  darkMode: true,     // 是否启用深色模式
  comments: true,     // 是否启用评论功能
  analytics: true,    // 是否启用分析功能
  rss: true,         // 是否启用RSS
  sitemap: true      // 是否启用站点地图
}
```

## 类型安全

所有配置都有完整的 TypeScript 类型定义，你可以在编辑器中获得智能提示和类型检查。

### 扩展配置类型

如果需要添加自定义配置，可以修改 `app/types/site.ts`：

```typescript
export interface SiteConfig {
  // 现有配置...
  
  // 添加自定义配置
  custom: {
    analyticsId: string
    apiUrl: string
    // 其他自定义配置...
  }
}
```

## 最佳实践

### 1. 图片资源

- 头像建议尺寸：200x200 像素
- 网站 Logo：建议使用 SVG 格式
- 背景图片：建议使用高质量图片，尺寸 1920x1080 或更高

### 2. 社交链接

- 只填写你实际使用的社交媒体
- 邮箱链接使用 `mailto:` 前缀
- 外部链接确保有效性

### 3. SEO 优化

- 页面标题保持在 60 字符以内
- 描述保持在 160 字符以内
- 使用有意义的 alt 文本

### 4. 内容管理

- 保持个人简介简洁明了
- 技能列表按重要性排序
- 时间线按时间倒序排列

## 部署注意事项

在部署到生产环境前，请确保：

1. 所有链接都是有效的
2. 图片资源可以正常访问
3. 邮箱地址是真实的
4. 社交媒体链接指向正确的账户

## 常见问题

### Q: 如何添加新的社交媒体平台？

A: 在 `social` 配置中添加新字段，然后在 `useSiteConfig.ts` 的 `useFormattedSocialLinks` 函数中添加对应的图标和样式。

### Q: 可以动态修改配置吗？

A: 配置在构建时确定，如需动态修改，建议使用数据库或 CMS 系统。

### Q: 如何本地化多语言？

A: 可以创建多个配置文件（如 `site.config.en.ts`、`site.config.zh.ts`），然后根据语言环境选择对应配置。

## 支持

如果你在使用过程中遇到问题，可以：

1. 查看项目文档
2. 提交 Issue
3. 参考示例配置

希望这个配置系统能让你轻松打造个性化的博客站点！