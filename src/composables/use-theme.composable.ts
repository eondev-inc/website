/**
 * Theme Composable
 * Composable para el manejo del sistema de temas Dark/Light Mode
 * con persistencia, detección de preferencias del sistema y sincronización entre pestañas.
 *
 * @author Yerffrey Romero
 * @version 1.0
 * @since 2025-09-11
 */

import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

// === TIPOS ===
export type Theme = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

// === CONSTANTES ===
const THEME_STORAGE_KEY = 'theme-preference'
// const THEME_ATTRIBUTE = 'class' // Reservado para uso futuro

// === ESTADO GLOBAL ===
const theme = ref<Theme>('system')
const systemPrefersDark = ref(false)

/**
 * Composable principal para manejo de temas
 * @returns {Object} API del composable de temas
 */
export default function useTheme() {
  // === COMPUTED ===

  /**
   * Tema resuelto basado en la preferencia y el sistema
   */
  const resolvedTheme = computed<ResolvedTheme>(() => {
    if (theme.value === 'system') {
      return systemPrefersDark.value ? 'dark' : 'light'
    }
    return theme.value as ResolvedTheme
  })

  /**
   * Indica si está en modo oscuro
   */
  const isDarkMode = computed(() => resolvedTheme.value === 'dark')

  /**
   * Indica si está usando la preferencia del sistema
   */
  const isSystemMode = computed(() => theme.value === 'system')

  // === MÉTODOS PRIVADOS ===

  /**
   * Detecta la preferencia del sistema
   */
  const detectSystemPreference = (): boolean => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  }

  /**
   * Aplica el tema al DOM
   */
  const applyTheme = (newTheme: ResolvedTheme): void => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement

      if (newTheme === 'dark') {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }

      // Emitir evento personalizado para otros componentes
      const themeChangeEvent = new CustomEvent('theme-changed', {
        detail: { theme: newTheme }
      })
      document.dispatchEvent(themeChangeEvent)
    }
  }

  /**
   * Guarda la preferencia en localStorage
   */
  const saveThemePreference = (newTheme: Theme): void => {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(THEME_STORAGE_KEY, newTheme)
      } catch (error) {
        console.warn('No se pudo guardar la preferencia de tema:', error)
      }
    }
  }

  /**
   * Carga la preferencia desde localStorage
   */
  const loadThemePreference = (): Theme => {
    if (typeof localStorage !== 'undefined') {
      try {
        const saved = localStorage.getItem(THEME_STORAGE_KEY)
        if (saved && ['light', 'dark', 'system'].includes(saved)) {
          return saved as Theme
        }
      } catch (error) {
        console.warn('No se pudo cargar la preferencia de tema:', error)
      }
    }
    return 'system'
  }

  /**
   * Maneja el cambio en las preferencias del sistema
   */
  const handleSystemChange = (e: MediaQueryListEvent): void => {
    systemPrefersDark.value = e.matches
  }

  /**
   * Maneja el cambio de tema desde otra pestaña
   */
  const handleStorageChange = (e: StorageEvent): void => {
    if (e.key === THEME_STORAGE_KEY && e.newValue) {
      const newTheme = e.newValue as Theme
      if (['light', 'dark', 'system'].includes(newTheme)) {
        theme.value = newTheme
      }
    }
  }

  // === MÉTODOS PÚBLICOS ===

  /**
   * Establece el tema
   */
  const setTheme = (newTheme: Theme): void => {
    theme.value = newTheme
    saveThemePreference(newTheme)
  }

  /**
   * Alterna entre modo claro y oscuro
   * Si está en modo sistema, alterna al contrario del sistema
   */
  const toggleTheme = (): void => {
    if (theme.value === 'system') {
      // Si está en sistema, cambiar al opuesto del sistema
      const oppositeTheme = systemPrefersDark.value ? 'light' : 'dark'
      setTheme(oppositeTheme)
    } else if (theme.value === 'light') {
      setTheme('dark')
    } else {
      setTheme('light')
    }
  }

  /**
   * Resetea al modo sistema
   */
  const resetToSystem = (): void => {
    setTheme('system')
  }

  /**
   * Obtiene el ícono apropiado para el tema actual
   */
  const getThemeIcon = (): string => {
    switch (theme.value) {
      case 'light':
        return '☀️'
      case 'dark':
        return '🌙'
      case 'system':
        return '💻'
      default:
        return '💻'
    }
  }

  /**
   * Obtiene la etiqueta descriptiva del tema
   */
  const getThemeLabel = (): string => {
    switch (theme.value) {
      case 'light':
        return 'Modo claro'
      case 'dark':
        return 'Modo oscuro'
      case 'system':
        return 'Sistema'
      default:
        return 'Sistema'
    }
  }

  // === WATCHERS ===

  /**
   * Observa cambios en el tema resuelto y lo aplica
   */
  watch(resolvedTheme, (newTheme) => {
    applyTheme(newTheme)
  }, { immediate: true })

  // === LIFECYCLE ===

  /**
   * Inicialización del composable
   */
  onMounted(() => {
    if (typeof window !== 'undefined') {
      // Detectar preferencia del sistema
      systemPrefersDark.value = detectSystemPreference()

      // Cargar preferencia guardada
      theme.value = loadThemePreference()

      // Escuchar cambios en preferencias del sistema
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

      // Soporte para navegadores modernos e históricos
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleSystemChange)
      } else {
        // Fallback para navegadores antiguos
        mediaQuery.addListener(handleSystemChange)
      }

      // Escuchar cambios desde otras pestañas
      window.addEventListener('storage', handleStorageChange)

      // Aplicar tema inicial
      applyTheme(resolvedTheme.value)
    }
  })

  /**
   * Limpieza al desmontar
   */
  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleSystemChange)
      } else {
        // Fallback para navegadores antiguos
        mediaQuery.removeListener(handleSystemChange)
      }

      window.removeEventListener('storage', handleStorageChange)
    }
  })

  // === API PÚBLICA ===
  return {
    // Estado
    theme: readonly(theme),
    resolvedTheme,
    isDarkMode,
    isSystemMode,
    systemPrefersDark: readonly(systemPrefersDark),

    // Métodos
    setTheme,
    toggleTheme,
    resetToSystem,
    getThemeIcon,
    getThemeLabel
  }
}

/**
 * Helper para hacer readonly refs
 */
function readonly<T>(ref: import('vue').Ref<T>) {
  return computed(() => ref.value)
}
