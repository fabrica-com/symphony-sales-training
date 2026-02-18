"use server"

import { createClient } from "@/lib/supabase/server"
import { getCurrentUserId } from "@/lib/auth-server"
import { notifyChatworkTaskCompleted } from "@/lib/notify-chatwork"

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
      return { success: false, error: "Unauthorized" }
    }

    const supabase = await createClient()

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
      console.error("[v0] Server: Error saving training session:", sessionError.message)
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
      console.error("[v0] Server: Error saving user progress:", progressError.message)
    }

    // Chatwork 通知（Server Action から直接 Chatwork API を呼ぶ）
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
    }).catch((e) => console.error("[notify-chatwork] error:", e))

    return { success: true }
  } catch (error) {
    console.error("[v0] Server: Exception saving training session:", error)
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
      return { success: false, error: "Unauthorized" }
    }

    const supabase = await createClient()

    // カテゴリテスト設定（passing_score, total_questions）をサーバーで取得
    const { data: testConfig, error: configError } = await supabase
      .from("category_tests")
      .select("id, category_name, passing_score, total_questions")
      .eq("category_id", data.categoryId)
      .single()

    if (configError || !testConfig) {
      console.error("[v0] Server: Error fetching test config:", configError?.message)
      return { success: false, error: "Test config not found" }
    }

    // 正解をサーバーで取得してサーバー側で採点
    const { data: questions, error: questionsError } = await supabase
      .from("category_test_questions")
      .select("question_number, correct_answer")
      .eq("category_test_id", testConfig.id)
      .order("question_number")

    if (questionsError || !questions) {
      console.error("[v0] Server: Error fetching questions:", questionsError?.message)
      return { success: false, error: "Questions not found" }
    }

    let correctCount = 0
    for (let i = 0; i < questions.length; i++) {
      if (data.answers[i] === questions[i].correct_answer) correctCount++
    }
    const percentage = Math.round((correctCount / testConfig.total_questions) * 100)
    const passed = percentage >= testConfig.passing_score
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
      console.error("[v0] Server: Error saving test result:", error.message)
      return { success: false, error: error.message }
    }

    await notifyChatworkTaskCompleted({
      kind: "category_test",
      userId,
      categoryId: data.categoryId,
      categoryName: testConfig.category_name,
      percentage,
      passed,
    }).catch(() => {})

    return { success: true, score, percentage, passed, correctCount }
  } catch (error) {
    console.error("[v0] Server: Exception saving test result:", error)
    return { success: false, error: String(error) }
  }
}
