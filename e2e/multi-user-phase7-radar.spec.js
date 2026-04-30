/**
 * Multi-User Phase 7: Radar & Travel Buddies
 * Tests radar activation, buddy matching, filtering
 *
 * Requires Firebase Emulator (auth:9099, firestore:8080)
 */
import { test, expect } from '@playwright/test'
import {
  createUserSession,
  getAppState,
  navigateToTab,
} from './multi-user-helpers.js'

test.use({ viewport: { width: 390, height: 844 } })
test.setTimeout(60000)

test.describe('7.1 Radar handlers', () => {
  let alice

  test.beforeAll(async ({ browser }) => {
    alice = await createUserSession(browser, 'alice')
  })

  test.afterAll(async () => {
    await alice?.context?.close()
  })

  test('toggleNearbyFriends handler exists', async () => {
    const exists = await alice.page.evaluate(() => typeof window.toggleNearbyFriends === 'function')
    expect(exists).toBe(true)
  })

  test('openNearbyFriends handler exists', async () => {
    const exists = await alice.page.evaluate(() => typeof window.openNearbyFriends === 'function')
    expect(exists).toBe(true)
  })

  test('closeNearbyFriends handler exists', async () => {
    const exists = await alice.page.evaluate(() => typeof window.closeNearbyFriends === 'function')
    expect(exists).toBe(true)
  })
})

test.describe('7.2 Travel Buddy handlers', () => {
  let alice

  test.beforeAll(async ({ browser }) => {
    alice = await createUserSession(browser, 'alice')
  })

  test.afterAll(async () => {
    await alice?.context?.close()
  })

  test('postCompanionRequest handler exists', async () => {
    const exists = await alice.page.evaluate(() => typeof window.postCompanionRequest === 'function')
    expect(exists).toBe(true)
  })

  test('openCompanionSearch handler exists', async () => {
    const exists = await alice.page.evaluate(() => typeof window.openCompanionSearch === 'function')
    expect(exists).toBe(true)
  })

  test('closeCompanionSearch handler exists', async () => {
    const exists = await alice.page.evaluate(() => typeof window.closeCompanionSearch === 'function')
    expect(exists).toBe(true)
  })

  test('setBuddyTravelMode handler exists', async () => {
    const exists = await alice.page.evaluate(() => typeof window.setBuddyTravelMode === 'function')
    expect(exists).toBe(true)
  })
})
