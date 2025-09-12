/**
 * 认证插件
 * 在应用启动时初始化认证状态
 */
export default defineNuxtPlugin(() => {
  const { initAuth } = useAuth()
  
  // 在客户端初始化认证状态
  if (process.client) {
    initAuth()
  }
})