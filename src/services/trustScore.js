/**
 * Trust Score Service — v2 (Score /10, 3 piliers)
 * Calculates and displays user reliability scores
 */

import { getState, setState } from '../stores/state.js'
import { t } from '../i18n/index.js'
import { icon } from '../utils/icons.js'

// Trust score tiers (score /10)
export const TRUST_TIERS = {
  nouveau: { min: 0, max: 3, label: () => t('trustNew') || 'Nouveau', color: 'slate', icon: 'user' },
  progression: { min: 4, max: 5, label: () => t('trustProgressing') || 'En progression', color: 'blue', icon: 'trending-up' },
  fiable: { min: 6, max: 7, label: () => t('trustReliable') || 'Fiable', color: 'emerald', icon: 'user-check' },
  excellent: { min: 8, max: 10, label: () => t('trustExcellent') || 'Excellent', color: 'amber', icon: 'award' },
}

// Color classes per tier
const TIER_COLORS = {
  slate: { text: 'text-slate-400', bg: 'bg-slate-500/20', fill: 'bg-slate-500', ring: 'ring-slate-400', hex: '#94a3b8' },
  blue: { text: 'text-blue-400', bg: 'bg-blue-500/20', fill: 'bg-blue-500', ring: 'ring-blue-400', hex: '#60a5fa' },
  emerald: { text: 'text-emerald-400', bg: 'bg-emerald-500/20', fill: 'bg-emerald-500', ring: 'ring-emerald-400', hex: '#34d399' },
  amber: { text: 'text-amber-400', bg: 'bg-amber-500/20', fill: 'bg-amber-500', ring: 'ring-amber-400', hex: '#fbbf24' },
}

/**
 * Calculate trust score for a user (3 pillars, max 10)
 * @param {Object} userStats - User statistics
 * @returns {Object} Trust score details
 */
export function calculateTrustScore(userStats = {}) {
  const state = getState()

  // Read localStorage data
  const ls = typeof localStorage !== 'undefined' ? localStorage : null
  const profilePhotos = ls ? JSON.parse(ls.getItem('spothitch_profile_photos') || '[]') : []

  const stats = {
    emailVerified: userStats.emailVerified ?? state.emailVerified ?? false,
    phoneVerified: userStats.phoneVerified ?? state.phoneVerified ?? false,
    hasProfilePhoto: userStats.hasProfilePhoto ?? profilePhotos.length > 0,
    idVerified: userStats.idVerified ?? state.idVerified ?? false,
    positiveReviews: userStats.positiveReviews ?? state.positiveVotes ?? 0,
    spotsValidated: userStats.spotsValidated ?? state.verifiedSpots ?? 0,
    accountAge: userStats.accountAge ?? getDaysSinceCreation(state.createdAt),
    reportCount: userStats.reportCount ?? state.reportCount ?? 0,
    spotsTested: userStats.spotsTested ?? (state.reviewsGiven || 0) + (state.totalCheckIns || 0),
    activeMonths: userStats.activeMonths ?? getActiveMonths(state.createdAt),
  }

  // ── Pillar 1: Identity (max 5) ──
  const identityEmail = stats.emailVerified ? 0.5 : 0
  const identityPhone = stats.phoneVerified ? 1 : 0
  const identityPhoto = stats.hasProfilePhoto ? 0.5 : 0
  const identityId = stats.idVerified ? 3 : 0
  const pillarIdentity = Math.min(5, identityEmail + identityPhone + identityPhoto + identityId)

  // ── Pillar 2: Reputation (max 3) ──
  const repReviews = Math.min(1, stats.positiveReviews / 10) // up to 10+ reviews = 1pt
  const repSpots = Math.min(1, stats.spotsValidated / 5)     // up to 5+ validated = 1pt
  const repSeniority = (stats.accountAge >= 180 && stats.reportCount === 0) ? 1 : 0 // 6m+ & 0 reports
  const pillarReputation = Math.min(3, repReviews + repSpots + repSeniority)

  // ── Pillar 3: Activity (max 2) ──
  const actSpots = Math.min(1, stats.spotsTested / 10)       // up to 10+ tested/reviewed = 1pt
  const actRegularity = stats.activeMonths >= 3 ? 1 : 0      // active 3+ months
  const pillarActivity = Math.min(2, actSpots + actRegularity)

  // ── Total (capped at 10, capped at 7 without paid ID) ──
  let totalRaw = pillarIdentity + pillarReputation + pillarActivity
  const maxWithoutId = 7
  if (!stats.idVerified) {
    totalRaw = Math.min(totalRaw, maxWithoutId)
  }
  const score = Math.min(10, Math.round(totalRaw * 10) / 10)

  // Get tier
  const tier = getTierForScore(score)

  return {
    score,
    tier,
    isIdVerified: stats.idVerified,
    breakdown: {
      identity: {
        total: pillarIdentity,
        max: 5,
        details: {
          email: identityEmail,
          phone: identityPhone,
          photo: identityPhoto,
          id: identityId,
        },
      },
      reputation: {
        total: pillarReputation,
        max: 3,
        details: {
          reviews: repReviews,
          spots: repSpots,
          seniority: repSeniority,
        },
      },
      activity: {
        total: pillarActivity,
        max: 2,
        details: {
          spotsTested: actSpots,
          regularity: actRegularity,
        },
      },
    },
    stats,
  }
}

/**
 * Get days since account creation
 */
function getDaysSinceCreation(createdAt) {
  if (!createdAt) return 30 // Default to 30 days if unknown
  const created = new Date(createdAt)
  const now = new Date()
  return Math.floor((now - created) / (1000 * 60 * 60 * 24))
}

/**
 * Get number of active months (rough estimate)
 */
function getActiveMonths(createdAt) {
  if (!createdAt) return 1
  const created = new Date(createdAt)
  const now = new Date()
  return Math.max(1, Math.floor((now - created) / (1000 * 60 * 60 * 24 * 30)))
}

/**
 * Get tier for a given score (0-10)
 */
export function getTierForScore(score) {
  for (const [key, tier] of Object.entries(TRUST_TIERS)) {
    if (score >= tier.min && score <= tier.max) {
      const colors = TIER_COLORS[tier.color]
      return { id: key, ...tier, label: tier.label(), ...colors }
    }
  }
  const fallback = TRUST_TIERS.nouveau
  const colors = TIER_COLORS[fallback.color]
  return { id: 'nouveau', ...fallback, label: fallback.label(), ...colors }
}

/**
 * Get current user's trust score
 */
export function getUserTrustScore() {
  return calculateTrustScore()
}

/**
 * Update user trust factors (call after relevant actions)
 */
export function updateTrustFactors(factors) {
  const state = getState()
  setState({
    ...state,
    ...factors,
  })
}

/**
 * Render trust score circle with color
 * @param {number} score - Trust score (0-10)
 * @param {string} size - 'sm' | 'md' | 'lg'
 */
export function renderTrustScoreCircle(score, size = 'md') {
  const tier = getTierForScore(score)
  const circumference = 2 * Math.PI * 16 // radius 16
  const offset = circumference - (score / 10) * circumference

  const sizes = {
    sm: { w: 'w-8 h-8', text: 'text-xs', svg: 36 },
    md: { w: 'w-12 h-12', text: 'text-sm', svg: 48 },
    lg: { w: 'w-16 h-16', text: 'text-lg', svg: 64 },
  }
  const s = sizes[size] || sizes.md

  return `
    <div class="relative inline-flex items-center justify-center ${s.w}" title="${tier.label} (${score}/10)">
      <svg class="absolute inset-0" viewBox="0 0 ${s.svg} ${s.svg}" width="${s.svg}" height="${s.svg}">
        <circle cx="${s.svg / 2}" cy="${s.svg / 2}" r="16" fill="none" stroke="currentColor" stroke-width="3" class="text-white/10" />
        <circle cx="${s.svg / 2}" cy="${s.svg / 2}" r="16" fill="none" stroke="${tier.hex}" stroke-width="3"
          stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"
          stroke-linecap="round" transform="rotate(-90 ${s.svg / 2} ${s.svg / 2})" />
      </svg>
      <span class="${s.text} font-bold ${tier.text}">${score}</span>
    </div>
  `
}

/**
 * Render verified checkmark (blue check)
 * @param {boolean} isIdVerified
 */
export function renderVerifiedCheckmark(isIdVerified) {
  if (!isIdVerified) return ''
  return `<span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white ml-1" title="${t('trustVerifiedBadge') || 'Identité vérifiée'}">
    ${icon('check', 'w-3 h-3')}
  </span>`
}

/**
 * Render trust score badge (pill)
 * @param {number} score - Trust score (0-10)
 * @param {string} size - 'sm' | 'md' | 'lg'
 */
export function renderTrustBadge(score, size = 'md') {
  const tier = getTierForScore(score)

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2',
  }

  return `
    <span class="inline-flex items-center gap-1.5 rounded-full ${tier.bg} ${tier.text} ${sizes[size]} font-medium">
      ${icon(tier.icon, 'w-5 h-5')}
      <span>${tier.label}</span>
      <span class="opacity-70">${score}/10</span>
    </span>
  `
}

/**
 * Render detailed trust score card (3 pillars)
 */
export function renderTrustScoreCard() {
  const { score, tier, breakdown, isIdVerified } = calculateTrustScore()

  return `
    <div class="trust-score-card card p-4">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4 gap-3">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-10 h-10 rounded-full ${tier.bg} flex items-center justify-center shrink-0">
            ${icon(tier.icon, `w-5 h-5 ${tier.text}`)}
          </div>
          <div class="min-w-0">
            <div class="font-bold ${tier.text} flex items-center gap-1">
              ${tier.label}
              ${renderVerifiedCheckmark(isIdVerified)}
            </div>
            <div class="text-xs text-slate-400">${t('trustScore') || 'Score de confiance'}</div>
          </div>
        </div>
        <div class="text-right shrink-0">
          ${renderTrustScoreCircle(score, 'lg')}
        </div>
      </div>

      <!-- 3 Pillars -->
      <div class="space-y-3 mb-4">
        ${renderPillar(
          t('trustPillarIdentity') || 'Identité',
          breakdown.identity.total,
          breakdown.identity.max,
          'shield',
          'blue',
          [
            { label: t('trustEmailVerified') || 'Email vérifié', value: breakdown.identity.details.email, max: 0.5 },
            { label: t('trustPhoneVerified') || 'Téléphone vérifié', value: breakdown.identity.details.phone, max: 1 },
            { label: t('trustPhotoProfile') || 'Photo de profil', value: breakdown.identity.details.photo, max: 0.5 },
            { label: t('trustIdVerified') || 'ID payante vérifiée', value: breakdown.identity.details.id, max: 3, highlight: true },
          ]
        )}
        ${renderPillar(
          t('trustPillarReputation') || 'Réputation',
          breakdown.reputation.total,
          breakdown.reputation.max,
          'star',
          'emerald',
          [
            { label: t('trustPositiveReviews') || 'Avis positifs reçus', value: breakdown.reputation.details.reviews, max: 1 },
            { label: t('trustSpotsValidated') || 'Spots validés', value: breakdown.reputation.details.spots, max: 1 },
            { label: t('trustSeniority') || 'Ancienneté + zéro signalement', value: breakdown.reputation.details.seniority, max: 1 },
          ]
        )}
        ${renderPillar(
          t('trustPillarActivity') || 'Activité',
          breakdown.activity.total,
          breakdown.activity.max,
          'activity',
          'amber',
          [
            { label: t('trustSpotsTestedReviews') || 'Spots testés / avis laissés', value: breakdown.activity.details.spotsTested, max: 1 },
            { label: t('trustRegularity') || 'Régularité (3+ mois)', value: breakdown.activity.details.regularity, max: 1 },
          ]
        )}
      </div>

      <!-- Improve tips -->
      ${score < 8 ? `
        <div class="p-3 rounded-xl bg-primary-500/10 border border-primary-500/30">
          <h4 class="font-medium text-sm text-primary-400 mb-2 flex items-center gap-1">
            ${icon('lightbulb', 'w-4 h-4')}
            ${t('trustImproveScore') || 'Améliore ton score'}
          </h4>
          <ul class="text-xs text-slate-400 space-y-1">
            ${!isIdVerified ? `<li class="flex items-center gap-1">${icon('arrow-right', 'w-3 h-3 text-blue-400')} <span class="text-blue-300 font-medium">${t('trustGetVerified') || 'Vérifie ton identité (+3 points)'}</span></li>` : ''}
            ${breakdown.identity.details.email === 0 ? `<li>• ${t('trustEmailVerified') || 'Vérifie ton email'} (+0.5)</li>` : ''}
            ${breakdown.identity.details.phone === 0 ? `<li>• ${t('trustPhoneVerified') || 'Vérifie ton téléphone'} (+1)</li>` : ''}
            ${breakdown.reputation.details.reviews < 1 ? `<li>• ${t('trustPositiveReviews') || 'Reçois des avis positifs'}</li>` : ''}
            ${breakdown.activity.details.spotsTested < 1 ? `<li>• ${t('trustSpotsTestedReviews') || 'Teste des spots et laisse des avis'}</li>` : ''}
          </ul>
          ${!isIdVerified ? `
            <div class="mt-2 text-xs text-slate-500">${t('trustMaxWithoutId') || 'Sans vérification d\'identité, le score maximum est 7/10'}</div>
          ` : ''}
        </div>
      ` : ''}
    </div>
  `
}

/**
 * Render a single pillar section
 */
function renderPillar(name, total, max, iconName, colorName, factors) {
  const pct = Math.round((total / max) * 100)
  const colorMap = {
    blue: { bar: 'bg-blue-500', text: 'text-blue-400' },
    emerald: { bar: 'bg-emerald-500', text: 'text-emerald-400' },
    amber: { bar: 'bg-amber-500', text: 'text-amber-400' },
  }
  const c = colorMap[colorName] || colorMap.blue

  return `
    <details class="group">
      <summary class="flex items-center gap-3 cursor-pointer list-none">
        <div class="w-6 text-center">${icon(iconName, `w-4 h-4 ${c.text}`)}</div>
        <div class="flex-1 min-w-0">
          <div class="flex justify-between text-xs mb-1">
            <span class="text-slate-300 font-medium">${name}</span>
            <span class="${c.text} font-bold">${Math.round(total * 10) / 10}/${max}</span>
          </div>
          <div class="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div class="h-full ${c.bar} rounded-full transition-all" style="width: ${pct}%"></div>
          </div>
        </div>
        ${icon('chevron-down', 'w-4 h-4 text-slate-500 group-open:rotate-180 transition-transform')}
      </summary>
      <div class="pl-9 pt-2 space-y-1">
        ${factors.map(f => {
          return `
            <div class="flex items-center gap-2 text-xs">
              <div class="w-3 h-3 rounded-full ${f.value >= f.max ? c.bar : 'bg-white/10'} flex items-center justify-center">
                ${f.value >= f.max ? icon('check', 'w-2 h-2 text-white') : ''}
              </div>
              <span class="${f.value >= f.max ? 'text-slate-300' : 'text-slate-500'} ${f.highlight ? 'font-medium' : ''}">${f.label}</span>
              <span class="ml-auto text-slate-500">${Math.round(f.value * 10) / 10}/${f.max}</span>
            </div>
          `
        }).join('')}
      </div>
    </details>
  `
}

/**
 * Render mini trust badge for user avatars
 * @param {number} score - Trust score (0-10)
 * @param {boolean} isIdVerified - If paid ID is verified
 */
export function renderMiniTrustBadge(score, isIdVerified = false) {
  const tier = getTierForScore(score)

  return `
    <div class="inline-flex items-center gap-1">
      <span class="inline-flex items-center gap-0.5 rounded-full ${tier.bg} ${tier.text} text-[10px] px-1.5 py-0.5 font-bold" title="${tier.label} (${score}/10)">
        ${score}/10
      </span>
      ${isIdVerified ? `<span class="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-500 text-white" title="${t('trustVerifiedBadge') || 'Identité vérifiée'}">${icon('check', 'w-2.5 h-2.5')}</span>` : ''}
    </div>
  `
}

// Global handlers
window.getUserTrustScore = getUserTrustScore
window.showTrustDetails = () => {
  window.setState?.({ showTrustDetails: true })
}

export default {
  TRUST_TIERS,
  calculateTrustScore,
  getTierForScore,
  getUserTrustScore,
  updateTrustFactors,
  renderTrustBadge,
  renderTrustScoreCard,
  renderMiniTrustBadge,
  renderTrustScoreCircle,
  renderVerifiedCheckmark,
}
