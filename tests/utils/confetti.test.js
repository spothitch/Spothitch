import { describe, it, expect } from 'vitest'
import {
  launchConfetti,
  launchCenterConfetti,
  launchConfettiBurst,
  floatingEmoji,
  floatingEmojisBurst,
} from '../../src/utils/confetti.js'

describe('Confetti Utils', () => {
  describe('launchConfetti', () => {
    it('runs without error', () => {
      expect(() => launchConfetti(100, 200)).not.toThrow()
    })

    it('adds a confetti container to the DOM', () => {
      launchConfetti(100, 200, 1)
      const container = document.querySelector('.confetti-container')
      expect(container).toBeTruthy()
    })

    it('can be called multiple times without crash', () => {
      expect(() => {
        launchConfetti(100, 200, 2)
        launchConfetti(200, 300, 2)
      }).not.toThrow()
    })

    it('accepts undefined coordinates', () => {
      expect(() => launchConfetti()).not.toThrow()
    })
  })

  describe('launchCenterConfetti', () => {
    it('runs without error', () => {
      expect(() => launchCenterConfetti()).not.toThrow()
    })

    it('accepts custom count', () => {
      expect(() => launchCenterConfetti(20)).not.toThrow()
    })
  })

  describe('launchConfettiBurst', () => {
    it('runs without error', () => {
      expect(() => launchConfettiBurst()).not.toThrow()
    })
  })

  describe('floatingEmoji', () => {
    it('runs without error', () => {
      expect(() => floatingEmoji('star', 100, 200)).not.toThrow()
    })

    it('adds an element to the DOM', () => {
      document.body.innerHTML = ''
      floatingEmoji('X', 50, 50)
      expect(document.body.children.length).toBeGreaterThan(0)
    })
  })

  describe('floatingEmojisBurst', () => {
    it('runs without error', () => {
      expect(() => floatingEmojisBurst('star', 3)).not.toThrow()
    })

    it('uses default count', () => {
      expect(() => floatingEmojisBurst('star')).not.toThrow()
    })
  })
})
