<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Logo 和标题 -->
      <div class="text-center">
        <img 
          src="~/assets/images/logo.png" 
          alt="BlogFlow" 
          class="mx-auto h-12 w-auto"
        />
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
          {{ isLogin ? '登录您的账户' : '创建新账户' }}
        </h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {{ isLogin ? '欢迎回到 BlogFlow' : '加入 BlogFlow 社区' }}
        </p>
      </div>

      <!-- 表单 -->
      <UCard class="bg-white dark:bg-gray-800 shadow-lg">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- 切换登录/注册 -->
          <div class="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              type="button"
              @click="isLogin = true"
              :class="[
                'flex-1 py-2 text-sm font-medium rounded-md transition-colors',
                isLogin
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              ]"
            >
              登录
            </button>
            <button
              type="button"
              @click="isLogin = false"
              :class="[
                'flex-1 py-2 text-sm font-medium rounded-md transition-colors',
                !isLogin
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              ]"
            >
              注册
            </button>
          </div>

          <!-- 用户名/邮箱 -->
          <UFormGroup
            :label="isLogin ? '用户名或邮箱' : '邮箱地址'"
            required
            :error="errors.email"
          >
            <UInput
              v-model="form.email"
              :type="isLogin ? 'text' : 'email'"
              :placeholder="isLogin ? '请输入用户名或邮箱' : '请输入邮箱地址'"
              icon="i-heroicons-at-symbol"
              size="lg"
              :disabled="loading"
            />
          </UFormGroup>

          <!-- 用户名（仅注册时显示） -->
          <UFormGroup
            v-if="!isLogin"
            label="用户名"
            required
            :error="errors.username"
          >
            <UInput
              v-model="form.username"
              type="text"
              placeholder="请输入用户名"
              icon="i-heroicons-user"
              size="lg"
              :disabled="loading"
            />
          </UFormGroup>

          <!-- 显示名称（仅注册时显示） -->
          <UFormGroup
            v-if="!isLogin"
            label="显示名称"
            required
            :error="errors.displayName"
          >
            <UInput
              v-model="form.displayName"
              type="text"
              placeholder="请输入显示名称"
              icon="i-heroicons-identification"
              size="lg"
              :disabled="loading"
            />
          </UFormGroup>

          <!-- 密码 -->
          <UFormGroup
            label="密码"
            required
            :error="errors.password"
          >
            <UInput
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="请输入密码"
              icon="i-heroicons-lock-closed"
              size="lg"
              :disabled="loading"
            >
              <template #trailing>
                <UButton
                  variant="ghost"
                  size="sm"
                  :icon="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                  @click="showPassword = !showPassword"
                />
              </template>
            </UInput>
          </UFormGroup>

          <!-- 确认密码（仅注册时显示） -->
          <UFormGroup
            v-if="!isLogin"
            label="确认密码"
            required
            :error="errors.confirmPassword"
          >
            <UInput
              v-model="form.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="请再次输入密码"
              icon="i-heroicons-lock-closed"
              size="lg"
              :disabled="loading"
            >
              <template #trailing>
                <UButton
                  variant="ghost"
                  size="sm"
                  :icon="showConfirmPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                  @click="showConfirmPassword = !showConfirmPassword"
                />
              </template>
            </UInput>
          </UFormGroup>

          <!-- 记住我 / 同意条款 -->
          <div class="flex items-center justify-between">
            <UCheckbox
              v-if="isLogin"
              v-model="form.rememberMe"
              label="记住我"
            />
            <UCheckbox
              v-else
              v-model="form.agreeTerms"
              :label="'我同意'"
              required
            >
              <template #label>
                <span class="text-sm text-gray-600 dark:text-gray-400">
                  我同意
                  <a href="/terms" class="text-blue-600 dark:text-blue-400 hover:underline">服务条款</a>
                  和
                  <a href="/privacy" class="text-blue-600 dark:text-blue-400 hover:underline">隐私政策</a>
                </span>
              </template>
            </UCheckbox>

            <div v-if="isLogin" class="text-sm">
              <a href="/forgot-password" class="text-blue-600 dark:text-blue-400 hover:underline">
                忘记密码？
              </a>
            </div>
          </div>

          <!-- 错误消息 -->
          <div v-if="errorMessage" class="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
            {{ errorMessage }}
          </div>

          <!-- 提交按钮 -->
          <UButton
            type="submit"
            block
            size="lg"
            :loading="loading"
            :disabled="!isFormValid"
          >
            {{ isLogin ? '登录' : '创建账户' }}
          </UButton>

          <!-- 分割线 -->
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                或者
              </span>
            </div>
          </div>

          <!-- 社交登录 -->
          <div class="grid grid-cols-2 gap-3">
            <UButton
              variant="outline"
              size="lg"
              icon="i-simple-icons-github"
              @click="socialLogin('github')"
              :disabled="loading"
            >
              GitHub
            </UButton>
            <UButton
              variant="outline"
              size="lg"
              icon="i-simple-icons-google"
              @click="socialLogin('google')"
              :disabled="loading"
            >
              Google
            </UButton>
          </div>
        </form>
      </UCard>

      <!-- 演示账户信息 -->
      <UCard v-if="isLogin" class="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <div class="p-4">
          <h3 class="text-sm font-medium text-blue-900 dark:text-blue-100 mb-3">
            🚀 演示账户
          </h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-blue-700 dark:text-blue-300">管理员账户:</span>
              <span class="font-mono text-blue-800 dark:text-blue-200">admin@blogflow.com</span>
            </div>
            <div class="flex justify-between">
              <span class="text-blue-700 dark:text-blue-300">密码:</span>
              <span class="font-mono text-blue-800 dark:text-blue-200">admin123</span>
            </div>
            <div class="mt-3 p-2 bg-blue-100 dark:bg-blue-900/40 rounded text-xs text-blue-800 dark:text-blue-200">
              💡 使用管理员账户登录后可以访问管理面板
            </div>
          </div>
        </div>
      </UCard>

      <!-- 底部链接 -->
      <div class="text-center">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          {{ isLogin ? '还没有账户？' : '已有账户？' }}
          <button
            @click="isLogin = !isLogin"
            class="font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            {{ isLogin ? '立即注册' : '立即登录' }}
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 页面元数据
definePageMeta({
  layout: false,
  auth: false
})

// 页面标题
useHead({
  title: '登录注册 - BlogFlow'
})

// 响应式数据
const isLogin = ref(true)
const loading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const errorMessage = ref('')

// 表单数据
const form = ref({
  email: '',
  username: '',
  displayName: '',
  password: '',
  confirmPassword: '',
  rememberMe: false,
  agreeTerms: false
})

// 错误状态
const errors = ref({
  email: '',
  username: '',
  displayName: '',
  password: '',
  confirmPassword: ''
})

// 计算属性
const isFormValid = computed(() => {
  if (isLogin.value) {
    return form.value.email && form.value.password
  } else {
    return (
      form.value.email &&
      form.value.username &&
      form.value.displayName &&
      form.value.password &&
      form.value.confirmPassword &&
      form.value.agreeTerms &&
      form.value.password === form.value.confirmPassword
    )
  }
})

// 方法
const validateForm = () => {
  errors.value = {
    email: '',
    username: '',
    displayName: '',
    password: '',
    confirmPassword: ''
  }

  let isValid = true

  // 邮箱验证
  if (!form.value.email) {
    errors.value.email = '请输入邮箱地址'
    isValid = false
  } else if (!isLogin.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = '请输入有效的邮箱地址'
    isValid = false
  }

  // 用户名验证（仅注册时）
  if (!isLogin.value) {
    if (!form.value.username) {
      errors.value.username = '请输入用户名'
      isValid = false
    } else if (form.value.username.length < 3) {
      errors.value.username = '用户名至少3个字符'
      isValid = false
    }

    if (!form.value.displayName) {
      errors.value.displayName = '请输入显示名称'
      isValid = false
    }
  }

  // 密码验证
  if (!form.value.password) {
    errors.value.password = '请输入密码'
    isValid = false
  } else if (!isLogin.value && form.value.password.length < 6) {
    errors.value.password = '密码至少6个字符'
    isValid = false
  }

  // 确认密码验证（仅注册时）
  if (!isLogin.value) {
    if (!form.value.confirmPassword) {
      errors.value.confirmPassword = '请确认密码'
      isValid = false
    } else if (form.value.password !== form.value.confirmPassword) {
      errors.value.confirmPassword = '两次输入的密码不一致'
      isValid = false
    }
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    if (isLogin.value) {
      await handleLogin()
    } else {
      await handleRegister()
    }
  } catch (error: any) {
    errorMessage.value = error.message || '操作失败，请重试'
  } finally {
    loading.value = false
  }
}

const handleLogin = async () => {
  // 使用认证系统登录
  const { login } = useAuth()
  const result = await login({
    email: form.value.email,
    password: form.value.password,
    rememberMe: form.value.rememberMe
  })

  if (result.success) {
    // 登录成功，跳转到之前的页面或管理页面
    const redirectTo = useRoute().query.redirect as string || '/admin'
    await navigateTo(redirectTo)
  } else {
    errorMessage.value = result.error || '登录失败'
  }
}

const handleRegister = async () => {
  // 使用认证系统注册
  const { register } = useAuth()
  const result = await register({
    username: form.value.username,
    displayName: form.value.displayName,
    email: form.value.email,
    password: form.value.password
  })

  if (result.success) {
    // 注册成功后跳转到首页
    await navigateTo('/')
  } else {
    errorMessage.value = result.error || '注册失败'
  }
}

const socialLogin = async (provider: string) => {
  loading.value = true
  errorMessage.value = ''

  try {
    // 模拟社交登录
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log(`${provider} 登录`)
    
    // 社交登录成功后跳转
    await navigateTo('/admin')
  } catch (error: any) {
    errorMessage.value = `${provider} 登录失败`
  } finally {
    loading.value = false
  }
}

// 重置表单
const resetForm = () => {
  form.value = {
    email: '',
    username: '',
    displayName: '',
    password: '',
    confirmPassword: '',
    rememberMe: false,
    agreeTerms: false
  }
  errors.value = {
    email: '',
    username: '',
    displayName: '',
    password: '',
    confirmPassword: ''
  }
  errorMessage.value = ''
}

// 监听登录/注册模式切换
watch(isLogin, () => {
  resetForm()
})
</script>