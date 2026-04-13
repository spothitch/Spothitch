import { describe, it, expect, beforeEach } from 'vitest'
import { recordAgeVerification, getConsentHistory, clearConsentHistory } from '../../src/services/consentHistory.js'

describe('ConsentHistory Service', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('recordAgeVerification stores entry', () => {
    const result = recordAgeVerification({ birthDate: '2000-01-01', age: 26, isValid: true })
    expect(result).toBe(true)
  })

  it('getConsentHistory returns array', () => {
    const history = getConsentHistory()
    expect(Array.isArray(history)).toBe(true)
  })

  it('clearConsentHistory empties history', () => {
    recordAgeVerification({ birthDate: '2000-01-01', age: 26, isValid: true })
    clearConsentHistory()
    const history = getConsentHistory()
    expect(history.length).toBe(0)
  })

  it('consent entries have required fields', () => {
    recordAgeVerification({ birthDate: '2000-01-01', age: 26, isValid: true })
    const history = getConsentHistory()
    expect(history.length).toBeGreaterThan(0)
    const entry = history[0]
    expect(entry).toHaveProperty('id')
    expect(entry).toHaveProperty('timestamp')
    expect(entry).toHaveProperty('type')
  })
})
