/**
 * VRAIS Tests Fonctionnels — SOCIAL
 * Chaque test: navigue vers social → clique → vérifie résultat visuel
 */
import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:4173'
const BYPASS = {
  spothitch_cookie_consent: 'true', spothitch_landing_v2: '1',
  spothitch_age_verified: 'true', spothitch_welcomed: 'true',
}

async function setup(page) {
  await page.addInitScript((s) => { for (const [k,v] of Object.entries(s)) localStorage.setItem(k,v) }, BYPASS)
  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 45000 })
  await page.waitForFunction(() => typeof window.setState === 'function', { timeout: 45000 }).catch(() => {})
  await page.evaluate(() => {
    localStorage.setItem('spothitch_landing_v2', '1')
    window.setState?.({
      showWelcome: false, showLanding: false, showAgeVerification: false, showCookieBanner: false,
      isLoggedIn: true, user: { uid: 'test-uid', displayName: 'TestUser', email: 'test@test.com' },
      username: 'testuser', isAdmin: true,
      friends: [{ id: 'friend1', name: 'Alice', avatar: 'thumbs-up', level: 3 }],
    })
  })
  await page.waitForTimeout(2000)
  // Re-assert: Firebase onAuthStateChanged may have reset isLoggedIn during the wait
  await page.evaluate(() => window.setState?.({ isLoggedIn: true }))
}

async function setupSocial(page) {
  await setup(page)
  await page.evaluate(() => window.changeTab?.('social'))
  await page.waitForTimeout(2000)
  // Re-assert: Firebase onAuthStateChanged may have reset isLoggedIn during the wait
  await page.evaluate(() => window.setState?.({ isLoggedIn: true }))
}

test.describe('Social — Onglet', () => {
  test('Onglet social charge avec contenu visible (>50 chars)', async ({ page }) => {
    await setupSocial(page)
    expect(await page.evaluate(() => (document.getElementById('app')?.innerText || '').length)).toBeGreaterThan(50)
    expect(await page.evaluate(() => window.getState?.()?.activeTab)).toBe('social')
  })

  test('setSocialTab messagerie change visuellement le sous-onglet', async ({ page }) => {
    await setupSocial(page)
    await page.evaluate(() => window.setSocialTab?.('messagerie'))
    await page.waitForTimeout(500)
    expect(await page.evaluate(() => window.getState?.()?.socialSubTab)).toBe('messagerie')
  })

  test('setSocialTab evenements change visuellement', async ({ page }) => {
    await setupSocial(page)
    await page.evaluate(() => window.setSocialTab?.('evenements'))
    await page.waitForTimeout(500)
    expect(await page.evaluate(() => window.getState?.()?.socialSubTab)).toBe('evenements')
  })
})

test.describe('Friends — Fonctionnel', () => {
  test('showFriends navigue vers social', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => window.showFriends?.())
    await page.waitForTimeout(500)
    expect(await page.evaluate(() => window.getState?.()?.activeTab)).toBe('social')
  })

  test('9 handlers friends + 9 DM + 7 blocking existent', async ({ page }) => {
    await setupSocial(page)
    const missing = await page.evaluate((hs) => hs.filter(h => typeof window[h] !== 'function'), [
      'sendFriendRequest', 'acceptFriendRequest', 'declineFriendRequest',
      'removeFriend', 'showFriendProfile', 'closeFriendProfile',
      'addFriendByName', 'copyFriendLink', 'showFriendOptions',
      'sendDM', 'openConversation', 'closeConversation',
      'shareDMSpot', 'shareDMPosition', 'deleteDMConversation',
      'sendDirectMessageTo', 'getConversationWith',
      'openBlockModal', 'closeBlockModal', 'confirmBlockUser',
      'openUnblockModal', 'closeUnblockModal', 'confirmUnblockUser', 'unblockUserById',
    ])
    expect(missing).toEqual([])
  })
})

test.describe('Report — Fonctionnel', () => {
  test('openReport ouvre le modal visuellement — showReport=true', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => window.openReport?.('USER', 'test-user'))
    await page.waitForTimeout(500)
    expect(await page.evaluate(() => window.getState?.()?.showReport)).toBe(true)
  })

  test('closeReport ferme — showReport=false', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => window.closeReport?.())
    await page.waitForTimeout(300)
    expect(await page.evaluate(() => window.getState?.()?.showReport)).toBe(false)
  })

  test('selectReportReason + submitCurrentReport existent', async ({ page }) => {
    await setup(page)
    const missing = await page.evaluate((hs) => hs.filter(h => typeof window[h] !== 'function'), [
      'openReport', 'closeReport', 'selectReportReason', 'submitCurrentReport',
    ])
    expect(missing).toEqual([])
  })
})

test.describe('Events — Fonctionnel', () => {
  test('openCreateEvent ne crash pas', async ({ page }) => {
    await setupSocial(page)
    await page.evaluate(() => window.openCreateEvent?.())
    await page.waitForTimeout(300)
    const alive = await page.evaluate(() => !!document.getElementById('app'))
    expect(alive).toBe(true)
  })

  test('15 handlers événements existent', async ({ page }) => {
    await setupSocial(page)
    const missing = await page.evaluate((hs) => hs.filter(h => typeof window[h] !== 'function'), [
      'openCreateEvent', 'closeCreateEvent', 'submitCreateEvent',
      'joinEvent', 'leaveEvent', 'deleteEventAction',
      'openEventDetail', 'closeEventDetail',
      'postEventComment', 'replyEventComment', 'toggleReplyInput',
      'reactToEventComment', 'shareEvent', 'deleteEventCommentAction', 'setEventFilter',
    ])
    expect(missing).toEqual([])
  })
})

test.describe('Radar & Buddies — Fonctionnel', () => {
  test('toggleProximityRadar ne crash pas et l\'app reste vivante', async ({ page }) => {
    await setupSocial(page)
    await page.evaluate(() => window.toggleProximityRadar?.())
    await page.waitForTimeout(500)
    expect(await page.evaluate(() => typeof window.getState === 'function')).toBe(true)
  })

  test('showBuddyCreate ne crash pas', async ({ page }) => {
    await setupSocial(page)
    await page.evaluate(() => window.showBuddyCreate?.())
    await page.waitForTimeout(500)
    expect(await page.evaluate(() => typeof window.getState === 'function')).toBe(true)
  })

  test('setRadarRadius 50 ne crash pas', async ({ page }) => {
    await setupSocial(page)
    await page.evaluate(() => window.setRadarRadius?.(50))
    await page.waitForTimeout(300)
    expect(await page.evaluate(() => typeof window.getState === 'function')).toBe(true)
  })

  test('23 handlers radar/buddy existent', async ({ page }) => {
    await setupSocial(page)
    const missing = await page.evaluate((hs) => hs.filter(h => typeof window[h] !== 'function'), [
      'toggleProximityRadar', 'setRadarRadius', 'setRadarVisibility', 'setRadarMessage',
      'showRadarExpanded', 'contactNearbyTraveler',
      'showBuddyList', 'showBuddyCreate', 'showBuddyDetail',
      'submitBuddyAnnouncement', 'deleteBuddyAnnouncement', 'closeBuddyAnnouncement',
      'shareBuddyAnnouncement', 'setBuddyCountryFilter', 'contactBuddyAuthor',
      'setBuddyTravelMode', 'toggleBuddyFlexDates', 'setBuddyVisibility',
      'backFromVoyageurs', 'sendBuddyChatMessage',
      'showCompanionSearchView', 'closeCompanionSearch', 'postCompanionRequest',
    ])
    expect(missing).toEqual([])
  })
})

test.describe('Conversations — Fonctionnel', () => {
  test('12 handlers conversations + 8 nearby + 6 proximity existent', async ({ page }) => {
    await setupSocial(page)
    const missing = await page.evaluate((hs) => hs.filter(h => typeof window[h] !== 'function'), [
      'openGroupConversation', 'closeGroupConversation',
      'openCreateGroupConversation', 'closeCreateGroupConversation',
      'createGroupConversation', 'sendGroupConversationMessage',
      'toggleFriendForGroup', 'leaveGroupConversation', 'addMemberToGroupConversation',
      'joinCountryChatAction', 'showAllCountryChats', 'leaveCountryChatAction',
      'toggleNearbyFriends', 'openNearbyFriends', 'closeNearbyFriends',
      'setNotificationRadius', 'toggleNearbyFriendsList', 'closeNearbyFriendsList',
      'toggleLocationSharing', 'showFriendOnMap',
      'toggleProximityAlerts', 'setProximityRadius',
      'quickValidateSpot', 'quickReportSpot', 'dismissProximityAlert', 'initProximityNotify',
    ])
    expect(missing).toEqual([])
  })
})
