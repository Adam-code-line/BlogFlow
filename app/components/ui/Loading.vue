<template>
  <div :class="containerClasses">
    <!-- 圆形加载器 -->
    <div
      v-if="variant === 'spinner'"
      :class="spinnerClasses"
    ></div>
    
    <!-- 脉冲点 -->
    <div
      v-else-if="variant === 'dots'"
      class="flex space-x-1"
    >
      <div
        v-for="i in 3"
        :key="i"
        :class="dotClasses"
        :style="{ animationDelay: `${(i - 1) * 0.15}s` }"
      ></div>
    </div>
    
    <!-- 进度条 -->
    <div
      v-else-if="variant === 'progress'"
      :class="progressContainerClasses"
    >
      <div
        :class="progressBarClasses"
        :style="{ width: `${progress}%` }"
      ></div>
    </div>
    
    <!-- 波浪 -->
    <div
      v-else-if="variant === 'wave'"
      class="flex items-center space-x-1"
    >
      <div
        v-for="i in 5"
        :key="i"
        :class="waveBarClasses"
        :style="{ animationDelay: `${(i - 1) * 0.1}s` }"
      ></div>
    </div>
    
    <!-- 骨架屏 -->
    <div
      v-else-if="variant === 'skeleton'"
      class="space-y-3"
    >
      <div :class="skeletonClasses" style="width: 100%"></div>
      <div :class="skeletonClasses" style="width: 75%"></div>
      <div :class="skeletonClasses" style="width: 50%"></div>
    </div>
    
    <!-- 脉冲方块 -->
    <div
      v-else-if="variant === 'pulse'"
      :class="pulseClasses"
    ></div>

    <!-- 加载文本 -->
    <div
      v-if="text && variant !== 'skeleton'"
      :class="textClasses"
    >
      {{ text }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface LoadingProps {
  // 加载器变体
  variant?: 'spinner' | 'dots' | 'progress' | 'wave' | 'skeleton' | 'pulse'
  // 尺寸
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  // 颜色
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral'
  // 加载文本
  text?: string
  // 进度（仅progress类型）
  progress?: number
  // 是否居中
  centered?: boolean
  // 是否全屏覆盖
  overlay?: boolean
  // 自定义类名
  class?: string
}

const props = withDefaults(defineProps<LoadingProps>(), {
  variant: 'spinner',
  size: 'md',
  color: 'primary',
  progress: 0,
  centered: false,
  overlay: false
})

// 尺寸映射
const sizeMap = {
  xs: {
    spinner: 'w-4 h-4 border-2',
    dot: 'w-1 h-1',
    wave: 'w-1 h-4',
    pulse: 'w-8 h-8',
    text: 'text-xs',
    skeleton: 'h-3'
  },
  sm: {
    spinner: 'w-5 h-5 border-2',
    dot: 'w-1.5 h-1.5',
    wave: 'w-1 h-5',
    pulse: 'w-10 h-10',
    text: 'text-sm',
    skeleton: 'h-4'
  },
  md: {
    spinner: 'w-6 h-6 border-2',
    dot: 'w-2 h-2',
    wave: 'w-1 h-6',
    pulse: 'w-12 h-12',
    text: 'text-base',
    skeleton: 'h-4'
  },
  lg: {
    spinner: 'w-8 h-8 border-4',
    dot: 'w-2.5 h-2.5',
    wave: 'w-1.5 h-8',
    pulse: 'w-16 h-16',
    text: 'text-lg',
    skeleton: 'h-5'
  },
  xl: {
    spinner: 'w-10 h-10 border-4',
    dot: 'w-3 h-3',
    wave: 'w-2 h-10',
    pulse: 'w-20 h-20',
    text: 'text-xl',
    skeleton: 'h-6'
  }
}

// 颜色映射
const colorMap = {
  primary: {
    spinner: 'border-blue-500 border-t-transparent',
    dot: 'bg-blue-500',
    wave: 'bg-blue-500',
    pulse: 'bg-blue-500',
    progress: 'bg-blue-500',
    skeleton: 'bg-blue-200 dark:bg-blue-800',
    text: 'text-blue-600'
  },
  secondary: {
    spinner: 'border-gray-500 border-t-transparent',
    dot: 'bg-gray-500',
    wave: 'bg-gray-500',
    pulse: 'bg-gray-500',
    progress: 'bg-gray-500',
    skeleton: 'bg-gray-200 dark:bg-gray-700',
    text: 'text-gray-600'
  },
  success: {
    spinner: 'border-green-500 border-t-transparent',
    dot: 'bg-green-500',
    wave: 'bg-green-500',
    pulse: 'bg-green-500',
    progress: 'bg-green-500',
    skeleton: 'bg-green-200 dark:bg-green-800',
    text: 'text-green-600'
  },
  warning: {
    spinner: 'border-yellow-500 border-t-transparent',
    dot: 'bg-yellow-500',
    wave: 'bg-yellow-500',
    pulse: 'bg-yellow-500',
    progress: 'bg-yellow-500',
    skeleton: 'bg-yellow-200 dark:bg-yellow-800',
    text: 'text-yellow-600'
  },
  error: {
    spinner: 'border-red-500 border-t-transparent',
    dot: 'bg-red-500',
    wave: 'bg-red-500',
    pulse: 'bg-red-500',
    progress: 'bg-red-500',
    skeleton: 'bg-red-200 dark:bg-red-800',
    text: 'text-red-600'
  },
  neutral: {
    spinner: 'border-gray-400 border-t-transparent',
    dot: 'bg-gray-400',
    wave: 'bg-gray-400',
    pulse: 'bg-gray-400',
    progress: 'bg-gray-400',
    skeleton: 'bg-gray-200 dark:bg-gray-600',
    text: 'text-gray-500'
  }
}

// 样式计算
const containerClasses = computed(() => {
  const classes = ['flex items-center']
  
  if (props.centered) {
    classes.push('justify-center')
  }
  
  if (props.overlay) {
    classes.push(
      'fixed inset-0 z-50 bg-white/80 dark:bg-gray-900/80',
      'backdrop-blur-sm justify-center'
    )
  }
  
  if (props.text && props.variant !== 'skeleton') {
    classes.push('flex-col space-y-2')
  }
  
  if (props.class) {
    classes.push(props.class)
  }
  
  return classes.join(' ')
})

const spinnerClasses = computed(() => {
  return [
    'rounded-full animate-spin',
    sizeMap[props.size].spinner,
    colorMap[props.color].spinner
  ].join(' ')
})

const dotClasses = computed(() => {
  return [
    'rounded-full animate-bounce',
    sizeMap[props.size].dot,
    colorMap[props.color].dot
  ].join(' ')
})

const progressContainerClasses = computed(() => {
  return 'w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'
})

const progressBarClasses = computed(() => {
  return [
    'h-full rounded-full transition-all duration-300',
    colorMap[props.color].progress
  ].join(' ')
})

const waveBarClasses = computed(() => {
  return [
    'rounded-full animate-wave',
    sizeMap[props.size].wave,
    colorMap[props.color].wave
  ].join(' ')
})

const skeletonClasses = computed(() => {
  return [
    'rounded animate-pulse',
    sizeMap[props.size].skeleton,
    colorMap[props.color].skeleton
  ].join(' ')
})

const pulseClasses = computed(() => {
  return [
    'rounded-lg animate-pulse',
    sizeMap[props.size].pulse,
    colorMap[props.color].pulse
  ].join(' ')
})

const textClasses = computed(() => {
  return [
    'font-medium',
    sizeMap[props.size].text,
    colorMap[props.color].text
  ].join(' ')
})
</script>

<style scoped>
/* 波浪动画 */
@keyframes wave {
  0%, 40%, 100% {
    transform: scaleY(0.4);
  }
  20% {
    transform: scaleY(1.0);
  }
}

.animate-wave {
  animation: wave 1.2s infinite ease-in-out;
}

/* 确保动画在所有浏览器中都能正常工作 */
@media (prefers-reduced-motion: reduce) {
  .animate-spin,
  .animate-bounce,
  .animate-pulse,
  .animate-wave {
    animation: none;
  }
}
</style>