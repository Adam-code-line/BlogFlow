<template>
  <NuxtLayout name="blog">
    <!-- 加载状态 -->
    <div v-if="loading" class="max-w-4xl mx-auto px-4 py-8">
      <UiSkeleton variant="card" class="mb-8" />
      <UiSkeleton :lines="10" class="space-y-4" />
    </div>
    
    <!-- 错误状态 -->
    <div v-else-if="error" class="max-w-4xl mx-auto px-4 py-8 text-center">
      <Icon name="heroicons:exclamation-triangle" class="w-16 h-16 mx-auto text-red-500 mb-4" />
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">文章不存在</h1>
      <p class="text-gray-600 dark:text-gray-400 mb-6">{{ error }}</p>
      <UiButton @click="$router.back()" variant="outline">
        返回上一页
      </UiButton>
    </div>

    <!-- 文章内容 -->
    <div v-else-if="post">
    <!-- 文章头部 -->
    <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <!-- 返回按钮 -->
        <div class="mb-6">
          <UiButton
            icon="i-heroicons-arrow-left"
            variant="ghost"
            color="neutral"
            @click="$router.back()"
          >
            返回文章列表
          </UiButton>
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
      <article class="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-h5:text-lg prose-h6:text-base">
        <!-- 渲染 Markdown 内容 -->
        <div v-if="post?.content" v-html="renderMarkdown(post.content)" />
        <!-- 备选方案：如果有路径信息，使用 ContentRenderer -->
        <ContentRenderer v-else-if="post?.path" :value="post" />
        <!-- 兜底方案：显示描述 -->
        <div v-else-if="post?.description" class="text-gray-600 dark:text-gray-400">
          <p>⚠️ 没有找到文章内容，显示描述：</p>
          <p>{{ post.description }}</p>
        </div>
        <!-- 完全没有内容 -->
        <div v-else class="text-gray-600 dark:text-gray-400 text-center py-8">
          <p>❌ 无内容可显示</p>
          <p class="text-sm">请检查文章是否存在或联系管理员</p>
        </div>
      </article>

      <!-- 文章底部 -->
      <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">

        <!-- 分享按钮 -->
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <span class="text-sm font-medium text-gray-900 dark:text-white">分享文章：</span>
            <UiButton
              icon="i-simple-icons-twitter"
              variant="ghost"
              color="primary"
              size="sm"
              :to="`https://twitter.com/intent/tweet?text=${encodeURIComponent(post?.title || '')}&url=${encodeURIComponent(fullUrl)}`"
              target="_blank"
              @click="trackShare('twitter')"
            />
            <UiButton
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
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { ContentPost } from '~/types'
import { useBlogPosts, useFormatDate } from '~/composables/useContent'
import { useCodeTheme } from '~/composables/useCodeTheme'
import { getPostsAction } from '~/composables/usePostActions'
import { useUIStore } from '~/stores/ui'
import { useMarkdown } from '~/composables/useMarkdown'

const route = useRoute()
const slug = computed(() => (route.params as { slug: string }).slug);

// UI Store for notifications
const uiStore = useUIStore()

// 响应式状态
const loading = ref(false)
const error = ref<string | null>(null)

// 使用 composables
const blogAPI = useBlogPosts()
const { formatDate } = useFormatDate()
const { renderMarkdown } = useMarkdown()

// 获取插件实例
const { $analytics, $codeHighlight } = useNuxtApp()

// 使用代码主题功能
const { initialize: initCodeTheme } = useCodeTheme()

// 获取文章数据 - 修复点不开的问题
let post: ContentPost | null = null
try {
  // 优先从localStorage获取文章
  const posts = await getPostsAction()
  console.log('🔍 当前所有文章:', posts)
  console.log('🔍 当前 slug:', slug.value)
  
  const foundPost = posts.find(p => p.slug === slug.value)
  console.log('🔍 找到的文章:', foundPost)
  
  if (foundPost) {
    console.log('📝 文章内容长度:', foundPost.content?.length || 0)
    console.log('📝 文章内容预览:', foundPost.content?.substring(0, 100) + '...')
    
    // 转换为ContentPost格式
    post = {
      ...foundPost,
      path: `/blog/${foundPost.slug}`,
      _path: `/blog/${foundPost.slug}`,
      content: foundPost.content, // 确保 content 字段正确
      body: foundPost.content,
      excerpt: foundPost.description,
      readingTime: Math.ceil(foundPost.content.split(/\s+/).length / 200),
      author: {
        name: 'BlogFlow Author',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face'
      }
    } as ContentPost
    
    console.log('✅ 转换后的文章对象:', post)
  } else {
    console.log('❌ 未找到文章，尝试备用方案')
    // 备用方案：使用Content API
    post = await blogAPI.getPostBySlug(slug.value)
  }
} catch (err) {
  console.error('获取文章失败:', err)
  post = null
}

// 获取所有文章用于计算相邻文章
let allBlogPosts: ContentPost[] = []
try {
  const localPosts = await getPostsAction()
  if (localPosts.length > 0) {
    allBlogPosts = localPosts.map(p => ({
      ...p,
      path: `/blog/${p.slug}`,
      _path: `/blog/${p.slug}`,
      body: p.content,
      excerpt: p.description
    })) as ContentPost[]
  } else {
    allBlogPosts = await blogAPI.getAllPosts()
  }
} catch (err) {
  console.error('获取文章列表失败:', err)
  allBlogPosts = []
}

// 获取相邻文章
const surrounding = blogAPI.getSurroundingPosts(allBlogPosts, `/blog/${slug.value}`)
const prev = surrounding.prev
const next = surrounding.next

// 404 处理
if (!post) {
  error.value = '抱歉，未找到该文章'
}

// 计算完整URL用于分享
const fullUrl = computed(() => {
  if (process.client) {
    return window.location.href
  }
  return `https://blogflow.example.com${route.path}`
})

// Analytics 事件处理
const trackShare = (platform: string) => {
  $analytics.trackEvent({
    action: 'share',
    category: 'article',
    label: `${platform}: ${post?.title}`
  })
}

// 页面加载和代码高亮
onMounted(() => {
  // 初始化代码主题
  initCodeTheme()
  
  // 追踪文章阅读
  if (post && post.title) {
    $analytics.trackArticleRead(post.title, post.category || 'blog')
    $analytics.trackPageView({
      path: route.path,
      title: `${post.title} - BlogFlow`,
      referrer: document.referrer
    })
  }

  // 增强代码块（在 DOM 更新后）
  nextTick(() => {
    $codeHighlight.enhanceCodeBlocks()
    $codeHighlight.addCodeTitles()
  })
})

// 动态SEO
useSeoMeta({
  title: post?.title,
  description: post?.description,
  ogTitle: post?.title,
  ogDescription: post?.description,
  ogImage: post?.cover,
})

// 复制链接功能 - 集成Toast通知
function copyUrl() {
  if (process.client) {
    navigator.clipboard.writeText(fullUrl.value).then(() => {
      uiStore.showSuccess('链接已复制', '文章链接已成功复制到剪贴板')
      $analytics.trackEvent({
        action: 'copy_link',
        category: 'article',
        label: post?.title
      })
    }).catch((err) => {
      console.error('复制失败:', err)
      uiStore.showError('复制失败', '无法复制链接到剪贴板，请手动复制')
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

/* 确保标题层级样式 */
:deep(.prose h1) {
  font-size: 2.25rem !important;
  line-height: 2.5rem !important;
  font-weight: 700 !important;
  margin-top: 2rem !important;
  margin-bottom: 1.5rem !important;
}

:deep(.prose h2) {
  font-size: 1.875rem !important;
  line-height: 2.25rem !important;
  font-weight: 600 !important;
  margin-top: 1.5rem !important;
  margin-bottom: 1rem !important;
}

:deep(.prose h3) {
  font-size: 1.5rem !important;
  line-height: 2rem !important;
  font-weight: 600 !important;
  margin-top: 1.25rem !important;
  margin-bottom: 0.75rem !important;
}

:deep(.prose h4) {
  font-size: 1.25rem !important;
  line-height: 1.75rem !important;
  font-weight: 600 !important;
  margin-top: 1rem !important;
  margin-bottom: 0.5rem !important;
}

:deep(.prose h5) {
  font-size: 1.125rem !important;
  line-height: 1.75rem !important;
  font-weight: 600 !important;
  margin-top: 0.75rem !important;
  margin-bottom: 0.5rem !important;
}

:deep(.prose h6) {
  font-size: 1rem !important;
  line-height: 1.5rem !important;
  font-weight: 600 !important;
  margin-top: 0.5rem !important;
  margin-bottom: 0.25rem !important;
}
</style>
