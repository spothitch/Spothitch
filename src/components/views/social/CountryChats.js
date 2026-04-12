/**
 * Country Chats Component
 * Browse and join country-specific chat groups.
 * Renders as a section in the Social/Messagerie tab.
 */

import { t } from '../../../i18n/index.js'
import { icon } from '../../../utils/icons.js'
import { escapeHTML, escapeJSString } from '../../../utils/sanitize.js'
import { getAvailableCountries } from '../../../services/countryChat.js'

// Cache for member counts (populated async)
const memberCountCache = {}

/**
 * Fetch member counts for visible country groups from Firestore
 */
async function fetchMemberCounts(countryCodes) {
  try {
    const { doc, getDoc } = await import('firebase/firestore')
    const { db } = await import('../../../services/firebase.js')
    if (!db) return

    const promises = countryCodes.map(async (code) => {
      try {
        const groupRef = doc(db, 'groupConversations', `country_${code}`)
        const snap = await getDoc(groupRef)
        if (snap.exists()) {
          const data = snap.data()
          memberCountCache[code] = data.memberCount || data.members?.length || 0
        }
      } catch {
        // Silently ignore per-country errors
      }
    })
    await Promise.all(promises)
  } catch {
    // Firestore unavailable, keep cache empty
  }
}

/**
 * Render the country chats section
 * @param {object} state
 * @returns {string} HTML
 */
export function renderCountryChats(_state) {
  const countries = getAvailableCountries()

  // Group by region
  const europe = countries.filter(c => ['FR', 'DE', 'ES', 'IT', 'NL', 'BE', 'PT', 'AT', 'CH', 'IE', 'PL', 'CZ', 'GB', 'SE', 'NO', 'DK', 'FI', 'HU', 'HR', 'RO', 'GR', 'BG', 'SK', 'SI'].includes(c.code))

  const visibleCountries = europe.slice(0, 12)

  // Trigger async fetch of member counts (will update on next render)
  fetchMemberCounts(visibleCountries.map(c => c.code))

  return `
    <div class="px-4 py-3">
      <div class="flex items-center gap-2 mb-3">
        ${icon('globe', 'w-4 h-4 text-amber-400')}
        <span class="text-sm font-bold text-slate-200">${escapeHTML(t('countryChats') || 'Discussions par pays')}</span>
      </div>

      <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        ${visibleCountries.map(c => {
          const count = memberCountCache[c.code]
          const badge = count ? `<span class="absolute -top-1 -right-1 text-[10px] bg-amber-500 text-dark-primary rounded-full w-4 h-4 flex items-center justify-center font-bold">${count}</span>` : ''
          return `
          <button
            onclick="joinCountryChatAction('${escapeJSString(c.code)}')"
            class="relative shrink-0 flex flex-col items-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-800/60 border border-white/[0.06] transition-colors"
          >
            ${badge}
            <span class="text-xl">${c.flag}</span>
            <span class="text-[10px] text-slate-400 font-medium w-14 text-center truncate">${escapeHTML(c.name)}</span>
          </button>
        `}).join('')}
        <button
          onclick="showAllCountryChats()"
          class="shrink-0 flex flex-col items-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-800/60 border border-white/[0.06] border-dashed transition-colors"
        >
          <span class="text-xl text-slate-500">${icon('plus', 'w-5 h-5')}</span>
          <span class="text-[10px] text-slate-500 font-medium">${escapeHTML(t('seeAll') || 'Voir tout')}</span>
        </button>
      </div>
    </div>
  `
}

// Handler: join a country chat
window.joinCountryChatAction = async (code) => {
  const { joinCountryChat } = await import('../../../services/countryChat.js')
  const { showToast } = await import('../../../services/notifications.js')
  const result = await joinCountryChat(code)
  if (result) {
    showToast(t('joinedCountryChat') || 'Rejoint !', 'success')
    // Open the conversation with real-time listener
    window.openGroupConversation?.(result)
  }
}

// Handler: leave a country chat
window.leaveCountryChatAction = async (code) => {
  const { leaveCountryChat } = await import('../../../services/countryChat.js')
  const { showToast } = await import('../../../services/notifications.js')
  const result = await leaveCountryChat(code)
  if (result) {
    // Clear cached count so it refreshes on next render
    delete memberCountCache[code]
    showToast(t('leaveGroup') || 'Quitter', 'success')
  }
}

// Handler: show all countries
window.showAllCountryChats = () => {
  // For now, show a toast — full page to be built later
  import('../../../services/notifications.js').then(n =>
    n.showToast(t('comingSoon') || 'Bientôt disponible', 'info')
  )
}
