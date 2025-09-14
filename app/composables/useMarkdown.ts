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
  /**
   * 渲染 Markdown 为 HTML，并处理封面图片
   * @param content Markdown 内容
   * @param coverImage 封面图片URL，如果提供，会从内容中移除重复的封面图片
   */
  const renderMarkdown = (content: string, coverImage?: string): string => {
    if (!content) {
      return ''
    }
    
    try {
      let processedContent = content
      
      // 如果有封面图片，从内容中移除重复的封面图片引用
      if (coverImage) {
        processedContent = removeDuplicateCoverImage(content, coverImage)
      }
      
      const result = marked(processedContent) as string
      return result
    } catch (error) {
      console.error('❌ Markdown 渲染失败:', error)
      // 备用方案：将换行符转换为 <br> 标签
      const fallback = content.replace(/\n/g, '<br>')
      return fallback
    }
  }

  /**
   * 从Markdown内容中移除重复的封面图片
   * @param content Markdown 内容
   * @param coverImage 封面图片URL
   */
  const removeDuplicateCoverImage = (content: string, coverImage: string): string => {
    if (!coverImage || !content) return content

    // 提取封面图片的基础URL（移除查询参数）
    const baseCoverUrl = coverImage.split('?')[0]
    
    // 匹配Markdown图片语法的正则表达式
    const imageRegex = /!\[[^\]]*\]\(([^)]+)\)/g
    let processedContent = content
    
    // 收集所有需要移除的图片
    const imagesToRemove: string[] = []
    let match
    
    // 重置正则表达式的lastIndex
    imageRegex.lastIndex = 0
    
    while ((match = imageRegex.exec(content)) !== null) {
      const [fullMatch, imageUrl] = match
      
      if (!imageUrl) continue
      
      // 提取图片的基础URL
      const baseImageUrl = imageUrl.split('?')[0]
      
      // 如果图片URL匹配封面URL，记录需要移除的图片
      if (baseImageUrl === baseCoverUrl) {
        imagesToRemove.push(fullMatch)
      }
    }
    
    // 移除所有匹配的图片
    imagesToRemove.forEach(imageMarkdown => {
      processedContent = processedContent.replace(imageMarkdown, '')
    })
    
    // 清理多余的空行
    processedContent = processedContent.replace(/\n\s*\n\s*\n/g, '\n\n')
    
    return processedContent.trim()
  }

  /**
   * 检查内容是否包含特定图片
   * @param content Markdown 内容
   * @param imageUrl 图片URL
   */
  const containsImage = (content: string, imageUrl: string): boolean => {
    if (!content || !imageUrl) return false
    
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g
    let match
    
    while ((match = imageRegex.exec(content)) !== null) {
      const [, , url] = match
      if (url && (url === imageUrl || url.includes(imageUrl) || imageUrl.includes(url))) {
        return true
      }
    }
    
    return false
  }

  return {
    renderMarkdown,
    removeDuplicateCoverImage,
    containsImage
  }
}