/**
 * 统计数据管理 Composable
 * 统一管理博客的各种统计数据，支持响应式更新
 * 后续可轻松接入后端API
 */

export interface StatisticsData {
  // 首页统计数据
  totalPosts: number
  totalProjects: number
  totalShares: number
  totalViews: number
  
  // 博客相关统计
  publishedPosts: number
  draftPosts: number
  totalCategories: number
  totalTags: number
  
  // 用户互动统计
  totalLikes: number
  totalComments: number
  
  // 时间相关统计
  lastUpdated: string
  
  // 扩展字段，便于后续添加
  [key: string]: any
}

// 默认统计数据
const defaultStatistics: StatisticsData = {
  totalPosts: 0,
  totalProjects: 0,
  totalShares: 0,
  totalViews: 0,
  publishedPosts: 0,
  draftPosts: 0,
  totalCategories: 0,
  totalTags: 0,
  totalLikes: 0,
  totalComments: 0,
  lastUpdated: new Date().toISOString()
}

// 全局响应式状态
const statistics = ref<StatisticsData>(defaultStatistics)
const loading = ref(false)
const error = ref<string | null>(null)

/**
 * 统计数据管理 Composable
 */
export const useStatistics = () => {
  
  /**
   * 从本地存储或后端获取统计数据
   */
  const fetchStatistics = async (): Promise<void> => {
    loading.value = true
    error.value = null
    
    try {
      // TODO: 后续替换为真实的API调用
      // const response = await $fetch('/api/statistics')
      
      // 目前从本地计算或模拟数据
      const calculatedStats = await calculateStatistics()
      statistics.value = {
        ...defaultStatistics,
        ...calculatedStats,
        lastUpdated: new Date().toISOString()
      }
      
    } catch (err: any) {
      console.error('获取统计数据失败:', err)
      error.value = err.message || '获取统计数据失败'
    } finally {
      loading.value = false
    }
  }

  /**
   * 计算统计数据（基于本地数据）
   */
  const calculateStatistics = async (): Promise<Partial<StatisticsData>> => {
    try {
      // 动态导入，避免SSR问题
      const { getPostsAction } = await import('~/composables/usePostActions')
      const posts = await getPostsAction()
      
      // 计算基础统计（假设所有本地文章都是已发布的）
      const publishedPosts = posts.length
      const draftPosts = 0 // 暂时设为0，后续可以添加草稿功能
      const totalCategories = new Set(posts.map(post => post.category).filter(Boolean)).size
      const totalTags = new Set(posts.flatMap(post => post.tags || [])).size
      
      // 计算总浏览量和点赞数
      const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0)
      const totalLikes = posts.reduce((sum, post) => sum + (post.likes || 0), 0)
      const totalComments = posts.reduce((sum, post) => sum + (post.comments || 0), 0)
      
      return {
        totalPosts: publishedPosts,
        publishedPosts,
        draftPosts,
        totalCategories,
        totalTags,
        totalViews: totalViews || 2500, // 默认值
        totalLikes,
        totalComments,
        // 暂时使用固定值，后续从API获取
        totalProjects: 15,
        totalShares: publishedPosts > 0 ? Math.floor(publishedPosts * 2.5) : 100
      }
    } catch (error) {
      console.error('计算统计数据失败:', error)
      return {}
    }
  }

  /**
   * 更新特定统计项
   */
  const updateStatistic = (key: keyof StatisticsData, value: any): void => {
    statistics.value[key] = value
    statistics.value.lastUpdated = new Date().toISOString()
  }

  /**
   * 批量更新统计数据
   */
  const updateStatistics = (updates: Partial<StatisticsData>): void => {
    statistics.value = {
      ...statistics.value,
      ...updates,
      lastUpdated: new Date().toISOString()
    }
  }

  /**
   * 重置统计数据
   */
  const resetStatistics = (): void => {
    statistics.value = { ...defaultStatistics }
  }

  /**
   * 格式化数字显示
   */
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k'
    }
    return num.toString()
  }

  /**
   * 获取首页展示的统计数据
   */
  const getHomeStatistics = computed(() => [
    {
      key: 'totalPosts',
      label: '技术文章',
      value: statistics.value.totalPosts,
      color: 'text-blue-600 dark:text-blue-400',
      icon: 'heroicons:document-text'
    },
    {
      key: 'totalProjects', 
      label: '开源项目',
      value: statistics.value.totalProjects,
      color: 'text-green-600 dark:text-green-400',
      icon: 'heroicons:code-bracket'
    },
    {
      key: 'totalShares',
      label: '技术分享', 
      value: statistics.value.totalShares,
      color: 'text-purple-600 dark:text-purple-400',
      icon: 'heroicons:share'
    },
    {
      key: 'totalViews',
      label: '访问量',
      value: statistics.value.totalViews,
      color: 'text-orange-600 dark:text-orange-400', 
      icon: 'heroicons:eye'
    }
  ])

  /**
   * 获取博客页面的统计数据
   */
  const getBlogStatistics = computed(() => ({
    totalPosts: statistics.value.publishedPosts,
    totalCategories: statistics.value.totalCategories,
    totalTags: statistics.value.totalTags,
    totalViews: statistics.value.totalViews,
    totalLikes: statistics.value.totalLikes,
    totalComments: statistics.value.totalComments
  }))

  /**
   * 模拟增加浏览量（后续替换为API调用）
   */
  const incrementViews = (postId?: string, increment: number = 1): void => {
    updateStatistic('totalViews', statistics.value.totalViews + increment)
  }

  /**
   * 模拟增加点赞数（后续替换为API调用）
   */
  const incrementLikes = (postId?: string, increment: number = 1): void => {
    updateStatistic('totalLikes', statistics.value.totalLikes + increment)
  }

  // 自动初始化
  if (process.client && statistics.value.totalPosts === 0) {
    fetchStatistics()
  }

  return {
    // 响应式数据
    statistics: readonly(statistics),
    loading: readonly(loading),
    error: readonly(error),
    
    // 计算属性
    getHomeStatistics,
    getBlogStatistics,
    
    // 方法
    fetchStatistics,
    updateStatistic,
    updateStatistics,
    resetStatistics,
    formatNumber,
    incrementViews,
    incrementLikes,
    
    // 工具方法
    calculateStatistics
  }
}

/**
 * 首页统计数据 Composable（专用）
 */
export const useHomeStatistics = () => {
  const { getHomeStatistics, loading, formatNumber } = useStatistics()
  
  return {
    homeStats: getHomeStatistics,
    loading,
    formatNumber
  }
}

/**
 * 博客统计数据 Composable（专用）
 */
export const useBlogStatistics = () => {
  const { getBlogStatistics, loading, formatNumber, incrementViews } = useStatistics()
  
  return {
    blogStats: getBlogStatistics,
    loading,
    formatNumber,
    incrementViews
  }
}