import { describe, it, expect, vi } from 'vitest'

const mockSetState = vi.fn()
vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({ map: null, userLocation: null })),
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
  it('homeSearchDestination is a function', () => {
    expect(typeof window.homeSearchDestination).toBe('function')
  })
  it('homeClearSearch is a function', () => {
    expect(typeof window.homeClearSearch).toBe('function')
  })
  it('homeCenterOnUser is a function', () => {
    expect(typeof window.homeCenterOnUser).toBe('function')
  })
  it('homeZoomIn is a function', () => {
    expect(typeof window.homeZoomIn).toBe('function')
  })
  it('homeZoomOut is a function', () => {
    expect(typeof window.homeZoomOut).toBe('function')
  })
  it('toggleMapLegend is a function', () => {
    expect(typeof window.toggleMapLegend).toBe('function')
  })
})
