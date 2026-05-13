import useBlogCore from '@/composables/blog/use-blog-core.composable'
import type { BlogPost } from '@/interfaces/blog.interface'

const mockRetrievePost = jest.fn()
const mockGetCacheData = jest.fn()
const mockSetCacheData = jest.fn()

jest.mock('@/composables/use-blogs.composable', () => {
  return {
    __esModule: true,
    default: () => ({ retrievePost: mockRetrievePost })
  }
})

jest.mock('@/composables/utils/cache-utils', () => {
  return {
    __esModule: true,
    getCacheData: (...args: unknown[]) => mockGetCacheData(...args),
    setCacheData: (...args: unknown[]) => mockSetCacheData(...args)
  }
})

const createPost = (id: number): BlogPost => ({
  id,
  title: { rendered: `Post ${id}` },
  excerpt: { rendered: `Excerpt ${id}` },
  link: `https://example.com/${id}`,
  date: '2026-01-01T00:00:00.000Z',
  categories: [1]
})

describe('use-blog-core.composable', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useRealTimers()
  })

  it('should use cached posts when available', async () => {
    const cached = [createPost(1)]
    mockGetCacheData.mockReturnValue(cached)

    const blog = useBlogCore()
    await blog.loadPosts(6)

    expect(blog.posts.value).toEqual(cached)
    expect(mockRetrievePost).not.toHaveBeenCalled()
    expect(blog.error.value).toBeNull()
  })

  it('should fetch and enrich posts when cache is empty', async () => {
    mockGetCacheData.mockReturnValue(null)
    const json = jest.fn().mockResolvedValue([createPost(1), createPost(2)])
    mockRetrievePost.mockResolvedValue({ ok: true, json, status: 200, statusText: 'OK' })

    const blog = useBlogCore()
    await blog.loadPosts(6)

    expect(mockRetrievePost).toHaveBeenCalledWith(12)
    expect(blog.posts.value).toHaveLength(2)
    expect(blog.posts.value[0]).toMatchObject({ id: 1, _cached: true })
    expect(mockSetCacheData).toHaveBeenCalledWith('posts-6', expect.any(Array))
    expect(blog.error.value).toBeNull()
  })

  it('should set timeout error when fetch times out', async () => {
    mockGetCacheData.mockReturnValue(null)
    mockRetrievePost.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ ok: true, json: async () => [] }), 20000))
    )

    jest.useFakeTimers()
    const blog = useBlogCore()

    const promise = blog.loadPosts(6)
    jest.advanceTimersByTime(10001)
    await promise

    expect(blog.error.value?.type).toBe('timeout')
    expect(blog.error.value?.message).toBe('Timeout')
    expect(blog.isLoading.value).toBe(false)
  })

  it('should classify errors as network for non-timeout errors', async () => {
    mockGetCacheData.mockReturnValue(null)
    mockRetrievePost.mockRejectedValue(new Error('API unreachable'))

    const blog = useBlogCore()
    await blog.loadPosts(6)

    expect(blog.error.value).toMatchObject({
      type: 'network',
      message: 'API unreachable'
    })
    expect(blog.isLoading.value).toBe(false)
  })

  it('retryLoad should toggle retrying state and call load', async () => {
    mockGetCacheData.mockReturnValue(null)
    const json = jest.fn().mockResolvedValue([])
    mockRetrievePost.mockResolvedValue({ ok: true, json, status: 200, statusText: 'OK' })

    const blog = useBlogCore()

    await blog.retryLoad(6)

    expect(blog.isRetrying.value).toBe(false)
    expect(mockGetCacheData).toHaveBeenCalledWith('posts-6', 30 * 60 * 1000)
  })
})
