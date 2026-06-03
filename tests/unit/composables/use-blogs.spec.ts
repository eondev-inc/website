import useBlogs from '@/composables/use-blogs.composable'

describe('use-blogs composable', () => {
  const originalEnv = { ...import.meta.env }
  let mockFetch: jest.SpyInstance

  beforeEach(() => {
    mockFetch = jest.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify([]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    )
  })

  afterEach(() => {
    mockFetch.mockRestore()
    Object.assign(import.meta.env, originalEnv)
  })

  describe('VITE_API_BLOG_URL', () => {
    it('should use env var with correct query params when VITE_API_BLOG_URL is set', async () => {
      import.meta.env.VITE_API_BLOG_URL = 'https://api.example.com/wp-json/wp/v2/posts'
      const { retrievePost } = useBlogs()
      await retrievePost(5)
      expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/wp-json/wp/v2/posts?per_page=5&context=embed')
    })

    it('should fallback to TechCrunch with correct query params when env var is missing', async () => {
      delete import.meta.env.VITE_API_BLOG_URL
      const { retrievePost } = useBlogs()
      await retrievePost(3)
      expect(mockFetch).toHaveBeenCalledWith('https://techcrunch.com/wp-json/wp/v2/posts?per_page=3&context=embed')
    })
  })
})
