/**
 * SpotDetail Modal Component — Design v5 (Photo Hero + Stats Overlay + Flat Layout)
 * Photo hero, glassmorphism stats bar, flat sections, modified CTA buttons.
 */

import { t } from '../../i18n/index.js'
import { icon } from '../../utils/icons.js'
import { escapeHTML, escapeJSString } from '../../utils/sanitize.js'
import { renderMiniTrustBadge } from '../../services/trustScore.js'
import { isFavorite } from '../../services/favorites.js'
import '../../utils/navigation.js' // Registers window.showNavigationPicker

export function renderSpotDetail(state) {
  const spot = state.selectedSpot
  if (!spot) return ''

  const spotIdStr = typeof spot.id === 'string' ? `'${escapeJSString(spot.id)}'` : spot.id
  const navName = escapeJSString((spot.from || '') + ' - ' + (spot.to || ''))
  // For converted spots (hitchwiki → community), only count community data
  const isConverted = spot.source === 'community' && spot.attribution === 'SpotHitch'
  const totalValidations = isConverted
    ? (spot.validationCount || 0)
    : (spot.validationCount || spot.userValidations || 0)
  const testCount = spot.liveTestCount || spot.testCount || 0
  const checkins = spot.checkins || 0
  // Validations = full experiences (with ratings/comments). Disponibilités = quick confirms
  const validatedCount = Math.max(testCount, checkins)
  const availableCount = Math.max(0, totalValidations - validatedCount)

  const successRate = spot.liveSuccessRate != null ? spot.liveSuccessRate
    : spot.successRate != null ? spot.successRate
      : (spot.rideResult === 'yes' ? 100 : spot.rideResult === 'gaveUp' ? 0 : null)

  const spotName = spot.from || spot.departureCity || spot.fromCity || spot.city || spot.locationName
  const spotTitle = spotName
    ? escapeHTML(spotName)
    : spot.direction || spot.directionCity
      ? escapeHTML(spot.direction || spot.directionCity)
      : `${t('spotLocation') || 'Spot'}`

  // Destinations — merge static (from data) + live (from Firebase)
  const staticDests = (spot.destinations || []).map(d => ({
    name: d.name || d.city,
    count: d.count || 1,
    pct: d.pct || 0,
  }))
  const mainDest = spot.to || spot.direction
  const baseDests = staticDests.length > 0
    ? staticDests
    : mainDest ? [{ name: mainDest, count: 1, pct: 100 }] : []
  // Add live destinations from Firebase validations
  const liveDests = (spot.liveDestinations || []).map(ld => ({
    name: ld.city || ld.name,
    count: ld.count || 1,
    pct: ld.pct || 0,
  }))
  const allDestsMap = new Map()
  for (const d of [...baseDests, ...liveDests]) {
    const key = d.name.toLowerCase()
    if (allDestsMap.has(key)) {
      allDestsMap.get(key).count += d.count
    } else {
      allDestsMap.set(key, { ...d })
    }
  }
  const totalDestVotes = [...allDestsMap.values()].reduce((a, d) => a + d.count, 0)
  const allDests = [...allDestsMap.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map(d => ({ ...d, pct: totalDestVotes > 0 ? Math.round(d.count / totalDestVotes * 100) : 0 }))
  const destsSubtitle = allDests.length > 0
    ? allDests.map(d => escapeHTML(d.name)).join(', ')
    : ''

  // Ratings — prefer live aggregated, then Firestore top-level, then nested
  const liveR = spot.liveRatings
  const safety = liveR?.safety || spot.safety || spot.safetyRating || spot.ratings?.safety || 0
  const traffic = liveR?.traffic || spot.traffic || spot.trafficRating || spot.ratings?.traffic || 0
  const access = liveR?.accessibility || spot.accessibility || spot.accessRating || spot.ratings?.accessibility || 0

  // Practical tags
  const methodLabels = {
    sign: t('methodSign') || 'Panneau',
    thumb: t('methodThumb') || 'Pouce',
    asking: t('methodAsking') || 'En demandant',
  }
  const groupLabels = {
    solo: 'Solo', duo: 'Duo', group: t('groupTrioPlus') || 'Groupe 3+',
  }
  // Aggregate methods/groups from live comments (most common wins)
  const allMethods = []
  const allGroups = []
  if (spot.method) allMethods.push(spot.method)
  if (spot.groupSize) allGroups.push(spot.groupSize)
  for (const c of (spot.liveComments || [])) {
    if (c.method) allMethods.push(c.method)
    if (c.groupSize) allGroups.push(c.groupSize)
  }
  const mostCommon = (arr) => {
    if (arr.length === 0) return null
    const counts = {}
    arr.forEach(v => { counts[v] = (counts[v] || 0) + 1 })
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([k]) => k)
  }
  // Also aggregate timeOfDay
  const allTimes = []
  if (spot.timeOfDay) allTimes.push(spot.timeOfDay)
  for (const c of (spot.liveComments || [])) {
    if (c.timeOfDay) allTimes.push(c.timeOfDay)
  }
  const topMethods = mostCommon(allMethods)
  const topGroups = mostCommon(allGroups)
  const topTimes = mostCommon(allTimes)

  const timeLabels = {
    dawn: t('timeDawn') || 'Aube',
    morning: t('timeMorning') || 'Matin',
    noon: t('timeNoon') || 'Midi',
    afternoon: t('timeAfternoon') || 'Apres-midi',
    evening: t('timeEvening') || 'Soir',
    night: t('timeNight') || 'Nuit',
  }
  const timeEmojis = { dawn: '🌅', morning: '☀️', noon: '🌤', afternoon: '🌆', evening: '🌇', night: '🌙' }

  // Build distribution with counts for display
  const countItems = (arr, labels, emojis) => {
    const total = arr.length
    if (total === 0) return []
    const counts = {}
    arr.forEach(v => { counts[v] = (counts[v] || 0) + 1 })
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([k, c]) => ({
        key: k,
        label: labels[k] || k,
        emoji: emojis?.[k] || '',
        pct: total > 1 ? Math.round(c / total * 100) : 0,
      }))
  }
  const methodStats = countItems(allMethods, methodLabels, { thumb: '👍', sign: '📋', asking: '🗣' })
  const groupStats = countItems(allGroups, groupLabels, { solo: '👤', duo: '👥', group: '👥' })
  const timeStats = countItems(allTimes, timeLabels, timeEmojis)

  const hasTags = methodStats.length > 0 || groupStats.length > 0 || timeStats.length > 0
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
  // Sort: successes first (shortest wait time first), then fails last
  const reviews = (spot.liveComments || spot.comments || []).slice()
  reviews.sort((a, b) => {
    const aFail = a.rideResult === 'no' || a.rideResult === 'gaveUp' ? 1 : 0
    const bFail = b.rideResult === 'no' || b.rideResult === 'gaveUp' ? 1 : 0
    if (aFail !== bFail) return aFail - bFail // successes first
    return (a.waitTime || 999) - (b.waitTime || 999) // shortest wait first
  })
  const displayReviews = reviews.slice(0, 10)

  // Auto-translate comments after render
  if (displayReviews.some(r => r.text)) {
    setTimeout(() => autoTranslateComments(spot.id, displayReviews), 300)
  }

  // Inject Place structured data for SEO
  setTimeout(() => {
    import('../../utils/seo.js').then(({ getSpotSchema, injectSchema }) => {
      injectSchema(getSpotSchema(spot), 'spot-schema')
    }).catch(() => {})
  }, 100)

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

          <!-- Stats glassmorphism bar (clickable) -->
          <div style="margin:10px 12px 0;background:rgba(22,27,40,0.9);backdrop-filter:blur(12px);border-radius:14px;padding:14px;display:flex;justify-content:space-around;border:1px solid #1e293b">
            <div style="text-align:center;cursor:pointer" onclick="document.getElementById('spot-detail-panel')?.classList.toggle('hidden')" role="button" tabindex="0">
              <div style="font-size:22px;font-weight:700;color:${successRate != null ? (successRate >= 50 ? '#22c55e' : '#ef4444') : '#e2e8f0'}">${successRate != null ? successRate + '%' : '—'}</div>
              <div style="font-size:9px;color:#64748b">${t('successRate') || 'Réussite'}</div>
              ${successRate != null && successRate < 100 ? `<div style="font-size:8px;color:#ef4444;margin-top:1px;cursor:pointer">${100 - successRate}% ${t('failRate') || 'échec'} ↓</div>` : ''}
            </div>
            <div style="width:1px;background:#1e293b"></div>
            <div style="text-align:center">
              <div style="font-size:22px;font-weight:700;color:#e2e8f0">${(spot.liveAvgWaitTime || spot.avgWaitTime) ? (spot.liveAvgWaitTime || spot.avgWaitTime) + "'" : '—'}</div>
              <div style="font-size:9px;color:#64748b">${t('waitTimeLabel') || 'Attente'}</div>
            </div>
            <div style="width:1px;background:#1e293b"></div>
            <div style="text-align:center;cursor:pointer" onclick="document.getElementById('spot-people-panel')?.classList.toggle('hidden')" role="button" tabindex="0">
              <div style="font-size:22px;font-weight:700;color:#f59e0b">${validatedCount || '—'}</div>
              <div style="font-size:9px;color:#64748b">${t('usageCount') || 'Validations'}</div>
              ${availableCount > 0 ? `<div style="font-size:8px;color:#f59e0b;margin-top:1px;cursor:pointer">+ ${availableCount} ${t('availabilityCount') || 'dispo.'} ↓</div>` : ''}
            </div>
          </div>

          <!-- Detail panel: success/fail breakdown (hidden by default) -->
          <div id="spot-detail-panel" class="hidden" style="background:#0c1018;border-top:1px solid #1e293b;margin:0 12px;padding:12px;border-radius:0 0 12px 12px">
            ${(() => {
              const successes = displayReviews.filter(r => r.rideResult === 'yes')
              const fails = displayReviews.filter(r => r.rideResult === 'no' || r.rideResult === 'gaveUp')
              // Method breakdown
              const methodBreakdown = {}
              for (const r of displayReviews) {
                if (!r.method) continue
                const label = r.method === 'thumb' ? '👍 ' + (t('methodThumb') || 'Pouce') : r.method === 'sign' ? '📋 ' + (t('methodSign') || 'Panneau') : '🗣 ' + (t('methodAsking') || 'En demandant')
                if (!methodBreakdown[label]) methodBreakdown[label] = { ok: 0, fail: 0 }
                if (r.rideResult === 'yes') methodBreakdown[label].ok++
                else if (r.rideResult === 'no' || r.rideResult === 'gaveUp') methodBreakdown[label].fail++
              }
              // Time breakdown
              const timeBreakdown = {}
              const tLabels = { dawn: '🌅 ' + (t('timeDawn') || 'Aube'), morning: '☀️ ' + (t('timeMorning') || 'Matin'), noon: '🌤 Midi', afternoon: '🌆 ' + (t('timeAfternoon') || 'Après-midi'), evening: '🌇 ' + (t('timeEvening') || 'Soir'), night: '🌙 ' + (t('timeNight') || 'Nuit') }
              for (const r of displayReviews) {
                if (!r.timeOfDay) continue
                const label = tLabels[r.timeOfDay] || r.timeOfDay
                if (!timeBreakdown[label]) timeBreakdown[label] = { ok: 0, fail: 0 }
                if (r.rideResult === 'yes') timeBreakdown[label].ok++
                else if (r.rideResult === 'no' || r.rideResult === 'gaveUp') timeBreakdown[label].fail++
              }
              return `
                <div style="display:flex;gap:8px;margin-bottom:10px">
                  <div style="flex:1;background:#161b28;border-radius:8px;padding:8px;text-align:center;border-left:3px solid #22c55e">
                    <div style="font-size:18px;font-weight:700;color:#22c55e">${successes.length}</div>
                    <div style="font-size:9px;color:#64748b">${t('successes') || 'Réussites'}</div>
                  </div>
                  <div style="flex:1;background:#161b28;border-radius:8px;padding:8px;text-align:center;border-left:3px solid #ef4444">
                    <div style="font-size:18px;font-weight:700;color:#ef4444">${fails.length}</div>
                    <div style="font-size:9px;color:#64748b">${t('failures') || 'Échecs'}</div>
                  </div>
                </div>
                ${Object.entries(methodBreakdown).map(([label, v]) => `
                  <div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid rgba(255,255,255,0.04);font-size:12px">
                    <span>${label}</span>
                    <span style="color:${v.fail > 0 ? '#ef4444' : '#22c55e'}">${v.ok > 0 ? v.ok + ' ✓' : ''}${v.ok > 0 && v.fail > 0 ? ' · ' : ''}${v.fail > 0 ? v.fail + ' ✗' : ''}</span>
                  </div>
                `).join('')}
                ${Object.entries(timeBreakdown).map(([label, v]) => `
                  <div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid rgba(255,255,255,0.04);font-size:12px">
                    <span>${label}</span>
                    <span style="color:${v.fail > 0 ? '#ef4444' : '#22c55e'}">${v.ok > 0 ? v.ok + ' ✓' : ''}${v.ok > 0 && v.fail > 0 ? ' · ' : ''}${v.fail > 0 ? v.fail + ' ✗' : ''}</span>
                  </div>
                `).join('')}
                <div style="text-align:center;font-size:9px;color:#475569;padding-top:6px;cursor:pointer" onclick="this.parentElement.parentElement.classList.add('hidden')" role="button" tabindex="0">${t('close') || 'Fermer'} ▲</div>
              `
            })()}
          </div>

          <!-- People panel: who validated/confirmed (hidden by default) -->
          <div id="spot-people-panel" class="hidden" style="background:#0c1018;border-top:1px solid #1e293b;margin:0 12px;padding:12px;border-radius:0 0 12px 12px">
            ${displayReviews.length > 0 ? `
              <div style="font-size:10px;color:#22c55e;font-weight:600;text-transform:uppercase;margin-bottom:8px">${t('usageCount') || 'Validations'} (${displayReviews.length})</div>
              ${displayReviews.map(r => `
                <div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.04)">
                  <div style="width:24px;height:24px;border-radius:50%;background:${r.rideResult === 'yes' ? '#22c55e' : r.rideResult === 'no' || r.rideResult === 'gaveUp' ? '#ef4444' : '#64748b'};display:flex;align-items:center;justify-content:center;font-size:9px;color:white;flex-shrink:0">${(r.userName || '?')[0]}</div>
                  <div style="flex:1;min-width:0">
                    <span style="font-size:12px;font-weight:500;${r.userId ? 'color:#f59e0b;cursor:pointer' : ''}" ${r.userId ? `onclick="showFriendProfile('${escapeJSString(r.userId)}')" role="button" tabindex="0"` : ''}>${escapeHTML(r.userName || 'Anonyme')}</span>
                    ${r.rideResult === 'yes' ? '<span style="font-size:10px;color:#22c55e;margin-left:4px">✓</span>' : r.rideResult === 'no' || r.rideResult === 'gaveUp' ? '<span style="font-size:10px;color:#ef4444;margin-left:4px">✗</span>' : ''}
                  </div>
                  <span style="font-size:10px;color:#64748b">${r.date ? formatRelativeDate(r.date) : ''}</span>
                </div>
              `).join('')}
            ` : ''}
            <div style="text-align:center;font-size:9px;color:#475569;padding-top:6px;cursor:pointer" onclick="this.parentElement.classList.add('hidden')" role="button" tabindex="0">${t('close') || 'Fermer'} ▲</div>
          </div>

          <!-- Street View banner (glassmorphism) -->
          ${spot.coordinates?.lat ? `
          <div style="background:rgba(15,30,60,0.85);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-top:1px solid rgba(96,165,250,0.2);border-bottom:1px solid rgba(96,165,250,0.2);padding:12px 16px;display:flex;align-items:center;gap:12px">
            <div onclick="openSpotStreetView(${spot.coordinates.lat}, ${spot.coordinates.lng})" role="button" tabindex="0"
              style="display:flex;align-items:center;gap:12px;flex:1;cursor:pointer"
              aria-label="${t('streetView') || 'Street View'}">
              <div style="width:36px;height:36px;background:rgba(96,165,250,0.2);border:1px solid rgba(96,165,250,0.3);border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" stroke-width="2"><circle cx="12" cy="5" r="3"/><path d="M12 8v8"/><path d="M8 21l4-5 4 5"/></svg>
              </div>
              <div style="flex:1">
                <div style="display:flex;align-items:center;gap:6px">
                  <span style="font-size:14px;color:#ffffff;font-weight:600">Street View</span>
                  ${spot.streetViewVerified ? `<span style="font-size:9px;color:#22c55e;background:rgba(34,197,94,0.15);padding:2px 6px;border-radius:99px;font-weight:600">${t('verified') || 'Vérifié'} ✓</span>` : ''}
                </div>
                <div style="font-size:11px;color:#93c5fd">${spot.streetViewVerified ? (t('streetViewSubtitle') || 'Voir cet endroit comme si vous y étiez') : (t('streetViewNearby') || 'Vue Street View à proximité de ce spot')}</div>
              </div>
            </div>
            <div style="display:flex;align-items:center;gap:6px">
              ${!spot.streetViewVerified ? `<button onclick="event.stopPropagation();confirmStreetViewAvailable('${escapeJSString(String(spot.id))}')" type="button"
                style="background:rgba(34,197,94,0.12);border:1px solid rgba(34,197,94,0.3);color:#22c55e;padding:5px 8px;border-radius:8px;font-size:10px;cursor:pointer;white-space:nowrap;font-weight:500"
                title="${t('streetViewConfirmTooltip') || 'Confirmer que Street View fonctionne ici'}"
                aria-label="${t('streetViewConfirmTooltip') || 'Confirmer'}">✓ ${t('streetViewAvailable') || 'Dispo'}</button>` : ''}
              <div onclick="openSpotStreetView(${spot.coordinates.lat}, ${spot.coordinates.lng})" role="button" tabindex="0"
                style="width:28px;height:28px;background:rgba(96,165,250,0.25);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
            </div>
          </div>
          ` : ''}

          <!-- Title + neighborhood + destinations subtitle -->
          <div style="padding:14px 16px 0">
            <h2 id="spotdetail-title" style="font-size:22px;font-weight:600;color:#e2e8f0;margin-bottom:2px">${spotTitle}</h2>
            ${spot.neighborhood ? `<div style="font-size:12px;color:#64748b;margin-bottom:2px">${escapeHTML(spot.neighborhood)}</div>` : ''}
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

          <!-- Dates (2 cards) — aligned with buttons above: Valider (left) / Mon expérience (right) -->
          <div style="padding:0 16px 12px;display:flex;gap:8px">
            <div style="flex:1;background:#161b28;border-radius:8px;padding:8px 10px">
              <div style="font-size:9px;color:#64748b;text-transform:uppercase">${t('lastValidation') || 'Dernière validation'}</div>
              <div style="font-size:12px;color:#e2e8f0">${spot.lastValidated ? formatRelativeDate(spot.lastValidated) : (spot.lastUsed ? formatRelativeDate(spot.lastUsed) : '—')}${displayName(spot.liveLastValidatedBy || spot.lastValidatedBy)}</div>
            </div>
            <div style="flex:1;background:#161b28;border-radius:8px;padding:8px 10px">
              <div style="font-size:9px;color:#64748b;text-transform:uppercase">${t('lastTest') || 'Dernière utilisation'}</div>
              <div style="font-size:12px;color:#e2e8f0">${(spot.liveLastTested || spot.lastTested) ? formatRelativeDate(spot.liveLastTested || spot.lastTested) : '—'}${displayName(spot.liveLastTestedBy || spot.lastTestedBy)}</div>
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

          <!-- Practical tags (colored pills with distribution) -->
          ${hasTags ? `
          <div style="padding:0 16px 6px;font-size:10px;color:#22c55e;text-transform:uppercase;letter-spacing:0.5px;font-weight:600">${t('whatWorks') || 'Ce qui marche ici'}</div>
          <div style="padding:0 16px 4px;display:flex;flex-wrap:wrap;gap:5px">
            ${methodStats.map(s => `<span style="font-size:11px;color:#f59e0b;background:rgba(245,158,11,0.08);padding:4px 9px;border-radius:99px">${s.emoji} ${escapeHTML(s.label)}${s.pct > 0 ? ` <span style="color:#64748b;font-size:9px">${s.pct}%</span>` : ''}</span>`).join('')}
            ${groupStats.map(s => `<span style="font-size:11px;color:#3b82f6;background:rgba(59,130,246,0.08);padding:4px 9px;border-radius:99px">${s.emoji} ${escapeHTML(s.label)}${s.pct > 0 ? ` <span style="color:#64748b;font-size:9px">${s.pct}%</span>` : ''}</span>`).join('')}
            ${timeStats.map(s => `<span style="font-size:11px;color:#22c55e;background:rgba(34,197,94,0.08);padding:4px 9px;border-radius:99px">${s.emoji} ${escapeHTML(s.label)}${s.pct > 0 ? ` <span style="color:#64748b;font-size:9px">${s.pct}%</span>` : ''}</span>`).join('')}
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
            <div id="spot-desc-${escapeHTML(String(spot.id))}" style="font-size:13px;color:#94a3b8;line-height:1.5" data-original-text="${escapeHTML(spot.description)}">${escapeHTML(spot.description)}</div>
            <button onclick="translateSpotText('spot-desc-${escapeJSString(String(spot.id))}')" type="button"
              style="font-size:11px;color:#3b82f6;background:none;border:none;cursor:pointer;padding:4px 0;margin-top:4px;display:flex;align-items:center;gap:4px">
              ${icon('languages', 'w-3.5 h-3.5')} ${t('translate') || 'Traduire'}
            </button>
          </div>
          ` : ''}

          <!-- Station name / Road info -->
          ${(spot.stationName || spot.locationName || spot.roadNumber) ? `
          <div style="padding:0 16px 12px">
            ${spot.stationName ? `<div style="font-size:12px;color:#94a3b8">\u26fd ${escapeHTML(spot.stationName)}</div>` : ''}
            ${(spot.roadNumber || spot.locationName) ? `<div style="font-size:12px;color:#94a3b8;${spot.stationName ? 'margin-top:4px' : ''}">${spot.roadNumber ? escapeHTML(spot.roadNumber) : ''}${spot.roadNumber && spot.locationName ? ' · ' : ''}${spot.locationName ? escapeHTML(spot.locationName) : ''}</div>` : ''}
          </div>
          ` : ''}

          <!-- Destinations with percentages — top ones highlighted -->
          ${allDests.length > 0 ? `
          <div style="padding:0 16px 6px;font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;font-weight:600">${t('destinations') || 'Destinations'}</div>
          <div style="padding:0 16px 12px;display:flex;flex-wrap:wrap;gap:6px">
            ${allDests.map((d, i) => `<span style="font-size:12px;color:#f59e0b;${i < 2 ? 'background:rgba(245,158,11,0.12);border:1px solid rgba(245,158,11,0.3)' : 'background:rgba(245,158,11,0.04);border:1px solid rgba(245,158,11,0.1)'};padding:5px 10px;border-radius:8px">\u2192 ${escapeHTML(d.name)}${d.pct > 0 && allDests.length > 1 ? ` <span style="color:#64748b;font-size:10px">${d.pct}%</span>` : ''}</span>`).join('')}
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
              const isSuccess = review.rideResult === 'yes'
              const isFail = review.rideResult === 'no' || review.rideResult === 'gaveUp'
              const borderColor = isFail ? 'border-left:3px solid #ef4444' : isSuccess ? 'border-left:3px solid #22c55e' : ''
              const resultBadge = isSuccess ? `<span style="font-size:10px;font-weight:600;padding:1px 6px;border-radius:4px;background:rgba(34,197,94,0.15);color:#22c55e;margin-left:4px">✓</span>`
                : isFail ? `<span style="font-size:10px;font-weight:600;padding:1px 6px;border-radius:4px;background:rgba(239,68,68,0.15);color:#ef4444;margin-left:4px">✗</span>` : ''
              return `
              <div style="background:#161b28;border-radius:10px;padding:12px;margin-bottom:6px;${borderColor}">
                <div style="font-size:12px;margin-bottom:2px">
                  <span style="font-weight:500;${review.userId ? 'cursor:pointer;color:#f59e0b' : ''}" ${review.userId ? `onclick="showFriendProfile('${escapeJSString(review.userId)}')" role="button" tabindex="0"` : ''}>${escapeHTML(review.userName || 'Hitchwiki')}</span>
                  ${review.trustScore != null ? renderMiniTrustBadge(review.trustScore, review.isIdVerified) : ''}
                  ${review.rating ? ` <span style="color:#f59e0b">${'\u2605'.repeat(review.rating)}${'\u2606'.repeat(5 - review.rating)}</span>` : ''}
                  ${resultBadge}
                  <br><span style="color:#64748b">${review.waitTime ? review.waitTime + ' min' : ''}${rMethod ? ' · ' + rMethod : ''}${rGroup ? ' · ' + rGroup : ''}${review.timeOfDay ? ' · ' + (review.timeOfDay === 'morning' ? '☀️' : review.timeOfDay === 'night' ? '🌙' : review.timeOfDay === 'evening' ? '🌇' : review.timeOfDay === 'afternoon' ? '🌆' : '') : ''}${review.date ? ' · ' + formatReviewDate(review.date) : ''}</span>
                </div>
                ${review.text ? (() => {
                  const commentId = 'spot-comment-' + spot.id + '-' + displayReviews.indexOf(review)
                  return `<div id="${commentId}" style="font-size:12px;color:#94a3b8" data-original-text="${escapeHTML(review.text)}">"${escapeHTML(review.text)}"</div>
                  <button onclick="translateSpotText('${commentId}')" type="button"
                    style="font-size:10px;color:#3b82f6;background:none;border:none;cursor:pointer;padding:2px 0;display:flex;align-items:center;gap:3px">
                    ${icon('languages', 'w-3 h-3')} ${t('translate') || 'Traduire'}
                  </button>`
                })() : ''}
              </div>
              `
            }).join('')}
          </div>
          ` : ''}

          <!-- Meta + Maps + Street View -->
          <div style="padding:0 16px 12px;display:flex;justify-content:space-between;align-items:center">
            <div style="font-size:11px;color:#475569">\ud83d\udccd ${spot.coordinates?.lat?.toFixed(4) || ''}, ${spot.coordinates?.lng?.toFixed(4) || ''} · <span style="${spot.creatorId ? 'cursor:pointer;color:#f59e0b' : ''}" ${spot.creatorId ? `onclick="showFriendProfile('${escapeJSString(spot.creatorId)}')" role="button" tabindex="0"` : ''}>${escapeHTML(spot.creator || 'HitchWiki')}</span>${spot.createdAt ? ' · ' + formatRelativeDate(spot.createdAt) : ''}</div>
            <div style="display:flex;gap:6px">
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
  const typeMap = {
    gas_station: 'spotTypeGasStation',
    toll: 'spotTypeToll',
    roundabout: 'spotTypeRoundabout',
    on_ramp: 'spotTypeOnRamp',
    roadside: 'spotTypeRoadside',
    custom: 'spotTypeCustom',
    // Legacy types (old data)
    city_exit: 'spotTypeRoadside',
    highway: 'spotTypeRoadside',
  }
  const key = typeMap[spot.spotType]
  if (key) return t(key) || spot.spotType
  if (spot.spotType) return escapeHTML(spot.spotType)
  return t('spotLocation') || 'Spot'
}


/** Filter out UIDs from display — show name or nothing */
function displayName(name) {
  if (!name) return ''
  // Firebase UIDs are 20+ chars, all alphanumeric — don't display these
  if (name.length >= 20 && /^[a-zA-Z0-9]+$/.test(name)) return ''
  return ' · ' + escapeHTML(name)
}

/**
 * Format date as relative time (il y a X jours/semaines/mois)
 */
function formatRelativeDate(dateInput) {
  if (!dateInput) return ''
  try {
    // Handle Firestore Timestamps (have .toDate()), ISO strings, and Date objects
    const d = dateInput.toDate ? dateInput.toDate() : new Date(dateInput)
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
 * Uses DeepL API (if key configured) with MyMemory fallback + localStorage cache
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

      // Translate via DeepL (if key available) with MyMemory fallback
      if (i > 0) await new Promise(r => setTimeout(r, 300))
      const { translateViaAPI } = await import('../../services/autoTranslate.js')
      const translated = await translateViaAPI(review.text, detectedLang, userLang, 5000)
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

// Handler: confirm Street View is available at this spot
window.confirmStreetViewAvailable = async (spotId) => {
  const { getCurrentUser, getFirestore } = await import('../../services/firebase.js')
  const user = getCurrentUser()
  if (!user) {
    const { setState } = await import('../../stores/state.js')
    setState({ showAuth: true })
    return
  }
  try {
    const { doc, updateDoc } = await import('firebase/firestore')
    const db = getFirestore()
    await updateDoc(doc(db, 'spots', spotId), {
      streetViewVerified: true,
      streetViewVerifiedBy: user.uid,
      streetViewVerifiedAt: new Date().toISOString(),
    })
    // Update local state so banner refreshes immediately
    const { getState, setState } = await import('../../stores/state.js')
    const currentSpot = getState().selectedSpot
    if (currentSpot && String(currentSpot.id) === String(spotId)) {
      setState({ selectedSpot: { ...currentSpot, streetViewVerified: true } })
    }
    const { showSuccess } = await import('../../services/notifications.js')
    showSuccess(t('streetViewConfirmed') || 'Street View confirmé pour ce spot !')
  } catch {
    const { showError } = await import('../../services/notifications.js')
    showError(t('errorGeneric') || 'Erreur, réessaie')
  }
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
