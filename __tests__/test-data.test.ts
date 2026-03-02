import { describe, it, expect } from 'vitest'
import { calculateTestScore, type CategoryTest } from '@/lib/test-data'

// テスト用のダミーテストデータ
function createMockTest(overrides?: Partial<CategoryTest>): CategoryTest {
  return {
    categoryId: 'A',
    categoryName: 'テストカテゴリ',
    totalQuestions: 5,
    passingScore: 60,
    timeLimit: 30,
    questions: [
      { id: 1, question: 'Q1', options: ['a', 'b', 'c'], correctAnswer: 0, explanation: '', source: '' },
      { id: 2, question: 'Q2', options: ['a', 'b', 'c'], correctAnswer: 1, explanation: '', source: '' },
      { id: 3, question: 'Q3', options: ['a', 'b', 'c'], correctAnswer: 2, explanation: '', source: '' },
      { id: 4, question: 'Q4', options: ['a', 'b', 'c'], correctAnswer: 0, explanation: '', source: '' },
      { id: 5, question: 'Q5', options: ['a', 'b', 'c'], correctAnswer: 1, explanation: '', source: '' },
    ],
    ...overrides,
  }
}

describe('calculateTestScore', () => {
  it('全問正解の場合', () => {
    const test = createMockTest()
    const answers = [0, 1, 2, 0, 1]
    const result = calculateTestScore(answers, test)

    expect(result.correctCount).toBe(5)
    expect(result.incorrectCount).toBe(0)
    expect(result.percentage).toBe(100)
    expect(result.passed).toBe(true)
    expect(result.score).toBe(10) // 5問 × 2pt
  })

  it('全問不正解の場合', () => {
    const test = createMockTest()
    const answers = [2, 2, 0, 1, 0]
    const result = calculateTestScore(answers, test)

    expect(result.correctCount).toBe(0)
    expect(result.incorrectCount).toBe(5)
    expect(result.percentage).toBe(0)
    expect(result.passed).toBe(false)
    expect(result.score).toBe(0)
  })

  it('合格ライン丁度（60%）の場合 — 5問中3問正解', () => {
    const test = createMockTest()
    const answers = [0, 1, 2, 1, 0] // Q1,Q2,Q3 正解、Q4,Q5 不正解
    const result = calculateTestScore(answers, test)

    expect(result.correctCount).toBe(3)
    expect(result.incorrectCount).toBe(2)
    expect(result.percentage).toBe(60)
    expect(result.passed).toBe(true)
    expect(result.score).toBe(6)
  })

  it('合格ライン未満（40%）の場合 — 5問中2問正解', () => {
    const test = createMockTest()
    const answers = [0, 1, 0, 1, 0] // Q1,Q2 正解、Q3,Q4,Q5 不正解
    const result = calculateTestScore(answers, test)

    expect(result.correctCount).toBe(2)
    expect(result.incorrectCount).toBe(3)
    expect(result.percentage).toBe(40)
    expect(result.passed).toBe(false)
    expect(result.score).toBe(4)
  })

  it('未回答（-1）は不正解として扱われる', () => {
    const test = createMockTest()
    const answers = [-1, -1, -1, -1, -1]
    const result = calculateTestScore(answers, test)

    expect(result.correctCount).toBe(0)
    expect(result.incorrectCount).toBe(5)
    expect(result.percentage).toBe(0)
    expect(result.passed).toBe(false)
  })

  it('一部未回答の場合', () => {
    const test = createMockTest()
    const answers = [0, -1, 2, -1, 1] // Q1,Q3,Q5 正解、Q2,Q4 未回答
    const result = calculateTestScore(answers, test)

    expect(result.correctCount).toBe(3)
    expect(result.incorrectCount).toBe(2)
  })

  it('score は correctCount × 2 で計算される', () => {
    const test = createMockTest()
    for (let correct = 0; correct <= 5; correct++) {
      // correct 問正解する回答配列を作る
      const answers = test.questions.map((q, i) =>
        i < correct ? q.correctAnswer : (q.correctAnswer + 1) % 3
      )
      const result = calculateTestScore(answers, test)
      expect(result.score).toBe(correct * 2)
    }
  })

  it('passingScore が異なるテストで正しく判定される', () => {
    const test80 = createMockTest({ passingScore: 80 })
    // 3/5 = 60% → 80% 基準では不合格
    const answers = [0, 1, 2, 1, 0]
    const result = calculateTestScore(answers, test80)

    expect(result.percentage).toBe(60)
    expect(result.passed).toBe(false)

    // 4/5 = 80% → 80% 基準で合格
    const answers2 = [0, 1, 2, 0, 0] // Q1,Q2,Q3,Q4 正解
    const result2 = calculateTestScore(answers2, test80)

    expect(result2.percentage).toBe(80)
    expect(result2.passed).toBe(true)
  })

  it('percentage は四捨五入される', () => {
    // 3問のテストで 1問正解 = 33.33...% → 33%
    const test3 = createMockTest({
      totalQuestions: 3,
      questions: [
        { id: 1, question: 'Q1', options: ['a', 'b'], correctAnswer: 0, explanation: '', source: '' },
        { id: 2, question: 'Q2', options: ['a', 'b'], correctAnswer: 0, explanation: '', source: '' },
        { id: 3, question: 'Q3', options: ['a', 'b'], correctAnswer: 0, explanation: '', source: '' },
      ],
    })
    const result = calculateTestScore([0, 1, 1], test3)
    expect(result.percentage).toBe(33) // Math.round(33.33) = 33
  })
})
