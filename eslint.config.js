import { createConfigForNuxt } from '@nuxt/eslint'

export default createConfigForNuxt({
  features: {
    // TypeScript 支持
    typescript: true,
    // Vue 支持
    vue: true,
    // Stylistic 格式化
    stylistic: {
      indent: 2,
      quotes: 'single',
      semi: false
    }
  },
  dirs: {
    src: [
      './app'
    ]
  }
}).append({
  rules: {
    // 自定义规则
    '@typescript-eslint/no-unused-vars': 'warn',
    'vue/multi-word-component-names': 'off',
    'vue/no-v-html': 'off'
  }
})