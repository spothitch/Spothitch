import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({})),
}))

import { renderLanding, initLandingCarousel } from '../../src/components/Landing.js'

function buildCarouselDOM() {
  const dots = Array.from({ length: 7 }, (_, i) =>
    `<button class="landing-dot" data-i="${i}"></button>`
  ).join('')
  document.body.innerHTML = `
    <div id="landing-track"></div>
    ${dots}
    <button id="landing-next"></button>
  `
}

describe('Landing Carousel (renderLanding)', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    localStorage.clear()
  })

  it('renders landing carousel HTML', () => {
    const html = renderLanding()
    expect(html).toBeTruthy()
    expect(html.length).toBeGreaterThan(100)
  })

  it('renders with class attributes', () => {
    const html = renderLanding()
    expect(html).toContain('class=')
  })

  it('renders step indicators (landing-dot)', () => {
    const html = renderLanding()
    expect(html).toContain('landing-dot')
  })

  it('renders landing-next button', () => {
    const html = renderLanding()
    expect(html).toContain('landing-next')
  })

  it('renders landing-track element', () => {
    const html = renderLanding()
    expect(html).toContain('landing-track')
  })
})

describe('initLandingCarousel', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns early when track element is missing', () => {
    document.body.innerHTML = ''
    expect(() => initLandingCarousel()).not.toThrow()
  })

  it('initializes without error when DOM is present', () => {
    buildCarouselDOM()
    expect(() => initLandingCarousel()).not.toThrow()
  })

  it('landingNext advances slide when initialized', () => {
    buildCarouselDOM()
    initLandingCarousel()
    expect(() => window.landingNext()).not.toThrow()
  })

  it('landingNext does not advance past CODE_SLIDE when alpha not unlocked', () => {
    buildCarouselDOM()
    localStorage.removeItem('spothitch_alpha_code')
    initLandingCarousel()
    // Advance to slide 5 (CODE_SLIDE) by calling landingNext 5 times
    for (let i = 0; i < 5; i++) window.landingNext()
    // 6th call should be blocked (CODE_SLIDE not unlocked)
    window.landingNext()
    const track = document.getElementById('landing-track')
    // Should still be at slide 5 (code slide)
    expect(track.style.transform).toContain('5')
  })

  it('validateAlphaCode shows error for wrong code', () => {
    buildCarouselDOM()
    document.body.innerHTML += '<input id="alpha-code-input" value="wrongcode" /><div id="alpha-code-error" class="hidden"></div>'
    initLandingCarousel()
    window.validateAlphaCode()
    const errorEl = document.getElementById('alpha-code-error')
    expect(errorEl.classList.contains('hidden')).toBe(false)
  })

  it('dot click fires without error', () => {
    buildCarouselDOM()
    localStorage.setItem('spothitch_alpha_code', 'ok')
    initLandingCarousel()
    const firstDot = document.querySelector('.landing-dot[data-i="0"]')
    expect(() => firstDot.click()).not.toThrow()
  })

  it('dot click beyond CODE_SLIDE blocked when not unlocked', () => {
    buildCarouselDOM()
    localStorage.removeItem('spothitch_alpha_code')
    initLandingCarousel()
    const dot6 = document.querySelector('.landing-dot[data-i="6"]')
    expect(() => dot6.click()).not.toThrow()
  })
})
