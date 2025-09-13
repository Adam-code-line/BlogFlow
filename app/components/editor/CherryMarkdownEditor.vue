<template>
  <div class="cherry-editor-container">
    <div ref="cherryEditorRef" class="cherry-editor" :style="{ height: height }"></div>
  </div>
</template>

<script setup lang="ts">
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
let cherryInstance: any = null

// 初始化 Cherry 编辑器
const initCherry = async () => {
  if (!cherryEditorRef.value || !process.client) return

  try {
    // 动态导入 Cherry
    const Cherry = await import('cherry-markdown')
    
    // 创建一个ID用于编辑器实例
    const editorId = 'cherry-markdown-' + Date.now()
    
    // 先设置DOM元素的ID
    cherryEditorRef.value.id = editorId
    
    // 简化配置，使用默认设置
    cherryInstance = new Cherry.default({
      id: editorId,
      value: props.modelValue || '',
      callback: {
        afterChange: (text: string) => {
          emit('update:modelValue', text)
          emit('change', text)
        }
      }
    })
  } catch (error) {
    console.error('Cherry Editor initialization failed:', error)
    // 如果 Cherry 加载失败，回退到简单的 textarea
    fallbackToTextarea()
  }
}

// 回退到简单 textarea
const fallbackToTextarea = () => {
  if (cherryEditorRef.value) {
    cherryEditorRef.value.innerHTML = `
      <textarea 
        class="w-full p-4 border-0 resize-none focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
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
  if (cherryInstance) {
    cherryInstance.setValue(text)
  }
}

const getValue = () => {
  return cherryInstance?.getValue() || ''
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
.cherry-editor-container {
  width: 100%;
  border: 1px solid rgb(229 231 235);
  border-radius: 0.5rem;
  overflow: hidden;
}

.dark .cherry-editor-container {
  border-color: rgb(55 65 81);
}

.cherry-editor {
  width: 100%;
}
</style>