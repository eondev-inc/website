import { fireEvent, waitFor } from '@testing-library/vue'
import Swal from 'sweetalert2'
import CallToAction from '@/components/base/CallToAction.vue'
import { renderWithApp } from '../../../helpers'

jest.mock('sweetalert2', () => ({
  __esModule: true,
  default: {
    fire: jest.fn()
  }
}))

describe('CallToAction.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should render form fields and submit button', async () => {
    const view = await renderWithApp(CallToAction)

    expect(view.getByLabelText(/nombre/i)).toBeInTheDocument()
    expect(view.getByLabelText(/email/i)).toBeInTheDocument()
    expect(view.getByLabelText(/mensaje/i)).toBeInTheDocument()
    expect(view.getByRole('button', { name: /enviar mensaje/i })).toBeInTheDocument()
  })

  it('should show validation messages on empty submit', async () => {
    const view = await renderWithApp(CallToAction)

    await fireEvent.click(view.getByRole('button', { name: /enviar mensaje/i }))

    expect(await view.findByText('El nombre es obligatorio')).toBeInTheDocument()
    expect(view.getByText('El email es obligatorio')).toBeInTheDocument()
    expect(view.getByText('El mensaje es obligatorio')).toBeInTheDocument()
  })

  it('should call Swal notifications on valid submit flow', async () => {
    const view = await renderWithApp(CallToAction)

    await fireEvent.update(view.getByLabelText(/nombre/i), 'Yerffrey Romero')
    await fireEvent.update(view.getByLabelText(/email/i), 'yerffrey@example.com')
    await fireEvent.update(view.getByLabelText(/mensaje/i), 'Este es un mensaje de prueba con más de diez caracteres')

    await fireEvent.click(view.getByRole('button', { name: /enviar mensaje/i }))

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalled()
    })

    jest.advanceTimersByTime(1600)
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledTimes(2)
    })
  })
})
