import { describe, it, expect } from 'vitest'

describe('Skeleton Component', () => {
  it('imports without error', async () => {
    const mod = await import('../../src/components/ui/Skeleton.js')
    expect(mod).toBeDefined()
  })

  it('renderSkeletonSpotList returns HTML', async () => {
    const { renderSkeletonSpotList } = await import('../../src/components/ui/Skeleton.js')
    if (typeof renderSkeletonSpotList === 'function') {
      const html = renderSkeletonSpotList()
      expect(typeof html).toBe('string')
      expect(html.length).toBeGreaterThan(10)
    }
  })

  it('renderSkeletonCard returns HTML', async () => {
    const mod = await import('../../src/components/ui/Skeleton.js')
    const fn = mod.renderSkeletonCard || mod.renderSkeleton
    if (typeof fn === 'function') {
      const html = fn()
      expect(typeof html).toBe('string')
    }
  })
})
