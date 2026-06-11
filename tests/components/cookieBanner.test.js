/**
 * CookieBanner.js tests — hasConsent, getConsent, setConsent, acceptAllCookies,
 * refuseOptionalCookies, saveCustomPreferences, showCustomizeModal, hideCustomizeModal
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../src/i18n/index.js', () => ({ t: vi.fn((k) => k) }))
vi.mock('../../src/utils/icons.js', () => ({ icon: vi.fn(() => '<svg></svg>') }))
vi.mock('../../src/utils/storage.js', () => ({
  Storage: {
    get: vi.fn(() => null),
    set: vi.fn(() => true),
  },
}))

import { afterEach } from 'vitest'
import {
  hasConsent, getConsent, setConsent,
  acceptAllCookies, refuseOptionalCookies, saveCustomPreferences,
  showCustomizeModal, hideCustomizeModal,
} from '../../src/components/modals/CookieBanner.js'
import { Storage } from '../../src/utils/storage.js'

describe('hasConsent', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('returns false when no consent stored', () => {
    Storage.get.mockReturnValue(null)
    expect(hasConsent()).toBe(false)
  })

  it('returns false when consent has no timestamp', () => {
    Storage.get.mockReturnValue({ preferences: {} })
    expect(hasConsent()).toBe(false)
  })

  it('returns true when consent is fresh', () => {
    Storage.get.mockReturnValue({ timestamp: Date.now(), preferences: {} })
    expect(hasConsent()).toBe(true)
  })

  it('returns false and clears consent when older than 13 months', () => {
    const OLD = Date.now() - (14 * 30 * 24 * 60 * 60 * 1000)
    Storage.get.mockReturnValue({ timestamp: OLD, preferences: {} })
    expect(hasConsent()).toBe(false)
    expect(Storage.set).toHaveBeenCalledWith('cookie_consent', null)
  })
})

describe('getConsent', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('returns default preferences when no consent stored', () => {
    Storage.get.mockReturnValue(null)
    const c = getConsent()
    expect(c.necessary).toBe(true)
    expect(c.analytics).toBe(false)
  })

  it('returns stored preferences with necessary always true', () => {
    Storage.get.mockReturnValue({ preferences: { necessary: false, analytics: true } })
    const c = getConsent()
    expect(c.necessary).toBe(true)
    expect(c.analytics).toBe(true)
  })
})

describe('setConsent', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('saves consent with necessary always true', () => {
    setConsent({ necessary: false, analytics: true })
    expect(Storage.set).toHaveBeenCalledWith('cookie_consent', expect.objectContaining({
      preferences: expect.objectContaining({ necessary: true, analytics: true }),
      version: '1.0',
    }))
  })

  it('includes a timestamp', () => {
    const before = Date.now()
    setConsent({ analytics: false })
    const call = Storage.set.mock.calls[0][1]
    expect(call.timestamp).toBeGreaterThanOrEqual(before)
  })
})

describe('acceptAllCookies', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    document.body.innerHTML = '<div id="cookie-banner"></div>'
  })

  it('saves consent with all categories true', () => {
    acceptAllCookies()
    expect(Storage.set).toHaveBeenCalledWith('cookie_consent', expect.objectContaining({
      preferences: expect.objectContaining({
        necessary: true, analytics: true, marketing: true, personalization: true,
      }),
    }))
  })
})

describe('refuseOptionalCookies', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    document.body.innerHTML = '<div id="cookie-banner"></div>'
  })

  it('saves consent with only necessary true', () => {
    refuseOptionalCookies()
    expect(Storage.set).toHaveBeenCalledWith('cookie_consent', expect.objectContaining({
      preferences: expect.objectContaining({
        necessary: true, analytics: false, marketing: false, personalization: false,
      }),
    }))
  })
})

describe('saveCustomPreferences', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    document.body.innerHTML = `
      <div id="cookie-banner"></div>
      <div id="cookie-customize-modal" class="hidden"></div>
      <input id="cookie-analytics" type="checkbox" />
      <input id="cookie-marketing" type="checkbox" checked />
      <input id="cookie-personalization" type="checkbox" />
    `
    Storage.get.mockReturnValue({ preferences: { analytics: false } })
  })

  it('reads checkboxes and saves preferences', () => {
    saveCustomPreferences()
    expect(Storage.set).toHaveBeenCalledWith('cookie_consent', expect.objectContaining({
      preferences: expect.objectContaining({ analytics: false, marketing: true }),
    }))
  })
})

describe('showCustomizeModal / hideCustomizeModal', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    document.body.innerHTML = `<div id="cookie-customize-modal" class="hidden"></div>`
  })
  afterEach(() => { vi.useRealTimers() })

  it('showCustomizeModal removes hidden class', () => {
    showCustomizeModal()
    expect(document.getElementById('cookie-customize-modal').classList.contains('hidden')).toBe(false)
  })

  it('hideCustomizeModal adds hidden class after 300ms timeout', () => {
    const modal = document.getElementById('cookie-customize-modal')
    modal.classList.remove('hidden')
    hideCustomizeModal()
    expect(modal.classList.contains('hidden')).toBe(false) // not yet
    vi.advanceTimersByTime(300)
    expect(modal.classList.contains('hidden')).toBe(true)
  })
})
