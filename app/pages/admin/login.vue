<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 flex items-center justify-center px-4">
    <!-- 背景装饰 -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
    </div>

    <!-- 登录卡片 -->
    <div class="relative w-full max-w-md">
      <div class="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
        
        <!-- Logo 和标题 -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <Icon name="i-heroicons-shield-check" class="w-8 h-8 text-white" />
          </div>
          <h1 class="text-2xl font-bold text-white mb-2">
            BlogFlow 管理中心
          </h1>
          <p class="text-blue-100 text-sm">
            安全认证系统
          </p>
        </div>

        <!-- 错误提示 -->
        <div v-if="error" class="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
          <div class="flex items-center">
            <Icon name="i-heroicons-exclamation-triangle" class="w-5 h-5 text-red-400 mr-3" />
            <span class="text-red-100 text-sm">{{ error }}</span>
          </div>
        </div>

        <!-- 成功提示 -->
        <div v-if="success" class="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl">
          <div class="flex items-center">
            <Icon name="i-heroicons-check-circle" class="w-5 h-5 text-green-400 mr-3" />
            <span class="text-green-100 text-sm">{{ success }}</span>
          </div>
        </div>

        <!-- 账户锁定警告 -->
        <div v-if="accountLocked" class="mb-6 p-4 bg-orange-500/20 border border-orange-500/30 rounded-xl">
          <div class="flex items-center">
            <Icon name="i-heroicons-lock-closed" class="w-5 h-5 text-orange-400 mr-3" />
            <span class="text-orange-100 text-sm">
              账户已被锁定，请在 {{ lockoutTimeRemaining }} 后重试
            </span>
          </div>
        </div>

        <!-- 登录表单 -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          
          <!-- 用户名输入 -->
          <div>
            <label class="block text-sm font-medium text-blue-100 mb-2">
              管理员账户
            </label>
            <div class="relative">
              <input
                v-model="loginForm.username"
                type="text"
                required
                :disabled="loading || accountLocked"
                class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                placeholder="输入管理员用户名"
              />
              <Icon name="i-heroicons-user" class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
            </div>
          </div>

          <!-- 密码输入 -->
          <div>
            <label class="block text-sm font-medium text-blue-100 mb-2">
              密码
            </label>
            <div class="relative">
              <input
                v-model="loginForm.password"
                :type="showPassword ? 'text' : 'password'"
                required
                :disabled="loading || accountLocked"
                class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                placeholder="输入密码"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-white"
              >
                <Icon :name="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- 二次验证码 -->
          <div v-if="requiresConfirmation">
            <label class="block text-sm font-medium text-blue-100 mb-2">
              确认码
            </label>
            <div class="relative">
              <input
                v-model="loginForm.confirmCode"
                type="text"
                required
                maxlength="4"
                :disabled="loading"
                class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest"
                placeholder="••••"
              />
              <Icon name="i-heroicons-shield-check" class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
            </div>
            <div class="mt-2 text-xs text-blue-200 text-center">
              <p>当前确认码：<span class="font-mono font-bold">{{ currentConfirmCode }}</span></p>
              <p>或使用测试码：<span class="font-mono font-bold">1234</span></p>
            </div>
          </div>

          <!-- 登录按钮 -->
          <button
            type="submit"
            :disabled="loading || accountLocked"
            class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Icon v-if="loading" name="i-heroicons-arrow-path" class="w-5 h-5 mr-2 animate-spin" />
            <Icon v-else name="i-heroicons-lock-open" class="w-5 h-5 mr-2" />
            {{ loading ? '验证中...' : (requiresConfirmation ? '验证确认码' : '安全登录') }}
          </button>

        </form>

        <!-- 安全提示 -->
        <div class="mt-8 p-4 bg-white/5 rounded-xl border border-white/10">
          <h3 class="text-sm font-semibold text-blue-100 mb-2 flex items-center">
            <Icon name="i-heroicons-information-circle" class="w-4 h-4 mr-2" />
            安全提示
          </h3>
          <ul class="text-xs text-blue-200 space-y-1">
            <li>• 管理员账户仅限授权人员使用</li>
            <li>• 连续登录失败将锁定账户</li>
            <li>• 会话将在 2 小时后自动过期</li>
            <li>• 建议在安全网络环境下使用</li>
          </ul>
        </div>

        <!-- 返回首页 -->
        <div class="mt-6 text-center">
          <NuxtLink 
            to="/" 
            class="inline-flex items-center text-sm text-blue-200 hover:text-white transition-colors"
          >
            <Icon name="i-heroicons-arrow-left" class="w-4 h-4 mr-1" />
            返回首页
          </NuxtLink>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 设置页面布局
definePageMeta({
  layout: false, // 使用独立布局
  middleware: [] // 不使用任何中间件
})

// 页面标题
useHead({
  title: 'BlogFlow 管理员登录'
})

const { useAuth } = await import('~/composables/useAuth')
const auth = useAuth()

// 响应式数据
const loading = ref(false)
const error = ref('')
const success = ref('')
const showPassword = ref(false)
const requiresConfirmation = ref(false)
const accountLocked = ref(false)
const lockoutTimeRemaining = ref('')

// 登录表单
const loginForm = ref({
  username: '',
  password: '',
  confirmCode: ''
})

// 当前确认码（每分钟更新）
const currentConfirmCode = computed(() => auth.getCurrentConfirmCode())

// 检查账户锁定状态
const checkLockoutStatus = () => {
  accountLocked.value = auth.isAccountLocked()
  if (accountLocked.value) {
    // 计算剩余锁定时间（简化版）
    lockoutTimeRemaining.value = '30 分钟'
  }
}

// 处理登录
const handleLogin = async () => {
  if (loading.value || accountLocked.value) return

  // 清除之前的错误
  error.value = ''
  success.value = ''
  loading.value = true

  try {
    const result = await auth.adminLogin({
      username: loginForm.value.username,
      password: loginForm.value.password,
      confirmCode: loginForm.value.confirmCode
    })

    if (result.success) {
      success.value = result.message
      
      // 登录成功，重定向
      setTimeout(() => {
        const redirectTarget = process.client 
          ? sessionStorage.getItem('admin_redirect_target') || '/admin'
          : '/admin'
        
        if (process.client) {
          sessionStorage.removeItem('admin_redirect_target')
        }
        
        navigateTo(redirectTarget)
      }, 1000)

    } else {
      if (result.requiresConfirmation) {
        requiresConfirmation.value = true
        error.value = result.message
      } else {
        error.value = result.message
        // 重新检查锁定状态
        checkLockoutStatus()
      }
    }

  } catch (err) {
    console.error('登录失败:', err)
    error.value = '登录过程中发生错误，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 每分钟更新确认码显示
if (process.client) {
  setInterval(() => {
    // 触发确认码重新计算
    currentConfirmCode.value
  }, 60000)
}

// 页面挂载时检查状态
onMounted(() => {
  // 如果已经登录，直接跳转
  if (auth.isAuthenticated.value && auth.canAccessAdmin.value) {
    navigateTo('/admin')
    return
  }

  // 检查账户锁定状态
  checkLockoutStatus()
})
</script>

<style scoped>
/* 动画延迟 */
.animation-delay-2000 {
  animation-delay: 2s;
}

/* 确保输入框在深色背景下可见 */
input::placeholder {
  color: rgba(196, 181, 253, 0.6);
}

input:focus::placeholder {
  color: rgba(196, 181, 253, 0.4);
}

/* 登录按钮悬停效果 */
button[type="submit"]:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

/* 玻璃拟态效果增强 */
.backdrop-blur-lg {
  backdrop-filter: blur(20px);
}
</style>