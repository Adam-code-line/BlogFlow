/**
 * 代码高亮主题配置
 * 可以轻松切换不同的主题风格
 */

export interface CodeTheme {
  name: string
  variables: {
    // 代码块背景和边框
    codeBg: string
    codeBorder: string
    codeText: string
    
    // 语法高亮颜色
    codeComment: string
    codeKeyword: string
    codeString: string
    codeNumber: string
    codeFunction: string
    codeOperator: string
    
    // 行内代码
    inlineCodeBg: string
    inlineCodeText: string
    inlineCodeBorder: string
    
    // UI 元素
    langLabelBg: string
    langLabelText: string
    langLabelBorder: string
    copyBtnBg: string
    copyBtnBgHover: string
    copyBtnText: string
    copyBtnTextHover: string
    copyBtnBorder: string
    copyBtnShadow: string
    
    // 滚动条
    scrollbarTrack: string
    scrollbarThumb: string
    scrollbarThumbHover: string
  }
}

// 预定义主题
export const codeThemes: Record<string, CodeTheme> = {
  // GitHub 风格主题
  github: {
    name: 'GitHub',
    variables: {
      codeBg: '#f6f8fa',
      codeBorder: '#d0d7de',
      codeText: '#24292f',
      codeComment: '#6e7781',
      codeKeyword: '#cf222e',
      codeString: '#0a3069',
      codeNumber: '#0550ae',
      codeFunction: '#8250df',
      codeOperator: '#24292f',
      inlineCodeBg: '#f3f4f6',
      inlineCodeText: '#cf222e',
      inlineCodeBorder: '#d0d7de',
      langLabelBg: '#f3f4f6',
      langLabelText: '#656d76',
      langLabelBorder: '#d0d7de',
      copyBtnBg: 'rgba(255, 255, 255, 0.9)',
      copyBtnBgHover: 'rgba(255, 255, 255, 1)',
      copyBtnText: '#656d76',
      copyBtnTextHover: '#24292f',
      copyBtnBorder: '#d0d7de',
      copyBtnShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      scrollbarTrack: 'transparent',
      scrollbarThumb: '#d0d7de',
      scrollbarThumbHover: '#afb8c1'
    }
  },

  // VS Code 风格主题
  vscode: {
    name: 'VS Code',
    variables: {
      codeBg: '#1e1e1e',
      codeBorder: '#333333',
      codeText: '#d4d4d4',
      codeComment: '#6a9955',
      codeKeyword: '#569cd6',
      codeString: '#ce9178',
      codeNumber: '#b5cea8',
      codeFunction: '#dcdcaa',
      codeOperator: '#d4d4d4',
      inlineCodeBg: '#2d2d30',
      inlineCodeText: '#ce9178',
      inlineCodeBorder: '#333333',
      langLabelBg: '#2d2d30',
      langLabelText: '#cccccc',
      langLabelBorder: '#333333',
      copyBtnBg: 'rgba(45, 45, 48, 0.9)',
      copyBtnBgHover: 'rgba(45, 45, 48, 1)',
      copyBtnText: '#cccccc',
      copyBtnTextHover: '#ffffff',
      copyBtnBorder: '#333333',
      copyBtnShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
      scrollbarTrack: 'transparent',
      scrollbarThumb: '#424242',
      scrollbarThumbHover: '#4f4f4f'
    }
  },

  // 高对比度主题
  highContrast: {
    name: 'High Contrast',
    variables: {
      codeBg: '#000000',
      codeBorder: '#ffffff',
      codeText: '#ffffff',
      codeComment: '#7ca668',
      codeKeyword: '#569cd6',
      codeString: '#ce9178',
      codeNumber: '#b5cea8',
      codeFunction: '#dcdcaa',
      codeOperator: '#ffffff',
      inlineCodeBg: '#1a1a1a',
      inlineCodeText: '#ffff00',
      inlineCodeBorder: '#ffffff',
      langLabelBg: '#1a1a1a',
      langLabelText: '#ffffff',
      langLabelBorder: '#ffffff',
      copyBtnBg: 'rgba(26, 26, 26, 0.9)',
      copyBtnBgHover: 'rgba(26, 26, 26, 1)',
      copyBtnText: '#ffffff',
      copyBtnTextHover: '#ffff00',
      copyBtnBorder: '#ffffff',
      copyBtnShadow: '0 1px 3px rgba(255, 255, 255, 0.3)',
      scrollbarTrack: 'transparent',
      scrollbarThumb: '#ffffff',
      scrollbarThumbHover: '#cccccc'
    }
  },

  // Solarized Light 主题
  solarizedLight: {
    name: 'Solarized Light',
    variables: {
      codeBg: '#fdf6e3',
      codeBorder: '#eee8d5',
      codeText: '#657b83',
      codeComment: '#93a1a1',
      codeKeyword: '#859900',
      codeString: '#2aa198',
      codeNumber: '#d33682',
      codeFunction: '#268bd2',
      codeOperator: '#657b83',
      inlineCodeBg: '#eee8d5',
      inlineCodeText: '#d33682',
      inlineCodeBorder: '#ddd6c1',
      langLabelBg: '#eee8d5',
      langLabelText: '#586e75',
      langLabelBorder: '#ddd6c1',
      copyBtnBg: 'rgba(253, 246, 227, 0.9)',
      copyBtnBgHover: 'rgba(253, 246, 227, 1)',
      copyBtnText: '#586e75',
      copyBtnTextHover: '#073642',
      copyBtnBorder: '#eee8d5',
      copyBtnShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      scrollbarTrack: 'transparent',
      scrollbarThumb: '#eee8d5',
      scrollbarThumbHover: '#ddd6c1'
    }
  },

  // Nord 主题
  nord: {
    name: 'Nord',
    variables: {
      codeBg: '#2e3440',
      codeBorder: '#3b4252',
      codeText: '#eceff4',
      codeComment: '#616e88',
      codeKeyword: '#81a1c1',
      codeString: '#a3be8c',
      codeNumber: '#b48ead',
      codeFunction: '#88c0d0',
      codeOperator: '#eceff4',
      inlineCodeBg: '#3b4252',
      inlineCodeText: '#d08770',
      inlineCodeBorder: '#434c5e',
      langLabelBg: '#3b4252',
      langLabelText: '#d8dee9',
      langLabelBorder: '#434c5e',
      copyBtnBg: 'rgba(59, 66, 82, 0.9)',
      copyBtnBgHover: 'rgba(59, 66, 82, 1)',
      copyBtnText: '#d8dee9',
      copyBtnTextHover: '#eceff4',
      copyBtnBorder: '#434c5e',
      copyBtnShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
      scrollbarTrack: 'transparent',
      scrollbarThumb: '#434c5e',
      scrollbarThumbHover: '#4c566a'
    }
  }
}

// 默认主题配置
export const defaultTheme = {
  light: 'github',
  dark: 'vscode'
} as const

// 应用主题的函数
export function applyCodeTheme(themeName: string, isDark = false) {
  const theme = codeThemes[themeName]
  if (!theme) {
    console.warn(`Code theme "${themeName}" not found`)
    return
  }

  const root = document.documentElement
  const prefix = isDark ? '--dark' : '--'
  
  Object.entries(theme.variables).forEach(([key, value]) => {
    const cssVarName = `${prefix}code-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`
    root.style.setProperty(cssVarName, value)
  })
}

// 根据系统主题自动切换
export function autoApplyCodeTheme() {
  const isDark = document.documentElement.classList.contains('dark')
  const themeName = isDark ? defaultTheme.dark : defaultTheme.light
  applyCodeTheme(themeName, isDark)
}

// 监听主题变化
export function setupCodeThemeListener() {
  if (typeof window === 'undefined') return

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        autoApplyCodeTheme()
      }
    })
  })

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  })

  // 初始应用主题
  autoApplyCodeTheme()
}
