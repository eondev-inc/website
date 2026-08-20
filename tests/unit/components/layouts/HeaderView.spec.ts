import { fireEvent, within } from '@testing-library/vue'
import { nextTick } from 'vue'
import HeaderView from '@/components/layouts/HeaderView.vue'
import { renderWithApp } from '../../../helpers'

jest.mock('flowbite', () => ({
  initFlowbite: jest.fn()
}))

describe('HeaderView.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true })
  })

  it('should render navigation links', async () => {
    const view = await renderWithApp(HeaderView)

    // El header tiene nav desktop + mobile, puede haber múltiples "Inicio"
    expect(view.getAllByRole('link', { name: /inicio/i }).length).toBeGreaterThanOrEqual(1)
    expect(view.getAllByRole('link', { name: /acerca/i }).length).toBeGreaterThanOrEqual(1)
    expect(view.getAllByRole('link', { name: /noticias/i }).length).toBeGreaterThanOrEqual(1)
    expect(view.getAllByRole('link', { name: /contacto/i }).length).toBeGreaterThanOrEqual(1)
  })

  it('should toggle mobile menu state', async () => {
    const view = await renderWithApp(HeaderView)
    const buttons = view.getAllByRole('button')
    const mobileToggle = buttons[1]

    await fireEvent.click(mobileToggle)
    expect(view.getByText('GitHub')).toBeInTheDocument()
  })

  it('should react to scroll event', async () => {
    const view = await renderWithApp(HeaderView)
    Object.defineProperty(window, 'scrollY', {
      value: 30,
      writable: true
    })

    window.dispatchEvent(new Event('scroll'))
    await nextTick()

    const header = view.container.querySelector('header')
    expect(header?.className).toContain('bg-white/95')
  })

  it('should render the desktop GitHub link', async () => {
    const view = await renderWithApp(HeaderView)

    const github = view.getByRole('link', { name: 'GitHub' })
    expect(github).toHaveAttribute('href', 'https://github.com/eondev-inc')
    expect(github).toHaveAttribute('target', '_blank')
  })

  it('should switch the interface language from the selector', async () => {
    const view = await renderWithApp(HeaderView)

    await fireEvent.click(view.getByRole('button', { name: 'Idioma' }))
    // menuitem accessible name concatenates img alt + span text ("English English")
    await fireEvent.click(view.getByRole('menuitem', { name: /english/i }))

    expect(view.getAllByRole('link', { name: 'Home' }).length).toBeGreaterThanOrEqual(1)
    expect(view.getAllByRole('link', { name: 'News' }).length).toBeGreaterThanOrEqual(1)
  })

  it('should not apply the scrolled style at the top of the page', async () => {
    const view = await renderWithApp(HeaderView)

    window.dispatchEvent(new Event('scroll'))
    await nextTick()

    const header = view.container.querySelector('header')
    expect(header?.className).toContain('bg-white/50')
    expect(header?.className).not.toContain('bg-white/95')
  })

  it('should close the mobile menu after a link is clicked', async () => {
    const view = await renderWithApp(HeaderView)

    await fireEvent.click(view.getAllByRole('button')[1]) // hamburger toggle
    const mobileNav = view.container.querySelector('[class*="overflow-hidden"]') as HTMLElement
    expect(mobileNav.className).toContain('max-h-80')

    await fireEvent.click(within(mobileNav).getByRole('link', { name: /noticias/i }))
    await nextTick()

    // Mobile menu visibility is class-only (no aria-hidden) — same
    // justification as the MobileNav active-state assertions.
    expect(mobileNav.className).toContain('max-h-0')
    expect(within(mobileNav).getByRole('link', { name: /noticias/i }).className).toContain('text-primary-700')
  })

  it('should highlight the clicked desktop nav link', async () => {
    const view = await renderWithApp(HeaderView)

    // Active state is exposed only through the link class binding (no aria-current).
    const aboutLink = view.getAllByRole('link', { name: /acerca/i })[0]
    await fireEvent.click(aboutLink)
    await nextTick()

    expect(view.getAllByRole('link', { name: /acerca/i })[0].className).toContain('text-primary-700')
  })

  it('should highlight the about link when the route already matches', async () => {
    const view = await renderWithApp(HeaderView, { initialRoute: '/about' })

    expect(view.getAllByRole('link', { name: /acerca/i })[0].className).toContain('text-primary-700')
  })

  it('should render English navigation labels', async () => {
    const view = await renderWithApp(HeaderView, { locale: 'en' })

    expect(view.getAllByRole('link', { name: /^home$/i }).length).toBeGreaterThanOrEqual(1)
    expect(view.getAllByRole('link', { name: /^news$/i }).length).toBeGreaterThanOrEqual(1)
    expect(view.getByRole('link', { name: 'View on GitHub' })).toBeInTheDocument()
  })
})
