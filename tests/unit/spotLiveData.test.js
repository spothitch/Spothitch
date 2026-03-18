/**
 * Unit tests for spotLiveData.js — mergeSpotData pure function
 *
 * All spots are community spots. Static data is always additive with
 * live validation data.
 */
import { describe, it, expect } from 'vitest'
import { mergeSpotData } from '../../src/services/spotLiveData.js'

const makeCommunitySpot = (overrides = {}) => ({
  id: 'user_123',
  source: 'user',
  testCount: 2,
  avgWaitTime: 10,
  rideResult: 'yes',
  ratings: { safety: 4, traffic: 3, accessibility: 5 },
  lastTested: '2026-03-01',
  comments: [
    { text: 'Community created spot', userName: 'Creator' },
  ],
  destinations: [{ city: 'Lyon' }],
  ...overrides,
})

const makeValidation = (overrides = {}) => ({
  type: 'test',
  waitTime: 20,
  method: 'thumb',
  groupSize: 'solo',
  timeOfDay: 'morning',
  rideResult: 'yes',
  ratings: { safety: 4, traffic: 5, accessibility: 4 },
  comment: 'Easy ride, recommended!',
  userName: 'Bob',
  date: '2026-03-10T10:00:00Z',
  directionCity: 'Lyon',
  ...overrides,
})

describe('mergeSpotData', () => {
  it('returns spot with _liveLoaded when no validations', () => {
    const spot = makeCommunitySpot()
    const result = mergeSpotData(spot, [])
    expect(result._liveLoaded).toBe(true)
    expect(result.liveTestCount).toBe(0)
  })

  // ─── COMMUNITY SPOTS ────────────────────────────────────────

  describe('Community spot with validations → additive merge', () => {
    it('adds to existing testCount', () => {
      const spot = makeCommunitySpot({ testCount: 2 })
      const validations = [makeValidation({ type: 'test' }), makeValidation({ type: 'test' })]
      const result = mergeSpotData(spot, validations)
      expect(result.liveTestCount).toBe(4)
    })

    it('includes static avgWaitTime in average', () => {
      const spot = makeCommunitySpot({ avgWaitTime: 10 })
      const validations = [makeValidation({ waitTime: 30 })]
      const result = mergeSpotData(spot, validations)
      // (10 + 30) / 2 = 20
      expect(result.liveAvgWaitTime).toBe(20)
    })

    it('includes static rideResult in success rate', () => {
      const spot = makeCommunitySpot({ rideResult: 'yes' })
      const validations = [makeValidation({ rideResult: 'no' })]
      const result = mergeSpotData(spot, validations)
      // 1 yes (static) + 1 no (community) = 50%
      expect(result.liveSuccessRate).toBe(50)
    })

    it('includes static ratings in average', () => {
      const spot = makeCommunitySpot({ ratings: { safety: 2, traffic: 2, accessibility: 2 } })
      const validations = [makeValidation({ ratings: { safety: 4, traffic: 4, accessibility: 4 } })]
      const result = mergeSpotData(spot, validations)
      // (2 + 4) / 2 = 3
      expect(result.liveRatings.safety).toBe(3)
    })

    it('keeps community spot comments alongside new ones', () => {
      const spot = makeCommunitySpot({
        comments: [{ text: 'Original creator comment' }],
      })
      const validations = [makeValidation({ comment: 'New validation comment', userName: 'Bob' })]
      const result = mergeSpotData(spot, validations)
      expect(result.liveComments).toHaveLength(2)
      expect(result.liveComments[0].text).toBe('New validation comment')
      expect(result.liveComments[1].userName).toBe('SpotHitch') // default fallback label for static
    })

    it('does NOT change source for community spots', () => {
      const spot = makeCommunitySpot()
      const validations = [makeValidation()]
      const result = mergeSpotData(spot, validations)
      expect(result.source).toBe('user')
    })
  })

  // ─── SHARED BEHAVIOR ────────────────────────────────────────

  it('aggregates live destinations with counts', () => {
    const spot = makeCommunitySpot()
    const validations = [
      makeValidation({ directionCity: 'Lyon' }),
      makeValidation({ directionCity: 'Lyon' }),
      makeValidation({ directionCity: 'Marseille' }),
    ]
    const result = mergeSpotData(spot, validations)
    expect(result.liveDestinations).toHaveLength(2)
    expect(result.liveDestinations[0]).toEqual({ city: 'Lyon', count: 2 })
    expect(result.liveDestinations[1]).toEqual({ city: 'Marseille', count: 1 })
  })

  it('uses latest validation date as liveLastTested', () => {
    const spot = makeCommunitySpot({ lastTested: '2025-01-01' })
    const validations = [
      makeValidation({ date: '2026-03-10T10:00:00Z' }),
      makeValidation({ date: '2026-02-15T10:00:00Z' }),
    ]
    const result = mergeSpotData(spot, validations)
    expect(result.liveLastTested).toBe('2026-03-10T10:00:00Z')
  })

  it('returns null liveSuccessRate when no rideResult data', () => {
    const spot = makeCommunitySpot({ rideResult: null })
    const validations = [makeValidation({ rideResult: null })]
    const result = mergeSpotData(spot, validations)
    expect(result.liveSuccessRate).toBeNull()
  })
})
