import { createRouter, createWebHistory } from 'vue-router'
import DOMPurify from 'dompurify'

describe('router meta sanitization', () => {
  let router: ReturnType<typeof createRouter>

  beforeEach(() => {
    // Create fresh router for each test
    router = createRouter({
      history: createWebHistory('/'),
      routes: [
        {
          path: '/',
          name: 'home',
          component: { template: '<div>Home</div>' },
          meta: {
            title: 'Home',
            description: 'Home page'
          }
        }
      ]
    })
  })

  afterEach(() => {
    if (router) {
      router.beforeEach((to, _from, next) => {
        // Actual router sanitization logic
        if (to.meta && to.meta.title) {
          document.title = to.meta.title as string
        } else {
          document.title = 'Default'
        }

        if (to.meta && to.meta.description) {
          let metaDescription = document.querySelector('meta[name="description"]')
          if (!metaDescription) {
            metaDescription = document.createElement('meta')
            metaDescription.setAttribute('name', 'description')
            document.head.appendChild(metaDescription)
          }
          // Strip ALL HTML for meta description (not allowed in content attribute)
          metaDescription.setAttribute(
            'content',
            DOMPurify.sanitize(to.meta.description as string, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })
          )
        }
        next()
      })
    }
  })

  describe('router beforeEach guard', () => {
    it('should sanitize script tags from meta description', async () => {
      router.addRoute({
        path: '/malicious',
        name: 'malicious',
        component: { template: '<div>Malicious</div>' },
        meta: {
          title: 'Malicious',
          description: '<script>alert(1)</script>'
        }
      })

      await router.push('/malicious')
      await router.isReady()

      const metaContent = document.querySelector('meta[name="description"]')?.getAttribute('content')
      expect(metaContent).not.toContain('<script>')
      expect(metaContent).not.toContain('alert(1)')
    })

    it('should sanitize event handlers from meta description', async () => {
      router.addRoute({
        path: '/xss',
        name: 'xss',
        component: { template: '<div>XSS</div>' },
        meta: {
          title: 'XSS',
          description: '<img src=x onerror=alert(1)>'
        }
      })

      await router.push('/xss')
      await router.isReady()

      const metaContent = document.querySelector('meta[name="description"]')?.getAttribute('content')
      expect(metaContent).not.toContain('onerror')
    })

    it('should strip all HTML tags from meta description', async () => {
      router.addRoute({
        path: '/html',
        name: 'html',
        component: { template: '<div>HTML</div>' },
        meta: {
          title: 'HTML',
          description: '<p>Hello</p><script>evil()</script><img src=x onload=bad()>'
        }
      })

      await router.push('/html')
      await router.isReady()

      const metaContent = document.querySelector('meta[name="description"]')?.getAttribute('content')
      expect(metaContent).not.toContain('<p>')
      expect(metaContent).not.toContain('<script>')
      expect(metaContent).not.toContain('<img>')
      // Should preserve text content
      expect(metaContent).toContain('Hello')
    })

    it('should handle plain text without HTML', async () => {
      router.addRoute({
        path: '/plain',
        name: 'plain',
        component: { template: '<div>Plain</div>' },
        meta: {
          title: 'Plain',
          description: 'Simple description without HTML'
        }
      })

      await router.push('/plain')
      await router.isReady()

      const metaContent = document.querySelector('meta[name="description"]')?.getAttribute('content')
      expect(metaContent).toBe('Simple description without HTML')
    })

    it('should handle empty description gracefully', async () => {
      router.addRoute({
        path: '/empty',
        name: 'empty',
        component: { template: '<div>Empty</div>' },
        meta: {
          title: 'Empty',
          description: ''
        }
      })

      await router.push('/empty')
      await router.isReady()

      const metaContent = document.querySelector('meta[name="description"]')?.getAttribute('content')
      expect(metaContent).toBe('')
    })
  })
})
