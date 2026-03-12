/**
 * Unit tests for spotLiveData.js — mergeSpotData pure function
 */
import { describe, it, expect } from 'vitest'
import { mergeSpotData } from '../../src/services/spotLiveData.js'

const makeSpot = (overrides = {}) => ({
  id: 'hm_FR_42',
  testCount: 5,
  avgWaitTime: 15,
  rideResult: 'yes',
  ratings: { safety: 3, traffic: 4, accessibility: 3 },
  lastTested: '2025-06-01',
  comments: [
    { text: 'Great spot near the highway', userName: 'Alice' },
    { text: 'Waited 10 min, got a ride to Paris', userName: '' },
  ],
  destinations: [{ city: 'Paris' }],
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
    const spot = makeSpot()
    const result = mergeSpotData(spot, [])
    expect(result._liveLoaded).toBe(true)
    expect(result.liveTestCount).toBeUndefined()
  })

  it('calculates liveTestCount correctly', () => {
    const spot = makeSpot({ testCount: 5 })
    const validations = [
      makeValidation({ type: 'test' }),
      makeValidation({ type: 'test' }),
      makeValidation({ type: 'validate' }),
    ]
    const result = mergeSpotData(spot, validations)
    // 5 static + 2 test-type validations
    expect(result.liveTestCount).toBe(7)
  })

  it('calculates liveAvgWaitTime correctly', () => {
    const spot = makeSpot({ avgWaitTime: 10 })
    const validations = [
      makeValidation({ waitTime: 20 }),
      makeValidation({ waitTime: 30 }),
    ]
    const result = mergeSpotData(spot, validations)
    // (10 + 20 + 30) / 3 = 20
    expect(result.liveAvgWaitTime).toBe(20)
  })

  it('calculates liveSuccessRate with mixed results', () => {
    const spot = makeSpot({ rideResult: 'yes' })
    const validations = [
      makeValidation({ rideResult: 'yes' }),
      makeValidation({ rideResult: 'yes' }),
      makeValidation({ rideResult: 'no' }),
      makeValidation({ rideResult: 'gaveUp' }),
    ]
    const result = mergeSpotData(spot, validations)
    // 2 yes from validations + 1 yes from static = 3 yes out of 5 total
    expect(result.liveSuccessRate).toBe(60)
  })

  it('calculates liveRatings as weighted average', () => {
    const spot = makeSpot({ ratings: { safety: 2, traffic: 2, accessibility: 2 } })
    const validations = [
      makeValidation({ ratings: { safety: 4, traffic: 4, accessibility: 4 } }),
    ]
    const result = mergeSpotData(spot, validations)
    // (2 + 4) / 2 = 3 for each
    expect(result.liveRatings.safety).toBe(3)
    expect(result.liveRatings.traffic).toBe(3)
    expect(result.liveRatings.accessibility).toBe(3)
  })

  it('merges comments with Firebase first', () => {
    const spot = makeSpot({
      comments: [{ text: 'Old Hitchwiki comment' }],
    })
    const validations = [
      makeValidation({ comment: 'New Firebase comment', userName: 'TestUser' }),
    ]
    const result = mergeSpotData(spot, validations)
    expect(result.liveComments.length).toBe(2)
    expect(result.liveComments[0].text).toBe('New Firebase comment')
    expect(result.liveComments[0].userName).toBe('TestUser')
    expect(result.liveComments[1].text).toBe('Old Hitchwiki comment')
    expect(result.liveComments[1].userName).toBe('Hitchwiki')
  })

  it('aggregates live destinations with counts', () => {
    const spot = makeSpot()
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
    const spot = makeSpot({ lastTested: '2025-01-01' })
    const validations = [
      makeValidation({ date: '2026-03-10T10:00:00Z' }),
      makeValidation({ date: '2026-02-15T10:00:00Z' }),
    ]
    const result = mergeSpotData(spot, validations)
    expect(result.liveLastTested).toBe('2026-03-10T10:00:00Z')
  })

  it('handles null avgWaitTime in static spot', () => {
    const spot = makeSpot({ avgWaitTime: null })
    const validations = [
      makeValidation({ waitTime: 25 }),
    ]
    const result = mergeSpotData(spot, validations)
    expect(result.liveAvgWaitTime).toBe(25)
  })

  it('returns null liveSuccessRate when no rideResult data', () => {
    const spot = makeSpot({ rideResult: null })
    const validations = [
      makeValidation({ rideResult: null }),
    ]
    const result = mergeSpotData(spot, validations)
    expect(result.liveSuccessRate).toBeNull()
  })
})
