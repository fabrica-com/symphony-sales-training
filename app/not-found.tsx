import Link from "next/link"
import { FileQuestion } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <FileQuestion className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-bold mb-2">ページが見つかりません</h2>
        <p className="text-muted-foreground mb-6">
          お探しのページは存在しないか、移動された可能性があります。
        </p>
        <Button asChild>
          <Link href="/">ホームに戻る</Link>
        </Button>
      </div>
    </div>
  )
}
