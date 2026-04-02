/**
 * Tests for Spot Freshness/Reliability Service
 * New system: 3 tiers (grey/green/gold) + crown + station overlay
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { getSpotFreshness, getSpotAge, renderFreshnessBadge, renderAgeBadge, getFreshnessColor, isGasStation, getMarkerIcon } from '../src/services/spotFreshness.js'
import { setState } from '../src/stores/state.js'

describe('spotFreshness', () => {
  beforeEach(() => {
    setState({ lang: 'fr' })
  })

  describe('getSpotFreshness — 3-tier system', () => {
    it('should return SLATE for null spot', () => {
      const result = getSpotFreshness(null)
      expect(result.color).toBe('slate')
      expect(result.tier).toBe('grey')
      expect(result.labelKey).toBe('spotStatusToVerify')
      expect(result.icon).toBe('help-circle')
    })

    it('should return BLUE tier for spot with no tests', () => {
      const spot = { validationCount: 0, testCount: 0 }
      const result = getSpotFreshness(spot)
      expect(result.tier).toBe('blue')
      expect(result.color).toBe('blue')
      expect(result.hexColor).toBe('#3b82f6')
      expect(result.labelKey).toBe('spotStatusSpotHitch')
    })

    it('should return BLUE for community spot without enough tests', () => {
      const spot = { validationCount: 0, testCount: 0 }
      const result = getSpotFreshness(spot)
      expect(result.tier).toBe('blue')
      expect(result.color).toBe('blue')
      expect(result.hexColor).toBe('#3b82f6')
      expect(result.labelKey).toBe('spotStatusSpotHitch')
    })

    it('should return BLUE for spot with 1 test', () => {
      const spot = { validationCount: 0, liveTestCount: 1 }
      const result = getSpotFreshness(spot)
      expect(result.tier).toBe('blue')
    })

    it('should return BLUE for community spot with only validations (no tests)', () => {
      const spot = { validationCount: 5, liveTestCount: 0 }
      const result = getSpotFreshness(spot)
      expect(result.tier).toBe('blue')
    })

    it('should use legacy userValidations as fallback for validationCount', () => {
      const spot = { userValidations: 5, liveTestCount: 5 }
      const result = getSpotFreshness(spot)
      expect(result.tier).toBe('green')
    })

    it('should return GREEN tier for 3+ liveTestCount AND 3+ validations', () => {
      const spot = { validationCount: 3, liveTestCount: 3 }
      const result = getSpotFreshness(spot)
      expect(result.tier).toBe('green')
      expect(result.color).toBe('emerald')
      expect(result.hexColor).toBe('#10b981')
      expect(result.labelKey).toBe('spotStatusReliable')
      expect(result.icon).toBe('circle-check')
    })

    it('should return GREEN for 5 liveTestCount AND 5 validations', () => {
      const spot = { validationCount: 5, liveTestCount: 5 }
      const result = getSpotFreshness(spot)
      expect(result.tier).toBe('green')
    })

    it('should return GOLD tier for 10+ liveTestCount AND 10+ validations', () => {
      const spot = { validationCount: 10, liveTestCount: 10 }
      const result = getSpotFreshness(spot)
      expect(result.tier).toBe('gold')
      expect(result.color).toBe('amber')
      expect(result.hexColor).toBe('#fbbf24')
      expect(result.labelKey).toBe('spotStatusGoldCertified')
      expect(result.icon).toBe('trophy')
    })

    it('should return GOLD for 20+ each', () => {
      const spot = { validationCount: 20, liveTestCount: 20 }
      const result = getSpotFreshness(spot)
      expect(result.tier).toBe('gold')
    })

    it('should include all CSS classes', () => {
      const spot = { validationCount: 3, liveTestCount: 3 }
      const result = getSpotFreshness(spot)
      expect(result.bgClass).toBeDefined()
      expect(result.textClass).toBeDefined()
      expect(result.borderClass).toBeDefined()
    })
  })

  describe('Crown overlay (ambassadorVerified)', () => {
    it('should set isCertified for blue spot with ambassador', () => {
      const spot = { ambassadorVerified: true, validationCount: 0, liveTestCount: 0 }
      const result = getSpotFreshness(spot)
      expect(result.tier).toBe('blue')
      expect(result.isCertified).toBe(true)
    })

    it('should set isCertified for green spot', () => {
      const spot = { ambassadorVerified: true, validationCount: 5, liveTestCount: 5 }
      const result = getSpotFreshness(spot)
      expect(result.tier).toBe('green')
      expect(result.isCertified).toBe(true)
      expect(result.labelKey).toBe('spotStatusReliableCertified')
    })

    it('should set isCertified for gold spot (with ambassador)', () => {
      const spot = { ambassadorVerified: true, validationCount: 15, liveTestCount: 15 }
      const result = getSpotFreshness(spot)
      expect(result.tier).toBe('gold')
      expect(result.isCertified).toBe(true)
      expect(result.labelKey).toBe('spotStatusGoldCertified')
    })

    it('should auto-certify gold spot even WITHOUT ambassador', () => {
      const spot = { ambassadorVerified: false, validationCount: 10, liveTestCount: 10 }
      const result = getSpotFreshness(spot)
      expect(result.tier).toBe('gold')
      expect(result.isCertified).toBe(true)
      expect(result.labelKey).toBe('spotStatusGoldCertified')
    })
  })

  describe('Station overlay', () => {
    it('should set isStation for gas_station spots', () => {
      const spot = { spotType: 'gas_station', validationCount: 0, testCount: 0 }
      const result = getSpotFreshness(spot)
      expect(result.isStation).toBe(true)
    })

    it('should not set isStation for non-station spots', () => {
      const spot = { spotType: 'roadside', validationCount: 0, testCount: 0 }
      const result = getSpotFreshness(spot)
      expect(result.isStation).toBe(false)
    })

    it('station keeps tier color (green station)', () => {
      const spot = { spotType: 'gas_station', validationCount: 5, liveTestCount: 5 }
      const result = getSpotFreshness(spot)
      expect(result.tier).toBe('green')
      expect(result.isStation).toBe(true)
      expect(result.hexColor).toBe('#10b981')
    })
  })

  describe('getSpotAge — freshness by date', () => {
    it('should return unknownAge for spot with no dates', () => {
      const spot = {}
      const age = getSpotAge(spot)
      expect(age.labelKey).toBe('unknownAge')
    })

    it('should return freshSpot for spot < 1 year old', () => {
      const threeMonthsAgo = new Date()
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
      const spot = { lastCheckin: threeMonthsAgo.toISOString() }
      const age = getSpotAge(spot)
      expect(age.labelKey).toBe('freshSpot')
      expect(age.icon).toBe('sparkles')
    })

    it('should return agingSpot for spot 1-3 years old', () => {
      const twoYearsAgo = new Date()
      twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2)
      const spot = { lastUsed: twoYearsAgo.toISOString() }
      const age = getSpotAge(spot)
      expect(age.labelKey).toBe('agingSpot')
    })

    it('should return oldSpot for spot 3-5 years old', () => {
      const fourYearsAgo = new Date()
      fourYearsAgo.setFullYear(fourYearsAgo.getFullYear() - 4)
      const spot = { lastUsed: fourYearsAgo.toISOString() }
      const age = getSpotAge(spot)
      expect(age.labelKey).toBe('oldSpot')
    })

    it('should use lastTested as date source', () => {
      const sixMonthsAgo = new Date()
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
      const spot = { lastTested: sixMonthsAgo.toISOString() }
      const age = getSpotAge(spot)
      expect(age.labelKey).toBe('freshSpot')
    })

    it('should use createdAt as fallback', () => {
      const sixMonthsAgo = new Date()
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
      const spot = { createdAt: sixMonthsAgo.toISOString() }
      const age = getSpotAge(spot)
      expect(age.labelKey).toBe('freshSpot')
    })
  })

  describe('renderFreshnessBadge', () => {
    it('should render HTML badge for green spot', () => {
      const spot = { validationCount: 5, liveTestCount: 5 }
      const html = renderFreshnessBadge(spot)
      expect(html).toContain('<svg')
      expect(html).toContain('bg-emerald-500/20')
      expect(html).toContain('text-emerald-400')
    })

    it('should render station badge for gas_station spot', () => {
      const spot = { spotType: 'gas_station', validationCount: 0, testCount: 0 }
      const html = renderFreshnessBadge(spot)
      expect(html).toContain('bg-red-500/20')
      expect(html).toContain('lucide')
    })

    it('should render crown for certified spot', () => {
      const spot = { ambassadorVerified: true, validationCount: 0, testCount: 0 }
      const html = renderFreshnessBadge(spot)
      expect(html).toContain('lucide')
    })

    it('should render blue badge for any spot', () => {
      const spot = { validationCount: 0, testCount: 0 }
      const html = renderFreshnessBadge(spot)
      expect(html).toContain('bg-blue-500/20')
    })

    it('should show total count in badge', () => {
      const spot = { validationCount: 5, testCount: 3 }
      const html = renderFreshnessBadge(spot)
      expect(html).toContain('(8)')
    })

    it('should not show count for 0 total', () => {
      const spot = { validationCount: 0, testCount: 0 }
      const html = renderFreshnessBadge(spot)
      expect(html).not.toContain('(0)')
    })

    it('should support different sizes', () => {
      const spot = { validationCount: 5, testCount: 5 }

      const htmlSm = renderFreshnessBadge(spot, 'sm')
      const htmlMd = renderFreshnessBadge(spot, 'md')
      const htmlLg = renderFreshnessBadge(spot, 'lg')

      expect(htmlSm).toContain('text-xs px-1.5 py-0.5')
      expect(htmlMd).toContain('text-xs px-2 py-1')
      expect(htmlLg).toContain('text-sm px-3 py-1.5')
    })

    it('should default to md size', () => {
      const spot = { validationCount: 3, testCount: 3 }
      const html = renderFreshnessBadge(spot)
      expect(html).toContain('text-xs px-2 py-1')
    })
  })

  describe('renderAgeBadge', () => {
    it('should render age badge', () => {
      const threeMonthsAgo = new Date()
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
      const spot = { lastCheckin: threeMonthsAgo.toISOString() }
      const html = renderAgeBadge(spot)
      expect(html).toContain('<svg')
      expect(html).toContain('bg-emerald-500/20')
    })

    it('should default to sm size', () => {
      const spot = { lastCheckin: new Date().toISOString() }
      const html = renderAgeBadge(spot)
      expect(html).toContain('text-xs px-1.5 py-0.5')
    })
  })

  describe('getFreshnessColor — hex colors for markers', () => {
    it('should return blue hex for spots without tests', () => {
      const spot = { validationCount: 0, testCount: 0 }
      expect(getFreshnessColor(spot)).toBe('#3b82f6')
    })

    it('should return blue hex for community spots', () => {
      const spot = { validationCount: 0, testCount: 0 }
      expect(getFreshnessColor(spot)).toBe('#3b82f6')
    })

    it('should return emerald hex for green spots', () => {
      const spot = { validationCount: 3, liveTestCount: 3 }
      expect(getFreshnessColor(spot)).toBe('#10b981')
    })

    it('should return amber hex for gold spots', () => {
      const spot = { validationCount: 10, liveTestCount: 10 }
      expect(getFreshnessColor(spot)).toBe('#fbbf24')
    })
  })

  describe('isGasStation', () => {
    it('should return true for gas_station spots', () => {
      expect(isGasStation({ spotType: 'gas_station' })).toBe(true)
    })

    it('should return false for non-station spots', () => {
      expect(isGasStation({ spotType: 'city_exit' })).toBe(false)
    })

    it('should return false for null', () => {
      expect(isGasStation(null)).toBe(false)
    })
  })

  describe('getMarkerIcon', () => {
    it('should return marker-blue for spot without enough tests', () => {
      expect(getMarkerIcon({ validationCount: 0, testCount: 0 })).toBe('marker-blue')
    })

    it('should return marker-green for reliable spot', () => {
      expect(getMarkerIcon({ validationCount: 5, liveTestCount: 5 })).toBe('marker-green')
    })

    it('should return marker-green-station for reliable gas station', () => {
      expect(getMarkerIcon({ validationCount: 5, liveTestCount: 5, spotType: 'gas_station' })).toBe('marker-green-station')
    })

    it('should return marker-gold-certified for gold (auto-certified)', () => {
      expect(getMarkerIcon({ validationCount: 10, liveTestCount: 10 })).toBe('marker-gold-certified')
    })

    it('should return marker-gold-station-certified for gold station', () => {
      expect(getMarkerIcon({ validationCount: 10, liveTestCount: 10, spotType: 'gas_station' })).toBe('marker-gold-station-certified')
    })

    it('should return marker-blue-station for station without tests', () => {
      expect(getMarkerIcon({ validationCount: 0, testCount: 0, spotType: 'gas_station' })).toBe('marker-blue-station')
    })
  })
})
