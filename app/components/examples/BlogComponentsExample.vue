<!-- 组件使用示例 -->
<template>
  <div class="space-y-12">
    <!-- 分类列表示例 -->
    <section>
      <CategoryList
        :categories="categories"
        :show-title="true"
        title="技术分类"
        description="浏览不同主题的技术文章分类"
        :show-recent-posts="true"
        :columns="3"
        @category-click="handleCategoryClick"
        @view-all="handleViewAllCategories"
      />
    </section>

    <!-- 文章列表示例 -->
    <section>
      <PostList
        :posts="posts"
        :show-header="true"
        title="最新文章"
        description="探索最新的技术分享和见解"
        :default-view-mode="'grid'"
        :grid-columns="3"
        :page-size="9"
        :enable-search="true"
        :enable-category-filter="true"
        :enable-sort="true"
        @post-click="handlePostClick"
        @search="handleSearch"
        @category-change="handleCategoryChange"
        @sort-change="handleSortChange"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import type { ContentPost } from '~/types'
import type { Category } from '~/components/blog/CategoryList.vue'

// 示例分类数据
const categories: Category[] = [
  {
    name: '前端开发',
    slug: 'frontend',
    description: '前端技术、框架和工具的最新动态',
    icon: 'heroicons:code-bracket',
    count: 15,
    tags: ['Vue.js', 'React', 'JavaScript', 'CSS'],
    recentPosts: [
      { path: '/blog/vue3-guide', title: 'Vue 3 完全指南' },
      { path: '/blog/css-grid', title: 'CSS Grid 布局详解' }
    ]
  },
  {
    name: '后端开发',
    slug: 'backend',
    description: '服务器端开发技术和架构设计',
    icon: 'heroicons:server',
    count: 12,
    tags: ['Node.js', 'Python', 'Go', 'Docker'],
    recentPosts: [
      { path: '/blog/nodejs-best-practices', title: 'Node.js 最佳实践' },
      { path: '/blog/microservices', title: '微服务架构设计' }
    ]
  },
  {
    name: '数据库',
    slug: 'database',
    description: '数据库设计、优化和管理',
    icon: 'heroicons:circle-stack',
    count: 8,
    tags: ['MySQL', 'Redis', 'MongoDB', 'PostgreSQL'],
    recentPosts: [
      { path: '/blog/sql-optimization', title: 'SQL 查询优化技巧' },
      { path: '/blog/redis-patterns', title: 'Redis 设计模式' }
    ]
  },
  {
    name: '人工智能',
    slug: 'ai',
    description: '机器学习、深度学习和AI应用',
    icon: 'heroicons:cpu-chip',
    count: 6,
    tags: ['Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch'],
    recentPosts: [
      { path: '/blog/ml-basics', title: '机器学习入门' },
      { path: '/blog/neural-networks', title: '神经网络原理' }
    ]
  },
  {
    name: '开发工具',
    slug: 'tools',
    description: '提高开发效率的工具和技巧',
    icon: 'heroicons:wrench-screwdriver',
    count: 10,
    tags: ['Git', 'Docker', 'VS Code', 'Terminal'],
    recentPosts: [
      { path: '/blog/git-workflow', title: 'Git 工作流程' },
      { path: '/blog/docker-tips', title: 'Docker 使用技巧' }
    ]
  },
  {
    name: '系统设计',
    slug: 'system-design',
    description: '大规模系统架构和设计模式',
    icon: 'heroicons:squares-plus',
    count: 7,
    tags: ['Architecture', 'Scalability', 'Design Patterns', 'Performance'],
    recentPosts: [
      { path: '/blog/system-architecture', title: '系统架构设计' },
      { path: '/blog/load-balancing', title: '负载均衡策略' }
    ]
  }
]

// 示例文章数据
const posts: ContentPost[] = [
  {
    path: '/blog/vue3-composition-api',
    title: 'Vue 3 Composition API 完全指南',
    description: '深入了解 Vue 3 的 Composition API，学习如何构建更好的组件',
    cover: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop',
    category: '前端开发',
    tags: ['Vue.js', 'JavaScript', 'TypeScript'],
    author: {
      name: 'BlogFlow',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    },
    publishedAt: '2024-01-15',
    readingTime: 8,
    featured: true,
    excerpt: '本文将详细介绍 Vue 3 Composition API 的使用方法和最佳实践。'
  },
  {
    path: '/blog/typescript-best-practices',
    title: 'TypeScript 最佳实践指南',
    description: '掌握 TypeScript 的高级特性，写出更加类型安全的代码',
    cover: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop',
    category: '前端开发',
    tags: ['TypeScript', 'JavaScript', 'Programming'],
    author: {
      name: 'BlogFlow',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    },
    publishedAt: '2024-01-10',
    readingTime: 12,
    excerpt: '探索 TypeScript 的强大功能，提升代码质量和开发效率。'
  },
  {
    path: '/blog/nodejs-microservices',
    title: 'Node.js 微服务架构设计',
    description: '使用 Node.js 构建可扩展的微服务系统',
    cover: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop',
    category: '后端开发',
    tags: ['Node.js', 'Microservices', 'Architecture'],
    author: {
      name: 'BlogFlow',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    },
    publishedAt: '2024-01-05',
    readingTime: 15,
    excerpt: '学习如何设计和实现高性能的微服务架构。'
  },
  // 更多示例文章...
]

// 事件处理函数
const handleCategoryClick = (category: Category) => {
  console.log('分类点击:', category)
  // 导航到分类页面
  navigateTo(`/blog/category/${category.slug}`)
}

const handleViewAllCategories = () => {
  console.log('查看全部分类')
  navigateTo('/blog/categories')
}

const handlePostClick = (post: ContentPost) => {
  console.log('文章点击:', post)
  // 默认会自动导航，这里可以添加额外的逻辑
}

const handleSearch = (query: string) => {
  console.log('搜索:', query)
  // 处理搜索逻辑
}

const handleCategoryChange = (category: string) => {
  console.log('分类变化:', category)
  // 处理分类筛选
}

const handleSortChange = (sortBy: string) => {
  console.log('排序变化:', sortBy)
  // 处理排序逻辑
}
</script>