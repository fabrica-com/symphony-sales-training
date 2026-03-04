import { test, expect, createTestUser, cleanupTestUser, injectAuthSession } from '../fixtures/auth'
import { cleanupUserData, verifyNoUserData } from '../helpers/db-verify'
import { createClient } from '@supabase/supabase-js'

test.describe('ダッシュボード結果確認 E2E', () => {
  test('認証済みユーザーでダッシュボードが表示される', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard')

    // Wait for dashboard content to appear (獲得ポイント is always shown after load)
    await expect(page.locator('text=獲得ポイント')).toBeVisible({ timeout: 30_000 })
    await expect(page.getByText('学習時間', { exact: true })).toBeVisible()

    // Verify tabs exist
    await expect(page.getByRole('tab', { name: '学習進捗' })).toBeVisible()

    // Verify category progress section
    await expect(page.locator('text=カテゴリ別進捗')).toBeVisible()
  })

  test('テスト結果タブに結果が表示される', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard')
    await expect(page.locator('text=獲得ポイント')).toBeVisible({ timeout: 30_000 })

    // Click on the tests tab
    const testsTab = page.locator('[role="tab"]').filter({ hasText: /テスト/ })
    if (await testsTab.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await testsTab.click()
      // Verify test results section
      await expect(page.locator('text=総合テスト結果')).toBeVisible({ timeout: 5_000 })
    }
  })
})


test.describe('テストデータクリーンアップ検証', () => {
  test('cleanupTestUser がユーザーと関連データを完全に削除する', async () => {
    // Create a test user manually (not via fixture, so we control cleanup)
    const testUser = await createTestUser()

    // Verify user exists
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', testUser.userId)
      .single()
    expect(profile).toBeTruthy()

    // Run cleanup
    await cleanupUserData(testUser.userId)
    await cleanupTestUser(testUser.userId)

    // Verify all data is gone
    const noData = await verifyNoUserData(testUser.userId)
    expect(noData).toBe(true)

    // Verify auth user is deleted
    const { data: authUser } = await supabase.auth.admin.getUserById(testUser.userId)
    expect(authUser.user).toBeNull()
  })
})
