import { nextTick } from 'vue'
import { fireEvent } from '@testing-library/vue'
import MobileNav from '@/components/layouts/MobileNav.vue'
import { renderWithApp } from '../../../helpers'

describe('MobileNav.vue', () => {
  const ACTIVE_CLASS = 'text-slateMedium-100 border-t-2 border-slateMedium-100'

  const getActiveLinks = (view: { getAllByRole: (role: string) => HTMLElement[] }) =>
    view.getAllByRole('link').filter((link) => link.className.includes(ACTIVE_CLASS))

  it('renders the four navigation links with localized labels and routes', async () => {
    const view = await renderWithApp(MobileNav)

    expect(view.getByRole('link', { name: /inicio/i })).toHaveAttribute('href', '/')
    expect(view.getByRole('link', { name: /acerca/i })).toHaveAttribute('href', '/about')
    expect(view.getByRole('link', { name: /noticias/i })).toHaveAttribute('href', '/blog')
    expect(view.getByRole('link', { name: /contacto/i })).toHaveAttribute('href', '/contact')
  })

  it('highlights the home link by default', async () => {
    const view = await renderWithApp(MobileNav)

    const activeLinks = getActiveLinks(view)
    expect(activeLinks).toHaveLength(1)
    expect(activeLinks[0]).toHaveTextContent('Inicio')
  })

  it('moves the active highlight to the blog link when clicked', async () => {
    const view = await renderWithApp(MobileNav)

    await fireEvent.click(view.getByRole('link', { name: /noticias/i }))
    await nextTick()

    const activeLinks = getActiveLinks(view)
    expect(activeLinks).toHaveLength(1)
    expect(activeLinks[0]).toHaveTextContent('Noticias')
    expect(activeLinks[0]).toHaveAttribute('href', '/blog')
  })

  it('moves the active highlight to the contact link (cto) when clicked', async () => {
    const view = await renderWithApp(MobileNav)

    await fireEvent.click(view.getByRole('link', { name: /contacto/i }))
    await nextTick()

    const activeLinks = getActiveLinks(view)
    expect(activeLinks).toHaveLength(1)
    expect(activeLinks[0]).toHaveTextContent('Contacto')
  })

  it('renders English labels when locale is en', async () => {
    const view = await renderWithApp(MobileNav, { locale: 'en' })

    expect(view.getByRole('link', { name: /^home$/i })).toHaveAttribute('href', '/')
    expect(view.getByRole('link', { name: /^news$/i })).toHaveAttribute('href', '/blog')
  })
})
