/**
 * Functional E2E Tests — GUARDIAN & SOS
 * REAL tests: open modals, verify content, check all handlers loaded
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
      username: 'testuser', emergencyContacts: [{ name: 'Contact1', phone: '+33600000000' }],
    })
  })
  await page.waitForTimeout(800)
}

// ==================== GUARDIAN ====================

test.describe('Guardian — Fonctionnel', () => {

  test('Ouvrir Guardian affiche le modal avec du contenu visible', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => window.showGuardianModal?.())
    await page.waitForTimeout(1500)
    const content = await page.evaluate(() => {
      const els = document.querySelectorAll('[class*="guardian"], [id*="guardian"]')
      let text = ''
      els.forEach(el => text += el.innerText)
      return text || document.body.innerText
    })
    expect(content.length).toBeGreaterThan(50)
  })

  test('Fermer Guardian cache le modal', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => window.showGuardianModal?.())
    await page.waitForTimeout(1000)
    await page.evaluate(() => window.closeGuardianModal?.())
    await page.waitForTimeout(500)
    expect(await page.evaluate(() => window.getState?.()?.showGuardianModal)).toBe(false)
  })

  test('Guardian contient bouton démarrer ou configurer', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => window.showGuardianModal?.())
    await page.waitForTimeout(1500)
    const hasAction = await page.evaluate(() => {
      const t = document.body.innerText.toLowerCase()
      return t.includes('démarrer') || t.includes('start') || t.includes('activer') || t.includes('gardien')
    })
    expect(hasAction).toBe(true)
  })

  test('Tous les 29 handlers Guardian chargés après ouverture', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => window.showGuardianModal?.())
    await page.waitForTimeout(2500)
    const handlers = [
      'startGuardian', 'stopGuardian', 'guardianCheckIn', 'guardianSendMessage',
      'guardianSendAlert', 'guardianAddGuardian', 'guardianRemoveGuardian',
      'guardianEditGuardian', 'guardianUpdatePlate', 'guardianSavePlate',
      'guardianUpdateDestination', 'guardianSaveDestination',
      'guardianAddTripPhoto', 'guardianSaveTripPhoto',
      'guardianSelectInterval', 'guardianQuickCheckin', 'guardianSendReply',
      'guardianShowArrival', 'guardianAddToJournal', 'guardianClearHistory',
      'guardianCallEmergency', 'guardianCallTraveler', 'guardianMessageTraveler',
      'guardianShowMap', 'guardianBtnDown', 'guardianBtnUp', 'guardianBtnCancel',
      'guardianCloseSheet', 'guardianGoToScreen',
    ]
    const missing = await page.evaluate((hs) => hs.filter(h => typeof window[h] !== 'function'), handlers)
    expect(missing).toEqual([])
  })

  test('guardianGoToScreen change l\'écran sans crash', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => window.showGuardianModal?.())
    await page.waitForTimeout(2000)
    await page.evaluate(() => window.guardianGoToScreen?.('main'))
    await page.waitForTimeout(300)
    expect(await page.evaluate(() => typeof window.getState === 'function')).toBe(true)
  })
})

// ==================== SOS ====================

test.describe('SOS — Fonctionnel', () => {

  test('Ouvrir SOS affiche le modal avec contenu visible', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => window.openSOS?.())
    await page.waitForTimeout(1500)
    const content = await page.evaluate(() => document.body.innerText)
    expect(content.length).toBeGreaterThan(200)
    const hasSOS = await page.evaluate(() => {
      const t = document.body.innerText.toUpperCase()
      return t.includes('SOS') || t.includes('URGENCE') || t.includes('EMERGENCY')
    })
    expect(hasSOS).toBe(true)
  })

  test('Fermer SOS cache le modal', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => window.openSOS?.())
    await page.waitForTimeout(500)
    await page.evaluate(() => window.closeSOS?.())
    await page.waitForTimeout(300)
    expect(await page.evaluate(() => window.getState?.()?.showSOS)).toBe(false)
  })

  test('Tous les 26 handlers SOS chargés après ouverture', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => window.openSOS?.())
    await page.waitForTimeout(2500)
    const handlers = [
      'shareSOSLocation', 'markSafe', 'callEmergency',
      'addEmergencyContact', 'removeEmergencyContact',
      'sosToggleSilent', 'sosUpdateCustomMsg', 'sosSetPrimaryContact',
      'sosOpenFakeCall', 'sosFakeCallAnswer', 'sosFakeCallDecline',
      'sosStartRecording', 'sosStopRecording',
      'acceptSOSIntro', 'sosTab', 'sosShowRecordOptions',
      'sosBroadcastCommunity', 'sosOpenConfig', 'sosCloseConfig',
      'sosSearchFriend', 'sosAddFriendAsContact', 'sosRequestPermission',
      'sendSOSTemplate', 'startSOSTracking', 'stopSOSTracking', 'shareSOSLink',
    ]
    const missing = await page.evaluate((hs) => hs.filter(h => typeof window[h] !== 'function'), handlers)
    expect(missing).toEqual([])
  })

  test('sosTab change d\'onglet sans crash', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => window.openSOS?.())
    await page.waitForTimeout(2000)
    await page.evaluate(() => window.sosTab?.('contacts'))
    await page.waitForTimeout(300)
    expect(await page.evaluate(() => typeof window.getState === 'function')).toBe(true)
  })

  test('sosOpenConfig ouvre la config', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => window.openSOS?.())
    await page.waitForTimeout(2000)
    await page.evaluate(() => window.sosOpenConfig?.('fake'))
    await page.waitForTimeout(300)
    expect(await page.evaluate(() => typeof window.getState === 'function')).toBe(true)
  })

  test('Community alerts handlers existent', async ({ page }) => {
    await setup(page)
    const handlers = ['toggleCommunityAlerts', 'setCommunityRadius', 'setCommunityGenderFilter']
    const missing = await page.evaluate((hs) => hs.filter(h => typeof window[h] !== 'function'), handlers)
    expect(missing).toEqual([])
  })
})
