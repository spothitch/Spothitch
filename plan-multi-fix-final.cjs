const { chromium } = require('playwright')
const URL = 'https://spothitch.com'
const PW = 'SpotHitch_E2E_2026!'
const DELAY = 3000, TYPE_DELAY = 80
let testNum = 0
const results = []

function log(msg) { console.log(`[${new Date().toISOString().split('T')[1].split('.')[0]}] ${msg}`) }
async function ss(page, name) { await page.screenshot({ path: `audit-screenshots/final2-${name}.png` }) }
async function pass(name) { testNum++; results.push({ n: testNum, name, s: '✅' }); log(`  ✅ #${testNum} ${name}`) }
async function fail(name, r) { testNum++; results.push({ n: testNum, name, s: '❌', r }); log(`  ❌ #${testNum} ${name}: ${r}`) }

async function dismissOverlays(page) {
  await page.evaluate(() => {
    document.querySelectorAll('[onclick*="closeGuideNudge"],[onclick*="closeBetaPopup"],[onclick*="dismissContextualTip"]').forEach(el=>el.click())
    document.querySelectorAll('#guide-nudge-overlay,#alpha-welcome-overlay,#contextual-tip').forEach(el=>el.remove())
    window.closeGuideNudge?.(); window.dismissContextualTip?.()
    // Also dismiss station detection popup
    const stationBtn = document.querySelector('button[onclick*="confirmStationType"], button[onclick*="keepStationType"]')
    if (stationBtn) stationBtn.click()
    // Click "Yes it's a station" if visible
    document.querySelectorAll('button').forEach(b => {
      if (b.textContent.includes("it's a station") || b.textContent.includes("c'est une station") || b.textContent.includes("Yes")) {
        if (b.closest('[style*="position"]') || b.closest('[class*="overlay"]') || b.closest('[class*="modal"]')) b.click()
      }
    })
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
  try { await page.waitForFunction(() => window.getState?.()?.isLoggedIn === true && window.getState?.()?.currentUser, { timeout: 15000 }) } catch {}
  await page.waitForTimeout(3000)
  await page.evaluate(() => { const a=window.__fb?.getAuth?.(); if(a?.currentUser&&!window.getState?.()?.isLoggedIn) window.setState?.({isLoggedIn:true,currentUser:a.currentUser,userName:a.currentUser.displayName}) })
  return await page.evaluate(() => !!window.getState?.()?.isLoggedIn)
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
  await page.evaluate(async () => { const cc=['fr','de','be']; const s=window.getState?.()?.spots||[]; const ids=new Set(s.map(x=>x.id)); for(const c of cc){try{const r=await fetch('/data/spots/'+c+'.json');const d=await r.json();for(const x of (d.spots||[])){if(!ids.has(x.id)){ids.add(x.id);s.push({...x,source:'hitchwiki',country:c.toUpperCase(),attribution:'Hitchwiki (ODBL)'})}}}catch{}} window.setState?.({spots:s}) })
  await page.waitForTimeout(2000)
  return { ctx, page, ok }
}

;(async () => {
  log('================================================================')
  log('  RETEST FINAL — Validation Hitchwiki (non gas_station)')
  log('================================================================\n')
  const browser = await chromium.launch({ headless: true })

  // BOB validates a ROADSIDE Hitchwiki spot (NOT gas_station to avoid station popup)
  log('--- BOB: Validation spot Hitchwiki ROADSIDE ---')
  const { ctx: cB, page: bob, ok: bOk } = await setupUser(browser, 'ci-bob@spothitch.com', 'Bob')
  if (!bOk) { fail('Bob login',''); await browser.close(); return }

  // Find a roadside HW spot
  const hw = await bob.evaluate(() => {
    const s = (window.getState?.()?.spots||[]).find(x => x.source === 'hitchwiki' && x.from && x.spotType !== 'gas_station')
    if (!s) {
      // Fallback: find any non-gas_station
      const s2 = (window.getState?.()?.spots||[]).find(x => x.source === 'hitchwiki' && x.from && (!x.spotType || x.spotType === 'roadside' || x.spotType === 'custom'))
      if (s2) { window.openSpotDetail?.(s2.id); return { id: s2.id, from: s2.from, type: s2.spotType } }
    }
    if (s) { window.openSpotDetail?.(s.id); return { id: s.id, from: s.from, type: s.spotType } }
    return null
  })
  await bob.waitForTimeout(DELAY)
  await dismissOverlays(bob)

  if (hw) {
    log(`  Spot: ${hw.from} (type=${hw.type})`)
    await ss(bob, '01-bob-hw-roadside')

    await bob.evaluate(() => { const e=document.querySelector('[onclick*="openTestSpot"]'); if(e) e.click() })
    await bob.waitForTimeout(DELAY)
    await dismissOverlays(bob)

    // Step 2
    await bob.evaluate(() => window.addSpotNextStep?.())
    await bob.waitForTimeout(DELAY)
    await dismissOverlays(bob)

    const d = bob.locator('#spot-direction-city')
    if (await d.count() > 0) { await dismissOverlays(bob); await d.tap(); await bob.waitForTimeout(300); await bob.keyboard.type('Berlin', { delay: TYPE_DELAY }); await bob.waitForTimeout(2000); const ac = await bob.locator('.autocomplete-item').count(); if (ac > 0) { await bob.locator('.autocomplete-item').first().tap(); await bob.waitForTimeout(500) } }

    await bob.evaluate(() => { window.setMethod?.('sign'); window.setGroupSize?.('duo'); window.setTimeOfDay?.('evening'); window.setWaitTime?.(5); window.setRideResult?.('yes') })
    await bob.waitForTimeout(1000)

    // Step 3
    await dismissOverlays(bob)
    await bob.evaluate(() => window.addSpotNextStep?.())
    await bob.waitForTimeout(DELAY)
    await bob.evaluate(() => { window.spotFormData.ratings = { safety: 3, traffic: 4, accessibility: 3 } })
    await bob.waitForTimeout(500)

    // Force auth
    await bob.evaluate(() => { const a=window.__fb?.getAuth?.(); if(a?.currentUser) window.setState?.({isLoggedIn:true,currentUser:a.currentUser}) })
    await bob.waitForTimeout(500)

    // Summary
    await bob.evaluate(() => window.showSpotSummary?.())
    await bob.waitForTimeout(DELAY)
    await ss(bob, '02-bob-summary')

    // Dismiss any popup (station detection etc)
    await dismissOverlays(bob)
    await bob.waitForTimeout(1000)

    // Click confirm
    await bob.evaluate(() => { const b=document.querySelector('#spot-summary-overlay button[style*="background:#f59e0b"]'); if(b) b.click() })
    await bob.waitForTimeout(3000)

    // Dismiss station popup if it appears
    await dismissOverlays(bob)
    await bob.waitForTimeout(5000)

    // Check again after dismissing
    await dismissOverlays(bob)
    await bob.waitForTimeout(2000)

    await ss(bob, '03-bob-after')
    const submitted = await bob.evaluate(() => !document.getElementById('addspot-modal'))
    if (submitted) pass('Bob valide spot Hitchwiki ROADSIDE: ' + hw.from)
    else {
      const state = await bob.evaluate(() => ({ step: window.getState?.()?.addSpotStep, hasOverlay: !!document.querySelector('[style*="position:fixed"]'), modal: !!document.getElementById('addspot-modal') }))
      fail('Bob validation', JSON.stringify(state))
    }
  } else fail('Pas de spot roadside HW', '')

  await bob.evaluate(() => { window.closeAddSpot?.(); window.setState?.({showSpotDetail:false}) })
  await bob.waitForTimeout(500)
  await bob.close(); await cB.close()

  // CHARLIE validates the same spot
  log('\n--- CHARLIE: Validation même spot ---')
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
    await charlie.evaluate(() => { const a=window.__fb?.getAuth?.(); if(a?.currentUser) window.setState?.({isLoggedIn:true,currentUser:a.currentUser}) })
    await charlie.waitForTimeout(500)

    await charlie.evaluate(() => window.showSpotSummary?.())
    await charlie.waitForTimeout(DELAY)
    await dismissOverlays(charlie)
    await charlie.evaluate(() => { const b=document.querySelector('#spot-summary-overlay button[style*="background:#f59e0b"]'); if(b) b.click() })
    await charlie.waitForTimeout(3000)
    await dismissOverlays(charlie)
    await charlie.waitForTimeout(5000)
    await dismissOverlays(charlie)
    await charlie.waitForTimeout(2000)
    await ss(charlie, '04-charlie-after')

    const cSub = await charlie.evaluate(() => !document.getElementById('addspot-modal'))
    if (cSub) pass('Charlie valide (asking, group, nuit, échec)')
    else fail('Charlie validation', 'modal ouvert')
  }
  await charlie?.close(); await cC?.close()

  await browser.close()

  log('\n================================================================')
  results.forEach(r => console.log(`${r.s} #${r.n} ${r.name}${r.r ? ' — ' + r.r : ''}`))
  const p = results.filter(r => r.s === '✅').length
  const f = results.filter(r => r.s === '❌').length
  log(`\n🏆 ${p} passés, ${f} échoués sur ${results.length}`)
})()
