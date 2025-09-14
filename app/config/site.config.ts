/**
 * 站点全局配置文件
 * 按照 Nuxt 官方规范创建的配置文件
 * 用于集中管理用户信息、社交链接、站点设置等
 */

import type { SiteConfig } from '~/types/site'

// 默认配置 - 用户可以修改这里的值来自定义站点
export const siteConfig: SiteConfig = {
  // ====== 站点基本信息 ======
  site: {
    name: 'Adam的个人博客',
    title: 'Adam的个人博客 - 分享前端开发经验',
    description: '专注于前端开发的技术分享博客',
    url: 'https://adam-blog.com',
    logo: '/logo.png',
    favicon: '/favicon.ico'
  },

  // ====== 个人信息 ======
  author: {
    name: 'Adam',
    avatar: '/images/avatar.jpg',
    bio: '一名热爱技术的前端工程师，专注于用户体验和代码质量',
    location: '中国，大连',
    website: 'https://adam-blog.com',
    email: 'adam@example.com',
    profession: '学生',
    company: '大连理工大学'
  },

  // ====== 社交媒体链接 ======
  // 注意：只填写你实际使用的平台，不用的可以删除或注释
  social: {
    github: 'https://github.com/Adam-code-line',
    email: 'mailto:your.email@example.com'
    // 可选的社交媒体平台（已删除不使用的）
    // twitter: 'https://twitter.com/yourusername',
    // linkedin: 'https://linkedin.com/in/yourusername',
    // wechat: 'your-wechat-id',
    // weibo: 'https://weibo.com/yourusername',
    // zhihu: 'https://zhihu.com/people/yourusername',
    // juejin: 'https://juejin.cn/user/yourusername',
    // telegram: 'https://t.me/yourusername',
    // discord: 'https://discord.gg/yourinvite'
  },

  // ====== 导航菜单 ======
  navigation: {
    header: [
      { name: '首页', href: '/' },
      { name: '博客', href: '/blog' },
      { name: '关于', href: '/about' },
      { name: '联系', href: '/contact' }
    ],
    footer: [
      {
        title: '快速链接',
        links: [
          { name: '首页', href: '/' },
          { name: '博客', href: '/blog' },
          { name: '关于我', href: '/about' },
          { name: '联系我', href: '/contact' }
        ]
      },
      {
        title: '技术栈',
        links: [
          { name: 'Vue.js', href: 'https://vuejs.org', external: true },
          { name: 'Nuxt.js', href: 'https://nuxt.com', external: true },
          { name: 'TypeScript', href: 'https://typescriptlang.org', external: true },
          { name: 'Tailwind CSS', href: 'https://tailwindcss.com', external: true }
        ]
      }
    ]
  },

  // ====== 页面内容配置 ======
  pages: {
    home: {
      hero: {
        title: '欢迎来到我的技术博客',
        subtitle: '分享前端开发经验与思考',
        description: '在这里，我会分享我的技术见解、项目经验和学习心得',
        backgroundImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1920&h=1080&fit=crop',
        ctaText: '开始阅读',
        ctaLink: '/blog'
      },
      features: [
        {
          title: '技术分享',
          description: '分享最新的前端技术和开发经验',
          icon: 'heroicons:code-bracket'
        },
        {
          title: '项目经验',
          description: '记录实际项目中的问题解决方案',
          icon: 'heroicons:academic-cap'
        },
        {
          title: '学习笔记',
          description: '持续学习新技术，分享学习心得',
          icon: 'heroicons:heart'
        }
      ]
    },

    about: {
      timeline: [
        {
          year: '2024',
          title: '学生',
          description: '学习前端基础知识',
          company: '大连理工大学',
          location: '大连'
        },
        {
          year: '2025',
          title: '学生',
          description: '学习前端框架和工具',
          company: '大连理工大学',
          location: '大连'
        }
      ],
      skills: {
        frontend: ['Vue.js', 'Nuxt.js', 'TypeScript'],
        backend: ['Node.js', 'Java', 'MySQL'],
        tools: ['Git', 'Docker', 'VS Code']
      },
      interests: [
        '📚 阅读技术博客',
        '🎵 听音乐',
        '🏃 打羽毛球'
      ]
    },

    // 联系页配置
    contact: {
      title: '联系我',
      description: '如果你有任何问题或合作意向，欢迎联系我',
      formEndpoint: '/api/contact',
      responseTime: '24小时内'
    }
  },

  // ====== SEO 配置 ======
  seo: {
    defaultTitle: 'Adam的个人博客',
    titleTemplate: '%s - Adam的个人博客',
    defaultDescription: '欢迎来到我的个人博客',
    defaultImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=630&fit=crop',
    twitterCard: 'summary_large_image',
    locale: 'zh-CN'
  },

  // ====== 功能开关 ======
  features: {
    darkMode: true,
    comments: true,
    analytics: true,
    rss: true,
    sitemap: true
  }
}

// 导出配置
export default siteConfig

/* 
配置完成后的后续步骤：

1. 保存此文件
2. 重启开发服务器：npm run dev
3. 访问各个页面检查配置是否正确应用
4. 根据需要调整样式和内容
5. 准备部署到生产环境

常见问题：
- 图片无法显示：检查图片URL是否有效
- 链接无法访问：确保社交媒体链接正确
- 样式问题：检查图标名称是否正确

如需帮助，请参考 SITE_CONFIG_GUIDE.md 文档
*/