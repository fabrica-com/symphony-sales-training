import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

import { BADGE_ICONS } from "./badge-icons"

interface CompletePhaseProps {
  trainingId: number
  trainingTitle: string
  badge: { name: string; icon: string }
  points: number
  currentIndex?: number
  totalCount?: number
  nextTrainingId?: number
  onNext: () => void
}

export function CompletePhase({ trainingId, trainingTitle, badge, points, onNext }: CompletePhaseProps) {
  return (
    <Card>
      <CardHeader className="text-center">
        <div className="text-4xl mb-4">🎉</div>
        <CardTitle className="text-2xl">MISSION COMPLETE!</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 text-center">
        <p className="text-lg">研修No.{trainingId}「{trainingTitle}」クリア！</p>
        <div className="rounded-lg bg-secondary/50 p-6">
          <div className="text-5xl mb-2">{BADGE_ICONS[badge.icon] ?? "🏅"}</div>
          <p className="font-bold">「{badge.name}」</p>
          <p className="text-sm text-muted-foreground">バッジ獲得！</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">今日の獲得ポイント</p>
          <p className="text-3xl font-bold text-primary">+{points}pt</p>
        </div>
        <Button className="w-full" onClick={onNext}>
          次へ <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}
