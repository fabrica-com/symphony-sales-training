"use server"

import { createAdminClient } from "@/lib/supabase/admin"

// 全ユーザー一覧を取得
export async function getAllUsers() {
  try {
    const supabase = await createAdminClient()
    
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
    
    if (error) {
      console.error("[Admin] Error fetching users:", error.message)
      return { success: false, error: error.message, users: [] }
    }
    
    return { success: true, users: profiles || [] }
  } catch (error) {
    console.error("[Admin] Exception fetching users:", error)
    return { success: false, error: String(error), users: [] }
  }
}

// ユーザーのロールを更新
export async function updateUserRole(userId: string, role: "employee" | "manager" | "admin") {
  try {
    const supabase = await createAdminClient()
    
    const { error } = await supabase
      .from("profiles")
      .update({ role })
      .eq("id", userId)
    
    if (error) {
      console.error("[Admin] Error updating user role:", error.message)
      return { success: false, error: error.message }
    }
    
    return { success: true }
  } catch (error) {
    console.error("[Admin] Exception updating user role:", error)
    return { success: false, error: String(error) }
  }
}

// 通知設定を更新（簡易版：profilesテーブルのdepartmentカラムを一時的に使用）
// 本来はchatwork_room_idなどの専用カラムを追加すべき
export async function updateNotificationSettings(userId: string, chatworkRoomId: string) {
  try {
    const supabase = await createAdminClient()
    
    // 簡易版：departmentカラムに保存（本来は専用カラムを作成すべき）
    // または、別途notification_settingsテーブルを作成
    const { error } = await supabase
      .from("profiles")
      .update({ department: chatworkRoomId }) // 一時的な実装
      .eq("id", userId)
    
    if (error) {
      console.error("[Admin] Error updating notification settings:", error.message)
      return { success: false, error: error.message }
    }
    
    return { success: true }
  } catch (error) {
    console.error("[Admin] Exception updating notification settings:", error)
    return { success: false, error: String(error) }
  }
}

// 全ユーザーの進捗データを取得
export async function getAllUsersProgress() {
  try {
    const supabase = await createAdminClient()
    
    // ユーザー一覧を取得
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, name, email, role")
      .order("created_at", { ascending: false })
    
    if (profilesError) {
      console.error("[Admin] Error fetching profiles:", profilesError.message)
      return { success: false, error: profilesError.message, progress: [] }
    }
    
    // 各ユーザーの進捗データを取得
    const progressData = await Promise.all(
      (profiles || []).map(async (profile) => {
        // トレーニングセッション数
        const { data: sessions, error: sessionsError } = await supabase
          .from("training_sessions")
          .select("id")
          .eq("user_id", profile.id)
        
        const sessionCount = sessionsError ? 0 : (sessions?.length || 0)
        
        // 完了したトレーニング数
        const { data: completed, error: completedError } = await supabase
          .from("user_training_progress")
          .select("id")
          .eq("user_id", profile.id)
          .eq("status", "completed")
        
        const completedCount = completedError ? 0 : (completed?.length || 0)
        
        // 総合テスト結果
        const { data: tests, error: testsError } = await supabase
          .from("category_test_results")
          .select("id, passed")
          .eq("user_id", profile.id)
        
        const testCount = testsError ? 0 : (tests?.length || 0)
        const passedTests = testsError ? 0 : (tests?.filter((t: any) => t.passed).length || 0)
        
        // 最新のセッション
        const { data: latestSession } = await supabase
          .from("training_sessions")
          .select("completed_at")
          .eq("user_id", profile.id)
          .order("completed_at", { ascending: false })
          .limit(1)
          .single()
        
        return {
          userId: profile.id,
          name: profile.name || profile.email || "未設定",
          email: profile.email || "",
          role: profile.role || "employee",
          sessionCount,
          completedCount,
          testCount,
          passedTests,
          lastActivity: latestSession?.completed_at || null,
        }
      })
    )
    
    return { success: true, progress: progressData }
  } catch (error) {
    console.error("[Admin] Exception fetching progress:", error)
    return { success: false, error: String(error), progress: [] }
  }
}

