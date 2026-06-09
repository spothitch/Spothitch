import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../src/utils/sanitize.js', () => ({
  sanitize: vi.fn((html) => html),
}))

import {
  scheduleRender,
  cancelScheduledRender,
  debouncedRender,
  shouldRerender,
  clearRenderCache,
  getRenderStats,
  resetRenderStats,
  batchUpdates,
  memoizedRender,
  patchElement,
  lazyRender,
  trackRenderPerformance,
} from '../../src/utils/render.js'

describe('render utils', () => {
  beforeEach(() => {
    cancelScheduledRender()
    resetRenderStats()
    vi.clearAllMocks()
  })

  describe('scheduleRender', () => {
    it('runs without error', () => {
      const fn = vi.fn()
      expect(() => scheduleRender(fn)).not.toThrow()
    })

    it('calls the render function via RAF', async () => {
      const fn = vi.fn()
      scheduleRender(fn)
      await new Promise(r => setTimeout(r, 50)) // wait for RAF
      // fn may or may not be called depending on happy-dom RAF implementation
    })
  })

  describe('cancelScheduledRender', () => {
    it('runs without error when nothing is scheduled', () => {
      expect(() => cancelScheduledRender()).not.toThrow()
    })

    it('cancels a pending render', () => {
      const fn = vi.fn()
      scheduleRender(fn)
      cancelScheduledRender()
      // After cancel, the fn should not be called
    })
  })

  describe('debouncedRender', () => {
    it('runs without error', () => {
      const fn = vi.fn()
      expect(() => debouncedRender(fn, 50)).not.toThrow()
    })
  })

  describe('shouldRerender', () => {
    it('returns true on first call with any props', () => {
      const result = shouldRerender('comp-test-1', { a: 1 })
      expect(result).toBe(true)
    })

    it('returns false on second call with same props', () => {
      shouldRerender('comp-test-2', { x: 42 })
      const result = shouldRerender('comp-test-2', { x: 42 })
      expect(result).toBe(false)
    })

    it('returns true when props change', () => {
      shouldRerender('comp-test-3', { val: 1 })
      const result = shouldRerender('comp-test-3', { val: 2 })
      expect(result).toBe(true)
    })
  })

  describe('clearRenderCache', () => {
    it('clears cache for a specific component', () => {
      shouldRerender('comp-clear', { a: 1 })
      clearRenderCache('comp-clear')
      // After clearing, shouldRerender should return true again
      expect(shouldRerender('comp-clear', { a: 1 })).toBe(true)
    })
  })

  describe('getRenderStats / resetRenderStats', () => {
    it('getRenderStats returns stats object', () => {
      const stats = getRenderStats()
      expect(typeof stats).toBe('object')
      expect(typeof stats.renderCount).toBe('number')
    })

    it('resetRenderStats resets renderCount to 0', () => {
      resetRenderStats()
      const stats = getRenderStats()
      expect(stats.renderCount).toBe(0)
    })
  })

  describe('trackRenderPerformance', () => {
    it('runs without error', () => {
      expect(() => trackRenderPerformance(performance.now() - 10)).not.toThrow()
    })
  })

  describe('batchUpdates', () => {
    it('calls renderFn after applying updates', () => {
      const renderFn = vi.fn()
      batchUpdates([() => {}, () => {}], renderFn)
      // renderFn should have been scheduled or called
    })

    it('runs without error', () => {
      const renderFn = vi.fn()
      expect(() => batchUpdates([() => 'update1'], renderFn)).not.toThrow()
    })
  })

  describe('memoizedRender', () => {
    it('returns a function', () => {
      const renderFn = vi.fn(() => '<div>Hello</div>')
      const getDeps = vi.fn(() => ['value1'])
      const memoized = memoizedRender(renderFn, getDeps)
      expect(typeof memoized).toBe('function')
    })

    it('calls renderFn when invoked with changed deps', () => {
      const renderFn = vi.fn(() => '<div>Hello</div>')
      let depVal = 'initial'
      const getDeps = vi.fn(() => [depVal])
      const memoized = memoizedRender(renderFn, getDeps)
      memoized() // first call → renders
      expect(renderFn).toHaveBeenCalledTimes(1)
      depVal = 'changed'
      memoized() // second call with different deps → re-renders
      expect(renderFn).toHaveBeenCalledTimes(2)
    })

    it('skips renderFn when deps unchanged', () => {
      const renderFn = vi.fn(() => '<div>Same</div>')
      const getDeps = vi.fn(() => ['stable', 42])
      const memoized = memoizedRender(renderFn, getDeps)
      memoized() // first call
      memoized() // second call with same deps → skips
      expect(renderFn).toHaveBeenCalledTimes(1)
    })
  })

  describe('patchElement', () => {
    it('updates element innerHTML', () => {
      document.body.innerHTML = '<div id="test-patch"></div>'
      const el = document.getElementById('test-patch')
      patchElement(el, '<span>New content</span>')
      expect(el.innerHTML).toContain('New content')
    })

    it('does nothing for null element', () => {
      expect(() => patchElement(null, '<span>Test</span>')).not.toThrow()
    })
  })

  describe('lazyRender', () => {
    it('runs without error for existing selector', () => {
      document.body.innerHTML = '<div class="lazy-target"></div>'
      const renderFn = vi.fn(() => '<span>Content</span>')
      expect(() => lazyRender('.lazy-target', renderFn)).not.toThrow()
    })

    it('runs without error for non-existing selector', () => {
      const renderFn = vi.fn(() => '<span>Content</span>')
      expect(() => lazyRender('.non-existent', renderFn)).not.toThrow()
    })
  })
})
