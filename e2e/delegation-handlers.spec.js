import { test, expect } from '@playwright/test'

/**
 * Delegation wrapper handlers — REAL delegated effect (Brique 2).
 * Each wrapper just forwards to another handler; we trigger it and verify the
 * end state it is supposed to produce.
 */
const CASES = [
  { fn: 'submitNewSpot', expect: (s) => s.showAddSpot === true },
  { fn: 'openAccessibilityHelp', expect: (s) => s.showAccessibilityHelp === true },
  { fn: 'closeAddPastTrip', setup: { showAddPastTrip: true }, expect: (s) => s.showAddPastTrip === false },
  { fn: 'closeLocationPermission', setup: { showLocationPermission: true }, expect: (s) => s.showLocationPermission === false },
  { fn: 'closeWelcome', setup: { showWelcome: true }, expect: (s) => s.showWelcome === false },
  { fn: 'closeCityPanel', setup: { selectedCity: { name: 'X' } }, expect: (s) => s.selectedCity === null },
  { fn: 'markSafe', setup: { sosActive: true, showSOS: true }, expect: (s) => s.sosActive === false && s.showSOS === false },
  // openProfile is login-gated (redirects logged-out users to auth) — covered by a logged-in flow.
  { fn: 'loginWithEmail', expect: (s) => s.showAuth === true || s.showAuthModal === true },
]

test('delegation wrappers produce their delegated effect', async ({ page }) => {
  await page.addInitScript(() => {
    try {
      localStorage.setItem('spothitch_welcomed', 'true')
      localStorage.setItem('spothitch_age_verified', 'true')
      localStorage.setItem('spothitch_cookie_consent', 'true')
      localStorage.setItem('spothitch_landing_seen', 'true')
    } catch { /* ignore */ }
  })
  await page.goto('/', { waitUntil: 'load', timeout: 30000 }).catch(() => {})
  await page.waitForFunction(() => typeof window.setState === 'function' && typeof window.getState === 'function', { timeout: 15000 })

  const snapshot = () => page.evaluate(() => {
    const s = window.getState()
    return JSON.parse(JSON.stringify({
      showAddSpot: s.showAddSpot, showAccessibilityHelp: s.showAccessibilityHelp,
      showAddPastTrip: s.showAddPastTrip, showLocationPermission: s.showLocationPermission,
      showWelcome: s.showWelcome, selectedCity: s.selectedCity ?? null,
      sosActive: s.sosActive, showSOS: s.showSOS, activeTab: s.activeTab,
      showAuth: s.showAuth, showAuthModal: s.showAuthModal,
    }))
  })

  const fails = []
  for (const c of CASES) {
    // Poll for the (possibly lazy) handler to register before triggering it.
    const registered = await page.waitForFunction((fn) => typeof window[fn] === 'function', c.fn, { timeout: 8000 })
      .then(() => true).catch(() => false)
    if (!registered) { fails.push(`${c.fn}:not-a-function`); continue }
    const err = await page.evaluate(async ({ fn, setup }) => {
      if (setup) window.setState(setup)
      try { await window[fn]() } catch (e) { return 'threw ' + e.message }
      return null
    }, { fn: c.fn, setup: c.setup })
    if (err) { fails.push(`${c.fn}:${err}`) }
    else {
      // Poll for the delegated effect (async re-renders / lazy delegations settle).
      let last = null, effect = false
      for (let t = 0; t < 20 && !effect; t++) {
        last = await snapshot()
        effect = c.expect(last)
        if (!effect) await page.waitForTimeout(200)
      }
      if (!effect) fails.push(`${c.fn}:${JSON.stringify(last)}`)
    }
    await page.evaluate(() => window.setState({ showAddSpot: false, showAccessibilityHelp: false, showAuth: false, showAuthModal: false }))
  }

  expect(fails, 'delegation wrappers that did NOT produce their effect').toEqual([])
})
