/**
 * Wiring Tests - Map Scroll Lock (ERR-SCROLL)
 *
 * This test ensures the map tab NEVER allows vertical page scrolling.
 * Bug appeared 3 times — this test makes sure it never comes back.
 *
 * If this test fails, it means someone removed the scroll lock.
 * DO NOT delete or weaken this test. Fix the code instead.
 */

import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const ROOT = resolve(__dirname, '../..')
const readFile = (p) => readFileSync(resolve(ROOT, p), 'utf8')

describe('Map scroll lock (ERR-SCROLL — NEVER REMOVE)', () => {
  const css = readFile('src/styles/main.css')
  const appJs = readFile('src/components/App.js')

  it('CSS: html.map-active has overflow:hidden', () => {
    expect(css).toContain('html.map-active')
    expect(css).toMatch(/html\.map-active[\s\S]*?overflow:\s*hidden\s*!important/)
  })

  it('CSS: html.map-active body has overflow:hidden', () => {
    expect(css).toMatch(/html\.map-active\s+body[\s\S]*?overflow:\s*hidden\s*!important/)
  })

  it('CSS: html.map-active has position:fixed', () => {
    expect(css).toMatch(/html\.map-active[\s\S]*?position:\s*fixed\s*!important/)
  })

  it('JS: afterRender toggles map-active class', () => {
    expect(appJs).toContain("classList.toggle('map-active'")
  })

  it('JS: map-active toggle uses isMapTab()', () => {
    // The toggle must be based on isMapTab, not a hardcoded tab check
    expect(appJs).toMatch(/classList\.toggle\('map-active',\s*isMapTab\(/)
  })

  it('CSS: #home-map-container has touch-action:none', () => {
    expect(css).toMatch(/#home-map-container\s*\{[^}]*touch-action:\s*none/)
  })

  it('CSS: #home-map-container has overflow:hidden', () => {
    expect(css).toMatch(/#home-map-container\s*\{[^}]*overflow:\s*hidden/)
  })

  it('CSS: ERR-SCROLL comment marker is present (guard against accidental removal)', () => {
    expect(css).toContain('ERR-SCROLL: NEVER REMOVE')
    expect(appJs).toContain('ERR-SCROLL')
  })
})
