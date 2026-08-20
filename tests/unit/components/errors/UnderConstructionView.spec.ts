import UnderConstructionView from '@/components/errors/UnderConstructionView.vue'
import { renderWithApp } from '../../../helpers'

describe('UnderConstructionView.vue', () => {
  it('renders the localized construction message (es)', async () => {
    const view = await renderWithApp(UnderConstructionView)

    expect(view.getByText('Estamos trabajando para Usted')).toBeInTheDocument()
  })

  it('renders the construction image with its alt text', async () => {
    const view = await renderWithApp(UnderConstructionView)

    const img = view.getByRole('img', { name: 'under-construction' })
    expect(img).toBeInTheDocument()
  })

  it('renders the English message when locale is en', async () => {
    const view = await renderWithApp(UnderConstructionView, { locale: 'en' })

    expect(view.getByText('We are working for you')).toBeInTheDocument()
  })
})
