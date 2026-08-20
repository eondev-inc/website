import { defineComponent, h } from 'vue'
import { render } from '@testing-library/vue'
import useBlogFeatures from '@/composables/blog/use-blog-features.composable'
import type { BlogPost } from '@/interfaces/blog.interface'

const samplePost: BlogPost = {
  id: 1,
  title: { rendered: 'Post title' },
  excerpt: { rendered: 'Post excerpt' },
  link: 'https://example.com/post',
  date: '2026-01-01T00:00:00.000Z',
  categories: [1]
}

describe('use-blog-features.composable', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  it('should toggle favorites and persist them', () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem')
    const api = useBlogFeatures()

    api.toggleFavorite(1)
    expect(api.favorites.value).toEqual([1])
    expect(setItemSpy).toHaveBeenCalledWith('blog-favorites', JSON.stringify([1]))

    api.toggleFavorite(1)
    expect(api.favorites.value).toEqual([])
    setItemSpy.mockRestore()
  })

  it('should evaluate favorites correctly', () => {
    const api = useBlogFeatures()
    api.toggleFavorite(1)

    expect(api.isFavorite(1)).toBe(true)
    expect(api.isFavorite(2)).toBe(false)
  })

  it('should return favorite posts from list', () => {
    const api = useBlogFeatures()
    api.toggleFavorite(1)

    const result = api.getFavoritePosts([
      samplePost,
      { ...samplePost, id: 2, link: 'https://example.com/post-2' }
    ])

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe(1)
  })

  it('should use navigator.share when available', async () => {
    const share = jest.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'share', { value: share, configurable: true })
    Object.defineProperty(navigator, 'canShare', { value: () => true, configurable: true })

    const api = useBlogFeatures()
    await api.shareArticle(samplePost)

    expect(share).toHaveBeenCalled()
  })

  it('should fallback to clipboard when share api is unavailable', async () => {
    const writeText = jest.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'share', { value: undefined, configurable: true })
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })

    const api = useBlogFeatures()
    await api.shareArticle(samplePost)

    expect(writeText).toHaveBeenCalledWith(samplePost.link)
  })

  it('should load favorites from localStorage on mounted', () => {
    localStorage.setItem('blog-favorites', JSON.stringify([1, 3]))
    const apis: ReturnType<typeof useBlogFeatures>[] = []
    const Host = defineComponent({
      setup() {
        apis.push(useBlogFeatures())
        return () => h('div')
      }
    })

    render(Host)

    expect(apis[0].favorites.value).toEqual([1, 3])
  })
})
