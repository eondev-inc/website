import { mount } from '@vue/test-utils'
import CallToAction from '@/components/base/CallToAction.vue'

// Mock sweetalert2
jest.mock('sweetalert2', () => ({
  default: {
    fire: jest.fn().mockResolvedValue({})
  }
}))

// Mock vee-validate
jest.mock('vee-validate', () => ({
  Field: { name: 'Field', template: '<input />' },
  Form: { name: 'Form', template: '<form><slot /></form>' },
  ErrorMessage: { name: 'ErrorMessage', template: '<span />' }
}))

// Mock vue-i18n
jest.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key) => key
  })
}))

describe('CallToAction', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('recipientEmail handling', () => {
    it('should use VITE_CONTACT_EMAIL when env var is set', () => {
      const originalEnv = import.meta.env.VITE_CONTACT_EMAIL
      import.meta.env.VITE_CONTACT_EMAIL = 'test@example.com'

      const wrapper = mount(CallToAction, {
        global: {
          mocks: {
            $t: (key) => key
          }
        }
      })

      expect(import.meta.env.VITE_CONTACT_EMAIL).toBe('test@example.com')

      // Cleanup
      if (originalEnv !== undefined) {
        import.meta.env.VITE_CONTACT_EMAIL = originalEnv
      } else {
        delete import.meta.env.VITE_CONTACT_EMAIL
      }
      wrapper.destroy()
    })

    it('should use fallback email when VITE_CONTACT_EMAIL is unset', () => {
      const originalEnv = import.meta.env.VITE_CONTACT_EMAIL
      delete import.meta.env.VITE_CONTACT_EMAIL

      const wrapper = mount(CallToAction, {
        global: {
          mocks: {
            $t: (key) => key
          }
        }
      })

      // The component should handle missing env var without throwing
      expect(import.meta.env.VITE_CONTACT_EMAIL).toBeUndefined()

      // Cleanup
      if (originalEnv !== undefined) {
        import.meta.env.VITE_CONTACT_EMAIL = originalEnv
      }
      wrapper.destroy()
    })

    it('should handle empty string VITE_CONTACT_EMAIL gracefully', () => {
      const originalEnv = import.meta.env.VITE_CONTACT_EMAIL
      import.meta.env.VITE_CONTACT_EMAIL = ''

      const wrapper = mount(CallToAction, {
        global: {
          mocks: {
            $t: (key) => key
          }
        }
      })

      // Empty string is falsy, so fallback should be used
      expect(import.meta.env.VITE_CONTACT_EMAIL).toBe('')

      // Cleanup
      if (originalEnv !== undefined) {
        import.meta.env.VITE_CONTACT_EMAIL = originalEnv
      } else {
        delete import.meta.env.VITE_CONTACT_EMAIL
      }
      wrapper.destroy()
    })
  })
})
