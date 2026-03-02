"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, TrendingUp, CheckCircle2, Clock, Target } from "lucide-react"
import { getAllUsersProgress } from "@/app/actions/admin-actions"

interface UserProgress {
  userId: string
  name: string
  email: string
  role: string
  sessionCount: number
  completedCount: number
  testCount: number
  passedTests: number
  lastActivity: string | null
}

export default function TasksPage() {
  const [progress, setProgress] = useState<UserProgress[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProgress()
  }, [])

  const loadProgress = async () => {
    setLoading(true)
    const result = await getAllUsersProgress()
    if (result.success && result.progress) {
      setProgress(result.progress as UserProgress[])
    }
    setLoading(false)
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "未実施"
    const date = new Date(dateStr)
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge variant="default">管理者</Badge>
      case "manager":
        return <Badge variant="secondary">マネージャー</Badge>
      default:
        return <Badge variant="outline">従業員</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">読み込み中...</p>
        </div>
      </div>
    )
  }

  // 統計情報を計算
  const totalUsers = progress.length
  const activeUsers = progress.filter((p) => p.sessionCount > 0).length
  const avgCompleted = progress.length > 0
    ? Math.round(progress.reduce((sum, p) => sum + p.completedCount, 0) / progress.length)
    : 0
  const avgTests = progress.length > 0
    ? Math.round(progress.reduce((sum, p) => sum + p.testCount, 0) / progress.length)
    : 0

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100">
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            ユーザー進捗管理
          </h1>
          <p className="text-muted-foreground">
            全ユーザーの学習進捗状況を確認できます
          </p>
        </div>

        {/* 統計カード */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">登録ユーザー数</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">総ユーザー数</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">アクティブユーザー</CardTitle>
              <Target className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeUsers}</div>
              <p className="text-xs text-muted-foreground">学習実績あり</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">平均完了数</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgCompleted}</div>
              <p className="text-xs text-muted-foreground">完了した研修の平均</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">平均テスト数</CardTitle>
              <TrendingUp className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgTests}</div>
              <p className="text-xs text-muted-foreground">受験したテストの平均</p>
            </CardContent>
          </Card>
        </div>

        {/* ユーザー進捗一覧 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              ユーザー進捗一覧
            </CardTitle>
            <CardDescription>
              各ユーザーの学習状況を確認できます
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {progress.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>進捗データが見つかりません</p>
                </div>
              ) : (
                progress.map((user) => (
                  <div
                    key={user.userId}
                    className="rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{user.name}</p>
                            {getRoleBadge(user.role)}
                          </div>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          最終活動: {formatDate(user.lastActivity)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">受講セッション</p>
                        <p className="text-2xl font-bold">{user.sessionCount}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">完了研修</p>
                        <p className="text-2xl font-bold">{user.completedCount}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">テスト受験</p>
                        <p className="text-2xl font-bold">{user.testCount}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">合格テスト</p>
                        <p className="text-2xl font-bold text-green-600">{user.passedTests}</p>
                      </div>
                    </div>

                    {/* 進捗バー（簡易版：完了研修数/100を想定） */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium">全体進捗</p>
                        <p className="text-sm text-muted-foreground">
                          {user.completedCount} / 100
                        </p>
                      </div>
                      <Progress
                        value={Math.min((user.completedCount / 100) * 100, 100)}
                        className="h-2"
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

