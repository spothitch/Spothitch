import { test, expect } from '@playwright/test'
import { execSync } from 'child_process'
import fs from 'fs'

/**
 * Auto-discovering toggle coverage (Brique 2). Every no-arg window.toggleX must flip
 * exactly one boolean state key, and flip it back on a second call. Self-syncing: the
 * key is discovered at run time, so the test does not hard-code any flag. Toggles that
 * need an argument (an id, a type…) are listed in NEEDS_ARG and covered by feature specs.
 */
const TOGGLES = (() => {
  const out = execSync("grep -rhoP 'window\\.toggle[A-Z]\\w* =' src/ --include=*.js").toString()
  return [...new Set([...out.matchAll(/window\.(\w+) =/g)].map((m) => m[1]))].sort()
})()

const NEEDS_ARG = new Set([
  'toggleAmenity', 'toggleBuddyFlexDates', 'toggleCheckinChar', 'toggleCommunityAlerts', 'toggleCustomSelect',
  'toggleFAQItem', 'toggleFavorite', 'toggleFeedVisibility', 'toggleFormToggle', 'toggleFriendForGroup',
  'toggleNearbyFriends', 'togglePrivacy', 'toggleProximityAlerts', 'toggleProximityAlertsSetting', 'toggleProximityRadar',
  'togglePushNotifications', 'toggleReplyInput', 'toggleRoadmapComments', 'toggleSettingsSection', 'toggleTheme',
  'toggleTripPublic', 'toggleWebhookAction',
  'toggleAccessibility', // requires a (setting) arg — covered with a real arg in toggle-handlers.spec.js
  // Lazy toggles not present in the bare app shell (map/notifications modules load on demand):
  'toggleGasStations', 'toggleNotifications', 'toggleRouteAmenities',
])

const TARGETS = TOGGLES.filter((h) => !NEEDS_ARG.has(h))

test('every no-arg toggle flips a boolean and flips it back', async ({ page }) => {
  test.setTimeout(120000)
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

  expect(TARGETS.length).toBeGreaterThan(5)

  const fails = []
  for (const h of TARGETS) {
    const r = await page.evaluate((h) => {
      if (typeof window[h] !== 'function') return { ok: false, why: 'not-a-function' }
      const b = { ...window.getState() }
      try { window[h]() } catch (e) { void e }
      const a1 = window.getState()
      const flipped = Object.keys(a1).filter((k) => typeof a1[k] === 'boolean' && a1[k] !== b[k])
      if (flipped.length !== 1) return { ok: false, why: 'flipped ' + flipped.length }
      const key = flipped[0]
      const v1 = a1[key]
      try { window[h]() } catch (e) { void e }
      const v2 = window.getState()[key]
      // A live toggle: first call changed the value, second call changed it again.
      // (Exact value persistence can be normalised by a state subscriber, so we assert
      // responsiveness both ways rather than strict false/true restoration.)
      const ok = v1 !== b[key] && v2 !== v1
      window.setState({ [key]: b[key] })
      return { ok, why: ok ? '' : `not-responsive ${key} ${b[key]}->${v1}->${v2}` }
    }, h)
    if (!r.ok) fails.push(`${h}:${r.why}`)
  }

  try { fs.writeFileSync('/tmp/toggle-fails.json', JSON.stringify(fails, null, 2)) } catch { /* ignore */ }
  expect(fails, 'toggles that did not flip a boolean back and forth').toEqual([])
})
