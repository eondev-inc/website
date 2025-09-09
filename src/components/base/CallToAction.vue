<template>
  <div class="relative py-16 px-4 overflow-hidden">
    <!-- Fondo con gradiente dinámico -->
    <div class="absolute inset-0 bg-gradient-to-br from-secondary-100 via-white to-primary-50">
      <div class="absolute inset-0 bg-gradient-to-r from-secondary-500/5 to-primary-500/5"></div>
    </div>

    <!-- Elementos decorativos flotantes -->
    <div class="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-secondary-200 to-primary-200 rounded-full opacity-20 animate-float"></div>
    <div class="absolute bottom-10 right-10 w-24 h-24 bg-gradient-to-br from-primary-200 to-secondary-200 rounded-full opacity-30 animate-float-delayed"></div>
    <div class="absolute top-1/2 left-20 w-16 h-16 bg-gradient-to-br from-secondary-300 to-primary-300 rounded-full opacity-25 animate-pulse"></div>

    <div class="relative max-w-4xl mx-auto">
      <div class="text-center mb-12 animate-fade-in-up">
        <h2 class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-secondary-600 to-primary-400 bg-clip-text text-transparent mb-4">
          {{ $t('callToAction.title') }}
        </h2>
        <p class="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          {{ $t('callToAction.subtitle') }}
        </p>
      </div>

      <div class="bg-white/80 backdrop-blur-lg rounded-3xl border border-white/40 shadow-2xl shadow-primary-500/10 p-8 md:p-12 animate-slide-up">
        <Form @submit="onSubmit" class="space-y-8">
          <div class="grid md:grid-cols-2 gap-6">
            <div class="space-y-6">
              <!-- Campo Nombre -->
              <div class="group">
                <label for="name" class="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-secondary-600">
                  <i class="fas fa-user text-secondary-500 mr-2"></i>
                  {{ $t('callToAction.name') }}
                </label>
                <div class="relative">
                  <Field
                    id="name"
                    name="name"
                    :rules="fields[0].rules"
                    type="text"
                    class="w-full px-4 py-4 bg-white/50 border-2 border-gray-200 rounded-xl focus:border-secondary-400 focus:bg-white focus:ring-4 focus:ring-secondary-100 transition-all duration-300 placeholder-gray-400"
                    :placeholder="$t('callToAction.namePlaceholder')"
                  />
                  <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-secondary-400/0 to-primary-400/0 group-focus-within:from-secondary-400/10 group-focus-within:to-primary-400/10 transition-all duration-300 pointer-events-none"></div>
                </div>
                <ErrorMessage name="name" class="text-red-500 text-sm mt-1 flex items-center">
                  <template #default="{ message }">
                    <i class="fas fa-exclamation-triangle mr-1"></i>
                    {{ message }}
                  </template>
                </ErrorMessage>
              </div>

              <!-- Campo Email -->
              <div class="group">
                <label for="email" class="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-secondary-600">
                  <i class="fas fa-envelope text-secondary-500 mr-2"></i>
                  {{ $t('callToAction.email') }}
                </label>
                <div class="relative">
                  <Field
                    id="email"
                    name="email"
                    :rules="fields[1].rules"
                    type="email"
                    class="w-full px-4 py-4 bg-white/50 border-2 border-gray-200 rounded-xl focus:border-secondary-400 focus:bg-white focus:ring-4 focus:ring-secondary-100 transition-all duration-300 placeholder-gray-400"
                    :placeholder="$t('callToAction.emailPlaceholder')"
                  />
                  <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-secondary-400/0 to-primary-400/0 group-focus-within:from-secondary-400/10 group-focus-within:to-primary-400/10 transition-all duration-300 pointer-events-none"></div>
                </div>
                <ErrorMessage name="email" class="text-red-500 text-sm mt-1 flex items-center">
                  <template #default="{ message }">
                    <i class="fas fa-exclamation-triangle mr-1"></i>
                    {{ message }}
                  </template>
                </ErrorMessage>
              </div>
            </div>

            <div class="space-y-6">
              <!-- Campo Mensaje -->
              <div class="group">
                <label for="message" class="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-secondary-600">
                  <i class="fas fa-comment-alt text-secondary-500 mr-2"></i>
                  {{ $t('callToAction.message') }}
                </label>
                <div class="relative">
                  <Field
                    id="message"
                    name="message"
                    :rules="fields[2].rules"
                    as="textarea"
                    rows="6"
                    class="w-full px-4 py-4 bg-white/50 border-2 border-gray-200 rounded-xl focus:border-secondary-400 focus:bg-white focus:ring-4 focus:ring-secondary-100 transition-all duration-300 placeholder-gray-400 resize-none"
                    :placeholder="$t('callToAction.messagePlaceholder')"
                  />
                  <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-secondary-400/0 to-primary-400/0 group-focus-within:from-secondary-400/10 group-focus-within:to-primary-400/10 transition-all duration-300 pointer-events-none"></div>
                </div>
                <ErrorMessage name="message" class="text-red-500 text-sm mt-1 flex items-center">
                  <template #default="{ message }">
                    <i class="fas fa-exclamation-triangle mr-1"></i>
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
              class="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-secondary-600 to-primary-400 text-white font-bold rounded-2xl shadow-lg shadow-secondary-500/25 hover:shadow-xl hover:shadow-secondary-500/30 transform hover:scale-105 focus:scale-105 focus:outline-none focus:ring-4 focus:ring-secondary-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <div class="absolute inset-0 bg-gradient-to-r from-secondary-700 to-primary-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span class="relative flex items-center">
                <template v-if="loading">
                  <i class="fas fa-spinner fa-spin mr-2"></i>
                  {{ $t('callToAction.sending') }}
                </template>
                <template v-else>
                  <i class="fas fa-paper-plane mr-2 transform group-hover:translate-x-1 transition-transform duration-300"></i>
                  {{ $t('callToAction.send') }}
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
import { Field, Form, ErrorMessage, useForm } from 'vee-validate'
import * as yup from 'yup'
// eslint-disable-next-line import/no-duplicates
import { SweetAlertIcon, SweetAlertOptions } from 'sweetalert2'
// eslint-disable-next-line import/no-duplicates
import Swal from 'sweetalert2'

interface FormField {
  name: string
  rules: yup.StringSchema
  type: string
}

export default defineComponent({
  name: 'CallToAction',
  components: {
    Field,
    Form,
    ErrorMessage
  },
  setup() {
    const { handleSubmit, errors } = useForm()

    const fields: FormField[] = [
      {
        name: 'name',
        rules: yup
          .string()
          .min(3, 'El nombre debe tener al menos 3 caracteres')
          .required('El nombre es obligatorio'),
        type: 'text'
      },
      {
        name: 'email',
        rules: yup
          .string()
          .email('Debe ser un email válido')
          .required('El email es obligatorio'),
        type: 'email'
      },
      {
        name: 'message',
        rules: yup
          .string()
          .min(10, 'El mensaje debe tener al menos 10 caracteres')
          .required('El mensaje es obligatorio'),
        type: 'textarea'
      }
    ]

    const loading = ref(false)

    const dispatchSwal = (scope: string) => {
      const icon: SweetAlertIcon = scope === 'success' ? 'success' : 'error'
      const swalOptions: SweetAlertOptions = {
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        icon,
        title: scope === 'success'
          ? '¡Mensaje enviado correctamente!'
          : 'Algo salió mal',
        text: scope === 'success'
          ? 'Te contactaremos pronto'
          : 'Por favor, inténtalo de nuevo',
        toast: true,
        background: scope === 'success' ? '#f0fdf4' : '#fef2f2',
        color: scope === 'success' ? '#065f46' : '#991b1b'
      }
      Swal.fire(swalOptions)
    }

    const onSubmit = handleSubmit(async (values: any) => {
      try {
        loading.value = true

        // Simular envío de formulario
        const response = await fetch(
          'https://run.mocky.io/v3/2eb0428f-0525-4779-98a0-23993cb7ebfe',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
          }
        )

        if (response.status === 200) {
          dispatchSwal('success')
          // Resetear formulario después del éxito
          setTimeout(() => {
            const form = document.querySelector('form')
            if (form) form.reset()
          }, 2000)
        } else {
          throw new Error('Error en el servidor')
        }
      } catch (error) {
        console.error('Error enviando formulario:', error)
        dispatchSwal('error')
      } finally {
        loading.value = false
      }
    })

    return {
      onSubmit,
      errors,
      fields,
      loading
    }
  }
})
</script>

<style scoped>
/* Animaciones personalizadas */
@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

@keyframes float-delayed {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-15px) rotate(-180deg);
  }
}

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

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 8s ease-in-out infinite;
  animation-delay: -2s;
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

/* Mejoras en el glassmorphism */
.backdrop-blur-lg {
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}
</style>
