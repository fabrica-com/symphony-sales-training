// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "jsr:@supabase/supabase-js@2"

interface NotifyPayload {
  userName: string
  trainingTitle: string
  moodEmoji: string
  moodLabel: string
  reflectionText: string
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    })
  }

  // JWT 検証
  const authHeader = req.headers.get("Authorization")
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "Missing authorization header" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    })
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  })

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    })
  }

  let payload: NotifyPayload
  try {
    payload = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  const { userName, trainingTitle, moodEmoji, moodLabel, reflectionText } = payload

  const chatworkToken = Deno.env.get("CHATWORK_API_TOKEN")
  const chatworkRoomId = Deno.env.get("CHATWORK_ROOM_ID")

  const message = [
    `[研修完了通知]`,
    `ユーザー: ${userName}`,
    `研修: ${trainingTitle}`,
    `気分: ${moodEmoji} ${moodLabel}`,
    `振り返り: ${reflectionText}`,
  ].join("\n")

  if (!chatworkToken || !chatworkRoomId) {
    // API キー未設定時はログのみ（モック）
    console.log("[notify-chatwork] CHATWORK_API_TOKEN or CHATWORK_ROOM_ID not set. Mock log:")
    console.log(message)
    return new Response(JSON.stringify({ ok: true, mock: true }), {
      headers: { "Content-Type": "application/json" },
    })
  }

  const res = await fetch(`https://api.chatwork.com/v2/rooms/${chatworkRoomId}/messages`, {
    method: "POST",
    headers: {
      "x-chatworktoken": chatworkToken,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ body: message }),
  })

  if (!res.ok) {
    const errText = await res.text()
    console.error("[notify-chatwork] Chatwork API error:", res.status, errText)
    return new Response(JSON.stringify({ error: "Chatwork API error", detail: errText }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  })
})
