import { describe, it, expect, vi, beforeEach } from "vitest"
import { loadUserDataFromServer } from "@/app/actions/user-actions"

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}))

vi.mock("@/lib/auth-server", () => ({
  getCurrentUserId: vi.fn(),
}))

vi.mock("@/lib/logger", () => ({
  log: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
    security: vi.fn(),
  },
}))

import { createClient } from "@/lib/supabase/server"
import { getCurrentUserId } from "@/lib/auth-server"

describe("user-actions.ts", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("loadUserDataFromServer", () => {
    it("未ログイン状態では空のデータを返す", async () => {
      vi.mocked(getCurrentUserId).mockResolvedValue(null)

      const result = await loadUserDataFromServer()

      expect(result.success).toBe(true)
      expect(result.sessions).toEqual([])
      expect(result.progress).toEqual([])
      expect(result.tests).toEqual([])
    })

    it("ログイン済みで全データを取得", async () => {
      vi.mocked(getCurrentUserId).mockResolvedValue("user-123")

      const mockSessions = [
        {
          id: "session-1",
          user_id: "user-123",
          training_id: 1,
          created_at: "2026-04-02T10:00:00Z",
        },
      ]

      const mockProgress = [
        {
          id: "progress-1",
          user_id: "user-123",
          training_id: 1,
          completed: true,
        },
      ]

      const mockTests = [
        {
          id: "test-1",
          user_id: "user-123",
          category_id: "A",
          score: 80,
          created_at: "2026-04-02T11:00:00Z",
        },
      ]

      const mockSupabase = {
        from: vi.fn().mockImplementation((table) => {
          if (table === "training_sessions") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  order: vi.fn().mockResolvedValue({
                    data: mockSessions,
                    error: null,
                  }),
                }),
              }),
            }
          }
          if (table === "user_training_progress") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({
                  data: mockProgress,
                  error: null,
                }),
              }),
            }
          }
          if (table === "category_test_results") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  order: vi.fn().mockResolvedValue({
                    data: mockTests,
                    error: null,
                  }),
                }),
              }),
            }
          }
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await loadUserDataFromServer()

      expect(result.success).toBe(true)
      expect(result.sessions).toHaveLength(1)
      expect(result.progress).toHaveLength(1)
      expect(result.tests).toHaveLength(1)
      expect(result.sessions[0]?.training_id).toBe(1)
      expect(result.progress[0]?.completed).toBe(true)
      expect(result.tests[0]?.score).toBe(80)
    })

    it("sessionsResult エラーで失敗", async () => {
      vi.mocked(getCurrentUserId).mockResolvedValue("user-123")

      const mockSupabase = {
        from: vi.fn().mockImplementation((table) => {
          if (table === "training_sessions") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  order: vi.fn().mockResolvedValue({
                    data: null,
                    error: { message: "Sessions error", code: "ERR001" },
                  }),
                }),
              }),
            }
          }
          if (table === "user_training_progress") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({
                  data: [],
                  error: null,
                }),
              }),
            }
          }
          if (table === "category_test_results") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  order: vi.fn().mockResolvedValue({
                    data: [],
                    error: null,
                  }),
                }),
              }),
            }
          }
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await loadUserDataFromServer()

      expect(result.success).toBe(false)
      expect(result.error).toBe("Sessions error")
    })

    it("progressResult エラーはログしてが続行", async () => {
      vi.mocked(getCurrentUserId).mockResolvedValue("user-123")

      const mockSessions = [{ id: "s1", user_id: "user-123" }]
      const mockTests = [{ id: "t1", user_id: "user-123" }]

      const mockSupabase = {
        from: vi.fn().mockImplementation((table) => {
          if (table === "training_sessions") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  order: vi.fn().mockResolvedValue({
                    data: mockSessions,
                    error: null,
                  }),
                }),
              }),
            }
          }
          if (table === "user_training_progress") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({
                  data: null,
                  error: { message: "Progress error", code: "ERR002" },
                }),
              }),
            }
          }
          if (table === "category_test_results") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  order: vi.fn().mockResolvedValue({
                    data: mockTests,
                    error: null,
                  }),
                }),
              }),
            }
          }
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await loadUserDataFromServer()

      expect(result.success).toBe(true)
      expect(result.sessions).toHaveLength(1)
      expect(result.progress).toEqual([])
      expect(result.tests).toHaveLength(1)
    })

    it("testsResult エラーはログして続行", async () => {
      vi.mocked(getCurrentUserId).mockResolvedValue("user-123")

      const mockSessions = [{ id: "s1", user_id: "user-123" }]
      const mockProgress = [{ id: "p1", user_id: "user-123" }]

      const mockSupabase = {
        from: vi.fn().mockImplementation((table) => {
          if (table === "training_sessions") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  order: vi.fn().mockResolvedValue({
                    data: mockSessions,
                    error: null,
                  }),
                }),
              }),
            }
          }
          if (table === "user_training_progress") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({
                  data: mockProgress,
                  error: null,
                }),
              }),
            }
          }
          if (table === "category_test_results") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  order: vi.fn().mockResolvedValue({
                    data: null,
                    error: { message: "Tests error", code: "ERR003" },
                  }),
                }),
              }),
            }
          }
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await loadUserDataFromServer()

      expect(result.success).toBe(true)
      expect(result.sessions).toHaveLength(1)
      expect(result.progress).toHaveLength(1)
      expect(result.tests).toEqual([])
    })

    it("例外発生時はエラーを返す", async () => {
      vi.mocked(getCurrentUserId).mockRejectedValue(new Error("Auth error"))

      const result = await loadUserDataFromServer()

      expect(result.success).toBe(false)
      expect(result.error).toContain("Auth error")
    })

    it("全てエラーの場合、最初のエラー（sessions）を返す", async () => {
      vi.mocked(getCurrentUserId).mockResolvedValue("user-123")

      const mockSupabase = {
        from: vi.fn().mockImplementation((table) => {
          if (table === "training_sessions") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  order: vi.fn().mockResolvedValue({
                    data: null,
                    error: { message: "All error", code: "ERR" },
                  }),
                }),
              }),
            }
          }
          if (table === "user_training_progress") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({
                  data: null,
                  error: { message: "Progress error", code: "ERR" },
                }),
              }),
            }
          }
          if (table === "category_test_results") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  order: vi.fn().mockResolvedValue({
                    data: null,
                    error: { message: "Tests error", code: "ERR" },
                  }),
                }),
              }),
            }
          }
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await loadUserDataFromServer()

      expect(result.success).toBe(false)
      expect(result.error).toBe("All error")
    })

    it("複数のセッションが取得される場合、降順で返される", async () => {
      vi.mocked(getCurrentUserId).mockResolvedValue("user-123")

      const mockSessions = [
        { id: "s1", created_at: "2026-04-03T10:00:00Z" },
        { id: "s2", created_at: "2026-04-02T10:00:00Z" },
        { id: "s3", created_at: "2026-04-01T10:00:00Z" },
      ]

      const mockSupabase = {
        from: vi.fn().mockImplementation((table) => {
          if (table === "training_sessions") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  order: vi.fn().mockResolvedValue({
                    data: mockSessions,
                    error: null,
                  }),
                }),
              }),
            }
          }
          if (table === "user_training_progress") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({
                  data: [],
                  error: null,
                }),
              }),
            }
          }
          if (table === "category_test_results") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  order: vi.fn().mockResolvedValue({
                    data: [],
                    error: null,
                  }),
                }),
              }),
            }
          }
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await loadUserDataFromServer()

      expect(result.success).toBe(true)
      expect(result.sessions).toHaveLength(3)
      expect(result.sessions[0]?.id).toBe("s1")
      expect(result.sessions[2]?.id).toBe("s3")
    })

    it("複数のテスト結果が降順で返される", async () => {
      vi.mocked(getCurrentUserId).mockResolvedValue("user-123")

      const mockTests = [
        { id: "t1", created_at: "2026-04-03T10:00:00Z" },
        { id: "t2", created_at: "2026-04-02T10:00:00Z" },
      ]

      const mockSupabase = {
        from: vi.fn().mockImplementation((table) => {
          if (table === "training_sessions") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  order: vi.fn().mockResolvedValue({
                    data: [],
                    error: null,
                  }),
                }),
              }),
            }
          }
          if (table === "user_training_progress") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({
                  data: [],
                  error: null,
                }),
              }),
            }
          }
          if (table === "category_test_results") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  order: vi.fn().mockResolvedValue({
                    data: mockTests,
                    error: null,
                  }),
                }),
              }),
            }
          }
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await loadUserDataFromServer()

      expect(result.success).toBe(true)
      expect(result.tests).toHaveLength(2)
      expect(result.tests[0]?.id).toBe("t1")
      expect(result.tests[1]?.id).toBe("t2")
    })
  })
})
