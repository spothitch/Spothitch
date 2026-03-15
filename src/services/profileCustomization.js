/**
 * Profile Customization Service
 * Custom frames, titles, and profile personalization
 */

import { getState, setState } from '../stores/state.js';
import { showToast } from './notifications.js';
import { t } from '../i18n/index.js';
import { icon } from '../utils/icons.js'

// Profile frames collection
export const PROFILE_FRAMES = {
  default: {
    id: 'default',
    name: () => t('profileFrameStandard') || 'Standard',
    description: () => t('profileFrameDefaultDesc') || 'Cadre par défaut',
    rarity: 'common',
    css: '',
    unlockMethod: 'default',
  },
  explorer: {
    id: 'explorer',
    name: () => t('profileFrameExplorer') || 'Explorateur',
    description: () => t('profileFrameExplorerDesc') || 'Pour les aventuriers dans l\'âme',
    rarity: 'common',
    css: 'ring-4 ring-blue-400 ring-opacity-50',
    gradient: 'from-blue-500 to-cyan-400',
    unlockMethod: 'level_5',
  },
  social_butterfly: {
    id: 'social_butterfly',
    name: () => t('profileFrameSocialButterfly') || 'Papillon social',
    description: () => t('profileFrameSocialButterflyDesc') || 'Tu aimes rencontrer du monde',
    rarity: 'uncommon',
    css: 'ring-4 ring-purple-400 ring-opacity-50',
    gradient: 'from-purple-500 to-pink-400',
    unlockMethod: 'friends_10',
  },
  verified: {
    id: 'verified',
    name: () => t('profileFrameVerified') || 'Vérifié',
    description: () => t('profileFrameVerifiedDesc') || 'Membre de confiance',
    rarity: 'uncommon',
    css: 'ring-4 ring-emerald-400 ring-opacity-50',
    gradient: 'from-emerald-500 to-green-400',
    unlockMethod: 'trust_score_80',
  },
  globe_trotter: {
    id: 'globe_trotter',
    name: () => t('profileFrameGlobeTrotter') || 'Globe-trotter',
    description: () => t('profileFrameGlobeTrotterDesc') || 'Tu as voyagé dans 5+ pays',
    rarity: 'rare',
    css: 'ring-4 ring-amber-400 ring-opacity-50 animate-pulse-slow',
    gradient: 'from-amber-500 to-orange-400',
    unlockMethod: 'countries_5',
  },
  veteran: {
    id: 'veteran',
    name: () => t('profileFrameVeteran') || 'Vétéran',
    description: () => t('profileFrameVeteranDesc') || '1 an sur SpotHitch',
    rarity: 'rare',
    css: 'ring-4 ring-slate-400 ring-opacity-50',
    gradient: 'from-slate-500 to-slate-400',
    unlockMethod: 'account_age_365',
  },
  influencer: {
    id: 'influencer',
    name: () => t('profileFrameInfluencer') || 'Influenceur',
    description: () => t('profileFrameInfluencerDesc') || '100+ avis publiés',
    rarity: 'epic',
    css: 'ring-4 ring-pink-400 animate-pulse',
    gradient: 'from-pink-500 to-rose-400',
    unlockMethod: 'reviews_100',
  },
  champion: {
    id: 'champion',
    name: () => t('profileFrameChampion') || 'Champion',
    description: () => t('profileFrameChampionDesc') || 'Top 10 du classement',
    rarity: 'epic',
    css: 'ring-4 ring-yellow-400 animate-pulse',
    gradient: 'from-yellow-500 to-amber-400',
    unlockMethod: 'leaderboard_top10',
  },
  legend: {
    id: 'legend',
    name: () => t('profileFrameLegend') || 'Légende',
    description: () => t('profileFrameLegendDesc') || 'Statut légendaire',
    rarity: 'legendary',
    css: 'ring-4 ring-gradient animate-gradient-border',
    gradient: 'from-purple-500 via-pink-500 to-orange-400',
    animated: true,
    unlockMethod: 'skill_legend',
  },
  founder: {
    id: 'founder',
    name: () => t('profileFrameFounder') || 'Fondateur',
    description: () => t('profileFrameFounderDesc') || 'Membre depuis le début',
    rarity: 'legendary',
    css: 'ring-4 ring-gradient-gold',
    gradient: 'from-yellow-400 via-amber-500 to-yellow-400',
    animated: true,
    unlockMethod: 'special',
  },
};

// Profile titles collection
export const PROFILE_TITLES = {
  hitchhiker: {
    id: 'hitchhiker',
    name: () => t('profileTitleHitchhiker') || 'Autostoppeur',
    color: 'text-slate-400',
    unlockMethod: 'default',
  },
  adventurer: {
    id: 'adventurer',
    name: () => t('profileTitleAdventurer') || 'Aventurier',
    color: 'text-blue-400',
    unlockMethod: 'spots_10',
  },
  wanderer: {
    id: 'wanderer',
    name: () => t('profileTitleWanderer') || 'Vagabond',
    color: 'text-emerald-400',
    unlockMethod: 'distance_500',
  },
  nomad: {
    id: 'nomad',
    name: () => t('profileTitleNomad') || 'Nomade',
    color: 'text-purple-400',
    unlockMethod: 'countries_3',
  },
  pathfinder: {
    id: 'pathfinder',
    name: () => t('profileTitlePathfinder') || 'Éclaireur',
    color: 'text-cyan-400',
    unlockMethod: 'spots_created_5',
  },
  guide: {
    id: 'guide',
    name: () => t('profileTitleGuide') || 'Guide',
    color: 'text-amber-400',
    unlockMethod: 'reviews_50',
  },
  mentor: {
    id: 'mentor',
    name: () => t('profileTitleMentor') || 'Mentor',
    color: 'text-pink-400',
    unlockMethod: 'skill_mentor',
  },
  road_master: {
    id: 'road_master',
    name: () => t('profileTitleRoadMaster') || 'Maître de la route',
    color: 'text-orange-400',
    unlockMethod: 'skill_road_master',
  },
  legend: {
    id: 'legend',
    name: () => t('profileTitleLegend') || 'Légende',
    color: 'text-gradient-legend',
    animated: true,
    unlockMethod: 'skill_legend',
  },
  pioneer: {
    id: 'pioneer',
    name: () => t('profileTitlePioneer') || 'Pionnier',
    color: 'text-yellow-400',
    unlockMethod: 'special',
  },
};

// Avatar borders (separate from frames)
export const AVATAR_BORDERS = {
  none: { id: 'none', name: () => t('profileBorderNone') || 'Aucun', css: '' },
  thin: { id: 'thin', name: () => t('profileBorderThin') || 'Fin', css: 'ring-2 ring-white/20' },
  thick: { id: 'thick', name: () => t('profileBorderThick') || 'Épais', css: 'ring-4 ring-white/30' },
  glow: { id: 'glow', name: () => t('profileBorderGlow') || 'Brillant', css: 'ring-2 ring-primary-400 shadow-lg shadow-primary-500/50' },
};

// Rarity colors
export const RARITY_COLORS = {
  common: { bg: 'bg-slate-500/20', text: 'text-slate-400', label: () => t('profileRarityCommon') || 'Commun' },
  uncommon: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: () => t('profileRarityUncommon') || 'Peu commun' },
  rare: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: () => t('profileRarityRare') || 'Rare' },
  epic: { bg: 'bg-purple-500/20', text: 'text-purple-400', label: () => t('profileRarityEpic') || 'Épique' },
  legendary: { bg: 'bg-amber-500/20', text: 'text-amber-400', label: () => t('profileRarityLegendary') || 'Légendaire' },
};

/**
 * Get user's unlocked frames
 * @returns {string[]}
 */
export function getUnlockedFrames() {
  const state = getState();
  return state.unlockedFrames || ['default'];
}

/**
 * Get user's unlocked titles
 * @returns {string[]}
 */
export function getUnlockedTitles() {
  const state = getState();
  return state.unlockedTitles || ['hitchhiker'];
}

/**
 * Get current equipped frame
 * @returns {string}
 */
export function getCurrentFrame() {
  const state = getState();
  return state.equippedFrame || 'default';
}

/**
 * Get current equipped title
 * @returns {string}
 */
export function getCurrentTitle() {
  const state = getState();
  return state.equippedTitle || 'hitchhiker';
}

/**
 * Equip a frame
 * @param {string} frameId
 * @returns {boolean}
 */
export function equipFrame(frameId) {
  const unlockedFrames = getUnlockedFrames();

  if (!unlockedFrames.includes(frameId)) {
    showToast(t('profileFrameNotUnlocked') || 'Ce cadre n\'est pas débloqué', 'warning');
    return false;
  }

  setState({ equippedFrame: frameId });
  const frameName = typeof PROFILE_FRAMES[frameId]?.name === 'function' ? PROFILE_FRAMES[frameId].name() : PROFILE_FRAMES[frameId]?.name;
  showToast(`${t('profileFrameEquipped') || 'Cadre'} "${frameName}" ${t('profileEquipped') || 'équipé'} !`, 'success');
  return true;
}

/**
 * Equip a title
 * @param {string} titleId
 * @returns {boolean}
 */
export function equipTitle(titleId) {
  const unlockedTitles = getUnlockedTitles();

  if (!unlockedTitles.includes(titleId)) {
    showToast(t('profileTitleNotUnlocked') || 'Ce titre n\'est pas débloqué', 'warning');
    return false;
  }

  setState({ equippedTitle: titleId });
  const titleName = typeof PROFILE_TITLES[titleId]?.name === 'function' ? PROFILE_TITLES[titleId].name() : PROFILE_TITLES[titleId]?.name;
  showToast(`${t('profileTitle') || 'Titre'} "${titleName}" ${t('profileEquipped') || 'équipé'} !`, 'success');
  return true;
}

/**
 * Unlock a frame
 * @param {string} frameId
 */
export function unlockFrame(frameId) {
  const state = getState();
  const unlockedFrames = state.unlockedFrames || ['default'];

  if (!unlockedFrames.includes(frameId)) {
    unlockedFrames.push(frameId);
    setState({ unlockedFrames });

    const frame = PROFILE_FRAMES[frameId];
    const frameName = typeof frame?.name === 'function' ? frame.name() : frame?.name;
    showToast(`🖼️ ${t('profileFrameUnlocked') || 'Nouveau cadre débloqué'}: ${frameName}`, 'success');
  }
}

/**
 * Unlock a title
 * @param {string} titleId
 */
export function unlockTitle(titleId) {
  const state = getState();
  const unlockedTitles = state.unlockedTitles || ['hitchhiker'];

  if (!unlockedTitles.includes(titleId)) {
    unlockedTitles.push(titleId);
    setState({ unlockedTitles });

    const title = PROFILE_TITLES[titleId];
    const titleName = typeof title?.name === 'function' ? title.name() : title?.name;
    showToast(`🏆 ${t('profileTitleUnlocked') || 'Nouveau titre débloqué'}: ${titleName}`, 'success');
  }
}

/**
 * Check and unlock based on achievements
 * @param {Object} stats - User statistics
 */
export function checkUnlocks(stats) {
  const {
    level,
    friendsCount,
    trustScore,
    countriesCount,
    accountAgeDays,
    reviewsCount,
    spotsCreated,
    totalDistance,
  } = stats;

  // Check frames
  if (level >= 5) unlockFrame('explorer');
  if (friendsCount >= 10) unlockFrame('social_butterfly');
  if (trustScore >= 80) unlockFrame('verified');
  if (countriesCount >= 5) unlockFrame('globe_trotter');
  if (accountAgeDays >= 365) unlockFrame('veteran');
  if (reviewsCount >= 100) unlockFrame('influencer');

  // Check titles
  if (spotsCreated >= 5) unlockTitle('pathfinder');
  if (reviewsCount >= 50) unlockTitle('guide');
  if (totalDistance >= 500) unlockTitle('wanderer');
  if (countriesCount >= 3) unlockTitle('nomad');
}

/**
 * Render avatar with frame
 * @param {Object} options
 * @returns {string}
 */
export function renderAvatarWithFrame(options = {}) {
  const {
    avatar = '🤙',
    frameId = getCurrentFrame(),
    size = 'md',
    showBorder = true,
  } = options;

  const frame = PROFILE_FRAMES[frameId] || PROFILE_FRAMES.default;
  const sizeClasses = {
    sm: 'w-10 h-10 text-xl',
    md: 'w-16 h-16 text-3xl',
    lg: 'w-24 h-24 text-5xl',
    xl: 'w-32 h-32 text-6xl',
  };

  const borderCss = showBorder ? frame.css : '';

  return `
    <div class="relative inline-block">
      ${frame.gradient ? `
        <div class="absolute inset-0 bg-gradient-to-br ${frame.gradient} rounded-full blur-md opacity-50 ${frame.animated ? 'animate-pulse' : ''}"></div>
      ` : ''}
      <div class="relative ${sizeClasses[size]} rounded-full bg-dark-card flex items-center justify-center ${borderCss}">
        <span>${avatar}</span>
      </div>
    </div>
  `;
}

/**
 * Render title badge
 * @param {string} titleId
 * @returns {string}
 */
export function renderTitleBadge(titleId = getCurrentTitle()) {
  const title = PROFILE_TITLES[titleId] || PROFILE_TITLES.hitchhiker;

  return `
    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${title.color} bg-white/10">
      ${title.name}
    </span>
  `;
}

/**
 * Render profile customization modal
 * @param {Object} state
 * @returns {string}
 */
export function renderCustomizationModal(state) {
  if (!state.showProfileCustomization) return ''

  const { escapeHTML } = window._sanitize || { escapeHTML: s => s }
  const bio = state.bio || ''
  const username = state.username || ''
  const photoURL = state.user?.photoURL || state.userProfile?.photoURL || ''
  const gallery = (() => { try { return JSON.parse(localStorage.getItem('spothitch_gallery') || '[]') } catch { return [] } })()
  const langs = (() => { try { return JSON.parse(localStorage.getItem('spothitch_languages') || '[]') } catch { return [] } })()

  // Available avatars from gallery + Google photo
  const availablePhotos = []
  if (photoURL) availablePhotos.push(photoURL)
  gallery.forEach(url => { if (url && !availablePhotos.includes(url)) availablePhotos.push(url) })

  const svgUser = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#3b82f6" stroke-width="1.8"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
  const svgCamera = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#f59e0b" stroke-width="1.8"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>'
  const svgPen = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#22c55e" stroke-width="1.8"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>'
  const svgGlobe = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#a855f7" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>'

  return `
    <div
      class="fixed inset-0 bg-black/80 z-50 flex items-end sm:items-center justify-center"
      onclick="if(event.target===this)closeProfileCustomization()"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-customization-title"
    >
      <div class="bg-dark-card w-full sm:max-w-lg max-h-[90vh] rounded-t-3xl sm:rounded-2xl overflow-hidden">
        <!-- Header -->
        <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid rgba(255,255,255,0.06)">
          <h2 id="profile-customization-title" style="font-size:16px;font-weight:600;color:#e2e8f0">${t('editProfile') || 'Modifier le profil'}</h2>
          <button
            onclick="closeProfileCustomization()"
            style="width:32px;height:32px;background:rgba(255,255,255,0.05);display:flex;align-items:center;justify-content:center;border:none;cursor:pointer;color:#64748b;border-radius:50%"
            aria-label="${t('close') || 'Fermer'}"
          >
            ${icon('x', 'w-5 h-5')}
          </button>
        </div>

        <div style="overflow-y:auto;max-height:calc(90vh - 60px);padding:20px">

          <!-- Photo de profil -->
          <div style="text-align:center;margin-bottom:24px">
            <div style="width:80px;height:80px;border-radius:50%;margin:0 auto 12px;background:linear-gradient(135deg,#f59e0b,#d97706);padding:3px">
              <div id="edit-avatar-preview" style="width:100%;height:100%;border-radius:50%;background:#0f1520;display:flex;align-items:center;justify-content:center;font-size:36px;overflow:hidden">
                ${photoURL ? `<img src="${photoURL}" style="width:100%;height:100%;object-fit:cover" alt="">` : (state.avatar || '🤙')}
              </div>
            </div>
            ${availablePhotos.length > 0 ? `
              <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-bottom:8px">
                ${availablePhotos.map((url, i) => `
                  <button type="button" onclick="selectProfilePhoto(${i})"
                    style="width:44px;height:44px;border-radius:50%;border:2px solid ${url === photoURL ? '#f59e0b' : 'rgba(255,255,255,0.1)'};overflow:hidden;cursor:pointer;padding:0;background:none">
                    <img src="${url}" style="width:100%;height:100%;object-fit:cover" alt="">
                  </button>
                `).join('')}
              </div>
            ` : ''}
            <button type="button" onclick="uploadProfilePhoto()"
              style="font-size:12px;color:#f59e0b;background:none;border:none;cursor:pointer;display:inline-flex;align-items:center;gap:4px">
              ${svgCamera} ${t('changePhoto') || 'Changer la photo'}
            </button>
          </div>

          <!-- Pseudo -->
          <div style="margin-bottom:20px">
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px">
              ${svgUser}
              <span style="font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px">${t('username') || 'Pseudo'}</span>
            </div>
            <div style="display:flex;gap:8px;align-items:center">
              <span style="color:#475569;font-size:16px">@</span>
              <input type="text" id="edit-username" value="${escapeHTML(username)}"
                style="flex:1;background:transparent;border:none;border-bottom:1px solid #334155;padding:8px 0;color:#e2e8f0;font-size:15px;outline:none"
                placeholder="${t('usernamePlaceholder') || 'ton_pseudo'}"
                maxlength="20"
              />
            </div>
            <p style="font-size:10px;color:#475569;margin-top:4px">${t('usernameHint') || '3 à 20 caractères, lettres et chiffres'}</p>
          </div>

          <!-- Bio -->
          <div style="margin-bottom:20px">
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px">
              ${svgPen}
              <span style="font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px">${t('bio') || 'Bio'}</span>
            </div>
            <textarea id="edit-bio"
              style="width:100%;background:transparent;border:none;border-bottom:1px solid #334155;padding:8px 0;color:#e2e8f0;font-size:14px;outline:none;resize:none;min-height:60px;font-family:inherit"
              placeholder="${t('bioPlaceholder') || 'Quelques mots sur toi...'}"
              maxlength="200"
            >${escapeHTML(bio)}</textarea>
            <div style="text-align:right;font-size:10px;color:#475569;margin-top:2px">
              <span id="edit-bio-count">${bio.length}</span>/200
            </div>
          </div>

          <!-- Langues -->
          <div style="margin-bottom:20px">
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px">
              ${svgGlobe}
              <span style="font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px">${t('languages') || 'Langues'}</span>
            </div>
            ${langs.length > 0 ? `
              <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px">
                ${langs.map((l, i) => `
                  <span style="display:inline-flex;align-items:center;gap:4px;padding:4px 10px;font-size:12px;background:rgba(255,255,255,0.05);border-radius:20px;color:#94a3b8">
                    ${l.flag || ''} ${escapeHTML(l.name || '')}
                    <button type="button" onclick="removeEditLanguage(${i})"
                      style="background:none;border:none;color:#64748b;cursor:pointer;padding:0;font-size:14px;line-height:1">×</button>
                  </span>
                `).join('')}
              </div>
            ` : ''}
            <button type="button" onclick="openLanguagePicker()"
              style="font-size:12px;color:#a855f7;background:none;border:none;cursor:pointer;display:inline-flex;align-items:center;gap:4px">
              ${icon('plus', 'w-3.5 h-3.5')} ${t('addLanguage') || 'Ajouter une langue'}
            </button>
          </div>

          <!-- Save button -->
          <button type="button" onclick="saveProfileEdits()"
            style="width:100%;padding:14px;background:#f59e0b;border:none;color:#0f1520;font-size:14px;font-weight:600;cursor:pointer;border-radius:10px;margin-top:8px">
            ${t('save') || 'Enregistrer'}
          </button>
        </div>
      </div>
    </div>
  `
}

/**
 * Get human-readable unlock condition for a frame
 */
function getFrameUnlockText(method) {
  const texts = {
    default: () => t('profileUnlockDefault') || 'Disponible',
    level_5: () => t('profileUnlockLevel5') || 'Niveau 5',
    level_10: () => t('profileUnlockLevel10') || 'Niveau 10',
    level_20: () => t('profileUnlockLevel20') || 'Niveau 20',
    friends_10: () => t('profileUnlockFriends10') || '10 amis',
    trust_score_80: () => t('profileUnlockTrust80') || 'Score confiance 80+',
    countries_5: () => t('profileUnlockCountries5') || '5 pays visites',
    account_age_365: () => t('profileUnlockAge365') || '1 an de compte',
    reviews_100: () => t('profileUnlockReviews100') || '100 avis',
    leaderboard_top10: () => t('profileUnlockTop10') || 'Top 10 classement',
    level_50: () => t('profileUnlockLevel50') || 'Niveau 50',
    all_badges: () => t('profileUnlockAllBadges') || 'Tous les badges',
  }
  const textFunc = texts[method];
  return textFunc ? textFunc() : (method?.replace(/_/g, ' ') || '?')
}

// Lazy-load escapeHTML for the modal
import('../utils/sanitize.js').then(m => { window._sanitize = m }).catch(() => {})

// ==================== PROFILE EDIT HANDLERS ====================

window.saveProfileEdits = async () => {
  const username = document.getElementById('edit-username')?.value.trim()
  const bio = document.getElementById('edit-bio')?.value.trim() || ''

  if (username && username.length >= 3 && username.length <= 20) {
    const { setState: setStateFn, getState: getStateFn } = await import('../stores/state.js')
    const currentUsername = getStateFn().username
    if (username !== currentUsername) {
      // Check availability + reserve
      try {
        const { updateUserProfile, getCurrentUser } = await import('./firebase.js')
        const user = getCurrentUser()
        if (user) {
          await updateUserProfile(user.uid, { username, displayName: username })
        }
        setStateFn({ username })
        try { localStorage.setItem('spothitch_username', username) } catch { /* no-op */ }
      } catch (e) {
        const { showError } = await import('./notifications.js')
        showError(t('usernameError') || 'Erreur lors du changement de pseudo')
        return
      }
    }
    // Save bio
    try { localStorage.setItem('spothitch_bio', bio) } catch { /* no-op */ }
    setStateFn({ bio })
    try {
      const { updateUserProfile, getCurrentUser } = await import('./firebase.js')
      const user = getCurrentUser()
      if (user) await updateUserProfile(user.uid, { bio })
    } catch { /* offline */ }

    setStateFn({ showProfileCustomization: false })
    const { showSuccess } = await import('./notifications.js')
    showSuccess(t('profileSaved') || 'Profil enregistré')
  } else {
    const { showError } = await import('./notifications.js')
    showError(t('usernameInvalid') || 'Pseudo : 3 à 20 caractères')
  }
}

window.selectProfilePhoto = async (index) => {
  const gallery = (() => { try { return JSON.parse(localStorage.getItem('spothitch_gallery') || '[]') } catch { return [] } })()
  const photoURL = getState().user?.photoURL
  const all = []
  if (photoURL) all.push(photoURL)
  gallery.forEach(url => { if (url && !all.includes(url)) all.push(url) })
  const selected = all[index]
  if (!selected) return
  try {
    const { updateUserProfile, getCurrentUser } = await import('./firebase.js')
    const user = getCurrentUser()
    if (user) await updateUserProfile(user.uid, { photoURL: selected })
    setState({ userProfile: { ...getState().userProfile, photoURL: selected } })
    // Update preview
    const preview = document.getElementById('edit-avatar-preview')
    if (preview) preview.innerHTML = `<img src="${selected}" style="width:100%;height:100%;object-fit:cover" alt="">`
    showToast(t('photoUpdated') || 'Photo mise à jour', 'success')
  } catch { /* offline */ }
}

window.uploadProfilePhoto = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const { uploadImage, getCurrentUser } = await import('./firebase.js')
      const user = getCurrentUser()
      if (!user) return
      const path = `avatars/${user.uid}_${Date.now()}.jpg`
      const result = await uploadImage(file, path)
      if (result.success) {
        const { updateUserProfile } = await import('./firebase.js')
        await updateUserProfile(user.uid, { photoURL: result.url })
        setState({ userProfile: { ...getState().userProfile, photoURL: result.url } })
        const preview = document.getElementById('edit-avatar-preview')
        if (preview) preview.innerHTML = `<img src="${result.url}" style="width:100%;height:100%;object-fit:cover" alt="">`
        showToast(t('photoUpdated') || 'Photo mise à jour', 'success')
      }
    } catch {
      showToast(t('photoError') || 'Erreur photo', 'error')
    }
  }
  input.click()
}

window.removeEditLanguage = (index) => {
  try {
    const langs = JSON.parse(localStorage.getItem('spothitch_languages') || '[]')
    langs.splice(index, 1)
    localStorage.setItem('spothitch_languages', JSON.stringify(langs))
    setState({ showProfileCustomization: getState().showProfileCustomization }) // re-render
  } catch { /* no-op */ }
}

// Bio character counter
document.addEventListener('input', (e) => {
  if (e.target.id === 'edit-bio') {
    const count = document.getElementById('edit-bio-count')
    if (count) count.textContent = e.target.value.length
  }
})

// openProfileCustomization/closeProfileCustomization defined in main.js (canonical STUB)
window.equipFrame = equipFrame;
window.equipTitle = equipTitle;

export default {
  PROFILE_FRAMES,
  PROFILE_TITLES,
  AVATAR_BORDERS,
  RARITY_COLORS,
  getUnlockedFrames,
  getUnlockedTitles,
  getCurrentFrame,
  getCurrentTitle,
  equipFrame,
  equipTitle,
  unlockFrame,
  unlockTitle,
  checkUnlocks,
  renderAvatarWithFrame,
  renderTitleBadge,
  renderCustomizationModal,
};
