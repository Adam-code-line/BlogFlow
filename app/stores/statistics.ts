/**
 * 统计数据 Store
 * 使用 Pinia 管理全局统计数据状态
 */

import { defineStore } from 'pinia'

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
  
  // 扩展统计
  totalLikes: number
  totalComments: number
  
  // 时间相关统计
  lastUpdated: string
  
  // 扩展字段，便于后续添加
  [key: string]: any
}

export const useStatisticsStore = defineStore('statistics', () => {
  
  // 状态
  const statistics = ref<StatisticsData>({
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
  })
  
  const loading = ref(false)
  const error = ref<string | null>(null)
  const lastFetchTime = ref<number>(0)
  
  // 缓存时间（5分钟）
  const CACHE_DURATION = 5 * 60 * 1000

  // Getters
  const isDataStale = computed(() => {
    return Date.now() - lastFetchTime.value > CACHE_DURATION
  })

  const homeStatistics = computed(() => [
    {
      key: 'totalPosts',
      label: '技术文章',
      value: statistics.value.totalPosts,
      color: 'text-blue-600 dark:text-blue-400',
      icon: 'heroicons:document-text',
      formatValue: formatNumber(statistics.value.totalPosts)
    },
    {
      key: 'totalProjects', 
      label: '开源项目',
      value: statistics.value.totalProjects,
      color: 'text-green-600 dark:text-green-400',
      icon: 'heroicons:code-bracket',
      formatValue: formatNumber(statistics.value.totalProjects)
    },
    {
      key: 'totalShares',
      label: '技术分享', 
      value: statistics.value.totalShares,
      color: 'text-purple-600 dark:text-purple-400',
      icon: 'heroicons:share',
      formatValue: formatNumber(statistics.value.totalShares) + '+'
    },
    {
      key: 'totalViews',
      label: '访问量',
      value: statistics.value.totalViews,
      color: 'text-orange-600 dark:text-orange-400', 
      icon: 'heroicons:eye',
      formatValue: formatNumber(statistics.value.totalViews)
    }
  ])

  const blogStatistics = computed(() => ({
    totalPosts: statistics.value.publishedPosts,
    totalCategories: statistics.value.totalCategories,
    totalTags: statistics.value.totalTags,
    totalViews: statistics.value.totalViews,
    totalLikes: statistics.value.totalLikes,
    totalComments: statistics.value.totalComments
  }))

  // Actions
  const fetchStatistics = async (force: boolean = false) => {
    // 如果数据还很新且不强制刷新，直接返回
    if (!force && !isDataStale.value && statistics.value.totalPosts > 0) {
      return
    }

    loading.value = true
    error.value = null
    
    try {
      // TODO: 后续替换为真实的API调用
      // const response = await $fetch('/api/statistics')
      
      // 目前从本地计算数据
      const calculatedStats = await calculateStatistics()
      
      statistics.value = {
        ...statistics.value,
        ...calculatedStats,
        lastUpdated: new Date().toISOString()
      }
      
      lastFetchTime.value = Date.now()
      
    } catch (err: any) {
      console.error('获取统计数据失败:', err)
      error.value = err.message || '获取统计数据失败'
    } finally {
      loading.value = false
    }
  }

  // 计算统计数据
  const calculateStatistics = async (): Promise<Partial<StatisticsData>> => {
    try {
      const { getPostsAction } = await import('~/composables/usePostActions')
      const posts = await getPostsAction()
      
      // 假设所有从本地获取的文章都是已发布的
      const publishedPosts = posts.length
      const draftPosts = 0 // 暂时设为0，后续可以添加草稿功能
      const totalCategories = new Set(posts.map(post => post.category).filter(Boolean)).size
      const totalTags = new Set(posts.flatMap(post => post.tags || [])).size
      
      // 计算真实的总浏览量，如果没有数据则为0
      const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0)
      
      return {
        totalPosts: publishedPosts,
        publishedPosts,
        draftPosts,
        totalCategories,
        totalTags,
        totalViews, // 使用真实数据，没有则为0
        totalLikes: 0, // 暂时设为0，等待后续添加likes字段
        totalComments: 0, // 暂时设为0，等待后续添加comments字段  
        totalProjects: 0, // 暂时设为0，后续从真实数据源获取
        totalShares: 0 // 暂时设为0，后续从真实数据源获取
      }
    } catch (error) {
      console.error('计算统计数据失败:', error)
      return {}
    }
  }

  // 更新单个统计项
  const updateStatistic = (key: keyof StatisticsData, value: any) => {
    statistics.value[key] = value
    statistics.value.lastUpdated = new Date().toISOString()
  }

  // 批量更新统计数据
  const updateStatistics = (updates: Partial<StatisticsData>) => {
    Object.assign(statistics.value, updates)
    statistics.value.lastUpdated = new Date().toISOString()
  }

  // 增加浏览量
  const incrementViews = (increment: number = 1) => {
    updateStatistic('totalViews', statistics.value.totalViews + increment)
  }

  // 增加点赞数
  const incrementLikes = (increment: number = 1) => {
    updateStatistic('totalLikes', statistics.value.totalLikes + increment)
  }

  // 重置数据
  const resetStatistics = () => {
    statistics.value = {
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
    lastFetchTime.value = 0
  }

  // 格式化数字
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k'
    }
    return num.toString()
  }

  return {
    // 状态
    statistics: readonly(statistics),
    loading: readonly(loading),
    error: readonly(error),
    isDataStale,
    
    // 计算属性
    homeStatistics,
    blogStatistics,
    
    // 方法
    fetchStatistics,
    updateStatistic,
    updateStatistics,
    incrementViews,
    incrementLikes,
    resetStatistics,
    formatNumber
  }
})