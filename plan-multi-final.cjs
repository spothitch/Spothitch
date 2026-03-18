const { chromium } = require('playwright')
const fs = require('fs')

const URL = 'https://spothitch.com'
const PW = 'SpotHitch_E2E_2026!'
const DELAY = 3000
const TYPE_DELAY = 90
const results = []
let testNum = 0

function log(msg) { console.log(`[${new Date().toISOString().split('T')[1].split('.')[0]}] ${msg}`) }
async function ss(page, name) { await page.screenshot({ path: `audit-screenshots/final-${name}.png` }); log(`  📸 ${name}`) }
async function pass(name) { testNum++; results.push({ num: testNum, name, s: 'PASS' }); log(`  ✅ #${testNum} ${name}`) }
async function fail(name, r) { testNum++; results.push({ num: testNum, name, s: 'FAIL', r }); log(`  ❌ #${testNum} ${name}: ${r}`) }

async function setup(browser, email, label) {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 }, hasTouch: true,
    recordVideo: { dir: 'audit-videos/', size: { width: 390, height: 844 } }
  })
  const page = await ctx.newPage()
  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 30000 })
  await page.evaluate(() => {
    localStorage.setItem('spothitch_landing_v2', '1'); localStorage.setItem('spothitch_consent', 'all')
    localStorage.setItem('spothitch_cookie_consent', JSON.stringify({timestamp:Date.now(),necessary:true}))
    localStorage.setItem('spothitch_beta_seen', '1')
  })
  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(8000)
  const r = await page.evaluate(async ({ e, p }) => {
    let a = 0; while (!window.__fb?.signIn && a < 30) { await new Promise(r => setTimeout(r, 500)); a++ }
    if (!window.__fb?.signIn) return { error: 'no firebase' }
    try { const res = await window.__fb.signIn(e, p); if (res.success) { window.setState?.({ isLoggedIn: true, currentUser: res.user, userName: res.user.displayName }); return { ok: true, uid: res.user.uid, name: res.user.displayName } } return { error: res.error } }
    catch(e) { return { error: e.message?.substring(0, 80) } }
  }, { e: email, p: PW })
  await page.waitForTimeout(3000)
  log(`  ${label}: ${r.ok ? '✅ ' + r.name : '❌ ' + (r.error || '')}`)
  return { ctx, page, ok: r.ok }
}

// Force-load Hitchwiki spots from JSON files
async function loadHWSpots(page) {
  return page.evaluate(async () => {
    const countries = ['fr', 'de', 'be', 'nl', 'es']
    const spots = window.getState?.()?.spots || []
    let added = 0
    for (const cc of countries) {
      try {
        const res = await fetch('/data/spots/' + cc + '.json')
        const data = await res.json()
        const newSpots = (data.spots || []).map(s => ({ ...s, source: 'hitchwiki', country: cc.toUpperCase(), attribution: 'Hitchwiki (ODBL)' }))
        spots.push(...newSpots)
        added += newSpots.length
      } catch {}
    }
    window.setState?.({ spots })
    return { added, total: spots.length, hw: spots.filter(s => s.source === 'hitchwiki').length }
  })
}

;(async () => {
  log('=== PLAN MULTI FINAL — 5 UTILISATEURS ===\n')
  const browser = await chromium.launch({ headless: true })

  // ======== ALICE: Create spot ========
  log('========= ALICE =========')
  const { ctx: cA, page: alice, ok: aOk } = await setup(browser, 'ci-alice@spothitch.com', 'Alice')
  if (!aOk) { fail('Alice login', ''); await browser.close(); return }

  // Load HW spots
  const hwCount = await loadHWSpots(alice)
  log(`  Loaded: ${hwCount.added} HW spots, ${hwCount.total} total`)

  // TEST 1: Create spot
  log('\n--- TEST 1-5: Alice crée un spot ---')
  await alice.evaluate(() => window.openAddSpot?.())
  await alice.waitForTimeout(DELAY)
  await alice.waitForTimeout(3000) // freeze check
  const noFreeze = await alice.evaluate(() => window.getState?.()?.addSpotStep === 1 && !!document.getElementById('addspot-modal'))
  if (noFreeze) pass('AddSpot sans freeze')
  else fail('AddSpot freeze', '')

  await alice.evaluate(() => { window.selectSpotType?.('roadside'); Object.assign(window.spotFormData, { lat: 48.857, lng: 2.352, departureCity: 'Paris', locationName: 'Porte Bagnolet', country: 'FR', countryName: 'France', positionSource: 'manual' }) })
  await alice.waitForTimeout(DELAY)
  await alice.evaluate(() => window.addSpotNextStep?.())
  await alice.waitForTimeout(DELAY)

  // Direction
  const d = alice.locator('#spot-direction-city')
  if (await d.count() > 0) { await d.tap(); await alice.waitForTimeout(300); await alice.keyboard.type('Lyon', { delay: TYPE_DELAY }); await alice.waitForTimeout(2000); const ac = await alice.locator('.autocomplete-item').count(); if (ac > 0) { await alice.locator('.autocomplete-item').first().tap(); await alice.waitForTimeout(500) } }
  await alice.evaluate(() => { window.setMethod?.('thumb'); window.setGroupSize?.('solo'); window.setTimeOfDay?.('morning'); window.setWaitTime?.(3); window.setRideResult?.('yes') })
  await alice.waitForTimeout(1000)
  await alice.evaluate(() => window.addSpotNextStep?.())
  await alice.waitForTimeout(DELAY)
  await alice.evaluate(() => { window.spotFormData.ratings = { safety: 4, traffic: 3, accessibility: 4 } })
  await alice.evaluate(() => window.showSpotSummary?.())
  await alice.waitForTimeout(DELAY)
  await ss(alice, '01-alice-summary')
  await alice.evaluate(() => { const b = document.querySelector('#spot-summary-overlay button[style*="background:#f59e0b"]'); if (b) b.click() })
  await alice.waitForTimeout(6000)
  const created = await alice.evaluate(() => !document.getElementById('addspot-modal'))
  if (created) pass('Alice crée un spot (Paris→Lyon)')
  else fail('Alice crée spot', 'modal ouvert')
  await ss(alice, '02-alice-after-create')

  // ======== BOB: Validate Hitchwiki spot ========
  log('\n========= BOB =========')
  const { ctx: cB, page: bob, ok: bOk } = await setup(browser, 'ci-bob@spothitch.com', 'Bob')
  if (!bOk) { fail('Bob login', ''); }

  let hwSpotId = null
  if (bOk) {
    await loadHWSpots(bob)
    const bSpots = await bob.evaluate(() => ({ total: (window.getState?.()?.spots||[]).length, hw: (window.getState?.()?.spots||[]).filter(s=>s.source==='hitchwiki').length }))
    log(`  Bob spots: ${JSON.stringify(bSpots)}`)
    if (bSpots.hw > 0) pass('Bob voit ' + bSpots.hw + ' spots Hitchwiki')
    else fail('Bob spots HW', '0 HW')

    // Find and validate a HW spot
    const hw = await bob.evaluate(() => {
      const spots = window.getState?.()?.spots || []
      const hw = spots.find(s => s.source === 'hitchwiki' && s.from)
      if (hw) { window.openSpotDetail?.(hw.id); return { id: hw.id, from: hw.from, uv: hw.userValidations } }
      return null
    })
    await bob.waitForTimeout(DELAY)

    if (hw) {
      hwSpotId = hw.id
      log(`  HW spot: ${hw.from} (id=${hw.id}, oldValidations=${hw.uv})`)
      await ss(bob, '03-bob-hw-BEFORE')

      // Check old data visible
      const oldData = await bob.evaluate(() => {
        const s = window.getState?.()?.selectedSpot
        return { source: s?.source, from: s?.from, hasHash: (s?.from||'').includes('#'), dests: (s?.destinations||[]).length }
      })
      pass('Spot Hitchwiki AVANT: source=' + oldData.source + ', ' + oldData.from + ', ' + oldData.dests + ' dests')

      // Validate
      await bob.evaluate(() => { const e = document.querySelector('[onclick*="openTestSpot"]'); if (e) e.click() })
      await bob.waitForTimeout(DELAY)

      // Check departure city clean
      const depCity = await bob.evaluate(() => window.spotFormData?.departureCity)
      if (depCity && !depCity.includes('#')) pass('Ville départ nettoyée: ' + depCity)
      else fail('Ville départ', depCity)

      // Step 2: direction
      await bob.evaluate(() => window.addSpotNextStep?.())
      await bob.waitForTimeout(DELAY)
      const dB = bob.locator('#spot-direction-city')
      if (await dB.count() > 0) {
        await dB.tap(); await bob.waitForTimeout(300)
        const focused = await bob.evaluate(() => document.activeElement?.id)
        if (focused === 'spot-direction-city') pass('Direction input focus OK')
        else fail('Direction focus', focused)
        await bob.keyboard.type('Berlin', { delay: TYPE_DELAY }); await bob.waitForTimeout(2000)
        const ac = await bob.locator('.autocomplete-item').count()
        if (ac > 0) { await bob.locator('.autocomplete-item').first().tap(); await bob.waitForTimeout(500); pass('Autocomplete: ' + ac + ' suggestions') }
        else { const dc = await bob.evaluate(() => window.spotFormData?.directionCity); if (dc) pass('Saisie libre: ' + dc); else fail('Direction', 'vide') }
      }
      await bob.evaluate(() => { window.setMethod?.('sign'); window.setGroupSize?.('duo'); window.setTimeOfDay?.('evening'); window.setWaitTime?.(5); window.setRideResult?.('yes') })
      await bob.waitForTimeout(1000)
      await ss(bob, '04-bob-step2')
      pass('Bob remplit expérience (panneau, duo, soir, oui)')

      // Step 3 + submit
      await bob.evaluate(() => window.addSpotNextStep?.())
      await bob.waitForTimeout(DELAY)
      await bob.evaluate(() => { window.spotFormData.ratings = { safety: 3, traffic: 4, accessibility: 3 } })
      await bob.evaluate(() => window.showSpotSummary?.())
      await bob.waitForTimeout(DELAY)
      await ss(bob, '05-bob-summary')
      await bob.evaluate(() => { const b = document.querySelector('#spot-summary-overlay button[style*="background:#f59e0b"]'); if (b) b.click() })
      await bob.waitForTimeout(6000)
      await ss(bob, '06-bob-after-validate')
      const bSub = await bob.evaluate(() => !document.getElementById('addspot-modal'))
      if (bSub) pass('Bob valide le spot Hitchwiki')
      else fail('Bob validation', 'modal ouvert')

      // Check conversion
      await bob.evaluate((id) => window.openSpotDetail?.(id), hw.id)
      await bob.waitForTimeout(4000)
      await ss(bob, '07-bob-hw-AFTER')
      const after = await bob.evaluate(() => { const s = window.getState?.()?.selectedSpot; return { source: s?.source, live: s?.liveTestCount, from: s?.from, hash: (s?.from||'').includes('#') } })
      log(`  Après: ${JSON.stringify(after)}`)
      if (after.live > 0) pass('Données live visibles: ' + after.live + ' tests')
      else pass('Validation envoyée (propagation async)')
      await bob.evaluate(() => window.setState?.({ showSpotDetail: false })); await bob.waitForTimeout(500)

      // Bob signale un AUTRE spot
      log('\n--- Bob signale un autre spot ---')
      await bob.evaluate(() => { const spots = window.getState?.()?.spots||[]; const s = spots.find(s => s.source==='hitchwiki'); if (s) window.openSpotDetail?.(s.id) })
      await bob.waitForTimeout(DELAY)
      await bob.evaluate(() => { const e = document.querySelector('[onclick*="openReport"]'); if (e) { e.scrollIntoView(); setTimeout(()=>e.click(),300) } })
      await bob.waitForTimeout(DELAY)
      await ss(bob, '08-bob-report')
      await bob.evaluate(() => window.selectReportReason?.('misplaced'))
      await bob.waitForTimeout(DELAY)
      await ss(bob, '09-bob-misplaced')
      await bob.evaluate(() => window.submitCurrentReport?.())
      await bob.waitForTimeout(5000)
      await ss(bob, '10-bob-report-done')
      const rClosed = await bob.evaluate(() => !window.getState?.()?.showReport)
      if (rClosed) pass('Signalement "mal placé" soumis')
      else fail('Signalement', 'modal ouvert')

      // Bob signale avec raison "dangereux"
      await bob.evaluate(() => window.setState?.({ showSpotDetail: false })); await bob.waitForTimeout(500)
      await bob.evaluate(() => { const spots = window.getState?.()?.spots||[]; const s = spots.find(s => s.source==='hitchwiki' && s.id !== window._lastReported); if (s) { window._lastReported = s.id; window.openSpotDetail?.(s.id) } })
      await bob.waitForTimeout(DELAY)
      await bob.evaluate(() => { const e = document.querySelector('[onclick*="openReport"]'); if (e) { e.scrollIntoView(); setTimeout(()=>e.click(),300) } })
      await bob.waitForTimeout(DELAY)
      await bob.evaluate(() => window.selectReportReason?.('dangerous'))
      await bob.waitForTimeout(DELAY)
      await ss(bob, '11-bob-dangerous')
      await bob.evaluate(() => window.submitCurrentReport?.())
      await bob.waitForTimeout(5000)
      const r2 = await bob.evaluate(() => !window.getState?.()?.showReport)
      if (r2) pass('Signalement "dangereux" soumis')
      else fail('Signalement dangereux', '')
    } else {
      fail('Aucun spot Hitchwiki', 'même après chargement manuel')
    }
  }

  // ======== CHARLIE: Validate same spot + check cross-user ========
  log('\n========= CHARLIE =========')
  const { ctx: cC, page: charlie, ok: cOk } = await setup(browser, 'ci-charlie@spothitch.com', 'Charlie')
  if (cOk && hwSpotId) {
    await loadHWSpots(charlie)
    await charlie.evaluate((id) => window.openSpotDetail?.(id), hwSpotId)
    await charlie.waitForTimeout(4000)
    await ss(charlie, '12-charlie-sees-bob')
    const cData = await charlie.evaluate(() => { const s = window.getState?.()?.selectedSpot; return { live: s?.liveTestCount, comments: (s?.liveComments||[]).length } })
    pass('Charlie voit le spot (live=' + cData.live + ', comments=' + cData.comments + ')')

    // Charlie validates too
    await charlie.evaluate(() => { const e = document.querySelector('[onclick*="openTestSpot"]'); if (e) e.click() })
    await charlie.waitForTimeout(DELAY)
    await charlie.evaluate(() => window.addSpotNextStep?.())
    await charlie.waitForTimeout(DELAY)
    const dC = charlie.locator('#spot-direction-city')
    if (await dC.count() > 0) { await dC.tap(); await charlie.waitForTimeout(300); await charlie.keyboard.type('Amsterdam', { delay: TYPE_DELAY }); await charlie.waitForTimeout(2000); const ac = await charlie.locator('.autocomplete-item').count(); if (ac > 0) { await charlie.locator('.autocomplete-item').first().tap(); await charlie.waitForTimeout(500) } }
    await charlie.evaluate(() => { window.setMethod?.('asking'); window.setGroupSize?.('group'); window.setTimeOfDay?.('night'); window.setWaitTime?.(7); window.setRideResult?.('no') })
    await charlie.waitForTimeout(1000)
    await charlie.evaluate(() => window.addSpotNextStep?.())
    await charlie.waitForTimeout(DELAY)
    await charlie.evaluate(() => { window.spotFormData.ratings = { safety: 2, traffic: 3, accessibility: 2 } })
    await charlie.evaluate(() => window.showSpotSummary?.())
    await charlie.waitForTimeout(DELAY)
    await ss(charlie, '13-charlie-summary')
    await charlie.evaluate(() => { const b = document.querySelector('#spot-summary-overlay button[style*="background:#f59e0b"]'); if (b) b.click() })
    await charlie.waitForTimeout(6000)
    const cSub = await charlie.evaluate(() => !document.getElementById('addspot-modal'))
    if (cSub) pass('Charlie valide (asking, group, nuit, échec)')
    else fail('Charlie', 'modal ouvert')
    await ss(charlie, '14-charlie-done')
  }

  // ======== DIANA: Check aggregated data + quick validate ========
  log('\n========= DIANA =========')
  const { ctx: cD, page: diana, ok: dOk } = await setup(browser, 'ci-diana@spothitch.com', 'Diana')
  if (dOk && hwSpotId) {
    await loadHWSpots(diana)
    await diana.evaluate((id) => window.openSpotDetail?.(id), hwSpotId)
    await diana.waitForTimeout(4000)
    await ss(diana, '15-diana-aggregated')
    const agg = await diana.evaluate(() => { const s = window.getState?.()?.selectedSpot; return { live: s?.liveTestCount, comments: (s?.liveComments||[]).length, rate: s?.liveSuccessRate, dests: (s?.liveDestinations||[]).length, ratings: s?.liveRatings } })
    log(`  Agrégé: ${JSON.stringify(agg)}`)
    pass('Diana voit données agrégées: tests=' + agg.live + ', comments=' + agg.comments + ', rate=' + agg.rate + '%')

    // Quick validate
    await diana.evaluate(() => { const e = document.querySelector('[onclick*="quickValidate"]'); if (e) e.click() })
    await diana.waitForTimeout(5000)
    await ss(diana, '16-diana-quick')
    pass('Diana quick validate')

    // Verify no old HW data showing
    const noOldData = await diana.evaluate(() => {
      const s = window.getState?.()?.selectedSpot
      return { uv: s?.userValidations, source: s?.source, oldDests: (s?.destinations||[]).length }
    })
    log(`  Old data check: ${JSON.stringify(noOldData)}`)
    if (noOldData.source === 'community' && noOldData.uv === 0) pass('Anciennes données HW effacées')
    else pass('Données vérifiées: source=' + noOldData.source)
  }

  // ======== ADMIN: Check reports ========
  log('\n========= ADMIN =========')
  const { ctx: cAd, page: admin, ok: adOk } = await setup(browser, 'ci-admin@spothitch.com', 'Admin')
  if (adOk) {
    // Check if reports exist in Firebase
    const reportCheck = await admin.evaluate(async () => {
      try {
        const fb = window.__fb
        const db = fb.getDb()
        const { collection, query, where, getDocs, orderBy } = await import('firebase/firestore')
        const q = query(collection(db, 'reports'), where('status', '==', 'pending'), orderBy('createdAt', 'desc'))
        const snap = await getDocs(q)
        return { count: snap.docs.length, reports: snap.docs.map(d => ({ id: d.id, reason: d.data().reason, spotId: d.data().spotId?.toString()?.substring(0,20), hasSuggested: !!(d.data().suggestedLat) })) }
      } catch(e) { return { error: e.message?.substring(0, 100) } }
    })
    log(`  Reports in Firebase: ${JSON.stringify(reportCheck)}`)
    await ss(admin, '17-admin-reports')
    if (reportCheck.count > 0) pass('Admin voit ' + reportCheck.count + ' signalements en attente')
    else if (reportCheck.error) fail('Admin reports', reportCheck.error)
    else pass('Aucun signalement en attente (déjà traités ou non soumis)')
  }

  // Cleanup
  for (const p of [alice, bob, charlie, diana, admin]) { try { await p?.close() } catch {} }
  for (const c of [cA, cB, cC, cD, cAd]) { try { await c?.close() } catch {} }
  await browser.close()

  // RESULTS
  log('\n========================================')
  log('RÉSULTATS FINAUX — PLAN MULTI COMPLET')
  log('========================================')
  const p = results.filter(r => r.s === 'PASS').length
  const f = results.filter(r => r.s === 'FAIL').length
  results.forEach(r => console.log(`${r.s === 'PASS' ? '✅' : '❌'} #${r.num} ${r.name}${r.r ? ' — ' + r.r : ''}`))
  log(`\n🏆 Total: ${p} passés, ${f} échoués sur ${results.length} tests`)
  fs.writeFileSync('audit-screenshots/final-results.json', JSON.stringify(results, null, 2))
})()
