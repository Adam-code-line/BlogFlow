import { defineStore } from 'pinia'

interface UIState {
  // 主题和外观
  theme: 'light' | 'dark' | 'auto'
  sidebarOpen: boolean
  
  // 加载状态
  globalLoading: boolean
  loadingText: string
  
  // 通知系统
  notifications: Notification[]
  
  // 模态框和弹窗
  modalOpen: boolean
  currentModal: string | null
  
  // 搜索状态
  searchOpen: boolean
  searchQuery: string
  searchHistory: string[]
  
  // 移动端适配
  isMobile: boolean
  menuOpen: boolean
  
  // 页面滚动
  scrollY: number
  showBackToTop: boolean
  
  // 错误处理
  errorMessage: string | null
  errorVisible: boolean
}

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  persistent?: boolean
  createdAt: Date
}

export const useUIStore = defineStore('ui', {
  state: (): UIState => ({
    // 主题和外观
    theme: 'auto',
    sidebarOpen: true,
    
    // 加载状态
    globalLoading: false,
    loadingText: '',
    
    // 通知系统
    notifications: [],
    
    // 模态框和弹窗
    modalOpen: false,
    currentModal: null,
    
    // 搜索状态
    searchOpen: false,
    searchQuery: '',
    searchHistory: [],
    
    // 移动端适配
    isMobile: false,
    menuOpen: false,
    
    // 页面滚动
    scrollY: 0,
    showBackToTop: false,
    
    // 错误处理
    errorMessage: null,
    errorVisible: false
  }),

  getters: {
    // 获取当前主题
    currentTheme: (state) => {
      if (state.theme === 'auto') {
        // 自动检测系统主题
        if (process.client) {
          return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        }
        return 'light'
      }
      return state.theme
    },
    
    // 获取未读通知数量
    unreadNotifications: (state) => {
      return state.notifications.length
    },
    
    // 获取最新通知
    latestNotifications: (state) => (limit = 5) => {
      return state.notifications
        .slice(0, limit)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    },
    
    // 判断是否显示加载状态
    isLoading: (state) => state.globalLoading,
    
    // 获取当前活跃的模态框
    activeModal: (state) => state.currentModal,
    
    // 检查是否为移动端视图
    isMobileView: (state) => state.isMobile,
    
    // 检查是否显示返回顶部按钮
    shouldShowBackToTop: (state) => state.showBackToTop
  },

  actions: {
    // 主题管理
    setTheme(theme: 'light' | 'dark' | 'auto') {
      this.theme = theme
      this.applyTheme()
      this.saveThemePreference()
    },
    
    toggleTheme() {
      const themes: Array<'light' | 'dark' | 'auto'> = ['light', 'dark', 'auto']
      const currentIndex = themes.indexOf(this.theme)
      const nextIndex = (currentIndex + 1) % themes.length
      const nextTheme = themes[nextIndex] || 'light'
      this.setTheme(nextTheme)
    },
    
    applyTheme() {
      if (process.client) {
        const theme = this.currentTheme
        document.documentElement.classList.toggle('dark', theme === 'dark')
        document.documentElement.setAttribute('data-theme', theme)
      }
    },
    
    saveThemePreference() {
      if (process.client) {
        localStorage.setItem('blog-theme', this.theme)
      }
    },
    
    loadThemePreference() {
      if (process.client) {
        const saved = localStorage.getItem('blog-theme') as 'light' | 'dark' | 'auto'
        if (saved) {
          this.theme = saved
          this.applyTheme()
        }
      }
    },
    
    // 侧边栏管理
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
    },
    
    setSidebarOpen(open: boolean) {
      this.sidebarOpen = open
    },
    
    // 加载状态管理
    setGlobalLoading(loading: boolean, text = '') {
      this.globalLoading = loading
      this.loadingText = text
    },
    
    startLoading(text = '加载中...') {
      this.setGlobalLoading(true, text)
    },
    
    stopLoading() {
      this.setGlobalLoading(false, '')
    },
    
    // 通知系统
    addNotification(notification: Omit<Notification, 'id' | 'createdAt'>) {
      const id = Date.now().toString()
      const newNotification: Notification = {
        ...notification,
        id,
        createdAt: new Date(),
        duration: notification.duration || 5000
      }
      
      this.notifications.unshift(newNotification)
      
      // 自动移除非持久化通知
      if (!notification.persistent && notification.duration) {
        setTimeout(() => {
          this.removeNotification(id)
        }, notification.duration)
      }
    },
    
    removeNotification(id: string) {
      const index = this.notifications.findIndex(n => n.id === id)
      if (index > -1) {
        this.notifications.splice(index, 1)
      }
    },
    
    clearAllNotifications() {
      this.notifications = []
    },
    
    // 便捷通知方法
    showSuccess(title: string, message: string, duration?: number) {
      this.addNotification({ type: 'success', title, message, duration })
    },
    
    showError(title: string, message: string, persistent = false) {
      this.addNotification({ type: 'error', title, message, persistent })
    },
    
    showWarning(title: string, message: string, duration?: number) {
      this.addNotification({ type: 'warning', title, message, duration })
    },
    
    showInfo(title: string, message: string, duration?: number) {
      this.addNotification({ type: 'info', title, message, duration })
    },
    
    // 模态框管理
    openModal(modalName: string) {
      this.currentModal = modalName
      this.modalOpen = true
    },
    
    closeModal() {
      this.currentModal = null
      this.modalOpen = false
    },
    
    // 搜索状态管理
    openSearch() {
      this.searchOpen = true
    },
    
    closeSearch() {
      this.searchOpen = false
      this.searchQuery = ''
    },
    
    setSearchQuery(query: string) {
      this.searchQuery = query
    },
    
    addToSearchHistory(query: string) {
      if (query && !this.searchHistory.includes(query)) {
        this.searchHistory.unshift(query)
        // 保持历史记录在10条以内
        if (this.searchHistory.length > 10) {
          this.searchHistory = this.searchHistory.slice(0, 10)
        }
        this.saveSearchHistory()
      }
    },
    
    clearSearchHistory() {
      this.searchHistory = []
      this.saveSearchHistory()
    },
    
    saveSearchHistory() {
      if (process.client) {
        localStorage.setItem('blog-search-history', JSON.stringify(this.searchHistory))
      }
    },
    
    loadSearchHistory() {
      if (process.client) {
        const saved = localStorage.getItem('blog-search-history')
        if (saved) {
          this.searchHistory = JSON.parse(saved)
        }
      }
    },
    
    // 移动端适配
    setMobile(isMobile: boolean) {
      this.isMobile = isMobile
      // 移动端自动关闭侧边栏
      if (isMobile) {
        this.sidebarOpen = false
      }
    },
    
    toggleMobileMenu() {
      this.menuOpen = !this.menuOpen
    },
    
    closeMobileMenu() {
      this.menuOpen = false
    },
    
    // 滚动管理
    updateScrollY(y: number) {
      this.scrollY = y
      this.showBackToTop = y > 300
    },
    
    scrollToTop() {
      if (process.client) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
      }
    },
    
    // 错误处理
    setError(message: string) {
      this.errorMessage = message
      this.errorVisible = true
    },
    
    clearError() {
      this.errorMessage = null
      this.errorVisible = false
    },
    
    // 初始化
    async init() {
      if (process.client) {
        // 加载主题偏好
        this.loadThemePreference()
        
        // 加载搜索历史
        this.loadSearchHistory()
        
        // 检测移动端
        this.setMobile(window.innerWidth < 768)
        
        // 监听窗口大小变化
        window.addEventListener('resize', () => {
          this.setMobile(window.innerWidth < 768)
        })
        
        // 监听滚动
        window.addEventListener('scroll', () => {
          this.updateScrollY(window.scrollY)
        })
        
        // 监听系统主题变化
        if (window.matchMedia) {
          window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            if (this.theme === 'auto') {
              this.applyTheme()
            }
          })
        }
      }
    }
  }
})

// 导出通知类型供外部使用
export type { Notification }