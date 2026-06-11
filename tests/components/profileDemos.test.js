/**
 * ProfileDemos.js window handler tests
 * Covers: switchDemoTab + all 6 demo overlays (show/close/start)
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../src/i18n/index.js', () => ({ t: vi.fn((k) => k) }))
vi.mock('../../src/utils/sanitize.js', () => ({
  escapeHTML: vi.fn((s) => String(s ?? '')),
}))

import '../../src/components/views/ProfileDemos.js'

function clearOverlays() {
  for (const id of [
    'points-demo-overlay', 'journal-demo-overlay', 'social-demo-overlay',
    'guardian-demo-overlay', 'hostels-demo-overlay', 'spot-demo-overlay',
  ]) {
    document.getElementById(id)?.remove()
  }
}

describe('switchDemoTab', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div data-demo="test">
        <span class="cd-tab cd-tab-active" id="tab-a"></span>
        <span class="cd-tab" id="tab-b"></span>
        <div data-cd-panel="panel-a" style="display:block"></div>
        <div data-cd-panel="panel-b" style="display:none"></div>
      </div>
    `
  })

  it('activates the clicked tab and shows its panel', () => {
    const btn = document.getElementById('tab-b')
    window.switchDemoTab(btn, 'panel-b')
    expect(btn.classList.contains('cd-tab-active')).toBe(true)
    expect(document.querySelector('[data-cd-panel="panel-b"]').style.display).toBe('block')
    expect(document.querySelector('[data-cd-panel="panel-a"]').style.display).toBe('none')
  })

  it('deactivates the previously active tab', () => {
    const btn = document.getElementById('tab-b')
    window.switchDemoTab(btn, 'panel-b')
    expect(document.getElementById('tab-a').classList.contains('cd-tab-active')).toBe(false)
  })

  it('does nothing when btn is null', () => {
    expect(() => window.switchDemoTab(null, 'panel-a')).not.toThrow()
  })

  it('switchPointsDemoTab is an alias for switchDemoTab', () => {
    const btn = document.getElementById('tab-b')
    window.switchPointsDemoTab(btn, 'panel-b')
    expect(btn.classList.contains('cd-tab-active')).toBe(true)
  })

  it('switchJournalDemoTab works', () => {
    const btn = document.getElementById('tab-b')
    expect(() => window.switchJournalDemoTab(btn, 'panel-b')).not.toThrow()
  })

  it('switchSocialDemoTab works', () => {
    const btn = document.getElementById('tab-b')
    expect(() => window.switchSocialDemoTab(btn, 'panel-b')).not.toThrow()
  })

  it('switchGuardianDemoTab works', () => {
    const btn = document.getElementById('tab-b')
    expect(() => window.switchGuardianDemoTab(btn, 'panel-b')).not.toThrow()
  })

  it('switchHostelsDemoTab works', () => {
    const btn = document.getElementById('tab-b')
    expect(() => window.switchHostelsDemoTab(btn, 'panel-b')).not.toThrow()
  })

  it('switchSpotDemoTab works', () => {
    const btn = document.getElementById('tab-b')
    expect(() => window.switchSpotDemoTab(btn, 'panel-b')).not.toThrow()
  })
})

describe('Points demo', () => {
  beforeEach(() => { clearOverlays(); document.body.innerHTML = '<div id="app"></div>' })

  it('showPointsDemo appends overlay to body', () => {
    window.showPointsDemo()
    expect(document.getElementById('points-demo-overlay')).not.toBeNull()
  })

  it('closePointsDemo removes overlay', () => {
    window.showPointsDemo()
    window.closePointsDemo()
    expect(document.getElementById('points-demo-overlay')).toBeNull()
  })

  it('startPointsDemo shows main section', () => {
    window.showPointsDemo()
    window.startPointsDemo()
    const main = document.getElementById('points-demo-main')
    expect(main?.style.display).toBe('block')
  })

  it('startPointsDemo hides intro section', () => {
    window.showPointsDemo()
    window.startPointsDemo()
    const intro = document.getElementById('points-demo-intro')
    expect(intro?.style.display).toBe('none')
  })
})

describe('Journal demo', () => {
  beforeEach(() => { clearOverlays(); document.body.innerHTML = '<div id="app"></div>' })

  it('showJournalDemo appends overlay', () => {
    window.showJournalDemo()
    expect(document.getElementById('journal-demo-overlay')).not.toBeNull()
  })

  it('closeJournalDemo removes overlay', () => {
    window.showJournalDemo()
    window.closeJournalDemo()
    expect(document.getElementById('journal-demo-overlay')).toBeNull()
  })

  it('startJournalDemo shows main section', () => {
    window.showJournalDemo()
    window.startJournalDemo()
    expect(document.getElementById('journal-demo-main')?.style.display).toBe('block')
  })
})

describe('Social demo', () => {
  beforeEach(() => { clearOverlays(); document.body.innerHTML = '<div id="app"></div>' })

  it('showSocialDemo appends overlay', () => {
    window.showSocialDemo()
    expect(document.getElementById('social-demo-overlay')).not.toBeNull()
  })

  it('closeSocialDemo removes overlay', () => {
    window.showSocialDemo()
    window.closeSocialDemo()
    expect(document.getElementById('social-demo-overlay')).toBeNull()
  })

  it('startSocialDemo shows main section', () => {
    window.showSocialDemo()
    window.startSocialDemo()
    expect(document.getElementById('social-demo-main')?.style.display).toBe('block')
  })
})

describe('Guardian demo', () => {
  beforeEach(() => { clearOverlays(); document.body.innerHTML = '<div id="app"></div>' })

  it('showGuardianDemo appends overlay', () => {
    window.showGuardianDemo()
    expect(document.getElementById('guardian-demo-overlay')).not.toBeNull()
  })

  it('closeGuardianDemo removes overlay', () => {
    window.showGuardianDemo()
    window.closeGuardianDemo()
    expect(document.getElementById('guardian-demo-overlay')).toBeNull()
  })

  it('startGuardianDemoContent shows main section', () => {
    window.showGuardianDemo()
    window.startGuardianDemoContent()
    expect(document.getElementById('guardian-demo-main')?.style.display).toBe('block')
  })
})

describe('Hostels demo', () => {
  beforeEach(() => { clearOverlays(); document.body.innerHTML = '<div id="app"></div>' })

  it('showHostelsDemo appends overlay', () => {
    window.showHostelsDemo()
    expect(document.getElementById('hostels-demo-overlay')).not.toBeNull()
  })

  it('closeHostelsDemo removes overlay', () => {
    window.showHostelsDemo()
    window.closeHostelsDemo()
    expect(document.getElementById('hostels-demo-overlay')).toBeNull()
  })

  it('startHostelsDemo shows main section', () => {
    window.showHostelsDemo()
    window.startHostelsDemo()
    expect(document.getElementById('hostels-demo-main')?.style.display).toBe('block')
  })
})

describe('Spot demo', () => {
  beforeEach(() => { clearOverlays(); document.body.innerHTML = '<div id="app"></div>' })

  it('showSpotDemo appends overlay', () => {
    window.showSpotDemo()
    expect(document.getElementById('spot-demo-overlay')).not.toBeNull()
  })

  it('closeSpotDemo removes overlay', () => {
    window.showSpotDemo()
    window.closeSpotDemo()
    expect(document.getElementById('spot-demo-overlay')).toBeNull()
  })

  it('startSpotDemo shows main section', () => {
    window.showSpotDemo()
    window.startSpotDemo()
    expect(document.getElementById('spot-demo-main')?.style.display).toBe('block')
  })
})
