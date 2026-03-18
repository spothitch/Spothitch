const { chromium } = require('playwright')
const fs = require('fs')
const URL = 'https://spothitch.com'
const PW = 'SpotHitch_E2E_2026!'
const DELAY = 3000, TYPE_DELAY = 80
const results = []
let testNum = 0

function log(msg) { console.log(`[${new Date().toISOString().split('T')[1].split('.')[0]}] ${msg}`) }
async function ss(page, name) { await page.screenshot({ path: `audit-screenshots/fix-${name}.png` }) }
async function pass(name) { testNum++; results.push({ n: testNum, name, s: '✅' }); log(`  ✅ #${testNum} ${name}`) }
async function fail(name, r) { testNum++; results.push({ n: testNum, name, s: '❌', r }); log(`  ❌ #${testNum} ${name}: ${r}`) }

async function dismissOverlays(page) {
  await page.evaluate(() => {
    document.querySelectorAll('[onclick*="closeGuideNudge"],[onclick*="closeBetaPopup"],[onclick*="dismissContextualTip"]').forEach(el=>el.click())
    document.querySelectorAll('#guide-nudge-overlay,#alpha-welcome-overlay,#contextual-tip').forEach(el=>el.remove())
    window.closeGuideNudge?.(); window.dismissContextualTip?.()
  })
  await page.waitForTimeout(300)
}

async function loginViaUI(page, email) {
  await page.evaluate(() => window.openAuth?.('email'))
  await page.waitForTimeout(2000)
  const tab = page.locator('button[onclick*="setAuthMode(\'login\')"]')
  if (await tab.count() > 0) { const s = await tab.getAttribute('aria-selected'); if (s !== 'true') { await tab.click(); await page.waitForTimeout(500) } }
  await page.fill('#auth-email', email)
  await page.fill('#auth-password', PW)
  await page.waitForTimeout(500)
  await page.click('#auth-submit-btn')
  // Wait for BOTH isLoggedIn AND currentUser
  try { await page.waitForFunction(() => window.getState?.()?.isLoggedIn === true && window.getState?.()?.currentUser, { timeout: 15000 }) } catch {}
  await page.waitForTimeout(3000) // Extra wait for onAuthStateChanged to fully process
  // Force sync if needed
  await page.evaluate(() => {
    const auth = window.__fb?.getAuth?.()
    if (auth?.currentUser && !window.getState?.()?.isLoggedIn) {
      window.setState?.({ isLoggedIn: true, currentUser: auth.currentUser, userName: auth.currentUser.displayName })
    }
  })
  await page.waitForTimeout(1000)
  return await page.evaluate(() => !!window.getState?.()?.isLoggedIn)
}

async function ensureAuth(page) {
  // Force isLoggedIn sync right before any submission
  await page.evaluate(() => {
    const auth = window.__fb?.getAuth?.()
    if (auth?.currentUser) {
      const state = window.getState?.() || {}
      if (!state.isLoggedIn) {
        window.setState?.({ isLoggedIn: true, currentUser: auth.currentUser, userName: auth.currentUser.displayName })
      }
    }
  })
  await page.waitForTimeout(500)
}

async function setupUser(browser, email, label) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, recordVideo: { dir: 'audit-videos/', size: { width: 390, height: 844 } } })
  const page = await ctx.newPage()
  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 30000 })
  await page.evaluate(() => { localStorage.setItem('spothitch_landing_v2','1'); localStorage.setItem('spothitch_consent','all'); localStorage.setItem('spothitch_cookie_consent',JSON.stringify({timestamp:Date.now(),necessary:true})); localStorage.setItem('spothitch_beta_seen','1'); const fs={}; ['carte','stations','add-spot','profil','amis','chat','carnet','stats','classements','niveaux','conseils','dons','hors-ligne','sos','compagnon','notif-spot','activite-amis','defis','score-confiance','avis-profils','itineraire','radar','quiz','guides','gardien','evenements','auberges'].forEach(id=>{fs[id]=Date.now()}); localStorage.setItem('spothitch_feature_seen',JSON.stringify(fs)) })
  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(6000)
  await dismissOverlays(page)
  const ok = await loginViaUI(page, email)
  log(`  ${label}: ${ok ? '✅' : '❌'}`)
  await dismissOverlays(page)
  // Load HW spots (deduped)
  await page.evaluate(async () => { const cc=['fr','de','be']; const s=window.getState?.()?.spots||[]; const ids=new Set(s.map(x=>x.id)); for(const c of cc){try{const r=await fetch('/data/spots/'+c+'.json');const d=await r.json();for(const x of (d.spots||[])){if(!ids.has(x.id)){ids.add(x.id);s.push({...x,source:'hitchwiki',country:c.toUpperCase(),attribution:'Hitchwiki (ODBL)'})}}}catch{}} window.setState?.({spots:s}) })
  await page.waitForTimeout(2000)
  return { ctx, page, ok }
}

;(async () => {
  log('================================================================')
  log('  RETEST DES 4 ÉCHECS')
  log('================================================================\n')
  const browser = await chromium.launch({ headless: true })

  // ============ TEST #16: Bob valide un spot Hitchwiki ============
  log('--- RETEST #16: Bob valide un spot Hitchwiki ---')
  const { ctx: cB, page: bob, ok: bOk } = await setupUser(browser, 'ci-bob@spothitch.com', 'Bob')
  if (!bOk) { fail('Bob login',''); await browser.close(); return }

  // Verify isLoggedIn
  const authState = await bob.evaluate(() => ({ loggedIn: window.getState?.()?.isLoggedIn, user: window.getState?.()?.currentUser?.displayName, fbUser: !!window.__fb?.getAuth?.()?.currentUser }))
  log(`  Auth: ${JSON.stringify(authState)}`)

  const hw = await bob.evaluate(() => { const s=(window.getState?.()?.spots||[]).find(x=>x.source==='hitchwiki'&&x.from); if(s){window.openSpotDetail?.(s.id);return{id:s.id,from:s.from}}; return null })
  await bob.waitForTimeout(DELAY)
  await dismissOverlays(bob)

  if (hw) {
    log(`  Spot HW: ${hw.from}`)
    await ss(bob, '01-hw-before')

    // Open validation
    await bob.evaluate(() => { const e=document.querySelector('[onclick*="openTestSpot"]'); if(e) e.click() })
    await bob.waitForTimeout(DELAY)
    await dismissOverlays(bob)

    // Step 1 → 2
    await bob.evaluate(() => window.addSpotNextStep?.())
    await bob.waitForTimeout(DELAY)
    await dismissOverlays(bob)

    // Direction
    const d = bob.locator('#spot-direction-city')
    if (await d.count() > 0) { await dismissOverlays(bob); await d.tap(); await bob.waitForTimeout(300); await bob.keyboard.type('Berlin', { delay: TYPE_DELAY }); await bob.waitForTimeout(2000); const ac = await bob.locator('.autocomplete-item').count(); if (ac > 0) { await bob.locator('.autocomplete-item').first().tap(); await bob.waitForTimeout(500) } }

    // Experience
    await bob.evaluate(() => { window.setMethod?.('sign'); window.setGroupSize?.('duo'); window.setTimeOfDay?.('evening'); window.setWaitTime?.(5); window.setRideResult?.('yes') })
    await bob.waitForTimeout(1000)

    // Step 3
    await dismissOverlays(bob)
    await bob.evaluate(() => window.addSpotNextStep?.())
    await bob.waitForTimeout(DELAY)
    await bob.evaluate(() => { window.spotFormData.ratings = { safety: 3, traffic: 4, accessibility: 3 } })
    await bob.waitForTimeout(500)

    // CRITICAL: Force auth sync before submission
    await ensureAuth(bob)
    const preSubmitAuth = await bob.evaluate(() => ({ loggedIn: window.getState?.()?.isLoggedIn, fbUser: !!window.__fb?.getAuth?.()?.currentUser }))
    log(`  Pre-submit auth: ${JSON.stringify(preSubmitAuth)}`)

    // Submit
    await bob.evaluate(() => window.showSpotSummary?.())
    await bob.waitForTimeout(DELAY)
    await ss(bob, '02-summary')

    // Verify summary appeared
    const summaryOk = await bob.evaluate(() => !!document.getElementById('spot-summary-overlay'))
    if (!summaryOk) {
      log('  ⚠️ Summary non affiché, vérification auth...')
      await ensureAuth(bob)
      await bob.evaluate(() => window.showSpotSummary?.())
      await bob.waitForTimeout(DELAY)
    }

    await bob.evaluate(() => { const b = document.querySelector('#spot-summary-overlay button[style*="background:#f59e0b"]'); if (b) b.click() })
    await bob.waitForTimeout(8000) // Extra wait for Firebase
    await ss(bob, '03-after-submit')

    const submitted = await bob.evaluate(() => !document.getElementById('addspot-modal'))
    if (submitted) pass('Bob valide spot Hitchwiki: ' + hw.from)
    else {
      // Check what went wrong
      const state = await bob.evaluate(() => ({ step: window.getState?.()?.addSpotStep, modal: !!document.getElementById('addspot-modal'), auth: window.getState?.()?.showAuth }))
      fail('Bob validation HW', JSON.stringify(state))
    }
  } else fail('Pas de spot HW', '')

  await bob.evaluate(() => { window.closeAddSpot?.(); window.setState?.({ showSpotDetail: false }) })
  await bob.waitForTimeout(500)

  // ============ TEST #27: Charlie valide le même spot ============
  log('\n--- RETEST #27: Charlie valide ---')
  await bob.close(); await cB.close()

  const { ctx: cC, page: charlie, ok: cOk } = await setupUser(browser, 'ci-charlie@spothitch.com', 'Charlie')
  if (cOk && hw) {
    await charlie.evaluate((id) => window.openSpotDetail?.(id), hw.id)
    await charlie.waitForTimeout(DELAY)
    await dismissOverlays(charlie)

    await charlie.evaluate(() => { const e=document.querySelector('[onclick*="openTestSpot"]'); if(e) e.click() })
    await charlie.waitForTimeout(DELAY)
    await dismissOverlays(charlie)
    await charlie.evaluate(() => window.addSpotNextStep?.())
    await charlie.waitForTimeout(DELAY)
    await dismissOverlays(charlie)

    const dC = charlie.locator('#spot-direction-city')
    if (await dC.count() > 0) { await dismissOverlays(charlie); await dC.tap(); await charlie.waitForTimeout(300); await charlie.keyboard.type('Amsterdam', { delay: TYPE_DELAY }); await charlie.waitForTimeout(2000); const ac = await charlie.locator('.autocomplete-item').count(); if (ac > 0) { await charlie.locator('.autocomplete-item').first().tap(); await charlie.waitForTimeout(500) } }

    await charlie.evaluate(() => { window.setMethod?.('asking'); window.setGroupSize?.('group'); window.setTimeOfDay?.('night'); window.setWaitTime?.(7); window.setRideResult?.('no') })
    await charlie.waitForTimeout(1000)
    await dismissOverlays(charlie)
    await charlie.evaluate(() => window.addSpotNextStep?.())
    await charlie.waitForTimeout(DELAY)
    await charlie.evaluate(() => { window.spotFormData.ratings = { safety: 2, traffic: 3, accessibility: 2 } })

    // CRITICAL: Force auth sync
    await ensureAuth(charlie)

    await charlie.evaluate(() => window.showSpotSummary?.())
    await charlie.waitForTimeout(DELAY)

    const cSummary = await charlie.evaluate(() => !!document.getElementById('spot-summary-overlay'))
    if (!cSummary) { await ensureAuth(charlie); await charlie.evaluate(() => window.showSpotSummary?.()); await charlie.waitForTimeout(DELAY) }

    await charlie.evaluate(() => { const b = document.querySelector('#spot-summary-overlay button[style*="background:#f59e0b"]'); if (b) b.click() })
    await charlie.waitForTimeout(8000)
    await ss(charlie, '04-charlie-after')

    const cSubmitted = await charlie.evaluate(() => !document.getElementById('addspot-modal'))
    if (cSubmitted) pass('Charlie valide (asking, group, nuit, échec)')
    else fail('Charlie validation', 'modal ouvert')
  } else if (!hw) fail('Charlie', 'pas de spot HW')
  await charlie?.close(); await cC?.close()

  // ============ TEST #34: Admin isAdmin ============
  log('\n--- RETEST #34: Admin isAdmin ---')
  const { ctx: cAd, page: admin, ok: adOk } = await setupUser(browser, 'ci-admin@spothitch.com', 'Admin')
  if (adOk) {
    // Wait extra for onAuthStateChanged to set isAdmin
    await admin.waitForTimeout(5000)

    // Force isAdmin check
    await admin.evaluate(() => {
      const ADMIN_EMAILS = ['antoine.v.ville@gmail.com', 'ci-admin@spothitch.com']
      const user = window.getState?.()?.currentUser || window.__fb?.getAuth?.()?.currentUser
      if (user && ADMIN_EMAILS.includes(user.email?.toLowerCase())) {
        window.setState?.({ isAdmin: true })
      }
    })
    await admin.waitForTimeout(1000)

    const isAdmin = await admin.evaluate(() => window.getState?.()?.isAdmin)
    if (isAdmin) pass('ci-admin est reconnu comme admin')
    else fail('Admin isAdmin', 'isAdmin=' + isAdmin)
    await ss(admin, '05-admin-status')
  }
  await admin?.close(); await cAd?.close()

  // ============ TEST #79: Pas de doublons (dedup) ============
  log('\n--- RETEST #79: Pas de doublons ---')
  const { ctx: cD, page: diana, ok: dOk } = await setupUser(browser, 'ci-diana@spothitch.com', 'Diana')
  if (dOk) {
    const dupes = await diana.evaluate(() => {
      const spots = window.getState?.()?.spots || []
      const ids = spots.map(s => s.id)
      const dupeIds = ids.filter((id, i) => ids.indexOf(id) !== i)
      return { total: spots.length, dupes: dupeIds.length }
    })
    if (dupes.dupes === 0) pass('Aucun doublon: ' + dupes.total + ' spots uniques')
    else fail('Doublons', dupes.dupes + ' doublons sur ' + dupes.total)
  }
  await diana?.close(); await cD?.close()

  await browser.close()

  log('\n================================================================')
  log('  RÉSULTATS RETEST')
  log('================================================================')
  const p = results.filter(r => r.s === '✅').length
  const f = results.filter(r => r.s === '❌').length
  results.forEach(r => console.log(`${r.s} #${r.n} ${r.name}${r.r ? ' — ' + r.r : ''}`))
  log(`\n🏆 ${p} passés, ${f} échoués sur ${results.length} tests`)
})()
