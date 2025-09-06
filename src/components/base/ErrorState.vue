<!--
  Error State Component
  Componente para mostrar estados de error con diferentes variantes,
  acciones de recuperación y información contextual para mejorar la UX.

  @component ErrorState
  @author Yerffrey Romero.
  @version 1.0
  @since 2025-09-05
-->

<template>
  <div :class="containerClasses">
    <div class="text-center py-12 px-6">

      <!-- Icono de error -->
      <div class="mb-6">
        <div :class="iconContainerClasses">
          <i :class="iconClasses"></i>
        </div>
      </div>

      <!-- Contenido principal -->
      <div class="max-w-md mx-auto space-y-4">
        <h3 class="text-xl font-bold text-neutral-800">
          {{ title }}
        </h3>

        <p class="text-neutral-600 leading-relaxed">
          {{ message }}
        </p>

        <!-- Información técnica (opcional) -->
        <details v-if="showTechnicalInfo && technicalMessage" class="text-left">
          <summary class="text-sm text-neutral-500 cursor-pointer hover:text-neutral-700 transition-colors">
            Información técnica
          </summary>
          <div class="mt-2 p-3 bg-neutral-100 rounded-lg text-sm font-mono text-neutral-700">
            {{ technicalMessage }}
          </div>
        </details>

        <!-- Acciones -->
        <div class="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <button
            v-if="showRetry"
            @click="handleRetry"
            :disabled="isRetrying"
            class="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i v-if="isRetrying" class="fas fa-spinner fa-spin mr-2"></i>
            <i v-else class="fas fa-redo mr-2"></i>
            {{ isRetrying ? 'Reintentando...' : 'Intentar de nuevo' }}
          </button>

          <button
            v-if="showGoHome"
            @click="handleGoHome"
            class="inline-flex items-center justify-center px-6 py-3 bg-white border-2 border-neutral-200 text-neutral-700 rounded-xl hover:bg-neutral-50 hover:border-neutral-300 focus:outline-none focus:ring-4 focus:ring-neutral-200 transition-all duration-300"
          >
            <i class="fas fa-home mr-2"></i>
            Ir al inicio
          </button>

          <button
            v-if="showReload"
            @click="handleReload"
            class="inline-flex items-center justify-center px-6 py-3 bg-white border-2 border-neutral-200 text-neutral-700 rounded-xl hover:bg-neutral-50 hover:border-neutral-300 focus:outline-none focus:ring-4 focus:ring-neutral-200 transition-all duration-300"
          >
            <i class="fas fa-sync-alt mr-2"></i>
            Recargar página
          </button>
        </div>

        <!-- Sugerencias adicionales -->
        <div v-if="suggestions && suggestions.length > 0" class="pt-4">
          <p class="text-sm font-medium text-neutral-700 mb-2">Sugerencias:</p>
          <ul class="text-sm text-neutral-600 space-y-1">
            <li v-for="(suggestion, index) in suggestions" :key="index" class="flex items-start">
              <i class="fas fa-lightbulb text-yellow-500 mr-2 mt-0.5 text-xs"></i>
              {{ suggestion }}
            </li>
          </ul>
        </div>

        <!-- Información de contacto -->
        <div v-if="showContact" class="pt-4 border-t border-neutral-200">
          <p class="text-xs text-neutral-500">
            Si el problema persiste,
            <a href="mailto:support@example.com" class="text-primary-600 hover:text-primary-700 underline">
              contacta con soporte
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent, computed } from 'vue'
import { useRouter } from 'vue-router'

interface ErrorType {
  network: {
    icon: 'fa-wifi'
    color: 'text-orange-500'
    bgColor: 'bg-orange-100'
  }
  timeout: {
    icon: 'fa-clock'
    color: 'text-blue-500'
    bgColor: 'bg-blue-100'
  }
  parse: {
    icon: 'fa-file-alt'
    color: 'text-red-500'
    bgColor: 'bg-red-100'
  }
  unknown: {
    icon: 'fa-exclamation-triangle'
    color: 'text-gray-500'
    bgColor: 'bg-gray-100'
  }
}

export default defineComponent({
  name: 'ErrorState',
  props: {
    /**
     * Tipo de error
     */
    type: {
      type: String as PropType<'network' | 'timeout' | 'parse' | 'unknown'>,
      default: 'unknown'
    },

    /**
     * Título del error
     */
    title: {
      type: String,
      default: 'Algo salió mal'
    },

    /**
     * Mensaje principal del error
     */
    message: {
      type: String,
      default: 'Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.'
    },

    /**
     * Mensaje técnico opcional
     */
    technicalMessage: {
      type: String,
      default: ''
    },

    /**
     * Mostrar información técnica
     */
    showTechnicalInfo: {
      type: Boolean,
      default: false
    },

    /**
     * Mostrar botón de reintentar
     */
    showRetry: {
      type: Boolean,
      default: true
    },

    /**
     * Mostrar botón de ir al inicio
     */
    showGoHome: {
      type: Boolean,
      default: false
    },

    /**
     * Mostrar botón de recargar página
     */
    showReload: {
      type: Boolean,
      default: false
    },

    /**
     * Mostrar información de contacto
     */
    showContact: {
      type: Boolean,
      default: false
    },

    /**
     * Estado de carga del reintento
     */
    isRetrying: {
      type: Boolean,
      default: false
    },

    /**
     * Sugerencias para el usuario
     */
    suggestions: {
      type: Array as PropType<string[]>,
      default: () => []
    },

    /**
     * Tamaño del componente
     */
    size: {
      type: String as PropType<'small' | 'medium' | 'large'>,
      default: 'medium',
      validator: (value: string) => ['small', 'medium', 'large'].includes(value)
    },

    /**
     * Clases adicionales para el contenedor
     */
    containerClass: {
      type: String,
      default: ''
    }
  },
  emits: ['retry', 'go-home', 'reload'],
  setup(props, { emit }) {
    const router = useRouter()

    const errorTypes: ErrorType = {
      network: {
        icon: 'fa-wifi',
        color: 'text-orange-500',
        bgColor: 'bg-orange-100'
      },
      timeout: {
        icon: 'fa-clock',
        color: 'text-blue-500',
        bgColor: 'bg-blue-100'
      },
      parse: {
        icon: 'fa-file-alt',
        color: 'text-red-500',
        bgColor: 'bg-red-100'
      },
      unknown: {
        icon: 'fa-exclamation-triangle',
        color: 'text-gray-500',
        bgColor: 'bg-gray-100'
      }
    }

    const containerClasses = computed(() => {
      const sizeClasses = {
        small: 'min-h-[300px]',
        medium: 'min-h-[400px]',
        large: 'min-h-[500px]'
      }

      return `flex items-center justify-center ${sizeClasses[props.size]} ${props.containerClass}`
    })

    const iconContainerClasses = computed(() => {
      const errorType = errorTypes[props.type]
      const sizeClasses = {
        small: 'w-12 h-12',
        medium: 'w-16 h-16',
        large: 'w-20 h-20'
      }

      return `${sizeClasses[props.size]} ${errorType.bgColor} rounded-full flex items-center justify-center mx-auto`
    })

    const iconClasses = computed(() => {
      const errorType = errorTypes[props.type]
      const sizeClasses = {
        small: 'text-lg',
        medium: 'text-2xl',
        large: 'text-3xl'
      }

      return `fas ${errorType.icon} ${errorType.color} ${sizeClasses[props.size]}`
    })

    const handleRetry = () => {
      emit('retry')
    }

    const handleGoHome = () => {
      emit('go-home')
      router.push('/')
    }

    const handleReload = () => {
      emit('reload')
      window.location.reload()
    }

    return {
      containerClasses,
      iconContainerClasses,
      iconClasses,
      handleRetry,
      handleGoHome,
      handleReload
    }
  }
})
</script>

<style scoped>
/* Animaciones para estados de error */
@keyframes fade-in-scale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes bounce-in {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* Aplicar animaciones */
.error-container {
  animation: fade-in-scale 0.5s ease-out;
}

.error-icon {
  animation: bounce-in 0.6s ease-out;
}

/* Hover effects para botones */
button {
  position: relative;
  overflow: hidden;
}

button:not(:disabled)::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: left 0.5s;
}

button:not(:disabled):hover::before {
  left: 100%;
}

/* Focus states para accesibilidad */
button:focus-visible {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .error-container {
    padding: 1rem;
  }

  .error-actions {
    flex-direction: column;
    gap: 0.5rem;
  }

  .error-actions button {
    width: 100%;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .error-container,
  .error-icon {
    animation: none;
  }

  button::before {
    transition: none;
  }

  button:hover::before {
    left: 0;
    opacity: 0.1;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .error-container {
    border: 2px solid currentColor;
  }

  button {
    border-width: 2px;
    font-weight: bold;
  }
}
</style>
