"use server"

import { createAdminClient } from "@/lib/supabase/admin"

export async function saveTrainingSession(data: {
  userId: string
  odaiNumber: number
  trainingTitle: string
  categoryId: string
  categoryName: string
  score: number
  maxScore: number // Accept maxScore from caller
  duration: number
  attemptNumber: number
}) {
  try {
    const supabase = await createAdminClient()
    
    // Validate score: if undefined or NaN, use 0
    const scoreValue = data.score ?? 0
    const isValidScore = !isNaN(scoreValue) && isFinite(scoreValue)
    const finalScore = isValidScore ? scoreValue : 0
    
    // Ensure overall_score is within valid range (0 to maxScore)
    const validScore = Math.min(data.maxScore, Math.max(0, Math.round(finalScore)))
    
    console.log("[v0] saveTrainingSession - userId:", data.userId)
    console.log("[v0] saveTrainingSession - score:", data.score, "validated:", validScore)
    console.log("[v0] saveTrainingSession - maxScore:", data.maxScore)
    
    const { error: sessionError } = await supabase.from("training_sessions").insert({
      user_id: data.userId,
      training_id: data.odaiNumber,
      category_id: data.categoryId,
      training_title: data.trainingTitle,
      attempt_number: data.attemptNumber,
      duration_seconds: data.duration,
      overall_score: validScore,
      max_score: data.maxScore, // Use actual maxScore (should be 200)
      completed_at: new Date().toISOString(),
      category_name: data.categoryName,
    })
    
    if (sessionError) {
      console.error("[v0] Server: Error saving training session:", sessionError.message)
      return { success: false, error: sessionError.message }
    }
    
    // Update progress
    const { error: progressError } = await supabase.from("user_training_progress").upsert({
      user_id: data.userId,
      training_id: data.odaiNumber,
      category_id: data.categoryId,
      status: "completed",
      completed_at: new Date().toISOString(),
    }, { onConflict: "user_id,training_id" })
    
    if (progressError) {
      console.error("[v0] Server: Error saving user progress:", progressError.message)
    }
    
    console.log("[v0] Server: Training session saved successfully")
    return { success: true }
  } catch (error) {
    console.error("[v0] Server: Exception saving training session:", error)
    return { success: false, error: String(error) }
  }
}

export async function saveTestResult(data: {
  userId: string
  categoryId: string
  categoryName: string
  score: number
  percentage: number
  passed: boolean
  correctCount: number
  totalQuestions: number
  duration: number
  attemptNumber: number
}) {
  try {
    const supabase = await createAdminClient()
    
    const { error } = await supabase.from("category_test_results").insert({
      user_id: data.userId,
      category_id: data.categoryId,
      category_name: data.categoryName,
      score: data.score,
      percentage: data.percentage,
      passed: data.passed,
      correct_count: data.correctCount,
      total_questions: data.totalQuestions,
      duration: data.duration,
      attempt_number: data.attemptNumber,
    })
    
    if (error) {
      console.error("[v0] Server: Error saving test result:", error.message)
      return { success: false, error: error.message }
    }
    
    console.log("[v0] Server: Test result saved successfully")
    return { success: true }
  } catch (error) {
    console.error("[v0] Server: Exception saving test result:", error)
    return { success: false, error: String(error) }
  }
}
