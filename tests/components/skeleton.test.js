import { describe, it, expect } from 'vitest'

import {
  renderSkeletonLine,
  renderSkeletonCircle,
  renderSkeletonSpotCard,
  renderSkeletonSpotList,
  renderSkeletonBadgeCard,
  renderSkeletonBadgeGrid,
  renderSkeletonChallengeCard,
  renderSkeletonChatMessage,
  renderSkeletonChatList,
  renderSkeletonLeaderboardRow,
  renderSkeletonLeaderboardList,
  renderSkeletonProfileStats,
  renderSkeletonFriendCard,
  renderSkeletonTripStep,
  renderSkeletonMapLoading,
} from '../../src/components/ui/Skeleton.js'

describe('Skeleton Component', () => {
  describe('renderSkeletonLine', () => {
    it('returns an HTML string', () => {
      const html = renderSkeletonLine()
      expect(typeof html).toBe('string')
      expect(html).toContain('skeleton')
    })

    it('accepts custom width and height', () => {
      const html = renderSkeletonLine('w-1/2', 'h-8')
      expect(html).toContain('w-1/2')
      expect(html).toContain('h-8')
    })
  })

  describe('renderSkeletonCircle', () => {
    it('returns a circle skeleton', () => {
      const html = renderSkeletonCircle()
      expect(html).toContain('skeleton')
      expect(html).toContain('rounded-full')
    })

    it('accepts custom size', () => {
      const html = renderSkeletonCircle('w-16 h-16')
      expect(html).toContain('w-16 h-16')
    })
  })

  describe('renderSkeletonSpotCard', () => {
    it('returns spot card skeleton HTML', () => {
      const html = renderSkeletonSpotCard()
      expect(typeof html).toBe('string')
      expect(html).toContain('animate-pulse')
      expect(html.length).toBeGreaterThan(50)
    })
  })

  describe('renderSkeletonSpotList', () => {
    it('returns list skeleton HTML', () => {
      const html = renderSkeletonSpotList()
      expect(typeof html).toBe('string')
      expect(html).toContain('animate-pulse')
    })

    it('renders n cards when count specified', () => {
      const html = renderSkeletonSpotList(5)
      expect(typeof html).toBe('string')
      expect(html.length).toBeGreaterThan(100)
    })
  })

  describe('renderSkeletonBadgeCard', () => {
    it('returns badge card skeleton', () => {
      const html = renderSkeletonBadgeCard()
      expect(typeof html).toBe('string')
      expect(html).toContain('animate-pulse')
    })
  })

  describe('renderSkeletonBadgeGrid', () => {
    it('returns badge grid skeleton', () => {
      const html = renderSkeletonBadgeGrid()
      expect(typeof html).toBe('string')
    })

    it('accepts custom count', () => {
      const html = renderSkeletonBadgeGrid(3)
      expect(typeof html).toBe('string')
    })
  })

  describe('renderSkeletonChallengeCard', () => {
    it('returns challenge skeleton', () => {
      const html = renderSkeletonChallengeCard()
      expect(typeof html).toBe('string')
      expect(html).toContain('animate-pulse')
    })
  })

  describe('renderSkeletonChatMessage', () => {
    it('returns chat message skeleton', () => {
      const html = renderSkeletonChatMessage()
      expect(typeof html).toBe('string')
      expect(html).toContain('animate-pulse')
    })

    it('renders own message variant', () => {
      const html = renderSkeletonChatMessage(true)
      expect(typeof html).toBe('string')
    })
  })

  describe('renderSkeletonChatList', () => {
    it('returns chat list skeleton', () => {
      const html = renderSkeletonChatList()
      expect(typeof html).toBe('string')
    })
  })

  describe('renderSkeletonLeaderboardRow', () => {
    it('returns leaderboard row skeleton', () => {
      const html = renderSkeletonLeaderboardRow()
      expect(typeof html).toBe('string')
      expect(html).toContain('animate-pulse')
    })
  })

  describe('renderSkeletonLeaderboardList', () => {
    it('returns leaderboard list skeleton', () => {
      const html = renderSkeletonLeaderboardList()
      expect(typeof html).toBe('string')
    })
  })

  describe('renderSkeletonProfileStats', () => {
    it('returns profile stats skeleton', () => {
      const html = renderSkeletonProfileStats()
      expect(typeof html).toBe('string')
      expect(html).toContain('animate-pulse')
    })
  })

  describe('renderSkeletonFriendCard', () => {
    it('returns friend card skeleton', () => {
      const html = renderSkeletonFriendCard()
      expect(typeof html).toBe('string')
      expect(html).toContain('animate-pulse')
    })
  })

  describe('renderSkeletonTripStep', () => {
    it('returns trip step skeleton', () => {
      const html = renderSkeletonTripStep()
      expect(typeof html).toBe('string')
      expect(html).toContain('animate-pulse')
    })
  })

  describe('renderSkeletonMapLoading', () => {
    it('returns map loading skeleton', () => {
      const html = renderSkeletonMapLoading()
      expect(typeof html).toBe('string')
    })
  })
})
