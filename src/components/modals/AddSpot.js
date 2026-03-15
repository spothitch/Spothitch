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
 * Render segmented bar rating for a criterion (v3 design)
 */
function renderBarRating(criterion, label) {
  const currentValue = window.spotFormData?.ratings?.[criterion] || 0
  return `
    <div style="margin-bottom:24px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
        <span style="font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:1px">${label} <span style="color:#f59e0b">*</span></span>
        <span style="font-size:12px;color:#f59e0b" id="spot-rating-value-${criterion}">${currentValue ? currentValue + '/5' : ''}</span>
      </div>
      <div style="display:flex;gap:4px" role="radiogroup" aria-label="${label}">
        ${[1, 2, 3, 4, 5].map(val => `
          <button
            type="button"
            onclick="setSpotRating('${criterion}', ${val})"
            class="spot-star-btn"
            data-criterion="${criterion}"
            data-star="${val}"
            aria-label="${val}/5"
            style="flex:1;height:4px;border-radius:2px;background:${val <= currentValue ? '#f59e0b' : '#1a1f2e'};border:none;cursor:pointer;padding:0"
          ></button>
        `).join('')}
      </div>
      <p style="font-size:11px;color:#64748b;margin-top:4px;min-height:1.25rem" id="spot-rating-desc-${criterion}" aria-live="polite"></p>
    </div>
  `
}

/**
 * Render v3 amber stepper (3 circles connected by lines)
 */
function renderStepProgress(currentStep) {
  const stepTitles = [
    t('stepWhereIsSpot') || 'Où est le spot ?',
    t('stepExperience') || 'Ton expérience',
    t('stepDetails') || 'Derniers détails',
  ]
  return `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px">
      ${[1, 2, 3].map((step, i) => {
        const isActive = step === currentStep
        const isDone = step < currentStep
        const circleStyle = isActive
          ? 'background:#f59e0b;color:#0f1520;font-weight:700'
          : isDone
            ? 'background:rgba(245,158,11,0.27);color:#f59e0b'
            : 'background:#1a1f2e;color:#475569'
        const lineStyle = isDone
          ? 'background:#f59e0b'
          : step === currentStep
            ? 'background:linear-gradient(90deg,#f59e0b,#334155)'
            : 'background:#1a1f2e'
        return `
          ${i > 0 ? `<div style="flex:1;height:1px;${lineStyle}"></div>` : ''}
          <div style="width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;${circleStyle};flex-shrink:0" title="${stepTitles[i]}">${step}</div>
        `
      }).join('')}
    </div>
    <div style="font-size:22px;font-weight:300;color:#e2e8f0;margin-bottom:28px">${stepTitles[currentStep - 1]}</div>
  `
}

/**
 * Render Step 1: Type + City + Position + Photo (v3 underline design)
 */
function renderStep1(state) {
  const spotType = state.addSpotType || ''
  return `
    <div class="step-transition">
      <!-- Spot Type — 3x2 grid -->
      <div style="margin-bottom:24px">
        <div style="font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px">${t('spotTypeLabel')} <span style="color:#f59e0b">*</span></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          ${['gas_station', 'toll', 'roundabout', 'on_ramp', 'roadside', 'custom'].map(type => `
          <button type="button" onclick="selectSpotType('${type}')"
            class="spot-type-btn ${spotType === type ? 'active' : ''}"
            style="padding:14px 12px;text-align:center;font-size:13px;border-radius:8px;border:1px solid ${spotType === type ? '#f59e0b' : '#1a1f2e'};background:${spotType === type ? 'rgba(245,158,11,0.07)' : '#1a1f2e'};color:${spotType === type ? '#f59e0b' : '#64748b'};cursor:pointer">
            ${t('spotType' + type.split('_').map(w => w[0].toUpperCase() + w.slice(1)).join(''))}
          </button>`).join('')}
        </div>
        <button type="button" onclick="autoDetectRoad()" style="width:100%;margin-top:8px;padding:8px 0;background:transparent;border:none;border-bottom:1px solid rgba(255,255,255,0.1);font-size:11px;color:#475569;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px">
          ${icon('crosshair', 'w-3 h-3')} ${t('autoDetectType') || 'Auto-detecter le type'}
        </button>
      </div>

      <!-- Station Name (gas_station only) -->
      ${spotType === 'gas_station' ? `
        <div style="margin-bottom:24px">
          <div style="font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">${t('stationNameLabel')} <span style="color:#f59e0b">*</span></div>
          <input
            type="text"
            id="spot-station-name"
            name="stationName"
            style="width:100%;background:transparent;border:none;border-bottom:1px solid #334155;padding:8px 0;color:#e2e8f0;font-size:16px;outline:none"
            placeholder="${t('stationNamePlaceholder')}"
            maxlength="100"
            value="${window.spotFormData?.stationName || ''}"
            oninput="window.spotFormData.stationName = this.value"
          />
        </div>
      ` : ''}

      <!-- Departure City — underline input -->
      <div style="margin-bottom:24px" class="relative">
        <div style="font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">${t('departureCity') || 'Ville'} <span style="color:#f59e0b">*</span></div>
        <input
          type="text"
          id="spot-departure-city"
          name="departureCity"
          style="width:100%;background:transparent;border:none;border-bottom:1px solid #334155;padding:8px 0;color:#e2e8f0;font-size:16px;outline:none"
          placeholder="${t('departureCity') || 'Ville de départ'}"
          value="${escapeHTML(window.spotFormData?.departureCity || '')}"
          required
          aria-required="true"
        />
      </div>

      <!-- GPS Position — map placeholder -->
      ${renderPositionBlock()}

      <!-- Position summary (if set) -->
      ${window.spotFormData?.lat && window.spotFormData?.departureCity ? `
        <div style="padding:10px 0;border-bottom:1px solid #1a1f2e;margin-bottom:20px">
          <span style="font-size:14px;color:#e2e8f0">${escapeHTML(window.spotFormData.departureCity)}</span>
          <span style="color:#334155"> · </span>
          <span style="font-size:13px;color:#64748b">${t('position') || 'Position'}: ${window.spotFormData.locationName || window.spotFormData.departureCity}</span>
        </div>
      ` : ''}

      <!-- Photo — dashed underline zone -->
      <div style="margin-bottom:24px">
        <div style="font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px">
          ${t('photoLabel') || 'Photo'} <span style="font-size:10px;color:#334155;text-transform:none;letter-spacing:0">(${t('recommended') || 'recommandé'})</span>
        </div>
        <input
          type="file"
          id="spot-photo"
          name="photo"
          accept="image/*"
          class="hidden"
          onchange="handlePhotoSelect(event)"
          aria-describedby="photo-help"
        />
        ${(window.spotFormData?.photos?.length || 0) < 5 ? `
        <div
          id="photo-upload"
          onclick="triggerPhotoUpload()"
          onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();triggerPhotoUpload();}"
          role="button"
          tabindex="0"
          aria-label="${t('clickToAddPhoto') || 'Cliquez pour ajouter une photo'}"
          style="border-bottom:1px dashed #334155;padding:14px 0;text-align:center;color:#475569;font-size:12px;cursor:pointer"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="1.5" style="vertical-align:middle;margin-right:6px"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
          ${t('addPhoto') || 'Ajouter une photo'}
        </div>
        ` : ''}
        <div id="photo-preview" style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap">
          ${(window.spotFormData?.photos || []).map((p, i) => `
            <div style="position:relative;width:96px;height:96px;border-radius:8px;overflow:hidden;border:1px solid rgba(255,255,255,0.1)">
              <img src="${p}" alt="Photo ${i + 1}" style="width:100%;height:100%;object-fit:cover" />
              <button type="button" onclick="removeSpotPhoto(${i})"
                style="position:absolute;top:4px;right:4px;width:24px;height:24px;border-radius:50%;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;color:#f87171;border:none;cursor:pointer"
                aria-label="${t('close') || 'Supprimer'}">
                ${icon('x', 'w-4 h-4')}
              </button>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Info tip -->
      <div style="font-size:11px;color:#334155;margin-bottom:20px">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#334155" stroke-width="2" style="vertical-align:middle;margin-right:4px"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
        ${t('googleMapsShareTip') || 'Tu peux aussi partager un spot depuis Google Maps vers SpotHitch'}
      </div>

      <!-- SUIVANT button — outlined amber, no radius -->
      <button
        type="button"
        onclick="addSpotNextStep()"
        style="width:100%;background:transparent;border:1px solid #f59e0b;color:#f59e0b;border-radius:0;padding:14px;font-size:14px;font-weight:500;cursor:pointer;letter-spacing:0.5px;text-transform:uppercase"
      >
        ${t('next') || 'SUIVANT'}
      </button>
    </div>
  `
}

/**
 * Render Step 2: Direction + Experience (v3 underline tab design)
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

  // Helper for underline tab bar
  const tabBar = (items, currentVal, onclickFn) => `
    <div style="display:flex;gap:0;border-bottom:1px solid #334155">
      ${items.map(item => `
        <div onclick="${onclickFn}('${item.value}')" role="button" tabindex="0"
          style="flex:1;padding:10px 0;text-align:center;font-size:13px;cursor:pointer;${
            currentVal === item.value
              ? `color:${item.color || '#f59e0b'};border-bottom:2px solid ${item.color || '#f59e0b'};margin-bottom:-1px`
              : 'color:#64748b'
          }">${item.label}</div>
      `).join('')}
    </div>`

  return `
    <div class="step-transition">
      <!-- Direction — underline input -->
      <div style="margin-bottom:24px" class="relative">
        <div style="font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">${t('destinationCity') || 'Direction'} <span style="color:#f59e0b">*</span></div>
        <input
          type="text"
          id="spot-direction-city"
          name="directionCity"
          style="width:100%;background:transparent;border:none;border-bottom:1px solid #334155;padding:8px 0;color:#e2e8f0;font-size:16px;outline:none"
          placeholder="${t('destinationCity') || 'Direction'}"
          value="${escapeHTML(window.spotFormData?.directionCity || '')}"
          required
          aria-required="true"
        />
      </div>

      <!-- Extra destinations -->
      <div style="margin-bottom:24px">
        ${(window.spotFormData?.extraDestinations || []).map((d, i) => `
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
            <span style="flex:1;padding:6px 12px;font-size:13px;color:#f59e0b;border-bottom:1px solid #f59e0b">${icon('map-pin', 'w-3.5 h-3.5 inline mr-1')} ${escapeHTML(d.city)}</span>
            <button type="button" onclick="removeSpotDestination(${i})"
              style="width:28px;height:28px;border-radius:50%;background:rgba(239,68,68,0.1);display:flex;align-items:center;justify-content:center;color:#f87171;border:none;cursor:pointer"
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
              style="width:100%;background:transparent;border:none;border-bottom:1px solid #334155;padding:8px 0;color:#e2e8f0;font-size:14px;outline:none"
              placeholder="${t('destinationCityPlaceholder') || 'Ville de destination'}"
            />
          </div>
          <button type="button" onclick="addSpotDestination()"
            style="width:100%;padding:8px 0;background:transparent;border:none;border-bottom:1px solid rgba(255,255,255,0.05);font-size:11px;color:#475569;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px"
            id="add-dest-btn">
            ${icon('plus', 'w-3.5 h-3.5')} ${t('addDestination') || 'Ajouter une destination'}
          </button>
        ` : `
          <div style="font-size:11px;color:#475569;text-align:center">${t('maxDestinations') || 'Maximum 5 destinations'}</div>
        `}
      </div>

      <!-- Wait Time — range slider + amber value -->
      <div style="margin-bottom:24px">
        <div style="font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">${t('waitTimeLabel') || "Attente"} <span style="color:#f59e0b">*</span></div>
        <div style="display:flex;align-items:center;gap:12px">
          <input
            type="range"
            min="0"
            max="${WAIT_STEPS.length - 1}"
            value="${waitIdx >= 0 ? waitIdx : 4}"
            style="flex:1;accent-color:#f59e0b"
            oninput="setWaitTime(this.value)"
            aria-label="${t('waitTimeSliderDesc') || 'Combien de temps as-tu attendu ?'}"
          />
          <span style="font-size:16px;font-weight:300;color:#f59e0b;min-width:60px;text-align:right" id="wait-time-display">
            ${currentWait ? (currentWait >= 180 ? '3h+' : currentWait + ' min') : '10 min'}
          </span>
        </div>
      </div>

      <!-- Method — underline tab bar -->
      <div style="margin-bottom:24px">
        <div style="font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px">${t('practicalTips') || 'Méthode'} <span style="color:#f59e0b">*</span></div>
        ${tabBar([
          { value: 'sign', label: t('methodSign') || 'Panneau' },
          { value: 'thumb', label: t('methodThumb') || 'Pouce' },
          { value: 'asking', label: t('methodAsking') || 'En demandant' },
        ], method, 'setMethod')}
      </div>

      <!-- Group — underline tab bar -->
      <div style="margin-bottom:24px">
        <div style="font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px">${t('groupSizeLabel') || 'Groupe'} <span style="color:#f59e0b">*</span></div>
        ${tabBar([
          { value: 'solo', label: t('groupSolo') || 'Solo' },
          { value: 'duo', label: t('groupDuo') || 'Duo' },
          { value: 'group', label: t('groupTrioPlus') || 'Groupe 3+' },
        ], groupSize, 'setGroupSize')}
      </div>

      <!-- Moment — underline tab bar -->
      <div style="margin-bottom:24px">
        <div style="font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px">${t('timeOfDayLabel') || 'Moment'} <span style="color:#f59e0b">*</span></div>
        ${tabBar([
          { value: 'morning', label: t('timeMorning') || 'Matin' },
          { value: 'afternoon', label: t('timeAfternoon') || 'Après-midi' },
          { value: 'evening', label: t('timeEvening') || 'Soir' },
          { value: 'night', label: t('timeNight') || 'Nuit' },
        ], timeOfDay, 'setTimeOfDay')}
      </div>

      <!-- Lift obtenu — underline tab bar (Oui = green, Abandonné = grey) -->
      <div style="margin-bottom:24px">
        <div style="font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px">${t('gotARide') || 'Lift obtenu'} <span style="color:#f59e0b">*</span></div>
        <div style="display:flex;gap:0;border-bottom:1px solid #334155">
          <div onclick="setRideResult('yes')" role="button" tabindex="0"
            style="flex:1;padding:10px 0;text-align:center;font-size:13px;cursor:pointer;${rideResult === 'yes' ? 'color:#22c55e;border-bottom:2px solid #22c55e;margin-bottom:-1px' : 'color:#64748b'}">${t('yes') || 'Oui'}</div>
          <div onclick="setRideResult('no')" role="button" tabindex="0"
            style="flex:1;padding:10px 0;text-align:center;font-size:13px;cursor:pointer;${rideResult === 'no' ? 'color:#ef4444;border-bottom:2px solid #ef4444;margin-bottom:-1px' : 'color:#64748b'}">${t('no') || 'Non'}</div>
          <div onclick="setRideResult('gaveUp')" role="button" tabindex="0"
            style="flex:1;padding:10px 0;text-align:center;font-size:13px;cursor:pointer;${rideResult === 'gaveUp' ? 'color:#64748b;border-bottom:2px solid #64748b;margin-bottom:-1px' : 'color:#64748b'}">${t('gaveUp') || 'Abandonné'}</div>
        </div>
      </div>

      <!-- RETOUR + SUIVANT buttons -->
      <div style="display:flex;gap:12px;margin-top:24px">
        <button type="button" onclick="addSpotPrevStep()"
          style="flex:1;background:transparent;border:1px solid #334155;color:#64748b;border-radius:0;padding:14px;font-size:14px;cursor:pointer;text-transform:uppercase">
          ${t('back') || 'RETOUR'}
        </button>
        <button type="button" onclick="addSpotNextStep()"
          style="flex:2;background:transparent;border:1px solid #f59e0b;color:#f59e0b;border-radius:0;padding:14px;font-size:14px;font-weight:500;cursor:pointer;text-transform:uppercase">
          ${t('next') || 'SUIVANT'}
        </button>
      </div>
    </div>
  `
}

/**
 * Render Step 3: Ratings (bar segments) + Amenities (underline tabs) + Description + Submit (v3)
 */
function renderStep3(state) {
  const isPreview = state.addSpotPreview === true
  const tags = window.spotFormData.tags || {}
  return `
    <div class="step-transition">
      <!-- Ratings — segmented bars -->
      ${renderBarRating('safety', t('safetyRating') || 'Sécurité')}
      ${renderBarRating('traffic', t('traffic') || 'Trafic')}
      ${renderBarRating('accessibility', t('accessibility') || 'Accessibilité')}

      <!-- Amenities — underline tab style -->
      <div style="margin-bottom:24px">
        <div style="font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px">${t('amenitiesLabel') || 'Commodités'}</div>
        <div style="display:flex;flex-wrap:wrap;gap:0">
          <button type="button" onclick="toggleAmenity('shelter')"
            class="amenity-chip"
            style="padding:8px 16px;font-size:12px;background:transparent;border:none;border-bottom:${tags.shelter ? '2px solid #f59e0b' : 'none'};color:${tags.shelter ? '#f59e0b' : '#64748b'};cursor:pointer">
            ${t('amenityShelter') || 'Abri'}
          </button>
          <button type="button" onclick="toggleAmenity('waterFood')"
            class="amenity-chip"
            style="padding:8px 16px;font-size:12px;background:transparent;border:none;border-bottom:${tags.waterFood ? '2px solid #f59e0b' : 'none'};color:${tags.waterFood ? '#f59e0b' : '#64748b'};cursor:pointer">
            ${t('amenityWater') || 'Eau'}
          </button>
          <button type="button" onclick="toggleAmenity('toilets')"
            class="amenity-chip"
            style="padding:8px 16px;font-size:12px;background:transparent;border:none;border-bottom:${tags.toilets ? '2px solid #f59e0b' : 'none'};color:${tags.toilets ? '#f59e0b' : '#64748b'};cursor:pointer">
            ${t('amenityToilets') || 'Toilettes'}
          </button>
          <button type="button" onclick="toggleAmenity('food')"
            class="amenity-chip"
            style="padding:8px 16px;font-size:12px;background:transparent;border:none;border-bottom:${tags.food ? '2px solid #f59e0b' : 'none'};color:${tags.food ? '#f59e0b' : '#64748b'};cursor:pointer">
            ${t('amenityFood') || 'Nourriture'}
          </button>
          <button type="button" onclick="toggleAmenity('stoppingSpace')"
            class="amenity-chip"
            style="padding:8px 16px;font-size:12px;background:transparent;border:none;border-bottom:${tags.stoppingSpace ? '2px solid #f59e0b' : 'none'};color:${tags.stoppingSpace ? '#f59e0b' : '#64748b'};cursor:pointer">
            ${t('stoppingSpaceTag') || 'Parking'}
          </button>
        </div>
      </div>

      <!-- Description — underline textarea -->
      <div style="margin-bottom:24px">
        <div style="font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">
          ${t('description')} <span style="font-size:10px;color:#334155;text-transform:none;letter-spacing:0">(${t('recommended') || 'recommandé'})</span>
        </div>
        <textarea
          id="spot-description"
          name="description"
          style="width:100%;background:transparent;border:none;border-bottom:1px solid #334155;padding:8px 0;color:#e2e8f0;font-size:14px;outline:none;resize:none;min-height:60px;font-family:inherit"
          placeholder="${t('spotDescPlaceholder') || 'Quelques mots sur ce spot...'}"
          maxlength="500"
          aria-describedby="desc-counter"
        ></textarea>
        <div style="text-align:right;font-size:11px;color:#475569;margin-top:4px" id="desc-counter" aria-live="polite">
          <span id="desc-count">0</span>/500 <span class="sr-only">caractères</span>
        </div>
      </div>

      <!-- RETOUR + PUBLIER buttons -->
      <div style="display:flex;gap:12px;margin-top:24px">
        <button type="button" onclick="addSpotPrevStep()"
          style="flex:1;background:transparent;border:1px solid #334155;color:#64748b;border-radius:0;padding:14px;font-size:14px;cursor:pointer;text-transform:uppercase">
          ${t('back') || 'RETOUR'}
        </button>
        ${isPreview ? `
        <button type="button" onclick="closeAddSpot()"
          style="flex:2;background:transparent;border:1px solid #f59e0b;color:#f59e0b;border-radius:0;padding:14px;font-size:14px;cursor:pointer;text-transform:uppercase" id="submit-spot-btn">
          ${t('previewModeClose') || 'FERMER'}
        </button>
        ` : `
        <button type="button" onclick="showSpotSummary()"
          style="flex:2;background:#f59e0b;border:none;color:#0f1520;border-radius:0;padding:14px;font-size:14px;font-weight:600;cursor:pointer;text-transform:uppercase" id="submit-spot-btn">
          ${t('reviewAndPublish') || 'VÉRIFIER ET PUBLIER'}
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

  return `
    <div style="margin-bottom:24px">
      <div style="font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px" id="location-label">${t('position') || 'Position sur la carte'} <span style="color:#f59e0b">*</span></div>

      ${hasPosition ? `
        <!-- Position chosen — mini map preview + info -->
        <div onclick="openFullscreenMapPicker()" role="button" tabindex="0"
          onkeydown="if(event.key==='Enter')openFullscreenMapPicker()"
          style="background:#111827;cursor:pointer;overflow:hidden">
          <div id="addspot-mini-map" style="width:100%;height:120px;background:#161b28"></div>
          <div style="padding:10px 14px;display:flex;align-items:center;gap:10px">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="1.5" style="flex-shrink:0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <div style="flex:1;min-width:0">
              <div style="font-size:13px;color:#e2e8f0">${escapeHTML(window.spotFormData?.locationName || '')} <span style="color:#475569;font-size:11px">${lat?.toFixed(4) || '?'}, ${lng?.toFixed(4) || '?'}</span></div>
              ${window.spotFormData?.departureCity && window.spotFormData?.locationName && window.spotFormData.departureCity !== window.spotFormData.locationName ? `<div style="font-size:11px;color:#94a3b8">${t('departure') || 'Départ'}: ${escapeHTML(window.spotFormData.departureCity)}</div>` : ''}
              <div style="font-size:11px;color:#f59e0b">${t('modify') || 'Modifier la position'}</div>
            </div>
          </div>
        </div>
      ` : `
        <!-- No position — map placeholder + GPS button -->
        <div onclick="openFullscreenMapPicker()" role="button" tabindex="0"
          onkeydown="if(event.key==='Enter')openFullscreenMapPicker()"
          style="background:#111827;height:110px;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#475569;font-size:12px;gap:6px;cursor:pointer">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          ${t('tapToPlaceSpot') || 'Toucher pour placer le spot'}
        </div>
        <button type="button" onclick="useGPSForSpot()"
          style="width:100%;margin-top:8px;padding:10px 0;background:transparent;border:none;border-bottom:1px solid rgba(255,255,255,0.05);font-size:12px;color:#475569;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px"
          aria-describedby="location-display">
          ${icon('crosshair', 'w-4 h-4')} ${t('useMyPosition') || 'Ma position GPS'}
        </button>
      `}

      <div id="location-display" class="sr-only" aria-live="polite" role="status"></div>

      ${renderGmapsTip()}
    </div>
  `
}

/**
 * Google Maps share tip — design "avant/après"
 * Shows full tip if not dismissed, otherwise a discrete link.
 * Dismissed state stored in localStorage key spothitch_gmaps_tip_hidden.
 */
function renderGmapsTip() {
  const hidden = (() => {
    try { return localStorage.getItem('spothitch_gmaps_tip_hidden') === '1' }
    catch { return false }
  })()

  if (hidden) {
    return `
      <div style="text-align:center;padding:8px 0 0">
        <span onclick="window._showGmapsTipFull()"
          style="font-size:11px;color:#f59e0b;cursor:pointer;
            text-decoration:underline" role="button" tabindex="0"
          onkeydown="if(event.key==='Enter')window._showGmapsTipFull()">
          ${t('gmapsTipLink')}
        </span>
      </div>`
  }

  return renderGmapsTipCard()
}

export function renderAddSpot(_state) {
  const isPreview = _state.addSpotPreview === true
  const currentStep = _state.addSpotStep || 1

  return `
    <div
      id="addspot-modal"
      class="addspot-dialog fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onclick="closeAddSpot()"
      role="dialog"
      aria-modal="true"
      aria-labelledby="addspot-modal-title"
      tabindex="0">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true"></div>

      <!-- Modal -->
      <div
        class="relative w-full max-w-lg max-h-[90vh] overflow-hidden slide-up sm:rounded-xl"
        style="background:#0f1520;border:1px solid #1e293b"
        onclick="event.stopPropagation()"
      >
        <!-- Header — minimal -->
        <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #1a1f2e">
          <h2 id="addspot-modal-title" style="font-size:16px;font-weight:600;color:#e2e8f0">${t('addSpot')}${isPreview ? ` <span style="font-size:12px;font-weight:400;color:#f59e0b;margin-left:8px">${t('previewMode')}</span>` : ''}</h2>
          <button
            onclick="closeAddSpot()"
            style="width:32px;height:32px;background:rgba(255,255,255,0.05);display:flex;align-items:center;justify-content:center;border:none;cursor:pointer;color:#64748b"
            aria-label="${t('close') || 'Fermer'}"
            type="button"
          >
            ${icon('x', 'w-5 h-5')}
          </button>
        </div>

        <!-- Form -->
        <div style="padding:24px 20px;overflow-y:auto;max-height:calc(90vh - 70px)">
          ${renderStepProgress(currentStep)}

          <form id="add-spot-form" onsubmit="handleAddSpot(event)" aria-label="${t('addSpotForm') || "Formulaire d'ajout de spot"}">
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
  if (window.spotFormData.photos.length >= 5) {
    const { showError } = await import('../../services/notifications.js')
    showError(t('maxPhotos'))
    return
  }

  try {
    const { compressImage } = await import('../../utils/image.js')
    const compressed = await compressImage(file, 1200, 0.75)
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

  // Update bar segments (v3 design)
  const buttons = document.querySelectorAll(`button[data-criterion="${criterion}"]`)
  buttons.forEach((btn) => {
    const star = parseInt(btn.dataset.star, 10)
    btn.style.background = star <= value ? '#f59e0b' : '#1a1f2e'
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
  // Update button styles directly (must override inline styles)
  document.querySelectorAll('.spot-type-btn').forEach(btn => {
    const btnType = btn.getAttribute('onclick')?.match(/'(\w+)'/)?.[1]
    const isActive = btnType === type
    if (isActive) {
      btn.classList.add('active')
      btn.style.border = '1px solid #f59e0b'
      btn.style.background = 'rgba(245,158,11,0.07)'
      btn.style.color = '#f59e0b'
    } else {
      btn.classList.remove('active')
      btn.style.border = '1px solid #1a1f2e'
      btn.style.background = '#1a1f2e'
      btn.style.color = '#64748b'
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

// Helper: update tab bar inline styles (inline styles override CSS classes)
function updateTabBar(selector, activeValue, activeColor = '#f59e0b') {
  document.querySelectorAll(selector).forEach(btn => {
    const val = btn.getAttribute('onclick')?.match(/'(\w+)'/)?.[1]
    const isActive = val === activeValue
    btn.style.color = isActive ? activeColor : '#64748b'
    btn.style.borderBottom = isActive ? `2px solid ${activeColor}` : 'none'
    btn.style.marginBottom = isActive ? '-1px' : ''
  })
}

// Method selection — DOM-only, no re-render
window.setMethod = (method) => {
  window.spotFormData.method = method
  updateTabBar('[onclick*="setMethod"]', method)
}

// Group size selection — DOM-only, no re-render
window.setGroupSize = (size) => {
  window.spotFormData.groupSize = size
  updateTabBar('[onclick*="setGroupSize"]', size)
}

// Time of day selection — DOM-only, no re-render
window.setTimeOfDay = (time) => {
  window.spotFormData.timeOfDay = time
  updateTabBar('[onclick*="setTimeOfDay"]', time)
}

// Ride result — DOM-only, no re-render (prevents data loss)
window.setRideResult = (result) => {
  window.spotFormData.rideResult = result
  const color = result === 'yes' ? '#22c55e' : result === 'no' ? '#ef4444' : '#64748b'
  updateTabBar('[onclick*="setRideResult"]', result, color)
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
  const isActive = window.spotFormData.tags[name]
  const chip = document.querySelector(`[onclick*="toggleAmenity('${name}')"]`)
  if (chip) {
    chip.style.borderBottom = isActive ? '2px solid #f59e0b' : 'none'
    chip.style.color = isActive ? '#f59e0b' : '#64748b'
  }
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

// Google Maps share tip handlers
window._dismissGmapsTip = (checked) => {
  try {
    if (checked) {
      localStorage.setItem('spothitch_gmaps_tip_hidden', '1')
      const card = document.getElementById('gmaps-tip-card')
      if (card) {
        card.outerHTML = `<div style="text-align:center;padding:8px 0 0">
          <span onclick="window._showGmapsTipFull()"
            style="font-size:11px;color:#f59e0b;cursor:pointer;
              text-decoration:underline" role="button" tabindex="0">
            ${t('gmapsTipLink')}
          </span></div>`
      }
    } else {
      localStorage.removeItem('spothitch_gmaps_tip_hidden')
    }
  } catch { /* no-op */ }
}

window._showGmapsTipFull = () => {
  try { localStorage.removeItem('spothitch_gmaps_tip_hidden') } catch { /* no-op */ }
  // Replace the link with the full tip card via DOM
  const link = document.querySelector('[onclick*="_showGmapsTipFull"]')
  if (link?.parentElement) {
    const wrapper = link.parentElement
    wrapper.outerHTML = renderGmapsTipCard()
  }
}

// Exported so _showGmapsTipFull can re-insert the card
function renderGmapsTipCard() {
  return `
    <div id="gmaps-tip-card"
      style="background:#0f1520;border:1px solid #1e293b;
        border-radius:12px;padding:16px;margin-top:14px">
      <div style="font-size:14px;font-weight:700;text-align:center;
        margin-bottom:14px">
        ${t('gmapsTipTitle')}
      </div>
      <div style="display:flex;gap:10px;margin-bottom:14px">
        <div style="flex:1;background:#1a1f2e;border-radius:10px;
          overflow:hidden;border:1px solid rgba(239,68,68,0.2)">
          <div style="background:rgba(239,68,68,0.08);padding:6px;
            text-align:center;font-size:10px;font-weight:700;
            color:#ef4444;letter-spacing:1px">
            ❌ ${t('gmapsTipManual')}
          </div>
          <div style="height:80px;position:relative;overflow:hidden;
            background:#111827">
            <img src="https://tile.openstreetmap.org/6/32/22.png"
              style="width:100%;height:100%;object-fit:cover;opacity:0.4"
              alt="" onerror="this.style.display='none'">
            <div style="position:absolute;inset:0;display:flex;
              align-items:center;justify-content:center">
              <span style="font-size:28px;opacity:0.8">🔍</span>
            </div>
          </div>
          <div style="padding:8px;text-align:center;font-size:10px;
            color:#94a3b8">
            ${t('gmapsTipManualDesc')}
            <div style="color:#ef4444;font-weight:600;margin-top:4px">
              ⏱ ~2 min
            </div>
          </div>
        </div>
        <div style="flex:1;background:#1a1f2e;border-radius:10px;
          overflow:hidden;border:1px solid rgba(34,197,94,0.2)">
          <div style="background:rgba(34,197,94,0.08);padding:6px;
            text-align:center;font-size:10px;font-weight:700;
            color:#22c55e;letter-spacing:1px">
            ✓ GOOGLE MAPS
          </div>
          <div style="height:80px;position:relative;overflow:hidden;
            background:#111827">
            <img src="https://tile.openstreetmap.org/14/8529/5975.png"
              style="width:100%;height:100%;object-fit:cover;opacity:0.5"
              alt="" onerror="this.style.display='none'">
            <div style="position:absolute;top:50%;left:50%;
              transform:translate(-50%,-100%)">
              <svg width="18" height="24" viewBox="0 0 24 32"
                fill="#f59e0b"><path d="M12 0C5.4 0 0 5.4 0 12c0 9
                12 20 12 20s12-11 12-20C24 5.4 18.6 0 12 0z"/></svg>
            </div>
          </div>
          <div style="padding:8px;text-align:center;font-size:10px;
            color:#94a3b8">
            ${t('gmapsTipShareDesc')}
            <div style="color:#22c55e;font-weight:600;margin-top:4px">
              ⏱ 3 sec
            </div>
          </div>
        </div>
      </div>
      <div style="text-align:center;font-size:12px;color:#94a3b8;
        margin-bottom:12px">
        ${t('gmapsTipHowTo')}
      </div>
      <label style="display:flex;align-items:center;gap:8px;
        font-size:12px;color:#64748b;cursor:pointer;
        justify-content:center"
        onclick="event.stopPropagation()">
        <input type="checkbox"
          onchange="window._dismissGmapsTip(this.checked)"
          style="accent-color:#f59e0b;width:14px;height:14px">
        ${t('gmapsTipDismiss')}
      </label>
    </div>`
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

    // Try to reuse the home map's already-loaded style for instant tiles
    let styleToUse = 'https://tiles.openfreemap.org/styles/liberty'
    try {
      const homeMap = window.spotHitchMap || window.mapInstance
      if (homeMap && typeof homeMap.getStyle === 'function') {
        const s = homeMap.getStyle()
        if (s && s.sources) styleToUse = s
      }
    } catch { /* use default URL */ }

    fullscreenMap = new maplibregl.default.Map({
      container: document.getElementById('fmp-map'),
      style: styleToUse,
      center,
      zoom,
    })

    // Ensure map renders properly after container is visible
    fullscreenMap.on('load', () => fullscreenMap.resize())
    setTimeout(() => fullscreenMap.resize(), 200)

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
        window.spotFormData.locationName = pickedCity
        const departureCityInput = document.getElementById('spot-departure-city')
        if (departureCityInput && !departureCityInput.value) {
          departureCityInput.value = pickedCity
          window.spotFormData.departureCity = pickedCity
          window.spotFormData.departureCityCoords = { lat: pickedLat, lng: pickedLng }
        }
        if (!window.spotFormData.departureCity) {
          window.spotFormData.departureCity = pickedCity
          window.spotFormData.departureCityCoords = { lat: pickedLat, lng: pickedLng }
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

// Gas station verification — checks Overpass for fuel amenity within 300m
async function verifyGasStationNearby(lat, lng) {
  try {
    const radius = 300
    const query = `[out:json][timeout:10];(node["amenity"="fuel"](around:${radius},${lat},${lng}););out center 1;`
    const resp = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`)
    if (!resp.ok) return { verified: true } // fail open on API error
    const ct = resp.headers.get('content-type') || ''
    if (!ct.includes('json')) return { verified: true } // server overloaded, fail open
    const data = await resp.json()
    const found = data.elements && data.elements.length > 0
    return {
      verified: found,
      stationName: found ? (data.elements[0].tags?.name || data.elements[0].tags?.brand || '') : '',
    }
  } catch {
    return { verified: true } // fail open on network error
  }
}

// Show gas station confirmation overlay — returns 'keep' or 'change'
function showGasStationConfirm() {
  return new Promise((resolve) => {
    const overlay = document.createElement('div')
    overlay.id = 'gas-station-confirm'
    overlay.style.cssText = 'position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;padding:20px'
    overlay.innerHTML = `
      <div style="background:#0f1520;border-radius:16px;padding:24px;max-width:340px;width:100%;border:1px solid #1a1f2e">
        <div style="text-align:center;margin-bottom:16px">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        </div>
        <div style="font-size:16px;font-weight:600;color:#e2e8f0;margin-bottom:8px;text-align:center">${t('noStationConfirmTitle')}</div>
        <div style="font-size:14px;color:#94a3b8;margin-bottom:24px;text-align:center;line-height:1.5">${t('noStationConfirmMessage')}</div>
        <div style="display:flex;flex-direction:column;gap:10px">
          <button id="gas-confirm-keep" style="padding:14px;border-radius:10px;border:1px solid #334155;background:transparent;color:#e2e8f0;font-size:14px;cursor:pointer">${t('noStationKeep')}</button>
          <button id="gas-confirm-change" style="padding:14px;border-radius:10px;border:none;background:#f59e0b;color:#0f1520;font-size:14px;font-weight:600;cursor:pointer">${t('noStationChange')}</button>
        </div>
      </div>
    `
    document.body.appendChild(overlay)
    document.getElementById('gas-confirm-keep').addEventListener('click', () => {
      overlay.remove()
      resolve('keep')
    })
    document.getElementById('gas-confirm-change').addEventListener('click', () => {
      overlay.remove()
      resolve('change')
    })
  })
}

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
      window.selectSpotType('on_ramp')
      showSuccess(t('highwayDetected') || 'Autoroute/voie rapide detectee !')
    } else {
      window.selectSpotType('roadside')
      showSuccess(t('roadDetected') || 'Route detectee')
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
        // Restore selected item if city was already chosen (after re-render)
        if (window.spotFormData.departureCity && ac.setSelectedItem) {
          ac.setSelectedItem({
            name: window.spotFormData.departureCity,
            lat: window.spotFormData.departureCityCoords?.lat,
            lng: window.spotFormData.departureCityCoords?.lng,
          })
        }
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
        // Restore selected item if direction was already chosen (after re-render)
        if (window.spotFormData.directionCity && ac.setSelectedItem) {
          ac.setSelectedItem({
            name: window.spotFormData.directionCity,
            lat: window.spotFormData.directionCityCoords?.lat,
            lng: window.spotFormData.directionCityCoords?.lng,
          })
        }
        autocompleteCleanups.push(ac)
      }
    })
  })
}

// Init mini-map preview — try to snapshot the existing home map, fallback to lightweight MapLibre
let miniMapInstance = null
function initMiniMapPreview() {
  const container = document.getElementById('addspot-mini-map')
  const lat = window.spotFormData?.lat
  const lng = window.spotFormData?.lng
  if (!container || !lat || !lng) return
  if (container.dataset.initialized === 'true') return
  container.dataset.initialized = 'true'

  // Try to use existing home map for instant snapshot
  const homeMap = window.spotHitchMap || window.mapInstance
  if (homeMap && typeof homeMap.getCanvas === 'function') {
    try {
      // Save current state, fly to spot, capture, restore
      const origCenter = homeMap.getCenter()
      const origZoom = homeMap.getZoom()
      homeMap.jumpTo({ center: [lng, lat], zoom: 14 })
      // Wait for tiles to render then capture
      const capture = () => {
        try {
          const srcCanvas = homeMap.getCanvas()
          const destCanvas = document.createElement('canvas')
          destCanvas.width = srcCanvas.width
          destCanvas.height = srcCanvas.height
          destCanvas.style.width = '100%'
          destCanvas.style.height = '100%'
          destCanvas.style.objectFit = 'cover'
          destCanvas.getContext('2d').drawImage(srcCanvas, 0, 0)
          container.innerHTML = ''
          container.appendChild(destCanvas)
          // Add amber marker overlay
          const marker = document.createElement('div')
          marker.innerHTML = '<svg width="28" height="38" viewBox="0 0 28 38"><path d="M14 0C6.27 0 0 6.27 0 14c0 10.5 14 24 14 24s14-13.5 14-24C28 6.27 21.73 0 14 0z" fill="#f59e0b"/><circle cx="14" cy="14" r="6" fill="#fff"/></svg>'
          marker.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-100%);pointer-events:none'
          container.style.position = 'relative'
          container.appendChild(marker)
        } catch { /* canvas tainted — fall through to MapLibre */ }
        // Restore home map position
        homeMap.jumpTo({ center: origCenter, zoom: origZoom })
      }
      // Give a frame for tiles to render
      homeMap.once('idle', capture)
      setTimeout(capture, 500) // safety fallback
      return
    } catch { /* fall through to MapLibre */ }
  }

  // Fallback: create a lightweight MapLibre instance
  import('maplibre-gl').then(maplibregl => {
    if (miniMapInstance) {
      try { miniMapInstance.remove() } catch { /* ok */ }
    }
    miniMapInstance = new maplibregl.default.Map({
      container,
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center: [lng, lat],
      zoom: 14,
      interactive: false,
      attributionControl: false,
    })
    new maplibregl.default.Marker({ color: '#f59e0b' })
      .setLngLat([lng, lat])
      .addTo(miniMapInstance)
    miniMapInstance.on('load', () => miniMapInstance.resize())
    setTimeout(() => miniMapInstance.resize(), 300)
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

  if (depInput && !dirInput) {
    // Always cleanup + re-init: DOM is recreated on each render
    cleanupAutocompletes()
    lastAutocompleteStep = 1
    initStep1Autocomplete()
    // Init mini-map preview if position is set
    initMiniMapPreview()
    // If share coords pending, auto-open fullscreen map picker
    if (window._pendingShareCoords) {
      requestAnimationFrame(() => window.openFullscreenMapPicker?.())
    }
  } else if (dirInput) {
    cleanupAutocompletes()
    lastAutocompleteStep = 2
    initStep2Autocomplete()
  } else if (!depInput && !dirInput && lastAutocompleteStep !== 0) {
    lastAutocompleteStep = 0
    cleanupAutocompletes()
    // Cleanup fullscreen map if modal closes
    closeFullscreenMapPicker()
  }
}

// Show summary overlay before publishing — user must confirm
window.showSpotSummary = async () => {
  const fd = window.spotFormData
  const { getState } = await import('../../stores/state.js')
  const state = getState()
  const spotType = state.addSpotType || 'custom'
  const description = document.getElementById('spot-description')?.value.trim() || ''

  // Quick validation first (same checks as handleAddSpot)
  const { showError } = await import('../../services/notifications.js')
  if (!fd.lat || !fd.lng) { showError(t('positionRequired') || 'Position obligatoire'); return }
  if (!fd.directionCity) { showError(t('directionRequired')); return }
  if (!fd.departureCity) { showError(t('departureRequired') || 'Ville de départ obligatoire'); return }
  if (!fd.method) { showError(t('methodRequired')); return }
  if (!fd.groupSize) { showError(t('groupSizeRequired')); return }
  if (!fd.timeOfDay) { showError(t('timeOfDayRequired')); return }
  if (!fd.rideResult) { showError(t('rideResultRequired')); return }
  const r = fd.ratings || {}
  if (!r.safety || !r.traffic || !r.accessibility) { showError(t('ratingsRequired') || 'Note les 3 critères'); return }

  // Type labels
  const typeLabels = {
    gas_station: t('spotTypeGasStation') || 'Station / Aire',
    toll: t('spotTypeToll') || 'Péage',
    roundabout: t('spotTypeRoundabout') || 'Rond-point',
    on_ramp: t('spotTypeOnRamp') || 'Bretelle',
    roadside: t('spotTypeRoadside') || 'Bord de route',
    custom: t('spotTypeCustom') || 'Autre',
  }
  const methodLabels = {
    sign: t('methodSign') || 'Panneau', thumb: t('methodThumb') || 'Pouce', asking: t('methodAsking') || 'En demandant',
  }
  const groupLabels = {
    solo: 'Solo', duo: 'Duo', group: t('groupTrioPlus') || 'Groupe 3+',
  }
  const timeLabels = {
    morning: t('timeMorning') || 'Matin', afternoon: t('timeAfternoon') || 'Après-midi',
    evening: t('timeEvening') || 'Soir', night: t('timeNight') || 'Nuit',
  }
  const rideLabels = {
    yes: '✅ ' + (t('yes') || 'Oui'), no: '❌ ' + (t('no') || 'Non'), gaveUp: '🏳️ ' + (t('gaveUp') || 'Abandonné'),
  }

  // Build destinations text
  const allDests = [fd.directionCity, ...(fd.extraDestinations || []).map(d => d.city)].filter(Boolean)

  // Build amenities list
  const tags = fd.tags || {}
  const amenityList = []
  if (tags.shelter) amenityList.push(t('amenityShelter') || 'Abri')
  if (tags.waterFood) amenityList.push(t('amenityWater') || 'Eau')
  if (tags.toilets) amenityList.push(t('amenityToilets') || 'Toilettes')
  if (tags.food) amenityList.push(t('amenityFood') || 'Nourriture')
  if (tags.stoppingSpace) amenityList.push(t('stoppingSpaceTag') || 'Parking')

  const row = (label, value) => value ? `
    <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #1e293b">
      <span style="font-size:12px;color:#64748b">${escapeHTML(label)}</span>
      <span style="font-size:12px;color:#e2e8f0;text-align:right;max-width:60%">${escapeHTML(String(value))}</span>
    </div>` : ''

  const photoCount = (fd.photos || []).length

  const overlay = document.createElement('div')
  overlay.id = 'spot-summary-overlay'
  overlay.style.cssText = 'position:fixed;inset:0;z-index:60;display:flex;align-items:center;justify-content:center;padding:16px'
  overlay.innerHTML = `
    <div style="position:absolute;inset:0;background:rgba(0,0,0,0.7);backdrop-filter:blur(4px)" onclick="closeSpotSummary()" role="button" tabindex="0"></div>
    <div style="position:relative;background:#0f1520;border:1px solid #1e293b;border-radius:12px;max-width:400px;width:100%;max-height:80vh;overflow-y:auto;padding:20px" onclick="event.stopPropagation()">
      <h3 style="font-size:18px;font-weight:600;color:#e2e8f0;margin-bottom:16px;text-align:center">${t('summaryTitle') || 'Récapitulatif du spot'}</h3>

      ${row(t('spotTypeLabel') || 'Type', typeLabels[spotType] || spotType)}
      ${row(t('departureCity') || 'Départ', fd.departureCity)}
      ${row(t('position') || 'Position', fd.locationName || (fd.lat?.toFixed(4) + ', ' + fd.lng?.toFixed(4)))}
      ${fd.stationName ? row(t('stationNameLabel') || 'Station', fd.stationName) : ''}
      ${row(t('destinationCity') || 'Direction', allDests.join(', '))}
      ${row(t('waitTimeLabel') || 'Attente', fd.waitTime ? (fd.waitTime >= 180 ? '3h+' : fd.waitTime + ' min') : '')}
      ${row(t('practicalTips') || 'Méthode', methodLabels[fd.method] || '')}
      ${row(t('groupSizeLabel') || 'Groupe', groupLabels[fd.groupSize] || '')}
      ${row(t('timeOfDayLabel') || 'Moment', timeLabels[fd.timeOfDay] || '')}
      ${row(t('gotARide') || 'Lift obtenu', rideLabels[fd.rideResult] || '')}
      ${row(t('safety') || 'Sécurité', r.safety + '/5')}
      ${row(t('traffic') || 'Trafic', r.traffic + '/5')}
      ${row(t('accessibility') || 'Accessibilité', r.accessibility + '/5')}
      ${amenityList.length > 0 ? row(t('amenitiesLabel') || 'Commodités', amenityList.join(', ')) : ''}
      ${description ? row(t('description') || 'Description', description.length > 80 ? description.slice(0, 80) + '...' : description) : ''}
      ${row(t('photoLabel') || 'Photos', photoCount > 0 ? photoCount + ' photo' + (photoCount > 1 ? 's' : '') : (t('noPhoto') || 'Aucune photo'))}

      <p style="font-size:11px;color:#64748b;text-align:center;margin:16px 0 12px">${t('summaryWarning') || 'Une fois publié, ce spot ne pourra plus être modifié.'}</p>

      <div style="display:flex;gap:10px">
        <button type="button" onclick="closeSpotSummary()"
          style="flex:1;background:transparent;border:1px solid #334155;color:#64748b;padding:12px;font-size:13px;cursor:pointer;border-radius:8px">
          ${t('modify') || 'Modifier'}
        </button>
        <button type="button" onclick="closeSpotSummary();document.getElementById('add-spot-form')?.dispatchEvent(new Event('submit',{cancelable:true}))"
          style="flex:2;background:#f59e0b;border:none;color:#0f1520;padding:12px;font-size:14px;font-weight:600;cursor:pointer;border-radius:8px">
          ${t('confirmPublish') || 'Confirmer et publier'}
        </button>
      </div>
    </div>
  `
  document.body.appendChild(overlay)
}

window.closeSpotSummary = () => {
  document.getElementById('spot-summary-overlay')?.remove()
}

window.handleAddSpot = async (event) => {
  event.preventDefault()

  const { getState } = await import('../../stores/state.js')
  const state = getState()
  let spotType = state.addSpotType || 'custom'
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

  // Gas station verification — check Overpass for nearby fuel amenity
  if (spotType === 'gas_station' && window.spotFormData.lat && window.spotFormData.lng) {
    if (submitBtn) {
      submitBtn.disabled = true
      submitBtn.innerHTML = `${icon('loader-circle', 'w-5 h-5 animate-spin')} ${t('verifyingStation')}`
    }
    const verification = await verifyGasStationNearby(window.spotFormData.lat, window.spotFormData.lng)
    if (!verification.verified) {
      if (submitBtn) {
        submitBtn.disabled = false
        submitBtn.innerHTML = t('submit') || 'Publier'
      }
      const decision = await showGasStationConfirm()
      if (decision === 'change') {
        spotType = 'custom'
        window.selectSpotType('custom')
        import('../../stores/state.js').then(({ getState: gs }) => {
          gs().addSpotType = 'custom'
        })
      }
      // Either way, continue with submission
    } else if (verification.stationName && !window.spotFormData.stationName) {
      // Auto-fill station name if detected and user left it empty
      window.spotFormData.stationName = verification.stationName
    }
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
