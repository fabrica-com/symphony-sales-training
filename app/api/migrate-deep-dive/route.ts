import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { deepDiveContent1 } from "@/lib/deep-dive-content"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: Request) {
  try {
    const { startId, endId } = await request.json()
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      db: { schema: "public" }
    })

    const start = startId || 1
    const end = endId || 10
    let migrated = 0

    for (const [idStr, content] of Object.entries(deepDiveContent1)) {
      const id = parseInt(idStr)
      if (id < start || id > end) continue

      const { error } = await supabase
        .from("deep_dive_contents")
        .upsert({
          training_id: id,
          title: content.title,
          subtitle: content.subtitle || null,
          introduction: content.introduction,
          sections: content.sections,
          conclusion: content.conclusion,
          reference_list: content.references || null,
        }, { onConflict: "training_id" })

      if (error) {
        console.error(`Error migrating deep dive ${id}:`, error)
        return NextResponse.json({ error: error.message, trainingId: id }, { status: 500 })
      }
      migrated++
    }

    return NextResponse.json({ success: true, migrated })
  } catch (error) {
    console.error("Deep dive migration error:", error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
