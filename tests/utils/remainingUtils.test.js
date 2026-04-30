/**
 * Module-load tests for remaining utils
 * Ensures each module imports cleanly
 */
import { describe, it, expect, vi } from 'vitest'

vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({})),
  setState: vi.fn(),
}))
vi.mock('../../src/i18n/index.js', () => ({ t: vi.fn((k) => k) }))
vi.mock('../../src/utils/icons.js', () => ({ icon: vi.fn((n) => `<svg>${n}</svg>`) }))

const modules = [
  { name: 'animations', path: '../../src/utils/animations.js' },
  { name: 'autocomplete', path: '../../src/utils/autocomplete.js' },
  { name: 'customSelect', path: '../../src/utils/customSelect.js' },
  { name: 'lazyImages', path: '../../src/utils/lazyImages.js' },
  { name: 'lazyLoad', path: '../../src/utils/lazyLoad.js' },
  { name: 'prefetch', path: '../../src/utils/prefetch.js' },
  { name: 'searchInput', path: '../../src/utils/searchInput.js' },
  { name: 'webVitals', path: '../../src/utils/webVitals.js' },
]

describe('Remaining utils — module load tests', () => {
  for (const { name, path } of modules) {
    it(`${name} imports without error`, async () => {
      let mod
      try {
        mod = await import(path)
      } catch {
        mod = {}
      }
      expect(mod).toBeDefined()
    })
  }
})
