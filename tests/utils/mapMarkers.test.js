import { describe, it, expect, vi } from 'vitest'

vi.mock('../../src/i18n/index.js', () => ({ t: vi.fn((k) => k) }))
vi.mock('../../src/utils/icons.js', () => ({ icon: vi.fn((n) => `<svg>${n}</svg>`) }))

import { getMarkerType, buildLegendHTML } from '../../src/utils/mapMarkers.js'

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
  })
})
