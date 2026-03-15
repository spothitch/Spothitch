/**
 * Cleanup Component — Delete ONLY test data (CI/E2E accounts and their spots)
 * Real users are never shown, never touchable.
 */

import { loadAllSpots, loadAllUsers } from '../services/stats.js'
import { deleteDocument } from '../services/firebase.js'

const ADMIN_EMAIL = 'antoine.v.ville@gmail.com'

// Test account emails used by CI/E2E
const TEST_EMAILS = [
  'ci-alice@spothitch.com',
  'ci-bob@spothitch.com',
  'ci-charlie@spothitch.com',
  'ci-diana@spothitch.com',
  'ci-admin@spothitch.com',
]

function escapeHTML(str) {
  const div = document.createElement('div')
  div.textContent = str || ''
  return div.innerHTML
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  try {
    const d = dateStr.toDate ? dateStr.toDate() : new Date(dateStr)
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  } catch {
    return String(dateStr).slice(0, 10)
  }
}

function isTestUser(user) {
  const email = (user.email || '').toLowerCase()
  return TEST_EMAILS.includes(email)
}

function isTestSpot(spot) {
  const creatorEmail = (spot.creatorEmail || spot.userEmail || '').toLowerCase()
  const desc = (spot.description || '').toLowerCase()
  const creator = (spot.creator || spot.creatorId || '').toLowerCase()
  // Spot created by a test account
  if (TEST_EMAILS.includes(creatorEmail)) return true
  // Spot with E2E/test markers
  if (desc.includes('e2e') || desc.includes('test spot')) return true
  if (creator.includes('alice test') || creator.includes('bob test') || creator.includes('charlie test') || creator.includes('diana test')) return true
  return false
}

let testUsers = null
let testSpots = null
let realUserCount = 0
let realSpotCount = 0

export function renderCleanup() {
  return `
    <div class="p-6 max-w-6xl mx-auto">
      <h1 class="font-display text-2xl font-bold mb-6 text-primary-400">Nettoyage des donnees de test</h1>
      <p class="text-slate-400 text-sm mb-6">Supprime uniquement les comptes et spots crees par les tests automatises (CI/E2E). Les vrais utilisateurs ne sont jamais affiches ici.</p>

      <!-- Summary -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div class="card p-4 text-center">
          <div class="text-2xl font-bold text-emerald-400" id="real-user-count"><span class="spinner"></span></div>
          <div class="text-xs text-slate-400 mt-1">Vrais utilisateurs</div>
        </div>
        <div class="card p-4 text-center">
          <div class="text-2xl font-bold text-danger-400" id="test-user-count"><span class="spinner"></span></div>
          <div class="text-xs text-slate-400 mt-1">Comptes de test</div>
        </div>
        <div class="card p-4 text-center">
          <div class="text-2xl font-bold text-emerald-400" id="real-spot-count"><span class="spinner"></span></div>
          <div class="text-xs text-slate-400 mt-1">Vrais spots</div>
        </div>
        <div class="card p-4 text-center">
          <div class="text-2xl font-bold text-danger-400" id="test-spot-count"><span class="spinner"></span></div>
          <div class="text-xs text-slate-400 mt-1">Spots de test</div>
        </div>
      </div>

      <!-- Cleanup button -->
      <div class="card p-5 mb-8 text-center">
        <button id="cleanup-all-btn" class="btn-danger py-3 px-8 text-base">
          Nettoyer toutes les donnees de test
        </button>
        <p class="text-xs text-slate-500 mt-3">Supprime les comptes ci-*@spothitch.com et leurs spots. Aucun vrai utilisateur ne sera touche.</p>
      </div>

      <!-- Test accounts found -->
      <div class="card p-5 mb-8">
        <h2 class="font-display text-lg font-bold text-danger-400 mb-4">Comptes de test trouves</h2>
        <div id="test-users-list">
          <div class="text-center py-4"><span class="spinner"></span></div>
        </div>
      </div>

      <!-- Test spots found -->
      <div class="card p-5">
        <h2 class="font-display text-lg font-bold text-danger-400 mb-4">Spots de test trouves</h2>
        <div id="test-spots-list">
          <div class="text-center py-4"><span class="spinner"></span></div>
        </div>
      </div>
    </div>
  `
}

function renderTestUsers() {
  const el = document.getElementById('test-users-list')
  const countEl = document.getElementById('test-user-count')
  const realCountEl = document.getElementById('real-user-count')
  if (countEl) countEl.textContent = testUsers ? testUsers.length : '0'
  if (realCountEl) realCountEl.textContent = realUserCount
  if (!el) return

  if (!testUsers || testUsers.length === 0) {
    el.innerHTML = '<p class="text-emerald-400 text-sm text-center py-4">Aucun compte de test. Tout est propre.</p>'
    return
  }

  el.innerHTML = testUsers.map(u => {
    const email = escapeHTML(u.email || '')
    const name = escapeHTML(u.username || u.displayName || '')
    const date = formatDate(u.createdAt || u.joinedAt)
    return `
    <div class="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
      <div>
        <span class="text-sm text-slate-200">${name || email}</span>
        <span class="text-xs text-slate-500 ml-2">${email}</span>
        ${date ? `<span class="text-xs text-slate-600 ml-2">${date}</span>` : ''}
      </div>
      <span class="text-xs text-danger-400">Test CI</span>
    </div>`
  }).join('')
}

function renderTestSpots() {
  const el = document.getElementById('test-spots-list')
  const countEl = document.getElementById('test-spot-count')
  const realCountEl = document.getElementById('real-spot-count')
  if (countEl) countEl.textContent = testSpots ? testSpots.length : '0'
  if (realCountEl) realCountEl.textContent = realSpotCount
  if (!el) return

  if (!testSpots || testSpots.length === 0) {
    el.innerHTML = '<p class="text-emerald-400 text-sm text-center py-4">Aucun spot de test. Tout est propre.</p>'
    return
  }

  el.innerHTML = testSpots.map(s => {
    const title = escapeHTML(s.title || s.from || s.city || `${(s.lat || 0).toFixed(2)}, ${(s.lng || 0).toFixed(2)}`)
    const creator = escapeHTML(s.creator || s.creatorEmail || '')
    const date = formatDate(s.createdAt)
    return `
    <div class="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
      <div>
        <span class="text-sm text-slate-200">${title}</span>
        ${creator ? `<span class="text-xs text-slate-500 ml-2">${creator}</span>` : ''}
        ${date ? `<span class="text-xs text-slate-600 ml-2">${date}</span>` : ''}
      </div>
      <span class="text-xs text-danger-400">Test</span>
    </div>`
  }).join('')
}

async function loadAndFilterData() {
  try {
    const [allUsers, allSpots] = await Promise.all([
      loadAllUsers(),
      loadAllSpots(),
    ])

    testUsers = allUsers.filter(u => isTestUser(u))
    testSpots = allSpots.filter(s => isTestSpot(s))
    realUserCount = allUsers.length - testUsers.length
    realSpotCount = allSpots.length - testSpots.length

    renderTestUsers()
    renderTestSpots()
  } catch (err) {
    console.error('Cleanup: failed to load data', err)
    const el1 = document.getElementById('test-users-list')
    const el2 = document.getElementById('test-spots-list')
    if (el1) el1.innerHTML = '<p class="text-danger-400 text-sm text-center py-4">Erreur de chargement</p>'
    if (el2) el2.innerHTML = '<p class="text-danger-400 text-sm text-center py-4">Erreur de chargement</p>'
  }
}

async function cleanupAll() {
  const totalTest = (testUsers ? testUsers.length : 0) + (testSpots ? testSpots.length : 0)
  if (totalTest === 0) {
    window.__showToast?.('Rien a nettoyer, tout est propre', 'info')
    return
  }

  if (!confirm(`Supprimer ${testUsers?.length || 0} compte(s) de test et ${testSpots?.length || 0} spot(s) de test ?`)) return

  const btn = document.getElementById('cleanup-all-btn')
  if (btn) {
    btn.disabled = true
    btn.textContent = 'Nettoyage en cours...'
  }

  let deleted = 0

  // Delete test users
  for (const u of (testUsers || [])) {
    try {
      await deleteDocument('users', u.id)
      deleted++
    } catch (err) {
      console.error('Failed to delete test user:', err)
    }
  }

  // Delete test spots
  for (const s of (testSpots || [])) {
    try {
      await deleteDocument('spots', s.id)
      deleted++
    } catch (err) {
      console.error('Failed to delete test spot:', err)
    }
  }

  testUsers = []
  testSpots = []
  renderTestUsers()
  renderTestSpots()

  if (btn) {
    btn.disabled = false
    btn.textContent = 'Nettoyer toutes les donnees de test'
  }

  window.__showToast?.(`${deleted} element(s) de test supprime(s)`, 'success')
}

export async function bindCleanupEvents() {
  await loadAndFilterData()

  document.getElementById('cleanup-all-btn')?.addEventListener('click', cleanupAll)
}

export function resetCleanupCache() {
  testUsers = null
  testSpots = null
  realUserCount = 0
  realSpotCount = 0
}
