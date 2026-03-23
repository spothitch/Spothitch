/**
 * Dynamic guide sections loader
 * Loads only the user's language to minimize bundle size
 */

import { getState } from '../stores/state.js'

let cachedLang = null
let cachedData = null

/**
 * Get guide sections data for the current language
 * Returns cached data if language hasn't changed
 */
export async function loadGuideSections() {
  const lang = getState()?.lang || 'fr'

  if (cachedLang === lang && cachedData) {
    return cachedData
  }

  let mod
  switch (lang) {
    case 'en':
      mod = await import('./guideSections-en.js')
      break
    case 'es':
      mod = await import('./guideSections-es.js')
      break
    case 'de':
      mod = await import('./guideSections-de.js')
      break
    default:
      mod = await import('./guideSections-fr.js')
  }

  cachedLang = lang
  cachedData = mod.guideSectionsData
  return cachedData
}

/**
 * Synchronous getter (returns cached or null)
 * Use after initial loadGuideSections() call
 */
export function getGuideSections() {
  return cachedData
}

/**
 * Clear cache (call when language changes)
 */
export function clearGuideSectionsCache() {
  cachedLang = null
  cachedData = null
}
