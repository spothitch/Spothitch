/**
 * Favorites Service — Firebase
 * Manages favorite spots via Firestore + localStorage fallback
 *
 * Collection: users/{uid}/favorites/{spotId}
 */

import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
} from 'firebase/firestore'
import { getApps, getApp } from 'firebase/app'
import { getCurrentUser } from './firebase.js'

const FAVORITES_KEY = 'spothitch_favorites'

function getDb() {
  return getApps().length > 0 ? getFirestore(getApp()) : null
}

let _unsubFavorites = null

// ==================== LOCAL ====================

function getLocalFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]')
  } catch {
    return []
  }
}

function saveLocalFavorites(favs) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs))
  } catch { /* noop */ }
}

// ==================== FIREBASE ====================

/**
 * Subscribe to favorites in real-time (syncs to localStorage)
 */
export function subscribeFavorites(uid) {
  const db = getDb()
  if (!db || !uid) return

  _unsubFavorites?.()

  const favRef = collection(db, 'users', uid, 'favorites')
  _unsubFavorites = onSnapshot(favRef, (snapshot) => {
    const favs = snapshot.docs.map(d => d.id)
    saveLocalFavorites(favs)
    window.dispatchEvent(new CustomEvent('favoritesUpdated', { detail: { favs } }))
  }, () => { /* silent fail — localStorage remains */ })
}

export function unsubscribeFavorites() {
  _unsubFavorites?.()
  _unsubFavorites = null
}

/**
 * Add a spot to favorites (localStorage + Firestore)
 */
export async function addFavorite(spotId) {
  const id = String(spotId)

  // Local first (instant UI)
  const favs = getLocalFavorites()
  if (!favs.includes(id)) {
    favs.push(id)
    saveLocalFavorites(favs)
  }

  // Firebase (if logged in)
  const user = getCurrentUser()
  const db = getDb()
  if (!user || !db) return

  try {
    await setDoc(doc(db, 'users', user.uid, 'favorites', id), {
      spotId: id,
      addedAt: new Date().toISOString(),
    })
  } catch { /* silent — local already saved */ }
}

/**
 * Remove a spot from favorites (localStorage + Firestore)
 */
export async function removeFavorite(spotId) {
  const id = String(spotId)

  // Local first (instant UI)
  const favs = getLocalFavorites().filter(f => f !== id && f !== spotId)
  saveLocalFavorites(favs)

  // Firebase (if logged in)
  const user = getCurrentUser()
  const db = getDb()
  if (!user || !db) return

  try {
    await deleteDoc(doc(db, 'users', user.uid, 'favorites', id))
  } catch { /* silent */ }
}

/**
 * Check if a spot is favorited (reads from localStorage for speed)
 */
export function isFavorite(spotId) {
  const favs = getLocalFavorites()
  const id = String(spotId)
  return favs.includes(id) || favs.includes(spotId)
}

/**
 * Sync local favorites to Firestore on login
 * Uploads locally stored favorites not yet in Firestore
 */
export async function syncLocalFavoritesToFirestore(uid) {
  const db = getDb()
  if (!db || !uid) return

  const localFavs = getLocalFavorites()
  if (localFavs.length === 0) return

  try {
    const snap = await getDocs(collection(db, 'users', uid, 'favorites'))
    const remoteFavs = new Set(snap.docs.map(d => d.id))

    const toUpload = localFavs.filter(id => !remoteFavs.has(String(id)))
    await Promise.all(
      toUpload.map(id =>
        setDoc(doc(db, 'users', uid, 'favorites', String(id)), {
          spotId: String(id),
          addedAt: new Date().toISOString(),
          migratedFrom: 'localStorage',
        })
      )
    )
  } catch { /* silent */ }
}
