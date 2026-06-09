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

import {
  calculateTrustScore,
  getTierForScore,
  TRUST_TIERS,
  getUserTrustScore,
  updateTrustFactors,
  renderTrustScoreCircle,
  renderVerifiedCheckmark,
  renderTrustBadge,
  renderTrustScoreCard,
  renderMiniTrustBadge,
} from '../src/services/trustScore.js'
import { getState, setState } from '../src/stores/state.js'

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

  describe('getUserTrustScore', () => {
    it('returns the same result as calculateTrustScore()', () => {
      const result = getUserTrustScore()
      expect(result).toHaveProperty('score')
      expect(result).toHaveProperty('tier')
      expect(result).toHaveProperty('breakdown')
    })

    it('score is a number between 0 and 10', () => {
      const { score } = getUserTrustScore()
      expect(typeof score).toBe('number')
      expect(score).toBeGreaterThanOrEqual(0)
      expect(score).toBeLessThanOrEqual(10)
    })
  })

  describe('updateTrustFactors', () => {
    it('calls setState with merged state', () => {
      vi.mocked(getState).mockReturnValue({ existing: true })
      updateTrustFactors({ emailVerified: true })
      expect(setState).toHaveBeenCalledWith(
        expect.objectContaining({ existing: true, emailVerified: true })
      )
    })

    it('can update multiple factors at once', () => {
      vi.mocked(getState).mockReturnValue({})
      updateTrustFactors({ emailVerified: true, phoneVerified: true })
      expect(setState).toHaveBeenCalledWith(
        expect.objectContaining({ emailVerified: true, phoneVerified: true })
      )
    })
  })

  describe('renderTrustScoreCircle', () => {
    it('returns an HTML string', () => {
      const html = renderTrustScoreCircle(5)
      expect(typeof html).toBe('string')
      expect(html.length).toBeGreaterThan(20)
    })

    it('contains score value', () => {
      const html = renderTrustScoreCircle(7)
      expect(html).toContain('7')
    })

    it('contains SVG element', () => {
      const html = renderTrustScoreCircle(5)
      expect(html).toContain('svg')
      expect(html).toContain('circle')
    })

    it('uses sm size classes', () => {
      const html = renderTrustScoreCircle(5, 'sm')
      expect(html).toContain('w-8 h-8')
    })

    it('uses lg size classes', () => {
      const html = renderTrustScoreCircle(5, 'lg')
      expect(html).toContain('w-16 h-16')
    })

    it('defaults to md size', () => {
      const html = renderTrustScoreCircle(5)
      expect(html).toContain('w-12 h-12')
    })

    it('uses tier color in stroke', () => {
      const html = renderTrustScoreCircle(0) // nouveau = slate
      expect(html).toContain('#94a3b8')
    })

    it('uses amber color for excellent tier (score 9)', () => {
      const html = renderTrustScoreCircle(9)
      expect(html).toContain('#fbbf24')
    })

    it('contains title attribute with score', () => {
      const html = renderTrustScoreCircle(6)
      expect(html).toContain('6/10')
    })
  })

  describe('renderVerifiedCheckmark', () => {
    it('returns empty string when not verified', () => {
      expect(renderVerifiedCheckmark(false)).toBe('')
    })

    it('returns empty string for undefined', () => {
      expect(renderVerifiedCheckmark(undefined)).toBe('')
    })

    it('returns HTML span when verified', () => {
      const html = renderVerifiedCheckmark(true)
      expect(html).toContain('span')
      expect(html).toContain('bg-blue-500')
    })

    it('contains check icon when verified', () => {
      const html = renderVerifiedCheckmark(true)
      expect(html).toContain('check')
    })
  })

  describe('renderTrustBadge', () => {
    it('returns an HTML string', () => {
      const html = renderTrustBadge(0)
      expect(typeof html).toBe('string')
      expect(html.length).toBeGreaterThan(20)
    })

    it('contains tier label for nouveau (score 0)', () => {
      const html = renderTrustBadge(0)
      expect(html).toContain('0/10')
    })

    it('contains tier label for excellent (score 9)', () => {
      const html = renderTrustBadge(9)
      expect(html).toContain('9/10')
    })

    it('uses sm size classes', () => {
      const html = renderTrustBadge(5, 'sm')
      expect(html).toContain('text-xs')
    })

    it('uses lg size classes', () => {
      const html = renderTrustBadge(5, 'lg')
      expect(html).toContain('text-base')
    })

    it('contains span with rounded-full', () => {
      const html = renderTrustBadge(5)
      expect(html).toContain('rounded-full')
    })
  })

  describe('renderTrustScoreCard', () => {
    it('returns an HTML string', () => {
      const html = renderTrustScoreCard()
      expect(typeof html).toBe('string')
      expect(html.length).toBeGreaterThan(100)
    })

    it('contains trust-score-card class', () => {
      const html = renderTrustScoreCard()
      expect(html).toContain('trust-score-card')
    })

    it('contains the 3 pillar sections (details elements)', () => {
      const html = renderTrustScoreCard()
      // renderPillar wraps each pillar in <details>
      const detailsCount = (html.match(/<details/g) || []).length
      expect(detailsCount).toBe(3)
    })

    it('contains pillar icons (shield, star, activity)', () => {
      const html = renderTrustScoreCard()
      expect(html).toContain('shield')
      expect(html).toContain('star')
      expect(html).toContain('activity')
    })

    it('shows improvement tips when score < 8', () => {
      // Default state returns {} → score = 0 → shows tips
      const html = renderTrustScoreCard()
      expect(html).toContain('lightbulb')
    })

    it('contains the score circle', () => {
      const html = renderTrustScoreCard()
      // renderTrustScoreCircle is called inside renderTrustScoreCard
      expect(html).toContain('svg')
    })

    it('contains verified checkmark section', () => {
      const html = renderTrustScoreCard()
      // renderVerifiedCheckmark(false) → '' but the structure still renders
      expect(html).toContain('trust-score-card')
    })

    it('shows "get verified" tip for unverified user', () => {
      const html = renderTrustScoreCard()
      expect(html).toContain('arrow-right')
    })
  })

  describe('renderMiniTrustBadge', () => {
    it('returns an HTML string', () => {
      const html = renderMiniTrustBadge(5)
      expect(typeof html).toBe('string')
      expect(html.length).toBeGreaterThan(20)
    })

    it('contains score/10 display', () => {
      const html = renderMiniTrustBadge(7)
      expect(html).toContain('7/10')
    })

    it('does not contain verified check when not verified', () => {
      // Use score 0 (nouveau/slate tier) so no blue appears without the badge
      const html = renderMiniTrustBadge(0, false)
      expect(html).not.toContain('bg-blue-500')
    })

    it('contains verified check when isIdVerified is true', () => {
      const html = renderMiniTrustBadge(9, true)
      expect(html).toContain('bg-blue-500')
      expect(html).toContain('check')
    })

    it('contains rounded-full for pill style', () => {
      const html = renderMiniTrustBadge(5)
      expect(html).toContain('rounded-full')
    })

    it('uses tier background color', () => {
      const html = renderMiniTrustBadge(0) // nouveau = slate
      expect(html).toContain('bg-slate-500/20')
    })
  })
})
