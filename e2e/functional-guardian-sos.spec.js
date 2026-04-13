/**
 * Functional E2E Tests — GUARDIAN & SOS
 */
import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:4173'
const BYPASS = {
  spothitch_cookie_consent: 'true', spothitch_landing_v2: '1',
  spothitch_age_verified: 'true', spothitch_welcomed: 'true', spothitch_sos_intro_seen: '1',
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
      username: 'testuser',
    })
  })
  await page.waitForTimeout(800)
}

async function setupGuardian(page) {
  await setup(page)
  await page.evaluate(() => window.showGuardianModal?.())
  await page.waitForTimeout(2000)
  await page.evaluate(() => window.closeGuardianModal?.())
  await page.waitForTimeout(300)
}

async function setupSOS(page) {
  await setup(page)
  await page.evaluate(() => window.openSOS?.())
  await page.waitForTimeout(2000)
  await page.evaluate(() => window.closeSOS?.())
  await page.waitForTimeout(300)
}

// ==================== GUARDIAN ====================

test.describe('Guardian — Fonctionnel', () => {

  test('showGuardianModal affiche le modal', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => window.showGuardianModal?.())
    await page.waitForTimeout(500)
    expect(await page.evaluate(() => window.getState?.()?.showGuardianModal)).toBe(true)
  })

  test('closeGuardianModal ferme le modal', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => { window.showGuardianModal?.(); })
    await page.waitForTimeout(500)
    await page.evaluate(() => window.closeGuardianModal?.())
    await page.waitForTimeout(300)
    expect(await page.evaluate(() => window.getState?.()?.showGuardianModal)).toBe(false)
  })

  test('startGuardian est appelable', async ({ page }) => {
    await setupGuardian(page)
    expect(await page.evaluate(() => typeof window.startGuardian === 'function')).toBe(true)
  })

  test('stopGuardian est appelable', async ({ page }) => {
    await setupGuardian(page)
    expect(await page.evaluate(() => typeof window.stopGuardian === 'function')).toBe(true)
  })

  test('guardianCheckIn est appelable', async ({ page }) => {
    await setupGuardian(page)
    expect(await page.evaluate(() => typeof window.guardianCheckIn === 'function')).toBe(true)
  })

  test('guardianSendMessage est appelable', async ({ page }) => {
    await setupGuardian(page)
    expect(await page.evaluate(() => typeof window.guardianSendMessage === 'function')).toBe(true)
  })

  test('guardianSendAlert est appelable', async ({ page }) => {
    await setupGuardian(page)
    expect(await page.evaluate(() => typeof window.guardianSendAlert === 'function')).toBe(true)
  })

  test('guardianAddGuardian est appelable', async ({ page }) => {
    await setupGuardian(page)
    expect(await page.evaluate(() => typeof window.guardianAddGuardian === 'function')).toBe(true)
  })

  test('guardianRemoveGuardian est appelable', async ({ page }) => {
    await setupGuardian(page)
    expect(await page.evaluate(() => typeof window.guardianRemoveGuardian === 'function')).toBe(true)
  })

  test('guardianEditGuardian est appelable', async ({ page }) => {
    await setupGuardian(page)
    expect(await page.evaluate(() => typeof window.guardianEditGuardian === 'function')).toBe(true)
  })

  test('guardianUpdatePlate est appelable', async ({ page }) => {
    await setupGuardian(page)
    expect(await page.evaluate(() => typeof window.guardianUpdatePlate === 'function')).toBe(true)
  })

  test('guardianSavePlate est appelable', async ({ page }) => {
    await setupGuardian(page)
    expect(await page.evaluate(() => typeof window.guardianSavePlate === 'function')).toBe(true)
  })

  test('guardianUpdateDestination est appelable', async ({ page }) => {
    await setupGuardian(page)
    expect(await page.evaluate(() => typeof window.guardianUpdateDestination === 'function')).toBe(true)
  })

  test('guardianSaveDestination est appelable', async ({ page }) => {
    await setupGuardian(page)
    expect(await page.evaluate(() => typeof window.guardianSaveDestination === 'function')).toBe(true)
  })

  test('guardianAddTripPhoto est appelable', async ({ page }) => {
    await setupGuardian(page)
    expect(await page.evaluate(() => typeof window.guardianAddTripPhoto === 'function')).toBe(true)
  })

  test('guardianSaveTripPhoto est appelable', async ({ page }) => {
    await setupGuardian(page)
    expect(await page.evaluate(() => typeof window.guardianSaveTripPhoto === 'function')).toBe(true)
  })

  test('guardianSelectInterval est appelable', async ({ page }) => {
    await setupGuardian(page)
    expect(await page.evaluate(() => typeof window.guardianSelectInterval === 'function')).toBe(true)
  })

  test('guardianQuickCheckin est appelable', async ({ page }) => {
    await setupGuardian(page)
    expect(await page.evaluate(() => typeof window.guardianQuickCheckin === 'function')).toBe(true)
  })

  test('guardianSendReply est appelable', async ({ page }) => {
    await setupGuardian(page)
    expect(await page.evaluate(() => typeof window.guardianSendReply === 'function')).toBe(true)
  })

  test('guardianShowArrival est appelable', async ({ page }) => {
    await setupGuardian(page)
    expect(await page.evaluate(() => typeof window.guardianShowArrival === 'function')).toBe(true)
  })

  test('guardianAddToJournal est appelable', async ({ page }) => {
    await setupGuardian(page)
    expect(await page.evaluate(() => typeof window.guardianAddToJournal === 'function')).toBe(true)
  })

  test('guardianClearHistory est appelable', async ({ page }) => {
    await setupGuardian(page)
    expect(await page.evaluate(() => typeof window.guardianClearHistory === 'function')).toBe(true)
  })

  test('guardianCallEmergency est appelable', async ({ page }) => {
    await setupGuardian(page)
    expect(await page.evaluate(() => typeof window.guardianCallEmergency === 'function')).toBe(true)
  })

  test('guardianCallTraveler est appelable', async ({ page }) => {
    await setupGuardian(page)
    expect(await page.evaluate(() => typeof window.guardianCallTraveler === 'function')).toBe(true)
  })

  test('guardianMessageTraveler est appelable', async ({ page }) => {
    await setupGuardian(page)
    expect(await page.evaluate(() => typeof window.guardianMessageTraveler === 'function')).toBe(true)
  })

  test('guardianShowMap est appelable', async ({ page }) => {
    await setupGuardian(page)
    expect(await page.evaluate(() => typeof window.guardianShowMap === 'function')).toBe(true)
  })

  test('guardianBtnDown/Up/Cancel sont appelables', async ({ page }) => {
    await setupGuardian(page)
    expect(await page.evaluate(() => typeof window.guardianBtnDown === 'function')).toBe(true)
    expect(await page.evaluate(() => typeof window.guardianBtnUp === 'function')).toBe(true)
    expect(await page.evaluate(() => typeof window.guardianBtnCancel === 'function')).toBe(true)
  })

  test('guardianCloseSheet est appelable', async ({ page }) => {
    await setupGuardian(page)
    expect(await page.evaluate(() => typeof window.guardianCloseSheet === 'function')).toBe(true)
  })

  test('guardianGoToScreen est appelable', async ({ page }) => {
    await setupGuardian(page)
    expect(await page.evaluate(() => typeof window.guardianGoToScreen === 'function')).toBe(true)
  })
})

// ==================== SOS ====================

test.describe('SOS — Fonctionnel', () => {

  test('openSOS affiche le modal SOS', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => window.openSOS?.())
    await page.waitForTimeout(500)
    expect(await page.evaluate(() => window.getState?.()?.showSOS)).toBe(true)
  })

  test('closeSOS ferme le modal', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => window.closeSOS?.())
    expect(await page.evaluate(() => window.getState?.()?.showSOS)).toBe(false)
  })

  test('shareSOSLocation est appelable', async ({ page }) => {
    await setupSOS(page)
    expect(await page.evaluate(() => typeof window.shareSOSLocation === 'function')).toBe(true)
  })

  test('markSafe est appelable', async ({ page }) => {
    await setupSOS(page)
    expect(await page.evaluate(() => typeof window.markSafe === 'function')).toBe(true)
  })

  test('callEmergency est appelable', async ({ page }) => {
    await setupSOS(page)
    expect(await page.evaluate(() => typeof window.callEmergency === 'function')).toBe(true)
  })

  test('addEmergencyContact est appelable', async ({ page }) => {
    await setupSOS(page)
    expect(await page.evaluate(() => typeof window.addEmergencyContact === 'function')).toBe(true)
  })

  test('removeEmergencyContact est appelable', async ({ page }) => {
    await setupSOS(page)
    expect(await page.evaluate(() => typeof window.removeEmergencyContact === 'function')).toBe(true)
  })

  test('sosToggleSilent est appelable', async ({ page }) => {
    await setupSOS(page)
    expect(await page.evaluate(() => typeof window.sosToggleSilent === 'function')).toBe(true)
  })

  test('sosOpenFakeCall est appelable', async ({ page }) => {
    await setupSOS(page)
    expect(await page.evaluate(() => typeof window.sosOpenFakeCall === 'function')).toBe(true)
  })

  test('sosFakeCallAnswer est appelable', async ({ page }) => {
    await setupSOS(page)
    expect(await page.evaluate(() => typeof window.sosFakeCallAnswer === 'function')).toBe(true)
  })

  test('sosFakeCallDecline est appelable', async ({ page }) => {
    await setupSOS(page)
    expect(await page.evaluate(() => typeof window.sosFakeCallDecline === 'function')).toBe(true)
  })

  test('sosStartRecording est appelable', async ({ page }) => {
    await setupSOS(page)
    expect(await page.evaluate(() => typeof window.sosStartRecording === 'function')).toBe(true)
  })

  test('sosStopRecording est appelable', async ({ page }) => {
    await setupSOS(page)
    expect(await page.evaluate(() => typeof window.sosStopRecording === 'function')).toBe(true)
  })

  test('sosTab est appelable', async ({ page }) => {
    await setupSOS(page)
    expect(await page.evaluate(() => typeof window.sosTab === 'function')).toBe(true)
  })

  test('sosOpenConfig est appelable', async ({ page }) => {
    await setupSOS(page)
    expect(await page.evaluate(() => typeof window.sosOpenConfig === 'function')).toBe(true)
  })

  test('sosCloseConfig est appelable', async ({ page }) => {
    await setupSOS(page)
    expect(await page.evaluate(() => typeof window.sosCloseConfig === 'function')).toBe(true)
  })

  test('sosUpdateCustomMsg est appelable', async ({ page }) => {
    await setupSOS(page)
    expect(await page.evaluate(() => typeof window.sosUpdateCustomMsg === 'function')).toBe(true)
  })

  test('sosSetPrimaryContact est appelable', async ({ page }) => {
    await setupSOS(page)
    expect(await page.evaluate(() => typeof window.sosSetPrimaryContact === 'function')).toBe(true)
  })

  test('sosSearchFriend est appelable', async ({ page }) => {
    await setupSOS(page)
    expect(await page.evaluate(() => typeof window.sosSearchFriend === 'function')).toBe(true)
  })

  test('sosAddFriendAsContact est appelable', async ({ page }) => {
    await setupSOS(page)
    expect(await page.evaluate(() => typeof window.sosAddFriendAsContact === 'function')).toBe(true)
  })

  test('sosRequestPermission est appelable', async ({ page }) => {
    await setupSOS(page)
    expect(await page.evaluate(() => typeof window.sosRequestPermission === 'function')).toBe(true)
  })

  test('sosBroadcastCommunity est appelable', async ({ page }) => {
    await setupSOS(page)
    expect(await page.evaluate(() => typeof window.sosBroadcastCommunity === 'function')).toBe(true)
  })

  test('toggleCommunityAlerts est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.toggleCommunityAlerts === 'function')).toBe(true)
  })

  test('setCommunityRadius est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.setCommunityRadius === 'function')).toBe(true)
  })

  test('setCommunityGenderFilter est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.setCommunityGenderFilter === 'function')).toBe(true)
  })

  test('startSOSTracking est appelable', async ({ page }) => {
    await setupSOS(page)
    expect(await page.evaluate(() => typeof window.startSOSTracking === 'function')).toBe(true)
  })

  test('stopSOSTracking est appelable', async ({ page }) => {
    await setupSOS(page)
    expect(await page.evaluate(() => typeof window.stopSOSTracking === 'function')).toBe(true)
  })

  test('shareSOSLink est appelable', async ({ page }) => {
    await setupSOS(page)
    expect(await page.evaluate(() => typeof window.shareSOSLink === 'function')).toBe(true)
  })

  test('acceptSOSIntro est appelable', async ({ page }) => {
    await setupSOS(page)
    expect(await page.evaluate(() => typeof window.acceptSOSIntro === 'function')).toBe(true)
  })

  test('sosShowRecordOptions est appelable', async ({ page }) => {
    await setupSOS(page)
    expect(await page.evaluate(() => typeof window.sosShowRecordOptions === 'function')).toBe(true)
  })

  test('sendSOSTemplate est appelable', async ({ page }) => {
    await setupSOS(page)
    expect(await page.evaluate(() => typeof window.sendSOSTemplate === 'function')).toBe(true)
  })
})
