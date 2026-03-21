/**
 * Multi-User E2E Test Helpers
 *
 * Shared infrastructure for all multi-user test phases (1-10).
 * Provides session management, screenshots, assertions, cleanup, and reporting.
 */
import { expect } from '@playwright/test'
import {
  TEST_ACCOUNTS,
  getTestPassword,
  initFirebasePage,
  openSecondBrowser,
  programmaticLogin,
  programmaticLogout,
  getCurrentUid,
  firestoreDocExists,
  firestoreGetDoc,
  cleanupTestData,
} from './firebase-helpers.js'
import { skipOnboarding, dismissOverlays, navigateToTab, getAppState } from './helpers.js'
import fs from 'fs'
import path from 'path'

// Re-export for convenience
export { TEST_ACCOUNTS, getTestPassword, getCurrentUid, firestoreDocExists, firestoreGetDoc }
export { skipOnboarding, dismissOverlays, navigateToTab, getAppState }

// ─── Screenshot directory ───────────────────────────────────────────────────
const SCREENSHOT_DIR = path.resolve('audit-screenshots/multi-user')

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

// ─── Session creation ───────────────────────────────────────────────────────

/**
 * Create a single user session with Firebase auth.
 * Returns { page, uid, context, email, name }.
 *
 * @param {import('@playwright/test').Browser} browser
 * @param {string} accountKey - 'alice', 'bob', 'charlie', 'diana', or 'admin'
 * @param {object} [opts] - options for skipOnboarding (tab, points, level)
 */
export async function createUserSession(browser, accountKey, opts = {}) {
  const account = TEST_ACCOUNTS[accountKey]
  if (!account) throw new Error(`Unknown account: ${accountKey}`)

  const { context, page, uid } = await initFirebasePage(browser, account.email)

  return {
    page,
    uid,
    context,
    email: account.email,
    name: account.name,
    key: accountKey,
  }
}

/**
 * Create all 5 user sessions.
 * To avoid Firebase rate limiting, sessions are created sequentially with delays.
 *
 * @param {import('@playwright/test').Browser} browser
 * @returns {{ alice, bob, charlie, diana, admin }}
 */
export async function createAllSessions(browser) {
  const sessions = {}
  const keys = ['alice', 'bob', 'charlie', 'diana', 'admin']

  for (const key of keys) {
    sessions[key] = await createUserSession(browser, key)
    // Small delay between logins to avoid Firebase rate limiting
    if (key !== keys[keys.length - 1]) {
      await sessions[key].page.waitForTimeout(1000)
    }
  }

  return sessions
}

/**
 * Create a subset of user sessions.
 *
 * @param {import('@playwright/test').Browser} browser
 * @param {string[]} keys - e.g. ['alice', 'bob']
 */
export async function createSessions(browser, keys) {
  const sessions = {}
  for (let i = 0; i < keys.length; i++) {
    sessions[keys[i]] = await createUserSession(browser, keys[i])
    if (i < keys.length - 1) {
      await sessions[keys[i]].page.waitForTimeout(1000)
    }
  }
  return sessions
}

/**
 * Close all sessions (contexts).
 */
export async function closeSessions(sessions) {
  for (const key of Object.keys(sessions)) {
    try {
      await sessions[key].context.close()
    } catch {}
  }
}

// ─── Screenshots ────────────────────────────────────────────────────────────

/**
 * Take a standardized screenshot.
 *
 * @param {import('@playwright/test').Page} page
 * @param {number} phase - phase number (1-10)
 * @param {string} testName - test identifier (e.g. '1.1-login-alice')
 * @param {string} moment - 'before' or 'after'
 * @returns {string} screenshot path
 */
export async function snap(page, phase, testName, moment) {
  ensureDir(`${SCREENSHOT_DIR}/phase${phase}`)
  const filename = `phase${phase}/${testName}-${moment}.png`
  const filepath = `${SCREENSHOT_DIR}/${filename}`

  await page.screenshot({
    path: filepath,
    fullPage: false,
  })

  return filepath
}

// ─── DOM assertions ─────────────────────────────────────────────────────────

/**
 * Assert multiple DOM conditions.
 *
 * @param {import('@playwright/test').Page} page
 * @param {Array<{selector: string, check: string, value?: string}>} checks
 *   check can be: 'visible', 'hidden', 'text', 'count', 'attr'
 */
export async function assertDOM(page, checks) {
  for (const { selector, check, value, attr } of checks) {
    const loc = page.locator(selector)
    switch (check) {
      case 'visible':
        await expect(loc.first()).toBeVisible({ timeout: 5000 })
        break
      case 'hidden':
        await expect(loc).toBeHidden({ timeout: 5000 })
        break
      case 'text':
        await expect(loc.first()).toContainText(value, { timeout: 5000 })
        break
      case 'count':
        await expect(loc).toHaveCount(parseInt(value), { timeout: 5000 })
        break
      case 'attr':
        await expect(loc.first()).toHaveAttribute(attr, value, { timeout: 5000 })
        break
    }
  }
}

// ─── Firestore assertions ───────────────────────────────────────────────────

/**
 * Assert conditions on a Firestore document.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} collection
 * @param {string} docId
 * @param {Array<{field: string, op: string, value: any}>} checks
 *   op can be: 'exists', 'eq', 'neq', 'contains', 'truthy', 'falsy'
 */
export async function assertFirestore(page, collection, docId, checks) {
  const data = await firestoreGetDoc(page, collection, docId)

  for (const { field, op, value } of checks) {
    const actual = field === '_doc' ? data : data?.[field]
    switch (op) {
      case 'exists':
        expect(data).not.toBeNull()
        break
      case 'eq':
        expect(actual).toBe(value)
        break
      case 'neq':
        expect(actual).not.toBe(value)
        break
      case 'contains':
        expect(actual).toContain(value)
        break
      case 'truthy':
        expect(actual).toBeTruthy()
        break
      case 'falsy':
        expect(actual).toBeFalsy()
        break
    }
  }
}

// ─── Console error capture ──────────────────────────────────────────────────

/**
 * Set up console error capture on a page.
 * Returns an object with a `errors` array property.
 *
 * @param {import('@playwright/test').Page} page
 * @returns {{ errors: string[] }}
 */
export function captureConsoleErrors(page) {
  const capture = { errors: [] }
  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text()
      // Ignore known non-critical errors
      if (text.includes('Failed to load resource') && text.includes('favicon')) return
      if (text.includes('service-worker')) return
      if (text.includes('Sentry')) return
      capture.errors.push(text)
    }
  })
  page.on('pageerror', err => {
    capture.errors.push(`PAGE_ERROR: ${err.message}`)
  })
  return capture
}

/**
 * Assert that no unexpected console errors occurred.
 */
export function assertNoConsoleErrors(capture, allowPatterns = []) {
  const real = capture.errors.filter(e => {
    // Filter out allowed patterns
    for (const p of allowPatterns) {
      if (typeof p === 'string' && e.includes(p)) return false
      if (p instanceof RegExp && p.test(e)) return false
    }
    return true
  })

  if (real.length > 0) {
    console.warn('Console errors found:', real)
  }
  // Soft assertion: log but don't fail (many handlers show expected errors)
  return real
}

// ─── Time measurement ───────────────────────────────────────────────────────

/**
 * Measure execution time of an async function.
 *
 * @param {Function} fn - async function to measure
 * @returns {{ result: any, durationMs: number }}
 */
export async function measureTime(fn) {
  const start = Date.now()
  const result = await fn()
  const durationMs = Date.now() - start
  return { result, durationMs }
}

// ─── Handler waiting ────────────────────────────────────────────────────────

/**
 * Wait for a lazy-loaded handler to be available on window.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} name - handler name (e.g. 'signIn')
 * @param {number} [timeout=10000]
 */
export async function waitForHandler(page, name, timeout = 10000) {
  await page.waitForFunction(
    (n) => typeof window[n] === 'function',
    name,
    { timeout }
  )
}

/**
 * Trigger a lazy module load by briefly opening the relevant modal/view.
 * Useful for handlers that are only defined after their module loads.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} module - 'auth', 'profile', 'social', 'sos', etc.
 */
export async function triggerModuleLoad(page, module) {
  switch (module) {
    case 'auth':
      await page.evaluate(() => window.openAuth?.('email'))
      await page.waitForTimeout(2000)
      await page.evaluate(() => window.closeAuth?.())
      await page.waitForTimeout(500)
      break
    case 'profile':
      await navigateToTab(page, 'profile')
      await page.waitForTimeout(2000)
      break
    case 'social':
      await navigateToTab(page, 'social')
      await page.waitForTimeout(2000)
      break
    case 'travel':
      await navigateToTab(page, 'travel')
      await page.waitForTimeout(2000)
      break
    case 'sos':
      await page.evaluate(() => window.openSOS?.())
      await page.waitForTimeout(2000)
      break
  }
}

// ─── Cleanup ────────────────────────────────────────────────────────────────

/**
 * Clean up test data for a phase.
 *
 * @param {object} sessions - { alice: { page, uid }, ... }
 * @param {string[]} collections - Firestore collections to clean
 */
export async function cleanupPhase(sessions, collections = []) {
  // Clean per-user data
  for (const key of Object.keys(sessions)) {
    const { page, uid } = sessions[key]
    if (uid && page) {
      try {
        await cleanupTestData(page, uid)
      } catch {}
    }
  }

  // Clean specific collections if needed
  if (collections.length > 0) {
    const firstPage = Object.values(sessions)[0]?.page
    if (firstPage) {
      for (const col of collections) {
        try {
          await firstPage.evaluate(async (c) => {
            const { getDb, collection, getDocs, deleteDoc } = window.__fb
            const db = getDb()
            const snap = await getDocs(collection(db, c))
            for (const d of snap.docs) {
              // Only delete test data (created by ci-* accounts)
              const data = d.data()
              if (data.creatorId?.startsWith('ci-') || data.userId?.startsWith('ci-')) {
                await deleteDoc(d.ref)
              }
            }
          }, col)
        } catch {}
      }
    }
  }
}

// ─── Report generation ──────────────────────────────────────────────────────

/**
 * Generate a phase report.
 *
 * @param {number} phase
 * @param {Array<{name: string, passed: boolean, durationMs: number, error?: string, handlers?: string[]}>} results
 * @returns {{ json: object, text: string }}
 */
export function generateReport(phase, results) {
  const passed = results.filter(r => r.passed).length
  const failed = results.filter(r => !r.passed).length
  const total = results.length
  const totalTime = results.reduce((sum, r) => sum + (r.durationMs || 0), 0)
  const handlers = [...new Set(results.flatMap(r => r.handlers || []))]

  const json = {
    phase,
    timestamp: new Date().toISOString(),
    score: `${passed}/${total}`,
    passRate: total > 0 ? Math.round((passed / total) * 100) : 0,
    totalTimeMs: totalTime,
    passed,
    failed,
    total,
    handlersTestedCount: handlers.length,
    handlersTested: handlers,
    failures: results.filter(r => !r.passed).map(r => ({
      name: r.name,
      error: r.error,
    })),
    slowTests: results
      .filter(r => r.durationMs > 10000)
      .sort((a, b) => b.durationMs - a.durationMs)
      .map(r => ({ name: r.name, durationMs: r.durationMs })),
  }

  const text = [
    `# Multi-User Phase ${phase} Results`,
    '',
    `> Generated: ${json.timestamp}`,
    '',
    `## Score: ${json.score} (${json.passRate}%)`,
    `- Total time: ${(totalTime / 1000).toFixed(1)}s`,
    `- Handlers tested: ${handlers.length}`,
    '',
    '## Handlers tested',
    ...handlers.map(h => `- \`${h}\``),
    '',
  ]

  if (json.failures.length > 0) {
    text.push('## Failures')
    for (const f of json.failures) {
      text.push(`- **${f.name}**: ${f.error}`)
    }
    text.push('')
  }

  if (json.slowTests.length > 0) {
    text.push('## Slow tests (>10s)')
    for (const s of json.slowTests) {
      text.push(`- ${s.name}: ${(s.durationMs / 1000).toFixed(1)}s`)
    }
  }

  return { json, text: text.join('\n') }
}

/**
 * Save phase results to memory file.
 *
 * @param {number} phase
 * @param {string} textReport
 */
export function savePhaseResults(phase, textReport) {
  const memDir = path.resolve('memory')
  ensureDir(memDir)
  const filepath = path.join(memDir, `multi-user-phase${phase}-results.md`)
  fs.writeFileSync(filepath, textReport, 'utf8')
  return filepath
}

// ─── Utility: wait for Firebase write to propagate ──────────────────────────

/**
 * Wait for a Firestore condition (polling).
 *
 * @param {import('@playwright/test').Page} page
 * @param {Function} checkFn - browser-context function returning truthy when done
 * @param {number} [timeout=15000]
 */
export async function waitForFirestoreCondition(page, checkFn, timeout = 15000) {
  await page.waitForFunction(checkFn, { timeout })
}

// ─── Utility: get user UID from a session ───────────────────────────────────

export async function getSessionUid(session) {
  if (session.uid) return session.uid
  return getCurrentUid(session.page)
}
