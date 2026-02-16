import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { getTrainingById, levelColors } from "@/lib/training-data"
import { getTrainingPrompt } from "@/lib/prompt-data"
import { PromptEditor } from "@/components/prompt-editor"
import { PasswordGate } from "@/components/password-gate"

interface PromptPageProps {
  params: Promise<{ id: string }>
}

export default async function PromptPage({ params }: PromptPageProps) {
  const { id } = await params
  const result = getTrainingById(Number(id))

  if (!result) {
    notFound()
  }

  const { training, category } = result
  const promptData = getTrainingPrompt(training.id)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="border-b border-border bg-gradient-to-b from-secondary/50 to-background py-8">
          <div className="mx-auto max-w-5xl px-4">
            <Link
              href={`/training/${training.id}`}
              className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              研修詳細に戻る
            </Link>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-lg font-bold">
                {String(training.id).padStart(2, "0")}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary" className={category.color + " text-white"}>
                    {category.id}. {category.name}
                  </Badge>
                  <Badge variant="secondary" className={levelColors[training.level]}>
                    {training.level}
                  </Badge>
                </div>
                <h1 className="text-2xl font-bold">{training.title}</h1>
                {training.subtitle && <p className="mt-1 text-muted-foreground">{training.subtitle}</p>}
              </div>
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="mx-auto max-w-5xl px-4">
            <PasswordGate
              title="プロンプト編集権限"
              description="プロンプト編集機能にアクセスするには、管理者アカウントでのGoogleログインが必要です"
            >
              <PromptEditor trainingId={training.id} initialPromptData={promptData} />
            </PasswordGate>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
