import { describe, it, expect, vi } from 'vitest'

vi.mock('firebase/app-check', () => ({
  initializeAppCheck: vi.fn(),
  ReCaptchaV3Provider: vi.fn(),
}))
vi.mock('firebase/app', () => ({
  getApps: vi.fn(() => []),
  getApp: vi.fn(),
}))

import { initAppCheck } from '../../src/services/appCheck.js'

describe('appCheck', () => {
  it('initAppCheck is a function', () => {
    expect(typeof initAppCheck).toBe('function')
  })
  it('initAppCheck does not throw', async () => {
    await expect(initAppCheck()).resolves.not.toThrow()
  })
})
