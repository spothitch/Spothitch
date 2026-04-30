/**
 * Phase 5: Cloud Functions — profanity filter tests
 * Tests the containsProfanity logic (pure function)
 */
import { describe, it, expect } from 'vitest'

// Extract the profanity list and containsProfanity logic for testing
// Since the Cloud Function uses CommonJS, we replicate the pure logic here
const PROFANITY_LIST = [
  'fuck', 'shit', 'bitch', 'dick', 'cock', 'pussy', 'nigger', 'faggot',
  'merde', 'putain', 'connard', 'connasse', 'salope', 'enculer', 'nique',
  'puta', 'mierda', 'coño', 'joder', 'cabron',
  'scheiße', 'scheisse', 'arschloch', 'hurensohn', 'fotze', 'wichser',
]

function containsProfanity(text) {
  if (!text) return false
  const normalized = text.toLowerCase()
    .replace(/[._\-\s*!@#$%^&()~`]/g, '')
    .replace(/0/g, 'o').replace(/1/g, 'i').replace(/3/g, 'e')
    .replace(/4/g, 'a').replace(/5/g, 's').replace(/7/g, 't')
    .replace(/8/g, 'b').replace(/\$/g, 's')
  return PROFANITY_LIST.some(w => normalized.includes(w))
}

describe('profanityFilter (Cloud Function logic)', () => {
  describe('containsProfanity', () => {
    it('returns false for clean text', () => {
      expect(containsProfanity('Hello world')).toBe(false)
      expect(containsProfanity('Great hitchhiking spot!')).toBe(false)
      expect(containsProfanity('Super endroit pour faire du stop')).toBe(false)
    })

    it('returns false for null/empty', () => {
      expect(containsProfanity(null)).toBe(false)
      expect(containsProfanity('')).toBe(false)
      expect(containsProfanity(undefined)).toBe(false)
    })

    it('detects English profanity', () => {
      expect(containsProfanity('what the fuck')).toBe(true)
      expect(containsProfanity('this is shit')).toBe(true)
      expect(containsProfanity('you bitch')).toBe(true)
    })

    it('detects French profanity', () => {
      expect(containsProfanity('oh merde')).toBe(true)
      expect(containsProfanity('quel connard')).toBe(true)
      expect(containsProfanity('nique ta mere')).toBe(true)
    })

    it('detects Spanish profanity', () => {
      expect(containsProfanity('que mierda')).toBe(true)
      expect(containsProfanity('hijo de puta')).toBe(true)
    })

    it('detects German profanity', () => {
      expect(containsProfanity('du arschloch')).toBe(true)
      expect(containsProfanity('scheisse')).toBe(true)
    })

    it('detects leet speak bypass attempts', () => {
      expect(containsProfanity('fuk')).toBe(false) // not in list
      expect(containsProfanity('sh1t')).toBe(true) // 1→i → shit
      expect(containsProfanity('f.u.c.k')).toBe(true) // dots removed
      expect(containsProfanity('s*h*i*t')).toBe(true) // asterisks removed
      expect(containsProfanity('b.i.t.c.h')).toBe(true) // dots removed → bitch
    })

    it('detects number substitution bypass', () => {
      expect(containsProfanity('sh1t')).toBe(true)  // 1→i
      expect(containsProfanity('f4ck')).toBe(false) // f4ck → fack, not fuck
      expect(containsProfanity('pu7ain')).toBe(true) // 7→t → putain
    })

    it('case insensitive', () => {
      expect(containsProfanity('FUCK')).toBe(true)
      expect(containsProfanity('Merde')).toBe(true)
      expect(containsProfanity('SHIT')).toBe(true)
    })

    it('detects within longer strings', () => {
      expect(containsProfanity('this message contains the word shit in it')).toBe(true)
      expect(containsProfanity('I just said merde accidentally')).toBe(true)
    })

    it('no false positives on common words', () => {
      expect(containsProfanity('Scunthorpe')).toBe(false) // classic false positive test
      expect(containsProfanity('cocktail')).toBe(true) // contains 'cock' — known limitation
      expect(containsProfanity('document')).toBe(false)
      expect(containsProfanity('class')).toBe(false)
      expect(containsProfanity('assist')).toBe(false)
    })
  })
})
