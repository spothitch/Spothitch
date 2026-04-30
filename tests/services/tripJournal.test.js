import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('../../src/services/firebase.js', () => ({
  getCurrentUser: vi.fn(() => null),
  getDb: vi.fn(() => null),
  getAuth: vi.fn(() => null),
  setDoc: vi.fn(),
  doc: vi.fn(),
  deleteDoc: vi.fn(),
}))

import {
  getTrips, getTrip, getActiveTrip,
  createTrip, updateTrip, endTrip, deleteTrip,
  addLeg, deleteLeg, setDayNote, setDayExpenses,
  getTripStats, getLegsByDay, getCurrencyForCountry,
  EXPENSE_CATEGORIES,
} from '../../src/services/tripJournal.js'

describe('tripJournal', () => {
  beforeEach(() => { localStorage.clear() })

  describe('getTrips', () => {
    it('returns empty array when no trips', () => {
      expect(getTrips()).toEqual([])
    })
    it('returns stored trips', () => {
      localStorage.setItem('spothitch_journal_trips', JSON.stringify([{ id: 't1' }]))
      expect(getTrips().length).toBe(1)
    })
    it('returns [] on corrupt JSON', () => {
      localStorage.setItem('spothitch_journal_trips', 'bad')
      expect(getTrips()).toEqual([])
    })
  })

  describe('createTrip', () => {
    it('creates a trip with id, status=active', () => {
      const trip = createTrip({ title: 'Euro trip' })
      expect(trip).toBeTruthy()
      expect(trip.id).toMatch(/^trip_/)
      expect(trip.status).toBe('active')
      expect(trip.title).toBe('Euro trip')
    })
    it('prevents creating two active trips', () => {
      createTrip({ title: 'Trip 1' })
      const second = createTrip({ title: 'Trip 2' })
      expect(second).toBeNull()
    })
    it('trip is retrievable after create', () => {
      const trip = createTrip()
      expect(getTrips().length).toBe(1)
      expect(getTrip(trip.id).id).toBe(trip.id)
    })
  })

  describe('getTrip / getActiveTrip', () => {
    it('getTrip returns null for unknown id', () => {
      expect(getTrip('xxx')).toBeNull()
    })
    it('getActiveTrip returns null when none active', () => {
      expect(getActiveTrip()).toBeNull()
    })
    it('getActiveTrip returns the active trip', () => {
      const trip = createTrip()
      expect(getActiveTrip().id).toBe(trip.id)
    })
  })

  describe('updateTrip', () => {
    it('updates fields', () => {
      const trip = createTrip()
      const updated = updateTrip(trip.id, { title: 'New title' })
      expect(updated.title).toBe('New title')
      expect(getTrip(trip.id).title).toBe('New title')
    })
    it('returns null for unknown trip', () => {
      expect(updateTrip('xxx', {})).toBeNull()
    })
  })

  describe('endTrip', () => {
    it('sets status to completed', () => {
      const trip = createTrip()
      endTrip(trip.id)
      expect(getTrip(trip.id).status).toBe('completed')
      expect(getTrip(trip.id).endDate).toBeTruthy()
    })
  })

  describe('deleteTrip', () => {
    it('removes trip from storage', () => {
      const trip = createTrip()
      deleteTrip(trip.id)
      expect(getTrips().length).toBe(0)
    })
  })

  describe('addLeg / deleteLeg', () => {
    it('adds a leg to a trip', () => {
      const trip = createTrip()
      const leg = addLeg(trip.id, { transport: 'hitchhike', departureName: 'Paris', arrivalName: 'Lyon', distanceKm: 450 })
      expect(leg).toBeTruthy()
      expect(leg.id).toMatch(/^leg_/)
      expect(leg.transport).toBe('hitchhike')
      expect(getTrip(trip.id).legs.length).toBe(1)
    })
    it('returns null for unknown trip', () => {
      expect(addLeg('xxx', {})).toBeNull()
    })
    it('deleteLeg removes a leg and reorders', () => {
      const trip = createTrip()
      const l1 = addLeg(trip.id, { transport: 'walk' })
      const l2 = addLeg(trip.id, { transport: 'bus' })
      deleteLeg(trip.id, l1.id)
      const updated = getTrip(trip.id)
      expect(updated.legs.length).toBe(1)
      expect(updated.legs[0].order).toBe(1)
    })
  })

  describe('setDayNote', () => {
    it('sets a note for a date', () => {
      const trip = createTrip()
      setDayNote(trip.id, '2026-04-01', 'Great day!')
      expect(getTrip(trip.id).dayNotes['2026-04-01']).toBe('Great day!')
    })
  })

  describe('setDayExpenses', () => {
    it('sets expenses for a date', () => {
      const trip = createTrip()
      setDayExpenses(trip.id, '2026-04-01', { transport: 12, food: 8, lodging: 0, other: -5 })
      const exp = getTrip(trip.id).dayExpenses['2026-04-01']
      expect(exp.transport).toBe(12)
      expect(exp.food).toBe(8)
      expect(exp.lodging).toBeUndefined() // 0 not stored
      expect(exp.other).toBeUndefined() // negative not stored
    })
  })

  describe('getTripStats', () => {
    it('returns null for null trip', () => {
      expect(getTripStats(null)).toBeNull()
    })
    it('computes stats from legs', () => {
      const trip = {
        legs: [
          { transport: 'hitchhike', distanceKm: 300, waitMinutes: 20, date: '2026-04-01', rideDuration: 180 },
          { transport: 'hitchhike', distanceKm: 200, waitMinutes: 10, date: '2026-04-01', rideDuration: 120 },
          { transport: 'bus', distanceKm: 50, date: '2026-04-02' },
          { transport: 'walk', distanceKm: 5, date: '2026-04-02' },
        ],
        dayExpenses: {
          '2026-04-01': { food: 15, transport: 5 },
          '2026-04-02': { food: 10 },
        },
      }
      const stats = getTripStats(trip)
      expect(stats.totalKm).toBe(555)
      expect(stats.hitchKm).toBe(500)
      expect(stats.paidKm).toBe(50)
      expect(stats.walkKm).toBe(5)
      expect(stats.rides).toBe(2)
      expect(stats.totalWaitMin).toBe(30)
      expect(stats.avgWaitMin).toBe(15)
      expect(stats.days).toBe(2)
      expect(stats.totalExpenses).toBe(30)
      expect(stats.estimatedSavings).toBe(60) // 500 * 0.12
      expect(stats.avgSpeed).toBe(100) // 500 / (300/60)
      expect(stats.transportRatio.hitchhike).toBeGreaterThan(0)
    })
  })

  describe('getLegsByDay', () => {
    it('returns empty for null', () => {
      expect(getLegsByDay(null)).toEqual([])
    })
    it('groups legs by date', () => {
      const trip = {
        legs: [
          { date: '2026-04-02', id: 'l1' },
          { date: '2026-04-01', id: 'l2' },
          { date: '2026-04-01', id: 'l3' },
        ],
      }
      const days = getLegsByDay(trip)
      expect(days.length).toBe(2)
      expect(days[0].date).toBe('2026-04-01') // sorted
      expect(days[0].legs.length).toBe(2)
      expect(days[0].dayNumber).toBe(1)
      expect(days[1].dayNumber).toBe(2)
    })
  })

  describe('getCurrencyForCountry', () => {
    it('returns EUR for France', () => { expect(getCurrencyForCountry('FR')).toBe('EUR') })
    it('returns GBP for UK', () => { expect(getCurrencyForCountry('GB')).toBe('GBP') })
    it('returns CHF for Switzerland', () => { expect(getCurrencyForCountry('CH')).toBe('CHF') })
    it('returns EUR as default', () => { expect(getCurrencyForCountry('XX')).toBe('EUR') })
    it('handles lowercase', () => { expect(getCurrencyForCountry('fr')).toBe('EUR') })
    it('handles null', () => { expect(getCurrencyForCountry(null)).toBe('EUR') })
  })

  describe('EXPENSE_CATEGORIES', () => {
    it('has 6 categories', () => { expect(EXPENSE_CATEGORIES.length).toBe(6) })
    it('includes transport, food, lodging', () => {
      expect(EXPENSE_CATEGORIES).toContain('transport')
      expect(EXPENSE_CATEGORIES).toContain('food')
      expect(EXPENSE_CATEGORIES).toContain('lodging')
    })
  })
})
