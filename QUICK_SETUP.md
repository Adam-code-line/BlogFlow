# BlogFlow 配置系统快速上手

## 🚀 快速配置你的博客

BlogFlow 提供了三种方式来配置你的博客：

### 方法一：使用配置向导（推荐新手）

运行配置向导，它会引导你逐步完成配置：

```bash
npm run setup
```

向导会询问以下信息：
- 📝 博客名称和描述
- 👤 个人信息（姓名、简介、职业等）
- 📧 联系方式
- 🌐 社交媒体链接

完成后会自动生成 `app/config/site.config.ts` 文件。

### 方法二：手动编辑配置文件

1. 复制模板文件：
   ```bash
   cp site.config.template.ts app/config/site.config.ts
   ```

2. 编辑 `app/config/site.config.ts` 文件，修改其中的配置信息

### 方法三：直接创建配置文件

参考 `SITE_CONFIG_GUIDE.md` 文档，直接创建配置文件。

## ⚙️ 主要配置项

### 基本信息
```typescript
site: {
  name: '你的博客名称',
  title: '浏览器标题',
  description: 'SEO描述',
  url: '你的域名'
}
```

### 个人信息
```typescript
author: {
  name: '你的姓名',
  avatar: '头像URL',
  bio: '个人简介',
  location: '所在地',
  email: '邮箱地址',
  profession: '职业'
}
```

### 社交媒体
```typescript
social: {
  github: 'GitHub链接',
  linkedin: 'LinkedIn链接',
  email: 'mailto:your@email.com',
  // 中文平台
  wechat: '微信号',
  weibo: '微博链接',
  zhihu: '知乎链接'
}
```

## 🎨 自定义页面内容

### 首页配置
- Hero 区域标题和描述
- 特色功能模块
- 行动按钮链接

### 关于页配置
- 职业时间线
- 技能列表
- 个人兴趣

### 联系页配置
- 联系页标题和描述
- 响应时间承诺

## 📝 使用配置

在组件中使用配置数据：

```vue
<script setup>
import { useAuthorInfo, useSocialLinks } from '~/composables/useSiteConfig'

const author = useAuthorInfo()
const socialLinks = useSocialLinks()
</script>

<template>
  <div>
    <h1>{{ author.name }}</h1>
    <p>{{ author.bio }}</p>
    <img :src="author.avatar" :alt="author.name" />
  </div>
</template>
```

## 🔧 开发流程

1. **配置博客**：运行 `npm run setup` 或手动编辑配置
2. **启动开发**：`npm run dev`
3. **查看效果**：访问 `http://localhost:3000`
4. **调整配置**：修改 `app/config/site.config.ts`
5. **发布上线**：`npm run build`

## 📖 更多帮助

- 📚 详细配置指南：`SITE_CONFIG_GUIDE.md`
- 🎯 配置模板：`site.config.template.ts`
- 🛠️ 类型定义：`app/types/site.ts`

## 💡 提示

- 配置修改后需要重启开发服务器
- 图片建议使用 CDN 或放在 `public/` 目录
- 社交链接只填写你实际使用的平台
- 邮箱链接记得加 `mailto:` 前缀

开始配置你的博客吧！🎉