/**
 * 管理员认证 API 端点
 * 提供安全的管理员登录验证
 */

export default defineEventHandler(async (event) => {
  try {
    // 只允许POST请求
    if (getMethod(event) !== 'POST') {
      throw createError({
        statusCode: 405,
        statusMessage: 'Method Not Allowed'
      })
    }

    const body = await readBody(event)
    const { username, password, confirmCode } = body

    // 验证请求数据
    if (!username || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: '用户名和密码不能为空'
      })
    }

    // 模拟管理员认证逻辑
    const ADMIN_CONFIG = {
      username: 'admin',
      password: 'BlogFlow2024!Admin',
      allowedIPs: ['127.0.0.1', 'localhost']
    }

    // 获取客户端IP（简化版）
    const clientIP = getClientIP(event) || '127.0.0.1'
    
    // 基础认证检查
    if (username !== ADMIN_CONFIG.username || password !== ADMIN_CONFIG.password) {
      // 记录失败尝试
      console.warn(`管理员登录失败 - 用户名: ${username}, IP: ${clientIP}`)
      
      throw createError({
        statusCode: 401,
        statusMessage: '用户名或密码错误'
      })
    }

    // 二次验证码检查
    if (!confirmCode) {
      return {
        success: false,
        requiresConfirmation: true,
        message: '请输入确认码'
      }
    }

    // 验证确认码（每分钟变化的4位数或测试码1234）
    const expectedCode = Math.floor(Date.now() / 60000).toString().slice(-4)
    if (confirmCode !== expectedCode && confirmCode !== '1234') {
      throw createError({
        statusCode: 401,
        statusMessage: '确认码错误'
      })
    }

    // 生成JWT token（简化版，实际项目中应该使用更安全的实现）
    const tokenPayload = {
      userId: 'admin-001',
      username: ADMIN_CONFIG.username,
      role: 'admin',
      ip: clientIP,
      iat: Date.now(),
      exp: Date.now() + (2 * 60 * 60 * 1000) // 2小时过期
    }

    // 在实际项目中，这里应该使用JWT库和密钥签名
    const token = Buffer.from(JSON.stringify(tokenPayload)).toString('base64')

    // 记录成功登录
    console.info(`管理员登录成功 - 用户名: ${username}, IP: ${clientIP}`)

    return {
      success: true,
      message: '登录成功',
      data: {
        user: {
          id: tokenPayload.userId,
          username: tokenPayload.username,
          role: tokenPayload.role,
          permissions: ['read', 'write', 'delete', 'admin']
        },
        token,
        expiresIn: 2 * 60 * 60, // 2小时（秒）
        expiresAt: tokenPayload.exp
      }
    }

  } catch (error: any) {
    console.error('管理员认证API错误:', error)
    
    // 如果是已知的HTTP错误，直接抛出
    if (error.statusCode) {
      throw error
    }
    
    // 其他错误返回500
    throw createError({
      statusCode: 500,
      statusMessage: '服务器内部错误'
    })
  }
})

/**
 * 获取客户端IP地址
 */
function getClientIP(event: any): string {
  try {
    const forwarded = getHeader(event, 'x-forwarded-for')
    const realIP = getHeader(event, 'x-real-ip')
    const remoteAddress = event.node?.req?.connection?.remoteAddress
    
    // 处理 x-forwarded-for 头
    if (forwarded) {
      const forwardedStr = Array.isArray(forwarded) ? forwarded[0] : String(forwarded)
      return forwardedStr.split(',')[0].trim()
    }
    
    // 处理 x-real-ip 头
    if (realIP) {
      return Array.isArray(realIP) ? realIP[0] : String(realIP)
    }
    
    // 返回远程地址或默认值
    return remoteAddress || '127.0.0.1'
  } catch (error) {
    console.warn('获取客户端IP失败:', error)
    return '127.0.0.1'
  }
}