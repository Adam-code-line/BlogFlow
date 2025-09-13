<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
    
    <!-- 主要内容 -->
    <main>
      <!-- Hero 部分 -->
      <section class="py-20 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto text-center">
          <div class="mb-8">
            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" 
                 alt="头像" 
                 class="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-white shadow-lg">
          </div>
          <h1 class="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            欢迎来到我的
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">博客世界</span>
          </h1>
          <p class="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            这里记录着我的技术思考、学习笔记和生活感悟。让我们一起探索代码的魅力，分享知识的力量。
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <UiButton size="lg" color="primary" variant="solid" class="px-8 py-3" to="/blog" @click="handleBlogClick">
              <Icon name="heroicons:document-text" class="w-5 h-5 mr-2" />
              阅读博客
            </UiButton>
            <UiButton size="lg" color="neutral" variant="outline" class="px-8 py-3" to="/about" @click="handleAboutClick">
              <Icon name="heroicons:user" class="w-5 h-5 mr-2" />
              了解更多
            </UiButton>
          </div>
        </div>
      </section>

      <!-- 统计信息 -->
      <section class="py-16 bg-white dark:bg-gray-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div class="text-center">
              <div class="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">42</div>
              <div class="text-gray-600 dark:text-gray-300">技术文章</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">15</div>
              <div class="text-gray-600 dark:text-gray-300">开源项目</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">100+</div>
              <div class="text-gray-600 dark:text-gray-300">技术分享</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">2.5k</div>
              <div class="text-gray-600 dark:text-gray-300">访问量</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 最新文章 -->
      <section class="py-20 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">最新文章</h2>
            <p class="text-xl text-gray-600 dark:text-gray-300">分享最新的技术见解和思考</p>
          </div>
          
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- 文章卡片 -->
            <UiCard 
              v-for="post in featuredPosts" 
              :key="post.path"
              class="hover:shadow-xl transition-shadow duration-300"
              hoverable
            >
              <template #header>
                <div v-if="post.cover" class="aspect-video overflow-hidden">
                  <NuxtImg
                    :src="post.cover"
                    :alt="post.title"
                    class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              </template>
              
              <div class="p-6">
                <!-- 分类和标签 -->
                <div class="flex items-center space-x-2 mb-3">
                  <UBadge 
                    :label="post.category" 
                    variant="soft" 
                    color="primary"
                  />
                  <UBadge 
                    v-if="post.tags?.[0]"
                    :label="post.tags[0]" 
                    variant="soft" 
                    color="secondary"
                  />
                </div>

                <!-- 标题 -->
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  <NuxtLink 
                    :to="post.path"
                    class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {{ post.title }}
                  </NuxtLink>
                </h3>

                <!-- 描述 -->
                <p class="text-gray-600 dark:text-gray-300 mb-4">
                  {{ post.description }}
                </p>

                <!-- 时间和阅读时间 -->
                <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>{{ formatDate(post.publishedAt || '') }}</span>
                  <span>{{ post.readingTime || 5 }} 分钟阅读</span>
                </div>
              </div>
            </UiCard>
          </div>

          <div class="text-center mt-12">
            <UiButton size="lg" color="neutral" variant="outline" to="/blog">
              查看全部文章
            </UiButton>
          </div>
        </div>
      </section>

      <!-- 技能和技术栈 -->
      <section class="py-20 bg-white dark:bg-gray-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">技术栈</h2>
            <p class="text-xl text-gray-600 dark:text-gray-300">我熟悉的技术和工具</p>
          </div>
          
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            <div class="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-700 rounded-xl hover:shadow-md transition-shadow">
              <Icon name="logos:vue" class="w-12 h-12 mb-3" />
              <span class="text-sm font-medium text-gray-900 dark:text-white">Vue.js</span>
            </div>
            <div class="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-700 rounded-xl hover:shadow-md transition-shadow">
              <Icon name="logos:nuxt-icon" class="w-12 h-12 mb-3" />
              <span class="text-sm font-medium text-gray-900 dark:text-white">Nuxt</span>
            </div>
            <div class="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-700 rounded-xl hover:shadow-md transition-shadow">
              <Icon name="logos:typescript-icon" class="w-12 h-12 mb-3" />
              <span class="text-sm font-medium text-gray-900 dark:text-white">TypeScript</span>
            </div>
            <div class="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-700 rounded-xl hover:shadow-md transition-shadow">
              <Icon name="logos:tailwindcss-icon" class="w-12 h-12 mb-3" />
              <span class="text-sm font-medium text-gray-900 dark:text-white">Tailwind</span>
            </div>
            <div class="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-700 rounded-xl hover:shadow-md transition-shadow">
              <Icon name="logos:nodejs-icon" class="w-12 h-12 mb-3" />
              <span class="text-sm font-medium text-gray-900 dark:text-white">Node.js</span>
            </div>
            <div class="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-700 rounded-xl hover:shadow-md transition-shadow">
              <Icon name="logos:git-icon" class="w-12 h-12 mb-3" />
              <span class="text-sm font-medium text-gray-900 dark:text-white">Git</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 联系和社交 -->
      <section class="py-20 px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">保持联系</h2>
          <p class="text-xl text-gray-600 dark:text-gray-300 mb-12">
            有任何问题或想法？随时与我交流
          </p>
          
          <div class="flex justify-center space-x-6 mb-12">
            <a href="#" @click="handleSocialClick('github')" class="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
              <Icon name="simple-icons:github" class="w-6 h-6" />
            </a>
            <a href="#" @click="handleSocialClick('twitter')" class="flex items-center justify-center w-12 h-12 bg-blue-400 text-white rounded-full hover:bg-blue-500 transition-colors">
              <Icon name="simple-icons:twitter" class="w-6 h-6" />
            </a>
            <a href="#" @click="handleSocialClick('linkedin')" class="flex items-center justify-center w-12 h-12 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors">
              <Icon name="simple-icons:linkedin" class="w-6 h-6" />
            </a>
            <a href="#" @click="handleSocialClick('gmail')" class="flex items-center justify-center w-12 h-12 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors">
              <Icon name="simple-icons:gmail" class="w-6 h-6" />
            </a>
          </div>
          
          <UiButton size="lg" color="primary" variant="solid" class="px-8 py-3" @click="handleContactClick">
            发送邮件
          </UiButton>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { ContentPost } from '~/types'
import { useBlogPosts, useFormatDate } from '~/composables/useContent'
import { DateFormatter, TextFormatter } from '~/utils/format'
import { useCodeTheme } from '~/composables/useCodeTheme'
// 明确导入 ThemeToggle 组件
import ThemeToggle from '~/components/common/ThemeToggle.vue'

// 使用 composables
const blogAPI = useBlogPosts()
const { formatDate: originalFormatDate } = useFormatDate()

// 获取分析工具实例
const { $analytics } = useNuxtApp()

// 使用代码主题功能
const { initialize: initCodeTheme } = useCodeTheme()

// 获取精选文章（最新的3篇文章）
const featuredPosts = await blogAPI.getFeaturedPosts(3)

// 格式化函数
const formatDate = (date: string | Date) => {
  const dateStr = typeof date === 'string' ? date : date.toISOString()
  return DateFormatter.toRelative(dateStr)
}

const getReadingTime = (content: string) => {
  return TextFormatter.readingTime(content)
}

const getExcerpt = (content: string, maxLength = 120) => {
  return TextFormatter.excerpt(content, maxLength)
}

// Analytics 事件处理函数
const handleBlogClick = () => {
  $analytics.trackEvent({
    action: 'navigate',
    category: 'homepage',
    label: 'view_all_posts'
  })
}

const handleAboutClick = () => {
  $analytics.trackEvent({
    action: 'navigate',
    category: 'homepage', 
    label: 'about_page'
  })
}

const handleContactClick = () => {
  $analytics.trackEvent({
    action: 'contact',
    category: 'engagement',
    label: 'contact_button'
  })
}

const handleSocialClick = (platform: string) => {
  $analytics.trackLinkClick(`https://${platform}.com/profile`, `${platform} Profile`)
}

// 页面加载时追踪
onMounted(() => {
  // 初始化代码主题
  initCodeTheme()
  
  // 追踪页面访问
  $analytics.trackPageView({
    path: '/',
    title: 'BlogFlow - 首页',
    referrer: document.referrer
  })
})

// 设置页面元数据
useSeoMeta({
  title: 'BlogFlow - 个人博客首页',
  ogTitle: 'BlogFlow - 个人博客首页',
  description: '欢迎来到 BlogFlow，一个专注于技术分享和知识传播的个人博客平台。',
  ogDescription: '欢迎来到 BlogFlow，一个专注于技术分享和知识传播的个人博客平台。',
  ogImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=630&fit=crop',
  twitterCard: 'summary_large_image',
})
</script>