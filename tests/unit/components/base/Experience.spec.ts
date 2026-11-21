import { within } from '@testing-library/vue'
import Experience from '@/components/base/Experience.vue'
import { renderWithApp } from '../../../helpers'

describe('Experience.vue', () => {
  it('renders the career heading and the full-history link (es)', async () => {
    const view = await renderWithApp(Experience)

    expect(view.getByRole('heading', { name: 'Trayectoria' })).toBeInTheDocument()
    expect(view.getByRole('link', { name: /Ver trayectoria completa/i })).toHaveAttribute('href', '/about')
  })

  it('lists every role with its dates, employer link and no hover-only content', async () => {
    const view = await renderWithApp(Experience)

    expect(within(view.getAllByRole('list')[0]).getAllByRole('listitem')).toHaveLength(7)
    expect(view.getByText('Jun. 2026 - Actualidad')).toBeInTheDocument()
    expect(view.getAllByRole('link', { name: /Imed SA/ }).length).toBeGreaterThan(0)
  })

  it('renders the stack groups with their technologies visible', async () => {
    const view = await renderWithApp(Experience)

    expect(view.getByText('NodeJS')).toBeInTheDocument()
    expect(view.getByText('Base de datos')).toBeInTheDocument()
    expect(view.getByText('Desarrollo Web')).toBeInTheDocument()
    ;['Express', 'NestJS', 'Fastify', 'Socket.io', 'MySQL', 'Redis', 'Vue.js', 'TypeScript'].forEach((tech) => {
      expect(view.getByText(tech)).toBeInTheDocument()
    })
  })

  it('renders English translations when locale is en', async () => {
    const view = await renderWithApp(Experience, { locale: 'en' })

    expect(view.getByRole('heading', { name: 'Career' })).toBeInTheDocument()
    expect(view.getByText('Web Development')).toBeInTheDocument()
    expect(view.getByText('Jun. 2026 - Present')).toBeInTheDocument()
  })
})
