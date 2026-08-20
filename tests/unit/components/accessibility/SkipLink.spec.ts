import { mount, type VueWrapper } from '@vue/test-utils'
import SkipLink from '@/components/accessibility/SkipLink.vue'
import { createTestI18n } from '../../../helpers'

describe('SkipLink.vue', () => {
  const mountSkipLink = (locale: 'es' | 'en' = 'es') =>
    mount(SkipLink, {
      global: {
        plugins: [createTestI18n(locale)]
      }
    })

  afterEach(() => {
    document.getElementById('main-content')?.remove()
  })

  it('renders an anchor pointing to #main-content with the localized label', () => {
    const wrapper: VueWrapper<any> = mountSkipLink('es')

    const anchor = wrapper.find('a')
    expect(anchor.attributes('href')).toBe('#main-content')
    expect(anchor.text()).toBe('Saltar al contenido principal')
  })

  it('renders the English label when locale is en', () => {
    const wrapper: VueWrapper<any> = mountSkipLink('en')

    expect(wrapper.find('a').text()).toBe('Skip to main content')
  })

  it('prevents default navigation on click and focuses the main content', () => {
    const main = document.createElement('main')
    main.id = 'main-content'
    document.body.appendChild(main)
    const focusSpy = jest.spyOn(main, 'focus')

    const wrapper: VueWrapper<any> = mountSkipLink()
    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true })

    const dispatched = wrapper.find('a').element.dispatchEvent(clickEvent)

    expect(dispatched).toBe(false)
    expect(clickEvent.defaultPrevented).toBe(true)
    expect(focusSpy).toHaveBeenCalledTimes(1)
    expect(main.getAttribute('tabindex')).toBe('-1')
  })

  it('does not throw when no main content exists on the page', () => {
    const wrapper: VueWrapper<any> = mountSkipLink()

    expect(() => wrapper.find('a').trigger('click')).not.toThrow()
  })
})
