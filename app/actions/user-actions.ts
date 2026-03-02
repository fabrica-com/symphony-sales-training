"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { getCurrentUserId } from "@/lib/auth-server"
import { log } from "@/lib/logger"

/** 現在ログインしているユーザーの進捗データのみを取得（サーバーで認証ユーザーを確定） */
export async function loadUserDataFromServer() {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      log.info("LOAD_USER_DATA_NO_SESSION", { reason: "no_authenticated_user" })
      return {
        success: true,
        sessions: [],
        progress: [],
        tests: [],
      }
    }

    log.info("LOAD_USER_DATA_START", { userId })

    const supabase = await createAdminClient()

    const { data: sessions, error: sessionsError } = await supabase
      .from("training_sessions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (sessionsError) {
      log.error("LOAD_USER_DATA_SESSIONS_ERROR", {
        userId,
        table: "training_sessions",
        message: sessionsError.message,
        code: sessionsError.code,
      })
      return { success: false, error: sessionsError.message }
    }

    const { data: progress, error: progressError } = await supabase
      .from("user_training_progress")
      .select("*")
      .eq("user_id", userId)

    if (progressError) {
      log.error("LOAD_USER_DATA_PROGRESS_ERROR", {
        userId,
        table: "user_training_progress",
        message: progressError.message,
        code: progressError.code,
      })
    }

    const { data: tests, error: testsError } = await supabase
      .from("category_test_results")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (testsError) {
      log.error("LOAD_USER_DATA_TESTS_ERROR", {
        userId,
        table: "category_test_results",
        message: testsError.message,
        code: testsError.code,
      })
    }

    log.info("LOAD_USER_DATA_SUCCESS", {
      userId,
      sessionCount: sessions?.length ?? 0,
      progressCount: progress?.length ?? 0,
      testCount: tests?.length ?? 0,
    })

    return {
      success: true,
      sessions: sessions ?? [],
      progress: progress ?? [],
      tests: tests ?? [],
    }
  } catch (error) {
    log.error("LOAD_USER_DATA_EXCEPTION", { message: String(error) })
    return { success: false, error: String(error) }
  }
}
