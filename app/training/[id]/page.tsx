import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Clock, BookOpen, Target, CheckCircle2, Quote, Construction, Sparkles } from "lucide-react"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { levelColors } from "@/lib/training-data"
import { getSessionContentFromDB } from "@/lib/session-data"
import { getTrainingByIdFromDb, getDeepDiveContentFromDb, getAllTrainingIds } from "@/lib/db/categories"
import { TrainingResultsLoader } from "@/components/training-results-loader"
import { TrainingStartButton } from "@/components/training-start-button"
import { createStaticClient } from "@/lib/supabase/static"
import { HighlightText, HighlightListItem } from "@/components/training-content-highlighter"

interface TrainingPageProps {
  params: Promise<{ id: string }>
}

export const revalidate = 3600

export async function generateStaticParams() {
  const supabase = createStaticClient()
  return getAllTrainingIds(supabase)
}

export default async function TrainingPage({ params }: TrainingPageProps) {
  const { id } = await params
  const supabase = createStaticClient()
  const result = await getTrainingByIdFromDb(Number(id), supabase)

  if (!result) {
    notFound()
  }

  const { training, category } = result
  const detail = training.detail

  const sessionContent = await getSessionContentFromDB(training.id, supabase)
  const hasSessionContent = sessionContent !== null && sessionContent !== undefined

  const deepDiveContent = await getDeepDiveContentFromDb(training.id, supabase)
  const hasDeepDive = deepDiveContent !== null && deepDiveContent !== undefined

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="border-b border-border bg-linear-to-b from-secondary/50 to-background py-12">
          <div className="mx-auto max-w-7xl px-4">
            <Link
              href={`/category/${category.id}`}
              className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {category.name}に戻る
            </Link>

            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-xl font-bold">
                {String(training.id).padStart(2, "0")}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className={category.color + " text-white"}>
                    {category.id}. {category.name}
                  </Badge>
                </div>
                <h1 className="text-3xl font-bold"><HighlightText text={training.title} /></h1>
                {training.subtitle && <p className="mt-2 text-lg text-muted-foreground"><HighlightText text={training.subtitle} /></p>}
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Badge variant="secondary" className={levelColors[training.level]}>
                    {training.level}
                  </Badge>
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {training.duration}分
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2 space-y-6">
                {detail ? (
                  <>
                    {/* 研修の目的 */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Target className="h-5 w-5 text-primary" />
                          研修の目的
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground leading-relaxed"><HighlightText text={detail.purpose} /></p>
                        <div className="mt-4 rounded-lg bg-primary/5 border border-primary/20 p-4">
                          <p className="text-sm font-medium text-primary">ゴール</p>
                          <p className="mt-1 text-foreground"><HighlightText text={detail.goal} /></p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* セクション */}
                    {detail.sections.map((section, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <BookOpen className="h-5 w-5 text-primary" />
                            <HighlightText text={section.title} />
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {section.type === "list" && Array.isArray(section.content) ? (
                            <ul className="space-y-2">
                              {section.content.map((item, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                                  <span className="text-muted-foreground"><HighlightListItem text={item} /></span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <div className="text-muted-foreground whitespace-pre-line leading-relaxed">
                              <HighlightText text={typeof section.content === "string" ? section.content : section.content.join("\n")} />
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}

                    {/* 名言 */}
                    {detail.quote && (
                      <Card className="bg-secondary/30 border-secondary">
                        <CardContent className="pt-6">
                          <div className="flex gap-4">
                            <Quote className="h-8 w-8 text-primary/50 shrink-0" />
                            <div>
                              <p className="text-lg italic text-foreground leading-relaxed">"<HighlightText text={detail.quote.text} />"</p>
                              <p className="mt-2 text-sm text-muted-foreground">— <HighlightText text={detail.quote.author} /></p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* まとめ */}
                    <Card className="border-primary/30">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                          まとめ
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {detail.summary.map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                              <span className="font-medium"><HighlightListItem text={item} /></span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    {/* Deep Dive Button */}
                    {hasDeepDive && (
                      <div id="deep-dive-section" className="rounded-xl border-2 border-blue-400 bg-linear-to-r from-blue-50 to-indigo-50 p-6 shadow-lg scroll-mt-8">
                        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-500 text-white">
                              <Sparkles className="h-7 w-7" />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-blue-900">この章をより深く理解したい方へ</h3>
                              <p className="text-sm text-blue-700">学術研究に基づく深掘り読み物</p>
                            </div>
                          </div>
                          <Button asChild size="lg" className="w-full bg-blue-500 text-white hover:bg-blue-600 sm:w-auto">
                            <Link href={`/training/${training.id}/deep-dive`}>
                              <BookOpen className="mr-2 h-5 w-5" />
                              この章をより深掘りする
                            </Link>
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        研修概要
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-lg bg-muted/50 p-8 text-center">
                        <Construction className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground font-medium">詳細コンテンツは準備中です</p>
                        <p className="text-sm text-muted-foreground mt-2">近日公開予定</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      {hasSessionContent ? "研修を開始する" : "研修コンテンツ"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {hasSessionContent ? (
                      <TrainingStartButton trainingId={training.id} hasDeepDive={hasDeepDive} />
                    ) : (
                      <div className="space-y-3">
                        <Button className="w-full" size="lg" disabled>
                          <Construction className="h-5 w-5 shrink-0" />
                          <span>準備中</span>
                        </Button>
                        <p className="text-xs text-muted-foreground text-center">
                          この研修のコンテンツは現在準備中です
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <TrainingResultsLoader trainingId={training.id} />

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">研修情報</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">カテゴリ</span>
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">対象レベル</span>
                      <span className="font-medium">{training.level}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">所要時間</span>
                      <span className="font-medium">{training.duration}分</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">研修番号</span>
                      <span className="font-medium">#{String(training.id).padStart(2, "0")}</span>
                    </div>
                  </CardContent>
                </Card>

              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
