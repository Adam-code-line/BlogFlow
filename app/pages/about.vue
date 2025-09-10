<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
    <!-- 导航栏 -->
    <nav class="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">BlogFlow</h1>
          </div>
          <div class="hidden md:block">
            <div class="ml-10 flex items-baseline space-x-4">
              <NuxtLink to="/" class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium">首页</NuxtLink>
              <NuxtLink to="/blog" class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium">博客</NuxtLink>
              <NuxtLink to="/about" class="text-blue-600 dark:text-blue-400 px-3 py-2 rounded-md text-sm font-medium">关于</NuxtLink>
              <NuxtLink to="/contact" class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium">联系</NuxtLink>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <button class="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              <Icon name="heroicons:moon" class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- 主要内容 -->
    <main>
      <!-- Hero 部分 -->
      <section class="py-20 px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-16">
            <div class="mb-8">
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face" 
                   alt="头像" 
                   class="w-40 h-40 rounded-full mx-auto mb-6 border-4 border-white shadow-xl">
            </div>
            <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              关于我
            </h1>
            <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              一名充满热情的全栈开发者，专注于现代Web技术和用户体验设计
            </p>
          </div>

          <!-- 内容区域 -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
            <div class="prose prose-lg dark:prose-invert max-w-none">
              <h2 class="text-2xl font-bold mb-4">个人简介</h2>
              <p class="mb-6">
                你好！我是一名充满热情的全栈开发者，专注于现代Web技术和用户体验设计。我相信技术的力量能够改变世界，让生活变得更美好。
              </p>
              
              <h2 class="text-2xl font-bold mb-4">个人理念</h2>
              <p class="mb-4">我坚信：</p>
              <ul class="mb-6">
                <li><strong>代码质量至上</strong>: 编写可维护、可扩展的代码</li>
                <li><strong>用户体验优先</strong>: 以用户为中心的产品思维</li>
                <li><strong>持续学习</strong>: 在快速变化的技术世界中保持学习热情</li>
                <li><strong>知识分享</strong>: 通过博客、开源项目回馈社区</li>
              </ul>

              <h2 class="text-2xl font-bold mb-4">开源贡献</h2>
              <p class="mb-4">我积极参与开源社区，贡献了多个项目：</p>
              <ul class="mb-6">
                <li><strong>Vue生态工具</strong>: 维护多个Vue相关的工具库</li>
                <li><strong>Nuxt模块</strong>: 开发了几个实用的Nuxt模块</li>
                <li><strong>UI组件库</strong>: 参与维护团队内部的组件库</li>
              </ul>

              <h2 class="text-2xl font-bold mb-4">个人兴趣</h2>
              <p class="mb-4">除了编程，我还喜欢：</p>
              <ul class="mb-6">
                <li>📚 <strong>阅读</strong>: 技术书籍、科幻小说、哲学思考</li>
                <li>🎵 <strong>音乐</strong>: 古典音乐、爵士乐欣赏</li>
                <li>🎨 <strong>设计</strong>: UI/UX设计、平面设计</li>
                <li>🌍 <strong>旅行</strong>: 探索不同的文化和风景</li>
                <li>📷 <strong>摄影</strong>: 记录生活中的美好瞬间</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- 技能展示 -->
      <section class="py-20 bg-white dark:bg-gray-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">技术技能</h2>
            <p class="text-xl text-gray-600 dark:text-gray-300">我擅长的技术栈和工具</p>
          </div>
          
          <div class="grid md:grid-cols-3 gap-8">
            <!-- 前端技能 -->
            <UiCard class="text-center">
              <div class="p-6">
                <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="heroicons:computer-desktop" class="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">前端开发</h3>
                <div class="grid grid-cols-3 gap-4">
                  <div class="flex flex-col items-center">
                    <Icon name="logos:vue" class="w-8 h-8 mb-2" />
                    <span class="text-sm text-gray-600 dark:text-gray-300">Vue.js</span>
                  </div>
                  <div class="flex flex-col items-center">
                    <Icon name="logos:nuxt-icon" class="w-8 h-8 mb-2" />
                    <span class="text-sm text-gray-600 dark:text-gray-300">Nuxt</span>
                  </div>
                  <div class="flex flex-col items-center">
                    <Icon name="logos:typescript-icon" class="w-8 h-8 mb-2" />
                    <span class="text-sm text-gray-600 dark:text-gray-300">TypeScript</span>
                  </div>
                </div>
              </div>
            </UiCard>

            <!-- 后端技能 -->
            <UiCard class="text-center">
              <div class="p-6">
                <div class="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="heroicons:server" class="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">后端开发</h3>
                <div class="grid grid-cols-3 gap-4">
                  <div class="flex flex-col items-center">
                    <Icon name="logos:nodejs-icon" class="w-8 h-8 mb-2" />
                    <span class="text-sm text-gray-600 dark:text-gray-300">Node.js</span>
                  </div>
                  <div class="flex flex-col items-center">
                    <Icon name="logos:python" class="w-8 h-8 mb-2" />
                    <span class="text-sm text-gray-600 dark:text-gray-300">Python</span>
                  </div>
                  <div class="flex flex-col items-center">
                    <Icon name="logos:postgresql" class="w-8 h-8 mb-2" />
                    <span class="text-sm text-gray-600 dark:text-gray-300">PostgreSQL</span>
                  </div>
                </div>
              </div>
            </UiCard>

            <!-- 工具技能 -->
            <UiCard class="text-center">
              <div class="p-6">
                <div class="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="heroicons:wrench-screwdriver" class="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">开发工具</h3>
                <div class="grid grid-cols-3 gap-4">
                  <div class="flex flex-col items-center">
                    <Icon name="logos:git-icon" class="w-8 h-8 mb-2" />
                    <span class="text-sm text-gray-600 dark:text-gray-300">Git</span>
                  </div>
                  <div class="flex flex-col items-center">
                    <Icon name="logos:docker-icon" class="w-8 h-8 mb-2" />
                    <span class="text-sm text-gray-600 dark:text-gray-300">Docker</span>
                  </div>
                  <div class="flex flex-col items-center">
                    <Icon name="logos:figma" class="w-8 h-8 mb-2" />
                    <span class="text-sm text-gray-600 dark:text-gray-300">Figma</span>
                  </div>
                </div>
              </div>
            </UiCard>
          </div>
        </div>
      </section>

      <!-- 个人时间线 -->
      <section class="py-20 px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">职业历程</h2>
            <p class="text-xl text-gray-600 dark:text-gray-300">我的技术成长之路</p>
          </div>

          <div class="relative">
            <!-- 时间线 -->
            <div class="absolute left-8 top-0 bottom-0 w-px bg-gray-300 dark:bg-gray-600"></div>
            
            <!-- 时间线项目 -->
            <div class="space-y-12">
              <div class="relative flex items-start">
                <div class="absolute left-6 w-4 h-4 bg-blue-600 rounded-full border-4 border-white dark:border-gray-800"></div>
                <div class="ml-16">
                  <UiCard>
                    <div class="p-6">
                      <div class="flex items-center justify-between mb-2">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">高级前端工程师</h3>
                        <UBadge label="2022-至今" color="primary" />
                      </div>
                      <p class="text-gray-600 dark:text-gray-300">
                        负责大型SPA应用的架构设计和开发，建立前端开发规范和最佳实践。
                      </p>
                    </div>
                  </UiCard>
                </div>
              </div>

              <div class="relative flex items-start">
                <div class="absolute left-6 w-4 h-4 bg-green-600 rounded-full border-4 border-white dark:border-gray-800"></div>
                <div class="ml-16">
                  <UiCard>
                    <div class="p-6">
                      <div class="flex items-center justify-between mb-2">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">全栈开发工程师</h3>
                        <UBadge label="2020-2022" color="success" />
                      </div>
                      <p class="text-gray-600 dark:text-gray-300">
                        独立负责多个项目的全栈开发，积累了丰富的用户体验优化经验。
                      </p>
                    </div>
                  </UiCard>
                </div>
              </div>

              <div class="relative flex items-start">
                <div class="absolute left-6 w-4 h-4 bg-purple-600 rounded-full border-4 border-white dark:border-gray-800"></div>
                <div class="ml-16">
                  <UiCard>
                    <div class="p-6">
                      <div class="flex items-center justify-between mb-2">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">计算机科学学士</h3>
                        <UBadge label="2016-2020" color="secondary" />
                      </div>
                      <p class="text-gray-600 dark:text-gray-300">
                        主修计算机科学与技术，毕业设计：基于Vue.js的在线学习平台。
                      </p>
                    </div>
                  </UiCard>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 联系CTA -->
      <section class="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">让我们一起创造精彩</h2>
          <p class="text-xl text-blue-100 mb-8">
            如果你有有趣的项目想法，或者想要技术交流，随时联系我！
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <UiButton size="lg" color="neutral" variant="solid" class="px-8 py-3" to="/contact">
              联系我
            </UiButton>
            <UiButton size="lg" color="neutral" variant="outline" class="px-8 py-3" to="/blog">
              查看博客
            </UiButton>
          </div>
        </div>
      </section>
    </main>

    <!-- 页脚 -->
    <footer class="bg-gray-900 text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-4 gap-8">
          <div class="md:col-span-2">
            <h3 class="text-xl font-bold mb-4">BlogFlow</h3>
            <p class="text-gray-300 mb-4">
              一个专注于技术分享和知识传播的个人博客平台。
            </p>
            <p class="text-gray-400 text-sm">
              © 2025 BlogFlow. 保留所有权利。
            </p>
          </div>
          <div>
            <h4 class="font-semibold mb-4">快速链接</h4>
            <ul class="space-y-2 text-gray-300">
              <li><NuxtLink to="/" class="hover:text-white transition-colors">首页</NuxtLink></li>
              <li><NuxtLink to="/blog" class="hover:text-white transition-colors">博客</NuxtLink></li>
              <li><NuxtLink to="/about" class="hover:text-white transition-colors">关于</NuxtLink></li>
              <li><NuxtLink to="/contact" class="hover:text-white transition-colors">联系</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-4">社交媒体</h4>
            <div class="flex space-x-4">
              <a href="#" class="text-gray-300 hover:text-white transition-colors">
                <Icon name="simple-icons:github" class="w-5 h-5" />
              </a>
              <a href="#" class="text-gray-300 hover:text-white transition-colors">
                <Icon name="simple-icons:twitter" class="w-5 h-5" />
              </a>
              <a href="#" class="text-gray-300 hover:text-white transition-colors">
                <Icon name="simple-icons:linkedin" class="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// 设置页面元数据
useSeoMeta({
  title: '关于我 - BlogFlow',
  ogTitle: '关于我 - BlogFlow',
  description: '了解更多关于BlogFlow博主的信息，包括技术背景、工作经历和个人理念。',
  ogDescription: '了解更多关于BlogFlow博主的信息，包括技术背景、工作经历和个人理念。',
  ogImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=1200&h=630&fit=crop&crop=face',
  twitterCard: 'summary_large_image',
})
</script>