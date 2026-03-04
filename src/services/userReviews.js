/**
 * User Reviews Service — Firebase
 * Allows hitchhikers to rate and review each other's profiles
 *
 * Collection: userReviews/{targetUid}/reviews/{fromUid}
 */

import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  increment as fsIncrement,
} from 'firebase/firestore'
import { getApps, getApp } from 'firebase/app'
import { getCurrentUser } from './firebase.js'
import { getState } from '../stores/state.js'

function getDb() {
  return getApps().length > 0 ? getFirestore(getApp()) : null
}

/**
 * Submit a rating/review for another user
 * @param {string} targetUid - UID of the user being reviewed
 * @param {number} rating - Rating 1-5
 * @param {string} comment - Optional comment
 * @returns {{ success: boolean, error?: string }}
 */
export async function submitProfileReview(targetUid, rating, comment) {
  const db = getDb()
  const user = getCurrentUser()
  if (!db) return { success: false, error: 'offline' }
  if (!user) return { success: false, error: 'auth/not-logged-in' }
  if (user.uid === targetUid) return { success: false, error: 'cannot-review-self' }
  if (!rating || rating < 1 || rating > 5) return { success: false, error: 'invalid-rating' }

  try {
    const s = getState()
    const reviewRef = doc(db, 'userReviews', targetUid, 'reviews', user.uid)
    const existing = await getDoc(reviewRef)

    const reviewData = {
      rating: Number(rating),
      comment: (comment || '').trim().slice(0, 500),
      reviewerUid: user.uid,
      reviewerName: s.username || user.displayName || 'Hitchhiker',
      reviewerAvatar: s.avatar || '🤙',
      updatedAt: new Date().toISOString(),
      createdAt: existing.exists() ? existing.data().createdAt : new Date().toISOString(),
    }

    await setDoc(reviewRef, reviewData)

    // Update aggregate on target's user doc
    const targetRef = doc(db, 'users', targetUid)
    if (!existing.exists()) {
      await updateDoc(targetRef, {
        reviewCount: fsIncrement(1),
        reviewRatingTotal: fsIncrement(Number(rating)),
      })
    } else {
      const oldRating = existing.data().rating || 0
      await updateDoc(targetRef, {
        reviewRatingTotal: fsIncrement(Number(rating) - oldRating),
      })
    }

    return { success: true }
  } catch (e) {
    console.error('submitProfileReview error:', e)
    return { success: false, error: e.message }
  }
}

/**
 * Load all reviews for a user
 * @param {string} uid - Target user's UID
 * @returns {Array} Array of review objects
 */
export async function loadProfileReviews(uid) {
  const db = getDb()
  if (!db || !uid) return []
  try {
    const snap = await getDocs(collection(db, 'userReviews', uid, 'reviews'))
    return snap.docs.map(d => d.data()).sort((a, b) => b.createdAt?.localeCompare(a.createdAt || '') || 0)
  } catch {
    return []
  }
}

/**
 * Get the current user's review for a specific user
 * @param {string} targetUid
 * @returns {Object|null}
 */
export async function getMyReviewForUser(targetUid) {
  const db = getDb()
  const user = getCurrentUser()
  if (!db || !user || !targetUid) return null
  try {
    const snap = await getDoc(doc(db, 'userReviews', targetUid, 'reviews', user.uid))
    return snap.exists() ? snap.data() : null
  } catch {
    return null
  }
}
