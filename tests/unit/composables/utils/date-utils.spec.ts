import { formatDate, formatDateShort } from '@/composables/utils/date-utils'

describe('date-utils', () => {
  describe('formatDate', () => {
    it('should format a valid date', () => {
      const date = '2024-01-15T10:00:00.000Z'
      const formatted = formatDate(date, 'en-US')
      expect(formatted).toContain('January')
      expect(formatted).toContain('15')
      expect(formatted).toContain('2024')
    })

    it('should use default locale (es-ES)', () => {
      const date = '2024-01-15T10:00:00.000Z'
      const formatted = formatDate(date)
      expect(formatted).toContain('enero')
      expect(formatted).toContain('15')
      expect(formatted).toContain('2024')
    })

    it('should handle invalid dates', () => {
      const result = formatDate('invalid-date')
      // Different environments may return different strings
      expect(result === 'Fecha inválida' || result === 'Invalid Date').toBe(true)
    })

    it('should handle empty strings', () => {
      const result = formatDate('')
      expect(result === 'Fecha inválida' || result === 'Invalid Date').toBe(true)
    })

    it('should format different date formats', () => {
      const date1 = '2024-12-25'
      const formatted1 = formatDate(date1, 'en-US')
      expect(formatted1).toContain('December')
      expect(formatted1).toContain('25')
    })
  })

  describe('formatDateShort', () => {
    it('should format a valid date in short format', () => {
      const date = '2024-01-15T10:00:00.000Z'
      const formatted = formatDateShort(date, 'en-US')
      expect(formatted).toContain('Jan')
      expect(formatted).toContain('15')
      expect(formatted).toContain('2024')
    })

    it('should use default locale (es-ES)', () => {
      const date = '2024-01-15T10:00:00.000Z'
      const formatted = formatDateShort(date)
      expect(formatted).toContain('ene')
      expect(formatted).toContain('15')
      expect(formatted).toContain('2024')
    })

    it('should handle invalid dates', () => {
      const result = formatDateShort('invalid-date')
      expect(result === 'Fecha inválida' || result === 'Invalid Date').toBe(true)
    })

    it('should be shorter than long format', () => {
      const date = '2024-01-15T10:00:00.000Z'
      const long = formatDate(date)
      const short = formatDateShort(date)
      expect(short.length).toBeLessThan(long.length)
    })
  })
})
