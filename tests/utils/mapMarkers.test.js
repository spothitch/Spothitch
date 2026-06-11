import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../src/i18n/index.js', () => ({ t: vi.fn((k) => k) }))
vi.mock('../../src/utils/icons.js', () => ({ icon: vi.fn((n) => `<svg>${n}</svg>`) }))

// Mock Image + URL so registerMarkerImages works without a real browser
global.URL.createObjectURL = vi.fn(() => 'blob:mock-url')
global.URL.revokeObjectURL = vi.fn()
class MockImage {
  constructor() { this.onload = null; this.onerror = null }
  set src(_v) { setTimeout(() => this.onload?.(), 0) }
}
global.Image = MockImage

import { getMarkerType, buildLegendHTML, registerMarkerImages } from '../../src/utils/mapMarkers.js'

describe('mapMarkers', () => {
  describe('getMarkerType', () => {
    it('returns marker-fav for favorite', () => {
      expect(getMarkerType({}, true)).toBe('marker-fav')
    })

    it('returns gray type for old spot without recent activity', () => {
      const spot = { lastUsed: '2020-01-01', lastCheckin: '2020-01-01' }
      const type = getMarkerType(spot, false)
      expect(type).toContain('gray')
    })

    it('returns non-gray for spot with recent experienceDate', () => {
      const now = new Date()
      const spot = { experienceDate: { year: now.getFullYear(), month: now.getMonth() + 1, day: 1 }, liveTestCount: 0, validationCount: 0 }
      const type = getMarkerType(spot, false)
      expect(type).not.toContain('gray')
    })

    it('returns green for high validation+test with recent date', () => {
      const now = new Date()
      const spot = { experienceDate: { year: now.getFullYear(), month: now.getMonth() + 1 }, liveTestCount: 5, validationCount: 5 }
      const type = getMarkerType(spot, false)
      expect(type).toContain('green')
    })

    it('includes gold for 10+ uses', () => {
      const now = new Date()
      const spot = { experienceDate: { year: now.getFullYear(), month: now.getMonth() + 1 }, checkins: 15, liveTestCount: 0, validationCount: 0 }
      const type = getMarkerType(spot, false)
      expect(type).toContain('gold')
    })

    it('includes station for gas_station type', () => {
      const now = new Date()
      const spot = { experienceDate: { year: now.getFullYear(), month: now.getMonth() + 1 }, spotType: 'gas_station', liveTestCount: 0, validationCount: 0 }
      const type = getMarkerType(spot, false)
      expect(type).toContain('station')
    })

    it('returns marker-gray-gold for old spot with 10+ uses', () => {
      const spot = { lastValidated: '2018-01-01', checkins: 12, liveTestCount: 0, validationCount: 0 }
      const type = getMarkerType(spot, false)
      expect(type).toBe('marker-gray-gold')
    })

    it('returns marker-gray-station for old gas station', () => {
      const spot = { lastValidated: '2018-01-01', spotType: 'gas_station', liveTestCount: 0, validationCount: 0 }
      const type = getMarkerType(spot, false)
      expect(type).toBe('marker-gray-station')
    })

    it('returns marker-green-gold for high-use reliable spot', () => {
      const now = new Date()
      const spot = { experienceDate: { year: now.getFullYear(), month: now.getMonth() + 1 }, liveTestCount: 4, validationCount: 4, checkins: 10 }
      const type = getMarkerType(spot, false)
      expect(type).toBe('marker-green-gold')
    })

    it('returns marker-green-station for reliable gas station', () => {
      const now = new Date()
      const spot = { experienceDate: { year: now.getFullYear(), month: now.getMonth() + 1 }, liveTestCount: 4, validationCount: 4, spotType: 'gas_station' }
      const type = getMarkerType(spot, false)
      expect(type).toBe('marker-green-station')
    })

    it('returns marker-green-gold-station for high-use reliable gas station', () => {
      const now = new Date()
      const spot = { experienceDate: { year: now.getFullYear(), month: now.getMonth() + 1 }, liveTestCount: 4, validationCount: 4, checkins: 10, spotType: 'gas_station' }
      const type = getMarkerType(spot, false)
      expect(type).toBe('marker-green-gold-station')
    })

    it('returns marker-blue-gold-station for popular blue gas station', () => {
      const now = new Date()
      const spot = { experienceDate: { year: now.getFullYear(), month: now.getMonth() + 1 }, liveTestCount: 0, validationCount: 0, checkins: 10, spotType: 'gas_station' }
      const type = getMarkerType(spot, false)
      expect(type).toBe('marker-blue-gold-station')
    })

    it('returns marker-blue for recent spot with no special flags', () => {
      const now = new Date()
      const spot = { experienceDate: { year: now.getFullYear(), month: now.getMonth() + 1 }, liveTestCount: 0, validationCount: 0 }
      expect(getMarkerType(spot, false)).toBe('marker-blue')
    })

    it('returns marker-blue-station for recent gas_station', () => {
      const now = new Date()
      const spot = { experienceDate: { year: now.getFullYear(), month: now.getMonth() + 1 }, spotType: 'gas_station', liveTestCount: 0 }
      expect(getMarkerType(spot, false)).toBe('marker-blue-station')
    })

    it('detects recent activity via Firestore-style timestamp {seconds}', () => {
      // Recent timestamp = now - 1 day in seconds
      const recentSec = Math.floor((Date.now() - 86400000) / 1000)
      const spot = { lastValidated: { seconds: recentSec }, liveTestCount: 0, validationCount: 0 }
      const type = getMarkerType(spot, false)
      expect(type).not.toContain('gray') // should be recent (blue)
    })

    it('detects recent activity via numeric timestamp', () => {
      const recentTs = Date.now() - 86400000 // 1 day ago
      const spot = { lastTested: recentTs, liveTestCount: 0, validationCount: 0 }
      const type = getMarkerType(spot, false)
      expect(type).not.toContain('gray')
    })

    it('uses createdAt fallback when no validation dates', () => {
      const recentStr = new Date(Date.now() - 86400000).toISOString()
      const spot = { createdAt: recentStr, liveTestCount: 0, validationCount: 0 }
      const type = getMarkerType(spot, false)
      expect(type).not.toContain('gray')
    })

    it('uses createdAt as Firestore timestamp when no validation dates', () => {
      const recentSec = Math.floor((Date.now() - 86400000) / 1000)
      const spot = { createdAt: { seconds: recentSec }, liveTestCount: 0, validationCount: 0 }
      const type = getMarkerType(spot, false)
      expect(type).not.toContain('gray')
    })

    it('uses createdAt as numeric timestamp when no validation dates', () => {
      const recentTs = Date.now() - 86400000
      const spot = { createdAt: recentTs, liveTestCount: 0, validationCount: 0 }
      const type = getMarkerType(spot, false)
      expect(type).not.toContain('gray')
    })

    it('returns gray for empty spot (no dates)', () => {
      expect(getMarkerType({}, false)).toBe('marker-gray')
    })

    it('uses totalUses when checkins not set', () => {
      const now = new Date()
      const spot = { experienceDate: { year: now.getFullYear(), month: now.getMonth() + 1 }, totalUses: 10, liveTestCount: 0, validationCount: 0 }
      const type = getMarkerType(spot, false)
      expect(type).toContain('gold')
    })
  })

  describe('buildLegendHTML', () => {
    it('returns HTML string with legend items', () => {
      const html = buildLegendHTML((k) => k)
      expect(html).toContain('mapLegend')
      expect(html).toContain('svg')
      expect(html).toContain('legendOld')
      expect(html).toContain('legendRecent')
      expect(html).toContain('favorite')
    })

    it('renders all 6 legend rows', () => {
      const html = buildLegendHTML((k) => k)
      const circleCount = (html.match(/<svg/g) || []).length
      expect(circleCount).toBeGreaterThanOrEqual(5)
    })
  })

  describe('registerMarkerImages', () => {
    it('calls map.addImage for each marker type', async () => {
      const addImage = vi.fn()
      const hasImage = vi.fn(() => false)
      const mockMap = { addImage, hasImage }
      await registerMarkerImages(mockMap)
      expect(addImage).toHaveBeenCalled()
      expect(addImage.mock.calls.length).toBeGreaterThan(5)
    })

    it('skips markers already registered (hasImage returns true)', async () => {
      const addImage = vi.fn()
      const hasImage = vi.fn(() => true) // all already registered
      const mockMap = { addImage, hasImage }
      await registerMarkerImages(mockMap)
      expect(addImage).not.toHaveBeenCalled()
    })

    it('resolves without throwing', async () => {
      const mockMap = { addImage: vi.fn(), hasImage: vi.fn(() => false) }
      await expect(registerMarkerImages(mockMap)).resolves.toBeUndefined()
    })
  })
})
