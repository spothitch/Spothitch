/**
 * Home View Component — Full-screen Map
 * Floating search, bottom sheet with nearby spots, split view toggle
 */

import { t } from '../../i18n/index.js'
import { getGuideByCode } from '../../data/guides.js'
import { icon } from '../../utils/icons.js'
import { renderSearchInput } from '../../utils/searchInput.js'
import { isCompanionActive, getTimeUntilNextCheckIn } from '../../services/companion.js'

export function renderHome(state) {
  const searchLabel = state.homeSearchLabel || ''
  const companionActive = isCompanionActive()

  // Country guide indicator
  const currentCountry = state.searchCountry || null
  const currentGuide = currentCountry ? getGuideByCode(currentCountry.toUpperCase()) : null
  const hasGuide = !!currentGuide

  return `
    <div id="map-layout" class="relative overflow-hidden" style="height:calc(100dvh - 4rem)">
      <!-- Desktop side panel (hidden on mobile, visible on lg+) -->
      <div id="map-side-panel" class="hidden lg:flex flex-col bg-dark-primary border-r border-white/5 overflow-y-auto z-20">
        <div class="p-4 border-b border-white/5">
          <div class="flex items-center gap-2 mb-3">
            <img src="logo.png" alt="" class="w-7 h-7 rounded-lg" />
            <span class="font-bold text-sm gradient-text">SpotHitch</span>
          </div>
          <div class="relative">
            <input
              id="side-panel-destination"
              type="text"
              placeholder="${t('searchPlace') || 'Rechercher un lieu...'}"
              value="${searchLabel || ''}"
              oninput="homeSearchDestination(this.value)"
              onkeydown="if(event.key==='Enter'){homeSelectFirstSuggestion()}"
              class="w-full py-3 pl-10 pr-10 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-colors text-sm"
              autocomplete="off"
              aria-label="${t('searchPlace') || 'Rechercher un lieu...'}"
            />
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">${icon('search', 'w-4 h-4')}</span>
            <div id="side-panel-suggestions" class="absolute top-full left-0 right-0 mt-1 z-[60] hidden"></div>
          </div>
        </div>
        <div id="side-panel-content" class="flex-1 overflow-y-auto p-4">
          <p class="text-xs text-slate-500 text-center mt-8">${t('selectSpotOnMap') || 'Click a spot on the map to see details here'}</p>
        </div>
      </div>

      <!-- Map — full screen behind everything (z-0) -->
      <div id="home-map-container" class="absolute inset-0 lg:relative lg:flex-1 z-0 bg-dark-secondary">
        <div id="home-map" class="w-full h-full"></div>
        <div id="map-loading-indicator" class="absolute inset-0 flex items-center justify-center pointer-events-none z-10" style="transition:opacity 0.5s">
          <div class="flex flex-col items-center gap-2 text-slate-400">
            <div class="w-8 h-8 border-2 border-slate-600 border-t-amber-400 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>

      <!-- Companion Mode floating bar -->
      ${companionActive ? (() => {
        const secs = getTimeUntilNextCheckIn()
        const overdue = secs < 0
        const absSecs = Math.abs(secs)
        const mins = Math.floor(absSecs / 60)
        const sec = absSecs % 60
        return `
        <div class="absolute top-4 left-4 right-4 z-40" role="button" tabindex="0" onclick="showCompanionModal()">
          <div class="flex items-center justify-between px-4 py-2.5 rounded-xl ${overdue ? 'bg-red-500/90 border-red-400/30' : 'bg-emerald-500/90 border-emerald-400/30'} backdrop-blur-xl border shadow-lg cursor-pointer">
            <div class="flex items-center gap-2">
              ${icon('shield', 'w-4 h-4 text-white/80')}
              <span class="text-sm font-medium text-white">${t('companionMode') || 'Compagnon'}</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-sm font-bold text-white">${overdue ? '-' : ''}${String(mins).padStart(2, '0')}:${String(sec).padStart(2, '0')}</span>
              <button onclick="event.stopPropagation();companionCheckIn()" class="px-3 py-1.5 rounded-xl bg-white/20 text-white text-xs font-semibold hover:bg-white/30 transition-colors active:scale-95" aria-label="${t('imSafe') || 'Je vais bien'}">
                ${icon('check', 'w-3 h-3')} ${t('imSafe') || 'OK'}
              </button>
            </div>
          </div>
        </div>
        `
      })() : ''}

      <!-- Floating search bar (translucent, top) — hidden on desktop (in side panel) -->
      <div class="absolute ${companionActive ? 'top-[4.5rem]' : 'top-4'} left-4 right-4 z-30 lg:hidden">
        <div class="flex gap-3">
          ${renderSearchInput({
            id: 'home-destination',
            placeholder: t('searchPlace') || 'Rechercher un lieu...',
            ariaLabel: t('searchPlace') || 'Rechercher un lieu',
            value: searchLabel,
            oninput: 'homeSearchDestination(this.value)',
            onkeydown: "if(event.key==='Enter'){homeSelectFirstSuggestion()}",
            inputClass: 'w-full pr-11 py-3.5 rounded-xl bg-dark-primary/60 backdrop-blur-xl border border-white/10 text-white placeholder-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-colors shadow-lg text-base',
            paddingLeft: 'pl-11',
            iconLeft: 'left-4',
            autocomplete: 'off',
            wrapperClass: 'flex-1',
            extraHTML: `${searchLabel ? `
              <button
                onclick="homeClearSearch()"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                aria-label="${t('clear') || 'Effacer'}"
              >
                ${icon('x', 'w-5 h-5')}
              </button>
            ` : ''}
            <div id="home-dest-suggestions" class="absolute top-full left-0 right-0 mt-1 z-[60] hidden"></div>`,
          })}
          <!-- Filter button -->
          <button
            onclick="openFilters()"
            class="px-4 py-3.5 rounded-xl bg-dark-primary/60 backdrop-blur-xl border border-white/10 text-slate-400 hover:text-white hover:border-primary-500/50 transition-colors shadow-lg"
            aria-label="${t('filterSpots') || 'Filtrer les spots'}"
            title="${t('filters') || 'Filtres'}"
          >
            ${icon('sliders-horizontal', 'w-5 h-5')}
          </button>
        </div>
      </div>


      <!-- Map controls injected persistently inside #home-map by App.js afterRender -->

      <!-- Country Guide shortcut + Spot Counter -->
      <div class="absolute bottom-[7.5rem] lg:bottom-8 left-3 z-30 flex flex-col gap-2 items-start">
        <button
          onclick="openOfflinePanel()"
          class="flex items-center gap-2 h-11 px-3 rounded-xl bg-dark-primary/60 backdrop-blur-xl border border-white/10 text-slate-300 shadow-lg hover:bg-dark-primary/80 hover:text-white active:scale-95 transition-all"
          aria-label="${t('offline') || 'Hors-ligne'}"
          tabindex="0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m8 17 4 4 4-4"/></svg>
          <span class="text-[11px] font-medium">${t('offline') || 'Hors-ligne'}</span>
        </button>
        <button
          onclick="changeTab('challenges');setState({voyageSubTab:'guides', guideSection:'countries'${hasGuide ? `, selectedCountryGuide:'${currentCountry}'` : ''}})"
          class="flex items-center gap-2 h-11 px-3 rounded-xl bg-dark-primary/60 backdrop-blur-xl border border-white/10 text-slate-300 shadow-lg hover:bg-dark-primary/80 hover:text-white active:scale-95 transition-all"
          aria-label="${t('countryGuides') || 'Guides pays'}"
          tabindex="0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
          <span class="text-[11px] font-medium">${t('guides') || 'Guides'}</span>
        </button>
      </div>

      <!-- Add Spot FAB -->
      <button
        onclick="openAddSpot()"
        class="fixed lg:absolute bottom-36 lg:bottom-8 right-5 z-30 w-16 h-16 rounded-full bg-primary-500 text-white shadow-lg shadow-primary-500/30 flex items-center justify-center text-2xl hover:bg-primary-600 hover:scale-110 transition-colors"
        aria-label="${t('addSpot') || 'Ajouter un spot'}"
        title="${t('addSpot') || 'Ajouter un spot'}"
      >
        ${icon('plus', 'w-5 h-5')}
      </button>
    </div>
  `
}

export default { renderHome }
