/**
 * SplashScreen Component — v2 "Smart Loading"
 *
 * Real progress bar tied to actual loading steps + rotating tips.
 * The splash stays visible until everything is ready, then the map appears instantly.
 */

import { icon } from '../utils/icons.js'

// ─── Tips by language ──────────────────────────────────────────────────────
const tipsByLang = {
  fr: [
    { icon: 'shield-alert', text: 'Configure le mode SOS avant ton trajet. En cas de danger, un seul geste alerte tes proches.' },
    { icon: 'shield', text: 'Le mode Gardien permet à un proche de suivre ton trajet en temps réel.' },
    { icon: 'map-pin', text: 'Ajoute des spots pour aider les autres autostoppeurs. Chaque spot compte !' },
    { icon: 'star', text: 'Note les spots que tu utilises. Tes avis aident la communauté.' },
    { icon: 'users', text: 'Ajoute des amis pour partager tes trajets et tes spots favoris.' },
    { icon: 'compass', text: 'Utilise le planificateur de voyage pour trouver les meilleurs spots sur ta route.' },
    { icon: 'heart', text: 'SpotHitch est gratuit et communautaire. Chaque contribution rend l\'app meilleure.' },
    { icon: 'phone-incoming', text: 'Le faux appel du mode SOS peut te sortir d\'une situation inconfortable.' },
    { icon: 'radio', text: 'Active l\'aide communautaire pour être alerté si un autostoppeur proche a besoin d\'aide.' },
    { icon: 'book-open', text: 'Consulte les guides pays avant de partir. Conseils, visa, culture locale.' },
  ],
  en: [
    { icon: 'shield-alert', text: 'Set up SOS mode before your trip. One tap alerts your contacts in danger.' },
    { icon: 'shield', text: 'Guardian mode lets someone follow your trip in real time.' },
    { icon: 'map-pin', text: 'Add spots to help other hitchhikers. Every spot matters!' },
    { icon: 'star', text: 'Rate the spots you use. Your reviews help the community.' },
    { icon: 'users', text: 'Add friends to share trips and favorite spots.' },
    { icon: 'compass', text: 'Use the trip planner to find the best spots on your route.' },
    { icon: 'heart', text: 'SpotHitch is free and community-driven. Every contribution makes it better.' },
    { icon: 'phone-incoming', text: 'The fake call in SOS mode can get you out of an uncomfortable situation.' },
    { icon: 'radio', text: 'Enable community help to be alerted if a nearby hitchhiker needs assistance.' },
    { icon: 'book-open', text: 'Check country guides before you go. Tips, visa, local culture.' },
  ],
  es: [
    { icon: 'shield-alert', text: 'Configura el modo SOS antes de tu viaje. Un toque alerta a tus contactos.' },
    { icon: 'shield', text: 'El modo Guardián permite que alguien siga tu viaje en tiempo real.' },
    { icon: 'map-pin', text: 'Añade spots para ayudar a otros autoestopistas. ¡Cada spot cuenta!' },
    { icon: 'star', text: 'Califica los spots que usas. Tus reseñas ayudan a la comunidad.' },
    { icon: 'users', text: 'Añade amigos para compartir viajes y spots favoritos.' },
    { icon: 'compass', text: 'Usa el planificador de viaje para encontrar los mejores spots en tu ruta.' },
    { icon: 'heart', text: 'SpotHitch es gratuito y comunitario. Cada contribución lo mejora.' },
    { icon: 'phone-incoming', text: 'La llamada falsa del modo SOS te puede sacar de una situación incómoda.' },
    { icon: 'radio', text: 'Activa la ayuda comunitaria para ser alertado si un autoestopista cercano necesita ayuda.' },
    { icon: 'book-open', text: 'Consulta las guías de países antes de ir. Consejos, visa, cultura local.' },
  ],
  de: [
    { icon: 'shield-alert', text: 'Richte den SOS-Modus vor deiner Reise ein. Ein Tippen alarmiert deine Kontakte.' },
    { icon: 'shield', text: 'Der Wächter-Modus ermöglicht es jemandem, deine Reise in Echtzeit zu verfolgen.' },
    { icon: 'map-pin', text: 'Füge Spots hinzu, um anderen Trampern zu helfen. Jeder Spot zählt!' },
    { icon: 'star', text: 'Bewerte die Spots, die du nutzt. Deine Bewertungen helfen der Community.' },
    { icon: 'users', text: 'Füge Freunde hinzu, um Reisen und Lieblingsspots zu teilen.' },
    { icon: 'compass', text: 'Nutze den Reiseplaner, um die besten Spots auf deiner Route zu finden.' },
    { icon: 'heart', text: 'SpotHitch ist kostenlos und community-basiert. Jeder Beitrag macht es besser.' },
    { icon: 'phone-incoming', text: 'Der Fake-Anruf im SOS-Modus kann dich aus einer unangenehmen Situation befreien.' },
    { icon: 'radio', text: 'Aktiviere die Community-Hilfe, um benachrichtigt zu werden, wenn ein Tramper in der Nähe Hilfe braucht.' },
    { icon: 'book-open', text: 'Schau dir die Länderguides an, bevor du losfährst. Tipps, Visum, Kultur.' },
  ],
}

// ─── Loading status labels ──────────────────────────────────────────────────
const loadingLabels = {
  fr: { map: 'Carte', spots: 'Spots', gps: 'GPS', app: 'Application' },
  en: { map: 'Map', spots: 'Spots', gps: 'GPS', app: 'Application' },
  es: { map: 'Mapa', spots: 'Spots', gps: 'GPS', app: 'Aplicación' },
  de: { map: 'Karte', spots: 'Spots', gps: 'GPS', app: 'Anwendung' },
}

function getSplashLang() {
  try {
    const saved = localStorage.getItem('spothitch_language')
    if (saved && tipsByLang[saved]) return saved
  } catch { /* no-op */ }
  const nav = (navigator.language || 'en').slice(0, 2)
  return tipsByLang[nav] ? nav : 'en'
}

const lang = getSplashLang()
const tips = tipsByLang[lang]
const labels = loadingLabels[lang]

// ─── Progress tracker ───────────────────────────────────────────────────────
const _loadingSteps = {
  mapModule: false,   // MapLibre JS loaded
  mapStyle: false,    // OpenFreeMap style fetched
  mapReady: false,    // Map rendered on canvas
  spotsLoaded: false, // First batch of spots
  appReady: false,    // App render complete
}

let _currentTipIndex = 0
let _tipInterval = null
let _minTimeElapsed = false
let _allReady = false

/**
 * Mark a loading step as complete and update the progress bar.
 * Called from main.js and App.js during initialization.
 */
export function markLoaded(step) {
  if (_loadingSteps[step] !== undefined) {
    _loadingSteps[step] = true
  }
  _updateProgress()
}

function _getProgress() {
  const steps = Object.values(_loadingSteps)
  const done = steps.filter(Boolean).length
  return Math.round((done / steps.length) * 100)
}

function _updateProgress() {
  const pct = _getProgress()
  const bar = document.getElementById('splash-progress-fill')
  const pctEl = document.getElementById('splash-progress-pct')
  const statusEl = document.getElementById('splash-status')

  if (bar) bar.style.width = pct + '%'
  if (pctEl) pctEl.textContent = pct + '%'

  // Update status label
  if (statusEl) {
    if (!_loadingSteps.mapModule) statusEl.textContent = labels.map + '...'
    else if (!_loadingSteps.mapReady) statusEl.textContent = labels.map + '...'
    else if (!_loadingSteps.spotsLoaded) statusEl.textContent = labels.spots + '...'
    else statusEl.textContent = labels.app + '...'
  }

  // Check if all done
  if (pct >= 100) {
    _allReady = true
    _tryHide()
  }
}

function _tryHide() {
  if (_allReady && _minTimeElapsed) {
    hideSplashScreen()
  }
}

// ─── Render ─────────────────────────────────────────────────────────────────
export function renderSplashScreen() {
  const tip = tips[0]

  return `
    <div id="splash-screen" class="splash-screen" aria-live="polite" aria-label="Loading SpotHitch">
      <div class="splash-bg"></div>

      <!-- Animated road -->
      <div class="splash-road">
        <div class="road-line"></div>
        <div class="road-line"></div>
        <div class="road-line"></div>
      </div>

      <div class="splash-content">
        <!-- Logo -->
        <div class="splash-logo">
          <img src="logo.png" alt="SpotHitch" class="w-16 h-16 rounded-2xl object-cover" />
          <h1 class="splash-logo-text">SpotHitch</h1>
        </div>

        <!-- Animated hitchhiker -->
        <div class="splash-animation">
          <div class="splash-hitchhiker">
            <div class="hitchhiker-body">${icon('user', 'w-5 h-5')}</div>
            <div class="hitchhiker-thumb">${icon('thumbs-up', 'w-5 h-5')}</div>
          </div>
          <div class="splash-car">${icon('car-front', 'w-5 h-5')}</div>
        </div>

        <!-- Progress bar -->
        <div style="width:100%;max-width:260px;margin:1rem auto 0">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
            <span id="splash-status" style="font-size:11px;color:#94a3b8">${labels.map}...</span>
            <span id="splash-progress-pct" style="font-size:11px;color:#f59e0b;font-weight:600">0%</span>
          </div>
          <div style="width:100%;height:4px;background:rgba(255,255,255,0.08);border-radius:99px;overflow:hidden">
            <div id="splash-progress-fill" style="width:0%;height:100%;background:linear-gradient(90deg,#f59e0b,#d97706);border-radius:99px;transition:width .4s ease"></div>
          </div>
        </div>

        <!-- Tip -->
        <div id="splash-tip" style="margin-top:1.25rem;padding:0 1.25rem;max-width:320px;min-height:3rem;display:flex;align-items:flex-start;gap:8px;transition:opacity .3s">
          <span id="splash-tip-icon" style="flex-shrink:0;margin-top:2px;color:#f59e0b">${icon(tip.icon, 'w-4 h-4')}</span>
          <span id="splash-tip-text" style="font-size:12px;color:#94a3b8;line-height:1.5;text-align:left">${tip.text}</span>
        </div>
      </div>

      <!-- Decorations -->
      <div class="splash-decorations">
        ${icon('sun', 'w-5 h-5 splash-sun')}
        ${icon('cloud', 'w-5 h-5 splash-cloud splash-cloud-1')}
        ${icon('cloud', 'w-5 h-5 splash-cloud splash-cloud-2')}
      </div>
    </div>
  `
}

// ─── Init ───────────────────────────────────────────────────────────────────
export function initSplashScreen() {
  const loader = document.getElementById('app-loader')
  if (!loader) return

  loader.innerHTML = renderSplashScreen()
  loader.classList.remove('hidden')

  // Rotate tips every 3 seconds
  _currentTipIndex = 0
  _tipInterval = setInterval(() => {
    _currentTipIndex = (_currentTipIndex + 1) % tips.length
    const tip = tips[_currentTipIndex]
    const tipEl = document.getElementById('splash-tip')
    const textEl = document.getElementById('splash-tip-text')
    const iconEl = document.getElementById('splash-tip-icon')

    if (tipEl && textEl) {
      tipEl.style.opacity = '0'
      setTimeout(() => {
        textEl.textContent = tip.text
        if (iconEl) iconEl.innerHTML = icon(tip.icon, 'w-4 h-4')
        tipEl.style.opacity = '1'
      }, 300)
    }
  }, 3500)

  // Minimum display time: 2.5s (enough to read at least 1 tip)
  _minTimeElapsed = false
  setTimeout(() => {
    _minTimeElapsed = true
    _tryHide()
  }, 2500)
}

// ─── Hide ───────────────────────────────────────────────────────────────────
export function hideSplashScreen() {
  if (_tipInterval) {
    clearInterval(_tipInterval)
    _tipInterval = null
  }

  // Ensure progress shows 100% before hiding
  const bar = document.getElementById('splash-progress-fill')
  const pctEl = document.getElementById('splash-progress-pct')
  if (bar) bar.style.width = '100%'
  if (pctEl) pctEl.textContent = '100%'

  // Short delay to let 100% be visible
  setTimeout(() => {
    const loader = document.getElementById('app-loader')
    const splash = document.getElementById('splash-screen')
    const app = document.getElementById('app')

    if (splash) splash.classList.add('splash-exit')
    if (loader) {
      loader.classList.add('hidden')
      setTimeout(() => loader.remove(), 500)
    }
    if (app) app.classList.add('loaded')
  }, 300)
}

// ─── Legacy compat ──────────────────────────────────────────────────────────
export function getRandomMessage() {
  return tips[Math.floor(Math.random() * tips.length)].text
}

export default {
  renderSplashScreen,
  initSplashScreen,
  hideSplashScreen,
  markLoaded,
  getRandomMessage,
}
