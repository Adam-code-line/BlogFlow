<template>
  <div class="post-list space-y-8">
    <!-- 列表头部 -->
    <div v-if="showHeader" class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h2 v-if="title" class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ title }}
        </h2>
        <p v-if="description" class="text-gray-600 dark:text-gray-400">
          {{ description }}
        </p>
      </div>
      
      <!-- 视图切换和排序 -->
      <div class="flex items-center gap-3">
        <!-- 视图切换 -->
        <div class="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            :class="[
              'p-2 rounded-md transition-colors duration-200',
              viewMode === 'grid' 
                ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            ]"
            @click="viewMode = 'grid'"
            title="网格视图"
          >
            <Icon name="heroicons:squares-2x2" class="w-4 h-4" />
          </button>
          <button
            :class="[
              'p-2 rounded-md transition-colors duration-200',
              viewMode === 'list' 
                ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            ]"
            @click="viewMode = 'list'"
            title="列表视图"
          >
            <Icon name="heroicons:list-bullet" class="w-4 h-4" />
          </button>
        </div>
        
        <!-- 排序选择 -->
        <select
          v-model="sortBy"
          class="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="publishedAt">发布时间</option>
          <option value="title">标题</option>
          <option value="views">浏览量</option>
          <option value="likes">点赞数</option>
        </select>
      </div>
    </div>

    <!-- 搜索和筛选 -->
    <div class="flex flex-col lg:flex-row gap-4 mb-8">
      <!-- 搜索框 -->
      <div class="flex-1 relative">
        <Icon name="heroicons:magnifying-glass" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索文章标题、内容或标签..."
          class="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
          @input="debouncedSearch"
        />
        <button
          v-if="searchQuery"
          @click="clearSearch"
          class="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <Icon name="heroicons:x-mark" class="w-4 h-4" />
        </button>
      </div>

      <!-- 分类筛选 -->
      <div class="flex flex-wrap gap-2 lg:w-auto">
        <button
          :class="[
            'px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200',
            !selectedCategory 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          ]"
          @click="selectedCategory = ''"
        >
          全部
        </button>
        <button
          v-for="category in availableCategories"
          :key="category"
          :class="[
            'px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200',
            selectedCategory === category 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          ]"
          @click="selectedCategory = category || ''"
        >
          {{ category }}
          <span class="ml-1 text-xs opacity-75">
            ({{ getCategoryCount(category || '') }})
          </span>
        </button>
      </div>
    </div>

    <!-- 筛选结果统计 -->
    <div v-if="searchQuery || selectedCategory" class="flex items-center justify-between py-3 px-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
      <div class="flex items-center space-x-2 text-sm text-blue-800 dark:text-blue-200">
        <Icon name="heroicons:funnel" class="w-4 h-4" />
        <span>
          找到 <strong>{{ filteredPosts.length }}</strong> 篇文章
          <span v-if="searchQuery">包含 "{{ searchQuery }}"</span>
          <span v-if="selectedCategory">在 "{{ selectedCategory }}" 分类中</span>
        </span>
      </div>
      <button
        @click="clearFilters"
        class="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 font-medium"
      >
        清除筛选
      </button>
    </div>

    <!-- 文章列表/网格 -->
    <div v-if="paginatedPosts.length > 0">
      <!-- 网格视图 -->
      <div v-if="viewMode === 'grid'" :class="gridClasses">
        <PostCard 
          v-for="post in paginatedPosts" 
          :key="post.path"
          :post="post"
          :view-mode="viewMode"
          @click="handlePostClick(post)"
        />
      </div>
      
      <!-- 列表视图 -->
      <div v-else class="space-y-4">
        <PostCard 
          v-for="post in paginatedPosts" 
          :key="post.path"
          :post="post"
          :view-mode="viewMode"
          @click="handlePostClick(post)"
        />
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else-if="!loading" class="text-center py-16">
      <Icon 
        :name="searchQuery || selectedCategory ? 'heroicons:magnifying-glass' : 'heroicons:document-text'"
        class="w-16 h-16 text-gray-400 mx-auto mb-4" 
      />
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {{ searchQuery || selectedCategory ? '没有找到匹配的文章' : '暂无文章' }}
      </h3>
      <p class="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
        {{ 
          searchQuery || selectedCategory 
            ? '尝试使用不同的搜索词或筛选条件' 
            : '还没有发布任何文章，敬请期待精彩内容！' 
        }}
      </p>
      <div v-if="searchQuery || selectedCategory" class="mt-6">
        <Button variant="outline" @click="clearFilters">
          清除筛选条件
        </Button>
      </div>
    </div>

    <!-- 分页 -->
    <div v-if="totalPages > 1" class="flex flex-col sm:flex-row items-center justify-between mt-12 gap-4">
      <!-- 分页信息 -->
      <div class="text-sm text-gray-600 dark:text-gray-400">
        显示第 {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, filteredPosts.length) }} 条，
        共 {{ filteredPosts.length }} 条结果
      </div>
      
      <!-- 分页控件 -->
      <div class="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          :disabled="currentPage === 1"
          @click="currentPage = Math.max(1, currentPage - 1)"
        >
          <Icon name="heroicons:chevron-left" class="w-4 h-4" />
          上一页
        </Button>
        
        <div class="flex items-center space-x-1">
          <template v-for="page in visiblePages" :key="page">
            <Button
              v-if="page !== '...'"
              :variant="page === currentPage ? 'solid' : 'ghost'"
              size="sm"
              class="min-w-[2.5rem]"
              @click="typeof page === 'number' && (currentPage = page)"
            >
              {{ page }}
            </Button>
            <span v-else class="px-2 text-gray-400">...</span>
          </template>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          :disabled="currentPage === totalPages"
          @click="currentPage = Math.min(totalPages, currentPage + 1)"
        >
          下一页
          <Icon name="heroicons:chevron-right" class="w-4 h-4" />
        </Button>
      </div>
    </div>

    <!-- 加载状态 -->
    <Loading 
      v-if="loading"
      :overlay="false"
      :centered="true"
      text="正在加载文章..."
      size="lg"
    />
  </div>
</template>

<script setup lang="ts">
import type { ContentPost } from '~/types'
import { debounce } from '~/composables/useUtils'

interface PostListProps {
  // 文章数据
  posts?: ContentPost[]
  // 是否显示头部
  showHeader?: boolean
  // 标题
  title?: string
  // 描述
  description?: string
  // 默认视图模式
  defaultViewMode?: 'grid' | 'list'
  // 网格列数
  gridColumns?: 2 | 3 | 4
  // 每页文章数
  pageSize?: number
  // 是否加载中
  loading?: boolean
  // 是否启用搜索
  enableSearch?: boolean
  // 是否启用分类筛选
  enableCategoryFilter?: boolean
  // 是否启用排序
  enableSort?: boolean
}

interface PostListEmits {
  (e: 'post-click', post: ContentPost): void
  (e: 'search', query: string): void
  (e: 'category-change', category: string): void
  (e: 'sort-change', sortBy: string): void
}

const props = withDefaults(defineProps<PostListProps>(), {
  posts: () => [],
  showHeader: true,
  title: '文章列表',
  description: '浏览最新的技术文章和分享',
  defaultViewMode: 'grid',
  gridColumns: 3,
  pageSize: 9,
  loading: false,
  enableSearch: true,
  enableCategoryFilter: true,
  enableSort: true,
})

const emit = defineEmits<PostListEmits>()

// 响应式状态
const searchQuery = ref('')
const selectedCategory = ref('')
const currentPage = ref(1)
const sortBy = ref('publishedAt')
const viewMode = ref(props.defaultViewMode)

// 内部搜索状态
const internalSearchQuery = ref('')

// 防抖搜索
const debouncedSearch = debounce((event: Event) => {
  const target = event.target as HTMLInputElement
  internalSearchQuery.value = target.value
  searchQuery.value = target.value
  emit('search', target.value)
}, 300)

// 计算属性
const availableCategories = computed(() => {
  const categories = [...new Set(props.posts.map(post => post.category).filter(Boolean))] as string[]
  return categories.sort()
})

const getCategoryCount = (category: string): number => {
  return props.posts.filter(post => post.category === category).length
}

const gridClasses = computed(() => {
  const baseClasses = 'grid gap-6'
  const columnClasses = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  }
  return `${baseClasses} ${columnClasses[props.gridColumns]}`
})

const sortedPosts = computed(() => {
  let sorted = [...props.posts]
  
  switch (sortBy.value) {
    case 'title':
      sorted = sorted.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
      break
    case 'views':
      sorted = sorted.sort((a, b) => ((b as any).views || 0) - ((a as any).views || 0))
      break
    case 'likes':
      sorted = sorted.sort((a, b) => ((b as any).likes || 0) - ((a as any).likes || 0))
      break
    case 'publishedAt':
    default:
      sorted = sorted.sort((a, b) => {
        const dateA = new Date(a.publishedAt || a.createdAt || 0)
        const dateB = new Date(b.publishedAt || b.createdAt || 0)
        return dateB.getTime() - dateA.getTime()
      })
      break
  }
  
  return sorted
})

const filteredPosts = computed(() => {
  let filtered = sortedPosts.value.filter(post => !post.draft)
  
  // 搜索筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(post => 
      post.title?.toLowerCase().includes(query) ||
      post.description?.toLowerCase().includes(query) ||
      post.excerpt?.toLowerCase().includes(query) ||
      post.tags?.some((tag: string) => tag.toLowerCase().includes(query))
    )
  }
  
  // 分类筛选
  if (selectedCategory.value) {
    filtered = filtered.filter(post => post.category === selectedCategory.value)
  }
  
  return filtered
})

const totalPages = computed(() => Math.ceil(filteredPosts.value.length / props.pageSize))

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * props.pageSize
  const end = start + props.pageSize
  return filteredPosts.value.slice(start, end)
})

// 分页显示逻辑
const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 7) {
    // 总页数少于等于7，显示所有页码
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // 总页数大于7，智能显示页码
    if (current <= 4) {
      // 当前页在前4页
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      // 当前页在后4页
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      // 当前页在中间
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }
  
  return pages
})

// 方法
const clearSearch = () => {
  searchQuery.value = ''
  internalSearchQuery.value = ''
  emit('search', '')
}

const clearFilters = () => {
  searchQuery.value = ''
  internalSearchQuery.value = ''
  selectedCategory.value = ''
  currentPage.value = 1
  emit('search', '')
  emit('category-change', '')
}

const handlePostClick = (post: ContentPost) => {
  emit('post-click', post)
  // 默认导航行为
  if (process.client) {
    navigateTo(post.path)
  }
}

// 监听器
watch([searchQuery, selectedCategory], () => {
  currentPage.value = 1
})

watch(selectedCategory, (newCategory) => {
  emit('category-change', newCategory)
})

watch(sortBy, (newSortBy) => {
  emit('sort-change', newSortBy)
})

// 生命周期
onMounted(() => {
  // 从URL查询参数恢复状态
  if (process.client) {
    const urlParams = new URLSearchParams(window.location.search)
    const category = urlParams.get('category')
    const search = urlParams.get('search')
    const page = urlParams.get('page')
    
    if (category) selectedCategory.value = category
    if (search) {
      searchQuery.value = search
      internalSearchQuery.value = search
    }
    if (page) currentPage.value = parseInt(page) || 1
  }
})
</script>