/**
 * ValidateSpot Modal Component
 * "I tested this spot" — adds a validation/experience to an existing spot
 *
 * Collects structured data: wait time, method, group size, time of day,
 * direction, ratings, optional photo, optional comment.
 * All data is stored as a validation record linked to the spot.
 */

import { t } from '../../i18n/index.js'
import { icon } from '../../utils/icons.js'
import { escapeHTML } from '../../utils/sanitize.js'

// Wait time slider steps (minutes)
const WAIT_STEPS = [1, 2, 3, 5, 10, 15, 20, 25, 30, 45, 60, 90, 120, 180]

// Validation form state
window.validateFormData = window.validateFormData || {
  waitTime: null,
  method: null,
  groupSize: null,
  timeOfDay: null,
  directionCity: null,
  directionCityCoords: null,
  extraDestinations: [],
  ratings: { safety: 0, traffic: 0, accessibility: 0 },
  tags: { shelter: false, waterFood: false, toilets: false, visibility: false, stoppingSpace: false },
  photos: [],
  comment: '',
  rideResult: null,
}

function detectSeason() {
  const month = new Date().getMonth()
  if (month >= 2 && month <= 4) return 'spring'
  if (month >= 5 && month <= 7) return 'summer'
  if (month >= 8 && month <= 10) return 'autumn'
  return 'winter'
}

/**
 * Render star input for validation ratings
 */
function renderValStarInput(criterion, label) {
  return `
    <div class="mb-2">
      <label class="text-sm text-slate-400 block mb-1">${label}</label>
      <div class="flex items-center gap-1" role="radiogroup" aria-label="${label}">
        ${[1, 2, 3, 4, 5].map(star => `
          <button
            type="button"
            onclick="setValidationRating('${criterion}', ${star})"
            class="val-star-btn text-xl text-slate-400 hover:text-yellow-400 transition-colors"
            data-val-criterion="${criterion}"
            data-val-star="${star}"
            aria-label="${star}/5"
          >
            ${icon('star', 'w-4 h-4')}
          </button>
        `).join('')}
        <span class="ml-2 text-sm text-white font-medium" id="val-rating-${criterion}">-</span>
      </div>
    </div>
  `
}

export function renderValidateSpot(state) {
  const spotId = state.validateSpotId
  const spot = (state.spots || []).find(s => s.id === spotId) || state.selectedSpot
  const spotName = spot ? (spot.from || spot.direction || `Spot #${spot.id}`) : ''

  const vf = window.validateFormData
  const waitIdx = vf.waitTime != null ? WAIT_STEPS.indexOf(vf.waitTime) : 4
  const currentWait = WAIT_STEPS[waitIdx >= 0 ? waitIdx : 4]

  return `
    <div
      class="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onclick="closeValidateSpot()"
      role="dialog"
      aria-modal="true"
      aria-labelledby="validate-modal-title"
     tabindex="0">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true"></div>

      <div class="relative modal-panel sm:rounded-3xl w-full max-w-lg max-h-[90vh] overflow-hidden slide-up"
        onclick="event.stopPropagation()">

        <!-- Header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h2 id="validate-modal-title" class="text-xl font-bold">
            ${icon('circle-check', 'w-5 h-5 text-emerald-400 mr-2')}
            ${t('validateSpotTitle') || 'Valider ce spot'}
          </h2>
          <button onclick="closeValidateSpot()" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
            aria-label="${t('close') || 'Fermer'}" type="button">
            ${icon('x', 'w-5 h-5')}
          </button>
        </div>

        <div class="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          <!-- Spot name -->
          ${spotName ? `<p class="text-sm text-slate-400 mb-4">${spotName}</p>` : ''}

          <form id="validate-spot-form" onsubmit="submitValidation(event)" class="space-y-4">

            <!-- Wait Time Slider -->
            <div>
              <label class="text-sm text-slate-400 block mb-2">
                ${icon('clock', 'w-4 h-4 mr-1')} ${t('waitTimeLabel') || "Temps d'attente"} <span class="text-red-400">*</span>
              </label>
              <input type="range" min="0" max="${WAIT_STEPS.length - 1}"
                value="${waitIdx >= 0 ? waitIdx : 4}"
                class="wait-slider w-full"
                oninput="setValidationWaitTime(this.value)"
              />
              <div class="wait-slider-labels">
                <span>1 min</span><span>15</span><span>45</span><span>2h</span><span>3h+</span>
              </div>
              <div class="text-center text-lg font-bold text-primary-400 mt-1" id="val-wait-display">
                ${currentWait >= 180 ? '3h+' : currentWait + ' min'}
              </div>
            </div>

            <!-- Got a ride? -->
            <div>
              <label class="text-sm text-slate-400 block mb-2">${t('gotARide') || 'Tu as eu un lift ?'} <span class="text-red-400">*</span></label>
              <div class="radio-group">
                <button type="button" onclick="setValidationRideResult('yes')"
                  class="radio-btn ${vf.rideResult === 'yes' ? 'active' : ''}">
                  ✅ ${t('yes') || 'Oui'}
                </button>
                <button type="button" onclick="setValidationRideResult('no')"
                  class="radio-btn ${vf.rideResult === 'no' ? 'active' : ''}">
                  ❌ ${t('no') || 'Non'}
                </button>
                <button type="button" onclick="setValidationRideResult('gaveUp')"
                  class="radio-btn ${vf.rideResult === 'gaveUp' ? 'active' : ''}">
                  🏳️ ${t('gaveUp') || "Abandonné"}
                </button>
              </div>
            </div>

            <!-- Method -->
            <div>
              <label class="text-sm text-slate-400 block mb-2">
                ${icon('hand', 'w-4 h-4 mr-1')} ${t('practicalTips') || 'Méthode'} <span class="text-red-400">*</span>
              </label>
              <div class="radio-group">
                <button type="button" onclick="setValidationMethod('sign')"
                  class="radio-btn ${vf.method === 'sign' ? 'active' : ''}">
                  ${icon('file-text', 'w-4 h-4 mr-1')} ${t('methodSign')}
                </button>
                <button type="button" onclick="setValidationMethod('thumb')"
                  class="radio-btn ${vf.method === 'thumb' ? 'active' : ''}">
                  ${icon('hand', 'w-4 h-4 mr-1')} ${t('methodThumb')}
                </button>
                <button type="button" onclick="setValidationMethod('asking')"
                  class="radio-btn ${vf.method === 'asking' ? 'active' : ''}">
                  ${icon('message-circle', 'w-4 h-4 mr-1')} ${t('methodAsking')}
                </button>
              </div>
            </div>

            <!-- Group Size -->
            <div>
              <label class="text-sm text-slate-400 block mb-2">
                ${icon('users', 'w-4 h-4 mr-1')} ${t('groupSizeLabel')} <span class="text-red-400">*</span>
              </label>
              <div class="radio-group">
                <button type="button" onclick="setValidationGroupSize('solo')"
                  class="radio-btn ${vf.groupSize === 'solo' ? 'active' : ''}">${t('groupSolo')}</button>
                <button type="button" onclick="setValidationGroupSize('duo')"
                  class="radio-btn ${vf.groupSize === 'duo' ? 'active' : ''}">${t('groupDuo')}</button>
                <button type="button" onclick="setValidationGroupSize('group')"
                  class="radio-btn ${vf.groupSize === 'group' ? 'active' : ''}">${t('groupTrioPlus')}</button>
              </div>
            </div>

            <!-- Time of Day -->
            <div>
              <label class="text-sm text-slate-400 block mb-2">
                ${icon('sun', 'w-4 h-4 mr-1')} ${t('timeOfDayLabel')} <span class="text-red-400">*</span>
              </label>
              <div class="radio-group">
                <button type="button" onclick="setValidationTimeOfDay('morning')"
                  class="radio-btn ${vf.timeOfDay === 'morning' ? 'active' : ''}">🌅 ${t('timeMorning')}</button>
                <button type="button" onclick="setValidationTimeOfDay('afternoon')"
                  class="radio-btn ${vf.timeOfDay === 'afternoon' ? 'active' : ''}">☀️ ${t('timeAfternoon')}</button>
                <button type="button" onclick="setValidationTimeOfDay('evening')"
                  class="radio-btn ${vf.timeOfDay === 'evening' ? 'active' : ''}">🌆 ${t('timeEvening')}</button>
                <button type="button" onclick="setValidationTimeOfDay('night')"
                  class="radio-btn ${vf.timeOfDay === 'night' ? 'active' : ''}">🌙 ${t('timeNight')}</button>
              </div>
            </div>

            <!-- Direction (mandatory — can differ from spot's original direction) -->
            <div class="relative">
              <label for="val-direction-city" class="text-sm text-slate-400 block mb-2">
                ${icon('compass', 'w-4 h-4 mr-1')} ${t('yourDirection') || 'Ta direction'} <span class="text-red-400">*</span>
              </label>
              <input type="text" id="val-direction-city" class="input-modern"
                placeholder="${t('destinationCity') || 'Direction'}" required aria-required="true" />
            </div>

            <!-- Extra destinations -->
            <div>
              ${(vf.extraDestinations || []).map((d, i) => `
                <div class="flex items-center gap-2 mb-2">
                  <span class="flex-1 text-sm text-amber-400 border-b border-amber-400 px-2 py-1">
                    ${icon('map-pin', 'w-3.5 h-3.5 inline mr-1')} ${escapeHTML(d.city)}
                  </span>
                  <button type="button" onclick="removeValDestination(${i})"
                    class="w-7 h-7 rounded-full bg-red-500/10 flex items-center justify-center text-red-400"
                    aria-label="${t('removeDestination') || 'Supprimer'}">
                    ${icon('x', 'w-4 h-4')}
                  </button>
                </div>
              `).join('')}
              ${(vf.extraDestinations || []).length < 4 ? `
                <div class="relative" id="val-extra-dest-wrapper" style="display:none">
                  <input type="text" id="val-extra-dest" class="input-modern text-sm"
                    placeholder="${t('destinationCityPlaceholder') || 'Ville de destination'}" />
                </div>
                <button type="button" onclick="addValDestination()"
                  class="w-full text-xs text-slate-500 py-2 flex items-center justify-center gap-1"
                  id="val-add-dest-btn">
                  ${icon('plus', 'w-3.5 h-3.5')} ${t('addDestination') || 'Ajouter une destination'}
                </button>
              ` : `
                <div class="text-xs text-slate-500 text-center">${t('maxDestinations') || 'Maximum 5 destinations'}</div>
              `}
            </div>

            <!-- Amenities -->
            <div>
              <label class="text-sm text-slate-400 block mb-2">
                ${icon('map-pin', 'w-4 h-4 mr-1 text-emerald-400')}
                ${t('amenitiesLabel') || 'Équipements à proximité'}
              </label>
              <div class="flex flex-wrap gap-2">
                <button type="button" onclick="toggleValAmenity('shelter')"
                  class="amenity-chip ${vf.tags?.shelter ? 'active' : ''}">
                  ${icon('umbrella', 'w-4 h-4 mr-1')} ${t('amenityShelter') || 'Abri'}
                </button>
                <button type="button" onclick="toggleValAmenity('waterFood')"
                  class="amenity-chip ${vf.tags?.waterFood ? 'active' : ''}">
                  ${icon('droplets', 'w-4 h-4 mr-1')} ${t('amenityWaterFood') || 'Eau/nourriture'}
                </button>
                <button type="button" onclick="toggleValAmenity('toilets')"
                  class="amenity-chip ${vf.tags?.toilets ? 'active' : ''}">
                  🚻 ${t('amenityToilets') || 'Toilettes'}
                </button>
                <button type="button" onclick="toggleValAmenity('visibility')"
                  class="amenity-chip ${vf.tags?.visibility ? 'active' : ''}">
                  ${icon('eye', 'w-4 h-4 mr-1')} ${t('goodVisibilityTag') || 'Visible'}
                </button>
                <button type="button" onclick="toggleValAmenity('stoppingSpace')"
                  class="amenity-chip ${vf.tags?.stoppingSpace ? 'active' : ''}">
                  ${icon('square-parking', 'w-4 h-4 mr-1')} ${t('stoppingSpaceTag') || 'Place'}
                </button>
              </div>
            </div>

            <!-- Ratings -->
            <div class="border-t border-white/10 pt-3">
              <label class="text-sm text-slate-400 block mb-2">${t('ratings') || 'Notes'} <span class="text-red-400">*</span></label>
              ${renderValStarInput('safety', t('safetyRating'))}
              ${renderValStarInput('traffic', t('traffic'))}
              ${renderValStarInput('accessibility', t('accessibility'))}
            </div>

            <!-- Comment -->
            <div>
              <label for="val-comment" class="text-sm text-slate-400 block mb-2">
                ${icon('message-circle', 'w-4 h-4 mr-1')} ${t('addComment') || 'Commentaire'}
              </label>
              <textarea id="val-comment" class="input-modern min-h-[80px] resize-none"
                placeholder="${t('commentPlaceholder') || 'Conseils, avertissements...'}"
                maxlength="500"></textarea>
            </div>

            <!-- Photo (optional, +50 pts bonus — up to 3) -->
            <div>
              <label class="text-sm text-slate-400 block mb-2">
                ${icon('camera', 'w-4 h-4 mr-1')} ${t('photoBonus')}
                <span class="text-xs text-slate-500 ml-1">(${t('maxPhotos')})</span>
              </label>
              <input type="file" id="val-photo" accept="image/*" capture="environment"
                class="hidden" onchange="handleValidationPhoto(event)" />
              ${(vf.photos?.length || 0) < 5 ? `
              <button type="button" onclick="document.getElementById('val-photo')?.click()"
                class="btn btn-ghost btn-sm w-full">
                ${icon('camera', 'w-4 h-4')} ${t('takePhoto')}
              </button>
              ` : ''}
              <div id="val-photo-preview" class="flex gap-2 mt-2 flex-wrap">
                ${(vf.photos || []).map((p, i) => `
                  <div class="relative w-20 h-20 rounded-lg overflow-hidden border border-white/10">
                    <img src="${p}" alt="Photo ${i + 1}" class="w-full h-full object-cover" />
                    <button type="button" onclick="removeValPhoto(${i})"
                      class="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 flex items-center justify-center text-red-400 hover:text-red-300"
                      aria-label="${t('close') || 'Supprimer'}">
                      ${icon('x', 'w-3 h-3')}
                    </button>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Submit -->
            <button type="button" onclick="showValidationSummary()" class="btn btn-primary w-full text-lg" id="val-submit-btn">
              ${icon('circle-check', 'w-5 h-5')} ${t('reviewAndSubmit') || 'Vérifier et envoyer'}
            </button>
          </form>
        </div>
      </div>
    </div>
  `
}

// --- Validation handlers ---

window.openValidateSpot = async (spotId) => {
  const { setState } = await import('../../stores/state.js')
  window.validateFormData = {
    waitTime: 10, method: null, groupSize: null, timeOfDay: null,
    directionCity: null, directionCityCoords: null, extraDestinations: [],
    ratings: { safety: 0, traffic: 0, accessibility: 0 },
    tags: { shelter: false, waterFood: false, toilets: false, visibility: false, stoppingSpace: false },
    photos: [], comment: '', rideResult: null,
  }
  setState({ showValidateSpot: true, validateSpotId: spotId, validateSpotMode: 'validate' })
}

// openTestSpot — opens the same form but marks it as a "test" (full hitchhiking experience)
window.openTestSpot = async (spotId) => {
  const { setState } = await import('../../stores/state.js')
  window.validateFormData = {
    waitTime: 10, method: null, groupSize: null, timeOfDay: null,
    directionCity: null, directionCityCoords: null, extraDestinations: [],
    ratings: { safety: 0, traffic: 0, accessibility: 0 },
    tags: { shelter: false, waterFood: false, toilets: false, visibility: false, stoppingSpace: false },
    photos: [], comment: '', rideResult: null,
  }
  setState({ showValidateSpot: true, validateSpotId: spotId, validateSpotMode: 'test' })
}

window.closeValidateSpot = async () => {
  const { setState } = await import('../../stores/state.js')
  setState({ showValidateSpot: false, validateSpotId: null })
}

window.setValidationWaitTime = (sliderIndex) => {
  const idx = parseInt(sliderIndex, 10)
  const minutes = WAIT_STEPS[idx] || 10
  window.validateFormData.waitTime = minutes
  const display = document.getElementById('val-wait-display')
  if (display) display.textContent = minutes >= 180 ? '3h+' : minutes + ' min'
}

window.setValidationRideResult = (result) => {
  window.validateFormData.rideResult = result
  import('../../stores/state.js').then(({ setState }) => setState({ _valRefresh: Date.now() }))
}

window.setValidationMethod = (method) => {
  window.validateFormData.method = method
  import('../../stores/state.js').then(({ setState }) => setState({ _valRefresh: Date.now() }))
}

window.setValidationGroupSize = (size) => {
  window.validateFormData.groupSize = size
  import('../../stores/state.js').then(({ setState }) => setState({ _valRefresh: Date.now() }))
}

window.setValidationTimeOfDay = (time) => {
  window.validateFormData.timeOfDay = time
  import('../../stores/state.js').then(({ setState }) => setState({ _valRefresh: Date.now() }))
}

window.setValidationRating = (criterion, value) => {
  window.validateFormData.ratings[criterion] = value

  const buttons = document.querySelectorAll(`button[data-val-criterion="${criterion}"]`)
  buttons.forEach((btn) => {
    const star = parseInt(btn.dataset.valStar, 10)
    const svg = btn.querySelector('svg')
    if (svg) svg.setAttribute('fill', star <= value ? 'currentColor' : 'none')
    if (star <= value) {
      btn.className = 'val-star-btn text-xl text-yellow-400 hover:text-yellow-300 transition-colors'
    } else {
      btn.className = 'val-star-btn text-xl text-slate-400 hover:text-yellow-400 transition-colors'
    }
  })
  const el = document.getElementById(`val-rating-${criterion}`)
  if (el) el.textContent = `${value}/5`
}

window.toggleValAmenity = (name) => {
  window.validateFormData.tags = window.validateFormData.tags || {}
  window.validateFormData.tags[name] = !window.validateFormData.tags[name]
  const chip = document.querySelector(`[onclick*="toggleValAmenity('${name}')"]`)
  if (chip) chip.classList.toggle('active', window.validateFormData.tags[name])
}

// Multi-destination handlers for validation form
window.addValDestination = async () => {
  if (!window.validateFormData.extraDestinations) window.validateFormData.extraDestinations = []
  if (window.validateFormData.extraDestinations.length >= 4) {
    const { showError } = await import('../../services/notifications.js')
    showError(t('maxDestinations'))
    return
  }
  const wrapper = document.getElementById('val-extra-dest-wrapper')
  const btn = document.getElementById('val-add-dest-btn')
  if (wrapper && btn) {
    wrapper.style.display = 'block'
    btn.style.display = 'none'
    const input = document.getElementById('val-extra-dest')
    if (input) {
      input.focus()
      const { initAutocomplete } = await import('../../utils/autocomplete.js')
      const { searchPhoton } = await import('../../services/osrm.js')
      initAutocomplete({
        inputId: 'val-extra-dest',
        searchFn: (q) => searchPhoton(q, {}),
        debounceMs: 100,
        forceSelection: true,
        onSelect: async (item) => {
          const city = item.name
          const mainDest = window.validateFormData.directionCity || ''
          const extras = window.validateFormData.extraDestinations || []
          const allCities = [mainDest, ...extras.map(d => d.city)].map(c => c.toLowerCase())
          if (allCities.includes(city.toLowerCase())) {
            const { showError } = await import('../../services/notifications.js')
            showError(t('destinationAlreadyExists'))
            return
          }
          window.validateFormData.extraDestinations.push({ city, coords: { lat: item.lat, lng: item.lng } })
          const { setState } = await import('../../stores/state.js')
          setState({ _valRefresh: Date.now() })
        },
        onClear: () => {},
      })
    }
  }
}

window.removeValDestination = async (index) => {
  if (!window.validateFormData.extraDestinations) return
  window.validateFormData.extraDestinations.splice(index, 1)
  const { setState } = await import('../../stores/state.js')
  setState({ _valRefresh: Date.now() })
}

window.handleValidationPhoto = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  if (!window.validateFormData.photos) window.validateFormData.photos = []
  if (window.validateFormData.photos.length >= 5) {
    const { showError } = await import('../../services/notifications.js')
    showError(t('maxPhotos'))
    return
  }

  try {
    const { compressImage } = await import('../../utils/image.js')
    const compressed = await compressImage(file, 1200, 0.75)
    window.validateFormData.photos.push(compressed)
    // Re-render to update thumbnails
    import('../../stores/state.js').then(({ setState }) => setState({ _valRefresh: Date.now() }))
  } catch { /* no-op */ }
}

window.removeValPhoto = async (index) => {
  if (!window.validateFormData.photos) return
  window.validateFormData.photos.splice(index, 1)
  import('../../stores/state.js').then(({ setState }) => setState({ _valRefresh: Date.now() }))
}

// Show summary before submitting validation
window.showValidationSummary = async () => {
  const vf = window.validateFormData
  const directionCity = document.getElementById('val-direction-city')?.value?.trim() || vf.directionCity || ''
  const comment = document.getElementById('val-comment')?.value?.trim() || ''

  // Quick validation
  const { showError } = await import('../../services/notifications.js')
  if (!directionCity) { showError(t('destinationRequired') || 'Direction obligatoire'); return }
  if (!vf.method) { showError(t('methodRequired')); return }
  if (!vf.groupSize) { showError(t('groupSizeRequired')); return }
  if (!vf.timeOfDay) { showError(t('timeOfDayRequired')); return }
  if (!vf.rideResult) { showError(t('rideResultRequired')); return }
  if (!vf.ratings.safety || !vf.ratings.traffic || !vf.ratings.accessibility) {
    showError(t('ratingsRequired') || 'Note les 3 critères'); return
  }

  const methodLabels = { sign: t('methodSign') || 'Panneau', thumb: t('methodThumb') || 'Pouce', asking: t('methodAsking') || 'En demandant' }
  const groupLabels = { solo: 'Solo', duo: 'Duo', group: t('groupTrioPlus') || 'Groupe 3+' }
  const timeLabels = { morning: t('timeMorning') || 'Matin', afternoon: t('timeAfternoon') || 'Après-midi', evening: t('timeEvening') || 'Soir', night: t('timeNight') || 'Nuit' }
  const rideLabels = { yes: '✅ ' + (t('yes') || 'Oui'), no: '❌ ' + (t('no') || 'Non'), gaveUp: '🏳️ ' + (t('gaveUp') || 'Abandonné') }

  const allDests = [directionCity, ...(vf.extraDestinations || []).map(d => d.city)].filter(Boolean)
  const r = vf.ratings
  const photoCount = (vf.photos || []).length

  const row = (label, value) => value ? `
    <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #1e293b">
      <span style="font-size:12px;color:#64748b">${escapeHTML(label)}</span>
      <span style="font-size:12px;color:#e2e8f0;text-align:right;max-width:60%">${escapeHTML(String(value))}</span>
    </div>` : ''

  const overlay = document.createElement('div')
  overlay.id = 'val-summary-overlay'
  overlay.style.cssText = 'position:fixed;inset:0;z-index:60;display:flex;align-items:center;justify-content:center;padding:16px'
  overlay.innerHTML = `
    <div style="position:absolute;inset:0;background:rgba(0,0,0,0.7);backdrop-filter:blur(4px)" onclick="closeValSummary()"></div>
    <div style="position:relative;background:#0f1520;border:1px solid #1e293b;border-radius:12px;max-width:400px;width:100%;max-height:80vh;overflow-y:auto;padding:20px" onclick="event.stopPropagation()">
      <h3 style="font-size:18px;font-weight:600;color:#e2e8f0;margin-bottom:16px;text-align:center">${t('summaryTitle') || 'Récapitulatif'}</h3>

      ${row(t('destinationCity') || 'Direction', allDests.join(', '))}
      ${row(t('waitTimeLabel') || 'Attente', vf.waitTime ? (vf.waitTime >= 180 ? '3h+' : vf.waitTime + ' min') : '')}
      ${row(t('practicalTips') || 'Méthode', methodLabels[vf.method] || '')}
      ${row(t('groupSizeLabel') || 'Groupe', groupLabels[vf.groupSize] || '')}
      ${row(t('timeOfDayLabel') || 'Moment', timeLabels[vf.timeOfDay] || '')}
      ${row(t('gotARide') || 'Lift obtenu', rideLabels[vf.rideResult] || '')}
      ${row(t('safety') || 'Sécurité', r.safety + '/5')}
      ${row(t('traffic') || 'Trafic', r.traffic + '/5')}
      ${row(t('accessibility') || 'Accessibilité', r.accessibility + '/5')}
      ${comment ? row(t('addComment') || 'Commentaire', comment.length > 80 ? comment.slice(0, 80) + '...' : comment) : ''}
      ${row(t('photoLabel') || 'Photos', photoCount > 0 ? photoCount + ' photo' + (photoCount > 1 ? 's' : '') : (t('optional') || 'Aucune'))}

      <div style="display:flex;gap:10px;margin-top:16px">
        <button type="button" onclick="closeValSummary()"
          style="flex:1;background:transparent;border:1px solid #334155;color:#64748b;padding:12px;font-size:13px;cursor:pointer;border-radius:8px">
          ${t('modify') || 'Modifier'}
        </button>
        <button type="button" onclick="closeValSummary();submitValidation()"
          style="flex:2;background:#f59e0b;border:none;color:#0f1520;padding:12px;font-size:14px;font-weight:600;cursor:pointer;border-radius:8px">
          ${t('confirmSubmit') || 'Confirmer et envoyer'}
        </button>
      </div>
    </div>
  `
  document.body.appendChild(overlay)
}

window.closeValSummary = () => {
  document.getElementById('val-summary-overlay')?.remove()
}

window.submitValidation = async (event) => {
  if (event) event.preventDefault()

  const { getState, setState } = await import('../../stores/state.js')
  const state = getState()
  const spotId = state.validateSpotId
  const vf = window.validateFormData
  const comment = document.getElementById('val-comment')?.value?.trim() || ''
  const directionCity = document.getElementById('val-direction-city')?.value?.trim() || vf.directionCity || ''
  const submitBtn = document.getElementById('val-submit-btn')

  if (submitBtn) {
    submitBtn.disabled = true
    submitBtn.innerHTML = `${icon('loader-circle', 'w-5 h-5 animate-spin')} ${t('sending') || 'Envoi...'}`
  }

  // Validate all mandatory fields
  const validationErrors = []
  if (!directionCity) validationErrors.push(t('destinationRequired') || 'Direction obligatoire')
  if (!vf.method) validationErrors.push(t('methodRequired') || 'Choisis ta methode')
  if (!vf.groupSize) validationErrors.push(t('groupSizeRequired') || 'Indique ta taille de groupe')
  if (!vf.timeOfDay) validationErrors.push(t('timeOfDayRequired') || 'Indique le moment de la journee')
  if (!vf.rideResult) validationErrors.push(t('rideResultRequired') || 'Indique si tu as eu un lift')
  if (!vf.ratings.safety || !vf.ratings.traffic || !vf.ratings.accessibility) {
    validationErrors.push(t('ratingsRequired') || 'Note les 3 criteres')
  }

  if (validationErrors.length > 0) {
    const { showError } = await import('../../services/notifications.js')
    showError(validationErrors[0])
    if (submitBtn) {
      submitBtn.disabled = false
      submitBtn.innerHTML = `${icon('circle-check', 'w-5 h-5')} ${t('submitValidation')}`
    }
    return
  }

  try {
    // Determine mode: 'test' = full hitchhiking experience, 'validate' = confirm spot exists
    const mode = state.validateSpotMode || 'test'

    // Build destinations array (primary + extras)
    const destinations = [{ city: directionCity, coords: vf.directionCityCoords || null }]
    for (const extra of (vf.extraDestinations || [])) {
      destinations.push({ city: extra.city, coords: extra.coords || null })
    }

    // Build validation data — ALL structured
    const validationData = {
      spotId,
      type: mode, // 'test' or 'validate'
      waitTime: vf.waitTime,
      method: vf.method,
      groupSize: vf.groupSize,
      timeOfDay: vf.timeOfDay,
      rideResult: vf.rideResult,
      directionCity: directionCity,
      destinations,
      ratings: vf.ratings,
      tags: vf.tags || {},
      comment: comment,
      season: detectSeason(),
      timestamp: new Date().toISOString(),
      dataSource: 'community',
    }

    // Upload photos if provided (up to 3)
    const photosToUpload = vf.photos || []
    if (photosToUpload.length > 0) {
      try {
        const { uploadImage } = await import('../../services/firebase.js')
        const uploadedUrls = []
        for (let i = 0; i < photosToUpload.length; i++) {
          const photoPath = `validations/${Date.now()}_${i}.jpg`
          const photoResult = await uploadImage(photosToUpload[i], photoPath)
          if (photoResult.success) {
            uploadedUrls.push(photoResult.url)
          }
        }
        if (uploadedUrls.length > 0) {
          validationData.photoUrl = uploadedUrls[0]
          validationData.photos = uploadedUrls
        }
      } catch { /* no-op — validation still valid without photo */ }
    }

    // Save to Firebase
    const { addValidation } = await import('../../services/firebase.js')
    if (typeof addValidation === 'function') {
      await addValidation(validationData)
    }

    // Also add to local checkin history
    const { actions } = await import('../../stores/state.js')
    actions.addCheckinToHistory({
      spotId,
      type: mode,
      ...validationData,
    })
    actions.incrementCheckins()

    // Bonus 50 pts if at least 1 photo provided
    const hasValPhotos = (vf.photos || []).length > 0
    if (hasValPhotos) {
      actions.addPoints?.(50)
    }

    const { showSuccess } = await import('../../services/notifications.js')
    const photoMsg = hasValPhotos ? ' 📸 +50 pts' : ''
    showSuccess(mode === 'test'
      ? (t('testSubmitted') || 'Test envoyé ! Merci') + photoMsg
      : (t('validationSubmitted') || 'Validation envoyée ! Merci') + photoMsg)
    setState({ showValidateSpot: false, validateSpotId: null, validateSpotMode: null })

    // Refresh live data so SpotDetail shows updated stats immediately
    try {
      const { invalidateSpotCache, enrichSpotWithLiveData } = await import('../../services/spotLiveData.js')
      invalidateSpotCache(spotId)
      const currentSpot = getState().selectedSpot
      if (currentSpot && String(currentSpot.id) === String(spotId)) {
        const enriched = await enrichSpotWithLiveData({ ...currentSpot, _liveLoaded: false })
        setState({ selectedSpot: enriched })
      }
    } catch { /* non-blocking */ }

  } catch (error) {
    console.error('Validation failed:', error)
    const { showError } = await import('../../services/notifications.js')
    showError(t('validationError') || 'Erreur lors de la validation')
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false
      submitBtn.innerHTML = `${icon('circle-check', 'w-5 h-5')} ${t('submitValidation')}`
    }
  }
}

// Init autocomplete for direction field in validation modal
// Called from afterRender in App.js instead of using a global MutationObserver
export function initValidateSpotAfterRender() {
  const dirInput = document.getElementById('val-direction-city')
  if (dirInput && !dirInput._acInit) {
    dirInput._acInit = true
    if (navigator.onLine) {
      import('../../utils/autocomplete.js').then(({ initAutocomplete }) => {
        import('../../services/osrm.js').then(({ searchCities }) => {
          initAutocomplete({
            inputId: 'val-direction-city',
            searchFn: (q) => searchCities(q, {}),
            onSelect: (item) => {
              window.validateFormData.directionCity = item.name
              window.validateFormData.directionCityCoords = { lat: item.lat, lng: item.lng }
            },
          })
        })
      })
    }
  }
}

export default { renderValidateSpot }
