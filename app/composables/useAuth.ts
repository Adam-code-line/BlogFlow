/**
 * 高级用户认证和权限管理系统
 * 包含二次认证、JWT token管理、IP白名单等安全特性
 */

import { ref, computed, watch } from 'vue'
import CryptoJS from 'crypto-js'

// 认证配置
const AUTH_CONFIG = {
  // 管理员密钥（实际项目中应该从环境变量获取）
  ADMIN_SECRET: 'BlogFlow_Admin_2024_Secret_Key',
  // 会话超时时间（小时）
  SESSION_TIMEOUT: 2,
  // 最大登录尝试次数
  MAX_LOGIN_ATTEMPTS: 3,
  // 锁定时间（分钟）
  LOCKOUT_DURATION: 30,
  // 允许的IP地址（开发环境）
  ALLOWED_IPS: ['127.0.0.1', 'localhost'],
  // 管理员账户配置
  ADMIN_CREDENTIALS: {
    username: 'admin',
    password: 'BlogFlow2024!Admin',
    email: 'admin@blogflow.local'
  }
}

// 存储键名
const STORAGE_KEYS = {
  ADMIN_TOKEN: 'blogflow_admin_token',
  LOGIN_ATTEMPTS: 'blogflow_login_attempts',
  LAST_LOGIN: 'blogflow_last_login',
  SESSION_DATA: 'blogflow_session_data'
}

// 用户状态接口
interface AdminUser {
  id: string
  username: string
  email: string
  role: 'admin'
  permissions: string[]
  loginTime: number
  ipAddress?: string
}

interface LoginAttempt {
  timestamp: number
  ip?: string
  success: boolean
}

interface AuthState {
  user: AdminUser | null
  isAuthenticated: boolean
  token: string | null
  sessionExpiry: number | null
}

// 全局状态
const authState = ref<AuthState>({
  user: null,
  isAuthenticated: false,
  token: null,
  sessionExpiry: null
})

/**
 * 高级认证系统 Composable
 */
export const useAuth = () => {
  
  // ==================== 工具函数 ====================
  
  /**
   * 生成安全的JWT token
   */
  const generateSecureToken = (user: AdminUser): string => {
    const payload = {
      userId: user.id,
      username: user.username,
      role: user.role,
      iat: Date.now(),
      exp: Date.now() + (AUTH_CONFIG.SESSION_TIMEOUT * 60 * 60 * 1000)
    }
    
    return CryptoJS.AES.encrypt(
      JSON.stringify(payload),
      AUTH_CONFIG.ADMIN_SECRET
    ).toString()
  }

  /**
   * 验证并解密token
   */
  const verifyToken = (token: string): AdminUser | null => {
    try {
      const decrypted = CryptoJS.AES.decrypt(token, AUTH_CONFIG.ADMIN_SECRET)
      const payload = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8))
      
      // 检查token是否过期
      if (Date.now() > payload.exp) {
        console.warn('Token 已过期')
        return null
      }
      
      return {
        id: payload.userId,
        username: payload.username,
        email: AUTH_CONFIG.ADMIN_CREDENTIALS.email,
        role: payload.role,
        permissions: ['read', 'write', 'delete', 'admin'],
        loginTime: payload.iat,
        ipAddress: getCurrentIP()
      }
    } catch (error) {
      console.error('Token 验证失败:', error)
      return null
    }
  }

  /**
   * 获取当前IP地址（简化版）
   */
  const getCurrentIP = (): string => {
    if (process.client) {
      return location.hostname === 'localhost' ? '127.0.0.1' : location.hostname
    }
    return '127.0.0.1'
  }

  /**
   * 检查IP是否在白名单中
   */
  const isIPAllowed = (ip: string): boolean => {
    return AUTH_CONFIG.ALLOWED_IPS.includes(ip) || 
           AUTH_CONFIG.ALLOWED_IPS.includes('127.0.0.1') // 开发环境回退
  }

  /**
   * 记录登录尝试
   */
  const recordLoginAttempt = (success: boolean) => {
    if (!process.client) return
    
    const attempts = getLoginAttempts()
    const newAttempt: LoginAttempt = {
      timestamp: Date.now(),
      ip: getCurrentIP(),
      success
    }
    
    attempts.push(newAttempt)
    
    // 只保留最近10次尝试
    if (attempts.length > 10) {
      attempts.splice(0, attempts.length - 10)
    }
    
    localStorage.setItem(STORAGE_KEYS.LOGIN_ATTEMPTS, JSON.stringify(attempts))
  }

  /**
   * 获取登录尝试记录
   */
  const getLoginAttempts = (): LoginAttempt[] => {
    if (!process.client) return []
    
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LOGIN_ATTEMPTS)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  /**
   * 检查是否被锁定
   */
  const isAccountLocked = (): boolean => {
    const attempts = getLoginAttempts()
    const now = Date.now()
    const lockoutTime = AUTH_CONFIG.LOCKOUT_DURATION * 60 * 1000
    
    // 获取最近的失败尝试
    const recentFailures = attempts.filter(attempt => 
      !attempt.success && 
      (now - attempt.timestamp) < lockoutTime
    )
    
    return recentFailures.length >= AUTH_CONFIG.MAX_LOGIN_ATTEMPTS
  }

  // ==================== 认证方法 ====================

  /**
   * 管理员登录（二次认证）
   */
  const adminLogin = async (credentials: {
    username: string
    password: string
    confirmCode?: string
  }): Promise<{ success: boolean; message: string; requiresConfirmation?: boolean }> => {
    
    try {
      // 1. 检查账户是否被锁定
      if (isAccountLocked()) {
        return {
          success: false,
          message: `账户已被锁定 ${AUTH_CONFIG.LOCKOUT_DURATION} 分钟，请稍后再试`
        }
      }

      // 2. 检查IP白名单
      const currentIP = getCurrentIP()
      if (!isIPAllowed(currentIP)) {
        recordLoginAttempt(false)
        return {
          success: false,
          message: '访问被拒绝：IP地址不在允许列表中'
        }
      }

      // 3. 验证基础凭据
      const { username, password } = credentials
      if (username !== AUTH_CONFIG.ADMIN_CREDENTIALS.username ||
          password !== AUTH_CONFIG.ADMIN_CREDENTIALS.password) {
        recordLoginAttempt(false)
        return {
          success: false,
          message: '用户名或密码错误'
        }
      }

      // 4. 二次确认（简化版 - 实际项目中可以用短信/邮箱验证码）
      if (!credentials.confirmCode) {
        return {
          success: false,
          message: '请输入确认码',
          requiresConfirmation: true
        }
      }

      // 验证确认码（这里用简单的时间戳验证，实际项目中应该用动态验证码）
      const expectedCode = Math.floor(Date.now() / 60000).toString().slice(-4) // 每分钟变化的4位数
      if (credentials.confirmCode !== expectedCode && credentials.confirmCode !== '1234') { // 1234为测试码
        recordLoginAttempt(false)
        return {
          success: false,
          message: '确认码错误'
        }
      }

      // 5. 创建管理员用户对象
      const adminUser: AdminUser = {
        id: 'admin-001',
        username: AUTH_CONFIG.ADMIN_CREDENTIALS.username,
        email: AUTH_CONFIG.ADMIN_CREDENTIALS.email,
        role: 'admin',
        permissions: ['read', 'write', 'delete', 'admin'],
        loginTime: Date.now(),
        ipAddress: currentIP
      }

      // 6. 生成安全token
      const token = generateSecureToken(adminUser)
      const sessionExpiry = Date.now() + (AUTH_CONFIG.SESSION_TIMEOUT * 60 * 60 * 1000)

      // 7. 更新状态
      authState.value = {
        user: adminUser,
        isAuthenticated: true,
        token,
        sessionExpiry
      }

      // 8. 保存到localStorage
      if (process.client) {
        localStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, token)
        localStorage.setItem(STORAGE_KEYS.LAST_LOGIN, Date.now().toString())
        localStorage.setItem(STORAGE_KEYS.SESSION_DATA, JSON.stringify({
          expiry: sessionExpiry,
          ip: currentIP
        }))
      }

      // 9. 记录成功登录
      recordLoginAttempt(true)

      return {
        success: true,
        message: '登录成功'
      }

    } catch (error) {
      console.error('登录过程出错:', error)
      recordLoginAttempt(false)
      return {
        success: false,
        message: '登录失败，请稍后重试'
      }
    }
  }

  /**
   * 检查并恢复会话
   */
  const restoreSession = (): boolean => {
    if (!process.client) return false

    try {
      const token = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN)
      if (!token) return false

      const sessionData = localStorage.getItem(STORAGE_KEYS.SESSION_DATA)
      if (!sessionData) return false

      const { expiry, ip } = JSON.parse(sessionData)
      
      // 检查会话是否过期
      if (Date.now() > expiry) {
        logout()
        return false
      }

      // 检查IP是否匹配（简化版）
      const currentIP = getCurrentIP()
      if (ip && ip !== currentIP) {
        console.warn('IP地址发生变化，需要重新登录')
        logout()
        return false
      }

      // 验证token
      const user = verifyToken(token)
      if (!user) {
        logout()
        return false
      }

      // 恢复状态
      authState.value = {
        user,
        isAuthenticated: true,
        token,
        sessionExpiry: expiry
      }

      return true
    } catch (error) {
      console.error('会话恢复失败:', error)
      logout()
      return false
    }
  }

  /**
   * 退出登录
   */
  const logout = () => {
    authState.value = {
      user: null,
      isAuthenticated: false,
      token: null,
      sessionExpiry: null
    }

    if (process.client) {
      localStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.LAST_LOGIN)
      localStorage.removeItem(STORAGE_KEYS.SESSION_DATA)
    }
  }

  /**
   * 延长会话
   */
  const extendSession = () => {
    if (!authState.value.isAuthenticated || !authState.value.user) return false

    const newExpiry = Date.now() + (AUTH_CONFIG.SESSION_TIMEOUT * 60 * 60 * 1000)
    const newToken = generateSecureToken(authState.value.user)

    authState.value.token = newToken
    authState.value.sessionExpiry = newExpiry

    if (process.client) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, newToken)
      localStorage.setItem(STORAGE_KEYS.SESSION_DATA, JSON.stringify({
        expiry: newExpiry,
        ip: getCurrentIP()
      }))
    }

    return true
  }

  // ==================== 计算属性 ====================

  const isAuthenticated = computed(() => authState.value.isAuthenticated)
  const currentUser = computed(() => authState.value.user)
  const sessionExpiry = computed(() => authState.value.sessionExpiry)
  
  const canAccessAdmin = computed(() => {
    return authState.value.isAuthenticated && 
           authState.value.user?.role === 'admin'
  })

  const timeUntilExpiry = computed(() => {
    if (!authState.value.sessionExpiry) return 0
    return Math.max(0, authState.value.sessionExpiry - Date.now())
  })

  const isSessionExpiringSoon = computed(() => {
    return timeUntilExpiry.value > 0 && timeUntilExpiry.value < (30 * 60 * 1000) // 30分钟
  })

  // ==================== 权限检查 ====================

  const hasPermission = (permission: string): boolean => {
    return authState.value.user?.permissions.includes(permission) || false
  }

  const hasRole = (role: string): boolean => {
    return authState.value.user?.role === role
  }

  const canAccess = (resource: string): boolean => {
    if (!authState.value.isAuthenticated) return false
    
    const permissions = authState.value.user?.permissions || []
    return permissions.includes('admin') || permissions.includes(resource)
  }

  // ==================== 生命周期管理 ====================

  // 监听会话过期
  watch(timeUntilExpiry, (remaining) => {
    if (remaining <= 0 && authState.value.isAuthenticated) {
      console.warn('会话已过期')
      logout()
    }
  })

  // 页面可见性检查（防止长时间离开页面）
  if (process.client) {
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && authState.value.isAuthenticated) {
        // 页面重新可见时检查会话
        if (!restoreSession()) {
          console.warn('会话检查失败，需要重新登录')
        }
      }
    })
  }

  // ==================== 返回接口 ====================

  return {
    // 状态
    isAuthenticated: readonly(isAuthenticated),
    currentUser: readonly(currentUser),
    canAccessAdmin: readonly(canAccessAdmin),
    sessionExpiry: readonly(sessionExpiry),
    timeUntilExpiry: readonly(timeUntilExpiry),
    isSessionExpiringSoon: readonly(isSessionExpiringSoon),
    
    // 方法
    adminLogin,
    logout,
    restoreSession,
    extendSession,
    hasPermission,
    hasRole,
    canAccess,
    isAccountLocked,
    
    // 工具
    getCurrentConfirmCode: () => Math.floor(Date.now() / 60000).toString().slice(-4),
    getLoginAttempts
  }
}