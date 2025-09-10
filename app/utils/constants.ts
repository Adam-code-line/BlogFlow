/**
 * 应用常量定义
 * 统一管理应用中使用的常量
 */

/**
 * 应用基本信息
 */
export const APP_INFO = {
  name: 'BlogFlow',
  description: '一个专注于技术分享和知识传播的个人博客平台',
  version: '1.0.0',
  author: 'BlogFlow Team',
  email: 'hello@blogflow.dev',
  url: 'https://blogflow.dev'
} as const

/**
 * 路由常量
 */
export const ROUTES = {
  HOME: '/',
  BLOG: '/blog',
  BLOG_DETAIL: '/blog/:slug',
  BLOG_CATEGORY: '/blog/category/:name',
  ABOUT: '/about',
  CONTACT: '/contact',
  ADMIN: '/admin',
  ADMIN_POSTS: '/admin/posts'
} as const

/**
 * API 端点
 */
export const API_ENDPOINTS = {
  POSTS: '/api/posts',
  POST_DETAIL: '/api/posts/:id',
  CATEGORIES: '/api/categories',
  TAGS: '/api/tags',
  SEARCH: '/api/search',
  CONTACT: '/api/contact'
} as const

/**
 * 存储键名
 */
export const STORAGE_KEYS = {
  THEME: 'blogflow-theme',
  USER_PREFERENCES: 'blogflow-user-preferences',
  DRAFT_POSTS: 'blogflow-draft-posts',
  SEARCH_HISTORY: 'blogflow-search-history'
} as const

/**
 * 主题模式
 */
export const THEME_MODES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
} as const

/**
 * 文章状态
 */
export const POST_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived'
} as const

/**
 * 用户角色
 */
export const USER_ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  AUTHOR: 'author',
  READER: 'reader'
} as const

/**
 * 文章分类
 */
export const POST_CATEGORIES = {
  FRONTEND: 'frontend',
  BACKEND: 'backend',
  FULLSTACK: 'fullstack',
  TUTORIAL: 'tutorial',
  THOUGHTS: 'thoughts',
  NEWS: 'news'
} as const

/**
 * 文件类型
 */
export const FILE_TYPES = {
  IMAGE: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
  VIDEO: ['mp4', 'avi', 'mov', 'wmv', 'flv'],
  DOCUMENT: ['pdf', 'doc', 'docx', 'txt', 'rtf'],
  ARCHIVE: ['zip', 'rar', '7z', 'tar', 'gz']
} as const

/**
 * 文件大小限制（字节）
 */
export const FILE_SIZE_LIMITS = {
  IMAGE: 5 * 1024 * 1024, // 5MB
  VIDEO: 100 * 1024 * 1024, // 100MB
  DOCUMENT: 10 * 1024 * 1024, // 10MB
  AVATAR: 2 * 1024 * 1024 // 2MB
} as const

/**
 * 分页设置
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  BLOG_PAGE_SIZE: 9,
  ADMIN_PAGE_SIZE: 20
} as const

/**
 * 时间间隔（毫秒）
 */
export const TIME_INTERVALS = {
  DEBOUNCE_SEARCH: 300,
  THROTTLE_SCROLL: 100,
  AUTO_SAVE: 30000, // 30秒
  SESSION_TIMEOUT: 1800000, // 30分钟
  RETRY_DELAY: 1000
} as const

/**
 * 验证规则
 */
export const VALIDATION_RULES = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 20
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 50
  },
  POST_TITLE: {
    MIN_LENGTH: 5,
    MAX_LENGTH: 100
  },
  POST_EXCERPT: {
    MAX_LENGTH: 200
  },
  COMMENT: {
    MIN_LENGTH: 5,
    MAX_LENGTH: 500
  }
} as const

/**
 * 正则表达式
 */
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^1[3-9]\d{9}$/,
  URL: /^https?:\/\/.+/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  USERNAME: /^[a-zA-Z0-9_-]+$/,
  TAG: /^[a-zA-Z0-9\u4e00-\u9fa5_-]+$/
} as const

/**
 * 错误信息
 */
export const ERROR_MESSAGES = {
  REQUIRED: '此字段为必填项',
  INVALID_EMAIL: '请输入有效的邮箱地址',
  INVALID_PHONE: '请输入有效的手机号码',
  INVALID_URL: '请输入有效的URL地址',
  PASSWORD_TOO_SHORT: '密码至少需要8个字符',
  USERNAME_TOO_SHORT: '用户名至少需要3个字符',
  FILE_TOO_LARGE: '文件大小超出限制',
  INVALID_FILE_TYPE: '不支持的文件类型',
  NETWORK_ERROR: '网络连接失败，请检查网络设置',
  SERVER_ERROR: '服务器错误，请稍后重试',
  NOT_FOUND: '请求的资源不存在',
  UNAUTHORIZED: '未授权访问',
  FORBIDDEN: '禁止访问'
} as const

/**
 * 成功信息
 */
export const SUCCESS_MESSAGES = {
  SAVE_SUCCESS: '保存成功',
  UPDATE_SUCCESS: '更新成功',
  DELETE_SUCCESS: '删除成功',
  UPLOAD_SUCCESS: '上传成功',
  SEND_SUCCESS: '发送成功',
  COPY_SUCCESS: '复制成功'
} as const

/**
 * UI 配置
 */
export const UI_CONFIG = {
  HEADER_HEIGHT: 64,
  SIDEBAR_WIDTH: 256,
  MOBILE_BREAKPOINT: 768,
  TABLET_BREAKPOINT: 1024,
  DESKTOP_BREAKPOINT: 1280
} as const

/**
 * 动画配置
 */
export const ANIMATION_CONFIG = {
  DURATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500
  },
  EASING: {
    EASE_IN: 'ease-in',
    EASE_OUT: 'ease-out',
    EASE_IN_OUT: 'ease-in-out'
  }
} as const

/**
 * SEO 默认配置
 */
export const SEO_DEFAULTS = {
  TITLE_TEMPLATE: '%s - BlogFlow',
  DESCRIPTION: APP_INFO.description,
  KEYWORDS: ['博客', '技术分享', '前端开发', 'Vue.js', 'Nuxt.js', 'TypeScript'],
  OG_IMAGE: '/images/og-default.jpg',
  TWITTER_CARD: 'summary_large_image'
} as const

/**
 * 社交媒体链接
 */
export const SOCIAL_LINKS = {
  GITHUB: 'https://github.com/blogflow',
  TWITTER: 'https://twitter.com/blogflow',
  LINKEDIN: 'https://linkedin.com/company/blogflow',
  YOUTUBE: 'https://youtube.com/c/blogflow',
  EMAIL: `mailto:${APP_INFO.email}`
} as const

/**
 * 图片默认地址
 */
export const DEFAULT_IMAGES = {
  AVATAR: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  POST_COVER: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
  OG_IMAGE: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=630&fit=crop',
  PLACEHOLDER: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjwvZXZnPgo='
} as const
