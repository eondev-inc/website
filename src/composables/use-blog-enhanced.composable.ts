/**
 * Enhanced Blog Composable
 * Composable avanzado para el manejo del blog con optimizaciones de rendimiento,
 * lazy loading, cache inteligente y manejo de errores robusto.
 *
 * @author Yerffrey Romero.
 * @version 2.0
 * @since 2025-09-05
 */

import { ref, computed, watch, onMounted, onUnmounted, readonly, type Ref } from 'vue'
import useBlogs from '@/composables/use-blogs.composable'

interface BlogPost {
  id: number
  title: { rendered: string }
  excerpt: { rendered: string }
  content?: { rendered: string }
  link: string
  date: string
  jetpack_featured_media_url?: string
  categories?: number[]
  _cached?: boolean
  _loadTime?: number
}

interface Category {
  id: number
  name: string
  count: number
  color?: string
}

interface BlogError {
  type: 'network' | 'parse' | 'timeout' | 'unknown'
  message: string
  code?: number
  timestamp: number
}

interface UseBlogEnhanced {
  // Estado principal
  posts: Readonly<Ref<BlogPost[]>>
  isLoading: Readonly<Ref<boolean>>
  error: Readonly<Ref<BlogError | null>>

  // Filtros y búsqueda
  searchQuery: Ref<string>
  selectedCategory: Ref<number | null>
  viewMode: Ref<'grid' | 'list'>

  // Paginación
  currentPage: Ref<number>
  itemsPerPage: Ref<number>
  totalPages: Readonly<Ref<number>>

  // Computed
  filteredPosts: Readonly<Ref<BlogPost[]>>
  paginatedPosts: Readonly<Ref<BlogPost[]>>
  categories: Readonly<Ref<Category[]>>

  // Funcionalidades
  favorites: Ref<number[]>

  // Métodos
  loadPosts: () => Promise<void>
  retryLoad: () => Promise<void>
  toggleFavorite: (postId: number) => void
  shareArticle: (post: BlogPost) => Promise<void>
  clearSearch: () => void
  getCategoryName: (categoryId: number) => string
  estimateReadingTime: (content: string) => number

  // Utilidades
  formatDate: (dateString: string) => string
  cleanHtml: (html: string) => string
  truncate: (str: string, length: number) => string

  // Estados avanzados
  isRetrying: Readonly<Ref<boolean>>
  lastUpdate: Readonly<Ref<Date | null>>
  cacheExpiry: Readonly<Ref<number>>
}

/**
 * Hook personalizado para manejo avanzado del blog
 * @param initialItemsPerPage - Número inicial de items por página
 * @returns Interface completa del blog con funcionalidades avanzadas
 */
export function useBlogEnhanced(initialItemsPerPage = 12): UseBlogEnhanced {
  const { retrievePost } = useBlogs()

  // Estados principales
  const posts = ref<BlogPost[]>([])
  const isLoading = ref(false)
  const isRetrying = ref(false)
  const error = ref<BlogError | null>(null)
  const lastUpdate = ref<Date | null>(null)
  const cacheExpiry = ref(5 * 60 * 1000) // 5 minutos

  // Filtros y búsqueda
  const searchQuery = ref('')
  const selectedCategory = ref<number | null>(null)
  const viewMode = ref<'grid' | 'list'>('grid')

  // Paginación
  const currentPage = ref(1)
  const itemsPerPage = ref(initialItemsPerPage)

  // Favoritos
  const favorites = ref<number[]>([])

  // Cache para optimización
  const postCache = new Map<string, { data: BlogPost[], timestamp: number }>()

  // Categorías con colores personalizados
  const categories = ref<Category[]>([
    { id: 1, name: 'Desarrollo Web', count: 8, color: '#3b82f6' },
    { id: 2, name: 'JavaScript', count: 12, color: '#f59e0b' },
    { id: 3, name: 'Vue.js', count: 6, color: '#10b981' },
    { id: 4, name: 'TypeScript', count: 4, color: '#3b82f6' },
    { id: 5, name: 'UI/UX', count: 3, color: '#8b5cf6' },
    { id: 6, name: 'Herramientas', count: 5, color: '#ef4444' },
    { id: 7, name: 'Performance', count: 4, color: '#f97316' },
    { id: 8, name: 'Testing', count: 3, color: '#06b6d4' }
  ])

  // Debounce timer
  let searchTimeout: ReturnType<typeof setTimeout>

  // Computed properties optimizadas
  const filteredPosts = computed(() => {
    let filtered = posts.value.slice() // Copia shallow para mejor rendimiento

    // Filtro por búsqueda (optimizado)
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(post => {
        const titleText = cleanHtml(post.title.rendered).toLowerCase()
        const excerptText = cleanHtml(post.excerpt.rendered).toLowerCase()
        return titleText.includes(query) || excerptText.includes(query)
      })
    }

    // Filtro por categoría
    if (selectedCategory.value !== null) {
      filtered = filtered.filter(post =>
        post.categories?.includes(selectedCategory.value!)
      )
    }

    return filtered
  })

  const paginatedPosts = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredPosts.value.slice(start, end)
  })

  const totalPages = computed(() =>
    Math.ceil(filteredPosts.value.length / itemsPerPage.value)
  )

  /**
   * Carga los posts con manejo de errores y cache inteligente
   */
  const loadPosts = async (): Promise<void> => {
    const cacheKey = `posts-${itemsPerPage.value}`
    const cached = postCache.get(cacheKey)

    // Verificar cache válido
    if (cached && (Date.now() - cached.timestamp) < cacheExpiry.value) {
      posts.value = cached.data
      lastUpdate.value = new Date(cached.timestamp)
      return
    }

    try {
      isLoading.value = true
      error.value = null

      const startTime = performance.now()
      const response = await Promise.race([
        retrievePost(Math.max(itemsPerPage.value, 12)),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), 10000)
        )
      ]) as Response

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      const loadTime = performance.now() - startTime

      // Procesar y enriquecer posts
      const enrichedPosts = data.map((post: BlogPost, index: number) => ({
        ...post,
        categories: generateSmartCategories(post),
        _cached: true,
        _loadTime: loadTime
      }))

      posts.value = enrichedPosts
      lastUpdate.value = new Date()

      // Guardar en cache
      postCache.set(cacheKey, {
        data: enrichedPosts,
        timestamp: Date.now()
      })

      // Actualizar contadores de categorías
      updateCategoryCounts(enrichedPosts)
    } catch (err: any) {
      const blogError: BlogError = {
        type: err instanceof TypeError
          ? 'network'
          : err?.message === 'Timeout'
            ? 'timeout'
            : err?.message?.includes('HTTP') ? 'network' : 'unknown',
        message: err?.message || 'Error desconocido al cargar posts',
        code: err?.status || undefined,
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
   */
  const retryLoad = async (): Promise<void> => {
    isRetrying.value = true
    await loadPosts()
  }

  /**
   * Genera categorías inteligentes basadas en el contenido del post
   */
  const generateSmartCategories = (post: BlogPost): number[] => {
    const content = (post.title.rendered + ' ' + post.excerpt.rendered).toLowerCase()
    const assignedCategories: number[] = []

    // Análisis de contenido para asignación inteligente
    const patterns: { [key: number]: string[] } = {
      1: ['web', 'html', 'css', 'frontend', 'desarrollo'],
      2: ['javascript', 'js', 'ecmascript', 'node'],
      3: ['vue', 'vuejs', 'composition', 'reactive'],
      4: ['typescript', 'ts', 'types', 'interface'],
      5: ['design', 'ux', 'ui', 'usuario', 'interfaz'],
      6: ['tool', 'herramienta', 'vscode', 'git'],
      7: ['performance', 'optimizacion', 'speed', 'fast'],
      8: ['test', 'testing', 'jest', 'cypress']
    }

    Object.entries(patterns).forEach(([categoryId, keywords]) => {
      if (keywords.some(keyword => content.includes(keyword))) {
        assignedCategories.push(parseInt(categoryId))
      }
    })

    // Asegurar al menos una categoría
    if (assignedCategories.length === 0) {
      assignedCategories.push(1) // Desarrollo Web por defecto
    }

    return assignedCategories.slice(0, 3) // Máximo 3 categorías
  }

  /**
   * Actualiza los contadores de categorías
   */
  const updateCategoryCounts = (posts: BlogPost[]) => {
    const counts: { [key: number]: number } = {}

    posts.forEach(post => {
      post.categories?.forEach(categoryId => {
        counts[categoryId] = (counts[categoryId] || 0) + 1
      })
    })

    categories.value = categories.value.map(category => ({
      ...category,
      count: counts[category.id] || 0
    }))
  }

  /**
   * Toggle favorito con persistencia
   */
  const toggleFavorite = (postId: number): void => {
    const index = favorites.value.indexOf(postId)
    if (index > -1) {
      favorites.value.splice(index, 1)
    } else {
      favorites.value.push(postId)
    }

    // Persistir en localStorage
    try {
      localStorage.setItem('blog-favorites', JSON.stringify(favorites.value))
    } catch (err) {
      console.warn('No se pudieron guardar los favoritos:', err)
    }
  }

  /**
   * Compartir artículo con API nativa y fallbacks
   */
  const shareArticle = async (post: BlogPost): Promise<void> => {
    const shareData = {
      title: cleanHtml(post.title.rendered),
      text: cleanHtml(post.excerpt.rendered).substring(0, 100) + '...',
      url: post.link
    }

    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData)
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(post.link)
        // Aquí podrías emitir un evento para mostrar toast
        console.log('URL copiada al portapapeles')
      } else {
        // Fallback final: abrir en nueva ventana
        window.open(`mailto:?subject=${encodeURIComponent(shareData.title)}&body=${encodeURIComponent(shareData.url)}`)
      }
    } catch (err) {
      console.error('Error compartiendo artículo:', err)
    }
  }

  /**
   * Limpiar búsqueda
   */
  const clearSearch = (): void => {
    searchQuery.value = ''
  }

  /**
   * Obtener nombre de categoría por ID
   */
  const getCategoryName = (categoryId: number): string => {
    return categories.value.find(c => c.id === categoryId)?.name || 'Sin categoría'
  }

  /**
   * Estimar tiempo de lectura
   */
  const estimateReadingTime = (content: string): number => {
    const wordsPerMinute = 200
    const cleanContent = cleanHtml(content)
    const wordCount = cleanContent.split(/\s+/).filter(word => word.length > 0).length
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
  }

  /**
   * Formatear fecha
   */
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return 'Fecha inválida'
    }
  }

  /**
   * Limpiar HTML
   */
  const cleanHtml = (html: string): string => {
    return html.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').trim()
  }

  /**
   * Truncar texto
   */
  const truncate = (str: string, length: number): string => {
    if (str.length <= length) return str
    return str.substring(0, length).replace(/\s+\S*$/, '') + '...'
  }

  // Watchers para optimizaciones
  watch([searchQuery, selectedCategory, itemsPerPage], () => {
    currentPage.value = 1
  })

  watch(searchQuery, () => {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
      // La búsqueda se ejecuta automáticamente por computed
    }, 300)
  })

  // Cargar favoritos desde localStorage
  onMounted(() => {
    try {
      const savedFavorites = localStorage.getItem('blog-favorites')
      if (savedFavorites) {
        favorites.value = JSON.parse(savedFavorites)
      }
    } catch (err) {
      console.warn('No se pudieron cargar los favoritos:', err)
    }
  })

  // Cleanup
  onUnmounted(() => {
    clearTimeout(searchTimeout)
  })

  return {
    // Estado principal
    posts,
    isLoading,
    error,

    // Filtros y búsqueda
    searchQuery,
    selectedCategory,
    viewMode,

    // Paginación
    currentPage,
    itemsPerPage,
    totalPages,

    // Computed
    filteredPosts,
    paginatedPosts,
    categories,

    // Funcionalidades
    favorites,

    // Métodos
    loadPosts,
    retryLoad,
    toggleFavorite,
    shareArticle,
    clearSearch,
    getCategoryName,
    estimateReadingTime,

    // Utilidades
    formatDate,
    cleanHtml,
    truncate,

    // Estados avanzados
    isRetrying,
    lastUpdate,
    cacheExpiry
  }
}

export default useBlogEnhanced
