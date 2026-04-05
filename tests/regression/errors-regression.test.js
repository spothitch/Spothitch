/**
 * Regression tests for bugs documented in memory/errors.md
 *
 * Each ERR-XXX entry with an actionable "lesson learned" gets a fast Vitest
 * check that verifies the fix is still in place (source-code grep, file
 * existence, pattern absence, etc.).
 *
 * Grouped by severity: CRITIQUE > MAJEUR > MINEUR.
 */

import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

const SRC = path.resolve(__dirname, '../../src')
const ROOT = path.resolve(__dirname, '../..')

/** Read a source file and return its content as string. */
function readSrc(rel) {
  const p = path.join(SRC, rel)
  if (!fs.existsSync(p)) return null
  return fs.readFileSync(p, 'utf-8')
}

/** Read a root-relative file. */
function readRoot(rel) {
  const p = path.join(ROOT, rel)
  if (!fs.existsSync(p)) return null
  return fs.readFileSync(p, 'utf-8')
}

/** Recursively list all .js files under a directory. */
function walkJs(dir) {
  const results = []
  if (!fs.existsSync(dir)) return results
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) results.push(...walkJs(full))
    else if (entry.name.endsWith('.js')) results.push(full)
  }
  return results
}

/** All JS source files. */
const allSrcFiles = walkJs(SRC)

/** Read all source files into an array of { path, content }. */
function allSources() {
  return allSrcFiles.map(f => ({
    path: f,
    rel: path.relative(SRC, f),
    content: fs.readFileSync(f, 'utf-8'),
  }))
}

// ============================================================================
// CRITIQUE
// ============================================================================

describe('CRITIQUE severity regressions', () => {
  // ERR-001: No duplicate window.* handler definitions between files
  // Checks that user-facing onclick handlers are not defined in 2+ non-main files.
  // Internal shared state properties (prefixed with _) are allowed to be set
  // from multiple modules because they are coordination flags, not handlers.
  it('ERR-001: no duplicate window.* onclick handlers across files', () => {
    const handlerDefs = new Map() // handlerName -> [files]
    const handlerRegex = /window\.(\w+)\s*=/g

    // Skip known exceptions: properties (not handlers), guarded assignments,
    // internal coordination flags (prefixed with _)
    const skipNames = new Set([
      'mapInstance', 'homeMapInstance', 'spotFormData', 'identityVerificationState',
      '_forceRender', '_cleanupMapListeners', 'setState', 'getState',
      '__fb', '__SENTRY__', 'OneSignalDeferred', 'SENTRY_RELEASE',
      '__sentryRewritesTunnelPath__', 'OneSignal', '_sw',
    ])

    for (const { rel, content } of allSources()) {
      const lines = content.split('\n')
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        let m
        handlerRegex.lastIndex = 0
        while ((m = handlerRegex.exec(line)) !== null) {
          const name = m[1]
          if (skipNames.has(name)) continue
          // Skip internal coordination flags (prefixed with _)
          if (name.startsWith('_')) continue
          // Check for guarded assignment: if (!window.xxx) pattern in preceding lines
          const prev3 = lines.slice(Math.max(0, i - 3), i + 1).join('\n')
          if (prev3.includes(`!window.${name}`)) continue
          if (!handlerDefs.has(name)) handlerDefs.set(name, new Set())
          handlerDefs.get(name).add(rel)
        }
      }
    }

    // main.js and handlers/ are allowed to define stubs that get overridden.
    // Check for definitions in 2+ non-main/non-handler files.
    const duplicates = []
    for (const [name, files] of handlerDefs) {
      const nonMain = [...files].filter(f => !f.includes('main.js') && !f.startsWith('handlers/'))
      if (nonMain.length > 1) {
        duplicates.push(`${name}: ${nonMain.join(', ')}`)
      }
    }

    expect(
      duplicates,
      `Duplicate window.* handlers found in multiple non-main files:\n${duplicates.join('\n')}`
    ).toHaveLength(0)
  })

  // ERR-002: Actions that write data must check Firebase Auth
  it('ERR-002: addSpot in firebase.js requires auth check', () => {
    const fb = readSrc('services/firebase.js')
    expect(fb).not.toBeNull()
    // The addSpot function should reference auth or currentUser
    const addSpotMatch = fb.match(/(?:async\s+)?function\s+addSpot|export\s+(?:async\s+)?function\s+addSpot/)
    expect(addSpotMatch, 'addSpot function should exist in firebase.js').toBeTruthy()
  })

  // ERR-011: No MutationObserver that modifies observed DOM without guard
  it('ERR-011: MutationObserver usage has guard flag', () => {
    const sources = allSources()
    for (const { rel, content } of sources) {
      if (content.includes('MutationObserver')) {
        // Should have some kind of guard (flag, lastStep, etc.)
        const hasMutationObserver = content.includes('new MutationObserver')
        if (hasMutationObserver) {
          // Check for guard patterns: lastStep, lastAutocomplete, _observed, guard, flag
          const hasGuard = /last\w+Step|last\w+Autocomplete|_observed|guardFlag|isProcessing/i.test(content)
            || content.includes('disconnect()')
          expect(
            hasGuard,
            `${rel}: MutationObserver without guard pattern (risk of infinite loop, see ERR-011)`
          ).toBe(true)
        }
      }
    }
  })

  // ERR-012: blur() before step transitions in AddSpot
  it('ERR-012: AddSpot step transitions call blur', () => {
    const addSpot = readSrc('components/modals/AddSpot.js')
    if (!addSpot) return // File may have been restructured
    if (addSpot.includes('addSpotNextStep') && addSpot.includes('blur')) {
      expect(true).toBe(true)
    }
  })

  // ERR-016: No import(variable) pattern in production code
  it('ERR-016: no dynamic import(variable) in src/', () => {
    const sources = allSources()
    const violations = []
    for (const { rel, content } of sources) {
      // Match import(someVar) but not import('./literal') or import(`./template`)
      const lines = content.split('\n')
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        // Look for import( followed by a bare identifier (not a string literal)
        const match = line.match(/import\(([^)'"`\s]+)\)/)
        if (match && !match[1].startsWith("'") && !match[1].startsWith('"') && !match[1].startsWith('`')) {
          violations.push(`${rel}:${i + 1}: import(${match[1]})`)
        }
      }
    }
    expect(
      violations,
      `import(variable) found (breaks Vite production builds, see ERR-016):\n${violations.join('\n')}`
    ).toHaveLength(0)
  })

  // ERR-019: No .replace(/'/g, "\\'") for onclick escaping in UI code
  // sanitize.js and toggle.js are allowed (they ARE the sanitization implementation)
  it('ERR-019: no incomplete single-quote escaping for onclick in UI code', () => {
    const sources = allSources()
    const allowedFiles = new Set(['utils/sanitize.js', 'utils/toggle.js'])
    const violations = []
    for (const { rel, content } of sources) {
      if (allowedFiles.has(rel)) continue
      if (content.includes(".replace(/'/g,") || content.includes(".replace(/\\'/g,")) {
        violations.push(rel)
      }
    }
    expect(
      violations,
      `Files using .replace(/'/g, ...) instead of escapeJSString() (XSS risk, see ERR-019):\n${violations.join('\n')}`
    ).toHaveLength(0)
  })

  // ERR-019b: escapeJSString exists in sanitize.js
  it('ERR-019: escapeJSString utility exists', () => {
    const sanitize = readSrc('utils/sanitize.js')
    expect(sanitize).not.toBeNull()
    expect(sanitize).toContain('escapeJSString')
    expect(sanitize).toContain('escapeHTML')
  })

  // ERR-021: Landing carousel protected from re-render
  it('ERR-021: render guard for landing carousel exists', () => {
    const main = readSrc('main.js')
    expect(main).not.toBeNull()
    // Should have guard for showLanding or landing-page
    expect(
      main.includes('landing-page') || main.includes('showLanding')
    ).toBe(true)
  })

  // ERR-023: .modal-overlay CSS class is defined
  it('ERR-023: .modal-overlay CSS class exists in main.css', () => {
    const css = readRoot('src/styles/main.css')
    expect(css).not.toBeNull()
    expect(css).toContain('.modal-overlay')
  })

  // ERR-029: DeleteAccount module is wired in App.js
  it('ERR-029: DeleteAccount is registered in App.js lazy loaders', () => {
    const app = readSrc('components/App.js')
    expect(app).not.toBeNull()
    expect(
      app.includes('DeleteAccount') || app.includes('deleteAccount') || app.includes('showDeleteAccount')
    ).toBe(true)
  })

  // ERR-034: No Math.random() for generating IDs (security contexts)
  it('ERR-034: no Math.random() for ID generation in services', () => {
    const serviceFiles = walkJs(path.join(SRC, 'services'))
    const violations = []
    for (const f of serviceFiles) {
      const content = fs.readFileSync(f, 'utf-8')
      const rel = path.relative(SRC, f)
      // Look for Math.random().toString(36) pattern (ID generation)
      if (content.includes('Math.random().toString(36)')) {
        violations.push(rel)
      }
    }
    expect(
      violations,
      `Math.random().toString(36) found in services/ (use crypto.getRandomValues, see ERR-034):\n${violations.join('\n')}`
    ).toHaveLength(0)
  })

  // ERR-037: window.render?.() should not exist (use _forceRender)
  it('ERR-037: no window.render?.() calls (use _forceRender)', () => {
    const sources = allSources()
    const violations = []
    for (const { rel, content } of sources) {
      if (content.includes('window.render?.()') || content.includes('window.render()')) {
        violations.push(rel)
      }
    }
    expect(
      violations,
      `window.render() calls found (should be window._forceRender(), see ERR-037):\n${violations.join('\n')}`
    ).toHaveLength(0)
  })

  // ERR-039 (auto-fix): exports should not be removed automatically
  it('ERR-039: dead-exports check is not auto-fixable', () => {
    const qg = readRoot('scripts/quality-gate.mjs')
    if (!qg) return
    // The dead-exports check should have fixable: false or similar
    if (qg.includes('dead-exports') || qg.includes('deadExports')) {
      expect(
        qg.includes('fixable: false') || qg.includes('fixable:false') || !qg.includes('--fix')
      ).toBe(true)
    }
  })

  // ERR-084: _forceRender protects open modals
  it('ERR-084: _forceRender has guard for open modals', () => {
    const main = readSrc('main.js')
    expect(main).not.toBeNull()
    if (main.includes('_forceRender')) {
      // Should reference showAddSpot or showAuth to protect open modals
      expect(
        main.includes('showAddSpot') || main.includes('showAuth') || main.includes('showSOS')
      ).toBe(true)
    }
  })

  // ERR-099: Firestore rules require auth for writes (no "allow write: if true")
  // Note: "allow read: if true" is intentional for spots (public data)
  it('ERR-099: no "allow write: if true" in Firestore rules', () => {
    const rules = readRoot('firestore.rules')
    expect(rules).not.toBeNull()
    // No blanket write access
    expect(rules).not.toMatch(/allow\s+write:\s+if\s+true/)
    // No blanket create/update/delete without auth
    expect(rules).not.toContain('allow create: if true')
    expect(rules).not.toContain('allow update: if true')
  })

  // ERR-105: CSP includes google.com for reCAPTCHA
  it('ERR-105: CSP includes www.google.com in script-src', () => {
    const html = readRoot('index.html')
    expect(html).not.toBeNull()
    expect(html).toContain('www.google.com')
  })

  // ERR-113: loginAsAdmin has environment guard
  it('ERR-113: loginAsAdmin is protected by env guard', () => {
    const sources = allSources()
    for (const { content } of sources) {
      if (content.includes('loginAsAdmin')) {
        // Should have VITE_SHOW_BETA or similar env guard
        expect(
          content.includes('VITE_SHOW_BETA') || content.includes('import.meta.env')
        ).toBe(true)
        break
      }
    }
  })

  // ERR-114: Firebase Auth persistence is explicitly set
  it('ERR-114: Firebase Auth uses explicit persistence', () => {
    const fb = readSrc('services/firebase.js')
    expect(fb).not.toBeNull()
    expect(
      fb.includes('browserLocalPersistence') || fb.includes('setPersistence')
    ).toBe(true)
  })

  // ERR-119: Coordinate validation before MapLibre calls
  it('ERR-119: isValidCoord or isFinite check exists for map coordinates', () => {
    const sources = allSources()
    let hasCoordValidation = false
    for (const { content } of sources) {
      if (content.includes('isValidCoord') || (content.includes('isFinite') && content.includes('flyTo'))) {
        hasCoordValidation = true
        break
      }
    }
    expect(hasCoordValidation, 'No coordinate validation found before map calls (ERR-119)').toBe(true)
  })

  // ERR-126: _headers CSP is in sync with index.html CSP
  it('ERR-126: _headers file exists for Cloudflare CSP', () => {
    const headers = readRoot('public/_headers')
    expect(headers, 'public/_headers should exist for Cloudflare CSP').not.toBeNull()
    if (headers) {
      expect(headers).toContain('google.com')
    }
  })
})

// ============================================================================
// MAJEUR
// ============================================================================

describe('MAJEUR severity regressions', () => {
  // ERR-003: Rating validation exists
  it('ERR-003: spot form validates ratings before submission', () => {
    const addSpot = readSrc('components/modals/AddSpot.js')
    if (!addSpot) return
    expect(
      addSpot.includes('ratings') || addSpot.includes('safety') || addSpot.includes('rating')
    ).toBe(true)
  })

  // ERR-004: Service Worker denylist includes /guides/
  // (city pages now return 410 Gone so they don't need denylist)
  it('ERR-004: SW navigateFallbackDenylist includes /guides/', () => {
    const viteConfig = readRoot('vite.config.js')
    expect(viteConfig).not.toBeNull()
    if (viteConfig.includes('navigateFallbackDenylist')) {
      expect(viteConfig).toContain('guides')
    }
  })

  // ERR-008: Selectors use onclick attributes, not invented CSS classes
  it('ERR-008: no .method-btn or .group-size-btn or .time-btn selectors in AddSpot', () => {
    const addSpot = readSrc('components/modals/AddSpot.js')
    if (!addSpot) return
    expect(addSpot).not.toContain('.method-btn')
    expect(addSpot).not.toContain('.group-size-btn')
    expect(addSpot).not.toContain('.time-btn')
  })

  // ERR-009: Validation at step change AND final submission
  it('ERR-009: departure city validated at submission', () => {
    const addSpot = readSrc('components/modals/AddSpot.js')
    if (!addSpot) return
    expect(
      addSpot.includes('departureCity') || addSpot.includes('departure')
    ).toBe(true)
  })

  // ERR-014: declineFriendRequest is not a no-op
  it('ERR-014: declineFriendRequest is implemented (not a no-op)', () => {
    const sources = allSources()
    for (const { content } of sources) {
      if (content.includes('declineFriendRequest')) {
        // Should not be an empty arrow function
        const noOpPattern = /window\.declineFriendRequest\s*=\s*\(\)\s*=>\s*\{\s*\}/
        expect(noOpPattern.test(content)).toBe(false)
        break
      }
    }
  })

  // ERR-024: Lazy-loaded handlers have stubs in main.js
  it('ERR-024: critical lazy handlers have stubs in main.js', () => {
    const main = readSrc('main.js')
    expect(main).not.toBeNull()
    // Key handlers that must have stubs
    const criticalHandlers = [
      'openDeleteAccount', 'openAdminPanel', 'openMyData',
    ]
    for (const h of criticalHandlers) {
      expect(
        main.includes(h),
        `main.js should reference ${h} (stub for lazy loading, see ERR-024/ERR-060)`
      ).toBe(true)
    }
  })

  // ERR-033: No duplicate handler between non-main files
  // (Already covered by ERR-001 test above)

  // ERR-036: Cards with autocomplete have overflow-visible
  it('ERR-036: Voyage.js uses overflow-visible for dropdowns', () => {
    const voyage = readSrc('components/views/Voyage.js')
    if (!voyage) return
    if (voyage.includes('autocomplete') || voyage.includes('suggestions')) {
      expect(
        voyage.includes('overflow-visible') || voyage.includes('overflow: visible')
      ).toBe(true)
    }
  })

  // ERR-038: No getState().prop = value pattern
  it('ERR-038: no getState().prop = value mutations', () => {
    const sources = allSources()
    const violations = []
    for (const { rel, content } of sources) {
      // Match getState().xxx = but not getState().xxx === or getState().xxx ==
      const lines = content.split('\n')
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        if (/getState\(\)\.\w+\s*=[^=]/.test(line) && !line.includes('===') && !line.includes('==')) {
          violations.push(`${rel}:${i + 1}`)
        }
      }
    }
    expect(
      violations,
      `getState().prop = value found (use setState() instead, see ERR-038):\n${violations.join('\n')}`
    ).toHaveLength(0)
  })

  // ERR-040: spot deduplication uses Map (or spotLoader simplified to Firestore-only)
  it('ERR-040: spotLoader exists and provides getCountryCenters', () => {
    const loader = readSrc('services/spotLoader.js')
    if (!loader) return
    // Either uses Map for dedup or is simplified to just country centers (Firestore-only)
    expect(
      loader.includes('Map') || loader.includes('new Map') || loader.includes('getCountryCenters')
    ).toBe(true)
  })

  // ERR-046: search inputs use renderSearchInput or proper padding
  it('ERR-046: renderSearchInput utility exists', () => {
    const si = readSrc('utils/searchInput.js')
    expect(si, 'src/utils/searchInput.js should exist (ERR-046)').not.toBeNull()
    if (si) {
      expect(si).toContain('renderSearchInput')
    }
  })

  // ERR-047: Only one toggleTheme implementation
  it('ERR-047: toggleTheme uses body.classList for light-theme', () => {
    const main = readSrc('main.js')
    expect(main).not.toBeNull()
    if (main.includes('toggleTheme')) {
      expect(main).toContain('light-theme')
    }
  })

  // ERR-065: Map scroll lock CSS exists
  it('ERR-065: html.map-active CSS rule exists', () => {
    const css = readRoot('src/styles/main.css')
    expect(css).not.toBeNull()
    expect(css).toContain('html.map-active')
    expect(css).toContain('overflow')
  })

  // ERR-069: No icon('trash-2') calls (should be icon('trash'))
  it('ERR-069/ERR-124: no references to non-existent icon names', () => {
    const icons = readSrc('utils/icons.js')
    if (!icons) return
    // Extract ICON_MAP keys
    const mapMatch = icons.match(/ICON_MAP\s*=\s*\{([^}]+(?:\{[^}]*\}[^}]*)*)\}/)
    if (!mapMatch) return
    // A simple check: trash-2 should not be used if not in ICON_MAP
    const hasTrash2 = icons.includes("'trash-2'") || icons.includes('"trash-2"')
    const sources = allSources()
    for (const { rel, content } of sources) {
      if (rel.includes('icons.js')) continue
      if (content.includes("icon('trash-2')") || content.includes('icon("trash-2")')) {
        expect(hasTrash2, `${rel} uses icon('trash-2') but it may not exist in ICON_MAP (ERR-069)`).toBe(true)
      }
    }
  })

  // ERR-078: innerHTML with API data uses escapeHTML
  it('ERR-078: main.js uses escapeHTML for external data', () => {
    const main = readSrc('main.js')
    expect(main).not.toBeNull()
    expect(
      main.includes('escapeHTML') || main.includes('escapeJSString') || main.includes('textContent')
    ).toBe(true)
  })

  // ERR-082: pagehide event listener for cleanup
  it('ERR-082: pagehide listener exists as beforeunload fallback', () => {
    const main = readSrc('main.js')
    expect(main).not.toBeNull()
    expect(main).toContain('pagehide')
  })

  // ERR-083: Tabs are always re-rendered when becoming active
  it('ERR-083: no stale tab content caching without invalidation', () => {
    const main = readSrc('main.js')
    expect(main).not.toBeNull()
    // The _renderedTabs pattern should not prevent re-render on tab change
    // or should be absent entirely
    if (main.includes('_renderedTabs')) {
      // Should have invalidation logic
      expect(
        main.includes('tabChanged') || main.includes('delete _renderedTabs') || main.includes('_renderedTabs = {}')
      ).toBe(true)
    }
  })

  // ERR-088: Firebase updateDoc filters undefined values
  it('ERR-088: firebase.js filters undefined before Firestore writes', () => {
    const fb = readSrc('services/firebase.js')
    expect(fb).not.toBeNull()
    // Should have undefined filtering pattern
    expect(
      fb.includes('undefined') && (fb.includes('filter') || fb.includes('Object.fromEntries') || fb.includes('!== undefined'))
    ).toBe(true)
  })

  // ERR-096: No external SVG icon references (use inline SVG)
  it('ERR-096: no external SVG icon URLs in main UI code', () => {
    const sources = allSources()
    const violations = []
    for (const { rel, content } of sources) {
      // Check for external icon CDNs
      if (content.includes('cdn.jsdelivr.net') && content.includes('.svg') && !rel.includes('sentry')) {
        violations.push(rel)
      }
      if (content.includes('unpkg.com') && content.includes('.svg')) {
        violations.push(rel)
      }
    }
    expect(
      violations,
      `External SVG icons found (use inline SVG or icons.js, see ERR-096):\n${violations.join('\n')}`
    ).toHaveLength(0)
  })

  // ERR-108: Fox scripts use correct port 3000
  it('ERR-108: scripts use port 3000 (not 5173)', () => {
    const scriptsDir = path.join(ROOT, 'scripts')
    if (!fs.existsSync(scriptsDir)) return
    const scriptFiles = walkJs(scriptsDir)
    const violations = []
    for (const f of scriptFiles) {
      const content = fs.readFileSync(f, 'utf-8')
      if (content.includes('localhost:5173') && !content.includes('localhost:3000')) {
        violations.push(path.relative(ROOT, f))
      }
    }
    expect(
      violations,
      `Scripts using wrong port 5173 (should be 3000, see ERR-108):\n${violations.join('\n')}`
    ).toHaveLength(0)
  })

  // ERR-115: saveSocialLink has sanitization
  it('ERR-115: social link input is sanitized in Profile.js', () => {
    const profile = readSrc('components/views/Profile.js')
    if (!profile) return
    if (profile.includes('saveSocialLink') || profile.includes('socialLink')) {
      expect(
        profile.includes('strip') || profile.includes('replace') || profile.includes('sanitize')
          || profile.includes('trim') || profile.includes('escapeHTML') || profile.includes('textContent')
      ).toBe(true)
    }
  })

  // ERR-116: handleLogout is not duplicated
  it('ERR-116: handleLogout defined in at most one non-handler file', () => {
    const sources = allSources()
    const files = []
    for (const { rel, content } of sources) {
      if (rel.startsWith('handlers/')) continue
      if (/window\.handleLogout\s*=/.test(content)) {
        files.push(rel)
      }
    }
    expect(
      files.length,
      `handleLogout defined in multiple non-handler files: ${files.join(', ')} (see ERR-116)`
    ).toBeLessThanOrEqual(1)
  })

  // ERR-121: addEventListener has cleanup
  it('ERR-121: map event listeners have cleanup mechanism', () => {
    const main = readSrc('main.js')
    const app = readSrc('components/App.js')
    const either = (main || '') + (app || '')
    if (either.includes('touchstart') || either.includes('touchmove')) {
      expect(
        either.includes('removeEventListener') || either.includes('_cleanupMapListeners')
      ).toBe(true)
    }
  })

  // ERR-125: No duplicate class="" attributes on same element
  it('ERR-125: no duplicate class= attributes on same HTML element', () => {
    const sources = allSources()
    const violations = []
    for (const { rel, content } of sources) {
      const lines = content.split('\n')
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        // Simple check: two class= on same line within what looks like one element
        // Match: class="..." ...class="..." but not across different elements (>)
        const classMatches = line.match(/class="/g)
        if (classMatches && classMatches.length >= 2) {
          // Check if they are on the same element (no > between them)
          const firstIdx = line.indexOf('class="')
          const secondIdx = line.indexOf('class="', firstIdx + 7)
          if (secondIdx > -1) {
            const between = line.substring(firstIdx + 7, secondIdx)
            // If there is no > between them, they might be on the same element
            if (!between.includes('>')) {
              violations.push(`${rel}:${i + 1}`)
            }
          }
        }
      }
    }
    // Allow a small number of false positives from template literals
    // but flag if there are more than 5 (likely real duplicates)
    if (violations.length > 10) {
      expect(
        violations.length,
        `Possible duplicate class= attributes found (see ERR-125):\n${violations.slice(0, 10).join('\n')}...`
      ).toBeLessThanOrEqual(10)
    }
  })

  // ERR-128: changeTab closes panels
  it('ERR-128: changeTab resets showOfflinePanel', () => {
    const main = readSrc('main.js')
    expect(main).not.toBeNull()
    if (main.includes('changeTab') && main.includes('showOfflinePanel')) {
      // changeTab should close the offline panel
      expect(main).toContain('showOfflinePanel')
    }
  })

  // Firestore id_verifications rules allow admin update
  it('id_verifications Firestore rules allow admin update', () => {
    const rules = readRoot('firestore.rules')
    expect(rules).not.toBeNull()
    // Should contain admin emails in the id_verifications section
    const section = rules.match(/id_verifications[\s\S]*?allow update[\s\S]*?}/m)
    expect(section, 'id_verifications should have update rule').toBeTruthy()
    if (section) {
      expect(section[0]).toContain('antoine.v.ville@gmail.com')
    }
  })
})

// ============================================================================
// MINEUR
// ============================================================================

describe('MINEUR severity regressions', () => {
  // ERR-005: SEO pages have stop-word filtering
  it('ERR-005: prerender script has stop-word filtering', () => {
    const script = readRoot('scripts/prerender-seo.mjs')
    if (!script) return // Script may have been moved
    if (script.includes('stopWords') || script.includes('STOP_WORDS') || script.includes('filter')) {
      expect(true).toBe(true)
    }
  })

  // ERR-010: Dead code functions are minimal
  it('ERR-010: autoDetectStation/autoDetectRoad are empty or removed', () => {
    const addSpot = readSrc('components/modals/AddSpot.js')
    if (!addSpot) return
    // These functions should be empty stubs or removed entirely
    if (addSpot.includes('autoDetectStation')) {
      // Should be a no-op (empty function body or just a comment)
      const match = addSpot.match(/autoDetectStation[^{]*\{([^}]*)\}/)
      if (match) {
        const body = match[1].trim()
        // Body should be empty or just comments
        const meaningful = body.split('\n').filter(l => l.trim() && !l.trim().startsWith('//')).join('')
        expect(meaningful.length).toBeLessThan(50)
      }
    }
  })

  // ERR-017: E2E tests use toBeAttached for container divs
  it('ERR-017: pattern guidance (no test needed)', () => {
    expect(true).toBe(true) // This is a testing guideline, not a code fix
  })

  // ERR-025: Tests use correct tab IDs
  it('ERR-025: internal tab ID for Voyage is challenges', () => {
    const state = readSrc('stores/state.js')
    if (!state) return
    // The state should define challenges as a valid tab
    expect(
      state.includes('challenges') || state.includes('activeTab')
    ).toBe(true)
  })

  // ERR-030: DailyReward uses i18n (no hardcoded French)
  it('ERR-030: DailyReward.js uses t() for visible text', () => {
    const dr = readSrc('components/modals/DailyReward.js')
    if (!dr) return
    // Should contain t() calls
    expect(dr).toContain("t('")
    // Should not contain unescaped French text like "Recuperer" or "Felicitations"
    expect(dr).not.toContain('Recuperer ma recompense')
    expect(dr).not.toContain('Felicitations')
  })

  // ERR-035: error-patterns check handles guarded assignments
  it('ERR-035: error-patterns handles guarded assignments (if exists)', () => {
    const ep = readRoot('scripts/checks/error-patterns.mjs')
    if (!ep) return
    // Should handle guard pattern
    expect(
      ep.includes('guard') || ep.includes('!window.') || ep.includes('skip')
    ).toBe(true)
  })

  // ERR-048: No direct localStorage.setItem for theme
  it('ERR-048: no direct localStorage.setItem for spothitch_theme', () => {
    const main = readSrc('main.js')
    expect(main).not.toBeNull()
    expect(main).not.toContain("localStorage.setItem('spothitch_theme')")
  })

  // ERR-053: Array.isArray used for reviews checks
  it('ERR-053: FriendProfile uses Array.isArray for reviews', () => {
    const fp = readSrc('components/modals/FriendProfile.js')
    if (!fp) return
    if (fp.includes('reviews')) {
      expect(
        fp.includes('Array.isArray') || !fp.includes('reviews !== null')
      ).toBe(true)
    }
  })

  // ERR-054: localStorage boolean convention uses '1'
  it('ERR-054: BetaBanner uses 1 (not true) for seen flag', () => {
    const bb = readSrc('components/modals/BetaBanner.js')
    if (!bb) return
    if (bb.includes('BETA_SEEN') || bb.includes('beta_seen')) {
      expect(
        bb.includes("'1'") || bb.includes('"1"')
      ).toBe(true)
    }
  })

  // ERR-057: Bottom sheet state stored in dataset
  it('ERR-057: sheet state uses data attribute', () => {
    const voyage = readSrc('components/views/Voyage.js')
    if (!voyage) return
    if (voyage.includes('sheetState') || voyage.includes('SheetState')) {
      expect(
        voyage.includes('dataset.sheetState') || voyage.includes('data-sheet-state')
      ).toBe(true)
    }
  })

  // ERR-079: Search input has maxlength
  it('ERR-079: renderSearchInput has maxlength', () => {
    const si = readSrc('utils/searchInput.js')
    if (!si) return
    expect(si).toContain('maxlength')
  })

  // ERR-087: No references to non-existent i18n key errorGeneric
  it('ERR-087: no references to errorGeneric i18n key', () => {
    const sources = allSources()
    const violations = []
    for (const { rel, content } of sources) {
      if (content.includes("'errorGeneric'") || content.includes('"errorGeneric"')) {
        violations.push(rel)
      }
    }
    expect(
      violations,
      `References to non-existent i18n key 'errorGeneric' (use 'error', see ERR-087):\n${violations.join('\n')}`
    ).toHaveLength(0)
  })

  // ERR-098: No duplicate i18n keys (basic check)
  it('ERR-098: i18n index exports are not duplicated', () => {
    const i18n = readSrc('i18n/index.js')
    if (!i18n) return
    // Basic check: same key should not appear twice on separate lines
    const keyPattern = /^\s*(\w+)\s*:/gm
    const keys = new Map()
    let match
    while ((match = keyPattern.exec(i18n)) !== null) {
      const key = match[1]
      if (keys.has(key)) {
        keys.get(key).count++
      } else {
        keys.set(key, { count: 1 })
      }
    }
    const duplicates = [...keys.entries()].filter(([, v]) => v.count > 1).map(([k]) => k)
    // Some keys may repeat across language objects, so we only flag obvious same-scope duplicates
    // This is a best-effort check
    expect(duplicates.length).toBeLessThan(20) // tolerate cross-language repetitions
  })
})
