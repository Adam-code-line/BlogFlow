/**
 * 获取文章列表 API
 */

export default defineEventHandler(async (event) => {
  try {
    // 模拟获取文章列表
    const posts = await getStoredPosts()
    
    return {
      success: true,
      data: posts,
      total: posts.length,
      timestamp: new Date().toISOString()
    }
    
  } catch (error) {
    console.error('获取文章列表失败:', error)
    
    return createError({
      statusCode: 500,
      statusMessage: '获取文章列表失败',
      data: {
        error: error instanceof Error ? error.message : '未知错误'
      }
    })
  }
})

/**
 * 获取本地存储的文章
 */
async function getStoredPosts(): Promise<any[]> {
  try {
    // 这里暂时返回空数组，实际使用时应该从持久化存储读取
    return []
  } catch (error) {
    console.error('读取文章数据失败:', error)
    return []
  }
}