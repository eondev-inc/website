import { fireEvent } from '@testing-library/vue'
import ErrorState from '@/components/base/ErrorState.vue'
import { renderWithApp } from '../../../helpers'

describe('ErrorState.vue', () => {
  it('should render title, message and suggestions', async () => {
    const view = await renderWithApp(ErrorState, {
      props: {
        title: 'Error de red',
        message: 'No se pudo cargar',
        suggestions: ['Reintentar', 'Verificar internet'],
        showContact: true
      }
    })

    expect(view.getByText('Error de red')).toBeInTheDocument()
    expect(view.getByText('No se pudo cargar')).toBeInTheDocument()
    expect(view.getByText('Reintentar')).toBeInTheDocument()
    expect(view.getByText('Verificar internet')).toBeInTheDocument()
    expect(view.getByText(/contacta con soporte/i)).toBeInTheDocument()
  })

  it('should emit retry event when retry button is clicked', async () => {
    const view = await renderWithApp(ErrorState)

    await fireEvent.click(view.getByRole('button', { name: /intentar de nuevo/i }))

    expect(view.emitted().retry).toBeTruthy()
  })

  it('should emit go-home and navigate when go home button is clicked', async () => {
    const view = await renderWithApp(ErrorState, {
      props: { showGoHome: true }
    })

    await fireEvent.click(view.getByRole('button', { name: /ir al inicio/i }))

    expect(view.emitted()['go-home']).toBeTruthy()
    expect(view.router.currentRoute.value.path).toBe('/')
  })

  it('should show technical details only when enabled', async () => {
    const view = await renderWithApp(ErrorState, {
      props: {
        showTechnicalInfo: true,
        technicalMessage: 'STACK_TRACE_123'
      }
    })

    expect(view.getByText(/información técnica/i)).toBeInTheDocument()
    expect(view.getByText('STACK_TRACE_123')).toBeInTheDocument()
  })
})
