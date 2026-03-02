/**
 * SpotDetail Modal Component — Design Final (spot-final.html)
 * Full details view of a spot with solid status badge, emerald score circle,
 * green/amber/blue action buttons, date cards, weather/legal/season strip,
 * 4 metrics, 6 expandable sections, 3 secondary buttons.
 */

import { t } from '../../i18n/index.js'
import { escapeHTML, escapeJSString } from '../../utils/sanitize.js'
import { getSpotFreshness } from '../../services/spotFreshness.js'
import { renderTranslateButton } from '../../services/autoTranslate.js'
import { renderMiniTrustBadge } from '../../services/trustScore.js'

export function renderSpotDetail(state) {
  const spot = state.selectedSpot
  if (!spot) return ''

  const freshness = getSpotFreshness(spot)
  const spotIdStr = typeof spot.id === 'string' ? `'${escapeJSString(spot.id)}'` : spot.id
  const navName = escapeJSString((spot.from || '') + ' - ' + (spot.to || ''))
  const validationCount = spot.validationCount || spot.userValidations || 0
  const photos = spot.photos || []
  const photoCount = photos.length || (spot.photoUrl ? 1 : 0)

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
        style="border-radius:28px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.03)"
        onclick="event.stopPropagation()"
      >
        <!-- ========== PHOTO — arrondie avec padding ========== -->
        <div style="padding:10px 10px 0">
          <div class="relative cursor-pointer" style="aspect-ratio:2/1" onclick="openPhotoFullscreen(0)" role="button" tabindex="0">
            ${renderPhotoSection(spot)}
            <!-- Gradient overlay -->
            <div class="absolute inset-0" style="background:linear-gradient(to top,rgba(15,21,32,.9) 5%,transparent 50%);border-radius:20px"></div>

            <!-- Close button -->
            <button
              onclick="event.stopPropagation();closeSpotDetail()"
              class="absolute top-2 right-2 z-10 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
              style="background:rgba(0,0,0,.5)"
              aria-label="${t('closeSpotDetails') || 'Fermer les détails du spot'}"
              type="button"
            >✕</button>

            <!-- Status badge — solid opaque -->
            ${renderStatusBadge(spot, freshness)}

            <!-- Title + subtitle overlay bottom-left -->
            <div class="absolute bottom-2.5 left-3" style="right:80px">
              <h2 id="spotdetail-title" class="font-extrabold leading-tight" style="font-size:17px">
                ${spot.from && spot.to
                  ? `${escapeHTML(spot.from)} → ${escapeHTML(spot.to)}`
                  : spot.direction
                    ? `📍 ${escapeHTML(spot.direction)}`
                    : `📍 ${t('spotLocation') || 'Spot'} #${spot.id}`}
              </h2>
              <div style="font-size:10px;color:rgba(255,255,255,.5)">
                ${renderSubtitle(spot)}
              </div>
            </div>

            <!-- Score circle — emerald gradient, bottom-right -->
            ${spot.globalRating ? `
              <div class="absolute flex items-center justify-center text-white"
                style="width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#10b981,#059669);font-size:18px;font-weight:900;border:3px solid rgba(15,21,32,.8);bottom:10px;right:12px;z-index:1">
                ${spot.globalRating.toFixed?.(1) || spot.globalRating}
              </div>
            ` : ''}

            <!-- Photo count -->
            ${photoCount > 0 ? `
              <div class="absolute flex items-center gap-1 text-white"
                style="bottom:10px;right:${spot.globalRating ? '70px' : '12px'};background:rgba(0,0,0,.6);backdrop-filter:blur(6px);padding:4px 10px;border-radius:14px;font-size:11px;font-weight:600">
                📷 ${photoCount} ${photoCount > 1 ? 'photos' : 'photo'}
              </div>
            ` : ''}
          </div>
        </div>

        <!-- ========== CONTENT ========== -->
        <div class="overflow-y-auto" style="padding:14px;max-height:calc(90vh - 220px)">

          <!-- ========== ACTION BUTTONS — Green + Amber ========== -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px">
            <button
              onclick="quickValidateSpot(${spotIdStr})"
              class="flex flex-col items-center gap-0.5 text-white"
              style="padding:14px 8px;border-radius:24px;border:none;cursor:pointer;background:linear-gradient(135deg,#10b981,#059669);font-weight:800;font-size:14px;box-shadow:0 4px 15px rgba(16,185,129,.3)"
              type="button"
            >
              <span style="font-size:22px">✅</span>${t('iValidate') || 'Je valide'}
              <span style="font-size:9px;font-weight:400;opacity:.7">${t('spotExistsSubtext') || 'Ce spot existe'}</span>
            </button>
            <button
              onclick="openTestSpot(${spotIdStr})"
              class="flex flex-col items-center gap-0.5"
              style="padding:14px 8px;border-radius:24px;border:none;cursor:pointer;background:linear-gradient(135deg,#f59e0b,#d97706);color:#0f1520;font-weight:800;font-size:14px;box-shadow:0 4px 15px rgba(245,158,11,.3)"
              type="button"
            >
              <span style="font-size:22px">🤙</span>${t('iTested') || "J'ai testé"}
              <span style="font-size:9px;font-weight:400;opacity:.7">${t('giveOpinionSubtext') || 'Donner mon avis'}</span>
            </button>
          </div>

          <!-- ========== GOOGLE MAPS — Blue ========== -->
          <button
            onclick="showNavigationPicker(${spot.coordinates?.lat}, ${spot.coordinates?.lng}, '${navName}')"
            class="flex items-center justify-center gap-2.5 w-full text-white"
            style="padding:13px;border-radius:24px;border:none;cursor:pointer;font-weight:800;font-size:14px;background:linear-gradient(135deg,#4285f4,#1a73e8);box-shadow:0 4px 15px rgba(66,133,244,.3);margin-bottom:12px"
            type="button"
          >
            📍 ${t('openInGoogleMaps') || 'Ouvrir dans Google Maps'}
          </button>

          <!-- ========== DATE CARDS — 2 columns ========== -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
            <div style="padding:10px;border-radius:18px;background:rgba(16,185,129,.05);border:1px solid rgba(16,185,129,.1)">
              <div style="font-size:9px;color:#475569;margin-bottom:2px">✅ ${t('lastValidation') || 'Dernière validation'}</div>
              <div style="font-size:12px;font-weight:700;color:#10b981">${spot.lastValidated ? formatRelativeDate(spot.lastValidated) : (spot.lastUsed ? formatRelativeDate(spot.lastUsed) : '—')}</div>
              ${spot.lastValidatedBy ? `<div style="font-size:10px;color:#475569">par @${escapeHTML(spot.lastValidatedBy)}</div>` : ''}
            </div>
            <div style="padding:10px;border-radius:18px;background:rgba(245,158,11,.05);border:1px solid rgba(245,158,11,.1)">
              <div style="font-size:9px;color:#475569;margin-bottom:2px">🤙 ${t('lastTest') || 'Dernier test'}</div>
              <div style="font-size:12px;font-weight:700;color:#f59e0b">${spot.lastTested ? formatRelativeDate(spot.lastTested) : '—'}</div>
              ${spot.lastTestedBy ? `<div style="font-size:10px;color:#475569">@${escapeHTML(spot.lastTestedBy)}${spot.lastTestRating ? ' • ' + '★'.repeat(spot.lastTestRating) : ''}</div>` : ''}
            </div>
          </div>

          <!-- ========== STRIP: Weather + Legal + Season ========== -->
          ${renderStrip(spot)}

          <!-- ========== 4 METRICS ========== -->
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:6px;margin-bottom:12px" role="group" aria-label="${t('spotStats') || 'Statistiques du spot'}">
            <div style="padding:10px 4px;border-radius:18px;text-align:center;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06)">
              <div style="font-size:10px;color:#475569">⏱️</div>
              <div style="font-size:12px;font-weight:800;color:#f59e0b">${spot.avgWaitTime ? spot.avgWaitTime + ' min' : '—'}</div>
            </div>
            <div style="padding:10px 4px;border-radius:18px;text-align:center;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06)">
              <div style="font-size:10px;color:#475569">🛡️</div>
              <div style="font-size:12px;font-weight:800;color:#10b981">${spot.safetyRating ? spot.safetyRating + '/5' : '—'}</div>
            </div>
            <div style="padding:10px 4px;border-radius:18px;text-align:center;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06)">
              <div style="font-size:10px;color:#475569">🎯</div>
              <div style="font-size:12px;font-weight:800;color:#10b981">${spot.successRate ? spot.successRate + '%' : '—'}</div>
            </div>
            <div style="padding:10px 4px;border-radius:18px;text-align:center;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06)">
              <div style="font-size:10px;color:#475569">✅</div>
              <div style="font-size:12px;font-weight:800;color:#3b82f6">${validationCount}</div>
            </div>
          </div>

          <!-- ========== TAGS ========== -->
          ${renderTagsSection(spot)}

          <!-- ========== 6 EXPANDABLE SECTIONS ========== -->

          <!-- 1. Rating details (3 criteria) -->
          ${renderRatingDetails(spot)}

          <!-- 2. Best time slots -->
          ${renderBestTimeSlots(spot)}

          <!-- 3. Expert tips -->
          ${renderExpertTips(spot)}

          <!-- 4. Emergency & plan B -->
          ${renderEmergencySection(spot)}

          <!-- 5. Nearby alternatives -->
          ${renderNearbyAlternatives(spot, state)}

          <!-- 6. Community reviews -->
          ${renderCommunityReviews(spot)}

          <!-- ========== 3 SECONDARY BUTTONS ========== -->
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">
            <button
              onclick="toggleFavorite('${escapeJSString(String(spot.id))}')"
              class="flex items-center justify-center gap-1 text-white cursor-pointer"
              style="padding:10px;border-radius:20px;font-size:11px;font-weight:700;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.05)"
              type="button"
            >🔖 ${t('save') || 'Sauver'}</button>
            <button
              onclick="openShareCard()"
              class="flex items-center justify-center gap-1 text-white cursor-pointer"
              style="padding:10px;border-radius:20px;font-size:11px;font-weight:700;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.05)"
              type="button"
            >📤 ${t('share') || 'Partager'}</button>
            <button
              onclick="openReport('SPOT', '${escapeJSString(String(spot.id))}')"
              class="flex items-center justify-center gap-1 text-white cursor-pointer"
              style="padding:10px;border-radius:20px;font-size:11px;font-weight:700;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.05)"
              type="button"
            >🚩 ${t('report') || 'Signaler'}</button>
          </div>
        </div>
      </div>
    </div>
  `
}

/**
 * Render photo section — rounded 20px
 */
function renderPhotoSection(spot) {
  const photos = spot.photos || []
  const mainPhoto = photos[0] || spot.photoUrl

  if (!mainPhoto) {
    return `<div class="w-full h-full flex items-center justify-center" style="border-radius:20px;background:linear-gradient(135deg,#0f172a,#1e293b)">
      <span style="font-size:60px">📍</span>
    </div>`
  }

  return `<img
    src="${escapeHTML(mainPhoto)}"
    alt="${t('spotPhoto') || 'Photo du spot'}: ${escapeHTML(spot.from || '')} → ${escapeHTML(spot.to || '')}"
    style="width:100%;height:100%;object-fit:cover;border-radius:20px"
    loading="lazy"
  />`
}

/**
 * Render solid opaque status badge (top-left on photo)
 */
function renderStatusBadge(spot, freshness) {
  const isCertified = freshness.isCertified
  const tier = freshness.tier
  const label = t(freshness.labelKey) || freshness.labelKey

  // Badge style based on tier — solid opaque backgrounds
  const styles = {
    grey: isCertified
      ? 'background:#334155;color:#cbd5e1;border:2px solid #94a3b8'
      : 'background:#334155;color:#cbd5e1;border:1px solid #475569',
    green: isCertified
      ? 'background:#065f46;color:#6ee7b7;border:2px solid #34d399'
      : 'background:#065f46;color:#6ee7b7;border:1px solid #10b981',
    gold: 'background:linear-gradient(135deg,#78350f,#92400e);color:#fde047;border:2px solid #eab308;box-shadow:0 0 12px rgba(234,179,8,.25)',
  }

  const style = styles[tier] || styles.grey

  return `
    <div class="absolute flex items-center gap-1.5 z-10"
      style="top:8px;left:8px;padding:5px 12px;border-radius:20px;font-size:11px;font-weight:700;${style}">
      ${isCertified ? '<span style="font-size:12px">👑</span>' : ''}
      ${escapeHTML(label)}
    </div>
  `
}

/**
 * Render subtitle: type + road + country flag
 */
function renderSubtitle(spot) {
  const parts = []
  if (spot.spotType === 'city_exit') parts.push('🏙️ ' + (t('spotTypeCityExit') || 'Sortie de ville'))
  else if (spot.spotType === 'gas_station') parts.push('⛽ ' + (t('spotTypeGasStation') || 'Station-service'))
  else if (spot.spotType === 'highway') parts.push('🛣️ ' + (t('spotTypeHighway') || 'Autoroute'))
  else if (spot.spotType) parts.push(escapeHTML(spot.spotType))

  if (spot.roadNumber) parts.push(escapeHTML(spot.roadNumber))

  const countryFlag = spot.countryFlag || ''
  if (countryFlag) parts.push(countryFlag)
  else if (spot.country) parts.push(escapeHTML(spot.country))

  return parts.join(' • ')
}

/**
 * Render weather/legal/season strip
 */
function renderStrip(spot) {
  const legality = spot._legality || null
  const month = new Date().getMonth()
  let season, seasonEmoji
  if (month >= 2 && month <= 4) { season = t('seasonSpring') || 'Printemps'; seasonEmoji = '🌸' }
  else if (month >= 5 && month <= 7) { season = t('seasonSummer') || 'Été'; seasonEmoji = '☀️' }
  else if (month >= 8 && month <= 10) { season = t('seasonAutumn') || 'Automne'; seasonEmoji = '🍂' }
  else { season = t('seasonWinter') || 'Hiver'; seasonEmoji = '❄️' }

  const legalBadge = legality === 'legal'
    ? `<span style="display:inline-flex;align-items:center;gap:3px;padding:2px 8px;border-radius:20px;font-size:8px;font-weight:600;background:rgba(16,185,129,.15);color:#6ee7b7;border:1px solid rgba(16,185,129,.2)">⚖️ ${t('legalInCountry') || 'Légal'}</span>`
    : legality === 'illegal'
      ? `<span style="display:inline-flex;align-items:center;gap:3px;padding:2px 8px;border-radius:20px;font-size:8px;font-weight:600;background:rgba(239,68,68,.15);color:#fca5a5;border:1px solid rgba(239,68,68,.2)">⚖️ ${t('legalProhibited') || 'Interdit'}</span>`
      : legality
        ? `<span style="display:inline-flex;align-items:center;gap:3px;padding:2px 8px;border-radius:20px;font-size:8px;font-weight:600;background:rgba(245,158,11,.15);color:#fbbf24;border:1px solid rgba(245,158,11,.2)">⚖️ ${t('legalRestricted') || 'Restreint'}</span>`
        : ''

  return `
    <div class="flex items-center justify-between" style="padding:8px 12px;background:rgba(255,255,255,.02);border-radius:20px;margin-bottom:12px">
      <div class="flex items-center gap-1.5"><span>⛅ —</span></div>
      ${legalBadge}
      <span style="display:inline-flex;align-items:center;gap:3px;padding:2px 8px;border-radius:20px;font-size:8px;font-weight:600;background:rgba(245,158,11,.15);color:#fbbf24;border:1px solid rgba(245,158,11,.2)">${seasonEmoji} ${season}</span>
    </div>
  `
}

/**
 * Render tags/amenities section — matching demo style
 */
function renderTagsSection(spot) {
  const tags = []

  if (spot.tags?.shelter || spot.tags?.hasShelter) tags.push({ emoji: '☂️', label: t('hasShelter') || 'Abri', color: 'g' })
  if (spot.tags?.visibility) tags.push({ emoji: '👁️', label: t('goodVisibilityTag') || 'Visible', color: 'g' })
  if (spot.tags?.stoppingSpace) tags.push({ emoji: '🅿️', label: t('stoppingSpaceTag') || 'Place', color: 'g' })
  if (spot.tags?.waterFood) tags.push({ emoji: '💧', label: t('amenityWaterFood') || 'Eau/nourriture', color: 'b' })
  if (spot.tags?.toilets) tags.push({ emoji: '🚻', label: t('amenityToilets') || 'Toilettes', color: 'b' })
  if (spot.method === 'thumb' || spot.tags?.signMethod === 'thumb') tags.push({ emoji: '🤙', label: t('thumbMethod') || 'Pouce', color: 'a' })
  if (spot.method === 'sign' || spot.tags?.signMethod === 'sign') tags.push({ emoji: '📋', label: t('signMethod') || 'Panneau', color: 'a' })

  if (tags.length === 0) return ''

  const colorMap = {
    g: 'background:rgba(16,185,129,.15);color:#6ee7b7;border:1px solid rgba(16,185,129,.2)',
    a: 'background:rgba(245,158,11,.15);color:#fbbf24;border:1px solid rgba(245,158,11,.2)',
    b: 'background:rgba(59,130,246,.15);color:#93c5fd;border:1px solid rgba(59,130,246,.2)',
  }

  return `
    <div class="flex flex-wrap gap-1.5" style="margin-bottom:12px">
      ${tags.map(tag => `<span style="display:inline-flex;align-items:center;gap:3px;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:600;${colorMap[tag.color]}">${tag.emoji} ${escapeHTML(tag.label)}</span>`).join('')}
    </div>
  `
}

/**
 * Expandable section wrapper — matches demo details/summary style
 */
function expandable(title, content, isLast = false) {
  if (!content) return ''
  return `
    <div style="margin-bottom:${isLast ? '12px' : '8px'}">
      <details>
        <summary class="cursor-pointer flex items-center justify-between" style="padding:10px 14px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:18px;font-size:13px;font-weight:600;list-style:none">
          <span>${title}</span>
          <span style="font-size:10px;color:#64748b;transition:.2s">▼</span>
        </summary>
        <div style="padding:10px;margin-top:4px">
          ${content}
        </div>
      </details>
    </div>
  `
}

/**
 * 1. Rating details (3 criteria with progress bars)
 */
function renderRatingDetails(spot) {
  const safety = spot.safetyRating || spot.ratings?.safety || 0
  const traffic = spot.trafficRating || spot.ratings?.traffic || 0
  const access = spot.accessRating || spot.ratings?.accessibility || 0

  if (!safety && !traffic && !access) return ''

  const bars = [
    { emoji: '🛡️', label: t('safety') || 'Sécurité', val: safety, color: '#10b981' },
    { emoji: '🚗', label: t('traffic') || 'Trafic', val: traffic, color: '#f59e0b' },
    { emoji: '♿', label: t('accessibility') || 'Accès', val: access, color: '#f59e0b' },
  ]

  const content = bars.map(b => `
    <div class="flex items-center justify-between" style="margin-bottom:8px">
      <span style="font-size:10px;color:#475569">${b.emoji} ${escapeHTML(b.label)}</span>
      <span style="font-size:10px;font-weight:700;color:${b.color}">${b.val}/5</span>
    </div>
    <div style="height:6px;border-radius:6px;background:rgba(255,255,255,.08);margin-bottom:8px">
      <div style="height:100%;border-radius:6px;width:${(b.val / 5) * 100}%;background:${b.color}"></div>
    </div>
  `).join('')

  return expandable(`📊 ${t('ratingDetails') || 'Détails notation'} (3 ${t('criteria') || 'critères'})`, content)
}

/**
 * 2. Best time slots
 */
function renderBestTimeSlots(spot) {
  const reviews = spot.reviews || spot._reviews || []
  const comments = spot.comments || []
  const validations = spot.validations || []
  const allEntries = [...reviews, ...comments, ...validations]

  const entriesWithTime = allEntries.filter(e => e.timeOfDay)
  if (entriesWithTime.length === 0) return ''

  const slotMeta = {
    morning:   { icon: '🌅', i18nKey: 'timeMorning',   order: 0 },
    afternoon: { icon: '☀️', i18nKey: 'timeAfternoon', order: 1 },
    evening:   { icon: '🌆', i18nKey: 'timeEvening',   order: 2 },
    night:     { icon: '🌙', i18nKey: 'timeNight',     order: 3 },
  }

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

  for (const [, stats] of slots) {
    stats.avgWait = stats.hasWaitData ? Math.round(stats.totalWait / stats.count) : null
  }

  slots.sort((a, b) => {
    const aAvg = a[1].avgWait
    const bAvg = b[1].avgWait
    if (aAvg != null && bAvg != null) return aAvg - bAvg
    if (aAvg != null) return -1
    if (bAvg != null) return 1
    return b[1].count - a[1].count
  })

  const bestSlotKey = slots[0][0]
  const bestMeta = slotMeta[bestSlotKey]
  const bestLabel = t(bestMeta.i18nKey) || bestSlotKey
  const bestStats = slots[0][1]

  const content = `
    <div style="padding:10px;border-radius:14px;background:rgba(16,185,129,.05)">
      <div style="font-size:12px;font-weight:700;color:#10b981">✨ ${escapeHTML(bestLabel)}</div>
      ${bestStats.avgWait != null ? `<div style="font-size:10px;color:#475569;margin-top:4px">${bestStats.avgWait} min ${t('average') || 'en moyenne'} • ${bestStats.count} ${t('reviews') || 'avis'}</div>` : `<div style="font-size:10px;color:#475569;margin-top:4px">${bestStats.count} ${t('reviews') || 'avis'}</div>`}
    </div>
  `

  return expandable(`🕐 ${t('bestTimeSlots') || 'Meilleurs créneaux'}`, content)
}

/**
 * 3. Expert tips
 */
function renderExpertTips(spot) {
  const reviews = spot.reviews || spot._reviews || []
  const tips = reviews.filter(r => r.isTip)

  if (tips.length === 0) {
    // Show description as a tip if available
    if (!spot.description) return ''

    const content = `
      <div style="padding:10px;border-radius:14px;background:rgba(245,158,11,.05)">
        <div style="font-size:10px;color:#475569">
          <strong style="color:#f59e0b">@${escapeHTML(spot.creator || 'HitchWiki')} :</strong>
          ${escapeHTML(spot.description)}
        </div>
      </div>
      ${renderTranslateButton(spot.description, `spot-desc-${spot.id}`)}
    `
    return expandable(`💡 ${t('expertTips') || "Tips d'experts"} (1)`, content)
  }

  const content = tips.slice(0, 5).map(tip => `
    <div style="padding:10px;border-radius:14px;background:rgba(245,158,11,.05);margin-bottom:6px">
      <div style="font-size:10px;color:#475569">
        <strong style="color:#f59e0b">@${escapeHTML(tip.userName || '')} :</strong>
        ${escapeHTML(tip.text || '')}
      </div>
    </div>
  `).join('')

  return expandable(`💡 ${t('expertTips') || "Tips d'experts"} (${tips.length})`, content)
}

/**
 * 4. Emergency & plan B
 */
function renderEmergencySection(spot) {
  const content = `
    <div class="flex items-center gap-1.5" style="padding:10px;border-radius:14px;background:rgba(255,255,255,.03);margin-bottom:6px">
      <span>🏥</span>
      <div>
        <div style="font-size:12px;font-weight:700">${t('nearestHospital') || 'Hôpital le plus proche'}</div>
        <div style="font-size:10px;color:#475569">${spot._nearestHospital ? escapeHTML(spot._nearestHospital) : '—'}</div>
      </div>
    </div>
    <div class="flex items-center gap-1.5" style="padding:10px;border-radius:14px;background:rgba(255,255,255,.03)">
      <span>🚌</span>
      <div>
        <div style="font-size:12px;font-weight:700">${t('alternativeTransport') || 'Transport alternatif'}</div>
        <div style="font-size:10px;color:#475569">${spot._alternativeTransport ? escapeHTML(spot._alternativeTransport) : '—'}</div>
      </div>
    </div>
  `

  return expandable(`🆘 ${t('emergencyPlanB') || 'Urgence & plan B'}`, content)
}

/**
 * 5. Nearby alternatives
 */
function renderNearbyAlternatives(spot, state) {
  if (!spot.coordinates?.lat || !spot.coordinates?.lng) return ''

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

    const dLat = (sLat - spotLat) * 111
    const dLng = (sLng - spotLng) * 111 * Math.cos(spotLat * Math.PI / 180)
    const distKm = Math.sqrt(dLat * dLat + dLng * dLng)

    if (distKm <= 5) {
      nearby.push({ ...s, _distKm: distKm })
    }
    if (nearby.length >= 10) break
  }

  if (nearby.length === 0) return ''

  nearby.sort((a, b) => (b.globalRating || 0) - (a.globalRating || 0))
  const top = nearby.slice(0, 3)

  const content = top.map(s => {
    const sId = typeof s.id === 'string' ? `'${escapeJSString(s.id)}'` : s.id
    const sFreshness = getSpotFreshness(s)
    const isBetter = (s.globalRating || 0) > (spot.globalRating || 0)

    return `
      <div class="flex items-center gap-2.5 cursor-pointer" style="padding:10px;border-radius:14px;background:rgba(255,255,255,.03)"
        onclick="selectSpot(${sId})" role="button" tabindex="0">
        <div style="width:28px;height:28px;border-radius:50%;background:${sFreshness.hexColor};display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:900;color:#fff">${s.globalRating ? s.globalRating.toFixed(1) : '?'}</div>
        <div class="flex-1 min-w-0">
          <div style="font-size:12px;font-weight:700">${s.spotType === 'gas_station' ? '⛽ ' : ''}${escapeHTML(s.from || s.direction || t('spotLocation') || 'Spot')}</div>
          <div style="font-size:10px;color:#475569">${s._distKm.toFixed(1)} km${s.validationCount ? ' • ' + (s.validationCount + (s.testCount || 0)) + ' valid.' : ''}</div>
        </div>
        ${isBetter ? `<span style="display:inline-flex;align-items:center;gap:3px;padding:2px 8px;border-radius:20px;font-size:8px;font-weight:600;background:rgba(16,185,129,.15);color:#6ee7b7;border:1px solid rgba(16,185,129,.2);margin-left:auto">${t('better') || 'Mieux!'}</span>` : ''}
      </div>
    `
  }).join('')

  return expandable(`📍 ${t('nearbyAlternatives') || 'Spots proches'} (${nearby.length})`, content, false)
}

/**
 * 6. Community reviews
 */
function renderCommunityReviews(spot) {
  const reviews = spot.reviews || spot._reviews || []
  const displayReviews = reviews.length > 0
    ? reviews.filter(r => !r.isTip).slice(0, 5)
    : generatePlaceholderReviews(spot)

  if (displayReviews.length === 0) return ''

  const content = displayReviews.map(review => `
    <div style="padding:10px;border-radius:14px;background:rgba(255,255,255,.03);margin-bottom:6px">
      <div class="flex items-center gap-1.5" style="margin-bottom:4px">
        <span>${review.avatar || '🤙'}</span>
        <span style="font-size:12px;font-weight:700;color:#f59e0b">@${escapeHTML(review.userName || t('traveler') || 'Voyageur')}</span>
        ${review.trustScore != null ? renderMiniTrustBadge(review.trustScore, review.isIdVerified) : ''}
        <span style="font-size:10px;color:#475569;margin-left:auto">${review.waitTime ? '★'.repeat(Math.min(review.rating || 5, 5)) + ' • ' + review.waitTime + ' min' : ''}${review.travelMode ? ' • ' + review.travelMode : ''}</span>
      </div>
      <div style="font-size:10px;color:#475569">${escapeHTML(review.text || '')}</div>
    </div>
  `).join('')

  return expandable(`💬 ${t('userReviews') || 'Avis communauté'} (${displayReviews.length})`, content, true)
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

export default { renderSpotDetail }
