<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">管理仪表盘</h1>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
        欢迎回来，这里是您的博客管理概览
      </p>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AdminStatsCard
        title="总文章数"
        :value="stats.totalPosts"
        change="+12%"
        icon="i-heroicons-document-text"
        color="blue"
      />
      <AdminStatsCard
        title="总评论数"
        :value="stats.totalComments"
        change="-3%"
        change-direction="down"
        icon="i-heroicons-chat-bubble-left-ellipsis"
        color="purple"
      />
      <AdminStatsCard
        title="总访问量"
        :value="stats.totalViews"
        change="+24%"
        icon="i-heroicons-eye"
        color="orange"
      />
    </div>

    <!-- 内容网格 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 最近文章 -->
      <UCard class="bg-white dark:bg-gray-800">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">最近文章</h3>
            <UButton
              to="/admin/posts"
              variant="ghost"
              size="sm"
              trailing-icon="i-heroicons-arrow-right"
            >
              查看全部
            </UButton>
          </div>
        </template>
        
        <div class="space-y-4">
          <div
            v-for="(post, index) in recentPosts"
            :key="index"
            class="flex items-center space-x-4 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <img
              :src="post.cover || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop'"
              :alt="post.title || ''"
              class="w-12 h-12 rounded-lg object-cover"
            />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                {{ post.title || '无标题' }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ formatDate(post.publishedAt || new Date()) }}
              </p>
            </div>
            <div class="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
              <Icon name="i-heroicons-eye" class="h-4 w-4" />
              <span>{{ (post as any).views || Math.floor(Math.random() * 500) + 100 }}</span>
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <!-- 访问统计图表 -->
    <UCard class="bg-white dark:bg-gray-800">
      <template #header>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">访问统计</h3>
      </template>
      
      <div class="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
        <div class="text-center">
          <Icon name="i-heroicons-chart-bar" class="h-12 w-12 mx-auto mb-3" />
          <p>图表组件待集成</p>
          <p class="text-sm mt-1">可考虑使用 Chart.js 或 ApexCharts</p>
        </div>
      </div>
    </UCard>

    <!-- 快速操作 -->
    <UCard class="bg-white dark:bg-gray-800">
      <template #header>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">快速操作</h3>
      </template>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <UButton
          to="/admin/posts/new"
          block
          size="lg"
          icon="i-heroicons-plus-circle"
          variant="outline"
        >
          写新文章
        </UButton>
        <UButton
          to="/admin/comments"
          block
          size="lg"
          icon="i-heroicons-chat-bubble-left-ellipsis"
          variant="outline"
        >
          审核评论
        </UButton>
        <UButton
          to="/admin/settings"
          block
          size="lg"
          icon="i-heroicons-cog-6-tooth"
          variant="outline"
        >
          系统设置
        </UButton>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { useBlogStore } from '~/stores/blog'
import type { ContentPost } from '~/types'

// 设置布局和中间件
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

// Store
const blogStore = useBlogStore()

// 页面标题
useHead({
  title: '管理仪表盘 - BlogFlow'
})

// 统计数据
const stats = ref({
  totalPosts: 0,
  totalComments: 0,
  totalViews: 0
})

// 最近文章
const recentPosts = ref<ContentPost[]>([])

// 格式化日期
const formatDate = (date: string | Date) => {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(date))
}

// 加载数据
const loadDashboardData = async () => {
  try {
    // 加载文章数据
    await blogStore.fetchAllPosts()
    recentPosts.value = blogStore.posts.slice(0, 5)
    
    // 更新统计数据
    stats.value = {
      totalPosts: blogStore.posts.length,
      totalComments: Math.floor(Math.random() * 500) + 100, // 模拟数据
      totalViews: Math.floor(Math.random() * 10000) + 5000 // 模拟数据
    }
  } catch (error) {
    console.error('Failed to load dashboard data:', error)
  }
}

// 页面挂载时加载数据
onMounted(() => {
  loadDashboardData()
})
</script>