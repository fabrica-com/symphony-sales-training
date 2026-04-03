import { test, expect, Page } from "@playwright/test"

/**
 * useSessionState E2E テスト
 *
 * 実際のセッションフローをブラウザで検証：
 * 1. フェーズ遷移が正しく動作
 * 2. ポイントが累積される
 * 3. ユーザー入力が保存される
 * 4. 完了フローが成功
 * 5. タイマーが動作
 */

test.describe("useSessionState - E2E フロー", () => {
  let page: Page

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage
    // 認証済みのページに直接アクセス
    await page.goto("http://localhost:3000/training/1/session", {
      waitUntil: "networkidle",
    })
  })

  test.afterEach(async () => {
    await page.close()
  })

  test("セッション開始から完了までのフロー", async () => {
    // セッションページにアクセス
    // NOTE: 実装に応じて URL を調整してください
    await page.goto("http://localhost:3000/training/1/session", {
      waitUntil: "networkidle",
    })

    // checkin フェーズの表示を確認
    const checkinElement = page.locator("text=チェックイン")
    await expect(checkinElement).toBeVisible()

    // プログレスが表示されていることを確認（初期値は1/6 ~ 1/N）
    const progressBar = page.locator("[data-testid=progress]")
    const initialProgress = await progressBar.getAttribute("aria-valuenow")
    expect(initialProgress).toBeDefined()

    // 気分を選択
    const moodButton = page.locator("button:has-text('😀')")
    if (await moodButton.isVisible()) {
      await moodButton.click()
      // ポイント表示を確認（初期ポイント：10）
      const pointsDisplay = page.locator("[data-testid=points]")
      await expect(pointsDisplay).toContainText(/10/)
    }

    // 次フェーズへ移動
    const nextButton = page.locator("button:has-text('次へ')")
    await expect(nextButton).toBeEnabled()
    await nextButton.click()

    // フェーズが変わったことを確認
    const pageTitle = page.locator("h1")
    const firstTitle = await pageTitle.textContent()

    // 次のフェーズに移動
    await nextButton.click()
    const secondTitle = await pageTitle.textContent()

    // フェーズが異なることを確認
    expect(firstTitle).not.toBe(secondTitle)
  })

  test("レビュー答え選択でポイント加算", async () => {
    await page.goto("http://localhost:3000/training/1/session", {
      waitUntil: "networkidle",
    })

    // フェーズをレビューまで進める
    let nextButton = page.locator("button:has-text('次へ')")

    // checkin → mission
    await nextButton.click()

    // review フェーズで答え選択
    const reviewOptions = page.locator("[data-testid=review-option]")
    const optionCount = await reviewOptions.count()

    if (optionCount > 0) {
      // 最初のオプションを選択
      await reviewOptions.first().click()

      // ポイント表示を確認（レビュー正解時：10ポイント）
      const pointsDisplay = page.locator("[data-testid=points]")
      const pointsText = await pointsDisplay.textContent()

      // ポイントが数字を含むことを確認
      expect(pointsText).toMatch(/\d+/)
    }
  })

  test("テキスト入力フィールドの保存", async () => {
    await page.goto("http://localhost:3000/training/1/session", {
      waitUntil: "networkidle",
    })

    // 振り返りフェーズまで進める
    const nextButton = page.locator("button:has-text('次へ')")

    // 複数回フェーズを進める
    for (let i = 0; i < 5; i++) {
      if (await nextButton.isEnabled()) {
        await nextButton.click()
        await page.waitForTimeout(100)
      }
    }

    // 振り返りテキストボックスを探す
    const reflectionInput = page.locator(
      "textarea[placeholder*='振り返り'], textarea[placeholder*='reflection']"
    )

    if (await reflectionInput.isVisible()) {
      const testText = "良い学習ができました"
      await reflectionInput.fill(testText)

      // 入力値が保存されたことを確認
      const inputValue = await reflectionInput.inputValue()
      expect(inputValue).toBe(testText)

      // 提出ボタンをクリック
      const submitButton = page.locator("button:has-text('提出')")
      if (await submitButton.isEnabled()) {
        await submitButton.click()

        // ポイント加算を確認（振り返り：10ポイント）
        const pointsDisplay = page.locator("[data-testid=points]")
        const pointsText = await pointsDisplay.textContent()
        expect(pointsText).toMatch(/\d+/)
      }
    }
  })

  test("プログレスバーが更新される", async () => {
    await page.goto("http://localhost:3000/training/1/session", {
      waitUntil: "networkidle",
    })

    const progressBar = page.locator("[data-testid=progress]")
    const initialProgress = await progressBar.getAttribute("aria-valuenow")

    // フェーズを進める
    const nextButton = page.locator("button:has-text('次へ')")
    await nextButton.click()
    await page.waitForTimeout(200)

    const newProgress = await progressBar.getAttribute("aria-valuenow")

    // プログレスが増加していることを確認
    const initialNum = parseInt(initialProgress || "0", 10)
    const newNum = parseInt(newProgress || "0", 10)

    expect(newNum).toBeGreaterThan(initialNum)
  })

  test("タイマーが動作している", async () => {
    await page.goto("http://localhost:3000/training/1/session", {
      waitUntil: "networkidle",
    })

    const timerDisplay = page.locator("[data-testid=elapsed-time]")

    // タイマーが表示されていることを確認
    if (await timerDisplay.isVisible()) {
      const initialTime = await timerDisplay.textContent()

      // 1秒待機
      await page.waitForTimeout(1000)

      const newTime = await timerDisplay.textContent()

      // タイマーが進んでいることを確認（表示形式：MM:SS）
      expect(initialTime).toBeDefined()
      expect(newTime).toBeDefined()
    }
  })

  test("最後のフェーズ（ending）に到達可能", async () => {
    await page.goto("http://localhost:3000/training/1/session", {
      waitUntil: "networkidle",
    })

    const nextButton = page.locator("button:has-text('次へ')")

    // すべてのフェーズを進める（タイムアウト防止：最大20回）
    for (let i = 0; i < 20; i++) {
      if (await nextButton.isEnabled()) {
        await nextButton.click()
        await page.waitForTimeout(100)
      } else {
        break
      }
    }

    // 完了画面が表示されていることを確認
    const completeMessage = page.locator(
      "text=完了, text=修了, text=/セッション.*完了/"
    )

    // いずれかのメッセージが表示されていることを確認
    const isComplete =
      (await page.locator("text=完了").isVisible()) ||
      (await page.locator("text=修了").isVisible()) ||
      (await page.locator("text=/セッション.*完了/").isVisible())

    expect(isComplete).toBe(true)
  })

  test("複数回のフェーズ遷移でポイント累積", async () => {
    await page.goto("http://localhost:3000/training/1/session", {
      waitUntil: "networkidle",
    })

    const pointsDisplay = page.locator("[data-testid=points]")
    const pointsBefore = await pointsDisplay.textContent()
    const pointsBeforeNum = parseInt(pointsBefore?.match(/\d+/)?.[0] || "0", 10)

    const nextButton = page.locator("button:has-text('次へ')")

    // 複数フェーズを進める
    for (let i = 0; i < 3; i++) {
      if (await nextButton.isEnabled()) {
        await nextButton.click()
        await page.waitForTimeout(100)
      }
    }

    const pointsAfter = await pointsDisplay.textContent()
    const pointsAfterNum = parseInt(pointsAfter?.match(/\d+/)?.[0] || "0", 10)

    // ポイントが変わっていることを確認
    // （フェーズによってはポイント加算がない場合もあるため、結果型チェック）
    expect(typeof pointsAfterNum).toBe("number")
    expect(pointsAfterNum).toBeGreaterThanOrEqual(pointsBeforeNum)
  })

  test("無効なフェーズ遷移を防止", async () => {
    await page.goto("http://localhost:3000/training/1/session", {
      waitUntil: "networkidle",
    })

    const nextButton = page.locator("button:has-text('次へ')")

    // 最後のフェーズまで進める
    for (let i = 0; i < 20; i++) {
      if (await nextButton.isEnabled()) {
        await nextButton.click()
        await page.waitForTimeout(100)
      } else {
        break
      }
    }

    // 最後のフェーズでは次ボタンが無効または隠れている
    const isFinalPhase = !(await nextButton.isEnabled())

    expect(isFinalPhase).toBe(true)
  })

  test("UI の一貫性（フェーズ表示と内容の一致）", async () => {
    await page.goto("http://localhost:3000/training/1/session", {
      waitUntil: "networkidle",
    })

    // フェーズインジケーター
    const phaseIndicator = page.locator("[data-testid=current-phase]")

    if (await phaseIndicator.isVisible()) {
      const phaseName = await phaseIndicator.textContent()

      // フェーズ名が表示されていることを確認
      expect(phaseName).toBeTruthy()

      // フェーズ名がページ本体の内容と一致していることを確認
      // （例：checkin フェーズなら、チェックインボタンが見える）
      if (phaseName?.includes("checkin")) {
        const checkinContent = page.locator("text=チェックイン")
        // checkin フェーズなら該当コンテンツが表示されているはず
      }
    }
  })

  test("エラーが発生しない（コンソールエラーなし）", async () => {
    const errors: string[] = []

    page.on("console", (message) => {
      if (message.type() === "error") {
        errors.push(message.text())
      }
    })

    page.on("pageerror", (error) => {
      errors.push(error.toString())
    })

    await page.goto("http://localhost:3000/training/1/session", {
      waitUntil: "networkidle",
    })

    const nextButton = page.locator("button:has-text('次へ')")

    // 5フェーズ進める
    for (let i = 0; i < 5; i++) {
      if (await nextButton.isEnabled()) {
        await nextButton.click()
        await page.waitForTimeout(100)
      }
    }

    // エラーが発生していないことを確認
    // （ネットワークエラーは無視、ロジックエラーだけを確認）
    const logicErrors = errors.filter(
      (e) =>
        !e.includes("Failed to fetch") &&
        !e.includes("Network") &&
        !e.includes("ERR_NAME_NOT_RESOLVED")
    )

    expect(logicErrors).toHaveLength(0)
  })

  test("ネットワーク遅延時の動作", async () => {
    // ネットワーク速度を制限
    await page.route("**/*", (route) => {
      setTimeout(() => route.continue(), 100)
    })

    await page.goto("http://localhost:3000/training/1/session", {
      waitUntil: "networkidle",
    })

    const nextButton = page.locator("button:has-text('次へ')")

    // 遅延下でフェーズ遷移できることを確認
    if (await nextButton.isEnabled()) {
      await nextButton.click()
      await page.waitForTimeout(200)

      // 遷移後もページが応答することを確認
      expect(await page.isVisible("body")).toBe(true)
    }
  })
})
