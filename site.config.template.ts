/**
 * BlogFlow 站点配置模板
 * 
 * 这是一个配置模板文件，请复制到 app/config/site.config.ts 并根据你的需求修改
 * 
 * 使用步骤：
 * 1. 复制此文件到 app/config/site.config.ts
 * 2. 修改下方的配置信息
 * 3. 替换示例数据为你的真实信息
 * 4. 保存文件并重启开发服务器
 */

// 注意：这个模板文件不需要导入类型，复制到正确位置后会自动获得类型支持

export const siteConfig = {
  // ====== 站点基本信息 ======
  site: {
    name: '请修改：你的博客名称',                    // 例如：'小明的技术博客'
    title: '请修改：你的博客标题',                  // 例如：'小明的技术博客 - 分享前端开发经验'
    description: '请修改：博客描述（用于SEO）',      // 例如：'专注于前端开发、Vue.js、TypeScript的技术分享博客'
    url: 'https://请修改.com',                    // 例如：'https://xiaoming-blog.com'
    logo: '/logo.png',                           // 你的Logo文件路径
    favicon: '/favicon.ico'                      // 你的网站图标
  },
  
  // ====== 个人信息 ======
  author: {
    name: '请修改：你的姓名',                       // 例如：'张小明'
    avatar: '请修改：头像图片URL',                  // 建议使用 200x200 尺寸的图片
    bio: '请修改：个人简介（1-2句话）',             // 例如：'一名热爱技术的前端工程师，专注于用户体验和代码质量'
    location: '请修改：所在地',                    // 例如：'中国，上海'
    website: '请修改：个人网站',                   // 例如：'https://xiaoming.dev'
    email: '请修改：邮箱地址',                     // 例如：'hello@xiaoming.dev'
    profession: '请修改：职业',                    // 例如：'前端工程师'
    company: '请修改：公司名称（可选）'             // 例如：'某科技公司' 或留空
  },
  
  // ====== 社交媒体链接 ======
  // 注意：只填写你实际使用的平台，不用的可以删除或注释
  social: {
    github: '请修改：GitHub链接',                  // 例如：'https://github.com/xiaoming'
    // twitter: '你的Twitter链接',                 // 例如：'https://twitter.com/xiaoming'
    // linkedin: '你的LinkedIn链接',               // 例如：'https://linkedin.com/in/xiaoming'
    email: '请修改：邮箱链接',                     // 例如：'mailto:hello@xiaoming.dev'
    
    // 中文社交媒体（根据需要启用）
    // wechat: '你的微信号',                       // 例如：'xiaoming_dev'
    // weibo: '你的微博链接',                      // 例如：'https://weibo.com/xiaoming'
    // zhihu: '你的知乎链接',                      // 例如：'https://zhihu.com/people/xiaoming'
    // juejin: '你的掘金链接',                     // 例如：'https://juejin.cn/user/xiaoming'
  },
  
  // ====== 导航菜单 ======
  navigation: {
    // 顶部导航
    header: [
      { name: '首页', href: '/' },
      { name: '博客', href: '/blog' },
      { name: '关于', href: '/about' },
      { name: '联系', href: '/contact' }
      // 添加更多导航项：
      // { name: '作品集', href: '/portfolio' },
      // { name: '资源', href: '/resources', external: true }
    ],
    
    // 底部导航
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
    // 首页配置
    home: {
      hero: {
        title: '请修改：首页主标题',                  // 例如：'欢迎来到我的技术博客'
        subtitle: '请修改：首页副标题',              // 例如：'分享前端开发经验与思考'
        description: '请修改：首页描述',            // 例如：'在这里，我会分享我的技术见解、项目经验和学习心得'
        backgroundImage: '请修改：背景图片URL',      // 例如：'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1920&h=1080&fit=crop'
        ctaText: '开始阅读',                       // 行动按钮文本
        ctaLink: '/blog'                          // 行动按钮链接
      },
      
      // 首页特色模块
      features: [
        {
          title: '请修改：特色1标题',                 // 例如：'技术分享'
          description: '请修改：特色1描述',          // 例如：'分享最新的前端技术和开发经验'
          icon: 'heroicons:code-bracket'           // 图标名称
        },
        {
          title: '请修改：特色2标题',                 // 例如：'项目经验'
          description: '请修改：特色2描述',          // 例如：'记录实际项目中的问题解决方案'
          icon: 'heroicons:academic-cap'
        },
        {
          title: '请修改：特色3标题',                 // 例如：'学习笔记'
          description: '请修改：特色3描述',          // 例如：'持续学习新技术，分享学习心得'
          icon: 'heroicons:heart'
        }
      ]
    },
    
    // 关于页配置
    about: {
      // 职业时间线
      timeline: [
        {
          year: '请修改：年份',                      // 例如：'2024'
          title: '请修改：职位标题',                 // 例如：'高级前端工程师'
          description: '请修改：工作描述',           // 例如：'负责大型Web应用的前端架构设计和开发'
          company: '请修改：公司名称',               // 例如：'某科技公司'
          location: '请修改：工作地点'               // 例如：'上海'
        },
        {
          year: '请修改：年份',                      // 例如：'2022'
          title: '请修改：职位标题',                 // 例如：'前端工程师'
          description: '请修改：工作描述',           // 例如：'参与多个产品的前端开发工作'
          company: '请修改：公司名称',               // 例如：'某创业公司'
          location: '请修改：工作地点'               // 例如：'北京'
        }
        // 添加更多工作经历...
      ],
      
      // 技能列表
      skills: {
        frontend: [
          '请修改：前端技能1',                       // 例如：'Vue.js'
          '请修改：前端技能2',                       // 例如：'React'
          '请修改：前端技能3'                        // 例如：'TypeScript'
          // 添加更多前端技能...
        ],
        backend: [
          '请修改：后端技能1',                       // 例如：'Node.js'
          '请修改：后端技能2',                       // 例如：'Python'
          '请修改：后端技能3'                        // 例如：'PostgreSQL'
          // 添加更多后端技能...
        ],
        tools: [
          '请修改：工具技能1',                       // 例如：'Git'
          '请修改：工具技能2',                       // 例如：'Docker'
          '请修改：工具技能3'                        // 例如：'VS Code'
          // 添加更多工具...
        ]
      },
      
      // 个人兴趣
      interests: [
        '请修改：兴趣1',                            // 例如：'📚 阅读技术书籍'
        '请修改：兴趣2',                            // 例如：'🎵 听音乐'
        '请修改：兴趣3'                             // 例如：'🏃 跑步健身'
        // 添加更多兴趣...
      ]
    },
    
    // 联系页配置
    contact: {
      title: '联系我',                             // 联系页标题
      description: '请修改：联系页描述',            // 例如：'如果你有任何问题或合作意向，欢迎联系我'
      formEndpoint: '/api/contact',               // 联系表单提交地址（可选）
      responseTime: '24小时内'                    // 回复时间承诺
    }
  },
  
  // ====== SEO 配置 ======
  seo: {
    defaultTitle: '请修改：默认标题',               // 例如：'小明的技术博客'
    titleTemplate: '%s - 请修改：站点名',          // 例如：'%s - 小明的博客'
    defaultDescription: '请修改：默认描述',        // 例如：'专注前端开发的技术博客'
    defaultImage: '请修改：默认分享图片URL',        // 例如：'https://yourdomain.com/og-image.jpg'
    twitterCard: 'summary_large_image',          // Twitter卡片类型
    locale: 'zh-CN'                             // 语言设置
  },
  
  // ====== 功能开关 ======
  features: {
    darkMode: true,                             // 是否启用深色模式
    comments: true,                             // 是否启用评论功能
    analytics: true,                            // 是否启用分析功能
    rss: true,                                  // 是否启用RSS订阅
    sitemap: true                               // 是否启用站点地图
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