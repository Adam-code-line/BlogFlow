/**
 * 格式化工具函数
 * 提供各种数据格式化功能
 */

/**
 * 日期格式化工具
 */
export class DateFormatter {
  /**
   * 格式化为中文日期
   */
  static toChinese(date: string | Date): string {
    if (!date) return ''
    
    const d = new Date(date)
    if (isNaN(d.getTime())) return ''
    
    return d.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  /**
   * 格式化为短日期
   */
  static toShort(date: string | Date): string {
    if (!date) return ''
    
    const d = new Date(date)
    if (isNaN(d.getTime())) return ''
    
    return d.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  
  /**
   * 格式化为相对时间
   */
  static toRelative(date: string | Date): string {
    if (!date) return ''
    
    const d = new Date(date)
    if (isNaN(d.getTime())) return ''
    
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return '今天'
    if (days === 1) return '昨天'
    if (days < 7) return `${days}天前`
    if (days < 30) return `${Math.floor(days / 7)}周前`
    if (days < 365) return `${Math.floor(days / 30)}个月前`
    return `${Math.floor(days / 365)}年前`
  }
  
  /**
   * 格式化为 YYYY-MM-DD
   */
  static toISO(date: string | Date): string {
    if (!date) return ''
    
    const d = new Date(date)
    if (isNaN(d.getTime())) return ''
    
    return d.toISOString().split('T')[0] || ''
  }
}

/**
 * 文本格式化工具
 */
export class TextFormatter {
  /**
   * 格式化阅读时间
   */
  static readingTime(text: string, wordsPerMinute: number = 200): string {
    if (!text) return '1 分钟'
    
    const wordCount = text.trim().split(/\s+/).length
    const minutes = Math.ceil(wordCount / wordsPerMinute)
    
    return `${minutes} 分钟`
  }
  
  /**
   * 格式化文章摘要
   */
  static excerpt(text: string, length: number = 150): string {
    if (!text) return ''
    
    const cleaned = text.replace(/\s+/g, ' ').trim()
    if (cleaned.length <= length) return cleaned
    
    return cleaned.slice(0, length) + '...'
  }
  
  /**
   * 格式化文件名为标题
   */
  static filenameToTitle(filename: string): string {
    return filename
      .replace(/\.[^/.]+$/, '') // 移除扩展名
      .replace(/[-_]/g, ' ') // 替换连字符和下划线为空格
      .replace(/\b\w/g, l => l.toUpperCase()) // 首字母大写
  }
  
  /**
   * 格式化 slug 为标题
   */
  static slugToTitle(slug: string): string {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }
  
  /**
   * 标题转 slug
   */
  static titleToSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-') // 只保留字母、数字和中文
      .replace(/^-|-$/g, '') // 移除首尾的连字符
  }
  
  /**
   * 高亮搜索关键词
   */
  static highlightKeywords(text: string, keywords: string): string {
    if (!keywords) return text
    
    const regex = new RegExp(`(${keywords})`, 'gi')
    return text.replace(regex, '<mark>$1</mark>')
  }
}

/**
 * 数字格式化工具
 */
export class NumberFormatter {
  /**
   * 格式化为千分位
   */
  static withCommas(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
  
  /**
   * 格式化为简短数字（如 1K, 1M）
   */
  static toShort(num: number): string {
    if (num < 1000) return num.toString()
    if (num < 1000000) return (num / 1000).toFixed(1) + 'K'
    if (num < 1000000000) return (num / 1000000).toFixed(1) + 'M'
    return (num / 1000000000).toFixed(1) + 'B'
  }
  
  /**
   * 格式化百分比
   */
  static toPercent(num: number, decimals: number = 1): string {
    return (num * 100).toFixed(decimals) + '%'
  }
  
  /**
   * 格式化文件大小
   */
  static fileSize(bytes: number): string {
    if (bytes === 0) return '0 B'
    
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
}

/**
 * URL 格式化工具
 */
export class URLFormatter {
  /**
   * 确保 URL 有协议
   */
  static ensureProtocol(url: string): string {
    if (!url) return ''
    if (url.startsWith('http://') || url.startsWith('https://')) return url
    return 'https://' + url
  }
  
  /**
   * 提取域名
   */
  static extractDomain(url: string): string {
    try {
      return new URL(this.ensureProtocol(url)).hostname
    } catch {
      return ''
    }
  }
  
  /**
   * 构建查询字符串
   */
  static buildQuery(params: Record<string, any>): string {
    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        searchParams.append(key, value.toString())
      }
    })
    
    return searchParams.toString()
  }
  
  /**
   * 解析查询字符串
   */
  static parseQuery(queryString: string): Record<string, string> {
    const params: Record<string, string> = {}
    const searchParams = new URLSearchParams(queryString)
    
    searchParams.forEach((value, key) => {
      params[key] = value
    })
    
    return params
  }
}

/**
 * 颜色格式化工具
 */
export class ColorFormatter {
  /**
   * 根据字符串生成一致的颜色
   */
  static stringToColor(str: string): string {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    
    const hue = hash % 360
    return `hsl(${hue}, 70%, 50%)`
  }
  
  /**
   * 获取标签颜色
   */
  static getTagColor(tag: string): string {
    const colors = [
      'blue', 'green', 'yellow', 'red', 'purple', 
      'pink', 'indigo', 'teal', 'orange', 'cyan'
    ]
    
    let hash = 0
    for (let i = 0; i < tag.length; i++) {
      hash = tag.charCodeAt(i) + ((hash << 5) - hash)
    }
    
    return colors[Math.abs(hash) % colors.length] || 'blue'
  }
}

/**
 * 组合格式化函数（便于在模板中使用）
 */
export const formatters = {
  date: DateFormatter,
  text: TextFormatter,
  number: NumberFormatter,
  url: URLFormatter,
  color: ColorFormatter
}
