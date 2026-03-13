#!/usr/bin/env node
/**
 * Parallel batch translate — sends 3 language translations concurrently
 * per comment, cutting time by ~3x vs sequential.
 *
 * Usage: node scripts/translate-parallel.mjs [--country XX] [--resume]
 */
import fs from 'fs'
import path from 'path'

const SPOTS_DIR = 'public/data/spots'
const LANGS = ['fr', 'en', 'es', 'de']
const DELAY_BETWEEN_COMMENTS_MS = 120

const args = process.argv.slice(2)
const countryFilter = args.includes('--country') ? args[args.indexOf('--country') + 1] : null
const resume = args.includes('--resume')

function detectLang(text) {
  if (!text) return 'unknown'
  const t = text.toLowerCase()
  if (/\b(très|aussi|avec|pour|dans|mais|ici|bien|assez|voiture|attente|bon|bonne|endroit|route|autoroute|facile|difficile|gauche|droite|après|avant|heure|minutes|vers|depuis|était|sont|être|nous|cette|notre|même|quand|tout|comme|peut|plus|petit|grand|peu)\b/.test(t)) return 'fr'
  if (/\b(sehr|auch|aber|hier|nach|dort|dann|über|noch|schon|warten|stelle|auto|fahrt|gut|schlecht|straße|autobahn|leicht|schwer|haben|sind|werden|diese|nicht|muss|kann|viel|wenig|beim|einem|einen|keine|mehr|gibt)\b/.test(t)) return 'de'
  if (/\b(muy|también|pero|aquí|después|antes|hacia|desde|coche|espera|bueno|malo|fácil|difícil|carretera|autopista|está|este|para|como|más|puede|tiene|esta|donde|hacer)\b/.test(t)) return 'es'
  return 'en'
}

async function translateGoogle(text, fromLang, toLang) {
  if (fromLang === toLang) return text
  if (!text || text.length < 3) return text

  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${fromLang}&tl=${toLang}&dt=t&q=${encodeURIComponent(text.slice(0, 500))}`

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, {
        signal: AbortSignal.timeout(10000),
        headers: { 'User-Agent': 'Mozilla/5.0' }
      })
      if (res.status === 429) {
        await new Promise(r => setTimeout(r, 3000 * (attempt + 1)))
        continue
      }
      if (!res.ok) {
        await new Promise(r => setTimeout(r, 1000))
        continue
      }
      const data = await res.json()
      if (data && data[0]) {
        const translated = data[0].map(part => part[0]).join('')
        if (translated && translated.toLowerCase() !== text.toLowerCase()) {
          return translated
        }
      }
      return text
    } catch {
      if (attempt < 2) await new Promise(r => setTimeout(r, 1000))
      else return text
    }
  }
  return text
}

async function processFile(filePath) {
  const cc = path.basename(filePath, '.json')
  const raw = fs.readFileSync(filePath, 'utf-8')
  const data = JSON.parse(raw)
  const spots = Array.isArray(data) ? data : (data.spots || [])

  let translated = 0
  let skipped = 0
  let total = 0

  for (const spot of spots) {
    if (!spot.comments || spot.comments.length === 0) continue

    for (const comment of spot.comments) {
      if (!comment.text || !comment.text.trim()) continue
      total++

      if (resume && comment.textFr && comment.textEn && comment.textEs && comment.textDe) {
        skipped++
        continue
      }

      const sourceLang = detectLang(comment.text)

      // Translate to all 3 non-source languages in parallel
      const targetLangs = LANGS.filter(l => l !== sourceLang && (!resume || !comment[`text${l.charAt(0).toUpperCase() + l.slice(1)}`]))

      // Set source language text
      const sourceKey = `text${sourceLang.charAt(0).toUpperCase() + sourceLang.slice(1)}`
      comment[sourceKey] = comment.text

      if (targetLangs.length > 0) {
        const results = await Promise.all(
          targetLangs.map(lang => translateGoogle(comment.text, sourceLang, lang))
        )

        for (let i = 0; i < targetLangs.length; i++) {
          const key = `text${targetLangs[i].charAt(0).toUpperCase() + targetLangs[i].slice(1)}`
          comment[key] = results[i]
          translated++
        }

        await new Promise(r => setTimeout(r, DELAY_BETWEEN_COMMENTS_MS))
      }

      if (translated % 300 === 0 && translated > 0) {
        process.stdout.write(`\r  [${cc}] ${translated} translations...`)
        // Save periodically
        fs.writeFileSync(filePath, JSON.stringify(Array.isArray(data) ? spots : data, null, 0))
      }
    }
  }

  if (translated > 0) {
    fs.writeFileSync(filePath, JSON.stringify(Array.isArray(data) ? spots : data, null, 0))
  }

  console.log(`\n  ${cc}: ${total} comments, ${translated} translations, ${skipped} skipped`)
  return { total, translated, skipped }
}

async function main() {
  console.log('=== Parallel Translation (Google Translate) ===')
  if (resume) console.log('Resume mode: skipping already translated')
  if (countryFilter) console.log(`Country: ${countryFilter}`)

  const files = fs.readdirSync(SPOTS_DIR)
    .filter(f => f.endsWith('.json'))
    .filter(f => !countryFilter || f === `${countryFilter}.json`)
    .sort()

  let grandTotal = 0
  let grandTranslated = 0
  let grandSkipped = 0

  for (const f of files) {
    const { total, translated, skipped } = await processFile(path.join(SPOTS_DIR, f))
    grandTotal += total
    grandTranslated += translated
    grandSkipped += skipped
  }

  console.log('\n=== DONE ===')
  console.log(`Total: ${grandTotal} comments, ${grandTranslated} translations, ${grandSkipped} skipped`)
}

main().catch(console.error)
