<!--
  删除确认对话框组件
  使用Teleport实现的居中模态框
-->
<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen && props.item"
        class="fixed inset-0 z-50 overflow-y-auto"
        @click="handleOverlayClick"
      >
        <!-- 背景遮罩 -->
        <div class="fixed inset-0 bg-gray-900/75 backdrop-blur-sm transition-opacity"></div>
        
        <!-- 对话框容器 -->
        <div class="flex min-h-full items-center justify-center p-4">
          <Transition
            enter-active-class="transition ease-out duration-300"
            enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to-class="opacity-100 translate-y-0 sm:scale-100"
            leave-active-class="transition ease-in duration-200"
            leave-from-class="opacity-100 translate-y-0 sm:scale-100"
            leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              v-if="isOpen && props.item"
              ref="dialogRef"
              class="relative w-full max-w-lg transform rounded-lg bg-white dark:bg-gray-800 shadow-xl transition-all"
              @click.stop
            >
              <!-- 对话框头部 -->
              <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0 w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                    <Icon name="i-heroicons-exclamation-triangle" class="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div class="flex-1">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">确认删除</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">此操作将永久删除{{ itemType }}</p>
                  </div>
                  <button
                    @click="handleCancel"
                    class="flex-shrink-0 w-8 h-8 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
                  >
                    <Icon name="i-heroicons-x-mark" class="w-5 h-5" />
                  </button>
                </div>
              </div>

              <!-- 对话框内容 -->
              <div class="px-6 py-4 space-y-4">
                <!-- 警告信息 -->
                <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <div class="flex">
                    <Icon name="i-heroicons-exclamation-triangle" class="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 class="text-sm font-medium text-yellow-800 dark:text-yellow-200">警告</h4>
                      <p class="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                        您即将删除{{ itemType }}，此操作不可撤销。删除后{{ itemType }}将无法恢复。
                      </p>
                    </div>
                  </div>
                </div>

                <!-- 要删除的项目预览 -->
                <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div class="flex items-start space-x-3">
                    <img
                      :src="item.cover || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop'"
                      :alt="item.title || ''"
                      class="w-16 h-12 rounded-lg object-cover flex-shrink-0"
                    />
                    <div class="flex-1 min-w-0">
                      <h4 class="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {{ item.title || '无标题' }}
                      </h4>
                      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                        {{ item.description || '暂无描述' }}
                      </p>
                      <div v-if="item.publishedAt" class="flex items-center mt-2 text-xs text-gray-400 dark:text-gray-500">
                        <Icon name="i-heroicons-calendar" class="w-3 h-3 mr-1" />
                        {{ formatDate(item.publishedAt) }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 确认输入 -->
                <div v-if="requireConfirmText" class="space-y-2">
                  <label class="text-sm font-medium text-gray-900 dark:text-white">
                    请输入 <span class="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-semibold">{{ confirmText }}</span> 以确认：
                  </label>
                  <input
                    v-model="confirmInput"
                    type="text"
                    :placeholder="`请输入：${confirmText}`"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    @keyup.enter="handleConfirm"
                  />
                </div>
              </div>

              <!-- 对话框底部 -->
              <div class="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 rounded-b-lg">
                <div class="flex justify-end space-x-3">
                  <button
                    @click="handleCancel"
                    :disabled="deleting"
                    class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    取消
                  </button>
                  <button
                    @click="handleConfirm"
                    :disabled="deleting || (requireConfirmText && confirmInput !== confirmText)"
                    class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    <div v-if="deleting" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    {{ deleting ? '删除中...' : '确认删除' }}
                  </button>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useFormatters } from '~/composables/useFormatters'

interface Props {
  modelValue: boolean
  item: any
  itemType?: string
  requireConfirmText?: boolean
  confirmText?: string
  onConfirm?: (item: any) => Promise<void>
}

const props = withDefaults(defineProps<Props>(), {
  itemType: '项目',
  requireConfirmText: true,
  confirmText: '删除'
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'confirm': [item: any]
  'cancel': []
}>()

// 使用格式化函数
const { formatDateShort } = useFormatters()

// 响应式状态
const deleting = ref(false)
const confirmInput = ref('')
const dialogRef = ref<HTMLElement>()

// 计算属性
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
    if (!value) {
      emit('cancel')
    }
  }
})

// 方法
const formatDate = (date: string | Date) => {
  return formatDateShort(date)
}

const handleConfirm = async () => {
  if (props.requireConfirmText && confirmInput.value !== props.confirmText) {
    return
  }

  deleting.value = true
  
  try {
    if (props.onConfirm) {
      await props.onConfirm(props.item)
    }
    emit('confirm', props.item)
    handleCancel()
  } catch (error) {
    console.error('删除操作失败:', error)
    // 错误处理由父组件负责
  } finally {
    deleting.value = false
  }
}

const handleCancel = () => {
  confirmInput.value = ''
  isOpen.value = false
}

const handleOverlayClick = (event: Event) => {
  if (event.target === event.currentTarget) {
    handleCancel()
  }
}

// ESC键关闭对话框
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isOpen.value) {
    handleCancel()
  }
}

// 监听对话框打开/关闭，重置状态和处理键盘事件
watch(isOpen, (newValue) => {
  if (newValue) {
    confirmInput.value = ''
    deleting.value = false
    document.addEventListener('keydown', handleKeyDown)
    // 获取焦点
    nextTick(() => {
      const input = dialogRef.value?.querySelector('input')
      if (input) {
        input.focus()
      }
    })
  } else {
    document.removeEventListener('keydown', handleKeyDown)
  }
})

// 组件卸载时清理事件监听
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})
</script>