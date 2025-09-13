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
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'inherit',
            a: {
              color: '#3b82f6',
              '&:hover': {
                color: '#1d4ed8',
              },
            },
            h1: {
              fontSize: '2.25rem',
              lineHeight: '2.5rem',
              fontWeight: '700',
              marginTop: '2rem',
              marginBottom: '1.5rem',
            },
            h2: {
              fontSize: '1.875rem',
              lineHeight: '2.25rem',
              fontWeight: '600',
              marginTop: '1.5rem',
              marginBottom: '1rem',
            },
            h3: {
              fontSize: '1.5rem',
              lineHeight: '2rem',
              fontWeight: '600',
              marginTop: '1.25rem',
              marginBottom: '0.75rem',
            },
            h4: {
              fontSize: '1.25rem',
              lineHeight: '1.75rem',
              fontWeight: '600',
              marginTop: '1rem',
              marginBottom: '0.5rem',
            },
            h5: {
              fontSize: '1.125rem',
              lineHeight: '1.75rem',
              fontWeight: '600',
              marginTop: '0.75rem',
              marginBottom: '0.5rem',
            },
            h6: {
              fontSize: '1rem',
              lineHeight: '1.5rem',
              fontWeight: '600',
              marginTop: '0.5rem',
              marginBottom: '0.25rem',
            },
          },
        },
      },
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
  ]
}
