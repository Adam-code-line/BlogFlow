<template>
  <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">

    <!-- 页面内容 -->
    <main class="flex-1">
      <div class="max-w-7xl mx-auto px-4 py-8">
        <div class="lg:grid lg:grid-cols-12 lg:gap-8">
          <!-- 主要内容区域 -->
          <div class="lg:col-span-8">
            <slot />
          </div>
          
          <!-- 侧边栏 -->
          <div class="lg:col-span-4 mt-8 lg:mt-0">
            <Sidebar />
          </div>
        </div>
      </div>
    </main>
    
  </div>
</template>

<script setup lang="ts">
// 博客布局专用配置
</script>
