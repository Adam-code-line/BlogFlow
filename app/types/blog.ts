/**
 * 博客相关类型定义
 */

// 文章状态枚举
export enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

// 文章优先级枚举
export enum PostPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  FEATURED = 'featured'
}

// 基础分类接口
export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  color?: string
  icon?: string
  parentId?: string
  children?: Category[]
  postCount: number
  createdAt: Date
  updatedAt: Date
}

// 基础标签接口
export interface Tag {
  id: string
  name: string
  slug: string
  description?: string
  color?: string
  postCount: number
  createdAt: Date
  updatedAt: Date
}

// 文章元数据接口
export interface PostMeta {
  views: number
  likes: number
  comments: number
  shares: number
  readingTime: number // 预估阅读时间（分钟）
  wordCount: number
}

// SEO 相关接口
export interface SEOData {
  title?: string
  description?: string
  keywords?: string[]
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  twitterCard?: 'summary' | 'summary_large_image'
  canonical?: string
}

// 文章内容接口
export interface PostContent {
  markdown: string
  html?: string
  excerpt?: string
  tableOfContents?: TableOfContent[]
}

// 目录结构接口
export interface TableOfContent {
  id: string
  title: string
  level: number // 1-6 对应 h1-h6
  anchor: string
  children?: TableOfContent[]
}

// 博客文章完整接口
export interface BlogPost {
  id: string
  title: string
  slug: string
  content: PostContent
  excerpt?: string
  coverImage?: string
  images?: string[]
  status: PostStatus
  priority: PostPriority
  author: {
    id: string
    name: string
    avatar?: string
  }
  categories: Category[]
  tags: Tag[]
  meta: PostMeta
  seo: SEOData
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
  scheduledAt?: Date
  featured: boolean
  allowComments: boolean
  isTop: boolean // 是否置顶
}

// 文章列表项接口（简化版本）
export interface PostListItem {
  id: string
  title: string
  slug: string
  excerpt: string
  coverImage?: string
  status: PostStatus
  priority: PostPriority
  author: {
    id: string
    name: string
    avatar?: string
  }
  categories: Pick<Category, 'id' | 'name' | 'slug' | 'color'>[]
  tags: Pick<Tag, 'id' | 'name' | 'slug' | 'color'>[]
  meta: Pick<PostMeta, 'views' | 'likes' | 'comments' | 'readingTime'>
  publishedAt?: Date
  createdAt: Date
  featured: boolean
  isTop: boolean
}

// 文章查询参数接口
export interface PostQuery {
  page?: number
  limit?: number
  category?: string
  tag?: string
  author?: string
  status?: PostStatus
  priority?: PostPriority
  search?: string
  sortBy?: 'createdAt' | 'publishedAt' | 'views' | 'likes' | 'title'
  sortOrder?: 'asc' | 'desc'
  featured?: boolean
  dateRange?: {
    start: Date
    end: Date
  }
}

// 文章统计接口
export interface PostStats {
  total: number
  published: number
  draft: number
  archived: number
  totalViews: number
  totalLikes: number
  totalComments: number
  avgReadingTime: number
}

// 分类统计接口
export interface CategoryStats extends Category {
  recentPosts: PostListItem[]
  totalViews: number
  avgReadingTime: number
}

// 标签统计接口
export interface TagStats extends Tag {
  recentPosts: PostListItem[]
  totalViews: number
  trend: 'up' | 'down' | 'stable' // 使用趋势
}

// 搜索结果接口
export interface SearchResult {
  posts: PostListItem[]
  categories: Category[]
  tags: Tag[]
  total: number
  query: string
  suggestions?: string[]
}

// 文章创建/更新接口
export interface CreatePostData {
  title: string
  content: string
  excerpt?: string
  coverImage?: string
  status: PostStatus
  priority?: PostPriority
  categoryIds: string[]
  tagIds: string[]
  seo?: Partial<SEOData>
  publishedAt?: Date
  scheduledAt?: Date
  featured?: boolean
  allowComments?: boolean
  isTop?: boolean
}

export interface UpdatePostData extends Partial<CreatePostData> {
  id: string
}

// API 响应接口
export interface PostsResponse {
  data: PostListItem[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
    hasNext: boolean
    hasPrev: boolean
  }
  filters?: {
    categories: Category[]
    tags: Tag[]
    authors: Array<{ id: string; name: string }>
  }
}

export interface SinglePostResponse {
  data: BlogPost
  related?: PostListItem[]
  previous?: Pick<PostListItem, 'id' | 'title' | 'slug'>
  next?: Pick<PostListItem, 'id' | 'title' | 'slug'>
}

// 评论相关接口
export interface Comment {
  id: string
  postId: string
  parentId?: string
  author: {
    id?: string
    name: string
    email: string
    avatar?: string
    website?: string
  }
  content: string
  status: 'pending' | 'approved' | 'rejected' | 'spam'
  likes: number
  replies?: Comment[]
  createdAt: Date
  updatedAt: Date
  ipAddress?: string
  userAgent?: string
}

export interface CreateCommentData {
  postId: string
  parentId?: string
  author: {
    name: string
    email: string
    website?: string
  }
  content: string
}