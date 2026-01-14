/**
 * Enhanced Blog Composable (Refactorizado)
 * Composable principal que orquesta los módulos especializados
 *
 * @author Yerffrey Romero
 * @version 3.0 (Refactorizado)
 * @since 2026-01-14
 */

import { onMounted, ref } from 'vue'

// Composables modulares
import useBlogCore from './blog/use-blog-core.composable'
import useBlogFilters from './blog/use-blog-filters.composable'
import useBlogCategories from './blog/use-blog-categories.composable'
import useBlogFeatures from './blog/use-blog-features.composable'

// Utilidades
import { estimateReadingTime, truncate } from './utils/text-utils'
import { formatDate, formatDateShort } from './utils/date-utils'
import { cleanHtml, decodeHtmlEntities } from './utils/html-utils'

// Interfaces
import type { UseBlogEnhanced } from '@/interfaces/blog.interface'

/**
 * Composable principal para el manejo avanzado del blog
 * Ahora usa una arquitectura modular con responsabilidades separadas
 */
export default function useBlogEnhanced(): UseBlogEnhanced {
  // Composables modulares
  const core = useBlogCore()
  const filters = useBlogFilters(core.posts)
  const categories = useBlogCategories()
  const features = useBlogFeatures()

  // Cache expiry (30 minutos)
  const cacheExpiry = ref(30 * 60 * 1000)

  /**
   * Carga inicial de datos
   */
  onMounted(async () => {
    // Cargar categorías primero
    await categories.loadCategories()

    // Luego cargar posts
    await core.loadPosts(filters.itemsPerPage.value)

    // Generar categorías inteligentes para los posts
    core.posts.value.forEach(post => {
      if (!post.categories || post.categories.length === 0) {
        post.categories = categories.generateSmartCategories(post)
      }
    })

    // Actualizar contadores de categorías
    categories.updateCategoryCounts(core.posts.value)
  })

  /**
   * Wrapper para recargar posts que incluye actualización de categorías
   */
  const reloadPosts = async (): Promise<void> => {
    await core.loadPosts(filters.itemsPerPage.value)
    categories.updateCategoryCounts(core.posts.value)
  }

  /**
   * Wrapper para retry que incluye actualización de categorías
   */
  const retryLoadWithCategories = async (): Promise<void> => {
    await core.retryLoad(filters.itemsPerPage.value)
    categories.updateCategoryCounts(core.posts.value)
  }

  return {
    // Estado del core
    posts: core.posts,
    isLoading: core.isLoading,
    isRetrying: core.isRetrying,
    error: core.error,
    lastUpdate: core.lastUpdate,

    // Filtros y búsqueda
    searchQuery: filters.searchQuery,
    selectedCategory: filters.selectedCategory,
    viewMode: filters.viewMode,
    currentPage: filters.currentPage,
    itemsPerPage: filters.itemsPerPage,
    filteredPosts: filters.filteredPosts,
    paginatedPosts: filters.paginatedPosts,
    totalPages: filters.totalPages,

    // Categorías
    categories: categories.categories,

    // Features (favoritos, compartir)
    favorites: features.favorites,

    // Métodos del core
    loadPosts: reloadPosts,
    retryLoad: retryLoadWithCategories,

    // Métodos de filtros
    clearSearch: filters.clearSearch,

    // Métodos de categorías
    loadCategories: categories.loadCategories,
    getCategoryName: categories.getCategoryName,

    // Métodos de features
    toggleFavorite: features.toggleFavorite,
    shareArticle: features.shareArticle,

    // Utilidades exportadas
    estimateReadingTime,
    formatDate,
    cleanHtml,
    decodeHtmlEntities,
    truncate,

    // Estados avanzados
    cacheExpiry
  }
}
