<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <Header />
    
    <main class="max-w-7xl mx-auto px-4 py-8">
      <!-- 页面标题 -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">用户社区</h1>
        <p class="text-gray-600 dark:text-gray-400">发现更多优秀的内容创作者</p>
      </div>

      <!-- 搜索和筛选 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6 mb-8">
        <div class="flex flex-col md:flex-row gap-4">
          <!-- 搜索框 -->
          <div class="flex-1">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="搜索用户名或显示名..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                @input="debouncedSearch"
              >
              <svg class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>

          <!-- 角色筛选 -->
          <div class="md:w-48">
            <select
              v-model="selectedRole"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              @change="filterUsers"
            >
              <option value="">所有角色</option>
              <option value="admin">管理员</option>
              <option value="author">作者</option>
              <option value="editor">编辑</option>
              <option value="subscriber">订阅者</option>
            </select>
          </div>

          <!-- 排序方式 -->
          <div class="md:w-48">
            <select
              v-model="sortBy"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              @change="sortUsers"
            >
              <option value="createdAt">注册时间</option>
              <option value="postsCount">文章数量</option>
              <option value="followersCount">粉丝数量</option>
              <option value="lastLoginAt">最后登录</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 加载状态 -->
      <Loading v-if="loading" />

      <!-- 错误信息 -->
      <ErrorMessage v-else-if="error" :message="error" />

      <!-- 用户列表 -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <UserCard 
          v-for="user in users" 
          :key="user.id" 
          :user="user"
          @click="navigateToUser(user.id)"
        />
      </div>

      <!-- 分页 -->
      <div v-if="pagination.total > 0" class="flex justify-center">
        <nav class="flex items-center space-x-2">
          <button
            :disabled="!pagination.hasPrev"
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
            @click="previousPage"
          >
            上一页
          </button>
          
          <span class="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
            第 {{ pagination.page }} 页，共 {{ pagination.pages }} 页
          </span>
          
          <button
            :disabled="!pagination.hasNext"
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
            @click="nextPage"
          >
            下一页
          </button>
        </nav>
      </div>

      <!-- 空状态 -->
      <div v-if="!loading && !error && users.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">暂无用户</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">没有找到符合条件的用户。</p>
      </div>
    </main>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
import type { PublicUser, UserQuery, UsersResponse } from '~/types/user'
import { useUsers } from '~/composables/useUser'
import { debounce } from '~/composables/useUtils'
import { formatters } from '~/utils/format'

// 组件导入
import Header from '~/components/layout/Header.vue'
import Footer from '~/components/layout/Footer.vue'
import Loading from '~/components/common/Loading.vue'
import ErrorMessage from '~/components/common/ErrorMessage.vue'

// API 和状态管理
const { getUsers } = useUsers()
const loading = ref(false)
const error = ref<string | null>(null)

// 响应式数据
const users = ref<PublicUser[]>([])
const searchQuery = ref('')
const selectedRole = ref('')
const sortBy = ref('createdAt')
const pagination = ref({
  page: 1,
  limit: 12,
  total: 0,
  pages: 0,
  hasNext: false,
  hasPrev: false
})

// 获取用户列表
const fetchUsers = async () => {
  loading.value = true
  error.value = null

  try {
    const query = {
      page: pagination.value.page,
      limit: pagination.value.limit,
      search: searchQuery.value,
      role: selectedRole.value,
      sortBy: sortBy.value
    }

    const result = await getUsers(query)
    users.value = result.data
    pagination.value = result.pagination
  } catch (err) {
    error.value = '获取用户列表失败'
    console.error(err)
  } finally {
    loading.value = false
  }
}

// 防抖搜索
const debouncedSearch = debounce(() => {
  pagination.value.page = 1
  fetchUsers()
}, 500)

// 筛选用户
const filterUsers = () => {
  pagination.value.page = 1
  fetchUsers()
}

// 排序用户
const sortUsers = () => {
  pagination.value.page = 1
  fetchUsers()
}

// 分页操作
const previousPage = () => {
  if (pagination.value.hasPrev) {
    pagination.value.page--
    fetchUsers()
  }
}

const nextPage = () => {
  if (pagination.value.hasNext) {
    pagination.value.page++
    fetchUsers()
  }
}

// 导航到用户详情
const navigateToUser = (userId: string) => {
  navigateTo(`/users/${userId}`)
}

// 页面初始化
onMounted(() => {
  fetchUsers()
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
