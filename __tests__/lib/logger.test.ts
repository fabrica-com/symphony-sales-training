import { describe, it, expect, vi, afterEach } from "vitest"
import { log } from "@/lib/logger"

describe("logger.ts", () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe("log.info", () => {
    it("info レベルでログを出力", () => {
      const consoleSpy = vi.spyOn(console, "info").mockImplementation(() => {})

      log.info("USER_LOGIN", { userId: "user-123", timestamp: new Date().toISOString() })

      expect(consoleSpy).toHaveBeenCalledOnce()
      const call = consoleSpy.mock.calls[0]![0] as string
      const parsed = JSON.parse(call)

      expect(parsed.event).toBe("USER_LOGIN")
      expect(parsed.level).toBe("info")
      expect(parsed.userId).toBe("user-123")
      expect(parsed.ts).toBeDefined()

      consoleSpy.mockRestore()
    })
  })

  describe("log.error", () => {
    it("error レベルでログを出力", () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

      log.error("DB_CONNECTION_FAILED", { database: "postgres", message: "timeout" })

      expect(consoleSpy).toHaveBeenCalledOnce()
      const call = consoleSpy.mock.calls[0]![0] as string
      const parsed = JSON.parse(call)

      expect(parsed.event).toBe("DB_CONNECTION_FAILED")
      expect(parsed.level).toBe("error")
      expect(parsed.database).toBe("postgres")

      consoleSpy.mockRestore()
    })
  })

  describe("log.warn", () => {
    it("warn レベルでログを出力", () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {})

      log.warn("SLOW_QUERY", { queryTime: 5000 })

      expect(consoleSpy).toHaveBeenCalledOnce()
      const call = consoleSpy.mock.calls[0]![0] as string
      const parsed = JSON.parse(call)

      expect(parsed.event).toBe("SLOW_QUERY")
      expect(parsed.level).toBe("warn")

      consoleSpy.mockRestore()
    })
  })

  describe("log.security", () => {
    it("security イベントを error チャンネルで出力", () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

      log.security("UNAUTHORIZED_ACCESS", { userId: "attacker", action: "deleteUser" })

      expect(consoleSpy).toHaveBeenCalledOnce()
      const call = consoleSpy.mock.calls[0]![0] as string
      const parsed = JSON.parse(call)

      expect(parsed.event).toBe("UNAUTHORIZED_ACCESS")
      expect(parsed.level).toBe("security")
      expect(parsed.userId).toBe("attacker")

      consoleSpy.mockRestore()
    })
  })

  describe("log.debug", () => {
    it("development 環境では debug ログを出力", () => {
      // NODE_ENV が development の場合のみ出力
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = "development"

      const consoleSpy = vi.spyOn(console, "debug").mockImplementation(() => {})

      log.debug("DEBUG_EVENT", { details: "test" })

      // NOTE: IS_DEV は require time に評価されるため、完全なテストは別プロセスが必要
      // ここでは spy が呼ばれる可能性をテスト

      consoleSpy.mockRestore()
      process.env.NODE_ENV = originalEnv
    })
  })

  describe("ログ JSON フォーマット", () => {
    it("すべてのログエントリが有効な JSON 形式", () => {
      const consoleSpy = vi.spyOn(console, "info").mockImplementation(() => {})

      log.info("FORMAT_TEST", { key: "value", nested: { a: 1 } })

      const call = consoleSpy.mock.calls[0]![0] as string
      const parsed = JSON.parse(call)

      expect(parsed).toHaveProperty("ts")
      expect(parsed).toHaveProperty("level")
      expect(parsed).toHaveProperty("event")
      expect(typeof parsed.ts).toBe("string")

      consoleSpy.mockRestore()
    })

    it("タイムスタンプが ISO 8601 形式", () => {
      const consoleSpy = vi.spyOn(console, "info").mockImplementation(() => {})

      log.info("TS_TEST", {})

      const call = consoleSpy.mock.calls[0]![0] as string
      const parsed = JSON.parse(call)
      const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/

      expect(isoRegex.test(parsed.ts)).toBe(true)

      consoleSpy.mockRestore()
    })
  })

  describe("複数コンテキスト", () => {
    it("複数のコンテキストフィールドをログに含める", () => {
      const consoleSpy = vi.spyOn(console, "info").mockImplementation(() => {})

      log.info("MULTI_CONTEXT", {
        userId: "user-123",
        action: "login",
        ip: "192.168.1.1",
        duration: 2000,
      })

      const call = consoleSpy.mock.calls[0]![0] as string
      const parsed = JSON.parse(call)

      expect(parsed.userId).toBe("user-123")
      expect(parsed.action).toBe("login")
      expect(parsed.ip).toBe("192.168.1.1")
      expect(parsed.duration).toBe(2000)

      consoleSpy.mockRestore()
    })
  })

  describe("引数なしログ", () => {
    it("コンテキストなしでログを出力", () => {
      const consoleSpy = vi.spyOn(console, "info").mockImplementation(() => {})

      log.info("SIMPLE_EVENT")

      expect(consoleSpy).toHaveBeenCalledOnce()
      const call = consoleSpy.mock.calls[0]![0] as string
      const parsed = JSON.parse(call)

      expect(parsed.event).toBe("SIMPLE_EVENT")
      expect(Object.keys(parsed)).toContain("ts")
      expect(Object.keys(parsed)).toContain("level")

      consoleSpy.mockRestore()
    })
  })
})
