<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto space-y-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Pinia 状态管理测试</h1>
      
      <!-- UI Store 测试 -->
      <section class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">UI Store 测试</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">当前主题: {{ uiStore.currentTheme }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">通知数量: {{ uiStore.unreadNotifications }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">移动端: {{ uiStore.isMobileView ? '是' : '否' }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">滚动位置: {{ uiStore.scrollY }}px</p>
          </div>
          
          <div class="space-y-2">
            <button @click="uiStore.toggleTheme" class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              切换主题
            </button>
            <button @click="testNotifications" class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              测试通知
            </button>
            <button @click="testLoading" class="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              测试加载
            </button>
          </div>
        </div>
      </section>

      <!-- Blog Store 测试 -->
      <section class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Blog Store 测试</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">文章总数: {{ blogStore.posts.length }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">过滤后文章: {{ blogStore.filteredPosts.length }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">当前页: {{ blogStore.pagination.page }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">加载状态: {{ blogStore.postsLoading ? '加载中' : '已完成' }}</p>
          </div>
          
          <div class="space-y-2">
            <input 
              v-model="blogStore.searchQuery" 
              placeholder="搜索文章..."
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
            <select 
              v-model="blogStore.selectedCategory"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">所有分类</option>
              <option v-for="category in blogStore.categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
            <button @click="blogStore.resetFilters" class="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
              重置筛选
            </button>
          </div>
        </div>
      </section>

      <!-- User Store 测试 -->
      <section class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">User Store 测试</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">用户总数: {{ userStore.users.length }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">过滤后用户: {{ userStore.filteredUsers.length }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">关注数量: {{ userStore.following.size }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">加载状态: {{ userStore.usersLoading ? '加载中' : '已完成' }}</p>
          </div>
          
          <div class="space-y-2">
            <input 
              v-model="userStore.searchQuery" 
              placeholder="搜索用户..."
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
            <select 
              v-model="userStore.selectedRole"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">所有角色</option>
              <option value="admin">管理员</option>
              <option value="author">作者</option>
              <option value="member">成员</option>
            </select>
            <button @click="userStore.resetFilters" class="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
              重置筛选
            </button>
            <button @click="refreshUsers" class="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              刷新用户
            </button>
          </div>
        </div>
      </section>

      <!-- Store 状态展示 -->
      <section class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Store 状态详情</h2>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <h3 class="font-medium text-gray-900 dark:text-white mb-2">UI Store</h3>
            <pre class="text-xs bg-gray-100 dark:bg-gray-700 p-3 rounded overflow-auto max-h-40">{{ JSON.stringify({
              theme: uiStore.theme,
              notifications: uiStore.notifications.length,
              loading: uiStore.isLoading,
              mobile: uiStore.isMobileView
            }, null, 2) }}</pre>
          </div>
          
          <div>
            <h3 class="font-medium text-gray-900 dark:text-white mb-2">Blog Store</h3>
            <pre class="text-xs bg-gray-100 dark:bg-gray-700 p-3 rounded overflow-auto max-h-40">{{ JSON.stringify({
              posts: blogStore.posts.length,
              searchQuery: blogStore.searchQuery,
              selectedCategory: blogStore.selectedCategory,
              pagination: blogStore.pagination
            }, null, 2) }}</pre>
          </div>
          
          <div>
            <h3 class="font-medium text-gray-900 dark:text-white mb-2">User Store</h3>
            <pre class="text-xs bg-gray-100 dark:bg-gray-700 p-3 rounded overflow-auto max-h-40">{{ JSON.stringify({
              users: userStore.users.length,
              searchQuery: userStore.searchQuery,
              selectedRole: userStore.selectedRole,
              following: Array.from(userStore.following)
            }, null, 2) }}</pre>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUIStore } from '~/stores/ui'
import { useBlogStore } from '~/stores/blog'
import { useUserStore } from '~/stores/user'

// 页面元数据
useSeoMeta({
  title: 'Pinia 测试 - BlogFlow',
  description: '测试 Pinia 状态管理集成',
})

// 使用 Pinia stores
const uiStore = useUIStore()
const blogStore = useBlogStore()
const userStore = useUserStore()

// 测试方法
const testNotifications = () => {
  const notificationTypes = ['success', 'error', 'warning', 'info'] as const
  const randomIndex = Math.floor(Math.random() * notificationTypes.length)
  const randomType = notificationTypes[randomIndex] || 'info'
  
  const messages = {
    success: { title: '成功', message: '操作已成功完成！' },
    error: { title: '错误', message: '发生了一个错误，请重试。' },
    warning: { title: '警告', message: '请注意检查您的输入。' },
    info: { title: '信息', message: '这是一条提示信息。' }
  }
  
  const message = messages[randomType]
  uiStore.addNotification({
    type: randomType,
    title: message.title,
    message: message.message
  })
}

const testLoading = async () => {
  uiStore.startLoading('正在处理请求...')
  await new Promise(resolve => setTimeout(resolve, 2000))
  uiStore.stopLoading()
  uiStore.showSuccess('完成', '请求处理完成！')
}

const refreshUsers = async () => {
  try {
    await userStore.fetchUsers()
    uiStore.showSuccess('刷新成功', `已加载 ${userStore.users.length} 个用户`)
  } catch (error) {
    uiStore.showError('刷新失败', '无法加载用户数据')
  }
}

// 初始化数据
onMounted(async () => {
  // 初始化博客数据（如果还没有）
  if (blogStore.posts.length === 0) {
    await blogStore.fetchAllPosts()
  }
  
  // 初始化用户数据（如果还没有）
  if (userStore.users.length === 0) {
    await userStore.fetchUsers()
  }
})
</script>