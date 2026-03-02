# Requirements Document

## Introduction

研修管理システムの全フロー（認証→研修セッション完了→カテゴリテスト→修了テスト→ダッシュボード確認）をサーバーアクション/Supabase APIレベルで自動化テストする統合テストスイートを構築する。ブラウザE2Eではなく、vitestを使用したサーバーサイド統合テストとして実装し、テストユーザーの作成・クリーンアップをSupabase Admin APIで行う。

## Glossary

- **Test_Harness**: テストユーザーの作成、認証セッションの確立、テスト後のデータクリーンアップを管理するテストインフラストラクチャ
- **Admin_Client**: Supabase service_role keyを使用してRLSをバイパスするサーバーサイドクライアント（`createAdminClient`）
- **Server_Action**: Next.jsの`"use server"`ディレクティブで定義されたサーバーサイド関数（`saveTrainingSession`, `saveTestResult`, `saveFinalExamResultAction`等）
- **Training_Session**: ユーザーが研修問題を完了した記録（`training_sessions`テーブル）
- **Training_Progress**: ユーザーの研修完了状態（`user_training_progress`テーブル）
- **Category_Test**: カテゴリ別の総合テスト（`category_tests` + `category_test_questions`テーブル）
- **Category_Test_Result**: カテゴリテストの結果記録（`category_test_results`テーブル）
- **Final_Exam**: 修了テスト（`final_exam_config` + `final_exam_questions`テーブル）
- **Final_Exam_Result**: 修了テストの結果記録（`final_exam_results`テーブル）
- **Test_User**: テスト専用に作成される一時的なSupabaseユーザー（テスト後に削除される）
- **Scoring_Engine**: サーバーサイドで回答を正解と照合し、スコア・合否を算出するロジック

## Requirements

### Requirement 1: テストユーザーの認証セッション確立

**User Story:** As a テスト実行者, I want to Supabase Admin APIでテストユーザーを作成しセッションを確立する, so that ブラウザやOAuthフローなしでサーバーアクションをテストできる。

#### Acceptance Criteria

1. WHEN a テストスイートが開始される, THE Test_Harness SHALL Supabase Admin APIを使用してテスト専用ユーザーを作成する
2. WHEN a Test_Userが作成される, THE Test_Harness SHALL そのユーザーのprofilesレコードを作成する（name, department, role等の必須フィールドを含む）
3. WHEN a テストスイートが完了する, THE Test_Harness SHALL テスト中に作成された全てのデータ（training_sessions, user_training_progress, category_test_results, final_exam_results, profiles）を削除する
4. WHEN a テストスイートが完了する, THE Test_Harness SHALL テスト専用ユーザーをSupabase Admin APIで削除する
5. IF テストユーザーの作成に失敗した場合, THEN THE Test_Harness SHALL 明確なエラーメッセージを返しテストをスキップする

### Requirement 2: 研修セッションの保存と記録検証

**User Story:** As a テスト実行者, I want to 研修セッション完了フローをテストする, so that saveTrainingSessionが正しくデータを保存することを検証できる。

#### Acceptance Criteria

1. WHEN a 有効な研修セッションデータでsaveTrainingSessionが呼び出される, THE Server_Action SHALL training_sessionsテーブルに正しいレコードを挿入する
2. WHEN a saveTrainingSessionが成功する, THE Server_Action SHALL user_training_progressテーブルにstatus="completed"のレコードをupsertする
3. WHEN a 同一ユーザーが同一研修を複数回完了する, THE Server_Action SHALL 各回のtraining_sessionsレコードを個別に保存し、user_training_progressは最新の完了状態に更新する
4. WHEN a スコアが不正な値（NaN, Infinity, 負数, maxScore超過）で渡される, THE Scoring_Engine SHALL スコアを0〜maxScoreの範囲に正規化して保存する
5. IF 認証されていないユーザーがsaveTrainingSessionを呼び出した場合, THEN THE Server_Action SHALL `{ success: false, error: "Unauthorized" }`を返す

### Requirement 3: カテゴリテストの採点と結果保存

**User Story:** As a テスト実行者, I want to カテゴリテストの回答・採点・保存フローをテストする, so that saveTestResultがサーバーサイドで正しく採点し結果を保存することを検証できる。

#### Acceptance Criteria

1. WHEN a 有効な回答配列でsaveTestResultが呼び出される, THE Scoring_Engine SHALL サーバーサイドで正解データと照合して正答数を算出する
2. WHEN a 採点が完了する, THE Scoring_Engine SHALL 正答率（percentage）を`Math.round((correctCount / totalQuestions) * 100)`で算出する
3. WHEN a 採点が完了する, THE Scoring_Engine SHALL 正答率がpassing_score以上の場合にpassed=trueを設定する
4. WHEN a 採点が完了する, THE Server_Action SHALL category_test_resultsテーブルにscore, percentage, passed, correct_count, total_questionsを含むレコードを挿入する
5. WHEN a 全問正解の回答が送信される, THE Scoring_Engine SHALL percentage=100かつpassed=trueを返す
6. WHEN a 全問不正解の回答が送信される, THE Scoring_Engine SHALL percentage=0かつpassed=falseを返す
7. IF 存在しないcategoryIdでsaveTestResultが呼び出された場合, THEN THE Server_Action SHALL `{ success: false, error: "Test config not found" }`を返す

### Requirement 4: 修了テストの採点と結果保存

**User Story:** As a テスト実行者, I want to 修了テストの回答・採点・保存フローをテストする, so that saveFinalExamResultActionがサーバーサイドで正しく採点し結果を保存することを検証できる。

#### Acceptance Criteria

1. WHEN a 有効な回答配列でsaveFinalExamResultActionが呼び出される, THE Scoring_Engine SHALL サーバーサイドでfinal_exam_questionsの正解データと照合して正答数を算出する
2. WHEN a 採点が完了する, THE Scoring_Engine SHALL 正答率がfinal_exam_configのpassing_score以上の場合にpassed=trueを設定する
3. WHEN a 採点が完了する, THE Server_Action SHALL final_exam_resultsテーブルにscore, percentage, passed, correct_count, total_questions, durationを含むレコードを挿入する
4. IF 認証されていないユーザーがsaveFinalExamResultActionを呼び出した場合, THEN THE Server_Action SHALL `{ success: false, error: "Unauthorized" }`を返す

### Requirement 5: ダッシュボード進捗データの整合性検証

**User Story:** As a テスト実行者, I want to ダッシュボードの進捗データ取得をテストする, so that loadUserDataFromServerが全テーブルのデータを正しく集約して返すことを検証できる。

#### Acceptance Criteria

1. WHEN a 認証済みユーザーでloadUserDataFromServerが呼び出される, THE Server_Action SHALL そのユーザーのtraining_sessions, user_training_progress, category_test_resultsを全て返す
2. WHEN a 研修セッション保存後にloadUserDataFromServerが呼び出される, THE Server_Action SHALL 保存した研修セッションがsessions配列に含まれるデータを返す
3. WHEN a カテゴリテスト保存後にloadUserDataFromServerが呼び出される, THE Server_Action SHALL 保存したテスト結果がtests配列に含まれるデータを返す
4. WHEN a 認証されていないユーザーでloadUserDataFromServerが呼び出される, THE Server_Action SHALL 空のsessions, progress, tests配列を返す

### Requirement 6: フルフロー統合テスト

**User Story:** As a テスト実行者, I want to 認証からダッシュボード確認までの全フローを一貫してテストする, so that システム全体のデータフローが正しく機能することを検証できる。

#### Acceptance Criteria

1. WHEN a テストユーザーが研修セッションを完了し、カテゴリテストを受験し、修了テストを受験する, THE System SHALL 各ステップの結果が対応するテーブルに正しく保存される
2. WHEN a 全フローが完了した後にloadUserDataFromServerが呼び出される, THE Server_Action SHALL 全ステップの結果を含む完全な進捗データを返す
3. WHEN a テストが完了する, THE Test_Harness SHALL テストユーザーと関連する全データを完全にクリーンアップする

### Requirement 7: テストデータクリーンアップの信頼性

**User Story:** As a テスト実行者, I want to テスト後のクリーンアップが確実に行われる, so that テストデータが本番データを汚染しない。

#### Acceptance Criteria

1. THE Test_Harness SHALL テスト成功・失敗に関わらずクリーンアップ処理を実行する（afterAll/afterEachフック）
2. WHEN a クリーンアップが実行される, THE Test_Harness SHALL テストユーザーに紐づく全テーブルのレコードを削除した後にユーザー自体を削除する
3. IF クリーンアップ中にエラーが発生した場合, THEN THE Test_Harness SHALL エラーをログに記録し、残りのクリーンアップ処理を継続する
