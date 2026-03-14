/**
 * SpotDetail Modal Component — Design v5 (Photo Hero + Stats Overlay + Flat Layout)
 * Photo hero, glassmorphism stats bar, flat sections, modified CTA buttons.
 */

import { t } from '../../i18n/index.js'
import { escapeHTML, escapeJSString } from '../../utils/sanitize.js'
import { renderMiniTrustBadge } from '../../services/trustScore.js'
import { isFavorite } from '../../services/favorites.js'
import '../../utils/navigation.js' // Registers window.showNavigationPicker

export function renderSpotDetail(state) {
  const spot = state.selectedSpot
  if (!spot) return ''

  const spotIdStr = typeof spot.id === 'string' ? `'${escapeJSString(spot.id)}'` : spot.id
  const navName = escapeJSString((spot.from || '') + ' - ' + (spot.to || ''))
  const validationCount = spot.validationCount || spot.userValidations || 0
  const testCount = spot.liveTestCount || spot.testCount || 0
  const usageCount = testCount || validationCount

  const successRate = spot.liveSuccessRate != null ? spot.liveSuccessRate
    : spot.successRate != null ? spot.successRate
      : (spot.rideResult === 'yes' ? 100 : spot.rideResult === 'gaveUp' ? 0 : null)

  const spotTitle = spot.from
    ? escapeHTML(spot.from)
    : spot.direction
      ? escapeHTML(spot.direction)
      : `${t('spotLocation') || 'Spot'} #${spot.id}`

  // Destinations subtitle — merge static + live destinations
  const dests = spot.destinations || []
  const mainDest = spot.to || spot.direction
  const staticDests = dests.length > 0
    ? dests.map(d => d.city)
    : mainDest ? [mainDest] : []
  // Add live destinations from Firebase validations (with counts)
  const liveDests = spot.liveDestinations || []
  const allDestsSet = new Set(staticDests.map(d => d.toLowerCase()))
  const extraDests = liveDests.filter(ld => !allDestsSet.has(ld.city.toLowerCase())).map(ld => ld.city)
  const allDests = [...staticDests, ...extraDests]
  const destsSubtitle = allDests.length > 0
    ? allDests.map(d => escapeHTML(d)).join(', ')
    : ''

  // Ratings — prefer live aggregated ratings
  const liveR = spot.liveRatings
  const safety = liveR?.safety || spot.safetyRating || spot.ratings?.safety || 0
  const traffic = liveR?.traffic || spot.trafficRating || spot.ratings?.traffic || 0
  const access = liveR?.accessibility || spot.accessRating || spot.ratings?.accessibility || 0

  // Practical tags
  const methodLabels = {
    sign: t('methodSign') || 'Panneau',
    thumb: t('methodThumb') || 'Pouce',
    asking: t('methodAsking') || 'En demandant',
  }
  const groupLabels = {
    solo: 'Solo', duo: 'Duo', group: t('groupTrioPlus') || 'Groupe 3+',
  }
  const timeLabels = {
    morning: t('timeMorning') || 'Matin',
    afternoon: t('timeAfternoon') || 'Apres-midi',
    evening: t('timeEvening') || 'Soir',
    night: t('timeNight') || 'Nuit',
  }
  const seasonMap = {
    spring: t('seasonSpring') || 'Printemps',
    summer: t('seasonSummer') || 'Ete',
    autumn: t('seasonAutumn') || 'Automne',
    winter: t('seasonWinter') || 'Hiver',
  }
  const methodLabel = spot.method ? methodLabels[spot.method] || null : null
  const groupLabel = spot.groupSize ? groupLabels[spot.groupSize] || null : null
  const bestTime = spot.timeOfDay ? timeLabels[spot.timeOfDay] || null : null
  const seasonLabel = spot.season ? seasonMap[spot.season] || null : null

  const methodEmoji = spot.method === 'thumb' ? '👍' : spot.method === 'sign' ? '📋' : spot.method === 'asking' ? '🗣' : ''
  const groupEmoji = spot.groupSize === 'solo' ? '👤' : spot.groupSize === 'duo' ? '👥' : spot.groupSize === 'group' ? '👥' : ''
  const timeEmoji = spot.timeOfDay === 'morning' ? '🌅' : spot.timeOfDay === 'afternoon' ? '☀️' : spot.timeOfDay === 'evening' ? '🌇' : spot.timeOfDay === 'night' ? '🌙' : ''
  const seasonEmoji = spot.season === 'spring' ? '🌸' : spot.season === 'summer' ? '☀️' : spot.season === 'autumn' ? '🍂' : spot.season === 'winter' ? '❄️' : ''

  const hasTags = methodLabel || groupLabel || bestTime || seasonLabel
  const isFav = isFavorite(spot.id)

  // Active amenities only
  const tags = spot.tags || {}
  const amenities = [
    { label: t('amenityShelter') || 'Abri', emoji: '🏕', has: tags.shelter || tags.hasShelter },
    { label: t('amenityWater') || 'Eau', emoji: '💧', has: tags.waterFood },
    { label: t('amenityToilets') || 'Toilettes', emoji: '🚻', has: tags.toilets },
    { label: t('amenityFood') || 'Nourriture', emoji: '🍔', has: tags.food },
    { label: t('stoppingSpaceTag') || 'Parking', emoji: '🅿️', has: tags.stoppingSpace },
  ].filter(a => a.has)

  // Reviews — use comments array or liveComments from Firebase
  const reviews = spot.liveComments || spot.comments || []
  const displayReviews = reviews.slice(0, 10)

  // Auto-translate comments after render
  if (displayReviews.some(r => r.text)) {
    setTimeout(() => autoTranslateComments(spot.id, displayReviews), 300)
  }

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
        <!-- ========== PHOTO HERO 200px ========== -->
        <div style="position:relative;height:200px;background:#161b28;display:flex;align-items:center;justify-content:center;color:#475569;font-size:12px">
          ${renderPhotoHero(spot)}

          <!-- Back button (top-left) -->
          <div style="position:absolute;top:12px;left:12px;z-index:2">
            <button onclick="event.stopPropagation();closeSpotDetail()" type="button"
              style="width:32px;height:32px;background:rgba(15,21,32,0.7);backdrop-filter:blur(8px);border-radius:50%;display:flex;align-items:center;justify-content:center;border:none;cursor:pointer"
              aria-label="${t('closeSpotDetails') || 'Fermer'}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e2e8f0" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </button>
          </div>

          <!-- Heart + Share (top-right) -->
          <div style="position:absolute;top:12px;right:12px;z-index:2;display:flex;gap:6px">
            <button onclick="event.stopPropagation();toggleFavorite('${escapeJSString(String(spot.id))}')" type="button"
              data-favorite-btn
              style="width:32px;height:32px;background:rgba(15,21,32,0.7);backdrop-filter:blur(8px);border-radius:50%;display:flex;align-items:center;justify-content:center;border:none;cursor:pointer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="${isFav ? '#f59e0b' : 'none'}" stroke="${isFav ? '#f59e0b' : '#e2e8f0'}" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
            </button>
            <button onclick="event.stopPropagation();openShareCard()" type="button"
              style="width:32px;height:32px;background:rgba(15,21,32,0.7);backdrop-filter:blur(8px);border-radius:50%;display:flex;align-items:center;justify-content:center;border:none;cursor:pointer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e2e8f0" stroke-width="2"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
            </button>
          </div>

          <!-- Type badge (bottom-left) -->
          <div style="position:absolute;bottom:12px;left:12px;z-index:2">
            <span style="font-size:11px;color:#f59e0b;background:rgba(15,21,32,0.8);padding:4px 10px;border-radius:99px">${renderSubtitleType(spot)}</span>
          </div>
        </div>

        <!-- ========== SCROLLABLE CONTENT ========== -->
        <div class="overflow-y-auto" style="max-height:calc(90vh - 200px)">

          <!-- Stats glassmorphism bar -->
          <div style="margin:10px 12px 0;background:rgba(22,27,40,0.9);backdrop-filter:blur(12px);border-radius:14px;padding:14px;display:flex;justify-content:space-around;border:1px solid #1e293b">
            <div style="text-align:center">
              <div style="font-size:22px;font-weight:700;color:${successRate != null ? (successRate >= 50 ? '#22c55e' : '#ef4444') : '#e2e8f0'}">${successRate != null ? successRate + '%' : '—'}</div>
              <div style="font-size:9px;color:#64748b">${t('successRate') || 'Succes'}</div>
            </div>
            <div style="width:1px;background:#1e293b"></div>
            <div style="text-align:center">
              <div style="font-size:22px;font-weight:700;color:#e2e8f0">${(spot.liveAvgWaitTime || spot.avgWaitTime) ? (spot.liveAvgWaitTime || spot.avgWaitTime) + "'" : '—'}</div>
              <div style="font-size:9px;color:#64748b">${t('waitTimeLabel') || 'Attente'}</div>
            </div>
            <div style="width:1px;background:#1e293b"></div>
            <div style="text-align:center">
              <div style="font-size:22px;font-weight:700;color:#f59e0b">${usageCount || '—'}</div>
              <div style="font-size:9px;color:#64748b">${t('usageCount') || 'Utilisations'}</div>
            </div>
          </div>

          <!-- Title + destinations subtitle -->
          <div style="padding:14px 16px 0">
            <h2 id="spotdetail-title" style="font-size:22px;font-weight:600;color:#e2e8f0;margin-bottom:2px">${spotTitle}</h2>
            ${destsSubtitle ? `<div style="font-size:13px;color:#64748b;margin-bottom:14px">\u2192 ${destsSubtitle}</div>` : '<div style="margin-bottom:14px"></div>'}
          </div>

          <!-- CTA Buttons: Valider (secondary) + Mon experience (primary amber) -->
          <div style="padding:0 16px 14px;display:flex;gap:8px">
            <button onclick="quickValidateSpot(${spotIdStr})" type="button"
              style="flex:1;background:#161b28;color:#94a3b8;border:1px solid #334155;padding:12px 8px 8px;border-radius:10px;font-size:13px;font-weight:500;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:3px">
              <span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2.5" style="vertical-align:middle;margin-right:4px"><polyline points="20 6 9 17 4 12"/></svg>
                ${t('validateBtn') || 'Valider'}
              </span>
              <span style="font-size:9px;color:#475569;font-weight:400">${t('validateSubtitle') || 'Le spot est toujours là'}</span>
            </button>
            <button onclick="openTestSpot(${spotIdStr})" type="button"
              style="flex:1;background:#f59e0b;color:#0f1520;border:none;padding:12px 8px 8px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:3px">
              <span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f1520" stroke-width="2" style="vertical-align:middle;margin-right:4px"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                ${t('myExperience') || 'Mon expérience'}
              </span>
              <span style="font-size:9px;color:rgba(15,21,32,0.6);font-weight:400">${t('experienceSubtitle') || "J'ai fait du stop ici"}</span>
            </button>
          </div>

          <!-- Dates (2 cards) -->
          <div style="padding:0 16px 12px;display:flex;gap:8px">
            <div style="flex:1;background:#161b28;border-radius:8px;padding:8px 10px">
              <div style="font-size:9px;color:#64748b;text-transform:uppercase">${t('lastTest') || 'Dernière utilisation'}</div>
              <div style="font-size:12px;color:#e2e8f0">${(spot.liveLastTested || spot.lastTested) ? formatRelativeDate(spot.liveLastTested || spot.lastTested) : '—'}${spot.lastTestedBy ? ' · ' + escapeHTML(spot.lastTestedBy) : ''}</div>
            </div>
            <div style="flex:1;background:#161b28;border-radius:8px;padding:8px 10px">
              <div style="font-size:9px;color:#64748b;text-transform:uppercase">${t('lastValidation') || 'Dernière validation'}</div>
              <div style="font-size:12px;color:#e2e8f0">${spot.lastValidated ? formatRelativeDate(spot.lastValidated) : (spot.lastUsed ? formatRelativeDate(spot.lastUsed) : '—')}${spot.lastValidatedBy ? ' · ' + escapeHTML(spot.lastValidatedBy) : ''}</div>
            </div>
          </div>

          <!-- Ratings (3 colored boxes) -->
          ${(safety || traffic || access) ? `
          <div style="padding:0 16px 12px;display:flex;gap:8px">
            <div style="flex:1;background:#161b28;border-radius:8px;padding:10px;text-align:center">
              <div style="font-size:18px;font-weight:600;color:#f59e0b">${safety || '—'}${safety ? '/5' : ''}</div>
              <div style="font-size:10px;color:#64748b">${t('safety') || 'Sécurité'}</div>
            </div>
            <div style="flex:1;background:#161b28;border-radius:8px;padding:10px;text-align:center">
              <div style="font-size:18px;font-weight:600;color:#3b82f6">${traffic || '—'}${traffic ? '/5' : ''}</div>
              <div style="font-size:10px;color:#64748b">${t('traffic') || 'Trafic'}</div>
            </div>
            <div style="flex:1;background:#161b28;border-radius:8px;padding:10px;text-align:center">
              <div style="font-size:18px;font-weight:600;color:#a855f7">${access || '—'}${access ? '/5' : ''}</div>
              <div style="font-size:10px;color:#64748b">${t('accessibility') || 'Acces'}</div>
            </div>
          </div>
          ` : ''}

          <!-- Practical tags (colored pills) -->
          ${hasTags ? `
          <div style="padding:0 16px 4px;display:flex;flex-wrap:wrap;gap:5px">
            ${methodLabel ? `<span style="font-size:11px;color:#f59e0b;background:rgba(245,158,11,0.08);padding:4px 9px;border-radius:99px">${methodEmoji} ${escapeHTML(methodLabel)}</span>` : ''}
            ${groupLabel ? `<span style="font-size:11px;color:#3b82f6;background:rgba(59,130,246,0.08);padding:4px 9px;border-radius:99px">${groupEmoji} ${escapeHTML(groupLabel)}</span>` : ''}
            ${bestTime ? `<span style="font-size:11px;color:#22c55e;background:rgba(34,197,94,0.08);padding:4px 9px;border-radius:99px">${timeEmoji} ${escapeHTML(bestTime)}</span>` : ''}
            ${seasonLabel ? `<span style="font-size:11px;color:#a855f7;background:rgba(168,85,247,0.08);padding:4px 9px;border-radius:99px">${seasonEmoji} ${escapeHTML(seasonLabel)}</span>` : ''}
          </div>
          ` : ''}

          <!-- Active amenities (pills) -->
          ${amenities.length > 0 ? `
          <div style="padding:0 16px 12px;display:flex;flex-wrap:wrap;gap:5px;${hasTags ? 'margin-top:4px' : ''}">
            ${amenities.map(a => `<span style="font-size:11px;color:#94a3b8;background:rgba(148,163,184,0.08);padding:4px 9px;border-radius:99px">${a.emoji} ${escapeHTML(a.label)}</span>`).join('')}
          </div>
          ` : ''}

          <!-- Description -->
          ${spot.description ? `
          <div style="padding:0 16px 12px">
            <div id="spot-desc-${escapeHTML(String(spot.id))}" style="font-size:13px;color:#94a3b8;line-height:1.5">${escapeHTML(spot.description)}</div>
          </div>
          ` : ''}

          <!-- Station name / Road info -->
          ${(spot.stationName || spot.locationName || spot.roadNumber) ? `
          <div style="padding:0 16px 12px">
            ${spot.stationName ? `<div style="font-size:12px;color:#94a3b8">\u26fd ${escapeHTML(spot.stationName)}</div>` : ''}
            ${(spot.roadNumber || spot.locationName) ? `<div style="font-size:12px;color:#94a3b8;${spot.stationName ? 'margin-top:4px' : ''}">${spot.roadNumber ? escapeHTML(spot.roadNumber) : ''}${spot.roadNumber && spot.locationName ? ' · ' : ''}${spot.locationName ? escapeHTML(spot.locationName) : ''}</div>` : ''}
          </div>
          ` : ''}

          <!-- Destinations (from user experiences only) -->
          ${allDests.length > 0 ? `
          <div style="padding:0 16px 12px;display:flex;flex-wrap:wrap;gap:6px">
            ${allDests.map(d => `<span style="font-size:12px;color:#f59e0b;background:rgba(245,158,11,0.04);border:1px solid rgba(245,158,11,0.2);padding:5px 10px;border-radius:8px">\u2192 ${escapeHTML(d)}</span>`).join('')}
          </div>
          ` : ''}

          <!-- Reviews -->
          ${displayReviews.length > 0 ? `
          <div style="padding:0 16px 12px">
            ${displayReviews.map(review => {
              const rMethod = review.method === 'sign' ? (t('methodSign') || 'Panneau')
                : review.method === 'thumb' ? (t('methodThumb') || 'Pouce')
                  : review.method === 'asking' ? (t('methodAsking') || 'En demandant')
                    : review.travelMode || ''
              const rGroup = review.groupSize === 'solo' ? 'Solo'
                : review.groupSize === 'duo' ? 'Duo'
                  : review.groupSize === 'group' ? 'Groupe'
                    : ''
              return `
              <div style="background:#161b28;border-radius:10px;padding:12px;margin-bottom:6px">
                <div style="font-size:12px;margin-bottom:2px">
                  <span style="font-weight:500">${escapeHTML(review.userName || 'Hitchwiki')}</span>
                  ${review.trustScore != null ? renderMiniTrustBadge(review.trustScore, review.isIdVerified) : ''}
                  ${review.rating ? ` <span style="color:#f59e0b">${'\u2605'.repeat(review.rating)}${'\u2606'.repeat(5 - review.rating)}</span>` : ''}
                  <span style="color:#64748b">${review.waitTime ? ' · ' + review.waitTime + ' min' : ''}${rMethod ? ' · ' + rMethod : ''}${rGroup ? ' · ' + rGroup : ''}${review.date ? ' · ' + formatReviewDate(review.date) : ''}</span>
                </div>
                ${review.text ? (() => {
                  const commentId = 'spot-comment-' + spot.id + '-' + displayReviews.indexOf(review)
                  return `<div id="${commentId}" style="font-size:12px;color:#94a3b8" data-original-text="${escapeHTML(review.text)}">"${escapeHTML(review.text)}"</div>`
                })() : ''}
              </div>
              `
            }).join('')}
          </div>
          ` : ''}

          <!-- Meta + Maps + Street View -->
          <div style="padding:0 16px 12px;display:flex;justify-content:space-between;align-items:center">
            <div style="font-size:11px;color:#475569">\ud83d\udccd ${spot.coordinates?.lat?.toFixed(4) || ''}, ${spot.coordinates?.lng?.toFixed(4) || ''} · ${escapeHTML(spot.creator || 'HitchWiki')}${spot.createdAt ? ' · ' + formatRelativeDate(spot.createdAt) : ''}</div>
            <div style="display:flex;gap:6px">
              ${spot.coordinates?.lat ? `<button onclick="openSpotStreetView(${spot.coordinates.lat}, ${spot.coordinates.lng})" type="button"
                style="background:#161b28;border:1px solid #334155;color:#94a3b8;padding:7px 12px;border-radius:8px;font-size:11px;cursor:pointer;white-space:nowrap">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" style="vertical-align:middle;margin-right:3px"><circle cx="12" cy="5" r="3"/><path d="M12 8v8"/><path d="M8 21l4-5 4 5"/></svg>${t('streetView') || 'Street View'}</button>` : ''}
              <button onclick="showNavigationPicker(${spot.coordinates?.lat}, ${spot.coordinates?.lng}, '${navName}')" type="button"
                style="background:#161b28;border:1px solid #334155;color:#94a3b8;padding:7px 12px;border-radius:8px;font-size:11px;cursor:pointer;white-space:nowrap">\ud83d\uddfa Maps</button>
            </div>
          </div>

          <!-- Report -->
          <div style="text-align:center;padding:8px 16px 16px">
            <button onclick="openReport('SPOT', '${escapeJSString(String(spot.id))}')" type="button"
              style="font-size:11px;color:#334155;background:transparent;border:none;cursor:pointer;display:inline-flex;align-items:center;gap:4px">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#334155" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
              ${t('report') || 'Signaler'}
            </button>
          </div>

        </div>
      </div>
    </div>
  `
}

/**
 * Render photo hero — full-width, cover image
 * Priority: user photos > Mapillary photos (loaded async)
 */
function renderPhotoHero(spot) {
  const photos = spot.photos || []
  const mainPhoto = photos[0] || spot.photoUrl

  if (mainPhoto) {
    return `<img
      src="${escapeHTML(mainPhoto)}"
      alt="${t('spotPhoto') || 'Photo du spot'}: ${escapeHTML(spot.from || 'Spot')}"
      style="width:100%;height:100%;object-fit:cover"
      loading="lazy"
      onclick="event.stopPropagation();openPhotoFullscreen(0)"
      onerror="this.style.display='none';this.parentElement.innerHTML='<svg width=\\'32\\' height=\\'32\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'#475569\\' stroke-width=\\'1.5\\'><path d=\\'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z\\'/><circle cx=\\'12\\' cy=\\'10\\' r=\\'3\\'/></svg>'"
    />`
  }

  // No user photo: show placeholder + trigger Mapillary loading
  const lat = spot.coordinates?.lat
  const lng = spot.coordinates?.lng
  if (lat && lng) {
    // Async load Mapillary photos after render
    setTimeout(() => loadMapillaryForHero(lat, lng, spot.id), 100)
  }

  return `<div id="spot-hero-placeholder" style="display:flex;flex-direction:column;align-items:center;gap:6px">
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
    <span style="font-size:11px;color:#475569" id="spot-hero-loading">${t('loadingStreetPhotos') || 'Chargement des photos...'}</span>
  </div>`
}

/**
 * Load Mapillary photos into the hero area when no user photos exist
 */
async function loadMapillaryForHero(lat, lng, spotId) {
  const placeholder = document.getElementById('spot-hero-placeholder')
  if (!placeholder) return

  try {
    const { fetchMapillaryPhotos } = await import('../../services/mapillary.js')
    const photos = await fetchMapillaryPhotos(lat, lng, 100, 3)

    if (photos.length > 0 && document.getElementById('spot-hero-placeholder')) {
      const heroContainer = placeholder.parentElement
      if (!heroContainer) return

      // Store Mapillary photos for gallery
      window._mapillaryPhotos = photos.map(p => p.url)

      // Show first Mapillary photo as hero
      heroContainer.innerHTML = `
        <img
          src="${escapeHTML(photos[0].url)}"
          alt="${t('streetViewPhoto') || 'Photo de rue'}: ${escapeHTML(String(spotId))}"
          style="width:100%;height:100%;object-fit:cover"
          loading="lazy"
          onerror="this.style.display='none'"
        />
        <div style="position:absolute;bottom:12px;right:12px;z-index:2;display:flex;align-items:center;gap:4px;background:rgba(0,0,0,0.6);padding:3px 8px;border-radius:99px">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
          <span style="font-size:9px;color:#94a3b8">Mapillary</span>
          ${photos.length > 1 ? `<span style="font-size:9px;color:#64748b">${photos.length} photos</span>` : ''}
        </div>
      `

      // Overlay buttons (back, heart, share, type badge) are in the parent container — unaffected
    } else if (document.getElementById('spot-hero-placeholder')) {
      // No Mapillary photos found — show static placeholder
      const loadingEl = document.getElementById('spot-hero-loading')
      if (loadingEl) {
        loadingEl.textContent = t('noStreetPhotos') || 'Pas de photo disponible'
      }
    }
  } catch {
    const loadingEl = document.getElementById('spot-hero-loading')
    if (loadingEl) {
      loadingEl.textContent = t('noStreetPhotos') || 'Pas de photo disponible'
    }
  }
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

/**
 * Auto-translate comments to user's language when spot opens
 * Uses MyMemory API with localStorage cache to avoid repeated calls
 */
async function autoTranslateComments(spotId, reviews) {
  try {
    const { detectLanguage } = await import('../../services/autoTranslate.js')
    let userLang = 'fr'
    try {
      const persisted = localStorage.getItem('spothitch_v4_state')
      if (persisted) {
        const parsed = JSON.parse(persisted)
        if (parsed && parsed.lang) userLang = parsed.lang
      }
    } catch { /* default to fr */ }

    for (let i = 0; i < reviews.length; i++) {
      const review = reviews[i]
      if (!review.text) continue

      const detectedLang = detectLanguage(review.text)
      if (detectedLang === userLang || detectedLang === 'unknown') continue

      const commentId = `spot-comment-${spotId}-${i}`
      const el = document.getElementById(commentId)
      if (!el) continue

      // Check localStorage cache
      const cacheKey = `spothitch_tr_${detectedLang}_${userLang}_${review.text.substring(0, 40)}`
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        el.textContent = `"${cached}"`
        continue
      }

      // Translate via MyMemory API (small delay between calls)
      if (i > 0) await new Promise(r => setTimeout(r, 300))
      const langPair = `${detectedLang}|${userLang}`
      const res = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(review.text.slice(0, 500))}&langpair=${langPair}`,
        { signal: AbortSignal.timeout(5000) }
      )
      const data = await res.json()
      const translated = data?.responseData?.translatedText
      if (translated && translated.toLowerCase() !== review.text.toLowerCase()) {
        el.textContent = `"${translated}"`
        try { localStorage.setItem(cacheKey, translated) } catch { /* quota */ }
      }
    }
  } catch { /* offline or API error, keep original text */ }
}

/**
 * Format review date: cap at "2+ years" to avoid "12 years ago" on a new app
 */
function formatReviewDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return ''
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return ''
    const now = new Date()
    const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24))

    // Recent: normal relative date
    if (diffDays < 730) return formatRelativeDate(dateStr)

    // Old: cap at "2+ years"
    return '2+ ' + (t('yearsAgo') || 'ans')
  } catch { return '' }
}

// Handler: open Google Street View for a spot
window.openSpotStreetView = async (lat, lng) => {
  const { openStreetView } = await import('../../services/streetview.js')
  openStreetView(lat, lng)
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
