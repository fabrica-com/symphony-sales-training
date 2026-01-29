"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  BookOpen,
  LogOut,
  Trophy,
  Target,
  Clock,
  TrendingUp,
  Calendar,
  ChevronRight,
  Award,
  BarChart3,
  User,
  History,
  FileCheck,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth-context"
import { categories } from "@/lib/training-data"

function DashboardPage() {
  const router = useRouter()
  const {
    user,
    isLoading,
    logout,
    trainingLogs,
    userProgress,
    testResults,
    getBestTestResult,
    getTotalPoints,
    getCompletedTrainings,
    getProgressPercentage,
  } = useAuth()

  // Debug logs
  useEffect(() => {
    console.log("[v0] Dashboard - trainingLogs length:", trainingLogs.length)
    console.log("[v0] Dashboard - trainingLogs data:", trainingLogs)
    console.log("[v0] Dashboard - userProgress size:", userProgress.size)
    console.log("[v0] Dashboard - user:", user)
  }, [trainingLogs, userProgress, user])

  // Check authentication status
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  // Show loading or redirect state
  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">読み込み中...</p>
        </div>
      </div>
    )
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  // Get recent logs (last 10)
  const recentLogs = trainingLogs.slice(0, 10)

  // Calculate stats
  const totalPoints = getTotalPoints()
  const completedCount = getCompletedTrainings()
  const progressPercentage = getProgressPercentage()

  // Calculate total time spent (in hours)
  const totalTimeHours = trainingLogs.reduce((sum, log) => sum + log.duration, 0) / 3600

  // Calculate average score
  const avgScore = trainingLogs.length > 0
    ? Math.round(trainingLogs.reduce((sum, log) => sum + (log.score / log.maxScore) * 100, 0) / trainingLogs.length)
    : 0

  // Get category progress
  const getCategoryProgress = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    if (!category) return { completed: 0, total: 0, percentage: 0 }

    const trainingIds = category.trainings.map((t) => t.id)
    const completed = trainingIds.filter((id) => userProgress.has(id)).length
    const total = trainingIds.length
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

    return { completed, total, percentage }
  }

  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">おかえりなさい、{user.name}さん</h1>
          <p className="text-muted-foreground">今日も学習を続けましょう。あなたの成長を応援しています。</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">累計ポイント</CardTitle>
              <Trophy className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPoints.toLocaleString()}<span className="text-sm font-normal text-muted-foreground ml-1">pt</span></div>
              <p className="text-xs text-muted-foreground">全期間の獲得ポイント</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">受講済み研修</CardTitle>
              <Target className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedCount}<span className="text-sm font-normal text-muted-foreground ml-1">/ 100</span></div>
              <Progress value={progressPercentage} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">学習時間</CardTitle>
              <Clock className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTimeHours.toFixed(1)}<span className="text-sm font-normal text-muted-foreground ml-1">時間</span></div>
              <p className="text-xs text-muted-foreground">累計学習時間</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">平均スコア</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgScore}<span className="text-sm font-normal text-muted-foreground ml-1">%</span></div>
              <p className="text-xs text-muted-foreground">全研修の平均正答率</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="progress" className="space-y-6">
          <TabsList>
            <TabsTrigger value="progress" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              学習進捗
            </TabsTrigger>
            <TabsTrigger value="tests" className="gap-2">
              <FileCheck className="h-4 w-4" />
              総合テスト
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <History className="h-4 w-4" />
              受講履歴
            </TabsTrigger>
          </TabsList>

          <TabsContent value="progress" className="space-y-6">
            {/* Category Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  カテゴリ別進捗
                </CardTitle>
                <CardDescription>各カテゴリの学習状況を確認できます</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {categories.map((category) => {
                    const progress = getCategoryProgress(category.id)
                    return (
                      <div key={category.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Link
                            href={`/category/${category.id}`}
                            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                          >
                            <div
                              className="flex h-10 w-10 items-center justify-center rounded-lg text-lg"
                              style={{ backgroundColor: category.color + "20", color: category.color }}
                            >
                              {category.icon}
                            </div>
                            <div>
                              <p className="font-medium">{category.name}</p>
                              <p className="text-xs text-muted-foreground">{category.description}</p>
                            </div>
                          </Link>
                          <div className="text-right">
                            <p className="font-medium">{progress.completed} / {progress.total}</p>
                            <p className="text-xs text-muted-foreground">{progress.percentage}%完了</p>
                          </div>
                        </div>
                        <Progress value={progress.percentage} className="h-2" />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>学習を続ける</CardTitle>
                <CardDescription>おすすめの研修や未完了の研修を確認</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild className="flex-1">
                    <Link href="/">
                      <BookOpen className="h-4 w-4 mr-2" />
                      研修一覧を見る
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="flex-1 bg-transparent">
                    <Link href="/category/A">
                      <Target className="h-4 w-4 mr-2" />
                      基礎マインドセット編から始める
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tests" className="space-y-6">
            {/* Test Results Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCheck className="h-5 w-5" />
                  総合テスト結果
                </CardTitle>
                <CardDescription>各カテゴリの総合テスト合格状況を確認できます</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categories.map((category) => {
                    const bestResult = getBestTestResult(category.id)
                    const hasTest = category.id === "A" // Currently only category A has a test

                    if (!hasTest) {
                      return (
                        <div
                          key={category.id}
                          className="flex items-center justify-between rounded-lg border border-dashed p-4 opacity-60"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="flex h-10 w-10 items-center justify-center rounded-lg text-lg"
                              style={{ backgroundColor: category.color + "20", color: category.color }}
                            >
                              {category.icon}
                            </div>
                            <div>
                              <p className="font-medium">{category.name}</p>
                              <p className="text-xs text-muted-foreground">総合テスト準備中</p>
                            </div>
                          </div>
                          <Badge variant="outline">Coming Soon</Badge>
                        </div>
                      )
                    }

                    return (
                      <div
                        key={category.id}
                        className={`flex items-center justify-between rounded-lg border p-4 ${
                          bestResult?.passed ? "border-green-200 bg-green-50" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-10 w-10 items-center justify-center rounded-lg text-lg"
                            style={{ backgroundColor: category.color + "20", color: category.color }}
                          >
                            {category.icon}
                          </div>
                          <div>
                            <p className="font-medium">{category.name}</p>
                            {bestResult ? (
                              <p className="text-xs text-muted-foreground">
                                最高スコア: {bestResult.percentage}% ({bestResult.correctCount}/{bestResult.totalQuestions}問正解)
                              </p>
                            ) : (
                              <p className="text-xs text-muted-foreground">未受験</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {bestResult ? (
                            bestResult.passed ? (
                              <Badge className="bg-green-600">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                合格
                              </Badge>
                            ) : (
                              <Badge variant="destructive">
                                <XCircle className="h-3 w-3 mr-1" />
                                不合格
                              </Badge>
                            )
                          ) : null}
                          <Button asChild size="sm" variant={bestResult?.passed ? "outline" : "default"}>
                            <Link href={`/category/${category.id}/test`}>
                              {bestResult ? "再挑戦" : "テストを受ける"}
                            </Link>
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Test History */}
            {testResults.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    テスト受験履歴
                  </CardTitle>
                  <CardDescription>過去のテスト結果を確認できます</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {testResults.slice(0, 10).map((result) => (
                      <div
                        key={result.id}
                        className={`flex items-center justify-between rounded-lg border p-4 ${
                          result.passed ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                            result.passed ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                          }`}>
                            {result.passed ? (
                              <CheckCircle2 className="h-5 w-5" />
                            ) : (
                              <XCircle className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{result.categoryName} 総合テスト</p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                              <span>第{result.attemptNumber}回目</span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {Math.floor(result.duration / 60)}分{result.duration % 60}秒
                              </span>
                              <span>{formatDate(result.completedAt)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-xl font-bold ${result.passed ? "text-green-600" : "text-red-600"}`}>
                            {result.percentage}%
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {result.correctCount}/{result.totalQuestions}問正解
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            {/* Training History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  受講履歴
                </CardTitle>
                <CardDescription>過去の受講記録を確認できます</CardDescription>
              </CardHeader>
              <CardContent>
                {recentLogs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>まだ受講履歴がありません</p>
                    <p className="text-sm mt-1">研修を受講すると、ここに履歴が表示されます</p>
                    <Button asChild className="mt-4">
                      <Link href="/">研修を始める</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentLogs.map((log) => (
                      <div
                        key={log.id}
                        className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
                            {log.attemptNumber}
                          </div>
                          <div>
                            <p className="font-medium">
                              No.{log.odaiNumber} {log.trainingTitle}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                              <span>{log.categoryName}</span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatDuration(log.duration)}
                              </span>
                              <span>{formatDate(log.completedAt)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <Trophy className="h-4 w-4 text-amber-500" />
                            <span className="font-bold">{log.score}</span>
                            <span className="text-muted-foreground">/ {log.maxScore} pt</span>
                          </div>
                          <Badge
                            variant={log.score >= log.maxScore * 0.8 ? "default" : "secondary"}
                            className="mt-1"
                          >
                            {Math.round((log.score / log.maxScore) * 100)}%
                          </Badge>
                        </div>
                      </div>
                    ))}

                    {trainingLogs.length > 10 && (
                      <div className="text-center pt-4">
                        <p className="text-sm text-muted-foreground">
                          他 {trainingLogs.length - 10} 件の履歴があります
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Training Stats per Course */}
            {userProgress.size > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    研修別統計
                  </CardTitle>
                  <CardDescription>各研修の受講回数と最高スコア</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Array.from(userProgress.entries()).map(([odaiNumber, progress]) => {
                      const category = categories.find((c) =>
                        c.trainings.some((t) => t.id === odaiNumber)
                      )
                      const training = category?.trainings.find((t) => t.id === odaiNumber)

                      return (
                        <Link
                          key={odaiNumber}
                          href={`/training/${odaiNumber}`}
                          className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="flex h-8 w-8 items-center justify-center rounded text-sm font-bold"
                              style={{
                                backgroundColor: category?.color + "20",
                                color: category?.color,
                              }}
                            >
                              {odaiNumber}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{training?.title || `研修 ${odaiNumber}`}</p>
                              <p className="text-xs text-muted-foreground">{category?.name}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-sm font-medium">{progress.completedCount}回受講</p>
                              <p className="text-xs text-muted-foreground">
                                最高: {progress.bestScore}pt
                              </p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default DashboardPage
