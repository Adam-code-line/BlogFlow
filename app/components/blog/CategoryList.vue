<template>
  <div class="category-list">
    <!-- 分类标题 -->
    <div v-if="showTitle" class="mb-6">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {{ title }}
      </h2>
      <p v-if="description" class="text-gray-600 dark:text-gray-400 text-sm">
        {{ description }}
      </p>
    </div>

    <!-- 分类网格 -->
    <div v-if="categories.length > 0" :class="gridClasses">
      <Card
        v-for="category in categories"
        :key="category.name"
        :clickable="true"
        :hoverable="true"
        variant="bordered"
        class="group cursor-pointer transition-all duration-300 hover:border-blue-500/50 hover:shadow-lg"
        @click="handleCategoryClick(category)"
      >
        <!-- 分类图标和名称 -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-300">
                <Icon 
                  :name="category.icon || 'heroicons:tag'" 
                  class="w-6 h-6 text-white"
                />
              </div>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                {{ category.name }}
              </h3>
              <p v-if="category.description" class="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                {{ category.description }}
              </p>
            </div>
          </div>
          
          <!-- 文章数量 -->
          <div class="flex-shrink-0">
            <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 group-hover:bg-blue-100 group-hover:text-blue-800 dark:group-hover:bg-blue-900 dark:group-hover:text-blue-200 transition-colors duration-300">
              {{ category.count }} 篇
            </span>
          </div>
        </div>

        <!-- 最新文章预览 -->
        <div v-if="showRecentPosts && category.recentPosts && category.recentPosts.length > 0" class="space-y-2">
          <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">
            最新文章
          </h4>
          <div class="space-y-2">
            <div
              v-for="post in category.recentPosts.slice(0, 2)"
              :key="post.path"
              class="flex items-center space-x-2 text-sm"
            >
              <Icon name="heroicons:document-text" class="w-3 h-3 text-gray-400 flex-shrink-0" />
              <span class="text-gray-600 dark:text-gray-400 line-clamp-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                {{ post.title }}
              </span>
            </div>
          </div>
        </div>

        <!-- 分类标签 -->
        <div v-if="category.tags && category.tags.length > 0" class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div class="flex flex-wrap gap-1">
            <span
              v-for="tag in category.tags.slice(0, 3)"
              :key="tag"
              class="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
            >
              {{ tag }}
            </span>
            <span
              v-if="category.tags.length > 3"
              class="inline-flex items-center px-2 py-1 rounded text-xs text-gray-500 dark:text-gray-500"
            >
              +{{ category.tags.length - 3 }}
            </span>
          </div>
        </div>
      </Card>
    </div>

    <!-- 全部分类按钮 -->
    <div v-if="showAllButton && categories.length > 0" class="mt-6 text-center">
      <Button
        variant="outline"
        color="primary"
        @click="handleViewAll"
      >
        查看全部分类
        <Icon name="heroicons:arrow-right" class="w-4 h-4 ml-2" />
      </Button>
    </div>

    <!-- 空状态 -->
    <div v-else-if="!loading" class="text-center py-12">
      <Icon name="heroicons:tag" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        暂无分类
      </h3>
      <p class="text-gray-600 dark:text-gray-400">
        还没有创建任何文章分类
      </p>
    </div>

    <!-- 加载状态 -->
    <Loading 
      v-if="loading"
      :overlay="false"
      :centered="true"
      text="正在加载分类..."
      size="md"
    />
  </div>
</template>

<script setup lang="ts">
import type { ContentPost } from '~/types'

export interface Category {
  name: string
  slug: string
  description?: string
  icon?: string
  count: number
  tags?: string[]
  recentPosts?: ContentPost[]
  color?: string
}

interface CategoryListProps {
  // 分类数据
  categories: Category[]
  // 是否显示标题
  showTitle?: boolean
  // 标题文本
  title?: string
  // 描述文本
  description?: string
  // 是否显示最新文章
  showRecentPosts?: boolean
  // 是否显示查看全部按钮
  showAllButton?: boolean
  // 布局列数
  columns?: 1 | 2 | 3 | 4
  // 是否加载中
  loading?: boolean
}

interface CategoryListEmits {
  (e: 'category-click', category: Category): void
  (e: 'view-all'): void
}

const props = withDefaults(defineProps<CategoryListProps>(), {
  showTitle: true,
  title: '文章分类',
  description: '浏览不同主题的技术文章',
  showRecentPosts: true,
  showAllButton: false,
  columns: 2,
  loading: false,
})

const emit = defineEmits<CategoryListEmits>()

// 网格布局样式
const gridClasses = computed(() => {
  const baseClasses = 'grid gap-6'
  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  }
  return `${baseClasses} ${columnClasses[props.columns]}`
})

// 事件处理
const handleCategoryClick = (category: Category) => {
  emit('category-click', category)
}

const handleViewAll = () => {
  emit('view-all')
}
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.category-list {
  width: 100%;
}

/* 分类卡片悬停效果 */
.group:hover .w-12 {
  transform: scale(1.05);
}

/* 渐变动画 */
.bg-gradient-to-br {
  background-size: 200% 200%;
  animation: gradientShift 3s ease infinite;
}

@keyframes gradientShift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

/* 优化触摸设备体验 */
@media (hover: none) {
  .group:hover .w-12 {
    transform: none;
  }
  
  .bg-gradient-to-br {
    animation: none;
  }
}
</style>
