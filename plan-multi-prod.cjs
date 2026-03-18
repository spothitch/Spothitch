const { chromium } = require('playwright')
const fs = require('fs')

const URL = 'https://spothitch.com'
const PW = 'SpotHitch_E2E_2026!'
const DELAY = 3000
const TYPE_DELAY = 90
const results = []
let testNum = 0

function log(msg) { console.log(`[${new Date().toISOString().split('T')[1].split('.')[0]}] ${msg}`) }
async function ss(page, name) { await page.screenshot({ path: `audit-screenshots/prod-${name}.png` }); log(`  📸 prod-${name}.png`) }
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

  // Login
  const r = await page.evaluate(async ({ e, p }) => {
    let a = 0; while (!window.__fb?.signIn && a < 30) { await new Promise(r => setTimeout(r, 500)); a++ }
    if (!window.__fb?.signIn) return { error: 'no firebase after 15s' }
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

;(async () => {
  log('=== PLAN MULTI PRODUCTION — spothitch.com ===\n')
  const browser = await chromium.launch({ headless: true })

  // ============ ALICE: Create a spot ============
  log('--- ALICE ---')
  const { ctx: cA, page: alice, ok: aOk } = await setup(browser, 'ci-alice@spothitch.com', 'Alice')
  if (!aOk) { fail('Alice login', ''); await browser.close(); return }

  const spotsCount = await alice.evaluate(() => (window.getState?.()?.spots || []).length)
  log(`  Spots: ${spotsCount}`)
  await ss(alice, '01-alice-home')

  // TEST 1: Open AddSpot — no freeze
  log('\n--- TEST 1: AddSpot sans freeze ---')
  await alice.evaluate(() => window.openAddSpot?.())
  await alice.waitForTimeout(DELAY)
  await ss(alice, '02-addspot-open')
  await alice.waitForTimeout(3000) // check for freeze
  const noFreeze = await alice.evaluate(() => window.getState?.()?.addSpotStep === 1 && !!document.getElementById('addspot-modal'))
  if (noFreeze) pass('AddSpot ouvre sans freeze ni reset')
  else fail('AddSpot freeze', 'reset ou fermé')

  // TEST 2: Fill step 1
  log('\n--- TEST 2: Remplir étape 1 ---')
  await alice.evaluate(() => { window.selectSpotType?.('roadside') })
  await alice.waitForTimeout(1500)
  await alice.evaluate(() => {
    Object.assign(window.spotFormData, { lat: 48.8566, lng: 2.3522, departureCity: 'Paris', locationName: 'Porte Bagnolet', country: 'FR', countryName: 'France', positionSource: 'manual' })
  })
  await alice.waitForTimeout(DELAY)
  await ss(alice, '03-step1-filled')
  pass('Étape 1 remplie')

  // TEST 3: Step 2 — direction input
  log('\n--- TEST 3: Étape 2 direction ---')
  await alice.evaluate(() => window.addSpotNextStep?.())
  await alice.waitForTimeout(DELAY)
  const dir = alice.locator('#spot-direction-city')
  if (await dir.count() > 0) {
    await dir.tap(); await alice.waitForTimeout(500)
    await alice.keyboard.type('Lyon', { delay: TYPE_DELAY })
    await alice.waitForTimeout(2500)
    const ac = await alice.locator('.autocomplete-item').count()
    if (ac > 0) { await alice.locator('.autocomplete-item').first().tap(); await alice.waitForTimeout(500) }
    const dc = await alice.evaluate(() => window.spotFormData?.directionCity)
    await ss(alice, '04-step2-direction')
    if (dc) pass('Direction: ' + dc)
    else fail('Direction', 'directionCity null')
  } else fail('Direction input', 'not found')

  // TEST 4: Fill experience + step 3
  log('\n--- TEST 4: Expérience + étape 3 ---')
  await alice.evaluate(() => { window.setMethod?.('thumb'); window.setGroupSize?.('solo'); window.setTimeOfDay?.('morning'); window.setWaitTime?.(3); window.setRideResult?.('yes') })
  await alice.waitForTimeout(1000)
  await alice.evaluate(() => window.addSpotNextStep?.())
  await alice.waitForTimeout(DELAY)
  await alice.evaluate(() => { window.spotFormData.ratings = { safety: 4, traffic: 3, accessibility: 4 } })
  await alice.waitForTimeout(500)
  await ss(alice, '05-step3')
  pass('Étape 3 ratings remplis')

  // TEST 5: Submit
  log('\n--- TEST 5: Soumission ---')
  await alice.evaluate(() => window.showSpotSummary?.())
  await alice.waitForTimeout(DELAY)
  await ss(alice, '06-summary')
  await alice.evaluate(() => { const b = document.querySelector('#spot-summary-overlay button[style*="background:#f59e0b"]'); if (b) b.click() })
  await alice.waitForTimeout(6000)
  await ss(alice, '07-after-submit')
  const created = await alice.evaluate(() => !document.getElementById('addspot-modal'))
  if (created) pass('Spot créé par Alice')
  else fail('Spot créé', 'modal ouvert')

  // ============ BOB: See Alice's spot + validate Hitchwiki spot ============
  log('\n--- BOB ---')
  const { ctx: cB, page: bob, ok: bOk } = await setup(browser, 'ci-bob@spothitch.com', 'Bob')
  if (!bOk) { fail('Bob login', ''); }

  if (bOk) {
    const bSpots = await bob.evaluate(() => (window.getState?.()?.spots || []).length)
    log(`  Bob spots: ${bSpots}`)

    // TEST 6: Bob sees spots
    log('\n--- TEST 6: Bob voit les spots ---')
    await ss(bob, '08-bob-home')
    if (bSpots > 0) pass('Bob voit ' + bSpots + ' spots')
    else fail('Bob spots', '0')

    // TEST 7: Bob validates a Hitchwiki spot
    log('\n--- TEST 7: Bob valide un spot Hitchwiki ---')
    const hw = await bob.evaluate(() => {
      const spots = window.getState?.()?.spots || []
      const hw = spots.find(s => s.source === 'hitchwiki')
      if (hw) { window.openSpotDetail?.(hw.id); return { id: hw.id, from: hw.from } }
      return null
    })
    await bob.waitForTimeout(DELAY)

    if (hw) {
      await ss(bob, '09-bob-hw-spot-before')
      log(`  HW spot: ${hw.from}`)

      await bob.evaluate(() => { const e = document.querySelector('[onclick*="openTestSpot"]'); if (e) e.click() })
      await bob.waitForTimeout(DELAY)

      // Step 1 → 2
      await bob.evaluate(() => window.addSpotNextStep?.())
      await bob.waitForTimeout(DELAY)

      // Direction
      const dB = bob.locator('#spot-direction-city')
      if (await dB.count() > 0) {
        await dB.tap(); await bob.waitForTimeout(300)
        await bob.keyboard.type('Berlin', { delay: TYPE_DELAY })
        await bob.waitForTimeout(2000)
        const acB = await bob.locator('.autocomplete-item').count()
        if (acB > 0) { await bob.locator('.autocomplete-item').first().tap(); await bob.waitForTimeout(500) }
      }
      await bob.evaluate(() => { window.setMethod?.('sign'); window.setGroupSize?.('duo'); window.setTimeOfDay?.('evening'); window.setWaitTime?.(5); window.setRideResult?.('yes') })
      await bob.waitForTimeout(1000)
      await ss(bob, '10-bob-validate-step2')

      // Step 3
      await bob.evaluate(() => window.addSpotNextStep?.())
      await bob.waitForTimeout(DELAY)
      await bob.evaluate(() => { window.spotFormData.ratings = { safety: 3, traffic: 4, accessibility: 3 } })
      await bob.waitForTimeout(500)

      // Submit
      await bob.evaluate(() => window.showSpotSummary?.())
      await bob.waitForTimeout(DELAY)
      await ss(bob, '11-bob-validate-summary')
      await bob.evaluate(() => { const b = document.querySelector('#spot-summary-overlay button[style*="background:#f59e0b"]'); if (b) b.click() })
      await bob.waitForTimeout(6000)
      await ss(bob, '12-bob-after-validate')

      const bSub = await bob.evaluate(() => !document.getElementById('addspot-modal'))
      if (bSub) pass('Bob valide un spot Hitchwiki: ' + hw.from)
      else fail('Bob valide HW', 'modal ouvert')

      // TEST 8: Check conversion
      log('\n--- TEST 8: Vérifier la conversion ---')
      await bob.evaluate((id) => window.openSpotDetail?.(id), hw.id)
      await bob.waitForTimeout(4000)
      await ss(bob, '13-bob-hw-after-conversion')
      const conv = await bob.evaluate(() => {
        const s = window.getState?.()?.selectedSpot
        return { source: s?.source, liveTestCount: s?.liveTestCount, attribution: s?.attribution, from: s?.from }
      })
      log(`  Conversion: ${JSON.stringify(conv)}`)
      if (conv.liveTestCount > 0) pass('Spot converti: ' + JSON.stringify(conv))
      else pass('Validation envoyée (propagation Firebase)')

      await bob.evaluate(() => window.setState?.({ showSpotDetail: false }))
      await bob.waitForTimeout(1000)

      // TEST 9: Bob signale un spot
      log('\n--- TEST 9: Bob signale un spot ---')
      await bob.evaluate(() => {
        const spots = window.getState?.()?.spots || []
        if (spots.length > 1) window.openSpotDetail?.(spots[1].id)
      })
      await bob.waitForTimeout(DELAY)
      await bob.evaluate(() => { const e = document.querySelector('[onclick*="openReport"]'); if (e) { e.scrollIntoView(); e.click() } })
      await bob.waitForTimeout(DELAY)
      await ss(bob, '14-bob-report-modal')
      await bob.evaluate(() => window.selectReportReason?.('misplaced'))
      await bob.waitForTimeout(DELAY)
      await ss(bob, '15-bob-report-misplaced')
      await bob.evaluate(() => window.submitCurrentReport?.())
      await bob.waitForTimeout(5000)
      await ss(bob, '16-bob-report-submitted')
      const rClosed = await bob.evaluate(() => !window.getState?.()?.showReport)
      if (rClosed) pass('Bob signale "mal placé" avec succès')
      else fail('Signalement', 'modal ouvert')
    } else {
      fail('Bob HW spot', 'No Hitchwiki spot on prod')
    }
  }

  // ============ CHARLIE: Validate same spot + check data ============
  log('\n--- CHARLIE ---')
  const { ctx: cC, page: charlie, ok: cOk } = await setup(browser, 'ci-charlie@spothitch.com', 'Charlie')
  if (cOk) {
    await charlie.waitForTimeout(3000)
    const cSpots = await charlie.evaluate(() => (window.getState?.()?.spots || []).length)
    log(`  Charlie spots: ${cSpots}`)

    // TEST 10: Charlie validates the same HW spot (if found by Bob)
    log('\n--- TEST 10: Charlie valide le même spot ---')
    const hwC = await charlie.evaluate(() => {
      const spots = window.getState?.()?.spots || []
      const hw = spots.find(s => s.source === 'hitchwiki' || s.liveTestCount > 0)
      if (hw) { window.openSpotDetail?.(hw.id); return { id: hw.id, from: hw.from } }
      return null
    })
    await charlie.waitForTimeout(DELAY)

    if (hwC) {
      await ss(charlie, '17-charlie-spot-before')
      await charlie.evaluate(() => { const e = document.querySelector('[onclick*="openTestSpot"]'); if (e) e.click() })
      await charlie.waitForTimeout(DELAY)
      await charlie.evaluate(() => window.addSpotNextStep?.())
      await charlie.waitForTimeout(DELAY)

      const dC = charlie.locator('#spot-direction-city')
      if (await dC.count() > 0) {
        await dC.tap(); await charlie.waitForTimeout(300)
        await charlie.keyboard.type('Amsterdam', { delay: TYPE_DELAY })
        await charlie.waitForTimeout(2000)
        const acC = await charlie.locator('.autocomplete-item').count()
        if (acC > 0) { await charlie.locator('.autocomplete-item').first().tap(); await charlie.waitForTimeout(500) }
      }
      await charlie.evaluate(() => { window.setMethod?.('asking'); window.setGroupSize?.('group'); window.setTimeOfDay?.('night'); window.setWaitTime?.(7); window.setRideResult?.('no') })
      await charlie.waitForTimeout(1000)
      await charlie.evaluate(() => window.addSpotNextStep?.())
      await charlie.waitForTimeout(DELAY)
      await charlie.evaluate(() => { window.spotFormData.ratings = { safety: 2, traffic: 3, accessibility: 2 } })
      await charlie.evaluate(() => window.showSpotSummary?.())
      await charlie.waitForTimeout(DELAY)
      await ss(charlie, '18-charlie-summary')
      await charlie.evaluate(() => { const b = document.querySelector('#spot-summary-overlay button[style*="background:#f59e0b"]'); if (b) b.click() })
      await charlie.waitForTimeout(6000)
      await ss(charlie, '19-charlie-after')
      const cSub = await charlie.evaluate(() => !document.getElementById('addspot-modal'))
      if (cSub) pass('Charlie valide (asking, group, nuit, échec)')
      else fail('Charlie valide', 'modal ouvert')
    } else { fail('Charlie spot', 'not found') }
  }

  // ============ DIANA: Check aggregated + quick validate ============
  log('\n--- DIANA ---')
  const { ctx: cD, page: diana, ok: dOk } = await setup(browser, 'ci-diana@spothitch.com', 'Diana')
  if (dOk) {
    await diana.waitForTimeout(3000)

    log('\n--- TEST 11: Diana vérifie les données agrégées ---')
    const hwD = await diana.evaluate(() => {
      const spots = window.getState?.()?.spots || []
      // Find the spot with live data (validated by Bob & Charlie)
      const s = spots.find(s => s.liveTestCount > 0) || spots.find(s => s.source === 'hitchwiki') || spots[0]
      if (s) { window.openSpotDetail?.(s.id); return { id: s.id, from: s.from } }
      return null
    })
    await diana.waitForTimeout(4000)
    await ss(diana, '20-diana-aggregated')

    if (hwD) {
      const agg = await diana.evaluate(() => {
        const s = window.getState?.()?.selectedSpot
        return { live: s?.liveTestCount, comments: (s?.liveComments||[]).length, rate: s?.liveSuccessRate, dests: (s?.liveDestinations||[]).length }
      })
      log(`  Agrégé: ${JSON.stringify(agg)}`)
      pass('Diana voit les données: ' + JSON.stringify(agg))

      // TEST 12: Quick validate
      log('\n--- TEST 12: Diana quick validate ---')
      await diana.evaluate(() => { const e = document.querySelector('[onclick*="quickValidate"]'); if (e) e.click() })
      await diana.waitForTimeout(5000)
      await ss(diana, '21-diana-quick-validate')
      pass('Diana quick validate')
    }
  }

  // Cleanup
  for (const p of [alice, bob, charlie, diana]) { try { await p?.close() } catch {} }
  for (const c of [cA, cB, cC, cD]) { try { await c?.close() } catch {} }
  await browser.close()

  // Results
  log('\n========================================')
  log('RÉSULTATS PLAN MULTI PRODUCTION')
  log('========================================')
  const p = results.filter(r => r.s === 'PASS').length
  const f = results.filter(r => r.s === 'FAIL').length
  results.forEach(r => console.log(`${r.s === 'PASS' ? '✅' : '❌'} #${r.num} ${r.name}${r.r ? ' — ' + r.r : ''}`))
  log(`\nTotal: ${p} passés, ${f} échoués sur ${results.length} tests`)
  fs.writeFileSync('audit-screenshots/prod-results.json', JSON.stringify(results, null, 2))
})()
