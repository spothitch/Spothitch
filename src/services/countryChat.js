/**
 * Country Chat Service
 * Auto-creates or joins a group conversation for a specific country.
 * Uses groupConversations collection — one group per country code.
 * Document ID pattern: country_{code} (e.g. country_FR, country_DE)
 */

import { getState } from '../stores/state.js'

const COUNTRY_FLAGS = {
  FR: '🇫🇷', DE: '🇩🇪', ES: '🇪🇸', IT: '🇮🇹', NL: '🇳🇱', BE: '🇧🇪',
  PT: '🇵🇹', AT: '🇦🇹', CH: '🇨🇭', IE: '🇮🇪', PL: '🇵🇱', CZ: '🇨🇿',
  GB: '🇬🇧', SE: '🇸🇪', NO: '🇳🇴', DK: '🇩🇰', FI: '🇫🇮', HU: '🇭🇺',
  HR: '🇭🇷', RO: '🇷🇴', GR: '🇬🇷', BG: '🇧🇬', SK: '🇸🇰', SI: '🇸🇮',
  US: '🇺🇸', CA: '🇨🇦', MX: '🇲🇽', BR: '🇧🇷', AR: '🇦🇷',
  AU: '🇦🇺', NZ: '🇳🇿', JP: '🇯🇵', TH: '🇹🇭', IN: '🇮🇳',
  TR: '🇹🇷', MA: '🇲🇦', ZA: '🇿🇦', IL: '🇮🇱', GE: '🇬🇪',
}

const COUNTRY_NAMES = {
  FR: { fr: 'France', en: 'France', es: 'Francia', de: 'Frankreich' },
  DE: { fr: 'Allemagne', en: 'Germany', es: 'Alemania', de: 'Deutschland' },
  ES: { fr: 'Espagne', en: 'Spain', es: 'España', de: 'Spanien' },
  IT: { fr: 'Italie', en: 'Italy', es: 'Italia', de: 'Italien' },
  NL: { fr: 'Pays-Bas', en: 'Netherlands', es: 'Países Bajos', de: 'Niederlande' },
  GB: { fr: 'Royaume-Uni', en: 'United Kingdom', es: 'Reino Unido', de: 'Vereinigtes Königreich' },
  PT: { fr: 'Portugal', en: 'Portugal', es: 'Portugal', de: 'Portugal' },
  BE: { fr: 'Belgique', en: 'Belgium', es: 'Bélgica', de: 'Belgien' },
  AT: { fr: 'Autriche', en: 'Austria', es: 'Austria', de: 'Österreich' },
  CH: { fr: 'Suisse', en: 'Switzerland', es: 'Suiza', de: 'Schweiz' },
  PL: { fr: 'Pologne', en: 'Poland', es: 'Polonia', de: 'Polen' },
  CZ: { fr: 'Tchéquie', en: 'Czech Republic', es: 'Chequia', de: 'Tschechien' },
  HR: { fr: 'Croatie', en: 'Croatia', es: 'Croacia', de: 'Kroatien' },
  GR: { fr: 'Grèce', en: 'Greece', es: 'Grecia', de: 'Griechenland' },
  TR: { fr: 'Turquie', en: 'Turkey', es: 'Turquía', de: 'Türkei' },
  US: { fr: 'États-Unis', en: 'United States', es: 'Estados Unidos', de: 'Vereinigte Staaten' },
  MA: { fr: 'Maroc', en: 'Morocco', es: 'Marruecos', de: 'Marokko' },
}

/**
 * Get the country name in the user's language
 */
export function getCountryName(code) {
  const lang = localStorage.getItem('spothitch_lang') || 'fr'
  return COUNTRY_NAMES[code]?.[lang] || COUNTRY_NAMES[code]?.en || code
}

/**
 * Get flag emoji for a country code
 */
export function getCountryFlag(code) {
  return COUNTRY_FLAGS[code] || '🌍'
}

/**
 * Join or create a country chat group
 * @param {string} countryCode - e.g. 'FR'
 */
export async function joinCountryChat(countryCode) {
  const state = getState()
  const uid = state.user?.uid
  if (!uid) {
    window.requireAuth?.('joinCountryChat')
    return null
  }

  try {
    const { doc, setDoc, arrayUnion, serverTimestamp } = await import('firebase/firestore')
    const { db } = await import('./firebase.js')
    if (!db) return null

    const groupId = `country_${countryCode}`
    const groupRef = doc(db, 'groupConversations', groupId)
    const lang = localStorage.getItem('spothitch_lang') || 'fr'
    const name = COUNTRY_NAMES[countryCode]?.[lang] || countryCode

    // Use setDoc with merge — creates the doc if it doesn't exist, or adds the user if it does
    // This avoids needing a getDoc first (which requires membership for non-country groups)
    await setDoc(groupRef, {
      name: `${getCountryFlag(countryCode)} ${name}`,
      icon: getCountryFlag(countryCode),
      type: 'country',
      countryCode,
      members: arrayUnion(uid),
      updatedAt: serverTimestamp(),
    }, { merge: true })

    // Open the conversation
    const { setState } = await import('../stores/state.js')
    setState({ activeGroupConversation: groupId, socialSubTab: 'messagerie' })

    return groupId
  } catch (err) {
    console.error('[CountryChat] Failed to join:', err.message)
    return null
  }
}

/**
 * Leave a country chat group
 * @param {string} countryCode - e.g. 'FR'
 */
export async function leaveCountryChat(countryCode) {
  const state = getState()
  const uid = state.user?.uid
  if (!uid) return false

  try {
    const { doc, updateDoc, arrayRemove, increment } = await import('firebase/firestore')
    const { db } = await import('./firebase.js')
    if (!db) return false

    const groupId = `country_${countryCode}`
    await updateDoc(doc(db, 'groupConversations', groupId), {
      members: arrayRemove(uid),
      memberCount: increment(-1),
    })
    return true
  } catch (err) {
    console.error('[CountryChat] Failed to leave:', err.message)
    return false
  }
}

/**
 * Get list of popular country chats (by member count)
 */
export async function getPopularCountryChats() {
  try {
    const { collection, query, where, orderBy, limit, getDocs } = await import('firebase/firestore')
    const { db } = await import('./firebase.js')
    if (!db) return []

    const q = query(
      collection(db, 'groupConversations'),
      where('type', '==', 'country'),
      orderBy('memberCount', 'desc'),
      limit(20)
    )
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch {
    return []
  }
}

/**
 * Get all available countries for chat
 */
export function getAvailableCountries() {
  return Object.keys(COUNTRY_FLAGS).map(code => ({
    code,
    name: getCountryName(code),
    flag: getCountryFlag(code),
  }))
}
