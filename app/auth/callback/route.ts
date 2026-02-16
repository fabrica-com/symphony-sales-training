import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const errorParam = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')
  
  // Handle OAuth errors from provider
  if (errorParam) {
    console.error('[v0] OAuth callback error:', errorParam, errorDescription)
    return NextResponse.redirect(`${origin}/login?error=oauth_error&message=${encodeURIComponent(errorDescription || errorParam)}`)
  }

  // if "next" is in param, use it as the redirect URL
  let next = searchParams.get('next') ?? '/dashboard'
  if (!next.startsWith('/')) {
    // if "next" is not a relative URL, use the default
    next = '/dashboard'
  }

  if (code) {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('[v0] exchangeCodeForSession error:', error.message, error.status, error)
        return NextResponse.redirect(`${origin}/login?error=auth_code_error&message=${encodeURIComponent(error.message)}`)
      }
      
      if (data?.session) {
        // Redirect to dashboard after successful authentication
        const redirectTo = new URL(next, origin)
        return NextResponse.redirect(redirectTo)
      }
    } catch (err) {
      console.error('[v0] Unexpected error in callback:', err)
      return NextResponse.redirect(`${origin}/login?error=auth_code_error&message=${encodeURIComponent(err instanceof Error ? err.message : 'Unknown error')}`)
    }
  }

  // If no code, redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=auth_code_error&message=${encodeURIComponent('認証コードが提供されませんでした')}`)
}

