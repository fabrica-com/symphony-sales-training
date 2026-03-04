import { test, expect, extractUserId } from '../fixtures/auth'
import { getTrainingSessions, getTrainingProgress } from '../helpers/db-verify'

// Use training ID 1 (first training in the DB)
const TRAINING_ID = 1

test.describe('トレーニングセッション E2E', () => {
  test.setTimeout(180_000)

  test('セッション全フェーズを完了し、DBにレコードが保存される', async ({ authenticatedPage: page }) => {
    await page.goto(`/training/${TRAINING_ID}/session`)
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

    // --- Helpers ---
    async function clickFirstVisible(patterns: (string | RegExp)[], timeout = 500): Promise<boolean> {
      for (const p of patterns) {
        const btn = page.getByRole('button', { name: p })
        if (await btn.first().isVisible({ timeout }).catch(() => false)) {
          await btn.first().click()
          await page.waitForTimeout(350)
          return true
        }
      }
      return false
    }

    async function isEnding(): Promise<boolean> {
      return page.locator('text=今日もお疲れ様でした').isVisible({ timeout: 500 }).catch(() => false)
    }

    // --- Phase: checkin (mood selection) ---
    const moodButtons = page.locator('button').filter({ hasText: /😊|😐|😔|🔥|😴/ })
    if (await moodButtons.first().isVisible({ timeout: 10_000 }).catch(() => false)) {
      await moodButtons.first().click()
      await page.waitForTimeout(300)
      await clickFirstVisible(['次へ'])
    }

    // --- Navigate through all remaining phases ---
    const MAX_ITERATIONS = 100
    for (let i = 0; i < MAX_ITERATIONS; i++) {
      if (await isEnding()) break

      // A) Quiz-style option buttons: review, quickcheck, simulation
      //    These render as <Button> with "A) ...", "B) ...", etc.
      const quizOption = page.locator('button:not([disabled])').filter({ hasText: /^[A-D]\)/ }).first()
      if (await quizOption.isVisible({ timeout: 400 }).catch(() => false)) {
        await quizOption.click()
        await page.waitForTimeout(600)
        // After answering, a next button appears
        await clickFirstVisible(['次へ進む', '次の問題', '次のシナリオ', '次へ'])
        continue
      }

      // B) Story scene advance: "次のシーン" or "+20pt 次へ進む"
      const storyBtn = page.getByRole('button', { name: /次のシーン/ })
      if (await storyBtn.isVisible({ timeout: 300 }).catch(() => false)) {
        await storyBtn.click()
        await page.waitForTimeout(300)
        continue
      }

      // C) Roleplay dialogue: "次の会話を見る"
      const dialogueBtn = page.getByRole('button', { name: /次の会話を見る/ })
      if (await dialogueBtn.isVisible({ timeout: 300 }).catch(() => false)) {
        await dialogueBtn.click()
        await page.waitForTimeout(300)
        continue
      }

      // D) Roleplay completion: "理解しました"
      const understandBtn = page.getByRole('button', { name: /理解しました/ })
      if (await understandBtn.isVisible({ timeout: 300 }).catch(() => false)) {
        await understandBtn.click()
        await page.waitForTimeout(400)
        // Then "次のロールプレイ" or "次へ進む" appears
        await clickFirstVisible(['次のロールプレイ', '次へ進む', '次へ'])
        continue
      }

      // E) Action selection phase: look for the action declaration section
      //    The action phase has a title "今日の実践アクション" and multiple outline buttons
      const actionTitle = page.locator('text=今日の実践アクション')
      if (await actionTitle.isVisible({ timeout: 300 }).catch(() => false)) {
        // Click the first outline action button (not the "宣言する" button)
        const actionBtns = page.locator('button').filter({ has: page.locator('text=今日の実践アクション').locator('..').locator('..') })
        // Simpler: just click any outline button that's NOT "宣言する" and NOT "ログアウト"
        const outlineBtns = page.locator('button[class*="justify-start"]')
        if (await outlineBtns.first().isVisible({ timeout: 300 }).catch(() => false)) {
          await outlineBtns.first().click()
          await page.waitForTimeout(400)
        }
        // Now "宣言する" button should appear
        await clickFirstVisible([/宣言する/])
        continue
      }

      // F) Textarea (reflection, work)
      const textarea = page.locator('textarea').first()
      if (await textarea.isVisible({ timeout: 300 }).catch(() => false)) {
        await textarea.fill('E2Eテスト入力です')
        await page.waitForTimeout(200)
      }

      // G) Input fields (work fields)
      const inputs = page.locator('input[type="text"], input[placeholder]')
      const inputCount = await inputs.count()
      for (let j = 0; j < Math.min(inputCount, 5); j++) {
        const input = inputs.nth(j)
        if (await input.isVisible({ timeout: 200 }).catch(() => false)) {
          const val = await input.inputValue()
          if (!val) {
            await input.fill('E2Eテスト')
            await page.waitForTimeout(100)
          }
        }
      }

      // H) Try all known "next" button patterns
      const clicked = await clickFirstVisible([
        /完了して次へ/,
        /送信して次へ/,
        /読了する/,
        /次へ進む/,
        '研修を始める',
        '次へ',
      ])

      if (!clicked) {
        // Nothing clickable found — wait and retry
        await page.waitForTimeout(1500)
      }
    }

    // Verify we reached the ending phase
    await expect(page.locator('text=今日もお疲れ様でした')).toBeVisible({ timeout: 15_000 })
    await expect(page.locator('text=学習履歴が保存されました')).toBeVisible({ timeout: 10_000 })

    // DB verification
    const userId = await extractUserId(page)
    expect(userId).toBeTruthy()

    // Poll DB for the result
    let sessions: Awaited<ReturnType<typeof getTrainingSessions>> = []
    for (let attempt = 0; attempt < 15; attempt++) {
      sessions = await getTrainingSessions(userId)
      if (sessions.length > 0) break
      await page.waitForTimeout(1_000)
    }

    expect(sessions.length).toBeGreaterThanOrEqual(1)
    const latestSession = sessions[0]
    expect(latestSession.training_id).toBe(TRAINING_ID)
    expect(latestSession.overall_score).toBeGreaterThanOrEqual(0)
    // max_score が全フェーズ分を反映していること（旧バグ: 170固定だった）
    expect(latestSession.max_score).toBeGreaterThan(170)
    // overall_score は max_score 以下であること
    expect(latestSession.overall_score).toBeLessThanOrEqual(latestSession.max_score)

    const progress = await getTrainingProgress(userId)
    const trainingProgress = progress.find(p => p.training_id === TRAINING_ID)
    expect(trainingProgress).toBeTruthy()
    expect(trainingProgress!.status).toBe('completed')
  })
})
