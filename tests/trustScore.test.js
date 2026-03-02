/**
 * Trust Score v2 Tests — Score /10, 3 pillars
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock dependencies
vi.mock('../src/stores/state.js', () => ({
  getState: vi.fn(() => ({})),
  setState: vi.fn(),
}))
vi.mock('../src/i18n/index.js', () => ({
  t: vi.fn((key) => key),
}))
vi.mock('../src/utils/icons.js', () => ({
  icon: vi.fn((name) => `<svg>${name}</svg>`),
}))

import { calculateTrustScore, getTierForScore, TRUST_TIERS } from '../src/services/trustScore.js'
import { getState } from '../src/stores/state.js'

describe('Trust Score v2 (/10)', () => {
  beforeEach(() => {
    vi.mocked(getState).mockReturnValue({})
    // Mock localStorage
    const storage = {}
    vi.stubGlobal('localStorage', {
      getItem: vi.fn((key) => storage[key] || null),
      setItem: vi.fn((key, val) => { storage[key] = val }),
    })
  })

  it('returns 0 for a brand new user', () => {
    const result = calculateTrustScore({
      emailVerified: false,
      phoneVerified: false,
      hasProfilePhoto: false,
      idVerified: false,
      positiveReviews: 0,
      spotsValidated: 0,
      accountAge: 0,
      reportCount: 0,
      spotsTested: 0,
      activeMonths: 0,
    })
    expect(result.score).toBe(0)
    expect(result.isIdVerified).toBe(false)
  })

  it('gives 0.5 for email verified only', () => {
    const result = calculateTrustScore({
      emailVerified: true,
      phoneVerified: false,
      hasProfilePhoto: false,
      idVerified: false,
      positiveReviews: 0,
      spotsValidated: 0,
      accountAge: 0,
      reportCount: 0,
      spotsTested: 0,
      activeMonths: 0,
    })
    expect(result.score).toBe(0.5)
    expect(result.breakdown.identity.details.email).toBe(0.5)
  })

  it('caps at 7 without paid ID', () => {
    const result = calculateTrustScore({
      emailVerified: true,
      phoneVerified: true,
      hasProfilePhoto: true,
      idVerified: false,
      positiveReviews: 50,
      spotsValidated: 20,
      accountAge: 365,
      reportCount: 0,
      spotsTested: 50,
      activeMonths: 12,
    })
    expect(result.score).toBe(7)
    expect(result.isIdVerified).toBe(false)
  })

  it('gives 10 with everything verified + paid ID', () => {
    const result = calculateTrustScore({
      emailVerified: true,
      phoneVerified: true,
      hasProfilePhoto: true,
      idVerified: true,
      positiveReviews: 50,
      spotsValidated: 20,
      accountAge: 365,
      reportCount: 0,
      spotsTested: 50,
      activeMonths: 12,
    })
    expect(result.score).toBe(10)
    expect(result.isIdVerified).toBe(true)
  })

  it('identity pillar maxes at 5', () => {
    const result = calculateTrustScore({
      emailVerified: true,
      phoneVerified: true,
      hasProfilePhoto: true,
      idVerified: true,
      positiveReviews: 0,
      spotsValidated: 0,
      accountAge: 0,
      reportCount: 0,
      spotsTested: 0,
      activeMonths: 0,
    })
    expect(result.breakdown.identity.total).toBe(5)
    expect(result.breakdown.identity.max).toBe(5)
  })

  it('reputation pillar maxes at 3', () => {
    const result = calculateTrustScore({
      emailVerified: false,
      phoneVerified: false,
      hasProfilePhoto: false,
      idVerified: false,
      positiveReviews: 50,
      spotsValidated: 20,
      accountAge: 365,
      reportCount: 0,
      spotsTested: 0,
      activeMonths: 0,
    })
    expect(result.breakdown.reputation.total).toBe(3)
    expect(result.breakdown.reputation.max).toBe(3)
  })

  it('activity pillar maxes at 2', () => {
    const result = calculateTrustScore({
      emailVerified: false,
      phoneVerified: false,
      hasProfilePhoto: false,
      idVerified: false,
      positiveReviews: 0,
      spotsValidated: 0,
      accountAge: 0,
      reportCount: 0,
      spotsTested: 50,
      activeMonths: 12,
    })
    expect(result.breakdown.activity.total).toBe(2)
    expect(result.breakdown.activity.max).toBe(2)
  })

  it('seniority requires 6m+ AND zero reports', () => {
    // 6 months but HAS reports = no seniority point
    const withReports = calculateTrustScore({
      emailVerified: false,
      phoneVerified: false,
      hasProfilePhoto: false,
      idVerified: false,
      positiveReviews: 0,
      spotsValidated: 0,
      accountAge: 200,
      reportCount: 1,
      spotsTested: 0,
      activeMonths: 0,
    })
    expect(withReports.breakdown.reputation.details.seniority).toBe(0)

    // 6 months and zero reports = seniority point
    const clean = calculateTrustScore({
      emailVerified: false,
      phoneVerified: false,
      hasProfilePhoto: false,
      idVerified: false,
      positiveReviews: 0,
      spotsValidated: 0,
      accountAge: 200,
      reportCount: 0,
      spotsTested: 0,
      activeMonths: 0,
    })
    expect(clean.breakdown.reputation.details.seniority).toBe(1)
  })

  describe('getTierForScore', () => {
    it('0-3 = nouveau (slate)', () => {
      expect(getTierForScore(0).id).toBe('nouveau')
      expect(getTierForScore(1).id).toBe('nouveau')
      expect(getTierForScore(3).id).toBe('nouveau')
    })

    it('4-5 = progression (blue)', () => {
      expect(getTierForScore(4).id).toBe('progression')
      expect(getTierForScore(5).id).toBe('progression')
    })

    it('6-7 = fiable (emerald)', () => {
      expect(getTierForScore(6).id).toBe('fiable')
      expect(getTierForScore(7).id).toBe('fiable')
    })

    it('8-10 = excellent (amber)', () => {
      expect(getTierForScore(8).id).toBe('excellent')
      expect(getTierForScore(9).id).toBe('excellent')
      expect(getTierForScore(10).id).toBe('excellent')
    })
  })

  describe('isIdVerified flag', () => {
    it('false when no paid ID', () => {
      const result = calculateTrustScore({
        emailVerified: true,
        phoneVerified: true,
        hasProfilePhoto: true,
        idVerified: false,
        positiveReviews: 0,
        spotsValidated: 0,
        accountAge: 0,
        reportCount: 0,
        spotsTested: 0,
        activeMonths: 0,
      })
      expect(result.isIdVerified).toBe(false)
    })

    it('true when paid ID is verified', () => {
      const result = calculateTrustScore({
        emailVerified: true,
        phoneVerified: true,
        hasProfilePhoto: true,
        idVerified: true,
        positiveReviews: 0,
        spotsValidated: 0,
        accountAge: 0,
        reportCount: 0,
        spotsTested: 0,
        activeMonths: 0,
      })
      expect(result.isIdVerified).toBe(true)
    })
  })

  describe('breakdown structure', () => {
    it('has 3 pillars with correct max values', () => {
      const result = calculateTrustScore({})
      expect(result.breakdown.identity.max).toBe(5)
      expect(result.breakdown.reputation.max).toBe(3)
      expect(result.breakdown.activity.max).toBe(2)
    })

    it('identity breakdown has 4 details', () => {
      const result = calculateTrustScore({})
      const d = result.breakdown.identity.details
      expect(d).toHaveProperty('email')
      expect(d).toHaveProperty('phone')
      expect(d).toHaveProperty('photo')
      expect(d).toHaveProperty('id')
    })

    it('reputation breakdown has 3 details', () => {
      const result = calculateTrustScore({})
      const d = result.breakdown.reputation.details
      expect(d).toHaveProperty('reviews')
      expect(d).toHaveProperty('spots')
      expect(d).toHaveProperty('seniority')
    })

    it('activity breakdown has 2 details', () => {
      const result = calculateTrustScore({})
      const d = result.breakdown.activity.details
      expect(d).toHaveProperty('spotsTested')
      expect(d).toHaveProperty('regularity')
    })
  })
})
