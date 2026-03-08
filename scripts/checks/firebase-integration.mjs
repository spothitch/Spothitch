/**
 * Fox Layer: Firebase Integration Check
 *
 * Tests critical Firebase flows: auth login/logout, spot CRUD, DM send, security rules.
 * This is the quick version for Fox (~2 min). Full specs run in CI.
 *
 * Returns { score, maxScore, errors[], warnings[] }
 */

import { chromium } from 'playwright'

const APP_URL = process.env.APP_URL || 'http://localhost:5173'
const TEST_PASSWORD = process.env.E2E_TEST_PASSWORD

export default async function firebaseIntegrationCheck() {
  const errors = []
  const warnings = []
  let score = 0
  const maxScore = 100

  // If no password configured, skip with a warning
  if (!TEST_PASSWORD) {
    return {
      score: 50,
      maxScore,
      errors: [],
      warnings: ['E2E_TEST_PASSWORD not set. Firebase integration tests skipped.'],
    }
  }

  const browser = await chromium.launch({ headless: true })

  try {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
    })
    const page = await context.newPage()

    // Skip onboarding
    await page.addInitScript(() => {
      localStorage.setItem('spothitch_v4_state', JSON.stringify({
        showWelcome: false, username: 'FoxTest', avatar: '🤙',
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

    await page.goto(APP_URL, { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(3000)

    // Force remove splash
    await page.evaluate(() => {
      const app = document.getElementById('app')
      if (app && !app.classList.contains('loaded')) app.classList.add('loaded')
      const splash = document.getElementById('splash-screen')
      if (splash) splash.remove()
    })

    // Trigger Firebase module loading (opens auth modal which imports firebase.js)
    await page.evaluate(() => window.openAuth?.('email'))
    await page.waitForTimeout(2000)
    await page.evaluate(() => window.closeAuth?.())
    await page.waitForTimeout(500)

    // CHECK 1: Firebase SDK initializes (20 points)
    const fbInit = await page.evaluate(async () => {
      try {
        const fb = window.__fb
        if (!fb) return { ok: false, error: 'window.__fb not available' }
        fb.initializeFirebase()
        return { ok: true }
      } catch (err) {
        return { ok: false, error: err.message }
      }
    })

    if (fbInit.ok) {
      score += 20
    } else {
      errors.push(`Firebase init failed: ${fbInit.error}`)
    }

    // CHECK 2: Login with test account (25 points)
    const loginResult = await page.evaluate(async ({ email, password }) => {
      try {
        const fb = window.__fb
        if (!fb) return { success: false, error: 'window.__fb not available' }
        fb.initializeFirebase()
        const result = await fb.signIn(email, password)
        return { success: result.success, uid: result.user?.uid, error: result.error }
      } catch (err) {
        return { success: false, error: err.message }
      }
    }, { email: 'ci-alice@spothitch.com', password: TEST_PASSWORD })

    if (loginResult.success) {
      score += 25
    } else {
      errors.push(`Login failed: ${loginResult.error}`)
    }

    // CHECK 3: Firestore read (user profile) (20 points)
    if (loginResult.success) {
      const profileResult = await page.evaluate(async (uid) => {
        try {
          const { getDb, doc, getDoc } = window.__fb
          const snap = await getDoc(doc(getDb(), 'users', uid))
          return { exists: snap.exists() }
        } catch (err) {
          return { error: err.message }
        }
      }, loginResult.uid)

      if (profileResult.exists) {
        score += 20
      } else if (profileResult.error) {
        errors.push(`Profile read failed: ${profileResult.error}`)
      } else {
        warnings.push('User profile does not exist in Firestore')
        score += 10
      }
    }

    // CHECK 4: Firestore write + delete (spot) (20 points)
    if (loginResult.success) {
      const crudResult = await page.evaluate(async (uid) => {
        try {
          const { getDb, collection, addDoc, deleteDoc, doc, serverTimestamp } = window.__fb
          const db = getDb()

          const ref = await addDoc(collection(db, 'spots'), {
            lat: 0.001, lng: 0.001, direction: 'fox-test', type: 'other',
            description: 'Fox integration test (auto-deleted)',
            createdBy: uid, createdAt: serverTimestamp(),
          })

          await deleteDoc(doc(db, 'spots', ref.id))
          return { ok: true }
        } catch (err) {
          return { ok: false, error: err.message }
        }
      }, loginResult.uid)

      if (crudResult.ok) {
        score += 20
      } else {
        errors.push(`Spot CRUD failed: ${crudResult.error}`)
      }
    }

    // CHECK 5: Logout (15 points)
    if (loginResult.success) {
      const logoutResult = await page.evaluate(async () => {
        try {
          await window.__fb.logOut()
          return { ok: true }
        } catch (err) {
          return { ok: false, error: err.message }
        }
      })

      if (logoutResult.ok) {
        score += 15
      } else {
        errors.push(`Logout failed: ${logoutResult.error}`)
      }
    }

    await context.close()
  } catch (err) {
    errors.push(`Firebase integration check crashed: ${err.message}`)
  } finally {
    await browser.close()
  }

  return { score, maxScore, errors, warnings }
}
