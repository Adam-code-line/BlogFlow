<!-- 本地图标组件 - 当网络图标不可用时的备选方案 -->
<template>
  <span 
    :class="[
      'inline-flex items-center justify-center',
      sizeClass,
      colorClass
    ]"
    v-bind="$attrs"
  >
    <!-- 使用本地 SVG 图标 -->
    <svg
      :width="size"
      :height="size"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round" 
      stroke-linejoin="round"
    >
      <!-- 根据图标名称显示不同的SVG路径 -->
      <g v-if="name === 'home'">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9,22 9,12 15,12 15,22"/>
      </g>
      
      <g v-else-if="name === 'user'">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </g>
      
      <g v-else-if="name === 'users'">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="m22 21-3.5-3.5"/>
        <circle cx="17" cy="17" r="3"/>
      </g>
      
      <g v-else-if="name === 'document' || name === 'document-text'">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14,2 14,8 20,8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10,9 9,9 8,9"/>
      </g>
      
      <g v-else-if="name === 'eye'">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </g>
      
      <g v-else-if="name === 'pencil' || name === 'edit'">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="m18.5 2.5-3 3L22 12l-5.5 5.5-3-3"/>
      </g>
      
      <g v-else-if="name === 'trash' || name === 'delete'">
        <polyline points="3,6 5,6 21,6"/>
        <path d="m19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        <line x1="10" y1="11" x2="10" y2="17"/>
        <line x1="14" y1="11" x2="14" y2="17"/>
      </g>
      
      <g v-else-if="name === 'plus' || name === 'add'">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="16"/>
        <line x1="8" y1="12" x2="16" y2="12"/>
      </g>
      
      <g v-else-if="name === 'search' || name === 'magnifying-glass'">
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.35-4.35"/>
      </g>
      
      <g v-else-if="name === 'arrow-path' || name === 'refresh'">
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
        <path d="M21 3v5h-5"/>
        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
        <path d="M3 21v-5h5"/>
      </g>
      
      <g v-else-if="name === 'chevron-down'">
        <polyline points="6,9 12,15 18,9"/>
      </g>
      
      <g v-else-if="name === 'chevron-up'">
        <polyline points="18,15 12,9 6,15"/>
      </g>
      
      <g v-else-if="name === 'chevron-left'">
        <polyline points="15,18 9,12 15,6"/>
      </g>
      
      <g v-else-if="name === 'chevron-right'">
        <polyline points="9,6 15,12 9,18"/>
      </g>
      
      <g v-else-if="name === 'arrow-trending-up'">
        <polyline points="22,12 18,8 13,13 9,9 2,16"/>
        <polyline points="16,8 22,8 22,14"/>
      </g>
      
      <g v-else-if="name === 'arrow-trending-down'">
        <polyline points="22,17 13.5,8.5 8.5,13.5 2,7"/>
        <polyline points="16,17 22,17 22,11"/>
      </g>
      
      <!-- 默认图标 - 如果没有匹配的图标 -->
      <g v-else>
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </g>
    </svg>
  </span>
</template>

<script setup lang="ts">
interface Props {
  name: string
  size?: number | string
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 24,
  color: 'currentColor'
})

// 计算尺寸类
const sizeClass = computed(() => {
  const sizeNum = typeof props.size === 'string' ? parseInt(props.size) : props.size
  if (sizeNum <= 16) return 'w-4 h-4'
  if (sizeNum <= 20) return 'w-5 h-5'
  if (sizeNum <= 24) return 'w-6 h-6'
  if (sizeNum <= 32) return 'w-8 h-8'
  return 'w-10 h-10'
})

// 计算颜色类
const colorClass = computed(() => {
  if (props.color === 'currentColor') return ''
  if (props.color.startsWith('#') || props.color.startsWith('rgb')) {
    return ''
  }
  return `text-${props.color}`
})
</script>