/**
 * 管理员Token验证 API
 * 用于验证JWT token的有效性
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
    const { token } = body

    if (!token) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Token不能为空'
      })
    }

    // 解码token（实际项目中应该使用JWT库验证签名）
    try {
      const decodedToken = JSON.parse(Buffer.from(token, 'base64').toString())
      
      // 检查token是否过期
      if (Date.now() > decodedToken.exp) {
        throw createError({
          statusCode: 401,
          statusMessage: 'Token已过期'
        })
      }

      // 验证token格式
      if (!decodedToken.userId || !decodedToken.username || decodedToken.role !== 'admin') {
        throw createError({
          statusCode: 401,
          statusMessage: 'Token格式无效'
        })
      }

      // 获取当前IP并验证（可选的额外安全检查）
      const currentIP = getClientIP(event)
      if (decodedToken.ip && decodedToken.ip !== currentIP) {
        console.warn(`IP地址变化检测 - Token IP: ${decodedToken.ip}, 当前IP: ${currentIP}`)
        // 根据安全策略决定是否拒绝（这里只警告）
      }

      return {
        success: true,
        valid: true,
        data: {
          user: {
            id: decodedToken.userId,
            username: decodedToken.username,
            role: decodedToken.role,
            permissions: ['read', 'write', 'delete', 'admin']
          },
          expiresAt: decodedToken.exp,
          timeRemaining: Math.max(0, decodedToken.exp - Date.now())
        }
      }

    } catch (decodeError) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Token无效'
      })
    }

  } catch (error: any) {
    console.error('Token验证API错误:', error)
    
    if (error.statusCode) {
      throw error
    }
    
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