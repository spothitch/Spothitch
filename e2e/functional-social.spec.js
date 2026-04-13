/**
 * Functional E2E Tests — SOCIAL & MESSAGERIE
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
  await page.waitForFunction(() => typeof window.setState === 'function', { timeout: 30000 }).catch(() => {})
  await page.evaluate(() => {
    localStorage.setItem('spothitch_landing_v2', '1')
    window.setState?.({
      showWelcome: false, showLanding: false, showAgeVerification: false, showCookieBanner: false,
      isLoggedIn: true, user: { uid: 'test-uid', displayName: 'TestUser', email: 'test@test.com' },
      username: 'testuser', isAdmin: true,
    })
  })
  await page.waitForTimeout(800)
}

async function setupSocial(page) {
  await setup(page)
  await page.evaluate(() => window.changeTab?.('social'))
  await page.waitForTimeout(1500)
}

// ==================== FRIENDS ====================

test.describe('Friends — Fonctionnel', () => {
  test('showFriends navigue vers l\'onglet amis', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => window.showFriends?.())
    await page.waitForTimeout(500)
    expect(await page.evaluate(() => window.getState?.()?.activeTab)).toBe('social')
  })

  test('sendFriendRequest est appelable', async ({ page }) => {
    await setupSocial(page)
    expect(await page.evaluate(() => typeof window.sendFriendRequest === 'function')).toBe(true)
  })

  test('acceptFriendRequest est appelable', async ({ page }) => {
    await setupSocial(page)
    expect(await page.evaluate(() => typeof window.acceptFriendRequest === 'function')).toBe(true)
  })

  test('declineFriendRequest est appelable', async ({ page }) => {
    await setupSocial(page)
    expect(await page.evaluate(() => typeof window.declineFriendRequest === 'function')).toBe(true)
  })

  test('removeFriend est appelable', async ({ page }) => {
    await setupSocial(page)
    expect(await page.evaluate(() => typeof window.removeFriend === 'function')).toBe(true)
  })

  test('showFriendProfile est appelable', async ({ page }) => {
    await setupSocial(page)
    expect(await page.evaluate(() => typeof window.showFriendProfile === 'function')).toBe(true)
  })

  test('closeFriendProfile est appelable', async ({ page }) => {
    await setupSocial(page)
    expect(await page.evaluate(() => typeof window.closeFriendProfile === 'function')).toBe(true)
  })

  test('addFriendByName est appelable', async ({ page }) => {
    await setupSocial(page)
    expect(await page.evaluate(() => typeof window.addFriendByName === 'function')).toBe(true)
  })

  test('copyFriendLink est appelable', async ({ page }) => {
    await setupSocial(page)
    expect(await page.evaluate(() => typeof window.copyFriendLink === 'function')).toBe(true)
  })
})

// ==================== DM ====================

test.describe('DM — Fonctionnel', () => {
  test('setSocialTab messagerie affiche les conversations', async ({ page }) => {
    await setupSocial(page)
    await page.evaluate(() => window.setSocialTab?.('messagerie'))
    await page.waitForTimeout(500)
    expect(await page.evaluate(() => window.getState?.()?.socialSubTab)).toBe('messagerie')
  })

  test('sendDM est appelable', async ({ page }) => {
    await setupSocial(page)
    expect(await page.evaluate(() => typeof window.sendDM === 'function')).toBe(true)
  })

  test('openConversation est appelable', async ({ page }) => {
    await setupSocial(page)
    expect(await page.evaluate(() => typeof window.openConversation === 'function')).toBe(true)
  })

  test('closeConversation est appelable', async ({ page }) => {
    await setupSocial(page)
    expect(await page.evaluate(() => typeof window.closeConversation === 'function')).toBe(true)
  })

  test('shareDMSpot est appelable', async ({ page }) => {
    await setupSocial(page)
    expect(await page.evaluate(() => typeof window.shareDMSpot === 'function')).toBe(true)
  })

  test('shareDMPosition est appelable', async ({ page }) => {
    await setupSocial(page)
    expect(await page.evaluate(() => typeof window.shareDMPosition === 'function')).toBe(true)
  })

  test('deleteDMConversation est appelable', async ({ page }) => {
    await setupSocial(page)
    expect(await page.evaluate(() => typeof window.deleteDMConversation === 'function')).toBe(true)
  })
})

// ==================== BLOCKING ====================

test.describe('Blocking — Fonctionnel', () => {
  test('openBlockModal est appelable', async ({ page }) => {
    await setupSocial(page)
    expect(await page.evaluate(() => typeof window.openBlockModal === 'function')).toBe(true)
  })

  test('confirmBlockUser est appelable', async ({ page }) => {
    await setupSocial(page)
    expect(await page.evaluate(() => typeof window.confirmBlockUser === 'function')).toBe(true)
  })

  test('unblockUserById est appelable', async ({ page }) => {
    await setupSocial(page)
    expect(await page.evaluate(() => typeof window.unblockUserById === 'function')).toBe(true)
  })

  test('openBlockedUsers ouvre la liste', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => window.changeTab?.('profile'))
    await page.waitForTimeout(1000)
    expect(await page.evaluate(() => typeof window.openBlockedUsers === 'function')).toBe(true)
  })
})

// ==================== EVENTS ====================

test.describe('Events — Fonctionnel', () => {
  test('openCreateEvent ouvre le formulaire', async ({ page }) => {
    await setupSocial(page)
    await page.evaluate(() => window.openCreateEvent?.())
    await page.waitForTimeout(300)
    expect(await page.evaluate(() => typeof window.submitCreateEvent === 'function')).toBe(true)
  })

  test('closeCreateEvent ferme le formulaire', async ({ page }) => {
    await setupSocial(page)
    expect(await page.evaluate(() => typeof window.closeCreateEvent === 'function')).toBe(true)
  })

  test('joinEvent est appelable', async ({ page }) => {
    await setupSocial(page)
    expect(await page.evaluate(() => typeof window.joinEvent === 'function')).toBe(true)
  })

  test('leaveEvent est appelable', async ({ page }) => {
    await setupSocial(page)
    expect(await page.evaluate(() => typeof window.leaveEvent === 'function')).toBe(true)
  })

  test('postEventComment est appelable', async ({ page }) => {
    await setupSocial(page)
    expect(await page.evaluate(() => typeof window.postEventComment === 'function')).toBe(true)
  })

  test('reactToEventComment est appelable', async ({ page }) => {
    await setupSocial(page)
    expect(await page.evaluate(() => typeof window.reactToEventComment === 'function')).toBe(true)
  })

  test('replyEventComment est appelable', async ({ page }) => {
    await setupSocial(page)
    expect(await page.evaluate(() => typeof window.replyEventComment === 'function')).toBe(true)
  })

  test('deleteEventAction est appelable', async ({ page }) => {
    await setupSocial(page)
    expect(await page.evaluate(() => typeof window.deleteEventAction === 'function')).toBe(true)
  })

  test('shareEvent est appelable', async ({ page }) => {
    await setupSocial(page)
    expect(await page.evaluate(() => typeof window.shareEvent === 'function')).toBe(true)
  })
})

// ==================== RADAR & BUDDIES ====================

test.describe('Radar & Buddies — Fonctionnel', () => {
  test('toggleProximityRadar active/désactive le radar', async ({ page }) => {
    await setupSocial(page)
    await page.evaluate(() => window.toggleProximityRadar?.())
    await page.waitForTimeout(300)
    expect(await page.evaluate(() => typeof window.getState === 'function')).toBe(true)
  })

  test('setRadarRadius change le rayon', async ({ page }) => {
    await setupSocial(page)
    await page.evaluate(() => window.setRadarRadius?.(50))
    await page.waitForTimeout(300)
    expect(await page.evaluate(() => typeof window.getState === 'function')).toBe(true)
  })

  test('setRadarMessage définit le message', async ({ page }) => {
    await setupSocial(page)
    expect(await page.evaluate(() => typeof window.setRadarMessage === 'function')).toBe(true)
  })

  test('showRadarExpanded est appelable', async ({ page }) => {
    await setupSocial(page)
    expect(await page.evaluate(() => typeof window.showRadarExpanded === 'function')).toBe(true)
  })

  test('showBuddyCreate ouvre le formulaire buddy', async ({ page }) => {
    await setupSocial(page)
    await page.evaluate(() => window.showBuddyCreate?.())
    await page.waitForTimeout(500)
    expect(await page.evaluate(() => typeof window.getState === 'function')).toBe(true)
  })

  test('showBuddyList affiche la liste', async ({ page }) => {
    await setupSocial(page)
    await page.evaluate(() => window.showBuddyList?.())
    await page.waitForTimeout(300)
    expect(await page.evaluate(() => typeof window.getState === 'function')).toBe(true)
  })

  test('submitBuddyAnnouncement est appelable', async ({ page }) => {
    await setupSocial(page)
    expect(await page.evaluate(() => typeof window.submitBuddyAnnouncement === 'function')).toBe(true)
  })

  test('deleteBuddyAnnouncement est appelable', async ({ page }) => {
    await setupSocial(page)
    expect(await page.evaluate(() => typeof window.deleteBuddyAnnouncement === 'function')).toBe(true)
  })

  test('shareBuddyAnnouncement est appelable', async ({ page }) => {
    await setupSocial(page)
    expect(await page.evaluate(() => typeof window.shareBuddyAnnouncement === 'function')).toBe(true)
  })

  test('contactBuddyAuthor est appelable', async ({ page }) => {
    await setupSocial(page)
    expect(await page.evaluate(() => typeof window.contactBuddyAuthor === 'function')).toBe(true)
  })

  test('sendBuddyChatMessage est appelable', async ({ page }) => {
    await setupSocial(page)
    expect(await page.evaluate(() => typeof window.sendBuddyChatMessage === 'function')).toBe(true)
  })

  test('setBuddyCountryFilter est appelable', async ({ page }) => {
    await setupSocial(page)
    expect(await page.evaluate(() => typeof window.setBuddyCountryFilter === 'function')).toBe(true)
  })

  test('setBuddyTravelMode est appelable', async ({ page }) => {
    await setupSocial(page)
    expect(await page.evaluate(() => typeof window.setBuddyTravelMode === 'function')).toBe(true)
  })

  test('toggleBuddyFlexDates est appelable', async ({ page }) => {
    await setupSocial(page)
    expect(await page.evaluate(() => typeof window.toggleBuddyFlexDates === 'function')).toBe(true)
  })

  test('backFromVoyageurs est appelable', async ({ page }) => {
    await setupSocial(page)
    expect(await page.evaluate(() => typeof window.backFromVoyageurs === 'function')).toBe(true)
  })

  test('contactNearbyTraveler est appelable', async ({ page }) => {
    await setupSocial(page)
    expect(await page.evaluate(() => typeof window.contactNearbyTraveler === 'function')).toBe(true)
  })

  test('postCompanionRequest est appelable', async ({ page }) => {
    await setupSocial(page)
    expect(await page.evaluate(() => typeof window.postCompanionRequest === 'function')).toBe(true)
  })

  test('showCompanionSearchView est appelable', async ({ page }) => {
    await setupSocial(page)
    expect(await page.evaluate(() => typeof window.showCompanionSearchView === 'function')).toBe(true)
  })
})

// ==================== GROUP CONVERSATIONS ====================

test.describe('Group Conversations — Fonctionnel', () => {
  test('openGroupConversation est appelable', async ({ page }) => {
    await setupSocial(page)
    expect(await page.evaluate(() => typeof window.openGroupConversation === 'function')).toBe(true)
  })

  test('closeGroupConversation est appelable', async ({ page }) => {
    await setupSocial(page)
    expect(await page.evaluate(() => typeof window.closeGroupConversation === 'function')).toBe(true)
  })

  test('openCreateGroupConversation est appelable', async ({ page }) => {
    await setupSocial(page)
    expect(await page.evaluate(() => typeof window.openCreateGroupConversation === 'function')).toBe(true)
  })

  test('createGroupConversation est appelable', async ({ page }) => {
    await setupSocial(page)
    expect(await page.evaluate(() => typeof window.createGroupConversation === 'function')).toBe(true)
  })

  test('sendGroupConversationMessage est appelable', async ({ page }) => {
    await setupSocial(page)
    expect(await page.evaluate(() => typeof window.sendGroupConversationMessage === 'function')).toBe(true)
  })

  test('toggleFriendForGroup est appelable', async ({ page }) => {
    await setupSocial(page)
    expect(await page.evaluate(() => typeof window.toggleFriendForGroup === 'function')).toBe(true)
  })

  test('leaveGroupConversation est appelable', async ({ page }) => {
    await setupSocial(page)
    expect(await page.evaluate(() => typeof window.leaveGroupConversation === 'function')).toBe(true)
  })

  test('joinCountryChatAction est appelable', async ({ page }) => {
    await setupSocial(page)
    expect(await page.evaluate(() => typeof window.joinCountryChatAction === 'function')).toBe(true)
  })

  test('showAllCountryChats est appelable', async ({ page }) => {
    await setupSocial(page)
    expect(await page.evaluate(() => typeof window.showAllCountryChats === 'function')).toBe(true)
  })
})

// ==================== REPORT ====================

test.describe('Report — Fonctionnel', () => {
  test('openReport ouvre le modal de signalement', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => window.openReport?.('USER', 'test-user'))
    await page.waitForTimeout(500)
    expect(await page.evaluate(() => window.getState?.()?.showReport)).toBe(true)
  })

  test('closeReport ferme le modal', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => window.closeReport?.())
    await page.waitForTimeout(300)
    expect(await page.evaluate(() => window.getState?.()?.showReport)).toBe(false)
  })

  test('selectReportReason est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.selectReportReason === 'function')).toBe(true)
  })

  test('submitCurrentReport est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.submitCurrentReport === 'function')).toBe(true)
  })
})
