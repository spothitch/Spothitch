import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({ user: { uid: 'user1' } })),
}))

vi.mock('../../src/services/notifications.js', () => ({
  showToast: vi.fn(),
}))

vi.mock('../../src/i18n/index.js', () => ({
  t: vi.fn((key) => key),
}))

vi.mock('../../src/utils/icons.js', () => ({
  icon: vi.fn((name) => `<svg>${name}</svg>`),
}))

vi.mock('../../src/utils/sanitize.js', () => ({
  escapeJSString: vi.fn((s) => s),
}))

vi.mock('../../src/services/firebase.js', () => ({
  db: null,
}))

import {
  addRecommendation,
  getBookingLinks,
  upvoteRecommendation,
} from '../../src/services/hostelRecommendations.js'
import { showToast } from '../../src/services/notifications.js'

describe('hostelRecommendations', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('addRecommendation', () => {
    it('rejects missing fields', async () => {
      const result = await addRecommendation('', 'Hostel', 'party')
      expect(result).toBe(false)
      expect(showToast).toHaveBeenCalled()
    })

    it('rejects invalid category', async () => {
      const result = await addRecommendation('Paris', 'Generator', 'luxury')
      expect(result).toBe(false)
    })

    it('adds valid recommendation', async () => {
      const result = await addRecommendation('Paris', 'Generator', 'party')
      expect(result).toBe(true)
      const stored = JSON.parse(localStorage.getItem('spothitch_hostel_recs'))
      expect(stored.length).toBe(1)
      expect(stored[0].hostelName).toBe('Generator')
      expect(stored[0].city).toBe('Paris')
      expect(stored[0].category).toBe('party')
    })

    it('prevents duplicate recommendations', async () => {
      await addRecommendation('Paris', 'Generator', 'party')
      const result = await addRecommendation('Paris', 'Generator', 'cozy')
      expect(result).toBe(false)
    })

    it('duplicate detection is case insensitive', async () => {
      await addRecommendation('Paris', 'Generator', 'party')
      const result = await addRecommendation('paris', 'generator', 'budget')
      expect(result).toBe(false)
    })

    it('allows different hostels in same city', async () => {
      await addRecommendation('Paris', 'Generator', 'party')
      const result = await addRecommendation('Paris', "St Christopher's", 'budget')
      expect(result).toBe(true)
      const stored = JSON.parse(localStorage.getItem('spothitch_hostel_recs'))
      expect(stored.length).toBe(2)
    })

    it('trims city and hostel name', async () => {
      await addRecommendation('  Paris  ', '  Generator  ', 'party')
      const stored = JSON.parse(localStorage.getItem('spothitch_hostel_recs'))
      expect(stored[0].city).toBe('Paris')
      expect(stored[0].hostelName).toBe('Generator')
    })

    it('sets initial upvotes to 0', async () => {
      await addRecommendation('Paris', 'Generator', 'party')
      const stored = JSON.parse(localStorage.getItem('spothitch_hostel_recs'))
      expect(stored[0].upvotes).toBe(0)
    })
  })

  describe('getBookingLinks', () => {
    it('returns hostelworld and booking links', () => {
      const links = getBookingLinks('Generator', 'Paris')
      expect(links.hostelworld).toContain('hostelworld.com')
      expect(links.hostelworld).toContain('Generator')
      expect(links.hostelworld).toContain('Paris')
      expect(links.booking).toContain('booking.com')
      expect(links.booking).toContain('Generator')
    })

    it('encodes special characters in URL', () => {
      const links = getBookingLinks("St Christopher's Inn", 'Paris')
      expect(links.hostelworld).toContain(encodeURIComponent("St Christopher's Inn Paris"))
    })

    it('includes affiliate IDs', () => {
      const links = getBookingLinks('Generator', 'Paris')
      expect(links.hostelworld).toContain('affiliate=')
      expect(links.booking).toContain('aid=')
    })
  })

  describe('upvoteRecommendation', () => {
    it('upvotes an existing recommendation', async () => {
      await addRecommendation('Paris', 'Generator', 'party')
      vi.clearAllMocks()
      const result = await upvoteRecommendation('Paris', 'Generator')
      expect(result).toBe(true)
      const stored = JSON.parse(localStorage.getItem('spothitch_hostel_recs'))
      expect(stored[0].upvotes).toBe(1)
    })

    it('prevents double upvote', async () => {
      await addRecommendation('Paris', 'Generator', 'party')
      await upvoteRecommendation('Paris', 'Generator')
      vi.clearAllMocks()
      const result = await upvoteRecommendation('Paris', 'Generator')
      expect(result).toBe(false)
    })

    it('returns false for non-existent hostel', async () => {
      const result = await upvoteRecommendation('Paris', 'Unknown')
      expect(result).toBe(false)
    })
  })
})
