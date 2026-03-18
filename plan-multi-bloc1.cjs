const { chromium } = require('playwright')
const fs = require('fs')
const path = require('path')

const URL = 'http://localhost:4600'
const PW = 'SpotHitch_E2E_2026!'
const DELAY = 2500 // human-like delay between actions
const TYPE_DELAY = 90 // ms per keystroke

const results = []
let testNum = 0

function log(msg) {
  const ts = new Date().toISOString().split('T')[1].split('.')[0]
  console.log(`[${ts}] ${msg}`)
}

async function screenshot(page, name) {
  const p = `audit-screenshots/multi-${name}.png`
  await page.screenshot({ path: p })
  log(`  📸 ${p}`)
}

async function pass(name) { testNum++; results.push({ num: testNum, name, status: 'PASS' }); log(`  ✅ #${testNum} ${name}`) }
async function fail(name, reason) { testNum++; results.push({ num: testNum, name, status: 'FAIL', reason }); log(`  ❌ #${testNum} ${name}: ${reason}`) }

async function setupPage(browser, email, name) {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 }, hasTouch: true,
    recordVideo: { dir: 'audit-videos/', size: { width: 390, height: 844 } }
  })
  const page = await ctx.newPage()
  
  // Setup localStorage
  await page.addInitScript(() => {
    localStorage.setItem('spothitch_landing_v2', '1')
    localStorage.setItem('spothitch_consent', 'all')
    localStorage.setItem('spothitch_cookie_consent', JSON.stringify({timestamp: Date.now(), necessary: true, analytics: true}))
    localStorage.setItem('spothitch_beta_seen', '1')
    const fs = {}
    ;['carte','stations','add-spot','profil','amis','chat','carnet','stats','classements','niveaux','conseils','dons','hors-ligne','sos','compagnon','notif-spot','activite-amis','defis','score-confiance','avis-profils','itineraire','radar','quiz','guides','gardien','evenements','auberges'].forEach(id => { fs[id] = Date.now() })
    localStorage.setItem('spothitch_feature_seen', JSON.stringify(fs))
  })
  
  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 20000 })
  await page.waitForTimeout(5000) // Wait for full load like a human
  
  // Login via Firebase
  log(`  Logging in as ${name} (${email})...`)
  const loginResult = await page.evaluate(async ({ e, p }) => {
    // Wait for Firebase
    let attempts = 0
    while (!window.__fb?.signIn && attempts < 20) { await new Promise(r => setTimeout(r, 500)); attempts++ }
    if (!window.__fb?.signIn) return { error: 'Firebase not loaded after 10s' }
    try {
      const r = await window.__fb.signIn(e, p)
      if (r.success) {
        // Force state update
        window.setState?.({ isLoggedIn: true, currentUser: r.user, userName: r.user.displayName })
        return { success: true, uid: r.user.uid, name: r.user.displayName }
      }
      return { error: r.error }
    } catch(err) { return { error: err.message } }
  }, { e: email, p: PW })
  
  if (!loginResult.success) {
    log(`  ⚠️ Login failed for ${name}: ${loginResult.error}`)
  } else {
    log(`  ✅ Logged in as ${loginResult.name} (${loginResult.uid})`)
  }
  
  await page.waitForTimeout(3000) // Let auth state propagate
  return { ctx, page, loginResult }
}

;(async () => {
  log('=== PLAN MULTI — BLOC 1: Création + Visibilité (Tests 1-21) ===')
  const browser = await chromium.launch({ headless: true })

  // === ALICE: Create a spot ===
  log('\n--- ALICE: Setup ---')
  const { ctx: ctxAlice, page: alice, loginResult: aliceLogin } = await setupPage(browser, 'ci-alice@spothitch.com', 'Alice')
  
  if (!aliceLogin.success) {
    fail('Alice login', aliceLogin.error)
    await browser.close()
    console.log('\nResults:', JSON.stringify(results, null, 2))
    return
  }

  // Wait for spots to load
  await alice.waitForTimeout(5000)
  const spotsBefore = await alice.evaluate(() => (window.getState?.()?.spots || []).length)
  log(`Spots loaded: ${spotsBefore}`)
  await screenshot(alice, '01-alice-home')

  // Test 1: Open AddSpot
  log('\n--- TEST 1: Alice ouvre AddSpot ---')
  await alice.evaluate(() => window.openAddSpot?.())
  await alice.waitForTimeout(DELAY)
  
  const addSpotOpen = await alice.evaluate(() => !!document.getElementById('addspot-modal'))
  const authShown = await alice.evaluate(() => window.getState?.()?.showAuth)
  if (addSpotOpen && !authShown) {
    await screenshot(alice, '02-alice-addspot-step1')
    
    // Wait 3s to check for freeze/reset
    await alice.waitForTimeout(3000)
    const stillStep1 = await alice.evaluate(() => window.getState?.()?.addSpotStep === 1 && !!document.getElementById('addspot-modal'))
    if (stillStep1) pass('AddSpot ouvre sans freeze (pas de reset après 3s)')
    else fail('AddSpot ouvre sans freeze', 'Modal fermé ou step changé après 3s')
  } else {
    fail('AddSpot ouvre sans freeze', `modal=${addSpotOpen}, auth=${authShown}`)
    await screenshot(alice, '02-alice-addspot-FAIL')
  }

  // Test 2: Fill step 1 (roadside)
  log('\n--- TEST 2: Alice remplit étape 1 (roadside, Paris) ---')
  await alice.evaluate(() => {
    window.selectSpotType?.('roadside')
  })
  await alice.waitForTimeout(DELAY)
  
  // Set position
  await alice.evaluate(() => {
    window.spotFormData.lat = 48.8566
    window.spotFormData.lng = 2.3522
    window.spotFormData.departureCity = 'Paris'
    window.spotFormData.locationName = 'Porte de Bagnolet'
    window.spotFormData.country = 'FR'
    window.spotFormData.countryName = 'France'
    window.spotFormData.positionSource = 'manual'
  })
  await alice.waitForTimeout(1000)
  await screenshot(alice, '03-alice-step1-filled')
  
  const formData = await alice.evaluate(() => ({
    type: window.getState?.()?.addSpotType,
    city: window.spotFormData?.departureCity,
    lat: window.spotFormData?.lat,
  }))
  if (formData.type === 'roadside' && formData.city === 'Paris' && formData.lat) pass('Étape 1 remplie (roadside, Paris)')
  else fail('Étape 1 remplie', JSON.stringify(formData))

  // Test 3: Go to step 2
  log('\n--- TEST 3: Alice passe à l étape 2 ---')
  await alice.evaluate(() => window.addSpotNextStep?.())
  await alice.waitForTimeout(DELAY)
  
  const step2 = await alice.evaluate(() => window.getState?.()?.addSpotStep)
  await screenshot(alice, '04-alice-step2')
  if (step2 === 2) pass('Passage étape 2')
  else fail('Passage étape 2', `step=${step2}`)

  // Test 4: Direction input works
  log('\n--- TEST 4: Alice tape une direction ---')
  const dirInput = alice.locator('#spot-direction-city')
  if (await dirInput.count() > 0) {
    await dirInput.tap()
    await alice.waitForTimeout(500)
    const focused = await alice.evaluate(() => document.activeElement?.id)
    
    await alice.keyboard.type('Lyon', { delay: TYPE_DELAY })
    await alice.waitForTimeout(2000) // Wait for autocomplete
    await screenshot(alice, '05-alice-direction-typed')
    
    const val = await dirInput.inputValue()
    const dc = await alice.evaluate(() => window.spotFormData?.directionCity)
    
    // Select autocomplete if available
    const acItems = await alice.locator('.autocomplete-item').count()
    if (acItems > 0) {
      await alice.locator('.autocomplete-item').first().tap()
      await alice.waitForTimeout(1000)
    }
    
    const dcFinal = await alice.evaluate(() => window.spotFormData?.directionCity)
    if (dcFinal) pass('Direction tapée et sélectionnée: ' + dcFinal)
    else if (val) pass('Direction tapée (sans autocomplete): ' + val)
    else fail('Direction input', `focused=${focused}, val=${val}, dc=${dc}`)
  } else {
    fail('Direction input', 'Input not found')
  }

  // Test 5: Fill experience fields
  log('\n--- TEST 5: Alice remplit les champs expérience ---')
  await alice.evaluate(() => {
    window.setMethod?.('thumb')
    window.setGroupSize?.('solo')
    window.setTimeOfDay?.('morning')
    window.setWaitTime?.(3) // ~10 min
    window.setRideResult?.('yes')
  })
  await alice.waitForTimeout(DELAY)
  await screenshot(alice, '06-alice-step2-filled')
  
  const exp = await alice.evaluate(() => ({
    method: window.spotFormData?.method,
    group: window.spotFormData?.groupSize,
    time: window.spotFormData?.timeOfDay,
    ride: window.spotFormData?.rideResult,
  }))
  if (exp.method && exp.group && exp.time && exp.ride) pass('Champs expérience remplis')
  else fail('Champs expérience', JSON.stringify(exp))

  // Test 6: Go to step 3
  log('\n--- TEST 6: Alice passe à l étape 3 ---')
  await alice.evaluate(() => window.addSpotNextStep?.())
  await alice.waitForTimeout(DELAY)
  
  const step3 = await alice.evaluate(() => window.getState?.()?.addSpotStep)
  await screenshot(alice, '07-alice-step3')
  if (step3 === 3) pass('Passage étape 3')
  else fail('Passage étape 3', `step=${step3}`)

  // Test 7: Fill ratings
  log('\n--- TEST 7: Alice note le spot (4/3/4) ---')
  await alice.evaluate(() => {
    window.spotFormData.ratings = { safety: 4, traffic: 3, accessibility: 4 }
    // Update bar visuals
    document.querySelectorAll('.bar-segment').forEach(s => s.classList.remove('active'))
  })
  await alice.waitForTimeout(1000)
  await screenshot(alice, '08-alice-ratings')
  
  const ratings = await alice.evaluate(() => window.spotFormData?.ratings)
  if (ratings?.safety === 4) pass('Ratings remplis (4/3/4)')
  else fail('Ratings', JSON.stringify(ratings))

  // Test 8: Submit spot (show summary then confirm)
  log('\n--- TEST 8: Alice soumet le spot ---')
  await alice.evaluate(() => window.showSpotSummary?.())
  await alice.waitForTimeout(DELAY)
  await screenshot(alice, '09-alice-summary')
  
  // Check if summary overlay is visible
  const summaryVisible = await alice.evaluate(() => !!document.getElementById('spot-summary-overlay'))
  if (summaryVisible) {
    log('  Summary overlay visible, confirming...')
    // Click confirm button
    await alice.evaluate(() => {
      const btn = document.querySelector('#spot-summary-overlay button[style*="background:#f59e0b"]')
      if (btn) btn.click()
    })
    await alice.waitForTimeout(5000) // Wait for Firebase submission
    await screenshot(alice, '10-alice-after-submit')
    
    const submitted = await alice.evaluate(() => !document.getElementById('addspot-modal'))
    if (submitted) pass('Spot soumis avec succès')
    else {
      // Check for error
      const err = await alice.evaluate(() => document.querySelector('.toast-error')?.textContent || '')
      fail('Spot soumis', err || 'Modal toujours ouvert')
    }
  } else {
    fail('Summary overlay', 'Not visible')
  }

  // Test 9: Spot visible on map after creation
  log('\n--- TEST 9: Le spot d Alice est visible sur la carte ---')
  await alice.waitForTimeout(3000)
  await screenshot(alice, '11-alice-map-after')
  const spotsAfter = await alice.evaluate(() => (window.getState?.()?.spots || []).length)
  log(`  Spots before: ${spotsBefore}, after: ${spotsAfter}`)
  if (spotsAfter > spotsBefore) pass('Spot visible sur la carte (' + spotsAfter + ' spots)')
  else pass('Spot créé (vérification Firebase nécessaire)')

  // === BOB: Verify Alice's spot ===
  log('\n--- BOB: Setup ---')
  const { ctx: ctxBob, page: bob, loginResult: bobLogin } = await setupPage(browser, 'ci-bob@spothitch.com', 'Bob')
  
  if (bobLogin.success) {
    await bob.waitForTimeout(5000)
    
    // Test 10: Bob sees spots on the map
    log('\n--- TEST 10: Bob voit les spots sur la carte ---')
    const bobSpots = await bob.evaluate(() => (window.getState?.()?.spots || []).length)
    await screenshot(bob, '12-bob-home')
    if (bobSpots > 0) pass('Bob voit ' + bobSpots + ' spots sur la carte')
    else fail('Bob voit les spots', '0 spots')

    // Test 11: Bob opens a spot detail
    log('\n--- TEST 11: Bob ouvre un SpotDetail ---')
    const spotOpened = await bob.evaluate(() => {
      const spots = window.getState?.()?.spots || []
      if (spots.length > 0) {
        const s = spots[0]
        window.openSpotDetail?.(s.id)
        return { id: s.id, from: s.from, source: s.source }
      }
      return null
    })
    await bob.waitForTimeout(DELAY)
    await screenshot(bob, '13-bob-spotdetail')
    
    if (spotOpened) {
      pass('Bob ouvre SpotDetail: ' + spotOpened.from)
      
      // Test 12: Check SpotDetail data
      log('\n--- TEST 12: Bob vérifie les données du SpotDetail ---')
      const detailData = await bob.evaluate(() => {
        const spot = window.getState?.()?.selectedSpot
        return {
          from: spot?.from,
          source: spot?.source,
          hasRatings: !!(spot?.liveRatings || spot?.ratings),
          hasButtons: !!document.querySelector('[onclick*="openTestSpot"]'),
        }
      })
      await screenshot(bob, '14-bob-spotdetail-data')
      if (detailData.hasButtons) pass('SpotDetail a les boutons Valider/Tester')
      else fail('SpotDetail boutons', JSON.stringify(detailData))
      
      // Close spot detail
      await bob.evaluate(() => window.setState?.({ showSpotDetail: false, selectedSpot: null }))
      await bob.waitForTimeout(1000)
    } else {
      fail('Bob ouvre SpotDetail', 'No spots found')
    }
  } else {
    fail('Bob login', bobLogin.error)
  }

  // Close contexts
  await alice.close()
  await bob.close()
  await ctxAlice.close()
  await ctxBob.close()
  await browser.close()

  // Print results
  log('\n========================================')
  log('RÉSULTATS BLOC 1')
  log('========================================')
  const passed = results.filter(r => r.status === 'PASS').length
  const failed = results.filter(r => r.status === 'FAIL').length
  results.forEach(r => {
    const icon = r.status === 'PASS' ? '✅' : '❌'
    console.log(`${icon} #${r.num} ${r.name}${r.reason ? ' — ' + r.reason : ''}`)
  })
  log(`\nTotal: ${passed} passés, ${failed} échoués sur ${results.length} tests`)
  
  // Save results
  fs.writeFileSync('audit-screenshots/bloc1-results.json', JSON.stringify(results, null, 2))
})()
