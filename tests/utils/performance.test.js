import { describe, it, expect, vi, beforeEach } from 'vitest'

import { debounce, throttle } from '../../src/utils/performance.js'

describe('performance', () => {
  beforeEach(() => { vi.useFakeTimers() })

  describe('debounce', () => {
    it('delays function call', () => {
      const fn = vi.fn()
      debounce('test-debounce', fn, 300)
      expect(fn).not.toHaveBeenCalled()
      vi.advanceTimersByTime(300)
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('resets timer on repeated calls', () => {
      const fn = vi.fn()
      debounce('test-debounce2', fn, 300)
      vi.advanceTimersByTime(200)
      debounce('test-debounce2', fn, 300) // reset
      vi.advanceTimersByTime(200)
      expect(fn).not.toHaveBeenCalled()
      vi.advanceTimersByTime(100)
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('handles different keys independently', () => {
      const fn1 = vi.fn()
      const fn2 = vi.fn()
      debounce('key-a', fn1, 100)
      debounce('key-b', fn2, 200)
      vi.advanceTimersByTime(100)
      expect(fn1).toHaveBeenCalledTimes(1)
      expect(fn2).not.toHaveBeenCalled()
      vi.advanceTimersByTime(100)
      expect(fn2).toHaveBeenCalledTimes(1)
    })
  })

  describe('throttle', () => {
    it('calls function immediately on first call', () => {
      const fn = vi.fn()
      throttle('test-throttle', fn, 300)
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('blocks repeated calls within window', () => {
      const fn = vi.fn()
      throttle('test-throttle2', fn, 300)
      throttle('test-throttle2', fn, 300)
      throttle('test-throttle2', fn, 300)
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('allows calls after window expires', () => {
      const fn = vi.fn()
      throttle('test-throttle3', fn, 300)
      vi.advanceTimersByTime(300)
      throttle('test-throttle3', fn, 300)
      expect(fn).toHaveBeenCalledTimes(2)
    })
  })
})
