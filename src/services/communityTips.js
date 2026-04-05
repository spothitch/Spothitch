/**
 * Community Tips Service (legacy)
 * Used by Travel.js for rendering tips. Data is stored in localStorage.
 * The authoritative Firestore-backed service is communityGuideService.js.
 * submitCommunityTip now also writes to Firestore via communityGuideService.
 */

import { Storage } from '../utils/storage.js'
import { icon } from '../utils/icons.js'
import { t } from '../i18n/index.js'

const TIPS_KEY = 'spothitch_community_tips'

function getTips() {
  return Storage.get(TIPS_KEY) || []
}

function saveTips(tips) {
  Storage.set(TIPS_KEY, tips)
}

export function getTipsByCountry(countryCode) {
  return getTips()
    .filter(t => t.country === countryCode)
    .sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes))
}

export function addTip(countryCode, text, author) {
  const tips = getTips()
  const newTip = {
    id: `tip_${Date.now()}`,
    country: countryCode,
    text,
    author: author || 'Voyageur anonyme',
    upvotes: 0,
    downvotes: 0,
    votedBy: [],
    createdAt: new Date().toISOString(),
  }
  tips.push(newTip)
  saveTips(tips)
  return newTip
}

export function voteTip(tipId, direction) {
  const tips = getTips()
  const tip = tips.find(t => t.id === tipId)
  if (!tip) return false

  const userId = 'local-user'
  if (tip.votedBy?.includes(userId)) return false

  if (direction === 'up') tip.upvotes = (tip.upvotes || 0) + 1
  else tip.downvotes = (tip.downvotes || 0) + 1
  tip.votedBy = [...(tip.votedBy || []), userId]

  saveTips(tips)
  return true
}

export function renderCommunityTips(countryCode) {
  const tips = getTipsByCountry(countryCode)

  return `
    <div class="card p-4 space-y-3">
      <h3 class="font-bold flex items-center gap-2">
        ${icon('users', 'w-5 h-5 text-primary-400')}
        ${t('communityTipsTitle') || 'Conseils de la communaute'}
      </h3>

      <!-- Add tip form -->
      <div class="flex gap-2">
        <input
          type="text"
          id="community-tip-input"
          class="input-field flex-1"
          placeholder="${t('communityTipsPlaceholder') || 'Partage un conseil...'}"
          onkeydown="if(event.key==='Enter') submitCommunityTip('${countryCode}')"
        />
        <button
          onclick="submitCommunityTip('${countryCode}')"
          class="btn-primary px-4"
        >
          ${icon('send', 'w-5 h-5')}
        </button>
      </div>

      ${tips.length > 0 ? `
        <div class="space-y-2">
          ${tips.map(tip => `
            <div class="p-3 rounded-xl bg-white/5">
              <p class="text-sm text-slate-300">${tip.text}</p>
              <div class="flex items-center justify-between mt-2">
                <span class="text-xs text-slate-400">${tip.author} - ${new Date(tip.createdAt).toLocaleDateString('fr-FR')}</span>
                <div class="flex items-center gap-2">
                  <button onclick="voteCommunityTip('${tip.id}', 'up')" class="text-xs px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20">
                    ${icon("thumbs-up", "w-3 h-3 inline")} ${tip.upvotes || 0}
                  </button>
                  <button onclick="voteCommunityTip('${tip.id}', 'down')" class="text-xs px-2 py-1 rounded bg-danger-500/10 text-danger-400 hover:bg-danger-500/20">
                    ${icon("thumbs-down", "w-3 h-3 inline")} ${tip.downvotes || 0}
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      ` : `
        <p class="text-sm text-slate-400 text-center py-2">${t('communityTipsEmpty') || 'Aucun conseil pour ce pays. Sois le premier !'}</p>
      `}
    </div>
  `
}

// Global handlers
window.submitCommunityTip = (countryCode) => {
  if (window.submitCommunityTip._busy) return
  window.submitCommunityTip._busy = true
  setTimeout(() => { window.submitCommunityTip._busy = false }, 2000)
  const input = document.getElementById('community-tip-input')
  const text = input?.value?.trim()
  if (!text) { window.submitCommunityTip._busy = false; return }

  addTip(countryCode, text)
  input.value = ''
  window.showToast?.(t('communityTipsAdded') || 'Conseil ajoute !', 'success')

  // Also submit to Firestore via the real service
  import('./communityGuideService.js').then(({ submitGuideTip }) => {
    submitGuideTip({ countryCode, text, category: 'general' }).catch(() => {})
  }).catch(() => {})

  // Re-render the guide detail
  window.setState?.({ selectedCountryGuide: countryCode })
}

// voteCommunityTip is defined in Guides.js (authoritative source with Firestore integration)

export default { getTipsByCountry, addTip, voteTip, renderCommunityTips }
