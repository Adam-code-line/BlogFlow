/**
 * 管理员系统通用工具函数
 */

import { UserRole } from '~/types/user'

// 日期格式化工具
export const useAdminDate = () => {
  const formatDate = (date: string | Date, format: 'short' | 'medium' | 'long' = 'medium') => {
    const dateObj = new Date(date)
    
    const formatOptions: Record<string, Intl.DateTimeFormatOptions> = {
      short: {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      },
      medium: {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      },
      long: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }
    }
    
    return new Intl.DateTimeFormat('zh-CN', formatOptions[format]).format(dateObj)
  }

  const formatRelativeTime = (date: string | Date) => {
    const now = new Date()
    const targetDate = new Date(date)
    const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000)

    if (diffInSeconds < 60) return '刚刚'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}分钟前`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}小时前`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}天前`
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}个月前`
    return `${Math.floor(diffInSeconds / 31536000)}年前`
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60

    if (hours > 0) {
      return `${hours}小时${minutes}分钟`
    } else if (minutes > 0) {
      return `${minutes}分钟${remainingSeconds}秒`
    } else {
      return `${remainingSeconds}秒`
    }
  }

  return {
    formatDate,
    formatRelativeTime,
    formatDuration
  }
}

// 数字格式化工具
export const useAdminNumber = () => {
  const formatNumber = (num: number, locale = 'zh-CN') => {
    return new Intl.NumberFormat(locale).format(num)
  }

  const formatCompactNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const formatPercentage = (num: number, decimals = 2) => {
    return `${(num * 100).toFixed(decimals)}%`
  }

  const formatCurrency = (amount: number, currency = 'CNY') => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency
    }).format(amount)
  }

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (bytes === 0) return '0 Bytes'
    
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i]
  }

  return {
    formatNumber,
    formatCompactNumber,
    formatPercentage,
    formatCurrency,
    formatFileSize
  }
}

// 字符串工具
export const useAdminString = () => {
  const truncate = (str: string, length = 50, suffix = '...') => {
    if (str.length <= length) return str
    return str.substring(0, length) + suffix
  }

  const slugify = (str: string) => {
    return str
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const capitalizeFirst = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  const capitalizeWords = (str: string) => {
    return str.replace(/\b\w/g, l => l.toUpperCase())
  }

  const extractInitials = (name: string, length = 2) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, length)
      .join('')
  }

  const generateRandomString = (length = 8) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  return {
    truncate,
    slugify,
    capitalizeFirst,
    capitalizeWords,
    extractInitials,
    generateRandomString
  }
}

// 用户角色和权限工具
export const useAdminRole = () => {
  const getRoleLabel = (role: UserRole): string => {
    const labels: Record<UserRole, string> = {
      [UserRole.ADMIN]: '管理员',
      [UserRole.AUTHOR]: '作者',
      [UserRole.EDITOR]: '编辑',
      [UserRole.SUBSCRIBER]: '订阅者',
      [UserRole.GUEST]: '访客'
    }
    return labels[role] || '未知'
  }

  const getRoleColor = (role: UserRole): string => {
    const colors: Record<UserRole, string> = {
      [UserRole.ADMIN]: 'red',
      [UserRole.AUTHOR]: 'blue',
      [UserRole.EDITOR]: 'green',
      [UserRole.SUBSCRIBER]: 'yellow',
      [UserRole.GUEST]: 'gray'
    }
    return colors[role] || 'gray'
  }

  const getRolePermissions = (role: UserRole): string[] => {
    const permissions: Record<UserRole, string[]> = {
      [UserRole.ADMIN]: ['read', 'write', 'delete', 'admin'],
      [UserRole.AUTHOR]: ['read', 'write'],
      [UserRole.EDITOR]: ['read', 'write', 'edit'],
      [UserRole.SUBSCRIBER]: ['read'],
      [UserRole.GUEST]: ['read:public']
    }
    return permissions[role] || []
  }

  const hasPermission = (userRole: UserRole, requiredPermission: string): boolean => {
    const userPermissions = getRolePermissions(userRole)
    return userPermissions.includes(requiredPermission) || userPermissions.includes('admin')
  }

  const canAccess = (userRole: UserRole, resource: string): boolean => {
    // 管理员可以访问所有资源
    if (userRole === UserRole.ADMIN) return true
    
    // 其他角色的访问控制
    const accessMap: Record<string, UserRole[]> = {
      'admin': [UserRole.ADMIN],
      'posts': [UserRole.ADMIN, UserRole.AUTHOR, UserRole.EDITOR],
      'users': [UserRole.ADMIN],
      'comments': [UserRole.ADMIN, UserRole.EDITOR],
      'dashboard': [UserRole.ADMIN, UserRole.AUTHOR, UserRole.EDITOR]
    }
    
    return accessMap[resource]?.includes(userRole) || false
  }

  return {
    getRoleLabel,
    getRoleColor,
    getRolePermissions,
    hasPermission,
    canAccess
  }
}

// 验证工具
export const useAdminValidation = () => {
  const isEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const isUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const isStrongPassword = (password: string): boolean => {
    // 至少8位，包含大小写字母、数字和特殊字符
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    return strongPasswordRegex.test(password)
  }

  const isValidUsername = (username: string): boolean => {
    // 3-20位，只能包含字母、数字、下划线、连字符
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/
    return usernameRegex.test(username)
  }

  const isValidSlug = (slug: string): boolean => {
    // 只能包含小写字母、数字、连字符
    const slugRegex = /^[a-z0-9-]+$/
    return slugRegex.test(slug)
  }

  const validateRequired = (value: any): boolean => {
    if (typeof value === 'string') return value.trim().length > 0
    if (Array.isArray(value)) return value.length > 0
    return value !== null && value !== undefined
  }

  const validateLength = (value: string, min: number, max?: number): boolean => {
    const length = value.length
    if (length < min) return false
    if (max && length > max) return false
    return true
  }

  return {
    isEmail,
    isUrl,
    isStrongPassword,
    isValidUsername,
    isValidSlug,
    validateRequired,
    validateLength
  }
}

// 数据导出工具
export const useAdminExport = () => {
  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return

    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header]
          return typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value
        }).join(',')
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportToJSON = (data: any[], filename: string) => {
    const jsonContent = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonContent], { type: 'application/json' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}.json`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return {
    exportToCSV,
    exportToJSON
  }
}

// 防抖和节流工具
export const useAdminDebounce = () => {
  const debounce = <T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => func(...args), delay)
    }
  }

  const throttle = <T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): ((...args: Parameters<T>) => void) => {
    let lastCall = 0
    
    return (...args: Parameters<T>) => {
      const now = Date.now()
      if (now - lastCall >= delay) {
        lastCall = now
        func(...args)
      }
    }
  }

  return {
    debounce,
    throttle
  }
}