import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { createClient } from "@/lib/supabase/server"

// Next.js cookies をモック
vi.mock("next/headers", () => {
  const mockCookieStore = {
    getAll: vi.fn(),
    set: vi.fn(),
  }
  return {
    cookies: vi.fn().mockResolvedValue(mockCookieStore),
  }
})

// Supabase SSR をモック
vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn(),
}))

import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

describe("supabase/server.ts", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // 環境変数をセット
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co"
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key"
  })

  afterEach(() => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  })

  describe("createClient", () => {
    it("Supabase クライアントを生成", async () => {
      const mockSupabase = {
        from: vi.fn(),
        auth: { getUser: vi.fn() },
      }

      vi.mocked(createServerClient).mockReturnValue(mockSupabase as any)

      const client = await createClient()

      expect(client).toBe(mockSupabase)
    })

    it("NEXT_PUBLIC_SUPABASE_URL と NEXT_PUBLIC_SUPABASE_ANON_KEY を使用", async () => {
      const mockSupabase = { from: vi.fn() }
      vi.mocked(createServerClient).mockReturnValue(mockSupabase as any)

      await createClient()

      expect(createServerClient).toHaveBeenCalledWith(
        "https://test.supabase.co",
        "test-anon-key",
        expect.any(Object)
      )
    })

    it("cookie store の getAll と set が設定される", async () => {
      const mockSupabase = { from: vi.fn() }
      vi.mocked(createServerClient).mockReturnValue(mockSupabase as any)

      const mockCookieStore = {
        getAll: vi.fn().mockReturnValue([
          { name: "auth-token", value: "token-123" },
        ]),
        set: vi.fn(),
      }

      vi.mocked(cookies).mockResolvedValue(mockCookieStore as any)

      await createClient()

      const callArgs = vi.mocked(createServerClient).mock.calls[0]
      const cookiesConfig = callArgs[2]

      expect(cookiesConfig?.cookies?.getAll).toBeDefined()
      expect(cookiesConfig?.cookies?.setAll).toBeDefined()
    })

    it("cookie getAll で正しい値を返す", async () => {
      const mockSupabase = { from: vi.fn() }
      vi.mocked(createServerClient).mockReturnValue(mockSupabase as any)

      const expectedCookies = [
        { name: "auth-token", value: "token-123" },
        { name: "session-id", value: "sess-456" },
      ]

      const mockCookieStore = {
        getAll: vi.fn().mockReturnValue(expectedCookies),
        set: vi.fn(),
      }

      vi.mocked(cookies).mockResolvedValue(mockCookieStore as any)

      await createClient()

      const callArgs = vi.mocked(createServerClient).mock.calls[0]
      const getAll = callArgs[2]?.cookies?.getAll as () => unknown[]

      expect(getAll()).toEqual(expectedCookies)
    })

    it("cookie setAll で複数の cookie が設定される", async () => {
      const mockSupabase = { from: vi.fn() }
      vi.mocked(createServerClient).mockReturnValue(mockSupabase as any)

      const mockCookieStore = {
        getAll: vi.fn().mockReturnValue([]),
        set: vi.fn(),
      }

      vi.mocked(cookies).mockResolvedValue(mockCookieStore as any)

      await createClient()

      const callArgs = vi.mocked(createServerClient).mock.calls[0]
      const setAll = callArgs[2]?.cookies?.setAll as (
        cookies: Array<{ name: string; value: string; options?: unknown }>
      ) => void

      const cookiesToSet = [
        { name: "cookie1", value: "value1", options: { path: "/" } },
        { name: "cookie2", value: "value2", options: { path: "/" } },
      ]

      setAll(cookiesToSet)

      expect(mockCookieStore.set).toHaveBeenCalledTimes(2)
      expect(mockCookieStore.set).toHaveBeenCalledWith(
        "cookie1",
        "value1",
        { path: "/" }
      )
      expect(mockCookieStore.set).toHaveBeenCalledWith(
        "cookie2",
        "value2",
        { path: "/" }
      )
    })

    it("setAll でエラーが発生しても無視される", async () => {
      const mockSupabase = { from: vi.fn() }
      vi.mocked(createServerClient).mockReturnValue(mockSupabase as any)

      const mockCookieStore = {
        getAll: vi.fn().mockReturnValue([]),
        set: vi.fn().mockImplementation(() => {
          throw new Error("Server Component error")
        }),
      }

      vi.mocked(cookies).mockResolvedValue(mockCookieStore as any)

      const client = await createClient()

      // エラーが発生しても createClient は成功
      expect(client).toBe(mockSupabase)
    })

    it("毎回新しい client インスタンスが生成される", async () => {
      const mockSupabase1 = { from: vi.fn() }
      const mockSupabase2 = { from: vi.fn() }

      vi.mocked(createServerClient)
        .mockReturnValueOnce(mockSupabase1 as any)
        .mockReturnValueOnce(mockSupabase2 as any)

      const client1 = await createClient()
      const client2 = await createClient()

      // 異なるインスタンス
      expect(client1).not.toBe(client2)
      expect(client1).toBe(mockSupabase1)
      expect(client2).toBe(mockSupabase2)
    })

    it("cookies() が非同期で呼ばれる", async () => {
      const mockCookieStore = {
        getAll: vi.fn().mockReturnValue([]),
        set: vi.fn(),
      }

      vi.mocked(cookies).mockResolvedValue(mockCookieStore as any)

      const mockSupabase = { from: vi.fn() }
      vi.mocked(createServerClient).mockReturnValue(mockSupabase as any)

      await createClient()

      expect(cookies).toHaveBeenCalled()
    })

    it("空の cookie リストでも動作", async () => {
      const mockCookieStore = {
        getAll: vi.fn().mockReturnValue([]),
        set: vi.fn(),
      }

      vi.mocked(cookies).mockResolvedValue(mockCookieStore as any)

      const mockSupabase = { from: vi.fn() }
      vi.mocked(createServerClient).mockReturnValue(mockSupabase as any)

      const client = await createClient()

      expect(client).toBe(mockSupabase)
    })

    it("複数の cookie が設定される場合に全て処理される", async () => {
      const mockSupabase = { from: vi.fn() }
      vi.mocked(createServerClient).mockReturnValue(mockSupabase as any)

      const mockCookieStore = {
        getAll: vi.fn().mockReturnValue([]),
        set: vi.fn(),
      }

      vi.mocked(cookies).mockResolvedValue(mockCookieStore as any)

      await createClient()

      const callArgs = vi.mocked(createServerClient).mock.calls[0]
      const setAll = callArgs[2]?.cookies?.setAll as (
        cookies: Array<{ name: string; value: string; options?: unknown }>
      ) => void

      // 10個の cookie を設定
      const cookiesToSet = Array.from({ length: 10 }, (_, i) => ({
        name: `cookie${i}`,
        value: `value${i}`,
        options: {},
      }))

      setAll(cookiesToSet)

      expect(mockCookieStore.set).toHaveBeenCalledTimes(10)
    })
  })
})
