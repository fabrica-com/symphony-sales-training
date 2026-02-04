"use server"

import { finalExamData } from "@/lib/final-exam-data"
import { createClient } from "@/lib/supabase/server"

export interface FinalExamResult {
  userId: string
  completedAt: string
  score: number
  percentage: number
  passed: boolean
  correctCount: number
  totalQuestions: number
  duration: number
}

// 修了テストデータを取得
export async function getFinalExamAction() {
  return finalExamData
}

// 修了テスト結果を保存
export async function saveFinalExamResultAction(result: FinalExamResult) {
  try {
    const supabase = await createClient()
    
    const { error } = await supabase.from("final_exam_results").insert({
      user_id: result.userId,
      completed_at: result.completedAt,
      score: result.score,
      percentage: result.percentage,
      passed: result.passed,
      correct_count: result.correctCount,
      total_questions: result.totalQuestions,
      duration: result.duration,
    })

    if (error) {
      console.error("Failed to save final exam result:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error saving final exam result:", error)
    return { success: false, error: "Failed to save result" }
  }
}

// ユーザーの修了テスト結果を取得
export async function getFinalExamResultsAction(userId: string) {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from("final_exam_results")
      .select("*")
      .eq("user_id", userId)
      .order("completed_at", { ascending: false })

    if (error) {
      console.error("Failed to fetch final exam results:", error)
      return []
    }

    return data
  } catch (error) {
    console.error("Error fetching final exam results:", error)
    return []
  }
}

// ユーザーが修了テストに合格しているかチェック
export async function checkFinalExamPassedAction(userId: string) {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from("final_exam_results")
      .select("passed")
      .eq("user_id", userId)
      .eq("passed", true)
      .limit(1)

    if (error) {
      console.error("Failed to check final exam passed:", error)
      return false
    }

    return data && data.length > 0
  } catch (error) {
    console.error("Error checking final exam passed:", error)
    return false
  }
}
