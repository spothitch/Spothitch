/**
 * Multi-User Phase 6: Gamification
 * Tests challenges, leaderboard, events between users
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

test.describe('6.1 Gamification handlers', () => {
  let alice

  test.beforeAll(async ({ browser }) => {
    alice = await createUserSession(browser, 'alice')
  })

  test.afterAll(async () => {
    await alice?.context?.close()
  })

  test('openLeaderboard handler exists', async () => {
    const exists = await alice.page.evaluate(() => typeof window.openLeaderboard === 'function')
    expect(exists).toBe(true)
  })

  test('openChallenges handler exists', async () => {
    const exists = await alice.page.evaluate(() => typeof window.openChallenges === 'function')
    expect(exists).toBe(true)
  })

  test('openBadges handler exists', async () => {
    const exists = await alice.page.evaluate(() => typeof window.openBadges === 'function')
    expect(exists).toBe(true)
  })

  test('openStats handler exists', async () => {
    const exists = await alice.page.evaluate(() => typeof window.openStats === 'function')
    expect(exists).toBe(true)
  })

  test('openShop handler exists', async () => {
    const exists = await alice.page.evaluate(() => typeof window.openShop === 'function')
    expect(exists).toBe(true)
  })

  test('openQuiz handler exists', async () => {
    const exists = await alice.page.evaluate(() => typeof window.openQuiz === 'function')
    expect(exists).toBe(true)
  })

  test('openDailyReward handler exists', async () => {
    const exists = await alice.page.evaluate(() => typeof window.openDailyReward === 'function')
    expect(exists).toBe(true)
  })

  test('openTitles handler exists', async () => {
    const exists = await alice.page.evaluate(() => typeof window.openTitles === 'function')
    expect(exists).toBe(true)
  })
})

test.describe('6.2 Team challenges', () => {
  let alice

  test.beforeAll(async ({ browser }) => {
    alice = await createUserSession(browser, 'alice')
  })

  test.afterAll(async () => {
    await alice?.context?.close()
  })

  test('openTeamChallenges handler exists', async () => {
    const exists = await alice.page.evaluate(() => typeof window.openTeamChallenges === 'function')
    expect(exists).toBe(true)
  })

  test('openCreateTeam handler exists', async () => {
    const exists = await alice.page.evaluate(() => typeof window.openCreateTeam === 'function')
    expect(exists).toBe(true)
  })
})
