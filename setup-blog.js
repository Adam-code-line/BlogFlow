#!/usr/bin/env node

/**
 * BlogFlow 快速配置脚本
 * 运行此脚本来快速设置你的博客配置
 */

const fs = require('fs')
const path = require('path')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

// 询问用户输入的辅助函数
const question = (prompt) => {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

async function setupBlog() {
  console.log('\n🎉 欢迎使用 BlogFlow 配置向导！\n')
  console.log('我将帮助你快速设置你的博客。请按提示输入信息：\n')

  try {
    // 收集基本信息
    const siteName = await question('📝 你的博客名称（例如：小明的技术博客）: ')
    const siteTitle = await question('🏷️  网站标题（用于浏览器标签）: ')
    const siteDescription = await question('📄 网站描述（用于SEO，简短描述你的博客）: ')
    const siteUrl = await question('🌐 网站域名（例如：https://yourblog.com）: ')
    
    console.log('\n个人信息设置：')
    const authorName = await question('👤 你的姓名: ')
    const authorBio = await question('📋 个人简介（1-2句话介绍自己）: ')
    const authorLocation = await question('📍 所在地（例如：中国，上海）: ')
    const authorEmail = await question('📧 邮箱地址: ')
    const authorProfession = await question('💼 职业（例如：前端工程师）: ')
    const authorCompany = await question('🏢 公司名称（可选，直接回车跳过）: ')
    const authorAvatar = await question('🖼️  头像URL（可选，直接回车使用默认）: ')
    
    console.log('\n社交媒体链接（可选，不需要的直接回车跳过）：')
    const githubUrl = await question('🐙 GitHub链接: ')
    const linkedinUrl = await question('💼 LinkedIn链接: ')
    const twitterUrl = await question('🐦 Twitter链接: ')
    const wechatId = await question('💬 微信号: ')
    const weiboUrl = await question('📱 微博链接: ')
    
    // 生成配置文件内容
    const configContent = generateConfigFile({
      siteName: siteName || 'My Blog',
      siteTitle: siteTitle || 'My Blog - Tech Sharing',
      siteDescription: siteDescription || '我的技术博客',
      siteUrl: siteUrl || 'https://yourblog.com',
      authorName: authorName || 'Your Name',
      authorBio: authorBio || '一名热爱技术的开发者',
      authorLocation: authorLocation || '中国',
      authorEmail: authorEmail || 'your.email@example.com',
      authorProfession: authorProfession || '开发工程师',
      authorCompany: authorCompany,
      authorAvatar: authorAvatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
      githubUrl,
      linkedinUrl,
      twitterUrl,
      wechatId,
      weiboUrl
    })
    
    // 确保目标目录存在
    const configDir = path.join(__dirname, 'app', 'config')
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true })
    }
    
    // 写入配置文件
    const configPath = path.join(configDir, 'site.config.ts')
    fs.writeFileSync(configPath, configContent, 'utf8')
    
    console.log('\n✅ 配置文件已成功创建！')
    console.log(`📁 配置文件位置: ${configPath}`)
    console.log('\n🚀 后续步骤:')
    console.log('1. 运行 npm run dev 启动开发服务器')
    console.log('2. 访问你的博客查看效果')
    console.log('3. 如需修改配置，请编辑 app/config/site.config.ts 文件')
    console.log('\n📖 更多配置选项请查看 SITE_CONFIG_GUIDE.md 文档')
    
  } catch (error) {
    console.error('\n❌ 配置过程中出现错误:', error.message)
  } finally {
    rl.close()
  }
}

function generateConfigFile(config) {
  return `/**
 * BlogFlow 站点配置文件
 * 此文件由配置向导自动生成，你可以随时手动修改
 */

import type { SiteConfig } from '~/types/site'

export const siteConfig: SiteConfig = {
  // 站点基本信息
  site: {
    name: '${config.siteName}',
    title: '${config.siteTitle}',
    description: '${config.siteDescription}',
    url: '${config.siteUrl}',
    logo: '/logo.png',
    favicon: '/favicon.ico'
  },
  
  // 作者信息
  author: {
    name: '${config.authorName}',
    avatar: '${config.authorAvatar}',
    bio: '${config.authorBio}',
    location: '${config.authorLocation}',
    website: '${config.siteUrl}',
    email: '${config.authorEmail}',
    profession: '${config.authorProfession}',${config.authorCompany ? `\n    company: '${config.authorCompany}',` : ''}
  },
  
  // 社交媒体链接
  social: {
    email: 'mailto:${config.authorEmail}',${config.githubUrl ? `\n    github: '${config.githubUrl}',` : ''}${config.linkedinUrl ? `\n    linkedin: '${config.linkedinUrl}',` : ''}${config.twitterUrl ? `\n    twitter: '${config.twitterUrl}',` : ''}${config.wechatId ? `\n    wechat: '${config.wechatId}',` : ''}${config.weiboUrl ? `\n    weibo: '${config.weiboUrl}',` : ''}
  },
  
  // 导航配置
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
  
  // 页面配置
  pages: {
    home: {
      hero: {
        title: '欢迎来到${config.authorName}的博客',
        subtitle: '分享技术，记录成长',
        description: '在这里，我会分享我的技术见解、学习心得和生活感悟。与你一起探索技术的无限可能。',
        backgroundImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1920&h=1080&fit=crop',
        ctaText: '开始阅读',
        ctaLink: '/blog'
      },
      features: [
        {
          title: '技术分享',
          description: '分享最新的技术动态、开发经验和最佳实践',
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
          title: '${config.authorProfession}',
          description: '继续在技术道路上探索和成长',${config.authorCompany ? `\n          company: '${config.authorCompany}',` : ''}
          location: '${config.authorLocation}'
        }
      ],
      skills: {
        frontend: ['Vue.js', 'React', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3'],
        backend: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB'],
        tools: ['Git', 'Docker', 'VS Code', 'Figma']
      },
      interests: [
        '📚 阅读技术书籍',
        '🎵 音乐欣赏',
        '🎨 设计和创作',
        '🌍 旅行探索'
      ]
    },
    
    contact: {
      title: '联系${config.authorName}',
      description: '如果你有任何问题、建议或者想要合作，请随时联系我。我会在24小时内回复你的消息。',
      formEndpoint: '/api/contact',
      responseTime: '24小时内'
    }
  },
  
  // SEO 配置
  seo: {
    defaultTitle: '${config.siteName}',
    titleTemplate: '%s - ${config.siteName}',
    defaultDescription: '${config.siteDescription}',
    defaultImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=630&fit=crop',
    twitterCard: 'summary_large_image',
    locale: 'zh-CN'
  },
  
  // 功能开关
  features: {
    darkMode: true,
    comments: true,
    analytics: true,
    rss: true,
    sitemap: true
  }
}

export default siteConfig
`;
}

// 如果直接运行此脚本
if (require.main === module) {
  setupBlog()
}

module.exports = { setupBlog }
