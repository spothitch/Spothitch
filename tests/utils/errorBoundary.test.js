import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('../../src/i18n/index.js', () => ({
  t: vi.fn((key) => key),
}))
vi.mock('../../src/utils/icons.js', () => ({
  icon: vi.fn((name) => `<svg>${name}</svg>`),
}))

import {
  withErrorBoundary,
  safeExecute,
  safeExecuteAsync,
  getErrorLog,
  clearErrorLog,
} from '../../src/utils/errorBoundary.js'

describe('errorBoundary', () => {
  beforeEach(() => {
    clearErrorLog()
  })

  describe('withErrorBoundary', () => {
    it('passes through when no error', () => {
      const fn = () => '<div>Hello</div>'
      const safe = withErrorBoundary(fn, 'TestComponent')
      expect(safe()).toBe('<div>Hello</div>')
    })

    it('returns fallback HTML on error', () => {
      const fn = () => { throw new Error('render failed') }
      const safe = withErrorBoundary(fn, 'TestComponent')
      const result = safe()
      expect(result).toContain('error-boundary')
      expect(result).toContain('errorOccurred')
    })

    it('uses custom fallback when provided', () => {
      const fn = () => { throw new Error('boom') }
      const safe = withErrorBoundary(fn, 'Test', '<div>Custom fallback</div>')
      expect(safe()).toBe('<div>Custom fallback</div>')
    })

    it('passes arguments to wrapped function', () => {
      const fn = (a, b) => `${a}-${b}`
      const safe = withErrorBoundary(fn, 'Test')
      expect(safe('hello', 'world')).toBe('hello-world')
    })

    it('logs error on failure', () => {
      const fn = () => { throw new Error('logged error') }
      const safe = withErrorBoundary(fn, 'TestComp')
      safe()
      const log = getErrorLog()
      expect(log.length).toBe(1)
      expect(log[0].context).toBe('TestComp')
      expect(log[0].message).toBe('logged error')
    })
  })

  describe('safeExecute', () => {
    it('returns function result when no error', () => {
      expect(safeExecute(() => 42, 'test')).toBe(42)
    })

    it('returns fallback on error', () => {
      expect(safeExecute(() => { throw new Error('boom') }, 'test', 'fallback')).toBe('fallback')
    })

    it('returns null as default fallback', () => {
      expect(safeExecute(() => { throw new Error('boom') }, 'test')).toBeNull()
    })

    it('logs error', () => {
      safeExecute(() => { throw new Error('logged') }, 'context')
      expect(getErrorLog().length).toBe(1)
    })
  })

  describe('safeExecuteAsync', () => {
    it('returns async result when no error', async () => {
      const result = await safeExecuteAsync(async () => 42, 'test')
      expect(result).toBe(42)
    })

    it('returns fallback on async error', async () => {
      const result = await safeExecuteAsync(
        async () => { throw new Error('async boom') },
        'test',
        'fallback'
      )
      expect(result).toBe('fallback')
    })

    it('returns null as default fallback', async () => {
      const result = await safeExecuteAsync(
        async () => { throw new Error('boom') },
        'test'
      )
      expect(result).toBeNull()
    })
  })

  describe('getErrorLog', () => {
    it('returns empty array initially', () => {
      expect(getErrorLog()).toEqual([])
    })

    it('returns copy of log (not reference)', () => {
      safeExecute(() => { throw new Error('test') }, 'test')
      const log1 = getErrorLog()
      const log2 = getErrorLog()
      expect(log1).not.toBe(log2)
      expect(log1).toEqual(log2)
    })

    it('log entries have expected fields', () => {
      safeExecute(() => { throw new Error('test msg') }, 'myContext')
      const entry = getErrorLog()[0]
      expect(entry.context).toBe('myContext')
      expect(entry.message).toBe('test msg')
      expect(entry.timestamp).toBeDefined()
    })
  })

  describe('clearErrorLog', () => {
    it('clears all entries', () => {
      safeExecute(() => { throw new Error('a') }, 'a')
      safeExecute(() => { throw new Error('b') }, 'b')
      expect(getErrorLog().length).toBe(2)
      clearErrorLog()
      expect(getErrorLog().length).toBe(0)
    })
  })
})
