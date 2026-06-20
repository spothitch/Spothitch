/**
 * Share Card Service
 * Generates visual share cards after check-in
 */

import { getState } from '../stores/state.js'
import { icon } from '../utils/icons.js'
import { copyToClipboard } from '../utils/share.js'
import { showToast } from './notifications.js'
import { t } from '../i18n/index.js'

const APP_URL = 'https://spothitch.com'

/**
 * Generate a visual share card for a spot
 * @param {Object} spot - Spot object
 * @returns {string} HTML string for the card
 */
export function generateShareCard(spot) {
 if (!spot) return ''

 const spotName = spot.name || spot.from || 'Spot'
 const country = spot.country || ''
 const rating = spot.globalRating?.toFixed(1) || '?'
 const waitTime = spot.avgWaitTime || '?'

 return `
 <div class="w-[400px] max-w-[90vw] p-[24px] bg-[linear-gradient(135deg,_#0f1520,_#1a2332)] rounded-[16px] text-[white] [font-family:system-ui,_-apple-system,_sans-serif] shadow-[0_20px_50px_rgba(0,_0,_0,_0.5)]" id="share-card">
 <div class="text-[24px] font-bold mb-[8px]">
 Check-in!
 </div>
 <div class="text-[18px] mb-[4px] leading-[1.4]">
 ${escapeHTML(spotName)}
 </div>
 <div class="text-[#94a3b8] text-[14px] mb-[16px]">
 ${escapeHTML(country)}
 </div>
 <div class="flex gap-[16px] mb-[16px] [flex-wrap:wrap]">
 <div class="flex items-center gap-[4px]">
 <span class="text-[#fbbf24]">⭐</span>
 <span>${rating}/5</span></div>
 <div class="flex items-center gap-[4px]">
 <span>⏱️</span>
 <span>~${waitTime} min</span></div></div>
 <div class="border-t border-t-[#334155] [padding-top:12px] text-[12px] text-[#64748b] text-center">
 SpotHitch — ${t('shareCardTagline') || 'La communauté des autostoppeurs'}
 </div></div>
 `
}

/**
 * Show share modal with visual card and share options
 * @param {Object} spot - Spot object
 */
export function showShareModal(spot) {
 if (!spot) {
 console.warn('[ShareCard] No spot provided')
 return
 }

 // Remove any existing share card modal
 const existing = document.getElementById('share-card-modal')
 if (existing) existing.remove()

 const spotName = spot.name || spot.from || 'Spot'
 const spotUrl = `${APP_URL}/?spot=${spot.id}`
 const SMSText = encodeURIComponent(
 `${t('shareCardCheckedSpot') || 'Je viens de checker un spot d\'autostop'} : ${spotName} !\n\n${spotUrl}`
 )

 const modal = document.createElement('div')
 modal.id = 'share-card-modal'
 modal.style.cssText = `
 position: fixed;
 inset: 0;
 background: rgba(0, 0, 0, 0.85);
 display: flex;
 align-items: center;
 justify-content: center;
 z-index: 10000;
 animation: fadeIn 0.2s ease-out;
 padding: 20px;
 `

 modal.innerHTML = `
 <div class="bg-[#1a2332] max-w-[500px] w-[100%] rounded-[20px] p-[24px] [animation:slideUp_0.3s_ease-out] shadow-[0_25px_50px_rgba(0,_0,_0,_0.5)]">
 <!-- Header -->
 <div class="flex justify-between items-center mb-[20px]">
 <h3 class="text-[white] text-[1.5rem] font-bold m-0">
 ${t('shareCardTitle') || 'Partager ton check-in'}
 </h3>
 <button class="bg-[rgba(255,_255,_255,_0.1)] border-0 text-[white] w-[36px] h-[36px] rounded-full cursor-pointer text-[1.5rem] leading-[1] [transition:all_0.2s]" onclick="window.closeShareModal()" onmouseover="this.style.background='rgba(255,255,255,0.2)'"
 onmouseout="this.style.background='rgba(255,255,255,0.1)'">
 ✕
 </button></div>

 <!-- Share Card Preview -->
 <div class="flex justify-center mb-[24px]">
 ${generateShareCard(spot)}
 </div>

 <!-- Capture Screenshot Hint -->
 <div class="bg-[rgba(59,_130,_246,_0.1)] border border-[rgba(59,_130,_246,_0.3)] rounded-[12px] p-[12px] mb-[20px] text-center">
 <span class="text-[#60a5fa] text-[14px]">
 ${t('shareCardScreenshotHint') || 'Fais une capture d\'écran pour partager cette carte !'}
 </span></div>

 <!-- Share Buttons -->
 <div class="grid gap-[12px] mb-[16px]">
 <!-- SMS -->
 <a class="flex items-center gap-[12px] p-[14px] bg-[#25d366] rounded-[12px] [text-decoration:none] text-[white] font-semibold [transition:all_0.2s]" href="https://wa.me/?text=${SMSText}" target="_blank" rel="noopener noreferrer" onmouseover="this.style.background='#20c05c'"
 onmouseout="this.style.background='#25d366'">
 ${icon('smartphone', 'w-6 h-6')}
 <span>${t('shareCardSMS') || 'Partager sur SMS'}</span></a>

 <!-- Copy Link -->
 <button class="flex items-center gap-[12px] p-[14px] bg-[rgba(59,_130,_246,_0.2)] border border-[rgba(59,_130,_246,_0.3)] rounded-[12px] text-[#60a5fa] font-semibold cursor-pointer w-[100%] [transition:all_0.2s]" onclick="window.copySpotLink('${spot.id}')" onmouseover="this.style.background='rgba(59, 130, 246, 0.3)'"
 onmouseout="this.style.background='rgba(59, 130, 246, 0.2)'">
 ${icon('link', 'w-6 h-6')}
 <span>${t('shareCardCopyLink') || 'Copier le lien du spot'}</span></button></div>

 <!-- Close Button -->
 <button class="w-[100%] p-[12px] bg-[rgba(255,_255,_255,_0.05)] border border-[rgba(255,_255,_255,_0.1)] rounded-[12px] text-[#94a3b8] font-semibold cursor-pointer [transition:all_0.2s]" onclick="window.closeShareModal()" onmouseover="this.style.background='rgba(255,255,255,0.1)'"
 onmouseout="this.style.background='rgba(255,255,255,0.05)'">
 ${t('close') || 'Fermer'}
 </button></div>
 `

 // Close on backdrop click
 modal.onclick = (e) => {
 if (e.target === modal) {
 closeShareModal()
 }
 }

 // Add animation styles if not already present
 if (!document.getElementById('share-card-modal-styles')) {
 const style = document.createElement('style')
 style.id = 'share-card-modal-styles'
 style.textContent = `
 @keyframes fadeIn {
 from { opacity: 0; }
 to { opacity: 1; }
 }
 @keyframes slideUp {
 from { transform: translateY(20px); opacity: 0; }
 to { transform: translateY(0); opacity: 1; }
 }
 `
 document.head.appendChild(style)
 }

 document.body.appendChild(modal)
}

/**
 * Close the share modal
 */
export function closeShareModal() {
 const modal = document.getElementById('share-card-modal')
 if (modal) {
 modal.style.animation = 'fadeOut 0.2s ease-out'
 setTimeout(() => modal.remove(), 200)
 }
}

/**
 * Copy spot link to clipboard
 * @param {string|number} spotId - Spot ID
 */
export async function copySpotLink(spotId) {
 const url = `${APP_URL}/?spot=${spotId}`
 try {
 await copyToClipboard(url)
 showToast(t('shareCardLinkCopied') || 'Lien copié dans le presse-papier !', 'success')
 } catch (err) {
 console.error('[ShareCard] Failed to copy link:', err)
 showToast(t('shareCardCopyError') || 'Erreur lors de la copie', 'error')
 }
}

/**
 * Share on SMS
 * @param {string|number} spotId - Spot ID
 */
export function shareOnSMS(spotId) {
 const { spots } = getState()
 const spot = spots.find(s => String(s.id) === String(spotId))

 if (!spot) {
 console.warn('[ShareCard] Spot not found:', spotId)
 return
 }

 const spotName = spot.name || spot.from || 'Spot'
 const spotUrl = `${APP_URL}/?spot=${spotId}`
 const text = encodeURIComponent(
 `${t('shareCardCheckedSpot') || 'Je viens de checker un spot d\'autostop'} : ${spotName} !\n\n${spotUrl}`
 )

 window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer')
}

/**
 * Escape HTML to prevent XSS
 * @param {string} str
 * @returns {string}
 */
function escapeHTML(str) {
 if (typeof str !== 'string') return ''
 const div = document.createElement('div')
 div.textContent = str
 return div.innerHTML
}

/**
 * Show share modal for a user profile
 * @param {string} uid - User UID
 * @param {string} username - Username to display
 * @param {string} avatar - Emoji avatar
 */
export function shareProfileModal(uid, username, avatar) {
 const existing = document.getElementById('share-card-modal')
 if (existing) existing.remove()

 const profileUrl = `${APP_URL}/?u=${uid}`
 const displayName = username ? `@${username}` : 'Profil SpotHitch'
 const SMSText = encodeURIComponent(
 `${avatar || 'thumbs-up'} ${t('shareProfileText') || 'Rejoins-moi sur SpotHitch, la communauté des autostoppeurs !'}\n\n${profileUrl}`
 )

 const modal = document.createElement('div')
 modal.id = 'share-card-modal'
 modal.style.cssText = `position:fixed;inset:0;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;z-index:10000;padding:20px;`
 modal.innerHTML = `
 <div class="bg-[#1a2332] max-w-[440px] w-[100%] rounded-[20px] p-[24px] shadow-[0_25px_50px_rgba(0,0,0,0.5)]">
 <div class="flex justify-between items-center mb-[20px]">
 <h3 class="text-[white] text-[1.25rem] font-bold m-0">
 ${t('shareProfile') || 'Partager mon profil'}
 </h3>
 <button class="bg-[rgba(255,255,255,0.1)] border-0 text-[white] w-[36px] h-[36px] rounded-full cursor-pointer text-[1.25rem]" onclick="window.closeShareModal()" aria-label="${escapeHTML(t('close') || 'Close')}">${icon('x', 'w-4 h-4')}</button></div>
 <div class="bg-[linear-gradient(135deg,#1e2a3a,#0f1520)] rounded-[12px] p-[20px] mb-[20px] text-center border border-[rgba(245,158,11,0.3)]">
 <div class="text-[3rem] mb-[8px]">${avatar || 'thumbs-up'}</div>
 <div class="text-[white] font-bold text-[1.1rem]">${escapeHTML(displayName)}</div>
 <div class="text-[#64748b] text-[0.75rem] mt-[6px] [word-break:break-all]">${profileUrl}</div></div>
 <div class="grid gap-[12px] mb-[12px]">
 <a class="flex items-center gap-[12px] p-[14px] bg-[#25d366] rounded-[12px] [text-decoration:none] text-[white] font-semibold" href="https://wa.me/?text=${SMSText}" target="_blank" rel="noopener noreferrer">
 ${icon('smartphone', 'w-6 h-6')}<span>${t('shareCardSMS') || 'Partager sur SMS'}</span></a>
 <button class="flex items-center gap-[12px] p-[14px] bg-[rgba(59,130,246,0.2)] border border-[rgba(59,130,246,0.3)] rounded-[12px] text-[#60a5fa] font-semibold cursor-pointer w-[100%]" onclick="window.copyProfileLink('${escapeHTML(uid)}')">
 ${icon('link', 'w-6 h-6')}<span>${t('copyProfileLink') || 'Copier le lien du profil'}</span></button></div>
 <button class="w-[100%] p-[12px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-[12px] text-[#94a3b8] font-semibold cursor-pointer" onclick="window.closeShareModal()">
 ${t('close') || 'Fermer'}
 </button></div>
 `
 modal.onclick = (e) => { if (e.target === modal) closeShareModal() }
 document.body.appendChild(modal)
}

/**
 * Copy profile link to clipboard
 */
export async function copyProfileLink(uid) {
 const url = `${APP_URL}/?u=${uid}`
 try {
 await copyToClipboard(url)
 showToast(t('shareCardLinkCopied') || 'Lien copié !', 'success')
 } catch {
 showToast(t('shareCardCopyError') || 'Erreur lors de la copie', 'error')
 }
}

// Global handlers
if (typeof window !== 'undefined') {
 window.closeShareModal = closeShareModal
 window.copySpotLink = copySpotLink
 window.shareOnSMS = shareOnSMS
 window.copyProfileLink = copyProfileLink
}

export default {
 generateShareCard,
 showShareModal,
 closeShareModal,
 copySpotLink,
 shareOnSMS,
 shareProfileModal,
 copyProfileLink,
}
