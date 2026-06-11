/**
 * Community SOS Alert Service tests
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({ user: null, username: '', gender: '' })),
  setState: vi.fn(),
}))
vi.mock('../../src/services/notifications.js', () => ({ showToast: vi.fn() }))
vi.mock('../../src/i18n/index.js', () => ({ t: vi.fn((k) => k) }))
vi.mock('../../src/utils/icons.js', () => ({ icon: vi.fn((n) => `<svg>${n}</svg>`) }))
vi.mock('../../src/services/firebase.js', () => ({
  getCurrentUser: vi.fn(() => null),
  db: null,
}))
vi.mock('firebase/app', () => ({
  getApps: vi.fn(() => []),
  getApp: vi.fn(() => null),
}))
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => null),
  doc: vi.fn(),
  setDoc: vi.fn(async () => {}),
  deleteDoc: vi.fn(async () => {}),
  addDoc: vi.fn(async () => {}),
  collection: vi.fn(),
  serverTimestamp: vi.fn(() => 'ts'),
}))

import {
  getCommunityAlertSettings,
  saveCommunityAlertSettings,
  startPositionSharing,
  stopPositionSharing,
  broadcastCommunitySOSAlert,
  renderCommunityAlertSettings,
} from '../../src/services/communityAlert.js'

const KEY = 'spothitch_community_sos'

beforeEach(() => {
  localStorage.clear()
  vi.clearAllMocks()
})

describe('getCommunityAlertSettings', () => {
  it('returns defaults when localStorage empty', () => {
    const s = getCommunityAlertSettings()
    expect(s.receiveAlerts).toBe(false)
    expect(s.helpRadius).toBe(10)
    expect(s.broadcastRadius).toBe(10)
    expect(s.genderFilter).toBe('all')
  })

  it('merges stored values with defaults', () => {
    localStorage.setItem(KEY, JSON.stringify({ receiveAlerts: true, helpRadius: 25 }))
    const s = getCommunityAlertSettings()
    expect(s.receiveAlerts).toBe(true)
    expect(s.helpRadius).toBe(25)
    expect(s.broadcastRadius).toBe(10)
  })

  it('returns defaults when localStorage contains invalid JSON', () => {
    localStorage.setItem(KEY, 'not-valid-json')
    const s = getCommunityAlertSettings()
    expect(s.receiveAlerts).toBe(false)
    expect(s.helpRadius).toBe(10)
  })
})

describe('saveCommunityAlertSettings', () => {
  it('persists settings to localStorage', () => {
    saveCommunityAlertSettings({ receiveAlerts: true })
    const stored = JSON.parse(localStorage.getItem(KEY))
    expect(stored.receiveAlerts).toBe(true)
  })

  it('returns updated settings object', () => {
    const result = saveCommunityAlertSettings({ helpRadius: 15 })
    expect(result.helpRadius).toBe(15)
  })

  it('merges with existing settings', () => {
    saveCommunityAlertSettings({ receiveAlerts: true })
    saveCommunityAlertSettings({ helpRadius: 5 })
    const stored = JSON.parse(localStorage.getItem(KEY))
    expect(stored.receiveAlerts).toBe(true)
    expect(stored.helpRadius).toBe(5)
  })

  it('stores all DEFAULTS fields', () => {
    const result = saveCommunityAlertSettings({})
    expect(result).toHaveProperty('receiveAlerts')
    expect(result).toHaveProperty('helpRadius')
    expect(result).toHaveProperty('broadcastRadius')
    expect(result).toHaveProperty('genderFilter')
  })
})

describe('stopPositionSharing', () => {
  it('does not throw when no timer active', () => {
    expect(() => stopPositionSharing()).not.toThrow()
  })

  it('can be called after startPositionSharing without throwing', () => {
    Object.defineProperty(navigator, 'geolocation', {
      value: {
        getCurrentPosition: vi.fn((_s, e) => e(new Error('denied'))),
        watchPosition: vi.fn(() => 42),
        clearWatch: vi.fn(),
      },
      configurable: true,
    })
    startPositionSharing()
    expect(() => stopPositionSharing()).not.toThrow()
  })
})

describe('broadcastCommunitySOSAlert', () => {
  it('does not throw when user not logged in', async () => {
    await expect(broadcastCommunitySOSAlert({ lat: 48.8, lng: 2.3 })).resolves.not.toThrow()
  })

  it('does not throw with type=silent', async () => {
    await expect(broadcastCommunitySOSAlert({ lat: 48.8, lng: 2.3 }, 'silent')).resolves.not.toThrow()
  })
})

describe('renderCommunityAlertSettings', () => {
  it('returns an HTML string', () => {
    const html = renderCommunityAlertSettings()
    expect(typeof html).toBe('string')
    expect(html.length).toBeGreaterThan(100)
  })

  it('includes toggle button with aria-checked false by default', () => {
    const html = renderCommunityAlertSettings()
    expect(html).toContain('aria-checked="false"')
  })

  it('includes toggle button with aria-checked true when opted in', () => {
    saveCommunityAlertSettings({ receiveAlerts: true })
    const html = renderCommunityAlertSettings()
    expect(html).toContain('aria-checked="true"')
  })

  it('shows helpRadius buttons when opted in', () => {
    saveCommunityAlertSettings({ receiveAlerts: true })
    const html = renderCommunityAlertSettings()
    expect(html).toContain("setCommunityRadius('helpRadius'")
  })

  it('does not show helpRadius section when opted out', () => {
    saveCommunityAlertSettings({ receiveAlerts: false })
    const html = renderCommunityAlertSettings()
    expect(html).not.toContain("setCommunityRadius('helpRadius'")
  })

  it('includes broadcast radius buttons', () => {
    const html = renderCommunityAlertSettings()
    expect(html).toContain("setCommunityRadius('broadcastRadius'")
  })

  it('includes gender filter buttons', () => {
    const html = renderCommunityAlertSettings()
    expect(html).toContain("setCommunityGenderFilter('all')")
    expect(html).toContain("setCommunityGenderFilter('women')")
  })

  it('shows women-only note when genderFilter is women', () => {
    saveCommunityAlertSettings({ genderFilter: 'women' })
    const html = renderCommunityAlertSettings()
    expect(html).toContain('communityFilterWomenNote')
  })

  it('does not show women-only note when genderFilter is all', () => {
    saveCommunityAlertSettings({ genderFilter: 'all' })
    const html = renderCommunityAlertSettings()
    expect(html).not.toContain('communityFilterWomenNote')
  })

  it('highlights selected broadcast radius', () => {
    saveCommunityAlertSettings({ broadcastRadius: 25 })
    const html = renderCommunityAlertSettings()
    expect(html).toContain('25km')
  })
})
