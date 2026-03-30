"use server"

import { createClient } from "@/lib/supabase/server"
import { getCurrentUserId } from "@/lib/auth-server"

export async function markDeepDiveRead(trainingId: number) {
  const userId = await getCurrentUserId()
  if (!userId) return { success: false, error: "Unauthorized" }

  const supabase = await createClient()
  const { error } = await supabase
    .from("user_deep_dive_reads")
    .upsert(
      { user_id: userId, training_id: trainingId },
      { onConflict: "user_id,training_id" },
    )

  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function hasReadDeepDive(trainingId: number): Promise<boolean> {
  const userId = await getCurrentUserId()
  if (!userId) return false

  const supabase = await createClient()
  const { data } = await supabase
    .from("user_deep_dive_reads")
    .select("id")
    .eq("user_id", userId)
    .eq("training_id", trainingId)
    .maybeSingle()

  return !!data
}
