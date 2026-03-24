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

    // Accept short URLs AND full Google Maps URLs (any TLD: google.com, google.fr, etc.)
    const isShortUrl = target.match(/^https?:\/\/(maps\.app\.goo\.gl|goo\.gl|g\.co|goo\.gle)\//)
    const isGoogleMaps = target.match(/^https?:\/\/((www|maps)\.)?google\.[a-z.]{2,6}\/(maps|maps\/.*)/)
    if (!target || (!isShortUrl && !isGoogleMaps)) {
      return new Response(JSON.stringify({ error: 'Invalid URL' }), { status: 400, headers })
    }

    const browserHeaders = {
      'User-Agent': 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
    }

    try {
      // Strategy 0: Try extracting coords directly from the submitted URL
      // (handles full Google Maps URLs with @lat,lng, !3d!4d, ?q=lat,lng, etc.)
      const directCoords = extractCoordsFromUrl(target)
      if (directCoords) {
        return new Response(JSON.stringify({ ...directCoords, resolvedUrl: target }), { headers })
      }

      // Pre-extract place name and ftid from the ORIGINAL URL before any fetch
      // (Google often blocks server-side fetches with captcha, so we need this fallback)
      const originalPlace = extractPlaceName(target) || extractQueryPlace(target)
      const originalFtid = extractFtid(target)

      // Strategy 0b: If we have an ftid from the original URL, try embed resolution FIRST
      // (this bypasses captcha since embed endpoint is more permissive)
      if (originalFtid) {
        const embedCoords = await resolveViaEmbed(originalFtid, originalPlace)
        if (embedCoords) {
          return new Response(JSON.stringify({ ...embedCoords, resolvedUrl: target, method: 'embed' }), { headers })
        }
      }

      // Strategy 1: Follow redirects manually to capture each Location header
      let currentUrl = target
      let finalUrl = target
      const visitedUrls = []
      let gotCaptcha = false

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

          // Detect Google captcha/sorry redirect
          if (currentUrl.includes('/sorry/') || currentUrl.includes('google.com/sorry')) {
            gotCaptcha = true
            break
          }

          // Try extracting coords from each redirect URL
          const coords = extractCoordsFromUrl(currentUrl)
          if (coords) {
            return new Response(JSON.stringify({ ...coords, resolvedUrl: currentUrl }), { headers })
          }
          continue
        }

        // Detect captcha page
        finalUrl = res.url || currentUrl
        if (finalUrl.includes('/sorry/') || finalUrl.includes('google.com/sorry')) {
          gotCaptcha = true
          break
        }

        const coordsFromUrl = extractCoordsFromUrl(finalUrl)
        if (coordsFromUrl) {
          return new Response(JSON.stringify({ ...coordsFromUrl, resolvedUrl: finalUrl }), { headers })
        }

        const html = await res.text()

        // Check if HTML is a captcha page
        if (html.includes('google.com/sorry') || html.includes('unusual traffic')) {
          gotCaptcha = true
          break
        }

        const htmlCoords = extractCoordsFromHtml(html)
        if (htmlCoords) {
          return new Response(JSON.stringify({ ...htmlCoords, resolvedUrl: finalUrl }), { headers })
        }

        const ftid = extractFtid(finalUrl) || extractFtid(html)
        if (ftid) {
          const embedCoords = await resolveViaEmbed(ftid, extractPlaceName(finalUrl))
          if (embedCoords) {
            return new Response(JSON.stringify({ ...embedCoords, resolvedUrl: finalUrl, method: 'embed' }), { headers })
          }
        }

        const place = extractPlaceName(finalUrl) || extractPlaceFromHtml(html)
        if (place) {
          const geocoded = await geocodeAddress(place)
          if (geocoded) {
            return new Response(JSON.stringify({ ...geocoded, resolvedUrl: finalUrl, method: 'geocode' }), { headers })
          }
          return new Response(JSON.stringify({ place, resolvedUrl: finalUrl }), { headers })
        }

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

      // Strategy 2: If Google blocked us with captcha, use pre-extracted place name
      // to geocode directly (no need to fetch the page)
      if (gotCaptcha && originalPlace) {
        const geocoded = await geocodeAddress(originalPlace)
        if (geocoded) {
          return new Response(JSON.stringify({ ...geocoded, resolvedUrl: target, method: 'geocode-fallback' }), { headers })
        }
        return new Response(JSON.stringify({ place: originalPlace, resolvedUrl: target, method: 'place-only' }), { headers })
      }

      // Strategy 3: Try with redirect: 'follow' as fallback (only if not captcha'd)
      if (!gotCaptcha) {
        try {
          const followRes = await fetch(target, {
            redirect: 'follow',
            headers: browserHeaders,
          })
          const followUrl = followRes.url
          if (followUrl && followUrl !== target && !followUrl.includes('/sorry/')) {
            const coords = extractCoordsFromUrl(followUrl)
            if (coords) {
              return new Response(JSON.stringify({ ...coords, resolvedUrl: followUrl }), { headers })
            }

            const html = await followRes.text()
            if (!html.includes('google.com/sorry') && !html.includes('unusual traffic')) {
              const htmlCoords = extractCoordsFromHtml(html)
              if (htmlCoords) {
                return new Response(JSON.stringify({ ...htmlCoords, resolvedUrl: followUrl }), { headers })
              }

              const ftid = extractFtid(followUrl) || extractFtid(html)
              if (ftid) {
                const embedCoords = await resolveViaEmbed(ftid, extractPlaceName(followUrl))
                if (embedCoords) {
                  return new Response(JSON.stringify({ ...embedCoords, resolvedUrl: followUrl, method: 'embed' }), { headers })
                }
              }

              const place = extractPlaceName(followUrl) || extractPlaceFromHtml(html)
              if (place) {
                const geocoded = await geocodeAddress(place)
                if (geocoded) {
                  return new Response(JSON.stringify({ ...geocoded, resolvedUrl: followUrl, method: 'geocode' }), { headers })
                }
              }
            }
          }
        } catch { /* follow fetch failed */ }
      }

      // Strategy 4: Last resort — geocode the original place name
      if (originalPlace) {
        const geocoded = await geocodeAddress(originalPlace)
        if (geocoded) {
          return new Response(JSON.stringify({ ...geocoded, resolvedUrl: target, method: 'geocode-lastresort' }), { headers })
        }
        return new Response(JSON.stringify({ place: originalPlace, resolvedUrl: target, method: 'place-only' }), { headers })
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
  const atMatch = url.match(/@(-?\d{1,3}\.\d{3,15}),(-?\d{1,3}\.\d{3,15})/)
  if (atMatch) {
    const lat = parseFloat(atMatch[1])
    const lng = parseFloat(atMatch[2])
    if (isValid(lat, lng)) return { lat, lng }
  }

  // /search/lat,lng or /place/lat,lng (Google Maps share formats)
  const searchMatch = url.match(/\/(?:search|place)\/(-?\d{1,3}\.\d{3,15}),\s?\+?(-?\d{1,3}\.\d{3,15})/)
  if (searchMatch) {
    const lat = parseFloat(searchMatch[1])
    const lng = parseFloat(searchMatch[2])
    if (isValid(lat, lng)) return { lat, lng }
  }

  // /dir/ with coords anywhere (take last = destination)
  if (url.includes('/dir/')) {
    const allCoords = [...url.matchAll(/(-?\d{1,3}\.\d{3,15}),(-?\d{1,3}\.\d{3,15})/g)]
    if (allCoords.length > 0) {
      const last = allCoords[allCoords.length - 1]
      const lat = parseFloat(last[1])
      const lng = parseFloat(last[2])
      if (isValid(lat, lng)) return { lat, lng }
    }
  }

  // !3d(lat)!4d(lng) format (Google Maps data URL encoding)
  const dataMatch = url.match(/!3d(-?\d{1,3}\.\d{3,15})!4d(-?\d{1,3}\.\d{3,15})/)
  if (dataMatch) {
    const lat = parseFloat(dataMatch[1])
    const lng = parseFloat(dataMatch[2])
    if (isValid(lat, lng)) return { lat, lng }
  }

  // ?q=lat,lng or &q=lat,lng and similar query params
  try {
    const parsed = new URL(url)
    for (const key of ['q', 'll', 'center', 'destination', 'origin', 'query', 'saddr', 'daddr', 'viewpoint', 'sll', 'cbll']) {
      const val = parsed.searchParams.get(key)
      if (val) {
        const m = val.match(/^(-?\d{1,3}\.\d{1,15})\s*,\s*(-?\d{1,3}\.\d{1,15})$/)
        if (m) {
          const lat = parseFloat(m[1])
          const lng = parseFloat(m[2])
          if (isValid(lat, lng)) return { lat, lng }
        }
      }
    }
  } catch { /* ignore */ }

  // Fallback: decode %40 and try @lat,lng again
  try {
    const decoded = decodeURIComponent(url)
    const atFallback = decoded.match(/@(-?\d{1,3}\.\d{3,15}),(-?\d{1,3}\.\d{3,15})/)
    if (atFallback) {
      const lat = parseFloat(atFallback[1])
      const lng = parseFloat(atFallback[2])
      if (isValid(lat, lng)) return { lat, lng }
    }
  } catch { /* ignore */ }

  // Last resort: any coordinate pair in a map URL
  const anyCoords = url.match(/(-?\d{1,2}\.\d{4,15}),(-?\d{1,3}\.\d{4,15})/)
  if (anyCoords) {
    const lat = parseFloat(anyCoords[1])
    const lng = parseFloat(anyCoords[2])
    if (isValid(lat, lng)) return { lat, lng }
  }

  return null
}

function extractCoordsFromHtml(html) {
  if (!html || html.length < 100) return null

  const patterns = [
    // Google Maps APP_INITIALIZATION_STATE: [null,null,lat,lng] or [null,null,lng,lat]
    /\[null,null,(-?\d{1,3}\.\d{4,15}),(-?\d{1,3}\.\d{4,15})\]/,
    // APP_OPTIONS data: [[lat,lng]] or center:[lat,lng]
    /center"?:\s*\[(-?\d{1,3}\.\d{4,15}),\s*(-?\d{1,3}\.\d{4,15})\]/,
    // JSON lat/lng properties
    /lat"?:\s*(-?\d{1,3}\.\d{4,15}).*?lng"?:\s*(-?\d{1,3}\.\d{4,15})/s,
    // latitude/longitude properties
    /latitude"?:\s*(-?\d{1,3}\.\d{4,15}).*?longitude"?:\s*(-?\d{1,3}\.\d{4,15})/s,
    // @lat,lng in any context (URLs, scripts, etc.)
    /@(-?\d{1,3}\.\d{4,15}),(-?\d{1,3}\.\d{4,15})/,
    // !3d(lat)!4d(lng) in HTML content
    /!3d(-?\d{1,3}\.\d{4,15})!4d(-?\d{1,3}\.\d{4,15})/,
    // Array format [lat, lng, 0] (Google Maps JS data)
    /\[(-?\d{1,3}\.\d{4,15}),(-?\d{1,3}\.\d{4,15}),0\]/,
    // og:url or og:image with coordinates
    /content="[^"]*@(-?\d{1,3}\.\d{4,15}),(-?\d{1,3}\.\d{4,15})/,
    // og:image with center= param (static maps thumbnail)
    /og:image[^>]*content="[^"]*center=(-?\d{1,3}\.\d{4,15})(?:%2C|,)(-?\d{1,3}\.\d{4,15})/i,
    // Google Maps initEmbed data: numbers in arrays like ,[lat],[lng],
    /,(-?\d{1,2}\.\d{5,15}),(-?\d{1,3}\.\d{5,15}),/,
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

/**
 * Extract Google Maps feature ID (ftid) from a place URL or HTML.
 * Format: "0x<hex>:0x<hex>" found in data=...!1s... parameter or in page source
 */
function extractFtid(str) {
  if (!str) return null
  // !1s format (most common in URLs)
  const match = str.match(/!1s(0x[0-9a-f]+:0x[0-9a-f]+)/i)
  if (match) return match[1]
  // ftid= query parameter
  const ftidParam = str.match(/ftid=(0x[0-9a-f]+:0x[0-9a-f]+)/i)
  if (ftidParam) return ftidParam[1]
  // Hex format in HTML/JS data
  const hexMatch = str.match(/"(0x[0-9a-f]{10,}:0x[0-9a-f]{10,})"/i)
  if (hexMatch) return hexMatch[1]
  return null
}

/**
 * Resolve exact coordinates via Google Maps embed endpoint.
 * The embed response contains exact place coordinates in a small HTML page.
 * This is much more reliable than parsing the full Google Maps page.
 */
async function resolveViaEmbed(ftid, placeName) {
  try {
    const name = placeName ? encodeURIComponent(placeName) : 'place'
    const embedUrl = `https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1000!2d0!3d0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s${encodeURIComponent(ftid)}!2s${name}!5e0`
    const res = await fetch(embedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36',
        'Accept': 'text/html',
      },
      signal: AbortSignal.timeout(6000),
    })
    const html = await res.text()

    // Embed response contains: [lat,lng] in JSON array format
    // Pattern: ",[lat,lng]," where lat/lng are the exact place coordinates
    const coordMatch = html.match(/\[(-?\d{1,3}\.\d{4,10}),(-?\d{1,3}\.\d{4,15})\]/)
    if (coordMatch) {
      const a = parseFloat(coordMatch[1])
      const b = parseFloat(coordMatch[2])
      // Google embed returns [lat,lng] - verify which is which
      if (isValid(a, b)) return { lat: a, lng: b }
      if (isValid(b, a)) return { lat: b, lng: a }
    }

    // Also try the viewport center format: [zoom, lng, lat]
    const viewMatch = html.match(/\[\d+,(-?\d{1,3}\.\d{4,15}),(-?\d{1,3}\.\d{4,10})\]/)
    if (viewMatch) {
      const lng = parseFloat(viewMatch[1])
      const lat = parseFloat(viewMatch[2])
      if (isValid(lat, lng)) return { lat, lng }
    }
  } catch { /* embed fetch failed */ }

  return null
}

function extractPlaceName(url) {
  const placeMatch = url.match(/\/place\/([^/@]+)/)
  if (placeMatch) {
    return decodeURIComponent(placeMatch[1].replace(/\+/g, ' '))
  }
  return null
}

/**
 * Extract a place name from query parameters (?q=, ?query=, ?destination=)
 * or from /search/ path. Only returns non-coordinate values.
 */
function extractQueryPlace(url) {
  try {
    const parsed = new URL(url)
    // Check query parameters
    for (const key of ['q', 'query', 'destination', 'origin', 'saddr', 'daddr']) {
      const val = parsed.searchParams.get(key)
      if (val && !val.match(/^-?\d{1,3}\.\d+\s*,\s*-?\d{1,3}\.\d+$/)) {
        return decodeURIComponent(val.replace(/\+/g, ' '))
      }
    }
    // Check /search/... path
    const searchMatch = parsed.pathname.match(/\/search\/([^/]+)/)
    if (searchMatch) {
      const term = decodeURIComponent(searchMatch[1].replace(/\+/g, ' '))
      if (!term.match(/^-?\d{1,3}\.\d+\s*,\s*-?\d{1,3}\.\d+$/)) {
        return term
      }
    }
    // Check /dir/PlaceName/PlaceName (extract destination = last segment)
    const dirMatch = parsed.pathname.match(/\/dir\/[^/]+\/([^/]+)/)
    if (dirMatch) {
      const term = decodeURIComponent(dirMatch[1].replace(/\+/g, ' '))
      if (!term.match(/^-?\d{1,3}\.\d+\s*,\s*-?\d{1,3}\.\d+$/)) {
        return term
      }
    }
  } catch { /* not a valid URL */ }
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
