import { Storage } from '../utils/storage.js'
import { getState, setState } from '../stores/state.js'
import { t } from '../i18n/index.js'

const STORAGE_KEY = 'spothitch_ambassadors'

// No demo data — ambassadors are real community members only
function initAmbassadors() {
  const stored = Storage.get(STORAGE_KEY)
  return stored || []
}

// Get all ambassadors or filter by city
export function getAmbassadors(city = null) {
  const ambassadors = initAmbassadors()
  if (!city) return ambassadors
  return ambassadors.filter(a => a.city.toLowerCase() === city.toLowerCase())
}

// Check if current user is eligible to become an ambassador
export function isEligibleForAmbassador() {
  const state = getState()
  if (!state.user) return false

  const trustScore = state.user.trustScore || 0
  const spotsCreated = state.user.spotsCreated || 0
  const checkins = state.user.checkins || 0

  return trustScore >= 50 || spotsCreated >= 10 || checkins >= 5
}

// Register current user as ambassador
export function registerAsAmbassador(data) {
  const state = getState()
  if (!state.user) {
    throw new Error(t('pleaseLoginFirst'))
  }

  if (!isEligibleForAmbassador()) {
    throw new Error(t('notEligibleForAmbassador'))
  }

  const { city, country, bio, languages, availability } = data
  if (!city || !country || !bio) {
    throw new Error(t('allFieldsRequired'))
  }
  if (bio.length > 500 || city.length > 100 || country.length > 100) {
    throw new Error(t('fieldTooLong') || 'Text too long')
  }

  const ambassadors = initAmbassadors()

  // Check if already registered
  const existingIndex = ambassadors.findIndex(a => a.userId === state.user.uid)

  const ambassador = {
    userId: state.user.uid,
    userName: state.user.displayName || state.user.email,
    userAvatar: state.user.avatar || 'thumbs-up',
    city,
    country,
    bio,
    languages: languages || ['en'],
    availability: availability || 'available',
    registeredAt: existingIndex >= 0 ? ambassadors[existingIndex].registeredAt : Date.now(),
    spotsCreated: state.user.spotsCreated || 0,
    checkins: state.user.checkins || 0
  }

  if (existingIndex >= 0) {
    ambassadors[existingIndex] = ambassador
  } else {
    ambassadors.push(ambassador)
  }

  Storage.set(STORAGE_KEY, ambassadors)

  // Sync to Firestore
  import('./firebase.js').then(async (fb) => {
    try {
      const db = fb.getDb()
      if (!db || !state.user?.uid) return
      await fb.setDoc(fb.doc(db, 'ambassadors', state.user.uid), ambassador, { merge: true })
    } catch (e) {
      console.warn('[Ambassadors] Firestore sync failed:', e.message)
    }
  }).catch(() => {})

  // Update user state
  setState({
    user: {
      ...state.user,
      isAmbassador: true,
      ambassadorCity: city
    }
  })

  return ambassador
}

// Unregister current user as ambassador
export function unregisterAmbassador() {
  const state = getState()
  if (!state.user) return false

  const ambassadors = initAmbassadors()
  const filtered = ambassadors.filter(a => a.userId !== state.user.uid)

  Storage.set(STORAGE_KEY, filtered)

  // Remove from Firestore
  import('./firebase.js').then(async (fb) => {
    try {
      const db = fb.getDb()
      if (!db || !state.user?.uid) return
      await fb.deleteDoc(fb.doc(db, 'ambassadors', state.user.uid))
    } catch (e) {
      console.warn('[Ambassadors] Firestore delete failed:', e.message)
    }
  }).catch(() => {})

  setState({
    user: {
      ...state.user,
      isAmbassador: false,
      ambassadorCity: null
    }
  })

  return true
}

// Search ambassadors by city/country name
export function searchAmbassadors(query) {
  if (!query || query.trim().length < 2) return []

  const ambassadors = initAmbassadors()
  const lowerQuery = query.toLowerCase().trim()

  return ambassadors.filter(a =>
    a.city.toLowerCase().includes(lowerQuery) ||
    a.country.toLowerCase().includes(lowerQuery) ||
    a.userName.toLowerCase().includes(lowerQuery)
  )
}

// Get a specific ambassador's profile
export function getAmbassadorProfile(userId) {
  const ambassadors = initAmbassadors()
  return ambassadors.find(a => a.userId === userId) || null
}

// Get ambassador for current user
export function getCurrentAmbassadorProfile() {
  const state = getState()
  if (!state.user) return null
  return getAmbassadorProfile(state.user.uid)
}

// Update ambassador availability
export function updateAmbassadorAvailability(availability) {
  const state = getState()
  if (!state.user) return false

  const ambassadors = initAmbassadors()
  const index = ambassadors.findIndex(a => a.userId === state.user.uid)

  if (index < 0) return false

  ambassadors[index].availability = availability
  Storage.set(STORAGE_KEY, ambassadors)

  return true
}

// Global window handlers for UI
window.searchAmbassadors = function(query) {
  const results = searchAmbassadors(query)
  setState({ ambassadorSearchResults: results })
  return results
}

window.registerAmbassador = function(city, country, bio, languages, availability) {
  try {
    const ambassador = registerAsAmbassador({
      city,
      country,
      bio,
      languages: languages ? languages.split(',').map(l => l.trim()) : ['en'],
      availability: availability || 'available'
    })
    setState({ showAmbassadorSuccess: true })
    return ambassador
  } catch (error) {
    setState({ ambassadorError: error.message })
    return null
  }
}

window.contactAmbassador = function(userId) {
  const ambassador = getAmbassadorProfile(userId)
  if (!ambassador) return

  setState({
    selectedAmbassador: ambassador,
    showContactAmbassador: true
  })
}

window.unregisterAmbassador = function() {
  if (confirm(t('confirmUnregisterAmbassador'))) {
    unregisterAmbassador()
    setState({ showAmbassadorProfile: false })
  }
}

window.updateAmbassadorAvailability = function(availability) {
  updateAmbassadorAvailability(availability)
  const profile = getCurrentAmbassadorProfile()
  setState({ currentAmbassadorProfile: profile })
}
