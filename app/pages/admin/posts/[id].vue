<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          {{ isNew ? '创建新文章' : '编辑文章' }}
        </h1>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {{ isNew ? '创建一篇新的博客文章' : '编辑现有文章内容' }}
        </p>
      </div>
      <div class="flex items-center space-x-3">
        <UButton
          variant="ghost"
          icon="i-heroicons-arrow-left"
          to="/admin/posts"
        >
          返回列表
        </UButton>
        <UButton
          @click="saveAsDraft"
          variant="outline"
          :loading="saving"
        >
          保存草稿
        </UButton>
        <UButton
          @click="publishPost"
          :loading="publishing"
        >
          发布文章
        </UButton>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 主要编辑区域 -->
      <div class="lg:col-span-2 space-y-6">
        <!-- 基本信息 -->
        <UCard class="bg-white dark:bg-gray-800">
          <template #header>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">基本信息</h3>
          </template>
          
          <div class="space-y-6">
            <!-- 标题 -->
            <div>
              <UFormGroup label="文章标题" required>
                <UInput
                  v-model="form.title"
                  placeholder="请输入文章标题"
                  size="lg"
                  :ui="{ base: 'font-medium' }"
                />
              </UFormGroup>
            </div>

            <!-- 描述 -->
            <div>
              <UFormGroup label="文章描述">
                <UTextarea
                  v-model="form.description"
                  placeholder="请输入文章描述，将显示在文章列表和SEO中"
                  :rows="3"
                />
              </UFormGroup>
            </div>

            <!-- 封面图片 -->
            <div>
              <UFormGroup label="封面图片">
                <div class="space-y-3">
                  <UInput
                    v-model="form.cover"
                    placeholder="请输入图片URL或点击上传"
                    icon="i-heroicons-photo"
                  />
                  <div class="flex items-center space-x-2">
                    <UButton
                      variant="outline"
                      size="sm"
                      icon="i-heroicons-cloud-arrow-up"
                      @click="uploadCover"
                    >
                      上传图片
                    </UButton>
                    <UButton
                      variant="ghost"
                      size="sm"
                      icon="i-heroicons-photo"
                      @click="selectFromUnsplash"
                    >
                      选择素材
                    </UButton>
                  </div>
                  <!-- 预览 -->
                  <div v-if="form.cover" class="mt-3">
                    <img
                      :src="form.cover"
                      alt="封面预览"
                      class="w-full h-40 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                    />
                  </div>
                </div>
              </UFormGroup>
            </div>
          </div>
        </UCard>

        <!-- 文章内容 -->
        <UCard class="bg-white dark:bg-gray-800">
          <template #header>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">文章内容</h3>
          </template>
          
          <!-- Cherry Markdown 编辑器 -->
          <CherryMarkdownEditor
            v-model="form.content"
            height="600px"
            placeholder="请输入 Markdown 格式的文章内容..."
          />
        </UCard>
      </div>

      <!-- 侧边栏 -->
      <div class="space-y-6">
        <!-- 发布设置 -->
        <UCard class="bg-white dark:bg-gray-800">
          <template #header>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">发布设置</h3>
          </template>
          
          <div class="space-y-4">
            <!-- 分类 -->
            <div>
              <UFormGroup label="分类">
                <USelect
                  v-model="form.category"
                  :options="categoryOptions"
                  placeholder="选择分类"
                />
              </UFormGroup>
            </div>

            <!-- 标签 -->
            <div>
              <UFormGroup label="标签">
                <UInput
                  v-model="tagsInput"
                  placeholder="输入标签，用逗号分隔"
                  @blur="updateTags"
                />
                <div v-if="form.tags?.length" class="mt-2 flex flex-wrap gap-2">
                  <UBadge
                    v-for="(tag, index) in form.tags"
                    :key="index"
                    :label="tag"
                    color="primary"
                    variant="soft"
                    size="sm"
                  />
                </div>
              </UFormGroup>
            </div>

            <!-- 发布时间 -->
            <div>
              <UFormGroup label="发布时间">
                <UInput
                  v-model="form.publishedAt"
                  type="datetime-local"
                />
              </UFormGroup>
            </div>

            <!-- 特色文章 -->
            <div>
              <UFormGroup>
                <UCheckbox
                  v-model="form.featured"
                  label="设为特色文章"
                />
              </UFormGroup>
            </div>
          </div>
        </UCard>

        <!-- SEO 设置 -->
        <UCard class="bg-white dark:bg-gray-800">
          <template #header>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">SEO 设置</h3>
          </template>
          
          <div class="space-y-4">
            <!-- URL Slug -->
            <div>
              <UFormGroup label="URL Slug">
                <UInput
                  v-model="form.slug"
                  placeholder="文章URL路径"
                />
              </UFormGroup>
            </div>

            <!-- Meta 描述 -->
            <div>
              <UFormGroup label="Meta 描述">
                <UTextarea
                  v-model="form.metaDescription"
                  placeholder="搜索引擎显示的描述"
                  :rows="3"
                />
              </UFormGroup>
            </div>

            <!-- 关键词 -->
            <div>
              <UFormGroup label="关键词">
                <UInput
                  v-model="form.keywords"
                  placeholder="SEO关键词，用逗号分隔"
                />
              </UFormGroup>
            </div>
          </div>
        </UCard>

        <!-- 文章统计 -->
        <UCard v-if="!isNew" class="bg-white dark:bg-gray-800">
          <template #header>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">文章统计</h3>
          </template>
          
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-sm text-gray-500 dark:text-gray-400">阅读量</span>
              <span class="text-sm font-medium">{{ stats.views }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-500 dark:text-gray-400">点赞数</span>
              <span class="text-sm font-medium">{{ stats.likes }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-500 dark:text-gray-400">评论数</span>
              <span class="text-sm font-medium">{{ stats.comments }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-500 dark:text-gray-400">字数</span>
              <span class="text-sm font-medium">{{ wordCount }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-500 dark:text-gray-400">预计阅读</span>
              <span class="text-sm font-medium">{{ readingTime }} 分钟</span>
            </div>
          </div>
        </UCard>
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
    form.value.tags = tagsInput.value
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
  }
}

const uploadCover = () => {
  // 这里实现图片上传逻辑
  console.log('上传封面图片')
}

const selectFromUnsplash = () => {
  // 这里实现从 Unsplash 选择图片
  const unsplashImages = [
    'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop'
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
    console.log('保存草稿:', form.value)
    await new Promise(resolve => setTimeout(resolve, 1000))
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
    console.log('发布文章:', form.value)
    await new Promise(resolve => setTimeout(resolve, 1500))
    // 跳转到文章列表
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
    // 如果是编辑模式，加载现有文章数据
    // 这里应该根据 postId 加载文章数据
    form.value = {
      title: '示例文章标题',
      description: '这是一篇示例文章的描述',
      content: '# 示例文章\n\n这里是文章内容...',
      cover: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop',
      category: '技术',
      tags: ['Vue.js', 'TypeScript'],
      publishedAt: new Date().toISOString().slice(0, 16),
      featured: false,
      slug: 'example-post',
      metaDescription: '这是示例文章的 meta 描述',
      keywords: 'Vue.js, TypeScript, 前端开发'
    }
    tagsInput.value = form.value.tags.join(', ')
  } else {
    // 新文章，设置默认发布时间
    form.value.publishedAt = new Date().toISOString().slice(0, 16)
  }
}

// 监听标题变化，自动生成 slug
watch(() => form.value.title, (newTitle) => {
  if (newTitle && !form.value.slug) {
    form.value.slug = newTitle
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
})

// 页面挂载时初始化表单
onMounted(() => {
  initializeForm()
})
</script>