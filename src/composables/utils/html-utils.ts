/**
 * Utilidades para manejo de HTML
 * @module html-utils
 */

import { decode } from 'html-entities'

/**
 * Decodifica entidades HTML
 * @param text - Texto con entidades HTML
 * @returns Texto decodificado
 */
export const decodeHtmlEntities = (text: string): string => {
  return decode(text, { scope: 'all' })
}

/**
 * Limpia HTML y decodifica entidades
 * @param html - HTML a limpiar
 * @returns Texto limpio sin tags HTML
 */
export const cleanHtml = (html: string): string => {
  const cleaned = html.replace(/<[^>]*>/g, '')
  return decodeHtmlEntities(cleaned).trim()
}
