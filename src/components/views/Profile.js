/**
 * Profile View Component
 * Instagram-style profile with 3 sub-tabs: Profil, Roadmap, Réglages
 */

import { t } from '../../i18n/index.js'
import { renderDonationCard } from '../ui/DonationCard.js'
import { renderVerifiedCheckmark, getUserTrustScore } from '../../services/trustScore.js'
import { icon } from '../../utils/icons.js'
import { renderEmptyState } from '../EmptyState.js'
import { renderToggle } from '../../utils/toggle.js'
import { getVipLevel } from '../../data/vip-levels.js'
import { allBadges } from '../../data/badges.js'
import { escapeHTML, escapeJSString } from '../../utils/sanitize.js'
import { FEATURES_DATA } from '../../data/featuresData.js'
import { getVoteTotals, getFeatureComments } from '../../services/featureVotes.js'
import { getSpotFreshness } from '../../services/spotFreshness.js'
import './ProfileDemos.js' // Interactive demo overlays for Prochainement features

// ==================== FIRESTORE PROFILE SYNC ====================

/**
 * Sync a subset of profile fields to Firestore (if user is logged in).
 * Silently fails when offline or not authenticated — localStorage is always the fallback.
 * @param {Object} fields - e.g. { bio: '...', socialLinks: {...}, languages: [...] }
 */
async function syncProfileToFirestore(fields) {
  try {
    const { getCurrentUser, updateUserProfile } = await import('../../services/firebase.js')
    const user = getCurrentUser()
    if (user) {
      await updateUserProfile(user.uid, fields)
    }
  } catch { /* offline or not logged in */ }
}

// ==================== LANGUAGE + COUNTRY MAPS ====================

const LANG_FLAG_MAP = {
  'Français': '🇫🇷', 'French': '🇫🇷',
  'English': '🇬🇧', 'Anglais': '🇬🇧',
  'Español': '🇪🇸', 'Spanish': '🇪🇸', 'Espagnol': '🇪🇸',
  'Deutsch': '🇩🇪', 'German': '🇩🇪', 'Allemand': '🇩🇪',
  'Português': '🇵🇹', 'Portuguese': '🇵🇹', 'Portugais': '🇵🇹',
  'Italiano': '🇮🇹', 'Italian': '🇮🇹', 'Italien': '🇮🇹',
  'Русский': '🇷🇺', 'Russian': '🇷🇺', 'Russe': '🇷🇺',
  'العربية': '🇸🇦', 'Arabic': '🇸🇦', 'Arabe': '🇸🇦',
  '中文': '🇨🇳', 'Chinese': '🇨🇳', 'Chinois': '🇨🇳',
  '日本語': '🇯🇵', 'Japanese': '🇯🇵', 'Japonais': '🇯🇵',
  'हिन्दी': '🇮🇳', 'Hindi': '🇮🇳',
  'Nederlands': '🇳🇱', 'Dutch': '🇳🇱', 'Néerlandais': '🇳🇱',
  'Polski': '🇵🇱', 'Polish': '🇵🇱', 'Polonais': '🇵🇱',
  'Română': '🇷🇴', 'Romanian': '🇷🇴', 'Roumain': '🇷🇴',
  'Türkçe': '🇹🇷', 'Turkish': '🇹🇷', 'Turc': '🇹🇷',
  'Svenska': '🇸🇪', 'Swedish': '🇸🇪', 'Suédois': '🇸🇪',
  'Norsk': '🇳🇴', 'Norwegian': '🇳🇴', 'Norvégien': '🇳🇴',
  'Dansk': '🇩🇰', 'Danish': '🇩🇰', 'Danois': '🇩🇰',
  'Suomi': '🇫🇮', 'Finnish': '🇫🇮', 'Finnois': '🇫🇮',
  'Čeština': '🇨🇿', 'Czech': '🇨🇿', 'Tchèque': '🇨🇿',
  'Magyar': '🇭🇺', 'Hungarian': '🇭🇺', 'Hongrois': '🇭🇺',
  'Ελληνικά': '🇬🇷', 'Greek': '🇬🇷', 'Grec': '🇬🇷',
  'Українська': '🇺🇦', 'Ukrainian': '🇺🇦', 'Ukrainien': '🇺🇦',
}

const COUNTRY_MAP = {
  'FR': { flag: '🇫🇷', name: 'France' }, 'DE': { flag: '🇩🇪', name: 'Allemagne' },
  'ES': { flag: '🇪🇸', name: 'Espagne' }, 'IT': { flag: '🇮🇹', name: 'Italie' },
  'PT': { flag: '🇵🇹', name: 'Portugal' }, 'GB': { flag: '🇬🇧', name: 'Royaume-Uni' },
  'BE': { flag: '🇧🇪', name: 'Belgique' }, 'NL': { flag: '🇳🇱', name: 'Pays-Bas' },
  'CH': { flag: '🇨🇭', name: 'Suisse' }, 'AT': { flag: '🇦🇹', name: 'Autriche' },
  'PL': { flag: '🇵🇱', name: 'Pologne' }, 'CZ': { flag: '🇨🇿', name: 'Tchéquie' },
  'HU': { flag: '🇭🇺', name: 'Hongrie' }, 'RO': { flag: '🇷🇴', name: 'Roumanie' },
  'SE': { flag: '🇸🇪', name: 'Suède' }, 'NO': { flag: '🇳🇴', name: 'Norvège' },
  'DK': { flag: '🇩🇰', name: 'Danemark' }, 'FI': { flag: '🇫🇮', name: 'Finlande' },
  'GR': { flag: '🇬🇷', name: 'Grèce' }, 'TR': { flag: '🇹🇷', name: 'Turquie' },
  'HR': { flag: '🇭🇷', name: 'Croatie' }, 'RS': { flag: '🇷🇸', name: 'Serbie' },
  'SK': { flag: '🇸🇰', name: 'Slovaquie' }, 'SI': { flag: '🇸🇮', name: 'Slovénie' },
  'BG': { flag: '🇧🇬', name: 'Bulgarie' }, 'UA': { flag: '🇺🇦', name: 'Ukraine' },
  'RU': { flag: '🇷🇺', name: 'Russie' }, 'MA': { flag: '🇲🇦', name: 'Maroc' },
  'US': { flag: '🇺🇸', name: 'États-Unis' }, 'CA': { flag: '🇨🇦', name: 'Canada' },
  'MX': { flag: '🇲🇽', name: 'Mexique' }, 'BR': { flag: '🇧🇷', name: 'Brésil' },
  'AR': { flag: '🇦🇷', name: 'Argentine' }, 'AU': { flag: '🇦🇺', name: 'Australie' },
  'JP': { flag: '🇯🇵', name: 'Japon' }, 'CN': { flag: '🇨🇳', name: 'Chine' },
  'IN': { flag: '🇮🇳', name: 'Inde' }, 'GE': { flag: '🇬🇪', name: 'Géorgie' },
  'AM': { flag: '🇦🇲', name: 'Arménie' }, 'AZ': { flag: '🇦🇿', name: 'Azerbaïdjan' },
  'EE': { flag: '🇪🇪', name: 'Estonie' }, 'LV': { flag: '🇱🇻', name: 'Lettonie' },
  'LT': { flag: '🇱🇹', name: 'Lituanie' },
}

function normalizeLangs(raw) {
  return raw.map(l =>
    typeof l === 'string'
      ? { name: l, flag: LANG_FLAG_MAP[l] || '🌐', level: 'courant' }
      : { name: l.name || '?', flag: l.flag || LANG_FLAG_MAP[l.name] || '🌐', level: l.level || 'courant' }
  )
}

// ==================== MAIN RENDER ====================

export function renderProfile(state) {
  const subTab = state.profileSubTab || 'profil'

  return `
    <div class="flex flex-col min-h-[calc(100vh-140px)] pb-28 overflow-x-hidden">
      ${renderProfileSubTabs(subTab)}
      <div class="p-4 space-y-4 flex-1">
        ${subTab === 'profil' ? renderProfilTab(state) : ''}
        ${subTab === 'progression' ? renderRoadmapTab(state) : ''}
        ${subTab === 'reglages' ? `${renderReglagesTab(state)}${renderVersionReset()}` : ''}
      </div>
    </div>
    ${state.showLanguagePicker ? renderLanguagePickerModal(state) : ''}
    ${state.showLanguageLevelPicker ? renderLanguageLevelModal(state) : ''}
  `
}

function renderLanguagePickerModal(state) {
  const search = (state.langPickerSearch || '').toLowerCase()
  const filtered = POPULAR_LANGUAGES.filter(l => l.toLowerCase().includes(search))
  return `
    <div class="fixed inset-0 z-50 bg-black/80 flex items-end sm:items-center justify-center" role="dialog" aria-modal="true" onclick="if(event.target===this)closeLanguagePicker()">
      <div class="bg-dark-secondary rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[80vh] flex flex-col">
        <div class="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 class="font-bold">${t('addLanguage') || 'Ajouter une langue'}</h3>
          <button onclick="closeLanguagePicker()" class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center" aria-label="${escapeHTML(t('close') || 'Close')}">${icon('x', 'w-4 h-4')}</button>
        </div>
        <div class="p-3 border-b border-white/10">
          <input type="text" placeholder="${t('searchLanguage') || 'Rechercher...'}" class="input-field w-full text-sm" oninput="langPickerFilter(this.value)" value="${state.langPickerSearch || ''}" autofocus />
        </div>
        <div class="flex-1 overflow-y-auto p-2 space-y-1">
          ${filtered.map(lang => `
            <button onclick="selectLanguageFromPicker('${lang}')" class="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-colors text-left">
              <span class="text-xl">${LANG_FLAG_MAP[lang] || '🌐'}</span>
              <span class="text-sm font-medium">${lang}</span>
            </button>
          `).join('')}
          ${filtered.length === 0 ? `<p class="text-center text-slate-500 py-4 text-sm">${t('noResults') || 'Aucun résultat'}</p>` : ''}
        </div>
      </div>
    </div>
  `
}

function renderLanguageLevelModal(state) {
  const name = state.langPickerSelectedName || ''
  const levels = [
    { id: 'debutant', label: t('langLevelDebutant') || 'Débutant', desc: t('langLevelDebutantDesc') || 'Quelques mots et phrases', dots: 1 },
    { id: 'courant', label: t('langLevelCourant') || 'Courant', desc: t('langLevelCourantDesc') || 'Conversations fluides', dots: 2 },
    { id: 'natif', label: t('langLevelNatif') || 'Natif', desc: t('langLevelNatifDesc') || 'Langue maternelle', dots: 3 },
  ]
  return `
    <div class="fixed inset-0 z-50 bg-black/80 flex items-end sm:items-center justify-center" role="dialog" aria-modal="true" onclick="if(event.target===this)closeLanguageLevelPicker()">
      <div class="bg-dark-secondary rounded-t-2xl sm:rounded-2xl w-full sm:max-w-sm p-5 space-y-4">
        <h3 class="font-bold text-center">${LANG_FLAG_MAP[name] || '🌐'} ${name}</h3>
        <p class="text-xs text-slate-400 text-center">${t('selectLevel') || 'Choisis ton niveau'}</p>
        <div class="space-y-2">
          ${levels.map(l => `
            <button onclick="selectLanguageLevel('${l.id}')" class="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left">
              <div class="flex gap-1">${Array.from({ length: 3 }, (_, i) => `<span class="w-3 h-3 rounded-full ${i < l.dots ? 'bg-emerald-400' : 'bg-white/15'}"></span>`).join('')}</div>
              <div>
                <div class="text-sm font-semibold">${l.label}</div>
                <div class="text-[10px] text-slate-400">${l.desc}</div>
              </div>
            </button>
          `).join('')}
        </div>
      </div>
    </div>
  `
}

// ==================== SUB-TABS BAR ====================

function renderProfileSubTabs(activeTab) {
  const tabs = [
    { id: 'profil', icon: 'user', label: t('profileTabProfil') || 'Profil' },
    { id: 'progression', icon: 'star', label: t('profileTabRoadmap') || 'Roadmap' },
    { id: 'reglages', icon: 'settings', label: t('profileTabSettings') || 'Réglages' },
  ]
  return `
    <div class="flex bg-dark-secondary/50 border-b border-white/5">
      ${tabs.map(tab => `
        <button
          onclick="setProfileSubTab('${tab.id}')"
          class="flex-1 py-3 px-2 font-medium text-sm transition-colors relative border-b-2 ${
            activeTab === tab.id
              ? 'border-primary-500 text-primary-400'
              : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'
          }"
        >
          ${icon(tab.icon, 'w-4 h-4 mr-1 inline-block')}
          ${tab.label}
        </button>
      `).join('')}
    </div>
  `
}

// ==================== TAB 1: PROFIL (V2 — Voyageur Enrichi) ====================

function renderProfilTab(state) {
  // Detail views replace the normal profil content
  if (state.profileDetailView === 'spots') return renderMySpotsList(state)
  if (state.profileDetailView === 'validations') return renderMyValidationsList(state)
  if (state.profileDetailView === 'countries') return renderMyCountriesList(state)

  const svgBio = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#3b82f6" stroke-width="1.8"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>'
  const svgLang = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#22c55e" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>'
  const svgPhotos = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#f59e0b" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>'
  const svgReviews = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#ef4444" stroke-width="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'
  const svgTrips = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#0ea5e9" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>'
  const svgBadges = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#f59e0b" stroke-width="1.8"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>'

  const bio = state.bio || ''
  const langs = (() => { try { return JSON.parse(localStorage.getItem('spothitch_languages') || '[]') } catch { return [] } })()
  const photos = (() => { try { return JSON.parse(localStorage.getItem('spothitch_gallery') || '[]') } catch { return [] } })()
  const tripCount = state.pastTrips?.length || 0
  const reviewCount = state.myReviews?.length || 0
  const badgeCount = state.earnedBadges?.length || 0

  // Language level visual
  const levelDot = (level) => {
    const filled = { natif: 3, courant: 2, debutant: 1 }[level] || 2
    return Array.from({ length: 3 }, (_, i) =>
      `<span class="inline-block w-1.5 h-1.5 rounded-full ${i < filled ? 'bg-emerald-400' : 'bg-white/15'}"></span>`
    ).join('')
  }

  return `
    ${renderProfileHeader(state)}
    ${renderClickableStats(state)}

    <!-- Bio -->
    <div class="card p-4">
      <div class="flex items-center gap-2 mb-2">
        ${svgBio}
        <span class="text-xs font-semibold text-slate-400 uppercase tracking-wide">${t('bio') || 'Bio'}</span>
      </div>
      ${bio
        ? `<p class="text-sm text-slate-300 leading-relaxed">${escapeHTML(bio)}</p>`
        : `<p class="text-sm text-slate-600 italic">${t('noBio') || 'Ajoute ta bio...'}</p>`
      }
    </div>

    <!-- Languages -->
    <div class="card p-4">
      <div class="flex items-center gap-2 mb-2">
        ${svgLang}
        <span class="text-xs font-semibold text-slate-400 uppercase tracking-wide">${t('languages') || 'Langues'}</span>
      </div>
      ${langs.length > 0
        ? `<div class="flex flex-wrap gap-2">
            ${langs.map(l => `
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full bg-white/5 text-slate-300">
                ${l.flag || '🌐'} ${escapeHTML(l.name || '')}
                <span class="flex gap-0.5 ml-0.5">${levelDot(l.level)}</span>
              </span>
            `).join('')}
          </div>`
        : `<p class="text-sm text-slate-600 italic">${t('noLanguages') || 'Ajoute tes langues...'}</p>`
      }
    </div>

    <!-- Photos -->
    ${photos.length > 0 ? `
    <div class="card p-4">
      <div class="flex items-center gap-2 mb-2">
        ${svgPhotos}
        <span class="text-xs font-semibold text-slate-400 uppercase tracking-wide">${t('photoGallery') || 'Photos'}</span>
        <span class="text-xs text-slate-500">(${photos.length})</span>
      </div>
      <div class="flex gap-2 overflow-x-auto pb-1">
        ${photos.slice(0, 5).map(url => `
          <div class="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
            <img src="${escapeHTML(url)}" class="w-full h-full object-cover" alt="" loading="lazy" />
          </div>
        `).join('')}
        ${photos.length > 5 ? `<div class="w-16 h-16 rounded-lg flex-shrink-0 bg-white/5 flex items-center justify-center text-xs text-slate-400">+${photos.length - 5}</div>` : ''}
      </div>
    </div>
    ` : ''}

    <!-- Reviews -->
    ${reviewCount > 0 ? `
    <div class="card p-4">
      <div class="flex items-center gap-2">
        ${svgReviews}
        <span class="text-xs font-semibold text-slate-400 uppercase tracking-wide">${t('myReviews') || 'Avis'}</span>
        <span class="text-xs text-slate-500">(${reviewCount})</span>
      </div>
    </div>
    ` : ''}

    <!-- Trips -->
    ${tripCount > 0 ? `
    <div class="card p-4">
      <button onclick="changeTab('challenges')" class="flex items-center gap-2 w-full text-left">
        ${svgTrips}
        <span class="text-xs font-semibold text-slate-400 uppercase tracking-wide">${t('myTrips') || 'Voyages'}</span>
        <span class="text-xs text-slate-500">(${tripCount})</span>
        <span class="ml-auto text-xs text-primary-400">${t('seeAll') || 'Voir tout'} →</span>
      </button>
    </div>
    ` : ''}

    <!-- Badges -->
    ${badgeCount > 0 ? `
    <div class="card p-4">
      <div class="flex items-center gap-2 mb-2">
        ${svgBadges}
        <span class="text-xs font-semibold text-slate-400 uppercase tracking-wide">${t('badges') || 'Badges'}</span>
        <span class="text-xs text-slate-500">(${badgeCount})</span>
      </div>
      <div class="flex flex-wrap gap-2">
        ${(state.earnedBadges || []).slice(0, 8).map(id => {
          const badge = allBadges.find(b => b.id === id)
          return badge ? `<span class="text-2xl" title="${badge.name}">${badge.icon}</span>` : ''
        }).join('')}
        ${badgeCount > 8 ? `<span class="text-xs text-slate-500 self-center">+${badgeCount - 8}</span>` : ''}
      </div>
    </div>
    ` : ''}

    ${renderDonationCard()}
  `
}

// Inline render functions (renderBioCard, renderLanguagesCard, renderPhotoGalleryCard,
// renderMyReviewsCard, renderPublicTripsCard, renderBadgesGrid, renderSocialLinksCard)
// were removed — profile info now displayed directly in renderProfilTab, editing only via modal

function renderProfileHeader(state) {
  const level = state.level || 1
  const vipLevel = getVipLevel(state.points || 0)
  const { isIdVerified } = getUserTrustScore()
  const verifiedBadge = renderVerifiedCheckmark(isIdVerified)
  const memberSince = state.user?.metadata?.creationTime
    ? new Date(state.user.metadata.creationTime).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
    : null

  return `
    <div class="flex items-start gap-4 pt-2 pb-4 border-b border-white/10">
      <!-- Avatar -->
      <div class="relative flex-shrink-0">
        <div class="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-primary-600 p-[3px]">
          <div class="w-full h-full rounded-full bg-dark-primary flex items-center justify-center text-3xl">
            ${state.avatar || '🤙'}
          </div>
        </div>
      </div>
      <!-- Name + level -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-1 flex-wrap">
          <h2 class="text-base font-bold">@${escapeHTML(state.username || t('traveler') || 'Voyageur')}</h2>
          ${verifiedBadge}
        </div>
        <div class="mt-1">
          <span class="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400">
            ${vipLevel.icon} ${t('level') || 'Niv.'} ${level} · ${vipLevel.name}
          </span>
        </div>
        ${memberSince ? `<p class="text-[10px] text-slate-500 mt-1">${t('memberSince') || 'Membre depuis'} ${memberSince}</p>` : ''}
        <p class="text-[10px] text-slate-500 truncate">${state.user?.email || t('notConnected') || 'Non connecté'}</p>
      </div>
      <!-- Quick actions -->
      <div class="flex flex-col gap-1.5 flex-shrink-0">
        <button
          onclick="openProfileCustomization()"
          class="px-3 py-1.5 rounded-lg bg-primary-500/15 text-primary-400 text-xs font-semibold hover:bg-primary-500/25 transition-colors"
        >
          ${icon('pencil', 'w-3 h-3 mr-1')}${t('edit') || 'Modifier'}
        </button>
        <button
          onclick="shareMyProfile()"
          class="px-3 py-1.5 rounded-lg bg-white/5 text-slate-400 text-xs font-semibold hover:bg-white/10 transition-colors"
        >
          ${icon('share-2', 'w-3 h-3 mr-1')}${t('share') || 'Partager'}
        </button>
      </div>
    </div>
  `
}

function renderClickableStats(state) {
  const countries = (state.countriesVisited || []).length
  const validations = state.reviewsGiven || 0
  const spotsCreated = state.spotsCreated || 0
  return `
    <div class="grid grid-cols-3 gap-2">
      <button
        onclick="openMySpots()"
        class="card p-3 text-center hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-colors active:scale-95"
        aria-label="${t('spotsCreated') || 'Spots créés'}"
      >
        <div class="text-xl font-bold text-emerald-400">${spotsCreated}</div>
        <div class="text-[10px] text-slate-400 uppercase tracking-wide mt-0.5">${t('spotsCreatedShort') || 'Spots créés'}</div>
        <div class="text-[10px] text-slate-600 mt-0.5">${t('tapForDetails') || 'Voir détails'} →</div>
      </button>
      <button
        onclick="openMyValidations()"
        class="card p-3 text-center hover:border-sky-500/30 hover:bg-sky-500/5 transition-colors active:scale-95"
        aria-label="${t('spotsValidated') || 'Spots validés'}"
      >
        <div class="text-xl font-bold text-sky-400">${validations}</div>
        <div class="text-[10px] text-slate-400 uppercase tracking-wide mt-0.5">${t('spotsValidatedShort') || 'Validations'}</div>
        <div class="text-[10px] text-slate-600 mt-0.5">${t('tapForDetails') || 'Voir détails'} →</div>
      </button>
      <button
        onclick="openMyCountries()"
        class="card p-3 text-center hover:border-primary-500/30 hover:bg-primary-500/5 transition-colors active:scale-95"
        aria-label="${t('countriesVisited') || 'Pays visités'}"
      >
        <div class="text-xl font-bold text-primary-400">${countries}</div>
        <div class="text-[10px] text-slate-400 uppercase tracking-wide mt-0.5">${t('countriesShort') || 'Pays'}</div>
        <div class="text-[10px] text-slate-600 mt-0.5">${t('tapForDetails') || 'Voir détails'} →</div>
      </button>
    </div>
  `
}

function renderVerificationCard(state) {
  const level = state.verificationLevel || 0
  const steps = [
    { label: t('verifyEmailStep') || 'Email vérifié', done: level >= 1, icon: 'mail' },
    { label: t('verifyPhone') || 'Téléphone', done: level >= 2, icon: 'phone' },
    { label: t('verifySelfie') || 'Selfie + ID', done: level >= 3, icon: 'scan-face' },
  ]
  return `
    <div class="card p-4">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-bold flex items-center gap-2">
          ${icon('shield-check', 'w-4 h-4 text-emerald-400')}
          ${t('identityVerification') || 'Vérification'}
        </h3>
        ${level < 3 ? `
          <button
            onclick="openIdentityVerification()"
            class="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1 py-2"
          >
            ${t('improve') || 'Améliorer'}
            ${icon('chevron-right', 'w-3 h-3')}
          </button>
        ` : `<span class="text-xs text-emerald-400 font-semibold">✓ ${t('fullyVerified') || 'Vérifié'}</span>`}
      </div>
      <div class="flex gap-2">
        ${steps.map((s, i) => `
          <div class="flex-1 flex flex-col items-center gap-1.5 ${!s.done && i === level ? 'cursor-pointer' : ''}"
            ${!s.done && i === level ? 'onclick="openIdentityVerification()" role="button" tabindex="0"' : ''}>
            <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
              s.done ? 'bg-emerald-500 text-white' : i === level ? 'bg-primary-500/20 border-2 border-primary-500/50 text-primary-400' : 'bg-white/5 text-slate-600'
            }">
              ${s.done ? icon('check', 'w-4 h-4') : (i + 1)}
            </div>
            <span class="text-[10px] text-center leading-tight ${s.done ? 'text-emerald-400' : 'text-slate-500'}">${s.label}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `
}



// ==================== DETAIL VIEWS ====================

function renderDetailBackButton() {
  return `
    <button onclick="closeProfileDetail()" class="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-4">
      ${icon('arrow-left', 'w-4 h-4')} ${t('backToProfile') || 'Retour au profil'}
    </button>
  `
}

function countryToFlag(code) {
  if (!code || code.length !== 2) return '📍'
  return String.fromCodePoint(
    ...[...code.toUpperCase()].map((c) => 0x1f1a5 + c.charCodeAt(0)),
  )
}

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days < 1) return t('today') || "aujourd'hui"
  if (days < 7) return `${days}${t('daysAgoShort') || 'j'}`
  if (days < 30) return `${Math.floor(days / 7)}${t('weeksAgoShort') || ' sem'}`
  if (days < 365) return `${Math.floor(days / 30)}${t('monthsAgoShort') || ' mois'}`
  return `${Math.floor(days / 365)}${t('yearsAgoShort') || ' an(s)'}`
}

function renderValidationProgress(validations) {
  if (validations >= 10) {
    return `<span class="text-amber-400 font-semibold">${t('certified') || 'Certifié'} ✓</span>`
  }
  if (validations >= 3) {
    return `<span class="text-emerald-400">${validations}/10 ${t('towardsCertified') || 'vers Certifié'}</span>`
  }
  return `<span class="text-slate-400">${validations}/3 ${t('towardsVerified') || 'vers Vérifié'}</span>`
}

function renderSpotAvgRating(spot) {
  const safety = spot.safety || spot.safetyRating || 0
  const traffic = spot.traffic || spot.trafficRating || 0
  const accessibility = spot.accessibility || spot.accessibilityRating || 0
  const ratings = [safety, traffic, accessibility].filter((r) => r > 0)
  if (ratings.length === 0) return ''
  const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length
  const full = Math.floor(avg)
  const half = avg - full >= 0.5 ? 1 : 0
  const empty = 5 - full - half
  return `<span class="text-amber-400 text-[10px]">${'★'.repeat(full)}${half ? '½' : ''}${'☆'.repeat(empty)}</span>`
}

function renderMySpotsList(state) {
  const count = state.spotsCreated || 0
  const spots = state._userSpots || []
  const loading = state._userSpotsLoading
  const sortMode = state._mySpotsSort || 'recent'

  // Sort handler
  window.sortMySpots = (mode) => {
    import('../../stores/state.js').then(({ setState }) => {
      setState({ _mySpotsSort: mode })
    })
  }

  // Fetch real spots from Firebase on first render
  if (!spots.length && !loading && state.isLoggedIn && count > 0) {
    import('../../stores/state.js').then(({ setState }) => {
      setState({ _userSpotsLoading: true })
    })
    import('../../services/firebase.js').then(
      ({ getUserSpots, getCurrentUser, updateSpot }) => {
        const user = getCurrentUser()
        if (user) {
          getUserSpots(user.uid).then((results) => {
            import('../../stores/state.js').then(({ setState }) => {
              setState({
                _userSpots: results,
                _userSpotsLoading: false,
                spotsCreated: results.length || count,
              })
            })
            const spotsToFix = results.filter(
              (s) =>
                (!s.country ||
                  !s.countryName ||
                  s.departureCity === 'undefined') &&
                s.lat &&
                s.lng,
            )
            if (spotsToFix.length > 0) {
              import('../../services/osrm.js').then(({ reverseGeocode }) => {
                spotsToFix.forEach((spot) => {
                  reverseGeocode(spot.lat, spot.lng)
                    .then((loc) => {
                      if (loc) {
                        const fixes = {}
                        if (!spot.country && loc.countryCode) {
                          spot.country = loc.countryCode
                          fixes.country = loc.countryCode
                        }
                        if (!spot.countryName && loc.country) {
                          spot.countryName = loc.country
                          fixes.countryName = loc.country
                        }
                        if (
                          spot.departureCity === 'undefined' &&
                          loc.city
                        ) {
                          spot.departureCity = loc.city
                          fixes.departureCity = loc.city
                        }
                        if (Object.keys(fixes).length > 0) {
                          updateSpot(spot.id, fixes).catch(() => {})
                          import('../../stores/state.js').then(
                            ({ setState }) =>
                              setState({ _userSpots: [...results] }),
                          )
                        }
                      }
                    })
                    .catch(() => {})
                })
              }).catch(() => {})
            }
          })
        }
      },
    )
  }

  const typeLabels = {
    gas_station: t('spotTypeGasStation') || 'Station',
    toll: t('spotTypeToll') || 'Péage',
    roundabout: t('spotTypeRoundabout') || 'Rond-point',
    on_ramp: t('spotTypeOnRamp') || 'Bretelle',
    roadside: t('spotTypeRoadside') || 'Bord de route',
    custom: t('spotTypeCustom') || 'Autre',
  }

  // Compute stats
  const totalValidations = spots.reduce(
    (sum, s) => sum + (s.validationCount || s.totalReviews || 0),
    0,
  )
  const uniqueCountries = new Set(
    spots.map((s) => s.country || s.countryCode).filter(Boolean),
  )
  const bestSpot =
    spots.length > 0
      ? spots.reduce(
          (best, s) =>
            (s.validationCount || 0) > (best.validationCount || 0) ? s : best,
          spots[0],
        )
      : null
  const bestSpotName = bestSpot
    ? bestSpot.locationName ||
      bestSpot.departureCity ||
      bestSpot.fromCity ||
      bestSpot.name ||
      '?'
    : ''

  // Sort spots
  const sortedSpots = [...spots]
  if (sortMode === 'validated') {
    sortedSpots.sort(
      (a, b) => (b.validationCount || 0) - (a.validationCount || 0),
    )
  } else if (sortMode !== 'country') {
    // 'recent' (default)
    sortedSpots.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return dateB - dateA
    })
  }

  // Group by country for country view
  let countryGroups = []
  if (sortMode === 'country' && spots.length > 0) {
    const groupMap = {}
    spots.forEach((s) => {
      const cc = s.country || s.countryCode || 'XX'
      if (!groupMap[cc]) {
        groupMap[cc] = { code: cc, name: s.countryName || cc, spots: [] }
      }
      groupMap[cc].spots.push(s)
    })
    countryGroups = Object.values(groupMap)
    countryGroups.sort((a, b) => b.spots.length - a.spots.length)
    countryGroups.forEach((g) =>
      g.spots.sort(
        (a, b) => (b.validationCount || 0) - (a.validationCount || 0),
      ),
    )
  }

  // Render a single spot card
  function renderSpotCard(s) {
    const name =
      s.locationName || s.departureCity || s.fromCity || s.name || '?'
    const cc = s.country || s.countryCode || ''
    const flag = countryToFlag(cc)
    const freshness = getSpotFreshness(s)
    const validations = s.validationCount || s.totalReviews || 0
    const lastVal = s.lastValidated || s.lastTested || ''
    const spotId = escapeJSString(String(s.id))

    return `
      <div class="card p-3 flex items-center gap-3 cursor-pointer" role="button" tabindex="0" onclick="window.selectSpot?.({id:'${spotId}',coordinates:{lat:${s.lat || s.coordinates?.lat || 0},lng:${s.lng || s.coordinates?.lng || 0}}})">
        <div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style="background:${freshness.hexColor}20">
          <div class="w-3 h-3 rounded-full" style="background:${freshness.hexColor}"></div>
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-sm font-semibold truncate">${escapeHTML(name)}</div>
          <div class="text-[10px] text-slate-400 truncate">${flag} ${escapeHTML(s.countryName || cc)} · ${escapeHTML(typeLabels[s.spotType] || '')}</div>
          <div class="text-[10px] mt-0.5">${renderValidationProgress(validations)}</div>
          ${lastVal ? `<div class="text-[10px] text-slate-500 mt-0.5">${t('lastValidatedDate') || 'Dernière validation'}: ${timeAgo(lastVal)}</div>` : ''}
        </div>
        <div class="flex-shrink-0 text-right">
          <div class="text-xs ${validations > 0 ? 'text-emerald-400' : 'text-slate-500'} font-semibold">
            ${validations > 0 ? `✓ ${validations}` : '0'}
          </div>
          ${renderSpotAvgRating(s)}
        </div>
      </div>
    `
  }

  // Render spots list based on sort mode
  function renderSpotsList() {
    if (sortMode === 'country') {
      return countryGroups
        .map(
          (g) => `
        <div class="mb-3">
          <div class="flex items-center gap-2 mb-2 px-1">
            <span class="text-base">${countryToFlag(g.code)}</span>
            <span class="text-sm font-semibold">${escapeHTML(g.name)}</span>
            <span class="text-xs text-slate-500">(${g.spots.length} ${t('spots') || 'spots'})</span>
          </div>
          <div class="space-y-2">
            ${g.spots.map((s) => renderSpotCard(s)).join('')}
          </div>
        </div>
      `,
        )
        .join('')
    }
    return `<div class="space-y-2">${sortedSpots.map((s) => renderSpotCard(s)).join('')}</div>`
  }

  // Active tab style helper
  const tabClass = (mode) =>
    sortMode === mode
      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      : 'bg-slate-800/50 text-slate-400 border-slate-700/50 hover:bg-slate-700/50'

  return `
    <div>
      ${renderDetailBackButton()}
      <h2 class="text-base font-bold flex items-center gap-2 mb-3">
        📍 ${t('myCreatedSpots') || 'Mes spots créés'} (${spots.length || count})
      </h2>
      ${
        loading
          ? `<div class="text-center text-slate-400 text-sm py-8">${t('loading') || 'Chargement...'}</div>`
          : spots.length === 0 && count === 0
            ? renderEmptyState('mySpots', { compact: true })
            : spots.length === 0
              ? `<div class="text-center text-slate-400 text-sm py-8">${t('loading') || 'Chargement...'}</div>`
              : `
              <!-- Stats bar -->
              <div class="card p-3 mb-3">
                <div class="text-xs font-semibold text-slate-300 mb-2">${t('mySpotsStats') || 'Résumé'}</div>
                <div class="grid grid-cols-2 gap-2 text-center">
                  <div class="bg-slate-800/50 rounded-lg p-2">
                    <div class="text-lg font-bold text-white">${spots.length}</div>
                    <div class="text-[10px] text-slate-400">${t('spots') || 'spots'}</div>
                  </div>
                  <div class="bg-slate-800/50 rounded-lg p-2">
                    <div class="text-lg font-bold text-white">${uniqueCountries.size}</div>
                    <div class="text-[10px] text-slate-400">${t('countries') || 'pays'}</div>
                  </div>
                  <div class="bg-slate-800/50 rounded-lg p-2">
                    <div class="text-lg font-bold text-emerald-400">${totalValidations}</div>
                    <div class="text-[10px] text-slate-400">${t('totalValidations') || 'validations reçues'}</div>
                  </div>
                  <div class="bg-slate-800/50 rounded-lg p-2">
                    <div class="text-sm font-bold text-amber-400 truncate">${bestSpotName ? escapeHTML(bestSpotName) : '...'}</div>
                    <div class="text-[10px] text-slate-400">${t('bestSpot') || 'Meilleur spot'}</div>
                  </div>
                </div>
              </div>

              <!-- Sort tabs -->
              <div class="flex gap-2 mb-3">
                <button onclick="sortMySpots('recent')" class="flex-1 text-xs font-medium py-1.5 px-2 rounded-lg border ${tabClass('recent')}">
                  ${t('sortRecent') || 'Récents'}
                </button>
                <button onclick="sortMySpots('validated')" class="flex-1 text-xs font-medium py-1.5 px-2 rounded-lg border ${tabClass('validated')}">
                  ${t('sortValidated') || 'Plus validés'}
                </button>
                <button onclick="sortMySpots('country')" class="flex-1 text-xs font-medium py-1.5 px-2 rounded-lg border ${tabClass('country')}">
                  ${t('sortCountry') || 'Par pays'}
                </button>
              </div>

              <!-- Spots list -->
              ${renderSpotsList()}
            `
      }
    </div>
  `
}

function renderMyValidationsList(state) {
  const count = state.reviewsGiven || 0
  const mockValidations = [
    { name: 'Aire de Dole', location: 'Jura, France', date: '10 jan 2025', stars: 5 },
    { name: 'Stazione di Bologna', location: 'Bologne, Italie', date: '3 déc 2024', stars: 4 },
    { name: 'A4 · Strasbourg Est', location: 'Bas-Rhin, France', date: '20 nov 2024', stars: 3 },
    { name: 'Aire de Vienne', location: 'Isère, France', date: '12 oct 2024', stars: 5 },
    { name: 'Autobahn A9 München', location: 'Bavière, Allemagne', date: '2 sep 2024', stars: 4 },
  ].slice(0, count || 5)

  return `
    <div>
      ${renderDetailBackButton()}
      <h2 class="text-base font-bold flex items-center gap-2 mb-4">
        ✓ ${t('myValidations') || 'Mes validations'} (${count})
      </h2>
      ${count === 0
        ? `<div class="card p-6 text-center">
            <p class="text-slate-400 text-sm">${t('noValidationsYet') || 'Aucune validation encore. Valide des spots que tu as utilisés !'}</p>
          </div>`
        : `<div class="space-y-2">
            ${mockValidations.map(v => `
              <div class="card p-3 flex items-center gap-3">
                <div class="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                  <span class="text-amber-400">★</span>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-semibold truncate">${v.name}</div>
                  <div class="text-[10px] text-slate-400">${v.location} · ${v.date}</div>
                </div>
                <div class="flex-shrink-0">
                  <div class="text-amber-400 text-xs">${'★'.repeat(v.stars)}${'☆'.repeat(5 - v.stars)}</div>
                </div>
              </div>
            `).join('')}
            ${count > mockValidations.length ? `<p class="text-xs text-slate-500 text-center pt-2">+ ${count - mockValidations.length} ${t('otherValidations') || 'autres validations'}</p>` : ''}
          </div>`
      }
    </div>
  `
}

function renderMyCountriesList(state) {
  const countryCodes = state.countriesVisited || []
  return `
    <div>
      ${renderDetailBackButton()}
      <h2 class="text-base font-bold flex items-center gap-2 mb-4">
        🌍 ${t('myCountries') || 'Pays visités'} (${countryCodes.length})
      </h2>
      ${countryCodes.length === 0
        ? `<div class="card p-6 text-center">
            <p class="text-slate-400 text-sm">${t('noCountriesYet') || 'Aucun pays encore. Commence à bouger !'}</p>
          </div>`
        : `<div class="grid grid-cols-2 gap-2">
            ${countryCodes.map(code => {
              const c = COUNTRY_MAP[code] || { flag: '🌐', name: code }
              return `
                <div class="card p-3 flex items-center gap-3">
                  <span class="text-2xl flex-shrink-0">${c.flag}</span>
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-semibold truncate">${c.name}</div>
                    <div class="text-[10px] text-slate-400">${t('spotsUsedIn') || 'spots utilisés'}</div>
                  </div>
                </div>
              `
            }).join('')}
          </div>`
      }
    </div>
  `
}

// ==================== TAB 2: ROADMAP (community voting) ====================

// Cached vote totals (loaded async from Firebase)
let _roadmapTotalsCache = null
let _roadmapTotalsLoading = false

async function ensureRoadmapTotals() {
  if (_roadmapTotalsCache || _roadmapTotalsLoading) return
  _roadmapTotalsLoading = true
  try {
    _roadmapTotalsCache = await getVoteTotals()
  } catch { _roadmapTotalsCache = {} }
  _roadmapTotalsLoading = false
  window._forceRender?.()
}

// Cached comments per feature (loaded on demand)
const _commentsCache = {}
const _commentsLoading = new Set()

async function ensureComments(featureId) {
  if (_commentsCache[featureId] || _commentsLoading.has(featureId)) return
  _commentsLoading.add(featureId)
  try {
    _commentsCache[featureId] = await getFeatureComments(featureId)
  } catch { _commentsCache[featureId] = [] }
  _commentsLoading.delete(featureId)
  window._forceRender?.()
}

// Toggle expanded comments for a feature
const _expandedFeatures = new Set()

window.toggleRoadmapComments = (featureId) => {
  if (_expandedFeatures.has(featureId)) {
    _expandedFeatures.delete(featureId)
  } else {
    _expandedFeatures.add(featureId)
    ensureComments(featureId)
  }
  window._forceRender?.()
}


function renderCommentsSection(featureId) {
  if (!_expandedFeatures.has(featureId)) return ''
  const comments = _commentsCache[featureId]
  if (!comments) return '<div class="mt-2 px-1"><div class="text-[11px] text-slate-500">' + escapeHTML(t('loading') || 'Loading...') + '</div></div>'
  if (comments.length === 0) return '<div class="mt-2 px-1"><div class="text-[11px] text-slate-500">' + escapeHTML(t('roadmapNoComments') || 'Aucun avis pour le moment. Sois le premier !') + '</div></div>'

  const VOTE_EMOJI = { essential: '🔥', useful: '👍', notUrgent: '🤷' }
  return '<div class="mt-2 space-y-1.5">'
    + comments.map(c =>
      '<div class="flex items-start gap-2 px-1 py-1.5 border-t border-white/[0.04]">'
      + '<span class="text-sm shrink-0">' + escapeHTML(c.avatar) + '</span>'
      + '<div class="flex-1 min-w-0">'
      + '<div class="flex items-center gap-1.5">'
      + '<span class="text-[11px] font-semibold text-slate-300">' + escapeHTML(c.userName) + '</span>'
      + '<span class="text-[10px]">' + (VOTE_EMOJI[c.vote] || '') + '</span>'
      + '</div>'
      + '<p class="text-[11px] text-slate-400 leading-relaxed mt-0.5">' + escapeHTML(c.comment) + '</p>'
      + '</div></div>'
    ).join('')
    + '</div>'
}

function renderRoadmapTab(_state) {
  // Trigger async load of vote totals
  ensureRoadmapTotals()

  const betaFeatures = FEATURES_DATA.filter(f => f.status === 'beta')
  const totals = _roadmapTotalsCache || {}

  // Sort by essential votes descending
  const sorted = [...betaFeatures].sort((a, b) => {
    const aE = totals[a.id]?.essential || 0
    const bE = totals[b.id]?.essential || 0
    return bE - aE
  })

  const featureCards = sorted.map((f, i) => {
    const ft = totals[f.id] || { essential: 0, useful: 0, notUrgent: 0 }
    const rank = i + 1
    const rankLabel = rank <= 3 ? ['🥇','🥈','🥉'][rank - 1] : '<span class="text-xs text-slate-500 font-bold">#' + rank + '</span>'
    return '<div class="card p-3">'
      + '<div class="flex items-start gap-3">'
      + '<div class="text-lg shrink-0 w-7 text-center">' + rankLabel + '</div>'
      + '<div class="flex-1 min-w-0">'
      + '<div class="flex items-center gap-2 mb-1">'
      + '<span class="text-lg">' + f.emoji + '</span>'
      + '<h3 class="font-semibold text-sm truncate">' + escapeHTML(t('featureName_' + f.id) || f.name || f.title) + '</h3>'
      + '</div>'
      + '<div class="flex flex-wrap gap-1.5 mb-2">'
      + '<span class="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-red-500/12 text-red-500">🔥 ' + ft.essential + '</span>'
      + '<span class="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-amber-500/12 text-amber-500">👍 ' + ft.useful + '</span>'
      + '<span class="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-gray-500/12 text-gray-500">🤷 ' + ft.notUrgent + '</span>'
      + '</div>'
      + '<div class="flex items-center gap-2">'
      + '<button onclick="showFeatureIntro(\'' + f.id + '\')"'
      + ' class="text-[11px] px-3 py-1 rounded-lg font-semibold cursor-pointer transition-colors bg-amber-500/10 border border-amber-500/30 text-amber-500">'
      + escapeHTML(t('roadmapDetail') || 'Détail & voter')
      + '</button>'
      + '<button onclick="toggleRoadmapComments(\'' + f.id + '\')"'
      + ' class="text-[11px] px-3 py-1 rounded-lg font-semibold cursor-pointer transition-colors bg-white/[0.04] border border-white/[0.08] text-slate-400">'
      + '💬 ' + escapeHTML(t('roadmapComments') || 'Avis')
      + '</button>'
      + '</div>'
      + renderCommentsSection(f.id)
      + '</div></div></div>'
  }).join('')

  return `
    <div>
      <div class="flex items-center justify-between mb-2">
        <h2 class="text-lg font-bold">${icon('rocket', 'w-5 h-5 text-amber-400 inline-block mr-1')} ${t('roadmapTitle') || 'Roadmap communautaire'}</h2>
      </div>
      <div class="card p-3 mb-4 border-amber-500/20 bg-amber-500/5">
        <p class="text-slate-300 text-xs leading-relaxed">${t('roadmapCommunityIntro') || "Vote pour les features que tu veux en premier ! Plus de votes 🔥 = plus de priorité."}</p>
      </div>
      <div class="space-y-2.5">
        ${featureCards}
      </div>
    </div>
  `
}

// ==================== TAB 3: RÉGLAGES ====================

function renderReglagesTab(state) {
  const openSection = state.settingsOpenSection || null

  // SVG icons (inline, no emoji)
  const svgAppearance = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#a78bfa" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>'
  const svgNotif = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#f59e0b" stroke-width="1.8"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>'
  const svgOffline = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#3b82f6" stroke-width="1.8"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>'
  const svgAccount = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#22c55e" stroke-width="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>'
  const svgHelp = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#94a3b8" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>'

  const langName = { fr: 'Français', en: 'English', es: 'Español', de: 'Deutsch' }[state.lang] || 'English'
  const themeName = state.theme === 'dark' ? (t('darkMode') || 'Dark') : (t('lightMode') || 'Light')

  const offlineCount = (() => {
    try { return JSON.parse(localStorage.getItem('spothitch_offline_countries') || '[]').length } catch { return 0 }
  })()

  function sectionRow(id, svgIcon, bgColor, label, sub) {
    const isOpen = openSection === id
    return `
      <div class="border-b border-white/[0.04] last:border-b-0">
        <button type="button" onclick="toggleSettingsSection('${id}')"
          class="w-full flex items-center justify-between px-4 py-[14px] hover:bg-white/[0.02] transition-colors">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-[10px] flex items-center justify-center" style="background:${bgColor}">${svgIcon}</div>
            <div class="text-left">
              <div class="text-[14px] font-medium">${label}</div>
              <div class="text-[11px] text-slate-500">${sub}</div>
            </div>
          </div>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#475569" stroke-width="2"
            style="transition:transform .2s;transform:rotate(${isOpen ? '90' : '0'}deg)"><path d="M9 18l6-6-6-6"/></svg>
        </button>
        ${isOpen ? `<div class="px-3 pb-3" id="settings-section-${id}">${renderSettingsSection(id, state)}</div>` : ''}
      </div>
    `
  }

  return `
    ${renderSettingsMiniHeader(state)}

    <div class="card overflow-hidden p-0">
      ${sectionRow('appearance', svgAppearance, 'rgba(139,92,246,0.1)', t('settingsAppearance') || 'Appearance', `${langName} · ${themeName}`)}
      ${sectionRow('notifications', svgNotif, 'rgba(245,158,11,0.1)', t('settingsNotifications') || 'Notifications', state.notifications !== false ? (t('enabled') || 'Enabled') : (t('disabled') || 'Disabled'))}
      ${sectionRow('offline', svgOffline, 'rgba(59,130,246,0.1)', t('offlineManager') || 'Offline data', offlineCount > 0 ? `${offlineCount} ${t('countries') || 'countries'}` : (t('noneDownloaded') || 'None downloaded'))}
      ${sectionRow('account', svgAccount, 'rgba(34,197,94,0.1)', t('accountPrivacy') || 'Account & privacy', t('accountPrivacySub') || 'Verification, data, blocked')}
      ${sectionRow('help', svgHelp, 'rgba(148,163,184,0.06)', t('helpLegal') || 'Help & legal', t('helpLegalSub') || 'Contact, terms, guidelines')}
    </div>

    ${renderDonationCard({ variant: 'full' })}
    ${renderActionsCard(state)}
  `
}

function renderSettingsSection(sectionId, state) {
  switch (sectionId) {
    case 'appearance': return renderAppearanceCard(state)
    case 'notifications': return renderNotificationsCard(state)
    case 'offline': return renderOfflineManagerCard(state)
    case 'account': return `
      ${renderVerificationCard(state)}
      ${renderPrivacyCard(state)}
    `
    case 'help': return renderHelpLegalSection()
    default: return ''
  }
}

function renderHelpLegalSection() {
  return `
    <div class="space-y-1">
      <button onclick="openContactForm()" class="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-left">
        ${icon('mail', 'w-4 h-4 text-blue-400')}
        <span class="text-sm text-slate-300">${t('contactUs') || 'Contact us'}</span>
        ${icon('chevron-right', 'w-4 h-4 text-slate-500 ml-auto')}
      </button>
      <button onclick="openBugReport()" class="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-left">
        ${icon('bug', 'w-4 h-4 text-red-400')}
        <span class="text-sm text-slate-300">${t('reportBug') || 'Report a bug'}</span>
        ${icon('chevron-right', 'w-4 h-4 text-slate-500 ml-auto')}
      </button>
      <button onclick="showLegalPage('privacy')" class="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-left">
        ${icon('shield', 'w-4 h-4 text-emerald-400')}
        <span class="text-sm text-slate-300">${t('privacyPolicy') || 'Privacy policy'}</span>
        ${icon('chevron-right', 'w-4 h-4 text-slate-500 ml-auto')}
      </button>
      <button onclick="showLegalPage('cgu')" class="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-left">
        ${icon('file-text', 'w-4 h-4 text-slate-400')}
        <span class="text-sm text-slate-300">${t('termsOfService') || 'Terms of service'}</span>
        ${icon('chevron-right', 'w-4 h-4 text-slate-500 ml-auto')}
      </button>
      <button onclick="showLegalPage('guidelines')" class="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-left">
        ${icon('scroll-text', 'w-4 h-4 text-amber-400')}
        <span class="text-sm text-slate-300">${t('communityGuidelines') || 'Community guidelines'}</span>
        ${icon('chevron-right', 'w-4 h-4 text-slate-500 ml-auto')}
      </button>
      <button onclick="shareApp()" class="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-left">
        ${icon('share-2', 'w-4 h-4 text-primary-400')}
        <span class="text-sm text-slate-300">${t('inviteFriends') || 'Invite friends'}</span>
        ${icon('chevron-right', 'w-4 h-4 text-slate-500 ml-auto')}
      </button>
    </div>
  `
}

function renderOfflineManagerCard(_state) {
  const offlineCountries = (() => {
    try { return JSON.parse(localStorage.getItem('spothitch_offline_countries') || '[]') } catch { return [] }
  })()
  const downloadedCodes = new Set(offlineCountries.map(c => c.code))

  // Downloaded countries list
  const countryRows = offlineCountries.map(c => {
    const info = COUNTRY_MAP[c.code] || { flag: '🌍', name: c.code }
    const spots = c.count || 0
    const stations = c.stationCount || 0
    const tiles = c.tileSizeMB ? `${Math.round(c.tileSizeMB)} Mo` : '-'
    return `
      <div class="flex items-center justify-between p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
        <div class="flex items-center gap-3 min-w-0">
          <span class="text-lg">${info.flag}</span>
          <div class="min-w-0">
            <div class="text-sm font-medium truncate">${info.name} <span class="text-emerald-400 text-xs">✓</span></div>
            <div class="text-xs text-slate-400">${spots} spots · ${stations} ⛽ · ${tiles}</div>
          </div>
        </div>
        <button
          onclick="deleteOfflineCountry('${c.code}')"
          class="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors flex-shrink-0"
          aria-label="${t('delete') || 'Supprimer'} ${info.name}"
          type="button"
        >
          ${icon('trash', 'w-4 h-4 text-red-400')}
        </button>
      </div>
    `
  }).join('')

  // Available countries to download (not yet downloaded, sorted by name)
  const availableCountries = Object.entries(COUNTRY_MAP)
    .filter(([code]) => !downloadedCodes.has(code))
    .sort((a, b) => a[1].name.localeCompare(b[1].name))
    .map(([code, info]) => `
      <button
        id="dl-btn-${code}"
        onclick="downloadCountryOffline('${code}', '${escapeJSString(info.name)}')"
        class="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors w-full text-left"
        type="button"
      >
        <span class="text-base">${info.flag}</span>
        <span class="text-xs text-slate-300 flex-1 truncate">${info.name}</span>
        <span class="text-[10px] text-primary-400">${icon('download', 'w-3.5 h-3.5')}</span>
      </button>
    `).join('')

  return `
    <div class="card p-4 space-y-3">
      <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
        ${icon('download', 'w-4 h-4')}
        ${t('offlineManager') || 'Données hors-ligne'}
      </h3>

      <!-- Storage bar -->
      <div class="p-3 rounded-xl bg-white/5">
        <div class="flex items-center justify-between mb-1">
          <span class="text-xs text-slate-400">${t('storageUsed') || 'Espace utilisé'}</span>
          <span class="text-xs font-mono text-slate-300" id="offline-storage-size">...</span>
        </div>
        <div class="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div class="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all" id="offline-storage-bar" style="width: 0%"></div>
        </div>
      </div>

      <!-- Progress indicator (hidden by default) -->
      <div id="offline-dl-progress" class="hidden p-3 rounded-xl bg-primary-500/5 border border-primary-500/10">
        <div class="flex items-center justify-between mb-1">
          <span class="text-xs text-primary-400 font-medium" id="offline-dl-label">${t('downloading') || 'Téléchargement...'}</span>
          <span class="text-xs font-mono text-primary-300" id="offline-dl-pct">0%</span>
        </div>
        <div class="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div class="h-full bg-gradient-to-r from-primary-500 to-amber-400 rounded-full transition-all" id="offline-dl-bar" style="width: 0%"></div>
        </div>
        <div class="text-[10px] text-slate-500 mt-1" id="offline-dl-phase">${t('offlinePhaseSpots') || 'Spots...'}</div>
      </div>

      <!-- Downloaded countries -->
      ${countryRows}

      <!-- Download a country -->
      <div class="pt-1">
        <div class="text-xs text-slate-500 font-medium mb-2">${t('downloadCountry') || 'Télécharger un pays'}</div>
        <div class="text-[10px] text-slate-600 mb-2">${t('offlineIncluded') || 'Inclut : carte, spots et stations-service'}</div>
        <div class="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
          ${availableCountries}
        </div>
      </div>

      ${offlineCountries.length > 0 ? `
        <button
          onclick="clearAllOfflineData()"
          class="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 transition-colors text-red-400 text-sm"
          type="button"
        >
          ${icon('trash', 'w-4 h-4')}
          ${t('clearAllOffline') || 'Tout supprimer'}
        </button>
      ` : ''}
    </div>
  `
}

function renderSettingsMiniHeader(state) {
  return `
    <div class="flex items-center gap-3 mb-1">
      <div class="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 p-[2px]">
        <div class="w-full h-full rounded-full bg-dark-primary flex items-center justify-center text-xl">
          ${state.avatar || '🤙'}
        </div>
      </div>
      <div>
        <div class="font-medium text-sm">${escapeHTML(state.username || t('traveler') || 'Voyageur')}</div>
        <div class="text-xs text-slate-400">@${escapeHTML(state.username || 'user')}</div>
      </div>
    </div>
  `
}

function renderAppearanceCard(state) {
  return `
    <div class="card p-4 space-y-3">
      <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
        ${icon('palette', 'w-4 h-4')}
        ${t('settingsAppearance') || 'Apparence'}
      </h3>
      <div class="flex items-center justify-between p-3 rounded-xl bg-white/5">
        <div class="flex items-center gap-3">
          ${icon('moon', 'w-5 h-5 text-purple-400')}
          <span class="text-sm">${t('darkMode') || 'Thème sombre'}</span>
        </div>
        ${renderToggle(state.theme === 'dark', "toggleTheme()", t('toggleDarkMode') || 'Activer le thème sombre')}
      </div>
      <div class="p-3 rounded-xl bg-white/5">
        <div class="flex items-center gap-3 mb-2">
          ${icon('globe', 'w-5 h-5 text-emerald-400')}
          <span class="text-sm">${t('language') || 'Langue'}</span>
        </div>
        <div class="grid grid-cols-4 gap-2" role="radiogroup" aria-label="${t('chooseLanguage') || 'Choisir la langue'}">
          ${[
            { code: 'fr', flag: '\uD83C\uDDEB\uD83C\uDDF7', name: 'FR' },
            { code: 'en', flag: '\uD83C\uDDEC\uD83C\uDDE7', name: 'EN' },
            { code: 'es', flag: '\uD83C\uDDEA\uD83C\uDDF8', name: 'ES' },
            { code: 'de', flag: '\uD83C\uDDE9\uD83C\uDDEA', name: 'DE' },
          ].map(lang => `
            <button
              onclick="setLanguage('${lang.code}')"
              class="flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${state.lang === lang.code ? 'bg-primary-500/20 border-2 border-primary-500 ring-1 ring-primary-500/30' : 'bg-white/5 border-2 border-transparent hover:bg-white/10'}"
              role="radio"
              aria-checked="${state.lang === lang.code}"
              aria-label="${lang.name}"
              type="button"
            >
              <span class="text-xl">${lang.flag}</span>
              <span class="text-xs font-medium ${state.lang === lang.code ? 'text-primary-400' : 'text-slate-400'}">${lang.name}</span>
            </button>
          `).join('')}
        </div>
      </div>
    </div>
  `
}

function renderNotificationsCard(state) {
  return `
    <div class="card p-4 space-y-3">
      <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
        ${icon('bell', 'w-4 h-4')}
        ${t('settingsNotifications') || 'Notifications'}
      </h3>
      <div class="flex items-center justify-between p-3 rounded-xl bg-white/5">
        <div class="flex items-center gap-3">
          ${icon('bell', 'w-5 h-5 text-amber-400')}
          <span class="text-sm">${t('notifications') || 'Notifications'}</span>
        </div>
        ${renderToggle(state.notifications !== false, "toggleNotifications()", t('toggleNotifications') || 'Activer les notifications')}
      </div>
      <button
        onclick="openComingSoonProximity()"
        class="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
        type="button"
      >
        <div class="flex items-center gap-3">
          ${icon('map-pin', 'w-5 h-5 text-emerald-400')}
          <div class="text-left">
            <span class="text-sm block">${t('proximityAlerts') || 'Alertes de proximité'}</span>
            <span class="text-xs text-slate-400">${t('proximityAlertsDesc') || 'Notifié près d\'un spot'}</span>
          </div>
        </div>
        <span class="text-[10px] text-amber-400 font-medium whitespace-nowrap">${t('comingSoon') || 'Bientôt'}</span>
      </button>
      ${''}<!-- Notifications push: disabled for alpha, enable in beta -->
    </div>
  `
}

function renderPrivacyCard(_state) {
  const privacy = typeof localStorage !== 'undefined'
    ? JSON.parse(localStorage.getItem('spothitch_privacy') || '{"sharePastTrips":true}')
    : { sharePastTrips: true }
  return `
    <div class="card p-4 space-y-3">
      <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
        ${icon('lock', 'w-4 h-4')}
        ${t('settingsPrivacy') || 'Confidentialité'}
      </h3>
      <div class="flex items-center justify-between p-3 rounded-xl bg-white/5">
        <div class="flex items-center gap-3 flex-1 min-w-0">
          ${icon('route', 'w-4 h-4 text-slate-400 flex-shrink-0')}
          <div>
            <span class="text-sm block">${t('sharePastTrips') || 'Partager mes voyages passés'}</span>
            <span class="text-xs text-slate-500">${t('sharePastTripsDesc') || 'Tes itinéraires et dates visibles par les autres'}</span>
          </div>
        </div>
        ${renderToggle(privacy.sharePastTrips !== false, "togglePrivacy('sharePastTrips')", t('sharePastTrips') || 'Partager mes voyages passés')}
      </div>
      <button
        onclick="openBlockedUsers()"
        class="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
      >
        <div class="flex items-center gap-3">
          ${icon('ban', 'w-4 h-4 text-slate-400')}
          <span class="text-sm">${t('blockedUsers') || 'Utilisateurs bloqués'}</span>
        </div>
        ${icon('chevron-right', 'w-4 h-4 text-slate-500')}
      </button>
      <button
        onclick="openMyData()"
        class="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
      >
        <div class="flex items-center gap-3">
          ${icon('database', 'w-4 h-4 text-blue-400')}
          <span class="text-sm">${t('myData') || 'Mes données'} (RGPD)</span>
        </div>
        ${icon('chevron-right', 'w-4 h-4 text-slate-500')}
      </button>
    </div>
  `
}

function renderActionsCard(state) {
  return `
    <div class="card p-4 space-y-2">
      <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">${t('actions') || 'Actions'}</h3>
      ${state.isLoggedIn ? `
        <button
          onclick="handleLogout()"
          class="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-red-500/10 transition-colors text-danger-400"
        >
          ${icon('log-out', 'w-4 h-4')}
          <span class="text-sm">${t('logout') || 'Se déconnecter'}</span>
        </button>
        <button
          onclick="openDeleteAccount()"
          class="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-red-500/10 transition-colors text-red-400"
        >
          ${icon('trash', 'w-4 h-4')}
          <span class="text-sm">${t('deleteAccount') || 'Supprimer le compte'}</span>
        </button>
      ` : `
        <button
          onclick="openAuth()"
          class="btn-primary w-full py-3"
        >
          ${icon('log-in', 'w-5 h-5 mr-2')}
          ${t('login') || 'Se connecter'}
        </button>
      `}
    </div>
  `
}


function renderVersionReset() {
  return `
    <div class="flex items-center justify-between text-xs text-slate-400 pt-4">
      <span>SpotHitch v2.0.0</span>
      <button
        onclick="resetApp()"
        class="text-amber-500 hover:text-amber-400"
      >
        ${t('resetApp') || "Réinitialiser l'app"}
      </button>
    </div>
  `
}

// ==================== GLOBAL HANDLERS ====================

window.setProfileSubTab = (tab) => {
  window.setState?.({ profileSubTab: tab })
}

window.toggleSettingsSection = (sectionId) => {
  const state = window.getState?.() || {}
  const current = state.settingsOpenSection
  window.setState?.({ settingsOpenSection: current === sectionId ? null : sectionId })
}

// toggleProfileSection removed — profile info displayed directly, no accordion

// startTutorial is defined in main.js (canonical owner — includes tab change + step action)

window.handleLogout = async () => {
  try {
    const { logOut } = await import('../../services/firebase.js')
    await logOut()
    window.showToast?.(t('logoutSuccess') || 'Déconnexion réussie', 'success')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

// setLanguage is defined in main.js (single source of truth)

// toggleTheme — canonical in main.js (Profile.js is lazy-loaded)

window.toggleNotifications = () => {
  const state = window.getState?.() || {}
  window.setState?.({ notifications: state.notifications === false ? true : false })
  window.showToast?.(
    state.notifications === false ? (t('notificationsEnabled') || 'Notifications activées') : (t('notificationsDisabled') || 'Notifications désactivées'),
    'info'
  )
}

window.toggleProximityAlertsSetting = () => {
  /* not yet implemented */
}

window.openComingSoonProximity = () => {
  /* not yet implemented */
}

window.closeComingSoonProximity = () => {
  // No-op, kept for backward compat
}

window.editAvatar = () => {
  window.setState?.({ showWelcome: true })
}

window.openBlockedUsers = () => {
  window.setState?.({ showBlockedUsers: true })
}

window.closeBlockedUsers = () => {
  window.setState?.({ showBlockedUsers: false })
}

// --- Bio handlers (#61) ---
window.editBio = () => {
  const current = localStorage.getItem('spothitch_bio') || ''
  const newBio = prompt(t('bioPrompt') || 'À propos de toi (200 caractères max) :', current)
  if (newBio === null) return
  const trimmed = newBio.trim().slice(0, 200)
  localStorage.setItem('spothitch_bio', trimmed)
  window.showToast?.(t('bioSaved') || 'Bio enregistrée !', 'success')
  window._forceRender?.()
}

window.saveBio = async (text) => {
  const trimmed = (text || '').trim().slice(0, 200)
  localStorage.setItem('spothitch_bio', trimmed)
  syncProfileToFirestore({ bio: trimmed })
  window.showToast?.(t('bioSaved') || 'Bio enregistrée !', 'success')
  window._forceRender?.()
}

// --- Languages handlers (#59) ---
// D5: Language picker modal (no more prompt())
const POPULAR_LANGUAGES = [
  'Français', 'English', 'Español', 'Deutsch', 'Português', 'Italiano',
  'Русский', 'العربية', '中文', '日本語', 'हिन्दी', 'Nederlands',
  'Polski', 'Română', 'Türkçe', 'Svenska', 'Norsk', 'Dansk',
  'Suomi', 'Čeština', 'Magyar', 'Ελληνικά', 'Українська',
  'Bahasa Indonesia', 'Tiếng Việt', 'ภาษาไทย', '한국어',
  'فارسی', 'עברית', 'Kiswahili', 'Tagalog',
]

window.editLanguages = () => {
  window.setState?.({ showLanguagePicker: true, langPickerSearch: '' })
}

window.closeLanguagePicker = () => {
  window.setState?.({ showLanguagePicker: false })
}

window.langPickerFilter = (query) => {
  window.setState?.({ langPickerSearch: query })
}

window.selectLanguageFromPicker = (name) => {
  window.setState?.({ showLanguagePicker: false, langPickerSelectedName: name, langPickerLevel: 'courant' })
  // Show level selector
  setTimeout(() => window.setState?.({ showLanguageLevelPicker: true }), 100)
}

window.selectLanguageLevel = (level) => {
  const name = window.getState?.()?.langPickerSelectedName || ''
  if (!name) return
  const raw = JSON.parse(localStorage.getItem('spothitch_languages') || '[]')
  const langs = normalizeLangs(raw)
  langs.push({ name, flag: LANG_FLAG_MAP[name] || '🌐', level })
  const final = langs.slice(0, 10)
  localStorage.setItem('spothitch_languages', JSON.stringify(final))
  syncProfileToFirestore({ languages: final })
  window.showToast?.(t('languagesSaved') || 'Langue ajoutée !', 'success')
  window.setState?.({ showLanguageLevelPicker: false, langPickerSelectedName: null })
  window._forceRender?.()
}

window.closeLanguageLevelPicker = () => {
  window.setState?.({ showLanguageLevelPicker: false })
}

window.removeLanguage = (idx) => {
  const raw = JSON.parse(localStorage.getItem('spothitch_languages') || '[]')
  const langs = normalizeLangs(raw)
  langs.splice(idx, 1)
  localStorage.setItem('spothitch_languages', JSON.stringify(langs))
  syncProfileToFirestore({ languages: langs })
  window._forceRender?.()
}

window.cycleLanguageLevel = (idx) => {
  const raw = JSON.parse(localStorage.getItem('spothitch_languages') || '[]')
  const langs = normalizeLangs(raw)
  const levels = ['debutant', 'courant', 'natif']
  const cur = langs[idx]?.level || 'courant'
  langs[idx].level = levels[(levels.indexOf(cur) + 1) % levels.length]
  localStorage.setItem('spothitch_languages', JSON.stringify(langs))
  syncProfileToFirestore({ languages: langs })
  window._forceRender?.()
}

// D3: Social links handler
window.saveSocialLink = async (network, value) => {
  const social = JSON.parse(localStorage.getItem('spothitch_social_links') || '{}')
  social[network] = value.trim()
  localStorage.setItem('spothitch_social_links', JSON.stringify(social))
  syncProfileToFirestore({ socialLinks: social })
}

// D2: Photo gallery handlers
window.addProfilePhoto = async (input) => {
  const file = input?.files?.[0]
  if (!file) return
  const photos = JSON.parse(localStorage.getItem('spothitch_profile_photos') || '[]')
  if (photos.length >= 6) {
    window.showToast?.('Maximum 6 photos', 'warning')
    return
  }
  // Compress to WebP-like quality using canvas
  const img = new Image()
  img.onload = () => {
    const canvas = document.createElement('canvas')
    const maxSize = 400
    const scale = Math.min(maxSize / img.width, maxSize / img.height, 1)
    canvas.width = img.width * scale
    canvas.height = img.height * scale
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    const dataUrl = canvas.toDataURL('image/webp', 0.7) || canvas.toDataURL('image/jpeg', 0.7)
    photos.push(dataUrl)
    localStorage.setItem('spothitch_profile_photos', JSON.stringify(photos))
    window._forceRender?.()
  }
  img.src = URL.createObjectURL(file)
}

window.removeProfilePhoto = (idx) => {
  const photos = JSON.parse(localStorage.getItem('spothitch_profile_photos') || '[]')
  photos.splice(idx, 1)
  localStorage.setItem('spothitch_profile_photos', JSON.stringify(photos))
  window._forceRender?.()
}

// --- References handlers (#58) --- feature not yet implemented
window.openReferences = () => {
  /* not yet implemented */
}

window.closeReferences = () => { /* not yet implemented */ }

// --- Privacy controls handler (#62) ---
window.togglePrivacy = (key) => {
  const defaults = { showToNonFriends: true, showLocationHistory: false, showTravelStats: true }
  const privacy = JSON.parse(localStorage.getItem('spothitch_privacy') || JSON.stringify(defaults))
  privacy[key] = !privacy[key]
  localStorage.setItem('spothitch_privacy', JSON.stringify(privacy))
  import('../../services/firebaseSync.js').then(m => m.syncAllToFirestore()).catch(() => {})
  window._forceRender?.()
}

// shareTrip is defined in Planner.js (full async implementation)

// --- Stats detail views ---
window.openMySpots = () => window.setState?.({ profileDetailView: 'spots' })
window.openMyValidations = () => window.setState?.({ profileDetailView: 'validations' })
window.openMyCountries = () => window.setState?.({ profileDetailView: 'countries' })
window.closeProfileDetail = () => window.setState?.({ profileDetailView: null })

// --- Add past trip (Format C — journal style) ---
window.openAddPastTrip = () => window.setState?.({ showAddPastTrip: true })
window.closeAddPastTrip = () => window.setState?.({ showAddPastTrip: false })

window.submitPastTrip = () => {
  const from = document.getElementById('past-trip-from')?.value?.trim() || ''
  const to = document.getElementById('past-trip-to')?.value?.trim() || ''
  const date = document.getElementById('past-trip-date')?.value || ''
  const km = parseInt(document.getElementById('past-trip-km')?.value || '0', 10) || 0
  const lifts = parseInt(document.getElementById('past-trip-lifts')?.value || '0', 10) || 0
  const notes = document.getElementById('past-trip-note')?.value?.trim() || ''

  if (!from || !to) {
    window.showToast?.(t('tripFromToRequired') || 'Départ et arrivée requis', 'error')
    return
  }

  const id = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `manual_${Date.now()}`
  const trips = (() => {
    try { return JSON.parse(localStorage.getItem('spothitch_saved_trips') || '[]') }
    catch (e) { return [] }
  })()
  trips.push({
    id, from, to, date, distance: km, lifts, notes,
    completed: true, isManual: true,
    savedAt: new Date().toISOString(), finishedAt: new Date().toISOString(),
  })
  localStorage.setItem('spothitch_saved_trips', JSON.stringify(trips))
  // Sync to Firebase if user is logged in
  const user = window.getState?.()?.currentUser
  if (user?.uid) {
    import('../../services/firebase.js').then(fb => fb.saveTrip(user.uid, trips[trips.length - 1])).catch(() => {})
  }
  window.setState?.({ showAddPastTrip: false })
  window.showToast?.(t('tripSaved') || 'Voyage enregistré !', 'success')
  window._forceRender?.()
}

// ==================== ROADMAP HANDLERS ====================
// All roadmap features now use showFeatureIntro from FeatureIntroModal

window.openRoadmapFeature = (featureId) => {
  window.showFeatureIntro?.(featureId)
}

window.closeRoadmapFeature = () => {
  window.setState?.({ roadmapFeatureId: null })
}

window.roadmapVote = () => { window.showToast?.(t('roadmapDetail'), 'info') }

window.openProgressionStats = () => {
  window.setState?.({ showBadges: true })
}

window.acceptRoadmapIntro = () => {
  localStorage.setItem('spothitch_roadmap_intro_seen', '1')
  window._forceRender?.()
}

window.dismissRoadmapDetailIntro = () => {
  localStorage.setItem('spothitch_roadmap_detail_seen', '1')
  window._forceRender?.()
}

// --- City Pages Demo handlers ---

window.switchCityDemoTab = (btn, tabName) => {
  const container = btn.closest('[data-city-demo]')
  if (!container) return
  container.querySelectorAll('.cd-tab').forEach(t => t.classList.remove('cd-tab-active'))
  container.querySelectorAll('[data-cd-panel]').forEach(p => { p.style.display = 'none' })
  btn.classList.add('cd-tab-active')
  const panel = container.querySelector(`[data-cd-panel="${tabName}"]`)
  if (panel) panel.style.display = 'block'
}

window.showCityPageDemo = () => {
  // Remove existing overlay if any
  document.getElementById('city-page-demo-overlay')?.remove()

  const overlay = document.createElement('div')
  overlay.id = 'city-page-demo-overlay'
  overlay.className = 'fixed inset-0 z-80 bg-black/85 backdrop-blur-[8px] flex items-center justify-center overflow-y-auto'
  overlay.setAttribute('role', 'dialog')
  overlay.setAttribute('aria-modal', 'true')

  overlay.innerHTML = `
    <div id="city-demo-overlay-content" class="w-full max-w-[420px] m-4 relative">
      <!-- Close button -->
      <button onclick="closeCityPageDemo()" class="absolute top-2 right-2 z-5 bg-white/10 border-none text-white w-8 h-8 rounded-full text-[1.2rem] cursor-pointer flex items-center justify-center" aria-label="${escapeHTML(t('cityDemoCloseBtn') || 'Fermer')}">✕</button>

      <!-- Intro screen -->
      <div id="city-demo-intro-screen" class="bg-slate-800 rounded-2xl px-5 py-7 text-center">
        <div class="text-5xl mb-3">🏙️</div>
        <h2 class="text-[1.3rem] font-extrabold text-white m-0 mb-2">${escapeHTML(t('cityDemoIntroTitle') || 'Pages Villes')}</h2>
        <p class="text-[0.82rem] text-slate-400 leading-normal m-0 mb-4">${escapeHTML(t('cityDemoIntroDesc') || 'Chaque ville aura sa propre page enrichie par la communauté.')}</p>
        <div class="mx-auto mb-5 max-w-[340px]">
          <div class="flex items-start gap-2.5 text-left mb-2"><span class="text-[1.1rem] shrink-0 mt-px">🏙️</span><span class="text-[0.78rem] text-slate-300 leading-[1.4]">Chaque ville a sa propre page avec spots classés par direction, temps d'attente moyen et meilleure heure</span></div>
          <div class="flex items-start gap-2.5 text-left mb-2"><span class="text-[1.1rem] shrink-0 mt-px">💬</span><span class="text-[0.78rem] text-slate-300 leading-[1.4]">Conseils et astuces partagés par les autostoppeurs locaux — les meilleurs spots, les endroits à éviter</span></div>
          <div class="flex items-start gap-2.5 text-left mb-2"><span class="text-[1.1rem] shrink-0 mt-px">🏨</span><span class="text-[0.78rem] text-slate-300 leading-[1.4]">Où dormir pas cher : auberges triées par ambiance (Chill, Budget, Party) avec prix en temps réel</span></div>
          <div class="flex items-start gap-2.5 text-left mb-2"><span class="text-[1.1rem] shrink-0 mt-px">⚖️</span><span class="text-[0.78rem] text-slate-300 leading-[1.4]">Lois locales sur l'auto-stop, numéros d'urgence et phrases utiles dans la langue du pays</span></div>
          <div class="flex items-start gap-2.5 text-left mb-2"><span class="text-[1.1rem] shrink-0 mt-px">📊</span><span class="text-[0.78rem] text-slate-300 leading-[1.4]">Stats complètes : meilleure saison, types de spots, temps d'attente par moment de la journée</span></div>
        </div>
        <button onclick="startCityPageDemo()" class="bg-gradient-to-br from-amber-300 to-amber-600 text-dark-primary font-bold border-none px-7 py-3 rounded-xl text-[0.9rem] cursor-pointer">${escapeHTML(t('cityDemoIntroBtn') || 'Découvrir la démo')}</button>
      </div>

      <!-- Demo screen (hidden initially) -->
      <div id="city-demo-main-screen" class="hidden"></div>
    </div>
  `

  document.body.appendChild(overlay)
}

window.closeCityPageDemo = () => {
  document.getElementById('city-page-demo-overlay')?.remove()
}

window.startCityPageDemo = () => {
  const intro = document.getElementById('city-demo-intro-screen')
  const main = document.getElementById('city-demo-main-screen')
  if (!intro || !main) return

  intro.style.display = 'none'
  main.style.display = 'block'
  main.innerHTML = `
    <div data-city-demo="overlay" class="bg-dark-primary rounded-2xl p-3.5 border border-white/[0.06]">
      <!-- City Hero -->
      <div class="mb-2"><h3 class="text-[1.3rem] text-white m-0">🇫🇷 Paris</h3><div class="text-xs text-slate-400">France · Île-de-France</div></div>

      <!-- Dashboard stats -->
      <div class="grid grid-cols-2 gap-[5px] my-1.5">
        <div class="bg-dark-secondary rounded-lg p-2 text-center"><div class="text-[1.1rem] font-extrabold text-amber-300">43</div><div class="text-[0.5rem] text-slate-500 uppercase tracking-wide">Spots</div></div>
        <div class="bg-dark-secondary rounded-lg p-2 text-center"><div class="text-[1.1rem] font-extrabold text-amber-300">847</div><div class="text-[0.5rem] text-slate-500 uppercase tracking-wide">Lifts</div></div>
      </div>
      <div class="grid grid-cols-4 gap-1 mb-1">
        <div class="bg-dark-secondary rounded-lg p-1.5 text-center"><div class="text-[0.8rem] font-extrabold text-emerald-500">4.3</div><div class="text-[0.5rem] text-slate-500">Sécu</div></div>
        <div class="bg-dark-secondary rounded-lg p-1.5 text-center"><div class="text-[0.8rem] font-extrabold text-amber-500">3.8</div><div class="text-[0.5rem] text-slate-500">Trafic</div></div>
        <div class="bg-dark-secondary rounded-lg p-1.5 text-center"><div class="text-[0.8rem] font-extrabold text-emerald-500">4.1</div><div class="text-[0.5rem] text-slate-500">Accès</div></div>
        <div class="bg-dark-secondary rounded-lg p-1.5 text-center"><div class="text-[0.8rem] font-extrabold text-emerald-500">~25&rsquo;</div><div class="text-[0.5rem] text-slate-500">Attente</div></div>
      </div>

      <!-- CTA -->
      <div class="block bg-gradient-to-br from-amber-300 to-amber-600 text-dark-primary font-bold text-center p-2.5 rounded-[10px] my-2.5 text-[0.8rem]">📍 Ouvrir dans l&rsquo;app</div>

      <!-- Tabs -->
      <div class="flex gap-1 my-2 overflow-x-auto pb-1" style="-webkit-overflow-scrolling:touch">
        <span class="cd-tab cd-tab-active" onclick="switchCityDemoTab(this,'spots')" role="button" tabindex="0">📍 Spots</span>
        <span class="cd-tab" onclick="switchCityDemoTab(this,'conseils')" role="button" tabindex="0">💬 Conseils</span>
        <span class="cd-tab" onclick="switchCityDemoTab(this,'auberges')" role="button" tabindex="0">🏨 Dormir</span>
        <span class="cd-tab" onclick="switchCityDemoTab(this,'events')" role="button" tabindex="0">🎪 Events</span>
        <span class="cd-tab" onclick="switchCityDemoTab(this,'loi')" role="button" tabindex="0">⚖️ Loi</span>
        <span class="cd-tab" onclick="switchCityDemoTab(this,'pratique')" role="button" tabindex="0">🗣️ Pratique</span>
      </div>

      <!-- Panel: Spots -->
      <div data-cd-panel="spots" class="block">
        <div class="mt-2.5"><div class="text-xs font-bold text-amber-300 mb-1.5 flex items-center gap-[5px]"><span class="text-[0.9rem]">🧭</span> Directions</div>
          <div class="bg-dark-secondary rounded-lg px-2.5 py-2 mb-[5px] text-xs leading-[1.4] flex justify-between items-center"><div><strong>→ Lyon</strong><div class="text-[0.6rem] text-slate-500">5 spots · A6</div></div><div class="text-xs font-bold text-emerald-500">~25&rsquo;</div></div>
          <div class="bg-dark-secondary rounded-lg px-2.5 py-2 mb-[5px] text-xs leading-[1.4] flex justify-between items-center"><div><strong>→ Bruxelles</strong><div class="text-[0.6rem] text-slate-500">4 spots · A1</div></div><div class="text-xs font-bold text-emerald-500">~20&rsquo;</div></div>
          <div class="bg-dark-secondary rounded-lg px-2.5 py-2 mb-[5px] text-xs leading-[1.4] flex justify-between items-center"><div><strong>→ Nantes</strong><div class="text-[0.6rem] text-slate-500">3 spots · A11</div></div><div class="text-xs font-bold text-emerald-500">~30&rsquo;</div></div>
          <div class="bg-dark-secondary rounded-lg px-2.5 py-2 mb-[5px] text-xs leading-[1.4] flex justify-between items-center"><div><strong>→ Bordeaux</strong><div class="text-[0.6rem] text-slate-500">3 spots · A10</div></div><div class="text-xs font-bold text-emerald-500">~35&rsquo;</div></div>
        </div>
        <div class="mt-2.5"><div class="text-xs font-bold text-amber-300 mb-1.5 flex items-center gap-[5px]"><span class="text-[0.9rem]">⏰</span> Quand partir</div>
          <div class="grid grid-cols-4 gap-1">
            <div class="bg-emerald-500/[0.06] border border-emerald-500/30 rounded-md px-[3px] py-[5px] text-center"><div class="text-[0.9rem]">🌅</div><div class="text-[0.5rem] text-slate-500">Matin</div><div class="text-[0.7rem] font-bold text-emerald-500">~18&rsquo;</div></div>
            <div class="bg-dark-secondary rounded-md px-[3px] py-[5px] text-center"><div class="text-[0.9rem]">☀️</div><div class="text-[0.5rem] text-slate-500">Aprèm</div><div class="text-[0.7rem] font-bold text-amber-300">~28&rsquo;</div></div>
            <div class="bg-dark-secondary rounded-md px-[3px] py-[5px] text-center"><div class="text-[0.9rem]">🌆</div><div class="text-[0.5rem] text-slate-500">Soir</div><div class="text-[0.7rem] font-bold text-amber-300">~40&rsquo;</div></div>
            <div class="bg-dark-secondary rounded-md px-[3px] py-[5px] text-center"><div class="text-[0.9rem]">🌙</div><div class="text-[0.5rem] text-slate-500">Nuit</div><div class="text-[0.7rem] font-bold text-amber-300">~55&rsquo;</div></div>
          </div>
        </div>
        <div class="mt-2.5"><div class="text-xs font-bold text-amber-300 mb-1.5 flex items-center gap-[5px]"><span class="text-[0.9rem]">📊</span> Types de spots</div>
          <div class="flex h-2 rounded overflow-hidden my-1.5"><div class="w-[40%] bg-emerald-500 h-full"></div><div class="w-[30%] bg-red-500 h-full"></div><div class="w-[18%] bg-blue-500 h-full"></div><div class="w-[12%] bg-slate-400 h-full"></div></div>
          <div class="flex flex-wrap gap-2 text-[0.6rem] text-slate-400"><span><span class="w-1.5 h-1.5 rounded-full inline-block mr-[3px] align-middle bg-emerald-500"></span>Sortie 40%</span><span><span class="w-1.5 h-1.5 rounded-full inline-block mr-[3px] align-middle bg-red-500"></span>Station 30%</span><span><span class="w-1.5 h-1.5 rounded-full inline-block mr-[3px] align-middle bg-blue-500"></span>Route 18%</span><span><span class="w-1.5 h-1.5 rounded-full inline-block mr-[3px] align-middle bg-slate-400"></span>Autre 12%</span></div>
        </div>
      </div>

      <!-- Panel: Conseils -->
      <div data-cd-panel="conseils" class="hidden">
        <div class="mt-2.5"><div class="text-xs font-bold text-amber-300 mb-1.5 flex items-center gap-[5px]"><span class="text-[0.9rem]">💬</span> Conseils (12)</div>
          <div class="bg-dark-secondary border-l-2 border-l-amber-300 rounded-r-lg px-2.5 py-2 mb-[5px]"><div class="text-[0.72rem] leading-[1.35] italic">"Aire de Fleury sur l&rsquo;A6, direction Lyon. 15 min max."</div><div class="text-[0.58rem] text-slate-500 mt-[3px]">👤 RoadSophie · ⭐ 12</div></div>
          <div class="bg-dark-secondary border-l-2 border-l-amber-300 rounded-r-lg px-2.5 py-2 mb-[5px]"><div class="text-[0.72rem] leading-[1.35] italic">"Porte Maillot, terre-plein avant le périph → A1. Panneau &lsquo;Lille&rsquo; obligatoire."</div><div class="text-[0.58rem] text-slate-500 mt-[3px]">👤 MarcoHitch · ⭐ 8</div></div>
          <div class="bg-dark-secondary border-l-2 border-l-amber-300 rounded-r-lg px-2.5 py-2 mb-[5px]"><div class="text-[0.72rem] leading-[1.35] italic">"Évitez Porte d&rsquo;Orléans le vendredi soir. Samedi matin tôt = parfait."</div><div class="text-[0.58rem] text-slate-500 mt-[3px]">👤 LunaVoyage · ⭐ 5</div></div>
          <div class="bg-dark-secondary border-l-2 border-l-amber-300 rounded-r-lg px-2.5 py-2 mb-[5px]"><div class="text-[0.72rem] leading-[1.35] italic">"Station Total de Rungis, accès RER. Routiers vers le sud."</div><div class="text-[0.58rem] text-slate-500 mt-[3px]">👤 TomPouce34 · ⭐ 3</div></div>
        </div>
        <div class="mt-2.5"><div class="text-xs font-bold text-amber-300 mb-1.5 flex items-center gap-[5px]"><span class="text-[0.9rem]">✋</span> Méthode efficace</div>
          <div class="flex h-2 rounded overflow-hidden my-1.5"><div class="w-[58%] bg-amber-300 h-full"></div><div class="w-[33%] bg-emerald-500 h-full"></div><div class="w-[9%] bg-blue-500 h-full"></div></div>
          <div class="flex flex-wrap gap-2 text-[0.6rem] text-slate-400"><span><span class="w-1.5 h-1.5 rounded-full inline-block mr-[3px] align-middle bg-amber-300"></span>Panneau 58%</span><span><span class="w-1.5 h-1.5 rounded-full inline-block mr-[3px] align-middle bg-emerald-500"></span>Pouce 33%</span><span><span class="w-1.5 h-1.5 rounded-full inline-block mr-[3px] align-middle bg-blue-500"></span>Demander 9%</span></div>
        </div>
      </div>

      <!-- Panel: Auberges -->
      <div data-cd-panel="auberges" class="hidden">
        <div class="mt-2.5"><div class="text-xs font-bold text-amber-300 mb-1.5 flex items-center gap-[5px]"><span class="text-[0.9rem]">🏨</span> Où dormir pas cher</div>
          <div class="bg-dark-secondary rounded-lg px-2.5 py-2 mb-[5px] flex gap-2 items-center"><div class="text-[1.3rem]">💰</div><div class="flex-1"><div class="text-xs font-semibold">Le Village Hostel</div><div class="text-[0.6rem] text-slate-500">Montmartre · Vue Sacré-Cœur</div></div><div class="text-[0.7rem] font-bold text-emerald-500">19€</div></div>
          <div class="bg-dark-secondary rounded-lg px-2.5 py-2 mb-[5px] flex gap-2 items-center"><div class="text-[1.3rem]">🎉</div><div class="flex-1"><div class="text-xs font-semibold">St Christopher&rsquo;s Inn</div><div class="text-[0.6rem] text-slate-500">Gare du Nord · Bar intégré</div></div><div class="text-[0.7rem] font-bold text-emerald-500">22€</div></div>
          <div class="bg-dark-secondary rounded-lg px-2.5 py-2 mb-[5px] flex gap-2 items-center"><div class="text-[1.3rem]">🌍</div><div class="flex-1"><div class="text-xs font-semibold">Plug Inn Hostel</div><div class="text-[0.6rem] text-slate-500">Montmartre · Petit-déj inclus</div></div><div class="text-[0.7rem] font-bold text-emerald-500">24€</div></div>
          <div class="bg-dark-secondary rounded-lg px-2.5 py-2 mb-[5px] flex gap-2 items-center"><div class="text-[1.3rem]">🤝</div><div class="flex-1"><div class="text-xs font-semibold">Les Piaules</div><div class="text-[0.6rem] text-slate-500">Belleville · Design</div></div><div class="text-[0.7rem] font-bold text-emerald-500">25€</div></div>
          <div class="bg-dark-secondary rounded-lg px-2.5 py-2 mb-[5px] flex gap-2 items-center"><div class="text-[1.3rem]">😴</div><div class="flex-1"><div class="text-xs font-semibold">Generator Paris</div><div class="text-[0.6rem] text-slate-500">Colonel Fabien · Rooftop</div></div><div class="text-[0.7rem] font-bold text-emerald-500">28€</div></div>
        </div>
        <div class="bg-dark-secondary border-l-2 border-l-amber-300 rounded-r-lg px-2.5 py-2 text-[0.68rem]">💡 Prix = dortoir, basse saison. Haute saison : +30-50%</div>
      </div>

      <!-- Panel: Events -->
      <div data-cd-panel="events" class="hidden">
        <div class="mt-2.5"><div class="text-xs font-bold text-amber-300 mb-1.5 flex items-center gap-[5px]"><span class="text-[0.9rem]">🎪</span> Prochains événements</div>
          <div class="bg-dark-secondary rounded-lg px-2.5 py-2 mb-[5px]"><div class="text-xs font-semibold">🎶 Fête de la Musique</div><div class="text-[0.6rem] text-amber-300">21 juin 2026</div><div class="text-[0.6rem] text-slate-400 mt-0.5">Concerts gratuits — lifts faciles le lendemain</div></div>
          <div class="bg-dark-secondary rounded-lg px-2.5 py-2 mb-[5px]"><div class="text-xs font-semibold">🎆 14 Juillet</div><div class="text-[0.6rem] text-amber-300">14 juillet 2026</div><div class="text-[0.6rem] text-slate-400 mt-0.5">Feux d&rsquo;artifice — éviter l&rsquo;A6 le 15</div></div>
          <div class="bg-dark-secondary rounded-lg px-2.5 py-2 mb-[5px]"><div class="text-xs font-semibold">🎨 Nuit Blanche</div><div class="text-[0.6rem] text-amber-300">3 oct 2026</div><div class="text-[0.6rem] text-slate-400 mt-0.5">Art toute la nuit — transports gratuits</div></div>
        </div>
        <div class="mt-2.5"><div class="text-xs font-bold text-amber-300 mb-1.5 flex items-center gap-[5px]"><span class="text-[0.9rem]">🌡️</span> Meilleure saison</div>
          <div class="grid grid-cols-4 gap-1">
            <div class="bg-dark-secondary rounded-md px-[3px] py-[5px] text-center"><div class="text-[0.9rem]">❄️</div><div class="text-[0.5rem] text-slate-500">Hiver</div><div class="text-[0.7rem] font-bold text-red-500">2/5</div></div>
            <div class="bg-dark-secondary rounded-md px-[3px] py-[5px] text-center"><div class="text-[0.9rem]">🌸</div><div class="text-[0.5rem] text-slate-500">Print.</div><div class="text-[0.7rem] font-bold text-amber-300">4/5</div></div>
            <div class="bg-emerald-500/[0.06] border border-emerald-500/30 rounded-md px-[3px] py-[5px] text-center"><div class="text-[0.9rem]">☀️</div><div class="text-[0.5rem] text-slate-500">Été</div><div class="text-[0.7rem] font-bold text-emerald-500">5/5</div></div>
            <div class="bg-dark-secondary rounded-md px-[3px] py-[5px] text-center"><div class="text-[0.9rem]">🍂</div><div class="text-[0.5rem] text-slate-500">Auto.</div><div class="text-[0.7rem] font-bold text-amber-300">3/5</div></div>
          </div>
        </div>
      </div>

      <!-- Panel: Loi -->
      <div data-cd-panel="loi" class="hidden">
        <div class="text-center my-2.5"><span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-[20px] text-[0.7rem] font-semibold bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">✅ Légal en France</span></div>
        <div class="mt-2.5"><div class="text-xs font-bold text-amber-300 mb-1.5 flex items-center gap-[5px]"><span class="text-[0.9rem]">📜</span> Règles</div>
          <div class="bg-dark-secondary rounded-lg px-2.5 py-2 mb-[5px] text-xs leading-[1.4]">🚫 <strong>Autoroute</strong> — interdit sur la voie, OK sur bretelles/aires</div>
          <div class="bg-dark-secondary rounded-lg px-2.5 py-2 mb-[5px] text-xs leading-[1.4]">⚠️ <strong>Périph</strong> — interdit, mais portes de Paris OK</div>
          <div class="bg-dark-secondary rounded-lg px-2.5 py-2 mb-[5px] text-xs leading-[1.4]">✅ <strong>Nationales</strong> — aucune restriction</div>
        </div>
        <div class="mt-2.5"><div class="text-xs font-bold text-amber-300 mb-1.5 flex items-center gap-[5px]"><span class="text-[0.9rem]">📞</span> Urgences</div>
          <div class="grid grid-cols-3 gap-[5px]">
            <div class="bg-dark-secondary rounded-lg p-1.5 text-center"><div class="text-[0.9rem]">🚑</div><div class="text-[0.5rem] text-slate-500">15</div></div>
            <div class="bg-dark-secondary rounded-lg p-1.5 text-center"><div class="text-[0.9rem]">🚔</div><div class="text-[0.5rem] text-slate-500">17</div></div>
            <div class="bg-dark-secondary rounded-lg p-1.5 text-center"><div class="text-[0.9rem]">🚒</div><div class="text-[0.5rem] text-slate-500">18</div></div>
          </div>
        </div>
      </div>

      <!-- Panel: Pratique -->
      <div data-cd-panel="pratique" class="hidden">
        <div class="mt-2.5"><div class="text-xs font-bold text-amber-300 mb-1.5 flex items-center gap-[5px]"><span class="text-[0.9rem]">🗣️</span> Phrases utiles</div>
          <div class="bg-dark-secondary rounded-md px-2 py-1.5 mb-1 flex justify-between items-center"><div class="text-[0.72rem] font-semibold">Je vais à Lyon</div><div class="text-[0.65rem] text-slate-500">I&rsquo;m going to Lyon</div></div>
          <div class="bg-dark-secondary rounded-md px-2 py-1.5 mb-1 flex justify-between items-center"><div class="text-[0.72rem] font-semibold">Quelle direction ?</div><div class="text-[0.65rem] text-slate-500">Which way?</div></div>
          <div class="bg-dark-secondary rounded-md px-2 py-1.5 mb-1 flex justify-between items-center"><div class="text-[0.72rem] font-semibold">Déposez-moi ici</div><div class="text-[0.65rem] text-slate-500">Drop me here</div></div>
          <div class="bg-dark-secondary rounded-md px-2 py-1.5 mb-1 flex justify-between items-center"><div class="text-[0.72rem] font-semibold">Merci pour le lift !</div><div class="text-[0.65rem] text-slate-500">Thanks for the ride!</div></div>
        </div>
        <div class="mt-2.5"><div class="text-xs font-bold text-amber-300 mb-1.5 flex items-center gap-[5px]"><span class="text-[0.9rem]">💱</span> Monnaie & budget</div>
          <div class="grid grid-cols-2 gap-[5px]">
            <div class="bg-dark-secondary rounded-lg p-2 text-center"><div class="text-[0.9rem] font-extrabold text-amber-300">€</div><div class="text-[0.5rem] text-slate-500">Euro</div></div>
            <div class="bg-dark-secondary rounded-lg p-2 text-center"><div class="text-[0.85rem] font-extrabold text-amber-300">~15€</div><div class="text-[0.5rem] text-slate-500">Budget/jour</div></div>
          </div>
          <div class="bg-dark-secondary rounded-lg px-2.5 py-2 text-[0.68rem] mt-1 leading-[1.4]">☕ Café : 1.50€ · 🥖 Baguette : 1.10€ · 🚇 Métro : 2.15€ · 🍕 Pizza : 8€</div>
        </div>
        <div class="mt-2.5"><div class="text-xs font-bold text-amber-300 mb-1.5 flex items-center gap-[5px]"><span class="text-[0.9rem]">🌐</span> Villes proches</div>
          <div class="flex items-center gap-2 bg-dark-secondary rounded-lg px-2.5 py-1.5 mb-1"><div class="text-[0.8rem] font-extrabold text-amber-300 min-w-[20px]">→</div><div class="flex-1"><div class="text-[0.72rem] font-semibold">Lyon</div><div class="text-[0.58rem] text-slate-500">465 km · 52 spots</div></div><div class="text-[0.72rem] font-bold text-emerald-500">~25&rsquo;</div></div>
          <div class="flex items-center gap-2 bg-dark-secondary rounded-lg px-2.5 py-1.5 mb-1"><div class="text-[0.8rem] font-extrabold text-amber-300 min-w-[20px]">→</div><div class="flex-1"><div class="text-[0.72rem] font-semibold">Bruxelles</div><div class="text-[0.58rem] text-slate-500">310 km · 18 spots</div></div><div class="text-[0.72rem] font-bold text-emerald-500">~20&rsquo;</div></div>
          <div class="flex items-center gap-2 bg-dark-secondary rounded-lg px-2.5 py-1.5 mb-1"><div class="text-[0.8rem] font-extrabold text-amber-300 min-w-[20px]">→</div><div class="flex-1"><div class="text-[0.72rem] font-semibold">Nantes</div><div class="text-[0.58rem] text-slate-500">385 km · 31 spots</div></div><div class="text-[0.72rem] font-bold text-emerald-500">~30&rsquo;</div></div>
        </div>
      </div>

    </div>
  `
}

export default { renderProfile }
