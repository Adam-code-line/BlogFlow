<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- 顶部导航栏 -->
    <nav class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- 左侧 Logo 和导航 -->
          <div class="flex items-center">
            <!-- 移动端菜单按钮 -->
            <button 
              @click="sidebarOpen = !sidebarOpen"
              class="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <Icon name="i-heroicons-bars-3" class="h-6 w-6" />
            </button>
            
            <!-- Logo -->
            <div class="flex-shrink-0 flex items-center ml-4 md:ml-0">
              <NuxtLink to="/admin" class="flex items-center space-x-3">
                <div class="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Icon name="i-heroicons-document-text" class="h-5 w-5 text-white" />
                </div>
                <span class="text-xl font-bold text-gray-900 dark:text-white">BlogFlow Admin</span>
              </NuxtLink>
            </div>
          </div>
          
          <!-- 右侧用户菜单 -->
          <div class="flex items-center space-x-4">
            <!-- 返回前台按钮 -->
            <NuxtLink
              to="/"
              class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <Icon name="i-heroicons-arrow-left" class="w-4 h-4 mr-2" />
              返回前台
            </NuxtLink>
            
            <!-- 主题切换 -->
            <ThemeToggle />
            
            <!-- 通知图标 -->
            <UButton
              variant="ghost"
              size="sm"
              square
            >
              <Icon name="i-heroicons-bell" class="h-5 w-5" />
            </UButton>
            
            <!-- 用户下拉菜单 -->
            <UDropdown :items="userMenuItems" :popper="{ placement: 'bottom-end' }">
              <UAvatar
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                alt="用户头像"
                size="sm"
                class="cursor-pointer"
              />
            </UDropdown>
          </div>
        </div>
      </div>
    </nav>

    <div class="flex">
      <!-- 侧边栏 -->
      <div 
        :class="[
          'fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        ]"
      >
        <!-- 侧边栏内容 -->
        <div class="flex flex-col h-full pt-16 md:pt-0">
          <!-- 导航菜单 -->
          <nav class="flex-1 px-4 py-6 space-y-2">
            <div class="space-y-1">
              <!-- 仪表盘 -->
              <NuxtLink
                to="/admin"
                :class="adminMenuItemClass"
                @click="sidebarOpen = false"
              >
                <Icon name="i-heroicons-squares-2x2" class="h-5 w-5" />
                <span>仪表盘</span>
              </NuxtLink>
              
              <!-- 文章管理 -->
              <div class="space-y-1">
                <div class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 py-2">
                  内容管理
                </div>
                <NuxtLink
                  to="/admin/posts"
                  :class="adminMenuItemClass"
                  @click="sidebarOpen = false"
                >
                  <Icon name="i-heroicons-document-text" class="h-5 w-5" />
                  <span>文章管理</span>
                </NuxtLink>
                <NuxtLink
                  to="/admin/posts/new"
                  :class="adminMenuItemClass"
                  @click="sidebarOpen = false"
                >
                  <Icon name="i-heroicons-plus-circle" class="h-5 w-5" />
                  <span>写文章</span>
                </NuxtLink>
                <NuxtLink
                  to="/admin/categories"
                  :class="adminMenuItemClass"
                  @click="sidebarOpen = false"
                >
                  <Icon name="i-heroicons-tag" class="h-5 w-5" />
                  <span>分类标签</span>
                </NuxtLink>
              </div>
              
              <!-- 系统设置 -->
              <div class="space-y-1">
                <div class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 py-2">
                  系统设置
                </div>
                <NuxtLink
                  to="/admin/settings"
                  :class="adminMenuItemClass"
                  @click="sidebarOpen = false"
                >
                  <Icon name="i-heroicons-cog-6-tooth" class="h-5 w-5" />
                  <span>网站设置</span>
                </NuxtLink>
                <NuxtLink
                  to="/admin/analytics"
                  :class="adminMenuItemClass"
                  @click="sidebarOpen = false"
                >
                  <Icon name="i-heroicons-chart-bar" class="h-5 w-5" />
                  <span>统计分析</span>
                </NuxtLink>
              </div>
            </div>
          </nav>
          
          <!-- 底部链接 -->
          <div class="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
            <NuxtLink
              to="/"
              class="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <Icon name="i-heroicons-arrow-left" class="h-4 w-4" />
              <span>返回网站</span>
            </NuxtLink>
          </div>
        </div>
      </div>
      
      <!-- 移动端遮罩 -->
      <div 
        v-if="sidebarOpen"
        class="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
        @click="sidebarOpen = false"
      ></div>

      <!-- 主内容区域 -->
      <div class="flex-1 md:ml-0">
        <main class="p-6">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUIStore } from '~/stores/ui'

// 侧边栏状态
const sidebarOpen = ref(false)

// UI Store
const uiStore = useUIStore()

// 菜单项样式类
const adminMenuItemClass = computed(() => [
  'group flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200',
  'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white',
  'hover:bg-gray-100 dark:hover:bg-gray-700',
  'router-link-active:bg-blue-50 dark:router-link-active:bg-blue-900/20',
  'router-link-active:text-blue-700 dark:router-link-active:text-blue-300'
])

// 用户菜单项
const userMenuItems = [
  [{
    label: '个人资料',
    icon: 'i-heroicons-user-circle',
    to: '/admin/profile'
  }],
  [{
    label: '设置',
    icon: 'i-heroicons-cog-6-tooth',
    to: '/admin/settings'
  }],
  [{
    label: '退出登录',
    icon: 'i-heroicons-arrow-right-on-rectangle',
    click: () => {
      // 处理退出登录
      console.log('退出登录')
    }
  }]
]

// 监听路由变化，关闭移动端侧边栏
watch(() => useRoute().path, () => {
  sidebarOpen.value = false
})

// 页面挂载时初始化
onMounted(async () => {
  await uiStore.init()
})
</script>