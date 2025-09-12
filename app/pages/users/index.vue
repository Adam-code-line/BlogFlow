<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">

    <main class="max-w-7xl mx-auto px-4 py-8">
      <!-- 页面标题和统计 -->
      <div class="mb-8">
        <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-6">
          <div class="flex flex-col md:flex-row items-center justify-between text-white">
            <div class="text-center md:text-left mb-6 md:mb-0">
              <h1 class="text-4xl font-bold mb-2">用户社区</h1>
              <p class="text-blue-100 text-lg">发现更多优秀的内容创作者</p>
            </div>
            <div class="grid grid-cols-3 gap-6 text-center">
              <div>
                <div class="text-3xl font-bold">50+</div>
                <div class="text-blue-100 text-sm">活跃用户</div>
              </div>
              <div>
                <div class="text-3xl font-bold">100+</div>
                <div class="text-blue-100 text-sm">优质文章</div>
              </div>
              <div>
                <div class="text-3xl font-bold">200+</div>
                <div class="text-blue-100 text-sm">互动交流</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 搜索和筛选 -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6 mb-8">
        <div class="flex flex-col lg:flex-row gap-4 items-center">
          <!-- 搜索框 -->
          <div class="flex-1 w-full">
            <div class="relative">
              <input
                v-model="userStore.searchQuery"
                type="text"
                placeholder="搜索用户名或显示名..."
                class="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                @input="debouncedSearch"
              >
              <Icon name="heroicons:magnifying-glass" class="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <!-- 筛选器组 -->
          <div class="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <!-- 角色筛选 -->
            <div class="relative">
              <select
                v-model="userStore.selectedRole"
                class="w-full sm:w-48 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer transition-colors"
                @change="filterUsers"
              >
                <option value="">所有角色</option>
                <option value="admin">管理员</option>
                <option value="author">作者</option>
                <option value="editor">编辑</option>
                <option value="subscriber">订阅者</option>
              </select>
              <Icon name="heroicons:chevron-down" class="absolute right-3 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>

            <!-- 排序方式 -->
            <div class="relative">
              <select
                v-model="userStore.sortBy"
                class="w-full sm:w-48 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer transition-colors"
                @change="sortUsers"
              >
                <option value="created">注册时间</option>
                <option value="name">用户名</option>
                <option value="posts">文章数量</option>
                <option value="activity">活跃度</option>
              </select>
              <Icon name="heroicons:chevron-down" class="absolute right-3 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>

            <!-- 刷新按钮 -->
            <button
              @click="userStore.fetchUsers()"
              class="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Icon name="heroicons:arrow-path" class="h-4 w-4" />
              <span class="hidden sm:inline">刷新</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 加载状态 -->
      <Loading v-if="userStore.usersLoading" />

      <!-- 错误信息 -->
      <ErrorMessage v-else-if="userStore.usersError" :message="userStore.usersError" />

      <!-- 用户列表 -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <UserCard 
          v-for="user in userStore.paginatedUsers" 
          :key="user.id" 
          :user="user"
          @click="navigateToUser(user.id)"
        />
      </div>

      <!-- 分页 -->
      <div v-if="userStore.userPagination.total > 0" class="flex justify-center">
        <nav class="flex items-center space-x-2">
          <button
            :disabled="!userStore.userPagination.hasPrev"
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
            @click="previousPage"
          >
            上一页
          </button>
          
          <span class="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
            第 {{ userStore.userPagination.page }} 页，共 {{ userStore.userPagination.pages }} 页
          </span>
          
          <button
            :disabled="!userStore.userPagination.hasNext"
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
            @click="nextPage"
          >
            下一页
          </button>
        </nav>
      </div>

      <!-- 空状态 -->
      <div v-if="!userStore.usersLoading && !userStore.usersError && userStore.users.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">暂无用户</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">没有找到符合条件的用户。</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { PublicUser } from '~/types/user'
import { useUserStore } from '~/stores/user'
import { debounce } from '~/composables/useUtils'

// 组件导入
import Header from '~/components/layout/Header.vue'
import Footer from '~/components/layout/Footer.vue'
import Loading from '~/components/common/Loading.vue'
import ErrorMessage from '~/components/common/ErrorMessage.vue'

// 使用 Pinia store
const userStore = useUserStore()

// 防抖搜索
const debouncedSearch = debounce(() => {
  userStore.setPage(1)
}, 500)

// 筛选用户
const filterUsers = () => {
  userStore.setPage(1)
}

// 排序用户
const sortUsers = () => {
  userStore.setPage(1)
}

// 分页操作
const previousPage = () => {
  userStore.previousPage()
}

const nextPage = () => {
  userStore.nextPage()
}

// 导航到用户详情
const navigateToUser = (userId: string) => {
  navigateTo(`/users/${userId}`)
}

// 页面初始化
onMounted(async () => {
  await userStore.fetchUsers()
})

// SEO 元数据
useSeoMeta({
  title: '用户社区 - BlogFlow',
  ogTitle: '用户社区 - BlogFlow',
  description: '发现 BlogFlow 社区中的优秀内容创作者，浏览他们的作品和资料。',
  ogDescription: '发现 BlogFlow 社区中的优秀内容创作者，浏览他们的作品和资料。',
  ogImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=630&fit=crop',
  twitterCard: 'summary_large_image',
})
</script>
