"use server"

import { getFinalExamFromDb } from "@/lib/db/categories"
import { createClient } from "@/lib/supabase/server"
import { getCurrentUserId } from "@/lib/auth-server"
import { notifyChatworkTaskCompleted } from "@/lib/notify-chatwork"

export interface FinalExamResultPayload {
  answers: number[]
  duration: number
}

// 修了テストデータを取得
export async function getFinalExamAction() {
  return await getFinalExamFromDb()
}

// 修了テスト結果を保存（サーバーで認証ユーザー確定＋再採点）
export async function saveFinalExamResultAction(payload: FinalExamResultPayload) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return { success: false, error: "Unauthorized" }
    }

    const supabase = await createClient()

    // 正解と設定をサーバーで取得
    const [{ data: config }, { data: questions }] = await Promise.all([
      supabase.from("final_exam_config").select("passing_score, total_questions").eq("id", 1).single(),
      supabase.from("final_exam_questions").select("question_number, correct_answer").order("question_number"),
    ])

    if (!config || !questions) {
      return { success: false, error: "Exam data not found" }
    }

    // サーバーで採点
    let correctCount = 0
    for (let i = 0; i < questions.length; i++) {
      if (payload.answers[i] === questions[i].correct_answer) correctCount++
    }
    const percentage = Math.round((correctCount / config.total_questions) * 100)
    const passed = percentage >= config.passing_score

    const { error } = await supabase.from("final_exam_results").insert({
      user_id: userId,
      completed_at: new Date().toISOString(),
      score: correctCount,
      percentage,
      passed,
      correct_count: correctCount,
      total_questions: config.total_questions,
      duration: payload.duration,
    })

    if (error) {
      console.error("Failed to save final exam result:", error)
      return { success: false, error: error.message }
    }

    await notifyChatworkTaskCompleted({
      kind: "final_exam",
      userId,
      percentage,
      passed,
    }).catch(() => {})

    return { success: true, score: correctCount, percentage, passed }
  } catch (error) {
    console.error("Error saving final exam result:", error)
    return { success: false, error: "Failed to save result" }
  }
}

// 現在ユーザーの修了テスト結果を取得
export async function getFinalExamResultsAction() {
  try {
    const userId = await getCurrentUserId()
    if (!userId) return []

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

// 現在ユーザーが修了テストに合格しているかチェック
export async function checkFinalExamPassedAction() {
  try {
    const userId = await getCurrentUserId()
    if (!userId) return false

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

    return data != null && data.length > 0
  } catch (error) {
    console.error("Error checking final exam passed:", error)
    return false
  }
}
