#!/usr/bin/env node
/**
 * i18n Completeness — Fox Layer 15
 *
 * Static analysis (no browser needed):
 * 1. Load all 4 translation files
 * 2. Cross-check keys across languages
 * 3. Find orphaned keys, empty values, forbidden dashes
 * 4. Scan source for t('key') references
 *
 * Usage: node scripts/checks/i18n-completeness.mjs
 */

import { readFileSync, readdirSync, statSync } from 'fs'
import { join, dirname, extname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..', '..')
const SRC_PATH = join(ROOT, 'src')
const LANGS = ['fr', 'en', 'es', 'de']

class TestRunner {
  constructor() {
    this.passed = 0
    this.failed = 0
    this.skipped = 0
    this.errors = []
    this.warnings = []
    this.currentGroup = ''
  }
  setGroup(name) {
    this.currentGroup = name
    console.log(`\n  ── ${name} ──`)
  }
  pass(name) { this.passed++ }
  fail(name, reason) {
    this.failed++
    this.errors.push(`[${this.currentGroup}] ${name}: ${reason}`)
    console.log(`    ✗ ${name}: ${reason}`)
  }
  warn(name, reason) {
    this.warnings.push(`[${this.currentGroup}] ${name}: ${reason}`)
  }
  skip(name) { this.skipped++ }
  get total() { return this.passed + this.failed }
  get score() { return this.total > 0 ? Math.round((this.passed / this.total) * 100) : 0 }
}

// Extract all keys from a nested object, using dot notation
function extractKeys(obj, prefix = '') {
  const keys = new Set()
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      for (const k of extractKeys(value, fullKey)) keys.add(k)
    } else {
      keys.add(fullKey)
    }
  }
  return keys
}

// Get value from nested object using dot-notation key
function getNestedValue(obj, key) {
  return key.split('.').reduce((o, k) => (o && typeof o === 'object' ? o[k] : undefined), obj)
}

// Load a translation file by evaluating it (it uses export default)
async function loadTranslation(lang) {
  const filePath = join(SRC_PATH, 'i18n', 'lang', `${lang}.js`)
  try {
    const content = readFileSync(filePath, 'utf-8')
    // Extract the object from "export default { ... }"
    const match = content.match(/export\s+default\s+(\{[\s\S]*\})\s*$/)
    if (!match) return null
    // Use Function constructor to evaluate the object (safe for known files)
    const fn = new Function(`return ${match[1]}`)
    return fn()
  } catch {
    return null
  }
}

// Scan source code for t('key') or t("key") usage
function scanTKeyCalls() {
  const keys = new Set()

  function scan(dir) {
    for (const entry of readdirSync(dir)) {
      const fullPath = join(dir, entry)
      const stat = statSync(fullPath)
      if (stat.isDirectory() && !entry.startsWith('.') && entry !== 'node_modules' && entry !== 'i18n') {
        scan(fullPath)
      } else if (extname(entry) === '.js') {
        const content = readFileSync(fullPath, 'utf-8')
        // Match t('key'), t("key"), t(`key`)
        const matches = content.matchAll(/\bt\(\s*['"`]([^'"`]+)['"`]\s*\)/g)
        for (const m of matches) {
          keys.add(m[1])
        }
      }
    }
  }

  scan(SRC_PATH)
  return keys
}

// Check for forbidden dashes in translations (RULE #16)
function checkForbiddenDashes(translations, lang) {
  const violations = []

  function check(obj, prefix = '') {
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key
      if (typeof value === 'string') {
        // Forbidden: dash used as punctuation (not in compound words)
        // Pattern: space + dash + space, or dash at start/end
        if (/\s[-–—]\s/.test(value) || /^[-–—]\s/.test(value) || /\s[-–—]$/.test(value)) {
          violations.push({ key: fullKey, value: value.substring(0, 80) })
        }
      } else if (typeof value === 'object' && value !== null) {
        check(value, fullKey)
      }
    }
  }

  check(translations)
  return violations
}

export default async function check() {
  const t = new TestRunner()

  // ── Load translations ──
  t.setGroup('Load Translations')
  const translations = {}
  for (const lang of LANGS) {
    translations[lang] = await loadTranslation(lang)
    if (translations[lang]) {
      const keyCount = extractKeys(translations[lang]).size
      t.pass(`${lang}.js loaded (${keyCount} keys)`)
    } else {
      t.fail(`${lang}.js`, 'Failed to load')
    }
  }

  // If FR not loaded, can't continue
  if (!translations.fr) {
    return {
      name: 'i18n Completeness',
      score: 0, maxScore: 100,
      errors: ['Could not load fr.js'],
      warnings: [],
      stats: { passed: t.passed, failed: t.failed, skipped: 0, total: t.total },
    }
  }

  // ── Cross-language key comparison ──
  t.setGroup('Cross-Language Keys')
  const frKeys = extractKeys(translations.fr)

  for (const lang of ['en', 'es', 'de']) {
    if (!translations[lang]) { t.skip(`${lang} keys`); continue }

    const langKeys = extractKeys(translations[lang])
    const missingInLang = [...frKeys].filter(k => !langKeys.has(k))
    const extraInLang = [...langKeys].filter(k => !frKeys.has(k))

    if (missingInLang.length === 0) {
      t.pass(`${lang}: all FR keys present`)
    } else {
      const pct = Math.round((1 - missingInLang.length / frKeys.size) * 100)
      if (pct >= 90) {
        t.pass(`${lang}: ${pct}% coverage (${missingInLang.length} missing)`)
        t.warn(`${lang} missing keys`, missingInLang.slice(0, 5).join(', '))
      } else {
        t.fail(`${lang} coverage`, `Only ${pct}% (${missingInLang.length} missing)`)
      }
    }

    if (extraInLang.length > 0) {
      t.warn(`${lang} extra keys`, `${extraInLang.length} keys not in FR`)
    }
  }

  // ── Empty values ──
  t.setGroup('Empty Values')
  for (const lang of LANGS) {
    if (!translations[lang]) continue
    const keys = extractKeys(translations[lang])
    let emptyCount = 0
    for (const key of keys) {
      const val = getNestedValue(translations[lang], key)
      if (val === '' || val === null || val === undefined) emptyCount++
    }
    const pct = Math.round((emptyCount / keys.size) * 100)
    if (emptyCount === 0) {
      t.pass(`${lang}: no empty values`)
    } else if (pct <= 15) {
      t.pass(`${lang}: ${emptyCount} empty values (${pct}%, minor)`)
      t.warn(`${lang} empty`, `${emptyCount} empty translations`)
    } else {
      t.fail(`${lang} empty values`, `${emptyCount} empty (${pct}%)`)
    }
  }

  // ── Raw key values (translation = key name) ──
  t.setGroup('Raw Key Values')
  for (const lang of LANGS) {
    if (!translations[lang]) continue
    const keys = extractKeys(translations[lang])
    let rawCount = 0
    for (const key of keys) {
      const val = getNestedValue(translations[lang], key)
      if (typeof val === 'string' && val === key) rawCount++
    }
    if (rawCount === 0) {
      t.pass(`${lang}: no raw key values`)
    } else if (rawCount <= 40) {
      t.pass(`${lang}: ${rawCount} raw key values (some keys match their value)`)
    } else {
      t.fail(`${lang} raw values`, `${rawCount} translations equal to their key`)
    }
  }

  // ── Forbidden dashes (RULE #16) ──
  t.setGroup('Forbidden Dashes (Rule #16)')
  for (const lang of LANGS) {
    if (!translations[lang]) continue
    const violations = checkForbiddenDashes(translations[lang], lang)
    if (violations.length === 0) {
      t.pass(`${lang}: no forbidden dashes`)
    } else if (violations.length <= 3) {
      t.pass(`${lang}: ${violations.length} dashes (minor)`)
      for (const v of violations) {
        t.warn(`${lang} dash`, `${v.key}: "${v.value}"`)
      }
    } else {
      t.fail(`${lang} dashes`, `${violations.length} forbidden dashes`)
    }
  }

  // ── Source code t() usage ──
  t.setGroup('Source Code t() Usage')
  const usedKeys = scanTKeyCalls()
  let missingFromFR = 0
  const missingExamples = []

  for (const key of usedKeys) {
    // Handle nested keys like 'nav.map'
    const val = getNestedValue(translations.fr, key)
    if (val === undefined) {
      missingFromFR++
      if (missingExamples.length < 5) missingExamples.push(key)
    }
  }

  if (missingFromFR === 0) {
    t.pass(`All ${usedKeys.size} t() keys exist in FR`)
  } else {
    const pct = Math.round((1 - missingFromFR / usedKeys.size) * 100)
    if (pct >= 95) {
      t.pass(`${pct}% t() keys found in FR (${missingFromFR} missing)`)
    } else {
      t.fail('t() keys in FR', `${missingFromFR} missing: ${missingExamples.join(', ')}`)
    }
  }

  // ── Orphaned keys ──
  t.setGroup('Orphaned Keys')
  const frKeysList = [...frKeys]
  let orphaned = 0
  for (const key of frKeysList) {
    // Top-level key name (first segment)
    const topKey = key.split('.')[0]
    if (!usedKeys.has(key) && !usedKeys.has(topKey)) {
      // Check if any used key starts with this key as a prefix
      const isPrefix = [...usedKeys].some(uk => uk.startsWith(key + '.'))
      if (!isPrefix) orphaned++
    }
  }

  if (orphaned === 0) {
    t.pass('No orphaned keys')
  } else {
    const pct = Math.round((orphaned / frKeys.size) * 100)
    if (pct <= 10) {
      t.pass(`${orphaned} potentially orphaned keys (${pct}%)`)
    } else {
      t.warn('Orphaned keys', `${orphaned} keys (${pct}%) may be unused`)
      t.pass(`Orphaned keys: ${orphaned} (non-blocking)`)
    }
  }

  console.log(`\n  i18n Completeness: ${t.passed}/${t.total} passed`)

  return {
    name: 'i18n Completeness',
    score: t.score,
    maxScore: 100,
    errors: t.errors.slice(0, 10),
    warnings: t.warnings.slice(0, 10),
    stats: { passed: t.passed, failed: t.failed, skipped: t.skipped, total: t.total },
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  check().then(r => {
    console.log(`\nScore: ${r.score}/100`)
    process.exit(r.score >= 70 ? 0 : 1)
  })
}
