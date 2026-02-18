import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, BookOpen } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getCategoryByIdFromDb, getCategoryDeepDiveFromDb } from "@/lib/db/categories"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function CategoryDeepDivePage({ params }: PageProps) {
  const { id } = await params
  const category = await getCategoryByIdFromDb(id)

  if (!category) notFound()
  if (!category.hasDeepDive) notFound()

  // カテゴリ単位の深掘り（DB の category_deep_dive_contents）があれば表示
  const categoryDeepDive = await getCategoryDeepDiveFromDb(id)
  if (categoryDeepDive) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1" dangerouslySetInnerHTML={{ __html: categoryDeepDive.bodyHtml }} />
        <Footer />
      </div>
    )
  }

  const trainingIds = category.trainings.map((t) => t.id)
  const supabase = await createClient()
  const { data: withDeepDive } = await supabase
    .from("deep_dive_contents")
    .select("training_id")
    .in("training_id", trainingIds)

  const deepDiveTrainingIds = new Set((withDeepDive ?? []).map((r) => r.training_id))
  const trainingsWithDeepDive = category.trainings.filter((t) => deepDiveTrainingIds.has(t.id))

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="border-b border-border bg-gradient-to-b from-amber-50 to-background py-12">
          <div className="mx-auto max-w-4xl px-4">
            <Link
              href={`/category/${category.id}`}
              className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {category.name}に戻る
            </Link>

            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-amber-500 text-white">
                <BookOpen className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">この章の深掘り読み物</h1>
                <p className="mt-2 text-muted-foreground">
                  {category.name}の研修に対応した深掘りコンテンツ一覧
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="mx-auto max-w-4xl px-4">
            <ul className="space-y-3">
              {trainingsWithDeepDive.map((training) => (
                <li key={training.id}>
                  <Link
                    href={`/training/${training.id}/deep-dive`}
                    className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 hover:border-amber-500 hover:bg-amber-50/50 transition-colors"
                  >
                    <span className="text-sm font-medium text-muted-foreground">#{String(training.id).padStart(2, "0")}</span>
                    <span className="font-medium">{training.title}</span>
                    <BookOpen className="ml-auto h-4 w-4 text-amber-500" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
