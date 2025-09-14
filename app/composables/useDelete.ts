/**
 * 删除操作的通用 Composable
 * 提供统一的删除确认和执行流程
 */

import { deletePostAction } from './usePostActions'

export interface DeleteTarget {
  item: any
  index?: number
  type: 'post' | 'category' | 'tag' | 'user' | string
}

export interface UseDeleteOptions {
  onSuccess?: (item: any, itemName?: string) => void
  onError?: (error: Error, item: any) => void
  onRefresh?: () => Promise<void>
  showToast?: boolean
}

/**
 * 删除操作 Composable
 */
export const useDelete = (options: UseDeleteOptions = {}) => {
  // 响应式状态
  const deleteTarget = ref<DeleteTarget | null>(null)
  const deleteDialogOpen = ref(false)
  const deleting = ref(false)

  /**
   * 打开删除确认对话框
   */
  const confirmDelete = (item: any, type: string = 'post', index?: number) => {
    // 增加防御性检查
    if (!item) {
      console.warn('confirmDelete: item参数为空，忽略删除操作')
      return
    }
    
    console.log('confirmDelete: 准备删除', { item, type, index })
    deleteTarget.value = { item, index, type }
    deleteDialogOpen.value = true
  }

  /**
   * 取消删除操作
   */
  const cancelDelete = () => {
    console.log('cancelDelete: 取消删除操作')
    deleteTarget.value = null
    deleteDialogOpen.value = false
  }

  /**
   * 强制重置所有状态（调试用）
   */
  const forceReset = () => {
    console.log('forceReset: 强制重置删除状态')
    deleteTarget.value = null
    deleteDialogOpen.value = false
    deleting.value = false
  }

  /**
   * 执行删除操作
   */
  const executeDelete = async (item: any) => {
    if (!item) return

    deleting.value = true

    try {
      // 根据类型调用不同的删除方法
      await deleteByType(item, deleteTarget.value?.type || 'post')

      // 显示成功消息
      if (options.showToast !== false) {
        // 简单的成功回调，由调用方处理UI
        if (options.onSuccess) {
          const itemName = item.title || item.name || item.label || '项目'
          options.onSuccess(item, itemName)
        }
      }

      // 执行成功回调
      if (options.onSuccess) {
        options.onSuccess(item)
      }

      // 刷新数据
      if (options.onRefresh) {
        await options.onRefresh()
      }

    } catch (error) {
      console.error('删除失败:', error)

      // 显示错误消息
      if (options.showToast !== false) {
        const { useUIStore } = await import('~/stores/ui')
        const uiStore = useUIStore()
        uiStore.showError('删除失败', error instanceof Error ? error.message : '删除时发生未知错误')
      }

      // 执行错误回调
      if (options.onError) {
        options.onError(error as Error, item)
      }

      throw error
    } finally {
      deleting.value = false
    }
  }

  /**
   * 根据类型删除项目
   */
  const deleteByType = async (item: any, type: string) => {
    switch (type) {
      case 'post':
        return await deletePost(item)
      case 'category':
        return await deleteCategory(item)
      case 'tag':
        return await deleteTag(item)
      case 'user':
        return await deleteUser(item)
      default:
        throw new Error(`不支持的删除类型: ${type}`)
    }
  }

  /**
   * 删除文章
   */
  const deletePost = async (post: any) => {
    // 获取文章ID - 优先使用id，然后是path，最后是title
    let postId = ''
    if (post.id) {
      postId = post.id
    } else if (post.path) {
      // 从path提取slug作为id
      postId = post.path.split('/').pop() || post.title || 'unknown'
    } else {
      postId = post.title || 'unknown'
    }

    console.log('删除文章，ID:', postId, '文章:', post)
    await deletePostAction(postId)
  }

  /**
   * 删除分类（占位符，后续实现）
   */
  const deleteCategory = async (category: any) => {
    // TODO: 实现分类删除逻辑
    throw new Error('分类删除功能尚未实现')
  }

  /**
   * 删除标签（占位符，后续实现）
   */
  const deleteTag = async (tag: any) => {
    // TODO: 实现标签删除逻辑
    throw new Error('标签删除功能尚未实现')
  }

  /**
   * 删除用户（占位符，后续实现）
   */
  const deleteUser = async (user: any) => {
    // TODO: 实现用户删除逻辑
    throw new Error('用户删除功能尚未实现')
  }

  /**
   * 获取成功消息
   */
  const getSuccessMessage = (item: any, type: string): string => {
    const typeNames = {
      post: '文章',
      category: '分类',
      tag: '标签',
      user: '用户'
    }

    const typeName = typeNames[type as keyof typeof typeNames] || type
    const itemName = item.title || item.name || item.label || '项目'
    
    return `${typeName}"${itemName}"已成功删除`
  }

  /**
   * 获取项目类型的中文名称
   */
  const getItemTypeName = (type: string): string => {
    const typeNames = {
      post: '文章',
      category: '分类',
      tag: '标签',
      user: '用户'
    }

    return typeNames[type as keyof typeof typeNames] || type
  }

  return {
    // 状态
    deleteTarget: readonly(deleteTarget),
    deleteDialogOpen,
    deleting: readonly(deleting),

    // 方法
    confirmDelete,
    cancelDelete,
    executeDelete,
    forceReset,

    // 工具方法
    getItemTypeName
  }
}

/**
 * 文章删除的专用 Composable
 */
export const usePostDelete = (options: UseDeleteOptions = {}) => {
  const deleteComposable = useDelete({
    ...options,
    showToast: options.showToast !== false
  })

  /**
   * 删除文章的便捷方法
   */
  const deletePost = (post: any, index?: number) => {
    deleteComposable.confirmDelete(post, 'post', index)
  }

  return {
    ...deleteComposable,
    deletePost
  }
}