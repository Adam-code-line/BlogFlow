<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        :class="overlayClasses"
        @click="handleOverlayClick"
      >
        <div
          :class="containerClasses"
          @click.stop
        >
          <Transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div v-if="modelValue" :class="modalClasses">
              <!-- 模态框头部 -->
              <header v-if="$slots.header || title || showClose" :class="headerClasses">
                <div class="flex-1">
                  <slot name="header">
                    <h3 v-if="title" :class="titleClasses">{{ title }}</h3>
                    <p v-if="subtitle" :class="subtitleClasses">{{ subtitle }}</p>
                  </slot>
                </div>
                
                <!-- 关闭按钮 -->
                <button
                  v-if="showClose"
                  type="button"
                  :class="closeButtonClasses"
                  @click="handleClose"
                >
                  <Icon name="heroicons:x-mark" class="w-5 h-5" />
                  <span class="sr-only">关闭</span>
                </button>
              </header>

              <!-- 模态框内容 -->
              <main v-if="$slots.default" :class="bodyClasses">
                <slot />
              </main>

              <!-- 模态框页脚 -->
              <footer v-if="$slots.footer" :class="footerClasses">
                <slot name="footer" />
              </footer>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface ModalProps {
  // 控制模态框显示/隐藏
  modelValue: boolean
  // 模态框标题
  title?: string
  // 模态框副标题
  subtitle?: string
  // 模态框尺寸
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  // 是否显示关闭按钮
  showClose?: boolean
  // 是否可以通过点击遮罩关闭
  closeOnOverlay?: boolean
  // 是否可以通过 ESC 键关闭
  closeOnEscape?: boolean
  // 是否阻止滚动
  preventScroll?: boolean
  // 模态框位置
  position?: 'center' | 'top' | 'bottom'
  // 是否全屏显示
  fullscreen?: boolean
  // 内边距大小
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  // 是否分割头部
  dividedHeader?: boolean
  // 是否分割页脚
  dividedFooter?: boolean
}

interface ModalEmits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
  (e: 'open'): void
  (e: 'escape'): void
}

const props = withDefaults(defineProps<ModalProps>(), {
  size: 'md',
  showClose: true,
  closeOnOverlay: true,
  closeOnEscape: true,
  preventScroll: true,
  position: 'center',
  fullscreen: false,
  padding: 'md',
  dividedHeader: true,
  dividedFooter: true,
})

const emit = defineEmits<ModalEmits>()

// 遮罩层样式
const overlayClasses = computed(() => [
  'fixed inset-0 z-50',
  'bg-black bg-opacity-50 backdrop-blur-sm',
  'flex items-center justify-center',
  positionClasses.value
].join(' '))

// 位置样式
const positionClasses = computed(() => {
  const positions = {
    center: 'items-center justify-center',
    top: 'items-start justify-center pt-16',
    bottom: 'items-end justify-center pb-16'
  }
  return positions[props.position]
})

// 容器样式
const containerClasses = computed(() => [
  'w-full max-h-full overflow-auto',
  'flex items-center justify-center',
  'p-4'
].join(' '))

// 模态框尺寸样式
const sizeClasses = computed(() => {
  if (props.fullscreen) {
    return 'w-full h-full max-w-none max-h-none m-0'
  }
  
  const sizes = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full'
  }
  return `w-full ${sizes[props.size]}`
})

// 模态框样式
const modalClasses = computed(() => [
  'bg-white dark:bg-gray-800',
  'rounded-lg shadow-xl',
  'overflow-hidden',
  sizeClasses.value
].join(' '))

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

// 关闭按钮样式
const closeButtonClasses = computed(() => [
  'ml-4 p-1 rounded-md',
  'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300',
  'hover:bg-gray-100 dark:hover:bg-gray-700',
  'focus:outline-none focus:ring-2 focus:ring-blue-500',
  'transition-colors duration-200'
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

// 关闭模态框
const handleClose = () => {
  emit('update:modelValue', false)
  emit('close')
}

// 遮罩层点击事件
const handleOverlayClick = () => {
  if (props.closeOnOverlay) {
    handleClose()
  }
}

// ESC 键事件处理
const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.closeOnEscape && props.modelValue) {
    emit('escape')
    handleClose()
  }
}

// 监听 modelValue 变化
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    emit('open')
    
    // 阻止页面滚动
    if (props.preventScroll) {
      document.body.style.overflow = 'hidden'
    }
  } else {
    // 恢复页面滚动
    if (props.preventScroll) {
      document.body.style.overflow = ''
    }
  }
})

// 生命周期
onMounted(() => {
  // 添加 ESC 键监听
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  // 移除 ESC 键监听
  document.removeEventListener('keydown', handleEscape)
  
  // 确保恢复页面滚动
  if (props.preventScroll) {
    document.body.style.overflow = ''
  }
})
</script>
