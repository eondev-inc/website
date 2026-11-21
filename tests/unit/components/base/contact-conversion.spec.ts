import CallToAction from '@/components/base/CallToAction.vue'
import AboutMe from '@/components/base/AboutMe.vue'
import { CONTACT_EMAIL } from '@/config/contact'
import { renderWithApp } from '../../../helpers'

describe('contact conversion path', () => {
  it('never falls back to a placeholder address', () => {
    expect(CONTACT_EMAIL).toBe('hola@eondev.site')
  })

  it('leads the contact page with a direct mailto link', async () => {
    const view = await renderWithApp(CallToAction)

    const links = view.getAllByRole('link', { name: 'hola@eondev.site' })
    expect(links.length).toBeGreaterThanOrEqual(1)
    links.forEach((link) => expect(link).toHaveAttribute('href', 'mailto:hola@eondev.site'))
  })

  it('makes contact the primary hero action and shows the address', async () => {
    const view = await renderWithApp(AboutMe)

    expect(view.getByRole('link', { name: 'Conversemos' })).toHaveAttribute('href', '/contact')
    expect(view.getByRole('link', { name: 'hola@eondev.site' })).toHaveAttribute('href', 'mailto:hola@eondev.site')
    expect(view.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute('aria-label', 'LinkedIn')
  })
})
