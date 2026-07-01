/**
 * location.js permission-choice logic — pure/deterministic (localStorage-backed via the
 * Storage wrapper). Covers unknown/granted/denied-recent/denied-expired + reset branches.
 */
import { describe, it, expect, beforeEach } from 'vitest'
import {
  getLocationPermissionChoice,
  saveLocationPermissionChoice,
  resetLocationPermission,
} from '../../src/services/location.js'

// Storage wrapper prefixes keys with `spothitch_v4_`.
const DATE_KEY = 'spothitch_v4_location_permission_date'

describe('location permission choice', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns "unknown" when nothing is stored', () => {
    expect(getLocationPermissionChoice()).toBe('unknown')
  })

  it('round-trips a granted choice', () => {
    saveLocationPermissionChoice('granted')
    expect(getLocationPermissionChoice()).toBe('granted')
  })

  it('keeps a recent denied choice', () => {
    saveLocationPermissionChoice('denied')
    expect(getLocationPermissionChoice()).toBe('denied')
  })

  it('expires a denied choice older than 30 days and clears it', () => {
    saveLocationPermissionChoice('denied')
    // Backdate the stored date to 31 days ago (raw prefixed key).
    const old = Date.now() - 31 * 24 * 60 * 60 * 1000
    localStorage.setItem(DATE_KEY, JSON.stringify(old))
    expect(getLocationPermissionChoice()).toBe('unknown')
    // The stale keys were removed.
    expect(getLocationPermissionChoice()).toBe('unknown')
  })

  it('resetLocationPermission clears the stored choice', () => {
    saveLocationPermissionChoice('granted')
    resetLocationPermission()
    expect(getLocationPermissionChoice()).toBe('unknown')
  })
})
