const ALLOWED_ORIGINS = ['https://techcrunch.com']

const DEFAULT_BASE_URL = 'https://techcrunch.com/wp-json/wp/v2'

function isAllowedOrigin(url: string): boolean {
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== 'https:') return false
    return ALLOWED_ORIGINS.some((origin) => parsed.origin === origin)
  } catch {
    return false
  }
}

/**
 * Resuelve la URL base de la API.
 *
 * En Vite la variable se inyecta vía `define` en `vite.config.ts` como
 * `process.env.VITE_API_BASE_URL`, de modo que Jest (que corre en Node y no
 * conoce `import.meta.env`) pueda leerla con el mismo mecanismo.
 */
export function resolveApiBaseUrl(
  env: Record<string, string | undefined> = process.env
): string {
  const envUrl = env.VITE_API_BASE_URL
  if (envUrl && isAllowedOrigin(envUrl)) {
    return envUrl
  }
  return DEFAULT_BASE_URL
}

export const API_BASE_URL = resolveApiBaseUrl()

export function getApiUrl(path: string): string {
  return `${resolveApiBaseUrl()}${path}`
}
