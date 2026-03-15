/**
 * Feedback Service
 * Centralized storage for guide tip votes and user suggestions
 * Uses localStorage for personal votes + Firestore for community aggregates
 */

import { Storage } from '../utils/storage.js'
import { t } from '../i18n/index.js'
import { icon } from '../utils/icons.js'
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment as fsIncrement } from 'firebase/firestore'
import { getApps, getApp } from 'firebase/app'
import { getCurrentUser } from './firebase.js'

const VOTES_KEY = 'spothitch_guide_votes'
const SUGGESTIONS_KEY = 'spothitch_guide_suggestions'

// In-memory cache of community vote counts { [key]: { up, down } }
const _communityVotes = {}

function getDb() {
  return getApps().length > 0 ? getFirestore(getApp()) : null
}

// ==================== VOTES ====================

function getVotes() {
  return Storage.get(VOTES_KEY) || {}
}

function saveVotes(votes) {
  Storage.set(VOTES_KEY, votes)
}

/**
 * Load community vote totals for a tip from Firestore (updates in-memory cache)
 */
export async function loadCommunityVotes(section, tipIndex) {
  const db = getDb()
  if (!db) return
  const key = `${section}_${tipIndex}`
  try {
    const snap = await getDoc(doc(db, 'guideVotes', key))
    if (snap.exists()) {
      _communityVotes[key] = { up: snap.data().up || 0, down: snap.data().down || 0 }
    }
  } catch { /* silent */ }
}

/**
 * Vote on a guide tip (approve/disapprove)
 * @param {string} section - Section identifier (e.g., 'start', 'safety', 'country_FR')
 * @param {number|string} tipIndex - Tip identifier within section
 * @param {'up'|'down'} direction - Vote direction
 * @returns {boolean} true if vote registered, false if already voted
 */
export function voteGuideTip(section, tipIndex, direction) {
  const votes = getVotes()
  const key = `${section}_${tipIndex}`

  // If already voted same direction → toggle off (undo)
  if (votes[key]?.direction === direction) {
    const oldDirection = votes[key].direction
    delete votes[key]
    saveVotes(votes)

    // Update community totals
    if (_communityVotes[key]) {
      _communityVotes[key][oldDirection] = Math.max(0, (_communityVotes[key][oldDirection] || 0) - 1)
    }
    _syncVoteToFirestore(key, oldDirection, true) // undo
    return true
  }

  // If already voted other direction → switch vote
  if (votes[key]) {
    const oldDirection = votes[key].direction
    if (_communityVotes[key]) {
      _communityVotes[key][oldDirection] = Math.max(0, (_communityVotes[key][oldDirection] || 0) - 1)
    }
    _syncVoteToFirestore(key, oldDirection, true) // undo old
  }

  votes[key] = {
    direction,
    votedAt: new Date().toISOString(),
  }
  saveVotes(votes)

  // Update community totals in cache immediately
  if (!_communityVotes[key]) _communityVotes[key] = { up: 0, down: 0 }
  _communityVotes[key][direction]++

  // Sync to Firestore (best effort, async)
  _syncVoteToFirestore(key, direction)

  return true
}

async function _syncVoteToFirestore(key, direction, undo = false) {
  const db = getDb()
  if (!db) return
  const user = getCurrentUser()
  try {
    const ref = doc(db, 'guideVotes', key)
    const snap = await getDoc(ref)
    if (snap.exists()) {
      await updateDoc(ref, { [direction]: fsIncrement(undo ? -1 : 1), updatedAt: new Date().toISOString() })
    } else if (!undo) {
      await setDoc(ref, { up: direction === 'up' ? 1 : 0, down: direction === 'down' ? 1 : 0, updatedAt: new Date().toISOString() })
    }
    // Also record/remove user's vote in their profile
    if (user) {
      if (undo) {
        const { deleteDoc: delDoc } = await import('firebase/firestore')
        await delDoc(doc(db, 'users', user.uid, 'guideVotes', key))
      } else {
        await setDoc(doc(db, 'users', user.uid, 'guideVotes', key), {
          direction,
          votedAt: new Date().toISOString(),
        })
      }
    }
  } catch { /* silent — local vote already saved */ }
}

/**
 * Get vote for a specific tip
 * @param {string} section
 * @param {number|string} tipIndex
 * @returns {Object|null} Vote object or null
 */
export function getVote(section, tipIndex) {
  const votes = getVotes()
  return votes[`${section}_${tipIndex}`] || null
}

/**
 * Get vote counts for a section
 * @param {string} section
 * @returns {Object} { up: number, down: number }
 */
export function getSectionVotes(section) {
  const votes = getVotes()
  let up = 0
  let down = 0
  for (const [key, vote] of Object.entries(votes)) {
    if (key.startsWith(`${section}_`)) {
      if (vote.direction === 'up') up++
      else down++
    }
  }
  return { up, down }
}

// ==================== SUGGESTIONS ====================

function getSuggestions() {
  return Storage.get(SUGGESTIONS_KEY) || []
}

function saveSuggestions(suggestions) {
  Storage.set(SUGGESTIONS_KEY, suggestions)
}

/**
 * Submit a tip suggestion
 * @param {string} section - Section (e.g., 'start', 'safety', 'country_FR')
 * @param {string} text - Suggestion text
 * @returns {Object} Created suggestion
 */
export function submitSuggestion(section, text) {
  const suggestions = getSuggestions()
  const suggestion = {
    id: `sug_${Date.now()}`,
    section,
    text,
    createdAt: new Date().toISOString(),
  }
  suggestions.push(suggestion)
  saveSuggestions(suggestions)
  return suggestion
}

/**
 * Get suggestions for a section
 * @param {string} section
 * @returns {Array}
 */
export function getSuggestionsBySection(section) {
  return getSuggestions().filter(s => s.section === section)
}

// ==================== RENDER HELPERS ====================

/**
 * Render vote buttons for a tip
 * @param {string} section
 * @param {number|string} tipIndex
 * @returns {string} HTML
 */
/**
 * Get aggregated vote counts for a specific tip
 * @param {string} section
 * @param {number|string} tipIndex
 * @returns {{ up: number, down: number }}
 */
export function getTipVoteCounts(section, tipIndex) {
  const key = `${section}_${tipIndex}`
  // Return community totals if available, else personal vote count
  if (_communityVotes[key]) return _communityVotes[key]
  const votes = getVotes()
  const myVote = votes[key]
  return {
    up: myVote?.direction === 'up' ? 1 : 0,
    down: myVote?.direction === 'down' ? 1 : 0,
  }
}

export function renderTipVoteButtons(section, tipIndex) {
  const vote = getVote(section, tipIndex)
  const upActive = vote?.direction === 'up'
  const downActive = vote?.direction === 'down'
  const counts = getTipVoteCounts(section, tipIndex)

  return `
    <div class="flex items-center gap-1.5 mt-2" id="vote-${section}-${tipIndex}">
      <button
        type="button"
        onclick="voteGuideTip('${section}', '${tipIndex}', 'up')"
        class="px-2 py-0.5 rounded-full text-xs transition-colors ${
          upActive
            ? 'bg-emerald-500/30 text-emerald-400'
            : 'bg-white/5 text-slate-400 hover:bg-emerald-500/20 hover:text-emerald-400'
        }"
        aria-label="${t('tipUseful') || 'Utile'}"
      >
        ${icon('thumbs-up', 'w-3 h-3 inline mr-0.5')}${counts.up > 0 ? ' ' + counts.up : ''}
      </button>
      <button
        type="button"
        onclick="voteGuideTip('${section}', '${tipIndex}', 'down')"
        class="px-2 py-0.5 rounded-full text-xs transition-colors ${
          downActive
            ? 'bg-danger-500/30 text-danger-400'
            : 'bg-white/5 text-slate-400 hover:bg-danger-500/20 hover:text-danger-400'
        }"
        aria-label="${t('tipNotUseful') || 'Pas utile'}"
      >
        ${icon('thumbs-down', 'w-3 h-3 inline mr-0.5')}${counts.down > 0 ? ' ' + counts.down : ''}
      </button>
    </div>
  `
}

/**
 * Render suggestion form for a guide section
 * @param {string} section
 * @returns {string} HTML
 */
export function renderSuggestionForm(section) {
  const suggestions = getSuggestionsBySection(section)

  return `
    <div class="card p-4 space-y-3 border-primary-500/20">
      <h4 class="font-medium flex items-center gap-2 text-sm">
        ${icon('message-square-plus', 'w-4 h-4 text-primary-400')}
        ${t('suggestTip') || 'Proposer un conseil'}
      </h4>
      <div class="flex gap-2">
        <input
          type="text"
          id="guide-suggestion-${section}"
          class="input-field flex-1 text-sm"
          placeholder="${t('suggestTipPlaceholder') || 'Partage ton astuce...'}"
          onkeydown="if(event.key==='Enter') submitGuideSuggestion('${section}')"
        />
        <button
          type="button"
          onclick="submitGuideSuggestion('${section}')"
          class="btn-primary px-3 py-2 text-sm"
        >
          ${icon('send', 'w-4 h-4')}
        </button>
      </div>
      ${suggestions.length > 0 ? `
        <div class="space-y-2">
          <div class="text-xs text-slate-400">${t('yourSuggestions') || 'Tes suggestions'} :</div>
          ${suggestions.map(s => `
            <div class="p-2 rounded-lg bg-white/5 text-xs text-slate-300 flex items-start gap-2">
              ${icon('lightbulb', 'w-3 h-3 text-amber-400 mt-0.5 shrink-0')}
              <span>${s.text}</span>
            </div>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `
}

// ==================== GLOBAL HANDLERS ====================

window.voteGuideTip = (section, tipIndex, direction) => {
  const success = voteGuideTip(section, tipIndex, direction)
  if (success) {
    // Instant DOM update — replace the vote buttons inline (no toast, no re-render)
    const container = document.getElementById(`vote-${section}-${tipIndex}`)
    if (container) {
      container.outerHTML = renderTipVoteButtons(section, tipIndex)
    }
  }
}

window.submitGuideSuggestion = (section) => {
  const input = document.getElementById(`guide-suggestion-${section}`)
  const text = input?.value?.trim()
  if (!text) return

  submitSuggestion(section, text)
  input.value = ''
  window.showToast?.(t('suggestionSubmitted') || 'Suggestion enregistree, merci !', 'success')

  // Force re-render
  const state = window.getState?.() || {}
  window.setState?.({ guideSection: state.guideSection })
}

export default {
  voteGuideTip,
  getVote,
  getSectionVotes,
  submitSuggestion,
  getSuggestionsBySection,
  renderTipVoteButtons,
  renderSuggestionForm,
}
