import { createClient } from '@supabase/supabase-js'

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase環境変数が未設定です')
  return createClient(url, key)
}

export async function getTrainingSessions(userId: string) {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('training_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw new Error(`training_sessions取得エラー: ${error.message}`)
  return data ?? []
}

export async function getTrainingProgress(userId: string) {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('user_training_progress')
    .select('*')
    .eq('user_id', userId)
  if (error) throw new Error(`user_training_progress取得エラー: ${error.message}`)
  return data ?? []
}

export async function getCategoryTestResults(userId: string) {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('category_test_results')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw new Error(`category_test_results取得エラー: ${error.message}`)
  return data ?? []
}

export async function getFinalExamResults(userId: string) {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('final_exam_results')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false })
  if (error) throw new Error(`final_exam_results取得エラー: ${error.message}`)
  return data ?? []
}

export async function cleanupUserData(userId: string) {
  const supabase = getSupabaseAdmin()
  const userIdTables = [
    'training_sessions',
    'user_training_progress',
    'category_test_results',
    'final_exam_results',
  ]

  for (const table of userIdTables) {
    const { error } = await supabase.from(table).delete().eq('user_id', userId)
    if (error) {
      console.warn(`[cleanup] ${table} 削除警告: ${error.message}`)
    }
  }

  // profiles uses 'id' not 'user_id'
  const { error } = await supabase.from('profiles').delete().eq('id', userId)
  if (error) {
    console.warn(`[cleanup] profiles 削除警告: ${error.message}`)
  }
}

export async function verifyNoUserData(userId: string): Promise<boolean> {
  const supabase = getSupabaseAdmin()
  const userIdTables = [
    'training_sessions',
    'user_training_progress',
    'category_test_results',
    'final_exam_results',
  ]

  for (const table of userIdTables) {
    const { data } = await supabase
      .from(table)
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
    if (data && data.length > 0) return false
  }

  // profiles uses 'id' not 'user_id'
  const { data: profileData } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('id', userId)
  if (profileData && profileData.length > 0) return false

  return true
}


// --- 通知キャプチャ用ヘルパー ---

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3001'

export interface CapturedNotification {
  timestamp: string
  kind: string
  message: string
  payload: Record<string, unknown>
}

/** テスト用通知バッファをクリア */
export async function clearNotifications(): Promise<void> {
  await fetch(`${BASE_URL}/api/test/notifications`, { method: 'DELETE' })
}

/** 最近の通知を取得 */
export async function getNotifications(): Promise<CapturedNotification[]> {
  const res = await fetch(`${BASE_URL}/api/test/notifications`)
  const json = await res.json()
  return json.notifications ?? []
}

/** 指定kindの通知が届くまでポーリング（最大15秒） */
export async function waitForNotification(
  kind: string,
  maxAttempts = 15,
): Promise<CapturedNotification | null> {
  for (let i = 0; i < maxAttempts; i++) {
    const notifications = await getNotifications()
    const found = notifications.find((n) => n.kind === kind)
    if (found) return found
    await new Promise((r) => setTimeout(r, 1_000))
  }
  return null
}
