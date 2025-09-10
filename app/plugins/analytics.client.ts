/**
 * 网站分析工具插件
 * 用于追踪用户行为、页面访问、事件统计等
 * 支持 Google Analytics、百度统计、自定义分析等
 */

interface AnalyticsEvent {
  action: string
  category: string
  label?: string
  value?: number
}

interface PageView {
  path: string
  title: string
  referrer?: string
}

class Analytics {
  private isEnabled: boolean = false
  private config: any = {}

  constructor() {
    // 检查是否在生产环境
    this.isEnabled = process.env.NODE_ENV === 'production'
  }

  /**
   * 初始化分析工具
   */
  init(config: any) {
    this.config = config
    
    if (!this.isEnabled) {
      console.log('Analytics: Development mode, analytics disabled')
      return
    }

    // Google Analytics 初始化
    if (config.googleAnalytics?.trackingId) {
      this.initGoogleAnalytics(config.googleAnalytics.trackingId)
    }

    // 百度统计初始化
    if (config.baiduAnalytics?.trackingId) {
      this.initBaiduAnalytics(config.baiduAnalytics.trackingId)
    }

    console.log('Analytics: Initialized')
  }

  /**
   * 初始化 Google Analytics
   */
  private initGoogleAnalytics(trackingId: string) {
    // 加载 Google Analytics 脚本
    const script1 = document.createElement('script')
    script1.async = true
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`
    document.head.appendChild(script1)

    // 初始化 gtag
    const script2 = document.createElement('script')
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${trackingId}', {
        page_title: document.title,
        page_location: window.location.href
      });
    `
    document.head.appendChild(script2)
  }

  /**
   * 初始化百度统计
   */
  private initBaiduAnalytics(trackingId: string) {
    const script = document.createElement('script')
    script.innerHTML = `
      var _hmt = _hmt || [];
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?${trackingId}";
        var s = document.getElementsByTagName("script")[0]; 
        s.parentNode.insertBefore(hm, s);
      })();
    `
    document.head.appendChild(script)
  }

  /**
   * 追踪页面浏览
   */
  trackPageView(pageView: PageView) {
    if (!this.isEnabled) {
      console.log('Analytics: Page view tracked (dev mode)', pageView)
      return
    }

    // Google Analytics 页面追踪
    if (window.gtag) {
      window.gtag('config', this.config.googleAnalytics?.trackingId, {
        page_path: pageView.path,
        page_title: pageView.title
      })
    }

    // 百度统计页面追踪
    if (window._hmt) {
      window._hmt.push(['_trackPageview', pageView.path])
    }
  }

  /**
   * 追踪自定义事件
   */
  trackEvent(event: AnalyticsEvent) {
    if (!this.isEnabled) {
      console.log('Analytics: Event tracked (dev mode)', event)
      return
    }

    // Google Analytics 事件追踪
    if (window.gtag) {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value
      })
    }

    // 百度统计事件追踪
    if (window._hmt) {
      window._hmt.push(['_trackEvent', event.category, event.action, event.label, event.value])
    }
  }

  /**
   * 追踪搜索行为
   */
  trackSearch(query: string, category?: string) {
    this.trackEvent({
      action: 'search',
      category: category || 'site_search',
      label: query
    })
  }

  /**
   * 追踪文章阅读
   */
  trackArticleRead(articleTitle: string, category: string) {
    this.trackEvent({
      action: 'read_article',
      category: 'engagement',
      label: `${category}: ${articleTitle}`
    })
  }

  /**
   * 追踪链接点击
   */
  trackLinkClick(url: string, linkText: string) {
    this.trackEvent({
      action: 'click_link',
      category: 'outbound',
      label: `${linkText} -> ${url}`
    })
  }

  /**
   * 追踪表单提交
   */
  trackFormSubmit(formName: string, success: boolean = true) {
    this.trackEvent({
      action: success ? 'form_submit_success' : 'form_submit_error',
      category: 'form',
      label: formName
    })
  }
}

// 全局类型扩展
declare global {
  interface Window {
    gtag: (...args: any[]) => void
    _hmt: any[]
    $analytics: Analytics
  }
}

export default defineNuxtPlugin(() => {
  // 创建分析工具实例
  const analytics = new Analytics()
  
  // 获取运行时配置
  const config = useRuntimeConfig()
  
  // 初始化配置
  const analyticsConfig = {
    googleAnalytics: {
      trackingId: config.public.googleAnalyticsId || process.env.GOOGLE_ANALYTICS_ID
    },
    baiduAnalytics: {
      trackingId: config.public.baiduAnalyticsId || process.env.BAIDU_ANALYTICS_ID
    }
  }

  // 初始化分析工具
  analytics.init(analyticsConfig)

  // 挂载到全局
  if (process.client) {
    window.$analytics = analytics
  }

  // 提供给组合式函数使用
  return {
    provide: {
      analytics
    }
  }
})
