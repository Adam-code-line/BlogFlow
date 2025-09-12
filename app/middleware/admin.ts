/**
 * 管理员权限中间件
 * 只允许管理员访问管理页面
 */
export default defineNuxtRouteMiddleware((to) => {
  // 在客户端检查认证状态
  if (process.client) {
    const { isAuthenticated, canAccessAdmin } = useAuth()
    
    // 如果未登录，跳转到登录页面
    if (!isAuthenticated.value) {
      return navigateTo({
        path: '/auth/login',
        query: { redirect: to.fullPath }
      })
    }
    
    // 如果已登录但不是管理员，返回403错误
    if (!canAccessAdmin.value) {
      throw createError({
        statusCode: 403,
        statusMessage: '访问被拒绝：需要管理员权限'
      })
    }
  }
})