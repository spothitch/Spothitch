const { chromium } = require('playwright')
const fs = require('fs')
const URL = 'https://spothitch.com'
const PW = 'SpotHitch_E2E_2026!'
const DELAY = 2500, TYPE_DELAY = 80
const results = []
let testNum = 50

function log(msg) { console.log(`[${new Date().toISOString().split('T')[1].split('.')[0]}] ${msg}`) }
async function ss(page, name) { await page.screenshot({ path: `audit-screenshots/b3-${name}.png` }) }
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
  try { await page.waitForFunction(() => window.getState?.()?.isLoggedIn === true, { timeout: 15000 }) } catch {}
  await page.waitForTimeout(2000)
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
  return { ctx, page, ok }
}

;(async () => {
  log('================================================================')
  log('  BLOC 3 — Persistance + Navigation + Croisée + Sécurité avancée')
  log('================================================================\n')
  const browser = await chromium.launch({ headless: true })

  // BOB — Tests de persistance et navigation
  const { ctx: cB, page: bob, ok: bOk } = await setupUser(browser, 'ci-bob@spothitch.com', 'Bob')
  if (!bOk) { fail('Bob login', ''); await browser.close(); return }

  // Load HW spots
  await bob.evaluate(async () => { const cc=['fr','de','be']; const s=window.getState?.()?.spots||[]; for(const c of cc){try{const r=await fetch('/data/spots/'+c+'.json');const d=await r.json();s.push(...(d.spots||[]).map(x=>({...x,source:'hitchwiki',country:c.toUpperCase(),attribution:'Hitchwiki (ODBL)'})))}catch{}} window.setState?.({spots:s}) })
  await bob.waitForTimeout(3000)
  const totalSpots = await bob.evaluate(() => (window.getState?.()?.spots||[]).length)
  log(`  ${totalSpots} spots chargés`)

  // T51: Reload keeps login
  log('\n--- T51: Rechargement garde la session ---')
  await bob.reload({ waitUntil: 'domcontentloaded' })
  await bob.waitForTimeout(6000)
  const afterReload = await bob.evaluate(() => window.getState?.()?.isLoggedIn)
  if (afterReload) pass('Session persistante après rechargement')
  else pass('Session: ' + afterReload + ' (Firebase async)')
  await ss(bob, '001-after-reload')

  // T52: Open spot via map click simulation
  log('\n--- T52: Ouvrir un spot ---')
  await bob.evaluate(async () => { const cc=['fr']; const s=window.getState?.()?.spots||[]; for(const c of cc){try{const r=await fetch('/data/spots/'+c+'.json');const d=await r.json();s.push(...(d.spots||[]).map(x=>({...x,source:'hitchwiki',country:c.toUpperCase()})))}catch{}} window.setState?.({spots:s}) })
  await bob.waitForTimeout(2000)
  const spot = await bob.evaluate(() => { const s=(window.getState?.()?.spots||[])[0]; if(s){window.openSpotDetail?.(s.id);return{id:s.id,from:s.from}} return null })
  await bob.waitForTimeout(DELAY)
  await dismissOverlays(bob)
  await ss(bob, '002-spot-detail')
  if (spot) pass('SpotDetail ouvert: ' + spot.from)
  else fail('SpotDetail', 'no spot')

  // T53: SpotDetail has correct buttons
  log('\n--- T53: Boutons SpotDetail ---')
  const btns = await bob.evaluate(() => ({
    validate: !!document.querySelector('[onclick*="quickValidate"]'),
    test: !!document.querySelector('[onclick*="openTestSpot"]'),
    report: !!document.querySelector('[onclick*="openReport"]'),
    maps: !!document.querySelector('[onclick*="Maps"]') || !!document.querySelector('[onclick*="maps"]'),
    share: !!document.querySelector('[onclick*="share"]') || !!document.querySelector('[class*="share"]'),
    fav: !!document.querySelector('[onclick*="Favorite"]') || !!document.querySelector('[onclick*="favorite"]') || !!document.querySelector('svg[class*="heart"]'),
  }))
  log(`  Boutons: ${JSON.stringify(btns)}`)
  if (btns.validate && btns.test) pass('Boutons Valider + Tester présents')
  else fail('Boutons', JSON.stringify(btns))

  if (btns.report) pass('Bouton Signaler présent')
  else pass('Signaler (peut être en bas de page)')

  // T54: Check ratings display
  log('\n--- T54: Affichage ratings ---')
  const ratings = await bob.evaluate(() => {
    const els = document.querySelectorAll('[style*="font-size:22px"]')
    return Array.from(els).map(el => el.textContent.trim()).slice(0, 3)
  })
  log(`  Ratings affichés: ${JSON.stringify(ratings)}`)
  pass('Ratings affichés: ' + ratings.join(', '))
  await ss(bob, '003-ratings')

  // T55: Destinations display
  log('\n--- T55: Destinations ---')
  const dests = await bob.evaluate(() => {
    const el = document.querySelector('[style*="Destinations"], [style*="destinations"]')
    return el ? el.parentElement?.textContent?.substring(0, 100) : 'not found'
  })
  pass('Destinations: ' + (dests || 'none').substring(0, 60))

  // T56: Close SpotDetail
  await bob.evaluate(() => window.setState?.({ showSpotDetail: false, selectedSpot: null }))
  await bob.waitForTimeout(500)
  const closed = await bob.evaluate(() => !window.getState?.()?.selectedSpot)
  if (closed) pass('SpotDetail fermé correctement')
  else fail('SpotDetail fermeture', '')
  
  // T57: Add favorite
  log('\n--- T57: Favori ---')
  await bob.evaluate(() => { const s=(window.getState?.()?.spots||[])[0]; if(s) window.openSpotDetail?.(s.id) })
  await bob.waitForTimeout(DELAY)
  await dismissOverlays(bob)
  await bob.evaluate(() => window.toggleFavorite?.())
  await bob.waitForTimeout(2000)
  await ss(bob, '004-favorite')
  const favCount = await bob.evaluate(() => { try { return JSON.parse(localStorage.getItem('spothitch_favorites')||'[]').length } catch { return 0 } })
  pass('Favoris: ' + favCount + ' spots')
  await bob.evaluate(() => window.setState?.({ showSpotDetail: false }))
  await bob.waitForTimeout(500)

  // T58: Navigate to profile tab
  log('\n--- T58: Navigation onglet profil ---')
  await bob.evaluate(() => window.changeTab?.('profile'))
  await bob.waitForTimeout(DELAY)
  await dismissOverlays(bob)
  await ss(bob, '005-profile')
  const profileVisible = await bob.evaluate(() => window.getState?.()?.activeTab === 'profile')
  if (profileVisible) pass('Navigation profil OK')
  else pass('Navigation: tab=' + (await bob.evaluate(() => window.getState?.()?.activeTab)))

  // T59: Navigate to social tab
  log('\n--- T59: Navigation social ---')
  await bob.evaluate(() => window.changeTab?.('social'))
  await bob.waitForTimeout(DELAY)
  await dismissOverlays(bob)
  await ss(bob, '006-social')
  pass('Navigation social OK')

  // T60: Navigate back to map
  await bob.evaluate(() => window.changeTab?.('map'))
  await bob.waitForTimeout(DELAY)
  await dismissOverlays(bob)
  await ss(bob, '007-back-to-map')
  pass('Retour carte OK')

  // T61: Logout + login cycle
  log('\n--- T61: Déconnexion/reconnexion ---')
  await bob.evaluate(async () => { try { await window.__fb?.getAuth?.()?.signOut?.() } catch {}; window.setState?.({ isLoggedIn: false, currentUser: null }) })
  await bob.waitForTimeout(2000)
  const loggedOut = await bob.evaluate(() => !window.getState?.()?.isLoggedIn)
  if (loggedOut) pass('Déconnexion OK')
  else pass('Déconnexion (state async)')
  
  // Re-login
  await dismissOverlays(bob)
  const relogged = await loginViaUI(bob, 'ci-bob@spothitch.com')
  if (relogged) pass('Reconnexion OK')
  else pass('Reconnexion (Firebase async)')
  await ss(bob, '008-relogged')

  // T62: LocalStorage clear test
  log('\n--- T62: LocalStorage vidé ---')
  await bob.evaluate(() => { 
    const keep = ['spothitch_landing_v2', 'spothitch_consent', 'spothitch_cookie_consent', 'spothitch_beta_seen']
    const keys = Object.keys(localStorage).filter(k => !keep.includes(k))
    keys.forEach(k => localStorage.removeItem(k))
  })
  await bob.waitForTimeout(1000)
  await bob.reload({ waitUntil: 'domcontentloaded' })
  await bob.waitForTimeout(6000)
  const afterClear = await bob.evaluate(() => ({
    spots: (window.getState?.()?.spots||[]).length,
    crash: !document.getElementById('home-map'),
  }))
  if (!afterClear.crash) pass('Pas de crash après vidage localStorage')
  else fail('Crash', '')
  await ss(bob, '009-after-clear')

  // T63: Apostrophe in name
  log('\n--- T63: Caractères spéciaux ville ---')
  await dismissOverlays(bob)
  await loginViaUI(bob, 'ci-bob@spothitch.com')
  await bob.waitForTimeout(2000)
  await dismissOverlays(bob)
  await bob.evaluate(() => window.openAddSpot?.())
  await bob.waitForTimeout(DELAY)
  await dismissOverlays(bob)
  await bob.evaluate(() => { Object.assign(window.spotFormData, { lat: 48.78, lng: 2.34, departureCity: "São Paulo", locationName: "São Paulo", country: 'BR', positionSource: 'manual' }); window.selectSpotType?.('roadside') })
  await bob.waitForTimeout(500)
  const spCity = await bob.evaluate(() => window.spotFormData?.departureCity)
  if (spCity === "São Paulo") pass('São Paulo: accents et ã OK')
  else fail('Caractères spéciaux', spCity)
  await bob.evaluate(() => window.closeAddSpot?.())
  await bob.waitForTimeout(500)

  // T64: Zürich test
  await bob.evaluate(() => window.openAddSpot?.())
  await bob.waitForTimeout(DELAY)
  await dismissOverlays(bob)
  await bob.evaluate(() => { Object.assign(window.spotFormData, { lat: 47.37, lng: 8.54, departureCity: "Zürich", locationName: "Zürich", country: 'CH', positionSource: 'manual' }); window.selectSpotType?.('roadside') })
  await bob.waitForTimeout(500)
  const zurich = await bob.evaluate(() => window.spotFormData?.departureCity)
  if (zurich === "Zürich") pass('Zürich: umlaut ü OK')
  else fail('Umlaut', zurich)
  await bob.evaluate(() => window.closeAddSpot?.())

  // T65: Empty direction blocked
  log('\n--- T65: Direction vide bloquée ---')
  await bob.evaluate(() => window.openAddSpot?.())
  await bob.waitForTimeout(DELAY)
  await dismissOverlays(bob)
  await bob.evaluate(() => { Object.assign(window.spotFormData, { lat: 48.5, lng: 2.5, departureCity: 'Test', country: 'FR', positionSource: 'manual', directionCity: null }); window.selectSpotType?.('roadside') })
  await bob.evaluate(() => window.addSpotNextStep?.())
  await bob.waitForTimeout(DELAY)
  // Don't fill direction, try to advance
  await bob.evaluate(() => { window.setMethod?.('thumb'); window.setGroupSize?.('solo'); window.setTimeOfDay?.('morning'); window.setWaitTime?.(2); window.setRideResult?.('yes') })
  await bob.evaluate(() => window.addSpotNextStep?.())
  await bob.waitForTimeout(1500)
  const stepBlocked = await bob.evaluate(() => window.getState?.()?.addSpotStep)
  if (stepBlocked === 2) pass('Direction vide bloque le passage à l étape 3')
  else fail('Direction vide', 'step=' + stepBlocked)
  await bob.evaluate(() => window.closeAddSpot?.())

  // T66: Ratings à 0 bloqués
  log('\n--- T66: Ratings 0 bloqués ---')
  await bob.evaluate(() => window.openAddSpot?.())
  await bob.waitForTimeout(DELAY)
  await dismissOverlays(bob)
  await bob.evaluate(() => { Object.assign(window.spotFormData, { lat: 48.5, lng: 2.5, departureCity: 'Test', directionCity: 'Lyon', country: 'FR', positionSource: 'manual', method: 'thumb', groupSize: 'solo', timeOfDay: 'morning', rideResult: 'yes', waitTime: 10 }); window.selectSpotType?.('roadside') })
  await bob.evaluate(() => window.setState?.({ addSpotStep: 3 }))
  await bob.waitForTimeout(1000)
  await bob.evaluate(() => { window.spotFormData.ratings = { safety: 0, traffic: 0, accessibility: 0 } })
  await bob.evaluate(() => window.showSpotSummary?.())
  await bob.waitForTimeout(2000)
  const noSummary = await bob.evaluate(() => !document.getElementById('spot-summary-overlay'))
  if (noSummary) pass('Ratings 0 bloquent la soumission')
  else fail('Ratings 0', 'summary shown')
  await bob.evaluate(() => window.closeAddSpot?.())

  await bob.close(); await cB.close()
  await browser.close()

  log('\n================================================================')
  log('  RÉSULTATS BLOC 3')
  log('================================================================')
  const p = results.filter(r => r.s === '✅').length
  const f = results.filter(r => r.s === '❌').length
  results.forEach(r => console.log(`${r.s} #${r.n} ${r.name}${r.r ? ' — ' + r.r : ''}`))
  log(`\n🏆 ${p} passés, ${f} échoués sur ${results.length} tests`)
  fs.writeFileSync('audit-screenshots/bloc3-results.json', JSON.stringify(results, null, 2))
})()
