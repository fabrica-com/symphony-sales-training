import Link from "next/link"
import { ArrowLeft, Clock, Star } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface SessionHeaderProps {
  trainingId: number
  elapsedTime: number
  points: number
  progress: number
  formatTime: (seconds: number) => string
  currentIndex?: number
  totalCount?: number
}

export function SessionHeader({
  trainingId,
  elapsedTime,
  points,
  progress,
  formatTime,
  currentIndex = 0,
  totalCount = 0,
}: SessionHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-center justify-between">
          <Link
            href={`/training/${trainingId}`}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            終了
          </Link>
          <div className="flex items-center gap-4">
            {totalCount > 0 && (
              <div className="text-sm text-muted-foreground">
                進捗: {currentIndex}/{totalCount}
              </div>
            )}
            <div className="flex items-center gap-1 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{formatTime(elapsedTime)}</span>
            </div>
            <div className="flex items-center gap-1 text-sm font-medium text-primary">
              <Star className="h-4 w-4 fill-primary" />
              <span>{points}pt</span>
            </div>
          </div>
        </div>
        <Progress value={progress} className="mt-2 h-1" />
      </div>
    </header>
  )
}
