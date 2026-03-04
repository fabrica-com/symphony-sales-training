import { test, expect, extractUserId } from '../fixtures/auth'
import { getCategoryTestResults, clearNotifications, waitForNotification } from '../helpers/db-verify'

// Category C has a test in the DB
const CATEGORY_ID = 'C'

test.describe('カテゴリテスト E2E', () => {
  test.setTimeout(120_000)

  test('全問回答して提出 → DB保存 + Chatwork通知を検証', async ({ authenticatedPage: page }) => {
    // 通知バッファをクリア
    await clearNotifications()

    // Navigate to category test
    await page.goto(`/category/${CATEGORY_ID}/test`)

    // Wait for intro phase to load
    await expect(page.getByRole('button', { name: 'テストを開始する' })).toBeVisible({ timeout: 15_000 })

    // Start the test
    await page.getByRole('button', { name: 'テストを開始する' }).click()

    // Wait for first question to appear
    await expect(page.locator('text=問題 1 /')).toBeVisible({ timeout: 10_000 })

    // Answer all questions
    const MAX_QUESTIONS = 50 // safety limit
    for (let q = 0; q < MAX_QUESTIONS; q++) {
      const radioItems = page.locator('[role="radio"]')
      await radioItems.first().waitFor({ timeout: 5_000 })
      await radioItems.first().click()

      const submitBtn = page.getByRole('button', { name: 'テストを提出する' })
      const isLastQuestion = await submitBtn.isVisible({ timeout: 300 }).catch(() => false)

      if (isLastQuestion) {
        await submitBtn.click()
        break
      }

      await page.getByRole('button', { name: '次の問題へ' }).click()
      await page.waitForTimeout(300)
    }

    // Verify result phase — heading shows 合格 or 不合格
    await expect(
      page.getByText('不合格', { exact: true }).or(page.getByText('合格！', { exact: true })).or(page.getByText('合格', { exact: true }))
    ).toBeVisible({ timeout: 10_000 })

    // Verify score display
    await expect(page.getByText('正答率', { exact: true })).toBeVisible()
    await expect(page.getByText('正解数', { exact: true })).toBeVisible()

    // Verify "テスト結果がダッシュボードに保存されました" message
    await expect(page.locator('text=テスト結果がダッシュボードに保存されました')).toBeVisible({ timeout: 5_000 })

    // --- DB検証: 誰が・何点・合否 ---
    const userId = await extractUserId(page)
    expect(userId).toBeTruthy()

    let results: Awaited<ReturnType<typeof getCategoryTestResults>> = []
    for (let attempt = 0; attempt < 15; attempt++) {
      results = await getCategoryTestResults(userId)
      if (results.length > 0) break
      await page.waitForTimeout(1_000)
    }

    expect(results.length).toBeGreaterThanOrEqual(1)

    const latest = results[0]
    expect(latest.category_id).toBe(CATEGORY_ID)
    expect(latest.user_id).toBe(userId) // 誰が
    expect(latest.score).toBeGreaterThanOrEqual(0) // 何点
    expect(latest.percentage).toBeGreaterThanOrEqual(0)
    expect(latest.percentage).toBeLessThanOrEqual(100)
    expect(latest.total_questions).toBeGreaterThan(0)
    expect(latest.correct_count).toBeGreaterThanOrEqual(0)
    expect(latest.correct_count).toBeLessThanOrEqual(latest.total_questions)
    expect(typeof latest.passed).toBe('boolean') // 合否
    expect(latest.duration_seconds).toBeGreaterThanOrEqual(0)

    // --- Chatwork通知検証 ---
    const notification = await waitForNotification('category_test')
    expect(notification).not.toBeNull()
    expect(notification!.message).toContain('カテゴリテスト完了')
    expect(notification!.message).toContain('E2Eテストユーザー') // ユーザー名
    expect(notification!.message).toContain(`${latest.percentage}%`) // 正答率
    // 合否の表示
    if (latest.passed) {
      expect(notification!.message).toContain('✅ 合格')
    } else {
      expect(notification!.message).toContain('❌ 不合格')
    }
  })
})
