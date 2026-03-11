/**
 * Cloudflare Worker: Resolve shortened Google Maps URLs
 * Follows redirects server-side to bypass CORS restrictions
 * Then extracts coordinates from the URL or page content
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

    if (!target || !target.match(/^https:\/\/maps\.app\.goo\.gl\//)) {
      return new Response(JSON.stringify({ error: 'Invalid URL' }), { status: 400, headers })
    }

    try {
      const res = await fetch(target, { redirect: 'follow' })
      const finalUrl = res.url

      // 1. Try extracting coords from the resolved URL
      const coords = extractCoordsFromUrl(finalUrl)
      if (coords) {
        return new Response(JSON.stringify({ ...coords, resolvedUrl: finalUrl }), { headers })
      }

      // 2. Try extracting coords from the page HTML content
      const html = await res.text()
      const htmlCoords = extractCoordsFromHtml(html)
      if (htmlCoords) {
        return new Response(JSON.stringify({ ...htmlCoords, resolvedUrl: finalUrl }), { headers })
      }

      // 3. Try extracting place name for client-side geocoding fallback
      const place = extractPlaceName(finalUrl)
      if (place) {
        return new Response(JSON.stringify({ place, resolvedUrl: finalUrl }), { headers })
      }

      return new Response(JSON.stringify({ error: 'No coordinates found', resolvedUrl: finalUrl }), { status: 404, headers })
    } catch (e) {
      return new Response(JSON.stringify({ error: 'Failed to resolve URL' }), { status: 500, headers })
    }
  },
}

function extractCoordsFromUrl(url) {
  // /@lat,lng format
  const atMatch = url.match(/@(-?\d{1,3}\.\d{3,8}),(-?\d{1,3}\.\d{3,8})/)
  if (atMatch) return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) }

  // ?q=lat,lng format
  try {
    const parsed = new URL(url)
    const q = parsed.searchParams.get('q')
    if (q) {
      const qm = q.match(/^(-?\d{1,3}\.\d{3,8})\s*,\s*(-?\d{1,3}\.\d{3,8})$/)
      if (qm) return { lat: parseFloat(qm[1]), lng: parseFloat(qm[2]) }
    }
    const ll = parsed.searchParams.get('ll')
    if (ll) {
      const lm = ll.match(/^(-?\d{1,3}\.\d{3,8})\s*,\s*(-?\d{1,3}\.\d{3,8})$/)
      if (lm) return { lat: parseFloat(lm[1]), lng: parseFloat(lm[2]) }
    }
  } catch { /* ignore */ }

  return null
}

function extractCoordsFromHtml(html) {
  // Google Maps embeds coordinates in various JS structures in the HTML
  // Try: APP_INITIALIZATION_STATE or similar patterns
  const patterns = [
    /\[null,null,(-?\d{1,3}\.\d{4,8}),(-?\d{1,3}\.\d{4,8})\]/,
    /center"?:\s*\[(-?\d{1,3}\.\d{4,8}),\s*(-?\d{1,3}\.\d{4,8})\]/,
    /lat"?:\s*(-?\d{1,3}\.\d{4,8}).*?lng"?:\s*(-?\d{1,3}\.\d{4,8})/s,
    /@(-?\d{1,3}\.\d{4,8}),(-?\d{1,3}\.\d{4,8})/,
    /\[(-?\d{1,3}\.\d{4,8}),(-?\d{1,3}\.\d{4,8}),0\]/,
  ]

  for (const pattern of patterns) {
    const match = html.match(pattern)
    if (match) {
      const lat = parseFloat(match[1])
      const lng = parseFloat(match[2])
      if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        return { lat, lng }
      }
      // Sometimes lat/lng are swapped
      if (lng >= -90 && lng <= 90 && lat >= -180 && lat <= 180) {
        return { lat: lng, lng: lat }
      }
    }
  }

  return null
}

function extractPlaceName(url) {
  // /place/Place+Name/ format
  const placeMatch = url.match(/\/place\/([^/]+)/)
  if (placeMatch) {
    return decodeURIComponent(placeMatch[1].replace(/\+/g, ' '))
  }
  return null
}
