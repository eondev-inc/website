import Experience from '@/components/base/Experience.vue'
import { renderWithApp } from '../../../helpers'

describe('Experience.vue', () => {
  it('renders the section heading and subtitle (es)', async () => {
    const view = await renderWithApp(Experience)

    expect(view.getByRole('heading', { name: 'Experiencia Técnica' })).toBeInTheDocument()
    expect(view.getByText(/Tecnologías y herramientas con las que he trabajado/)).toBeInTheDocument()
  })

  it('renders the three experience cards with their localized titles', async () => {
    const view = await renderWithApp(Experience)

    expect(view.getByText('NodeJS')).toBeInTheDocument()
    expect(view.getByText('Base de datos')).toBeInTheDocument()
    expect(view.getByText('Desarrollo Web')).toBeInTheDocument()
  })

  it('renders the tech badges for every card', async () => {
    const view = await renderWithApp(Experience)

    const badges = [
      'Express',
      'NestJS',
      'Fastify',
      'Socket.io',
      'MySQL',
      'MongoDB',
      'PostgreSQL',
      'Redis',
      'Vue.js',
      'React',
      'Angular',
      'TypeScript'
    ]

    badges.forEach((badge) => {
      expect(view.getByText(badge)).toBeInTheDocument()
    })
  })

  it('links to /about with the call-to-action text', async () => {
    const view = await renderWithApp(Experience)

    const link = view.getByRole('link', { name: /Ver más detalles/i })
    expect(link).toHaveAttribute('href', '/about')
  })

  it('renders English translations when locale is en', async () => {
    const view = await renderWithApp(Experience, { locale: 'en' })

    expect(view.getByRole('heading', { name: 'Technical Experience' })).toBeInTheDocument()
    expect(view.getByText('Web Development')).toBeInTheDocument()
    expect(view.getByText('Want to know more about my technical experience?')).toBeInTheDocument()
  })
})
