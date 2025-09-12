<template>
  <NuxtLayout name="blog">
    <!-- 分类头部 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
      <div class="px-6 py-8">
        <!-- 返回按钮 -->
        <div class="mb-6">
          <Button
            variant="ghost"
            size="sm"
            icon="heroicons:arrow-left"
            to="/blog"
          >
            返回博客
          </Button>
        </div>

        <!-- 分类标题和信息 -->
        <div class="flex items-start space-x-4">
          <div class="flex-shrink-0">
            <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Icon :name="categoryIcon" class="w-8 h-8 text-white" />
            </div>
          </div>
          <div class="flex-1">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {{ categoryName }}
            </h1>
            <p v-if="categoryDescription" class="text-gray-600 dark:text-gray-400 mb-4">
              {{ categoryDescription }}
            </p>
            <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div class="flex items-center space-x-1">
                <Icon name="heroicons:document-text" class="w-4 h-4" />
                <span>{{ filteredPosts.length }} 篇文章</span>
              </div>
              <div v-if="totalReadingTime > 0" class="flex items-center space-x-1">
                <Icon name="heroicons:clock" class="w-4 h-4" />
                <span>约 {{ totalReadingTime }} 分钟阅读</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="space-y-8">
      <!-- 文章列表 -->
      <PostList
        :posts="filteredPosts"
        :show-header="false"
        :enable-search="true"
        :enable-category-filter="false"
        :enable-sort="true"
        :default-view-mode="'grid'"
        :grid-columns="2"
        :page-size="12"
        @post-click="handlePostClick"
        @search="handleSearch"
        @sort-change="handleSortChange"
      />

      <!-- 相关分类 -->
      <!-- 相关分类 -->
      <div v-if="relatedCategories.length > 0" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">相关分类</h3>
        <CategoryList
          :categories="relatedCategories"
          :show-title="false"
          :columns="2"
          :show-recent-posts="false"
          @category-click="handleCategoryClick"
        />
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { ContentPost } from '~/types'
import type { Category } from '~/components/blog/CategoryList.vue'
import { useBlogPosts } from '~/composables/useContent'

const route = useRoute()
const categorySlug = computed(() => (route.params as { name: string }).name)

// 使用 composables
const blogAPI = useBlogPosts()

// 获取所有博客文章
const allPosts = await blogAPI.getAllPosts()

// 分类映射配置
const categoryConfig: Record<string, {
  name: string
  description: string
  icon: string
}> = {
  '前端开发': {
    name: '前端开发',
    description: '前端技术、框架和工具的最新动态，包括 Vue.js、React、JavaScript、CSS 等技术分享',
    icon: 'heroicons:code-bracket'
  },
  '后端开发': {
    name: '后端开发',
    description: '服务器端开发技术和架构设计，涵盖 Node.js、Python、数据库、API 设计等内容',
    icon: 'heroicons:server'
  },
  '前端工程化': {
    name: '前端工程化',
    description: '现代前端开发工程化实践，包括构建工具、部署流程、代码规范等最佳实践',
    icon: 'heroicons:cog-6-tooth'
  },
  'JavaScript': {
    name: 'JavaScript',
    description: 'JavaScript 语言特性、最佳实践、新特性解析和实战技巧分享',
    icon: 'simple-icons:javascript'
  },
  'Vue.js': {
    name: 'Vue.js',
    description: 'Vue.js 框架深度解析，包括 Vue 3、Composition API、Nuxt.js 等相关技术',
    icon: 'simple-icons:vuedotjs'
  },
  'TypeScript': {
    name: 'TypeScript',
    description: 'TypeScript 类型系统、高级特性和实战应用，提升代码质量和开发效率',
    icon: 'simple-icons:typescript'
  },
  '生活感悟': {
    name: '生活感悟',
    description: '技术之外的思考和感悟，关于学习、成长、工作和生活的分享',
    icon: 'heroicons:heart'
  },
  '工具推荐': {
    name: '工具推荐',
    description: '提高开发效率的工具、插件、应用推荐和使用技巧分享',
    icon: 'heroicons:wrench-screwdriver'
  }
}

// 解码分类名称
const categoryName = computed(() => {
  const decoded = decodeURIComponent(categorySlug.value)
  return categoryConfig[decoded]?.name || decoded
})

const categoryDescription = computed(() => {
  const decoded = decodeURIComponent(categorySlug.value)
  return categoryConfig[decoded]?.description || ''
})

const categoryIcon = computed(() => {
  const decoded = decodeURIComponent(categorySlug.value)
  return categoryConfig[decoded]?.icon || 'heroicons:tag'
})

// 筛选当前分类的文章
const filteredPosts = computed(() => {
  const decoded = decodeURIComponent(categorySlug.value)
  return allPosts.filter(post => post.category === decoded)
})

// 计算总阅读时间
const totalReadingTime = computed(() => {
  return filteredPosts.value.reduce((total, post) => {
    return total + (post.readingTime || 5)
  }, 0)
})

// 获取相关分类
const relatedCategories = computed((): Category[] => {
  const allCategories = blogAPI.getCategories(allPosts)
  const currentCategory = decodeURIComponent(categorySlug.value)
  
  return allCategories
    .filter(cat => cat !== currentCategory)
    .slice(0, 6)
    .map(cat => {
      const config = categoryConfig[cat] || { name: cat, description: '', icon: 'heroicons:tag' }
      const categoryPosts = allPosts.filter(post => post.category === cat)
      
      return {
        name: config.name,
        slug: cat,
        description: config.description,
        icon: config.icon,
        count: categoryPosts.length,
        tags: [...new Set(categoryPosts.flatMap(post => post.tags || []))].slice(0, 4),
        recentPosts: categoryPosts.slice(0, 2)
      }
    })
})

// 响应式状态
const searchQuery = ref('')
const sortBy = ref('publishedAt')

// 事件处理
const handlePostClick = (post: ContentPost) => {
  navigateTo(post.path)
}

const handleSearch = (query: string) => {
  searchQuery.value = query
  // 可以添加搜索逻辑
}

const handleSortChange = (sort: string) => {
  sortBy.value = sort
  // 可以添加排序逻辑
}

const handleCategoryClick = (category: Category) => {
  navigateTo(`/blog/category/${encodeURIComponent(category.slug)}`)
}

// 404 处理
if (filteredPosts.value.length === 0 && !categoryConfig[decodeURIComponent(categorySlug.value)]) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Category not found'
  })
}

// SEO 设置
useSeoMeta({
  title: `${categoryName.value} - BlogFlow`,
  description: categoryDescription.value || `浏览 ${categoryName.value} 分类下的所有文章`,
  ogTitle: `${categoryName.value} - BlogFlow`,
  ogDescription: categoryDescription.value || `浏览 ${categoryName.value} 分类下的所有文章`,
})
</script>