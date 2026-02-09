import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { CategoryCard } from "@/components/category-card"
import { getAllCategories } from "@/lib/db/categories"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Award, Clock, Target, FileCheck } from "lucide-react"
import Link from "next/link"

export default async function HomePage() {
  const categories = await getAllCategories()

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <HeroSection />
        <section className="py-12">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="mb-8 text-2xl font-bold">カリキュラム一覧</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>
        </section>

        {/* Final Exam Section */}
        <section className="py-12 bg-gradient-to-b from-background to-muted/30">
          <div className="mx-auto max-w-6xl px-4">
            <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">営業研修修了テスト</CardTitle>
                <CardDescription className="text-base">
                  全カリキュラム修了後に受験できる総合テストです
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div className="flex flex-col items-center gap-2 rounded-lg bg-muted/50 p-4">
                    <FileCheck className="h-5 w-5 text-muted-foreground" />
                    <span className="text-2xl font-bold">100</span>
                    <span className="text-xs text-muted-foreground">問題数</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 rounded-lg bg-muted/50 p-4">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span className="text-2xl font-bold">30</span>
                    <span className="text-xs text-muted-foreground">制限時間（分）</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 rounded-lg bg-muted/50 p-4">
                    <Target className="h-5 w-5 text-muted-foreground" />
                    <span className="text-2xl font-bold">90%</span>
                    <span className="text-xs text-muted-foreground">合格ライン</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 rounded-lg bg-muted/50 p-4">
                    <Award className="h-5 w-5 text-muted-foreground" />
                    <Badge variant="secondary">4択形式</Badge>
                    <span className="text-xs text-muted-foreground">出題形式</span>
                  </div>
                </div>

                <div className="rounded-lg border bg-amber-50 dark:bg-amber-950/20 p-4">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    <strong>注意事項：</strong>
                    このテストは全研修の内容から出題されます。深掘り読み物の内容も含まれますので、
                    すべての研修を修了してから受験することをお勧めします。
                  </p>
                </div>

                <div className="flex justify-center">
                  <Link href="/final-exam">
                    <Button size="lg" className="gap-2">
                      <Award className="h-5 w-5" />
                      修了テストを受験する
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
