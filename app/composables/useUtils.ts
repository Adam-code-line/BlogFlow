/**
 * 通用工具函数
 * 提供常用的工具方法，增强代码复用性
 */

/**
 * 防抖函数
 * @param func 要防抖的函数
 * @param wait 等待时间（毫秒）
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * 节流函数
 * @param func 要节流的函数
 * @param limit 限制时间（毫秒）
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * 深度克隆对象
 * @param obj 要克隆的对象
 * @returns 克隆后的对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime()) as T
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as T
  if (typeof obj === 'object') {
    const clonedObj = {} as T
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
  return obj
}

/**
 * 生成随机字符串
 * @param length 字符串长度
 * @param chars 可选字符集
 * @returns 随机字符串
 */
export function generateRandomString(
  length: number = 8,
  chars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
): string {
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * 生成唯一ID
 * @returns 唯一ID字符串
 */
export function generateUniqueId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

/**
 * 格式化文件大小
 * @param bytes 字节数
 * @param decimals 小数位数
 * @returns 格式化后的文件大小
 */
export function formatFileSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

/**
 * 格式化数字，添加千分符
 * @param num 要格式化的数字
 * @returns 格式化后的数字字符串
 */
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * 截断文本
 * @param text 要截断的文本
 * @param length 最大长度
 * @param suffix 后缀
 * @returns 截断后的文本
 */
export function truncateText(text: string, length: number, suffix: string = '...'): string {
  if (text.length <= length) return text
  return text.slice(0, length) + suffix
}

/**
 * 首字母大写
 * @param str 要处理的字符串
 * @returns 首字母大写的字符串
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * 驼峰转横线命名
 * @param str 驼峰命名字符串
 * @returns 横线命名字符串
 */
export function camelToKebab(str: string): string {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase()
}

/**
 * 横线转驼峰命名
 * @param str 横线命名字符串
 * @returns 驼峰命名字符串
 */
export function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase())
}

/**
 * 判断是否为空值
 * @param value 要判断的值
 * @returns 是否为空
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

/**
 * 数组去重
 * @param array 要去重的数组
 * @param key 对象数组的去重键
 * @returns 去重后的数组
 */
export function uniqueArray<T>(array: T[], key?: keyof T): T[] {
  if (key) {
    const seen = new Set()
    return array.filter(item => {
      const value = item[key]
      if (seen.has(value)) return false
      seen.add(value)
      return true
    })
  }
  return [...new Set(array)]
}

/**
 * 延迟执行
 * @param ms 延迟时间（毫秒）
 * @returns Promise
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 重试函数
 * @param fn 要重试的异步函数
 * @param retries 重试次数
 * @param delay 重试间隔（毫秒）
 * @returns Promise
 */
export async function retry<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    if (retries > 0) {
      await sleep(delay)
      return retry(fn, retries - 1, delay)
    }
    throw error
  }
}

/**
 * 安全解析JSON
 * @param str JSON字符串
 * @param defaultValue 默认值
 * @returns 解析结果
 */
export function safeJsonParse<T>(str: string, defaultValue: T): T {
  try {
    return JSON.parse(str)
  } catch {
    return defaultValue
  }
}

/**
 * 获取嵌套对象属性值
 * @param obj 对象
 * @param path 属性路径（如 'user.profile.name'）
 * @param defaultValue 默认值
 * @returns 属性值
 */
export function getNestedValue(obj: any, path: string, defaultValue: any = undefined): any {
  return path.split('.').reduce((current, key) => current?.[key], obj) ?? defaultValue
}

/**
 * 设置嵌套对象属性值
 * @param obj 对象
 * @param path 属性路径
 * @param value 要设置的值
 */
export function setNestedValue(obj: any, path: string, value: any): void {
  const keys = path.split('.')
  const lastKey = keys.pop()!
  const target = keys.reduce((current, key) => {
    if (!(key in current)) current[key] = {}
    return current[key]
  }, obj)
  target[lastKey] = value
}

/**
 * URL参数解析
 * @param url URL字符串
 * @returns 参数对象
 */
export function parseUrlParams(url: string): Record<string, string> {
  const params: Record<string, string> = {}
  const urlObj = new URL(url)
  urlObj.searchParams.forEach((value, key) => {
    params[key] = value
  })
  return params
}

/**
 * 对象转URL参数
 * @param params 参数对象
 * @returns URL参数字符串
 */
export function objectToUrlParams(params: Record<string, any>): string {
  return Object.entries(params)
    .filter(([, value]) => value !== null && value !== undefined)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&')
}

/**
 * 数组分组
 * @param array 要分组的数组
 * @param keyFn 分组键函数
 * @returns 分组后的对象
 */
export function groupBy<T, K extends string | number>(
  array: T[],
  keyFn: (item: T) => K
): Record<K, T[]> {
  return array.reduce((groups, item) => {
    const key = keyFn(item)
    if (!groups[key]) groups[key] = []
    groups[key].push(item)
    return groups
  }, {} as Record<K, T[]>)
}

/**
 * 数组排序（支持多字段）
 * @param array 要排序的数组
 * @param sortConfigs 排序配置
 * @returns 排序后的数组
 */
export function multiSort<T>(
  array: T[],
  sortConfigs: Array<{
    key: keyof T
    order?: 'asc' | 'desc'
  }>
): T[] {
  return [...array].sort((a, b) => {
    for (const config of sortConfigs) {
      const { key, order = 'asc' } = config
      const aVal = a[key]
      const bVal = b[key]
      
      if (aVal < bVal) return order === 'asc' ? -1 : 1
      if (aVal > bVal) return order === 'asc' ? 1 : -1
    }
    return 0
  })
}
