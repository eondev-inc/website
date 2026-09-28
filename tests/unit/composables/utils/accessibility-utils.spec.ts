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

  it('should wrap focus on Shift+Tab from first element', async () => {
    const trapApi: ReturnType<typeof useFocusTrap>[] = []

    const Host = defineComponent({
      setup() {
        trapApi.push(useFocusTrap())
        return () => h('div')
      }
    })

    render(Host)

    const container = document.createElement('div')
    const first = document.createElement('button')
    const second = document.createElement('button')
    container.appendChild(first)
    container.appendChild(second)
    document.body.appendChild(container)

    trapApi[0].activateTrap(container)
    expect(document.activeElement).toBe(first)

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true }))
    expect(document.activeElement).toBe(second)

    trapApi[0].deactivateTrap()
  })

  it('should handle focus trap with no focusable elements', async () => {
    const trapApi: ReturnType<typeof useFocusTrap>[] = []

    const Host = defineComponent({
      setup() {
        trapApi.push(useFocusTrap())
        return () => h('div')
      }
    })

    render(Host)

    const emptyContainer = document.createElement('div')
    document.body.appendChild(emptyContainer)

    expect(() => trapApi[0].activateTrap(emptyContainer)).not.toThrow()
    expect(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }))
    }).not.toThrow()

    trapApi[0].deactivateTrap()
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

  it('should reuse existing announcer element', async () => {
    const existing = document.createElement('div')
    existing.id = 'screen-reader-announcer'
    document.body.appendChild(existing)

    const apis: ReturnType<typeof useScreenReaderAnnounce>[] = []

    const Host = defineComponent({
      setup() {
        apis.push(useScreenReaderAnnounce())
        return () => h('div')
      }
    })

    render(Host)
    await nextTick()

    expect(apis[0]).toBeDefined()
  })

  it('should no-op announce when announcer is not ready', async () => {
    const apis: ReturnType<typeof useScreenReaderAnnounce>[] = []

    const Host = defineComponent({
      setup() {
        apis.push(useScreenReaderAnnounce())
        apis[0].announce('early')
        return () => h('div')
      }
    })

    render(Host)
    await nextTick()

    const announcer = document.getElementById('screen-reader-announcer')
    expect(announcer).not.toBeNull()
    expect(announcer?.textContent).not.toBe('early')
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

  it('should wrap ArrowDown and ArrowRight from last to first', () => {
    const { handleArrowNavigation } = useKeyboardNavigation()
    const first = document.createElement('button')
    const second = document.createElement('button')
    const items = [first, second]
    const indexSpy = jest.fn()

    handleArrowNavigation(new KeyboardEvent('keydown', { key: 'ArrowDown' }), items, 1, indexSpy)
    expect(indexSpy).toHaveBeenCalledWith(0)

    indexSpy.mockClear()
    handleArrowNavigation(new KeyboardEvent('keydown', { key: 'ArrowRight' }), items, 1, indexSpy)
    expect(indexSpy).toHaveBeenCalledWith(0)
  })

  it('should wrap ArrowUp from first to last', () => {
    const { handleArrowNavigation } = useKeyboardNavigation()
    const first = document.createElement('button')
    const second = document.createElement('button')
    const third = document.createElement('button')
    const items = [first, second, third]
    const indexSpy = jest.fn()

    handleArrowNavigation(new KeyboardEvent('keydown', { key: 'ArrowUp' }), items, 0, indexSpy)
    expect(indexSpy).toHaveBeenCalledWith(2)
  })

  it('should move ArrowLeft back one index', () => {
    const { handleArrowNavigation } = useKeyboardNavigation()
    const first = document.createElement('button')
    const second = document.createElement('button')
    const items = [first, second]
    const indexSpy = jest.fn()

    handleArrowNavigation(new KeyboardEvent('keydown', { key: 'ArrowLeft' }), items, 1, indexSpy)
    expect(indexSpy).toHaveBeenCalledWith(0)
  })

  it('should not call onIndexChange for unrecognized keys', () => {
    const { handleArrowNavigation } = useKeyboardNavigation()
    const first = document.createElement('button')
    const items = [first]
    const indexSpy = jest.fn()

    handleArrowNavigation(new KeyboardEvent('keydown', { key: 'a' }), items, 0, indexSpy)
    expect(indexSpy).not.toHaveBeenCalled()

    handleArrowNavigation(new KeyboardEvent('keydown', { key: 'Tab' }), items, 0, indexSpy)
    expect(indexSpy).not.toHaveBeenCalled()
  })

  it('should prevent default for handled keys', () => {
    const { handleArrowNavigation } = useKeyboardNavigation()
    const first = document.createElement('button')
    const items = [first]
    const indexSpy = jest.fn()

    const arrowDownEvent = new KeyboardEvent('keydown', { key: 'ArrowDown', cancelable: true })
    const arrowUpEvent = new KeyboardEvent('keydown', { key: 'ArrowUp', cancelable: true })
    const homeEvent = new KeyboardEvent('keydown', { key: 'Home', cancelable: true })
    const endEvent = new KeyboardEvent('keydown', { key: 'End', cancelable: true })

    handleArrowNavigation(arrowDownEvent, items, 0, indexSpy)
    expect(arrowDownEvent.defaultPrevented).toBe(true)

    handleArrowNavigation(arrowUpEvent, items, 0, indexSpy)
    expect(arrowUpEvent.defaultPrevented).toBe(true)

    handleArrowNavigation(homeEvent, items, 0, indexSpy)
    expect(homeEvent.defaultPrevented).toBe(true)

    handleArrowNavigation(endEvent, items, 0, indexSpy)
    expect(endEvent.defaultPrevented).toBe(true)
  })

  it('should skip to main content', () => {
    const { skipToMain } = useSkipLink()
    const main = document.createElement('main')
    document.body.appendChild(main)

    skipToMain()

    expect(document.activeElement).toBe(main)
    expect(main.getAttribute('tabindex')).toBe('-1')
  })

  it('should prefer id="main-content" over <main>', () => {
    const { skipToMain } = useSkipLink()
    const main = document.createElement('main')
    const mainContent = document.createElement('div')
    mainContent.id = 'main-content'
    document.body.appendChild(main)
    document.body.appendChild(mainContent)

    skipToMain()

    expect(document.activeElement).toBe(mainContent)
    expect(mainContent.getAttribute('tabindex')).toBe('-1')
    expect(main.getAttribute('tabindex')).toBeNull()
  })

  it('should fallback to <main> when no #main-content', () => {
    const { skipToMain } = useSkipLink()
    const main = document.createElement('main')
    document.body.appendChild(main)

    skipToMain()

    expect(document.activeElement).toBe(main)
    expect(main.getAttribute('tabindex')).toBe('-1')
  })

  it('should fallback to [role="main"] when no #main-content or <main>', () => {
    const { skipToMain } = useSkipLink()
    const roleMain = document.createElement('div')
    roleMain.setAttribute('role', 'main')
    document.body.appendChild(roleMain)

    skipToMain()

    expect(document.activeElement).toBe(roleMain)
    expect(roleMain.getAttribute('tabindex')).toBe('-1')
  })

  it('should no-op when no main content exists', () => {
    const { skipToMain } = useSkipLink()
    expect(() => skipToMain()).not.toThrow()
    expect(document.activeElement).toBe(document.body)
  })

  it('should remove tabindex on blur', () => {
    const { skipToMain } = useSkipLink()
    const main = document.createElement('main')
    document.body.appendChild(main)

    skipToMain()
    expect(main.getAttribute('tabindex')).toBe('-1')

    main.blur()
    expect(main.getAttribute('tabindex')).toBeNull()
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
