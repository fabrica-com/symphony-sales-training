"use client"

import { useEffect } from "react"
import { AlertCircle, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
        <h2 className="text-xl font-bold mb-2">エラーが発生しました</h2>
        <p className="text-muted-foreground mb-6">
          予期しないエラーが発生しました。もう一度お試しください。
        </p>
        <Button onClick={reset}>
          <RotateCcw className="mr-2 h-4 w-4" />
          再試行
        </Button>
      </div>
    </div>
  )
}
