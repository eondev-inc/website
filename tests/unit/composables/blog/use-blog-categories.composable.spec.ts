import useBlogCategories from '@/composables/blog/use-blog-categories.composable'
import type { BlogPost, TechCrunchCategory } from '@/interfaces/blog.interface'

type GlobalWithFetch = typeof globalThis & { fetch: jest.Mock }

const categoryApiResponse: TechCrunchCategory[] = [
  { id: 1, name: 'AI', slug: 'ai', count: 12, description: '' },
  { id: 2, name: 'Startups', slug: 'startups', count: 8, description: '' },
  { id: 3, name: 'Apps', slug: 'apps', count: 2, description: '' }
]

const post = (title: string, excerpt = '', categories: number[] = []): BlogPost => ({
  id: 1,
  title: { rendered: title },
  excerpt: { rendered: excerpt },
  link: 'https://example.com/post',
  date: '2026-01-01T00:00:00.000Z',
  categories
})

describe('use-blog-categories.composable', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should load and transform categories from API', async () => {
    (globalThis as GlobalWithFetch).fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => categoryApiResponse
    })

    const composable = useBlogCategories()
    await composable.loadCategories()

    expect(composable.categories.value).toHaveLength(3)
    expect(composable.categories.value[0]).toMatchObject({ id: 1, name: 'AI', count: 12 })
  })

  it('should fallback to defaults when API fails', async () => {
    (globalThis as GlobalWithFetch).fetch = jest.fn().mockResolvedValue({ ok: false, status: 500 })

    const composable = useBlogCategories()
    await composable.loadCategories()

    expect(composable.categories.value).toHaveLength(3)
    expect(composable.categories.value.map(c => c.name)).toContain('Tecnología')
  })

  it('should resolve category name and default unknown names', async () => {
    (globalThis as GlobalWithFetch).fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => categoryApiResponse
    })

    const composable = useBlogCategories()
    await composable.loadCategories()

    expect(composable.getCategoryName(2)).toBe('Startups')
    expect(composable.getCategoryName(999)).toBe('Sin categoría')
  })

  it('should generate smart categories from content keywords', async () => {
    (globalThis as GlobalWithFetch).fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => categoryApiResponse
    })

    const composable = useBlogCategories()
    await composable.loadCategories()

    const smart = composable.generateSmartCategories(post('New AI startup gets funding', 'machine learning and venture capital'))
    expect(smart.length).toBeGreaterThanOrEqual(1)
  })

  it('should update category counts based on loaded posts', async () => {
    (globalThis as GlobalWithFetch).fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => categoryApiResponse
    })

    const composable = useBlogCategories()
    await composable.loadCategories()

    composable.updateCategoryCounts([
      post('A', 'x', [1, 2]),
      post('B', 'x', [2]),
      post('C', 'x', [1])
    ])

    const ai = composable.categories.value.find(c => c.id === 1)
    const startups = composable.categories.value.find(c => c.id === 2)
    expect(ai?.count).toBe(2)
    expect(startups?.count).toBe(2)
  })
})
