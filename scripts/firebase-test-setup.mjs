#!/usr/bin/env node
/**
 * Firebase Test Account Setup (one-shot)
 *
 * Creates 5 test accounts in Firebase Auth via Playwright browser.
 * Also creates their Firestore profiles and reserves usernames.
 *
 * Usage:
 *   E2E_TEST_PASSWORD=xxx node scripts/firebase-test-setup.mjs
 *
 * Requires: dev server running on localhost:5173 or localhost:4173
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

  for (const account of ACCOUNTS) {
    console.log(`\nSetting up ${account.email}...`)

    const context = await browser.newContext()
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
    })

    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(3000)

    // Force remove splash
    await page.evaluate(() => {
      const app = document.getElementById('app')
      if (app && !app.classList.contains('loaded')) app.classList.add('loaded')
      const splash = document.getElementById('splash-screen')
      if (splash) splash.remove()
    })

    // Try to create the account via Firebase SDK in the browser
    const result = await page.evaluate(async ({ email, password, displayName, username }) => {
      try {
        const fb = await import('/src/services/firebase.js')
        fb.initializeFirebase()

        // Try to sign up
        const signUpResult = await fb.signUp(email, password, displayName)

        if (signUpResult.success) {
          // Reserve username
          await fb.reserveUsername(username, signUpResult.user.uid)
          // Create profile
          await fb.createOrUpdateUserProfile(signUpResult.user)
          return { success: true, uid: signUpResult.user.uid, action: 'created' }
        }

        if (signUpResult.error === 'auth/email-already-in-use') {
          // Account exists, try to sign in
          const signInResult = await fb.signIn(email, password)
          if (signInResult.success) {
            return { success: true, uid: signInResult.user.uid, action: 'exists' }
          }
          return { success: false, error: signInResult.error, action: 'login-failed' }
        }

        return { success: false, error: signUpResult.error, action: 'signup-failed' }
      } catch (err) {
        return { success: false, error: err.message, action: 'error' }
      }
    }, { email: account.email, password: TEST_PASSWORD, displayName: account.displayName, username: account.username })

    if (result.success) {
      console.log(`  ${result.action === 'created' ? 'Created' : 'Already exists'}: ${account.email} (uid: ${result.uid})`)
    } else {
      console.error(`  FAILED: ${account.email} — ${result.error} (${result.action})`)
    }

    await context.close()
  }

  await browser.close()
  console.log('\nSetup complete!')
}

setupAccounts().catch(err => {
  console.error('Setup failed:', err)
  process.exit(1)
})
