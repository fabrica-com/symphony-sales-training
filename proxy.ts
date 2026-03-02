import { type NextRequest, NextResponse } from "next/server"
import { updateSession } from "@/lib/supabase/proxy"

/**
 * Proxy function for Next.js 16+
 * - Automatically refreshes expired Auth tokens and stores them in cookies
 * - Enforces authentication for all routes except public paths
 */
export async function proxy(request: NextRequest) {
  // 1. セッションを更新しつつ、supabaseクライアントとユーザー情報を受け取る
  const { response, user } = await updateSession(request)

  // 2. 認証が不要なパスを定義
  const pathname = request.nextUrl.pathname
  const isPublicPath =
    pathname === "/login" ||
    pathname === "/auth/callback" ||
    pathname.startsWith("/api/") || // APIルートは個別に保護（必要に応じて）
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon.ico") ||
    /\.(svg|png|jpg|jpeg|gif|webp|ico)$/.test(pathname)

  // 3. 【凍結ガード】/admin/* は実装凍結中 → 404 を返す
  if (pathname.startsWith("/admin")) {
    return new NextResponse(null, { status: 404 })
  }

  // 4. 【認証ガード】未ログインかつ公開パス以外の場合は /login へリダイレクト
  if (!user && !isPublicPath) {
    const loginUrl = new URL("/login", request.url)
    // 元のURLを保存して、ログイン後に戻れるようにする
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // 5. ログイン済みユーザーが /login にアクセスした場合は /dashboard へリダイレクト
  if (user && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * 
     * Note: /login and /auth/callback are included in the matcher
     * but handled explicitly in the proxy function above
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}