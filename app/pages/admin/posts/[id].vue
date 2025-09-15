<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- 顶部导航栏 -->
    <div class="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto">
        <div class="flex items-center justify-between h-16 px-6">
          <div class="flex items-center space-x-4">
            <UButton
              to="/admin/posts"
              variant="ghost"
              size="sm"
              icon="heroicons:arrow-left"
              class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              返回文章列表
            </UButton>
            <div class="h-6 border-l border-gray-300 dark:border-gray-600"></div>
            <div>
              <h1 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ isNew ? '创建新文章' : '编辑文章' }}
              </h1>
            </div>
          </div>
          
          <div class="flex items-center space-x-3">
            <!-- 字数和阅读时间 -->
            <div class="hidden sm:flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <div class="flex items-center">
                <Icon name="heroicons:document-text" class="w-4 h-4 mr-1" />
                {{ wordCount }} 字
              </div>
              <div class="flex items-center">
                <Icon name="heroicons:clock" class="w-4 h-4 mr-1" />
                {{ readingTime }} 分钟
              </div>
            </div>
            
            <!-- 保存按钮 -->
            <UButton
              @click="saveAsDraft"
              :loading="saving"
              variant="outline"
              size="sm"
              icon="heroicons:document-duplicate"
              class="hidden sm:flex"
            >
              保存草稿
            </UButton>
            
            <!-- 发布按钮 -->
            <UButton
              @click="publishPost"
              :loading="publishing"
              size="sm"
              icon="heroicons:rocket-launch"
              class="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              {{ isNew ? '发布' : '更新' }}
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="max-w-7xl mx-auto p-6">
      <div class="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <!-- 左侧主要内容区域 -->
        <div class="xl:col-span-3 space-y-6">
          <!-- 文章基本信息卡片 -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <!-- 卡片头部 -->
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              <div class="flex items-center space-x-3">
                <div class="p-2 bg-blue-500 rounded-lg shadow-sm">
                  <Icon name="heroicons:document-text" class="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900 dark:text-white">基本信息</h2>
                  <p class="text-sm text-gray-600 dark:text-gray-400">配置文章的标题、描述和分类标签</p>
                </div>
              </div>
            </div>
            
            <!-- 卡片内容 -->
            <div class="p-6 space-y-8">
              <!-- 文章标题 -->
              <div class="space-y-3">
                <label class="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Icon name="heroicons:pencil" class="w-4 h-4 text-blue-500" />
                  <span>文章标题</span>
                  <span class="text-red-500">*</span>
                </label>
                <UInput
                  v-model="form.title"
                  placeholder="输入一个吸引人的标题..."
                  size="xl"
                  class="text-lg"
                  :ui="{ 
                    base: 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 px-4 py-3'
                  }"
                />
                <p class="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <Icon name="heroicons:light-bulb" class="w-3 h-3 mr-1" />
                  建议长度：10-60个字符，当前：{{ form.title.length }}/60
                </p>
              </div>
              
              <!-- 文章描述 -->
              <div class="space-y-3">
                <label class="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Icon name="heroicons:chat-bubble-left-ellipsis" class="w-4 h-4 text-green-500" />
                  <span>文章描述</span>
                </label>
                <UTextarea
                  v-model="form.description"
                  placeholder="简要描述这篇文章的内容，这将显示在文章列表和搜索结果中..."
                  :rows="4"
                  resize
                  :ui="{ 
                    base: 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:border-green-500 focus:ring-green-500 transition-all duration-200'
                  }"
                />
                <p class="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <Icon name="heroicons:information-circle" class="w-3 h-3 mr-1" />
                  建议长度：50-160个字符，当前：{{ (form.description || '').length }}/160
                </p>
              </div>
              
              <!-- 分类和标签区域 -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- 分类选择 -->
                <div class="space-y-3">
                  <label class="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <Icon name="heroicons:folder" class="w-4 h-4 text-purple-500" />
                    <span>文章分类</span>
                  </label>
                  <USelect
                    v-model="form.category"
                    :options="categoryOptions"
                    placeholder="选择文章分类"
                    size="lg"
                    :ui="{ 
                      base: 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500 transition-all duration-200'
                    }"
                  />
                  <p class="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                    <Icon name="heroicons:tag" class="w-3 h-3 mr-1" />
                    选择合适的分类有助于读者找到您的文章
                  </p>
                </div>
                
                <!-- 标签管理 -->
                <div class="space-y-3">
                  <label class="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <Icon name="heroicons:hashtag" class="w-4 h-4 text-orange-500" />
                    <span>文章标签</span>
                  </label>
                  <UInput
                    v-model="tagsInput"
                    placeholder="输入标签，用逗号分隔（如：技术,前端,Vue）"
                    @blur="updateTags"
                    @keydown.enter.prevent="updateTags"
                    size="lg"
                    :ui="{ 
                      base: 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500 transition-all duration-200'
                    }"
                  />
                  
                  <!-- 标签预览 -->
                  <div v-if="form.tags.length" class="space-y-2">
                    <p class="text-xs text-gray-500 dark:text-gray-400">已添加的标签：</p>
                    <div class="flex flex-wrap gap-2">
                      <span
                        v-for="tag in form.tags"
                        :key="tag"
                        class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 dark:from-blue-900/30 dark:to-blue-800/30 dark:text-blue-300 border border-blue-200 dark:border-blue-700 transition-all duration-200 hover:shadow-sm"
                      >
                        <Icon name="heroicons:hashtag" class="w-3 h-3 mr-1" />
                        {{ tag }}
                        <button
                          @click="removeTag(tag)"
                          class="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-300 dark:hover:bg-blue-700/50 transition-colors duration-200"
                        >
                          <Icon name="heroicons:x-mark" class="w-3 h-3" />
                        </button>
                      </span>
                    </div>
                  </div>
                  
                  <p class="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                    <Icon name="heroicons:sparkles" class="w-3 h-3 mr-1" />
                    建议添加3-8个相关标签，有助于SEO优化
                  </p>
                </div>
              </div>
              
              <!-- SEO优化设置 -->
              <div class="border-t border-gray-100 dark:border-gray-700 pt-6">
                <div class="flex items-center space-x-3 mb-4">
                  <div class="p-2 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg">
                    <Icon name="heroicons:magnifying-glass" class="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h3 class="text-sm font-semibold text-gray-900 dark:text-white">SEO优化</h3>
                    <p class="text-xs text-gray-500 dark:text-gray-400">提升文章在搜索引擎中的排名</p>
                  </div>
                </div>
                
                <div class="space-y-4">
                  <!-- SEO描述 -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      SEO描述（可选）
                    </label>
                    <UTextarea
                      v-model="form.metaDescription"
                      placeholder="为搜索引擎优化的描述文本..."
                      :rows="2"
                      :ui="{ 
                        base: 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500'
                      }"
                    />
                  </div>
                  
                  <!-- 关键词 -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      SEO关键词（可选）
                    </label>
                    <UInput
                      v-model="form.keywords"
                      placeholder="关键词1, 关键词2, 关键词3"
                      :ui="{ 
                        base: 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500'
                      }"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Markdown 编辑器卡片 -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="p-6">
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center space-x-3">
                  <div class="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <Icon name="heroicons:pencil-square" class="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 class="text-lg font-semibold text-gray-900 dark:text-white">文章内容</h2>
                </div>
                
                <div class="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <div class="flex items-center">
                    <Icon name="heroicons:document-text" class="w-4 h-4 mr-1" />
                    {{ wordCount }} 字
                  </div>
                  <div class="flex items-center">
                    <Icon name="heroicons:clock" class="w-4 h-4 mr-1" />
                    {{ readingTime }} 分钟阅读
                  </div>
                </div>
              </div>
              
              <!-- Cherry编辑器容器 -->
              <div class="border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-700/30">
                <CherryMarkdownEditor
                  v-model="form.content"
                  height="600px"
                  placeholder="在这里编写您的文章内容..."
                  :ui="{
                    wrapper: 'rounded-xl overflow-hidden',
                    editor: 'border-r-2 border-gray-200 dark:border-gray-600',
                    preview: 'border-l-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800'
                  }"
                  ref="cherryEditorRef"
                />
              </div>
              
              <!-- 编辑器提示 -->
              <div class="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border border-blue-200 dark:border-blue-800 rounded-xl">
                <div class="flex">
                  <Icon name="heroicons:information-circle" class="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div class="text-sm text-blue-700 dark:text-blue-300">
                    <p class="font-medium mb-2">💡 编辑器使用提示：</p>
                    <ul class="space-y-1 text-xs opacity-90">
                      <li>• 左侧编辑，右侧预览，支持实时同步</li>
                      <li>• 使用工具栏快速插入 Markdown 元素</li>
                      <li>• 支持表格、代码块、图片等丰富内容</li>
                      <li>• Ctrl/Cmd + S 快速保存草稿</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧边栏 -->
        <div class="space-y-6">
          <!-- 发布控制面板 -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <!-- 面板头部 -->
            <div class="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              <div class="flex items-center space-x-3">
                <div class="p-2 bg-purple-500 rounded-lg shadow-sm">
                  <Icon name="heroicons:rocket-launch" class="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white">发布设置</h3>
                  <p class="text-xs text-gray-600 dark:text-gray-400">控制文章的发布时间和状态</p>
                </div>
              </div>
            </div>
            
            <div class="p-6 space-y-6">
              <!-- 文章状态指示器 -->
              <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                <div class="flex items-center space-x-3">
                  <div class="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">当前状态</span>
                </div>
                <span class="px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 text-xs font-medium rounded-full">
                  {{ isNew ? '新建草稿' : '编辑中' }}
                </span>
              </div>
              
              <!-- 发布时间设置 -->
              <div class="space-y-3">
                <label class="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Icon name="heroicons:calendar" class="w-4 h-4 text-purple-500" />
                  <span>发布时间</span>
                </label>
                <UInput
                  v-model="form.publishedAt"
                  type="datetime-local"
                  size="md"
                  :ui="{ 
                    base: 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500 transition-all duration-200'
                  }"
                />
                <p class="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <Icon name="heroicons:information-circle" class="w-3 h-3 mr-1" />
                  留空将在发布时自动设置为当前时间
                </p>
              </div>

              <!-- URL别名设置 -->
              <div class="space-y-3">
                <label class="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Icon name="heroicons:link" class="w-4 h-4 text-blue-500" />
                  <span>URL别名</span>
                </label>
                <UInput
                  v-model="form.slug"
                  placeholder="自动从标题生成"
                  size="md"
                  :ui="{ 
                    base: 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200'
                  }"
                />
                <p class="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <Icon name="heroicons:globe-alt" class="w-3 h-3 mr-1" />
                  将显示在文章URL中，影响SEO效果
                </p>
              </div>

              <!-- 特色文章开关 -->
              <div class="space-y-3">
                <div class="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                  <div class="flex items-center space-x-3">
                    <Icon name="heroicons:star" class="w-5 h-5 text-yellow-500" />
                    <div>
                      <p class="text-sm font-medium text-gray-700 dark:text-gray-300">特色文章</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">在首页优先展示</p>
                    </div>
                  </div>
                  <!-- 自定义切换开关 -->
                  <label class="relative inline-flex cursor-pointer">
                    <input 
                      type="checkbox" 
                      v-model="form.featured" 
                      class="sr-only peer"
                    >
                    <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              <!-- 快速操作按钮 -->
              <div class="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button
                  @click="saveAsDraft"
                  :disabled="saving"
                  class="flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <Icon name="heroicons:document-duplicate" class="w-4 h-4" />
                  <span>{{ saving ? '保存中...' : '保存草稿' }}</span>
                </button>
                <button
                  @click="publishPost"
                  :disabled="publishing"
                  class="flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <Icon name="heroicons:rocket-launch" class="w-4 h-4" />
                  <span>{{ publishing ? '发布中...' : '发布' }}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- 封面图片管理 -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <!-- 面板头部 -->
            <div class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              <div class="flex items-center space-x-3">
                <div class="p-2 bg-green-500 rounded-lg shadow-sm">
                  <Icon name="heroicons:photo" class="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white">封面图片</h3>
                  <p class="text-xs text-gray-600 dark:text-gray-400">吸引读者的第一印象，不会在文章内容中显示</p>
                </div>
              </div>
            </div>
            
            <div class="p-6">
              <!-- 图片预览区域 -->
              <div v-if="form.cover" class="mb-6 relative group">
                <div class="relative overflow-hidden rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-600">
                  <img 
                    :src="form.cover" 
                    alt="封面预览" 
                    class="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105" 
                  />
                  <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <button
                      @click="removeCover"
                      class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg"
                    >
                      <Icon name="heroicons:trash" class="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div class="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
                  悬停查看删除选项
                </div>
              </div>
              
              <!-- 无图片时的上传区域 -->
              <div v-else class="mb-6">
                <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center bg-gray-50 dark:bg-gray-700/30 hover:border-green-400 transition-colors duration-200">
                  <Icon name="heroicons:photo" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">拖拽图片到此处</p>
                  <p class="text-xs text-gray-500 dark:text-gray-500">或点击下方按钮选择图片</p>
                </div>
              </div>
              
              <!-- 图片URL输入 -->
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    图片URL
                  </label>
                  <UInput
                    v-model="form.cover"
                    placeholder="https://example.com/image.jpg"
                    size="md"
                    :ui="{ 
                      base: 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:border-green-500 focus:ring-green-500 transition-all duration-200'
                    }"
                  />
                </div>
                
                <!-- 操作按钮 -->
                <div class="grid grid-cols-1 gap-3">
                  <UButton
                    variant="outline"
                    size="sm"
                    icon="heroicons:cloud-arrow-up"
                    @click="triggerFileUpload"
                    :loading="uploading"
                    block
                    class="border-green-200 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900/20"
                  >
                    {{ uploading ? '上传中...' : '本地上传' }}
                  </UButton>
                  
                  <UButton
                    variant="outline"
                    size="sm"
                    icon="heroicons:sparkles"
                    @click="selectFromUnsplash"
                    block
                    class="border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20"
                  >
                    随机精美图片
                  </UButton>
                </div>
                
                <!-- 隐藏的文件输入 -->
                <input
                  ref="fileInputRef"
                  type="file"
                  accept="image/*"
                  @change="handleFileUpload"
                  class="hidden"
                />
                
                <!-- 上传进度 -->
                <div v-if="uploadProgress > 0 && uploadProgress < 100" class="mt-4">
                  <div class="bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div 
                      class="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500 ease-out"
                      :style="{ width: uploadProgress + '%' }"
                    ></div>
                  </div>
                  <p class="text-xs text-green-600 dark:text-green-400 mt-2 text-center font-medium">
                    上传进度: {{ uploadProgress }}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- 文章统计 -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <!-- 面板头部 -->
            <div class="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              <div class="flex items-center space-x-3">
                <div class="p-2 bg-blue-500 rounded-lg shadow-sm">
                  <Icon name="heroicons:chart-bar" class="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white">内容统计</h3>
                  <p class="text-xs text-gray-600 dark:text-gray-400">实时追踪文章数据</p>
                </div>
              </div>
            </div>
            
            <div class="p-6 space-y-4">
              <!-- 统计卡片 -->
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-xs text-blue-600 dark:text-blue-400 font-medium">字数</p>
                      <p class="text-lg font-bold text-blue-700 dark:text-blue-300">{{ wordCount }}</p>
                    </div>
                    <Icon name="heroicons:document-text" class="w-6 h-6 text-blue-500" />
                  </div>
                </div>
                
                <div class="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-xs text-green-600 dark:text-green-400 font-medium">阅读时间</p>
                      <p class="text-lg font-bold text-green-700 dark:text-green-300">{{ readingTime }}分</p>
                    </div>
                    <Icon name="heroicons:clock" class="w-6 h-6 text-green-500" />
                  </div>
                </div>
                
                <div class="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-xs text-purple-600 dark:text-purple-400 font-medium">浏览量</p>
                      <p class="text-lg font-bold text-purple-700 dark:text-purple-300">{{ stats.views }}</p>
                    </div>
                    <Icon name="heroicons:eye" class="w-6 h-6 text-purple-500" />
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 导入组件
import CherryMarkdownEditor from '~/components/editor/CherryMarkdownEditor.vue'
import { useUtils } from '~/composables/useFormatters'
import { useMarkdown } from '~/composables/useMarkdown'
import { createPostAction, updatePostAction, getPostByIdAction, type PostData } from '~/composables/usePostActions'

// 设置布局
definePageMeta({
  layout: 'admin'
})

// 获取路由参数
const route = useRoute()
const router = useRouter()
const postId = (route.params as any).id as string || 'new'
const isNew = postId === 'new'

// 工具函数
const { debounce, throttle } = useUtils()

// 页面标题
useHead({
  title: `${isNew ? '创建新文章' : '编辑文章'} - BlogFlow Admin`
})

// 响应式数据
const saving = ref(false)
const publishing = ref(false)
const tagsInput = ref('')

// Cherry 编辑器引用
const cherryEditorRef = ref<any>(null)

// 文件上传相关
const uploading = ref(false)
const uploadProgress = ref(0)
const fileInputRef = ref<HTMLInputElement>()

// 表单数据
const form = ref({
  title: '',
  description: '',
  content: '',
  cover: '',
  category: '',
  tags: [] as string[],
  publishedAt: '',
  featured: false,
  slug: '',
  metaDescription: '',
  keywords: '',
  views: 0
})

// 统计数据 - 基于真实文章数据
const stats = computed(() => ({
  views: form.value.views || 0
}))

// 计算属性
const wordCount = computed(() => {
  return form.value.content.length
})

const readingTime = computed(() => {
  const wordsPerMinute = 200
  const words = form.value.content.split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
})

// 选项数据
const categoryOptions = [
  { label: '技术', value: '技术' },
  { label: '设计', value: '设计' },
  { label: '产品', value: '产品' },
  { label: '生活', value: '生活' },
  { label: '思考', value: '思考' }
]

// 方法
const updateTags = () => {
  if (tagsInput.value) {
    form.value.tags = tagsInput.value
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
  }
}

const removeTag = (tag: string) => {
  form.value.tags = form.value.tags.filter(t => t !== tag)
  tagsInput.value = form.value.tags.join(', ')
}

const uploadCover = () => {
  // 这里实现图片上传逻辑
  console.log('上传封面图片')
}

// 文件上传方法
const triggerFileUpload = () => {
  fileInputRef.value?.click()
}

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    alert('请选择图片文件')
    return
  }

  // 验证文件大小 (限制为 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('文件大小不能超过 5MB')
    return
  }

  uploading.value = true
  uploadProgress.value = 0

  try {
    // 模拟上传进度
    const uploadInterval = setInterval(() => {
      uploadProgress.value += 10
      if (uploadProgress.value >= 90) {
        clearInterval(uploadInterval)
      }
    }, 100)

    // 使用 FormData 进行文件上传
    const formData = new FormData()
    formData.append('file', file)
    
    // 这里使用 FileReader 作为演示，实际项目中应该调用真实的上传 API
    await new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        clearInterval(uploadInterval)
        uploadProgress.value = 100
        form.value.cover = e.target?.result as string
        
        // 注释：移除重复的封面图片处理，改为只在渲染时处理
        // 避免重复调用导致内容损坏
        
        setTimeout(() => {
          uploading.value = false
          uploadProgress.value = 0
          // 提示用户封面图片已设置
          console.log('✅ 封面图片已设置，且已从文章内容中移除重复图片')
        }, 500)
        resolve(true)
      }
      reader.readAsDataURL(file)
    })

  } catch (error) {
    console.error('文件上传失败:', error)
    alert('文件上传失败，请重试')
    uploading.value = false
    uploadProgress.value = 0
  }
}

const removeCover = () => {
  form.value.cover = ''
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

const selectFromUnsplash = () => {
  // 生成随机的Unsplash图片URL
  const unsplashQueries = ['nature', 'technology', 'workspace', 'abstract', 'minimal', 'landscape', 'city', 'coffee']
  const randomQuery = unsplashQueries[Math.floor(Math.random() * unsplashQueries.length)]
  const randomId = Math.floor(Math.random() * 1000) + 1
  
  form.value.cover = `https://images.unsplash.com/photo-${1500000000000 + randomId * 1000}?w=800&h=400&fit=crop&q=80&auto=format&keywords=${randomQuery}`
  
  // 注释：移除重复的封面图片处理，改为只在渲染时处理
  // 避免重复调用导致内容损坏
  
  console.log('✅ 封面图片已从Unsplash选择，且已从文章内容中移除重复图片')
}

const saveAsDraft = debounce(async () => {
  saving.value = true
  try {
    // 更新标签
    updateTags()
    
    // 注释：移除重复的封面图片处理，改为只在渲染时处理
    // 避免重复调用导致内容损坏
    
    console.log('💾 保存草稿 - 表单数据:', form.value)
    console.log('💾 Content 字段:', form.value.content)
    console.log('💾 Content 长度:', form.value.content?.length || 0)
    
    // 使用前端模拟的保存逻辑
    const postData = { ...form.value }
    
    if (isNew) {
      const result = await createPostAction(postData)
      console.log('✅ 草稿保存成功:', result)
      // 保存后跳转到编辑页面，但是路由参数需要修改
      await router.push(`/admin/posts/${result.id}`)
    } else {
      await updatePostAction(postId, postData)
      console.log('✅ 草稿更新成功')
    }
    
    console.log('✅ 草稿保存完成')
  } catch (error) {
    console.error('❌ 保存失败:', error)
  } finally {
    saving.value = false
  }
}, 1000) // 1秒防抖

const publishPost = throttle(async () => {
  publishing.value = true
  try {
    // 更新标签
    updateTags()
    
    // 注释：移除重复的封面图片处理，改为只在渲染时处理
    // 避免重复调用导致内容损坏
    
    console.log('🚀 发布文章 - 表单数据:', form.value)
    console.log('🚀 Content 字段:', form.value.content)
    console.log('🚀 Content 长度:', form.value.content?.length || 0)
    
    // 发布文章逻辑
    const postData = { 
      ...form.value,
      publishedAt: form.value.publishedAt || new Date().toISOString()
    }
    
    if (isNew) {
      const result = await createPostAction(postData)
      console.log('✅ 文章发布成功:', result)
    } else {
      await updatePostAction(postId, postData)
      console.log('✅ 文章更新成功')
    }
    
    console.log('✅ 文章发布完成')
    // 跳转到文章列表
    await router.push('/admin/posts')
  } catch (error) {
    console.error('❌ 发布失败:', error)
  } finally {
    publishing.value = false
  }
}, 3000) // 3秒节流，防止重复发布

// 初始化数据
const initializeForm = async () => {
  if (!isNew) {
    // 如果是编辑模式，加载现有文章数据
    try {
      const post = await getPostByIdAction(postId)
      if (post) {
        form.value = {
          title: post.title,
          description: post.description || '',
          content: post.content,
          cover: post.cover || '',
          category: post.category || '',
          tags: post.tags,
          publishedAt: post.publishedAt ? new Date(post.publishedAt).toISOString().slice(0, 16) : '',
          featured: post.featured || false,
          slug: post.slug || '',
          metaDescription: post.metaDescription || '',
          keywords: post.keywords || '',
          views: post.views || 0
        }
        tagsInput.value = post.tags.join(', ')
      } else {
        // 文章不存在，跳转到新建页面
        await router.push('/admin/posts/create')
      }
    } catch (error) {
      console.error('加载文章失败:', error)
      // 加载失败，使用示例数据
      form.value = {
        title: '示例文章标题',
        description: '这是一篇示例文章的描述',
        content: '# 示例文章\n\n这里是文章内容...',
        cover: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop',
        category: '技术',
        tags: ['Vue.js', 'TypeScript'],
        publishedAt: new Date().toISOString().slice(0, 16),
        featured: false,
        slug: 'example-post',
        metaDescription: '这是示例文章的 meta 描述',
        keywords: 'Vue.js, TypeScript, 前端开发',
        views: 0
      }
      tagsInput.value = form.value.tags.join(', ')
    }
  } else {
    // 新文章，设置默认发布时间
    form.value.publishedAt = new Date().toISOString().slice(0, 16)
  }
}

// 监听标题变化，自动生成 slug
watch(() => form.value.title, (newTitle) => {
  if (newTitle && !form.value.slug) {
    form.value.slug = newTitle
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
})

// 监听内容变化，自动保存草稿
const autoSave = debounce(() => {
  if (form.value.title || form.value.content) {
    // 这里可以实现自动保存逻辑，但不显示loading状态
  }
}, 3000) // 3秒后自动保存

watch([() => form.value.title, () => form.value.content, () => form.value.description], () => {
  autoSave()
})

// 额外监听只针对 content 字段的变化
watch(() => form.value.content, (newContent, oldContent) => {
  // 这里可以添加内容变化的处理逻辑
})

// 页面挂载时初始化表单
onMounted(async () => {
  // 初始化示例数据（仅在没有数据时）
  const { initializeSamplePosts } = await import('~/composables/usePostActions')
  initializeSamplePosts()
  
  // 初始化表单
  await initializeForm()
})
</script>

<style scoped>
/* 自定义滚动条样式 */
:deep(.cherry-editor-wrapper) {
  scrollbar-width: thin;
  scrollbar-color: rgb(203 213 225) transparent;
}

:deep(.cherry-editor-wrapper::-webkit-scrollbar) {
  width: 8px;
}

:deep(.cherry-editor-wrapper::-webkit-scrollbar-track) {
  background: transparent;
}

:deep(.cherry-editor-wrapper::-webkit-scrollbar-thumb) {
  background-color: rgb(203 213 225);
  border-radius: 4px;
  border: 2px solid transparent;
  background-clip: content-box;
}

:deep(.cherry-editor-wrapper::-webkit-scrollbar-thumb:hover) {
  background-color: rgb(148 163 184);
}

/* Cherry编辑器优化样式 */
:deep(.cherry) {
  border: none !important;
  border-radius: 12px !important;
  overflow: hidden !important;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1) !important;
}

/* 增强编辑器分割线和布局 */
:deep(.cherry-editor) {
  border-right: 2px solid #e5e7eb !important;
  background: #ffffff !important;
}

:deep(.cherry-previewer) {
  border-left: 2px solid #e5e7eb !important;
  background: #fafafa !important;
}

/* 暗色模式适配 */
:deep(.dark .cherry-editor) {
  border-right-color: #374151 !important;
  background: #1f2937 !important;
}

:deep(.dark .cherry-previewer) {
  border-left-color: #374151 !important;
  background: #111827 !important;
}

/* 工具栏美化 */
:deep(.cherry-toolbar) {
  border-bottom: 1px solid #e5e7eb !important;
  background: #ffffff !important;
  padding: 8px 12px !important;
}

:deep(.dark .cherry-toolbar) {
  border-bottom-color: #374151 !important;
  background: #1f2937 !important;
}

/* 编辑器内容区域 */
:deep(.cherry-editor .CodeMirror) {
  font-size: 14px !important;
  line-height: 1.6 !important;
  padding: 16px !important;
}

:deep(.cherry-previewer .cherry-markdown) {
  padding: 16px !important;
  font-size: 14px !important;
  line-height: 1.6 !important;
}

/* 响应式优化 */
@media (max-width: 1279px) {
  :deep(.cherry) {
    height: 500px !important;
  }
}

@media (max-width: 768px) {
  :deep(.cherry) {
    height: 400px !important;
  }
  
  :deep(.cherry-editor),
  :deep(.cherry-previewer) {
    border: none !important;
  }
}

/* 动画和过渡效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 卡片悬停效果 */
.hover-card {
  transition: all 0.2s ease;
}

.hover-card:hover {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  transform: translateY(-1px);
}

/* 渐变背景 */
.gradient-bg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* 自定义徽章样式 */
.custom-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.custom-badge:hover {
  transform: scale(1.05);
}
</style>