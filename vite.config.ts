import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // Vercel sirve desde la raíz; el resto de producción (GitHub Pages) usa /website/
  const base = mode === 'production' && !process.env.VERCEL ? '/website/' : '/'

  return {
    base,
    plugins: [vue()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    define: {
      'process.env.APP_BASE': JSON.stringify(base),
      'process.env.VITE_API_BASE_URL': JSON.stringify(
        env.VITE_API_BASE_URL || 'https://techcrunch.com/wp-json/wp/v2'
      ),
      'process.env.VITE_CONTACT_EMAIL': JSON.stringify(env.VITE_CONTACT_EMAIL || '')
    }
  }
})
