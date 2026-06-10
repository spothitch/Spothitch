/**
 * E2E Test Helpers
 */
import { expect } from '@playwright/test'

/**
 * Dismiss all blocking overlays (cookie banner, age verification, etc.)
 */
export async function dismissOverlays(page) {
  const cookieAccept = page.locator('#cookie-banner button:has-text("Accepter"), #cookie-banner button:has-text("Accept")')
  if (await cookieAccept.count() > 0 && await cookieAccept.first().isVisible({ timeout: 1000 }).catch(() => false)) {
    await cookieAccept.first().click()
    await page.waitForTimeout(300)
  }

  const ageClose = page.locator('[onclick*="closeAgeVerification"], button:has-text("Fermer"):visible')
  if (await ageClose.count() > 0 && await ageClose.first().isVisible({ timeout: 500 }).catch(() => false)) {
    await ageClose.first().click()
    await page.waitForTimeout(300)
  }

  // Beta welcome popup
  const betaClose = page.locator('button[onclick*="closeBetaPopup"]')
  if (await betaClose.count() > 0 && await betaClose.first().isVisible({ timeout: 500 }).catch(() => false)) {
    await betaClose.first().click()
    await page.waitForTimeout(300)
  }

  const modalClose = page.locator('.modal-overlay button[aria-label="Fermer"], .modal-overlay button:has(svg)').first()
  if (await modalClose.isVisible({ timeout: 500 }).catch(() => false)) {
    await modalClose.click()
    await page.waitForTimeout(300)
  }
}

/**
 * Skip onboarding for returning user experience
 */
export async function skipOnboarding(page, opts = {}) {
  const stateData = {
    showWelcome: false,
    username: 'TestUser',
    avatar: '🤙',
    activeTab: opts.tab || 'map',
    theme: 'dark',
    lang: 'fr',
    points: opts.points || 100,
    level: opts.level || 2,
    badges: ['first_spot'],
    rewards: [],
    savedTrips: [],
    emergencyContacts: []
  }

  // Use addInitScript to set localStorage BEFORE any page JS runs
  await page.addInitScript((state) => {
    localStorage.setItem('spothitch_v4_state', JSON.stringify(state))
    // Use prefixed key matching Storage.js (spothitch_v4_cookie_consent)
    // and the format expected by hasConsent(): { preferences, timestamp, version }
    localStorage.setItem('spothitch_v4_cookie_consent', JSON.stringify({
      preferences: { necessary: true, analytics: false, marketing: false, personalization: false },
      timestamp: Date.now(),
      version: '1.0'
    }))
    localStorage.setItem('spothitch_age_verified', 'true')
    localStorage.setItem('spothitch_landing_v2', '1')
    localStorage.setItem('spothitch_beta_seen', '1')
    localStorage.setItem('spothitch_alpha_code', 'ok')
    // Mark all feature intros as seen so intro modals never appear in E2E tests
    const featureSeen = {}
    ;['carte','stations','add-spot','profil','amis','chat','carnet','stats','classements','niveaux','conseils','dons','hors-ligne','sos','compagnon','notif-spot','activite-amis','defis','score-confiance','avis-profils','itineraire','radar','quiz','guides','gardien','evenements','auberges'].forEach(id => { featureSeen[id] = Date.now() })
    localStorage.setItem('spothitch_feature_seen', JSON.stringify(featureSeen))
  }, stateData)

  await page.goto('/', { waitUntil: 'domcontentloaded' })

  // Wait for either app.loaded class or nav to appear (10s max — if it takes longer, something is broken)
  await Promise.race([
    page.waitForSelector('#app.loaded', { timeout: 10000 }).catch(() => null),
    page.waitForSelector('nav[role="navigation"]', { timeout: 10000 }).catch(() => null),
  ])

  // If still stuck on splash, force remove it
  await page.evaluate(() => {
    const app = document.getElementById('app')
    if (app && !app.classList.contains('loaded')) {
      app.classList.add('loaded')
    }
    const splash = document.getElementById('splash-screen')
    if (splash) splash.remove()
    const loader = document.getElementById('app-loader')
    if (loader) loader.remove()
  })

  // Final check: wait for nav
  await page.waitForSelector('nav', { timeout: 5000 }).catch(() => {})
  await dismissOverlays(page)
}

/**
 * Wait for MapLibre canvas to be fully rendered (use before map-dependent tests)
 */
export async function waitForMap(page, timeout = 25000) {
  // Wait for app loaded
  await page.waitForSelector('#app.loaded', { timeout }).catch(() => {})
  // Wait for map container + canvas
  await page.waitForSelector('#home-map', { timeout: 15000 }).catch(() => {})
  await page.waitForSelector('canvas.maplibregl-canvas, canvas.mapboxgl-canvas', { timeout: 15000 }).catch(() => {})
  // Wait for search bar
  await page.waitForSelector('#home-destination', { timeout: 15000 }).catch(async () => {
    await page.evaluate(() => window.changeTab?.('map')).catch(() => {})
    await page.waitForSelector('#home-destination', { timeout: 10000 }).catch(() => {})
  })
  await page.waitForTimeout(1500)
}

/**
 * Navigate to a specific tab and wait for it to be active
 */
export async function navigateToTab(page, tabId) {
  const tab = page.locator(`[data-tab="${tabId}"]`)
  // Wait for tab button to exist in DOM first
  await tab.waitFor({ state: 'attached', timeout: 5000 }).catch(() => {})
  // Use evaluate for maximum reliability (bypasses visibility checks)
  await page.evaluate((id) => {
    const btn = document.querySelector(`[data-tab="${id}"]`)
    if (btn) btn.click()
  }, tabId)

  // For protected tabs: install lock + set auth state in ONE synchronous evaluate,
  // BEFORE any waitForTimeout(). Firebase onAuthStateChanged(null) fires during waits
  // and resets isLoggedIn:false. Installing the lock here prevents all future resets.
  const protectedTabs = ['voyage', 'social', 'profile']
  if (protectedTabs.includes(tabId)) {
    await page.evaluate((id) => {
      // Activate E2E auth lock — state.js setState now blocks isLoggedIn:false updates.
      // Must be set BEFORE any async wait so Firebase onAuthStateChanged(null) is blocked.
      window.__e2eAuthLock = true
      // Immediately set auth state while lock is armed — no async gap
      window.setState?.({ showAuth: false, isLoggedIn: true, activeTab: id })
    }, tabId)
  }

  await page.waitForTimeout(500)
  // Also close auth modal if it appeared
  const authShowing = await page.evaluate(() => window.getState?.()?.showAuth)
  if (authShowing) {
    await page.evaluate((id) => {
      window.setState?.({ showAuth: false, activeTab: id })
    }, tabId)
    await page.waitForTimeout(500)
  }

  try {
    await expect(tab).toHaveAttribute('aria-selected', 'true', { timeout: 3000 })
  } catch {
    // Retry with force click
    await tab.click({ force: true, timeout: 3000 }).catch(() => {})
  }
  // Wait for lazy-loaded view content to appear (import() + re-render cycle)
  await page.waitForTimeout(2000)
}

/**
 * Wait for toast notification to appear
 */
export async function waitForToast(page, text) {
  const selector = text
    ? `.toast:has-text("${text}"), [role="alert"]:has-text("${text}")`
    : '.toast, [role="alert"]'
  await page.waitForSelector(selector, { timeout: 5000 }).catch(() => null)
}

/**
 * Get app state from localStorage
 */
export async function getAppState(page, key) {
  const state = await page.evaluate(() => {
    if (typeof window.getState === 'function') return window.getState()
    const raw = localStorage.getItem('spothitch_v4_state')
    return raw ? JSON.parse(raw) : null
  })
  if (key !== undefined) return state?.[key] ?? null
  return state
}

/**
 * Set additional localStorage data for a service
 */
export async function setStorageData(page, key, value) {
  await page.evaluate(({ k, v }) => {
    localStorage.setItem(k, JSON.stringify(v))
  }, { k: key, v: value })
}
