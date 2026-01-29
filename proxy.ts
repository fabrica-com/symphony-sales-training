import { type NextRequest, NextResponse } from "next/server"

/**
 * Proxy function for Next.js 16+
 * Minimal implementation - auth protection handled at component level
 */
export function proxy(request: NextRequest) {
  // Allow all paths through - auth is handled by client-side components
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
