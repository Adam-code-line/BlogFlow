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
          <div class="grid grid-cols-3 gap-4 mb-4">
            <div class="text-center">
              <div class="text-lg font-bold text-gray-900 dark:text-white">{{ stats.posts }}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">文章</div>
            </div>
            <div class="text-center">
              <div class="text-lg font-bold text-gray-900 dark:text-white">{{ stats.views }}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">浏览</div>
            </div>
            <div class="text-center">
              <div class="text-lg font-bold text-gray-900 dark:text-white">{{ stats.likes }}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">点赞</div>
            </div>
          </div>

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

      <!-- 最新评论 -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <Icon name="heroicons:chat-bubble-left-ellipsis" class="w-5 h-5 text-green-500 mr-2" />
          最新评论
        </h3>
        <div class="space-y-4">
          <div 
            v-for="comment in recentComments" 
            :key="comment.id"
            class="border-l-2 border-gray-200 dark:border-gray-600 pl-3"
          >
            <div class="flex items-center space-x-2 mb-1">
              <img 
                :src="comment.author.avatar" 
                :alt="comment.author.name"
                class="w-6 h-6 rounded-full"
              >
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ comment.author.name }}</span>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{{ comment.content }}</p>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ formatDate(comment.date) }} • 
              <NuxtLink :to="`/blog/${comment.postSlug}`" class="hover:text-blue-600 dark:hover:text-blue-400">
                {{ comment.postTitle }}
              </NuxtLink>
            </div>
          </div>
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
import { DateFormatter } from '~/utils/format'

// 作者信息
const authorInfo = {
  name: 'BlogFlow',
  title: '全栈开发者',
  bio: '专注于现代Web开发技术，分享前端、后端和架构相关的经验与思考。',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
  socials: [
    {
      name: 'GitHub',
      url: 'https://github.com',
      icon: 'simple-icons:github'
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com',
      icon: 'simple-icons:twitter'
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com',
      icon: 'simple-icons:linkedin'
    },
    {
      name: 'Email',
      url: 'mailto:contact@blogflow.com',
      icon: 'heroicons:envelope'
    }
  ]
}

// 统计数据
const stats = {
  posts: 42,
  views: '12.5k',
  likes: '2.1k'
}

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

// 最新评论
const recentComments = [
  {
    id: '1',
    author: {
      name: '张三',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face'
    },
    content: '这篇文章写得很详细，对我的项目很有帮助！',
    date: '2024-01-20',
    postTitle: 'Vue 3 组合式API指南',
    postSlug: 'vue3-composition-api-guide'
  },
  {
    id: '2',
    author: {
      name: '李四',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face'
    },
    content: '能否详细介绍一下TypeScript的高级类型？',
    date: '2024-01-19',
    postTitle: 'TypeScript 最佳实践',
    postSlug: 'typescript-best-practices'
  },
  {
    id: '3',
    author: {
      name: '王五',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face'
    },
    content: '期待更多关于前端工程化的文章！',
    date: '2024-01-18',
    postTitle: '前端工程化指南',
    postSlug: 'frontend-engineering-guide'
  }
]

// 归档数据
const archiveData = [
  { period: '2024-01', label: '2024年1月', count: 8 },
  { period: '2023-12', label: '2023年12月', count: 6 },
  { period: '2023-11', label: '2023年11月', count: 5 },
  { period: '2023-10', label: '2023年10月', count: 7 },
  { period: '2023-09', label: '2023年9月', count: 4 }
]

// 格式化日期
const formatDate = (date: string) => {
  return DateFormatter.toRelative(date)
}
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