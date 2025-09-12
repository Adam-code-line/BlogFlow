<template>
  <UiCard 
    class="hover:shadow-lg transition-all duration-300 cursor-pointer group border border-gray-200 dark:border-gray-700"
    @click="$emit('click')"
  >
    <div class="p-6">
      <!-- 用户头像和基本信息 -->
      <div class="flex items-center space-x-4 mb-4">
        <div class="relative">
          <img
            :src="user.avatar || defaultAvatar"
            :alt="user.displayName"
            class="h-16 w-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600 group-hover:border-blue-500 transition-colors"
            @error="handleImageError"
          >
          <!-- 验证徽章 -->
          <div 
            v-if="user.isProfileComplete" 
            class="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1"
            title="资料完整用户"
          >
            <svg class="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
        
        <div class="flex-1 min-w-0">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {{ user.displayName }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
            @{{ user.username }}
          </p>
          <!-- 角色标签 -->
          <span 
            class="inline-block px-2 py-1 text-xs font-medium rounded-full mt-1"
            :class="getRoleStyle(user.role)"
          >
            {{ getRoleLabel(user.role) }}
          </span>
        </div>
      </div>

      <!-- 用户简介 -->
      <div v-if="user.bio" class="mb-4">
        <p class="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
          {{ formatters.text.excerpt(user.bio, 80) }}
        </p>
      </div>

      <!-- 位置和网站 -->
      <div class="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
        <div v-if="user.location" class="flex items-center space-x-1">
          <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          <span>{{ user.location }}</span>
        </div>
        
        <div v-if="user.website" class="flex items-center space-x-1">
          <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
          </svg>
          <span class="truncate">{{ formatters.url.extractDomain(user.website) }}</span>
        </div>
      </div>

      <!-- 技能标签 -->
      <div v-if="user.skills && user.skills.length > 0" class="mb-4">
        <div class="flex flex-wrap gap-1">
          <span
            v-for="skill in user.skills.slice(0, 3)"
            :key="skill"
            class="inline-block px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
          >
            {{ skill }}
          </span>
          <span
            v-if="user.skills.length > 3"
            class="inline-block px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full"
          >
            +{{ user.skills.length - 3 }}
          </span>
        </div>
      </div>

      <!-- 统计信息 -->
      <div class="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
        <div class="text-center">
          <div class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ formatters.number.toShort(user.stats.postsCount) }}
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400">文章</div>
        </div>
        
        <div class="text-center">
          <div class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ formatters.number.toShort(user.stats.followersCount) }}
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400">粉丝</div>
        </div>
        
        <div class="text-center">
          <div class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ formatters.date.toRelative(new Date(Date.now() - user.stats.joinedDaysAgo * 24 * 60 * 60 * 1000)) }}
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400">加入</div>
        </div>
      </div>

      <!-- 社交链接 -->
      <div v-if="hasSocialLinks" class="flex justify-center space-x-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        <a
          v-if="user.socialLinks.github"
          :href="user.socialLinks.github"
          target="_blank"
          rel="noopener noreferrer"
          class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          @click.stop
        >
          <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </a>
        
        <a
          v-if="user.socialLinks.twitter"
          :href="user.socialLinks.twitter"
          target="_blank"
          rel="noopener noreferrer"
          class="p-2 text-gray-400 hover:text-blue-400 transition-colors"
          @click.stop
        >
          <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
          </svg>
        </a>
        
        <a
          v-if="user.socialLinks.website"
          :href="user.socialLinks.website"
          target="_blank"
          rel="noopener noreferrer"
          class="p-2 text-gray-400 hover:text-green-500 transition-colors"
          @click.stop
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
          </svg>
        </a>
      </div>
    </div>
  </UiCard>
</template>

<script setup lang="ts">
import type { PublicUser } from '~/types/user'
import { formatters } from '~/utils/format'

// Props
interface Props {
  user: PublicUser
}

const props = defineProps<Props>()

// Events
defineEmits<{
  click: []
}>()

// 计算属性
const defaultAvatar = computed(() => {
  return `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face`
})

const hasSocialLinks = computed(() => {
  const links = props.user.socialLinks
  return links.github || links.twitter || links.website
})

// 方法
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = defaultAvatar.value
}

const getRoleStyle = (role: string) => {
  const styles = {
    admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    author: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    editor: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    subscriber: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    guest: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  }
  return styles[role as keyof typeof styles] || styles.subscriber
}

const getRoleLabel = (role: string) => {
  const labels = {
    admin: '管理员',
    author: '作者',
    editor: '编辑',
    subscriber: '订阅者',
    guest: '访客'
  }
  return labels[role as keyof typeof labels] || '用户'
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>