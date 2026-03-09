/**
 * AddSpot Modal Component
 * 3-step form to add a new hitchhiking spot with structured data collection
 *
 * Step 1: Photo + Type + GPS position + departure city
 * Step 2: Destination + Experience (wait time, method, group, time of day)
 * Step 3: Details (ratings, amenities, description) + Submit
 *
 * All data is structured for city pages, SEO, and future API export.
 */

import { t } from '../../i18n/index.js'
import { icon } from '../../utils/icons.js'
import { escapeHTML } from '../../utils/sanitize.js'

// Wait time slider steps (minutes)
const WAIT_STEPS = [1, 2, 3, 5, 10, 15, 20, 25, 30, 45, 60, 90, 120, 180]

function detectSeason() {
  const month = new Date().getMonth()
  if (month >= 2 && month <= 4) return 'spring'
  if (month >= 5 && month <= 7) return 'summer'
  if (month >= 8 && month <= 10) return 'autumn'
  return 'winter'
}

/**
 * Render interactive star rating for a criterion
 */
function renderStarInput(criterion, label) {
  return `
    <div class="mb-3">
      <label class="text-sm text-slate-400 block mb-1">${label} <span aria-label="obligatoire">*</span></label>
      <div class="flex items-center gap-1" role="radiogroup" aria-label="${label}">
        ${[1, 2, 3, 4, 5].map(star => `
          <button
            type="button"
            onclick="setSpotRating('${criterion}', ${star})"
            class="spot-star-btn text-2xl text-slate-400 hover:text-yellow-400 transition-colors"
            data-criterion="${criterion}"
            data-star="${star}"
            aria-label="${star}/5"
          >
            ${icon('star', 'w-5 h-5')}
          </button>
        `).join('')}
        <span class="ml-2 text-sm text-white font-medium" id="spot-rating-value-${criterion}"></span>
      </div>
      <p class="text-xs text-slate-400 mt-1 min-h-[1.25rem]" id="spot-rating-desc-${criterion}" aria-live="polite"></p>
    </div>
  `
}

/**
 * Render step progress indicator
 */
function renderStepProgress(currentStep) {
  const steps = [1, 2, 3]
  const labels = [
    t('stepPhotoType') || 'Photo & Type',
    t('stepExperience') || 'Experience',
    t('stepDetails') || 'Details',
  ]
  return `
    <div class="flex items-center justify-center gap-1 mb-4">
      ${steps.map((step, i) => {
        const dotClass = step < currentStep ? 'completed' : step === currentStep ? 'current' : 'pending'
        const lineClass = step <= currentStep ? 'completed' : 'pending'
        return `
          ${i > 0 ? `<div class="step-line ${lineClass}"></div>` : ''}
          <div class="step-dot ${dotClass}" title="${labels[i]}"></div>
        `
      }).join('')}
    </div>
    <p class="text-center text-xs text-slate-400 mb-4">${labels[currentStep - 1]}</p>
  `
}

/**
 * Render Step 1: Photo + Type + Position + Departure City
 */
function renderStep1(state) {
  const spotType = state.addSpotType || ''
  return `
    <div class="step-transition">
      <!-- Photo (optional, bonus points — up to 3) -->
      <div>
        <label for="spot-photo" class="text-sm text-slate-400 block mb-2">
          ${t('photoBonus')}
          <span class="text-xs text-slate-500 ml-1">(${t('maxPhotos')})</span>
        </label>
        <input
          type="file"
          id="spot-photo"
          name="photo"
          accept="image/*"
          class="hidden"
          onchange="handlePhotoSelect(event)"
          aria-describedby="photo-help"
        />
        ${(window.spotFormData?.photos?.length || 0) < 3 ? `
        <div
          id="photo-upload"
          class="photo-upload"
          onclick="triggerPhotoUpload()"
          onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();triggerPhotoUpload();}"
          role="button"
          tabindex="0"
          aria-label="${t('clickToAddPhoto') || 'Cliquez pour ajouter une photo'}"
        >
          <div>
            ${icon('camera', 'w-10 h-10 text-slate-400 mb-2')}
            <p class="text-slate-400">${t('takePhoto')}</p>
            <p class="text-slate-400 text-sm" id="photo-help">${t('chooseFromGallery')}</p>
          </div>
        </div>
        ` : ''}
        <div id="photo-preview" class="flex gap-2 mt-2 flex-wrap">
          ${(window.spotFormData?.photos || []).map((p, i) => `
            <div class="relative w-24 h-24 rounded-lg overflow-hidden border border-white/10">
              <img src="${p}" alt="Photo ${i + 1}" class="w-full h-full object-cover" />
              <button type="button" onclick="removeSpotPhoto(${i})"
                class="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 flex items-center justify-center text-red-400 hover:text-red-300"
                aria-label="${t('close') || 'Supprimer'}">
                ${icon('x', 'w-4 h-4')}
              </button>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Spot Type - Big visual buttons -->
      <div>
        <label class="text-sm text-slate-400 block mb-2">${t('spotTypeLabel')} <span aria-label="obligatoire">*</span></label>
        <div class="spot-type-grid">
          <button type="button" onclick="selectSpotType('city_exit')"
            class="spot-type-btn ${spotType === 'city_exit' ? 'active' : ''}">
            <span class="text-2xl">🏙️</span>
            <span class="text-xs font-medium">${t('spotTypeCityExit')}</span>
          </button>
          <button type="button" onclick="selectSpotType('gas_station')"
            class="spot-type-btn ${spotType === 'gas_station' ? 'active' : ''}">
            <span class="text-2xl">⛽</span>
            <span class="text-xs font-medium">${t('spotTypeGasStation')}</span>
          </button>
          <button type="button" onclick="selectSpotType('highway')"
            class="spot-type-btn ${spotType === 'highway' ? 'active' : ''}">
            <span class="text-2xl">🛣️</span>
            <span class="text-xs font-medium">${t('spotTypeHighway')}</span>
          </button>
          <button type="button" onclick="selectSpotType('custom')"
            class="spot-type-btn ${spotType === 'custom' ? 'active' : ''}">
            <span class="text-2xl">📍</span>
            <span class="text-xs font-medium">${t('spotTypeCustom')}</span>
          </button>
        </div>
        <button type="button" onclick="autoDetectRoad()" class="w-full mt-2 py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-400 hover:text-primary-400 transition-colors flex items-center justify-center gap-2">
          ${icon('map-pin', 'w-3 h-3')} ${t('autoDetectType') || 'Auto-detecter le type'}
        </button>
      </div>

      <!-- Station Name (gas_station only) -->
      ${spotType === 'gas_station' ? `
        <div>
          <label for="spot-station-name" class="text-sm text-slate-400 block mb-2">
            ${t('stationNameLabel')} <span aria-label="obligatoire">*</span>
          </label>
          <input
            type="text"
            id="spot-station-name"
            name="stationName"
            class="input-modern"
            placeholder="${t('stationNamePlaceholder')}"
            maxlength="100"
            value="${window.spotFormData?.stationName || ''}"
            oninput="window.spotFormData.stationName = this.value"
          />
        </div>
      ` : ''}

      <!-- GPS Position -->
      ${renderPositionBlock()}

      <!-- Departure City (autocomplete forced) -->
      <div class="relative">
        <label for="spot-departure-city" class="text-sm text-slate-400 block mb-2">
          ${t('departureCity') || 'Ville de départ'} <span aria-label="obligatoire">*</span>
        </label>
        <input
          type="text"
          id="spot-departure-city"
          name="departureCity"
          class="input-modern"
          placeholder="${t('departureCity') || 'Ville de départ'}"
          required
          aria-required="true"
        />
        <p class="text-xs text-slate-500 mt-1">${t('selectFromList') || 'Sélectionne dans la liste'}</p>
      </div>

      <!-- Continue button -->
      <button
        type="button"
        onclick="addSpotNextStep()"
        class="btn btn-primary w-full text-lg"
      >
        ${t('continue') || 'Continuer'}
        ${icon('arrow-right', 'w-5 h-5')}
      </button>
    </div>
  `
}

/**
 * Render Step 2: Destination + Experience
 */
function renderStep2(state) {
  const waitIdx = state.addSpotWaitTime != null
    ? WAIT_STEPS.indexOf(state.addSpotWaitTime)
    : -1
  const currentWait = waitIdx >= 0 ? WAIT_STEPS[waitIdx] : null
  const method = state.addSpotMethod || window.spotFormData?.method || ''
  const groupSize = state.addSpotGroupSize || window.spotFormData?.groupSize || ''
  const timeOfDay = state.addSpotTimeOfDay || window.spotFormData?.timeOfDay || ''
  const rideResult = window.spotFormData?.rideResult || ''

  return `
    <div class="step-transition">
      <h3 class="text-sm font-semibold text-slate-300 mb-4">
        ${icon('compass', 'w-4 h-4 mr-1 text-primary-400')}
        ${t('experienceSection') || 'Ton expérience'}
      </h3>

      <!-- Direction City (autocomplete forced) -->
      <div class="relative mb-4">
        <label for="spot-direction-city" class="text-sm text-slate-400 block mb-2">
          ${t('destinationCity') || 'Direction'} <span aria-label="obligatoire">*</span>
        </label>
        <input
          type="text"
          id="spot-direction-city"
          name="directionCity"
          class="input-modern"
          placeholder="${t('destinationCity') || 'Direction'}"
          value="${escapeHTML(window.spotFormData?.directionCity || '')}"
          required
          aria-required="true"
        />
        <p class="text-xs text-slate-500 mt-1">${t('selectFromList') || 'Sélectionne dans la liste'}</p>
      </div>

      <!-- Extra destinations (multi-destination) -->
      <div class="mb-4">
        ${(window.spotFormData?.extraDestinations || []).map((d, i) => `
          <div class="flex items-center gap-2 mb-2">
            <span class="flex-1 px-3 py-1.5 rounded-lg bg-primary-500/10 text-primary-300 text-sm border border-primary-500/20">
              ${icon('map-pin', 'w-3.5 h-3.5 inline mr-1')} ${escapeHTML(d.city)}
            </span>
            <button type="button" onclick="removeSpotDestination(${i})"
              class="w-7 h-7 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 hover:bg-red-500/20"
              aria-label="${t('removeDestination') || 'Supprimer'}">
              ${icon('x', 'w-4 h-4')}
            </button>
          </div>
        `).join('')}
        ${(window.spotFormData?.extraDestinations || []).length < 4 ? `
          <div class="relative" id="extra-dest-wrapper" style="display:none">
            <input
              type="text"
              id="spot-extra-dest"
              class="input-modern text-sm"
              placeholder="${t('destinationCityPlaceholder') || 'Ville de destination'}"
            />
          </div>
          <button type="button" onclick="addSpotDestination()"
            class="w-full py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-400 hover:text-primary-400 transition-colors flex items-center justify-center gap-2 mt-1"
            id="add-dest-btn">
            ${icon('plus', 'w-3.5 h-3.5')} ${t('addDestination') || 'Ajouter une destination'}
          </button>
        ` : `
          <p class="text-xs text-slate-500 text-center">${t('maxDestinations') || 'Maximum 5 destinations'}</p>
        `}
      </div>

      <!-- Wait Time Slider -->
      <div class="mb-4">
        <label class="text-sm text-slate-400 block mb-2">
          ${icon('clock', 'w-4 h-4 mr-1')}
          ${t('waitTimeLabel') || "Temps d'attente"} <span class="text-red-400">*</span>
        </label>
        <input
          type="range"
          min="0"
          max="${WAIT_STEPS.length - 1}"
          value="${waitIdx >= 0 ? waitIdx : 4}"
          class="wait-slider w-full"
          oninput="setWaitTime(this.value)"
          aria-label="${t('waitTimeSliderDesc') || 'Combien de temps as-tu attendu ?'}"
        />
        <div class="wait-slider-labels">
          <span>1 min</span>
          <span>15</span>
          <span>45</span>
          <span>2h</span>
          <span>3h+</span>
        </div>
        <div class="text-center text-lg font-bold text-primary-400 mt-2" id="wait-time-display">
          ${currentWait ? (currentWait >= 180 ? '3h+' : currentWait + ' min') : '10 min'}
        </div>
      </div>

      <!-- Method (3 radio buttons) -->
      <div class="mb-4">
        <label class="text-sm text-slate-400 block mb-2">
          ${icon('hand', 'w-4 h-4 mr-1')}
          ${t('practicalTips') || 'Méthode'} <span class="text-red-400">*</span>
        </label>
        <div class="radio-group">
          <button type="button" onclick="setMethod('sign')"
            class="radio-btn ${method === 'sign' ? 'active' : ''}">
            ${icon('file-text', 'w-4 h-4 mr-1')} ${t('methodSign') || 'Panneau'}
          </button>
          <button type="button" onclick="setMethod('thumb')"
            class="radio-btn ${method === 'thumb' ? 'active' : ''}">
            ${icon('hand', 'w-4 h-4 mr-1')} ${t('methodThumb') || 'Pouce'}
          </button>
          <button type="button" onclick="setMethod('asking')"
            class="radio-btn ${method === 'asking' ? 'active' : ''}">
            ${icon('message-circle', 'w-4 h-4 mr-1')} ${t('methodAsking') || 'En demandant'}
          </button>
        </div>
      </div>

      <!-- Group Size (3 radio buttons) -->
      <div class="mb-4">
        <label class="text-sm text-slate-400 block mb-2">
          ${icon('users', 'w-4 h-4 mr-1')}
          ${t('groupSizeLabel') || 'Combien étiez-vous ?'} <span class="text-red-400">*</span>
        </label>
        <div class="radio-group">
          <button type="button" onclick="setGroupSize('solo')"
            class="radio-btn ${groupSize === 'solo' ? 'active' : ''}">
            ${t('groupSolo') || 'Solo'}
          </button>
          <button type="button" onclick="setGroupSize('duo')"
            class="radio-btn ${groupSize === 'duo' ? 'active' : ''}">
            ${t('groupDuo') || 'Duo'}
          </button>
          <button type="button" onclick="setGroupSize('group')"
            class="radio-btn ${groupSize === 'group' ? 'active' : ''}">
            ${t('groupTrioPlus') || 'Groupe 3+'}
          </button>
        </div>
      </div>

      <!-- Time of Day (4 radio buttons) -->
      <div class="mb-4">
        <label class="text-sm text-slate-400 block mb-2">
          ${icon('sun', 'w-4 h-4 mr-1')}
          ${t('timeOfDayLabel') || 'Moment de la journée'} <span class="text-red-400">*</span>
        </label>
        <div class="radio-group">
          <button type="button" onclick="setTimeOfDay('morning')"
            class="radio-btn ${timeOfDay === 'morning' ? 'active' : ''}">
            🌅 ${t('timeMorning') || 'Matin'}
          </button>
          <button type="button" onclick="setTimeOfDay('afternoon')"
            class="radio-btn ${timeOfDay === 'afternoon' ? 'active' : ''}">
            ☀️ ${t('timeAfternoon') || 'Après-midi'}
          </button>
          <button type="button" onclick="setTimeOfDay('evening')"
            class="radio-btn ${timeOfDay === 'evening' ? 'active' : ''}">
            🌆 ${t('timeEvening') || 'Soir'}
          </button>
          <button type="button" onclick="setTimeOfDay('night')"
            class="radio-btn ${timeOfDay === 'night' ? 'active' : ''}">
            🌙 ${t('timeNight') || 'Nuit'}
          </button>
        </div>
      </div>

      <!-- Got a ride? -->
      <div class="mb-4">
        <label class="text-sm text-slate-400 block mb-2">
          ${icon('thumbs-up', 'w-4 h-4 mr-1')}
          ${t('gotARide') || 'Tu as eu un lift ?'} <span class="text-red-400">*</span>
        </label>
        <div class="radio-group">
          <button type="button" onclick="setRideResult('yes')"
            class="radio-btn ${rideResult === 'yes' ? 'active' : ''}">
            ✅ ${t('yes') || 'Oui'}
          </button>
          <button type="button" onclick="setRideResult('gaveUp')"
            class="radio-btn ${rideResult === 'gaveUp' ? 'active' : ''}">
            🏳️ ${t('gaveUp') || 'Abandonné'}
          </button>
        </div>
      </div>

      <!-- Navigation buttons -->
      <div class="flex gap-3">
        <button type="button" onclick="addSpotPrevStep()" class="btn btn-ghost flex-1">
          ${icon('arrow-left', 'w-5 h-5')} ${t('back') || 'Retour'}
        </button>
        <button type="button" onclick="addSpotNextStep()" class="btn btn-primary flex-1">
          ${t('continue') || 'Continuer'} ${icon('arrow-right', 'w-5 h-5')}
        </button>
      </div>
    </div>
  `
}

/**
 * Render Step 3: Details (ratings + amenities + description) + Submit
 */
function renderStep3(state) {
  const isPreview = state.addSpotPreview === true
  const tags = window.spotFormData.tags || {}
  return `
    <div class="step-transition">
      <!-- Ratings -->
      <div class="mb-5">
        <h3 class="text-sm font-semibold text-slate-300 mb-3">
          ${icon('star', 'w-4 h-4 mr-1 text-yellow-400')}
          ${t('detailedRatings')}
        </h3>
        ${renderStarInput('safety', t('safetyRating'))}
        ${renderStarInput('traffic', t('traffic'))}
        ${renderStarInput('accessibility', t('accessibility'))}
      </div>

      <!-- Amenities -->
      <div class="mb-5">
        <label class="text-sm text-slate-400 block mb-2">
          ${icon('map-pin', 'w-4 h-4 mr-1 text-emerald-400')}
          ${t('amenitiesLabel') || 'Équipements à proximité'}
        </label>
        <div class="flex flex-wrap gap-2">
          <button type="button" onclick="toggleAmenity('shelter')"
            class="amenity-chip ${tags.shelter ? 'active' : ''}">
            ${icon('umbrella', 'w-4 h-4 mr-1')} ${t('amenityShelter') || 'Abri pluie'}
          </button>
          <button type="button" onclick="toggleAmenity('waterFood')"
            class="amenity-chip ${tags.waterFood ? 'active' : ''}">
            ${icon('droplets', 'w-4 h-4 mr-1')} ${t('amenityWaterFood') || 'Eau/nourriture'}
          </button>
          <button type="button" onclick="toggleAmenity('toilets')"
            class="amenity-chip ${tags.toilets ? 'active' : ''}">
            🚻 ${t('amenityToilets') || 'Toilettes'}
          </button>
          <button type="button" onclick="toggleAmenity('visibility')"
            class="amenity-chip ${tags.visibility ? 'active' : ''}">
            ${icon('eye', 'w-4 h-4 mr-1')} ${t('goodVisibilityTag') || 'Visible de loin'}
          </button>
          <button type="button" onclick="toggleAmenity('stoppingSpace')"
            class="amenity-chip ${tags.stoppingSpace ? 'active' : ''}">
            ${icon('square-parking', 'w-4 h-4 mr-1')} ${t('stoppingSpaceTag') || "Place pour s'arrêter"}
          </button>
        </div>
      </div>

      <!-- Description -->
      <div class="mb-5">
        <label for="spot-description" class="text-sm text-slate-400 block mb-2">${t('description')} <span class="text-xs text-slate-500">(${t('optional') || 'optionnel'})</span></label>
        <textarea
          id="spot-description"
          name="description"
          class="input-modern min-h-[100px] resize-none"
          placeholder="${t('spotDescPlaceholder') || 'Décris le spot, comment y accéder, conseils...'}"
          maxlength="500"
          aria-describedby="desc-counter"
        ></textarea>
        <div class="text-right text-xs text-slate-400 mt-1" id="desc-counter" aria-live="polite">
          <span id="desc-count">0</span>/500 <span class="sr-only">caractères</span>
        </div>
      </div>

      <!-- Navigation + Submit -->
      <div class="flex gap-3">
        <button type="button" onclick="addSpotPrevStep()" class="btn btn-ghost flex-1">
          ${icon('arrow-left', 'w-5 h-5')} ${t('back') || 'Retour'}
        </button>
        ${isPreview ? `
        <button type="button" onclick="closeAddSpot()"
          class="btn flex-1 text-lg bg-amber-500/20 text-amber-400 border border-amber-500/30" id="submit-spot-btn">
          ${icon('eye', 'w-5 h-5')} ${t('previewModeClose')}
        </button>
        ` : `
        <button type="submit" class="btn btn-primary flex-1 text-base whitespace-nowrap" id="submit-spot-btn">
          ${icon('share', 'w-5 h-5')} ${t('shareThisSpot') || t('create')}
        </button>
        `}
      </div>
    </div>
  `
}

/**
 * Render offline draft button
 */
function renderOfflineDraftButton() {
  if (navigator.onLine) return ''
  return `
    <div class="mt-3 p-3 rounded-xl bg-warning-500/10 border border-warning-500/20">
      <p class="text-sm text-warning-400 mb-2">${t('offlineMode') || 'Mode hors-ligne'}</p>
      <button type="button" onclick="saveDraftAndClose()" class="btn btn-warning btn-sm w-full">
        ${icon('save', 'w-4 h-4')} ${t('saveDraft') || 'Sauvegarder le brouillon'}
      </button>
    </div>
  `
}

function renderPositionBlock() {
  const hasPosition = window.spotFormData?.lat && window.spotFormData?.lng
  const lat = window.spotFormData?.lat
  const lng = window.spotFormData?.lng
  const city = window.spotFormData?.departureCity || ''

  return `
    <div>
      <span class="text-sm text-slate-400 block mb-2" id="location-label">${t('position') || 'Position'} <span aria-label="obligatoire">*</span></span>

      <!-- GPS button -->
      <button type="button" onclick="useGPSForSpot()" class="btn btn-ghost w-full mb-3" aria-describedby="location-display">
        ${icon('crosshair', 'w-5 h-5')} ${t('useMyPosition') || 'Ma position GPS'}
      </button>

      ${hasPosition ? `
        <!-- Position chosen: preview card -->
        <div class="spot-position-preview" onclick="openFullscreenMapPicker()" role="button" tabindex="0"
          onkeydown="if(event.key==='Enter')openFullscreenMapPicker()">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              ${icon('map-pin', 'w-5 h-5 text-amber-400')}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-white truncate">${city || t('positionChosen') || 'Position choisie'}</p>
              <p class="text-xs text-slate-400">${lat.toFixed(5)}, ${lng.toFixed(5)}</p>
            </div>
            <div class="flex-shrink-0 text-xs text-amber-400 font-medium flex items-center gap-1">
              ${icon('pencil', 'w-3.5 h-3.5')} ${t('modify') || 'Modifier'}
            </div>
          </div>
        </div>
      ` : `
        <!-- No position yet: big CTA to open map -->
        <button type="button" onclick="openFullscreenMapPicker()"
          class="spot-position-cta">
          <div class="flex flex-col items-center gap-2 py-2">
            ${icon('map', 'w-8 h-8 text-amber-400')}
            <span class="text-sm font-medium">${t('chooseOnMap') || 'Choisir sur la carte'}</span>
            <span class="text-xs text-slate-500">${t('tapToPlaceSpot') || 'Touche la carte pour placer ton spot'}</span>
          </div>
        </button>
      `}

      <div id="location-display" class="text-sm text-slate-400 mt-2 text-center sr-only" aria-live="polite" role="status"></div>
    </div>
  `
}

export function renderAddSpot(_state) {
  const isPreview = _state.addSpotPreview === true
  const currentStep = _state.addSpotStep || 1

  return `
    <div
      class="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onclick="closeAddSpot()"
      role="dialog"
      aria-modal="true"
      aria-labelledby="addspot-modal-title"
     tabindex="0">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true"></div>

      <!-- Modal -->
      <div
        class="relative modal-panel sm:rounded-3xl
          w-full max-w-lg max-h-[90vh] overflow-hidden slide-up"
        onclick="event.stopPropagation()"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h2 id="addspot-modal-title" class="text-xl font-bold">${t('addSpot')}${isPreview ? ` <span class="text-sm font-normal text-amber-400 ml-2">${t('previewMode')}</span>` : ''}</h2>
          <button
            onclick="closeAddSpot()"
            class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
            aria-label="${t('close') || 'Fermer'}"
            type="button"
          >
            ${icon('x', 'w-5 h-5')}
          </button>
        </div>

        <!-- Form -->
        <div class="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          ${renderStepProgress(currentStep)}

          <form id="add-spot-form" onsubmit="handleAddSpot(event)" class="space-y-5" aria-label="${t('addSpotForm') || "Formulaire d'ajout de spot"}">
            ${currentStep === 1 ? renderStep1(_state) : ''}
            ${currentStep === 2 ? renderStep2(_state) : ''}
            ${currentStep === 3 ? renderStep3(_state) : ''}
            ${currentStep >= 2 ? renderOfflineDraftButton() : ''}
          </form>
        </div>
      </div>
    </div>
  `
}

// Form state — ALL data structured for export/analysis
window.spotFormData = window.spotFormData || {
  photos: [],
  lat: null,
  lng: null,
  ratings: { safety: 0, traffic: 0, accessibility: 0 },
  tags: {
    shelter: false,
    waterFood: false,
    toilets: false,
    visibility: false,
    stoppingSpace: false,
  },
  country: null,
  countryName: null,
  departureCity: null,
  departureCityCoords: null,
  directionCity: null,
  directionCityCoords: null,
  locationName: null,
  roadNumber: null,
  positionSource: null,
  method: null,       // 'sign' | 'thumb' | 'asking'
  groupSize: null,    // 'solo' | 'duo' | 'group'
  timeOfDay: null,    // 'morning' | 'afternoon' | 'evening' | 'night'
  waitTime: null,     // minutes (number)
  season: null,       // auto-detected
  extraDestinations: [], // additional destinations [{city, coords}]
}

// Star rating descriptions map
const starDescriptions = {
  safety: (v) => t(`safetyDesc${v}`) || '',
  traffic: (v) => t(`trafficDesc${v}`) || '',
  accessibility: (v) => t(`accessibilityDesc${v}`) || '',
}

// Global handlers
window.triggerPhotoUpload = () => {
  document.getElementById('spot-photo')?.click()
}

window.handlePhotoSelect = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  if (!window.spotFormData.photos) window.spotFormData.photos = []
  if (window.spotFormData.photos.length >= 3) {
    const { showError } = await import('../../services/notifications.js')
    showError(t('maxPhotos'))
    return
  }

  try {
    const { compressImage } = await import('../../utils/image.js')
    const compressed = await compressImage(file)
    window.spotFormData.photos.push(compressed)

    // Re-render to update thumbnails and hide upload button if at max
    const { setState } = await import('../../stores/state.js')
    setState({ _photoRefresh: Date.now() })
  } catch (error) {
    console.error('Photo processing failed:', error)
    const { showError } = await import('../../services/notifications.js')
    showError(t('photoError') || 'Erreur lors du traitement de la photo')
  }
}

window.removeSpotPhoto = async (index) => {
  if (!window.spotFormData.photos) return
  window.spotFormData.photos.splice(index, 1)
  const { setState } = await import('../../stores/state.js')
  setState({ _photoRefresh: Date.now() })
}

window.setSpotRating = (criterion, value) => {
  window.spotFormData.ratings = window.spotFormData.ratings || {}
  window.spotFormData.ratings[criterion] = value

  const buttons = document.querySelectorAll(`button[data-criterion="${criterion}"]`)
  buttons.forEach((btn) => {
    const star = parseInt(btn.dataset.star, 10)
    const svg = btn.querySelector('svg')
    if (svg) {
      svg.setAttribute('fill', star <= value ? 'currentColor' : 'none')
    }
    if (star <= value) {
      btn.className = 'spot-star-btn text-2xl text-yellow-400 hover:text-yellow-300 transition-colors'
    } else {
      btn.className = 'spot-star-btn text-2xl text-slate-400 hover:text-yellow-400 transition-colors'
    }
  })

  const valueEl = document.getElementById(`spot-rating-value-${criterion}`)
  if (valueEl) valueEl.textContent = `${value}/5`

  const descEl = document.getElementById(`spot-rating-desc-${criterion}`)
  if (descEl) {
    const descFn = starDescriptions[criterion]
    descEl.textContent = descFn ? descFn(value) : ''
  }
}

// Spot type selection (big buttons) — DOM-only update, no re-render
window.selectSpotType = (type) => {
  window.spotFormData.spotType = type
  // Update button styles directly without triggering a full app re-render
  document.querySelectorAll('.spot-type-btn').forEach(btn => {
    const btnType = btn.getAttribute('onclick')?.match(/'(\w+)'/)?.[1]
    if (btnType === type) {
      btn.classList.add('active')
    } else {
      btn.classList.remove('active')
    }
  })
  // Store in state silently for persistence (without triggering render)
  import('../../stores/state.js').then(({ getState }) => {
    const state = getState()
    state.addSpotType = type
  })
}

// Wait time slider — DOM-only, no re-render
window.setWaitTime = (sliderIndex) => {
  const idx = parseInt(sliderIndex, 10)
  const minutes = WAIT_STEPS[idx] || 10
  window.spotFormData.waitTime = minutes
  const display = document.getElementById('wait-time-display')
  if (display) {
    display.textContent = minutes >= 180 ? '3h+' : minutes + ' min'
  }
}

// Method selection — DOM-only, no re-render
window.setMethod = (method) => {
  window.spotFormData.method = method
  document.querySelectorAll('[onclick*="setMethod"]').forEach(btn => {
    const btnMethod = btn.getAttribute('onclick')?.match(/'(\w+)'/)?.[1]
    btn.classList.toggle('active', btnMethod === method)
  })
}

// Group size selection — DOM-only, no re-render
window.setGroupSize = (size) => {
  window.spotFormData.groupSize = size
  document.querySelectorAll('[onclick*="setGroupSize"]').forEach(btn => {
    const btnSize = btn.getAttribute('onclick')?.match(/'(\w+)'/)?.[1]
    btn.classList.toggle('active', btnSize === size)
  })
}

// Time of day selection — DOM-only, no re-render
window.setTimeOfDay = (time) => {
  window.spotFormData.timeOfDay = time
  document.querySelectorAll('[onclick*="setTimeOfDay"]').forEach(btn => {
    const btnTime = btn.getAttribute('onclick')?.match(/'(\w+)'/)?.[1]
    btn.classList.toggle('active', btnTime === time)
  })
}

// Ride result — DOM-only, no re-render (prevents data loss)
window.setRideResult = (result) => {
  window.spotFormData.rideResult = result
  document.querySelectorAll('[onclick*="setRideResult"]').forEach(btn => {
    const btnResult = btn.getAttribute('onclick')?.match(/'(\w+)'/)?.[1]
    btn.classList.toggle('active', btnResult === result)
  })
}

// Multi-destination handlers
window.addSpotDestination = async () => {
  if (!window.spotFormData.extraDestinations) window.spotFormData.extraDestinations = []
  if (window.spotFormData.extraDestinations.length >= 4) {
    const { showError } = await import('../../services/notifications.js')
    showError(t('maxDestinations'))
    return
  }
  const wrapper = document.getElementById('extra-dest-wrapper')
  const btn = document.getElementById('add-dest-btn')
  if (wrapper && btn) {
    wrapper.style.display = 'block'
    btn.style.display = 'none'
    const input = document.getElementById('spot-extra-dest')
    if (input) {
      input.focus()
      // Init autocomplete for extra destination
      import('../../utils/autocomplete.js').then(({ initAutocomplete }) => {
        import('../../services/osrm.js').then(({ searchPhoton }) => {
          initAutocomplete({
            inputId: 'spot-extra-dest',
            searchFn: (q) => searchPhoton(q, {}),
            debounceMs: 100,
            forceSelection: true,
            onSelect: async (item) => {
              const city = item.name
              const coords = { lat: item.lat, lng: item.lng }
              // Check for duplicates
              const mainDest = window.spotFormData.directionCity || ''
              const extras = window.spotFormData.extraDestinations || []
              const allCities = [mainDest, ...extras.map(d => d.city)].map(c => c.toLowerCase())
              if (allCities.includes(city.toLowerCase())) {
                const { showError } = await import('../../services/notifications.js')
                showError(t('destinationAlreadyExists'))
                return
              }
              window.spotFormData.extraDestinations.push({ city, coords })
              // Re-render step 2
              document.activeElement?.blur()
              const { setState } = await import('../../stores/state.js')
              setState({ addSpotStep: 2 })
            },
            onClear: () => {},
          })
        })
      })
    }
  }
}

window.removeSpotDestination = (index) => {
  if (!window.spotFormData.extraDestinations) return
  window.spotFormData.extraDestinations.splice(index, 1)
  // Remove the destination chip from DOM directly (no re-render)
  const chips = document.querySelectorAll('[onclick*="removeSpotDestination"]')
  const chip = chips[index]
  if (chip) {
    const row = chip.closest('.flex.items-center')
    if (row) row.remove()
    // Re-index remaining remove buttons
    document.querySelectorAll('[onclick*="removeSpotDestination"]').forEach((btn, i) => {
      btn.setAttribute('onclick', `removeSpotDestination(${i})`)
    })
  }
}

// Toggle amenity chip — DOM-only, no re-render
window.toggleAmenity = (name) => {
  window.spotFormData.tags = window.spotFormData.tags || {}
  window.spotFormData.tags[name] = !window.spotFormData.tags[name]
  const chip = document.querySelector(`[onclick*="toggleAmenity('${name}')"]`)
  if (chip) chip.classList.toggle('active', window.spotFormData.tags[name])
}

// Keep backward compat for setSpotTag — DOM-only, no re-render
window.setSpotTag = (tagName, value) => {
  window.spotFormData.tags = window.spotFormData.tags || {}
  if (tagName === 'signMethod') {
    window.spotFormData.tags.signMethod = window.spotFormData.tags.signMethod === value ? null : value
  } else {
    window.spotFormData.tags[tagName] = value === true || value === 'true'
  }
  // Update chip visuals directly
  const chip = document.querySelector(`[onclick*="setSpotTag('${tagName}'"]`)
  if (chip) chip.classList.toggle('active')
}

// Alias for wiring compatibility
window.onSpotTypeChange = (spotType) => { window.selectSpotType(spotType) }

// Step navigation
window.addSpotNextStep = async () => {
  const { getState, setState } = await import('../../stores/state.js')
  const { showError } = await import('../../services/notifications.js')
  const state = getState()
  const currentStep = state.addSpotStep || 1

  if (currentStep === 1) {
    // Validate type + position + departure city (photo is optional for bonus points)
    const spotType = state.addSpotType || window.spotFormData.spotType
    if (!spotType) {
      showError(t('selectSpotType') || 'Choisis un type de spot')
      return
    }
    if (!window.spotFormData.lat || !window.spotFormData.lng) {
      showError(t('positionRequired') || 'Position obligatoire')
      return
    }
    if (!window.spotFormData.departureCity) {
      showError(t('departureRequired') || 'Ville de départ obligatoire')
      return
    }
    // Blur focused input so render() is not blocked by the typing guard
    document.activeElement?.blur()
    setState({ addSpotStep: 2, addSpotType: spotType })
  } else if (currentStep === 2) {
    // Validate direction + experience fields (all mandatory)
    if (!window.spotFormData.directionCity) {
      showError(t('destinationRequired') || 'Destination obligatoire')
      return
    }
    if (!window.spotFormData.method) {
      showError(t('methodRequired'))
      return
    }
    if (!window.spotFormData.groupSize) {
      showError(t('groupSizeRequired'))
      return
    }
    if (!window.spotFormData.timeOfDay) {
      showError(t('timeOfDayRequired'))
      return
    }
    if (!window.spotFormData.rideResult) {
      showError(t('rideResultRequired'))
      return
    }
    // Blur focused input so render() is not blocked by the typing guard
    document.activeElement?.blur()
    setState({ addSpotStep: 3 })
  }
}

window.addSpotPrevStep = async () => {
  const { getState, setState } = await import('../../stores/state.js')
  const state = getState()
  const currentStep = state.addSpotStep || 1
  if (currentStep > 1) {
    document.activeElement?.blur()
    setState({ addSpotStep: currentStep - 1 })
  }
}

// GPS position
window.useGPSForSpot = () => {
  const display = document.getElementById('location-display')

  if (!navigator.geolocation) {
    if (display) display.textContent = t('geoNotSupported') || 'Géolocalisation non supportée'
    return
  }

  if (display) display.innerHTML = `${icon('loader-circle', 'w-5 h-5 animate-spin')} ${t('locating') || 'Localisation...'}`

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      window.spotFormData.lat = position.coords.latitude
      window.spotFormData.lng = position.coords.longitude
      window.spotFormData.positionSource = 'gps'

      try {
        const { reverseGeocode } = await import('../../services/osrm.js')
        const location = await reverseGeocode(position.coords.latitude, position.coords.longitude)

        if (location) {
          if (location.countryCode) {
            window.spotFormData.country = location.countryCode
            window.spotFormData.countryName = location.country
          }
          if (location.city) {
            const departureCityInput = document.getElementById('spot-departure-city')
            if (departureCityInput && !departureCityInput.value) {
              departureCityInput.value = location.city
              window.spotFormData.departureCity = location.city
              window.spotFormData.departureCityCoords = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              }
            }
          }
          if (display) {
            display.innerHTML = `
              ${icon('circle-check', 'w-5 h-5 text-success-400')}
              ${location.city || 'Position'} (${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)})
            `
          }
        }
      } catch { /* no-op */ }

      // Re-render to show position preview card
      document.activeElement?.blur()
      const { setState } = await import('../../stores/state.js')
      setState({ addSpotStep: 1 })
    },
    (error) => {
      if (display) display.textContent = t('positionError') || "Impossible d'obtenir la position"
      console.error('Geolocation error:', error)
    },
    { enableHighAccuracy: true, timeout: 10000 }
  )
}


// Fullscreen map picker for AddSpot
let fullscreenMap = null
let fullscreenMapMarker = null

// Open fullscreen map picker overlay
window.openFullscreenMapPicker = async () => {
  // Create overlay
  const overlay = document.createElement('div')
  overlay.id = 'fullscreen-map-picker'
  overlay.className = 'fixed inset-0 z-[60] bg-dark-primary flex flex-col'
  overlay.innerHTML = `
    <div class="flex items-center justify-between px-4 py-3 bg-dark-primary/90 backdrop-blur-sm border-b border-white/10">
      <button type="button" id="fmp-cancel" class="text-sm text-slate-400 hover:text-white transition-colors px-3 py-1.5">
        ${icon('arrow-left', 'w-4 h-4 inline mr-1')} ${t('cancel') || 'Annuler'}
      </button>
      <span class="text-sm font-medium text-slate-300">${t('chooseOnMap') || 'Choisir sur la carte'}</span>
      <div class="w-20"></div>
    </div>
    <div id="fmp-map" class="flex-1 relative"></div>
    <div id="fmp-info" class="px-4 py-2 bg-dark-primary/90 backdrop-blur-sm border-t border-white/10 text-center text-xs text-amber-400/80 font-medium">
      ${t('tapToPlaceSpot') || 'Touche la carte pour placer ton spot'}
    </div>
    <div class="px-4 py-3 bg-dark-primary/90 backdrop-blur-sm border-t border-white/10">
      <button type="button" id="fmp-confirm" class="btn btn-primary w-full text-base" disabled>
        ${icon('check', 'w-5 h-5')} ${t('confirmPosition') || 'Confirmer la position'}
      </button>
    </div>
  `
  document.body.appendChild(overlay)

  // Prevent body scroll
  document.body.style.overflow = 'hidden'

  let pickedLat = window.spotFormData?.lat || null
  let pickedLng = window.spotFormData?.lng || null
  let pickedCity = ''

  try {
    await import('maplibre-gl/dist/maplibre-gl.css')
    const maplibregl = await import('maplibre-gl')

    // Center on existing position, user location, or default
    let center = [2.35, 48.85]
    let zoom = 5
    if (window._pendingShareCoords) {
      center = [window._pendingShareCoords.lng, window._pendingShareCoords.lat]
      zoom = 14
      pickedLat = window._pendingShareCoords.lat
      pickedLng = window._pendingShareCoords.lng
    } else if (pickedLat && pickedLng) {
      center = [pickedLng, pickedLat]
      zoom = 14
    } else {
      try {
        const { getState } = await import('../../stores/state.js')
        const loc = getState().userLocation
        if (loc?.lat && loc?.lng) {
          center = [loc.lng, loc.lat]
          zoom = 13
        }
      } catch { /* no-op */ }
    }

    fullscreenMap = new maplibregl.default.Map({
      container: document.getElementById('fmp-map'),
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center,
      zoom,
    })

    const confirmBtn = document.getElementById('fmp-confirm')
    const infoBar = document.getElementById('fmp-info')

    // Place existing marker if editing
    if (pickedLat && pickedLng) {
      fullscreenMapMarker = new maplibregl.default.Marker({ color: '#f59e0b' })
        .setLngLat([pickedLng, pickedLat])
        .addTo(fullscreenMap)
      confirmBtn.disabled = false
      // Reverse geocode existing position
      try {
        const { reverseGeocode } = await import('../../services/osrm.js')
        const location = await reverseGeocode(pickedLat, pickedLng)
        pickedCity = location?.city || ''
        if (infoBar) {
          infoBar.innerHTML = `<span class="text-green-400">${icon('map-pin', 'w-3.5 h-3.5 inline')} ${escapeHTML(pickedCity || '')} ${pickedLat.toFixed(5)}, ${pickedLng.toFixed(5)}</span>`
        }
      } catch { /* no-op */ }
    }

    // Handle share coords
    if (window._pendingShareCoords) {
      window._pendingShareCoords = null
    }

    fullscreenMap.on('click', async (e) => {
      pickedLat = e.lngLat.lat
      pickedLng = e.lngLat.lng

      // Move or create marker
      if (fullscreenMapMarker) {
        fullscreenMapMarker.setLngLat([pickedLng, pickedLat])
      } else {
        fullscreenMapMarker = new maplibregl.default.Marker({ color: '#f59e0b' })
          .setLngLat([pickedLng, pickedLat])
          .addTo(fullscreenMap)
      }

      confirmBtn.disabled = false

      // Update info bar with loading
      if (infoBar) {
        infoBar.innerHTML = `<span class="text-amber-400">${pickedLat.toFixed(5)}, ${pickedLng.toFixed(5)}</span>`
      }

      // Reverse geocode
      try {
        const { reverseGeocode } = await import('../../services/osrm.js')
        const location = await reverseGeocode(pickedLat, pickedLng)
        pickedCity = location?.city || ''
        if (location?.countryCode) {
          window.spotFormData.country = location.countryCode
          window.spotFormData.countryName = location.country
        }
        if (infoBar) {
          infoBar.innerHTML = `<span class="text-green-400">${icon('map-pin', 'w-3.5 h-3.5 inline')} ${pickedCity ? escapeHTML(pickedCity) + ' \u00b7 ' : ''}${pickedLat.toFixed(5)}, ${pickedLng.toFixed(5)}</span>`
        }
      } catch {
        if (infoBar) {
          infoBar.innerHTML = `<span class="text-green-400">${icon('map-pin', 'w-3.5 h-3.5 inline')} ${pickedLat.toFixed(5)}, ${pickedLng.toFixed(5)}</span>`
        }
      }
    })

    // Confirm button
    confirmBtn.addEventListener('click', async () => {
      if (pickedLat == null || pickedLng == null) return

      window.spotFormData.lat = pickedLat
      window.spotFormData.lng = pickedLng
      window.spotFormData.positionSource = 'map'
      if (pickedCity) {
        const departureCityInput = document.getElementById('spot-departure-city')
        if (departureCityInput && !departureCityInput.value) {
          departureCityInput.value = pickedCity
          window.spotFormData.departureCity = pickedCity
          window.spotFormData.departureCityCoords = { lat: pickedLat, lng: pickedLng }
        }
        if (!window.spotFormData.departureCity) {
          window.spotFormData.departureCity = pickedCity
        }
      }

      closeFullscreenMapPicker()

      // Re-render step 1 to show the position preview card
      document.activeElement?.blur()
      const { setState } = await import('../../stores/state.js')
      setState({ addSpotStep: 1 })
    })

    // Cancel button
    document.getElementById('fmp-cancel').addEventListener('click', closeFullscreenMapPicker)

  } catch (error) {
    console.error('Fullscreen map init failed:', error)
    closeFullscreenMapPicker()
  }
}

function closeFullscreenMapPicker() {
  if (fullscreenMap) {
    try { fullscreenMap.remove() } catch { /* no-op */ }
    fullscreenMap = null
    fullscreenMapMarker = null
  }
  const overlay = document.getElementById('fullscreen-map-picker')
  if (overlay) overlay.remove()
  document.body.style.overflow = ''
}

// Legacy stubs for backward compat (wiring tests)
window.toggleSpotMapPicker = async () => {}
window.spotMapPickLocation = () => {}


// Auto-detect spot type based on GPS position
window.autoDetectStation = async () => {
  const { showSuccess, showError } = await import('../../services/notifications.js')
  const lat = window.spotFormData?.lat
  const lng = window.spotFormData?.lng
  if (!lat || !lng) {
    showError(t('placeSpotFirst') || 'Place d\'abord ton spot sur la carte')
    return
  }
  try {
    const btn = document.querySelector('[onclick*="autoDetectStation"]')
    if (btn) btn.disabled = true
    const radius = 300
    const query = `[out:json][timeout:10];(node["amenity"="fuel"](around:${radius},${lat},${lng}););out center 1;`
    const resp = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`)
    const data = await resp.json()
    if (data.elements && data.elements.length > 0) {
      window.selectSpotType('gas_station')
      showSuccess(t('stationDetected') || 'Station-service detectee a proximite !')
    } else {
      showSuccess(t('noStationNearby') || 'Pas de station-service dans un rayon de 300m')
    }
    if (btn) btn.disabled = false
  } catch {
    showError(t('detectionFailed') || 'Detection impossible (pas de connexion ?)')
  }
}

window.autoDetectRoad = async () => {
  const { showSuccess, showError } = await import('../../services/notifications.js')
  const lat = window.spotFormData?.lat
  const lng = window.spotFormData?.lng
  if (!lat || !lng) {
    showError(t('placeSpotFirst') || 'Place d\'abord ton spot sur la carte')
    return
  }
  try {
    const btn = document.querySelector('[onclick*="autoDetectRoad"]')
    if (btn) btn.disabled = true
    const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=16`)
    const data = await resp.json()
    const road = (data.address?.road || '').toLowerCase()
    const roadType = data.address?.highway || ''
    const isHighway = /autoroute|motorway|highway|autobahn|autopista/i.test(road) ||
      /motorway|trunk/i.test(roadType)
    const isCity = data.address?.city || data.address?.town || data.address?.village
    if (isHighway) {
      window.selectSpotType('highway')
      showSuccess(t('highwayDetected') || 'Autoroute/voie rapide detectee !')
    } else if (isCity) {
      window.selectSpotType('city_exit')
      showSuccess(t('cityDetected') || `Sortie de ville detectee : ${isCity}`)
    } else {
      window.selectSpotType('custom')
      showSuccess(t('roadDetected') || 'Route detectee — type mis a "Autre"')
    }
    if (btn) btn.disabled = false
  } catch {
    showError(t('detectionFailed') || 'Detection impossible (pas de connexion ?)')
  }
}

// Draft saving — saves ALL form data
window.saveDraftAndClose = async () => {
  const { saveSpotDraft } = await import('../../services/spotDrafts.js')
  const { setState, getState } = await import('../../stores/state.js')
  const { showSuccess } = await import('../../services/notifications.js')
  const state = getState()

  saveSpotDraft({
    ...window.spotFormData,
    spotType: state.addSpotType,
    addSpotStep: state.addSpotStep,
    addSpotMethod: state.addSpotMethod,
    addSpotGroupSize: state.addSpotGroupSize,
    addSpotTimeOfDay: state.addSpotTimeOfDay,
    addSpotWaitTime: state.addSpotWaitTime,
  })

  showSuccess(t('draftSaved') || 'Brouillon sauvegardé !')
  setState({ showAddSpot: false })
}

// Keep backward compat
window.saveSpotAsDraft = window.saveDraftAndClose

window.openSpotDraft = async (draftId) => {
  const { getSpotDrafts } = await import('../../services/spotDrafts.js')
  const { setState } = await import('../../stores/state.js')
  const drafts = getSpotDrafts()
  const draft = drafts.find(d => d.id === draftId)
  if (!draft) return

  // Restore ALL form data
  window.spotFormData = {
    photos: draft.photos || (draft.photo ? [draft.photo] : []),
    lat: draft.lat,
    lng: draft.lng,
    ratings: draft.ratings || { safety: 0, traffic: 0, accessibility: 0 },
    tags: draft.tags || {},
    country: draft.country,
    countryName: draft.countryName,
    departureCity: draft.departureCity,
    departureCityCoords: draft.departureCityCoords,
    directionCity: draft.directionCity,
    directionCityCoords: draft.directionCityCoords,
    locationName: draft.locationName,
    roadNumber: draft.roadNumber,
    positionSource: draft.positionSource,
    method: draft.method,
    groupSize: draft.groupSize,
    timeOfDay: draft.timeOfDay,
    waitTime: draft.waitTime,
    season: draft.season,
    stationName: draft.stationName || '',
  }

  setState({
    showAddSpot: true,
    addSpotStep: draft.addSpotStep || 2,
    addSpotType: draft.spotType,
    addSpotMethod: draft.addSpotMethod || draft.method,
    addSpotGroupSize: draft.addSpotGroupSize || draft.groupSize,
    addSpotTimeOfDay: draft.addSpotTimeOfDay || draft.timeOfDay,
    addSpotWaitTime: draft.addSpotWaitTime || draft.waitTime,
    spotDraftsBannerVisible: false,
  })
}

window.deleteSpotDraft = async (draftId) => {
  const { deleteSpotDraft } = await import('../../services/spotDrafts.js')
  deleteSpotDraft(draftId)
  const { showToast } = await import('../../services/notifications.js')
  showToast(t('deleteDraft') || 'Brouillon supprimé', 'info')
  import('../../stores/state.js').then(({ setState }) => {
    setState({ spotDraftsBannerVisible: false })
  })
}

// Initialize autocomplete fields when step renders
let autocompleteCleanups = []

function initStep1Autocomplete() {
  if (!navigator.onLine) return

  import('../../utils/autocomplete.js').then(({ initAutocomplete }) => {
    import('../../services/osrm.js').then(({ searchPhoton }) => {
      const depInput = document.getElementById('spot-departure-city')
      if (depInput) {
        const ac = initAutocomplete({
          inputId: 'spot-departure-city',
          searchFn: (q) => searchPhoton(q, { countryCode: window.spotFormData.country }),
          debounceMs: 100,
          forceSelection: true,
          onSelect: (item) => {
            window.spotFormData.departureCity = item.name
            window.spotFormData.departureCityCoords = { lat: item.lat, lng: item.lng }
            if (item.countryCode && !window.spotFormData.country) {
              window.spotFormData.country = item.countryCode
              window.spotFormData.countryName = item.countryName
            }
          },
          onClear: () => {
            window.spotFormData.departureCity = null
            window.spotFormData.departureCityCoords = null
          },
        })
        autocompleteCleanups.push(ac)
      }
    })
  })
}

function initStep2Autocomplete() {
  if (!navigator.onLine) return

  import('../../utils/autocomplete.js').then(({ initAutocomplete }) => {
    import('../../services/osrm.js').then(({ searchPhoton }) => {
      const dirInput = document.getElementById('spot-direction-city')
      if (dirInput) {
        const ac = initAutocomplete({
          inputId: 'spot-direction-city',
          searchFn: (q) => searchPhoton(q, {}),
          debounceMs: 100,
          forceSelection: true,
          onSelect: (item) => {
            window.spotFormData.directionCity = item.name
            window.spotFormData.directionCityCoords = { lat: item.lat, lng: item.lng }
          },
          onClear: () => {
            window.spotFormData.directionCity = null
            window.spotFormData.directionCityCoords = null
          },
        })
        autocompleteCleanups.push(ac)
      }
    })
  })
}

function cleanupAutocompletes() {
  autocompleteCleanups.forEach(c => c.destroy())
  autocompleteCleanups = []
}

// Init autocomplete when AddSpot modal DOM is ready
// Called from afterRender in App.js instead of using a global MutationObserver
let lastAutocompleteStep = 0

export function initAddSpotAfterRender() {
  const depInput = document.getElementById('spot-departure-city')
  const dirInput = document.getElementById('spot-direction-city')

  if (depInput && !dirInput && lastAutocompleteStep !== 1) {
    lastAutocompleteStep = 1
    initStep1Autocomplete()
    // If share coords pending, auto-open fullscreen map picker
    if (window._pendingShareCoords) {
      requestAnimationFrame(() => window.openFullscreenMapPicker?.())
    }
  } else if (dirInput && lastAutocompleteStep !== 2) {
    lastAutocompleteStep = 2
    initStep2Autocomplete()
  } else if (!depInput && !dirInput && lastAutocompleteStep !== 0) {
    lastAutocompleteStep = 0
    cleanupAutocompletes()
    // Cleanup fullscreen map if modal closes
    closeFullscreenMapPicker()
  }
}

window.handleAddSpot = async (event) => {
  event.preventDefault()

  const { getState } = await import('../../stores/state.js')
  const state = getState()
  const spotType = state.addSpotType || 'custom'
  const description = document.getElementById('spot-description')?.value.trim()
  const submitBtn = document.getElementById('submit-spot-btn')

  // Build fields
  const from = window.spotFormData.departureCity || ''
  const to = window.spotFormData.directionCity || ''
  const direction = window.spotFormData.directionCity || ''

  // Validation — ALL fields mandatory EXCEPT photo (bonus points)
  const { showError } = await import('../../services/notifications.js')

  if (!window.spotFormData.lat || !window.spotFormData.lng) {
    showError(t('positionRequired') || 'Position obligatoire')
    return
  }
  if (!direction) {
    showError(t('directionRequired'))
    return
  }
  if (!window.spotFormData.departureCity) {
    showError(t('departureRequired') || 'Ville de départ obligatoire')
    return
  }
  if (!window.spotFormData.method) {
    showError(t('methodRequired'))
    return
  }
  if (!window.spotFormData.groupSize) {
    showError(t('groupSizeRequired'))
    return
  }
  if (!window.spotFormData.timeOfDay) {
    showError(t('timeOfDayRequired'))
    return
  }
  if (!window.spotFormData.rideResult) {
    showError(t('rideResultRequired'))
    return
  }
  // Description is optional — skip validation

  // Ratings validation — all 3 criteria required
  const ratingsCheck = window.spotFormData.ratings || {}
  if (!ratingsCheck.safety || !ratingsCheck.traffic || !ratingsCheck.accessibility) {
    showError(t('ratingsRequired') || 'Note les 3 critères (sécurité, trafic, accessibilité)')
    return
  }

  // Proximity check
  if (window.spotFormData.lat && window.spotFormData.lng) {
    const { checkProximity } = await import('../../services/proximityVerification.js')
    const proximity = checkProximity(
      window.spotFormData.lat,
      window.spotFormData.lng,
      state.userLocation
    )
    if (!proximity.allowed) {
      const { showError } = await import('../../services/notifications.js')
      showError(t('proximityRequired') || `Tu dois être passé à moins de 5 km de ce spot dans les dernières 24h (${proximity.distanceKm} km)`)
      return
    }
  }

  // Disable button
  if (submitBtn) {
    submitBtn.disabled = true
    submitBtn.innerHTML = `${icon('loader-circle', 'w-5 h-5 animate-spin')} ${t('submittingSpot') || 'Envoi...'}`
  }

  const ratings = window.spotFormData.ratings || { safety: 0, traffic: 0, accessibility: 0 }
  const ratingValues = [ratings.safety, ratings.traffic, ratings.accessibility].filter(v => v > 0)
  const globalRating = ratingValues.length > 0
    ? Math.round((ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length) * 10) / 10
    : 0

  try {
    const { uploadImage, addSpot } = await import('../../services/firebase.js')

    // Photos are optional — upload if provided (bonus points for at least 1)
    const photosToUpload = window.spotFormData.photos || []
    const hasPhoto = photosToUpload.length > 0
    const uploadedUrls = []
    for (let i = 0; i < photosToUpload.length; i++) {
      const photoPath = `spots/${Date.now()}_${i}.jpg`
      const photoResult = await uploadImage(photosToUpload[i], photoPath)
      if (photoResult.success) {
        uploadedUrls.push(photoResult.url)
      }
    }
    const photoUrl = uploadedUrls[0] || ''

    // Build destinations array (primary + extras)
    const destinations = [{
      city: to,
      coords: window.spotFormData.directionCityCoords || null,
      addedBy: null, // will be set by Firebase addSpot
      addedByName: null,
      addedAt: new Date().toISOString(),
      method: window.spotFormData.method || null,
      waitTime: window.spotFormData.waitTime || null,
    }]
    for (const extra of (window.spotFormData.extraDestinations || [])) {
      destinations.push({
        city: extra.city,
        coords: extra.coords || null,
        addedBy: null,
        addedByName: null,
        addedAt: new Date().toISOString(),
        method: null,
        waitTime: null,
      })
    }

    // Build complete spot data — ALL fields structured
    const spotData = {
      // Structured fields (unique data!)
      country: window.spotFormData.country || '',
      countryName: window.spotFormData.countryName || '',
      departureCity: window.spotFormData.departureCity || '',
      departureCityCoords: window.spotFormData.departureCityCoords || null,
      directionCity: window.spotFormData.directionCity || '',
      directionCityCoords: window.spotFormData.directionCityCoords || null,
      locationName: window.spotFormData.locationName || '',
      roadNumber: window.spotFormData.roadNumber || '',
      positionSource: window.spotFormData.positionSource || 'gps',

      // Experience data (ALL mandatory!)
      method: window.spotFormData.method,
      groupSize: window.spotFormData.groupSize,
      timeOfDay: window.spotFormData.timeOfDay,
      waitTime: window.spotFormData.waitTime || 10,
      rideResult: window.spotFormData.rideResult,
      season: detectSeason(),

      // Legacy fields (backward compat)
      from: from,
      to: to,
      direction: direction,

      // Standard fields
      description,
      photoUrl: photoUrl,
      photos: uploadedUrls,
      hasPhoto: hasPhoto,
      coordinates: {
        lat: window.spotFormData.lat,
        lng: window.spotFormData.lng,
      },
      ratings: {
        safety: ratings.safety || 0,
        traffic: ratings.traffic || 0,
        accessibility: ratings.accessibility || 0,
      },
      globalRating,
      avgWaitTime: window.spotFormData.waitTime || 30,
      spotType,
      fromCity: from,
      tags: {
        ...(window.spotFormData.tags || {}),
        signMethod: window.spotFormData.method || null,
      },
      stationName: window.spotFormData.stationName || '',
      dataSource: 'community',
      createdAt: new Date().toISOString(),
      destinations,
    }

    const result = await addSpot(spotData)

    if (result.success) {
      const { showSuccess } = await import('../../services/notifications.js')
      const { actions, setState: setStateFn } = await import('../../stores/state.js')

      showSuccess(hasPhoto
        ? (t('spotShared') || 'Spot partagé !') + ` 📸 +50 pts (${uploadedUrls.length} photo${uploadedUrls.length > 1 ? 's' : ''})`
        : (t('spotShared') || 'Spot partagé avec succès !'))
      actions.incrementSpotsCreated()
      // Bonus points for photo (50 pts if at least 1 photo)
      if (hasPhoto) {
        actions.addPoints?.(50)
      }
      setStateFn({
        showAddSpot: false,
        addSpotStep: 1,
        addSpotType: null,
        addSpotMethod: null,
        addSpotGroupSize: null,
        addSpotTimeOfDay: null,
        addSpotWaitTime: null,
        addSpotRideResult: null,
      })

      // Reset form data
      window.spotFormData = {
        photos: [], lat: null, lng: null,
        ratings: { safety: 0, traffic: 0, accessibility: 0 },
        tags: { shelter: false, waterFood: false, toilets: false, visibility: false, stoppingSpace: false },
        country: null, countryName: null,
        departureCity: null, departureCityCoords: null,
        directionCity: null, directionCityCoords: null,
        locationName: null, roadNumber: null, positionSource: null,
        method: null, groupSize: null, timeOfDay: null, waitTime: null, season: null,
        rideResult: null, stationName: '',
        extraDestinations: [],
      }

      // Show contextual tip for first spot created
      try {
        const { triggerSpotCreatedTip } = await import('../../services/contextualTips.js')
        triggerSpotCreatedTip()
      } catch { /* no-op */ }

      // Guide nudge: invite user to share tips for the country they just added a spot in
      try {
        const countryCode = spotData.country
        const countryName = spotData.countryName
        if (countryCode) {
          const nudgeSeen = localStorage.getItem('spothitch_guide_nudge_seen')
          // Get country flag emoji from country code
          const flagEmoji = countryCode
            .toUpperCase()
            .replace(/./g, ch => String.fromCodePoint(127397 + ch.charCodeAt(0)))
          setStateFn({
            pendingGuideCountry: { code: countryCode, name: countryName || countryCode, flag: flagEmoji },
            showGuideNudge: !nudgeSeen,
          })
        }
      } catch { /* no-op */ }
    } else {
      throw new Error('Failed to add spot')
    }
  } catch (error) {
    console.error('Add spot failed:', error)
    const { showError } = await import('../../services/notifications.js')
    showError(t('addSpotError') || "Erreur lors de l'ajout du spot")
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false
      submitBtn.innerHTML = `${icon('share', 'w-5 h-5')} ${t('shareThisSpot') || t('create')}`
    }
  }
}

// Character counter for description
document.addEventListener('input', (e) => {
  if (e.target.id === 'spot-description') {
    const count = document.getElementById('desc-count')
    if (count) count.textContent = e.target.value.length
  }
})

export default { renderAddSpot }
