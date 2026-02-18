import { createClient } from "@/lib/supabase/server"

/**
 * サーバー側で現在ログインしているユーザーIDを取得する。
 * Server Actions で進捗保存などを行う際、クライアント渡しの userId を使わず
 * この関数で取得した ID のみを使用すること。
 * @returns 認証済みなら user.id、未ログインなら null
 */
export async function getCurrentUserId(): Promise<string | null> {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) return null
  return user.id
}
