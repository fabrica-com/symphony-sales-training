"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { User, LayoutDashboard, LogIn, LogOut, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { TrainingSearch } from "@/components/training-search"

export function Header() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

  // ログインページではヘッダーを表示しない
  if (pathname === "/login") {
    return null
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-6xl px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="/symphony-logo.svg"
              alt="Symphony研修"
              width={145}
              height={26}
              className="h-auto w-auto max-h-8"
            />
          </Link>
          <div className="hidden md:block flex-1 max-w-md">
            <TrainingSearch />
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileSearchOpen(true)}
            >
              <Search className="h-4 w-4" />
            </Button>
            <nav className="hidden sm:flex items-center gap-4 md:gap-6">
              <Link
                href="/"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                カリキュラム
              </Link>
              {user && (
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  学習進捗
                </Link>
              )}
            </nav>
            {user ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{user.name || user.email || "ユーザー"}</span>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href="/dashboard">
                    <LayoutDashboard className="h-4 w-4 sm:hidden" />
                    <span className="hidden sm:inline">ダッシュボード</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">ログアウト</span>
                </Button>
              </div>
            ) : (
              <Button asChild size="sm">
                <Link href="/login">
                  <LogIn className="h-4 w-4 mr-2" />
                  ログイン
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {mobileSearchOpen && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur md:hidden">
          <div className="flex items-center gap-2 p-4 border-b border-border">
            <div className="flex-1">
              <TrainingSearch onResultClick={() => setMobileSearchOpen(false)} />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileSearchOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
