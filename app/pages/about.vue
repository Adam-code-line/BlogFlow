<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
    <!-- 主要内容 -->
    <main>
      <!-- Hero 部分 -->
      <section class="py-20 px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-16">
            <div class="mb-8">
              <img :src="author.avatar" 
                   :alt="author.name + '的头像'" 
                   class="w-40 h-40 rounded-full mx-auto mb-6 border-4 border-white shadow-xl">
            </div>
            <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              关于{{ author.name }}
            </h1>
            <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {{ author.bio }}
            </p>
          </div>

          <!-- 内容区域 -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
            <div class="prose prose-lg dark:prose-invert max-w-none">
              <h2 class="text-2xl font-bold mb-4">个人简介</h2>
              <div class="mb-6 space-y-4">
                <p><strong>姓名：</strong>{{ author.name }}</p>
                <p><strong>职业：</strong>{{ author.profession }}</p>
                <p v-if="author.company"><strong>公司：</strong>{{ author.company }}</p>
                <p><strong>地点：</strong>{{ author.location }}</p>
                <p><strong>个人介绍：</strong>{{ author.bio }}</p>
              </div>
              
              <h2 class="text-2xl font-bold mb-4">个人兴趣</h2>
              <ul class="mb-6">
                <li v-for="interest in aboutConfig.interests" :key="interest">{{ interest }}</li>
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
              <div v-for="(timeline, index) in aboutConfig.timeline" :key="index" class="relative flex items-start">
                <div class="absolute left-6 w-4 h-4 bg-blue-600 rounded-full border-4 border-white dark:border-gray-800"></div>
                <div class="ml-16">
                  <UiCard>
                    <div class="p-6">
                      <div class="flex items-center justify-between mb-2">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ timeline.title }}</h3>
                        <UBadge :label="timeline.year" color="primary" />
                      </div>
                      <div v-if="timeline.company" class="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {{ timeline.company }}{{ timeline.location ? ` · ${timeline.location}` : '' }}
                      </div>
                      <p class="text-gray-600 dark:text-gray-300">
                        {{ timeline.description }}
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
  </div>
</template>

<script setup lang="ts">
import { useAuthorInfo, usePageConfig, useSocialLinks, useFormattedSocialLinks, useCurrentYear } from '~/composables/useSiteConfig'

// 从全局配置获取数据
const author = useAuthorInfo()
const pageConfig = usePageConfig()
const socialLinks = useFormattedSocialLinks()
const currentYear = useCurrentYear()

// 获取关于页面特定配置
const aboutConfig = computed(() => pageConfig.value.about)

// 设置页面元数据
useSeoMeta({
  title: '关于我 - BlogFlow',
  ogTitle: '关于我 - BlogFlow',
  description: author.value.bio,
  ogDescription: author.value.bio,
  ogImage: author.value.avatar,
  twitterCard: 'summary_large_image',
})
</script>