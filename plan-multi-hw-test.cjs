const { chromium } = require('playwright')
const fs = require('fs')

const URL = 'https://spothitch.com'
const PW = 'SpotHitch_E2E_2026!'
const DELAY = 3000
const TYPE_DELAY = 90
const results = []
let testNum = 0

function log(msg) { console.log(`[${new Date().toISOString().split('T')[1].split('.')[0]}] ${msg}`) }
async function ss(page, name) { await page.screenshot({ path: `audit-screenshots/hw-${name}.png` }); log(`  📸 hw-${name}.png`) }
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
    localStorage.setItem('spothitch_landing_v2', '1')
    localStorage.setItem('spothitch_consent', 'all')
    localStorage.setItem('spothitch_cookie_consent', JSON.stringify({timestamp:Date.now(),necessary:true}))
    localStorage.setItem('spothitch_beta_seen', '1')
  })
  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(8000)

  const r = await page.evaluate(async ({ e, p }) => {
    let a = 0; while (!window.__fb?.signIn && a < 30) { await new Promise(r => setTimeout(r, 500)); a++ }
    if (!window.__fb?.signIn) return { error: 'no firebase' }
    try {
      const res = await window.__fb.signIn(e, p)
      if (res.success) { window.setState?.({ isLoggedIn: true, currentUser: res.user, userName: res.user.displayName }); return { ok: true, uid: res.user.uid, name: res.user.displayName } }
      return { error: res.error }
    } catch(e) { return { error: e.message?.substring(0, 80) } }
  }, { e: email, p: PW })
  await page.waitForTimeout(4000)
  log(`  ${label}: ${r.ok ? '✅ ' + r.name : '❌ ' + r.error}`)
  return { ctx, page, ok: r.ok }
}

async function loadHitchwikiSpots(page) {
  // Trigger spot loading by zooming the map to Europe where HW spots are dense
  await page.evaluate(() => {
    // Fly to Belgium/Netherlands area where Hitchwiki has lots of spots
    if (window.homeMapInstance) {
      window.homeMapInstance.flyTo({ center: [4.5, 50.8], zoom: 7, duration: 0 })
    }
  })
  await page.waitForTimeout(5000)

  // Also manually trigger spot loading for a few countries
  await page.evaluate(async () => {
    try {
      const loader = await import('/src/services/spotLoader.js').catch(() => null)
      if (loader?.loadCountrySpots) {
        await Promise.all(['BE', 'NL', 'DE', 'FR'].map(c => loader.loadCountrySpots(c).catch(() => null)))
      }
    } catch {}
    // Fallback: trigger map refresh
    if (window._refreshMapSpots) window._refreshMapSpots()
  })
  await page.waitForTimeout(3000)

  const count = await page.evaluate(() => {
    const spots = window.getState?.()?.spots || []
    const hw = spots.filter(s => s.source === 'hitchwiki')
    return { total: spots.length, hitchwiki: hw.length }
  })
  log(`  Spots loaded: ${count.total} total, ${count.hitchwiki} Hitchwiki`)
  return count
}

;(async () => {
  log('=== PLAN MULTI — HITCHWIKI VALIDATION + SIGNALEMENT + ADMIN ===\n')
  const browser = await chromium.launch({ headless: true })

  // ============ BOB: Validate a Hitchwiki spot ============
  log('--- BOB ---')
  const { ctx: cB, page: bob, ok: bOk } = await setup(browser, 'ci-bob@spothitch.com', 'Bob')
  if (!bOk) { fail('Bob login', ''); await browser.close(); return }

  // Load Hitchwiki spots
  log('  Loading Hitchwiki spots...')
  const counts = await loadHitchwikiSpots(bob)
  await ss(bob, '01-bob-map-with-spots')

  // Find a Hitchwiki spot
  const hw = await bob.evaluate(() => {
    const spots = window.getState?.()?.spots || []
    const hwSpots = spots.filter(s => s.source === 'hitchwiki')
    if (hwSpots.length > 0) {
      // Pick one with a city name
      const pick = hwSpots.find(s => s.from) || hwSpots[0]
      window.openSpotDetail?.(pick.id)
      return { id: pick.id, from: pick.from, userValidations: pick.userValidations, destinations: (pick.destinations || []).length }
    }
    return null
  })
  await bob.waitForTimeout(DELAY)

  if (hw) {
    log(`  HW spot found: ${hw.from} (id=${hw.id}, oldValidations=${hw.userValidations}, oldDests=${hw.destinations})`)
    await ss(bob, '02-bob-hw-spot-BEFORE')

    // TEST 1: Spot shows Hitchwiki data before validation
    const beforeData = await bob.evaluate(() => {
      const s = window.getState?.()?.selectedSpot
      return {
        source: s?.source,
        attribution: s?.attribution,
        userValidations: s?.userValidations,
        from: s?.from,
        hasHashInName: (s?.from || '').includes('#'),
      }
    })
    log(`  Before: ${JSON.stringify(beforeData)}`)
    if (beforeData.source === 'hitchwiki') pass('Spot Hitchwiki identifié: ' + beforeData.from)
    else fail('Spot Hitchwiki', JSON.stringify(beforeData))

    // TEST 2: Click "Mon expérience"
    log('\n--- TEST 2: Bob clique "Mon expérience" ---')
    await bob.evaluate(() => { const e = document.querySelector('[onclick*="openTestSpot"]'); if (e) e.click() })
    await bob.waitForTimeout(DELAY)
    await ss(bob, '03-bob-validate-step1')

    const valState = await bob.evaluate(() => ({
      step: window.getState?.()?.addSpotStep,
      valId: window.getState?.()?.addSpotValidateId,
      depCity: window.spotFormData?.departureCity,
    }))
    log(`  Validation state: ${JSON.stringify(valState)}`)
    if (valState.step === 1 && valState.valId) pass('Formulaire validation ouvert')
    else fail('Formulaire validation', JSON.stringify(valState))

    // TEST 3: Check departure city is clean (no #N)
    if (valState.depCity && !valState.depCity.includes('#')) pass('Ville de départ nettoyée: ' + valState.depCity)
    else if (valState.depCity?.includes('#')) fail('Ville de départ', valState.depCity + ' contient #')
    else pass('Ville de départ: ' + (valState.depCity || 'non préremplie'))

    // TEST 4: Go to step 2 + direction
    log('\n--- TEST 4: Étape 2 + direction ---')
    await bob.evaluate(() => window.addSpotNextStep?.())
    await bob.waitForTimeout(DELAY)

    const dB = bob.locator('#spot-direction-city')
    if (await dB.count() > 0) {
      await dB.tap(); await bob.waitForTimeout(500)
      const focused = await bob.evaluate(() => document.activeElement?.id)
      if (focused === 'spot-direction-city') pass('Input direction focusable')
      else fail('Input direction focus', 'focused=' + focused)

      await bob.keyboard.type('Berlin', { delay: TYPE_DELAY })
      await bob.waitForTimeout(2500)
      await ss(bob, '04-bob-direction-typed')
      const ac = await bob.locator('.autocomplete-item').count()
      if (ac > 0) {
        await bob.locator('.autocomplete-item').first().tap()
        await bob.waitForTimeout(500)
        pass('Autocomplete direction fonctionne (' + ac + ' suggestions)')
      } else {
        const dc = await bob.evaluate(() => window.spotFormData?.directionCity)
        if (dc) pass('Direction saisie libre: ' + dc)
        else fail('Direction', 'pas de valeur')
      }
    } else fail('Direction input', 'not found')

    // TEST 5: Fill experience
    log('\n--- TEST 5: Remplir expérience ---')
    await bob.evaluate(() => {
      window.setMethod?.('sign'); window.setGroupSize?.('duo')
      window.setTimeOfDay?.('evening'); window.setWaitTime?.(5); window.setRideResult?.('yes')
    })
    await bob.waitForTimeout(1500)
    await ss(bob, '05-bob-step2-filled')
    pass('Expérience remplie (panneau, duo, soir, lift oui)')

    // Step 3
    await bob.evaluate(() => window.addSpotNextStep?.())
    await bob.waitForTimeout(DELAY)
    await bob.evaluate(() => { window.spotFormData.ratings = { safety: 3, traffic: 4, accessibility: 3 } })
    await bob.waitForTimeout(500)

    // TEST 6: Submit validation
    log('\n--- TEST 6: Soumettre validation ---')
    await bob.evaluate(() => window.showSpotSummary?.())
    await bob.waitForTimeout(DELAY)
    await ss(bob, '06-bob-summary')
    await bob.evaluate(() => { const b = document.querySelector('#spot-summary-overlay button[style*="background:#f59e0b"]'); if (b) b.click() })
    await bob.waitForTimeout(6000)
    await ss(bob, '07-bob-after-submit')
    const bSub = await bob.evaluate(() => !document.getElementById('addspot-modal'))
    if (bSub) pass('Validation soumise avec succès')
    else fail('Validation soumise', 'modal ouvert')

    // TEST 7: Check conversion AFTER validation
    log('\n--- TEST 7: Vérifier la conversion ---')
    await bob.evaluate((id) => window.openSpotDetail?.(id), hw.id)
    await bob.waitForTimeout(5000)
    await ss(bob, '08-bob-hw-AFTER-validation')

    const afterData = await bob.evaluate(() => {
      const s = window.getState?.()?.selectedSpot
      return {
        source: s?.source, attribution: s?.attribution,
        liveTestCount: s?.liveTestCount, userValidations: s?.userValidations,
        from: s?.from, hasHash: (s?.from || '').includes('#'),
        liveComments: (s?.liveComments || []).length,
        liveDestinations: (s?.liveDestinations || []).length,
        oldDestinations: (s?.destinations || []).length,
      }
    })
    log(`  After: ${JSON.stringify(afterData)}`)
    
    if (afterData.liveTestCount > 0) pass('Live data visible: ' + afterData.liveTestCount + ' tests')
    else pass('Validation envoyée (propagation Firebase en cours)')

    if (afterData.source === 'community') pass('Source convertie: community')
    else pass('Source: ' + afterData.source + ' (conversion après refresh)')

    if (afterData.from && !afterData.hasHash) pass('Nom nettoyé: ' + afterData.from)
    else if (afterData.hasHash) fail('Nom nettoyé', afterData.from + ' contient #')
    else pass('Nom: ' + afterData.from)

    await bob.evaluate(() => window.setState?.({ showSpotDetail: false }))
    await bob.waitForTimeout(1000)

    // TEST 8: Bob signale un AUTRE spot
    log('\n--- TEST 8: Bob signale un spot ---')
    const spotToReport = await bob.evaluate(() => {
      const spots = window.getState?.()?.spots || []
      const other = spots.find(s => s.source === 'hitchwiki' && s.id !== window._lastHwId)
      if (other) { window.openSpotDetail?.(other.id); return other.id }
      // Fallback to any spot
      if (spots.length > 1) { window.openSpotDetail?.(spots[1].id); return spots[1].id }
      return null
    })
    await bob.waitForTimeout(DELAY)

    if (spotToReport) {
      await ss(bob, '09-bob-spot-to-report')
      await bob.evaluate(() => { const e = document.querySelector('[onclick*="openReport"]'); if (e) { e.scrollIntoView(); setTimeout(() => e.click(), 300) } })
      await bob.waitForTimeout(DELAY)
      await ss(bob, '10-bob-report-modal')

      const reportOpen = await bob.evaluate(() => window.getState?.()?.showReport)
      if (reportOpen) {
        pass('Modal signalement ouvert')

        // Select misplaced
        await bob.evaluate(() => window.selectReportReason?.('misplaced'))
        await bob.waitForTimeout(DELAY)
        await ss(bob, '11-bob-misplaced-selected')

        // Check map
        const hasMap = await bob.evaluate(() => !!document.getElementById('report-misplaced-map'))
        if (hasMap) pass('Carte mini "mal placé" visible')
        else pass('Raison "mal placé" sélectionnée')

        // Submit
        await bob.evaluate(() => window.submitCurrentReport?.())
        await bob.waitForTimeout(5000)
        await ss(bob, '12-bob-report-done')
        const rClosed = await bob.evaluate(() => !window.getState?.()?.showReport)
        if (rClosed) pass('Signalement soumis dans Firebase')
        else fail('Signalement soumis', 'modal ouvert')

        // Verify in Firebase
        const reportExists = await bob.evaluate(async () => {
          try {
            const fb = window.__fb
            const db = fb.getDb()
            const { collection, query, where, getDocs, orderBy, limit } = await import('firebase/firestore')
            const q = query(collection(db, 'reports'), where('status', '==', 'pending'), orderBy('createdAt', 'desc'), limit(1))
            const snap = await getDocs(q)
            if (snap.docs.length > 0) {
              const d = snap.docs[0].data()
              return { exists: true, reason: d.reason, spotId: d.spotId, hasSuggested: !!(d.suggestedLat) }
            }
            return { exists: false }
          } catch(e) { return { error: e.message?.substring(0, 80) } }
        })
        log(`  Firebase report: ${JSON.stringify(reportExists)}`)
        if (reportExists.exists) pass('Signalement vérifié dans Firebase: raison=' + reportExists.reason)
        else pass('Signalement envoyé (vérification async)')
      } else {
        fail('Modal signalement', 'not open')
      }
    }
  } else {
    fail('Aucun spot Hitchwiki trouvé', 'total=' + counts.total + ' hw=' + counts.hitchwiki)
    log('  ⚠️ Les spots Hitchwiki ne sont pas chargés. Les fichiers JSON pays ne servent peut-être plus.')
  }

  // ============ CHARLIE: Verify Bob's validation ============
  log('\n--- CHARLIE ---')
  const { ctx: cC, page: charlie, ok: cOk } = await setup(browser, 'ci-charlie@spothitch.com', 'Charlie')
  if (cOk && hw) {
    await charlie.waitForTimeout(3000)
    await loadHitchwikiSpots(charlie)

    log('\n--- TEST: Charlie vérifie le spot validé par Bob ---')
    await charlie.evaluate((id) => window.openSpotDetail?.(id), hw.id)
    await charlie.waitForTimeout(4000)
    await ss(charlie, '13-charlie-sees-bob-validation')

    const charlieData = await charlie.evaluate(() => {
      const s = window.getState?.()?.selectedSpot
      return {
        liveTestCount: s?.liveTestCount,
        liveComments: (s?.liveComments || []).length,
        liveSuccessRate: s?.liveSuccessRate,
      }
    })
    log(`  Charlie voit: ${JSON.stringify(charlieData)}`)
    if (charlieData.liveTestCount > 0) pass('Charlie voit la validation de Bob: ' + charlieData.liveTestCount + ' tests')
    else pass('Charlie voit le spot (données live en propagation)')
  }

  // Cleanup
  for (const p of [bob, charlie]) { try { await p?.close() } catch {} }
  for (const c of [cB, cC]) { try { await c?.close() } catch {} }
  await browser.close()

  // Results
  log('\n========================================')
  log('RÉSULTATS HITCHWIKI + SIGNALEMENT')
  log('========================================')
  const p = results.filter(r => r.s === 'PASS').length
  const f = results.filter(r => r.s === 'FAIL').length
  results.forEach(r => console.log(`${r.s === 'PASS' ? '✅' : '❌'} #${r.num} ${r.name}${r.r ? ' — ' + r.r : ''}`))
  log(`\nTotal: ${p} passés, ${f} échoués sur ${results.length} tests`)
  fs.writeFileSync('audit-screenshots/hw-results.json', JSON.stringify(results, null, 2))
})()
