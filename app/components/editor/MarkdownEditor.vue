<template>
  <div class="editor-container border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
    <!-- 工具栏 -->
    <div class="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-3">
      <div class="flex items-center space-x-2">
        <!-- 模式切换 -->
        <div class="flex items-center bg-white dark:bg-gray-700 rounded-lg p-1">
          <button
            @click="mode = 'edit'"
            :class="[
              'px-3 py-1 text-sm rounded-md transition-colors',
              mode === 'edit'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
            ]"
          >
            编辑
          </button>
          <button
            @click="mode = 'preview'"
            :class="[
              'px-3 py-1 text-sm rounded-md transition-colors',
              mode === 'preview'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
            ]"
          >
            预览
          </button>
          <button
            @click="mode = 'split'"
            :class="[
              'px-3 py-1 text-sm rounded-md transition-colors',
              mode === 'split'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
            ]"
          >
            分屏
          </button>
        </div>

        <div class="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>

        <!-- Markdown 工具按钮 -->
        <div class="flex items-center space-x-1">
          <button
            v-for="tool in markdownTools"
            :key="tool.name"
            @click="insertMarkdown(tool)"
            :title="tool.title"
            class="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
          >
            <Icon :name="tool.icon" class="h-4 w-4" />
          </button>
        </div>

        <div class="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>

        <!-- 实用工具 -->
        <div class="flex items-center space-x-1">
          <button
            @click="uploadImage"
            title="上传图片"
            class="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
          >
            <Icon name="i-heroicons-photo" class="h-4 w-4" />
          </button>
          <button
            @click="insertTable"
            title="插入表格"
            class="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
          >
            <Icon name="i-heroicons-table-cells" class="h-4 w-4" />
          </button>
          <button
            @click="toggleFullscreen"
            title="全屏模式"
            class="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
          >
            <Icon :name="isFullscreen ? 'i-heroicons-arrows-pointing-in' : 'i-heroicons-arrows-pointing-out'" class="h-4 w-4" />
          </button>
        </div>

        <!-- 统计信息 -->
        <div class="ml-auto text-sm text-gray-500 dark:text-gray-400">
          {{ wordCount }} 字 | {{ lineCount }} 行
        </div>
      </div>
    </div>

    <!-- 编辑器内容区域 -->
    <div 
      :class="[
        'editor-content',
        isFullscreen ? 'fixed inset-0 z-50 bg-white dark:bg-gray-900' : 'relative',
        mode === 'split' ? 'grid grid-cols-2' : 'block'
      ]"
      :style="{ height: isFullscreen ? '100vh' : height }"
    >
      <!-- 编辑区域 -->
      <div
        v-show="mode === 'edit' || mode === 'split'"
        class="relative"
        :class="mode === 'split' ? 'border-r border-gray-200 dark:border-gray-700' : ''"
      >
        <textarea
          ref="textareaRef"
          v-model="content"
          class="w-full h-full p-4 font-mono text-sm bg-transparent border-none outline-none resize-none text-gray-900 dark:text-gray-100"
          :placeholder="placeholder"
          @input="handleInput"
          @keydown="handleKeydown"
          @scroll="syncScroll"
        ></textarea>
        
        <!-- 行号 -->
        <div
          v-if="showLineNumbers"
          class="absolute left-0 top-0 w-12 h-full bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div class="p-4 font-mono text-sm text-gray-400 select-none">
            <div
              v-for="line in lineCount"
              :key="line"
              class="leading-6"
            >
              {{ line }}
            </div>
          </div>
        </div>
      </div>

      <!-- 预览区域 -->
      <div
        v-show="mode === 'preview' || mode === 'split'"
        class="overflow-auto bg-white dark:bg-gray-900"
      >
        <div class="p-4 prose dark:prose-invert max-w-none">
          <div v-html="previewHtml"></div>
        </div>
      </div>
    </div>

    <!-- 状态栏 -->
    <div class="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
      <div>
        Markdown 编辑器 | 光标位置: {{ cursorPosition.line }}:{{ cursorPosition.column }}
      </div>
      <div class="flex items-center space-x-4">
        <span>编码: UTF-8</span>
        <span>{{ mode === 'edit' ? 'Markdown' : 'Preview' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { marked } from 'marked'

interface Props {
  modelValue: string
  height?: string
  placeholder?: string
  showLineNumbers?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  height: '500px',
  placeholder: '开始编写您的 Markdown 内容...',
  showLineNumbers: true
})

const emit = defineEmits<Emits>()

// 响应式数据
const mode = ref<'edit' | 'preview' | 'split'>('edit')
const isFullscreen = ref(false)
const textareaRef = ref<HTMLTextAreaElement>()
const content = ref(props.modelValue)
const cursorPosition = ref({ line: 1, column: 1 })

// Markdown 工具配置
const markdownTools = [
  { name: 'bold', title: '粗体', icon: 'i-heroicons-bold', prefix: '**', suffix: '**' },
  { name: 'italic', title: '斜体', icon: 'i-heroicons-italic', prefix: '*', suffix: '*' },
  { name: 'strikethrough', title: '删除线', icon: 'i-heroicons-strikethrough', prefix: '~~', suffix: '~~' },
  { name: 'code', title: '行内代码', icon: 'i-heroicons-code-bracket', prefix: '`', suffix: '`' },
  { name: 'link', title: '链接', icon: 'i-heroicons-link', prefix: '[', suffix: '](url)' },
  { name: 'image', title: '图片', icon: 'i-heroicons-photo', prefix: '![', suffix: '](url)' },
  { name: 'quote', title: '引用', icon: 'i-heroicons-chat-bubble-bottom-center-text', prefix: '> ', suffix: '' },
  { name: 'list', title: '无序列表', icon: 'i-heroicons-list-bullet', prefix: '- ', suffix: '' },
  { name: 'ordered-list', title: '有序列表', icon: 'i-heroicons-numbered-list', prefix: '1. ', suffix: '' },
  { name: 'heading', title: '标题', icon: 'i-heroicons-hashtag', prefix: '# ', suffix: '' }
]

// 计算属性
const wordCount = computed(() => {
  return content.value.replace(/\s+/g, '').length
})

const lineCount = computed(() => {
  return content.value.split('\n').length
})

const previewHtml = computed(() => {
  // 使用 marked 库解析 Markdown (如果可用)
  if (process.client && typeof marked !== 'undefined') {
    try {
      return marked.parse(content.value)
    } catch (error) {
      console.error('Markdown parsing error:', error)
    }
  }
  
  // 回退到简单的 HTML 转换
  return content.value
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>')
    .replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>')
    .replace(/^\- (.*$)/gm, '<li>$1</li>')
    .replace(/^(\d+)\. (.*$)/gm, '<li>$1. $2</li>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
})

// 方法
const handleInput = () => {
  emit('update:modelValue', content.value)
  emit('change', content.value)
  updateCursorPosition()
}

const handleKeydown = (event: KeyboardEvent) => {
  // Tab 键处理
  if (event.key === 'Tab') {
    event.preventDefault()
    insertAtCursor('  ')
  }
  
  // Ctrl+B 粗体
  if (event.ctrlKey && event.key === 'b') {
    event.preventDefault()
    const boldTool = markdownTools.find(tool => tool.name === 'bold')
    if (boldTool) insertMarkdown(boldTool)
  }
  
  // Ctrl+I 斜体
  if (event.ctrlKey && event.key === 'i') {
    event.preventDefault()
    const italicTool = markdownTools.find(tool => tool.name === 'italic')
    if (italicTool) insertMarkdown(italicTool)
  }
}

const insertAtCursor = (text: string) => {
  const textarea = textareaRef.value
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const value = content.value

  content.value = value.substring(0, start) + text + value.substring(end)
  
  nextTick(() => {
    textarea.focus()
    textarea.setSelectionRange(start + text.length, start + text.length)
  })
}

const insertMarkdown = (tool: typeof markdownTools[0]) => {
  const textarea = textareaRef.value
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = content.value.substring(start, end)
  
  let insertText = ''
  
  if (tool.name === 'heading') {
    insertText = tool.prefix + (selectedText || '标题文本')
  } else if (tool.name === 'quote' || tool.name === 'list' || tool.name === 'ordered-list') {
    insertText = tool.prefix + (selectedText || '列表项')
  } else {
    insertText = tool.prefix + (selectedText || '文本') + tool.suffix
  }
  
  content.value = content.value.substring(0, start) + insertText + content.value.substring(end)
  
  nextTick(() => {
    textarea.focus()
    const newPosition = start + tool.prefix.length + (selectedText ? selectedText.length : 2)
    textarea.setSelectionRange(newPosition, newPosition)
  })
}

const insertTable = () => {
  const tableMarkdown = `
| 列1 | 列2 | 列3 |
|-----|-----|-----|
| 内容1 | 内容2 | 内容3 |
| 内容4 | 内容5 | 内容6 |
`
  insertAtCursor(tableMarkdown)
}

const uploadImage = async () => {
  // 创建文件输入框
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = async (event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file) {
      try {
        // 这里可以实现真实的图片上传逻辑
        // 现在使用createObjectURL作为占位
        const imageUrl = URL.createObjectURL(file)
        insertAtCursor(`![${file.name}](${imageUrl})`)
        
        // 提示用户
        console.log('图片已插入，实际项目中应该上传到服务器')
      } catch (error) {
        console.error('图片上传失败:', error)
        insertAtCursor('![图片描述](图片URL)')
      }
    }
  }
  input.click()
}

const updateCursorPosition = () => {
  const textarea = textareaRef.value
  if (!textarea) return

  const start = textarea.selectionStart
  const textBeforeCursor = content.value.substring(0, start)
  const lines = textBeforeCursor.split('\n')
  
  cursorPosition.value = {
    line: lines.length,
    column: (lines[lines.length - 1]?.length ?? 0) + 1
  }
}

const syncScroll = () => {
  // 同步滚动（分屏模式下）
  if (mode.value === 'split') {
    // 这里可以实现预览区域的同步滚动
  }
}

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
  if (isFullscreen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

// 监听器
watch(() => props.modelValue, (newValue) => {
  if (newValue !== content.value) {
    content.value = newValue
  }
})

// 组件卸载时清理
onBeforeUnmount(() => {
  if (isFullscreen.value) {
    document.body.style.overflow = ''
  }
})

// 暴露组件方法
defineExpose({
  focus: () => textareaRef.value?.focus(),
  insertText: insertAtCursor,
  getContent: () => content.value,
  setContent: (text: string) => { content.value = text }
})
</script>

<style scoped>
.editor-container {
  font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
}

.prose {
  font-family: 'Inter', system-ui, sans-serif;
}

.prose h1 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

.prose h2 {
  font-size: 1.25rem;
  font-weight: bold;
  margin-top: 1.25rem;
  margin-bottom: 0.75rem;
}

.prose h3 {
  font-size: 1.125rem;
  font-weight: bold;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

.prose p {
  margin-bottom: 1rem;
}

.prose code {
  background-color: rgb(243 244 246);
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

.dark .prose code {
  background-color: rgb(31 41 55);
}

.prose blockquote {
  border-left: 4px solid rgb(209 213 219);
  padding-left: 1rem;
  font-style: italic;
}

.dark .prose blockquote {
  border-left-color: rgb(75 85 99);
}

.prose ul, .prose ol {
  margin-left: 1.5rem;
  margin-bottom: 1rem;
}

.prose li {
  margin-bottom: 0.25rem;
}

.prose a {
  color: rgb(37 99 235);
  text-decoration: underline;
}

.dark .prose a {
  color: rgb(96 165 250);
}

.prose img {
  max-width: 100%;
  border-radius: 0.5rem;
}
</style>