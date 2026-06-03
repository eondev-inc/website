import useBlogs from '@/composables/use-blogs.composable'

describe('use-blogs composable', () => {
  const originalEnv = { ...process.env }
  let mockFetch: jest.SpyInstance | null = null

  beforeEach(() => {
    // Only mock fetch if it's available in globalThis
    if (typeof (globalThis as any).fetch === 'function') {
      mockFetch = jest.spyOn(globalThis as any, 'fetch').mockResolvedValueOnce(
        new Response(JSON.stringify([]), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      )
    }
  })

  afterEach(() => {
    if (mockFetch) {
      mockFetch.mockRestore()
      mockFetch = null
    }
    Object.assign(process.env, originalEnv)
  })

  describe('VITE_API_BLOG_URL', () => {
    it('should use env var with correct query params when VITE_API_BLOG_URL is set', async () => {
      process.env.VITE_API_BLOG_URL = 'https://api.example.com/wp-json/wp/v2/posts'
      const { retrievePost } = useBlogs()
      await retrievePost(5)
      // fetch is called with URL and options object
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/wp-json/wp/v2/posts?per_page=5&context=embed',
        expect.objectContaining({ method: 'GET' })
      )
    })

    it('should fallback to TechCrunch with correct query params when env var is missing', async () => {
      delete process.env.VITE_API_BLOG_URL
      const { retrievePost } = useBlogs()
      await retrievePost(3)
      expect(mockFetch).toHaveBeenCalledWith(
        'https://techcrunch.com/wp-json/wp/v2/posts?per_page=3&context=embed',
        expect.objectContaining({ method: 'GET' })
      )
    })
  })
})
