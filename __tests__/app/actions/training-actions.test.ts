import { describe, it, expect, vi, beforeEach } from "vitest"
import { submitAndGradeTestAction } from "@/app/actions/training-actions"

// モック設定
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}))

vi.mock("@/lib/auth-server", () => ({
  getCurrentUserId: vi.fn(),
}))

vi.mock("@/lib/notify-chatwork", () => ({
  notifyChatworkTaskCompleted: vi.fn().mockResolvedValue(undefined),
}))

import { createClient } from "@/lib/supabase/server"
import { getCurrentUserId } from "@/lib/auth-server"

describe("training-actions.ts", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("submitAndGradeTestAction", () => {
    it("50問全問正解の場合", async () => {
      const correctAnswers = Array(50)
        .fill(0)
        .map((_, i) => i % 4)
      const answers = [...correctAnswers]

      const mockSupabase = {
        from: vi.fn((table) => {
          if (table === "category_tests") {
            return {
              select: vi.fn().mockReturnThis(),
              eq: vi.fn().mockReturnThis(),
              single: vi.fn().mockResolvedValue({
                data: {
                  id: 1,
                  category_name: "テスト1",
                  passing_score: 60,
                  total_questions: 50,
                },
                error: null,
              }),
            }
          }
          if (table === "category_test_questions") {
            return {
              select: vi.fn().mockReturnThis(),
              eq: vi.fn().mockReturnThis(),
              order: vi.fn().mockResolvedValue({
                data: Array(50)
                  .fill(null)
                  .map((_, i) => ({
                    question_number: i + 1,
                    correct_answer: i % 4,
                    question: `問題${i + 1}`,
                    options: ["A", "B", "C", "D"],
                    explanation: `解説${i + 1}`,
                    source: "テキスト",
                  })),
                error: null,
              }),
            }
          }
          if (table === "category_test_results") {
            return {
              select: vi.fn().mockReturnThis(),
              eq: vi.fn().mockReturnThis(),
              insert: vi.fn().mockResolvedValue({
                data: null,
                error: null,
              }),
            }
          }
        }),
      }
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)
      vi.mocked(getCurrentUserId).mockResolvedValue(null) // 未認証

      const result = await submitAndGradeTestAction({
        categoryId: "cat-001",
        duration: 1800,
        answers,
      })

      expect(result.success).toBe(true)
      expect(result.correctCount).toBe(50)
      expect(result.percentage).toBe(100)
      expect(result.passed).toBe(true)
      expect(result.score).toBe(100) // 50 * 2
    })

    it("50問中35問正解（70%、合格）", async () => {
      const correctAnswers = Array(50)
        .fill(0)
        .map((_, i) => i % 4)
      const answers = correctAnswers.map((v, i) =>
        i < 35 ? v : (v + 1) % 4
      )

      const mockSupabase = {
        from: vi.fn((table) => {
          if (table === "category_tests") {
            return {
              select: vi.fn().mockReturnThis(),
              eq: vi.fn().mockReturnThis(),
              single: vi.fn().mockResolvedValue({
                data: {
                  id: 1,
                  category_name: "テスト1",
                  passing_score: 60,
                  total_questions: 50,
                },
                error: null,
              }),
            }
          }
          if (table === "category_test_questions") {
            return {
              select: vi.fn().mockReturnThis(),
              eq: vi.fn().mockReturnThis(),
              order: vi.fn().mockResolvedValue({
                data: Array(50)
                  .fill(null)
                  .map((_, i) => ({
                    question_number: i + 1,
                    correct_answer: i % 4,
                    question: `問題${i + 1}`,
                    options: ["A", "B", "C", "D"],
                    explanation: `解説${i + 1}`,
                    source: "テキスト",
                  })),
                error: null,
              }),
            }
          }
          if (table === "category_test_results") {
            return {
              select: vi.fn().mockReturnThis(),
              eq: vi.fn().mockReturnThis(),
              insert: vi.fn().mockResolvedValue({
                data: null,
                error: null,
              }),
            }
          }
        }),
      }
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)
      vi.mocked(getCurrentUserId).mockResolvedValue(null)

      const result = await submitAndGradeTestAction({
        categoryId: "cat-001",
        duration: 1800,
        answers,
      })

      expect(result.success).toBe(true)
      expect(result.correctCount).toBe(35)
      expect(result.incorrectCount).toBe(15)
      expect(result.percentage).toBe(70)
      expect(result.passed).toBe(true)
      expect(result.score).toBe(70) // 35 * 2
      expect(result.questionResults[0].isCorrect).toBe(true)
      expect(result.questionResults[35].isCorrect).toBe(false)
    })

    it("50問中23問正解（46%、不合格）", async () => {
      const correctAnswers = Array(50)
        .fill(0)
        .map((_, i) => i % 4)
      const answers = correctAnswers.map((v, i) =>
        i < 23 ? v : (v + 1) % 4
      )

      const mockSupabase = {
        from: vi.fn((table) => {
          if (table === "category_tests") {
            return {
              select: vi.fn().mockReturnThis(),
              eq: vi.fn().mockReturnThis(),
              single: vi.fn().mockResolvedValue({
                data: {
                  id: 1,
                  category_name: "テスト1",
                  passing_score: 60,
                  total_questions: 50,
                },
                error: null,
              }),
            }
          }
          if (table === "category_test_questions") {
            return {
              select: vi.fn().mockReturnThis(),
              eq: vi.fn().mockReturnThis(),
              order: vi.fn().mockResolvedValue({
                data: Array(50)
                  .fill(null)
                  .map((_, i) => ({
                    question_number: i + 1,
                    correct_answer: i % 4,
                    question: `問題${i + 1}`,
                    options: ["A", "B", "C", "D"],
                    explanation: `解説${i + 1}`,
                    source: "テキスト",
                  })),
                error: null,
              }),
            }
          }
          if (table === "category_test_results") {
            return {
              select: vi.fn().mockReturnThis(),
              eq: vi.fn().mockReturnThis(),
              insert: vi.fn().mockResolvedValue({
                data: null,
                error: null,
              }),
            }
          }
        }),
      }
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)
      vi.mocked(getCurrentUserId).mockResolvedValue(null)

      const result = await submitAndGradeTestAction({
        categoryId: "cat-001",
        duration: 1800,
        answers,
      })

      expect(result.success).toBe(true)
      expect(result.correctCount).toBe(23)
      expect(result.percentage).toBe(46)
      expect(result.passed).toBe(false)
      expect(result.score).toBe(46) // 23 * 2
    })

    it("テスト設定が見つからない場合はエラーを返す", async () => {
      const mockSupabase = {
        from: vi.fn((table) => {
          if (table === "category_tests") {
            return {
              select: vi.fn().mockReturnThis(),
              eq: vi.fn().mockReturnThis(),
              single: vi.fn().mockResolvedValue({
                data: null,
                error: { message: "Not found" },
              }),
            }
          }
        }),
      }
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await submitAndGradeTestAction({
        categoryId: "cat-999",
        duration: 1800,
        answers: [0, 1, 2],
      })

      expect(result.success).toBe(false)
      expect(result.error).toBe("Test config not found")
    })

    it("問題が見つからない場合はエラーを返す", async () => {
      const mockSupabase = {
        from: vi.fn((table) => {
          if (table === "category_tests") {
            return {
              select: vi.fn().mockReturnThis(),
              eq: vi.fn().mockReturnThis(),
              single: vi.fn().mockResolvedValue({
                data: {
                  id: 1,
                  category_name: "テスト1",
                  passing_score: 60,
                  total_questions: 50,
                },
                error: null,
              }),
            }
          }
          if (table === "category_test_questions") {
            return {
              select: vi.fn().mockReturnThis(),
              eq: vi.fn().mockReturnThis(),
              order: vi.fn().mockResolvedValue({
                data: null,
                error: { message: "Not found" },
              }),
            }
          }
        }),
      }
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await submitAndGradeTestAction({
        categoryId: "cat-001",
        duration: 1800,
        answers: [0, 1, 2],
      })

      expect(result.success).toBe(false)
      expect(result.error).toBe("Questions not found")
    })

    // NOTE: submitAndGradeTestAction は複数テーブルへの複雑なモック設定が必要なため、
    // ユニットテストではなく、E2E テストで検証することを推奨

    it("DB保存エラーの場合、采点結果は返すが saved=false", async () => {
      const userId = "user-123"
      const correctAnswers = Array(50)
        .fill(0)
        .map((_, i) => i % 4)
      const answers = correctAnswers.map((v, i) =>
        i < 35 ? v : (v + 1) % 4
      )

      const mockSupabase = {
        from: vi.fn((table) => {
          if (table === "category_tests") {
            return {
              select: vi.fn().mockReturnThis(),
              eq: vi.fn().mockReturnThis(),
              single: vi.fn().mockResolvedValue({
                data: {
                  id: 1,
                  category_name: "テスト1",
                  passing_score: 60,
                  total_questions: 50,
                },
                error: null,
              }),
            }
          }
          if (table === "category_test_questions") {
            return {
              select: vi.fn().mockReturnThis(),
              eq: vi.fn().mockReturnThis(),
              order: vi.fn().mockResolvedValue({
                data: Array(50)
                  .fill(null)
                  .map((_, i) => ({
                    question_number: i + 1,
                    correct_answer: i % 4,
                    question: `問題${i + 1}`,
                    options: ["A", "B", "C", "D"],
                    explanation: `解説${i + 1}`,
                    source: "テキスト",
                  })),
                error: null,
              }),
            }
          }
          if (table === "category_test_results") {
            return {
              select: vi.fn().mockReturnThis(),
              eq: vi.fn().mockReturnThis(),
              insert: vi.fn().mockResolvedValue({
                data: null,
                error: { message: "Insert failed" },
              }),
            }
          }
        }),
      }
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)
      vi.mocked(getCurrentUserId).mockResolvedValue(userId)

      const result = await submitAndGradeTestAction({
        categoryId: "cat-001",
        duration: 1800,
        answers,
      })

      expect(result.success).toBe(true)
      expect(result.saved).toBe(false)
      expect(result.saveError).toBeDefined()
      expect(result.correctCount).toBe(35) // 采点結果は返される
      expect(result.percentage).toBe(70)
    })
  })
})
