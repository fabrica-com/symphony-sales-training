import { describe, it, expect } from "vitest"
import {
  gradeAnswers,
  categoryTestScore,
  secondsToMinutes,
  formatDateJP,
} from "@/lib/grading"

// ---- gradeAnswers ----

describe("gradeAnswers", () => {
  const base = {
    totalQuestions: 10,
    passingScore: 80,
  }

  it("全問正解 → 100%, passed", () => {
    const result = gradeAnswers({
      ...base,
      answers: [0, 1, 2, 3, 0, 1, 2, 3, 0, 1],
      correctAnswers: [0, 1, 2, 3, 0, 1, 2, 3, 0, 1],
    })
    expect(result.correctCount).toBe(10)
    expect(result.incorrectCount).toBe(0)
    expect(result.percentage).toBe(100)
    expect(result.passed).toBe(true)
  })

  it("全問不正解 → 0%, failed", () => {
    const result = gradeAnswers({
      ...base,
      answers: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
      correctAnswers: [0, 1, 2, 3, 0, 1, 2, 3, 0, 1],
    })
    expect(result.correctCount).toBe(0)
    expect(result.incorrectCount).toBe(10)
    expect(result.percentage).toBe(0)
    expect(result.passed).toBe(false)
  })

  it("ちょうどボーダー（80%） → passed", () => {
    const result = gradeAnswers({
      ...base,
      answers: [0, 1, 2, 3, 0, 1, 2, 3, 9, 9],
      correctAnswers: [0, 1, 2, 3, 0, 1, 2, 3, 0, 1],
    })
    expect(result.correctCount).toBe(8)
    expect(result.percentage).toBe(80)
    expect(result.passed).toBe(true)
  })

  it("ボーダー未満（70%） → failed", () => {
    const result = gradeAnswers({
      ...base,
      answers: [0, 1, 2, 3, 0, 1, 2, 9, 9, 9],
      correctAnswers: [0, 1, 2, 3, 0, 1, 2, 3, 0, 1],
    })
    expect(result.correctCount).toBe(7)
    expect(result.percentage).toBe(70)
    expect(result.passed).toBe(false)
  })

  it("回答配列が足りない場合 → 未回答分は不正解扱い", () => {
    const result = gradeAnswers({
      ...base,
      answers: [0, 1, 2],
      correctAnswers: [0, 1, 2, 3, 0, 1, 2, 3, 0, 1],
    })
    expect(result.correctCount).toBe(3)
    expect(result.percentage).toBe(30)
  })

  it("totalQuestions が 0 → percentage は 0, passed は passingScore=0 のとき true", () => {
    const result = gradeAnswers({
      answers: [],
      correctAnswers: [],
      totalQuestions: 0,
      passingScore: 0,
    })
    expect(result.percentage).toBe(0)
    expect(result.passed).toBe(true)
  })

  it("50問テスト（カテゴリBの実際のケース）", () => {
    const correct = Array.from({ length: 50 }, (_, i) => i % 4)
    const answers = correct.map((c, i) => (i < 40 ? c : c + 1))
    const result = gradeAnswers({
      answers,
      correctAnswers: correct,
      totalQuestions: 50,
      passingScore: 80,
    })
    expect(result.correctCount).toBe(40)
    expect(result.percentage).toBe(80)
    expect(result.passed).toBe(true)
  })

  it("端数の四捨五入: 1/3 → 33%", () => {
    const result = gradeAnswers({
      answers: [0, 9, 9],
      correctAnswers: [0, 1, 2],
      totalQuestions: 3,
      passingScore: 50,
    })
    expect(result.correctCount).toBe(1)
    expect(result.percentage).toBe(33)
    expect(result.passed).toBe(false)
  })

  it("端数の四捨五入: 2/3 → 67%", () => {
    const result = gradeAnswers({
      answers: [0, 1, 9],
      correctAnswers: [0, 1, 2],
      totalQuestions: 3,
      passingScore: 50,
    })
    expect(result.correctCount).toBe(2)
    expect(result.percentage).toBe(67)
    expect(result.passed).toBe(true)
  })
})

// ---- categoryTestScore ----

describe("categoryTestScore", () => {
  it("0問正解 → 0点", () => {
    expect(categoryTestScore(0)).toBe(0)
  })

  it("25問正解 → 50点", () => {
    expect(categoryTestScore(25)).toBe(50)
  })

  it("50問正解 → 100点", () => {
    expect(categoryTestScore(50)).toBe(100)
  })
})

// ---- secondsToMinutes ----

describe("secondsToMinutes", () => {
  it("0秒 → 0分", () => {
    expect(secondsToMinutes(0)).toBe(0)
  })

  it("60秒 → 1分", () => {
    expect(secondsToMinutes(60)).toBe(1)
  })

  it("90秒 → 2分（四捨五入）", () => {
    expect(secondsToMinutes(90)).toBe(2)
  })

  it("29秒 → 0分（四捨五入）", () => {
    expect(secondsToMinutes(29)).toBe(0)
  })

  it("30秒 → 1分（四捨五入）", () => {
    expect(secondsToMinutes(30)).toBe(1)
  })

  it("3661秒 → 61分", () => {
    expect(secondsToMinutes(3661)).toBe(61)
  })
})

// ---- formatDateJP ----

describe("formatDateJP", () => {
  it("null → undefined", () => {
    expect(formatDateJP(null)).toBeUndefined()
  })

  it("undefined → undefined", () => {
    expect(formatDateJP(undefined)).toBeUndefined()
  })

  it("空文字 → undefined", () => {
    expect(formatDateJP("")).toBeUndefined()
  })

  it("有効な ISO 文字列 → 日本語ロケール日付", () => {
    const result = formatDateJP("2026-03-30T06:00:00Z")
    expect(result).toBeDefined()
    expect(result).toMatch(/2026/)
  })
})
