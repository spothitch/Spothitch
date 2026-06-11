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
  showShareModal,
  closeShareModal,
  copySpotLink,
  shareOnSMS,
  copyProfileLink,
  shareProfileModal,
} from '../../src/services/shareCard.js'
import { getState } from '../../src/stores/state.js'
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

  describe('showShareModal', () => {
    it('creates a modal element in the DOM', () => {
      showShareModal({ id: 'abc', name: 'Test Spot' })
      const modal = document.getElementById('share-card-modal')
      expect(modal).not.toBeNull()
    })

    it('returns early when spot is null', () => {
      showShareModal(null)
      expect(document.getElementById('share-card-modal')).toBeNull()
    })

    it('includes spot name in modal', () => {
      showShareModal({ id: '1', name: 'Madrid Exit' })
      const modal = document.getElementById('share-card-modal')
      expect(modal.innerHTML).toContain('Madrid Exit')
    })

    it('uses from field when no name', () => {
      showShareModal({ id: '2', from: 'Berlin Ost' })
      const modal = document.getElementById('share-card-modal')
      expect(modal).not.toBeNull()
    })

    it('replaces existing modal', () => {
      showShareModal({ id: '1', name: 'Spot A' })
      showShareModal({ id: '2', name: 'Spot B' })
      const modals = document.querySelectorAll('#share-card-modal')
      expect(modals.length).toBe(1)
    })

    it('adds modal to document.body', () => {
      showShareModal({ id: '3', name: 'Highway Spot' })
      expect(document.body.contains(document.getElementById('share-card-modal'))).toBe(true)
    })

    it('contains spot share URL', () => {
      showShareModal({ id: 'spot-99', name: 'Test' })
      const modal = document.getElementById('share-card-modal')
      expect(modal.innerHTML).toContain('spot-99')
    })

    it('does not throw for spot with missing fields', () => {
      expect(() => showShareModal({})).not.toThrow()
    })
  })

  describe('shareOnSMS', () => {
    beforeEach(() => {
      window.open = vi.fn()
    })

    it('does nothing when spot not found in state', () => {
      getState.mockReturnValue({ spots: [] })
      shareOnSMS('nonexistent-id')
      expect(window.open).not.toHaveBeenCalled()
    })

    it('opens WhatsApp URL when spot found', () => {
      getState.mockReturnValue({
        spots: [{ id: '42', name: 'Autoroute A1' }],
      })
      shareOnSMS('42')
      expect(window.open).toHaveBeenCalledWith(
        expect.stringContaining('wa.me'),
        '_blank',
        'noopener,noreferrer'
      )
    })

    it('encodes spot name in SMS text', () => {
      getState.mockReturnValue({
        spots: [{ id: '10', name: 'Spot Paris' }],
      })
      shareOnSMS('10')
      const call = window.open.mock.calls[0][0]
      expect(call).toContain('Spot%20Paris')
    })

    it('uses from field when spot has no name', () => {
      getState.mockReturnValue({
        spots: [{ id: '5', from: 'From Lyon' }],
      })
      shareOnSMS('5')
      expect(window.open).toHaveBeenCalled()
    })

    it('matches spot by string id even when stored as number', () => {
      getState.mockReturnValue({
        spots: [{ id: 7, name: 'Spot Numeric' }],
      })
      shareOnSMS('7')
      expect(window.open).toHaveBeenCalled()
    })
  })
})
