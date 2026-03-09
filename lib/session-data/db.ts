import { createClient } from "@/lib/supabase/server"
import type { SessionContent } from "./types"

// DBの行データをSessionContent型に変換
function mapRowToSessionContent(row: Record<string, unknown>): SessionContent {
  return {
    trainingId: row.training_id as number,
    title: row.title as string,
    keyPhrase: row.key_phrase as string,
    badge: row.badge as SessionContent["badge"],
    moodOptions: row.mood_options as SessionContent["moodOptions"],
    reviewQuiz: row.review_quiz as SessionContent["reviewQuiz"],
    story: row.story as SessionContent["story"],
    infographic: row.infographic as SessionContent["infographic"],
    quickCheck: row.quick_check as SessionContent["quickCheck"],
    quote: row.quote as SessionContent["quote"],
  simulation: row.simulation as SessionContent["simulation"],
  roleplay: row.roleplay as SessionContent["roleplay"],
  reflection: row.reflection as SessionContent["reflection"],
  actionOptions: row.action_options as SessionContent["actionOptions"],
  work: row.work as SessionContent["work"],
  deepDive: row.deep_dive as SessionContent["deepDive"],
  }
}

// Supabaseからセッションコンテンツを取得
export async function getSessionContentFromDB(trainingId: number): Promise<SessionContent | null> {
  const supabase = await createClient()
  
  
  const { data, error } = await supabase
    .from("session_contents")
    .select("*")
    .eq("training_id", trainingId)
    .single()


  if (error || !data) {
    console.error(`Failed to fetch session content for training ${trainingId}:`, error)
    return null
  }

  return mapRowToSessionContent(data)
}

// 複数のセッションコンテンツを一括取得
export async function getSessionContentsFromDB(trainingIds: number[]): Promise<Map<number, SessionContent>> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("session_contents")
    .select("*")
    .in("training_id", trainingIds)

  const result = new Map<number, SessionContent>()
  
  if (error || !data) {
    console.error("Failed to fetch session contents:", error)
    return result
  }

  for (const row of data) {
    result.set(row.training_id as number, mapRowToSessionContent(row))
  }

  return result
}

// 全セッションコンテンツの存在確認
export async function checkSessionContentsExist(): Promise<{ total: number; ids: number[] }> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("session_contents")
    .select("training_id")
    .order("training_id")

  if (error || !data) {
    return { total: 0, ids: [] }
  }

  return { 
    total: data.length, 
    ids: data.map(row => row.training_id) 
  }
}
