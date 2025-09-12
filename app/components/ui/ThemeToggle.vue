<template>
  <button
    @click="uiStore.toggleTheme"
    :class="[
      'p-2 rounded-lg transition-colors duration-200',
      'hover:bg-gray-100 dark:hover:bg-gray-700',
      'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
    ]"
    :title="`切换到${getNextTheme()}主题`"
  >
    <Icon 
      :name="themeIcon" 
      class="h-5 w-5 text-gray-600 dark:text-gray-400" 
    />
  </button>
</template>

<script setup lang="ts">
import { useUIStore } from '~/stores/ui'

const uiStore = useUIStore()

const themeIcons = {
  light: 'heroicons:sun',
  dark: 'heroicons:moon',
  auto: 'heroicons:computer-desktop'
}

const themeNames = {
  light: '浅色',
  dark: '深色',
  auto: '自动'
}

const themeIcon = computed(() => themeIcons[uiStore.theme])

const getNextTheme = () => {
  const themes = ['light', 'dark', 'auto'] as const
  const currentIndex = themes.indexOf(uiStore.theme)
  const nextIndex = (currentIndex + 1) % themes.length
  const nextTheme = themes[nextIndex] || 'light'
  return themeNames[nextTheme]
}
</script>