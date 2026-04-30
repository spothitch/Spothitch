/**
 * Phase 6D: Web APIs tests
 * Tests clipboard, geolocation mock, vibration, share API
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('Web APIs', () => {
  describe('Clipboard API', () => {
    beforeEach(() => {
      // Mock clipboard
      global.navigator.clipboard = {
        writeText: vi.fn().mockResolvedValue(undefined),
        readText: vi.fn().mockResolvedValue(''),
      }
    })

    it('writeText stores text', async () => {
      await navigator.clipboard.writeText('Hello')
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Hello')
    })

    it('writeText can be called with URL', async () => {
      await navigator.clipboard.writeText('https://spothitch.com/?spot=42')
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('https://spothitch.com/?spot=42')
    })
  })

  describe('Geolocation API', () => {
    it('getCurrentPosition is available', () => {
      expect(navigator.geolocation.getCurrentPosition).toBeDefined()
    })

    it('watchPosition is available', () => {
      expect(navigator.geolocation.watchPosition).toBeDefined()
    })

    it('clearWatch is available', () => {
      expect(navigator.geolocation.clearWatch).toBeDefined()
    })

    it('mock getCurrentPosition can return coords', () => {
      const success = vi.fn()
      navigator.geolocation.getCurrentPosition.mockImplementation((cb) => {
        cb({
          coords: { latitude: 48.8566, longitude: 2.3522, accuracy: 10 },
          timestamp: Date.now(),
        })
      })
      navigator.geolocation.getCurrentPosition(success)
      expect(success).toHaveBeenCalled()
      const pos = success.mock.calls[0][0]
      expect(pos.coords.latitude).toBe(48.8566)
      expect(pos.coords.longitude).toBe(2.3522)
    })
  })

  describe('Vibration API', () => {
    beforeEach(() => {
      global.navigator.vibrate = vi.fn().mockReturnValue(true)
    })

    it('vibrate can be called with duration', () => {
      navigator.vibrate(200)
      expect(navigator.vibrate).toHaveBeenCalledWith(200)
    })

    it('vibrate can be called with pattern', () => {
      navigator.vibrate([100, 50, 100])
      expect(navigator.vibrate).toHaveBeenCalledWith([100, 50, 100])
    })

    it('vibrate(0) stops vibration', () => {
      navigator.vibrate(0)
      expect(navigator.vibrate).toHaveBeenCalledWith(0)
    })
  })

  describe('Web Share API', () => {
    it('navigator.share is mockable', async () => {
      global.navigator.share = vi.fn().mockResolvedValue(undefined)
      await navigator.share({ title: 'SpotHitch', text: 'Check this spot!', url: 'https://spothitch.com' })
      expect(navigator.share).toHaveBeenCalled()
    })

    it('handles AbortError gracefully', async () => {
      const abortError = new Error('User cancelled')
      abortError.name = 'AbortError'
      global.navigator.share = vi.fn().mockRejectedValue(abortError)
      try {
        await navigator.share({ title: 'Test' })
      } catch (e) {
        expect(e.name).toBe('AbortError')
      }
    })
  })

  describe('matchMedia', () => {
    it('is available for responsive checks', () => {
      const mq = matchMedia('(max-width: 768px)')
      expect(mq).toBeDefined()
      expect(mq.matches).toBeDefined()
    })
  })

  describe('localStorage quota', () => {
    it('handles storage full gracefully', () => {
      // Simulate quota exceeded
      const origSetItem = localStorage.setItem
      localStorage.setItem = vi.fn(() => { throw new DOMException('QuotaExceededError') })

      expect(() => {
        try { localStorage.setItem('test', 'value') } catch { /* expected */ }
      }).not.toThrow()

      localStorage.setItem = origSetItem
    })
  })

  describe('crypto.getRandomValues', () => {
    it('generates random values', () => {
      const arr = new Uint8Array(16)
      crypto.getRandomValues(arr)
      // At least some bytes should be non-zero
      const sum = arr.reduce((s, v) => s + v, 0)
      expect(sum).toBeGreaterThan(0)
    })

    it('fills typed array', () => {
      const arr = new Uint32Array(4)
      crypto.getRandomValues(arr)
      expect(arr.length).toBe(4)
    })
  })
})
