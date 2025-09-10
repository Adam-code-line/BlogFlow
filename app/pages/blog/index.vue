<template>
  <NuxtLayout name="blog">
    <!-- 页面头部 -->
    <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 py-16 sm:py-20">
        <div class="text-center">
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            博客文章
          </h1>
          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            探索技术世界，分享开发经验，记录学习心得
          </p>
        </div>
      </div>
    </header>

    <!-- 主要内容 -->
    <main class="max-w-7xl mx-auto px-4 py-12">
      <!-- 搜索和筛选 -->
      <div class="mb-8">
        <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
          <!-- 搜索框 -->
          <div class="w-full md:w-96">
            <UInput
              v-model="searchQuery"
              placeholder="搜索文章..."
              icon="i-heroicons-magnifying-glass"
              size="lg"
            />
          </div>
          
          <!-- 分类筛选 -->
          <div class="flex gap-2 flex-wrap">
            <UButton
              :variant="selectedCategory === '' ? 'solid' : 'ghost'"
              color="primary"
              @click="selectedCategory = ''"
            >
              全部
            </UButton>
            <UButton
              v-for="category in categories"
              :key="String(category)"
              :variant="selectedCategory === category ? 'solid' : 'ghost'"
              color="neutral"
              @click="selectedCategory = String(category)"
            >
              {{ category }}
            </UButton>
          </div>
        </div>
      </div>

      <!-- 文章列表 -->
      <div v-if="filteredPosts.length > 0" class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <article 
          v-for="post in filteredPosts" 
          :key="post.path"
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <!-- 文章封面 -->
          <div v-if="post.cover" class="aspect-video overflow-hidden">
            <NuxtImg
              :src="post.cover"
              :alt="post.title"
              class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>

          <!-- 文章内容 -->
          <div class="p-6">
            <!-- 分类和阅读时间 -->
            <div class="flex items-center justify-between mb-3">
              <UBadge 
                :label="post.category" 
                variant="subtle" 
                color="primary"
                size="sm"
              />
              <div class="flex items-center text-sm text-gray-500">
                <Icon name="heroicons:clock" class="w-4 h-4 mr-1" />
                {{ post.readingTime || 5 }} 分钟
              </div>
            </div>

            <!-- 文章标题 -->
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
              <NuxtLink 
                :to="post.path"
                class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {{ post.title }}
              </NuxtLink>
            </h2>

            <!-- 文章描述 -->
            <p class="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
              {{ post.description }}
            </p>

            <!-- 文章元信息 -->
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <img 
                  :src="post.author?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'"
                  :alt="post.author?.name || 'Author'"
                  class="w-8 h-8 rounded-full mr-3"
                >
                <div>
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ post.author?.name || 'BlogFlow Author' }}
                  </div>
                  <div class="text-xs text-gray-500">
                    {{ formatDate(post.publishedAt || '') }}
                  </div>
                </div>
              </div>

              <!-- 特色标识 -->
              <UBadge 
                v-if="post.featured"
                label="精选"
                variant="solid"
                color="warning"
                size="sm"
              />
            </div>

            <!-- 标签 -->
            <div v-if="post.tags?.length" class="flex flex-wrap gap-1 mt-4">
              <UBadge 
                v-for="tag in post.tags?.slice(0, 3)" 
                :key="tag"
                :label="tag"
                variant="soft"
                color="neutral"
                size="xs"
              />
            </div>
          </div>
        </article>
      </div>

      <!-- 空状态 -->
      <div v-else class="text-center py-12">
        <Icon name="heroicons:document-text" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          没有找到相关文章
        </h3>
        <p class="text-gray-600 dark:text-gray-300">
          试试调整搜索条件或浏览其他分类
        </p>
      </div>

      <!-- 分页 -->
      <div v-if="totalPages > 1" class="mt-12 flex justify-center">
        <nav class="flex space-x-2">
          <UButton 
            v-for="page in totalPages" 
            :key="page"
            :variant="currentPage === page ? 'solid' : 'ghost'"
            :color="currentPage === page ? 'primary' : 'neutral'"
            @click="currentPage = page"
            size="sm"
          >
            {{ page }}
          </UButton>
        </nav>
      </div>
    </main>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { ContentPost } from '~/types'
import { useBlogPosts, useFormatDate } from '~/composables/useContent'

// 页面元数据
useSeoMeta({
  title: '博客文章 - BlogFlow',
  description: '浏览我的最新技术文章和思考，涵盖前端开发、Vue.js、Nuxt.js、TypeScript 等技术主题。',
  ogTitle: '博客文章 - BlogFlow',
  ogDescription: '浏览我的最新技术文章和思考，涵盖前端开发、Vue.js、Nuxt.js、TypeScript 等技术主题。'
})

// 使用 composables
const blogAPI = useBlogPosts()
const { formatDate } = useFormatDate()

// 获取所有博客文章
const allPosts = await blogAPI.getAllPosts()

// 响应式数据
const searchQuery = ref('')
const selectedCategory = ref('')
const currentPage = ref(1)
const postsPerPage = 9

// 计算属性
const categories = computed(() => blogAPI.getCategories(allPosts))

const filteredPosts = computed(() => {
  let posts = allPosts

  // 分类筛选
  if (selectedCategory.value) {
    posts = blogAPI.filterByCategory(posts, selectedCategory.value)
  }

  // 搜索筛选
  if (searchQuery.value) {
    posts = blogAPI.filterBySearch(posts, searchQuery.value)
  }

  // 分页
  return blogAPI.paginate(posts, currentPage.value, postsPerPage)
})

const totalPages = computed(() => {
  let posts = allPosts

  if (selectedCategory.value) {
    posts = blogAPI.filterByCategory(posts, selectedCategory.value)
  }

  if (searchQuery.value) {
    posts = blogAPI.filterBySearch(posts, searchQuery.value)
  }

  return Math.ceil(posts.length / postsPerPage)
})

// 监听筛选条件变化，重置分页
watch([searchQuery, selectedCategory], () => {
  currentPage.value = 1
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>