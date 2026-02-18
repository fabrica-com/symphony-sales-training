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
      categoryName?: string
      score: number
      maxScore: number
      userName?: string
      moodEmoji?: string
      moodLabel?: string
      reflectionText?: string
      workAnswers?: { label: string; value: string }[]
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
    const paddedId = String(payload.trainingId).padStart(2, "0")
    const fullTitle = payload.categoryName
      ? `${payload.categoryName} - ${paddedId} ${payload.trainingTitle}`
      : `${paddedId} ${payload.trainingTitle}`

    const lines: string[] = [
      `ユーザー: ${payload.userName ?? payload.userId}`,
      `研修: ${fullTitle}`,
      `スコア: ${payload.score} / ${payload.maxScore} pt`,
    ]

    if (payload.moodEmoji && payload.moodLabel) {
      lines.push(`気分: ${payload.moodEmoji} ${payload.moodLabel}`)
    }

    if (payload.moodLabel && payload.reflectionText) {
      lines.push(`振り返り: ${payload.reflectionText}`)
    }

    if (payload.workAnswers && payload.workAnswers.length > 0) {
      for (const answer of payload.workAnswers) {
        lines.push(`${answer.label}: ${answer.value}`)
      }
    }

    const body = lines.join("\n")
    const message = `[info][title]研修完了通知[/title]${body}[/info]`
    await sendChatwork(message)
  } else if (payload.kind === "category_test") {
    const result = payload.passed ? "✅ 合格" : "❌ 不合格"
    const body = [
      `カテゴリ: ${payload.categoryName}`,
      `結果: ${payload.percentage}% ${result}`,
    ].join("\n")
    const message = `[info][title]カテゴリテスト完了[/title]${body}[/info]`
    await sendChatwork(message)
  } else if (payload.kind === "final_exam") {
    const result = payload.passed ? "✅ 合格" : "❌ 不合格"
    const body = `結果: ${payload.percentage}% ${result}`
    const message = `[info][title]修了テスト完了[/title]${body}[/info]`
    await sendChatwork(message)
  }
}
