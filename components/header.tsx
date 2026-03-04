"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { User, LogIn, LogOut, Search, X, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { TrainingSearch } from "@/components/training-search"

export function Header() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // ログインページではヘッダーを表示しない
  if (pathname === "/login") {
    return null
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="/symphony-logo.svg"
              alt="symphony研修"
              width={145}
              height={26}
              className="h-auto w-auto max-h-8"
            />
          </Link>
          <div className="hidden md:block flex-1 max-w-md">
            <TrainingSearch />
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <nav className="hidden sm:flex items-center gap-4 md:gap-6">
              <Link
                href="/"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                カリキュラム
              </Link>
              {user && (
                <>
                  <Link
                    href="/final-exam"
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    修了テスト
                  </Link>
                  <Link
                    href="/dashboard"
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    ダッシュボード
                  </Link>
                </>
              )}
            </nav>
            {user ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{user.name || user.email || "ユーザー"}</span>
                </div>
                <Button variant="ghost" size="icon" className="hidden sm:flex h-8 w-8" onClick={logout} title="ログアウト">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button asChild size="sm" className="hidden sm:inline-flex">
                <Link href="/login">
                  <LogIn className="h-4 w-4 mr-2" />
                  ログイン
                </Link>
              </Button>
            )}
            {/* Mobile hamburger button */}
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden h-8 w-8"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="メニューを開く"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-border bg-background sm:hidden">
          <nav className="mx-auto max-w-7xl px-4 py-3 flex flex-col gap-1">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              カリキュラム
            </Link>
            {user && (
              <>
                <Link
                  href="/final-exam"
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  修了テスト
                </Link>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  ダッシュボード
                </Link>
              </>
            )}
            <button
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground w-full text-left"
              onClick={() => {
                setMobileMenuOpen(false)
                setMobileSearchOpen(true)
              }}
            >
              <Search className="h-4 w-4" />
              研修を検索
            </button>
            <div className="border-t border-border my-1" />
            {user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{user.name || user.email || "ユーザー"}</span>
                </div>
                <button
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground w-full text-left"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    logout()
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  ログアウト
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                <LogIn className="h-4 w-4" />
                ログイン
              </Link>
            )}
          </nav>
        </div>
      )}

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
