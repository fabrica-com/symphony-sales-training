"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { getCurrentUserId } from "@/lib/auth-server"
import { notifyChatworkTaskCompleted } from "@/lib/notify-chatwork"
import { log } from "@/lib/logger"

export async function saveTrainingSession(data: {
  odaiNumber: number
  trainingTitle: string
  categoryId: string
  categoryName: string
  score: number
  maxScore: number
  duration: number
  attemptNumber: number
  moodEmoji?: string
  moodLabel?: string
  reflectionText?: string
  workAnswers?: { label: string; value: string }[]
}) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      log.security("UNAUTHORIZED_SAVE_TRAINING_SESSION", {
        action: "saveTrainingSession",
        odaiNumber: data.odaiNumber,
        reason: "no_authenticated_user",
      })
      return { success: false, error: "Unauthorized" }
    }

    log.info("SAVE_TRAINING_SESSION_START", {
      userId,
      odaiNumber: data.odaiNumber,
      trainingTitle: data.trainingTitle,
      score: data.score,
      maxScore: data.maxScore,
      attemptNumber: data.attemptNumber,
    })

    const supabase = await createAdminClient()

    const scoreValue = data.score ?? 0
    const isValidScore = !isNaN(scoreValue) && isFinite(scoreValue)
    const finalScore = isValidScore ? scoreValue : 0
    const validScore = Math.min(data.maxScore, Math.max(0, Math.round(finalScore)))

    const { error: sessionError } = await supabase.from("training_sessions").insert({
      user_id: userId,
      training_id: data.odaiNumber,
      category_id: data.categoryId,
      training_title: data.trainingTitle,
      attempt_number: data.attemptNumber,
      duration_seconds: data.duration,
      overall_score: validScore,
      max_score: data.maxScore,
      completed_at: new Date().toISOString(),
      category_name: data.categoryName,
    })

    if (sessionError) {
      log.error("SAVE_TRAINING_SESSION_DB_ERROR", {
        userId,
        odaiNumber: data.odaiNumber,
        table: "training_sessions",
        message: sessionError.message,
        code: sessionError.code,
      })
      return { success: false, error: sessionError.message }
    }

    const { error: progressError } = await supabase.from("user_training_progress").upsert({
      user_id: userId,
      training_id: data.odaiNumber,
      category_id: data.categoryId,
      status: "completed",
      completed_at: new Date().toISOString(),
    }, { onConflict: "user_id,training_id" })

    if (progressError) {
      log.error("SAVE_USER_PROGRESS_DB_ERROR", {
        userId,
        trainingId: data.odaiNumber,
        table: "user_training_progress",
        message: progressError.message,
        code: progressError.code,
      })
    }

    log.info("SAVE_TRAINING_SESSION_SUCCESS", {
      userId,
      odaiNumber: data.odaiNumber,
      validScore,
      maxScore: data.maxScore,
    })

    // Chatwork 通知
    const { data: profile } = await supabase
      .from("profiles")
      .select("name")
      .eq("id", userId)
      .single()

    await notifyChatworkTaskCompleted({
      kind: "training",
      userId,
      trainingId: data.odaiNumber,
      trainingTitle: data.trainingTitle,
      categoryName: data.categoryName,
      score: validScore,
      maxScore: data.maxScore,
      userName: profile?.name ?? undefined,
      moodEmoji: data.moodEmoji,
      moodLabel: data.moodLabel,
      reflectionText: data.reflectionText,
      workAnswers: data.workAnswers,
    }).catch((e) => log.error("CHATWORK_NOTIFY_ERROR", { userId, event: "training", message: String(e) }))

    return { success: true }
  } catch (error) {
    log.error("SAVE_TRAINING_SESSION_EXCEPTION", {
      odaiNumber: data.odaiNumber,
      message: String(error),
    })
    return { success: false, error: String(error) }
  }
}

export async function saveTestResult(data: {
  categoryId: string
  duration: number
  attemptNumber: number
  answers: number[]
}) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      log.security("UNAUTHORIZED_SAVE_TEST_RESULT", {
        action: "saveTestResult",
        categoryId: data.categoryId,
        reason: "no_authenticated_user",
      })
      return { success: false, error: "Unauthorized" }
    }

    log.info("SAVE_TEST_RESULT_START", {
      userId,
      categoryId: data.categoryId,
      attemptNumber: data.attemptNumber,
      answerCount: data.answers.length,
    })

    const supabase = await createAdminClient()

    const { data: testConfig, error: configError } = await supabase
      .from("category_tests")
      .select("id, category_name, passing_score, total_questions")
      .eq("category_id", data.categoryId)
      .single()

    if (configError || !testConfig) {
      log.error("SAVE_TEST_RESULT_CONFIG_ERROR", {
        userId,
        categoryId: data.categoryId,
        message: configError?.message,
      })
      return { success: false, error: "Test config not found" }
    }

    const { data: questions, error: questionsError } = await supabase
      .from("category_test_questions")
      .select("question_number, correct_answer")
      .eq("category_test_id", testConfig.id)
      .order("question_number")

    if (questionsError || !questions) {
      log.error("SAVE_TEST_RESULT_QUESTIONS_ERROR", {
        userId,
        categoryId: data.categoryId,
        testConfigId: testConfig.id,
        message: questionsError?.message,
      })
      return { success: false, error: "Questions not found" }
    }

    // サーバー側採点（クライアントの答えを信頼しない）
    let correctCount = 0
    for (let i = 0; i < questions.length; i++) {
      if (data.answers[i] === questions[i].correct_answer) correctCount++
    }
    const percentage = Math.round((correctCount / testConfig.total_questions) * 100)
    const passed = percentage >= testConfig.passing_score
    // NOTE: 1問2pt 固定。将来的に category_test_questions.points カラムで動的化予定
    const score = correctCount * 2

    const { error } = await supabase.from("category_test_results").insert({
      user_id: userId,
      category_id: data.categoryId,
      category_name: testConfig.category_name,
      score,
      percentage,
      passed,
      correct_count: correctCount,
      total_questions: testConfig.total_questions,
      duration: data.duration,
      attempt_number: data.attemptNumber,
    })

    if (error) {
      log.error("SAVE_TEST_RESULT_DB_ERROR", {
        userId,
        categoryId: data.categoryId,
        table: "category_test_results",
        message: error.message,
        code: error.code,
      })
      return { success: false, error: error.message }
    }

    log.info("SAVE_TEST_RESULT_SUCCESS", {
      userId,
      categoryId: data.categoryId,
      correctCount,
      total: testConfig.total_questions,
      percentage,
      passed,
    })

    await notifyChatworkTaskCompleted({
      kind: "category_test",
      userId,
      categoryId: data.categoryId,
      categoryName: testConfig.category_name,
      percentage,
      passed,
    }).catch((e) => log.error("CHATWORK_NOTIFY_ERROR", { userId, event: "category_test", message: String(e) }))

    return { success: true, score, percentage, passed, correctCount }
  } catch (error) {
    log.error("SAVE_TEST_RESULT_EXCEPTION", {
      categoryId: data.categoryId,
      message: String(error),
    })
    return { success: false, error: String(error) }
  }
}
