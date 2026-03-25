import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react"
import type { StoryScene } from "@/lib/session-data/types"

interface StoryPhaseProps {
  part: "part1" | "part2"
  scenes: StoryScene[]
  sceneIndex: number
  onPrev: () => void
  onNext: () => void
  onComplete: () => void
}

export function StoryPhase({ part, scenes, sceneIndex, onPrev, onNext, onComplete }: StoryPhaseProps) {
  const scene = scenes[sceneIndex]
  const isLast = sceneIndex >= scenes.length - 1
  const label = part === "part1" ? "ストーリー Part 1" : "ストーリー Part 2"

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant="outline">{label}</Badge>
          <span className="text-sm text-muted-foreground">
            {sceneIndex + 1} / {scenes.length}
          </span>
        </div>
        <CardTitle className="text-lg mt-2">{scene?.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-secondary/30 p-4">
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
            {scene?.content}
          </pre>
        </div>
        <div className="flex gap-2">
          {sceneIndex > 0 && (
            <Button variant="outline" onClick={onPrev}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <Button
            className="flex-1"
            onClick={isLast ? onComplete : onNext}
          >
            {isLast ? (
              <>+20pt 次へ進む <ArrowRight className="ml-1 h-4 w-4" /></>
            ) : (
              <>次のシーン <ChevronRight className="ml-1 h-4 w-4" /></>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
