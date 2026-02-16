import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Construction } from "lucide-react"
import { getTrainingByIdFromDb, getDeepDiveContentFromDb } from "@/lib/db/categories"
import { getSessionContentFromDB } from "@/lib/session-data"
import { SessionClient } from "./session-client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const dynamic = "force-dynamic"

export default async function SessionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const trainingId = Number.parseInt(id)

  const trainingResult = await getTrainingByIdFromDb(trainingId)
  if (!trainingResult) {
    notFound()
  }

  // Supabaseからセッションコンテンツを取得
  const sessionContent = await getSessionContentFromDB(trainingId)

  // セッションコンテンツがない場合は「準備中」ページを表示
  if (!sessionContent) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex flex-1 items-center justify-center p-4">
          <Card className="max-w-md w-full text-center">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                <Construction className="h-8 w-8 text-amber-600" />
              </div>
              <CardTitle className="text-xl">セッション準備中</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                「{trainingResult.training.title}」のインタラクティブセッションは現在準備中です。
              </p>
              <p className="text-sm text-muted-foreground">
                研修詳細ページで概要をご確認いただけます。
              </p>
              <div className="flex flex-col gap-2 pt-4">
                <Button asChild>
                  <Link href={`/training/${trainingId}`}>
                    研修詳細を見る
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href={`/category/${trainingResult.category.id}`}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    カテゴリ一覧に戻る
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  const deepDive = await getDeepDiveContentFromDb(trainingId)

  return (
    <SessionClient
      training={trainingResult.training}
      category={trainingResult.category}
      sessionContent={sessionContent}
      deepDiveContent={deepDive ? {
        title: deepDive.title,
        subtitle: deepDive.subtitle ?? "",
        introduction: deepDive.introduction,
        sections: deepDive.sections,
        conclusion: deepDive.conclusion,
        references: deepDive.references ?? undefined,
      } : null}
    />
  )
}
