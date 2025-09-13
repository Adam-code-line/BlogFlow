/**
 * 文本处理工具函数
 */

/**
 * 生成URL友好的slug
 * @param text 原始文本
 * @returns 生成的slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // 替换中文和特殊字符为连字符
    .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    // 移除开头和结尾的连字符
    .replace(/^-+|-+$/g, '')
    // 限制长度
    .substring(0, 100)
}

/**
 * 截取文本并添加省略号
 * @param text 原始文本
 * @param length 截取长度
 * @returns 截取后的文本
 */
export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

/**
 * 计算阅读时间
 * @param content 文章内容
 * @param wordsPerMinute 每分钟阅读字数，默认200
 * @returns 预计阅读时间（分钟）
 */
export function calculateReadingTime(content: string, wordsPerMinute: number = 200): number {
  const words = content.split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

/**
 * 格式化日期
 * @param date 日期
 * @param format 格式类型
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: string | Date, format: 'short' | 'long' | 'relative' = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  
  switch (format) {
    case 'short':
      return d.toLocaleDateString('zh-CN')
    case 'long':
      return d.toLocaleDateString('zh-CN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    case 'relative':
      const now = new Date()
      const diffMs = now.getTime() - d.getTime()
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
      
      if (diffDays === 0) return '今天'
      if (diffDays === 1) return '昨天'
      if (diffDays < 7) return `${diffDays}天前`
      if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`
      if (diffDays < 365) return `${Math.floor(diffDays / 30)}个月前`
      return `${Math.floor(diffDays / 365)}年前`
    default:
      return d.toLocaleDateString('zh-CN')
  }
}

/**
 * 提取文本中的纯文本内容（去除Markdown语法）
 * @param markdown Markdown文本
 * @returns 纯文本
 */
export function extractPlainText(markdown: string): string {
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