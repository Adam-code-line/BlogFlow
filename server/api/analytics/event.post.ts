export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // 记录统计数据（可以保存到数据库）
    console.log('Analytics Event:', {
      ...body,
      timestamp: new Date().toISOString(),
      userAgent: getHeader(event, 'user-agent'),
      ip: getHeader(event, 'x-forwarded-for') || getHeader(event, 'x-real-ip') || 'unknown'
    })

    return {
      success: true,
      message: 'Event tracked successfully',
      data: null
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: '统计记录失败'
    })
  }
})
