import { createClient } from "@/lib/supabase/server"
export type { TrainingResult } from "@/lib/training-results-types"

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
      evaluation: Array.isArray(session.evaluation) ? session.evaluation : [],
      completedAt: session.completed_at,
    }))

    return results
  } catch (error) {
    console.error("[v0] getTrainingResultsFromDb - exception:", error)
    return []
  }
}

export { getScoreColor, getScoreBgColor } from "@/lib/training-results-types"
