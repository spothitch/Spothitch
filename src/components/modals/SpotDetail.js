/**
 * SpotDetail Modal Component — Design #2 (Photo Hero + Quick Actions + Accordion)
 * Full-width photo hero, quick action bar, accordion sections, Google Maps button.
 */

import { t } from '../../i18n/index.js'
import { escapeHTML, escapeJSString } from '../../utils/sanitize.js'
import { renderTranslateButton } from '../../services/autoTranslate.js'
import { renderMiniTrustBadge } from '../../services/trustScore.js'
import { getDestinationsDisplay } from '../../utils/spotDestinations.js'
import '../../utils/navigation.js' // Registers window.showNavigationPicker

export function renderSpotDetail(state) {
  const spot = state.selectedSpot
  if (!spot) return ''

  const spotIdStr = typeof spot.id === 'string' ? `'${escapeJSString(spot.id)}'` : spot.id
  const navName = escapeJSString((spot.from || '') + ' - ' + (spot.to || ''))
  const validationCount = spot.validationCount || spot.userValidations || 0

  const spotTitle = spot.from && (spot.to || (spot.destinations && spot.destinations.length))
    ? `${escapeHTML(spot.from)} · ${escapeHTML(getDestinationsDisplay(spot))}`
    : spot.direction
      ? escapeHTML(spot.direction)
      : `${t('spotLocation') || 'Spot'} #${spot.id}`

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
        class="relative w-full max-w-lg max-h-[90vh] overflow-hidden slide-up sm:rounded-xl"
        style="background:#0f1520"
        onclick="event.stopPropagation()"
      >
        <!-- ========== PHOTO HERO — full width 200px ========== -->
        <div style="position:relative;height:200px;background:#161b28;display:flex;align-items:center;justify-content:center;color:#475569;font-size:12px">
          ${renderPhotoHero(spot)}

          <!-- Overlay nav: back button (top-left) -->
          <div style="position:absolute;top:12px;left:12px">
            <button onclick="event.stopPropagation();closeSpotDetail()" type="button"
              style="width:32px;height:32px;background:rgba(15,21,32,0.7);display:flex;align-items:center;justify-content:center;border:none;cursor:pointer"
              aria-label="${t('closeSpotDetails') || 'Fermer'}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e2e8f0" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </button>
          </div>

          <!-- Overlay nav: heart + share (top-right) -->
          <div style="position:absolute;top:12px;right:12px;display:flex;gap:8px">
            <button onclick="event.stopPropagation();toggleFavorite('${escapeJSString(String(spot.id))}')" type="button"
              style="width:32px;height:32px;background:rgba(15,21,32,0.7);display:flex;align-items:center;justify-content:center;border:none;cursor:pointer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e2e8f0" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
            </button>
            <button onclick="event.stopPropagation();openShareCard()" type="button"
              style="width:32px;height:32px;background:rgba(15,21,32,0.7);display:flex;align-items:center;justify-content:center;border:none;cursor:pointer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e2e8f0" stroke-width="2"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
            </button>
          </div>

          <!-- Badge type (bottom-left) -->
          <div style="position:absolute;bottom:12px;left:12px">
            <span style="font-size:11px;color:#f59e0b;text-transform:uppercase;letter-spacing:1px;background:rgba(15,21,32,0.8);padding:4px 10px">${renderSubtitleType(spot)}</span>
          </div>
        </div>

        <!-- ========== SCROLLABLE CONTENT ========== -->
        <div class="overflow-y-auto" style="max-height:calc(90vh - 200px)">

          <!-- Title + coordinates -->
          <div style="padding:16px 20px 0">
            <h2 id="spotdetail-title" style="font-size:22px;font-weight:300;color:#e2e8f0;margin-bottom:4px">${spotTitle}</h2>
            <div style="font-size:12px;color:#475569;margin-bottom:16px">${spot.coordinates?.lat?.toFixed(4) || ''}, ${spot.coordinates?.lng?.toFixed(4) || ''}</div>
          </div>

          <!-- Quick action bar — 2 buttons -->
          <div style="padding:0 20px 16px;display:flex;gap:10px">
            <button onclick="quickValidateSpot(${spotIdStr})" type="button"
              style="flex:1;background:#f59e0b;border:none;color:#0f1520;border-radius:0;padding:12px 8px;font-size:12px;font-weight:600;cursor:pointer;letter-spacing:0.5px;text-transform:uppercase">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f1520" stroke-width="2.5" style="vertical-align:middle;margin-right:4px"><polyline points="20 6 9 17 4 12"/></svg>
              ${t('validateSpot') || 'VALIDER'}
            </button>
            <button onclick="openTestSpot(${spotIdStr})" type="button"
              style="flex:1;background:transparent;border:1px solid #f59e0b;color:#f59e0b;border-radius:0;padding:12px 8px;font-size:12px;font-weight:500;cursor:pointer;letter-spacing:0.5px;text-transform:uppercase">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" style="vertical-align:middle;margin-right:4px"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              ${t('myExperience') || 'MON EXPERIENCE'}
            </button>
          </div>

          <!-- Dates inline — 2 columns separated by vertical line -->
          <div style="padding:0 20px 16px;display:flex;gap:0;border-bottom:1px solid #1a1f2e">
            <div style="flex:1;padding-bottom:12px">
              <div style="font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px">${t('lastValidation') || 'Derniere validation'}</div>
              <div style="font-size:13px;color:#e2e8f0">${spot.lastValidated ? formatRelativeDate(spot.lastValidated) : (spot.lastUsed ? formatRelativeDate(spot.lastUsed) : '—')}</div>
              ${spot.lastValidatedBy ? `<div style="font-size:10px;color:#475569">${escapeHTML(spot.lastValidatedBy)}</div>` : ''}
            </div>
            <div style="width:1px;background:#1a1f2e;margin:0 12px"></div>
            <div style="flex:1;padding-bottom:12px">
              <div style="font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px">${t('lastTest') || 'Derniere utilisation'}</div>
              <div style="font-size:13px;color:#e2e8f0">${spot.lastTested ? formatRelativeDate(spot.lastTested) : '—'}</div>
              ${spot.lastTestedBy ? `<div style="font-size:10px;color:#475569">${escapeHTML(spot.lastTestedBy)}${spot.avgWaitTime ? ' · ' + spot.avgWaitTime + ' min' : ''}</div>` : ''}
            </div>
          </div>

          <!-- ========== ACCORDION SECTIONS ========== -->
          <div style="padding:0 20px">

            <!-- 1. Statistiques -->
            ${renderAccordionStats(spot, validationCount)}

            <!-- 2. Evaluations (rating bars) -->
            ${renderAccordionRatings(spot)}

            <!-- 3. Directions -->
            ${renderAccordionDirections(spot)}

            <!-- 4. Description -->
            ${renderAccordionDescription(spot)}

            <!-- 5. Experiences (reviews) -->
            ${renderAccordionReviews(spot)}

            <!-- 6. Commodites (avant-dernier, juste avant Localisation) -->
            ${renderAccordionAmenities(spot)}

          </div>

          <!-- ========== MAP + Google Maps button ========== -->
          <div style="padding:20px">
            <div style="font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px">${t('location') || 'Localisation'}</div>
            <div style="background:#161b28;height:140px;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#475569;font-size:12px;gap:6px">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              ${spot.coordinates?.lat?.toFixed(4) || ''}, ${spot.coordinates?.lng?.toFixed(4) || ''}
            </div>
            <button onclick="showNavigationPicker(${spot.coordinates?.lat}, ${spot.coordinates?.lng}, '${navName}')" type="button"
              style="width:100%;margin-top:10px;background:transparent;border:1px solid #334155;color:#94a3b8;border-radius:0;padding:12px;font-size:13px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              ${t('openInGoogleMaps') || 'Ouvrir dans Google Maps'}
            </button>
          </div>

          <!-- ========== CREATOR + REPORT ========== -->
          <div style="padding:0 20px 20px">
            <div style="border-top:1px solid #1a1f2e;padding-top:12px;display:flex;justify-content:space-between;align-items:center">
              <div style="font-size:11px;color:#475569">
                ${t('addedBy') || 'Ajouté par'} <span style="color:#94a3b8">${escapeHTML(spot.creator || 'HitchWiki')}</span>
                ${spot.createdAt ? ` · ${formatRelativeDate(spot.createdAt)}` : ''}
              </div>
              <button onclick="openReport('SPOT', '${escapeJSString(String(spot.id))}')" type="button"
                style="font-size:11px;color:#334155;background:transparent;border:none;cursor:pointer;display:flex;align-items:center;gap:4px">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#334155" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
                ${t('report') || 'Signaler'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}

/**
 * Render photo hero — full-width, cover image
 */
function renderPhotoHero(spot) {
  const photos = spot.photos || []
  const mainPhoto = photos[0] || spot.photoUrl

  if (!mainPhoto) {
    return `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>`
  }

  return `<img
    src="${escapeHTML(mainPhoto)}"
    alt="${t('spotPhoto') || 'Photo du spot'}: ${escapeHTML(spot.from || '')} → ${escapeHTML(spot.to || '')}"
    style="width:100%;height:100%;object-fit:cover"
    loading="lazy"
    onclick="event.stopPropagation();openPhotoFullscreen(0)"
  />`
}


/**
 * Render spot type as short label for badge overlay
 */
function renderSubtitleType(spot) {
  if (spot.spotType === 'city_exit') return t('spotTypeCityExit') || 'Sortie de ville'
  if (spot.spotType === 'gas_station') return t('spotTypeGasStation') || 'Station-service'
  if (spot.spotType === 'highway') return t('spotTypeHighway') || 'Autoroute'
  if (spot.spotType) return escapeHTML(spot.spotType)
  return t('spotLocation') || 'Spot'
}


/**
 * Accordion helper using <details><summary>
 */
function accordion(label, content) {
  if (!content) return ''
  return `
    <details open>
      <summary style="display:flex;justify-content:space-between;align-items:center;padding:14px 0;border-bottom:1px solid #1a1f2e;cursor:pointer;list-style:none">
        <span style="font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:1px">${label}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
      </summary>
      <div style="padding:12px 0">
        ${content}
      </div>
    </details>
  `
}


/**
 * Accordion 1: Stats (2x2 grid)
 */
function renderAccordionStats(spot, validationCount) {
  const content = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <div>
        <div style="font-size:24px;font-weight:300;color:#e2e8f0">${spot.avgWaitTime ? spot.avgWaitTime + ' min' : '—'}</div>
        <div style="font-size:10px;color:#64748b;text-transform:uppercase">${t('avgWaitTime') || 'Attente moyenne'}</div>
      </div>
      <div>
        <div style="font-size:24px;font-weight:300;color:#e2e8f0">${spot.successRate ? spot.successRate + '%' : '—'}</div>
        <div style="font-size:10px;color:#64748b;text-transform:uppercase">${t('successRate') || 'Taux de succes'}</div>
      </div>
      <div>
        <div style="font-size:24px;font-weight:300;color:#e2e8f0">${validationCount || '—'}</div>
        <div style="font-size:10px;color:#64748b;text-transform:uppercase">${t('validations') || 'Utilisations'}</div>
      </div>
      <div>
        <div style="font-size:24px;font-weight:300;color:#f59e0b">${spot.safetyRating || spot.ratings?.safety || '—'}</div>
        <div style="font-size:10px;color:#64748b;text-transform:uppercase">${t('safety') || 'Securite moy.'}</div>
      </div>
    </div>
  `
  return accordion(t('statistics') || 'Statistiques', content)
}

/**
 * Accordion 2: Ratings (3 bar ratings)
 */
function renderAccordionRatings(spot) {
  const safety = spot.safetyRating || spot.ratings?.safety || 0
  const traffic = spot.trafficRating || spot.ratings?.traffic || 0
  const access = spot.accessRating || spot.ratings?.accessibility || 0

  if (!safety && !traffic && !access) return ''

  const renderBar = (label, val) => `
    <div style="margin-bottom:16px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
        <span style="font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:1px">${label}</span>
        <span style="font-size:12px;color:#f59e0b">${val}/5</span>
      </div>
      <div style="display:flex;gap:4px">
        ${[1, 2, 3, 4, 5].map(i => `<div style="flex:1;height:4px;border-radius:2px;background:${i <= val ? '#f59e0b' : '#1a1f2e'}"></div>`).join('')}
      </div>
    </div>
  `

  const content = renderBar(t('safety') || 'Securite', safety)
    + renderBar(t('traffic') || 'Trafic', traffic)
    + renderBar(t('accessibility') || 'Accessibilite', access)

  return accordion(t('ratings') || 'Evaluations', content)
}


/**
 * Accordion 3: Directions (underline tabs)
 */
function renderAccordionDirections(spot) {
  const dests = spot.destinations || []
  const mainDest = spot.to || spot.direction
  if (!mainDest && dests.length === 0) return ''

  const allDests = dests.length > 0
    ? dests.map(d => d.city)
    : mainDest ? [mainDest] : []

  if (allDests.length === 0) return ''

  const spotIdStr = typeof spot.id === 'string' ? `'${escapeJSString(spot.id)}'` : spot.id

  const content = `
    <div style="display:flex;gap:0;border-bottom:1px solid #334155;margin-bottom:8px">
      ${allDests.map((city, i) => `
        <div style="flex:1;padding:10px 0;text-align:center;font-size:13px;${i === 0 ? 'color:#f59e0b;border-bottom:2px solid #f59e0b;margin-bottom:-1px' : 'color:#64748b'}">${escapeHTML(city)}</div>
      `).join('')}
    </div>
    <button
      type="button"
      onclick="addDestinationToExistingSpot(${spotIdStr})"
      style="width:100%;padding:8px;font-size:11px;color:#475569;background:transparent;border:none;border-bottom:1px solid rgba(255,255,255,0.05);cursor:pointer;display:flex;align-items:center;justify-content:center;gap:4px"
    >+ ${t('addYourDestination') || 'Ajouter ta destination'}</button>
  `
  return accordion(`${t('destinations') || 'Directions'} (${allDests.length})`, content)
}

/**
 * Accordion 4: Amenities (underline chips)
 */
function renderAccordionAmenities(spot) {
  const tags = spot.tags || {}
  const amenities = [
    { key: 'shelter', label: t('amenityShelter') || 'Abri', has: tags.shelter || tags.hasShelter },
    { key: 'waterFood', label: t('amenityWater') || 'Eau', has: tags.waterFood },
    { key: 'toilets', label: t('amenityToilets') || 'Toilettes', has: tags.toilets },
    { key: 'food', label: t('amenityFood') || 'Nourriture', has: tags.food || tags.waterFood },
    { key: 'stoppingSpace', label: t('stoppingSpaceTag') || 'Parking', has: tags.stoppingSpace },
  ]

  const content = `
    <div style="display:flex;flex-wrap:wrap;gap:0">
      ${amenities.map(a => `
        <div style="padding:8px 14px;font-size:12px;${a.has ? 'color:#f59e0b;border-bottom:2px solid #f59e0b' : 'color:#64748b'}">${escapeHTML(a.label)}</div>
      `).join('')}
    </div>
  `
  return accordion(t('amenities') || 'Commodites', content)
}

/**
 * Accordion 5: Description
 */
function renderAccordionDescription(spot) {
  if (!spot.description) return ''
  const content = `
    <div style="font-size:13px;color:#94a3b8;line-height:1.6">${escapeHTML(spot.description)}</div>
    ${renderTranslateButton(spot.description, `spot-desc-${spot.id}`)}
  `
  return accordion(t('description') || 'Description', content)
}

/**
 * Accordion 6: Experiences / Reviews
 */
function renderAccordionReviews(spot) {
  const reviews = spot.reviews || spot._reviews || []
  const displayReviews = reviews.length > 0
    ? reviews.filter(r => !r.isTip).slice(0, 5)
    : generatePlaceholderReviews(spot)

  if (displayReviews.length === 0) return ''

  const content = displayReviews.map(review => {
    const methodLabel = review.method === 'sign' ? (t('methodSign') || 'Panneau')
      : review.method === 'thumb' ? (t('methodThumb') || 'Pouce')
        : review.method === 'asking' ? (t('methodAsking') || 'En demandant')
          : review.travelMode || ''

    const groupLabel = review.groupSize === 'solo' ? 'Solo'
      : review.groupSize === 'duo' ? 'Duo'
        : review.groupSize === 'group' ? 'Groupe'
          : ''

    return `
      <div style="padding:16px 0;border-bottom:1px solid #1a1f2e">
        <div style="font-size:11px;color:#64748b;margin-bottom:6px">
          <span style="color:#e2e8f0">${escapeHTML(review.userName || t('traveler') || 'Voyageur')}</span>
          ${review.trustScore != null ? renderMiniTrustBadge(review.trustScore, review.isIdVerified) : ''}
          ${review.date ? `<span style="color:#334155"> · </span>${typeof review.date === 'string' ? formatRelativeDate(review.date) : ''}` : ''}
          ${review.waitTime ? `<span style="color:#334155"> · </span><span style="color:#f59e0b">${review.waitTime} min</span>` : ''}
          ${methodLabel ? `<span style="color:#334155"> · </span>${methodLabel}` : ''}
          ${groupLabel ? ` · ${groupLabel}` : ''}
        </div>
        <div style="font-size:13px;color:#94a3b8;line-height:1.5">${escapeHTML(review.text || '')}</div>
        ${review.rating ? `
          <div style="display:flex;gap:4px;margin-top:6px">
            ${[1, 2, 3, 4, 5].map(i => `<div style="width:30px;height:4px;border-radius:2px;background:${i <= (review.rating || 0) ? '#f59e0b' : '#1a1f2e'}"></div>`).join('')}
          </div>
        ` : ''}
      </div>
    `
  }).join('')

  return accordion(`${t('userReviews') || 'Experiences'} (${displayReviews.length})`, content)
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

/**
 * Format date as relative time (il y a X jours/semaines/mois)
 */
function formatRelativeDate(dateStr) {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return ''
    const now = new Date()
    const diffMs = now - d
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays < 1) return t('today') || "aujourd'hui"
    if (diffDays === 1) return t('yesterday') || 'hier'
    if (diffDays < 7) return `${diffDays} ${t('daysAgo') || 'jours'}`
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7)
      return `${weeks} ${weeks === 1 ? (t('weekAgo') || 'semaine') : (t('weeksAgo') || 'semaines')}`
    }
    if (diffDays < 365) {
      const months = Math.floor(diffDays / 30)
      return `${months} ${t('monthsAgo') || 'mois'}`
    }
    const years = Math.floor(diffDays / 365)
    return `${years} ${years === 1 ? (t('yearAgo') || 'an') : (t('yearsAgo') || 'ans')}`
  } catch { return '' }
}

// Handler: add a destination to an existing spot
window.addDestinationToExistingSpot = async (spotId) => {
  const { getCurrentUser } = await import('../../services/firebase.js')
  const user = getCurrentUser()
  if (!user) {
    const { setState } = await import('../../stores/state.js')
    setState({ showAuth: true })
    return
  }

  const { getState, setState } = await import('../../stores/state.js')
  const spot = getState().selectedSpot
  if (!spot) return

  // Check max destinations
  const currentDests = spot.destinations || []
  if (currentDests.length >= 5) {
    const { showError } = await import('../../services/notifications.js')
    showError(t('maxDestinations'))
    return
  }

  // Show inline input
  const btn = document.querySelector('[onclick*="addDestinationToExistingSpot"]')
  if (!btn) return

  const wrapper = document.createElement('div')
  wrapper.id = 'add-dest-inline'
  wrapper.style.cssText = 'margin-top:6px'
  wrapper.innerHTML = `
    <input type="text" id="spot-detail-dest-input"
      class="input-modern text-sm" style="font-size:13px;padding:8px 12px"
      placeholder="${t('destinationCityPlaceholder') || 'Ville de destination'}" />
  `
  btn.style.display = 'none'
  btn.parentNode.insertBefore(wrapper, btn.nextSibling)

  const input = document.getElementById('spot-detail-dest-input')
  if (input) {
    input.focus()
    const { initAutocomplete } = await import('../../utils/autocomplete.js')
    const { searchPhoton } = await import('../../services/osrm.js')
    initAutocomplete({
      inputId: 'spot-detail-dest-input',
      searchFn: (q) => searchPhoton(q, {}),
      debounceMs: 100,
      forceSelection: true,
      onSelect: async (item) => {
        const { hasDestination } = await import('../../utils/spotDestinations.js')
        if (hasDestination(spot, item.name)) {
          const { showError } = await import('../../services/notifications.js')
          showError(t('destinationAlreadyExists'))
          return
        }

        const { addDestinationToSpot } = await import('../../services/firebase.js')
        const result = await addDestinationToSpot(spotId, {
          city: item.name,
          coords: { lat: item.lat, lng: item.lng },
        })

        if (result.success) {
          const { showSuccess } = await import('../../services/notifications.js')
          showSuccess(t('destinationAdded'))
          // Update local spot data
          if (!spot.destinations) spot.destinations = []
          spot.destinations.push(result.entry)
          spot.to = spot.destinations[0]?.city || spot.to
          setState({ selectedSpot: { ...spot } })
        } else if (result.error === 'auth_required') {
          setState({ showAuth: true })
        }
      },
      onClear: () => {},
    })
  }
}

export default { renderSpotDetail }
