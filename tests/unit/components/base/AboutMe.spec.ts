import AboutMe from '@/components/base/AboutMe.vue'
import { renderWithApp } from '../../../helpers'

describe('AboutMe.vue', () => {
  it('should render key hero content and links', async () => {
    const view = await renderWithApp(AboutMe)

    expect(view.getByText('Yerffrey Romero')).toBeInTheDocument()
    expect(view.getByRole('link', { name: /ver mi trabajo/i })).toHaveAttribute('href', '/about')
    expect(view.getByRole('link', { name: /conversemos/i })).toHaveAttribute('href', '/contact')
    expect(view.getByRole('heading', { name: 'Ingeniero de Software' })).toBeInTheDocument()
  })

  it('shows the two most recent roles instead of an illustration', async () => {
    const view = await renderWithApp(AboutMe)

    expect(view.queryByRole('img')).toBeNull()
    expect(view.getAllByRole('listitem')).toHaveLength(2)
    expect(view.getByText('Jun. 2026 - Actualidad')).toBeInTheDocument()
    expect(view.getByText(/Líder Técnico Advisor IA/)).toBeInTheDocument()
    expect(view.getByRole('link', { name: /Ver trayectoria completa/i })).toHaveAttribute('href', '/about')
  })
})
