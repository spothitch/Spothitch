import { describe, it, expect } from 'vitest'
import { extractCoordsFromShare, resolveShortMapUrl } from '../../src/utils/mapsUrlParser.js'

describe('extractCoordsFromShare', () => {
  it('parses Google Maps ?q=lat,lng', () => {
    const result = extractCoordsFromShare('https://maps.google.com/?q=48.8566,2.3522', '')
    expect(result).toEqual({ lat: 48.8566, lng: 2.3522 })
  })

  it('parses Google Maps /@lat,lng,zoom', () => {
    const result = extractCoordsFromShare('https://www.google.com/maps/@48.8566,2.3522,15z', '')
    expect(result).toEqual({ lat: 48.8566, lng: 2.3522 })
  })

  it('parses Google Maps /place/.../@lat,lng', () => {
    const result = extractCoordsFromShare('https://www.google.com/maps/place/Paris/@48.8566,2.3522,12z', '')
    expect(result).toEqual({ lat: 48.8566, lng: 2.3522 })
  })

  it('parses raw coords in text', () => {
    const result = extractCoordsFromShare('', '48.8566, 2.3522')
    expect(result).toEqual({ lat: 48.8566, lng: 2.3522 })
  })

  it('parses coords without space after comma', () => {
    const result = extractCoordsFromShare('', '48.8566,2.3522')
    expect(result).toEqual({ lat: 48.8566, lng: 2.3522 })
  })

  it('extracts URL from text', () => {
    const result = extractCoordsFromShare('', 'Check this out https://maps.google.com/?q=48.8566,2.3522 cool spot')
    expect(result).toEqual({ lat: 48.8566, lng: 2.3522 })
  })

  it('handles negative coordinates', () => {
    const result = extractCoordsFromShare('https://maps.google.com/?q=-33.8688,151.2093', '')
    expect(result).toEqual({ lat: -33.8688, lng: 151.2093 })
  })

  it('returns null for invalid URL', () => {
    const result = extractCoordsFromShare('not-a-url', '')
    expect(result).toBeNull()
  })

  it('returns null for empty input', () => {
    const result = extractCoordsFromShare('', '')
    expect(result).toBeNull()
  })

  it('returns null for out-of-range coords', () => {
    const result = extractCoordsFromShare('', '999.999, 999.999')
    expect(result).toBeNull()
  })

  it('handles Google Maps short URLs with text coords', () => {
    const result = extractCoordsFromShare('https://goo.gl/maps/abc123', 'Paris 48.8566, 2.3522')
    expect(result).toEqual({ lat: 48.8566, lng: 2.3522 })
  })

  it('handles ll= parameter', () => {
    const result = extractCoordsFromShare('https://maps.google.com/?ll=48.8566,2.3522&z=15', '')
    expect(result).toEqual({ lat: 48.8566, lng: 2.3522 })
  })

  it('parses /search/lat,lng format (Google Maps 2025+ share)', () => {
    const result = extractCoordsFromShare('https://www.google.com/maps/search/50.744637,+4.575336?entry=tts', '')
    expect(result).toEqual({ lat: 50.744637, lng: 4.575336 })
  })

  it('parses /search/lat,lng without plus sign', () => {
    const result = extractCoordsFromShare('https://www.google.com/maps/search/48.8566,2.3522', '')
    expect(result).toEqual({ lat: 48.8566, lng: 2.3522 })
  })

  it('parses !3d/!4d data format (Google Maps long URL)', () => {
    const result = extractCoordsFromShare('https://www.google.com/maps/place/Tour+Eiffel/data=!4m6!3m5!1s0x47e66e2964e34e2d!8m2!3d48.8583701!4d2.2944813', '')
    expect(result).toEqual({ lat: 48.8583701, lng: 2.2944813 })
  })

  it('parses center= parameter', () => {
    const result = extractCoordsFromShare('https://maps.example.com/?center=48.8566,2.3522', '')
    expect(result).toEqual({ lat: 48.8566, lng: 2.3522 })
  })

  it('parses destination= parameter', () => {
    const result = extractCoordsFromShare('https://www.google.com/maps/dir/?destination=48.8566,2.3522', '')
    expect(result).toEqual({ lat: 48.8566, lng: 2.3522 })
  })

  it('parses OpenStreetMap #map=zoom/lat/lng', () => {
    const result = extractCoordsFromShare('https://www.openstreetmap.org/#map=15/48.8566/2.3522', '')
    expect(result).toEqual({ lat: 48.8566, lng: 2.3522 })
  })

  it('extracts multiple URLs from text and finds coords in second URL', () => {
    const text = 'Check this link: https://example.com\nAlso this: https://maps.google.com/?q=48.8566,2.3522'
    const result = extractCoordsFromShare('', text)
    expect(result).toEqual({ lat: 48.8566, lng: 2.3522 })
  })
})

describe('resolveShortMapUrl', () => {
  it('returns null when fetch fails (CORS)', async () => {
    const result = await resolveShortMapUrl('https://maps.app.goo.gl/abc123')
    expect(result).toBeNull()
  })
})
