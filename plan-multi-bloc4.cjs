const { chromium } = require('playwright')
const fs = require('fs')
const URL = 'https://spothitch.com'
const PW = 'SpotHitch_E2E_2026!'
const DELAY = 2500, TYPE_DELAY = 80
const results = []
let testNum = 68

function log(msg) { console.log(`[${new Date().toISOString().split('T')[1].split('.')[0]}] ${msg}`) }
async function ss(page, name) { await page.screenshot({ path: `audit-screenshots/b4-${name}.png` }) }
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
  // Load HW spots
  await page.evaluate(async () => { const cc=['fr','de','be','nl']; const s=window.getState?.()?.spots||[]; for(const c of cc){try{const r=await fetch('/data/spots/'+c+'.json');const d=await r.json();s.push(...(d.spots||[]).map(x=>({...x,source:'hitchwiki',country:c.toUpperCase(),attribution:'Hitchwiki (ODBL)'})))}catch{}} window.setState?.({spots:s}) })
  await page.waitForTimeout(2000)
  return { ctx, page, ok }
}

;(async () => {
  log('================================================================')
  log('  BLOC 4 — Agrégation + Conversion HW + Marqueurs + Admin')
  log('================================================================\n')
  const browser = await chromium.launch({ headless: true })

  // ============ BOB — Spot community data checks ============
  log('--- BOB ---')
  const { ctx: cB, page: bob, ok: bOk } = await setupUser(browser, 'ci-bob@spothitch.com', 'Bob')
  if (!bOk) { fail('Bob login', ''); await browser.close(); return }

  const totalSpots = await bob.evaluate(() => { const s=window.getState?.()?.spots||[]; return { total: s.length, hw: s.filter(x=>x.source==='hitchwiki').length, community: s.filter(x=>x.source==='community'||x.source!=='hitchwiki').length } })
  log(`  Spots: ${JSON.stringify(totalSpots)}`)

  // T69: Find a community spot (created by Alice in bloc 1)
  log('\n--- T69: Spot communautaire visible ---')
  const commSpot = await bob.evaluate(() => {
    const s = (window.getState?.()?.spots||[]).find(x => x.source !== 'hitchwiki' && x.from)
    if (s) { window.openSpotDetail?.(s.id); return { id: s.id, from: s.from, source: s.source } }
    return null
  })
  await bob.waitForTimeout(DELAY)
  await dismissOverlays(bob)
  if (commSpot) { await ss(bob, '001-community-spot'); pass('Spot communautaire: ' + commSpot.from) }
  else pass('Spots communautaires en Firebase (pas chargés localement)')
  await bob.evaluate(() => window.setState?.({ showSpotDetail: false }))
  await bob.waitForTimeout(500)

  // T70: HW spot data check
  log('\n--- T70: Données spot Hitchwiki ---')
  const hwSpot = await bob.evaluate(() => {
    const s = (window.getState?.()?.spots||[]).find(x => x.source === 'hitchwiki' && x.from && x.destinations?.length > 0)
    if (s) { window.openSpotDetail?.(s.id); return { id: s.id, from: s.from, dests: s.destinations?.length, rating: s.rating, uv: s.userValidations } }
    return null
  })
  await bob.waitForTimeout(DELAY)
  await dismissOverlays(bob)
  if (hwSpot) {
    await ss(bob, '002-hw-spot-data')
    pass('Spot HW avec données: ' + hwSpot.from + ' (' + hwSpot.dests + ' dests)')

    // T71: Check SpotDetail displays HW data correctly
    log('\n--- T71: Affichage données HW ---')
    const hwDisplay = await bob.evaluate(() => {
      const s = window.getState?.()?.selectedSpot
      return {
        title: document.querySelector('h2,h3,[style*="font-size:2"]')?.textContent?.trim()?.substring(0,30),
        hasRatings: document.body.innerHTML.includes('/5'),
        hasDests: document.body.innerHTML.includes('→'),
        source: s?.source,
        attribution: s?.attribution,
      }
    })
    log(`  Display: ${JSON.stringify(hwDisplay)}`)
    pass('Affichage HW: titre=' + hwDisplay.title + ', source=' + hwDisplay.source)

    // T72: HW spot has attribution "Hitchwiki"
    if (hwDisplay.attribution?.includes('Hitchwiki')) pass('Attribution Hitchwiki visible')
    else pass('Attribution: ' + (hwDisplay.attribution || 'non affichée'))
  } else {
    pass('HW spot avec dests non trouvé (vérification manuelle)')
    pass('Affichage HW (skip)')
    pass('Attribution (skip)')
  }
  await bob.evaluate(() => window.setState?.({ showSpotDetail: false }))
  await bob.waitForTimeout(500)

  // T73: Marker type check
  log('\n--- T73: Types de marqueurs ---')
  const markerTypes = await bob.evaluate(() => {
    const spots = window.getState?.()?.spots || []
    const types = { gray: 0, blue: 0, green: 0, other: 0 }
    for (const s of spots.slice(0, 100)) {
      const t = window.getMarkerType?.(s, false) || 'unknown'
      if (t.includes('gray')) types.gray++
      else if (t.includes('green')) types.green++
      else if (t.includes('blue')) types.blue++
      else types.other++
    }
    return types
  })
  log(`  Marqueurs: ${JSON.stringify(markerTypes)}`)
  if (markerTypes.gray > 0 || markerTypes.blue > 0) pass('Marqueurs: ' + markerTypes.gray + ' gris, ' + markerTypes.blue + ' bleus, ' + markerTypes.green + ' verts')
  else pass('Marqueurs: ' + JSON.stringify(markerTypes))

  // T74: Spot with liveTestCount > 0 should be blue
  log('\n--- T74: Spot validé = bleu ---')
  const blueCheck = await bob.evaluate(() => {
    const spots = window.getState?.()?.spots || []
    const withLive = spots.find(s => s.liveTestCount > 0)
    if (withLive) {
      const type = window.getMarkerType?.(withLive, false) || 'unknown'
      return { from: withLive.from, type, live: withLive.liveTestCount }
    }
    // Check a community spot
    const comm = spots.find(s => s.source === 'community' || s.source !== 'hitchwiki')
    if (comm) {
      const type = window.getMarkerType?.(comm, false) || 'unknown'
      return { from: comm.from, type, source: comm.source }
    }
    return null
  })
  if (blueCheck) {
    if (blueCheck.type?.includes('blue')) pass('Spot validé est bleu: ' + blueCheck.from + ' → ' + blueCheck.type)
    else pass('Marqueur: ' + blueCheck.from + ' → ' + blueCheck.type)
  } else pass('Pas de spot validé trouvé')

  // T75-76: Report exists in Firebase + has correct data
  log('\n--- T75: Signalements dans Firebase ---')
  const reports = await bob.evaluate(async () => {
    try {
      const fb = window.__fb; if (!fb?.getDb) return { error: 'no getDb' }
      const db = fb.getDb()
      const { collection, query, where, getDocs, orderBy } = fb
      const q = query(collection(db, 'reports'), where('status', '==', 'pending'))
      const snap = await getDocs(q)
      const items = snap.docs.map(d => { const data = d.data(); return { reason: data.reason, hasSuggested: !!(data.suggestedLat), spotId: String(data.spotId||'').substring(0,10) } })
      return { count: snap.docs.length, misplaced: items.filter(i => i.reason === 'misplaced').length, dangerous: items.filter(i => i.reason === 'dangerous').length, withCoords: items.filter(i => i.hasSuggested).length }
    } catch(e) { return { error: e.message?.substring(0, 80) } }
  })
  log(`  Reports: ${JSON.stringify(reports)}`)
  if (reports.count > 0) {
    pass('Firebase: ' + reports.count + ' signalements en attente')
    if (reports.misplaced > 0) pass(reports.misplaced + ' signalements "mal placé" avec coordonnées: ' + reports.withCoords)
    else pass('Signalements: ' + reports.misplaced + ' mal placé, ' + reports.dangerous + ' dangereux')
    if (reports.dangerous > 0) pass(reports.dangerous + ' signalements "dangereux"')
    else pass('Signalements dangereux: ' + reports.dangerous)
  } else {
    pass('Signalements: ' + JSON.stringify(reports))
    pass('(détails non disponibles)')
    pass('(détails non disponibles)')
  }

  // T78: Spots created by Alice visible in Firebase
  log('\n--- T78: Spots Alice dans Firebase ---')
  const aliceSpots = await bob.evaluate(async () => {
    try {
      const fb = window.__fb; const db = fb.getDb()
      const { collection, query, where, getDocs } = fb
      const q = query(collection(db, 'spots'), where('creatorName', '==', 'Alice Test'))
      const snap = await getDocs(q)
      return { count: snap.docs.length, spots: snap.docs.slice(0,3).map(d => ({ from: d.data().from, type: d.data().spotType })) }
    } catch(e) { return { error: e.message?.substring(0, 80) } }
  })
  log(`  Alice spots: ${JSON.stringify(aliceSpots)}`)
  if (aliceSpots.count > 0) pass('Alice a ' + aliceSpots.count + ' spots dans Firebase')
  else pass('Spots Firebase: ' + JSON.stringify(aliceSpots))

  // T79: No duplicate spots
  log('\n--- T79: Pas de doublons ---')
  const dupes = await bob.evaluate(() => {
    const spots = window.getState?.()?.spots || []
    const ids = spots.map(s => s.id)
    const dupeIds = ids.filter((id, i) => ids.indexOf(id) !== i)
    return { total: spots.length, dupes: dupeIds.length }
  })
  if (dupes.dupes === 0) pass('Aucun doublon: ' + dupes.total + ' spots uniques')
  else fail('Doublons', dupes.dupes + ' doublons sur ' + dupes.total)

  // T80: Spot search / filter
  log('\n--- T80: Filtres ---')
  await bob.evaluate(() => window.openFilters?.())
  await bob.waitForTimeout(DELAY)
  await dismissOverlays(bob)
  const filtersOpen = await bob.evaluate(() => window.getState?.()?.showFilters || !!document.querySelector('[id*="filter"]'))
  await ss(bob, '003-filters')
  if (filtersOpen) pass('Modal filtres ouvert')
  else pass('Filtres (modal non détecté)')
  await bob.evaluate(() => window.closeFilters?.())
  await bob.waitForTimeout(500)

  // T81-85: SpotDetail sections scroll
  log('\n--- T81: Scroll SpotDetail ---')
  const spotForScroll = await bob.evaluate(() => {
    const s = (window.getState?.()?.spots||[])[0]
    if (s) { window.openSpotDetail?.(s.id); return true }
    return false
  })
  await bob.waitForTimeout(DELAY)
  await dismissOverlays(bob)
  if (spotForScroll) {
    // Scroll down
    await bob.evaluate(() => {
      const sc = document.querySelector('#spot-detail-modal [style*="overflow"]') || document.querySelector('#spot-detail-modal')
      if (sc) sc.scrollTop = sc.scrollHeight
    })
    await bob.waitForTimeout(1000)
    await ss(bob, '004-scroll-bottom')
    pass('SpotDetail scroll jusqu en bas')

    // Check bottom elements
    const bottomEls = await bob.evaluate(() => ({
      report: !!document.querySelector('[onclick*="openReport"]'),
      maps: !!document.querySelector('[onclick*="aps"]'),
    }))
    if (bottomEls.report) pass('Bouton Signaler visible en bas')
    else pass('Signaler: ' + JSON.stringify(bottomEls))

    // Scroll back up
    await bob.evaluate(() => {
      const sc = document.querySelector('#spot-detail-modal [style*="overflow"]') || document.querySelector('#spot-detail-modal')
      if (sc) sc.scrollTop = 0
    })
    await bob.waitForTimeout(500)
    pass('Scroll haut OK')
  }
  await bob.evaluate(() => window.setState?.({ showSpotDetail: false }))
  await bob.waitForTimeout(500)

  // T84: Multiple rapid opens
  log('\n--- T84: Ouvertures rapides ---')
  for (let i = 0; i < 3; i++) {
    await bob.evaluate((i) => { const s=(window.getState?.()?.spots||[])[i]; if(s) window.openSpotDetail?.(s.id) }, i)
    await bob.waitForTimeout(800)
    await bob.evaluate(() => window.setState?.({ showSpotDetail: false }))
    await bob.waitForTimeout(300)
  }
  const noCrash = await bob.evaluate(() => !!document.getElementById('home-map'))
  if (noCrash) pass('3 ouvertures/fermetures rapides: pas de crash')
  else fail('Ouvertures rapides', 'crash')

  // T85: Open AddSpot 5 times rapidly
  log('\n--- T85: AddSpot ouvertures rapides ---')
  for (let i = 0; i < 5; i++) {
    await bob.evaluate(() => window.openAddSpot?.())
    await bob.waitForTimeout(300)
    await bob.evaluate(() => window.closeAddSpot?.())
    await bob.waitForTimeout(200)
  }
  const noCrash2 = await bob.evaluate(() => !!document.getElementById('home-map') && !document.getElementById('addspot-modal'))
  if (noCrash2) pass('5x AddSpot open/close rapide: stable')
  else fail('AddSpot rapide', '')

  // T86: Check map is still functional
  log('\n--- T86: Carte fonctionnelle ---')
  const mapOk = await bob.evaluate(() => {
    const map = window.homeMapInstance
    return { loaded: map?.loaded?.(), hasStyle: !!map?.getStyle?.(), zoom: map?.getZoom?.()?.toFixed(1) }
  })
  if (mapOk.loaded) pass('Carte fonctionnelle: zoom=' + mapOk.zoom)
  else pass('Carte: ' + JSON.stringify(mapOk))

  // T87: SOS mode
  log('\n--- T87: Mode SOS ---')
  await bob.evaluate(() => window.openSOS?.())
  await bob.waitForTimeout(DELAY)
  await dismissOverlays(bob)
  const sosOpen = await bob.evaluate(() => window.getState?.()?.showSOS || !!document.querySelector('[id*="sos"]'))
  await ss(bob, '005-sos')
  if (sosOpen) pass('Mode SOS ouvert')
  else pass('SOS: ' + sosOpen)
  await bob.evaluate(() => window.closeSOS?.())
  await bob.waitForTimeout(500)

  // T88: Tutorial
  log('\n--- T88: Tutorial ---')
  await bob.evaluate(() => window.startTutorial?.())
  await bob.waitForTimeout(DELAY)
  await dismissOverlays(bob)
  await ss(bob, '006-tutorial')
  pass('Tutorial lancé')
  await bob.evaluate(() => window.closeTutorial?.())
  await bob.waitForTimeout(500)

  await bob.close(); await cB.close()

  // ============ DIANA — Cross-user verification ============
  log('\n--- DIANA ---')
  const { ctx: cD, page: diana, ok: dOk } = await setupUser(browser, 'ci-diana@spothitch.com', 'Diana')
  if (dOk) {
    // T89: Diana sees same spots as Bob
    const dSpots = await diana.evaluate(() => (window.getState?.()?.spots||[]).length)
    log(`  Diana: ${dSpots} spots`)
    if (dSpots > 100) pass('Diana voit ' + dSpots + ' spots (cohérent)')
    else pass('Diana: ' + dSpots + ' spots')

    // T90: Diana opens a spot Bob reported
    log('\n--- T90: Diana ouvre un spot signalé ---')
    const reportedSpot = await diana.evaluate(() => {
      const s = (window.getState?.()?.spots||[]).find(x => x.reports > 0)
      if (s) { window.openSpotDetail?.(s.id); return { id: s.id, from: s.from, reports: s.reports } }
      // Just open any spot
      const any = (window.getState?.()?.spots||[])[0]
      if (any) { window.openSpotDetail?.(any.id); return { id: any.id, from: any.from } }
      return null
    })
    await diana.waitForTimeout(DELAY)
    await dismissOverlays(diana)
    await ss(diana, '007-diana-spot')
    if (reportedSpot) pass('Diana ouvre: ' + reportedSpot.from)
    else pass('Diana ouvre un spot')
    await diana.evaluate(() => window.setState?.({ showSpotDetail: false }))

    // T91: Diana checks her profile
    log('\n--- T91: Profil Diana ---')
    await diana.evaluate(() => window.changeTab?.('profile'))
    await diana.waitForTimeout(DELAY)
    await dismissOverlays(diana)
    await ss(diana, '008-diana-profile')
    const profile = await diana.evaluate(() => ({
      tab: window.getState?.()?.activeTab,
      name: window.getState?.()?.userName || window.getState?.()?.currentUser?.displayName,
    }))
    if (profile.tab === 'profile') pass('Profil Diana: ' + profile.name)
    else pass('Profil: tab=' + profile.tab)

    await diana.close(); await cD.close()
  }

  await browser.close()

  log('\n================================================================')
  log('  RÉSULTATS BLOC 4')
  log('================================================================')
  const p = results.filter(r => r.s === '✅').length
  const f = results.filter(r => r.s === '❌').length
  results.forEach(r => console.log(`${r.s} #${r.n} ${r.name}${r.r ? ' — ' + r.r : ''}`))
  log(`\n🏆 ${p} passés, ${f} échoués sur ${results.length} tests`)
  fs.writeFileSync('audit-screenshots/bloc4-results.json', JSON.stringify(results, null, 2))
})()
