"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Play, Lock } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { hasReadDeepDive } from "@/app/actions/deep-dive-actions"

interface TrainingStartButtonProps {
  trainingId: number
  hasDeepDive: boolean
}

export function TrainingStartButton({ trainingId, hasDeepDive }: TrainingStartButtonProps) {
  const { user } = useAuth()
  const [deepDiveRead, setDeepDiveRead] = useState(!hasDeepDive)
  const [checking, setChecking] = useState(hasDeepDive)

  useEffect(() => {
    if (!hasDeepDive || !user) {
      setChecking(false)
      return
    }
    hasReadDeepDive(trainingId).then((read) => {
      setDeepDiveRead(read)
      setChecking(false)
    })
  }, [user, trainingId, hasDeepDive])

  if (checking) {
    return (
      <Button className="w-full" size="lg" disabled>
        <Play className="h-5 w-5 shrink-0" />
        <span>読み込み中…</span>
      </Button>
    )
  }

  if (!deepDiveRead) {
    return (
      <Button
        className="w-full"
        size="lg"
        onClick={() => {
          const el = document.getElementById("deep-dive-section")
          if (el) {
            el.scrollIntoView({ behavior: "smooth" })
          }
          toast.info("この研修の深掘りを読んでから開始できます", {
            duration: 4000,
          })
        }}
      >
        <Lock className="h-5 w-5 shrink-0" />
        <span>研修開始</span>
      </Button>
    )
  }

  return (
    <Link href={`/training/${trainingId}/session`}>
      <Button className="w-full" size="lg">
        <Play className="h-5 w-5 shrink-0" />
        <span>研修開始</span>
      </Button>
    </Link>
  )
}
