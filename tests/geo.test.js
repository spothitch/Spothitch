import { describe, it, expect } from 'vitest'
import { haversineKm } from '../src/utils/geo.js'

describe('haversineKm', () => {
  it('returns 0 for same point', () => {
    expect(haversineKm(48.8566, 2.3522, 48.8566, 2.3522)).toBe(0)
  })

  it('calculates Paris→Lyon ~390km', () => {
    const d = haversineKm(48.8566, 2.3522, 45.7640, 4.8357)
    expect(d).toBeGreaterThan(380)
    expect(d).toBeLessThan(400)
  })

  it('calculates short distance', () => {
    // ~1km apart
    const d = haversineKm(48.8566, 2.3522, 48.8656, 2.3522)
    expect(d).toBeGreaterThan(0.5)
    expect(d).toBeLessThan(2)
  })
})
