/**
 * 简单的文章创建 API - 前端测试版本
 * 使用内存存储，避免复杂的后端逻辑
 */

// 简单的内存存储（仅用于演示）
let posts: any[] = []

export default defineEventHandler(async (event) => {
  try {
    // 只允许POST请求
    if (getMethod(event) !== 'POST') {
      throw createError({
        statusCode: 405,
        statusMessage: 'Method Not Allowed'
      })
    }

    // 获取请求体
    const body = await readBody(event)
    
    // 简单验证
    if (!body.title || !body.content) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Title and content are required'
      })
    }
    
    // 生成简单的文章数据
    const postData = {
      id: Date.now().toString(),
      ...body,
      slug: body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      publishedAt: body.publishedAt || new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      likes: 0,
      comments: 0
    }

    // 存储到内存（实际项目中这里会是数据库操作）
    posts.push(postData)

    return {
      success: true,
      data: postData,
      message: '文章创建成功'
    }

  } catch (error) {
    console.error('Create post error:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    })
  }
})