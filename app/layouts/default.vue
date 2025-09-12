<template>
  <div class="min-h-screen flex flex-col">
    <!-- 头部导航 -->
    <Header />
    
    <!-- 主要内容 -->
    <main class="flex-1">
      <slot />
    </main>
    
    <!-- 页脚 -->
    <Footer />
    
    <!-- 全局UI组件 -->
    <NotificationToast />
    <BackToTop />
    <GlobalLoading />
  </div>
</template>

<script setup lang="ts">
// 默认布局，包含头部和页脚
import NotificationToast from '~/components/ui/NotificationToast.vue'
import BackToTop from '~/components/ui/BackToTop.vue'
import GlobalLoading from '~/components/ui/GlobalLoading.vue'
</script>
