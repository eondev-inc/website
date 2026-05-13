/**
 * Composable para manejo de accesibilidad
 * Proporciona utilidades para mejorar la accesibilidad de la aplicación
 *
 * @module use-accessibility
 */

import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Composable para gestionar el foco y la navegación por teclado
 */
export function useFocusTrap() {
  const trapElement = ref<HTMLElement | null>(null)
  const previouslyFocusedElement = ref<HTMLElement | null>(null)

  /**
   * Obtiene todos los elementos focuseables dentro de un contenedor
   */
  const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(',')

    return Array.from(container.querySelectorAll(focusableSelectors))
  }

  /**
   * Maneja la navegación por teclado dentro del trap
   */
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Tab' || !trapElement.value) return

    const focusableElements = getFocusableElements(trapElement.value)
    if (focusableElements.length === 0) return

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    // Si es Shift + Tab y estamos en el primer elemento, ir al último
    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault()
      lastElement.focus()
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      // Si es Tab y estamos en el último elemento, ir al primero
      event.preventDefault()
      firstElement.focus()
    }
  }

  /**
   * Activa el focus trap en un elemento
   */
  const activateTrap = (element: HTMLElement) => {
    trapElement.value = element
    previouslyFocusedElement.value = document.activeElement as HTMLElement

    // Enfocar el primer elemento focuseable
    const focusableElements = getFocusableElements(element)
    if (focusableElements.length > 0) {
      focusableElements[0].focus()
    }

    document.addEventListener('keydown', handleKeyDown)
  }

  /**
   * Desactiva el focus trap
   */
  const deactivateTrap = () => {
    document.removeEventListener('keydown', handleKeyDown)

    // Restaurar el foco al elemento anterior
    if (previouslyFocusedElement.value) {
      previouslyFocusedElement.value.focus()
    }

    trapElement.value = null
    previouslyFocusedElement.value = null
  }

  onUnmounted(() => {
    deactivateTrap()
  })

  return {
    activateTrap,
    deactivateTrap
  }
}

/**
 * Composable para anunciar mensajes a lectores de pantalla
 */
export function useScreenReaderAnnounce() {
  const announcer = ref<HTMLElement | null>(null)

  onMounted(() => {
    // Crear elemento de anuncio si no existe
    if (document.getElementById('screen-reader-announcer')) {
      announcer.value = document.getElementById('screen-reader-announcer')
    } else {
      const element = document.createElement('div')
      element.id = 'screen-reader-announcer'
      element.setAttribute('role', 'status')
      element.setAttribute('aria-live', 'polite')
      element.setAttribute('aria-atomic', 'true')
      element.className = 'sr-only'
      element.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
      `
      document.body.appendChild(element)
      announcer.value = element
    }
  })

  /**
   * Anuncia un mensaje a los lectores de pantalla
   */
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!announcer.value) return

    announcer.value.setAttribute('aria-live', priority)
    announcer.value.textContent = message

    // Limpiar después de 1 segundo
    setTimeout(() => {
      if (announcer.value) {
        announcer.value.textContent = ''
      }
    }, 1000)
  }

  return {
    announce
  }
}

/**
 * Composable para manejo de navegación por teclado
 */
export function useKeyboardNavigation() {
  /**
   * Maneja la navegación con flechas en una lista
   */
  const handleArrowNavigation = (
    event: KeyboardEvent,
    items: HTMLElement[],
    currentIndex: number,
    onIndexChange: (newIndex: number) => void
  ) => {
    let newIndex: number

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault()
        newIndex = (currentIndex + 1) % items.length
        break
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault()
        newIndex = currentIndex - 1 < 0 ? items.length - 1 : currentIndex - 1
        break
      case 'Home':
        event.preventDefault()
        newIndex = 0
        break
      case 'End':
        event.preventDefault()
        newIndex = items.length - 1
        break
      default:
        return
    }

    onIndexChange(newIndex)
    items[newIndex]?.focus()
  }

  return {
    handleArrowNavigation
  }
}

/**
 * Composable para skip links (saltar al contenido principal)
 */
export function useSkipLink() {
  /**
   * Salta al contenido principal
   */
  const skipToMain = () => {
    const mainContent = document.getElementById('main-content') ||
                       document.querySelector('main') ||
                       document.querySelector('[role="main"]')

    if (mainContent) {
      mainContent.setAttribute('tabindex', '-1')
      mainContent.focus()

      // Remover tabindex después de enfocar para mantener el flujo natural
      mainContent.addEventListener('blur', () => {
        mainContent.removeAttribute('tabindex')
      }, { once: true })
    }
  }

  return {
    skipToMain
  }
}

/**
 * Composable para gestionar títulos de página accesibles
 */
export function usePageTitle() {
  const setPageTitle = (title: string, siteName = 'Portfolio - Yerffrey Romero') => {
    document.title = `${title} | ${siteName}`

    // Anunciar cambio de página a lectores de pantalla
    const { announce } = useScreenReaderAnnounce()
    announce(`Navegaste a ${title}`, 'polite')
  }

  return {
    setPageTitle
  }
}
