<template>
  <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
    <!-- 表头操作栏 -->
    <div v-if="showHeader" class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <!-- 搜索框 -->
          <div v-if="searchable" class="flex-1 max-w-md">
            <UInput
              v-model="searchQuery"
              placeholder="搜索..."
              icon="i-heroicons-magnifying-glass"
              @input="handleSearch"
            />
          </div>
          
          <!-- 筛选器 -->
          <div v-if="filters.length" class="flex items-center space-x-2">
            <USelect
              v-for="filter in filters"
              :key="filter.key"
              v-model="filterValues[filter.key]"
              :options="filter.options"
              :placeholder="filter.placeholder"
              @change="handleFilter(filter.key, $event)"
            />
          </div>
        </div>
        
        <!-- 右侧操作 -->
        <div class="flex items-center space-x-2">
          <!-- 自定义操作按钮 -->
          <slot name="actions" />
          
          <!-- 导出按钮 -->
          <UButton
            v-if="exportable"
            variant="outline"
            size="sm"
            icon="i-heroicons-arrow-down-tray"
            @click="exportData"
          >
            导出
          </UButton>
          
          <!-- 刷新按钮 -->
          <UButton
            variant="ghost"
            size="sm"
            icon="i-heroicons-arrow-path"
            @click="refresh"
          >
            刷新
          </UButton>
        </div>
      </div>
    </div>

    <!-- 表格 -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <!-- 表头 -->
        <thead class="bg-gray-50 dark:bg-gray-700/50">
          <tr>
            <!-- 全选复选框 -->
            <th v-if="selectable" class="px-6 py-3 w-12">
              <UCheckbox
                v-model="selectAll"
                @update:model-value="toggleSelectAll"
              />
            </th>
            
            <!-- 列标题 -->
            <th
              v-for="column in columns"
              :key="column.key"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              :class="column.sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600' : ''"
              @click="column.sortable && handleSort(column.key)"
            >
              <div class="flex items-center space-x-1">
                <span>{{ column.title }}</span>
                <Icon
                  v-if="column.sortable && sortBy === column.key"
                  :name="sortOrder === 'asc' ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
                  class="h-4 w-4"
                />
              </div>
            </th>
            
            <!-- 操作列 -->
            <th v-if="hasActions" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              操作
            </th>
          </tr>
        </thead>
        
        <!-- 表体 -->
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <!-- 加载状态 -->
          <tr v-if="loading">
            <td :colspan="totalColumns" class="px-6 py-12 text-center">
              <div class="flex items-center justify-center">
                <Icon name="i-heroicons-arrow-path" class="h-6 w-6 animate-spin text-gray-400 mr-2" />
                <span class="text-gray-500 dark:text-gray-400">加载中...</span>
              </div>
            </td>
          </tr>
          
          <!-- 空数据状态 -->
          <tr v-else-if="!filteredData.length">
            <td :colspan="totalColumns" class="px-6 py-12 text-center">
              <div class="text-gray-500 dark:text-gray-400">
                <Icon name="i-heroicons-inbox" class="h-12 w-12 mx-auto mb-4" />
                <p class="text-lg font-medium mb-2">{{ emptyText }}</p>
                <p class="text-sm">{{ emptyDescription }}</p>
              </div>
            </td>
          </tr>
          
          <!-- 数据行 -->
          <tr
            v-else
            v-for="(item, index) in paginatedData"
            :key="getRowKey(item, index)"
            class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            :class="selectedRows.includes(getRowKey(item, index)) ? 'bg-blue-50 dark:bg-blue-900/20' : ''"
          >
            <!-- 选择复选框 -->
            <td v-if="selectable" class="px-6 py-4 w-12">
              <UCheckbox
                :model-value="selectedRows.includes(getRowKey(item, index))"
                @change="toggleRowSelection(item, index)"
              />
            </td>
            
            <!-- 数据列 -->
            <td
              v-for="column in columns"
              :key="column.key"
              class="px-6 py-4 whitespace-nowrap"
              :class="column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'"
            >
              <!-- 自定义插槽 -->
              <slot
                v-if="$slots[`column-${column.key}`]"
                :name="`column-${column.key}`"
                :item="item"
                :index="index"
                :value="getNestedValue(item, column.key)"
              />
              
              <!-- 默认渲染 -->
              <span
                v-else
                :class="column.cellClass"
              >
                {{ formatCellValue(item, column) }}
              </span>
            </td>
            
            <!-- 操作列 -->
            <td v-if="hasActions" class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <slot name="actions" :item="item" :index="index">
                <UDropdown v-if="actions.length" :items="getActionItems(item, index)">
                  <UButton
                    variant="ghost"
                    size="sm"
                    icon="i-heroicons-ellipsis-horizontal"
                  />
                </UDropdown>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页 -->
    <div v-if="pageable && filteredData.length" class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-500 dark:text-gray-400">
          显示第 {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, filteredData.length) }} 项，共 {{ filteredData.length }} 项
          <span v-if="selectedRows.length" class="ml-2">
            (已选择 {{ selectedRows.length }} 项)
          </span>
        </div>
        
        <UPagination
          v-model="currentPage"
          :page-count="totalPages"
          :total="filteredData.length"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Column {
  key: string
  title: string
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
  width?: string
  cellClass?: string
  formatter?: (value: any, item: any) => string
}

interface Filter {
  key: string
  placeholder: string
  options: Array<{ label: string; value: string }>
}

interface Action {
  label: string
  icon?: string
  handler: (item: any, index: number) => void
  color?: string
  disabled?: (item: any) => boolean
}

interface Props {
  data: any[]
  columns: Column[]
  loading?: boolean
  searchable?: boolean
  selectable?: boolean
  pageable?: boolean
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  filters?: Filter[]
  actions?: Action[]
  exportable?: boolean
  showHeader?: boolean
  emptyText?: string
  emptyDescription?: string
  rowKey?: string | ((item: any, index: number) => string)
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  searchable: true,
  selectable: false,
  pageable: true,
  pageSize: 10,
  sortBy: '',
  sortOrder: 'asc',
  filters: () => [],
  actions: () => [],
  exportable: false,
  showHeader: true,
  emptyText: '暂无数据',
  emptyDescription: '当前没有任何数据',
  rowKey: 'id'
})

const emit = defineEmits<{
  refresh: []
  search: [query: string]
  sort: [column: string, order: 'asc' | 'desc']
  filter: [filters: Record<string, any>]
  selectionChange: [selectedRows: any[]]
  export: [data: any[]]
}>()

// 响应式数据
const searchQuery = ref('')
const currentPage = ref(1)
const selectedRows = ref<string[]>([])
const filterValues = ref<Record<string, any>>({})
const sortByInternal = ref(props.sortBy)
const sortOrderInternal = ref(props.sortOrder)

// 计算属性
const totalColumns = computed(() => {
  let count = props.columns.length
  if (props.selectable) count++
  if (hasActions.value) count++
  return count
})

const hasActions = computed(() => {
  return props.actions.length > 0 || !!useSlots().actions
})

const filteredData = computed(() => {
  let result = [...props.data]
  
  // 搜索过滤
  if (searchQuery.value && props.searchable) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(item =>
      props.columns.some(column => {
        const value = getNestedValue(item, column.key)
        return String(value).toLowerCase().includes(query)
      })
    )
  }
  
  // 筛选器过滤
  Object.entries(filterValues.value).forEach(([key, value]) => {
    if (value) {
      result = result.filter(item => getNestedValue(item, key) === value)
    }
  })
  
  // 排序
  if (sortByInternal.value) {
    result.sort((a, b) => {
      const aValue = getNestedValue(a, sortByInternal.value)
      const bValue = getNestedValue(b, sortByInternal.value)
      
      let comparison = 0
      if (aValue < bValue) comparison = -1
      if (aValue > bValue) comparison = 1
      
      return sortOrderInternal.value === 'desc' ? -comparison : comparison
    })
  }
  
  return result
})

const totalPages = computed(() => Math.ceil(filteredData.value.length / props.pageSize))

const paginatedData = computed(() => {
  if (!props.pageable) return filteredData.value
  
  const start = (currentPage.value - 1) * props.pageSize
  const end = start + props.pageSize
  return filteredData.value.slice(start, end)
})

const selectAll = computed({
  get: () => selectedRows.value.length === paginatedData.value.length && paginatedData.value.length > 0,
  set: (value) => toggleSelectAll(value)
})

// 方法
const getRowKey = (item: any, index: number) => {
  if (typeof props.rowKey === 'function') {
    return props.rowKey(item, index)
  }
  return item[props.rowKey] || String(index)
}

const getNestedValue = (obj: any, path: string) => {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

const formatCellValue = (item: any, column: Column) => {
  const value = getNestedValue(item, column.key)
  
  if (column.formatter) {
    return column.formatter(value, item)
  }
  
  if (value === null || value === undefined) {
    return '-'
  }
  
  return String(value)
}

const handleSearch = () => {
  currentPage.value = 1
  emit('search', searchQuery.value)
}

const handleSort = (column: string) => {
  if (sortByInternal.value === column) {
    sortOrderInternal.value = sortOrderInternal.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortByInternal.value = column
    sortOrderInternal.value = 'asc'
  }
  
  currentPage.value = 1
  emit('sort', sortByInternal.value, sortOrderInternal.value)
}

const handleFilter = (key: string, value: any) => {
  currentPage.value = 1
  emit('filter', filterValues.value)
}

const toggleSelectAll = (value?: boolean | 'indeterminate') => {
  const shouldSelectAll = typeof value === 'boolean' ? value : selectAll.value
  if (shouldSelectAll) {
    selectedRows.value = paginatedData.value.map((item, index) => getRowKey(item, index))
  } else {
    selectedRows.value = []
  }
  
  emit('selectionChange', getSelectedItems())
}

const toggleRowSelection = (item: any, index: number) => {
  const key = getRowKey(item, index)
  const selectedIndex = selectedRows.value.indexOf(key)
  
  if (selectedIndex > -1) {
    selectedRows.value.splice(selectedIndex, 1)
  } else {
    selectedRows.value.push(key)
  }
  
  emit('selectionChange', getSelectedItems())
}

const getSelectedItems = () => {
  return props.data.filter((item, index) => 
    selectedRows.value.includes(getRowKey(item, index))
  )
}

const getActionItems = (item: any, index: number) => {
  return [props.actions.filter(action => !action.disabled?.(item)).map(action => ({
    label: action.label,
    icon: action.icon,
    click: () => action.handler(item, index)
  }))]
}

const refresh = () => {
  emit('refresh')
}

const exportData = () => {
  emit('export', filteredData.value)
}

// 初始化筛选器值
onMounted(() => {
  props.filters.forEach(filter => {
    filterValues.value[filter.key] = ''
  })
})

// 暴露方法
defineExpose({
  getSelectedItems,
  clearSelection: () => {
    selectedRows.value = []
  },
  selectAll: toggleSelectAll,
  refresh
})
</script>