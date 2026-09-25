/**
 * Utilidades para manejo de HTML
 * @module html-utils
 */

import DOMPurify from 'dompurify'
import { decode } from 'html-entities'

/**
 * Decodifica entidades HTML.
 * @param text - Texto con entidades HTML
 * @returns Texto decodificado
 */
export const decodeHtmlEntities = (text: string): string => {
  return decode(text)
}

/**
 * Limpia HTML y decodifica entidades, devolviendo texto plano seguro.
 *
 * Orden crítico: decodificar primero, luego quitar tags. El viejo orden
 * (quitar tags y después decodificar) reintroducía tags ejecutables a partir
 * de entidades como `&lt;img onerror=...&gt;`.
 */
export const cleanHtml = (html: string): string => {
  const decoded = decodeHtmlEntities(html)
  return decoded.replace(/<[^>]*>/g, '').trim()
}

/**
 * Sanitiza HTML enriquecido permitiendo solo tags básicos.
 * Usar para contenido que realmente necesite formato (excerpts).
 */
export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'a'],
    ALLOWED_ATTR: ['href']
  })
}
