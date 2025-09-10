/**
 * 代码主题管理组合式函数
 * 用于管理代码高亮主题的切换和应用
 */

import { 
  codeThemes, 
  defaultTheme, 
  applyCodeTheme, 
  autoApplyCodeTheme,
  setupCodeThemeListener,
  type CodeTheme 
} from '~/utils/codeTheme'

export function useCodeTheme() {
  // 当前主题状态
  const currentTheme = ref('')
  const isDark = ref(false)
  
  // 可用主题列表
  const availableThemes = computed(() => Object.keys(codeThemes))
  
  // 获取主题信息
  const getTheme = (themeName: string): CodeTheme | null => {
    return codeThemes[themeName] || null
  }
  
  // 获取当前主题信息
  const getCurrentTheme = computed(() => {
    return getTheme(currentTheme.value)
  })
  
  // 检测系统主题
  const detectSystemTheme = () => {
    if (process.client) {
      const darkMode = document.documentElement.classList.contains('dark') ||
                      window.matchMedia('(prefers-color-scheme: dark)').matches
      isDark.value = darkMode
      return darkMode
    }
    return false
  }
  
  // 应用主题
  const applyTheme = (themeName: string, forceDark?: boolean) => {
    const darkMode = forceDark !== undefined ? forceDark : isDark.value
    
    if (!codeThemes[themeName]) {
      console.warn(`主题 "${themeName}" 不存在，使用默认主题`)
      themeName = darkMode ? defaultTheme.dark : defaultTheme.light
    }
    
    applyCodeTheme(themeName, darkMode)
    currentTheme.value = themeName
    
    // 保存到本地存储
    if (process.client) {
      localStorage.setItem('code-theme', themeName)
    }
  }
  
  // 切换到下一个主题
  const nextTheme = () => {
    const themes = availableThemes.value
    const currentIndex = themes.indexOf(currentTheme.value)
    const nextIndex = (currentIndex + 1) % themes.length
    const nextThemeName = themes[nextIndex]
    if (nextThemeName) {
      applyTheme(nextThemeName)
    }
  }
  
  // 切换到上一个主题
  const previousTheme = () => {
    const themes = availableThemes.value
    const currentIndex = themes.indexOf(currentTheme.value)
    const prevIndex = currentIndex <= 0 ? themes.length - 1 : currentIndex - 1
    const prevThemeName = themes[prevIndex]
    if (prevThemeName) {
      applyTheme(prevThemeName)
    }
  }
  
  // 重置为默认主题
  const resetToDefault = () => {
    const darkMode = detectSystemTheme()
    const defaultThemeName = darkMode ? defaultTheme.dark : defaultTheme.light
    applyTheme(defaultThemeName)
  }
  
  // 自动切换主题（根据系统主题）
  const autoApply = () => {
    autoApplyCodeTheme()
    const darkMode = detectSystemTheme()
    currentTheme.value = darkMode ? defaultTheme.dark : defaultTheme.light
  }
  
  // 获取主题预览CSS
  const getThemePreviewCSS = (themeName: string) => {
    const theme = getTheme(themeName)
    if (!theme) return ''
    
    return `
      background: ${theme.variables.codeBg};
      color: ${theme.variables.codeText};
      border: 1px solid ${theme.variables.codeBorder};
    `
  }
  
  // 监听系统主题变化
  const watchSystemTheme = () => {
    if (!process.client) return
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e: MediaQueryListEvent) => {
      isDark.value = e.matches
      // 如果用户没有手动设置主题，则自动切换
      const savedTheme = localStorage.getItem('code-theme')
      if (!savedTheme) {
        autoApply()
      }
    }
    
    mediaQuery.addEventListener('change', handleChange)
    
    // 返回清理函数
    return () => mediaQuery.removeEventListener('change', handleChange)
  }
  
  // 初始化主题
  const initialize = () => {
    if (!process.client) return
    
    // 设置主题监听器
    setupCodeThemeListener()
    
    // 检测当前主题
    detectSystemTheme()
    
    // 尝试从本地存储加载主题
    const savedTheme = localStorage.getItem('code-theme')
    if (savedTheme && codeThemes[savedTheme]) {
      applyTheme(savedTheme)
    } else {
      autoApply()
    }
    
    // 监听系统主题变化
    watchSystemTheme()
  }
  
  // 页面挂载时初始化
  onMounted(() => {
    initialize()
  })
  
  return {
    // 状态
    currentTheme: readonly(currentTheme),
    isDark: readonly(isDark),
    availableThemes,
    getCurrentTheme,
    
    // 方法
    applyTheme,
    nextTheme,
    previousTheme,
    resetToDefault,
    autoApply,
    getTheme,
    getThemePreviewCSS,
    detectSystemTheme,
    
    // 工具
    initialize
  }
}

/**
 * 为特定组件提供代码主题功能
 */
export function useCodeThemeForComponent() {
  const { 
    currentTheme, 
    isDark, 
    availableThemes, 
    applyTheme, 
    getTheme,
    getThemePreviewCSS 
  } = useCodeTheme()
  
  // 生成主题选择器选项
  const themeOptions = computed(() => {
    return availableThemes.value.map(themeName => {
      const theme = getTheme(themeName)
      return {
        value: themeName,
        label: theme?.name || themeName,
        preview: getThemePreviewCSS(themeName)
      }
    })
  })
  
  // 主题变化处理
  const handleThemeChange = (themeName: string) => {
    applyTheme(themeName)
  }
  
  return {
    currentTheme,
    isDark,
    themeOptions,
    handleThemeChange,
    getThemePreviewCSS
  }
}
