import { describe, it, expect, vi } from 'vitest'

const mockSetState = vi.fn()
vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({ tripSteps: [] })),
  setState: (...args) => mockSetState(...args),
}))
vi.mock('../../src/services/planner.js', () => ({
  searchTripLocation: vi.fn().mockResolvedValue([]),
  removeTripStep: vi.fn(),
  reorderTripSteps: vi.fn(),
  clearTripSteps: vi.fn(),
}))
vi.mock('../../src/services/notifications.js', () => ({ showToast: vi.fn() }))
vi.mock('../../src/i18n/index.js', () => ({ t: vi.fn((k) => k) }))

await import('../../src/handlers/tripPlanner.js')

describe('tripPlanner handlers', () => {
  it('openTripPlanner sets voyage tab', () => {
    window.openTripPlanner?.()
    expect(mockSetState).toHaveBeenCalledWith(expect.objectContaining({ activeTab: 'voyage' }))
  })

  it('closeTripPlanner sets showTripPlanner=false', () => {
    window.closeTripPlanner?.()
    expect(mockSetState).toHaveBeenCalledWith({ showTripPlanner: false })
  })

  it('searchTripCity is a function', () => {
    expect(typeof window.searchTripCity).toBe('function')
  })

  it('removeTripStep is a function', () => {
    expect(typeof window.removeTripStep).toBe('function')
  })

  it('clearTripSteps is a function', () => {
    expect(typeof window.clearTripSteps).toBe('function')
  })
})
