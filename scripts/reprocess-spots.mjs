#!/usr/bin/env node

/**
 * Reprocess all Hitchwiki spots:
 * 1. Reclassify types (6 types: gas_station, toll, roundabout, on_ramp, roadside, custom)
 * 2. Fix names (city-level, not neighborhood) + keep neighborhood as secondary info
 * 3. Extract destinations from comments + reverse geocode destLat/destLon
 * 4. Remove: comments, descriptions, season, timeOfDay
 */

import fs from 'fs'

const SPOTS_DIR = 'public/data/spots'
const CACHE_FILE = 'scripts/geocode-cache.json'
const CITIES_FILE = 'scripts/big-cities.json'

// Load geocode cache
let geocodeCache = {}
try {
  geocodeCache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'))
} catch (e) {
  console.log('No cache found, starting fresh')
}

// Load cities database for local reverse geocoding
const cities = JSON.parse(fs.readFileSync(CITIES_FILE, 'utf8'))

/**
 * Find nearest city from coordinates (local, instant, no API)
 * Returns null if nearest city is > 50km away
 */
function findNearestCity(lat, lon) {
  const key = `${lat},${lon}`
  if (geocodeCache[key]) return geocodeCache[key]

  let best = null, bestDist = Infinity
  for (const c of cities) {
    const d = Math.sqrt(Math.pow(c.lat - lat, 2) + Math.pow(c.lon - lon, 2))
    if (d < bestDist) { bestDist = d; best = c }
  }

  const distKm = bestDist * 111 // rough conversion degrees → km
  if (distKm > 50 || !best) return null

  const result = { city: best.name, district: null, state: null, country: best.cc }
  geocodeCache[key] = result
  return result
}

// ========== TYPE RECLASSIFICATION ==========

function reclassifyType(spot) {
  const allText = [
    ...(spot.comments || []).map(c => (c.textEn || c.text || '').toLowerCase()),
    (spot.descriptionEn || '').toLowerCase(),
  ].join(' ')

  // Gas station / rest area (keep as gas_station)
  if (/\b(gas station|petrol|benzin|gasolinera|tankstelle|station[- ]?service|fuel|shell|bp|total|esso|agip|omv|eni|lukoil|orlen|mol |aral|repsol|cepsa)\b/.test(allText) ||
      /\b(rest[- ]?(area|station|stop|place)|aire de (repos|service)|rast(platz|station|stätte)|service area|raststätte|autobahnraststätte)\b/.test(allText)) {
    return 'gas_station'
  }

  // Toll
  if (/\b(toll|péage|peaje|maut|mautstation|toll booth|toll plaza|poste de péage)\b/.test(allText)) {
    return 'toll'
  }

  // Roundabout
  if (/\b(roundabout|rond[- ]?point|rotonda|kreisverkehr|traffic circle|kreuzung|rondell)\b/.test(allText)) {
    return 'roundabout'
  }

  // On-ramp / highway entrance
  if (/\b(on[- ]?ramp|ramp|bretelle|rampa|auffahrt|einfahrt|highway entrance|motorway entrance|autoroute entrée|highway entry|slip road)\b/.test(allText)) {
    return 'on_ramp'
  }

  // If signal was 'ask' or text mentions asking at a station → gas_station
  if (spot.signal === 'ask' && /\b(parking|station|lot|garage)\b/.test(allText)) {
    return 'gas_station'
  }

  // Default: roadside (was 'custom' or 'highway')
  return 'roadside'
}

// ========== DESTINATION EXTRACTION ==========

// Common false positive words that look like city names
const FALSE_POSITIVES = new Set([
  'The', 'This', 'That', 'There', 'Then', 'They', 'Those', 'Some', 'After',
  'Before', 'From', 'With', 'Without', 'About', 'Just', 'Very', 'Still',
  'Also', 'Even', 'Only', 'Much', 'More', 'Most', 'Many', 'Other', 'Each',
  'Every', 'Both', 'Such', 'Well', 'Really', 'Quite', 'Here', 'Where',
  'When', 'While', 'Which', 'What', 'Who', 'How', 'But', 'And', 'Not',
  'Good', 'Great', 'Nice', 'Easy', 'Hard', 'Long', 'Short', 'First',
  'Last', 'Next', 'Right', 'Left', 'Back', 'Down', 'Out', 'Stand', 'Walk',
  'Wait', 'Take', 'Make', 'Get', 'Find', 'Ask', 'Try', 'Use', 'See',
  'Show', 'Keep', 'Start', 'Stop', 'Go', 'Come', 'Took', 'Got', 'Made',
  'Found', 'Went', 'Came', 'Said', 'Told', 'Gave', 'Let', 'Put', 'Set',
  'Run', 'Sat', 'Stood', 'South', 'North', 'East', 'West', 'Southwest',
  'Southeast', 'Northwest', 'Northeast', 'Sunday', 'Monday', 'Tuesday',
  'Wednesday', 'Thursday', 'Friday', 'Saturday', 'January', 'February',
  'March', 'April', 'May', 'June', 'July', 'August', 'September',
  'October', 'November', 'December', 'Spring', 'Summer', 'Autumn', 'Winter',
  'Direction', 'Towards', 'Around', 'Behind', 'Between', 'Above', 'Below',
  'Inside', 'Outside', 'Across', 'Along', 'Through', 'Under', 'Over',
  'Near', 'Far', 'Close', 'Away', 'Anywhere', 'Somewhere', 'Nowhere',
  'Someone', 'Nobody', 'Everyone', 'Everything', 'Nothing', 'Anything',
  'Maybe', 'Probably', 'Definitely', 'Certainly', 'Unfortunately',
  'However', 'Although', 'Because', 'Since', 'Until', 'Unless',
  'Hitchhiking', 'Hitchhike', 'Hitchwiki', 'Hitchhiked', 'Hitchhiker',
  'Sign', 'Thumb', 'Ride', 'Lift', 'Car', 'Truck', 'Bus', 'Train',
  'Highway', 'Motorway', 'Road', 'Street', 'Exit', 'Entrance', 'Ramp',
  'Station', 'Airport', 'Border', 'Spot', 'Place', 'Point', 'Area',
  'Traffic', 'Construction', 'Parking', 'Rest', 'Shell', 'Petrol',
  'Gas', 'Fuel', 'Police', 'Toll', 'Bridge', 'Tunnel', 'Ferry',
  'Island', 'Mountain', 'River', 'Lake', 'Sea', 'Park', 'Garden',
  'Hotel', 'Hostel', 'Camp', 'Church', 'Castle', 'Tower', 'Square',
  'Market', 'Mall', 'Shop', 'Store', 'Restaurant', 'Cafe', 'Bar',
  'Super', 'Straight', 'Waited', 'Caught', 'Picked', 'Dropped',
  'Walked', 'Drove', 'Headed', 'Arrived', 'Reached', 'Passed',
  'Crossed', 'Turned', 'Followed', 'Stopped', 'Continued', 'Ended',
  'Decided', 'Tried', 'Managed', 'Succeeded', 'Failed', 'Needed',
  'Wanted', 'Hoped', 'Expected', 'Thought', 'Knew', 'Saw', 'Heard',
  'Felt', 'Looked', 'Seemed', 'Appeared', 'Happened', 'Worked',
  'Stood', 'Held', 'Showed', 'Pointed', 'Pulled', 'Pushed', 'Carried',
  'Moved', 'Changed', 'Spent', 'Paid', 'Cost', 'Lasted', 'Took',
  'Pretty', 'Little', 'Middle', 'People', 'Minutes', 'Hours', 'Days',
  'Weeks', 'Months', 'Years', 'Morning', 'Afternoon', 'Evening', 'Night',
  'Today', 'Yesterday', 'Tomorrow', 'Enough', 'Though', 'Anyway',
  'Already', 'Almost', 'Rather', 'Quite', 'Instead', 'Besides',
  'Otherwise', 'Especially', 'Particular', 'Specific', 'Actually',
  'Basically', 'Absolutely', 'Completely', 'Apparently', 'Obviously',
  'Normally', 'Usually', 'Generally', 'Occasionally', 'Recently',
  'Immediately', 'Eventually', 'Finally', 'Directly', 'Slowly',
  'Quickly', 'Fast', 'Slow', 'Early', 'Late', 'High', 'Low',
  'Difficult', 'Impossible', 'Possible', 'Dangerous', 'Safe',
  'Beautiful', 'Terrible', 'Horrible', 'Wonderful', 'Amazing',
  'Perfect', 'Excellent', 'Awesome', 'Fantastic', 'Incredible',
  'Worst', 'Best', 'Better', 'Worse', 'Smaller', 'Bigger', 'Larger',
  'Longer', 'Shorter', 'Easier', 'Harder', 'Faster', 'Slower',
  'Closer', 'Further', 'Farther', 'Higher', 'Lower', 'Deeper',
  'Wider', 'Narrower', 'Cheaper', 'Free', 'Czech', 'Slovak',
  'Hungarian', 'Polish', 'German', 'French', 'Spanish', 'Italian',
  'English', 'British', 'American', 'Russian', 'Turkish', 'Greek',
  'Croatian', 'Serbian', 'Bosnian', 'Albanian', 'Bulgarian',
  'Romanian', 'Austrian', 'Swiss', 'Dutch', 'Belgian', 'Danish',
  'Swedish', 'Norwegian', 'Finnish', 'Portuguese', 'Irish',
  'Scottish', 'Slovenian', 'Macedonian', 'Montenegrin', 'Kosovan',
  'Max', 'Min', 'Avg', 'Total', 'Half', 'Double', 'Triple',
  'Intersection', 'Roundabout', 'Overpass', 'Underpass',
  'Centre', 'Center', 'Central', 'Main', 'Side', 'Edge',
  'Corner', 'End', 'Beginning', 'Top', 'Bottom', 'Front',
  'I', 'We', 'You', 'He', 'She', 'It', 'Me', 'Us', 'Him', 'Her',
  'Them', 'My', 'Our', 'Your', 'His', 'Its', 'Their', 'Mine',
  'Ours', 'Yours', 'Theirs', 'Myself', 'Ourselves', 'Yourself',
  'Himself', 'Herself', 'Itself', 'Themselves',
  'Decent', 'Lovely', 'Brilliant', 'Rubbish', 'Awful',
  'Tricky', 'Sketchy', 'Dodgy', 'Handy', 'Useful',
  'Busy', 'Quiet', 'Empty', 'Full', 'Crowded',
])

function extractDestinationsFromComments(comments) {
  const destinations = {}

  for (const comment of comments) {
    const text = comment.textEn || comment.text || ''

    // Patterns to find city names after directional words
    const patterns = [
      // "to/towards/for CITY" (most common)
      /\b(?:to|towards?|for|hacia|vers|nach|richtung)\s+([A-Z][a-zà-üA-Z\-']+(?:\s+[A-Z][a-zà-üA-Z\-']+){0,2})/g,
      // "heading/going/ride/lift to CITY"
      /\b(?:heading|going|ride|lift|drove|drive|heading)\s+(?:to|towards?|for)\s+([A-Z][a-zà-üA-Z\-']+(?:\s+[A-Z][a-zà-üA-Z\-']+){0,2})/g,
      // "took me/us to CITY"
      /\b(?:took|dropped|brought|carried)\s+(?:me|us|him|her|them)\s+(?:to|off at|off in|at|in)\s+([A-Z][a-zà-üA-Z\-']+(?:\s+[A-Z][a-zà-üA-Z\-']+){0,2})/g,
      // "got to / made it to / all the way to CITY"
      /\b(?:got|arrived|made it|get|all the way)\s+(?:to|in|at)\s+([A-Z][a-zà-üA-Z\-']+(?:\s+[A-Z][a-zà-üA-Z\-']+){0,2})/g,
      // "direction CITY" (French pattern)
      /\b(?:direction)\s+(?:de\s+)?([A-Z][a-zà-üA-Z\-']+(?:\s+[A-Z][a-zà-üA-Z\-']+){0,2})/g,
    ]

    for (const pattern of patterns) {
      let match
      while ((match = pattern.exec(text)) !== null) {
        // Clean up the city name
        let city = match[1].trim()
          .replace(/[.,;:!?()]+$/, '') // trailing punctuation
          .replace(/\s+(and|or|but|via|then|so|if|at|on|in|by|from|with|for|the|a|an)$/i, '') // trailing conjunctions

        // Skip false positives
        if (FALSE_POSITIVES.has(city)) continue
        if (city.length < 3) continue
        // Skip if starts with lowercase (shouldn't happen with our pattern but just in case)
        if (city[0] !== city[0].toUpperCase()) continue

        // Normalize
        city = city.replace(/\s+/g, ' ').trim()

        if (city && city.length >= 3 && !FALSE_POSITIVES.has(city)) {
          destinations[city] = (destinations[city] || 0) + 1
        }
      }
    }
  }

  return destinations
}

// ========== NAME FIXING ==========

// Known neighborhood → city mappings for major cities
const NEIGHBORHOOD_TO_CITY = {
  // Vienna districts
  'Simmering': 'Vienna', 'Ottakring': 'Vienna', 'Favoriten': 'Vienna',
  'Floridsdorf': 'Vienna', 'Donaustadt': 'Vienna', 'Leopoldstadt': 'Vienna',
  'Rudolfsheim-Fünfhaus': 'Vienna', 'Penzing': 'Vienna', 'Hietzing': 'Vienna',
  'Liesing': 'Vienna', 'Meidling': 'Vienna', 'Brigittenau': 'Vienna',
  'Döbling': 'Vienna', 'Hernals': 'Vienna', 'Währing': 'Vienna',
  'Josefstadt': 'Vienna', 'Landstraße': 'Vienna', 'Wieden': 'Vienna',
  'Margareten': 'Vienna', 'Mariahilf': 'Vienna', 'Neubau': 'Vienna',
  'Alsergrund': 'Vienna', 'Innere Stadt': 'Vienna',
  // Berlin districts
  'Treptow': 'Berlin', 'Neukölln': 'Berlin', 'Kreuzberg': 'Berlin',
  'Schöneberg': 'Berlin', 'Tempelhof': 'Berlin', 'Steglitz': 'Berlin',
  'Zehlendorf': 'Berlin', 'Charlottenburg': 'Berlin', 'Wilmersdorf': 'Berlin',
  'Spandau': 'Berlin', 'Reinickendorf': 'Berlin', 'Pankow': 'Berlin',
  'Lichtenberg': 'Berlin', 'Marzahn': 'Berlin', 'Hellersdorf': 'Berlin',
  'Köpenick': 'Berlin', 'Friedrichshain': 'Berlin', 'Prenzlauer Berg': 'Berlin',
  'Mitte': 'Berlin', 'Moabit': 'Berlin', 'Wedding': 'Berlin',
  // Bratislava
  'Petržalka': 'Bratislava', 'Ružinov': 'Bratislava', 'Nové Mesto': 'Bratislava',
  'Staré Mesto': 'Bratislava', 'Karlova Ves': 'Bratislava', 'Dúbravka': 'Bratislava',
  // Budapest
  'Óbuda': 'Budapest', 'Újbuda': 'Budapest', 'Kőbánya': 'Budapest',
  'Ferencváros': 'Budapest', 'Erzsébetváros': 'Budapest',
  // Prague
  'Žižkov': 'Prague', 'Smíchov': 'Prague', 'Vinohrady': 'Prague',
  'Holešovice': 'Prague', 'Karlín': 'Prague', 'Dejvice': 'Prague',
  // Paris (arrondissements handled separately)
  'Montreuil': 'Paris', // close suburb, arguably its own city - keep as-is
}

function fixSpotName(currentName, geocodeResult) {
  if (!currentName) return { name: currentName, neighborhood: null }

  // Handle "Paris 13e Arrondissement #3" → "Paris #3", neighborhood: "13e arrondissement"
  const parisMatch = currentName.match(/^Paris (\d+e) Arrondissement(?:\s+#(\d+))?$/)
  if (parisMatch) {
    const num = parisMatch[2] ? ` #${parisMatch[2]}` : ''
    return { name: `Paris${num}`, neighborhood: `${parisMatch[1]} arrondissement` }
  }

  // Handle "Lyon 03 #7" → "Lyon #7", neighborhood: "3e arrondissement"
  const lyonMatch = currentName.match(/^Lyon (\d+)(?:\s+#(\d+))?$/)
  if (lyonMatch) {
    const arr = parseInt(lyonMatch[1])
    const num = lyonMatch[2] ? ` #${lyonMatch[2]}` : ''
    return { name: `Lyon${num}`, neighborhood: `${arr}${arr === 1 ? 'er' : 'e'} arrondissement` }
  }

  // Handle "Marseille 01 #3" pattern
  const marseilleMatch = currentName.match(/^Marseille (\d+)(?:\s+#(\d+))?$/)
  if (marseilleMatch) {
    const arr = parseInt(marseilleMatch[1])
    const num = marseilleMatch[2] ? ` #${marseilleMatch[2]}` : ''
    return { name: `Marseille${num}`, neighborhood: `${arr}${arr === 1 ? 'er' : 'e'} arrondissement` }
  }

  // Handle known neighborhoods → city
  const baseName = currentName.replace(/\s+#\d+$/, '')
  if (NEIGHBORHOOD_TO_CITY[baseName]) {
    const city = NEIGHBORHOOD_TO_CITY[baseName]
    const numMatch = currentName.match(/#(\d+)$/)
    const num = numMatch ? ` #${numMatch[1]}` : ''
    return { name: `${city}${num}`, neighborhood: baseName }
  }

  // Use geocode result if available to check if name is a sub-locality
  if (geocodeResult && geocodeResult.city && geocodeResult.district) {
    // If current name matches district but city is different → fix
    if (baseName === geocodeResult.district && baseName !== geocodeResult.city) {
      const numMatch = currentName.match(/#(\d+)$/)
      const num = numMatch ? ` #${numMatch[1]}` : ''
      return { name: `${geocodeResult.city}${num}`, neighborhood: baseName }
    }
  }

  return { name: currentName, neighborhood: null }
}

// ========== MAIN PROCESSING ==========

async function main() {
  const files = fs.readdirSync(SPOTS_DIR)
    .filter(f => f.endsWith('.json') && f !== 'index.json' && !f.endsWith('.bak'))

  console.log('Using cache-only mode (no API calls). Cache has', Object.keys(geocodeCache).length, 'entries.')
  let totalSpots = 0
  let totalDestGeo = 0
  let totalDestComm = 0
  let totalNamesFixed = 0
  let totalTypesChanged = 0
  const typeStats = {}

  console.log(`Processing ${files.length} country files...`)

  for (const file of files) {
    const filePath = `${SPOTS_DIR}/${file}`
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    const spots = data.spots || []

    console.log(`\n--- ${file} (${spots.length} spots) ---`)

    for (let i = 0; i < spots.length; i++) {
      const spot = spots[i]
      totalSpots++

      // 1. Reclassify type
      const oldType = spot.spotType
      const newType = reclassifyType(spot)
      if (oldType !== newType) totalTypesChanged++
      typeStats[newType] = (typeStats[newType] || 0) + 1

      // 2. Extract destinations from comments
      const destFromComments = extractDestinationsFromComments(spot.comments || [])

      // 3. Find nearest city for destLat/destLon
      let destFromCoords = null
      if (spot.destLat && spot.destLon) {
        const geo = findNearestCity(spot.destLat, spot.destLon)
        if (geo && geo.city) {
          destFromCoords = geo.city
          totalDestGeo++
        }
      }

      // 4. Merge destinations
      const allDests = { ...destFromComments }
      if (destFromCoords) {
        // Avoid double-counting if comment already mentions this city
        const existing = Object.keys(allDests).find(
          k => k.toLowerCase() === destFromCoords.toLowerCase()
        )
        if (existing) {
          allDests[existing] = (allDests[existing] || 0) + 1
        } else {
          allDests[destFromCoords] = (allDests[destFromCoords] || 0) + 1
        }
      }

      // Normalize: merge similar destination names
      const cityAliases = {
        'milano': 'Milan', 'antwerpen': 'Antwerp', 'wien': 'Vienna',
        'münchen': 'Munich', 'köln': 'Cologne', 'bruxelles': 'Brussels',
        'brussel': 'Brussels', 'genève': 'Geneva', 'genf': 'Geneva',
        'zürich': 'Zurich', 'bern': 'Bern', 'firenze': 'Florence',
        'roma': 'Rome', 'napoli': 'Naples', 'venezia': 'Venice',
        'praha': 'Prague', 'warszawa': 'Warsaw', 'bucuresti': 'Bucharest',
        'moskva': 'Moscow', 'sankt-peterburg': 'St Petersburg',
        'kobenhavn': 'Copenhagen', 'goteborg': 'Gothenburg',
        'lilles': 'Lille', 'marseilles': 'Marseille',
        'lyon 03': 'Lyon', 'belgrad': 'Belgrade', 'beograd': 'Belgrade',
        'donostia': 'San Sebastián',
      }
      const normalizedDests = {}
      for (let [name, count] of Object.entries(allDests)) {
        // Apply known aliases
        const alias = cityAliases[name.toLowerCase()]
        if (alias) name = alias
        // Clean: remove arrondissements, districts, "XI. kerület", trailing numbers
        const clean = name
          .replace(/\s+\d+e?\s*(arrondissement|arr\.?)?$/i, '')
          .replace(/\s+#\d+$/, '')
          .replace(/\s+[IVXLCDM]+\.\s*kerület$/i, '')
          .replace(/-Nord$|-Süd$|-Ost$|-West$|-Münster$|-Centro$/i, '')
          .replace(/\s+\(Schwaben\)$/i, '')
          .replace(/\s+im\s+.+$/i, '') // "Sankt Marein im Mürztal" → "Sankt Marein"
          .replace(/\s+am\s+.+$/i, '') // "Frankfurt am Main" → "Frankfurt"
          .replace(/\s+an\s+der\s+.+$/i, '') // "X an der Y" → "X"
          .trim()
        // Expand abbreviations for matching
        const expandAbbr = (s) => s
          .replace(/^St\.?[\s-]/i, 'Saint ')
          .replace(/^Sankt[\s-]/i, 'Saint ')
          .replace(/^Ste\.?[\s-]/i, 'Sainte ')
          .toLowerCase().replace(/[- ]/g, '')

        // Find if a similar name already exists
        const cExp = expandAbbr(clean)
        const existingKey = Object.keys(normalizedDests).find(k => {
          const kExp = expandAbbr(k)
          // Exact match after cleaning + abbreviation expansion
          if (kExp === cExp) return true
          // One starts with the other (e.g. "Clermont" vs "Clermont-Ferrand")
          if (kExp.startsWith(cExp) || cExp.startsWith(kExp)) return true
          // Common misspellings: trailing s, accent variations
          if (kExp.replace(/s$/, '') === cExp.replace(/s$/, '')) return true
          return false
        })

        if (existingKey) {
          // Keep the longer/more specific name, merge counts
          const newName = name.length > existingKey.length ? name : existingKey
          const oldCount = normalizedDests[existingKey]
          delete normalizedDests[existingKey]
          normalizedDests[newName] = oldCount + count
        } else {
          normalizedDests[clean.length > 2 ? clean : name] = (normalizedDests[clean.length > 2 ? clean : name] || 0) + count
        }
      }

      // Build destinations array sorted by count
      const totalVotes = Object.values(normalizedDests).reduce((a, b) => a + b, 0)
      const destinations = Object.entries(normalizedDests)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5) // Keep top 5 destinations
        .map(([name, count]) => ({
          name,
          count,
          pct: totalVotes > 0 ? Math.round(count / totalVotes * 100) : 0,
        }))

      if (Object.keys(destFromComments).length > 0) totalDestComm++

      // 5. Fix spot name
      const spotGeo = findNearestCity(spot.lat, spot.lon)
      const { name: fixedName, neighborhood } = fixSpotName(spot.from, spotGeo)
      if (fixedName !== spot.from) {
        totalNamesFixed++
        if (totalNamesFixed <= 20) {
          console.log(`  Name: "${spot.from}" → "${fixedName}" (${neighborhood || 'no neighborhood'})`)
        }
      }

      // 6. Update spot
      spot.from = fixedName
      if (neighborhood) spot.neighborhood = neighborhood
      spot.spotType = newType
      if (destinations.length > 0) spot.destinations = destinations

      // 7. Remove fields
      delete spot.comments
      delete spot.descriptionEn
      delete spot.descriptionFr
      delete spot.descriptionEs
      delete spot.descriptionDe
      delete spot.season
      delete spot.timeOfDay

      // Progress
      if (totalSpots % 500 === 0) {
        process.stdout.write(`  ${totalSpots} spots processed...\r`)
      }
    }

    // Renumber spots per city (Paris #1, Paris #2, etc.)
    const cityGroups = {}
    for (const spot of spots) {
      const baseName = spot.from.replace(/\s+#\d+$/, '')
      if (!cityGroups[baseName]) cityGroups[baseName] = []
      cityGroups[baseName].push(spot)
    }
    for (const [city, group] of Object.entries(cityGroups)) {
      if (group.length > 1) {
        group.forEach((spot, idx) => {
          spot.from = `${city} #${idx + 1}`
        })
      } else {
        // Single spot: no number needed
        group[0].from = city
      }
    }

    // Update country metadata
    data.totalSpots = spots.length
    delete data.totalReviews // No longer relevant

    // Write updated file
    fs.writeFileSync(filePath, JSON.stringify(data))
    console.log(`  ✓ ${file} written`)
  }

  // Save cache
  // Cache saved via geocodeCache object (no API calls needed)

  // Final stats
  console.log('\n' + '='.repeat(60))
  console.log('REPROCESSING COMPLETE')
  console.log('='.repeat(60))
  console.log(`Total spots processed: ${totalSpots}`)
  console.log(`Types reclassified: ${totalTypesChanged}`)
  console.log(`Names fixed: ${totalNamesFixed}`)
  console.log(`Destinations from geocoding: ${totalDestGeo}`)
  console.log(`Destinations from comments: ${totalDestComm}`)
  console.log(`\nType distribution:`)
  for (const [type, count] of Object.entries(typeStats).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${type}: ${count} (${Math.round(count / totalSpots * 100)}%)`)
  }
  console.log(`\nFields removed: comments, descriptions (4 langs), season, timeOfDay`)
}

main().catch(console.error)
