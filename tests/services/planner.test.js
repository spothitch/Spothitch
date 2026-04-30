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
  getSpotsBetween, findSpotsNearRoute,
} from '../../src/services/planner.js'
import { getState, setState } from '../../src/stores/state.js'

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
  })

  describe('findSpotsNearRoute', () => {
    it('returns empty for no route coords', () => {
      getState.mockReturnValue({ spots: [] })
      const result = findSpotsNearRoute([])
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(0)
    })
  })
})
