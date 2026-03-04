/**
 * E2Eテスト用: 最近のChatwork通知メッセージを取得・クリアするAPI
 * dev環境でのみ動作する
 */
import { getRecentNotifications, clearRecentNotifications } from "@/lib/notify-chatwork"

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return Response.json({ error: "Not available in production" }, { status: 403 })
  }
  return Response.json({ notifications: getRecentNotifications() })
}

export async function DELETE() {
  if (process.env.NODE_ENV === "production") {
    return Response.json({ error: "Not available in production" }, { status: 403 })
  }
  clearRecentNotifications()
  return Response.json({ ok: true })
}
