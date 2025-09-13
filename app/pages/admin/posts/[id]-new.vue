<template>
  <div class="max-w-7xl mx-auto space-y-6">
    <!-- 页面头部 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ isNew ? '创建新文章' : '编辑文章' }}
            </h1>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {{ isNew ? '创建一篇新的博客文章' : '编辑现有的博客文章' }}
            </p>
          </div>
          <div class="flex items-center space-x-3">
            <NuxtLink
              to="/admin/posts"
              class="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Icon name="heroicons:arrow-left" class="w-4 h-4 mr-2" />
              返回列表
            </NuxtLink>
            <button
              @click="saveAsDraft"
              :disabled="saving"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
            >
              <Icon v-if="saving" name="heroicons:arrow-path" class="w-4 h-4 mr-2 animate-spin" />
              <Icon v-else name="heroicons:document" class="w-4 h-4 mr-2" />
              {{ saving ? '保存中...' : '保存草稿' }}
            </button>
            <button
              @click="publishPost"
              :disabled="publishing"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <Icon v-if="publishing" name="heroicons:arrow-path" class="w-4 h-4 mr-2 animate-spin" />
              <Icon v-else name="heroicons:paper-airplane" class="w-4 h-4 mr-2" />
              {{ publishing ? '发布中...' : '发布文章' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 左侧主要内容 -->
      <div class="lg:col-span-2 space-y-6">
        <!-- 基本信息 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">基本信息</h3>
          </div>
          <div class="p-6 space-y-4">
            <!-- 标题 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                文章标题 <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.title"
                type="text"
                placeholder="输入文章标题"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <!-- 描述 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                文章描述
              </label>
              <textarea
                v-model="form.description"
                rows="3"
                placeholder="输入文章描述，将显示在文章列表和SEO中"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              ></textarea>
            </div>

            <!-- 封面图片 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                封面图片
              </label>
              <div class="space-y-3">
                <input
                  v-model="form.cover"
                  type="url"
                  placeholder="请输入图片URL或点击上传"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <div class="flex space-x-2">
                  <button
                    @click="uploadCover"
                    type="button"
                    class="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-xs leading-4 font-medium rounded text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Icon name="heroicons:cloud-arrow-up" class="w-4 h-4 mr-1" />
                    上传图片
                  </button>
                  <button
                    @click="selectFromUnsplash"
                    type="button"
                    class="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-xs leading-4 font-medium rounded text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Icon name="heroicons:photo" class="w-4 h-4 mr-1" />
                    选择图片
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 文章内容 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">文章内容</h3>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                字数: {{ wordCount }} | 预计阅读: {{ readingTime }} 分钟
              </div>
            </div>
          </div>
          <div class="p-6">
            <CherryMarkdownEditor
              v-model="form.content"
              height="600px"
              placeholder="开始编写您的文章内容..."
            />
          </div>
        </div>
      </div>

      <!-- 右侧侧边栏 -->
      <div class="lg:col-span-1 space-y-6">
        <!-- 发布设置 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">发布设置</h3>
          </div>
          <div class="p-6 space-y-4">
            <!-- 分类 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                选择分类
              </label>
              <select
                v-model="form.category"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">选择分类</option>
                <option v-for="option in categoryOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </div>

            <!-- 标签 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                标签
              </label>
              <div class="space-y-2">
                <input
                  v-model="tagsInput"
                  type="text"
                  placeholder="输入标签，用逗号分隔"
                  @keyup.enter="updateTags"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <div v-if="form.tags.length > 0" class="flex flex-wrap gap-2">
                  <span
                    v-for="tag in form.tags"
                    :key="tag"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                  >
                    {{ tag }}
                    <button
                      @click="form.tags = form.tags.filter(t => t !== tag)"
                      class="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800"
                    >
                      <Icon name="heroicons:x-mark" class="w-3 h-3" />
                    </button>
                  </span>
                </div>
              </div>
            </div>

            <!-- 发布时间 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                发布时间
              </label>
              <input
                v-model="form.publishedAt"
                type="datetime-local"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <!-- 设为特色文章 -->
            <div class="flex items-center">
              <input
                id="featured"
                v-model="form.featured"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
              />
              <label for="featured" class="ml-2 block text-sm text-gray-900 dark:text-white">
                设为特色文章
              </label>
            </div>
          </div>
        </div>

        <!-- SEO 设置 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">SEO 设置</h3>
          </div>
          <div class="p-6 space-y-4">
            <!-- URL 路径 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                文章URL路径
              </label>
              <input
                v-model="form.slug"
                type="text"
                placeholder="article-url-slug"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <!-- Meta 描述 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Meta 描述
              </label>
              <textarea
                v-model="form.metaDescription"
                rows="3"
                placeholder="搜索引擎显示的描述"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              ></textarea>
            </div>

            <!-- 关键词 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                SEO关键词
              </label>
              <input
                v-model="form.keywords"
                type="text"
                placeholder="关键词，用逗号分隔"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>

        <!-- 文章统计 (编辑模式) -->
        <div v-if="!isNew" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">文章统计</h3>
          </div>
          <div class="p-6">
            <dl class="grid grid-cols-1 gap-4">
              <div class="text-center">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">浏览量</dt>
                <dd class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{{ stats.views }}</dd>
              </div>
              <div class="text-center">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">点赞数</dt>
                <dd class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{{ stats.likes }}</dd>
              </div>
              <div class="text-center">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">评论数</dt>
                <dd class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{{ stats.comments }}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 导入组件
import CherryMarkdownEditor from '~/components/editor/CherryMarkdownEditor.vue'

// 设置布局
definePageMeta({
  layout: 'admin'
})

// 获取路由参数
const route = useRoute()
const router = useRouter()
const postId = (route.params as any).id as string || 'new'
const isNew = postId === 'new'

// 页面标题
useHead({
  title: `${isNew ? '创建新文章' : '编辑文章'} - BlogFlow Admin`
})

// 响应式数据
const saving = ref(false)
const publishing = ref(false)
const tagsInput = ref('')

// 表单数据
const form = ref({
  title: '',
  description: '',
  content: '',
  cover: '',
  category: '',
  tags: [] as string[],
  publishedAt: '',
  featured: false,
  slug: '',
  metaDescription: '',
  keywords: ''
})

// 统计数据
const stats = ref({
  views: 1250,
  likes: 89,
  comments: 23
})

// 计算属性
const wordCount = computed(() => {
  return form.value.content.length
})

const readingTime = computed(() => {
  const wordsPerMinute = 200
  const words = form.value.content.split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
})

// 选项数据
const categoryOptions = [
  { label: '技术', value: '技术' },
  { label: '设计', value: '设计' },
  { label: '产品', value: '产品' },
  { label: '生活', value: '生活' },
  { label: '思考', value: '思考' }
]

// 方法
const updateTags = () => {
  if (tagsInput.value) {
    const newTags = tagsInput.value
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag && !form.value.tags.includes(tag))
    
    form.value.tags.push(...newTags)
    tagsInput.value = ''
  }
}

const uploadCover = () => {
  // 这里实现图片上传逻辑
  console.log('上传封面图片')
}

const selectFromUnsplash = () => {
  // 这里实现从 Unsplash 选择图片
  const unsplashImages = [
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1200&h=630&fit=crop'
  ]
  const selectedImage = unsplashImages[Math.floor(Math.random() * unsplashImages.length)]
  if (selectedImage) {
    form.value.cover = selectedImage
  }
}

const saveAsDraft = async () => {
  saving.value = true
  try {
    // 这里实现保存草稿逻辑
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('保存草稿成功')
    // 显示成功消息
  } catch (error) {
    console.error('保存失败:', error)
  } finally {
    saving.value = false
  }
}

const publishPost = async () => {
  publishing.value = true
  try {
    // 这里实现发布文章逻辑
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('发布文章成功')
    router.push('/admin/posts')
  } catch (error) {
    console.error('发布失败:', error)
  } finally {
    publishing.value = false
  }
}

// 初始化数据
const initializeForm = () => {
  if (!isNew) {
    // 这里加载现有文章数据
    form.value = {
      title: '示例文章标题',
      description: '这是一篇示例文章的描述',
      content: '# 示例文章内容\n\n这里是文章的具体内容...',
      cover: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=630&fit=crop',
      category: '技术',
      tags: ['Vue.js', 'Nuxt.js'],
      publishedAt: '2025-09-13T10:00',
      featured: false,
      slug: 'example-article',
      metaDescription: '这是一篇关于示例的文章',
      keywords: 'Vue, Nuxt, 前端开发'
    }
  } else {
    // 新文章的默认值
    const now = new Date()
    form.value.publishedAt = now.toISOString().slice(0, 16)
  }
}

// 监听标题变化，自动生成 slug
watch(() => form.value.title, (newTitle) => {
  if (newTitle && isNew) {
    form.value.slug = newTitle
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }
})

// 页面挂载时初始化表单
onMounted(() => {
  initializeForm()
})
</script>