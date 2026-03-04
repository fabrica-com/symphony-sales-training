-- ============================================================
-- マスターデータのRLSポリシー修正 + anon GRANT 削除
-- ============================================================
-- 目的:
--   1. training_categories / trainings / deep_dive_contents / session_contents /
--      category_deep_dive_contents の書き込みを admin ロールのみに制限
--   2. category_test_results / training_sessions / user_training_progress /
--      deep_dive_progress / quiz_responses / final_exam_results への
--      anon ロールの不要な権限を削除
-- ============================================================

-- ============================================================
-- 1. training_categories: 認証済み全員→ admin のみ書き換え可
-- ============================================================
DROP POLICY IF EXISTS "Allow authenticated insert on training_categories" ON training_categories;
DROP POLICY IF EXISTS "Allow authenticated update on training_categories" ON training_categories;

CREATE POLICY "Allow admin insert on training_categories"
  ON training_categories FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Allow admin update on training_categories"
  ON training_categories FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- ============================================================
-- 2. trainings: 認証済み全員 → admin のみ書き換え可
-- ============================================================
DROP POLICY IF EXISTS "Allow authenticated insert on trainings" ON trainings;
DROP POLICY IF EXISTS "Allow authenticated update on trainings" ON trainings;

CREATE POLICY "Allow admin insert on trainings"
  ON trainings FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Allow admin update on trainings"
  ON trainings FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- ============================================================
-- 3. deep_dive_contents: 認証済み全員 → admin のみ書き換え可
-- ============================================================
DROP POLICY IF EXISTS "Allow authenticated insert on deep_dive_contents" ON deep_dive_contents;
DROP POLICY IF EXISTS "Allow authenticated update on deep_dive_contents" ON deep_dive_contents;

CREATE POLICY "Allow admin insert on deep_dive_contents"
  ON deep_dive_contents FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Allow admin update on deep_dive_contents"
  ON deep_dive_contents FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- ============================================================
-- 4. session_contents: 全員 INSERT/UPDATE → admin のみ
-- ============================================================
DROP POLICY IF EXISTS "session_contents_insert_policy" ON session_contents;
DROP POLICY IF EXISTS "session_contents_update_policy" ON session_contents;

CREATE POLICY "session_contents_insert_policy"
  ON session_contents FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "session_contents_update_policy"
  ON session_contents FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- ============================================================
-- 5. category_deep_dive_contents: 認証済み全員 → admin のみ
-- ============================================================
DROP POLICY IF EXISTS "Allow authenticated insert on category_deep_dive_contents" ON category_deep_dive_contents;
DROP POLICY IF EXISTS "Allow authenticated update on category_deep_dive_contents" ON category_deep_dive_contents;

CREATE POLICY "Allow admin insert on category_deep_dive_contents"
  ON category_deep_dive_contents FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Allow admin update on category_deep_dive_contents"
  ON category_deep_dive_contents FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- ============================================================
-- 6. anon ロールから不要な書き込み権限を REVOKE
--    （Supabase の自動 GRANT で付与されていた分）
-- ============================================================

-- category_test_results
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, TRIGGER
  ON TABLE public.category_test_results FROM anon;

-- training_sessions (remote_schema 経由で付与されている場合)
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, TRIGGER
  ON TABLE public.training_sessions FROM anon;

-- user_training_progress
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, TRIGGER
  ON TABLE public.user_training_progress FROM anon;

-- deep_dive_progress
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, TRIGGER
  ON TABLE public.deep_dive_progress FROM anon;

-- quiz_responses
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, TRIGGER
  ON TABLE public.quiz_responses FROM anon;

-- final_exam_results
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, TRIGGER
  ON TABLE public.final_exam_results FROM anon;

-- master data tables: anon は SELECT のみで十分
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, TRIGGER
  ON TABLE public.training_categories FROM anon;

REVOKE INSERT, UPDATE, DELETE, TRUNCATE, TRIGGER
  ON TABLE public.trainings FROM anon;

REVOKE INSERT, UPDATE, DELETE, TRUNCATE, TRIGGER
  ON TABLE public.deep_dive_contents FROM anon;

REVOKE INSERT, UPDATE, DELETE, TRUNCATE, TRIGGER
  ON TABLE public.session_contents FROM anon;

REVOKE INSERT, UPDATE, DELETE, TRUNCATE, TRIGGER
  ON TABLE public.category_deep_dive_contents FROM anon;

REVOKE INSERT, UPDATE, DELETE, TRUNCATE, TRIGGER
  ON TABLE public.category_tests FROM anon;

REVOKE INSERT, UPDATE, DELETE, TRUNCATE, TRIGGER
  ON TABLE public.category_test_questions FROM anon;

REVOKE INSERT, UPDATE, DELETE, TRUNCATE, TRIGGER
  ON TABLE public.final_exam_config FROM anon;

REVOKE INSERT, UPDATE, DELETE, TRUNCATE, TRIGGER
  ON TABLE public.final_exam_questions FROM anon;
