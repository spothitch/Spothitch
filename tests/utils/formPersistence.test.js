import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('../../src/utils/icons.js', () => ({
  icon: vi.fn((name) => `<svg>${name}</svg>`),
}))
vi.mock('../../src/i18n/index.js', () => ({
  t: vi.fn((key) => key),
}))

import {
  saveDraft,
  loadDraft,
  clearDraft,
  hasDraft,
  cleanupDrafts,
  renderDraftBanner,
  autoSaveForm,
} from '../../src/utils/formPersistence.js'

describe('formPersistence', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('saveDraft', () => {
    it('saves data to localStorage', () => {
      saveDraft('addSpot', { city: 'Paris', direction: 'Lyon' })
      const raw = localStorage.getItem('spothitch_draft_addSpot')
      expect(raw).toBeTruthy()
      const parsed = JSON.parse(raw)
      expect(parsed.data.city).toBe('Paris')
    })

    it('includes timestamp', () => {
      saveDraft('review', { rating: 5 })
      const parsed = JSON.parse(localStorage.getItem('spothitch_draft_review'))
      expect(parsed.timestamp).toBeDefined()
      expect(typeof parsed.timestamp).toBe('number')
    })

    it('overwrites previous draft for same formId', () => {
      saveDraft('addSpot', { city: 'Paris' })
      saveDraft('addSpot', { city: 'Berlin' })
      const data = loadDraft('addSpot')
      expect(data.city).toBe('Berlin')
    })
  })

  describe('loadDraft', () => {
    it('returns null when no draft exists', () => {
      expect(loadDraft('nonexistent')).toBeNull()
    })

    it('loads saved data', () => {
      saveDraft('addSpot', { city: 'Paris', rating: 4 })
      const data = loadDraft('addSpot')
      expect(data.city).toBe('Paris')
      expect(data.rating).toBe(4)
    })

    it('returns null for expired drafts (> 24h)', () => {
      const expired = {
        data: { city: 'Paris' },
        timestamp: Date.now() - 25 * 60 * 60 * 1000, // 25 hours ago
      }
      localStorage.setItem('spothitch_draft_addSpot', JSON.stringify(expired))
      expect(loadDraft('addSpot')).toBeNull()
    })

    it('returns data for non-expired drafts', () => {
      const fresh = {
        data: { city: 'Paris' },
        timestamp: Date.now() - 1 * 60 * 60 * 1000, // 1 hour ago
      }
      localStorage.setItem('spothitch_draft_addSpot', JSON.stringify(fresh))
      expect(loadDraft('addSpot')).toEqual({ city: 'Paris' })
    })

    it('removes expired draft from storage', () => {
      const expired = {
        data: { city: 'Paris' },
        timestamp: Date.now() - 25 * 60 * 60 * 1000,
      }
      localStorage.setItem('spothitch_draft_addSpot', JSON.stringify(expired))
      loadDraft('addSpot')
      expect(localStorage.getItem('spothitch_draft_addSpot')).toBeNull()
    })

    it('returns null for corrupt JSON', () => {
      localStorage.setItem('spothitch_draft_addSpot', 'not-json')
      expect(loadDraft('addSpot')).toBeNull()
    })
  })

  describe('clearDraft', () => {
    it('removes draft from localStorage', () => {
      saveDraft('addSpot', { city: 'Paris' })
      clearDraft('addSpot')
      expect(localStorage.getItem('spothitch_draft_addSpot')).toBeNull()
    })

    it('no-op when no draft exists', () => {
      clearDraft('nonexistent') // should not throw
      expect(localStorage.getItem('spothitch_draft_nonexistent')).toBeNull()
    })
  })

  describe('hasDraft', () => {
    it('returns false when no draft', () => {
      expect(hasDraft('addSpot')).toBe(false)
    })

    it('returns true when draft exists', () => {
      saveDraft('addSpot', { city: 'Paris' })
      expect(hasDraft('addSpot')).toBe(true)
    })

    it('returns false for expired draft', () => {
      const expired = {
        data: { city: 'Paris' },
        timestamp: Date.now() - 25 * 60 * 60 * 1000,
      }
      localStorage.setItem('spothitch_draft_addSpot', JSON.stringify(expired))
      expect(hasDraft('addSpot')).toBe(false)
    })
  })

  describe('cleanupDrafts', () => {
    it('does not throw when called with no drafts', () => {
      expect(() => cleanupDrafts()).not.toThrow()
    })

    it('keeps fresh drafts accessible', () => {
      saveDraft('fresh', { city: 'Paris' })
      cleanupDrafts()
      expect(hasDraft('fresh')).toBe(true)
    })

    it('does not throw with an expired draft in localStorage', () => {
      const expiredDraft = { data: { city: 'Berlin' }, timestamp: Date.now() - 25 * 60 * 60 * 1000 }
      localStorage.setItem('spothitch_draft_expired', JSON.stringify(expiredDraft))
      expect(() => cleanupDrafts()).not.toThrow()
    })

    it('does not throw with corrupt JSON in draft slot', () => {
      localStorage.setItem('spothitch_draft_corrupt', 'bad-json{')
      expect(() => cleanupDrafts()).not.toThrow()
    })

    it('does not throw with a mix of fresh and expired drafts', () => {
      saveDraft('fresh2', { city: 'Paris' })
      const expiredDraft = { data: { city: 'Old' }, timestamp: Date.now() - 26 * 60 * 60 * 1000 }
      localStorage.setItem('spothitch_draft_old2', JSON.stringify(expiredDraft))
      expect(() => cleanupDrafts()).not.toThrow()
      // Fresh draft remains accessible via its own getter
      expect(hasDraft('fresh2')).toBe(true)
    })
  })

  describe('autoSaveForm', () => {
    it('returns a cleanup function when form not found', () => {
      const cleanup = autoSaveForm('missing', '#nonexistent-form', ['city'])
      expect(typeof cleanup).toBe('function')
    })

    it('cleanup function from missing form can be called without error', () => {
      const cleanup = autoSaveForm('missing2', '#nonexistent-form2', ['city'])
      expect(() => cleanup()).not.toThrow()
    })

    it('restores draft values to form fields on init', () => {
      saveDraft('testForm', { city: 'Lyon', direction: 'Paris' })
      const form = document.createElement('form')
      form.id = 'test-form-restore'
      const input = document.createElement('input')
      input.name = 'city'
      form.appendChild(input)
      document.body.appendChild(form)

      autoSaveForm('testForm', '#test-form-restore', ['city', 'direction'])
      expect(input.value).toBe('Lyon')

      document.body.removeChild(form)
    })

    it('saves draft when input event fires', () => {
      const form = document.createElement('form')
      form.id = 'test-form-save'
      const input = document.createElement('input')
      input.name = 'destination'
      input.value = 'Berlin'
      form.appendChild(input)
      document.body.appendChild(form)

      autoSaveForm('saveTest', '#test-form-save', ['destination'])
      // Simulate input event
      form.dispatchEvent(new Event('input'))
      expect(hasDraft('saveTest')).toBe(true)

      document.body.removeChild(form)
    })

    it('returns cleanup function that removes event listeners', () => {
      const form = document.createElement('form')
      form.id = 'test-form-cleanup'
      document.body.appendChild(form)

      const cleanup = autoSaveForm('cleanupTest', '#test-form-cleanup', [])
      expect(typeof cleanup).toBe('function')
      expect(() => cleanup()).not.toThrow()

      document.body.removeChild(form)
    })
  })

  describe('renderDraftBanner', () => {
    it('returns empty string when no draft', () => {
      expect(renderDraftBanner('addSpot')).toBe('')
    })

    it('returns HTML banner when draft exists', () => {
      saveDraft('addSpot', { city: 'Paris' })
      const html = renderDraftBanner('addSpot')
      expect(html).toContain('draftRestored')
      expect(html).toContain('clearDraft')
    })
  })
})
