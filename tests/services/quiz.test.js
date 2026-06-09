import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

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

import {
  quizQuestions,
  getCountryScores,
  getQuizState,
  getRandomQuestion,
  getAllQuestions,
  startQuizTimer,
  stopQuizTimer,
  getAvailableCountries,
  answerQuestion,
  nextQuizQuestion,
  finishQuiz,
} from '../../src/services/quiz.js'
import { getState, setState } from '../../src/stores/state.js'

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

  describe('getCountryScores', () => {
    beforeEach(() => { localStorage.clear() })

    it('returns empty object when nothing stored', () => {
      const scores = getCountryScores()
      expect(typeof scores).toBe('object')
      expect(Object.keys(scores).length).toBe(0)
    })

    it('returns parsed scores when stored', () => {
      localStorage.setItem('spothitch_country_quiz_scores', JSON.stringify({ fr: 80, de: 60 }))
      const scores = getCountryScores()
      expect(scores.fr).toBe(80)
      expect(scores.de).toBe(60)
    })

    it('returns empty object when JSON is invalid', () => {
      localStorage.setItem('spothitch_country_quiz_scores', 'not-json}')
      expect(getCountryScores()).toEqual({})
    })
  })

  describe('getQuizState', () => {
    it('returns an object with quiz fields', () => {
      getState.mockReturnValue({
        quizActive: false,
        quizQuestions: [],
        quizCurrentIndex: 0,
        quizAnswers: [],
        quizScore: 0,
        quizTimeLeft: 60,
        quizResult: null,
      })
      const state = getQuizState()
      expect(typeof state).toBe('object')
      expect('isActive' in state).toBe(true)
      expect('questions' in state).toBe(true)
      expect('score' in state).toBe(true)
      expect('timeLeft' in state).toBe(true)
    })

    it('maps quizActive to isActive', () => {
      getState.mockReturnValue({ quizActive: true })
      expect(getQuizState().isActive).toBe(true)
    })

    it('defaults countryCode to null when not set', () => {
      getState.mockReturnValue({})
      expect(getQuizState().countryCode).toBeNull()
    })
  })

  describe('getRandomQuestion', () => {
    it('returns a question object', () => {
      const q = getRandomQuestion()
      expect(typeof q).toBe('object')
      expect(q.id).toBeDefined()
      expect(q.question).toBeDefined()
    })

    it('returns a question from quizQuestions array', () => {
      const q = getRandomQuestion()
      expect(quizQuestions).toContain(q)
    })
  })

  describe('getAllQuestions', () => {
    it('returns the quizQuestions array', () => {
      const all = getAllQuestions()
      expect(all).toBe(quizQuestions)
    })

    it('returns a non-empty array', () => {
      expect(getAllQuestions().length).toBeGreaterThan(0)
    })
  })

  describe('startQuizTimer / stopQuizTimer', () => {
    afterEach(() => {
      stopQuizTimer()
      vi.clearAllMocks()
    })

    it('startQuizTimer runs without error', () => {
      expect(() => startQuizTimer(60)).not.toThrow()
      stopQuizTimer()
    })

    it('stopQuizTimer runs without error even when no timer', () => {
      stopQuizTimer()
      expect(() => stopQuizTimer()).not.toThrow()
    })

    it('startQuizTimer accepts custom duration', () => {
      expect(() => startQuizTimer(30)).not.toThrow()
      stopQuizTimer()
    })
  })

  describe('getAvailableCountries', () => {
    it('returns an array', () => {
      getState.mockReturnValue({ lang: 'fr' })
      const countries = getAvailableCountries()
      expect(Array.isArray(countries)).toBe(true)
    })

    it('returns empty array when no countries available', () => {
      getState.mockReturnValue({ lang: 'en' })
      const countries = getAvailableCountries()
      expect(countries.length).toBe(0)
    })
  })

  describe('answerQuestion', () => {
    const mockQuestion = quizQuestions[0]

    beforeEach(() => {
      getState.mockReturnValue({
        quizQuestions: [mockQuestion],
        quizCurrentIndex: 0,
        quizAnswers: [],
        quizScore: 0,
      })
    })

    it('returns an object with isCorrect and explanation', () => {
      const result = answerQuestion(mockQuestion.correctIndex)
      expect(typeof result).toBe('object')
      expect('isCorrect' in result).toBe(true)
      expect('explanation' in result).toBe(true)
    })

    it('returns isCorrect=true for correct answer', () => {
      const result = answerQuestion(mockQuestion.correctIndex)
      expect(result.isCorrect).toBe(true)
    })

    it('returns isCorrect=false for wrong answer', () => {
      const wrongIndex = mockQuestion.correctIndex === 0 ? 1 : 0
      const result = answerQuestion(wrongIndex)
      expect(result.isCorrect).toBe(false)
    })

    it('calls setState with updated answers', () => {
      answerQuestion(mockQuestion.correctIndex)
      expect(setState).toHaveBeenCalledWith(expect.objectContaining({
        quizAnswers: expect.any(Array),
        quizScore: expect.any(Number),
        quizShowExplanation: true,
      }))
    })
  })

  describe('nextQuizQuestion', () => {
    it('increments currentIndex', () => {
      getState.mockReturnValue({
        quizCurrentIndex: 0,
        quizQuestions: [quizQuestions[0], quizQuestions[1]],
        quizAnswers: [],
        quizScore: 0,
      })
      nextQuizQuestion()
      expect(setState).toHaveBeenCalledWith(expect.objectContaining({
        quizCurrentIndex: 1,
        quizShowExplanation: false,
      }))
    })

    it('calls finishQuiz when at last question', () => {
      getState.mockReturnValue({
        quizCurrentIndex: 0,
        quizQuestions: [quizQuestions[0]], // only 1 question
        quizAnswers: [{ isCorrect: true }],
        quizScore: 10,
        quizStartTime: null,
        quizCountryCode: null,
        perfectQuiz: false,
      })
      expect(() => nextQuizQuestion()).not.toThrow()
    })
  })

  describe('finishQuiz', () => {
    beforeEach(() => {
      getState.mockReturnValue({
        quizQuestions: [quizQuestions[0]],
        quizAnswers: [{ isCorrect: true }],
        quizScore: 10,
        quizStartTime: null,
        quizCountryCode: null,
        perfectQuiz: false,
      })
    })

    it('returns result object', () => {
      const result = finishQuiz()
      expect(typeof result).toBe('object')
      expect('totalQuestions' in result).toBe(true)
      expect('correctAnswers' in result).toBe(true)
      expect('percentage' in result).toBe(true)
    })

    it('calculates 100% for perfect score', () => {
      getState.mockReturnValue({
        quizQuestions: [quizQuestions[0]],
        quizAnswers: [{ isCorrect: true }],
        quizScore: 10,
        quizStartTime: null,
        quizCountryCode: null,
        perfectQuiz: false,
      })
      const result = finishQuiz()
      expect(result.percentage).toBe(100)
      expect(result.isPerfect).toBe(true)
    })

    it('calculates 0% for no correct answers', () => {
      getState.mockReturnValue({
        quizQuestions: [quizQuestions[0]],
        quizAnswers: [{ isCorrect: false }],
        quizScore: 0,
        quizStartTime: null,
        quizCountryCode: null,
        perfectQuiz: false,
      })
      const result = finishQuiz()
      expect(result.percentage).toBe(0)
      expect(result.isPerfect).toBe(false)
    })

    it('calls setState to end quiz', () => {
      finishQuiz()
      expect(setState).toHaveBeenCalledWith(expect.objectContaining({
        quizActive: false,
        quizResult: expect.any(Object),
      }))
    })
  })
})
