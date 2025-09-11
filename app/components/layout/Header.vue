<template>
  <header class="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-all duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo 和网站名称 -->
        <div class="flex items-center">
          <NuxtLink to="/" class="flex items-center space-x-3 group">
            <!-- Logo 图标 -->
            <div class="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <Icon name="heroicons:document-text" class="w-5 h-5 text-white" />
            </div>
            <!-- 网站名称 -->
            <h1 class="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
              BlogFlow
            </h1>
          </NuxtLink>
        </div>

        <!-- 桌面端导航菜单 -->
        <nav class="hidden md:block">
          <div class="flex items-center space-x-1">
            <NuxtLink 
              to="/" 
              class="nav-link"
              :class="{ 'nav-link-active': $route.path === '/' }"
            >
              <Icon name="heroicons:home" class="w-4 h-4" />
              <span>首页</span>
            </NuxtLink>
            <NuxtLink 
              to="/blog" 
              class="nav-link"
              :class="{ 'nav-link-active': $route.path.startsWith('/blog') }"
            >
              <Icon name="heroicons:document-text" class="w-4 h-4" />
              <span>博客</span>
            </NuxtLink>
            <NuxtLink 
              to="/about" 
              class="nav-link"
              :class="{ 'nav-link-active': $route.path === '/about' }"
            >
              <Icon name="heroicons:user" class="w-4 h-4" />
              <span>关于</span>
            </NuxtLink>
            <NuxtLink 
              to="/contact" 
              class="nav-link"
              :class="{ 'nav-link-active': $route.path === '/contact' }"
            >
              <Icon name="heroicons:envelope" class="w-4 h-4" />
              <span>联系</span>
            </NuxtLink>
          </div>
        </nav>

        <!-- 右侧操作区 -->
        <div class="flex items-center space-x-3">
          <!-- 搜索按钮 -->
          <button 
            class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
            @click="toggleSearch"
          >
            <Icon name="heroicons:magnifying-glass" class="w-5 h-5" />
          </button>

          <!-- 主题切换 -->
          <ThemeToggle />

          <!-- 移动端菜单按钮 -->
          <button 
            class="md:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
            @click="toggleMobileMenu"
          >
            <Icon :name="mobileMenuOpen ? 'heroicons:x-mark' : 'heroicons:bars-3'" class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- 移动端导航菜单 -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="mobileMenuOpen" class="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div class="px-4 py-2 space-y-1">
          <NuxtLink 
            to="/" 
            class="mobile-nav-link"
            :class="{ 'mobile-nav-link-active': $route.path === '/' }"
            @click="closeMobileMenu"
          >
            <Icon name="heroicons:home" class="w-5 h-5" />
            <span>首页</span>
          </NuxtLink>
          <NuxtLink 
            to="/blog" 
            class="mobile-nav-link"
            :class="{ 'mobile-nav-link-active': $route.path.startsWith('/blog') }"
            @click="closeMobileMenu"
          >
            <Icon name="heroicons:document-text" class="w-5 h-5" />
            <span>博客</span>
          </NuxtLink>
          <NuxtLink 
            to="/about" 
            class="mobile-nav-link"
            :class="{ 'mobile-nav-link-active': $route.path === '/about' }"
            @click="closeMobileMenu"
          >
            <Icon name="heroicons:user" class="w-5 h-5" />
            <span>关于</span>
          </NuxtLink>
          <NuxtLink 
            to="/contact" 
            class="mobile-nav-link"
            :class="{ 'mobile-nav-link-active': $route.path === '/contact' }"
            @click="closeMobileMenu"
          >
            <Icon name="heroicons:envelope" class="w-5 h-5" />
            <span>联系</span>
          </NuxtLink>
        </div>
      </div>
    </Transition>

    <!-- 搜索模态框 -->
    <UiModal v-model="searchModalOpen" size="lg" :show-close="true" title="搜索文章">
      <div class="p-6">
        <div class="relative mb-4">
          <Icon name="heroicons:magnifying-glass" class="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="输入关键词搜索文章..."
            class="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @keyup.enter="performSearch"
          />
        </div>
        
        <!-- 搜索结果或热门标签 -->
        <div v-if="!searchQuery" class="space-y-3">
          <h4 class="text-sm font-medium text-gray-900 dark:text-white">热门标签</h4>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="tag in popularTags"
              :key="tag"
              class="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
              @click="searchTag(tag)"
            >
              {{ tag }}
            </button>
          </div>
        </div>
      </div>
    </UiModal>
  </header>
</template>

<script setup lang="ts">
import ThemeToggle from '~/components/common/ThemeToggle.vue'

// 响应式状态
const mobileMenuOpen = ref(false)
const searchModalOpen = ref(false)
const searchQuery = ref('')

// 热门标签数据
const popularTags = ['Vue.js', 'Nuxt.js', 'TypeScript', '前端开发', '工程化']

// 方法
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const toggleSearch = () => {
  searchModalOpen.value = true
}

const performSearch = () => {
  if (searchQuery.value.trim()) {
    navigateTo(`/blog?search=${encodeURIComponent(searchQuery.value)}`)
    searchModalOpen.value = false
    searchQuery.value = ''
  }
}

const searchTag = (tag: string) => {
  navigateTo(`/blog?tag=${encodeURIComponent(tag)}`)
  searchModalOpen.value = false
}

// 监听路由变化，关闭移动端菜单
watch(() => useRoute().path, () => {
  mobileMenuOpen.value = false
})
</script>

<style scoped>
/* 桌面端导航链接样式 */
.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: rgb(55 65 81);
  transition: all 0.2s ease-in-out;
}

.dark .nav-link {
  color: rgb(209 213 219);
}

.nav-link:hover {
  color: rgb(37 99 235);
  background-color: rgb(243 244 246);
}

.dark .nav-link:hover {
  color: rgb(96 165 250);
  background-color: rgb(31 41 55);
}

.nav-link-active {
  color: rgb(37 99 235);
  background-color: rgb(239 246 255);
}

.dark .nav-link-active {
  color: rgb(96 165 250);
  background-color: rgba(37, 99, 235, 0.2);
}

/* 移动端导航链接样式 */
.mobile-nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  color: rgb(55 65 81);
  transition: all 0.2s ease-in-out;
}

.dark .mobile-nav-link {
  color: rgb(209 213 219);
}

.mobile-nav-link:hover {
  color: rgb(37 99 235);
  background-color: rgb(243 244 246);
}

.dark .mobile-nav-link:hover {
  color: rgb(96 165 250);
  background-color: rgb(31 41 55);
}

.mobile-nav-link-active {
  color: rgb(37 99 235);
  background-color: rgb(239 246 255);
}

.dark .mobile-nav-link-active {
  color: rgb(96 165 250);
  background-color: rgba(37, 99, 235, 0.2);
}

/* 背景模糊效果优化 */
.backdrop-blur-md {
  backdrop-filter: blur(12px);
}

/* 移除移动设备上的点击高亮 */
button {
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}
</style>