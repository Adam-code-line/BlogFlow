/**
 * 站点配置 Composable
 * 提供便捷的方式在组件中访问全局配置
 */

import { siteConfig } from '~/config/site.config'
import type { SiteConfig, AuthorInfo, SocialLinks, NavigationConfig, PagesConfig, SEOConfig } from '~/types/site'

/**
 * 获取完整的站点配置
 */
export const useSiteConfig = (): SiteConfig => {
  return siteConfig
}

/**
 * 获取站点基本信息
 */
export const useSiteInfo = () => {
  return computed(() => siteConfig.site)
}

/**
 * 获取作者信息
 */
export const useAuthorInfo = (): ComputedRef<AuthorInfo> => {
  return computed(() => siteConfig.author)
}

/**
 * 获取社交媒体链接
 */
export const useSocialLinks = (): ComputedRef<SocialLinks> => {
  return computed(() => siteConfig.social)
}

/**
 * 获取导航配置
 */
export const useNavigation = (): ComputedRef<NavigationConfig> => {
  return computed(() => siteConfig.navigation)
}

/**
 * 获取页面配置
 */
export const usePageConfig = (): ComputedRef<PagesConfig> => {
  return computed(() => siteConfig.pages)
}

/**
 * 获取SEO配置
 */
export const useSEOConfig = (): ComputedRef<SEOConfig> => {
  return computed(() => siteConfig.seo)
}

/**
 * 获取功能开关配置
 */
export const useFeatures = () => {
  return computed(() => siteConfig.features)
}

/**
 * 获取格式化的社交媒体链接数组
 * 过滤掉未设置的社交媒体
 */
export const useFormattedSocialLinks = () => {
  return computed(() => {
    const social = siteConfig.social
    const socialLinks = []
    
    if (social.github) {
      socialLinks.push({
        name: 'GitHub',
        href: social.github,
        icon: 'simple-icons:github',
        color: 'text-gray-700 dark:text-gray-300'
      })
    }
    
    if (social.twitter) {
      socialLinks.push({
        name: 'Twitter',
        href: social.twitter,
        icon: 'simple-icons:twitter',
        color: 'text-blue-500'
      })
    }
    
    if (social.linkedin) {
      socialLinks.push({
        name: 'LinkedIn',
        href: social.linkedin,
        icon: 'simple-icons:linkedin',
        color: 'text-blue-600'
      })
    }
    
    if (social.email) {
      socialLinks.push({
        name: 'Email',
        href: social.email,
        icon: 'heroicons:envelope',
        color: 'text-red-500'
      })
    }
    
    if (social.wechat) {
      socialLinks.push({
        name: '微信',
        href: `#wechat-${social.wechat}`,
        icon: 'simple-icons:wechat',
        color: 'text-green-500'
      })
    }
    
    if (social.weibo) {
      socialLinks.push({
        name: '微博',
        href: social.weibo,
        icon: 'simple-icons:sinaweibo',
        color: 'text-red-600'
      })
    }
    
    if (social.zhihu) {
      socialLinks.push({
        name: '知乎',
        href: social.zhihu,
        icon: 'simple-icons:zhihu',
        color: 'text-blue-700'
      })
    }
    
    if (social.juejin) {
      socialLinks.push({
        name: '掘金',
        href: social.juejin,
        icon: 'simple-icons:juejin',
        color: 'text-blue-500'
      })
    }
    
    if (social.telegram) {
      socialLinks.push({
        name: 'Telegram',
        href: social.telegram,
        icon: 'simple-icons:telegram',
        color: 'text-blue-400'
      })
    }
    
    if (social.discord) {
      socialLinks.push({
        name: 'Discord',
        href: social.discord,
        icon: 'simple-icons:discord',
        color: 'text-purple-500'
      })
    }
    
    return socialLinks
  })
}

/**
 * 获取当前年份（用于版权信息等）
 */
export const useCurrentYear = () => {
  return computed(() => new Date().getFullYear())
}

/**
 * 生成页面 SEO meta 数据
 */
export const usePageSEO = (options: {
  title?: string
  description?: string
  image?: string
  path?: string
}) => {
  const seo = siteConfig.seo
  const site = siteConfig.site
  
  const pageTitle = computed(() => {
    if (!options.title) return seo.defaultTitle
    return seo.titleTemplate.replace('%s', options.title)
  })
  
  const pageDescription = computed(() => options.description || seo.defaultDescription)
  const pageImage = computed(() => options.image || seo.defaultImage)
  const pageUrl = computed(() => {
    if (!options.path) return site.url
    return `${site.url}${options.path}`
  })
  
  return {
    title: pageTitle,
    description: pageDescription,
    image: pageImage,
    url: pageUrl,
    locale: seo.locale,
    twitterCard: seo.twitterCard
  }
}

/**
 * 工具函数：检查功能是否启用
 */
export const useFeatureFlag = (feature: keyof typeof siteConfig.features) => {
  return computed(() => siteConfig.features[feature])
}