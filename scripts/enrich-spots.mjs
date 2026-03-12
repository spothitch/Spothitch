#!/usr/bin/env node
/**
 * enrich-spots.mjs — Enrichit les spots Hitchwiki
 *
 * Transforme les spots bruts en fiches complètes :
 * - Reverse geocoding (Photon API) → noms de villes
 * - Logique "grande ville" (>100k hab, <30km)
 * - Numérotation par ville
 * - Notes sécurité/trafic/accessibilité déduites
 * - Type de spot déduit des commentaires
 * - Descriptions factuelles en 4 langues
 * - validationCount/testCount depuis reviews
 *
 * Usage: node scripts/enrich-spots.mjs [--dry-run] [--skip-geocode] [--country XX]
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SPOTS_DIR = join(__dirname, '..', 'public', 'data', 'spots')
const CACHE_FILE = join(__dirname, 'geocode-cache.json')
const CITIES_FILE = join(__dirname, 'big-cities.json')
const INDEX_FILE = join(SPOTS_DIR, 'index.json')

// CLI args
const args = process.argv.slice(2)
const DRY_RUN = args.includes('--dry-run')
const SKIP_GEOCODE = args.includes('--skip-geocode')
const COUNTRY_FILTER = args.find(a => a.startsWith('--country='))?.split('=')[1]?.toUpperCase()

// ─── Big cities database ───────────────────────────────────────────────
let bigCities = []
if (existsSync(CITIES_FILE)) {
  bigCities = JSON.parse(readFileSync(CITIES_FILE, 'utf-8'))
  console.log(`📍 ${bigCities.length} grandes villes chargées`)
} else {
  console.error('❌ big-cities.json manquant. Lancer le script de téléchargement GeoNames.')
  process.exit(1)
}

// ─── Geocode cache ─────────────────────────────────────────────────────
let geocodeCache = {}
if (existsSync(CACHE_FILE)) {
  geocodeCache = JSON.parse(readFileSync(CACHE_FILE, 'utf-8'))
  console.log(`💾 Cache géocodage : ${Object.keys(geocodeCache).length} entrées`)
}

function saveCache() {
  writeFileSync(CACHE_FILE, JSON.stringify(geocodeCache), 'utf-8')
}

// ─── Helpers ───────────────────────────────────────────────────────────

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

/**
 * Find nearest big city (>100k pop) within 30km
 */
function findNearestBigCity(lat, lon) {
  let best = null
  let bestDist = Infinity
  for (const city of bigCities) {
    // Quick filter: skip cities more than ~0.3° away (rough ~33km at equator)
    if (Math.abs(city.lat - lat) > 0.4 || Math.abs(city.lon - lon) > 0.5) continue
    const d = haversineKm(lat, lon, city.lat, city.lon)
    if (d < 30 && d < bestDist) {
      best = city
      bestDist = d
    }
  }
  return best
}

/**
 * Reverse geocode via Photon API with retries
 */
async function reverseGeocode(lat, lon) {
  const key = `${lat.toFixed(4)},${lon.toFixed(4)}`
  if (geocodeCache[key]) return geocodeCache[key]

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const url = `https://photon.komoot.io/reverse?lat=${lat}&lon=${lon}`
      const res = await fetch(url)
      if (!res.ok) {
        if (res.status === 429) {
          console.log('  ⏳ Rate limited, waiting 2s...')
          await sleep(2000)
          continue
        }
        throw new Error(`HTTP ${res.status}`)
      }
      const data = await res.json()
      const props = data.features?.[0]?.properties || {}
      const result = {
        city: props.city || props.town || props.village || props.name || null,
        county: props.county || null,
        state: props.state || null,
        country: props.country || null,
        locality: props.locality || props.district || null,
      }
      geocodeCache[key] = result
      return result
    } catch (err) {
      if (attempt < 2) {
        await sleep(500 * (attempt + 1))
      } else {
        // Don't cache failures — they can be retried next run
        return null
      }
    }
  }
}

// ─── Spot filtering ────────────────────────────────────────────────────

function shouldKeepSpot(spot) {
  // Keep spots with: destination + wait time > 0 + rating > 0 + at least 1 comment with text
  const hasDestination = spot.destLat != null && spot.destLon != null
  const hasWait = spot.wait > 0
  const hasRating = spot.rating > 0
  const hasComments = spot.comments?.some(c => c.text && c.text.trim().length > 10)
  return hasDestination && hasWait && hasRating && hasComments
}

// ─── Rating deduction ──────────────────────────────────────────────────

const SAFETY_POSITIVE = /\b(safe|friendly|nice|good|great|easy|relaxed|chill|fine)\b/i
const SAFETY_NEGATIVE = /\b(dangerous|scary|sketchy|unsafe|avoid|risky|dark|shady|dodgy|aggressive)\b/i
const ACCESS_POSITIVE = /\b(space|visible|easy|pull over|parking|wide|big|good spot|perfect spot)\b/i
const ACCESS_NEGATIVE = /\b(narrow|hard|difficult|no space|blind|tight|small|bad spot)\b/i
const TRAFFIC_POSITIVE = /\b(busy|traffic|lots of cars|many cars|fast|quick|instant)\b/i
const TRAFFIC_NEGATIVE = /\b(no traffic|few cars|dead|empty|slow|quiet road|no cars)\b/i

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, Math.round(n)))
}

function deduceRatings(spot) {
  const allComments = (spot.comments || []).map(c => c.text || '').join(' ')

  // Safety: base from hitchwiki rating, adjusted by keywords
  let safety = spot.rating
  if (SAFETY_POSITIVE.test(allComments)) safety += 0.5
  if (SAFETY_NEGATIVE.test(allComments)) safety -= 1

  // Traffic: from wait time
  let traffic
  if (spot.wait <= 10) traffic = 5
  else if (spot.wait <= 20) traffic = 4
  else if (spot.wait <= 30) traffic = 3
  else if (spot.wait <= 45) traffic = 2
  else traffic = 1
  if (TRAFFIC_POSITIVE.test(allComments)) traffic += 0.5
  if (TRAFFIC_NEGATIVE.test(allComments)) traffic -= 0.5

  // Accessibility: base from hitchwiki rating, adjusted by keywords
  let accessibility = spot.rating
  if (ACCESS_POSITIVE.test(allComments)) accessibility += 0.5
  if (ACCESS_NEGATIVE.test(allComments)) accessibility -= 1

  return {
    safety: clamp(safety, 1, 5),
    traffic: clamp(traffic, 1, 5),
    accessibility: clamp(accessibility, 1, 5),
  }
}

// ─── Spot type deduction ───────────────────────────────────────────────

const GAS_STATION = /\b(gas station|petrol|tankstelle|service station|gas pump|fuel|gasolinera|benzin|filling station|péage|toll|mautstation)\b/i
const CITY_EXIT = /\b(ramp|exit|sortie|city exit|on-ramp|slip road|auffahrt|salida|entrance|junction)\b/i
const HIGHWAY = /\b(highway|motorway|autobahn|autoroute|autopista|autostrada|freeway|interstate)\b/i

function deduceSpotType(spot) {
  const allText = (spot.comments || []).map(c => c.text || '').join(' ')
  if (GAS_STATION.test(allText)) return 'gas_station'
  if (HIGHWAY.test(allText)) return 'highway'
  if (CITY_EXIT.test(allText)) return 'city_exit'
  return 'custom'
}

// ─── Description generation ────────────────────────────────────────────

const SPOT_TYPE_LABELS = {
  gas_station: { en: 'Gas station spot', fr: 'Spot station-service', es: 'Punto gasolinera', de: 'Tankstelle' },
  city_exit: { en: 'City exit spot', fr: 'Sortie de ville', es: 'Salida de ciudad', de: 'Stadtausfahrt' },
  highway: { en: 'Highway spot', fr: 'Spot autoroute', es: 'Punto autopista', de: 'Autobahnstelle' },
  custom: { en: 'Roadside spot', fr: 'Bord de route', es: 'Al borde de la carretera', de: 'Straßenrand' },
}

/**
 * Extract the most useful sentence from comments (the one with most info)
 */
function extractBestTip(comments) {
  if (!comments?.length) return ''

  // Score each comment by information density
  const scored = comments
    .map(c => c.text || '')
    .filter(t => t.length > 20)
    .map(text => {
      let score = 0
      // Longer = more info (up to a point)
      score += Math.min(text.length / 50, 3)
      // Contains useful keywords
      if (/wait|stood|minute|hour/i.test(text)) score += 1
      if (/sign|thumb|panneau/i.test(text)) score += 1
      if (/safe|danger|night|dark/i.test(text)) score += 1
      if (/walk|bus|tram|train|metro/i.test(text)) score += 1
      if (/best|good|great|perfect|recommend/i.test(text)) score += 1
      if (/avoid|don't|difficult|hard/i.test(text)) score += 1
      return { text, score }
    })
    .sort((a, b) => b.score - a.score)

  if (!scored.length) return ''

  // Take the best comment and trim to ~150 chars at a sentence boundary
  let tip = scored[0].text
  if (tip.length > 180) {
    const cut = tip.lastIndexOf('.', 170)
    if (cut > 50) {
      tip = tip.slice(0, cut + 1)
    } else {
      tip = tip.slice(0, 175) + '...'
    }
  }
  return tip
}

function generateDescriptions(spot, cityName, ratings) {
  const type = spot._enrichedType || 'custom'
  const wait = spot.wait
  const reviews = spot.reviews || 0
  const tip = extractBestTip(spot.comments)

  // Build factual descriptions in 4 languages
  const typeLabel = SPOT_TYPE_LABELS[type] || SPOT_TYPE_LABELS.custom

  const waitEn = wait ? `Average wait: ${wait} min.` : ''
  const waitFr = wait ? `Attente moyenne : ${wait} min.` : ''
  const waitEs = wait ? `Espera media: ${wait} min.` : ''
  const waitDe = wait ? `Wartezeit: ca. ${wait} min.` : ''

  const testedEn = reviews > 1 ? `Tested by ${reviews} hitchhikers.` : reviews === 1 ? 'Tested by 1 hitchhiker.' : ''
  const testedFr = reviews > 1 ? `Testé par ${reviews} auto-stoppeurs.` : reviews === 1 ? 'Testé par 1 auto-stoppeur.' : ''
  const testedEs = reviews > 1 ? `Probado por ${reviews} autoestopistas.` : reviews === 1 ? 'Probado por 1 autoestopista.' : ''
  const testedDe = reviews > 1 ? `Getestet von ${reviews} Trampern.` : reviews === 1 ? 'Getestet von 1 Tramper.' : ''

  const avgRating = ((ratings.safety + ratings.traffic + ratings.accessibility) / 3).toFixed(1)

  const descEn = [typeLabel.en + '.', waitEn, testedEn, tip].filter(Boolean).join(' ').slice(0, 300)
  const descFr = [typeLabel.fr + '.', waitFr, testedFr].filter(Boolean).join(' ').slice(0, 300)
  const descEs = [typeLabel.es + '.', waitEs, testedEs].filter(Boolean).join(' ').slice(0, 300)
  const descDe = [typeLabel.de + '.', waitDe, testedDe].filter(Boolean).join(' ').slice(0, 300)

  return { descriptionEn: descEn, descriptionFr: descFr, descriptionEs: descEs, descriptionDe: descDe }
}

// ─── Main ──────────────────────────────────────────────────────────────

async function main() {
  console.log('═══════════════════════════════════════════════════')
  console.log('  ENRICHISSEMENT DES SPOTS HITCHWIKI')
  console.log('═══════════════════════════════════════════════════')
  if (DRY_RUN) console.log('  ⚠️  Mode DRY RUN — aucun fichier ne sera modifié')
  if (SKIP_GEOCODE) console.log('  ⚠️  Skip geocode — utilise le cache uniquement')
  if (COUNTRY_FILTER) console.log(`  🔍 Filtre pays : ${COUNTRY_FILTER}`)
  console.log('')

  // Load index
  const index = JSON.parse(readFileSync(INDEX_FILE, 'utf-8'))
  const countryFiles = readdirSync(SPOTS_DIR)
    .filter(f => f.endsWith('.json') && f !== 'index.json')
    .filter(f => !COUNTRY_FILTER || f.replace('.json', '').toUpperCase() === COUNTRY_FILTER)
    .sort()

  console.log(`📁 ${countryFiles.length} fichiers pays à traiter`)

  let totalKept = 0
  let totalRemoved = 0
  let totalGeocoded = 0
  let totalGreen = 0
  let totalGold = 0
  let totalGrey = 0
  const allSpotsByCity = new Map() // cityName → [spots]
  const allSpotsFlat = [] // all spots for numbering pass

  // ─── Phase 1: Load + Filter ────────────────────────────────────
  console.log('\n── Phase 1 : Chargement et filtrage ──')

  const countriesData = [] // { file, code, data, keptSpots }

  for (const file of countryFiles) {
    const filePath = join(SPOTS_DIR, file)
    const data = JSON.parse(readFileSync(filePath, 'utf-8'))
    const code = data.country || file.replace('.json', '').toUpperCase()

    const kept = data.spots.filter(shouldKeepSpot)
    const removed = data.spots.length - kept.length

    totalKept += kept.length
    totalRemoved += removed

    if (removed > 0) {
      console.log(`  ${code}: ${data.spots.length} → ${kept.length} spots (${removed} supprimés)`)
    }

    countriesData.push({ file, code, data, keptSpots: kept })
  }

  console.log(`\n  ✅ Total : ${totalKept} gardés, ${totalRemoved} supprimés`)

  // ─── Phase 2: Reverse Geocoding ────────────────────────────────
  console.log('\n── Phase 2 : Reverse geocoding ──')

  const cachedCount = Object.keys(geocodeCache).length
  let needGeocode = 0

  // Count how many need geocoding
  for (const { keptSpots } of countriesData) {
    for (const spot of keptSpots) {
      const key = `${spot.lat.toFixed(4)},${spot.lon.toFixed(4)}`
      if (!geocodeCache[key]) needGeocode++
    }
  }

  console.log(`  💾 ${cachedCount} en cache, ${needGeocode} à géocoder`)

  if (needGeocode > 0 && !SKIP_GEOCODE) {
    const estimatedMin = Math.ceil(needGeocode * 0.2 / 60)
    console.log(`  ⏱️  Estimation : ~${estimatedMin} min (200ms entre chaque appel)`)

    let geocoded = 0
    let consecutiveFailures = 0
    let lastSave = Date.now()

    for (const { code, keptSpots } of countriesData) {
      if (consecutiveFailures >= 10) break
      for (const spot of keptSpots) {
        const key = `${spot.lat.toFixed(4)},${spot.lon.toFixed(4)}`
        if (geocodeCache[key]) continue

        const result = await reverseGeocode(spot.lat, spot.lon)
        geocoded++
        totalGeocoded++

        if (result === null) {
          consecutiveFailures++
          if (consecutiveFailures >= 10) {
            console.log('  ⛔ 10 échecs consécutifs — Photon bloqué, arrêt du géocodage')
            console.log('  💡 Les spots manquants utiliseront la grande ville la plus proche')
            break
          }
        } else {
          consecutiveFailures = 0
        }

        if (geocoded % 100 === 0) {
          const pct = ((geocoded / needGeocode) * 100).toFixed(1)
          console.log(`  📍 ${geocoded}/${needGeocode} (${pct}%)`)
        }

        // Save cache every 30s
        if (Date.now() - lastSave > 30000) {
          saveCache()
          lastSave = Date.now()
        }

        await sleep(200)
      }
    }

    saveCache()
    console.log(`  ✅ ${totalGeocoded} spots traités (${Object.keys(geocodeCache).length} en cache)`)
  } else if (SKIP_GEOCODE) {
    console.log('  ⏭️  Géocodage ignoré')
  } else {
    console.log('  ✅ Tout est en cache')
  }

  // ─── Phase 3: Resolve city names (big city logic) ──────────────
  console.log('\n── Phase 3 : Résolution des noms de villes ──')

  let fallbackCount = 0
  let noNameCount = 0

  for (const { code, keptSpots } of countriesData) {
    for (const spot of keptSpots) {
      const key = `${spot.lat.toFixed(4)},${spot.lon.toFixed(4)}`
      const geo = geocodeCache[key]

      let cityName = geo?.city || geo?.county || geo?.state || null

      // Big city logic: always check for nearby big city
      const nearbyBig = findNearestBigCity(spot.lat, spot.lon)
      if (nearbyBig) {
        // Use big city name (either as upgrade from small city, or as fallback)
        if (!cityName) fallbackCount++
        cityName = nearbyBig.name
      } else if (!cityName) {
        // No geocode AND no big city nearby — skip this spot
        noNameCount++
        continue
      }

      spot._cityName = cityName
      spot._countryCode = code

      // Track for numbering
      const cityKey = `${code}_${cityName}`
      if (!allSpotsByCity.has(cityKey)) allSpotsByCity.set(cityKey, [])
      allSpotsByCity.get(cityKey).push(spot)
      allSpotsFlat.push(spot)
    }
  }

  console.log(`  ✅ ${allSpotsByCity.size} villes identifiées`)
  console.log(`  🔄 ${fallbackCount} spots avec fallback grande ville`)
  if (noNameCount > 0) console.log(`  ❌ ${noNameCount} spots sans nom de ville (supprimés)`)

  // ─── Phase 4: Number spots per city ────────────────────────────
  console.log('\n── Phase 4 : Numérotation par ville ──')

  let multiSpotCities = 0
  for (const [cityKey, spots] of allSpotsByCity) {
    if (spots.length === 1) {
      spots[0]._title = spots[0]._cityName
    } else {
      multiSpotCities++
      // Sort by rating (best first) then by reviews
      spots.sort((a, b) => (b.rating - a.rating) || ((b.reviews || 0) - (a.reviews || 0)))
      spots.forEach((s, i) => {
        s._title = `${s._cityName} #${i + 1}`
      })
    }
  }

  console.log(`  ✅ ${multiSpotCities} villes avec plusieurs spots (numérotés)`)

  // ─── Phase 5: Enrich each spot ─────────────────────────────────
  console.log('\n── Phase 5 : Enrichissement ──')

  for (const spot of allSpotsFlat) {
    // Ratings
    const ratings = deduceRatings(spot)
    spot._enrichedRatings = ratings

    // Spot type
    spot._enrichedType = deduceSpotType(spot)

    // Descriptions
    const descs = generateDescriptions(spot, spot._cityName, ratings)
    spot._descriptions = descs

    // Tier (validation count from reviews)
    const reviews = spot.reviews || 0
    if (reviews >= 10) totalGold++
    else if (reviews >= 3) totalGreen++
    else totalGrey++
  }

  console.log(`  🟡 ${totalGold} dorés (10+ reviews)`)
  console.log(`  🟢 ${totalGreen} verts (3-9 reviews)`)
  console.log(`  ⚪ ${totalGrey} gris (0-2 reviews)`)

  // ─── Phase 6: Write enriched files ─────────────────────────────
  console.log('\n── Phase 6 : Écriture des fichiers ──')

  const newIndex = {
    totalCountries: 0,
    totalLocations: 0,
    totalReviews: 0,
    lastUpdated: new Date().toISOString().split('T')[0],
    countries: [],
  }

  for (const { file, code, data, keptSpots } of countriesData) {
    // Build enriched spots array (only spots that passed phase 3 — have a title)
    const enrichedSpots = keptSpots.filter(s => s._title).map(spot => {
      const enriched = {
        id: spot.id,
        lat: spot.lat,
        lon: spot.lon,
        rating: spot.rating,
        reviews: spot.reviews || 0,
        wait: spot.wait,
        signal: spot.signal,
        lastUsed: spot.lastUsed,
        comments: spot.comments,
        destLat: spot.destLat,
        destLon: spot.destLon,
        // New enriched fields
        from: spot._title,
        safetyRating: spot._enrichedRatings.safety,
        trafficRating: spot._enrichedRatings.traffic,
        accessibilityRating: spot._enrichedRatings.accessibility,
        spotType: spot._enrichedType,
        descriptionEn: spot._descriptions.descriptionEn,
        descriptionFr: spot._descriptions.descriptionFr,
        descriptionEs: spot._descriptions.descriptionEs,
        descriptionDe: spot._descriptions.descriptionDe,
        source: 'hitchwiki',
        attribution: 'Hitchwiki (ODBL)',
      }
      return enriched
    })

    // Compute country-level stats
    const totalReviews = enrichedSpots.reduce((sum, s) => sum + (s.reviews || 0), 0)

    const enrichedData = {
      country: code,
      name: data.name,
      totalSpots: enrichedSpots.length,
      totalReviews,
      source: 'hitchwiki',
      license: 'ODBL',
      attribution: 'Data from Hitchwiki/Hitchmap (ODBL)',
      spots: enrichedSpots,
    }

    if (!DRY_RUN) {
      const filePath = join(SPOTS_DIR, file)
      writeFileSync(filePath, JSON.stringify(enrichedData), 'utf-8')
    }

    console.log(`  📄 ${code}: ${enrichedSpots.length} spots enrichis`)

    newIndex.totalCountries++
    newIndex.totalLocations += enrichedSpots.length
    newIndex.totalReviews += totalReviews
    newIndex.countries.push({
      code,
      locations: enrichedSpots.length,
      reviews: totalReviews,
    })
  }

  // Sort countries by location count
  newIndex.countries.sort((a, b) => b.locations - a.locations)

  if (!DRY_RUN) {
    writeFileSync(INDEX_FILE, JSON.stringify(newIndex, null, 2), 'utf-8')
    console.log(`\n  📊 index.json mis à jour`)
  }

  // ─── Final report ──────────────────────────────────────────────
  console.log('\n═══════════════════════════════════════════════════')
  console.log('  RAPPORT FINAL')
  console.log('═══════════════════════════════════════════════════')
  console.log(`  Spots gardés :  ${totalKept}`)
  console.log(`  Spots supprimés : ${totalRemoved}`)
  console.log(`  Villes :          ${allSpotsByCity.size}`)
  console.log(`  🟡 Dorés (10+) :  ${totalGold}`)
  console.log(`  🟢 Verts (3-9) :  ${totalGreen}`)
  console.log(`  ⚪ Gris (0-2) :   ${totalGrey}`)
  console.log(`  Géocodés :        ${totalGeocoded} (${Object.keys(geocodeCache).length} en cache)`)
  if (DRY_RUN) console.log('\n  ⚠️  DRY RUN — aucun fichier modifié')
  console.log('═══════════════════════════════════════════════════')
}

main().catch(err => {
  console.error('❌ Erreur fatale:', err)
  saveCache() // Save cache even on error
  process.exit(1)
})
