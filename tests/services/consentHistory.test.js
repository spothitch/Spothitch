import { describe, it, expect, beforeEach } from 'vitest'
import { recordAgeVerification, getConsentHistory, clearConsentHistory } from '../../src/services/consentHistory.js'

describe('ConsentHistory Service', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('recordAgeVerification stores entry', () => {
    const result = recordAgeVerification({ birthDate: '2000-01-01', age: 26, isValid: true })
    expect(result).toBe(true)
  })

  it('getConsentHistory returns array', () => {
    const history = getConsentHistory()
    expect(Array.isArray(history)).toBe(true)
  })

  it('clearConsentHistory empties history', () => {
    recordAgeVerification({ birthDate: '2000-01-01', age: 26, isValid: true })
    clearConsentHistory()
    const history = getConsentHistory()
    expect(history.length).toBe(0)
  })

  it('consent entries have required fields', () => {
    recordAgeVerification({ birthDate: '2000-01-01', age: 26, isValid: true })
    const history = getConsentHistory()
    expect(history.length).toBeGreaterThan(0)
    const entry = history[0]
    expect(entry).toHaveProperty('id')
    expect(entry).toHaveProperty('timestamp')
    expect(entry).toHaveProperty('type')
  })
})

import {
  addConsentEntry,
  recordCookieConsent,
  recordGeolocationConsent,
  recordNotificationConsent,
  recordTermsAcceptance,
  recordPrivacyPolicyAcceptance,
  recordConsentWithdrawal,
  getConsentStatus,
  getAllConsentStatuses,
  isConsentActive,
  getConsentHistoryByType,
  exportConsentHistory,
  getConsentSummary,
  CONSENT_TYPES,
  CONSENT_ACTIONS,
} from '../../src/services/consentHistory.js'

describe('ConsentHistory — addConsentEntry', () => {
  beforeEach(() => { localStorage.clear() })

  it('adds an entry to history', () => {
    addConsentEntry({ type: CONSENT_TYPES.COOKIES, action: CONSENT_ACTIONS.ACCEPTED, value: true })
    expect(getConsentHistory().length).toBe(1)
  })

  it('entry has all required fields', () => {
    addConsentEntry({ type: CONSENT_TYPES.COOKIES, action: CONSENT_ACTIONS.ACCEPTED, value: true, source: 'banner' })
    const entry = getConsentHistory()[0]
    expect(entry.id).toMatch(/^consent_/)
    expect(entry.type).toBe(CONSENT_TYPES.COOKIES)
    expect(entry.action).toBe(CONSENT_ACTIONS.ACCEPTED)
    expect(entry.source).toBe('banner')
  })

  it('most recent entry is at index 0', () => {
    addConsentEntry({ type: CONSENT_TYPES.COOKIES, action: CONSENT_ACTIONS.ACCEPTED, value: true })
    addConsentEntry({ type: CONSENT_TYPES.GEOLOCATION, action: CONSENT_ACTIONS.REFUSED, value: false })
    expect(getConsentHistory()[0].type).toBe(CONSENT_TYPES.GEOLOCATION)
  })
})

describe('ConsentHistory — specific record functions', () => {
  beforeEach(() => { localStorage.clear() })

  it('recordCookieConsent stores cookie consent', () => {
    recordCookieConsent({ analytics: true, marketing: false }, CONSENT_ACTIONS.ACCEPTED)
    const entry = getConsentHistory()[0]
    expect(entry.type).toBe(CONSENT_TYPES.COOKIES)
  })

  it('recordGeolocationConsent with accepted=true', () => {
    recordGeolocationConsent(true)
    const entry = getConsentHistory()[0]
    expect(entry.action).toBe(CONSENT_ACTIONS.ACCEPTED)
    expect(entry.value).toBe(true)
  })

  it('recordGeolocationConsent with accepted=false', () => {
    recordGeolocationConsent(false)
    const entry = getConsentHistory()[0]
    expect(entry.action).toBe(CONSENT_ACTIONS.REFUSED)
  })

  it('recordNotificationConsent with accepted=true', () => {
    recordNotificationConsent(true)
    expect(getConsentHistory()[0].action).toBe(CONSENT_ACTIONS.ACCEPTED)
  })

  it('recordNotificationConsent with accepted=false', () => {
    recordNotificationConsent(false)
    expect(getConsentHistory()[0].action).toBe(CONSENT_ACTIONS.REFUSED)
  })

  it('recordTermsAcceptance stores terms acceptance', () => {
    recordTermsAcceptance('2.0')
    const entry = getConsentHistory()[0]
    expect(entry.type).toBe(CONSENT_TYPES.TERMS_OF_SERVICE)
    expect(entry.action).toBe(CONSENT_ACTIONS.ACCEPTED)
    expect(entry.value.version).toBe('2.0')
  })

  it('recordPrivacyPolicyAcceptance stores policy acceptance', () => {
    recordPrivacyPolicyAcceptance()
    const entry = getConsentHistory()[0]
    expect(entry.type).toBe(CONSENT_TYPES.PRIVACY_POLICY)
  })

  it('recordConsentWithdrawal stores withdrawal', () => {
    recordConsentWithdrawal(CONSENT_TYPES.NOTIFICATIONS)
    const entry = getConsentHistory()[0]
    expect(entry.type).toBe(CONSENT_TYPES.NOTIFICATIONS)
    expect(entry.action).toBe(CONSENT_ACTIONS.WITHDRAWN)
    expect(entry.value).toBe(false)
  })
})

describe('ConsentHistory — query functions', () => {
  beforeEach(() => {
    localStorage.clear()
    recordCookieConsent({ analytics: true }, CONSENT_ACTIONS.ACCEPTED)
    recordGeolocationConsent(true)
    recordNotificationConsent(false)
  })

  it('getConsentStatus returns most recent entry for type', () => {
    const status = getConsentStatus(CONSENT_TYPES.GEOLOCATION)
    expect(status).toBeTruthy()
    expect(status.action).toBe(CONSENT_ACTIONS.ACCEPTED)
  })

  it('getConsentStatus returns null when no entry for type', () => {
    expect(getConsentStatus(CONSENT_TYPES.MARKETING)).toBeNull()
  })

  it('getAllConsentStatuses returns statuses for all consent types with history', () => {
    const statuses = getAllConsentStatuses()
    expect(statuses[CONSENT_TYPES.COOKIES]).toBeTruthy()
    expect(statuses[CONSENT_TYPES.GEOLOCATION]).toBeTruthy()
  })

  it('isConsentActive returns true for accepted consent', () => {
    expect(isConsentActive(CONSENT_TYPES.GEOLOCATION)).toBe(true)
  })

  it('isConsentActive returns false for refused consent', () => {
    expect(isConsentActive(CONSENT_TYPES.NOTIFICATIONS)).toBe(false)
  })

  it('isConsentActive returns false for missing consent', () => {
    expect(isConsentActive(CONSENT_TYPES.MARKETING)).toBe(false)
  })

  it('getConsentHistoryByType filters by type', () => {
    const geoEntries = getConsentHistoryByType(CONSENT_TYPES.GEOLOCATION)
    expect(geoEntries.every(e => e.type === CONSENT_TYPES.GEOLOCATION)).toBe(true)
    expect(geoEntries.length).toBe(1)
  })
})

describe('ConsentHistory — export and summary', () => {
  beforeEach(() => {
    localStorage.clear()
    recordCookieConsent({ analytics: true }, CONSENT_ACTIONS.ACCEPTED)
    recordTermsAcceptance()
  })

  it('exportConsentHistory returns export object', () => {
    const exp = exportConsentHistory()
    expect(exp.exportedAt).toBeTruthy()
    expect(typeof exp.totalEntries).toBe('number')
    expect(Array.isArray(exp.entries)).toBe(true)
    expect(Array.isArray(exp.consentTypes)).toBe(true)
  })

  it('getConsentSummary returns summary with firstConsentDate', () => {
    const summary = getConsentSummary()
    expect(typeof summary.totalChanges).toBe('number')
    expect(summary.firstConsentDate).toBeTruthy()
    expect(summary.lastConsentDate).toBeTruthy()
    expect(typeof summary.currentStatuses).toBe('object')
  })

  it('getConsentSummary returns empty dates when no history', () => {
    localStorage.clear()
    const summary = getConsentSummary()
    expect(summary.totalChanges).toBe(0)
    expect(summary.firstConsentDate).toBeNull()
    expect(summary.lastConsentDate).toBeNull()
  })

  it('exportConsentHistory totalEntries matches entries length', () => {
    const exp = exportConsentHistory()
    expect(exp.totalEntries).toBe(exp.entries.length)
  })
})
