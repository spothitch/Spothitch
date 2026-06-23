import { test, expect } from '@playwright/test'
import { execSync } from 'child_process'
import fs from 'fs'

/**
 * Auto-discovering setter coverage (Brique 2). Every window.setX writes its argument into
 * state. This parses each setter's arity from source, calls it with sentinel args, and
 * asserts at least one state key now holds the sentinel value. Self-syncing: new setters
 * are covered automatically. Setters that derive/transform the arg (so the raw sentinel is
 * never stored) are listed in TRANSFORMS and only checked for "some state changed".
 */
const SETTERS = (() => {
  const out = execSync("grep -rhoP 'window\\.set[A-Z]\\w* = \\([^)]*\\) =>' src/ --include=*.js").toString()
  const map = {}
  for (const m of out.matchAll(/window\.(set\w+) = \(([^)]*)\) =>/g)) {
    const name = m[1]
    const argc = m[2].trim() === '' ? 0 : m[2].split(',').length
    if (!(name in map)) map[name] = argc
  }
  return Object.entries(map).map(([fn, argc]) => ({ fn, argc }))
})()

// Setters that transform their arg (index→value, slider→minutes, mode→derived flags) so
// the raw sentinel never lands verbatim — we only require that they change some state.
const TRANSFORMS = new Set(['setWaitTime', 'setExperienceDate', 'setThemeMode'])

// Setters living in a lazily-imported, guard-gated module (identity verification, social
// feed) that is not loaded in the bare app shell. Covered by their feature specs + fuzz.
// setAuthMode stores asynchronously (dynamic import) and is flaky inside the busy loop;
// it has its own dedicated test below.
const SKIP = new Set(['setVerificationStep', 'setDocumentType', 'setFeedFilter', 'setAuthMode'])

test('every setter writes its argument into state', async ({ page }) => {
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

  expect(SETTERS.length).toBeGreaterThan(20)

  const fails = []
  for (const { fn, argc } of SETTERS) {
    if (SKIP.has(fn)) continue
    const r = await page.evaluate(async ({ fn, argc, transform }) => {
      if (typeof window[fn] !== 'function') return { ok: false, why: 'not-a-function' }
      // Snapshot BOTH stores: global state and the add-spot form buffer (some setters
      // write there instead of getState).
      const snap = () => JSON.stringify(window.getState()) + '|' + JSON.stringify(window.spotFormData || {})
      const before = snap()
      const beforeObj = window.getState()
      // Sentinel args. The LAST arg is the "value"; earlier args are keys/criteria.
      const args = []
      for (let i = 0; i < Math.max(argc, 1); i++) args.push(i === Math.max(argc, 1) - 1 ? '__VAL__' : '__K' + i + '__')
      try { window[fn](...args) } catch (e) { return { ok: false, why: 'threw ' + e.message } }
      // Some setters store asynchronously (dynamic import then setState) — let it settle.
      await new Promise((r) => setTimeout(r, 300))
      const after = window.getState()
      if (transform) {
        const changed = snap() !== before
        return { ok: changed, why: changed ? '' : 'no-change' }
      }
      const deepHasSentinel = (obj) => Object.keys(obj || {}).some((k) => {
        if (obj[k] === '__VAL__') return true
        const v = obj[k]
        if (v && typeof v === 'object') return Object.values(v).includes('__VAL__')
        return false
      })
      const stored = deepHasSentinel(after) || deepHasSentinel(window.spotFormData)
      // restore top-level state best effort
      const restore = {}
      Object.keys(after).forEach((k) => { if (after[k] !== beforeObj[k]) restore[k] = beforeObj[k] })
      window.setState(restore)
      return { ok: stored, why: stored ? '' : 'sentinel-not-stored' }
    }, { fn, argc, transform: TRANSFORMS.has(fn) })
    if (!r.ok) fails.push(`${fn}(${argc}):${r.why}`)
  }

  try { fs.writeFileSync('/tmp/set-fails.json', JSON.stringify(fails, null, 2)) } catch { /* ignore */ }
  expect(fails, 'setters that did not store their argument').toEqual([])
})

test('setAuthMode stores the auth mode in state (async import)', async ({ page }) => {
  await page.addInitScript(() => {
    try {
      localStorage.setItem('spothitch_welcomed', 'true')
      localStorage.setItem('spothitch_landing_seen', 'true')
    } catch { /* ignore */ }
  })
  await page.goto('/', { waitUntil: 'load', timeout: 30000 }).catch(() => {})
  await page.waitForFunction(() => typeof window.getState === 'function', { timeout: 15000 })
  await page.evaluate(() => window.setAuthMode('signup'))
  await page.waitForFunction(() => window.getState().authMode === 'signup', { timeout: 5000 })
  await page.evaluate(() => window.setAuthMode('login'))
  await page.waitForFunction(() => window.getState().authMode === 'login', { timeout: 5000 })
})
