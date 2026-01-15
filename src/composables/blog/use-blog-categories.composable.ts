/**
 * Composable para manejo de categorías del blog
 * @module use-blog-categories
 */

import { ref } from 'vue'
import type {
  Category,
  TechCrunchCategory,
  CategoryCacheEntry,
  BlogPost,
  CategoryCounts,
  CategoryPattern
} from '@/interfaces/blog.interface'
import { decodeHtmlEntities } from '@/composables/utils/html-utils'

const CACHE_DURATION = 30 * 60 * 1000 // 30 minutos

/**
 * Colores para categorías
 */
const categoryColors: Record<string, string> = {
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
 * Patrones para categorización automática
 */
const categoryPatterns: CategoryPattern[] = [
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

export default function useBlogCategories() {
  // Estado
  const categories = ref<Category[]>([])
  const categoriesCache = ref<CategoryCacheEntry | null>(null)

  /**
   * Carga las categorías desde la API de TechCrunch
   */
  const loadCategories = async (): Promise<void> => {
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
          name: decodeHtmlEntities(cat.name),
          count: cat.count,
          color: categoryColors[cat.slug] || '#6b7280'
        }))
        .sort((a, b) => b.count - a.count) // Ordenar por cantidad
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

  /**
   * Obtiene el nombre de una categoría por ID
   * @param categoryId - ID de la categoría
   * @returns Nombre de la categoría
   */
  const getCategoryName = (categoryId: number): string => {
    return categories.value.find(c => c.id === categoryId)?.name || 'Sin categoría'
  }

  /**
   * Genera categorías inteligentes basadas en el contenido del post
   * @param post - Post a categorizar
   * @returns Array de IDs de categorías
   */
  const generateSmartCategories = (post: BlogPost): number[] => {
    if (categories.value.length === 0) {
      return []
    }

    const content = (post.title.rendered + ' ' + post.excerpt.rendered).toLowerCase()
    const assignedCategories: number[] = []

    // Buscar categoría por nombre
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

    // Buscar coincidencias en el contenido
    categoryPatterns.forEach(pattern => {
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
   * Actualiza los contadores de categorías basándose en los posts
   * @param posts - Array de posts
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

  return {
    // Estado
    categories,

    // Métodos
    loadCategories,
    getCategoryName,
    generateSmartCategories,
    updateCategoryCounts
  }
}
