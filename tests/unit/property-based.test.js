/**
 * Property-based tests using fast-check
 * Tests mathematical properties that must ALWAYS hold
 */
import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'

// ── Mocks ──────────────────────────────────────────────────────────────────
vi.mock('../../src/services/firebase.js', () => ({
  getFirestore: vi.fn(),
  collection: vi.fn(),
}))
vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({})),
  setState: vi.fn(),
  subscribe: vi.fn(),
}))

// ── Import utilities under test ────────────────────────────────────────────
import { validateUsername } from '../../src/services/firebaseUtils.js'
import { haversineKm } from '../../src/utils/geo.js'
import { escapeHTML } from '../../src/utils/sanitize.js'

// ── Arbitraries ────────────────────────────────────────────────────────────
const anyString = fc.string({ minLength: 0, maxLength: 200 })
const longString = fc.string({ minLength: 0, maxLength: 10000 })
const validUsername = fc.stringMatching(/^[a-z0-9._]{3,20}$/)
const lat = fc.double({ min: -90, max: 90, noNaN: true })
const lng = fc.double({ min: -180, max: 180, noNaN: true })

// ══════════════════════════════════════════════════════════════════════════
// validateUsername — Properties
// ══════════════════════════════════════════════════════════════════════════
describe('validateUsername — property-based', () => {
  it('always returns {valid, errorKey} shape for any input', () => {
    fc.assert(fc.property(anyString, (input) => {
      const result = validateUsername(input)
      expect(result).toHaveProperty('valid')
      expect(result).toHaveProperty('errorKey')
      expect(typeof result.valid).toBe('boolean')
    }), { numRuns: 1000 })
  })

  it('never crashes on null/undefined', () => {
    expect(() => validateUsername(null)).not.toThrow()
    expect(() => validateUsername(undefined)).not.toThrow()
    expect(() => validateUsername('')).not.toThrow()
  })

  it('never crashes on long strings (no ReDoS)', () => {
    fc.assert(fc.property(longString, (input) => {
      const t0 = Date.now()
      validateUsername(input)
      expect(Date.now() - t0).toBeLessThan(50) // max 50ms
    }), { numRuns: 100 })
  })

  it('valid username always returns valid:true', () => {
    fc.assert(fc.property(validUsername, (input) => {
      // Exclude usernames starting/ending with . or _ or having consecutive . or _
      const u = input.toLowerCase()
      if (/^[._]|[._]$|[.]{2}|[_]{2}/.test(u)) return
      const result = validateUsername(u)
      expect(result.valid).toBe(true)
    }), { numRuns: 500 })
  })

  it('too-short username (< 3) always returns valid:false', () => {
    fc.assert(fc.property(fc.string({ minLength: 0, maxLength: 2 }), (input) => {
      if (input.length >= 3) return
      const result = validateUsername(input)
      expect(result.valid).toBe(false)
    }), { numRuns: 500 })
  })

  it('too-long username (> 20) always returns valid:false', () => {
    fc.assert(fc.property(fc.string({ minLength: 21, maxLength: 100 }), (input) => {
      const result = validateUsername(input)
      expect(result.valid).toBe(false)
    }), { numRuns: 500 })
  })
})

// ══════════════════════════════════════════════════════════════════════════
// validateUsername — Boundary value analysis
// ══════════════════════════════════════════════════════════════════════════
describe('validateUsername — boundary values', () => {
  it('2 chars (min-1) → invalid', () => expect(validateUsername('ab').valid).toBe(false))
  it('3 chars (min) → valid', () => expect(validateUsername('abc').valid).toBe(true))
  it('4 chars (min+1) → valid', () => expect(validateUsername('abcd').valid).toBe(true))
  it('19 chars (max-1) → valid', () => expect(validateUsername('a'.repeat(19)).valid).toBe(true))
  it('20 chars (max) → valid', () => expect(validateUsername('a'.repeat(20)).valid).toBe(true))
  it('21 chars (max+1) → invalid', () => expect(validateUsername('a'.repeat(21)).valid).toBe(false))
})

// ══════════════════════════════════════════════════════════════════════════
// haversineKm — Properties
// ══════════════════════════════════════════════════════════════════════════
describe('haversineKm — property-based', () => {
  it('is always non-negative', () => {
    fc.assert(fc.property(lat, lng, lat, lng, (lat1, lng1, lat2, lng2) => {
      const d = haversineKm(lat1, lng1, lat2, lng2)
      expect(d).toBeGreaterThanOrEqual(0)
    }), { numRuns: 1000 })
  })

  it('same point to itself = 0', () => {
    fc.assert(fc.property(lat, lng, (la, ln) => {
      const d = haversineKm(la, ln, la, ln)
      expect(d).toBeLessThan(0.001) // floating point tolerance
    }), { numRuns: 500 })
  })

  it('is commutative: d(A,B) == d(B,A)', () => {
    fc.assert(fc.property(lat, lng, lat, lng, (lat1, lng1, lat2, lng2) => {
      const d1 = haversineKm(lat1, lng1, lat2, lng2)
      const d2 = haversineKm(lat2, lng2, lat1, lng1)
      expect(Math.abs(d1 - d2)).toBeLessThan(0.001)
    }), { numRuns: 1000 })
  })

  it('never returns NaN or Infinity', () => {
    fc.assert(fc.property(lat, lng, lat, lng, (lat1, lng1, lat2, lng2) => {
      const d = haversineKm(lat1, lng1, lat2, lng2)
      expect(Number.isFinite(d)).toBe(true)
    }), { numRuns: 1000 })
  })

  it('max possible distance (poles) < 21000km', () => {
    const d = haversineKm(-90, 0, 90, 0)
    expect(d).toBeLessThan(21000)
    expect(d).toBeGreaterThan(19000)
  })
})

// ══════════════════════════════════════════════════════════════════════════
// escapeHTML — Properties
// ══════════════════════════════════════════════════════════════════════════
describe('escapeHTML — property-based', () => {
  it('never produces unescaped < in output', () => {
    fc.assert(fc.property(anyString, (input) => {
      const out = escapeHTML(input)
      // The only < allowed in output is as part of &lt;
      expect(out.replace(/&lt;/g, '')).not.toContain('<')
    }), { numRuns: 1000 })
  })

  it('never produces unescaped > in output', () => {
    fc.assert(fc.property(anyString, (input) => {
      const out = escapeHTML(input)
      expect(out.replace(/&gt;/g, '')).not.toContain('>')
    }), { numRuns: 1000 })
  })

  it('never produces unescaped & in output', () => {
    fc.assert(fc.property(anyString, (input) => {
      const out = escapeHTML(input)
      // All & must be followed by known entity patterns
      const stripped = out.replace(/&(?:lt|gt|amp|quot|#39);/g, '')
      expect(stripped).not.toContain('&')
    }), { numRuns: 1000 })
  })

  it('" is valid in text nodes — escapeHTML does not need to escape it (use escapeJSString for attributes)', () => {
    // HTML spec: " only needs escaping inside attribute values, NOT in text content
    // escapeHTML is for text content — this is correct behavior
    const out = escapeHTML('"hello"')
    expect(out).toContain('"') // correct: quotes pass through in text nodes
  })

  it('is idempotent: escapeHTML(escapeHTML(x)) has no new angle brackets', () => {
    fc.assert(fc.property(anyString, (input) => {
      const once = escapeHTML(input)
      const twice = escapeHTML(once)
      // Double-escaping produces &amp;lt; etc but no raw <
      expect(twice.replace(/&amp;/g, '')).not.toContain('<')
    }), { numRuns: 500 })
  })

  it('never crashes on any input including null/undefined', () => {
    expect(() => escapeHTML(null)).not.toThrow()
    expect(() => escapeHTML(undefined)).not.toThrow()
    expect(() => escapeHTML('')).not.toThrow()
    expect(() => escapeHTML(0)).not.toThrow()
    fc.assert(fc.property(anyString, (input) => {
      expect(() => escapeHTML(input)).not.toThrow()
    }), { numRuns: 500 })
  })
})

// ══════════════════════════════════════════════════════════════════════════
// GPS Coordinates — Boundary values
// ══════════════════════════════════════════════════════════════════════════
describe('GPS coordinates — boundary values', () => {
  const isValidLat = (v) => typeof v === 'number' && v >= -90 && v <= 90 && Number.isFinite(v)
  const isValidLng = (v) => typeof v === 'number' && v >= -180 && v <= 180 && Number.isFinite(v)

  it('lat -90 is valid', () => expect(isValidLat(-90)).toBe(true))
  it('lat -89.9999 is valid', () => expect(isValidLat(-89.9999)).toBe(true))
  it('lat 0 is valid', () => expect(isValidLat(0)).toBe(true))
  it('lat 89.9999 is valid', () => expect(isValidLat(89.9999)).toBe(true))
  it('lat 90 is valid', () => expect(isValidLat(90)).toBe(true))
  it('lat 90.0001 is invalid', () => expect(isValidLat(90.0001)).toBe(false))
  it('lat NaN is invalid', () => expect(isValidLat(NaN)).toBe(false))
  it('lat Infinity is invalid', () => expect(isValidLat(Infinity)).toBe(false))
  it('lat 999 is invalid', () => expect(isValidLat(999)).toBe(false))

  it('lng -180 is valid', () => expect(isValidLng(-180)).toBe(true))
  it('lng 180 is valid', () => expect(isValidLng(180)).toBe(true))
  it('lng 180.0001 is invalid', () => expect(isValidLng(180.0001)).toBe(false))
  it('lng NaN is invalid', () => expect(isValidLng(NaN)).toBe(false))
})
