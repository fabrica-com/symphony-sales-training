import { describe, it, expect, vi, beforeEach } from "vitest"
import { markDeepDiveRead, hasReadDeepDive } from "@/app/actions/deep-dive-actions"

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}))

vi.mock("@/lib/auth-server", () => ({
  getCurrentUserId: vi.fn(),
}))

import { createClient } from "@/lib/supabase/server"
import { getCurrentUserId } from "@/lib/auth-server"

describe("deep-dive-actions.ts", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("markDeepDiveRead", () => {
    it("未ログイン状態では Unauthorized エラー", async () => {
      vi.mocked(getCurrentUserId).mockResolvedValue(null)

      const result = await markDeepDiveRead(1)

      expect(result.success).toBe(false)
      expect(result.error).toBe("Unauthorized")
    })

    it("ディープダイブを読んだことをマーク", async () => {
      vi.mocked(getCurrentUserId).mockResolvedValue("user-123")

      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          upsert: vi.fn().mockResolvedValue({
            data: null,
            error: null,
          }),
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await markDeepDiveRead(42)

      expect(result.success).toBe(true)
      expect(mockSupabase.from).toHaveBeenCalledWith("user_deep_dive_reads")
      expect(mockSupabase.from().upsert).toHaveBeenCalledWith(
        { user_id: "user-123", training_id: 42 },
        { onConflict: "user_id,training_id" }
      )
    })

    it("DB エラー時はエラーを返す", async () => {
      vi.mocked(getCurrentUserId).mockResolvedValue("user-123")

      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          upsert: vi.fn().mockResolvedValue({
            data: null,
            error: { message: "Insert error" },
          }),
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await markDeepDiveRead(1)

      expect(result.success).toBe(false)
      expect(result.error).toBe("Insert error")
    })

    it("複数のトレーニングIDでマーク可能", async () => {
      vi.mocked(getCurrentUserId).mockResolvedValue("user-123")

      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          upsert: vi.fn().mockResolvedValue({
            data: null,
            error: null,
          }),
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result1 = await markDeepDiveRead(1)
      const result2 = await markDeepDiveRead(999)

      expect(result1.success).toBe(true)
      expect(result2.success).toBe(true)
      expect(mockSupabase.from().upsert).toHaveBeenCalledTimes(2)
    })
  })

  describe("hasReadDeepDive", () => {
    it("未ログイン状態では false を返す", async () => {
      vi.mocked(getCurrentUserId).mockResolvedValue(null)

      const result = await hasReadDeepDive(1)

      expect(result).toBe(false)
    })

    it("ディープダイブを読んでいる場合は true を返す", async () => {
      vi.mocked(getCurrentUserId).mockResolvedValue("user-123")

      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn()
              .mockReturnValueOnce({
                eq: vi.fn().mockReturnValue({
                  maybeSingle: vi.fn().mockResolvedValue({
                    data: { id: 1 },
                    error: null,
                  }),
                }),
              }),
          }),
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await hasReadDeepDive(42)

      expect(result).toBe(true)
    })

    it("ディープダイブを読んでいない場合は false を返す", async () => {
      vi.mocked(getCurrentUserId).mockResolvedValue("user-123")

      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn()
              .mockReturnValueOnce({
                eq: vi.fn().mockReturnValue({
                  maybeSingle: vi.fn().mockResolvedValue({
                    data: null,
                    error: null,
                  }),
                }),
              }),
          }),
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await hasReadDeepDive(42)

      expect(result).toBe(false)
    })

    it("DB エラー時は false を返す", async () => {
      vi.mocked(getCurrentUserId).mockResolvedValue("user-123")

      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn()
              .mockReturnValueOnce({
                eq: vi.fn().mockReturnValue({
                  maybeSingle: vi.fn().mockResolvedValue({
                    data: null,
                    error: { message: "Error" },
                  }),
                }),
              }),
          }),
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await hasReadDeepDive(1)

      expect(result).toBe(false)
    })

    it("正しい trainingId でクエリが実行される", async () => {
      vi.mocked(getCurrentUserId).mockResolvedValue("user-123")

      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn()
              .mockReturnValueOnce({
                eq: vi.fn().mockReturnValue({
                  maybeSingle: vi.fn().mockResolvedValue({
                    data: null,
                    error: null,
                  }),
                }),
              }),
          }),
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      await hasReadDeepDive(999)

      const eqCalls = mockSupabase.from().select().eq.mock.calls
      expect(eqCalls.length).toBeGreaterThanOrEqual(1)
      expect(eqCalls[0]).toContain("user_id")
    })
  })
})
