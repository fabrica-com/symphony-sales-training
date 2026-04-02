import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { User } from "@/lib/auth-context"

interface EndingPhaseProps {
  trainingId: number
  keyPhrase: string
  points: number
  elapsedTime: number
  formatTime: (seconds: number) => string
  user: User | null
  currentIndex?: number
  totalCount?: number
  nextTrainingId?: number
}

export function EndingPhase({
  trainingId,
  keyPhrase,
  points,
  elapsedTime,
  formatTime,
  user,
  currentIndex = 0,
  totalCount = 0,
  nextTrainingId,
}: EndingPhaseProps) {
  return (
    <Card>
      <CardHeader className="text-center">
        <div className="text-4xl mb-4">✨</div>
        <CardTitle className="text-2xl">今日もお疲れ様でした！</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 text-center">
        <div className="rounded-lg bg-primary/10 p-4">
          <p className="font-bold">「{keyPhrase}」</p>
        </div>

        <div className="rounded-lg border p-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">{points}</p>
              <p className="text-xs text-muted-foreground">獲得ポイント</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{formatTime(elapsedTime)}</p>
              <p className="text-xs text-muted-foreground">学習時間</p>
            </div>
          </div>
        </div>

        <p className="text-muted-foreground">
          今日も1歩、前に進みました。
          <br />
          明日も一緒に頑張りましょう！
        </p>

        {totalCount > 0 && (
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
            <p className="text-sm text-blue-800">進捗: {currentIndex}/{totalCount}</p>
          </div>
        )}

        {user && (
          <div className="rounded-lg bg-green-50 border border-green-200 p-3">
            <p className="text-sm text-green-800">学習履歴が保存されました</p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {nextTrainingId && (
            <Link href={`/training/${nextTrainingId}/session`}>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                次の研修へ進む →
              </Button>
            </Link>
          )}
          {user ? (
            <>
              <Link href="/dashboard">
                <Button className="w-full">ダッシュボードで進捗を確認</Button>
              </Link>
              <Link href={`/training/${trainingId}`}>
                <Button variant="outline" className="w-full bg-transparent">研修ページに戻る</Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button className="w-full">ログインして進捗を記録</Button>
              </Link>
              <Link href={`/training/${trainingId}`}>
                <Button variant="outline" className="w-full bg-transparent">研修ページに戻る</Button>
              </Link>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
