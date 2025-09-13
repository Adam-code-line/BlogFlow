<template>
  <div class="max-w-7xl mx-auto space-y-6">
    <!-- 页面头部 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <UButton
              to="/admin/posts"
              variant="ghost"
              size="sm"
              icon="heroicons:arrow-left"
              class="text-gray-600 dark:text-gray-400"
            >
              返回
            </UButton>
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ isNew ? '创建新文章' : '编辑文章' }}
              </h1>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {{ isNew ? '开始撰写您的新文章' : '编辑和完善您的文章内容' }}
              </p>
            </div>
          </div>
          
          <div class="flex items-center space-x-3">
            <UButton
              @click="saveAsDraft"
              :loading="saving"
              variant="outline"
              size="sm"
              icon="heroicons:document"
            >
              保存草稿
            </UButton>
            <UButton
              @click="publishPost"
              :loading="publishing"
              size="sm"
              icon="heroicons:rocket-launch"
            >
              {{ isNew ? '发布' : '更新' }}
            </UButton>
          </div>
        </div>
        
        <!-- 文章统计 -->
        <div v-if="!isNew" class="mt-4 flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
          <div class="flex items-center">
            <Icon name="heroicons:eye" class="w-4 h-4 mr-1" />
            {{ stats.views }} 次查看
          </div>
          <div class="flex items-center">
            <Icon name="heroicons:heart" class="w-4 h-4 mr-1" />
            {{ stats.likes }} 喜欢
          </div>
          <div class="flex items-center">
            <Icon name="heroicons:chat-bubble-left" class="w-4 h-4 mr-1" />
            {{ stats.comments }} 评论
          </div>
          <div class="flex items-center">
            <Icon name="heroicons:clock" class="w-4 h-4 mr-1" />
            最后更新于 2小时前
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 - 优化布局比例 -->
    <div class="grid grid-cols-1 xl:grid-cols-8 gap-6">
      <!-- 左侧主要内容 -->
      <div class="xl:col-span-7 space-y-6">
        <!-- 精简的基本信息卡片 -->
        <UCard class="bg-white dark:bg-gray-800 border-0 shadow-sm">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <Icon name="heroicons:document-text" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 class="text-lg font-medium text-gray-900 dark:text-white">基本信息</h2>
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                字数: {{ wordCount }} · 阅读时间: {{ readingTime }}分钟
              </div>
            </div>
          </template>
          
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <!-- 标题 -->
            <div class="lg:col-span-2">
              <UFormGroup label="文章标题" required>
                <UInput
                  v-model="form.title"
                  placeholder="输入一个吸引人的标题..."
                  size="lg"
                  :ui="{ base: 'font-medium' }"
                />
              </UFormGroup>
            </div>
            
            <!-- 分类 -->
            <div>
              <UFormGroup label="分类">
                <USelect
                  v-model="form.category"
                  :options="categoryOptions"
                  placeholder="选择分类"
                  size="lg"
                />
              </UFormGroup>
            </div>
          </div>
          
          <!-- 描述和标签 -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <div>
              <UFormGroup label="文章描述">
                <UTextarea
                  v-model="form.description"
                  placeholder="简要描述这篇文章的内容..."
                  :rows="2"
                  resize
                />
              </UFormGroup>
            </div>
            
            <div>
              <UFormGroup label="标签">
                <UInput
                  v-model="tagsInput"
                  placeholder="输入标签，用逗号分隔"
                  @blur="updateTags"
                />
                <div v-if="form.tags.length" class="flex flex-wrap gap-1 mt-2">
                  <UBadge
                    v-for="tag in form.tags"
                    :key="tag"
                    variant="soft"
                    size="sm"
                  >
                    {{ tag }}
                  </UBadge>
                </div>
              </UFormGroup>
            </div>
          </div>
        </UCard>

        <!-- 文章内容编辑器 -->
        <UCard class="bg-white dark:bg-gray-800">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <Icon name="heroicons:pencil-square" class="w-5 h-5 text-green-600 dark:text-green-400" />
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">文章内容</h3>
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
          </template>
          
          <div class="space-y-4">
            <!-- Markdown 编辑器 -->
            <div class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <CherryMarkdownEditor
                v-model="form.content"
                height="600px"
                placeholder="在这里编写您的文章内容..."
              />
            </div>
            
            <!-- 编辑器提示 -->
            <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div class="flex">
                <Icon name="heroicons:information-circle" class="w-5 h-5 text-blue-500 mr-2 mt-0.5" />
                <div class="text-sm text-blue-700 dark:text-blue-300">
                  <p class="font-medium">编辑器提示：</p>
                  <ul class="mt-1 list-disc list-inside space-y-1 text-xs">
                    <li>支持实时预览，左侧编辑右侧预览，中间有清晰的分割线</li>
                    <li>使用工具栏快速插入各种 Markdown 元素</li>
                    <li>支持表格、代码块、图片等丰富内容</li>
                    <li>按 Ctrl+S 快速保存草稿</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- 优化的右侧边栏 -->
      <div class="space-y-4">
        <!-- 封面图片设置 -->
        <UCard class="bg-white dark:bg-gray-800">
          <template #header>
            <div class="flex items-center space-x-2">
              <Icon name="heroicons:photo" class="w-5 h-5 text-green-600 dark:text-green-400" />
              <h3 class="text-base font-medium text-gray-900 dark:text-white">封面图片</h3>
            </div>
          </template>
          
          <div class="space-y-3">
            <!-- 图片URL输入 -->
            <UInput
              v-model="form.cover"
              placeholder="输入图片URL或点击上传"
              size="sm"
            />
            
            <!-- 上传和选择按钮 -->
            <div class="flex space-x-2">
              <!-- 文件上传按钮 -->
              <UButton
                variant="outline"
                size="xs"
                icon="heroicons:cloud-arrow-up"
                @click="triggerFileUpload"
                :loading="uploading"
                class="flex-1"
              >
                {{ uploading ? '上传中...' : '上传' }}
              </UButton>
              
              <!-- 隐藏的文件输入 -->
              <input
                ref="fileInputRef"
                type="file"
                accept="image/*"
                @change="handleFileUpload"
                class="hidden"
              />
              
              <!-- Unsplash选择按钮 -->
              <UButton
                variant="ghost"
                size="xs"
                icon="heroicons:sparkles"
                @click="selectFromUnsplash"
                class="flex-1"
              >
                选图
              </UButton>
            </div>
            
            <!-- 图片预览 -->
            <div v-if="form.cover" class="mt-3 relative group">
              <img 
                :src="form.cover" 
                alt="封面预览" 
                class="w-full h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-700" 
              />
              <!-- 删除按钮 -->
              <button
                @click="removeCover"
                class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Icon name="heroicons:x-mark" class="w-3 h-3" />
              </button>
            </div>
            
            <!-- 上传进度 -->
            <div v-if="uploadProgress > 0 && uploadProgress < 100" class="mt-2">
              <div class="bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  :style="{ width: uploadProgress + '%' }"
                ></div>
              </div>
              <p class="text-xs text-gray-500 mt-1">上传进度: {{ uploadProgress }}%</p>
            </div>
          </div>
        </UCard>

        <!-- 发布设置 -->
        <UCard class="bg-white dark:bg-gray-800">
          <template #header>
            <div class="flex items-center space-x-2">
              <Icon name="heroicons:cog-6-tooth" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 class="text-base font-medium text-gray-900 dark:text-white">发布设置</h3>
            </div>
          </template>
          
          <div class="space-y-3">
            <!-- 发布时间 -->
            <div>
              <UFormGroup label="发布时间" size="sm">
                <UInput
                  v-model="form.publishedAt"
                  type="datetime-local"
                  size="sm"
                />
              </UFormGroup>
            </div>

            <!-- URL别名 -->
            <div>
              <UFormGroup label="URL别名" size="sm">
                <UInput
                  v-model="form.slug"
                  placeholder="自动生成"
                  size="sm"
                />
              </UFormGroup>
            </div>

            <!-- 特色文章 -->
            <div class="flex items-center justify-between py-2">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">特色文章</span>
              <UToggle
                v-model="form.featured"
                size="sm"
              />
            </div>
          </div>
        </UCard>

        <!-- SEO设置 -->
        <UCard class="bg-white dark:bg-gray-800">
          <template #header>
            <div class="flex items-center space-x-2">
              <Icon name="heroicons:magnifying-glass" class="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 class="text-base font-medium text-gray-900 dark:text-white">SEO优化</h3>
            </div>
          </template>
          
          <div class="space-y-3">
            <div>
              <UFormGroup label="SEO描述" size="sm">
                <UTextarea
                  v-model="form.metaDescription"
                  placeholder="150字以内"
                  :rows="2"
                  size="sm"
                />
              </UFormGroup>
            </div>
            
            <div>
              <UFormGroup label="关键词" size="sm">
                <UInput
                  v-model="form.keywords"
                  placeholder="用逗号分隔"
                  size="sm"
                />
              </UFormGroup>
            </div>
          </div>
        </UCard>

        <!-- 操作按钮 -->
        <div class="space-y-2">
          <UButton
            @click="publishPost"
            :loading="publishing"
            size="sm"
            color="primary"
            variant="solid"
            block
            icon="heroicons:rocket-launch"
          >
            {{ isNew ? '发布文章' : '更新文章' }}
          </UButton>
          
          <UButton
            @click="saveAsDraft"
            :loading="saving"
            size="sm"
            color="neutral"
            variant="soft"
            block
            icon="heroicons:document"
          >
            保存草稿
          </UButton>
          
          <div v-if="!isNew" class="flex space-x-2 pt-2">
            <UButton
              color="error"
              variant="ghost"
              size="xs"
              icon="heroicons:trash"
              class="flex-1"
            >
              删除
            </UButton>
            <UButton
              color="neutral"
              variant="ghost"
              size="xs"
              icon="heroicons:eye"
              class="flex-1"
            >
              预览
            </UButton>
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
    
    // 使用前端模拟的保存逻辑
    const postData = { ...form.value }
    
    if (isNew) {
      const result = await createPostAction(postData)
      console.log('草稿保存成功:', result)
      // 保存后跳转到编辑页面，但是路由参数需要修改
      await router.push(`/admin/posts/${result.id}`)
    } else {
      await updatePostAction(postId, postData)
      console.log('草稿更新成功')
    }
    
    console.log('草稿保存成功')
  } catch (error) {
    console.error('保存失败:', error)
  } finally {
    saving.value = false
  }
}, 1000) // 1秒防抖

const publishPost = throttle(async () => {
  publishing.value = true
  try {
    // 更新标签
    updateTags()
    
    // 发布文章逻辑
    const postData = { 
      ...form.value,
      publishedAt: form.value.publishedAt || new Date().toISOString()
    }
    
    if (isNew) {
      const result = await createPostAction(postData)
      console.log('文章发布成功:', result)
    } else {
      await updatePostAction(postId, postData)
      console.log('文章更新成功')
    }
    
    console.log('文章发布成功')
    // 跳转到文章列表
    await router.push('/admin/posts')
  } catch (error) {
    console.error('发布失败:', error)
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
    console.log('自动保存草稿...')
    // 这里可以实现自动保存逻辑，但不显示loading状态
  }
}, 3000) // 3秒后自动保存

watch([() => form.value.title, () => form.value.content, () => form.value.description], () => {
  autoSave()
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
/* 自定义样式 */
.grid-transition {
  transition: grid-template-columns 0.3s ease;
}

/* 美化滚动条 */
:deep(.cherry-editor-wrapper) {
  scrollbar-width: thin;
  scrollbar-color: rgb(203 213 225) transparent;
}

:deep(.cherry-editor-wrapper::-webkit-scrollbar) {
  width: 6px;
}

:deep(.cherry-editor-wrapper::-webkit-scrollbar-track) {
  background: transparent;
}

:deep(.cherry-editor-wrapper::-webkit-scrollbar-thumb) {
  background-color: rgb(203 213 225);
  border-radius: 3px;
}

:deep(.cherry-editor-wrapper::-webkit-scrollbar-thumb:hover) {
  background-color: rgb(148 163 184);
}

/* Cherry编辑器分割线样式增强 */
:deep(.cherry) {
  border: none !important;
  border-radius: 8px !important;
  overflow: hidden !important;
}

/* 增强编辑器分割线 */
:deep(.cherry-editor) {
  border-right: 2px solid #e5e7eb !important;
}

:deep(.cherry-previewer) {
  border-left: 2px solid #e5e7eb !important;
  background: #fafafa !important;
}

/* 暗色模式下的分割线 */
:deep(.dark .cherry-editor) {
  border-right-color: #374151 !important;
  background: #1f2937 !important;
}

:deep(.dark .cherry-previewer) {
  border-left-color: #374151 !important;
  background: #111827 !important;
}

/* 工具栏样式 */
:deep(.cherry-toolbar) {
  border-bottom: 1px solid #e5e7eb !important;
  background: #ffffff !important;
}

:deep(.dark .cherry-toolbar) {
  border-bottom-color: #374151 !important;
  background: #111827 !important;
}

/* 响应式调整 */
@media (max-width: 1279px) {
  .xl\:grid-cols-8 {
    grid-template-columns: 1fr;
  }
  
  .xl\:col-span-7 {
    grid-column: span 1;
  }
}
</style>