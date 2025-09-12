/**
 * 用户认证和权限管理 composable
 */
import type { User } from '~/types/user'

export interface AuthUser {
  id: string
  username: string
  displayName: string
  email: string
  avatar?: string
  role: 'admin' | 'author' | 'editor' | 'subscriber' | 'guest'
  permissions: string[]
  isActive: boolean
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterData {
  username: string
  displayName: string
  email: string
  password: string
}

// 模拟的管理员用户数据
const mockAdminUser: AuthUser = {
  id: 'admin-1',
  username: 'admin',
  displayName: '管理员',
  email: 'admin@blogflow.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
  role: 'admin',
  permissions: [
    'admin.dashboard',
    'admin.users.view',
    'admin.users.edit',
    'admin.users.delete',
    'admin.posts.view',
    'admin.posts.edit',
    'admin.posts.delete',
    'admin.settings.view',
    'admin.settings.edit'
  ],
  isActive: true
}

// 模拟的普通用户数据
const mockUsers: AuthUser[] = [
  {
    id: 'user-1',
    username: 'johndev',
    displayName: 'John Developer',
    email: 'john@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    role: 'author',
    permissions: ['posts.create', 'posts.edit'],
    isActive: true
  },
  {
    id: 'user-2',
    username: 'sarahui',
    displayName: 'Sarah Designer',
    email: 'sarah@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5e5?w=200&h=200&fit=crop&crop=face',
    role: 'subscriber',
    permissions: [],
    isActive: true
  }
]

export const useAuth = () => {
  // 响应式状态
  const user = ref<AuthUser | null>(null)
  const isAuthenticated = computed(() => !!user.value)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // 权限检查
  const hasRole = (role: string | string[]) => {
    if (!user.value) return false
    
    const roles = Array.isArray(role) ? role : [role]
    return roles.includes(user.value.role)
  }

  const hasPermission = (permission: string | string[]) => {
    if (!user.value) return false
    
    const permissions = Array.isArray(permission) ? permission : [permission]
    return permissions.some(p => user.value!.permissions.includes(p))
  }

  const isAdmin = computed(() => hasRole('admin'))
  const isAuthor = computed(() => hasRole(['admin', 'author', 'editor']))
  const canAccessAdmin = computed(() => isAdmin.value)

  // 登录
  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    isLoading.value = true
    error.value = null

    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000))

      // 检查管理员账户
      if (credentials.email === 'admin@blogflow.com' && credentials.password === 'admin123') {
        user.value = mockAdminUser
        
        // 保存到localStorage（如果需要记住登录状态）
        if (credentials.rememberMe) {
          localStorage.setItem('blogflow_user', JSON.stringify(mockAdminUser))
        }
        
        return { success: true }
      }
      
      // 检查普通用户账户
      const foundUser = mockUsers.find(u => u.email === credentials.email)
      if (foundUser && credentials.password === '123456') {
        user.value = foundUser
        
        if (credentials.rememberMe) {
          localStorage.setItem('blogflow_user', JSON.stringify(foundUser))
        }
        
        return { success: true }
      }

      return { success: false, error: '邮箱或密码错误' }
    } catch (err) {
      error.value = '登录失败，请稍后重试'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // 注册
  const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    isLoading.value = true
    error.value = null

    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1500))

      // 检查用户名和邮箱是否已存在
      const existingUser = mockUsers.find(u => 
        u.username === data.username || u.email === data.email
      )
      
      if (existingUser) {
        return { success: false, error: '用户名或邮箱已存在' }
      }

      // 创建新用户
      const newUser: AuthUser = {
        id: `user-${Date.now()}`,
        username: data.username,
        displayName: data.displayName,
        email: data.email,
        role: 'subscriber',
        permissions: [],
        isActive: true
      }

      mockUsers.push(newUser)
      user.value = newUser

      return { success: true }
    } catch (err) {
      error.value = '注册失败，请稍后重试'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // 登出
  const logout = async () => {
    user.value = null
    localStorage.removeItem('blogflow_user')
    
    // 如果当前在管理页面，跳转到首页
    const route = useRoute()
    if (route.path.startsWith('/admin')) {
      await navigateTo('/')
    }
  }

  // 初始化认证状态（从localStorage恢复）
  const initAuth = () => {
    if (process.client) {
      try {
        const savedUser = localStorage.getItem('blogflow_user')
        if (savedUser) {
          user.value = JSON.parse(savedUser)
        }
      } catch (err) {
        console.error('Failed to restore auth state:', err)
        localStorage.removeItem('blogflow_user')
      }
    }
  }

  // 更新用户信息
  const updateUser = (updates: Partial<AuthUser>) => {
    if (user.value) {
      user.value = { ...user.value, ...updates }
      localStorage.setItem('blogflow_user', JSON.stringify(user.value))
    }
  }

  // 检查是否需要登录
  const requireAuth = (requiredRole?: string | string[]) => {
    if (!isAuthenticated.value) {
      throw createError({
        statusCode: 401,
        statusMessage: '请先登录'
      })
    }

    if (requiredRole && !hasRole(requiredRole)) {
      throw createError({
        statusCode: 403,
        statusMessage: '权限不足'
      })
    }
  }

  // 检查管理员权限
  const requireAdmin = () => {
    requireAuth('admin')
  }

  return {
    // 状态
    user: readonly(user),
    isAuthenticated,
    isLoading: readonly(isLoading),
    error: readonly(error),
    
    // 权限检查
    hasRole,
    hasPermission,
    isAdmin,
    isAuthor,
    canAccessAdmin,
    
    // 操作
    login,
    register,
    logout,
    initAuth,
    updateUser,
    requireAuth,
    requireAdmin
  }
}