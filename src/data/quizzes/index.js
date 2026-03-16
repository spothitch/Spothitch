/**
 * Country Quizzes Index
 * Quiz data is lazy-loaded per country to reduce chunk size
 */

// Lazy loaders — quiz data (~12KB each) loaded only when needed
const quizLoaders = {
  FR: () => import('./france.js').then(m => m.franceQuiz),
  DE: () => import('./germany.js').then(m => m.germanyQuiz),
  ES: () => import('./spain.js').then(m => m.spainQuiz),
  GB: () => import('./uk.js').then(m => m.ukQuiz),
  NL: () => import('./netherlands.js').then(m => m.netherlandsQuiz),
}

// Cache loaded quizzes
const _cache = {}

/**
 * Get list of available country codes that have quizzes
 */
export function getAvailableQuizCountries() {
  return Object.keys(quizLoaders)
}

/**
 * Get quiz data for a specific country code (async, lazy-loaded)
 * @param {string} countryCode - ISO 2-letter country code (e.g. 'FR', 'DE')
 * @returns {Promise<object|null>} Quiz data or null if not found
 */
export async function getCountryQuizData(countryCode) {
  const code = countryCode?.toUpperCase()
  if (!code || !quizLoaders[code]) return null
  if (_cache[code]) return _cache[code]
  _cache[code] = await quizLoaders[code]()
  return _cache[code]
}

/**
 * Synchronous access for backward compat (returns cached or null)
 */
export function getCountryQuizDataSync(countryCode) {
  return _cache[countryCode?.toUpperCase()] || null
}

/**
 * Country flags lookup
 */
export const countryFlags = {
  FR: '\uD83C\uDDEB\uD83C\uDDF7',
  DE: '\uD83C\uDDE9\uD83C\uDDEA',
  ES: '\uD83C\uDDEA\uD83C\uDDF8',
  GB: '\uD83C\uDDEC\uD83C\uDDE7',
  NL: '\uD83C\uDDF3\uD83C\uDDF1',
}

/**
 * Country names in all 4 languages
 */
export const countryNames = {
  FR: { fr: 'France', en: 'France', es: 'Francia', de: 'Frankreich' },
  DE: { fr: 'Allemagne', en: 'Germany', es: 'Alemania', de: 'Deutschland' },
  ES: { fr: 'Espagne', en: 'Spain', es: 'Espana', de: 'Spanien' },
  GB: { fr: 'Royaume-Uni', en: 'United Kingdom', es: 'Reino Unido', de: 'Vereinigtes Koenigreich' },
  NL: { fr: 'Pays-Bas', en: 'Netherlands', es: 'Paises Bajos', de: 'Niederlande' },
}
