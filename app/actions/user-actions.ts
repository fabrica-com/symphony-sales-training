"use server"

import { createClient } from "@/lib/supabase/server"
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

    const supabase = await createClient()

    const [sessionsResult, progressResult, testsResult] = await Promise.all([
      supabase
        .from("training_sessions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
      supabase
        .from("user_training_progress")
        .select("*")
        .eq("user_id", userId),
      supabase
        .from("category_test_results")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
    ])

    if (sessionsResult.error) {
      log.error("LOAD_USER_DATA_SESSIONS_ERROR", {
        userId,
        table: "training_sessions",
        message: sessionsResult.error.message,
        code: sessionsResult.error.code,
      })
      return { success: false, error: sessionsResult.error.message }
    }

    if (progressResult.error) {
      log.error("LOAD_USER_DATA_PROGRESS_ERROR", {
        userId,
        table: "user_training_progress",
        message: progressResult.error.message,
        code: progressResult.error.code,
      })
    }

    if (testsResult.error) {
      log.error("LOAD_USER_DATA_TESTS_ERROR", {
        userId,
        table: "category_test_results",
        message: testsResult.error.message,
        code: testsResult.error.code,
      })
    }

    log.info("LOAD_USER_DATA_SUCCESS", {
      userId,
      sessionCount: sessionsResult.data?.length ?? 0,
      progressCount: progressResult.data?.length ?? 0,
      testCount: testsResult.data?.length ?? 0,
    })

    return {
      success: true,
      sessions: sessionsResult.data ?? [],
      progress: progressResult.data ?? [],
      tests: testsResult.data ?? [],
    }
  } catch (error) {
    log.error("LOAD_USER_DATA_EXCEPTION", { message: String(error) })
    return { success: false, error: String(error) }
  }
}
