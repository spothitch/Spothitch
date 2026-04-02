/**
 * Friend Profile Modal (enriched)
 * Trust score, verification, mutual friends, activity stats, share/block
 */

import { getVerificationLevelName } from '../../services/identityVerification.js'
import { getTierForScore, renderMiniTrustBadge, renderVerifiedCheckmark } from '../../services/trustScore.js'
import { t } from '../../i18n/index.js'
import { icon } from '../../utils/icons.js'
import { escapeHTML } from '../../utils/sanitize.js'

export function renderFriendProfileModal(state) {
  const friendId = state.selectedFriendProfileId
  const friends = state.friends || []
  const isFriend = friends.some(f => f.id === friendId)
  const friend = friends.find(f => f.id === friendId) || state.guestProfile

  if (!friend || friend.id !== friendId) return ''

  const verLevel = friend.verificationLevel || 0
  const trustScore = friend.trustScore || Math.min(verLevel * 2, 10)
  const isIdVerified = verLevel >= 4
  const tier = getTierForScore(trustScore)

  // Mutual friends (friends who are also friends with this friend)
  const mutualCount = friend.mutualFriends?.length || 0

  // Last active
  const lastActive = friend.lastActive || friend.addedAt
  const lastActiveText = lastActive ? formatLastActive(lastActive) : t('offline')

  return `
    <div
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      onclick="closeFriendProfile()"
      role="dialog"
      aria-modal="true"
      aria-labelledby="friend-profile-title"
     tabindex="0">
      <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" aria-hidden="true"></div>
      <div
        class="relative modal-panel rounded-3xl w-full max-w-sm slide-up max-h-[90vh] overflow-y-auto"
        onclick="event.stopPropagation()"
      >
        <div class="p-6 space-y-4">
          <!-- Avatar + Name -->
          <div class="text-center">
            <div class="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500/30 to-emerald-500/30 flex items-center justify-center text-5xl mx-auto">
              ${friend.avatar || '👍'}
            </div>
            <div class="mt-3">
              <div class="flex items-center justify-center gap-2">
                <h2 id="friend-profile-title" class="text-xl font-bold">${escapeHTML(friend.name)}</h2>
                ${renderVerifiedCheckmark(isIdVerified)}
              </div>
              <div class="flex items-center justify-center gap-2 mt-1">
                <span class="w-3 h-3 rounded-full ${friend.online ? 'bg-emerald-500' : 'bg-slate-500'}"></span>
                <span class="text-sm text-slate-400">${friend.online ? t('online') : lastActiveText}</span>
              </div>
            </div>
          </div>

          <!-- Trust Score -->
          <div class="card p-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-medium text-slate-400">${t('trustScore')}</span>
              ${renderMiniTrustBadge(trustScore, isIdVerified)}
            </div>
            <div class="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div class="h-full ${tier.fill} rounded-full transition-colors" style="width: ${trustScore * 10}%"></div>
            </div>
            <div class="flex items-center gap-1 mt-2 text-xs text-slate-400">
              ${icon('shield', 'w-3 h-3')}
              <span>${tier.label} — ${getVerificationLevelName(verLevel)}</span>
            </div>
          </div>

          <!-- Stats Grid -->
          <div class="grid grid-cols-4 gap-2">
            <div class="card p-2 text-center">
              <div class="text-base font-bold text-primary-400">${friend.level || 1}</div>
              <div class="text-[10px] text-slate-400">${t('level')}</div>
            </div>
            <div class="card p-2 text-center">
              <div class="text-base font-bold text-amber-400">${friend.spotsCreated || 0}</div>
              <div class="text-[10px] text-slate-400">${t('spots')}</div>
            </div>
            <div class="card p-2 text-center">
              <div class="text-base font-bold text-emerald-400">${friend.checkins || 0}</div>
              <div class="text-[10px] text-slate-400">${t('checkins')}</div>
            </div>
            <div class="card p-2 text-center">
              <div class="text-base font-bold text-purple-400">${friend.countriesVisited || 0}</div>
              <div class="text-[10px] text-slate-400">${t('countriesShort')}</div>
            </div>
          </div>

          <!-- Social Links (from Firestore) -->
          ${renderFriendSocialLinks(state.friendProfileSocialLinks)}

          <!-- Info row -->
          <div class="space-y-2 text-sm">
            ${mutualCount > 0 ? `
              <div class="flex items-center gap-2 text-slate-400">
                ${icon('users', 'w-4 h-4')}
                <span>${mutualCount} ${t('mutualFriends')}</span>
              </div>
            ` : ''}
            ${friend.addedAt ? `
              <div class="flex items-center gap-2 text-slate-400">
                ${icon('calendar', 'w-4 h-4')}
                <span>${t('friendSince')} ${new Date(friend.addedAt).toLocaleDateString()}</span>
              </div>
            ` : ''}
            ${friend.badges?.length > 0 ? `
              <div class="flex items-center gap-2 text-slate-400">
                ${icon('award', 'w-4 h-4')}
                <span>${friend.badges.length} ${t('badges')}</span>
              </div>
            ` : ''}
          </div>

          <!-- Reviews section -->
          ${renderProfileReviews(state, friend.id)}

          <!-- Actions -->
          <div class="space-y-2">
            ${isFriend ? `
            <button
              onclick="closeFriendProfile(); openFriendChat('${friend.id}')"
              class="btn-primary w-full"
            >
              ${icon('message-circle', 'w-5 h-5 mr-2')}
              ${t('sendMessage')}
            </button>
            ` : `
            <button
              onclick="sendFriendRequest('${friend.id}')"
              class="btn-primary w-full"
            >
              ${icon('user-plus', 'w-5 h-5 mr-2')}
              ${t('addFriend') || 'Ajouter comme ami'}
            </button>
            `}
            <div class="flex gap-2">
              <button
                onclick="shareProfile('${friend.id}', '${escapeHTML(friend.name)}', '${friend.avatar || '👍'}')"
                class="flex-1 py-2 rounded-xl bg-white/5 text-slate-400 hover:bg-white/10 transition-colors text-sm flex items-center justify-center gap-1"
              >
                ${icon('share', 'w-4 h-4')}
                ${t('share')}
              </button>
              ${isFriend ? `
              <button
                onclick="removeFriend('${friend.id}'); closeFriendProfile()"
                class="flex-1 py-2 rounded-xl border border-danger-500/30 text-danger-400 hover:bg-danger-500/10 transition-colors text-sm flex items-center justify-center gap-1"
              >
                ${icon('user-minus', 'w-4 h-4')}
                ${t('removeFriend')}
              </button>
              ` : ''}
            </div>
            <div class="flex gap-2 pt-1">
              <button
                onclick="openReport('USER', '${friend.id}')"
                class="flex-1 py-2 rounded-xl bg-white/5 text-slate-500 hover:text-danger-400 hover:bg-danger-500/10 transition-colors text-xs flex items-center justify-center gap-1"
              >
                ${icon('flag', 'w-3 h-3')}
                ${t('report') || 'Signaler'}
              </button>
              <button
                onclick="openBlockModal('${friend.id}', '${escapeHTML(friend.name)}')"
                class="flex-1 py-2 rounded-xl bg-white/5 text-slate-500 hover:text-danger-400 hover:bg-danger-500/10 transition-colors text-xs flex items-center justify-center gap-1"
              >
                ${icon('ban', 'w-3 h-3')}
                ${t('blockUser') || 'Bloquer'}
              </button>
            </div>
          </div>
        </div>

        <button
          onclick="closeFriendProfile()"
          class="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
          aria-label="${t('close') || 'Close'}"
        >
          ${icon('x', 'w-5 h-5')}
        </button>
      </div>
    </div>
  `
}

/**
 * Render social links for a friend's profile (loaded from Firestore).
 * @param {Object|null} socialLinks - { instagram: '@user', tiktok: 'user', facebook: 'user' }
 */
function renderFriendSocialLinks(socialLinks) {
  if (!socialLinks || typeof socialLinks !== 'object') return ''
  const networks = [
    { id: 'instagram', label: 'Instagram', color: 'text-pink-400', url: 'https://instagram.com/' },
    { id: 'tiktok', label: 'TikTok', color: 'text-slate-300', url: 'https://tiktok.com/@' },
    { id: 'facebook', label: 'Facebook', color: 'text-blue-400', url: 'https://facebook.com/' },
  ]
  const links = networks
    .filter(n => socialLinks[n.id]?.replace(/^@/, '').trim())
    .map(n => {
      const username = socialLinks[n.id].replace(/^@/, '').trim()
      return `
        <a
          href="${n.url}${encodeURIComponent(username)}"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-sm ${n.color}"
        >
          ${icon(n.id === 'instagram' ? 'camera' : n.id === 'tiktok' ? 'video' : 'users', 'w-4 h-4')}
          <span class="text-white">@${escapeHTML(username)}</span>
          ${icon('external-link', 'w-3 h-3 text-slate-500')}
        </a>
      `
    })
  if (links.length === 0) return ''
  return `
    <div class="space-y-2">
      <div class="text-xs text-slate-400 font-medium">${t('socialLinks') || 'Social'}</div>
      <div class="flex flex-wrap gap-2">${links.join('')}</div>
    </div>
  `
}

function formatLastActive(dateStr) {
  try {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 5) return t('justNow')
    if (diffMins < 60) return `${diffMins}m`
    if (diffHours < 24) return `${diffHours}h`
    if (diffDays < 7) return `${diffDays}${t('daysShort')}`
    return date.toLocaleDateString()
  } catch {
    return t('offline')
  }
}

// Global handlers
window.closeFriendProfile = () => {
  window.setState?.({ showFriendProfile: false, selectedFriendProfileId: null })
}

export default { renderFriendProfileModal }

/**
 * Render profile reviews section (avis reçus + formulaire)
 */
function renderProfileReviews(state, targetUid) {
  const reviews = state.profileReviews
  const isWriting = state.showWriteReview && state.reviewTargetUid === targetUid
  const currentUid = state.currentUser?.uid

  const canReview = currentUid && currentUid !== targetUid

  return `
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <div class="text-xs text-slate-400 font-medium flex items-center gap-1">
          ${icon('message-square', 'w-3 h-3 text-slate-400')}
          ${t('profileReviews') || 'Avis'}
          ${Array.isArray(reviews) ? `<span class="text-slate-600">(${reviews.length})</span>` : ''}
        </div>
        ${canReview && !isWriting ? `
        <button
          onclick="openWriteReview('${targetUid}')"
          class="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1"
          type="button"
        >
          ${icon('edit-3', 'w-3 h-3')}
          ${t('leaveReview') || 'Laisser un avis'}
        </button>
        ` : ''}
      </div>

      ${isWriting ? renderWriteReviewForm(targetUid) : ''}

      ${!Array.isArray(reviews) ? `
        <div class="text-xs text-slate-500 text-center py-2">${t('loading') || 'Chargement...'}</div>
      ` : reviews.length === 0 ? `
        <div class="text-xs text-slate-500 text-center py-2">${t('noReviewsYet') || 'Pas encore d\'avis'}</div>
      ` : `
        <div class="space-y-2 max-h-32 overflow-y-auto">
          ${reviews.slice(0, 5).map(r => `
            <div class="bg-white/5 rounded-xl p-2.5 text-xs">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-base">${r.reviewerAvatar || '👍'}</span>
                <span class="font-medium text-slate-300">${escapeHTML(r.reviewerName || (t('defaultDisplayName') || 'Hitchhiker'))}</span>
              </div>
              ${r.comment ? `<p class="text-slate-400 leading-relaxed">${escapeHTML(r.comment)}</p>` : ''}
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `
}

function renderWriteReviewForm(targetUid) {
  return `
    <div class="bg-white/5 rounded-xl p-3 space-y-2">
      <textarea
        id="review-comment-${targetUid}"
        class="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs resize-none h-20 focus:border-primary-500/50 focus:outline-none text-slate-300"
        placeholder="${t('reviewPlaceholder') || 'Ton expérience avec cet autostoppeur...'}"
        maxlength="500"
      ></textarea>
      <div class="flex gap-2">
        <button
          type="button"
          onclick="submitProfileReview('${targetUid}', document.getElementById('review-comment-${targetUid}').value)"
          class="flex-1 py-1.5 rounded-lg bg-primary-500 text-white text-xs font-semibold hover:bg-primary-600 transition-colors"
        >${t('submit') || 'Envoyer'}</button>
        <button
          type="button"
          onclick="cancelWriteReview()"
          class="px-3 py-1.5 rounded-lg bg-white/5 text-slate-400 text-xs hover:bg-white/10 transition-colors"
        >${t('cancel') || 'Annuler'}</button>
      </div>
    </div>
  `
}
