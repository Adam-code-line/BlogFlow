<template>
  <div :class="errorClasses">
    <!-- 错误图标 -->
    <div v-if="showIcon" :class="iconClasses">
      <Icon :name="defaultIcon" :class="iconSizeClass" />
    </div>
    
    <!-- 错误内容 -->
    <div class="flex-1 min-w-0">
      <!-- 错误标题 -->
      <h3 v-if="title || $slots.title" :class="titleClasses">
        <slot name="title">{{ title }}</slot>
      </h3>
      
      <!-- 错误消息 -->
      <div v-if="message || $slots.default" :class="messageClasses">
        <slot>{{ message }}</slot>
      </div>
      
      <!-- 错误详情 -->
      <div v-if="description || $slots.description" :class="descriptionClasses">
        <slot name="description">{{ description }}</slot>
      </div>
      
      <!-- 操作按钮 -->
      <div v-if="$slots.actions || retryText" :class="actionsClasses">
        <slot name="actions">
          <UiButton
            v-if="retryText"
            variant="outline"
            size="sm"
            :color="variant === 'error' ? 'error' : 'primary'"
            @click="handleRetry"
          >
            {{ retryText }}
          </UiButton>
        </slot>
      </div>
    </div>
    
    <!-- 关闭按钮 -->
    <button
      v-if="closable"
      type="button"
      :class="closeButtonClasses"
      @click="handleClose"
    >
      <Icon name="heroicons:x-mark" class="w-4 h-4" />
      <span class="sr-only">关闭</span>
    </button>
  </div>
</template>

<script setup lang="ts">
interface ErrorMessageProps {
  // 错误标题
  title?: string
  // 错误消息
  message?: string
  // 错误描述
  description?: string
  // 错误类型
  variant?: 'error' | 'warning' | 'info'
  // 尺寸
  size?: 'sm' | 'md' | 'lg'
  // 图标名称
  icon?: string
  // 是否显示图标
  showIcon?: boolean
  // 是否可关闭
  closable?: boolean
  // 重试按钮文本
  retryText?: string
  // 是否显示边框
  bordered?: boolean
  // 圆角大小
  rounded?: 'sm' | 'md' | 'lg'
}

interface ErrorMessageEmits {
  (e: 'close'): void
  (e: 'retry'): void
}

const props = withDefaults(defineProps<ErrorMessageProps>(), {
  variant: 'error',
  size: 'md',
  showIcon: true,
  closable: false,
  bordered: true,
  rounded: 'md',
})

const emit = defineEmits<ErrorMessageEmits>()

// 默认图标
const defaultIcon = computed(() => {
  const icons = {
    error: 'heroicons:exclamation-circle',
    warning: 'heroicons:exclamation-triangle',
    info: 'heroicons:information-circle'
  }
  return props.icon || icons[props.variant]
})

// 基础容器样式
const baseClasses = computed(() => {
  const classes = ['flex items-start space-x-3 p-4']
  
  // 圆角
  const roundedMap = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg'
  }
  classes.push(roundedMap[props.rounded])
  
  return classes
})

// 变体样式
const variantClasses = computed(() => {
  const variants = {
    error: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      text: 'text-red-800 dark:text-red-200'
    },
    warning: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-800',
      text: 'text-yellow-800 dark:text-yellow-200'
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-800 dark:text-blue-200'
    }
  }
  
  const variant = variants[props.variant]
  const classes = [variant.bg]
  
  if (props.bordered) {
    classes.push('border', variant.border)
  }
  
  return classes
})

// 综合容器样式
const errorClasses = computed(() => [
  ...baseClasses.value,
  ...variantClasses.value
].join(' '))

// 图标样式
const iconClasses = computed(() => {
  const variants = {
    error: 'text-red-400 dark:text-red-500',
    warning: 'text-yellow-400 dark:text-yellow-500',
    info: 'text-blue-400 dark:text-blue-500'
  }
  
  return `flex-shrink-0 ${variants[props.variant]}`
})

// 图标尺寸
const iconSizeClass = computed(() => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }
  return sizes[props.size]
})

// 标题样式
const titleClasses = computed(() => {
  const variants = {
    error: 'text-red-800 dark:text-red-200',
    warning: 'text-yellow-800 dark:text-yellow-200',
    info: 'text-blue-800 dark:text-blue-200'
  }
  
  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }
  
  return `font-semibold ${variants[props.variant]} ${sizes[props.size]}`
})

// 消息样式
const messageClasses = computed(() => {
  const variants = {
    error: 'text-red-700 dark:text-red-300',
    warning: 'text-yellow-700 dark:text-yellow-300',
    info: 'text-blue-700 dark:text-blue-300'
  }
  
  const sizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }
  
  const classes = [variants[props.variant], sizes[props.size]]
  
  if (props.title) {
    classes.push('mt-1')
  }
  
  return classes.join(' ')
})

// 描述样式
const descriptionClasses = computed(() => {
  const variants = {
    error: 'text-red-600 dark:text-red-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    info: 'text-blue-600 dark:text-blue-400'
  }
  
  return `mt-2 text-sm ${variants[props.variant]}`
})

// 操作按钮容器样式
const actionsClasses = computed(() => 'mt-3')

// 关闭按钮样式
const closeButtonClasses = computed(() => {
  const variants = {
    error: 'text-red-400 hover:text-red-600 focus:ring-red-500',
    warning: 'text-yellow-400 hover:text-yellow-600 focus:ring-yellow-500',
    info: 'text-blue-400 hover:text-blue-600 focus:ring-blue-500'
  }
  
  return [
    'flex-shrink-0 p-1 rounded-md',
    'hover:bg-black/5 dark:hover:bg-white/5',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'transition-colors duration-200',
    variants[props.variant]
  ].join(' ')
})

// 事件处理
const handleClose = () => {
  emit('close')
}

const handleRetry = () => {
  emit('retry')
}
</script>
