<template>
  <div class="admin-stats-card">
    <div class="admin-card-body">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <div :class="[
            'admin-stats-icon',
            `admin-stats-icon-${color}`
          ]">
            <!-- 优先使用 Heroicons，如果失败则使用本地图标 -->
            <Icon 
              v-if="iconAvailable"
              :name="icon" 
              class="h-6 w-6" 
              @error="handleIconError"
            />
            <LocalIcon 
              v-else
              :name="getLocalIconName(icon)"
              :size="24"
            />
          </div>
        </div>
        <div class="ml-5 w-0 flex-1">
          <dl>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
              {{ title }}
            </dt>
            <dd class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ formattedValue }}
            </dd>
          </dl>
        </div>
      </div>
      <div class="mt-4 flex items-center">
        <div :class="[
          'flex items-center text-sm font-medium',
          change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
        ]">
          <Icon 
            v-if="trendIconAvailable"
            :name="change >= 0 ? 'i-heroicons-arrow-trending-up' : 'i-heroicons-arrow-trending-down'"
            class="h-4 w-4 mr-1"
            @error="handleTrendIconError"
          />
          <LocalIcon 
            v-else
            :name="change >= 0 ? 'arrow-trending-up' : 'arrow-trending-down'"
            :size="16"
            class="mr-1"
          />
          {{ Math.abs(change) }}%
        </div>
        <div class="ml-2 text-sm text-gray-500 dark:text-gray-400">
          较上月
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAdminNumber } from '~/composables/useAdminUtils'

// 使用封装的工具函数
const { formatCompactNumber } = useAdminNumber()

interface Props {
  title: string
  value: number
  change: number
  icon: string
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red'
}

const props = withDefaults(defineProps<Props>(), {
  color: 'blue'
})

// 图标可用性状态
const iconAvailable = ref(true)
const trendIconAvailable = ref(true)

// 使用封装的格式化函数
const formattedValue = computed(() => {
  return formatCompactNumber(props.value)
})

// 图标错误处理
const handleIconError = () => {
  iconAvailable.value = false
}

const handleTrendIconError = () => {
  trendIconAvailable.value = false
}

// 将 Heroicons 名称转换为本地图标名称
const getLocalIconName = (iconName: string): string => {
  const iconMap: Record<string, string> = {
    'i-heroicons-document-text': 'document-text',
    'i-heroicons-users': 'users',
    'i-heroicons-chat-bubble-left-ellipsis': 'chat',
    'i-heroicons-eye': 'eye',
    'i-heroicons-home': 'home',
    'i-heroicons-user': 'user',
    'i-heroicons-plus': 'plus',
    'i-heroicons-pencil': 'edit',
    'i-heroicons-trash': 'trash'
  }
  
  return iconMap[iconName] || 'user'
}
</script>