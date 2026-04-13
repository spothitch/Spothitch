import { describe, it, expect } from 'vitest'
import { ADMIN_EMAILS } from '../../src/utils/constants.js'

describe('Constants', () => {
  it('ADMIN_EMAILS is an array', () => {
    expect(Array.isArray(ADMIN_EMAILS)).toBe(true)
  })

  it('ADMIN_EMAILS contains at least one email', () => {
    expect(ADMIN_EMAILS.length).toBeGreaterThan(0)
  })

  it('ADMIN_EMAILS entries are valid email format', () => {
    for (const email of ADMIN_EMAILS) {
      expect(email).toContain('@')
    }
  })
})
