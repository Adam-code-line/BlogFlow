<template>
  <NuxtLayout name="blog">
    <!-- 加载状态 -->
    <div v-if="loading" class="max-w-4xl mx-auto px-4 py-8">
      <!-- 文章头部骨架屏 -->
      <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 mb-8">
        <div class="px-4 py-8 sm:py-12">
          <!-- 返回按钮骨架 -->
          <div class="mb-6">
            <div class="w-32 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          </div>
          
          <!-- 标题骨架 -->
          <div class="space-y-3 mb-6">
            <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
          </div>
          
          <!-- 元信息骨架 -->
          <div class="flex items-center space-x-4 mb-6">
            <div class="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
            <div class="space-y-2">
              <div class="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div class="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
          
          <!-- 描述骨架 -->
          <div class="space-y-2 mb-6">
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse"></div>
          </div>
          
          <!-- 标签骨架 -->
          <div class="flex space-x-2">
            <div class="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
            <div class="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
            <div class="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
      
      <!-- 文章内容骨架屏 -->
      <div class="space-y-4">
        <!-- 封面图骨架 -->
        <div class="w-full h-96 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse mb-8"></div>
        
        <!-- 文章内容骨架 -->
        <div class="space-y-4">
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse"></div>
        </div>
      </div>
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
        <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
          {{ post?.title }}
        </h1>

        <!-- 文章封面图 - 美观地融合在头部 -->
        <div v-if="post?.cover" class="mb-8">
          <div class="relative overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-1">
            <img
              :src="post.cover"
              :alt="post.title"
              class="w-full h-64 md:h-80 lg:h-96 object-cover rounded-xl"
              loading="lazy"
            />
            <!-- 渐变遮罩，让文字更易读 -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-xl"></div>
          </div>
        </div>

        <!-- 文章描述 -->
        <div class="mb-8">
          <p class="text-xl md:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed font-light">
            {{ post?.description }}
          </p>
        </div>

        <!-- 文章元信息 -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div class="flex items-center space-x-4">
            <img 
              :src="post?.author?.avatar || author.avatar"
              :alt="post?.author?.name || author.name"
              class="w-12 h-12 rounded-full border-2 border-white shadow-sm"
            >
            <div>
              <div class="font-medium text-gray-900 dark:text-white">
                {{ post?.author?.name || author.name }}
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
      <!-- 文章正文 -->
      <article class="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-h5:text-lg prose-h6:text-base">
        <!-- 渲染 Markdown 内容，确保移除重复的封面图片 -->
        <div v-if="post?.content" v-html="renderMarkdown(post.content, post.cover)" />
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
import { useBlogPosts } from '~/composables/useContent'
import { useFormatters } from '~/composables/useFormatters'
import { useCodeTheme } from '~/composables/useCodeTheme'
import { getPostsAction } from '~/composables/usePostActions'
import { useUIStore } from '~/stores/ui'
import { useMarkdown } from '~/composables/useMarkdown'
import { useAuthorInfo } from '~/composables/useSiteConfig'

const route = useRoute()
const slug = computed(() => (route.params as { slug: string }).slug);

// UI Store for notifications
const uiStore = useUIStore()

// 响应式状态
const loading = ref(false)
const error = ref<string | null>(null)

// 使用 composables
const blogAPI = useBlogPosts()
const { formatDate } = useFormatters()
const { renderMarkdown } = useMarkdown()

// 获取插件实例
const { $analytics, $codeHighlight } = useNuxtApp()

// 使用代码主题功能
const { initialize: initCodeTheme } = useCodeTheme()

// 使用智能文本选择
useAutoTextSelection()

// 获取站点作者信息
const author = useAuthorInfo()

// 获取文章数据 - 修复点不开的问题
const post = ref<ContentPost | null>(null)

// 加载文章函数
const loadPost = async () => {
  loading.value = true
  error.value = null
  
  try {
    // 最小加载时间，确保骨架屏显示效果
    const [postData] = await Promise.all([
      getPostData(),
      new Promise(resolve => setTimeout(resolve, 800))
    ])
    
    if (postData) {
      post.value = postData
    } else {
      error.value = '抱歉，未找到该文章'
    }
  } catch (err) {
    console.error('文章加载失败:', err)
    error.value = '抱歉，未找到该文章'
  } finally {
    loading.value = false
  }
}

// 获取文章数据的具体逻辑
const getPostData = async (): Promise<ContentPost | null> => {
  try {
    // 优先从localStorage获取文章
    const posts = await getPostsAction()
    
    const foundPost = posts.find(p => p.slug === slug.value)
    
    if (foundPost) {
      // 转换为ContentPost格式
      const contentPost = {
        ...foundPost,
        path: `/blog/${foundPost.slug}`,
        _path: `/blog/${foundPost.slug}`,
        content: foundPost.content || '', // 确保 content 字段正确
        body: foundPost.content || '',
        excerpt: foundPost.description || '',
        readingTime: Math.ceil((foundPost.content || '').split(/\s+/).length / 200),
        author: {
          name: author.value.name,
          avatar: author.value.avatar
        }
      } as ContentPost
      
      return contentPost
    } else {
      // 备用方案：使用Content API
      return await blogAPI.getPostBySlug(slug.value)
    }
  } catch (error) {
    console.error('getPostData 错误:', error)
    return null
  }
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
    label: `${platform}: ${post.value?.title}`
  })
}

// 页面加载和代码高亮
onMounted(async () => {
  // 加载文章
  await loadPost()
  
  // 初始化代码主题
  initCodeTheme()
  
  // 追踪文章阅读
  if (post.value && post.value.title) {
    $analytics.trackArticleRead(post.value.title, post.value.category || 'blog')
    $analytics.trackPageView({
      path: route.path,
      title: `${post.value.title} - BlogFlow`,
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
  title: computed(() => post.value?.title),
  description: computed(() => post.value?.description),
  ogTitle: computed(() => post.value?.title),
  ogDescription: computed(() => post.value?.description),
  ogImage: computed(() => post.value?.cover),
})

// 复制链接功能 - 集成Toast通知
function copyUrl() {
  if (process.client) {
    navigator.clipboard.writeText(fullUrl.value).then(() => {
      uiStore.showSuccess('链接已复制', '文章链接已成功复制到剪贴板')
      $analytics.trackEvent({
        action: 'copy_link',
        category: 'article',
        label: post.value?.title
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

/* 链接样式优化 - 添加蓝色高亮和悬停效果 */
:deep(.prose a) {
  color: #3b82f6 !important; /* 蓝色 */
  text-decoration: underline !important;
  text-decoration-color: rgba(59, 130, 246, 0.3) !important;
  text-underline-offset: 3px !important;
  font-weight: 500 !important;
  transition: all 0.2s ease-in-out !important;
}

:deep(.prose a:hover) {
  color: #1d4ed8 !important; /* 深蓝色 */
  text-decoration-color: #3b82f6 !important;
  text-shadow: 0 0 8px rgba(59, 130, 246, 0.3) !important; /* 蓝色发光效果 */
  transform: translateY(-1px) !important;
}

/* 暗色模式下的链接样式 */
:deep(.dark .prose a) {
  color: #60a5fa !important; /* 亮蓝色 */
  text-decoration-color: rgba(96, 165, 250, 0.3) !important;
}

:deep(.dark .prose a:hover) {
  color: #93c5fd !important; /* 更亮的蓝色 */
  text-decoration-color: #60a5fa !important;
  text-shadow: 0 0 12px rgba(96, 165, 250, 0.4) !important; /* 暗色模式下的蓝色发光 */
}

/* 外部链接特殊样式 - 添加小图标 */
:deep(.prose a[href^="http"]:not([href*="blogflow.example.com"]):not([href*="localhost"])) {
  position: relative !important;
}

:deep(.prose a[href^="http"]:not([href*="blogflow.example.com"]):not([href*="localhost"]))::after {
  content: "↗" !important;
  display: inline-block !important;
  margin-left: 4px !important;
  font-size: 0.75em !important;
  opacity: 0.7 !important;
  transition: all 0.2s ease-in-out !important;
}

:deep(.prose a[href^="http"]:not([href*="blogflow.example.com"]):not([href*="localhost"])):hover::after {
  opacity: 1 !important;
  transform: translateX(2px) translateY(-2px) !important;
}

/* 代码中的链接样式 */
:deep(.prose code a) {
  color: inherit !important;
  text-decoration: underline !important;
  text-decoration-color: currentColor !important;
}

/* 引用块中的链接样式 */
:deep(.prose blockquote a) {
  color: #1e40af !important;
  font-weight: 600 !important;
}

:deep(.dark .prose blockquote a) {
  color: #93c5fd !important;
}
</style>
