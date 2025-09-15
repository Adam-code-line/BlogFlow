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

    // 检查是否禁用了此功能（紧急修复）
    if (typeof window !== 'undefined' && localStorage.getItem('disable_duplicate_removal') === 'true') {
      console.log('🔄 重复图片移除功能已禁用')
      return content
    }

    try {
      // 提取封面图片的基础URL（移除查询参数和协议差异）
      const normalizeCoverUrl = (url: string): string => {
        if (!url) return ''
        const parts = url.replace(/^https?:\/\//, '').split('?')
        return parts[0]?.split('#')[0] || ''
      }
      
      const normalizedCoverUrl = normalizeCoverUrl(coverImage)
      
      // 更强的匹配正则，包含各种Markdown图片语法
      const imagePatterns = [
        /!\[[^\]]*\]\(([^)]+)\)/g,  // 标准图片语法 ![alt](url)
        /!\[\]\(([^)]+)\)/g,       // 无alt文本 ![](url)
        /<img[^>]+src="([^"]+)"[^>]*>/g, // HTML img标签
        /<img[^>]+src='([^']+)'[^>]*>/g  // HTML img标签（单引号）
      ]
      
      let processedContent = content
      
      imagePatterns.forEach(pattern => {
        let match
        const imagesToRemove: string[] = []
        
        // 重置正则表达式的lastIndex
        pattern.lastIndex = 0
        
        while ((match = pattern.exec(content)) !== null) {
          const [fullMatch, imageUrl] = match
          
          if (!imageUrl) continue
          
          // 标准化图片URL进行比较
          const normalizedImageUrl = normalizeCoverUrl(imageUrl)
          
          // 多种匹配策略
          const isMatch = 
            normalizedImageUrl === normalizedCoverUrl ||                    // 完全匹配
            normalizedImageUrl.includes(normalizedCoverUrl) ||              // 包含匹配
            normalizedCoverUrl.includes(normalizedImageUrl) ||              // 被包含匹配
            imageUrl === coverImage ||                                      // 原始URL匹配
            imageUrl.split('?')[0] === coverImage.split('?')[0]            // 去参数匹配
          
          if (isMatch) {
            imagesToRemove.push(fullMatch)
            console.log('🎯 找到重复图片:', { fullMatch, imageUrl, coverImage })
          }
        }
        
        // 移除所有匹配的图片
        imagesToRemove.forEach(imageMarkdown => {
          processedContent = processedContent.replace(imageMarkdown, '')
        })
      })
      
      // 清理多余的空行和空格
      processedContent = processedContent
        .replace(/\n\s*\n\s*\n/g, '\n\n')  // 多个连续空行合并为两个
        .replace(/^\s*\n/, '')              // 移除开头的空行
        .trim()
      
      console.log('✅ 封面图片去重完成:', { 
        original: content.length, 
        processed: processedContent.length, 
        removed: content.length - processedContent.length 
      })
      
      return processedContent
    } catch (error) {
      console.error('❌ removeDuplicateCoverImage 处理失败:', error)
      // 出错时返回原内容，避免数据丢失
      return content
    }
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