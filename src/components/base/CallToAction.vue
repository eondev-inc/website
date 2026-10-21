<template>
  <div class="py-16 px-4 bg-neutral-50">
    <div class="relative max-w-4xl mx-auto">
      <div class="text-center mb-12 animate-fade-in-up">
        <h2 class="text-4xl md:text-5xl font-bold text-primary-700 mb-4">
          {{ $t("callToAction.title") }}
        </h2>
        <p
          class="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
        >
          {{ $t("callToAction.subtitle") }}
        </p>
      </div>

      <div
        class="bg-white rounded-3xl border border-neutral-200 shadow-soft p-8 md:p-12 animate-slide-up"
      >
        <Form class="space-y-8" @submit="onSubmit">
          <div class="grid md:grid-cols-2 gap-6">
            <div class="space-y-6">
              <!-- Campo Nombre -->
              <div class="group">
                <label
                  for="name"
                  class="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-secondary-600"
                >
                  <font-awesome-icon
                    icon="user"
                    class="text-secondary-500 mr-2"
                  />
                  {{ $t("callToAction.name") }}
                </label>
                <div
                  class="relative rounded-xl transition-shadow duration-300 group-focus-within:ring-2 group-focus-within:ring-primary-700/20"
                >
                  <Field
                    id="name"
                    name="name"
                    :rules="fields[0].rules"
                    type="text"
                    class="w-full px-4 py-4 bg-white/50 border-2 border-gray-200 rounded-xl focus:border-primary-700 group-focus-within:border-primary-700 focus:bg-white focus:ring-4 focus:ring-secondary-100 transition-all duration-300 placeholder-gray-400"
                    :placeholder="$t('callToAction.namePlaceholder')"
                  />
                </div>
                <ErrorMessage
                  name="name"
                  class="text-red-500 text-sm mt-1 flex items-center"
                >
                  <template #default="{ message }">
                    <font-awesome-icon
                      icon="exclamation-triangle"
                      class="mr-1"
                    />
                    {{ message }}
                  </template>
                </ErrorMessage>
              </div>

              <!-- Campo Email -->
              <div class="group">
                <label
                  for="email"
                  class="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-secondary-600"
                >
                  <font-awesome-icon
                    icon="envelope"
                    class="text-secondary-500 mr-2"
                  />
                  {{ $t("callToAction.email") }}
                </label>
                <div
                  class="relative rounded-xl transition-shadow duration-300 group-focus-within:ring-2 group-focus-within:ring-primary-700/20"
                >
                  <Field
                    id="email"
                    name="email"
                    :rules="fields[1].rules"
                    type="email"
                    class="w-full px-4 py-4 bg-white/50 border-2 border-gray-200 rounded-xl focus:border-primary-700 group-focus-within:border-primary-700 focus:bg-white focus:ring-4 focus:ring-secondary-100 transition-all duration-300 placeholder-gray-400"
                    :placeholder="$t('callToAction.emailPlaceholder')"
                  />
                </div>
                <ErrorMessage
                  name="email"
                  class="text-red-500 text-sm mt-1 flex items-center"
                >
                  <template #default="{ message }">
                    <font-awesome-icon
                      icon="exclamation-triangle"
                      class="mr-1"
                    />
                    {{ message }}
                  </template>
                </ErrorMessage>
              </div>
            </div>

            <div class="space-y-6">
              <!-- Campo Mensaje -->
              <div class="group">
                <label
                  for="message"
                  class="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-secondary-600"
                >
                  <font-awesome-icon
                    icon="comment-alt"
                    class="text-secondary-500 mr-2"
                  />
                  {{ $t("callToAction.message") }}
                </label>
                <div
                  class="relative rounded-xl transition-shadow duration-300 group-focus-within:ring-2 group-focus-within:ring-primary-700/20"
                >
                  <Field
                    id="message"
                    name="message"
                    :rules="fields[2].rules"
                    as="textarea"
                    rows="6"
                    class="w-full px-4 py-4 bg-white/50 border-2 border-gray-200 rounded-xl focus:border-primary-700 group-focus-within:border-primary-700 focus:bg-white focus:ring-4 focus:ring-secondary-100 transition-all duration-300 placeholder-gray-400 resize-none"
                    :placeholder="$t('callToAction.messagePlaceholder')"
                  />
                </div>
                <ErrorMessage
                  name="message"
                  class="text-red-500 text-sm mt-1 flex items-center"
                >
                  <template #default="{ message }">
                    <font-awesome-icon
                      icon="exclamation-triangle"
                      class="mr-1"
                    />
                    {{ message }}
                  </template>
                </ErrorMessage>
              </div>
            </div>
          </div>

          <!-- Botón de envío -->
          <div class="text-center pt-4">
            <button
              type="submit"
              :disabled="loading"
              class="group relative inline-flex items-center px-8 py-4 bg-primary-700 text-white font-bold rounded-lg shadow-soft hover:bg-primary-800 hover:shadow-medium focus:outline-none focus:ring-2 focus:ring-primary-700 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span class="relative flex items-center">
                <template v-if="loading">
                  <font-awesome-icon icon="spinner" spin class="mr-2" />
                  {{ $t("callToAction.sending") }}
                </template>
                <template v-else>
                  <font-awesome-icon
                    icon="paper-plane"
                    class="mr-2 transform group-hover:translate-x-1 transition-transform duration-300"
                  />
                  {{ $t("callToAction.send") }}
                </template>
              </span>
            </button>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { Field, Form, ErrorMessage } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import * as yup from 'yup'
import Swal from 'sweetalert2'

interface FormField {
  name: string;
  rules: yup.StringSchema;
  type: string;
}

export default defineComponent({
  name: 'CallToAction',
  components: {
    Field,
    Form,
    ErrorMessage
  },
  setup() {
    const { t } = useI18n()

    const fields: FormField[] = [
      {
        name: 'name',
        rules: yup
          .string()
          .min(3, t('callToAction.validation.nameMinLength'))
          .required(t('callToAction.validation.nameRequired')),
        type: 'text'
      },
      {
        name: 'email',
        rules: yup
          .string()
          .email(t('callToAction.validation.emailInvalid'))
          .required(t('callToAction.validation.emailRequired')),
        type: 'email'
      },
      {
        name: 'message',
        rules: yup
          .string()
          .min(10, t('callToAction.validation.messageMinLength'))
          .required(t('callToAction.validation.messageRequired')),
        type: 'textarea'
      }
    ]

    const loading = ref(false)

    const dispatchSwal = (scope: string, message?: string) => {
      let icon: 'success' | 'info' | 'error' = 'info'
      let title = ''
      let defaultText = ''
      let background = '#eff6ff'
      let color = '#1e40af'

      if (scope === 'success') {
        icon = 'success'
        title = t('callToAction.notifications.emailOpenedTitle')
        defaultText = t('callToAction.notifications.emailOpenedText')
        background = '#f0fdf4'
        color = '#065f46'
      } else if (scope === 'error') {
        icon = 'error'
        title = t('callToAction.notifications.errorTitle')
        defaultText = t('callToAction.notifications.errorText')
        background = '#fef2f2'
        color = '#991b1b'
      } else {
        title = t('callToAction.notifications.openingEmailTitle')
        defaultText = t('callToAction.notifications.openingEmailText')
      }

      const swalOptions = {
        position: 'top-end' as const,
        showConfirmButton: false,
        timer: 3000,
        icon,
        title,
        text: message || defaultText,
        toast: true,
        background,
        color
      }
      Swal.fire(swalOptions)
    }

    const onSubmit = async (values: any) => {
      try {
        loading.value = true

        // Configuración del destinatario
        const recipientEmail =
          process.env.VITE_CONTACT_EMAIL || 'fallback@example.com'

        // Construir el asunto del correo
        const subject = encodeURIComponent(
          `${t('callToAction.emailSubject')} - ${values.name}`
        )

        // Construir el cuerpo del correo
        const emailContactInfo = t('callToAction.emailContactInfo')
        const emailMessageLabel = t('callToAction.emailMessage')
        const emailFooter = t('callToAction.emailFooter')

        const body = encodeURIComponent(
          `
          Hola,

          Mi nombre es ${values.name} y me gustaría contactarte.

          ${emailContactInfo}:
          - Nombre: ${values.name}
          - Email: ${values.email}

          ${emailMessageLabel}:
          ${values.message}

          ---
          ${emailFooter}
        `.trim()
        )

        // Construir la URL de mailto
        const mailtoUrl = `mailto:${recipientEmail}?subject=${subject}&body=${body}&cc=${encodeURIComponent(
          values.email
        )}`

        // Mostrar mensaje informativo
        dispatchSwal('info')

        // Abrir el cliente de correo
        window.open(mailtoUrl, '_self')
        // Después de un breve delay, mostrar mensaje de éxito y limpiar formulario
        setTimeout(() => {
          dispatchSwal('success')
          const form = document.querySelector('form')
          if (form) form.reset()
        }, 1500)
      } catch (error) {
        console.error('Error abriendo cliente de correo:', error)
        dispatchSwal('error', t('callToAction.notifications.emailErrorText'))
      } finally {
        setTimeout(() => {
          loading.value = false
        }, 1500)
      }
    }

    return {
      onSubmit,
      fields,
      loading
    }
  }
})
</script>

<style scoped>
/* Animaciones personalizadas */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(50px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out;
}

.animate-slide-up {
  animation: slide-up 1s ease-out;
  animation-delay: 0.2s;
  animation-fill-mode: both;
}

/* Efectos hover personalizados */
.group:hover .transform {
  transform: translateX(4px);
}
</style>
