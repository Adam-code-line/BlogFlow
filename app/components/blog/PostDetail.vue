<template>
  <article class="post-detail max-w-4xl mx-auto">
    <!-- 文章头部 -->
    <header class="post-header mb-8">
      <!-- 返回按钮 -->
      <div v-if="showBackButton" class="mb-6">
        <Button
          variant="ghost"
          size="sm"
          icon="heroicons:arrow-left"
          @click="handleBack"
        >
          返回
        </Button>
      </div>

      <!-- 文章分类标签 -->
      <div v-if="post.category" class="mb-4">
        <NuxtLink
          :to="`/blog/category/${post.category}`"
          class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-200"
        >
          <Icon name="heroicons:tag" class="w-3 h-3 mr-1" />
          {{ post.category }}
        </NuxtLink>
      </div>

      <!-- 文章标题 -->
      <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
        {{ post.title }}
      </h1>

      <!-- 文章元信息 -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <!-- 左侧：作者和发布时间 -->
        <div class="flex items-center space-x-4">
          <!-- 作者信息 -->
          <div class="flex items-center space-x-3">
            <img
              :src="post.author?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'"
              :alt="post.author?.name || 'Author'"
              class="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
            />
            <div>
              <p class="font-medium text-gray-900 dark:text-white">
                {{ post.author?.name || 'BlogFlow Author' }}
              </p>
              <div class="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                <time>{{ formatDate(post.publishedAt || post.createdAt) }}</time>
                <span>·</span>
                <span>{{ formatters.text.readingTime(post.content || post.excerpt || '', 200) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：互动和分享 -->
        <div class="flex items-center space-x-4">
          <!-- 统计信息 -->
          <div v-if="showStats" class="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            <div v-if="(post as any).views" class="flex items-center space-x-1">
              <Icon name="heroicons:eye" class="w-4 h-4" />
              <span>{{ formatNumber((post as any).views) }}</span>
            </div>
            <div v-if="(post as any).likes" class="flex items-center space-x-1">
              <Icon name="heroicons:heart" class="w-4 h-4" />
              <span>{{ formatNumber((post as any).likes) }}</span>
            </div>
            <div v-if="(post as any).comments" class="flex items-center space-x-1">
              <Icon name="heroicons:chat-bubble-left" class="w-4 h-4" />
              <span>{{ formatNumber((post as any).comments) }}</span>
            </div>
          </div>

          <!-- 分享按钮 -->
          <div v-if="enableShare" class="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              icon="heroicons:share"
              @click="toggleShareMenu"
            >
              分享
            </Button>
            
            <!-- 分享菜单 -->
            <div v-if="showShareMenu" class="relative">
              <div class="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 z-10 min-w-[160px]">
                <button
                  v-for="shareOption in shareOptions"
                  :key="shareOption.name"
                  class="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                  @click="handleShare(shareOption)"
                >
                  <Icon :name="shareOption.icon" class="w-4 h-4" />
                  <span>{{ shareOption.label }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 文章描述 -->
      <p v-if="post.description" class="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
        {{ post.description }}
      </p>

      <!-- 特色文章标识 -->
      <div v-if="post.featured" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 mb-6">
        <Icon name="heroicons:star" class="w-4 h-4 mr-1 fill-current" />
        精选文章
      </div>
    </header>

    <!-- 文章封面图 -->
    <div v-if="showCover && (post.cover || post.seo?.ogImage)" class="mb-8">
      <div class="relative overflow-hidden rounded-xl">
        <img
          :src="post.cover || post.seo?.ogImage"
          :alt="post.title"
          class="w-full h-64 md:h-96 object-cover"
          loading="lazy"
        />
        <!-- 图片遮罩 -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>
    </div>

    <!-- 目录（如果启用） -->
    <div v-if="enableToc && tableOfContents.length > 0" class="mb-8">
      <Card variant="bordered" class="p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Icon name="heroicons:list-bullet" class="w-5 h-5 mr-2" />
          目录
        </h3>
        <nav class="toc-nav">
          <ul class="space-y-2">
            <li
              v-for="item in tableOfContents"
              :key="item.id"
              :class="`ml-${(item.level - 1) * 4}`"
            >
              <a
                :href="`#${item.anchor}`"
                class="block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                @click="trackTocClick(item)"
              >
                {{ item.title }}
              </a>
            </li>
          </ul>
        </nav>
      </Card>
    </div>

    <!-- 文章内容 -->
    <div class="post-content">
      <div 
        v-if="post.content"
        class="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-code:text-sm prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-900/20"
        v-html="post.content"
      ></div>
      
      <!-- 如果没有内容，显示占位符 -->
      <div v-else class="text-center py-12">
        <Icon name="heroicons:document-text" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p class="text-gray-600 dark:text-gray-400">文章内容加载中...</p>
      </div>
    </div>

    <!-- 文章标签 -->
    <div v-if="post.tags && post.tags.length > 0" class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">相关标签</h3>
      <div class="flex flex-wrap gap-2">
        <NuxtLink
          v-for="tag in post.tags"
          :key="tag"
          :to="`/blog?tag=${encodeURIComponent(tag)}`"
          class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          #{{ tag }}
        </NuxtLink>
      </div>
    </div>

    <!-- 文章操作 -->
    <div v-if="showActions" class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <!-- 互动按钮 -->
        <div class="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            :icon="isLiked ? 'heroicons:heart-solid' : 'heroicons:heart'"
            :class="isLiked ? 'text-red-500' : ''"
            @click="toggleLike"
          >
            {{ isLiked ? '已赞' : '点赞' }} ({{ likeCount }})
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            icon="heroicons:bookmark"
            :class="isBookmarked ? 'text-blue-500' : ''"
            @click="toggleBookmark"
          >
            {{ isBookmarked ? '已收藏' : '收藏' }}
          </Button>
        </div>

        <!-- 更新时间 -->
        <div v-if="post.updatedAt && post.updatedAt !== post.createdAt" class="text-sm text-gray-500 dark:text-gray-400">
          最后更新：{{ formatDate(post.updatedAt) }}
        </div>
      </div>
    </div>

    <!-- 相关文章推荐 -->
    <div v-if="relatedPosts && relatedPosts.length > 0" class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">相关文章</h3>
      <div class="grid gap-6 md:grid-cols-2">
        <PostCard
          v-for="relatedPost in relatedPosts"
          :key="relatedPost.path"
          :post="relatedPost"
          :view-mode="'grid'"
          :show-cover="true"
          :show-tags="false"
          @click="handleRelatedPostClick(relatedPost)"
        />
      </div>
    </div>
  </article>

  <!-- 分享菜单背景遮罩 -->
  <div
    v-if="showShareMenu"
    class="fixed inset-0 z-0"
    @click="showShareMenu = false"
  ></div>
</template>

<script setup lang="ts">
import type { ContentPost } from '~/types'
import { formatters } from '~/utils/format'
import { safeJsonParse } from '~/composables/useUtils'

export interface PostDetailProps {
  // 文章数据
  post: ContentPost
  // 是否显示返回按钮
  showBackButton?: boolean
  // 是否显示封面图
  showCover?: boolean
  // 是否显示统计信息
  showStats?: boolean
  // 是否启用分享功能
  enableShare?: boolean
  // 是否显示目录
  enableToc?: boolean
  // 是否显示操作按钮
  showActions?: boolean
  // 相关文章
  relatedPosts?: ContentPost[]
  // 目录数据
  tableOfContents?: Array<{
    id: string
    title: string
    level: number
    anchor: string
  }>
}

export interface PostDetailEmits {
  (e: 'back'): void
  (e: 'like', liked: boolean): void
  (e: 'bookmark', bookmarked: boolean): void
  (e: 'share', platform: string, url: string): void
  (e: 'related-post-click', post: ContentPost): void
  (e: 'toc-click', item: any): void
}

const props = withDefaults(defineProps<PostDetailProps>(), {
  showBackButton: true,
  showCover: true,
  showStats: true,
  enableShare: true,
  enableToc: true,
  showActions: true,
  relatedPosts: () => [],
  tableOfContents: () => [],
})

const emit = defineEmits<PostDetailEmits>()

// 响应式状态
const showShareMenu = ref(false)
const isLiked = ref(false)
const isBookmarked = ref(false)
const likeCount = ref((props.post as any).likes || 0)

// 分享选项
const shareOptions = [
  {
    name: 'copy',
    label: '复制链接',
    icon: 'heroicons:link'
  },
  {
    name: 'twitter',
    label: 'Twitter',
    icon: 'simple-icons:twitter'
  },
  {
    name: 'facebook',
    label: 'Facebook',
    icon: 'simple-icons:facebook'
  },
  {
    name: 'linkedin',
    label: 'LinkedIn',
    icon: 'simple-icons:linkedin'
  },
  {
    name: 'wechat',
    label: '微信',
    icon: 'simple-icons:wechat'
  },
  {
    name: 'weibo',
    label: '微博',
    icon: 'simple-icons:sinaweibo'
  }
]

// 使用已有的格式化工具函数
const formatDate = (date: string | Date | undefined): string => {
  if (!date) return ''
  return formatters.date.toChinese(date)
}

const formatNumber = (num: number): string => {
  return formatters.number.toShort(num)
}

// 获取当前页面URL - 使用工具函数优化
const getCurrentUrl = (): string => {
  if (process.client) {
    return formatters.url.ensureProtocol(window.location.href)
  }
  return formatters.url.ensureProtocol(`blogflow.example.com${props.post.path}`)
}

// 生成文章摘要 - 使用工具函数
const getExcerpt = (): string => {
  if (props.post.excerpt) return props.post.excerpt
  if (props.post.content) return formatters.text.excerpt(props.post.content, 150)
  return props.post.description || ''
}

// 事件处理
const handleBack = () => {
  emit('back')
  // 默认行为：返回上一页或博客列表页
  if (process.client) {
    if (window.history.length > 1) {
      window.history.back()
    } else {
      navigateTo('/blog')
    }
  }
}

const toggleShareMenu = () => {
  showShareMenu.value = !showShareMenu.value
}

const handleShare = async (shareOption: any) => {
  const url = getCurrentUrl()
  const title = props.post.title || 'BlogFlow'
  const description = getExcerpt()

  showShareMenu.value = false

  switch (shareOption.name) {
    case 'copy':
      if (process.client && navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(url)
          // 可以添加toast提示
          console.log('链接已复制到剪贴板')
        } catch (err) {
          console.error('复制失败:', err)
        }
      }
      break
    
    case 'twitter':
      const twitterParams = formatters.url.buildQuery({
        text: title,
        url: url
      })
      const twitterUrl = `https://twitter.com/intent/tweet?${twitterParams}`
      if (process.client) window.open(twitterUrl, '_blank')
      break
    
    case 'facebook':
      const facebookParams = formatters.url.buildQuery({
        u: url
      })
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?${facebookParams}`
      if (process.client) window.open(facebookUrl, '_blank')
      break
    
    case 'linkedin':
      const linkedinParams = formatters.url.buildQuery({
        url: url
      })
      const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?${linkedinParams}`
      if (process.client) window.open(linkedinUrl, '_blank')
      break
    
    default:
      // 其他分享方式的处理
      break
  }

  emit('share', shareOption.name, url)
}

const toggleLike = () => {
  const newLikedState = !isLiked.value
  isLiked.value = newLikedState
  likeCount.value += newLikedState ? 1 : -1
  emit('like', newLikedState)
}

const toggleBookmark = () => {
  const newBookmarkedState = !isBookmarked.value
  isBookmarked.value = newBookmarkedState
  emit('bookmark', newBookmarkedState)
}

const handleRelatedPostClick = (post: ContentPost) => {
  emit('related-post-click', post)
  // 默认导航到相关文章
  navigateTo(post.path)
}

const trackTocClick = (item: any) => {
  emit('toc-click', item)
}

// 监听点击外部关闭分享菜单
onMounted(() => {
  // 从localStorage读取点赞和收藏状态，使用安全解析
  if (process.client) {
    const postId = props.post.path
    const likedPosts: string[] = safeJsonParse(localStorage.getItem('likedPosts') || '', [])
    const bookmarkedPosts: string[] = safeJsonParse(localStorage.getItem('bookmarkedPosts') || '', [])
    
    isLiked.value = likedPosts.includes(postId)
    isBookmarked.value = bookmarkedPosts.includes(postId)
  }
})

// 监听状态变化，保存到localStorage - 使用安全解析优化
watch(isLiked, (newValue) => {
  if (process.client) {
    const postId = props.post.path
    const likedPosts: string[] = safeJsonParse(localStorage.getItem('likedPosts') || '', [])
    
    if (newValue && !likedPosts.includes(postId)) {
      likedPosts.push(postId)
    } else if (!newValue && likedPosts.includes(postId)) {
      const index = likedPosts.indexOf(postId)
      likedPosts.splice(index, 1)
    }
    
    localStorage.setItem('likedPosts', JSON.stringify(likedPosts))
  }
})

watch(isBookmarked, (newValue) => {
  if (process.client) {
    const postId = props.post.path
    const bookmarkedPosts: string[] = safeJsonParse(localStorage.getItem('bookmarkedPosts') || '', [])
    
    if (newValue && !bookmarkedPosts.includes(postId)) {
      bookmarkedPosts.push(postId)
    } else if (!newValue && bookmarkedPosts.includes(postId)) {
      const index = bookmarkedPosts.indexOf(postId)
      bookmarkedPosts.splice(index, 1)
    }
    
    localStorage.setItem('bookmarkedPosts', JSON.stringify(bookmarkedPosts))
  }
})
</script>

<style scoped>
.post-detail {
  --prose-body: theme('colors.gray.700');
  --prose-headings: theme('colors.gray.900');
  --prose-links: theme('colors.blue.600');
  --prose-bold: theme('colors.gray.900');
  --prose-code: theme('colors.gray.900');
  --prose-pre-bg: theme('colors.gray.100');
  --prose-quotes: theme('colors.gray.900');
}

.dark .post-detail {
  --prose-body: theme('colors.gray.300');
  --prose-headings: theme('colors.white');
  --prose-links: theme('colors.blue.400');
  --prose-bold: theme('colors.white');
  --prose-code: theme('colors.white');
  --prose-pre-bg: theme('colors.gray.800');
  --prose-quotes: theme('colors.white');
}

/* 目录导航样式 */
.toc-nav ul {
  list-style: none;
  padding: 0;
}

.toc-nav a {
  position: relative;
  padding-left: 0.75rem;
}

.toc-nav a:before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: currentColor;
  opacity: 0.5;
}

.toc-nav a:hover:before {
  opacity: 1;
}

/* 文章内容样式增强 */
.post-content :deep(h1),
.post-content :deep(h2),
.post-content :deep(h3),
.post-content :deep(h4),
.post-content :deep(h5),
.post-content :deep(h6) {
  scroll-margin-top: 2rem;
}

.post-content :deep(img) {
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.post-content :deep(blockquote) {
  position: relative;
  padding-left: 1.5rem;
  border-left: 4px solid theme('colors.blue.500');
  background: theme('colors.blue.50');
  border-radius: 0.5rem;
  margin: 1.5rem 0;
  padding: 1rem 1rem 1rem 1.5rem;
}

.dark .post-content :deep(blockquote) {
  background: theme('colors.blue.900/20');
  color: theme('colors.blue.100');
}

.post-content :deep(code) {
  background-color: theme('colors.gray.100');
  color: theme('colors.gray.900');
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
}

.dark .post-content :deep(code) {
  background-color: theme('colors.gray.800');
  color: theme('colors.gray.100');
}

.post-content :deep(pre) {
  background-color: theme('colors.gray.100') !important;
  border-radius: 0.5rem;
  padding: 1rem;
  overflow-x: auto;
}

.dark .post-content :deep(pre) {
  background-color: theme('colors.gray.800') !important;
}

.post-content :deep(pre code) {
  background: none;
  padding: 0;
  color: inherit;
}

/* 链接样式 */
.post-content :deep(a) {
  color: theme('colors.blue.600');
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s ease;
}

.post-content :deep(a:hover) {
  border-bottom-color: theme('colors.blue.600');
}

.dark .post-content :deep(a) {
  color: theme('colors.blue.400');
}

.dark .post-content :deep(a:hover) {
  border-bottom-color: theme('colors.blue.400');
}

/* 表格样式 */
.post-content :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 1.5rem 0;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.post-content :deep(th),
.post-content :deep(td) {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid theme('colors.gray.200');
}

.post-content :deep(th) {
  background-color: theme('colors.gray.50');
  font-weight: 600;
}

.dark .post-content :deep(th) {
  background-color: theme('colors.gray.800');
}

.dark .post-content :deep(th),
.dark .post-content :deep(td) {
  border-bottom-color: theme('colors.gray.700');
}

/* 分享菜单动画 */
.share-menu-enter-active,
.share-menu-leave-active {
  transition: all 0.2s ease;
}

.share-menu-enter-from,
.share-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
