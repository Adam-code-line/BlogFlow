/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue"
  ],
  theme: {
    extend: {
      fontFamily: {
        // 系统字体家族，避免依赖 Google Fonts
        'sans': [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          '"Noto Sans SC"',
          '"PingFang SC"',
          '"Hiragino Sans GB"',
          '"Microsoft YaHei"',
          '"WenQuanYi Micro Hei"',
          'sans-serif'
        ],
        'mono': [
          '"SFMono-Regular"',
          'Consolas',
          '"Liberation Mono"',
          'Menlo',
          '"Courier New"',
          'monospace'
        ],
        'serif': [
          '"Times New Roman"',
          'Times',
          '"Noto Serif SC"',
          '"Source Han Serif SC"',
          'serif'
        ]
      }
    }
  },
  plugins: []
}
