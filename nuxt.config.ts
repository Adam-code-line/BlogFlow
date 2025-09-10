import { defineNuxtConfig } from 'nuxt/config'
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  // SEO 和 Meta 配置
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'BlogFlow - 个人博客',
      meta: [
        { name: 'description', content: '基于 Nuxt 4 构建的现代化个人博客' },
        { name: 'keywords', content: '博客,个人网站,技术分享,Nuxt,Vue' },
        { name: 'author', content: 'BlogFlow' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'BlogFlow - 个人博客' },
        { property: 'og:description', content: '基于 Nuxt 4 构建的现代化个人博客' },
        { name: 'twitter:card', content: 'summary_large_image' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  // 模块配置
  modules: [
    '@nuxt/content',     // 内容管理
    '@nuxt/image',       // 图片优化
    '@nuxt/ui'           // UI 组件库
  ],


  content: {
    build: {
      markdown: {
        // Object syntax can be used to override default options
        remarkPlugins: {
          // Override remark-emoji options
          'remark-emoji': {
            options: {
              emoticon: true
            }
          },
          // Disable remark-gfm
          'remark-gfm': false
        },
        highlight: {
          // 设置代码高亮主题
          theme: {
            // 浅色主题
            default: 'github-light',
            // 暗色主题
            dark: 'github-dark'
          },
          // 支持的语言
          langs: [
            'javascript', 'typescript', 'vue', 'html', 'css', 'scss', 'json',
            'markdown', 'bash', 'shell', 'python', 'java', 'go', 'rust', 
            'php', 'sql', 'yaml', 'xml', 'dockerfile'
          ]
        }
      }
    }
  },

  // 自动导入配置 - 关键修复
  imports: {
    dirs: [
      'composables/**',
      'utils/**'
    ]
  },

  // Nuxt UI 配置 - 禁用字体模块以避免 Google Fonts 问题
  ui: {
    fonts: false         // 禁用 @nuxt/fonts 模块
  },

  // 图片优化配置
  image: {
    // 质量设置
    quality: 80,
    // 格式优化
    format: ['webp', 'jpg', 'png'],
    // 响应式图片
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536
    }
  },

  // CSS 配置
  css: [
    '~/assets/css/main.css',
    '~/assets/css/fonts.css'  // 添加字体配置
  ],

  // 运行时配置
  runtimeConfig: {
    // 公共配置（客户端和服务端都可用）
    public: {
      siteUrl: 'http://localhost:3000',
      siteName: 'BlogFlow',
      siteDescription: '基于 Nuxt 4 构建的现代化个人博客',
      // 分析工具配置
      googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID,
      baiduAnalyticsId: process.env.BAIDU_ANALYTICS_ID
    }
  },

  // Nitro 服务端配置
  nitro: {
    // 预渲染页面
    prerender: {
      routes: ['/sitemap.xml', '/robots.txt']
    }
  },

  // TypeScript 配置
  typescript: {
    strict: true,
    typeCheck: true
  },

  // 实验性功能
  experimental: {
    // 组件岛屿
    componentIslands: true,
    // 类型化页面
    typedPages: true
  }
})