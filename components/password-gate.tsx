"use client"

import type React from "react"

import { Lock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"

interface PasswordGateProps {
  children: React.ReactNode
  title?: string
  description?: string
}

export function PasswordGate({
  children,
  title = "管理者権限が必要です",
  description = "この機能にアクセスするには管理者アカウントでログインしてください",
}: PasswordGateProps) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return null
  }

  if (user?.role === "admin") {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent />
      </Card>
    </div>
  )
}
