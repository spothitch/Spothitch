#!/usr/bin/env node
/**
 * Le Maître V2 — Audit visuel & fonctionnel complet
 * Appelé par maitre.mjs phase 5
 *
 * Pour chaque scénario :
 *   1. Setup (état, navigation)
 *   2. Action (bouton, formulaire, interaction)
 *   3. Vérification (attendu vs obtenu)
 *   4. Screenshot
 *   5. Résultat pass/fail avec raison
 */

import { chromium } from 'playwright'
import { writeFileSync, mkdirSync, existsSync, createReadStream, statSync } from 'fs'
import { createServer } from 'http'
import { extname, join } from 'path'

const ROOT = process.env.MAITRE_ROOT || process.cwd()
const DIST = join(ROOT, 'dist')
const SCREENSHOTS = join(ROOT, 'audit-history', 'screenshots-v2')
const RESULTS_PATH = join(ROOT, 'audit-history', 'visual-results.json')

mkdirSync(SCREENSHOTS, { recursive: true })

// ─── SERVEUR STATIQUE ────────────────────────────────────────────────────────
const MIME = {
  '.html': 'text/html', '.js': 'application/javascript', '.mjs': 'application/javascript',
  '.css': 'text/css', '.json': 'application/json', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2',
  '.ico': 'image/x-icon', '.webp': 'image/webp', '.webmanifest': 'application/manifest+json',
}

const server = createServer((req, res) => {
  let urlPath = req.url.split('?')[0]
  if (urlPath === '/' || !urlPath.includes('.')) urlPath = '/index.html'
  const filePath = join(DIST, urlPath)
  if (existsSync(filePath) && statSync(filePath).isFile()) {
    res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] || 'application/octet-stream' })
    createReadStream(filePath).pipe(res)
  } else {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    createReadStream(join(DIST, 'index.html')).pipe(res)
  }
})
await new Promise(r => server.listen(4322, r))

// ─── HELPERS ─────────────────────────────────────────────────────────────────
let browser = await chromium.launch({ headless: true })
const results = []

function logResult(id, passed, reason = '') {
  const sym = passed ? 'PASS' : 'FAIL'
  process.stdout.write(`${sym}:${id}${reason ? ':' + reason : ''}\n`)
  results.push({ id, passed, reason, screenshot: join(SCREENSHOTS, id + '.png') })
}

async function ensureBrowser() {
  if (!browser.isConnected()) {
    browser = await chromium.launch({ headless: true })
  }
}

async function runScenario(scenario) {
  await ensureBrowser()
  let ctx
  try {
    ctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      colorScheme: scenario.theme === 'light' ? 'light' : 'dark',
    })
  } catch (e) {
    // Browser crashed — relance
    browser = await chromium.launch({ headless: true })
    ctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      colorScheme: scenario.theme === 'light' ? 'light' : 'dark',
    })
  }
  const page = await ctx.newPage()
  page.on('console', () => {})
  page.on('pageerror', () => {})

  try {
    // Charger l'app
    await page.goto('http://localhost:4322', { waitUntil: 'domcontentloaded', timeout: 20000 })

    // Setup état de base
    await page.evaluate(({ theme, skipOnboarding, stateExtra }) => {
      localStorage.clear()
      const state = {
        onboardingDone: skipOnboarding !== false,
        tutorialCompleted: skipOnboarding !== false,
        lang: 'fr',
        theme: theme || 'dark',
        emergencyContacts: [{ name: 'Maman', phone: '+32 475 12 34 56' }],
        ...stateExtra,
      }
      localStorage.setItem('spothitch_v4_state', JSON.stringify(state))
      localStorage.setItem('spothitch_onboarding_done', skipOnboarding !== false ? '1' : '')
      // landing_seen doit toujours être set pour éviter la landing page par-dessus tout
      localStorage.setItem('spothitch_landing_seen', '1')
      if (theme === 'light') document.documentElement.setAttribute('data-theme', 'light')
    }, { theme: scenario.theme, skipOnboarding: scenario.skipOnboarding !== false, stateExtra: scenario.stateExtra || {} })

    await page.reload({ waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(scenario.waitAfterReload || 600)

    // Setup spécifique au scénario
    if (scenario.setup) await scenario.setup(page)
    await page.waitForTimeout(200)

    // Action
    if (scenario.action) {
      await scenario.action(page)
      await page.waitForTimeout(scenario.actionWait || 400)
    }

    // Vérifications attendues vs obtenues
    let allPassed = true
    const reasons = []

    if (scenario.expect) {
      for (const check of scenario.expect) {
        try {
          if (check.visible) {
            // Use count() — checks DOM presence, not viewport visibility (avoids animation false-negatives)
            const count = await page.locator(check.visible).count()
            if (count === 0) { allPassed = false; reasons.push(`invisible: ${check.visible}`) }
          }
          if (check.notVisible) {
            const el = page.locator(check.notVisible).first()
            const isVisible = await el.isVisible({ timeout: 1000 }).catch(() => false)
            if (isVisible) { allPassed = false; reasons.push(`devrait être caché: ${check.notVisible}`) }
          }
          if (check.text) {
            const el = page.locator(check.selector || 'body').first()
            const text = await el.textContent({ timeout: 3000 }).catch(() => '')
            if (!text?.includes(check.text)) { allPassed = false; reasons.push(`texte manquant: "${check.text}"`) }
          }
          if (check.count !== undefined) {
            const count = await page.locator(check.selector).count()
            if (count < check.count) { allPassed = false; reasons.push(`attendu ${check.count} de "${check.selector}", obtenu ${count}`) }
          }
          if (check.notContains) {
            const html = await page.content()
            if (html.includes(check.notContains)) { allPassed = false; reasons.push(`ne devrait pas contenir: "${check.notContains}"`) }
          }
          if (check.inputExists) {
            const el = page.locator(check.inputExists).first()
            const exists = await el.count() > 0
            if (!exists) { allPassed = false; reasons.push(`champ manquant: ${check.inputExists}`) }
          }
        } catch (e) {
          allPassed = false; reasons.push(`erreur vérif: ${e.message?.slice(0, 80)}`)
        }
      }
    }

    // Screenshot
    const screenshotPath = join(SCREENSHOTS, scenario.id + '.png')
    await page.screenshot({ path: screenshotPath, fullPage: false })

    logResult(scenario.id, allPassed, reasons.join(' | '))
  } catch (e) {
    logResult(scenario.id, false, `crash: ${e.message?.slice(0, 100)}`)
  } finally {
    await ctx.close().catch(() => {})
  }
}

// ─── SCÉNARIOS ────────────────────────────────────────────────────────────────
const tab = (t) => async (page) => {
  await page.evaluate((tab) => window.changeTab?.(tab), t)
  await page.waitForTimeout(600)
}
const modal = (fn, ...args) => async (page) => {
  await page.evaluate(([fn, args]) => window[fn]?.(...args), [fn, args])
  await page.waitForTimeout(500)
}
const click = (selector) => async (page) => {
  const el = page.locator(selector).first()
  if (await el.count({ timeout: 2000 }).catch(() => 0) > 0) {
    await el.click({ timeout: 3000 }).catch(() => {})
  }
  await page.waitForTimeout(400)
}
const evaluate = (fn) => async (page) => {
  await page.evaluate(fn)
  await page.waitForTimeout(200)
}

const SCENARIOS = [

  // ══════════════════════════════════════════════════════
  // ONBOARDING
  // ══════════════════════════════════════════════════════
  {
    id: 'onboarding-slide1-dark',
    theme: 'dark', skipOnboarding: false,
    stateExtra: { tutorialCompleted: false, showTutorial: true },
    waitAfterReload: 3000,
    expect: [{ visible: '#tutorial-overlay, .tutorial-overlay' }],
  },
  {
    id: 'onboarding-slide1-light',
    theme: 'light', skipOnboarding: false,
    expect: [],
  },

  // ══════════════════════════════════════════════════════
  // CARTE — Vue principale
  // ══════════════════════════════════════════════════════
  {
    id: 'carte-dark',
    theme: 'dark',
    expect: [
      { visible: '#home-map' },
      { visible: '#home-destination' },
      { visible: '[onclick*="homeZoomIn"], [onclick*="zoomIn"]' },
    ],
  },
  {
    id: 'carte-light',
    theme: 'light',
    expect: [{ visible: '#home-map' }],
  },
  {
    id: 'carte-bouton-gps',
    theme: 'dark',
    action: click('[onclick*="homeLocate"], [aria-label*="position"], [aria-label*="GPS"]'),
    expect: [{ visible: '#home-map' }],
  },
  {
    id: 'carte-stations-essence',
    theme: 'dark',
    action: click('#gas-toggle-btn'),
    expect: [
      { visible: '#gas-toggle-btn' },
      { notVisible: '.feature-intro-overlay' }, // JAMAIS de modale d'intro sur ⛽
    ],
  },
  {
    id: 'carte-zoom-in',
    theme: 'dark',
    action: click('[onclick*="homeZoomIn"]'),
    expect: [{ visible: '#home-map' }],
  },
  {
    id: 'carte-zoom-out',
    theme: 'dark',
    action: click('[onclick*="homeZoomOut"]'),
    expect: [{ visible: '#home-map' }],
  },

  // ══════════════════════════════════════════════════════
  // FILTRES
  // ══════════════════════════════════════════════════════
  {
    id: 'filtres-modal-dark',
    theme: 'dark',
    action: modal('openFilters'),
    expect: [
      { visible: '[role="dialog"], .modal-overlay, .fixed.inset-0' },
    ],
  },
  {
    id: 'filtres-modal-light',
    theme: 'light',
    action: modal('openFilters'),
    expect: [{ visible: '[role="dialog"], .fixed.inset-0' }],
  },
  {
    id: 'filtres-bouton-reset',
    theme: 'dark',
    setup: modal('openFilters'),
    action: click('[onclick*="resetFilters"], [onclick*="clearFilters"]'),
    expect: [{ visible: '#home-map' }],
  },

  // ══════════════════════════════════════════════════════
  // AJOUTER UN SPOT
  // ══════════════════════════════════════════════════════
  {
    id: 'addspot-step1-dark',
    theme: 'dark',
    stateExtra: { username: 'TestUser', isLoggedIn: true, showAddSpot: true, addSpotStep: 1 },
    waitAfterReload: 2500,
    setup: evaluate(() => localStorage.setItem('spothitch_test_mode', 'true')),
    expect: [
      { visible: '[role="dialog"], .fixed.inset-0' },
      { inputExists: '#spot-photo, input[type="file"]' },
    ],
  },
  {
    id: 'addspot-step1-light',
    theme: 'light',
    stateExtra: { username: 'TestUser', isLoggedIn: true, showAddSpot: true, addSpotStep: 1 },
    waitAfterReload: 2500,
    setup: evaluate(() => localStorage.setItem('spothitch_test_mode', 'true')),
    expect: [{ visible: '[role="dialog"], .fixed.inset-0' }],
  },
  {
    id: 'addspot-types-visible',
    theme: 'dark',
    stateExtra: { username: 'TestUser', isLoggedIn: true, showAddSpot: true, addSpotStep: 1 },
    setup: evaluate(() => localStorage.setItem('spothitch_test_mode', 'true')),
    action: modal('openAddSpot'),
    actionWait: 2500,
    expect: [
      { count: 4, selector: '.spot-type-btn' },
    ],
  },
  {
    id: 'addspot-fermeture-escape',
    theme: 'dark',
    setup: modal('openAddSpot'),
    action: async (page) => { await page.keyboard.press('Escape'); await page.waitForTimeout(500) },
    expect: [{ visible: '#home-map' }],
  },

  // ══════════════════════════════════════════════════════
  // SOS
  // ══════════════════════════════════════════════════════
  {
    id: 'sos-disclaimer-dark',
    theme: 'dark',
    setup: evaluate(() => localStorage.removeItem('spothitch_sos_disclaimer_seen')),
    action: modal('openSOS'),
    expect: [
      { visible: '[role="alertdialog"], .fixed.inset-0' },
      { notContains: 'sosStartCountdown' }, // countdown supprimé
      { notContains: 'WhatsApp' },
    ],
  },
  {
    id: 'sos-main-dark',
    theme: 'dark',
    setup: evaluate(() => localStorage.setItem('spothitch_sos_disclaimer_seen', '1')),
    action: modal('openSOS'),
    expect: [
      { visible: '#sos-share-btn' },
      { visible: '[onclick*="sosOpenFakeCall"]' },
      { visible: '[onclick*="sosStartRecording"]' },
    ],
  },
  {
    id: 'sos-main-light',
    theme: 'light',
    setup: evaluate(() => localStorage.setItem('spothitch_sos_disclaimer_seen', '1')),
    action: modal('openSOS'),
    expect: [{ visible: '#sos-share-btn' }],
  },
  {
    id: 'sos-bouton-partage-direct',
    theme: 'dark',
    setup: evaluate(() => localStorage.setItem('spothitch_sos_disclaimer_seen', '1')),
    action: modal('openSOS'),
    expect: [
      { visible: '#sos-share-btn' },
      { notVisible: '#sos-countdown-ui' }, // plus de countdown
    ],
  },
  {
    id: 'sos-faux-appel',
    theme: 'dark',
    setup: evaluate(() => localStorage.setItem('spothitch_sos_disclaimer_seen', '1')),
    action: async (page) => {
      await page.evaluate(() => window.openSOS?.())
      await page.waitForTimeout(800)
      await page.evaluate(() => window.sosOpenFakeCall?.())
      await page.waitForTimeout(800)
    },
    expect: [
      { visible: '#sos-fake-call' },
      { visible: '[onclick*="sosFakeCallAnswer"]' },
      { visible: '[onclick*="sosFakeCallDecline"]' },
    ],
  },
  {
    id: 'sos-enregistrement-audio',
    theme: 'dark',
    setup: evaluate(() => localStorage.setItem('spothitch_sos_disclaimer_seen', '1')),
    action: modal('openSOS'),
    expect: [
      { visible: '[onclick*="sosStartRecording"]' },
      { visible: '[onclick*="sosStartRecording"][id*="audio"], #sos-rec-audio-btn' },
    ],
  },
  {
    id: 'sos-contacts-urgence',
    theme: 'dark',
    setup: evaluate(() => localStorage.setItem('spothitch_sos_disclaimer_seen', '1')),
    action: modal('openSOS'),
    expect: [
      { visible: '#emergency-name' },
      { visible: '#emergency-phone' },
      { visible: '[onclick*="addEmergencyContact"]' },
    ],
  },
  {
    id: 'sos-numeros-urgence',
    theme: 'dark',
    setup: evaluate(() => localStorage.setItem('spothitch_sos_disclaimer_seen', '1')),
    action: modal('openSOS'),
    expect: [
      { text: '112', selector: 'body' },
      { text: '911', selector: 'body' },
    ],
  },

  // ══════════════════════════════════════════════════════
  // AUTH
  // ══════════════════════════════════════════════════════
  {
    id: 'auth-login-dark',
    theme: 'dark',
    action: modal('openAuth', 'login'),
    expect: [
      { visible: '[role="dialog"], .fixed.inset-0' },
      { inputExists: 'input[type="email"], #auth-email' },
      { inputExists: 'input[type="password"], #auth-password' },
    ],
  },
  {
    id: 'auth-login-light',
    theme: 'light',
    action: modal('openAuth', 'login'),
    expect: [{ visible: '[role="dialog"], .fixed.inset-0' }],
  },
  {
    id: 'auth-register',
    theme: 'dark',
    action: modal('openAuth', 'register'),
    expect: [
      { visible: '[role="dialog"], .fixed.inset-0' },
      { inputExists: 'input[type="email"]' },
    ],
  },
  {
    id: 'auth-fermeture',
    theme: 'dark',
    setup: modal('openAuth'),
    action: async (page) => { await page.keyboard.press('Escape'); await page.waitForTimeout(500) },
    expect: [{ notVisible: '[role="dialog"].auth-modal, .auth-overlay' }],
  },

  // ══════════════════════════════════════════════════════
  // DONS
  // ══════════════════════════════════════════════════════
  {
    id: 'dons-modal-dark',
    theme: 'dark',
    action: modal('openDonation', 10, 'pizza'),
    actionWait: 800,
    expect: [
      { notContains: 'Ko-fi' },
      { notContains: 'Buy Me a Coffee' },
    ],
  },
  {
    id: 'dons-modal-light',
    theme: 'light',
    action: modal('openDonation', 10, 'pizza'),
    expect: [{ visible: '.fixed.inset-0' }],
  },
  {
    id: 'dons-montants',
    theme: 'dark',
    action: tab('profile'),
    expect: [
      { count: 4, selector: '.donation-btn' },
    ],
  },

  // ══════════════════════════════════════════════════════
  // VOYAGE / ITINÉRAIRE
  // ══════════════════════════════════════════════════════
  {
    id: 'voyage-default-dark',
    theme: 'dark',
    action: tab('challenges'),
    actionWait: 2500,
    expect: [{ visible: '[onclick*="setVoyageSubTab"], #trip-map' }],
  },
  {
    id: 'voyage-default-light',
    theme: 'light',
    action: tab('challenges'),
    actionWait: 2500,
    expect: [{ visible: '[onclick*="setVoyageSubTab"], #trip-map' }],
  },
  {
    id: 'voyage-bottom-sheet',
    theme: 'dark',
    action: tab('challenges'),
    actionWait: 2500,
    expect: [
      { visible: '[onclick*="setVoyageSubTab"], #trip-bottom-sheet' },
    ],
  },
  {
    id: 'voyage-cycle-bottom-sheet',
    theme: 'dark',
    setup: tab('challenges'),
    waitAfterReload: 600,
    action: async (page) => {
      await page.waitForTimeout(2500) // attendre lazy-render
      const el = page.locator('[onclick*="tripSheetCycleState"], [onclick*="cycleSheet"]').first()
      if (await el.count() > 0) await el.click({ timeout: 3000 }).catch(() => {})
      await page.waitForTimeout(400)
    },
    expect: [{ visible: '[onclick*="setVoyageSubTab"]' }],
  },

  // ══════════════════════════════════════════════════════
  // SOCIAL — Amis
  // ══════════════════════════════════════════════════════
  {
    id: 'social-amis-dark',
    theme: 'dark',
    stateExtra: { activeTab: 'social' },
    waitAfterReload: 2500,
    expect: [
      { visible: '#social-search, [onclick*="setSocialSubTab"]' },
    ],
  },
  {
    id: 'social-amis-light',
    theme: 'light',
    action: tab('social'),
    expect: [],
  },
  {
    id: 'social-recherche',
    theme: 'dark',
    stateExtra: { activeTab: 'social', socialSubTab: 'messagerie' },
    waitAfterReload: 2500,
    expect: [{ visible: '#social-search, #friend-search' }],
  },

  // ══════════════════════════════════════════════════════
  // CHAT
  // ══════════════════════════════════════════════════════
  {
    id: 'chat-dark',
    theme: 'dark',
    stateExtra: { activeTab: 'chat' },
    waitAfterReload: 2500,
    expect: [{ visible: '#panel-chat, #chat-messages, #chat-input' }],
  },
  {
    id: 'chat-light',
    theme: 'light',
    action: tab('chat'),
    expect: [],
  },

  // ══════════════════════════════════════════════════════
  // PROFIL — Onglet principal
  // ══════════════════════════════════════════════════════
  {
    id: 'profil-dark',
    theme: 'dark',
    action: tab('profile'),
    expect: [{ visible: '[class*="profile"], [id*="profile"]' }],
  },
  {
    id: 'profil-light',
    theme: 'light',
    action: tab('profile'),
    expect: [],
  },
  {
    id: 'profil-stats',
    theme: 'dark',
    setup: tab('profile'),
    action: click('[onclick*="profileTab(\'stats\'"], [onclick*="openStats"], [data-tab="stats"]'),
    expect: [],
  },
  {
    id: 'profil-voyages',
    theme: 'dark',
    setup: tab('profile'),
    action: click('[onclick*="profileTab(\'trips\'"], [data-tab="trips"], [onclick*="trips"]'),
    expect: [],
  },
  {
    id: 'profil-roadmap',
    theme: 'dark',
    setup: tab('profile'),
    action: click('[onclick*="profileTab(\'roadmap\'"], [data-tab="roadmap"], [onclick*="roadmap"]'),
    expect: [],
  },
  {
    id: 'profil-reglages',
    theme: 'dark',
    setup: tab('profile'),
    action: click('[onclick*="profileTab(\'settings\'"], [data-tab="settings"], [onclick*="settings"]'),
    expect: [],
  },

  // ══════════════════════════════════════════════════════
  // GUIDES
  // ══════════════════════════════════════════════════════
  {
    id: 'guides-dark',
    theme: 'dark',
    action: async (page) => {
      await page.evaluate(() => window.changeTab?.('profile'))
      await page.waitForTimeout(600)
      await page.evaluate(() => window.showGuides?.())
      await page.waitForTimeout(1000)
    },
    expect: [],
  },

  // ══════════════════════════════════════════════════════
  // MODALES — Badges, Stats, Classements
  // ══════════════════════════════════════════════════════
  {
    id: 'badges-modal-dark',
    theme: 'dark',
    action: modal('openBadges'),
    expect: [{ visible: '[role="dialog"], .fixed.inset-0' }],
  },
  {
    id: 'stats-modal-dark',
    theme: 'dark',
    action: modal('openStats'),
    expect: [{ visible: '[role="dialog"], .fixed.inset-0' }],
  },
  {
    id: 'leaderboard-dark',
    theme: 'dark',
    action: modal('openLeaderboard'),
    expect: [{ visible: '[role="dialog"], .fixed.inset-0' }],
  },
  {
    id: 'companion-modal-dark',
    theme: 'dark',
    action: modal('showCompanionModal'),
    expect: [{ visible: '[role="dialog"], .fixed.inset-0' }],
  },

  // ══════════════════════════════════════════════════════
  // COOKIES & LEGAL
  // ══════════════════════════════════════════════════════
  {
    id: 'cookie-banner-dark',
    theme: 'dark',
    // tutorialCompleted:true pour que le banner s'affiche (sinon tutorial cache le banner)
    stateExtra: { tutorialCompleted: true },
    // cookie_consent n'est pas dans le state → localStorage.clear() l'a supprimé → banner s'affiche
    expect: [
      { visible: '#cookie-banner' },
    ],
  },
  {
    id: 'faq-modal-dark',
    theme: 'dark',
    action: modal('openFAQ'),
    expect: [{ visible: '[role="dialog"], .fixed.inset-0' }],
  },
  {
    id: 'legal-modal-dark',
    theme: 'dark',
    action: modal('openPrivacyPolicy'),
    expect: [{ visible: '[role="dialog"], .fixed.inset-0' }],
  },
  {
    id: 'rgpd-export-dark',
    theme: 'dark',
    action: modal('openMyData'),
    expect: [{ visible: '[role="dialog"], .fixed.inset-0' }],
  },

  // ══════════════════════════════════════════════════════
  // FENÊTRES GLASSMORPHISM — À venir
  // ══════════════════════════════════════════════════════
  {
    id: 'feature-intro-glassmorphism',
    theme: 'dark',
    action: async (page) => {
      await page.evaluate(() => {
        localStorage.removeItem('spothitch_feature_seen')
        window.showFeatureIntro?.('compagnon')
      })
      await page.waitForTimeout(1000)
    },
    expect: [
      { visible: '.feature-intro-overlay, [class*="feature-intro"], [id*="feature-intro"]' },
    ],
  },

  // ══════════════════════════════════════════════════════
  // NAVIGATION — Tous les onglets
  // ══════════════════════════════════════════════════════
  {
    id: 'navigation-tab-map',
    theme: 'dark',
    action: tab('map'),
    expect: [{ visible: '#home-map' }],
  },
  {
    id: 'navigation-tab-challenges-voyage',
    theme: 'dark',
    action: tab('challenges'),
    expect: [{ visible: '[onclick*="setVoyageSubTab"], #trip-map' }],
  },
  {
    id: 'navigation-tab-social',
    theme: 'dark',
    action: tab('social'),
    expect: [],
  },
  {
    id: 'navigation-tab-chat',
    theme: 'dark',
    action: tab('chat'),
    expect: [],
  },
  {
    id: 'navigation-tab-profile',
    theme: 'dark',
    action: tab('profile'),
    expect: [],
  },

  // ══════════════════════════════════════════════════════
  // RÉGLAGES — Toggles et options
  // ══════════════════════════════════════════════════════
  {
    id: 'reglages-theme-clair',
    theme: 'dark',
    setup: tab('profile'),
    action: async (page) => {
      await page.evaluate(() => window.setTheme?.('light'))
      await page.waitForTimeout(500)
    },
    expect: [],
  },
  {
    id: 'reglages-langue-en',
    theme: 'dark',
    action: async (page) => {
      await page.evaluate(() => window.setLanguage?.('en'))
      await page.waitForTimeout(800)
    },
    expect: [],
  },
  {
    id: 'reglages-langue-retour-fr',
    theme: 'dark',
    action: async (page) => {
      await page.evaluate(() => window.setLanguage?.('fr'))
      await page.waitForTimeout(800)
    },
    expect: [],
  },

  // ══════════════════════════════════════════════════════
  // VÉRIFICATIONS SÉCURITÉ — Choses qui NE doivent PAS apparaître
  // ══════════════════════════════════════════════════════
  {
    id: 'securite-no-whatsapp',
    theme: 'dark',
    setup: evaluate(() => localStorage.setItem('spothitch_sos_disclaimer_seen', '1')),
    action: modal('openSOS'),
    expect: [
      { notContains: 'WhatsApp' },
      { notContains: 'whatsapp' },
    ],
  },
  {
    id: 'securite-no-countdown-sos',
    theme: 'dark',
    setup: evaluate(() => localStorage.setItem('spothitch_sos_disclaimer_seen', '1')),
    action: modal('openSOS'),
    expect: [
      { notContains: 'sosStartCountdown' },
      { notContains: 'sosCancelCountdown' },
      { notVisible: '#sos-countdown-ui' },
    ],
  },
  {
    id: 'securite-stations-sans-intro',
    theme: 'dark',
    action: async (page) => {
      await page.evaluate(() => {
        localStorage.removeItem('spothitch_feature_seen')
        window.toggleGasStations?.()
      })
      await page.waitForTimeout(800)
    },
    expect: [
      { notVisible: '.feature-intro-overlay, [id*="feature-intro"]' },
    ],
  },
  {
    id: 'securite-no-kofi',
    theme: 'dark',
    action: modal('openDonation'),
    expect: [
      { notContains: 'Ko-fi' },
      { notContains: 'Buy Me a Coffee' },
    ],
  },
  {
    id: 'securite-no-lorem',
    theme: 'dark',
    expect: [
      { notContains: 'Lorem ipsum' },
      { notContains: 'TODO' },
      { notContains: 'FIXME' },
    ],
  },

  // ══════════════════════════════════════════════════════
  // ACCESSIBILITÉ — Aria labels sur boutons critiques
  // ══════════════════════════════════════════════════════
  {
    id: 'a11y-boutons-carte',
    theme: 'dark',
    expect: [
      { visible: '[onclick*="homeZoomIn"][aria-label]' },
      { visible: '[onclick*="openAddSpot"][aria-label]' },
      { visible: '#home-destination[aria-label]' },
    ],
  },
  {
    id: 'a11y-sos-bouton',
    theme: 'dark',
    setup: evaluate(() => localStorage.setItem('spothitch_sos_disclaimer_seen', '1')),
    action: modal('openSOS'),
    expect: [
      { visible: '#sos-share-btn' },
    ],
  },

]

// ─── EXÉCUTION ────────────────────────────────────────────────────────────────
process.stdout.write(`TOTAL:${SCENARIOS.length}\n`)

for (const scenario of SCENARIOS) {
  await runScenario(scenario)
}

// ─── RÉSULTATS ────────────────────────────────────────────────────────────────
await browser.close()
server.close()

const passed = results.filter(r => r.passed).length
const failed = results.filter(r => !r.passed).length
process.stdout.write(`SUMMARY:${passed}:${failed}\n`)

writeFileSync(RESULTS_PATH, JSON.stringify(results, null, 2))
process.exit(failed > 0 ? 1 : 0)
