# useCodeTheme 使用指南

`useCodeTheme` 是一个强大的组合式函数，用于管理博客中代码块的主题。它提供了多种预设主题，支持自动切换和手动控制。

## 🎨 可用主题

- **github**: GitHub 风格的浅色主题
- **vscode**: VS Code 风格的深色主题  
- **highContrast**: 高对比度主题（适合视觉障碍用户）
- **solarizedLight**: Solarized Light 主题
- **nord**: Nord 主题

## 📦 基础使用

### 1. 在组件中使用

```vue
<template>
  <div>
    <h2>当前主题：{{ currentTheme }}</h2>
    <p>是否深色模式：{{ isDark }}</p>
    
    <!-- 主题切换按钮 -->
    <div class="theme-controls">
      <button @click="previousTheme">上一个主题</button>
      <button @click="nextTheme">下一个主题</button>
      <button @click="resetToDefault">重置为默认</button>
    </div>
    
    <!-- 主题选择器 -->
    <select v-model="selectedTheme" @change="handleThemeChange">
      <option v-for="theme in availableThemes" :key="theme" :value="theme">
        {{ getTheme(theme)?.name || theme }}
      </option>
    </select>
  </div>
</template>

<script setup>
// 导入组合式函数
const {
  currentTheme,
  isDark,
  availableThemes,
  applyTheme,
  nextTheme,
  previousTheme,
  resetToDefault,
  getTheme
} = useCodeTheme()

// 本地状态
const selectedTheme = ref('')

// 监听当前主题变化，同步到选择器
watch(currentTheme, (newTheme) => {
  selectedTheme.value = newTheme
}, { immediate: true })

// 处理主题切换
const handleThemeChange = () => {
  if (selectedTheme.value) {
    applyTheme(selectedTheme.value)
  }
}
</script>
```

### 2. 在页面中自动初始化

```vue
<script setup>
// 页面加载时自动初始化主题系统
const { initialize } = useCodeTheme()

onMounted(() => {
  initialize()
})
</script>
```

### 3. 高级主题选择器组件

```vue
<template>
  <div class="theme-selector">
    <h3>选择代码主题</h3>
    <div class="theme-grid">
      <div
        v-for="option in themeOptions"
        :key="option.value"
        class="theme-option"
        :class="{ active: currentTheme === option.value }"
        @click="handleThemeChange(option.value)"
      >
        <!-- 主题预览 -->
        <div class="theme-preview" :style="option.preview">
          <span>function example() {</span>
          <span>  return "Hello World"</span>
          <span>}</span>
        </div>
        <span class="theme-name">{{ option.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const { 
  currentTheme, 
  themeOptions, 
  handleThemeChange 
} = useCodeThemeForComponent()
</script>

<style scoped>
.theme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.theme-option {
  cursor: pointer;
  border: 2px solid transparent;
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.2s;
}

.theme-option:hover {
  border-color: #3b82f6;
}

.theme-option.active {
  border-color: #1d4ed8;
  background: #eff6ff;
}

.theme-preview {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875rem;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.theme-preview span {
  display: block;
  line-height: 1.5;
}

.theme-name {
  font-weight: 500;
  text-align: center;
  display: block;
}
</style>
```

## 🔧 API 参考

### 返回值

| 属性 | 类型 | 描述 |
|------|------|------|
| `currentTheme` | `Ref<string>` | 当前应用的主题名称 |
| `isDark` | `Ref<boolean>` | 是否为深色模式 |
| `availableThemes` | `ComputedRef<string[]>` | 可用主题列表 |
| `getCurrentTheme` | `ComputedRef<CodeTheme \| null>` | 当前主题对象 |

### 方法

| 方法 | 参数 | 描述 |
|------|------|------|
| `applyTheme` | `(themeName: string, forceDark?: boolean)` | 应用指定主题 |
| `nextTheme` | `()` | 切换到下一个主题 |
| `previousTheme` | `()` | 切换到上一个主题 |
| `resetToDefault` | `()` | 重置为默认主题 |
| `autoApply` | `()` | 根据系统主题自动应用 |
| `getTheme` | `(themeName: string)` | 获取主题配置对象 |
| `getThemePreviewCSS` | `(themeName: string)` | 获取主题预览CSS |
| `detectSystemTheme` | `()` | 检测系统主题 |
| `initialize` | `()` | 初始化主题系统 |

## 🎯 使用场景

### 1. 主题切换按钮

```vue
<template>
  <button @click="toggleTheme" class="theme-toggle-btn">
    <Icon :name="isDark ? 'sun' : 'moon'" />
    {{ isDark ? '浅色主题' : '深色主题' }}
  </button>
</template>

<script setup>
const { isDark, applyTheme } = useCodeTheme()

const toggleTheme = () => {
  const newTheme = isDark.value ? 'github' : 'vscode'
  applyTheme(newTheme)
}
</script>
```

### 2. 设置页面

```vue
<template>
  <div class="settings-page">
    <section class="code-theme-section">
      <h3>代码主题设置</h3>
      
      <!-- 自动模式 -->
      <label>
        <input 
          type="checkbox" 
          v-model="autoMode" 
          @change="handleAutoModeChange"
        >
        跟随系统主题
      </label>
      
      <!-- 手动选择 -->
      <div v-if="!autoMode" class="manual-selection">
        <div class="theme-category">
          <h4>浅色主题</h4>
          <select v-model="lightTheme" @change="applyTheme(lightTheme, false)">
            <option value="github">GitHub</option>
            <option value="solarizedLight">Solarized Light</option>
          </select>
        </div>
        
        <div class="theme-category">
          <h4>深色主题</h4>
          <select v-model="darkTheme" @change="applyTheme(darkTheme, true)">
            <option value="vscode">VS Code</option>
            <option value="nord">Nord</option>
            <option value="highContrast">High Contrast</option>
          </select>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const { applyTheme, autoApply, detectSystemTheme } = useCodeTheme()

const autoMode = ref(true)
const lightTheme = ref('github')
const darkTheme = ref('vscode')

const handleAutoModeChange = () => {
  if (autoMode.value) {
    autoApply()
  } else {
    const isDark = detectSystemTheme()
    const theme = isDark ? darkTheme.value : lightTheme.value
    applyTheme(theme, isDark)
  }
}
</script>
```

### 3. 博客文章页面

```vue
<template>
  <article class="blog-post">
    <!-- 文章工具栏 -->
    <div class="article-toolbar">
      <div class="theme-controls">
        <button @click="previousTheme" title="上一个主题">
          <Icon name="chevron-left" />
        </button>
        
        <span class="current-theme-name">
          {{ getCurrentTheme?.name || '未知主题' }}
        </span>
        
        <button @click="nextTheme" title="下一个主题">
          <Icon name="chevron-right" />
        </button>
      </div>
    </div>
    
    <!-- 文章内容 -->
    <div class="prose">
      <ContentRenderer :value="post" />
    </div>
  </article>
</template>

<script setup>
const { 
  getCurrentTheme, 
  nextTheme, 
  previousTheme 
} = useCodeTheme()

// 文章数据
const { post } = defineProps<{ post: any }>()
</script>
```

## 🎨 自定义主题

### 1. 扩展现有主题

```typescript
// 在 utils/codeTheme.ts 中添加新主题
import { codeThemes } from '~/utils/codeTheme'

// 添加自定义主题
codeThemes.dracula = {
  name: 'Dracula',
  variables: {
    codeBg: '#282a36',
    codeBorder: '#44475a',
    codeText: '#f8f8f2',
    codeComment: '#6272a4',
    codeKeyword: '#ff79c6',
    codeString: '#f1fa8c',
    codeNumber: '#bd93f9',
    codeFunction: '#50fa7b',
    codeOperator: '#f8f8f2',
    // ... 其他颜色配置
  }
}
```

### 2. 运行时添加主题

```vue
<script setup>
const { getTheme } = useCodeTheme()

// 动态添加主题
const addCustomTheme = () => {
  const customTheme = {
    name: 'My Theme',
    variables: {
      // 自定义颜色配置
    }
  }
  
  // 添加到主题列表
  codeThemes.myTheme = customTheme
}
</script>
```

## 🔄 主题持久化

主题选择会自动保存到 `localStorage`，下次访问时会自动恢复：

```javascript
// 手动保存主题
localStorage.setItem('code-theme', 'vscode')

// 手动读取主题
const savedTheme = localStorage.getItem('code-theme')
```

## 🌐 系统主题集成

`useCodeTheme` 会自动检测系统的深色/浅色模式偏好，并应用相应的默认主题：

- 浅色模式 → GitHub 主题
- 深色模式 → VS Code 主题

可以通过 `watchSystemTheme()` 监听系统主题变化，实现自动切换。

## 🛠️ 故障排除

### 主题不生效

1. 确保在 `onMounted` 中调用了 `initialize()`
2. 检查 CSS 文件是否正确加载
3. 确认代码块有正确的 class 名称

### 主题切换延迟

主题应用是同步的，如果有延迟可能是因为：
1. CSS 变量没有正确设置
2. 样式被其他 CSS 覆盖
3. 浏览器缓存问题

### 自定义主题不显示

1. 确保主题对象格式正确
2. 检查所有必需的 CSS 变量都已定义
3. 验证主题名称没有冲突

通过以上方式，你就可以完全控制博客的代码高亮主题了！🎉
