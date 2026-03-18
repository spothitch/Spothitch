/**
 * Main App Component
 * Orchestrates all views and modals
 *
 * Structure:
 * - Map (Carte): Full map with search, trip planner, guides, add spot
 * - Activities (Activités): Gamification hub
 * - Social: Chat + Friends
 * - Profile: User info + Settings
 */

import { renderHeader } from './Header.js';
import { renderNavigation } from './Navigation.js';
import { getState } from '../stores/state.js';
import { t } from '../i18n/index.js';
import { haversineKm } from '../utils/geo.js';

// Core views — only Home is eagerly loaded (default tab)
import { renderHome } from './views/Home.js';
import { renderCityPanel } from './views/CityPanel.js';

// Core UI — always visible
import { renderCookieBanner } from './modals/CookieBanner.js';
import { renderBetaBanner } from './modals/BetaBanner.js';
import { icon } from '../utils/icons.js'
import { trapFocus } from '../utils/a11y.js'
import { registerMarkerImages, getMarkerType } from '../utils/mapMarkers.js'
import { applyTripFilter } from '../utils/tripFilters.js'

// Everything else is lazy-loaded on demand via lazyRender() below

// Lazy module registry — each entry uses a static string so Vite can bundle them as chunks
const _lazyLoaders = {
  renderLanding: () => import('./Landing.js'),
  renderDraftBanner: () => import('../services/spotDrafts.js'),
  renderAgeVerification: () => import('./modals/AgeVerification.js'),
  renderIdentityVerification: () => import('./modals/IdentityVerification.js'),
  renderSpotDetail: () => import('./modals/SpotDetail.js'),
  renderAddSpot: () => import('./modals/AddSpot.js'),
  // ValidateSpot removed — validation uses AddSpot in validation mode (addSpotValidateId)
  renderSOS: () => import('./modals/SOS.js'),
  renderAuth: () => import('./modals/Auth.js'),
  renderCompleteProfile: () => import('./modals/Auth.js'),
  renderFiltersModal: () => import('./modals/Filters.js'),
  renderStatsModal: () => import('./modals/Stats.js'),
  renderBadgesModal: () => import('./modals/Badges.js'),
  renderBadgePopup: () => import('./modals/Badges.js'),
  renderBadgeDetail: () => import('./modals/Badges.js'),
  renderChallengesModal: () => import('./modals/Challenges.js'),
  renderShopModal: () => import('./modals/Shop.js'),
  renderMyRewardsModal: () => import('./modals/Shop.js'),
  renderQuiz: () => import('./modals/Quiz.js'),
  renderLeaderboardModal: () => import('./modals/Leaderboard.js'),
  renderCheckinModal: () => import('./modals/CheckinModal.js'),
  renderDailyRewardModal: () => import('./modals/DailyReward.js'),
  renderNavigationOverlay: () => import('./ui/NavigationOverlay.js'),
  renderDonationModal: () => import('./ui/DonationCard.js'),
  renderThankYouModal: () => import('./ui/DonationCard.js'),
  renderCustomizationModal: () => import('../services/profileCustomization.js'),
  renderNearbyFriendsList: () => import('../services/nearbyFriends.js'),
  renderNearbyFriendsWidget: () => import('../services/nearbyFriends.js'),
  renderReportModal: () => import('../services/moderation.js'),
  renderBlockModal: () => import('../services/userBlocking.js'),
  renderBlockedUsersList: () => import('../services/userBlocking.js'),
  renderAccessibilityHelp: () => import('../services/screenReader.js'),
  renderTeamDashboard: () => import('../services/teamChallenges.js'),
  renderSOSTrackingWidget: () => import('../services/sosTracking.js'),
  renderProximityAlert: () => import('../services/proximityNotify.js'),
  renderAdminPanel: () => import('./modals/AdminPanel.js'),
  renderMyDataModal: () => import('./modals/MyData.js'),
  renderTitlesModal: () => import('./modals/TitlesModal.js'),
  renderFriendProfileModal: () => import('./modals/FriendProfile.js'),
  renderContactFormModal: () => import('./modals/ContactForm.js'),
  renderDeleteAccountModal: () => import('./modals/DeleteAccount.js'),
  renderCompanionModal: () => import('./modals/Companion.js'),
  renderTripHistory: () => import('../services/tripHistory.js'),
  renderFAQ: () => import('./views/FAQ.js'),
  renderLegalPage: () => import('./views/Legal.js'),
  renderGuides: () => import('./views/Guides.js'),
  renderTravel: () => import('./views/Travel.js'),
  renderVoyage: () => import('./views/Voyage.js'),
  renderWelcome: () => import('./modals/Welcome.js'),
  renderChallengesHub: () => import('./views/ChallengesHub.js'),
  renderSocial: () => import('./views/Social.js'),
  renderProfile: () => import('./views/Profile.js'),
  renderSpots: () => import('./views/Spots.js'),
  renderAddFriendModal: () => import('./views/Friends.js'),
  renderUnblockModal: () => import('../services/userBlocking.js'),
  renderSafety: () => import('./views/Guides.js'),
  renderLocationPermission: () => import('./modals/LocationPermission.js'),
  renderInstallBanner: () => import('../utils/pwa.js'),
  renderLanguageSelector: () => import('./modals/LanguageSelector.js'),
  renderFeedbackPanel: () => import('./modals/FeedbackPanel.js'),
  renderGuideNudge: () => import('./modals/GuideNudge.js'),
}

// Lazy-loaded module cache
const _lazyCache = {}
function lazyRender(exportName, ...args) {
  if (_lazyCache[exportName]) return _lazyCache[exportName](...args)
  const loader = _lazyLoaders[exportName]
  if (loader) {
    loader().then(mod => {
      _lazyCache[exportName] = mod[exportName]
      // Trigger re-render so the loaded component appears
      // Use _forceRender (bypasses dirty-checking + fingerprint)
      if (window._forceRender) window._forceRender()
      else if (window.setState) window.setState({})
    })
  }
  return ''
}

// Store active focus trap cleanup function
let _activeFocusTrapCleanup = null

/**
 * Render the complete application
 */
/**
 * Render the app shell with persistent tab panels.
 * Tab panels are created once and shown/hidden via display:none.
 * Only the active tab content is re-rendered on state changes.
 */
export function renderApp(state) {
  const isVoyageMapFirst = state.activeTab === 'challenges' && state.tripResults && state.tripFormCollapsed
  const activePanel = getActiveTabPanelId(state)

  const mainContent = `
    <a href="#main-content" class="skip-link">
      ${t('skipToContent') || 'Aller au contenu principal'}
    </a>

    <div id="app-header">
      ${isVoyageMapFirst ? '' : renderHeader(state)}
    </div>

    <main id="main-content" class="${isVoyageMapFirst ? 'min-h-screen overflow-x-hidden' : 'pb-28 pt-[4.5rem] min-h-screen overflow-x-hidden'}" role="main" tabindex="-1">
      <div id="panel-map" role="tabpanel" aria-labelledby="tab-map" style="${activePanel === 'map' ? '' : 'display:none'}">
        ${renderHome(state)}
      </div>
      <div id="panel-challenges" role="tabpanel" aria-labelledby="tab-challenges" style="${activePanel === 'challenges' ? '' : 'display:none'}">
        ${activePanel === 'challenges' ? lazyRender('renderVoyage', state) : ''}
      </div>
      <div id="panel-social" role="tabpanel" aria-labelledby="tab-social" style="${activePanel === 'social' ? '' : 'display:none'}">
        ${activePanel === 'social' ? lazyRender('renderSocial', state) : ''}
      </div>
      <div id="panel-profile" role="tabpanel" aria-labelledby="tab-profile" style="${activePanel === 'profile' ? '' : 'display:none'}">
        ${activePanel === 'profile' ? lazyRender('renderProfile', state) : ''}
      </div>
      <div id="panel-spots" role="tabpanel" aria-labelledby="tab-spots" style="${activePanel === 'spots' ? '' : 'display:none'}">
        ${activePanel === 'spots' ? lazyRender('renderSpots', state) : ''}
      </div>
    </main>

    <div id="app-nav">${renderNavigation(state)}</div>
    <div id="app-overlays">${renderOverlays(state)}</div>
    <div id="app-modals">${renderModals(state)}</div>

  `

  // Landing overlay for first-time visitors (map loads behind it)
  if (state.showLanding) {
    return mainContent + lazyRender('renderLanding')
  }

  return mainContent
}

/**
/**
 * Check if the current tab is a map tab
 */
export function isMapTab(state) {
  return ['map', 'fullmap', 'home', 'travel', 'planner'].includes(state.activeTab) || !state.activeTab
}

/**
 * Render the active view based on current tab
 * Note: Map is rendered separately in panel-map (A8)
 */
export function renderActiveView(state) {
  switch (state.activeTab) {
    case 'challenges':
      return lazyRender('renderVoyage', state);
    case 'social':
    case 'chat':
      return lazyRender('renderSocial', state);
    case 'profile':
      return lazyRender('renderProfile', state);
    case 'spots':
      return lazyRender('renderSpots', state);
    default:
      return '' // Map handled by panel-map
  }
}

/**
 * Get the panel id for the current active tab
 */
export function getActiveTabPanelId(state) {
  if (isMapTab(state)) return 'map'
  if (state.activeTab === 'social' || state.activeTab === 'chat') return 'social'
  return state.activeTab || 'map'
}

/**
 * Render full-screen offline panel (Guides + Offline downloads)
 */
function renderOfflinePanel(state) {
  const offlineCountries = (() => {
    try { return JSON.parse(localStorage.getItem('spothitch_offline_countries') || '[]') } catch { return [] }
  })()

  // Country display names via Intl
  const lang = state.lang || 'fr'
  let displayNames
  try { displayNames = new Intl.DisplayNames([lang], { type: 'region' }) } catch { displayNames = { of: c => c } }
  const countryName = (code) => { try { return displayNames.of(code) || code } catch { return code } }

  // Flag from country code
  const countryFlag = (code) => {
    try {
      return String.fromCodePoint(...[...code.toUpperCase()].map(c => 0x1F1E6 + c.charCodeAt(0) - 65))
    } catch { return '🌍' }
  }

  // Spot counts per country from spotIndex (loaded by openOfflinePanel)
  const spotIndex = state._spotIndex || null
  // Build a code→count map from the array-based index
  const spotCounts = {}
  if (spotIndex?.countries) {
    for (const c of spotIndex.countries) spotCounts[c.code] = c.count || 0
  }

  // Split: top 3 by spot count + rest alphabetically
  const downloadedCodes = new Set(offlineCountries.map(c => c.code))
  const allAvailable = (Object.keys(spotCounts).length > 0
    ? spotIndex.countries.map(c => c.code)
    : ['FR','DE','CZ','ES','NL','PL','AT','GB','DK','BE','CH','IT','HR','FI','AL','SE','HU','BA','BG','RO','EE','GR','RS','CA','LT','TR','NO','SI','AU','GE','SK','AR','US','LV','MA','PT','JP','MK','NZ','CL','ME','AM','BR','IE','UA','CO','IS','XK','KZ','MX']
  ).filter(c => !downloadedCodes.has(c))
  // Top 3 by spot count
  const top3 = [...allAvailable].sort((a, b) => (spotCounts[b] || 0) - (spotCounts[a] || 0)).slice(0, 3)
  const top3Set = new Set(top3)
  // Rest sorted alphabetically by localized name
  const restCountries = allAvailable.filter(c => !top3Set.has(c)).sort((a, b) => countryName(a).localeCompare(countryName(b), lang))

  // Estimate total size: spots JSON (~0.5 KB/spot) + map tiles (~1.5 MB base) + stations
  const getSpotCount = (code) => spotCounts[code] || 0
  const estimateSize = (code) => {
    const count = getSpotCount(code)
    if (count === 0) return ''
    const spotKB = Math.round(count * 0.5)
    const tilesKB = 1500 // ~1.5 MB base for map tiles
    const totalKB = spotKB + tilesKB
    return totalKB >= 1000 ? `~${(totalKB / 1024).toFixed(1)} MB` : `~${totalKB} KB`
  }

  const estimateDownloadedSize = (c) => {
    if (c.tileSizeMB) return (c.tileSizeMB + (c.count || 0) * 0.0005).toFixed(1)
    return ((c.count || 0) * 0.5 / 1024 + 1.5).toFixed(1)
  }
  const totalSizeMB = offlineCountries.reduce((sum, c) => sum + parseFloat(estimateDownloadedSize(c)), 0).toFixed(1)

  const renderDownloadedRow = (c) => {
    const flag = countryFlag(c.code)
    const name = countryName(c.code)
    return `
      <div class="flex items-center gap-3 px-4 py-3" style="border-bottom:1px solid rgba(255,255,255,0.05)">
        <span class="text-2xl">${flag}</span>
        <div class="flex-1 min-w-0">
          <div class="text-sm font-medium">${name}</div>
          <div class="text-xs text-slate-400">${c.count || 0} spots · ~${estimateDownloadedSize(c)} MB</div>
        </div>
        <button onclick="deleteOfflineCountry('${c.code}')" class="px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap" style="background:rgba(16,185,129,0.15);color:#34d399;border:1px solid rgba(16,185,129,0.2)" type="button">✓ ${t('offlineSaved') || 'Sauvé'}</button>
      </div>`
  }

  const renderAvailableRow = (code) => {
    const flag = countryFlag(code)
    const name = countryName(code)
    const spotCount = getSpotCount(code)
    const size = estimateSize(code)
    const downloading = state.offlineDownloadingCountry === code
    const progress = state.offlineDownloadProgress || 0

    const downloadBtn = downloading
      ? `<button class="relative px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap overflow-hidden min-w-[90px]" style="background:rgba(245,158,11,0.1);color:#fbbf24;border:1px solid rgba(245,158,11,0.3)" type="button" disabled>
          <div style="position:absolute;inset:0;background:rgba(245,158,11,0.25);width:${progress}%;transition:width 0.3s ease;border-radius:7px"></div>
          <span style="position:relative">${progress}%</span>
        </button>`
      : `<button id="dl-btn-${code}" onclick="downloadCountryForOffline('${code}')" class="px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap" style="background:rgba(245,158,11,0.2);color:#fbbf24;border:1px solid rgba(245,158,11,0.3)" type="button">${t('downloadOffline') || 'Télécharger'}</button>`

    return `
      <div class="flex items-center gap-3 px-4 py-3" style="border-bottom:1px solid rgba(255,255,255,0.05)">
        <span class="text-2xl">${flag}</span>
        <div class="flex-1 min-w-0">
          <div class="text-sm font-medium">${name}</div>
          <div class="text-xs text-slate-400">${spotCount > 0 ? `${spotCount} spots` : ''}${spotCount > 0 && size ? ' · ' : ''}${size}</div>
        </div>
        ${downloadBtn}
      </div>`
  }

  return `
    <!-- Backdrop -->
    <div class="fixed inset-0 z-[55]" style="background:rgba(0,0,0,0.5)" onclick="closeOfflinePanel()" tabindex="0" role="dialog" aria-modal="true"></div>
    <!-- Bottom sheet -->
    <div class="fixed bottom-[56px] left-0 right-0 z-[60]" style="max-height:70vh;background:linear-gradient(180deg,#1e293b 0%,#0f172a 100%);border-radius:20px 20px 0 0;border-top:1px solid #334155">
      <!-- Handle -->
      <div class="flex justify-center pt-3 pb-1"><div class="w-10 h-1 rounded-full bg-slate-600"></div></div>
      <!-- Header -->
      <div class="px-4 pb-3">
        <h2 class="text-base font-bold">${t('offlinePanelTitle') || 'Spots hors-ligne'}</h2>
        <p class="text-xs text-slate-400 mt-0.5">${t('offlineHint') || 'Télécharge des pays pour les consulter sans internet'}</p>
      </div>
      <!-- Country list -->
      <div style="overflow-y:auto;max-height:calc(70vh - 140px)">
        ${offlineCountries.length > 0 ? `<div class="px-4 pt-2 pb-1"><span class="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">${t('offlineSaved') || 'Sauvé'}</span></div>` : ''}
        ${offlineCountries.map(c => renderDownloadedRow(c)).join('')}
        ${top3.length > 0 ? `<div class="px-4 pt-3 pb-1"><span class="text-[10px] font-semibold text-amber-400 uppercase tracking-wider">${t('popular') || 'Populaires'}</span></div>` : ''}
        ${top3.map(code => renderAvailableRow(code)).join('')}
        ${restCountries.length > 0 ? `<div class="px-4 pt-3 pb-1"><span class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">A — Z</span></div>` : ''}
        ${restCountries.map(code => renderAvailableRow(code)).join('')}
      </div>
      <!-- Footer -->
      <div class="px-4 py-3 flex items-center justify-between" style="border-top:1px solid rgba(255,255,255,0.05)">
        <span class="text-xs text-slate-400">${offlineCountries.length} ${t('autoOfflineSyncCountries') || 'pays'} · ${totalSizeMB} MB</span>
        ${offlineCountries.length > 0 ? `<button onclick="clearAllOfflineData()" class="text-xs text-red-400/60" type="button">${t('clearAllOffline') || 'Tout supprimer'}</button>` : ''}
      </div>
    </div>`
}

/**
 * Render modals section only (for selective rendering)
 */
export function renderModals(state) {
  return `
    ${state.showAgeVerification ? lazyRender('renderAgeVerification', state) : ''}
    ${state.showIdentityVerification ? lazyRender('renderIdentityVerification') : ''}
    ${state.selectedSpot ? lazyRender('renderSpotDetail', state) : ''}
    ${state.showAddSpot ? lazyRender('renderAddSpot', state) : ''}
    ${''}<!-- ValidateSpot removed — uses AddSpot validation mode -->
    ${state.showSOS ? lazyRender('renderSOS', state) : ''}
    ${state.showAuth ? lazyRender('renderAuth', state) : ''}
    ${state.showCompleteProfile ? lazyRender('renderCompleteProfile', state) : ''}
    ${''}<!-- Tutorial retired -->
    ${state.showFilters ? lazyRender('renderFiltersModal') : ''}
    ${state.showStats ? lazyRender('renderStatsModal') : ''}
    ${state.showBadges ? lazyRender('renderBadgesModal') : ''}
    ${state.showChallenges ? lazyRender('renderChallengesModal') : ''}
    ${state.showShop ? lazyRender('renderShopModal') : ''}
    ${state.showMyRewards ? lazyRender('renderMyRewardsModal') : ''}
    ${state.showQuiz ? lazyRender('renderQuiz') : ''}
    ${state.showLeaderboard ? lazyRender('renderLeaderboardModal') : ''}
    ${state.checkinSpot ? lazyRender('renderCheckinModal', state) : ''}
    ${state.showDailyReward ? lazyRender('renderDailyRewardModal') : ''}
    ${state.showBadgePopup ? lazyRender('renderBadgePopup') : ''}
    ${state.showBadgeDetail ? lazyRender('renderBadgeDetail', state.selectedBadgeId) : ''}
    ${state.navigationActive ? lazyRender('renderNavigationOverlay', state) : ''}
    ${state.showDonation ? lazyRender('renderDonationModal', state) : ''}
    ${state.showDonationThankYou ? lazyRender('renderThankYouModal', state) : ''}
    ${state.showAmbassadorSuccess ? renderAmbassadorSuccessModal(state) : ''}
    ${state.showContactAmbassador && state.selectedAmbassador ? renderContactAmbassadorModal(state) : ''}
    ${state.showProfileCustomization ? lazyRender('renderCustomizationModal', state) : ''}
    ${state.showNearbyFriends ? lazyRender('renderNearbyFriendsList', state) : ''}
    ${state.showReport ? lazyRender('renderReportModal', state) : ''}
    ${state.showBlockModal ? lazyRender('renderBlockModal', state.blockTargetId, state.blockTargetName) : ''}
    ${state.showBlockedUsers ? renderBlockedUsersModal(state) : ''}
    ${state.showAccessibilityHelp ? lazyRender('renderAccessibilityHelp', state) : ''}
    ${state.showTeamChallenges ? renderTeamChallengesModal(state) : ''}
    ${state.showCreateTeam ? renderCreateTeamModal(state) : ''}
    ${state.showTripHistory ? renderTripHistoryModal(state) : ''}
    ${state.showFAQ ? renderFAQModal(state) : ''}
    ${state.showLegal ? renderLegalModal(state) : ''}
    ${state.showAddFriend ? lazyRender('renderAddFriendModal', state) : ''}
    ${state.showUnblockModal ? lazyRender('renderUnblockModal', state.unblockTargetId, state.unblockTargetName) : ''}
    ${state.showSafety ? lazyRender('renderSafety') : ''}
    ${state.showLocationPermission ? lazyRender('renderLocationPermission', state) : ''}
    ${state.showInstallBanner ? lazyRender('renderInstallBanner') : ''}
    ${state.showLanguageSelector ? lazyRender('renderLanguageSelector', state) : ''}
    ${''}<!-- Welcome modal removed — redundant with landing carousel -->
    <!-- Coming-soon modals removed: now use showFeatureIntro() from FeatureIntroModal -->
    ${state.showMyData ? lazyRender('renderMyDataModal') : ''}
    ${state.showTitles ? lazyRender('renderTitlesModal', state) : ''}
    ${state.showFriendProfile ? lazyRender('renderFriendProfileModal', state) : ''}
    ${state.showContactForm ? lazyRender('renderContactFormModal') : ''}
    ${state.showDeleteAccount ? lazyRender('renderDeleteAccountModal', state) : ''}
    ${state.showCompanionModal ? lazyRender('renderCompanionModal', state) : ''}
    ${state.showFeedbackPanel ? lazyRender('renderFeedbackPanel', state) : ''}
    ${state.showGuideNudge && state.pendingGuideCountry ? lazyRender('renderGuideNudge', state) : ''}
    ${state.showFeatureIntro ? lazyRender('renderFeatureIntro', state) : ''}
    ${state.showOfflinePanel ? renderOfflinePanel(state) : ''}
  `
}

/**
 * Render overlays section (cookie, beta banner, floating widgets)
 */
export function renderOverlays(state) {
  const isVoyageMapFirst = state.activeTab === 'challenges' && state.tripResults && state.tripFormCollapsed
  return `
    ${!state.showLanding && !isVoyageMapFirst ? renderCookieBanner() : ''}
    ${!state.showLanding ? renderBetaBanner() : ''}
    <div id="fb-side-btn-anchor"></div>
    ${state.nearbyFriendsEnabled ? lazyRender('renderNearbyFriendsWidget', state) : ''}
    ${state.sosActive && state.sosSession ? lazyRender('renderSOSTrackingWidget', state) : ''}
    ${state.proximityAlertSpot ? lazyRender('renderProximityAlert', state.proximityAlertSpot) : ''}
    ${state.showAdminPanel ? lazyRender('renderAdminPanel', state) : ''}
    ${state.tripResults && !state.showTripPlanner && !state.showTripMap && isMapTab(state) ? renderActiveTripBar(state) : ''}
    ${state.spotDraftsBannerVisible ? lazyRender('renderDraftBanner') : ''}
    ${state.selectedCity ? renderCityPanel(state) : ''}
    ${state.showLanding ? lazyRender('renderLanding') : ''}
  `
}

/**
 * Render the active trip bar
 */
function renderActiveTripBar(state) {
  return `
    <div class="fixed bottom-[4.5rem] left-4 right-4 z-30 px-4 py-2.5 rounded-xl bg-primary-500/90 backdrop-blur-xl border border-primary-400/30 shadow-lg shadow-primary-500/20 cursor-pointer" role="button" tabindex="0" onclick="openActiveTrip()">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3 min-w-0">
          ${icon('route', 'w-5 h-5 text-white/80')}
          <div class="min-w-0">
            <div class="text-xs text-white/70">${t('tripInProgress')}</div>
            <div class="text-sm font-semibold text-white truncate">
              ${state.tripResults.from?.split(',')[0] || '?'} → ${state.tripResults.to?.split(',')[0] || '?'}
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs text-white/70">${state.tripResults.spots?.length || 0} spots</span>
          ${icon('chevron-up', 'w-3 h-3 text-white/60')}
        </div>
      </div>
    </div>
  `
}

// Helper functions for inline modals (extracted from renderApp)
function renderAmbassadorSuccessModal(_state) {
  return `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onclick="if(event.target===this)closeAmbassadorSuccess()" role="dialog" aria-modal="true" aria-labelledby="amb-success-title">
      <div class="modal-panel rounded-2xl max-w-sm w-full p-6 text-center slide-up">
        <div class="text-6xl mb-4">🌟</div>
        <h2 id="amb-success-title" class="text-2xl font-bold mb-2">${t('ambassadorSuccessTitle') || 'Tu es maintenant Ambassadeur !'}</h2>
        <p class="text-slate-300 text-sm mb-6">${t('ambassadorSuccessDesc') || 'Tu représentes désormais ta ville sur SpotHitch. Merci pour ton engagement !'}</p>
        <button onclick="closeAmbassadorSuccess()" class="w-full py-3 px-6 rounded-xl bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors">
          ${icon('check', 'w-5 h-5 mr-2')}${t('awesome') || 'Super !'}
        </button>
      </div>
    </div>
  `
}

function renderContactAmbassadorModal(state) {
  return `
    <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4" onclick="if(event.target===this)closeContactAmbassador()" role="dialog" aria-modal="true" aria-labelledby="contact-amb-title">
      <div class="modal-panel w-full max-w-md rounded-2xl overflow-hidden slide-up">
        <div class="flex items-center justify-between p-4 border-b border-white/10">
          <div class="flex items-center gap-3">
            <span class="text-2xl">${state.selectedAmbassador.userAvatar || '🤙'}</span>
            <div>
              <h2 id="contact-amb-title" class="text-base font-bold">${state.selectedAmbassador.userName || ''}</h2>
              <p class="text-xs text-slate-400">${state.selectedAmbassador.city || ''}, ${state.selectedAmbassador.country || ''}</p>
            </div>
          </div>
          <button onclick="closeContactAmbassador()" class="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center" aria-label="${t('close') || 'Fermer'}">${icon('x', 'w-5 h-5')}</button>
        </div>
        <div class="p-4 space-y-4">
          ${state.selectedAmbassador.bio ? `<p class="text-sm text-slate-300 italic">"${state.selectedAmbassador.bio}"</p>` : ''}
          ${state.selectedAmbassador.languages?.length > 0 ? `
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-xs text-slate-400">${t('languages') || 'Langues'} :</span>
              ${state.selectedAmbassador.languages.map(l => `<span class="px-2 py-0.5 rounded bg-white/10 text-xs">${l.toUpperCase()}</span>`).join('')}
            </div>
          ` : ''}
          <div>
            <label class="block text-sm font-medium mb-1">${t('yourMessage') || 'Ton message'}</label>
            <textarea id="ambassador-message" rows="3" maxlength="500" placeholder="${t('ambassadorMessagePlaceholder') || 'Ex: Bonjour, j\'aurais besoin de conseils pour quitter Paris...'}" class="input-field w-full resize-none text-sm"></textarea>
          </div>
          <button onclick="window.sendAmbassadorMessage?.()" class="btn btn-primary w-full">
            ${icon('send', 'w-4 h-4 mr-2')}${t('sendMessage') || 'Envoyer'}
          </button>
        </div>
      </div>
    </div>
  `
}

function renderBlockedUsersModal(_state) {
  return `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4" onclick="closeBlockedUsers()" role="dialog" aria-modal="true" tabindex="0">
      <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" aria-hidden="true"></div>
      <div class="relative modal-panel rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto slide-up" onclick="event.stopPropagation()">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-bold">${t('blockedUsers') || 'Blocked users'}</h2>
            <button onclick="closeBlockedUsers()" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center" aria-label="${t('close') || 'Close'}">
              ${icon('x', 'w-5 h-5')}
            </button>
          </div>
          ${lazyRender('renderBlockedUsersList')}
        </div>
      </div>
    </div>
  `
}

function renderTeamChallengesModal(state) {
  return `
    <div class="fixed inset-0 z-50 bg-black/90 overflow-y-auto" role="dialog" aria-modal="true" onclick="if(event.target===this)closeTeamChallenges()">
      <div class="min-h-screen pb-20">
        <div class="sticky top-0 z-10 flex items-center justify-between p-4 bg-dark-primary/80 backdrop-blur-xl border-b border-white/5">
          <h2 class="text-lg font-bold">${icon('users', 'w-5 h-5 mr-2 text-orange-400')}${t('teamChallenges') || "Défis d'équipe"}</h2>
          <button onclick="closeTeamChallenges()" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center" aria-label="${t('close') || 'Fermer'}">
            ${icon('x', 'w-5 h-5')}
          </button>
        </div>
        ${lazyRender('renderTeamDashboard', state)}
      </div>
    </div>
  `
}

function renderCreateTeamModal(_state) {
  return `
    <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 p-4" role="dialog" aria-modal="true" onclick="if(event.target===this)closeCreateTeam()">
      <div class="modal-panel w-full max-w-md rounded-2xl overflow-hidden slide-up">
        <div class="flex items-center justify-between p-4 border-b border-white/10">
          <h2 class="text-lg font-bold">${icon('users', 'w-5 h-5 mr-2 text-primary-400')}${t('teamCreateButton') || 'Créer une équipe'}</h2>
          <button onclick="closeCreateTeam()" class="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center" aria-label="${t('close') || 'Fermer'}">${icon('x', 'w-5 h-5')}</button>
        </div>
        <div class="p-4 space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">${t('teamNameLabel') || 'Nom de l\'équipe'} *</label>
            <input id="create-team-name" type="text" maxlength="30" placeholder="${t('teamNamePlaceholder') || 'Ex: Les routards du monde'}" class="input-field w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">${t('teamDescLabel') || 'Description'}</label>
            <textarea id="create-team-desc" rows="2" maxlength="100" placeholder="${t('teamDescPlaceholder') || 'Décrivez votre équipe...'}" class="input-field w-full resize-none"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">${t('teamAvatarLabel') || 'Emoji de l\'équipe'}</label>
            <div class="flex flex-wrap gap-2">
              ${['👥','🚗','🌍','🏕️','✈️','🚀','🦅','🔥','⚡','🌟'].map(emoji => `
                <button onclick="document.getElementById('create-team-avatar').value='${emoji}';document.querySelectorAll('.team-avatar-btn').forEach(b=>b.classList.remove('ring-2','ring-primary-400'));this.classList.add('ring-2','ring-primary-400')"
                  class="team-avatar-btn w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl hover:bg-white/20 transition-colors">${emoji}</button>
              `).join('')}
            </div>
            <input id="create-team-avatar" type="hidden" value="👥" />
          </div>
          <button onclick="handleCreateTeam()" class="btn btn-primary w-full">
            ${icon('plus', 'w-5 h-5 mr-2')}${t('teamCreateConfirm') || 'Créer l\'équipe'}
          </button>
        </div>
      </div>
    </div>
  `
}

function renderTripHistoryModal(_state) {
  return `
    <div class="fixed inset-0 z-50 bg-black/90 overflow-y-auto" role="dialog" aria-modal="true" onclick="if(event.target===this)closeTripHistory()">
      <div class="min-h-screen pb-20">
        <div class="sticky top-0 z-10 flex items-center justify-between p-4 bg-dark-primary/80 backdrop-blur-xl border-b border-white/5">
          <h2 class="text-lg font-bold">${icon('clipboard-list', 'w-5 h-5 mr-2 text-emerald-400')}${t('tripHistory') || 'Historique de voyage'}</h2>
          <div class="flex items-center gap-2">
            <button onclick="clearTripHistory()" class="px-3 py-1.5 rounded-xl bg-red-500/20 text-red-400 text-sm hover:bg-red-500/30 transition-colors" aria-label="${t('clearHistory') || "Effacer l'historique"}">
              ${icon('trash', 'w-5 h-5 mr-1')}${t('clear') || 'Effacer'}
            </button>
            <button onclick="closeTripHistory()" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center" aria-label="${t('close') || 'Fermer'}">
              ${icon('x', 'w-5 h-5')}
            </button>
          </div>
        </div>
        <div class="p-4">
          ${lazyRender('renderTripHistory')}
        </div>
      </div>
    </div>
  `
}

function renderFAQModal(state) {
  return `
    <div class="fixed inset-0 z-50 bg-black/90 overflow-y-auto" role="dialog" aria-modal="true" onclick="if(event.target===this)closeFAQ()">
      <div class="min-h-screen pb-20">
        <div class="sticky top-0 z-10 flex items-center justify-between p-4 bg-dark-primary/80 backdrop-blur-xl border-b border-white/5">
          <h2 class="text-lg font-bold flex items-center gap-2">${icon('help-circle', 'w-5 h-5 text-primary-400')}${t('faqTitle') || 'FAQ & Aide'}</h2>
          <button onclick="closeFAQ()" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center" aria-label="${t('close') || 'Fermer'}">
            ${icon('x', 'w-5 h-5')}
          </button>
        </div>
        <div class="p-4">
          ${lazyRender('renderFAQ', state)}
        </div>
      </div>
    </div>
  `
}

function renderLegalModal(state) {
  return `
    <div class="fixed inset-0 z-50 bg-black/90 overflow-y-auto" role="dialog" aria-modal="true" onclick="if(event.target===this)closeLegal()">
      <div class="min-h-screen pb-20">
        ${lazyRender('renderLegalPage', state.legalPage || 'cgu')}
      </div>
    </div>
  `
}

/**
 * Update the spot counter (En attente vs Validés) displayed on the map.
 * Reads from spotLoader and writes to #hw-count / #sh-count DOM elements.
 */
function updateSpotCounter() {
  const hwEl = document.getElementById('hw-count')
  const shEl = document.getElementById('sh-count')
  if (!hwEl && !shEl) return
  import('../services/spotLoader.js').then(({ loadSpotIndex, getAllLoadedSpots }) => {
    loadSpotIndex?.().then(index => {
      const totalHW = index?.totalSpots || 0
      const loaderSpots = getAllLoadedSpots?.() || []
      const stateSpots = getState().spots || []
      // Count community spots from both spotLoader and state (Firestore)
      const communityFromLoader = loaderSpots.filter(s => s.source !== 'hitchwiki').length
      const communityFromState = stateSpots.filter(s => s.dataSource === 'community').length
      const community = Math.max(communityFromLoader, communityFromState)
      if (hwEl) hwEl.textContent = totalHW
      if (shEl) shEl.textContent = community
      // Counter updates on each call (community spots may arrive later from Firestore)
    }).catch(() => {
      const all = getAllLoadedSpots?.() || []
      const stateSpots = getState().spots || []
      if (hwEl) hwEl.textContent = all.filter(s => s.source === 'hitchwiki').length
      if (shEl) shEl.textContent = Math.max(
        all.filter(s => s.source !== 'hitchwiki').length,
        stateSpots.filter(s => s.dataSource === 'community').length
      )
    })
  }).catch(() => {})
}

/**
 * Inject / update persistent map controls inside #home-map.
 * Since #home-map is preserved across re-renders (never destroyed),
 * controls inside it won't blink/flash on state changes.
 */
function ensureMapControls(state) {
  const map = document.getElementById('home-map')
  if (!map) return

  let ctrl = document.getElementById('home-map-controls')
  if (!ctrl) {
    ctrl = document.createElement('div')
    ctrl.id = 'home-map-controls'
    ctrl.style.cssText = 'position:absolute;right:1rem;z-index:20;display:flex;flex-direction:column;gap:0.5rem'
    ctrl.innerHTML = `
      <button onclick="homeZoomIn()" class="w-11 h-11 rounded-xl bg-dark-primary/60 backdrop-blur-xl border border-white/10 text-white flex items-center justify-center hover:bg-dark-primary/80 transition-colors text-lg font-bold shadow-lg" aria-label="Zoom in">+</button>
      <button onclick="homeZoomOut()" class="w-11 h-11 rounded-xl bg-dark-primary/60 backdrop-blur-xl border border-white/10 text-white flex items-center justify-center hover:bg-dark-primary/80 transition-colors text-lg font-bold shadow-lg" aria-label="Zoom out">\u2212</button>
      <button onclick="homeCenterOnUser()" class="w-11 h-11 rounded-xl bg-dark-primary/60 backdrop-blur-xl border border-white/10 text-primary-400 flex items-center justify-center hover:bg-dark-primary/80 transition-colors shadow-lg" aria-label="My location">${icon('locate', 'w-5 h-5')}</button>
      <button id="gas-toggle-btn" onclick="toggleGasStations()" class="w-11 h-11 rounded-xl bg-dark-primary/60 text-slate-400 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-dark-primary/80 hover:text-white transition-colors shadow-lg" aria-label="Gas stations"><span class="text-lg">\u26FD</span></button>
      <button id="legend-toggle-btn" onclick="toggleMapLegend()" class="w-11 h-11 rounded-xl bg-dark-primary/60 text-slate-400 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-dark-primary/80 hover:text-white transition-colors shadow-lg" aria-label="Legend">${icon('info', 'w-5 h-5')}</button>
    `
    map.appendChild(ctrl)
  }

  // Update position (companion bar pushes controls down)
  const companionOn = !!document.querySelector('[onclick="showCompanionModal()"]')
  ctrl.style.top = companionOn ? '8rem' : '5rem'

  // Update gas station button active state
  const gasBtn = document.getElementById('gas-toggle-btn')
  if (gasBtn) {
    if (state.showGasStationsOnMap) {
      gasBtn.className = 'w-11 h-11 rounded-xl bg-red-500/80 text-white backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-dark-primary/80 hover:text-white transition-colors shadow-lg'
    } else {
      gasBtn.className = 'w-11 h-11 rounded-xl bg-dark-primary/60 text-slate-400 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-dark-primary/80 hover:text-white transition-colors shadow-lg'
    }
  }
}

/**
 * Post-render hook to initialize map and focus traps
 */
export function afterRender(state) {
  // ERR-SCROLL: toggle map-active class to block body scroll on map tab (NEVER REMOVE)
  document.documentElement.classList.toggle('map-active', isMapTab(state))

  // Init landing carousel if visible (only once — check data attribute)
  if (state.showLanding) {
    const landingPage = document.getElementById('landing-page')
    if (landingPage && landingPage.dataset.initialized !== 'true') {
      landingPage.dataset.initialized = 'true'
      setTimeout(() => {
        import('./Landing.js').then(mod => mod.initLandingCarousel?.())
      }, 50)
    }
  }

  // A9: Always init the map (it persists across tabs)
  setTimeout(() => initHomeMap(state), 100)

  // Inject / update persistent map controls (zoom, GPS, gas stations)
  ensureMapControls(state)

  // Legend overlay (state-driven, survives re-renders)
  if (window._ensureLegendOverlay) window._ensureLegendOverlay(state.showMapLegend)

  // Update spot counter (hw-count / sh-count in Home.js)
  updateSpotCounter()

  // Update offline storage size
  const storageSizeEl = document.getElementById('offline-storage-size')
  if (storageSizeEl && storageSizeEl.textContent === '...') {
    navigator.storage?.estimate?.().then(est => {
      const usedMB = ((est.usage || 0) / 1024 / 1024).toFixed(1)
      const quotaMB = ((est.quota || 0) / 1024 / 1024 / 1024).toFixed(1)
      if (storageSizeEl) storageSizeEl.textContent = `${usedMB} Mo / ${quotaMB} Go`
      const barEl = document.getElementById('offline-storage-bar')
      if (barEl && est.quota) barEl.style.width = `${Math.min(100, (est.usage / est.quota) * 100).toFixed(1)}%`
    }).catch(() => {
      if (storageSizeEl) storageSizeEl.textContent = 'Non disponible'
    })
  }

  // Trip map: init when map-first view is active OR old showTripMap
  const tripMapNeeded = (state.showTripMap && (isMapTab(state) || state.showTripPlanner)) ||
    (state.tripResults && state.tripFormCollapsed && state.activeTab === 'challenges')
  if (tripMapNeeded) {
    const tripContainer = document.getElementById('trip-map')
    if (tripContainer && tripContainer.dataset.initialized !== 'true') {
      setTimeout(() => initTripMap(state), 100)
    }
  }

  // Init modal-specific post-render hooks (replaces global MutationObservers)
  if (state.showAuth) {
    import('./modals/Auth.js').then(mod => mod.initAuthAfterRender?.())
  }
  if (state.showAddSpot) {
    import('./modals/AddSpot.js').then(mod => mod.initAddSpotAfterRender?.())
  }
  // ValidateSpot afterRender removed — AddSpot's initAddSpotAfterRender handles both modes
  // Companion: pass visibility flag so it can reset when modal closes
  import('./modals/Companion.js').then(mod => mod.initCompanionAfterRender?.(!!state.showCompanionModal))

  // Focus trap: clean up previous trap
  if (_activeFocusTrapCleanup) {
    _activeFocusTrapCleanup()
    _activeFocusTrapCleanup = null
  }

  // Activate focus trap on the topmost open modal (role="dialog")
  // Only apply to actual modal dialogs (aria-modal="true"), skip banners/overlays
  // Skip entirely when AddSpot is open — it has its own focus management
  if (!state.showAddSpot) {
    requestAnimationFrame(() => {
      const dialogs = document.querySelectorAll('[role="dialog"][aria-modal="true"]')
      if (dialogs.length > 0) {
        const topModal = dialogs[dialogs.length - 1]
        _activeFocusTrapCleanup = trapFocus(topModal)
      }
    })
  }
}

/**
 * Initialize the home map (full-size MapLibre GL, shows spots in visible area)
 */
// Load MapLibre CSS dynamically (once)
// Cached favorites set — avoid JSON.parse on every GeoJSON build
let _cachedFavSet = null
let _cachedFavRaw = null
function getFavoritesSet() {
  const raw = localStorage.getItem('spothitch_favorites') || '[]'
  if (raw !== _cachedFavRaw) {
    _cachedFavRaw = raw
    try { _cachedFavSet = new Set(JSON.parse(raw)) } catch { _cachedFavSet = new Set() }
  }
  return _cachedFavSet
}

let _mapCSSLoaded = false
function loadMapCSS() {
  if (_mapCSSLoaded) return
  _mapCSSLoaded = true
  // Import MapLibre CSS as a side-effect module (Vite handles this)
  import('maplibre-gl/dist/maplibre-gl.css')
}

function initHomeMap(state) {
  const container = document.getElementById('home-map')
  if (!container || container.dataset.initialized === 'true') return

  // Load MapLibre CSS on first map init
  loadMapCSS()

  import('maplibre-gl').then(async (maplibreModule) => {
    if (container.dataset.initialized === 'true') return
    container.dataset.initialized = 'true'

    const maplibregl = maplibreModule.default || maplibreModule
    const {
      addCountryBubbleLayers, updateCountryBubbleData,
      createBubblePopup, handleClusterClick, setBubbleLayersVisibility,
      setSpotLayersVisibility,
    } = await import('../services/countryBubbles.js')

    const hasGps = !!state.userLocation
    const center = hasGps
      ? [state.userLocation.lng, state.userLocation.lat]
      : [2.3, 46.6] // France center as fallback [lng, lat]

    const zoom = hasGps ? 13 : 5

    const map = new maplibregl.Map({
      container,
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center,
      zoom,
      attributionControl: false,
    })

    // Compat methods for external callers (Map.js, main.js)
    map.setView = function (latLng, z) {
      const lat = Array.isArray(latLng) ? latLng[0] : latLng.lat
      const lng = Array.isArray(latLng) ? latLng[1] : latLng.lng
      this.flyTo({ center: [lng, lat], zoom: z, duration: 800 })
    }
    map.invalidateSize = function () { this.resize() }

    window.homeMapInstance = map

    // User position marker + GPS centering
    let userMarker = null
    const showUserPosition = (lat, lng) => {
      if (userMarker) userMarker.remove()
      const el = document.createElement('div')
      el.innerHTML = `
        <div class="relative">
          <div class="w-4 h-4 bg-amber-400 rounded-full border-2 border-white shadow-lg"></div>
          <div class="absolute inset-0 bg-amber-400 rounded-full animate-ping opacity-50"></div>
        </div>
      `
      userMarker = new maplibregl.Marker({ element: el })
        .setLngLat([lng, lat])
        .addTo(map)
    }

    if (state.userLocation) {
      showUserPosition(state.userLocation.lat, state.userLocation.lng)
    } else if (navigator.geolocation) {
      // Request GPS and center map when available
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords
          showUserPosition(latitude, longitude)
          map.flyTo({ center: [longitude, latitude], zoom: 13, duration: 1200 })
          // Update global state
          if (window.setState) window.setState({ userLocation: { lat: latitude, lng: longitude }, gpsEnabled: true })
          // Load spots in 50km radius once GPS is acquired
          if (spotLoader) {
            try {
              const radiusSpots = await spotLoader.loadSpotsInRadius(latitude, longitude, 50)
              updateSpotsOnMap(radiusSpots)
              if (window._refreshCountryBubbles) window._refreshCountryBubbles()
              // Prefetch nearby countries in background for faster browsing
              spotLoader.prefetchNearbyCountries(latitude, longitude, 800)
            } catch { /* no-op */ }
          }
        },
        () => { /* silently fail — user denied GPS */ },
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
      )
    }

    // spotLoader module reference (loaded once, reused)
    let spotLoader = null
    let spotIndex = null
    let countryCenters = null
    let activePopup = null

    // Track which spot IDs are already added to avoid duplicates
    const addedSpotIds = new Set()

    // Cache last GeoJSON feature count + IDs to avoid unnecessary setData calls (prevents blinking)
    let lastGeoJSONKey = ''

    // Apply user filters to spots
    const applySpotFilters = (spots) => {
      const s = getState()
      const minRating = s.filterMinRating || 0
      const maxWait = s.filterMaxWait || 999
      const verifiedOnly = s.filterVerifiedOnly || false
      return spots.filter(spot => {
        // Hidden spots (confirmed reports by admin) are never shown
        if (spot.hidden) return false
        if (minRating > 0 && (spot.globalRating || 0) < minRating) return false
        if (maxWait < 999 && (spot.avgWaitTime || 999) > maxWait) return false
        if (verifiedOnly && !spot.verified) return false
        return true
      })
    }

    // Helper: convert spots array to GeoJSON
    // Always rebuilds from scratch — addedSpotIds is used only within one call
    // to deduplicate spots that appear multiple times in the input array
    const spotsToGeoJSON = (spots) => {
      addedSpotIds.clear()
      const filtered = applySpotFilters(spots)
      const favSet = getFavoritesSet()
      const features = []
      filtered.forEach(spot => {
        if (addedSpotIds.has(spot.id)) return
        const lat = spot.coordinates?.lat || spot.lat
        const lng = spot.coordinates?.lng || spot.lng
        if (!lat || !lng) return
        addedSpotIds.add(spot.id)
        const isFav = favSet.has(spot.id)
        features.push({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [lng, lat] },
          properties: {
            id: spot.id,
            isFav: isFav ? 1 : 0,
            markerType: getMarkerType(spot, isFav),
          },
        })
      })
      return { type: 'FeatureCollection', features }
    }

    // Add spots layers once map is loaded
    let spotsSourceAdded = false

    const addSpotsSource = async (geojson) => {
      if (spotsSourceAdded) {
        // Skip setData if features haven't changed (prevents blinking/flickering)
        const key = geojson.features.map(f => f.properties.id).sort().join(',')
        if (key === lastGeoJSONKey) return
        lastGeoJSONKey = key
        const source = map.getSource('home-spots')
        if (source) source.setData(geojson)
        return
      }
      spotsSourceAdded = true

      map.addSource('home-spots', {
        type: 'geojson',
        data: geojson,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      })

      // Cluster circles (amber)
      map.addLayer({
        id: 'home-clusters',
        type: 'circle',
        source: 'home-spots',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': 'rgba(245, 158, 11, 0.85)',
          'circle-radius': ['step', ['get', 'point_count'], 18, 20, 21, 100, 24],
          'circle-stroke-color': 'rgba(255, 255, 255, 0.6)',
          'circle-stroke-width': 2,
        },
      })

      // Cluster count labels
      map.addLayer({
        id: 'home-cluster-count',
        type: 'symbol',
        source: 'home-spots',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': ['get', 'point_count_abbreviated'],
          'text-size': 12,
          'text-font': ['Noto Sans Bold'],
          'text-allow-overlap': true,
        },
        paint: { 'text-color': '#ffffff' },
      })

      // Register SVG marker images then add symbol layer
      await registerMarkerImages(map)

      // Individual spot markers (Style 4: split + crown + gold ring)
      map.addLayer({
        id: 'home-spot-points',
        type: 'symbol',
        source: 'home-spots',
        filter: ['!', ['has', 'point_count']],
        layout: {
          'icon-image': ['get', 'markerType'],
          'icon-size': [
            'interpolate', ['linear'], ['zoom'],
            5, 0.4,
            10, 0.6,
            13, 0.8,
            16, 1,
          ],
          'icon-allow-overlap': true,
          'icon-ignore-placement': true,
        },
      })

      // Click handlers
      map.on('click', 'home-spot-points', (e) => {
        if (e.features?.length > 0) window.selectSpot?.(e.features[0].properties.id)
      })
      map.on('click', 'home-clusters', async (e) => {
        const features = map.queryRenderedFeatures(e.point, { layers: ['home-clusters'] })
        if (!features.length) return
        const clusterId = features[0].properties.cluster_id
        if (clusterId === undefined) return
        try {
          const z = await map.getSource('home-spots').getClusterExpansionZoom(clusterId)
          map.easeTo({ center: features[0].geometry.coordinates, zoom: Math.min(z, 16) })
        } catch { /* no-op */ }
      })
      map.on('mouseenter', 'home-spot-points', () => { map.getCanvas().style.cursor = 'pointer' })
      map.on('mouseleave', 'home-spot-points', () => { map.getCanvas().style.cursor = '' })
      map.on('mouseenter', 'home-clusters', () => { map.getCanvas().style.cursor = 'pointer' })
      map.on('mouseleave', 'home-clusters', () => { map.getCanvas().style.cursor = '' })

    }

    // haversineKm imported from ../utils/geo.js

    // Populate split view with nearest spots + distances
    const populateSplitView = async (allSpots) => {
      const splitEl = document.getElementById('split-spots-list')
      if (!splitEl) return

      const currentState = getState()
      const userLoc = currentState.userLocation
      const bounds = map.getBounds()

      // Filter visible spots only
      const visibleSpots = allSpots.filter(s => {
        const lat = s.coordinates?.lat || s.lat
        const lng = s.coordinates?.lng || s.lng
        if (!lat || !lng) return false
        return bounds.contains([lng, lat])
      })

      // Calculate distances if GPS available, then sort
      const spotsWithDist = visibleSpots.map(s => {
        const lat = s.coordinates?.lat || s.lat
        const lng = s.coordinates?.lng || s.lng
        const dist = userLoc ? haversineKm(userLoc.lat, userLoc.lng, lat, lng) : null
        return { ...s, _dist: dist }
      })

      if (userLoc) {
        spotsWithDist.sort((a, b) => (a._dist || 999) - (b._dist || 999))
      }

      const nearest = spotsWithDist.slice(0, 15)
      if (nearest.length === 0) return

      // Format distance
      const fmtDist = (km) => {
        if (km === null || km === undefined) return ''
        if (km < 1) return `${Math.round(km * 1000)} m`
        return `${km.toFixed(1)} km`
      }

      // List cards for split view
      if (splitEl) {
        splitEl.innerHTML = nearest.map(s => {
          const rating = s.globalRating?.toFixed(1) || '—'
          const distLabel = s._dist !== null ? fmtDist(s._dist) : ''
          const dir = s.to || s.from || ''
          return `
            <button onclick="selectSpot(${typeof s.id === 'string' ? "'" + s.id + "'" : s.id})"
              class="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
              <div class="text-amber-400 text-sm font-bold shrink-0">${rating}</div>
              <div class="flex-1 min-w-0">
                <div class="text-white text-sm font-medium truncate">${dir || 'Spot'}</div>
                <div class="text-slate-400 text-xs truncate">${s.from || ''}</div>
              </div>
              ${distLabel ? `<span class="text-xs text-primary-400 font-medium shrink-0">${distLabel}</span>` : ''}
            </button>`
        }).join('')
      }
    }

    // Gather all spots and push to source
    const updateSpotsOnMap = (spots) => {
      const geojson = spotsToGeoJSON(spots)
      // Always update source even if empty — prevents stale clusters from persisting
      addSpotsSource(geojson)

      // Update badge count
      const badge = document.querySelector('#home-map-container .text-primary-400.font-semibold')
      if (badge) badge.textContent = addedSpotIds.size

      // Populate bottom sheet with nearest spots
      populateSplitView(spots)
    }

    // Load spots for visible area
    let isLoadingSpots = false
    const loadSpotsForView = async () => {
      // Always import spotLoader directly (don't rely on closure variable)
      let loader = spotLoader
      if (!loader) {
        try {
          loader = await import('../services/spotLoader.js')
          spotLoader = loader
        } catch { return }
      }

      const currentState = getState()
      const stateSpots = currentState.spots || []
      const existing = loader.getAllLoadedSpots()
      const spotsMap = new Map()
      stateSpots.forEach(s => spotsMap.set(s.id, s))
      existing.forEach(s => spotsMap.set(s.id, s))
      updateSpotsOnMap(Array.from(spotsMap.values()))

      if (isLoadingSpots) return
      isLoadingSpots = true
      try {
        const bounds = map.getBounds()
        await loader.loadSpotsInBounds({
          north: bounds.getNorth(),
          south: bounds.getSouth(),
          east: bounds.getEast(),
          west: bounds.getWest(),
        })
        const allLoaded = loader.getAllLoadedSpots()
        updateSpotsOnMap(allLoaded)
      } catch {
        // silently fail
      } finally {
        isLoadingSpots = false
      }
    }

    // Update layer visibility based on zoom level
    // Spots always visible (clusters at low zoom, individual at high zoom)
    // Bubbles fade in/out via their own opacity interpolation (zoom 6→7)
    const updateLayerVisibility = () => {
      const z = map.getZoom()
      // Always show spots — clusters aggregate at low zoom automatically
      setSpotLayersVisibility(map, true)
      // Country bubbles visible at low zoom (only for countries with community spots)
      setBubbleLayersVisibility(map, z < 7)
    }

    // Refresh bubble data from community spots (dynamic, no Hitchwiki index)
    // Throttled to avoid excessive rebuilds that cause visual flicker
    let lastBubbleRefresh = 0
    const BUBBLE_THROTTLE_MS = 2000
    const refreshBubbles = () => {
      const now = Date.now()
      if (now - lastBubbleRefresh < BUBBLE_THROTTLE_MS) return
      lastBubbleRefresh = now
      if (!countryCenters) {
        // Load country centers from spotLoader if not yet loaded
        if (spotLoader) countryCenters = spotLoader.getCountryCenters()
        if (!countryCenters) return
      }
      // Build index dynamically from actual spots in state
      const currentState = getState()
      const allSpots = currentState.spots || []
      if (allSpots.length === 0) return
      // Count spots per country
      const countByCountry = {}
      for (const s of allSpots) {
        const cc = (s.country || s.countryCode || '').toUpperCase()
        if (cc) countByCountry[cc] = (countByCountry[cc] || 0) + 1
      }
      // Build fake index from real data
      const dynamicIndex = {
        countries: Object.entries(countByCountry).map(([code, count]) => ({ code, count })),
      }
      const loadedCodes = new Set(Object.keys(countByCountry))
      updateCountryBubbleData(map, dynamicIndex, countryCenters, loadedCodes, new Set())
    }

    map.on('load', async () => {
      // Long press on map → open AddSpot with pre-filled coordinates
      let longPressTimer = null
      let longPressStart = null
      const LONG_PRESS_MS = 600
      const MAX_MOVE_PX = 10

      map.getCanvas().addEventListener('touchstart', (e) => {
        if (e.touches.length !== 1) return
        longPressStart = { x: e.touches[0].clientX, y: e.touches[0].clientY }
        longPressTimer = setTimeout(() => {
          const rect = map.getCanvas().getBoundingClientRect()
          const point = [longPressStart.x - rect.left, longPressStart.y - rect.top]
          const lngLat = map.unproject(point)
          if (navigator.vibrate) navigator.vibrate(30)
          if (window.openAddSpot) {
            window._pendingShareCoords = { lat: lngLat.lat, lng: lngLat.lng }
            window.openAddSpot()
          }
          longPressTimer = null
          longPressStart = null
        }, LONG_PRESS_MS)
      }, { passive: true })

      map.getCanvas().addEventListener('touchmove', (e) => {
        if (!longPressTimer || !longPressStart) return
        const dx = e.touches[0].clientX - longPressStart.x
        const dy = e.touches[0].clientY - longPressStart.y
        if (Math.sqrt(dx * dx + dy * dy) > MAX_MOVE_PX) {
          clearTimeout(longPressTimer)
          longPressTimer = null
          longPressStart = null
        }
      }, { passive: true })

      map.getCanvas().addEventListener('touchend', () => {
        if (longPressTimer) {
          clearTimeout(longPressTimer)
          longPressTimer = null
        }
        longPressStart = null
      }, { passive: true })

      // Country bubble layers (shows bubbles for countries with community spots)
      addCountryBubbleLayers(map)

      // Load spotLoader for country centers
      try {
        const mod = await import('../services/spotLoader.js')
        spotLoader = mod
        countryCenters = mod.getCountryCenters()
      } catch { /* no-op */ }

      // Click on cluster bubble → zoom in
      map.on('click', 'country-bubble-clusters', (e) => {
        if (!e.features?.length) return
        handleClusterClick(map, e.features[0])
      })
      map.on('mouseenter', 'country-bubble-clusters', () => { map.getCanvas().style.cursor = 'pointer' })
      map.on('mouseleave', 'country-bubble-clusters', () => { map.getCanvas().style.cursor = '' })

      // Click on individual country bubble → zoom into that country
      map.on('click', 'country-bubble-circles', (e) => {
        if (!e.features?.length) return
        if (activePopup) { activePopup.remove(); activePopup = null }
        const coords = e.features[0].geometry.coordinates
        map.flyTo({ center: coords, zoom: 7, duration: 800 })
      })
      map.on('mouseenter', 'country-bubble-circles', () => { map.getCanvas().style.cursor = 'pointer' })
      map.on('mouseleave', 'country-bubble-circles', () => { map.getCanvas().style.cursor = '' })

      // Initial load strategy
      const currentZoom = map.getZoom()
      if (hasGps && spotLoader) {
        // GPS: load spots in 50km radius
        const radiusSpots = await spotLoader.loadSpotsInRadius(
          state.userLocation.lat, state.userLocation.lng, 50
        )
        updateSpotsOnMap(radiusSpots)
        refreshBubbles()
      } else if (currentZoom >= 7) {
        loadSpotsForView()
      } else {
        // No GPS, zoomed out: load spots for visible area anyway
        // so the map isn't empty while bubbles also show
        loadSpotsForView()
      }

      updateLayerVisibility()

      // Load community spots from Firestore (user-created spots)
      try {
        const { loadSpotsFromFirebase } = await import('../services/firebase.js')
        const result = await loadSpotsFromFirebase()
        if (result.success && result.spots.length > 0) {
          const communitySpots = result.spots.filter(s =>
            s.dataSource === 'community' && (s.lat || s.coordinates?.lat) && (s.lng || s.coordinates?.lng)
          )
          if (communitySpots.length > 0) {
            const currentState = getState()
            const existingSpots = currentState.spots || []
            const spotsMap = new Map()
            existingSpots.forEach(s => spotsMap.set(s.id, s))
            communitySpots.forEach(s => spotsMap.set(s.id, s))
            if (window.setState) window.setState({ spots: Array.from(spotsMap.values()) })
            updateSpotsOnMap(Array.from(spotsMap.values()))
            refreshBubbles()
          }
        }
      } catch { /* Firestore unavailable — static spots still work */ }
    })

    // Debounce spot loading on map move
    let moveTimer = null
    let lastBounds = null
    let lastZoom = map.getZoom()
    map.on('moveend', () => {
      updateLayerVisibility()
      clearTimeout(moveTimer)

      // Refresh bubbles at any zoom
      refreshBubbles()

      // Detect zoom change — instantly re-display cached spots
      const currentZoom = map.getZoom()
      const zoomChanged = Math.abs(currentZoom - lastZoom) > 0.3
      lastZoom = currentZoom

      if (zoomChanged) {
        // Immediately show already-loaded spots with forceRebuild to clear stale IDs
        const existing = spotLoader ? spotLoader.getAllLoadedSpots() : []
        const currentState = getState()
        const stateSpots = currentState.spots || []
        const spotsMap = new Map()
        stateSpots.forEach(s => spotsMap.set(s.id, s))
        existing.forEach(s => spotsMap.set(s.id, s))
        if (spotsMap.size > 0) updateSpotsOnMap(Array.from(spotsMap.values()))
      }

      // Skip network reload if bounds barely changed AND zoom didn't change
      const bounds = map.getBounds()
      if (lastBounds && !zoomChanged) {
        const dLat = Math.abs(bounds.getNorth() - lastBounds.getNorth())
        const dLng = Math.abs(bounds.getEast() - lastBounds.getEast())
        if (dLat < 0.01 && dLng < 0.01) return
      }
      lastBounds = bounds
      moveTimer = setTimeout(loadSpotsForView, 300)
    })

    // Expose refreshBubbles for main.js handlers
    window._refreshCountryBubbles = refreshBubbles

    // Expose map spot refresh for filter changes
    window._refreshMapSpots = () => {
      const existing = spotLoader ? spotLoader.getAllLoadedSpots() : []
      const currentState = getState()
      const stateSpots = currentState.spots || []
      const spotsMap = new Map()
      stateSpots.forEach(s => spotsMap.set(s.id, s))
      existing.forEach(s => spotsMap.set(s.id, s))
      const allSpots = Array.from(spotsMap.values())
      const geojson = spotsToGeoJSON(allSpots)
      addSpotsSource(geojson)
      populateSplitView(allSpots)
    }

    // Resize
    setTimeout(() => map.resize(), 200)
  }).catch((err) => {
    console.warn('Home map init failed:', err)
  })
}

// _applyTripFilter removed — unified in src/utils/tripFilters.js

/**
 * Initialize trip map (MapLibre GL — shows only trip spots along route)
 */
// Trip map instance + state (module-level for dynamic updates)
let tripMapInstance = null
let tripMaplibregl = null
let tripAmenityMarkers = []
let tripGpsMarker = null
let tripGpsWatchId = null

function initTripMap(state) {
  const container = document.getElementById('trip-map')
  if (!container || container.dataset.initialized === 'true') return
  if (!state.tripResults) return

  loadMapCSS()

  import('maplibre-gl').then((maplibreModule) => {
    if (container.dataset.initialized === 'true') return
    container.dataset.initialized = 'true'

    const maplibregl = maplibreModule.default || maplibreModule
    tripMaplibregl = maplibregl

    const results = state.tripResults
    const from = results.fromCoords // [lat, lng]
    const to = results.toCoords     // [lat, lng]
    // Fallback center: France if coords missing
    const center = from ? [from[1], from[0]] : [2.3522, 46.2276]
    const zoom = from ? 7 : 5

    const map = new maplibregl.Map({
      container,
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center,
      zoom,
      attributionControl: true,
    })
    tripMapInstance = map
    window._tripMapInstance = map

    // Force resize after MapLibre sets position:relative on container
    setTimeout(() => { map.resize() }, 100)
    setTimeout(() => { map.resize() }, 500)

    map.on('load', () => {
      try {
      // Route line from OSRM geometry
      if (results.routeGeometry && results.routeGeometry.length > 0) {
        map.addSource('trip-route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: { type: 'LineString', coordinates: results.routeGeometry },
          },
        })
        map.addLayer({
          id: 'trip-route-line',
          type: 'line',
          source: 'trip-route',
          paint: { 'line-color': '#f59e0b', 'line-width': 6, 'line-opacity': 0.9 },
          layout: { 'line-cap': 'round', 'line-join': 'round' },
        })
      } else {
        // Dashed fallback line
        map.addSource('trip-route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: { type: 'LineString', coordinates: [[from[1], from[0]], [to[1], to[0]]] },
          },
        })
        map.addLayer({
          id: 'trip-route-line',
          type: 'line',
          source: 'trip-route',
          paint: { 'line-color': '#f59e0b', 'line-width': 5, 'line-opacity': 0.7, 'line-dasharray': [2, 2] },
          layout: { 'line-cap': 'round', 'line-join': 'round' },
        })
      }

      // Trip spot dots
      const favSet = getFavoritesSet()

      const spots = results.spots || []
      const spotFeatures = []
      spots.forEach((spot, i) => {
        const lat = spot.coordinates?.lat || spot.lat
        const lng = spot.coordinates?.lng || spot.lng
        if (!lat || !lng) return
        const isFav = favSet.has(spot.id)
        spotFeatures.push({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [lng, lat] },
          properties: {
            id: spot.id,
            index: i + 1,
            color: isFav ? '#f59e0b' : '#22c55e',
            strokeColor: isFav ? '#fbbf24' : '#ffffff',
            radius: isFav ? 14 : 12,
            strokeWidth: isFav ? 3 : 2,
          },
        })
      })

      if (spotFeatures.length > 0) {
        map.addSource('trip-spots', {
          type: 'geojson',
          data: { type: 'FeatureCollection', features: spotFeatures },
        })
        map.addLayer({
          id: 'trip-spot-points',
          type: 'circle',
          source: 'trip-spots',
          paint: {
            'circle-color': ['get', 'color'],
            'circle-radius': ['get', 'radius'],
            'circle-stroke-color': ['get', 'strokeColor'],
            'circle-stroke-width': ['get', 'strokeWidth'],
            'circle-opacity': ['coalesce', ['get', 'opacity'], 0.9],
          },
        })
        // Spot number labels
        map.addLayer({
          id: 'trip-spot-labels',
          type: 'symbol',
          source: 'trip-spots',
          layout: {
            'text-field': ['to-string', ['get', 'index']],
            'text-size': 11,
            'text-font': ['Noto Sans Bold'],
            'text-allow-overlap': true,
            'text-ignore-placement': true,
            'text-padding': 2,
          },
          paint: {
            'text-color': '#ffffff',
            'text-halo-color': 'rgba(0,0,0,0.7)',
            'text-halo-width': 1.5,
          },
        })
        map.on('click', 'trip-spot-points', (e) => {
          if (e.features?.length > 0) {
            const spotId = e.features[0].properties.id
            const coords = e.features[0].geometry.coordinates
            showTripSpotPopup(map, maplibregl, spotId, coords, spots)
          }
        })
        map.on('mouseenter', 'trip-spot-points', () => { map.getCanvas().style.cursor = 'pointer' })
        map.on('mouseleave', 'trip-spot-points', () => { map.getCanvas().style.cursor = '' })
      }

      // Start/End markers
      const startEl = document.createElement('div')
      startEl.style.cssText = 'width:28px;height:28px;border-radius:50%;background:#22c55e;border:3px solid #fff;display:flex;align-items:center;justify-content:center;font-size:12px;color:#fff;font-weight:bold;box-shadow:0 2px 6px rgba(0,0,0,0.3)'
      startEl.textContent = 'A'
      new maplibregl.Marker({ element: startEl }).setLngLat([from[1], from[0]]).addTo(map)

      const endEl = document.createElement('div')
      endEl.style.cssText = 'width:28px;height:28px;border-radius:50%;background:#f59e0b;border:3px solid #fff;display:flex;align-items:center;justify-content:center;font-size:12px;color:#fff;font-weight:bold;box-shadow:0 2px 6px rgba(0,0,0,0.3)'
      endEl.textContent = 'B'
      new maplibregl.Marker({ element: endEl }).setLngLat([to[1], to[0]]).addTo(map)

      // Amenity markers if already loaded
      if (state.showRouteAmenities && state.routeAmenities?.length > 0) {
        addAmenityMarkers(state.routeAmenities)
      }

      // Fit bounds to show everything
      const allCoords = [[from[1], from[0]], [to[1], to[0]]]
      spots.forEach(s => {
        const lat = s.coordinates?.lat || s.lat
        const lng = s.coordinates?.lng || s.lng
        if (lat && lng) allCoords.push([lng, lat])
      })

      if (allCoords.length >= 2) {
        const bounds = allCoords.reduce(
          (b, c) => b.extend(c),
          new maplibregl.LngLatBounds(allCoords[0], allCoords[0])
        )
        map.fitBounds(bounds, { padding: 50 })
      }

      // Start GPS tracking
      startTripGpsTracking()
      } catch (err) {
        console.error('[TripMap] Error in load callback:', err?.message || err, err?.stack || '')
      }
    })

    setTimeout(() => map.resize(), 200)
    setTimeout(() => map.resize(), 500)
  }).catch(err => {
    console.warn('Trip map init failed:', err)
  })
}

// Add amenity markers dynamically to the existing trip map
function addAmenityMarkers(amenities) {
  if (!tripMapInstance || !tripMaplibregl) return
  // Remove old markers first
  removeAmenityMarkers()
  amenities.forEach(poi => {
    if (!poi.lat || !poi.lng) return
    const isFuel = poi.type === 'fuel'
    const label = isFuel ? '⛽' : '🅿️'
    const stationName = poi.name || poi.brand || (isFuel ? (t('gasStation') || 'Gas station') : (t('restArea') || 'Rest area'))
    const areaName = poi.serviceArea || ''

    const el = document.createElement('div')
    el.style.cssText = 'font-size:22px;text-align:center;line-height:1;cursor:pointer;filter:drop-shadow(0 1px 2px rgba(0,0,0,0.5));transition:transform 0.15s'
    el.textContent = label
    el.title = areaName ? `${stationName} · ${areaName}` : stationName

    const marker = new tripMaplibregl.Marker({ element: el })
      .setLngLat([poi.lng, poi.lat])
      .addTo(tripMapInstance)

    // Popup on click with station name + service area + available services
    const services = poi.services || []
    let popupHTML = `<div style="padding:2px 4px;font-family:system-ui;font-size:13px">`
    popupHTML += `<div style="font-weight:600;color:#fff">${label} ${stationName}</div>`
    if (areaName) {
      popupHTML += `<div style="font-size:11px;color:#94a3b8;margin-top:2px">📍 ${areaName}</div>`
    }
    if (services.length > 0) {
      popupHTML += `<div style="margin-top:4px;font-size:15px;letter-spacing:2px">${services.join(' ')}</div>`
    }
    popupHTML += `</div>`
    const popup = new tripMaplibregl.Popup({ offset: 25, closeButton: false, maxWidth: '260px' })
      .setHTML(popupHTML)

    el.addEventListener('click', (e) => {
      e.stopPropagation()
      // Close any other open popup
      tripAmenityMarkers.forEach(m => { if (m._popup?.isOpen()) m._popup.remove() })
      popup.setLngLat([poi.lng, poi.lat]).addTo(tripMapInstance)
      marker._popup = popup
    })

    marker._popup = popup
    tripAmenityMarkers.push(marker)
  })
}

// Remove all amenity markers from trip map
function removeAmenityMarkers() {
  tripAmenityMarkers.forEach(m => m.remove())
  tripAmenityMarkers = []
}

// GPS tracking on trip map
function startTripGpsTracking() {
  if (!tripMapInstance || !tripMaplibregl || !navigator.geolocation) return
  // Remove previous watch
  stopTripGpsTracking()

  tripGpsWatchId = navigator.geolocation.watchPosition(
    (pos) => {
      const lng = pos.coords.longitude
      const lat = pos.coords.latitude
      if (tripGpsMarker) {
        tripGpsMarker.setLngLat([lng, lat])
      } else {
        const el = document.createElement('div')
        el.style.cssText = 'width:18px;height:18px;border-radius:50%;background:#3b82f6;border:3px solid #fff;box-shadow:0 0 10px rgba(59,130,246,0.6)'
        tripGpsMarker = new tripMaplibregl.Marker({ element: el })
          .setLngLat([lng, lat])
          .addTo(tripMapInstance)
      }
    },
    () => { /* geolocation error — silent */ },
    { enableHighAccuracy: true, maximumAge: 10000 }
  )
}

function stopTripGpsTracking() {
  if (tripGpsWatchId !== null) {
    navigator.geolocation.clearWatch(tripGpsWatchId)
    tripGpsWatchId = null
  }
  if (tripGpsMarker) {
    tripGpsMarker.remove()
    tripGpsMarker = null
  }
}

// Show popup on a trip spot (used by map click and bottom sheet)
let tripActivePopup = null
function showTripSpotPopup(map, maplibregl, spotId, coords, spots) {
  if (tripActivePopup) { tripActivePopup.remove(); tripActivePopup = null }
  const spot = spots?.find(s => s.id === spotId)
  if (!spot) return
  const name = spot.from || spot.city || spot.stationName || 'Spot'
  const waitTxt = (spot.avgWaitTime || spot.avgWait) ? `${spot.avgWaitTime || spot.avgWait}min` : ''
  const typeTxt = spot.spotType || ''
  const popupEl = document.createElement('div')
  popupEl.style.cssText = 'font-family:system-ui;font-size:13px;max-width:220px'
  const titleEl = document.createElement('div')
  titleEl.style.cssText = 'font-weight:600;color:#fff;margin-bottom:4px'
  titleEl.textContent = name
  popupEl.appendChild(titleEl)
  if (typeTxt || waitTxt) {
    const infoEl = document.createElement('div')
    infoEl.style.cssText = 'font-size:11px;color:#94a3b8;margin-bottom:6px'
    infoEl.textContent = [typeTxt, waitTxt].filter(Boolean).join(' · ')
    popupEl.appendChild(infoEl)
  }
  const btnRow = document.createElement('div')
  btnRow.style.cssText = 'display:flex;gap:6px'
  const mkBtn = (text, fn) => {
    const b = document.createElement('button')
    b.style.cssText = 'padding:4px 10px;border-radius:8px;font-size:12px;cursor:pointer;border:none;font-weight:600'
    b.textContent = text
    b.onclick = fn
    return b
  }
  const heartBtn = mkBtn('❤️', () => { window.toggleFavorite?.(spotId); tripActivePopup?.remove() })
  heartBtn.style.background = 'rgba(239,68,68,0.2)'; heartBtn.style.color = '#f87171'
  const removeBtn = mkBtn('✕', () => { window.removeTripMapSpot?.(spotId); tripActivePopup?.remove() })
  removeBtn.style.background = 'rgba(239,68,68,0.2)'; removeBtn.style.color = '#f87171'
  const detailBtn = mkBtn('🔍', () => { window.selectSpot?.(spotId) })
  detailBtn.style.background = 'rgba(59,130,246,0.2)'; detailBtn.style.color = '#60a5fa'
  btnRow.appendChild(heartBtn)
  btnRow.appendChild(removeBtn)
  btnRow.appendChild(detailBtn)
  popupEl.appendChild(btnRow)
  tripActivePopup = new maplibregl.Popup({ offset: 15, closeButton: true, maxWidth: '240px' })
    .setLngLat(coords)
    .setDOMContent(popupEl)
    .addTo(map)
}

// Update spots on the map without re-init (for filters, highlight, remove)
window._tripMapUpdateSpots = () => {
  if (!tripMapInstance) return
  const state = window.getState?.() || {}
  const results = state.tripResults
  if (!results?.spots) return
  const removedSet = new Set((state.tripRemovedSpots || []).map(String))
  const routeFilter = state.routeFilter
  const allSpots = results.spots.filter(s => !removedSet.has(String(s.id)))
  // Apply route filter — only matching spots appear on the map (no fading)
  const displaySpots = (routeFilter && routeFilter !== 'all')
    ? applyTripFilter(allSpots, routeFilter)
    : allSpots
  const favSet = getFavoritesSet()
  const spotFeatures = []
  displaySpots.forEach((spot, i) => {
    const lat = spot.coordinates?.lat || spot.lat
    const lng = spot.coordinates?.lng || spot.lng
    if (!lat || !lng) return
    const isFav = favSet.has(spot.id) || favSet.has(String(spot.id))
    spotFeatures.push({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [lng, lat] },
      properties: {
        id: spot.id,
        index: i + 1,
        color: isFav ? '#f59e0b' : '#22c55e',
        strokeColor: '#ffffff',
        radius: isFav ? 14 : 12,
        strokeWidth: isFav ? 3 : 2,
        opacity: 1,
      },
    })
  })
  const source = tripMapInstance.getSource('trip-spots')
  if (source) {
    source.setData({ type: 'FeatureCollection', features: spotFeatures })
  }
}

// Show popup for a specific spot (from bottom sheet click)
window._tripMapShowPopup = (spotId) => {
  if (!tripMapInstance || !tripMaplibregl) return
  const state = window.getState?.() || {}
  const spots = state.tripResults?.spots || []
  const spot = spots.find(s => s.id === spotId)
  if (!spot) return
  const lat = spot.coordinates?.lat || spot.lat
  const lng = spot.coordinates?.lng || spot.lng
  if (!lat || !lng) return
  showTripSpotPopup(tripMapInstance, tripMaplibregl, spotId, [lng, lat], spots)
}

// Fit bounds to given coordinates
window._tripMapFitBounds = (coords) => {
  if (!tripMapInstance || !tripMaplibregl || !coords?.length) return
  if (coords.length < 2) return
  const bounds = coords.reduce(
    (b, c) => b.extend(c),
    new tripMaplibregl.LngLatBounds(coords[0], coords[0])
  )
  tripMapInstance.fitBounds(bounds, { padding: 50 })
}

// Expose for Travel.js to call dynamically
window._tripMapAddAmenities = addAmenityMarkers
window._tripMapRemoveAmenities = removeAmenityMarkers
window._tripMapFlyTo = (lng, lat) => {
  if (tripMapInstance) tripMapInstance.flyTo({ center: [lng, lat], zoom: 13, duration: 800 })
}
window._tripMapResize = () => {
  if (tripMapInstance) {
    tripMapInstance.resize()
    tripMapInstance.triggerRepaint()
  }
}
window._tripMapCleanup = () => {
  stopTripGpsTracking()
  removeAmenityMarkers()
  if (tripMapInstance) {
    try { tripMapInstance.remove() } catch { /* ignore */ }
  }
  const container = document.getElementById('trip-map')
  if (container) container.dataset.initialized = ''
  tripMapInstance = null
  tripMaplibregl = null
}

export default { renderApp, afterRender };
