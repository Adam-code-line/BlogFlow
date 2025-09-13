import { defineStore } from 'pinia'
import { debounce } from '~/composables/useUtils'

interface PostForm {
  title: string
  description: string
  content: string
  cover: string
  category: string
  tags: string[]
  publishedAt: string
  featured: boolean
  slug: string
  metaDescription: string
  keywords: string
}

interface PostStats {
  views: number
  likes: number
  comments: number
}

export const usePostStore = defineStore('post', () => {
  // 状态
  const currentPost = ref<PostForm>({
    title: '',
    description: '',
    content: '',
    cover: '',
    category: '',
    tags: [],
    publishedAt: '',
    featured: false,
    slug: '',
    metaDescription: '',
    keywords: ''
  })

  const stats = ref<PostStats>({
    views: 0,
    likes: 0,
    comments: 0
  })

  const loading = ref(false)
  const saving = ref(false)
  const publishing = ref(false)
  const lastSaved = ref<Date | null>(null)
  const hasUnsavedChanges = ref(false)
  
  // 分类选项
  const categoryOptions = ref([
    { label: '技术', value: '技术' },
    { label: '设计', value: '设计' },
    { label: '产品', value: '产品' },
    { label: '生活', value: '生活' },
    { label: '思考', value: '思考' }
  ])

  // 计算属性
  const wordCount = computed(() => {
    return currentPost.value.content.length
  })

  const readingTime = computed(() => {
    const wordsPerMinute = 200
    const words = currentPost.value.content.split(/\s+/).length
    return Math.ceil(words / wordsPerMinute)
  })

  const isFormValid = computed(() => {
    return currentPost.value.title.trim() !== '' && 
           currentPost.value.content.trim() !== ''
  })

  // 防抖的自动保存
  const autoSave = debounce(async () => {
    if (isFormValid.value && hasUnsavedChanges.value) {
      await saveDraft(false) // 静默保存，不显示loading状态
    }
  }, 3000)

  // Actions
  const initializePost = (postId?: string) => {
    if (postId && postId !== 'new') {
      // 加载现有文章
      loadPost(postId)
    } else {
      // 重置为新文章
      resetPost()
    }
  }

  const resetPost = () => {
    currentPost.value = {
      title: '',
      description: '',
      content: '',
      cover: '',
      category: '',
      tags: [],
      publishedAt: new Date().toISOString().slice(0, 16),
      featured: false,
      slug: '',
      metaDescription: '',
      keywords: ''
    }
    stats.value = { views: 0, likes: 0, comments: 0 }
    hasUnsavedChanges.value = false
    lastSaved.value = null
  }

  const loadPost = async (postId: string) => {
    loading.value = true
    try {
      // 这里应该调用真实API
      // const response = await $fetch(`/api/posts/${postId}`)
      
      // 模拟数据
      await new Promise(resolve => setTimeout(resolve, 500))
      currentPost.value = {
        title: '示例文章标题',
        description: '这是一篇示例文章的描述',
        content: '# 示例文章\n\n这里是文章内容...',
        cover: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop',
        category: '技术',
        tags: ['Vue.js', 'Nuxt.js'],
        publishedAt: '2025-09-13T10:00',
        featured: false,
        slug: 'example-article',
        metaDescription: '这是一篇关于示例的文章',
        keywords: 'Vue.js, TypeScript, 前端开发'
      }
      stats.value = { views: 1250, likes: 89, comments: 23 }
      hasUnsavedChanges.value = false
    } catch (error) {
      console.error('加载文章失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const saveDraft = async (showLoading = true) => {
    if (showLoading) saving.value = true
    
    try {
      // 这里应该调用真实API
      // await $fetch('/api/posts/draft', {
      //   method: 'POST',
      //   body: currentPost.value
      // })
      
      // 模拟保存
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('保存草稿:', currentPost.value)
      
      lastSaved.value = new Date()
      hasUnsavedChanges.value = false
      
      if (showLoading) {
        console.log('草稿保存成功')
      }
    } catch (error) {
      console.error('保存草稿失败:', error)
      throw error
    } finally {
      if (showLoading) saving.value = false
    }
  }

  const publishPost = async () => {
    if (!isFormValid.value) {
      throw new Error('请填写标题和内容')
    }

    publishing.value = true
    try {
      // 这里应该调用真实API
      // await $fetch('/api/posts', {
      //   method: 'POST',
      //   body: { ...currentPost.value, status: 'published' }
      // })
      
      // 模拟发布
      await new Promise(resolve => setTimeout(resolve, 1500))
      console.log('发布文章:', currentPost.value)
      
      lastSaved.value = new Date()
      hasUnsavedChanges.value = false
      
      console.log('文章发布成功')
    } catch (error) {
      console.error('发布文章失败:', error)
      throw error
    } finally {
      publishing.value = false
    }
  }

  const updateField = <K extends keyof PostForm>(field: K, value: PostForm[K]) => {
    currentPost.value[field] = value
    hasUnsavedChanges.value = true
    
    // 自动生成slug
    if (field === 'title' && typeof value === 'string' && !currentPost.value.slug) {
      currentPost.value.slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
        .replace(/^-+|-+$/g, '')
    }
    
    // 触发自动保存
    autoSave()
  }

  const addTag = (tag: string) => {
    if (tag && !currentPost.value.tags.includes(tag)) {
      currentPost.value.tags.push(tag)
      hasUnsavedChanges.value = true
      autoSave()
    }
  }

  const removeTag = (tag: string) => {
    const index = currentPost.value.tags.indexOf(tag)
    if (index > -1) {
      currentPost.value.tags.splice(index, 1)
      hasUnsavedChanges.value = true
      autoSave()
    }
  }

  const selectRandomCover = () => {
    const unsplashImages = [
      'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop'
    ]
    const selectedImage = unsplashImages[Math.floor(Math.random() * unsplashImages.length)]
    if (selectedImage) {
      updateField('cover', selectedImage)
    }
  }

  return {
    // 状态
    currentPost: readonly(currentPost),
    stats: readonly(stats),
    loading: readonly(loading),
    saving: readonly(saving),
    publishing: readonly(publishing),
    lastSaved: readonly(lastSaved),
    hasUnsavedChanges: readonly(hasUnsavedChanges),
    categoryOptions: readonly(categoryOptions),
    
    // 计算属性
    wordCount,
    readingTime,
    isFormValid,
    
    // 方法
    initializePost,
    resetPost,
    loadPost,
    saveDraft,
    publishPost,
    updateField,
    addTag,
    removeTag,
    selectRandomCover
  }
})