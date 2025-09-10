<template>
  <NuxtLayout name="blog">
    <!-- 文章头部 -->
    <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <!-- 返回按钮 -->
        <div class="mb-6">
          <UButton
            icon="i-heroicons-arrow-left"
            variant="ghost"
            color="neutral"
            @click="$router.back()"
          >
            返回文章列表
          </UButton>
        </div>

        <!-- 文章标题 -->
        <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
          {{ post?.title }}
        </h1>

        <!-- 文章元信息 -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div class="flex items-center space-x-4">
            <img 
              :src="post?.author?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face'"
              :alt="post?.author?.name"
              class="w-12 h-12 rounded-full border-2 border-white shadow-sm"
            >
            <div>
              <div class="font-medium text-gray-900 dark:text-white">
                {{ post?.author?.name || 'BlogFlow Author' }}
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">
                {{ formatDate(post?.publishedAt || '') }}
              </div>
            </div>
          </div>
          
          <div class="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            <div class="flex items-center">
              <Icon name="heroicons:clock" class="w-4 h-4 mr-1" />
              {{ post?.readingTime || 5 }} 分钟阅读
            </div>
            <UBadge 
              :label="post?.category" 
              variant="subtle" 
              color="primary"
            />
          </div>
        </div>

        <!-- 文章描述 -->
        <p class="text-xl text-gray-600 dark:text-gray-300 mb-6">
          {{ post?.description }}
        </p>

        <!-- 文章标签 -->
        <div class="flex flex-wrap gap-2">
          <UBadge 
            v-for="tag in post?.tags" 
            :key="tag"
            :label="tag"
            variant="soft"
            color="neutral"
            size="sm"
          />
        </div>
      </div>
    </header>

    <!-- 文章内容 -->
    <main class="max-w-4xl mx-auto px-4 py-8">
      <!-- 文章封面图 -->
      <div v-if="post?.cover" class="mb-8">
        <NuxtImg
          :src="post.cover"
          :alt="post.title"
          class="w-full max-h-96 object-cover rounded-xl shadow-lg"
          loading="lazy"
        />
      </div>

      <!-- 文章正文 -->
      <article class="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-code:text-sm prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800">
        <ContentRenderer :value="post" />
      </article>

      <!-- 文章底部 -->
      <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">

        <!-- 分享按钮 -->
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <span class="text-sm font-medium text-gray-900 dark:text-white">分享文章：</span>
            <UButton
              icon="i-simple-icons-twitter"
              variant="ghost"
              color="primary"
              size="sm"
              :to="`https://twitter.com/intent/tweet?text=${encodeURIComponent(post?.title || '')}&url=${encodeURIComponent(fullUrl)}`"
              target="_blank"
            />
            <UButton
              icon="i-heroicons-link"
              variant="ghost"
              color="neutral"
              size="sm"
              @click="copyUrl"
            />
          </div>
        </div>
      </div>

      <!-- 相邻文章导航 -->
      <nav v-if="prev || next" class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <div class="grid md:grid-cols-2 gap-6">
          <!-- 上一篇 -->
          <div v-if="prev" class="order-2 md:order-1">
            <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">上一篇</div>
            <NuxtLink 
              :to="prev.path"
              class="block p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <h3 class="font-medium text-gray-900 dark:text-white line-clamp-2">
                {{ prev.title }}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                {{ prev.description }}
              </p>
            </NuxtLink>
          </div>

          <!-- 下一篇 -->
          <div v-if="next" class="order-1 md:order-2">
            <div class="text-sm text-gray-600 dark:text-gray-400 mb-2 md:text-right">下一篇</div>
            <NuxtLink 
              :to="next.path"
              class="block p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <h3 class="font-medium text-gray-900 dark:text-white line-clamp-2 md:text-right">
                {{ next.title }}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2 md:text-right">
                {{ next.description }}
              </p>
            </NuxtLink>
          </div>
        </div>
      </nav>
    </main>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { ContentPost } from '~/types'
import { useBlogPosts, useFormatDate } from '~/composables/useContent'

const route = useRoute()
const slug = computed(() => (route.params as { slug: string }).slug);

// 使用 composables
const blogAPI = useBlogPosts()
const { formatDate } = useFormatDate()

// 获取文章数据
const post = await blogAPI.getPostBySlug(slug.value)

// 获取所有文章用于计算相邻文章
const allBlogPosts = await blogAPI.getAllPosts()

// 获取相邻文章
const surrounding = blogAPI.getSurroundingPosts(allBlogPosts, `/blog/${slug.value}`)
const prev = surrounding.prev
const next = surrounding.next

// 404 处理
if (!post) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Post not found'
  })
}

// 计算完整URL用于分享
const fullUrl = computed(() => {
  if (process.client) {
    return window.location.href
  }
  return `https://blogflow.example.com${route.path}`
})

// 动态SEO
useSeoMeta({
  title: post?.title,
  description: post?.description,
  ogTitle: post?.title,
  ogDescription: post?.description,
  ogImage: post?.cover,
})

// 工具函数
function copyUrl() {
  if (process.client) {
    navigator.clipboard.writeText(fullUrl.value).then(() => {
      console.log('URL已复制到剪贴板')
    })
  }
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
</style>
