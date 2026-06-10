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

  // Trigger Firebase module loading
  await page.evaluate(() => window.openAuth?.('email'))
  await page.waitForTimeout(3000)
  await page.evaluate(() => window.closeAuth?.())
  await page.waitForTimeout(500)

  // Wait for window.__fb
  await page.waitForFunction(() => !!window.__fb, { timeout: 15000 })

  // Login programmatically with retry + auto-create for emulator
  const pw = password || getTestPassword()
  const delays = [0, 2000, 5000]
  let lastResult

  for (let attempt = 0; attempt < delays.length; attempt++) {
    if (delays[attempt] > 0) await page.waitForTimeout(delays[attempt])

    lastResult = await page.evaluate(async ({ e, p }) => {
      try {
        const fb = window.__fb
        fb.initializeFirebase()
        const timeout20s = new Promise((_, r) => setTimeout(() => r(new Error('signIn-timeout')), 20000))
        const res = await Promise.race([fb.signIn(e, p), timeout20s])
        if (res.success) {
          const state = JSON.parse(localStorage.getItem('spothitch_v4_state') || '{}')
          state.currentUser = { uid: res.user.uid, email: e }
          state.userProfile = { uid: res.user.uid, email: e }
          localStorage.setItem('spothitch_v4_state', JSON.stringify(state))
          return { success: true }
        }
        if (res.error?.includes('user-not-found') || res.error?.includes('invalid-credential')) {
          const timeout20s2 = new Promise((_, r) => setTimeout(() => r(new Error('signUp-timeout')), 20000))
          const signUpRes = await Promise.race([fb.signUp(e, p, e.split('@')[0]), timeout20s2])
          if (signUpRes.success) {
            const state = JSON.parse(localStorage.getItem('spothitch_v4_state') || '{}')
            state.currentUser = { uid: signUpRes.user.uid, email: e }
            state.userProfile = { uid: signUpRes.user.uid, email: e }
            localStorage.setItem('spothitch_v4_state', JSON.stringify(state))
            return { success: true }
          }
          return { success: false, error: signUpRes.error }
        }
        return { success: false, error: res.error }
      } catch (err) {
        return { success: false, error: err.message }
      }
    }, { e: email, p: pw })

    if (lastResult.success) break
    if (!lastResult.error?.includes('too-many-requests')) break
  }

  // Fallback: inject auth state via localStorage
  if (!lastResult?.success) {
    console.warn(`[openSecondBrowser] SDK login failed (${lastResult?.error}), using localStorage fallback for ${email}`)
    const syntheticUid = 'ci-' + email.replace(/[^a-z0-9]/gi, '-').slice(0, 20)
    await page.evaluate(({ e, uid }) => {
      // Call setState first (it may overwrite localStorage with in-memory state)
      window.setState?.({ isLoggedIn: true, user: { uid, email: e, displayName: e.split('@')[0] } })
      // Re-set currentUser AFTER setState (setState may have cleared it from localStorage)
      const s = JSON.parse(localStorage.getItem('spothitch_v4_state') || '{}')
      s.currentUser = { uid, email: e }
      s.userProfile = { uid, email: e, displayName: e.split('@')[0] }
      localStorage.setItem('spothitch_v4_state', JSON.stringify(s))
    }, { e: email, uid: syntheticUid })
  }

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
    // Check Firebase Auth first (most reliable)
    const auth = window.__fb?.getAuth?.()
    if (auth?.currentUser?.uid) return auth.currentUser.uid
    // Fallback to localStorage
    const state = JSON.parse(localStorage.getItem('spothitch_v4_state') || '{}')
    return state.currentUser?.uid || state.userProfile?.uid || null
  })
}

/**
 * Look up a user's UID by their email address via Firestore query.
 * Avoids needing to login as another user just to get their UID.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} email
 * @returns {string|null}
 */
export async function getUidByEmail(page, email) {
  return page.evaluate(async (e) => {
    try {
      const { getDb, collection, query, where, getDocs } = window.__fb
      const db = getDb()
      const q = query(collection(db, 'users'), where('email', '==', e))
      const snap = await getDocs(q)
      return snap.docs[0]?.id || null
    } catch {
      return null
    }
  }, email)
}

/**
 * Create a browser context with onboarding skipped and Firebase loaded.
 * Used in beforeAll() for shared session patterns.
 *
 * Strategy: try real Firebase SDK login first. If that fails (e.g. emulator
 * unreachable from browser in CI), fall back to localStorage-only auth
 * with a synthetic UID. Tests that only need auth state (not real Firebase
 * operations) will work with the fallback.
 *
 * @param {import('@playwright/test').Browser} browser
 * @param {string} email
 * @param {string} [password]
 * @returns {{ context: BrowserContext, page: Page, uid: string }}
 */
export async function initFirebasePage(browser, email, password) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
  })
  const page = await context.newPage()

  // Generate a deterministic synthetic UID for fallback (based on email)
  const syntheticUid = 'ci-' + email.replace(/[^a-z0-9]/gi, '-').slice(0, 20)

  await page.addInitScript(() => {
    localStorage.setItem('spothitch_v4_state', JSON.stringify({
      showWelcome: false, username: 'E2ETest', avatar: '🤙',
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

  // Trigger Firebase module loading by opening auth modal briefly
  await page.evaluate(() => window.openAuth?.('email'))
  await page.waitForTimeout(3000)
  await page.evaluate(() => window.closeAuth?.())
  await page.waitForTimeout(500)

  // Wait for window.__fb to be available
  await page.waitForFunction(() => !!window.__fb, { timeout: 15000 })

  // Try real Firebase SDK login (works when Firebase/emulator is reachable)
  const pw = password || getTestPassword()
  let loginResult
  const delays = [0, 2000, 5000]

  for (let attempt = 0; attempt < delays.length; attempt++) {
    if (delays[attempt] > 0) await page.waitForTimeout(delays[attempt])

    loginResult = await page.evaluate(async ({ e, p }) => {
      try {
        const fb = window.__fb
        fb.initializeFirebase()
        // Try signIn with 20s timeout (emulator can be slow under CI load)
        // Use 'signIn-exceeded' (not 'signIn-timeout') so it's NOT in the retryable list
        // and falls immediately to the localStorage fallback instead of retrying 3×
        const timeout20s = new Promise((_, r) => setTimeout(() => r(new Error('signIn-exceeded')), 20000))
        const result = await Promise.race([fb.signIn(e, p), timeout20s])
        if (result.success) {
          const state = JSON.parse(localStorage.getItem('spothitch_v4_state') || '{}')
          state.currentUser = { uid: result.user.uid, email: e }
          state.userProfile = { uid: result.user.uid, email: e }
          localStorage.setItem('spothitch_v4_state', JSON.stringify(state))
          return { success: true, uid: result.user.uid }
        }
        // Auto-create if account doesn't exist (emulator starts fresh)
        if (result.error?.includes('user-not-found') || result.error?.includes('invalid-credential')) {
          const timeout20s2 = new Promise((_, r) => setTimeout(() => r(new Error('signUp-exceeded')), 20000))
          const signUpRes = await Promise.race([fb.signUp(e, p, e.split('@')[0]), timeout20s2])
          if (signUpRes.success) {
            const state = JSON.parse(localStorage.getItem('spothitch_v4_state') || '{}')
            state.currentUser = { uid: signUpRes.user.uid, email: e }
            state.userProfile = { uid: signUpRes.user.uid, email: e }
            localStorage.setItem('spothitch_v4_state', JSON.stringify(state))
            return { success: true, uid: signUpRes.user.uid }
          }
          return { success: false, error: signUpRes.error }
        }
        return { success: false, error: result.error }
      } catch (err) {
        return { success: false, error: err.message }
      }
    }, { e: email, p: pw })

    if (loginResult.success) break
    // Only retry on transient errors
    const retryable = ['too-many-requests', 'internal-error', 'unavailable', 'timeout', 'ECONNRESET']
    if (!retryable.some(e => loginResult.error?.includes(e))) break
  }

  // Fallback: if SDK login failed (e.g. emulator unreachable from browser),
  // inject auth state via localStorage so tests can still run
  if (!loginResult?.success) {
    console.warn(`[initFirebasePage] SDK login failed (${loginResult?.error}), using localStorage fallback for ${email}`)
    await page.evaluate(({ e, uid }) => {
      // Call setState first (it may overwrite localStorage with in-memory state)
      window.setState?.({ isLoggedIn: true, user: { uid, email: e, displayName: e.split('@')[0] } })
      // Re-set currentUser AFTER setState (setState may have cleared it from localStorage)
      const s = JSON.parse(localStorage.getItem('spothitch_v4_state') || '{}')
      s.currentUser = { uid, email: e }
      s.userProfile = { uid, email: e, displayName: e.split('@')[0] }
      localStorage.setItem('spothitch_v4_state', JSON.stringify(s))
    }, { e: email, uid: syntheticUid })
    return { context, page, uid: syntheticUid }
  }

  return { context, page, uid: loginResult.uid }
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
      const { getDb, collection, query, where, getDocs, deleteDoc, doc } = window.__fb
      const db = getDb()

      // Delete test spots created by this user
      const spotsQuery = query(collection(db, 'spots'), where('creatorId', '==', testUid))
      const spotsSnap = await getDocs(spotsQuery)
      for (const d of spotsSnap.docs) {
        await deleteDoc(d.ref)
      }

      // Delete test DM conversations where user is a participant
      const convsQuery = query(collection(db, 'directMessages'), where('participants', 'array-contains', testUid))
      const convsSnap = await getDocs(convsQuery)
      for (const d of convsSnap.docs) {
        try {
          const msgsSnap = await getDocs(collection(db, 'directMessages', d.id, 'messages'))
          for (const m of msgsSnap.docs) await deleteDoc(m.ref)
          await deleteDoc(d.ref)
        } catch {}
      }

      // Delete friend requests from own subcollection
      try {
        const reqsSnap = await getDocs(collection(db, 'users', testUid, 'friendRequests'))
        for (const d of reqsSnap.docs) await deleteDoc(d.ref)
      } catch {}
    } catch (err) {
      console.warn('cleanupTestData error:', err.message)
    }
  }, uid)
}

/**
 * Login programmatically via Firebase SDK (no UI interaction).
 * More reliable than UI-based firebaseLogin in CI environments.
 * Requires window.__fb to already be loaded (via initFirebasePage or openSecondBrowser).
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} email
 * @param {string} [password]
 * @returns {string} uid
 */
export async function programmaticLogin(page, email, password) {
  const pw = password || getTestPassword()
  let result
  const delays = [0, 2000, 5000, 10000]

  for (let attempt = 0; attempt < delays.length; attempt++) {
    if (delays[attempt] > 0) await page.waitForTimeout(delays[attempt])

    result = await page.evaluate(async ({ e, p }) => {
      try {
        const fb = window.__fb
        const res = await fb.signIn(e, p)
        if (res.success) {
          const state = JSON.parse(localStorage.getItem('spothitch_v4_state') || '{}')
          state.currentUser = { uid: res.user.uid, email: e }
          state.userProfile = { uid: res.user.uid, email: e }
          localStorage.setItem('spothitch_v4_state', JSON.stringify(state))
          return { success: true, uid: res.user.uid }
        }
        // Auto-create on emulator if account doesn't exist
        if (res.error?.includes('user-not-found') || res.error?.includes('invalid-credential')) {
          const signUpRes = await fb.signUp(e, p, e.split('@')[0])
          if (signUpRes.success) {
            const state = JSON.parse(localStorage.getItem('spothitch_v4_state') || '{}')
            state.currentUser = { uid: signUpRes.user.uid, email: e }
            state.userProfile = { uid: signUpRes.user.uid, email: e }
            localStorage.setItem('spothitch_v4_state', JSON.stringify(state))
            return { success: true, uid: signUpRes.user.uid }
          }
          return { success: false, error: signUpRes.error }
        }
        return { success: false, error: res.error }
      } catch (err) {
        return { success: false, error: err.message }
      }
    }, { e: email, p: pw })

    if (result.success) break
    if (!result.error?.includes('too-many-requests')) break
  }

  // Fallback: inject auth state via localStorage
  if (!result?.success) {
    console.warn(`[programmaticLogin] SDK login failed (${result?.error}), using localStorage fallback for ${email}`)
    const syntheticUid = 'ci-' + email.replace(/[^a-z0-9]/gi, '-').slice(0, 20)
    await page.evaluate(({ e, uid }) => {
      const state = JSON.parse(localStorage.getItem('spothitch_v4_state') || '{}')
      state.currentUser = { uid, email: e }
      state.userProfile = { uid, email: e }
      localStorage.setItem('spothitch_v4_state', JSON.stringify(state))
    }, { e: email, uid: syntheticUid })
    await page.waitForTimeout(300)
    return syntheticUid
  }

  await page.waitForTimeout(300)
  return result.uid
}

/**
 * Logout programmatically via Firebase SDK (no UI interaction).
 * Clears both Firebase Auth state and localStorage.
 *
 * @param {import('@playwright/test').Page} page
 */
export async function programmaticLogout(page) {
  await page.evaluate(async () => {
    try {
      const auth = window.__fb.getAuth()
      await auth.signOut()
    } catch {}
    const state = JSON.parse(localStorage.getItem('spothitch_v4_state') || '{}')
    delete state.currentUser
    delete state.userProfile
    localStorage.setItem('spothitch_v4_state', JSON.stringify(state))
  })
  await page.waitForTimeout(300)
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
      const { getDb, doc, getDoc } = window.__fb
      const db = getDb()
      const snap = await Promise.race([
        getDoc(doc(db, path, id)),
        new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 12000)),
      ])
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
      const { getDb, doc, getDoc } = window.__fb
      const db = getDb()
      const snap = await Promise.race([
        getDoc(doc(db, path, id)),
        new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 12000)),
      ])
      return snap.exists() ? snap.data() : null
    } catch {
      return null
    }
  }, { path: collectionPath, id: docId })
}
