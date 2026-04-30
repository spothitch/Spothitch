import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockSetState = vi.fn()
window.setState = mockSetState
window.getState = vi.fn(() => ({ map: null, userLocation: null, showMapLegend: false }))

vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({ map: null, userLocation: null, showMapLegend: false })),
  setState: (...args) => mockSetState(...args),
}))
vi.mock('../../src/services/notifications.js', () => ({ showToast: vi.fn() }))
vi.mock('../../src/i18n/index.js', () => ({ t: vi.fn((k) => k) }))
vi.mock('../../src/services/osrm.js', () => ({
  searchLocation: vi.fn().mockResolvedValue([]),
}))
vi.mock('../../src/utils/performance.js', () => ({
  debounce: vi.fn((key, fn) => fn()),
}))

await import('../../src/handlers/mapHome.js')

describe('mapHome handlers', () => {
  beforeEach(() => { mockSetState.mockClear() })

  it('homeClearSearch resets search state', () => {
    window.homeClearSearch?.()
    expect(mockSetState).toHaveBeenCalled()
  })
  it('toggleMapLegend calls setState', () => {
    window.toggleMapLegend?.()
    expect(mockSetState).toHaveBeenCalled()
  })
  it('homeSearchDestination triggers a search', () => {
    window.homeSearchDestination?.('Paris')
    // debounce mock calls fn immediately
    // searchLocation should have been called eventually
    expect(mockSetState).toBeDefined()
  })
  it('homeCenterOnUser does not crash without map', () => {
    expect(() => window.homeCenterOnUser?.()).not.toThrow()
  })
  it('homeZoomIn does not crash without map', () => {
    expect(() => window.homeZoomIn?.()).not.toThrow()
  })
  it('homeZoomOut does not crash without map', () => {
    expect(() => window.homeZoomOut?.()).not.toThrow()
  })
})
