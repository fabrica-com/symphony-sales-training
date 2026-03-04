-- ============================================================
-- RLS ポリシー修正
-- ============================================================

-- 1. final_exam_results: 匿名ユーザーによる任意 user_id での INSERT を禁止
--    認証済みユーザーが自分のIDでのみ INSERT できるポリシーに差し替え
DROP POLICY IF EXISTS "Allow anonymous insert for final exam results" ON final_exam_results;

-- 既存の認証済み INSERT ポリシーがあれば一旦削除して再作成
DROP POLICY IF EXISTS "Allow authenticated insert for final exam results" ON final_exam_results;

CREATE POLICY "Allow authenticated insert for final exam results"
  ON final_exam_results
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 2. final_exam_config: 認証済み全員が UPDATE できるポリシーを削除
--    管理者（role = 'admin'）のみ更新可能に変更
DROP POLICY IF EXISTS "Allow authenticated update on final_exam_config" ON final_exam_config;

CREATE POLICY "Allow admin update on final_exam_config"
  ON final_exam_config
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- 3. final_exam_questions: 同様に管理者のみ INSERT/UPDATE 可能に変更
DROP POLICY IF EXISTS "Allow authenticated insert on final_exam_questions" ON final_exam_questions;
DROP POLICY IF EXISTS "Allow authenticated update on final_exam_questions" ON final_exam_questions;

CREATE POLICY "Allow admin insert on final_exam_questions"
  ON final_exam_questions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Allow admin update on final_exam_questions"
  ON final_exam_questions
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
