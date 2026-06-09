import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('../../src/utils/icons.js', () => ({
  icon: vi.fn((name) => `<svg data-icon="${name}"></svg>`),
}))
vi.mock('../../src/utils/sanitize.js', () => ({
  escapeJSString: vi.fn((s) => String(s || '')),
}))

import {
  detectPlatform,
  openInGoogleMaps,
  openInWaze,
  openInAppleMaps,
  openInNativeMaps,
  getAvailableNavigationApps,
  openInNavigationApp,
  showNavigationPicker,
  setPreferredNavigationApp,
  getPreferredNavigationApp,
  clearPreferredNavigationApp,
  renderNavigationPicker,
} from '../../src/utils/navigation.js'

describe('Navigation Utils', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.spyOn(window, 'open').mockImplementation(() => null)
    window.setState = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('detectPlatform', () => {
    it('returns platform object', () => {
      const p = detectPlatform()
      expect(p).toHaveProperty('isIOS')
      expect(p).toHaveProperty('isAndroid')
      expect(p).toHaveProperty('isDesktop')
      expect(p).toHaveProperty('isMac')
    })

    it('all flags are booleans', () => {
      const p = detectPlatform()
      expect(typeof p.isIOS).toBe('boolean')
      expect(typeof p.isAndroid).toBe('boolean')
      expect(typeof p.isDesktop).toBe('boolean')
    })

    it('isDesktop true when not iOS or Android', () => {
      const p = detectPlatform()
      if (!p.isIOS && !p.isAndroid) {
        expect(p.isDesktop).toBe(true)
      }
    })
  })

  describe('openInGoogleMaps', () => {
    it('rejects invalid coordinates', () => {
      expect(openInGoogleMaps(NaN, 2.35)).toBe(false)
      expect(openInGoogleMaps(48.85, NaN)).toBe(false)
      expect(openInGoogleMaps(Infinity, 2.35)).toBe(false)
      expect(openInGoogleMaps(-91, 2.35)).toBe(false)
      expect(openInGoogleMaps(48.85, 181)).toBe(false)
    })

    it('accepts valid coordinates', () => {
      const result = openInGoogleMaps(48.85, 2.35, 'Paris')
      expect(result).toBe(true)
      expect(window.open).toHaveBeenCalled()
    })

    it('includes coordinates in URL', () => {
      openInGoogleMaps(48.812, 2.322)
      const url = window.open.mock.calls[0][0]
      expect(url).toContain('48.812')
      expect(url).toContain('2.322')
    })
  })

  describe('openInWaze', () => {
    it('rejects invalid coordinates', () => {
      expect(openInWaze(NaN, 2.35)).toBe(false)
      expect(openInWaze(48.85, -181)).toBe(false)
      expect(openInWaze(95, 2.35)).toBe(false)
    })

    it('accepts valid coordinates', () => {
      const result = openInWaze(48.85, 2.35)
      expect(result).toBe(true)
      expect(window.open).toHaveBeenCalled()
    })

    it('includes waze.com in URL', () => {
      openInWaze(48.812, 2.322)
      const url = window.open.mock.calls[0][0]
      expect(url).toContain('waze.com')
    })
  })

  describe('openInAppleMaps', () => {
    it('returns false for missing coordinates', () => {
      expect(openInAppleMaps(null, null)).toBe(false)
      expect(openInAppleMaps(0, 0)).toBe(false)
    })

    it('returns a boolean for valid coords on non-Apple (falls back to Google)', () => {
      const result = openInAppleMaps(48.8, 2.3, 'Paris')
      expect(typeof result).toBe('boolean')
    })
  })

  describe('openInNativeMaps', () => {
    it('returns a boolean for valid coords', () => {
      const result = openInNativeMaps(48.8, 2.3, 'Paris')
      expect(typeof result).toBe('boolean')
    })
  })

  describe('getAvailableNavigationApps', () => {
    it('returns an array', () => {
      const apps = getAvailableNavigationApps()
      expect(Array.isArray(apps)).toBe(true)
    })

    it('includes Google Maps and Waze', () => {
      const apps = getAvailableNavigationApps()
      const ids = apps.map(a => a.id)
      expect(ids).toContain('google-maps')
      expect(ids).toContain('waze')
    })

    it('has at least 2 apps', () => {
      expect(getAvailableNavigationApps().length).toBeGreaterThanOrEqual(2)
    })

    it('each app has id, name, and bgClass', () => {
      for (const app of getAvailableNavigationApps()) {
        expect(app.id).toBeDefined()
        expect(app.name).toBeDefined()
        expect(app.bgClass).toBeDefined()
      }
    })
  })

  describe('openInNavigationApp', () => {
    it('opens Google Maps for google-maps id', () => {
      openInNavigationApp('google-maps', 48.8, 2.3)
      expect(window.open).toHaveBeenCalled()
    })

    it('opens Waze for waze id', () => {
      openInNavigationApp('waze', 48.8, 2.3)
      const url = window.open.mock.calls[0][0]
      expect(url).toContain('waze')
    })

    it('falls back to Google Maps for unknown id', () => {
      openInNavigationApp('unknown', 48.8, 2.3)
      expect(window.open).toHaveBeenCalled()
    })
  })

  describe('preferred navigation app', () => {
    it('set saves to localStorage', () => {
      setPreferredNavigationApp('waze')
      expect(localStorage.getItem('spothitch_preferred_nav_app')).toBe('waze')
    })

    it('get returns saved value', () => {
      setPreferredNavigationApp('google-maps')
      expect(getPreferredNavigationApp()).toBe('google-maps')
    })

    it('get returns null when nothing saved', () => {
      expect(getPreferredNavigationApp()).toBeNull()
    })

    it('clear removes from localStorage', () => {
      setPreferredNavigationApp('waze')
      clearPreferredNavigationApp()
      expect(getPreferredNavigationApp()).toBeNull()
    })
  })

  describe('showNavigationPicker', () => {
    it('uses preferred app directly if set', () => {
      setPreferredNavigationApp('google-maps')
      showNavigationPicker(48.8, 2.3, 'Paris')
      expect(window.open).toHaveBeenCalled()
    })

    it('shows picker modal when no preferred app', () => {
      showNavigationPicker(48.8, 2.3, 'Paris')
      expect(window.setState).toHaveBeenCalledWith(
        expect.objectContaining({ showNavigationPicker: true })
      )
    })

    it('passes lat/lng/name to picker data', () => {
      showNavigationPicker(48.812, 2.322, 'Lyon')
      const data = window.setState.mock.calls[0][0]
      expect(data.navigationPickerData.lat).toBe(48.812)
      expect(data.navigationPickerData.name).toBe('Lyon')
    })
  })

  describe('renderNavigationPicker', () => {
    it('returns empty string for missing coords', () => {
      expect(renderNavigationPicker({})).toBe('')
      expect(renderNavigationPicker(null)).toBe('')
    })

    it('renders HTML with valid coords', () => {
      const html = renderNavigationPicker({ lat: 48.8, lng: 2.3, name: 'Paris' })
      expect(html).toBeTruthy()
      expect(html.length).toBeGreaterThan(100)
    })

    it('renders dialog with navigation app buttons', () => {
      const html = renderNavigationPicker({ lat: 48.8, lng: 2.3, name: 'Paris' })
      expect(html).toContain('role="dialog"')
      expect(html).toContain('selectNavigationApp(')
    })

    it('renders close button', () => {
      const html = renderNavigationPicker({ lat: 48.8, lng: 2.3 })
      expect(html).toContain('closeNavigationPicker()')
    })

    it('renders spot name in picker', () => {
      const html = renderNavigationPicker({ lat: 48.8, lng: 2.3, name: 'Lyon' })
      expect(html).toContain('Lyon')
    })

    it('renders remember preference checkbox', () => {
      const html = renderNavigationPicker({ lat: 48.8, lng: 2.3 })
      expect(html).toContain('remember-nav-app')
    })
  })
})
