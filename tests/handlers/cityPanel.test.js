import { describe, it, expect, vi } from 'vitest'

const mockSetState = vi.fn()
window.setState = mockSetState

vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({})),
  setState: (...args) => mockSetState(...args),
}))
vi.mock('../../src/i18n/index.js', () => ({ t: vi.fn((k) => k) }))
vi.mock('../../src/utils/icons.js', () => ({ icon: vi.fn((n) => `<svg>${n}</svg>`) }))
vi.mock('../../src/services/cityRoutes.js', () => ({
  slugify: vi.fn((s) => s),
  findNearbySpots: vi.fn(() => []),
  buildCityInfo: vi.fn(() => ({ avgRating: 0, avgWait: 0, routeGroups: {} })),
}))

await import('../../src/handlers/cityPanel.js')

describe('cityPanel handlers', () => {
  it('openCityPanel is a function', () => {
    expect(typeof window.openCityPanel).toBe('function')
  })
  it('closeCityPanel resets state', () => {
    window.closeCityPanel?.()
    expect(mockSetState).toHaveBeenCalledWith(expect.objectContaining({ selectedCity: null }))
  })
  it('selectCityRoute is a function', () => {
    expect(typeof window.selectCityRoute).toBe('function')
  })
  it('viewCitySpotsOnMap is a function', () => {
    expect(typeof window.viewCitySpotsOnMap).toBe('function')
  })
})
