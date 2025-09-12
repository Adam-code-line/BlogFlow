<template>
  <footer class="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-t border-gray-200 dark:border-gray-700">
    <!-- 主要内容区域 -->
    <div class="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        <!-- 品牌信息 -->
        <div class="lg:col-span-2">
          <div class="flex items-center space-x-3 mb-4">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Icon name="heroicons:document-text" class="w-6 h-6 text-white" />
            </div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">BlogFlow</h3>
          </div>
          <p class="text-gray-600 dark:text-gray-300 mb-6 max-w-md leading-relaxed">
            一个专注于技术分享和知识传播的现代化博客平台。分享最新的前端技术、开发经验和编程思考。
          </p>
          
          <!-- 社交媒体链接 -->
          <div class="flex space-x-4">
            <a 
              v-for="social in socialLinks" 
              :key="social.name"
              :href="social.url" 
              :title="social.name"
              target="_blank"
              rel="noopener noreferrer"
              class="social-link"
              @click="trackSocialClick(social.name)"
            >
              <Icon :name="social.icon" class="w-5 h-5" />
            </a>
          </div>
        </div>

        <!-- 快速链接 -->
        <div>
          <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">快速链接</h4>
          <ul class="space-y-3">
            <li v-for="link in quickLinks" :key="link.path">
              <NuxtLink 
                :to="link.path" 
                class="footer-link"
              >
                <Icon :name="link.icon" class="w-4 h-4" />
                <span>{{ link.name }}</span>
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- 分类目录 -->
        <div>
          <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">文章分类</h4>
          <ul class="space-y-3">
            <li v-for="category in categories" :key="category.name">
              <NuxtLink 
                :to="category.path" 
                class="footer-link"
              >
                <Icon :name="category.icon" class="w-4 h-4" />
                <span>{{ category.name }}</span>
                <span class="ml-auto text-xs text-gray-400 dark:text-gray-500">({{ category.count }})</span>
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- 底部信息 -->
      <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <!-- 版权信息 -->
          <div class="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <p>© {{ currentYear }} BlogFlow. 保留所有权利。</p>
            <span class="hidden md:inline">|</span>
            <p class="flex items-center space-x-1">
              <span>由</span>
              <Icon name="simple-icons:nuxtdotjs" class="w-4 h-4 text-green-500" />
              <span>Nuxt 4</span>
              <span>强力驱动</span>
            </p>
          </div>

          <!-- 法律链接和工具 -->
          <div class="flex items-center space-x-6 text-sm">
            <NuxtLink to="/privacy" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200">
              隐私政策
            </NuxtLink>
            <NuxtLink to="/terms" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200">
              使用条款
            </NuxtLink>
            <button 
              @click="scrollToTop"
              class="flex items-center space-x-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200"
            >
              <Icon name="heroicons:arrow-up" class="w-4 h-4" />
              <span>返回顶部</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 装饰性背景 -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div class="absolute -bottom-1 -left-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 dark:opacity-5 animate-pulse"></div>
      <div class="absolute -bottom-1 -right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 dark:opacity-5 animate-pulse" style="animation-delay: 2s"></div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// 当前年份
const currentYear = new Date().getFullYear()

// 社交媒体链接
const socialLinks = [
  {
    name: 'GitHub',
    url: 'https://github.com',
    icon: 'simple-icons:github'
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com',
    icon: 'simple-icons:twitter'
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com',
    icon: 'simple-icons:linkedin'
  },
  {
    name: 'RSS',
    url: '/rss.xml',
    icon: 'heroicons:rss'
  }
]

// 快速链接
const quickLinks = [
  {
    name: '首页',
    path: '/',
    icon: 'heroicons:home'
  },
  {
    name: '博客',
    path: '/blog',
    icon: 'heroicons:document-text'
  },
  {
    name: '用户社区',
    path: '/users',
    icon: 'heroicons:users'
  },
  {
    name: '关于',
    path: '/about',
    icon: 'heroicons:user'
  },
  {
    name: '联系',
    path: '/contact',
    icon: 'heroicons:envelope'
  },
  {
    name: '归档',
    path: '/archive',
    icon: 'heroicons:archive-box'
  }
]

// 文章分类
const categories = [
  {
    name: '前端开发',
    path: '/blog?category=前端开发',
    icon: 'heroicons:code-bracket',
    count: 15
  },
  {
    name: '前端工程化',
    path: '/blog?category=前端工程化',
    icon: 'heroicons:cog-6-tooth',
    count: 8
  },
  {
    name: 'JavaScript',
    path: '/blog?category=JavaScript',
    icon: 'simple-icons:javascript',
    count: 12
  },
  {
    name: 'Vue.js',
    path: '/blog?category=Vue.js',
    icon: 'simple-icons:vuedotjs',
    count: 10
  },
  {
    name: '生活感悟',
    path: '/blog?category=生活感悟',
    icon: 'heroicons:heart',
    count: 5
  }
]

// 获取分析工具实例
const { $analytics } = useNuxtApp()

// 方法
const scrollToTop = () => {
  if (process.client) {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
}

const trackSocialClick = (platform: string) => {
  $analytics?.trackEvent({
    action: 'social_click',
    category: 'footer',
    label: platform
  })
}
</script>

<style scoped>
/* 社交媒体链接样式 */
.social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  color: rgb(107 114 128);
  background-color: rgb(243 244 246);
  transition: all 0.2s ease-in-out;
}

.dark .social-link {
  color: rgb(156 163 175);
  background-color: rgb(55 65 81);
}

.social-link:hover {
  color: rgb(37 99 235);
  background-color: rgb(219 234 254);
  transform: translateY(-2px);
}

.dark .social-link:hover {
  color: rgb(96 165 250);
  background-color: rgb(30 58 138);
}

/* 页脚链接样式 */
.footer-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgb(107 114 128);
  transition: color 0.2s ease-in-out;
  font-size: 0.875rem;
}

.dark .footer-link {
  color: rgb(156 163 175);
}

.footer-link:hover {
  color: rgb(37 99 235);
}

.dark .footer-link:hover {
  color: rgb(96 165 250);
}

/* 相对定位容器 */
footer {
  position: relative;
}

/* 动画优化 */
@media (prefers-reduced-motion: reduce) {
  .animate-pulse {
    animation: none;
  }
}
</style>