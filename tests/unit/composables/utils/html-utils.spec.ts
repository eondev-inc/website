import { decodeHtmlEntities, cleanHtml, sanitizeHtml } from '@/composables/utils/html-utils'

describe('html-utils', () => {
  describe('decodeHtmlEntities', () => {
    it('should decode common HTML entities', () => {
      expect(decodeHtmlEntities('&amp;')).toBe('&')
      expect(decodeHtmlEntities('&lt;')).toBe('<')
      expect(decodeHtmlEntities('&gt;')).toBe('>')
      expect(decodeHtmlEntities('&quot;')).toBe('"')
    })

    it('should decode multiple entities in a string', () => {
      const input = 'AT&amp;T &quot;Innovation&quot; &lt;2024&gt;'
      const expected = 'AT&T "Innovation" <2024>'
      expect(decodeHtmlEntities(input)).toBe(expected)
    })

    it('should handle strings without entities', () => {
      const input = 'Plain text'
      expect(decodeHtmlEntities(input)).toBe(input)
    })

    it('should decode special characters', () => {
      expect(decodeHtmlEntities('&copy;')).toBe('©')
      expect(decodeHtmlEntities('&reg;')).toBe('®')
      expect(decodeHtmlEntities('&trade;')).toBe('™')
    })

    it('should decode punctuation entities', () => {
      expect(decodeHtmlEntities('&hellip;')).toBe('…')
      expect(decodeHtmlEntities('&mdash;')).toBe('—')
      expect(decodeHtmlEntities('&ndash;')).toBe('–')
    })

    it('should handle empty strings', () => {
      expect(decodeHtmlEntities('')).toBe('')
    })

    it('should handle nested entities safely (no bypass)', () => {
      // &amp;#58; should not decode to ':' via regex bypass
      // html-entities decodes in a single pass: &amp; → &, but the resulting
      // &#58; is NOT re-decoded, so the output is '&#58;' — not ':'
      expect(decodeHtmlEntities('&amp;#58;')).toBe('&#58;')
    })

    it('should decode numeric entities correctly', () => {
      expect(decodeHtmlEntities('&#58;')).toBe(':')
      expect(decodeHtmlEntities('&#60;')).toBe('<')
      expect(decodeHtmlEntities('&#62;')).toBe('>')
    })
  })

  describe('cleanHtml', () => {
    it('should remove HTML tags', () => {
      const html = '<p>Hello <strong>world</strong></p>'
      expect(cleanHtml(html)).toBe('Hello world')
    })

    it('should remove tags and decode entities', () => {
      const html = '<p>AT&amp;T &quot;Company&quot;</p>'
      expect(cleanHtml(html)).toBe('AT&T "Company"')
    })

    it('should handle empty strings', () => {
      expect(cleanHtml('')).toBe('')
    })

    it('should handle nested tags', () => {
      const html = '<div><p>Text <span>nested</span></p></div>'
      expect(cleanHtml(html)).toBe('Text nested')
    })

    it('should trim whitespace', () => {
      const html = '  <p>  Test  </p>  '
      expect(cleanHtml(html)).toBe('Test')
    })

    it('should handle complex HTML with entities', () => {
      const html = '<div class="content"><h1>Title &amp; Subtitle</h1><p>Content &lt;test&gt;</p></div>'
      // Entity-encoded tags are decoded first and then stripped, so <test> disappears.
      expect(cleanHtml(html)).toBe('Title & SubtitleContent')
    })

    it('should remove script tags and event handlers', () => {
      expect(cleanHtml('<script>alert(1)</script>')).toBe('alert(1)')
      expect(cleanHtml('<img src=x onerror=alert(1)>')).toBe('')
      expect(cleanHtml('<p onclick="alert(1)">text</p>')).toBe('text')
    })

    it('should not reintroduce tags via entity-encoded payloads', () => {
      // This is the bypass that the old strip-then-decode implementation had.
      const payload = '&lt;img src=x onerror=alert(1)&gt;'
      const result = cleanHtml(payload)
      expect(result).not.toContain('<img')
      expect(result).not.toContain('onerror')
      expect(result).not.toContain('javascript:')
    })
  })

  describe('sanitizeHtml', () => {
    it('should keep allowed tags and strip dangerous ones', () => {
      const html = '<p>Hello <strong>world</strong> <script>alert(1)</script></p>'
      expect(sanitizeHtml(html)).toBe('<p>Hello <strong>world</strong> </p>')
    })

    it('should keep links but strip event handlers', () => {
      const html = '<a href="https://example.com" onclick="alert(1)">link</a>'
      expect(sanitizeHtml(html)).toBe('<a href="https://example.com">link</a>')
    })

    it('should reject javascript: URLs in anchors', () => {
      const html = '<a href="javascript:alert(1)">link</a>'
      expect(sanitizeHtml(html)).toBe('<a>link</a>')
    })

    it('should handle empty strings', () => {
      expect(sanitizeHtml('')).toBe('')
    })
  })
})
