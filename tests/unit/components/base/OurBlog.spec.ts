import { ref, computed, nextTick } from 'vue'
import { fireEvent, within } from '@testing-library/vue'
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

const makePost = (overrides: Partial<BlogPost> = {}): BlogPost => ({
  id: 1,
  title: { rendered: 'Post AI' },
  excerpt: { rendered: 'Excerpt' },
  link: 'https://example.com/post',
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

  it('should switch the favorite label when the post is already favorited', async () => {
    baseState.favorites.value = [1]
    baseState.posts.value = [makePost()]
    const view = await renderWithApp(OurBlog)

    expect(view.getByRole('button', { name: 'Quitar de favoritos' })).toBeInTheDocument()
  })

  it('should render the read-article link with the post URL', async () => {
    baseState.posts.value = [makePost()]
    const view = await renderWithApp(OurBlog)

    const readLink = view.getByRole('link', { name: 'Leer artículo: Post AI' })
    expect(readLink).toHaveAttribute('href', 'https://example.com/post')
    expect(readLink).toHaveAttribute('target', '_blank')
  })

  it('should show the cache badge for cached posts', async () => {
    baseState.posts.value = [makePost({ _cached: true })]
    const view = await renderWithApp(OurBlog)

    expect(view.getByTitle('Cargado desde caché')).toBeInTheDocument()
    expect(view.getByText('Rápido')).toBeInTheDocument()
  })

  it('should show an overflow count when a post has more than three categories', async () => {
    baseState.posts.value = [makePost({ categories: [1, 2, 3, 4, 5] })]
    const view = await renderWithApp(OurBlog)

    expect(view.getByText('+2')).toBeInTheDocument()
  })

  it('should update the search query and clear it via the clear button', async () => {
    const view = await renderWithApp(OurBlog)
    const input = view.getByPlaceholderText('Buscar artículos...') as HTMLInputElement

    await fireEvent.input(input, { target: { value: 'ai' } })
    await nextTick()
    expect(input.value).toBe('ai')

    const clearButton = within(input.closest('div') as HTMLElement).getByRole('button')
    await fireEvent.click(clearButton)
    await nextTick()
    expect(input.value).toBe('')
  })

  it('should change the items per page from the selector', async () => {
    const view = await renderWithApp(OurBlog)
    const select = view.getByRole('combobox') as HTMLSelectElement

    await fireEvent.change(select, { target: { value: '6' } })
    await nextTick()
    expect(select.value).toBe('6')
  })

  it('should apply the articlesNumber prop to items per page', async () => {
    const view = await renderWithApp(OurBlog, { props: { articlesNumber: 9 } })

    expect((view.getByRole('combobox') as HTMLSelectElement).value).toBe('9')
  })

  it('should toggle between grid and list view modes', async () => {
    baseState.posts.value = [makePost()]
    const view = await renderWithApp(OurBlog)

    // viewMode has no semantic observable (no aria-*); the layout container
    // class is its only contract — same justification as MobileNav active state.
    const viewControls = within(view.container.querySelector('.flex.bg-neutral-100') as HTMLElement)
    const toggleButtons = viewControls.getAllByRole('button')

    await fireEvent.click(toggleButtons[1]) // list
    await nextTick()
    expect(baseState.viewMode.value).toBe('list')
    expect(view.container.querySelector('[class*="md:flex-row"]')).toBeTruthy()

    await fireEvent.click(toggleButtons[0]) // grid
    await nextTick()
    expect(baseState.viewMode.value).toBe('grid')
    expect(view.container.querySelector('[class*="lg:grid-cols-3"]')).toBeTruthy()
  })

  it('should toggle the category filter and clear it', async () => {
    const view = await renderWithApp(OurBlog)
    const categorySection = view.container.querySelector('.gap-3.mt-12') as HTMLElement

    await fireEvent.click(within(categorySection).getByRole('button', { name: /filtrar por ai/i }))
    await nextTick()
    expect(baseState.selectedCategory.value).toBe(1)

    // Clear button (its aria-label resolves to the missing blog.clearFilters key)
    await fireEvent.click(within(categorySection).getAllByRole('button')[1])
    await nextTick()
    expect(baseState.selectedCategory.value).toBeNull()
  })

  it('should navigate pages with the pagination controls', async () => {
    baseState.totalPagesRef.value = 5
    baseState.posts.value = [makePost()]
    const view = await renderWithApp(OurBlog)
    const pagination = within(view.container.querySelector('.mt-12.space-x-2') as HTMLElement)

    expect(pagination.getAllByRole('button')[0]).toBeDisabled() // prev disabled on page 1

    await fireEvent.click(pagination.getByRole('button', { name: '3' }))
    await nextTick()
    expect(baseState.currentPage.value).toBe(3)
    expect(pagination.getByRole('button', { name: '3' }).className).toContain('bg-primary-600')

    await fireEvent.click(pagination.getAllByRole('button')[0]) // prev → 2
    await nextTick()
    expect(baseState.currentPage.value).toBe(2)
  })

  it('should show a trailing ellipsis when the current page is near the start', async () => {
    baseState.totalPagesRef.value = 9
    const view = await renderWithApp(OurBlog)
    const pagination = within(view.container.querySelector('.mt-12.space-x-2') as HTMLElement)

    expect(pagination.getAllByText('...')).toHaveLength(1)
    expect(pagination.getByRole('button', { name: '6' })).toBeInTheDocument()
    expect(pagination.getByRole('button', { name: '9' })).toBeInTheDocument()
    expect(pagination.queryByRole('button', { name: '7' })).toBeNull()
  })

  it('should show middle ellipses when the current page is centered', async () => {
    baseState.totalPagesRef.value = 10
    baseState.currentPage.value = 5
    const view = await renderWithApp(OurBlog)
    const pagination = within(view.container.querySelector('.mt-12.space-x-2') as HTMLElement)

    expect(pagination.getAllByText('...')).toHaveLength(2)
    expect(pagination.getByRole('button', { name: '3' })).toBeInTheDocument()
    expect(pagination.getByRole('button', { name: '7' })).toBeInTheDocument()
    expect(pagination.getByRole('button', { name: '10' })).toBeInTheDocument()
  })

  it('should show a leading ellipsis when the current page is near the end', async () => {
    baseState.totalPagesRef.value = 10
    baseState.currentPage.value = 9
    const view = await renderWithApp(OurBlog)
    const pagination = within(view.container.querySelector('.mt-12.space-x-2') as HTMLElement)

    expect(pagination.getAllByText('...')).toHaveLength(1)
    expect(pagination.getByRole('button', { name: '5' })).toBeInTheDocument()
    expect(pagination.getByRole('button', { name: '10' })).toBeInTheDocument()
    expect(pagination.queryByRole('button', { name: '4' })).toBeNull()
  })
})
