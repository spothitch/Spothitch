/**
 * Firebase Service for Admin Dashboard
 * Same Firebase project as main app
 */

import { initializeApp, getApps, getApp } from 'firebase/app'
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithRedirect,
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
export function signInWithGoogle() {
  if (!auth) return Promise.reject(new Error('Firebase non configure'))
  const provider = new GoogleAuthProvider()
  return signInWithRedirect(auth, provider)
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
