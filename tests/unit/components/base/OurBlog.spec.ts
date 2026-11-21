import { ref, computed, nextTick } from 'vue'
import { fireEvent, within } from '@testing-library/vue'
import OurBlog from '@/components/base/OurBlog.vue'
import { renderWithApp } from '../../../helpers'
import type { BlogPost } from '@/interfaces/blog.interface'

const mockLoadPosts = jest.fn().mockResolvedValue(undefined)
const mockRetryLoad = jest.fn().mockResolvedValue(undefined)

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
  totalPagesRef: ref(1),
  categories: ref([{ id: 1, name: 'AI', count: 1, color: '#3b82f6' }]),
  favorites: ref<number[]>([])
}

jest.mock('@/composables/use-blog-enhanced.composable', () => ({
  __esModule: true,
  default: () => ({
    ...baseState,
    filteredPosts: computed(() => baseState.posts.value),
    paginatedPosts: computed(() => baseState.posts.value),
    totalPages: computed(() => baseState.totalPagesRef.value),
    loadPosts: mockLoadPosts,
    retryLoad: mockRetryLoad,
    clearSearch: () => { baseState.searchQuery.value = '' },
    loadCategories: jest.fn(),
    getCategoryName: () => 'AI',
    estimateReadingTime: () => 1,
    formatDate: () => '01/01/2026',
    cleanHtml: (v: string) => v,
    sanitizeHtml: (v: string) => v,
    decodeHtmlEntities: (v: string) => v,
    truncate: (v: string) => v,
    cacheExpiry: ref(1800000)
  })
}))

const makePost = (overrides: Partial<BlogPost> = {}): BlogPost => ({
  id: 1,
  title: { rendered: 'Post AI' },
  excerpt: { rendered: 'Excerpt' },
  link: 'https://techcrunch.com/post',
  date: '2026-01-01T00:00:00.000Z',
  categories: [1],
  ...overrides
})

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
    baseState.totalPagesRef.value = 1
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

  it('should render article cards without favorite/share controls', async () => {
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
    expect(view.getByRole('heading', { name: 'Post AI' })).toBeInTheDocument()
    expect(view.queryByRole('button', { name: /favoritos|compartir/i })).toBeNull()
  })

  it('should render the empty state when there are no posts', async () => {
    const view = await renderWithApp(OurBlog)

    expect(view.getByText('No se encontraron artículos')).toBeInTheDocument()
    expect(view.getByText(/prueba con diferentes palabras clave/i)).toBeInTheDocument()
  })

  it('should disable the retry button while retrying', async () => {
    baseState.error.value = { message: 'Network', type: 'network', timestamp: Date.now() }
    baseState.isRetrying.value = true
    const view = await renderWithApp(OurBlog)

    expect(view.getByRole('button', { name: /reintentando/i })).toBeDisabled()
  })

  it('should render the read-article link with the post URL', async () => {
    baseState.posts.value = [makePost()]
    const view = await renderWithApp(OurBlog)

    const readLink = view.getByRole('link', { name: 'Leer artículo: Post AI' })
    expect(readLink).toHaveAttribute('href', 'https://techcrunch.com/post')
    expect(readLink).toHaveAttribute('target', '_blank')
  })

  it('should update the search query', async () => {
    const view = await renderWithApp(OurBlog)
    const input = view.getByPlaceholderText('Buscar artículos...') as HTMLInputElement

    await fireEvent.input(input, { target: { value: 'ai' } })
    await nextTick()
    expect(input.value).toBe('ai')
  })

  it('should expose an accessible label for the search input', async () => {
    const view = await renderWithApp(OurBlog)
    const input = view.getByPlaceholderText('Buscar artículos...')

    expect(view.getByLabelText('Buscar artículos...')).toBe(input)
    expect(input).toHaveAttribute('id')
  })

  it('should toggle the category filter and clear it', async () => {
    const view = await renderWithApp(OurBlog)

    await fireEvent.click(view.getByRole('button', { name: /filtrar por ai/i }))
    await nextTick()
    expect(baseState.selectedCategory.value).toBe(1)

    await fireEvent.click(view.getByRole('button', { name: 'Limpiar' }))
    await nextTick()
    expect(baseState.selectedCategory.value).toBeNull()
  })

  it('should demote article headings to h2 when the section title is the h1', async () => {
    baseState.posts.value = [makePost()]
    const view = await renderWithApp(OurBlog, { props: { headingTag: 'h1' } })

    expect(view.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(view.getByRole('heading', { level: 2, name: 'Post AI' })).toBeInTheDocument()
  })

  it('should navigate pages with the pagination controls', async () => {
    baseState.totalPagesRef.value = 5
    baseState.posts.value = [makePost()]
    const view = await renderWithApp(OurBlog)
    const pagination = within(view.getByRole('navigation', { name: 'Paginación' }))

    expect(pagination.getAllByRole('button')[0]).toBeDisabled() // prev disabled on page 1

    await fireEvent.click(pagination.getByRole('button', { name: '3' }))
    await nextTick()
    expect(baseState.currentPage.value).toBe(3)
    // El paginado activo usa primary-700: es el único turquesa con 4.5:1 sobre blanco.
    expect(pagination.getByRole('button', { name: '3' }).className).toContain('bg-primary-700')

    await fireEvent.click(pagination.getAllByRole('button')[0]) // prev → 2
    await nextTick()
    expect(baseState.currentPage.value).toBe(2)
  })

  it('should show a trailing ellipsis when the current page is near the start', async () => {
    baseState.totalPagesRef.value = 9
    const view = await renderWithApp(OurBlog)
    const pagination = within(view.getByRole('navigation', { name: 'Paginación' }))

    expect(pagination.getAllByText('...')).toHaveLength(1)
    expect(pagination.getByRole('button', { name: '6' })).toBeInTheDocument()
    expect(pagination.getByRole('button', { name: '9' })).toBeInTheDocument()
    expect(pagination.queryByRole('button', { name: '7' })).toBeNull()
  })

  it('should show middle ellipses when the current page is centered', async () => {
    baseState.totalPagesRef.value = 10
    baseState.currentPage.value = 5
    const view = await renderWithApp(OurBlog)
    const pagination = within(view.getByRole('navigation', { name: 'Paginación' }))

    expect(pagination.getAllByText('...')).toHaveLength(2)
    expect(pagination.getByRole('button', { name: '3' })).toBeInTheDocument()
    expect(pagination.getByRole('button', { name: '7' })).toBeInTheDocument()
    expect(pagination.getByRole('button', { name: '10' })).toBeInTheDocument()
  })

  it('should show a leading ellipsis when the current page is near the end', async () => {
    baseState.totalPagesRef.value = 10
    baseState.currentPage.value = 9
    const view = await renderWithApp(OurBlog)
    const pagination = within(view.getByRole('navigation', { name: 'Paginación' }))

    expect(pagination.getAllByText('...')).toHaveLength(1)
    expect(pagination.getByRole('button', { name: '5' })).toBeInTheDocument()
    expect(pagination.getByRole('button', { name: '10' })).toBeInTheDocument()
    expect(pagination.queryByRole('button', { name: '4' })).toBeNull()
  })
})
