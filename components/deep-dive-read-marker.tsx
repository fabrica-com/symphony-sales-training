"use client"

import { useEffect, useRef } from "react"
import { useAuth } from "@/lib/auth-context"
import { markDeepDiveRead } from "@/app/actions/deep-dive-actions"

export function DeepDiveReadMarker({ trainingId }: { trainingId: number }) {
  const { user } = useAuth()
  const called = useRef(false)

  useEffect(() => {
    if (!user || called.current) return
    called.current = true
    markDeepDiveRead(trainingId)
  }, [user, trainingId])

  return null
}
