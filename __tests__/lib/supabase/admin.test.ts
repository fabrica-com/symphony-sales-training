import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { createAdminClient } from "@/lib/supabase/admin"

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(),
}))

import { createClient as createSupabaseClient } from "@supabase/supabase-js"

describe("supabase/admin.ts", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co"
    process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key"
  })

  afterEach(() => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    delete process.env.SUPABASE_SERVICE_ROLE_KEY
  })

  describe("createAdminClient", () => {
    it("admin client を生成", async () => {
      const mockAdminClient = { from: vi.fn() }
      vi.mocked(createSupabaseClient).mockReturnValue(mockAdminClient as any)

      const client = await createAdminClient()

      expect(client).toBe(mockAdminClient)
    })

    it("NEXT_PUBLIC_SUPABASE_URL と SERVICE_ROLE_KEY を使用", async () => {
      const mockAdminClient = { from: vi.fn() }
      vi.mocked(createSupabaseClient).mockReturnValue(mockAdminClient as any)

      await createAdminClient()

      expect(createSupabaseClient).toHaveBeenCalledWith(
        "https://test.supabase.co",
        "test-service-role-key"
      )
    })

    it("SERVICE_ROLE_KEY がない場合はエラー", async () => {
      delete process.env.SUPABASE_SERVICE_ROLE_KEY

      await expect(createAdminClient()).rejects.toThrow(
        "SUPABASE_SERVICE_ROLE_KEY is not set"
      )
    })

    it("NEXT_PUBLIC_SUPABASE_URL がない場合も正常に呼び出し", async () => {
      // createClient は ! で非null を強制しているため、undefinedが渡される可能性がある
      // しかし Supabase は実行時に確認するため、テストではmockで確認
      delete process.env.NEXT_PUBLIC_SUPABASE_URL

      const mockAdminClient = { from: vi.fn() }
      vi.mocked(createSupabaseClient).mockReturnValue(mockAdminClient as any)

      const client = await createAdminClient()

      expect(client).toBe(mockAdminClient)
      expect(createSupabaseClient).toHaveBeenCalledWith(
        undefined,
        "test-service-role-key"
      )
    })

    it("SERVICE_ROLE_KEY が空文字列の場合もエラー", async () => {
      process.env.SUPABASE_SERVICE_ROLE_KEY = ""

      await expect(createAdminClient()).rejects.toThrow()
    })

    it("毎回新しい client インスタンスが生成される", async () => {
      const mockAdminClient1 = { from: vi.fn() }
      const mockAdminClient2 = { from: vi.fn() }

      vi.mocked(createSupabaseClient)
        .mockReturnValueOnce(mockAdminClient1 as any)
        .mockReturnValueOnce(mockAdminClient2 as any)

      const client1 = await createAdminClient()
      const client2 = await createAdminClient()

      expect(client1).not.toBe(client2)
      expect(client1).toBe(mockAdminClient1)
      expect(client2).toBe(mockAdminClient2)
    })

    it("エラーメッセージが正確", async () => {
      delete process.env.SUPABASE_SERVICE_ROLE_KEY

      try {
        await createAdminClient()
        expect.fail("Should have thrown")
      } catch (err) {
        const error = err as Error
        expect(error.message).toBe("SUPABASE_SERVICE_ROLE_KEY is not set")
      }
    })

    it("特殊文字を含むキーでも動作", async () => {
      process.env.SUPABASE_SERVICE_ROLE_KEY =
        "key_with_special-chars.123/456"

      const mockAdminClient = { from: vi.fn() }
      vi.mocked(createSupabaseClient).mockReturnValue(mockAdminClient as any)

      const client = await createAdminClient()

      expect(client).toBe(mockAdminClient)
      expect(createSupabaseClient).toHaveBeenCalledWith(
        "https://test.supabase.co",
        "key_with_special-chars.123/456"
      )
    })

    it("非同期で実行", async () => {
      const mockAdminClient = { from: vi.fn() }
      vi.mocked(createSupabaseClient).mockReturnValue(mockAdminClient as any)

      const promise = createAdminClient()

      expect(promise).toBeInstanceOf(Promise)

      const result = await promise

      expect(result).toBe(mockAdminClient)
    })

    it("複数の並列呼び出しで各々新しい client が生成", async () => {
      const mockClients = [
        { id: 1, from: vi.fn() },
        { id: 2, from: vi.fn() },
        { id: 3, from: vi.fn() },
      ]

      vi.mocked(createSupabaseClient)
        .mockReturnValueOnce(mockClients[0] as any)
        .mockReturnValueOnce(mockClients[1] as any)
        .mockReturnValueOnce(mockClients[2] as any)

      const [client1, client2, client3] = await Promise.all([
        createAdminClient(),
        createAdminClient(),
        createAdminClient(),
      ])

      expect(client1).toBe(mockClients[0])
      expect(client2).toBe(mockClients[1])
      expect(client3).toBe(mockClients[2])
      expect(createSupabaseClient).toHaveBeenCalledTimes(3)
    })

    it("SERVICE_ROLE_KEY の長さが多くても動作", async () => {
      process.env.SUPABASE_SERVICE_ROLE_KEY = "k".repeat(500) // 長いキー

      const mockAdminClient = { from: vi.fn() }
      vi.mocked(createSupabaseClient).mockReturnValue(mockAdminClient as any)

      const client = await createAdminClient()

      expect(client).toBe(mockAdminClient)
    })
  })
})
