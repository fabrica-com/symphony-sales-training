import { describe, it, expect, vi, beforeEach } from "vitest"
import { getCurrentUserId } from "@/lib/auth-server"

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}))

import { createClient } from "@/lib/supabase/server"

describe("auth-server.ts", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("getCurrentUserId", () => {
    it("ログイン済みユーザーの ID を返す", async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: {
              user: {
                id: "user-123",
                email: "test@example.com",
              },
            },
            error: null,
          }),
        },
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await getCurrentUserId()

      expect(result).toBe("user-123")
    })

    it("未ログイン状態では null を返す", async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: null },
            error: null,
          }),
        },
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await getCurrentUserId()

      expect(result).toBeNull()
    })

    it("エラー発生時は null を返す", async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: null },
            error: { message: "Auth error" },
          }),
        },
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await getCurrentUserId()

      expect(result).toBeNull()
    })

    it("複数回呼び出し時、毎回正しいユーザーを返す", async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn()
            .mockResolvedValueOnce({
              data: { user: { id: "user-1" } },
              error: null,
            })
            .mockResolvedValueOnce({
              data: { user: { id: "user-2" } },
              error: null,
            }),
        },
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result1 = await getCurrentUserId()
      const result2 = await getCurrentUserId()

      expect(result1).toBe("user-1")
      expect(result2).toBe("user-2")
    })

    it("セッション期限切れの場合は null を返す", async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: null },
            error: { message: "session_not_found" },
          }),
        },
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await getCurrentUserId()

      expect(result).toBeNull()
    })

    it("Supabase クライアント作成失敗時は例外をスロー", async () => {
      vi.mocked(createClient).mockRejectedValue(new Error("Client creation failed"))

      await expect(getCurrentUserId()).rejects.toThrow("Client creation failed")
    })
  })
})
