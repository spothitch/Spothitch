/**
 * Cloudflare Worker: Resolve shortened Google Maps URLs
 * Follows redirects manually to extract coordinates from the final URL
 * Google Maps short URLs (maps.app.goo.gl/xxx) redirect via HTTP 302
 * to a full URL containing @lat,lng coordinates
 */
export default {
  async fetch(request) {
    const url = new URL(request.url)
    const target = url.searchParams.get('url')

    // CORS headers for SpotHitch
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Content-Type': 'application/json',
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers })
    }

    if (!target || !target.match(/^https:\/\/(maps\.app\.goo\.gl|goo\.gl)\//)) {
      return new Response(JSON.stringify({ error: 'Invalid URL' }), { status: 400, headers })
    }

    try {
      // Strategy 1: Follow redirects manually to capture each Location header
      // Google Maps short URLs do HTTP 302 → full URL with @lat,lng
      let currentUrl = target
      let finalUrl = target
      const browserHeaders = {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      }

      // Follow up to 10 redirects manually
      for (let i = 0; i < 10; i++) {
        const res = await fetch(currentUrl, {
          redirect: 'manual',
          headers: browserHeaders,
        })

        // Check for redirect (301, 302, 303, 307, 308)
        if (res.status >= 300 && res.status < 400) {
          const location = res.headers.get('location')
          if (!location) break

          // Resolve relative URLs
          currentUrl = location.startsWith('http') ? location : new URL(location, currentUrl).href
          finalUrl = currentUrl

          // Try extracting coords from each redirect URL
          const coords = extractCoordsFromUrl(currentUrl)
          if (coords) {
            return new Response(JSON.stringify({ ...coords, resolvedUrl: currentUrl }), { headers })
          }
          continue
        }

        // We got a 200 (or other non-redirect) — try extracting from this URL
        finalUrl = res.url || currentUrl
        const coordsFromUrl = extractCoordsFromUrl(finalUrl)
        if (coordsFromUrl) {
          return new Response(JSON.stringify({ ...coordsFromUrl, resolvedUrl: finalUrl }), { headers })
        }

        // Try extracting from the page HTML
        const html = await res.text()
        const htmlCoords = extractCoordsFromHtml(html)
        if (htmlCoords) {
          return new Response(JSON.stringify({ ...htmlCoords, resolvedUrl: finalUrl }), { headers })
        }

        // Try extracting place name for client-side geocoding
        const place = extractPlaceName(finalUrl) || extractPlaceFromHtml(html)
        if (place) {
          return new Response(JSON.stringify({ place, resolvedUrl: finalUrl }), { headers })
        }

        break
      }

      // Strategy 2: Try with redirect: 'follow' as fallback
      // (in case manual redirect following missed something)
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
      }

      return new Response(JSON.stringify({ error: 'No coordinates found', resolvedUrl: finalUrl }), { status: 404, headers })
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

  // ?q=lat,lng or &q=lat,lng format
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

  // !3d(lat)!4d(lng) format (Google Maps data URL encoding)
  const dataMatch = url.match(/!3d(-?\d{1,3}\.\d{3,8})!4d(-?\d{1,3}\.\d{3,8})/)
  if (dataMatch) {
    const lat = parseFloat(dataMatch[1])
    const lng = parseFloat(dataMatch[2])
    if (isValid(lat, lng)) return { lat, lng }
  }

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
    // Array format [lat, lng, 0]
    /\[(-?\d{1,3}\.\d{4,8}),(-?\d{1,3}\.\d{4,8}),0\]/,
    // !3d(lat)!4d(lng) in HTML content
    /!3d(-?\d{1,3}\.\d{4,8})!4d(-?\d{1,3}\.\d{4,8})/,
    // og:url or canonical with coordinates
    /content="[^"]*@(-?\d{1,3}\.\d{4,8}),(-?\d{1,3}\.\d{4,8})/,
  ]

  for (const pattern of patterns) {
    const match = html.match(pattern)
    if (match) {
      const a = parseFloat(match[1])
      const b = parseFloat(match[2])
      if (isValid(a, b)) return { lat: a, lng: b }
      // Sometimes lat/lng are swapped in data arrays
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
  // Try og:title meta tag
  const ogMatch = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]+)"/)
  if (ogMatch && ogMatch[1] && !ogMatch[1].includes('Google Maps')) {
    return ogMatch[1]
  }
  // Try <title> tag
  const titleMatch = html.match(/<title>([^<]+)<\/title>/)
  if (titleMatch && titleMatch[1] && !titleMatch[1].includes('Google Maps')) {
    return titleMatch[1].split(' - ')[0].trim()
  }
  return null
}

function isValid(lat, lng) {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
}
