/**
 * SOS.js window handler tests — covers DOM handlers + renderFakeCallOverlay
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../src/i18n/index.js', () => ({ t: vi.fn((k) => k) }))
vi.mock('../../src/utils/icons.js', () => ({ icon: vi.fn(() => '<svg></svg>') }))
vi.mock('../../src/utils/sanitize.js', () => ({
  escapeHTML: vi.fn((s) => String(s ?? '')),
  escapeJSString: vi.fn((s) => String(s ?? '')),
}))
vi.mock('../../src/services/communityAlert.js', () => ({
  getCommunityAlertSettings: vi.fn(() => ({ receiveAlerts: true, radius: 10, broadcastRadius: 5 })),
  broadcastCommunitySOSAlert: vi.fn(),
}))
vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({ emergencyContacts: [], lang: 'fr', sosActive: false })),
  setState: vi.fn(),
  actions: { toggleSOS: vi.fn() },
}))
vi.mock('../../src/services/notifications.js', () => ({
  showSuccess: vi.fn(),
  showError: vi.fn(),
  showToast: vi.fn(),
}))

// Import as side effect to register window.* handlers
import '../../src/components/modals/SOS.js'

describe('SOS window handlers', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>'
    localStorage.clear()
    vi.clearAllMocks()
    window._forceRender = vi.fn()
    window._sosConfigOriginal = null
    window.getState = () => ({ emergencyContacts: [], sosActive: false })
    window.showToast = vi.fn()
  })

  it('acceptSOSIntro sets localStorage and calls _forceRender', () => {
    window.acceptSOSIntro()
    expect(localStorage.getItem('spothitch_sos_intro_seen')).toBe('1')
    expect(localStorage.getItem('spothitch_sos_disclaimer_seen')).toBe('1')
    expect(window._forceRender).toHaveBeenCalled()
  })

  it('acceptSOSDisclaimer sets localStorage flags', () => {
    window.acceptSOSDisclaimer()
    expect(localStorage.getItem('spothitch_sos_disclaimer_seen')).toBe('1')
    expect(localStorage.getItem('spothitch_sos_intro_seen')).toBe('1')
  })

  it('sosTab(0) switches tabs in DOM', () => {
    document.body.innerHTML = `
      <button class="sos-tab"></button>
      <button class="sos-tab"></button>
      <div class="sos-panel"></div>
      <div class="sos-panel hidden"></div>
    `
    window.sosTab(0)
    const tabs = document.querySelectorAll('.sos-tab')
    expect(tabs[0].classList.contains('text-amber-500')).toBe(true)
    expect(tabs[1].classList.contains('text-slate-500')).toBe(true)
  })

  it('sosTab(1) activates second tab', () => {
    document.body.innerHTML = `
      <button class="sos-tab text-amber-500 border-amber-500"></button>
      <button class="sos-tab text-slate-500"></button>
      <div class="sos-panel"></div>
      <div class="sos-panel hidden"></div>
    `
    window.sosTab(1)
    const panels = document.querySelectorAll('.sos-panel')
    expect(panels[0].classList.contains('hidden')).toBe(true)
    expect(panels[1].classList.contains('hidden')).toBe(false)
  })

  it('sosShowRecordOptions toggles the record panel', () => {
    document.body.innerHTML = '<div id="sos-record-panel" class="hidden"></div>'
    window.sosShowRecordOptions()
    expect(document.getElementById('sos-record-panel').classList.contains('hidden')).toBe(false)
    window.sosShowRecordOptions()
    expect(document.getElementById('sos-record-panel').classList.contains('hidden')).toBe(true)
  })

  it('sosOpenFakeCall appends overlay to body', () => {
    window.sosOpenFakeCall()
    const overlay = document.getElementById('sos-fake-call')
    expect(overlay).not.toBeNull()
    expect(overlay.innerHTML.length).toBeGreaterThan(50)
  })

  it('sosOpenFakeCall removes existing overlay before creating new one', () => {
    window.sosOpenFakeCall()
    window.sosOpenFakeCall()
    const overlays = document.querySelectorAll('#sos-fake-call')
    expect(overlays.length).toBe(1)
  })

  it('sosFakeCallDecline removes the overlay', () => {
    window.sosOpenFakeCall()
    expect(document.getElementById('sos-fake-call')).not.toBeNull()
    window.sosFakeCallDecline()
    expect(document.getElementById('sos-fake-call')).toBeNull()
  })

  it('sosFakeCallAnswer updates status text', () => {
    window.sosOpenFakeCall()
    window.sosFakeCallAnswer()
    const status = document.getElementById('fake-call-status')
    expect(status?.textContent).toContain('sosFakeCallConnected')
  })

  it('sosOpenConfig renders contacts section', () => {
    document.body.innerHTML = '<div data-sos-panel="1">orig</div>'
    window.getState = () => ({ emergencyContacts: [] })
    window.sosOpenConfig('contacts')
    const panel = document.querySelector('[data-sos-panel="1"]')
    expect(panel.innerHTML).not.toBe('original content')
  })

  it('sosCloseConfig restores original content', () => {
    document.body.innerHTML = '<div data-sos-panel="1">orig</div>'
    window.getState = () => ({ emergencyContacts: [] })
    window.sosOpenConfig('contacts')
    window.sosCloseConfig()
    const panel = document.querySelector('[data-sos-panel="1"]')
    expect(panel.innerHTML).toBe('orig')
  })

  it('sosOpenConfig("fake") renders fake call section', () => {
    document.body.innerHTML = '<div data-sos-panel="1"></div>'
    window.getState = () => ({ emergencyContacts: [] })
    window.sosOpenConfig('fake')
    const panel = document.querySelector('[data-sos-panel="1"]')
    expect(panel.innerHTML).toContain('sosFakeCall')
  })

  it('sosOpenConfig("message") renders message section', () => {
    document.body.innerHTML = '<div data-sos-panel="1"></div>'
    window.getState = () => ({ emergencyContacts: [] })
    window.sosOpenConfig('message')
    const panel = document.querySelector('[data-sos-panel="1"]')
    expect(panel.innerHTML.length).toBeGreaterThan(10)
  })

  it('sosOpenConfig("community") renders community section', () => {
    document.body.innerHTML = '<div data-sos-panel="1"></div>'
    window.getState = () => ({ emergencyContacts: [] })
    window.sosOpenConfig('community')
    const panel = document.querySelector('[data-sos-panel="1"]')
    expect(panel.innerHTML.length).toBeGreaterThan(10)
  })

  it('sosOpenConfig("emergency") renders emergency section', () => {
    document.body.innerHTML = '<div data-sos-panel="1"></div>'
    window.getState = () => ({ emergencyContacts: [] })
    window.sosOpenConfig('emergency')
    const panel = document.querySelector('[data-sos-panel="1"]')
    expect(panel.innerHTML.length).toBeGreaterThan(10)
  })

  it('sosSetPrimaryContact updates localStorage', () => {
    window.sosSetPrimaryContact(2)
    expect(localStorage.getItem('spothitch_sos_primary')).toBe('2')
  })

  it('sosUpdateCustomMsg stores custom message', () => {
    window.sosUpdateCustomMsg('Help me!')
    expect(localStorage.getItem('spothitch_sos_custom_msg')).toBe('Help me!')
  })
})
