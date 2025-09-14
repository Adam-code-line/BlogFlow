<template>
  <aside class="w-full lg:w-80 flex-shrink-0">
    <div class="sticky top-20 space-y-6">
      
      <!-- 作者信息卡片 -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="text-center">
          <div class="relative inline-block mb-4">
            <img 
              :src="authorInfo.avatar" 
              :alt="authorInfo.name"
              class="w-20 h-20 rounded-full object-cover ring-4 ring-blue-100 dark:ring-blue-900"
            >
            <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full ring-2 ring-white dark:ring-gray-800 flex items-center justify-center">
              <Icon name="heroicons:check" class="w-3 h-3 text-white" />
            </div>
          </div>
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">{{ authorInfo.name }}</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">{{ authorInfo.title }}</p>
          <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">{{ authorInfo.bio }}</p>
          
          <!-- 统计信息 -->
          <StatisticsDisplay variant="sidebar" class="mb-4" />

          <!-- 社交链接 -->
          <div class="flex justify-center space-x-2">
            <a 
              v-for="social in authorInfo.socials" 
              :key="social.name"
              :href="social.url" 
              target="_blank"
              rel="noopener noreferrer"
              class="sidebar-social-link"
              :title="social.name"
            >
              <Icon :name="social.icon" class="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      <!-- 热门文章 -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <Icon name="heroicons:fire" class="w-5 h-5 text-orange-500 mr-2" />
          热门文章
        </h3>
        <div class="space-y-4">
          <article 
            v-for="(post, index) in popularPosts" 
            :key="post.slug"
            class="group cursor-pointer"
          >
            <NuxtLink :to="`/blog/${post.slug}`" class="block">
              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                  {{ index + 1 }}
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2">
                    {{ post.title }}
                  </h4>
                  <div class="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <Icon name="heroicons:eye" class="w-3 h-3 mr-1" />
                    <span>{{ post.views }}</span>
                    <span class="mx-2">•</span>
                    <span>{{ formatDate(post.date) }}</span>
                  </div>
                </div>
              </div>
            </NuxtLink>
          </article>
        </div>
      </div>

      <!-- 标签云 -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <Icon name="heroicons:tag" class="w-5 h-5 text-blue-500 mr-2" />
          热门标签
        </h3>
        <div class="flex flex-wrap gap-2">
          <NuxtLink
            v-for="tag in popularTags"
            :key="tag.name"
            :to="`/blog?tag=${encodeURIComponent(tag.name)}`"
            class="tag-link"
            :style="{ fontSize: `${Math.max(0.75, Math.min(1.2, tag.count / 10))}rem` }"
          >
            {{ tag.name }}
          </NuxtLink>
        </div>
      </div>

      <!-- 归档时间线 -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <Icon name="heroicons:calendar-days" class="w-5 h-5 text-purple-500 mr-2" />
          文章归档
        </h3>
        <div class="space-y-2">
          <div 
            v-for="archive in archiveData" 
            :key="archive.period"
            class="flex items-center justify-between text-sm"
          >
            <NuxtLink 
              :to="`/blog?period=${archive.period}`"
              class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            >
              {{ archive.label }}
            </NuxtLink>
            <span class="text-gray-500 dark:text-gray-400">({{ archive.count }})</span>
          </div>
        </div>
      </div>

    </div>
  </aside>
</template>

<script setup lang="ts">
import { useAuthorInfo, useSocialLinks } from '~/composables/useSiteConfig'
import { useFormatters } from '~/composables/useFormatters'
import { getPostsAction } from '~/composables/usePostActions'
import type { PostData } from '~/composables/usePostActions'
import { useStatisticsStore } from '~/stores/statistics'

// 从全局配置获取作者信息
const author = useAuthorInfo()
const socialLinks = useSocialLinks()
const statisticsStore = useStatisticsStore()

// 使用统一的格式化函数
const { formatDate } = useFormatters()

// 响应式数据
const posts = ref<PostData[]>([])
const loading = ref(true)

// 获取文章数据
const loadPosts = async () => {
  try {
    loading.value = true
    posts.value = await getPostsAction()
    // 更新统计数据
    await statisticsStore.fetchStatistics()
  } catch (error) {
    console.error('获取文章失败:', error)
  } finally {
    loading.value = false
  }
}

// 作者信息 - 使用全局配置
const authorInfo = computed(() => ({
  name: author.value.name,
  title: author.value.profession || '全栈开发者',
  bio: author.value.bio,
  avatar: author.value.avatar,
  socials: [
    {
      name: 'GitHub',
      url: socialLinks.value.github || 'https://github.com/Adam-code-line',
      icon: 'simple-icons:github'
    }
    // 其他社交媒体链接已移除，只保留GitHub
  ]
}))

// 热门文章
const popularPosts = [
  {
    title: 'Vue 3 Composition API 完全指南',
    slug: 'vue3-composition-api-guide',
    views: '2.1k',
    date: '2024-01-15'
  },
  {
    title: '前端工程化最佳实践',
    slug: 'frontend-engineering-guide',
    views: '1.8k',
    date: '2024-01-10'
  },
  {
    title: 'TypeScript 高级类型实战',
    slug: 'typescript-best-practices',
    views: '1.5k',
    date: '2024-01-05'
  },
  {
    title: 'Nuxt 3 博客开发教程',
    slug: 'nuxt-blog-tutorial',
    views: '1.2k',
    date: '2024-01-01'
  }
]

// 热门标签
const popularTags = [
  { name: 'Vue.js', count: 15 },
  { name: 'TypeScript', count: 12 },
  { name: 'JavaScript', count: 20 },
  { name: 'Nuxt.js', count: 8 },
  { name: '前端工程化', count: 10 },
  { name: 'CSS', count: 6 },
  { name: 'Node.js', count: 7 },
  { name: '性能优化', count: 5 }
]

// 动态归档数据 - 基于实际文章数据
const archiveData = computed(() => {
  if (!posts.value.length) return []
  
  const archives = new Map<string, number>()
  
  posts.value.forEach(post => {
    if (post.publishedAt) {
      const date = new Date(post.publishedAt)
      const period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      const label = `${date.getFullYear()}年${date.getMonth() + 1}月`
      archives.set(period, (archives.get(period) || 0) + 1)
    }
  })
  
  return Array.from(archives.entries())
    .map(([period, count]) => {
      const [year, month] = period.split('-')
      return {
        period,
        label: `${year}年${parseInt(month || '1')}月`,
        count
      }
    })
    .sort((a, b) => b.period.localeCompare(a.period))
    .slice(0, 6) // 只显示最近6个月
})

// 页面挂载时加载数据
onMounted(() => {
  loadPosts()
})
</script>

<style scoped>
/* 侧边栏社交链接 */
.sidebar-social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  color: rgb(107 114 128);
  background-color: rgb(243 244 246);
  transition: all 0.2s ease-in-out;
}

.dark .sidebar-social-link {
  color: rgb(156 163 175);
  background-color: rgb(55 65 81);
}

.sidebar-social-link:hover {
  color: rgb(37 99 235);
  background-color: rgb(219 234 254);
  transform: translateY(-1px);
}

.dark .sidebar-social-link:hover {
  color: rgb(96 165 250);
  background-color: rgb(30 58 138);
}

/* 标签链接 */
.tag-link {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  background-color: rgb(243 244 246);
  color: rgb(75 85 99);
  font-weight: 500;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
}

.dark .tag-link {
  background-color: rgb(55 65 81);
  color: rgb(209 213 219);
}

.tag-link:hover {
  background-color: rgb(37 99 235);
  color: white;
  transform: translateY(-1px);
}

/* 文本截断 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 粘性定位优化 */
.sticky {
  position: sticky;
}

/* 滚动行为优化 */
@media (prefers-reduced-motion: no-preference) {
  html {
    scroll-behavior: smooth;
  }
}
</style>