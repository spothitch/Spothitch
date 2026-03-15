#!/usr/bin/env node
/**
 * Firebase Test Account Setup
 *
 * Creates 5 test accounts in Firebase Auth via Playwright browser.
 * Also creates their Firestore profiles and reserves usernames.
 * Works with both dev server and production build (uses window.__fb).
 *
 * Usage:
 *   E2E_TEST_PASSWORD=xxx node scripts/firebase-test-setup.mjs
 *
 * In CI, runs automatically before Firebase E2E tests.
 */

import { chromium } from 'playwright'

const TEST_PASSWORD = process.env.E2E_TEST_PASSWORD
if (!TEST_PASSWORD) {
  console.error('E2E_TEST_PASSWORD environment variable is required')
  process.exit(1)
}

const ACCOUNTS = [
  { email: 'ci-alice@spothitch.com', displayName: 'Alice Test', username: 'ci-alice' },
  { email: 'ci-bob@spothitch.com', displayName: 'Bob Test', username: 'ci-bob' },
  { email: 'ci-charlie@spothitch.com', displayName: 'Charlie Test', username: 'ci-charlie' },
  { email: 'ci-diana@spothitch.com', displayName: 'Diana Test', username: 'ci-diana' },
  { email: 'ci-admin@spothitch.com', displayName: 'Admin Test', username: 'ci-admin' },
]

const BASE_URL = process.env.APP_URL || 'http://localhost:5173'

async function setupAccounts() {
  console.log('Starting Firebase test account setup...')
  console.log(`Base URL: ${BASE_URL}`)

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
  })
  const page = await context.newPage()

  // Skip onboarding
  await page.addInitScript(() => {
    localStorage.setItem('spothitch_v4_state', JSON.stringify({
      showWelcome: false, username: 'Setup', avatar: '🤙',
      activeTab: 'map', theme: 'dark', lang: 'en',
      points: 0, level: 1, badges: [], rewards: [],
      savedTrips: [], emergencyContacts: [],
    }))
    localStorage.setItem('spothitch_v4_cookie_consent', JSON.stringify({
      preferences: { necessary: true, analytics: false, marketing: false, personalization: false },
      timestamp: Date.now(), version: '1.0',
    }))
    localStorage.setItem('spothitch_age_verified', 'true')
    localStorage.setItem('spothitch_landing_v2', '1')
    localStorage.setItem('spothitch_beta_seen', '1')
    const featureSeen = {}
    ;['carte','stations','add-spot','profil','amis','chat','carnet','stats','classements','niveaux','conseils','dons','hors-ligne','sos','compagnon','notif-spot','activite-amis','defis','score-confiance','avis-profils','itineraire','radar','quiz','guides','gardien','evenements','auberges'].forEach(id => { featureSeen[id] = Date.now() })
    localStorage.setItem('spothitch_feature_seen', JSON.stringify(featureSeen))
  })

  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' })
  await Promise.race([
    page.waitForSelector('#app.loaded', { timeout: 15000 }).catch(() => null),
    page.waitForSelector('nav[role="navigation"]', { timeout: 15000 }).catch(() => null),
  ])
  await page.evaluate(() => {
    const app = document.getElementById('app')
    if (app && !app.classList.contains('loaded')) app.classList.add('loaded')
    const splash = document.getElementById('splash-screen')
    if (splash) splash.remove()
  })

  // Trigger Firebase module loading — open auth, wait for GIS overlay init
  // which imports firebase.js and sets window.__fb
  await page.evaluate(() => window.openAuth?.('email'))
  await page.waitForTimeout(5000)

  // If __fb not set yet, try forcing the import directly
  await page.evaluate(async () => {
    if (!window.__fb) {
      try {
        const fb = await import('/src/services/firebase.js')
        fb.initializeFirebase()
      } catch { /* built app won't resolve bare specifier — __fb should already be set */ }
    }
  })
  await page.waitForTimeout(2000)

  await page.evaluate(() => window.closeAuth?.())
  await page.waitForTimeout(500)

  // Wait for window.__fb with longer timeout
  await page.waitForFunction(() => !!window.__fb, { timeout: 30000 })
  console.log('Firebase loaded via window.__fb')

  let allSuccess = true

  for (const account of ACCOUNTS) {
    console.log(`\nSetting up ${account.email}...`)

    // Add delay between accounts to avoid rate limiting
    await page.waitForTimeout(2000)

    const result = await page.evaluate(async ({ email, password, displayName, username }) => {
      try {
        const fb = window.__fb
        fb.initializeFirebase()

        // Try to sign up
        const signUpResult = await fb.signUp(email, password, displayName)

        if (signUpResult.success) {
          const uid = signUpResult.user.uid
          // Create Firestore profile
          try {
            await fb.setDoc(fb.doc(fb.getDb(), 'users', uid), {
              email, displayName, username,
              points: 0, level: 1, badges: [], rewards: [],
              createdAt: fb.serverTimestamp(),
            })
          } catch (e) { /* profile might already exist */ }
          // Reserve username
          try {
            await fb.setDoc(fb.doc(fb.getDb(), 'usernames', username), {
              uid, reserved: true,
            })
          } catch (e) { /* username might already be reserved */ }
          // Sign out so next account can be created
          try { await fb.getAuth().signOut() } catch {}
          return { success: true, uid, action: 'created' }
        }

        if (signUpResult.error === 'auth/email-already-in-use') {
          // Account exists, try to sign in to verify password
          const signInResult = await fb.signIn(email, password)
          if (signInResult.success) {
            const uid = signInResult.user.uid
            // Ensure profile exists
            try {
              const { getDoc, doc, getDb, setDoc, serverTimestamp } = fb
              const snap = await getDoc(doc(getDb(), 'users', uid))
              if (!snap.exists()) {
                await setDoc(doc(getDb(), 'users', uid), {
                  email, displayName, username,
                  points: 0, level: 1, badges: [], rewards: [],
                  createdAt: serverTimestamp(),
                })
              }
            } catch {}
            try { await fb.getAuth().signOut() } catch {}
            return { success: true, uid, action: 'exists' }
          }
          return { success: false, error: signInResult.error, action: 'login-failed' }
        }

        return { success: false, error: signUpResult.error, action: 'signup-failed' }
      } catch (err) {
        return { success: false, error: err.message, action: 'error' }
      }
    }, { email: account.email, password: TEST_PASSWORD, displayName: account.displayName, username: account.username })

    if (result.success) {
      console.log(`  ${result.action === 'created' ? '✅ Created' : '✅ Already exists'}: ${account.email} (uid: ${result.uid})`)
    } else {
      console.error(`  ❌ FAILED: ${account.email} — ${result.error} (${result.action})`)
      allSuccess = false
    }
  }

  await context.close()
  await browser.close()

  if (allSuccess) {
    console.log('\n✅ All accounts ready!')
  } else {
    console.error('\n⚠️ Some accounts failed — tests may not work')
    process.exit(1)
  }
}

setupAccounts().catch(err => {
  console.error('Setup failed:', err)
  process.exit(1)
})
