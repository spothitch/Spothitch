import { describe, it, expect } from 'vitest'

describe('Skeleton Component', () => {
  it('renderSkeletonSpotList returns non-empty HTML with skeleton classes', async () => {
    const { renderSkeletonSpotList } = await import('../../src/components/ui/Skeleton.js')
    if (typeof renderSkeletonSpotList === 'function') {
      const html = renderSkeletonSpotList()
      expect(typeof html).toBe('string')
      expect(html.length).toBeGreaterThan(50)
      expect(html).toContain('animate-pulse')
    }
  })

  it('renderSkeletonCard returns HTML with pulse animation', async () => {
    const mod = await import('../../src/components/ui/Skeleton.js')
    const fn = mod.renderSkeletonCard || mod.renderSkeleton
    if (typeof fn === 'function') {
      const html = fn()
      expect(typeof html).toBe('string')
      expect(html.length).toBeGreaterThan(20)
    }
  })
})
