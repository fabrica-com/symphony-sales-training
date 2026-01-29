import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { categories, trainings, getTrainingsByCategory } from "@/lib/training-data"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: Request) {
  try {
    const { type, startId, endId } = await request.json()
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      db: { schema: "public" }
    })

    if (type === "categories") {
      // Migrate categories
      let order = 0
      for (const [id, cat] of Object.entries(categories)) {
        const { error } = await supabase
          .from("training_categories")
          .upsert({
            id,
            name: cat.name,
            description: cat.description,
            total_duration: cat.totalDuration,
            target_level: cat.targetLevel,
            color: cat.color,
            display_order: order++,
          }, { onConflict: "id" })
        
        if (error) {
          console.error(`Error migrating category ${id}:`, error)
          return NextResponse.json({ error: error.message }, { status: 500 })
        }
      }
      return NextResponse.json({ success: true, message: "Categories migrated" })
    }

    if (type === "trainings") {
      // Migrate trainings in batches
      const start = startId || 1
      const end = endId || 130
      let migrated = 0

      for (const training of trainings) {
        if (training.id < start || training.id > end) continue

        const { error } = await supabase
          .from("trainings")
          .upsert({
            id: training.id,
            category_id: training.category,
            title: training.title,
            subtitle: training.subtitle || null,
            duration: training.duration,
            level: training.level,
            detail: training.detail || null,
            display_order: training.id,
          }, { onConflict: "id" })

        if (error) {
          console.error(`Error migrating training ${training.id}:`, error)
          return NextResponse.json({ error: error.message, trainingId: training.id }, { status: 500 })
        }
        migrated++
      }
      return NextResponse.json({ success: true, migrated })
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 })
  } catch (error) {
    console.error("Migration error:", error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
