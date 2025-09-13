/**
 * 类型定义统一导出
 */

// Content API 相关类型
export type {
  ContentPost,
  ExtendedContentPost,
  ContentQueryResult,
  ContentDocResult,
  SurroundingPost,
} from './content'

// 博客相关类型
export type {
  // 基础类型
  Category,
  Tag,
  PostMeta,
  SEOData,
  PostContent,
  TableOfContent,
  
  // 主要实体
  BlogPost,
  PostListItem,
  Comment,
  
  // 查询和响应
  PostQuery,
  PostsResponse,
  SinglePostResponse,
  SearchResult,
  
  // 统计
  PostStats,
  CategoryStats,
  TagStats,
  
  // 数据操作
  CreatePostData,
  UpdatePostData,
  CreateCommentData,
} from './blog'

export {
  PostStatus,
  PostPriority,
} from './blog'

// 定义简化的社交链接类型
export interface SocialLinks {
  github?: string
  twitter?: string
  website?: string
  linkedin?: string
  email?: string
}

// 定义简化的用户角色枚举
export enum UserRole {
  ADMIN = 'admin',
  AUTHOR = 'author', 
  EDITOR = 'editor',
  SUBSCRIBER = 'subscriber',
  GUEST = 'guest'
}

// 通用类型定义
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: {
    code: string
    message: string
    details?: any
  }
  meta?: {
    timestamp: Date
    requestId: string
    version: string
  }
}

export interface PaginationParams {
  page?: number
  limit?: number
  offset?: number
}

export interface SortParams {
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface SearchParams {
  search?: string
  searchFields?: string[]
}

export interface DateRangeParams {
  startDate?: Date
  endDate?: Date
}

export interface FilterParams {
  filters?: Record<string, any>
}

// 组合查询参数类型
export type QueryParams = PaginationParams & 
  SortParams & 
  SearchParams & 
  DateRangeParams & 
  FilterParams

// 文件上传相关类型
export interface FileUpload {
  file: File
  fieldName: string
  filename?: string
  mimetype: string
  size: number
}

export interface UploadedFile {
  id: string
  filename: string
  originalName: string
  mimetype: string
  size: number
  url: string
  thumbnailUrl?: string
  alt?: string
  description?: string
  uploadedBy: string
  createdAt: Date
}

export interface ImageMeta {
  width: number
  height: number
  format: string
  size: number
  aspectRatio: number
  hasAlpha: boolean
}

export interface ProcessedImage extends UploadedFile {
  meta: ImageMeta
  variants?: {
    thumbnail: string
    small: string
    medium: string
    large: string
  }
}

// 表单验证相关类型
export interface ValidationError {
  field: string
  message: string
  code: string
  value?: any
}

export interface FormState<T = any> {
  data: T
  errors: ValidationError[]
  isValid: boolean
  isSubmitting: boolean
  isDirty: boolean
  touchedFields: Set<string>
}

// 主题相关类型
export interface ThemeConfig {
  primary: string
  secondary: string
  accent: string
  background: string
  surface: string
  text: string
  textSecondary: string
  border: string
  success: string
  warning: string
  error: string
  info: string
}

export interface SiteConfig {
  title: string
  description: string
  url: string
  logo?: string
  favicon?: string
  author: {
    name: string
    email: string
    avatar?: string
    bio?: string
    socialLinks: SocialLinks
  }
  seo: {
    defaultTitle: string
    titleTemplate: string
    defaultDescription: string
    defaultKeywords: string[]
    ogImage: string
    twitterCard: 'summary' | 'summary_large_image'
    twitterSite?: string
  }
  features: {
    comments: boolean
    newsletter: boolean
    search: boolean
    darkMode: boolean
    analytics: boolean
    rss: boolean
  }
  analytics?: {
    googleAnalytics?: string
    plausible?: string
    umami?: string
  }
  social: SocialLinks
}

// 导航相关类型
export interface NavigationItem {
  id: string
  label: string
  href: string
  icon?: string
  external?: boolean
  children?: NavigationItem[]
  order: number
  isVisible: boolean
  roles?: UserRole[]
}

export interface BreadcrumbItem {
  label: string
  href?: string
  isActive?: boolean
}

// 组件 Props 相关类型
export interface BaseComponentProps {
  class?: string
  style?: string | Record<string, any>
  id?: string
}

export interface LoadingState {
  isLoading: boolean
  loadingText?: string
  error?: string | null
}

export interface AsyncComponentState<T = any> extends LoadingState {
  data: T | null
  refetch: () => Promise<void>
}

// 事件相关类型
export type ComponentEvent<T = any> = CustomEvent<T>

export interface ComponentEvents {
  [key: string]: ComponentEvent
}

// 工具类型
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type Required<T, K extends keyof T> = Omit<T, K> & {
    [P in K]-?: T[P]
};
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// 环境变量类型
export interface RuntimeConfig {
  public: {
    siteUrl: string
    siteName: string
    siteDescription: string
    apiBase?: string
    cdnUrl?: string
  }
  private?: {
    apiSecret?: string
    databaseUrl?: string
    jwtSecret?: string
  }
}