import { describe, it, expect } from "vitest"
import {
  evaluateReviewAnswer,
  evaluateQuickCheckAnswer,
  evaluateSimulationAnswer,
  evaluateRoleplayCompletion,
  evaluateDeepDiveCompletion,
  evaluateStoryCompletion,
  evaluateWorkSubmission,
  evaluateReflectionSubmission,
  evaluateActionSelection,
  evaluateMoodSelection,
  calculateProgress,
  isWorkComplete,
} from "@/lib/session-evaluation"

describe("session-evaluation.ts - コアロジック", () => {
  describe("evaluateReviewAnswer", () => {
    it("正解時は isCorrect=true, 10ポイント", () => {
      const result = evaluateReviewAnswer(0, 0)
      expect(result.isCorrect).toBe(true)
      expect(result.pointsToAdd).toBe(10)
    })

    it("不正解時は isCorrect=false, 0ポイント", () => {
      const result = evaluateReviewAnswer(1, 0)
      expect(result.isCorrect).toBe(false)
      expect(result.pointsToAdd).toBe(0)
    })

    it("複数選択肢の正解判定", () => {
      expect(evaluateReviewAnswer(0, 0).isCorrect).toBe(true)
      expect(evaluateReviewAnswer(1, 0).isCorrect).toBe(false)
      expect(evaluateReviewAnswer(2, 0).isCorrect).toBe(false)
      expect(evaluateReviewAnswer(3, 0).isCorrect).toBe(false)
    })

    it("correctIndex が undefined の場合は常に不正解", () => {
      const result = evaluateReviewAnswer(0, undefined)
      expect(result.isCorrect).toBe(false)
      expect(result.pointsToAdd).toBe(0)
    })

    it("高いインデックス値でも正解判定", () => {
      const result = evaluateReviewAnswer(99, 99)
      expect(result.isCorrect).toBe(true)
      expect(result.pointsToAdd).toBe(10)
    })
  })

  describe("evaluateQuickCheckAnswer", () => {
    it("正解時は isCorrect=true, 15ポイント", () => {
      const result = evaluateQuickCheckAnswer(1, 1)
      expect(result.isCorrect).toBe(true)
      expect(result.pointsToAdd).toBe(15)
    })

    it("不正解時は isCorrect=false, 0ポイント", () => {
      const result = evaluateQuickCheckAnswer(0, 1)
      expect(result.isCorrect).toBe(false)
      expect(result.pointsToAdd).toBe(0)
    })

    it("reviewAnswer より高いポイント", () => {
      const review = evaluateReviewAnswer(0, 0)
      const quick = evaluateQuickCheckAnswer(0, 0)
      expect(quick.pointsToAdd).toBeGreaterThan(review.pointsToAdd)
    })

    it("correctIndex が undefined の場合は常に不正解", () => {
      const result = evaluateQuickCheckAnswer(0, undefined)
      expect(result.isCorrect).toBe(false)
      expect(result.pointsToAdd).toBe(0)
    })
  })

  describe("evaluateSimulationAnswer", () => {
    it("正解で points 指定時は指定値を返す", () => {
      const options = [
        { text: "A", points: 25, isCorrect: true },
        { text: "B", points: 5, isCorrect: false },
      ]
      const result = evaluateSimulationAnswer(0, options)
      expect(result.isCorrect).toBe(true)
      expect(result.pointsToAdd).toBe(25)
    })

    it("正解で points 未指定時は 15ポイント", () => {
      const options = [
        { text: "A", isCorrect: true },
        { text: "B", isCorrect: false },
      ]
      const result = evaluateSimulationAnswer(0, options)
      expect(result.isCorrect).toBe(true)
      expect(result.pointsToAdd).toBe(15)
    })

    it("不正解時は常に 0ポイント（points指定値は無視）", () => {
      const options = [
        { text: "A", points: 100, isCorrect: false },
      ]
      const result = evaluateSimulationAnswer(0, options)
      expect(result.isCorrect).toBe(false)
      expect(result.pointsToAdd).toBe(0)
    })

    it("インデックスが範囲外の場合は不正解", () => {
      const options = [
        { text: "A", isCorrect: true },
      ]
      const result = evaluateSimulationAnswer(99, options)
      expect(result.isCorrect).toBe(false)
      expect(result.pointsToAdd).toBe(0)
    })

    it("複数オプションの異なるポイント値", () => {
      const options = [
        { text: "A", points: 10, isCorrect: true },
        { text: "B", points: 20, isCorrect: true },
        { text: "C", points: 5, isCorrect: true },
      ]
      expect(evaluateSimulationAnswer(0, options).pointsToAdd).toBe(10)
      expect(evaluateSimulationAnswer(1, options).pointsToAdd).toBe(20)
      expect(evaluateSimulationAnswer(2, options).pointsToAdd).toBe(5)
    })

    it("不正解時は負のポイント値でも 0 を返す", () => {
      const options = [
        { text: "A", points: -5, isCorrect: false },
      ]
      const result = evaluateSimulationAnswer(0, options)
      expect(result.pointsToAdd).toBe(0)
    })

    it("0ポイント指定の場合", () => {
      const options = [
        { text: "A", points: 0, isCorrect: true },
      ]
      const result = evaluateSimulationAnswer(0, options)
      expect(result.pointsToAdd).toBe(0)
    })
  })

  describe("evaluateRoleplayCompletion", () => {
    it("初回完了時は 20ポイント", () => {
      const result = evaluateRoleplayCompletion(false)
      expect(result.pointsToAdd).toBe(20)
    })

    it("既に完了済みの場合は 0ポイント", () => {
      const result = evaluateRoleplayCompletion(true)
      expect(result.pointsToAdd).toBe(0)
    })

    it("重複完了を防止（一度だけポイント付与）", () => {
      const first = evaluateRoleplayCompletion(false)
      const second = evaluateRoleplayCompletion(true)
      expect(first.pointsToAdd).toBe(20)
      expect(second.pointsToAdd).toBe(0)
    })
  })

  describe("evaluateDeepDiveCompletion", () => {
    it("初回読了時は 30ポイント", () => {
      const result = evaluateDeepDiveCompletion(false)
      expect(result.pointsToAdd).toBe(30)
    })

    it("既に読了済みの場合は 0ポイント", () => {
      const result = evaluateDeepDiveCompletion(true)
      expect(result.pointsToAdd).toBe(0)
    })

    it("roleplay より高いポイント", () => {
      const roleplay = evaluateRoleplayCompletion(false)
      const deepdive = evaluateDeepDiveCompletion(false)
      expect(deepdive.pointsToAdd).toBeGreaterThan(roleplay.pointsToAdd)
    })

    it("重複読了を防止", () => {
      const first = evaluateDeepDiveCompletion(false)
      const second = evaluateDeepDiveCompletion(true)
      expect(first.pointsToAdd).toBe(30)
      expect(second.pointsToAdd).toBe(0)
    })
  })

  describe("evaluateStoryCompletion", () => {
    it("ストーリー完了時は 20ポイント", () => {
      const result = evaluateStoryCompletion()
      expect(result.pointsToAdd).toBe(20)
    })

    it("毎回同じポイント", () => {
      const result1 = evaluateStoryCompletion()
      const result2 = evaluateStoryCompletion()
      expect(result1.pointsToAdd).toBe(result2.pointsToAdd)
    })
  })

  describe("evaluateWorkSubmission", () => {
    it("1つ以上フィールド入力時は完了で 50ポイント", () => {
      const workFields = { 0: "answer" }
      const result = evaluateWorkSubmission(workFields)
      expect(result.isComplete).toBe(true)
      expect(result.pointsToAdd).toBe(50)
    })

    it("複数フィールド入力時も 50ポイント", () => {
      const workFields = { 0: "answer1", 1: "answer2", 2: "answer3" }
      const result = evaluateWorkSubmission(workFields)
      expect(result.isComplete).toBe(true)
      expect(result.pointsToAdd).toBe(50)
    })

    it("全フィールド空の場合は未完了で 0ポイント", () => {
      const workFields = {}
      const result = evaluateWorkSubmission(workFields)
      expect(result.isComplete).toBe(false)
      expect(result.pointsToAdd).toBe(0)
    })

    it("空白のみの場合は未完了", () => {
      const workFields = { 0: "   ", 1: "\t\n" }
      const result = evaluateWorkSubmission(workFields)
      expect(result.isComplete).toBe(false)
      expect(result.pointsToAdd).toBe(0)
    })

    it("混在時は入力ありなら完了", () => {
      const workFields = { 0: "   ", 1: "answer", 2: "" }
      const result = evaluateWorkSubmission(workFields)
      expect(result.isComplete).toBe(true)
      expect(result.pointsToAdd).toBe(50)
    })

    it("最大ポイント操作", () => {
      const workFields = { 0: "a" }
      const result = evaluateWorkSubmission(workFields)
      expect(result.pointsToAdd).toBe(50)
    })
  })

  describe("evaluateReflectionSubmission", () => {
    it("テキスト入力時は提出可で 10ポイント", () => {
      const result = evaluateReflectionSubmission("reflection text")
      expect(result.canSubmit).toBe(true)
      expect(result.pointsToAdd).toBe(10)
    })

    it("空文字列時は提出不可で 0ポイント", () => {
      const result = evaluateReflectionSubmission("")
      expect(result.canSubmit).toBe(false)
      expect(result.pointsToAdd).toBe(0)
    })

    it("空白のみの場合は提出不可", () => {
      const result = evaluateReflectionSubmission("   \t\n  ")
      expect(result.canSubmit).toBe(false)
      expect(result.pointsToAdd).toBe(0)
    })

    it("単一文字でも提出可", () => {
      const result = evaluateReflectionSubmission("a")
      expect(result.canSubmit).toBe(true)
      expect(result.pointsToAdd).toBe(10)
    })

    it("長いテキストでも 10ポイント", () => {
      const longText = "a".repeat(1000)
      const result = evaluateReflectionSubmission(longText)
      expect(result.pointsToAdd).toBe(10)
    })

    it("改行を含むテキスト", () => {
      const result = evaluateReflectionSubmission("line1\nline2\nline3")
      expect(result.canSubmit).toBe(true)
      expect(result.pointsToAdd).toBe(10)
    })
  })

  describe("evaluateActionSelection", () => {
    it("アクション選択時は 20ポイント", () => {
      const result = evaluateActionSelection()
      expect(result.pointsToAdd).toBe(20)
    })

    it("毎回同じポイント", () => {
      const result1 = evaluateActionSelection()
      const result2 = evaluateActionSelection()
      expect(result1.pointsToAdd).toBe(result2.pointsToAdd)
    })
  })

  describe("evaluateMoodSelection", () => {
    it("気分選択時は 10ポイント", () => {
      const result = evaluateMoodSelection()
      expect(result.pointsToAdd).toBe(10)
    })

    it("毎回同じポイント", () => {
      const result1 = evaluateMoodSelection()
      const result2 = evaluateMoodSelection()
      expect(result1.pointsToAdd).toBe(result2.pointsToAdd)
    })
  })

  describe("calculateProgress", () => {
    it("最初のフェーズは約 16.67%", () => {
      const progress = calculateProgress(0, 6)
      expect(progress).toBeCloseTo(16.67, 1)
    })

    it("半分進むと約 50%", () => {
      const progress = calculateProgress(4, 10)
      expect(progress).toBeCloseTo(50, 0)
    })

    it("最後のフェーズは 100%", () => {
      const progress = calculateProgress(9, 10)
      expect(progress).toBe(100)
    })

    it("フェーズ数 0 では 0%", () => {
      const progress = calculateProgress(0, 0)
      expect(progress).toBe(0)
    })

    it("3ステップ進度", () => {
      expect(calculateProgress(0, 3)).toBeCloseTo(33.33, 1)
      expect(calculateProgress(1, 3)).toBeCloseTo(66.67, 1)
      expect(calculateProgress(2, 3)).toBe(100)
    })

    it("大量フェーズでも計算可能", () => {
      const progress = calculateProgress(50, 100)
      expect(progress).toBe(51)
    })
  })

  describe("isWorkComplete", () => {
    it("フィールドに値がある場合は true", () => {
      const workFields = { 0: "answer" }
      expect(isWorkComplete(workFields)).toBe(true)
    })

    it("複数フィールドに値がある場合も true", () => {
      const workFields = { 0: "a", 1: "b", 2: "c" }
      expect(isWorkComplete(workFields)).toBe(true)
    })

    it("全フィールド空の場合は false", () => {
      const workFields = {}
      expect(isWorkComplete(workFields)).toBe(false)
    })

    it("undefined の場合は false", () => {
      expect(isWorkComplete(undefined)).toBe(false)
    })

    it("空白のみの場合は false", () => {
      const workFields = { 0: "   ", 1: "\t" }
      expect(isWorkComplete(workFields)).toBe(false)
    })

    it("1つでも値があれば true", () => {
      const workFields = { 0: "   ", 1: "answer", 2: "" }
      expect(isWorkComplete(workFields)).toBe(true)
    })

    it("最初のフィールドのみ", () => {
      const workFields = { 0: "value" }
      expect(isWorkComplete(workFields)).toBe(true)
    })

    it("最後のフィールドのみ", () => {
      const workFields = { 99: "value" }
      expect(isWorkComplete(workFields)).toBe(true)
    })
  })

  describe("ポイント統計", () => {
    it("全段階で最大ポイント計算", () => {
      let totalPoints = 0

      // Mood
      totalPoints += evaluateMoodSelection().pointsToAdd // 10

      // Review
      totalPoints += evaluateReviewAnswer(0, 0).pointsToAdd // 10

      // Quick checks (3回)
      totalPoints += evaluateQuickCheckAnswer(0, 0).pointsToAdd // 15
      totalPoints += evaluateQuickCheckAnswer(0, 0).pointsToAdd // 15
      totalPoints += evaluateQuickCheckAnswer(0, 0).pointsToAdd // 15

      // Story
      totalPoints += evaluateStoryCompletion().pointsToAdd // 20

      // Simulation (2回)
      totalPoints += evaluateSimulationAnswer(0, [
        { text: "A", points: 15, isCorrect: true },
      ]).pointsToAdd // 15
      totalPoints += evaluateSimulationAnswer(0, [
        { text: "A", points: 15, isCorrect: true },
      ]).pointsToAdd // 15

      // Roleplay
      totalPoints += evaluateRoleplayCompletion(false).pointsToAdd // 20

      // Work
      totalPoints += evaluateWorkSubmission({ 0: "answer" }).pointsToAdd // 50

      // Reflection
      totalPoints += evaluateReflectionSubmission("text").pointsToAdd // 10

      // Action
      totalPoints += evaluateActionSelection().pointsToAdd // 20

      // Deep Dive
      totalPoints += evaluateDeepDiveCompletion(false).pointsToAdd // 30

      // 合計: 10+10+15+15+15+20+15+15+20+50+10+20+30 = 245
      expect(totalPoints).toBe(245)
    })

    it("最小ポイントは 0", () => {
      const totalPoints =
        evaluateReviewAnswer(1, 0).pointsToAdd +
        evaluateQuickCheckAnswer(1, 0).pointsToAdd +
        evaluateSimulationAnswer(1, [
          { text: "A", isCorrect: false },
        ]).pointsToAdd +
        evaluateWorkSubmission({}).pointsToAdd +
        evaluateReflectionSubmission("").pointsToAdd +
        evaluateRoleplayCompletion(true).pointsToAdd +
        evaluateDeepDiveCompletion(true).pointsToAdd

      expect(totalPoints).toBe(0)
    })
  })

  describe("エッジケース", () => {
    it("NaN や無限大への対応", () => {
      const result1 = calculateProgress(0, Number.POSITIVE_INFINITY)
      expect(result1).toBe(0)

      const result2 = calculateProgress(Number.MAX_SAFE_INTEGER, 1)
      expect(result2).toBeGreaterThan(0)
    })

    it("非常に大きいフィールドインデックス", () => {
      const workFields = { [Number.MAX_SAFE_INTEGER]: "answer" }
      expect(isWorkComplete(workFields)).toBe(true)
    })

    it("特殊文字を含むテキスト", () => {
      const result = evaluateReflectionSubmission(
        "特殊文字: 🎉 @#$%^&*()"
      )
      expect(result.canSubmit).toBe(true)
      expect(result.pointsToAdd).toBe(10)
    })
  })
})
