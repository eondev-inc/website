/**
 * Enhanced Blog Composable
 * Composable avanzado para el manejo del blog con optimizaciones de rendimiento,
 * lazy loading, cache inteligente y manejo de errores robusto.
 *
 * @author Yerffrey Romero
 * @version 2.0
 * @since 2025-09-05
 */

import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import useBlogs from '@/composables/use-blogs.composable'

// === IMPORTAR INTERFACES ===
import type {
  BlogPost,
  Category,
  BlogError,
  TechCrunchCategory,
  PostCacheEntry,
  CategoryCacheEntry,
  ShareData,
  CategoryPattern,
  HtmlEntities,
  CategoryCounts,
  ErrorWithStatus,
  ViewMode,
  CategoryColorMap,
  UseBlogEnhanced
} from '@/interfaces/blog.interface'

// === CONSTANTES Y CONFIGURACIÓN ===

const CACHE_DURATION = 30 * 60 * 1000 // 30 minutos
const ITEMS_PER_PAGE = 6
const READING_WPM = 200 // Palabras por minuto promedio

// === UTILIDADES DE CACHE ===

/**
 * Obtiene datos del cache si están vigentes
 * @param key Clave del cache
 * @returns Datos del cache o null si no son válidos
 */
const getCacheData = <T>(key: string): T | null => {
  try {
    const cached = localStorage.getItem(key)
    if (!cached) return null

    const { data, timestamp } = JSON.parse(cached)
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(key)
      return null
    }

    return data
  } catch {
    return null
  }
}

/**
 * Guarda datos en el cache
 * @param key Clave del cache
 * @param data Datos a guardar
 */
const setCacheData = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify({
      data,
      timestamp: Date.now()
    }))
  } catch (err) {
    console.warn('Error guardando en cache:', err)
  }
}

// === UTILIDADES DE TEXTO ===

/**
 * Mapa de entidades HTML
 */
const htmlEntities: HtmlEntities = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&nbsp;': ' ',
  '&copy;': '©',
  '&reg;': '®',
  '&trade;': '™',
  '&hellip;': '…',
  '&mdash;': '—',
  '&ndash;': '–',
  '&lsquo;': "'",
  '&rsquo;': "'",
  '&ldquo;': '"',
  '&rdquo;': '"'
}

/**
 * Decodifica entidades HTML
 * @param text Texto con entidades HTML
 * @returns Texto limpio
 */
const decodeHtmlEntities = (text: string): string => {
  let decoded = text
  for (const [entity, char] of Object.entries(htmlEntities)) {
    decoded = decoded.replace(new RegExp(entity, 'g'), char)
  }
  return decoded
}

/**
 * Limpia HTML y decodifica entidades
 * @param html HTML a limpiar
 * @returns Texto limpio
 */
const cleanHtml = (html: string): string => {
  const cleaned = html.replace(/<[^>]*>/g, '')
  return decodeHtmlEntities(cleaned)
}

/**
 * Trunca texto a una longitud específica
 * @param str Texto a truncar
 * @param length Longitud máxima
 * @returns Texto truncado
 */
const truncate = (str: string, length: number): string => {
  if (str.length <= length) return str
  return str.slice(0, length).trim() + '...'
}

/**
 * Estima el tiempo de lectura en minutos
 * @param content Contenido del artículo
 * @returns Tiempo estimado en minutos
 */
const estimateReadingTime = (content: string): number => {
  const cleanContent = cleanHtml(content)
  const wordCount = cleanContent.split(/\s+/).length
  return Math.ceil(wordCount / READING_WPM)
}

/**
 * Formatea una fecha para mostrar
 * @param dateString Fecha en formato ISO
 * @returns Fecha formateada
 */
const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return 'Fecha inválida'
  }
}

// === CONFIGURACIÓN DE CATEGORÍAS ===

/**
 * Patrones para categorización automática
 */
const categoryPatterns: CategoryPattern[] = [
  {
    keywords: ['ai', 'artificial intelligence', 'machine learning', 'ml', 'deep learning', 'neural', 'chatgpt', 'gpt'],
    categoryNames: ['Inteligencia Artificial', 'IA', 'Machine Learning', 'AI']
  },
  {
    keywords: ['startup', 'funding', 'investment', 'venture', 'vc', 'seed', 'series'],
    categoryNames: ['Startups', 'Funding', 'Investment', 'Venture Capital']
  },
  {
    keywords: ['crypto', 'bitcoin', 'blockchain', 'ethereum', 'nft', 'defi', 'web3'],
    categoryNames: ['Crypto', 'Blockchain', 'Bitcoin', 'Web3', 'DeFi']
  },
  {
    keywords: ['mobile', 'app', 'ios', 'android', 'smartphone', 'tablet'],
    categoryNames: ['Mobile', 'Apps', 'iOS', 'Android', 'Smartphone']
  },
  {
    keywords: ['security', 'privacy', 'hack', 'breach', 'cybersecurity', 'malware'],
    categoryNames: ['Security', 'Privacy', 'Cybersecurity', 'Hacking']
  },
  {
    keywords: ['social media', 'facebook', 'twitter', 'instagram', 'tiktok', 'youtube'],
    categoryNames: ['Social Media', 'Social Networks', 'Social', 'Facebook', 'Twitter']
  }
]

/**
 * Colores para categorías
 */
const categoryColors: CategoryColorMap = {
  Tecnología: '#3b82f6',
  Startups: '#10b981',
  'Inteligencia Artificial': '#8b5cf6',
  IA: '#8b5cf6',
  'Machine Learning': '#a855f7',
  AI: '#8b5cf6',
  Funding: '#f59e0b',
  Investment: '#f59e0b',
  'Venture Capital': '#d97706',
  Crypto: '#f97316',
  Blockchain: '#ea580c',
  Bitcoin: '#dc2626',
  Web3: '#c2410c',
  DeFi: '#b91c1c',
  Mobile: '#06b6d4',
  Apps: '#0891b2',
  iOS: '#0e7490',
  Android: '#155e75',
  Security: '#dc2626',
  Privacy: '#b91c1c',
  Cybersecurity: '#991b1b',
  'Social Media': '#ec4899',
  'Social Networks': '#db2777',
  Social: '#be185d'
}

/**
 * Composable principal para el manejo avanzado del blog
 */
export default function useBlogEnhanced(): UseBlogEnhanced {
  // === ESTADO PRINCIPAL ===
  const posts = ref<BlogPost[]>([])
  const isLoading = ref(false)
  const isRetrying = ref(false)
  const error = ref<BlogError | null>(null)
  const lastUpdate = ref<Date | null>(null)

  // === FILTROS Y BÚSQUEDA ===
  const searchQuery = ref('')
  const selectedCategory = ref<number | null>(null)
  const viewMode = ref<ViewMode>('grid')

  // === PAGINACIÓN ===
  const currentPage = ref(1)
  const itemsPerPage = ref(ITEMS_PER_PAGE)

  // === CATEGORÍAS Y FUNCIONALIDADES ===
  const categories = ref<Category[]>([])
  const favorites = ref<number[]>([])

  // === CACHE Y ESTADO ===
  const cacheExpiry = ref(CACHE_DURATION)

  // === COMPOSABLE BASE ===
  const { retrievePost } = useBlogs()

  // === CACHE ===
  const postCache = new Map<string, PostCacheEntry>()

  // Cache para categorías
  const categoriesCache = ref<CategoryCacheEntry | null>(null)

  /**
   * Decodifica entidades HTML como &amp;, &lt;, &gt;, etc.
   * @param text - Texto con entidades HTML
   * @returns Texto decodificado
   */
  const decodeHtmlEntities = (text: string): string => {
    const htmlEntities: HtmlEntities = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#039;': "'",
      '&nbsp;': ' ',
      '&copy;': '©',
      '&reg;': '®',
      '&trade;': '™'
    }

    return text.replace(/&[#\w]+;/g, (entity) => {
      return htmlEntities[entity] || entity
    })
  }

  /**
   * Carga las categorías desde la API de TechCrunch
   */
  const loadCategories = async (): Promise<void> => {
    const CACHE_DURATION = 30 * 60 * 1000 // 30 minutos

    // Verificar cache
    if (categoriesCache.value &&
        (Date.now() - categoriesCache.value.timestamp) < CACHE_DURATION) {
      categories.value = categoriesCache.value.data
      return
    }

    try {
      const response = await fetch('https://techcrunch.com/wp-json/wp/v2/categories?per_page=100')

      if (!response.ok) {
        throw new Error(`Error al cargar categorías: ${response.status}`)
      }

      const techCrunchCategories: TechCrunchCategory[] = await response.json()

      // Transformar las categorías de TechCrunch al formato local
      const transformedCategories: Category[] = techCrunchCategories
        .filter(cat => cat.count > 0) // Solo categorías con artículos
        .map(cat => ({
          id: cat.id,
          name: decodeHtmlEntities(cat.name), // Decodificar entidades HTML
          count: cat.count,
          color: categoryColors[cat.slug] || '#6b7280' // Color por defecto
        }))
        .sort((a, b) => b.count - a.count) // Ordenar por cantidad de artículos
        .slice(0, 20) // Limitar a las 20 más populares

      categories.value = transformedCategories

      // Actualizar cache
      categoriesCache.value = {
        data: transformedCategories,
        timestamp: Date.now()
      }
    } catch (err) {
      console.error('Error cargando categorías:', err)
      // Fallback con categorías predeterminadas
      categories.value = [
        { id: 1, name: 'Tecnología', count: 10, color: '#3b82f6' },
        { id: 2, name: 'Startups', count: 8, color: '#10b981' },
        { id: 3, name: 'Inteligencia Artificial', count: 6, color: '#8b5cf6' }
      ]
    }
  }

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

      // Cargar categorías en paralelo si no están cargadas
      if (categories.value.length === 0) {
        await loadCategories()
      }

      const startTime = performance.now()
      const response = await Promise.race([
        retrievePost(Math.max(itemsPerPage.value, 12)),
        new Promise((_resolve, reject) =>
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
    } catch (err: unknown) {
      const errorWithStatus = err as ErrorWithStatus
      const blogError: BlogError = {
        type: err instanceof TypeError
          ? 'network'
          : errorWithStatus?.message === 'Timeout'
            ? 'timeout'
            : errorWithStatus?.message?.includes('HTTP') ? 'network' : 'unknown',
        message: errorWithStatus?.message || 'Error desconocido al cargar posts',
        code: errorWithStatus?.status || undefined,
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
   * Usa los IDs reales de las categorías de TechCrunch cargadas
   */
  const generateSmartCategories = (post: BlogPost): number[] => {
    // Si las categorías no están cargadas aún, retornar array vacío
    if (categories.value.length === 0) {
      return []
    }

    const content = (post.title.rendered + ' ' + post.excerpt.rendered).toLowerCase()
    const assignedCategories: number[] = []

    // Crear mapeo dinámico basado en las categorías cargadas de TechCrunch
    const getCategoryIdByName = (searchNames: string[]): number | null => {
      for (const searchName of searchNames) {
        const category = categories.value.find(cat =>
          cat.name.toLowerCase().includes(searchName.toLowerCase()) ||
          searchName.toLowerCase().includes(cat.name.toLowerCase())
        )
        if (category) return category.id
      }
      return null
    }

    // Patrones de contenido con nombres de categorías de TechCrunch
    const contentPatterns: CategoryPattern[] = [
      {
        keywords: ['artificial intelligence', 'ai', 'machine learning', 'neural', 'deep learning', 'chatgpt', 'openai'],
        categoryNames: ['AI', 'Artificial Intelligence']
      },
      {
        keywords: ['startup', 'entrepreneur', 'funding', 'investment', 'seed', 'series'],
        categoryNames: ['Startups', 'Venture', 'Fundraising']
      },
      {
        keywords: ['crypto', 'bitcoin', 'ethereum', 'blockchain', 'cryptocurrency', 'web3', 'nft'],
        categoryNames: ['Crypto', 'Cryptocurrency']
      },
      {
        keywords: ['fintech', 'financial', 'banking', 'payment', 'finance', 'money'],
        categoryNames: ['Fintech']
      },
      {
        keywords: ['hardware', 'device', 'chip', 'processor', 'semiconductor', 'electronics'],
        categoryNames: ['Hardware', 'Gadgets']
      },
      {
        keywords: ['app', 'mobile', 'ios', 'android', 'application', 'software'],
        categoryNames: ['Apps']
      },
      {
        keywords: ['social media', 'facebook', 'twitter', 'instagram', 'tiktok', 'social'],
        categoryNames: ['Social']
      },
      {
        keywords: ['gaming', 'game', 'esports', 'console', 'playstation', 'xbox'],
        categoryNames: ['Gaming']
      },
      {
        keywords: ['enterprise', 'business', 'saas', 'b2b', 'corporate', 'company'],
        categoryNames: ['Enterprise']
      },
      {
        keywords: ['media', 'entertainment', 'streaming', 'content', 'video', 'music'],
        categoryNames: ['Media & Entertainment']
      },
      {
        keywords: ['climate', 'environment', 'green', 'renewable', 'sustainable', 'carbon'],
        categoryNames: ['Climate']
      },
      {
        keywords: ['biotech', 'health', 'medical', 'pharma', 'healthcare', 'biology'],
        categoryNames: ['Biotech & Health']
      },
      {
        keywords: ['robotics', 'robot', 'automation', 'autonomous', 'drone'],
        categoryNames: ['Robotics']
      },
      {
        keywords: ['privacy', 'security', 'cybersecurity', 'data protection', 'encryption'],
        categoryNames: ['Privacy', 'Security']
      },
      {
        keywords: ['government', 'policy', 'regulation', 'law', 'legal', 'politics'],
        categoryNames: ['Government & Policy']
      },
      {
        keywords: ['commerce', 'ecommerce', 'retail', 'shopping', 'marketplace', 'store'],
        categoryNames: ['Commerce']
      }
    ]

    // Buscar coincidencias en el contenido
    contentPatterns.forEach(pattern => {
      const hasKeyword = pattern.keywords.some(keyword => content.includes(keyword))
      if (hasKeyword) {
        const categoryId = getCategoryIdByName(pattern.categoryNames)
        if (categoryId && !assignedCategories.includes(categoryId)) {
          assignedCategories.push(categoryId)
        }
      }
    })

    // Si no se encontraron categorías específicas, asignar una genérica
    if (assignedCategories.length === 0) {
      // Buscar la primera categoría disponible como fallback
      const fallbackCategory = categories.value.find(cat =>
        ['Startups', 'Enterprise', 'Apps'].some(name => cat.name.includes(name))
      )
      if (fallbackCategory) {
        assignedCategories.push(fallbackCategory.id)
      }
    }

    return assignedCategories.slice(0, 3) // Máximo 3 categorías
  }

  /**
   * Actualiza los contadores de categorías
   */
  const updateCategoryCounts = (posts: BlogPost[]): void => {
    const counts: CategoryCounts = {}

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
    const shareData: ShareData = {
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
   * Limpiar HTML y decodificar entidades
   */
  const cleanHtml = (html: string): string => {
    // Primero remover tags HTML, luego decodificar entidades HTML
    const withoutTags = html.replace(/<[^>]*>/g, '')
    return decodeHtmlEntities(withoutTags).trim()
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

  // Cargar favoritos desde localStorage y categorías
  onMounted(async () => {
    try {
      const savedFavorites = localStorage.getItem('blog-favorites')
      if (savedFavorites) {
        favorites.value = JSON.parse(savedFavorites)
      }
    } catch (err) {
      console.warn('No se pudieron cargar los favoritos:', err)
    }

    // Cargar categorías automáticamente
    await loadCategories()
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
    loadCategories,
    retryLoad,
    toggleFavorite,
    shareArticle,
    clearSearch,
    getCategoryName,
    estimateReadingTime,

    // Utilidades
    formatDate,
    cleanHtml,
    decodeHtmlEntities,
    truncate,

    // Estados avanzados
    isRetrying,
    lastUpdate,
    cacheExpiry
  }
}
