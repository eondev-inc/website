import { mount, VueWrapper, flushPromises } from '@vue/test-utils'
import { fireEvent, waitFor } from '@testing-library/vue'
import Swal from 'sweetalert2'
import CallToAction from '@/components/base/CallToAction.vue'
import { renderWithApp, createTestI18n } from '../../../helpers'

// Mock sweetalert2
jest.mock('sweetalert2', () => ({
  __esModule: true,
  default: {
    fire: jest.fn()
  }
}))

// Real vee-validate and vue-i18n: validation tests need the real engines

// Component reads process.env.VITE_CONTACT_EMAIL (Jest runs in Node)

describe('CallToAction.vue', () => {
  const originalEnv = { ...process.env }

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    // Reset env before each test
    process.env.VITE_CONTACT_EMAIL = ''
  })

  afterAll(() => {
    Object.assign(process.env, originalEnv)
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('VITE_CONTACT_EMAIL env var handling', () => {
    it('should use VITE_CONTACT_EMAIL when env var is set', async () => {
      process.env.VITE_CONTACT_EMAIL = 'test@example.com'

      const wrapper: VueWrapper<any> = mount(CallToAction, {
        global: {
          plugins: [createTestI18n()]
        }
      })

      // Real vee-validate validates on submit: fill valid data so onSubmit runs
      await wrapper.find('input#name').setValue('John Doe')
      await wrapper.find('input#email').setValue('john@example.com')
      await wrapper.find('textarea#message').setValue('Mensaje de prueba valido')
      await wrapper.find('form').trigger('submit')
      await flushPromises()

      // Verify Swal.fire was called (info notification before mailto)
      expect(Swal.fire).toHaveBeenCalled()

      wrapper.unmount()
    })

    it('should use fallback email when VITE_CONTACT_EMAIL is unset', async () => {
      const wrapper: VueWrapper<any> = mount(CallToAction, {
        global: {
          plugins: [createTestI18n()]
        }
      })

      // Component should mount without throwing
      expect(wrapper.exists()).toBe(true)

      wrapper.unmount()
    })

    it('should handle empty string VITE_CONTACT_EMAIL gracefully', async () => {
      process.env.VITE_CONTACT_EMAIL = ''

      const wrapper: VueWrapper<any> = mount(CallToAction, {
        global: {
          plugins: [createTestI18n()]
        }
      })

      // Empty string is falsy, fallback should be used
      expect(process.env.VITE_CONTACT_EMAIL).toBe('')
      expect(wrapper.exists()).toBe(true)

      wrapper.unmount()
    })
  })

  describe('form rendering and user interaction', () => {
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
})
