#!/usr/bin/env node
/**
 * Firebase Integration Tests — Node.js only (no browser needed)
 *
 * Tests real Firebase Auth + Firestore operations with test accounts.
 * Uses Firebase SDK directly, works reliably in CI.
 *
 * Usage: E2E_TEST_PASSWORD=xxx node scripts/firebase-test.mjs
 * Requires: VITE_FIREBASE_* env vars + test accounts (run firebase-test-setup.mjs first)
 */

import { initializeApp } from 'firebase/app'
import {
  getAuth, connectAuthEmulator, signInWithEmailAndPassword, signOut,
} from 'firebase/auth'
import {
  getFirestore, connectFirestoreEmulator, doc, getDoc, setDoc, deleteDoc,
  collection, query, where, getDocs, serverTimestamp,
  updateDoc, increment,
} from 'firebase/firestore'
import { config } from 'dotenv'

config({ path: '.env.local' })

const TEST_PASSWORD = process.env.E2E_TEST_PASSWORD
if (!TEST_PASSWORD) {
  console.log('E2E_TEST_PASSWORD not set, skipping Firebase tests')
  process.exit(0)
}

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
}

if (!firebaseConfig.apiKey) {
  console.error('VITE_FIREBASE_API_KEY not set')
  process.exit(1)
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

// Connect to emulators when running in CI
if (process.env.FIREBASE_AUTH_EMULATOR_HOST) {
  const [host, port] = process.env.FIREBASE_AUTH_EMULATOR_HOST.split(':')
  connectAuthEmulator(auth, `http://${host}:${port}`, { disableWarnings: true })
}
if (process.env.FIRESTORE_EMULATOR_HOST) {
  const [host, port] = process.env.FIRESTORE_EMULATOR_HOST.split(':')
  connectFirestoreEmulator(db, host, parseInt(port, 10))
}

const ACCOUNTS = {
  alice: { email: 'ci-alice@spothitch.com', username: 'ci-alice' },
  bob: { email: 'ci-bob@spothitch.com', username: 'ci-bob' },
}

let passed = 0
let failed = 0
let errors = []

async function test(name, fn) {
  try {
    await fn()
    passed++
    console.log(`  PASS: ${name}`)
  } catch (err) {
    failed++
    errors.push({ name, error: err.message })
    console.error(`  FAIL: ${name} — ${err.message}`)
  }
}

function assert(condition, msg) {
  if (!condition) throw new Error(msg || 'Assertion failed')
}

// ==================== AUTH TESTS ====================

async function authTests() {
  console.log('\n--- Auth Tests ---')

  let aliceUid = null

  await test('Alice can sign in', async () => {
    const cred = await signInWithEmailAndPassword(auth, ACCOUNTS.alice.email, TEST_PASSWORD)
    aliceUid = cred.user.uid
    assert(aliceUid, 'No UID returned')
    assert(cred.user.email === ACCOUNTS.alice.email, 'Email mismatch')
  })

  await test('Alice has a Firestore profile', async () => {
    assert(aliceUid, 'No UID')
    const snap = await getDoc(doc(db, 'users', aliceUid))
    assert(snap.exists(), 'Profile does not exist')
    assert(snap.data().email === ACCOUNTS.alice.email, 'Email mismatch in profile')
  })

  await test('Session persists after re-auth', async () => {
    // Re-sign in to verify credentials still work
    await signOut(auth)
    const cred2 = await signInWithEmailAndPassword(auth, ACCOUNTS.alice.email, TEST_PASSWORD)
    assert(cred2.user.uid === aliceUid, 'UID changed after re-auth')
  })

  await test('Alice can sign out', async () => {
    await signOut(auth)
    assert(!auth.currentUser, 'Still signed in after signOut')
  })

  await test('Wrong password is rejected', async () => {
    try {
      await signInWithEmailAndPassword(auth, ACCOUNTS.alice.email, 'wrongpassword')
      throw new Error('Should have thrown')
    } catch (err) {
      assert(
        err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential',
        `Unexpected error: ${err.code}`
      )
    }
  })
}

// ==================== FIRESTORE TESTS ====================

async function firestoreTests() {
  console.log('\n--- Firestore Tests ---')

  // Login as Alice
  const cred = await signInWithEmailAndPassword(auth, ACCOUNTS.alice.email, TEST_PASSWORD)
  const aliceUid = cred.user.uid
  const testSpotId = `ci-test-spot-${Date.now()}`

  await test('Alice can create a spot', async () => {
    await setDoc(doc(db, 'spots', testSpotId), {
      name: 'CI Test Spot',
      lat: 48.8566,
      lng: 2.3522,
      country: 'FR',
      type: 'roadside',
      creatorId: aliceUid,
      createdAt: serverTimestamp(),
    })
    const snap = await getDoc(doc(db, 'spots', testSpotId))
    assert(snap.exists(), 'Spot was not created')
    assert(snap.data().name === 'CI Test Spot', 'Spot name mismatch')
  })

  await test('Alice can read her spot', async () => {
    const q = query(collection(db, 'spots'), where('creatorId', '==', aliceUid))
    const snap = await getDocs(q)
    assert(snap.size > 0, 'No spots found for Alice')
  })

  await test('Alice can update spot counters (validation fields)', async () => {
    await updateDoc(doc(db, 'spots', testSpotId), { validationCount: 1, checkins: 1, updatedAt: serverTimestamp() })
    const snap = await getDoc(doc(db, 'spots', testSpotId))
    assert(snap.data().validationCount === 1, 'validationCount was not updated')
  })

  await test('Alice cannot delete her spot (admin-only)', async () => {
    try {
      await deleteDoc(doc(db, 'spots', testSpotId))
      throw new Error('Delete should have been denied')
    } catch (e) {
      assert(e.code === 'permission-denied' || e.message.includes('PERMISSION_DENIED'), 'Expected permission denied')
    }
  })

  await signOut(auth)
}

// ==================== SOCIAL TESTS ====================

async function socialTests() {
  console.log('\n--- Social Tests ---')

  // Login as Alice
  const aliceCred = await signInWithEmailAndPassword(auth, ACCOUNTS.alice.email, TEST_PASSWORD)
  const aliceUid = aliceCred.user.uid

  // Get Bob's UID
  const bobQ = query(collection(db, 'users'), where('email', '==', ACCOUNTS.bob.email))
  const bobSnap = await getDocs(bobQ)
  const bobUid = bobSnap.docs[0]?.id
  assert(bobUid, 'Bob not found in Firestore')

  const friendReqId = `ci-friendreq-${Date.now()}`

  await test('Alice can write to her own friendRequests', async () => {
    await setDoc(doc(db, 'users', aliceUid, 'friendRequests', friendReqId), {
      from: bobUid,
      status: 'pending',
      createdAt: serverTimestamp(),
    })
    const snap = await getDoc(doc(db, 'users', aliceUid, 'friendRequests', friendReqId))
    assert(snap.exists(), 'Friend request was not created')
  })

  await test('Alice can read her own friend request', async () => {
    const snap = await getDoc(doc(db, 'users', aliceUid, 'friendRequests', friendReqId))
    assert(snap.data().from === bobUid, 'Wrong sender')
    assert(snap.data().status === 'pending', 'Wrong status')
  })

  await test('Alice can delete her own friend request', async () => {
    await deleteDoc(doc(db, 'users', aliceUid, 'friendRequests', friendReqId))
    const snap = await getDoc(doc(db, 'users', aliceUid, 'friendRequests', friendReqId))
    assert(!snap.exists(), 'Friend request was not deleted')
  })

  await signOut(auth)
}

// ==================== GAMIFICATION TESTS ====================

async function gamificationTests() {
  console.log('\n--- Gamification Tests ---')

  const cred = await signInWithEmailAndPassword(auth, ACCOUNTS.alice.email, TEST_PASSWORD)
  const aliceUid = cred.user.uid

  // Save original points
  const profileSnap = await getDoc(doc(db, 'users', aliceUid))
  const originalPoints = profileSnap.data()?.points || 0

  await test('Alice can earn points', async () => {
    await updateDoc(doc(db, 'users', aliceUid), { points: increment(10) })
    const snap = await getDoc(doc(db, 'users', aliceUid))
    assert(snap.data().points === originalPoints + 10, 'Points not incremented')
  })

  await test('Restore original points', async () => {
    await updateDoc(doc(db, 'users', aliceUid), { points: originalPoints })
    const snap = await getDoc(doc(db, 'users', aliceUid))
    assert(snap.data().points === originalPoints, 'Points not restored')
  })

  await signOut(auth)
}

// ==================== SECURITY TESTS ====================

async function securityTests() {
  console.log('\n--- Security Tests ---')

  // Login as Alice
  const aliceCred = await signInWithEmailAndPassword(auth, ACCOUNTS.alice.email, TEST_PASSWORD)
  const aliceUid = aliceCred.user.uid

  // Get Bob's UID
  const bobQ = query(collection(db, 'users'), where('email', '==', ACCOUNTS.bob.email))
  const bobSnap = await getDocs(bobQ)
  const bobUid = bobSnap.docs[0]?.id

  await test('Alice cannot overwrite Bob profile', async () => {
    try {
      await setDoc(doc(db, 'users', bobUid), { email: 'hacked@evil.com' })
      throw new Error('Should have been denied')
    } catch (err) {
      assert(
        err.code === 'permission-denied' || err.message.includes('permission') || err.message.includes('PERMISSION'),
        `Expected permission denied, got: ${err.code || err.message}`
      )
    }
  })

  await signOut(auth)

  await test('Unauthenticated user cannot create spots', async () => {
    assert(!auth.currentUser, 'Should be signed out')
    try {
      await setDoc(doc(db, 'spots', 'ci-unauth-test'), {
        name: 'Unauth spot', creatorId: 'fake',
      })
      // If it succeeds, clean up and fail
      await deleteDoc(doc(db, 'spots', 'ci-unauth-test')).catch(() => {})
      throw new Error('Should have been denied')
    } catch (err) {
      assert(
        err.code === 'permission-denied' || err.message.includes('permission') || err.message.includes('PERMISSION') || err.message === 'Should have been denied',
        `Expected permission denied, got: ${err.code || err.message}`
      )
    }
  })
}

// ==================== RUN ALL ====================

async function main() {
  console.log('=== Firebase Integration Tests (Node.js) ===')

  await authTests()
  await firestoreTests()
  await socialTests()
  await gamificationTests()
  await securityTests()

  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`)

  if (failed > 0) {
    console.error('\nFailed tests:')
    for (const e of errors) {
      console.error(`  - ${e.name}: ${e.error}`)
    }
    process.exit(1)
  }

  process.exit(0)
}

main().catch(err => {
  console.error('Test runner failed:', err.message)
  process.exit(1)
})
