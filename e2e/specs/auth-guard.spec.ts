import { test, expect } from '@playwright/test'

test.describe('未認証アクセス保護', () => {
  test('未認証で /dashboard にアクセスすると /login へリダイレクトされる', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/login/)
  })

  test('未認証で /training/1/session にアクセスすると /login へリダイレクトされる', async ({ page }) => {
    await page.goto('/training/1/session')
    await expect(page).toHaveURL(/\/login/)
  })
})
