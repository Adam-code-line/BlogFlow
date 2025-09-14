<!--
统计数据显示组件
提供统一的统计数据显示样式和格式
-->

<template>
  <div class="statistics-container">
    <!-- 首页样式统计 - 改进响应式布局 -->
    <div v-if="variant === 'homepage'" class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
      <div 
        v-for="stat in displayStats" 
        :key="stat.key"
        class="text-center p-4 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/30 dark:border-gray-700/30 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300"
      >
        <div v-if="stat.icon && props.showIcons" class="mb-2 flex justify-center">
          <Icon :name="stat.icon" class="w-6 h-6 sm:w-8 sm:h-8 text-gray-600 dark:text-gray-400" />
        </div>
        <div :class="['text-2xl sm:text-3xl md:text-3xl font-bold mb-1 sm:mb-2', stat.color || 'text-gray-900 dark:text-white']">
          {{ stat.formatValue }}
        </div>
        <div class="text-sm sm:text-base text-gray-600 dark:text-gray-300">{{ stat.label }}</div>
      </div>
    </div>

    <!-- 侧边栏样式统计 - 优化小屏幕显示 -->
    <div v-else-if="variant === 'sidebar'" class="grid grid-cols-3 gap-2 sm:gap-4">
      <div 
        v-for="stat in displayStats" 
        :key="stat.key"
        class="text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
      >
        <div v-if="stat.icon && props.showIcons" class="mb-1 flex justify-center">
          <Icon :name="stat.icon" class="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </div>
        <div class="text-base sm:text-lg font-bold text-gray-900 dark:text-white">{{ stat.formatValue }}</div>
        <div class="text-xs text-gray-500 dark:text-gray-400 leading-tight">{{ stat.label }}</div>
      </div>
    </div>

    <!-- 卡片样式统计 - 响应式网格 -->
    <div v-else-if="variant === 'card'" class="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">统计概览</h3>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div 
          v-for="stat in displayStats" 
          :key="stat.key"
          class="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200"
        >
          <div class="flex items-center justify-center mb-2">
            <Icon v-if="stat.icon && props.showIcons" :name="stat.icon" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </div>
          <div class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{{ stat.formatValue }}</div>
          <div class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{{ stat.label }}</div>
        </div>
      </div>
    </div>

    <!-- 简洁列表样式 - 移动端友好 -->
    <div v-else-if="variant === 'list'" class="space-y-2 sm:space-y-3">
      <div 
        v-for="stat in displayStats" 
        :key="stat.key"
        class="flex items-center justify-between py-2 sm:py-3 px-3 rounded-lg bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-all duration-200"
      >
        <div class="flex items-center space-x-2 sm:space-x-3">
          <Icon v-if="stat.icon && props.showIcons" :name="stat.icon" class="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
          <span class="text-sm sm:text-base text-gray-700 dark:text-gray-300">{{ stat.label }}</span>
        </div>
        <span class="text-sm sm:text-base font-medium text-gray-900 dark:text-white">{{ stat.formatValue }}</span>
      </div>
    </div>

    <!-- 默认样式 - 灵活布局 -->
    <div v-else class="flex flex-wrap gap-2 sm:gap-4">
      <div 
        v-for="stat in displayStats" 
        :key="stat.key"
        class="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
      >
        <Icon v-if="stat.icon && props.showIcons" :name="stat.icon" class="w-4 h-4 text-gray-600 dark:text-gray-400 flex-shrink-0" />
        <span class="text-sm text-gray-700 dark:text-gray-300">{{ stat.label }}:</span>
        <span class="text-sm font-medium text-gray-900 dark:text-white">{{ stat.formatValue }}</span>
      </div>
    </div>

    <!-- 加载状态 - 响应式骨架屏 -->
    <div v-if="loading" class="animate-pulse">
      <div v-if="variant === 'homepage'" class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
        <div v-for="i in 4" :key="i" class="text-center p-4 rounded-lg bg-gray-200 dark:bg-gray-700">
          <div class="h-6 sm:h-8 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
          <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16 mx-auto"></div>
        </div>
      </div>
      <div v-else-if="variant === 'sidebar'" class="grid grid-cols-3 gap-2 sm:gap-4">
        <div v-for="i in 3" :key="i" class="text-center p-2 rounded-lg bg-gray-200 dark:bg-gray-700">
          <div class="h-5 sm:h-6 bg-gray-300 dark:bg-gray-600 rounded mb-1"></div>
          <div class="h-3 bg-gray-300 dark:bg-gray-600 rounded w-8 mx-auto"></div>
        </div>
      </div>
      <div v-else class="flex flex-wrap gap-2 sm:gap-4">
        <div v-for="i in 3" :key="i" class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStatisticsStore } from '~/stores/statistics'

interface Props {
  variant?: 'homepage' | 'sidebar' | 'card' | 'list' | 'default'
  fields?: string[] // 指定要显示的字段
  showIcons?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  fields: () => [],
  showIcons: true
})

const statisticsStore = useStatisticsStore()

// 根据变体类型决定显示哪些统计数据
const displayStats = computed(() => {
  if (props.variant === 'homepage') {
    return statisticsStore.homeStatistics
  }
  
  if (props.variant === 'sidebar') {
    return [
      {
        key: 'totalPosts',
        label: '文章',
        value: statisticsStore.statistics.totalPosts,
        formatValue: statisticsStore.formatNumber(statisticsStore.statistics.totalPosts),
        icon: props.showIcons ? 'heroicons:document-text' : undefined,
        color: 'text-blue-600 dark:text-blue-400'
      },
      {
        key: 'totalViews',
        label: '浏览',
        value: statisticsStore.statistics.totalViews,
        formatValue: statisticsStore.formatNumber(statisticsStore.statistics.totalViews),
        icon: props.showIcons ? 'heroicons:eye' : undefined,
        color: 'text-orange-600 dark:text-orange-400'
      },
      {
        key: 'totalLikes',
        label: '点赞',
        value: statisticsStore.statistics.totalLikes,
        formatValue: statisticsStore.formatNumber(statisticsStore.statistics.totalLikes),
        icon: props.showIcons ? 'heroicons:heart' : undefined,
        color: 'text-red-600 dark:text-red-400'
      }
    ]
  }

  // 如果指定了特定字段，只显示这些字段
  if (props.fields.length > 0) {
    const allStats = [
      {
        key: 'totalPosts',
        label: '文章',
        value: statisticsStore.statistics.totalPosts,
        formatValue: statisticsStore.formatNumber(statisticsStore.statistics.totalPosts),
        icon: 'heroicons:document-text',
        color: 'text-blue-600 dark:text-blue-400'
      },
      {
        key: 'totalProjects',
        label: '项目',
        value: statisticsStore.statistics.totalProjects,
        formatValue: statisticsStore.formatNumber(statisticsStore.statistics.totalProjects),
        icon: 'heroicons:code-bracket',
        color: 'text-green-600 dark:text-green-400'
      },
      {
        key: 'totalViews',
        label: '浏览',
        value: statisticsStore.statistics.totalViews,
        formatValue: statisticsStore.formatNumber(statisticsStore.statistics.totalViews),
        icon: 'heroicons:eye',
        color: 'text-orange-600 dark:text-orange-400'
      },
      {
        key: 'totalLikes',
        label: '点赞',
        value: statisticsStore.statistics.totalLikes,
        formatValue: statisticsStore.formatNumber(statisticsStore.statistics.totalLikes),
        icon: 'heroicons:heart',
        color: 'text-red-600 dark:text-red-400'
      },
      {
        key: 'totalCategories',
        label: '分类',
        value: statisticsStore.statistics.totalCategories,
        formatValue: statisticsStore.formatNumber(statisticsStore.statistics.totalCategories),
        icon: 'heroicons:tag',
        color: 'text-purple-600 dark:text-purple-400'
      },
      {
        key: 'totalTags',
        label: '标签',
        value: statisticsStore.statistics.totalTags,
        formatValue: statisticsStore.formatNumber(statisticsStore.statistics.totalTags),
        icon: 'heroicons:hashtag',
        color: 'text-indigo-600 dark:text-indigo-400'
      }
    ]
    
    return allStats.filter(stat => props.fields.includes(stat.key))
  }

  // 默认显示所有主要统计
  return statisticsStore.homeStatistics
})

const loading = computed(() => statisticsStore.loading)

// 组件挂载时获取数据
onMounted(() => {
  if (statisticsStore.isDataStale) {
    statisticsStore.fetchStatistics()
  }
})
</script>

<style scoped>
.statistics-container {
  width: 100%;
}

/* 动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.statistics-container > div {
  animation: fadeInUp 0.5s ease-out;
}
</style>