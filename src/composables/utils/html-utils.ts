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
  return stripTags(decoded).trim()
}

/**
 * Removes every span from a "<" to the next ">" in a single linear pass.
 *
 * Equivalent to `text.replace(/<[^>]*>/g, '')`, but that regex backtracks
 * quadratically on input with many unmatched "<" (100k chars took ~18s), so
 * an index scan is used instead. A "<" with no later ">" is kept as text.
 */
const stripTags = (text: string): string => {
  let result = ''
  let cursor = 0

  while (cursor < text.length) {
    const open = text.indexOf('<', cursor)
    if (open === -1) break

    const close = text.indexOf('>', open + 1)
    if (close === -1) break

    result += text.slice(cursor, open)
    cursor = close + 1
  }

  return result + text.slice(cursor)
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
