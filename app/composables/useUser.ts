/**
 * 用户相关的 composable
 * 提供用户数据获取和操作功能
 */

import type { PublicUser, UserStats } from '~/types/user'
import { UserRole } from '~/types/user'
import type { ContentPost } from '~/types'
import { formatters } from '~/utils/format'

// 模拟用户数据
const mockUsers: PublicUser[] = [
  {
    id: '1',
    username: 'johndev',
    displayName: 'John Developer',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    bio: '全栈开发者，专注于现代Web技术和用户体验设计。喜欢分享技术心得和最佳实践。',
    location: '上海, 中国',
    website: 'https://johndev.com',
    socialLinks: {
      github: 'https://github.com/johndev',
      twitter: 'https://twitter.com/johndev',
      website: 'https://johndev.com'
    },
    occupation: '高级前端工程师',
    skills: ['Vue.js', 'TypeScript', 'Node.js', 'Python', 'Docker'],
    stats: {
      postsCount: 45,
      followersCount: 1200,
      joinedDaysAgo: 365
    },
    role: UserRole.AUTHOR,
    isProfileComplete: true
  },
  {
    id: '2', 
    username: 'sarahui',
    displayName: 'Sarah UI Designer',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5e5?w=200&h=200&fit=crop&crop=face',
    bio: 'UI/UX设计师，致力于创造直观美观的用户界面。热爱设计系统和交互设计。',
    location: '北京, 中国',
    website: 'https://sarahui.design',
    socialLinks: {
      website: 'https://sarahui.design',
      twitter: 'https://twitter.com/sarahui'
    },
    occupation: 'UI/UX设计师',
    skills: ['Figma', 'Sketch', 'Prototyping', 'Design System'],
    stats: {
      postsCount: 28,
      followersCount: 890,
      joinedDaysAgo: 240
    },
    role: UserRole.AUTHOR,
    isProfileComplete: true
  },
  {
    id: '3',
    username: 'mikeback',
    displayName: 'Mike Backend',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    bio: '后端工程师，专注于系统架构和性能优化。喜欢探索新技术和解决复杂问题。',
    location: '深圳, 中国',
    socialLinks: {
      github: 'https://github.com/mikeback'
    },
    occupation: '后端工程师',
    skills: ['Java', 'Spring Boot', 'MySQL', 'Redis', 'Kubernetes'],
    stats: {
      postsCount: 32,
      followersCount: 567,
      joinedDaysAgo: 180
    },
    role: UserRole.AUTHOR,
    isProfileComplete: true
  }
]

// 用户管理 composable
export const useUsers = () => {
  // 获取用户列表
  const getUsers = async (options: {
    page?: number
    limit?: number
    search?: string
    role?: string
    sortBy?: string
  } = {}) => {
    const { page = 1, limit = 12, search = '', role = '', sortBy = 'createdAt' } = options
    
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    let filteredUsers = [...mockUsers]
    
    // 搜索过滤
    if (search) {
      filteredUsers = filteredUsers.filter(user => 
        user.displayName.toLowerCase().includes(search.toLowerCase()) ||
        user.username.toLowerCase().includes(search.toLowerCase()) ||
        user.bio?.toLowerCase().includes(search.toLowerCase())
      )
    }
    
    // 角色过滤
    if (role) {
      filteredUsers = filteredUsers.filter(user => user.role === role)
    }
    
    // 排序
    filteredUsers.sort((a, b) => {
      switch (sortBy) {
        case 'postsCount':
          return b.stats.postsCount - a.stats.postsCount
        case 'followersCount':
          return b.stats.followersCount - a.stats.followersCount
        case 'joinedDaysAgo':
          return a.stats.joinedDaysAgo - b.stats.joinedDaysAgo
        default:
          return a.stats.joinedDaysAgo - b.stats.joinedDaysAgo
      }
    })
    
    // 分页
    const start = (page - 1) * limit
    const end = start + limit
    const paginatedUsers = filteredUsers.slice(start, end)
    
    return {
      data: paginatedUsers,
      pagination: {
        page,
        limit,
        total: filteredUsers.length,
        pages: Math.ceil(filteredUsers.length / limit),
        hasNext: end < filteredUsers.length,
        hasPrev: page > 1
      }
    }
  }
  
  // 根据ID获取用户
  const getUserById = async (id: string): Promise<PublicUser | null> => {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const user = mockUsers.find(u => u.id === id)
    return user || null
  }
  
  // 获取用户文章
  const getUserPosts = async (userId: string): Promise<ContentPost[]> => {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 400))
    
    // 模拟用户文章数据
    const user = mockUsers.find(u => u.id === userId)
    if (!user) return []
    
    const mockPosts: ContentPost[] = Array.from({ length: user.stats.postsCount }, (_, index) => ({
      path: `/blog/post-${userId}-${index + 1}`,
      title: `用户 ${user.displayName} 的文章 ${index + 1}`,
      description: `这是 ${user.displayName} 发布的第 ${index + 1} 篇文章，内容非常精彩。`,
      cover: `https://images.unsplash.com/photo-${1500000000000 + index}?w=800&h=400&fit=crop`,
      category: ['技术', '设计', '教程'][index % 3],
      tags: ['Vue.js', 'TypeScript', 'Web开发', 'UI设计', '最佳实践'].slice(0, Math.floor(Math.random() * 3) + 2),
      author: {
        name: user.displayName,
        avatar: user.avatar
      },
      publishedAt: formatters.date.toISO(new Date(Date.now() - index * 7 * 24 * 60 * 60 * 1000)),
      readingTime: Math.floor(Math.random() * 10) + 3,
      views: Math.floor(Math.random() * 1000) + 100,
      likes: Math.floor(Math.random() * 50) + 10,
      featured: index < 3
    }))
    
    return mockPosts
  }
  
  return {
    getUsers,
    getUserById,
    getUserPosts
  }
}

// 用户统计 composable
export const useUserStats = () => {
  // 创建完整的用户统计对象
  const createFullStats = (basicStats: { postsCount: number; followersCount: number; joinedDaysAgo: number }): UserStats => {
    return {
      ...basicStats,
      commentsCount: Math.floor(basicStats.postsCount * 2.5),
      likesReceived: Math.floor(basicStats.postsCount * 15),
      viewsReceived: Math.floor(basicStats.postsCount * 200),
      followingCount: Math.floor(basicStats.followersCount * 0.3),
      lastActiveAt: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000)
    }
  }
  
  return {
    createFullStats
  }
}

// 用户操作 composable
export const useUserActions = () => {
  const following = ref<Set<string>>(new Set())
  
  // 关注/取消关注
  const toggleFollow = async (userId: string) => {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 300))
    
    if (following.value.has(userId)) {
      following.value.delete(userId)
      return { action: 'unfollow', success: true }
    } else {
      following.value.add(userId)
      return { action: 'follow', success: true }
    }
  }
  
  // 检查是否已关注
  const isFollowing = (userId: string) => {
    return following.value.has(userId)
  }
  
  return {
    toggleFollow,
    isFollowing,
    following: readonly(following)
  }
}