// 1. 全体の先頭にimportを追加
import { createClient } from "@/lib/supabase/server"

export interface TrainingResult {
  id: string
  trainingId: number
  attemptNumber: number // 1回目、2回目など
  date?: string // 実施日
  duration: number // 実際にかかった時間（分）
  score: number // 総合スコア（100点満点）
  maxScore?: number // 最大スコア
  trainingTitle?: string
  categoryId?: string
  categoryName?: string
  evaluation?: {
    category: string
    score: number
    comment: string
  }[]
  feedback: string // 総合フィードバック
  strengths: string[] // 良かった点
  improvements: string[] // 改善点
  completedAt?: string
}

// データベースから研修結果を取得
// training_sessionsテーブルから特定のトレーニングIDのセッションを取得
export async function getTrainingResultsFromDb(trainingId: number): Promise<TrainingResult[]> {
  try {
    const client = await createClient()

    // current user
    const {
      data: { user },
    } = await client.auth.getUser()

    if (!user) {
      console.log("[v0] getTrainingResultsFromDb - No user found")
      return []
    }

    console.log("[v0] getTrainingResultsFromDb - fetching for trainingId:", trainingId, "userId:", user.id)

    // training_sessionsテーブルからデータを取得
    const { data, error } = await client
      .from("training_sessions")
      .select("*")
      .eq("training_id", trainingId)
      .eq("user_id", user.id)
      .order("attempt_number", { ascending: true })

    if (error) {
      console.error("[v0] getTrainingResultsFromDb - error:", error)
      return []
    }

    console.log("[v0] getTrainingResultsFromDb - fetched count:", data?.length, "data:", data)

    // training_sessionsのフォーマットからTrainingResultに変換
    const results: TrainingResult[] = (data || []).map((session: any) => ({
      id: session.id,
      trainingId: session.training_id,
      trainingTitle: session.training_title,
      categoryId: session.category_id,
      categoryName: session.category_name,
      attemptNumber: session.attempt_number,
      score: session.overall_score,
      maxScore: session.max_score,
      duration: session.duration_seconds,
      feedback: session.feedback || "",
      strengths: session.strengths || [],
      improvements: session.improvements || [],
      evaluation: session.evaluation || {},
      completedAt: session.completed_at,
    }))

    return results
  } catch (error) {
    console.error("[v0] getTrainingResultsFromDb - exception:", error)
    return []
  }
}

// スコアに応じた色を返す
export function getScoreColor(score: number): string {
  if (score >= 90) return "text-emerald-600"
  if (score >= 80) return "text-blue-600"
  if (score >= 70) return "text-amber-600"
  return "text-red-600"
}

export function getScoreBgColor(score: number): string {
  if (score >= 90) return "bg-emerald-100 border-emerald-300"
  if (score >= 80) return "bg-blue-100 border-blue-300"
  if (score >= 70) return "bg-amber-100 border-amber-300"
  return "bg-red-100 border-red-300"
}
