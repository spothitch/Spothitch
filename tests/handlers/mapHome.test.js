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

  it('homeClearSearch sets homeSearchLabel to empty', () => {
    window.homeClearSearch?.()
    expect(mockSetState).toHaveBeenCalledWith({ homeSearchLabel: '' })
  })

  it('toggleMapLegend flips showMapLegend from false to true', () => {
    window.getState.mockReturnValue({ showMapLegend: false })
    window.toggleMapLegend?.()
    expect(mockSetState).toHaveBeenCalledWith({ showMapLegend: true })
  })

  it('toggleMapLegend flips showMapLegend from true to false', () => {
    window.getState.mockReturnValue({ showMapLegend: true })
    window.toggleMapLegend?.()
    expect(mockSetState).toHaveBeenCalledWith({ showMapLegend: false })
  })

  it('homeZoomIn does nothing without map (no crash)', () => {
    window.homeMapInstance = null
    window.homeZoomIn?.()
    // No map = no-op, no crash
    expect(true).toBe(true)
  })

  it('homeZoomIn calls map.zoomIn when map exists', () => {
    const mockZoomIn = vi.fn()
    window.homeMapInstance = { zoomIn: mockZoomIn }
    window.homeZoomIn?.()
    expect(mockZoomIn).toHaveBeenCalled()
    window.homeMapInstance = null
  })

  it('homeZoomOut calls map.zoomOut when map exists', () => {
    const mockZoomOut = vi.fn()
    window.homeMapInstance = { zoomOut: mockZoomOut }
    window.homeZoomOut?.()
    expect(mockZoomOut).toHaveBeenCalled()
    window.homeMapInstance = null
  })
})
