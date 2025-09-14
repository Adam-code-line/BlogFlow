/**
 * 统计数据 API 端点模拟
 * 为将来的后端集成准备，提供统一的API接口
 */

export default defineEventHandler(async (event) => {
  try {
    // 模拟 API 延迟
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // TODO: 这里将来替换为真实的数据库查询
    // 目前返回模拟数据，基于本地存储计算
    
    // 获取本地存储的文章数据进行计算
    const posts = await getStoredPosts()
    
    const statistics = {
      totalPosts: posts.length,
      totalProjects: 15, // 固定值，可以从数据库获取
      totalShares: Math.max(posts.length * 3, 100),
      totalViews: posts.reduce((sum, post) => sum + (post.views || 0), 0) || 2500,
      publishedPosts: posts.length,
      draftPosts: 0, // 暂时设为0
      totalCategories: new Set(posts.map(post => post.category).filter(Boolean)).size,
      totalTags: new Set(posts.flatMap(post => post.tags || [])).size,
      lastUpdated: new Date().toISOString(),
      
      // 扩展统计信息
      averageReadingTime: Math.ceil(
        posts.reduce((sum, post) => sum + (post.readingTime || 5), 0) / Math.max(posts.length, 1)
      ),
      mostPopularCategory: getMostPopularCategory(posts),
      recentActivity: getRecentActivity(posts)
    }
    
    return {
      success: true,
      data: statistics,
      timestamp: new Date().toISOString()
    }
    
  } catch (error) {
    console.error('获取统计数据失败:', error)
    
    return createError({
      statusCode: 500,
      statusMessage: '获取统计数据失败',
      data: {
        error: error instanceof Error ? error.message : '未知错误'
      }
    })
  }
})

/**
 * 获取本地存储的文章（服务端模拟）
 */
async function getStoredPosts(): Promise<any[]> {
  try {
    // 在服务端，我们需要从文件系统或数据库读取
    // 这里暂时返回空数组，实际使用时应该从持久化存储读取
    return []
  } catch (error) {
    console.error('读取文章数据失败:', error)
    return []
  }
}

/**
 * 获取最受欢迎的分类
 */
function getMostPopularCategory(posts: any[]): string {
  const categoryCount = new Map<string, number>()
  
  posts.forEach(post => {
    if (post.category) {
      categoryCount.set(post.category, (categoryCount.get(post.category) || 0) + 1)
    }
  })
  
  let mostPopular = ''
  let maxCount = 0
  
  for (const [category, count] of categoryCount.entries()) {
    if (count > maxCount) {
      maxCount = count
      mostPopular = category
    }
  }
  
  return mostPopular || '前端开发'
}

/**
 * 获取最近活动
 */
function getRecentActivity(posts: any[]): Array<{
  type: string
  title: string
  date: string
}> {
  return posts
    .filter(post => post.publishedAt)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 5)
    .map(post => ({
      type: 'post_published',
      title: post.title,
      date: post.publishedAt
    }))
}