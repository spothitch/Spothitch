import { describe, it, expect, vi } from 'vitest'

vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({})),
  setState: vi.fn(),
}))
vi.mock('../../src/services/gamification.js', () => ({
  addPoints: vi.fn(),
  addSeasonPoints: vi.fn(),
  checkBadges: vi.fn(),
}))
vi.mock('../../src/services/notifications.js', () => ({
  showToast: vi.fn(),
}))
vi.mock('../../src/i18n/index.js', () => ({
  t: vi.fn((key) => key),
}))
vi.mock('../../src/data/quizzes/index.js', () => ({
  getCountryQuizData: vi.fn(() => null),
  getAvailableQuizCountries: vi.fn(() => []),
  countryFlags: {},
  countryNames: {},
}))

import { quizQuestions } from '../../src/services/quiz.js'

describe('quiz', () => {
  describe('quizQuestions', () => {
    it('is a non-empty array', () => {
      expect(Array.isArray(quizQuestions)).toBe(true)
      expect(quizQuestions.length).toBeGreaterThan(3)
    })

    it('each question has required fields', () => {
      quizQuestions.forEach(q => {
        expect(q.id).toBeDefined()
        expect(q.question).toBeDefined()
        expect(Array.isArray(q.options)).toBe(true)
        expect(q.options.length).toBeGreaterThanOrEqual(2)
        expect(typeof q.correctIndex).toBe('number')
        expect(q.correctIndex).toBeGreaterThanOrEqual(0)
        expect(q.correctIndex).toBeLessThan(q.options.length)
        expect(q.points).toBeDefined()
      })
    })

    it('each question has English translations', () => {
      quizQuestions.forEach(q => {
        expect(q.questionEn).toBeDefined()
        expect(q.optionsEn).toBeDefined()
        expect(q.optionsEn.length).toBe(q.options.length)
        expect(q.explanationEn).toBeDefined()
      })
    })

    it('has unique IDs', () => {
      const ids = quizQuestions.map(q => q.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })

    it('correct answer is a valid option', () => {
      quizQuestions.forEach(q => {
        expect(q.options[q.correctIndex]).toBeDefined()
        expect(q.options[q.correctIndex].length).toBeGreaterThan(0)
      })
    })
  })
})
