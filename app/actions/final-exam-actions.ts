"use server"

import { getFinalExamFromDb } from "@/lib/db/categories"
import { createClient } from "@/lib/supabase/server"
import { getCurrentUserId } from "@/lib/auth-server"
import { notifyChatworkTaskCompleted } from "@/lib/notify-chatwork"
import { log } from "@/lib/logger"

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
      log.security("UNAUTHORIZED_SAVE_FINAL_EXAM", {
        action: "saveFinalExamResultAction",
        reason: "no_authenticated_user",
      })
      return { success: false, error: "Unauthorized" }
    }

    log.info("SAVE_FINAL_EXAM_START", {
      userId,
      answerCount: payload.answers.length,
      duration: payload.duration,
    })

    const supabase = await createClient()

    const [{ data: config }, { data: questions }] = await Promise.all([
      supabase.from("final_exam_config").select("passing_score, total_questions").eq("id", 1).single(),
      supabase.from("final_exam_questions").select("question_number, correct_answer").order("question_number"),
    ])

    if (!config || !questions) {
      log.error("SAVE_FINAL_EXAM_DATA_NOT_FOUND", { userId })
      return { success: false, error: "Exam data not found" }
    }

    // サーバー側採点（クライアントの答えを信頼しない）
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
      log.error("SAVE_FINAL_EXAM_DB_ERROR", {
        userId,
        table: "final_exam_results",
        message: error.message,
        code: error.code,
      })
      return { success: false, error: error.message }
    }

    log.info("SAVE_FINAL_EXAM_SUCCESS", {
      userId,
      correctCount,
      total: config.total_questions,
      percentage,
      passed,
    })

    await notifyChatworkTaskCompleted({
      kind: "final_exam",
      userId,
      percentage,
      passed,
    }).catch((e) => log.error("CHATWORK_NOTIFY_ERROR", { userId, event: "final_exam", message: String(e) }))

    return { success: true, score: correctCount, percentage, passed }
  } catch (error) {
    log.error("SAVE_FINAL_EXAM_EXCEPTION", { message: String(error) })
    return { success: false, error: "Failed to save result" }
  }
}

// 現在ユーザーの修了テスト結果を取得
export async function getFinalExamResultsAction() {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      log.info("GET_FINAL_EXAM_RESULTS_NO_SESSION")
      return []
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from("final_exam_results")
      .select("*")
      .eq("user_id", userId)
      .order("completed_at", { ascending: false })

    if (error) {
      log.error("GET_FINAL_EXAM_RESULTS_ERROR", {
        userId,
        message: error.message,
        code: error.code,
      })
      return []
    }

    return data
  } catch (error) {
    log.error("GET_FINAL_EXAM_RESULTS_EXCEPTION", { message: String(error) })
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
      log.error("CHECK_FINAL_EXAM_PASSED_ERROR", {
        userId,
        message: error.message,
        code: error.code,
      })
      return false
    }

    return data != null && data.length > 0
  } catch (error) {
    log.error("CHECK_FINAL_EXAM_PASSED_EXCEPTION", { message: String(error) })
    return false
  }
}
