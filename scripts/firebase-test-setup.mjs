#!/usr/bin/env node
/**
 * Firebase Test Account Setup — Node.js only (no browser needed)
 *
 * Creates 5 test accounts in Firebase Auth + Firestore profiles.
 * Uses Firebase SDK directly, works reliably in CI.
 *
 * Usage: E2E_TEST_PASSWORD=xxx node scripts/firebase-test-setup.mjs
 * Requires: VITE_FIREBASE_* env vars
 */

import { initializeApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut } from 'firebase/auth'
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { config } from 'dotenv'

config({ path: '.env.local' })

const TEST_PASSWORD = process.env.E2E_TEST_PASSWORD
if (!TEST_PASSWORD) {
  console.error('E2E_TEST_PASSWORD environment variable is required')
  process.exit(1)
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
  console.error('VITE_FIREBASE_API_KEY not set. Set Firebase env vars or create .env.local')
  process.exit(1)
}

const ACCOUNTS = [
  { email: 'ci-alice@spothitch.com', displayName: 'Alice Test', username: 'ci-alice' },
  { email: 'ci-bob@spothitch.com', displayName: 'Bob Test', username: 'ci-bob' },
  { email: 'ci-charlie@spothitch.com', displayName: 'Charlie Test', username: 'ci-charlie' },
  { email: 'ci-diana@spothitch.com', displayName: 'Diana Test', username: 'ci-diana' },
  { email: 'ci-admin@spothitch.com', displayName: 'Admin Test', username: 'ci-admin' },
]

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

async function setupAccount(account) {
  const { email, displayName, username } = account

  // Try to create account
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, TEST_PASSWORD)
    await updateProfile(cred.user, { displayName })
    const uid = cred.user.uid

    // Create Firestore profile
    await setDoc(doc(db, 'users', uid), {
      email, displayName, username,
      points: 0, level: 1, badges: [], rewards: [],
      createdAt: serverTimestamp(),
    })

    // Reserve username
    await setDoc(doc(db, 'usernames', username), { uid, reserved: true })

    await signOut(auth)
    return { success: true, uid, action: 'created' }
  } catch (err) {
    if (err.code !== 'auth/email-already-in-use') {
      return { success: false, error: err.code || err.message, action: 'signup-failed' }
    }
  }

  // Account exists, sign in to verify
  try {
    const cred = await signInWithEmailAndPassword(auth, email, TEST_PASSWORD)
    const uid = cred.user.uid

    // Ensure Firestore profile exists
    const snap = await getDoc(doc(db, 'users', uid))
    if (!snap.exists()) {
      await setDoc(doc(db, 'users', uid), {
        email, displayName, username,
        points: 0, level: 1, badges: [], rewards: [],
        createdAt: serverTimestamp(),
      })
    }

    await signOut(auth)
    return { success: true, uid, action: 'exists' }
  } catch (err) {
    return { success: false, error: err.code || err.message, action: 'login-failed' }
  }
}

async function main() {
  console.log('=== Firebase Test Account Setup (Node.js) ===')
  let allSuccess = true

  for (const account of ACCOUNTS) {
    const result = await setupAccount(account)
    if (result.success) {
      console.log(`  ${result.action === 'created' ? 'Created' : 'Ready'}: ${account.email} (uid: ${result.uid})`)
    } else {
      console.error(`  FAILED: ${account.email} — ${result.error} (${result.action})`)
      allSuccess = false
    }
  }

  if (allSuccess) {
    console.log('\nAll 5 accounts ready!')
  } else {
    console.error('\nSome accounts failed')
    process.exit(1)
  }

  process.exit(0)
}

main().catch(err => {
  console.error('Setup failed:', err.message)
  process.exit(1)
})
