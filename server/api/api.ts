import type { BlogPost, Category, Tag, User, Comment } from '~/types'

// 博客API服务
export class BlogApiService {
  private api: any

  constructor(api: any) {
    this.api = api
  }

  // 获取所有文章
  async getAllPosts(): Promise<BlogPost[]> {
    return this.api.get('/posts')
  }

  // 根据ID获取文章
  async getPostById(id: string): Promise<BlogPost> {
    return this.api.get(`/posts/${id}`)
  }

  // 根据slug获取文章
  async getPostBySlug(slug: string): Promise<BlogPost> {
    return this.api.get(`/posts/slug/${slug}`)
  }

  // 获取精选文章
  async getFeaturedPosts(limit = 5): Promise<BlogPost[]> {
    return this.api.get(`/posts/featured?limit=${limit}`)
  }

  // 根据分类获取文章
  async getPostsByCategory(category: string): Promise<BlogPost[]> {
    return this.api.get(`/posts/category/${category}`)
  }

  // 根据作者获取文章
  async getPostsByAuthor(authorId: string): Promise<BlogPost[]> {
    return this.api.get(`/posts/author/${authorId}`)
  }

  // 搜索文章
  async searchPosts(query: string): Promise<BlogPost[]> {
    return this.api.get(`/posts/search?q=${encodeURIComponent(query)}`)
  }

  // 获取分类列表
  async getCategories(): Promise<Category[]> {
    return this.api.get('/categories')
  }

  // 获取标签列表
  async getTags(): Promise<Tag[]> {
    return this.api.get('/tags')
  }

  // 创建文章（管理员）
  async createPost(post: Partial<BlogPost>): Promise<BlogPost> {
    return this.api.post('/posts', post)
  }

  // 更新文章（管理员）
  async updatePost(id: string, post: Partial<BlogPost>): Promise<BlogPost> {
    return this.api.put(`/posts/${id}`, post)
  }

  // 删除文章（管理员）
  async deletePost(id: string): Promise<void> {
    return this.api.delete(`/posts/${id}`)
  }

  // 获取文章评论
  async getPostComments(postId: string): Promise<Comment[]> {
    return this.api.get(`/posts/${postId}/comments`)
  }

  // 添加评论
  async addComment(postId: string, comment: Partial<Comment>): Promise<Comment> {
    return this.api.post(`/posts/${postId}/comments`, comment)
  }
}

// 用户API服务
export class UserApiService {
  private api: any

  constructor(api: any) {
    this.api = api
  }

  // 用户登录
  async login(credentials: { email: string; password: string }): Promise<{ user: User; token: string }> {
    return this.api.post('/auth/login', credentials)
  }

  // 用户注册
  async register(userData: Partial<User>): Promise<{ user: User; token: string }> {
    return this.api.post('/auth/register', userData)
  }

  // 获取当前用户
  async getCurrentUser(): Promise<User> {
    return this.api.get('/auth/me')
  }

  // 根据ID获取用户信息
  async getUserById(userId: string): Promise<User> {
    return this.api.get(`/users/${userId}`)
  }

  // 更新用户资料
  async updateProfile(userData: Partial<User>): Promise<User> {
    return this.api.put('/auth/profile', userData)
  }

  // 关注/取消关注用户
  async followUser(userId: string, action: 'follow' | 'unfollow'): Promise<{ success: boolean }> {
    return this.api.post(`/users/${userId}/${action}`)
  }

  // 用户登出
  async logout(): Promise<void> {
    return this.api.post('/auth/logout')
  }

  // 重置密码
  async resetPassword(email: string): Promise<void> {
    return this.api.post('/auth/reset-password', { email })
  }
}

// 文件上传服务
export class UploadApiService {
  private api: any

  constructor(api: any) {
    this.api = api
  }

  // 上传图片
  async uploadImage(file: File): Promise<{ url: string; filename: string }> {
    return this.api.upload('/upload/image', file)
  }

  // 上传文件
  async uploadFile(file: File): Promise<{ url: string; filename: string }> {
    return this.api.upload('/upload/file', file)
  }

  // 删除文件
  async deleteFile(filename: string): Promise<void> {
    return this.api.delete(`/upload/${filename}`)
  }
}

// 联系表单服务
export class ContactApiService {
  private api: any

  constructor(api: any) {
    this.api = api
  }

  // 发送联系消息
  async sendMessage(message: {
    name: string
    email: string
    subject: string
    message: string
  }): Promise<void> {
    return this.api.post('/contact', message, { skipAuth: true })
  }

  // 订阅邮件列表
  async subscribe(email: string): Promise<void> {
    return this.api.post('/newsletter/subscribe', { email }, { skipAuth: true })
  }
}

// 统计API服务
export class AnalyticsApiService {
  private api: any

  constructor(api: any) {
    this.api = api
  }

  // 获取网站统计
  async getSiteStats(): Promise<{
    totalPosts: number
    totalViews: number
    totalComments: number
    totalUsers: number
  }> {
    return this.api.get('/analytics/stats')
  }

  // 记录页面访问
  async trackPageView(data: {
    path: string
    title: string
    referrer?: string
  }): Promise<void> {
    return this.api.post('/analytics/pageview', data, { skipAuth: true })
  }

  // 记录事件
  async trackEvent(data: {
    action: string
    category: string
    label?: string
    value?: number
  }): Promise<void> {
    return this.api.post('/analytics/event', data, { skipAuth: true })
  }
}
