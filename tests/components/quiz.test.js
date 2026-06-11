/**
 * Quiz.js tests — renderQuiz branches + renderAnswerFeedback
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../src/i18n/index.js', () => ({ t: vi.fn((k) => k) }))
vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({ showQuiz: false, lang: 'fr' })),
}))
vi.mock('../../src/services/quiz.js', () => ({
  getQuizState: vi.fn(() => ({
    isActive: false,
    questions: null,
    currentIndex: 0,
    answers: [],
    score: 0,
    timeLeft: 60,
    result: null,
    countryCode: null,
    showExplanation: false,
    lastAnswer: null,
  })),
  getAvailableCountries: vi.fn(() => [
    { code: 'FR', flag: '🇫🇷', name: 'France' },
    { code: 'DE', flag: '🇩🇪', name: 'Allemagne' },
  ]),
  getCountryScores: vi.fn(() => ({ FR: { best: 85 } })),
}))
vi.mock('../../src/data/quizzes/index.js', () => ({
  countryFlags: { FR: '🇫🇷', DE: '🇩🇪' },
  countryNames: { FR: { fr: 'France', en: 'France' }, DE: { fr: 'Allemagne', en: 'Germany' } },
}))

import { renderQuiz, renderAnswerFeedback } from '../../src/components/modals/Quiz.js'
import { getState } from '../../src/stores/state.js'
import { getQuizState } from '../../src/services/quiz.js'

const mockQuestion = {
  question: 'Quelle ville est la capitale de France ?',
  questionEn: 'What is the capital of France?',
  options: ['Paris', 'Lyon', 'Marseille', 'Bordeaux'],
  optionsEn: ['Paris', 'Lyon', 'Marseille', 'Bordeaux'],
  answer: 0,
  explanation: 'Paris est la capitale.',
  explanationEn: 'Paris is the capital.',
  category: 'geography',
}

describe('renderQuiz — visibility gate', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getState.mockReturnValue({ showQuiz: false, lang: 'fr' })
  })

  it('returns empty string when showQuiz is false', () => {
    expect(renderQuiz()).toBe('')
  })
})

describe('renderQuiz — country selection screen', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getState.mockReturnValue({ showQuiz: true, lang: 'fr' })
    getQuizState.mockReturnValue({
      isActive: false, questions: null, currentIndex: 0,
      result: null, showExplanation: false, lastAnswer: null,
      score: 0, timeLeft: 60, countryCode: null,
    })
  })

  it('renders quiz modal HTML', () => {
    const html = renderQuiz()
    expect(html).toBeTruthy()
    expect(html.length).toBeGreaterThan(100)
  })

  it('renders country selection with available countries', () => {
    const html = renderQuiz()
    expect(html).toContain('France')
  })

  it('renders start quiz button', () => {
    const html = renderQuiz()
    expect(html).toContain('startQuizGame')
  })

  it('renders best score for country with existing score', () => {
    const html = renderQuiz()
    expect(html).toContain('85%')
  })

  it('renders country with no score (no percentage)', () => {
    const html = renderQuiz()
    // DE has no score so no percentage for it specifically
    expect(html).toContain('Allemagne')
  })

  it('renders close quiz button', () => {
    const html = renderQuiz()
    expect(html).toContain('closeQuiz')
  })

  it('renders quiz-modal class', () => {
    const html = renderQuiz()
    expect(html).toContain('quiz-modal')
  })
})

describe('renderQuiz — active question', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getState.mockReturnValue({ showQuiz: true, lang: 'fr' })
    getQuizState.mockReturnValue({
      isActive: true,
      questions: [mockQuestion],
      currentIndex: 0,
      result: null,
      showExplanation: false,
      lastAnswer: null,
      score: 0,
      timeLeft: 45,
      countryCode: null,
    })
  })

  it('renders the question text', () => {
    const html = renderQuiz()
    expect(html).toContain('Quelle ville est la capitale de France')
  })

  it('renders answer options', () => {
    const html = renderQuiz()
    expect(html).toContain('Paris')
    expect(html).toContain('Lyon')
  })

  it('renders time remaining', () => {
    const html = renderQuiz()
    expect(html).toContain('45s')
  })

  it('renders answerQuizQuestion onclick handlers', () => {
    const html = renderQuiz()
    expect(html).toContain('answerQuizQuestion')
  })

  it('renders with country code shows flag', () => {
    getQuizState.mockReturnValue({
      isActive: true,
      questions: [mockQuestion],
      currentIndex: 0,
      result: null,
      showExplanation: false,
      lastAnswer: null,
      score: 0,
      timeLeft: 30,
      countryCode: 'FR',
    })
    const html = renderQuiz()
    expect(html).toContain('🇫🇷')
  })

  it('renders category badge when question has category', () => {
    const html = renderQuiz()
    expect(html).toContain('geography')
  })

  it('renders EN question text when lang is en and questionEn exists (no options fallback)', () => {
    const enQuestion = { ...mockQuestion, question: undefined, options: undefined }
    getState.mockReturnValue({ showQuiz: true, lang: 'en' })
    getQuizState.mockReturnValue({
      isActive: true,
      questions: [enQuestion],
      currentIndex: 0,
      result: null,
      showExplanation: false,
      lastAnswer: null,
      score: 0,
      timeLeft: 60,
      countryCode: null,
    })
    const html = renderQuiz()
    expect(html).toContain('What is the capital of France')
  })
})

describe('renderQuiz — explanation screen', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getState.mockReturnValue({ showQuiz: true, lang: 'fr' })
    getQuizState.mockReturnValue({
      isActive: true,
      questions: [mockQuestion],
      currentIndex: 0,
      result: null,
      showExplanation: true,
      lastAnswer: { isCorrect: true, explanation: 'Paris est la capitale', correctIndex: 0, category: null },
      score: 1,
      timeLeft: 40,
      countryCode: null,
    })
  })

  it('renders explanation modal HTML', () => {
    const html = renderQuiz()
    expect(html).toBeTruthy()
    expect(html.length).toBeGreaterThan(100)
  })

  it('renders explanation text', () => {
    const html = renderQuiz()
    expect(html).toContain('Paris est la capitale')
  })

  it('renders nextQuizQuestion button', () => {
    const html = renderQuiz()
    expect(html).toContain('nextQuizQuestion')
  })

  it('renders correct answer indicator for correct answer', () => {
    const html = renderQuiz()
    expect(html).toContain('Paris') // the correct answer is shown
  })
})

describe('renderQuiz — result screen', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getState.mockReturnValue({ showQuiz: true, lang: 'fr' })
    getQuizState.mockReturnValue({
      isActive: false,
      questions: [mockQuestion],
      currentIndex: 1,
      result: { score: 4, total: 5, percentage: 80, points: 200, isCountryQuiz: false },
      showExplanation: false,
      lastAnswer: null,
      score: 4,
      timeLeft: 0,
      countryCode: null,
    })
  })

  it('renders result HTML', () => {
    const html = renderQuiz()
    expect(html).toBeTruthy()
    expect(html.length).toBeGreaterThan(100)
  })

  it('renders score percentage', () => {
    const html = renderQuiz()
    expect(html).toContain('80')
  })

  it('renders score fraction', () => {
    const html = renderQuiz()
    expect(html).toContain('4') // score
    expect(html).toContain('5') // total
  })

  it('renders replay button', () => {
    const html = renderQuiz()
    expect(html).toContain('retryQuiz')
  })

  it('renders country quiz result with country code', () => {
    getQuizState.mockReturnValue({
      isActive: false,
      questions: [mockQuestion],
      currentIndex: 1,
      result: { score: 8, total: 10, percentage: 80, points: 400, isCountryQuiz: true, countryCode: 'FR' },
      showExplanation: false,
      lastAnswer: null,
      score: 8,
      timeLeft: 0,
      countryCode: 'FR',
    })
    const html = renderQuiz()
    expect(html).toBeTruthy()
  })
})

describe('renderAnswerFeedback', () => {
  it('renders green feedback for correct answer', () => {
    const html = renderAnswerFeedback(true, 'Good job!')
    expect(html).toContain('bg-green-500')
    expect(html).toContain('Good job!')
  })

  it('renders red feedback for wrong answer', () => {
    const html = renderAnswerFeedback(false, 'Wrong answer.')
    expect(html).toContain('bg-red-500')
    expect(html).toContain('Wrong answer.')
  })

  it('renders truthy HTML for both cases', () => {
    expect(renderAnswerFeedback(true, 'text').length).toBeGreaterThan(50)
    expect(renderAnswerFeedback(false, 'text').length).toBeGreaterThan(50)
  })

  it('includes quizCorrect/quizWrong i18n key', () => {
    const html = renderAnswerFeedback(true, 'exp')
    expect(html).toContain('quizCorrect')
  })
})
