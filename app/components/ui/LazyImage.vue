<template>
  <div
    ref="containerRef"
    :class="containerClasses"
    :style="containerStyle"
  >
    <!-- 占位符/骨架屏 -->
    <div
      v-if="!loaded"
      :class="placeholderClasses"
      :style="placeholderStyle"
    >
      <slot name="placeholder">
        <div class="flex items-center justify-center h-full">
          <Icon
            v-if="!loading"
            name="heroicons:photo"
            class="w-8 h-8 text-gray-400"
          />
          <div
            v-else
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"
          ></div>
        </div>
      </slot>
    </div>

    <!-- 实际图片 -->
    <img
      v-if="shouldLoad"
      ref="imageRef"
      :src="src"
      :alt="alt"
      :class="imageClasses"
      :style="imageStyle"
      @load="handleLoad"
      @error="handleError"
    />

    <!-- 错误状态 -->
    <div
      v-if="error"
      :class="errorClasses"
      :style="placeholderStyle"
    >
      <slot name="error">
        <div class="flex flex-col items-center justify-center h-full text-gray-500">
          <Icon name="heroicons:exclamation-triangle" class="w-8 h-8 mb-2" />
          <span class="text-sm">加载失败</span>
          <button
            v-if="retryable"
            @click="retry"
            class="mt-2 px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            重试
          </button>
        </div>
      </slot>
    </div>

    <!-- 遮罩层（用于悬停效果等） -->
    <div
      v-if="$slots.overlay && loaded"
      class="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
    >
      <slot name="overlay" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface LazyImageProps {
  // 图片地址
  src: string
  // 替代文本
  alt?: string
  // 占位符图片
  placeholder?: string
  // 宽度
  width?: string | number
  // 高度
  height?: string | number
  // 对象适配方式
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  // 对象位置
  objectPosition?: string
  // 圆角
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
  // 是否立即加载（不使用懒加载）
  eager?: boolean
  // 懒加载阈值
  threshold?: number
  // 是否可重试
  retryable?: boolean
  // 淡入动画
  fadeIn?: boolean
  // 自定义类名
  class?: string
}

const props = withDefaults(defineProps<LazyImageProps>(), {
  alt: '',
  objectFit: 'cover',
  objectPosition: 'center',
  rounded: 'none',
  eager: false,
  threshold: 0.1,
  retryable: true,
  fadeIn: true
})

// 状态
const containerRef = ref<HTMLElement>()
const imageRef = ref<HTMLImageElement>()
const shouldLoad = ref(props.eager)
const loading = ref(false)
const loaded = ref(false)
const error = ref(false)

// 使用Intersection Observer进行懒加载
const { stop } = useIntersectionObserver(
  containerRef,
  (entries) => {
    const entry = entries[0]
    if (entry?.isIntersecting && !shouldLoad.value && !props.eager) {
      shouldLoad.value = true
      loading.value = true
      stop() // 停止观察
    }
  },
  {
    threshold: props.threshold
  }
)

// 样式计算
const containerClasses = computed(() => {
  const classes = ['relative overflow-hidden']
  
  // 圆角
  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full'
  }
  classes.push(roundedClasses[props.rounded])
  
  if (props.class) {
    classes.push(props.class)
  }
  
  return classes.join(' ')
})

const containerStyle = computed(() => {
  const style: Record<string, string> = {}
  
  if (props.width) {
    style.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  }
  
  if (props.height) {
    style.height = typeof props.height === 'number' ? `${props.height}px` : props.height
  }
  
  return style
})

const placeholderClasses = computed(() => {
  return [
    'absolute inset-0 bg-gray-200 dark:bg-gray-700',
    'flex items-center justify-center'
  ].join(' ')
})

const placeholderStyle = computed(() => {
  return {
    backgroundImage: props.placeholder ? `url(${props.placeholder})` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }
})

const imageClasses = computed(() => {
  const classes = ['w-full h-full']
  
  // 对象适配
  const objectFitClasses = {
    contain: 'object-contain',
    cover: 'object-cover',
    fill: 'object-fill',
    none: 'object-none',
    'scale-down': 'object-scale-down'
  }
  classes.push(objectFitClasses[props.objectFit])
  
  // 淡入动画
  if (props.fadeIn) {
    classes.push('transition-opacity duration-500')
    if (!loaded.value) {
      classes.push('opacity-0')
    } else {
      classes.push('opacity-100')
    }
  }
  
  return classes.join(' ')
})

const imageStyle = computed(() => {
  return {
    objectPosition: props.objectPosition
  }
})

const errorClasses = computed(() => {
  return [
    'absolute inset-0 bg-gray-100 dark:bg-gray-800',
    'flex items-center justify-center'
  ].join(' ')
})

// 事件处理
const handleLoad = () => {
  loading.value = false
  loaded.value = true
  error.value = false
}

const handleError = () => {
  loading.value = false
  loaded.value = false
  error.value = true
}

const retry = () => {
  error.value = false
  loading.value = true
  
  // 重新设置图片src来触发重新加载
  if (imageRef.value) {
    const currentSrc = imageRef.value.src
    imageRef.value.src = ''
    nextTick(() => {
      if (imageRef.value) {
        imageRef.value.src = currentSrc
      }
    })
  }
}

// 如果是eager模式，立即开始加载
onMounted(() => {
  if (props.eager) {
    loading.value = true
  }
})
</script>

<style scoped>
/* 确保容器有默认尺寸 */
.relative {
  min-height: 2rem;
  min-width: 2rem;
}
</style>