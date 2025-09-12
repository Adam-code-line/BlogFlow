<template>
  <Card
    :clickable="true"
    :hoverable="true"
    variant="bordered"
    :class="cardClasses"
    @click="handleClick"
  >
    <!-- 网格视图 -->
    <template v-if="viewMode === 'grid'">
      <!-- 文章封面 -->
      <div v-if="showCover && (post.cover || post.seo?.ogImage)" class="relative overflow-hidden rounded-t-lg mb-4 group">
        <img
          :src="post.cover || post.seo?.ogImage"
          :alt="post.title"
          class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <!-- 分类标签 -->
        <div v-if="post.category" class="absolute top-3 left-3">
          <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-600 text-white shadow-lg">
            {{ post.category }}
          </span>
        </div>
        <!-- 特色标识 -->
        <div v-if="post.featured" class="absolute top-3 right-3">
          <Icon name="heroicons:star" class="w-5 h-5 text-yellow-400 fill-current" />
        </div>
      </div>
      
      <!-- 无图片时的占位 -->
      <div v-else-if="showCover" class="w-full h-48 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center mb-4">
        <Icon name="heroicons:document-text" class="w-16 h-16 text-white opacity-80" />
      </div>

      <!-- 文章内容 -->
      <div :class="showCover ? 'px-6 pb-6' : 'p-6'">
        <!-- 分类和日期（无封面时显示） -->
        <div v-if="!showCover" class="flex items-center justify-between mb-3">
          <span v-if="post.category" class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {{ post.category }}
          </span>
          <time class="text-xs text-gray-500 dark:text-gray-400">
            {{ formatDate(post.publishedAt || post.createdAt) }}
          </time>
        </div>

        <!-- 标题 -->
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
          {{ post.title }}
        </h3>

        <!-- 描述 -->
        <p v-if="post.description" class="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
          {{ post.description }}
        </p>

        <!-- 标签 -->
        <div v-if="showTags && post.tags && post.tags.length > 0" class="flex flex-wrap gap-1 mb-4">
          <span
            v-for="tag in post.tags.slice(0, 3)"
            :key="tag"
            class="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
          >
            #{{ tag }}
          </span>
          <span
            v-if="post.tags.length > 3"
            class="inline-flex items-center px-2 py-1 rounded text-xs text-gray-500 dark:text-gray-500"
          >
            +{{ post.tags.length - 3 }}
          </span>
        </div>

        <!-- 文章底部信息 -->
        <div class="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <div class="flex items-center space-x-2">
            <img 
              :src="post.author?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'"
              :alt="post.author?.name || 'Author'"
              class="w-6 h-6 rounded-full"
            />
            <span class="text-sm text-gray-600 dark:text-gray-400">
              {{ post.author?.name || 'BlogFlow Author' }}
            </span>
          </div>
          <div class="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
            <!-- 阅读时间 -->
            <div class="flex items-center space-x-1">
              <Icon name="heroicons:clock" class="w-3 h-3" />
              <span>{{ post.readingTime || 5 }}分钟</span>
            </div>
            
            <!-- 统计信息 -->
            <div v-if="showStats && (post as any).views" class="flex items-center space-x-1">
              <Icon name="heroicons:eye" class="w-3 h-3" />
              <span>{{ formatNumber((post as any).views) }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- 列表视图 -->
    <template v-else>
      <div class="flex gap-4 p-6">
        <!-- 文章封面（列表视图较小） -->
        <div v-if="showCover && (post.cover || post.seo?.ogImage)" class="flex-shrink-0">
          <img
            :src="post.cover || post.seo?.ogImage"
            :alt="post.title"
            class="w-24 h-24 object-cover rounded-lg"
            loading="lazy"
          />
        </div>
        
        <!-- 无图片时的占位（列表视图） -->
        <div v-else-if="showCover" class="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <Icon name="heroicons:document-text" class="w-8 h-8 text-white opacity-80" />
        </div>

        <!-- 文章内容 -->
        <div class="flex-1 min-w-0">
          <!-- 标题和分类 -->
          <div class="flex items-start justify-between mb-2">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
              {{ post.title }}
            </h3>
            <div class="flex items-center space-x-2 ml-4">
              <span v-if="post.category" class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 whitespace-nowrap">
                {{ post.category }}
              </span>
              <Icon v-if="post.featured" name="heroicons:star" class="w-4 h-4 text-yellow-400 fill-current flex-shrink-0" />
            </div>
          </div>

          <!-- 描述 -->
          <p v-if="post.description" class="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
            {{ post.description }}
          </p>

          <!-- 标签和元信息 -->
          <div class="flex items-center justify-between">
            <!-- 标签 -->
            <div v-if="showTags && post.tags && post.tags.length > 0" class="flex flex-wrap gap-1">
              <span
                v-for="tag in post.tags.slice(0, 2)"
                :key="tag"
                class="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
              >
                #{{ tag }}
              </span>
              <span
                v-if="post.tags.length > 2"
                class="inline-flex items-center px-2 py-1 rounded text-xs text-gray-500 dark:text-gray-500"
              >
                +{{ post.tags.length - 2 }}
              </span>
            </div>

            <!-- 元信息 -->
            <div class="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
              <!-- 发布时间 -->
              <div class="flex items-center space-x-1">
                <Icon name="heroicons:clock" class="w-3 h-3" />
                <span>{{ formatDate(post.publishedAt || post.createdAt) }}</span>
              </div>
              
              <!-- 统计信息 -->
              <div v-if="showStats && (post as any).views" class="flex items-center space-x-1">
                <Icon name="heroicons:eye" class="w-3 h-3" />
                <span>{{ formatNumber((post as any).views) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import type { ContentPost } from '~/types'

interface PostCardProps {
  // 文章数据
  post: ContentPost
  // 视图模式
  viewMode?: 'grid' | 'list'
  // 是否显示封面图
  showCover?: boolean
  // 是否显示标签
  showTags?: boolean
  // 是否显示统计信息
  showStats?: boolean
}

interface PostCardEmits {
  (e: 'click', post: ContentPost): void
}

const props = withDefaults(defineProps<PostCardProps>(), {
  viewMode: 'grid',
  showCover: true,
  showTags: true,
  showStats: true,
})

const emit = defineEmits<PostCardEmits>()

// 卡片样式
const cardClasses = computed(() => {
  const baseClasses = [
    'group cursor-pointer transition-all duration-300',
    'hover:border-blue-500/50 hover:shadow-lg'
  ]
  
  if (props.viewMode === 'list') {
    baseClasses.push('hover:shadow-md')
  }
  
  return baseClasses.join(' ')
})

// 格式化日期
function formatDate(dateString: string | Date | undefined): string {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 格式化数字
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

// 点击事件处理
const handleClick = () => {
  emit('click', props.post)
  // 默认导航行为
  const path = props.post.path || `/blog/${props.post.path?.replace('/blog/', '') || ''}`
  navigateTo(path)
}
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