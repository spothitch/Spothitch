import { describe, it, expect } from 'vitest'

import {
  normalizeSpotDestinations,
  getDestinationsCities,
  getDestinationsDisplay,
  hasDestination,
} from '../../src/utils/spotDestinations.js'

describe('spotDestinations', () => {
  describe('normalizeSpotDestinations', () => {
    it('keeps existing destinations array', () => {
      const spot = { destinations: [{ city: 'Lyon' }, { city: 'Marseille' }] }
      const result = normalizeSpotDestinations(spot)
      expect(result.destinations.length).toBe(2)
    })

    it('creates destinations from directionCity', () => {
      const spot = { directionCity: 'Lyon' }
      const result = normalizeSpotDestinations(spot)
      expect(result.destinations.length).toBe(1)
      expect(result.destinations[0].city).toBe('Lyon')
    })

    it('creates destinations from "to" field', () => {
      const spot = { to: 'Berlin' }
      const result = normalizeSpotDestinations(spot)
      expect(result.destinations.length).toBe(1)
      expect(result.destinations[0].city).toBe('Berlin')
    })

    it('creates destinations from "direction" field', () => {
      const spot = { direction: 'Hamburg' }
      const result = normalizeSpotDestinations(spot)
      expect(result.destinations[0].city).toBe('Hamburg')
    })

    it('prefers directionCity over to', () => {
      const spot = { directionCity: 'Lyon', to: 'Marseille' }
      const result = normalizeSpotDestinations(spot)
      expect(result.destinations[0].city).toBe('Lyon')
    })

    it('sets empty array when no destination info', () => {
      const spot = { id: 1 }
      const result = normalizeSpotDestinations(spot)
      expect(result.destinations).toEqual([])
    })

    it('includes coords when available', () => {
      const spot = {
        directionCity: 'Lyon',
        directionCityCoords: { lat: 45.76, lng: 4.83 },
      }
      const result = normalizeSpotDestinations(spot)
      expect(result.destinations[0].coords).toEqual({ lat: 45.76, lng: 4.83 })
    })

    it('includes creator info', () => {
      const spot = {
        directionCity: 'Lyon',
        creatorId: 'user123',
        creator: 'Alice',
        createdAt: '2024-01-01',
      }
      const result = normalizeSpotDestinations(spot)
      expect(result.destinations[0].addedBy).toBe('user123')
      expect(result.destinations[0].addedByName).toBe('Alice')
    })

    it('mutates spot in place', () => {
      const spot = { directionCity: 'Lyon' }
      const result = normalizeSpotDestinations(spot)
      expect(result).toBe(spot)
      expect(spot.destinations).toBeDefined()
    })
  })

  describe('getDestinationsCities', () => {
    it('returns array of city names', () => {
      const spot = { destinations: [{ city: 'Lyon' }, { city: 'Marseille' }] }
      expect(getDestinationsCities(spot)).toEqual(['Lyon', 'Marseille'])
    })

    it('returns empty array when no destinations', () => {
      expect(getDestinationsCities({})).toEqual([])
    })

    it('filters out empty/null cities', () => {
      const spot = { destinations: [{ city: 'Lyon' }, { city: '' }, { city: null }] }
      expect(getDestinationsCities(spot)).toEqual(['Lyon'])
    })
  })

  describe('getDestinationsDisplay', () => {
    it('returns single city name for 1 destination', () => {
      const spot = { destinations: [{ city: 'Lyon' }] }
      expect(getDestinationsDisplay(spot)).toBe('Lyon')
    })

    it('returns "city (+N)" for multiple destinations', () => {
      const spot = { destinations: [{ city: 'Lyon' }, { city: 'Marseille' }, { city: 'Nice' }] }
      expect(getDestinationsDisplay(spot)).toBe('Lyon (+2)')
    })

    it('falls back to "to" field when no destinations', () => {
      const spot = { to: 'Berlin', destinations: [] }
      expect(getDestinationsDisplay(spot)).toBe('Berlin')
    })

    it('falls back to directionCity', () => {
      const spot = { directionCity: 'Hamburg' }
      expect(getDestinationsDisplay(spot)).toBe('Hamburg')
    })

    it('returns empty string when nothing available', () => {
      expect(getDestinationsDisplay({})).toBe('')
    })
  })

  describe('hasDestination', () => {
    it('returns true when city exists (exact match)', () => {
      const spot = { destinations: [{ city: 'Lyon' }] }
      expect(hasDestination(spot, 'Lyon')).toBe(true)
    })

    it('case insensitive comparison', () => {
      const spot = { destinations: [{ city: 'Lyon' }] }
      expect(hasDestination(spot, 'lyon')).toBe(true)
      expect(hasDestination(spot, 'LYON')).toBe(true)
    })

    it('returns false when city not found', () => {
      const spot = { destinations: [{ city: 'Lyon' }] }
      expect(hasDestination(spot, 'Berlin')).toBe(false)
    })

    it('returns false for empty destinations', () => {
      expect(hasDestination({}, 'Lyon')).toBe(false)
    })
  })
})
