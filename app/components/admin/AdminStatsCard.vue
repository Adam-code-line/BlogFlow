<!-- 管理员统计卡片组件 -->
<template>
  <UCard class="bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow duration-200">
    <div class="p-6">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <div 
            :class="[
              'w-12 h-12 rounded-lg flex items-center justify-center',
              iconBackgroundClass
            ]"
          >
            <Icon :name="icon" :class="iconClass" />
          </div>
        </div>
        <div class="ml-4 flex-1">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ title }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ value }}</p>
            </div>
            <div v-if="change" class="flex items-center">
              <Icon 
                :name="changeDirection === 'up' ? 'heroicons:arrow-trending-up' : 'heroicons:arrow-trending-down'" 
                :class="[
                  'w-4 h-4 mr-1',
                  changeDirection === 'up' ? 'text-green-500' : 'text-red-500'
                ]"
              />
              <span 
                :class="[
                  'text-sm font-medium',
                  changeDirection === 'up' ? 'text-green-600' : 'text-red-600'
                ]"
              >
                {{ change }}
              </span>
            </div>
          </div>
          <p v-if="description" class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {{ description }}
          </p>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
interface Props {
  title: string
  value: string | number
  icon: string
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'indigo'
  change?: string
  changeDirection?: 'up' | 'down'
  description?: string
}

const props = withDefaults(defineProps<Props>(), {
  color: 'blue',
  changeDirection: 'up'
})

// 计算图标背景类
const iconBackgroundClass = computed(() => {
  const colorMap = {
    blue: 'bg-blue-100 dark:bg-blue-900/20',
    green: 'bg-green-100 dark:bg-green-900/20',
    purple: 'bg-purple-100 dark:bg-purple-900/20',
    orange: 'bg-orange-100 dark:bg-orange-900/20',
    red: 'bg-red-100 dark:bg-red-900/20',
    indigo: 'bg-indigo-100 dark:bg-indigo-900/20'
  }
  return colorMap[props.color]
})

// 计算图标颜色类
const iconClass = computed(() => {
  const colorMap = {
    blue: 'w-6 h-6 text-blue-600 dark:text-blue-400',
    green: 'w-6 h-6 text-green-600 dark:text-green-400',
    purple: 'w-6 h-6 text-purple-600 dark:text-purple-400',
    orange: 'w-6 h-6 text-orange-600 dark:text-orange-400',
    red: 'w-6 h-6 text-red-600 dark:text-red-400',
    indigo: 'w-6 h-6 text-indigo-600 dark:text-indigo-400'
  }
  return colorMap[props.color]
})
</script>