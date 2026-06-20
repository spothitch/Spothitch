/**
 * Voyageurs Component
 * Combined radar + travel buddies tab in Social view
 * 5 internal views: combined, radar, buddyList, buddyDetail, create
 */

import { t } from '../../../i18n/index.js'
import { icon } from '../../../utils/icons.js'
import { escapeHTML, escapeJSString } from '../../../utils/sanitize.js'
import { getRadarSettings, getRemainingCooldownMinutes, isRadarInCooldown } from '../../../services/proximityRadar.js'

// ==================== MAIN EXPORT ====================

export function renderVoyageurs(state) {
  const view = state.voyageursView || 'combined'
  switch (view) {
    case 'radar': return renderRadarExpanded(state)
    case 'buddyList': return renderBuddyList(state)
    case 'buddyDetail': return renderBuddyDetail(state)
    case 'create': return renderBuddyCreate(state)
    default: return renderCombined(state)
  }
}

// ==================== VIEW 1: COMBINED (default) ====================

function renderCombined(state) {
  const settings = getRadarSettings()
  const radarOn = settings.enabled
  const nearbyTravelers = state.nearbyTravelers || []
  const buddies = state.travelBuddies || []
  const cooldownMins = getRemainingCooldownMinutes()
  const inCooldown = isRadarInCooldown()

  return `
    <div class="flex-1 overflow-y-auto pb-[100px]">
      <div class="p-4">

        <!-- Radar compact card -->
        <div onclick="showRadarExpanded()" role="button" tabindex="0" class="bg-[#161b28] border border-[rgba(245,158,11,0.15)] rounded-xl p-4 mb-2 cursor-pointer transition-colors">
          <div class="flex items-center justify-between mb-2.5">
            <div class="flex items-center gap-2.5">
              <span class="text-amber-500">${icon('radar', 'w-5 h-5')}</span>
              <span class="font-bold text-[0.95rem]">${t('proximityRadar') || 'Radar de proximite'}</span>
            </div>
            <div onclick="event.stopPropagation();toggleProximityRadar()" tabindex="0" class="w-12 h-[26px] rounded-[13px] relative cursor-pointer shrink-0 transition-all" style="background:${radarOn ? '#f59e0b' : '#334155'};${radarOn ? 'box-shadow:0 0 12px rgba(245,158,11,0.25)' : ''}" role="switch" aria-checked="${radarOn}" aria-label="${t('proximityRadar')}">
              <div class="w-5 h-5 rounded-full bg-white absolute top-[3px] transition-transform" style="transform:translateX(${radarOn ? '25px' : '3px'})"></div>
            </div>
          </div>
          <div class="flex items-center justify-between gap-2">
            <span class="text-slate-400 text-sm">${radarOn ? `${t('active') || 'Actif'} · ${t('radius') || 'Rayon'} ${settings.radius} km` : t('radarInactive') || 'Inactif'}</span>
            ${radarOn && nearbyTravelers.length > 0 ? `
              <span class="flex items-center gap-1.5 bg-[rgba(245,158,11,0.1)] text-amber-500 text-xs font-semibold px-3 py-1 rounded-[10px] shrink-0">
                ${icon('users', 'w-3.5 h-3.5')}
                ${nearbyTravelers.length} ${t('travelers') || 'voyageurs'}
              </span>
            ` : ''}
          </div>

          <!-- Visibility note -->
          <div class="flex items-start gap-2 text-slate-400 text-xs leading-relaxed mt-2.5 px-3.5 py-2.5 bg-[rgba(245,158,11,0.06)] border border-[rgba(245,158,11,0.12)] rounded-[10px]">
            ${icon('eye', 'w-3.5 h-3.5 shrink-0')}
            <span>${t('radarVisibilityNote') || 'En activant le radar, tu es visible par les autres voyageurs et tu peux les voir.'}</span>
          </div>

          ${inCooldown ? `
            <div class="flex items-center gap-1.5 text-red-400 text-xs font-semibold mt-2 px-3 py-2 bg-[rgba(248,113,113,0.08)] border border-[rgba(248,113,113,0.15)] rounded-lg">
              ${icon('clock', 'w-3.5 h-3.5')}
              <span>${t('radarCooldown') || 'Tu pourras reactiver le radar dans'} ${cooldownMins} min</span>
            </div>
          ` : ''}
        </div>

        <!-- Nearby travelers strip (only when radar ON) -->
        ${radarOn && nearbyTravelers.length > 0 ? `
          <div class="flex gap-2 overflow-x-auto pt-2 pb-3 mb-1 scrollbar-hide">
            ${nearbyTravelers.map(trav => `
              <div onclick="contactNearbyTraveler('${escapeJSString(trav.userId)}')" role="button" tabindex="0" class="flex items-center gap-2 bg-[#161b28] border border-white/10 rounded-xl px-3 py-2 shrink-0 cursor-pointer min-h-[48px] transition-colors">
                ${trav.photoURL
                  ? `<img src="${escapeHTML(trav.photoURL)}" class="w-8 h-8 rounded-full object-cover shrink-0" alt="" onerror="this.style.display='none'">`
                  : `<div class="w-8 h-8 rounded-full bg-[#1e2a3a] flex items-center justify-center text-[0.8rem] font-bold shrink-0 text-slate-400">${escapeHTML((trav.userName || '?')[0].toUpperCase())}</div>`}
                <div>
                  <div class="font-semibold text-[0.8rem] whitespace-nowrap">${escapeHTML(trav.userName || t('traveler'))}</div>
                  <div class="text-slate-400 text-[0.72rem] whitespace-nowrap">${trav.displayDistance === null ? `< 5 km` : `~${trav.displayDistance} km`}</div>
                </div>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${radarOn && nearbyTravelers.length === 0 ? `
          <div class="text-center p-4 text-slate-400 text-sm">
            ${t('noNearbyTravelers') || 'Aucun voyageur dans ton rayon pour le moment.'}
          </div>
        ` : ''}

        ${!radarOn ? `
          <div class="text-center px-4 py-5 text-slate-400 text-sm leading-relaxed">
            ${icon('radar', 'w-10 h-10 text-slate-600')}
            <div class="font-semibold text-slate-200 mt-3 mb-1.5">${t('radarDisabled') || 'Radar desactive'}</div>
            ${t('radarActivatePrompt') || 'Active le radar pour voir les voyageurs autour de toi. Tu seras aussi visible par eux.'}
          </div>
        ` : ''}

        <!-- Divider -->
        <div class="h-px bg-white/[0.06] my-4"></div>

        <!-- Travel buddies section -->
        <div class="flex items-center justify-between mb-3.5">
          <div class="text-lg font-bold flex items-center gap-2">
            ${icon('route', 'w-5 h-5')}
            ${t('travelBuddies') || 'Compagnons de voyage'}
          </div>
          <button onclick="showBuddyList()" class="text-amber-500 text-sm font-semibold cursor-pointer p-2 min-h-[44px] flex items-center bg-transparent border-0">${t('viewAll') || 'Voir tout'}</button>
        </div>

        <!-- Recent buddy cards (max 2) -->
        ${buddies.slice(0, 2).map(buddy => renderBuddyCard(buddy)).join('')}

        ${buddies.length === 0 ? `
          <div class="text-center px-4 py-6 text-slate-400 text-sm">
            ${icon('route', 'w-8 h-8 text-slate-600')}
            <div class="mt-2">${t('noBuddiesYet') || 'Aucune annonce de voyage pour le moment.'}</div>
          </div>
        ` : ''}

        <!-- Publish button -->
        <button onclick="showBuddyCreate()" class="w-full bg-[rgba(245,158,11,0.1)] text-amber-500 border border-dashed border-[rgba(245,158,11,0.3)] rounded-xl p-3.5 text-sm font-semibold cursor-pointer text-center mt-1 min-h-[48px] flex items-center justify-center gap-1.5">
          ${icon('plus', 'w-4.5 h-4.5')}
          ${t('publishTravelAnnouncement') || 'Publier une annonce de voyage'}
        </button>

      </div>
    </div>
  `
}

// ==================== VIEW 2: RADAR EXPANDED ====================

function renderRadarExpanded(state) {
  const settings = getRadarSettings()
  const radarOn = settings.enabled
  const nearbyTravelers = state.nearbyTravelers || []
  const cooldownMins = getRemainingCooldownMinutes()
  const inCooldown = isRadarInCooldown()
  const selectedRadius = settings.radius || 50
  const selectedVisibility = settings.visibility || ['tous']

  return `
    <div class="flex-1 overflow-y-auto pb-[100px]">
      <!-- Header -->
      <div class="flex items-center justify-between px-5 pt-4 pb-3 border-b border-white/[0.06]">
        <button onclick="backFromVoyageurs()" class="w-11 h-11 rounded-xl bg-white/[0.06] flex items-center justify-center cursor-pointer border-0 text-slate-200" aria-label="${t('back')}">
          ${icon('arrow-left', 'w-5 h-5')}
        </button>
        <h2 class="text-xl font-bold flex items-center gap-2">
          <span class="text-amber-500">${icon('radar', 'w-5.5 h-5.5')}</span>
          ${t('radar') || 'Radar'}
        </h2>
        <div class="w-11"></div>
      </div>

      <div class="p-4">

        <!-- Toggle ON/OFF -->
        <div class="flex items-center justify-between px-[18px] py-4 bg-[#161b28] rounded-xl mb-4" style="border:1px solid ${radarOn ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.1)'}">
          <div class="flex items-center gap-2.5">
            <span class="transition-colors" style="color:${radarOn ? '#f59e0b' : '#94a3b8'}">${icon('radar', 'w-5.5 h-5.5')}</span>
            <span class="font-bold text-base">${radarOn ? (t('radarActive') || 'Radar actif') : (t('radarInactiveLabel') || 'Radar inactif')}</span>
          </div>
          <div onclick="toggleProximityRadar()" tabindex="0" class="w-12 h-[26px] rounded-[13px] relative cursor-pointer shrink-0 transition-all" style="background:${radarOn ? '#f59e0b' : '#334155'};${radarOn ? 'box-shadow:0 0 12px rgba(245,158,11,0.25)' : ''}" role="switch" aria-checked="${radarOn}" aria-label="${t('toggleRadar') || 'Toggle radar'}">
            <div class="w-5 h-5 rounded-full bg-white absolute top-[3px] transition-transform" style="transform:translateX(${radarOn ? '25px' : '3px'})"></div>
          </div>
        </div>

        ${radarOn ? renderRadarActiveContent(state, settings, nearbyTravelers, selectedRadius, selectedVisibility) : renderRadarInactiveContent(inCooldown, cooldownMins)}

      </div>
    </div>
  `
}

function renderRadarActiveContent(state, settings, nearbyTravelers, selectedRadius, selectedVisibility) {
  const radiusOptions = [10, 25, 50, 100]

  // Check if Guardian is active (imported at module level would be circular, check localStorage)
  let guardianWarning = ''
  try {
    const gData = JSON.parse(localStorage.getItem('spothitch_guardian') || '{}')
    if (gData.active) {
      guardianWarning = `
      <div class="flex items-start gap-2 text-red-400 text-xs leading-relaxed mb-2.5 px-3.5 py-2.5 bg-[rgba(248,113,113,0.08)] border border-[rgba(248,113,113,0.15)] rounded-[10px]">
        ${icon('shield-alert', 'w-4 h-4 shrink-0')}
        <span>${t('radarGuardianWarning') || 'Le mode Gardien est actif. Le radar te rend visible par tous les voyageurs proches.'}</span>
      </div>`
    }
  } catch { /* ignore */ }

  return `
    ${guardianWarning}
    <!-- Radar ON note -->
    <div class="flex items-start gap-2 text-slate-400 text-xs leading-relaxed mb-3.5 px-3.5 py-2.5 bg-[rgba(245,158,11,0.06)] border border-[rgba(245,158,11,0.12)] rounded-[10px]">
      ${icon('eye', 'w-3.5 h-3.5 shrink-0')} <span>${t('radarVisibilityNote') || 'En activant le radar, tu es visible par les autres voyageurs et tu peux les voir.'}</span>
    </div>

    <!-- Message field -->
    <div class="bg-[#161b28] border border-white/10 rounded-xl px-4 py-3.5 mb-3.5">
      <div class="text-slate-400 text-xs mb-2 font-semibold flex items-center gap-1.5">
        ${icon('message-circle', 'w-3.5 h-3.5')}
        ${t('radarVisibleMessage') || 'Ton message visible'}
      </div>
      <input type="text" id="radar-message" value="${escapeHTML(settings.message || '')}" onchange="setRadarMessage(this.value)" class="w-full bg-white/[0.04] border border-white/[0.08] rounded-[10px] px-3.5 py-2.5 text-slate-200 text-sm" placeholder="${t('radarMessagePlaceholder') || 'Ex: Dispo pour un cafe...'}" />
    </div>

    <!-- Radius pills -->
    <div class="mb-3.5">
      <div class="text-slate-400 text-xs mb-2 font-semibold flex items-center gap-1.5">
        ${icon('radar', 'w-3.5 h-3.5')}
        ${t('detectionRadius') || 'Rayon de detection'}
      </div>
      <div class="flex gap-1.5 flex-wrap">
        ${radiusOptions.map(r => `
          <button onclick="setRadarRadius(${r})" class="px-4 py-2 rounded-[20px] text-sm font-semibold cursor-pointer min-h-[44px] flex items-center transition-all" style="border:1px solid ${selectedRadius === r ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.1)'};background:${selectedRadius === r ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.04)'};color:${selectedRadius === r ? '#f59e0b' : '#94a3b8'}">${r} km</button>
        `).join('')}
      </div>
    </div>

    <!-- Visibility pills -->
    <div class="mb-3.5">
      <div class="text-slate-400 text-xs mb-2 font-semibold flex items-center gap-1.5">
        ${icon('eye', 'w-3.5 h-3.5')}
        ${t('visibleBy') || 'Visible par'}
      </div>
      <div class="flex gap-1.5 flex-wrap">
        ${renderVisibilityPill('tous', t('visibilityAll') || 'Tous', selectedVisibility, 'setRadarVisibility')}
        ${renderVisibilityPill('femmes', t('visibilityWomen') || 'Femmes', selectedVisibility, 'setRadarVisibility')}
        ${renderVisibilityPill('verifies', t('visibilityVerified') || 'Verifies', selectedVisibility, 'setRadarVisibility')}
      </div>
      <div class="text-slate-400 text-[0.72rem] leading-relaxed mt-2 px-0.5">${t('visibilityWomenHint') || "L'option Femmes est reservee aux utilisatrices ayant indique Femme dans leur profil."}</div>
      ${selectedVisibility.includes('femmes') ? `
        <div class="text-violet-400 text-[0.72rem] leading-relaxed mt-1.5 px-3 py-2 bg-[rgba(167,139,250,0.08)] border border-[rgba(167,139,250,0.15)] rounded-lg flex items-start gap-1.5">
          ${icon('shield', 'w-3.5 h-3.5 shrink-0')}
          <span>${t('visibilityWomenReassure') || 'Seules les femmes verifiees verront ton profil et ta position.'}</span>
        </div>
      ` : ''}
    </div>

    <!-- Nearby travelers list -->
    <div>
      <div class="flex items-center justify-between mb-3.5">
        <div class="text-lg font-bold flex items-center gap-2">
          ${icon('users', 'w-5 h-5')}
          ${t('nearbyTravelers') || 'Voyageurs autour de toi'}
        </div>
        ${nearbyTravelers.length > 0 ? `
          <span class="bg-[rgba(245,158,11,0.12)] text-amber-500 text-[0.75rem] font-semibold px-2.5 py-1 rounded-[10px]">${nearbyTravelers.length}</span>
        ` : ''}
      </div>

      ${nearbyTravelers.length > 0 ? nearbyTravelers.map(trav => `
        <div class="bg-[#161b28] border border-white/10 rounded-xl p-3.5 mb-2.5 flex items-start gap-3" role="listitem">
          ${trav.photoURL
            ? `<img src="${escapeHTML(trav.photoURL)}" class="w-11 h-11 rounded-full object-cover shrink-0" alt="${escapeHTML(trav.userName || '')}" onerror="this.style.display='none'">`
            : `<div class="w-11 h-11 rounded-full bg-[#1e2a3a] flex items-center justify-center text-sm font-bold shrink-0 text-slate-400">${escapeHTML((trav.userName || '?')[0].toUpperCase())}</div>`}
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-1.5 mb-[3px]">
              <span class="font-semibold text-sm">${escapeHTML(trav.userName || t('traveler'))}</span>
            </div>
            <div class="text-slate-400 text-xs flex items-center gap-1">
              ${icon('map-pin', 'w-3 h-3')}
              ${trav.displayDistance === null ? `< 5 km` : `~${trav.displayDistance} km`}
            </div>
            ${trav.message ? `<div class="text-slate-400 text-sm leading-relaxed mt-1.5 mb-2.5">${escapeHTML(trav.message)}</div>` : '<div class="mb-2.5"></div>'}
            <button onclick="contactNearbyTraveler('${escapeJSString(trav.userId)}')" class="bg-[rgba(245,158,11,0.12)] text-amber-500 border border-[rgba(245,158,11,0.2)] rounded-[10px] px-4 py-2.5 text-sm font-semibold cursor-pointer w-full min-h-[44px] flex items-center justify-center gap-1.5 transition-colors">
              ${icon('message-circle', 'w-3.5 h-3.5')}
              ${t('contact') || 'Contacter'}
            </button>
          </div>
        </div>
      `).join('') : `
        <div class="text-center px-4 py-6 text-slate-400 text-sm">
          ${t('noNearbyTravelers') || 'Aucun voyageur dans ton rayon pour le moment.'}
        </div>
      `}

      ${nearbyTravelers.length > 0 ? `
        <div class="text-center text-slate-400 text-sm py-3">${nearbyTravelers.length} ${t('travelersInRadius') || 'voyageurs dans un rayon de'} ${settings.radius} km</div>
      ` : ''}
    </div>
  `
}

function renderRadarInactiveContent(inCooldown, cooldownMins) {
  return `
    <div class="flex flex-col items-center pt-4">

      ${inCooldown ? `
        <div class="flex items-center gap-1.5 text-red-400 text-xs font-semibold mb-4 px-3 py-2 bg-[rgba(248,113,113,0.08)] border border-[rgba(248,113,113,0.15)] rounded-lg w-full">
          ${icon('clock', 'w-3.5 h-3.5')}
          <span>${t('radarCooldown') || 'Tu pourras reactiver le radar dans'} ${cooldownMins} min</span>
        </div>
      ` : ''}

      <div class="mb-6 opacity-50 text-slate-400">
        ${icon('radar', 'w-20 h-20')}
      </div>

      <div class="text-lg font-bold mb-3 text-center">${t('radarDiscoverTitle') || 'Decouvre les voyageurs autour de toi'}</div>
      <div class="text-slate-400 text-sm leading-relaxed text-center max-w-[300px] mb-8">${t('radarDiscoverDesc') || 'Active le radar pour voir les voyageurs autour de toi. Tu seras aussi visible par eux. Ideal pour se retrouver, partager un cafe ou faire route ensemble.'}</div>

      <!-- Features list -->
      <div class="w-full bg-[#161b28] border border-white/10 rounded-xl p-[18px] mb-6">
        <div class="flex items-start gap-3 py-2.5 border-b border-white/[0.04]">
          <span class="shrink-0 mt-0.5 text-amber-500">${icon('eye', 'w-5 h-5')}</span>
          <div class="text-sm leading-relaxed">
            <strong class="block mb-0.5">${t('radarFeatureVisible') || 'Sois visible'}</strong>
            <span class="text-slate-400">${t('radarFeatureVisibleDesc') || 'Les autres voyageurs verront que tu es dans leur zone.'}</span>
          </div>
        </div>
        <div class="flex items-start gap-3 py-2.5 border-b border-white/[0.04]">
          <span class="shrink-0 mt-0.5 text-amber-500">${icon('message-circle', 'w-5 h-5')}</span>
          <div class="text-sm leading-relaxed">
            <strong class="block mb-0.5">${t('radarFeatureMessage') || 'Partage un message'}</strong>
            <span class="text-slate-400">${t('radarFeatureMessageDesc') || "Dis ce que tu fais : « Dispo pour un cafe » ou « Je cherche un lift »."}</span>
          </div>
        </div>
        <div class="flex items-start gap-3 py-2.5">
          <span class="shrink-0 mt-0.5 text-amber-500">${icon('radar', 'w-5 h-5')}</span>
          <div class="text-sm leading-relaxed">
            <strong class="block mb-0.5">${t('radarFeatureRadius') || 'Choisis ton rayon'}</strong>
            <span class="text-slate-400">${t('radarFeatureRadiusDesc') || '10 km, 25 km, 50 km ou 100 km. A toi de regler.'}</span>
          </div>
        </div>
      </div>

      <!-- Privacy note -->
      <div class="flex items-start gap-2.5 bg-[rgba(59,130,246,0.08)] border border-[rgba(59,130,246,0.15)] rounded-xl px-4 py-3.5 w-full">
        <span class="shrink-0 text-blue-400">${icon('shield', 'w-5 h-5')}</span>
        <div class="text-slate-400 text-sm leading-relaxed">${t('radarPrivacyNote') || "Ta position exacte n'est jamais partagee. Les autres voient uniquement que tu es dans leur zone. Tu peux desactiver le radar a tout moment."}</div>
      </div>
    </div>
  `
}

// ==================== VIEW 3: BUDDY LIST ====================

function renderBuddyList(state) {
  const buddies = state.travelBuddies || []
  const filter = state.buddyCountryFilter || 'all'

  const countries = [
    { code: 'all', label: t('all') || 'Tous', flag: '' },
    { code: 'BE', label: t('countryBE') || 'Belgique', flag: '\u{1F1E7}\u{1F1EA}' },
    { code: 'FR', label: t('countryFR') || 'France', flag: '\u{1F1EB}\u{1F1F7}' },
    { code: 'ES', label: t('countryES') || 'Espagne', flag: '\u{1F1EA}\u{1F1F8}' },
    { code: 'DE', label: t('countryDE') || 'Allemagne', flag: '\u{1F1E9}\u{1F1EA}' },
    { code: 'IT', label: t('countryIT') || 'Italie', flag: '\u{1F1EE}\u{1F1F9}' },
  ]

  const filtered = filter === 'all' ? buddies : buddies.filter(b => b.country === filter)

  return `
    <div class="flex-1 overflow-y-auto pb-[100px]">
      <!-- Header -->
      <div class="flex items-center justify-between px-5 pt-4 pb-3 border-b border-white/[0.06]">
        <button onclick="backFromVoyageurs()" class="w-11 h-11 rounded-xl bg-white/[0.06] flex items-center justify-center cursor-pointer border-0 text-slate-200" aria-label="${t('back')}">
          ${icon('arrow-left', 'w-5 h-5')}
        </button>
        <h2 class="text-xl font-bold flex items-center gap-2">
          ${icon('route', 'w-5.5 h-5.5')}
          ${t('companions') || 'Compagnons'}
        </h2>
        <div class="w-11"></div>
      </div>

      <div class="p-4">
        <!-- Country filter pills -->
        <div class="flex gap-1.5 overflow-x-auto pt-2 pb-3.5 scrollbar-hide">
          ${countries.map(c => `
            <button onclick="setBuddyCountryFilter('${c.code}')" class="px-3.5 py-2 rounded-[20px] text-[0.8rem] font-semibold cursor-pointer min-h-[40px] flex items-center gap-1.5 shrink-0 whitespace-nowrap transition-all" style="border:1px solid ${filter === c.code ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.1)'};background:${filter === c.code ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.04)'};color:${filter === c.code ? '#f59e0b' : '#94a3b8'}">${c.flag ? c.flag + ' ' : ''}${c.label}</button>
          `).join('')}
        </div>

        <div class="flex items-center justify-between mb-3.5">
          <div class="text-sm font-bold">${filtered.length} ${t('announcements') || 'annonces'}</div>
        </div>

        <!-- Buddy cards -->
        ${filtered.length > 0 ? filtered.map(buddy => renderBuddyCard(buddy, true)).join('') : `
          <div class="text-center px-4 py-10 text-slate-400 text-sm">
            ${icon('route', 'w-10 h-10 text-slate-600')}
            <div class="mt-3">${t('noBuddiesForFilter') || 'Aucune annonce pour ce filtre.'}</div>
          </div>
        `}
      </div>

      <!-- FAB + button -->
      <button onclick="showBuddyCreate()" class="fixed bottom-24 right-5 w-14 h-14 rounded-full shadow-lg shadow-amber-500/35 flex items-center justify-center z-30 transition-transform active:scale-90 bg-amber-500 text-[#0f1520] border-0 cursor-pointer" aria-label="${t('createAnnouncement') || 'Creer une annonce'}">
        ${icon('plus', 'w-6 h-6')}
      </button>
    </div>
  `
}

// ==================== VIEW 4: BUDDY DETAIL ====================

function renderBuddyDetail(state) {
  const buddy = state.selectedBuddyDetail
  if (!buddy) return renderCombined(state)

  const initial = (buddy.userName || '?')[0].toUpperCase()
  const isOwn = buddy.userId === (state.user?.uid || 'local-user')

  return `
    <div class="flex-1 overflow-y-auto pb-[140px]">
      <!-- Header -->
      <div class="flex items-center justify-between px-5 pt-4 pb-3 border-b border-white/[0.06]">
        <button onclick="backFromVoyageurs()" class="w-11 h-11 rounded-xl bg-white/[0.06] flex items-center justify-center cursor-pointer border-0 text-slate-200" aria-label="${t('back')}">
          ${icon('arrow-left', 'w-5 h-5')}
        </button>
        <h2 class="text-xl font-bold">${t('announcement') || 'Annonce'}</h2>
        <button onclick="shareBuddyAnnouncement('${escapeJSString(buddy.id)}')" class="w-11 h-11 rounded-xl bg-white/[0.06] flex items-center justify-center cursor-pointer border-0 text-slate-200" aria-label="${t('share') || 'Partager'}">
          ${icon('send', 'w-4.5 h-4.5')}
        </button>
      </div>

      <div class="p-4">

        <!-- Profile header -->
        <div class="flex items-center gap-3.5 mb-5">
          ${buddy.photoURL
            ? `<img src="${escapeHTML(buddy.photoURL)}" class="w-14 h-14 rounded-full object-cover shrink-0 border-2 border-[rgba(245,158,11,0.25)]" alt="${escapeHTML(buddy.userName || '')}" onerror="this.style.display='none'">`
            : `<div class="w-14 h-14 rounded-full bg-[#1e2a3a] flex items-center justify-center text-2xl font-bold shrink-0 text-slate-400 border-2 border-[rgba(245,158,11,0.25)]">${initial}</div>`}
          <div>
            <div class="text-lg font-bold mb-0.5">
              ${escapeHTML(buddy.userName || t('traveler'))}
            </div>
            <div class="flex items-center gap-1.5 text-slate-400 text-[0.8rem] flex-wrap">
              ${Array.isArray(buddy.languages) && buddy.languages.length > 0 ? `<span>${escapeHTML(buddy.languages.slice(0, 3).join(', '))}</span>` : ''}
            </div>
          </div>
        </div>

        <!-- Route card -->
        <div class="bg-[#161b28] border border-white/10 rounded-xl overflow-hidden mb-4">
          <!-- Route map visualization -->
          <div class="h-[100px] relative flex items-center justify-center bg-[linear-gradient(135deg,#1a2744_0%,#0f1520_100%)]">
            <div class="w-4/5 h-[3px] rounded-sm relative bg-[linear-gradient(90deg,#f59e0b_0%,#f59e0b_40%,rgba(245,158,11,0.3)_60%,#f59e0b_100%)]">
              <div class="w-3.5 h-3.5 rounded-full bg-amber-500 absolute border-2 border-[#0f1520] top-[-5.5px] left-[-7px]"></div>
              <div class="w-2 h-2 rounded-full bg-amber-500/50 absolute left-1/2 -translate-x-1/2 top-[-2.5px]"></div>
              <div class="w-3.5 h-3.5 rounded-full bg-amber-500 absolute border-2 border-[#0f1520] top-[-5.5px] right-[-7px]"></div>
            </div>
            <div class="absolute bottom-2 left-4 text-slate-400 text-[0.7rem]">${escapeHTML(buddy.departure || '')}</div>
            <div class="absolute bottom-2 right-4 text-slate-400 text-[0.7rem]">${escapeHTML(buddy.destination || '')}</div>
          </div>
          <div class="px-4 py-3.5">
            <div class="text-lg font-bold flex items-center gap-2 mb-2">
              ${escapeHTML(buddy.departure || '')} <span class="text-amber-500">&rarr;</span> ${escapeHTML(buddy.destination || '')}
            </div>
            <div class="flex items-center gap-2 text-slate-400 text-sm mb-1.5">
              ${icon('calendar', 'w-4 h-4')}
              ${buddy.dateFrom || ''} ${buddy.dateTo ? '&rarr; ' + buddy.dateTo : ''}
              ${buddy.flexDates ? `<span class="text-amber-500 text-[0.72rem]">(${t('flexible') || 'flexible'})</span>` : ''}
            </div>
            ${buddy.duration ? `
              <div class="flex items-center gap-2 text-slate-400 text-sm mb-1.5">
                ${icon('clock', 'w-4 h-4')}
                ${escapeHTML(buddy.duration)}
              </div>
            ` : ''}
            <span class="inline-flex items-center gap-1 px-2.5 py-[3px] rounded-lg text-[0.72rem] font-semibold bg-[rgba(245,158,11,0.12)] text-amber-500">${escapeHTML(buddy.mode || 'Auto-stop')}</span>
          </div>
        </div>

        <!-- Description -->
        ${buddy.message ? `
          <div class="mb-5">
            <div class="text-sm font-bold mb-2.5 flex items-center gap-2">
              ${icon('message-circle', 'w-4 h-4')}
              ${t('description') || 'Description'}
            </div>
            <div class="text-slate-400 text-sm leading-relaxed">${escapeHTML(buddy.message)}</div>
          </div>
          <div class="h-px bg-white/[0.06] my-5"></div>
        ` : ''}

        <!-- Preferences -->
        ${buddy.preferences ? `
          <div class="mb-5">
            <div class="text-sm font-bold mb-2.5 flex items-center gap-2">
              ${icon('users', 'w-4 h-4')}
              ${t('whatImLookingFor') || 'Ce que je cherche'}
            </div>
            <div class="text-slate-400 text-sm leading-relaxed">${escapeHTML(buddy.preferences)}</div>
          </div>
          <div class="h-px bg-white/[0.06] my-5"></div>
        ` : ''}

        <!-- Visibility -->
        <div class="mb-5">
          <div class="text-sm font-bold mb-2.5 flex items-center gap-2">
            ${icon('eye', 'w-4 h-4')}
            ${t('visibility') || 'Visibilite'}
          </div>
          <div class="text-slate-400 text-sm leading-relaxed">
            ${(buddy.visibility || ['tous']).includes('tous')
    ? (t('visibleByAll') || 'Cette annonce est visible par tous les membres.')
    : (t('visibleByRestricted') || 'Visibilite restreinte.')}
          </div>
        </div>

        <!-- Chat thread -->
        <div class="mt-5">
          <div class="text-sm font-bold mb-2.5 flex items-center gap-2">
            ${icon('message-square', 'w-4 h-4')}
            ${t('buddyChat') || 'Discussion'}
          </div>
          <div id="buddy-chat-messages" class="max-h-[240px] overflow-y-auto mb-2.5">
            ${(state.buddyChatMessages || []).map(msg => `
              <div class="flex gap-2 mb-2.5 items-start">
                ${msg.senderPhoto
                  ? `<img src="${escapeHTML(msg.senderPhoto)}" class="w-7 h-7 rounded-full object-cover shrink-0" alt="">`
                  : `<div class="w-7 h-7 rounded-full bg-[#1e2a3a] flex items-center justify-center text-[0.7rem] font-bold shrink-0 text-slate-400">${escapeHTML((msg.senderName || '?')[0])}</div>`}
                <div class="flex-1 min-w-0">
                  <div class="text-[0.75rem] font-semibold text-slate-200 mb-0.5">${escapeHTML(msg.senderName || t('traveler'))}</div>
                  <div class="text-sm text-slate-400 leading-relaxed">${escapeHTML(msg.text || '')}</div>
                </div>
              </div>
            `).join('')}
            ${(state.buddyChatMessages || []).length === 0 ? `<div class="text-slate-600 text-sm text-center py-3">${t('noBuddyMessages') || 'Aucun message. Sois le premier !'}</div>` : ''}
          </div>
          <div class="flex gap-2">
            <input type="text" id="buddy-chat-input" class="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-[10px] px-3.5 py-2.5 text-slate-200 text-sm" placeholder="${t('writeMessage') || 'Ecris un message...'}" maxlength="1000" onkeydown="if(event.key==='Enter')sendBuddyChatMessage('${escapeJSString(buddy.id)}')" />
            <button onclick="sendBuddyChatMessage('${escapeJSString(buddy.id)}')" class="w-11 h-11 rounded-[10px] bg-amber-500 text-[#0f1520] border-0 flex items-center justify-center cursor-pointer shrink-0" aria-label="${t('send') || 'Envoyer'}">
              ${icon('send', 'w-4 h-4')}
            </button>
          </div>
        </div>

      </div>

      <!-- Fixed bottom CTA -->
      <div class="fixed bottom-0 left-0 right-0 z-20 px-4 pt-4 pb-9 bg-[linear-gradient(to_top,#0f1520_80%,transparent)]">
        ${isOwn ? `
          <button onclick="closeBuddyAnnouncement('${escapeJSString(buddy.id)}')" class="w-full bg-[rgba(34,197,94,0.15)] text-emerald-500 border border-[rgba(34,197,94,0.2)] rounded-xl p-4 text-base font-bold cursor-pointer mb-2 min-h-[48px] flex items-center justify-center gap-2">
            ${icon('check-circle', 'w-4.5 h-4.5')}
            ${t('closeBuddyLabel') || 'Compagnon trouve'}
          </button>
          <button onclick="deleteBuddyAnnouncement('${escapeJSString(buddy.id)}')" class="w-full bg-[rgba(248,113,113,0.15)] text-red-400 border border-[rgba(248,113,113,0.2)] rounded-xl p-4 text-base font-bold cursor-pointer mb-2 min-h-[48px] flex items-center justify-center gap-2">
            ${icon('trash', 'w-4.5 h-4.5')}
            ${t('deleteAnnouncement') || 'Supprimer mon annonce'}
          </button>
        ` : `
          <button onclick="contactBuddyAuthor('${escapeJSString(buddy.userId)}')" class="w-full bg-amber-500 text-[#0f1520] border-0 rounded-xl p-4 text-base font-bold cursor-pointer mb-2 min-h-[48px] flex items-center justify-center gap-2 transition-opacity">
            ${icon('send', 'w-4.5 h-4.5')}
            ${t('contactAuthor') || 'Contacter'} ${escapeHTML(buddy.userName || '')}
          </button>
          <button onclick="openReport('buddy', '${escapeJSString(buddy.id)}')" class="flex items-center justify-center gap-1 mx-auto bg-transparent border-0 text-slate-600 text-xs cursor-pointer p-2 min-h-[44px]">
            ${icon('flag', 'w-3 h-3')}
            ${t('reportAnnouncement') || 'Signaler cette annonce'}
          </button>
        `}
      </div>
    </div>
  `
}

// ==================== VIEW 5: BUDDY CREATE ====================

function renderBuddyCreate(state) {
  const formData = state.buddyFormData || {}
  const selectedMode = formData.mode || 'autostop'
  const flexDates = formData.flexDates || false
  const selectedVisibility = formData.visibility || ['tous']
  const today = new Date().toISOString().split('T')[0]

  return `
    <div class="flex-1 overflow-y-auto pb-[100px]">
      <!-- Header -->
      <div class="flex items-center justify-between px-5 pt-4 pb-3 border-b border-white/[0.06]">
        <button onclick="backFromVoyageurs()" class="w-11 h-11 rounded-xl bg-white/[0.06] flex items-center justify-center cursor-pointer border-0 text-slate-200" aria-label="${t('back')}">
          ${icon('arrow-left', 'w-5 h-5')}
        </button>
        <h2 class="text-xl font-bold">${t('createAnnouncement') || 'Creer une annonce'}</h2>
        <div class="w-11"></div>
      </div>

      <div class="p-4">

        <!-- Departure -->
        <div class="mb-[18px]">
          <div class="flex items-center gap-1.5 text-slate-400 text-sm font-semibold mb-2">
            ${icon('map-pin', 'w-4 h-4')}
            ${t('departure') || 'Depart'} <span class="text-red-500 text-[0.75rem]">*</span>
          </div>
          <input type="text" id="buddy-departure" class="w-full bg-[#161b28] border border-white/10 rounded-xl px-4 py-3.5 text-slate-200 text-sm min-h-[48px]" placeholder="${t('departurePlaceholder') || 'Ville de depart...'}" />
        </div>

        <!-- Destination -->
        <div class="mb-[18px]">
          <div class="flex items-center gap-1.5 text-slate-400 text-sm font-semibold mb-2">
            ${icon('map-pin', 'w-4 h-4')}
            ${t('destination') || 'Destination'} <span class="text-red-500 text-[0.75rem]">*</span>
          </div>
          <input type="text" id="buddy-destination" class="w-full bg-[#161b28] border border-white/10 rounded-xl px-4 py-3.5 text-slate-200 text-sm min-h-[48px]" placeholder="${t('destinationPlaceholder') || "Ville d'arrivee..."}" />
        </div>

        <!-- Dates row -->
        <div class="flex gap-2.5 mb-1">
          <div class="flex-1">
            <div class="flex items-center gap-1.5 text-slate-400 text-sm font-semibold mb-2">
              ${icon('calendar', 'w-3.5 h-3.5')}
              ${t('from') || 'Du'} <span class="text-red-500 text-[0.75rem]">*</span>
            </div>
            ${flexDates ? `<div class="text-slate-400 text-[0.75rem] font-semibold mb-1">${t('around') || 'Autour du'}</div>` : ''}
            <input type="date" id="buddy-date-from" min="${today}" class="w-full bg-[#161b28] border border-white/10 rounded-xl px-4 py-3.5 text-slate-200 text-sm min-h-[48px]" />
          </div>
          <div class="flex-1">
            <div class="flex items-center gap-1.5 text-slate-400 text-sm font-semibold mb-2">
              ${icon('calendar', 'w-3.5 h-3.5')}
              ${t('to') || 'Au'} <span class="text-red-500 text-[0.75rem]">*</span>
            </div>
            ${flexDates ? `<div class="text-slate-400 text-[0.75rem] font-semibold mb-1">${t('around') || 'Autour du'}</div>` : ''}
            <input type="date" id="buddy-date-to" min="${today}" class="w-full bg-[#161b28] border border-white/10 rounded-xl px-4 py-3.5 text-slate-200 text-sm min-h-[48px]" />
          </div>
        </div>

        <!-- Flexible dates toggle -->
        <div class="flex items-center gap-2.5 py-2.5 mt-1 mb-[18px]">
          <div onclick="toggleBuddyFlexDates()" tabindex="0" class="w-10 h-[22px] rounded-[11px] relative cursor-pointer shrink-0 transition-all" style="background:${flexDates ? '#f59e0b' : '#334155'}" role="switch" aria-checked="${flexDates}">
            <div class="w-4 h-4 rounded-full bg-white absolute top-[3px] transition-transform" style="transform:translateX(${flexDates ? '21px' : '3px'})"></div>
          </div>
          <div>
            <div class="text-sm text-slate-200 font-semibold">${t('flexibleDates') || 'Dates flexibles'}</div>
            ${flexDates ? `<div class="text-slate-400 text-[0.75rem] mt-1 leading-tight">${t('flexibleDatesHint') || 'Les dates sont approximatives'}</div>` : ''}
          </div>
        </div>

        <!-- Travel mode pills -->
        <div class="mb-[18px]">
          <div class="flex items-center gap-1.5 text-slate-400 text-sm font-semibold mb-2">
            ${icon('route', 'w-4 h-4')}
            ${t('travelMode') || 'Mode de voyage'}
          </div>
          <div class="flex gap-1.5">
            ${['autostop', 'mixte', 'autre'].map(mode => {
    const labels = { autostop: 'Auto-stop', mixte: 'Mixte', autre: t('other') || 'Autre' }
    const isSelected = selectedMode === mode
    return `
                <button onclick="setBuddyTravelMode('${mode}')" class="flex-1 px-2 py-3 rounded-xl text-sm font-semibold cursor-pointer text-center min-h-[48px] flex items-center justify-center transition-all" style="border:1px solid ${isSelected ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.1)'};background:${isSelected ? 'rgba(245,158,11,0.12)' : '#161b28'};color:${isSelected ? '#f59e0b' : '#94a3b8'}">${labels[mode] || mode}</button>
              `
  }).join('')}
          </div>
        </div>

        <div class="h-px bg-white/[0.06] my-5"></div>

        <!-- Description -->
        <div class="mb-[18px]">
          <div class="flex items-center gap-1.5 text-slate-400 text-sm font-semibold mb-2">
            ${icon('message-circle', 'w-4 h-4')}
            ${t('description') || 'Description'}
          </div>
          <textarea id="buddy-description" class="w-full bg-[#161b28] border border-white/10 rounded-xl px-4 py-3.5 text-slate-200 text-sm min-h-[80px] leading-relaxed resize-y" placeholder="${t('buddyDescPlaceholder') || 'Presente toi et decris ton voyage...'}"></textarea>
          <div class="text-slate-600 text-[0.75rem] mt-1.5 leading-relaxed">${t('buddyDescHelper') || 'Parle de toi, de ton itineraire, de tes passions. Ca aide les autres a te connaitre.'}</div>
        </div>

        <!-- Preferences -->
        <div class="mb-[18px]">
          <div class="flex items-center gap-1.5 text-slate-400 text-sm font-semibold mb-2">
            ${icon('users', 'w-4 h-4')}
            ${t('whatImLookingFor') || 'Ce que je cherche'}
          </div>
          <textarea id="buddy-preferences" class="w-full bg-[#161b28] border border-white/10 rounded-xl px-4 py-3.5 text-slate-200 text-sm min-h-[80px] leading-relaxed resize-y" placeholder="${t('buddyPrefsPlaceholder') || 'Type de compagnon, preferences...'}"></textarea>
        </div>

        <div class="h-px bg-white/[0.06] my-5"></div>

        <!-- Visibility pills -->
        <div class="mb-[18px]">
          <div class="flex items-center gap-1.5 text-slate-400 text-sm font-semibold mb-2">
            ${icon('eye', 'w-4 h-4')}
            ${t('visibleBy') || 'Visible par'}
          </div>
          <div class="flex gap-1.5">
            ${renderVisibilityPill('tous', t('visibilityAll') || 'Tous', selectedVisibility, 'setBuddyVisibility')}
            ${renderVisibilityPill('femmes', t('visibilityWomen') || 'Femmes', selectedVisibility, 'setBuddyVisibility')}
            ${renderVisibilityPill('verifies', t('visibilityVerified') || 'Verifies', selectedVisibility, 'setBuddyVisibility')}
          </div>
          <div class="text-slate-400 text-[0.72rem] leading-relaxed mt-2 px-0.5">${t('visibilityWomenHint') || "L'option Femmes est reservee aux utilisatrices ayant indique Femme dans leur profil."}</div>
          ${selectedVisibility.includes('femmes') ? `
            <div class="text-violet-400 text-[0.72rem] leading-relaxed mt-1.5 px-3 py-2 bg-[rgba(167,139,250,0.08)] border border-[rgba(167,139,250,0.15)] rounded-lg flex items-start gap-1.5">
              ${icon('shield', 'w-3.5 h-3.5 shrink-0')}
              <span>${t('visibilityWomenReassure') || 'Seules les femmes verifiees verront ton profil et ta position.'}</span>
            </div>
          ` : ''}
        </div>

        <!-- Submit button -->
        <button onclick="submitBuddyAnnouncement()" class="w-full bg-amber-500 text-[#0f1520] border-0 rounded-xl p-4 text-base font-bold cursor-pointer mt-2 min-h-[48px] flex items-center justify-center gap-2 transition-opacity">
          ${icon('send', 'w-4.5 h-4.5')}
          ${t('publishAnnouncement') || "Publier l'annonce"}
        </button>

        <!-- Privacy info -->
        <div class="flex items-start gap-2 bg-[rgba(59,130,246,0.06)] border border-[rgba(59,130,246,0.12)] rounded-xl px-3.5 py-3 mt-4">
          <span class="shrink-0 text-blue-400">${icon('shield', 'w-4.5 h-4.5')}</span>
          <div class="text-slate-400 text-xs leading-relaxed">${t('buddyPrivacyNote') || 'Ton annonce sera visible par les membres selon le filtre choisi. Tu peux la modifier ou la supprimer a tout moment.'}</div>
        </div>

      </div>
    </div>
  `
}

// ==================== SHARED HELPERS ====================

function renderBuddyCard(buddy, showCountry = false) {
  const initial = (buddy.userName || '?')[0].toUpperCase()
  const modeLabels = { autostop: 'Auto-stop', mixte: 'Mixte', autre: 'Autre' }
  const langStr = Array.isArray(buddy.languages) && buddy.languages.length > 0
    ? buddy.languages.slice(0, 3).join(', ')
    : ''

  return `
    <div onclick="showBuddyDetail('${escapeJSString(buddy.id)}')" role="button" tabindex="0" aria-label="${escapeHTML(buddy.departure || '')} ${escapeHTML(buddy.destination || '')}" class="bg-[#161b28] border border-white/10 rounded-xl p-3.5 mb-2.5 cursor-pointer transition-colors">
      <div class="flex items-center gap-2.5 mb-2">
        ${buddy.photoURL
          ? `<img src="${escapeHTML(buddy.photoURL)}" class="w-[38px] h-[38px] rounded-full object-cover shrink-0" alt="" onerror="this.outerHTML='<div class=\\'w-[38px] h-[38px] rounded-full bg-[#1e2a3a] flex items-center justify-center text-sm font-bold shrink-0 text-slate-400\\'>${initial}</div>'">`
          : `<div class="w-[38px] h-[38px] rounded-full bg-[#1e2a3a] flex items-center justify-center text-sm font-bold shrink-0 text-slate-400">${initial}</div>`}
        <div>
          <div class="font-semibold text-sm">
            ${escapeHTML(buddy.userName || t('traveler'))}
          </div>
          <div class="text-slate-400 text-[0.74rem]">${langStr ? escapeHTML(langStr) : ''}${showCountry && buddy.country ? (langStr ? ' · ' : '') + escapeHTML(buddy.country) : ''}</div>
        </div>
      </div>
      <div class="flex items-center gap-1.5 text-sm font-semibold mb-1">
        ${escapeHTML(buddy.departure || '')} <span class="text-amber-500">&rarr;</span> ${escapeHTML(buddy.destination || '')}
      </div>
      <div class="flex items-center gap-1.5 text-slate-400 text-[0.76rem] mb-1.5">
        ${icon('calendar', 'w-3 h-3')}
        ${buddy.dateFrom || ''} ${buddy.dateTo ? '&rarr; ' + buddy.dateTo : ''}
      </div>
      ${buddy.message ? `<div class="text-slate-400 text-sm leading-relaxed line-clamp-2">${escapeHTML(buddy.message)}</div>` : ''}
      <div class="flex items-center justify-between mt-2.5">
        <span class="inline-flex items-center gap-1 px-2.5 py-[3px] rounded-lg text-[0.72rem] font-semibold bg-[rgba(245,158,11,0.12)] text-amber-500">${modeLabels[buddy.mode] || buddy.mode || 'Auto-stop'}</span>
        <button onclick="event.stopPropagation();showBuddyDetail('${escapeJSString(buddy.id)}')" class="bg-[rgba(245,158,11,0.1)] text-amber-500 border border-[rgba(245,158,11,0.15)] rounded-lg px-3.5 py-1.5 text-xs font-semibold cursor-pointer min-h-[36px] flex items-center gap-1">
          ${icon('eye', 'w-3 h-3')}
          ${t('view') || 'Voir'}
        </button>
      </div>
    </div>
  `
}

function renderVisibilityPill(value, label, selectedArray, handlerName) {
  const isSelected = selectedArray.includes(value)
  return `<button onclick="${escapeJSString(handlerName)}('${escapeJSString(value)}')" class="flex-1 px-2 py-2.5 rounded-xl text-[0.8rem] font-semibold cursor-pointer text-center min-h-[44px] flex items-center justify-center transition-all" style="border:1px solid ${isSelected ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.1)'};background:${isSelected ? 'rgba(245,158,11,0.12)' : '#161b28'};color:${isSelected ? '#f59e0b' : '#94a3b8'}">${escapeHTML(label)}</button>`
}

// ==================== WINDOW HANDLERS ====================

// --- Radar handlers ---

window.toggleProximityRadar = async () => {
  const { getState, setState } = await import('../../../stores/state.js')
  const state = getState()

  if (!state.isLoggedIn) {
    window.requireAuth?.('social')
    return
  }

  const { getRadarSettings: getSettings } = await import('../../../services/proximityRadar.js')
  const settings = getSettings()

  if (settings.enabled) {
    // Deactivate
    const { deactivateRadar } = await import('../../../services/proximityRadar.js')
    const result = await deactivateRadar()
    if (result.success) {
      setState({ radarEnabled: false, nearbyTravelers: [] })
      window.showToast?.(t('radarDeactivated') || 'Radar desactive', 'info')
    } else {
      window.showToast?.(t('errorOccurred') || 'Erreur', 'error')
    }
  } else {
    // Warn if Guardian mode is active
    try {
      const { isGuardianActive } = await import('../../../services/guardian.js')
      if (isGuardianActive()) {
        window.showToast?.(t('radarGuardianWarning') || 'Attention : le mode Gardien est actif. Le radar te rend visible par tous les voyageurs.', 'warning')
      }
    } catch { /* guardian not loaded */ }

    // Activate
    const { isRadarInCooldown: checkCooldown, getRemainingCooldownMinutes: getMins } = await import('../../../services/proximityRadar.js')
    if (checkCooldown()) {
      window.showToast?.(`${t('radarCooldown') || 'Attends encore'} ${getMins()} min`, 'warning')
      return
    }
    const { activateRadar } = await import('../../../services/proximityRadar.js')
    const result = await activateRadar()
    if (result.success) {
      setState({ radarEnabled: true })
      window.showToast?.(t('radarActivated') || 'Radar active', 'success')
      // Fetch nearby travelers
      _refreshNearbyTravelers()
    } else if (result.error === 'cooldown') {
      window.showToast?.(`${t('radarCooldown') || 'Attends encore'} ${result.remainingMinutes} min`, 'warning')
    } else if (result.error === 'gps') {
      window.showToast?.(t('gpsRequired') || 'Active la geolocalisation', 'warning')
    } else {
      window.showToast?.(t('errorOccurred') || 'Erreur', 'error')
    }
  }
}

window.setRadarRadius = async (r) => {
  const { saveRadarSettings } = await import('../../../services/proximityRadar.js')
  saveRadarSettings({ radius: Number(r) })
  window.setState?.({})
  _refreshNearbyTravelers()
}

window.setRadarVisibility = async (v) => {
  const { getRadarSettings: getSettings, saveRadarSettings } = await import('../../../services/proximityRadar.js')
  const settings = getSettings()
  const current = settings.visibility || ['tous']
  const updated = _toggleMultiSelect(current, v)
  saveRadarSettings({ visibility: updated })
  window.setState?.({})
}

window.setRadarMessage = async (msg) => {
  const { saveRadarSettings } = await import('../../../services/proximityRadar.js')
  saveRadarSettings({ message: msg })
}

window.showRadarExpanded = () => {
  window.setState?.({ voyageursView: 'radar' })
}

window.contactNearbyTraveler = (uid) => {
  // Check blocked users before opening DM
  try {
    const blocked = JSON.parse(localStorage.getItem('spothitch_blocked_users') || '[]')
    const ids = blocked.map(b => typeof b === 'string' ? b : b.id || b.uid).filter(Boolean)
    if (ids.includes(uid)) {
      window.showToast?.(t('userBlocked') || 'Utilisateur bloque', 'warning')
      return
    }
  } catch { /* ignore */ }
  window.showToast?.(t('openingConversation') || 'Ouverture de la conversation...', 'info')
  window.setState?.({ socialSubTab: 'messagerie', activeDMConversation: uid })
}

// --- Buddy handlers ---

window.showBuddyList = async () => {
  window.setState?.({ voyageursView: 'buddyList' })
  try {
    const { getTravelBuddies } = await import('../../../services/travelBuddies.js')
    const buddies = await getTravelBuddies()
    window.setState?.({ travelBuddies: buddies })
  } catch {
    // Keep existing data
  }
}

window.showBuddyDetail = async (buddyId) => {
  window.setState?.({ voyageursView: 'buddyDetail', buddyChatMessages: [] })
  try {
    const { getTravelBuddyById, getBuddyMessages } = await import('../../../services/travelBuddies.js')
    const buddy = await getTravelBuddyById(buddyId)
    if (buddy) {
      window.setState?.({ selectedBuddyDetail: buddy })
      // Load chat messages
      const messages = await getBuddyMessages(buddyId)
      window.setState?.({ buddyChatMessages: messages })
      // Start real-time listener for chat
      const { subscribeToBuddyMessages } = await import('../../../services/travelBuddies.js')
      if (window._buddyChatUnsub) window._buddyChatUnsub()
      window._buddyChatUnsub = subscribeToBuddyMessages(buddyId, (msgs) => {
        window.setState?.({ buddyChatMessages: msgs })
        // Auto-scroll chat
        setTimeout(() => {
          const el = document.getElementById('buddy-chat-messages')
          if (el) el.scrollTop = el.scrollHeight
        }, 100)
      })
    }
  } catch {
    window.showToast?.(t('errorOccurred') || 'Erreur', 'error')
  }
}

window.showBuddyCreate = () => {
  window.setState?.({ voyageursView: 'create', buddyFormData: { mode: 'autostop', flexDates: false, visibility: ['tous'] } })
}

window.submitBuddyAnnouncement = async () => {
  if (window.submitBuddyAnnouncement._busy) return
  window.submitBuddyAnnouncement._busy = true
  setTimeout(() => { window.submitBuddyAnnouncement._busy = false }, 2000)

  const { getState, setState } = await import('../../../stores/state.js')
  const state = getState()

  if (!state.isLoggedIn) {
    window.requireAuth?.('social')
    return
  }

  const departure = document.getElementById('buddy-departure')?.value?.trim()
  const destination = document.getElementById('buddy-destination')?.value?.trim()
  const dateFrom = document.getElementById('buddy-date-from')?.value
  const dateTo = document.getElementById('buddy-date-to')?.value
  const description = document.getElementById('buddy-description')?.value?.trim()
  const preferences = document.getElementById('buddy-preferences')?.value?.trim()
  const formData = state.buddyFormData || {}

  if (!departure || !destination) {
    window.showToast?.(t('fillFromTo') || 'Remplis le depart et la destination', 'warning')
    return
  }
  if (!dateFrom) {
    window.showToast?.(t('fillDates') || 'Indique au moins une date de depart', 'warning')
    return
  }
  // Validate dates
  const today = new Date().toISOString().split('T')[0]
  if (dateFrom < today) {
    window.showToast?.(t('dateMustBeFuture') || 'La date doit etre dans le futur', 'warning')
    return
  }
  if (dateTo && dateTo < dateFrom) {
    window.showToast?.(t('dateEndBeforeStart') || 'La date de fin doit etre apres le depart', 'warning')
    return
  }
  // Validate field lengths
  if (departure.length > 100 || destination.length > 100) {
    window.showToast?.(t('fieldTooLong') || 'Champ trop long (100 max)', 'warning')
    return
  }

  const { createTravelBuddy } = await import('../../../services/travelBuddies.js')
  const result = await createTravelBuddy({
    departure,
    destination,
    dateFrom,
    dateTo: dateTo || '',
    message: description || '',
    preferences: preferences || '',
    mode: formData.mode || 'autostop',
    flexDates: formData.flexDates || false,
    visibility: formData.visibility || ['tous'],
  })

  if (result.success) {
    setState({ voyageursView: 'combined', buddyFormData: null })
    window.showToast?.(t('announcementPublished') || 'Annonce publiee !', 'success')
    // Refresh buddies list
    try {
      const { getTravelBuddies } = await import('../../../services/travelBuddies.js')
      const buddies = await getTravelBuddies()
      setState({ travelBuddies: buddies })
    } catch { /* keep existing */ }
  } else {
    window.showToast?.(t('errorOccurred') || 'Erreur', 'error')
  }
}

window.deleteBuddyAnnouncement = async (id) => {
  if (!confirm(t('confirmDeleteAnnouncement') || 'Supprimer cette annonce ?')) return

  const { deleteTravelBuddy } = await import('../../../services/travelBuddies.js')
  const result = await deleteTravelBuddy(id)
  if (result.success) {
    window.setState?.({ voyageursView: 'combined', selectedBuddyDetail: null })
    window.showToast?.(t('announcementDeleted') || 'Annonce supprimee', 'info')
    // Refresh
    try {
      const { getTravelBuddies } = await import('../../../services/travelBuddies.js')
      const buddies = await getTravelBuddies()
      window.setState?.({ travelBuddies: buddies })
    } catch { /* keep existing */ }
  } else {
    window.showToast?.(t('errorOccurred') || 'Erreur', 'error')
  }
}

window.closeBuddyAnnouncement = async (id) => {
  const { closeTravelBuddy } = await import('../../../services/travelBuddies.js')
  const result = await closeTravelBuddy(id)
  if (result.success) {
    window.setState?.({ voyageursView: 'combined', selectedBuddyDetail: null })
    window.showToast?.(t('buddyFound') || 'Compagnon trouve ! Annonce fermee.', 'success')
    try {
      const { getTravelBuddies } = await import('../../../services/travelBuddies.js')
      const buddies = await getTravelBuddies()
      window.setState?.({ travelBuddies: buddies })
    } catch { /* keep existing */ }
  } else {
    window.showToast?.(t('errorOccurred') || 'Erreur', 'error')
  }
}

window.sendBuddyChatMessage = async (buddyId) => {
  const input = document.getElementById('buddy-chat-input')
  const text = input?.value?.trim()
  if (!text) return

  const { getState } = await import('../../../stores/state.js')
  if (!getState().isLoggedIn) {
    window.requireAuth?.('social')
    return
  }

  const { sendBuddyMessage } = await import('../../../services/travelBuddies.js')
  const result = await sendBuddyMessage(buddyId, text)
  if (result.success) {
    if (input) input.value = ''
  } else {
    window.showToast?.(t('errorOccurred') || 'Erreur', 'error')
  }
}

window.setBuddyCountryFilter = (code) => {
  window.setState?.({ buddyCountryFilter: code })
}

window.contactBuddyAuthor = (uid) => {
  try {
    const blocked = JSON.parse(localStorage.getItem('spothitch_blocked_users') || '[]')
    const ids = blocked.map(b => typeof b === 'string' ? b : b.id || b.uid).filter(Boolean)
    if (ids.includes(uid)) {
      window.showToast?.(t('userBlocked') || 'Utilisateur bloque', 'warning')
      return
    }
  } catch { /* ignore */ }
  window.showToast?.(t('openingConversation') || 'Ouverture de la conversation...', 'info')
  window.setState?.({ socialSubTab: 'messagerie', activeDMConversation: uid, voyageursView: 'combined' })
}

window.setBuddyTravelMode = async (mode) => {
  const { getState, setState } = await import('../../../stores/state.js')
  const formData = getState().buddyFormData || {}
  setState({ buddyFormData: { ...formData, mode } })
}

window.toggleBuddyFlexDates = async () => {
  const { getState, setState } = await import('../../../stores/state.js')
  const formData = getState().buddyFormData || {}
  setState({ buddyFormData: { ...formData, flexDates: !formData.flexDates } })
}

window.setBuddyVisibility = async (v) => {
  const { getState, setState } = await import('../../../stores/state.js')
  const formData = getState().buddyFormData || {}
  const current = formData.visibility || ['tous']
  const updated = _toggleMultiSelect(current, v)
  setState({ buddyFormData: { ...formData, visibility: updated } })
}

window.backFromVoyageurs = () => {
  // Cleanup chat listener
  if (window._buddyChatUnsub) { window._buddyChatUnsub(); window._buddyChatUnsub = null }
  window.setState?.({ voyageursView: 'combined', selectedBuddyDetail: null, buddyChatMessages: [] })
}

// Share buddy announcement (stub)
window.shareBuddyAnnouncement = (_id) => {
  if (navigator.share) {
    navigator.share({ title: 'SpotHitch', text: t('checkBuddyAnnouncement') || 'Regarde cette annonce de voyage !', url: window.location.href }).catch(() => {})
  } else {
    window.showToast?.(t('shareCopied') || 'Lien copie !', 'success')
  }
}

// ==================== INTERNAL HELPERS ====================

function _toggleMultiSelect(current, value) {
  if (value === 'tous') {
    return ['tous']
  }
  // Remove 'tous' from array
  let arr = current.filter(v => v !== 'tous')
  if (arr.includes(value)) {
    arr = arr.filter(v => v !== value)
  } else {
    arr.push(value)
  }
  // If nothing left, default to tous
  if (arr.length === 0) return ['tous']
  return arr
}

async function _refreshNearbyTravelers() {
  try {
    const { getNearbyTravelers } = await import('../../../services/proximityRadar.js')
    const travelers = await getNearbyTravelers()
    window.setState?.({ nearbyTravelers: travelers })
  } catch {
    // Silently fail
  }
}

export default { renderVoyageurs }
