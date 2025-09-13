// BlogFlow 测试数据初始化脚本
// 在浏览器控制台中运行此脚本

console.log('🚀 BlogFlow 测试数据初始化开始...');

// 清除现有数据
localStorage.removeItem('blogflow_posts');

// 创建测试文章
const testPosts = [
  {
    id: '1',
    title: '我的第一篇测试文章',
    description: '这是一篇用于测试 Markdown 渲染的文章',
    content: `# 我的第一篇测试文章

这是一篇用于测试 **Markdown** 渲染的文章。

## 子标题

这里有一些内容：

- 列表项 1
- 列表项 2
- 列表项 3

### 代码示例

\`\`\`javascript
function helloWorld() {
    console.log("Hello, World!");
}
\`\`\`

### 引用

> 这是一个引用块

### 链接

[访问 GitHub](https://github.com)

---

这就是测试内容的结尾。`,
    category: '技术',
    tags: ['测试', 'Markdown'],
    cover: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop',
    featured: false,
    slug: 'my-first-test-post',
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    views: 123,
    likes: 45,
    comments: 7
  },
  {
    id: '2',
    title: '富文本内容测试',
    description: '包含各种 Markdown 元素的测试文章',
    content: `# 富文本内容测试

这篇文章包含了各种 **Markdown** 元素。

## 文本格式

**粗体文本** 和 *斜体文本* 以及 ***粗斜体***

~~删除线文本~~

## 列表

### 无序列表
- 第一项
- 第二项
  - 子项 1
  - 子项 2
- 第三项

### 有序列表
1. 第一步
2. 第二步
3. 第三步

## 代码块

\`\`\`typescript
interface Post {
  id: string
  title: string
  content: string
}

function createPost(data: Post): void {
  console.log('Creating post:', data.title)
}
\`\`\`

## 引用

> 这是一个引用块
> 
> 可以包含多行内容

## 表格

| 名称 | 年龄 | 城市 |
|------|------|------|
| 张三 | 25   | 北京 |
| 李四 | 30   | 上海 |

## 分割线

---

## 图片

![示例图片](https://via.placeholder.com/400x200)

这就是富文本测试的结尾。`,
    category: '设计',
    tags: ['测试', 'Rich Content', 'Markdown'],
    cover: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=400&fit=crop',
    featured: true,
    slug: 'rich-content-test',
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    views: 456,
    likes: 89,
    comments: 12
  }
];

// 保存到 localStorage
localStorage.setItem('blogflow_posts', JSON.stringify(testPosts));

console.log('✅ 测试数据已保存到 localStorage');
console.log('📦 保存的文章数量:', testPosts.length);
console.log('📝 文章标题:', testPosts.map(p => p.title));

// 验证数据
const saved = JSON.parse(localStorage.getItem('blogflow_posts') || '[]');
console.log('🔍 验证保存的数据:', saved);

console.log('🎉 初始化完成！现在可以访问以下 URL 测试：');
console.log('- http://localhost:3000/blog/my-first-test-post');
console.log('- http://localhost:3000/blog/rich-content-test');

// 刷新页面
console.log('🔄 即将刷新页面...');
setTimeout(() => {
  window.location.reload();
}, 1000);