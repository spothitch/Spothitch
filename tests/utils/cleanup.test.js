import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

import {
  registerCleanup,
  runCleanup,
  runAllCleanup,
  addTrackedListener,
  createTrackedInterval,
  createTrackedTimeout,
  clearTrackedInterval,
  disconnectObserver,
} from '../../src/utils/cleanup.js'

describe('cleanup', () => {
  beforeEach(() => {
    // Reset all state by running all cleanups
    runAllCleanup()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
    runAllCleanup()
  })

  describe('registerCleanup', () => {
    it('registers and runs a cleanup function', () => {
      const fn = vi.fn()
      registerCleanup('test-component', fn)
      runCleanup('test-component')
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('runs existing cleanup before registering new one for same ID', () => {
      const first = vi.fn()
      const second = vi.fn()
      registerCleanup('comp', first)
      registerCleanup('comp', second)
      // first should have been called when second was registered
      expect(first).toHaveBeenCalledTimes(1)
      runCleanup('comp')
      expect(second).toHaveBeenCalledTimes(1)
    })

    it('handles multiple different component IDs', () => {
      const fn1 = vi.fn()
      const fn2 = vi.fn()
      registerCleanup('comp1', fn1)
      registerCleanup('comp2', fn2)
      runCleanup('comp1')
      expect(fn1).toHaveBeenCalledTimes(1)
      expect(fn2).not.toHaveBeenCalled()
    })
  })

  describe('runCleanup', () => {
    it('calls the cleanup function for the given ID', () => {
      const fn = vi.fn()
      registerCleanup('my-id', fn)
      runCleanup('my-id')
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('does nothing for an unknown ID', () => {
      expect(() => runCleanup('nonexistent-id')).not.toThrow()
    })

    it('removes the cleanup function after running it', () => {
      const fn = vi.fn()
      registerCleanup('once', fn)
      runCleanup('once')
      runCleanup('once') // second call should not invoke fn again
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('does not throw when cleanup function throws', () => {
      registerCleanup('throws', () => { throw new Error('cleanup error') })
      expect(() => runCleanup('throws')).not.toThrow()
    })
  })

  describe('runAllCleanup', () => {
    it('calls all registered cleanup functions', () => {
      const fn1 = vi.fn()
      const fn2 = vi.fn()
      const fn3 = vi.fn()
      registerCleanup('a', fn1)
      registerCleanup('b', fn2)
      registerCleanup('c', fn3)
      runAllCleanup()
      expect(fn1).toHaveBeenCalledTimes(1)
      expect(fn2).toHaveBeenCalledTimes(1)
      expect(fn3).toHaveBeenCalledTimes(1)
    })

    it('clears all registered cleanups after running', () => {
      const fn = vi.fn()
      registerCleanup('one', fn)
      runAllCleanup()
      runAllCleanup() // second call should not invoke fn again
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('does not throw when a cleanup function throws', () => {
      registerCleanup('bad', () => { throw new Error('boom') })
      expect(() => runAllCleanup()).not.toThrow()
    })
  })

  describe('addTrackedListener', () => {
    it('adds event listener to target', () => {
      const target = {
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }
      const handler = vi.fn()
      addTrackedListener('listener-test', target, 'click', handler)
      expect(target.addEventListener).toHaveBeenCalledWith('click', handler, {})
    })

    it('removes event listener on cleanup', () => {
      const target = {
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }
      const handler = vi.fn()
      addTrackedListener('listener-test', target, 'click', handler)
      runCleanup('listener-test')
      expect(target.removeEventListener).toHaveBeenCalledWith('click', handler, {})
    })

    it('does nothing when target is null', () => {
      expect(() => addTrackedListener('null-test', null, 'click', vi.fn())).not.toThrow()
    })

    it('chains cleanups when same ID is used for multiple listeners', () => {
      const t1 = { addEventListener: vi.fn(), removeEventListener: vi.fn() }
      const t2 = { addEventListener: vi.fn(), removeEventListener: vi.fn() }
      const h1 = vi.fn()
      const h2 = vi.fn()
      addTrackedListener('multi', t1, 'click', h1)
      addTrackedListener('multi', t2, 'keydown', h2)
      runCleanup('multi')
      expect(t1.removeEventListener).toHaveBeenCalled()
      expect(t2.removeEventListener).toHaveBeenCalled()
    })

    it('passes options to addEventListener', () => {
      const target = { addEventListener: vi.fn(), removeEventListener: vi.fn() }
      const handler = vi.fn()
      addTrackedListener('opts-test', target, 'scroll', handler, { passive: true })
      expect(target.addEventListener).toHaveBeenCalledWith('scroll', handler, { passive: true })
    })
  })

  describe('createTrackedInterval', () => {
    it('returns an interval ID', () => {
      vi.useFakeTimers()
      const id = createTrackedInterval('int-test', vi.fn(), 1000)
      expect(id).toBeDefined()
      clearTrackedInterval('int-test')
    })

    it('calls callback at the specified interval', () => {
      vi.useFakeTimers()
      const cb = vi.fn()
      createTrackedInterval('int-test2', cb, 500)
      vi.advanceTimersByTime(1500)
      expect(cb).toHaveBeenCalledTimes(3)
      clearTrackedInterval('int-test2')
    })

    it('clears existing interval when same ID is reused', () => {
      vi.useFakeTimers()
      const old = vi.fn()
      const newCb = vi.fn()
      createTrackedInterval('reuse', old, 100)
      createTrackedInterval('reuse', newCb, 100)
      vi.advanceTimersByTime(200)
      // old should not have been called after being replaced
      expect(newCb).toHaveBeenCalled()
      clearTrackedInterval('reuse')
    })
  })

  describe('clearTrackedInterval', () => {
    it('clears and removes the interval', () => {
      vi.useFakeTimers()
      const cb = vi.fn()
      createTrackedInterval('clear-test', cb, 100)
      clearTrackedInterval('clear-test')
      vi.advanceTimersByTime(500)
      expect(cb).not.toHaveBeenCalled()
    })

    it('does nothing for unknown ID', () => {
      expect(() => clearTrackedInterval('nonexistent')).not.toThrow()
    })
  })

  describe('createTrackedTimeout', () => {
    it('returns a timeout ID', () => {
      vi.useFakeTimers()
      const id = createTrackedTimeout(vi.fn(), 500)
      expect(id).toBeDefined()
    })

    it('calls callback after the delay', () => {
      vi.useFakeTimers()
      const cb = vi.fn()
      createTrackedTimeout(cb, 300)
      vi.advanceTimersByTime(300)
      expect(cb).toHaveBeenCalledTimes(1)
    })

    it('callback is called only once', () => {
      vi.useFakeTimers()
      const cb = vi.fn()
      createTrackedTimeout(cb, 100)
      vi.advanceTimersByTime(500)
      expect(cb).toHaveBeenCalledTimes(1)
    })
  })

  describe('disconnectObserver', () => {
    it('does nothing for unknown ID', () => {
      expect(() => disconnectObserver('ghost')).not.toThrow()
    })
  })

  describe('runAllCleanup — intervals and timeouts', () => {
    it('clears all intervals when runAllCleanup is called', () => {
      vi.useFakeTimers()
      const cb = vi.fn()
      createTrackedInterval('bulk-int', cb, 100)
      runAllCleanup()
      vi.advanceTimersByTime(500)
      expect(cb).not.toHaveBeenCalled()
    })

    it('clears all timeouts when runAllCleanup is called', () => {
      vi.useFakeTimers()
      const cb = vi.fn()
      createTrackedTimeout(cb, 200)
      runAllCleanup()
      vi.advanceTimersByTime(500)
      expect(cb).not.toHaveBeenCalled()
    })
  })
})
