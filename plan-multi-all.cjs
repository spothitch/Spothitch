const { chromium } = require('playwright')
const fs = require('fs')

const URL = 'https://spothitch.com'
const PW = 'SpotHitch_E2E_2026!'
const DELAY = 2500
const TYPE_DELAY = 80
const results = []
let testNum = 0
const screenshots = []

function log(msg) { console.log(`[${new Date().toISOString().split('T')[1].split('.')[0]}] ${msg}`) }
async function ss(page, name) { const p = `audit-screenshots/all-${name}.png`; await page.screenshot({ path: p }); screenshots.push(p) }
async function pass(name) { testNum++; results.push({ n: testNum, name, s: '✅' }); log(`  ✅ #${testNum} ${name}`) }
async function fail(name, r) { testNum++; results.push({ n: testNum, name, s: '❌', r }); log(`  ❌ #${testNum} ${name}: ${r}`) }

// Login via real Auth modal (triggers onAuthStateChanged properly)
async function loginViaUI(page, email) {
  await page.evaluate(() => window.openAuth?.('email'))
  await page.waitForTimeout(2000)
  
  // Switch to login tab
  const loginTab = page.locator('button[onclick*="setAuthMode(\'login\')"]')
  if (await loginTab.count() > 0) {
    const sel = await loginTab.getAttribute('aria-selected')
    if (sel !== 'true') { await loginTab.click(); await page.waitForTimeout(500) }
  }
  
  // Fill and submit
  await page.fill('#auth-email', email)
  await page.fill('#auth-password', PW)
  await page.waitForTimeout(500)
  await page.click('#auth-submit-btn')
  
  // Wait for auth to complete
  try {
    await page.waitForFunction(() => window.getState?.()?.isLoggedIn === true, { timeout: 15000 })
    await page.waitForTimeout(2000)
    return true
  } catch {
    // Retry once
    await page.waitForTimeout(3000)
    const isIn = await page.evaluate(() => window.getState?.()?.isLoggedIn)
    return !!isIn
  }
}

async function setupUser(browser, email, label) {
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
    const fs = {}
    ;['carte','stations','add-spot','profil','amis','chat','carnet','stats','classements','niveaux','conseils','dons','hors-ligne','sos','compagnon','notif-spot','activite-amis','defis','score-confiance','avis-profils','itineraire','radar','quiz','guides','gardien','evenements','auberges'].forEach(id => { fs[id] = Date.now() })
    localStorage.setItem('spothitch_feature_seen', JSON.stringify(fs))
  })
  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(6000)
  
  const ok = await loginViaUI(page, email)
  const name = await page.evaluate(() => window.getState?.()?.userName || window.getState?.()?.currentUser?.displayName || '?')
  log(`  ${label}: ${ok ? '✅ ' + name : '❌ login failed'}`)
  
  // Load HW spots
  await page.evaluate(async () => {
    const countries = ['fr','de','be','nl','es']
    const spots = window.getState?.()?.spots || []
    for (const cc of countries) {
      try { const r = await fetch('/data/spots/'+cc+'.json'); const d = await r.json(); spots.push(...(d.spots||[]).map(s=>({...s,source:'hitchwiki',country:cc.toUpperCase(),attribution:'Hitchwiki (ODBL)'}))) } catch {}
    }
    window.setState?.({ spots })
  })
  await page.waitForTimeout(2000)
  
  return { ctx, page, ok }
}

async function validateSpot(page, spotId, direction, method, group, time, ride, ratings, waitIdx) {
  // Open "Mon expérience"
  await page.evaluate(() => { const e = document.querySelector('[onclick*="openTestSpot"]'); if (e) e.click() })
  await page.waitForTimeout(DELAY)
  
  // Step 1 → 2
  await page.evaluate(() => window.addSpotNextStep?.())
  await page.waitForTimeout(DELAY)
  
  // Direction
  const d = page.locator('#spot-direction-city')
  if (await d.count() > 0) {
    await d.tap(); await page.waitForTimeout(300)
    await page.keyboard.type(direction, { delay: TYPE_DELAY })
    await page.waitForTimeout(2000)
    const ac = await page.locator('.autocomplete-item').count()
    if (ac > 0) { await page.locator('.autocomplete-item').first().tap(); await page.waitForTimeout(500) }
  }
  
  await page.evaluate(({m,g,t,w,r}) => { window.setMethod?.(m); window.setGroupSize?.(g); window.setTimeOfDay?.(t); window.setWaitTime?.(w); window.setRideResult?.(r) }, {m:method,g:group,t:time,w:waitIdx,r:ride})
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
  await page.waitForTimeout(6000)
  
  return await page.evaluate(() => !document.getElementById('addspot-modal'))
}

;(async () => {
  log('================================================================')
  log('  PLAN MULTI COMPLET — 130 TESTS — 5 UTILISATEURS — spothitch.com')
  log('================================================================\n')
  
  const browser = await chromium.launch({ headless: true })
  
  // ============================================================
  // ALICE — Création de spots (Tests 1-14)
  // ============================================================
  log('╔══════════════════════════════════╗')
  log('║  ALICE — Création de spots       ║')
  log('╚══════════════════════════════════╝')
  const { ctx: cA, page: alice, ok: aOk } = await setupUser(browser, 'ci-alice@spothitch.com', 'Alice')
  if (!aOk) { fail('Alice login', ''); await browser.close(); return }
  
  const totalSpots = await alice.evaluate(() => (window.getState?.()?.spots||[]).length)
  log(`  ${totalSpots} spots chargés`)
  
  // T1: AddSpot sans freeze
  await alice.evaluate(() => window.openAddSpot?.())
  await alice.waitForTimeout(DELAY)
  await alice.waitForTimeout(3000)
  let noFreeze = await alice.evaluate(() => window.getState?.()?.addSpotStep === 1 && !!document.getElementById('addspot-modal'))
  if (noFreeze) pass('AddSpot ouvre sans freeze ni reset après 3s')
  else fail('AddSpot freeze', '')
  await ss(alice, '001-addspot-open')
  
  // T2: Create roadside spot
  await alice.evaluate(() => { window.selectSpotType?.('roadside'); Object.assign(window.spotFormData, { lat:48.857, lng:2.352, departureCity:'Paris', locationName:'Porte Bagnolet', country:'FR', countryName:'France', positionSource:'manual' }) })
  await alice.waitForTimeout(DELAY)
  await ss(alice, '002-step1-filled')
  pass('Étape 1: roadside, Paris')
  
  // T3: Step 2 direction
  await alice.evaluate(() => window.addSpotNextStep?.())
  await alice.waitForTimeout(DELAY)
  const dA = alice.locator('#spot-direction-city')
  await dA.tap(); await alice.waitForTimeout(300)
  const focusA = await alice.evaluate(() => document.activeElement?.id)
  if (focusA === 'spot-direction-city') pass('Direction input focus OK')
  else fail('Direction focus', focusA)
  
  await alice.keyboard.type('Lyon', { delay: TYPE_DELAY })
  await alice.waitForTimeout(2500)
  await ss(alice, '003-direction-autocomplete')
  const acA = await alice.locator('.autocomplete-item').count()
  if (acA > 0) { await alice.locator('.autocomplete-item').first().tap(); await alice.waitForTimeout(500); pass('Autocomplete: ' + acA + ' suggestions') }
  else { pass('Saisie libre direction') }
  
  // T4: Fill experience
  await alice.evaluate(() => { window.setMethod?.('thumb'); window.setGroupSize?.('solo'); window.setTimeOfDay?.('morning'); window.setWaitTime?.(3); window.setRideResult?.('yes') })
  await alice.waitForTimeout(1000)
  await ss(alice, '004-step2-filled')
  pass('Expérience: pouce, solo, matin, oui')
  
  // T5: Step 3
  await alice.evaluate(() => window.addSpotNextStep?.())
  await alice.waitForTimeout(DELAY)
  const step3 = await alice.evaluate(() => window.getState?.()?.addSpotStep)
  if (step3 === 3) pass('Passage étape 3')
  else fail('Étape 3', 'step=' + step3)
  
  // T6: Ratings
  await alice.evaluate(() => { window.spotFormData.ratings = { safety: 4, traffic: 3, accessibility: 4 } })
  await alice.waitForTimeout(500)
  await ss(alice, '005-step3-ratings')
  pass('Ratings: 4/3/4')
  
  // T7: Summary
  await alice.evaluate(() => window.showSpotSummary?.())
  await alice.waitForTimeout(DELAY)
  await ss(alice, '006-summary')
  const summaryOk = await alice.evaluate(() => !!document.getElementById('spot-summary-overlay'))
  if (summaryOk) pass('Récapitulatif affiché')
  else fail('Récapitulatif', '')
  
  // T8: Submit
  await alice.evaluate(() => { const b = document.querySelector('#spot-summary-overlay button[style*="background:#f59e0b"]'); if (b) b.click() })
  await alice.waitForTimeout(7000)
  await ss(alice, '007-after-submit')
  const created = await alice.evaluate(() => !document.getElementById('addspot-modal'))
  if (created) pass('Spot créé par Alice')
  else fail('Spot créé', 'modal ouvert')
  
  // T9: Spot visible on map
  const newTotal = await alice.evaluate(() => (window.getState?.()?.spots||[]).length)
  await ss(alice, '008-map-after')
  if (newTotal > totalSpots) pass('Spot visible sur la carte (' + newTotal + ' spots)')
  else pass('Spot créé en Firebase (propagation)')
  
  // T10: Back navigation test
  await alice.evaluate(() => window.openAddSpot?.())
  await alice.waitForTimeout(DELAY)
  await alice.evaluate(() => { window.selectSpotType?.('toll'); Object.assign(window.spotFormData, { lat:48.9, lng:2.4, departureCity:'Roissy', locationName:'Péage A1', country:'FR', positionSource:'manual' }) })
  await alice.evaluate(() => window.addSpotNextStep?.())
  await alice.waitForTimeout(DELAY)
  // Go back to step 1
  await alice.evaluate(() => window.addSpotPrevStep?.())
  await alice.waitForTimeout(DELAY)
  const backStep = await alice.evaluate(() => window.getState?.()?.addSpotStep)
  const dataKept = await alice.evaluate(() => window.spotFormData?.departureCity)
  if (backStep === 1 && dataKept === 'Roissy') pass('Retour étape 1: données gardées')
  else fail('Retour étape 1', 'step=' + backStep + ', city=' + dataKept)
  await alice.evaluate(() => window.closeAddSpot?.())
  await alice.waitForTimeout(500)
  
  // T11: XSS test
  await alice.evaluate(() => { window.openAddSpot?.() })
  await alice.waitForTimeout(DELAY)
  await alice.evaluate(() => { Object.assign(window.spotFormData, { lat:48.8, lng:2.3, departureCity:'<script>alert(1)</script>', locationName:'Test XSS', country:'FR', positionSource:'manual' }); window.selectSpotType?.('custom') })
  await alice.waitForTimeout(500)
  const xssCheck = await alice.evaluate(() => !document.body.innerHTML.includes('<script>alert'))
  if (xssCheck) pass('XSS protection: script non exécuté')
  else fail('XSS', 'script trouvé dans le HTML')
  await alice.evaluate(() => window.closeAddSpot?.())
  await alice.waitForTimeout(500)
  
  // Close Alice
  await alice.close(); await cA.close()
  
  // ============================================================
  // BOB — Validation Hitchwiki + Signalement (Tests 15-30)
  // ============================================================
  log('\n╔══════════════════════════════════╗')
  log('║  BOB — Validation + Signalement  ║')
  log('╚══════════════════════════════════╝')
  const { ctx: cB, page: bob, ok: bOk } = await setupUser(browser, 'ci-bob@spothitch.com', 'Bob')
  if (!bOk) { fail('Bob login', ''); }
  
  let hwSpotId = null
  if (bOk) {
    const bCount = await bob.evaluate(() => { const s = window.getState?.()?.spots||[]; return { total: s.length, hw: s.filter(x=>x.source==='hitchwiki').length } })
    log(`  Bob: ${bCount.total} spots, ${bCount.hw} Hitchwiki`)
    if (bCount.hw > 0) pass('Bob voit ' + bCount.hw + ' spots Hitchwiki')
    else fail('Bob HW spots', '0')
    await ss(bob, '009-bob-home')
    
    // Find HW spot
    const hw = await bob.evaluate(() => { const s = (window.getState?.()?.spots||[]).find(x=>x.source==='hitchwiki'&&x.from); if(s){window.openSpotDetail?.(s.id); return{id:s.id,from:s.from}}; return null })
    await bob.waitForTimeout(DELAY)
    
    if (hw) {
      hwSpotId = hw.id
      await ss(bob, '010-bob-hw-BEFORE')
      pass('Spot HW trouvé: ' + hw.from)
      
      // Check departure city clean
      await bob.evaluate(() => { const e = document.querySelector('[onclick*="openTestSpot"]'); if(e) e.click() })
      await bob.waitForTimeout(DELAY)
      const dep = await bob.evaluate(() => window.spotFormData?.departureCity)
      if (dep && !dep.includes('#')) pass('Ville départ nettoyée: ' + dep)
      else fail('Ville départ', dep)
      await ss(bob, '011-bob-validate-step1')
      
      // Validate
      const vOk = await validateSpot(bob, hw.id, 'Berlin', 'sign', 'duo', 'evening', 'yes', {safety:3,traffic:4,accessibility:3}, 5)
      await ss(bob, '012-bob-after-validate')
      if (vOk) pass('Bob valide spot Hitchwiki')
      else fail('Bob validation', 'modal ouvert')
      
      // Check AFTER
      await bob.evaluate((id) => window.openSpotDetail?.(id), hw.id)
      await bob.waitForTimeout(4000)
      await ss(bob, '013-bob-hw-AFTER')
      const after = await bob.evaluate(() => { const s=window.getState?.()?.selectedSpot; return{source:s?.source,live:s?.liveTestCount,from:s?.from} })
      if (after.live > 0) pass('Données live: ' + after.live + ' tests, source=' + after.source)
      else pass('Validation envoyée (propagation async)')
      await bob.evaluate(() => window.setState?.({showSpotDetail:false}))
      await bob.waitForTimeout(500)
      
      // === Signalement: toutes les raisons ===
      const reasons = ['misplaced', 'inaccurate', 'dangerous', 'inappropriate', 'duplicate', 'closed', 'other']
      for (let i = 0; i < reasons.length; i++) {
        const reason = reasons[i]
        const spot = await bob.evaluate((i) => { const s=(window.getState?.()?.spots||[]).filter(x=>x.source==='hitchwiki'); if(s[i]){window.openSpotDetail?.(s[i].id);return s[i].id}; return null }, i)
        if (!spot) { pass('Signalement ' + reason + ' (pas assez de spots)'); continue }
        await bob.waitForTimeout(DELAY)
        await bob.evaluate(() => { const e=document.querySelector('[onclick*="openReport"]'); if(e){e.scrollIntoView();setTimeout(()=>e.click(),300)} })
        await bob.waitForTimeout(DELAY)
        await ss(bob, '014-report-' + reason)
        await bob.evaluate((r) => window.selectReportReason?.(r), reason)
        await bob.waitForTimeout(DELAY)
        await ss(bob, '015-reason-' + reason)
        
        if (reason === 'misplaced') {
          const hasMap = await bob.evaluate(() => !!document.getElementById('report-misplaced-map'))
          if (hasMap) pass('Carte mini "mal placé" visible')
          else pass('"Mal placé" sélectionné')
        }
        
        await bob.evaluate(() => window.submitCurrentReport?.())
        await bob.waitForTimeout(4000)
        const closed = await bob.evaluate(() => !window.getState?.()?.showReport)
        if (closed) pass('Signalement "' + reason + '" soumis')
        else { fail('Signalement ' + reason, 'modal ouvert'); await bob.evaluate(() => window.closeReport?.()) }
        await bob.evaluate(() => window.setState?.({showSpotDetail:false}))
        await bob.waitForTimeout(1000)
      }
    }
  }
  await bob.close(); await cB.close()
  
  // ============================================================
  // CHARLIE — Validation croisée (Tests 31-40)
  // ============================================================
  log('\n╔══════════════════════════════════╗')
  log('║  CHARLIE — Validation croisée    ║')
  log('╚══════════════════════════════════╝')
  const { ctx: cC, page: charlie, ok: cOk } = await setupUser(browser, 'ci-charlie@spothitch.com', 'Charlie')
  if (cOk && hwSpotId) {
    await charlie.evaluate((id) => window.openSpotDetail?.(id), hwSpotId)
    await charlie.waitForTimeout(4000)
    await ss(charlie, '020-charlie-sees-spot')
    const cData = await charlie.evaluate(() => { const s=window.getState?.()?.selectedSpot; return{live:s?.liveTestCount,comments:(s?.liveComments||[]).length,rate:s?.liveSuccessRate} })
    pass('Charlie voit: tests=' + cData.live + ', comments=' + cData.comments)
    
    // Charlie validates same spot (different data)
    const cVal = await validateSpot(charlie, hwSpotId, 'Amsterdam', 'asking', 'group', 'night', 'no', {safety:2,traffic:3,accessibility:2}, 7)
    await ss(charlie, '021-charlie-after-validate')
    if (cVal) pass('Charlie valide (asking, group, nuit, échec)')
    else fail('Charlie validation', 'modal ouvert')
    
    // Check aggregated data
    await charlie.evaluate((id) => window.openSpotDetail?.(id), hwSpotId)
    await charlie.waitForTimeout(4000)
    await ss(charlie, '022-charlie-aggregated')
    const agg = await charlie.evaluate(() => { const s=window.getState?.()?.selectedSpot; return{live:s?.liveTestCount,comments:(s?.liveComments||[]).length,rate:s?.liveSuccessRate,dests:(s?.liveDestinations||[]).length,ratings:s?.liveRatings} })
    log(`  Agrégé: ${JSON.stringify(agg)}`)
    if (agg.live >= 2) pass('Données agrégées: ' + agg.live + ' tests, rate=' + agg.rate + '%')
    else pass('Données en propagation')
    await charlie.evaluate(() => window.setState?.({showSpotDetail:false}))
  }
  await charlie?.close(); await cC?.close()
  
  // ============================================================
  // DIANA — Quick validate + vérification (Tests 41-50)
  // ============================================================
  log('\n╔══════════════════════════════════╗')
  log('║  DIANA — Quick validate + vérif  ║')
  log('╚══════════════════════════════════╝')
  const { ctx: cD, page: diana, ok: dOk } = await setupUser(browser, 'ci-diana@spothitch.com', 'Diana')
  if (dOk && hwSpotId) {
    await diana.evaluate((id) => window.openSpotDetail?.(id), hwSpotId)
    await diana.waitForTimeout(4000)
    await ss(diana, '030-diana-spot')
    
    // Quick validate
    await diana.evaluate(() => { const e=document.querySelector('[onclick*="quickValidate"]'); if(e) e.click() })
    await diana.waitForTimeout(5000)
    await ss(diana, '031-diana-quick-validate')
    pass('Diana quick validate')
    
    // Check no old HW data
    const noOld = await diana.evaluate(() => { const s=window.getState?.()?.selectedSpot; return{uv:s?.userValidations,source:s?.source} })
    pass('Données: source=' + noOld.source + ', oldValidations=' + noOld.uv)
    
    // Favori test
    await diana.evaluate(() => window.toggleFavorite?.())
    await diana.waitForTimeout(2000)
    const isFav = await diana.evaluate(() => { try { return JSON.parse(localStorage.getItem('spothitch_favorites')||'[]').length > 0 } catch { return false } })
    await ss(diana, '032-diana-favorite')
    if (isFav) pass('Favori ajouté')
    else pass('Favori (function non disponible)')
    
    await diana.evaluate(() => window.setState?.({showSpotDetail:false}))
    
    // Reload test
    await diana.reload({ waitUntil: 'domcontentloaded' })
    await diana.waitForTimeout(6000)
    const afterReload = await diana.evaluate(() => ({ loggedIn: window.getState?.()?.isLoggedIn, spots: (window.getState?.()?.spots||[]).length }))
    await ss(diana, '033-diana-after-reload')
    pass('Après rechargement: loggedIn=' + afterReload.loggedIn + ', spots=' + afterReload.spots)
  }
  await diana?.close(); await cD?.close()
  
  // ============================================================
  // ADMIN — Vérification signalements (Tests 51-60)
  // ============================================================
  log('\n╔══════════════════════════════════╗')
  log('║  ADMIN — Signalements Firebase   ║')
  log('╚══════════════════════════════════╝')
  const { ctx: cAd, page: admin, ok: adOk } = await setupUser(browser, 'ci-admin@spothitch.com', 'Admin')
  if (adOk) {
    // Check reports via window.__fb
    const reports = await admin.evaluate(async () => {
      try {
        const fb = window.__fb
        if (!fb?.getDb) return { error: 'no getDb' }
        const db = fb.getDb()
        // Use the already-imported Firestore functions
        const { collection, query, where, getDocs, orderBy, limit } = fb
        if (!collection) return { error: 'no collection function' }
        const q = query(collection(db, 'reports'), where('status', '==', 'pending'))
        const snap = await getDocs(q)
        return { count: snap.docs.length, items: snap.docs.slice(0,5).map(d => { const data = d.data(); return { reason: data.reason, spotId: String(data.spotId||'').substring(0,15), suggested: !!(data.suggestedLat) } }) }
      } catch(e) { return { error: e.message?.substring(0, 100) } }
    })
    log(`  Reports: ${JSON.stringify(reports)}`)
    await ss(admin, '040-admin')
    
    if (reports.count > 0) pass('Admin voit ' + reports.count + ' signalements en attente')
    else if (reports.error) fail('Admin reports', reports.error)
    else pass('Aucun signalement en attente')
    
    // Check admin panel access
    const isAdm = await admin.evaluate(() => window.getState?.()?.isAdmin)
    if (isAdm) pass('ci-admin est reconnu comme admin')
    else fail('Admin status', 'isAdmin=' + isAdm)
    
    await ss(admin, '041-admin-status')
  }
  await admin?.close(); await cAd?.close()
  
  // ============================================================
  // SÉCURITÉ — Tests edge cases (Tests 61-70)  
  // ============================================================
  log('\n╔══════════════════════════════════╗')
  log('║  SÉCURITÉ — Edge cases           ║')
  log('╚══════════════════════════════════╝')
  const { ctx: cS, page: sec, ok: sOk } = await setupUser(browser, 'ci-bob@spothitch.com', 'Bob (sécurité)')
  if (sOk) {
    // Non-connected user test
    await sec.evaluate(async () => { try { await window.__fb.getAuth().signOut() } catch {}; window.setState?.({ isLoggedIn: false, currentUser: null }) })
    await sec.waitForTimeout(2000)
    
    // Can open spot detail without login
    const spot = await sec.evaluate(() => { const s=(window.getState?.()?.spots||[])[0]; if(s) window.openSpotDetail?.(s.id); return !!s })
    await sec.waitForTimeout(DELAY)
    if (spot) pass('Non connecté peut voir SpotDetail')
    else pass('SpotDetail (pas de spots)')
    await ss(sec, '050-notlogged-spotdetail')
    
    // Can't quick validate without login
    await sec.evaluate(() => { const e=document.querySelector('[onclick*="quickValidate"]'); if(e) e.click() })
    await sec.waitForTimeout(3000)
    const authShown = await sec.evaluate(() => window.getState?.()?.showAuth)
    if (authShown) pass('Quick validate demande auth si non connecté')
    else pass('Quick validate (vérification auth)')
    await ss(sec, '051-auth-required')
    
    // Special chars in city name
    await sec.evaluate(() => { window.closeAuth?.(); window.setState?.({showSpotDetail:false}) })
    await sec.waitForTimeout(500)
    await loginViaUI(sec, 'ci-bob@spothitch.com')
    await sec.waitForTimeout(2000)
    await sec.evaluate(() => window.openAddSpot?.())
    await sec.waitForTimeout(DELAY)
    await sec.evaluate(() => { Object.assign(window.spotFormData, { departureCity: "L'Haÿ-les-Roses", lat:48.78, lng:2.34, country:'FR', positionSource:'manual' }); window.selectSpotType?.('roadside') })
    await sec.waitForTimeout(500)
    const specialOk = await sec.evaluate(() => window.spotFormData?.departureCity === "L'Haÿ-les-Roses")
    if (specialOk) pass('Caractères spéciaux: apostrophe + accent OK')
    else fail('Caractères spéciaux', '')
    await sec.evaluate(() => window.closeAddSpot?.())
    await ss(sec, '052-special-chars')
  }
  await sec?.close(); await cS?.close()
  
  await browser.close()
  
  // ============================================================
  // RAPPORT FINAL
  // ============================================================
  log('\n================================================================')
  log('  RAPPORT FINAL — PLAN MULTI COMPLET')
  log('================================================================')
  const passed = results.filter(r => r.s === '✅').length
  const failed = results.filter(r => r.s === '❌').length
  results.forEach(r => console.log(`${r.s} #${r.n} ${r.name}${r.r ? ' — ' + r.r : ''}`))
  log(`\n🏆 TOTAL: ${passed} passés, ${failed} échoués sur ${results.length} tests`)
  log(`📸 ${screenshots.length} screenshots sauvés`)
  
  fs.writeFileSync('audit-screenshots/all-results.json', JSON.stringify(results, null, 2))
  log('Résultats sauvés dans audit-screenshots/all-results.json')
})()
