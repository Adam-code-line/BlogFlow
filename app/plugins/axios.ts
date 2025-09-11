import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'

// API响应接口
interface ApiResponse<T = any> {
  data: T
  message: string
  code: number
  success: boolean
}

// 请求配置扩展
interface RequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean
  skipErrorHandler?: boolean
}

// 扩展AxiosRequestConfig以支持自定义属性
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    skipAuth?: boolean
    skipErrorHandler?: boolean
  }
}

// 创建axios实例
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000/api' 
      : '/api',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // 请求拦截器
  instance.interceptors.request.use(
    (config) => {
      // 添加认证token (只在客户端执行)
      if (process.client) {
        const token = useCookie('auth-token').value
        if (token && !config.skipAuth) {
          config.headers.Authorization = `Bearer ${token}`
        }
      }

      // 添加时间戳防止缓存
      if (config.method === 'get') {
        config.params = {
          ...config.params,
          _t: Date.now()
        }
      }

      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // 响应拦截器
  instance.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
      const { data } = response
      
      // 统一处理API响应格式
      if (data && typeof data === 'object' && 'success' in data) {
        if (!data.success) {
          throw new Error(data.message || 'API请求失败')
        }
        return data.data
      }
      
      return data
    },
    (error) => {
      // 统一错误处理
      if (!error.config?.skipErrorHandler) {
        handleApiError(error)
      }
      return Promise.reject(error)
    }
  )

  return instance
}

// 错误处理函数
const handleApiError = (error: any) => {
  const { response } = error

  if (response) {
    switch (response.status) {
      case 401:
        // 未认证，清除token并跳转登录 (只在客户端执行)
        if (process.client) {
          const authToken = useCookie('auth-token')
          authToken.value = null
          navigateTo('/login')
        }
        break
      case 403:
        console.error('权限不足')
        break
      case 404:
        console.error('资源不存在')
        break
      case 500:
        console.error('服务器内部错误')
        break
      default:
        console.error(`请求错误: ${response.status}`)
    }
  } else if (error.code === 'ECONNABORTED') {
    console.error('请求超时')
  } else {
    console.error('网络错误')
  }
}

// API封装类
class ApiClient {
  private instance: AxiosInstance

  constructor() {
    this.instance = createAxiosInstance()
  }

  // GET请求
  async get<T = any>(url: string, config?: RequestConfig): Promise<T> {
    return this.instance.get(url, config)
  }

  // POST请求
  async post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.instance.post(url, data, config)
  }

  // PUT请求
  async put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.instance.put(url, data, config)
  }

  // DELETE请求
  async delete<T = any>(url: string, config?: RequestConfig): Promise<T> {
    return this.instance.delete(url, config)
  }

  // PATCH请求
  async patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.instance.patch(url, data, config)
  }

  // 上传文件
  async upload<T = any>(url: string, file: File, config?: RequestConfig): Promise<T> {
    const formData = new FormData()
    formData.append('file', file)
    
    return this.instance.post(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    })
  }

  // 获取原始axios实例
  getInstance(): AxiosInstance {
    return this.instance
  }
}

// Nuxt插件
export default defineNuxtPlugin(() => {
  const apiClient = new ApiClient()

  return {
    provide: {
      api: apiClient,
      axios: apiClient.getInstance()
    }
  }
})