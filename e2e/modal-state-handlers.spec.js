import { test, expect } from '@playwright/test'
import { execSync } from 'child_process'

/**
 * Modal close handlers — REAL state effect (Brique 2).
 *
 * Self-synchronising: extracts every `window.closeX = () => setState({ showX: false })`
 * from the source at run time. For each handler it OPENS the modal first (setState flag
 * true — this also lazy-loads the modal module, replacing the lazy-stub close handler
 * with the real one), then triggers closeX() and verifies the flag really flipped to
 * false. New close handlers of this shape are covered automatically.
 */
function pairs(re, value) {
  const out = execSync(
    `grep -rhoP "window\\.${re} = \\(\\w*\\) => setState\\(\\{ \\w+: ${value}" src/ --include=*.js`,
  ).toString()
  const m = [...out.matchAll(new RegExp(`window\\.(\\w+) = .*setState\\(\\{ (\\w+): ${value}`, 'g'))]
  return [...new Map(m.map((x) => [x[1], { fn: x[1], flag: x[2] }])).values()]
}

const CLOSE = pairs('close[A-Z]\\w*', 'false')

test('every close* handler closes its modal (open -> close -> flag false)', async ({ page }) => {
  await page.addInitScript(() => {
    try {
      localStorage.setItem('spothitch_welcomed', 'true')
      localStorage.setItem('spothitch_age_verified', 'true')
      localStorage.setItem('spothitch_cookie_consent', 'true')
      localStorage.setItem('spothitch_landing_seen', 'true')
    } catch { /* ignore */ }
  })
  await page.goto('/', { waitUntil: 'networkidle' })
  await page.waitForFunction(() => typeof window.setState === 'function' && typeof window.getState === 'function', { timeout: 15000 })

  expect(CLOSE.length).toBeGreaterThan(30)

  const fails = []
  for (const { fn, flag } of CLOSE) {
    // 1. Open the modal — this also lazy-loads its module and installs the real closeX.
    await page.evaluate((f) => window.setState({ [f]: true }), flag)
    await page.waitForTimeout(120)
    // 2. Trigger close + read the flag back.
    const v = await page.evaluate(({ fn, flag }) => {
      if (typeof window[fn] !== 'function') return 'not-a-function'
      try { window[fn]() } catch (e) { return 'threw ' + e.message }
      return window.getState()[flag]
    }, { fn, flag })
    if (v !== false) fails.push(`${fn}:${JSON.stringify(v)}`)
    // reset so a stuck-open modal doesn't bleed into the next handler
    await page.evaluate((f) => window.setState({ [f]: false }), flag)
  }

  expect(fails, 'close handlers that did NOT set their flag to false').toEqual([])
})
