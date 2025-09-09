<template>
  <div class="space-y-8">
    <!-- 搜索和筛选 -->
    <div class="flex flex-col sm:flex-row gap-4 mb-8">
      <div class="flex-1">
        <UInput
          v-model="searchQuery"
          placeholder="搜索文章..."
          icon="i-heroicons-magnifying-glass"
          size="lg"
          class="w-full"
        />
      </div>
      <USelectMenu
        v-model="selectedCategory"
        :options="categoryOptions"
        placeholder="选择分类"
        size="lg"
        class="w-full sm:w-48"
      />
    </div>

    <!-- 文章网格 -->
    <div v-if="filteredPosts.length > 0" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      <BlogPostCard 
        v-for="post in paginatedPosts" 
        :key="post._path"
        :post="post"
      />
    </div>

    <!-- 空状态 -->
    <div v-else class="text-center py-16">
      <Icon name="heroicons:document-magnifying-glass" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">没有找到文章</h3>
      <p class="text-gray-600 dark:text-gray-400">
        {{ searchQuery ? '尝试使用不同的搜索词' : '暂时没有发布任何文章' }}
      </p>
    </div>

    <!-- 分页 -->
    <div v-if="totalPages > 1" class="flex justify-center mt-12">
      <UPagination
        v-model="currentPage"
        :page-count="pageSize"
        :total="filteredPosts.length"
      />
    </div>

    <!-- 加载状态 -->
    <div v-if="pending" class="flex justify-center py-8">
      <Icon name="heroicons:arrow-path" class="w-6 h-6 animate-spin text-blue-600" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  posts?: any[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  posts: () => [],
  loading: false
})

// 搜索和筛选状态
const searchQuery = ref('')
const selectedCategory = ref('')
const currentPage = ref(1)
const pageSize = 9

// 计算属性
const categoryOptions = computed(() => {
  const categories = [...new Set(props.posts.map(post => post.category).filter(Boolean))]
  return [
    { label: '全部分类', value: '' },
    ...categories.map(cat => ({ label: cat, value: cat }))
  ]
})

const filteredPosts = computed(() => {
  let filtered = props.posts.filter(post => !post.draft)
  
  // 按搜索词筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(post => 
      post.title?.toLowerCase().includes(query) ||
      post.description?.toLowerCase().includes(query) ||
      post.tags?.some((tag: string) => tag.toLowerCase().includes(query))
    )
  }
  
  // 按分类筛选
  if (selectedCategory.value) {
    filtered = filtered.filter(post => post.category === selectedCategory.value)
  }
  
  // 按发布时间排序
  return filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
})

const totalPages = computed(() => Math.ceil(filteredPosts.value.length / pageSize))

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredPosts.value.slice(start, end)
})

const pending = computed(() => props.loading)

// 监听搜索和分类变化，重置页码
watch([searchQuery, selectedCategory], () => {
  currentPage.value = 1
})
</script>