<!--
  删除成功提示组件
  提供一致的删除成功反馈体验
-->
<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      enter-to-class="opacity-100 translate-y-0 sm:scale-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 translate-y-0 sm:scale-100"
      leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
    >
      <div
        v-if="isVisible"
        class="fixed top-4 right-4 z-50 max-w-sm w-full"
      >
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <!-- 进度条 -->
          <div 
            v-if="showProgress"
            class="h-1 bg-green-500 transition-all duration-300 ease-linear"
            :style="{ width: `${progress}%` }"
          ></div>
          
          <div class="p-4">
            <div class="flex items-start">
              <!-- 成功图标 -->
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                  <Icon name="i-heroicons-check" class="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
              
              <!-- 内容 -->
              <div class="ml-3 flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ title }}
                </p>
                <p v-if="message" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {{ message }}
                </p>
              </div>
              
              <!-- 关闭按钮 -->
              <div class="ml-4 flex-shrink-0">
                <button
                  @click="close"
                  class="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 rounded-md"
                >
                  <Icon name="i-heroicons-x-mark" class="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <!-- 操作按钮（可选） -->
            <div v-if="actions && actions.length > 0" class="mt-3 flex space-x-2">
              <button
                v-for="action in actions"
                :key="action.label"
                @click="handleAction(action)"
                class="text-xs font-medium text-green-600 dark:text-green-400 hover:text-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 rounded"
              >
                {{ action.label }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Action {
  label: string
  handler: () => void
}

interface Props {
  title: string
  message?: string
  duration?: number
  showProgress?: boolean
  actions?: Action[]
}

const props = withDefaults(defineProps<Props>(), {
  duration: 4000,
  showProgress: true,
  actions: () => []
})

const emit = defineEmits<{
  close: []
}>()

const isVisible = ref(false)
const progress = ref(100)
let timer: NodeJS.Timeout | null = null
let progressTimer: NodeJS.Timeout | null = null

// 显示提示
const show = () => {
  isVisible.value = true
  progress.value = 100
  
  if (props.duration > 0) {
    // 启动进度条动画
    if (props.showProgress) {
      const updateInterval = 50 // 更新间隔(ms)
      const decrementPerUpdate = (100 / props.duration) * updateInterval
      
      progressTimer = setInterval(() => {
        progress.value -= decrementPerUpdate
        if (progress.value <= 0) {
          progress.value = 0
          if (progressTimer) {
            clearInterval(progressTimer)
            progressTimer = null
          }
        }
      }, updateInterval)
    }
    
    // 自动关闭
    timer = setTimeout(() => {
      close()
    }, props.duration)
  }
}

// 关闭提示
const close = () => {
  isVisible.value = false
  emit('close')
  
  // 清理计时器
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
  if (progressTimer) {
    clearInterval(progressTimer)
    progressTimer = null
  }
}

// 处理操作按钮点击
const handleAction = (action: Action) => {
  action.handler()
  close()
}

// 暴露方法
defineExpose({
  show,
  close
})

// 组件挂载时自动显示
onMounted(() => {
  show()
})

// 组件卸载时清理计时器
onUnmounted(() => {
  if (timer) clearTimeout(timer)
  if (progressTimer) clearInterval(progressTimer)
})
</script>