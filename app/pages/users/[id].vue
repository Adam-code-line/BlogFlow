<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <Header />
    
    <!-- 加载状态 -->
    <Loading v-if="loading" />
    
    <!-- 错误状态 -->
    <ErrorMessage v-else-if="error" :message="error" />
    
    <!-- 用户详情内容 -->
    <main v-else-if="user" class="max-w-7xl mx-auto px-4 py-8">
      <!-- 用户头部信息 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 mb-8">
        <div class="relative">
          <!-- 背景图 -->
          <div class="h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg"></div>
          
          <!-- 用户头像和基本信息 -->
          <div class="relative px-6 pb-6">
            <div class="flex flex-col sm:flex-row sm:items-end sm:space-x-6">
              <!-- 头像 -->
              <div class="relative -mt-16 mb-4 sm:mb-0">
                <img
                  :src="user.avatar || defaultAvatar"
                  :alt="user.displayName"
                  class="h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 object-cover bg-white dark:bg-gray-800"
                  @error="handleImageError"
                >
                <!-- 在线状态 -->
                <div class="absolute bottom-2 right-2 h-6 w-6 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
              </div>
              
              <!-- 基本信息 -->
              <div class="flex-1 min-w-0">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                      {{ user.displayName }}
                    </h1>
                    <p class="text-gray-500 dark:text-gray-400">@{{ user.username }}</p>
                    <!-- 角色和状态 -->
                    <div class="flex items-center space-x-2 mt-2">
                      <span 
                        class="inline-block px-2 py-1 text-xs font-medium rounded-full"
                        :class="getRoleStyle(user.role)"
                      >
                        {{ getRoleLabel(user.role) }}
                      </span>
                      <span v-if="user.isProfileComplete" class="text-blue-500" title="资料完整">
                        <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                        </svg>
                      </span>
                    </div>
                  </div>
                  
                  <!-- 操作按钮 -->
                  <div class="flex space-x-3 mt-4 sm:mt-0">
                    <UiButton color="primary" variant="solid" @click="followUser">
                      {{ isFollowing ? '取消关注' : '关注' }}
                    </UiButton>
                    <UiButton color="neutral" variant="outline" @click="sendMessage">
                      发消息
                    </UiButton>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 用户简介 -->
            <div v-if="user.bio" class="mt-6">
              <p class="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                {{ user.bio }}
              </p>
            </div>
            
            <!-- 详细信息 -->
            <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div v-if="user.location" class="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span>{{ user.location }}</span>
              </div>
              
              <div v-if="user.website" class="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                </svg>
                <a 
                  :href="user.website" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {{ formatters.url.extractDomain(user.website) }}
                </a>
              </div>
              
              <div v-if="user.occupation" class="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"></path>
                </svg>
                <span>{{ user.occupation }}</span>
              </div>
              
              <div class="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m-6 4v8m0-8a2 2 0 012-2h0a2 2 0 012 2v0"></path>
                </svg>
                <span>{{ formatters.date.toRelative(joinDate) }} 加入</span>
              </div>
            </div>
            
            <!-- 技能标签 -->
            <div v-if="user.skills && user.skills.length > 0" class="mt-6">
              <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-3">技能标签</h3>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="skill in user.skills"
                  :key="skill"
                  class="inline-block px-3 py-1 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {{ skill }}
                </span>
              </div>
            </div>
            
            <!-- 社交链接 -->
            <div v-if="hasSocialLinks" class="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
              <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-3">社交链接</h3>
              <div class="flex space-x-4">
                <a
                  v-if="user.socialLinks.github"
                  :href="user.socialLinks.github"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span>GitHub</span>
                </a>
                
                <a
                  v-if="user.socialLinks.twitter"
                  :href="user.socialLinks.twitter"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-500 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  <span>Twitter</span>
                </a>
                
                <a
                  v-if="user.socialLinks.website"
                  :href="user.socialLinks.website"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-green-500 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                  </svg>
                  <span>网站</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 内容区域 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 左侧内容 -->
        <div class="lg:col-span-2 space-y-8">
          <!-- 标签页导航 -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
            <div class="border-b border-gray-200 dark:border-gray-700">
              <nav class="flex space-x-8 px-6" aria-label="Tabs">
                <button
                  v-for="tab in tabs"
                  :key="tab.id"
                  class="py-4 px-1 border-b-2 font-medium text-sm transition-colors"
                  :class="activeTab === tab.id 
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'"
                  @click="activeTab = tab.id"
                >
                  {{ tab.name }}
                  <span 
                    v-if="tab.count !== undefined" 
                    class="ml-2 py-0.5 px-2 rounded-full text-xs"
                    :class="activeTab === tab.id 
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' 
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'"
                  >
                    {{ formatters.number.toShort(tab.count) }}
                  </span>
                </button>
              </nav>
            </div>
            
            <!-- 标签页内容 -->
            <div class="p-6">
              <!-- 文章列表 -->
              <div v-if="activeTab === 'posts'">
                <div v-if="userPosts.length > 0" class="space-y-6">
                  <PostCard 
                    v-for="post in userPosts" 
                    :key="post.path" 
                    :post="post"
                    :show-author="false"
                  />
                </div>
                <div v-else class="text-center py-12">
                  <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">暂无文章</h3>
                  <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">该用户还没有发布任何文章。</p>
                </div>
              </div>
              
              <!-- 活动时间线 -->
              <div v-else-if="activeTab === 'activity'" class="space-y-4">
                <p class="text-gray-500 dark:text-gray-400">活动时间线功能开发中...</p>
              </div>
              
              <!-- 关注的用户 -->
              <div v-else-if="activeTab === 'following'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <p class="text-gray-500 dark:text-gray-400">关注列表功能开发中...</p>
              </div>
              
              <!-- 粉丝 -->
              <div v-else-if="activeTab === 'followers'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <p class="text-gray-500 dark:text-gray-400">粉丝列表功能开发中...</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 右侧边栏 -->
        <div class="space-y-6">
          <!-- 统计信息 -->
          <UserStats :stats="user.stats" />
          
          <!-- 最近活动 -->
          <UiCard class="border border-gray-200 dark:border-gray-700">
            <div class="p-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">最近活动</h3>
              <div class="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <div class="flex items-center space-x-2">
                  <div class="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span>{{ formatters.date.toRelative(joinDate) }} 加入了BlogFlow</span>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="h-2 w-2 bg-blue-500 rounded-full"></div>
                  <span>发布了 {{ user.stats.postsCount }} 篇文章</span>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="h-2 w-2 bg-purple-500 rounded-full"></div>
                  <span>拥有 {{ formatters.number.toShort(user.stats.followersCount) }} 名粉丝</span>
                </div>
              </div>
            </div>
          </UiCard>
          
          <!-- 相似用户推荐 -->
          <UiCard class="border border-gray-200 dark:border-gray-700">
            <div class="p-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">相似用户</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">推荐功能开发中...</p>
            </div>
          </UiCard>
        </div>
      </div>
    </main>
    
    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
import type { User, PublicUser } from '~/types/user'
import type { ContentPost } from '~/types'
import { useApi, useApiState } from '~/composables/useApi'
import { formatters } from '~/utils/format'

// 组件导入
import Header from '~/components/layout/Header.vue'
import Footer from '~/components/layout/Footer.vue'
import Loading from '~/components/common/Loading.vue'
import ErrorMessage from '~/components/common/ErrorMessage.vue'
import UserStats from '~/components/user/UserStats.vue'
import PostCard from '~/components/blog/PostCard.vue'

// 路由参数
const route = useRoute()
const userId = computed(() => {
  const params = route.params as { id?: string }
  const id = params.id
  return Array.isArray(id) ? id[0] : (id || '')
})

// API 和状态管理
const { user: userApi, blog: blogApi } = useApi()
const { loading, error, execute } = useApiState()

// 响应式数据
const user = ref<PublicUser | null>(null)
const userPosts = ref<ContentPost[]>([])
const isFollowing = ref(false)
const activeTab = ref('posts')

// 标签页配置
const tabs = computed(() => [
  { id: 'posts', name: '文章', count: user.value?.stats.postsCount },
  { id: 'activity', name: '动态' },
  { id: 'following', name: '关注', count: 0 }, // 临时设为0，因为PublicUser.stats中没有这个字段
  { id: 'followers', name: '粉丝', count: user.value?.stats.followersCount }
])

// 计算属性
const defaultAvatar = computed(() => {
  return `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face`
})

const hasSocialLinks = computed(() => {
  if (!user.value) return false
  const links = user.value.socialLinks
  return links.github || links.twitter || links.website
})

const joinDate = computed(() => {
  if (!user.value) return new Date()
  const now = new Date()
  return new Date(now.getTime() - user.value.stats.joinedDaysAgo * 24 * 60 * 60 * 1000)
})

// 方法
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = defaultAvatar.value
}

const getRoleStyle = (role: string) => {
  // 使用颜色工具生成一致的样式
  const baseColor = formatters.color.getTagColor(role)
  const styles = {
    admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    author: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    editor: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    subscriber: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    guest: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  }
  return styles[role as keyof typeof styles] || styles.subscriber
}

const getRoleLabel = (role: string) => {
  // 可以使用text formatter的标题化功能
  const labels = {
    admin: '管理员',
    author: '作者',
    editor: '编辑',
    subscriber: '订阅者',
    guest: '访客'
  }
  return labels[role as keyof typeof labels] || formatters.text.slugToTitle(role)
}

// 获取用户信息
const fetchUser = async () => {
  const result = await execute(
    () => userApi.getUserById(userId.value),
    {
      errorMessage: '获取用户信息失败'
    }
  )

  if (result) {
    // 将完整用户信息转换为PublicUser格式
    const fullUser = result as any // 临时类型断言，实际应该是User类型
    user.value = {
      id: fullUser.id,
      username: fullUser.username,
      displayName: fullUser.profile?.displayName || fullUser.username,
      avatar: fullUser.profile?.avatar,
      bio: fullUser.profile?.bio,
      location: fullUser.profile?.location,
      website: fullUser.profile?.website,
      socialLinks: fullUser.profile?.socialLinks || {},
      occupation: fullUser.profile?.occupation,
      skills: fullUser.profile?.skills || [],
      stats: {
        postsCount: fullUser.stats?.postsCount || 0,
        followersCount: fullUser.stats?.followersCount || 0,
        joinedDaysAgo: fullUser.stats?.joinedDaysAgo || 0
      },
      role: fullUser.role,
      isProfileComplete: fullUser.isProfileComplete || false
    } as PublicUser
  }
}

// 获取用户文章
const fetchUserPosts = async () => {
  if (!user.value) return

  const result = await execute(
    () => blogApi.getPostsByAuthor(userId.value),
    {
      errorMessage: '获取用户文章失败'
    }
  )

  if (result) {
    // 将BlogPost转换为ContentPost格式
    userPosts.value = (result as any[]).map((post: any) => ({
      ...post,
      path: `/blog/${post.slug || post.id}`, // 添加path字段
      category: post.category || { name: '未分类', slug: 'uncategorized' },
      tags: post.tags || []
    })) as ContentPost[]
  }
}

// 关注/取消关注用户
const followUser = async () => {
  if (!user.value) return

  const action = isFollowing.value ? 'unfollow' : 'follow'
  const result = await execute(
    () => userApi.followUser(userId.value, action),
    {
      successMessage: isFollowing.value ? '已取消关注' : '已关注',
      errorMessage: '操作失败',
      showToast: true
    }
  )

  if (result) {
    isFollowing.value = !isFollowing.value
    // 更新粉丝数量
    if (user.value) {
      user.value.stats.followersCount += isFollowing.value ? 1 : -1
    }
  }
}

// 发送消息
const sendMessage = () => {
  // 这里可以集成消息功能
  alert('消息功能开发中...')
}

// 监听标签页切换
watch(activeTab, (newTab) => {
  if (newTab === 'posts' && userPosts.value.length === 0) {
    fetchUserPosts()
  }
})

// 页面初始化
onMounted(async () => {
  await fetchUser()
  if (user.value) {
    await fetchUserPosts()
  }
})

// SEO 元数据
useSeoMeta({
  title: computed(() => user.value ? `${user.value.displayName} - BlogFlow` : '用户资料 - BlogFlow'),
  ogTitle: computed(() => user.value ? `${user.value.displayName} - BlogFlow` : '用户资料 - BlogFlow'),
  description: computed(() => user.value?.bio || '查看用户在 BlogFlow 上的资料和文章。'),
  ogDescription: computed(() => user.value?.bio || '查看用户在 BlogFlow 上的资料和文章。'),
  ogImage: computed(() => user.value?.avatar || defaultAvatar.value),
  twitterCard: 'summary_large_image',
})
</script>
