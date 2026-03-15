/**
 * Cleanup Component — Delete test users and spots from Firestore
 */

import { loadAllSpots, loadAllUsers } from '../services/stats.js'
import { deleteDocument } from '../services/firebase.js'

const ADMIN_EMAIL = 'antoine.v.ville@gmail.com'

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

function truncate(str, maxLen = 60) {
  if (!str) return ''
  return str.length > maxLen ? str.slice(0, maxLen) + '...' : str
}

let cachedUsers = null
let cachedSpots = null

export function renderCleanup() {
  return `
    <div class="p-6 max-w-6xl mx-auto">
      <h1 class="font-display text-2xl font-bold mb-6 text-primary-400">Nettoyage des donnees</h1>

      <!-- Counts -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div class="card p-5 text-center">
          <div class="text-3xl font-bold text-purple-400" id="cleanup-user-count"><span class="spinner"></span></div>
          <div class="text-sm text-slate-400 mt-1">Utilisateurs</div>
        </div>
        <div class="card p-5 text-center">
          <div class="text-3xl font-bold text-emerald-400" id="cleanup-spot-count"><span class="spinner"></span></div>
          <div class="text-sm text-slate-400 mt-1">Spots</div>
        </div>
      </div>

      <!-- Users Section -->
      <div class="card p-5 mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-display text-lg font-bold text-purple-400">Utilisateurs</h2>
          <button id="delete-all-users-btn" class="btn-danger text-xs py-1.5 px-4">Tout supprimer sauf admin</button>
        </div>
        <div id="cleanup-users-list">
          <div class="text-center py-4"><span class="spinner"></span></div>
        </div>
      </div>

      <!-- Spots Section -->
      <div class="card p-5">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-display text-lg font-bold text-emerald-400">Spots</h2>
          <button id="delete-all-spots-btn" class="btn-danger text-xs py-1.5 px-4">Tout supprimer sauf admin</button>
        </div>
        <div id="cleanup-spots-list">
          <div class="text-center py-4"><span class="spinner"></span></div>
        </div>
      </div>
    </div>
  `
}

function isAdminUser(user) {
  return (user.email || '').toLowerCase() === ADMIN_EMAIL
}

function isAdminSpot(spot) {
  return (spot.creatorEmail || '').toLowerCase() === ADMIN_EMAIL ||
    (spot.userEmail || '').toLowerCase() === ADMIN_EMAIL
}

function renderUsersList(users) {
  const listEl = document.getElementById('cleanup-users-list')
  const countEl = document.getElementById('cleanup-user-count')
  if (!listEl) return

  if (countEl) countEl.textContent = users.length

  if (users.length === 0) {
    listEl.innerHTML = '<p class="text-slate-500 text-sm text-center py-4">Aucun utilisateur</p>'
    return
  }

  listEl.innerHTML = users
    .map((u) => {
      const email = escapeHTML(u.email || '')
      const name = escapeHTML(u.username || u.displayName || '')
      const date = formatDate(u.createdAt || u.joinedAt)
      const admin = isAdminUser(u)
      const borderClass = admin ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/5'
      const adminBadge = admin ? '<span class="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full ml-2">Admin</span>' : ''

      return `
      <div class="flex items-center justify-between py-3 border-b ${borderClass} last:border-0">
        <div class="flex-1 min-w-0">
          <div class="flex items-center">
            <span class="text-sm text-white font-medium">${name || '<span class="text-slate-500">Sans nom</span>'}</span>
            ${adminBadge}
          </div>
          <p class="text-xs text-slate-400 mt-0.5">${email}</p>
          ${date ? `<p class="text-xs text-slate-500 mt-0.5">${date}</p>` : ''}
        </div>
        ${admin ? '<span class="text-xs text-emerald-400 whitespace-nowrap">Protege</span>' : `<button class="btn-danger text-xs py-1 px-3 whitespace-nowrap" data-delete-user="${escapeHTML(u.id)}">Supprimer</button>`}
      </div>`
    })
    .join('')
}

function renderSpotsList(spots) {
  const listEl = document.getElementById('cleanup-spots-list')
  const countEl = document.getElementById('cleanup-spot-count')
  if (!listEl) return

  if (countEl) countEl.textContent = spots.length

  if (spots.length === 0) {
    listEl.innerHTML = '<p class="text-slate-500 text-sm text-center py-4">Aucun spot</p>'
    return
  }

  listEl.innerHTML = spots
    .map((s) => {
      const title = escapeHTML(s.title || s.from || s.city || `${(s.lat || 0).toFixed(2)}, ${(s.lng || 0).toFixed(2)}`)
      const creator = escapeHTML(s.creatorName || s.creatorEmail || s.userEmail || '')
      const desc = escapeHTML(truncate(s.description || s.desc || ''))
      const date = formatDate(s.createdAt)
      const admin = isAdminSpot(s)
      const borderClass = admin ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/5'
      const adminBadge = admin ? '<span class="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full ml-2">Admin</span>' : ''

      return `
      <div class="flex items-center justify-between py-3 border-b ${borderClass} last:border-0">
        <div class="flex-1 min-w-0">
          <div class="flex items-center">
            <span class="text-sm text-white font-medium">${title}</span>
            ${adminBadge}
          </div>
          ${creator ? `<p class="text-xs text-slate-400 mt-0.5">${creator}</p>` : ''}
          ${desc ? `<p class="text-xs text-slate-500 mt-0.5">${desc}</p>` : ''}
          ${date ? `<p class="text-xs text-slate-500 mt-0.5">${date}</p>` : ''}
        </div>
        ${admin ? '<span class="text-xs text-emerald-400 whitespace-nowrap">Protege</span>' : `<button class="btn-danger text-xs py-1 px-3 whitespace-nowrap" data-delete-spot="${escapeHTML(s.id)}">Supprimer</button>`}
      </div>`
    })
    .join('')
}

async function loadData() {
  try {
    const [users, spots] = await Promise.all([
      loadAllUsers(),
      loadAllSpots(),
    ])
    cachedUsers = users
    cachedSpots = spots
    renderUsersList(cachedUsers)
    renderSpotsList(cachedSpots)
  } catch (err) {
    console.error('Cleanup: failed to load data', err)
    const usersEl = document.getElementById('cleanup-users-list')
    const spotsEl = document.getElementById('cleanup-spots-list')
    if (usersEl) usersEl.innerHTML = '<p class="text-danger-400 text-sm text-center py-4">Erreur de chargement</p>'
    if (spotsEl) spotsEl.innerHTML = '<p class="text-danger-400 text-sm text-center py-4">Erreur de chargement</p>'
  }
}

async function deleteSingleUser(docId) {
  try {
    await deleteDocument('users', docId)
    cachedUsers = cachedUsers.filter((u) => u.id !== docId)
    renderUsersList(cachedUsers)
    window.__showToast('Utilisateur supprime', 'success')
  } catch (err) {
    console.error('Delete user failed:', err)
    window.__showToast('Erreur de suppression', 'error')
  }
}

async function deleteSingleSpot(docId) {
  try {
    await deleteDocument('spots', docId)
    cachedSpots = cachedSpots.filter((s) => s.id !== docId)
    renderSpotsList(cachedSpots)
    window.__showToast('Spot supprime', 'success')
  } catch (err) {
    console.error('Delete spot failed:', err)
    window.__showToast('Erreur de suppression', 'error')
  }
}

async function deleteAllUsersExceptAdmin() {
  if (!cachedUsers) return
  const toDelete = cachedUsers.filter((u) => !isAdminUser(u))
  if (toDelete.length === 0) {
    window.__showToast('Aucun utilisateur a supprimer', 'info')
    return
  }
  if (!confirm(`Supprimer ${toDelete.length} utilisateur(s) ? Cette action est irreversible.`)) return

  const listEl = document.getElementById('cleanup-users-list')
  if (listEl) listEl.innerHTML = '<div class="text-center py-4"><span class="spinner"></span> Suppression en cours...</div>'

  let deleted = 0
  for (const u of toDelete) {
    try {
      await deleteDocument('users', u.id)
      deleted++
    } catch (err) {
      console.error(`Failed to delete user ${u.id}:`, err)
    }
  }

  cachedUsers = cachedUsers.filter((u) => isAdminUser(u))
  renderUsersList(cachedUsers)
  window.__showToast(`${deleted} utilisateur(s) supprime(s)`, 'success')
}

async function deleteAllSpotsExceptAdmin() {
  if (!cachedSpots) return
  const toDelete = cachedSpots.filter((s) => !isAdminSpot(s))
  if (toDelete.length === 0) {
    window.__showToast('Aucun spot a supprimer', 'info')
    return
  }
  if (!confirm(`Supprimer ${toDelete.length} spot(s) ? Cette action est irreversible.`)) return

  const listEl = document.getElementById('cleanup-spots-list')
  if (listEl) listEl.innerHTML = '<div class="text-center py-4"><span class="spinner"></span> Suppression en cours...</div>'

  let deleted = 0
  for (const s of toDelete) {
    try {
      await deleteDocument('spots', s.id)
      deleted++
    } catch (err) {
      console.error(`Failed to delete spot ${s.id}:`, err)
    }
  }

  cachedSpots = cachedSpots.filter((s) => isAdminSpot(s))
  renderSpotsList(cachedSpots)
  window.__showToast(`${deleted} spot(s) supprime(s)`, 'success')
}

export async function bindCleanupEvents() {
  // Load all data
  await loadData()

  // Delegate click events for individual delete buttons
  const mainContent = document.getElementById('main-content')
  if (mainContent) {
    mainContent.addEventListener('click', (e) => {
      const userBtn = e.target.closest('[data-delete-user]')
      if (userBtn) {
        const docId = userBtn.dataset.deleteUser
        if (confirm('Supprimer cet utilisateur ?')) {
          deleteSingleUser(docId)
        }
        return
      }

      const spotBtn = e.target.closest('[data-delete-spot]')
      if (spotBtn) {
        const docId = spotBtn.dataset.deleteSpot
        if (confirm('Supprimer ce spot ?')) {
          deleteSingleSpot(docId)
        }
      }
    })
  }

  // Bulk delete buttons
  document.getElementById('delete-all-users-btn')?.addEventListener('click', deleteAllUsersExceptAdmin)
  document.getElementById('delete-all-spots-btn')?.addEventListener('click', deleteAllSpotsExceptAdmin)
}

export function resetCleanupCache() {
  cachedUsers = null
  cachedSpots = null
}
