#!/usr/bin/env node
/**
 * Pre-translate all Hitchwiki comments into FR/EN/ES/DE
 * Stores textFr/textEn/textEs/textDe in each comment object
 * Uses MyMemory API (free, no key needed)
 *
 * Usage: node scripts/translate-comments.mjs [--country fr] [--resume]
 *   --country XX  : only process one country file
 *   --resume      : skip already translated comments
 *   --dry-run     : count without translating
 */

import fs from 'fs'
import path from 'path'

const SPOTS_DIR = 'public/data/spots'
const LANGS = ['fr', 'en', 'es', 'de']
const API_URL = 'https://api.mymemory.translated.net/get'
const DELAY_MS = 350 // Polite delay between API calls

const args = process.argv.slice(2)
const countryFilter = args.includes('--country') ? args[args.indexOf('--country') + 1] : null
const resume = args.includes('--resume')
const dryRun = args.includes('--dry-run')

// Simple language detection
function detectLang(text) {
  if (!text) return 'unknown'
  const t = text.toLowerCase()
  // French markers
  if (/\b(très|aussi|avec|pour|dans|mais|ici|bien|assez|voiture|attente|bon|bonne|endroit|route|autoroute|facile|difficile|gauche|droite|après|avant|heure|minutes|vers|depuis)\b/.test(t)) return 'fr'
  // German markers
  if (/\b(sehr|auch|aber|hier|nach|dort|dann|uber|noch|schon|warten|stelle|auto|fahrt|gut|schlecht|stelle|straße|autobahn|leicht|schwer)\b/.test(t)) return 'de'
  // Spanish markers
  if (/\b(muy|también|pero|aquí|después|antes|hacia|desde|coche|espera|bueno|malo|fácil|difícil|carretera|autopista)\b/.test(t)) return 'es'
  // Default to English (most Hitchwiki content)
  return 'en'
}

async function translateText(text, fromLang, toLang) {
  if (fromLang === toLang) return text
  if (!text || text.length < 3) return text

  const langPair = `${fromLang}|${toLang}`
  const url = `${API_URL}?q=${encodeURIComponent(text.slice(0, 500))}&langpair=${langPair}`

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
    const data = await res.json()
    const translated = data?.responseData?.translatedText
    if (translated && translated.toLowerCase() !== text.toLowerCase()) {
      return translated
    }
    return text
  } catch {
    return text // Keep original on error
  }
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

async function processFile(filePath) {
  const countryCode = path.basename(filePath, '.json')
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

      // Check if already translated
      if (resume && comment.textFr && comment.textEn && comment.textEs && comment.textDe) {
        skipped++
        continue
      }

      if (dryRun) continue

      const sourceLang = detectLang(comment.text)

      // Store original in detected language
      for (const lang of LANGS) {
        const key = `text${lang.charAt(0).toUpperCase() + lang.slice(1)}`
        if (lang === sourceLang) {
          comment[key] = comment.text
        } else if (!comment[key] || !resume) {
          const result = await translateText(comment.text, sourceLang, lang)
          comment[key] = result
          await sleep(DELAY_MS)
          translated++

          // Progress
          if (translated % 50 === 0) {
            process.stdout.write(`\r  [${countryCode}] ${translated} translations done...`)
          }
        }
      }
    }
  }

  if (!dryRun && translated > 0) {
    // Write back
    fs.writeFileSync(filePath, JSON.stringify(Array.isArray(data) ? spots : data, null, 0))
  }

  console.log(`\n  ${countryCode}: ${total} comments, ${translated} translations, ${skipped} skipped`)
  return { total, translated, skipped }
}

async function main() {
  console.log('=== Comment Translation Script ===')
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'TRANSLATE'}`)
  if (resume) console.log('Resume mode: skipping already translated')
  if (countryFilter) console.log(`Country filter: ${countryFilter}`)

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
  console.log(`Total comments: ${grandTotal}`)
  console.log(`Translated: ${grandTranslated}`)
  console.log(`Skipped: ${grandSkipped}`)
}

main().catch(console.error)
