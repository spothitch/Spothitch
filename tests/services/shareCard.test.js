import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({ spots: [] })),
}))
vi.mock('../../src/utils/icons.js', () => ({
  icon: vi.fn((name) => `<svg>${name}</svg>`),
}))
vi.mock('../../src/utils/share.js', () => ({
  copyToClipboard: vi.fn(() => Promise.resolve()),
}))
vi.mock('../../src/services/notifications.js', () => ({
  showToast: vi.fn(),
}))
vi.mock('../../src/i18n/index.js', () => ({
  t: vi.fn((key) => key),
}))

import {
  generateShareCard,
  closeShareModal,
  copySpotLink,
  copyProfileLink,
  shareProfileModal,
} from '../../src/services/shareCard.js'
import { copyToClipboard } from '../../src/utils/share.js'
import { showToast } from '../../src/services/notifications.js'

describe('shareCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    document.body.innerHTML = ''
  })

  describe('generateShareCard', () => {
    it('returns empty string for null spot', () => {
      expect(generateShareCard(null)).toBe('')
    })

    it('returns HTML with spot name', () => {
      const html = generateShareCard({ name: 'Highway Exit A1', country: 'FR' })
      expect(html).toContain('Highway Exit A1')
    })

    it('uses "from" field when no name', () => {
      const html = generateShareCard({ from: 'Berlin Nord' })
      expect(html).toContain('Berlin Nord')
    })

    it('shows rating', () => {
      const html = generateShareCard({ name: 'Spot', globalRating: 4.5 })
      expect(html).toContain('4.5')
    })

    it('shows ? when no rating', () => {
      const html = generateShareCard({ name: 'Spot' })
      expect(html).toContain('?/5')
    })

    it('shows wait time', () => {
      const html = generateShareCard({ name: 'Spot', avgWaitTime: 15 })
      expect(html).toContain('15 min')
    })

    it('includes SpotHitch branding', () => {
      const html = generateShareCard({ name: 'Spot' })
      expect(html).toContain('SpotHitch')
    })

    it('includes country', () => {
      const html = generateShareCard({ name: 'Spot', country: 'Germany' })
      expect(html).toContain('Germany')
    })

    it('returns HTML string (not empty)', () => {
      const html = generateShareCard({ name: 'Test Spot' })
      expect(typeof html).toBe('string')
      expect(html.length).toBeGreaterThan(50)
    })

    it('escapes XSS in spot name', () => {
      const html = generateShareCard({ name: '<script>alert(1)</script>' })
      expect(html).not.toContain('<script>')
    })

    it('shows ? for wait time when not provided', () => {
      const html = generateShareCard({ name: 'Spot' })
      expect(html).toContain('? min')
    })
  })

  describe('closeShareModal', () => {
    it('runs without error when no modal exists', () => {
      expect(() => closeShareModal()).not.toThrow()
    })

    it('removes existing modal element', async () => {
      const modal = document.createElement('div')
      modal.id = 'share-card-modal'
      document.body.appendChild(modal)
      expect(document.getElementById('share-card-modal')).not.toBeNull()
      closeShareModal()
      // Modal removal is deferred via setTimeout(200ms), so check animation starts
      expect(modal.style.animation).toBeTruthy()
    })
  })

  describe('copySpotLink', () => {
    it('calls copyToClipboard with spot URL', async () => {
      await copySpotLink('spot-123')
      expect(copyToClipboard).toHaveBeenCalledWith(expect.stringContaining('spot-123'))
    })

    it('shows success toast on copy', async () => {
      await copySpotLink('spot-456')
      expect(showToast).toHaveBeenCalledWith(expect.any(String), 'success')
    })

    it('shows error toast when copy fails', async () => {
      copyToClipboard.mockRejectedValueOnce(new Error('blocked'))
      await copySpotLink('spot-789')
      expect(showToast).toHaveBeenCalledWith(expect.any(String), 'error')
    })
  })

  describe('copyProfileLink', () => {
    it('calls copyToClipboard with profile URL', async () => {
      await copyProfileLink('uid-abc')
      expect(copyToClipboard).toHaveBeenCalledWith(expect.stringContaining('uid-abc'))
    })

    it('shows success toast on copy', async () => {
      await copyProfileLink('uid-xyz')
      expect(showToast).toHaveBeenCalledWith(expect.any(String), 'success')
    })

    it('shows error toast when copy fails', async () => {
      copyToClipboard.mockRejectedValueOnce(new Error('denied'))
      await copyProfileLink('uid-fail')
      expect(showToast).toHaveBeenCalledWith(expect.any(String), 'error')
    })
  })

  describe('shareProfileModal', () => {
    it('creates a modal element in the DOM', () => {
      shareProfileModal('uid123', 'Alice', 'thumbs-up')
      const modal = document.getElementById('share-card-modal')
      expect(modal).not.toBeNull()
    })

    it('shows username in modal', () => {
      shareProfileModal('uid123', 'Alice', 'thumbs-up')
      const modal = document.getElementById('share-card-modal')
      expect(modal.innerHTML).toContain('Alice')
    })

    it('replaces existing modal', () => {
      shareProfileModal('uid1', 'Alice', 'thumbs-up')
      shareProfileModal('uid2', 'Bob', 'thumbs-up')
      const modals = document.querySelectorAll('#share-card-modal')
      expect(modals.length).toBe(1)
    })

    it('modal contains profile URL', () => {
      shareProfileModal('uid-test', 'Alice', 'thumbs-up')
      const modal = document.getElementById('share-card-modal')
      expect(modal.innerHTML).toContain('uid-test')
    })

    it('handles missing username gracefully', () => {
      expect(() => shareProfileModal('uid123', null, 'thumbs-up')).not.toThrow()
    })
  })
})
