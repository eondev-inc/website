import { resolveApiBaseUrl, getApiUrl, API_BASE_URL } from '@/config/api'

describe('api-config', () => {
  describe('resolveApiBaseUrl', () => {
    it('defaults to techcrunch when env is missing', () => {
      const result = resolveApiBaseUrl({})
      expect(result).toBe('https://techcrunch.com/wp-json/wp/v2')
    })

    it('accepts allowed origin https://techcrunch.com', () => {
      const result = resolveApiBaseUrl({
        VITE_API_BASE_URL: 'https://techcrunch.com/wp-json/wp/v2'
      })
      expect(result).toBe('https://techcrunch.com/wp-json/wp/v2')
    })

    it('rejects https://evil.com and falls back', () => {
      const result = resolveApiBaseUrl({
        VITE_API_BASE_URL: 'https://evil.com/wp-json/wp/v2'
      })
      expect(result).toBe('https://techcrunch.com/wp-json/wp/v2')
    })

    it('rejects http://techcrunch.com and falls back', () => {
      const result = resolveApiBaseUrl({
        VITE_API_BASE_URL: 'http://techcrunch.com/wp-json/wp/v2'
      })
      expect(result).toBe('https://techcrunch.com/wp-json/wp/v2')
    })

    it('rejects invalid URLs and falls back', () => {
      const result = resolveApiBaseUrl({
        VITE_API_BASE_URL: 'not-a-url'
      })
      expect(result).toBe('https://techcrunch.com/wp-json/wp/v2')
    })
  })

  describe('getApiUrl', () => {
    it('builds correct URL with path', () => {
      const result = getApiUrl('/posts?per_page=6')
      expect(result).toBe('https://techcrunch.com/wp-json/wp/v2/posts?per_page=6')
    })

    it('builds categories URL', () => {
      const result = getApiUrl('/categories?per_page=100')
      expect(result).toBe(
        'https://techcrunch.com/wp-json/wp/v2/categories?per_page=100'
      )
    })
  })

  describe('API_BASE_URL', () => {
    it('is the default fallback', () => {
      expect(API_BASE_URL).toBe('https://techcrunch.com/wp-json/wp/v2')
    })
  })
})
