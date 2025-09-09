import '@nuxt/content'

declare global {
  // 确保 queryContent 在全局可用
  const queryContent: typeof import('@nuxt/content/composables').queryContent
}

export {}