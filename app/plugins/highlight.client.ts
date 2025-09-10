/**
 * 代码高亮插件
 * 为博客文章中的代码块提供语法高亮功能
 * 使用 Nuxt Content 内置的代码高亮功能
 */

import { setupCodeThemeListener } from '~/utils/codeTheme'

// 全局类型扩展
declare global {
  interface Window {
    $codeHighlight: CodeHighlight
  }
}

class CodeHighlight {
  private isInitialized: boolean = false

  /**
   * 初始化代码高亮增强功能
   */
  async init() {
    if (this.isInitialized) return

    try {
      this.isInitialized = true
      
      // 设置主题监听器
      if (process.client) {
        setupCodeThemeListener()
      }
      
      console.log('Code highlighting enhancements initialized')
    } catch (error) {
      console.error('Failed to initialize code highlighting:', error)
    }
  }

  /**
   * 为所有代码块添加增强功能
   */
  async enhanceCodeBlocks() {
    if (!this.isInitialized) {
      await this.init()
    }

    try {
      // 查找所有代码块 (Nuxt Content 生成的结构)
      const codeBlocks = document.querySelectorAll('pre code, .prose pre')
      
      console.log(`Found ${codeBlocks.length} code blocks to enhance`)
      
      codeBlocks.forEach((block) => {
        if (block instanceof HTMLElement) {
          const pre = block.tagName === 'PRE' ? block : block.closest('pre')
          if (pre && !pre.querySelector('.copy-button')) {
            this.addCopyButton(pre as HTMLElement)
          }
        }
      })
    } catch (error) {
      console.error('Failed to enhance code blocks:', error)
    }
  }

  /**
   * 为代码块添加复制按钮
   */
  private addCopyButton(pre: HTMLElement) {
    // 查找代码内容
    const codeElement = pre.querySelector('code') || pre
    
    // 创建按钮容器
    const buttonContainer = document.createElement('div')
    buttonContainer.className = 'code-header'
    
    // 创建复制按钮
    const copyButton = document.createElement('button')
    copyButton.className = 'copy-button'
    copyButton.innerHTML = `
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
      <span>复制</span>
    `

    // 复制功能
    copyButton.addEventListener('click', async () => {
      try {
        const code = codeElement.textContent || ''
        await navigator.clipboard.writeText(code)
        
        // 更新按钮状态
        const originalHTML = copyButton.innerHTML
        copyButton.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20,6 9,17 4,12"></polyline>
          </svg>
          <span>已复制</span>
        `
        copyButton.classList.add('success')
        
        // 2秒后恢复
        setTimeout(() => {
          copyButton.innerHTML = originalHTML
          copyButton.classList.remove('success')
        }, 2000)
        
        // 追踪复制事件
        if (window.$analytics) {
          window.$analytics.trackEvent({
            action: 'copy_code',
            category: 'code_interaction',
            label: 'code_block_copy'
          })
        }
      } catch (error) {
        console.error('Failed to copy code:', error)
        // 降级方案：选中文本
        const selection = window.getSelection()
        const range = document.createRange()
        range.selectNodeContents(codeElement)
        selection?.removeAllRanges()
        selection?.addRange(range)
      }
    })

    buttonContainer.appendChild(copyButton)
    
    // 确保 pre 元素有相对定位
    pre.style.position = 'relative'
    pre.appendChild(buttonContainer)
  }

  /**
   * 添加代码块标题
   */
  addCodeTitles() {
    const codeBlocks = document.querySelectorAll('pre[class*="language-"]')
    
    codeBlocks.forEach((pre) => {
      if (pre instanceof HTMLElement) {
        // 从类名中提取语言
        const classNames = pre.className.split(' ')
        const langClass = classNames.find(cls => cls.startsWith('language-'))
        
        if (langClass) {
          const language = langClass.replace('language-', '')
          this.addLanguageLabel(pre, language)
        }
      }
    })
  }

  /**
   * 添加语言标签
   */
  private addLanguageLabel(pre: HTMLElement, language: string) {
    // 检查是否已经有标签
    if (pre.querySelector('.language-label')) return

    const label = document.createElement('div')
    label.className = 'language-label'
    label.textContent = this.getLanguageDisplayName(language)

    // 确保 pre 元素有正确的定位
    pre.style.position = 'relative'
    pre.appendChild(label)
  }

  /**
   * 获取语言显示名称
   */
  private getLanguageDisplayName(language: string): string {
    const displayNames: Record<string, string> = {
      'js': 'JavaScript',
      'javascript': 'JavaScript',
      'ts': 'TypeScript',
      'typescript': 'TypeScript',
      'vue': 'Vue',
      'html': 'HTML',
      'css': 'CSS',
      'scss': 'SCSS',
      'json': 'JSON',
      'md': 'Markdown',
      'markdown': 'Markdown',
      'bash': 'Bash',
      'shell': 'Shell',
      'python': 'Python',
      'py': 'Python',
      'java': 'Java',
      'go': 'Go',
      'rust': 'Rust',
      'php': 'PHP',
      'sql': 'SQL',
      'yaml': 'YAML',
      'yml': 'YAML',
      'xml': 'XML',
      'dockerfile': 'Docker'
    }

    return displayNames[language.toLowerCase()] || language.toUpperCase()
  }

  /**
   * 优化代码块样式
   */
  optimizeCodeStyles() {
    // CSS 样式已经通过 CSS 文件加载，这里只做一些动态调整
    const style = document.createElement('style')
    style.textContent = `
      /* 动态样式调整 */
      .prose pre {
        font-feature-settings: "liga" 1, "calt" 1;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      
      /* 确保代码块在加载时有基础样式 */
      .prose pre:not([class*="language-"]) {
        background: var(--code-bg) !important;
        color: var(--code-text) !important;
      }
    `
    document.head.appendChild(style)
  }
}

export default defineNuxtPlugin(() => {
  // 创建代码高亮实例
  const codeHighlight = new CodeHighlight()

  // 在客户端初始化
  if (process.client) {
    // 页面加载完成后增强代码块
    onMounted(async () => {
      await nextTick()
      codeHighlight.optimizeCodeStyles()
      await codeHighlight.enhanceCodeBlocks()
      codeHighlight.addCodeTitles()
    })

    // 路由变化时重新增强
    const router = useRouter()
    router.afterEach(async () => {
      await nextTick()
      await codeHighlight.enhanceCodeBlocks()
      codeHighlight.addCodeTitles()
    })

    // 挂载到全局
    window.$codeHighlight = codeHighlight
  }

  // 提供给组合式函数使用
  return {
    provide: {
      codeHighlight
    }
  }
})
