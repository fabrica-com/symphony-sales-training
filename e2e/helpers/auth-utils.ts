import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { BrowserContext, Page } from '@playwright/test'

function getEnvOrThrow(key: string): string {
  const value = process.env[key]
  if (!value) throw new Error(`環境変数 ${key} が設定されていません`)
  return value
}

function getSupabaseAdmin(): SupabaseClient {
  return createClient(
    getEnvOrThrow('NEXT_PUBLIC_SUPABASE_URL'),
    getEnvOrThrow('SUPABASE_SERVICE_ROLE_KEY'),
  )
}

function getProjectRef(): string {
  const url = getEnvOrThrow('NEXT_PUBLIC_SUPABASE_URL')
  const hostname = new URL(url).hostname
  return hostname.split('.')[0]
}

export interface TestUser {
  userId: string
  email: string
  password: string
}

export async function createTestUser(): Promise<TestUser> {
  const supabase = getSupabaseAdmin()
  const timestamp = Date.now()
  const email = `e2e-test-${timestamp}@example.com`
  const password = `E2eTest!${timestamp}`

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: 'E2Eテストユーザー' },
  })

  if (error || !data.user) {
    throw new Error(`テストユーザー作成失敗: ${error?.message ?? 'unknown'}`)
  }

  // Profile may already exist via DB trigger (handle_new_user), so upsert
  const { error: profileError } = await supabase.from('profiles').upsert({
    id: data.user.id,
    email,
    name: 'E2Eテストユーザー',
    department: 'テスト部門',
    role: 'employee',
    join_date: new Date().toISOString().split('T')[0],
  }, { onConflict: 'id' })

  if (profileError) {
    await supabase.auth.admin.deleteUser(data.user.id)
    throw new Error(`プロフィール作成失敗: ${profileError.message}`)
  }

  return { userId: data.user.id, email, password }
}

/**
 * Inject an authenticated session into a browser context using
 * Admin API generateLink + verifyOtp (bypasses disabled email provider).
 */
export async function injectAuthSession(
  context: BrowserContext,
  email: string,
): Promise<void> {
  const supabase = getSupabaseAdmin()

  // Generate a magic link via Admin API
  const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
    type: 'magiclink',
    email,
  })
  if (linkError || !linkData?.properties?.hashed_token) {
    throw new Error(`マジックリンク生成失敗: ${linkError?.message ?? 'no hashed_token'}`)
  }

  // Verify OTP with anon client to get a real session
  const anonClient = createClient(
    getEnvOrThrow('NEXT_PUBLIC_SUPABASE_URL'),
    getEnvOrThrow('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  )
  const { data, error } = await anonClient.auth.verifyOtp({
    token_hash: linkData.properties.hashed_token,
    type: 'magiclink',
  })
  if (error || !data.session) {
    throw new Error(`セッション生成失敗: ${error?.message ?? 'no session'}`)
  }

  const session = data.session
  const projectRef = getProjectRef()
  const cookieName = `sb-${projectRef}-auth-token`
  const appURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3001'

  const sessionPayload = JSON.stringify({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_in: session.expires_in,
    expires_at: session.expires_at,
    token_type: session.token_type,
    user: session.user,
  })

  const CHUNK_SIZE = 3180
  const chunks: string[] = []
  for (let i = 0; i < sessionPayload.length; i += CHUNK_SIZE) {
    chunks.push(sessionPayload.slice(i, i + CHUNK_SIZE))
  }

  const cookieDomain = new URL(appURL).hostname
  const cookieBase = {
    domain: cookieDomain,
    path: '/',
    httpOnly: false,
    secure: false,
    sameSite: 'Lax' as const,
  }

  if (chunks.length === 1) {
    await context.addCookies([
      { ...cookieBase, name: cookieName, value: sessionPayload },
    ])
  } else {
    const cookies = chunks.map((chunk, i) => ({
      ...cookieBase,
      name: `${cookieName}.${i}`,
      value: chunk,
    }))
    await context.addCookies(cookies)
  }
}

export async function cleanupTestUser(userId: string): Promise<void> {
  const supabase = getSupabaseAdmin()

  // Tables with user_id column
  const userIdTables = [
    'training_sessions',
    'user_training_progress',
    'category_test_results',
    'final_exam_results',
  ]

  for (const table of userIdTables) {
    const { error } = await supabase.from(table).delete().eq('user_id', userId)
    if (error) {
      console.warn(`[cleanup] ${table} 削除警告: ${error.message}`)
    }
  }

  // profiles uses 'id' not 'user_id'
  const { error: profileError } = await supabase.from('profiles').delete().eq('id', userId)
  if (profileError) {
    console.warn(`[cleanup] profiles 削除警告: ${profileError.message}`)
  }

  const { error } = await supabase.auth.admin.deleteUser(userId)
  if (error) {
    console.warn(`[cleanup] Auth ユーザー削除警告: ${error.message}`)
  }
}

export async function extractUserId(page: Page): Promise<string> {
  const cookies = await page.context().cookies()
  const authCookies = cookies
    .filter(c => c.name.includes('auth-token'))
    .sort((a, b) => a.name.localeCompare(b.name))
  const raw = authCookies.map(c => c.value).join('')
  try {
    const session = JSON.parse(raw)
    return session.user?.id ?? ''
  } catch {
    return ''
  }
}
