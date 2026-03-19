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
  const totalValidations = spot.validationCount || spot.userValidations || 0
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
        class="bg-dark-primary"
        onclick="event.stopPropagation()"
      >
        <!-- ========== PHOTO HERO 200px ========== -->
        <div class="relative h-[200px] bg-[#161b28] flex items-center justify-center text-[#475569] text-xs">
          ${renderPhotoHero(spot)}

          <!-- Back button (top-left) -->
          <div class="absolute top-3 left-3 z-2">
            <button onclick="event.stopPropagation();closeSpotDetail()" type="button"
              class="w-8 h-8 bg-[rgba(15,21,32,0.7)] backdrop-blur-md rounded-full flex items-center justify-center border-none cursor-pointer"
              aria-label="${t('closeSpotDetails') || 'Fermer'}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e2e8f0" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </button>
          </div>

          <!-- Heart + Share (top-right) -->
          <div class="absolute top-3 right-3 z-2 flex gap-1.5">
            <button onclick="event.stopPropagation();toggleFavorite('${escapeJSString(String(spot.id))}')" type="button"
              data-favorite-btn
              class="w-8 h-8 bg-[rgba(15,21,32,0.7)] backdrop-blur-md rounded-full flex items-center justify-center border-none cursor-pointer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="${isFav ? '#f59e0b' : 'none'}" stroke="${isFav ? '#f59e0b' : '#e2e8f0'}" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
            </button>
            <button onclick="event.stopPropagation();openShareCard()" type="button"
              class="w-8 h-8 bg-[rgba(15,21,32,0.7)] backdrop-blur-md rounded-full flex items-center justify-center border-none cursor-pointer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e2e8f0" stroke-width="2"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
            </button>
          </div>

          <!-- Type badge (bottom-left) -->
          <div class="absolute bottom-3 left-3 z-2">
            <span class="text-[11px] text-primary-500 bg-[rgba(15,21,32,0.8)] px-2.5 py-1 rounded-full">${renderSubtitleType(spot)}</span>
          </div>
        </div>

        <!-- ========== SCROLLABLE CONTENT ========== -->
        <div class="overflow-y-auto max-h-[calc(90vh-200px)]">

          <!-- Stats glassmorphism bar (clickable) -->
          <div class="mx-3 mt-2.5 bg-[rgba(22,27,40,0.9)] backdrop-blur-xl rounded-[14px] p-3.5 flex justify-around border border-slate-800">
            <div class="text-center cursor-pointer" onclick="document.getElementById('spot-detail-panel')?.classList.toggle('hidden')" role="button" tabindex="0">
              <div class="text-[22px] font-bold" style="color:${successRate != null ? (successRate >= 50 ? '#22c55e' : '#ef4444') : '#e2e8f0'}">${successRate != null ? successRate + '%' : '—'}</div>
              <div class="text-[10px] text-slate-500">${t('successRate') || 'Réussite'}</div>
              ${successRate != null && successRate < 100 ? `<div class="text-[10px] text-red-500 mt-px cursor-pointer">${100 - successRate}% ${t('failRate') || 'échec'} ↓</div>` : ''}
            </div>
            <div class="w-px bg-slate-800"></div>
            <div class="text-center">
              <div class="text-[22px] font-bold text-slate-200">${(spot.liveAvgWaitTime || spot.avgWaitTime) ? (spot.liveAvgWaitTime || spot.avgWaitTime) + "'" : '—'}</div>
              <div class="text-[10px] text-slate-500">${t('waitTimeLabel') || 'Attente'}</div>
            </div>
            <div class="w-px bg-slate-800"></div>
            <div class="text-center cursor-pointer" onclick="document.getElementById('spot-people-panel')?.classList.toggle('hidden')" role="button" tabindex="0">
              <div class="text-[22px] font-bold text-primary-500">${validatedCount || '—'}</div>
              <div class="text-[10px] text-slate-500">${t('usageCount') || 'Validations'}</div>
              ${availableCount > 0 ? `<div class="text-[10px] text-primary-500 mt-px cursor-pointer">+ ${availableCount} ${t('availabilityCount') || 'dispo.'} ↓</div>` : ''}
            </div>
          </div>

          <!-- Detail panel: success/fail breakdown (hidden by default) -->
          <div id="spot-detail-panel" class="hidden bg-[#0c1018] border-t border-slate-800 mx-3 p-3 rounded-b-xl">
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
                <div class="flex gap-2 mb-2.5">
                  <div class="flex-1 bg-[#161b28] rounded-lg p-2 text-center border-l-3 border-emerald-500">
                    <div class="text-lg font-bold text-emerald-500">${successes.length}</div>
                    <div class="text-[10px] text-slate-500">${t('successes') || 'Réussites'}</div>
                  </div>
                  <div class="flex-1 bg-[#161b28] rounded-lg p-2 text-center border-l-3 border-red-500">
                    <div class="text-lg font-bold text-red-500">${fails.length}</div>
                    <div class="text-[10px] text-slate-500">${t('failures') || 'Échecs'}</div>
                  </div>
                </div>
                ${Object.entries(methodBreakdown).map(([label, v]) => `
                  <div class="flex justify-between py-1.5 border-b border-white/[0.04] text-xs">
                    <span>${label}</span>
                    <span style="color:${v.fail > 0 ? '#ef4444' : '#22c55e'}">${v.ok > 0 ? v.ok + ' ✓' : ''}${v.ok > 0 && v.fail > 0 ? ' · ' : ''}${v.fail > 0 ? v.fail + ' ✗' : ''}</span>
                  </div>
                `).join('')}
                ${Object.entries(timeBreakdown).map(([label, v]) => `
                  <div class="flex justify-between py-1.5 border-b border-white/[0.04] text-xs">
                    <span>${label}</span>
                    <span style="color:${v.fail > 0 ? '#ef4444' : '#22c55e'}">${v.ok > 0 ? v.ok + ' ✓' : ''}${v.ok > 0 && v.fail > 0 ? ' · ' : ''}${v.fail > 0 ? v.fail + ' ✗' : ''}</span>
                  </div>
                `).join('')}
                <div class="text-center text-[10px] text-[#475569] pt-1.5 cursor-pointer" onclick="this.parentElement.parentElement.classList.add('hidden')" role="button" tabindex="0">${t('close') || 'Fermer'} ▲</div>
              `
            })()}
          </div>

          <!-- People panel: who validated/confirmed (hidden by default) -->
          <div id="spot-people-panel" class="hidden bg-[#0c1018] border-t border-slate-800 mx-3 p-3 rounded-b-xl">
            ${displayReviews.length > 0 ? `
              <div class="text-[10px] text-emerald-500 font-semibold uppercase mb-2">${t('usageCount') || 'Validations'} (${displayReviews.length})</div>
              ${displayReviews.map(r => `
                <div class="flex items-center gap-2 py-1.5 border-b border-white/[0.04]">
                  <div class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-white shrink-0" style="background:${r.rideResult === 'yes' ? '#22c55e' : r.rideResult === 'no' || r.rideResult === 'gaveUp' ? '#ef4444' : '#64748b'}">${(r.userName || '?')[0]}</div>
                  <div class="flex-1 min-w-0">
                    <span class="text-xs font-medium" style="${r.userId ? 'color:#f59e0b;cursor:pointer' : ''}" ${r.userId ? `onclick="showFriendProfile('${escapeJSString(r.userId)}')" role="button" tabindex="0"` : ''}>${escapeHTML(r.userName || 'Anonyme')}</span>
                    ${r.rideResult === 'yes' ? '<span class="text-[10px] text-emerald-500 ml-1">✓</span>' : r.rideResult === 'no' || r.rideResult === 'gaveUp' ? '<span class="text-[10px] text-red-500 ml-1">✗</span>' : ''}
                  </div>
                  <span class="text-[10px] text-slate-500">${r.date ? formatRelativeDate(r.date) : ''}</span>
                </div>
              `).join('')}
            ` : ''}
            <div class="text-center text-[10px] text-[#475569] pt-1.5 cursor-pointer" onclick="this.parentElement.classList.add('hidden')" role="button" tabindex="0">${t('close') || 'Fermer'} ▲</div>
          </div>

          <!-- Street View banner (glassmorphism) — 2 states: unverified / certified -->
          ${spot.coordinates?.lat ? `
          <div class="backdrop-blur-xl px-4 py-3 flex items-center gap-3" style="background:${spot.streetViewVerified ? 'rgba(15,40,30,0.85)' : 'rgba(30,30,45,0.75)'};-webkit-backdrop-filter:blur(16px);border-top:1px solid ${spot.streetViewVerified ? 'rgba(34,197,94,0.25)' : 'rgba(100,116,139,0.2)'};border-bottom:1px solid ${spot.streetViewVerified ? 'rgba(34,197,94,0.25)' : 'rgba(100,116,139,0.2)'}">
            <div onclick="openSpotStreetView(${spot.coordinates.lat}, ${spot.coordinates.lng})" role="button" tabindex="0"
              class="flex items-center gap-3 flex-1 cursor-pointer"
              aria-label="${t('streetView') || 'Street View'}">
              <div class="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0" style="background:${spot.streetViewVerified ? 'rgba(34,197,94,0.2)' : 'rgba(100,116,139,0.15)'};border:1px solid ${spot.streetViewVerified ? 'rgba(34,197,94,0.3)' : 'rgba(100,116,139,0.25)'}">
                ${spot.streetViewVerified
                  ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2"><circle cx="12" cy="5" r="3"/><path d="M12 8v8"/><path d="M8 21l4-5 4 5"/></svg>'
                  : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2"><circle cx="12" cy="5" r="3"/><path d="M12 8v8"/><path d="M8 21l4-5 4 5"/></svg>'}
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-1.5">
                  <span class="text-sm font-semibold" style="color:${spot.streetViewVerified ? '#ffffff' : '#94a3b8'}">Street View</span>
                  ${spot.streetViewVerified ? `<span class="text-[10px] text-emerald-500 bg-[rgba(34,197,94,0.15)] px-1.5 py-0.5 rounded-full font-semibold">${t('streetViewCertified') || 'Certifié'} ✓</span>` : `<span class="text-[10px] text-slate-400 bg-[rgba(100,116,139,0.15)] px-1.5 py-0.5 rounded-full font-medium">?</span>`}
                </div>
                <div class="text-[11px]" style="color:${spot.streetViewVerified ? '#86efac' : '#64748b'}">${spot.streetViewVerified ? (t('streetViewSubtitle') || 'Voir cet endroit comme si vous y étiez') : (t('streetViewNotVerified') || 'Pas encore vérifié par la communauté')}</div>
              </div>
            </div>
            <div class="flex items-center gap-1.5">
              ${!spot.streetViewVerified ? `<button onclick="event.stopPropagation();confirmStreetViewAvailable('${escapeJSString(String(spot.id))}')" type="button"
                class="bg-[rgba(96,165,250,0.12)] border border-[rgba(96,165,250,0.3)] text-[#93c5fd] px-2.5 py-1.5 rounded-lg text-[11px] cursor-pointer whitespace-nowrap font-medium"
                title="${t('streetViewConfirmTooltip') || 'Vérifier si Street View fonctionne ici'}"
                aria-label="${t('streetViewConfirmTooltip') || 'Vérifier'}">🔍 ${t('streetViewCheck') || 'Vérifier'}</button>` : ''}
              <div onclick="openSpotStreetView(${spot.coordinates.lat}, ${spot.coordinates.lng})" role="button" tabindex="0"
                class="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer shrink-0" style="background:${spot.streetViewVerified ? 'rgba(34,197,94,0.25)' : 'rgba(100,116,139,0.15)'}">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${spot.streetViewVerified ? '#22c55e' : '#64748b'}" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
            </div>
          </div>
          ` : ''}

          <!-- Title + neighborhood + destinations subtitle -->
          <div class="pt-3.5 px-4">
            <h2 id="spotdetail-title" class="text-[22px] font-semibold text-slate-200 mb-0.5">${spotTitle}</h2>
            ${spot.neighborhood ? `<div class="text-xs text-slate-500 mb-0.5">${escapeHTML(spot.neighborhood)}</div>` : ''}
            ${destsSubtitle ? `<div class="text-[13px] text-slate-500 mb-3.5">\u2192 ${destsSubtitle}</div>` : '<div class="mb-3.5"></div>'}
          </div>

          <!-- CTA Buttons: Valider (secondary) + Mon experience (primary amber) -->
          <div class="px-4 pb-3.5 flex gap-2">
            <button onclick="quickValidateSpot(${spotIdStr})" type="button"
              class="flex-1 bg-[#161b28] text-slate-400 border border-slate-700 pt-3 px-2 pb-2 rounded-[10px] text-[13px] font-medium cursor-pointer flex flex-col items-center gap-0.5">
              <span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2.5" class="align-middle mr-1 inline"><polyline points="20 6 9 17 4 12"/></svg>
                ${t('validateBtn') || 'Valider'}
              </span>
              <span class="text-[10px] text-[#475569] font-normal">${t('validateSubtitle') || 'Le spot est toujours là'}</span>
            </button>
            <button onclick="openTestSpot(${spotIdStr})" type="button"
              class="flex-1 bg-primary-500 text-dark-primary border-none pt-3 px-2 pb-2 rounded-[10px] text-sm font-semibold cursor-pointer flex flex-col items-center gap-0.5">
              <span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f1520" stroke-width="2" class="align-middle mr-1 inline"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                ${t('myExperience') || 'Mon expérience'}
              </span>
              <span class="text-[10px] text-[rgba(15,21,32,0.6)] font-normal">${t('experienceSubtitle') || "J'ai fait du stop ici"}</span>
            </button>
          </div>

          <!-- Dates (2 cards) — aligned with buttons above: Valider (left) / Mon expérience (right) -->
          <div class="px-4 pb-3 flex gap-2">
            <div class="flex-1 bg-[#161b28] rounded-lg py-2 px-2.5">
              <div class="text-[10px] text-slate-500 uppercase">${t('lastValidation') || 'Dernière validation'}</div>
              <div class="text-xs text-slate-200">${spot.lastValidated ? formatRelativeDate(spot.lastValidated) : (spot.lastUsed ? formatRelativeDate(spot.lastUsed) : '—')}${displayName(spot.liveLastValidatedBy || spot.lastValidatedBy)}</div>
            </div>
            <div class="flex-1 bg-[#161b28] rounded-lg py-2 px-2.5">
              <div class="text-[10px] text-slate-500 uppercase">${t('lastTest') || 'Dernière utilisation'}</div>
              <div class="text-xs text-slate-200">${(spot.liveLastTested || spot.lastTested) ? formatRelativeDate(spot.liveLastTested || spot.lastTested) : '—'}${displayName(spot.liveLastTestedBy || spot.lastTestedBy)}</div>
            </div>
          </div>

          <!-- Ratings (3 colored boxes) -->
          ${(safety || traffic || access) ? `
          <div class="px-4 pb-3 flex gap-2">
            <div class="flex-1 bg-[#161b28] rounded-lg p-2.5 text-center">
              <div class="text-lg font-semibold text-primary-500">${safety || '—'}${safety ? '/5' : ''}</div>
              <div class="text-[10px] text-slate-500">${t('safety') || 'Sécurité'}</div>
            </div>
            <div class="flex-1 bg-[#161b28] rounded-lg p-2.5 text-center">
              <div class="text-lg font-semibold text-blue-500">${traffic || '—'}${traffic ? '/5' : ''}</div>
              <div class="text-[10px] text-slate-500">${t('traffic') || 'Trafic'}</div>
            </div>
            <div class="flex-1 bg-[#161b28] rounded-lg p-2.5 text-center">
              <div class="text-lg font-semibold text-purple-500">${access || '—'}${access ? '/5' : ''}</div>
              <div class="text-[10px] text-slate-500">${t('accessibility') || 'Acces'}</div>
            </div>
          </div>
          ` : ''}

          <!-- Practical tags (colored pills with distribution) -->
          ${hasTags ? `
          <div class="px-4 pb-1.5 text-[10px] text-emerald-500 uppercase tracking-wide font-semibold">${t('whatWorks') || 'Ce qui marche ici'}</div>
          <div class="px-4 pb-1 flex flex-wrap gap-1.5">
            ${methodStats.map(s => `<span class="text-[11px] text-primary-500 bg-[rgba(245,158,11,0.08)] py-1 px-2.5 rounded-full">${s.emoji} ${escapeHTML(s.label)}${s.pct > 0 ? ` <span class="text-slate-500 text-[10px]">${s.pct}%</span>` : ''}</span>`).join('')}
            ${groupStats.map(s => `<span class="text-[11px] text-blue-500 bg-[rgba(59,130,246,0.08)] py-1 px-2.5 rounded-full">${s.emoji} ${escapeHTML(s.label)}${s.pct > 0 ? ` <span class="text-slate-500 text-[10px]">${s.pct}%</span>` : ''}</span>`).join('')}
            ${timeStats.map(s => `<span class="text-[11px] text-emerald-500 bg-[rgba(34,197,94,0.08)] py-1 px-2.5 rounded-full">${s.emoji} ${escapeHTML(s.label)}${s.pct > 0 ? ` <span class="text-slate-500 text-[10px]">${s.pct}%</span>` : ''}</span>`).join('')}
          </div>
          ` : ''}

          <!-- Active amenities (pills) -->
          ${amenities.length > 0 ? `
          <div class="px-4 pb-3 flex flex-wrap gap-1.5 ${hasTags ? 'mt-1' : ''}">
            ${amenities.map(a => `<span class="text-[11px] text-slate-400 bg-[rgba(148,163,184,0.08)] py-1 px-2.5 rounded-full">${a.emoji} ${escapeHTML(a.label)}</span>`).join('')}
          </div>
          ` : ''}

          <!-- Description -->
          ${spot.description ? `
          <div class="px-4 pb-3">
            <div id="spot-desc-${escapeHTML(String(spot.id))}" class="text-[13px] text-slate-400 leading-normal" data-original-text="${escapeHTML(spot.description)}">${escapeHTML(spot.description)}</div>
            <button onclick="translateSpotText('spot-desc-${escapeJSString(String(spot.id))}')" type="button"
              class="text-[11px] text-blue-500 bg-transparent border-none cursor-pointer py-1 mt-1 flex items-center gap-1">
              ${icon('languages', 'w-3.5 h-3.5')} ${t('translate') || 'Traduire'}
            </button>
          </div>
          ` : ''}

          <!-- Station name / Road info -->
          ${(spot.stationName || spot.locationName || spot.roadNumber) ? `
          <div class="px-4 pb-3">
            ${spot.stationName ? `<div class="text-xs text-slate-400">\u26fd ${escapeHTML(spot.stationName)}</div>` : ''}
            ${(spot.roadNumber || spot.locationName) ? `<div class="text-xs text-slate-400 ${spot.stationName ? 'mt-1' : ''}">${spot.roadNumber ? escapeHTML(spot.roadNumber) : ''}${spot.roadNumber && spot.locationName ? ' · ' : ''}${spot.locationName ? escapeHTML(spot.locationName) : ''}</div>` : ''}
          </div>
          ` : ''}

          <!-- Destinations with percentages — top ones highlighted -->
          ${allDests.length > 0 ? `
          <div class="px-4 pb-1.5 text-[10px] text-slate-500 uppercase tracking-wide font-semibold">${t('destinations') || 'Destinations'}</div>
          <div class="px-4 pb-3 flex flex-wrap gap-1.5">
            ${allDests.map((d, i) => `<span class="text-xs text-primary-500 py-1.5 px-2.5 rounded-lg" style="${i < 2 ? 'background:rgba(245,158,11,0.12);border:1px solid rgba(245,158,11,0.3)' : 'background:rgba(245,158,11,0.04);border:1px solid rgba(245,158,11,0.1)'}">\u2192 ${escapeHTML(d.name)}${d.pct > 0 && allDests.length > 1 ? ` <span class="text-slate-500 text-[10px]">${d.pct}%</span>` : ''}</span>`).join('')}
          </div>
          ` : ''}

          <!-- Reviews -->
          ${displayReviews.length > 0 ? `
          <div class="px-4 pb-3">
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
              const resultBadge = isSuccess ? `<span class="text-[10px] font-semibold px-1.5 py-px rounded bg-[rgba(34,197,94,0.15)] text-emerald-500 ml-1">✓</span>`
                : isFail ? `<span class="text-[10px] font-semibold px-1.5 py-px rounded bg-[rgba(239,68,68,0.15)] text-red-500 ml-1">✗</span>` : ''
              return `
              <div class="bg-[#161b28] rounded-[10px] p-3 mb-1.5" style="${borderColor}">
                <div class="text-xs mb-0.5">
                  <span class="font-medium" style="${review.userId ? 'cursor:pointer;color:#f59e0b' : ''}" ${review.userId ? `onclick="showFriendProfile('${escapeJSString(review.userId)}')" role="button" tabindex="0"` : ''}>${escapeHTML(review.userName || 'Anonyme')}</span>
                  ${review.trustScore != null ? renderMiniTrustBadge(review.trustScore, review.isIdVerified) : ''}
                  ${review.rating ? ` <span class="text-primary-500">${'\u2605'.repeat(review.rating)}${'\u2606'.repeat(5 - review.rating)}</span>` : ''}
                  ${resultBadge}
                  <br><span class="text-slate-500">${review.waitTime ? review.waitTime + ' min' : ''}${rMethod ? ' · ' + rMethod : ''}${rGroup ? ' · ' + rGroup : ''}${review.timeOfDay ? ' · ' + (review.timeOfDay === 'morning' ? '☀️' : review.timeOfDay === 'night' ? '🌙' : review.timeOfDay === 'evening' ? '🌇' : review.timeOfDay === 'afternoon' ? '🌆' : '') : ''}${review.date ? ' · ' + formatReviewDate(review.date) : ''}</span>
                </div>
                ${review.text ? (() => {
                  const commentId = 'spot-comment-' + spot.id + '-' + displayReviews.indexOf(review)
                  return `<div id="${commentId}" class="text-xs text-slate-400" data-original-text="${escapeHTML(review.text)}">"${escapeHTML(review.text)}"</div>
                  <button onclick="translateSpotText('${commentId}')" type="button"
                    class="text-[10px] text-blue-500 bg-transparent border-none cursor-pointer py-0.5 flex items-center gap-1">
                    ${icon('languages', 'w-3 h-3')} ${t('translate') || 'Traduire'}
                  </button>`
                })() : ''}
              </div>
              `
            }).join('')}
          </div>
          ` : ''}

          <!-- Meta + Maps + Street View -->
          <div class="px-4 pb-3 flex justify-between items-center">
            <div class="text-[11px] text-[#475569]">\ud83d\udccd ${spot.coordinates?.lat?.toFixed(4) || ''}, ${spot.coordinates?.lng?.toFixed(4) || ''} · <span style="${spot.creatorId ? 'cursor:pointer;color:#f59e0b' : ''}" ${spot.creatorId ? `onclick="showFriendProfile('${escapeJSString(spot.creatorId)}')" role="button" tabindex="0"` : ''}>${escapeHTML(spot.creator || 'Anonyme')}</span>${spot.createdAt ? ' · ' + formatRelativeDate(spot.createdAt) : ''}</div>
            <div class="flex gap-1.5">
              <button onclick="showNavigationPicker(${spot.coordinates?.lat}, ${spot.coordinates?.lng}, '${navName}')" type="button"
                class="bg-[#161b28] border border-slate-700 text-slate-400 py-2 px-3 rounded-lg text-[11px] cursor-pointer whitespace-nowrap">\ud83d\uddfa Maps</button>
            </div>
          </div>

          <!-- Report -->
          <div class="text-center py-2 px-4 pb-4">
            <button onclick="openReport('SPOT', '${escapeJSString(String(spot.id))}')" type="button"
              class="text-[11px] text-slate-700 bg-transparent border-none cursor-pointer inline-flex items-center gap-1">
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
      class="w-full h-full object-cover"
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

  return `<div id="spot-hero-placeholder" class="flex flex-col items-center gap-1.5">
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
    <span class="text-[11px] text-[#475569]" id="spot-hero-loading">${t('loadingStreetPhotos') || 'Chargement des photos...'}</span>
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
          class="w-full h-full object-cover"
          loading="lazy"
          onerror="this.style.display='none'"
        />
        <div class="absolute bottom-3 right-3 z-2 flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-full">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
          <span class="text-[10px] text-slate-400">Mapillary</span>
          ${photos.length > 1 ? `<span class="text-[10px] text-slate-500">${photos.length} photos</span>` : ''}
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

// Handler: confirm Street View is available — shows confirmation dialog
window.confirmStreetViewAvailable = async (spotId) => {
  const { getCurrentUser } = await import('../../services/firebase.js')
  const user = getCurrentUser()
  if (!user) {
    const { setState } = await import('../../stores/state.js')
    setState({ showAuth: true })
    return
  }

  // Get spot coordinates for Street View link
  const { getState } = await import('../../stores/state.js')
  const spot = getState().selectedSpot
  const lat = spot?.coordinates?.lat
  const lng = spot?.coordinates?.lng

  // Show confirmation dialog
  const overlay = document.createElement('div')
  overlay.id = 'sv-confirm-overlay'
  overlay.className = 'fixed inset-0 z-70 flex items-center justify-center p-4'
  overlay.innerHTML = `
    <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" onclick="document.getElementById('sv-confirm-overlay')?.remove()" role="button" tabindex="0" aria-label="${t('cancel') || 'Annuler'}"></div>
    <div class="relative bg-dark-primary border border-slate-800 rounded-[14px] max-w-[340px] w-full p-5 text-center" onclick="event.stopPropagation()">
      <div class="w-12 h-12 bg-[rgba(96,165,250,0.15)] rounded-full flex items-center justify-center mx-auto mb-3">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2"><circle cx="12" cy="5" r="3"/><path d="M12 8v8"/><path d="M8 21l4-5 4 5"/></svg>
      </div>
      <h3 class="text-base font-semibold text-slate-200 mb-2">${t('streetViewConfirmTitle') || 'Vérifier Street View'}</h3>
      <p class="text-[13px] text-slate-400 mb-4 leading-normal">${t('streetViewConfirmText') || 'Regardez d\'abord sur Google Street View si cet endroit est bien visible, puis confirmez.'}</p>
      <div class="flex flex-col gap-2">
        <button type="button" onclick="openSpotStreetView(${lat}, ${lng})"
          class="w-full bg-[rgba(96,165,250,0.15)] border border-[rgba(96,165,250,0.3)] text-[#93c5fd] py-3 rounded-[10px] text-[13px] font-medium cursor-pointer flex items-center justify-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" stroke-width="2"><circle cx="12" cy="5" r="3"/><path d="M12 8v8"/><path d="M8 21l4-5 4 5"/></svg>
          ${t('streetViewOpenFirst') || 'Ouvrir Street View d\'abord'}
        </button>
        <button type="button" onclick="doConfirmStreetView('${escapeJSString(String(spotId))}')"
          class="w-full bg-emerald-500 border-none text-white py-3 rounded-[10px] text-sm font-semibold cursor-pointer">
          ${t('streetViewYesConfirm') || 'Oui, Street View fonctionne ici'} ✓
        </button>
        <button type="button" onclick="document.getElementById('sv-confirm-overlay')?.remove()"
          class="w-full bg-transparent border border-slate-700 text-slate-500 py-2.5 rounded-[10px] text-xs cursor-pointer">
          ${t('cancel') || 'Annuler'}
        </button>
      </div>
    </div>
  `
  document.body.appendChild(overlay)
}

// Handler: actually save Street View verification to Firestore
window.doConfirmStreetView = async (spotId) => {
  document.getElementById('sv-confirm-overlay')?.remove()
  try {
    const { getCurrentUser, updateSpot } = await import('../../services/firebase.js')
    const user = getCurrentUser()
    if (!user) return
    await updateSpot(spotId, {
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
    showError(t('error') || 'Erreur')
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
  wrapper.className = 'mt-1.5'
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
