export default defineNuxtRouteMiddleware((to, from) => {
  // 只在客户端执行
  if (process.client) {
    const isLocalhost = location.hostname === 'localhost' || location.hostname === '127.0.0.1'
    const hasAdminAccess = localStorage.getItem('admin_access') === 'true'
    
    if (!isLocalhost && !hasAdminAccess) {
      // 重定向到首页
      return navigateTo('/')
    }
  }
})