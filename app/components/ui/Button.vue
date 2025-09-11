<template>
  <component
    :is="tag"
    :type="htmlType"
    :disabled="disabled || loading"
    :class="buttonClasses"
    v-bind="linkProps"
    @click="handleClick"
  >
    <!-- Loading 图标 -->
    <Icon
      v-if="loading"
      name="heroicons:arrow-path"
      class="animate-spin"
      :class="iconSizeClass"
    />
    
    <!-- 左侧图标 -->
    <Icon
      v-else-if="icon && !iconRight"
      :name="icon"
      :class="iconSizeClass"
    />
    
    <!-- 按钮文本 -->
    <span v-if="$slots.default || label" :class="{ 'ml-2': icon && !iconRight && !loading, 'mr-2': icon && iconRight && !loading }">
      <slot>{{ label }}</slot>
    </span>
    
    <!-- 右侧图标 -->
    <Icon
      v-if="icon && iconRight && !loading"
      :name="icon"
      :class="iconSizeClass"
    />
  </component>
</template>

<script setup lang="ts">
interface ButtonProps {
  // 按钮类型
  variant?: 'solid' | 'outline' | 'ghost' | 'soft' | 'link'
  // 颜色主题
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral'
  // 尺寸
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  // 按钮文本
  label?: string
  // 图标
  icon?: string
  // 图标位置
  iconRight?: boolean
  // 是否禁用
  disabled?: boolean
  // 是否加载中
  loading?: boolean
  // HTML 类型（仅对 button 标签有效）
  type?: 'button' | 'submit' | 'reset'
  // 链接相关属性
  to?: string | object
  href?: string
  target?: string
  // 是否为块级按钮
  block?: boolean
  // 是否为圆形按钮
  square?: boolean
}

interface ButtonEmits {
  (e: 'click', event: MouseEvent): void
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'solid',
  color: 'primary',
  size: 'md',
  type: 'button',
  iconRight: false,
  disabled: false,
  loading: false,
  block: false,
  square: false,
})

const emit = defineEmits<ButtonEmits>()

// 计算按钮标签类型
const tag = computed(() => {
  if (props.to) return resolveComponent('NuxtLink')
  if (props.href) return 'a'
  return 'button'
})

// HTML type 属性（仅对 button 标签有效）
const htmlType = computed(() => {
  return tag.value === 'button' ? props.type : undefined
})

// 链接属性
const linkProps = computed(() => {
  if (props.to) {
    return { to: props.to }
  }
  if (props.href) {
    return { 
      href: props.href,
      target: props.target,
      rel: props.target === '_blank' ? 'noopener noreferrer' : undefined
    }
  }
  return {}
})

// 尺寸相关样式
const sizeClasses = computed(() => {
  const sizes = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-base',
    xl: 'px-6 py-3.5 text-base'
  }
  return sizes[props.size]
})

// 图标尺寸
const iconSizeClass = computed(() => {
  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-5 h-5'
  }
  return iconSizes[props.size]
})

// 颜色和变体样式
const variantClasses = computed(() => {
  const variants = {
    primary: {
      solid: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
      outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 active:bg-blue-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:hover:bg-blue-900/20',
      ghost: 'text-blue-600 hover:bg-blue-50 active:bg-blue-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:hover:bg-blue-900/20',
      soft: 'bg-blue-50 text-blue-600 hover:bg-blue-100 active:bg-blue-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-900/20 dark:hover:bg-blue-900/30',
      link: 'text-blue-600 hover:text-blue-700 active:text-blue-800 underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
    },
    secondary: {
      solid: 'bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white shadow-sm hover:shadow-md focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
      outline: 'border-2 border-gray-600 text-gray-600 hover:bg-gray-50 active:bg-gray-100 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:text-gray-400 dark:border-gray-500 dark:hover:bg-gray-800',
      ghost: 'text-gray-600 hover:bg-gray-50 active:bg-gray-100 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:bg-gray-800',
      soft: 'bg-gray-50 text-gray-600 hover:bg-gray-100 active:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700',
      link: 'text-gray-600 hover:text-gray-700 active:text-gray-800 underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:text-gray-400'
    },
    success: {
      solid: 'bg-green-600 hover:bg-green-700 active:bg-green-800 text-white shadow-sm hover:shadow-md focus:ring-2 focus:ring-green-500 focus:ring-offset-2',
      outline: 'border-2 border-green-600 text-green-600 hover:bg-green-50 active:bg-green-100 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:hover:bg-green-900/20',
      ghost: 'text-green-600 hover:bg-green-50 active:bg-green-100 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:hover:bg-green-900/20',
      soft: 'bg-green-50 text-green-600 hover:bg-green-100 active:bg-green-200 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:bg-green-900/20 dark:hover:bg-green-900/30',
      link: 'text-green-600 hover:text-green-700 active:text-green-800 underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
    },
    warning: {
      solid: 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white shadow-sm hover:shadow-md focus:ring-2 focus:ring-amber-500 focus:ring-offset-2',
      outline: 'border-2 border-amber-500 text-amber-600 hover:bg-amber-50 active:bg-amber-100 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:hover:bg-amber-900/20',
      ghost: 'text-amber-600 hover:bg-amber-50 active:bg-amber-100 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:hover:bg-amber-900/20',
      soft: 'bg-amber-50 text-amber-600 hover:bg-amber-100 active:bg-amber-200 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:bg-amber-900/20 dark:hover:bg-amber-900/30',
      link: 'text-amber-600 hover:text-amber-700 active:text-amber-800 underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2'
    },
    error: {
      solid: 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-sm hover:shadow-md focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
      outline: 'border-2 border-red-600 text-red-600 hover:bg-red-50 active:bg-red-100 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:hover:bg-red-900/20',
      ghost: 'text-red-600 hover:bg-red-50 active:bg-red-100 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:hover:bg-red-900/20',
      soft: 'bg-red-50 text-red-600 hover:bg-red-100 active:bg-red-200 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:bg-red-900/20 dark:hover:bg-red-900/30',
      link: 'text-red-600 hover:text-red-700 active:text-red-800 underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
    },
    neutral: {
      solid: 'bg-gray-900 hover:bg-gray-800 active:bg-gray-700 text-white shadow-sm hover:shadow-md focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100',
      outline: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800',
      ghost: 'text-gray-700 hover:bg-gray-100 active:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:text-gray-300 dark:hover:bg-gray-800',
      soft: 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
      link: 'text-gray-700 hover:text-gray-900 active:text-gray-600 underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:text-gray-300 dark:hover:text-gray-100'
    }
  }
  
  return variants[props.color][props.variant]
})

// 综合样式类
const buttonClasses = computed(() => {
  const baseClasses = [
    'inline-flex items-center justify-center font-medium',
    'focus:outline-none transition-all duration-200 ease-in-out',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none'
  ]

  // 圆角样式
  if (props.square) {
    baseClasses.push('rounded-none')
  } else if (props.variant === 'link') {
    // link 变体不需要圆角
  } else {
    baseClasses.push('rounded-lg')
  }

  // 块级按钮
  if (props.block) {
    baseClasses.push('w-full')
  }

  // 加载状态特殊样式
  if (props.loading) {
    baseClasses.push('cursor-wait')
  }

  // 添加特殊的悬停效果
  if (!props.disabled && !props.loading) {
    baseClasses.push('transform hover:scale-105 active:scale-95')
  }

  return [
    ...baseClasses,
    sizeClasses.value,
    variantClasses.value
  ].filter(Boolean).join(' ')
})

// 点击事件处理
const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped>
/* 确保图标和文本对齐 */
.inline-flex {
  align-items: center;
}

/* 改善按钮的视觉反馈 */
button, a {
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

/* 优化点击动画 */
@media (prefers-reduced-motion: no-preference) {
  .transform {
    transition: transform 0.1s ease-in-out;
  }
}

/* 移除按钮在移动设备上的点击高亮 */
button:focus {
  outline: none;
}

/* 确保链接按钮的正确显示 */
a.inline-flex {
  text-decoration: none;
}
</style>
