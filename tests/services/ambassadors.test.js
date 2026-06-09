import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({
    user: { uid: 'user1', displayName: 'Alice', trustScore: 60 },
    isLoggedIn: true,
    level: 5,
    spotsCreated: 3,
    reviewsGiven: 5,
  })),
  setState: vi.fn(),
}))

vi.mock('../../src/i18n/index.js', () => ({ t: vi.fn(k => k) }))
vi.mock('../../src/services/notifications.js', () => ({ showToast: vi.fn() }))

import {
  getAmbassadors,
  isEligibleForAmbassador,
  searchAmbassadors,
  getAmbassadorProfile,
  getCurrentAmbassadorProfile,
  updateAmbassadorAvailability,
  unregisterAmbassador,
  registerAsAmbassador,
} from '../../src/services/ambassadors.js'
import { getState, setState } from '../../src/stores/state.js'

// Storage uses spothitch_v4_ prefix + JSON.stringify
const PREFIX = 'spothitch_v4_'
function setAmbassadors(data) {
  localStorage.setItem(PREFIX + 'spothitch_ambassadors', JSON.stringify(data))
}

describe('Ambassadors Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    getState.mockReturnValue({
      user: { uid: 'user1', displayName: 'Alice', trustScore: 60 },
      isLoggedIn: true,
    })
  })

  describe('getAmbassadors', () => {
    it('returns empty array when no ambassadors stored', () => {
      expect(getAmbassadors()).toEqual([])
    })

    it('returns all ambassadors when no city filter', () => {
      setAmbassadors([
        { userId: 'u1', city: 'Paris', country: 'FR', userName: 'Alice' },
        { userId: 'u2', city: 'Berlin', country: 'DE', userName: 'Bob' },
      ])
      const result = getAmbassadors()
      expect(result.length).toBe(2)
    })

    it('filters by city (case insensitive)', () => {
      setAmbassadors([
        { userId: 'u1', city: 'Paris', country: 'FR', userName: 'Alice' },
        { userId: 'u2', city: 'Berlin', country: 'DE', userName: 'Bob' },
      ])
      const result = getAmbassadors('paris')
      expect(result.length).toBe(1)
      expect(result[0].city).toBe('Paris')
    })

    it('returns empty array when city not found', () => {
      setAmbassadors([{ userId: 'u1', city: 'Paris', country: 'FR', userName: 'Alice' }])
      expect(getAmbassadors('Lyon')).toEqual([])
    })
  })

  describe('isEligibleForAmbassador', () => {
    it('returns false when no user logged in', () => {
      getState.mockReturnValue({ user: null })
      expect(isEligibleForAmbassador()).toBe(false)
    })

    it('returns true when trustScore >= 50', () => {
      getState.mockReturnValue({ user: { uid: 'u1', trustScore: 55 } })
      expect(isEligibleForAmbassador()).toBe(true)
    })

    it('returns true when spotsCreated >= 10', () => {
      getState.mockReturnValue({ user: { uid: 'u1', trustScore: 0, spotsCreated: 12 } })
      expect(isEligibleForAmbassador()).toBe(true)
    })

    it('returns true when checkins >= 5', () => {
      getState.mockReturnValue({ user: { uid: 'u1', trustScore: 0, spotsCreated: 0, checkins: 7 } })
      expect(isEligibleForAmbassador()).toBe(true)
    })

    it('returns false when below all thresholds', () => {
      getState.mockReturnValue({ user: { uid: 'u1', trustScore: 10, spotsCreated: 2, checkins: 1 } })
      expect(isEligibleForAmbassador()).toBe(false)
    })
  })

  describe('searchAmbassadors', () => {
    beforeEach(() => {
      setAmbassadors([
        { userId: 'u1', city: 'Paris', country: 'FR', userName: 'Alice' },
        { userId: 'u2', city: 'Berlin', country: 'DE', userName: 'Bob' },
        { userId: 'u3', city: 'Lyon', country: 'FR', userName: 'Charlie' },
      ])
    })

    it('returns empty array for empty query', () => {
      expect(searchAmbassadors('')).toEqual([])
    })

    it('returns empty array for query shorter than 2 chars', () => {
      expect(searchAmbassadors('P')).toEqual([])
    })

    it('searches by city name', () => {
      const result = searchAmbassadors('Paris')
      expect(result.length).toBe(1)
      expect(result[0].city).toBe('Paris')
    })

    it('searches by country code', () => {
      const result = searchAmbassadors('FR')
      expect(result.length).toBe(2)
    })

    it('searches by username (case insensitive)', () => {
      const result = searchAmbassadors('alice')
      expect(result.length).toBe(1)
      expect(result[0].userName).toBe('Alice')
    })

    it('returns empty array when no match', () => {
      expect(searchAmbassadors('Tokyo')).toEqual([])
    })
  })

  describe('getAmbassadorProfile', () => {
    it('returns null when no ambassadors', () => {
      expect(getAmbassadorProfile('u1')).toBeNull()
    })

    it('returns profile for existing ambassador', () => {
      setAmbassadors([{ userId: 'u1', city: 'Paris', country: 'FR', userName: 'Alice' }])
      const profile = getAmbassadorProfile('u1')
      expect(profile).not.toBeNull()
      expect(profile.city).toBe('Paris')
    })

    it('returns null for unknown userId', () => {
      setAmbassadors([{ userId: 'u1', city: 'Paris', country: 'FR', userName: 'Alice' }])
      expect(getAmbassadorProfile('unknown')).toBeNull()
    })
  })

  describe('getCurrentAmbassadorProfile', () => {
    it('returns null when no user logged in', () => {
      getState.mockReturnValue({ user: null })
      expect(getCurrentAmbassadorProfile()).toBeNull()
    })

    it('returns null when user is not an ambassador', () => {
      getState.mockReturnValue({ user: { uid: 'user1' } })
      expect(getCurrentAmbassadorProfile()).toBeNull()
    })

    it('returns profile when current user is an ambassador', () => {
      getState.mockReturnValue({ user: { uid: 'user1' } })
      setAmbassadors([{ userId: 'user1', city: 'Paris', country: 'FR', userName: 'Alice' }])
      const profile = getCurrentAmbassadorProfile()
      expect(profile).not.toBeNull()
      expect(profile.userId).toBe('user1')
    })
  })

  describe('unregisterAmbassador', () => {
    it('returns false when no user', () => {
      getState.mockReturnValue({ user: null })
      expect(unregisterAmbassador()).toBe(false)
    })

    it('returns true when user is registered', () => {
      getState.mockReturnValue({ user: { uid: 'user1' } })
      setAmbassadors([{ userId: 'user1', city: 'Paris', country: 'FR', userName: 'Alice' }])
      const result = unregisterAmbassador()
      expect(result).toBe(true)
    })

    it('removes user from ambassadors list', () => {
      getState.mockReturnValue({ user: { uid: 'user1' } })
      setAmbassadors([
        { userId: 'user1', city: 'Paris', country: 'FR', userName: 'Alice' },
        { userId: 'user2', city: 'Berlin', country: 'DE', userName: 'Bob' },
      ])
      unregisterAmbassador()
      expect(getAmbassadors().some(a => a.userId === 'user1')).toBe(false)
    })
  })

  describe('updateAmbassadorAvailability', () => {
    it('returns false when no user', () => {
      getState.mockReturnValue({ user: null })
      expect(updateAmbassadorAvailability('available')).toBe(false)
    })

    it('returns false when user is not an ambassador', () => {
      getState.mockReturnValue({ user: { uid: 'user1' } })
      expect(updateAmbassadorAvailability('available')).toBe(false)
    })

    it('returns true when ambassador exists', () => {
      getState.mockReturnValue({ user: { uid: 'user1' } })
      setAmbassadors([{ userId: 'user1', city: 'Paris', country: 'FR', userName: 'Alice', availability: 'available' }])
      expect(updateAmbassadorAvailability('busy')).toBe(true)
    })

    it('updates availability in storage', () => {
      getState.mockReturnValue({ user: { uid: 'user1' } })
      setAmbassadors([{ userId: 'user1', city: 'Paris', country: 'FR', userName: 'Alice', availability: 'available' }])
      updateAmbassadorAvailability('busy')
      const ambassadors = getAmbassadors()
      expect(ambassadors.find(a => a.userId === 'user1').availability).toBe('busy')
    })
  })

  describe('registerAsAmbassador - validation', () => {
    it('throws when user not logged in', () => {
      getState.mockReturnValue({ user: null })
      expect(() => registerAsAmbassador({ city: 'Paris', country: 'FR', bio: 'Test bio' })).toThrow()
    })

    it('throws when not eligible (low scores)', () => {
      getState.mockReturnValue({
        user: { uid: 'u1', trustScore: 0, spotsCreated: 0, checkins: 0 }
      })
      expect(() => registerAsAmbassador({ city: 'Paris', country: 'FR', bio: 'Test bio' })).toThrow()
    })

    it('throws when missing required fields', () => {
      getState.mockReturnValue({ user: { uid: 'u1', trustScore: 60 } })
      expect(() => registerAsAmbassador({ city: 'Paris' })).toThrow()
    })

    it('throws when bio over 500 chars', () => {
      getState.mockReturnValue({ user: { uid: 'u1', trustScore: 60 } })
      expect(() => registerAsAmbassador({
        city: 'Paris', country: 'FR', bio: 'a'.repeat(501),
      })).toThrow()
    })

    it('throws when city over 100 chars', () => {
      getState.mockReturnValue({ user: { uid: 'u1', trustScore: 60 } })
      expect(() => registerAsAmbassador({
        city: 'a'.repeat(101), country: 'FR', bio: 'Test bio',
      })).toThrow()
    })
  })

  describe('registerAsAmbassador - success', () => {
    it('returns ambassador object on success', () => {
      getState.mockReturnValue({
        user: { uid: 'user1', displayName: 'Alice', trustScore: 60, spotsCreated: 0, checkins: 0 }
      })
      const result = registerAsAmbassador({ city: 'Paris', country: 'FR', bio: 'I love hitchhiking' })
      expect(result).toBeDefined()
      expect(result.userId).toBe('user1')
      expect(result.city).toBe('Paris')
    })

    it('ambassador appears in getAmbassadors after registration', () => {
      getState.mockReturnValue({
        user: { uid: 'user1', displayName: 'Alice', trustScore: 60 }
      })
      registerAsAmbassador({ city: 'Lyon', country: 'FR', bio: 'Hitchhiker' })
      expect(getAmbassadors().some(a => a.userId === 'user1')).toBe(true)
    })

    it('updates existing ambassador profile', () => {
      getState.mockReturnValue({
        user: { uid: 'user1', displayName: 'Alice', trustScore: 60 }
      })
      setAmbassadors([{ userId: 'user1', city: 'Paris', country: 'FR', userName: 'Alice', registeredAt: 123 }])
      const result = registerAsAmbassador({ city: 'Bordeaux', country: 'FR', bio: 'Updated bio' })
      expect(result.city).toBe('Bordeaux')
      // Should only have one entry for this user
      expect(getAmbassadors().filter(a => a.userId === 'user1').length).toBe(1)
    })
  })
})
