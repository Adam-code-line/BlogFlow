import { 
  BlogApiService, 
  UploadApiService, 
  ContactApiService,
  AnalyticsApiService 
} from '../../server/api/api'

// API服务管理器
export const useApi = () => {
  const { $api } = useNuxtApp()

  // 创建服务实例
  const blog = new BlogApiService($api)
  const upload = new UploadApiService($api)
  const contact = new ContactApiService($api)
  const analytics = new AnalyticsApiService($api)

  return {
    blog,
    upload,
    contact,
    analytics
  }
}

// 博客相关API
export const useBlogApi = () => {
  const { blog } = useApi()
  return blog
}

// 上传相关API
export const useUploadApi = () => {
  const { upload } = useApi()
  return upload
}

// 联系相关API
export const useContactApi = () => {
  const { contact } = useApi()
  return contact
}

// 统计相关API
export const useAnalyticsApi = () => {
  const { analytics } = useApi()
  return analytics
}

// 错误处理封装
export const useApiError = () => {
  const handleError = (error: any, fallbackMessage = '操作失败') => {
    console.error('API Error:', error)
    
    if (error.response?.data?.message) {
      return error.response.data.message
    }
    
    if (error.message) {
      return error.message
    }
    
    return fallbackMessage
  }

  return { handleError }
}

// API请求状态管理
export const useApiState = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async <T>(
    apiCall: () => Promise<T>,
    options: {
      loadingMessage?: string
      successMessage?: string
      errorMessage?: string
      showToast?: boolean
    } = {}
  ): Promise<T | null> => {
    loading.value = true
    error.value = null

    try {
      const result = await apiCall()
      
      if (options.successMessage && options.showToast) {
        // 这里可以集成toast通知
        console.log(options.successMessage)
      }
      
      return result
    } catch (err: any) {
      const { handleError } = useApiError()
      error.value = handleError(err, options.errorMessage)
      
      if (options.showToast) {
        // 这里可以集成toast通知
        console.error(error.value)
      }
      
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    execute
  }
}
