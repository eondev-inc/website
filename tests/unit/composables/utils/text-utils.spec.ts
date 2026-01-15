import { truncate, estimateReadingTime } from '@/composables/utils/text-utils'

describe('text-utils', () => {
  describe('truncate', () => {
    it('should not truncate short strings', () => {
      const text = 'Short'
      expect(truncate(text, 10)).toBe('Short')
    })

    it('should truncate long strings', () => {
      const text = 'This is a very long string that needs truncation'
      const result = truncate(text, 20)
      expect(result.length).toBeLessThanOrEqual(23) // 20 + '...'
      expect(result).toContain('...')
    })

    it('should handle exact length', () => {
      const text = 'Exactly twenty chars'
      expect(truncate(text, 20)).toBe(text)
    })

    it('should handle empty strings', () => {
      expect(truncate('', 10)).toBe('')
    })

    it('should trim whitespace before adding ellipsis', () => {
      const text = 'This is a test string'
      const result = truncate(text, 10)
      expect(result).toBe('This is a...')
    })
  })

  describe('estimateReadingTime', () => {
    it('should calculate reading time correctly', () => {
      const content = 'word '.repeat(200) // 200 palabras = 1 minuto
      expect(estimateReadingTime(content)).toBe(1)
    })

    it('should round up partial minutes', () => {
      const content = 'word '.repeat(250) // 250 palabras = 1.25 minutos
      expect(estimateReadingTime(content)).toBe(2)
    })

    it('should handle HTML content', () => {
      const content = '<p>' + 'word '.repeat(200) + '</p>'
      expect(estimateReadingTime(content)).toBe(1)
    })

    it('should return minimum of 1 minute', () => {
      const content = 'Just a few words'
      expect(estimateReadingTime(content)).toBeGreaterThanOrEqual(1)
    })

    it('should handle empty content', () => {
      expect(estimateReadingTime('')).toBe(1)
    })

    it('should ignore HTML tags in word count', () => {
      const content = '<div><p>Test</p><p>Content</p></div>' // 2 palabras
      expect(estimateReadingTime(content)).toBe(1)
    })

    it('should calculate correct time for long content', () => {
      const content = 'word '.repeat(1000) // 1000 palabras = 5 minutos
      expect(estimateReadingTime(content)).toBe(5)
    })
  })
})
