/**
 * 统一的格式化函数 composable
 * 封装所有格式化功能，避免重复代码
 */

import { formatters } from '~/utils/format'

/**
 * 使用格式化功能的 composable
 */
export const useFormatters = () => {
  /**
   * 格式化日期为相对时间
   */
  const formatDate = (date: string | Date | undefined): string => {
    if (!date) return ''
    return formatters.date.toRelative(date)
  }

  /**
   * 格式化日期为中文格式
   */
  const formatDateChinese = (date: string | Date | undefined): string => {
    if (!date) return ''
    return formatters.date.toChinese(date)
  }

  /**
   * 格式化日期为短格式
   */
  const formatDateShort = (date: string | Date | undefined): string => {
    if (!date) return ''
    return formatters.date.toShort(date)
  }

  /**
   * 格式化数字为简短格式 (1K, 1M)
   */ 
  const formatNumber = (num: number): string => {
    return formatters.number.toShort(num)
  }

  /**
   * 格式化数字为千分位
   */
  const formatNumberWithCommas = (num: number): string => {
    return formatters.number.withCommas(num)
  }

  /**
   * 计算阅读时间
   */
  const getReadingTime = (content: string, wordsPerMinute: number = 200): string => {
    return formatters.text.readingTime(content, wordsPerMinute)
  }

  /**
   * 生成文章摘要
   */
  const getExcerpt = (content: string, maxLength: number = 150): string => {
    return formatters.text.excerpt(content, maxLength)
  }

  /**
   * 提取Markdown文本中的纯文本内容
   */
  const extractPlainText = (markdown: string): string => {
    return markdown
      // 移除代码块
      .replace(/```[\s\S]*?```/g, '')
      // 移除行内代码
      .replace(/`[^`]*`/g, '')
      // 移除链接
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      // 移除图片
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
      // 移除标题标记
      .replace(/^#+\s+/gm, '')
      // 移除加粗和斜体
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      // 移除引用
      .replace(/^>\s+/gm, '')
      // 移除列表标记
      .replace(/^[\s]*[-*+]\s+/gm, '')
      .replace(/^[\s]*\d+\.\s+/gm, '')
      // 移除多余空白
      .replace(/\n\s*\n/g, '\n')
      .trim()
  }

  /**
   * 根据字符串生成标签颜色
   */
  const getTagColor = (tag: string): string => {
    return formatters.color.getTagColor(tag)
  }

  /**
   * 格式化文件大小
   */
  const formatFileSize = (bytes: number): string => {
    return formatters.number.fileSize(bytes)
  }

  /**
   * 格式化百分比
   */
  const formatPercent = (num: number, decimals: number = 1): string => {
    return formatters.number.toPercent(num, decimals)
  }

  /**
   * 标题转 slug
   */
  const titleToSlug = (title: string): string => {
    return formatters.text.titleToSlug(title)
  }

  /**
   * slug 转标题
   */
  const slugToTitle = (slug: string): string => {
    return formatters.text.slugToTitle(slug)
  }

  /**
   * 高亮关键词
   */
  const highlightKeywords = (text: string, keywords: string): string => {
    return formatters.text.highlightKeywords(text, keywords)
  }

  /**
   * 确保URL有协议
   */
  const ensureProtocol = (url: string): string => {
    return formatters.url.ensureProtocol(url)
  }

  /**
   * 提取域名
   */
  const extractDomain = (url: string): string => {
    return formatters.url.extractDomain(url)
  }

  return {
    // 日期格式化
    formatDate,
    formatDateChinese,
    formatDateShort,
    
    // 数字格式化
    formatNumber,
    formatNumberWithCommas,
    formatFileSize,
    formatPercent,
    
    // 文本格式化
    getReadingTime,
    getExcerpt,
    extractPlainText,
    titleToSlug,
    slugToTitle,
    highlightKeywords,
    
    // 颜色格式化
    getTagColor,
    
    // URL格式化
    ensureProtocol,
    extractDomain,
    
    // 原始格式化器（如果需要更多控制）
    formatters
  }
}

/**
 * 图标处理的 composable
 */
export const useIconHandler = () => {
  const iconAvailable = ref(true)
  
  /**
   * 处理图标加载错误
   */
  const handleIconError = () => {
    iconAvailable.value = false
  }
  
  /**
   * 重置图标状态
   */
  const resetIconState = () => {
    iconAvailable.value = true
  }
  
  /**
   * 获取本地图标映射
   */
  const getLocalIconName = (iconName: string): string => {
    const iconMap: Record<string, string> = {
      'i-heroicons-document-text': 'document-text',
      'i-heroicons-users': 'users',
      'i-heroicons-chat-bubble-left-ellipsis': 'chat',
      'i-heroicons-eye': 'eye',
      'i-heroicons-home': 'home',
      'i-heroicons-user': 'user',
      'i-heroicons-plus': 'plus',
      'i-heroicons-pencil': 'edit',
      'i-heroicons-trash': 'trash',
      'heroicons:envelope': 'envelope',
      'heroicons:clock': 'clock',
      'heroicons:map-pin': 'map-pin',
      'heroicons:light-bulb': 'light-bulb',
      'heroicons:code-bracket': 'code-bracket',
      'heroicons:academic-cap': 'academic-cap'
    }
    
    return iconMap[iconName] || iconName.replace('heroicons:', '').replace('i-heroicons-', '')
  }
  
  /**
   * 获取社交媒体背景颜色类
   */
  const getSocialBgClass = (socialName: string): string => {
    const bgClasses: Record<string, string> = {
      'GitHub': 'bg-gray-900',
      'Twitter': 'bg-blue-400', 
      'LinkedIn': 'bg-blue-600',
      'Email': 'bg-red-600',
      'Website': 'bg-green-600',
      'Facebook': 'bg-blue-700',
      'Instagram': 'bg-gradient-to-r from-purple-500 to-pink-500',
      'YouTube': 'bg-red-600',
      'TikTok': 'bg-black'
    }
    return bgClasses[socialName] || 'bg-gray-600'
  }
  
  return {
    iconAvailable: readonly(iconAvailable),
    handleIconError,
    resetIconState,
    getLocalIconName,
    getSocialBgClass
  }
}

/**
 * 通用工具函数 composable
 */
export const useUtils = () => {
  /**
   * 防抖函数
   */
  const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout | null = null
    
    return (...args: Parameters<T>) => {
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  }
  
  /**
   * 节流函数
   */
  const throttle = <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let lastTime = 0
    
    return (...args: Parameters<T>) => {
      const now = Date.now()
      if (now - lastTime >= wait) {
        lastTime = now
        func(...args)
      }
    }
  }
  
  /**
   * 延时函数
   */
  const sleep = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
  
  /**
   * 重试函数
   */
  const retry = async <T>(
    fn: () => Promise<T>,
    maxAttempts: number = 3,
    delay: number = 1000
  ): Promise<T> => {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn()
      } catch (error) {
        if (attempt === maxAttempts) throw error
        await sleep(delay * attempt)
      }
    }
    throw new Error('Retry failed')
  }
  
  /**
   * 安全的JSON解析
   */
  const safeJsonParse = <T>(jsonString: string, defaultValue: T): T => {
    try {
      return JSON.parse(jsonString) as T
    } catch {
      return defaultValue
    }
  }
  
  /**
   * 复制到剪贴板
   */
  const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text)
        return true
      } else {
        // 回退方案
        const textArea = document.createElement('textarea')
        textArea.value = text
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        const successful = document.execCommand('copy')
        document.body.removeChild(textArea)
        return successful
      }
    } catch {
      return false
    }
  }
  
  /**
   * 生成随机ID
   */
  const generateId = (length: number = 8): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }
  
  return {
    debounce,
    throttle,
    sleep,
    retry,
    safeJsonParse,
    copyToClipboard,
    generateId
  }
}