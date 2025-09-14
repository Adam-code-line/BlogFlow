<!--
  简单的操作菜单组件
  替代可能有问题的UDropdown组件
-->
<template>
  <div class="relative" ref="menuRef">
    <!-- 触发按钮 -->
    <button
      @click="toggleMenu"
      class="inline-flex items-center justify-center h-8 w-8 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      :class="{ 'bg-gray-100 dark:bg-gray-700': isOpen }"
    >
      <Icon name="i-heroicons-ellipsis-horizontal" class="h-5 w-5" />
    </button>

    <!-- 下拉菜单 -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 z-50 mt-2 w-48 origin-top-right bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      >
        <div class="py-1">
          <template v-for="(group, groupIndex) in actions" :key="groupIndex">
            <!-- 分组间的分隔线 -->
            <div v-if="groupIndex > 0" class="border-t border-gray-100 dark:border-gray-700"></div>
            
            <!-- 菜单项 -->
            <button
              v-for="action in group"
              :key="action.label"
              @click="handleAction(action)"
              class="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              :class="{
                'text-red-600 dark:text-red-400': action.label === '删除'
              }"
            >
              <Icon v-if="action.icon" :name="action.icon" class="mr-3 h-4 w-4" />
              {{ action.label }}
            </button>
          </template>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
interface ActionItem {
  label: string
  icon?: string
  click: () => void
}

interface Props {
  actions: ActionItem[][]
}

const props = defineProps<Props>()

const isOpen = ref(false)
const menuRef = ref<HTMLElement>()

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const handleAction = (action: ActionItem) => {
  isOpen.value = false
  action.click()
}

// 点击外部关闭菜单
const closeMenu = (event: Event) => {
  if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

// 监听点击事件
onMounted(() => {
  document.addEventListener('click', closeMenu)
})

onUnmounted(() => {
  document.removeEventListener('click', closeMenu)
})

// ESC键关闭菜单
onKeyStroke('Escape', () => {
  isOpen.value = false
})
</script>