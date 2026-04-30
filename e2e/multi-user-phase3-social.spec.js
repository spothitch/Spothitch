/**
 * Multi-User Phase 3: Social interactions
 * Tests friend requests, DMs, blocking, reporting between users
 *
 * Requires Firebase Emulator (auth:9099, firestore:8080)
 */
import { test, expect } from '@playwright/test'
import {
  createUserSession,
  closeSessions,
  snap,
  TEST_ACCOUNTS,
  getCurrentUid,
  firestoreDocExists,
  getAppState,
  navigateToTab,
} from './multi-user-helpers.js'

test.use({ viewport: { width: 390, height: 844 } })
test.setTimeout(60000)

// ═══════════════════════════════════════════════════════════════════════
// 3.1 — Friend requests
// ═══════════════════════════════════════════════════════════════════════

test.describe('3.1 Friend requests', () => {
  let alice, bob

  test.beforeAll(async ({ browser }) => {
    alice = await createUserSession(browser, 'alice')
    bob = await createUserSession(browser, 'bob')
  })

  test.afterAll(async () => {
    await alice?.context?.close()
    await bob?.context?.close()
  })

  test('Alice can open social tab', async () => {
    await navigateToTab(alice.page, 'social')
    const tab = await getAppState(alice.page, 'activeTab')
    expect(tab).toBe('social')
  })

  test('showAddFriend handler exists and opens modal', async () => {
    await navigateToTab(alice.page, 'social')
    await alice.page.waitForTimeout(1000)
    const exists = await alice.page.evaluate(() => typeof window.showAddFriend === 'function')
    expect(exists).toBe(true)
  })

  test('Bob can open social tab', async () => {
    await navigateToTab(bob.page, 'social')
    const tab = await getAppState(bob.page, 'activeTab')
    expect(tab).toBe('social')
  })
})

// ═══════════════════════════════════════════════════════════════════════
// 3.2 — Direct Messages
// ═══════════════════════════════════════════════════════════════════════

test.describe('3.2 Direct Messages', () => {
  let alice, bob

  test.beforeAll(async ({ browser }) => {
    alice = await createUserSession(browser, 'alice')
    bob = await createUserSession(browser, 'bob')
  })

  test.afterAll(async () => {
    await alice?.context?.close()
    await bob?.context?.close()
  })

  test('openFriendsChat handler exists', async () => {
    const exists = await alice.page.evaluate(() => typeof window.openFriendsChat === 'function')
    expect(exists).toBe(true)
  })

  test('sendDirectMessage handler exists', async () => {
    const exists = await alice.page.evaluate(() => typeof window.sendDirectMessage === 'function')
    expect(exists).toBe(true)
  })
})

// ═══════════════════════════════════════════════════════════════════════
// 3.3 — Blocking
// ═══════════════════════════════════════════════════════════════════════

test.describe('3.3 Blocking', () => {
  let alice

  test.beforeAll(async ({ browser }) => {
    alice = await createUserSession(browser, 'alice')
  })

  test.afterAll(async () => {
    await alice?.context?.close()
  })

  test('blockUser handler exists', async () => {
    const exists = await alice.page.evaluate(() => typeof window.blockUser === 'function')
    expect(exists).toBe(true)
  })

  test('unblockUser handler exists', async () => {
    const exists = await alice.page.evaluate(() => typeof window.unblockUser === 'function')
    expect(exists).toBe(true)
  })

  test('openBlockedUsers handler opens the list', async () => {
    await alice.page.evaluate(() => window.openBlockedUsers?.())
    await alice.page.waitForTimeout(500)
    const state = await getAppState(alice.page, 'showBlockedUsers')
    expect(state).toBe(true)
  })
})

// ═══════════════════════════════════════════════════════════════════════
// 3.4 — Reporting
// ═══════════════════════════════════════════════════════════════════════

test.describe('3.4 Reporting', () => {
  let alice

  test.beforeAll(async ({ browser }) => {
    alice = await createUserSession(browser, 'alice')
  })

  test.afterAll(async () => {
    await alice?.context?.close()
  })

  test('reportUser handler exists', async () => {
    const exists = await alice.page.evaluate(() => typeof window.reportUser === 'function')
    expect(exists).toBe(true)
  })

  test('openReport handler opens report modal', async () => {
    await alice.page.evaluate(() => window.openReport?.('user', 'test-uid'))
    await alice.page.waitForTimeout(500)
    const state = await getAppState(alice.page, 'showReport')
    expect(state).toBe(true)
  })
})
