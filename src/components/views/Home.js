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
    <div class="relative overflow-hidden" style="height:calc(100dvh - 4rem)">
      <!-- Map — full screen behind everything (z-0) -->
      <div id="home-map-container" class="absolute inset-0 z-0 bg-dark-secondary ">
        <div id="home-map" class="w-full h-full"></div>
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

      <!-- Floating search bar (translucent, top) -->
      <div class="absolute ${companionActive ? 'top-[4.5rem]' : 'top-4'} left-4 right-4 z-30">
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
      <div class="absolute bottom-[5rem] left-3 z-20 flex flex-col gap-2 items-start">
        <button
          onclick="openOfflinePanel()"
          class="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg transition-colors hover:text-white"
          style="background:rgba(15,23,42,0.7);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.1);color:#94a3b8"
          aria-label="${t('offline') || 'Hors-ligne'}"
          tabindex="0"
        >
          ${icon('download-cloud', 'w-[18px] h-[18px]')}
        </button>
        <button
          onclick="changeTab('challenges');setState({voyageSubTab:'guides', guideSection:'countries'${hasGuide ? `, selectedCountryGuide:'${currentCountry}'` : ''}})"
          class="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg transition-colors hover:text-white"
          style="background:rgba(15,23,42,0.7);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.1);color:#94a3b8"
          aria-label="${t('countryGuides') || 'Guides pays'}"
          tabindex="0"
        >
          ${icon('book-open', 'w-[18px] h-[18px]')}
        </button>
        <div id="spot-counter" class="pointer-events-none">
          <div class="px-2 py-1.5 rounded-lg text-[10px] leading-snug shadow-lg" style="background:rgba(0,0,0,0.5);backdrop-filter:blur(4px)">
            <span class="flex items-center gap-1 text-slate-500"><span class="w-[5px] h-[5px] bg-slate-500 rounded-full inline-block"></span> <span id="hw-count">0</span> ${t('pendingShort') || 'en att.'}</span>
            <span class="flex items-center gap-1 text-emerald-500 mt-0.5"><span class="w-[5px] h-[5px] bg-emerald-500 rounded-full inline-block"></span> <span id="sh-count">0</span> ${t('validatedShort') || 'validés'}</span>
          </div>
        </div>
      </div>

      <!-- Add Spot FAB -->
      <button
        onclick="openAddSpot()"
        class="fixed bottom-36 right-5 z-30 w-16 h-16 rounded-full bg-primary-500 text-white shadow-lg shadow-primary-500/30 flex items-center justify-center text-2xl hover:bg-primary-600 hover:scale-110 transition-colors"
        aria-label="${t('addSpot') || 'Ajouter un spot'}"
        title="${t('addSpot') || 'Ajouter un spot'}"
      >
        ${icon('plus', 'w-5 h-5')}
      </button>
    </div>
  `
}

export default { renderHome }
