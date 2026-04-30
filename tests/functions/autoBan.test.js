/**
 * Phase 5: Cloud Functions — auto-ban logic tests
 */
import { describe, it, expect } from 'vitest'

// Test the ban threshold logic (replicated from source)
const BAN_THRESHOLD = 5

function shouldBan(distinctReporterCount) {
  return distinctReporterCount >= BAN_THRESHOLD
}

describe('autoBan (Cloud Function logic)', () => {
  it('does not ban with 0 reports', () => {
    expect(shouldBan(0)).toBe(false)
  })

  it('does not ban with 4 reports', () => {
    expect(shouldBan(4)).toBe(false)
  })

  it('bans at exactly 5 reports', () => {
    expect(shouldBan(5)).toBe(true)
  })

  it('bans with more than 5 reports', () => {
    expect(shouldBan(10)).toBe(true)
  })

  it('BAN_THRESHOLD is 5', () => {
    expect(BAN_THRESHOLD).toBe(5)
  })
})
