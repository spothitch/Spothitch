import { describe, it, expect, vi } from 'vitest'

const mockSetState = vi.fn()
const mockGetState = vi.fn(() => ({ filterVerifiedOnly: false }))
vi.mock('../../src/stores/state.js', () => ({
  getState: (...args) => mockGetState(...args),
  setState: (...args) => mockSetState(...args),
  actions: {
    setFilter: vi.fn(),
    setSearchQuery: vi.fn(),
  },
}))
vi.mock('../../src/utils/performance.js', () => ({
  debounce: vi.fn((key, fn) => fn()),
}))
vi.mock('../../src/components/modals/Filters.js', () => ({
  resetFilters: vi.fn(),
}))

await import('../../src/handlers/filters.js')

describe('filter handlers', () => {
  it('openFilters sets showFilters=true', () => {
    window.openFilters?.()
    expect(mockSetState).toHaveBeenCalledWith({ showFilters: true })
  })

  it('closeFilters sets showFilters=false', () => {
    window.closeFilters?.()
    expect(mockSetState).toHaveBeenCalledWith({ showFilters: false })
  })

  it('setFilterCountry sets filterCountry', () => {
    window.setFilterCountry?.('FR')
    expect(mockSetState).toHaveBeenCalledWith({ filterCountry: 'FR' })
  })

  it('setSortBy sets sortBy', () => {
    window.setSortBy?.('rating')
    expect(mockSetState).toHaveBeenCalledWith({ sortBy: 'rating' })
  })

  it('toggleVerifiedFilter flips the state', () => {
    window.toggleVerifiedFilter?.()
    expect(mockSetState).toHaveBeenCalledWith({ filterVerifiedOnly: true })
  })
})
