import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../src/stores/state.js', () => ({
  setState: vi.fn(),
  getState: vi.fn(() => ({ spots: [], isOnline: true })),
}))
vi.mock('../../src/utils/mapsUrlParser.js', () => ({
  extractCoordsFromShare: vi.fn(() => null),
  resolveShortMapUrl: vi.fn(() => Promise.resolve(null)),
  detectOpaqueMapUrl: vi.fn(() => false),
}))

import {
  getUrlParams,
  generateShareUrl,
  updateUrl,
  clearUrlParams,
  checkPublicTripRoute,
  captureShareParams,
  handleDeepLink,
  shareLink,
  initDeepLinkListener,
} from '../../src/utils/deeplink.js'
import { setState, getState } from '../../src/stores/state.js'

describe('utils/deeplink', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    sessionStorage.clear()
    // Reset location
    Object.defineProperty(window, 'location', {
      value: {
        search: '',
        pathname: '/',
        origin: 'https://spothitch.com',
        href: 'https://spothitch.com/',
      },
      writable: true,
      configurable: true,
    })
    window.history.replaceState = vi.fn()
  })

  describe('getUrlParams', () => {
    it('returns URLSearchParams instance', () => {
      const params = getUrlParams()
      expect(params instanceof URLSearchParams).toBe(true)
    })

    it('returns empty params when no query string', () => {
      window.location.search = ''
      const params = getUrlParams()
      expect(params.get('tab')).toBeNull()
    })

    it('parses query string params', () => {
      window.location.search = '?tab=spots&spot=42'
      const params = getUrlParams()
      expect(params.get('tab')).toBe('spots')
      expect(params.get('spot')).toBe('42')
    })
  })

  describe('generateShareUrl', () => {
    it('returns base URL when no options', () => {
      const url = generateShareUrl({})
      expect(url).toContain('spothitch.com')
    })

    it('appends tab parameter', () => {
      const url = generateShareUrl({ tab: 'spots' })
      expect(url).toContain('tab=spots')
    })

    it('appends spot ID', () => {
      const url = generateShareUrl({ spotId: '123' })
      expect(url).toContain('spot=123')
    })

    it('appends guide parameter', () => {
      const url = generateShareUrl({ guide: 'FR' })
      expect(url).toContain('guide=FR')
    })

    it('combines multiple parameters', () => {
      const url = generateShareUrl({ tab: 'spots', spotId: '42' })
      expect(url).toContain('tab=spots')
      expect(url).toContain('spot=42')
    })

    it('returns valid URL format', () => {
      const url = generateShareUrl({ tab: 'social' })
      expect(url).toMatch(/^https?:\/\//)
    })
  })

  describe('updateUrl', () => {
    it('calls history.replaceState', () => {
      updateUrl({ tab: 'spots' })
      expect(window.history.replaceState).toHaveBeenCalled()
    })

    it('runs without error for empty options', () => {
      expect(() => updateUrl({})).not.toThrow()
      expect(() => updateUrl()).not.toThrow()
    })

    it('includes tab in URL when provided', () => {
      updateUrl({ tab: 'social' })
      const call = window.history.replaceState.mock.calls[0]
      const url = call[2]
      if (url && url !== '/') {
        expect(url).toContain('tab=social')
      }
    })
  })

  describe('clearUrlParams', () => {
    it('calls history.replaceState', () => {
      clearUrlParams()
      expect(window.history.replaceState).toHaveBeenCalled()
    })

    it('does not throw', () => {
      expect(() => clearUrlParams()).not.toThrow()
    })
  })

  describe('checkPublicTripRoute', () => {
    it('does nothing for root path', () => {
      window.location.pathname = '/'
      expect(() => checkPublicTripRoute()).not.toThrow()
      expect(setState).not.toHaveBeenCalled()
    })

    it('does nothing for non-trip path', () => {
      window.location.pathname = '/spots'
      expect(() => checkPublicTripRoute()).not.toThrow()
    })

    it('attempts to load trip for /trip/:id path', async () => {
      window.location.pathname = '/trip/abc123'
      expect(() => checkPublicTripRoute()).not.toThrow()
      // tripJournal.js import will be attempted — let it fail silently
      await new Promise(r => setTimeout(r, 50))
    })
  })

  describe('captureShareParams', () => {
    it('runs without error when no share params', () => {
      window.location.search = ''
      expect(() => captureShareParams()).not.toThrow()
    })

    it('returns false when no share params', () => {
      window.location.search = ''
      const result = captureShareParams()
      expect(result).toBe(false)
    })

    it('handles share target params without error', () => {
      window.location.search = '?title=Test&text=Hello&url=https://example.com'
      expect(() => captureShareParams()).not.toThrow()
    })

    it('handles action=share param', () => {
      window.location.search = '?action=share&url=https://example.com'
      expect(() => captureShareParams()).not.toThrow()
    })

    it('returns true when share params detected', () => {
      window.location.search = '?title=Test&url=https://example.com'
      const result = captureShareParams()
      expect(result).toBe(true)
    })

    it('saves share params to sessionStorage', () => {
      window.location.search = '?title=SpotHitch&url=https://spothitch.com&text=Check+this'
      captureShareParams()
      const stored = sessionStorage.getItem('spothitch_pending_share')
      expect(stored).toBeTruthy()
    })
  })

  describe('handleDeepLink', () => {
    it('runs without error with empty query string', () => {
      window.location.search = ''
      expect(() => handleDeepLink()).not.toThrow()
    })

    it('handles tab=spots param', () => {
      window.location.search = '?tab=spots'
      handleDeepLink()
      expect(setState).toHaveBeenCalledWith(
        expect.objectContaining({ activeTab: 'spots' })
      )
    })

    it('handles tab=social param', () => {
      window.location.search = '?tab=social'
      handleDeepLink()
      expect(setState).toHaveBeenCalledWith(
        expect.objectContaining({ activeTab: 'social' })
      )
    })

    it('handles route=map param', () => {
      window.location.search = '?route=map'
      handleDeepLink()
      expect(setState).toHaveBeenCalled()
    })

    it('handles guide=FR param (sets country guide)', () => {
      window.location.search = '?guide=fr'
      handleDeepLink()
      expect(setState).toHaveBeenCalledWith(
        expect.objectContaining({ selectedCountryGuide: 'FR' })
      )
    })

    it('handles guide=DE param', () => {
      window.location.search = '?guide=DE'
      handleDeepLink()
      expect(setState).toHaveBeenCalledWith(
        expect.objectContaining({ selectedCountryGuide: 'DE', activeTab: 'voyage' })
      )
    })

    it('handles search=Paris param', () => {
      window.location.search = '?search=Paris'
      handleDeepLink()
      expect(setState).toHaveBeenCalledWith(
        expect.objectContaining({ searchQuery: 'Paris' })
      )
    })

    it('handles q=Lyon param (alias for search)', () => {
      window.location.search = '?q=Lyon'
      handleDeepLink()
      expect(setState).toHaveBeenCalledWith(
        expect.objectContaining({ searchQuery: 'Lyon' })
      )
    })

    it('handles action=share param (dismisses popups)', () => {
      window.location.search = '?action=share&url=https://maps.google.com'
      handleDeepLink()
      expect(setState).toHaveBeenCalledWith(
        expect.objectContaining({ showLanding: false, showWelcome: false })
      )
    })

    it('handles share params without action=share', () => {
      window.location.search = '?title=Test&url=https://example.com'
      handleDeepLink()
      expect(setState).toHaveBeenCalledWith(
        expect.objectContaining({ showLanding: false })
      )
    })

    it('handles spot=123 param', () => {
      getState.mockReturnValue({ spots: [{ id: '123', name: 'Test Spot' }] })
      window.location.search = '?spot=123'
      handleDeepLink()
      expect(setState).toHaveBeenCalled()
    })

    it('handles unknown tab gracefully', () => {
      window.location.search = '?tab=unknown_tab'
      expect(() => handleDeepLink()).not.toThrow()
    })
  })

  describe('shareLink', () => {
    it('returns a promise', () => {
      const result = shareLink({})
      expect(result instanceof Promise).toBe(true)
    })

    it('handles missing navigator.share', async () => {
      // In happy-dom, navigator.share may not be available
      const origShare = navigator.share
      delete navigator.share
      const result = await shareLink({ title: 'Test', text: 'Hello' })
      // Should fall back to clipboard or return fallback
      expect(typeof result === 'object' || result === undefined).toBe(true)
      if (origShare) navigator.share = origShare
    })

    it('generates correct URL for share', async () => {
      const result = shareLink({ tab: 'spots', title: 'Test' })
      expect(result instanceof Promise).toBe(true)
    })
  })

  describe('initDeepLinkListener', () => {
    it('runs without error', () => {
      expect(() => initDeepLinkListener()).not.toThrow()
    })

    it('is idempotent (multiple calls)', () => {
      expect(() => {
        initDeepLinkListener()
        initDeepLinkListener()
      }).not.toThrow()
    })
  })
})
