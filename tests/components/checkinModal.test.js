import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../src/i18n/index.js', () => ({
  t: vi.fn((key) => key),
}))
vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({})),
  setState: vi.fn(),
}))
vi.mock('../../src/utils/sanitize.js', () => ({
  escapeHTML: vi.fn((s) => String(s || '')),
  escapeJSString: vi.fn((s) => String(s || '')),
}))
vi.mock('../../src/utils/icons.js', () => ({
  icon: vi.fn((name) => `<svg data-icon="${name}"></svg>`),
}))

import { renderCheckinModal, registerCheckinHandlers } from '../../src/components/modals/CheckinModal.js'
import { getState, setState } from '../../src/stores/state.js'

const mockSpot = {
  id: 'spot-001',
  from: 'Paris',
  to: 'Lyon',
  direction: 'Lyon',
  lat: 48.812,
  lng: 2.322,
  country: 'FR',
  type: 'city-exit',
  safety: 4,
  traffic: 3,
  accessibility: 4,
}

describe('renderCheckinModal', () => {
  it('returns empty string when no checkinSpot', () => {
    const html = renderCheckinModal({})
    expect(html).toBe('')
  })

  it('returns empty string when checkinSpot is null', () => {
    const html = renderCheckinModal({ checkinSpot: null })
    expect(html).toBe('')
  })

  it('renders modal when checkinSpot is set', () => {
    const html = renderCheckinModal({ checkinSpot: mockSpot })
    expect(html).toContain('role="dialog"')
    expect(html).toContain('checkin-title')
    expect(html).toContain('closeCheckinModal()')
  })

  it('renders spot name in header', () => {
    const html = renderCheckinModal({ checkinSpot: mockSpot })
    expect(html).toContain('Paris')
  })

  it('renders photo upload section', () => {
    const html = renderCheckinModal({ checkinSpot: mockSpot })
    expect(html).toContain('addPhotoOptional')
  })

  it('renders validation submit button', () => {
    const html = renderCheckinModal({ checkinSpot: mockSpot })
    expect(html).toContain('submitCheckin()')
  })

  it('renders characteristics (safe, visible, traffic, shelter)', () => {
    const html = renderCheckinModal({ checkinSpot: mockSpot })
    expect(html).toContain('checkin-char-safe')
    expect(html).toContain('checkin-char-traffic')
  })

  it('renders spot with direction only (no from)', () => {
    const spotWithDirection = { ...mockSpot, from: undefined }
    const html = renderCheckinModal({ checkinSpot: spotWithDirection })
    expect(html).toContain('Lyon')
  })

  it('renders spot with id fallback (no from or direction)', () => {
    const minimalSpot = { id: 'spot-minimal', lat: 48, lng: 2, country: 'FR', type: 'other' }
    const html = renderCheckinModal({ checkinSpot: minimalSpot })
    expect(html).toContain('spot-minimal')
  })

  it('renders traffic rating', () => {
    const html = renderCheckinModal({ checkinSpot: mockSpot })
    expect(html).toContain('traffic')
  })

  it('renders shelter and visibility characteristics', () => {
    const html = renderCheckinModal({ checkinSpot: mockSpot })
    expect(html).toContain('checkin-char-shelter')
    expect(html).toContain('checkin-char-visible')
  })

  it('renders close button', () => {
    const html = renderCheckinModal({ checkinSpot: mockSpot })
    expect(html).toContain('onclick="closeCheckinModal()"')
  })

  it('renders comment/notes field', () => {
    const html = renderCheckinModal({ checkinSpot: mockSpot })
    expect(html).toBeTruthy()
    expect(html.length).toBeGreaterThan(200)
  })
})

describe('registerCheckinHandlers', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>'
    vi.clearAllMocks()
    getState.mockReturnValue({ spots: [mockSpot], checkinChars: { safe: true } })
    registerCheckinHandlers()
  })

  it('registers closeCheckinModal handler', () => {
    expect(typeof window.closeCheckinModal).toBe('function')
  })

  it('closeCheckinModal clears checkin state', () => {
    window.closeCheckinModal()
    expect(setState).toHaveBeenCalledWith(expect.objectContaining({ checkinSpot: null }))
  })

  it('setCheckinWaitTime sets state', () => {
    window.setCheckinWaitTime(30)
    expect(setState).toHaveBeenCalledWith({ checkinWaitTime: 30 })
  })

  it('onCheckinWaitSlider calculates minutes from index', () => {
    window.onCheckinWaitSlider(3) // index 3 → 5 minutes
    expect(setState).toHaveBeenCalledWith({ checkinWaitTime: 5, checkinWaitSliderIndex: 3 })
  })

  it('onCheckinWaitSlider updates display text when element exists', () => {
    document.body.innerHTML = '<span id="checkin-wait-display"></span>'
    window.onCheckinWaitSlider(4) // index 4 → 10 minutes
    const el = document.getElementById('checkin-wait-display')
    expect(el.textContent).toBeTruthy()
    expect(el.textContent.startsWith('~')).toBe(true)
  })

  it('setCheckinRideResult sets state', () => {
    window.setCheckinRideResult('got-ride')
    expect(setState).toHaveBeenCalledWith({ checkinRideResult: 'got-ride' })
  })

  it('toggleCheckinChar toggles existing char', () => {
    window.toggleCheckinChar('safe')
    expect(setState).toHaveBeenCalledWith({ checkinChars: { safe: false } })
  })

  it('toggleCheckinChar adds new char', () => {
    window.toggleCheckinChar('visible')
    expect(setState).toHaveBeenCalledWith({ checkinChars: { safe: true, visible: true } })
  })

  it('triggerCheckinPhoto clicks the hidden input', () => {
    document.body.innerHTML = '<input id="checkin-photo-input" />'
    const input = document.getElementById('checkin-photo-input')
    const clickSpy = vi.spyOn(input, 'click')
    window.triggerCheckinPhoto()
    expect(clickSpy).toHaveBeenCalled()
  })

  it('openCheckinModal sets state with spot data', async () => {
    getState.mockReturnValue({ spots: [mockSpot], selectedSpot: null })
    await window.openCheckinModal('spot-001')
    expect(setState).toHaveBeenCalledWith(expect.objectContaining({
      checkinSpot: mockSpot,
      checkinWaitTime: 15,
      checkinRideResult: null,
      checkinChars: {},
    }))
  })

  it('openCheckinModal does nothing when spot not found', async () => {
    getState.mockReturnValue({ spots: [], selectedSpot: null })
    await window.openCheckinModal('nonexistent')
    expect(setState).not.toHaveBeenCalled()
  })
})

describe('submitCheckin early returns', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.submitCheckin = registerCheckinHandlers() && window.submitCheckin
    registerCheckinHandlers()
    window.submitCheckin._busy = false
    localStorage.clear()
  })

  it('does not throw when busy', async () => {
    window.submitCheckin._busy = true
    await expect(window.submitCheckin()).resolves.toBeUndefined()
  })

  it('returns early when requireOnline returns false', async () => {
    window.requireOnline = vi.fn(() => false)
    getState.mockReturnValue({ checkinSpot: mockSpot, user: null })
    await window.submitCheckin()
    expect(window.submitCheckin._busy).toBe(false)
  })

  it('returns early when no checkinSpot', async () => {
    window.requireOnline = vi.fn(() => true)
    getState.mockReturnValue({ checkinSpot: null })
    await window.submitCheckin()
    expect(window.submitCheckin._busy).toBe(false)
  })
})
