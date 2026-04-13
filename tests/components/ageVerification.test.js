import { describe, it, expect } from 'vitest'
import { calculateAge, validateBirthDate } from '../../src/components/modals/AgeVerification.js'

describe('AgeVerification Component', () => {
  describe('calculateAge', () => {
    it('calculates correct age', () => {
      const year = new Date().getUTCFullYear()
      expect(calculateAge(`${year - 20}-01-01`)).toBe(20)
    })

    it('handles birthday not yet occurred this year', () => {
      const year = new Date().getUTCFullYear()
      expect(calculateAge(`${year - 20}-12-31`)).toBe(19)
    })

    it('handles exact birthday today', () => {
      const now = new Date()
      const y = now.getUTCFullYear() - 25
      const m = String(now.getUTCMonth() + 1).padStart(2, '0')
      const d = String(now.getUTCDate()).padStart(2, '0')
      expect(calculateAge(`${y}-${m}-${d}`)).toBe(25)
    })
  })

  describe('validateBirthDate', () => {
    it('rejects empty date', () => {
      const result = validateBirthDate('')
      expect(result.isValid).toBe(false)
    })

    it('rejects null', () => {
      const result = validateBirthDate(null)
      expect(result.isValid).toBe(false)
    })

    it('rejects under 16', () => {
      const year = new Date().getFullYear()
      const result = validateBirthDate(`${year - 10}-06-15`)
      expect(result.isValid).toBe(false)
      expect(result.tooYoung).toBe(true)
    })

    it('accepts 16+', () => {
      const year = new Date().getFullYear()
      const result = validateBirthDate(`${year - 20}-01-01`)
      expect(result.isValid).toBe(true)
      expect(result.age).toBeGreaterThanOrEqual(19)
      expect(result.age).toBeLessThanOrEqual(20)
    })

    it('rejects over 120', () => {
      const result = validateBirthDate('1890-01-01')
      expect(result.isValid).toBe(false)
    })
  })
})
