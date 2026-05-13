import FooterView from '@/components/layouts/FooterView.vue'
import { renderWithApp } from '../../../helpers'

describe('FooterView.vue', () => {
  it('should render social links and contact cta', async () => {
    const view = await renderWithApp(FooterView)

    expect(view.getByRole('link', { name: /gitHub/i })).toBeInTheDocument()
    expect(view.getByRole('link', { name: /linkedIn/i })).toBeInTheDocument()
    expect(view.getByRole('link', { name: /blog/i })).toBeInTheDocument()
    expect(view.getByRole('link', { name: /conversemos/i })).toHaveAttribute('href', '/contact')
  })
})
