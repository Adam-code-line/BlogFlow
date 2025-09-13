<template>
  <div class="cherry-editor-wrapper">
    <div 
      ref="cherryEditorRef" 
      :id="editorId" 
      class="cherry-editor enhanced-editor" 
      :style="{ height: height }"
    ></div>
    
    <!-- 使用封装好的加载组件 -->
    <Loading
      v-if="loading"
      text="正在加载编辑器..."
      description="请稍候，编辑器资源加载中"
      :overlay="true"
      size="lg"
      color="primary"
    />
    
    <!-- 使用封装好的错误组件 -->
    <ErrorMessage
      v-if="error"
      title="编辑器加载失败"
      message="无法加载Cherry Markdown编辑器"
      description="请检查网络连接或尝试刷新页面"
      variant="error"
      size="md"
      :closable="false"
      retry-text="重试加载"
      @retry="retryLoad"
    />
  </div>
</template>

<script setup lang="ts">
import { sleep, retry } from '~/composables/useUtils'
import Loading from '~/components/common/Loading.vue'
import ErrorMessage from '~/components/common/ErrorMessage.vue'

interface Props {
  modelValue: string
  height?: string
  placeholder?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  height: '500px',
  placeholder: '开始编写您的 Markdown 内容...'
})

const emit = defineEmits<Emits>()

// 响应式数据
const cherryEditorRef = ref<HTMLElement>()
const editorId = 'cherry-editor-' + Date.now()
const loading = ref(true)
const error = ref(false)
let cherryInstance: any = null
let scriptsLoaded = false

// 动态加载Cherry Markdown的CSS和JS
const loadCherryAssets = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (scriptsLoaded && (window as any).Cherry) {
      resolve(true)
      return
    }

    // 加载CSS
    const cssLink = document.createElement('link')
    cssLink.rel = 'stylesheet'
    cssLink.href = '/assets/cherry-markdown/cherry-markdown.css'
    document.head.appendChild(cssLink)

    // 加载JS
    const script = document.createElement('script')
    script.src = '/assets/cherry-markdown/cherry-markdown.js'
    script.onload = () => {
      scriptsLoaded = true
      resolve(true)
    }
    script.onerror = () => {
      console.error('Failed to load Cherry Markdown script')
      resolve(false)
    }
    document.head.appendChild(script)
  })
}

// 初始化 Cherry 编辑器 - 使用更好的错误处理
const initCherry = async () => {
  if (!cherryEditorRef.value || !process.client) return

  try {
    loading.value = true
    error.value = false
    
    // 等待Cherry资源加载完成
    const loaded = await loadCherryAssets()
    if (!loaded || !(window as any).Cherry) {
      throw new Error('Cherry Markdown not available')
    }

    // 添加延迟以确保DOM准备就绪
    await sleep(100)

    // 创建Cherry实例
    const Cherry = (window as any).Cherry
    cherryInstance = new Cherry({
      id: editorId,
      value: props.modelValue || '',
      editor: {
        defaultModel: 'edit&preview',
        height: props.height
      },
      toolbars: {
        toolbar: [
          'bold', 'italic', 'strikethrough', '|',
          'color', 'header', '|',
          'list', 'panel', 'code', 'table', 'link', 'image', '|',
          'togglePreview', 'fullScreen'
        ],
        bubble: ['bold', 'italic', 'strikethrough', 'sub', 'sup', 'quote'],
        float: ['h1', 'h2', 'h3', '|', 'checklist', 'quote', 'quickTable', 'code']
      },
      callbacks: {
        afterChange: (text: string) => {
          emit('update:modelValue', text)
          emit('change', text)
        }
      }
    })

    loading.value = false
    console.log('Cherry Markdown editor initialized successfully')
  } catch (err) {
    console.error('Cherry Editor initialization failed:', err)
    error.value = true
    loading.value = false
    // 使用延迟后回退到textarea
    await sleep(500)
    if (error.value) {
      fallbackToTextarea()
    }
  }
}

// 回退到简单 textarea
const fallbackToTextarea = () => {
  if (cherryEditorRef.value) {
    cherryEditorRef.value.innerHTML = `
      <textarea 
        class="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none"
        style="height: ${props.height}; min-height: 400px;"
        placeholder="${props.placeholder}"
      >${props.modelValue || ''}</textarea>
    `
    
    const textarea = cherryEditorRef.value.querySelector('textarea') as HTMLTextAreaElement
    if (textarea) {
      textarea.addEventListener('input', (e) => {
        const target = e.target as HTMLTextAreaElement
        emit('update:modelValue', target.value)
        emit('change', target.value)
      })
      
      // 监听外部值变化
      const updateTextarea = (newValue: string) => {
        if (textarea.value !== newValue) {
          textarea.value = newValue
        }
      }
      
      // 初始值设置
      updateTextarea(props.modelValue || '')
      
      // 保存更新函数以供watch使用
      ;(cherryEditorRef.value as any)._updateTextarea = updateTextarea
    }
  }
}

// 监听 modelValue 变化
watch(() => props.modelValue, (newValue) => {
  if (cherryInstance && cherryInstance.setValue && newValue !== cherryInstance.getValue()) {
    cherryInstance.setValue(newValue || '')
  } else if (cherryEditorRef.value && (cherryEditorRef.value as any)._updateTextarea) {
    // 如果是textarea模式，更新textarea的值
    ;(cherryEditorRef.value as any)._updateTextarea(newValue || '')
  }
})

// 暴露方法
const setValue = (text: string) => {
  if (cherryInstance && cherryInstance.setValue) {
    cherryInstance.setValue(text)
  }
}

const getValue = () => {
  return cherryInstance?.getValue() || props.modelValue || ''
}

// 重试加载 - 使用封装的retry函数
const retryLoad = async () => {
  error.value = false
  loading.value = true
  
  try {
    await retry(async () => {
      const loaded = await loadCherryAssets()
      if (!loaded) {
        throw new Error('Failed to load Cherry Markdown assets')
      }
      await initCherry()
    }, 3, 1000) // 重试3次，间隔1秒
  } catch (err) {
    console.error('Failed to load editor after retries:', err)
    error.value = true
    loading.value = false
  }
}

// 组件挂载后初始化
onMounted(() => {
  nextTick(() => {
    initCherry()
  })
})

// 组件卸载时销毁实例
onBeforeUnmount(() => {
  if (cherryInstance && cherryInstance.destroy) {
    cherryInstance.destroy()
  }
})

defineExpose({
  setValue,
  getValue
})
</script>

<style scoped>
.cherry-editor-wrapper {
  position: relative;
  width: 100%;
  border: 1px solid rgb(229 231 235);
  border-radius: 0.5rem;
  overflow: hidden;
  background: white;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
}

.dark .cherry-editor-wrapper {
  border-color: rgb(55 65 81);
  background: rgb(31 41 55);
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.3);
}

.cherry-editor {
  width: 100%;
  min-height: 400px;
}

.enhanced-editor {
  transition: all 0.3s ease;
}

/* Cherry Markdown 的样式调整 */
:deep(.cherry-markdown) {
  border: none;
  border-radius: 0;
}

:deep(.cherry-toolbar) {
  border-bottom: 1px solid rgb(229 231 235);
  background-color: rgb(249 250 251);
  padding: 0.75rem;
}

.dark :deep(.cherry-toolbar) {
  border-bottom-color: rgb(55 65 81);
  background-color: rgb(17 24 39);
}

:deep(.cherry-editor .CodeMirror) {
  background: transparent;
  color: inherit;
  font-size: 14px;
  line-height: 1.6;
  font-family: 'SF Mono', Monaco, 'Inconsolata', 'Roboto Mono', Consolas, 'Courier New', monospace;
}

:deep(.cherry-previewer) {
  background: rgb(249 250 251);
  padding: 1rem;
}

.dark :deep(.cherry-previewer) {
  background: rgb(17 24 39);
  color: rgb(229 231 235);
}

/* 工具栏按钮样式优化 */
:deep(.cherry-toolbar .cherry-toolbar-button) {
  border-radius: 0.375rem;
  padding: 0.375rem 0.5rem;
  margin: 0 0.125rem;
  transition: all 0.2s ease;
}

:deep(.cherry-toolbar .cherry-toolbar-button:hover) {
  background-color: rgb(229 231 235);
}

.dark :deep(.cherry-toolbar .cherry-toolbar-button:hover) {
  background-color: rgb(55 65 81);
}

/* 分割线样式 */
:deep(.cherry-toolbar .cherry-toolbar-separator) {
  margin: 0 0.5rem;
  opacity: 0.5;
}

/* 预览区域代码块样式 */
:deep(.cherry-previewer pre) {
  background-color: rgb(31 41 55);
  color: rgb(229 231 235);
  border-radius: 0.5rem;
  padding: 1rem;
  overflow-x: auto;
}

:deep(.cherry-previewer code) {
  background-color: rgb(229 231 235);
  color: rgb(55 65 81);
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

.dark :deep(.cherry-previewer code) {
  background-color: rgb(55 65 81);
  color: rgb(229 231 235);
}

/* 表格样式 */
:deep(.cherry-previewer table) {
  border-collapse: collapse;
  margin: 1rem 0;
  width: 100%;
}

:deep(.cherry-previewer th),
:deep(.cherry-previewer td) {
  border: 1px solid rgb(229 231 235);
  padding: 0.5rem;
  text-align: left;
}

.dark :deep(.cherry-previewer th),
.dark :deep(.cherry-previewer td) {
  border-color: rgb(55 65 81);
}

:deep(.cherry-previewer th) {
  background-color: rgb(249 250 251);
  font-weight: 600;
}

.dark :deep(.cherry-previewer th) {
  background-color: rgb(31 41 55);
}

/* 引用块样式 */
:deep(.cherry-previewer blockquote) {
  border-left: 4px solid rgb(59 130 246);
  background-color: rgb(239 246 255);
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 0 0.5rem 0.5rem 0;
}

.dark :deep(.cherry-previewer blockquote) {
  background-color: rgb(30 58 138);
  border-left-color: rgb(147 197 253);
}

/* 链接样式 */
:deep(.cherry-previewer a) {
  color: rgb(59 130 246);
  text-decoration: underline;
  transition: color 0.2s ease;
}

:deep(.cherry-previewer a:hover) {
  color: rgb(29 78 216);
}

.dark :deep(.cherry-previewer a) {
  color: rgb(147 197 253);
}

.dark :deep(.cherry-previewer a:hover) {
  color: rgb(191 219 254);
}
</style>