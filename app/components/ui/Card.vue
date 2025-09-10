<template>
  <div :class="cardClasses">
    <!-- 卡片头部 -->
    <header v-if="$slots.header || title || $slots.actions" :class="headerClasses">
      <div class="flex-1">
        <slot name="header">
          <h3 v-if="title" :class="titleClasses">{{ title }}</h3>
          <p v-if="subtitle" :class="subtitleClasses">{{ subtitle }}</p>
        </slot>
      </div>
      <div v-if="$slots.actions" class="flex-shrink-0 ml-4">
        <slot name="actions" />
      </div>
    </header>

    <!-- 卡片图片 -->
    <div v-if="$slots.image || image" :class="imageWrapperClasses">
      <slot name="image">
        <img
          v-if="image"
          :src="image"
          :alt="imageAlt || title || ''"
          :class="imageClasses"
          loading="lazy"
        />
      </slot>
    </div>

    <!-- 卡片内容 -->
    <main v-if="$slots.default" :class="bodyClasses">
      <slot />
    </main>

    <!-- 卡片页脚 -->
    <footer v-if="$slots.footer" :class="footerClasses">
      <slot name="footer" />
    </footer>
  </div>
</template>

<script setup lang="ts">
interface CardProps {
  // 卡片标题
  title?: string
  // 卡片副标题
  subtitle?: string
  // 图片地址
  image?: string
  // 图片替代文本
  imageAlt?: string
  // 卡片变体
  variant?: 'default' | 'bordered' | 'shadow' | 'elevated' | 'flat'
  // 是否可悬停
  hoverable?: boolean
  // 是否可点击
  clickable?: boolean
  // 圆角大小
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
  // 内边距大小
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  // 是否分割头部
  dividedHeader?: boolean
  // 是否分割页脚
  dividedFooter?: boolean
}

interface CardEmits {
  (e: 'click', event: MouseEvent): void
}

const props = withDefaults(defineProps<CardProps>(), {
  variant: 'default',
  hoverable: false,
  clickable: false,
  rounded: 'md',
  padding: 'md',
  dividedHeader: false,
  dividedFooter: false,
})

const emit = defineEmits<CardEmits>()

// 基础样式类
const baseClasses = computed(() => [
  'bg-white dark:bg-gray-800',
  'overflow-hidden',
  'transition-all duration-200'
])

// 变体样式
const variantClasses = computed(() => {
  const variants = {
    default: '',
    bordered: 'border border-gray-200 dark:border-gray-700',
    shadow: 'shadow-sm',
    elevated: 'shadow-md',
    flat: 'border border-gray-100 dark:border-gray-800'
  }
  return variants[props.variant]
})

// 圆角样式
const roundedClasses = computed(() => {
  const roundedMap = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full'
  }
  return roundedMap[props.rounded]
})

// 悬停和点击样式
const interactiveClasses = computed(() => {
  const classes: string[] = []
  
  if (props.hoverable) {
    classes.push('hover:shadow-lg hover:-translate-y-0.5')
  }
  
  if (props.clickable) {
    classes.push('cursor-pointer hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2')
  }
  
  return classes.join(' ')
})

// 卡片综合样式
const cardClasses = computed(() => [
  ...baseClasses.value,
  variantClasses.value,
  roundedClasses.value,
  interactiveClasses.value
].filter(Boolean).join(' '))

// 内边距样式
const paddingClasses = computed(() => {
  const paddingMap = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8'
  }
  return paddingMap[props.padding]
})

// 头部样式
const headerClasses = computed(() => {
  const classes = ['flex items-start justify-between']
  
  if (props.padding !== 'none') {
    classes.push(paddingClasses.value)
  }
  
  if (props.dividedHeader) {
    classes.push('border-b border-gray-200 dark:border-gray-700')
  }
  
  return classes.join(' ')
})

// 标题样式
const titleClasses = computed(() => [
  'text-lg font-semibold text-gray-900 dark:text-white',
  'leading-6'
].join(' '))

// 副标题样式
const subtitleClasses = computed(() => [
  'mt-1 text-sm text-gray-600 dark:text-gray-400',
  'leading-5'
].join(' '))

// 图片容器样式
const imageWrapperClasses = computed(() => {
  return 'overflow-hidden'
})

// 图片样式
const imageClasses = computed(() => [
  'w-full h-auto object-cover'
].join(' '))

// 内容区域样式
const bodyClasses = computed(() => {
  const classes: string[] = []
  
  if (props.padding !== 'none') {
    classes.push(paddingClasses.value)
  }
  
  return classes.join(' ')
})

// 页脚样式
const footerClasses = computed(() => {
  const classes: string[] = []
  
  if (props.padding !== 'none') {
    classes.push(paddingClasses.value)
  }
  
  if (props.dividedFooter) {
    classes.push('border-t border-gray-200 dark:border-gray-700')
  }
  
  return classes.join(' ')
})

// 点击事件处理
const handleClick = (event: MouseEvent) => {
  if (props.clickable) {
    emit('click', event)
  }
}

// 将点击事件绑定到根元素
const cardRef = ref<HTMLElement>()
onMounted(() => {
  if (props.clickable && cardRef.value) {
    cardRef.value.addEventListener('click', handleClick)
  }
})

onUnmounted(() => {
  if (props.clickable && cardRef.value) {
    cardRef.value.removeEventListener('click', handleClick)
  }
})
</script>
