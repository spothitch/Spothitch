/**
 * Social Deep E2E Tests
 *
 * Tests friend profile, DM UI, groups, events, ambassador, blocking.
 */
import { test, expect } from '@playwright/test'
import { skipOnboarding, navigateToTab } from './helpers.js'

test.describe('Social Deep - Friends', () => {
  test.beforeEach(async ({ page }) => {
    await skipOnboarding(page, { tab: 'social' })
    await page.waitForTimeout(1500)
  })

  test('friend handlers batch check', async ({ page }) => {
    const handlers = [
      'showFriendProfile', 'openFriendProfile',
      'sendFriendRequest', 'addFriendByName',
      'acceptFriendRequest', 'declineFriendRequest', 'removeFriend',
    ]
    const found = await page.evaluate((hs) => hs.filter(h => typeof window[h] === 'function'), handlers)
    expect(found.length).toBeGreaterThanOrEqual(2)
  })
})

test.describe('Social Deep - Direct Messages', () => {
  test.beforeEach(async ({ page }) => {
    await skipOnboarding(page, { tab: 'social' })
    await page.waitForTimeout(1500)
  })

  test('DM handlers batch check', async ({ page }) => {
    const handlers = [
      'openConversation', 'openFriendChat',
      'sendDM', 'sendPrivateMessage',
      'shareDMSpot', 'shareSpotInDM',
      'shareDMPosition', 'sharePositionInDM',
      'deleteDMConversation', 'deleteConversation',
    ]
    const found = await page.evaluate((hs) => hs.filter(h => typeof window[h] === 'function'), handlers)
    expect(found.length).toBeGreaterThanOrEqual(3)
  })
})

test.describe('Social Deep - Groups', () => {
  test.beforeEach(async ({ page }) => {
    await skipOnboarding(page, { tab: 'social' })
    await page.waitForTimeout(1500)
  })

  test('group handlers batch check', async ({ page }) => {
    const handlers = [
      'createGroupConversation', 'openCreateGroupConversation',
      'sendGroupConversationMessage', 'sendGroupMessage',
      'addMemberToGroupConversation', 'addGroupMember',
      'leaveGroupConversation', 'leaveGroup',
    ]
    const found = await page.evaluate((hs) => hs.filter(h => typeof window[h] === 'function'), handlers)
    expect(found.length).toBeGreaterThanOrEqual(2)
  })
})

test.describe('Social Deep - Zone Chat', () => {
  test.beforeEach(async ({ page }) => {
    await skipOnboarding(page, { tab: 'social' })
    await page.waitForTimeout(1500)
  })

  test('zone chat handlers batch check', async ({ page }) => {
    const handlers = ['setSocialTab', 'showFriends']
    const found = await page.evaluate((hs) => hs.filter(h => typeof window[h] === 'function'), handlers)
    expect(found.length).toBeGreaterThanOrEqual(1)
  })
})

test.describe('Social Deep - Events', () => {
  test.beforeEach(async ({ page }) => {
    await skipOnboarding(page, { tab: 'social' })
    await page.waitForTimeout(1500)
  })

  test('event handlers batch check', async ({ page }) => {
    const handlers = [
      'submitCreateEvent', 'openCreateEvent',
      'joinEvent', 'leaveEvent', 'openEventDetail',
      'postEventComment', 'reactToEventComment', 'replyEventComment',
    ]
    const found = await page.evaluate((hs) => hs.filter(h => typeof window[h] === 'function'), handlers)
    expect(found.length).toBeGreaterThanOrEqual(3)
  })
})

test.describe('Social Deep - Blocking & Ambassador', () => {
  test.beforeEach(async ({ page }) => {
    await skipOnboarding(page)
  })

  test('blocking and ambassador handlers batch check', async ({ page }) => {
    const handlers = [
      'confirmBlockUser', 'openBlockModal',
      'confirmUnblockUser', 'openUnblockModal', 'openBlockedUsers',
      'searchAmbassadors', 'searchAmbassadorsByCity', 'registerAmbassador', 'contactAmbassador',
      'openNearbyFriends', 'toggleNearbyFriends',
    ]
    const found = await page.evaluate((hs) => hs.filter(h => typeof window[h] === 'function'), handlers)
    expect(found.length).toBeGreaterThanOrEqual(3)
  })
})
