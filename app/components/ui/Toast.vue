<template>
  <Teleport to="body">
    <div
      class="fixed top-4 right-4 z-50 space-y-3"
      style="max-width: calc(100vw - 2rem);"
    >
      <TransitionGroup
        name="toast"
        tag="div"
        class="space-y-3"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="toastClasses(toast)"
          class="max-w-sm w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden"
        >
          <div class="p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <Icon
                  :name="getIcon(toast.type)"
                  :class="getIconColor(toast.type)"
                  class="h-6 w-6"
                />
              </div>
              <div class="ml-3 w-0 flex-1 pt-0.5">
                <p v-if="toast.title" class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ toast.title }}
                </p>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {{ toast.message }}
                </p>
                <div v-if="toast.actions" class="mt-3 flex space-x-3">
                  <button
                    v-for="action in toast.actions"
                    :key="action.label"
                    @click="action.handler(); removeToast(toast.id)"
                    class="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                  >
                    {{ action.label }}
                  </button>
                </div>
              </div>
              <div class="ml-4 flex-shrink-0 flex">
                <button
                  @click="removeToast(toast.id)"
                  class="bg-white dark:bg-gray-800 rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  <span class="sr-only">关闭</span>
                  <Icon name="heroicons:x-mark" class="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
          <!-- 进度条 -->
          <div
            v-if="toast.duration && toast.duration > 0"
            class="h-1 bg-gray-200 dark:bg-gray-700"
          >
            <div
              :class="getProgressColor(toast.type)"
              class="h-full transition-all ease-linear"
              :style="{ width: `${toast.progress}%` }"
            ></div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
interface ToastAction {
  label: string
  handler: () => void
}

interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  duration?: number
  actions?: ToastAction[]
  progress?: number
}

interface ToastOptions {
  type?: Toast['type']
  title?: string
  duration?: number
  actions?: ToastAction[]
  persistent?: boolean
}

// 存储所有的toast
const toasts = ref<Toast[]>([])
const activeTimers = new Map<string, NodeJS.Timeout>()

// 添加toast
const addToast = (message: string, options: ToastOptions = {}) => {
  const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  const duration = options.persistent ? 0 : (options.duration ?? 5000)
  
  const toast: Toast = {
    id,
    type: options.type ?? 'info',
    title: options.title,
    message,
    duration,
    actions: options.actions,
    progress: 100
  }

  toasts.value.push(toast)

  // 如果有持续时间，启动倒计时
  if (duration > 0) {
    startProgress(toast, duration)
  }

  return id
}

// 启动进度条动画
const startProgress = (toast: Toast, duration: number) => {
  const interval = 50 // 更新间隔(ms)
  const step = (interval / duration) * 100
  
  const timer = setInterval(() => {
    if (toast.progress !== undefined) {
      toast.progress -= step
      
      if (toast.progress <= 0) {
        removeToast(toast.id)
      }
    }
  }, interval)
  
  activeTimers.set(toast.id, timer)
}

// 移除toast
const removeToast = (id: string) => {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
  
  // 清除对应的计时器
  if (activeTimers.has(id)) {
    clearInterval(activeTimers.get(id))
    activeTimers.delete(id)
  }
}

// 清空所有toast
const clearAll = () => {
  toasts.value = []
  activeTimers.forEach(timer => clearInterval(timer))
  activeTimers.clear()
}

// 便捷方法
const success = (message: string, options?: Omit<ToastOptions, 'type'>) => 
  addToast(message, { ...options, type: 'success' })

const error = (message: string, options?: Omit<ToastOptions, 'type'>) => 
  addToast(message, { ...options, type: 'error' })

const warning = (message: string, options?: Omit<ToastOptions, 'type'>) => 
  addToast(message, { ...options, type: 'warning' })

const info = (message: string, options?: Omit<ToastOptions, 'type'>) => 
  addToast(message, { ...options, type: 'info' })

// 样式计算
const toastClasses = (toast: Toast) => {
  const baseClasses = 'transform transition-all duration-300 ease-in-out'
  return baseClasses
}

const getIcon = (type: Toast['type']) => {
  const icons = {
    success: 'heroicons:check-circle',
    error: 'heroicons:x-circle',
    warning: 'heroicons:exclamation-triangle',
    info: 'heroicons:information-circle'
  }
  return icons[type]
}

const getIconColor = (type: Toast['type']) => {
  const colors = {
    success: 'text-green-400',
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400'
  }
  return colors[type]
}

const getProgressColor = (type: Toast['type']) => {
  const colors = {
    success: 'bg-green-400',
    error: 'bg-red-400',
    warning: 'bg-yellow-400',
    info: 'bg-blue-400'
  }
  return colors[type]
}

// 暴露方法供外部使用
defineExpose({
  addToast,
  removeToast,
  clearAll,
  success,
  error,
  warning,
  info
})

// 清理定时器
onUnmounted(() => {
  activeTimers.forEach(timer => clearInterval(timer))
})
</script>

<style scoped>
/* Toast 动画 */
.toast-enter-active {
  transition: all 0.3s ease-out;
}

.toast-leave-active {
  transition: all 0.3s ease-in;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>