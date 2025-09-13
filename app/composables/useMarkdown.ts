/**
 * Markdown 渲染工具
 * 使用 marked 库解析 Markdown 内容
 */

import { marked } from 'marked'

// 配置 marked 选项
marked.setOptions({
  breaks: true,
  gfm: true,
})

/**
 * 渲染 Markdown 为 HTML
 */
export function useMarkdown() {
  const renderMarkdown = (content: string): string => {
    if (!content) {
      return ''
    }
    
    try {
      const result = marked(content) as string
      return result
    } catch (error) {
      console.error('❌ Markdown 渲染失败:', error)
      // 备用方案：将换行符转换为 <br> 标签
      const fallback = content.replace(/\n/g, '<br>')
      return fallback
    }
  }

  return {
    renderMarkdown
  }
}