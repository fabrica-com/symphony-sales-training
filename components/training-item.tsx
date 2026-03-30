import Link from "next/link"
import { Clock, ChevronRight, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Training } from "@/lib/training-data"
import { levelColors } from "@/lib/training-data"

interface TrainingItemProps {
  training: Training
  categoryId: string
  completed?: boolean
}

export function TrainingItem({ training, categoryId, completed }: TrainingItemProps) {
  return (
    <Link href={`/training/${training.id}`} prefetch={false}>
      <div className={`group flex items-center justify-between rounded-lg border p-4 transition-all hover:shadow-md ${
        completed
          ? "border-blue-200 bg-blue-50/50 hover:border-blue-300"
          : "border-border bg-card hover:border-primary/30"
      }`}>
        <div className="flex items-center gap-4">
          <div className={`relative flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
            completed
              ? "bg-blue-500 text-white"
              : "bg-muted"
          }`}>
            {String(training.id).padStart(2, "0")}
            {completed && (
              <CheckCircle2 className="absolute -right-1 -top-1 h-4 w-4 text-blue-600 fill-white" />
            )}
          </div>
          <div>
            <h4 className="font-medium group-hover:text-primary transition-colors">{training.title}</h4>
            {training.subtitle && <p className="text-sm text-muted-foreground">{training.subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {completed && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
              受講済
            </Badge>
          )}
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
