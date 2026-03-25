import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, CheckCircle2, Mic, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { RoleplayScenario } from "@/lib/session-data/types"

interface RoleplayPhaseProps {
  scenarios: RoleplayScenario[]
  currentIndex: number
  dialogueIndex: number
  isComplete: boolean
  onAdvanceDialogue: () => void
  onComplete: () => void
  onNext: () => void
}

export function RoleplayPhase({
  scenarios,
  currentIndex,
  dialogueIndex,
  isComplete,
  onAdvanceDialogue,
  onComplete,
  onNext,
}: RoleplayPhaseProps) {
  const scenario = scenarios[currentIndex]
  const hasMoreDialogue = scenario.dialogue && dialogueIndex < scenario.dialogue.length - 1

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant="outline">
            <Mic className="h-3 w-3 mr-1" />
            ロールプレイ
          </Badge>
          <span className="text-sm text-muted-foreground">
            {currentIndex + 1} / {scenarios.length}
          </span>
        </div>
        <CardTitle className="text-lg mt-2">{scenario.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-muted/50 p-4">
          <p className="text-sm font-medium mb-2">シチュエーション</p>
          <p className="text-sm text-muted-foreground">{scenario.situation}</p>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium">会話の流れ</p>

          {scenario.seniorOpening && (
            <div className="flex gap-3">
              <div className="shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <span className="text-xs font-medium">先輩</span>
              </div>
              <div className="flex-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 p-3">
                <p className="text-sm">{scenario.seniorOpening}</p>
              </div>
            </div>
          )}

          {scenario.dialogue?.slice(0, dialogueIndex + 1).map((item, idx) => {
            const speaker = String(item.speaker).toLowerCase().trim()
            const isSenior = speaker === "senior" || speaker === "customer" || speaker === "先輩"
            const isKenta = speaker === "kenta" || speaker === "sales" || speaker === "健太"
            return (
              <div key={idx} className={cn("flex gap-3", isKenta && "flex-row-reverse")}>
                <div className={cn(
                  "shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                  isSenior ? "bg-blue-100 dark:bg-blue-900/30" : "bg-green-100 dark:bg-green-900/30"
                )}>
                  <span className="text-xs font-medium">{isSenior ? "先輩" : "健太"}</span>
                </div>
                <div className={cn(
                  "flex-1 rounded-lg p-3",
                  isSenior
                    ? "bg-blue-50 dark:bg-blue-900/20"
                    : "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                )}>
                  <p className="text-sm">{item.line}</p>
                </div>
              </div>
            )
          })}

          {!isComplete && hasMoreDialogue && (
            <Button variant="outline" className="w-full" onClick={onAdvanceDialogue}>
              次の会話を見る <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          )}

          {!isComplete && !hasMoreDialogue && (
            <div className="space-y-3 pt-2">
              <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-2">学びのポイント</p>
                <ul className="space-y-1">
                  {scenario.keyPoints?.map((point, idx) => (
                    <li key={idx} className="text-sm text-amber-700 dark:text-amber-300 flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-amber-600" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
              <Button className="w-full" onClick={onComplete}>
                理解しました +20pt <CheckCircle2 className="ml-1 h-4 w-4" />
              </Button>
            </div>
          )}

          {isComplete && (
            <div className="space-y-3 pt-2">
              <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 text-center">
                <CheckCircle2 className="h-8 w-8 mx-auto text-primary mb-2" />
                <p className="font-medium">ロールプレイ完了！</p>
                <p className="text-sm text-muted-foreground mt-1">{scenario.successCriteria}</p>
              </div>
              <Button className="w-full" onClick={onNext}>
                {currentIndex < scenarios.length - 1 ? "次のロールプレイ" : "次へ進む"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
