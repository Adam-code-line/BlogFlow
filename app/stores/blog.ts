import { defineStore } from 'pinia'
import type { ContentPost } from '~/types'
import { useBlogPosts } from '~/composables/useContent'

interface BlogState {
  // 文章列表
  posts: ContentPost[]
  featuredPosts: ContentPost[]
  postsLoading: boolean
  postsError: string | null
  
  // 当前文章
  currentPost: ContentPost | null
  currentPostLoading: boolean
  currentPostError: string | null
  
  // 分类和标签
  categories: string[]
  tags: string[]
  
  // 搜索和筛选
  searchQuery: string
  selectedCategory: string
  selectedTag: string
  sortBy: string
  
  // 分页
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export const useBlogStore = defineStore('blog', {
  state: (): BlogState => ({
    // 文章列表
    posts: [],
    featuredPosts: [],
    postsLoading: false,
    postsError: null,
    
    // 当前文章
    currentPost: null,
    currentPostLoading: false,
    currentPostError: null,
    
    // 分类和标签
    categories: [],
    tags: [],
    
    // 搜索和筛选
    searchQuery: '',
    selectedCategory: '',
    selectedTag: '',
    sortBy: 'publishedAt',
    
    // 分页
    pagination: {
      page: 1,
      limit: 12,
      total: 0,
      pages: 0,
      hasNext: false,
      hasPrev: false
    }
  }),

  getters: {
    // 获取过滤后的文章列表
    filteredPosts: (state) => {
      let filtered = [...state.posts]
      
      // 搜索过滤
      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase()
        filtered = filtered.filter(post => 
          post.title?.toLowerCase().includes(query) ||
          post.description?.toLowerCase().includes(query) ||
          post.content?.toLowerCase().includes(query)
        )
      }
      
      // 分类过滤
      if (state.selectedCategory) {
        filtered = filtered.filter(post => post.category === state.selectedCategory)
      }
      
      // 标签过滤
      if (state.selectedTag) {
        filtered = filtered.filter(post => 
          post.tags?.includes(state.selectedTag)
        )
      }
      
      // 排序
      filtered.sort((a, b) => {
        switch (state.sortBy) {
          case 'title':
            return (a.title || '').localeCompare(b.title || '')
          case 'publishedAt':
            return new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime()
          case 'readingTime':
            return (a.readingTime || 0) - (b.readingTime || 0)
          default:
            return 0
        }
      })
      
      return filtered
    },
    
    // 分页后的文章
    paginatedPosts(): ContentPost[] {
      const start = (this.pagination.page - 1) * this.pagination.limit
      const end = start + this.pagination.limit
      return this.filteredPosts.slice(start, end)
    },
    
    // 获取指定分类的文章
    getPostsByCategory: (state) => (category: string) => {
      return state.posts.filter(post => post.category === category)
    },
    
    // 获取指定标签的文章
    getPostsByTag: (state) => (tag: string) => {
      return state.posts.filter(post => post.tags?.includes(tag))
    },
    
    // 获取相关文章
    getRelatedPosts: (state) => (currentPost: ContentPost, limit = 3) => {
      return state.posts
        .filter(post => 
          post.path !== currentPost.path && 
          (post.category === currentPost.category || 
           post.tags?.some(tag => currentPost.tags?.includes(tag)))
        )
        .slice(0, limit)
    }
  },

  actions: {
    // 获取所有文章
    async fetchAllPosts() {
      this.postsLoading = true
      this.postsError = null
      
      try {
        const blogAPI = useBlogPosts()
        const posts = await blogAPI.getAllPosts()
        this.posts = posts
        
        // 更新分类和标签
        this.updateCategoriesAndTags()
        
        // 更新分页信息
        this.updatePagination()
      } catch (error) {
        this.postsError = '获取文章列表失败'
        console.error('Failed to fetch posts:', error)
      } finally {
        this.postsLoading = false
      }
    },
    
    // 获取精选文章
    async fetchFeaturedPosts(limit = 3) {
      try {
        const blogAPI = useBlogPosts()
        const posts = await blogAPI.getFeaturedPosts(limit)
        this.featuredPosts = posts
      } catch (error) {
        console.error('Failed to fetch featured posts:', error)
      }
    },
    
    // 根据slug获取文章
    async fetchPostBySlug(slug: string) {
      this.currentPostLoading = true
      this.currentPostError = null
      
      try {
        const blogAPI = useBlogPosts()
        const post = await blogAPI.getPostBySlug(slug)
        this.currentPost = post
      } catch (error) {
        this.currentPostError = '获取文章详情失败'
        console.error('Failed to fetch post:', error)
      } finally {
        this.currentPostLoading = false
      }
    },
    
    // 搜索文章
    async searchPosts(query: string) {
      this.searchQuery = query
      this.pagination.page = 1
      this.updatePagination()
    },
    
    // 设置分类筛选
    setCategoryFilter(category: string) {
      this.selectedCategory = category
      this.pagination.page = 1
      this.updatePagination()
    },
    
    // 设置标签筛选
    setTagFilter(tag: string) {
      this.selectedTag = tag
      this.pagination.page = 1
      this.updatePagination()
    },
    
    // 设置排序方式
    setSortBy(sortBy: string) {
      this.sortBy = sortBy
      this.pagination.page = 1
    },
    
    // 更新分类和标签列表
    updateCategoriesAndTags() {
      const categories = new Set<string>()
      const tags = new Set<string>()
      
      this.posts.forEach(post => {
        if (post.category) {
          categories.add(post.category)
        }
        if (post.tags) {
          post.tags.forEach(tag => tags.add(tag))
        }
      })
      
      this.categories = Array.from(categories).sort()
      this.tags = Array.from(tags).sort()
    },
    
    // 更新分页信息
    updatePagination() {
      const total = this.filteredPosts.length
      const pages = Math.ceil(total / this.pagination.limit)
      
      this.pagination = {
        ...this.pagination,
        total,
        pages,
        hasNext: this.pagination.page < pages,
        hasPrev: this.pagination.page > 1
      }
    },
    
    // 分页操作
    setPage(page: number) {
      this.pagination.page = page
    },
    
    nextPage() {
      if (this.pagination.hasNext) {
        this.pagination.page++
      }
    },
    
    previousPage() {
      if (this.pagination.hasPrev) {
        this.pagination.page--
      }
    },
    
    // 重置筛选条件
    resetFilters() {
      this.searchQuery = ''
      this.selectedCategory = ''
      this.selectedTag = ''
      this.sortBy = 'publishedAt'
      this.pagination.page = 1
      this.updatePagination()
    },
    
    // 重置状态
    resetPosts() {
      this.posts = []
      this.featuredPosts = []
      this.postsError = null
      this.resetFilters()
    },
    
    resetCurrentPost() {
      this.currentPost = null
      this.currentPostError = null
    }
  }
})