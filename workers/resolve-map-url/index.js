/**
 * Cloudflare Worker: Resolve shortened Google Maps URLs
 * Follows redirects manually to extract coordinates from the final URL.
 * Google Maps short URLs (maps.app.goo.gl/xxx) redirect via HTTP 302
 * to a full URL containing @lat,lng coordinates.
 *
 * Note: Firebase Dynamic Links was deprecated (Aug 2025). Some old links
 * may return 404. The worker tries multiple strategies to extract coords.
 */
export default {
  async fetch(request) {
    const url = new URL(request.url)
    const target = url.searchParams.get('url')

    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Content-Type': 'application/json',
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers })
    }

    if (!target || !target.match(/^https:\/\/(maps\.app\.goo\.gl|goo\.gl|g\.co|goo\.gle)\//)) {
      return new Response(JSON.stringify({ error: 'Invalid URL' }), { status: 400, headers })
    }

    const browserHeaders = {
      'User-Agent': 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
    }

    try {
      // Strategy 1: Follow redirects manually to capture each Location header
      let currentUrl = target
      let finalUrl = target
      const visitedUrls = []

      for (let i = 0; i < 10; i++) {
        const res = await fetch(currentUrl, {
          redirect: 'manual',
          headers: browserHeaders,
        })

        visitedUrls.push(currentUrl)

        if (res.status >= 300 && res.status < 400) {
          const location = res.headers.get('location')
          if (!location) break

          currentUrl = location.startsWith('http') ? location : new URL(location, currentUrl).href
          finalUrl = currentUrl

          // Try extracting coords from each redirect URL
          const coords = extractCoordsFromUrl(currentUrl)
          if (coords) {
            return new Response(JSON.stringify({ ...coords, resolvedUrl: currentUrl }), { headers })
          }
          continue
        }

        // Got a 200 (or other non-redirect) — try extracting from URL
        finalUrl = res.url || currentUrl
        const coordsFromUrl = extractCoordsFromUrl(finalUrl)
        if (coordsFromUrl) {
          return new Response(JSON.stringify({ ...coordsFromUrl, resolvedUrl: finalUrl }), { headers })
        }

        // Try extracting from the page HTML (Google Maps embeds coords in JS data)
        const html = await res.text()
        const htmlCoords = extractCoordsFromHtml(html)
        if (htmlCoords) {
          return new Response(JSON.stringify({ ...htmlCoords, resolvedUrl: finalUrl }), { headers })
        }

        // Try extracting a place name and geocoding it server-side
        const place = extractPlaceName(finalUrl) || extractPlaceFromHtml(html)
        if (place) {
          // Try server-side geocoding (no CORS issues) before falling back to client
          const geocoded = await geocodeAddress(place)
          if (geocoded) {
            return new Response(JSON.stringify({ ...geocoded, resolvedUrl: finalUrl }), { headers })
          }
          return new Response(JSON.stringify({ place, resolvedUrl: finalUrl }), { headers })
        }

        // If we got a 404 (dead Dynamic Link), check all visited redirect URLs
        if (res.status === 404) {
          for (const visited of visitedUrls) {
            const coordsFromVisited = extractCoordsFromUrl(visited)
            if (coordsFromVisited) {
              return new Response(JSON.stringify({ ...coordsFromVisited, resolvedUrl: visited }), { headers })
            }
          }
        }

        break
      }

      // Strategy 2: Try with redirect: 'follow' as fallback
      const followRes = await fetch(target, {
        redirect: 'follow',
        headers: browserHeaders,
      })
      const followUrl = followRes.url
      if (followUrl && followUrl !== target) {
        const coords = extractCoordsFromUrl(followUrl)
        if (coords) {
          return new Response(JSON.stringify({ ...coords, resolvedUrl: followUrl }), { headers })
        }

        const html = await followRes.text()
        const htmlCoords = extractCoordsFromHtml(html)
        if (htmlCoords) {
          return new Response(JSON.stringify({ ...htmlCoords, resolvedUrl: followUrl }), { headers })
        }

        const place = extractPlaceName(followUrl) || extractPlaceFromHtml(html)
        if (place) {
          const geocoded = await geocodeAddress(place)
          if (geocoded) {
            return new Response(JSON.stringify({ ...geocoded, resolvedUrl: followUrl }), { headers })
          }
          return new Response(JSON.stringify({ place, resolvedUrl: followUrl }), { headers })
        }
      }

      return new Response(JSON.stringify({
        error: 'No coordinates found',
        resolvedUrl: finalUrl,
        visitedUrls,
      }), { status: 404, headers })
    } catch (e) {
      return new Response(JSON.stringify({ error: 'Failed to resolve URL', detail: e.message }), { status: 500, headers })
    }
  },
}

function extractCoordsFromUrl(url) {
  // /@lat,lng format (most common in Google Maps URLs)
  const atMatch = url.match(/@(-?\d{1,3}\.\d{3,8}),(-?\d{1,3}\.\d{3,8})/)
  if (atMatch) {
    const lat = parseFloat(atMatch[1])
    const lng = parseFloat(atMatch[2])
    if (isValid(lat, lng)) return { lat, lng }
  }

  // /search/lat,lng or /search/lat,+lng (Google Maps 2025+ share format)
  const searchMatch = url.match(/\/(?:search|place)\/(-?\d{1,3}\.\d{3,8}),\s?\+?(-?\d{1,3}\.\d{3,8})/)
  if (searchMatch) {
    const lat = parseFloat(searchMatch[1])
    const lng = parseFloat(searchMatch[2])
    if (isValid(lat, lng)) return { lat, lng }
  }

  // !3d(lat)!4d(lng) format (Google Maps data URL encoding)
  const dataMatch = url.match(/!3d(-?\d{1,3}\.\d{3,8})!4d(-?\d{1,3}\.\d{3,8})/)
  if (dataMatch) {
    const lat = parseFloat(dataMatch[1])
    const lng = parseFloat(dataMatch[2])
    if (isValid(lat, lng)) return { lat, lng }
  }

  // ?q=lat,lng or &q=lat,lng and similar query params
  try {
    const parsed = new URL(url)
    for (const key of ['q', 'll', 'center', 'destination', 'query']) {
      const val = parsed.searchParams.get(key)
      if (val) {
        const m = val.match(/^(-?\d{1,3}\.\d{3,8})\s*,\s*(-?\d{1,3}\.\d{3,8})$/)
        if (m) {
          const lat = parseFloat(m[1])
          const lng = parseFloat(m[2])
          if (isValid(lat, lng)) return { lat, lng }
        }
      }
    }
  } catch { /* ignore */ }

  return null
}

function extractCoordsFromHtml(html) {
  if (!html || html.length < 100) return null

  const patterns = [
    // Google Maps APP_INITIALIZATION_STATE data
    /\[null,null,(-?\d{1,3}\.\d{4,8}),(-?\d{1,3}\.\d{4,8})\]/,
    // JSON center coordinates
    /center"?:\s*\[(-?\d{1,3}\.\d{4,8}),\s*(-?\d{1,3}\.\d{4,8})\]/,
    // JSON lat/lng
    /lat"?:\s*(-?\d{1,3}\.\d{4,8}).*?lng"?:\s*(-?\d{1,3}\.\d{4,8})/s,
    // @lat,lng in any context
    /@(-?\d{1,3}\.\d{4,8}),(-?\d{1,3}\.\d{4,8})/,
    // !3d(lat)!4d(lng) in HTML content
    /!3d(-?\d{1,3}\.\d{4,8})!4d(-?\d{1,3}\.\d{4,8})/,
    // Array format [lat, lng, 0]
    /\[(-?\d{1,3}\.\d{4,8}),(-?\d{1,3}\.\d{4,8}),0\]/,
    // og:url or canonical with coordinates
    /content="[^"]*@(-?\d{1,3}\.\d{4,8}),(-?\d{1,3}\.\d{4,8})/,
  ]

  for (const pattern of patterns) {
    const match = html.match(pattern)
    if (match) {
      const a = parseFloat(match[1])
      const b = parseFloat(match[2])
      if (isValid(a, b)) return { lat: a, lng: b }
      if (isValid(b, a)) return { lat: b, lng: a }
    }
  }

  return null
}

function extractPlaceName(url) {
  const placeMatch = url.match(/\/place\/([^/@]+)/)
  if (placeMatch) {
    return decodeURIComponent(placeMatch[1].replace(/\+/g, ' '))
  }
  return null
}

function extractPlaceFromHtml(html) {
  if (!html) return null
  const ogMatch = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]+)"/)
  if (ogMatch && ogMatch[1] && !ogMatch[1].includes('Google Maps') && !ogMatch[1].includes('Dynamic Link')) {
    return ogMatch[1]
  }
  const titleMatch = html.match(/<title>([^<]+)<\/title>/)
  if (titleMatch && titleMatch[1] && !titleMatch[1].includes('Google Maps') && !titleMatch[1].includes('Dynamic Link') && !titleMatch[1].includes('Not Found')) {
    return titleMatch[1].split(' - ')[0].trim()
  }
  return null
}

/**
 * Extract city name from administrative address parts.
 * Google Maps addresses go from small → large: Tambon → District → Province.
 * Returns the LAST valid part (= highest admin level = city/province).
 * "Mueang Chiang Mai District" → "Chiang Mai"
 * "Chang Wat Chiang Mai 50300" → "Chiang Mai"
 */
function extractCityName(parts) {
  const adminPrefixes = /\b(Tambon|Mueang|District|Chang\s*Wat|Changwat|Sub.?district|Province|Amphoe|Amphur|Khet|Khwaeng|Phum|Sangkat)\b/gi

  let last = null
  for (const part of parts) {
    const cleaned = part
      .replace(adminPrefixes, '')
      .replace(/\b\d{4,6}\b/g, '')
      .replace(/\s{2,}/g, ' ')
      .trim()
    if (cleaned.length >= 3) {
      last = cleaned
    }
  }
  return last
}

/**
 * Generate smart address variants for geocoding.
 * Google Maps place names look like:
 * "Business Name Street Addr, District, City Region, Postal, Country"
 * Geocoders fail on business names but work well with street + city.
 */
function buildAddressVariants(place) {
  const variants = []
  const parts = place.split(',').map(p => p.trim())

  // Road/street keyword detection
  const roadRe = /\b(Rd|Road|Ave|Avenue|St|Street|Blvd|Boulevard|Lane|Ln|Dr|Drive|Way|Hwy|Highway|Soi|Alley|Route|Rue|Straße|Strasse|Calle|Carrer|Camino|Via|Viale|Corso|Passage|Chemin|Chaussée|Place|Platz|Plaza)\b/i
  const hasNumber = /\d+\/?[\d]*/

  // Extract city name from middle administrative parts
  const middleParts = parts.slice(1, -1)
  const cityName = extractCityName(middleParts)
  const country = parts.length >= 2 ? parts[parts.length - 1] : ''
  const street = parts[0]

  // 1. Street address without business name + city + country (BEST variant)
  if (parts.length >= 3 && roadRe.test(street) && hasNumber.test(street) && cityName) {
    const numMatch = street.match(/(\d+\/?[\d]*\s+.*)/)
    if (numMatch) {
      variants.push(`${numMatch[1]}, ${cityName}, ${country}`)
    }
  }

  // 2. Full street part + city + country
  if (cityName && country) {
    variants.push(`${street}, ${cityName}, ${country}`)
  }

  // 3. Street address without business name + full remaining
  if (parts.length >= 2 && roadRe.test(street) && hasNumber.test(street)) {
    const numMatch = street.match(/(\d+\/?[\d]*\s+.*)/)
    if (numMatch) {
      variants.push([numMatch[1], ...parts.slice(1)].join(', '))
    }
  }

  // 4. Full address as-is
  variants.push(place)

  // 5. Just city + country
  if (cityName && country) {
    variants.push(`${cityName}, ${country}`)
  }

  // 6. After first comma (existing fallback)
  if (parts.length >= 2) {
    variants.push(parts.slice(1).join(', '))
  }

  // Deduplicate
  return [...new Set(variants)].filter(v => v.length >= 3)
}

/**
 * Server-side geocoding using Nominatim (no CORS issues from Cloudflare Worker).
 * Tries multiple address variants for best accuracy.
 */
async function geocodeAddress(place) {
  const variants = buildAddressVariants(place)

  for (const query of variants) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
        {
          headers: { 'User-Agent': 'SpotHitch/2.0 (https://spothitch.com)' },
          signal: AbortSignal.timeout(4000),
        }
      )
      const data = await res.json()
      if (data?.[0]?.lat && data?.[0]?.lon) {
        const lat = parseFloat(data[0].lat)
        const lng = parseFloat(data[0].lon)
        if (isValid(lat, lng)) return { lat, lng }
      }
    } catch { /* timeout or network error, try next variant */ }
  }

  // Fallback: try Photon geocoder
  for (const query of variants.slice(0, 3)) {
    try {
      const res = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=1`,
        { signal: AbortSignal.timeout(3000) }
      )
      const data = await res.json()
      const feature = data?.features?.[0]
      if (feature?.geometry?.coordinates) {
        const [lng, lat] = feature.geometry.coordinates
        if (isValid(lat, lng)) return { lat, lng }
      }
    } catch { /* try next */ }
  }

  return null
}

function isValid(lat, lng) {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
}
