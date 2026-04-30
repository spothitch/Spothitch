import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('../../src/services/notifications.js', () => ({
  sendLocalNotification: vi.fn(),
  showToast: vi.fn(),
}))
vi.mock('../../src/i18n/index.js', () => ({ t: vi.fn((k) => k) }))
vi.mock('../../src/utils/geo.js', () => ({
  haversineKm: vi.fn(() => 100),
}))
vi.mock('../../src/services/firebase.js', () => ({
  getCurrentUser: vi.fn(() => null),
  db: null,
}))

import {
  getGuardianState,
  isGuardianActive,
  getTimeUntilNextCheckIn,
  isCheckInOverdue,
  addPosition,
  validateGuardianInputs,
  getGuardians,
  addGuardian,
  removeGuardian,
  addTripEvent,
  getTripEvents,
  clearTripEvents,
  setTripPhoto,
  getTripPhoto,
  clearTripPhoto,
  getETAInfo,
  loadTripHistory,
  clearTripHistory,
} from '../../src/services/guardian.js'

describe('guardian', () => {
  beforeEach(() => { localStorage.clear() })

  describe('getGuardianState', () => {
    it('returns default state when nothing stored', () => {
      const state = getGuardianState()
      expect(state.active).toBe(false)
      expect(state.checkInInterval).toBe(30)
      expect(state.positions).toEqual([])
    })
    it('returns stored state', () => {
      localStorage.setItem('spothitch_guardian', JSON.stringify({ active: true, checkInInterval: 15 }))
      const state = getGuardianState()
      expect(state.active).toBe(true)
      expect(state.checkInInterval).toBe(15)
    })
  })

  describe('isGuardianActive', () => {
    it('returns false when not active', () => {
      expect(isGuardianActive()).toBe(false)
    })
    it('returns true when active', () => {
      localStorage.setItem('spothitch_guardian', JSON.stringify({ active: true }))
      expect(isGuardianActive()).toBe(true)
    })
  })

  describe('validateGuardianInputs', () => {
    it('returns error for empty guardians', () => {
      const result = validateGuardianInputs({ guardians: [], guardian: { name: '', phone: '' } })
      expect(result.valid).toBe(false)
      expect(result.error).toBeDefined()
    })
    it('passes with valid guardian', () => {
      const result = validateGuardianInputs({
        guardians: [{ name: 'Alice', phone: '+33600000000' }],
        guardian: { name: 'Alice', phone: '+33600000000' },
      })
      expect(result.valid).toBe(true)
    })
    it('rejects guardian name > 100 chars', () => {
      const result = validateGuardianInputs({
        guardians: [{ name: 'A'.repeat(101), phone: '+33600000000' }],
      })
      expect(result.valid).toBe(false)
      expect(result.error).toBe('guardian_name_too_long')
    })
  })

  describe('addPosition', () => {
    it('does nothing when not active', () => {
      addPosition(48.85, 2.35)
      const state = getGuardianState()
      expect(state.positions.length).toBe(0)
    })
    it('adds a position when active', () => {
      localStorage.setItem('spothitch_guardian', JSON.stringify({ active: true, positions: [], guardians: [] }))
      addPosition(48.85, 2.35)
      const state = getGuardianState()
      expect(state.positions.length).toBe(1)
      expect(state.positions[0].lat).toBe(48.85)
    })
    it('limits positions to max', () => {
      localStorage.setItem('spothitch_guardian', JSON.stringify({ active: true, positions: [], guardians: [] }))
      for (let i = 0; i < 60; i++) {
        addPosition(48 + i * 0.01, 2 + i * 0.01)
      }
      const state = getGuardianState()
      expect(state.positions.length).toBeLessThanOrEqual(50)
    })
  })

  describe('guardian management', () => {
    it('getGuardians returns empty array initially', () => {
      expect(getGuardians()).toEqual([])
    })
    it('addGuardian adds a guardian', () => {
      addGuardian({ name: 'Alice', phone: '+33600000000' })
      expect(getGuardians().length).toBe(1)
    })
    it('removeGuardian removes by index', () => {
      addGuardian({ name: 'Alice', phone: '+33600000000' })
      addGuardian({ name: 'Bob', phone: '+33600000001' })
      removeGuardian(0)
      const guardians = getGuardians()
      expect(guardians.length).toBe(1)
      expect(guardians[0].name).toBe('Bob')
    })
    it('limits to 5 guardians max', () => {
      for (let i = 0; i < 7; i++) {
        addGuardian({ name: `G${i}`, phone: `+3360000000${i}` })
      }
      expect(getGuardians().length).toBeLessThanOrEqual(5)
    })
  })

  describe('trip events', () => {
    it('getTripEvents returns empty array initially', () => {
      expect(getTripEvents()).toEqual([])
    })
    it('addTripEvent adds an event when active', () => {
      localStorage.setItem('spothitch_guardian', JSON.stringify({ active: true, tripEvents: [], guardians: [] }))
      addTripEvent('checkin', { lat: 48.85 })
      const events = getTripEvents()
      expect(events.length).toBe(1)
      expect(events[0].type).toBe('checkin')
    })
    it('addTripEvent does nothing when not active', () => {
      addTripEvent('checkin')
      expect(getTripEvents()).toEqual([])
    })
    it('clearTripEvents removes all events', () => {
      localStorage.setItem('spothitch_guardian', JSON.stringify({ active: true, tripEvents: [{ type: 'x' }], guardians: [] }))
      clearTripEvents()
      expect(getTripEvents()).toEqual([])
    })
  })

  describe('trip photo', () => {
    it('getTripPhoto returns null initially', () => {
      expect(getTripPhoto()).toBeNull()
    })
    it('setTripPhoto stores photo', () => {
      setTripPhoto('data:image/png;base64,abc')
      expect(getTripPhoto()).toBe('data:image/png;base64,abc')
    })
    it('clearTripPhoto removes photo', () => {
      setTripPhoto('data:image/png;base64,abc')
      clearTripPhoto()
      expect(getTripPhoto()).toBeNull()
    })
  })

  describe('trip history', () => {
    it('loadTripHistory returns array', () => {
      const history = loadTripHistory()
      expect(Array.isArray(history)).toBe(true)
    })
    it('clearTripHistory empties the list', () => {
      localStorage.setItem('spothitch_trip_history', JSON.stringify([{ id: 't1' }]))
      clearTripHistory()
      expect(loadTripHistory()).toEqual([])
    })
  })

  describe('getETAInfo', () => {
    it('returns null ETA when no positions', () => {
      const info = getETAInfo({ positions: [], active: true })
      expect(info.etaMinutes).toBeNull()
    })
  })

  describe('getTimeUntilNextCheckIn', () => {
    it('returns 0 when not active', () => {
      expect(getTimeUntilNextCheckIn()).toBe(0)
    })
    it('returns positive seconds when active with recent check-in', () => {
      localStorage.setItem('spothitch_guardian', JSON.stringify({
        active: true, lastCheckIn: Date.now(), checkInInterval: 30, guardians: [],
      }))
      const remaining = getTimeUntilNextCheckIn()
      expect(remaining).toBeGreaterThan(0)
    })
  })

  describe('isCheckInOverdue', () => {
    it('returns false when not active', () => {
      expect(isCheckInOverdue()).toBe(false)
    })
  })
})
