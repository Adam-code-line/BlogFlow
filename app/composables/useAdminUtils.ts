/**
 * 管理员系统通用工具函数
 */

import { REGEX_PATTERNS } from '~/utils/constants'

// 定义简化的用户角色枚举
enum UserRole {
  ADMIN = 'admin',
  AUTHOR = 'author',
  EDITOR = 'editor',
  SUBSCRIBER = 'subscriber',
  GUEST = 'guest'
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
    return REGEX_PATTERNS.EMAIL.test(email)
  }

  const isUrl = (url: string): boolean => {
    return REGEX_PATTERNS.URL.test(url)
  }

  const isStrongPassword = (password: string): boolean => {
    // 至少8位，包含大小写字母、数字和特殊字符
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    return strongPasswordRegex.test(password)
  }

  const isValidUsername = (username: string): boolean => {
    return REGEX_PATTERNS.USERNAME.test(username)
  }

  const isValidSlug = (slug: string): boolean => {
    return REGEX_PATTERNS.SLUG.test(slug)
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