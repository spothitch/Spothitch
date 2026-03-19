/**
 * Wiring Tests - Network & Reload Guards
 * Protects critical behaviors that must NEVER regress:
 * 1. Connectivity check requires multiple failures before going offline
 * 2. Share processing blocks auto-reload
 * 3. Auto-update respects all guard flags
 * 4. No duplicate online/offline listeners in state.js
 *
 * These tests exist because:
 * - The app was going offline on every transient network hiccup (single-failure check)
 * - Share from Google Maps was causing freeze/reload (no share guard in auto-update)
 * - 6 duplicate online/offline listeners were causing race conditions
 */

import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const ROOT = resolve(import.meta.dirname, '../..')

function readSrc(path) {
  return readFileSync(resolve(ROOT, path), 'utf-8')
}

describe('Network: connectivity check resilience', () => {
  const network = readSrc('src/utils/network.js')

  it('must require multiple consecutive failures before marking offline', () => {
    // The threshold mechanism prevents false offline from transient hiccups
    expect(network).toMatch(/CONNECTIVITY_FAIL_THRESHOLD/)
    expect(network).toMatch(/_connectivityFailCount/)
    // Threshold must be >= 2 (single-failure = too fragile)
    const match = network.match(/CONNECTIVITY_FAIL_THRESHOLD\s*=\s*(\d+)/)
    expect(match).toBeTruthy()
    expect(parseInt(match[1], 10)).toBeGreaterThanOrEqual(2)
  })

  it('must use AbortController timeout (not rely on browser default)', () => {
    expect(network).toMatch(/AbortController/)
    expect(network).toMatch(/signal/)
  })

  it('heartbeat interval must be >= 45 seconds (avoid hammering on slow networks)', () => {
    const match = network.match(/setInterval\(checkConnectivity,\s*(\d+)\)/)
    expect(match).toBeTruthy()
    expect(parseInt(match[1], 10)).toBeGreaterThanOrEqual(45000)
  })
})

describe('Share: reload protection during Google Maps share', () => {
  const deeplink = readSrc('src/utils/deeplink.js')
  const autoUpdate = readSrc('src/services/autoUpdate.js')

  it('processShare must set _shareInProgress = true before async coord resolution', () => {
    // Extract just the processShare function body
    const fnStart = deeplink.indexOf('async function processShare')
    const fnBody = deeplink.slice(fnStart)
    // The flag must be set BEFORE coordinate resolution (which is async)
    const flagSet = fnBody.indexOf('_shareInProgress = true')
    const coordResolution = fnBody.indexOf('extractCoordsFromShare')
    expect(flagSet).toBeGreaterThan(-1)
    expect(coordResolution).toBeGreaterThan(-1)
    expect(flagSet).toBeLessThan(coordResolution)
  })

  it('processShare must clear _shareInProgress after completion', () => {
    expect(deeplink).toMatch(/_shareInProgress\s*=\s*false/)
  })

  it('autoUpdate declares _shareInProgress global', () => {
    expect(autoUpdate).toMatch(/window\._shareInProgress/)
  })

  it('doReload checks _shareInProgress before reloading', () => {
    // The reload guard must check the share flag
    expect(autoUpdate).toMatch(/_shareInProgress.*pendingReload\s*=\s*true|pendingReload.*_shareInProgress/)
    // More direct: _shareInProgress must appear in the reload guard condition
    const doReloadSection = autoUpdate.slice(
      autoUpdate.indexOf('async function doReload'),
      autoUpdate.indexOf('showUpdateBanner')
    )
    expect(doReloadSection).toContain('_shareInProgress')
  })

  it('SW controllerchange checks _shareInProgress before reloading', () => {
    const swSection = autoUpdate.slice(autoUpdate.indexOf('controllerchange'))
    expect(swSection).toContain('_shareInProgress')
  })

  it('visibilitychange pending reload checks _shareInProgress', () => {
    // Find the visibilitychange handler that does pendingReload
    expect(autoUpdate).toMatch(/visibilityState.*hidden.*pendingReload.*_shareInProgress|_shareInProgress.*pendingReload.*hidden/)
  })
})

describe('State: no duplicate online/offline listeners', () => {
  const stateFile = readSrc('src/stores/state.js')

  it('state.js must NOT register online/offline event listeners (managed by network.js)', () => {
    // Duplicate listeners cause race conditions (up to 6 handlers firing simultaneously)
    // Online/offline state is managed centrally by network.js initNetworkMonitor()
    const hasOnlineListener = /addEventListener\(\s*['"]online['"]/.test(stateFile)
    const hasOfflineListener = /addEventListener\(\s*['"]offline['"]/.test(stateFile)
    expect(hasOnlineListener).toBe(false)
    expect(hasOfflineListener).toBe(false)
  })
})

describe('Auto-update: auth guard still works', () => {
  const autoUpdate = readSrc('src/services/autoUpdate.js')

  it('doReload checks _authInProgress', () => {
    const doReloadSection = autoUpdate.slice(
      autoUpdate.indexOf('async function doReload'),
      autoUpdate.indexOf('showUpdateBanner')
    )
    expect(doReloadSection).toContain('_authInProgress')
  })

  it('has anti-reload-loop protection', () => {
    expect(autoUpdate).toMatch(/reload.*loop|reloadCount|reload_count/i)
  })
})
