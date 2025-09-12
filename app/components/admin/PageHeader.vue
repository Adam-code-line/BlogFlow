<template>
  <div class="mb-8">
    <!-- 面包屑导航 -->
    <nav v-if="breadcrumbs.length" class="flex mb-4" aria-label="Breadcrumb">
      <ol class="inline-flex items-center space-x-1 md:space-x-3">
        <li
          v-for="(item, index) in breadcrumbs"
          :key="index"
          class="inline-flex items-center"
        >
          <Icon
            v-if="index === 0"
            name="i-heroicons-home"
            class="w-4 h-4 mr-2 text-gray-400"
          />
          <Icon
            v-else
            name="i-heroicons-chevron-right"
            class="w-4 h-4 text-gray-400 mx-1"
          />
          <NuxtLink
            v-if="item.to && index < breadcrumbs.length - 1"
            :to="item.to"
            class="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            {{ item.label }}
          </NuxtLink>
          <span
            v-else
            class="text-sm font-medium text-gray-900 dark:text-white"
            :class="index === breadcrumbs.length - 1 ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'"
          >
            {{ item.label }}
          </span>
        </li>
      </ol>
    </nav>

    <div class="flex items-start justify-between">
      <!-- 左侧标题和描述 -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center">
          <!-- 图标 -->
          <div
            v-if="icon"
            :class="[
              'flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-lg mr-4',
              iconBgClass
            ]"
          >
            <Icon :name="icon" :class="['w-6 h-6', iconColorClass]" />
          </div>

          <!-- 标题区域 -->
          <div class="flex-1 min-w-0">
            <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {{ title }}
            </h1>
            <p
              v-if="description"
              class="mt-2 text-sm text-gray-600 dark:text-gray-400 max-w-4xl"
            >
              {{ description }}
            </p>
            
            <!-- 自定义描述插槽 -->
            <div v-if="$slots.description" class="mt-2">
              <slot name="description" />
            </div>
          </div>
        </div>

        <!-- 标签 -->
        <div v-if="tags.length" class="mt-4 flex flex-wrap gap-2">
          <UBadge
            v-for="tag in tags"
            :key="tag.text"
            :label="tag.text"
            color="primary"
            variant="soft"
            size="sm"
          />
        </div>

        <!-- 统计信息 -->
        <div v-if="stats.length" class="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
          >
            <div class="flex items-center">
              <Icon
                v-if="stat.icon"
                :name="stat.icon"
                class="w-5 h-5 text-gray-400 mr-2"
              />
              <div>
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {{ stat.label }}
                </p>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">
                  {{ stat.value }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧操作按钮 -->
      <div v-if="actions.length || $slots.actions" class="flex-shrink-0 ml-6">
        <div class="flex items-center space-x-3">
          <!-- 自定义操作插槽 -->
          <slot name="actions" />
          
          <!-- 预定义操作按钮 -->
          <template v-for="action in actions" :key="action.label">
            <UButton
              v-if="action.type === 'primary'"
              :to="action.to"
              :icon="action.icon"
              :loading="action.loading"
              :disabled="action.disabled"
              @click="action.handler && action.handler()"
            >
              {{ action.label }}
            </UButton>
            
            <UButton
              v-else-if="action.type === 'secondary'"
              :to="action.to"
              :icon="action.icon"
              :loading="action.loading"
              :disabled="action.disabled"
              variant="outline"
              @click="action.handler && action.handler()"
            >
              {{ action.label }}
            </UButton>
            
            <UButton
              v-else
              :to="action.to"
              :icon="action.icon"
              :loading="action.loading"
              :disabled="action.disabled"
              variant="ghost"
              @click="action.handler && action.handler()"
            >
              {{ action.label }}
            </UButton>
          </template>
        </div>
      </div>
    </div>

    <!-- 分割线 -->
    <div v-if="showDivider" class="mt-8 border-b border-gray-200 dark:border-gray-700"></div>
  </div>
</template>

<script setup lang="ts">
interface Breadcrumb {
  label: string
  to?: string
}

interface Tag {
  text: string
  color?: string
  variant?: string
  size?: string
}

interface Stat {
  label: string
  value: string | number
  icon?: string
}

interface Action {
  label: string
  type?: 'primary' | 'secondary' | 'ghost'
  icon?: string
  to?: string
  handler?: () => void
  loading?: boolean
  disabled?: boolean
}

interface Props {
  title: string
  description?: string
  icon?: string
  iconColor?: 'blue' | 'green' | 'purple' | 'orange' | 'red'
  breadcrumbs?: Breadcrumb[]
  tags?: Tag[]
  stats?: Stat[]
  actions?: Action[]
  showDivider?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  iconColor: 'blue',
  breadcrumbs: () => [],
  tags: () => [],
  stats: () => [],
  actions: () => [],
  showDivider: true
})

// 图标背景颜色类
const iconBgClass = computed(() => {
  const colors = {
    blue: 'bg-blue-100 dark:bg-blue-900/20',
    green: 'bg-green-100 dark:bg-green-900/20',
    purple: 'bg-purple-100 dark:bg-purple-900/20',
    orange: 'bg-orange-100 dark:bg-orange-900/20',
    red: 'bg-red-100 dark:bg-red-900/20'
  }
  return colors[props.iconColor]
})

// 图标颜色类
const iconColorClass = computed(() => {
  const colors = {
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-green-600 dark:text-green-400',
    purple: 'text-purple-600 dark:text-purple-400',
    orange: 'text-orange-600 dark:text-orange-400',
    red: 'text-red-600 dark:text-red-400'
  }
  return colors[props.iconColor]
})
</script>