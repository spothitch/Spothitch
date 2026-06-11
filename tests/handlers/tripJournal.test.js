/**
 * Trip Journal Handlers
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockSetState = vi.fn()
const mockGetState = vi.fn(() => ({ journalView: 'list', journalTripId: null, journalTransport: 'hitchhike' }))
const mockForceRender = vi.fn()
window.setState = mockSetState
window.getState = mockGetState
window.t = vi.fn((k) => k)
window.showToast = vi.fn()
window._forceRender = mockForceRender
window.confirm = vi.fn(() => true)

vi.mock('../../src/services/tripJournal.js', () => ({
  createTrip: vi.fn(() => ({ id: 'trip-abc12345', title: 'Test trip', legs: [] })),
  addLeg: vi.fn(() => ({ id: 'leg-1' })),
  endTrip: vi.fn(),
  updateTrip: vi.fn(),
  setDayNote: vi.fn(),
  setDayExpenses: vi.fn(),
  setDayPhoto: vi.fn(),
  getTrip: vi.fn(() => ({ id: 'trip-abc12345', title: 'Test trip', legs: [], isPublic: false })),
  flushPendingSync: vi.fn(),
  getTrips: vi.fn(() => [{ id: 'trip-abc12345', title: 'Test trip', legs: [] }]),
  publishTripPublicly: vi.fn(async () => ({ success: true })),
  EXPENSE_CATEGORIES: ['food', 'transport', 'accommodation'],
}))
vi.mock('../../src/services/osrm.js', () => ({
  calculateRoute: vi.fn(async () => ({ distance: 300000 })),
  searchCity: vi.fn(async () => [{ lat: 48.8, lon: 2.3, country_code: 'FR' }]),
  searchCities: vi.fn(async () => []),
}))
vi.mock('../../src/services/firebase.js', () => ({
  getDb: vi.fn(() => null),
}))

import '../../src/handlers/tripJournal.js'
import {
  createTrip, addLeg, endTrip, updateTrip,
  setDayNote, setDayExpenses, setDayPhoto, getTrip,
  flushPendingSync,
} from '../../src/services/tripJournal.js'

describe('tripJournal — navigation handlers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetState.mockReturnValue({ journalView: 'list', journalTripId: null, journalTransport: 'hitchhike' })
  })

  it('journalBack from add-leg goes to detail', () => {
    mockGetState.mockReturnValue({ journalView: 'add-leg', journalTripId: 'trip-1' })
    window.journalBack()
    expect(mockSetState).toHaveBeenCalledWith({ journalView: 'detail' })
  })

  it('journalBack from expenses goes to detail', () => {
    mockGetState.mockReturnValue({ journalView: 'expenses', journalTripId: 'trip-1' })
    window.journalBack()
    expect(mockSetState).toHaveBeenCalledWith({ journalView: 'detail' })
  })

  it('journalBack from detail goes to list', () => {
    mockGetState.mockReturnValue({ journalView: 'detail', journalTripId: 'trip-1' })
    window.journalBack()
    expect(mockSetState).toHaveBeenCalledWith({ journalView: 'list', journalTripId: null })
  })

  it('journalBack from stats goes to list', () => {
    mockGetState.mockReturnValue({ journalView: 'stats', journalTripId: 'trip-1' })
    window.journalBack()
    expect(mockSetState).toHaveBeenCalledWith({ journalView: 'list', journalTripId: null })
  })

  it('journalBack from list goes to list (default)', () => {
    mockGetState.mockReturnValue({ journalView: 'list', journalTripId: null })
    window.journalBack()
    expect(mockSetState).toHaveBeenCalledWith({ journalView: 'list' })
  })

  it('journalBack flushes pending sync when tripId set', () => {
    mockGetState.mockReturnValue({ journalView: 'detail', journalTripId: 'trip-1' })
    window.journalBack()
    expect(flushPendingSync).toHaveBeenCalledWith('trip-1')
  })

  it('journalNewTrip sets journalView to new-trip', () => {
    window.journalNewTrip()
    expect(mockSetState).toHaveBeenCalledWith({ journalView: 'new-trip' })
  })

  it('journalOpenTrip sets view to detail with tripId', () => {
    window.journalOpenTrip('trip-abc')
    expect(mockSetState).toHaveBeenCalledWith({ journalView: 'detail', journalTripId: 'trip-abc' })
  })

  it('journalShowStats sets view to stats with tripId', () => {
    window.journalShowStats('trip-abc')
    expect(mockSetState).toHaveBeenCalledWith({ journalView: 'stats', journalTripId: 'trip-abc' })
  })

  it('journalEditExpenses sets expenses view with tripId and date', () => {
    window.journalEditExpenses('trip-abc', '2026-01-01')
    expect(mockSetState).toHaveBeenCalledWith({ journalView: 'expenses', journalTripId: 'trip-abc', journalDate: '2026-01-01' })
  })

  it('journalEditDayNote sets day-note view', () => {
    window.journalEditDayNote('trip-abc', '2026-01-01')
    expect(mockSetState).toHaveBeenCalledWith({ journalView: 'day-note', journalTripId: 'trip-abc', journalDate: '2026-01-01' })
  })
})

describe('tripJournal — journalCreateTrip', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    document.body.innerHTML = ''
  })

  it('calls createTrip and sets view to detail on success', () => {
    document.body.innerHTML = `
      <input id="journal-trip-title" value="My Trip" />
      <input id="journal-start-date" value="2026-06-01" />
    `
    window.journalCreateTrip()
    expect(createTrip).toHaveBeenCalledWith({ title: 'My Trip', startDate: '2026-06-01' })
    expect(mockSetState).toHaveBeenCalledWith({ journalView: 'detail', journalTripId: 'trip-abc12345' })
  })

  it('shows error when createTrip fails', () => {
    createTrip.mockReturnValue(null)
    document.body.innerHTML = '<input id="journal-trip-title" value="Trip" /><input id="journal-start-date" value="2026-06-01" />'
    window.journalCreateTrip()
    expect(window.showToast).toHaveBeenCalled()
  })

  it('uses today as default start date when input absent', () => {
    document.body.innerHTML = '<input id="journal-trip-title" value="Trip" />'
    createTrip.mockReturnValue({ id: 'trip-xyz' })
    window.journalCreateTrip()
    expect(createTrip).toHaveBeenCalled()
  })
})

describe('tripJournal — journalSaveLeg', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    document.body.innerHTML = ''
    mockGetState.mockReturnValue({ journalTransport: 'hitchhike' })
    addLeg.mockReturnValue({ id: 'leg-1' })
  })

  it('shows error when departure missing', () => {
    document.body.innerHTML = '<input id="journal-departure" value="" /><input id="journal-arrival" value="Lyon" />'
    window.journalSaveLeg('trip-1')
    expect(window.showToast).toHaveBeenCalled()
    expect(addLeg).not.toHaveBeenCalled()
  })

  it('shows error when arrival missing', () => {
    document.body.innerHTML = '<input id="journal-departure" value="Paris" /><input id="journal-arrival" value="" />'
    window.journalSaveLeg('trip-1')
    expect(window.showToast).toHaveBeenCalled()
    expect(addLeg).not.toHaveBeenCalled()
  })

  it('calls addLeg when form is valid', () => {
    document.body.innerHTML = `
      <input id="journal-departure" value="Paris" />
      <input id="journal-arrival" value="Lyon" />
      <input id="journal-note" value="Great ride!" />
      <input id="journal-wait-time" value="15" />
      <input id="journal-price" value="0" />
      <input id="journal-duration" value="120" />
    `
    window.journalSaveLeg('trip-1')
    expect(addLeg).toHaveBeenCalledWith('trip-1', expect.objectContaining({
      departureName: 'Paris',
      arrivalName: 'Lyon',
    }))
  })

  it('shows error when text is too long', () => {
    const longText = 'a'.repeat(201)
    document.body.innerHTML = `<input id="journal-departure" value="${longText}" /><input id="journal-arrival" value="Lyon" />`
    window.journalSaveLeg('trip-1')
    expect(window.showToast).toHaveBeenCalled()
  })
})

describe('tripJournal — journalEndTrip', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getTrip.mockReturnValue({ id: 'trip-1', title: 'Test', legs: [], isPublic: false })
    window.confirm = vi.fn(() => true)
  })

  it('calls endTrip and shows stats when confirmed', () => {
    window.journalEndTrip('trip-1')
    expect(endTrip).toHaveBeenCalledWith('trip-1')
    expect(mockSetState).toHaveBeenCalledWith({ journalView: 'stats', journalTripId: 'trip-1' })
  })

  it('does nothing when user cancels confirm', () => {
    window.confirm = vi.fn(() => false)
    window.journalEndTrip('trip-1')
    expect(endTrip).not.toHaveBeenCalled()
  })

  it('does nothing when trip not found', () => {
    getTrip.mockReturnValue(null)
    window.journalEndTrip('nonexistent')
    expect(endTrip).not.toHaveBeenCalled()
  })
})

describe('tripJournal — journalSaveExpenses', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    document.body.innerHTML = `
      <input id="exp-food" value="25" />
      <input id="exp-transport" value="0" />
      <input id="exp-accommodation" value="30" />
    `
  })

  it('calls setDayExpenses and navigates to detail', () => {
    window.journalSaveExpenses('trip-1', '2026-06-01')
    expect(setDayExpenses).toHaveBeenCalledWith('trip-1', '2026-06-01', { food: 25, accommodation: 30 })
    expect(mockSetState).toHaveBeenCalledWith({ journalView: 'detail', journalTripId: 'trip-1' })
  })
})

describe('tripJournal — journalSaveDayNote', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    document.body.innerHTML = ''
  })

  it('shows error when note is empty', () => {
    document.body.innerHTML = '<textarea id="journal-day-note"></textarea>'
    window.journalSaveDayNote('trip-1', '2026-06-01')
    expect(window.showToast).toHaveBeenCalled()
    expect(setDayNote).not.toHaveBeenCalled()
  })

  it('calls setDayNote and navigates when note provided', () => {
    document.body.innerHTML = '<textarea id="journal-day-note">Great day!</textarea>'
    window.journalSaveDayNote('trip-1', '2026-06-01')
    expect(setDayNote).toHaveBeenCalledWith('trip-1', '2026-06-01', 'Great day!')
    expect(mockSetState).toHaveBeenCalledWith({ journalView: 'detail', journalTripId: 'trip-1' })
  })
})

describe('tripJournal — spot picker', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window._journalSpotMapInstance = null
  })

  it('journalPickSpot sets journalSpotOverlay state', () => {
    vi.useFakeTimers()
    window.journalPickSpot('departure')
    expect(mockSetState).toHaveBeenCalledWith({ journalSpotOverlay: 'departure', journalSelectedSpotFromMap: null })
    vi.useRealTimers()
  })

  it('journalCloseSpotOverlay clears overlay state', () => {
    window._journalSpotMapInstance = null
    window.journalCloseSpotOverlay()
    expect(mockSetState).toHaveBeenCalledWith({ journalSpotOverlay: null, journalSelectedSpotFromMap: null })
  })

  it('journalCloseSpotOverlay calls .remove() on map instance', () => {
    const mockMap = { remove: vi.fn() }
    window._journalSpotMapInstance = mockMap
    window.journalCloseSpotOverlay()
    expect(mockMap.remove).toHaveBeenCalled()
    expect(window._journalSpotMapInstance).toBeNull()
  })

  it('journalSelectSpotFromMap does nothing when no spot selected', () => {
    mockGetState.mockReturnValue({ journalSelectedSpotFromMap: null })
    window.journalSelectSpotFromMap()
    expect(mockSetState).not.toHaveBeenCalled()
  })

  it('journalSelectSpotFromMap stores spot and clears overlay', () => {
    const spot = { id: 's1', name: 'Cool Spot', lat: 48.8, lng: 2.3 }
    mockGetState.mockReturnValue({ journalSelectedSpotFromMap: spot })
    window.journalSelectSpotFromMap()
    expect(window._journalSelectedSpotId).toBe('s1')
    expect(mockSetState).toHaveBeenCalledWith({ journalSpotOverlay: null, journalSelectedSpotFromMap: null })
  })

  it('journalClearSpot clears all spot globals', () => {
    window._journalSelectedSpotId = 'spot-1'
    window._journalSelectedSpotName = 'My Spot'
    window.journalClearSpot()
    expect(window._journalSelectedSpotId).toBeNull()
    expect(window._journalSelectedSpotName).toBeNull()
  })
})

describe('tripJournal — misc handlers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    document.body.innerHTML = ''
  })

  it('journalToggleExpenses toggles class on parent', () => {
    document.body.innerHTML = '<div class="journal-day-expenses"><button id="toggle-btn">Toggle</button></div>'
    const el = document.getElementById('toggle-btn')
    window.journalToggleExpenses(el)
    expect(el.closest('.journal-day-expenses').classList.contains('open')).toBe(true)
    window.journalToggleExpenses(el)
    expect(el.closest('.journal-day-expenses').classList.contains('open')).toBe(false)
  })

  it('journalToggleExpenses does not throw with null el', () => {
    expect(() => window.journalToggleExpenses(null)).not.toThrow()
  })

  it('journalSelectTransport sets journalTransport state', () => {
    window.journalSelectTransport('train')
    expect(mockSetState).toHaveBeenCalledWith({ journalTransport: 'train' })
  })
})

describe('tripJournal — share and export', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getTrip.mockReturnValue({ id: 'trip-abc12345', title: 'Test Trip', legs: [] })
    global.URL.createObjectURL = vi.fn(() => 'blob:fake')
    global.URL.revokeObjectURL = vi.fn()
    document.body.innerHTML = ''
  })

  it('journalShareTrip does not throw', async () => {
    await expect(window.journalShareTrip('trip-abc12345')).resolves.not.toThrow()
  })

  it('journalShareTrip copies to clipboard when share unavailable', async () => {
    delete navigator.share
    navigator.clipboard = { writeText: vi.fn().mockResolvedValue() }
    await window.journalShareTrip('trip-abc12345')
    expect(navigator.clipboard.writeText).toHaveBeenCalled()
  })

  it('journalShareTrip does nothing when trip not found', async () => {
    getTrip.mockReturnValue(null)
    await expect(window.journalShareTrip('nonexistent')).resolves.not.toThrow()
  })

  it('journalCopyLink copies URL to clipboard', async () => {
    navigator.clipboard = { writeText: vi.fn().mockResolvedValue() }
    await window.journalCopyLink('trip-abc12345')
    expect(navigator.clipboard.writeText).toHaveBeenCalled()
    expect(window.showToast).toHaveBeenCalled()
  })

  it('journalExportTrip as JSON creates download', () => {
    window.journalExportTrip('trip-abc12345', 'json')
    expect(URL.createObjectURL).toHaveBeenCalled()
    expect(window.showToast).toHaveBeenCalled()
  })

  it('journalExportTrip as GPX creates download', () => {
    window.journalExportTrip('trip-abc12345', 'gpx')
    expect(URL.createObjectURL).toHaveBeenCalled()
  })

  it('journalExportTrip does nothing when trip not found', () => {
    getTrip.mockReturnValue(null)
    window.journalExportTrip('nonexistent', 'json')
    expect(URL.createObjectURL).not.toHaveBeenCalled()
  })
})

describe('tripJournal — journalDeleteDayPhoto', () => {
  beforeEach(() => { vi.clearAllMocks(); window.confirm = vi.fn(() => true) })

  it('calls setDayPhoto with null when confirmed', () => {
    window.journalDeleteDayPhoto('trip-1', '2026-06-01')
    expect(setDayPhoto).toHaveBeenCalledWith('trip-1', '2026-06-01', null)
  })

  it('does not call setDayPhoto when cancelled', () => {
    window.confirm = vi.fn(() => false)
    window.journalDeleteDayPhoto('trip-1', '2026-06-01')
    expect(setDayPhoto).not.toHaveBeenCalled()
  })
})

describe('tripJournal — journalUseMyPosition', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('shows warning when geolocation unavailable', async () => {
    const origGeo = navigator.geolocation
    Object.defineProperty(navigator, 'geolocation', { value: null, configurable: true })
    await window.journalUseMyPosition('departure')
    expect(window.showToast).toHaveBeenCalled()
    Object.defineProperty(navigator, 'geolocation', { value: origGeo, configurable: true })
  })
})
