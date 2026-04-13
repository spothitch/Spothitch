/**
 * ID Verification Component — Review pending identity verifications
 */

import { db } from '../services/firebase.js'

function escapeHTML(str) {
  const div = document.createElement('div')
  div.textContent = str || ''
  return div.innerHTML
}

let verifications = []
let loading = false

async function loadPending() {
  loading = true
  try {
    const { collection, getDocs, query, where, orderBy } = await import('firebase/firestore')
    const _db = db
    const q = query(collection(_db, 'id_verifications'), where('status', '==', 'pending'), orderBy('createdAt', 'desc'))
    const snap = await getDocs(q)
    verifications = snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch (e) {
    console.error('[IdVerify] Load failed:', e)
    verifications = []
  }
  loading = false
}

export function renderIdVerification() {
  return `
    <div class="page-header">
      <h2>Vérifications d'identité</h2>
      <span class="badge">${verifications.length} en attente</span>
    </div>
    <div id="id-verify-list">
      ${loading ? '<div class="loading">Chargement...</div>' : ''}
      ${verifications.length === 0 && !loading ? '<div class="empty">Aucune vérification en attente</div>' : ''}
      ${verifications.map(v => `
        <div class="card" data-id="${escapeHTML(v.id)}">
          <div class="card-header">
            <strong>${escapeHTML(v.userName || v.userId)}</strong>
            <span class="badge badge-warning">${escapeHTML(v.method || 'photo')}</span>
          </div>
          <div class="card-body">
            <p>Trust level demandé: ${v.trustLevel || '?'}</p>
            <p>Date: ${v.createdAt ? new Date(v.createdAt.seconds ? v.createdAt.seconds * 1000 : v.createdAt).toLocaleDateString() : '?'}</p>
          </div>
          <div class="card-actions">
            <button class="btn-success" data-action="approve" data-id="${escapeHTML(v.id)}">Approuver</button>
            <button class="btn-danger" data-action="reject" data-id="${escapeHTML(v.id)}">Rejeter</button>
          </div>
        </div>
      `).join('')}
    </div>
  `
}

export function bindIdVerificationEvents() {
  loadPending().then(() => {
    const list = document.getElementById('id-verify-list')
    if (list) list.innerHTML = renderIdVerification().match(/<div id="id-verify-list">([\s\S]*)<\/div>/)?.[1] || ''
  })

  document.getElementById('id-verify-list')?.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-action]')
    if (!btn) return
    const action = btn.dataset.action
    const id = btn.dataset.id
    if (!id) return

    try {
      const { doc, updateDoc } = await import('firebase/firestore')
      const _db = db
      const ref = doc(_db, 'id_verifications', id)

      if (action === 'approve') {
        await updateDoc(ref, { status: 'approved', reviewedAt: new Date().toISOString() })
        window.__showToast('Vérification approuvée', 'success')
      } else if (action === 'reject') {
        await updateDoc(ref, { status: 'rejected', reviewedAt: new Date().toISOString() })
        window.__showToast('Vérification rejetée', 'info')
      }

      // Reload
      await loadPending()
      const list = document.getElementById('id-verify-list')
      if (list) list.innerHTML = renderIdVerification().match(/<div id="id-verify-list">([\s\S]*)<\/div>/)?.[1] || ''
    } catch (err) {
      console.error('[IdVerify] Action failed:', err)
      window.__showToast('Erreur: ' + err.message, 'error')
    }
  })
}

export function resetIdVerificationCache() {
  verifications = []
  loading = false
}
