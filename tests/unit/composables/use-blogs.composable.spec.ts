import useBlogs from '@/composables/use-blogs.composable'

describe('use-blogs.composable', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should fetch posts successfully', async () => {
    const mockResponse = {
      ok: true,
      status: 200,
      statusText: 'OK'
    } as unknown as Response

    ;(globalThis as typeof globalThis & { fetch: jest.Mock }).fetch = jest.fn().mockResolvedValue(mockResponse)

    const { retrievePost } = useBlogs()
    const result = await retrievePost(6)

    expect((globalThis as typeof globalThis & { fetch: jest.Mock }).fetch).toHaveBeenCalledWith(
      'https://techcrunch.com/wp-json/wp/v2/posts?per_page=6&context=embed',
      expect.objectContaining({ method: 'GET', mode: 'cors' })
    )
    expect(result).toBe(mockResponse)
  })

  it('should throw on non-ok response', async () => {
    const mockResponse = {
      ok: false,
      status: 500,
      statusText: 'Server Error'
    } as unknown as Response

    ;(globalThis as typeof globalThis & { fetch: jest.Mock }).fetch = jest.fn().mockResolvedValue(mockResponse)
    const { retrievePost } = useBlogs()

    await expect(retrievePost(6)).rejects.toThrow('HTTP error! status: 500')
  })

  it('should throw on network failure', async () => {
    (globalThis as typeof globalThis & { fetch: jest.Mock }).fetch = jest.fn().mockRejectedValue(new Error('Network down'))
    const { retrievePost } = useBlogs()

    await expect(retrievePost(6)).rejects.toThrow('Network down')
  })
})
