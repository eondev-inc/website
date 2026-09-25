import { isAllowedExternalUrl, safeExternalUrl } from '@/composables/utils/url-utils'

describe('url-utils', () => {
  describe('isAllowedExternalUrl', () => {
    it('accepts https URLs in the default allowlist', () => {
      expect(isAllowedExternalUrl('https://techcrunch.com/some-post')).toBe(true)
    })

    it('rejects http URLs', () => {
      expect(isAllowedExternalUrl('http://techcrunch.com/some-post')).toBe(false)
    })

    it('rejects javascript: URLs', () => {
      expect(isAllowedExternalUrl('javascript:alert(1)')).toBe(false)
    })

    it('rejects URLs outside the allowlist', () => {
      expect(isAllowedExternalUrl('https://evil.com/phishing')).toBe(false)
    })

    it('rejects malformed URLs', () => {
      expect(isAllowedExternalUrl('not a url')).toBe(false)
    })

    it('respects a custom allowlist', () => {
      expect(isAllowedExternalUrl('https://github.com/user', ['https://github.com'])).toBe(true)
      expect(isAllowedExternalUrl('https://techcrunch.com/', ['https://github.com'])).toBe(false)
    })
  })

  describe('safeExternalUrl', () => {
    it('returns the URL when it is allowed', () => {
      const url = 'https://techcrunch.com/some-post'
      expect(safeExternalUrl(url)).toBe(url)
    })

    it('returns # when the URL is not allowed', () => {
      expect(safeExternalUrl('javascript:alert(1)')).toBe('#')
      expect(safeExternalUrl('https://evil.com')).toBe('#')
    })
  })
})
