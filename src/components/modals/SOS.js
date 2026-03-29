/**
 * SOS Modal Component — v4b "Alerts First"
 *
 * Structure:
 * 1. Intro screen (first open only) — explains why to configure
 * 2. Main modal with 2 tabs:
 *    - Tab 1 (default): Alertes — 2x2 grid + big SOS button + safe button
 *    - Tab 2: Configuration — checklist with sliding sidebars
 *
 * Design decisions (approved by Antoine 2026-03-20):
 * - No "silent mode" (removed, deemed useless)
 * - Alerts tab first (not config)
 * - No separate contacts tab (contacts are inside config sidebar)
 * - Contacts: SpotHitch (push) + SMS (external) + primary contact choice
 * - Fake call: name, delay (instant/30s/1m/2m/5m), sound+vibration
 * - Community: radius 5/10/25/50km + opt-in to receive alerts
 * - Recording: permissions granted in advance, max duration
 * - Test button for each config element
 * - Lucide SVG icons only, zero childish emoji
 */

import { t } from '../../i18n/index.js'
import { icon } from '../../utils/icons.js'
import { escapeHTML, escapeJSString } from '../../utils/sanitize.js'
import { getCommunityAlertSettings } from '../../services/communityAlert.js'

// ─── SOS localStorage helpers ───────────────────────────────────────────────
const LS = {
  channel: () => localStorage.getItem('spothitch_sos_channel') || 'both',
  silent: () => localStorage.getItem('spothitch_sos_silent') === '1',
  customMsg: () => localStorage.getItem('spothitch_sos_custom_msg') || '',
  primaryContact: () => parseInt(localStorage.getItem('spothitch_sos_primary') ?? '-1', 10),
  cachedPos: () => {
    try { return JSON.parse(localStorage.getItem('spothitch_sos_last_pos') || 'null') } catch { return null }
  },
  savePos: (lat, lng) => localStorage.setItem('spothitch_sos_last_pos', JSON.stringify({ lat, lng, ts: Date.now() })),
}

// Country emergency numbers lookup (ISO 2-letter → number)
const COUNTRY_EMERGENCY = {
  US: '911', CA: '911', MX: '911',
  AU: '000', NZ: '111',
  GB: '999', IE: '999',
  DE: '112', FR: '112', ES: '112', IT: '112', PT: '112', NL: '112',
  BE: '112', AT: '112', CH: '112', SE: '112', NO: '112', DK: '112',
  FI: '112', PL: '112', CZ: '112', SK: '112', HU: '112', RO: '112',
  BG: '112', HR: '112', SI: '112', LT: '112', LV: '112', EE: '112',
  GR: '112', CY: '112', MT: '112', LU: '112',
  IN: '112', CN: '110', JP: '110', KR: '119', BR: '190', AR: '911',
  ZA: '10111', EG: '123', NG: '199', KE: '999',
  RU: '112', UA: '112', TR: '112',
  // Default fallback
  DEFAULT: '112',
}

function getCountryEmergencyNumber() {
  // Try to get from stored locale/lang preference or timezone heuristic
  const lang = localStorage.getItem('spothitch_lang') || navigator.language || 'fr'
  const country = lang.split('-')[1]?.toUpperCase()
  return COUNTRY_EMERGENCY[country] || COUNTRY_EMERGENCY.DEFAULT
}

export function renderSOS(state) {
  const introSeen = typeof localStorage !== 'undefined' && localStorage.getItem('spothitch_sos_intro_seen')
  if (!introSeen) return renderSOSIntro()
  return renderSOSMain(state)
}

// ─── Intro Screen (first open only) ─────────────────────────────────────────
function renderSOSIntro() {
  return `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4" onclick="closeSOS()" role="dialog" aria-modal="true" aria-labelledby="sos-intro-title" tabindex="0">
      <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" aria-hidden="true"></div>
      <div class="relative bg-dark-primary border border-white/5 rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto slide-up" onclick="event.stopPropagation()">
        <div class="p-6 flex flex-col items-center text-center">
          <div class="w-14 h-14 rounded-full bg-red-500/[0.06] border-[1.5px] border-red-500/[0.12] flex items-center justify-center mb-4">
            ${icon('shield-alert', 'w-6 h-6 text-red-500')}
          </div>
          <h2 id="sos-intro-title" class="text-lg font-extrabold text-slate-200 mb-1">${t('sosPrepareTitle') || 'Prépare ton SOS'}</h2>
          <p class="text-[13px] text-slate-400 leading-relaxed max-w-[280px]">${t('sosPrepareDesc') || 'En cas de danger, chaque seconde compte. Configure tout maintenant pour ne rien avoir à faire en urgence.'}</p>

          <div class="w-full text-left mt-5 space-y-2.5">
            ${_introFeature('phone-incoming', 'amber', t('sosFakeCall') || 'Faux appel', t('sosFakeCallIntro') || 'Simule un appel pour quitter une situation')}
            ${_introFeature('shield', 'red', t('sosTripleAlert') || 'Triple alerte', t('sosTripleAlertIntro') || 'Push, SMS et appel en un geste')}
            ${_introFeature('radio', 'blue', t('sosCommunity') || 'Communauté', t('sosCommunityIntro') || 'Les autostoppeurs proches sont prévenus')}
            ${_introFeature('mic', 'rose', t('sosEvidence') || 'Preuves', t('sosEvidenceIntro') || 'Enregistre audio et vidéo')}
            ${_introFeature('phone-call', 'emerald', t('sosEmergency') || 'Urgences', t('sosEmergencyIntro') || '112 détecté selon ton pays')}
          </div>

          <button onclick="acceptSOSIntro()" class="w-full mt-5 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-dark-primary font-bold text-[15px] transition-colors flex items-center justify-center gap-2">
            ${icon('settings', 'w-[18px] h-[18px]')}
            ${t('sosConfigureNow') || 'Configurer mon SOS'}
          </button>
          <button onclick="acceptSOSIntro()" class="text-[13px] text-slate-500 mt-2 py-1">${t('sosConfigureLater') || 'Configurer plus tard'}</button>
        </div>
      </div>
    </div>
  `
}

function _introFeature(iconName, color, title, desc) {
  const colors = {
    amber: { bg: 'bg-amber-500/[0.08]', fg: 'text-amber-500' },
    red: { bg: 'bg-red-500/[0.08]', fg: 'text-red-500' },
    blue: { bg: 'bg-blue-500/[0.08]', fg: 'text-blue-500' },
    rose: { bg: 'bg-rose-500/[0.08]', fg: 'text-rose-500' },
    emerald: { bg: 'bg-emerald-500/[0.08]', fg: 'text-emerald-500' },
  }
  const c = colors[color] || colors.amber
  return `
    <div class="flex items-start gap-3">
      <div class="w-7 h-7 rounded-lg ${c.bg} flex items-center justify-center shrink-0 mt-0.5">
        ${icon(iconName, `w-3.5 h-3.5 ${c.fg}`)}
      </div>
      <div>
        <div class="text-[13px] font-semibold text-slate-200">${title}</div>
        <div class="text-[11px] text-slate-500 leading-snug">${desc}</div>
      </div>
    </div>
  `
}

// ─── Main SOS Modal — v4b Alerts First + Config Tab ─────────────────────────
function renderSOSMain(state) {
  const detectedNumber = getCountryEmergencyNumber()
  const communitySettings = getCommunityAlertSettings()
  const fakeCallName = localStorage.getItem('spothitch_sos_fake_name') || t('sosFakeCallerName') || 'Maman'
  const fakeCallDelay = localStorage.getItem('spothitch_sos_fake_delay') || '30'
  const contacts = state.emergencyContacts || []
  const contactNames = contacts.map(c => escapeHTML(c.name)).join(', ') || t('sosNoContacts') || 'Aucun contact'

  // Count configured items
  const configCount = [
    contacts.length > 0,                    // contacts
    true,                                    // fake call (always has defaults)
    true,                                    // message (push/sms/call always on)
    communitySettings.receiveAlerts,         // community
    true,                                    // recording (we count as ready if page loaded)
    true,                                    // emergency number (auto-detected)
  ].filter(Boolean).length

  return `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4" onclick="closeSOS()" role="alertdialog" aria-modal="true" aria-labelledby="sos-modal-title" tabindex="0">
      <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" aria-hidden="true"></div>
      <div class="relative bg-dark-primary border border-white/5 rounded-3xl w-full max-w-md max-h-[90vh] overflow-hidden slide-up flex flex-col" onclick="event.stopPropagation()">

        <!-- Header -->
        <div class="flex items-center gap-2 px-5 pt-4 pb-3 border-b border-white/5 shrink-0">
          ${icon('shield-alert', 'w-[18px] h-[18px] text-red-500')}
          <h2 id="sos-modal-title" class="text-[15px] font-extrabold text-slate-200 flex-1">SOS</h2>
          <button onclick="closeSOS()" class="w-7 h-7 rounded-full bg-white/[0.06] flex items-center justify-center" type="button" aria-label="${t('close') || 'Fermer'}">
            ${icon('x', 'w-3.5 h-3.5 text-slate-400')}
          </button>
        </div>

        <!-- Tabs -->
        <div class="flex border-b border-white/[0.06] px-5 shrink-0">
          <button onclick="sosTab(0)" class="sos-tab flex-1 py-2.5 text-center text-[13px] font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-colors text-amber-500 border-amber-500" data-sos-tab="0" type="button">
            ${icon('zap', 'w-3.5 h-3.5')} ${t('sosTabAlerts') || 'Alertes'}
          </button>
          <button onclick="sosTab(1)" class="sos-tab flex-1 py-2.5 text-center text-[13px] font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-colors text-slate-500 border-transparent" data-sos-tab="1" type="button">
            ${icon('settings', 'w-3.5 h-3.5')} ${t('sosTabConfig') || 'Configuration'}
          </button>
        </div>

        <!-- Tab content (scrollable) -->
        <div class="flex-1 overflow-y-auto">

          <!-- ═══ TAB 0: ALERTES ═══ -->
          <div class="sos-panel p-5 space-y-3" data-sos-panel="0">

            <!-- 2x2 grid -->
            <div class="grid grid-cols-2 gap-2.5">
              ${_alertTile('phone-incoming', 'amber', t('sosFakeCall') || 'Faux appel', `${fakeCallDelay}s · ${escapeHTML(fakeCallName)}`, 'sosOpenFakeCall()')}
              ${_alertTile('phone-call', 'emerald', detectedNumber, t('sosEmergencyCall') || 'Appel d\'urgence', `window.open('tel:${detectedNumber}')`)}
              ${_alertTile('radio', 'blue', t('sosCommunity') || 'Communauté', `${communitySettings.broadcastRadius || 5} km`, 'sosBroadcastCommunity()')}
              ${_alertTile('mic', 'rose', t('sosRecord') || 'Enregistrer', 'Audio · Vidéo', 'sosShowRecordOptions()')}
            </div>

            <!-- Record buttons (hidden by default, shown on click) -->
            <div id="sos-record-panel" class="hidden">
              <div class="flex gap-2">
                <button onclick="sosStartRecording('audio')" id="sos-rec-audio-btn" class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-semibold" type="button">
                  ${icon('mic', 'w-4 h-4')} ${t('sosRecordAudio') || 'Audio'}
                </button>
                <button onclick="sosStartRecording('video')" id="sos-rec-video-btn" class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-semibold" type="button">
                  ${icon('video', 'w-4 h-4')} ${t('sosRecordVideo') || 'Vidéo'}
                </button>
                <button onclick="sosStopRecording()" id="sos-rec-stop-btn" class="hidden items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold" type="button">
                  ${icon('circle-stop', 'w-4 h-4')}
                </button>
              </div>
              <span id="sos-rec-indicator" class="hidden items-center gap-1 text-xs text-rose-400 font-semibold mt-2">
                <span class="w-2 h-2 rounded-full bg-rose-500 animate-pulse inline-block"></span> REC
              </span>
              <div id="sos-rec-result" class="hidden mt-2 text-xs text-slate-400"></div>
            </div>

            <!-- Big SOS button -->
            <button onclick="shareSOSLocation()" class="w-full py-3.5 rounded-xl bg-red-500/[0.08] border-[1.5px] border-red-500/20 text-red-300 text-[15px] font-bold flex items-center justify-center gap-2.5 transition-colors active:bg-red-500/[0.15] active:border-red-500" type="button" id="sos-share-btn">
              ${icon('shield', 'w-5 h-5 text-red-500')}
              ${state.sosActive ? (t('stopSharing') || 'Arrêter le partage') : (t('sosAlertGuardians') || 'Alerter mes gardiens')}
            </button>
            <p class="text-[11px] text-slate-500 text-center leading-relaxed">
              Push + SMS + appel → <strong class="text-slate-400">${contactNames}</strong> · Position GPS
            </p>

            <!-- Safe button -->
            <button onclick="markSafe()" class="w-full py-3 rounded-xl bg-emerald-500 text-white text-[14px] font-bold flex items-center justify-center gap-2 transition-colors active:bg-emerald-600" type="button">
              ${icon('check-circle', 'w-4.5 h-4.5')}
              ${t('iAmSafe') || 'Je suis en sécurité'}
            </button>
          </div>

          <!-- ═══ TAB 1: CONFIGURATION ═══ -->
          <div class="sos-panel hidden p-5 space-y-2" data-sos-panel="1">

            <!-- Contacts -->
            ${_configItem('users', 'amber', t('emergencyContacts') || 'Contacts d\'urgence', contacts.length > 0 ? contactNames : (t('sosNoContacts') || 'Non configuré'), contacts.length > 0, 'sosOpenConfig(\'contacts\')')}
            <!-- Fake call -->
            ${_configItem('phone-incoming', 'amber', t('sosFakeCall') || 'Faux appel', `${escapeHTML(fakeCallName)} · ${fakeCallDelay} sec`, true, 'sosOpenConfig(\'fake\')')}
            <!-- Message -->
            ${_configItem('shield', 'red', t('sosAlertMessage') || 'Message d\'alerte', 'Push · SMS · Appel', true, 'sosOpenConfig(\'message\')')}
            <!-- Community -->
            ${_configItem('radio', 'blue', t('sosCommunity') || 'Communauté', communitySettings.receiveAlerts ? `${communitySettings.broadcastRadius || 5} km` : (t('sosNotConfigured') || 'Non configuré'), communitySettings.receiveAlerts, 'sosOpenConfig(\'community\')')}
            <!-- Recording -->
            ${_configItem('mic', 'rose', t('sosRecording') || 'Enregistrement', t('sosMicCamera') || 'Micro et caméra', true, 'sosOpenConfig(\'recording\')')}
            <!-- Emergency -->
            ${_configItem('phone-call', 'emerald', t('sosEmergencyCall') || 'Appel d\'urgence', `${detectedNumber} (${t('sosDetected') || 'détecté'})`, true, 'sosOpenConfig(\'emergency\')')}

            <!-- Config progress -->
            <div class="text-center py-2 px-4 bg-amber-500/[0.04] border border-amber-500/[0.08] rounded-lg mt-2">
              <div class="text-[13px] font-semibold text-amber-500">${configCount}/6 ${t('sosConfigured') || 'configurés'}</div>
              <div class="text-[11px] text-slate-500 mt-0.5">${t('sosConfigHint') || 'Appuie sur chaque élément pour le configurer'}</div>
            </div>

            <!-- Test -->
            <button onclick="sosOpenConfig('test')" class="w-full mt-2 flex items-center gap-3 p-3 bg-blue-500/[0.04] border border-blue-500/[0.08] rounded-lg transition-colors active:bg-blue-500/[0.08]" type="button">
              ${icon('play-circle', 'w-4 h-4 text-blue-400 shrink-0')}
              <div class="text-left">
                <div class="text-[13px] font-semibold text-blue-300">${t('sosTestSOS') || 'Tester le SOS'}</div>
                <div class="text-[11px] text-slate-500">${t('sosTestDesc') || 'Envoie une alerte test à un contact'}</div>
              </div>
            </button>
          </div>

        </div>
      </div>
    </div>

    <!-- Config sections are rendered inline in the config tab panel -->
  `
}

// ─── Alert tile helper ──────────────────────────────────────────────────────
function _alertTile(iconName, color, label, sub, onclick) {
  const colors = {
    amber: { bg: 'bg-amber-500/10', fg: 'text-amber-500' },
    emerald: { bg: 'bg-emerald-500/10', fg: 'text-emerald-500' },
    blue: { bg: 'bg-blue-500/10', fg: 'text-blue-500' },
    rose: { bg: 'bg-rose-500/10', fg: 'text-rose-500' },
    red: { bg: 'bg-red-500/10', fg: 'text-red-500' },
  }
  const c = colors[color] || colors.amber
  return `
    <button onclick="${onclick}" class="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-4 text-center flex flex-col items-center gap-2 transition-all active:scale-95 active:bg-white/[0.08]" type="button">
      <div class="w-11 h-11 rounded-full ${c.bg} flex items-center justify-center">
        ${icon(iconName, `w-5 h-5 ${c.fg}`)}
      </div>
      <div class="text-[13px] font-semibold text-slate-200">${label}</div>
      <div class="text-[10px] text-slate-500">${sub}</div>
    </button>
  `
}

// ─── Config checklist item helper ───────────────────────────────────────────
function _configItem(iconName, color, title, desc, isReady, onclick) {
  const colors = {
    amber: 'bg-amber-500/[0.08]', red: 'bg-red-500/[0.08]', blue: 'bg-blue-500/[0.08]',
    rose: 'bg-rose-500/[0.08]', emerald: 'bg-emerald-500/[0.08]',
  }
  const fgColors = {
    amber: 'text-amber-500', red: 'text-red-500', blue: 'text-blue-500',
    rose: 'text-rose-500', emerald: 'text-emerald-500',
  }
  return `
    <button onclick="${onclick}" class="w-full flex items-center gap-3 p-3 bg-white/[0.03] border border-white/[0.06] rounded-xl transition-colors active:bg-white/[0.06]" type="button">
      <div class="w-9 h-9 rounded-lg ${colors[color] || colors.amber} flex items-center justify-center shrink-0">
        ${icon(iconName, `w-4 h-4 ${fgColors[color] || fgColors.amber}`)}
      </div>
      <div class="flex-1 text-left min-w-0">
        <div class="text-[13px] font-semibold text-slate-200">${title}</div>
        <div class="text-[11px] text-slate-500 truncate">${desc}</div>
      </div>
      <div class="w-6 h-6 rounded-full ${isReady ? 'bg-emerald-500/[0.12]' : 'bg-red-500/[0.08]'} flex items-center justify-center shrink-0">
        ${icon(isReady ? 'check' : 'x', `w-3 h-3 ${isReady ? 'text-emerald-500' : 'text-red-500'}`)}
      </div>
    </button>
  `
}

// ─── Fake Call Overlay — V10 ─────────────────────────────────────────────────
function renderFakeCallOverlay() {
  const callerName = t('sosFakeCallerName') || 'Maman'
  return `
    <div
      id="sos-fake-call"
      class="fixed inset-0 z-[200] flex flex-col items-center justify-between
        bg-gradient-to-b from-slate-800 to-slate-900 p-8"
      role="dialog"
      aria-modal="true"
      aria-label="${t('sosFakeCallTitle') || 'Appel entrant simulé'}"
    >
      <!-- Caller info -->
      <div class="flex-1 flex flex-col items-center justify-center gap-5 w-full">
        <div class="w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center animate-pulse">
          ${icon('user', 'w-6 h-6 text-amber-500')}
        </div>
        <div class="text-center">
          <div class="text-2xl font-extrabold text-white mb-1">${escapeHTML(callerName)}</div>
          <div class="text-slate-500 text-sm" id="fake-call-status">${t('sosFakeCallIncoming') || 'Appel entrant...'}</div>
          <div class="flex items-center justify-center gap-1.5 mt-2 text-sm text-slate-400 hidden" id="fake-call-timer-row">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span id="fake-call-timer">0:00</span>
          </div>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="w-full max-w-xs mx-auto space-y-4">
        <div class="flex justify-center gap-8" id="fake-call-answer-row">
          <!-- Decline -->
          <button
            onclick="sosFakeCallDecline()"
            class="w-14 h-14 rounded-full bg-danger-500 flex items-center justify-center active:bg-danger-600 transition-colors"
            type="button"
            aria-label="${t('sosFakeCallDecline') || 'Raccrocher'}"
          >
            <span class="rotate-135 inline-flex">
              ${icon('phone', 'w-6 h-6 text-white')}
            </span>
          </button>
          <!-- Answer -->
          <button
            onclick="sosFakeCallAnswer()"
            class="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center active:bg-emerald-600 transition-colors"
            type="button"
            aria-label="${t('sosFakeCallAnswer') || 'Répondre'}"
          >
            ${icon('phone', 'w-6 h-6 text-white')}
          </button>
        </div>
        <!-- Hang up (shown after answering) -->
        <button
          onclick="sosFakeCallDecline()"
          id="fake-call-hangup"
          class="hidden w-14 h-14 rounded-full bg-danger-500 mx-auto items-center justify-center"
          type="button"
          aria-label="${t('sosFakeCallHangUp') || 'Raccrocher'}"
        >
          <span class="rotate-135 inline-flex">
            ${icon('phone', 'w-6 h-6 text-white')}
          </span>
        </button>
      </div>
    </div>
  `
}

// ─── Global handlers ─────────────────────────────────────────────────────────

// ── Triple SOS Alert: Push + SMS + Call in parallel ──────────────────────────
// When SOS is triggered, ALL channels fire simultaneously. No choice needed.
// Resilience: if one channel fails, the others continue.

/**
 * Get position (live or cached), then fire triple alert
 */
window.shareSOSLocation = async () => {
  const { getState, actions } = await import('../../stores/state.js')
  const { showSuccess, showError } = await import('../../services/notifications.js')
  const state = getState()

  if (state.sosActive) {
    actions.toggleSOS()
    showSuccess(t('positionShareStopped') || 'Partage de position arrêté')
    return
  }

  // Get position (live preferred, cached fallback)
  const pos = await _getSOSPosition()

  if (!pos) {
    showError(t('positionError') || 'Impossible de partager la position')
    return
  }

  LS.savePos(pos.lat, pos.lng)
  actions.toggleSOS()
  actions.setUserLocation({ lat: pos.lat, lng: pos.lng })

  // Write SOS alert to Firestore → triggers Cloud Function → push notifs to guardians
  _writeSOSAlertToFirestore(pos, 'alert')

  // Broadcast community alert to nearby opted-in users (position EXACTE)
  import('../../services/communityAlert.js').then(({ broadcastCommunitySOSAlert }) => {
    broadcastCommunitySOSAlert(pos, 'emergency')
  }).catch(() => {})

  // Fire triple alert: push + SMS + call — all in parallel
  _fireTripleAlert(pos.lat, pos.lng, state.emergencyContacts)
}

/**
 * Get current GPS position or fallback to cached position.
 * @returns {Promise<{lat: number, lng: number}|null>}
 */
async function _getSOSPosition() {
  // Offline → use cache
  if (!navigator.onLine) {
    const cached = LS.cachedPos()
    return cached ? { lat: cached.lat, lng: cached.lng } : null
  }

  if (!navigator.geolocation) {
    const cached = LS.cachedPos()
    return cached ? { lat: cached.lat, lng: cached.lng } : null
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({ lat: position.coords.latitude, lng: position.coords.longitude })
      },
      () => {
        // Fallback to cache
        const cached = LS.cachedPos()
        resolve(cached ? { lat: cached.lat, lng: cached.lng } : null)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  })
}

/**
 * Write SOS alert to Firestore to trigger server-side Cloud Function.
 * The Cloud Function sends push notifications to all guardians.
 */
async function _writeSOSAlertToFirestore(pos, type) {
  try {
    const { db, getCurrentUser } = await import('../../services/firebase.js')
    const { addDoc, collection, serverTimestamp } = await import('firebase/firestore')
    const user = getCurrentUser()
    if (!user || !db) return

    // Get guardian IDs from companion state or friends
    const companionRaw = localStorage.getItem('spothitch_companion')
    let guardianIds = []
    if (companionRaw) {
      try {
        const companion = JSON.parse(companionRaw)
        guardianIds = (companion.trustedContacts || [])
          .map(c => c.userId || c.uid)
          .filter(Boolean)
      } catch { /* ignore */ }
    }

    // Also check friends list as fallback
    if (guardianIds.length === 0) {
      const { getState } = await import('../../stores/state.js')
      const state = getState()
      guardianIds = (state.friends || []).slice(0, 5).map(f => f.id || f.uid).filter(Boolean)
    }

    if (guardianIds.length === 0) {
      console.warn('[SOS] No guardian IDs available for server-side alert')
      return
    }

    await addDoc(collection(db, 'sosAlerts'), {
      userId: user.uid,
      userName: user.displayName || 'Voyageur',
      guardianIds,
      position: pos ? { lat: pos.lat, lng: pos.lng } : null,
      type,
      createdAt: serverTimestamp(),
    })
    console.log(`[SOS] Alert written to Firestore (${type}), ${guardianIds.length} guardian(s)`)
  } catch (err) {
    console.warn('[SOS] Failed to write alert to Firestore:', err.message)
  }
}

/**
 * Fire triple alert: push notification + SMS + phone call — all in parallel.
 * Each channel is independent: if one fails, the others continue.
 * @param {number} lat
 * @param {number} lng
 * @param {Array<{name: string, phone: string}>} contacts
 */
function _fireTripleAlert(lat, lng, contacts) {
  const mapUrl = `https://www.google.com/maps?q=${lat},${lng}`
  const customMsg = LS.customMsg()
  const baseMsg = t('sosTripleAlertMsg') || 'SOS! I need help. Here is my position:'
  const fullMsg = customMsg ? `${customMsg}\n\n${baseMsg}\n${mapUrl}` : `${baseMsg}\n${mapUrl}`

  // Determine primary contact for the phone call
  const primaryIdx = LS.primaryContact()
  const primaryContact = (primaryIdx >= 0 && contacts[primaryIdx])
    ? contacts[primaryIdx]
    : contacts[0] || null

  // === CHANNEL 1: Push notification (in-app) ===
  const pushPromise = (async () => {
    try {
      const { sendLocalNotification } = await import('../../services/notifications.js')
      sendLocalNotification(
        t('sosTripleAlertTitle') || 'SOS SpotHitch',
        fullMsg,
        {
          type: 'sos_alert',
          tag: 'sos-triple-alert',
          requireInteraction: true,
          url: mapUrl,
        }
      )
    } catch (e) {
      console.error('SOS push notification failed:', e)
    }
  })()

  // === CHANNEL 2: SMS to all contacts ===
  const smsPromise = (async () => {
    try {
      if (!contacts || contacts.length === 0) return
      const encoded = encodeURIComponent(fullMsg)
      // Build SMS URI with all contact phones
      const phones = contacts
        .filter(c => c?.phone)
        .map(c => c.phone.replace(/[^0-9+]/g, ''))
      if (phones.length > 0) {
        // sms: URI with multiple recipients (comma-separated)
        const smsUri = `sms:${phones.join(',')}?body=${encoded}`
        window.open(smsUri, '_blank')
      }
    } catch (e) {
      console.error('SOS SMS failed:', e)
    }
  })()

  // === CHANNEL 3: Phone call to primary contact ===
  const callPromise = (async () => {
    try {
      if (!primaryContact?.phone) return
      const cleanPhone = primaryContact.phone.replace(/[^0-9+]/g, '')
      // Small delay to let SMS URI trigger first (browsers block simultaneous URI navigations)
      await new Promise(r => setTimeout(r, 500))
      // Use tel: link to ring the primary contact
      const callLink = document.createElement('a')
      callLink.href = `tel:${cleanPhone}`
      callLink.style.display = 'none'
      document.body.appendChild(callLink)
      callLink.click()
      callLink.remove()
    } catch (e) {
      console.error('SOS call failed:', e)
    }
  })()

  // All fire in parallel — we don't await the result, resilience is built-in
  Promise.allSettled([pushPromise, smsPromise, callPromise]).then(() => {
    window.showToast?.(t('sosTripleAlertSent') || 'SOS sent: notification + SMS + call', 'success')
  })
}

window.addEmergencyContact = async () => {
  const nameInput = document.getElementById('emergency-name')
  const phoneInput = document.getElementById('emergency-phone')
  const name = nameInput?.value?.trim()
  const phone = phoneInput?.value?.trim()

  if (!name || !phone) {
    const { showToast } = await import('../../services/notifications.js')
    showToast(t('fillNameAndNumber') || 'Remplis le nom et le numéro', 'warning')
    return
  }

  const digits = phone.replace(/\D/g, '')
  if (digits.length < 6) {
    const { showToast } = await import('../../services/notifications.js')
    showToast(t('invalidPhoneNumber') || 'Numéro de téléphone invalide', 'warning')
    return
  }

  const { actions } = await import('../../stores/state.js')
  actions.addEmergencyContact({ name, phone })
  if (nameInput) nameInput.value = ''
  if (phoneInput) phoneInput.value = ''

  const { showSuccess } = await import('../../services/notifications.js')
  showSuccess(t('contactAdded') || 'Contact ajouté !')
}

window.removeEmergencyContact = async (index) => {
  const { getState, setState } = await import('../../stores/state.js')
  const state = getState()
  const contacts = [...state.emergencyContacts]
  contacts.splice(index, 1)
  // Adjust primary contact index if needed
  const primary = LS.primaryContact()
  if (primary === index) localStorage.removeItem('spothitch_sos_primary')
  else if (primary > index) localStorage.setItem('spothitch_sos_primary', String(primary - 1))
  setState({ emergencyContacts: contacts })
}

window.markSafe = async () => {
  const { actions } = await import('../../stores/state.js')
  const { showSuccess } = await import('../../services/notifications.js')
  actions.toggleSOS()
  showSuccess(t('markedSafe') || 'Super ! Content que tu sois en sécurité')
}

window.acceptSOSDisclaimer = () => {
  localStorage.setItem('spothitch_sos_disclaimer_seen', '1')
  localStorage.setItem('spothitch_sos_intro_seen', '1')
  window._forceRender?.()
}

// ── v4b: Intro accept ────────────────────────────────────────────────────────
window.acceptSOSIntro = () => {
  localStorage.setItem('spothitch_sos_intro_seen', '1')
  // Also mark old disclaimer as seen for backward compat
  localStorage.setItem('spothitch_sos_disclaimer_seen', '1')
  window._forceRender?.()
}

// ── v4b: Tab switching ───────────────────────────────────────────────────────
window.sosTab = (index) => {
  document.querySelectorAll('.sos-tab').forEach((tab, i) => {
    tab.classList.toggle('text-amber-500', i === index)
    tab.classList.toggle('border-amber-500', i === index)
    tab.classList.toggle('text-slate-500', i !== index)
    tab.classList.toggle('border-transparent', i !== index)
  })
  document.querySelectorAll('.sos-panel').forEach((panel, i) => {
    panel.classList.toggle('hidden', i !== index)
  })
}

// ── v4b: Show record options panel ───────────────────────────────────────────
window.sosShowRecordOptions = () => {
  const panel = document.getElementById('sos-record-panel')
  if (panel) panel.classList.toggle('hidden')
}

// ── v4b: Broadcast community SOS ─────────────────────────────────────────────
window.sosBroadcastCommunity = async () => {
  const pos = await _getSOSPosition()
  if (!pos) {
    window.showToast?.(t('positionNotAvailable') || 'Position non disponible', 'error')
    return
  }
  LS.savePos(pos.lat, pos.lng)
  _writeSOSAlertToFirestore(pos, 'community')
  import('../../services/communityAlert.js').then(({ broadcastCommunitySOSAlert }) => {
    broadcastCommunitySOSAlert(pos, 'community')
  }).catch(() => {})
  window.showToast?.(t('sosCommunityAlertSent') || 'Alerte envoyée à la communauté', 'success')
}

// ── v4b: Config inline (replaces panel content instead of sidebar) ───────────
window.sosOpenConfig = (section) => {
  const panel = document.querySelector('[data-sos-panel="1"]')
  if (!panel) return

  // Save original content for "back" navigation
  if (!window._sosConfigOriginal) {
    window._sosConfigOriginal = panel.innerHTML
  }

  panel.innerHTML = `<div class="p-5">${_getConfigContent(section)}</div>`

  // Re-init icons
  if (window.lucide?.createIcons) window.lucide.createIcons()
}

window.sosCloseConfig = () => {
  const panel = document.querySelector('[data-sos-panel="1"]')
  if (!panel || !window._sosConfigOriginal) return

  panel.innerHTML = window._sosConfigOriginal
  window._sosConfigOriginal = null

  // Re-init icons
  if (window.lucide?.createIcons) window.lucide.createIcons()
}

function _getConfigContent(section) {
  const { getState } = window
  const state = getState ? getState() : {}
  const contacts = state.emergencyContacts || []
  const primaryIdx = LS.primaryContact()
  const fakeCallName = localStorage.getItem('spothitch_sos_fake_name') || t('sosFakeCallerName') || 'Maman'
  const fakeCallDelay = localStorage.getItem('spothitch_sos_fake_delay') || '30'
  const customMsg = LS.customMsg()
  const detectedNumber = getCountryEmergencyNumber()

  const backBtn = `<button onclick="sosCloseConfig()" class="flex items-center gap-1.5 text-[13px] font-semibold text-slate-400 mb-4 bg-transparent border-none cursor-pointer p-0">${icon('arrow-left', 'w-4 h-4')} ${t('back') || 'Retour'}</button>`
  const titleCls = 'text-base font-extrabold text-slate-200 mb-1'
  const descCls = 'text-[12px] text-slate-500 mb-4 leading-relaxed'
  const labelCls = 'text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 mt-4'

  switch (section) {
    case 'contacts':
      return `${backBtn}
        <div class="${titleCls}">${t('emergencyContacts') || 'Contacts d\'urgence'}</div>
        <div class="${descCls}">${t('sosContactsDesc') || 'Contacts SpotHitch (push) et contacts SMS (hors app).'}</div>
        <div class="${labelCls}">SpotHitch (push)</div>
        ${contacts.filter(c => c.type === 'app').map((c, i) => _renderConfigContact(c, i, primaryIdx)).join('') || ''}
        <div class="flex gap-1.5 mt-1.5 relative">
          <input type="text" id="sos-cfg-app-search" class="input-field flex-1 text-[12px] min-w-0" placeholder="${t('sosSearchUser') || 'Chercher un utilisateur SpotHitch...'}" oninput="sosSearchFriend(this.value)">
          <button onclick="addEmergencyContact()" class="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center shrink-0" type="button" aria-label="${t('addContact') || 'Ajouter un contact'}">${icon('plus', 'w-3.5 h-3.5 text-dark-primary')}</button>
          <div id="sos-friend-results" class="hidden absolute z-50 bg-dark-secondary border border-white/10 rounded-lg mt-1 max-h-40 overflow-y-auto w-full top-full left-0"></div>
        </div>
        <div class="${labelCls}">SMS (${t('sosExternalContacts') || 'hors app'})</div>
        ${contacts.filter(c => c.type !== 'app').map((c, i) => _renderConfigContact(c, i, primaryIdx)).join('') || contacts.map((c, i) => _renderConfigContact(c, i, primaryIdx)).join('')}
        <div class="flex gap-1.5 mt-1.5">
          <input type="text" id="emergency-name" class="input-field flex-1 text-[12px] min-w-0" placeholder="${t('contactName') || 'Nom'}">
          <input type="tel" id="emergency-phone" class="input-field flex-1 text-[12px] min-w-0" placeholder="${t('phonePlaceholder') || 'Téléphone'}">
          <button onclick="addEmergencyContact()" class="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center shrink-0" type="button" aria-label="${t('addContact') || 'Ajouter un contact'}">${icon('plus', 'w-3.5 h-3.5 text-dark-primary')}</button>
        </div>
        <div class="${labelCls}">${t('sosPrimaryContact') || 'Contact principal'} (${t('sosCalledFirst') || 'appelé en premier'})</div>
        <div class="flex gap-1.5 flex-wrap">
          ${contacts.map((c, i) => `<button onclick="sosSetPrimaryContact(${i});sosOpenConfig('contacts')" class="px-3 py-1.5 rounded-full text-[12px] font-medium border transition-colors ${i === primaryIdx ? 'bg-amber-500/[0.12] border-amber-500/30 text-amber-500' : 'bg-white/[0.04] border-white/[0.06] text-slate-400'}" type="button">${escapeHTML(c.name)}</button>`).join('') || `<span class="text-[12px] text-slate-500">${t('sosNoContacts') || 'Aucun contact'}</span>`}
        </div>`

    case 'fake':
      return `${backBtn}
        <div class="${titleCls}">${t('sosFakeCall') || 'Faux appel'}</div>
        <div class="${descCls}">${t('sosFakeCallConfigDesc') || 'Simule un appel entrant crédible pour avoir un prétexte de partir.'}</div>
        <div class="${labelCls}">${t('sosDisplayName') || 'Nom affiché'}</div>
        <input class="input-field w-full text-[13px]" value="${escapeHTML(fakeCallName)}" oninput="localStorage.setItem('spothitch_sos_fake_name',this.value)">
        <div class="${labelCls}">${t('sosDelay') || 'Délai'}</div>
        <div class="flex gap-1.5 flex-wrap">
          ${['0', '30', '60', '120', '300'].map(d => {
    const labels = { '0': t('sosDirect') || 'Direct', '30': '30 sec', '60': '1 min', '120': '2 min', '300': '5 min' }
    return `<button onclick="localStorage.setItem('spothitch_sos_fake_delay','${d}');sosOpenConfig('fake')" class="px-3 py-1.5 rounded-full text-[12px] font-medium border transition-colors ${fakeCallDelay === d ? 'bg-amber-500/[0.12] border-amber-500/30 text-amber-500' : 'bg-white/[0.04] border-white/[0.06] text-slate-400'}" type="button">${labels[d]}</button>`
  }).join('')}
        </div>
        <div class="${labelCls}">${t('sosSound') || 'Son'}</div>
        <div class="flex items-center justify-between py-2">
          <span class="text-[13px] flex items-center gap-1.5">${icon('volume-2', 'w-3 h-3 text-amber-500')} ${t('sosForceSoundVibration') || 'Forcer son + vibration'}</span>
          <div class="w-9 h-5 rounded-full bg-amber-500 relative cursor-pointer shrink-0"><span class="absolute w-3.5 h-3.5 rounded-full bg-white top-[3px] right-[3px]"></span></div>
        </div>
        <p class="text-[11px] text-slate-500 leading-relaxed mt-1">${t('sosSoundHint') || 'La vibration marche même en silencieux. Le son dépend des réglages du téléphone.'}</p>
        <div class="mt-4 p-3 bg-emerald-500/[0.04] border border-emerald-500/[0.08] rounded-lg">
          <div class="text-[13px] font-bold text-emerald-400 flex items-center gap-1.5 mb-1">${icon('play-circle', 'w-3.5 h-3.5')} ${t('sosTest') || 'Tester'}</div>
          <div class="text-[11px] text-slate-500 mb-2">${t('sosFakeCallTestDesc') || 'Lance un faux appel pour voir le résultat.'}</div>
          <button onclick="sosOpenFakeCall();sosCloseConfig()" class="w-full py-2 bg-emerald-500/10 border border-emerald-500/15 rounded-lg text-emerald-400 text-[12px] font-semibold flex items-center justify-center gap-1.5" type="button">${icon('phone-incoming', 'w-3.5 h-3.5')} ${t('sosLaunchTest') || 'Lancer un test'}</button>
        </div>`

    case 'message':
      return `${backBtn}
        <div class="${titleCls}">${t('sosAlertMessage') || 'Message d\'alerte'}</div>
        <div class="${descCls}">${t('sosMessageConfigDesc') || 'Ce message est envoyé avec ta position GPS quand tu appuies sur "Alerter".'}</div>
        <div class="${labelCls}">${t('sosYourMessage') || 'Ton message'}</div>
        <textarea id="sos-custom-msg" class="input-field w-full text-[13px] resize-none h-20" maxlength="200" placeholder="${t('sosCustomMsgPlaceholder') || 'Ex: Je suis en autostop et j\'ai besoin d\'aide...'}" oninput="sosUpdateCustomMsg(this.value)">${escapeHTML(customMsg)}</textarea>
        <p class="text-[11px] text-slate-500 mt-1">${t('sosMaxChars') || '200 caractères max. Position GPS toujours jointe.'}</p>
        <div class="${labelCls}">${t('sosChannels') || 'Canaux'}</div>
        <div class="space-y-1">
          <div class="flex items-center justify-between py-2"><span class="text-[13px] flex items-center gap-1.5">${icon('bell', 'w-3 h-3 text-amber-500')} Push (SpotHitch)</span><div class="w-9 h-5 rounded-full bg-amber-500 relative cursor-pointer shrink-0"><span class="absolute w-3.5 h-3.5 rounded-full bg-white top-[3px] right-[3px]"></span></div></div>
          <div class="flex items-center justify-between py-2"><span class="text-[13px] flex items-center gap-1.5">${icon('message-circle', 'w-3 h-3 text-amber-500')} SMS</span><div class="w-9 h-5 rounded-full bg-amber-500 relative cursor-pointer shrink-0"><span class="absolute w-3.5 h-3.5 rounded-full bg-white top-[3px] right-[3px]"></span></div></div>
          <div class="flex items-center justify-between py-2"><span class="text-[13px] flex items-center gap-1.5">${icon('phone', 'w-3 h-3 text-amber-500')} ${t('sosCallPrimary') || 'Appel au principal'}</span><div class="w-9 h-5 rounded-full bg-amber-500 relative cursor-pointer shrink-0"><span class="absolute w-3.5 h-3.5 rounded-full bg-white top-[3px] right-[3px]"></span></div></div>
        </div>
        <div class="mt-4 p-3 bg-emerald-500/[0.04] border border-emerald-500/[0.08] rounded-lg">
          <div class="text-[13px] font-bold text-emerald-400 flex items-center gap-1.5 mb-1">${icon('play-circle', 'w-3.5 h-3.5')} ${t('sosTestAlert') || 'Tester l\'alerte'}</div>
          <div class="text-[11px] text-slate-500 mb-2">${t('sosTestAlertDesc') || 'Envoie un test à un contact.'}</div>
          <button onclick="sosOpenConfig('test')" class="w-full py-2 bg-emerald-500/10 border border-emerald-500/15 rounded-lg text-emerald-400 text-[12px] font-semibold flex items-center justify-center gap-1.5" type="button">${icon('send', 'w-3.5 h-3.5')} Test → ${contacts[0] ? escapeHTML(contacts[0].name) : '...'}</button>
        </div>`

    case 'community':
      return `${backBtn}
        <div class="${titleCls}">${t('sosCommunity') || 'Communauté'}</div>
        <div class="${descCls}">${t('sosCommunityConfigDesc') || 'Les autostoppeurs SpotHitch proches reçoivent ta position quand tu actives le SOS.'}</div>
        <div class="flex items-center justify-between py-2"><span class="text-[13px] flex items-center gap-1.5">${icon('radio', 'w-3 h-3 text-blue-500')} ${t('sosSendToCommunity') || 'Envoyer à la communauté'}</span><div onclick="toggleCommunityAlerts()" role="switch" tabindex="0" aria-checked="${getCommunityAlertSettings().receiveAlerts}" aria-label="${t('sosSendToCommunity') || 'Envoyer à la communauté'}" class="w-9 h-5 rounded-full ${getCommunityAlertSettings().receiveAlerts ? 'bg-amber-500' : 'bg-white/10'} relative cursor-pointer shrink-0"><span class="absolute w-3.5 h-3.5 rounded-full bg-white top-[3px] ${getCommunityAlertSettings().receiveAlerts ? 'right-[3px]' : 'left-[3px]'}"></span></div></div>
        <div class="${labelCls}">${t('sosRadius') || 'Rayon'}</div>
        <div class="flex gap-1.5 flex-wrap">
          ${[5, 10, 25, 50].map(r => `<button onclick="setCommunityRadius('broadcastRadius',${r});sosOpenConfig('community')" class="px-3 py-1.5 rounded-full text-[12px] font-medium border transition-colors ${(getCommunityAlertSettings().broadcastRadius || 10) === r ? 'bg-amber-500/[0.12] border-amber-500/30 text-amber-500' : 'bg-white/[0.04] border-white/[0.06] text-slate-400'}" type="button">${r} km</button>`).join('')}
        </div>
        <div class="mt-4 p-3 bg-blue-500/[0.04] border border-blue-500/[0.08] rounded-lg">
          <div class="flex items-center justify-between py-1"><span class="text-[13px] flex items-center gap-1.5">${icon('heart', 'w-3 h-3 text-blue-400')} ${t('sosReceiveAlerts') || 'Recevoir les alertes des autres'}</span><div onclick="toggleCommunityAlerts()" role="switch" tabindex="0" aria-checked="${getCommunityAlertSettings().receiveAlerts}" aria-label="${t('sosReceiveAlerts') || 'Recevoir les alertes'}" class="w-9 h-5 rounded-full ${getCommunityAlertSettings().receiveAlerts ? 'bg-amber-500' : 'bg-white/10'} relative cursor-pointer shrink-0"><span class="absolute w-3.5 h-3.5 rounded-full bg-white top-[3px] ${getCommunityAlertSettings().receiveAlerts ? 'right-[3px]' : 'left-[3px]'}"></span></div></div>
          <p class="text-[11px] text-slate-500 mt-1 leading-relaxed">${t('sosReceiveAlertsHint') || 'Sois notifié si un autostoppeur proche a besoin d\'aide.'}</p>
        </div>`

    case 'recording':
      return `${backBtn}
        <div class="${titleCls}">${t('sosRecording') || 'Enregistrement'}</div>
        <div class="${descCls}">${t('sosRecordingConfigDesc') || 'Autorise le micro et la caméra maintenant. En urgence, tu n\'auras pas le temps.'}</div>
        <button onclick="sosRequestPermission('audio')" class="w-full flex items-center gap-3 p-3 bg-white/[0.04] border border-white/[0.06] rounded-lg mb-1.5" type="button">
          ${icon('mic', 'w-3.5 h-3.5 text-rose-400')}
          <span class="flex-1 text-[13px]">${t('sosMicrophone') || 'Microphone'}</span>
          <span class="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/[0.12] text-amber-500">${t('sosAuthorize') || 'Autoriser'}</span>
        </button>
        <button onclick="sosRequestPermission('video')" class="w-full flex items-center gap-3 p-3 bg-white/[0.04] border border-white/[0.06] rounded-lg mb-1.5" type="button">
          ${icon('video', 'w-3.5 h-3.5 text-rose-400')}
          <span class="flex-1 text-[13px]">${t('sosCamera') || 'Caméra'}</span>
          <span class="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/[0.12] text-amber-500">${t('sosAuthorize') || 'Autoriser'}</span>
        </button>
        <div class="${labelCls}">${t('sosMaxDuration') || 'Durée max'}</div>
        <div class="flex gap-1.5 flex-wrap">
          ${['2', '5', '10', '30'].map(d => {
    const saved = localStorage.getItem('spothitch_sos_rec_duration') || '5'
    return `<button onclick="localStorage.setItem('spothitch_sos_rec_duration','${d}');sosOpenConfig('recording')" class="px-3 py-1.5 rounded-full text-[12px] font-medium border ${saved === d ? 'bg-amber-500/[0.12] border-amber-500/30 text-amber-500' : 'bg-white/[0.04] border-white/[0.06] text-slate-400'}" type="button">${d} min</button>`
  }).join('')}
        </div>`

    case 'emergency':
      return `${backBtn}
        <div class="${titleCls}">${t('sosEmergencyCall') || 'Appel d\'urgence'}</div>
        <div class="${descCls}">${t('sosEmergencyConfigDesc') || 'Détecté automatiquement selon ton pays.'}</div>
        <div class="flex items-center gap-3 p-3 bg-emerald-500/[0.06] border border-emerald-500/10 rounded-lg">
          ${icon('phone-call', 'w-5 h-5 text-emerald-500')}
          <div><div class="text-xl font-extrabold">${detectedNumber}</div><div class="text-[11px] text-slate-500">Europe (${t('sosAutoDetected') || 'détecté automatiquement'})</div></div>
        </div>
        <div class="${labelCls}" style="margin-top:1rem">${t('sosOtherNumbers') || 'Autres numéros'}</div>
        <div class="flex gap-1.5 flex-wrap">
          <a href="tel:911" class="px-3 py-1.5 rounded-full text-[12px] font-medium bg-white/[0.04] border border-white/[0.06] text-slate-400 no-underline">911 USA</a>
          <a href="tel:000" class="px-3 py-1.5 rounded-full text-[12px] font-medium bg-white/[0.04] border border-white/[0.06] text-slate-400 no-underline">000 AUS</a>
          <a href="tel:111" class="px-3 py-1.5 rounded-full text-[12px] font-medium bg-white/[0.04] border border-white/[0.06] text-slate-400 no-underline">111 NZ</a>
        </div>
        <p class="text-[11px] text-slate-500 mt-3 leading-relaxed">${t('sosNumberChanges') || 'Le numéro change automatiquement quand tu voyages dans un autre pays.'}</p>`

    case 'test':
      return `${backBtn}
        <div class="${titleCls}">${t('sosTestSOS') || 'Tester le SOS'}</div>
        <div class="${descCls}">${t('sosTestSOSDesc') || 'Envoie une alerte test. Le message indiquera clairement que c\'est un test.'}</div>
        <div class="${labelCls}">${t('sosChooseContact') || 'Choisir un contact'}</div>
        ${contacts.map((c) => `
          <button onclick="this.style.borderColor='#f59e0b'" class="w-full flex items-center gap-3 p-3 bg-white/[0.03] border border-white/[0.06] rounded-lg mb-1.5 transition-colors" type="button">
            <div class="w-7 h-7 rounded-full ${c.type === 'app' ? 'bg-gradient-to-br from-amber-500 to-amber-700' : 'bg-gradient-to-br from-blue-500 to-blue-700'} flex items-center justify-center text-[10px] font-bold text-white shrink-0">${escapeHTML(c.name.substring(0, 2).toUpperCase())}</div>
            <div class="flex-1 text-left"><div class="text-[13px] font-semibold">${escapeHTML(c.name)}</div><div class="text-[11px] text-slate-500">${c.type === 'app' ? 'Push' : 'SMS'}</div></div>
          </button>
        `).join('') || `<p class="text-[12px] text-slate-500">${t('sosNoContacts') || 'Aucun contact'}</p>`}
        <div class="${labelCls}" style="margin-top:1rem">${t('sosTestPreview') || 'Aperçu'}</div>
        <div class="p-3 bg-white/[0.03] border border-white/[0.06] rounded-lg text-[12px] text-slate-400 leading-relaxed">
          <strong class="text-amber-500">[TEST]</strong> ${t('sosTestMessage') || 'Ceci est un test du SOS SpotHitch. Aucune urgence.'}
        </div>
        <button class="w-full mt-3 py-2.5 bg-emerald-500/10 border border-emerald-500/15 rounded-lg text-emerald-400 text-[13px] font-semibold flex items-center justify-center gap-2" type="button">
          ${icon('send', 'w-3.5 h-3.5')} ${t('sosSendTest') || 'Envoyer le test'}
        </button>
        <p class="text-[11px] text-slate-500 text-center mt-2">${t('sosTestClarification') || 'Le contact recevra un message clairement identifié comme test.'}</p>`

    default:
      return `${backBtn}<p class="text-slate-500">Section inconnue</p>`
  }
}

function _renderConfigContact(contact, index, primaryIdx) {
  return `
    <div class="flex items-center gap-2.5 py-2 px-2 bg-white/[0.02] rounded-lg mb-1">
      <div class="w-7 h-7 rounded-full ${contact.type === 'app' ? 'bg-gradient-to-br from-amber-500 to-amber-700' : 'bg-gradient-to-br from-blue-500 to-blue-700'} flex items-center justify-center text-[10px] font-bold text-white shrink-0">${escapeHTML(contact.name.substring(0, 2).toUpperCase())}</div>
      <div class="flex-1 min-w-0">
        <div class="text-[12px] font-semibold text-slate-200 truncate">${escapeHTML(contact.name)}</div>
        <div class="text-[10px] text-slate-500 truncate">${escapeHTML(contact.phone || contact.username || '')}</div>
      </div>
      ${index === primaryIdx ? `<span class="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-500/[0.12] text-emerald-500 shrink-0">${t('sosPrimaryContact') || 'Principal'}</span>` : ''}
      <button onclick="removeEmergencyContact(${index})" class="w-6 h-6 flex items-center justify-center shrink-0" type="button" aria-label="${t('removeContact') || 'Supprimer le contact'}">${icon('trash-2', 'w-3 h-3 text-slate-500')}</button>
    </div>
  `
}

window.sendSOSTemplate = async (type) => {
  const templates = {
    danger: t('sosTemplateDanger') || "🚨 URGENCE. Je suis en danger et j'ai besoin d'aide immédiatement !",
    stuck: t('sosTemplateStuck') || "📍 Je suis bloqué(e) en auto-stop et j'ai besoin qu'on vienne me chercher.",
    help: t('sosTemplateHelp') || "🆘 J'ai besoin d'aide. Voici ma position actuelle.",
  }

  // Get position
  const pos = await _getSOSPosition()
  if (!pos) {
    window.showToast?.(t('positionNotAvailable') || 'Position non disponible', 'error')
    return
  }

  LS.savePos(pos.lat, pos.lng)

  // Override custom message with the template text
  const origCustom = LS.customMsg()
  const templateText = templates[type] || templates.help
  const combined = origCustom ? `${origCustom}\n\n${templateText}` : templateText
  localStorage.setItem('spothitch_sos_custom_msg', combined.slice(0, 200))

  // Fire triple alert with template
  const { getState } = await import('../../stores/state.js')
  _fireTripleAlert(pos.lat, pos.lng, getState().emergencyContacts)

  // Restore original custom message
  if (origCustom) {
    localStorage.setItem('spothitch_sos_custom_msg', origCustom)
  } else {
    localStorage.removeItem('spothitch_sos_custom_msg')
  }
}

// ── New handlers ─────────────────────────────────────────────────────────────

// Silent alarm toggle
window.sosToggleSilent = async () => {
  const current = LS.silent()
  localStorage.setItem('spothitch_sos_silent', current ? '0' : '1')
  // If activating silent mode, send silent alert to guardians + community
  if (!current) {
    const pos = await _getSOSPosition()
    if (pos) {
      _writeSOSAlertToFirestore(pos, 'silent')
      import('../../services/communityAlert.js').then(({ broadcastCommunitySOSAlert }) => {
        broadcastCommunitySOSAlert(pos, 'silent')
      }).catch(() => {})
    }
  }
  window.setState?.({})
}

// Custom message persistence
window.sosUpdateCustomMsg = (value) => {
  localStorage.setItem('spothitch_sos_custom_msg', value.slice(0, 200))
}

// ── Community Alert handlers ────────────────────────────────────────────────
window.toggleCommunityAlerts = async () => {
  const { getCommunityAlertSettings, saveCommunityAlertSettings, startPositionSharing, stopPositionSharing } = await import('../../services/communityAlert.js')
  const settings = getCommunityAlertSettings()
  const newState = !settings.receiveAlerts
  saveCommunityAlertSettings({ receiveAlerts: newState })
  if (newState) {
    startPositionSharing()
  } else {
    stopPositionSharing()
  }
  window.setState?.({})
}

window.setCommunityRadius = async (key, value) => {
  const { saveCommunityAlertSettings } = await import('../../services/communityAlert.js')
  saveCommunityAlertSettings({ [key]: value })
  window.setState?.({})
}

window.setCommunityGenderFilter = async (value) => {
  const { saveCommunityAlertSettings } = await import('../../services/communityAlert.js')
  saveCommunityAlertSettings({ genderFilter: value })
  window.setState?.({})
}

// Primary contact
window.sosSetPrimaryContact = (index) => {
  const current = LS.primaryContact()
  if (current === index) {
    localStorage.removeItem('spothitch_sos_primary')
  } else {
    localStorage.setItem('spothitch_sos_primary', String(index))
  }
  window.setState?.({})
}

// ── Friend search for emergency contacts ─────────────────────────────────────
window.sosSearchFriend = async (query) => {
  if (!query || query.length < 2) {
    document.getElementById('sos-friend-results')?.classList.add('hidden')
    return
  }

  // Search local friends first
  const state = window.getState?.() || {}
  const friends = state.friends || []
  const results = friends.filter(f =>
    (f.displayName || f.username || '').toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5)

  // Show results
  const container = document.getElementById('sos-friend-results')
  if (!container) return
  if (results.length === 0) {
    container.innerHTML = `<div class="p-2 text-xs text-slate-500">${t('noResults') || 'Aucun resultat'}</div>`
    container.classList.remove('hidden')
    return
  }
  container.innerHTML = results.map(f => `
    <button onclick="sosAddFriendAsContact('${escapeJSString(f.uid || '')}', '${escapeJSString(f.displayName || f.username || '')}')"
      type="button" class="w-full text-left px-3 py-2 hover:bg-white/10 text-sm flex items-center gap-2">
      <span>${escapeHTML(f.displayName || f.username || 'Ami')}</span>
    </button>
  `).join('')
  container.classList.remove('hidden')
}

window.sosAddFriendAsContact = (uid, name) => {
  const state = window.getState?.() || {}
  const contacts = [...(state.emergencyContacts || [])]
  // Don't add duplicates
  if (contacts.some(c => c.uid === uid || c.name === name)) {
    import('../../services/notifications.js').then(n => n.showToast(t('contactAlreadyAdded') || 'Contact deja ajoute', 'info'))
    return
  }
  contacts.push({ name, uid, phone: '', fromApp: true })
  window.setState?.({ emergencyContacts: contacts })
  document.getElementById('sos-friend-results')?.classList.add('hidden')
  const searchInput = document.getElementById('sos-cfg-app-search')
  if (searchInput) searchInput.value = ''
  import('../../services/notifications.js').then(n => n.showToast(name + ' ' + (t('addedAsContact') || 'ajoute comme contact d\'urgence'), 'success'))
  // Re-render config
  window.sosOpenConfig?.('contacts')
}

// ── Fake Call ─────────────────────────────────────────────────────────────────
let _fakeCallTimer = null
let _fakeCallSeconds = 0

window.sosOpenFakeCall = () => {
  // Remove existing overlay if any
  document.getElementById('sos-fake-call')?.remove()
  const overlay = document.createElement('div')
  overlay.innerHTML = renderFakeCallOverlay()
  document.body.appendChild(overlay.firstElementChild)

  // Vibrate like an incoming call (if supported)
  if (navigator.vibrate) {
    navigator.vibrate([500, 300, 500, 300, 500])
  }
}

window.sosFakeCallAnswer = () => {
  const statusEl = document.getElementById('fake-call-status')
  const timerEl = document.getElementById('fake-call-timer')
  const timerRow = document.getElementById('fake-call-timer-row')
  const answerRow = document.getElementById('fake-call-answer-row')
  const hangupBtn = document.getElementById('fake-call-hangup')

  if (statusEl) statusEl.textContent = t('sosFakeCallConnected') || 'En communication...'
  if (timerRow) timerRow.classList.remove('hidden')
  if (timerEl) timerEl.classList.remove('hidden')
  if (answerRow) answerRow.classList.add('hidden')
  if (hangupBtn) hangupBtn.classList.remove('hidden')
  hangupBtn?.classList.add('flex')

  if (navigator.vibrate) navigator.vibrate(0) // stop vibration

  _fakeCallSeconds = 0
  _fakeCallTimer = setInterval(() => {
    _fakeCallSeconds++
    const m = Math.floor(_fakeCallSeconds / 60)
    const s = String(_fakeCallSeconds % 60).padStart(2, '0')
    if (timerEl) timerEl.textContent = `${m}:${s}`
  }, 1000)
}

window.sosFakeCallDecline = () => {
  if (_fakeCallTimer) {
    clearInterval(_fakeCallTimer)
    _fakeCallTimer = null
  }
  if (navigator.vibrate) navigator.vibrate(0)
  document.getElementById('sos-fake-call')?.remove()
}

// ── Permission pre-request (no recording, just ask for permission) ────────────
window.sosRequestPermission = async (type) => {
  try {
    const constraints = type === 'video' ? { audio: true, video: true } : { audio: true }
    const stream = await navigator.mediaDevices.getUserMedia(constraints)
    stream.getTracks().forEach(tr => tr.stop()) // Release immediately
    import('../../services/notifications.js').then(n => n.showToast(
      t('permissionGranted') || 'Permission accordee', 'success'
    ))
  } catch {
    import('../../services/notifications.js').then(n => n.showToast(
      t('permissionDenied') || 'Permission refusee', 'error'
    ))
  }
}

// ── Audio/Video Recording ─────────────────────────────────────────────────────
let _mediaRecorder = null
let _recordingChunks = []

window.sosStartRecording = async (mode) => {
  const { showToast } = await import('../../services/notifications.js')

  if (_mediaRecorder && _mediaRecorder.state !== 'inactive') {
    showToast(t('sosAlreadyRecording') || 'Enregistrement déjà en cours', 'warning')
    return
  }

  try {
    const constraints = mode === 'video'
      ? { video: true, audio: true }
      : { audio: true }

    const stream = await navigator.mediaDevices.getUserMedia(constraints)
    _recordingChunks = []
    _mediaRecorder = new MediaRecorder(stream)

    _mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) _recordingChunks.push(e.data)
    }

    _mediaRecorder.onstop = () => {
      stream.getTracks().forEach((track) => track.stop())
      const mimeType = mode === 'video' ? 'video/webm' : 'audio/webm'
      const blob = new Blob(_recordingChunks, { type: mimeType })
      const url = URL.createObjectURL(blob)

      const resultEl = document.getElementById('sos-rec-result')
      if (resultEl) {
        resultEl.classList.remove('hidden')
        const ext = mode === 'video' ? 'webm' : 'webm'
        resultEl.innerHTML = `
          <a href="${url}" download="sos-evidence.${ext}"
            class="text-primary-400 underline">
            ${icon('download', 'w-3 h-3 inline-block mr-1')}${t('sosDownloadRecording') || 'Télécharger l\'enregistrement'}
          </a>
        `
      }

      // Update UI
      const recIndicator = document.getElementById('sos-rec-indicator')
      const stopBtn = document.getElementById('sos-rec-stop-btn')
      const audioBtn = document.getElementById('sos-rec-audio-btn')
      const videoBtn = document.getElementById('sos-rec-video-btn')
      if (recIndicator) recIndicator.classList.add('hidden')
      if (stopBtn) stopBtn.classList.add('hidden')
      if (audioBtn) audioBtn.removeAttribute('disabled')
      if (videoBtn) videoBtn.removeAttribute('disabled')
    }

    _mediaRecorder.start()

    // Auto-stop after configured max duration
    const maxMinutes = parseInt(localStorage.getItem('spothitch_sos_rec_duration') || '5', 10)
    window._sosRecordingTimer = setTimeout(() => {
      window.sosStopRecording?.()
    }, maxMinutes * 60 * 1000)

    // Update UI to show recording state
    const recIndicator = document.getElementById('sos-rec-indicator')
    const stopBtn = document.getElementById('sos-rec-stop-btn')
    const audioBtn = document.getElementById('sos-rec-audio-btn')
    const videoBtn = document.getElementById('sos-rec-video-btn')
    if (recIndicator) recIndicator.classList.remove('hidden')
    if (recIndicator) recIndicator.style.display = 'flex'
    if (stopBtn) stopBtn.classList.remove('hidden')
    if (audioBtn) audioBtn.setAttribute('disabled', 'true')
    if (videoBtn) videoBtn.setAttribute('disabled', 'true')

  } catch (err) {
    console.error('Recording error:', err)
    showToast(t('sosRecordingError') || 'Impossible d\'accéder au microphone/caméra', 'error')
  }
}

window.sosStopRecording = () => {
  clearTimeout(window._sosRecordingTimer)
  if (_mediaRecorder && _mediaRecorder.state !== 'inactive') {
    _mediaRecorder.stop()
  }
}

export default { renderSOS }
