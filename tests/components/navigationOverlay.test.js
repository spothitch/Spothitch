import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../src/services/navigation.js', () => ({
  formatDistance: vi.fn((d) => `${d}m`),
  getDirectionIcon: vi.fn(() => 'arrow-up'),
}))
vi.mock('../../src/i18n/index.js', () => ({
  t: vi.fn((key) => key),
}))
vi.mock('../../src/utils/icons.js', () => ({
  icon: vi.fn((name) => `<svg data-icon="${name}"></svg>`),
}))
vi.mock('../../src/utils/sanitize.js', () => ({
  escapeJSString: vi.fn((s) => s || ''),
}))

import {
  renderNavigationOverlay,
  renderNavigationWidget,
} from '../../src/components/ui/NavigationOverlay.js'

const baseState = {
  navigationActive: true,
  navigationDestination: { name: 'Paris', lat: 48.8566, lng: 2.3522 },
  navigationDistance: 1500,
  navigationInstructions: [
    { maneuver: { type: 'turn', modifier: 'left' }, instruction: 'Tourner à gauche', distance: 200, name: 'Rue de Rivoli' },
    { maneuver: { type: 'arrive', modifier: undefined }, instruction: 'Arriver à destination', distance: 50 },
  ],
  navigationCurrentStep: 0,
  gasStations: [],
  showGasStationsOnMap: false,
}

describe('NavigationOverlay', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('renderNavigationOverlay', () => {
    it('returns empty string when navigationActive is false', () => {
      expect(renderNavigationOverlay({ navigationActive: false })).toBe('')
    })

    it('returns non-empty HTML string when navigationActive is true', () => {
      const html = renderNavigationOverlay(baseState)
      expect(typeof html).toBe('string')
      expect(html.length).toBeGreaterThan(50)
    })

    it('includes navigation-overlay class', () => {
      const html = renderNavigationOverlay(baseState)
      expect(html).toContain('navigation-overlay')
    })

    it('shows current instruction text', () => {
      const html = renderNavigationOverlay(baseState)
      expect(html).toContain('Tourner à gauche')
    })

    it('shows next instruction preview', () => {
      const html = renderNavigationOverlay(baseState)
      expect(html).toContain('Arriver à destination')
    })

    it('includes stopNavigation handler', () => {
      const html = renderNavigationOverlay(baseState)
      expect(html).toContain('stopNavigation()')
    })

    it('includes toggleGasStations handler', () => {
      const html = renderNavigationOverlay(baseState)
      expect(html).toContain('toggleGasStations()')
    })

    it('includes openExternalNavigation handler', () => {
      const html = renderNavigationOverlay(baseState)
      expect(html).toContain('openExternalNavigation(')
    })

    it('shows gas station count in aria-title when stations exist', () => {
      const state = { ...baseState, gasStations: [{}, {}] }
      const html = renderNavigationOverlay(state)
      expect(html).toContain('(2)')
    })

    it('shows amber color when showGasStationsOnMap is true', () => {
      const state = { ...baseState, showGasStationsOnMap: true }
      const html = renderNavigationOverlay(state)
      expect(html).toContain('amber-500')
    })

    it('shows slate color when showGasStationsOnMap is false', () => {
      const html = renderNavigationOverlay(baseState)
      expect(html).toContain('slate-400')
    })

    it('shows destination name in bottom bar', () => {
      const html = renderNavigationOverlay(baseState)
      expect(html).toContain('Paris')
    })

    it('handles null navigationInstructions gracefully', () => {
      const state = { ...baseState, navigationInstructions: null }
      expect(() => renderNavigationOverlay(state)).not.toThrow()
    })

    it('handles null navigationDestination gracefully', () => {
      const state = { ...baseState, navigationDestination: null }
      expect(() => renderNavigationOverlay(state)).not.toThrow()
    })

    it('handles null navigationDistance gracefully', () => {
      const state = { ...baseState, navigationDistance: null }
      const html = renderNavigationOverlay(state)
      expect(html).toContain('--')
    })

    it('shows 0% progress when at first step of multiple', () => {
      const state = {
        ...baseState,
        navigationInstructions: [
          { maneuver: {}, instruction: 'First step', distance: 100 },
          { maneuver: {}, instruction: 'Last step', distance: 0 },
        ],
        navigationCurrentStep: 0,
      }
      const html = renderNavigationOverlay(state)
      expect(html).toContain('width: 0%')
    })

    it('shows calculating message when no current instruction', () => {
      const state = {
        ...baseState,
        navigationInstructions: [],
        navigationCurrentStep: 5,
      }
      const html = renderNavigationOverlay(state)
      expect(html).toContain('calculatingRoute')
    })

  })

  describe('renderNavigationWidget', () => {
    it('returns empty string when navigationActive is false', () => {
      expect(renderNavigationWidget({ navigationActive: false })).toBe('')
    })

    it('returns HTML string when navigationActive is true', () => {
      const html = renderNavigationWidget({
        navigationActive: true,
        navigationDestination: { name: 'Lyon', lat: 45.764, lng: 4.836 },
        navigationDistance: 300000,
      })
      expect(typeof html).toBe('string')
      expect(html.length).toBeGreaterThan(50)
    })

    it('includes navigation-widget class', () => {
      const html = renderNavigationWidget({
        navigationActive: true,
        navigationDestination: { name: 'Test', lat: 0, lng: 0 },
        navigationDistance: 100,
      })
      expect(html).toContain('navigation-widget')
    })

    it('includes showFullNavigation handler', () => {
      const html = renderNavigationWidget({
        navigationActive: true,
        navigationDestination: null,
        navigationDistance: null,
      })
      expect(html).toContain('showFullNavigation()')
    })

    it('shows destination name', () => {
      const html = renderNavigationWidget({
        navigationActive: true,
        navigationDestination: { name: 'Bordeaux', lat: 44.8, lng: -0.6 },
        navigationDistance: 500,
      })
      expect(html).toContain('Bordeaux')
    })

    it('handles null destination gracefully', () => {
      expect(() => renderNavigationWidget({
        navigationActive: true,
        navigationDestination: null,
        navigationDistance: null,
      })).not.toThrow()
    })

    it('shows navigationActive i18n key when destination name missing', () => {
      const html = renderNavigationWidget({
        navigationActive: true,
        navigationDestination: { lat: 0, lng: 0 },
        navigationDistance: 100,
      })
      expect(html).toContain('navigationActive')
    })
  })
})
