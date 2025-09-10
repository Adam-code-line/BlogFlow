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
              <NuxtLink to="/about" class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium">关于</NuxtLink>
              <NuxtLink to="/contact" class="text-blue-600 dark:text-blue-400 px-3 py-2 rounded-md text-sm font-medium">联系</NuxtLink>
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
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            联系我
          </h1>
          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12">
            有任何问题或想法？我很期待与你的交流和合作
          </p>
        </div>
      </section>

      <!-- 联系方式和表单 -->
      <section class="pb-20 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
          <div class="grid lg:grid-cols-2 gap-12">
            <!-- 联系信息 -->
            <div>
              <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-8">联系方式</h2>
                
                <!-- 邮箱 -->
                <div class="flex items-start space-x-4 mb-6">
                  <div class="flex-shrink-0">
                    <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <Icon name="heroicons:envelope" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">邮箱</h3>
                    <p class="text-gray-600 dark:text-gray-300">hello@blogflow.dev</p>
                    <p class="text-gray-600 dark:text-gray-300">work@blogflow.dev</p>
                  </div>
                </div>

                <!-- 社交媒体 -->
                <div class="flex items-start space-x-4 mb-6">
                  <div class="flex-shrink-0">
                    <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                      <Icon name="heroicons:globe-alt" class="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">社交媒体</h3>
                    <div class="space-y-1">
                      <a href="#" class="text-blue-600 dark:text-blue-400 hover:underline block">GitHub</a>
                      <a href="#" class="text-blue-600 dark:text-blue-400 hover:underline block">LinkedIn</a>
                      <a href="#" class="text-blue-600 dark:text-blue-400 hover:underline block">Twitter</a>
                    </div>
                  </div>
                </div>

                <!-- 响应时间 -->
                <div class="flex items-start space-x-4 mb-8">
                  <div class="flex-shrink-0">
                    <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                      <Icon name="heroicons:clock" class="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">响应时间</h3>
                    <p class="text-gray-600 dark:text-gray-300">通常在24-48小时内回复</p>
                  </div>
                </div>

                <!-- 社交链接 -->
                <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">关注我</h3>
                  <div class="flex space-x-4">
                    <a href="#" class="flex items-center justify-center w-10 h-10 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                      <Icon name="simple-icons:github" class="w-5 h-5" />
                    </a>
                    <a href="#" class="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Icon name="simple-icons:linkedin" class="w-5 h-5" />
                    </a>
                    <a href="#" class="flex items-center justify-center w-10 h-10 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors">
                      <Icon name="simple-icons:twitter" class="w-5 h-5" />
                    </a>
                    <a href="#" class="flex items-center justify-center w-10 h-10 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                      <Icon name="simple-icons:youtube" class="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <!-- 联系表单 -->
            <div>
              <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-8">发送消息</h2>
                
                <form @submit.prevent="submitForm" class="space-y-6">
                  <!-- 姓名 -->
                  <div>
                    <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      姓名 *
                    </label>
                    <UInput
                      id="name"
                      v-model="form.name"
                      placeholder="请输入您的姓名"
                      size="lg"
                      :color="errors.name ? 'error' : 'primary'"
                    />
                    <p v-if="errors.name" class="mt-1 text-sm text-red-600 dark:text-red-400">
                      {{ errors.name }}
                    </p>
                  </div>

                  <!-- 邮箱 -->
                  <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      邮箱 *
                    </label>
                    <UInput
                      id="email"
                      v-model="form.email"
                      type="email"
                      placeholder="请输入您的邮箱"
                      size="lg"
                      :color="errors.email ? 'error' : 'primary'"
                    />
                    <p v-if="errors.email" class="mt-1 text-sm text-red-600 dark:text-red-400">
                      {{ errors.email }}
                    </p>
                  </div>

                  <!-- 主题 -->
                  <div>
                    <label for="subject" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      主题 *
                    </label>
                    <USelect
                      v-model="form.subject"
                      :options="subjectOptions"
                      placeholder="请选择主题"
                      size="lg"
                      :color="errors.subject ? 'error' : 'primary'"
                    />
                    <p v-if="errors.subject" class="mt-1 text-sm text-red-600 dark:text-red-400">
                      {{ errors.subject }}
                    </p>
                  </div>

                  <!-- 消息内容 -->
                  <div>
                    <label for="message" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      消息内容 *
                    </label>
                    <UTextarea
                      id="message"
                      v-model="form.message"
                      placeholder="请输入您想说的话..."
                      :rows="6"
                      size="lg"
                      :color="errors.message ? 'error' : 'primary'"
                    />
                    <p v-if="errors.message" class="mt-1 text-sm text-red-600 dark:text-red-400">
                      {{ errors.message }}
                    </p>
                  </div>

                  <!-- 提交按钮 -->
                  <div>
                    <UButton
                      type="submit"
                      size="lg"
                      color="primary"
                      :loading="isSubmitting"
                      :disabled="isSubmitting"
                      block
                    >
                      {{ isSubmitting ? '发送中...' : '发送消息' }}
                    </UButton>
                  </div>
                </form>
              </div>
            </div>
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
            <UCard class="text-center hover:shadow-xl transition-shadow duration-300">
              <div class="p-6">
                <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="heroicons:light-bulb" class="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">技术咨询</h3>
                <ul class="text-gray-600 dark:text-gray-300 space-y-2">
                  <li>前端架构设计</li>
                  <li>Vue/Nuxt项目咨询</li>
                  <li>代码审查和优化</li>
                  <li>技术选型建议</li>
                </ul>
              </div>
            </UCard>

            <!-- 内容合作 -->
            <UCard class="text-center hover:shadow-xl transition-shadow duration-300">
              <div class="p-6">
                <div class="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="heroicons:pencil-square" class="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">内容合作</h3>
                <ul class="text-gray-600 dark:text-gray-300 space-y-2">
                  <li>技术文章联合创作</li>
                  <li>播客嘉宾邀请</li>
                  <li>技术分享和演讲</li>
                  <li>开源项目协作</li>
                </ul>
              </div>
            </UCard>

            <!-- 商业合作 -->
            <UCard class="text-center hover:shadow-xl transition-shadow duration-300">
              <div class="p-6">
                <div class="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="heroicons:briefcase" class="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">商业合作</h3>
                <ul class="text-gray-600 dark:text-gray-300 space-y-2">
                  <li>自由职业项目</li>
                  <li>技术顾问服务</li>
                  <li>培训和工作坊</li>
                  <li>产品技术合作</li>
                </ul>
              </div>
            </UCard>
          </div>
        </div>
      </section>

      <!-- 常见问题 -->
      <section class="py-20 px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">常见问题</h2>
            
            <div class="space-y-8">
              <div>
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">技术问题</h3>
                <p class="text-gray-600 dark:text-gray-300 mb-2">如果你有具体的技术问题，建议：</p>
                <ul class="text-gray-600 dark:text-gray-300 list-disc list-inside space-y-1 ml-4">
                  <li>提供完整的错误信息</li>
                  <li>包含相关的代码片段</li>
                  <li>说明你已经尝试过的解决方案</li>
                </ul>
              </div>

              <div>
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">合作咨询</h3>
                <p class="text-gray-600 dark:text-gray-300 mb-2">如果你想讨论合作机会，请告诉我：</p>
                <ul class="text-gray-600 dark:text-gray-300 list-disc list-inside space-y-1 ml-4">
                  <li>项目的具体需求</li>
                  <li>预期的时间线</li>
                  <li>预算范围（如适用）</li>
                </ul>
              </div>

              <div class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
                <h3 class="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-2">💡 温馨提示</h3>
                <p class="text-blue-800 dark:text-blue-200">
                  我通常在工作日的9:00-18:00（GMT+8）较为活跃。如果是开源项目相关的问题，建议在GitHub上创建Issue。
                  对于学习相关的问题，我很乐意提供指导和建议。
                </p>
              </div>
            </div>
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
// 表单数据
const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

// 表单验证错误
const errors = ref<Record<string, string>>({})

// 提交状态
const isSubmitting = ref(false)

// 主题选项
const subjectOptions = [
  { label: '技术咨询', value: 'tech-consulting' },
  { label: '项目合作', value: 'project-collaboration' },
  { label: '内容合作', value: 'content-collaboration' },
  { label: '技术分享', value: 'tech-sharing' },
  { label: '其他问题', value: 'other' }
]

// 表单验证
function validateForm() {
  errors.value = {}
  
  if (!form.value.name.trim()) {
    errors.value.name = '请输入您的姓名'
  }
  
  if (!form.value.email.trim()) {
    errors.value.email = '请输入您的邮箱'
  } else if (!/\S+@\S+\.\S+/.test(form.value.email)) {
    errors.value.email = '请输入有效的邮箱地址'
  }
  
  if (!form.value.subject) {
    errors.value.subject = '请选择主题'
  }
  
  if (!form.value.message.trim()) {
    errors.value.message = '请输入消息内容'
  } else if (form.value.message.trim().length < 10) {
    errors.value.message = '消息内容至少需要10个字符'
  }
  
  return Object.keys(errors.value).length === 0
}

// 提交表单
async function submitForm() {
  if (!validateForm()) {
    return
  }
  
  isSubmitting.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 成功提示
    alert('消息发送成功！我会尽快回复您。')
    
    // 重置表单
    form.value = {
      name: '',
      email: '',
      subject: '',
      message: ''
    }
    
  } catch (error) {
    alert('发送失败，请稍后重试。')
  } finally {
    isSubmitting.value = false
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