/**
 * Composable principal para manejo del estado del blog
 * @module use-blog-core
 */

import { ref } from 'vue'
import type { BlogPost, BlogError } from '@/interfaces/blog.interface'
import useBlogs from '@/composables/use-blogs.composable'
import { getCacheData, setCacheData } from '@/composables/utils/cache-utils'

const CACHE_DURATION = 30 * 60 * 1000 // 30 minutos

export default function useBlogCore() {
  // Estado principal
  const posts = ref<BlogPost[]>([])
  const isLoading = ref(false)
  const isRetrying = ref(false)
  const error = ref<BlogError | null>(null)
  const lastUpdate = ref<Date | null>(null)

  // Composable base para API
  const { retrievePost } = useBlogs()

  /**
   * Carga los posts con manejo de errores y cache inteligente
   * @param itemsPerPage - Número de items a cargar
   */
  const loadPosts = async (itemsPerPage: number): Promise<void> => {
    const cacheKey = `posts-${itemsPerPage}`
    const cached = getCacheData<BlogPost[]>(cacheKey, CACHE_DURATION)

    // Verificar cache válido
    if (cached) {
      posts.value = cached
      lastUpdate.value = new Date()
      return
    }

    try {
      isLoading.value = true
      error.value = null

      const startTime = performance.now()
      const response = await Promise.race([
        retrievePost(Math.max(itemsPerPage, 12)),
        new Promise<Response>((_resolve, reject) =>
          setTimeout(() => reject(new Error('Timeout')), 10000)
        )
      ])

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      const loadTime = performance.now() - startTime

      // Enriquecer posts con metadata
      const enrichedPosts = data.map((post: BlogPost) => ({
        ...post,
        _cached: true,
        _loadTime: loadTime
      }))

      posts.value = enrichedPosts
      lastUpdate.value = new Date()

      // Guardar en cache
      setCacheData(cacheKey, enrichedPosts)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      const blogError: BlogError = {
        type: errorMessage === 'Timeout' ? 'timeout' : 'network',
        message: errorMessage,
        timestamp: Date.now()
      }

      error.value = blogError
      console.error('Error cargando posts del blog:', err)
    } finally {
      isLoading.value = false
      isRetrying.value = false
    }
  }

  /**
   * Reintenta cargar los posts
   * @param itemsPerPage - Número de items a cargar
   */
  const retryLoad = async (itemsPerPage: number): Promise<void> => {
    isRetrying.value = true
    await loadPosts(itemsPerPage)
  }

  return {
    // Estado
    posts,
    isLoading,
    isRetrying,
    error,
    lastUpdate,

    // Métodos
    loadPosts,
    retryLoad
  }
}
