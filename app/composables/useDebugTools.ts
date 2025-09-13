/**
 * 开发环境调试工具
 * 提供清除本地存储、重置数据等功能
 */

export function useDebugTools() {
  const clearLocalStorage = () => {
    if (process.client) {
      localStorage.removeItem('blogflow_posts')
      console.log('✅ 已清除 blogflow_posts 本地存储')
      
      // 刷新页面以重新初始化数据
      window.location.reload()
    }
  }

  const showLocalStorageData = () => {
    if (process.client) {
      const data = localStorage.getItem('blogflow_posts')
      console.log('📦 本地存储数据:', data ? JSON.parse(data) : '无数据')
    }
  }

  const addTestPost = () => {
    if (process.client) {
      const testPost = {
        id: Date.now().toString(),
        title: '测试文章 - ' + new Date().toLocaleTimeString(),
        description: '这是一篇用于测试的文章',
        content: `# 测试文章标题

这是测试文章的内容。

## 子标题

- 列表项 1
- 列表项 2
- 列表项 3

**粗体文本** 和 *斜体文本*

\`\`\`javascript
console.log('Hello, World!');
\`\`\`

> 这是一个引用

[链接示例](https://example.com)`,
        category: '测试',
        tags: ['测试', 'Debug'],
        cover: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop',
        featured: false,
        slug: 'test-post-' + Date.now(),
        publishedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 0,
        likes: 0,
        comments: 0
      }

      const posts = JSON.parse(localStorage.getItem('blogflow_posts') || '[]')
      posts.push(testPost)
      localStorage.setItem('blogflow_posts', JSON.stringify(posts))
      
      console.log('✅ 已添加测试文章:', testPost)
      window.location.reload()
    }
  }

  return {
    clearLocalStorage,
    showLocalStorageData,
    addTestPost
  }
}