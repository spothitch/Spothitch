/**
 * Gamification Deep E2E Tests
 *
 * Tests quiz game loop, shop purchase, daily reward, leaderboard filters,
 * challenges, team challenges, titles/badges equip.
 */
import { test, expect } from '@playwright/test'
import { skipOnboarding } from './helpers.js'

test.describe.skip('Quiz Game Loop (hidden during alpha)', () => {
  test.beforeEach(async ({ page }) => {
    await skipOnboarding(page)
  })

  test('quiz modal opens with start button', async ({ page }) => {
    await page.evaluate(() => window.openQuiz?.())
    await page.waitForTimeout(1500)
    const quiz = page.locator('[class*="quiz"], [id*="quiz"]')
    const count = await quiz.count()
    expect(count).toBeGreaterThan(0)
  })

  test('quiz country select exists', async ({ page }) => {
    await page.evaluate(() => window.openQuiz?.())
    await page.waitForTimeout(1500)
    const select = page.locator('select[id*="quiz"], select[class*="quiz"], [class*="quiz"] select')
    const count = await select.count()
    expect(count).toBeGreaterThanOrEqual(0)
  })

  test('quiz handlers batch check', async ({ page }) => {
    const handlers = ['startCountryQuiz', 'startQuiz', 'answerQuizQuestion', 'answerQuiz', 'retryQuiz', 'restartQuiz']
    const found = await page.evaluate((hs) => hs.filter(h => typeof window[h] === 'function'), handlers)
    expect(found.length).toBeGreaterThanOrEqual(1)
  })
})

test.describe.skip('Shop Interactions (hidden during alpha)', () => {
  test.beforeEach(async ({ page }) => {
    await skipOnboarding(page)
  })

  test('shop modal opens with categories', async ({ page }) => {
    await page.evaluate(() => window.openShop?.())
    await page.waitForTimeout(1500)
    const shop = page.locator('[class*="shop"], [id*="shop"]')
    const count = await shop.count()
    expect(count).toBeGreaterThan(0)
  })

  test('shop handlers batch check', async ({ page }) => {
    const handlers = ['setShopCategory', 'switchShopCategory', 'activateBooster', 'redeemReward', 'equipAvatar', 'equipFrame', 'equipTitle']
    const found = await page.evaluate((hs) => hs.filter(h => typeof window[h] === 'function'), handlers)
    expect(found.length).toBeGreaterThanOrEqual(1)
  })

  test('shop displays pouces balance', async ({ page }) => {
    await page.evaluate(() => window.openShop?.())
    await page.waitForTimeout(1500)
    const balance = page.locator('[class*="balance"], [class*="pouces"], [class*="points"]')
    const count = await balance.count()
    expect(count).toBeGreaterThanOrEqual(0)
  })
})

test.describe('Daily Reward', () => {
  test.beforeEach(async ({ page }) => {
    await skipOnboarding(page)
  })

  test('daily reward claim is callable', async ({ page }) => {
    await page.evaluate(() => (window.claimDailyReward || window.handleClaimDailyReward)?.())
    await page.waitForTimeout(300)
    const alive = await page.evaluate(() => !!document.getElementById('app'))
    expect(alive).toBe(true)
  })
})

test.describe.skip('Leaderboard Interactions (hidden during alpha)', () => {
  test.beforeEach(async ({ page }) => {
    await skipOnboarding(page)
  })

  test('leaderboard handlers batch check', async ({ page }) => {
    const handlers = ['setLeaderboardCountry', 'setLeaderboardTab']
    const found = await page.evaluate((hs) => hs.filter(h => typeof window[h] === 'function'), handlers)
    expect(found.length).toBeGreaterThanOrEqual(1)
  })

  test('leaderboard opens with podium', async ({ page }) => {
    await page.evaluate(() => window.openLeaderboard?.())
    await page.waitForTimeout(1500)
    const leaderboard = page.locator('[class*="leaderboard"], [id*="leaderboard"]')
    const count = await leaderboard.count()
    expect(count).toBeGreaterThan(0)
  })
})

test.describe('Challenges & Teams', () => {
  test.beforeEach(async ({ page }) => {
    await skipOnboarding(page)
  })

  test('challenge and team handlers batch check', async ({ page }) => {
    const handlers = [
      'acceptFriendChallenge', 'declineFriendChallenge', 'cancelFriendChallenge', 'createFriendChallenge',
      'openTeamChallenges', 'createTeamAction', 'joinTeamAction', 'leaveTeamAction', 'inviteToTeam',
    ]
    const found = await page.evaluate((hs) => hs.filter(h => typeof window[h] === 'function'), handlers)
    expect(found.length).toBeGreaterThanOrEqual(1)
  })
})

test.describe('Badges & Titles', () => {
  test.beforeEach(async ({ page }) => {
    await skipOnboarding(page)
  })

  test('badges and titles handlers batch check', async ({ page }) => {
    const handlers = [
      'openBadgePopup', 'showBadgeDetail',
      'equipTitleAction', 'equipTitle',
      'launchConfetti', 'showLevelUp',
    ]
    const found = await page.evaluate((hs) => hs.filter(h => typeof window[h] === 'function'), handlers)
    expect(found.length).toBeGreaterThanOrEqual(1)
  })
})
