<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
import { useUIStore } from '~/stores/ui'

// 初始化 UI store
const uiStore = useUIStore()

// 页面挂载时初始化
onMounted(async () => {
  await uiStore.init()
})
</script>