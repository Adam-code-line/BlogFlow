<template>
  <UCard 
    class="hover:shadow-xl transition-all duration-300 group cursor-pointer h-full flex flex-col"
    @click="navigateTo(`/blog/${post._path?.replace('/blog/', '')}`)"
  >
    <template #header>
      <div class="aspect-w-16 aspect-h-9 mb-4">
        <NuxtImg
          v-if="post.cover || post.seo?.ogImage"
          :src="post.cover || post.seo?.ogImage"
          :alt="post.title"
          class="w-full h-48 object-cover rounded-lg"
          loading="lazy"
        />
        <div 
          v-else
          class="w-full h-48 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center"
        >
          <Icon name="heroicons:document-text" class="w-16 h-16 text-white opacity-80" />
        </div>
      </div>
    </template>

    <div class="flex-1 flex flex-col">
      <!-- 文章分类和日期 -->
      <div class="flex items-center justify-between mb-3">
        <UBadge 
          :label="post.category" 
          variant="subtle" 
          color="primary"
          class="text-xs"
        />
        <time class="text-xs text-gray-500 dark:text-gray-400">
          {{ formatDate(post.publishedAt) }}
        </time>
      </div>

      <!-- 文章标题 -->
      <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
        {{ post.title }}
      </h3>

      <!-- 文章描述 -->
      <p class="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 flex-1">
        {{ post.description }}
      </p>

      <!-- 文章标签 -->
      <div class="flex flex-wrap gap-2 mb-4">
        <UBadge 
          v-for="tag in post.tags?.slice(0, 3)" 
          :key="tag"
          :label="tag"
          variant="soft"
          size="xs"
          color="neutral"
        />
        <UBadge 
          v-if="post.tags && post.tags.length > 3"
          :label="`+${post.tags.length - 3}`"
          variant="soft"
          size="xs"
          color="neutral"
        />
      </div>

      <!-- 文章底部信息 -->
      <div class="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
        <div class="flex items-center space-x-2">
          <img 
            :src="post.author?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'"
            :alt="post.author?.name || 'Author'"
            class="w-6 h-6 rounded-full"
          />
          <span class="text-sm text-gray-600 dark:text-gray-400">
            {{ post.author?.name || 'BlogFlow Author' }}
          </span>
        </div>
        <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Icon name="heroicons:clock" class="w-4 h-4 mr-1" />
          {{ post.readingTime || 5 }} 分钟
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
interface Props {
  post: any // 使用我们之前定义的 BlogPost 类型
}

const props = defineProps<Props>()

function formatDate(dateString: string | Date) {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
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

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>