export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // 简单的表单验证
    const { name, email, subject, message } = body
    
    if (!name || !email || !subject || !message) {
      throw createError({
        statusCode: 400,
        statusMessage: '所有字段都是必填的'
      })
    }

    // 邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw createError({
        statusCode: 400,
        statusMessage: '邮箱格式不正确'
      })
    }

    // 这里可以集成邮件发送服务（如 Nodemailer, SendGrid 等）
    // 目前只是模拟处理
    console.log('收到联系表单提交:', {
      name,
      email,
      subject,
      message,
      timestamp: new Date().toISOString()
    })

    // 模拟异步处理
    await new Promise(resolve => setTimeout(resolve, 1000))

    return {
      success: true,
      message: '消息发送成功！我们会尽快回复您。',
      data: null
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || '服务器错误'
    })
  }
})
