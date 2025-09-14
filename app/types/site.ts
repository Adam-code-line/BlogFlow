/**
 * 站点配置相关的 TypeScript 类型定义
 */

// 导航链接类型
export interface NavigationLink {
  name: string
  href: string
  icon?: string
  external?: boolean
}

// 页脚导航组类型
export interface FooterNavigationGroup {
  title: string
  links: NavigationLink[]
}

// 社交媒体链接类型
export interface SocialLinks {
  github?: string
  twitter?: string
  linkedin?: string
  email?: string
  wechat?: string
  weibo?: string
  zhihu?: string
  juejin?: string
  telegram?: string
  discord?: string
  [key: string]: string | undefined // 允许扩展其他社交媒体
}

// 作者信息类型
export interface AuthorInfo {
  name: string
  avatar: string
  bio: string
  location: string
  website: string
  email: string
  profession: string
  company?: string
}

// 站点基本信息类型
export interface SiteInfo {
  name: string
  title: string
  description: string
  url: string
  logo: string
  favicon: string
}

// 首页配置类型
export interface HomePageConfig {
  hero: {
    title: string
    subtitle: string
    description: string
    backgroundImage?: string
    ctaText: string
    ctaLink: string
  }
  features: Array<{
    title: string
    description: string
    icon: string
  }>
}

// 时间线项目类型
export interface TimelineItem {
  year: string
  title: string
  description: string
  company?: string
  location?: string
}

// 技能集合类型
export interface SkillSet {
  frontend: string[]
  backend: string[]
  tools: string[]
}

// 关于页配置类型
export interface AboutPageConfig {
  timeline: TimelineItem[]
  skills: SkillSet
  interests: string[]
}

// 联系页配置类型
export interface ContactPageConfig {
  title: string
  description: string
  formEndpoint?: string
  responseTime: string
}

// 页面配置类型
export interface PagesConfig {
  home: HomePageConfig
  about: AboutPageConfig
  contact: ContactPageConfig
}

// SEO 配置类型
export interface SEOConfig {
  defaultTitle: string
  titleTemplate: string
  defaultDescription: string
  defaultImage: string
  twitterCard: string
  locale: string
}

// 功能开关类型
export interface FeaturesConfig {
  darkMode: boolean
  comments: boolean
  analytics: boolean
  rss: boolean
  sitemap: boolean
}

// 导航配置类型
export interface NavigationConfig {
  header: NavigationLink[]
  footer: FooterNavigationGroup[]
}

// 主站点配置类型
export interface SiteConfig {
  site: SiteInfo
  author: AuthorInfo
  social: SocialLinks
  navigation: NavigationConfig
  pages: PagesConfig
  seo: SEOConfig
  features: FeaturesConfig
}

// 所有类型已在上方单独导出，无需重复导出