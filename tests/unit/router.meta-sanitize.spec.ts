import DOMPurify from 'dompurify'

// Helper function to decode HTML entities (used for test verification)
function decodeHtmlEntities(text: string): string {
  const entities: Record<string, string> = {
    '&lt;': '<',
    '&gt;': '>',
    '&amp;': '&',
    '&quot;': '"',
    '&#39;': "'"
  }
  return text.replace(/&[^;]+;/g, match => entities[match] || match)
}

describe('router meta sanitization', () => {
  describe('DOMPurify sanitization', () => {
    it('should sanitize script tags from meta description', () => {
      const maliciousInput = '<script>alert(1)</script>'
      const sanitized = DOMPurify.sanitize(maliciousInput)
      expect(sanitized).not.toContain('<script>')
      expect(sanitized).not.toContain('alert(1)')
    })

    it('should sanitize event handlers from meta description', () => {
      const maliciousInput = '<img src=x onerror=alert(1)>'
      const sanitized = DOMPurify.sanitize(maliciousInput)
      expect(sanitized).not.toContain('onerror')
    })

    it('should preserve valid HTML in meta description', () => {
      const validInput = 'Description with <strong>bold</strong> text'
      const sanitized = DOMPurify.sanitize(validInput)
      expect(sanitized).toContain('bold')
    })

    it('should handle XSS payload from decodeHtmlEntities', () => {
      // Simulating what happens when &lt;script&gt;alert(1)&lt;/script&gt; is decoded and then sanitized
      const decodedXss = decodeHtmlEntities('&lt;script&gt;alert(1)&lt;/script&gt;')
      expect(decodedXss).toBe('<script>alert(1)</script>')

      // After DOMPurify sanitization, the script tag should be removed
      const sanitized = DOMPurify.sanitize(decodedXss)
      expect(sanitized).not.toContain('<script>')
      expect(sanitized).not.toContain('alert')
    })

    it('should strip all HTML tags from meta description', () => {
      const htmlInput = '<p>Hello</p><script>evil()</script><img src=x onload=bad()>'
      const sanitized = DOMPurify.sanitize(htmlInput, { ALLOWED_TAGS: [] })
      expect(sanitized).not.toContain('<p>')
      expect(sanitized).not.toContain('<script>')
      expect(sanitized).not.toContain('<img>')
    })

    it('should handle empty string gracefully', () => {
      const sanitized = DOMPurify.sanitize('')
      expect(sanitized).toBe('')
    })

    it('should preserve plain text without HTML', () => {
      const plainText = 'Simple description without HTML'
      const sanitized = DOMPurify.sanitize(plainText)
      expect(sanitized).toBe('Simple description without HTML')
    })
  })

  describe('decodeHtmlEntities', () => {
    it('should decode HTML entities correctly', () => {
      expect(decodeHtmlEntities('&lt;')).toBe('<')
      expect(decodeHtmlEntities('&gt;')).toBe('>')
      expect(decodeHtmlEntities('&amp;')).toBe('&')
      expect(decodeHtmlEntities('&quot;')).toBe('"')
    })

    it('should handle mixed content with entities', () => {
      const input = 'Text &amp; more &lt;tag&gt;'
      const result = decodeHtmlEntities(input)
      expect(result).toBe('Text & more <tag>')
    })

    it('should return original string for unknown entities', () => {
      const input = '&unknown;'
      const result = decodeHtmlEntities(input)
      expect(result).toBe('&unknown;')
    })
  })
})
