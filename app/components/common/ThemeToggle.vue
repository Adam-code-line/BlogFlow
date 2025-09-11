<template>
  <div class="flex items-center space-x-2">
    <!-- 主题切换按钮 -->
    <button
      @click="toggleTheme"
      class="relative p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group"
      :title="isDark ? '切换到浅色主题' : '切换到深色主题'"
    >
      <!-- 图标切换动画 -->
      <div class="relative w-5 h-5">
        <Icon 
          name="heroicons:sun" 
          class="absolute inset-0 w-5 h-5 transition-all duration-300"
          :class="isDark ? 'opacity-0 rotate-180' : 'opacity-100 rotate-0'"
        />
        <Icon 
          name="heroicons:moon" 
          class="absolute inset-0 w-5 h-5 transition-all duration-300"
          :class="isDark ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-180'"
        />
      </div>
      
      <!-- 悬停提示 -->
      <div class="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div class="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs px-2 py-1 rounded whitespace-nowrap">
          {{ isDark ? '浅色主题' : '深色主题' }}
        </div>
      </div>
    </button>

    <!-- 代码主题选择器（在博客页面显示） -->
    <div v-if="showCodeThemeSelector && isCodeRelatedPage" class="relative">
      <button
        @click="toggleCodeThemeDropdown"
        class="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
        title="选择代码主题"
      >
        <Icon name="heroicons:code-bracket" class="w-5 h-5" />
      </button>
      
      <!-- 代码主题下拉菜单 -->
      <div 
        v-if="showCodeThemeDropdown"
        class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
        @click.stop
      >
        <div class="p-2">
          <div class="text-xs text-gray-500 dark:text-gray-400 mb-2 px-2">代码主题</div>
          <button
            v-for="option in codeThemeOptions"
            :key="option.value"
            @click="selectCodeTheme(option.value)"
            class="w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
            :class="{
              'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400': selectedCodeTheme === option.value
            }"
          >
            {{ option.label }}
            <Icon 
              v-if="selectedCodeTheme === option.value"
              name="heroicons:check" 
              class="w-4 h-4" 
            />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useColorMode } from '@vueuse/core'
import { useCodeTheme } from '~/composables/useCodeTheme'

// Props
interface Props {
  showCodeThemeSelector?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showCodeThemeSelector: true
})

// 路由信息
const route = useRoute()

// 系统主题切换
const colorMode = useColorMode({
  attribute: 'class',
  modes: {
    light: 'light',
    dark: 'dark'
  }
})

// 代码主题管理
const { 
  currentTheme: currentCodeTheme,
  availableThemes,
  applyTheme: applyCodeTheme,
  getTheme,
  detectSystemTheme
} = useCodeTheme()

// 响应式状态
const isDark = computed(() => colorMode.value === 'dark')
const selectedCodeTheme = ref(currentCodeTheme.value)
const showCodeThemeDropdown = ref(false)

// 判断是否在代码相关页面（博客文章页面）
const isCodeRelatedPage = computed(() => {
  return route.path.startsWith('/blog/')
})

// 代码主题选项
const codeThemeOptions = computed(() => {
  return availableThemes.value.map(themeName => {
    const theme = getTheme(themeName)
    return {
      label: theme?.name || themeName,
      value: themeName
    }
  })
})

// 切换系统主题
const toggleTheme = () => {
  const newMode = colorMode.value === 'dark' ? 'light' : 'dark'
  colorMode.value = newMode
  
  // 同时更新代码主题
  const isDarkMode = newMode === 'dark'
  
  // 如果用户没有手动选择代码主题，则使用默认主题
  const savedCodeTheme = localStorage.getItem('code-theme')
  if (!savedCodeTheme) {
    const defaultCodeTheme = isDarkMode ? 'vscode' : 'github'
    applyCodeTheme(defaultCodeTheme, isDarkMode)
    selectedCodeTheme.value = defaultCodeTheme
  } else {
    // 应用当前选择的主题到新模式
    applyCodeTheme(selectedCodeTheme.value, isDarkMode)
  }
}

// 切换代码主题下拉菜单
const toggleCodeThemeDropdown = () => {
  showCodeThemeDropdown.value = !showCodeThemeDropdown.value
}

// 选择代码主题
const selectCodeTheme = (themeName: string) => {
  selectedCodeTheme.value = themeName
  applyCodeTheme(themeName, isDark.value)
  showCodeThemeDropdown.value = false
}

// 处理点击外部关闭下拉菜单
const handleClickOutside = (event: Event) => {
  const target = event.target as Element
  if (!target.closest('[data-theme-selector]')) {
    showCodeThemeDropdown.value = false
  }
}

// 监听当前代码主题变化
watch(currentCodeTheme, (newTheme) => {
  selectedCodeTheme.value = newTheme
})

// 监听系统主题变化，同步代码主题
watch(isDark, (newIsDark) => {
  // 只有在用户没有手动设置代码主题时才自动切换
  const savedCodeTheme = localStorage.getItem('code-theme')
  if (!savedCodeTheme) {
    const defaultCodeTheme = newIsDark ? 'vscode' : 'github'
    applyCodeTheme(defaultCodeTheme, newIsDark)
  } else {
    // 如果有手动设置的主题，应用到新的模式
    applyCodeTheme(selectedCodeTheme.value, newIsDark)
  }
})

// 初始化
onMounted(() => {
  // 确保代码主题与当前系统主题匹配
  const savedCodeTheme = localStorage.getItem('code-theme')
  if (savedCodeTheme) {
    selectedCodeTheme.value = savedCodeTheme
    applyCodeTheme(savedCodeTheme, isDark.value)
  }
  
  // 添加全局点击监听
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  // 清理事件监听
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* 主题切换动画 */
.theme-toggle-enter-active,
.theme-toggle-leave-active {
  transition: all 0.3s ease;
}

.theme-toggle-enter-from,
.theme-toggle-leave-to {
  opacity: 0;
  transform: rotate(180deg);
}

/* 下拉菜单动画 */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
