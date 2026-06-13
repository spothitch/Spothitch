/**
 * Phase 1 Visual Audit — captures all major screens
 * Simulates: new user (landing bypass), existing user (with profile)
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

const OUT = '/home/antoine/Spothitch/audit-screenshots/phase1'
mkdirSync(OUT, { recursive: true })

const MOBILE = { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
const BASE_URL = 'http://localhost:4173'

// localStorage state: existing user (bypasses landing + tutorial)
// spothitch_v4_contextual_tips_seen: all tips pre-marked so no tip banners block screenshots
const EXISTING_USER_STATE = {
  spothitch_landing_v2: '1',
  spothitch_beta_seen: '1',
  spothitch_v4_cookie_consent: JSON.stringify({ preferences: { necessary: true }, timestamp: Date.now(), version: '1.0' }),
  spothitch_welcomed: '1',
  spothitch_username: 'testuser42',
  spothitch_lang: 'fr',
  spothitch_v4_contextual_tips_seen: JSON.stringify(['first_checkin','first_spot_created','first_friend_added','first_message','first_badge','first_favorite','first_trip','sos_feature']),
}

const browser = await chromium.launch({ headless: true })

async function shot(page, name, waitMs = 1000) {
  await page.waitForTimeout(waitMs)
  await page.screenshot({ path: `${OUT}/${name}.png` })
  console.log(`  ✓ ${name}`)
}

async function setupPage(ctx, extraState = {}) {
  const page = await ctx.newPage()
  // Inject localStorage before any JS runs
  await page.addInitScript((state) => {
    for (const [k, v] of Object.entries(state)) {
      try { localStorage.setItem(k, v) } catch {}
    }
  }, { ...EXISTING_USER_STATE, ...extraState })
  return page
}

// ─── GROUP A : First-time visitor (landing page) ───────────────────────
console.log('\n=== A. LANDING (premier visiteur) ===')
{
  const ctx = await browser.newContext({ viewport: MOBILE })
  const page = await ctx.newPage()
  // No localStorage — pure new visitor
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 20000 })
  await shot(page, 'A01-landing-screen-1', 1500)
  // Click Next to see slide 2
  const next = page.locator('text=Next, text=Suivant, [onclick*="nextStep"], button:has-text("Next")').first()
  if (await next.count() > 0) await next.click()
  await shot(page, 'A02-landing-screen-2')
  await ctx.close()
}

// ─── GROUP B : App principale (utilisateur existant) ───────────────────
console.log('\n=== B. APP PRINCIPALE (utilisateur existant) ===')
{
  const ctx = await browser.newContext({ viewport: MOBILE })
  const page = await setupPage(ctx)
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 20000 })
  await page.waitForTimeout(2000)

  // B1 — Carte
  await shot(page, 'B01-carte', 1500)
  
  // B2 — SpotDetail (click first marker if any)
  const marker = page.locator('.maplibregl-marker, [class*="marker"]').first()
  if (await marker.count() > 0) {
    await marker.click()
    await shot(page, 'B02-spot-detail', 1200)
    await page.keyboard.press('Escape')
    await page.evaluate(() => window.setState?.({ showSpotDetail: false, selectedSpot: null }))
  }
  
  // B3 — Tabs navigation (use setState, not window.navigate which is undefined)
  for (const [tabState, label] of [
    [{ activeTab: 'voyage' }, 'B03-voyage'],
    [{ activeTab: 'social' }, 'B04-social'],
    [{ activeTab: 'spots' }, 'B05-spots'],
    [{ activeTab: 'profile', profileSubTab: 'profil' }, 'B06-profile'],
  ]) {
    await page.evaluate(s => window.setState?.(s), tabState)
    await shot(page, label, 1000)
  }
  await page.evaluate(() => window.setState?.({ activeTab: 'map' }))
  await page.waitForTimeout(500)

  // B4 — AddSpot wizard
  await page.evaluate(() => window.setState?.({ showAddSpot: true, addSpotStep: 1 }))
  await shot(page, 'B07-addspot-step1', 1200)
  await page.evaluate(() => window.setState?.({ addSpotStep: 2 }))
  await shot(page, 'B08-addspot-step2', 800)
  await page.evaluate(() => window.setState?.({ addSpotStep: 3 }))
  await shot(page, 'B09-addspot-step3', 800)
  await page.evaluate(() => window.setState?.({ showAddSpot: false }))
  await page.waitForTimeout(300)

  // B5 — Auth
  await page.evaluate(() => window.setState?.({ showAuth: true, authMode: 'login' }))
  await shot(page, 'B10-auth-login', 1000)
  await page.evaluate(() => window.setState?.({ authMode: 'register' }))
  await shot(page, 'B11-auth-register', 800)
  await page.evaluate(() => window.setState?.({ showAuth: false }))

  // B6 — Guardian
  await page.evaluate(() => window.setState?.({ showGuardianModal: true }))
  await shot(page, 'B12-guardian-intro', 1000)
  await page.evaluate(() => {
    window.acceptGuardianConsent?.()
    // or force main screen
    window.guardianGoToScreen?.('main')
  })
  await shot(page, 'B13-guardian-config', 800)
  // Simulate active trip
  await page.evaluate(() => {
    try {
      const g = JSON.parse(localStorage.getItem('spothitch_guardian') || '{}')
      g.active = true
      g.tripStart = Date.now() - 30 * 60 * 1000
      g.destination = 'Paris'
      g.guardians = [{ name: 'Maman', phone: '+33600000000', color: '#22c55e' }]
      localStorage.setItem('spothitch_guardian', JSON.stringify(g))
    } catch {}
    window.guardianGoToScreen?.('active')
    window._forceRender?.()
  })
  await shot(page, 'B14-guardian-actif', 1000)
  await page.evaluate(() => window.guardianGoToScreen?.('overdue'))
  await shot(page, 'B15-guardian-overdue', 800)
  await page.evaluate(() => window.guardianGoToScreen?.('arrival'))
  await shot(page, 'B16-guardian-arrival', 800)
  await page.evaluate(() => window.setState?.({ showGuardianModal: false }))

  // B7 — SOS
  await page.evaluate(() => window.openSOS?.() || window.setState?.({ showSOS: true }))
  await shot(page, 'B17-sos', 1000)
  // Dismiss any contextual tip that may have appeared, then close SOS
  await page.evaluate(() => {
    document.getElementById('contextual-tip')?.remove()
    window.dismissTip?.()
    window.setState?.({ showSOS: false })
  })
  await page.waitForTimeout(300)

  // B8 — Profile sub-tabs
  await page.evaluate(() => window.setState?.({ activeTab: 'profile', profileSubTab: 'profil' }))
  await shot(page, 'B18-profile-profil', 800)
  await page.evaluate(() => window.setState?.({ profileSubTab: 'progression' }))
  await shot(page, 'B19-profile-roadmap', 800)
  await page.evaluate(() => window.setState?.({ profileSubTab: 'reglages' }))
  await shot(page, 'B20-profile-reglages', 800)

  // B9 — Report modal
  await page.evaluate(() => window.setState?.({ activeTab: 'map' }))
  await page.waitForTimeout(500)
  await page.evaluate(() => window.openReport?.('test-spot-id') || window.setState?.({ showReport: true, reportSpotId: 'test' }))
  await shot(page, 'B21-report-modal', 800)
  await page.evaluate(() => window.closeReport?.() || window.setState?.({ showReport: false }))

  // B10 — Spots list
  await page.evaluate(() => window.setState?.({ activeTab: 'spots' }))
  await shot(page, 'B22-spots-liste', 800)

  // B11 — Guides (lives in voyage tab with voyageSubTab: 'guides')
  await page.evaluate(() => window.setState?.({ activeTab: 'voyage', voyageSubTab: 'guides' }))
  await shot(page, 'B23-guides', 1000)

  // B12 — Social sub-views
  await page.evaluate(() => window.setState?.({ activeTab: 'social', socialSubTab: 'feed' }))
  await shot(page, 'B24-social-feed', 800)
  await page.evaluate(() => window.setState?.({ socialSubTab: 'radar' }))
  await shot(page, 'B25-social-radar', 800)

  // B13 — Voyage (trip planner)
  await page.evaluate(() => window.setState?.({ activeTab: 'voyage', voyageSubTab: 'voyage' }))
  await shot(page, 'B26-voyage', 800)

  // B14 — Journal
  await page.evaluate(() => window.setState?.({ activeTab: 'voyage', voyageSubTab: 'journal' }))
  await shot(page, 'B27-journal', 800)

  await ctx.close()
}

// ─── GROUP C : Desktop split-view ──────────────────────────────────────
console.log('\n=== C. DESKTOP (1280×800) ===')
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } })
  const page = await setupPage(ctx)
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 20000 })
  await shot(page, 'C01-desktop-carte', 4000)
  await page.evaluate(() => window.setState?.({ activeTab: 'profile', profileSubTab: 'profil' }))
  await shot(page, 'C02-desktop-profile', 1000)
  await page.evaluate(() => window.setState?.({ activeTab: 'social' }))
  await shot(page, 'C03-desktop-social', 1000)
  await ctx.close()
}

await browser.close()
console.log('\n✅ Audit terminé →', OUT)
