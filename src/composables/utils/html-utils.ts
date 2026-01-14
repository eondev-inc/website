/**
 * Utilidades para manejo de HTML
 * @module html-utils
 */

export interface HtmlEntities {
  [key: string]: string
}

const htmlEntities: HtmlEntities = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&#039;': "'",
  '&nbsp;': ' ',
  '&copy;': '©',
  '&reg;': '®',
  '&trade;': '™',
  '&hellip;': '…',
  '&mdash;': '—',
  '&ndash;': '–',
  '&lsquo;': "'",
  '&rsquo;': "'",
  '&ldquo;': '"',
  '&rdquo;': '"'
}

/**
 * Decodifica entidades HTML
 * @param text - Texto con entidades HTML
 * @returns Texto decodificado
 */
export const decodeHtmlEntities = (text: string): string => {
  let decoded = text
  for (const [entity, char] of Object.entries(htmlEntities)) {
    decoded = decoded.replace(new RegExp(entity, 'g'), char)
  }
  return decoded
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
