# UI 组件使用指南

## 组件概览

本项目包含三个核心 UI 组件，专注于纯 UI 功能，无业务逻辑耦合：

- **Button**: 按钮组件，支持多种变体和状态
- **Card**: 卡片组件，用于内容展示
- **Modal**: 模态框组件，用于弹窗显示

## Button 组件

### 基础用法

```vue
<template>
  <!-- 基础按钮 -->
  <UiButton>默认按钮</UiButton>
  
  <!-- 不同变体 -->
  <UiButton variant="solid" color="primary">主要按钮</UiButton>
  <UiButton variant="outline" color="secondary">次要按钮</UiButton>
  <UiButton variant="ghost" color="neutral">透明按钮</UiButton>
  <UiButton variant="link" color="primary">链接按钮</UiButton>
  
  <!-- 不同尺寸 -->
  <UiButton size="xs">超小按钮</UiButton>
  <UiButton size="sm">小按钮</UiButton>
  <UiButton size="md">中等按钮</UiButton>
  <UiButton size="lg">大按钮</UiButton>
  <UiButton size="xl">超大按钮</UiButton>
  
  <!-- 带图标 -->
  <UiButton icon="heroicons:plus" color="primary">添加</UiButton>
  <UiButton icon="heroicons:arrow-right" icon-right color="primary">继续</UiButton>
  
  <!-- 状态 -->
  <UiButton disabled>禁用按钮</UiButton>
  <UiButton loading>加载中</UiButton>
  
  <!-- 块级按钮 -->
  <UiButton block color="primary">全宽按钮</UiButton>
  
  <!-- 链接按钮 -->
  <UiButton to="/blog" color="primary">内部链接</UiButton>
  <UiButton href="https://example.com" target="_blank" color="primary">外部链接</UiButton>
</template>
```

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| variant | `'solid' \| 'outline' \| 'ghost' \| 'soft' \| 'link'` | `'solid'` | 按钮变体 |
| color | `'primary' \| 'secondary' \| 'success' \| 'warning' \| 'error' \| 'neutral'` | `'primary'` | 颜色主题 |
| size | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | 尺寸 |
| label | `string` | - | 按钮文本 |
| icon | `string` | - | 图标名称 |
| iconRight | `boolean` | `false` | 图标是否在右侧 |
| disabled | `boolean` | `false` | 是否禁用 |
| loading | `boolean` | `false` | 是否加载中 |
| block | `boolean` | `false` | 是否为块级按钮 |
| to | `string \| object` | - | 内部链接地址 |
| href | `string` | - | 外部链接地址 |

### Events

| 事件 | 参数 | 说明 |
|------|------|------|
| click | `(event: MouseEvent)` | 点击事件 |

## Card 组件

### 基础用法

```vue
<template>
  <!-- 基础卡片 -->
  <UiCard title="卡片标题" subtitle="卡片副标题">
    <p>这是卡片内容</p>
  </UiCard>
  
  <!-- 不同变体 -->
  <UiCard variant="bordered" title="边框卡片">内容</UiCard>
  <UiCard variant="shadow" title="阴影卡片">内容</UiCard>
  <UiCard variant="elevated" title="高亮卡片">内容</UiCard>
  
  <!-- 带图片 -->
  <UiCard 
    title="图片卡片"
    image="https://example.com/image.jpg"
    image-alt="示例图片"
  >
    <p>卡片内容</p>
  </UiCard>
  
  <!-- 可交互 -->
  <UiCard hoverable clickable @click="handleCardClick">
    <p>可点击的卡片</p>
  </UiCard>
  
  <!-- 自定义插槽 -->
  <UiCard>
    <template #header>
      <div class="flex items-center justify-between">
        <h3>自定义头部</h3>
        <UiButton size="sm">操作</UiButton>
      </div>
    </template>
    
    <p>卡片内容</p>
    
    <template #footer>
      <div class="flex justify-end space-x-2">
        <UiButton variant="ghost" size="sm">取消</UiButton>
        <UiButton size="sm">确定</UiButton>
      </div>
    </template>
  </UiCard>
</template>
```

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| title | `string` | - | 卡片标题 |
| subtitle | `string` | - | 卡片副标题 |
| image | `string` | - | 图片地址 |
| imageAlt | `string` | - | 图片替代文本 |
| variant | `'default' \| 'bordered' \| 'shadow' \| 'elevated' \| 'flat'` | `'default'` | 卡片变体 |
| hoverable | `boolean` | `false` | 是否可悬停 |
| clickable | `boolean` | `false` | 是否可点击 |
| rounded | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'` | 圆角大小 |
| padding | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | 内边距大小 |

### Slots

| 插槽 | 说明 |
|------|------|
| default | 默认内容 |
| header | 头部内容 |
| image | 图片内容 |
| footer | 页脚内容 |
| actions | 操作按钮 |

## Modal 组件

### 基础用法

```vue
<template>
  <div>
    <UiButton @click="showModal = true">打开模态框</UiButton>
    
    <!-- 基础模态框 -->
    <UiModal 
      v-model="showModal"
      title="模态框标题"
      subtitle="这是一个模态框的副标题"
    >
      <p>这是模态框的内容</p>
      
      <template #footer>
        <div class="flex justify-end space-x-2">
          <UiButton variant="ghost" @click="showModal = false">取消</UiButton>
          <UiButton @click="handleConfirm">确定</UiButton>
        </div>
      </template>
    </UiModal>
    
    <!-- 不同尺寸 -->
    <UiModal v-model="showLargeModal" size="lg" title="大模态框">
      <p>大尺寸的模态框内容</p>
    </UiModal>
    
    <!-- 全屏模态框 -->
    <UiModal v-model="showFullscreenModal" fullscreen title="全屏模态框">
      <p>全屏显示的模态框</p>
    </UiModal>
    
    <!-- 自定义位置 -->
    <UiModal v-model="showTopModal" position="top" title="顶部模态框">
      <p>从顶部显示的模态框</p>
    </UiModal>
  </div>
</template>

<script setup>
const showModal = ref(false)
const showLargeModal = ref(false)
const showFullscreenModal = ref(false)
const showTopModal = ref(false)

const handleConfirm = () => {
  // 处理确认逻辑
  showModal.value = false
}
</script>
```

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | `boolean` | - | 控制显示/隐藏 |
| title | `string` | - | 模态框标题 |
| subtitle | `string` | - | 模态框副标题 |
| size | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| 'full'` | `'md'` | 尺寸 |
| showClose | `boolean` | `true` | 是否显示关闭按钮 |
| closeOnOverlay | `boolean` | `true` | 点击遮罩是否关闭 |
| closeOnEscape | `boolean` | `true` | ESC 键是否关闭 |
| position | `'center' \| 'top' \| 'bottom'` | `'center'` | 显示位置 |
| fullscreen | `boolean` | `false` | 是否全屏显示 |

### Events

| 事件 | 参数 | 说明 |
|------|------|------|
| update:modelValue | `(value: boolean)` | 更新显示状态 |
| close | - | 关闭事件 |
| open | - | 打开事件 |
| escape | - | ESC 键事件 |

### Slots

| 插槽 | 说明 |
|------|------|
| default | 默认内容 |
| header | 头部内容 |
| footer | 页脚内容 |

## 使用注意事项

1. **纯 UI 功能**：这些组件只负责 UI 展示和基础交互，不包含业务逻辑
2. **事件处理**：所有业务逻辑都通过事件回调处理
3. **样式定制**：使用 Tailwind CSS 类进行样式定制
4. **响应式设计**：所有组件都支持响应式设计
5. **无障碍访问**：组件遵循无障碍访问标准

## 扩展建议

需要更多组件时，可以参考这些组件的设计模式：
- 使用 TypeScript 定义清晰的 Props 接口
- 提供丰富的插槽支持
- 支持多种变体和状态
- 遵循一致的命名规范
- 实现响应式和无障碍访问
