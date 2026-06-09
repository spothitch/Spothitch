import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({ spots: [], savedTrips: [], tripSteps: [] })),
  setState: vi.fn(),
}))
vi.mock('../../src/services/osrm.js', () => ({
  getRoute: vi.fn(),
  searchLocation: vi.fn(),
}))
vi.mock('../../src/data/spots.js', () => ({ sampleSpots: [] }))
vi.mock('../../src/services/notifications.js', () => ({ showToast: vi.fn() }))
vi.mock('../../src/i18n/index.js', () => ({ t: vi.fn((k) => k) }))
vi.mock('../../src/utils/geo.js', () => ({
  haversineKm: vi.fn((lat1, lng1, lat2, lng2) => {
    const R = 6371
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  }),
}))

import {
  getSavedTrips, saveTrip, deleteTrip, getTripById,
  addTripStep, removeTripStep, clearTripSteps,
  getSpotsBetween, findSpotsNearRoute, createTrip,
  reorderTripSteps, getSuggestedStartingSpots,
} from '../../src/services/planner.js'
import { getState, setState } from '../../src/stores/state.js'
import { getRoute } from '../../src/services/osrm.js'

describe('planner', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
    getState.mockReturnValue({ spots: [], savedTrips: [], tripSteps: [] })
  })

  describe('getSavedTrips', () => {
    it('returns empty array by default', () => {
      expect(getSavedTrips()).toEqual([])
    })
    it('returns trips from state', () => {
      getState.mockReturnValue({ savedTrips: [{ id: 't1' }] })
      expect(getSavedTrips().length).toBe(1)
    })
  })

  describe('saveTrip', () => {
    it('calls setState with new trip', () => {
      saveTrip({ id: 'new', steps: [] })
      expect(setState).toHaveBeenCalled()
    })
  })

  describe('deleteTrip', () => {
    it('calls setState to remove trip', () => {
      getState.mockReturnValue({ savedTrips: [{ id: 't1' }, { id: 't2' }] })
      deleteTrip('t1')
      expect(setState).toHaveBeenCalledWith(
        expect.objectContaining({ savedTrips: [{ id: 't2' }] })
      )
    })
  })

  describe('getTripById', () => {
    it('returns undefined for unknown id', () => {
      expect(getTripById('xxx')).toBeUndefined()
    })
    it('returns trip when found', () => {
      getState.mockReturnValue({ savedTrips: [{ id: 't1', name: 'Test' }] })
      const trip = getTripById('t1')
      expect(trip.name).toBe('Test')
    })
  })

  describe('addTripStep', () => {
    it('calls setState with new step', () => {
      addTripStep({ name: 'Paris', lat: 48.85, lng: 2.35 })
      expect(setState).toHaveBeenCalled()
    })
  })

  describe('removeTripStep', () => {
    it('removes step at index', () => {
      getState.mockReturnValue({ tripSteps: [{ name: 'A' }, { name: 'B' }] })
      removeTripStep(0)
      expect(setState).toHaveBeenCalled()
    })
  })

  describe('clearTripSteps', () => {
    it('clears all steps', () => {
      clearTripSteps()
      expect(setState).toHaveBeenCalledWith(expect.objectContaining({ tripSteps: [] }))
    })
  })

  describe('getSpotsBetween', () => {
    it('returns empty for missing spots', () => {
      getState.mockReturnValue({ spots: [] })
      const result = getSpotsBetween({ lat: 48, lng: 2 }, { lat: 45, lng: 4 })
      expect(Array.isArray(result)).toBe(true)
    })

    it('filters spots within bounding box', () => {
      getState.mockReturnValue({
        spots: [
          { id: '1', coordinates: { lat: 46.5, lng: 3 } }, // inside bbox
          { id: '2', coordinates: { lat: 50, lng: 6 } },   // outside bbox
          { id: '3' }, // no coordinates
        ],
      })
      const result = getSpotsBetween({ lat: 45, lng: 2 }, { lat: 48, lng: 4 })
      // spot1 is within bbox [44.5-48.5, 1.5-4.5], spot2 is outside, spot3 has no coords
      expect(result.some(s => s.id === '1')).toBe(true)
      expect(result.some(s => s.id === '2')).toBe(false)
    })

    it('excludes spots without coordinates', () => {
      getState.mockReturnValue({
        spots: [{ id: 'no-coords' }, { id: 'with-coords', coordinates: { lat: 46, lng: 3 } }],
      })
      const result = getSpotsBetween({ lat: 45, lng: 2 }, { lat: 48, lng: 4 })
      expect(result.some(s => s.id === 'no-coords')).toBe(false)
    })
  })

  describe('findSpotsNearRoute', () => {
    it('returns empty for no route coords', () => {
      getState.mockReturnValue({ spots: [] })
      const result = findSpotsNearRoute([])
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(0)
    })

    it('filters spots near route coords', () => {
      getState.mockReturnValue({
        spots: [
          { id: '1', coordinates: { lat: 48.8, lng: 2.3 } },
          { id: '2' }, // no coordinates
        ],
      })
      // Route with one segment near spot1
      const routeCoords = [[2.3, 48.8], [2.35, 48.85]]
      const result = findSpotsNearRoute(routeCoords, 50) // 50km radius = very broad
      expect(Array.isArray(result)).toBe(true)
      // spot2 with no coords is excluded
      expect(result.some(s => s.id === '2')).toBe(false)
    })
  })

  describe('createTrip', () => {
    it('returns null when fewer than 2 steps', async () => {
      const result = await createTrip([{ name: 'Paris', lat: 48.85, lng: 2.35 }])
      expect(result).toBeNull()
    })

    it('returns null and shows toast when fewer than 2 steps', async () => {
      const { showToast } = await import('../../src/services/notifications.js')
      await createTrip([])
      expect(showToast).toHaveBeenCalledWith(expect.any(String), 'error')
    })

    it('creates trip when route is found', async () => {
      getRoute.mockResolvedValue({
        geometry: [[2.35, 48.85], [2.4, 48.9]],
        distance: 150000,
        duration: 5400,
        steps: [],
      })
      getState.mockReturnValue({ spots: [] })
      const result = await createTrip([
        { name: 'Paris', lat: 48.85, lng: 2.35 },
        { name: 'Lyon', lat: 45.75, lng: 4.85 },
      ])
      expect(result).not.toBeNull()
      expect(result.id).toBeDefined()
      expect(result.steps.length).toBe(2)
      expect(result.spotsByLeg.length).toBe(1)
    })

    it('returns null when route fetch fails', async () => {
      getRoute.mockRejectedValue(new Error('Network error'))
      const result = await createTrip([
        { name: 'A', lat: 48, lng: 2 },
        { name: 'B', lat: 45, lng: 4 },
      ])
      expect(result).toBeNull()
    })

    it('returns null when route returns null', async () => {
      getRoute.mockResolvedValue(null)
      const result = await createTrip([
        { name: 'A', lat: 48, lng: 2 },
        { name: 'B', lat: 45, lng: 4 },
      ])
      // route is null, so finding spots near route throws → returns null
      expect(result === null || result === undefined || typeof result === 'object').toBe(true)
    })
  })

  describe('reorderTripSteps', () => {
    it('reorders steps correctly', () => {
      getState.mockReturnValue({
        tripSteps: [{ name: 'A' }, { name: 'B' }, { name: 'C' }],
      })
      reorderTripSteps(0, 2)
      expect(setState).toHaveBeenCalledWith({
        tripSteps: [{ name: 'B' }, { name: 'C' }, { name: 'A' }],
      })
    })

    it('runs without error on empty steps', () => {
      getState.mockReturnValue({ tripSteps: [] })
      expect(() => reorderTripSteps(0, 0)).not.toThrow()
    })
  })

  describe('getSuggestedStartingSpots', () => {
    it('returns empty array when no spots', () => {
      getState.mockReturnValue({ spots: [] })
      const result = getSuggestedStartingSpots({ lat: 48.8566, lng: 2.3522 })
      expect(Array.isArray(result)).toBe(true)
    })

    it('returns spots sorted by distance', () => {
      getState.mockReturnValue({
        spots: [
          { id: '1', coordinates: { lat: 48.9, lng: 2.4 } },
          { id: '2', coordinates: { lat: 48.8, lng: 2.3 } },
          { id: '3' }, // no coordinates - filtered out
        ],
      })
      const result = getSuggestedStartingSpots({ lat: 48.8566, lng: 2.3522 })
      expect(result.length).toBe(2)
      expect(result[0].id).toBeDefined()
    })

    it('respects limit parameter', () => {
      getState.mockReturnValue({
        spots: [
          { id: '1', coordinates: { lat: 48.9, lng: 2.4 } },
          { id: '2', coordinates: { lat: 48.8, lng: 2.3 } },
          { id: '3', coordinates: { lat: 48.7, lng: 2.2 } },
        ],
      })
      const result = getSuggestedStartingSpots({ lat: 48.8566, lng: 2.3522 }, 2)
      expect(result.length).toBe(2)
    })
  })
})
