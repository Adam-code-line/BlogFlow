/**
 * 前端文章操作Actions - 使用localStorage模拟后端
 * 专为前端测试设计，避免复杂的后端逻辑
 */

export interface PostData {
  id?: string
  title: string
  description?: string
  content: string
  cover?: string
  category?: string
  tags: string[]
  publishedAt?: string
  featured?: boolean
  slug?: string
  metaDescription?: string
  keywords?: string
  views?: number
  createdAt?: string
  updatedAt?: string
}

// 本地存储键名
const POSTS_STORAGE_KEY = 'blogflow_posts'

/**
 * 获取本地存储的所有文章
 */
function getStoredPosts(): PostData[] {
  if (process.client) {
    try {
      const stored = localStorage.getItem(POSTS_STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Failed to load posts from localStorage:', error)
      return []
    }
  }
  return []
}

/**
 * 保存文章到本地存储
 */
function savePostsToStorage(posts: PostData[]): void {
  if (process.client) {
    try {
      localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts))
    } catch (error) {
      console.error('Failed to save posts to localStorage:', error)
    }
  }
}

/**
 * 生成简单的slug
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100)
}

/**
 * 创建新文章 - 前端模拟版本
 */
export async function createPostAction(postData: PostData): Promise<PostData> {
  try {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const posts = getStoredPosts()
    
    // 确保所有必需字段都存在
    const newPost: PostData = {
      id: Date.now().toString(),
      title: postData.title,
      description: postData.description || '',
      content: postData.content || '', // 确保 content 字段存在
      cover: postData.cover || '',
      category: postData.category || '',
      tags: postData.tags || [],
      slug: postData.slug || generateSlug(postData.title),
      publishedAt: postData.publishedAt || new Date().toISOString(),
      featured: postData.featured || false,
      metaDescription: postData.metaDescription || '',
      keywords: postData.keywords || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0
    }
    
    // 添加到文章列表
    posts.push(newPost)
    
    // 保存到本地存储
    savePostsToStorage(posts)
    
    return newPost
    
  } catch (error) {
    console.error('❌ 创建文章失败:', error)
    throw new Error('创建文章失败，请重试')
  }
}

/**
 * 更新文章 - 前端模拟版本
 */
export async function updatePostAction(postId: string, postData: Partial<PostData>): Promise<PostData> {
  try {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const posts = getStoredPosts()
    const postIndex = posts.findIndex(post => post.id === postId)
    
    if (postIndex === -1) {
      throw new Error('文章不存在')
    }
    
    const existingPost = posts[postIndex]
    if (!existingPost) {
      throw new Error('文章数据异常')
    }
    
    // 更新文章数据 - 确保所有必需字段都存在
    const updatedPost: PostData = {
      id: postId,
      title: postData.title ?? existingPost.title,
      description: postData.description ?? existingPost.description,
      content: postData.content ?? existingPost.content, // 确保 content 字段不丢失
      cover: postData.cover ?? existingPost.cover,
      category: postData.category ?? existingPost.category,
      tags: postData.tags ?? existingPost.tags,
      slug: postData.slug ?? existingPost.slug,
      publishedAt: postData.publishedAt ?? existingPost.publishedAt,
      featured: postData.featured ?? existingPost.featured,
      metaDescription: postData.metaDescription ?? existingPost.metaDescription,
      keywords: postData.keywords ?? existingPost.keywords,
      views: postData.views ?? existingPost.views,
      createdAt: existingPost.createdAt,
      updatedAt: new Date().toISOString()
    }
    
    posts[postIndex] = updatedPost
    
    // 保存到本地存储
    savePostsToStorage(posts)
    
    return updatedPost
    
  } catch (error) {
    console.error('❌ 更新文章失败:', error)
    throw new Error('更新文章失败，请重试')
  }
}

/**
 * 获取文章列表 - 前端模拟版本
 */
export async function getPostsAction(): Promise<PostData[]> {
  try {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 200))
    
    return getStoredPosts()
    
  } catch (error) {
    console.error('获取文章列表失败:', error)
    throw new Error('获取文章列表失败，请重试')
  }
}

/**
 * 根据ID获取文章 - 前端模拟版本
 */
export async function getPostByIdAction(postId: string): Promise<PostData | null> {
  try {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const posts = getStoredPosts()
    return posts.find(post => post.id === postId) || null
    
  } catch (error) {
    console.error('获取文章失败:', error)
    throw new Error('获取文章失败，请重试')
  }
}

/**
 * 删除文章 - 前端模拟版本
 */
export async function deletePostAction(postId: string): Promise<boolean> {
  try {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const posts = getStoredPosts()
    console.log('删除前的文章列表:', posts.map(p => ({ id: p.id, title: p.title, slug: p.slug })))
    console.log('要删除的标识符:', postId)
    
    // 使用id、slug或title来匹配文章
    const filteredPosts = posts.filter(post => {
      const matches = post.id === postId || 
                     post.slug === postId || 
                     post.title === postId ||
                     post.slug === postId.replace('/blog/', '')
      
      if (matches) {
        console.log('找到要删除的文章:', { id: post.id, title: post.title, slug: post.slug })
      }
      
      return !matches
    })
    
    if (filteredPosts.length === posts.length) {
      console.log('没有找到匹配的文章')
      throw new Error('文章不存在')
    }
    
    console.log('删除后的文章列表:', filteredPosts.map(p => ({ id: p.id, title: p.title, slug: p.slug })))
    
    savePostsToStorage(filteredPosts)
    
    console.log(`文章已删除: ${postId}`)
    return true
    
  } catch (error) {
    console.error('删除文章失败:', error)
    throw new Error('删除文章失败，请重试')
  }
}

/**
 * 清空所有文章 - 调试用
 */
export function clearAllPosts(): void {
  if (process.client) {
    localStorage.removeItem(POSTS_STORAGE_KEY)
  }
}

/**
 * 初始化示例数据 - 首次使用时调用
 */
export function initializeSamplePosts(): void {
  const posts = getStoredPosts()
  
  // 如果没有文章，创建一些示例数据
  if (posts.length === 0) {
    const samplePosts: PostData[] = [
      {
        id: '1',
        title: '欢迎使用BlogFlow',
        description: '这是您的第一篇文章，您可以在后台管理界面编辑或删除它。',
        content: `# 欢迎使用BlogFlow

这是一个示例文章，展示了BlogFlow的基本功能。

## 主要特性

- 🎨 美观的界面设计
- 📝 强大的Markdown编辑器
- 🔄 实时预览功能
- 📱 响应式布局
- 🌙 暗色模式支持

## 代码示例

\`\`\`javascript
// 这是一个代码示例
function hello() {
  console.log('Hello, BlogFlow!');
}
\`\`\`

## 引用

> 这是一个引用示例，用来展示Markdown的引用功能。

您可以在管理后台创建、编辑和删除文章。

**祝您使用愉快！**`,
        category: '系统',
        tags: ['欢迎', '指南'],
        cover: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop',
        featured: true,
        slug: 'welcome-to-blogflow',
        publishedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 0
      },
      {
        id: '2',
        title: '这是标题',
        description: '这是描述',
        content: `# 这是标题

这是文章的主要内容。

## 副标题

这里是更多的内容，包含：

1. 列表项目1
2. 列表项目2
3. 列表项目3

### 更小的标题

**粗体文本** 和 *斜体文本*

\`\`\`html
<div>这是代码块</div>
\`\`\`

> 这是一个引用块

[这是一个链接](https://example.com)`,
        category: '技术',
        tags: ['测试', 'Markdown'],
        cover: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=400&fit=crop',
        featured: false,
        slug: 'zhe-shi-biao-ti',
        publishedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 0
      }
    ]
    
    // 强制保存到 localStorage，确保 content 字段不丢失
    savePostsToStorage(samplePosts)
  }
}