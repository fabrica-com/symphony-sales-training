import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { createClient } from "@/lib/supabase/client"

vi.mock("@supabase/ssr", () => ({
  createBrowserClient: vi.fn(),
}))

import { createBrowserClient } from "@supabase/ssr"

describe("supabase/client.ts", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co"
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key"
  })

  afterEach(() => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  })

  describe("createClient", () => {
    it("ブラウザ client を生成", () => {
      const mockClient = { from: vi.fn() }
      vi.mocked(createBrowserClient).mockReturnValue(mockClient as any)

      const client = createClient()

      expect(client).toBe(mockClient)
    })

    it("環境変数を使用して初期化", () => {
      const mockClient = { from: vi.fn() }
      vi.mocked(createBrowserClient).mockReturnValue(mockClient as any)

      createClient()

      expect(createBrowserClient).toHaveBeenCalledWith(
        "https://test.supabase.co",
        "test-anon-key"
      )
    })

    it("NEXT_PUBLIC_SUPABASE_URL がない場合はエラー", () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL

      expect(() => createClient()).toThrow(
        "Supabase environment variables are not configured"
      )
    })

    it("NEXT_PUBLIC_SUPABASE_ANON_KEY がない場合はエラー", () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      expect(() => createClient()).toThrow(
        "Supabase environment variables are not configured"
      )
    })

    it("両方の環境変数がない場合はエラー", () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      expect(() => createClient()).toThrow(
        "Supabase environment variables are not configured"
      )
    })

    it("エラーメッセージに両変数名が含まれる", () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL

      try {
        createClient()
        expect.fail("Should have thrown")
      } catch (err) {
        const error = err as Error
        expect(error.message).toContain("NEXT_PUBLIC_SUPABASE_URL")
        expect(error.message).toContain("NEXT_PUBLIC_SUPABASE_ANON_KEY")
      }
    })

    it("毎回新しい client インスタンスが生成される", () => {
      const mockClient1 = { from: vi.fn() }
      const mockClient2 = { from: vi.fn() }

      vi.mocked(createBrowserClient)
        .mockReturnValueOnce(mockClient1 as any)
        .mockReturnValueOnce(mockClient2 as any)

      const client1 = createClient()
      const client2 = createClient()

      expect(client1).not.toBe(client2)
      expect(client1).toBe(mockClient1)
      expect(client2).toBe(mockClient2)
    })

    it("環境変数が空文字列の場合もエラー", () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = ""

      expect(() => createClient()).toThrow()
    })

    it("特殊文字を含む環境変数でも正常に動作", () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = "https://special-chars.supabase.co"
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "key-with-special_chars.123"

      const mockClient = { from: vi.fn() }
      vi.mocked(createBrowserClient).mockReturnValue(mockClient as any)

      const client = createClient()

      expect(createBrowserClient).toHaveBeenCalledWith(
        "https://special-chars.supabase.co",
        "key-with-special_chars.123"
      )
      expect(client).toBe(mockClient)
    })

    it("長い URL とキーでも処理", () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL =
        "https://very-long-subdomain-name.supabase.co"
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "a".repeat(100) // 100文字のキー

      const mockClient = { from: vi.fn() }
      vi.mocked(createBrowserClient).mockReturnValue(mockClient as any)

      const client = createClient()

      expect(client).toBe(mockClient)
      expect(createBrowserClient).toHaveBeenCalled()
    })

    it("複数呼び出しで毎回環境変数を読み込む", () => {
      const mockClient = { from: vi.fn() }
      vi.mocked(createBrowserClient).mockReturnValue(mockClient as any)

      createClient()
      process.env.NEXT_PUBLIC_SUPABASE_URL = "https://different.supabase.co"
      createClient()

      expect(createBrowserClient).toHaveBeenCalledTimes(2)
      expect(createBrowserClient).toHaveBeenNthCalledWith(
        1,
        "https://test.supabase.co",
        "test-anon-key"
      )
      expect(createBrowserClient).toHaveBeenNthCalledWith(
        2,
        "https://different.supabase.co",
        "test-anon-key"
      )
    })
  })
})
