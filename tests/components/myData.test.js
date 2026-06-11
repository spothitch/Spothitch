import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({
    user: { email: 'test@example.com', metadata: { creationTime: '2026-01-01', lastSignInTime: '2026-06-01' } },
    username: 'TestUser',
    avatar: '',
    checkins: 5,
    spotsCreated: 2,
    reviewsGiven: 3,
    messagesCount: 10,
    friends: [{ id: 'f1', name: 'Alice', addedAt: '2026-01-01' }],
    savedTrips: [],
    badges: [{ id: 'b1', name: 'First' }],
    rewards: [],
    points: 1500,
    level: 3,
    seasonPoints: 200,
    totalPoints: 1500,
    skillPoints: 50,
    unlockedSkills: ['skill1'],
    userLocation: { lat: 48.8566, lng: 2.3522 },
    gpsEnabled: true,
    lang: 'fr',
    theme: 'dark',
    notifications: true,
  })),
  setState: vi.fn(),
}))
vi.mock('../../src/i18n/index.js', () => ({ t: vi.fn((k) => k) }))
vi.mock('../../src/utils/icons.js', () => ({ icon: vi.fn(() => '<svg></svg>') }))
vi.mock('../../src/utils/storage.js', () => ({
  Storage: {
    get: vi.fn((key) => {
      if (key === 'consent_cookies') return { accepted: true, date: '2026-01-01' }
      if (key === 'consent_geolocation') return { accepted: false, date: '2026-01-02' }
      return null
    }),
  },
}))

import {
  renderMyDataModal,
  downloadUserData,
  requestAccountDeletion,
  openConsentSettings,
} from '../../src/components/modals/MyData.js'
import { getState, setState } from '../../src/stores/state.js'

describe('renderMyDataModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getState.mockReturnValue({
      user: { email: 'test@example.com', metadata: { creationTime: '2026-01-01', lastSignInTime: '2026-06-01' } },
      username: 'TestUser',
      avatar: '',
      checkins: 5,
      spotsCreated: 2,
      reviewsGiven: 3,
      messagesCount: 10,
      friends: [{ id: 'f1', name: 'Alice' }],
      savedTrips: [],
      badges: [],
      rewards: [],
      points: 1500,
      level: 3,
      seasonPoints: 200,
      totalPoints: 1500,
      skillPoints: 50,
      unlockedSkills: [],
      userLocation: { lat: 48.8566, lng: 2.3522 },
      gpsEnabled: true,
      lang: 'fr',
    })
  })

  it('renders HTML', () => {
    const html = renderMyDataModal()
    expect(html).toBeTruthy()
    expect(html.length).toBeGreaterThan(200)
  })

  it('renders modal-overlay class', () => {
    const html = renderMyDataModal()
    expect(html).toContain('modal-overlay')
  })

  it('renders closeMyData handler', () => {
    const html = renderMyDataModal()
    expect(html).toContain('closeMyData')
  })

  it('renders downloadMyData button', () => {
    const html = renderMyDataModal()
    expect(html).toContain('downloadMyData')
  })

  it('renders requestAccountDeletion button', () => {
    const html = renderMyDataModal()
    expect(html).toContain('requestAccountDeletion')
  })

  it('renders openConsentSettings button', () => {
    const html = renderMyDataModal()
    expect(html).toContain('openConsentSettings')
  })

  it('renders checkin count from state', () => {
    const html = renderMyDataModal()
    expect(html).toContain('5')
  })

  it('renders with no user (not logged in)', () => {
    getState.mockReturnValue({
      user: null, username: null, friends: [], savedTrips: [], badges: [], rewards: [],
      checkins: 0, spotsCreated: 0, reviewsGiven: 0, messagesCount: 0,
      points: 0, level: 1, seasonPoints: 0, totalPoints: 0, skillPoints: 0,
      unlockedSkills: [], userLocation: null, gpsEnabled: false, lang: 'en',
    })
    const html = renderMyDataModal()
    expect(html).toBeTruthy()
    expect(html).toContain('modal-overlay')
  })

  it('renders with english language', () => {
    getState.mockReturnValue({
      user: { email: 'en@test.com', metadata: {} },
      username: 'EnUser',
      friends: [], savedTrips: [], badges: [], rewards: [],
      checkins: 1, spotsCreated: 0, reviewsGiven: 0, messagesCount: 0,
      points: 100, level: 1, seasonPoints: 0, totalPoints: 100, skillPoints: 0,
      unlockedSkills: [], userLocation: null, gpsEnabled: false, lang: 'en',
    })
    const html = renderMyDataModal()
    expect(html).toBeTruthy()
  })

  it('renders consent section', () => {
    const html = renderMyDataModal()
    expect(html).toContain('openConsentSettings')
  })
})

describe('openConsentSettings', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('calls setState with showConsentSettings: true', () => {
    openConsentSettings()
    expect(setState).toHaveBeenCalledWith({ showConsentSettings: true })
  })
})

describe('downloadUserData', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    document.body.innerHTML = ''
    // Mock URL and blob APIs
    global.URL.createObjectURL = vi.fn(() => 'blob:fake')
    global.URL.revokeObjectURL = vi.fn()
    window.showToast = vi.fn()
    getState.mockReturnValue({
      user: null, username: 'test', friends: [], savedTrips: [], badges: [], rewards: [],
      checkins: 0, spotsCreated: 0, reviewsGiven: 0, messagesCount: 0,
      points: 0, level: 1, seasonPoints: 0, totalPoints: 0, skillPoints: 0,
      unlockedSkills: [], userLocation: null, gpsEnabled: false, lang: 'fr',
      theme: 'dark', notifications: false,
    })
  })

  it('creates download link and calls showToast', async () => {
    await downloadUserData()
    expect(URL.createObjectURL).toHaveBeenCalled()
    expect(URL.revokeObjectURL).toHaveBeenCalled()
  })

  it('does not throw', async () => {
    await expect(downloadUserData()).resolves.not.toThrow()
  })
})

describe('requestAccountDeletion', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.confirm = vi.fn(() => false) // default: user cancels
    window.showToast = vi.fn()
    getState.mockReturnValue({
      user: null, lang: 'fr', friends: [], savedTrips: [], badges: [], rewards: [],
      checkins: 0, spotsCreated: 0, reviewsGiven: 0, messagesCount: 0,
      points: 0, level: 1, seasonPoints: 0, totalPoints: 0, skillPoints: 0,
      unlockedSkills: [], userLocation: null, gpsEnabled: false, username: null,
    })
  })

  it('does not throw when user cancels confirm', async () => {
    window.confirm = vi.fn(() => false)
    await expect(requestAccountDeletion()).resolves.not.toThrow()
  })

  it('does not call setState when confirm is cancelled', async () => {
    window.confirm = vi.fn(() => false)
    await requestAccountDeletion()
    expect(setState).not.toHaveBeenCalled()
  })
})

describe('window handlers', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('closeMyData calls setState with showMyData: false', () => {
    window.closeMyData()
    expect(setState).toHaveBeenCalledWith({ showMyData: false })
  })

  it('openMyData calls setState with showMyData: true', () => {
    window.openMyData()
    expect(setState).toHaveBeenCalledWith({ showMyData: true })
  })

  it('closeConsentSettings calls setState with showConsentSettings: false', () => {
    window.closeConsentSettings()
    expect(setState).toHaveBeenCalledWith({ showConsentSettings: false })
  })

  it('downloadMyData is defined', () => {
    expect(typeof window.downloadMyData).toBe('function')
  })

  it('requestAccountDeletion is defined on window', () => {
    expect(typeof window.requestAccountDeletion).toBe('function')
  })
})
