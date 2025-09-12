<template>
  <div class="space-y-6">
    <!-- 页面标题和操作 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">文章管理</h1>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          管理您的所有博客文章
        </p>
      </div>
      <UButton
        to="/admin/posts/new"
        icon="i-heroicons-plus"
        size="lg"
      >
        写新文章
      </UButton>
    </div>

    <!-- 搜索和筛选 -->
    <UCard class="bg-white dark:bg-gray-800">
      <div class="p-6">
        <div class="flex flex-col sm:flex-row gap-4">
          <!-- 搜索框 -->
          <div class="flex-1">
            <UInput
              v-model="searchQuery"
              placeholder="搜索文章标题、内容..."
              icon="i-heroicons-magnifying-glass"
              size="md"
              @input="handleSearch"
            />
          </div>
          
          <!-- 分类筛选 -->
          <USelect
            v-model="selectedCategory"
            :options="categoryOptions"
            placeholder="选择分类"
            size="md"
            @change="handleCategoryChange"
          />
          
          <!-- 状态筛选 -->
          <USelect
            v-model="selectedStatus"
            :options="statusOptions"
            placeholder="选择状态"
            size="md"
            @change="handleStatusChange"
          />
          
          <!-- 排序 -->
          <USelect
            v-model="sortBy"
            :options="sortOptions"
            size="md"
            @change="handleSortChange"
          />
        </div>
      </div>
    </UCard>

    <!-- 文章列表 -->
    <UCard class="bg-white dark:bg-gray-800">
      <div class="p-6">
        <!-- 加载状态 -->
        <div v-if="loading" class="flex justify-center py-8">
          <Icon name="i-heroicons-arrow-path" class="h-8 w-8 animate-spin text-gray-400" />
        </div>
        
        <!-- 空状态 -->
        <div v-else-if="!posts.length" class="text-center py-8">
          <Icon name="i-heroicons-document-text" class="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">暂无文章</h3>
          <p class="text-gray-500 dark:text-gray-400 mb-4">开始创建您的第一篇文章吧！</p>
          <UButton
            to="/admin/posts/new"
            icon="i-heroicons-plus"
          >
            写新文章
          </UButton>
        </div>
        
        <!-- 文章表格 -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  文章
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  分类
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  状态
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  数据
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  发布时间
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="(post, index) in posts"
                :key="index"
                class="hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <!-- 文章信息 -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <img
                      :src="post.cover || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop'"
                      :alt="post.title || ''"
                      class="h-12 w-16 rounded-lg object-cover"
                    />
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900 dark:text-white">
                        {{ post.title || '无标题' }}
                      </div>
                      <div class="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                        {{ post.description || '暂无描述' }}
                      </div>
                    </div>
                  </div>
                </td>
                
                <!-- 分类 -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <UBadge
                    :label="post.category || '未分类'"
                    color="primary"
                    variant="soft"
                  />
                </td>
                
                <!-- 状态 -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <UBadge
                    :label="getPostStatus(post)"
                    :color="getStatusColor(post)"
                    variant="soft"
                  />
                </td>
                
                <!-- 数据 -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <div class="space-y-1">
                    <div class="flex items-center">
                      <Icon name="i-heroicons-eye" class="h-4 w-4 mr-1" />
                      {{ (post as any).views || Math.floor(Math.random() * 500) + 100 }}
                    </div>
                    <div class="flex items-center">
                      <Icon name="i-heroicons-heart" class="h-4 w-4 mr-1" />
                      {{ (post as any).likes || Math.floor(Math.random() * 50) + 10 }}
                    </div>
                  </div>
                </td>
                
                <!-- 发布时间 -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ formatDate(post.publishedAt || new Date()) }}
                </td>
                
                <!-- 操作 -->
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <UDropdown :items="getPostActions(post, index)">
                    <UButton
                      variant="ghost"
                      size="sm"
                      icon="i-heroicons-ellipsis-horizontal"
                    />
                  </UDropdown>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- 分页 -->
        <div v-if="posts.length" class="mt-6 flex items-center justify-between">
          <div class="text-sm text-gray-500 dark:text-gray-400">
            显示第 {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, totalPosts) }} 项，共 {{ totalPosts }} 项
          </div>
          <UPagination
            v-model="currentPage"
            :page-count="totalPages"
            :total="totalPosts"
          />
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { useBlogStore } from '~/stores/blog'
import type { ContentPost } from '~/types'

// 设置布局
definePageMeta({
  layout: 'admin'
})

// 页面标题
useHead({
  title: '文章管理 - BlogFlow Admin'
})

// Store
const blogStore = useBlogStore()

// 响应式数据
const loading = ref(false)
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedStatus = ref('')
const sortBy = ref('publishedAt')
const currentPage = ref(1)
const pageSize = ref(10)

// 计算属性
const posts = computed(() => blogStore.filteredPosts)
const totalPosts = computed(() => posts.value.length)
const totalPages = computed(() => Math.ceil(totalPosts.value / pageSize.value))

// 选项数据
const categoryOptions = computed(() => [
  { label: '全部分类', value: '' },
  ...blogStore.categories.map(cat => ({ label: cat, value: cat }))
])

const statusOptions = [
  { label: '全部状态', value: '' },
  { label: '已发布', value: 'published' },
  { label: '草稿', value: 'draft' },
  { label: '待审核', value: 'pending' }
]

const sortOptions = [
  { label: '按发布时间', value: 'publishedAt' },
  { label: '按标题', value: 'title' },
  { label: '按阅读时间', value: 'readingTime' }
]

// 方法
const formatDate = (date: string | Date) => {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

const getPostStatus = (post: ContentPost) => {
  if (post.publishedAt && new Date(post.publishedAt) <= new Date()) {
    return '已发布'
  }
  return '草稿'
}

const getStatusColor = (post: ContentPost) => {
  const status = getPostStatus(post)
  return status === '已发布' ? 'success' : 'warning'
}

const getPostActions = (post: ContentPost, index: number) => [
  [{
    label: '查看',
    icon: 'i-heroicons-eye',
    click: () => viewPost(post)
  }],
  [{
    label: '编辑',
    icon: 'i-heroicons-pencil',
    click: () => editPost(post)
  }],
  [{
    label: '删除',
    icon: 'i-heroicons-trash',
    click: () => deletePost(post, index)
  }]
]

const viewPost = (post: ContentPost) => {
  // 在新标签页打开文章
  window.open(post.path, '_blank')
}

const editPost = (post: ContentPost) => {
  // 跳转到编辑页面
  navigateTo(`/admin/posts${post.path}`)
}

const deletePost = async (post: ContentPost, index: number) => {
  if (confirm('确定要删除这篇文章吗？此操作不可撤销。')) {
    try {
      // 这里应该调用删除 API
      console.log('删除文章:', post.path)
      // 临时从列表中移除
      blogStore.posts.splice(index, 1)
    } catch (error) {
      console.error('删除文章失败:', error)
    }
  }
}

// 事件处理
const handleSearch = useDebounceFn(() => {
  blogStore.searchQuery = searchQuery.value
  currentPage.value = 1
}, 300)

const handleCategoryChange = () => {
  blogStore.selectedCategory = selectedCategory.value
  currentPage.value = 1
}

const handleStatusChange = () => {
  // 根据状态筛选文章
  currentPage.value = 1
}

const handleSortChange = () => {
  blogStore.sortBy = sortBy.value
}

// 加载数据
const loadPosts = async () => {
  loading.value = true
  try {
    await blogStore.fetchAllPosts()
  } catch (error) {
    console.error('加载文章失败:', error)
  } finally {
    loading.value = false
  }
}

// 防抖函数
function useDebounceFn(fn: Function, delay: number) {
  let timeoutId: NodeJS.Timeout
  return (...args: any[]) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

// 页面挂载时加载数据
onMounted(() => {
  loadPosts()
})
</script>