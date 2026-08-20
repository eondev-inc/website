import { defineComponent, h } from 'vue'
import { mount, flushPromises } from '@vue/test-utils'
import useBlogEnhanced from '@/composables/use-blog-enhanced.composable'
import type { BlogPost, TechCrunchCategory, UseBlogEnhanced } from '@/interfaces/blog.interface'

type GlobalWithFetch = typeof globalThis & { fetch?: jest.Mock }

const categoryApiResponse: TechCrunchCategory[] = [
  { id: 5, name: 'AI', slug: 'ai', count: 3, description: '' },
  { id: 2, name: 'Startups', slug: 'startups', count: 2, description: '' }
]

const createPost = (id: number, title: string, categories?: number[]): BlogPost => ({
  id,
  title: { rendered: title },
  excerpt: { rendered: `Excerpt ${id}` },
  link: `https://example.com/${id}`,
  date: '2026-01-01T00:00:00.000Z',
  categories
})

const createHost = (): UseBlogEnhanced => {
  // onMounted only fires on mount, so the composable MUST run inside a mounted host
  const wrapper = mount(
    defineComponent({
      setup() {
        const blog = useBlogEnhanced()
        return { blog }
      },
      render() {
        return h('div')
      }
    })
  )
  return (wrapper.vm as { blog: UseBlogEnhanced }).blog
}

const mockFetchWith = (postsPayload: BlogPost[]): jest.Mock => {
  const fetchMock = jest.fn().mockImplementation((url: unknown) => {
    if (String(url).includes('/categories')) {
      return Promise.resolve({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => categoryApiResponse
      })
    }
    return Promise.resolve({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => postsPayload
    })
  })
  ;(globalThis as GlobalWithFetch).fetch = fetchMock
  return fetchMock
}

const drainMicrotasks = async (rounds = 10): Promise<void> => {
  for (let i = 0; i < rounds; i++) {
    await Promise.resolve()
  }
}

describe('use-blog-enhanced.composable', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useRealTimers()
    localStorage.clear()
    delete (globalThis as { fetch?: unknown }).fetch
  })

  afterEach(() => {
    delete (globalThis as { fetch?: unknown }).fetch
    jest.useRealTimers()
  })

  it('loads categories before posts on mount and assigns smart categories', async () => {
    const fetchMock = mockFetchWith([
      createPost(1, 'OpenAI ChatGPT breakthrough in machine learning'),
      createPost(2, 'Startup raises series A funding', [2])
    ])

    const blog = createHost()
    await flushPromises()

    // Categories endpoint must be requested before the posts endpoint
    const callUrls = fetchMock.mock.calls.map((call) => String(call[0]))
    const categoryCall = callUrls.findIndex((url) => url.includes('/categories'))
    const postsCall = callUrls.findIndex((url) => url.includes('/posts'))
    expect(categoryCall).toBeGreaterThanOrEqual(0)
    expect(postsCall).toBeGreaterThan(categoryCall)

    // Both posts loaded
    expect(blog.posts.value).toHaveLength(2)

    // Post without categories received the AI smart category (ChatGPT keyword)
    expect(blog.posts.value[0].categories).toEqual([5])
    // Post with existing categories keeps them
    expect(blog.posts.value[1].categories).toEqual([2])

    // Category counts recalculated from current posts
    const ai = blog.categories.value.find((category) => category.id === 5)
    const startups = blog.categories.value.find((category) => category.id === 2)
    expect(ai?.count).toBe(1)
    expect(startups?.count).toBe(1)

    expect(blog.error.value).toBeNull()
    expect(blog.isLoading.value).toBe(false)
  })

  it('falls back to a generic category when no keyword matches', async () => {
    // Avoid substring traps: 'daily' contains 'ai', 'weekly' contains 'eek'... use clean text
    mockFetchWith([createPost(1, 'Tech headlines from the week')])

    const blog = createHost()
    await flushPromises()

    expect(blog.posts.value).toHaveLength(1)
    // No pattern matched; fallback picks the Startups category
    expect(blog.posts.value[0].categories).toEqual([2])
  })

  it('reloadPosts re-fetches posts and refreshes category counts', async () => {
    mockFetchWith([createPost(1, 'OpenAI ChatGPT breakthrough')])

    const blog = createHost()
    await flushPromises()
    expect(blog.posts.value).toHaveLength(1)
    expect(blog.categories.value.find((category) => category.id === 2)?.count).toBe(0)

    // Force a cache miss so the reload actually re-fetches
    localStorage.clear()
    mockFetchWith([
      createPost(1, 'OpenAI ChatGPT breakthrough'),
      createPost(2, 'Enterprise SaaS funding round', [2])
    ])

    await blog.loadPosts()
    await flushPromises()

    expect(blog.posts.value).toHaveLength(2)
    // Smart-category assignment is onMounted-only: the re-fetched post 1 arrives
    // without categories, so only the explicitly-categorized post 2 counts
    const ai = blog.categories.value.find((category) => category.id === 5)
    const startups = blog.categories.value.find((category) => category.id === 2)
    expect(ai?.count).toBe(0)
    expect(startups?.count).toBe(1)
  })

  it('retryLoad re-fetches posts and refreshes category counts', async () => {
    mockFetchWith([createPost(1, 'OpenAI ChatGPT breakthrough')])

    const blog = createHost()
    await flushPromises()

    localStorage.clear()
    mockFetchWith([
      createPost(1, 'OpenAI ChatGPT breakthrough'),
      createPost(2, 'Blockchain bitcoin crypto mining', [2])
    ])

    await blog.retryLoad()
    await flushPromises()

    expect(blog.isRetrying.value).toBe(false)
    expect(blog.posts.value).toHaveLength(2)
    // Same onMounted-only semantics as reloadPosts: fresh posts carry no categories
    const startups = blog.categories.value.find((category) => category.id === 2)
    expect(startups?.count).toBe(1)
  })

  it('surfaces a timeout error when the posts fetch never resolves', async () => {
    jest.useFakeTimers()
    const fetchMock = jest.fn().mockImplementation((url: unknown) => {
      if (String(url).includes('/categories')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          statusText: 'OK',
          json: async () => categoryApiResponse
        })
      }
      return new Promise(() => undefined) // never settles; the 10s race rejects
    })
    ;(globalThis as GlobalWithFetch).fetch = fetchMock

    const blog = createHost()
    await drainMicrotasks() // categories resolve, onMounted reaches the posts race

    jest.advanceTimersByTime(10001) // 10s race timeout fires
    await drainMicrotasks()

    expect(blog.error.value?.type).toBe('timeout')
    expect(blog.error.value?.message).toBe('Timeout')
    expect(blog.isLoading.value).toBe(false)
    expect(blog.posts.value).toHaveLength(0)
  })

  it('exposes the full public API with a 30-minute cacheExpiry', async () => {
    mockFetchWith([createPost(1, 'OpenAI ChatGPT breakthrough')])

    const blog = createHost()
    await flushPromises()

    expect(blog.cacheExpiry.value).toBe(1_800_000)

    const refs: (keyof UseBlogEnhanced)[] = [
      'posts',
      'isLoading',
      'isRetrying',
      'error',
      'lastUpdate',
      'searchQuery',
      'selectedCategory',
      'viewMode',
      'currentPage',
      'itemsPerPage',
      'totalPages',
      'filteredPosts',
      'paginatedPosts',
      'categories',
      'favorites'
    ]
    refs.forEach((name) => expect(blog[name]).toBeDefined())

    const methods: (keyof UseBlogEnhanced)[] = [
      'loadPosts',
      'loadCategories',
      'retryLoad',
      'toggleFavorite',
      'shareArticle',
      'clearSearch',
      'getCategoryName',
      'estimateReadingTime',
      'formatDate',
      'cleanHtml',
      'decodeHtmlEntities',
      'truncate'
    ]
    methods.forEach((name) => expect(typeof blog[name]).toBe('function'))

    // Computed behavior over the real mounted data
    expect(blog.filteredPosts.value).toHaveLength(1)
    expect(blog.totalPages.value).toBe(1)
    expect(blog.paginatedPosts.value).toHaveLength(1)
  })
})
