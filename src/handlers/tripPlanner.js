/**
 * Trip Planner Handlers (legacy compat)
 * Backward-compatible handlers for old step-based planner.
 * Extracted from main.js.
 */

import { setState } from '../stores/state.js'
import { debounce } from '../utils/performance.js'
import { escapeHTML, escapeJSString } from '../utils/sanitize.js'

window.searchTripCity = (query) => {
  if (query.length < 3) {
    document.getElementById('city-suggestions')?.classList.add('hidden')
    return
  }
  debounce('tripCity', async () => {
    const { searchTripLocation } = await import('../services/planner.js')
    const results = await searchTripLocation(query)
    const container = document.getElementById('city-suggestions')
    if (container && results.length > 0) {
      container.classList.remove('hidden')
      container.innerHTML = `
        <div class="bg-white/5 rounded-xl shadow-xl border border-white/10 overflow-hidden">
        ${results.map(r => `
          <button onclick="addTripStepFromSearch('${escapeJSString(r.name)}', ${Number(r.lat)}, ${Number(r.lng)}, '${escapeJSString(r.fullName)}')"
            class="w-full px-4 py-3 text-left text-white hover:bg-white/10 border-b border-white/10 last:border-0">
            <div class="font-medium">${escapeHTML(r.name)}</div>
            <div class="text-xs text-slate-400 truncate">${escapeHTML(r.fullName)}</div></button>
        `).join('')}
        </div>
      `
    }
  }, 400)
}
window.addTripStepFromSearch = async (name, lat, lng, fullName) => {
  const { addTripStep } = await import('../services/planner.js')
  addTripStep({ name, lat, lng, fullName })
  const stepInput = document.getElementById('step-input')
  if (stepInput) stepInput.value = ''
  document.getElementById('city-suggestions')?.classList.add('hidden')
}
window.addFirstSuggestion = () => {
  const firstBtn = document.querySelector('#city-suggestions button')
  if (firstBtn) firstBtn.click()
}
window.removeTripStep = async (index) => {
  const { removeTripStep } = await import('../services/planner.js')
  removeTripStep(index)
}
window.moveTripStep = async (from, to) => {
  const { reorderTripSteps } = await import('../services/planner.js')
  reorderTripSteps(from, to)
}
window.clearTripSteps = async () => {
  const { clearTripSteps } = await import('../services/planner.js')
  clearTripSteps()
}

window.openTripPlanner = () => setState({ activeTab: 'voyage', voyageSubTab: 'voyage' })
window.closeTripPlanner = () => setState({ showTripPlanner: false })
