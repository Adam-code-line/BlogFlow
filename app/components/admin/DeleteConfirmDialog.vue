<!--
  删除确认对话框组件
  封装删除操作的通用确认对话框
-->
<template>
  <UModal v-model="isOpen">
    <UCard class="h-full flex flex-col">
      <template #header>
        <div class="flex items-center space-x-3">
          <div class="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
            <Icon name="i-heroicons-exclamation-triangle" class="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">确认删除</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">此操作将永久删除{{ itemType }}</p>
          </div>
        </div>
      </template>

      <div class="space-y-4">
        <!-- 警告信息 -->
        <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div class="flex">
            <Icon name="i-heroicons-exclamation-triangle" class="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3" />
            <div>
              <h4 class="text-sm font-medium text-yellow-800 dark:text-yellow-200">警告</h4>
              <p class="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                您即将删除{{ itemType }}，此操作不可撤销。删除后{{ itemType }}将无法恢复。
              </p>
            </div>
          </div>
        </div>

        <!-- 要删除的项目预览 -->
        <div v-if="item" class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <slot name="preview" :item="item">
            <!-- 默认预览（用于文章） -->
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
          </slot>
        </div>

        <!-- 确认输入 -->
        <div v-if="requireConfirmText" class="space-y-2">
          <label class="text-sm font-medium text-gray-900 dark:text-white">
            请输入 <span class="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-semibold">{{ confirmText }}</span> 以确认：
          </label>
          <UInput
            v-model="confirmInput"
            :placeholder="`请输入：${confirmText}`"
            class="w-full"
          />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end space-x-3">
          <UButton
            variant="ghost"
            @click="handleCancel"
            :disabled="deleting"
          >
            取消
          </UButton>
          <UButton
            color="error"
            :loading="deleting"
            :disabled="requireConfirmText && confirmInput !== confirmText"
            @click="handleConfirm"
          >
            确认删除
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
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

// 计算属性
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
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
  emit('cancel')
  emit('update:modelValue', false)
}

// 监听对话框打开/关闭，重置状态
watch(isOpen, (newValue) => {
  if (!newValue) {
    confirmInput.value = ''
    deleting.value = false
  }
})
</script>