"use server"

import { getFinalExamFromDb } from "@/lib/db/categories"
import { createClient } from "@/lib/supabase/server"
import { getCurrentUserId } from "@/lib/auth-server"
import { notifyChatworkTaskCompleted } from "@/lib/notify-chatwork"
import { gradeAnswers } from "@/lib/grading"
import { log } from "@/lib/logger"

export interface FinalExamResultPayload {
  answers: number[]
  duration: number
}

// 修了テストデータを取得（correctAnswer / explanation はクライアントに送らない）
export async function getFinalExamAction() {
  const full = await getFinalExamFromDb()
  if (!full) return null

  return {
    totalQuestions: full.totalQuestions,
    passingScore: full.passingScore,
    timeLimit: full.timeLimit,
    questions: full.questions.map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options,
      source: q.source,
      difficulty: q.difficulty,
    })),
  }
}

// サーバー側で採点し、結果と解説を返す
export async function submitAndGradeFinalExamAction(payload: FinalExamResultPayload) {
  try {
    const userId = await getCurrentUserId()

    const supabase = await createClient()

    const [{ data: config }, { data: questions }] = await Promise.all([
      supabase.from("final_exam_config").select("passing_score, total_questions, time_limit").eq("id", 1).single(),
      supabase.from("final_exam_questions").select("question_number, correct_answer, explanation, question, options, source").order("question_number"),
    ])

    if (!config || !questions) {
      return { success: false as const, error: "Exam data not found" }
    }

    const { correctCount, percentage, passed } = gradeAnswers({
      answers: payload.answers,
      correctAnswers: questions.map((q) => q.correct_answer),
      totalQuestions: config.total_questions,
      passingScore: config.passing_score,
    })

    const graded = questions.map((q, i) => ({
      id: q.question_number,
      question: q.question,
      options: q.options as string[],
      source: q.source,
      correctAnswer: q.correct_answer,
      explanation: q.explanation,
      userAnswer: payload.answers[i] ?? -1,
      isCorrect: payload.answers[i] === q.correct_answer,
    }))

    // ログイン済みなら結果を保存
    if (userId) {
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
        return {
          success: true as const,
          saved: false,
          saveError: error.message,
          score: correctCount,
          percentage,
          passed,
          totalQuestions: config.total_questions,
          questions: graded,
        }
      }

      log.info("SAVE_FINAL_EXAM_SUCCESS", { userId, correctCount, total: config.total_questions, percentage, passed })

      const { data: profile } = await supabase.from("profiles").select("name").eq("id", userId).single()
      await notifyChatworkTaskCompleted({
        kind: "final_exam",
        userId,
        percentage,
        passed,
        score: correctCount,
        totalQuestions: config.total_questions,
        userName: profile?.name ?? undefined,
      }).catch((e) => log.error("CHATWORK_NOTIFY_ERROR", { userId, event: "final_exam", message: String(e) }))
    }

    return {
      success: true as const,
      saved: userId ? true : false,
      score: correctCount,
      percentage,
      passed,
      totalQuestions: config.total_questions,
      questions: graded,
    }
  } catch (error) {
    log.error("SUBMIT_FINAL_EXAM_EXCEPTION", { message: String(error) })
    return { success: false as const, error: "Failed to grade exam" }
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
