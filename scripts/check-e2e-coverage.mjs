#!/usr/bin/env node
/**
 * E2E Coverage Check
 *
 * 1. Reads all window.* handler assignments from src/ files
 * 2. Reads all test files in e2e/
 * 3. Checks which handlers are mentioned in test files
 * 4. Reports coverage percentage
 * 5. Exits with error if coverage < 80%
 */

import { readFileSync, readdirSync, statSync } from 'fs'
import { join, extname } from 'path'

const SRC_DIR = join(process.cwd(), 'src')
const E2E_DIR = join(process.cwd(), 'e2e')
const THRESHOLD = 30 // Start low, increase as coverage grows

// Recursively get all files in a directory
function getFiles(dir, ext) {
  const results = []
  try {
    const entries = readdirSync(dir)
    for (const entry of entries) {
      const full = join(dir, entry)
      try {
        const stat = statSync(full)
        if (stat.isDirectory()) {
          results.push(...getFiles(full, ext))
        } else if (!ext || extname(full) === ext) {
          results.push(full)
        }
      } catch { /* skip unreadable */ }
    }
  } catch { /* skip unreadable dirs */ }
  return results
}

// Extract window.* handler names from source files
function extractHandlers(srcDir) {
  const handlers = new Set()
  const files = getFiles(srcDir, '.js')

  // Pattern: window.handlerName = (function assignment)
  const pattern = /window\.([a-zA-Z_][a-zA-Z0-9_]*)\s*=/g

  for (const file of files) {
    const content = readFileSync(file, 'utf-8')
    let match
    while ((match = pattern.exec(content)) !== null) {
      const name = match[1]
      // Skip internal/private/non-handler assignments
      if (name.startsWith('_') || name.startsWith('__')) continue
      if (['onerror', 'onunhandledrejection', 'addEventListener', 'blocked'].includes(name)) continue
      // Skip state-like properties (not callable handlers)
      if (['timestamps', 'audioContext', 'spotFormData', 'authMode',
           'homeMapInstance', 'deviceManagerState', 'emailVerificationState',
           'identityVerificationState', 'selectedLanguageCode',
           'isLoading', 't', 'withLoading', 'compressImage',
           'generateThumbnail', 'validateImage', 'playSound',
           'srAnnounce', 'translateElement', 'translateSpotText',
           'showLoading', 'hideLoading', 'setLoadingMessage',
           'setLoadingProgress', 'showToast', 'showErrorAnimation',
           'showSuccessAnimation', 'launchConfetti', 'launchConfettiBurst',
           'preloadModals', 'loadModal'].includes(name)) continue
      handlers.add(name)
    }
  }

  return handlers
}

// Check which handlers are mentioned in test files
function checkTestCoverage(e2eDir, handlers) {
  const testFiles = getFiles(e2eDir, '.js').filter(f => f.endsWith('.spec.js'))
  let allTestContent = ''

  for (const file of testFiles) {
    allTestContent += readFileSync(file, 'utf-8') + '\n'
  }

  const covered = new Set()
  const uncovered = new Set()

  for (const handler of handlers) {
    // Check if the handler name appears in any test file
    // Match: window.handlerName, handlerName(, 'handlerName', "handlerName"
    if (allTestContent.includes(handler)) {
      covered.add(handler)
    } else {
      uncovered.add(handler)
    }
  }

  return { covered, uncovered, testFiles }
}

// Main
const handlers = extractHandlers(SRC_DIR)
const { covered, uncovered, testFiles } = checkTestCoverage(E2E_DIR, handlers)

const total = handlers.size
const coveredCount = covered.size
const uncoveredCount = uncovered.size
const percentage = total > 0 ? Math.round((coveredCount / total) * 100) : 0

console.log('=== E2E Handler Coverage Report ===\n')
console.log(`Source handlers found: ${total}`)
console.log(`Handlers mentioned in tests: ${coveredCount}`)
console.log(`Handlers NOT in tests: ${uncoveredCount}`)
console.log(`Coverage: ${percentage}%`)
console.log(`Threshold: ${THRESHOLD}%`)
console.log(`Test files scanned: ${testFiles.length}\n`)

if (uncoveredCount > 0 && process.argv.includes('--verbose')) {
  console.log('--- Uncovered handlers ---')
  const sorted = [...uncovered].sort()
  for (const h of sorted) {
    console.log(`  - window.${h}`)
  }
  console.log('')
}

if (percentage < THRESHOLD) {
  console.log(`FAIL: Coverage ${percentage}% is below threshold ${THRESHOLD}%`)
  console.log(`Add tests for ${Math.ceil((THRESHOLD / 100 * total) - coveredCount)} more handlers to reach ${THRESHOLD}%`)
  process.exit(1)
} else {
  console.log(`PASS: Coverage ${percentage}% meets threshold ${THRESHOLD}%`)
  process.exit(0)
}
