/**
 * Multi-User Phase 4: Guardian mode
 * Tests guardian configuration, activation, check-in, alerts
 *
 * Requires Firebase Emulator (auth:9099, firestore:8080)
 */
import { test, expect } from '@playwright/test'
import {
  createUserSession,
  snap,
  TEST_ACCOUNTS,
  getAppState,
  navigateToTab,
} from './multi-user-helpers.js'

test.use({ viewport: { width: 390, height: 844 } })
test.setTimeout(60000)

test.describe('4.1 Guardian configuration', () => {
  let alice

  test.beforeAll(async ({ browser }) => {
    alice = await createUserSession(browser, 'alice')
  })

  test.afterAll(async () => {
    await alice?.context?.close()
  })

  test('showGuardianModal opens guardian modal', async () => {
    await alice.page.evaluate(() => window.showGuardianModal?.())
    await alice.page.waitForTimeout(2000)
    const state = await getAppState(alice.page, 'showGuardianModal')
    expect(state).toBe(true)
  })

  test('guardian handlers exist', async () => {
    const handlers = [
      'showGuardianModal', 'closeGuardianModal',
      'startGuardianMode', 'stopGuardianMode',
      'guardianQuickCheckin', 'guardianCallEmergency',
    ]
    for (const h of handlers) {
      const exists = await alice.page.evaluate((name) => typeof window[name] === 'function', h)
      expect(exists).toBe(true)
    }
  })

  test('closeGuardianModal closes the modal', async () => {
    await alice.page.evaluate(() => window.showGuardianModal?.())
    await alice.page.waitForTimeout(1000)
    await alice.page.evaluate(() => window.closeGuardianModal?.())
    await alice.page.waitForTimeout(500)
    const state = await getAppState(alice.page, 'showGuardianModal')
    expect(state).toBe(false)
  })
})

test.describe('4.2 Guardian advanced handlers', () => {
  let alice

  test.beforeAll(async ({ browser }) => {
    alice = await createUserSession(browser, 'alice')
  })

  test.afterAll(async () => {
    await alice?.context?.close()
  })

  const advancedHandlers = [
    'guardianAddToJournal',
    'guardianCancelEdit',
    'guardianEditGuardian',
    'guardianSaveDestination',
    'guardianSaveField',
    'guardianSavePlate',
    'guardianSendReply',
  ]

  for (const h of advancedHandlers) {
    test(`${h} handler exists`, async () => {
      const exists = await alice.page.evaluate((name) => typeof window[name] === 'function', h)
      expect(exists).toBe(true)
    })
  }
})
