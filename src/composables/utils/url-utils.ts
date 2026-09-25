const DEFAULT_ALLOWED_ORIGINS = ['https://techcrunch.com']

/**
 * Verifica que una URL externa sea segura: protocolo HTTPS y origen en la
 * lista blanca. Cualquier error de parsing también se trata como no segura.
 */
export function isAllowedExternalUrl(
  url: string,
  allowedOrigins: string[] = DEFAULT_ALLOWED_ORIGINS
): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' && allowedOrigins.includes(parsed.origin)
  } catch {
    return false
  }
}

/**
 * Devuelve la URL si es segura; de lo contrario devuelve '#' para evitar
 * enlaces `javascript:` o orígenes no esperados.
 */
export function safeExternalUrl(
  url: string,
  allowedOrigins?: string[]
): string {
  return isAllowedExternalUrl(url, allowedOrigins) ? url : '#'
}
