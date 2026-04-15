import { fireEvent } from '@testing-library/vue'
import { nextTick } from 'vue'
import HeaderView from '@/components/layouts/HeaderView.vue'
import { renderWithApp } from '../../../helpers'

jest.mock('flowbite', () => ({
  initFlowbite: jest.fn()
}))

describe('HeaderView.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
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
})
