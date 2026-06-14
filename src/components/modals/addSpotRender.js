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
import { escapeHTML, escapeJSString } from '../../utils/sanitize.js'

// Wait time slider steps (minutes)
export const WAIT_STEPS = [1, 2, 3, 5, 10, 15, 20, 25, 30, 45, 60, 90, 120, 180]

export function detectSeason() {
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
 <div class="mb-6">
 <div class="flex justify-between items-center mb-1">
 <span class="text-[11px] text-slate-500 uppercase tracking-wide">${label} <span class="text-amber-500">*</span></span>
 <span class="text-xs text-amber-500" id="spot-rating-value-${criterion}">${currentValue ? currentValue + '/5' : ''}</span></div>
 <div class="flex gap-1" role="radiogroup" aria-label="${label}">
 ${[1, 2, 3, 4, 5].map(val => `
 <button
 type="button"
 onclick="setSpotRating('${escapeJSString(criterion)}', ${val})"
 class="spot-star-btn flex-1 h-2 rounded-sm border-0 cursor-pointer p-0 transition-colors ${val <= currentValue ? 'bg-amber-500' : 'bg-slate-700'}"
 data-criterion="${criterion}"
 data-star="${val}"
 aria-label="${val}/5"
 ></button>
 `).join('')}
 </div>
 <p class="text-[11px] text-slate-500 mt-1 min-h-5" id="spot-rating-desc-${criterion}" aria-live="polite"></p></div>
 `
}

/**
 * Render v3 amber stepper (3 circles connected by lines)
 */
export function renderStepProgress(currentStep) {
 const stepTitles = [
 t('stepWhereIsSpot') || 'Où est le spot ?',
 t('stepExperience') || 'Ton expérience',
 t('stepDetails') || 'Derniers détails',
 ]
 return `
 <div class="flex items-center gap-3 mb-6">
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
 ${i > 0 ? `<div class="flex-1 h-px" style="${lineStyle}"></div>` : ''}
 <div class="w-7 h-7 rounded-full flex items-center justify-center text-[13px] shrink-0" style="${circleStyle}" title="${stepTitles[i]}">${step}</div>
 `
 }).join('')}
 </div>
 <div class="text-[22px] font-light text-slate-200 mb-7">${stepTitles[currentStep - 1]}</div>
 `
}

/**
 * Render Step 1: Type + City + Position + Photo (v3 underline design)
 */
export function renderStep1(state) {
 const spotType = state.addSpotType || window.spotFormData?.spotType || ''
 return `
 <div class="step-transition">
 <!-- Spot Type — 3x2 grid -->
 <div class="mb-6">
 <div class="text-[11px] text-slate-500 uppercase tracking-wide mb-3">${t('spotTypeLabel')} <span class="text-amber-500">*</span></div>
 <div class="grid grid-cols-2 gap-2.5">
 ${['gas_station', 'toll', 'roundabout', 'on_ramp', 'roadside', 'custom'].map(type => `
 <button type="button" onclick="selectSpotType('${type}')"
 class="spot-type-btn ${spotType === type ? 'active' : ''}"
 style="padding:14px 12px;text-align:center;font-size:13px;border-radius:8px;border:1px solid ${spotType === type ? '#f59e0b' : '#1a1f2e'};background:${spotType === type ? 'rgba(245,158,11,0.07)' : '#1a1f2e'};color:${spotType === type ? '#f59e0b' : '#64748b'};cursor:pointer">
 ${t('spotType' + type.split('_').map(w => w[0].toUpperCase() + w.slice(1)).join(''))}
 </button>`).join('')}
 </div>
 <button type="button" onclick="autoDetectRoad()" class="w-full mt-2 py-2 bg-transparent border-0 border-b border-white/10 text-[11px] text-[#475569] cursor-pointer flex items-center justify-center gap-1.5">
 ${icon('crosshair', 'w-3 h-3')} ${t('autoDetectType') || 'Auto-detecter le type'}
 </button></div>

 <!-- Departure City — underline input -->
 <div class="mb-6 relative">
 <div class="text-[11px] text-slate-500 uppercase tracking-wide mb-2">${t('departureCity') || 'Ville'} <span class="text-amber-500">*</span></div>
 <input
 type="text"
 id="spot-departure-city"
 name="departureCity"
 class="w-full bg-transparent border-0 border-b border-slate-700 py-2 text-slate-200 text-base outline-none"
 placeholder="${t('departureCity') || 'Ville de départ'}"
 value="${escapeHTML(window.spotFormData?.departureCity || '')}"
 required
 aria-required="true"
 /></div>

 <!-- GPS Position — map placeholder -->
 ${renderPositionBlock()}

 <!-- Position summary (if set) -->
 ${window.spotFormData?.lat && window.spotFormData?.departureCity ? `
 <div class="py-2.5 border-b border-[#1a1f2e] mb-5">
 <span class="text-sm text-slate-200">${escapeHTML(window.spotFormData.departureCity)}</span>
 <span class="text-slate-700"> · </span>
 <span class="text-[13px] text-slate-500">${t('position') || 'Position'}: ${window.spotFormData.locationName || window.spotFormData.departureCity}</span></div>
 ` : ''}

 <!-- Photo — dashed underline zone -->
 <div class="mb-6">
 <div class="text-[11px] text-slate-500 uppercase tracking-wide mb-3">
 ${t('photoLabel') || 'Photo'} <span class="text-[10px] text-slate-700 normal-case tracking-normal">(${t('recommended') || 'recommandé'})</span></div>
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
 class="border-b border-dashed border-slate-700 py-3.5 text-center text-[#475569] text-xs cursor-pointer"
 >
 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="1.5" class="align-middle mr-1.5 inline"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
 ${t('addPhoto') || 'Ajouter une photo'}
 </div>
 ` : ''}
 <div id="photo-preview" class="flex gap-2 mt-2 flex-wrap">
 ${(window.spotFormData?.photos || []).map((p, i) => `
 <div class="relative w-24 h-24 rounded-lg overflow-hidden border border-white/10">
 <img src="${p}" alt="Photo ${i + 1}" class="w-full h-full object-cover" />
 <button type="button" onclick="removeSpotPhoto(${i})"
 class="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 flex items-center justify-center text-red-400 border-0 cursor-pointer"
 aria-label="${t('close') || 'Supprimer'}">
 ${icon('x', 'w-4 h-4')}
 </button></div>
 `).join('')}
 </div></div>

 <!-- Info tip -->
 <div class="text-[11px] text-slate-700 mb-5">
 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#334155" stroke-width="2" class="align-middle mr-1 inline"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
 ${t('googleMapsShareTip') || 'Tu peux aussi partager un spot depuis Google Maps vers SpotHitch'}
 </div>

 <!-- SUIVANT button — outlined amber, no radius -->
 <button
 type="button"
 onclick="addSpotNextStep()"
 class="w-full bg-transparent border border-amber-500 text-amber-500 rounded-none p-3.5 text-sm font-medium cursor-pointer tracking-wide uppercase"
 >
 ${t('next') || 'SUIVANT'}
 </button></div>
 `
}

/**
 * Render Step 2: Direction + Experience (v3 underline tab design)
 */
export function renderStep2(state) {
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
 <div class="flex gap-0 border-b border-slate-700">
 ${items.map(item => `
 <div onclick="${onclickFn}('${item.value}')" role="button" tabindex="0"
 class="flex-1 py-2.5 text-center text-[13px] cursor-pointer"
 style="${
 currentVal === item.value
 ? `color:${item.color || '#f59e0b'};border-bottom:2px solid ${item.color || '#f59e0b'};margin-bottom:-1px`
 : 'color:#64748b'
 }">${item.label}</div>
 `).join('')}
 </div>`

 return `
 <div class="step-transition">
 <!-- Direction — underline input -->
 <div class="mb-6 relative">
 <div class="text-[11px] text-slate-500 uppercase tracking-wide mb-2">${t('destinationCity') || 'Direction'} <span class="text-amber-500">*</span></div>
 <input
 type="text"
 id="spot-direction-city"
 name="directionCity"
 class="w-full bg-transparent border-0 border-b border-slate-700 py-2 text-slate-200 text-base outline-none"
 placeholder="${t('destinationCity') || 'Direction'}"
 value="${escapeHTML(window.spotFormData?.directionCity || '')}"
 oninput="window.spotFormData.directionCity = this.value.trim() || null; window.spotFormData.directionCityCoords = null"
 required
 aria-required="true"
 /></div>

 <!-- Extra destinations -->
 <div class="mb-6">
 ${(window.spotFormData?.extraDestinations || []).map((d, i) => `
 <div class="flex items-center gap-2 mb-2">
 <span class="flex-1 px-3 py-1.5 text-[13px] text-amber-500 border-b border-amber-500">${icon('map-pin', 'w-3.5 h-3.5 inline mr-1')} ${escapeHTML(d.city)}</span>
 <button type="button" onclick="removeSpotDestination(${i})"
 class="w-7 h-7 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 border-0 cursor-pointer"
 aria-label="${t('removeDestination') || 'Supprimer'}">
 ${icon('x', 'w-4 h-4')}
 </button></div>
 `).join('')}
 ${(window.spotFormData?.extraDestinations || []).length < 4 ? `
 <div class="relative hidden" id="extra-dest-wrapper">
 <input
 type="text"
 id="spot-extra-dest"
 class="w-full bg-transparent border-0 border-b border-slate-700 py-2 text-slate-200 text-sm outline-none"
 placeholder="${t('destinationCityPlaceholder') || 'Ville de destination'}"
 /></div>
 <button type="button" onclick="addSpotDestination()"
 class="w-full py-2 bg-transparent border-0 border-b border-white/5 text-[11px] text-[#475569] cursor-pointer flex items-center justify-center gap-1.5"
 id="add-dest-btn">
 ${icon('plus', 'w-3.5 h-3.5')} ${t('addDestination') || 'Ajouter une destination'}
 </button>
 ` : `
 <div class="text-[11px] text-[#475569] text-center">${t('maxDestinations') || 'Maximum 5 destinations'}</div>
 `}
 </div>

 <!-- Wait Time — range slider + amber value -->
 <div class="mb-6">
 <div class="text-[11px] text-slate-500 uppercase tracking-wide mb-2">${t('waitTimeLabel') || "Attente"} <span class="text-amber-500">*</span></div>
 <div class="flex items-center gap-3">
 <input
 type="range"
 min="0"
 max="${WAIT_STEPS.length - 1}"
 value="${waitIdx >= 0 ? waitIdx : 4}"
 class="flex-1 accent-amber-500"
 oninput="setWaitTime(this.value)"
 aria-label="${t('waitTimeSliderDesc') || 'Combien de temps as-tu attendu ?'}"
 />
 <span class="text-base font-light text-amber-500 min-w-[60px] text-right" id="wait-time-display">
 ${currentWait ? (currentWait >= 180 ? '3h+' : currentWait + ' min') : '10 min'}
 </span></div></div>

 <!-- Method — underline tab bar -->
 <div class="mb-6">
 <div class="text-[11px] text-slate-500 uppercase tracking-wide mb-3">${t('practicalTips') || 'Méthode'} <span class="text-amber-500">*</span></div>
 ${tabBar([
 { value: 'sign', label: t('methodSign') || 'Panneau' },
 { value: 'thumb', label: t('methodThumb') || 'Pouce' },
 { value: 'asking', label: t('methodAsking') || 'En demandant' },
 ], method, 'setMethod')}
 </div>

 <!-- Group — underline tab bar -->
 <div class="mb-6">
 <div class="text-[11px] text-slate-500 uppercase tracking-wide mb-3">${t('groupSizeLabel') || 'Groupe'} <span class="text-amber-500">*</span></div>
 ${tabBar([
 { value: 'solo', label: t('groupSolo') || 'Solo' },
 { value: 'duo', label: t('groupDuo') || 'Duo' },
 { value: 'group', label: t('groupTrioPlus') || 'Groupe 3+' },
 ], groupSize, 'setGroupSize')}
 </div>

 <!-- Moment — underline tab bar -->
 <div class="mb-6">
 <div class="text-[11px] text-slate-500 uppercase tracking-wide mb-3">${t('timeOfDayLabel') || 'Moment'} <span class="text-amber-500">*</span></div>
 ${tabBar([
 { value: 'morning', label: t('timeMorning') || 'Matin' },
 { value: 'afternoon', label: t('timeAfternoon') || 'Après-midi' },
 { value: 'evening', label: t('timeEvening') || 'Soir' },
 { value: 'night', label: t('timeNight') || 'Nuit' },
 ], timeOfDay, 'setTimeOfDay')}
 </div>

 <!-- Lift obtenu — underline tab bar (Oui = green, Abandonné = grey) -->
 <div class="mb-6">
 <div class="text-[11px] text-slate-500 uppercase tracking-wide mb-3">${t('gotARide') || 'Lift obtenu'} <span class="text-amber-500">*</span></div>
 <div class="flex gap-0 border-b border-slate-700">
 <div onclick="setRideResult('yes')" role="button" tabindex="0"
 class="flex-1 py-2.5 text-center text-[13px] cursor-pointer"
 style="${rideResult === 'yes' ? 'color:#22c55e;border-bottom:2px solid #22c55e;margin-bottom:-1px' : 'color:#64748b'}">${t('yes') || 'Oui'}</div>
 <div onclick="setRideResult('no')" role="button" tabindex="0"
 class="flex-1 py-2.5 text-center text-[13px] cursor-pointer"
 style="${rideResult === 'no' ? 'color:#ef4444;border-bottom:2px solid #ef4444;margin-bottom:-1px' : 'color:#64748b'}">${t('no') || 'Non'}</div>
 <div onclick="setRideResult('gaveUp')" role="button" tabindex="0"
 class="flex-1 py-2.5 text-center text-[13px] cursor-pointer"
 style="${rideResult === 'gaveUp' ? 'color:#64748b;border-bottom:2px solid #64748b;margin-bottom:-1px' : 'color:#64748b'}">${t('gaveUp') || 'Abandonné'}</div></div></div>

 <!-- RETOUR + SUIVANT buttons -->
 <div class="flex gap-3 mt-6">
 <button type="button" onclick="addSpotPrevStep()"
 class="flex-1 bg-transparent border border-slate-700 text-slate-500 rounded-none p-3.5 text-sm cursor-pointer uppercase">
 ${t('back') || 'RETOUR'}
 </button>
 <button type="button" onclick="addSpotNextStep()"
 class="flex-[2] bg-transparent border border-amber-500 text-amber-500 rounded-none p-3.5 text-sm font-medium cursor-pointer uppercase">
 ${t('next') || 'SUIVANT'}
 </button></div></div>
 `
}

/**
 * Render Step 3: Ratings (bar segments) + Amenities (underline tabs) + Description + Submit (v3)
 */
export function renderStep3(state) {
 const isPreview = state.addSpotPreview === true
 const isValidation = !!state.addSpotValidateId
 const tags = window.spotFormData.tags || {}
 return `
 <div class="step-transition">
 <!-- Ratings — segmented bars -->
 ${renderBarRating('safety', t('safetyRating') || 'Sécurité')}
 ${renderBarRating('traffic', t('traffic') || 'Trafic')}
 ${renderBarRating('accessibility', t('accessibility') || 'Accessibilité')}

 <!-- Amenities — underline tab style -->
 <div class="mb-6">
 <div class="text-[11px] text-slate-500 uppercase tracking-wide mb-2.5">${t('amenitiesLabel') || 'Commodités'}</div>
 <div class="flex flex-wrap gap-0">
 <button type="button" onclick="toggleAmenity('shelter')"
 class="amenity-chip px-4 py-2 text-xs bg-transparent border-0 cursor-pointer"
 style="border-bottom:${tags.shelter ? '2px solid #f59e0b' : 'none'};color:${tags.shelter ? '#f59e0b' : '#64748b'}">
 ${t('amenityShelter') || 'Abri'}
 </button>
 <button type="button" onclick="toggleAmenity('waterFood')"
 class="amenity-chip px-4 py-2 text-xs bg-transparent border-0 cursor-pointer"
 style="border-bottom:${tags.waterFood ? '2px solid #f59e0b' : 'none'};color:${tags.waterFood ? '#f59e0b' : '#64748b'}">
 ${t('amenityWater') || 'Eau'}
 </button>
 <button type="button" onclick="toggleAmenity('toilets')"
 class="amenity-chip px-4 py-2 text-xs bg-transparent border-0 cursor-pointer"
 style="border-bottom:${tags.toilets ? '2px solid #f59e0b' : 'none'};color:${tags.toilets ? '#f59e0b' : '#64748b'}">
 ${t('amenityToilets') || 'Toilettes'}
 </button>
 <button type="button" onclick="toggleAmenity('food')"
 class="amenity-chip px-4 py-2 text-xs bg-transparent border-0 cursor-pointer"
 style="border-bottom:${tags.food ? '2px solid #f59e0b' : 'none'};color:${tags.food ? '#f59e0b' : '#64748b'}">
 ${t('amenityFood') || 'Nourriture'}
 </button>
 <button type="button" onclick="toggleAmenity('stoppingSpace')"
 class="amenity-chip px-4 py-2 text-xs bg-transparent border-0 cursor-pointer"
 style="border-bottom:${tags.stoppingSpace ? '2px solid #f59e0b' : 'none'};color:${tags.stoppingSpace ? '#f59e0b' : '#64748b'}">
 ${t('stoppingSpaceTag') || 'Parking'}
 </button></div></div>

 <!-- Description — underline textarea -->
 <div class="mb-6">
 <div class="text-[11px] text-slate-500 uppercase tracking-wide mb-2">
 ${t('description')} <span class="text-[10px] text-slate-700 normal-case tracking-normal">(${t('recommended') || 'recommandé'})</span></div>
 <textarea
 id="spot-description"
 name="description"
 class="w-full bg-transparent border-0 border-b border-slate-700 py-2 text-slate-200 text-sm outline-none resize-none min-h-[60px] font-[inherit]"
 placeholder="${t('spotDescPlaceholder') || 'Quelques mots sur ce spot...'}"
 maxlength="500"
 aria-describedby="desc-counter"
 ></textarea>
 <div class="text-right text-[11px] text-[#475569] mt-1" id="desc-counter" aria-live="polite">
 <span id="desc-count">0</span>/500 <span class="sr-only">caractères</span></div></div>

 <!-- Experience date -->
 <div class="mb-6">
 <div class="text-[11px] text-slate-500 uppercase tracking-wide mb-2.5">${t('experienceDateLabel') || 'Quand as-tu fait du stop ici ?'}</div>
 <div class="flex gap-2 flex-wrap">
 <button type="button" onclick="setExperienceDate('today')"
 id="exp-date-today"
 class="px-4 py-2 text-xs bg-transparent border-0 cursor-pointer"
 style="border-bottom:${(!window.spotFormData._expCustom) ? '2px solid #f59e0b' : 'none'};color:${(!window.spotFormData._expCustom) ? '#f59e0b' : '#64748b'}">
 ${t('today') || "Aujourd'hui"}
 </button>
 <button type="button" onclick="setExperienceDate('custom')"
 id="exp-date-custom"
 class="px-4 py-2 text-xs bg-transparent border-0 cursor-pointer"
 style="border-bottom:${window.spotFormData._expCustom ? '2px solid #f59e0b' : 'none'};color:${window.spotFormData._expCustom ? '#f59e0b' : '#64748b'}">
 ${t('chooseDate') || 'Choisir une date'}
 </button></div>
 <div id="exp-date-selectors" class="${window.spotFormData._expCustom ? 'flex' : 'hidden'} gap-3 mt-2.5">
 <select id="exp-month" onchange="updateExperienceDate()"
 class="flex-1 bg-transparent border-0 border-b border-slate-700 py-2 text-slate-200 text-sm outline-none appearance-none cursor-pointer">
 ${(() => {
 const now = new Date()
 const months = [
 t('monthJan') || 'Janvier', t('monthFeb') || 'Février', t('monthMar') || 'Mars',
 t('monthApr') || 'Avril', t('monthMay') || 'Mai', t('monthJun') || 'Juin',
 t('monthJul') || 'Juillet', t('monthAug') || 'Août', t('monthSep') || 'Septembre',
 t('monthOct') || 'Octobre', t('monthNov') || 'Novembre', t('monthDec') || 'Décembre'
 ]
 const selMonth = window.spotFormData.experienceMonth ?? (now.getMonth() + 1)
 return months.map((m, i) => `<option value="${i + 1}" ${(i + 1) === selMonth ? 'selected' : ''} style="background:#1e293b">${m}</option>`).join('')
 })()}
 </select>
 <select id="exp-year" onchange="updateExperienceDate()"
 class="flex-[0.6] bg-transparent border-0 border-b border-slate-700 py-2 text-slate-200 text-sm outline-none appearance-none cursor-pointer">
 ${(() => {
 const now = new Date()
 const selYear = window.spotFormData.experienceYear ?? now.getFullYear()
 const years = []
 for (let y = now.getFullYear(); y >= 2010; y--) years.push(`<option value="${y}" ${y === selYear ? 'selected' : ''} style="background:#1e293b">${y}</option>`)
 return years.join('')
 })()}
 </select></div></div>

 <!-- RETOUR + PUBLIER buttons -->
 <div class="flex gap-3 mt-6">
 <button type="button" onclick="addSpotPrevStep()"
 class="flex-1 bg-transparent border border-slate-700 text-slate-500 rounded-none p-3.5 text-sm cursor-pointer uppercase">
 ${t('back') || 'RETOUR'}
 </button>
 ${isPreview ? `
 <button type="button" onclick="closeAddSpot()"
 class="flex-[2] bg-transparent border border-amber-500 text-amber-500 rounded-none p-3.5 text-sm cursor-pointer uppercase" id="submit-spot-btn">
 ${t('previewModeClose') || 'FERMER'}
 </button>
 ` : `
 <button type="button" onclick="showSpotSummary()"
 class="flex-[2] bg-amber-500 border-0 text-[#0f1520] rounded-none p-3.5 text-sm font-semibold cursor-pointer uppercase" id="submit-spot-btn">
 ${isValidation ? (t('reviewAndSubmit') || 'VÉRIFIER ET ENVOYER') : (t('reviewAndPublish') || 'VÉRIFIER ET PUBLIER')}
 </button>
 `}
 </div></div>
 `
}

/**
 * Render offline draft button
 */
export function renderOfflineDraftButton() {
 if (navigator.onLine) return ''
 return `
 <div class="mt-3 p-3 rounded-xl bg-warning-500/10 border border-warning-500/20">
 <p class="text-sm text-warning-400 mb-2">${t('offlineMode') || 'Mode hors-ligne'}</p>
 <button type="button" onclick="saveDraftAndClose()" class="btn btn-warning btn-sm w-full">
 ${icon('save', 'w-4 h-4')} ${t('saveDraft') || 'Sauvegarder le brouillon'}
 </button></div>
 `
}

function renderPositionBlock() {
 const hasPosition = window.spotFormData?.lat && window.spotFormData?.lng
 const lat = window.spotFormData?.lat
 const lng = window.spotFormData?.lng

 return `
 <div class="mb-6">
 <div class="text-[11px] text-slate-500 uppercase tracking-wide mb-3" id="location-label">${t('position') || 'Position sur la carte'} <span class="text-amber-500">*</span></div>

 ${hasPosition ? `
 <!-- Position chosen — mini map preview + info -->
 <div onclick="openFullscreenMapPicker()" role="button" tabindex="0"
 onkeydown="if(event.key==='Enter')openFullscreenMapPicker()"
 aria-label="${t('editPosition') || 'Modifier la position'}"
 class="bg-[#111827] cursor-pointer overflow-hidden">
 <div id="addspot-mini-map" class="w-full h-[120px] bg-[#161b28]"></div>
 <div class="px-3.5 py-2.5 flex items-center gap-2.5">
 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="1.5" class="shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
 <div class="flex-1 min-w-0">
 <div class="text-[13px] text-slate-200">${escapeHTML(window.spotFormData?.locationName || '')} <span class="text-[#475569] text-[11px]">${lat?.toFixed(4) || '?'}, ${lng?.toFixed(4) || '?'}</span></div>
 ${window.spotFormData?.departureCity && window.spotFormData?.locationName && window.spotFormData.departureCity !== window.spotFormData.locationName ? `<div class="text-[11px] text-slate-400">${t('departure') || 'Départ'}: ${escapeHTML(window.spotFormData.departureCity)}</div>` : ''}
 <div class="text-[11px] text-amber-500">${t('modify') || 'Modifier la position'}</div></div></div></div>
 ` : `
 <!-- No position — map placeholder + GPS button -->
 <div onclick="openFullscreenMapPicker()" role="button" tabindex="0"
 onkeydown="if(event.key==='Enter')openFullscreenMapPicker()"
 aria-label="${t('tapToPlaceSpot') || 'Placer le spot sur la carte'}"
 class="bg-[#111827] h-[110px] flex flex-col items-center justify-center text-[#475569] text-xs gap-1.5 cursor-pointer">
 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
 ${t('tapToPlaceSpot') || 'Toucher pour placer le spot'}
 </div>
 <button type="button" onclick="useGPSForSpot()"
 class="w-full mt-2 py-2.5 bg-transparent border-0 border-b border-white/5 text-xs text-[#475569] cursor-pointer flex items-center justify-center gap-1.5"
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
 <div class="text-center pt-2">
 <span onclick="window._showGmapsTipFull()"
 class="text-[11px] text-amber-500 cursor-pointer underline" role="button" tabindex="0"
 onkeydown="if(event.key==='Enter')window._showGmapsTipFull()">
 ${t('gmapsTipLink')}
 </span></div>`
 }

 return renderGmapsTipCard()
}

export function renderAddSpot(_state) {
 const isPreview = _state.addSpotPreview === true
 const isValidation = !!_state.addSpotValidateId
 const currentStep = _state.addSpotStep || 1

 return `
 <div
 id="addspot-modal"
 class="addspot-dialog fixed inset-0 z-50 flex items-end sm:items-center justify-center"
 onclick="closeAddSpot()"
 tabindex="0"
 role="dialog"
 aria-modal="true"
 aria-labelledby="addspot-modal-title">
 <!-- Backdrop -->
 <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true"></div>

 <!-- Modal -->
 <div
 class="relative w-full max-w-lg max-h-[90vh] overflow-hidden slide-up sm:rounded-xl bg-[#0f1520] border border-[#1e293b]"
 onclick="event.stopPropagation()"
  role="button" tabindex="0">
 <!-- Header — minimal -->
 <div class="flex items-center justify-between px-5 py-4 border-b border-[#1a1f2e]">
 <h2 id="addspot-modal-title" class="text-base font-semibold text-slate-200">${isValidation ? (t('validateSpotTitle') || 'Valider ce spot') : t('addSpot')}${isPreview ? ` <span class="text-xs font-normal text-amber-500 ml-2">${t('previewMode')}</span>` : ''}</h2>
 <button
 onclick="closeAddSpot()"
 class="w-8 h-8 bg-white/5 flex items-center justify-center border-0 cursor-pointer text-slate-500"
 aria-label="${t('close') || 'Fermer'}"
 type="button"
 >
 ${icon('x', 'w-5 h-5')}
 </button></div>

 <!-- Form -->
 <div class="px-5 py-6 overflow-y-auto max-h-[calc(90vh-70px)]">
 ${renderStepProgress(currentStep)}

 <form id="add-spot-form" onsubmit="handleAddSpot(event)" aria-label="${t('addSpotForm') || "Formulaire d'ajout de spot"}" class="touch-manipulation">
 ${currentStep === 1 ? renderStep1(_state) : ''}
 ${currentStep === 2 ? renderStep2(_state) : ''}
 ${currentStep === 3 ? renderStep3(_state) : ''}
 ${currentStep >= 2 ? renderOfflineDraftButton() : ''}
 </form></div></div></div>
 `
}

export function renderGmapsTipCard() {
 return `
 <div id="gmaps-tip-card"
 class="bg-[#0f1520] border border-[#1e293b] rounded-xl p-4 mt-3.5">
 <div class="text-sm font-bold text-center mb-3.5">
 ${t('gmapsTipTitle')}
 </div>
 <div class="flex gap-2.5 mb-3.5">
 <div class="flex-1 bg-[#1a1f2e] rounded-[10px] overflow-hidden border border-red-500/20">
 <div class="bg-red-500/[0.08] p-1.5 text-center text-[10px] font-bold text-red-500 tracking-wide">
 ${t('gmapsTipManual')}
 </div>
 <div class="h-20 relative overflow-hidden bg-[#111827]">
 <img src="https://tile.openstreetmap.org/6/32/22.png"
 class="w-full h-full object-cover opacity-40"
 alt="" onerror="this.style.display='none'">
 <div class="absolute inset-0 flex items-center justify-center">
 <span class="opacity-80">${icon('search', 'w-7 h-7')}</span></div></div>
 <div class="p-2 text-center text-[10px] text-slate-400">
 ${t('gmapsTipManualDesc')}
 <div class="text-red-500 font-semibold mt-1">
 ⏱ ~2 min
 </div></div></div>
 <div class="flex-1 bg-[#1a1f2e] rounded-[10px] overflow-hidden border border-emerald-500/20">
 <div class="bg-emerald-500/[0.08] p-1.5 text-center text-[10px] font-bold text-emerald-500 tracking-wide">
 ✓ GOOGLE MAPS
 </div>
 <div class="h-20 relative overflow-hidden bg-[#111827]">
 <img src="https://tile.openstreetmap.org/14/8529/5975.png"
 class="w-full h-full object-cover opacity-50"
 alt="" onerror="this.style.display='none'">
 <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
 <svg width="18" height="24" viewBox="0 0 24 32"
 fill="#f59e0b"><path d="M12 0C5.4 0 0 5.4 0 12c0 9
 12 20 12 20s12-11 12-20C24 5.4 18.6 0 12 0z"/></svg></div></div>
 <div class="p-2 text-center text-[10px] text-slate-400">
 ${t('gmapsTipShareDesc')}
 <div class="text-emerald-500 font-semibold mt-1">
 ⏱ 3 sec
 </div></div></div></div>
 <div class="text-center text-xs text-slate-400 mb-3">
 ${t('gmapsTipHowTo')}
 </div>
 <label class="flex items-center gap-2 text-xs text-slate-500 cursor-pointer justify-center"
 onclick="event.stopPropagation()">
 <input type="checkbox"
 onchange="window._dismissGmapsTip(this.checked)"
 class="accent-amber-500 w-3.5 h-3.5">
 ${t('gmapsTipDismiss')}
 </label></div>`
}
