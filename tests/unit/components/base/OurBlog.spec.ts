import { ref, computed } from 'vue'
import { fireEvent } from '@testing-library/vue'
import OurBlog from '@/components/base/OurBlog.vue'
import { renderWithApp } from '../../../helpers'
import type { BlogPost } from '@/interfaces/blog.interface'

const mockLoadPosts = jest.fn().mockResolvedValue(undefined)
const mockRetryLoad = jest.fn().mockResolvedValue(undefined)
const mockToggleFavorite = jest.fn()
const mockShareArticle = jest.fn().mockResolvedValue(undefined)

const baseState = {
  posts: ref<BlogPost[]>([]),
  isLoading: ref(false),
  isRetrying: ref(false),
  error: ref(null as null | { message: string, type: string, timestamp: number }),
  lastUpdate: ref(null),
  searchQuery: ref(''),
  selectedCategory: ref<number | null>(null),
  viewMode: ref<'grid' | 'list'>('grid'),
  currentPage: ref(1),
  itemsPerPage: ref(3),
  categories: ref([{ id: 1, name: 'AI', count: 1, color: '#3b82f6' }]),
  favorites: ref<number[]>([])
}

jest.mock('@/composables/use-blog-enhanced.composable', () => ({
  __esModule: true,
  default: () => ({
    ...baseState,
    filteredPosts: computed(() => baseState.posts.value),
    paginatedPosts: computed(() => baseState.posts.value),
    totalPages: computed(() => 1),
    loadPosts: mockLoadPosts,
    retryLoad: mockRetryLoad,
    clearSearch: () => { baseState.searchQuery.value = '' },
    loadCategories: jest.fn(),
    getCategoryName: () => 'AI',
    toggleFavorite: mockToggleFavorite,
    shareArticle: mockShareArticle,
    estimateReadingTime: () => 1,
    formatDate: () => '01/01/2026',
    cleanHtml: (v: string) => v,
    decodeHtmlEntities: (v: string) => v,
    truncate: (v: string) => v,
    cacheExpiry: ref(1800000)
  })
}))

describe('OurBlog.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    baseState.posts.value = []
    baseState.error.value = null
    baseState.isLoading.value = false
    baseState.isRetrying.value = false
    baseState.favorites.value = []
    baseState.searchQuery.value = ''
    baseState.selectedCategory.value = null
    baseState.viewMode.value = 'grid'
    baseState.currentPage.value = 1
    baseState.itemsPerPage.value = 3
  })

  it('should render loading state', async () => {
    baseState.isLoading.value = true
    const view = await renderWithApp(OurBlog)

    expect(view.getByText(/cargando artículos/i)).toBeInTheDocument()
  })

  it('should render error state and retry button', async () => {
    baseState.error.value = { message: 'Network', type: 'network', timestamp: Date.now() }
    const view = await renderWithApp(OurBlog)

    expect(view.getByText(/error al cargar los artículos/i)).toBeInTheDocument()
    await fireEvent.click(view.getByRole('button', { name: /reintentar/i }))
    expect(mockRetryLoad).toHaveBeenCalled()
  })

  it('should render article cards and interact with actions', async () => {
    baseState.posts.value = [{
      id: 1,
      title: { rendered: 'Post AI' },
      excerpt: { rendered: 'Excerpt' },
      link: 'https://example.com/post',
      date: '2026-01-01T00:00:00.000Z',
      categories: [1]
    }]

    const view = await renderWithApp(OurBlog)

    expect(view.getByText('Post AI')).toBeInTheDocument()
    await fireEvent.click(view.getByRole('button', { name: /agregar a favoritos/i }))
    expect(mockToggleFavorite).toHaveBeenCalledWith(1)

    await fireEvent.click(view.getByRole('button', { name: /compartir artículo/i }))
    expect(mockShareArticle).toHaveBeenCalled()
  })
})
