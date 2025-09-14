/**
 * 站点全局配置文件
 * 按照 Nuxt 官方规范创建的配置文件
 * 用于集中管理用户信息、社交链接、站点设置等
 */

import type { SiteConfig } from '~/types/site'

// 默认配置 - 用户可以修改这里的值来自定义站点
export const siteConfig: SiteConfig = {
  site: {
    name: 'BlogFlow',
    title: 'BlogFlow - 现代化博客系统',
    description: '基于 Nuxt.js 构建的现代化博客系统，专注于优雅的设计和卓越的用户体验',
    url: 'https://blogflow.example.com',
    logo: '/logo.png',
    favicon: '/favicon.ico'
  },
  
  author: {
    name: '您的姓名',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    bio: '一名充满热情的全栈开发者，专注于现代Web技术和用户体验设计',
    location: '中国，北京',
    website: 'https://yourwebsite.com',
    email: 'your.email@example.com',
    profession: '全栈开发工程师',
    company: '您的公司名称'
  },
  
  social: {
    github: 'https://github.com/yourusername',
    twitter: 'https://twitter.com/yourusername',
    linkedin: 'https://linkedin.com/in/yourusername',
    email: 'mailto:your.email@example.com',
    // 可选的中文社交媒体
    // wechat: 'your-wechat-id',
    // weibo: 'https://weibo.com/yourusername',
    // zhihu: 'https://zhihu.com/people/yourusername',
    // juejin: 'https://juejin.cn/user/yourusername'
  },
  
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
  
  pages: {
    home: {
      hero: {
        title: '欢迎来到我的博客',
        subtitle: '分享技术，记录成长',
        description: '在这里，我会分享我的技术见解、学习心得和生活感悟。与你一起探索技术的无限可能。',
        backgroundImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1920&h=1080&fit=crop',
        ctaText: '开始阅读',
        ctaLink: '/blog'
      },
      features: [
        {
          title: '技术分享',
          description: '分享最新的前端技术、开发经验和最佳实践',
          icon: 'heroicons:code-bracket'
        },
        {
          title: '学习记录',
          description: '记录学习过程中的思考和总结，与你一起成长',
          icon: 'heroicons:academic-cap'
        },
        {
          title: '生活感悟',
          description: '分享工作之余的思考和对生活的感悟',
          icon: 'heroicons:heart'
        }
      ]
    },
    
    about: {
      timeline: [
        {
          year: '2024',
          title: '高级前端工程师',
          description: '专注于 Vue.js 生态系统和现代前端架构设计',
          company: '某知名互联网公司',
          location: '北京'
        },
        {
          year: '2022',
          title: '前端工程师',
          description: '负责大型 Web 应用的开发和维护，积累了丰富的项目经验',
          company: '某科技公司',
          location: '上海'
        },
        {
          year: '2020',
          title: '初级前端开发',
          description: '开始前端开发之路，学习现代前端技术栈',
          company: '某创业公司',
          location: '深圳'
        }
      ],
      skills: {
        frontend: ['Vue.js', 'React', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Sass/SCSS', 'Tailwind CSS'],
        backend: ['Node.js', 'Express', 'Fastify', 'PostgreSQL', 'MongoDB', 'Redis'],
        tools: ['Git', 'Docker', 'Webpack', 'Vite', 'ESLint', 'Prettier', 'Jest', 'Cypress']
      },
      interests: [
        '📚 阅读技术书籍和科幻小说',
        '🎵 古典音乐和爵士乐欣赏',
        '🎨 UI/UX设计和平面设计',
        '🌍 探索不同的文化和风景',
        '📷 记录生活中的美好瞬间'
      ]
    },
    
    contact: {
      title: '联系我',
      description: '如果你有任何问题、建议或者想要合作，请随时联系我。我会在24小时内回复你的消息。',
      formEndpoint: '/api/contact', // 可选：联系表单提交端点
      responseTime: '24小时内'
    }
  },
  
  seo: {
    defaultTitle: 'BlogFlow',
    titleTemplate: '%s - BlogFlow',
    defaultDescription: '基于 Nuxt.js 构建的现代化博客系统，专注于优雅的设计和卓越的用户体验',
    defaultImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=630&fit=crop',
    twitterCard: 'summary_large_image',
    locale: 'zh-CN'
  },
  
  features: {
    darkMode: true,
    comments: true,
    analytics: true,
    rss: true,
    sitemap: true
  }
}

// 导出默认配置
export default siteConfig