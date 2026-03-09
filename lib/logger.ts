/**
 * 構造化ログユーティリティ
 *
 * - 全ログは JSON 形式で stdout に出力（Next.js dev / Vercel の両方で捕捉される）
 * - development 環境では .logs/security.log にも追記書き込み
 * - ログレベル: debug / info / warn / error / security
 *
 * 使い方:
 *   import { log } from "@/lib/logger"
 *   log.security("UNAUTHORIZED_ACCESS", { userId, action: "saveTestResult" })
 *   log.error("DB_ERROR", { message: err.message, table: "training_sessions" })
 */

import fs from "fs"
import path from "path"

type LogLevel = "debug" | "info" | "warn" | "error" | "security"

interface LogEntry {
  ts: string
  level: LogLevel
  event: string
  [key: string]: unknown
}

const IS_DEV = process.env.NODE_ENV === "development"
const LOG_DIR = path.join(process.cwd(), ".logs")
const LOG_FILE = path.join(LOG_DIR, "security.log")

function writeToFile(entry: LogEntry): void {
  try {
    if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true })
    fs.appendFileSync(LOG_FILE, JSON.stringify(entry) + "\n", "utf-8")
  } catch {
    // ファイル書き込み失敗はサイレントに無視（stdout は必ず出力済み）
  }
}

function emit(level: LogLevel, event: string, context: Record<string, unknown> = {}): void {
  const entry: LogEntry = {
    ts: new Date().toISOString(),
    level,
    event,
    ...context,
  }

  const line = JSON.stringify(entry)

  switch (level) {
    case "debug":
      if (IS_DEV) console.debug(line)
      break
    case "info":
      console.info(line)
      break
    case "warn":
      console.warn(line)
      break
    case "error":
      console.error(line)
      break
    case "security":
      // security は常に error チャンネルに出力して目立たせる
      console.error(line)
      break
  }

  // dev ではファイルにも書き込んでおく（.logs/security.log）
  if (IS_DEV) {
    writeToFile(entry)
  }
}

export const log = {
  debug: (event: string, ctx?: Record<string, unknown>) => emit("debug", event, ctx),
  info:  (event: string, ctx?: Record<string, unknown>) => emit("info",  event, ctx),
  warn:  (event: string, ctx?: Record<string, unknown>) => emit("warn",  event, ctx),
  error: (event: string, ctx?: Record<string, unknown>) => emit("error", event, ctx),
  /**
   * セキュリティ関連イベント専用。
   * 認証失敗・権限エラー・不正アクセス試行などを記録する。
   */
  security: (event: string, ctx?: Record<string, unknown>) => emit("security", event, ctx),
}
