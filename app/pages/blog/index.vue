<template>
  <NuxtLayout name="blog">
    <!-- 页面头部 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
      <div class="px-6 py-8 text-center">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          博客文章
        </h1>
        <p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          探索技术世界，分享开发经验，记录学习心得
        </p>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="space-y-8">
      <!-- 文章列表组件 -->
      <PostList
        :posts="allPosts"
        :loading="false"
        :show-header="false"
        :enable-search="true"
        :enable-category-filter="true"
        :enable-sort="true"
        :default-view-mode="'grid'"
        :grid-columns="2"
        @post-click="(post) => navigateTo(post.path)"
      />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { ContentPost } from '~/types'
import { useBlogPosts } from '~/composables/useContent'
import { useCodeTheme } from '~/composables/useCodeTheme'

// 页面元数据
useSeoMeta({
  title: '博客文章 - BlogFlow',
  description: '浏览我的最新技术文章和思考，涵盖前端开发、Vue.js、Nuxt.js、TypeScript 等技术主题。',
  ogTitle: '博客文章 - BlogFlow',
  ogDescription: '浏览我的最新技术文章和思考，涵盖前端开发、Vue.js、Nuxt.js、TypeScript 等技术主题。'
})

// 使用 composables
const blogAPI = useBlogPosts()

// 使用代码主题功能
const { initialize: initCodeTheme } = useCodeTheme()

// 获取所有博客文章
const allPosts = await blogAPI.getAllPosts()

// 页面挂载时初始化代码主题
onMounted(() => {
  initCodeTheme()
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