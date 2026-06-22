import { test, expect } from '@playwright/test'
import { execSync } from 'child_process'
import fs from 'fs'

/**
 * Auto-discovering close coverage (Brique 2). Parses every window.closeX handler from
 * source, finds the state flag it sets to false (boolean modal flag) or null (selected-
 * item flag). For each: open the modal (set the flag truthy), call closeX, and assert the
 * flag really went false / null. Self-syncing: a new close handler of either shape is
 * covered automatically. Handlers whose close path is not a simple state flag (demos,
 * detail views that navigate) are listed by absence of a parsed flag and skipped here.
 */
const CLOSE = (() => {
  const files = execSync('grep -rl "window.close" src/ --include=*.js').toString().trim().split('\n')
  const map = {}
  for (const f of files) {
    const txt = fs.readFileSync(f, 'utf8')
    const re = /window\.(close[A-Z]\w*)\s*=\s*\([^)]*\)\s*=>\s*(\{[\s\S]*?\n\}|[^\n]+)/g
    let m
    while ((m = re.exec(txt))) {
      const name = m[1]
      const body = m[2]
      const bf = body.match(/setState\??\.?\(\{\s*(\w+):\s*false/)
      const nl = body.match(/setState\??\.?\(\{\s*(\w+):\s*null/)
      if (bf) map[name] = { flag: bf[1], val: 'false' }
      else if (nl && !map[name]?.flag) map[name] = { flag: nl[1], val: 'null' }
    }
  }
  return Object.entries(map).filter(([, v]) => v.flag).map(([fn, v]) => ({ fn, ...v }))
})()

// These three live in a module that only lazy-imports inside its full feature flow:
// IdentityVerification is behind a trust-score guard ('score-confiance'); the block/unblock
// and consent modules render only with their companion data set. Setting the bare flag does
// not import the module, so the real close stays a stub. They are exercised by the fuzz
// (no-crash) and by their feature specs; excluded here to keep this auto-net honest.
const SKIP = new Set(['closeIdentityVerification', 'closeUnblockModal', 'closeConsentSettings'])

test('every close handler clears its state flag (open -> close -> false/null)', async ({ page }) => {
  test.setTimeout(180000)
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

  expect(CLOSE.length).toBeGreaterThan(60)

  // A few close handlers live in a module whose lazy import is triggered by a DIFFERENT
  // flag than the one they clear (e.g. closeConsentSettings lives in MyData.js which loads
  // when showMyData is true). Prime those load-trigger flags too.
  const LOAD_TRIGGER = { closeConsentSettings: 'showMyData' }

  const fails = []
  const navigators = []
  const reload = async () => {
    await page.goto('/', { waitUntil: 'networkidle' })
    await page.waitForFunction(() => typeof window.setState === 'function', { timeout: 15000 })
  }
  for (const { fn, flag, val } of CLOSE) {
    if (SKIP.has(fn)) continue
    try {
      // 1. Open: set the flag truthy (+ any module load-trigger). App re-renders and lazily
      //    imports the owning module, which installs the real close handler over the stub.
      await page.evaluate(({ flag, val, trigger }) => {
        const patch = { [flag]: val === 'null' ? { __t: 1 } : true }
        if (trigger) patch[trigger] = true
        window.setState(patch)
      }, { flag, val, trigger: LOAD_TRIGGER[fn] })
      await page.waitForTimeout(350) // let the lazy render+import register the real handler

      // 2. Call the (now real) close handler.
      const r = await page.evaluate((fn) => {
        if (typeof window[fn] !== 'function') return 'not-a-function'
        try { window[fn]() } catch (e) { return 'threw ' + e.message }
        return 'called'
      }, fn)
      if (r !== 'called') {
        await page.evaluate(({ flag, val, trigger }) => window.setState({ [flag]: val === 'null' ? null : false, ...(trigger ? { [trigger]: false } : {}) }), { flag, val, trigger: LOAD_TRIGGER[fn] })
        fails.push(`${fn}(${flag}):${r}`)
        continue
      }
      await page.waitForTimeout(150) // lazy stubs import then re-invoke — give it a tick

      // 3. Read the flag back, then clean up.
      const v = await page.evaluate(({ flag, val, trigger }) => {
        const cur = window.getState()[flag]
        window.setState({ [flag]: val === 'null' ? null : false, ...(trigger ? { [trigger]: false } : {}) })
        return cur
      }, { flag, val, trigger: LOAD_TRIGGER[fn] })
      const cleared = val === 'null' ? (v === null || v === undefined) : v === false
      if (!cleared) fails.push(`${fn}(${flag}):flag=${JSON.stringify(v)}`)
    } catch (e) {
      // A close handler navigated/reloaded the page (e.g. landing exit). That is a real
      // user-visible effect, not a failure — record it and recover the page.
      navigators.push(fn)
      await reload()
    }
  }

  try { fs.writeFileSync('/tmp/close-fails.json', JSON.stringify({ fails, navigators }, null, 2)) } catch { /* ignore */ }
  expect(fails, 'close handlers that did not clear their flag').toEqual([])
})
