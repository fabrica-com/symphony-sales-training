"use server"

import { createClient } from "@/lib/supabase/server"
import { getCurrentUserId } from "@/lib/auth-server"

/** 現在ログインしているユーザーの進捗データのみを取得（サーバーで認証ユーザーを確定） */
export async function loadUserDataFromServer() {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return {
        success: true,
        sessions: [],
        progress: [],
        tests: [],
      }
    }

    const supabase = await createClient()

    const { data: sessions, error: sessionsError } = await supabase
      .from("training_sessions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (sessionsError) {
      console.error("[v0] Error fetching training sessions:", sessionsError.message)
      return { success: false, error: sessionsError.message }
    }

    const { data: progress, error: progressError } = await supabase
      .from("user_training_progress")
      .select("*")
      .eq("user_id", userId)

    if (progressError) {
      console.error("[v0] Error fetching user progress:", progressError.message)
    }

    const { data: tests, error: testsError } = await supabase
      .from("category_test_results")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (testsError) {
      console.error("[v0] Error fetching test results:", testsError.message)
    }

    return {
      success: true,
      sessions: sessions ?? [],
      progress: progress ?? [],
      tests: tests ?? [],
    }
  } catch (error) {
    console.error("[v0] Server: Exception loading user data:", error)
    return { success: false, error: String(error) }
  }
}
