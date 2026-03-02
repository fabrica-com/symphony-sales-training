import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Clock, BookOpen, Sparkles, FileCheck } from "lucide-react"
import { Footer } from "@/components/footer"
import { TrainingItem } from "@/components/training-item"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getCategoryByIdFromDb, getCategoryTestFromDb } from "@/lib/db/categories"
import Header from "@/components/header"

interface CategoryPageProps {
  params: Promise<{ id: string }>
}

// Disable static generation for this dynamic route
// since category data comes from the database at request time
export const dynamic = "force-dynamic"

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = await params
  const category = await getCategoryByIdFromDb(id)
  const categoryTest = await getCategoryTestFromDb(id)

  if (!category) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="border-b border-border bg-linear-to-b from-secondary/50 to-background py-12">
          <div className="mx-auto max-w-4xl px-4">
            <Link
              href="/"
              className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              カリキュラム一覧に戻る
            </Link>

            <div className="flex items-start gap-4">
              <div className={`flex h-16 w-16 items-center justify-center rounded-xl ${category.color} text-white`}>
                <span className="text-2xl font-bold">{category.id}</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold">{category.name}</h1>
                <p className="mt-2 text-muted-foreground">{category.description}</p>
                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <Badge variant="secondary" className="text-sm">
                    <BookOpen className="mr-1 h-4 w-4" />
                    {category.trainings.length}本
                  </Badge>
                  <Badge variant="secondary" className="text-sm">
                    <Clock className="mr-1 h-4 w-4" />
                    {category.totalDuration}分
                  </Badge>
                  <Badge variant="outline" className="text-sm">
                    対象: {category.targetLevel}
                  </Badge>
                  {categoryTest && (
                    <Button asChild size="sm" className="ml-auto bg-green-600 hover:bg-green-700">
                      <Link href={`/category/${category.id}/test`}>
                        <FileCheck className="mr-2 h-4 w-4" />
                        総合テスト ({categoryTest.totalQuestions}問)
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="mx-auto max-w-4xl px-4">
            <h2 className="mb-6 text-xl font-semibold">研修一覧</h2>
            <div className="space-y-3">
              {category.trainings.map((training) => (
                <TrainingItem key={training.id} training={training} categoryId={category.id} />
              ))}
            </div>

            {/* Deep Dive: このカテゴリに deep_dive_contents がある場合のみ表示 */}
            {category.hasDeepDive && (
              <div className="mt-10 rounded-xl border-2 border-amber-400 bg-linear-to-r from-amber-50 to-orange-50 p-6 shadow-lg">
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 text-white">
                      <Sparkles className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-amber-900">この章をより深く理解したい方へ</h3>
                      <p className="text-sm text-amber-700">専門的に解説する読み物でさらに学べます</p>
                    </div>
                  </div>
                  <Button asChild size="lg" className="w-full bg-amber-500 text-white hover:bg-amber-600 sm:w-auto">
                    <Link href={`/category/${category.id}/deep-dive`}>
                      <BookOpen className="mr-2 h-5 w-5" />
                      この章をより深掘りする
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
