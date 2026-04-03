import { describe, it, expect } from "vitest"
import {
  gradeAnswers,
  categoryTestScore,
  secondsToMinutes,
  formatDateJP,
} from "@/lib/grading"

describe("grading.ts", () => {
  describe("gradeAnswers", () => {
    it("完全正解の場合", () => {
      const result = gradeAnswers({
        answers: [0, 1, 2, 0, 1],
        correctAnswers: [0, 1, 2, 0, 1],
        totalQuestions: 5,
        passingScore: 70,
      })

      expect(result.correctCount).toBe(5)
      expect(result.incorrectCount).toBe(0)
      expect(result.percentage).toBe(100)
      expect(result.passed).toBe(true)
    })

    it("部分正解の場合（70%）", () => {
      const result = gradeAnswers({
        answers: [0, 1, 1, 0, 1],
        correctAnswers: [0, 1, 2, 0, 1],
        totalQuestions: 5,
        passingScore: 70,
      })

      expect(result.correctCount).toBe(4)
      expect(result.incorrectCount).toBe(1)
      expect(result.percentage).toBe(80)
      expect(result.passed).toBe(true)
    })

    it("合格ラインちょうど（70%）", () => {
      const result = gradeAnswers({
        answers: [0, 1, 2, 0, 1, 2, 0, 1, 2, 0],
        correctAnswers: [0, 1, 2, 0, 1, 2, 0, 1, 2, 0],
        totalQuestions: 10,
        passingScore: 70,
      })

      expect(result.correctCount).toBe(10)
      expect(result.percentage).toBe(100)
      expect(result.passed).toBe(true)
    })

    it("不合格の場合（50%）", () => {
      const result = gradeAnswers({
        answers: [0, 1, 1, 0, 1],
        correctAnswers: [0, 1, 2, 3, 2],
        totalQuestions: 5,
        passingScore: 70,
      })

      expect(result.correctCount).toBe(2) // 0, 1 が正解
      expect(result.incorrectCount).toBe(3)
      expect(result.percentage).toBe(40)
      expect(result.passed).toBe(false)
    })

    it("全問不正解", () => {
      const result = gradeAnswers({
        answers: [1, 2, 3, 1, 2],
        correctAnswers: [0, 1, 2, 0, 1],
        totalQuestions: 5,
        passingScore: 70,
      })

      expect(result.correctCount).toBe(0)
      expect(result.incorrectCount).toBe(5)
      expect(result.percentage).toBe(0)
      expect(result.passed).toBe(false)
    })

    it("回答より正解が多い場合（配列長不一致）", () => {
      const result = gradeAnswers({
        answers: [0, 1],
        correctAnswers: [0, 1, 2, 0, 1],
        totalQuestions: 5,
        passingScore: 70,
      })

      expect(result.correctCount).toBe(2)
      expect(result.percentage).toBe(40)
      expect(result.passed).toBe(false)
    })

    it("totalQuestions=0の場合", () => {
      const result = gradeAnswers({
        answers: [],
        correctAnswers: [],
        totalQuestions: 0,
        passingScore: 70,
      })

      expect(result.correctCount).toBe(0)
      expect(result.percentage).toBe(0)
      expect(result.passed).toBe(false)
    })

    it("四捨五入のテスト（66.67% → 67%）", () => {
      const result = gradeAnswers({
        answers: [0, 1, 2],
        correctAnswers: [0, 1, 2],
        totalQuestions: 3,
        passingScore: 70,
      })
      // 3/3 = 100%, 四捨五入なし

      const result2 = gradeAnswers({
        answers: [0, 1, 1],
        correctAnswers: [0, 1, 2],
        totalQuestions: 3,
        passingScore: 70,
      })
      // 2/3 = 66.666... → 67%
      expect(result2.percentage).toBe(67)
      expect(result2.passed).toBe(false)
    })

    it("50問中35問正解（実際のテストシナリオ）", () => {
      const correctAnswers = Array.from({ length: 50 }, (_, i) => i % 4)
      const answers = correctAnswers.map((v, i) => (i < 35 ? v : (v + 1) % 4))

      const result = gradeAnswers({
        answers,
        correctAnswers,
        totalQuestions: 50,
        passingScore: 60,
      })

      expect(result.correctCount).toBe(35)
      expect(result.incorrectCount).toBe(15)
      expect(result.percentage).toBe(70)
      expect(result.passed).toBe(true)
    })
  })

  describe("categoryTestScore", () => {
    it("正解0問 → スコア0", () => {
      expect(categoryTestScore(0)).toBe(0)
    })

    it("正解1問 → スコア2", () => {
      expect(categoryTestScore(1)).toBe(2)
    })

    it("正解25問 → スコア50", () => {
      expect(categoryTestScore(25)).toBe(50)
    })

    it("正解50問（満点）→ スコア100", () => {
      expect(categoryTestScore(50)).toBe(100)
    })
  })

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

    it("120秒 → 2分", () => {
      expect(secondsToMinutes(120)).toBe(2)
    })

    it("150秒 → 3分（四捨五入）", () => {
      expect(secondsToMinutes(150)).toBe(3) // 150/60 = 2.5 → 3（四捨五入）
    })

    it("600秒 → 10分", () => {
      expect(secondsToMinutes(600)).toBe(10)
    })

    it("1800秒（30分）→ 30分", () => {
      expect(secondsToMinutes(1800)).toBe(30)
    })
  })

  describe("formatDateJP", () => {
    it("ISO文字列をJP形式に変換", () => {
      const result = formatDateJP("2026-04-02T10:30:00Z")
      expect(result).toBe("2026/4/2")
    })

    it("nullの場合はundefinedを返す", () => {
      expect(formatDateJP(null)).toBeUndefined()
    })

    it("undefinedの場合はundefinedを返す", () => {
      expect(formatDateJP(undefined)).toBeUndefined()
    })

    it("空文字列の場合はundefinedを返す", () => {
      expect(formatDateJP("")).toBeUndefined()
    })

    it("様々な日付フォーマットのテスト", () => {
      // 月が1桁の場合
      expect(formatDateJP("2026-01-05T00:00:00Z")).toBe("2026/1/5")
      // 月が2桁、日が2桁
      expect(formatDateJP("2026-12-25T00:00:00Z")).toBe("2026/12/25")
      // 昭和の日付
      expect(formatDateJP("2000-01-01T00:00:00Z")).toBe("2000/1/1")
    })
  })
})
