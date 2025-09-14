/**
 * 高级管理员中间件
 * 提供多层安全验证和权限控制
 */

export default defineNuxtRouteMiddleware(async (to, from) => {
  // 只在客户端执行认证检查
  if (!process.client) return

  try {
    // 动态导入认证模块避免SSR问题
    const { useAuth } = await import('~/composables/useAuth')
    const auth = useAuth()

    // 1. 尝试恢复现有会话
    const sessionRestored = auth.restoreSession()
    
    // 2. 检查认证状态
    if (!auth.isAuthenticated.value) {
      console.warn('未认证的管理员访问尝试:', to.path)
      
      // 保存目标路径用于登录后重定向
      if (process.client) {
        sessionStorage.setItem('admin_redirect_target', to.fullPath)
      }
      
      // 重定向到管理员登录页面
      return navigateTo('/admin/login')
    }

    // 3. 验证管理员权限
    if (!auth.canAccessAdmin.value) {
      console.error('非管理员用户尝试访问管理页面')
      throw createError({
        statusCode: 403,
        statusMessage: '访问被拒绝：需要管理员权限'
      })
    }

    // 4. 检查会话是否即将过期
    if (auth.isSessionExpiringSoon.value) {
      console.info('会话即将过期，尝试延长')
      auth.extendSession()
    }

    // 5. 记录访问日志（可选）
    if (process.client && auth.currentUser.value) {
      console.info(`管理员 ${auth.currentUser.value.username} 访问: ${to.path}`)
    }

    // 6. 安全检查通过，允许继续
    return

  } catch (error) {
    console.error('管理员中间件执行失败:', error)
    
    // 发生错误时重定向到首页
    return navigateTo('/', { 
      replace: true,
      external: false 
    })
  }
})