/**
 * Composable para filtros y búsqueda del blog
 * @module use-blog-filters
 */

import { ref, computed, watch, onUnmounted, type Ref } from 'vue'
import type { BlogPost, ViewMode } from '@/interfaces/blog.interface'
import { cleanHtml } from '@/composables/utils/html-utils'

const ITEMS_PER_PAGE = 6

export default function useBlogFilters(posts: Ref<BlogPost[]>) {
  // Estado de filtros
  const searchQuery = ref('')
  const selectedCategory = ref<number | null>(null)
  const viewMode = ref<ViewMode>('grid')

  // Paginación
  const currentPage = ref(1)
  const itemsPerPage = ref(ITEMS_PER_PAGE)

  // Debounce timer
  let searchTimeout: ReturnType<typeof setTimeout>

  /**
   * Posts filtrados según búsqueda y categoría
   */
  const filteredPosts = computed(() => {
    let filtered = posts.value.slice()

    // Filtro por búsqueda
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

  /**
   * Posts paginados
   */
  const paginatedPosts = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredPosts.value.slice(start, end)
  })

  /**
   * Total de páginas
   */
  const totalPages = computed(() =>
    Math.ceil(filteredPosts.value.length / itemsPerPage.value)
  )

  /**
   * Limpia la búsqueda
   */
  const clearSearch = (): void => {
    searchQuery.value = ''
  }

  /**
   * Navega a una página específica
   * @param page - Número de página
   */
  const goToPage = (page: number): void => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  /**
   * Selecciona una categoría
   * @param categoryId - ID de la categoría
   */
  const selectCategory = (categoryId: number | null): void => {
    selectedCategory.value = categoryId
  }

  // Reset página cuando cambian filtros
  watch([searchQuery, selectedCategory, itemsPerPage], () => {
    currentPage.value = 1
  })

  // Debounce para búsqueda
  watch(searchQuery, () => {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
      // La búsqueda se ejecuta automáticamente por computed
    }, 300)
  })

  // Cleanup
  onUnmounted(() => {
    clearTimeout(searchTimeout)
  })

  return {
    // Estado
    searchQuery,
    selectedCategory,
    viewMode,
    currentPage,
    itemsPerPage,

    // Computed
    filteredPosts,
    paginatedPosts,
    totalPages,

    // Métodos
    clearSearch,
    goToPage,
    selectCategory
  }
}
