/**
 * Community Guide Service
 * Structured guide contributions stored in Firebase Firestore
 * with localStorage cache for offline support
 */

import { Storage } from '../utils/storage.js'
import { getCurrentUser } from './firebase.js'

const CACHE_KEY = 'my_guide_tips'

// ==================== GUIDE CATEGORIES ====================

export const GUIDE_CATEGORIES = [
  { id: 'hitchhiking', labelKey: 'guideCatHitchhiking', fallback: "Facilité de l'auto-stop", icon: 'thumbs-up' },
  { id: 'safety', labelKey: 'guideCatSafety', fallback: 'Sécurité', icon: 'shield' },
  { id: 'laws', labelKey: 'guideCatLaws', fallback: 'Lois et légalité', icon: 'scale' },
  { id: 'best_spots', labelKey: 'guideCatBestSpots', fallback: 'Meilleurs spots', icon: 'map-pin' },
  { id: 'language', labelKey: 'guideCatLanguage', fallback: 'Langue et communication', icon: 'message-circle' },
  { id: 'budget', labelKey: 'guideCatBudget', fallback: 'Budget et coûts', icon: 'coins' },
  { id: 'culture', labelKey: 'guideCatCulture', fallback: 'Culture locale', icon: 'heart' },
  { id: 'transport', labelKey: 'guideCatTransport', fallback: 'Transports alternatifs', icon: 'car' },
]

// ==================== LOCAL CACHE ====================

function getCachedTips() {
  return Storage.get(CACHE_KEY) || []
}

function saveCachedTips(tips) {
  Storage.set(CACHE_KEY, tips)
}

// ==================== FIREBASE HELPERS ====================

async function getDb() {
  const { getApps, getApp } = await import('firebase/app')
  return getApps().length > 0
    ? (await import('firebase/firestore')).getFirestore(getApp())
    : null
}

// ==================== PUBLIC API ====================

/**
 * Submit a guide contribution (rating + text) for a country/category
 */
export async function submitGuideTip({ countryCode, category, rating, text, customCategory, customCategoryName }) {
  const user = getCurrentUser()
  if (!user) return { success: false, error: 'not_authenticated' }

  const tipData = {
    userId: user.uid,
    username: user.displayName || 'Anonyme',
    countryCode,
    category: customCategory ? `custom_${customCategoryName}` : category,
    rating: Math.min(5, Math.max(1, rating)),
    text: (text || '').slice(0, 500),
    customCategory: !!customCategory,
    customCategoryName: customCategory ? customCategoryName : null,
    createdAt: new Date().toISOString(),
  }

  // Save to local cache immediately
  const cached = getCachedTips()
  // Remove existing tip for same country+category by this user
  const filtered = cached.filter(
    t => !(t.countryCode === countryCode && t.category === tipData.category && t.userId === user.uid)
  )
  const localId = `${user.uid}_${countryCode}_${tipData.category}_${Date.now()}`
  filtered.push({ ...tipData, id: localId })
  saveCachedTips(filtered)

  // Sync to Firestore
  try {
    const db = await getDb()
    if (db) {
      const { doc, setDoc } = await import('firebase/firestore')
      const docId = `${user.uid}_${countryCode}_${tipData.category}`
      await setDoc(doc(db, 'guideTips', docId), { ...tipData, id: docId })
      // Update local cache with Firestore ID
      const updated = getCachedTips().map(t => t.id === localId ? { ...t, id: docId } : t)
      saveCachedTips(updated)
    }
  } catch {
    // Offline — local cache already saved
  }

  return { success: true }
}

/**
 * Get current user's guide tips for a country (from cache)
 */
export function getUserGuideTips(countryCode) {
  const user = getCurrentUser()
  if (!user) return []
  return getCachedTips().filter(t => t.countryCode === countryCode && t.userId === user.uid)
}

/**
 * Load user's guide tips from Firestore (for sync on login)
 */
export async function loadUserGuideTips() {
  const user = getCurrentUser()
  if (!user) return

  try {
    const db = await getDb()
    if (!db) return
    const { collection, query, where, getDocs } = await import('firebase/firestore')
    const q = query(collection(db, 'guideTips'), where('userId', '==', user.uid))
    const snap = await getDocs(q)
    if (snap.empty) return

    const cached = getCachedTips()
    const existing = new Set(cached.map(t => t.id))

    snap.docs.forEach(d => {
      const data = d.data()
      if (!existing.has(d.id)) {
        cached.push({ ...data, id: d.id })
      }
    })
    saveCachedTips(cached)
  } catch {
    // Silent — cache is still valid
  }
}

/**
 * Delete a user's guide tip
 */
export async function deleteUserGuideTip(docId) {
  const user = getCurrentUser()
  if (!user) return { success: false, error: 'not_authenticated' }

  // Remove from local cache
  const cached = getCachedTips().filter(t => t.id !== docId)
  saveCachedTips(cached)

  // Remove from Firestore
  try {
    const db = await getDb()
    if (db) {
      const { doc, deleteDoc } = await import('firebase/firestore')
      await deleteDoc(doc(db, 'guideTips', docId))
    }
  } catch {
    // Offline — local cache already updated
  }

  return { success: true }
}

/**
 * Get contribution count for a country by current user
 */
export function getUserContribCount(countryCode) {
  return getUserGuideTips(countryCode).length
}

export default {
  GUIDE_CATEGORIES,
  submitGuideTip,
  getUserGuideTips,
  loadUserGuideTips,
  deleteUserGuideTip,
  getUserContribCount,
}
