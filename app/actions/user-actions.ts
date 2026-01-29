"use server"

import { createAdminClient } from "@/lib/supabase/admin"

export async function loadUserDataFromServer(userId: string) {
  try {
    const supabase = await createAdminClient()

    // Fetch training sessions
    const { data: sessions, error: sessionsError } = await supabase
      .from("training_sessions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (sessionsError) {
      console.error("[v0] Error fetching training sessions:", sessionsError.message)
      return { success: false, error: sessionsError.message }
    }

    // Fetch user progress
    const { data: progress, error: progressError } = await supabase
      .from("user_training_progress")
      .select("*")
      .eq("user_id", userId)

    if (progressError) {
      console.error("[v0] Error fetching user progress:", progressError.message)
    }

    // Fetch test results
    const { data: tests, error: testsError } = await supabase
      .from("category_test_results")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (testsError) {
      console.error("[v0] Error fetching test results:", testsError.message)
    }

    console.log("[v0] Server: Fetched data - sessions:", sessions?.length || 0, "progress:", progress?.length || 0, "tests:", tests?.length || 0)

    return {
      success: true,
      sessions: sessions || [],
      progress: progress || [],
      tests: tests || [],
    }
  } catch (error) {
    console.error("[v0] Server: Exception loading user data:", error)
    return { success: false, error: String(error) }
  }
}
