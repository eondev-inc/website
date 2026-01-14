/**
 * Utilidades para manejo de cache en localStorage
 * @module cache-utils
 */

export interface CacheEntry<T> {
  data: T
  timestamp: number
}

/**
 * Obtiene datos del cache si están vigentes
 * @param key - Clave del cache
 * @param duration - Duración del cache en milisegundos
 * @returns Datos del cache o null si no son válidos
 */
export const getCacheData = <T>(key: string, duration: number): T | null => {
  try {
    const cached = localStorage.getItem(key)
    if (!cached) return null

    const { data, timestamp } = JSON.parse(cached) as CacheEntry<T>
    if (Date.now() - timestamp > duration) {
      localStorage.removeItem(key)
      return null
    }

    return data
  } catch {
    return null
  }
}

/**
 * Guarda datos en el cache
 * @param key - Clave del cache
 * @param data - Datos a guardar
 */
export const setCacheData = <T>(key: string, data: T): void => {
  try {
    const cacheEntry: CacheEntry<T> = {
      data,
      timestamp: Date.now()
    }
    localStorage.setItem(key, JSON.stringify(cacheEntry))
  } catch (err) {
    console.warn('Error guardando en cache:', err)
  }
}

/**
 * Limpia una entrada específica del cache
 * @param key - Clave del cache a limpiar
 */
export const clearCache = (key: string): void => {
  try {
    localStorage.removeItem(key)
  } catch (err) {
    console.warn('Error limpiando cache:', err)
  }
}

/**
 * Limpia todas las entradas del cache que coincidan con un patrón
 * @param pattern - Patrón a buscar en las claves
 */
export const clearCacheByPattern = (pattern: string): void => {
  try {
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.includes(pattern)) {
        localStorage.removeItem(key)
      }
    })
  } catch (err) {
    console.warn('Error limpiando cache por patrón:', err)
  }
}
