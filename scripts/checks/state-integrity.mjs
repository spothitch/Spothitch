#!/usr/bin/env node
/**
 * State Integrity Check (Playwright-based)
 *
 * Captures application state (localStorage) at key points during
 * user journeys and verifies nothing gets corrupted:
 * 1. Points don't change unexpectedly
 * 2. Settings don't reset
 * 3. No data loss between navigations
 * 4. State schema is consistent
 * 5. No orphaned or corrupted keys
 *
 * Usage: node scripts/checks/state-integrity.mjs
 */

import { writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..', '..')
const REPORT_DIR = join(ROOT, 'audit-screenshots')
const BASE_URL = process.env.APP_URL || 'http://localhost:3000'

if (!existsSync(REPORT_DIR)) mkdirSync(REPORT_DIR, { recursive: true })

const CAPTURE_STATE_SCRIPT = `() => {
  const state = {}
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key.startsWith('spothitch_')) {
      try {
        state[key] = JSON.parse(localStorage.getItem(key))
      } catch {
        state[key] = localStorage.getItem(key)
      }
    }
  }
  return state
}`

async function runStateAudit() {
  let chromium
  try {
    const pw = await import('playwright')
    chromium = pw.chromium
  } catch {
    console.error('Playwright not installed.')
    process.exit(1)
  }

  const results = {
    snapshots: [],
    mutations: [],
    schemaIssues: [],
    integrity: true,
  }

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    colorScheme: 'dark',
  })

  const INITIAL_STATE = {
    showLanding: false,
    theme: 'dark',
    lang: 'fr',
    activeTab: 'home',
    username: 'StateBot',
    points: 500,
    level: 5,
  }

  await context.addInitScript((initState) => {
    localStorage.setItem('spothitch_onboarding_complete', 'true')
    localStorage.setItem('spothitch_landing_v2', '1')
    localStorage.setItem('spothitch_beta_seen', '1')
    localStorage.setItem('spothitch_cookies_accepted', 'true')
    localStorage.setItem('spothitch_v4_state', JSON.stringify(initState))
    localStorage.setItem('spothitch_v4_cookie_consent', JSON.stringify({
      preferences: { necessary: true, analytics: true, marketing: false },
      timestamp: Date.now(),
      version: '1'
    }))
  }, INITIAL_STATE)

  const page = await context.newPage()
  const pageErrors = []
  page.on('pageerror', err => pageErrors.push(err.message))

  try {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(3000)

    // --- Snapshot 1: Initial state ---
    const snap1 = await page.evaluate(CAPTURE_STATE_SCRIPT)
    results.snapshots.push({ name: 'initial', state: snap1, timestamp: Date.now() })
    console.log('  Snapshot 1: Initial state captured')

    // --- Journey: Navigate all tabs ---
    for (const tab of ['voyage', 'social', 'profile', 'home']) {
      await page.evaluate((t) => {
        document.querySelector(`[data-tab="${t}"]`)?.click()
      }, tab)
      await page.waitForTimeout(1000)
    }

    const snap2 = await page.evaluate(CAPTURE_STATE_SCRIPT)
    results.snapshots.push({ name: 'after_navigation', state: snap2, timestamp: Date.now() })
    console.log('  Snapshot 2: After navigation captured')

    // --- Journey: Open and close SpotDetail ---
    await page.evaluate(() => {
      window.setState?.({ selectedSpot: {
        id: 'state-test-1', lat: 48.8566, lon: 2.3522, rating: 4,
        country: 'FR', city: 'Paris', direction: 'Lyon',
        type: 'city_exit', security: 4, traffic: 3, accessibility: 5,
        description: 'State test', votes: 12, addedBy: 'user1', photos: [],
        destinations: [{direction: 'Lyon', waitTime: 15}]
      }})
    })
    await page.waitForTimeout(2000)

    await page.evaluate(() => {
      window.setState?.({ selectedSpot: null })
    })
    await page.waitForTimeout(1000)

    const snap3 = await page.evaluate(CAPTURE_STATE_SCRIPT)
    results.snapshots.push({ name: 'after_spotdetail', state: snap3, timestamp: Date.now() })
    console.log('  Snapshot 3: After SpotDetail open/close captured')

    // --- Journey: Change theme ---
    await page.evaluate(() => {
      document.querySelector('[data-tab="profile"]')?.click()
    })
    await page.waitForTimeout(1000)

    const snap4 = await page.evaluate(CAPTURE_STATE_SCRIPT)
    results.snapshots.push({ name: 'after_profile', state: snap4, timestamp: Date.now() })
    console.log('  Snapshot 4: After profile tab captured')

    // --- Analysis: Compare snapshots ---
    console.log('\n--- State Mutation Analysis ---')

    // Compare critical keys between snapshots
    const criticalKeys = ['spothitch_v4_state']

    for (let i = 1; i < results.snapshots.length; i++) {
      const prev = results.snapshots[i - 1]
      const curr = results.snapshots[i]

      for (const key of criticalKeys) {
        const prevVal = prev.state[key]
        const currVal = curr.state[key]

        if (!prevVal || !currVal) continue

        // Check points didn't change unexpectedly
        if (typeof prevVal === 'object' && typeof currVal === 'object') {
          if (prevVal.points !== undefined && currVal.points !== undefined) {
            if (prevVal.points !== currVal.points) {
              results.mutations.push({
                step: `${prev.name} → ${curr.name}`,
                key: 'points',
                from: prevVal.points,
                to: currVal.points,
                expected: false,
              })
              console.log(`  [WARN] Points changed: ${prevVal.points} → ${currVal.points} (${prev.name} → ${curr.name})`)
            }
          }

          // Check username didn't disappear
          if (prevVal.username && !currVal.username) {
            results.mutations.push({
              step: `${prev.name} → ${curr.name}`,
              key: 'username',
              from: prevVal.username,
              to: currVal.username,
              expected: false,
            })
            console.log(`  [FAIL] Username lost: "${prevVal.username}" → "${currVal.username}"`)
            results.integrity = false
          }

          // Check theme didn't reset
          if (prevVal.theme && currVal.theme && prevVal.theme !== currVal.theme) {
            // Only flag if we didn't intentionally change it
            results.mutations.push({
              step: `${prev.name} → ${curr.name}`,
              key: 'theme',
              from: prevVal.theme,
              to: currVal.theme,
              expected: false,
            })
            console.log(`  [WARN] Theme changed: "${prevVal.theme}" → "${currVal.theme}"`)
          }

          // Check lang didn't reset
          if (prevVal.lang && currVal.lang && prevVal.lang !== currVal.lang) {
            results.mutations.push({
              step: `${prev.name} → ${curr.name}`,
              key: 'lang',
              from: prevVal.lang,
              to: currVal.lang,
              expected: false,
            })
            console.log(`  [WARN] Language changed: "${prevVal.lang}" → "${currVal.lang}"`)
            results.integrity = false
          }
        }
      }

      // Check no spothitch_ keys were deleted
      const prevKeys = Object.keys(prev.state)
      const currKeys = Object.keys(curr.state)
      const deletedKeys = prevKeys.filter(k => !currKeys.includes(k))

      if (deletedKeys.length > 0) {
        results.mutations.push({
          step: `${prev.name} → ${curr.name}`,
          key: 'deleted_keys',
          from: deletedKeys,
          to: null,
          expected: false,
        })
        console.log(`  [FAIL] Keys deleted: ${deletedKeys.join(', ')}`)
        results.integrity = false
      }
    }

    // --- Schema validation ---
    console.log('\n--- Schema Validation ---')
    const finalState = results.snapshots[results.snapshots.length - 1].state

    // Check v4_state has expected structure
    const v4State = finalState['spothitch_v4_state']
    if (v4State && typeof v4State === 'object') {
      const expectedFields = ['theme', 'lang', 'activeTab']
      for (const field of expectedFields) {
        if (v4State[field] === undefined) {
          results.schemaIssues.push(`v4_state missing field: ${field}`)
          console.log(`  [WARN] v4_state missing: ${field}`)
        }
      }
    } else {
      results.schemaIssues.push('v4_state is not an object or missing')
      console.log('  [FAIL] v4_state is not an object')
    }

    // Check cookie consent has expected structure
    const consent = finalState['spothitch_v4_cookie_consent'] || finalState['spothitch_cookie_consent']
    if (consent && typeof consent === 'object') {
      if (!consent.preferences && !consent.necessary) {
        results.schemaIssues.push('cookie_consent missing preferences')
        console.log('  [WARN] cookie_consent missing preferences')
      }
    }

    if (results.mutations.filter(m => !m.expected).length === 0 && results.schemaIssues.length === 0) {
      console.log('  All checks passed!')
    }

  } catch (err) {
    console.error(`  Failed: ${err.message}`)
    results.integrity = false
  }

  await browser.close()
  return results
}

export default async function checkStateIntegrity(opts = {}) {
  try {
    const results = await runStateAudit()

    console.log('\n' + '='.repeat(60))
    console.log('  STATE INTEGRITY REPORT')
    console.log('='.repeat(60))
    console.log(`  Snapshots: ${results.snapshots.length}`)
    console.log(`  Unexpected mutations: ${results.mutations.filter(m => !m.expected).length}`)
    console.log(`  Schema issues: ${results.schemaIssues.length}`)
    console.log(`  Integrity: ${results.integrity ? 'OK' : 'COMPROMISED'}`)
    console.log('='.repeat(60))

    writeFileSync(
      join(REPORT_DIR, 'state-integrity-report.json'),
      JSON.stringify(results, null, 2)
    )

    const unexpectedMutations = results.mutations.filter(m => !m.expected).length
    const score = Math.max(0, 100 - unexpectedMutations * 15 - results.schemaIssues.length * 10)

    return {
      name: 'State Integrity',
      score,
      maxScore: 100,
      errors: (results.integrity || (unexpectedMutations === 0 && results.schemaIssues.length === 0)) ? [] : ['State integrity compromised during user journey'],
      warnings: [
        ...results.mutations.filter(m => !m.expected).map(m => `${m.key} changed unexpectedly: ${m.from} → ${m.to}`),
        ...results.schemaIssues,
      ],
      stats: {
        snapshots: results.snapshots.length,
        mutations: unexpectedMutations,
        schemaIssues: results.schemaIssues.length,
        integrityOk: results.integrity,
      }
    }
  } catch (err) {
    return {
      name: 'State Integrity',
      score: 0,
      maxScore: 100,
      errors: [`State audit failed: ${err.message}`],
      warnings: [],
      stats: {}
    }
  }
}

if (process.argv[1]?.includes('state-integrity')) {
  checkStateIntegrity().then(result => {
    process.exit(result.score >= 80 ? 0 : 1)
  })
}
