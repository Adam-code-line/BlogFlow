<template>
  <div :class="cardClasses" @click="handleClick">
    <!-- 文章封面图 -->
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
  'transition-all duration-300 ease-in-out',
  'group'
])

// 变体样式
const variantClasses = computed(() => {
  const variants = {
    default: 'border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300',
    bordered: 'border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors duration-300',
    shadow: 'shadow-md hover:shadow-lg transition-shadow duration-300',
    elevated: 'shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300',
    flat: 'border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300'
  }
  return variants[props.variant]
})

// 圆角样式
const roundedClasses = computed(() => {
  const roundedMap = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    xl: 'rounded-2xl',
    full: 'rounded-full'
  }
  return roundedMap[props.rounded]
})

// 悬停和点击样式
const interactiveClasses = computed(() => {
  const classes: string[] = []
  
  if (props.hoverable) {
    classes.push('hover:shadow-xl hover:-translate-y-1 hover:scale-105')
  }
  
  if (props.clickable) {
    classes.push('cursor-pointer hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-95')
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
  'text-lg font-bold text-gray-900 dark:text-white',
  'leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200'
].join(' '))

// 副标题样式
const subtitleClasses = computed(() => [
  'mt-1 text-sm text-gray-600 dark:text-gray-400',
  'leading-relaxed'
].join(' '))

// 图片容器样式
const imageWrapperClasses = computed(() => {
  return 'overflow-hidden relative group-hover:scale-105 transition-transform duration-300'
})

// 图片样式
const imageClasses = computed(() => [
  'w-full h-auto object-cover transition-transform duration-300 group-hover:scale-110'
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
</script>

<style scoped>
/* 卡片悬停效果优化 */
.group {
  transform-origin: center;
}

/* 确保图片不会溢出 */
.overflow-hidden {
  overflow: hidden;
}

/* 优化动画性能 */
@media (prefers-reduced-motion: no-preference) {
  .transition-all {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .transition-transform {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .transition-colors {
    transition: color 0.2s ease-in-out;
  }
}

/* 移除移动设备上的点击高亮 */
div[role="button"], 
.cursor-pointer {
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

/* 焦点样式优化 */
.focus\:outline-none:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

/* 暗色模式下的边框优化 */
@media (prefers-color-scheme: dark) {
  .border-gray-200 {
    border-color: rgb(55 65 81);
  }
}
</style>
