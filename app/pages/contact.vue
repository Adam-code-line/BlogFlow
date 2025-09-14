<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
    <!-- 主要内容 -->
    <main>
      <!-- Hero 部分 -->
      <section class="py-20 px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            联系我
          </h1>
          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12">
            如果你有任何问题或合作意向，欢迎联系我
          </p>
        </div>
      </section>

      <!-- 联系方式展示 -->
      <section class="pb-20 px-4 sm:px-6 lg:px-8">
        <div class="max-w-5xl mx-auto">
          <!-- 主要联系信息卡片 -->
          <Card 
            variant="elevated" 
            hoverable 
            class="mb-12"
            padding="xl"
          >
            <div class="text-center mb-12">
              <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">联系方式</h2>
              <p class="text-xl text-gray-600 dark:text-gray-300">随时欢迎与我交流</p>
            </div>

            <!-- 联系方式网格 -->
            <div class="grid md:grid-cols-3 gap-8 mb-12">
              <!-- 邮箱联系 -->
              <Card 
                variant="bordered" 
                hoverable 
                clickable
                class="text-center group cursor-pointer"
                @click="handleEmailClick"
              >
                <div class="p-6">
                  <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon name="heroicons:envelope" class="w-8 h-8 text-white" />
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">邮箱联系</h3>
                  <p class="text-gray-600 dark:text-gray-300 mb-2">{{ author.email }}</p>
                  <p class="text-sm text-blue-600 dark:text-blue-400">点击发送邮件</p>
                </div>
              </Card>

              <!-- 响应时间 -->
              <Card variant="bordered" class="text-center">
                <div class="p-6">
                  <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <Icon name="heroicons:clock" class="w-8 h-8 text-white" />
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">响应时间</h3>
                  <p class="text-gray-600 dark:text-gray-300 mb-2">通常在24小时内回复</p>
                  <p class="text-sm text-purple-600 dark:text-purple-400">工作日更快</p>
                </div>
              </Card>

              <!-- 位置信息 -->
              <Card variant="bordered" class="text-center">
                <div class="p-6">
                  <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                    <Icon name="heroicons:map-pin" class="w-8 h-8 text-white" />
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">所在位置</h3>
                  <p class="text-gray-600 dark:text-gray-300 mb-2">{{ author.location }}</p>
                  <p class="text-sm text-green-600 dark:text-green-400">远程协作友好</p>
                </div>
              </Card>
            </div>

            <!-- 社交媒体链接 -->
            <div class="border-t border-gray-200 dark:border-gray-700 pt-8">
              <div class="text-center mb-8">
                <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">关注我的动态</h3>
                <p class="text-gray-600 dark:text-gray-300">在这些平台上与我互动</p>
              </div>
              
              <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card 
                  v-for="social in socialLinks" 
                  :key="social.name"
                  variant="bordered" 
                  hoverable 
                  clickable
                  class="group cursor-pointer"
                  @click="() => handleSocialClick(social.href)"
                >
                  <div class="p-4 text-center">
                    <div class="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                         :class="getSocialBgClass(social.name)">
                      <Icon :name="social.icon" class="w-6 h-6 text-white" />
                    </div>
                    <h4 class="font-semibold text-gray-900 dark:text-white mb-1">{{ social.name }}</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400">点击访问</p>
                  </div>
                </Card>
              </div>
            </div>
          </Card>

          <!-- 快速行动区域 -->
          <div class="grid md:grid-cols-2 gap-8">
            <!-- 邮件快速发送 -->
            <Card variant="elevated" hoverable class="group">
              <div class="p-8 text-center">
                <div class="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <Icon name="heroicons:paper-airplane" class="w-10 h-10 text-white" />
                </div>
                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">发送邮件</h3>
                <p class="text-gray-600 dark:text-gray-300 mb-6">有项目想法或技术问题？直接发邮件给我</p>
                <UiButton 
                  size="lg" 
                  color="primary" 
                  class="w-full"
                  @click="handleEmailClick"
                >
                  <Icon name="heroicons:envelope" class="w-5 h-5 mr-2" />
                  打开邮件客户端
                </UiButton>
              </div>
            </Card>

            <!-- 查看简历/作品 -->
            <Card variant="elevated" hoverable class="group">
              <div class="p-8 text-center">
                <div class="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <Icon name="heroicons:document-text" class="w-10 h-10 text-white" />
                </div>
                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">了解更多</h3>
                <p class="text-gray-600 dark:text-gray-300 mb-6">想了解我的技能和经验？查看我的详细信息</p>
                <UiButton 
                  size="lg" 
                  color="secondary" 
                  variant="outline"
                  class="w-full"
                  to="/about"
                >
                  <Icon name="heroicons:user" class="w-5 h-5 mr-2" />
                  查看关于页面
                </UiButton>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <!-- 合作类型 -->
      <section class="py-20 bg-white dark:bg-gray-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">合作领域</h2>
            <p class="text-xl text-gray-600 dark:text-gray-300">我乐于参与的合作类型</p>
          </div>
          
          <div class="grid md:grid-cols-3 gap-8">
            <!-- 技术咨询 -->
            <Card variant="bordered" hoverable class="text-center group">
              <div class="p-8">
                <div class="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Icon name="heroicons:light-bulb" class="w-8 h-8 text-white" />
                </div>
                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">技术咨询</h3>
                <p class="text-gray-600 dark:text-gray-300 mb-6">前端架构设计、技术选型、性能优化等技术相关问题的咨询和解决方案</p>
                <ul class="text-left text-sm text-gray-500 dark:text-gray-400 space-y-2">
                  <li>• Vue.js / Nuxt.js 开发</li>
                  <li>• 前端工程化配置</li>
                  <li>• 性能优化建议</li>
                  <li>• 代码审查服务</li>
                </ul>
              </div>
            </Card>

            <!-- 项目合作 -->
            <Card variant="bordered" hoverable class="text-center group">
              <div class="p-8">
                <div class="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Icon name="heroicons:code-bracket" class="w-8 h-8 text-white" />
                </div>
                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">项目合作</h3>
                <p class="text-gray-600 dark:text-gray-300 mb-6">参与有趣的开源项目或商业项目，共同打造优质的产品和解决方案</p>
                <ul class="text-left text-sm text-gray-500 dark:text-gray-400 space-y-2">
                  <li>• 开源项目贡献</li>
                  <li>• 全栈开发合作</li>
                  <li>• 产品原型设计</li>
                  <li>• 长期技术伙伴</li>
                </ul>
              </div>
            </Card>

            <!-- 技术分享 -->
            <Card variant="bordered" hoverable class="text-center group">
              <div class="p-8">
                <div class="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Icon name="heroicons:academic-cap" class="w-8 h-8 text-white" />
                </div>
                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">技术分享</h3>
                <p class="text-gray-600 dark:text-gray-300 mb-6">参与技术交流活动、演讲分享、在线讲座等，共同推动技术社区发展</p>
                <ul class="text-left text-sm text-gray-500 dark:text-gray-400 space-y-2">
                  <li>• 技术演讲分享</li>
                  <li>• 在线技术讲座</li>
                  <li>• 博客文章合作</li>
                  <li>• 技术社区建设</li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <!-- 常见问题 -->
      <section class="py-20 px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto">
          <Card variant="elevated" padding="xl">
            <div class="text-center mb-12">
              <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">常见问题</h2>
              <p class="text-xl text-gray-600 dark:text-gray-300">关于合作的一些常见疑问</p>
            </div>
            
            <div class="space-y-8">
              <div class="border-b border-gray-200 dark:border-gray-700 pb-6">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">如何开始合作？</h3>
                <p class="text-gray-600 dark:text-gray-300">直接通过邮件联系我，简要描述您的项目需求和合作方式。我会在24小时内回复，并安排进一步的沟通。</p>
              </div>
              
              <div class="border-b border-gray-200 dark:border-gray-700 pb-6">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">收费标准如何？</h3>
                <p class="text-gray-600 dark:text-gray-300">根据项目复杂度和时间投入制定合理的收费标准。技术咨询和小型项目可以灵活协商，长期合作有优惠政策。</p>
              </div>
              
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">支持远程合作吗？</h3>
                <p class="text-gray-600 dark:text-gray-300">是的，我支持远程合作。通过在线会议、项目管理工具等方式保持高效沟通，确保项目顺利进行。</p>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthorInfo, usePageConfig, useFormattedSocialLinks } from '~/composables/useSiteConfig'

// 从全局配置获取数据
const author = useAuthorInfo()
const pageConfig = usePageConfig()
const socialLinks = useFormattedSocialLinks()
const contactConfig = computed(() => pageConfig.value.contact)

// 社交媒体背景颜色映射
const getSocialBgClass = (socialName: string): string => {
  const bgClasses = {
    'GitHub': 'bg-gray-900',
    'Twitter': 'bg-blue-400',
    'LinkedIn': 'bg-blue-600',
    'Email': 'bg-red-600',
    'Website': 'bg-green-600'
  }
  return bgClasses[socialName as keyof typeof bgClasses] || 'bg-gray-600'
}

// 处理邮件链接点击
const handleEmailClick = () => {
  if (process.client) {
    window.location.href = `mailto:${author.value.email}`
  }
}

// 处理社交链接点击
const handleSocialClick = (href: string) => {
  if (process.client) {
    window.open(href, '_blank')
  }
}

// 设置页面元数据
useSeoMeta({
  title: '联系我 - BlogFlow',
  ogTitle: '联系我 - BlogFlow',
  description: '有任何问题或合作意向？随时联系我，我很期待与您的交流。',
  ogDescription: '有任何问题或合作意向？随时联系我，我很期待与您的交流。',
  ogImage: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1200&h=630&fit=crop',
  twitterCard: 'summary_large_image',
})
</script>