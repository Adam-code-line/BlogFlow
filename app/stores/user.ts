import { defineStore } from 'pinia'
import type { PublicUser, UserQuery, UsersResponse, UserStats } from '~/types/user'
import { useUsers } from '~/composables/useUser'

interface UserState {
  // 用户列表相关
  users: PublicUser[]
  userPagination: {
    page: number
    limit: number
    total: number
    pages: number
    hasNext: boolean
    hasPrev: boolean
  }
  usersLoading: boolean
  usersError: string | null
  
  // 搜索和筛选
  searchQuery: string
  selectedRole: string
  sortBy: string
  
  // 当前用户详情
  currentUser: PublicUser | null
  currentUserLoading: boolean
  currentUserError: string | null
  
  // 用户文章
  userPosts: any[]
  userPostsLoading: boolean
  userPostsError: string | null
  
  // 关注状态
  following: Set<string>
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    // 用户列表相关
    users: [],
    userPagination: {
      page: 1,
      limit: 12,
      total: 0,
      pages: 0,
      hasNext: false,
      hasPrev: false
    },
    usersLoading: false,
    usersError: null,
    
    // 搜索和筛选
    searchQuery: '',
    selectedRole: '',
    sortBy: 'createdAt',
    
    // 当前用户详情
    currentUser: null,
    currentUserLoading: false,
    currentUserError: null,
    
    // 用户文章
    userPosts: [],
    userPostsLoading: false,
    userPostsError: null,
    
    // 关注状态
    following: new Set<string>()
  }),

  getters: {
    // 获取过滤后的用户列表
    filteredUsers: (state) => {
      let filtered = [...state.users]
      
      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase()
        filtered = filtered.filter(user => 
          user.username.toLowerCase().includes(query) ||
          user.displayName.toLowerCase().includes(query) ||
          user.bio?.toLowerCase().includes(query)
        )
      }
      
      if (state.selectedRole) {
        filtered = filtered.filter(user => user.role === state.selectedRole)
      }
      
      return filtered
    },
    
    // 获取分页后的用户列表
    paginatedUsers(): PublicUser[] {
      const start = (this.userPagination.page - 1) * this.userPagination.limit
      const end = start + this.userPagination.limit
      return this.filteredUsers.slice(start, end)
    },
    
    // 检查是否已关注某用户
    isFollowing: (state) => (userId: string) => {
      return state.following.has(userId)
    },
    
    // 获取用户统计信息
    getUserStats: (state) => (userId: string) => {
      const user = state.users.find(u => u.id === userId)
      return user?.stats
    }
  },

  actions: {
    // 获取用户列表
    async fetchUsers(query?: Partial<UserQuery>) {
      this.usersLoading = true
      this.usersError = null
      
      try {
        const { getUsers } = useUsers()
        const queryParams = {
          page: query?.page || this.userPagination.page,
          limit: query?.limit || this.userPagination.limit,
          search: query?.search || this.searchQuery,
          role: query?.role || this.selectedRole,
          sortBy: query?.sortBy || this.sortBy
        }
        
        const result = await getUsers(queryParams)
        this.users = result.data
        this.userPagination = result.pagination
      } catch (error) {
        this.usersError = '获取用户列表失败'
        console.error('Failed to fetch users:', error)
      } finally {
        this.usersLoading = false
      }
    },
    
    // 获取单个用户详情
    async fetchUserById(userId: string) {
      this.currentUserLoading = true
      this.currentUserError = null
      
      try {
        const { getUserById } = useUsers()
        const user = await getUserById(userId)
        this.currentUser = user
      } catch (error) {
        this.currentUserError = '获取用户信息失败'
        console.error('Failed to fetch user:', error)
      } finally {
        this.currentUserLoading = false
      }
    },
    
    // 获取用户文章
    async fetchUserPosts(userId: string) {
      this.userPostsLoading = true
      this.userPostsError = null
      
      try {
        const { getUserPosts } = useUsers()
        const posts = await getUserPosts(userId)
        this.userPosts = posts
      } catch (error) {
        this.userPostsError = '获取用户文章失败'
        console.error('Failed to fetch user posts:', error)
      } finally {
        this.userPostsLoading = false
      }
    },
    
    // 设置搜索查询
    setSearchQuery(query: string) {
      this.searchQuery = query
      this.userPagination.page = 1
    },
    
    // 设置角色筛选
    setSelectedRole(role: string) {
      this.selectedRole = role
      this.userPagination.page = 1
    },
    
    // 设置排序方式
    setSortBy(sortBy: string) {
      this.sortBy = sortBy
      this.userPagination.page = 1
    },
    
    // 分页操作
    setPage(page: number) {
      this.userPagination.page = page
    },
    
    nextPage() {
      if (this.userPagination.hasNext) {
        this.userPagination.page++
      }
    },
    
    previousPage() {
      if (this.userPagination.hasPrev) {
        this.userPagination.page--
      }
    },
    
    // 关注用户
    async followUser(userId: string) {
      try {
        // 这里应该调用实际的关注API
        // const { followUser } = useUsers()
        // await followUser(userId)
        
        // 暂时只更新本地状态
        this.following.add(userId)
        
        // 更新用户的粉丝数量
        const user = this.users.find(u => u.id === userId)
        if (user) {
          user.stats.followersCount = (user.stats.followersCount || 0) + 1
        }
        
        // 如果是当前用户，也更新currentUser
        if (this.currentUser?.id === userId) {
          this.currentUser.stats.followersCount = (this.currentUser.stats.followersCount || 0) + 1
        }
      } catch (error) {
        console.error('Failed to follow user:', error)
        throw error
      }
    },
    
    // 取消关注用户
    async unfollowUser(userId: string) {
      try {
        // 这里应该调用实际的取消关注API
        // const { unfollowUser } = useUsers()
        // await unfollowUser(userId)
        
        // 暂时只更新本地状态
        this.following.delete(userId)
        
        // 更新用户的粉丝数量
        const user = this.users.find(u => u.id === userId)
        if (user) {
          user.stats.followersCount = Math.max(0, (user.stats.followersCount || 0) - 1)
        }
        
        // 如果是当前用户，也更新currentUser
        if (this.currentUser?.id === userId) {
          this.currentUser.stats.followersCount = Math.max(0, (this.currentUser.stats.followersCount || 0) - 1)
        }
      } catch (error) {
        console.error('Failed to unfollow user:', error)
        throw error
      }
    },
    
    // 关注操作（切换）
    toggleFollow(userId: string) {
      if (this.following.has(userId)) {
        this.following.delete(userId)
      } else {
        this.following.add(userId)
      }
      
      // 更新用户的粉丝数量
      const user = this.users.find(u => u.id === userId)
      if (user) {
        const isFollowing = this.following.has(userId)
        user.stats.followersCount += isFollowing ? 1 : -1
      }
      
      // 如果是当前用户，也更新currentUser
      if (this.currentUser?.id === userId) {
        const isFollowing = this.following.has(userId)
        this.currentUser.stats.followersCount += isFollowing ? 1 : -1
      }
    },
    
    // 重置状态
    resetUsers() {
      this.users = []
      this.userPagination = {
        page: 1,
        limit: 12,
        total: 0,
        pages: 0,
        hasNext: false,
        hasPrev: false
      }
      this.usersError = null
    },
    
    resetCurrentUser() {
      this.currentUser = null
      this.currentUserError = null
      this.userPosts = []
      this.userPostsError = null
    },
    
    resetFilters() {
      this.searchQuery = ''
      this.selectedRole = ''
      this.sortBy = 'createdAt'
      this.userPagination.page = 1
    }
  }
})