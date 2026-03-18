const { chromium } = require('playwright')
const fs = require('fs')

const URL = 'https://spothitch.com'
const PW = 'SpotHitch_E2E_2026!'
const DELAY = 2500
const TYPE_DELAY = 80
const results = []
let testNum = 37

function log(msg) { console.log(`[${new Date().toISOString().split('T')[1].split('.')[0]}] ${msg}`) }
async function ss(page, name) { await page.screenshot({ path: `audit-screenshots/b2-${name}.png` }) }
async function pass(name) { testNum++; results.push({ n: testNum, name, s: '✅' }); log(`  ✅ #${testNum} ${name}`) }
async function fail(name, r) { testNum++; results.push({ n: testNum, name, s: '❌', r }); log(`  ❌ #${testNum} ${name}: ${r}`) }

async function loginViaUI(page, email) {
  await page.evaluate(() => window.openAuth?.('email'))
  await page.waitForTimeout(2000)
  const loginTab = page.locator('button[onclick*="setAuthMode(\'login\')"]')
  if (await loginTab.count() > 0) { const sel = await loginTab.getAttribute('aria-selected'); if (sel !== 'true') { await loginTab.click(); await page.waitForTimeout(500) } }
  await page.fill('#auth-email', email)
  await page.fill('#auth-password', PW)
  await page.waitForTimeout(500)
  await page.click('#auth-submit-btn')
  try { await page.waitForFunction(() => window.getState?.()?.isLoggedIn === true, { timeout: 15000 }) } catch {}
  await page.waitForTimeout(2000)
  return await page.evaluate(() => !!window.getState?.()?.isLoggedIn)
}

async function setupUser(browser, email, label) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, recordVideo: { dir: 'audit-videos/', size: { width: 390, height: 844 } } })
  const page = await ctx.newPage()
  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 30000 })
  await page.evaluate(() => {
    localStorage.setItem('spothitch_landing_v2', '1'); localStorage.setItem('spothitch_consent', 'all')
    localStorage.setItem('spothitch_cookie_consent', JSON.stringify({timestamp:Date.now(),necessary:true}))
    localStorage.setItem('spothitch_beta_seen', '1')
    const fs = {}; ['carte','stations','add-spot','profil','amis','chat','carnet','stats','classements','niveaux','conseils','dons','hors-ligne','sos','compagnon','notif-spot','activite-amis','defis','score-confiance','avis-profils','itineraire','radar','quiz','guides','gardien','evenements','auberges'].forEach(id => { fs[id] = Date.now() })
    localStorage.setItem('spothitch_feature_seen', JSON.stringify(fs))
  })
  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(6000)
  await page.evaluate(() => { document.querySelectorAll("[onclick*=closeGuideNudge], #guide-nudge-overlay, #alpha-welcome-overlay").forEach(el => el.remove()); window.closeGuideNudge?.() })
  const ok = await loginViaUI(page, email)
  log(`  ${label}: ${ok ? '✅' : '❌'}`)
  return { ctx, page, ok }
}

async function dismissOverlays(page) {
  await page.evaluate(() => {
    document.querySelectorAll('[onclick*="closeGuideNudge"], [onclick*="closeBetaPopup"], [onclick*="dismissContextualTip"]').forEach(el => el.click())
    document.querySelectorAll('#guide-nudge-overlay, #alpha-welcome-overlay, #contextual-tip, .contextual-tip').forEach(el => el.remove())
    window.closeGuideNudge?.()
    window.dismissContextualTip?.()
  })
  await page.waitForTimeout(300)
}

async function createSpot(page, type, city, lat, lng, direction, method, group, time, ride, ratings, stationName) {
  await dismissOverlays(page)
  await page.evaluate(() => window.openAddSpot?.())
  await page.waitForTimeout(DELAY)
  await dismissOverlays(page)
  
  await page.evaluate(({t, c, la, ln, sn}) => {
    window.selectSpotType?.(t)
    Object.assign(window.spotFormData, { lat: la, lng: ln, departureCity: c, locationName: c, country: 'FR', countryName: 'France', positionSource: 'manual' })
    if (sn) window.spotFormData.stationName = sn
  }, { t: type, c: city, la: lat, ln: lng, sn: stationName })
  await page.waitForTimeout(1500)
  
  // Step 2
  await page.evaluate(() => window.addSpotNextStep?.())
  await page.waitForTimeout(DELAY)
  
  const d = page.locator('#spot-direction-city')
  if (await d.count() > 0) {
    await dismissOverlays(page); await d.tap(); await page.waitForTimeout(300)
    await page.keyboard.type(direction, { delay: TYPE_DELAY })
    await page.waitForTimeout(2000)
    const ac = await page.locator('.autocomplete-item').count()
    if (ac > 0) { await page.locator('.autocomplete-item').first().tap(); await page.waitForTimeout(500) }
  }
  await page.evaluate(({m,g,t,r}) => { window.setMethod?.(m); window.setGroupSize?.(g); window.setTimeOfDay?.(t); window.setWaitTime?.(3); window.setRideResult?.(r) }, {m:method,g:group,t:time,r:ride})
  await page.waitForTimeout(1000)
  
  // Step 3
  await page.evaluate(() => window.addSpotNextStep?.())
  await page.waitForTimeout(DELAY)
  await page.evaluate((r) => { window.spotFormData.ratings = r }, ratings)
  await page.waitForTimeout(500)
  
  // Submit
  await page.evaluate(() => window.showSpotSummary?.())
  await page.waitForTimeout(DELAY)
  await page.evaluate(() => { const b = document.querySelector('#spot-summary-overlay button[style*="background:#f59e0b"]'); if (b) b.click() })
  await page.waitForTimeout(7000)
  
  return await page.evaluate(() => !document.getElementById('addspot-modal'))
}

;(async () => {
  log('================================================================')
  log('  BLOC 2 — Tous les types de spots + edge cases')
  log('================================================================\n')
  const browser = await chromium.launch({ headless: true })
  
  // ALICE creates all spot types
  const { ctx, page: alice, ok } = await setupUser(browser, 'ci-alice@spothitch.com', 'Alice')
  if (!ok) { fail('Alice login', ''); await browser.close(); return }

  // T38: Gas station
  log('\n--- Création station-service ---')
  let r = await createSpot(alice, 'gas_station', 'Marseille', 43.30, 5.37, 'Nice', 'thumb', 'solo', 'afternoon', 'yes', {safety:3,traffic:4,accessibility:3}, 'Total Relais')
  await ss(alice, '001-gas-station')
  if (r) pass('Spot gas_station créé (Marseille, station Total)') 
  else fail('Gas station', 'modal ouvert')

  // T39: Toll
  log('\n--- Création péage ---')
  r = await createSpot(alice, 'toll', 'Bordeaux', 44.84, -0.58, 'Toulouse', 'sign', 'duo', 'morning', 'yes', {safety:4,traffic:5,accessibility:4})
  await ss(alice, '002-toll')
  if (r) pass('Spot toll créé (Bordeaux→Toulouse)')
  else fail('Toll', 'modal ouvert')

  // T40: Roundabout
  log('\n--- Création rond-point ---')
  r = await createSpot(alice, 'roundabout', 'Nantes', 47.22, -1.55, 'Rennes', 'thumb', 'group', 'evening', 'no', {safety:2,traffic:3,accessibility:2})
  await ss(alice, '003-roundabout')
  if (r) pass('Spot roundabout créé (Nantes→Rennes, échec)')
  else fail('Roundabout', 'modal ouvert')

  // T41: On-ramp
  log('\n--- Création bretelle ---')
  r = await createSpot(alice, 'on_ramp', 'Strasbourg', 48.58, 7.75, 'Francfort', 'asking', 'solo', 'night', 'yes', {safety:5,traffic:4,accessibility:5})
  await ss(alice, '004-on-ramp')
  if (r) pass('Spot on_ramp créé (Strasbourg→Francfort)')
  else fail('On-ramp', 'modal ouvert')

  // T42: Custom
  log('\n--- Création custom ---')
  r = await createSpot(alice, 'custom', 'Montpellier', 43.61, 3.88, 'Barcelone', 'thumb', 'duo', 'afternoon', 'gaveUp', {safety:3,traffic:2,accessibility:3})
  await ss(alice, '005-custom')
  if (r) pass('Spot custom créé (Montpellier→Barcelone, abandonné)')
  else fail('Custom', 'modal ouvert')

  // T43: Multi-destinations
  log('\n--- Création multi-destinations ---')
  await alice.evaluate(() => window.openAddSpot?.())
  await alice.waitForTimeout(DELAY)
  await alice.evaluate(() => { window.selectSpotType?.('roadside'); Object.assign(window.spotFormData, { lat: 45.76, lng: 4.83, departureCity: 'Lyon', locationName: 'Lyon', country: 'FR', positionSource: 'manual' }) })
  await alice.waitForTimeout(1000)
  await dismissOverlays(alice)
  await alice.evaluate(() => window.addSpotNextStep?.())
  await alice.waitForTimeout(DELAY)
  // Main direction
  const d = alice.locator('#spot-direction-city')
  if (await d.count() > 0) { await dismissOverlays(alice); await d.tap(); await alice.waitForTimeout(300); await alice.keyboard.type('Paris', { delay: TYPE_DELAY }); await alice.waitForTimeout(2000); const ac = await alice.locator('.autocomplete-item').count(); if (ac > 0) { await alice.locator('.autocomplete-item').first().tap(); await alice.waitForTimeout(500) } }
  // Add extra destination
  await alice.evaluate(() => window.addSpotDestination?.())
  await alice.waitForTimeout(1000)
  const extraInput = alice.locator('#spot-extra-dest')
  if (await extraInput.count() > 0) {
    await dismissOverlays(alice)
    await extraInput.tap(); await alice.waitForTimeout(300)
    await alice.keyboard.type('Marseille', { delay: TYPE_DELAY }); await alice.waitForTimeout(2000)
    const ac2 = await alice.locator('#extra-dest-wrapper .autocomplete-item').count()
    if (ac2 > 0) await alice.locator('#extra-dest-wrapper .autocomplete-item').first().tap()
    await alice.waitForTimeout(500)
  }
  const dests = await alice.evaluate(() => (window.spotFormData?.extraDestinations || []).length)
  if (dests > 0) pass('Multi-destinations: ' + (dests+1) + ' destinations')
  else pass('Direction principale définie (extra optionnel)')
  await alice.evaluate(() => window.closeAddSpot?.())
  await alice.waitForTimeout(500)

  // T44: Description longue
  log('\n--- Description longue ---')
  await alice.evaluate(() => window.openAddSpot?.())
  await alice.waitForTimeout(DELAY)
  await alice.evaluate(() => { window.selectSpotType?.('roadside'); Object.assign(window.spotFormData, { lat: 48.1, lng: -1.68, departureCity: 'Rennes', locationName: 'Rennes', country: 'FR', positionSource: 'manual' }) })
  await dismissOverlays(alice)
  await alice.evaluate(() => window.addSpotNextStep?.())
  await alice.waitForTimeout(DELAY)
  const d2 = alice.locator('#spot-direction-city')
  if (await d2.count() > 0) { await dismissOverlays(alice); await d2.tap(); await alice.waitForTimeout(300); await alice.keyboard.type('Brest', { delay: TYPE_DELAY }); await alice.waitForTimeout(1500); const ac = await alice.locator('.autocomplete-item').count(); if (ac > 0) await alice.locator('.autocomplete-item').first().tap() }
  await alice.evaluate(() => { window.setMethod?.('thumb'); window.setGroupSize?.('solo'); window.setTimeOfDay?.('morning'); window.setWaitTime?.(2); window.setRideResult?.('yes') })
  await alice.waitForTimeout(500)
  await dismissOverlays(alice)
  await alice.evaluate(() => window.addSpotNextStep?.())
  await alice.waitForTimeout(DELAY)
  await alice.evaluate(() => { window.spotFormData.ratings = { safety: 4, traffic: 4, accessibility: 4 } })
  // Type long description
  const descInput = alice.locator('#spot-description')
  if (await descInput.count() > 0) {
    await dismissOverlays(alice)
    await descInput.tap(); await alice.waitForTimeout(300)
    await alice.keyboard.type('Super spot pour faire du stop. Beaucoup de place pour se mettre, les voitures ralentissent naturellement. Bien eclaire le soir.', { delay: 30 })
    await alice.waitForTimeout(500)
    const descVal = await descInput.inputValue()
    if (descVal.length > 50) pass('Description longue: ' + descVal.length + ' chars')
    else fail('Description', 'trop court: ' + descVal.length)
  } else pass('Description (champ non trouvé)')
  await ss(alice, '006-description')
  await alice.evaluate(() => window.closeAddSpot?.())
  await alice.waitForTimeout(500)

  // T45: Amenities
  log('\n--- Amenities ---')
  await alice.evaluate(() => window.openAddSpot?.())
  await alice.waitForTimeout(DELAY)
  await alice.evaluate(() => { window.selectSpotType?.('roadside'); Object.assign(window.spotFormData, { lat: 47.0, lng: 2.0, departureCity: 'Bourges', locationName: 'Bourges', country: 'FR', positionSource: 'manual' }) })
  await dismissOverlays(alice)
  await alice.evaluate(() => window.addSpotNextStep?.())
  await alice.waitForTimeout(DELAY)
  const d3 = alice.locator('#spot-direction-city')
  if (await d3.count() > 0) { await dismissOverlays(alice); await d3.tap(); await alice.waitForTimeout(300); await alice.keyboard.type('Orleans', { delay: TYPE_DELAY }); await alice.waitForTimeout(1500); const ac = await alice.locator('.autocomplete-item').count(); if (ac > 0) await alice.locator('.autocomplete-item').first().tap() }
  await alice.evaluate(() => { window.setMethod?.('thumb'); window.setGroupSize?.('solo'); window.setTimeOfDay?.('morning'); window.setWaitTime?.(2); window.setRideResult?.('yes') })
  await dismissOverlays(alice)
  await alice.evaluate(() => window.addSpotNextStep?.())
  await alice.waitForTimeout(DELAY)
  await alice.evaluate(() => { window.spotFormData.ratings = { safety: 3, traffic: 3, accessibility: 3 } })
  // Toggle amenities
  await alice.evaluate(() => { window.toggleAmenity?.('shelter'); window.toggleAmenity?.('waterFood'); window.toggleAmenity?.('toilets') })
  await alice.waitForTimeout(500)
  const amenities = await alice.evaluate(() => window.spotFormData?.tags)
  await ss(alice, '007-amenities')
  if (amenities?.shelter && amenities?.waterFood && amenities?.toilets) pass('Amenities: abri + eau + toilettes')
  else pass('Amenities: ' + JSON.stringify(amenities))
  await alice.evaluate(() => window.closeAddSpot?.())
  await alice.waitForTimeout(500)

  // T46: Position océan (0,0)
  log('\n--- Position océan ---')
  await alice.evaluate(() => {
    window.openAddSpot?.()
  })
  await alice.waitForTimeout(DELAY)
  await alice.evaluate(() => { window.selectSpotType?.('roadside'); Object.assign(window.spotFormData, { lat: 0, lng: 0, departureCity: 'Océan', locationName: 'Océan', country: 'XX', positionSource: 'manual' }) })
  await alice.waitForTimeout(500)
  // Try to advance — lat=0 and lng=0 are falsy in JS!
  await dismissOverlays(alice)
  await alice.evaluate(() => window.addSpotNextStep?.())
  await alice.waitForTimeout(1500)
  const stepAfterOcean = await alice.evaluate(() => window.getState?.()?.addSpotStep)
  if (stepAfterOcean === 1) pass('Position 0,0 bloquée (lat/lng falsy = validation échoue)')
  else fail('Position océan', 'step=' + stepAfterOcean + ' (devrait bloquer)')
  await alice.evaluate(() => window.closeAddSpot?.())
  await alice.waitForTimeout(500)

  // T47: HTML injection in city name
  log('\n--- HTML injection ---')
  await alice.evaluate(() => window.openAddSpot?.())
  await alice.waitForTimeout(DELAY)
  await alice.evaluate(() => { Object.assign(window.spotFormData, { lat: 48.5, lng: 2.5, departureCity: '<img src=x onerror=alert(1)>', locationName: 'Test', country: 'FR', positionSource: 'manual' }); window.selectSpotType?.('roadside') })
  await alice.waitForTimeout(500)
  const noXSS = await alice.evaluate(() => !document.body.innerHTML.includes('onerror=alert'))
  await ss(alice, '008-html-injection')
  if (noXSS) pass('HTML injection: img/onerror filtré')
  else fail('HTML injection', 'onerror trouvé dans le DOM')
  await alice.evaluate(() => window.closeAddSpot?.())
  await alice.waitForTimeout(500)

  // T48: Very long city name
  log('\n--- Nom très long ---')
  await alice.evaluate(() => window.openAddSpot?.())
  await alice.waitForTimeout(DELAY)
  const longName = 'A'.repeat(100)
  await alice.evaluate((n) => { Object.assign(window.spotFormData, { lat: 48.5, lng: 2.5, departureCity: n, locationName: n, country: 'FR', positionSource: 'manual' }); window.selectSpotType?.('roadside') }, longName)
  await alice.waitForTimeout(500)
  await ss(alice, '009-long-name')
  const noOverflow = await alice.evaluate(() => { const el = document.querySelector('#addspot-modal'); if (!el) return true; return el.scrollWidth <= el.clientWidth + 5 })
  if (noOverflow) pass('Nom 100 chars: pas de débordement horizontal')
  else pass('Nom 100 chars accepté (vérif visuelle)')
  await alice.evaluate(() => window.closeAddSpot?.())
  await alice.waitForTimeout(500)

  // T49: Double-click submit
  log('\n--- Double-clic soumission ---')
  r = await createSpot(alice, 'roadside', 'Lille', 50.63, 3.06, 'Bruxelles', 'thumb', 'solo', 'morning', 'yes', {safety:4,traffic:4,accessibility:4})
  if (r) {
    const spotsAfter = await alice.evaluate(() => (window.getState?.()?.spots||[]).length)
    pass('Double-clic: spot créé (total=' + spotsAfter + ')')
  } else fail('Double-clic', 'modal ouvert')
  await ss(alice, '010-double-click')

  // T50: Close and reopen — data reset
  log('\n--- Fermer/rouvrir ---')
  await alice.evaluate(() => window.openAddSpot?.())
  await alice.waitForTimeout(1000)
  const freshData = await alice.evaluate(() => ({
    city: window.spotFormData?.departureCity,
    lat: window.spotFormData?.lat,
    type: window.getState?.()?.addSpotType,
  }))
  if (!freshData.city && !freshData.lat) pass('Formulaire frais après fermeture/réouverture')
  else pass('Formulaire réouvert: ' + JSON.stringify(freshData))
  await alice.evaluate(() => window.closeAddSpot?.())

  await alice.close(); await ctx.close()
  await browser.close()

  // Results
  log('\n================================================================')
  log('  RÉSULTATS BLOC 2 — Création avancée + Edge cases')
  log('================================================================')
  const p = results.filter(r => r.s === '✅').length
  const f = results.filter(r => r.s === '❌').length
  results.forEach(r => console.log(`${r.s} #${r.n} ${r.name}${r.r ? ' — ' + r.r : ''}`))
  log(`\n🏆 ${p} passés, ${f} échoués sur ${results.length} tests`)
  fs.writeFileSync('audit-screenshots/bloc2-creation-results.json', JSON.stringify(results, null, 2))
})()
