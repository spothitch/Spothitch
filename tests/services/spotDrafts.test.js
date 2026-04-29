import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock dependencies
vi.mock('../../src/stores/state.js', () => ({
  setState: vi.fn(),
  getState: vi.fn(() => ({})),
}))
vi.mock('../../src/services/notifications.js', () => ({
  showInfo: vi.fn(),
}))
vi.mock('../../src/i18n/index.js', () => ({
  t: vi.fn((key) => key),
}))
vi.mock('../../src/utils/icons.js', () => ({
  icon: vi.fn((name) => `<svg>${name}</svg>`),
}))

import {
  saveSpotDraft,
  getSpotDrafts,
  deleteSpotDraft,
  cleanupExpiredDrafts,
  renderDraftBanner,
} from '../../src/services/spotDrafts.js'

describe('spotDrafts', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('saveSpotDraft', () => {
    it('saves a draft and returns an id', () => {
      const id = saveSpotDraft({ departureCity: 'Paris', directionCity: 'Lyon' })
      expect(id).toMatch(/^draft_/)
      expect(typeof id).toBe('string')
    })

    it('draft is retrievable after save', () => {
      saveSpotDraft({ departureCity: 'Paris' })
      const drafts = getSpotDrafts()
      expect(drafts.length).toBe(1)
      expect(drafts[0].departureCity).toBe('Paris')
    })

    it('adds createdAt and expiresAt timestamps', () => {
      saveSpotDraft({ departureCity: 'Paris' })
      const drafts = getSpotDrafts()
      expect(drafts[0].createdAt).toBeDefined()
      expect(drafts[0].expiresAt).toBeDefined()
      // expiresAt should be ~7 days in the future
      const expiry = new Date(drafts[0].expiresAt)
      const now = new Date()
      const diffDays = (expiry - now) / (1000 * 60 * 60 * 24)
      expect(diffDays).toBeGreaterThan(6.9)
      expect(diffDays).toBeLessThan(7.1)
    })

    it('saves multiple drafts', () => {
      saveSpotDraft({ departureCity: 'Paris' })
      saveSpotDraft({ departureCity: 'Lyon' })
      saveSpotDraft({ departureCity: 'Marseille' })
      expect(getSpotDrafts().length).toBe(3)
    })

    it('includes reminder timestamps', () => {
      saveSpotDraft({ departureCity: 'Berlin' })
      const drafts = getSpotDrafts()
      expect(drafts[0].reminders).toBeDefined()
      expect(drafts[0].reminders.oneHour).toBeDefined()
      expect(drafts[0].reminders.sixHours).toBeDefined()
    })
  })

  describe('getSpotDrafts', () => {
    it('returns empty array when no drafts', () => {
      expect(getSpotDrafts()).toEqual([])
    })

    it('filters out expired drafts', () => {
      const past = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
      const future = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString()
      localStorage.setItem('spothitch_spot_drafts', JSON.stringify([
        { id: 'old', expiresAt: past },
        { id: 'new', expiresAt: future },
      ]))
      const drafts = getSpotDrafts()
      expect(drafts.length).toBe(1)
      expect(drafts[0].id).toBe('new')
    })

    it('returns empty array on corrupt JSON', () => {
      localStorage.setItem('spothitch_spot_drafts', 'not-json')
      expect(getSpotDrafts()).toEqual([])
    })
  })

  describe('deleteSpotDraft', () => {
    it('removes a draft by id', () => {
      const id1 = saveSpotDraft({ departureCity: 'Paris' })
      const id2 = saveSpotDraft({ departureCity: 'Lyon' })
      deleteSpotDraft(id1)
      const drafts = getSpotDrafts()
      expect(drafts.length).toBe(1)
      expect(drafts[0].id).toBe(id2)
    })

    it('no-op when id does not exist', () => {
      saveSpotDraft({ departureCity: 'Paris' })
      deleteSpotDraft('nonexistent')
      expect(getSpotDrafts().length).toBe(1)
    })
  })

  describe('cleanupExpiredDrafts', () => {
    it('removes expired drafts from storage', () => {
      const past = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
      const future = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString()
      localStorage.setItem('spothitch_spot_drafts', JSON.stringify([
        { id: 'old', expiresAt: past },
        { id: 'new', expiresAt: future },
      ]))
      cleanupExpiredDrafts()
      const raw = JSON.parse(localStorage.getItem('spothitch_spot_drafts'))
      expect(raw.length).toBe(1)
      expect(raw[0].id).toBe('new')
    })
  })

  describe('renderDraftBanner', () => {
    it('returns empty string when no drafts', () => {
      expect(renderDraftBanner()).toBe('')
    })

    it('returns HTML with city name when draft exists', () => {
      saveSpotDraft({ departureCity: 'Paris', directionCity: 'Lyon' })
      const html = renderDraftBanner()
      expect(html).toContain('draft-banner')
      expect(html).toContain('Paris')
    })

    it('shows latest draft info', () => {
      saveSpotDraft({ departureCity: 'Paris' })
      saveSpotDraft({ departureCity: 'Berlin' })
      const html = renderDraftBanner()
      expect(html).toContain('Berlin')
    })
  })
})
