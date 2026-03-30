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
    <div class="flex-1 overflow-y-auto" style="padding-bottom:100px">
      <div style="padding:16px">

        <!-- Radar compact card -->
        <div onclick="showRadarExpanded()" style="background:#161b28;border:1px solid rgba(245,158,11,0.15);border-radius:12px;padding:16px;margin-bottom:8px;cursor:pointer;transition:border-color 0.2s">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
            <div style="display:flex;align-items:center;gap:10px">
              <span style="color:#f59e0b">${icon('radar', 'w-5 h-5')}</span>
              <span style="font-weight:700;font-size:0.95rem">${t('proximityRadar') || 'Radar de proximite'}</span>
            </div>
            <div onclick="event.stopPropagation();toggleProximityRadar()" style="width:48px;height:26px;border-radius:13px;position:relative;cursor:pointer;flex-shrink:0;transition:all 0.3s;background:${radarOn ? '#f59e0b' : '#334155'};${radarOn ? 'box-shadow:0 0 12px rgba(245,158,11,0.25)' : ''}" role="switch" aria-checked="${radarOn}" aria-label="${t('proximityRadar')}">
              <div style="width:20px;height:20px;border-radius:50%;background:white;position:absolute;top:3px;transition:transform 0.3s;transform:translateX(${radarOn ? '25px' : '3px'})"></div>
            </div>
          </div>
          <div style="display:flex;align-items:center;justify-content:space-between;gap:8px">
            <span style="color:#94a3b8;font-size:0.82rem">${radarOn ? `${t('active') || 'Actif'} · ${t('radius') || 'Rayon'} ${settings.radius} km` : t('radarInactive') || 'Inactif'}</span>
            ${radarOn && nearbyTravelers.length > 0 ? `
              <span style="display:flex;align-items:center;gap:6px;background:rgba(245,158,11,0.1);color:#f59e0b;font-size:0.78rem;font-weight:600;padding:4px 12px;border-radius:10px;flex-shrink:0">
                ${icon('users', 'w-3.5 h-3.5')}
                ${nearbyTravelers.length} ${t('travelers') || 'voyageurs'}
              </span>
            ` : ''}
          </div>

          <!-- Visibility note -->
          <div style="display:flex;align-items:flex-start;gap:8px;color:#94a3b8;font-size:0.78rem;line-height:1.4;margin-top:10px;padding:10px 14px;background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.12);border-radius:10px">
            ${icon('eye', 'w-3.5 h-3.5 shrink-0')}
            <span>${t('radarVisibilityNote') || 'En activant le radar, tu es visible par les autres voyageurs et tu peux les voir.'}</span>
          </div>

          ${inCooldown ? `
            <div style="display:flex;align-items:center;gap:6px;color:#f87171;font-size:0.78rem;font-weight:600;margin-top:8px;padding:8px 12px;background:rgba(248,113,113,0.08);border:1px solid rgba(248,113,113,0.15);border-radius:8px">
              ${icon('clock', 'w-3.5 h-3.5')}
              <span>${t('radarCooldown') || 'Tu pourras reactiver le radar dans'} ${cooldownMins} min</span>
            </div>
          ` : ''}
        </div>

        <!-- Nearby travelers strip (only when radar ON) -->
        ${radarOn && nearbyTravelers.length > 0 ? `
          <div style="display:flex;gap:8px;overflow-x:auto;padding:8px 0 12px;margin-bottom:4px" class="scrollbar-hide">
            ${nearbyTravelers.map(trav => `
              <div onclick="contactNearbyTraveler('${escapeJSString(trav.userId)}')" style="display:flex;align-items:center;gap:8px;background:#161b28;border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:8px 12px;flex-shrink:0;cursor:pointer;min-height:48px;transition:border-color 0.2s">
                <div style="width:32px;height:32px;border-radius:50%;background:#1e2a3a;display:flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:700;flex-shrink:0;color:#94a3b8">${escapeHTML((trav.userName || '?')[0].toUpperCase())}</div>
                <div>
                  <div style="font-weight:600;font-size:0.8rem;white-space:nowrap">${escapeHTML(trav.userName || t('traveler'))}</div>
                  <div style="color:#94a3b8;font-size:0.72rem;white-space:nowrap">${trav.displayDistance === null ? `< 5 km` : `~${trav.displayDistance} km`}</div>
                </div>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${radarOn && nearbyTravelers.length === 0 ? `
          <div style="text-align:center;padding:16px;color:#94a3b8;font-size:0.85rem">
            ${t('noNearbyTravelers') || 'Aucun voyageur dans ton rayon pour le moment.'}
          </div>
        ` : ''}

        ${!radarOn ? `
          <div style="text-align:center;padding:20px 16px;color:#94a3b8;font-size:0.85rem;line-height:1.5">
            ${icon('radar', 'w-10 h-10 text-slate-600')}
            <div style="font-weight:600;color:#e2e8f0;margin-top:12px;margin-bottom:6px">${t('radarDisabled') || 'Radar desactive'}</div>
            ${t('radarActivatePrompt') || 'Active le radar pour voir les voyageurs autour de toi. Tu seras aussi visible par eux.'}
          </div>
        ` : ''}

        <!-- Divider -->
        <div style="height:1px;background:rgba(255,255,255,0.06);margin:16px 0"></div>

        <!-- Travel buddies section -->
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
          <div style="font-size:1.05rem;font-weight:700;display:flex;align-items:center;gap:8px">
            ${icon('route', 'w-5 h-5')}
            ${t('travelBuddies') || 'Compagnons de voyage'}
          </div>
          <button onclick="showBuddyList()" style="color:#f59e0b;font-size:0.82rem;font-weight:600;cursor:pointer;padding:8px;min-height:44px;display:flex;align-items:center;background:none;border:none;font-family:inherit">${t('viewAll') || 'Voir tout'}</button>
        </div>

        <!-- Recent buddy cards (max 2) -->
        ${buddies.slice(0, 2).map(buddy => renderBuddyCard(buddy)).join('')}

        ${buddies.length === 0 ? `
          <div style="text-align:center;padding:24px 16px;color:#94a3b8;font-size:0.85rem">
            ${icon('route', 'w-8 h-8 text-slate-600')}
            <div style="margin-top:8px">${t('noBuddiesYet') || 'Aucune annonce de voyage pour le moment.'}</div>
          </div>
        ` : ''}

        <!-- Publish button -->
        <button onclick="showBuddyCreate()" style="width:100%;background:rgba(245,158,11,0.1);color:#f59e0b;border:1px dashed rgba(245,158,11,0.3);border-radius:12px;padding:14px;font-size:0.9rem;font-weight:600;cursor:pointer;font-family:inherit;text-align:center;margin-top:4px;min-height:48px;display:flex;align-items:center;justify-content:center;gap:6px">
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
    <div class="flex-1 overflow-y-auto" style="padding-bottom:100px">
      <!-- Header -->
      <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px 12px;border-bottom:1px solid rgba(255,255,255,0.06)">
        <button onclick="backFromVoyageurs()" style="width:44px;height:44px;border-radius:12px;background:rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:center;cursor:pointer;border:none;color:#e2e8f0" aria-label="${t('back')}">
          ${icon('arrow-left', 'w-5 h-5')}
        </button>
        <h2 style="font-size:1.25rem;font-weight:700;display:flex;align-items:center;gap:8px">
          <span style="color:#f59e0b">${icon('radar', 'w-5.5 h-5.5')}</span>
          ${t('radar') || 'Radar'}
        </h2>
        <div style="width:44px"></div>
      </div>

      <div style="padding:16px">

        <!-- Toggle ON/OFF -->
        <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 18px;background:#161b28;border-radius:12px;margin-bottom:16px;border:1px solid ${radarOn ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.1)'}">
          <div style="display:flex;align-items:center;gap:10px">
            <span style="color:${radarOn ? '#f59e0b' : '#94a3b8'};transition:color 0.3s">${icon('radar', 'w-5.5 h-5.5')}</span>
            <span style="font-weight:700;font-size:1rem">${radarOn ? (t('radarActive') || 'Radar actif') : (t('radarInactiveLabel') || 'Radar inactif')}</span>
          </div>
          <div onclick="toggleProximityRadar()" style="width:48px;height:26px;border-radius:13px;position:relative;cursor:pointer;flex-shrink:0;transition:all 0.3s;background:${radarOn ? '#f59e0b' : '#334155'};${radarOn ? 'box-shadow:0 0 12px rgba(245,158,11,0.25)' : ''}" role="switch" aria-checked="${radarOn}" aria-label="${t('toggleRadar') || 'Toggle radar'}">
            <div style="width:20px;height:20px;border-radius:50%;background:white;position:absolute;top:3px;transition:transform 0.3s;transform:translateX(${radarOn ? '25px' : '3px'})"></div>
          </div>
        </div>

        ${radarOn ? renderRadarActiveContent(state, settings, nearbyTravelers, selectedRadius, selectedVisibility) : renderRadarInactiveContent(inCooldown, cooldownMins)}

      </div>
    </div>
  `
}

function renderRadarActiveContent(state, settings, nearbyTravelers, selectedRadius, selectedVisibility) {
  const radiusOptions = [10, 25, 50, 100]

  return `
    <!-- Radar ON note -->
    <div style="display:flex;align-items:flex-start;gap:8px;color:#94a3b8;font-size:0.78rem;line-height:1.4;margin-bottom:14px;padding:10px 14px;background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.12);border-radius:10px">
      ${icon('eye', 'w-3.5 h-3.5 shrink-0')} <span>${t('radarVisibilityNote') || 'En activant le radar, tu es visible par les autres voyageurs et tu peux les voir.'}</span>
    </div>

    <!-- Message field -->
    <div style="background:#161b28;border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:14px 16px;margin-bottom:14px">
      <div style="color:#94a3b8;font-size:0.78rem;margin-bottom:8px;font-weight:600;display:flex;align-items:center;gap:6px">
        ${icon('message-circle', 'w-3.5 h-3.5')}
        ${t('radarVisibleMessage') || 'Ton message visible'}
      </div>
      <input type="text" id="radar-message" value="${escapeHTML(settings.message || '')}" onchange="setRadarMessage(this.value)" style="width:100%;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:10px 14px;color:#e2e8f0;font-size:0.88rem;font-family:inherit" placeholder="${t('radarMessagePlaceholder') || 'Ex: Dispo pour un cafe...'}" />
    </div>

    <!-- Radius pills -->
    <div style="margin-bottom:14px">
      <div style="color:#94a3b8;font-size:0.78rem;margin-bottom:8px;font-weight:600;display:flex;align-items:center;gap:6px">
        ${icon('radar', 'w-3.5 h-3.5')}
        ${t('detectionRadius') || 'Rayon de detection'}
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        ${radiusOptions.map(r => `
          <button onclick="setRadarRadius(${r})" style="padding:8px 16px;border-radius:20px;font-size:0.82rem;font-weight:600;cursor:pointer;min-height:44px;display:flex;align-items:center;transition:all 0.2s;border:1px solid ${selectedRadius === r ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.1)'};background:${selectedRadius === r ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.04)'};color:${selectedRadius === r ? '#f59e0b' : '#94a3b8'};font-family:inherit">${r} km</button>
        `).join('')}
      </div>
    </div>

    <!-- Visibility pills -->
    <div style="margin-bottom:14px">
      <div style="color:#94a3b8;font-size:0.78rem;margin-bottom:8px;font-weight:600;display:flex;align-items:center;gap:6px">
        ${icon('eye', 'w-3.5 h-3.5')}
        ${t('visibleBy') || 'Visible par'}
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        ${renderVisibilityPill('tous', t('visibilityAll') || 'Tous', selectedVisibility, 'setRadarVisibility')}
        ${renderVisibilityPill('femmes', t('visibilityWomen') || 'Femmes', selectedVisibility, 'setRadarVisibility')}
        ${renderVisibilityPill('verifies', t('visibilityVerified') || 'Verifies', selectedVisibility, 'setRadarVisibility')}
      </div>
      <div style="color:#94a3b8;font-size:0.72rem;line-height:1.4;margin-top:8px;padding:0 2px">${t('visibilityWomenHint') || "L'option Femmes est reservee aux utilisatrices ayant indique Femme dans leur profil."}</div>
      ${selectedVisibility.includes('femmes') ? `
        <div style="color:#a78bfa;font-size:0.72rem;line-height:1.4;margin-top:6px;padding:8px 12px;background:rgba(167,139,250,0.08);border:1px solid rgba(167,139,250,0.15);border-radius:8px;display:flex;align-items:flex-start;gap:6px">
          ${icon('shield', 'w-3.5 h-3.5 shrink-0')}
          <span>${t('visibilityWomenReassure') || 'Seules les femmes verifiees verront ton profil et ta position.'}</span>
        </div>
      ` : ''}
    </div>

    <!-- Nearby travelers list -->
    <div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
        <div style="font-size:1.05rem;font-weight:700;display:flex;align-items:center;gap:8px">
          ${icon('users', 'w-5 h-5')}
          ${t('nearbyTravelers') || 'Voyageurs autour de toi'}
        </div>
        ${nearbyTravelers.length > 0 ? `
          <span style="background:rgba(245,158,11,0.12);color:#f59e0b;font-size:0.75rem;font-weight:600;padding:4px 10px;border-radius:10px">${nearbyTravelers.length}</span>
        ` : ''}
      </div>

      ${nearbyTravelers.length > 0 ? nearbyTravelers.map(trav => `
        <div style="background:#161b28;border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:14px;margin-bottom:10px;display:flex;align-items:flex-start;gap:12px">
          <div style="width:44px;height:44px;border-radius:50%;background:#1e2a3a;display:flex;align-items:center;justify-content:center;font-size:0.9rem;font-weight:700;flex-shrink:0;color:#94a3b8">${escapeHTML((trav.userName || '?')[0].toUpperCase())}</div>
          <div style="flex:1;min-width:0">
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:3px">
              <span style="font-weight:600;font-size:0.9rem">${escapeHTML(trav.userName || t('traveler'))}</span>
            </div>
            <div style="color:#94a3b8;font-size:0.78rem;display:flex;align-items:center;gap:4px">
              ${icon('map-pin', 'w-3 h-3')}
              ${trav.displayDistance === null ? `< 5 km` : `~${trav.displayDistance} km`}
            </div>
            ${trav.message ? `<div style="color:#94a3b8;font-size:0.82rem;line-height:1.4;margin-top:6px;margin-bottom:10px">${escapeHTML(trav.message)}</div>` : '<div style="margin-bottom:10px"></div>'}
            <button onclick="contactNearbyTraveler('${escapeJSString(trav.userId)}')" style="background:rgba(245,158,11,0.12);color:#f59e0b;border:1px solid rgba(245,158,11,0.2);border-radius:10px;padding:10px 16px;font-size:0.82rem;font-weight:600;cursor:pointer;width:100%;min-height:44px;display:flex;align-items:center;justify-content:center;gap:6px;font-family:inherit;transition:background 0.2s">
              ${icon('message-circle', 'w-3.5 h-3.5')}
              ${t('contact') || 'Contacter'}
            </button>
          </div>
        </div>
      `).join('') : `
        <div style="text-align:center;padding:24px 16px;color:#94a3b8;font-size:0.85rem">
          ${t('noNearbyTravelers') || 'Aucun voyageur dans ton rayon pour le moment.'}
        </div>
      `}

      ${nearbyTravelers.length > 0 ? `
        <div style="text-align:center;color:#94a3b8;font-size:0.82rem;padding:12px 0">${nearbyTravelers.length} ${t('travelersInRadius') || 'voyageurs dans un rayon de'} ${settings.radius} km</div>
      ` : ''}
    </div>
  `
}

function renderRadarInactiveContent(inCooldown, cooldownMins) {
  return `
    <div style="display:flex;flex-direction:column;align-items:center;padding-top:16px">

      ${inCooldown ? `
        <div style="display:flex;align-items:center;gap:6px;color:#f87171;font-size:0.78rem;font-weight:600;margin-bottom:16px;padding:8px 12px;background:rgba(248,113,113,0.08);border:1px solid rgba(248,113,113,0.15);border-radius:8px;width:100%">
          ${icon('clock', 'w-3.5 h-3.5')}
          <span>${t('radarCooldown') || 'Tu pourras reactiver le radar dans'} ${cooldownMins} min</span>
        </div>
      ` : ''}

      <div style="margin-bottom:24px;opacity:0.5;color:#94a3b8">
        ${icon('radar', 'w-20 h-20')}
      </div>

      <div style="font-size:1.15rem;font-weight:700;margin-bottom:12px;text-align:center">${t('radarDiscoverTitle') || 'Decouvre les voyageurs autour de toi'}</div>
      <div style="color:#94a3b8;font-size:0.9rem;line-height:1.6;text-align:center;max-width:300px;margin-bottom:32px">${t('radarDiscoverDesc') || 'Active le radar pour voir les voyageurs autour de toi. Tu seras aussi visible par eux. Ideal pour se retrouver, partager un cafe ou faire route ensemble.'}</div>

      <!-- Features list -->
      <div style="width:100%;background:#161b28;border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:18px;margin-bottom:24px">
        <div style="display:flex;align-items:flex-start;gap:12px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04)">
          <span style="flex-shrink:0;margin-top:2px;color:#f59e0b">${icon('eye', 'w-5 h-5')}</span>
          <div style="font-size:0.85rem;line-height:1.5">
            <strong style="display:block;margin-bottom:2px">${t('radarFeatureVisible') || 'Sois visible'}</strong>
            <span style="color:#94a3b8">${t('radarFeatureVisibleDesc') || 'Les autres voyageurs verront que tu es dans leur zone.'}</span>
          </div>
        </div>
        <div style="display:flex;align-items:flex-start;gap:12px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04)">
          <span style="flex-shrink:0;margin-top:2px;color:#f59e0b">${icon('message-circle', 'w-5 h-5')}</span>
          <div style="font-size:0.85rem;line-height:1.5">
            <strong style="display:block;margin-bottom:2px">${t('radarFeatureMessage') || 'Partage un message'}</strong>
            <span style="color:#94a3b8">${t('radarFeatureMessageDesc') || "Dis ce que tu fais : « Dispo pour un cafe » ou « Je cherche un lift »."}</span>
          </div>
        </div>
        <div style="display:flex;align-items:flex-start;gap:12px;padding:10px 0">
          <span style="flex-shrink:0;margin-top:2px;color:#f59e0b">${icon('radar', 'w-5 h-5')}</span>
          <div style="font-size:0.85rem;line-height:1.5">
            <strong style="display:block;margin-bottom:2px">${t('radarFeatureRadius') || 'Choisis ton rayon'}</strong>
            <span style="color:#94a3b8">${t('radarFeatureRadiusDesc') || '10 km, 25 km, 50 km ou 100 km. A toi de regler.'}</span>
          </div>
        </div>
      </div>

      <!-- Privacy note -->
      <div style="display:flex;align-items:flex-start;gap:10px;background:rgba(59,130,246,0.08);border:1px solid rgba(59,130,246,0.15);border-radius:12px;padding:14px 16px;width:100%">
        <span style="flex-shrink:0;color:#60a5fa">${icon('shield', 'w-5 h-5')}</span>
        <div style="color:#94a3b8;font-size:0.82rem;line-height:1.5">${t('radarPrivacyNote') || "Ta position exacte n'est jamais partagee. Les autres voient uniquement que tu es dans leur zone. Tu peux desactiver le radar a tout moment."}</div>
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
    <div class="flex-1 overflow-y-auto" style="padding-bottom:100px">
      <!-- Header -->
      <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px 12px;border-bottom:1px solid rgba(255,255,255,0.06)">
        <button onclick="backFromVoyageurs()" style="width:44px;height:44px;border-radius:12px;background:rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:center;cursor:pointer;border:none;color:#e2e8f0" aria-label="${t('back')}">
          ${icon('arrow-left', 'w-5 h-5')}
        </button>
        <h2 style="font-size:1.25rem;font-weight:700;display:flex;align-items:center;gap:8px">
          ${icon('route', 'w-5.5 h-5.5')}
          ${t('companions') || 'Compagnons'}
        </h2>
        <div style="width:44px"></div>
      </div>

      <div style="padding:16px">
        <!-- Country filter pills -->
        <div style="display:flex;gap:6px;overflow-x:auto;padding:8px 0 14px;scrollbar-width:none" class="scrollbar-hide">
          ${countries.map(c => `
            <button onclick="setBuddyCountryFilter('${c.code}')" style="padding:8px 14px;border-radius:20px;font-size:0.8rem;font-weight:600;cursor:pointer;min-height:40px;display:flex;align-items:center;gap:6px;flex-shrink:0;white-space:nowrap;transition:all 0.2s;border:1px solid ${filter === c.code ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.1)'};background:${filter === c.code ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.04)'};color:${filter === c.code ? '#f59e0b' : '#94a3b8'};font-family:inherit">${c.flag ? c.flag + ' ' : ''}${c.label}</button>
          `).join('')}
        </div>

        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
          <div style="font-size:0.92rem;font-weight:700">${filtered.length} ${t('announcements') || 'annonces'}</div>
        </div>

        <!-- Buddy cards -->
        ${filtered.length > 0 ? filtered.map(buddy => renderBuddyCard(buddy, true)).join('') : `
          <div style="text-align:center;padding:40px 16px;color:#94a3b8;font-size:0.85rem">
            ${icon('route', 'w-10 h-10 text-slate-600')}
            <div style="margin-top:12px">${t('noBuddiesForFilter') || 'Aucune annonce pour ce filtre.'}</div>
          </div>
        `}
      </div>

      <!-- FAB + button -->
      <button onclick="showBuddyCreate()" class="fixed bottom-24 right-5 w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-30 transition-transform active:scale-90" style="background:#f59e0b;color:#0f1520;box-shadow:0 4px 20px rgba(245,158,11,0.35);border:none;cursor:pointer" aria-label="${t('createAnnouncement') || 'Creer une annonce'}">
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
    <div class="flex-1 overflow-y-auto" style="padding-bottom:140px">
      <!-- Header -->
      <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px 12px;border-bottom:1px solid rgba(255,255,255,0.06)">
        <button onclick="backFromVoyageurs()" style="width:44px;height:44px;border-radius:12px;background:rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:center;cursor:pointer;border:none;color:#e2e8f0" aria-label="${t('back')}">
          ${icon('arrow-left', 'w-5 h-5')}
        </button>
        <h2 style="font-size:1.25rem;font-weight:700">${t('announcement') || 'Annonce'}</h2>
        <button onclick="shareBuddyAnnouncement('${escapeJSString(buddy.id)}')" style="width:44px;height:44px;border-radius:12px;background:rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:center;cursor:pointer;border:none;color:#e2e8f0" aria-label="${t('share') || 'Partager'}">
          ${icon('send', 'w-4.5 h-4.5')}
        </button>
      </div>

      <div style="padding:16px">

        <!-- Profile header -->
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:20px">
          <div style="width:56px;height:56px;border-radius:50%;background:#1e2a3a;display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:700;flex-shrink:0;color:#94a3b8;border:2px solid rgba(245,158,11,0.25)">${initial}</div>
          <div>
            <div style="font-size:1.15rem;font-weight:700;display:flex;align-items:center;gap:8px;margin-bottom:2px">
              ${escapeHTML(buddy.userName || t('traveler'))}
              ${buddy.verified ? `<span style="display:inline-flex;align-items:center;gap:2px;background:rgba(34,197,94,0.12);color:#22c55e;font-size:0.62rem;font-weight:600;padding:2px 6px;border-radius:6px">${icon('check', 'w-2.5 h-2.5')} ${t('verified') || 'Verifie'}</span>` : ''}
            </div>
            <div style="display:flex;align-items:center;gap:10px;color:#94a3b8;font-size:0.8rem">
              ${buddy.spotCount ? `<span>${buddy.spotCount} spots</span><span>·</span>` : ''}
              ${buddy.memberSince ? `<span>${t('memberSince') || 'Membre depuis'} ${buddy.memberSince}</span><span>·</span>` : ''}
              ${buddy.trustScore ? `<span style="color:#f59e0b;font-weight:600;display:flex;align-items:center;gap:3px">${icon('star', 'w-3 h-3')} ${buddy.trustScore}</span>` : ''}
            </div>
          </div>
        </div>

        <!-- Route card -->
        <div style="background:#161b28;border:1px solid rgba(255,255,255,0.1);border-radius:12px;overflow:hidden;margin-bottom:16px">
          <!-- Route map visualization -->
          <div style="height:100px;background:linear-gradient(135deg,#1a2744 0%,#0f1520 100%);position:relative;display:flex;align-items:center;justify-content:center">
            <div style="width:80%;height:3px;background:linear-gradient(90deg,#f59e0b 0%,#f59e0b 40%,rgba(245,158,11,0.3) 60%,#f59e0b 100%);border-radius:2px;position:relative">
              <div style="width:14px;height:14px;border-radius:50%;background:#f59e0b;position:absolute;top:-5.5px;left:-7px;border:2px solid #0f1520"></div>
              <div style="width:8px;height:8px;border-radius:50%;background:rgba(245,158,11,0.5);position:absolute;top:-2.5px;left:50%;transform:translateX(-50%)"></div>
              <div style="width:14px;height:14px;border-radius:50%;background:#f59e0b;position:absolute;top:-5.5px;right:-7px;border:2px solid #0f1520"></div>
            </div>
            <div style="position:absolute;bottom:8px;left:16px;color:#94a3b8;font-size:0.7rem">${escapeHTML(buddy.departure || '')}</div>
            <div style="position:absolute;bottom:8px;right:16px;color:#94a3b8;font-size:0.7rem">${escapeHTML(buddy.destination || '')}</div>
          </div>
          <div style="padding:14px 16px">
            <div style="font-size:1.05rem;font-weight:700;display:flex;align-items:center;gap:8px;margin-bottom:8px">
              ${escapeHTML(buddy.departure || '')} <span style="color:#f59e0b">&rarr;</span> ${escapeHTML(buddy.destination || '')}
            </div>
            <div style="display:flex;align-items:center;gap:8px;color:#94a3b8;font-size:0.85rem;margin-bottom:6px">
              ${icon('calendar', 'w-4 h-4')}
              ${buddy.dateFrom || ''} ${buddy.dateTo ? '&rarr; ' + buddy.dateTo : ''}
              ${buddy.flexDates ? `<span style="color:#f59e0b;font-size:0.72rem">(${t('flexible') || 'flexible'})</span>` : ''}
            </div>
            ${buddy.duration ? `
              <div style="display:flex;align-items:center;gap:8px;color:#94a3b8;font-size:0.85rem;margin-bottom:6px">
                ${icon('clock', 'w-4 h-4')}
                ${escapeHTML(buddy.duration)}
              </div>
            ` : ''}
            <span style="display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:8px;font-size:0.72rem;font-weight:600;background:rgba(245,158,11,0.12);color:#f59e0b">${escapeHTML(buddy.mode || 'Auto-stop')}</span>
          </div>
        </div>

        <!-- Description -->
        ${buddy.message ? `
          <div style="margin-bottom:20px">
            <div style="font-size:0.92rem;font-weight:700;margin-bottom:10px;display:flex;align-items:center;gap:8px">
              ${icon('message-circle', 'w-4 h-4')}
              ${t('description') || 'Description'}
            </div>
            <div style="color:#94a3b8;font-size:0.88rem;line-height:1.6">${escapeHTML(buddy.message)}</div>
          </div>
          <div style="height:1px;background:rgba(255,255,255,0.06);margin:20px 0"></div>
        ` : ''}

        <!-- Preferences -->
        ${buddy.preferences ? `
          <div style="margin-bottom:20px">
            <div style="font-size:0.92rem;font-weight:700;margin-bottom:10px;display:flex;align-items:center;gap:8px">
              ${icon('users', 'w-4 h-4')}
              ${t('whatImLookingFor') || 'Ce que je cherche'}
            </div>
            <div style="color:#94a3b8;font-size:0.88rem;line-height:1.6">${escapeHTML(buddy.preferences)}</div>
          </div>
          <div style="height:1px;background:rgba(255,255,255,0.06);margin:20px 0"></div>
        ` : ''}

        <!-- Visibility -->
        <div style="margin-bottom:20px">
          <div style="font-size:0.92rem;font-weight:700;margin-bottom:10px;display:flex;align-items:center;gap:8px">
            ${icon('eye', 'w-4 h-4')}
            ${t('visibility') || 'Visibilite'}
          </div>
          <div style="color:#94a3b8;font-size:0.88rem;line-height:1.6">
            ${(buddy.visibility || ['tous']).includes('tous')
    ? (t('visibleByAll') || 'Cette annonce est visible par tous les membres.')
    : (t('visibleByRestricted') || 'Visibilite restreinte.')}
          </div>
        </div>

      </div>

      <!-- Fixed bottom CTA -->
      <div class="fixed bottom-0 left-0 right-0 z-20" style="padding:16px 16px 36px;background:linear-gradient(to top,#0f1520 80%,transparent)">
        ${isOwn ? `
          <button onclick="deleteBuddyAnnouncement('${escapeJSString(buddy.id)}')" style="width:100%;background:rgba(248,113,113,0.15);color:#f87171;border:1px solid rgba(248,113,113,0.2);border-radius:12px;padding:16px;font-size:1rem;font-weight:700;cursor:pointer;font-family:inherit;margin-bottom:8px;min-height:48px;display:flex;align-items:center;justify-content:center;gap:8px">
            ${icon('trash', 'w-4.5 h-4.5')}
            ${t('deleteAnnouncement') || 'Supprimer mon annonce'}
          </button>
        ` : `
          <button onclick="contactBuddyAuthor('${escapeJSString(buddy.userId)}')" style="width:100%;background:#f59e0b;color:#0f1520;border:none;border-radius:12px;padding:16px;font-size:1rem;font-weight:700;cursor:pointer;font-family:inherit;margin-bottom:8px;min-height:48px;display:flex;align-items:center;justify-content:center;gap:8px;transition:opacity 0.2s">
            ${icon('send', 'w-4.5 h-4.5')}
            ${t('contactAuthor') || 'Contacter'} ${escapeHTML(buddy.userName || '')}
          </button>
          <button onclick="openReport('buddy', '${escapeJSString(buddy.id)}')" style="display:flex;align-items:center;justify-content:center;gap:4px;margin:0 auto;background:none;border:none;color:#475569;font-size:0.78rem;cursor:pointer;font-family:inherit;padding:8px;min-height:44px">
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
    <div class="flex-1 overflow-y-auto" style="padding-bottom:100px">
      <!-- Header -->
      <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px 12px;border-bottom:1px solid rgba(255,255,255,0.06)">
        <button onclick="backFromVoyageurs()" style="width:44px;height:44px;border-radius:12px;background:rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:center;cursor:pointer;border:none;color:#e2e8f0" aria-label="${t('back')}">
          ${icon('arrow-left', 'w-5 h-5')}
        </button>
        <h2 style="font-size:1.25rem;font-weight:700">${t('createAnnouncement') || 'Creer une annonce'}</h2>
        <div style="width:44px"></div>
      </div>

      <div style="padding:16px">

        <!-- Departure -->
        <div style="margin-bottom:18px">
          <div style="display:flex;align-items:center;gap:6px;color:#94a3b8;font-size:0.82rem;font-weight:600;margin-bottom:8px">
            ${icon('map-pin', 'w-4 h-4')}
            ${t('departure') || 'Depart'} <span style="color:#ef4444;font-size:0.75rem">*</span>
          </div>
          <input type="text" id="buddy-departure" style="width:100%;background:#161b28;border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:14px 16px;color:#e2e8f0;font-size:0.9rem;font-family:inherit;min-height:48px" placeholder="${t('departurePlaceholder') || 'Ville de depart...'}" />
        </div>

        <!-- Destination -->
        <div style="margin-bottom:18px">
          <div style="display:flex;align-items:center;gap:6px;color:#94a3b8;font-size:0.82rem;font-weight:600;margin-bottom:8px">
            ${icon('map-pin', 'w-4 h-4')}
            ${t('destination') || 'Destination'} <span style="color:#ef4444;font-size:0.75rem">*</span>
          </div>
          <input type="text" id="buddy-destination" style="width:100%;background:#161b28;border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:14px 16px;color:#e2e8f0;font-size:0.9rem;font-family:inherit;min-height:48px" placeholder="${t('destinationPlaceholder') || "Ville d'arrivee..."}" />
        </div>

        <!-- Dates row -->
        <div style="display:flex;gap:10px;margin-bottom:4px">
          <div style="flex:1">
            <div style="display:flex;align-items:center;gap:6px;color:#94a3b8;font-size:0.82rem;font-weight:600;margin-bottom:8px">
              ${icon('calendar', 'w-3.5 h-3.5')}
              ${t('from') || 'Du'} <span style="color:#ef4444;font-size:0.75rem">*</span>
            </div>
            ${flexDates ? `<div style="color:#94a3b8;font-size:0.75rem;font-weight:600;margin-bottom:4px">${t('around') || 'Autour du'}</div>` : ''}
            <input type="date" id="buddy-date-from" min="${today}" style="width:100%;background:#161b28;border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:14px 16px;color:#e2e8f0;font-size:0.9rem;font-family:inherit;min-height:48px" />
          </div>
          <div style="flex:1">
            <div style="display:flex;align-items:center;gap:6px;color:#94a3b8;font-size:0.82rem;font-weight:600;margin-bottom:8px">
              ${icon('calendar', 'w-3.5 h-3.5')}
              ${t('to') || 'Au'} <span style="color:#ef4444;font-size:0.75rem">*</span>
            </div>
            ${flexDates ? `<div style="color:#94a3b8;font-size:0.75rem;font-weight:600;margin-bottom:4px">${t('around') || 'Autour du'}</div>` : ''}
            <input type="date" id="buddy-date-to" min="${today}" style="width:100%;background:#161b28;border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:14px 16px;color:#e2e8f0;font-size:0.9rem;font-family:inherit;min-height:48px" />
          </div>
        </div>

        <!-- Flexible dates toggle -->
        <div style="display:flex;align-items:center;gap:10px;padding:10px 0;margin-top:4px;margin-bottom:18px">
          <div onclick="toggleBuddyFlexDates()" style="width:40px;height:22px;border-radius:11px;position:relative;cursor:pointer;flex-shrink:0;transition:all 0.3s;background:${flexDates ? '#f59e0b' : '#334155'}" role="switch" aria-checked="${flexDates}">
            <div style="width:16px;height:16px;border-radius:50%;background:white;position:absolute;top:3px;transition:transform 0.3s;transform:translateX(${flexDates ? '21px' : '3px'})"></div>
          </div>
          <div>
            <div style="font-size:0.82rem;color:#e2e8f0;font-weight:600">${t('flexibleDates') || 'Dates flexibles'}</div>
            ${flexDates ? `<div style="color:#94a3b8;font-size:0.75rem;margin-top:4px;line-height:1.3">${t('flexibleDatesHint') || 'Les dates sont approximatives'}</div>` : ''}
          </div>
        </div>

        <!-- Travel mode pills -->
        <div style="margin-bottom:18px">
          <div style="display:flex;align-items:center;gap:6px;color:#94a3b8;font-size:0.82rem;font-weight:600;margin-bottom:8px">
            ${icon('route', 'w-4 h-4')}
            ${t('travelMode') || 'Mode de voyage'}
          </div>
          <div style="display:flex;gap:6px">
            ${['autostop', 'mixte', 'autre'].map(mode => {
    const labels = { autostop: 'Auto-stop', mixte: 'Mixte', autre: t('other') || 'Autre' }
    const isSelected = selectedMode === mode
    return `
                <button onclick="setBuddyTravelMode('${mode}')" style="flex:1;padding:12px 8px;border-radius:12px;font-size:0.82rem;font-weight:600;cursor:pointer;text-align:center;min-height:48px;display:flex;align-items:center;justify-content:center;transition:all 0.2s;border:1px solid ${isSelected ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.1)'};background:${isSelected ? 'rgba(245,158,11,0.12)' : '#161b28'};color:${isSelected ? '#f59e0b' : '#94a3b8'};font-family:inherit">${labels[mode] || mode}</button>
              `
  }).join('')}
          </div>
        </div>

        <div style="height:1px;background:rgba(255,255,255,0.06);margin:20px 0"></div>

        <!-- Description -->
        <div style="margin-bottom:18px">
          <div style="display:flex;align-items:center;gap:6px;color:#94a3b8;font-size:0.82rem;font-weight:600;margin-bottom:8px">
            ${icon('message-circle', 'w-4 h-4')}
            ${t('description') || 'Description'}
          </div>
          <textarea id="buddy-description" style="width:100%;background:#161b28;border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:14px 16px;color:#e2e8f0;font-size:0.9rem;font-family:inherit;min-height:80px;line-height:1.5;resize:vertical" placeholder="${t('buddyDescPlaceholder') || 'Presente toi et decris ton voyage...'}"></textarea>
          <div style="color:#475569;font-size:0.75rem;margin-top:6px;line-height:1.4">${t('buddyDescHelper') || 'Parle de toi, de ton itineraire, de tes passions. Ca aide les autres a te connaitre.'}</div>
        </div>

        <!-- Preferences -->
        <div style="margin-bottom:18px">
          <div style="display:flex;align-items:center;gap:6px;color:#94a3b8;font-size:0.82rem;font-weight:600;margin-bottom:8px">
            ${icon('users', 'w-4 h-4')}
            ${t('whatImLookingFor') || 'Ce que je cherche'}
          </div>
          <textarea id="buddy-preferences" style="width:100%;background:#161b28;border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:14px 16px;color:#e2e8f0;font-size:0.9rem;font-family:inherit;min-height:80px;line-height:1.5;resize:vertical" placeholder="${t('buddyPrefsPlaceholder') || 'Type de compagnon, preferences...'}"></textarea>
        </div>

        <div style="height:1px;background:rgba(255,255,255,0.06);margin:20px 0"></div>

        <!-- Visibility pills -->
        <div style="margin-bottom:18px">
          <div style="display:flex;align-items:center;gap:6px;color:#94a3b8;font-size:0.82rem;font-weight:600;margin-bottom:8px">
            ${icon('eye', 'w-4 h-4')}
            ${t('visibleBy') || 'Visible par'}
          </div>
          <div style="display:flex;gap:6px">
            ${renderVisibilityPill('tous', t('visibilityAll') || 'Tous', selectedVisibility, 'setBuddyVisibility')}
            ${renderVisibilityPill('femmes', t('visibilityWomen') || 'Femmes', selectedVisibility, 'setBuddyVisibility')}
            ${renderVisibilityPill('verifies', t('visibilityVerified') || 'Verifies', selectedVisibility, 'setBuddyVisibility')}
          </div>
          <div style="color:#94a3b8;font-size:0.72rem;line-height:1.4;margin-top:8px;padding:0 2px">${t('visibilityWomenHint') || "L'option Femmes est reservee aux utilisatrices ayant indique Femme dans leur profil."}</div>
          ${selectedVisibility.includes('femmes') ? `
            <div style="color:#a78bfa;font-size:0.72rem;line-height:1.4;margin-top:6px;padding:8px 12px;background:rgba(167,139,250,0.08);border:1px solid rgba(167,139,250,0.15);border-radius:8px;display:flex;align-items:flex-start;gap:6px">
              ${icon('shield', 'w-3.5 h-3.5 shrink-0')}
              <span>${t('visibilityWomenReassure') || 'Seules les femmes verifiees verront ton profil et ta position.'}</span>
            </div>
          ` : ''}
        </div>

        <!-- Submit button -->
        <button onclick="submitBuddyAnnouncement()" style="width:100%;background:#f59e0b;color:#0f1520;border:none;border-radius:12px;padding:16px;font-size:1rem;font-weight:700;cursor:pointer;font-family:inherit;margin-top:8px;min-height:48px;display:flex;align-items:center;justify-content:center;gap:8px;transition:opacity 0.2s">
          ${icon('send', 'w-4.5 h-4.5')}
          ${t('publishAnnouncement') || "Publier l'annonce"}
        </button>

        <!-- Privacy info -->
        <div style="display:flex;align-items:flex-start;gap:8px;background:rgba(59,130,246,0.06);border:1px solid rgba(59,130,246,0.12);border-radius:12px;padding:12px 14px;margin-top:16px">
          <span style="flex-shrink:0;color:#60a5fa">${icon('shield', 'w-4.5 h-4.5')}</span>
          <div style="color:#94a3b8;font-size:0.78rem;line-height:1.5">${t('buddyPrivacyNote') || 'Ton annonce sera visible par les membres selon le filtre choisi. Tu peux la modifier ou la supprimer a tout moment.'}</div>
        </div>

      </div>
    </div>
  `
}

// ==================== SHARED HELPERS ====================

function renderBuddyCard(buddy, showCountry = false) {
  const initial = (buddy.userName || '?')[0].toUpperCase()
  const modeLabels = { autostop: 'Auto-stop', mixte: 'Mixte', autre: 'Autre' }

  return `
    <div onclick="showBuddyDetail('${escapeJSString(buddy.id)}')" style="background:#161b28;border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:14px;margin-bottom:10px;cursor:pointer;transition:border-color 0.2s">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
        <div style="width:38px;height:38px;border-radius:50%;background:#1e2a3a;display:flex;align-items:center;justify-content:center;font-size:0.9rem;font-weight:700;flex-shrink:0;color:#94a3b8">${initial}</div>
        <div>
          <div style="font-weight:600;font-size:0.88rem">
            ${escapeHTML(buddy.userName || t('traveler'))}
            ${buddy.verified ? `<span style="display:inline-flex;align-items:center;gap:2px;background:rgba(34,197,94,0.12);color:#22c55e;font-size:0.62rem;font-weight:600;padding:2px 6px;border-radius:6px;margin-left:4px">${icon('check', 'w-2.5 h-2.5')} ${t('verified') || 'Verifie'}</span>` : ''}
          </div>
          <div style="color:#94a3b8;font-size:0.74rem">${showCountry && buddy.country ? buddy.countryFlag + ' ' + (buddy.countryName || buddy.country) + ' · ' : ''}${buddy.spotCount ? buddy.spotCount + ' spots' : ''}</div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:6px;font-size:0.88rem;font-weight:600;margin-bottom:4px">
        ${escapeHTML(buddy.departure || '')} <span style="color:#f59e0b">&rarr;</span> ${escapeHTML(buddy.destination || '')}
      </div>
      <div style="display:flex;align-items:center;gap:6px;color:#94a3b8;font-size:0.76rem;margin-bottom:6px">
        ${icon('calendar', 'w-3 h-3')}
        ${buddy.dateFrom || ''} ${buddy.dateTo ? '&rarr; ' + buddy.dateTo : ''}
      </div>
      ${buddy.message ? `<div style="color:#94a3b8;font-size:0.82rem;line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${escapeHTML(buddy.message)}</div>` : ''}
      <div style="display:flex;align-items:center;justify-content:space-between;margin-top:10px">
        <span style="display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:8px;font-size:0.72rem;font-weight:600;background:rgba(245,158,11,0.12);color:#f59e0b">${modeLabels[buddy.mode] || buddy.mode || 'Auto-stop'}</span>
        <button onclick="event.stopPropagation();showBuddyDetail('${escapeJSString(buddy.id)}')" style="background:rgba(245,158,11,0.1);color:#f59e0b;border:1px solid rgba(245,158,11,0.15);border-radius:8px;padding:6px 14px;font-size:0.78rem;font-weight:600;cursor:pointer;font-family:inherit;min-height:36px;display:flex;align-items:center;gap:4px">
          ${icon('eye', 'w-3 h-3')}
          ${t('view') || 'Voir'}
        </button>
      </div>
    </div>
  `
}

function renderVisibilityPill(value, label, selectedArray, handlerName) {
  const isSelected = selectedArray.includes(value)
  return `<button onclick="${handlerName}('${value}')" style="flex:1;padding:10px 8px;border-radius:12px;font-size:0.8rem;font-weight:600;cursor:pointer;text-align:center;min-height:44px;display:flex;align-items:center;justify-content:center;transition:all 0.2s;border:1px solid ${isSelected ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.1)'};background:${isSelected ? 'rgba(245,158,11,0.12)' : '#161b28'};color:${isSelected ? '#f59e0b' : '#94a3b8'};font-family:inherit">${label}</button>`
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
  window.setState?.({ voyageursView: 'buddyDetail' })
  try {
    const { getTravelBuddyById } = await import('../../../services/travelBuddies.js')
    const buddy = await getTravelBuddyById(buddyId)
    if (buddy) {
      window.setState?.({ selectedBuddyDetail: buddy })
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

window.setBuddyCountryFilter = (code) => {
  window.setState?.({ buddyCountryFilter: code })
}

window.contactBuddyAuthor = (uid) => {
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
  window.setState?.({ voyageursView: 'combined', selectedBuddyDetail: null })
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
