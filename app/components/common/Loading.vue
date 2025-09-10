<template>
  <div :class="loadingClasses">
    <!-- 加载图标 -->
    <div :class="iconWrapperClasses">
      <Icon
        :name="icon"
        :class="iconClasses"
        class="animate-spin"
      />
    </div>
    
    <!-- 加载文本 -->
    <div v-if="text || $slots.default" :class="textClasses">
      <slot>{{ text }}</slot>
    </div>
    
    <!-- 描述文本 -->
    <div v-if="description" :class="descriptionClasses">
      {{ description }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface LoadingProps {
  // 加载文本
  text?: string
  // 描述文本
  description?: string
  // 图标名称
  icon?: string
  // 尺寸
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  // 布局方向
  direction?: 'vertical' | 'horizontal'
  // 是否居中显示
  centered?: boolean
  // 是否全屏覆盖
  overlay?: boolean
  // 颜色主题
  color?: 'primary' | 'secondary' | 'neutral'
}

const props = withDefaults(defineProps<LoadingProps>(), {
  text: '',
  icon: 'heroicons:arrow-path',
  size: 'md',
  direction: 'vertical',
  centered: false,
  overlay: false,
  color: 'primary',
})

// 基础容器样式
const baseClasses = computed(() => {
  const classes = ['flex items-center']
  
  // 布局方向
  if (props.direction === 'vertical') {
    classes.push('flex-col space-y-3')
  } else {
    classes.push('flex-row space-x-3')
  }
  
  // 居中显示
  if (props.centered) {
    classes.push('justify-center')
  }
  
  return classes
})

// 覆盖层样式
const overlayClasses = computed(() => {
  if (props.overlay) {
    return [
      'fixed inset-0 z-50',
      'bg-white/80 dark:bg-gray-900/80',
      'backdrop-blur-sm',
      'flex items-center justify-center'
    ]
  }
  return []
})

// 综合容器样式
const loadingClasses = computed(() => [
  ...baseClasses.value,
  ...overlayClasses.value
].join(' '))

// 图标容器样式
const iconWrapperClasses = computed(() => {
  const classes = ['flex items-center justify-center']
  
  // 如果是覆盖层模式，添加额外的圆形背景
  if (props.overlay) {
    classes.push('bg-white dark:bg-gray-800 rounded-full shadow-lg')
    
    // 根据尺寸调整图标容器大小
    const containerSizes = {
      xs: 'w-12 h-12',
      sm: 'w-14 h-14',
      md: 'w-16 h-16',
      lg: 'w-20 h-20',
      xl: 'w-24 h-24'
    }
    classes.push(containerSizes[props.size])
  }
  
  return classes.join(' ')
})

// 图标样式
const iconClasses = computed(() => {
  // 图标尺寸
  const iconSizes = {
    xs: 'w-4 h-4',
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10'
  }
  
  // 颜色样式
  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    neutral: 'text-gray-500'
  }
  
  return `${iconSizes[props.size]} ${colorClasses[props.color]}`
})

// 文本样式
const textClasses = computed(() => {
  const classes = ['font-medium']
  
  // 文本尺寸
  const textSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }
  classes.push(textSizes[props.size])
  
  // 颜色样式
  const colorClasses = {
    primary: 'text-blue-600 dark:text-blue-400',
    secondary: 'text-gray-600 dark:text-gray-400',
    neutral: 'text-gray-700 dark:text-gray-300'
  }
  classes.push(colorClasses[props.color])
  
  return classes.join(' ')
})

// 描述文本样式
const descriptionClasses = computed(() => [
  'text-sm text-gray-500 dark:text-gray-400',
  'text-center max-w-xs'
].join(' '))
</script>
