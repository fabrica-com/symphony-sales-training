"use client"

import React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { LogIn, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth-context"

export default function LoginPage() {
  const [error, setError] = useState("")
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const { loginWithGoogle } = useAuth()

  // Check for error in URL params (from OAuth callback)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const errorParam = urlParams.get('error')
    const errorMessage = urlParams.get('message')
    
    if (errorParam) {
      if (errorMessage) {
        setError(decodeURIComponent(errorMessage))
      } else if (errorParam === 'auth_code_error') {
        setError("認証に失敗しました。もう一度お試しください。")
      } else if (errorParam === 'oauth_error') {
        setError("OAuth認証に失敗しました。もう一度お試しください。")
      } else {
        setError("認証エラーが発生しました。")
      }
      // Clear error from URL
      const newUrl = window.location.pathname
      window.history.replaceState({}, '', newUrl)
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-linear-to-b from-slate-50 to-slate-100">
      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <LogIn className="h-8 w-8 text-primary" />
            </div>
            <div className="mx-auto mb-4 flex justify-center">
              <Image
                src="/symphony-logo.svg"
                alt="symphony研修"
                width={580}
                height={104}
                className="h-12 w-auto"
                unoptimized
              />
            </div>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Google Login Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={async () => {
                setIsGoogleLoading(true)
                setError("")
                try {
                  await loginWithGoogle()
                } catch (error) {
                  setError("Googleログイン中にエラーが発生しました")
                  console.error("Google login error:", error)
                  setIsGoogleLoading(false)
                }
              }}
              disabled={isGoogleLoading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              {isGoogleLoading ? "認証中..." : "Googleでログイン"}
            </Button>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-4">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} 株式会社ファブリカコミュニケーションズ. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
