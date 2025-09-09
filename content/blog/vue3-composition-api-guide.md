---
title: "Vue.js 3 组合式 API 完全指南"
description: "深入探索 Vue.js 3 的组合式 API，从基础概念到高级使用技巧，帮助你构建更好的 Vue 应用。"
publishedAt: "2025-01-20"
updatedAt: "2025-01-20"
author:
  name: "BlogFlow Author"
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  bio: "热爱技术的全栈开发者"
category: "前端开发"
tags: ["Vue.js", "JavaScript", "组合式API", "前端框架"]
featured: true
draft: false
readingTime: 8
seo:
  title: "Vue.js 3 组合式 API 完全指南 - 从入门到精通"
  description: "详细介绍 Vue.js 3 组合式 API 的使用方法，包括 ref、reactive、computed、watch 等核心概念。"
  keywords: ["Vue.js 3", "组合式API", "Composition API", "前端开发", "JavaScript"]
  ogImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=630&fit=crop"
---

# Vue.js 3 组合式 API 完全指南

Vue.js 3 带来了许多令人兴奋的新特性，其中最重要的就是组合式 API（Composition API）。它为我们提供了一种全新的方式来组织和复用组件逻辑。本文将深入探索组合式 API 的核心概念和实际应用。

## 什么是组合式 API？

组合式 API 是一套基于函数的 API，允许我们更灵活地组织组件逻辑。与选项式 API 不同，组合式 API 让我们可以将相关的逻辑组合在一起，而不是按照选项类型（data、methods、computed等）来分离。

### 为什么需要组合式 API？

在使用选项式 API 开发大型组件时，我们经常会遇到以下问题：

1. **逻辑分散**: 相关的逻辑代码分散在不同的选项中
2. **类型推导**: TypeScript 支持不够完善
3. **代码复用**: 逻辑复用主要依靠 mixins，容易造成命名冲突

组合式 API 完美解决了这些问题。

## 核心响应式 API

### ref() - 基本类型的响应式引用

`ref()` 用于创建基本类型的响应式数据：

```javascript
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const message = ref('Hello Vue 3!')
    
    function increment() {
      count.value++ // 注意：需要通过 .value 访问
    }
    
    return {
      count,
      message,
      increment
    }
  }
}
```

### reactive() - 对象的响应式代理

`reactive()` 用于创建对象的响应式代理：

```javascript
import { reactive } from 'vue'

export default {
  setup() {
    const state = reactive({
      user: {
        name: 'John',
        age: 25
      },
      posts: []
    })
    
    function updateUser(newData) {
      Object.assign(state.user, newData)
    }
    
    return {
      state,
      updateUser
    }
  }
}
```

## 计算属性和侦听器

### computed() - 计算属性

```javascript
import { ref, computed } from 'vue'

export default {
  setup() {
    const firstName = ref('John')
    const lastName = ref('Doe')
    
    // 只读计算属性
    const fullName = computed(() => {
      return `${firstName.value} ${lastName.value}`
    })
    
    // 可写计算属性
    const writableFullName = computed({
      get() {
        return `${firstName.value} ${lastName.value}`
      },
      set(value) {
        [firstName.value, lastName.value] = value.split(' ')
      }
    })
    
    return {
      firstName,
      lastName,
      fullName,
      writableFullName
    }
  }
}
```

### watch() - 侦听器

```javascript
import { ref, watch, reactive } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const state = reactive({ name: 'Vue' })
    
    // 侦听单个 ref
    watch(count, (newValue, oldValue) => {
      console.log(`count changed from ${oldValue} to ${newValue}`)
    })
    
    // 侦听 reactive 对象的属性
    watch(
      () => state.name,
      (newName, oldName) => {
        console.log(`name changed from ${oldName} to ${newName}`)
      }
    )
    
    // 侦听多个源
    watch([count, () => state.name], ([newCount, newName], [oldCount, oldName]) => {
      console.log(`count: ${oldCount} -> ${newCount}`)
      console.log(`name: ${oldName} -> ${newName}`)
    })
    
    return {
      count,
      state
    }
  }
}
```

## 生命周期钩子

在组合式 API 中，生命周期钩子以 `on` 开头：

```javascript
import { onMounted, onUpdated, onUnmounted } from 'vue'

export default {
  setup() {
    onMounted(() => {
      console.log('组件已挂载')
    })
    
    onUpdated(() => {
      console.log('组件已更新')
    })
    
    onUnmounted(() => {
      console.log('组件即将卸载')
    })
    
    // 可以多次调用同一个钩子
    onMounted(() => {
      console.log('这是另一个挂载钩子')
    })
  }
}
```

## 逻辑复用 - Composables

组合式 API 最大的优势之一就是逻辑复用。我们可以将逻辑提取到可复用的函数中：

### 创建一个计数器 Composable

```javascript
// composables/useCounter.js
import { ref } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  
  function increment() {
    count.value++
  }
  
  function decrement() {
    count.value--
  }
  
  function reset() {
    count.value = initialValue
  }
  
  return {
    count: readonly(count), // 只读，防止外部直接修改
    increment,
    decrement,
    reset
  }
}
```

### 在组件中使用

```javascript
import { useCounter } from '@/composables/useCounter'

export default {
  setup() {
    const { count, increment, decrement, reset } = useCounter(10)
    
    return {
      count,
      increment,
      decrement,
      reset
    }
  }
}
```

### 更复杂的 Composable 示例

```javascript
// composables/useFetch.js
import { ref, toRefs } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)
  const loading = ref(false)
  
  async function fetchData() {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      data.value = await response.json()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }
  
  // 立即执行
  fetchData()
  
  return {
    data: readonly(data),
    error: readonly(error),
    loading: readonly(loading),
    refetch: fetchData
  }
}
```

## 与 TypeScript 的完美结合

组合式 API 对 TypeScript 有着出色的支持：

```typescript
import { ref, computed, Ref } from 'vue'

interface User {
  id: number
  name: string
  email: string
}

export default defineComponent({
  setup() {
    const users: Ref<User[]> = ref([])
    const selectedUserId = ref<number | null>(null)
    
    const selectedUser = computed(() => {
      return users.value.find(user => user.id === selectedUserId.value) || null
    })
    
    async function fetchUsers(): Promise<void> {
      try {
        const response = await fetch('/api/users')
        users.value = await response.json()
      } catch (error) {
        console.error('Failed to fetch users:', error)
      }
    }
    
    return {
      users,
      selectedUserId,
      selectedUser,
      fetchUsers
    }
  }
})
```

## 最佳实践

### 1. 合理使用 ref 和 reactive

- 基本类型使用 `ref()`
- 对象和数组使用 `reactive()`
- 当需要替换整个对象时，使用 `ref()`

### 2. 组织代码结构

```javascript
export default {
  setup() {
    // 1. 响应式数据
    const count = ref(0)
    const user = reactive({ name: 'John' })
    
    // 2. 计算属性
    const doubledCount = computed(() => count.value * 2)
    
    // 3. 方法
    function increment() {
      count.value++
    }
    
    // 4. 生命周期
    onMounted(() => {
      console.log('mounted')
    })
    
    // 5. 侦听器
    watch(count, (newVal) => {
      console.log('count changed:', newVal)
    })
    
    // 6. 返回给模板
    return {
      count,
      user,
      doubledCount,
      increment
    }
  }
}
```

### 3. 适当使用解构

```javascript
// 好的做法
const { count, increment } = useCounter()

// 注意保持响应性
const state = reactive({ count: 0, name: 'Vue' })
return {
  ...toRefs(state) // 使用 toRefs 保持响应性
}
```

## 总结

组合式 API 是 Vue.js 3 的一个重要特性，它提供了：

- 🎯 **更好的逻辑组织**: 相关逻辑可以组织在一起
- 🔄 **更好的代码复用**: 通过 composables 轻松复用逻辑
- 📘 **更好的 TypeScript 支持**: 完美的类型推导
- 🧹 **更清晰的代码结构**: 函数式的编程风格

虽然学习曲线可能比选项式 API 稍陡峭，但掌握组合式 API 后，你会发现它能显著提升开发效率和代码质量。

下一篇文章，我们将探讨如何在 Nuxt.js 中使用组合式 API，以及一些高级技巧。敬请期待！

---

*你使用过组合式 API 吗？在评论中分享你的使用经验吧！*
