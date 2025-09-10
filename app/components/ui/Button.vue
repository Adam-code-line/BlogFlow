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
    <span v-if="$slots.default || label" :class="{ 'ml-2': icon && !iconRight, 'mr-2': icon && iconRight }">
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
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-4 py-2 text-base',
    xl: 'px-6 py-3 text-base'
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
      solid: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow focus:ring-blue-500',
      outline: 'border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
      ghost: 'text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
      soft: 'bg-blue-50 text-blue-600 hover:bg-blue-100 focus:ring-blue-500',
      link: 'text-blue-600 hover:text-blue-700 underline-offset-4 hover:underline'
    },
    secondary: {
      solid: 'bg-gray-600 hover:bg-gray-700 text-white shadow-sm hover:shadow focus:ring-gray-500',
      outline: 'border border-gray-600 text-gray-600 hover:bg-gray-50 focus:ring-gray-500',
      ghost: 'text-gray-600 hover:bg-gray-50 focus:ring-gray-500',
      soft: 'bg-gray-50 text-gray-600 hover:bg-gray-100 focus:ring-gray-500',
      link: 'text-gray-600 hover:text-gray-700 underline-offset-4 hover:underline'
    },
    success: {
      solid: 'bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow focus:ring-green-500',
      outline: 'border border-green-600 text-green-600 hover:bg-green-50 focus:ring-green-500',
      ghost: 'text-green-600 hover:bg-green-50 focus:ring-green-500',
      soft: 'bg-green-50 text-green-600 hover:bg-green-100 focus:ring-green-500',
      link: 'text-green-600 hover:text-green-700 underline-offset-4 hover:underline'
    },
    warning: {
      solid: 'bg-yellow-600 hover:bg-yellow-700 text-white shadow-sm hover:shadow focus:ring-yellow-500',
      outline: 'border border-yellow-600 text-yellow-600 hover:bg-yellow-50 focus:ring-yellow-500',
      ghost: 'text-yellow-600 hover:bg-yellow-50 focus:ring-yellow-500',
      soft: 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100 focus:ring-yellow-500',
      link: 'text-yellow-600 hover:text-yellow-700 underline-offset-4 hover:underline'
    },
    error: {
      solid: 'bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow focus:ring-red-500',
      outline: 'border border-red-600 text-red-600 hover:bg-red-50 focus:ring-red-500',
      ghost: 'text-red-600 hover:bg-red-50 focus:ring-red-500',
      soft: 'bg-red-50 text-red-600 hover:bg-red-100 focus:ring-red-500',
      link: 'text-red-600 hover:text-red-700 underline-offset-4 hover:underline'
    },
    neutral: {
      solid: 'bg-gray-900 hover:bg-gray-800 text-white shadow-sm hover:shadow focus:ring-gray-500',
      outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
      ghost: 'text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
      soft: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500',
      link: 'text-gray-700 hover:text-gray-900 underline-offset-4 hover:underline'
    }
  }
  
  return variants[props.color][props.variant]
})

// 综合样式类
const buttonClasses = computed(() => {
  const baseClasses = [
    'inline-flex items-center justify-center font-medium',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'transition-colors duration-200',
    'disabled:opacity-50 disabled:cursor-not-allowed'
  ]

  // 圆角样式
  if (props.square) {
    baseClasses.push('rounded-none')
  } else if (props.variant === 'link') {
    // link 变体不需要圆角
  } else {
    baseClasses.push('rounded-md')
  }

  // 块级按钮
  if (props.block) {
    baseClasses.push('w-full')
  }

  // 禁用状态下的悬停效果取消
  if (props.disabled || props.loading) {
    baseClasses.push('pointer-events-none')
  }

  return [
    ...baseClasses,
    sizeClasses.value,
    variantClasses.value
  ].join(' ')
})

// 点击事件处理
const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>
