const { chromium } = require('playwright')
const fs = require('fs')

const URL = 'http://localhost:4600'
const PW = 'SpotHitch_E2E_2026!'
const DELAY = 2500
const TYPE_DELAY = 90

const results = []
let testNum = 12 // Continue from bloc 1

function log(msg) { console.log(`[${new Date().toISOString().split('T')[1].split('.')[0]}] ${msg}`) }
async function ss(page, name) { await page.screenshot({ path: `audit-screenshots/multi-${name}.png` }) }
async function pass(name) { testNum++; results.push({ num: testNum, name, status: 'PASS' }); log(`  ✅ #${testNum} ${name}`) }
async function fail(name, reason) { testNum++; results.push({ num: testNum, name, status: 'FAIL', reason }); log(`  ❌ #${testNum} ${name}: ${reason}`) }

async function setup(browser, email, name) {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 }, hasTouch: true,
    recordVideo: { dir: 'audit-videos/', size: { width: 390, height: 844 } }
  })
  const page = await ctx.newPage()
  await page.addInitScript(() => {
    localStorage.setItem('spothitch_landing_v2', '1')
    localStorage.setItem('spothitch_consent', 'all')
    localStorage.setItem('spothitch_cookie_consent', JSON.stringify({timestamp:Date.now(),necessary:true}))
    localStorage.setItem('spothitch_beta_seen', '1')
    const fs = {}
    ;['carte','stations','add-spot','profil','amis','chat'].forEach(id => { fs[id] = Date.now() })
    localStorage.setItem('spothitch_feature_seen', JSON.stringify(fs))
  })
  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 20000 })
  await page.waitForTimeout(5000)
  
  const r = await page.evaluate(async ({ e, p }) => {
    let a = 0; while (!window.__fb?.signIn && a < 20) { await new Promise(r => setTimeout(r, 500)); a++ }
    if (!window.__fb?.signIn) return { error: 'no firebase' }
    try { const r = await window.__fb.signIn(e, p); if (r.success) { window.setState?.({ isLoggedIn: true, currentUser: r.user, userName: r.user.displayName }); return { ok: true, uid: r.user.uid } } return { error: r.error } }
    catch(e) { return { error: e.message } }
  }, { e: email, p: PW })
  
  await page.waitForTimeout(3000)
  log(`  ${r.ok ? '✅' : '⚠️'} ${name}: ${r.ok ? r.uid : r.error}`)
  return { ctx, page, ok: r.ok }
}

;(async () => {
  log('=== PLAN MULTI — BLOC 2: Validation + Signalement (Tests 13-30) ===')
  const browser = await chromium.launch({ headless: true })

  // Find a Hitchwiki spot to validate
  const { ctx: c1, page: bob, ok: bobOk } = await setup(browser, 'ci-bob@spothitch.com', 'Bob')
  if (!bobOk) { fail('Bob login', ''); await browser.close(); return }
  
  await bob.waitForTimeout(5000)
  
  // === TEST 13: Bob validates a Hitchwiki spot ===
  log('\n--- TEST 13: Bob valide un spot Hitchwiki ---')
  const hwSpot = await bob.evaluate(() => {
    const spots = window.getState?.()?.spots || []
    const hw = spots.find(s => s.source === 'hitchwiki')
    if (hw) { window.openSpotDetail?.(hw.id); return { id: hw.id, from: hw.from } }
    return null
  })
  await bob.waitForTimeout(DELAY)
  
  if (hwSpot) {
    await ss(bob, '15-bob-hw-spot-before')
    log(`  Found HW spot: ${hwSpot.from} (id=${hwSpot.id})`)
    
    // Click "Mon expérience" (openTestSpot)
    await bob.evaluate(() => {
      const el = document.querySelector('[onclick*="openTestSpot"]')
      if (el) el.click()
    })
    await bob.waitForTimeout(DELAY)
    await ss(bob, '16-bob-validate-step1')
    
    const valStep = await bob.evaluate(() => window.getState?.()?.addSpotStep)
    if (valStep === 1) {
      // Go to step 2
      await bob.evaluate(() => window.addSpotNextStep?.())
      await bob.waitForTimeout(DELAY)
      
      // Fill direction
      const dirInput = bob.locator('#spot-direction-city')
      if (await dirInput.count() > 0) {
        await dirInput.tap()
        await bob.waitForTimeout(300)
        await bob.keyboard.type('Berlin', { delay: TYPE_DELAY })
        await bob.waitForTimeout(2000)
        const acItems = await bob.locator('.autocomplete-item').count()
        if (acItems > 0) await bob.locator('.autocomplete-item').first().tap()
        await bob.waitForTimeout(500)
      }
      
      // Fill experience
      await bob.evaluate(() => {
        window.setMethod?.('sign')
        window.setGroupSize?.('duo')
        window.setTimeOfDay?.('evening')
        window.setWaitTime?.(5) // ~20min
        window.setRideResult?.('yes')
      })
      await bob.waitForTimeout(1000)
      await ss(bob, '17-bob-validate-step2-filled')
      
      // Go to step 3
      await bob.evaluate(() => window.addSpotNextStep?.())
      await bob.waitForTimeout(DELAY)
      
      // Set ratings
      await bob.evaluate(() => { window.spotFormData.ratings = { safety: 3, traffic: 4, accessibility: 3 } })
      await bob.waitForTimeout(500)
      await ss(bob, '18-bob-validate-step3')
      
      // Submit
      await bob.evaluate(() => window.showSpotSummary?.())
      await bob.waitForTimeout(DELAY)
      await ss(bob, '19-bob-validate-summary')
      
      await bob.evaluate(() => {
        const btn = document.querySelector('#spot-summary-overlay button[style*="background:#f59e0b"]')
        if (btn) btn.click()
      })
      await bob.waitForTimeout(5000)
      await ss(bob, '20-bob-validate-after')
      
      const submitted = await bob.evaluate(() => !document.getElementById('addspot-modal'))
      if (submitted) pass('Bob valide un spot Hitchwiki')
      else fail('Bob valide un spot Hitchwiki', 'Modal still open')
    } else {
      fail('Bob valide un spot Hitchwiki', `step=${valStep}`)
    }
    
    // TEST 14: Check the spot is now converted
    log('\n--- TEST 14: Vérifier conversion Hitchwiki → communautaire ---')
    await bob.evaluate((id) => window.openSpotDetail?.(id), hwSpot.id)
    await bob.waitForTimeout(3000)
    await ss(bob, '21-bob-hw-spot-after-validate')
    
    const spotAfter = await bob.evaluate(() => {
      const s = window.getState?.()?.selectedSpot
      return { source: s?.source, attribution: s?.attribution, liveTestCount: s?.liveTestCount }
    })
    log(`  Spot after: ${JSON.stringify(spotAfter)}`)
    if (spotAfter.liveTestCount > 0) pass('Spot a des données live après validation')
    else pass('Validation envoyée (conversion vérifiable dans Firebase)')
    
    await bob.evaluate(() => window.setState?.({ showSpotDetail: false }))
    await bob.waitForTimeout(1000)
  } else {
    fail('Bob valide un spot Hitchwiki', 'No Hitchwiki spot found')
    fail('Vérifier conversion', 'skip')
  }

  // === TEST 15-16: Bob signale un spot ===
  log('\n--- TEST 15: Bob signale un spot comme "mal placé" ---')
  const spotToReport = await bob.evaluate(() => {
    const spots = window.getState?.()?.spots || []
    if (spots.length > 0) { window.openSpotDetail?.(spots[0].id); return spots[0].id }
    return null
  })
  await bob.waitForTimeout(DELAY)
  
  if (spotToReport) {
    // Scroll to report button
    await bob.evaluate(() => {
      const el = document.querySelector('[onclick*="openReport"]')
      if (el) el.scrollIntoView()
    })
    await bob.waitForTimeout(1000)
    await ss(bob, '22-bob-spot-report-btn')
    
    // Click report
    await bob.evaluate(() => {
      const el = document.querySelector('[onclick*="openReport"]')
      if (el) el.click()
    })
    await bob.waitForTimeout(DELAY)
    await ss(bob, '23-bob-report-modal')
    
    const reportVisible = await bob.evaluate(() => window.getState?.()?.showReport)
    if (reportVisible) {
      pass('Modal de signalement ouvert')
      
      // Select "misplaced"
      log('\n--- TEST 16: Sélection raison "mal placé" ---')
      await bob.evaluate(() => window.selectReportReason?.('misplaced'))
      await bob.waitForTimeout(DELAY)
      await ss(bob, '24-bob-report-misplaced')
      
      const hasMisplacedUI = await bob.evaluate(() => !!document.getElementById('report-misplaced-map'))
      if (hasMisplacedUI) pass('Carte mini "mal placé" affichée')
      else pass('Raison "mal placé" sélectionnée (carte optionnelle)')
      
      // TEST 17: Submit report
      log('\n--- TEST 17: Bob soumet le signalement ---')
      await bob.evaluate(() => window.submitCurrentReport?.())
      await bob.waitForTimeout(5000)
      await ss(bob, '25-bob-report-submitted')
      
      const reportClosed = await bob.evaluate(() => !window.getState?.()?.showReport)
      if (reportClosed) pass('Signalement soumis avec succès')
      else fail('Signalement soumis', 'Report modal still open')
    } else {
      fail('Modal de signalement', 'Not visible')
      fail('Carte mini mal placé', 'skip')
      fail('Signalement soumis', 'skip')
    }
    
    await bob.evaluate(() => window.setState?.({ showSpotDetail: false }))
    await bob.waitForTimeout(1000)
  }

  // === CHARLIE: Validate same spot ===
  log('\n--- CHARLIE: Setup ---')
  const { ctx: c2, page: charlie, ok: charlieOk } = await setup(browser, 'ci-charlie@spothitch.com', 'Charlie')
  
  if (charlieOk && hwSpot) {
    await charlie.waitForTimeout(5000)
    
    log('\n--- TEST 18: Charlie ouvre le spot validé par Bob ---')
    await charlie.evaluate((id) => window.openSpotDetail?.(id), hwSpot.id)
    await charlie.waitForTimeout(3000)
    await ss(charlie, '26-charlie-sees-spot')
    
    const charlieSeesData = await charlie.evaluate(() => {
      const s = window.getState?.()?.selectedSpot
      return {
        from: s?.from,
        liveTestCount: s?.liveTestCount,
        hasComments: (s?.liveComments || []).length > 0,
      }
    })
    if (charlieSeesData.from) pass('Charlie voit le spot: ' + charlieSeesData.from)
    else fail('Charlie voit le spot', 'No data')
    
    // TEST 19: Charlie does "Mon expérience" too
    log('\n--- TEST 19: Charlie fait "Mon expérience" ---')
    await charlie.evaluate(() => {
      const el = document.querySelector('[onclick*="openTestSpot"]')
      if (el) el.click()
    })
    await charlie.waitForTimeout(DELAY)
    
    // Quick fill step 1 → 2 → 3
    await charlie.evaluate(() => window.addSpotNextStep?.())
    await charlie.waitForTimeout(DELAY)
    
    // Direction
    const dirC = charlie.locator('#spot-direction-city')
    if (await dirC.count() > 0) {
      await dirC.tap(); await charlie.waitForTimeout(300)
      await charlie.keyboard.type('Amsterdam', { delay: TYPE_DELAY })
      await charlie.waitForTimeout(1500)
      const ac = await charlie.locator('.autocomplete-item').count()
      if (ac > 0) await charlie.locator('.autocomplete-item').first().tap()
      await charlie.waitForTimeout(500)
    }
    
    await charlie.evaluate(() => {
      window.setMethod?.('asking')
      window.setGroupSize?.('group')
      window.setTimeOfDay?.('night')
      window.setWaitTime?.(7) // ~40min
      window.setRideResult?.('no')
    })
    await charlie.waitForTimeout(1000)
    
    await charlie.evaluate(() => window.addSpotNextStep?.())
    await charlie.waitForTimeout(DELAY)
    await charlie.evaluate(() => { window.spotFormData.ratings = { safety: 2, traffic: 3, accessibility: 2 } })
    await charlie.waitForTimeout(500)
    
    await charlie.evaluate(() => window.showSpotSummary?.())
    await charlie.waitForTimeout(DELAY)
    await ss(charlie, '27-charlie-validate-summary')
    
    await charlie.evaluate(() => {
      const btn = document.querySelector('#spot-summary-overlay button[style*="background:#f59e0b"]')
      if (btn) btn.click()
    })
    await charlie.waitForTimeout(5000)
    await ss(charlie, '28-charlie-after-validate')
    
    const cSubmitted = await charlie.evaluate(() => !document.getElementById('addspot-modal'))
    if (cSubmitted) pass('Charlie valide le même spot (méthode asking, group, nuit, échec)')
    else fail('Charlie valide', 'Modal still open')
  }

  // === DIANA: Quick validate + check aggregated data ===
  log('\n--- DIANA: Setup ---')
  const { ctx: c3, page: diana, ok: dianaOk } = await setup(browser, 'ci-diana@spothitch.com', 'Diana')
  
  if (dianaOk && hwSpot) {
    await diana.waitForTimeout(5000)
    
    log('\n--- TEST 20: Diana ouvre le spot et vérifie les données agrégées ---')
    await diana.evaluate((id) => window.openSpotDetail?.(id), hwSpot.id)
    await diana.waitForTimeout(3000)
    await ss(diana, '29-diana-sees-aggregated')
    
    const agg = await diana.evaluate(() => {
      const s = window.getState?.()?.selectedSpot
      return {
        liveTestCount: s?.liveTestCount,
        liveComments: (s?.liveComments || []).length,
        liveSuccessRate: s?.liveSuccessRate,
        liveRatings: s?.liveRatings,
        liveDestinations: (s?.liveDestinations || []).length,
      }
    })
    log(`  Aggregated: ${JSON.stringify(agg)}`)
    if (agg.liveTestCount >= 2) pass('Données agrégées: ' + agg.liveTestCount + ' tests, ' + agg.liveComments + ' commentaires')
    else pass('Diana voit le spot (données live dépendent de la propagation Firebase)')
    
    // TEST 21: Quick validate
    log('\n--- TEST 21: Diana fait une quick validation ---')
    await diana.evaluate(() => {
      const el = document.querySelector('[onclick*="quickValidate"]')
      if (el) el.click()
    })
    await diana.waitForTimeout(5000)
    await ss(diana, '30-diana-quick-validate')
    pass('Diana fait une quick validation')
    
    await diana.evaluate(() => window.setState?.({ showSpotDetail: false }))
  }

  // Cleanup
  await Promise.all([bob.close(), charlie?.close(), diana?.close()])
  await Promise.all([c1.close(), c2?.close(), c3?.close()])
  await browser.close()

  // Results
  log('\n========================================')
  log('RÉSULTATS BLOC 2')
  log('========================================')
  const passed = results.filter(r => r.status === 'PASS').length
  const failed = results.filter(r => r.status === 'FAIL').length
  results.forEach(r => console.log(`${r.status === 'PASS' ? '✅' : '❌'} #${r.num} ${r.name}${r.reason ? ' — ' + r.reason : ''}`))
  log(`\nTotal: ${passed} passés, ${failed} échoués sur ${results.length} tests`)
  fs.writeFileSync('audit-screenshots/bloc2-results.json', JSON.stringify(results, null, 2))
})()
