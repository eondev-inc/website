import useBlogs from '@/composables/use-blogs.composable'

describe('use-blogs composable', () => {
  const originalEnv = { ...import.meta.env }

  afterEach(() => {
    Object.assign(import.meta.env, originalEnv)
  })

  describe('VITE_API_BLOG_URL', () => {
    it('should use env var when VITE_API_BLOG_URL is set', async () => {
      import.meta.env.VITE_API_BLOG_URL = 'https://api.example.com/posts'
      const { retrievePost } = useBlogs()
      const post = await retrievePost(5)
      expect(post.ok).toBe(true)
    })

    it('should fallback to localhost when env var is missing', async () => {
      delete import.meta.env.VITE_API_BLOG_URL
      const { retrievePost } = useBlogs()
      const post = await retrievePost(5)
      expect(post.ok).toBe(true)
    })
  })
})
