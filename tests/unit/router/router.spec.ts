import router from '@/router'

// scrollBehavior returns `behavior: 'smooth'`, so every push schedules a scroll.
// jsdom does not implement window.scrollTo and logs a "Not implemented" error for
// each one. Installed for the whole file rather than per-test: vue-router runs
// those callbacks after the navigation promise settles, so a stub torn down in
// afterEach lets the tail of the queue escape and spam the console.
beforeAll(() => {
  jest.spyOn(window, 'scrollTo').mockImplementation(() => undefined)
})

afterAll(() => {
  jest.restoreAllMocks()
})

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

  // Exercises the real lazy `component: () => import(...)` loaders declared in
  // src/router/index.ts. `router.resolve()` never invokes them, so without this
  // block every route loader sits at 0% and drags module function coverage down.
  // Pushing a route makes vue-router resolve its lazy
  // `component: () => import(...)` loader, so navigating is what exercises
  // them. `router.resolve()` never invokes them, which is why they sat at 0%.
  it('should navigate and resolve the lazy component for every route', async () => {
    const cases: Array<[string, string]> = [
      ['/', 'home'],
      ['/about', 'about'],
      ['/blog', 'blog'],
      ['/contact', 'contact'],
      ['/this-path-does-not-exist', 'NotFound']
    ]

    for (const [path, name] of cases) {
      await router.push(path)
      expect(router.currentRoute.value.name).toBe(name)
      // A resolved lazy component is no longer a loader function.
      expect(router.currentRoute.value.matched[0]?.components?.default).toBeDefined()
    }
  })

  it('should lazy-load every declared route, including the 404 catch-all last', () => {
    const paths = router.getRoutes().map((r) => r.path)
    expect(paths).toEqual(
      expect.arrayContaining(['/', '/about', '/blog', '/contact', '/:pathMatch(.*)*'])
    )
    // The catch-all must stay last or it shadows every real route.
    expect(paths[paths.length - 1]).toBe('/:pathMatch(.*)*')
  })
})

// Guards the REAL production guard in src/router/index.ts, not a mirror of it.
// A copied guard in the spec stays green when the original is weakened, which is
// how an XSS sink can silently come back.
describe('production route guard sanitization', () => {
  const navigateWithDescription = async (name: string, description: string) => {
    router.addRoute({
      path: `/${name}`,
      name,
      component: { template: '<div/>' },
      meta: { title: name, description }
    })
    await router.push(`/${name}`)
    await router.isReady()
    const content = document
      .querySelector('meta[name="description"]')
      ?.getAttribute('content')
    router.removeRoute(name)
    return content
  }

  beforeEach(() => {
    document.head.querySelector('meta[name="description"]')?.remove()
  })

  it('strips script tags from the meta description', async () => {
    const content = await navigateWithDescription('guarded-script', '<script>alert(1)</script>')
    expect(content).not.toContain('<script>')
    expect(content).not.toContain('alert(1)')
  })

  it('strips event handlers from the meta description', async () => {
    const content = await navigateWithDescription('guarded-handler', '<img src=x onerror=alert(1)>')
    expect(content).not.toContain('onerror')
  })

  it('keeps plain text intact', async () => {
    const content = await navigateWithDescription('guarded-plain', 'Simple description without HTML')
    expect(content).toBe('Simple description without HTML')
  })
})
