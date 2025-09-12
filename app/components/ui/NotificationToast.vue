<template>
  <Teleport to="body">
    <div v-if="uiStore.notifications.length > 0" class="fixed top-4 right-4 z-50 space-y-3">
      <TransitionGroup name="notification" tag="div">
        <div
          v-for="notification in uiStore.latestNotifications(5)"
          :key="notification.id"
          :class="[
            'max-w-sm rounded-lg shadow-lg pointer-events-auto overflow-hidden',
            notificationClasses[notification.type]
          ]"
        >
          <div class="p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <Icon :name="notificationIcons[notification.type]" :class="iconClasses[notification.type]" />
              </div>
              <div class="ml-3 w-0 flex-1">
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ notification.title }}
                </p>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {{ notification.message }}
                </p>
              </div>
              <div class="ml-4 flex-shrink-0 flex">
                <button
                  @click="uiStore.removeNotification(notification.id)"
                  class="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Icon name="heroicons:x-mark" class="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useUIStore } from '~/stores/ui'
import type { Notification } from '~/stores/ui'

const uiStore = useUIStore()

// 通知样式配置
const notificationClasses = {
  success: 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800',
  error: 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800',
  warning: 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800',
  info: 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
}

const notificationIcons = {
  success: 'heroicons:check-circle',
  error: 'heroicons:x-circle',
  warning: 'heroicons:exclamation-triangle',
  info: 'heroicons:information-circle'
}

const iconClasses = {
  success: 'h-5 w-5 text-green-400',
  error: 'h-5 w-5 text-red-400',
  warning: 'h-5 w-5 text-yellow-400',
  info: 'h-5 w-5 text-blue-400'
}
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.3s ease;
}
</style>