import { describe, it, expect, vi, beforeEach } from "vitest"
import {
  getPreviousTestResultAction,
  getPreviousTestResultDetailAction,
  getCategoryByIdAction,
} from "@/app/actions/category-actions"

// Supabase モック
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}))

vi.mock("@/lib/db/categories", () => ({
  getCategoryByIdFromDb: vi.fn(),
  getCategoryTestFromDb: vi.fn(),
}))

import { createClient } from "@/lib/supabase/server"
import { getCategoryTestFromDb } from "@/lib/db/categories"

describe("category-actions.ts", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("getPreviousTestResultAction", () => {
    it("ユーザーが未認証の場合はnullを返す", async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: null },
            error: null,
          }),
        },
      }
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await getPreviousTestResultAction("cat-001")

      expect(result).toBeNull()
    })

    it("前回のテスト結果がない場合（初回受験）はnullを返す", async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: "user-123" } },
            error: null,
          }),
        },
        from: vi.fn((table) => {
          if (table === "category_test_results") {
            return {
              select: vi.fn().mockReturnThis(),
              eq: vi.fn().mockReturnThis(),
              order: vi.fn().mockReturnThis(),
              limit: vi.fn().mockResolvedValue({
                data: [],
                error: null,
              }),
            }
          }
        }),
      }
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await getPreviousTestResultAction("cat-001")

      expect(result).toBeNull()
    })

    it("前回のテスト結果を正しく返す（35/50、15問不正解）", async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: "user-123" } },
            error: null,
          }),
        },
        from: vi.fn((table) => {
          if (table === "category_test_results") {
            return {
              select: vi.fn().mockReturnThis(),
              eq: vi.fn().mockReturnThis(),
              order: vi.fn().mockReturnThis(),
              limit: vi.fn().mockResolvedValue({
                data: [
                  {
                    percentage: 70,
                    correct_count: 35,
                    total_questions: 50,
                    completed_at: "2026-04-02T10:00:00Z",
                    answers: Array(50)
                      .fill(0)
                      .map((_, i) => (i < 35 ? i % 4 : (i + 1) % 4)), // 最初の35問は正解、残り15問は不正解
                  },
                ],
                error: null,
              }),
            }
          }
        }),
      }
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const mockTest = {
        questions: Array(50)
          .fill(null)
          .map((_, i) => ({
            correctAnswer: i % 4,
          })),
      }
      vi.mocked(getCategoryTestFromDb).mockResolvedValue(mockTest as any)

      const result = await getPreviousTestResultAction("cat-001")

      expect(result).not.toBeNull()
      expect(result?.percentage).toBe(70)
      expect(result?.correctCount).toBe(35)
      expect(result?.totalQuestions).toBe(50)
      expect(result?.incorrectQuestionIndices.length).toBe(15)
      expect(result?.incorrectQuestionIndices).toContain(35) // 最初の不正解問題
      expect(result?.incorrectQuestionIndices).toContain(49) // 最後の不正解問題
    })

    it("答えがない場合は空の incorrectQuestionIndices を返す", async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: "user-123" } },
            error: null,
          }),
        },
        from: vi.fn((table) => {
          if (table === "category_test_results") {
            return {
              select: vi.fn().mockReturnThis(),
              eq: vi.fn().mockReturnThis(),
              order: vi.fn().mockReturnThis(),
              limit: vi.fn().mockResolvedValue({
                data: [
                  {
                    percentage: 70,
                    correct_count: 35,
                    total_questions: 50,
                    completed_at: "2026-04-02T10:00:00Z",
                    answers: null, // 答えがない
                  },
                ],
                error: null,
              }),
            }
          }
        }),
      }
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await getPreviousTestResultAction("cat-001")

      expect(result).not.toBeNull()
      expect(result?.incorrectQuestionIndices).toEqual([])
    })
  })

  describe("getPreviousTestResultDetailAction", () => {
    it("前回のテスト詳細結果を返す（全問題結果を含む）", async () => {
      const answers = Array(50)
        .fill(0)
        .map((_, i) => (i < 40 ? i % 4 : (i + 1) % 4)) // 最初の40問は正解、残り10問は不正解

      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: "user-123" } },
            error: null,
          }),
        },
        from: vi.fn((table) => {
          if (table === "category_test_results") {
            return {
              select: vi.fn().mockReturnThis(),
              eq: vi.fn().mockReturnThis(),
              order: vi.fn().mockReturnThis(),
              limit: vi.fn().mockResolvedValue({
                data: [
                  {
                    score: 80,
                    percentage: 80,
                    correct_count: 40,
                    total_questions: 50,
                    completed_at: "2026-04-02T10:00:00Z",
                    answers,
                  },
                ],
                error: null,
              }),
            }
          }
        }),
      }
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const mockTest = {
        questions: Array(50)
          .fill(null)
          .map((_, i) => ({
            correctAnswer: i % 4,
            question: `問題${i + 1}`,
            options: ["A", "B", "C", "D"],
            source: "テキスト",
            explanation: `解説${i + 1}`,
          })),
      }
      vi.mocked(getCategoryTestFromDb).mockResolvedValue(mockTest as any)

      const result = await getPreviousTestResultDetailAction("cat-001")

      expect(result).not.toBeNull()
      expect(result?.score).toBe(80)
      expect(result?.percentage).toBe(80)
      expect(result?.correctCount).toBe(40)
      expect(result?.questionResults.length).toBe(50)
      expect(result?.incorrectQuestionIndices.length).toBe(10) // 最後の10問が不正解

      // 最初の正解問題を確認
      expect(result?.questionResults[0].isCorrect).toBe(true)
      expect(result?.questionResults[0].userAnswer).toBe(0)
      expect(result?.questionResults[0].correctAnswer).toBe(0)

      // 最後の不正解問題を確認
      expect(result?.questionResults[49].isCorrect).toBe(false)
      expect(result?.questionResults[49].userAnswer).toBe((49 + 1) % 4)
      expect(result?.questionResults[49].correctAnswer).toBe(49 % 4)
      expect(result?.questionResults[49].explanation).toBe("解説50")
    })

    it("ユーザーが未認証の場合はnullを返す", async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: null },
            error: null,
          }),
        },
      }
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await getPreviousTestResultDetailAction("cat-001")

      expect(result).toBeNull()
    })

    it("前回のテスト詳細がない場合はnullを返す", async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: "user-123" } },
            error: null,
          }),
        },
        from: vi.fn((table) => {
          if (table === "category_test_results") {
            return {
              select: vi.fn().mockReturnThis(),
              eq: vi.fn().mockReturnThis(),
              order: vi.fn().mockReturnThis(),
              limit: vi.fn().mockResolvedValue({
                data: [],
                error: null,
              }),
            }
          }
        }),
      }
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await getPreviousTestResultDetailAction("cat-001")

      expect(result).toBeNull()
    })
  })
})
