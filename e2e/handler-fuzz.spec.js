import { test, expect } from '@playwright/test'
import { execSync } from 'child_process'
import fs from 'fs'

/**
 * Handler fuzz / monkey (Brique 5) — APP-INTEGRITY net.
 *
 * Triggers EVERY window.* handler (except destructive ones) and verifies none of
 * them breaks the app: after each call the page must still have #app, window.getState()
 * must still return an object, and the body must not be blank. This catches any handler
 * that crashes the UI for a real user. It is crash-safety coverage — NOT the deeper
 * 4-check (persistence + cross-user) layer, which lives in the firebase-* specs.
 */
const ALL = (() => {
  const out = execSync("grep -rohE 'window\\.[a-zA-Z][a-zA-Z0-9]+ ?=' src/ --include=*.js").toString()
  return [...new Set([...out.matchAll(/window\.([a-zA-Z][a-zA-Z0-9]+)/g)].map((m) => m[1]))].sort()
})()
// Destructive / disruptive handlers we must NOT fire blindly.
const DENY = /(^reset|resetApp|deleteAccount|requestAccountDeletion|confirmDelete|deleteMySpot|deleteSavedTrip|deleteBuddyAnnouncement|signOut|logout|^signIn|order66|clearAllOfflineData|deleteOfflineCountry|unregister|deleteUser|wipe|purge)/i
const HANDLERS = ALL.filter((h) => !DENY.test(h))

test('no handler crashes the app (fuzz / monkey)', async ({ page }) => {
  test.setTimeout(180000)

  await page.addInitScript(() => {
    try {
      localStorage.setItem('spothitch_welcomed', 'true')
      localStorage.setItem('spothitch_age_verified', 'true')
      localStorage.setItem('spothitch_cookie_consent', 'true')
      localStorage.setItem('spothitch_landing_seen', 'true')
    } catch { /* ignore */ }
  })
  await page.goto('/', { waitUntil: 'load', timeout: 30000 }).catch(() => {})
  await page.waitForFunction(() => typeof window.getState === 'function', { timeout: 15000 })

  expect(HANDLERS.length).toBeGreaterThan(400)

  const broke = []      // handler left the app dead (white screen / no #app) — real crash bug
  const navigators = [] // handler triggered a real page navigation/reload (excluded from crash check)

  for (const h of HANDLERS) {
    let res
    try {
      res = await page.evaluate(async (h) => {
        if (typeof window[h] !== 'function') return 'skip'
        try {
          const r = window[h]()
          if (r && typeof r.then === 'function') {
            await Promise.race([r.catch(() => {}), new Promise((x) => setTimeout(x, 250))])
          }
        } catch { /* thrown error tolerated; the app staying alive is what matters */ }
        const alive = !!document.getElementById('app') &&
          typeof window.getState === 'function' &&
          typeof window.getState() === 'object' &&
          document.body && document.body.innerText.length > 0
        return alive ? 'ok' : 'dead'
      }, h)
    } catch {
      res = 'navigated' // execution context destroyed by a navigation/reload
    }
    if (res === 'dead') broke.push(h)
    if (res === 'navigated') {
      navigators.push(h)
      await page.goto('/', { waitUntil: 'load', timeout: 30000 }).catch(() => {})
      await page.waitForFunction(() => typeof window.getState === 'function', { timeout: 15000 })
    }
  }

  try { fs.writeFileSync('/tmp/fuzz-broke.json', JSON.stringify({ broke, navigators })) } catch { /* ignore */ }
  // A blank/missing #app after a handler is a real crash bug. Navigators are reported
  // separately (a hard reload may be intentional, e.g. a retry button).
  expect(broke, 'handlers that left the app DEAD (white screen)').toEqual([])
})
