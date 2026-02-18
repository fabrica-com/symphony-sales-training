/**
 * Chatwork 通知（モック）
 * 本番では Edge Function または API ルートから Chatwork API を呼ぶ想定。
 * 現時点ではログ出力のみ。API キー取得後に実装を差し替える。
 */

export type NotifyTaskCompletedPayload =
  | { kind: "training"; userId: string; trainingId: number; trainingTitle: string; score: number; maxScore: number }
  | { kind: "category_test"; userId: string; categoryId: string; categoryName: string; percentage: number; passed: boolean }
  | { kind: "final_exam"; userId: string; percentage: number; passed: boolean }

export async function notifyChatworkTaskCompleted(payload: NotifyTaskCompletedPayload): Promise<void> {
  // モック: 実装時は CHATWORK_API_TOKEN 等で API を叩く
  if (process.env.NODE_ENV === "development") {
    console.log("[Chatwork mock] notifyTaskCompleted:", JSON.stringify(payload, null, 2))
  }
  // 本番用プレースホルダ: await fetch(CHATWORK_ENDPOINT, { ... })
}
