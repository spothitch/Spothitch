/**
 * Audit visuel COMPLET — chaque écran, chaque fonctionnalité
 * Produit des screenshots + un rapport d'anomalies
 */
import { chromium } from 'playwright'
import { mkdirSync, writeFileSync } from 'fs'

const OUT = '/home/antoine/Spothitch/audit-screenshots/complet'
mkdirSync(OUT, { recursive: true })

const BASE_URL = 'http://localhost:5000'
const MOBILE = { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }

const EXISTING_USER = {
  spothitch_landing_v2: '1',
  spothitch_beta_seen: '1',
  spothitch_v4_cookie_consent: JSON.stringify({ preferences: { necessary: true }, timestamp: Date.now(), version: '1.0' }),
  spothitch_welcomed: '1',
  spothitch_username: 'TestUser42',
  spothitch_lang: 'fr',
  spothitch_points: '850',
  spothitch_level: '3',
  spothitch_v4_contextual_tips_seen: JSON.stringify(['first_checkin','first_spot_created','first_friend_added','first_message','first_badge','first_favorite','first_trip','sos_feature']),
}

const browser = await chromium.launch({ headless: true })
const issues = []
let screenshotCount = 0

async function shot(page, name, label) {
  await page.waitForTimeout(800)
  const path = `${OUT}/${name}.png`
  await page.screenshot({ path, fullPage: false })
  screenshotCount++

  // Check for obvious issues
  const html = await page.content()
  const consoleErrors = []

  // Check visible text
  const bodyText = await page.evaluate(() => document.body?.innerText?.slice(0, 200) || '')
  const hasContent = bodyText.trim().length > 20

  if (!hasContent) {
    issues.push({ screen: name, issue: 'Écran vide (pas de texte visible)', severity: 'HIGH' })
  }

  // Check for common error indicators
  if (html.includes('undefined') && html.includes('null')) {
    issues.push({ screen: name, issue: 'Possible "undefined" ou "null" affiché', severity: 'MEDIUM' })
  }

  console.log(`  ✓ ${name} — ${label}`)
  return path
}

async function setState(page, state) {
  await page.evaluate(s => window.setState?.(s), state)
  await page.waitForTimeout(600)
}

async function open(page, handler, args = '') {
  await page.evaluate(([h, a]) => {
    if (a) window[h]?.(a)
    else window[h]?.()
    // Force re-render so lazy-loaded modals appear (lazyRender returns '' on first call)
    window._forceRender?.()
  }, [handler, args])
  await page.waitForTimeout(1800) // 1.8s: lazy module load + re-render
}

async function forceState(page, state) {
  await page.evaluate(s => {
    window.setState?.(s)
    window._forceRender?.()
  }, state)
  await page.waitForTimeout(1800)
}

async function close(page, handler) {
  await page.evaluate(h => window[h]?.(), handler)
  await page.waitForTimeout(400)
}

// ═══════════════════════════════════════════════════════
// SETUP
// ═══════════════════════════════════════════════════════
const ctx = await browser.newContext({ viewport: MOBILE })
await ctx.addInitScript(state => {
  for (const [k, v] of Object.entries(state)) {
    try { localStorage.setItem(k, v) } catch {}
  }
}, EXISTING_USER)
const page = await ctx.newPage()

// Capture console errors
const consoleErrs = []
page.on('console', msg => { if (msg.type() === 'error') consoleErrs.push(msg.text()) })

await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 })
await page.waitForTimeout(3000)

// ═══════════════════════════════════════════════════════
// A — LANDING (nouvel utilisateur)
// ═══════════════════════════════════════════════════════
console.log('\n=== A. LANDING (nouvel visiteur) ===')
const ctxNew = await browser.newContext({ viewport: MOBILE })
const pageNew = await ctxNew.newPage()
await pageNew.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 })
await pageNew.waitForTimeout(2000)
await shot(pageNew, 'A01-landing-ecran1', 'Landing slide 1')
const next = pageNew.locator('button:has-text("Suivant"), button:has-text("Next"), [onclick*="nextStep"]').first()
if (await next.count()) { await next.click(); await pageNew.waitForTimeout(800) }
await shot(pageNew, 'A02-landing-ecran2', 'Landing slide 2')
if (await next.count()) { await next.click(); await pageNew.waitForTimeout(800) }
await shot(pageNew, 'A03-landing-ecran3', 'Landing slide 3')
await ctxNew.close()

// ═══════════════════════════════════════════════════════
// B — CARTE (tab principal)
// ═══════════════════════════════════════════════════════
console.log('\n=== B. CARTE ===')
await setState(page, { activeTab: 'map' })
await shot(page, 'B01-carte-principale', 'Carte principale')

// Spot detail (simulé)
await setState(page, { showSpotDetail: true, selectedSpot: {
  id: 'test-spot-1', name: 'Sortie Autoroute A6', type: 'highway_exit',
  lat: 48.85, lng: 2.35, rating: 4.2, totalVotes: 23, checkins: 8,
  safetyRating: 5, trafficRating: 4, accessibilityRating: 4,
  description: 'Bon spot avec beaucoup de camions. Lumière la nuit.',
  direction: 'Paris', country: 'fr', city: 'Paris',
  createdAt: new Date(Date.now() - 7*24*3600*1000).toISOString()
}})
await shot(page, 'B02-spot-detail', 'Spot detail ouvert')

// Rating dans spot detail
await setState(page, { showRating: true, ratingSpotId: 'test-spot-1' })
await shot(page, 'B03-spot-rating', 'Rating modal')
await setState(page, { showRating: false })

// Navigation picker
await open(page, 'openNavigation', { lat: 48.85, lng: 2.35 })
await shot(page, 'B04-navigation-picker', 'Navigation picker')
await close(page, 'closeNavigation')

// Report modal
await open(page, 'openReport', 'test-spot-1')
await shot(page, 'B05-report-modal', 'Report modal')
await close(page, 'closeReport')

await setState(page, { showSpotDetail: false, selectedSpot: null })

// ═══════════════════════════════════════════════════════
// C — ADD SPOT WIZARD
// ═══════════════════════════════════════════════════════
console.log('\n=== C. ADD SPOT WIZARD ===')
await setState(page, { showAddSpot: true, addSpotStep: 1 })
await shot(page, 'C01-addspot-step1-localisation', 'AddSpot étape 1 — Localisation')
await setState(page, { addSpotStep: 2 })
await shot(page, 'C02-addspot-step2-type', 'AddSpot étape 2 — Type')
await setState(page, { addSpotStep: 3 })
await shot(page, 'C03-addspot-step3-details', 'AddSpot étape 3 — Détails')
await setState(page, { addSpotStep: 4 })
await shot(page, 'C04-addspot-step4-ratings', 'AddSpot étape 4 — Notes')
await setState(page, { addSpotStep: 5 })
await shot(page, 'C05-addspot-step5-preview', 'AddSpot étape 5 — Aperçu')
await setState(page, { showAddSpot: false, addSpotStep: 1 })

// ═══════════════════════════════════════════════════════
// D — AUTHENTIFICATION
// ═══════════════════════════════════════════════════════
console.log('\n=== D. AUTH ===')
await setState(page, { showAuth: true, authMode: 'login' })
await shot(page, 'D01-auth-connexion', 'Auth — Connexion')
await setState(page, { authMode: 'register' })
await shot(page, 'D02-auth-inscription', 'Auth — Inscription')
await setState(page, { authMode: 'forgot' })
await shot(page, 'D03-auth-forgot', 'Auth — Mot de passe oublié')
await setState(page, { showAuth: false })

// ═══════════════════════════════════════════════════════
// E — SPOTS LIST
// ═══════════════════════════════════════════════════════
console.log('\n=== E. SPOTS ===')
await setState(page, { activeTab: 'spots' })
await shot(page, 'E01-spots-liste', 'Spots — Liste')

// ═══════════════════════════════════════════════════════
// F — SOCIAL
// ═══════════════════════════════════════════════════════
console.log('\n=== F. SOCIAL ===')
await setState(page, { activeTab: 'social', socialSubTab: 'feed' })
await shot(page, 'F01-social-feed', 'Social — Feed')
await setState(page, { socialSubTab: 'radar' })
await shot(page, 'F02-social-radar', 'Social — Radar')
await setState(page, { socialSubTab: 'voyageurs' })
await shot(page, 'F03-social-voyageurs', 'Social — Voyageurs/Buddies')
await setState(page, { socialSubTab: 'events' })
await shot(page, 'F04-social-events', 'Social — Events')
await setState(page, { socialSubTab: 'groups' })
await shot(page, 'F05-social-groups', 'Social — Groups')

// DM / Conversations
await page.evaluate(() => window.openConversation?.('user-demo-1') || window.setState?.({ showDM: true, dmUserId: 'user-demo-1' }))
await shot(page, 'F06-dm-conversation', 'DM — Conversation')
await page.evaluate(() => window.closeConversation?.() || window.setState?.({ showDM: false }))

// ═══════════════════════════════════════════════════════
// G — VOYAGE
// ═══════════════════════════════════════════════════════
console.log('\n=== G. VOYAGE ===')
await setState(page, { activeTab: 'voyage', voyageSubTab: 'voyage' })
await shot(page, 'G01-voyage-planner', 'Voyage — Trip planner')
await setState(page, { voyageSubTab: 'journal' })
await shot(page, 'G02-voyage-journal', 'Voyage — Journal')
await setState(page, { voyageSubTab: 'guides' })
await shot(page, 'G03-voyage-guides', 'Voyage — Guides')

// Checkin modal
await open(page, 'openCheckin')
await shot(page, 'G04-checkin-modal', 'Checkin modal')
await close(page, 'closeCheckin')

// ═══════════════════════════════════════════════════════
// H — PROFILE
// ═══════════════════════════════════════════════════════
console.log('\n=== H. PROFILE ===')
await setState(page, { activeTab: 'profile', profileSubTab: 'profil' })
await shot(page, 'H01-profile-profil', 'Profile — Profil')
await setState(page, { profileSubTab: 'progression' })
await shot(page, 'H02-profile-progression', 'Profile — Progression/Roadmap')
await setState(page, { profileSubTab: 'reglages' })
await shot(page, 'H03-profile-reglages', 'Profile — Réglages')

// Edit profile
await open(page, 'openProfileCustomization')
await shot(page, 'H04-profile-edit', 'Profile — Édition profil')
await close(page, 'closeProfileCustomization')

// Badges
await open(page, 'openBadges')
await shot(page, 'H05-badges-modal', 'Gamification — Badges')
await close(page, 'closeBadges')

// Shop
await open(page, 'openShop')
await shot(page, 'H06-shop-modal', 'Gamification — Shop')
await close(page, 'closeShop')

// Leaderboard
await open(page, 'openLeaderboard')
await shot(page, 'H07-leaderboard-modal', 'Gamification — Leaderboard')
await close(page, 'closeLeaderboard')

// Quiz
await open(page, 'openQuiz')
await shot(page, 'H08-quiz-modal', 'Gamification — Quiz')
await close(page, 'closeQuiz')

// Titles
await open(page, 'openTitles')
await shot(page, 'H09-titles-modal', 'Gamification — Titles')
await close(page, 'closeTitles')

// MyData
await open(page, 'openMyData')
await shot(page, 'H10-mydata-modal', 'My Data modal')
await close(page, 'closeMyData')

// Language picker
await open(page, 'openLanguagePicker')
await shot(page, 'H11-language-picker', 'Language picker')
await page.keyboard.press('Escape')
await page.evaluate(() => window.closeLanguagePicker?.())

// ═══════════════════════════════════════════════════════
// I — SOS
// ═══════════════════════════════════════════════════════
console.log('\n=== I. SOS ===')
await setState(page, { activeTab: 'map' })
await open(page, 'openSOS')
await shot(page, 'I01-sos-intro', 'SOS — Écran intro')
await page.evaluate(() => window.acceptSOSIntro?.() || window.setState?.({ sosScreen: 'main' }))
await page.waitForTimeout(800)
await shot(page, 'I02-sos-principal', 'SOS — Principal')
await page.evaluate(() => window.sosTab?.('config') || window.setState?.({ sosActiveTab: 'config' }))
await shot(page, 'I03-sos-config', 'SOS — Config')
await page.evaluate(() => window.sosTab?.('contacts') || window.setState?.({ sosActiveTab: 'contacts' }))
await shot(page, 'I04-sos-contacts', 'SOS — Contacts')
await close(page, 'closeSOS')

// ═══════════════════════════════════════════════════════
// J — GUARDIAN
// ═══════════════════════════════════════════════════════
console.log('\n=== J. GUARDIAN ===')
await open(page, 'openGuardian')
await shot(page, 'J01-guardian-intro', 'Guardian — Intro')
await page.evaluate(() => {
  window.acceptGuardianConsent?.()
  window.guardianGoToScreen?.('main')
})
await page.waitForTimeout(800)
await shot(page, 'J02-guardian-main', 'Guardian — Config principale')
// Active trip
await page.evaluate(() => {
  try {
    const g = JSON.parse(localStorage.getItem('spothitch_guardian') || '{}')
    g.active = true
    g.tripStart = Date.now() - 30 * 60 * 1000
    g.destination = 'Lyon'
    g.guardians = [{ name: 'Maman', phone: '+33612345678', color: '#22c55e' }]
    localStorage.setItem('spothitch_guardian', JSON.stringify(g))
  } catch {}
  window.guardianGoToScreen?.('active')
  window._forceRender?.()
})
await shot(page, 'J03-guardian-actif', 'Guardian — Voyage en cours')
await page.evaluate(() => window.guardianGoToScreen?.('overdue'))
await shot(page, 'J04-guardian-overdue', 'Guardian — En retard')
await page.evaluate(() => window.guardianGoToScreen?.('arrival'))
await shot(page, 'J05-guardian-arrivee', 'Guardian — Arrivée')
await close(page, 'closeGuardian')

// ═══════════════════════════════════════════════════════
// K — MODALS DIVERSES
// ═══════════════════════════════════════════════════════
console.log('\n=== K. AUTRES MODALS ===')

// Contact form
await open(page, 'openContactForm')
await shot(page, 'K01-contact-form', 'Contact form')
await close(page, 'closeContactForm')

// FAQ
await page.evaluate(() => window.openFAQ?.() || window.setState?.({ showFAQ: true }))
await shot(page, 'K02-faq', 'FAQ')
await page.evaluate(() => window.closeFAQ?.() || window.setState?.({ showFAQ: false }))

// Legal
await page.evaluate(() => window.openLegal?.() || window.setState?.({ showLegal: true }))
await shot(page, 'K03-legal', 'Legal')
await page.evaluate(() => window.closeLegal?.() || window.setState?.({ showLegal: false }))

// Feature slides
await open(page, 'openFeatureSlides')
await shot(page, 'K04-feature-slides', 'Feature slides')
await close(page, 'closeFeatureSlides')

// Delete account
await open(page, 'openDeleteAccount')
await shot(page, 'K05-delete-account', 'Delete account modal')
await close(page, 'closeDeleteAccount')

// Blocked users
await page.evaluate(() => window.openBlockedUsers?.() || window.setState?.({ showBlockedUsers: true }))
await shot(page, 'K06-blocked-users', 'Blocked users')
await page.evaluate(() => window.closeBlockedUsers?.() || window.setState?.({ showBlockedUsers: false }))

// Admin panel
await page.evaluate(() => window.openAdminPanel?.() || window.setState?.({ showAdmin: true, isAdmin: true }))
await shot(page, 'K07-admin-panel', 'Admin panel')
await page.evaluate(() => window.closeAdminPanel?.() || window.setState?.({ showAdmin: false }))

// ═══════════════════════════════════════════════════════
// L — ÉTATS SPÉCIAUX
// ═══════════════════════════════════════════════════════
console.log('\n=== L. ÉTATS SPÉCIAUX ===')

// Hors ligne
await page.evaluate(() => window.dispatchEvent(new Event('offline')))
await page.waitForTimeout(500)
await shot(page, 'L01-hors-ligne', 'Bandeau hors-ligne')
await page.evaluate(() => window.dispatchEvent(new Event('online')))
await page.waitForTimeout(500)

// Theme clair
await page.evaluate(() => window.toggleTheme?.())
await shot(page, 'L02-theme-clair-carte', 'Theme clair — Carte')
await setState(page, { activeTab: 'profile', profileSubTab: 'profil' })
await shot(page, 'L03-theme-clair-profile', 'Theme clair — Profile')
// Retour theme sombre
await page.evaluate(() => window.toggleTheme?.())
await setState(page, { activeTab: 'map' })

// ═══════════════════════════════════════════════════════
// N — MODALS MANQUANTES (audit complémentaire)
// ═══════════════════════════════════════════════════════
console.log('\n=== N. MODALS MANQUANTES ===')

// Cookie consent banner (nouvel utilisateur sans consentement)
await setState(page, { showCookieBanner: true })
await shot(page, 'N01-cookie-banner', 'Cookie consent banner')
await setState(page, { showCookieBanner: false })

// Welcome modal (onboarding post-landing)
await setState(page, { showWelcome: true })
await shot(page, 'N02-welcome-modal', 'Welcome modal — Onboarding')
await setState(page, { showWelcome: false })

// Complete profile modal
await setState(page, { showCompleteProfile: true })
await shot(page, 'N03-complete-profile', 'Complete Profile modal')
await setState(page, { showCompleteProfile: false })

// Location permission modal
await setState(page, { showLocationPermission: true })
await shot(page, 'N04-location-permission', 'Location permission modal')
await setState(page, { showLocationPermission: false })

// Filters modal (ouvert explicitement)
await setState(page, { activeTab: 'map' })
await open(page, 'openFilters')
await shot(page, 'N05-filters-modal', 'Filters modal')
await close(page, 'closeFilters')

// Feedback panel
await open(page, 'openFeedbackPanel')
await shot(page, 'N06-feedback-panel', 'Feedback panel')
await close(page, 'closeFeedbackPanel')

// Feature intro modal (glassmorphism)
await page.evaluate(() => window.showFeatureIntro?.('radar') || window.setState?.({ showFeatureIntro: true, featureIntroId: 'radar' }))
await page.waitForTimeout(800)
await shot(page, 'N07-feature-intro', 'Feature intro modal')
await page.evaluate(() => window.closeFeatureIntro?.() || window.setState?.({ showFeatureIntro: false }))

// Daily reward modal
await open(page, 'openDailyReward')
await shot(page, 'N08-daily-reward', 'Daily reward modal')
await page.evaluate(() => window.closeDailyReward?.() || window.setState?.({ showDailyReward: false }))

// Donation modal
await open(page, 'openDonation')
await shot(page, 'N09-donation-modal', 'Donation modal')
await close(page, 'closeDonation')

// Nearby friends panel (complet)
await setState(page, { showNearbyFriends: true })
await shot(page, 'N10-nearby-friends', 'Nearby Friends panel')
await setState(page, { showNearbyFriends: false })

// Profile customization (avatars/frames)
await open(page, 'openProfileCustomization')
await shot(page, 'N11-profile-customization', 'Profile Customization modal')
await close(page, 'closeProfileCustomization')

// Team challenges modal
await open(page, 'openTeamChallenges')
await shot(page, 'N12-team-challenges', 'Team Challenges modal')
await close(page, 'closeTeamChallenges')

// Age verification modal
await setState(page, { showAgeVerification: true })
await shot(page, 'N13-age-verification', 'Age Verification modal')
await setState(page, { showAgeVerification: false })

// Identity verification modal
await setState(page, { showIdentityVerification: true })
await shot(page, 'N14-identity-verification', 'Identity Verification modal')
await setState(page, { showIdentityVerification: false })

// ═══════════════════════════════════════════════════════
// O — VUES DÉTAILLÉES MANQUANTES
// ═══════════════════════════════════════════════════════
console.log('\n=== O. VUES DÉTAILLÉES ===')

// Guide pays — détail France
await setState(page, { activeTab: 'voyage', voyageSubTab: 'guides', selectedCountryCode: 'fr' })
await shot(page, 'O01-guide-france-detail', 'Guide France — Détail')
await setState(page, { selectedCountryCode: null })

// Journal trip detail (un voyage ouvert)
await setState(page, { activeTab: 'voyage', voyageSubTab: 'journal', journalSubTab: 'mes-voyages' })
await page.evaluate(() => {
  try {
    const trips = [{
      id: 'trip-demo', name: 'Road trip Europe', startDate: '2026-05-01', endDate: '2026-05-15',
      countries: ['fr','de','es'], totalKm: 2400, legs: [
        { from: 'Paris', to: 'Lyon', transport: 'hitchhiking', date: '2026-05-01' }
      ]
    }]
    localStorage.setItem('spothitch_journal_trips', JSON.stringify(trips))
  } catch {}
  window._forceRender?.()
})
await shot(page, 'O02-journal-liste', 'Journal — Liste voyages')

// Event detail modal
await setState(page, { activeTab: 'social', socialSubTab: 'events' })
await page.evaluate(() => {
  window.openEventDetail?.('demo-event-1') || window.setState?.({ showEventDetail: true, selectedEventId: 'demo-event-1', selectedEvent: {
    id: 'demo-event-1', title: 'Meetup Autostoppeurs Paris', date: '2026-07-14',
    location: 'Paris, France', attendees: 12, description: 'Rencontre communautaire'
  }})
})
await shot(page, 'O03-event-detail', 'Event detail modal')
await page.evaluate(() => window.closeEventDetail?.() || window.setState?.({ showEventDetail: false }))

// Friend profile modal
await setState(page, { showFriendProfile: true, selectedFriendProfileId: 'friend-demo' })
await shot(page, 'O04-friend-profile', 'Friend Profile modal')
await setState(page, { showFriendProfile: false })

// City panel
await page.evaluate(() => window.openCityPanel?.('Paris') || window.setState?.({ selectedCity: { name: 'Paris', country: 'FR', lat: 48.85, lng: 2.35 }, showCityPanel: true }))
await shot(page, 'O05-city-panel', 'City panel')
await page.evaluate(() => window.closeCityPanel?.() || window.setState?.({ selectedCity: null, showCityPanel: false }))

// Report modal — spot mal placé (avec mini-carte)
await setState(page, { activeTab: 'map' })
await page.evaluate(() => window.openReport?.('spot', 'test-spot-1') || window.setState?.({ showReport: true, reportType: 'spot', reportTargetId: 'test-spot-1' }))
await page.waitForTimeout(600)
await page.evaluate(() => window.selectReportReason?.('misplaced') || window.setState?.({ selectedReportReason: 'misplaced' }))
await shot(page, 'O06-report-misplaced', 'Report — Spot mal placé')
await page.evaluate(() => window.closeReport?.() || window.setState?.({ showReport: false }))

// Trip map (layout map-first avec résultats)
await setState(page, { activeTab: 'voyage', voyageSubTab: 'voyage',
  tripResults: { distance: '450 km', duration: '6h30', steps: [
    { from: 'Paris', to: 'Lyon', spots: 3 },
    { from: 'Lyon', to: 'Marseille', spots: 5 }
  ]}, tripFormCollapsed: true })
await shot(page, 'O07-trip-map-first', 'Trip — Layout map-first')
await setState(page, { tripResults: null, tripFormCollapsed: false })

// Offline panel (complet, pas juste le bandeau)
await page.evaluate(() => window.openOfflinePanel?.() || window.setState?.({ showOfflinePanel: true }))
await shot(page, 'O08-offline-panel', 'Offline panel complet')
await page.evaluate(() => window.closeOfflinePanel?.() || window.setState?.({ showOfflinePanel: false }))

// Share card / QR code
await page.evaluate(() => window.openShareCard?.() || window.setState?.({ showShareCard: true }))
await shot(page, 'O09-share-card', 'Share card / QR code')
await page.evaluate(() => window.setState?.({ showShareCard: false }))

// SOS fake call overlay
await setState(page, { activeTab: 'map' })
await open(page, 'openSOS')
await page.evaluate(() => {
  window.sosOpenFakeCall?.()
  window._forceRender?.()
})
await page.waitForTimeout(1500)
await shot(page, 'O10-sos-fake-call', 'SOS — Fake call overlay')
// sosFakeCallDecline removes #sos-fake-call from body (direct DOM injection, not state)
// Must be called BEFORE closeSOS, otherwise the z-200 dark overlay persists for all subsequent screenshots
await page.evaluate(() => {
  window.sosFakeCallDecline?.()
  document.getElementById('sos-fake-call')?.remove() // safety net
  window.closeSOS?.()
  window.setState?.({ showSOS: false })
})
await page.waitForTimeout(1200)

// SpotDetail complet (galerie photos + destinations)
await forceState(page, { selectedSpot: {
  id: 'test-spot-2', name: 'Aire de Beaune', type: 'highway_exit',
  lat: 47.02, lng: 4.83, rating: 4.5, totalVotes: 47, checkins: 19,
  safetyRating: 5, trafficRating: 5, accessibilityRating: 4,
  description: 'Excellent spot avec toilettes et restaurant.',
  direction: 'Marseille', country: 'fr', city: 'Beaune',
  photos: ['photo1.jpg', 'photo2.jpg'],
  destinations: [{ city: 'Lyon', distance: 120 }, { city: 'Marseille', distance: 310 }],
  createdAt: new Date(Date.now() - 30*24*3600*1000).toISOString()
}})
await shot(page, 'O11-spot-detail-complet', 'SpotDetail — Complet avec photos/destinations')
await forceState(page, { selectedSpot: null })

// Clean up any lingering DOM overlays + state before gamification modals
await page.evaluate(() => {
  document.getElementById('contextual-tip')?.remove()
  document.getElementById('feature-intro-overlay')?.remove()
  document.getElementById('feature-slides-overlay')?.remove()
  window.setState?.({ showLanding: false, showFeedbackPanel: false, showFeatureIntro: false, activeTab: 'map' })
  window._forceRender?.()
})
await page.waitForTimeout(800)

// Stats modal (lazy-loaded — forceState nécessaire)
await forceState(page, { showStats: true })
await shot(page, 'O12-stats-modal', 'Stats modal')
await forceState(page, { showStats: false })

// Challenges modal
await forceState(page, { showChallenges: true })
await shot(page, 'O13-challenges-modal', 'Challenges modal')
await forceState(page, { showChallenges: false })

// AddSpot draft banner (tab content — nécessite tab spots)
await setState(page, { activeTab: 'spots' })
await page.evaluate(() => {
  try {
    const drafts = [{ id: 'draft-1', name: 'Mon brouillon', step: 2, savedAt: Date.now() }]
    localStorage.setItem('spothitch_spot_drafts', JSON.stringify(drafts))
  } catch {}
  window.setState?.({ spotDraftsBannerVisible: true })
  window._forceRender?.()
})
await page.waitForTimeout(1000)
await shot(page, 'O14-draft-banner', 'AddSpot — Bannière brouillon')
await setState(page, { spotDraftsBannerVisible: false })

// Profile stats detail — mes spots (tab content)
await setState(page, { activeTab: 'profile', profileSubTab: 'profil', profileDetailView: 'spots' })
await page.waitForTimeout(1000)
await shot(page, 'O15-profile-mes-spots', 'Profile — Mes spots détail')
await setState(page, { profileDetailView: null })

// Social — messagerie (liste conversations)
await setState(page, { activeTab: 'social', socialSubTab: 'messagerie' })
await page.waitForTimeout(800)
await shot(page, 'O16-social-messagerie', 'Social — Messagerie / Conversations')

// Group conversation detail
await page.evaluate(() => {
  window.setState?.({ socialSubTab: 'groups', activeGroupConversationId: 'group-demo' })
  window.openGroupConversation?.('group-demo')
  window._forceRender?.()
})
await page.waitForTimeout(1500)
await shot(page, 'O17-group-conversation', 'Group Conversation — Détail')
await page.evaluate(() => window.closeGroupConversation?.() || window.setState?.({ showGroupConversation: false }))

// ═══════════════════════════════════════════════════════
// M — DESKTOP
// ═══════════════════════════════════════════════════════
console.log('\n=== M. DESKTOP ===')
await ctx.close()
const ctxDesk = await browser.newContext({ viewport: { width: 1280, height: 800 } })
await ctxDesk.addInitScript(state => {
  for (const [k, v] of Object.entries(state)) {
    try { localStorage.setItem(k, v) } catch {}
  }
}, EXISTING_USER)
const pageDesk = await ctxDesk.newPage()
pageDesk.on('console', msg => { if (msg.type() === 'error') consoleErrs.push(msg.text()) })
await pageDesk.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 })
await pageDesk.waitForTimeout(3000)
await pageDesk.screenshot({ path: `${OUT}/M01-desktop-carte.png` })
console.log('  ✓ M01-desktop-carte — Desktop carte')
screenshotCount++
await pageDesk.evaluate(s => window.setState?.(s), { activeTab: 'profile', profileSubTab: 'profil' })
await pageDesk.waitForTimeout(1000)
await pageDesk.screenshot({ path: `${OUT}/M02-desktop-profile.png` })
console.log('  ✓ M02-desktop-profile — Desktop profile')
screenshotCount++
await pageDesk.evaluate(s => window.setState?.(s), { activeTab: 'social', socialSubTab: 'feed' })
await pageDesk.waitForTimeout(1000)
await pageDesk.screenshot({ path: `${OUT}/M03-desktop-social.png` })
console.log('  ✓ M03-desktop-social — Desktop social')
screenshotCount++
await pageDesk.evaluate(s => window.setState?.(s), { activeTab: 'voyage', voyageSubTab: 'guides' })
await pageDesk.waitForTimeout(1000)
await pageDesk.screenshot({ path: `${OUT}/M04-desktop-guides.png` })
console.log('  ✓ M04-desktop-guides — Desktop guides')
screenshotCount++
await ctxDesk.close()

// ═══════════════════════════════════════════════════════
// RAPPORT
// ═══════════════════════════════════════════════════════
await browser.close()

const report = {
  date: new Date().toISOString(),
  totalScreenshots: screenshotCount,
  issues,
  consoleErrors: [...new Set(consoleErrs)].slice(0, 20),
}

writeFileSync(`${OUT}/RAPPORT.json`, JSON.stringify(report, null, 2))

console.log(`\n${'═'.repeat(60)}`)
console.log(`  AUDIT TERMINÉ — ${screenshotCount} screenshots`)
console.log(`  Issues: ${issues.length}`)
if (issues.length > 0) {
  console.log('\n  PROBLÈMES DÉTECTÉS:')
  issues.forEach(i => console.log(`  [${i.severity}] ${i.screen}: ${i.issue}`))
}
if (consoleErrs.length > 0) {
  console.log('\n  ERREURS CONSOLE:')
  ;[...new Set(consoleErrs)].slice(0, 10).forEach(e => console.log(`  • ${e.slice(0, 120)}`))
}
console.log(`\n  Screenshots: ${OUT}`)
console.log('═'.repeat(60))
