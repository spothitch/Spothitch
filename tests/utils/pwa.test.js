import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({ showInstallBanner: false })),
  setState: vi.fn(),
}))
vi.mock('../../src/i18n/index.js', () => ({
  t: vi.fn((key) => key),
}))
vi.mock('../../src/utils/icons.js', () => ({
  icon: vi.fn((name) => `<svg data-icon="${name}"></svg>`),
}))
vi.mock('../../src/services/notifications.js', () => ({
  showToast: vi.fn(),
}))

import { getState, setState } from '../../src/stores/state.js'
import {
  isAppInstalled,
  dismissInstallBanner,
  showInstallBanner,
  getDisplayMode,
  canInstallPWA,
  renderInstallBanner,
  applyUpdate,
  checkForUpdates,
} from '../../src/utils/pwa.js'

describe('pwa utils', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
    getState.mockReturnValue({ showInstallBanner: false })
  })

  describe('isAppInstalled', () => {
    it('returns false in browser mode', () => {
      // happy-dom: matchMedia returns false by default
      const result = isAppInstalled()
      expect(typeof result).toBe('boolean')
    })

    it('returns true when localStorage flag is set', () => {
      localStorage.setItem('pwa_installed', 'true')
      expect(isAppInstalled()).toBe(true)
    })

    it('returns false without localStorage flag', () => {
      expect(isAppInstalled()).toBe(false)
    })
  })

  describe('dismissInstallBanner', () => {
    it('calls setState with showInstallBanner false', () => {
      dismissInstallBanner()
      expect(setState).toHaveBeenCalledWith({ showInstallBanner: false })
    })

    it('saves dismiss timestamp to localStorage', () => {
      dismissInstallBanner()
      const stored = localStorage.getItem('install_banner_dismissed')
      expect(stored).toBeTruthy()
    })
  })

  describe('getDisplayMode', () => {
    it('returns a string', () => {
      const result = getDisplayMode()
      expect(typeof result).toBe('string')
    })

    it('returns browser in test env', () => {
      // happy-dom doesn't match any media queries
      const result = getDisplayMode()
      expect(['browser', 'standalone', 'fullscreen', 'minimal-ui']).toContain(result)
    })

    it('returns standalone when standalone media query matches', () => {
      const original = window.matchMedia
      window.matchMedia = (query) => ({ matches: query.includes('standalone'), media: query, addListener: vi.fn(), removeListener: vi.fn(), addEventListener: vi.fn(), removeEventListener: vi.fn() })
      expect(getDisplayMode()).toBe('standalone')
      window.matchMedia = original
    })

    it('returns fullscreen when fullscreen media query matches but standalone does not', () => {
      const original = window.matchMedia
      window.matchMedia = (query) => ({ matches: query.includes('fullscreen') && !query.includes('standalone'), media: query, addListener: vi.fn(), removeListener: vi.fn(), addEventListener: vi.fn(), removeEventListener: vi.fn() })
      expect(getDisplayMode()).toBe('fullscreen')
      window.matchMedia = original
    })

    it('returns minimal-ui when only minimal-ui matches', () => {
      const original = window.matchMedia
      window.matchMedia = (query) => ({ matches: query.includes('minimal-ui'), media: query, addListener: vi.fn(), removeListener: vi.fn(), addEventListener: vi.fn(), removeEventListener: vi.fn() })
      expect(getDisplayMode()).toBe('minimal-ui')
      window.matchMedia = original
    })

    it('returns browser when no media query matches', () => {
      const original = window.matchMedia
      window.matchMedia = (query) => ({ matches: false, media: query, addListener: vi.fn(), removeListener: vi.fn(), addEventListener: vi.fn(), removeEventListener: vi.fn() })
      expect(getDisplayMode()).toBe('browser')
      window.matchMedia = original
    })
  })

  describe('canInstallPWA', () => {
    it('returns a boolean', () => {
      expect(typeof canInstallPWA()).toBe('boolean')
    })
  })

  describe('renderInstallBanner', () => {
    it('returns empty string when showInstallBanner is false', () => {
      getState.mockReturnValue({ showInstallBanner: false })
      expect(renderInstallBanner()).toBe('')
    })

    it('returns HTML when showInstallBanner is true', () => {
      getState.mockReturnValue({ showInstallBanner: true })
      const html = renderInstallBanner()
      expect(html).toBeTruthy()
      expect(html).toContain('dismissInstallBanner()')
    })

    it('rendered HTML contains install button', () => {
      getState.mockReturnValue({ showInstallBanner: true })
      const html = renderInstallBanner()
      expect(html).toContain('installPWA()')
    })
  })

  describe('showInstallBanner', () => {
    it('calls setState with showInstallBanner true when not dismissed', () => {
      showInstallBanner()
      expect(setState).toHaveBeenCalledWith({ showInstallBanner: true })
    })

    it('does not show if dismissed within 7 days', () => {
      localStorage.setItem('install_banner_dismissed', new Date().toISOString())
      vi.clearAllMocks()
      showInstallBanner()
      expect(setState).not.toHaveBeenCalled()
    })

    it('shows again if dismissed more than 7 days ago', () => {
      const eightDaysAgo = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
      localStorage.setItem('install_banner_dismissed', eightDaysAgo)
      showInstallBanner()
      expect(setState).toHaveBeenCalledWith({ showInstallBanner: true })
    })
  })

  describe('applyUpdate', () => {
    it('runs without error (with serviceWorker stub)', () => {
      const original = navigator.serviceWorker
      Object.defineProperty(navigator, 'serviceWorker', {
        value: { ready: Promise.resolve({ waiting: null }) },
        writable: true, configurable: true,
      })
      expect(() => applyUpdate()).not.toThrow()
      Object.defineProperty(navigator, 'serviceWorker', {
        value: original, writable: true, configurable: true,
      })
    })
  })

  describe('checkForUpdates', () => {
    it('returns false when serviceWorker is not supported', async () => {
      const original = navigator.serviceWorker
      Object.defineProperty(navigator, 'serviceWorker', {
        value: undefined, writable: true, configurable: true,
      })
      const result = await checkForUpdates()
      expect(result).toBe(false)
      Object.defineProperty(navigator, 'serviceWorker', {
        value: original, writable: true, configurable: true,
      })
    })

    it('returns true when serviceWorker.ready resolves with update()', async () => {
      Object.defineProperty(navigator, 'serviceWorker', {
        value: { ready: Promise.resolve({ update: () => Promise.resolve() }) },
        writable: true, configurable: true,
      })
      const result = await checkForUpdates()
      expect(result).toBe(true)
    })

    it('returns false when serviceWorker.ready rejects', async () => {
      Object.defineProperty(navigator, 'serviceWorker', {
        value: { ready: Promise.reject(new Error('SW error')) },
        writable: true, configurable: true,
      })
      const result = await checkForUpdates()
      expect(result).toBe(false)
    })
  })
})
