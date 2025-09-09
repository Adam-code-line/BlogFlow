/**
 * 用户相关类型定义
 */

// 用户角色枚举
export enum UserRole {
  ADMIN = 'admin',
  AUTHOR = 'author',
  EDITOR = 'editor',
  SUBSCRIBER = 'subscriber',
  GUEST = 'guest'
}

// 用户状态枚举
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending'
}

// 社交媒体链接接口
export interface SocialLinks {
  github?: string
  twitter?: string
  linkedin?: string
  instagram?: string
  facebook?: string
  youtube?: string
  website?: string
  email?: string
}

// 用户偏好设置接口
export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto'
  language: string
  timezone: string
  emailNotifications: {
    newComments: boolean
    newPosts: boolean
    newsletter: boolean
    mentions: boolean
  }
  privacy: {
    showEmail: boolean
    showProfile: boolean
    allowComments: boolean
  }
}

// 用户统计信息接口
export interface UserStats {
  postsCount: number
  commentsCount: number
  likesReceived: number
  viewsReceived: number
  followersCount: number
  followingCount: number
  joinedDaysAgo: number
  lastActiveAt: Date
}

// 基础用户信息接口
export interface BaseUser {
  id: string
  username: string
  email: string
  role: UserRole
  status: UserStatus
  createdAt: Date
  updatedAt: Date
  lastLoginAt?: Date
}

// 用户资料接口
export interface UserProfile {
  displayName: string
  firstName?: string
  lastName?: string
  avatar?: string
  bio?: string
  location?: string
  birthDate?: Date
  website?: string
  socialLinks: SocialLinks
  occupation?: string
  company?: string
  skills?: string[]
  interests?: string[]
}

// 完整用户信息接口
export interface User extends BaseUser {
  profile: UserProfile
  preferences: UserPreferences
  stats: UserStats
  isEmailVerified: boolean
  isProfileComplete: boolean
  twoFactorEnabled: boolean
}

// 公开用户信息接口（用于显示）
export interface PublicUser {
  id: string
  username: string
  displayName: string
  avatar?: string
  bio?: string
  location?: string
  website?: string
  socialLinks: SocialLinks
  occupation?: string
  skills?: string[]
  stats: Pick<UserStats, 'postsCount' | 'followersCount' | 'joinedDaysAgo'>
  role: UserRole
  isProfileComplete: boolean
}

// 作者信息接口（用于文章显示）
export interface Author {
  id: string
  username: string
  displayName: string
  avatar?: string
  bio?: string
  socialLinks: Pick<SocialLinks, 'github' | 'twitter' | 'website'>
  stats: Pick<UserStats, 'postsCount' | 'followersCount'>
  isVerified?: boolean
}

// 用户注册接口
export interface RegisterData {
  username: string
  email: string
  password: string
  displayName: string
  firstName?: string
  lastName?: string
  agreeToTerms: boolean
  subscribeNewsletter?: boolean
}

// 用户登录接口
export interface LoginData {
  email: string
  password: string
  rememberMe?: boolean
  twoFactorCode?: string
}

// 登录响应接口
export interface LoginResponse {
  user: User
  token: string
  refreshToken: string
  expiresIn: number
  permissions: string[]
}

// 用户更新接口
export interface UpdateUserData {
  profile?: Partial<UserProfile>
  preferences?: Partial<UserPreferences>
  currentPassword?: string
  newPassword?: string
}

// 密码重置接口
export interface PasswordResetData {
  email: string
}

export interface PasswordResetConfirmData {
  token: string
  newPassword: string
  confirmPassword: string
}

// 用户查询参数接口
export interface UserQuery {
  page?: number
  limit?: number
  role?: UserRole
  status?: UserStatus
  search?: string
  sortBy?: 'createdAt' | 'lastLoginAt' | 'username' | 'postsCount'
  sortOrder?: 'asc' | 'desc'
  dateRange?: {
    start: Date
    end: Date
  }
}

// 用户列表响应接口
export interface UsersResponse {
  data: PublicUser[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
    hasNext: boolean
    hasPrev: boolean
  }
  filters?: {
    roles: UserRole[]
    statuses: UserStatus[]
  }
}

// 关注/取消关注接口
export interface FollowData {
  followerId: string
  followingId: string
}

// 用户活动接口
export interface UserActivity {
  id: string
  userId: string
  type: 'post_created' | 'comment_added' | 'post_liked' | 'user_followed' | 'profile_updated'
  description: string
  metadata?: Record<string, any>
  createdAt: Date
}

// 用户通知接口
export interface UserNotification {
  id: string
  userId: string
  type: 'comment' | 'like' | 'follow' | 'mention' | 'system'
  title: string
  message: string
  isRead: boolean
  actionUrl?: string
  metadata?: Record<string, any>
  createdAt: Date
  readAt?: Date
}

// 用户会话接口
export interface UserSession {
  id: string
  userId: string
  token: string
  device: string
  ipAddress: string
  userAgent: string
  location?: string
  isActive: boolean
  lastActivityAt: Date
  expiresAt: Date
  createdAt: Date
}

// 管理员用户管理接口
export interface AdminUserData extends User {
  sessions: UserSession[]
  activities: UserActivity[]
  permissions: string[]
  lastIpAddress: string
  loginAttempts: number
  isLocked: boolean
  lockedUntil?: Date
}

// 用户权限接口
export interface UserPermission {
  id: string
  name: string
  description: string
  resource: string
  action: string
}

// 用户角色权限映射
export interface RolePermissions {
  role: UserRole
  permissions: UserPermission[]
  description: string
  isDefault: boolean
}