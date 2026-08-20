import { ref, defineComponent, h, nextTick } from 'vue'
import { render } from '@testing-library/vue'
import useBlogFilters from '@/composables/blog/use-blog-filters.composable'
import type { BlogPost } from '@/interfaces/blog.interface'

const createPost = (id: number, title: string, excerpt: string, categories: number[]): BlogPost => ({
  id,
  title: { rendered: title },
  excerpt: { rendered: excerpt },
  link: `https://example.com/${id}`,
  date: '2026-01-01T00:00:00.000Z',
  categories
})

describe('use-blog-filters.composable', () => {
  it('should filter by search query and category', async () => {
    const posts = ref([
      createPost(1, 'AI News', 'Artificial intelligence trends', [10]),
      createPost(2, 'Crypto Story', 'Distributed ledger update', [20]),
      createPost(3, 'Vue Tips', 'Frontend patterns', [10])
    ])

    const apis: ReturnType<typeof useBlogFilters>[] = []
    const Host = defineComponent({
      setup() {
        apis.push(useBlogFilters(posts))
        return () => h('div')
      }
    })

    render(Host)

    apis[0].searchQuery.value = 'ai'
    await nextTick()
    expect(apis[0].filteredPosts.value.map(p => p.id)).toEqual([1])

    apis[0].searchQuery.value = ''
    apis[0].selectCategory(10)
    await nextTick()
    expect(apis[0].filteredPosts.value.map(p => p.id)).toEqual([1, 3])
  })

  it('should paginate and validate goToPage bounds', async () => {
    const posts = ref(Array.from({ length: 14 }, (_, i) => createPost(i + 1, `T${i}`, `E${i}`, [1])))
    const apis: ReturnType<typeof useBlogFilters>[] = []

    const Host = defineComponent({
      setup() {
        apis.push(useBlogFilters(posts))
        return () => h('div')
      }
    })

    render(Host)

    expect(apis[0].totalPages.value).toBe(3)
    expect(apis[0].paginatedPosts.value).toHaveLength(6)

    apis[0].goToPage(2)
    await nextTick()
    expect(apis[0].currentPage.value).toBe(2)
    expect(apis[0].paginatedPosts.value[0].id).toBe(7)

    apis[0].goToPage(0)
    await nextTick()
    expect(apis[0].currentPage.value).toBe(2)
  })

  it('should reset currentPage when filters change', async () => {
    const posts = ref(Array.from({ length: 8 }, (_, i) => createPost(i + 1, `T${i}`, `E${i}`, [1])))
    const apis: ReturnType<typeof useBlogFilters>[] = []

    const Host = defineComponent({
      setup() {
        apis.push(useBlogFilters(posts))
        return () => h('div')
      }
    })

    render(Host)

    apis[0].goToPage(2)
    await nextTick()
    expect(apis[0].currentPage.value).toBe(2)

    apis[0].searchQuery.value = 'abc'
    await nextTick()
    expect(apis[0].currentPage.value).toBe(1)
  })
})
