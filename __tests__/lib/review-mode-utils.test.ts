import { describe, it, expect } from "vitest"
import {
  convertReviewAnswersToFullFormat,
  extractIncorrectIndices,
  calculateReviewTimeLimit,
} from "@/lib/review-mode-utils"

describe("review-mode-utils.ts", () => {
  describe("convertReviewAnswersToFullFormat", () => {
    it("復習モード答え（39問）を50問フォーマットに変換", () => {
      // 復習対象は [0, 3, 5, 10, 15, 20, 25, 30, ...] など
      const reviewQuestionIndices = [0, 3, 5, 10, 15]
      const reviewAnswers = [1, 2, 0, 3, 1]

      const result = convertReviewAnswersToFullFormat(reviewAnswers, reviewQuestionIndices)

      expect(result.length).toBe(50)
      expect(result[0]).toBe(1) // インデックス0の答え
      expect(result[3]).toBe(2) // インデックス3の答え
      expect(result[5]).toBe(0) // インデックス5の答え
      expect(result[10]).toBe(3) // インデックス10の答え
      expect(result[15]).toBe(1) // インデックス15の答え
      expect(result[1]).toBe(-1) // 回答されなかった
      expect(result[2]).toBe(-1) // 回答されなかった
    })

    it("39問すべて回答の場合", () => {
      const reviewQuestionIndices = Array.from({ length: 39 }, (_, i) =>
        i < 11 ? i : i + 11 // 0-10, 22-49 を選択（11問スキップして39問）
      )
      const reviewAnswers = Array.from({ length: 39 }, (_, i) => i % 4)

      const result = convertReviewAnswersToFullFormat(reviewAnswers, reviewQuestionIndices)

      expect(result.length).toBe(50)
      expect(result.filter((v) => v === -1).length).toBe(11) // 11問は未回答
    })

    it("復習問題のインデックスが乱序の場合も正しく変換", () => {
      const reviewQuestionIndices = [49, 0, 25, 10] // 乱序
      const reviewAnswers = [3, 1, 2, 0]

      const result = convertReviewAnswersToFullFormat(reviewAnswers, reviewQuestionIndices)

      expect(result[49]).toBe(3)
      expect(result[0]).toBe(1)
      expect(result[25]).toBe(2)
      expect(result[10]).toBe(0)
    })

    it("空の復習問題の場合", () => {
      const reviewQuestionIndices: number[] = []
      const reviewAnswers: number[] = []

      const result = convertReviewAnswersToFullFormat(reviewAnswers, reviewQuestionIndices)

      expect(result.length).toBe(50)
      expect(result.every((v) => v === -1)).toBe(true)
    })
  })

  describe("extractIncorrectIndices", () => {
    it("前回のテスト結果から間違えた問題のインデックスを抽出", () => {
      const previousAnswers = Array(50)
        .fill(0)
        .map((_, i) => (i < 35 ? i % 4 : (i + 1) % 4)) // 最初の35問は正解、最後の15問は不正解
      const correctAnswers = Array(50)
        .fill(0)
        .map((_, i) => i % 4)

      const result = extractIncorrectIndices(previousAnswers, correctAnswers)

      expect(result.length).toBe(15)
      expect(result).toContain(35)
      expect(result).toContain(36)
      expect(result).toContain(49)
      expect(result).not.toContain(0)
      expect(result).not.toContain(34)
    })

    it("部分的に未回答の場合、未回答は除外", () => {
      const previousAnswers = [0, 1, -1, 0, 1, -1] // インデックス2と5は未回答
      const correctAnswers = [0, 1, 2, 0, 1, 2]

      const result = extractIncorrectIndices(previousAnswers, correctAnswers)

      expect(result.length).toBe(0) // 回答済みはすべて正解
    })

    it("回答したが不正解", () => {
      const previousAnswers = [0, 1, 1, 0, 1]
      const correctAnswers = [0, 1, 2, 3, 2]

      const result = extractIncorrectIndices(previousAnswers, correctAnswers)

      expect(result).toEqual([2, 3, 4])
    })

    it("すべて正解の場合", () => {
      const previousAnswers = [0, 1, 2, 0, 1]
      const correctAnswers = [0, 1, 2, 0, 1]

      const result = extractIncorrectIndices(previousAnswers, correctAnswers)

      expect(result).toEqual([])
    })

    it("50問中15問不正解", () => {
      const correctAnswers = Array(50)
        .fill(0)
        .map((_, i) => i % 4)
      const previousAnswers = correctAnswers.map((v, i) =>
        i < 35 ? v : (v + 1) % 4
      )

      const result = extractIncorrectIndices(previousAnswers, correctAnswers)

      expect(result.length).toBe(15)
      expect(result[0]).toBe(35)
      expect(result[14]).toBe(49)
    })
  })

  describe("calculateReviewTimeLimit", () => {
    it("15問不正解（総50問）の場合、時間制限は 30%", () => {
      const baseTimeLimit = 1800 // 30分
      const result = calculateReviewTimeLimit(15, 50, baseTimeLimit)

      // 15/50 = 0.3 = 30%
      // 30分 * 0.3 = 9分 = 540秒
      expect(result).toBe(540)
    })

    it("10問不正解（総50問）の場合", () => {
      const baseTimeLimit = 1800
      const result = calculateReviewTimeLimit(10, 50, baseTimeLimit)

      // 10/50 = 0.2 = 20%
      // 30分 * 0.2 = 6分 = 360秒
      expect(result).toBe(360)
    })

    it("25問不正解（総50問）の場合", () => {
      const baseTimeLimit = 1800
      const result = calculateReviewTimeLimit(25, 50, baseTimeLimit)

      // 25/50 = 0.5 = 50%
      // 30分 * 0.5 = 15分 = 900秒
      expect(result).toBe(900)
    })

    it("1問不正解", () => {
      const baseTimeLimit = 1800
      const result = calculateReviewTimeLimit(1, 50, baseTimeLimit)

      // 1/50 = 0.02 = 2%
      // 30分 * 0.02 = 0.6分 → 四捨五入 = 1分 = 36秒
      expect(result).toBe(36)
    })

    it("0問不正解（復習なし）", () => {
      const baseTimeLimit = 1800
      const result = calculateReviewTimeLimit(0, 50, baseTimeLimit)

      expect(result).toBe(0)
    })

    it("四捨五入の確認（33/100）", () => {
      const baseTimeLimit = 1000
      const result = calculateReviewTimeLimit(33, 100, baseTimeLimit)

      // 33/100 = 0.33 = 33%
      // 1000秒 * 0.33 = 330秒
      expect(result).toBe(330)
    })
  })

  describe("復習モード統合テスト", () => {
    it("前回35/50 → 15問を復習 → 12問正解 → マージ後47/50", () => {
      // ステップ1: 前回のテスト結果から不正解を抽出
      const previousAnswers = Array(50)
        .fill(0)
        .map((_, i) => (i < 35 ? i % 4 : (i + 1) % 4))
      const correctAnswers = Array(50)
        .fill(0)
        .map((_, i) => i % 4)

      const incorrectIndices = extractIncorrectIndices(previousAnswers, correctAnswers)
      expect(incorrectIndices.length).toBe(15)

      // ステップ2: 復習モードで回答（15問中12問正解）
      const reviewAnswers = Array(15)
        .fill(0)
        .map((_, i) => (i < 12 ? correctAnswers[incorrectIndices[i]] : (i + 1) % 4))

      // ステップ3: 復習回答を50問形式に変換
      const reviewFullAnswers = convertReviewAnswersToFullFormat(reviewAnswers, incorrectIndices)

      // ステップ4: 前回の答えと新しい答えをマージ
      const mergedAnswers = Array(50)
        .fill(0)
        .map((_, i) => (reviewFullAnswers[i] !== -1 ? reviewFullAnswers[i] : previousAnswers[i]))

      // ステップ5: 採点
      const correctCount = mergedAnswers.filter((ans, i) => ans === correctAnswers[i]).length

      expect(mergedAnswers.length).toBe(50)
      expect(correctCount).toBe(47) // 前回35 + 復習で12追加

      // 最初の35問は変わらず正解
      for (let i = 0; i < 35; i++) {
        expect(mergedAnswers[i]).toBe(correctAnswers[i])
      }
    })

    it("35/50 → 復習15問すべて正解 → マージ後50/50", () => {
      const previousAnswers = Array(50)
        .fill(0)
        .map((_, i) => (i < 35 ? i % 4 : (i + 1) % 4))
      const correctAnswers = Array(50)
        .fill(0)
        .map((_, i) => i % 4)

      const incorrectIndices = extractIncorrectIndices(previousAnswers, correctAnswers)

      // 復習モードで15問すべて正解
      const reviewAnswers = incorrectIndices.map((idx) => correctAnswers[idx])

      const reviewFullAnswers = convertReviewAnswersToFullFormat(reviewAnswers, incorrectIndices)
      const mergedAnswers = Array(50)
        .fill(0)
        .map((_, i) => (reviewFullAnswers[i] !== -1 ? reviewFullAnswers[i] : previousAnswers[i]))

      const correctCount = mergedAnswers.filter((ans, i) => ans === correctAnswers[i]).length

      expect(correctCount).toBe(50)
      expect(mergedAnswers).toEqual(correctAnswers)
    })

    it("35/50 → 復習で10問正解 → マージ後45/50", () => {
      const previousAnswers = Array(50)
        .fill(0)
        .map((_, i) => (i < 35 ? i % 4 : (i + 1) % 4))
      const correctAnswers = Array(50)
        .fill(0)
        .map((_, i) => i % 4)

      const incorrectIndices = extractIncorrectIndices(previousAnswers, correctAnswers)

      // 復習モードで15問中10問だけ正解
      const reviewAnswers = Array(15)
        .fill(0)
        .map((_, i) => (i < 10 ? correctAnswers[incorrectIndices[i]] : (i + 1) % 4))

      const reviewFullAnswers = convertReviewAnswersToFullFormat(reviewAnswers, incorrectIndices)
      const mergedAnswers = Array(50)
        .fill(0)
        .map((_, i) => (reviewFullAnswers[i] !== -1 ? reviewFullAnswers[i] : previousAnswers[i]))

      const correctCount = mergedAnswers.filter((ans, i) => ans === correctAnswers[i]).length

      expect(correctCount).toBe(45) // 35 + 10
    })
  })
})
