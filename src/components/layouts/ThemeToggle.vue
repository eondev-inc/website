<template>
  <div class="theme-toggle-container">
    <!-- Botón principal de toggle -->
    <button
      v-if="!showDropdown"
      @click="simpleToggle ? toggleTheme() : (showDropdown = true)"
      :title="getTooltipText()"
      :aria-label="getAriaLabel()"
      class="theme-toggle-button"
      :class="[
        'relative inline-flex items-center justify-center',
        'w-10 h-10 rounded-full transition-all duration-300',
        'border border-neutral-200 dark:border-neutral-600',
        'bg-white dark:bg-neutral-800',
        'hover:bg-neutral-50 dark:hover:bg-neutral-700',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        'dark:focus:ring-offset-neutral-900',
        'shadow-sm hover:shadow-md',
        'transform hover:scale-105 active:scale-95'
      ]"
    >
      <!-- Ícono animado -->
      <div class="relative w-5 h-5 overflow-hidden">
        <transition
          name="theme-icon"
          mode="out-in"
        >
          <component
            :is="getCurrentIcon().component"
            :key="resolvedTheme"
            :class="[
              'absolute inset-0 w-5 h-5 transition-all duration-300',
              getCurrentIcon().class
            ]"
          />
        </transition>
      </div>

      <!-- Indicador de sistema (pequeño punto) -->
      <div
        v-if="isSystemMode"
        class="absolute -top-1 -right-1 w-2 h-2 bg-primary-500 rounded-full border border-white dark:border-neutral-800"
        title="Siguiendo preferencia del sistema"
      />
    </button>

    <!-- Dropdown para múltiples opciones -->
    <div
      v-if="!simpleToggle && showDropdown"
      v-click-outside="() => showDropdown = false"
      class="theme-dropdown"
      :class="[
        'absolute right-0 mt-2 w-48 py-2 z-50',
        'bg-white dark:bg-neutral-800',
        'border border-neutral-200 dark:border-neutral-600',
        'rounded-lg shadow-lg',
        'animate-scale-in origin-top-right'
      ]"
    >
      <!-- Opción Light -->
      <button
        @click="selectTheme('light')"
        class="theme-option"
        :class="[
          'w-full px-4 py-2 text-left flex items-center space-x-3',
          'text-sm text-neutral-700 dark:text-neutral-200',
          'hover:bg-neutral-50 dark:hover:bg-neutral-700',
          'transition-colors duration-200',
          theme === 'light' ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' : ''
        ]"
      >
        <SunIcon class="w-4 h-4 text-amber-500" />
        <span>Modo claro</span>
        <CheckIcon
          v-if="theme === 'light'"
          class="w-4 h-4 ml-auto text-primary-600"
        />
      </button>

      <!-- Opción Dark -->
      <button
        @click="selectTheme('dark')"
        class="theme-option"
        :class="[
          'w-full px-4 py-2 text-left flex items-center space-x-3',
          'text-sm text-neutral-700 dark:text-neutral-200',
          'hover:bg-neutral-50 dark:hover:bg-neutral-700',
          'transition-colors duration-200',
          theme === 'dark' ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' : ''
        ]"
      >
        <MoonIcon class="w-4 h-4 text-indigo-500" />
        <span>Modo oscuro</span>
        <CheckIcon
          v-if="theme === 'dark'"
          class="w-4 h-4 ml-auto text-primary-600"
        />
      </button>

      <!-- Opción System -->
      <button
        @click="selectTheme('system')"
        class="theme-option"
        :class="[
          'w-full px-4 py-2 text-left flex items-center space-x-3',
          'text-sm text-neutral-700 dark:text-neutral-200',
          'hover:bg-neutral-50 dark:hover:bg-neutral-700',
          'transition-colors duration-200',
          theme === 'system' ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' : ''
        ]"
      >
        <ComputerDesktopIcon class="w-4 h-4 text-neutral-500" />
        <span>Sistema</span>
        <CheckIcon
          v-if="theme === 'system'"
          class="w-4 h-4 ml-auto text-primary-600"
        />
      </button>

      <!-- Divider -->
      <div class="my-2 border-t border-neutral-200 dark:border-neutral-600" />

      <!-- Info del sistema -->
      <div class="px-4 py-2">
        <p class="text-xs text-neutral-500 dark:text-neutral-400">
          Sistema: {{ systemPrefersDark ? 'Oscuro' : 'Claro' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import useTheme from '@/composables/use-theme.composable'

// Iconos SVG como componentes
const SunIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636a9 9 0 011.591-1.591z" />
    </svg>
  `
}

const MoonIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
    </svg>
  `
}

const ComputerDesktopIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" />
    </svg>
  `
}

const CheckIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  `
}

export default defineComponent({
  name: 'ThemeToggle',
  components: {
    SunIcon,
    MoonIcon,
    ComputerDesktopIcon,
    CheckIcon
  },
  props: {
    /**
     * Si es true, solo alterna entre light/dark. Si es false, muestra dropdown con todas las opciones
     */
    simpleToggle: {
      type: Boolean,
      default: false
    },
    /**
     * Tamaño del componente
     */
    size: {
      type: String,
      default: 'md',
      validator: (value: string) => ['sm', 'md', 'lg'].includes(value)
    }
  },
  setup(props) {
    const {
      theme,
      resolvedTheme,
      isDarkMode,
      isSystemMode,
      systemPrefersDark,
      setTheme,
      toggleTheme,
      getThemeLabel
    } = useTheme()

    const showDropdown = ref(false)

    // === COMPUTED ===

    /**
     * Obtiene el ícono actual basado en el tema resuelto
     */
    const getCurrentIcon = () => {
      switch (resolvedTheme.value) {
        case 'light':
          return {
            component: SunIcon,
            class: 'text-amber-500'
          }
        case 'dark':
          return {
            component: MoonIcon,
            class: 'text-indigo-400'
          }
        default:
          return {
            component: ComputerDesktopIcon,
            class: 'text-neutral-500'
          }
      }
    }

    /**
     * Texto del tooltip
     */
    const getTooltipText = () => {
      if (props.simpleToggle) {
        return `Cambiar a modo ${isDarkMode.value ? 'claro' : 'oscuro'}`
      }
      return `Tema actual: ${getThemeLabel()}`
    }

    /**
     * Etiqueta ARIA para accesibilidad
     */
    const getAriaLabel = () => {
      return `Cambiar tema. Tema actual: ${getThemeLabel()}`
    }

    // === MÉTODOS ===

    /**
     * Selecciona un tema específico y cierra el dropdown
     */
    const selectTheme = (newTheme: 'light' | 'dark' | 'system') => {
      setTheme(newTheme)
      showDropdown.value = false
    }

    // === DIRECTIVAS ===

    /**
     * Directiva v-click-outside personalizada
     */
    const vClickOutside = {
      beforeMount(el: any, binding: any) {
        el.clickOutsideEvent = (event: Event) => {
          if (!(el === event.target || el.contains(event.target as Node))) {
            binding.value()
          }
        }
        document.addEventListener('click', el.clickOutsideEvent)
      },
      unmounted(el: any) {
        document.removeEventListener('click', el.clickOutsideEvent)
      }
    }

    return {
      // Estado
      theme,
      resolvedTheme,
      isDarkMode,
      isSystemMode,
      systemPrefersDark,
      showDropdown,

      // Métodos
      toggleTheme,
      selectTheme,
      getCurrentIcon,
      getTooltipText,
      getAriaLabel,

      // Directivas
      vClickOutside
    }
  }
})
</script>

<style scoped>
/* Animaciones personalizadas */
.theme-toggle-container {
  @apply relative;
}

/* Animaciones de entrada/salida de iconos */
.theme-icon-enter-active,
.theme-icon-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.theme-icon-enter-from {
  opacity: 0;
  transform: rotate(-90deg) scale(0.8);
}

.theme-icon-leave-to {
  opacity: 0;
  transform: rotate(90deg) scale(0.8);
}

/* Animación de aparición del dropdown */
@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-scale-in {
  animation: scale-in 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Mejoras de accesibilidad */
@media (prefers-reduced-motion: reduce) {
  .theme-toggle-button,
  .theme-icon-enter-active,
  .theme-icon-leave-active,
  .animate-scale-in {
    transition: none;
    animation: none;
  }
}

/* Estados de focus mejorados */
.theme-toggle-button:focus-visible {
  @apply ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-neutral-900;
}

.theme-option:focus-visible {
  @apply bg-primary-50 dark:bg-primary-900/20 outline-none;
}

/* Cursor pointer para elementos interactivos */
.theme-toggle-button,
.theme-option {
  cursor: pointer;
}

/* Mejoras para high contrast mode */
@media (prefers-contrast: high) {
  .theme-toggle-button {
    @apply border-2 border-neutral-800 dark:border-neutral-200;
  }

  .theme-dropdown {
    @apply border-2 border-neutral-800 dark:border-neutral-200;
  }
}
</style>
