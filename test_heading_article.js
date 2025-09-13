// 测试标题层级的文章内容
const testArticle = {
  id: Date.now().toString(),
  title: '标题层级测试文章',
  description: '这是一篇用于测试不同标题层级显示效果的文章',
  content: `# 一级标题 - 这是最大的标题

这是一级标题下的正文内容。一级标题应该是最大最醒目的。

## 二级标题 - 稍小一些的标题

这里是二级标题的内容。二级标题应该比一级标题小一些。

### 三级标题 - 中等大小的标题

三级标题的内容在这里。它应该比二级标题更小。

#### 四级标题 - 较小的标题

四级标题用于更细分的内容组织。

##### 五级标题 - 很小的标题

五级标题通常用于非常详细的分级。

###### 六级标题 - 最小的标题

六级标题是最小的标题级别。

## 对比效果

现在你可以看到：

- **一级标题**：最大，最醒目
- **二级标题**：第二大
- **三级标题**：中等大小
- **四级标题**：较小
- **五级标题**：很小
- **六级标题**：最小

每个级别的标题都应该有明显的大小区别！`,
  category: '测试',
  tags: ['测试', '标题', 'Markdown'],
  cover: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop',
  featured: true,
  slug: 'heading-levels-test',
  publishedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  views: 0,
  likes: 0,
  comments: 0
};

// 获取现有文章或创建新数组
let posts = [];
try {
  const existingData = localStorage.getItem('blogflow_posts');
  posts = existingData ? JSON.parse(existingData) : [];
} catch (error) {
  console.log('无法读取现有数据，创建新数组');
  posts = [];
}

// 检查是否已经存在测试文章
const existingTestIndex = posts.findIndex(p => p.slug === 'heading-levels-test');
if (existingTestIndex !== -1) {
  // 更新现有文章
  posts[existingTestIndex] = testArticle;
  console.log('✅ 更新了现有的标题测试文章');
} else {
  // 添加新文章
  posts.push(testArticle);
  console.log('✅ 添加了新的标题测试文章');
}

// 保存到localStorage
localStorage.setItem('blogflow_posts', JSON.stringify(posts));

console.log('📝 测试文章内容预览:');
console.log(testArticle.content.substring(0, 200) + '...');
console.log('🔗 文章访问地址: /blog/heading-levels-test');