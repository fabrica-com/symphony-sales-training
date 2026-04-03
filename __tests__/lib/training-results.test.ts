import { describe, it, expect, vi, beforeEach } from "vitest"
import { getTrainingResultsFromDb } from "@/lib/training-results"

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}))

vi.mock("@/lib/auth-server", () => ({
  getCurrentUserId: vi.fn(),
}))

import { createClient } from "@/lib/supabase/server"
import { getCurrentUserId } from "@/lib/auth-server"

describe("training-results.ts", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("getTrainingResultsFromDb", () => {
    it("ユーザーが未認証の場合は空配列を返す", async () => {
      vi.mocked(getCurrentUserId).mockResolvedValue(null)

      const result = await getTrainingResultsFromDb(1)

      expect(result).toEqual([])
    })

    it("訓練結果が見つからない場合は空配列を返す", async () => {
      vi.mocked(getCurrentUserId).mockResolvedValue("user-123")

      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn()
              .mockReturnValueOnce({
                eq: vi.fn().mockReturnValue({
                  order: vi.fn().mockResolvedValue({
                    data: [],
                    error: null,
                  }),
                }),
              }),
          }),
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await getTrainingResultsFromDb(1)

      expect(result).toEqual([])
    })

    it("単一の訓練結果を正しく返す", async () => {
      vi.mocked(getCurrentUserId).mockResolvedValue("user-123")

      const mockSession = {
        id: "session-1",
        training_id: 1,
        training_title: "研修1",
        category_id: "A",
        category_name: "基礎",
        attempt_number: 1,
        overall_score: 85,
        max_score: 100,
        duration_seconds: 3600,
        feedback: "良好",
        strengths: ["理解度が高い"],
        improvements: ["速度を改善"],
        evaluation: [{ category: "理解", score: 9, comment: "優秀" }],
        completed_at: "2026-04-02T10:00:00Z",
      }

      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn()
              .mockReturnValueOnce({
                eq: vi.fn().mockReturnValue({
                  order: vi.fn().mockResolvedValue({
                    data: [mockSession],
                    error: null,
                  }),
                }),
              }),
          }),
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await getTrainingResultsFromDb(1)

      expect(result).toHaveLength(1)
      expect(result[0]!.trainingId).toBe(1)
      expect(result[0]!.score).toBe(85)
      expect(result[0]!.maxScore).toBe(100)
      expect(result[0]!.feedback).toBe("良好")
      expect(result[0]!.strengths).toEqual(["理解度が高い"])
    })

    it("複数の訓練結果を正しく返す（試行順）", async () => {
      vi.mocked(getCurrentUserId).mockResolvedValue("user-123")

      const mockSessions = [
        {
          id: "session-1",
          training_id: 1,
          training_title: "研修1",
          category_id: "A",
          category_name: "基礎",
          attempt_number: 1,
          overall_score: 70,
          max_score: 100,
          duration_seconds: 3600,
          feedback: "",
          strengths: [],
          improvements: [],
          evaluation: [],
          completed_at: "2026-04-01T10:00:00Z",
        },
        {
          id: "session-2",
          training_id: 1,
          training_title: "研修1",
          category_id: "A",
          category_name: "基礎",
          attempt_number: 2,
          overall_score: 90,
          max_score: 100,
          duration_seconds: 2400,
          feedback: "改善した",
          strengths: ["スピード向上"],
          improvements: [],
          evaluation: [],
          completed_at: "2026-04-02T10:00:00Z",
        },
      ]

      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn()
              .mockReturnValueOnce({
                eq: vi.fn().mockReturnValue({
                  order: vi.fn().mockResolvedValue({
                    data: mockSessions,
                    error: null,
                  }),
                }),
              }),
          }),
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await getTrainingResultsFromDb(1)

      expect(result).toHaveLength(2)
      expect(result[0]!.attemptNumber).toBe(1)
      expect(result[1]!.attemptNumber).toBe(2)
      expect(result[1]!.score).toBe(90)
    })

    it("feedback がない場合は空文字列を返す", async () => {
      vi.mocked(getCurrentUserId).mockResolvedValue("user-123")

      const mockSession = {
        id: "session-1",
        training_id: 1,
        training_title: "研修1",
        category_id: "A",
        category_name: "基礎",
        attempt_number: 1,
        overall_score: 85,
        max_score: 100,
        duration_seconds: 3600,
        feedback: undefined,
        strengths: undefined,
        improvements: undefined,
        evaluation: undefined,
        completed_at: "2026-04-02T10:00:00Z",
      }

      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn()
              .mockReturnValueOnce({
                eq: vi.fn().mockReturnValue({
                  order: vi.fn().mockResolvedValue({
                    data: [mockSession],
                    error: null,
                  }),
                }),
              }),
          }),
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await getTrainingResultsFromDb(1)

      expect(result[0]!.feedback).toBe("")
      expect(result[0]!.strengths).toEqual([])
      expect(result[0]!.improvements).toEqual([])
      expect(result[0]!.evaluation).toEqual([])
    })

    it("DB エラー時は空配列を返す", async () => {
      vi.mocked(getCurrentUserId).mockResolvedValue("user-123")

      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn()
              .mockReturnValueOnce({
                eq: vi.fn().mockReturnValue({
                  order: vi.fn().mockResolvedValue({
                    data: null,
                    error: { message: "Connection failed" },
                  }),
                }),
              }),
          }),
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await getTrainingResultsFromDb(1)

      expect(result).toEqual([])
    })

    it("例外発生時は空配列を返す", async () => {
      vi.mocked(getCurrentUserId).mockRejectedValue(new Error("Auth error"))

      const result = await getTrainingResultsFromDb(1)

      expect(result).toEqual([])
    })

    it("evaluation が配列形式でない場合は空配列に変換", async () => {
      vi.mocked(getCurrentUserId).mockResolvedValue("user-123")

      const mockSession = {
        id: "session-1",
        training_id: 1,
        training_title: "研修1",
        category_id: "A",
        category_name: "基礎",
        attempt_number: 1,
        overall_score: 85,
        max_score: 100,
        duration_seconds: 3600,
        feedback: "",
        strengths: [],
        improvements: [],
        evaluation: null, // null では配列ではない
        completed_at: "2026-04-02T10:00:00Z",
      }

      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn()
              .mockReturnValueOnce({
                eq: vi.fn().mockReturnValue({
                  order: vi.fn().mockResolvedValue({
                    data: [mockSession],
                    error: null,
                  }),
                }),
              }),
          }),
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await getTrainingResultsFromDb(1)

      expect(result[0]!.evaluation).toEqual([])
    })

    it("型を正しく変換する（camelCase）", async () => {
      vi.mocked(getCurrentUserId).mockResolvedValue("user-123")

      const mockSession = {
        id: "session-1",
        training_id: 42,
        training_title: "新入社員研修",
        category_id: "B",
        category_name: "商品知識",
        attempt_number: 3,
        overall_score: 92,
        max_score: 100,
        duration_seconds: 7200,
        feedback: "優秀",
        strengths: ["素早い", "正確"],
        improvements: ["もっと深く"],
        evaluation: [{ category: "実務", score: 8, comment: "良好" }],
        completed_at: "2026-04-02T14:30:00Z",
      }

      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn()
              .mockReturnValueOnce({
                eq: vi.fn().mockReturnValue({
                  order: vi.fn().mockResolvedValue({
                    data: [mockSession],
                    error: null,
                  }),
                }),
              }),
          }),
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await getTrainingResultsFromDb(42)
      const r = result[0]!

      expect(r.trainingId).toBe(42)
      expect(r.trainingTitle).toBe("新入社員研修")
      expect(r.categoryId).toBe("B")
      expect(r.categoryName).toBe("商品知識")
      expect(r.attemptNumber).toBe(3)
      expect(r.score).toBe(92)
      expect(r.maxScore).toBe(100)
      expect(r.duration).toBe(7200)
      expect(r.completedAt).toBe("2026-04-02T14:30:00Z")
    })
  })
})
