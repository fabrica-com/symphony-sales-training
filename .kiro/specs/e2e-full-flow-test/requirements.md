# 要件定義書

## はじめに

日本語営業トレーニングプラットフォームのE2Eテストスイートを構築する。ログインからトレーニングセッション完了、カテゴリテスト受験、修了テスト受験、ダッシュボードでの結果確認までの完全なユーザージャーニーを自動テストでカバーする。Google OAuthは直接自動化できないため、Supabase Admin APIを使用してテストユーザーのセッションを作成し、認証クッキーを注入するバイパス方式を採用する。

## 用語集

- **E2E_Test_Suite**: Playwrightベースのエンドツーエンドテストスイート全体
- **Auth_Bypass**: Supabase Admin APIを使用してテストユーザーを作成し、認証クッキーをブラウザに注入することでGoogle OAuthフローをバイパスする仕組み
- **Test_User**: E2Eテスト専用に作成される一時的なSupabaseユーザー
- **Training_Session**: `/training/[id]/session` で実行されるインタラクティブな多段階トレーニング（checkin → review → mission → story → quiz → simulation → roleplay → work → reflection → complete → action → deepdive → ending）
- **Category_Test**: `/category/[id]/test` で実施されるカテゴリ別の選択式テスト
- **Final_Exam**: `/final-exam` で実施される100問の修了テスト（制限時間30分）
- **Dashboard**: `/dashboard` でユーザーの進捗、テスト結果、トレーニングログを表示するページ
- **Supabase_Admin_Client**: `SUPABASE_SERVICE_ROLE_KEY` を使用してRLSをバイパスするサーバーサイドSupabaseクライアント

## 要件

### 要件1: テスト環境セットアップ

**ユーザーストーリー:** 開発者として、Playwrightの設定とテストヘルパーが整備された環境が欲しい。これにより、E2Eテストを安定して実行できる。

#### 受入基準

1. THE E2E_Test_Suite SHALL Playwrightの設定ファイル、テストヘルパー、環境変数の型定義を含むプロジェクト構成を提供する
2. WHEN E2Eテストが実行される時、THE E2E_Test_Suite SHALL 開発サーバー（localhost:3000）に対してテストを実行する
3. THE E2E_Test_Suite SHALL テスト実行前にテストデータのクリーンアップを行い、テスト間の独立性を保証する

### 要件2: 認証バイパス

**ユーザーストーリー:** 開発者として、Google OAuthを経由せずにテストユーザーとしてログイン状態を再現したい。これにより、認証が必要なページのE2Eテストを自動化できる。

#### 受入基準

1. WHEN テストが開始される時、THE Auth_Bypass SHALL Supabase Admin APIを使用してTest_Userを作成する
2. WHEN Test_Userが作成された時、THE Auth_Bypass SHALL そのユーザーのセッショントークンを生成し、Playwrightブラウザコンテキストに認証クッキーとして注入する
3. WHEN 認証クッキーが注入された状態でページにアクセスした時、THE E2E_Test_Suite SHALL サーバーサイドの `getCurrentUserId()` がTest_UserのIDを返すことを確認する
4. WHEN テストが完了した時、THE Auth_Bypass SHALL Test_Userおよび関連するテストデータをSupabaseから削除する
5. IF Supabase Admin APIへの接続が失敗した場合、THEN THE Auth_Bypass SHALL 明確なエラーメッセージを出力してテストを中断する

### 要件3: トレーニングセッションフロー

**ユーザーストーリー:** テスト担当者として、トレーニングセッションの全フェーズが正常に遷移し、完了後にデータが保存されることを確認したい。

#### 受入基準

1. WHEN 認証済みユーザーがトレーニングセッションページにアクセスした時、THE E2E_Test_Suite SHALL セッションの最初のフェーズが表示されることを確認する
2. WHEN ユーザーが各フェーズの操作を完了した時、THE E2E_Test_Suite SHALL 次のフェーズへ正常に遷移することを確認する
3. WHEN トレーニングセッションが完了した時、THE E2E_Test_Suite SHALL `training_sessions` テーブルにTest_Userのセッションレコードが保存されていることをSupabase Admin APIで検証する
4. WHEN トレーニングセッションが完了した時、THE E2E_Test_Suite SHALL `user_training_progress` テーブルにTest_Userの進捗レコードが保存されていることをSupabase Admin APIで検証する

### 要件4: カテゴリテストフロー

**ユーザーストーリー:** テスト担当者として、カテゴリテストの受験から結果保存までの一連のフローが正常に動作することを確認したい。

#### 受入基準

1. WHEN 認証済みユーザーがカテゴリテストページにアクセスした時、THE E2E_Test_Suite SHALL テスト問題と選択肢が表示されることを確認する
2. WHEN ユーザーが全問に回答して提出した時、THE E2E_Test_Suite SHALL 結果画面にスコアと合否が表示されることを確認する
3. WHEN カテゴリテストが完了した時、THE E2E_Test_Suite SHALL `category_test_results` テーブルにTest_Userの結果レコードが保存されていることをSupabase Admin APIで検証する
4. WHEN カテゴリテスト結果がDBに保存された時、THE E2E_Test_Suite SHALL 保存されたレコードの `score`、`percentage`、`passed`、`correct_count`、`total_questions` フィールドが全て存在し、妥当な値であることを検証する

### 要件5: 修了テストフロー

**ユーザーストーリー:** テスト担当者として、修了テストの受験から結果保存までの一連のフローが正常に動作することを確認したい。

#### 受入基準

1. WHEN 認証済みユーザーが修了テストページにアクセスした時、THE E2E_Test_Suite SHALL テスト問題が表示されることを確認する
2. WHEN ユーザーが全問に回答して提出した時、THE E2E_Test_Suite SHALL 結果画面にスコアと合否が表示されることを確認する
3. WHEN 修了テストが完了した時、THE E2E_Test_Suite SHALL `final_exam_results` テーブルにTest_Userの結果レコードが保存されていることをSupabase Admin APIで検証する
4. WHEN 修了テスト結果がDBに保存された時、THE E2E_Test_Suite SHALL 保存されたレコードの `score`、`percentage`、`passed`、`correct_count`、`total_questions`、`duration` フィールドが全て存在し、妥当な値であることを検証する

### 要件6: ダッシュボード結果確認

**ユーザーストーリー:** テスト担当者として、トレーニングやテストの完了後にダッシュボードに結果が正しく反映されることを確認したい。

#### 受入基準

1. WHEN トレーニングセッション完了後にダッシュボードにアクセスした時、THE E2E_Test_Suite SHALL 完了したトレーニングの情報がダッシュボードに表示されていることを確認する
2. WHEN カテゴリテスト完了後にダッシュボードにアクセスした時、THE E2E_Test_Suite SHALL テスト結果がダッシュボードに表示されていることを確認する
3. WHEN 全フロー完了後にダッシュボードにアクセスした時、THE E2E_Test_Suite SHALL 進捗情報が更新されていることを確認する

### 要件7: テストデータ管理

**ユーザーストーリー:** 開発者として、テスト実行後にテストデータが確実にクリーンアップされることを保証したい。これにより、本番データへの影響を防ぎ、テストの再現性を確保できる。

#### 受入基準

1. WHEN テストスイートが完了した時、THE E2E_Test_Suite SHALL Test_Userに関連する全てのレコード（`training_sessions`、`user_training_progress`、`category_test_results`、`final_exam_results`、`profiles`）を削除する
2. WHEN テストスイートが完了した時、THE Auth_Bypass SHALL Supabase Auth からTest_Userアカウントを削除する
3. IF テスト実行中にエラーが発生した場合、THEN THE E2E_Test_Suite SHALL クリーンアップ処理を実行してからテストを終了する
4. THE E2E_Test_Suite SHALL テスト用データを識別可能なプレフィックス（例: `e2e-test-`）を付与して作成し、本番データとの混同を防止する

### 要件8: 未認証アクセス保護

**ユーザーストーリー:** テスト担当者として、認証が必要なページに未認証でアクセスした場合に適切にリダイレクトされることを確認したい。

#### 受入基準

1. WHEN 未認証ユーザーがダッシュボードにアクセスした時、THE E2E_Test_Suite SHALL ログインページへリダイレクトされることを確認する
2. WHEN 未認証ユーザーがトレーニングセッションページにアクセスした時、THE E2E_Test_Suite SHALL ログインページへリダイレクトされることを確認する
