import { createClient } from "@/lib/supabase/server"
import { getCurrentUserId } from "@/lib/auth-server"
import type { TrainingResult } from "@/lib/training-results-types"
export type { TrainingResult } from "@/lib/training-results-types"

// データベースから研修結果を取得
// training_sessionsテーブルから特定のトレーニングIDのセッションを取得
export async function getTrainingResultsFromDb(trainingId: number): Promise<TrainingResult[]> {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return []
    }

    const client = await createClient()

    // training_sessionsテーブルからデータを取得
    const { data, error } = await client
      .from("training_sessions")
      .select("*")
      .eq("training_id", trainingId)
      .eq("user_id", userId)
      .order("attempt_number", { ascending: true })

    if (error) {
      console.error("getTrainingResultsFromDb - error:", error)
      return []
    }


    // training_sessionsのフォーマットからTrainingResultに変換
    interface TrainingSessionRow {
      id: string
      training_id: number
      training_title: string
      category_id: string
      category_name: string
      attempt_number: number
      overall_score: number
      max_score: number
      duration_seconds: number
      feedback?: string
      strengths?: string[]
      improvements?: string[]
      evaluation?: { category: string; score: number; comment: string }[]
      completed_at: string
    }

    const results: TrainingResult[] = (data || []).map((session: TrainingSessionRow) => ({
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
      evaluation: Array.isArray(session.evaluation) ? session.evaluation : [],
      completedAt: session.completed_at,
    }))

    return results
  } catch (error) {
    console.error("getTrainingResultsFromDb - exception:", error)
    return []
  }
}

export { getScoreColor, getScoreBgColor } from "@/lib/training-results-types"
