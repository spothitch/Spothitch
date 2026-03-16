/**
 * Spot List Component — Admin page for managing all spots
 * Stats bar, filters, sortable paginated list, reported spots priority
 */

import {
  loadAllDocs,
  deleteSpot,
  getSpotReports,
  hideSpot,
  relocateSpot,
  updateDocument,
} from '../services/firebase.js'

function escapeHTML(str) {
  const div = document.createElement('div')
  div.textContent = str || ''
  return div.innerHTML
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  try {
    const d = dateStr.toDate ? dateStr.toDate() : new Date(dateStr)
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  } catch {
    return String(dateStr).slice(0, 10)
  }
}

function countryToFlag(code) {
  if (!code || code.length !== 2) return '📍'
  return String.fromCodePoint(
    ...[...code.toUpperCase()].map((c) => 0x1f1e5 + c.charCodeAt(0))
  )
}

function getTier(validationCount) {
  const v = validationCount || 0
  if (v >= 10) return { label: 'Certifié', color: '#fbbf24', bg: 'rgba(251,191,36,0.15)' }
  if (v >= 3) return { label: 'Vérifié', color: '#34d399', bg: 'rgba(52,211,153,0.15)' }
  if (v >= 1) return { label: 'Validé', color: '#60a5fa', bg: 'rgba(96,165,250,0.15)' }
  return { label: 'Nouveau', color: '#94a3b8', bg: 'rgba(148,163,184,0.15)' }
}

const TYPE_LABELS = {
  city_exit: 'Sortie de ville',
  station: 'Station',
  roadside: 'Bord de route',
  toll: 'Péage',
  roundabout: 'Rond-point',
  rest_area: 'Aire de repos',
  on_ramp: 'Bretelle',
  other: 'Autre',
}

// State
let allSpots = null
let allReports = null
let searchQuery = ''
let sourceFilter = 'all' // all | community | hitchwiki
let statusFilter = 'all' // all | reported | verified | certified
let sortBy = 'recent' // recent | validations | reports | country
let currentPage = 0
const PAGE_SIZE = 50
let expandedSpotId = null
let expandedReports = {}

export function renderSpotList() {
  return `
    <div class="page-title">Spots</div>

    <!-- KPI Cards -->
    <div class="kpi-grid" id="spot-kpis">
      <div class="kpi">
        <div class="kpi-value amber" id="kpi-total-spots"><span class="spinner"></span></div>
        <div class="kpi-label">Total spots</div>
      </div>
      <div class="kpi">
        <div class="kpi-value blue" id="kpi-community-spots"><span class="spinner"></span></div>
        <div class="kpi-label">Communauté</div>
      </div>
      <div class="kpi">
        <div class="kpi-value slate" id="kpi-hitchwiki-spots"><span class="spinner"></span></div>
        <div class="kpi-label">Hitchwiki</div>
      </div>
      <div class="kpi">
        <div class="kpi-value red" id="kpi-reported-spots"><span class="spinner"></span></div>
        <div class="kpi-label">Signalés</div>
      </div>
    </div>

    <!-- Search + Filters -->
    <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;margin-bottom:16px;">
      <input
        id="spot-search"
        type="text"
        placeholder="Rechercher par nom, ville, pays..."
        class="search-input"
        maxlength="100"
        style="margin-bottom:0;flex:1;min-width:200px;"
        value="${escapeHTML(searchQuery)}"
      />
    </div>

    <!-- Source filter tabs -->
    <div class="section-tabs" id="spot-source-tabs" style="margin-bottom:12px;">
      <button class="tab ${sourceFilter === 'all' ? 'active' : ''}" data-source-filter="all">Tous</button>
      <button class="tab ${sourceFilter === 'community' ? 'active' : ''}" data-source-filter="community">Communauté</button>
      <button class="tab ${sourceFilter === 'hitchwiki' ? 'active' : ''}" data-source-filter="hitchwiki">Hitchwiki</button>
    </div>

    <!-- Status filter + Sort -->
    <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;margin-bottom:20px;">
      <div class="section-tabs" style="margin-bottom:0;">
        <button class="tab ${statusFilter === 'all' ? 'active' : ''}" data-status-filter="all">Tous</button>
        <button class="tab ${statusFilter === 'reported' ? 'active' : ''}" data-status-filter="reported">Signalés</button>
        <button class="tab ${statusFilter === 'verified' ? 'active' : ''}" data-status-filter="verified">Vérifiés (3+)</button>
        <button class="tab ${statusFilter === 'certified' ? 'active' : ''}" data-status-filter="certified">Certifiés (10+)</button>
      </div>
      <select id="spot-sort" class="search-input" style="max-width:180px;margin-bottom:0;">
        <option value="recent" ${sortBy === 'recent' ? 'selected' : ''}>Plus récents</option>
        <option value="validations" ${sortBy === 'validations' ? 'selected' : ''}>Plus validés</option>
        <option value="reports" ${sortBy === 'reports' ? 'selected' : ''}>Plus signalés</option>
        <option value="country" ${sortBy === 'country' ? 'selected' : ''}>Par pays</option>
      </select>
    </div>

    <!-- Spot count + pagination top -->
    <div id="spot-count" style="font-size:13px;color:#94a3b8;margin-bottom:12px;"></div>

    <!-- Reported spots section -->
    <div id="reported-spots-section"></div>

    <!-- Spot cards -->
    <div class="card" style="padding:0;" id="spot-cards">
      <div style="text-align:center;padding:32px;"><span class="spinner"></span></div>
    </div>

    <!-- Pagination -->
    <div id="spot-pagination" style="display:flex;align-items:center;justify-content:center;gap:16px;margin-top:16px;"></div>
  `
}

function getFilteredSpots() {
  if (!allSpots) return []
  let filtered = [...allSpots]

  // Source filter
  if (sourceFilter === 'community') {
    filtered = filtered.filter((s) => s.source !== 'hitchwiki')
  } else if (sourceFilter === 'hitchwiki') {
    filtered = filtered.filter((s) => s.source === 'hitchwiki')
  }

  // Status filter
  if (statusFilter === 'reported') {
    filtered = filtered.filter((s) => getReportCount(s) > 0)
  } else if (statusFilter === 'verified') {
    filtered = filtered.filter((s) => (s.validationCount || 0) >= 3)
  } else if (statusFilter === 'certified') {
    filtered = filtered.filter((s) => (s.validationCount || 0) >= 10)
  }

  // Search
  if (searchQuery) {
    const q = searchQuery.toLowerCase()
    filtered = filtered.filter((s) => {
      const name = (s.locationName || s.title || s.departureCity || '').toLowerCase()
      const city = (s.city || s.departureCity || '').toLowerCase()
      const country = (s.country || s.countryCode || '').toLowerCase()
      return name.includes(q) || city.includes(q) || country.includes(q)
    })
  }

  // Sort
  filtered.sort((a, b) => {
    switch (sortBy) {
      case 'validations':
        return (b.validationCount || 0) - (a.validationCount || 0)
      case 'reports':
        return getReportCount(b) - getReportCount(a)
      case 'country':
        return (a.country || a.countryCode || '').localeCompare(b.country || b.countryCode || '')
      case 'recent':
      default: {
        const da = getTimestamp(a.createdAt)
        const db2 = getTimestamp(b.createdAt)
        return db2 - da
      }
    }
  })

  return filtered
}

function getReportCount(spot) {
  return spot.reportCount || (spot.reports ? spot.reports.length : 0)
}

function getTimestamp(dateVal) {
  if (!dateVal) return 0
  if (dateVal.toDate) return dateVal.toDate().getTime()
  if (dateVal.seconds) return dateVal.seconds * 1000
  return new Date(dateVal).getTime() || 0
}

function renderSpotCards() {
  const container = document.getElementById('spot-cards')
  const countEl = document.getElementById('spot-count')
  const paginationEl = document.getElementById('spot-pagination')
  const reportedSection = document.getElementById('reported-spots-section')
  if (!container) return

  const filtered = getFilteredSpots()
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))

  // Clamp current page
  if (currentPage >= totalPages) currentPage = totalPages - 1
  if (currentPage < 0) currentPage = 0

  const start = currentPage * PAGE_SIZE
  const pageSpots = filtered.slice(start, start + PAGE_SIZE)

  // Update count
  if (countEl) {
    countEl.textContent = `${filtered.length} spot${filtered.length > 1 ? 's' : ''} trouvé${filtered.length > 1 ? 's' : ''}`
  }

  // Render reported spots section (only on first page, no specific filter)
  if (reportedSection) {
    if (currentPage === 0 && statusFilter === 'all' && sourceFilter === 'all' && !searchQuery) {
      const reportedSpots = allSpots.filter((s) => getReportCount(s) > 0)
      if (reportedSpots.length > 0) {
        reportedSection.innerHTML = `
          <div style="background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);border-radius:12px;padding:16px;margin-bottom:20px;">
            <div style="font-size:14px;font-weight:600;color:#f87171;margin-bottom:12px;">
              ⚠️ ${reportedSpots.length} spot${reportedSpots.length > 1 ? 's' : ''} signalé${reportedSpots.length > 1 ? 's' : ''}
            </div>
            ${reportedSpots.map((s) => renderSpotCard(s, true)).join('')}
          </div>
        `
        bindSpotCardActions(reportedSection)
      } else {
        reportedSection.innerHTML = ''
      }
    } else {
      reportedSection.innerHTML = ''
    }
  }

  // Render main list
  if (pageSpots.length === 0) {
    container.innerHTML = '<div style="text-align:center;padding:32px;font-size:13px;color:#64748b;">Aucun spot trouvé</div>'
  } else {
    container.innerHTML = pageSpots.map((s) => renderSpotCard(s, false)).join('')
    bindSpotCardActions(container)
  }

  // Pagination
  if (paginationEl) {
    if (totalPages <= 1) {
      paginationEl.innerHTML = ''
    } else {
      paginationEl.innerHTML = `
        <button class="btn btn-detail" id="spot-prev" ${currentPage === 0 ? 'disabled' : ''}>← Précédent</button>
        <span style="font-size:13px;color:#94a3b8;">Page ${currentPage + 1} sur ${totalPages}</span>
        <button class="btn btn-detail" id="spot-next" ${currentPage >= totalPages - 1 ? 'disabled' : ''}>Suivant →</button>
      `
      document.getElementById('spot-prev')?.addEventListener('click', () => {
        if (currentPage > 0) {
          currentPage--
          renderSpotCards()
          scrollToSpotList()
        }
      })
      document.getElementById('spot-next')?.addEventListener('click', () => {
        if (currentPage < totalPages - 1) {
          currentPage++
          renderSpotCards()
          scrollToSpotList()
        }
      })
    }
  }
}

function scrollToSpotList() {
  document.getElementById('spot-cards')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function renderSpotCard(spot, isReported) {
  const id = escapeHTML(spot.id)
  const name = escapeHTML(spot.locationName || spot.title || spot.departureCity || 'Spot sans nom')
  const country = spot.country || spot.countryCode || ''
  const flag = countryToFlag(country)
  const countryDisplay = escapeHTML(country.toUpperCase())
  const type = escapeHTML(TYPE_LABELS[spot.type] || spot.type || '')
  const creator = escapeHTML(spot.creatorUsername || spot.creatorName || '')
  const creatorId = escapeHTML(spot.creatorId || '')
  const date = formatDate(spot.createdAt)
  const validations = spot.validationCount || 0
  const tier = getTier(validations)
  const reports = getReportCount(spot)
  const source = spot.source === 'hitchwiki' ? 'Hitchwiki' : 'Communauté'
  const isHidden = spot.hidden === true

  const reportBadge = reports > 0
    ? `<span style="background:rgba(239,68,68,0.2);color:#f87171;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600;">⚠️ ${reports} signalement${reports > 1 ? 's' : ''}</span>`
    : ''

  const hiddenBadge = isHidden
    ? `<span style="background:rgba(100,116,139,0.2);color:#94a3b8;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600;">Masqué</span>`
    : ''

  const sourceBadge = spot.source === 'hitchwiki'
    ? `<span style="background:rgba(148,163,184,0.15);color:#94a3b8;padding:2px 8px;border-radius:4px;font-size:11px;">Hitchwiki</span>`
    : `<span style="background:rgba(96,165,250,0.15);color:#60a5fa;padding:2px 8px;border-radius:4px;font-size:11px;">Communauté</span>`

  const expandedHtml = expandedSpotId === spot.id
    ? `<div class="spot-reports-detail" id="spot-reports-${id}" style="background:#1a2332;border-radius:8px;padding:12px;margin-top:10px;">
        <div style="text-align:center;"><span class="spinner"></span></div>
      </div>`
    : ''

  return `
    <div class="spot-card" style="padding:14px;border-bottom:1px solid rgba(255,255,255,0.04);">
      <div style="display:flex;align-items:flex-start;gap:12px;">
        <!-- Tier dot -->
        <div style="width:10px;height:10px;border-radius:50%;background:${tier.color};margin-top:6px;flex-shrink:0;" title="${escapeHTML(tier.label)}"></div>

        <!-- Spot info -->
        <div style="flex:1;min-width:0;">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
            <span style="font-size:14px;font-weight:600;color:#fff;">${name}</span>
            ${countryDisplay ? `<span style="font-size:13px;">${flag} ${countryDisplay}</span>` : ''}
            ${sourceBadge}
            ${reportBadge}
            ${hiddenBadge}
          </div>

          <div style="display:flex;flex-wrap:wrap;gap:12px;font-size:12px;color:#94a3b8;margin-top:6px;">
            ${type ? `<span>📌 ${type}</span>` : ''}
            ${creator ? `<span>👤 <a href="#" data-view-creator="${creatorId}" style="color:#fbbf24;text-decoration:none;">${creator}</a></span>` : ''}
            ${date ? `<span>📅 ${date}</span>` : ''}
            <span style="color:${tier.color};">✓ ${validations} validation${validations > 1 ? 's' : ''} (${escapeHTML(tier.label)})</span>
          </div>

          <!-- Actions -->
          <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;">
            <button class="btn btn-detail" data-action="view-on-site" data-lat="${spot.lat || ''}" data-lng="${spot.lng || ''}" data-spot-id="${id}">👁 Voir sur le site</button>
            <button class="btn btn-reject" data-action="delete-spot" data-spot-id="${id}" data-spot-name="${name}">🗑 Supprimer</button>
            ${reports > 0 ? `<button class="btn btn-detail" data-action="toggle-reports" data-spot-id="${id}" style="border-color:rgba(239,68,68,0.3);color:#f87171;">⚠️ Voir les signalements</button>` : ''}
            ${reports > 0 && !isHidden ? `<button class="btn" data-action="hide-spot" data-spot-id="${id}" data-spot-name="${name}" style="background:rgba(245,158,11,0.2);color:#fbbf24;">🔒 Masquer</button>` : ''}
          </div>
        </div>
      </div>
      ${expandedHtml}
    </div>
  `
}

function bindSpotCardActions(container) {
  // View on site
  container.querySelectorAll('[data-action="view-on-site"]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation()
      const spotId = btn.dataset.spotId
      const lat = btn.dataset.lat
      const lng = btn.dataset.lng
      if (lat && lng) {
        window.open(`https://spothitch.com/#spot=${spotId}`, '_blank')
      } else {
        window.open(`https://spothitch.com/#spot=${spotId}`, '_blank')
      }
    })
  })

  // Delete spot
  container.querySelectorAll('[data-action="delete-spot"]').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation()
      const spotId = btn.dataset.spotId
      const spotName = btn.dataset.spotName
      if (!confirm(`Supprimer le spot "${spotName}" ?\n\nCette action est irréversible. Le spot, ses validations, avis et commentaires seront supprimés.`)) return
      btn.disabled = true
      btn.textContent = '...'
      try {
        await deleteSpot(spotId)
        // Remove from local list
        allSpots = allSpots.filter((s) => s.id !== spotId)
        updateKPIs()
        renderSpotCards()
        window.__showToast?.('Spot supprimé', 'success')
      } catch (err) {
        console.error('Delete spot failed:', err)
        btn.disabled = false
        btn.textContent = '🗑 Supprimer'
        window.__showToast?.('Erreur : ' + (err.message || 'échec'), 'error')
      }
    })
  })

  // Toggle reports
  container.querySelectorAll('[data-action="toggle-reports"]').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation()
      const spotId = btn.dataset.spotId
      if (expandedSpotId === spotId) {
        expandedSpotId = null
        renderSpotCards()
        return
      }
      expandedSpotId = spotId
      renderSpotCards()
      // Load reports
      await loadSpotReportsInline(spotId)
    })
  })

  // Hide spot
  container.querySelectorAll('[data-action="hide-spot"]').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation()
      const spotId = btn.dataset.spotId
      const spotName = btn.dataset.spotName
      if (!confirm(`Masquer le spot "${spotName}" ?\n\nLe spot ne sera plus visible sur la carte. Les données sont conservées.`)) return
      btn.disabled = true
      btn.textContent = '...'
      try {
        await hideSpot(spotId)
        // Update local state
        const spot = allSpots.find((s) => s.id === spotId)
        if (spot) spot.hidden = true
        renderSpotCards()
        window.__showToast?.('Spot masqué', 'success')
      } catch (err) {
        console.error('Hide spot failed:', err)
        btn.disabled = false
        btn.textContent = '🔒 Masquer'
        window.__showToast?.('Erreur : ' + (err.message || 'échec'), 'error')
      }
    })
  })

  // View creator profile
  container.querySelectorAll('[data-view-creator]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()
      window.__navigate?.('users')
    })
  })

  // Report actions (reject report, dismiss)
  container.querySelectorAll('[data-action="reject-spot-report"]').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation()
      const reportId = btn.dataset.reportId
      if (!confirm('Rejeter ce signalement ?\n\nLe signalement sera ignoré et le spot reste inchangé.')) return
      btn.disabled = true
      btn.textContent = '...'
      try {
        await updateDocument('reports', reportId, {
          status: 'dismissed',
          moderatedAt: new Date().toISOString(),
        })
        window.__showToast?.('Signalement rejeté', 'success')
        // Reload reports inline
        if (expandedSpotId) await loadSpotReportsInline(expandedSpotId)
      } catch (err) {
        console.error('Reject report failed:', err)
        btn.disabled = false
        btn.textContent = '✕ Rejeter'
        window.__showToast?.('Erreur', 'error')
      }
    })
  })
}

async function loadSpotReportsInline(spotId) {
  const el = document.getElementById(`spot-reports-${spotId}`)
  if (!el) return

  // Check cache
  if (expandedReports[spotId]) {
    renderReportsInline(el, expandedReports[spotId])
    return
  }

  try {
    const reports = await getSpotReports(spotId)
    expandedReports[spotId] = reports
    renderReportsInline(el, reports)
  } catch (err) {
    console.error('Failed to load spot reports:', err)
    el.innerHTML = '<div style="font-size:12px;color:#f87171;padding:8px;">Erreur de chargement des signalements</div>'
  }
}

function renderReportsInline(el, reports) {
  if (!reports || reports.length === 0) {
    el.innerHTML = '<div style="font-size:12px;color:#64748b;padding:8px;">Aucun signalement trouvé</div>'
    return
  }

  const REASON_LABELS = {
    dangerous: 'Dangereux',
    misplaced: 'Mal placé',
    inaccurate: 'Inexact',
    inappropriate: 'Inapproprié',
    duplicate: 'Doublon',
    closed: 'Fermé',
    spam: 'Spam',
    other: 'Autre',
  }

  el.innerHTML = `
    <div style="font-size:12px;font-weight:600;color:#f87171;margin-bottom:8px;">Signalements (${reports.length})</div>
    ${reports
      .map((r) => {
        const reason = escapeHTML(REASON_LABELS[r.reason] || r.reason || 'Autre')
        const details = escapeHTML(r.details?.description || r.description || '')
        const reporter = escapeHTML(r.reporter?.username || r.reporterName || 'Anonyme')
        const date = formatDate(r.createdAt || r.timestamp)
        const status = r.status || 'pending'
        const statusLabel = status === 'pending'
          ? '<span style="color:#fbbf24;">En attente</span>'
          : status === 'confirmed'
          ? '<span style="color:#f87171;">Confirmé</span>'
          : '<span style="color:#94a3b8;">Rejeté</span>'

        // Misplaced report: show suggested coordinates + relocate button
        const isMisplaced = r.reason === 'misplaced' && (r.suggestedLat || r.details?.suggestedLat)
        const sugLat = r.suggestedLat || r.details?.suggestedLat
        const sugLng = r.suggestedLng || r.details?.suggestedLng
        const spot = allSpots?.find((s) => s.id === expandedSpotId)
        const currentLat = spot?.lat || spot?.coordinates?.lat || 0
        const currentLng = spot?.lng || spot?.coordinates?.lng || 0

        const misplacedHtml = isMisplaced && sugLat && sugLng
          ? `<div style="background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.2);border-radius:8px;padding:10px;margin-top:8px;">
              <div style="font-size:12px;font-weight:600;color:#60a5fa;margin-bottom:6px;">📍 Déplacement suggéré</div>
              <div style="display:flex;gap:16px;font-size:11px;color:#94a3b8;">
                <div>
                  <div style="color:#f87171;font-weight:600;">Position actuelle</div>
                  <div>${Number(currentLat).toFixed(5)}, ${Number(currentLng).toFixed(5)}</div>
                </div>
                <div style="display:flex;align-items:center;color:#64748b;">→</div>
                <div>
                  <div style="color:#34d399;font-weight:600;">Position suggérée</div>
                  <div>${Number(sugLat).toFixed(5)}, ${Number(sugLng).toFixed(5)}</div>
                </div>
              </div>
              <div style="display:flex;gap:8px;margin-top:8px;">
                <a href="https://www.google.com/maps?q=${sugLat},${sugLng}" target="_blank"
                  style="font-size:11px;color:#60a5fa;text-decoration:none;">🗺 Voir sur Google Maps</a>
              </div>
              ${status === 'pending' ? `
                <button class="btn" data-action="relocate-spot" data-spot-id="${escapeHTML(expandedSpotId)}" data-report-id="${escapeHTML(r.id)}"
                  data-new-lat="${sugLat}" data-new-lng="${sugLng}"
                  style="margin-top:8px;background:rgba(52,211,153,0.2);color:#34d399;font-size:11px;padding:4px 12px;">
                  ✓ Déplacer le spot ici
                </button>
              ` : ''}
            </div>`
          : ''

        return `
          <div style="padding:8px 0;border-top:1px solid rgba(255,255,255,0.04);">
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
              <span class="tag tag-severity-medium">${reason}</span>
              ${statusLabel}
            </div>
            ${details ? `<div style="font-size:12px;color:#cbd5e1;margin-top:4px;">${details}</div>` : ''}
            ${misplacedHtml}
            <div style="font-size:11px;color:#64748b;margin-top:4px;">Signalé par ${reporter} · ${date}</div>
            ${
              status === 'pending'
                ? `<div style="margin-top:6px;">
                    <button class="btn btn-reject" data-action="reject-spot-report" data-report-id="${escapeHTML(r.id)}" style="font-size:11px;padding:4px 10px;">✕ Rejeter</button>
                  </div>`
                : ''
            }
          </div>
        `
      })
      .join('')}
  `

  // Relocate spot buttons (for misplaced reports)
  el.querySelectorAll('[data-action="relocate-spot"]').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation()
      const spotId = btn.dataset.spotId
      const reportId = btn.dataset.reportId
      const newLat = parseFloat(btn.dataset.newLat)
      const newLng = parseFloat(btn.dataset.newLng)
      if (!confirm(`Déplacer le spot vers ${newLat.toFixed(5)}, ${newLng.toFixed(5)} ?\n\nLe spot sera immédiatement relocalisé sur la carte.`)) return
      btn.disabled = true
      btn.textContent = 'Déplacement...'
      try {
        await relocateSpot(spotId, newLat, newLng)
        // Update local state
        const spot = allSpots?.find((s) => s.id === spotId)
        if (spot) {
          spot.lat = newLat
          spot.lng = newLng
        }
        // Clear reports cache and reload
        delete expandedReports[spotId]
        window.__showToast?.('Spot déplacé avec succès', 'success')
        if (expandedSpotId) await loadSpotReportsInline(expandedSpotId)
      } catch (err) {
        console.error('Relocate spot failed:', err)
        btn.disabled = false
        btn.textContent = '✓ Déplacer le spot ici'
        window.__showToast?.('Erreur : ' + (err.message || 'échec'), 'error')
      }
    })
  })

  // Rebind reject buttons inside the reports detail
  el.querySelectorAll('[data-action="reject-spot-report"]').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation()
      const reportId = btn.dataset.reportId
      if (!confirm('Rejeter ce signalement ?')) return
      btn.disabled = true
      btn.textContent = '...'
      try {
        await updateDocument('reports', reportId, {
          status: 'dismissed',
          moderatedAt: new Date().toISOString(),
        })
        // Update cache
        delete expandedReports[expandedSpotId]
        window.__showToast?.('Signalement rejeté', 'success')
        if (expandedSpotId) await loadSpotReportsInline(expandedSpotId)
      } catch (err) {
        console.error('Reject report failed:', err)
        btn.disabled = false
        btn.textContent = '✕ Rejeter'
        window.__showToast?.('Erreur', 'error')
      }
    })
  })
}

function updateKPIs() {
  if (!allSpots) return
  let total = 0
  let community = 0
  let hitchwiki = 0
  let reported = 0
  for (const s of allSpots) {
    total++
    if (s.source === 'hitchwiki') {
      hitchwiki++
    } else {
      community++
    }
    if (getReportCount(s) > 0) {
      reported++
    }
  }
  const el = (id, val) => {
    const e = document.getElementById(id)
    if (e) e.textContent = val.toLocaleString('fr-FR')
  }
  el('kpi-total-spots', total)
  el('kpi-community-spots', community)
  el('kpi-hitchwiki-spots', hitchwiki)
  el('kpi-reported-spots', reported)
}

export async function bindSpotListEvents() {
  // Search input
  const searchInput = document.getElementById('spot-search')
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim()
      currentPage = 0
      expandedSpotId = null
      renderSpotCards()
    })
  }

  // Source filter tabs
  document.querySelectorAll('[data-source-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      sourceFilter = btn.dataset.sourceFilter
      currentPage = 0
      expandedSpotId = null
      document.querySelectorAll('[data-source-filter]').forEach((b) => {
        b.classList.toggle('active', b.dataset.sourceFilter === sourceFilter)
      })
      renderSpotCards()
    })
  })

  // Status filter tabs
  document.querySelectorAll('[data-status-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      statusFilter = btn.dataset.statusFilter
      currentPage = 0
      expandedSpotId = null
      document.querySelectorAll('[data-status-filter]').forEach((b) => {
        b.classList.toggle('active', b.dataset.statusFilter === statusFilter)
      })
      renderSpotCards()
    })
  })

  // Sort dropdown
  const sortSelect = document.getElementById('spot-sort')
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      sortBy = e.target.value
      currentPage = 0
      renderSpotCards()
    })
  }

  // Load all spots
  try {
    allSpots = await loadAllDocs('spots')
    updateKPIs()
    renderSpotCards()
  } catch (err) {
    console.error('Failed to load spots:', err)
    const container = document.getElementById('spot-cards')
    if (container) {
      container.innerHTML = '<div style="text-align:center;padding:32px;font-size:13px;color:#f87171;">Erreur de chargement</div>'
    }
  }
}

export function resetSpotListCache() {
  allSpots = null
  allReports = null
  searchQuery = ''
  sourceFilter = 'all'
  statusFilter = 'all'
  sortBy = 'recent'
  currentPage = 0
  expandedSpotId = null
  expandedReports = {}
}
