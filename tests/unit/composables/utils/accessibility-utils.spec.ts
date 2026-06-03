import { defineComponent, h, nextTick } from 'vue'
import { render } from '@testing-library/vue'
import {
  useFocusTrap,
  useScreenReaderAnnounce,
  useKeyboardNavigation,
  useSkipLink,
  usePageTitle
} from '@/composables/utils/accessibility-utils'

describe('accessibility-utils', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should trap and restore focus with useFocusTrap', async () => {
    const trapApi: ReturnType<typeof useFocusTrap>[] = []

    const Host = defineComponent({
      setup() {
        trapApi.push(useFocusTrap())
        return () => h('div')
      }
    })

    render(Host)

    const trigger = document.createElement('button')
    trigger.textContent = 'trigger'
    document.body.appendChild(trigger)
    trigger.focus()

    const container = document.createElement('div')
    const first = document.createElement('button')
    const second = document.createElement('button')
    container.appendChild(first)
    container.appendChild(second)
    document.body.appendChild(container)

    trapApi[0].activateTrap(container)
    expect(document.activeElement).toBe(first)

    second.focus()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }))
    expect(document.activeElement).toBe(first)

    trapApi[0].deactivateTrap()
    expect(document.activeElement).toBe(trigger)
  })

  it('should create announcer and clear text after timeout', async () => {
    const apis: ReturnType<typeof useScreenReaderAnnounce>[] = []

    const Host = defineComponent({
      setup() {
        apis.push(useScreenReaderAnnounce())
        return () => h('div')
      }
    })

    render(Host)
    await nextTick()

    const announcer = document.getElementById('screen-reader-announcer')
    expect(announcer).not.toBeNull()

    apis[0].announce('Hola', 'assertive')
    expect(announcer?.getAttribute('aria-live')).toBe('assertive')
    expect(announcer?.textContent).toBe('Hola')

    jest.advanceTimersByTime(1000)
    expect(announcer?.textContent).toBe('')
  })

  it('should navigate with keyboard arrows and home/end', () => {
    const { handleArrowNavigation } = useKeyboardNavigation()
    const first = document.createElement('button')
    const second = document.createElement('button')
    const third = document.createElement('button')
    const items = [first, second, third]
    const indexSpy = jest.fn()

    handleArrowNavigation(new KeyboardEvent('keydown', { key: 'ArrowRight' }), items, 0, indexSpy)
    expect(indexSpy).toHaveBeenCalledWith(1)

    handleArrowNavigation(new KeyboardEvent('keydown', { key: 'End' }), items, 0, indexSpy)
    expect(indexSpy).toHaveBeenCalledWith(2)

    handleArrowNavigation(new KeyboardEvent('keydown', { key: 'Home' }), items, 2, indexSpy)
    expect(indexSpy).toHaveBeenCalledWith(0)
  })

  it('should skip to main content', () => {
    const { skipToMain } = useSkipLink()
    const main = document.createElement('main')
    document.body.appendChild(main)

    skipToMain()

    expect(document.activeElement).toBe(main)
    expect(main.getAttribute('tabindex')).toBe('-1')
  })

  it('should set accessible page title', () => {
    const announceSpy = jest.spyOn(document, 'getElementById').mockImplementation((id: string) => {
      if (id === 'screen-reader-announcer') {
        const existing = document.createElement('div')
        existing.id = 'screen-reader-announcer'
        return existing
      }
      return null
    })

    const apis: ReturnType<typeof usePageTitle>[] = []
    const Host = defineComponent({
      setup() {
        apis.push(usePageTitle())
        return () => h('div')
      }
    })

    render(Host)
    apis[0].setPageTitle('Blog')

    expect(document.title).toBe('Blog | Portfolio - Yerffrey Romero')
    announceSpy.mockRestore()
  })
})
