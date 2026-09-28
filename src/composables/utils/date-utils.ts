/**
 * Utilidades para manejo de fechas
 * @module date-utils
 */

/**
 * Formatea una fecha para mostrar
 * @param dateString - Fecha en formato ISO
 * @param locale - Locale a usar (por defecto 'es-ES')
 * @returns Fecha formateada
 */
export const formatDate = (dateString: string, locale = 'es-ES'): string => {
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) {
    return 'Fecha inválida'
  }
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Formatea una fecha de forma corta
 * @param dateString - Fecha en formato ISO
 * @param locale - Locale a usar (por defecto 'es-ES')
 * @returns Fecha formateada corta
 */
export const formatDateShort = (dateString: string, locale = 'es-ES'): string => {
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) {
    return 'Fecha inválida'
  }
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
