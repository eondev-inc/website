import AboutMe from '@/components/base/AboutMe.vue'
import { renderWithApp } from '../../../helpers'

describe('AboutMe.vue', () => {
  it('should render key hero content and links', async () => {
    const view = await renderWithApp(AboutMe)

    expect(view.getByText('Yerffrey Romero')).toBeInTheDocument()
    expect(view.getByRole('link', { name: /ver mi trabajo/i })).toHaveAttribute('href', '/about')
    expect(view.getByRole('link', { name: /conversemos/i })).toHaveAttribute('href', '/contact')
    expect(view.getByRole('img', { name: /yerffrey romero desarrollando código/i })).toBeInTheDocument()
  })
})
