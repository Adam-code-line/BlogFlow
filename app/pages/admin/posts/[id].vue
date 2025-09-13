<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- 顶部导航栏 -->
    <div class="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto">
        <div class="flex items-center justify-between h-16 px-6">
          <div class="flex items-center space-x-4">
            <UButton
              to="/admin/posts"
              variant="ghost"
              size="sm"
              icon="heroicons:arrow-left"
              class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              返回文章列表
            </UButton>
            <div class="h-6 border-l border-gray-300 dark:border-gray-600"></div>
            <div>
              <h1 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ isNew ? '创建新文章' : '编辑文章' }}
              </h1>
            </div>
          </div>
          
          <div class="flex items-center space-x-3">
            <!-- 字数和阅读时间 -->
            <div class="hidden sm:flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <div class="flex items-center">
                <Icon name="heroicons:document-text" class="w-4 h-4 mr-1" />
                {{ wordCount }} 字
              </div>
              <div class="flex items-center">
                <Icon name="heroicons:clock" class="w-4 h-4 mr-1" />
                {{ readingTime }} 分钟
              </div>
            </div>
            
            <!-- 保存按钮 -->
            <UButton
              @click="saveAsDraft"
              :loading="saving"
              variant="outline"
              size="sm"
              icon="heroicons:document-duplicate"
              class="hidden sm:flex"
            >
              保存草稿
            </UButton>
            
            <!-- 发布按钮 -->
            <UButton
              @click="publishPost"
              :loading="publishing"
              size="sm"
              icon="heroicons:rocket-launch"
              class="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              {{ isNew ? '发布' : '更新' }}
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="max-w-7xl mx-auto p-6">
      <div class="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <!-- 左侧主要内容区域 -->
        <div class="xl:col-span-3 space-y-6">
          <!-- 文章基本信息卡片 -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="p-6">
              <div class="flex items-center space-x-3 mb-6">
                <div class="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Icon name="heroicons:document-text" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">基本信息</h2>
              </div>
              
              <div class="space-y-6">
                <!-- 标题 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    文章标题 <span class="text-red-500">*</span>
                  </label>
                  <UInput
                    v-model="form.title"
                    placeholder="输入一个吸引人的标题..."
                    size="lg"
                    class="text-lg font-medium"
                    :ui="{ 
                      base: 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                    }"
                  />
                </div>
                
                <!-- 描述和分类 -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      文章描述
                    </label>
                    <UTextarea
                      v-model="form.description"
                      placeholder="简要描述这篇文章的内容..."
                      :rows="3"
                      resize
                      :ui="{ 
                        base: 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                      }"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      分类
                    </label>
                    <USelect
                      v-model="form.category"
                      :options="categoryOptions"
                      placeholder="选择分类"
                      size="lg"
                      :ui="{ 
                        base: 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                      }"
                    />
                    
                    <!-- 标签输入 -->
                    <div class="mt-4">
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        标签
                      </label>
                      <UInput
                        v-model="tagsInput"
                        placeholder="输入标签，用逗号分隔"
                        @blur="updateTags"
                        :ui="{ 
                          base: 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                        }"
                      />
                      <div v-if="form.tags.length" class="flex flex-wrap gap-2 mt-3">
                        <span
                          v-for="tag in form.tags"
                          :key="tag"
                          class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                        >
                          {{ tag }}
                          <button
                            @click="removeTag(tag)"
                            class="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800/50"
                          >
                            <Icon name="heroicons:x-mark" class="w-3 h-3" />
                          </button>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Markdown 编辑器卡片 -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="p-6">
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center space-x-3">
                  <div class="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <Icon name="heroicons:pencil-square" class="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 class="text-lg font-semibold text-gray-900 dark:text-white">文章内容</h2>
                </div>
                
                <div class="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <div class="flex items-center">
                    <Icon name="heroicons:document-text" class="w-4 h-4 mr-1" />
                    {{ wordCount }} 字
                  </div>
                  <div class="flex items-center">
                    <Icon name="heroicons:clock" class="w-4 h-4 mr-1" />
                    {{ readingTime }} 分钟阅读
                  </div>
                </div>
              </div>
              
              <!-- Cherry编辑器容器 -->
              <div class="border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-700/30">
                <CherryMarkdownEditor
                  v-model="form.content"
                  height="600px"
                  placeholder="在这里编写您的文章内容..."
                  :ui="{
                    wrapper: 'rounded-xl overflow-hidden',
                    editor: 'border-r-2 border-gray-200 dark:border-gray-600',
                    preview: 'border-l-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800'
                  }"
                  ref="cherryEditorRef"
                />
              </div>
              
              <!-- 编辑器提示 -->
              <div class="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border border-blue-200 dark:border-blue-800 rounded-xl">
                <div class="flex">
                  <Icon name="heroicons:information-circle" class="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div class="text-sm text-blue-700 dark:text-blue-300">
                    <p class="font-medium mb-2">💡 编辑器使用提示：</p>
                    <ul class="space-y-1 text-xs opacity-90">
                      <li>• 左侧编辑，右侧预览，支持实时同步</li>
                      <li>• 使用工具栏快速插入 Markdown 元素</li>
                      <li>• 支持表格、代码块、图片等丰富内容</li>
                      <li>• Ctrl/Cmd + S 快速保存草稿</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧边栏 -->
        <div class="space-y-6">
          <!-- 发布状态 -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="p-6">
              <div class="flex items-center space-x-3 mb-4">
                <div class="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <Icon name="heroicons:rocket-launch" class="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 class="font-semibold text-gray-900 dark:text-white">发布设置</h3>
              </div>
              
              <div class="space-y-4">
                <!-- 发布时间 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    发布时间
                  </label>
                  <UInput
                    v-model="form.publishedAt"
                    type="datetime-local"
                    size="sm"
                    :ui="{ 
                      base: 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500'
                    }"
                  />
                </div>

                <!-- URL别名 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    URL别名
                  </label>
                  <UInput
                    v-model="form.slug"
                    placeholder="自动生成"
                    size="sm"
                    :ui="{ 
                      base: 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500'
                    }"
                  />
                </div>

                <!-- 特色文章开关 -->
                <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                  <div class="flex items-center space-x-3">
                    <Icon name="heroicons:star" class="w-4 h-4 text-yellow-500" />
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">特色文章</span>
                  </div>
                  <UToggle
                    v-model="form.featured"
                    size="sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- 封面图片 -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="p-6">
              <div class="flex items-center space-x-3 mb-4">
                <div class="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <Icon name="heroicons:photo" class="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <h3 class="font-semibold text-gray-900 dark:text-white">封面图片</h3>
              </div>
              
              <!-- 图片预览 -->
              <div v-if="form.cover" class="mb-4 relative group">
                <img 
                  :src="form.cover" 
                  alt="封面预览" 
                  class="w-full h-32 object-cover rounded-xl border border-gray-200 dark:border-gray-600" 
                />
                <button
                  @click="removeCover"
                  class="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <Icon name="heroicons:trash" class="w-4 h-4" />
                </button>
              </div>
              
              <!-- 上传区域 -->
              <div class="space-y-3">
                <UInput
                  v-model="form.cover"
                  placeholder="输入图片URL"
                  size="sm"
                  :ui="{ 
                    base: 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:border-green-500 focus:ring-green-500'
                  }"
                />
                
                <div class="grid grid-cols-2 gap-2">
                  <UButton
                    variant="outline"
                    size="xs"
                    icon="heroicons:cloud-arrow-up"
                    @click="triggerFileUpload"
                    :loading="uploading"
                    block
                  >
                    {{ uploading ? '上传中...' : '上传' }}
                  </UButton>
                  
                  <UButton
                    variant="outline"
                    size="xs"
                    icon="heroicons:sparkles"
                    @click="selectFromUnsplash"
                    block
                  >
                    随机图片
                  </UButton>
                </div>
                
                <!-- 隐藏的文件输入 -->
                <input
                  ref="fileInputRef"
                  type="file"
                  accept="image/*"
                  @change="handleFileUpload"
                  class="hidden"
                />
                
                <!-- 上传进度 -->
                <div v-if="uploadProgress > 0 && uploadProgress < 100" class="mt-3">
                  <div class="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      class="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                      :style="{ width: uploadProgress + '%' }"
                    ></div>
                  </div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">上传进度: {{ uploadProgress }}%</p>
                </div>
              </div>
            </div>
          </div>

          <!-- SEO优化 -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="p-6">
              <div class="flex items-center space-x-3 mb-4">
                <div class="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                  <Icon name="heroicons:magnifying-glass" class="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 class="font-semibold text-gray-900 dark:text-white">SEO优化</h3>
              </div>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    SEO描述
                  </label>
                  <UTextarea
                    v-model="form.metaDescription"
                    placeholder="150字以内的SEO描述"
                    :rows="2"
                    size="sm"
                    :ui="{ 
                      base: 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500'
                    }"
                  />
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {{ form.metaDescription?.length || 0 }}/150
                  </p>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    关键词
                  </label>
                  <UInput
                    v-model="form.keywords"
                    placeholder="用逗号分隔关键词"
                    size="sm"
                    :ui="{ 
                      base: 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500'
                    }"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- 操作按钮组 -->
          <div class="space-y-3">
            <UButton
              @click="publishPost"
              :loading="publishing"
              size="lg"
              block
              icon="heroicons:rocket-launch"
              class="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 font-semibold"
            >
              {{ isNew ? '发布文章' : '更新文章' }}
            </UButton>
            
            <UButton
              @click="saveAsDraft"
              :loading="saving"
              size="lg"
              variant="outline"
              block
              icon="heroicons:document-duplicate"
              class="border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
            >
              保存草稿
            </UButton>
            
            <div v-if="!isNew" class="grid grid-cols-2 gap-2 pt-2">
              <UButton
                color="error"
                variant="outline"
                size="sm"
                icon="heroicons:trash"
                block
              >
                删除
              </UButton>
              <UButton
                variant="outline"
                size="sm"
                icon="heroicons:eye"
                block
                :to="`/blog/${form.slug}`"
                target="_blank"
              >
                预览
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 导入组件
import CherryMarkdownEditor from '~/components/editor/CherryMarkdownEditor.vue'
import { debounce, throttle } from '~/composables/useUtils'
import { createPostAction, updatePostAction, getPostByIdAction, type PostData } from '~/composables/usePostActions'

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

// Cherry 编辑器引用
const cherryEditorRef = ref<any>(null)

// 文件上传相关
const uploading = ref(false)
const uploadProgress = ref(0)
const fileInputRef = ref<HTMLInputElement>()

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

const removeTag = (tag: string) => {
  form.value.tags = form.value.tags.filter(t => t !== tag)
  tagsInput.value = form.value.tags.join(', ')
}

const uploadCover = () => {
  // 这里实现图片上传逻辑
  console.log('上传封面图片')
}

// 文件上传方法
const triggerFileUpload = () => {
  fileInputRef.value?.click()
}

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    alert('请选择图片文件')
    return
  }

  // 验证文件大小 (限制为 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('文件大小不能超过 5MB')
    return
  }

  uploading.value = true
  uploadProgress.value = 0

  try {
    // 模拟上传进度
    const uploadInterval = setInterval(() => {
      uploadProgress.value += 10
      if (uploadProgress.value >= 90) {
        clearInterval(uploadInterval)
      }
    }, 100)

    // 使用 FormData 进行文件上传
    const formData = new FormData()
    formData.append('file', file)
    
    // 这里使用 FileReader 作为演示，实际项目中应该调用真实的上传 API
    await new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        clearInterval(uploadInterval)
        uploadProgress.value = 100
        form.value.cover = e.target?.result as string
        setTimeout(() => {
          uploading.value = false
          uploadProgress.value = 0
        }, 500)
        resolve(true)
      }
      reader.readAsDataURL(file)
    })

  } catch (error) {
    console.error('文件上传失败:', error)
    alert('文件上传失败，请重试')
    uploading.value = false
    uploadProgress.value = 0
  }
}

const removeCover = () => {
  form.value.cover = ''
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
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

const saveAsDraft = debounce(async () => {
  saving.value = true
  try {
    // 更新标签
    updateTags()
    
    console.log('💾 保存草稿 - 表单数据:', form.value)
    console.log('💾 Content 字段:', form.value.content)
    console.log('💾 Content 长度:', form.value.content?.length || 0)
    
    // 使用前端模拟的保存逻辑
    const postData = { ...form.value }
    
    if (isNew) {
      const result = await createPostAction(postData)
      console.log('✅ 草稿保存成功:', result)
      // 保存后跳转到编辑页面，但是路由参数需要修改
      await router.push(`/admin/posts/${result.id}`)
    } else {
      await updatePostAction(postId, postData)
      console.log('✅ 草稿更新成功')
    }
    
    console.log('✅ 草稿保存完成')
  } catch (error) {
    console.error('❌ 保存失败:', error)
  } finally {
    saving.value = false
  }
}, 1000) // 1秒防抖

const publishPost = throttle(async () => {
  publishing.value = true
  try {
    // 更新标签
    updateTags()
    
    console.log('🚀 发布文章 - 表单数据:', form.value)
    console.log('🚀 Content 字段:', form.value.content)
    console.log('🚀 Content 长度:', form.value.content?.length || 0)
    
    // 发布文章逻辑
    const postData = { 
      ...form.value,
      publishedAt: form.value.publishedAt || new Date().toISOString()
    }
    
    if (isNew) {
      const result = await createPostAction(postData)
      console.log('✅ 文章发布成功:', result)
    } else {
      await updatePostAction(postId, postData)
      console.log('✅ 文章更新成功')
    }
    
    console.log('✅ 文章发布完成')
    // 跳转到文章列表
    await router.push('/admin/posts')
  } catch (error) {
    console.error('❌ 发布失败:', error)
  } finally {
    publishing.value = false
  }
}, 3000) // 3秒节流，防止重复发布

// 初始化数据
const initializeForm = async () => {
  if (!isNew) {
    // 如果是编辑模式，加载现有文章数据
    try {
      const post = await getPostByIdAction(postId)
      if (post) {
        form.value = {
          title: post.title,
          description: post.description || '',
          content: post.content,
          cover: post.cover || '',
          category: post.category || '',
          tags: post.tags,
          publishedAt: post.publishedAt ? new Date(post.publishedAt).toISOString().slice(0, 16) : '',
          featured: post.featured || false,
          slug: post.slug || '',
          metaDescription: post.metaDescription || '',
          keywords: post.keywords || ''
        }
        tagsInput.value = post.tags.join(', ')
      } else {
        // 文章不存在，跳转到新建页面
        await router.push('/admin/posts/create')
      }
    } catch (error) {
      console.error('加载文章失败:', error)
      // 加载失败，使用示例数据
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
    }
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

// 监听内容变化，自动保存草稿
const autoSave = debounce(() => {
  if (form.value.title || form.value.content) {
    // 这里可以实现自动保存逻辑，但不显示loading状态
  }
}, 3000) // 3秒后自动保存

watch([() => form.value.title, () => form.value.content, () => form.value.description], () => {
  autoSave()
})

// 额外监听只针对 content 字段的变化
watch(() => form.value.content, (newContent, oldContent) => {
  // 这里可以添加内容变化的处理逻辑
})

// 页面挂载时初始化表单
onMounted(async () => {
  // 初始化示例数据（仅在没有数据时）
  const { initializeSamplePosts } = await import('~/composables/usePostActions')
  initializeSamplePosts()
  
  // 初始化表单
  await initializeForm()
})
</script>

<style scoped>
/* 自定义滚动条样式 */
:deep(.cherry-editor-wrapper) {
  scrollbar-width: thin;
  scrollbar-color: rgb(203 213 225) transparent;
}

:deep(.cherry-editor-wrapper::-webkit-scrollbar) {
  width: 8px;
}

:deep(.cherry-editor-wrapper::-webkit-scrollbar-track) {
  background: transparent;
}

:deep(.cherry-editor-wrapper::-webkit-scrollbar-thumb) {
  background-color: rgb(203 213 225);
  border-radius: 4px;
  border: 2px solid transparent;
  background-clip: content-box;
}

:deep(.cherry-editor-wrapper::-webkit-scrollbar-thumb:hover) {
  background-color: rgb(148 163 184);
}

/* Cherry编辑器优化样式 */
:deep(.cherry) {
  border: none !important;
  border-radius: 12px !important;
  overflow: hidden !important;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1) !important;
}

/* 增强编辑器分割线和布局 */
:deep(.cherry-editor) {
  border-right: 2px solid #e5e7eb !important;
  background: #ffffff !important;
}

:deep(.cherry-previewer) {
  border-left: 2px solid #e5e7eb !important;
  background: #fafafa !important;
}

/* 暗色模式适配 */
:deep(.dark .cherry-editor) {
  border-right-color: #374151 !important;
  background: #1f2937 !important;
}

:deep(.dark .cherry-previewer) {
  border-left-color: #374151 !important;
  background: #111827 !important;
}

/* 工具栏美化 */
:deep(.cherry-toolbar) {
  border-bottom: 1px solid #e5e7eb !important;
  background: #ffffff !important;
  padding: 8px 12px !important;
}

:deep(.dark .cherry-toolbar) {
  border-bottom-color: #374151 !important;
  background: #1f2937 !important;
}

/* 编辑器内容区域 */
:deep(.cherry-editor .CodeMirror) {
  font-size: 14px !important;
  line-height: 1.6 !important;
  padding: 16px !important;
}

:deep(.cherry-previewer .cherry-markdown) {
  padding: 16px !important;
  font-size: 14px !important;
  line-height: 1.6 !important;
}

/* 响应式优化 */
@media (max-width: 1279px) {
  :deep(.cherry) {
    height: 500px !important;
  }
}

@media (max-width: 768px) {
  :deep(.cherry) {
    height: 400px !important;
  }
  
  :deep(.cherry-editor),
  :deep(.cherry-previewer) {
    border: none !important;
  }
}

/* 动画和过渡效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 卡片悬停效果 */
.hover-card {
  transition: all 0.2s ease;
}

.hover-card:hover {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  transform: translateY(-1px);
}

/* 渐变背景 */
.gradient-bg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* 自定义徽章样式 */
.custom-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.custom-badge:hover {
  transform: scale(1.05);
}
</style>