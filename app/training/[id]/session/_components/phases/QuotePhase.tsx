import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Quote } from "lucide-react"

interface QuotePhaseProps {
  quote: {
    text: string
    textJa: string
    author: string
  }
  onNext: () => void
}

export function QuotePhase({ quote, onNext }: QuotePhaseProps) {
  return (
    <Card>
      <CardHeader className="text-center">
        <Badge variant="outline" className="mx-auto mb-2">名言カード</Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg bg-secondary/50 p-8 text-center">
          <Quote className="h-8 w-8 mx-auto mb-4 text-primary" />
          <p className="text-lg font-medium italic mb-2">"{quote.text}"</p>
          <p className="text-sm text-muted-foreground mb-4">{quote.textJa}</p>
          <p className="text-sm text-muted-foreground">— {quote.author}</p>
        </div>
        <div className="rounded-lg bg-primary/10 p-4">
          <p className="text-sm">💡 {quote.textJa}</p>
        </div>
        <Button className="w-full" onClick={onNext}>
          次へ <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}
