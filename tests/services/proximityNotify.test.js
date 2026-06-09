import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({
    proximityAlerts: false,
    proximityAlertSpot: null,
    spots: [],
  })),
  setState: vi.fn(),
  subscribe: vi.fn((cb) => () => {}),
}))
vi.mock('../../src/services/notifications.js', () => ({
  showToast: vi.fn(),
}))
vi.mock('../../src/i18n/index.js', () => ({ t: vi.fn((k) => k) }))
vi.mock('../../src/utils/geo.js', () => ({ haversineKm: vi.fn(() => 10) }))
vi.mock('../../src/utils/icons.js', () => ({ icon: vi.fn((n) => `<svg>${n}</svg>`) }))
vi.mock('../../src/utils/sanitize.js', () => ({ escapeJSString: vi.fn((s) => s) }))

import {
  renderProximityAlert,
  initProximityNotify,
} from '../../src/services/proximityNotify.js'
import proximityNotify from '../../src/services/proximityNotify.js'
import { getState, setState } from '../../src/stores/state.js'
import { haversineKm } from '../../src/utils/geo.js'

describe('proximityNotify', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
    getState.mockReturnValue({
      proximityAlerts: false,
      proximityAlertSpot: null,
      spots: [],
    })
  })

  describe('renderProximityAlert', () => {
    it('returns HTML string', () => {
      const html = renderProximityAlert({ id: 'spot1', from: 'Paris', to: 'Lyon' })
      expect(typeof html).toBe('string')
      expect(html.length).toBeGreaterThan(50)
    })

    it('contains role="alert"', () => {
      const html = renderProximityAlert({ id: 'spot1' })
      expect(html).toContain('role="alert"')
    })

    it('uses "to" field as spot name', () => {
      const html = renderProximityAlert({ id: 'spot1', to: 'Lyon' })
      expect(html).toContain('Lyon')
    })

    it('uses "from" field when no "to"', () => {
      const html = renderProximityAlert({ id: 'spot1', from: 'Paris Nord' })
      expect(html).toContain('Paris Nord')
    })

    it('uses "name" field as fallback', () => {
      const html = renderProximityAlert({ id: 'spot1', name: 'Mon Spot' })
      expect(html).toContain('Mon Spot')
    })

    it('falls back to "Spot" when no name fields', () => {
      const html = renderProximityAlert({ id: 'spot1' })
      expect(html).toContain('Spot')
    })

    it('contains dismissProximityAlert handler', () => {
      const html = renderProximityAlert({ id: 'spot1' })
      expect(html).toContain('dismissProximityAlert()')
    })

    it('contains quickValidateSpot handler with spot id', () => {
      const html = renderProximityAlert({ id: 'spot-abc' })
      expect(html).toContain('quickValidateSpot(')
      expect(html).toContain('spot-abc')
    })

    it('contains quickReportSpot handler with spot id', () => {
      const html = renderProximityAlert({ id: 'spot-xyz' })
      expect(html).toContain('quickReportSpot(')
      expect(html).toContain('spot-xyz')
    })

    it('handles numeric spot id', () => {
      const html = renderProximityAlert({ id: 42, from: 'Gare' })
      expect(typeof html).toBe('string')
      expect(html).toContain('42')
    })

    it('includes spotNearby i18n key', () => {
      const html = renderProximityAlert({ id: 'spot1' })
      expect(html).toContain('spotNearby')
    })

    it('includes isSpotStillGood i18n key', () => {
      const html = renderProximityAlert({ id: 'spot1' })
      expect(html).toContain('isSpotStillGood')
    })
  })

  describe('window.dismissProximityAlert', () => {
    it('is defined as a global function', () => {
      expect(typeof window.dismissProximityAlert).toBe('function')
    })

    it('calls setState with proximityAlertSpot: null', () => {
      window.dismissProximityAlert()
      expect(setState).toHaveBeenCalledWith({ proximityAlertSpot: null })
    })

    it('runs without throwing', () => {
      expect(() => window.dismissProximityAlert()).not.toThrow()
    })

    it('can be called multiple times', () => {
      expect(() => {
        window.dismissProximityAlert()
        window.dismissProximityAlert()
      }).not.toThrow()
    })
  })

  describe('window.quickReportSpot', () => {
    it('is defined as a global function', () => {
      expect(typeof window.quickReportSpot).toBe('function')
    })

    it('calls setState with showReport: true', () => {
      window.quickReportSpot('spot123')
      expect(setState).toHaveBeenCalledWith(
        expect.objectContaining({
          showReport: true,
          reportType: 'spot',
          reportTargetId: 'spot123',
        })
      )
    })

    it('clears proximityAlertSpot', () => {
      window.quickReportSpot('spot123')
      expect(setState).toHaveBeenCalledWith(
        expect.objectContaining({ proximityAlertSpot: null })
      )
    })

    it('runs without throwing', () => {
      expect(() => window.quickReportSpot('any-id')).not.toThrow()
    })

    it('passes spotId to reportTargetId', () => {
      window.quickReportSpot('specific-spot-id')
      expect(setState).toHaveBeenCalledWith(
        expect.objectContaining({ reportTargetId: 'specific-spot-id' })
      )
    })
  })

  describe('initProximityNotify', () => {
    it('runs without throwing', () => {
      expect(() => initProximityNotify()).not.toThrow()
    })

    it('does not start watching when proximityAlerts is false', () => {
      getState.mockReturnValue({ proximityAlerts: false })
      expect(() => initProximityNotify()).not.toThrow()
    })

    it('can be called multiple times without error', () => {
      expect(() => {
        initProximityNotify()
        initProximityNotify()
      }).not.toThrow()
    })
  })

  describe('checkProximity (via default export)', () => {
    it('is accessible via default export', () => {
      expect(typeof proximityNotify.checkProximity).toBe('function')
    })

    it('does nothing when proximityAlerts is disabled', () => {
      getState.mockReturnValue({
        proximityAlerts: false,
        spots: [{ id: 'sp1', coordinates: { lat: 48.857, lng: 2.352 } }],
      })
      expect(() => proximityNotify.checkProximity(48.8566, 2.3522)).not.toThrow()
      expect(setState).not.toHaveBeenCalled()
    })

    it('does nothing when proximityAlertSpot already set', () => {
      getState.mockReturnValue({
        proximityAlerts: true,
        proximityAlertSpot: { id: 'existing' },
        spots: [],
      })
      proximityNotify.checkProximity(48.8566, 2.3522)
      expect(setState).not.toHaveBeenCalled()
    })

    it('does nothing when no spots in state', () => {
      getState.mockReturnValue({
        proximityAlerts: true,
        proximityAlertSpot: null,
        spots: [],
      })
      proximityNotify.checkProximity(48.8566, 2.3522)
      expect(setState).not.toHaveBeenCalled()
    })

    it('sets proximityAlertSpot when spot is within 0.5km', () => {
      haversineKm.mockReturnValue(0.3) // 300m — within radius
      getState.mockReturnValue({
        proximityAlerts: true,
        proximityAlertSpot: null,
        spots: [
          { id: 'nearby', coordinates: { lat: 48.857, lng: 2.352 } },
        ],
      })
      proximityNotify.checkProximity(48.8566, 2.3522)
      expect(setState).toHaveBeenCalledWith(
        expect.objectContaining({ proximityAlertSpot: expect.objectContaining({ id: 'nearby' }) })
      )
    })

    it('does not alert for spots beyond 0.5km', () => {
      haversineKm.mockReturnValue(1.5) // 1.5km — too far
      getState.mockReturnValue({
        proximityAlerts: true,
        proximityAlertSpot: null,
        spots: [
          { id: 'far', coordinates: { lat: 45.75, lng: 4.85 } },
        ],
      })
      proximityNotify.checkProximity(48.8566, 2.3522)
      expect(setState).not.toHaveBeenCalled()
    })

    it('skips spots with missing coordinates', () => {
      haversineKm.mockReturnValue(0.1)
      getState.mockReturnValue({
        proximityAlerts: true,
        proximityAlertSpot: null,
        spots: [
          { id: 'no-coords' },
        ],
      })
      proximityNotify.checkProximity(48.8566, 2.3522)
      expect(setState).not.toHaveBeenCalled()
    })

    it('skips spots with null lat/lng', () => {
      haversineKm.mockReturnValue(0.1)
      getState.mockReturnValue({
        proximityAlerts: true,
        proximityAlertSpot: null,
        spots: [
          { id: 'null-coords', coordinates: { lat: null, lng: null } },
        ],
      })
      proximityNotify.checkProximity(48.8566, 2.3522)
      expect(setState).not.toHaveBeenCalled()
    })

    it('marks spot as alerted in localStorage after alert', () => {
      haversineKm.mockReturnValue(0.1)
      getState.mockReturnValue({
        proximityAlerts: true,
        proximityAlertSpot: null,
        spots: [
          { id: 'mark-spot', coordinates: { lat: 48.857, lng: 2.352 } },
        ],
      })
      proximityNotify.checkProximity(48.8566, 2.3522)
      const stored = localStorage.getItem('spothitch_proximity_alerts')
      expect(stored).toBeTruthy()
      const parsed = JSON.parse(stored)
      expect(parsed['mark-spot']).toBeDefined()
    })

    it('skips recently alerted spots (24h cooldown)', () => {
      // Mark spot as recently alerted
      const recent = { 'cooldown-spot': Date.now() }
      localStorage.setItem('spothitch_proximity_alerts', JSON.stringify(recent))

      haversineKm.mockReturnValue(0.1)
      getState.mockReturnValue({
        proximityAlerts: true,
        proximityAlertSpot: null,
        spots: [
          { id: 'cooldown-spot', coordinates: { lat: 48.857, lng: 2.352 } },
        ],
      })
      proximityNotify.checkProximity(48.8566, 2.3522)
      expect(setState).not.toHaveBeenCalled()
    })
  })
})
