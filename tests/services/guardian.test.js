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
  getShareLink,
  onOverdue,
  startTimer,
  stopTimer,
  startGuardianMode,
  stopGuardianMode,
  checkIn,
  addGuardianFromFriend,
  updateGuardian,
  getBatteryLevel,
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
  

  // ─── Additional tests ───

  describe('getShareLink', () => {
    it('returns null when no positions', () => {
      expect(getShareLink()).toBeNull()
    })

    it('returns Google Maps URL when positions exist', () => {
      localStorage.setItem('spothitch_guardian', JSON.stringify({
        active: true,
        positions: [{ lat: 48.85, lng: 2.35, timestamp: Date.now() }],
        guardians: [],
      }))
      const link = getShareLink()
      expect(typeof link).toBe('string')
      expect(link).toContain('google.com/maps')
      expect(link).toContain('48.85')
    })

    it('uses last position when multiple positions', () => {
      localStorage.setItem('spothitch_guardian', JSON.stringify({
        positions: [
          { lat: 48.0, lng: 2.0, timestamp: 1 },
          { lat: 48.99, lng: 2.99, timestamp: 2 },
        ],
        guardians: [],
      }))
      const link = getShareLink()
      expect(link).toContain('48.99')
    })
  })

  describe('onOverdue', () => {
    it('sets a callback without error', () => {
      expect(() => onOverdue(vi.fn())).not.toThrow()
    })

    it('accepts null callback', () => {
      expect(() => onOverdue(null)).not.toThrow()
    })
  })

  describe('startTimer / stopTimer', () => {
    it('startTimer does not throw', () => {
      expect(() => startTimer()).not.toThrow()
    })

    it('stopTimer does not throw', () => {
      expect(() => stopTimer()).not.toThrow()
    })

    it('can start and stop without error', () => {
      expect(() => {
        startTimer()
        stopTimer()
      }).not.toThrow()
    })
  })

  describe('startGuardianMode', () => {
    it('sets active=true in state', () => {
      startGuardianMode({ name: 'AliceStart', phone: '+33600000000' }, 30)
      const state = getGuardianState()
      expect(state.active).toBe(true)
    })

    it('sets guardian name', () => {
      startGuardianMode({ name: 'BobStart', phone: '+33600000001' }, 15)
      const state = getGuardianState()
      expect(state.guardian.name).toBe('BobStart')
    })

    it('sets custom check-in interval', () => {
      startGuardianMode({ name: 'CharlieStart', phone: '' }, 45)
      const state = getGuardianState()
      expect(state.checkInInterval).toBe(45)
    })

    it('accepts optional destination', () => {
      startGuardianMode({ name: 'DaveStart', phone: '' }, 30, { destination: 'Lyon' })
      const state = getGuardianState()
      expect(state.destination).toBe('Lyon')
    })

    it('resets positions array', () => {
      startGuardianMode({ name: 'EveStart', phone: '' }, 30)
      const state = getGuardianState()
      expect(state.positions).toEqual([])
    })
  })

  describe('stopGuardianMode', () => {
    it('sets active=false', () => {
      startGuardianMode({ name: 'Alice', phone: '' }, 30)
      stopGuardianMode({ sendArrivalNotification: false })
      const state = getGuardianState()
      expect(state.active).toBe(false)
    })

    it('returns default state object', () => {
      startGuardianMode({ name: 'Alice', phone: '' }, 30)
      const result = stopGuardianMode({ sendArrivalNotification: false })
      expect(typeof result).toBe('object')
      expect(result.active).toBe(false)
    })

    it('does not throw when called on inactive mode', () => {
      localStorage.clear()
      expect(() => stopGuardianMode({ sendArrivalNotification: false })).not.toThrow()
    })
  })

  describe('checkIn', () => {
    it('returns state when active', () => {
      localStorage.setItem('spothitch_guardian', JSON.stringify({
        active: true, lastCheckIn: Date.now() - 10000, checkInInterval: 30, guardians: [],
      }))
      const result = checkIn()
      expect(typeof result).toBe('object')
    })

    it('increments checkInsCount', () => {
      localStorage.setItem('spothitch_guardian', JSON.stringify({
        active: true, lastCheckIn: Date.now() - 10000, checkInInterval: 30, checkInsCount: 2, guardians: [],
      }))
      checkIn()
      const state = getGuardianState()
      expect(state.checkInsCount).toBe(3)
    })

    it('returns state when not active', () => {
      localStorage.clear()
      const result = checkIn()
      expect(typeof result).toBe('object')
      expect(result.active).toBe(false)
    })

    it('resets alertSent flag', () => {
      localStorage.setItem('spothitch_guardian', JSON.stringify({
        active: true, alertSent: true, guardians: [],
      }))
      checkIn()
      const state = getGuardianState()
      expect(state.alertSent).toBe(false)
    })
  })

  describe('addGuardianFromFriend', () => {
    it('returns false for friend without id', () => {
      expect(addGuardianFromFriend({ name: 'Alice' })).toBe(false)
    })

    it('returns false for friend without name', () => {
      expect(addGuardianFromFriend({ id: 'uid1', name: '' })).toBe(false)
    })

    it('returns false for null friend', () => {
      expect(addGuardianFromFriend(null)).toBe(false)
    })

    it('returns true when friend is valid', () => {
      const result = addGuardianFromFriend({ id: 'uid-new', name: 'FriendNew' })
      expect(result).toBe(true)
    })

    it('adds guardian to the state', () => {
      addGuardianFromFriend({ id: 'uid-add', name: 'FriendAdded' })
      const guardians = getGuardians()
      expect(guardians.some(g => g.name === 'FriendAdded')).toBe(true)
    })

    it('prevents duplicates by name', () => {
      addGuardianFromFriend({ id: 'uid1', name: 'DupFriend' })
      const result = addGuardianFromFriend({ id: 'uid2', name: 'DupFriend' })
      expect(result).toBe(false)
    })
  })

  describe('updateGuardian', () => {
    it('updates guardian data at index', () => {
      addGuardian({ name: 'UpdateMe', phone: '' })
      updateGuardian(0, { phone: '+33600000001' })
      const guardians = getGuardians()
      const g = guardians.find(x => x.name === 'UpdateMe')
      expect(g?.phone).toBe('+33600000001')
    })

    it('does nothing for out-of-bounds index', () => {
      addGuardian({ name: 'SafeG', phone: '' })
      expect(() => updateGuardian(50, { name: 'X' })).not.toThrow()
    })

    it('does nothing for negative index', () => {
      expect(() => updateGuardian(-1, { name: 'X' })).not.toThrow()
    })
  })

  describe('validateGuardianInputs — additional cases', () => {
    it('rejects destination > 200 chars', () => {
      const result = validateGuardianInputs({
        guardians: [{ name: 'Alice', phone: '' }],
        destination: 'A'.repeat(201),
      })
      expect(result.valid).toBe(false)
      expect(result.error).toBe('destination_too_long')
    })

    it('rejects customMessage > 500 chars', () => {
      const result = validateGuardianInputs({
        guardians: [{ name: 'Alice', phone: '' }],
        customMessage: 'A'.repeat(501),
      })
      expect(result.valid).toBe(false)
      expect(result.error).toBe('message_too_long')
    })

    it('rejects licensePlate > 20 chars', () => {
      const result = validateGuardianInputs({
        guardians: [{ name: 'Alice', phone: '' }],
        licensePlate: 'A'.repeat(21),
      })
      expect(result.valid).toBe(false)
      expect(result.error).toBe('plate_too_long')
    })

    it('accepts valid destination and custom message', () => {
      const result = validateGuardianInputs({
        guardians: [{ name: 'Alice', phone: '' }],
        destination: 'Lyon',
        customMessage: 'Je prends la route',
        licensePlate: 'AB-123-CD',
      })
      expect(result.valid).toBe(true)
    })
  })

  describe('getBatteryLevel', () => {
    it('returns a promise', () => {
      const result = getBatteryLevel()
      expect(result instanceof Promise).toBe(true)
    })

    it('resolves to null or a number', async () => {
      const level = await getBatteryLevel()
      expect(level === null || typeof level === 'number').toBe(true)
    })
  })

  describe('isCheckInOverdue — additional cases', () => {
    it('returns true when check-in is overdue', () => {
      localStorage.setItem('spothitch_guardian', JSON.stringify({
        active: true,
        lastCheckIn: Date.now() - 2 * 60 * 60 * 1000,
        checkInInterval: 30,
        guardians: [],
      }))
      expect(isCheckInOverdue()).toBe(true)
    })

    it('returns false when check-in is recent', () => {
      localStorage.setItem('spothitch_guardian', JSON.stringify({
        active: true,
        lastCheckIn: Date.now() - 5000,
        checkInInterval: 30,
        guardians: [],
      }))
      expect(isCheckInOverdue()).toBe(false)
    })
  })
})
})
