<template>
  <UiCard class="border border-gray-200 dark:border-gray-700">
    <div class="p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">统计信息</h3>
      
      <div class="grid grid-cols-2 gap-6">
        <!-- 内容统计 -->
        <div class="text-center">
          <div class="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
            {{ formatters.number.toShort(fullStats.postsCount) }}
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400">发布文章</div>
        </div>
        
        <div class="text-center">
          <div class="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
            {{ formatters.number.toShort(fullStats.commentsCount) }}
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400">评论数量</div>
        </div>
        
        <!-- 互动统计 -->
        <div class="text-center">
          <div class="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
            {{ formatters.number.toShort(fullStats.likesReceived) }}
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400">获得点赞</div>
        </div>
        
        <div class="text-center">
          <div class="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-1">
            {{ formatters.number.toShort(fullStats.viewsReceived) }}
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400">文章浏览</div>
        </div>
        
        <!-- 社交统计 -->
        <div class="text-center">
          <div class="text-3xl font-bold text-pink-600 dark:text-pink-400 mb-1">
            {{ formatters.number.toShort(fullStats.followersCount) }}
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400">粉丝数量</div>
        </div>
        
        <div class="text-center">
          <div class="text-3xl font-bold text-cyan-600 dark:text-cyan-400 mb-1">
            {{ formatters.number.toShort(fullStats.followingCount) }}
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400">关注数量</div>
        </div>
      </div>
      
      <!-- 活跃度信息 -->
      <div class="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
        <div class="flex justify-between items-center text-sm">
          <span class="text-gray-500 dark:text-gray-400">加入时间：</span>
          <span class="text-gray-900 dark:text-white font-medium">
            {{ formatters.date.toRelative(joinDate) }}
          </span>
        </div>
        
        <div class="flex justify-between items-center text-sm mt-2">
          <span class="text-gray-500 dark:text-gray-400">最后活跃：</span>
          <span class="text-gray-900 dark:text-white font-medium">
            {{ formatters.date.toRelative(fullStats.lastActiveAt) }}
          </span>
        </div>
        
        <div class="flex justify-between items-center text-sm mt-2">
          <span class="text-gray-500 dark:text-gray-400">活跃天数：</span>
          <span class="text-gray-900 dark:text-white font-medium">
            {{ fullStats.joinedDaysAgo }} 天
          </span>
        </div>
      </div>
      
      <!-- 活跃度指标 -->
      <div class="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
        <div class="space-y-3">
          <!-- 文章活跃度 -->
          <div>
            <div class="flex justify-between text-sm mb-1">
              <span class="text-gray-500 dark:text-gray-400">文章活跃度</span>
              <span class="text-gray-700 dark:text-gray-300">{{ getActivityLevel(fullStats.postsCount, 'posts') }}</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                class="bg-blue-500 h-2 rounded-full transition-all duration-300"
                :style="{ width: getActivityPercentage(fullStats.postsCount, 'posts') + '%' }"
              ></div>
            </div>
          </div>
          
          <!-- 社交活跃度 -->
          <div>
            <div class="flex justify-between text-sm mb-1">
              <span class="text-gray-500 dark:text-gray-400">社交活跃度</span>
              <span class="text-gray-700 dark:text-gray-300">{{ getActivityLevel(fullStats.followersCount, 'social') }}</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                class="bg-green-500 h-2 rounded-full transition-all duration-300"
                :style="{ width: getActivityPercentage(fullStats.followersCount, 'social') + '%' }"
              ></div>
            </div>
          </div>
          
          <!-- 互动活跃度 -->
          <div>
            <div class="flex justify-between text-sm mb-1">
              <span class="text-gray-500 dark:text-gray-400">互动活跃度</span>
              <span class="text-gray-700 dark:text-gray-300">{{ getActivityLevel(fullStats.likesReceived, 'engagement') }}</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                class="bg-purple-500 h-2 rounded-full transition-all duration-300"
                :style="{ width: getActivityPercentage(fullStats.likesReceived, 'engagement') + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 成就徽章 -->
      <div v-if="achievements.length > 0" class="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
        <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">成就徽章</h4>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="achievement in achievements"
            :key="achievement.type"
            class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
            :class="achievement.style"
            :title="achievement.description"
          >
            <component :is="achievement.icon" class="h-3 w-3 mr-1" />
            {{ achievement.title }}
          </span>
        </div>
      </div>
    </div>
  </UiCard>
</template>

<script setup lang="ts">
import type { UserStats } from '~/types/user'
import { formatters } from '~/utils/format'

// Props
interface Props {
  stats: UserStats | Pick<UserStats, 'postsCount' | 'followersCount' | 'joinedDaysAgo'>
}

const props = defineProps<Props>()

// 创建完整的stats对象，填充缺失的字段
const fullStats = computed<UserStats>(() => {
  const baseStats = props.stats as any
  return {
    postsCount: baseStats.postsCount || 0,
    commentsCount: baseStats.commentsCount || 0,
    likesReceived: baseStats.likesReceived || 0,
    viewsReceived: baseStats.viewsReceived || 0,
    followersCount: baseStats.followersCount || 0,
    followingCount: baseStats.followingCount || 0,
    joinedDaysAgo: baseStats.joinedDaysAgo || 0,
    lastActiveAt: baseStats.lastActiveAt || new Date()
  }
})

// 计算加入日期
const joinDate = computed(() => {
  const now = new Date()
  const joinedDate = new Date(now.getTime() - fullStats.value.joinedDaysAgo * 24 * 60 * 60 * 1000)
  return joinedDate
})

// 获取活跃度等级
const getActivityLevel = (value: number, type: string) => {
  const thresholds = {
    posts: { low: 5, medium: 20, high: 50 },
    social: { low: 10, medium: 100, high: 500 },
    engagement: { low: 50, medium: 200, high: 1000 }
  }
  
  const threshold = thresholds[type as keyof typeof thresholds]
  if (!threshold) return '新手'
  
  if (value >= threshold.high) return '专家'
  if (value >= threshold.medium) return '活跃'
  if (value >= threshold.low) return '进阶'
  return '新手'
}

// 获取活跃度百分比
const getActivityPercentage = (value: number, type: string) => {
  const maxValues = {
    posts: 100,
    social: 1000,
    engagement: 2000
  }
  
  const maxValue = maxValues[type as keyof typeof maxValues] || 100
  return Math.min((value / maxValue) * 100, 100)
}

// 计算成就徽章
const achievements = computed(() => {
  const badges = []
  
  // 文章成就
  if (fullStats.value.postsCount >= 100) {
    badges.push({
      type: 'prolific-writer',
      title: '多产作者',
      description: '发布超过100篇文章',
      style: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      icon: 'svg' // 这里可以替换为实际的图标组件
    })
  } else if (fullStats.value.postsCount >= 50) {
    badges.push({
      type: 'active-writer',
      title: '活跃作者',
      description: '发布超过50篇文章',
      style: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      icon: 'svg'
    })
  } else if (fullStats.value.postsCount >= 10) {
    badges.push({
      type: 'writer',
      title: '新锐作者',
      description: '发布超过10篇文章',
      style: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      icon: 'svg'
    })
  }
  
  // 粉丝成就
  if (fullStats.value.followersCount >= 1000) {
    badges.push({
      type: 'influencer',
      title: '影响力用户',
      description: '拥有超过1000名粉丝',
      style: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      icon: 'svg'
    })
  } else if (fullStats.value.followersCount >= 100) {
    badges.push({
      type: 'popular',
      title: '受欢迎用户',
      description: '拥有超过100名粉丝',
      style: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      icon: 'svg'
    })
  }
  
  // 老用户成就
  if (fullStats.value.joinedDaysAgo >= 365) {
    badges.push({
      type: 'veteran',
      title: '资深用户',
      description: '加入超过一年',
      style: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      icon: 'svg'
    })
  }
  
  return badges
})
</script>