# Plugins 使用指南

本项目包含两个重要的客户端插件，用于增强博客的功能性和用户体验。

## 1. Analytics Plugin（分析工具插件）

### 功能说明
- **用途**：追踪网站访问数据、用户行为、页面浏览等
- **支持平台**：Google Analytics、百度统计
- **自动功能**：页面浏览追踪、路由变化监听
- **手动追踪**：自定义事件、搜索、表单提交等

### 配置方法

#### 1. 环境变量设置
在 `.env` 文件中添加：
```bash
# Google Analytics
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# 百度统计
BAIDU_ANALYTICS_ID=xxxxxxxxxxxxxxxxxx
```

#### 2. 自动功能
插件会自动：
- 在生产环境启用（开发环境仅记录日志）
- 追踪页面浏览
- 监听路由变化

#### 3. 手动追踪示例

```vue
<template>
  <div>
    <!-- 搜索功能 -->
    <input 
      v-model="searchQuery" 
      @keyup.enter="handleSearch"
      placeholder="搜索文章..."
    >
    
    <!-- 外部链接 -->
    <a 
      href="https://example.com" 
      @click="trackLinkClick"
      target="_blank"
    >
      访问外部链接
    </a>
    
    <!-- 表单提交 -->
    <form @submit="handleFormSubmit">
      <button type="submit">提交</button>
    </form>
  </div>
</template>

<script setup>
// 获取分析工具实例
const { $analytics } = useNuxtApp()

const searchQuery = ref('')

// 追踪搜索
const handleSearch = () => {
  $analytics.trackSearch(searchQuery.value, 'blog_search')
}

// 追踪链接点击
const trackLinkClick = (event) => {
  const link = event.target
  $analytics.trackLinkClick(link.href, link.textContent)
}

// 追踪表单提交
const handleFormSubmit = (event) => {
  event.preventDefault()
  
  try {
    // 表单处理逻辑
    $analytics.trackFormSubmit('contact_form', true)
  } catch (error) {
    $analytics.trackFormSubmit('contact_form', false)
  }
}

// 追踪文章阅读
onMounted(() => {
  const articleTitle = 'Vue 3 最佳实践'
  const category = 'Frontend'
  $analytics.trackArticleRead(articleTitle, category)
})
</script>
```

### API 参考

```typescript
// 页面浏览追踪
$analytics.trackPageView({
  path: '/blog/article-slug',
  title: '文章标题',
  referrer: document.referrer
})

// 自定义事件追踪
$analytics.trackEvent({
  action: 'download',        // 事件动作
  category: 'engagement',    // 事件分类
  label: 'PDF文档',          // 事件标签
  value: 1                   // 事件值（可选）
})

// 搜索追踪
$analytics.trackSearch('Vue.js', 'site_search')

// 文章阅读追踪
$analytics.trackArticleRead('文章标题', '技术分类')

// 链接点击追踪
$analytics.trackLinkClick('https://github.com', 'GitHub链接')

// 表单提交追踪
$analytics.trackFormSubmit('联系表单', true) // true=成功，false=失败
```

## 2. Highlight Plugin（代码高亮插件）

### 功能说明
- **用途**：为博客文章中的代码块提供增强功能
- **基础**：基于 Nuxt Content 的内置代码高亮
- **增强功能**：复制按钮、语言标签、样式优化

### 自动功能
插件会自动：
- 为所有代码块添加复制按钮
- 添加编程语言标签
- 优化代码块样式
- 支持一键复制代码

### 使用示例

#### 1. Markdown 中的代码块
```markdown
\`\`\`javascript
// 这是 JavaScript 代码
function greet(name) {
  console.log(`Hello, ${name}!`)
}

greet('World')
\`\`\`

\`\`\`vue
<!-- 这是 Vue 组件 -->
<template>
  <div class="hello">
    <h1>{{ message }}</h1>
  </div>
</template>

<script setup>
const message = ref('Hello Vue!')
</script>
\`\`\`
```

#### 2. 手动调用 API
```vue
<script setup>
// 获取代码高亮实例
const { $codeHighlight } = useNuxtApp()

onMounted(() => {
  // 手动增强代码块
  $codeHighlight.enhanceCodeBlocks()
  
  // 添加语言标签
  $codeHighlight.addCodeTitles()
})
</script>
```

### 支持的语言
插件支持以下编程语言的标签显示：
- JavaScript/TypeScript
- Vue/HTML/CSS/SCSS
- Python/Java/Go/Rust/PHP
- JSON/YAML/XML/Markdown
- Bash/Shell/SQL/Docker

### 样式定制
可以通过 CSS 自定义代码块样式：

```css
/* 自定义代码块背景 */
.prose pre {
  background: #1e293b !important;
  color: #e2e8f0 !important;
}

/* 自定义复制按钮 */
.copy-button {
  background: rgba(59, 130, 246, 0.1) !important;
  border-color: rgb(59, 130, 246) !important;
  color: rgb(59, 130, 246) !important;
}

/* 自定义语言标签 */
.language-label {
  background: rgba(16, 185, 129, 0.1) !important;
  color: rgb(16, 185, 129) !important;
}
```

## 使用建议

### Analytics 最佳实践
1. **隐私保护**：确保符合 GDPR 等隐私法规
2. **开发环境**：在开发环境禁用真实追踪，仅输出日志
3. **事件命名**：使用一致的事件命名规范
4. **性能考虑**：避免过度追踪影响性能

### Code Highlight 最佳实践
1. **语言标识**：在代码块中明确指定编程语言
2. **代码质量**：确保代码示例的正确性和可读性
3. **长代码**：对于很长的代码，考虑使用折叠功能
4. **移动端**：确保代码块在移动设备上的可读性

## 故障排除

### Analytics 常见问题
1. **数据不显示**：检查环境变量配置和网络连接
2. **开发环境追踪**：确认 `NODE_ENV=production`
3. **控制台错误**：检查 Analytics ID 格式是否正确

### Code Highlight 常见问题
1. **复制按钮不工作**：检查 HTTPS 环境（Clipboard API 要求）
2. **样式异常**：确认 Tailwind CSS 正确加载
3. **语言识别错误**：在代码块中明确指定语言

## 扩展功能

### 添加新的分析事件
```typescript
// 在 analytics.client.ts 中添加新方法
trackVideoPlay(videoTitle: string, duration: number) {
  this.trackEvent({
    action: 'play_video',
    category: 'media',
    label: videoTitle,
    value: duration
  })
}
```

### 添加代码块新功能
```typescript
// 在 highlight.client.ts 中添加新方法
addLineNumbers() {
  // 实现行号功能
}
```

通过合理使用这两个插件，可以大大增强博客的用户体验和数据分析能力！
