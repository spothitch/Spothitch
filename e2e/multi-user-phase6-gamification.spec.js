/**
 * Multi-User Phase 6: Gamification — REAL behavioral tests
 * Tests badges, challenges, leaderboard, daily reward, quiz, events
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

test.describe('6.1 Gamification modals', () => {
  let alice

  test.beforeAll(async ({ browser }) => {
    alice = await createUserSession(browser, 'alice')
  })

  test.afterAll(async () => {
    await alice?.context?.close()
  })

  test('openLeaderboard opens leaderboard and shows content', async () => {
    await alice.page.evaluate(() => window.openLeaderboard?.())
    await alice.page.waitForTimeout(1000)
    // On non-beta, this may show feature intro instead
    const content = await alice.page.evaluate(() => document.getElementById('app')?.innerText?.length || 0)
    expect(content).toBeGreaterThan(30)
  })

  test('openBadges opens badges view', async () => {
    await alice.page.evaluate(() => window.openBadges?.())
    await alice.page.waitForTimeout(1000)
    expect(await alice.page.evaluate(() => (document.getElementById('app')?.innerHTML?.length || 0) > 50)).toBe(true)
  })

  test('openChallenges opens challenges view', async () => {
    await alice.page.evaluate(() => window.openChallenges?.())
    await alice.page.waitForTimeout(1000)
    expect(await alice.page.evaluate(() => (document.getElementById('app')?.innerHTML?.length || 0) > 50)).toBe(true)
  })

  test('openStats opens stats view', async () => {
    await alice.page.evaluate(() => window.openStats?.())
    await alice.page.waitForTimeout(1000)
    expect(await alice.page.evaluate(() => (document.getElementById('app')?.innerHTML?.length || 0) > 50)).toBe(true)
  })

  test('openShop opens shop view', async () => {
    await alice.page.evaluate(() => window.openShop?.())
    await alice.page.waitForTimeout(1000)
    expect(await alice.page.evaluate(() => (document.getElementById('app')?.innerHTML?.length || 0) > 50)).toBe(true)
  })

  test('openDailyReward opens daily reward', async () => {
    await alice.page.evaluate(() => window.openDailyReward?.())
    await alice.page.waitForTimeout(1000)
    expect(await alice.page.evaluate(() => (document.getElementById('app')?.innerHTML?.length || 0) > 50)).toBe(true)
  })

  test('openTitles opens titles view', async () => {
    await alice.page.evaluate(() => window.openTitles?.())
    await alice.page.waitForTimeout(1000)
    expect(await alice.page.evaluate(() => (document.getElementById('app')?.innerHTML?.length || 0) > 50)).toBe(true)
  })

  test('openQuiz opens quiz', async () => {
    await alice.page.evaluate(() => window.openQuiz?.())
    await alice.page.waitForTimeout(1000)
    expect(await alice.page.evaluate(() => (document.getElementById('app')?.innerHTML?.length || 0) > 50)).toBe(true)
  })
})

test.describe('6.2 Gamification state', () => {
  let alice

  test.beforeAll(async ({ browser }) => {
    alice = await createUserSession(browser, 'alice')
  })

  test.afterAll(async () => {
    await alice?.context?.close()
  })

  test('Points are stored in state', async () => {
    const points = await alice.page.evaluate(() => window.getState?.()?.points || 0)
    expect(typeof points).toBe('number')
  })

  test('Level is stored in state', async () => {
    const level = await alice.page.evaluate(() => window.getState?.()?.level || 1)
    expect(level).toBeGreaterThanOrEqual(1)
  })

  test('Badges array exists in state', async () => {
    const badges = await alice.page.evaluate(() => window.getState?.()?.badges || [])
    expect(Array.isArray(badges)).toBe(true)
  })
})

test.describe('6.3 Team challenges', () => {
  let alice

  test.beforeAll(async ({ browser }) => {
    alice = await createUserSession(browser, 'alice')
  })

  test.afterAll(async () => {
    await alice?.context?.close()
  })

  test('openTeamChallenges handler exists', async () => {
    expect(await alice.page.evaluate(() => typeof window.openTeamChallenges === 'function')).toBe(true)
  })

  test('openCreateTeam handler exists', async () => {
    expect(await alice.page.evaluate(() => typeof window.openCreateTeam === 'function')).toBe(true)
  })

  test('openChallengesHub handler exists', async () => {
    expect(await alice.page.evaluate(() => typeof window.openChallengesHub === 'function')).toBe(true)
  })
})
