/**
 * SOS Modal Component
 * Emergency mode for sharing location with extended safety features:
 * - SMS alert to emergency contacts
 * - Offline mode with cached position
 * - Auto-call with country detection
 * - Silent alarm mode
 * - Fake call UI
 * - Audio/video recording evidence
 * - Primary contact (starred)
 * - Customizable alert message
 */

import { t } from '../../i18n/index.js'
import { icon } from '../../utils/icons.js'
import { escapeHTML } from '../../utils/sanitize.js'
import { renderCommunityAlertSettings } from '../../services/communityAlert.js'

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
  const disclaimerSeen = typeof localStorage !== 'undefined' && localStorage.getItem('spothitch_sos_disclaimer_seen')
  if (!disclaimerSeen) return renderSOSDisclaimer()
  return renderSOSMain(state)
}

// ─── Disclaimer ─────────────────────────────────────────────────────────────
function renderSOSDisclaimer() {
  return `
    <div
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      onclick="closeSOS()"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="sos-disclaimer-title"
     tabindex="0">
      <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" aria-hidden="true"></div>
      <div
        class="relative bg-dark-primary border-2 border-amber-500/30 rounded-3xl w-full max-w-md slide-up"
        onclick="event.stopPropagation()"
      >
        <div class="p-8 text-center">
          <div class="w-14 h-14 rounded-full bg-amber-500/10 border-2 border-amber-500/20 flex items-center justify-center mx-auto mb-4">
            ${icon('triangle-alert', 'w-7 h-7 text-amber-400')}
          </div>
          <h2 id="sos-disclaimer-title" class="text-xl font-extrabold text-slate-200 mb-2">
            ${t('sosDisclaimerTitle') || 'Important : SOS'}
          </h2>
          <div class="text-sm text-slate-400 text-left space-y-3 mb-6 leading-relaxed">
            <p>${t('sosDisclaimerText1') || 'SpotHitch does NOT replace emergency services.'}</p>
            <p>${t('sosDisclaimerText2') || 'The SOS feature helps you share your location with your trusted contacts but cannot guarantee help will arrive.'}</p>
            <p>${t('sosDisclaimerText3') || 'In case of real emergency, always call your local emergency number (112 in Europe, 911 in USA/Canada).'}</p>
          </div>
          <button
            onclick="acceptSOSDisclaimer()"
            class="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-dark-primary font-bold text-base transition-colors"
          >
            ${t('sosDisclaimerAccept') || 'I understand, continue'}
          </button>
        </div>
        <button
          onclick="closeSOS()"
          class="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
          aria-label="${t('close') || 'Close'}"
        >
          ${icon('x', 'w-5 h-5')}
        </button>
      </div>
    </div>
  `
}

// ─── Main SOS Modal — V10 Quick Actions Grid ────────────────────────────────
function renderSOSMain(state) {
  const isSilent = LS.silent()
  const customMsg = LS.customMsg()
  const primaryIdx = LS.primaryContact()
  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true
  const cachedPos = LS.cachedPos()
  const detectedNumber = getCountryEmergencyNumber()

  // Count active actions for the active panel badge
  const activeCount = [state.sosActive, isSilent].filter(Boolean).length

  return `
    <div
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      onclick="closeSOS()"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="sos-modal-title"
      aria-describedby="sos-modal-desc"
     tabindex="0">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" aria-hidden="true"></div>

      <!-- Modal -->
      <div
        class="relative bg-dark-primary border border-white/5 rounded-3xl
          w-full max-w-md max-h-[90vh] overflow-y-auto slide-up"
        onclick="event.stopPropagation()"
      >
        <!-- Header -->
        <div class="pt-8 pb-4 px-6 text-center">
          <div class="w-12 h-12 rounded-full bg-danger-500/10 border-2 border-danger-500/20 flex items-center justify-center mx-auto mb-3" aria-hidden="true">
            ${icon('shield', 'w-6 h-6 text-danger-400')}
          </div>
          <h2 id="sos-modal-title" class="text-xl font-extrabold text-slate-200">${t('sosTitle')}</h2>
          <p id="sos-modal-desc" class="text-sm text-slate-500 mt-1">${t('sosDesc')}</p>

          ${!isOnline ? `
            <div class="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium" role="alert">
              ${icon('wifi-off', 'w-3 h-3')}
              ${t('sosOfflineMode') || 'Mode hors ligne'}
              ${cachedPos ? `· ${t('sosUsingCachedPos') || 'position en cache'}` : `· ${t('sosNoCachedPos') || 'aucune position en cache'}`}
            </div>
          ` : ''}
        </div>

        <!-- Content -->
        <div class="px-5 pb-6 space-y-4">

          <!-- ── 2x2 Quick Actions Grid ── -->
          <div class="grid grid-cols-2 gap-3">
            <!-- Tile 1: Fake Call -->
            <button
              onclick="sosOpenFakeCall()"
              class="bg-dark-secondary rounded-2xl p-5 text-center flex flex-col items-center gap-3 border-2 border-white/5 hover:border-amber-500/30 hover:bg-amber-500/5 transition-all min-h-[140px] justify-center"
              type="button"
              title="${t('sosFakeCallTitle') || 'Simuler un appel entrant'}"
            >
              <div class="w-13 h-13 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                ${icon('phone', 'w-6 h-6 text-amber-500')}
              </div>
              <div>
                <div class="text-sm font-bold text-slate-200">${t('sosFakeCall') || 'Faux appel'}</div>
                <div class="text-xs text-slate-500 mt-0.5 leading-tight">${t('sosFakeCallDesc') || 'Simuler un appel'}</div>
              </div>
            </button>

            <!-- Tile 2: Silent Alert -->
            <button
              onclick="sosToggleSilent()"
              class="bg-dark-secondary rounded-2xl p-5 text-center flex flex-col items-center gap-3 border-2 transition-all min-h-[140px] justify-center ${isSilent ? 'border-amber-500/40 bg-amber-500/5' : 'border-white/5 hover:border-amber-500/30 hover:bg-amber-500/5'}"
              type="button"
              aria-pressed="${isSilent}"
              title="${t('sosSilentModeTitle') || 'Mode alarme silencieuse'}"
            >
              <div class="w-13 h-13 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                ${icon('eye-off', 'w-6 h-6 text-amber-500')}
              </div>
              <div>
                <div class="text-sm font-bold text-slate-200">${t('sosSilentMode') || 'Alarme silencieuse'}</div>
                <div class="text-xs mt-0.5 leading-tight ${isSilent ? 'text-emerald-400' : 'text-slate-500'}">
                  ${isSilent ? (t('sosSilentOn') || 'Activé') : (t('sosSilentOff') || 'Désactivé')}
                </div>
              </div>
            </button>

            <!-- Tile 3: Alert Guardians -->
            <button
              onclick="shareSOSLocation()"
              class="bg-dark-secondary rounded-2xl p-5 text-center flex flex-col items-center gap-3 border-2 transition-all min-h-[140px] justify-center ${state.sosActive ? 'border-danger-500/40 bg-danger-500/5' : 'border-white/5 hover:border-danger-500/30 hover:bg-danger-500/5'}"
              id="sos-share-btn"
              type="button"
              aria-pressed="${state.sosActive ? 'true' : 'false'}"
              aria-describedby="sos-status"
            >
              <div class="w-13 h-13 rounded-2xl bg-danger-500/10 flex items-center justify-center">
                ${icon(state.sosActive ? 'circle-stop' : 'shield', 'w-6 h-6 text-danger-400')}
              </div>
              <div>
                <div class="text-sm font-bold text-slate-200">${state.sosActive ? (t('stopSharing') || 'Stop') : (t('sosAlertGuardians') || 'Alerter gardiens')}</div>
                <div class="text-xs mt-0.5 leading-tight ${state.sosActive ? 'text-danger-400' : 'text-slate-500'}">
                  ${state.sosActive ? (t('positionSharedLive') || 'Position en direct') : (t('sosAlertGuardiansDesc') || 'Position + alerte')}
                </div>
              </div>
            </button>

            <!-- Tile 4: Emergency call -->
            <a
              href="tel:${detectedNumber}"
              class="bg-dark-secondary rounded-2xl p-5 text-center flex flex-col items-center gap-3 border-2 border-white/5 hover:border-red-700/40 hover:bg-red-700/5 transition-all min-h-[140px] justify-center no-underline"
              aria-label="${t('sosAutoCallLabel') || 'Appeler les secours'} (${detectedNumber})"
            >
              <div class="w-13 h-13 rounded-2xl bg-red-700/15 flex items-center justify-center">
                ${icon('triangle-alert', 'w-6 h-6 text-red-500')}
              </div>
              <div>
                <div class="text-sm font-bold text-slate-200">${t('sosEmergency') || 'Urgence'} ${detectedNumber}</div>
                <div class="text-xs text-slate-500 mt-0.5 leading-tight">${t('sosEmergencyDesc') || 'Alerte maximale + secours'}</div>
              </div>
            </a>
          </div>

          <!-- SOS active status -->
          ${state.sosActive ? `
            <div class="bg-danger-500/10 border border-danger-500/20 rounded-2xl p-4" role="alert" aria-live="assertive" id="sos-status">
              <div class="flex items-center gap-3">
                <div class="live-dot" aria-hidden="true"></div>
                <span class="text-sm font-bold text-danger-400">${t('positionSharedLive') || 'Position partagée en direct'}</span>
              </div>
              <p class="text-xs text-slate-400 mt-2 leading-relaxed">
                ${t('contactsCanSeePosition') || 'Tes contacts de confiance peuvent voir ta position en temps réel.'}
              </p>
            </div>
          ` : `<div id="sos-status" class="sr-only">${t('positionShareInactive') || 'Partage de position non actif'}</div>`}

          <!-- ── Active Actions Panel ── -->
          ${(state.sosActive || isSilent) ? `
            <div class="bg-dark-secondary rounded-2xl p-4 border border-white/5">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2 text-sm font-bold text-slate-200">
                  ${icon('shield', 'w-4 h-4 text-amber-500')}
                  ${t('sosActiveActions') || 'Actions actives'}
                </div>
                <span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-danger-500/15 text-danger-400">
                  ${activeCount} ${activeCount > 1 ? (t('sosActives') || 'actives') : (t('sosActiveOne') || 'active')}
                </span>
              </div>

              ${isSilent ? `
                <div class="flex items-center gap-3 py-3 border-b border-white/5">
                  <div class="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                    ${icon('eye-off', 'w-4 h-4 text-amber-500')}
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-semibold text-slate-200">${t('sosSilentMode') || 'Alarme silencieuse'}</div>
                    <div class="text-xs text-emerald-400">${t('sosActiveStatus') || 'En cours'}</div>
                  </div>
                  <button onclick="sosToggleSilent()" class="w-11 h-6 rounded-full bg-emerald-500 relative transition-colors shrink-0" type="button" aria-pressed="true" aria-label="${t('sosSilentMode') || 'Alarme silencieuse'}">
                    <span class="absolute w-4 h-4 rounded-full bg-white top-1 right-1 transition-transform" aria-hidden="true"></span>
                  </button>
                </div>
              ` : ''}

              ${state.sosActive ? `
                <div class="flex items-center gap-3 py-3">
                  <div class="w-9 h-9 rounded-xl bg-danger-500/10 flex items-center justify-center shrink-0">
                    ${icon('map-pin', 'w-4 h-4 text-danger-400')}
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-semibold text-slate-200">${t('sosPositionSharing') || 'Partage de position'}</div>
                    <div class="text-xs text-emerald-400">${t('sosActiveStatus') || 'En cours'}</div>
                  </div>
                  <button onclick="shareSOSLocation()" class="w-11 h-6 rounded-full bg-danger-500 relative transition-colors shrink-0" type="button" aria-pressed="true" aria-label="${t('sosPositionSharing') || 'Partage de position'}">
                    <span class="absolute w-4 h-4 rounded-full bg-white top-1 right-1 transition-transform" aria-hidden="true"></span>
                  </button>
                </div>
              ` : ''}
            </div>
          ` : ''}

          <!-- ── Record Evidence ── -->
          <div class="bg-dark-secondary rounded-2xl p-4 border border-white/5">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                ${icon('camera', 'w-4 h-4 text-rose-400')}
                <span class="text-sm font-bold text-slate-200">${t('sosRecordEvidence') || 'Enregistrer des preuves'}</span>
              </div>
              <span id="sos-rec-indicator" class="hidden items-center gap-1 text-xs text-rose-400 font-semibold">
                <span class="w-2 h-2 rounded-full bg-rose-500 animate-pulse inline-block"></span>
                ${t('sosRecording') || 'REC'}
              </span>
            </div>
            <div class="flex gap-2">
              <button
                onclick="sosStartRecording('audio')"
                id="sos-rec-audio-btn"
                class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-semibold transition-colors hover:bg-rose-500/20"
                type="button"
              >
                ${icon('music', 'w-4 h-4')}
                ${t('sosRecordAudio') || 'Audio'}
              </button>
              <button
                onclick="sosStartRecording('video')"
                id="sos-rec-video-btn"
                class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-semibold transition-colors hover:bg-rose-500/20"
                type="button"
              >
                ${icon('camera', 'w-4 h-4')}
                ${t('sosRecordVideo') || 'Vidéo'}
              </button>
              <button
                onclick="sosStopRecording()"
                id="sos-rec-stop-btn"
                class="hidden flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-danger-500/10 border border-danger-500/20 text-danger-400 text-sm font-semibold"
                type="button"
                aria-label="${t('sosStopRecording') || 'Arrêter l\'enregistrement'}"
              >
                ${icon('circle-stop', 'w-4 h-4')}
              </button>
            </div>
            <div id="sos-rec-result" class="hidden mt-2 text-xs text-slate-400"></div>
          </div>

          <!-- ── Emergency Contacts ── -->
          <div>
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-bold text-slate-200 flex items-center gap-2" id="contacts-heading">
                ${icon('users', 'w-4 h-4 text-amber-500')}
                ${t('emergencyContacts')}
                ${state.emergencyContacts.length > 0 ? `<span class="text-xs text-slate-500">(${state.emergencyContacts.length})</span>` : ''}
              </h3>
            </div>

            <!-- Triple alert description -->
            <div class="bg-danger-500/10 rounded-xl p-3 mb-3 border border-danger-500/20">
              <p class="text-xs text-danger-300 leading-relaxed flex items-start gap-2">
                ${icon('zap', 'w-4 h-4 text-danger-400 shrink-0 mt-0.5')}
                <span>${t('sosTripleAlertDesc') || 'When SOS is triggered, everything fires at once: push notification + SMS + phone call to your primary contact. No choice needed. Maximum safety.'}</span>
              </p>
            </div>

            <!-- Add Contact Form -->
            <div class="bg-dark-secondary rounded-2xl p-4 mb-3 space-y-3 border border-white/5">
              <div class="flex gap-2">
                <input
                  type="text"
                  id="emergency-name"
                  class="input-field flex-1"
                  placeholder="${t('contactName') || 'Nom du contact'}"
                  aria-label="${t('emergencyContactName') || 'Nom du contact d\'urgence'}"
                />
              </div>
              <div class="flex gap-2">
                <input
                  type="tel"
                  id="emergency-phone"
                  class="input-field flex-1"
                  placeholder="${t('phonePlaceholder') || '+33 6 12 34 56 78'}"
                  aria-label="${t('emergencyContactPhone') || 'Téléphone du contact d\'urgence'}"
                  onkeydown="if(event.key==='Enter') addEmergencyContact()"
                />
                <button
                  onclick="addEmergencyContact()"
                  class="btn-primary px-4"
                  type="button"
                  aria-label="${t('addContact') || 'Ajouter le contact'}"
                >
                  ${icon('plus', 'w-5 h-5')}
                </button>
              </div>
            </div>

            <ul class="space-y-2" aria-labelledby="contacts-heading" role="list">
              ${state.emergencyContacts.length > 0
    ? state.emergencyContacts.map((contact, i) => `
                    <li class="bg-dark-secondary rounded-2xl border border-white/5 p-3 flex items-center justify-between ${i === primaryIdx ? 'border-amber-500/30 bg-amber-500/5' : ''}">
                      <div class="flex items-center gap-3">
                        <div class="w-9 h-9 rounded-xl ${i === primaryIdx ? 'bg-amber-500/15' : 'bg-primary-500/15'} flex items-center justify-center" aria-hidden="true">
                          ${icon(i === primaryIdx ? 'star' : 'user', `w-4 h-4 ${i === primaryIdx ? 'text-amber-500' : 'text-primary-400'}`)}
                        </div>
                        <div>
                          <div class="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                            ${escapeHTML(contact.name)}
                            ${i === primaryIdx ? `<span class="text-xs text-amber-400 font-semibold">${t('sosPrimaryContact') || 'Principal'}</span>` : ''}
                          </div>
                          <div class="text-xs text-slate-500">${escapeHTML(contact.phone)}</div>
                        </div>
                      </div>
                      <div class="flex items-center gap-1">
                        <button
                          onclick="sosSetPrimaryContact(${i})"
                          class="w-8 h-8 flex items-center justify-center rounded-full transition-colors ${i === primaryIdx ? 'text-amber-400' : 'text-slate-500 hover:text-amber-400'}"
                          type="button"
                          aria-label="${t('sosSetPrimary') || 'Définir comme contact principal'} ${escapeHTML(contact.name)}"
                          aria-pressed="${i === primaryIdx}"
                        >
                          ${icon('star', 'w-4 h-4')}
                        </button>
                        <button
                          onclick="removeEmergencyContact(${i})"
                          class="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-danger-400 rounded-full transition-colors"
                          type="button"
                          aria-label="${t('deleteContact') || 'Supprimer le contact'} ${escapeHTML(contact.name)}"
                        >
                          ${icon('x', 'w-4 h-4')}
                        </button>
                      </div>
                    </li>
                  `).join('')
    : `
                  <li class="text-center text-slate-500 py-4">
                    ${icon('user-plus', 'w-6 h-6 mb-2')}
                    <p class="text-sm">${t('addTrustedContacts') || 'Ajoute des contacts de confiance'}</p>
                  </li>
                `
}
            </ul>
          </div>

          <!-- ── Custom Alert Message ── -->
          <div class="bg-dark-secondary rounded-2xl p-4 space-y-2 border border-white/5">
            <label class="flex items-center gap-2 text-sm font-bold text-slate-200" for="sos-custom-msg">
              ${icon('pencil', 'w-4 h-4 text-primary-400')}
              ${t('sosCustomMessage') || 'Message personnalisé'}
            </label>
            <textarea
              id="sos-custom-msg"
              class="input-field w-full text-sm resize-none"
              rows="2"
              maxlength="200"
              placeholder="${t('sosCustomMsgPlaceholder') || 'Ajouté en tête de chaque alerte...'}"
              oninput="sosUpdateCustomMsg(this.value)"
            >${escapeHTML(customMsg)}</textarea>
            <p class="text-xs text-slate-500">${t('sosCustomMsgHint') || 'Ce texte sera ajouté au début de vos messages d\'alerte.'}</p>
          </div>

          <!-- ── Emergency Numbers Grid ── -->
          <div class="bg-dark-secondary rounded-2xl p-4 space-y-3 border border-white/5">
            <h3 class="text-sm font-bold text-slate-200 flex items-center gap-2">
              ${icon('globe', 'w-4 h-4 text-primary-400')}
              ${t('emergencyNumbersByCountry') || 'Numéros d\'urgence par pays'}
            </h3>
            <div id="country-emergency-numbers">
              <div class="grid grid-cols-2 gap-2 text-sm">
                <a href="tel:112" class="p-2.5 rounded-xl bg-danger-500/10 text-center no-underline">
                  <div class="text-xs text-slate-500">Europe</div>
                  <div class="font-bold text-danger-400">112</div>
                </a>
                <a href="tel:911" class="p-2.5 rounded-xl bg-danger-500/10 text-center no-underline">
                  <div class="text-xs text-slate-500">USA/Canada</div>
                  <div class="font-bold text-danger-400">911</div>
                </a>
                <a href="tel:000" class="p-2.5 rounded-xl bg-danger-500/10 text-center no-underline">
                  <div class="text-xs text-slate-500">${t('australia') || 'Australie'}</div>
                  <div class="font-bold text-danger-400">000</div>
                </a>
                <a href="tel:111" class="p-2.5 rounded-xl bg-danger-500/10 text-center no-underline">
                  <div class="text-xs text-slate-500">${t('newZealand') || 'Nv-Zélande'}</div>
                  <div class="font-bold text-danger-400">111</div>
                </a>
              </div>
            </div>
          </div>

          <!-- ── Pre-programmed Messages ── -->
          <div class="bg-dark-secondary rounded-2xl p-4 space-y-3 border border-white/5">
            <h3 class="text-sm font-bold text-slate-200 flex items-center gap-2">
              ${icon('message-circle-more', 'w-4 h-4 text-emerald-400')}
              ${t('emergencyMessages') || 'Messages d\'urgence'}
            </h3>
            <div class="space-y-2">
              <button onclick="sendSOSTemplate('danger')" class="w-full p-3 rounded-xl bg-danger-500/10 text-left text-sm hover:bg-danger-500/20 transition-colors">
                <div class="font-semibold text-danger-400">${t('sosInDanger') || 'Je suis en danger'}</div>
                <div class="text-xs text-slate-500">${t('sosInDangerDesc') || 'Envoie ta position + message d\'alerte'}</div>
              </button>
              <button onclick="sendSOSTemplate('stuck')" class="w-full p-3 rounded-xl bg-amber-500/10 text-left text-sm hover:bg-amber-500/20 transition-colors">
                <div class="font-semibold text-amber-400">${t('sosStuck') || 'Je suis bloqué(e)'}</div>
                <div class="text-xs text-slate-500">${t('sosStuckDesc') || 'Envoie ta position + demande d\'aide'}</div>
              </button>
              <button onclick="sendSOSTemplate('help')" class="w-full p-3 rounded-xl bg-primary-500/10 text-left text-sm hover:bg-primary-500/20 transition-colors">
                <div class="font-semibold text-primary-400">${t('sosNeedHelp') || 'J\'ai besoin d\'aide'}</div>
                <div class="text-xs text-slate-500">${t('sosNeedHelpDesc') || 'Envoie ta position + description'}</div>
              </button>
            </div>
          </div>

          <!-- ── Community Alert Settings ── -->
          ${renderCommunityAlertSettings()}

          <!-- Info note -->
          <div class="flex items-start gap-2 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
            ${icon('info', 'w-4 h-4 text-amber-500 shrink-0 mt-0.5')}
            <p class="text-xs text-slate-500 leading-relaxed">
              ${t('sosCombineNote') || 'Vous pouvez combiner plusieurs actions. Par exemple, lancer un faux appel puis activer l\'alerte silencieuse.'}
            </p>
          </div>

          <!-- I'm Safe Button -->
          ${state.sosActive ? `
            <button
              onclick="markSafe()"
              class="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-dark-primary font-bold text-base transition-colors"
              type="button"
            >
              ${icon('shield-check', 'w-5 h-5')}
              ${t('iAmSafe')}
            </button>
          ` : ''}
        </div>

        <!-- Close -->
        <button
          onclick="closeSOS()"
          class="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
          aria-label="${t('closeSOSWindow') || 'Fermer la fenêtre SOS'}"
          type="button"
        >
          ${icon('x', 'w-5 h-5')}
        </button>
      </div>
    </div>
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
  // Force re-render — setState({showSOS:true}) is a no-op if already true
  window._forceRender?.()
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
  if (_mediaRecorder && _mediaRecorder.state !== 'inactive') {
    _mediaRecorder.stop()
  }
}

export default { renderSOS }
