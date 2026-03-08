/**
 * Firebase E2E Test Helpers
 *
 * Provides real Firebase authentication and Firestore utilities
 * for E2E tests using 5 dedicated test accounts.
 */
import { expect } from '@playwright/test'
import { skipOnboarding, dismissOverlays } from './helpers.js'

// Test accounts
export const TEST_ACCOUNTS = {
  alice: { email: 'ci-alice@spothitch.com', name: 'Alice Test' },
  bob: { email: 'ci-bob@spothitch.com', name: 'Bob Test' },
  charlie: { email: 'ci-charlie@spothitch.com', name: 'Charlie Test' },
  diana: { email: 'ci-diana@spothitch.com', name: 'Diana Test' },
  admin: { email: 'ci-admin@spothitch.com', name: 'Admin Test' },
}

/**
 * Get the shared test password from environment
 */
export function getTestPassword() {
  const pw = process.env.E2E_TEST_PASSWORD
  if (!pw) throw new Error('E2E_TEST_PASSWORD environment variable is required')
  return pw
}

/**
 * Login with email/password through the real Auth modal.
 * Waits for Firebase auth state to be set.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} email
 * @param {string} [password] - defaults to E2E_TEST_PASSWORD env var
 */
export async function firebaseLogin(page, email, password) {
  const pw = password || getTestPassword()

  // Open auth modal
  await page.evaluate(() => window.openAuth?.('email'))
  await page.waitForSelector('#auth-form', { timeout: 5000 })

  // Make sure we're in login mode (not register)
  const loginTab = page.locator('button[onclick*="setAuthMode(\'login\')"]')
  if (await loginTab.count() > 0) {
    const isSelected = await loginTab.getAttribute('aria-selected')
    if (isSelected !== 'true') {
      await loginTab.click()
      await page.waitForTimeout(300)
    }
  }

  // Fill email and password
  await page.fill('#auth-email', email)
  await page.fill('#auth-password', pw)

  // Submit
  await page.click('#auth-submit-btn')

  // Wait for auth to complete: modal closes + currentUser is set
  await page.waitForFunction(
    () => {
      const state = JSON.parse(localStorage.getItem('spothitch_v4_state') || '{}')
      return state.currentUser?.uid || state.userProfile?.uid
    },
    { timeout: 15000 }
  )

  // Wait for modal to close
  await page.waitForFunction(
    () => !document.querySelector('#auth-form'),
    { timeout: 5000 }
  ).catch(() => {})

  await page.waitForTimeout(500)
}

/**
 * Logout the current user.
 *
 * @param {import('@playwright/test').Page} page
 */
export async function firebaseLogout(page) {
  await page.evaluate(() => window.handleLogout?.())

  // Wait for auth state to be cleared
  await page.waitForFunction(
    () => {
      const state = JSON.parse(localStorage.getItem('spothitch_v4_state') || '{}')
      return !state.currentUser && !state.userProfile?.uid
    },
    { timeout: 10000 }
  )

  await page.waitForTimeout(500)
}

/**
 * Wait for a Firestore condition to be true (evaluated in browser context).
 *
 * @param {import('@playwright/test').Page} page
 * @param {Function} checkFn - function to evaluate in browser, must return truthy when done
 * @param {number} [timeout=10000]
 */
export async function waitForFirestore(page, checkFn, timeout = 10000) {
  await page.waitForFunction(checkFn, { timeout })
}

/**
 * Open a second browser context logged in as a different user.
 * Useful for testing real-time features (DMs, friend requests, etc.)
 *
 * @param {import('@playwright/test').Browser} browser
 * @param {string} email
 * @param {string} [password]
 * @returns {{ context: BrowserContext, page: Page }}
 */
export async function openSecondBrowser(browser, email, password) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
  })
  const page = await context.newPage()

  // Setup like skipOnboarding but manually (addInitScript not available after newPage)
  await page.addInitScript(() => {
    localStorage.setItem('spothitch_v4_state', JSON.stringify({
      showWelcome: false,
      username: 'TestUser2',
      avatar: '🤙',
      activeTab: 'map',
      theme: 'dark',
      lang: 'fr',
      points: 0,
      level: 1,
      badges: [],
      rewards: [],
      savedTrips: [],
      emergencyContacts: [],
    }))
    localStorage.setItem('spothitch_v4_cookie_consent', JSON.stringify({
      preferences: { necessary: true, analytics: false, marketing: false, personalization: false },
      timestamp: Date.now(),
      version: '1.0',
    }))
    localStorage.setItem('spothitch_age_verified', 'true')
    localStorage.setItem('spothitch_landing_v2', '1')
    localStorage.setItem('spothitch_beta_seen', '1')
    const featureSeen = {}
    ;['carte','stations','add-spot','profil','amis','chat','carnet','stats','classements','niveaux','conseils','dons','hors-ligne','sos','compagnon','notif-spot','activite-amis','defis','score-confiance','avis-profils','itineraire','radar','quiz','guides','gardien','evenements','auberges'].forEach(id => { featureSeen[id] = Date.now() })
    localStorage.setItem('spothitch_feature_seen', JSON.stringify(featureSeen))
  })

  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await Promise.race([
    page.waitForSelector('#app.loaded', { timeout: 10000 }).catch(() => null),
    page.waitForSelector('nav[role="navigation"]', { timeout: 10000 }).catch(() => null),
  ])
  await page.evaluate(() => {
    const app = document.getElementById('app')
    if (app && !app.classList.contains('loaded')) app.classList.add('loaded')
    const splash = document.getElementById('splash-screen')
    if (splash) splash.remove()
  })
  await dismissOverlays(page)

  // Login
  await firebaseLogin(page, email, password)

  return { context, page }
}

/**
 * Get the current Firebase user's UID from the page.
 *
 * @param {import('@playwright/test').Page} page
 * @returns {string|null}
 */
export async function getCurrentUid(page) {
  return page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem('spothitch_v4_state') || '{}')
    return state.currentUser?.uid || state.userProfile?.uid || null
  })
}

/**
 * Clean up test data created during a test.
 * Deletes spots, conversations, reviews etc. created by the test user.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} uid - The user's UID
 */
export async function cleanupTestData(page, uid) {
  if (!uid) return

  await page.evaluate(async (testUid) => {
    try {
      const fb = await import('/src/services/firebase.js')
      fb.initializeFirebase()

      const { getFirestore, collection, query, where, getDocs, deleteDoc, doc } =
        await import('firebase/firestore')
      const db = getFirestore()

      // Delete test spots created by this user
      const spotsQuery = query(collection(db, 'spots'), where('createdBy', '==', testUid))
      const spotsSnap = await getDocs(spotsQuery)
      for (const d of spotsSnap.docs) {
        await deleteDoc(d.ref)
      }

      // Delete test reviews
      const reviewsQuery = query(collection(db, 'reviews'), where('userId', '==', testUid))
      const reviewsSnap = await getDocs(reviewsQuery)
      for (const d of reviewsSnap.docs) {
        await deleteDoc(d.ref)
      }

      // Delete test conversations where user is a participant
      const convsQuery = query(collection(db, 'conversations'), where('participants', 'array-contains', testUid))
      const convsSnap = await getDocs(convsQuery)
      for (const d of convsSnap.docs) {
        // Delete messages subcollection first
        const msgsSnap = await getDocs(collection(db, 'conversations', d.id, 'messages'))
        for (const m of msgsSnap.docs) {
          await deleteDoc(m.ref)
        }
        await deleteDoc(d.ref)
      }

      // Delete friend requests
      const reqsSent = query(collection(db, 'friendRequests'), where('from', '==', testUid))
      const reqsRecv = query(collection(db, 'friendRequests'), where('to', '==', testUid))
      for (const q of [reqsSent, reqsRecv]) {
        const snap = await getDocs(q)
        for (const d of snap.docs) await deleteDoc(d.ref)
      }
    } catch (err) {
      console.warn('cleanupTestData error:', err.message)
    }
  }, uid)
}

/**
 * Setup a page with skipOnboarding + Firebase login.
 * Convenience helper that combines both steps.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} email
 * @param {string} [password]
 */
export async function setupAuthenticatedPage(page, email, password) {
  await skipOnboarding(page)
  await firebaseLogin(page, email, password)
}

/**
 * Check if a Firestore document exists.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} collectionPath
 * @param {string} docId
 * @returns {boolean}
 */
export async function firestoreDocExists(page, collectionPath, docId) {
  return page.evaluate(async ({ path, id }) => {
    try {
      const { getFirestore, doc, getDoc } = await import('firebase/firestore')
      const db = getFirestore()
      const snap = await getDoc(doc(db, path, id))
      return snap.exists()
    } catch {
      return false
    }
  }, { path: collectionPath, id: docId })
}

/**
 * Read a Firestore document's data.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} collectionPath
 * @param {string} docId
 * @returns {object|null}
 */
export async function firestoreGetDoc(page, collectionPath, docId) {
  return page.evaluate(async ({ path, id }) => {
    try {
      const { getFirestore, doc, getDoc } = await import('firebase/firestore')
      const db = getFirestore()
      const snap = await getDoc(doc(db, path, id))
      return snap.exists() ? snap.data() : null
    } catch {
      return null
    }
  }, { path: collectionPath, id: docId })
}
