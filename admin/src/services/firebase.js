/**
 * Firebase Service for Admin Dashboard
 * Same Firebase project as main app
 */

import { initializeApp, getApps, getApp } from 'firebase/app'
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  where,
  getCountFromServer,
  startAfter,
  serverTimestamp,
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Check if Firebase is configured
export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId)

// Initialize Firebase (only if configured)
let app = null
let auth = null
let db = null

if (isFirebaseConfigured) {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
  auth = getAuth(app)
  db = getFirestore(app)
}

export { auth, db }

// Auth helpers
export async function signInWithGoogle() {
  if (!auth) throw new Error('Firebase non configure')
  const provider = new GoogleAuthProvider()
  const result = await signInWithPopup(auth, provider)
  return result.user
}

export function logOut() {
  if (!auth) return Promise.resolve()
  return signOut(auth)
}

export function onAuthChange(callback) {
  if (!auth) {
    // Firebase not configured — call with null immediately
    setTimeout(() => callback(null), 0)
    return () => {}
  }
  return onAuthStateChanged(auth, callback)
}

// Firestore helpers
export async function getCollectionCount(collectionName) {
  const coll = collection(db, collectionName)
  const snapshot = await getCountFromServer(coll)
  return snapshot.data().count
}

export async function getFilteredCount(collectionName, field, operator, value) {
  const coll = collection(db, collectionName)
  const q = query(coll, where(field, operator, value))
  const snapshot = await getCountFromServer(q)
  return snapshot.data().count
}

export async function getRecentDocs(collectionName, orderField, count = 10) {
  const coll = collection(db, collectionName)
  const q = query(coll, orderBy(orderField, 'desc'), limit(count))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function getFilteredDocs(collectionName, field, operator, value, orderField = null, count = 50) {
  const coll = collection(db, collectionName)
  const constraints = [where(field, operator, value)]
  if (orderField) constraints.push(orderBy(orderField, 'desc'))
  if (count) constraints.push(limit(count))
  const q = query(coll, ...constraints)
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function getAllDocs(collectionName, orderField = null, count = 100) {
  const coll = collection(db, collectionName)
  const constraints = []
  if (orderField) constraints.push(orderBy(orderField, 'desc'))
  if (count) constraints.push(limit(count))
  const q = query(coll, ...constraints)
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function updateDocument(collectionName, docId, data) {
  const docRef = doc(db, collectionName, docId)
  return updateDoc(docRef, data)
}

export async function getDocument(collectionName, docId) {
  const docRef = doc(db, collectionName, docId)
  const snap = await getDoc(docRef)
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export async function deleteDocument(collectionName, docId) {
  const docRef = doc(db, collectionName, docId)
  return deleteDoc(docRef)
}

export async function loadAllDocs(collectionName) {
  const coll = collection(db, collectionName)
  const snapshot = await getDocs(coll)
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function getDocsByField(collectionName, field, value) {
  const coll = collection(db, collectionName)
  const q = query(coll, where(field, '==', value))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
}

/**
 * Load reports from the 'reports' collection
 * Returns all reports ordered by createdAt desc
 */
export async function getReports() {
  try {
    const coll = collection(db, 'reports')
    const q = query(coll, orderBy('createdAt', 'desc'), limit(100))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
  } catch (err) {
    // Firestore rules may block reads on reports (allow read: if false)
    // In that case, try reading with admin SDK or return empty
    console.warn('Cannot read reports collection (check Firestore rules):', err.code || err.message)
    return []
  }
}

/**
 * Get all spots with pagination
 * @param {object|null} lastDocSnap - Last document snapshot for pagination
 * @param {number} limitCount - Number of spots per page
 * @returns {{ spots: Array, lastDoc: object|null, hasMore: boolean }}
 */
export async function getAllSpots(lastDocSnap = null, limitCount = 50) {
  const coll = collection(db, 'spots')
  const constraints = [orderBy('createdAt', 'desc'), limit(limitCount + 1)]
  if (lastDocSnap) constraints.splice(1, 0, startAfter(lastDocSnap))
  const q = query(coll, ...constraints)
  const snapshot = await getDocs(q)
  const docs = snapshot.docs
  const hasMore = docs.length > limitCount
  const pageDocs = hasMore ? docs.slice(0, limitCount) : docs
  return {
    spots: pageDocs.map((d) => ({ id: d.id, ...d.data(), _doc: d })),
    lastDoc: pageDocs.length > 0 ? pageDocs[pageDocs.length - 1] : null,
    hasMore,
  }
}

/**
 * Delete a spot and its subcollections (validations, reviews, comments)
 */
export async function deleteSpot(spotId) {
  const subcollections = ['validations', 'reviews', 'comments']
  for (const sub of subcollections) {
    try {
      const subColl = collection(db, 'spots', spotId, sub)
      const subDocs = await getDocs(subColl)
      for (const d of subDocs.docs) {
        await deleteDoc(d.ref)
      }
    } catch {
      // Subcollection may not exist
    }
  }
  await deleteDoc(doc(db, 'spots', spotId))
}

/**
 * Get reports for a specific spot
 */
export async function getSpotReports(spotId) {
  try {
    const coll = collection(db, 'reports')
    const q = query(coll, where('targetId', '==', spotId))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
  } catch {
    return []
  }
}

/**
 * Hide a spot (confirm a report)
 */
export async function hideSpot(spotId) {
  await updateDoc(doc(db, 'spots', spotId), {
    hidden: true,
    hiddenAt: serverTimestamp(),
  })
  try {
    const reports = await getSpotReports(spotId)
    for (const r of reports) {
      if (!r.status || r.status === 'pending') {
        await updateDoc(doc(db, 'reports', r.id), {
          status: 'confirmed',
          moderatedAt: new Date().toISOString(),
        })
      }
    }
  } catch {
    // Non-blocking
  }
}

/**
 * Relocate a spot (update lat/lng coordinates)
 * Used when admin approves a "misplaced" report
 */
export async function relocateSpot(spotId, newLat, newLng) {
  await updateDoc(doc(db, 'spots', spotId), {
    lat: newLat,
    lng: newLng,
    relocatedAt: serverTimestamp(),
    relocatedBy: 'admin',
  })
  // Mark associated misplaced reports as confirmed
  try {
    const reports = await getSpotReports(spotId)
    for (const r of reports) {
      if (r.reason === 'misplaced' && (!r.status || r.status === 'pending')) {
        await updateDoc(doc(db, 'reports', r.id), {
          status: 'confirmed',
          moderatedAt: new Date().toISOString(),
          moderationAction: 'relocated',
        })
      }
    }
  } catch {
    // Non-blocking
  }
}

/**
 * Get spot statistics
 */
export async function getSpotStats() {
  const allSpots = await loadAllDocs('spots')
  let total = 0
  let community = 0
  let reported = 0
  for (const s of allSpots) {
    total++
    community++
    if (s.reportCount > 0 || (s.reports && s.reports.length > 0)) {
      reported++
    }
  }
  return { total, community, reported }
}
