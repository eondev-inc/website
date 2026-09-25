import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/website/' : '/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  define: {
    'process.env.VITE_API_BLOG_URL': JSON.stringify(process.env.VITE_API_BLOG_URL),
    'process.env.VITE_CONTACT_EMAIL': JSON.stringify(process.env.VITE_CONTACT_EMAIL)
  }
}))
