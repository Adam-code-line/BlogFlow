<template>
  <div class="space-y-6">
    <!-- 页面标题和操作 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">用户管理</h1>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          管理系统用户和权限
        </p>
      </div>
      <UButton
        icon="i-heroicons-plus"
        @click="showInviteModal = true"
      >
        邀请用户
      </UButton>
    </div>

    <!-- 搜索和筛选 -->
    <UCard class="bg-white dark:bg-gray-800">
      <div class="p-6">
        <div class="flex flex-col sm:flex-row gap-4">
          <!-- 搜索框 -->
          <div class="flex-1">
            <UInput
              v-model="searchQuery"
              placeholder="搜索用户名、邮箱..."
              icon="i-heroicons-magnifying-glass"
              size="md"
              @input="handleSearch"
            />
          </div>
          
          <!-- 角色筛选 -->
          <USelect
            v-model="selectedRole"
            :options="roleOptions"
            placeholder="选择角色"
            size="md"
            @change="handleRoleChange"
          />
          
          <!-- 状态筛选 -->
          <USelect
            v-model="selectedStatus"
            :options="statusOptions"
            placeholder="选择状态"
            size="md"
            @change="handleStatusChange"
          />
          
          <!-- 排序 -->
          <USelect
            v-model="sortBy"
            :options="sortOptions"
            size="md"
            @change="handleSortChange"
          />
        </div>
      </div>
    </UCard>

    <!-- 用户列表 -->
    <UCard class="bg-white dark:bg-gray-800">
      <div class="p-6">
        <!-- 加载状态 -->
        <div v-if="loading" class="flex justify-center py-8">
          <Icon name="i-heroicons-arrow-path" class="h-8 w-8 animate-spin text-gray-400" />
        </div>
        
        <!-- 空状态 -->
        <div v-else-if="!users.length" class="text-center py-8">
          <Icon name="i-heroicons-users" class="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">暂无用户</h3>
          <p class="text-gray-500 dark:text-gray-400 mb-4">开始邀请第一位用户吧！</p>
          <UButton
            icon="i-heroicons-plus"
            @click="showInviteModal = true"
          >
            邀请用户
          </UButton>
        </div>
        
        <!-- 用户表格 -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  用户
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  角色
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  状态
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  统计
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  加入时间
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="user in paginatedUsers"
                :key="user.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <!-- 用户信息 -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <UAvatar
                      :src="user.avatar"
                      :alt="user.displayName"
                      size="md"
                    />
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900 dark:text-white">
                        {{ user.displayName }}
                      </div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">
                        @{{ user.username }}
                      </div>
                      <div class="text-xs text-gray-400">
                        {{ `${user.username}@example.com` }}
                      </div>
                    </div>
                  </div>
                </td>
                
                <!-- 角色 -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <UBadge
                    :label="getRoleLabel(user.role)"
                    color="primary"
                    variant="soft"
                  />
                </td>
                
                <!-- 状态 -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <UBadge
                    :label="getUserStatus(user)"
                    :color="getStatusColor(user)"
                    variant="soft"
                  />
                </td>
                
                <!-- 统计 -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <div class="space-y-1">
                    <div class="flex items-center">
                      <Icon name="i-heroicons-document-text" class="h-4 w-4 mr-1" />
                      {{ user.stats.postsCount }} 篇文章
                    </div>
                    <div class="flex items-center">
                      <Icon name="i-heroicons-users" class="h-4 w-4 mr-1" />
                      {{ user.stats.followersCount }} 关注者
                    </div>
                  </div>
                </td>
                
                <!-- 加入时间 -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ formatJoinDate(user.stats.joinedDaysAgo) }}
                </td>
                
                <!-- 操作 -->
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <UDropdown :items="getUserActions(user)">
                    <UButton
                      variant="ghost"
                      size="sm"
                      icon="i-heroicons-ellipsis-horizontal"
                    />
                  </UDropdown>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- 分页 -->
        <div v-if="users.length" class="mt-6 flex items-center justify-between">
          <div class="text-sm text-gray-500 dark:text-gray-400">
            显示第 {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, totalUsers) }} 项，共 {{ totalUsers }} 项
          </div>
          <UPagination
            v-model="currentPage"
            :page-count="totalPages"
            :total="totalUsers"
          />
        </div>
      </div>
    </UCard>

    <!-- 邀请用户模态框 -->
    <UModal v-model="showInviteModal">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">邀请新用户</h3>
            <UButton
              variant="ghost"
              icon="i-heroicons-x-mark"
              @click="showInviteModal = false"
            />
          </div>
        </template>
        
        <div class="space-y-4">
          <UFormGroup label="邮箱地址" required>
            <UInput
              v-model="inviteForm.email"
              type="email"
              placeholder="user@example.com"
            />
          </UFormGroup>
          
          <UFormGroup label="角色" required>
            <USelect
              v-model="inviteForm.role"
              :options="roleOptions.slice(1)"
              placeholder="选择角色"
            />
          </UFormGroup>
          
          <UFormGroup label="邀请消息">
            <UTextarea
              v-model="inviteForm.message"
              placeholder="可选的邀请消息..."
              :rows="3"
            />
          </UFormGroup>
        </div>
        
        <template #footer>
          <div class="flex justify-end space-x-3">
            <UButton
              variant="ghost"
              @click="showInviteModal = false"
            >
              取消
            </UButton>
            <UButton
              @click="sendInvite"
              :loading="inviting"
            >
              发送邀请
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user'
import type { PublicUser } from '~/types/user'
import { UserRole } from '~/types/user'

// 设置布局
definePageMeta({
  layout: 'admin'
})

// 页面标题
useHead({
  title: '用户管理 - BlogFlow Admin'
})

// Store
const userStore = useUserStore()

// 响应式数据
const loading = ref(false)
const searchQuery = ref('')
const selectedRole = ref('')
const selectedStatus = ref('')
const sortBy = ref('joinedDaysAgo')
const currentPage = ref(1)
const pageSize = ref(10)
const showInviteModal = ref(false)
const inviting = ref(false)

// 邀请表单
const inviteForm = ref({
  email: '',
  role: '',
  message: ''
})

// 计算属性
const users = computed(() => userStore.filteredUsers)
const totalUsers = computed(() => users.value.length)
const totalPages = computed(() => Math.ceil(totalUsers.value / pageSize.value))

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return users.value.slice(start, end)
})

// 选项数据
const roleOptions = [
  { label: '全部角色', value: '' },
  { label: '管理员', value: UserRole.ADMIN },
  { label: '作者', value: UserRole.AUTHOR },
  { label: '编辑', value: UserRole.EDITOR },
  { label: '订阅者', value: UserRole.SUBSCRIBER }
]

const statusOptions = [
  { label: '全部状态', value: '' },
  { label: '活跃', value: 'active' },
  { label: '非活跃', value: 'inactive' },
  { label: '暂停', value: 'suspended' }
]

const sortOptions = [
  { label: '按加入时间', value: 'joinedDaysAgo' },
  { label: '按文章数', value: 'postsCount' },
  { label: '按关注者数', value: 'followersCount' },
  { label: '按用户名', value: 'username' }
]

// 方法
const formatJoinDate = (daysAgo: number) => {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
}

const getRoleLabel = (role: string) => {
  const labels = {
    [UserRole.ADMIN]: '管理员',
    [UserRole.AUTHOR]: '作者',
    [UserRole.EDITOR]: '编辑',
    [UserRole.SUBSCRIBER]: '订阅者',
    [UserRole.GUEST]: '游客'
  }
  return labels[role as UserRole] || '未知'
}

const getRoleColor = (role: string) => {
  const colors = {
    [UserRole.ADMIN]: 'error',
    [UserRole.AUTHOR]: 'primary',
    [UserRole.EDITOR]: 'success',
    [UserRole.SUBSCRIBER]: 'warning',
    [UserRole.GUEST]: 'neutral'
  }
  return colors[role as UserRole] || 'neutral'
}

const getUserStatus = (user: PublicUser) => {
  // 简单的活跃状态判断
  if (user.stats.joinedDaysAgo < 7) return '新用户'
  if (user.stats.postsCount > 0) return '活跃'
  return '非活跃'
}

const getStatusColor = (user: PublicUser) => {
  const status = getUserStatus(user)
  return status === '活跃' ? 'success' : status === '新用户' ? 'info' : 'warning'
}

const getUserActions = (user: PublicUser) => [
  [{
    label: '查看详情',
    icon: 'i-heroicons-eye',
    click: () => viewUser(user)
  }],
  [{
    label: '编辑用户',
    icon: 'i-heroicons-pencil',
    click: () => editUser(user)
  }],
  [{
    label: '发送消息',
    icon: 'i-heroicons-envelope',
    click: () => messageUser(user)
  }],
  [{
    label: '暂停用户',
    icon: 'i-heroicons-pause',
    click: () => suspendUser(user)
  }]
]

const viewUser = (user: PublicUser) => {
  navigateTo(`/users/${user.id}`)
}

const editUser = (user: PublicUser) => {
  navigateTo(`/admin/users/${user.id}/edit`)
}

const messageUser = (user: PublicUser) => {
  console.log('发送消息给用户:', user.username)
}

const suspendUser = (user: PublicUser) => {
  if (confirm(`确定要暂停用户 ${user.displayName} 吗？`)) {
    console.log('暂停用户:', user.username)
  }
}

const sendInvite = async () => {
  inviting.value = true
  try {
    // 这里实现发送邀请逻辑
    console.log('发送邀请:', inviteForm.value)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 重置表单并关闭模态框
    inviteForm.value = { email: '', role: '', message: '' }
    showInviteModal.value = false
    
    // 显示成功消息
    console.log('邀请发送成功')
  } catch (error) {
    console.error('发送邀请失败:', error)
  } finally {
    inviting.value = false
  }
}

// 事件处理
const handleSearch = useDebounceFn(() => {
  userStore.searchQuery = searchQuery.value
  currentPage.value = 1
}, 300)

const handleRoleChange = () => {
  userStore.selectedRole = selectedRole.value
  currentPage.value = 1
}

const handleStatusChange = () => {
  // 根据状态筛选用户
  currentPage.value = 1
}

const handleSortChange = () => {
  userStore.sortBy = sortBy.value
}

// 加载数据
const loadUsers = async () => {
  loading.value = true
  try {
    await userStore.fetchUsers()
  } catch (error) {
    console.error('加载用户失败:', error)
  } finally {
    loading.value = false
  }
}

// 防抖函数
function useDebounceFn(fn: Function, delay: number) {
  let timeoutId: NodeJS.Timeout
  return (...args: any[]) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

// 页面挂载时加载数据
onMounted(() => {
  loadUsers()
})
</script>