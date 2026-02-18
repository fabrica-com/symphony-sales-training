/**
 * Chatwork 通知
 * Server Action から直接 Chatwork API を呼ぶ。
 * CHATWORK_API_TOKEN / CHATWORK_ROOM_ID が未設定の場合はログのみ（モック）。
 */

export type NotifyTaskCompletedPayload =
  | {
      kind: "training"
      userId: string
      trainingId: number
      trainingTitle: string
      score: number
      maxScore: number
      userName?: string
      moodEmoji?: string
      moodLabel?: string
      reflectionText?: string
    }
  | { kind: "category_test"; userId: string; categoryId: string; categoryName: string; percentage: number; passed: boolean }
  | { kind: "final_exam"; userId: string; percentage: number; passed: boolean }

async function sendChatwork(message: string): Promise<void> {
  const token = process.env.CHATWORK_API_TOKEN
  const roomId = process.env.CHATWORK_ROOM_ID

  if (!token || !roomId) {
    if (process.env.NODE_ENV === "development") {
      console.log("[Chatwork mock] message:\n" + message)
    }
    return
  }

  const res = await fetch(`https://api.chatwork.com/v2/rooms/${roomId}/messages`, {
    method: "POST",
    headers: {
      "x-chatworktoken": token,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ body: message }),
  })

  if (!res.ok) {
    const err = await res.text().catch(() => "")
    console.error("[Chatwork] API error:", res.status, err)
  } else {
    console.log("[Chatwork] 通知送信成功")
  }
}

export async function notifyChatworkTaskCompleted(payload: NotifyTaskCompletedPayload): Promise<void> {
  if (payload.kind === "training") {
    const lines = [
      `[研修完了通知]`,
      `ユーザー: ${payload.userName ?? payload.userId}`,
      `研修: ${payload.trainingTitle}`,
    ]
    if (payload.moodEmoji && payload.moodLabel) {
      lines.push(`気分: ${payload.moodEmoji} ${payload.moodLabel}`)
    }
    if (payload.reflectionText) {
      lines.push(`振り返り: ${payload.reflectionText}`)
    }
    lines.push(`スコア: ${payload.score} / ${payload.maxScore} pt`)
    await sendChatwork(lines.join("\n"))
  } else if (payload.kind === "category_test") {
    const lines = [
      `[カテゴリテスト完了]`,
      `カテゴリ: ${payload.categoryName}`,
      `結果: ${payload.percentage}% ${payload.passed ? "✅ 合格" : "❌ 不合格"}`,
    ]
    await sendChatwork(lines.join("\n"))
  } else if (payload.kind === "final_exam") {
    const lines = [
      `[修了テスト完了]`,
      `結果: ${payload.percentage}% ${payload.passed ? "✅ 合格" : "❌ 不合格"}`,
    ]
    await sendChatwork(lines.join("\n"))
  }
}
