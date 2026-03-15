/**
 * Dashboard Component — V1 Clean design
 * KPIs (4 cards), Sentry errors + activity (two-col), cleanup bar
 */

import { loadDashboardStats, loadRecentActivity, isTestUser, isTestSpot } from '../services/stats.js'
import { loadSentryIssues } from '../services/sentry.js'
import { loadAllSpots, loadAllUsers } from '../services/stats.js'
import { deleteDocument } from '../services/firebase.js'

function escapeHTML(str) {
  const div = document.createElement('div')
  div.textContent = str || ''
  return div.innerHTML
}

function timeAgo(dateStr) {
  if (!dateStr) return ''
  try {
    const d = dateStr.toDate ? dateStr.toDate() : new Date(dateStr)
    const now = Date.now()
    const diff = now - d.getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'maintenant'
    if (mins < 60) return `il y a ${mins}min`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `il y a ${hours}h`
    const days = Math.floor(hours / 24)
    if (days === 1) return 'hier'
    return `il y a ${days}j`
  } catch {
    return String(dateStr).slice(0, 16)
  }
}

export function renderDashboard() {
  return `
    <div class="page-title">Tableau de bord</div>

    <!-- KPI Cards -->
    <div class="kpi-grid" id="kpi-cards">
      <div class="kpi">
        <div class="kpi-value green" id="kpi-users"><span class="spinner"></span></div>
        <div class="kpi-label">Utilisateurs réels</div>
      </div>
      <div class="kpi">
        <div class="kpi-value slate" id="kpi-hitchwiki"><span class="spinner"></span></div>
        <div class="kpi-label">Spots Hitchwiki</div>
        <div class="kpi-sub" id="kpi-hitchwiki-countries"></div>
      </div>
      <div class="kpi">
        <div class="kpi-value blue" id="kpi-spots"><span class="spinner"></span></div>
        <div class="kpi-label">Spots communautaires</div>
      </div>
      <div class="kpi">
        <div class="kpi-value amber" id="kpi-pending"><span class="spinner"></span></div>
        <div class="kpi-label">En attente de modération</div>
      </div>
    </div>

    <!-- Two-column: Sentry + Activity -->
    <div class="two-col">
      <div class="card">
        <div class="card-title red">Erreurs Sentry</div>
        <div id="sentry-list">
          <div style="text-align:center;padding:16px;"><span class="spinner"></span></div>
        </div>
      </div>
      <div class="card">
        <div class="card-title purple">Dernière activité</div>
        <div id="activity-list">
          <div style="text-align:center;padding:16px;"><span class="spinner"></span></div>
        </div>
      </div>
    </div>

    <!-- Cleanup bar -->
    <div class="cleanup-bar" id="cleanup-section">
      <span class="cleanup-text" id="cleanup-summary"><span class="spinner"></span></span>
      <button class="btn btn-reject" id="cleanup-btn" disabled>Nettoyer</button>
    </div>
  `
}

export async function bindDashboardEvents() {
  // Load KPIs
  loadDashboardStats()
    .then((stats) => {
      document.getElementById('kpi-users').textContent = stats.userCount.toLocaleString('fr-FR')
      document.getElementById('kpi-hitchwiki').textContent = stats.spotCountHitchwiki.toLocaleString('fr-FR')
      const countriesEl = document.getElementById('kpi-hitchwiki-countries')
      if (countriesEl) countriesEl.textContent = stats.hitchwikiCountries + ' pays'
      document.getElementById('kpi-spots').textContent = stats.spotCountFirebase.toLocaleString('fr-FR')
      document.getElementById('kpi-pending').textContent = stats.pendingTipsCount.toLocaleString('fr-FR')

      // Store pending count for nav badge update
      if (window.__updatePendingBadge) {
        window.__updatePendingBadge(stats.pendingTipsCount)
      }

      // Update cleanup summary
      const summaryEl = document.getElementById('cleanup-summary')
      const cleanBtn = document.getElementById('cleanup-btn')
      if (summaryEl) {
        summaryEl.textContent = `🧹 ${stats.testUserCount} compte${stats.testUserCount > 1 ? 's' : ''} de test · ${stats.testSpotCount} spot${stats.testSpotCount > 1 ? 's' : ''} de test`
      }
      if (cleanBtn) {
        cleanBtn.disabled = stats.testUserCount === 0 && stats.testSpotCount === 0
      }
    })
    .catch((err) => {
      console.error('Failed to load stats:', err)
      document.getElementById('kpi-users').textContent = '?'
      document.getElementById('kpi-hitchwiki').textContent = '?'
      document.getElementById('kpi-spots').textContent = '?'
      document.getElementById('kpi-pending').textContent = '?'
      const summaryEl = document.getElementById('cleanup-summary')
      if (summaryEl) summaryEl.textContent = 'Erreur de chargement'
    })

  // Load Sentry
  loadAndRenderSentry()

  // Load recent activity
  loadRecentActivity()
    .then(({ recentUsers, recentSpots }) => {
      renderActivity(recentUsers, recentSpots)
    })
    .catch((err) => {
      console.error('Failed to load activity:', err)
      const el = document.getElementById('activity-list')
      if (el) el.innerHTML = '<div style="text-align:center;padding:8px;font-size:12px;color:#64748b;">Erreur de chargement</div>'
    })

  // Cleanup button
  const cleanBtn = document.getElementById('cleanup-btn')
  if (cleanBtn) cleanBtn.addEventListener('click', runCleanup)
}

async function runCleanup() {
  const btn = document.getElementById('cleanup-btn')
  if (!btn) return

  try {
    const [allUsers, allSpots] = await Promise.all([loadAllUsers(), loadAllSpots()])
    const testUsers = allUsers.filter((u) => isTestUser(u))
    const testSpots = allSpots.filter((s) => isTestSpot(s))
    const total = testUsers.length + testSpots.length

    if (total === 0) {
      window.__showToast?.('Rien a nettoyer, tout est propre', 'info')
      return
    }

    if (!confirm(`Supprimer ${testUsers.length} compte(s) de test et ${testSpots.length} spot(s) de test ?`)) return

    btn.disabled = true
    btn.textContent = '...'

    let deleted = 0
    for (const u of testUsers) {
      try {
        await deleteDocument('users', u.id)
        deleted++
      } catch (err) {
        console.error('Failed to delete test user:', err)
      }
    }
    for (const s of testSpots) {
      try {
        await deleteDocument('spots', s.id)
        deleted++
      } catch (err) {
        console.error('Failed to delete test spot:', err)
      }
    }

    btn.disabled = false
    btn.textContent = 'Nettoyer'

    const summaryEl = document.getElementById('cleanup-summary')
    if (summaryEl) summaryEl.textContent = '🧹 0 compte de test · 0 spot de test'
    btn.disabled = true

    window.__showToast?.(`${deleted} element(s) de test supprime(s)`, 'success')
  } catch (err) {
    console.error('Cleanup error:', err)
    btn.disabled = false
    btn.textContent = 'Nettoyer'
    window.__showToast?.('Erreur lors du nettoyage', 'error')
  }
}

async function loadAndRenderSentry() {
  const el = document.getElementById('sentry-list')
  if (!el) return
  el.innerHTML = '<div style="text-align:center;padding:16px;"><span class="spinner"></span></div>'

  try {
    const issues = await loadSentryIssues()
    if (issues.length === 0) {
      el.innerHTML = '<div style="text-align:center;padding:8px;font-size:12px;color:#64748b;">Aucune erreur critique</div>'
      return
    }

    el.innerHTML = issues
      .slice(0, 10)
      .map((issue) => {
        const title = escapeHTML(issue.title || 'Sans titre')
        const date = timeAgo(issue.created_at)
        const linkHtml = issue.html_url
          ? `<a href="${escapeHTML(issue.html_url)}" target="_blank" rel="noopener" class="sentry-link">Voir</a>`
          : ''
        return `
        <div class="sentry-item">
          <span class="sentry-title">${title}</span>
          <span class="sentry-date">${date}</span>
          ${linkHtml}
        </div>`
      })
      .join('')
  } catch (err) {
    console.error('Sentry load error:', err)
    el.innerHTML = '<div style="text-align:center;padding:8px;font-size:12px;color:#f87171;">Erreur de chargement Sentry</div>'
  }
}

function renderActivity(recentUsers, recentSpots) {
  const el = document.getElementById('activity-list')
  if (!el) return

  // Merge users and spots into a single activity list, sorted by time
  const activities = []

  if (recentUsers) {
    recentUsers.slice(0, 5).forEach((u) => {
      const name = escapeHTML(u.username || u.displayName || u.email || 'Anonyme')
      const date = u.lastLogin || u.createdAt
      activities.push({
        text: `${name} s'est connecté`,
        date,
        time: timeAgo(date),
      })
    })
  }

  if (recentSpots) {
    recentSpots.slice(0, 5).forEach((s) => {
      const title = escapeHTML(s.title || s.city || 'Spot')
      const country = s.country || s.countryCode || ''
      const date = s.createdAt
      activities.push({
        text: `Nouveau spot : ${title}${country ? ' (' + escapeHTML(country) + ')' : ''}`,
        date,
        time: timeAgo(date),
      })
    })
  }

  // Sort by date descending
  activities.sort((a, b) => {
    const da = a.date?.toDate ? a.date.toDate().getTime() : new Date(a.date || 0).getTime()
    const db = b.date?.toDate ? b.date.toDate().getTime() : new Date(b.date || 0).getTime()
    return db - da
  })

  if (activities.length === 0) {
    el.innerHTML = '<div style="text-align:center;padding:8px;font-size:12px;color:#64748b;">Aucune activité récente</div>'
    return
  }

  el.innerHTML = activities
    .slice(0, 8)
    .map(
      (a) => `
      <div class="activity-item">
        <span>${a.text}</span>
        <span class="slate">${a.time}</span>
      </div>`
    )
    .join('')
}
