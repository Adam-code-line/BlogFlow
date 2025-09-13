<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
    <div class="max-w-4xl mx-auto">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          🐛 BlogFlow Debug 工具
        </h1>
        
        <!-- 操作按钮 -->
        <div class="flex flex-wrap gap-4 mb-6">
          <UButton @click="checkStorage" icon="heroicons:eye">
            检查存储数据
          </UButton>
          <UButton @click="clearStorage" color="error" variant="outline" icon="heroicons:trash">
            清空存储
          </UButton>
          <UButton @click="initSampleData" color="success" variant="outline" icon="heroicons:plus-circle">
            初始化示例数据
          </UButton>
          <UButton @click="addTestPost" color="primary" variant="outline" icon="heroicons:document-plus">
            添加测试文章
          </UButton>
        </div>

        <!-- 数据展示区域 -->
        <div class="space-y-6">
          <!-- localStorage 原始数据 -->
          <div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              📦 LocalStorage 原始数据
            </h2>
            <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 max-h-96 overflow-auto">
              <pre class="text-sm text-gray-800 dark:text-gray-200">{{ rawData || '无数据' }}</pre>
            </div>
          </div>

          <!-- 解析后的数据 -->
          <div v-if="parsedData.length > 0">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              📝 解析后的文章列表 ({{ parsedData.length }} 篇)
            </h2>
            <div class="space-y-4">
              <div
                v-for="(post, index) in parsedData"
                :key="post.id"
                class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <h3 class="font-medium text-gray-900 dark:text-white">
                      {{ post.title }}
                    </h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {{ post.description }}
                    </p>
                    <div class="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>ID: {{ post.id }}</span>
                      <span>Slug: {{ post.slug }}</span>
                      <span>内容长度: {{ post.content?.length || 0 }} 字符</span>
                    </div>
                    
                    <!-- 内容预览 -->
                    <div v-if="post.content" class="mt-3">
                      <details class="text-sm">
                        <summary class="cursor-pointer text-blue-600 dark:text-blue-400">
                          内容预览 (点击展开)
                        </summary>
                        <div class="mt-2 p-3 bg-white dark:bg-gray-800 rounded border max-h-32 overflow-auto">
                          <pre class="whitespace-pre-wrap text-xs">{{ post.content.substring(0, 500) }}{{ post.content.length > 500 ? '...' : '' }}</pre>
                        </div>
                      </details>
                    </div>
                    <div v-else class="mt-3 text-red-500 text-sm">
                      ⚠️ 缺少 content 字段
                    </div>
                  </div>
                  
                  <div class="flex space-x-2 ml-4">
                    <UButton 
                      size="xs" 
                      variant="outline"
                      :to="`/blog/${post.slug}`"
                      target="_blank"
                    >
                      查看
                    </UButton>
                    <UButton 
                      size="xs" 
                      color="error" 
                      variant="outline"
                      @click="deletePost(index)"
                    >
                      删除
                    </UButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  getPostsAction, 
  initializeSamplePosts, 
  clearAllPosts,
  createPostAction,
  type PostData 
} from '~/composables/usePostActions'

// 页面标题
useHead({
  title: 'Debug Tool - BlogFlow'
})

// 响应式数据
const rawData = ref('')
const parsedData = ref<PostData[]>([])

// 检查存储数据
const checkStorage = async () => {
  if (process.client) {
    // 获取原始数据
    rawData.value = localStorage.getItem('blogflow_posts') || ''
    
    // 获取解析后的数据
    try {
      parsedData.value = await getPostsAction()
    } catch (error) {
      console.error('获取数据失败:', error)
      parsedData.value = []
    }
  }
}

// 清空存储
const clearStorage = () => {
  if (confirm('确定要清空所有存储数据吗？')) {
    clearAllPosts()
    rawData.value = ''
    parsedData.value = []
  }
}

// 初始化示例数据
const initSampleData = () => {
  initializeSamplePosts()
  setTimeout(() => {
    checkStorage()
  }, 100)
}

// 添加测试文章
const addTestPost = async () => {
  const testPost = {
    title: '测试文章 - ' + new Date().toLocaleTimeString(),
    description: '这是一篇用于测试的文章，包含丰富的 Markdown 内容',
    content: `# 测试文章标题

这是一篇测试文章，用于验证 **前端存储** 和 *Markdown 渲染* 功能。

## 功能测试

### 文本格式
- **粗体文本**
- *斜体文本*  
- ***粗斜体***
- ~~删除线~~

### 列表
1. 有序列表项 1
2. 有序列表项 2
3. 有序列表项 3

- 无序列表项 A
- 无序列表项 B
- 无序列表项 C

### 代码块

\`\`\`javascript
function testFunction() {
  console.log('这是一个测试函数')
  return {
    message: 'Hello BlogFlow!',
    timestamp: new Date().toISOString()
  }
}

testFunction()
\`\`\`

### 引用

> 这是一个引用块的示例
> 
> 可以包含多行内容
> 
> —— 来自 BlogFlow 测试

### 链接和图片

[访问 GitHub](https://github.com)

![测试图片](https://via.placeholder.com/400x200?text=Test+Image)

### 表格

| 功能 | 状态 | 备注 |
|------|------|------|
| 文章创建 | ✅ | 正常 |
| 内容存储 | 🔄 | 测试中 |
| Markdown 渲染 | ✅ | 正常 |

---

这就是测试内容的结尾。时间戳：${new Date().toISOString()}`,
    category: '测试',
    tags: ['测试', 'Debug', 'Markdown'],
    cover: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop',
    featured: false,
    slug: 'test-post-' + Date.now()
  }

  try {
    await createPostAction(testPost)
    console.log('测试文章创建成功')
    checkStorage()
  } catch (error) {
    console.error('创建测试文章失败:', error)
  }
}

// 删除文章
const deletePost = (index: number) => {
  if (confirm('确定要删除这篇文章吗？')) {
    parsedData.value.splice(index, 1)
    
    // 更新 localStorage
    if (process.client) {
      localStorage.setItem('blogflow_posts', JSON.stringify(parsedData.value))
    }
  }
}

// 页面加载时检查数据
onMounted(() => {
  checkStorage()
})
</script>