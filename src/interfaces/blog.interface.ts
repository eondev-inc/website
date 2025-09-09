/**
 * Blog Interfaces
 * Interfaces y tipos relacionados con la funcionalidad del blog
 *
 * @author Yerffrey Romero
 * @version 1.0
 * @since 2025-09-08
 */

import type { Ref } from 'vue'

// === INTERFACES PRINCIPALES ===

/**
 * Interface para un post del blog
 */
export interface BlogPost {
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

/**
 * Interface para una categoría del blog
 */
export interface Category {
  id: number
  name: string
  count: number
  color?: string
}

/**
 * Interface para errores del blog
 */
export interface BlogError {
  type: 'network' | 'parse' | 'timeout' | 'unknown'
  message: string
  code?: number
  timestamp: number
}

// === INTERFACES PARA API DE TECHCRUNCH ===

/**
 * Interface para categorías de TechCrunch API
 */
export interface TechCrunchCategory {
  id: number
  name: string
  slug: string
  count: number
  description: string
}

// === INTERFACES PARA CACHE ===

/**
 * Interface para entrada de cache de posts
 */
export interface PostCacheEntry {
  data: BlogPost[]
  timestamp: number
}

/**
 * Interface para entrada de cache de categorías
 */
export interface CategoryCacheEntry {
  data: Category[]
  timestamp: number
}

// === INTERFACES PARA FUNCIONALIDADES ===

/**
 * Interface para datos de compartir
 */
export interface ShareData {
  title: string
  text: string
  url: string
}

/**
 * Interface para patrones de categorización
 */
export interface CategoryPattern {
  keywords: string[]
  categoryNames: string[]
}

/**
 * Interface para entidades HTML
 */
export interface HtmlEntities {
  [key: string]: string
}

/**
 * Interface para contadores de categorías
 */
export interface CategoryCounts {
  [categoryId: number]: number
}

/**
 * Interface para errores con código de estado
 */
export interface ErrorWithStatus extends Error {
  status?: number
}

// === TIPOS PARA CONFIGURACIONES ===

/**
 * Modo de vista del blog
 */
export type ViewMode = 'grid' | 'list'

/**
 * Mapeo de colores por categoría
 */
export type CategoryColorMap = Record<string, string>

// === INTERFACE PRINCIPAL DEL COMPOSABLE ===

/**
 * Interface principal del composable useBlogEnhanced
 * Define toda la API pública disponible
 */
export interface UseBlogEnhanced {
  // Estado principal
  posts: Readonly<Ref<BlogPost[]>>
  isLoading: Readonly<Ref<boolean>>
  error: Readonly<Ref<BlogError | null>>

  // Filtros y búsqueda
  searchQuery: Ref<string>
  selectedCategory: Ref<number | null>
  viewMode: Ref<ViewMode>

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
  loadCategories: () => Promise<void>
  retryLoad: () => Promise<void>
  toggleFavorite: (postId: number) => void
  shareArticle: (post: BlogPost) => Promise<void>
  clearSearch: () => void
  getCategoryName: (categoryId: number) => string
  estimateReadingTime: (content: string) => number

  // Utilidades
  formatDate: (dateString: string) => string
  cleanHtml: (html: string) => string
  decodeHtmlEntities: (text: string) => string
  truncate: (str: string, length: number) => string

  // Estados avanzados
  isRetrying: Readonly<Ref<boolean>>
  lastUpdate: Readonly<Ref<Date | null>>
  cacheExpiry: Readonly<Ref<number>>
}
