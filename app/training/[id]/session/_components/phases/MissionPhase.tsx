import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"
import type { SessionContent } from "@/lib/session-data/types"

import { BADGE_ICONS } from "./badge-icons"

interface MissionPhaseProps {
  trainingId: number
  trainingTitle: string
  sessionContent: Pick<SessionContent, "keyPhrase" | "badge">
  onNext: () => void
}

export function MissionPhase({ trainingId, trainingTitle, sessionContent, onNext }: MissionPhaseProps) {
  return (
    <Card>
      <CardHeader className="text-center">
        <Badge className="mx-auto mb-4">MISSION {trainingId.toString().padStart(2, "0")}</Badge>
        <CardTitle className="text-2xl">{trainingTitle}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg bg-secondary/50 p-6 text-center">
          <div className="text-5xl mb-4">🎬</div>
          <p className="text-lg font-medium mb-2">健太の挑戦</p>
          <p className="text-sm text-muted-foreground">〜{sessionContent.keyPhrase}〜</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">今日学ぶこと:</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>✓ {sessionContent.keyPhrase}の意味と重要性</li>
            <li>✓ 実践的なスキルの習得</li>
            <li>✓ 明日から使えるアクション</li>
          </ul>
        </div>
        <div className="rounded-lg bg-primary/10 p-4 text-center">
          <p className="text-sm">
            クリアすると:{" "}
            <span className="font-bold">
              {BADGE_ICONS[sessionContent.badge.icon] ?? "🏅"}「{sessionContent.badge.name}」
            </span>{" "}
            バッジ獲得！
          </p>
        </div>
        <Button className="w-full" onClick={onNext}>
          研修を始める <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}
