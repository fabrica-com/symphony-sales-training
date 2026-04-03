import { describe, it, expect, vi, beforeEach } from "vitest"
import {
  getSessionContentFromDB,
  getSessionContentsFromDB,
  checkSessionContentsExist,
} from "@/lib/session-data/db"
import type { SessionContent } from "@/lib/session-data/types"

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}))

import { createClient } from "@/lib/supabase/server"

describe("session-data/db.ts", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("getSessionContentFromDB", () => {
    it("セッションコンテンツを正しく取得", async () => {
      const mockRow = {
        training_id: 1,
        title: "研修1",
        key_phrase: "キーフレーズ",
        badge: null,
        mood_options: [
          { emoji: "😀", label: "楽しい" },
          { emoji: "😢", label: "悲しい" },
        ],
        review_quiz: null,
        story: null,
        infographic: null,
        quick_check: null,
        quote: null,
        simulation: [
          {
            situation: "状況",
            customerLine: "顧客",
            options: [
              { text: "オプション1", points: 10, isCorrect: true },
            ],
          },
        ],
        roleplay: null,
        reflection: null,
        action_options: null,
        work: null,
        deep_dive: null,
      }

      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: mockRow,
                error: null,
              }),
            }),
          }),
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await getSessionContentFromDB(1)

      expect(result).not.toBeNull()
      expect(result?.trainingId).toBe(1)
      expect(result?.title).toBe("研修1")
      expect(result?.simulation).toEqual([
        {
          situation: "状況",
          customerLine: "顧客",
          options: [
            { text: "オプション1", points: 10, isCorrect: true },
          ],
        },
      ])
    })

    it("セッションが見つからない場合は null を返す", async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: null,
                error: { message: "Not found" },
              }),
            }),
          }),
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await getSessionContentFromDB(999)

      expect(result).toBeNull()
    })

    it("旧形式の simulation オブジェクトを配列に正規化", async () => {
      const mockRow = {
        training_id: 2,
        title: "研修2",
        key_phrase: "キーフレーズ2",
        badge: null,
        mood_options: [],
        review_quiz: null,
        story: null,
        infographic: null,
        quick_check: null,
        quote: null,
        simulation: {
          scenario: "旧形式シナリオ",
          customerProfile: "旧形式顧客",
          options: [{ text: "旧形式オプション", points: 5, isCorrect: false }],
        },
        roleplay: null,
        reflection: null,
        action_options: null,
        work: null,
        deep_dive: null,
      }

      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: mockRow,
                error: null,
              }),
            }),
          }),
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await getSessionContentFromDB(2)

      expect(result?.simulation).toHaveLength(1)
      expect(result?.simulation?.[0]?.situation).toBe("旧形式シナリオ")
      expect(result?.simulation?.[0]?.customerLine).toBe("旧形式顧客")
    })

    it("DB エラー時は null を返す", async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: null,
                error: { message: "Database error" },
              }),
            }),
          }),
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await getSessionContentFromDB(1)

      expect(result).toBeNull()
    })
  })

  describe("getSessionContentsFromDB", () => {
    it("複数のセッションコンテンツを Map で返す", async () => {
      const mockRows = [
        {
          training_id: 1,
          title: "研修1",
          key_phrase: "キー1",
          badge: null,
          mood_options: [],
          review_quiz: null,
          story: null,
          infographic: null,
          quick_check: null,
          quote: null,
          simulation: null,
          roleplay: null,
          reflection: null,
          action_options: null,
          work: null,
          deep_dive: null,
        },
        {
          training_id: 2,
          title: "研修2",
          key_phrase: "キー2",
          badge: null,
          mood_options: [],
          review_quiz: null,
          story: null,
          infographic: null,
          quick_check: null,
          quote: null,
          simulation: null,
          roleplay: null,
          reflection: null,
          action_options: null,
          work: null,
          deep_dive: null,
        },
      ]

      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            in: vi.fn().mockResolvedValue({
              data: mockRows,
              error: null,
            }),
          }),
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await getSessionContentsFromDB([1, 2])

      expect(result.size).toBe(2)
      expect(result.get(1)?.title).toBe("研修1")
      expect(result.get(2)?.title).toBe("研修2")
    })

    it("空のセッションリストを渡すと空 Map を返す", async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            in: vi.fn().mockResolvedValue({
              data: [],
              error: null,
            }),
          }),
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await getSessionContentsFromDB([])

      expect(result.size).toBe(0)
    })

    it("DB エラー時は空 Map を返す", async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            in: vi.fn().mockResolvedValue({
              data: null,
              error: { message: "Error" },
            }),
          }),
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await getSessionContentsFromDB([1, 2, 3])

      expect(result.size).toBe(0)
    })
  })

  describe("checkSessionContentsExist", () => {
    it("セッションコンテンツの総数と ID リストを返す", async () => {
      const mockRows = [
        { training_id: 1 },
        { training_id: 2 },
        { training_id: 5 },
        { training_id: 8 },
      ]

      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({
              data: mockRows,
              error: null,
            }),
          }),
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await checkSessionContentsExist()

      expect(result.total).toBe(4)
      expect(result.ids).toEqual([1, 2, 5, 8])
    })

    it("セッションが存在しない場合は total=0", async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({
              data: [],
              error: null,
            }),
          }),
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await checkSessionContentsExist()

      expect(result.total).toBe(0)
      expect(result.ids).toEqual([])
    })

    it("DB エラー時は空のオブジェクトを返す", async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({
              data: null,
              error: { message: "Error" },
            }),
          }),
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await checkSessionContentsExist()

      expect(result.total).toBe(0)
      expect(result.ids).toEqual([])
    })

    it("大量のセッションコンテンツを正しく処理", async () => {
      const mockRows = Array.from({ length: 100 }, (_, i) => ({
        training_id: i + 1,
      }))

      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({
              data: mockRows,
              error: null,
            }),
          }),
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await checkSessionContentsExist()

      expect(result.total).toBe(100)
      expect(result.ids).toHaveLength(100)
      expect(result.ids[0]).toBe(1)
      expect(result.ids[99]).toBe(100)
    })
  })
})
