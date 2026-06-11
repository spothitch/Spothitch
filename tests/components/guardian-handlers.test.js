/**
 * Guardian.js — additional screen rendering + window handler tests
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockGuardianState = {
  active: false, guardians: [], guardian: null, tripStart: null,
  alertSent: false, destination: 'Lyon', interval: 30,
  mode: 'standard', checkIns: [], events: [], positions: [],
}

vi.mock('../../src/i18n/index.js', () => ({ t: vi.fn((k) => k) }))
vi.mock('../../src/utils/icons.js', () => ({ icon: vi.fn(() => '<svg></svg>') }))
vi.mock('../../src/utils/sanitize.js', () => ({
  escapeHTML: vi.fn((s) => String(s ?? '')),
  escapeJSString: vi.fn((s) => String(s ?? '')),
}))
vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({})), setState: vi.fn(),
}))
vi.mock('../../src/services/guardian.js', () => ({
  getGuardianState: vi.fn(() => ({ ...mockGuardianState })),
  getTimeUntilNextCheckIn: vi.fn(() => 25 * 60),
  isCheckInOverdue: vi.fn(() => false),
  loadTripHistory: vi.fn(() => []),
  getETAInfo: vi.fn(() => ({ eta: null, etaMinutes: null, confidence: 0 })),
  getBatteryLevel: vi.fn(() => null),
  getTripEvents: vi.fn(() => []),
  getTripPhoto: vi.fn(() => null),
  subscribeToGuardianChat: vi.fn(),
  unsubscribeGuardianChat: vi.fn(),
  stopGuardianMode: vi.fn(),
  startGuardianMode: vi.fn(),
}))
vi.mock('../../src/services/guardianWatch.js', () => ({
  getChatMessages: vi.fn(() => []),
}))
vi.mock('../../src/services/notifications.js', () => ({
  showSuccess: vi.fn(), showError: vi.fn(), showToast: vi.fn(),
}))

import { renderGuardianModal } from '../../src/components/modals/Guardian.js'
import { getGuardianState, isCheckInOverdue, getTimeUntilNextCheckIn } from '../../src/services/guardian.js'

// Also import as side effect to register window.* handlers
import '../../src/components/modals/Guardian.js'

describe('Guardian additional screen rendering', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getGuardianState.mockReturnValue({ ...mockGuardianState })
    isCheckInOverdue.mockReturnValue(false)
    getTimeUntilNextCheckIn.mockReturnValue(25 * 60)
    window._forceRender = vi.fn()
    window._currentScreen = null
  })

  it('renders alert screen when guardianState has alertSent=false + overdue=true', () => {
    getGuardianState.mockReturnValue({
      ...mockGuardianState, active: true,
      tripStart: Date.now() - 30 * 60 * 1000,
      alertSent: false,
      guardians: [{ name: 'Alice', phone: '+33600', color: '#22c55e' }],
    })
    isCheckInOverdue.mockReturnValue(true)
    const html = renderGuardianModal({})
    expect(html).toBeTruthy()
    expect(html).toContain('role="dialog"')
  })

  it('renders arrival screen (guardianGoToScreen sets it)', () => {
    window.guardianGoToScreen('arrival')
    getGuardianState.mockReturnValue({
      ...mockGuardianState, active: true,
      tripStart: Date.now() - 30 * 60 * 1000,
      destination: 'Nice',
      guardians: [{ name: 'Alice', phone: '+33600', color: '#22c55e' }],
    })
    const html = renderGuardianModal({})
    expect(html).toBeTruthy()
    expect(html).toContain('role="dialog"')
  })

  it('renders guardian screen (guardianGoToScreen sets it)', () => {
    window.guardianGoToScreen('guardian')
    getGuardianState.mockReturnValue({
      ...mockGuardianState, active: true,
      tripStart: Date.now() - 15 * 60 * 1000,
      travelerId: 'alice-uid',
      guardians: [{ name: 'Alice', phone: '+33600', color: '#22c55e' }],
    })
    const html = renderGuardianModal({})
    expect(html).toBeTruthy()
  })

  it('renders active screen with overdue timer (negative seconds)', () => {
    getTimeUntilNextCheckIn.mockReturnValue(-300) // 5 minutes overdue
    getGuardianState.mockReturnValue({
      ...mockGuardianState, active: true,
      tripStart: Date.now() - 45 * 60 * 1000,
      guardians: [{ name: 'Alice', phone: '+33600', color: '#22c55e' }],
      destination: 'Bordeaux',
    })
    isCheckInOverdue.mockReturnValue(false)
    window.guardianGoToScreen('active')
    const html = renderGuardianModal({})
    expect(html).toBeTruthy()
    expect(html).toContain('role="dialog"')
  })

  it('renders active screen with events and checkins', () => {
    getGuardianState.mockReturnValue({
      ...mockGuardianState, active: true,
      tripStart: Date.now() - 60 * 60 * 1000,
      guardians: [{ name: 'Bob', phone: '+33611', color: '#3b82f6' }],
      events: [{ type: 'checkin', ts: Date.now() - 30000, note: 'OK' }],
    })
    window.guardianGoToScreen('active')
    const html = renderGuardianModal({})
    expect(html).toBeTruthy()
  })

  it('renders with destination in active screen header', () => {
    getGuardianState.mockReturnValue({
      ...mockGuardianState, active: true,
      tripStart: Date.now() - 10 * 60 * 1000,
      destination: 'Strasbourg',
      guardians: [{ name: 'Alice', phone: '+33600', color: '#22c55e' }],
    })
    window.guardianGoToScreen('active')
    const html = renderGuardianModal({})
    expect(html).toContain('Strasbourg')
  })

  it('renders alert screen via guardianGoToScreen', () => {
    getGuardianState.mockReturnValue({
      ...mockGuardianState, active: true,
      tripStart: Date.now() - 25 * 60 * 1000,
      guardians: [{ name: 'Alice', phone: '+33600', color: '#22c55e' }],
    })
    window.guardianGoToScreen('alert')
    const html = renderGuardianModal({})
    expect(html).toBeTruthy()
    expect(html).toContain('role="dialog"')
  })
})

describe('Guardian window handlers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getGuardianState.mockReturnValue({ ...mockGuardianState })
    window._forceRender = vi.fn()
    window._currentScreen = null
    window.open = vi.fn()
    window.showToast = vi.fn()
    document.body.innerHTML = '<div id="app"></div>'
  })

  it('acceptGuardianConsent sets sessionStorage and renders', () => {
    window.acceptGuardianConsent()
    expect(sessionStorage.getItem('spothitch_guardian_consent')).toBe('1')
    expect(window._forceRender).toHaveBeenCalled()
  })

  it('guardianGoToScreen sets current screen and renders', () => {
    window.guardianGoToScreen('active')
    expect(window._forceRender).toHaveBeenCalled()
  })

  it('guardianGoToScreen("main") sets consent', () => {
    window.guardianGoToScreen('main')
    expect(sessionStorage.getItem('spothitch_guardian_consent')).toBe('1')
    expect(window._forceRender).toHaveBeenCalled()
  })

  it('guardianSwitchTab sets screen to main', () => {
    window.guardianSwitchTab(1)
    expect(window._forceRender).toHaveBeenCalled()
  })

  it('guardianCallEmergency opens tel:112', () => {
    window.guardianCallEmergency()
    expect(window.open).toHaveBeenCalledWith('tel:112', '_self')
  })

  it('guardianCallTraveler opens tel when phone available', () => {
    getGuardianState.mockReturnValue({ ...mockGuardianState, travelerPhone: '+33600' })
    window.guardianCallTraveler()
    expect(window.open).toHaveBeenCalledWith('tel:+33600', '_self')
  })

  it('guardianMessageTraveler opens sms when phone available', () => {
    getGuardianState.mockReturnValue({ ...mockGuardianState, travelerPhone: '+33600' })
    window.guardianMessageTraveler()
    expect(window.open).toHaveBeenCalledWith('sms:+33600', '_self')
  })

  it('guardianShowMap does nothing when no positions', () => {
    getGuardianState.mockReturnValue({ ...mockGuardianState, positions: [] })
    expect(() => window.guardianShowMap()).not.toThrow()
    expect(window.open).not.toHaveBeenCalled()
  })

  it('guardianCloseSheet sets sheet state and renders', () => {
    window.guardianCloseSheet()
    expect(window._forceRender).toHaveBeenCalled()
  })

  it('guardianUpdatePlate reads plate field value', () => {
    document.body.innerHTML = '<input id="guardian-plate-input" value="AB-123-CD">'
    expect(() => window.guardianUpdatePlate()).not.toThrow()
  })

  it('guardianUpdateDestination reads destination field', () => {
    document.body.innerHTML = '<input id="guardian-dest-input" value="Marseille">'
    expect(() => window.guardianUpdateDestination()).not.toThrow()
  })

  it('guardianShowArrival navigates to arrival screen', () => {
    window.guardianShowArrival()
    expect(window._forceRender).toHaveBeenCalled()
  })

  it('guardianAddGuardian navigates to add screen', () => {
    window.guardianAddGuardian()
    expect(window._forceRender).toHaveBeenCalled()
  })
})
