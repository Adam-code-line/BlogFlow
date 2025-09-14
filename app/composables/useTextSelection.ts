/**
 * 文本选择管理 Composable
 * 提供丝滑的文本选择体验
 */

export function useTextSelection() {
  // 清除所有文本选择
  const clearSelection = () => {
    if (typeof window !== 'undefined') {
      const selection = window.getSelection()
      if (selection) {
        selection.removeAllRanges()
      }
    }
  }

  // 检查是否有文本被选中
  const hasSelection = (): boolean => {
    if (typeof window !== 'undefined') {
      const selection = window.getSelection()
      return selection ? selection.toString().length > 0 : false
    }
    return false
  }

  // 检查点击的元素是否在文章内容区域
  const isContentArea = (element: Element): boolean => {
    return element.closest('.post-detail, .blog-content, article, .prose') !== null
  }

  // 检查点击的元素是否是可交互元素
  const isInteractiveElement = (element: Element): boolean => {
    const interactiveTags = ['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT', 'LABEL']
    const interactiveRoles = ['button', 'link', 'menuitem', 'tab']
    
    return (
      interactiveTags.includes(element.tagName) ||
      interactiveRoles.includes(element.getAttribute('role') || '') ||
      element.hasAttribute('onclick') ||
      element.hasAttribute('href') ||
      element.classList.contains('cursor-pointer') ||
      element.closest('button, a, [role="button"], [onclick]') !== null
    )
  }

  // 设置智能文本选择行为
  const setupSmartSelection = () => {
    if (typeof window === 'undefined') return

    // 点击外部区域时清除选择
    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target) return

      // 如果点击的是交互元素，清除选择
      if (isInteractiveElement(target)) {
        clearSelection()
        return
      }

      // 如果点击的不是内容区域，清除选择
      if (!isContentArea(target)) {
        clearSelection()
      }
    }

    // 键盘事件处理
    const handleKeydown = (event: KeyboardEvent) => {
      // Escape 键清除选择
      if (event.key === 'Escape') {
        clearSelection()
      }
    }

    // 滚动时如果有选择且不在视口中，清除选择
    const handleScroll = () => {
      if (!hasSelection()) return

      const selection = window.getSelection()
      if (!selection || selection.rangeCount === 0) return

      const range = selection.getRangeAt(0)
      const rect = range.getBoundingClientRect()
      
      // 如果选择区域不在视口中，清除选择
      if (rect.bottom < 0 || rect.top > window.innerHeight) {
        clearSelection()
      }
    }

    // 添加事件监听器
    document.addEventListener('click', handleDocumentClick, { passive: true })
    document.addEventListener('keydown', handleKeydown, { passive: true })
    
    // 节流的滚动处理
    let scrollTimer: NodeJS.Timeout | null = null
    const throttledScrollHandler = () => {
      if (scrollTimer) clearTimeout(scrollTimer)
      scrollTimer = setTimeout(handleScroll, 100)
    }
    
    document.addEventListener('scroll', throttledScrollHandler, { passive: true })

    // 返回清理函数
    return () => {
      document.removeEventListener('click', handleDocumentClick)
      document.removeEventListener('keydown', handleKeydown)
      document.removeEventListener('scroll', throttledScrollHandler)
      if (scrollTimer) clearTimeout(scrollTimer)
    }
  }

  return {
    clearSelection,
    hasSelection,
    isContentArea,
    isInteractiveElement,
    setupSmartSelection
  }
}

/**
 * 在客户端自动设置智能文本选择
 */
export function useAutoTextSelection() {
  if (process.client) {
    const { setupSmartSelection } = useTextSelection()
    
    onMounted(() => {
      const cleanup = setupSmartSelection()
      
      onUnmounted(() => {
        cleanup?.()
      })
    })
  }
}