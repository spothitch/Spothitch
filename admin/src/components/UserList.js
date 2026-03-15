/**
 * User List Component — V1 Clean design
 * Clickable cards with expandable details
 * Shows ONLY real users (filters out ci-*@spothitch.com test accounts)
 */

import { loadAllDocs, getDocsByField } from '../services/firebase.js'
import { isRealUser } from '../services/stats.js'
import { isAdmin as checkAdmin } from '../services/auth.js'

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
    return ''
  }
}

const USER_EMOJIS = ['🤙', '🎒', '✌️', '🌿', '🌸', '🧭', '🌍', '🚐', '🦊', '🐺']

let allUsers = null
let searchQuery = ''
let expandedUserId = null
let userDetailsCache = {}

export function renderUserList() {
  return `
    <div class="page-title">Utilisateurs</div>

    <!-- Search -->
    <input
      id="user-search"
      type="text"
      placeholder="Rechercher par nom ou email..."
      class="search-input"
      value="${escapeHTML(searchQuery)}"
    />

    <!-- User count -->
    <div id="user-count" style="font-size:13px;color:#94a3b8;margin-bottom:16px;"></div>

    <!-- User cards -->
    <div class="card" style="padding:0;" id="user-cards">
      <div style="text-align:center;padding:32px;"><span class="spinner"></span></div>
    </div>
  `
}

function renderUserCards(users) {
  const container = document.getElementById('user-cards')
  const countEl = document.getElementById('user-count')
  if (!container) return

  if (!users || users.length === 0) {
    container.innerHTML = '<div style="text-align:center;padding:32px;font-size:13px;color:#64748b;">Aucun utilisateur</div>'
    if (countEl) countEl.textContent = '0 utilisateur'
    return
  }

  if (countEl) countEl.textContent = `${users.length} utilisateur${users.length > 1 ? 's' : ''} réel${users.length > 1 ? 's' : ''}`

  container.innerHTML = users
    .map((u, index) => {
      const uid = escapeHTML(u.id)
      const username = escapeHTML(u.username || u.displayName || '')
      const email = escapeHTML(u.email || '')
      const points = u.points || u.totalPoints || 0
      const spotsCount = u.spotsCreated || u.spotCount || 0
      const lastActive = timeAgo(u.lastLogin)
      const emoji = USER_EMOJIS[index % USER_EMOJIS.length]
      const isExpanded = expandedUserId === u.id
      const avatarUrl = u.photoURL || u.avatarUrl || ''

      const avatarHtml = avatarUrl
        ? `<div class="user-avatar"><img src="${escapeHTML(avatarUrl)}" alt="" onerror="this.parentElement.textContent='${emoji}'"></div>`
        : `<div class="user-avatar">${emoji}</div>`

      const detailHtml = isExpanded
        ? `<div class="user-detail" id="user-detail-${uid}"><div style="text-align:center;padding:16px;"><span class="spinner"></span></div></div>`
        : ''

      return `
        <div class="user-card" data-user-toggle="${uid}">
          ${avatarHtml}
          <div class="user-info">
            <div class="user-name">${username || '<span style="color:#64748b;">Sans nom</span>'}</div>
            <div class="user-email">${email}</div>
          </div>
          <div class="user-stats">
            <span>${spotsCount} spot${spotsCount > 1 ? 's' : ''}</span>
            <span>${points.toLocaleString('fr-FR')} pts</span>
            <span>${lastActive ? 'Actif ' + lastActive : ''}</span>
          </div>
        </div>
        ${detailHtml}`
    })
    .join('')

  // Bind click handlers
  container.querySelectorAll('[data-user-toggle]').forEach((el) => {
    el.addEventListener('click', () => {
      const uid = el.dataset.userToggle
      if (expandedUserId === uid) {
        expandedUserId = null
      } else {
        expandedUserId = uid
      }
      renderUserCards(filterUsers())
      if (expandedUserId) {
        loadUserDetails(expandedUserId)
      }
    })
  })
}

async function loadUserDetails(uid) {
  const detailEl = document.getElementById(`user-detail-${uid}`)
  if (!detailEl) return

  if (userDetailsCache[uid]) {
    renderUserDetail(detailEl, uid, userDetailsCache[uid])
    return
  }

  try {
    const [userSpots, userTips] = await Promise.all([
      getDocsByField('spots', 'creatorId', uid).catch(() => []),
      getDocsByField('guideTips', 'userId', uid).catch(() => []),
    ])

    userDetailsCache[uid] = { spots: userSpots, tips: userTips }
    renderUserDetail(detailEl, uid, userDetailsCache[uid])
  } catch (err) {
    console.error('Failed to load user details:', err)
    detailEl.innerHTML = '<div style="padding:12px;font-size:13px;color:#f87171;">Erreur de chargement</div>'
  }
}

function renderUserDetail(el, uid, data) {
  const user = allUsers.find((u) => u.id === uid)
  if (!user) return

  const spotsCount = data.spots.length
  const tipsCount = data.tips.length
  const reviewCount = user.reviewsGiven || 0
  const joined = formatDate(user.createdAt || user.joinedAt)

  // Check if this is the admin's own account
  const isOwnAccount = checkAdmin(user)

  const spotsHtml = data.spots.length > 0
    ? data.spots.slice(0, 10).map((s) => {
        const title = escapeHTML(s.title || s.city || `${(s.lat || 0).toFixed(2)}, ${(s.lng || 0).toFixed(2)}`)
        const country = escapeHTML(s.country || s.countryCode || '')
        return `${title}${country ? ' (' + country + ')' : ''}`
      }).join(' · ')
    : 'Aucun spot'

  const banButtonHtml = isOwnAccount
    ? ''
    : `<div style="margin-top:10px;display:flex;gap:8px;">
        <button class="btn btn-reject" data-ban-user="${escapeHTML(uid)}">🚫 Bannir</button>
      </div>`

  el.innerHTML = `
    <div class="user-detail-grid">
      <div class="user-detail-item">
        <div class="user-detail-value">${spotsCount}</div>
        <div class="user-detail-label">Spots créés</div>
      </div>
      <div class="user-detail-item">
        <div class="user-detail-value">${reviewCount}</div>
        <div class="user-detail-label">Avis donnés</div>
      </div>
      <div class="user-detail-item">
        <div class="user-detail-value">${tipsCount}</div>
        <div class="user-detail-label">Contributions guides</div>
      </div>
    </div>
    <div style="font-size:12px;color:#64748b;">Inscrit le ${joined || 'date inconnue'}</div>
    <div style="margin-top:10px;font-size:12px;">
      <strong class="amber">Ses spots :</strong>
      <div style="margin-top:6px;color:#cbd5e1;">${spotsHtml}</div>
    </div>
    ${banButtonHtml}
  `

  // Bind ban button
  el.querySelector('[data-ban-user]')?.addEventListener('click', (e) => {
    e.stopPropagation()
    if (!confirm('Bannir cet utilisateur ?\n\nIl ne pourra plus se connecter ni créer de contenu. Ses spots existants restent visibles sur la carte. Tu peux annuler le ban plus tard.')) return
    window.__showToast?.('Fonction de bannissement pas encore implémentée', 'info')
  })
}

function filterUsers() {
  if (!allUsers) return []
  if (!searchQuery) return allUsers

  const q = searchQuery.toLowerCase()
  return allUsers.filter((u) => {
    const name = (u.username || u.displayName || '').toLowerCase()
    const email = (u.email || '').toLowerCase()
    return name.includes(q) || email.includes(q)
  })
}

export async function bindUserListEvents() {
  // Search input
  const input = document.getElementById('user-search')
  if (input) {
    input.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim()
      expandedUserId = null
      renderUserCards(filterUsers())
    })
  }

  // Load users (filter out test accounts)
  try {
    const rawUsers = await loadAllDocs('users')
    allUsers = rawUsers
      .filter((u) => isRealUser(u))
      .sort((a, b) => {
        const da = a.lastLogin?.toDate ? a.lastLogin.toDate().getTime() : new Date(a.lastLogin || 0).getTime()
        const db2 = b.lastLogin?.toDate ? b.lastLogin.toDate().getTime() : new Date(b.lastLogin || 0).getTime()
        return db2 - da
      })
    renderUserCards(filterUsers())
  } catch (err) {
    console.error('Failed to load users:', err)
    const container = document.getElementById('user-cards')
    if (container) {
      container.innerHTML = '<div style="text-align:center;padding:32px;font-size:13px;color:#f87171;">Erreur de chargement</div>'
    }
  }
}

export function resetUserListCache() {
  allUsers = null
  searchQuery = ''
  expandedUserId = null
  userDetailsCache = {}
}
