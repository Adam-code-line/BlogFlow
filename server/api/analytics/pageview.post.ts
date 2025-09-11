export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // 记录页面访问（可以保存到数据库）
    console.log('Page View:', {
      ...body,
      timestamp: new Date().toISOString(),
      userAgent: getHeader(event, 'user-agent'),
      ip: getHeader(event, 'x-forwarded-for') || getHeader(event, 'x-real-ip') || 'unknown'
    })

    return {
      success: true,
      message: 'Page view tracked successfully',
      data: null
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: '页面访问记录失败'
    })
  }
})
