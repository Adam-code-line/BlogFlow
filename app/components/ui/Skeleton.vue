<template>
  <div :class="containerClasses">
    <div
      v-for="line in lines"
      :key="line"
      :class="[
        'bg-gray-200 dark:bg-gray-700 rounded',
        animationClass,
        getLineClass(line)
      ]"
    ></div>
  </div>
</template>

<script setup lang="ts">
interface SkeletonProps {
  // 骨架屏类型
  variant?: 'text' | 'card' | 'avatar' | 'image' | 'button' | 'custom'
  // 行数（用于text类型）
  lines?: number
  // 宽度
  width?: string | number
  // 高度
  height?: string | number
  // 是否显示动画
  animated?: boolean
  // 动画类型
  animation?: 'pulse' | 'wave' | 'shimmer'
  // 圆角
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  // 自定义类名
  class?: string
}

const props = withDefaults(defineProps<SkeletonProps>(), {
  variant: 'text',
  lines: 3,
  animated: true,
  animation: 'pulse',
  rounded: 'md'
})

// 计算行数
const lines = computed(() => {
  if (props.variant === 'text') {
    return Array.from({ length: props.lines }, (_, i) => i + 1)
  }
  return [1] // 其他类型只有一行
})

// 容器样式类
const containerClasses = computed(() => {
  const baseClasses = ['space-y-3']
  
  if (props.variant === 'card') {
    baseClasses.push('p-4', 'border', 'border-gray-200', 'dark:border-gray-700', 'rounded-lg')
  }
  
  if (props.class) {
    baseClasses.push(props.class)
  }
  
  return baseClasses.join(' ')
})

// 动画类
const animationClass = computed(() => {
  if (!props.animated) return ''
  
  const animations = {
    pulse: 'animate-pulse',
    wave: 'animate-wave',
    shimmer: 'animate-shimmer relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent'
  }
  
  return animations[props.animation]
})

// 获取每行的样式类
const getLineClass = (lineIndex: number) => {
  const baseClasses: string[] = []
  
  // 圆角
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm', 
    md: 'rounded',
    lg: 'rounded-lg',
    full: 'rounded-full'
  }
  baseClasses.push(roundedClasses[props.rounded])
  
  // 根据变体设置样式
  switch (props.variant) {
    case 'text':
      baseClasses.push('h-4')
      // 最后一行通常较短
      if (lineIndex === props.lines) {
        baseClasses.push('w-3/4')
      } else {
        baseClasses.push('w-full')
      }
      break
      
    case 'card':
      if (lineIndex === 1) {
        baseClasses.push('h-48', 'w-full', 'mb-4') // 图片区域
      } else if (lineIndex === 2) {
        baseClasses.push('h-6', 'w-3/4', 'mb-2') // 标题
      } else {
        baseClasses.push('h-4', 'w-full') // 内容
      }
      break
      
    case 'avatar':
      baseClasses.push('w-12', 'h-12', 'rounded-full')
      break
      
    case 'image':
      baseClasses.push('w-full', 'h-64')
      break
      
    case 'button':
      baseClasses.push('h-10', 'w-24')
      break
      
    case 'custom':
      if (props.width) {
        if (typeof props.width === 'number') {
          baseClasses.push(`w-[${props.width}px]`)
        } else {
          baseClasses.push(`w-[${props.width}]`)
        }
      }
      if (props.height) {
        if (typeof props.height === 'number') {
          baseClasses.push(`h-[${props.height}px]`)
        } else {
          baseClasses.push(`h-[${props.height}]`)
        }
      }
      break
  }
  
  return baseClasses.join(' ')
}
</script>

<style scoped>
/* 波浪动画 */
@keyframes wave {
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-wave {
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  background-size: 200px 100%;
  animation: wave 1.5s ease-in-out infinite;
}

/* 闪光动画 */
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  background: #f6f7f8;
  background-image: linear-gradient(
    90deg,
    #f6f7f8 0px,
    #edeef1 40px,
    #f6f7f8 80px
  );
  background-size: 200px;
  animation: shimmer 2s infinite linear;
}

.dark .animate-shimmer {
  background: #374151;
  background-image: linear-gradient(
    90deg,
    #374151 0px,
    #4b5563 40px,
    #374151 80px
  );
}
</style>