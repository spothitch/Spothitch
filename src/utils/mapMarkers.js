/**
 * Map Marker Generator — Style 4
 * "Split net + couronne 3 pointes + anneau fin doré"
 *
 * 8 marker types:
 *   marker-gray            — Non validé (0 validations)
 *   marker-gray-station    — Non validé + station-service (split gris/rouge)
 *   marker-gray-gold       — Certifié ambassadeur (non validé)
 *   marker-green           — Validé (3+ validations)
 *   marker-green-station   — Validé + station-service (split vert/rouge)
 *   marker-green-gold      — Certifié ambassadeur + validé
 *   marker-green-gold-station — Certifié + validé + station
 *   marker-fav             — Favori utilisateur (ambre)
 *
 * NOTE: Le rouge = station-service, PAS dangereux.
 * Les spots dangereux sont vérifiés par admin et supprimés.
 */

const C = {
  gray: '#94a3b8',
  green: '#22c55e',
  red: '#ef4444',
  gold: '#fbbf24',
  amber: '#f59e0b',
  goldStroke: '#fbbf24',
  white: '#ffffff',
}

// ── SVG builders ──────────────────────────────────────────────

/** Simple circle marker — renders at 28×28 CSS px (56px canvas / pixelRatio 2) */
function circleSvg(fill, stroke = C.white, sw = 1.5) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 20 20">
<circle cx="10" cy="10" r="7" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>
</svg>`
}

/** Split half/half circle marker — same size as simple circle */
function splitSvg(leftFill, rightFill) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 20 20">
<defs><clipPath id="L"><rect x="0" y="0" width="10" height="20"/></clipPath>
<clipPath id="R"><rect x="10" y="0" width="10" height="20"/></clipPath></defs>
<circle cx="10" cy="10" r="7" fill="${leftFill}" clip-path="url(#L)"/>
<circle cx="10" cy="10" r="7" fill="${rightFill}" clip-path="url(#R)"/>
<circle cx="10" cy="10" r="7" fill="none" stroke="${C.white}" stroke-width="1.5"/>
</svg>`
}

/** Gold marker: crown 3 pointes + anneau fin + circle — larger (36×34 CSS px) */
function goldSvg(fill) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="72" height="68" viewBox="0 0 24 22">
<path d="M7 7 L9 3 L12 6.5 L15 2 L17 7" fill="none" stroke="${C.gold}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="12" cy="13" r="7.5" fill="none" stroke="${C.gold}" stroke-width="1"/>
<circle cx="12" cy="13" r="5.5" fill="${fill}" stroke="${C.white}" stroke-width="1.5"/>
</svg>`
}

/** Gold + station: crown + anneau + split circle — larger (36×34 CSS px) */
function goldStationSvg(leftFill, rightFill) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="72" height="68" viewBox="0 0 24 22">
<defs><clipPath id="GL"><rect x="0" y="0" width="12" height="24"/></clipPath>
<clipPath id="GR"><rect x="12" y="0" width="12" height="24"/></clipPath></defs>
<path d="M7 7 L9 3 L12 6.5 L15 2 L17 7" fill="none" stroke="${C.gold}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="12" cy="13" r="7.5" fill="none" stroke="${C.gold}" stroke-width="1"/>
<circle cx="12" cy="13" r="5.5" fill="${leftFill}" clip-path="url(#GL)"/>
<circle cx="12" cy="13" r="5.5" fill="${rightFill}" clip-path="url(#GR)"/>
<circle cx="12" cy="13" r="5.5" fill="none" stroke="${C.white}" stroke-width="1.5"/>
</svg>`
}

/** Favorite marker: amber circle, gold stroke — slightly larger */
function favSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 20 20">
<circle cx="10" cy="10" r="7.5" fill="${C.amber}" stroke="${C.goldStroke}" stroke-width="2"/>
</svg>`
}

// ── Marker registry ───────────────────────────────────────────

const MARKERS = {
  'marker-gray': () => circleSvg(C.gray),
  'marker-gray-station': () => splitSvg(C.gray, C.red),
  'marker-gray-gold': () => goldSvg(C.gray),
  'marker-green': () => circleSvg(C.green),
  'marker-green-station': () => splitSvg(C.green, C.red),
  'marker-green-gold': () => goldSvg(C.green),
  'marker-green-gold-station': () => goldStationSvg(C.green, C.red),
  'marker-fav': favSvg,
}

/** Load SVG string as HTMLImageElement */
function svgToImage(svgString) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const blob = new Blob([svgString], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = reject
    img.src = url
  })
}

/**
 * Register all marker images on a MapLibre map instance.
 * Call once after map style is loaded.
 */
export async function registerMarkerImages(map) {
  const entries = Object.entries(MARKERS)
  await Promise.all(entries.map(async ([name, svgFn]) => {
    if (map.hasImage(name)) return
    const img = await svgToImage(svgFn())
    map.addImage(name, img, { pixelRatio: 2 })
  }))
}

/**
 * Determine the marker image name for a spot.
 * @param {Object} spot — Spot data object
 * @param {boolean} isFav — Is this a user favorite?
 * @returns {string} Marker image name (e.g. 'marker-gray', 'marker-green-gold')
 */
export function getMarkerType(spot, isFav) {
  if (isFav) return 'marker-fav'

  const validated = (spot.userValidations || 0) >= 3
  const isStation = spot.spotType === 'station'
  const isGold = spot.ambassadorVerified === true

  if (validated && isGold && isStation) return 'marker-green-gold-station'
  if (validated && isGold) return 'marker-green-gold'
  if (validated && isStation) return 'marker-green-station'
  if (validated) return 'marker-green'
  if (isGold && isStation) return 'marker-gray-gold'
  if (isGold) return 'marker-gray-gold'
  if (isStation) return 'marker-gray-station'
  return 'marker-gray'
}

/**
 * Build legend HTML overlay content.
 * Uses inline SVG matching the actual marker images.
 * @param {Function} t — i18n translation function
 * @returns {string} HTML string
 */
export function buildLegendHTML(t) {
  const row = (svg, label) =>
    `<div class="flex items-center gap-2 py-0.5"><div class="flex-shrink-0 w-5 flex justify-center">${svg}</div><span class="text-xs">${label}</span></div>`

  // Inline SVGs at display size (smaller for legend)
  const c = (fill, stroke = '#fff', sw = 1.5) =>
    `<svg width="14" height="14" viewBox="0 0 20 20"><circle cx="10" cy="10" r="6.5" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/></svg>`
  const sp = (l, r) =>
    `<svg width="14" height="14" viewBox="0 0 20 20"><defs><clipPath id="lL"><rect x="0" y="0" width="10" height="20"/></clipPath><clipPath id="lR"><rect x="10" y="0" width="10" height="20"/></clipPath></defs><circle cx="10" cy="10" r="6.5" fill="${l}" clip-path="url(#lL)"/><circle cx="10" cy="10" r="6.5" fill="${r}" clip-path="url(#lR)"/><circle cx="10" cy="10" r="6.5" fill="none" stroke="#fff" stroke-width="1.5"/></svg>`
  const g = (fill) =>
    `<svg width="18" height="17" viewBox="0 0 24 22"><path d="M7 7 L9 3 L12 6.5 L15 2 L17 7" fill="none" stroke="#fbbf24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="13" r="7.5" fill="none" stroke="#fbbf24" stroke-width="1"/><circle cx="12" cy="13" r="5.5" fill="${fill}" stroke="#fff" stroke-width="1.5"/></svg>`
  const gs = (l, r) =>
    `<svg width="18" height="17" viewBox="0 0 24 22"><defs><clipPath id="lgL"><rect x="0" y="0" width="12" height="24"/></clipPath><clipPath id="lgR"><rect x="12" y="0" width="12" height="24"/></clipPath></defs><path d="M7 7 L9 3 L12 6.5 L15 2 L17 7" fill="none" stroke="#fbbf24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="13" r="7.5" fill="none" stroke="#fbbf24" stroke-width="1"/><circle cx="12" cy="13" r="5.5" fill="${l}" clip-path="url(#lgL)"/><circle cx="12" cy="13" r="5.5" fill="${r}" clip-path="url(#lgR)"/><circle cx="12" cy="13" r="5.5" fill="none" stroke="#fff" stroke-width="1.5"/></svg>`

  return `
<div class="text-xs font-bold mb-1.5">${t('mapLegend') || 'Légende'}</div>
${row(c('#94a3b8'), t('unverifiedSpot') || 'Non vérifié')}
${row(sp('#94a3b8', '#ef4444'), (t('unverifiedSpot') || 'Non vérifié') + ' + ' + (t('gasStation') || 'Station'))}
${row(g('#94a3b8'), (t('ambassadorVerified') || 'Certifié') + ' (' + (t('unverifiedSpot') || 'non vérifié').toLowerCase() + ')')}
${row(c('#22c55e'), t('reliableSpot') || 'Validé')}
${row(sp('#22c55e', '#ef4444'), (t('reliableSpot') || 'Validé') + ' + ' + (t('gasStation') || 'Station'))}
${row(g('#22c55e'), (t('ambassadorVerified') || 'Certifié') + ' + ' + (t('reliableSpot') || 'validé').toLowerCase())}
${row(gs('#22c55e', '#ef4444'), (t('ambassadorVerified') || 'Certifié') + ' + ' + (t('gasStation') || 'station').toLowerCase())}
${row(c('#f59e0b', '#fbbf24', 2), t('favorite') || 'Favori')}
`
}

export default { registerMarkerImages, getMarkerType, buildLegendHTML }
