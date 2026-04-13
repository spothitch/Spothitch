/**
 * Filter Handlers
 * Map spot filtering, sorting, and search.
 * Extracted from main.js.
 */

import { getState, setState } from '../stores/state.js'
import { actions } from '../stores/state.js'
import { debounce } from '../utils/performance.js'
import { resetFilters as resetFiltersUtil } from '../components/modals/Filters.js'

window.setFilter = (filter) => actions.setFilter(filter)
window.handleSearch = (query) => debounce('search', () => actions.setSearchQuery(query), 250)
window.openFilters = () => setState({ showFilters: true })
window.closeFilters = () => setState({ showFilters: false })
window.openActiveTrip = () => setState({ showTripPlanner: true })
window.setFilterCountry = (country) => setState({ filterCountry: country })
window.setFilterMinRating = (rating) => setState({ filterMinRating: rating })
window.setFilterMaxWait = (wait) => setState({ filterMaxWait: wait })
window.toggleVerifiedFilter = () => {
  const { filterVerifiedOnly } = getState()
  setState({ filterVerifiedOnly: !filterVerifiedOnly })
}
window.setSortBy = (sortBy) => setState({ sortBy })
window.applyFilters = () => {
  const overlay = document.getElementById('filters-overlay')
  if (overlay) overlay.remove()
  setState({ showFilters: false })
  if (window._refreshMapSpots) window._refreshMapSpots()
}
window.resetFilters = () => resetFiltersUtil()
