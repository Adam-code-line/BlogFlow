/**
 * Nuxt Content v3 API 相关类型定义
 * 用于适配 Content API 返回的数据结构
 */

// 基础 Content API 文章类型（映射 markdown 文件的 front matter）
export interface ContentPost {
  // 路径信息
  path: string
  // 基础元数据
  title?: string
  description?: string
  // 图片
  cover?: string
  // 分类和标签
  category?: string
  tags?: string[]
  // 作者信息
  author?: {
    name?: string
    avatar?: string
  }
  // 时间信息
  publishedAt?: string | Date
  createdAt?: string | Date
  updatedAt?: string | Date
  // 其他属性
  featured?: boolean
  readingTime?: number
  // 内容相关
  excerpt?: string
  draft?: boolean
  // SEO 相关
  seo?: {
    title?: string
    description?: string
    keywords?: string[]
    ogImage?: string
  }
}

// 扩展的文章类型，包含更多字段
export interface ExtendedContentPost extends ContentPost {
  // 统计信息
  views?: number
  likes?: number
  comments?: number
  // 状态
  status?: 'published' | 'draft' | 'archived'
  // 优先级
  priority?: 'low' | 'normal' | 'high' | 'featured'
  // 置顶
  isTop?: boolean
  // 评论设置
  allowComments?: boolean
}

// Content API 查询结果类型
export interface ContentQueryResult<T = ContentPost> {
  data: T[]
  total: number
  page?: number
  limit?: number
}

// 相邻文章的简化类型
export interface SurroundingPost {
  path: string
  title?: string
}

// Content API 单个文档结果
export interface ContentDocResult<T = ContentPost> {
  data: T
  surround?: {
    prev?: SurroundingPost
    next?: SurroundingPost
  }
}
