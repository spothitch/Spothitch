/**
 * SplashScreen Component — v2 "Smart Loading"
 *
 * Real progress bar tied to actual loading steps + rotating tips.
 * The splash stays visible until everything is ready, then the map appears instantly.
 */

import { icon } from '../utils/icons.js'

// ─── Tips by language (validated by Antoine 2026-03-21) ─────────────────────
const tipsByLang = {
  fr: [
    { text: 'Tu peux créer un spot directement depuis Google Maps : partage un lieu vers SpotHitch' },
    { text: 'Appuie longtemps sur la carte pour créer un spot à cet endroit' },
    { text: 'Appuie sur une station-service sur la carte pour créer un spot station directement' },
    { text: 'Tu peux ajouter jusqu\'à 3 photos par spot pour aider les autres autostoppeurs' },
    { text: 'Configure le mode SOS avant ton trajet. En cas de danger, un seul geste alerte tes proches' },
    { text: 'Le faux appel simule un vrai appel entrant pour quitter une situation' },
    { text: 'Le mode Gardien permet à un proche de suivre ton trajet en temps réel' },
    { text: 'Active l\'aide communautaire pour être alerté si quelqu\'un proche a besoin d\'aide' },
    { text: 'Tu peux enregistrer audio ou vidéo comme preuve en cas de problème' },
    { text: 'Ajoute des amis pour partager tes spots favoris et tes trajets' },
    { text: 'Envoie un message privé à un autre autostoppeur directement depuis son profil' },
    { text: 'Crée un groupe de conversation pour organiser un trajet à plusieurs' },
    { text: 'Consulte les guides pays avant de partir. Conseils, visa, culture locale' },
    { text: 'Note tes voyages passés dans le journal pour garder une trace' },
    { text: 'Ajoute tes langues parlées pour que les autres sachent comment te contacter' },
    { text: 'Ton score de confiance augmente avec chaque spot vérifié et chaque avis' },
    { text: 'Vote sur la Roadmap pour décider des prochaines fonctionnalités' },
    { text: 'Les spots les plus utiles sont ceux avec une direction précise' },
    { text: 'Cherche une ville pour voir tous les spots de sortie autour' },
    { text: 'SpotHitch fonctionne même sans internet grâce au mode hors ligne' },
  ],
  en: [
    { text: 'You can create a spot directly from Google Maps: share a place to SpotHitch' },
    { text: 'Long press on the map to create a spot at that location' },
    { text: 'Tap a gas station on the map to create a station spot directly' },
    { text: 'You can add up to 3 photos per spot to help other hitchhikers' },
    { text: 'Set up SOS mode before your trip. One tap alerts your contacts in danger' },
    { text: 'The fake call simulates a real incoming call to leave a situation' },
    { text: 'Guardian mode lets someone follow your trip in real time' },
    { text: 'Enable community help to be alerted if a nearby hitchhiker needs assistance' },
    { text: 'You can record audio or video as evidence in case of a problem' },
    { text: 'Add friends to share your favorite spots and trips' },
    { text: 'Send a private message to another hitchhiker directly from their profile' },
    { text: 'Create a group conversation to organize a trip together' },
    { text: 'Check country guides before you go. Tips, visa, local culture' },
    { text: 'Log your past trips in the journal to keep a record' },
    { text: 'Add your spoken languages so others know how to contact you' },
    { text: 'Your trust score increases with every verified spot and review' },
    { text: 'Vote on the Roadmap to decide the next features' },
    { text: 'The most useful spots are those with a precise direction' },
    { text: 'Search for a city to see all exit spots around it' },
    { text: 'SpotHitch works even without internet thanks to offline mode' },
  ],
  es: [
    { text: 'Puedes crear un spot desde Google Maps: comparte un lugar hacia SpotHitch' },
    { text: 'Mantén pulsado en el mapa para crear un spot en ese lugar' },
    { text: 'Toca una gasolinera en el mapa para crear un spot de estación' },
    { text: 'Puedes añadir hasta 3 fotos por spot para ayudar a otros autoestopistas' },
    { text: 'Configura el modo SOS antes de tu viaje. Un toque alerta a tus contactos' },
    { text: 'La llamada falsa simula una llamada real para salir de una situación' },
    { text: 'El modo Guardián permite que alguien siga tu viaje en tiempo real' },
    { text: 'Activa la ayuda comunitaria para ser alertado si alguien cercano necesita ayuda' },
    { text: 'Puedes grabar audio o vídeo como prueba en caso de problema' },
    { text: 'Añade amigos para compartir tus spots favoritos y viajes' },
    { text: 'Envía un mensaje privado a otro autoestopista desde su perfil' },
    { text: 'Crea un grupo de conversación para organizar un viaje juntos' },
    { text: 'Consulta las guías de países antes de ir. Consejos, visa, cultura local' },
    { text: 'Anota tus viajes pasados en el diario para guardar un registro' },
    { text: 'Añade tus idiomas para que los demás sepan cómo contactarte' },
    { text: 'Tu puntuación de confianza sube con cada spot verificado y reseña' },
    { text: 'Vota en la Roadmap para decidir las próximas funcionalidades' },
    { text: 'Los spots más útiles son los que tienen una dirección precisa' },
    { text: 'Busca una ciudad para ver todos los spots de salida alrededor' },
    { text: 'SpotHitch funciona incluso sin internet gracias al modo offline' },
  ],
  de: [
    { text: 'Du kannst einen Spot direkt aus Google Maps erstellen: teile einen Ort mit SpotHitch' },
    { text: 'Halte die Karte lang gedrückt, um einen Spot an dieser Stelle zu erstellen' },
    { text: 'Tippe auf eine Tankstelle auf der Karte, um einen Tankstellen-Spot zu erstellen' },
    { text: 'Du kannst bis zu 3 Fotos pro Spot hinzufügen, um anderen Trampern zu helfen' },
    { text: 'Richte den SOS-Modus vor deiner Reise ein. Ein Tippen alarmiert deine Kontakte' },
    { text: 'Der Fake-Anruf simuliert einen echten eingehenden Anruf, um eine Situation zu verlassen' },
    { text: 'Der Wächter-Modus ermöglicht es jemandem, deine Reise in Echtzeit zu verfolgen' },
    { text: 'Aktiviere die Community-Hilfe, um benachrichtigt zu werden, wenn jemand in der Nähe Hilfe braucht' },
    { text: 'Du kannst Audio oder Video als Beweis aufnehmen, falls es ein Problem gibt' },
    { text: 'Füge Freunde hinzu, um deine Lieblingsspots und Reisen zu teilen' },
    { text: 'Sende eine Direktnachricht an einen anderen Tramper von seinem Profil aus' },
    { text: 'Erstelle eine Gruppenunterhaltung, um eine Reise gemeinsam zu organisieren' },
    { text: 'Schau dir die Länderguides an, bevor du losfährst. Tipps, Visum, Kultur' },
    { text: 'Trage deine vergangenen Reisen ins Tagebuch ein, um sie festzuhalten' },
    { text: 'Füge deine gesprochenen Sprachen hinzu, damit andere wissen, wie sie dich erreichen' },
    { text: 'Dein Vertrauenswert steigt mit jedem verifizierten Spot und jeder Bewertung' },
    { text: 'Stimme auf der Roadmap ab, um die nächsten Funktionen zu bestimmen' },
    { text: 'Die nützlichsten Spots sind die mit einer genauen Richtung' },
    { text: 'Suche nach einer Stadt, um alle Ausfahrt-Spots in der Umgebung zu sehen' },
    { text: 'SpotHitch funktioniert auch ohne Internet dank des Offline-Modus' },
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

  if (bar) bar.style.width = pct + '%'

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
        <div id="splash-tip" style="margin-top:1.25rem;padding:0 1.5rem;max-width:320px;min-height:3rem;transition:opacity .3s;text-align:center">
          <span id="splash-tip-text" style="font-size:14px;color:#94a3b8;line-height:1.6">${tip.text}</span>
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

  // The splash HTML is already in index.html (instant display).
  // If it's missing (edge case), inject it.
  if (!document.getElementById('splash-screen')) {
    loader.innerHTML = renderSplashScreen()
  }
  loader.classList.remove('hidden')

  // Set first tip immediately
  const textEl = document.getElementById('splash-tip-text')
  if (textEl && !textEl.textContent) {
    textEl.textContent = tips[0].text
  }

  // Rotate tips every 4 seconds
  _currentTipIndex = 0
  _tipInterval = setInterval(() => {
    _currentTipIndex = (_currentTipIndex + 1) % tips.length
    const tip = tips[_currentTipIndex]
    const tipEl = document.getElementById('splash-tip')
    const textEl = document.getElementById('splash-tip-text')

    if (tipEl && textEl) {
      tipEl.style.opacity = '0'
      setTimeout(() => {
        textEl.textContent = tip.text
        tipEl.style.opacity = '1'
      }, 300)
    }
  }, 4000)

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

    if (splash) {
      splash.classList.add('splash-exit')
      // Remove splash from DOM after animation to unblock clicks on map controls
      setTimeout(() => splash.remove(), 600)
    }
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
