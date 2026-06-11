/**
 * Landing page, feedback panel, and contact form handlers
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockSetState = vi.fn()
const mockGetState = vi.fn(() => ({ isLoggedIn: false }))
const mockSubscribe = vi.fn(() => () => {})
window.setState = mockSetState
window.getState = mockGetState
window.t = vi.fn((k) => k)
window.showToast = vi.fn()

vi.mock('../../src/utils/sanitize.js', () => ({
  escapeHTML: vi.fn((s) => s),
  escapeJSString: vi.fn((s) => s),
}))
vi.mock('../../src/utils/pwa.js', () => ({
  installPWA: vi.fn().mockResolvedValue(false),
}))
vi.mock('../../src/data/featuresData.js', () => ({
  FEATURES_DATA: [
    { id: 'carte', name: 'Carte', status: 'available' },
    { id: 'sos', name: 'SOS', status: 'beta' },
  ],
}))
vi.mock('../../src/services/featureVotes.js', () => ({
  getAllUserVotes: vi.fn(() => ({})),
}))
vi.mock('../../src/stores/state.js', () => ({
  subscribe: vi.fn(() => () => {}),
  getState: vi.fn(() => ({ isLoggedIn: false })),
  setState: vi.fn(),
}))
vi.mock('../../src/i18n/index.js', () => ({
  setLanguage: vi.fn().mockResolvedValue({}),
  t: vi.fn((k) => k),
}))
vi.mock('../../src/components/modals/ContactForm.js', () => ({
  handleContactFormSubmit: vi.fn(),
}))

import { initDraggableFeedbackBtn } from '../../src/handlers/landing.js'

describe('landing handlers — dismissLanding', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    document.body.innerHTML = ''
    mockGetState.mockReturnValue({ isLoggedIn: false })
  })

  it('dismissLanding calls showToast when not logged in and section visible', () => {
    document.body.innerHTML = '<section id="landing-auth-section"></section>'
    document.getElementById('landing-auth-section').scrollIntoView = vi.fn()
    mockGetState.mockReturnValue({ isLoggedIn: false })
    window.dismissLanding()
    expect(window.showToast).toHaveBeenCalled()
  })

  it('dismissLanding returns early (does not setState) when section found but not logged in', () => {
    document.body.innerHTML = '<section id="landing-auth-section"></section>'
    document.getElementById('landing-auth-section').scrollIntoView = vi.fn()
    mockGetState.mockReturnValue({ isLoggedIn: false })
    window.dismissLanding()
    expect(mockSetState).not.toHaveBeenCalled()
  })

  it('dismissLanding sets localStorage and setState when logged in', () => {
    mockGetState.mockReturnValue({ isLoggedIn: true })
    window.dismissLanding()
    expect(localStorage.getItem('spothitch_landing_v2')).toBe('1')
    expect(mockSetState).toHaveBeenCalledWith({ showLanding: false })
  })

  it('closeLanding sets localStorage and hides landing', () => {
    window.closeLanding()
    expect(localStorage.getItem('spothitch_landing_v2')).toBe('1')
    expect(mockSetState).toHaveBeenCalledWith({ showLanding: false })
  })
})

describe('landing handlers — toggles and carousel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    document.body.innerHTML = ''
  })

  it('toggleFormToggle toggles checkbox', () => {
    document.body.innerHTML = '<input id="my-checkbox" type="checkbox" />'
    window.toggleFormToggle('my-checkbox')
    expect(document.getElementById('my-checkbox').checked).toBe(true)
    window.toggleFormToggle('my-checkbox')
    expect(document.getElementById('my-checkbox').checked).toBe(false)
  })

  it('toggleFormToggle does not throw when checkbox absent', () => {
    expect(() => window.toggleFormToggle('nonexistent')).not.toThrow()
  })

  it('skipToLandingAuth updates track transform', () => {
    document.body.innerHTML = `
      <div id="landing-track"></div>
      <button class="landing-dot" data-i="0"></button>
      <button id="landing-next"></button>
    `
    localStorage.removeItem('spothitch_alpha_code')
    window.skipToLandingAuth()
    const track = document.getElementById('landing-track')
    // slide 5 = 5*(100/7) ≈ 71.4%
    expect(track.style.transform).toContain('71')
  })

  it('skipToLandingAuth with alpha unlocked goes to slide 6', () => {
    document.body.innerHTML = `<div id="landing-track"></div>`
    localStorage.setItem('spothitch_alpha_code', 'ok')
    window.skipToLandingAuth()
    const track = document.getElementById('landing-track')
    // slide 6 = 6*(100/7) ≈ 85.7%
    expect(track.style.transform).toContain('85')
  })

  it('skipToLandingAuth does not throw when track absent', () => {
    document.body.innerHTML = ''
    expect(() => window.skipToLandingAuth()).not.toThrow()
  })
})

describe('landing handlers — language', () => {
  beforeEach(() => { vi.clearAllMocks(); localStorage.clear() })

  it('changeLandingLanguage calls setLanguage and setState', async () => {
    const { setLanguage } = await import('../../src/i18n/index.js')
    await window.changeLandingLanguage('en')
    expect(setLanguage).toHaveBeenCalledWith('en')
    expect(mockSetState).toHaveBeenCalledWith({ lang: 'en' })
  })

  it('changeLandingLanguage persists to localStorage', async () => {
    await window.changeLandingLanguage('de')
    const stored = JSON.parse(localStorage.getItem('spothitch_v4_state') || '{}')
    expect(stored.lang).toBe('de')
  })
})

describe('landing handlers — install', () => {
  beforeEach(() => { vi.clearAllMocks(); document.body.innerHTML = '' })

  it('installFromLanding does not throw when PWA not available', async () => {
    const { installPWA } = await import('../../src/utils/pwa.js')
    installPWA.mockResolvedValue(false)
    await expect(window.installFromLanding()).resolves.not.toThrow()
  })

  it('installPWAFromLanding sets localStorage and hides landing', () => {
    vi.useFakeTimers()
    window.installPWAFromLanding()
    expect(localStorage.getItem('spothitch_landing_v2')).toBe('1')
    expect(mockSetState).toHaveBeenCalledWith({ showLanding: false })
    vi.useRealTimers()
  })
})

describe('landing handlers — FAQ and help', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('openFAQ calls setState with showFAQ: true', () => {
    window.openFAQ()
    expect(mockSetState).toHaveBeenCalledWith({ showFAQ: true, faqSearchQuery: '' })
  })

  it('closeFAQ calls setState with showFAQ: false', () => {
    window.closeFAQ()
    expect(mockSetState).toHaveBeenCalledWith({ showFAQ: false, faqSearchQuery: '' })
  })

  it('openHelpCenter opens FAQ', () => {
    window.openHelpCenter()
    expect(mockSetState).toHaveBeenCalledWith({ showFAQ: true, faqSearchQuery: '' })
  })

  it('openChangelog opens feedback panel', () => {
    window.openChangelog()
    expect(mockSetState).toHaveBeenCalledWith({ showFeedbackPanel: true })
  })

  it('openRoadmap opens feedback panel', () => {
    window.openRoadmap()
    expect(mockSetState).toHaveBeenCalledWith({ showFeedbackPanel: true })
  })

  it('openBugReport opens contact form', () => {
    window.openBugReport()
    expect(mockSetState).toHaveBeenCalledWith({ showContactForm: true })
  })
})

describe('landing handlers — feedback panel', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('openFeedbackPanel calls setState', () => {
    window.openFeedbackPanel()
    expect(mockSetState).toHaveBeenCalledWith({ showFeedbackPanel: true })
  })

  it('closeFeedbackPanel calls setState', () => {
    window.closeFeedbackPanel()
    expect(mockSetState).toHaveBeenCalledWith({ showFeedbackPanel: false, feedbackDetailFeature: null })
  })
})

describe('landing handlers — contact form', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('openContactForm calls setState', () => {
    window.openContactForm()
    expect(mockSetState).toHaveBeenCalledWith({ showContactForm: true })
  })

  it('closeContactForm calls setState', () => {
    window.closeContactForm()
    expect(mockSetState).toHaveBeenCalledWith({ showContactForm: false })
  })

  it('submitContactForm calls handleContactFormSubmit', async () => {
    const { handleContactFormSubmit } = await import('../../src/components/modals/ContactForm.js')
    const fakeEvent = { preventDefault: vi.fn() }
    await window.submitContactForm(fakeEvent)
    expect(handleContactFormSubmit).toHaveBeenCalledWith(fakeEvent)
  })
})

describe('initDraggableFeedbackBtn', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    document.body.innerHTML = ''
    document.getElementById('fb-side-btn')?.remove()
  })

  it('creates the side button', () => {
    mockGetState.mockReturnValue({ showSOS: false, showLanding: false, showFeedbackPanel: false })
    initDraggableFeedbackBtn()
    const btn = document.getElementById('fb-side-btn')
    expect(btn).toBeTruthy()
  })

  it('does not throw', () => {
    mockGetState.mockReturnValue({ showSOS: false, showLanding: false, showFeedbackPanel: false })
    expect(() => initDraggableFeedbackBtn()).not.toThrow()
  })

  it('hides button when showLanding is true', () => {
    mockGetState.mockReturnValue({ showSOS: false, showLanding: true, showFeedbackPanel: false })
    initDraggableFeedbackBtn()
    const btn = document.getElementById('fb-side-btn')
    expect(btn.style.display).toBe('none')
  })
})
