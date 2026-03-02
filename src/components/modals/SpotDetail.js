/**
 * SpotDetail Modal Component — K9 Layout
 * Full details view of a spot with tier badges, legal info, nearby alternatives,
 * multi-photo gallery, expert tips, and best time slots.
 */

import { t } from '../../i18n/index.js'
import { escapeHTML, escapeJSString } from '../../utils/sanitize.js'
import { renderVerificationBadge, renderVoteButtons } from '../../services/verification.js'
import { renderFreshnessSection, renderFreshnessBadge } from '../../utils/dateHelpers.js'
import { getAvailableNavigationApps } from '../../utils/navigation.js'
import { renderFreshnessBadge as renderReliabilityBadge, renderAgeBadge, getSpotFreshness } from '../../services/spotFreshness.js'
import { renderTranslateButton } from '../../services/autoTranslate.js'
import { icon } from '../../utils/icons.js'
import { renderMiniTrustBadge } from '../../services/trustScore.js'

export function renderSpotDetail(state) {
  const spot = state.selectedSpot
  if (!spot) return ''

  const freshness = getSpotFreshness(spot)
  const spotIdStr = typeof spot.id === 'string' ? `'${escapeJSString(spot.id)}'` : spot.id
  const navName = escapeJSString((spot.from || '') + ' - ' + (spot.to || ''))
  const validationCount = spot.validationCount || spot.userValidations || 0
  const testCount = spot.testCount || 0

  return `
    <div
      class="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onclick="closeSpotDetail()"
      role="dialog"
      aria-modal="true"
      aria-labelledby="spotdetail-title"
      tabindex="0">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true"></div>

      <!-- Modal -->
      <div
        class="relative modal-panel sm:rounded-3xl
          w-full max-w-lg max-h-[90vh] overflow-hidden slide-up"
        onclick="event.stopPropagation()"
      >
        <!-- Close Button -->
        <button
          onclick="closeSpotDetail()"
          class="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50
            flex items-center justify-center text-white"
          aria-label="${t('closeSpotDetails') || 'Fermer les détails du spot'}"
          type="button"
        >
          ${icon('x', 'w-5 h-5')}
        </button>

        <!-- Photo with tier badge overlay -->
        <div class="relative h-44 sm:h-56 overflow-hidden shrink-0">
          ${renderPhotoSection(spot)}
          <div class="absolute inset-0 bg-gradient-to-t from-dark-primary via-transparent to-transparent"></div>

          <!-- Tier badge overlay (top-left, opaque) -->
          <div class="absolute top-3 left-3 flex items-center gap-2">
            ${renderReliabilityBadge(spot, 'md')}
          </div>

          <!-- Score circle (top-right area, under close btn) -->
          ${spot.globalRating ? `
            <div class="absolute top-3 left-auto right-16 flex items-center justify-center w-12 h-12 rounded-full bg-black/70 border-2"
              style="border-color: ${freshness.hexColor};">
              <span class="text-lg font-bold" style="color: ${freshness.hexColor};">${spot.globalRating.toFixed?.(1) || spot.globalRating}</span>
            </div>
          ` : ''}

          <!-- Title overlay -->
          <div class="absolute bottom-3 left-4 right-4">
            <h2 id="spotdetail-title" class="text-xl font-bold leading-tight">
              ${spot.from && spot.to
                ? `${escapeHTML(spot.from)} ${icon('arrow-right', 'w-4 h-4 text-primary-400 mx-1')}<span class="sr-only">vers</span> ${escapeHTML(spot.to)}`
                : spot.direction
                  ? `📍 ${escapeHTML(spot.direction)}`
                  : `📍 ${t('spotLocation') || 'Spot'} #${spot.id}`}
            </h2>
            <div class="flex items-center gap-2 mt-1 flex-wrap">
              ${renderVerificationBadge(spot.id)}
              ${renderFreshnessBadge(spot.lastCheckin || spot.lastUsed, 'sm')}
              <span class="text-sm text-slate-400">
                ${icon('flag', 'w-4 h-4 mr-1')} ${escapeHTML(spot.country || 'World')}
              </span>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="p-5 overflow-y-auto max-h-[calc(90vh-11rem)]">

          <!-- Action buttons: Validate + Test -->
          <div class="grid grid-cols-2 gap-3 mb-4">
            <button
              onclick="quickValidateSpot(${spotIdStr})"
              class="btn text-white font-semibold py-3 rounded-2xl"
              style="background: linear-gradient(135deg, #3b82f6, #2563eb);"
              type="button"
            >
              ${icon('circle-check', 'w-5 h-5')}
              ${t('iValidate') || 'Je valide'}
            </button>
            <button
              onclick="openTestSpot(${spotIdStr})"
              class="btn text-white font-semibold py-3 rounded-2xl"
              style="background: linear-gradient(135deg, #10b981, #059669);"
              type="button"
            >
              🤙
              ${t('iTested') || "J'ai testé"}
            </button>
          </div>

          <!-- Google Maps button -->
          <button
            onclick="showNavigationPicker(${spot.coordinates?.lat}, ${spot.coordinates?.lng}, '${navName}')"
            class="w-full btn text-white font-bold text-base py-3 mb-4 rounded-2xl shadow-lg shadow-emerald-500/20"
            style="background: linear-gradient(135deg, #10b981, #059669);"
            type="button"
            aria-label="${t('goThere') || 'Y aller'}"
          >
            ${icon('route', 'w-5 h-5 mr-2')}
            ${t('goThere') || 'Y aller'}
            ${icon('chevron-right', 'w-5 h-5 ml-2')}
          </button>

          <!-- Dates: last validation, last test -->
          <div class="flex gap-3 mb-4 text-xs text-slate-400">
            <div class="flex items-center gap-1">
              ${icon('circle-check', 'w-3 h-3')}
              ${t('lastValidated') || 'Validé'}: ${spot.lastValidated ? formatReviewDate(spot.lastValidated) : (spot.lastUsed ? formatReviewDate(spot.lastUsed) : '—')}
            </div>
            <div class="flex items-center gap-1">
              🤙
              ${t('lastTested') || 'Testé'}: ${spot.lastTested ? formatReviewDate(spot.lastTested) : '—'}
            </div>
          </div>

          <!-- Strip: legality + season -->
          ${renderLegalityStrip(spot)}

          <!-- 4 Metrics -->
          <div class="grid grid-cols-4 gap-2 mb-4" role="group" aria-label="${t('spotStats') || 'Statistiques du spot'}">
            <div class="card p-2 text-center rounded-xl">
              <div class="text-lg font-bold text-primary-400">~${spot.avgWaitTime || '?'}</div>
              <div class="text-[10px] text-slate-400">${t('estimatedWait') || 'min'}</div>
            </div>
            <div class="card p-2 text-center rounded-xl">
              <div class="text-lg font-bold text-emerald-400">${validationCount}</div>
              <div class="text-[10px] text-slate-400">${t('validationCount') || 'Validations'}</div>
            </div>
            <div class="card p-2 text-center rounded-xl">
              <div class="text-lg font-bold text-blue-400">${testCount}</div>
              <div class="text-[10px] text-slate-400">${t('testCount') || 'Tests'}</div>
            </div>
            <div class="card p-2 text-center rounded-xl">
              <div class="text-lg font-bold text-amber-400">${spot.checkins || 0}</div>
              <div class="text-[10px] text-slate-400">check-ins</div>
            </div>
          </div>

          <!-- Tags/amenities -->
          ${renderTagsSection(spot)}

          <!-- Expandable sections -->

          <!-- Description -->
          <details class="mb-3 group" open>
            <summary class="font-semibold cursor-pointer flex items-center gap-2 py-2">
              <span aria-hidden="true">📍</span> ${t('description') || 'Description'}
              ${icon('chevron-down', 'w-4 h-4 ml-auto transition-transform group-open:rotate-180')}
            </summary>
            <div class="pt-1 pb-2">
              <p id="spot-desc-${spot.id}" class="text-slate-300 text-sm leading-relaxed">
                ${escapeHTML(spot.description || (t('noDescription') || 'Aucune description disponible.'))}
              </p>
              ${spot.description ? renderTranslateButton(spot.description, `spot-desc-${spot.id}`) : ''}
            </div>
          </details>

          <!-- Expert Tips (B2) -->
          ${renderExpertTips(spot)}

          <!-- Best Time Slots (B3) -->
          ${renderBestTimeSlots(spot)}

          <!-- Reliability & Age -->
          <details class="mb-3 group">
            <summary class="font-semibold cursor-pointer flex items-center gap-2 py-2">
              <span aria-hidden="true">🛡️</span> ${t('reliability') || 'Fiabilité'}
              ${icon('chevron-down', 'w-4 h-4 ml-auto transition-transform group-open:rotate-180')}
            </summary>
            <div class="pt-1 pb-2">
              <div class="flex flex-wrap gap-2 mb-2">
                ${renderReliabilityBadge(spot, 'lg')}
                ${renderAgeBadge(spot, 'lg')}
              </div>
              ${renderFreshnessSection(spot.lastCheckin || spot.lastUsed)}
              ${spot.source === 'hitchwiki' ? `
                <p class="text-xs text-slate-500 mt-2">
                  ${icon('info', 'w-3 h-3 mr-1')}${t('hitchwikiImport') || 'Importé de Hitchwiki — validez ce spot !'}
                </p>
              ` : ''}
            </div>
          </details>

          <!-- Nearby Alternatives (A5) -->
          ${renderNearbyAlternatives(spot, state)}

          <!-- Navigation Apps -->
          <div class="mb-4">
            <p class="text-xs text-slate-400 mb-2 text-center">${t('openDirectlyIn') || 'Ouvrir directement dans :'}</p>
            <div class="flex gap-3 justify-center">
              ${renderNavigationAppButtons(spot.coordinates?.lat, spot.coordinates?.lng, (spot.from || '') + ' - ' + (spot.to || ''))}
            </div>
          </div>

          <!-- Bottom actions: nav, save, share, report -->
          <div class="grid grid-cols-4 gap-2 mb-3">
            <button
              onclick="startSpotNavigation(${spot.coordinates?.lat}, ${spot.coordinates?.lng}, '${navName}')"
              class="btn btn-ghost text-xs py-2 flex flex-col items-center gap-1"
              type="button"
            >
              ${icon('compass', 'w-5 h-5')}
              ${t('guidedNav') || 'Nav'}
            </button>
            <button
              onclick="toggleFavorite('${escapeJSString(String(spot.id))}')"
              class="btn btn-ghost text-xs py-2 flex flex-col items-center gap-1"
              type="button"
            >
              ${icon('bookmark', 'w-5 h-5')}
              ${t('save') || 'Sauver'}
            </button>
            <button
              onclick="openShareCard()"
              class="btn btn-ghost text-xs py-2 flex flex-col items-center gap-1"
              type="button"
            >
              ${icon('share-2', 'w-5 h-5')}
              ${t('share') || 'Partager'}
            </button>
            <button
              onclick="openReport('SPOT', '${escapeJSString(String(spot.id))}')"
              class="btn btn-ghost text-xs py-2 flex flex-col items-center gap-1 text-slate-400"
              type="button"
            >
              ${icon('flag', 'w-5 h-5')}
              ${t('report') || 'Signaler'}
            </button>
          </div>

          <!-- Community Verification -->
          <div class="pt-3 border-t border-white/10">
            ${renderVoteButtons(spot.id)}
          </div>

          <!-- User Reviews -->
          ${renderSpotReviews(spot)}

          <!-- Source -->
          ${spot.source ? `
            <div class="text-center text-xs text-slate-400 mt-4">
              Source: ${escapeHTML(spot.source)} • ${t('createdBy') || 'Créé par'} ${escapeHTML(spot.creator || (t('anonymous') || 'Anonyme'))} ${spot.creatorTrustScore != null ? renderMiniTrustBadge(spot.creatorTrustScore, spot.creatorIdVerified) : ''}
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `
}

/**
 * Render photo section — multi-photo gallery (B1) or single photo
 */
function renderPhotoSection(spot) {
  const photos = spot.photos || []
  const mainPhoto = photos[0] || spot.photoUrl

  if (!mainPhoto) {
    return `<div class="w-full h-full bg-gradient-to-br from-navy-900 to-slate-800 flex items-center justify-center">
      <span class="text-6xl">📍</span>
    </div>`
  }

  // Single photo or gallery
  if (photos.length <= 1) {
    return `<img
      src="${escapeHTML(mainPhoto)}"
      alt="${t('spotPhoto') || 'Photo du spot'}: ${escapeHTML(spot.from || '')} → ${escapeHTML(spot.to || '')}"
      class="w-full h-full object-cover"
      loading="lazy"
    />`
  }

  // Multi-photo: show first with gallery indicator (clickable to open gallery)
  return `
    <img
      src="${escapeHTML(mainPhoto)}"
      alt="${t('spotPhoto') || 'Photo du spot'}"
      class="w-full h-full object-cover"
      loading="lazy"
    />
    <button type="button" onclick="openPhotoFullscreen(0)"
      class="absolute bottom-14 right-4 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 cursor-pointer hover:bg-black/80 transition-colors"
      aria-label="${t('photoGallery') || 'Voir les photos'}">
      ${icon('camera', 'w-3 h-3')}
      <span>${photos.length} ${t('photoGallery') || 'photos'}</span>
    </button>
  `
}

/**
 * Render tags/amenities section
 */
function renderTagsSection(spot) {
  if (!spot.spotType && !spot.direction && !spot.tags) return ''

  return `
    <div class="flex flex-wrap gap-2 mb-4">
      ${spot.spotType && spot.spotType !== 'custom' ? `
        <span class="badge bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs">
          ${spot.spotType === 'city_exit' ? '🏙️ ' + (t('spotTypeCityExit') || 'Sortie de ville')
            : spot.spotType === 'gas_station' ? '⛽ ' + (t('spotTypeGasStation') || 'Station-service')
            : spot.spotType === 'highway' ? '🛣️ ' + (t('spotTypeHighway') || 'Autoroute')
            : spot.spotType}
        </span>` : ''}
      ${spot.direction ? `
        <span class="badge bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs">
          🧭 ${escapeHTML(spot.direction)}
        </span>` : ''}
      ${spot.fromCity ? `
        <span class="badge bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs">
          🏙️ ${escapeHTML(spot.fromCity)}
        </span>` : ''}
      ${spot.roadNumber ? `
        <span class="badge bg-slate-500/20 text-slate-300 border border-slate-400/30 text-xs">
          🛤️ ${escapeHTML(spot.roadNumber)}
        </span>` : ''}
      ${spot.method === 'sign' || spot.tags?.signMethod === 'sign' ? `
        <span class="badge bg-primary-500/20 text-primary-300 border border-primary-500/30 text-xs">
          ${icon('file-text', 'w-3 h-3 mr-1')} ${t('signMethod') || 'Panneau'}
        </span>` : ''}
      ${spot.method === 'thumb' || spot.tags?.signMethod === 'thumb' ? `
        <span class="badge bg-primary-500/20 text-primary-300 border border-primary-500/30 text-xs">
          ${icon('hand', 'w-3 h-3 mr-1')} ${t('thumbMethod') || 'Pouce'}
        </span>` : ''}
      ${spot.method === 'asking' || spot.tags?.signMethod === 'asking' ? `
        <span class="badge bg-primary-500/20 text-primary-300 border border-primary-500/30 text-xs">
          ${icon('message-circle', 'w-3 h-3 mr-1')} ${t('methodAsking') || 'En demandant'}
        </span>` : ''}
      ${spot.tags?.shelter || spot.tags?.hasShelter ? `
        <span class="badge bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs">
          ${icon('umbrella', 'w-3 h-3 mr-1')} ${t('hasShelter') || 'Abri'}
        </span>` : ''}
      ${spot.tags?.waterFood ? `
        <span class="badge bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs">
          ${icon('droplets', 'w-3 h-3 mr-1')} ${t('amenityWaterFood') || 'Eau/nourriture'}
        </span>` : ''}
      ${spot.tags?.toilets ? `
        <span class="badge bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs">
          🚻 ${t('amenityToilets') || 'Toilettes'}
        </span>` : ''}
      ${spot.tags?.visibility ? `
        <span class="badge bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs">
          ${icon('eye', 'w-3 h-3 mr-1')} ${t('goodVisibilityTag') || 'Visible'}
        </span>` : ''}
      ${spot.tags?.stoppingSpace ? `
        <span class="badge bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs">
          ${icon('square-parking', 'w-3 h-3 mr-1')} ${t('stoppingSpaceTag') || 'Place'}
        </span>` : ''}
    </div>
  `
}

/**
 * Render legality strip (A4) — uses data from guides.js injected by spotLoader
 */
function renderLegalityStrip(spot) {
  const country = spot.country
  if (!country) return ''

  const legality = spot._legality || null
  if (!legality) return ''

  // Pick localized text (FR text by default, EN for other languages)
  const lang = document.documentElement.lang || 'fr'
  const legalityText = lang === 'fr' ? (spot._legalityText || spot._legalityTextEn || null) : (spot._legalityTextEn || spot._legalityText || null)

  const legalColors = {
    legal: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30', emoji: '🟢', label: t('legalInCountry') || 'Légal' },
    restricted: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30', emoji: '🟡', label: t('legalRestricted') || 'Restreint' },
    varies: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30', emoji: '🟡', label: t('legalVaries') || 'Variable' },
    illegal: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', emoji: '🔴', label: t('legalProhibited') || 'Interdit' },
  }

  const style = legalColors[legality] || legalColors.restricted

  return `
    <div class="mb-4 p-3 rounded-xl ${style.bg} border ${style.border}">
      <div class="flex items-center gap-2 ${style.text} font-medium text-sm">
        <span>${style.emoji}</span>
        <span>${t('legalStatus') || 'Statut légal'}: ${style.label}</span>
      </div>
      ${legalityText ? `
        <details class="mt-1">
          <summary class="text-xs ${style.text} cursor-pointer opacity-70">${t('details') || 'Détails'}...</summary>
          <p class="text-xs text-slate-300 mt-1">${escapeHTML(legalityText)}</p>
        </details>
      ` : ''}
    </div>
  `
}

/**
 * Render nearby alternative spots (A5)
 */
function renderNearbyAlternatives(spot, state) {
  if (!spot.coordinates?.lat || !spot.coordinates?.lng) return ''

  // Use spots from state to find nearby ones
  const allSpots = state.spots || []
  if (allSpots.length < 2) return ''

  const nearby = []
  const spotLat = spot.coordinates.lat
  const spotLng = spot.coordinates.lng

  for (const s of allSpots) {
    if (s.id === spot.id) continue
    const sLat = s.coordinates?.lat || s.lat
    const sLng = s.coordinates?.lng || s.lng
    if (!sLat || !sLng) continue

    // Quick distance approximation (faster than haversine for filtering)
    const dLat = (sLat - spotLat) * 111
    const dLng = (sLng - spotLng) * 111 * Math.cos(spotLat * Math.PI / 180)
    const distKm = Math.sqrt(dLat * dLat + dLng * dLng)

    if (distKm <= 5) {
      nearby.push({ ...s, _distKm: distKm })
    }
    if (nearby.length >= 10) break // Enough candidates
  }

  if (nearby.length === 0) return ''

  // Sort by rating desc, take top 3
  nearby.sort((a, b) => (b.globalRating || 0) - (a.globalRating || 0))
  const top = nearby.slice(0, 3)

  return `
    <details class="mb-3 group">
      <summary class="font-semibold cursor-pointer flex items-center gap-2 py-2">
        <span aria-hidden="true">📍</span> ${t('nearbyAlternatives') || 'Spots proches'} (${nearby.length})
        ${icon('chevron-down', 'w-4 h-4 ml-auto transition-transform group-open:rotate-180')}
      </summary>
      <div class="pt-1 pb-2 space-y-2">
        ${top.map(s => {
          const sFreshness = getSpotFreshness(s)
          const sId = typeof s.id === 'string' ? `'${escapeJSString(s.id)}'` : s.id
          return `
            <button
              onclick="selectSpot(${sId})"
              class="w-full flex items-center gap-3 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left"
              type="button"
            >
              <div class="w-3 h-3 rounded-full shrink-0" style="background: ${sFreshness.hexColor};"></div>
              <div class="flex-1 min-w-0">
                <div class="text-sm font-medium truncate">${escapeHTML(s.from || s.direction || t('spotLocation') || 'Spot')}</div>
                <div class="text-xs text-slate-400">${s._distKm.toFixed(1)} km</div>
              </div>
              ${s.globalRating ? `<span class="text-xs text-amber-400">⭐ ${s.globalRating.toFixed?.(1) || s.globalRating}</span>` : ''}
            </button>
          `
        }).join('')}
      </div>
    </details>
  `
}

/**
 * Render expert tips (B2)
 */
function renderExpertTips(spot) {
  const reviews = spot.reviews || spot._reviews || []
  const tips = reviews.filter(r => r.isTip)

  if (tips.length === 0) return ''

  return `
    <details class="mb-3 group">
      <summary class="font-semibold cursor-pointer flex items-center gap-2 py-2">
        <span aria-hidden="true">💡</span> ${t('expertTips') || 'Tips experts'} (${tips.length})
        ${icon('chevron-down', 'w-4 h-4 ml-auto transition-transform group-open:rotate-180')}
      </summary>
      <div class="pt-1 pb-2 space-y-2">
        ${tips.slice(0, 5).map(tip => `
          <div class="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs font-medium text-amber-400">${tip.tipCategory || 'General'}</span>
              <span class="text-xs text-slate-500">${escapeHTML(tip.userName || '')}</span>
            </div>
            <p class="text-sm text-slate-300">${escapeHTML(tip.text || '')}</p>
          </div>
        `).join('')}
      </div>
    </details>
  `
}

/**
 * Render best time slots (B3) — aggregate timeOfDay + waitTime from reviews,
 * comments, and validation data to show when hitchhiking works best.
 */
function renderBestTimeSlots(spot) {
  // Gather all data sources that may contain timeOfDay + waitTime
  const reviews = spot.reviews || spot._reviews || []
  const comments = spot.comments || []
  const validations = spot.validations || []
  const allEntries = [...reviews, ...comments, ...validations]

  // Need at least 1 entry with timeOfDay data
  const entriesWithTime = allEntries.filter(e => e.timeOfDay)
  if (entriesWithTime.length === 0) return ''

  // Slot metadata: icon, i18n key, display order
  const slotMeta = {
    morning:   { icon: '🌅', i18nKey: 'timeMorning',   order: 0 },
    afternoon: { icon: '☀️', i18nKey: 'timeAfternoon', order: 1 },
    evening:   { icon: '🌆', i18nKey: 'timeEvening',   order: 2 },
    night:     { icon: '🌙', i18nKey: 'timeNight',     order: 3 },
  }

  // Aggregate stats per time slot
  const slotStats = {}
  for (const entry of entriesWithTime) {
    const slot = entry.timeOfDay
    if (!slotMeta[slot]) continue
    if (!slotStats[slot]) slotStats[slot] = { count: 0, totalWait: 0, hasWaitData: false }
    slotStats[slot].count++
    if (entry.waitTime != null && entry.waitTime > 0) {
      slotStats[slot].totalWait += entry.waitTime
      slotStats[slot].hasWaitData = true
    }
  }

  const slots = Object.entries(slotStats)
  if (slots.length === 0) return ''

  // Compute average wait per slot
  for (const [, stats] of slots) {
    stats.avgWait = stats.hasWaitData ? Math.round(stats.totalWait / stats.count) : null
  }

  // Sort: slots with wait data first (lowest avg), then by count desc
  slots.sort((a, b) => {
    const aAvg = a[1].avgWait
    const bAvg = b[1].avgWait
    if (aAvg != null && bAvg != null) return aAvg - bAvg
    if (aAvg != null) return -1
    if (bAvg != null) return 1
    return b[1].count - a[1].count
  })

  // Find max wait for bar chart scaling
  const maxWait = Math.max(...slots.map(([, s]) => s.avgWait || 0), 1)

  const bestSlotKey = slots[0][0]

  return `
    <details class="mb-3 group">
      <summary class="font-semibold cursor-pointer flex items-center gap-2 py-2">
        <span aria-hidden="true">⏰</span> ${t('bestTimeSlots') || 'Meilleurs créneaux'}
        ${icon('chevron-down', 'w-4 h-4 ml-auto transition-transform group-open:rotate-180')}
      </summary>
      <div class="pt-1 pb-2 space-y-2">
        ${slots.map(([slotKey, stats]) => {
          const meta = slotMeta[slotKey] || { icon: '⏰', i18nKey: slotKey, order: 9 }
          const label = t(meta.i18nKey) || slotKey
          const isBest = slotKey === bestSlotKey
          const barWidth = stats.avgWait != null ? Math.max(10, Math.round((stats.avgWait / maxWait) * 100)) : 0
          const waitLabel = stats.avgWait != null ? t('avgWaitLabel', { time: stats.avgWait }) : ''

          return `
            <div class="p-2 rounded-xl ${isBest ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-white/5'}">
              <div class="flex items-center gap-2 mb-1">
                <span aria-hidden="true">${meta.icon}</span>
                <span class="text-sm font-medium ${isBest ? 'text-emerald-400' : 'text-slate-300'}">${escapeHTML(label)}</span>
                ${isBest ? `<span class="text-[10px] font-semibold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded-full ml-auto">${icon('star', 'w-3 h-3 inline')} Best</span>` : ''}
              </div>
              ${stats.avgWait != null ? `
                <div class="flex items-center gap-2">
                  <div class="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                    <div class="h-full rounded-full transition-all ${isBest ? 'bg-emerald-500' : 'bg-slate-500'}"
                      style="width: ${barWidth}%;"></div>
                  </div>
                  <span class="text-xs text-slate-400 whitespace-nowrap">${escapeHTML(waitLabel)}</span>
                </div>
              ` : ''}
              <div class="text-[10px] text-slate-500 mt-1">${stats.count} ${t('reviews') || 'avis'}</div>
            </div>
          `
        }).join('')}
      </div>
    </details>
  `
}

/**
 * Render navigation app quick access buttons
 */
function renderNavigationAppButtons(lat, lng, name) {
  if (!lat || !lng) return ''

  const apps = getAvailableNavigationApps()
  const escapedName = escapeJSString(name || '')

  return apps.map(app => {
    const iconName = app.id === 'google-maps' ? 'google'
      : app.id === 'waze' ? 'navigation'
      : app.id === 'apple-maps' ? 'apple'
      : app.iconFallback || 'map-pin'

    return `
      <button
        onclick="openInNavigationApp('${app.id}', ${lat}, ${lng}, '${escapedName}')"
        class="nav-app-btn flex flex-col items-center gap-1 p-3 rounded-xl transition-colors hover:-translate-y-1"
        style="background: ${app.color}20; border: 1px solid ${app.color}40;"
        type="button"
        aria-label="${t('openIn') || 'Ouvrir dans'} ${app.name}"
        title="${app.name}"
      >
        <span style="color: ${app.color};" aria-hidden="true">${icon(iconName, 'w-5 h-5')}</span>
        <span class="text-xs font-medium" style="color: ${app.color};">${app.name}</span>
      </button>
    `
  }).join('')
}

/**
 * Render user reviews section
 */
function renderSpotReviews(spot) {
  const reviews = spot.reviews || spot._reviews || []

  const displayReviews = reviews.length > 0
    ? reviews.filter(r => !r.isTip).slice(0, 5)
    : generatePlaceholderReviews(spot)

  if (displayReviews.length === 0) return ''

  return `
    <div class="mt-4 pt-4 border-t border-white/10">
      <h3 class="font-semibold mb-3 flex items-center gap-2">
        ${icon('message-circle', 'w-5 h-5 text-primary-400')}
        ${t('userReviews') || 'Avis de la communauté'} (${displayReviews.length})
      </h3>
      <div class="space-y-3">
        ${displayReviews.map(review => `
          <div class="p-3 rounded-xl bg-white/5">
            <div class="flex items-center gap-2 mb-2">
              <button
                onclick="showFriendProfile('${escapeHTML(review.userId || 'user_' + crypto.getRandomValues(new Uint32Array(1))[0].toString(36))}')"
                class="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <span class="text-lg">${review.avatar || '🤙'}</span>
                <span class="text-sm font-medium text-primary-400">${escapeHTML(review.userName || t('traveler'))}</span>
                ${review.trustScore != null ? renderMiniTrustBadge(review.trustScore, review.isIdVerified) : ''}
              </button>
              <time class="text-xs text-slate-500 ml-auto">${review.date ? formatReviewDate(review.date) : ''}</time>
            </div>
            ${review.waitTime ? `
              <div class="flex items-center gap-1 text-xs text-slate-400 mb-1">
                ${icon('clock', 'w-3 h-3')}
                <span>${review.waitTime} min ${t('waitTime') || 'attente'}</span>
              </div>
            ` : ''}
            <p class="text-sm text-slate-300">${escapeHTML(review.text || '')}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `
}

function generatePlaceholderReviews(spot) {
  if (!spot.description && !spot.totalReviews) return []

  const reviews = []
  if (spot.description) {
    reviews.push({
      userName: spot.creator || 'HitchWiki',
      avatar: '📝',
      text: spot.description,
      date: spot.lastUsed || spot.createdAt,
      waitTime: spot.avgWaitTime || null,
    })
  }
  return reviews
}

function formatReviewDate(dateStr) {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return ''
    return d.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
  } catch { return '' }
}

export default { renderSpotDetail }
