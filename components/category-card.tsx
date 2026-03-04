import Link from "next/link"
import { Clock, ChevronRight, BookOpen } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Category } from "@/lib/training-data"

interface CategoryCardProps {
  category: Category
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/category/${category.id}`}>
      <Card className="group h-full transition-all hover:shadow-lg hover:border-primary/30">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${category.color} text-white`}>
              <span className="text-xl font-bold">{category.id}</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {category.trainingCount ?? category.trainings.length}本
            </Badge>
          </div>
          <h3 className="mt-3 text-lg font-semibold group-hover:text-primary transition-colors">{category.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{category.description}</p>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {category.totalDuration}分
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                {category.targetLevel}
              </span>
            </div>
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
