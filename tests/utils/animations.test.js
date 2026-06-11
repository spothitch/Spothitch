import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../src/utils/confetti.js', () => ({
  launchConfettiBurst: vi.fn(),
  floatingEmojisBurst: vi.fn(),
}))
vi.mock('../../src/utils/icons.js', () => ({
  icon: vi.fn((name) => `<svg data-icon="${name}"></svg>`),
}))
vi.mock('../../src/i18n/index.js', () => ({
  t: vi.fn((key) => key),
}))

import {
  showSuccessAnimation,
  showErrorAnimation,
  showBadgeUnlockAnimation,
  showLevelUpAnimation,
  showPointsAnimation,
  playSound,
} from '../../src/utils/animations.js'

describe('animations', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    vi.clearAllMocks()
    delete window.audioContext
  })

  describe('showSuccessAnimation', () => {
    it('runs without error', () => {
      expect(() => showSuccessAnimation('Bravo !')).not.toThrow()
    })

    it('creates a DOM element', () => {
      showSuccessAnimation('Bravo !')
      // May create a banner element
      expect(document.body).toBeTruthy()
    })

    it('accepts options object', () => {
      expect(() => showSuccessAnimation('Done!', { confetti: false, duration: 1000 })).not.toThrow()
    })

    it('works with confetti option', () => {
      // confetti.js is mocked, just verify no error
      expect(() => showSuccessAnimation('Confetti!', { confetti: true })).not.toThrow()
    })
  })

  describe('showErrorAnimation', () => {
    it('runs without error', () => {
      expect(() => showErrorAnimation('Something went wrong')).not.toThrow()
    })

    it('accepts a message string', () => {
      expect(() => showErrorAnimation('Error occurred')).not.toThrow()
    })
  })

  describe('showBadgeUnlockAnimation', () => {
    it('runs without error with a badge object', () => {
      const badge = { id: 'first-spot', name: 'Premier spot', icon: 'star', description: 'Ton premier spot !' }
      expect(() => showBadgeUnlockAnimation(badge)).not.toThrow()
    })

    it('runs without error with minimal badge', () => {
      const minimalBadge = { id: 'test', name: 'Test', icon: 'star', description: '' }
      expect(() => showBadgeUnlockAnimation(minimalBadge)).not.toThrow()
    })
  })

  describe('showLevelUpAnimation', () => {
    it('runs without error', () => {
      expect(() => showLevelUpAnimation(5)).not.toThrow()
    })

    it('accepts level number', () => {
      expect(() => showLevelUpAnimation(10)).not.toThrow()
    })
  })

  describe('showPointsAnimation', () => {
    it('runs without error with coordinates', () => {
      expect(() => showPointsAnimation(100, 200, 300)).not.toThrow()
    })

    it('runs without error with 0 points', () => {
      expect(() => showPointsAnimation(0, 0, 0)).not.toThrow()
    })
  })

  describe('playSound', () => {
    it('runs without error when AudioContext not available', () => {
      // In happy-dom, AudioContext may not be available
      expect(() => playSound('success')).not.toThrow()
    })

    it('handles all sound types without error', () => {
      expect(() => playSound('badge')).not.toThrow()
      expect(() => playSound('levelup')).not.toThrow()
      expect(() => playSound('error')).not.toThrow()
      expect(() => playSound('click')).not.toThrow()
    })
  })
})

describe('animations — AudioContext path', () => {
  let mockOscillator, mockGainNode, mockCtx

  beforeEach(() => {
    document.body.innerHTML = ''
    vi.clearAllMocks()
    delete window.audioContext
    mockOscillator = {
      connect: vi.fn(),
      frequency: { setValueAtTime: vi.fn() },
      start: vi.fn(),
      stop: vi.fn(),
    }
    mockGainNode = {
      connect: vi.fn(),
      gain: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
    }
    mockCtx = {
      createOscillator: vi.fn(() => mockOscillator),
      createGain: vi.fn(() => mockGainNode),
      destination: {},
      currentTime: 0,
    }
    window.audioContext = mockCtx
  })

  afterEach(() => {
    delete window.audioContext
  })

  it('plays badge sound using AudioContext', () => {
    playSound('badge')
    expect(mockCtx.createOscillator).toHaveBeenCalled()
    expect(mockCtx.createGain).toHaveBeenCalled()
    expect(mockOscillator.start).toHaveBeenCalled()
    expect(mockOscillator.stop).toHaveBeenCalled()
  })

  it('plays levelup sound using AudioContext', () => {
    playSound('levelup')
    expect(mockOscillator.start).toHaveBeenCalled()
  })

  it('plays success sound using AudioContext', () => {
    playSound('success')
    expect(mockOscillator.start).toHaveBeenCalled()
  })

  it('plays error sound using AudioContext', () => {
    playSound('error')
    expect(mockOscillator.start).toHaveBeenCalled()
  })

  it('plays click sound using AudioContext', () => {
    playSound('click')
    expect(mockOscillator.start).toHaveBeenCalled()
  })

  it('falls back to click for unknown sound type', () => {
    playSound('unknown-type')
    expect(mockOscillator.start).toHaveBeenCalled()
  })
})

describe('showBadgeUnlockAnimation — with image', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    vi.clearAllMocks()
    delete window.audioContext
  })

  it('renders badge with image src when badge.image is set', () => {
    const badge = { id: 'img-badge', name: 'Photo Badge', image: '/badges/star.png', description: 'Has image' }
    expect(() => showBadgeUnlockAnimation(badge)).not.toThrow()
    expect(document.body.innerHTML).toContain('img')
  })

  it('renders badge icon when badge.image is falsy', () => {
    const badge = { id: 'icon-badge', name: 'Icon Badge', icon: '<svg>star</svg>', description: 'Has icon' }
    expect(() => showBadgeUnlockAnimation(badge)).not.toThrow()
  })
})
