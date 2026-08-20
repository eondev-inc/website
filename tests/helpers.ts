import { render, type RenderOptions } from '@testing-library/vue'
import { createI18n } from 'vue-i18n'
import { createMemoryHistory, createRouter, type RouteRecordRaw } from 'vue-router'
import messages from '@/locales/messages'
import type { DefineComponent } from 'vue'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyComponent = DefineComponent<any, any, any>
type BaseRenderOptions = RenderOptions<AnyComponent>

type RenderWithAppOptions = Omit<BaseRenderOptions, 'global'> & {
  locale?: 'es' | 'en'
  routes?: RouteRecordRaw[]
  initialRoute?: string
  global?: BaseRenderOptions['global']
}

export const createTestI18n = (locale: 'es' | 'en' = 'es') => {
  return createI18n({
    legacy: false,
    locale,
    fallbackLocale: 'en',
    messages
  })
}

export const createTestRouter = (routes: RouteRecordRaw[] = []) => {
  const defaultRoutes: RouteRecordRaw[] = [
    { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
    { path: '/about', name: 'about', component: { template: '<div>About</div>' } },
    { path: '/blog', name: 'blog', component: { template: '<div>Blog</div>' } },
    { path: '/contact', name: 'contact', component: { template: '<div>Contact</div>' } }
  ]

  return createRouter({
    history: createMemoryHistory(),
    routes: routes.length > 0 ? routes : defaultRoutes
  })
}

export const renderWithApp = async (
  component: Parameters<typeof render>[0],
  {
    locale = 'es',
    routes = [],
    initialRoute = '/',
    global,
    ...rest
  }: RenderWithAppOptions = {}
) => {
  const i18n = createTestI18n(locale)
  const router = createTestRouter(routes)
  await router.push(initialRoute)
  await router.isReady()

  return {
    router,
    i18n,
    ...render(component, {
      global: {
        plugins: [router, i18n],
        stubs: {
          'font-awesome-icon': {
            template: '<span data-testid="fa-icon" />'
          },
          transition: false,
          ...global?.stubs
        },
        ...global
      },
      ...rest
    })
  }
}

export const flushPromises = async () => {
  await Promise.resolve()
  await Promise.resolve()
}
