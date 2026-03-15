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

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
const auth = getAuth(app)
const db = getFirestore(app)

export { auth, db }

// Auth helpers
export function signInWithGoogle() {
  const provider = new GoogleAuthProvider()
  return signInWithPopup(auth, provider)
}

export function logOut() {
  return signOut(auth)
}

export function onAuthChange(callback) {
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
