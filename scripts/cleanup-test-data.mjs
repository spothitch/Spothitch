/**
 * Cleanup Firebase test data after E2E tests
 * Runs after all Firebase E2E tests (even if they fail)
 * Deletes: test spots, test reports, test DMs, test data
 * Keeps: test user accounts (ci-*@spothitch.com) for reuse
 *
 * Usage: node scripts/cleanup-test-data.mjs
 * Requires: E2E_TEST_PASSWORD env var
 */

import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from 'firebase/firestore'
import { config } from 'dotenv'

config({ path: '.env.local' })

const TEST_EMAILS = [
  'ci-alice@spothitch.com',
  'ci-bob@spothitch.com',
  'ci-charlie@spothitch.com',
  'ci-diana@spothitch.com',
  'ci-admin@spothitch.com',
]

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
}

const password = process.env.E2E_TEST_PASSWORD
if (!password) {
  console.log('E2E_TEST_PASSWORD not set, skipping cleanup')
  process.exit(0)
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

async function login() {
  // Login as ci-admin to have delete permissions
  const cred = await signInWithEmailAndPassword(auth, 'ci-admin@spothitch.com', password)
  console.log('Logged in as ci-admin')
  return cred.user.uid
}

async function deleteCollection(collectionName, field, values) {
  let deleted = 0
  for (const val of values) {
    try {
      const q = query(collection(db, collectionName), where(field, '==', val))
      const snap = await getDocs(q)
      for (const d of snap.docs) {
        await deleteDoc(d.ref)
        deleted++
      }
    } catch (err) {
      console.warn(`Failed to clean ${collectionName} for ${val}:`, err.message)
    }
  }
  return deleted
}

async function deleteAllDocs(collectionName) {
  let deleted = 0
  try {
    const snap = await getDocs(collection(db, collectionName))
    for (const d of snap.docs) {
      try {
        await deleteDoc(d.ref)
        deleted++
      } catch (err) {
        // Permission denied is expected for some docs
      }
    }
  } catch (err) {
    console.warn(`Cannot read ${collectionName}:`, err.message)
  }
  return deleted
}

async function main() {
  console.log('=== Firebase Test Data Cleanup ===')

  await login()

  // Get test user UIDs
  const testUids = []
  for (const email of TEST_EMAILS) {
    try {
      const q = query(collection(db, 'users'), where('email', '==', email))
      const snap = await getDocs(q)
      for (const d of snap.docs) testUids.push(d.id)
    } catch {}
  }
  console.log(`Found ${testUids.length} test user UIDs`)

  // Delete spots created by test users
  const spotsDeleted = await deleteCollection('spots', 'creatorId', testUids)
  console.log(`Deleted ${spotsDeleted} test spots`)

  // Delete reports (all reports are test data for now)
  const reportsDeleted = await deleteAllDocs('reports')
  console.log(`Deleted ${reportsDeleted} test reports`)

  // Delete guide reports
  const guideReportsDeleted = await deleteAllDocs('guide_reports')
  console.log(`Deleted ${guideReportsDeleted} test guide reports`)

  // Delete DM conversations involving test users
  let dmsDeleted = 0
  for (const uid of testUids) {
    try {
      const q = query(collection(db, 'directMessages'), where('participants', 'array-contains', uid))
      const snap = await getDocs(q)
      for (const d of snap.docs) {
        // Delete messages subcollection
        try {
          const msgsSnap = await getDocs(collection(db, 'directMessages', d.id, 'messages'))
          for (const m of msgsSnap.docs) await deleteDoc(m.ref)
        } catch {}
        await deleteDoc(d.ref)
        dmsDeleted++
      }
    } catch {}
  }
  console.log(`Deleted ${dmsDeleted} test DM conversations`)

  // Delete guide tips from test users
  const tipsDeleted = await deleteCollection('guideTips', 'userId', testUids)
  console.log(`Deleted ${tipsDeleted} test guide tips`)

  // Delete roadmap comments from test users
  const commentsDeleted = await deleteCollection('roadmap_comments', 'userId', testUids)
  console.log(`Deleted ${commentsDeleted} test roadmap comments`)

  console.log('=== Cleanup complete ===')
  // Note: test user accounts (ci-*@spothitch.com) are kept for reuse
  process.exit(0)
}

main().catch(err => {
  console.error('Cleanup error:', err.message)
  process.exit(0) // Don't fail CI on cleanup errors
})
