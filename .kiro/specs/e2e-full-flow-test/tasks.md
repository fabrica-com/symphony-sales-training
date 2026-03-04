# 実装計画: E2Eフルフローテスト

## 概要

Playwrightを使用したE2Eテストスイートを段階的に構築する。認証バイパス → DB検証ヘルパー → 各テストスペック → クリーンアップの順で実装し、各ステップで動作確認を行う。

## タスク

- [x] 1. Playwright環境セットアップ
  - [x] 1.1 Playwrightと関連パッケージをインストールし、`playwright.config.ts` を作成する
    - `@playwright/test` をdevDependenciesに追加
    - `playwright.config.ts` に baseURL: `http://localhost:3000`、testDir: `./e2e`、timeout: 60秒、chromiumプロジェクトを設定
    - `package.json` に `"test:e2e": "playwright test"` スクリプトを追加
    - _Requirements: 1.1, 1.2_

  - [x] 1.2 E2Eテスト用ディレクトリ構造を作成する
    - `e2e/fixtures/`、`e2e/helpers/`、`e2e/specs/` ディレクトリを作成
    - _Requirements: 1.1_

- [x] 2. 認証バイパスとDB検証ヘルパーの実装
  - [x] 2.1 認証フィクスチャ (`e2e/fixtures/auth.ts`) を実装する
    - Supabase Admin APIを使用して `e2e-test-{timestamp}@example.com` 形式のテストユーザーを作成する `createTestUser()` 関数
    - `profiles` テーブルにテストユーザーのプロフィールを挿入する処理
    - `supabase.auth.admin.generateLink({ type: 'magiclink' })` でトークンを取得し、Supabase SSRクッキー形式（`sb-<project-ref>-auth-token`）でブラウザコンテキストに注入する `injectAuthSession()` 関数
    - テストユーザーと関連データを削除する `cleanupTestUser()` 関数
    - 環境変数（`SUPABASE_SERVICE_ROLE_KEY`、`NEXT_PUBLIC_SUPABASE_URL`）未設定時のエラーハンドリング
    - Playwrightカスタムフィクスチャとして `authenticatedPage` と `testUserId` をエクスポート
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 7.4_

  - [x] 2.2 DB検証ヘルパー (`e2e/helpers/db-verify.ts`) を実装する
    - Supabase Admin Clientを使用して各テーブルからユーザーのレコードを取得する関数群: `getTrainingSessions()`, `getTrainingProgress()`, `getCategoryTestResults()`, `getFinalExamResults()`
    - ユーザーに関連する全テストデータを削除する `cleanupUserData()` 関数（`training_sessions`, `user_training_progress`, `category_test_results`, `final_exam_results`, `profiles` テーブル）
    - _Requirements: 3.3, 3.4, 4.3, 4.4, 5.3, 5.4, 7.1_

  - [ ]* 2.3 プロパティベーステスト: テスト結果レコードの不変条件を検証する
    - **Property 1: テスト結果レコードの不変条件**
    - fast-checkを使用して、任意のテスト結果レコードに対して `score >= 0`、`percentage` は 0〜100、`total_questions > 0`、`correct_count >= 0 && correct_count <= total_questions`、`duration >= 0` が成り立つことを検証
    - Vitestテストファイル: `__tests__/e2e-result-invariants.test.ts`
    - **Validates: Requirements 4.4, 5.4**

  - [ ]* 2.4 プロパティベーステスト: テストデータのプレフィックス識別性を検証する
    - **Property 2: テストデータのプレフィックス識別性**
    - fast-checkを使用して、任意のタイムスタンプに対して生成されるテストユーザーメールが `e2e-test-` プレフィックスを含むことを検証
    - Vitestテストファイル: `__tests__/e2e-test-data-prefix.test.ts`
    - **Validates: Requirements 7.4**

- [x] 3. チェックポイント - 認証バイパスの動作確認
  - 認証フィクスチャとDB検証ヘルパーが正しく動作することを確認する。テストが全てパスすることを確認し、問題があればユーザーに質問する。

- [x] 4. 未認証アクセス保護テスト
  - [x] 4.1 `e2e/specs/auth-guard.spec.ts` を実装する
    - 未認証状態で `/dashboard` にアクセスし、`/login` へリダイレクトされることを確認
    - 未認証状態で `/training/1/session` にアクセスし、`/login` へリダイレクトされることを確認
    - 認証フィクスチャを使用せず、素のPlaywrightテストとして実装
    - _Requirements: 8.1, 8.2_

- [x] 5. トレーニングセッションE2Eテスト
  - [x] 5.1 `e2e/specs/training-session.spec.ts` を実装する
    - 認証フィクスチャを使用してログイン状態を確立
    - DBに存在するトレーニングIDを使用して `/training/[id]/session` にアクセス
    - セッションの最初のフェーズが表示されることを確認
    - 各フェーズの「次へ」ボタンやインタラクション要素を操作してフェーズを進める
    - セッション完了後、DB検証ヘルパーで `training_sessions` テーブルにレコードが存在することを確認
    - DB検証ヘルパーで `user_training_progress` テーブルにレコードが存在することを確認
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 6. カテゴリテストE2Eテスト
  - [x] 6.1 `e2e/specs/category-test.spec.ts` を実装する
    - 認証フィクスチャを使用してログイン状態を確立
    - DBに存在するカテゴリIDを使用して `/category/[id]/test` にアクセス
    - テスト問題と選択肢が表示されることを確認
    - 全問に対してランダムまたは固定の選択肢をクリックして回答
    - 提出後、結果画面にスコアと合否が表示されることを確認
    - DB検証ヘルパーで `category_test_results` テーブルにレコードが存在し、フィールドが妥当な値であることを確認
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 7. 修了テストE2Eテスト
  - [x] 7.1 `e2e/specs/final-exam.spec.ts` を実装する
    - 認証フィクスチャを使用してログイン状態を確立
    - `/final-exam` にアクセス
    - テスト問題が表示されることを確認
    - 全問に対して選択肢をクリックして回答（100問）
    - 提出後、結果画面にスコアと合否が表示されることを確認
    - DB検証ヘルパーで `final_exam_results` テーブルにレコードが存在し、フィールドが妥当な値であることを確認
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 8. ダッシュボード結果確認E2Eテスト
  - [x] 8.1 `e2e/specs/dashboard.spec.ts` を実装する
    - 認証フィクスチャを使用してログイン状態を確立
    - `/dashboard` にアクセス
    - トレーニング完了情報がダッシュボードに表示されていることを確認（テスト5で作成されたデータ）
    - テスト結果がダッシュボードに表示されていることを確認（テスト6, 7で作成されたデータ）
    - 進捗情報が更新されていることを確認
    - _Requirements: 6.1, 6.2, 6.3_

- [x] 9. テストデータクリーンアップの検証
  - [x] 9.1 クリーンアップ処理の統合テストを `e2e/specs/dashboard.spec.ts` の `afterAll` に実装する
    - テストスイート完了後に `cleanupUserData()` と `cleanupTestUser()` を実行
    - クリーンアップ後、DB検証ヘルパーで全関連テーブルにTest_Userのレコードが存在しないことを確認
    - Supabase Auth からTest_Userアカウントが削除されていることを確認
    - _Requirements: 7.1, 7.2, 7.3_

- [x] 10. 最終チェックポイント - 全テストの実行確認
  - 全てのE2Eテストとプロパティベーステストがパスすることを確認する。問題があればユーザーに質問する。

## 備考

- `*` マーク付きのタスクはオプションであり、MVP実装時にスキップ可能
- 各タスクは特定の要件にトレースバック可能
- チェックポイントで段階的に動作確認を行う
- プロパティベーステストはユニバーサルな正当性プロパティを検証する
- ユニットテストは特定の例とエッジケースを検証する
- E2Eテストは開発サーバー（`localhost:3000`）が起動している状態で実行する必要がある
