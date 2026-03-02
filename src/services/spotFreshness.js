/**
 * Spot Freshness/Reliability Service
 * Color-coded tier system based on validations + tests
 *
 * Tiers (based on validationCount + testCount):
 *   - Grey (#94a3b8): Unverified (0 validations, HitchWiki import)
 *   - Green (#10b981): Reliable (3+ testCount AND 3+ validationCount)
 *   - Gold (#fbbf24): Gold Spot (10+ testCount AND 10+ validationCount)
 *
 * Overlays:
 *   - Crown (👑): ambassadorVerified = true
 *   - Station (red #ef4444): spotType === 'gas_station'
 *
 * Freshness (age without new validation):
 *   - < 1 year: Nouveau / New
 *   - 1-3 years: Ancien / Old
 *   - 3-5 years: Historique / Historic
 *   - > 5 years: auto-deleted (handled in spotLoader)
 */

import { t } from '../i18n/index.js'
import { icon } from '../utils/icons.js'

/**
 * Get spot tier based on validationCount + testCount
 * @param {Object} spot - Spot object
 * @returns {Object} { tier, color, hexColor, labelKey, icon, bgClass, textClass, borderClass, isCertified, isStation }
 */
export function getSpotFreshness(spot) {
  if (!spot) {
    return {
      tier: 'grey',
      color: 'slate',
      hexColor: '#94a3b8',
      labelKey: 'spotStatusBasic',
      icon: 'help-circle',
      bgClass: 'bg-slate-500/20',
      textClass: 'text-slate-400',
      borderClass: 'border-slate-500/30',
      isCertified: false,
      isStation: false,
    }
  }

  const validationCount = spot.validationCount || spot.userValidations || 0
  const testCount = spot.testCount || 0
  const isCertified = spot.ambassadorVerified === true
  const isStation = spot.spotType === 'gas_station'

  // GOLD: 10+ tests AND 10+ validations
  if (testCount >= 10 && validationCount >= 10) {
    return {
      tier: 'gold',
      color: 'amber',
      hexColor: '#fbbf24',
      labelKey: isCertified ? 'spotStatusGoldCertified' : 'spotStatusGold',
      icon: 'trophy',
      bgClass: 'bg-amber-500/20',
      textClass: 'text-amber-400',
      borderClass: 'border-amber-500/30',
      isCertified,
      isStation,
    }
  }

  // GREEN: 3+ tests AND 3+ validations
  if (testCount >= 3 && validationCount >= 3) {
    return {
      tier: 'green',
      color: 'emerald',
      hexColor: '#10b981',
      labelKey: isCertified ? 'spotStatusReliableCertified' : 'spotStatusReliable',
      icon: 'circle-check',
      bgClass: 'bg-emerald-500/20',
      textClass: 'text-emerald-400',
      borderClass: 'border-emerald-500/30',
      isCertified,
      isStation,
    }
  }

  // GREY: Unverified (default)
  return {
    tier: 'grey',
    color: 'slate',
    hexColor: '#94a3b8',
    labelKey: isCertified ? 'spotStatusCertified' : 'spotStatusBasic',
    icon: isCertified ? 'badge-check' : 'help-circle',
    bgClass: 'bg-slate-500/20',
    textClass: 'text-slate-400',
    borderClass: 'border-slate-500/30',
    isCertified,
    isStation,
  }
}

/**
 * Get spot age/freshness status
 * @param {Object} spot - Spot object
 * @returns {Object} { labelKey, icon, bgClass, textClass, borderClass }
 */
export function getSpotAge(spot) {
  const lastDate = spot?.lastTested || spot?.lastValidated || spot?.lastCheckin || spot?.lastUsed || spot?.createdAt
  if (!lastDate) {
    return { labelKey: 'unknownAge', icon: 'clock', bgClass: 'bg-slate-500/20', textClass: 'text-slate-400', borderClass: 'border-slate-500/30' }
  }

  const now = new Date()
  const spotDate = new Date(lastDate)
  const diffMs = now - spotDate
  const diffYears = diffMs / (1000 * 60 * 60 * 24 * 365.25)

  if (diffYears < 1) {
    return { labelKey: 'freshSpot', icon: 'sparkles', bgClass: 'bg-emerald-500/20', textClass: 'text-emerald-400', borderClass: 'border-emerald-500/30' }
  }
  if (diffYears < 3) {
    return { labelKey: 'agingSpot', icon: 'clock', bgClass: 'bg-yellow-500/20', textClass: 'text-yellow-400', borderClass: 'border-yellow-500/30' }
  }
  if (diffYears < 5) {
    return { labelKey: 'oldSpot', icon: 'archive', bgClass: 'bg-orange-500/20', textClass: 'text-orange-400', borderClass: 'border-orange-500/30' }
  }
  return { labelKey: 'oldSpot', icon: 'archive', bgClass: 'bg-red-500/20', textClass: 'text-red-400', borderClass: 'border-red-500/30' }
}

/**
 * Render reliability badge HTML with crown + station overlay
 * @param {Object} spot - Spot object
 * @param {string} size - Badge size: 'sm', 'md', 'lg'
 * @returns {string} HTML string for the badge
 */
export function renderFreshnessBadge(spot, size = 'md') {
  const freshness = getSpotFreshness(spot)
  const label = t(freshness.labelKey) || freshness.labelKey

  const sizes = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-xs px-2 py-1',
    lg: 'text-sm px-3 py-1.5'
  }

  const iconSizes = {
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  }

  const validations = (spot?.validationCount || spot?.userValidations || 0) + (spot?.testCount || 0)
  const countText = validations > 0 ? ` (${validations})` : ''
  const crownHtml = freshness.isCertified ? ' 👑' : ''

  let html = `
    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${sizes[size]} font-medium ${freshness.bgClass} ${freshness.textClass} border ${freshness.borderClass}">
      ${icon(freshness.icon, `${iconSizes[size]}`)}
      <span>${label}${countText}${crownHtml}</span>
    </span>
  `

  // Station overlay badge
  if (freshness.isStation) {
    html += `
      <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${sizes[size]} font-medium bg-red-500/20 text-red-400 border border-red-500/30">
        ⛽ <span>${t('spotStation') || 'Station'}</span>
      </span>
    `
  }

  return html
}

/**
 * Render age badge HTML
 * @param {Object} spot - Spot object
 * @param {string} size - Badge size: 'sm', 'md', 'lg'
 * @returns {string}
 */
export function renderAgeBadge(spot, size = 'sm') {
  const age = getSpotAge(spot)
  const label = t(age.labelKey) || age.labelKey

  const sizes = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-xs px-2 py-1',
    lg: 'text-sm px-3 py-1.5'
  }

  const iconSizes = {
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  }

  return `
    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${sizes[size]} font-medium ${age.bgClass} ${age.textClass} border ${age.borderClass}">
      ${icon(age.icon, `${iconSizes[size]}`)}
      <span>${label}</span>
    </span>
  `
}

/**
 * Get hex color for marker tinting
 * Returns the tier color (grey/green/gold) — station overlay is handled separately on map
 * @param {Object} spot - Spot object
 * @returns {string} Hex color code
 */
export function getFreshnessColor(spot) {
  const freshness = getSpotFreshness(spot)
  return freshness.hexColor || '#94a3b8'
}

/**
 * Check if spot is a gas station (for map layer)
 * @param {Object} spot - Spot object
 * @returns {boolean}
 */
export function isGasStation(spot) {
  return spot?.spotType === 'gas_station'
}

export default {
  getSpotFreshness,
  getSpotAge,
  renderFreshnessBadge,
  renderAgeBadge,
  getFreshnessColor,
  isGasStation,
}
