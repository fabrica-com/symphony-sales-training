"use server"

import { createClient } from "@/lib/supabase/server"
import { getCurrentUserId } from "@/lib/auth-server"
import { notifyChatworkTaskCompleted } from "@/lib/notify-chatwork"
import { clampScore } from "@/lib/score-calc"
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

    const supabase = await createClient()

    const validScore = clampScore(data.score, data.maxScore)

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

/**
 * テスト提出＋サーバー採点。ログイン済みなら DB 保存も行う。
 * 正解・解説は採点後にのみ返す（テスト中はクライアントに渡さない）。
 */
export async function submitAndGradeTestAction(data: {
  categoryId: string
  duration: number
  answers: number[]
}) {
  try {
    const userId = await getCurrentUserId()
    const supabase = await createClient()

    const { data: testConfig, error: configError } = await supabase
      .from("category_tests")
      .select("id, category_name, passing_score, total_questions")
      .eq("category_id", data.categoryId)
      .single()

    if (configError || !testConfig) {
      return { success: false, error: "Test config not found" }
    }

    const { data: questions, error: questionsError } = await supabase
      .from("category_test_questions")
      .select("question_number, correct_answer, question, options, explanation, source")
      .eq("category_test_id", testConfig.id)
      .order("question_number")

    if (questionsError || !questions) {
      return { success: false, error: "Questions not found" }
    }

    // サーバー側採点
    let correctCount = 0
    for (let i = 0; i < questions.length; i++) {
      if (data.answers[i] === questions[i].correct_answer) correctCount++
    }
    const percentage = Math.round((correctCount / testConfig.total_questions) * 100)
    const passed = percentage >= testConfig.passing_score
    const score = correctCount * 2

    // ログイン済みなら DB 保存
    let attemptNumber = 1
    if (userId) {
      const { data: prevResults } = await supabase
        .from("category_test_results")
        .select("id")
        .eq("user_id", userId)
        .eq("category_id", data.categoryId)

      attemptNumber = (prevResults?.length ?? 0) + 1

      const { error: insertError } = await supabase.from("category_test_results").insert({
        user_id: userId,
        category_id: data.categoryId,
        category_name: testConfig.category_name,
        score,
        percentage,
        passed,
        correct_count: correctCount,
        total_questions: testConfig.total_questions,
        duration_seconds: data.duration,
        attempt_number: attemptNumber,
      })

      if (insertError) {
        log.error("GRADE_TEST_DB_ERROR", {
          userId,
          categoryId: data.categoryId,
          message: insertError.message,
        })
      }

      // Chatwork 通知
      const { data: profile } = await supabase
        .from("profiles")
        .select("name")
        .eq("id", userId)
        .single()

      await notifyChatworkTaskCompleted({
        kind: "category_test",
        userId,
        categoryId: data.categoryId,
        categoryName: testConfig.category_name,
        percentage,
        passed,
        score,
        totalQuestions: testConfig.total_questions,
        userName: profile?.name ?? undefined,
      }).catch((e) => log.error("CHATWORK_NOTIFY_ERROR", { userId, event: "category_test", message: String(e) }))
    }

    return {
      success: true,
      score,
      percentage,
      passed,
      correctCount,
      incorrectCount: testConfig.total_questions - correctCount,
      attemptNumber,
      categoryName: testConfig.category_name,
      questionResults: questions.map((q, i) => ({
        question: q.question,
        options: q.options as string[],
        source: q.source,
        userAnswer: data.answers[i] ?? -1,
        correctAnswer: q.correct_answer,
        isCorrect: data.answers[i] === q.correct_answer,
        explanation: q.explanation,
      })),
    }
  } catch (error) {
    log.error("GRADE_TEST_EXCEPTION", {
      categoryId: data.categoryId,
      message: String(error),
    })
    return { success: false, error: String(error) }
  }
}
