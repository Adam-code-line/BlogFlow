<template>
  <Teleport to="body">
    <Transition name="fade">
      <button
        v-if="uiStore.shouldShowBackToTop"
        @click="uiStore.scrollToTop"
        class="fixed bottom-8 right-8 z-40 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="返回顶部"
      >
        <Icon name="heroicons:arrow-up" class="h-5 w-5" />
      </button>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useUIStore } from '~/stores/ui'

const uiStore = useUIStore()
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>