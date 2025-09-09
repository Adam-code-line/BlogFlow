<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- 导航栏 -->
    <nav class="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <NuxtLink to="/" class="text-2xl font-bold text-gray-900 dark:text-white">
              BlogFlow
            </NuxtLink>
          </div>
          
          <div class="hidden md:block">
            <div class="ml-10 flex items-baseline space-x-4">
              <NuxtLink 
                to="/" 
                class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium"
                :class="{ 'text-blue-600 dark:text-blue-400': $route.path === '/' }"
              >
                首页
              </NuxtLink>
              <NuxtLink 
                to="/blog" 
                class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium"
                :class="{ 'text-blue-600 dark:text-blue-400': $route.path.startsWith('/blog') }"
              >
                博客
              </NuxtLink>
              <NuxtLink 
                to="/about" 
                class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium"
                :class="{ 'text-blue-600 dark:text-blue-400': $route.path === '/about' }"
              >
                关于
              </NuxtLink>
              <NuxtLink 
                to="/contact" 
                class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium"
                :class="{ 'text-blue-600 dark:text-blue-400': $route.path === '/contact' }"
              >
                联系
              </NuxtLink>
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <UButton
              icon="i-heroicons-moon"
              variant="ghost"
              color="neutral"
              size="sm"
              aria-label="切换主题"
            />
          </div>
        </div>
      </div>
    </nav>

    <!-- 页面内容 -->
    <slot />

    <!-- 页脚 -->
    <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-20">
      <div class="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-4 gap-8">
          <div class="md:col-span-2">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">BlogFlow</h3>
            <p class="text-gray-600 dark:text-gray-300 mb-4">
              一个专注于技术分享和知识传播的个人博客平台。
            </p>
            <p class="text-gray-500 dark:text-gray-400 text-sm">
              © 2025 BlogFlow. 保留所有权利。
            </p>
          </div>
          
          <div>
            <h4 class="font-semibold text-gray-900 dark:text-white mb-4">快速链接</h4>
            <ul class="space-y-2 text-gray-600 dark:text-gray-300">
              <li><NuxtLink to="/" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">首页</NuxtLink></li>
              <li><NuxtLink to="/blog" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">博客</NuxtLink></li>
              <li><NuxtLink to="/about" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">关于</NuxtLink></li>
              <li><NuxtLink to="/contact" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">联系</NuxtLink></li>
            </ul>
          </div>
          
          <div>
            <h4 class="font-semibold text-gray-900 dark:text-white mb-4">分类</h4>
            <ul class="space-y-2 text-gray-600 dark:text-gray-300">
              <li><NuxtLink to="/blog?category=前端开发" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">前端开发</NuxtLink></li>
              <li><NuxtLink to="/blog?category=前端工程化" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">前端工程化</NuxtLink></li>
              <li><NuxtLink to="/blog?category=生活感悟" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">生活感悟</NuxtLink></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// 博客布局专用配置
</script>
