import Link from "next/link"
import { Clock, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Training } from "@/lib/training-data"
import { levelColors } from "@/lib/training-data"

interface TrainingItemProps {
  training: Training
  categoryId: string
}

export function TrainingItem({ training, categoryId }: TrainingItemProps) {
  return (
    <Link href={`/training/${training.id}`}>
      <div className="group flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-md">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-semibold">
            {String(training.id).padStart(2, "0")}
          </div>
          <div>
            <h4 className="font-medium group-hover:text-primary transition-colors">{training.title}</h4>
            {training.subtitle && <p className="text-sm text-muted-foreground">{training.subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className={levelColors[training.level]}>
            {training.level}
          </Badge>
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {training.duration}分
          </span>
          <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  )
}
