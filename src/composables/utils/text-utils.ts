/**
 * Utilidades para manejo de texto
 * @module text-utils
 */

import { cleanHtml } from './html-utils'

const READING_WPM = 200 // Palabras por minuto promedio

/**
 * Trunca texto a una longitud específica
 * @param str - Texto a truncar
 * @param length - Longitud máxima
 * @returns Texto truncado con '...' al final si es necesario
 */
export const truncate = (str: string, length: number): string => {
  if (str.length <= length) return str
  return str.slice(0, length).trim() + '...'
}

/**
 * Estima el tiempo de lectura en minutos
 * @param content - Contenido del artículo (puede contener HTML)
 * @returns Tiempo estimado en minutos
 */
export const estimateReadingTime = (content: string): number => {
  const cleanContent = cleanHtml(content)
  const wordCount = cleanContent.split(/\s+/).filter(word => word.length > 0).length
  return Math.max(1, Math.ceil(wordCount / READING_WPM))
}
