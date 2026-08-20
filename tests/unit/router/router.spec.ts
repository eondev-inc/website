import router from '@/router'

describe('router/index.ts', () => {
  beforeEach(async () => {
    document.title = ''
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.remove()
    await router.push('/')
    await router.isReady()
  })

  it('should resolve main application routes', () => {
    expect(router.resolve('/').name).toBe('home')
    expect(router.resolve('/about').name).toBe('about')
    expect(router.resolve('/blog').name).toBe('blog')
    expect(router.resolve('/contact').name).toBe('contact')
  })

  it('should resolve unknown paths to NotFound route', () => {
    expect(router.resolve('/this-path-does-not-exist').name).toBe('NotFound')
  })

  it('should set document title and meta description via beforeEach guard', async () => {
    await router.push('/about')

    expect(document.title).toBe('Acerca de Mí - Mi Portfolio')
    const description = document.querySelector('meta[name="description"]')
    expect(description?.getAttribute('content')).toBe(
      'Conoce más sobre mi experiencia profesional, habilidades técnicas y trayectoria como desarrollador.'
    )
  })

  it('should expose expected scroll behavior strategies', () => {
    const scrollBehavior = (router.options as any).scrollBehavior
    const saved = { left: 0, top: 120 }

    expect(scrollBehavior({ hash: '' }, {}, saved)).toEqual(saved)
    expect(scrollBehavior({ hash: '#target' }, {}, null)).toEqual({ el: '#target', behavior: 'smooth' })
    expect(scrollBehavior({ hash: '' }, {}, null)).toEqual({ top: 0, behavior: 'smooth' })
  })
})
