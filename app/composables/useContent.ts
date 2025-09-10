/**
 * 内容管理相关的组合式函数
 * 统一管理 Content v3 API 的调用和数据处理
 */

import type { ContentPost } from '~/types'

/**
 * 获取博客文章列表
 */
export const useBlogPosts = () => {
  return {
    /**
     * 获取所有博客文章
     */
    async getAllPosts(): Promise<ContentPost[]> {
      return await queryCollection('content')
        .where('path', 'LIKE', '/blog/%')
        .all() as ContentPost[]
    },

    /**
     * 获取精选文章
     */
    async getFeaturedPosts(limit: number = 3): Promise<ContentPost[]> {
      return await queryCollection('content')
        .where('path', 'LIKE', '/blog/%')
        .limit(limit)
        .all() as ContentPost[]
    },

    /**
     * 根据路径获取单篇文章
     */
    async getPostBySlug(slug: string): Promise<ContentPost | null> {
      return await queryCollection('content')
        .path(`/blog/${slug}`)
        .first() as ContentPost | null
    },

    /**
     * 获取分类列表
     */
    getCategories(posts: ContentPost[]): string[] {
      const cats = new Set(posts.map(post => post.category).filter(Boolean))
      return Array.from(cats) as string[]
    },

    /**
     * 根据分类筛选文章
     */
    filterByCategory(posts: ContentPost[], category: string): ContentPost[] {
      if (!category) return posts
      return posts.filter(post => post.category === category)
    },

    /**
     * 根据搜索关键词筛选文章
     */
    filterBySearch(posts: ContentPost[], query: string): ContentPost[] {
      if (!query) return posts
      const lowerQuery = query.toLowerCase()
      return posts.filter(post => 
        post.title?.toLowerCase().includes(lowerQuery) ||
        post.description?.toLowerCase().includes(lowerQuery) ||
        post.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
      )
    },

    /**
     * 分页处理
     */
    paginate(posts: ContentPost[], page: number, limit: number): ContentPost[] {
      const start = (page - 1) * limit
      const end = start + limit
      return posts.slice(start, end)
    },

    /**
     * 获取相邻文章
     */
    getSurroundingPosts(posts: ContentPost[], currentPath: string): { prev: ContentPost | null, next: ContentPost | null } {
      const currentIndex = posts.findIndex(post => post.path === currentPath)
      return {
        prev: currentIndex > 0 ? posts[currentIndex - 1] ?? null : null,
        next: currentIndex < posts.length - 1 ? posts[currentIndex + 1] ?? null : null
      }
    }
  }
}

/**
 * 格式化日期的工具函数
 */
export const useFormatDate = () => {
  return {
    formatDate(dateString: string | Date): string {
      if (!dateString) return ''
      
      const date = new Date(dateString)
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },

    formatDateShort(dateString: string | Date): string {
      if (!dateString) return ''
      
      const date = new Date(dateString)
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }
  }
}