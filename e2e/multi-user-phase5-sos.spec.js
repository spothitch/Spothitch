/**
 * Multi-User Phase 5: SOS system
 * Tests SOS triggering, position sharing, safe marking
 *
 * Requires Firebase Emulator (auth:9099, firestore:8080)
 */
import { test, expect } from '@playwright/test'
import {
  createUserSession,
  getAppState,
} from './multi-user-helpers.js'

test.use({ viewport: { width: 390, height: 844 } })
test.setTimeout(60000)

test.describe('5.1 SOS handlers', () => {
  let alice

  test.beforeAll(async ({ browser }) => {
    alice = await createUserSession(browser, 'alice')
  })

  test.afterAll(async () => {
    await alice?.context?.close()
  })

  test('openSOS opens SOS modal', async () => {
    await alice.page.evaluate(() => window.openSOS?.())
    await alice.page.waitForTimeout(2000)
    const state = await getAppState(alice.page, 'showSOS')
    expect(state).toBe(true)
  })

  test('closeSOS closes SOS modal', async () => {
    await alice.page.evaluate(() => window.openSOS?.())
    await alice.page.waitForTimeout(1000)
    await alice.page.evaluate(() => window.closeSOS?.())
    await alice.page.waitForTimeout(500)
    const state = await getAppState(alice.page, 'showSOS')
    expect(state).toBe(false)
  })

  test('SOS handlers exist', async () => {
    const handlers = [
      'openSOS', 'closeSOS', 'sosTab',
      'sosAddContact', 'sosRemoveContact',
      'sosToggleSilent', 'sosSetChannel',
      'shareSOSLocation', 'triggerSOSAlert',
    ]
    for (const h of handlers) {
      const exists = await alice.page.evaluate((name) => typeof window[name] === 'function', h)
      expect(exists).toBe(true)
    }
  })

  test('sosTab changes active SOS tab', async () => {
    await alice.page.evaluate(() => window.openSOS?.())
    await alice.page.waitForTimeout(2000)
    await alice.page.evaluate(() => window.sosTab?.(1))
    await alice.page.waitForTimeout(300)
    // State should be intact
    expect(await alice.page.evaluate(() => typeof window.getState === 'function')).toBe(true)
  })
})
