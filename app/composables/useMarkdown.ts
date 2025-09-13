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
    console.log('🎨 Markdown 渲染 - 输入内容:', content?.substring(0, 100) + '...')
    console.log('🎨 内容长度:', content?.length || 0)
    
    if (!content) {
      console.log('⚠️ 内容为空，返回空字符串')
      return ''
    }
    
    try {
      const result = marked(content) as string
      console.log('✅ Markdown 渲染成功 - 输出HTML长度:', result.length)
      console.log('✅ HTML 预览:', result.substring(0, 200) + '...')
      return result
    } catch (error) {
      console.error('❌ Markdown 渲染失败:', error)
      // 备用方案：将换行符转换为 <br> 标签
      const fallback = content.replace(/\n/g, '<br>')
      console.log('🔄 使用备用方案，长度:', fallback.length)
      return fallback
    }
  }

  return {
    renderMarkdown
  }
}