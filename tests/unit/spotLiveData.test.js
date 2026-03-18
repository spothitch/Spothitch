/**
 * Unit tests for spotLiveData.js — mergeSpotData pure function
 *
 * Key behavior: when a Hitchwiki spot (source: 'hitchwiki') gets at least 1
 * community validation, ALL Hitchwiki data is replaced by community data.
 */
import { describe, it, expect } from 'vitest'
import { mergeSpotData } from '../../src/services/spotLiveData.js'

const makeHitchwikiSpot = (overrides = {}) => ({
  id: 'hm_FR_42',
  source: 'hitchwiki',
  testCount: 5,
  avgWaitTime: 15,
  rideResult: 'yes',
  ratings: { safety: 3, traffic: 4, accessibility: 3 },
  lastTested: '2025-06-01',
  comments: [
    { text: 'Great spot near the highway', userName: 'Alice' },
    { text: 'Waited 10 min, got a ride to Paris', userName: '' },
  ],
  descriptionEn: 'Gas station spot. Great place.',
  descriptionFr: 'Spot station-service. Super endroit.',
  descriptionEs: 'Punto gasolinera. Buen lugar.',
  descriptionDe: 'Tankstelle. Toller Ort.',
  destinations: [{ city: 'Paris' }],
  ...overrides,
})

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
    const spot = makeHitchwikiSpot()
    const result = mergeSpotData(spot, [])
    expect(result._liveLoaded).toBe(true)
    expect(result.liveTestCount).toBe(0)
  })

  // ─── HITCHWIKI REPLACEMENT ───────────────────────────────────

  describe('Hitchwiki spot with community validation → replaces all Hitchwiki data', () => {
    it('ignores Hitchwiki testCount', () => {
      const spot = makeHitchwikiSpot({ testCount: 5 })
      const validations = [makeValidation({ type: 'test' })]
      const result = mergeSpotData(spot, validations)
      // Only community tests count, Hitchwiki testCount ignored
      expect(result.liveTestCount).toBe(1)
    })

    it('ignores Hitchwiki avgWaitTime', () => {
      const spot = makeHitchwikiSpot({ avgWaitTime: 10 })
      const validations = [makeValidation({ waitTime: 30 })]
      const result = mergeSpotData(spot, validations)
      // Only community wait time, Hitchwiki avgWaitTime ignored
      expect(result.liveAvgWaitTime).toBe(30)
    })

    it('ignores Hitchwiki rideResult in success rate', () => {
      const spot = makeHitchwikiSpot({ rideResult: 'yes' })
      const validations = [makeValidation({ rideResult: 'no' })]
      const result = mergeSpotData(spot, validations)
      // Only community rideResult: 1 no = 0%
      expect(result.liveSuccessRate).toBe(0)
    })

    it('ignores Hitchwiki ratings', () => {
      const spot = makeHitchwikiSpot({ ratings: { safety: 1, traffic: 1, accessibility: 1 } })
      const validations = [makeValidation({ ratings: { safety: 5, traffic: 5, accessibility: 5 } })]
      const result = mergeSpotData(spot, validations)
      // Only community ratings
      expect(result.liveRatings.safety).toBe(5)
      expect(result.liveRatings.traffic).toBe(5)
      expect(result.liveRatings.accessibility).toBe(5)
    })

    it('drops all Hitchwiki comments', () => {
      const spot = makeHitchwikiSpot({
        comments: [{ text: 'Old Hitchwiki comment' }],
      })
      const validations = [makeValidation({ comment: 'Fresh community comment', userName: 'TestUser' })]
      const result = mergeSpotData(spot, validations)
      expect(result.liveComments).toHaveLength(1)
      expect(result.liveComments[0].text).toBe('Fresh community comment')
      expect(result.liveComments[0].userName).toBe('TestUser')
    })

    it('clears Hitchwiki descriptions', () => {
      const spot = makeHitchwikiSpot()
      const validations = [makeValidation()]
      const result = mergeSpotData(spot, validations)
      expect(result.descriptionEn).toBe('')
      expect(result.descriptionFr).toBe('')
      expect(result.descriptionEs).toBe('')
      expect(result.descriptionDe).toBe('')
    })

    it('sets source to community', () => {
      const spot = makeHitchwikiSpot()
      const validations = [makeValidation()]
      const result = mergeSpotData(spot, validations)
      expect(result.source).toBe('community')
    })

    it('keeps GPS coordinates and cleans city name suffix', () => {
      const spot = makeHitchwikiSpot({ lat: 48.8, lon: 2.3, from: 'Paris #1' })
      const validations = [makeValidation()]
      const result = mergeSpotData(spot, validations)
      expect(result.lat).toBe(48.8)
      expect(result.lon).toBe(2.3)
      // #N suffix is stripped from Hitchwiki spot names
      expect(result.from).toBe('Paris')
    })
  })

  // ─── COMMUNITY SPOTS (no replacement needed) ────────────────

  describe('Community spot with validations → normal merge (additive)', () => {
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
      expect(result.liveComments[1].userName).toBe('Hitchwiki') // default fallback label for static
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
    const spot = makeHitchwikiSpot()
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
    const spot = makeHitchwikiSpot({ lastTested: '2025-01-01' })
    const validations = [
      makeValidation({ date: '2026-03-10T10:00:00Z' }),
      makeValidation({ date: '2026-02-15T10:00:00Z' }),
    ]
    const result = mergeSpotData(spot, validations)
    expect(result.liveLastTested).toBe('2026-03-10T10:00:00Z')
  })

  it('returns null liveSuccessRate when no rideResult data', () => {
    const spot = makeHitchwikiSpot({ rideResult: null })
    const validations = [makeValidation({ rideResult: null })]
    const result = mergeSpotData(spot, validations)
    expect(result.liveSuccessRate).toBeNull()
  })
})
